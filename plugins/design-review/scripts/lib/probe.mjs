// In-page probes. Each exported function is passed to page.evaluate, so it must be
// self-contained: no imports and no references to module scope.

/**
 * Collect computed facts from the rendered page: text colours over their effective
 * background, surface samples, targets, media, truncation, overflow and text overlaps.
 * The Node side (detectors.mjs) turns these facts into findings with thresholds.
 * @param {{ maxTexts: number, sampleCols: number, sampleStep: number, maxSampleRows: number }} opts
 */
export function probePage(opts) {
  const IGNORE_ATTR = 'data-design-review-ignore'
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const startX = window.scrollX
  const startY = window.scrollY

  // ---- colour helpers -------------------------------------------------------
  const scratch = document.createElement('canvas')
  scratch.width = 1
  scratch.height = 1
  const sctx = scratch.getContext('2d', { willReadFrequently: true })
  /** @type {Map<string, number[]>} */
  const colourCache = new Map()
  /** Parse any CSS colour to [r, g, b, a] with r/g/b 0-255 and a 0-1. */
  function rgba(str) {
    const hit = colourCache.get(str)
    if (hit) return hit
    let out = [0, 0, 0, 0]
    const m = /^rgba?\(([^)]+)\)$/.exec(str)
    if (m) {
      const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat)
      out = [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
    } else if (str && str !== 'transparent' && sctx) {
      sctx.clearRect(0, 0, 1, 1)
      sctx.fillStyle = '#000'
      sctx.fillStyle = str
      sctx.fillRect(0, 0, 1, 1)
      const d = sctx.getImageData(0, 0, 1, 1).data
      out = [d[0], d[1], d[2], d[3] / 255]
    }
    colourCache.set(str, out)
    return out
  }
  /** Source-over composite of top (with alpha) on an opaque bottom. */
  function over(top, bottom) {
    const a = top[3]
    return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1]
  }
  function rootCanvas() {
    const scheme = getComputedStyle(document.documentElement).colorScheme || ''
    const dark = /dark/.test(scheme) && (!/light/.test(scheme) || matchMedia('(prefers-color-scheme: dark)').matches)
    return dark ? [18, 18, 18, 1] : [255, 255, 255, 1]
  }
  const ROOT = rootCanvas()

  /**
   * Effective background behind an element: composite ancestor backgrounds down to the
   * first opaque one. A gradient contributes each of its colour stops, so the result is a
   * list of candidate colours and contrast is judged against the worst. Unknown only when
   * an image (url) is in the way.
   * @returns {{ colour: number[] | null, candidates: number[][], provider: Element | null, reason: string }}
   */
  const STOP = /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)|#[0-9a-fA-F]{3,8}\b|\btransparent\b/g
  function effectiveBg(el) {
    /** @type {number[][][]} each layer is a list of possible colours, top layer first */
    const layers = []
    let provider = null
    let opaque = false
    let gradient = false
    for (let n = el; n && !opaque; n = n.parentElement) {
      const cs = getComputedStyle(n)
      const img = cs.backgroundImage
      if (img && img !== 'none') {
        if (/url\(/.test(img)) return { colour: null, candidates: [], provider: n, reason: 'background image' }
        const stops = (img.match(STOP) || []).map(rgba)
        if (stops.length) {
          layers.push(stops)
          gradient = true
          if (!provider) provider = n
        }
      }
      const c = rgba(cs.backgroundColor)
      if (c[3] > 0) {
        layers.push([c])
        if (!provider) provider = n
        if (c[3] >= 0.999) {
          provider = n
          opaque = true
        }
      }
    }
    let candidates = [ROOT]
    for (let i = layers.length - 1; i >= 0; i--) {
      const next = []
      for (const base of candidates) for (const top of layers[i]) next.push(top[3] >= 0.999 ? top : over(top, base))
      const seen = new Set()
      candidates = next.filter((c) => {
        const k = c.slice(0, 3).map(Math.round).join(',')
        if (seen.has(k)) return false
        seen.add(k)
        return true
      }).slice(0, 12)
    }
    return {
      colour: candidates[0],
      candidates,
      provider: provider || document.documentElement,
      reason: gradient ? 'gradient: worst stop used' : opaque ? '' : 'root canvas',
    }
  }

  // ---- element helpers ------------------------------------------------------
  function selector(el) {
    const parts = []
    for (let n = el, depth = 0; n && n.nodeType === 1 && depth < 4; n = n.parentElement, depth++) {
      let s = n.localName
      if (n.id) {
        parts.unshift(`${s}#${CSS.escape(n.id)}`)
        break
      }
      const cls = [...n.classList].filter((c) => /^[a-zA-Z][\w-]{0,30}$/.test(c)).slice(0, 2)
      if (cls.length) s += `.${cls.join('.')}`
      const parent = n.parentElement
      if (parent) {
        const same = [...parent.children].filter((c) => c.localName === n.localName)
        if (same.length > 1) s += `:nth-of-type(${same.indexOf(n) + 1})`
      }
      parts.unshift(s)
    }
    return parts.join(' > ')
  }
  function ignored(el, id) {
    for (let n = el; n; n = n.parentElement) {
      const v = n.getAttribute && n.getAttribute(IGNORE_ATTR)
      if (v !== null && v !== undefined && (v === '' || v === 'all' || v.split(/[\s,]+/).includes(id))) return true
    }
    return false
  }
  function cumulativeOpacity(el) {
    let o = 1
    for (let n = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || '1')
    return o
  }
  /**
   * Clip a rect (page coordinates) by the element itself and every ancestor that clips
   * overflow. `hard` is set when a non-scrolling clip (hidden or clip, without an
   * ellipsis or line clamp) cut the text: content the user cannot reach at all.
   */
  function clipRect(el, r) {
    let { left, top, right, bottom } = r
    let hard = false
    for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        const b = n.getBoundingClientRect()
        const ox = window.scrollX
        const oy = window.scrollY
        const before = [left, top, right, bottom]
        if (cs.overflowX !== 'visible') {
          left = Math.max(left, b.left + ox)
          right = Math.min(right, b.right + ox)
        }
        if (cs.overflowY !== 'visible') {
          top = Math.max(top, b.top + oy)
          bottom = Math.min(bottom, b.bottom + oy)
        }
        const cut = left - before[0] > 2 || before[2] - right > 2 || top - before[1] > 2 || before[3] - bottom > 2
        const scrolls = /auto|scroll/.test(cs.overflowX + cs.overflowY)
        const marked = cs.textOverflow === 'ellipsis' || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none')
        if (cut && !scrolls && !marked) hard = true
      }
      if (cs.position === 'fixed') break
    }
    return { left, top, right, bottom, hard }
  }
  function visible(el) {
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false
    const r = el.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  }
  const pageRect = (r) => ({ left: r.left + window.scrollX, top: r.top + window.scrollY, right: r.right + window.scrollX, bottom: r.bottom + window.scrollY })
  const area = (r) => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top)
  const round = (n) => Math.round(n * 10) / 10

  // ---- texts ---------------------------------------------------------------
  const SKIP = new Set(['script', 'style', 'noscript', 'template', 'title', 'head', 'option'])
  /** @type {Map<Element, { rects: object[], text: string }>} */
  const byParent = new Map()
  const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const s = t.textContent || ''
    if (!s.trim()) continue
    const parent = t.parentElement
    if (!parent || SKIP.has(parent.localName)) continue
    if (byParent.size >= opts.maxTexts && !byParent.has(parent)) break
    range.selectNodeContents(t)
    const rects = [...range.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5).map(pageRect)
    if (!rects.length) continue
    const entry = byParent.get(parent) || { rects: [], text: '' }
    entry.rects.push(...rects)
    entry.text += s
    byParent.set(parent, entry)
  }
  const CELL = 'td, th, [role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'
  const NUMERIC = /^[\s(+\-−–]*[$€£¥₪]?\s*[+\-−–]?\d[\d,.\s  ]*(?:[%‰]|[kKMBT]|bn|pp|x|×)?\)?$/
  const texts = []
  const textBoxes = []
  for (const [el, entry] of byParent) {
    if (!visible(el)) continue
    const cs = getComputedStyle(el)
    const op = cumulativeOpacity(el)
    if (op < 0.05) continue
    const clippedAll = entry.rects.map((r) => clipRect(el, r))
    const clipped = clippedAll.filter((r) => r.right - r.left > 1 && r.bottom - r.top > 1)
    if (!clipped.length) continue
    const hardClipped = clipped.some((r) => r.hard)
    // screen-reader-only text: clipped to a pixel or two
    if (clipped.every((r) => r.right - r.left <= 2 || r.bottom - r.top <= 2)) continue
    const inSvg = !!el.closest('svg')
    // nearest fixed or sticky ancestor: text is compared only with text in the same layer
    let layer = null
    for (let n = el; n && !layer; n = n.parentElement) if (['fixed', 'sticky'].includes(getComputedStyle(n).position)) layer = n
    const fg = rgba(cs.color)
    const bg = inSvg ? { colour: null, candidates: [], provider: null, reason: 'svg text' } : effectiveBg(el)
    const text = entry.text.replace(/\s+/g, ' ').trim()
    const cell = el.closest(CELL)
    const numeric = NUMERIC.test(text) && /\d/.test(text)
    const box = clipped.reduce((a, r) => ({
      left: Math.min(a.left, r.left), top: Math.min(a.top, r.top), right: Math.max(a.right, r.right), bottom: Math.max(a.bottom, r.bottom),
    }))
    const idx = texts.length
    texts.push({
      selector: selector(el),
      text: text.slice(0, 60),
      fg: [fg[0], fg[1], fg[2], Math.round(fg[3] * op * 1000) / 1000],
      bg: bg.colour,
      bgCandidates: bg.candidates.length > 1 ? bg.candidates : undefined,
      bgReason: bg.reason,
      bgProvider: bg.provider ? selector(bg.provider) : null,
      fontSize: parseFloat(cs.fontSize),
      fontWeight: parseFloat(cs.fontWeight) || 400,
      disabled: !!el.closest(':disabled, [aria-disabled="true"]'),
      inCell: !!cell,
      numeric,
      hardClipped,
      tabular: /tabular-nums/.test(cs.fontVariantNumeric) || /tnum/.test(cs.fontFeatureSettings) || /mono|courier|consolas|menlo/i.test(cs.fontFamily),
      box: { left: round(box.left), top: round(box.top), width: round(box.right - box.left), height: round(box.bottom - box.top) },
      ignore: {
        contrast: ignored(el, 'DR-CONTRAST'),
        tabular: ignored(el, 'DR-TABULAR-NUMS'),
        overlap: ignored(el, 'DR-TEXT-OVERLAP'),
        clipped: ignored(el, 'DR-TEXT-CLIPPED'),
      },
    })
    // fixed and sticky layers cover content by design, so overlap is judged within one layer
    for (const r of clipped) textBoxes.push({ idx, el, r, layer })
  }

  // ---- text overlaps (sweep by top edge) ----------------------------------
  const overlaps = []
  textBoxes.sort((a, b) => a.r.top - b.r.top)
  const seenPairs = new Set()
  for (let i = 0; i < textBoxes.length && overlaps.length < 200; i++) {
    const a = textBoxes[i]
    for (let j = i + 1; j < textBoxes.length; j++) {
      const b = textBoxes[j]
      if (b.r.top >= a.r.bottom) break
      if (a.idx === b.idx || a.layer !== b.layer || a.el.contains(b.el) || b.el.contains(a.el)) continue
      const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
      const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
      if (ix <= 0 || iy <= 0) continue
      // Same line (heights mostly shared): any 1px+ horizontal overlap is a collision, as in
      // two tab labels running together. Otherwise require a clear overlap, so tight
      // line-height inside one paragraph does not count.
      const sameLine = iy >= 0.6 * Math.min(a.r.bottom - a.r.top, b.r.bottom - b.r.top)
      if (sameLine ? ix < 1 : ix < 3 || iy < 3 || ix * iy < 0.3 * Math.min(area(a.r), area(b.r))) continue
      const key = a.idx < b.idx ? `${a.idx}:${b.idx}` : `${b.idx}:${a.idx}`
      if (seenPairs.has(key)) continue
      // Only a collision when nothing opaque sits on top of both at the overlap centre.
      const cx = (Math.max(a.r.left, b.r.left) + Math.min(a.r.right, b.r.right)) / 2
      const cy = (Math.max(a.r.top, b.r.top) + Math.min(a.r.bottom, b.r.bottom)) / 2
      window.scrollTo(startX, Math.max(0, cy - vh / 2))
      const hit = document.elementFromPoint(cx - window.scrollX, cy - window.scrollY)
      const related = (x) => x && hit && (x === hit || x.contains(hit) || hit.contains(x))
      if (!related(a.el) && !related(b.el)) continue
      if (texts[a.idx].ignore.overlap || texts[b.idx].ignore.overlap) continue
      seenPairs.add(key)
      overlaps.push({ a: texts[a.idx].selector, aText: texts[a.idx].text, b: texts[b.idx].selector, bText: texts[b.idx].text, overlap: { width: round(ix), height: round(iy) } })
    }
  }
  window.scrollTo(startX, startY)

  // ---- surfaces: grid samples of the painted background --------------------
  const CHROME = 'nav, aside, header, footer, [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], dialog'
  const docH = Math.max(document.documentElement.scrollHeight, vh)
  const rows = Math.min(opts.maxSampleRows, Math.ceil(docH / opts.sampleStep))
  const samples = []
  for (let r = 0; r < rows; r++) {
    const y = Math.min(docH - 1, Math.round((r + 0.5) * (docH / rows)))
    window.scrollTo(startX, Math.max(0, y - vh / 2))
    for (let c = 0; c < opts.sampleCols; c++) {
      const x = Math.round((c + 0.5) * (vw / opts.sampleCols))
      const hit = document.elementFromPoint(x, y - window.scrollY)
      if (!hit) continue
      if (['img', 'video', 'picture', 'iframe'].includes(hit.localName)) continue
      if (ignored(hit, 'DR-MIXED-THEME')) continue
      const bg = effectiveBg(hit)
      if (!bg.colour) continue
      samples.push({ x, y, colour: bg.colour.slice(0, 3), provider: bg.provider ? selector(bg.provider) : 'html', chrome: !!hit.closest(CHROME) })
    }
  }
  window.scrollTo(startX, startY)

  // ---- interactive targets ---------------------------------------------------
  const TARGET = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="option"], [tabindex]:not([tabindex="-1"])'
  const targets = []
  const targetEls = []
  for (const el of document.querySelectorAll(TARGET)) {
    if (!visible(el) || cumulativeOpacity(el) < 0.05 || ignored(el, 'DR-TARGET-SIZE')) continue
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    // WCAG 2.5.8 inline exception: a link inside a run of sentence text.
    let inline = false
    if (cs.display === 'inline' && el.parentElement) {
      const own = (el.textContent || '').trim().length
      const around = (el.parentElement.textContent || '').trim().length
      inline = around - own >= 12
    }
    targetEls.push(el)
    targets.push({ selector: selector(el), text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40), width: round(r.width), height: round(r.height), inline })
  }

  // controls whose boxes overlap (not nested): two buttons or tabs drawn on top of each other
  const targetOverlaps = []
  const layerOf = (el) => {
    for (let n = el; n; n = n.parentElement) if (['fixed', 'sticky'].includes(getComputedStyle(n).position)) return n
    return null
  }
  // inline links wrap across lines, so their bounding boxes overlap neighbours without touching them
  const tboxes = targets
    .map((t, i) => ({ t, el: targetEls[i], layer: layerOf(targetEls[i]), r: pageRect(targetEls[i].getBoundingClientRect()) }))
    .filter((b) => getComputedStyle(b.el).display !== 'inline')
    .sort((a, b) => a.r.top - b.r.top)
  for (let i = 0; i < tboxes.length && targetOverlaps.length < 100; i++) {
    for (let j = i + 1; j < tboxes.length; j++) {
      const a = tboxes[i]
      const b = tboxes[j]
      if (b.r.top >= a.r.bottom) break
      if (a.layer !== b.layer || a.el.contains(b.el) || b.el.contains(a.el) || ignored(a.el, 'DR-TEXT-OVERLAP') || ignored(b.el, 'DR-TEXT-OVERLAP')) continue
      const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
      const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
      if (ix >= 4 && iy >= 4) targetOverlaps.push({ a: a.t.selector, aText: a.t.text, b: b.t.selector, bText: b.t.text, overlap: { width: round(ix), height: round(iy) } })
    }
  }

  // ---- media alternatives ----------------------------------------------------
  const media = []
  const named = (el) => !!((el.getAttribute('aria-label') || '').trim() || el.getAttribute('aria-labelledby') || (el.getAttribute('title') || '').trim())
  const hidden = (el) => !!el.closest('[aria-hidden="true"]') || ['presentation', 'none'].includes(el.getAttribute('role') || '')
  for (const el of document.querySelectorAll('img, canvas, svg[role="img"], [role="img"]:not(svg), input[type="image"]')) {
    if (!visible(el) || hidden(el) || ignored(el, 'DR-MEDIA-ALT')) continue
    let problem = ''
    if (el.localName === 'img' || el.localName === 'input') {
      if (!el.hasAttribute('alt') && !named(el)) problem = 'no alt attribute'
    } else if (el.localName === 'canvas') {
      const r = el.getBoundingClientRect()
      if (r.width < 32 || r.height < 32) continue
      const fallback = (el.textContent || '').trim().length > 0
      const fig = el.closest('figure')
      const figNamed = !!fig && (named(fig) || !!fig.querySelector('figcaption'))
      if (!named(el) && !el.getAttribute('aria-describedby') && !fallback && !figNamed) problem = 'canvas without a label, fallback content or figure caption'
    } else if (!named(el)) {
      problem = 'role="img" without an accessible name'
    }
    if (problem) media.push({ selector: selector(el), tag: el.localName, problem })
  }

  // ---- truncation ---------------------------------------------------------------
  const truncated = []
  for (const el of document.querySelectorAll('body *')) {
    if (truncated.length >= 100) break
    const cs = getComputedStyle(el)
    const ellipsis = cs.textOverflow === 'ellipsis' && cs.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1
    const clamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1
    if (!ellipsis && !clamp) continue
    if (!visible(el) || ignored(el, 'DR-TRUNCATE-NO-TITLE')) continue
    let titled = false
    for (let n = el, d = 0; n && d < 4; n = n.parentElement, d++) {
      if ((n.getAttribute('title') || '').trim() || (n.getAttribute('aria-label') || '').trim() || n.getAttribute('aria-describedby')) titled = true
    }
    if (!titled) truncated.push({ selector: selector(el), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), kind: ellipsis ? 'ellipsis' : 'line-clamp' })
  }

  // ---- horizontal overflow --------------------------------------------------
  const se = document.scrollingElement || document.documentElement
  const overflowers = []
  if (se.scrollWidth > se.clientWidth + 1) {
    for (const el of document.querySelectorAll('body *')) {
      if (overflowers.length >= 15) break
      const r = el.getBoundingClientRect()
      if (r.right <= vw + 1 || r.width === 0 || !visible(el) || ignored(el, 'DR-OVERFLOW-X')) continue
      // inside a horizontal scroller is fine; only report the outermost offender
      let scoped = false
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const ox = getComputedStyle(n).overflowX
        if (ox !== 'visible' && n.getBoundingClientRect().right <= vw + 1) scoped = true
      }
      if (scoped) continue
      if (overflowers.some((o) => o.el.contains(el))) continue
      overflowers.push({ el, selector: selector(el), right: round(r.right + window.scrollX) })
    }
  }

  // ---- canvases (for the ink-contrast check done from a screenshot) --------
  const canvases = []
  document.querySelectorAll('canvas').forEach((el, i) => {
    const r = el.getBoundingClientRect()
    if (!visible(el) || r.width < 80 || r.height < 40 || ignored(el, 'DR-CANVAS-INK')) return
    el.setAttribute('data-dr-canvas', String(i))
    const bg = effectiveBg(el)
    canvases.push({ index: i, selector: selector(el), box: { left: round(r.left + window.scrollX), top: round(r.top + window.scrollY), width: round(r.width), height: round(r.height) }, bg: bg.colour })
  })

  return {
    url: location.href,
    title: document.title,
    viewport: { width: vw, height: vh },
    document: { scrollWidth: se.scrollWidth, clientWidth: se.clientWidth, scrollHeight: se.scrollHeight },
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
    prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
    texts,
    overlaps,
    targetOverlaps,
    samples,
    targets,
    media,
    truncated,
    overflowers: overflowers.map(({ selector: s, right }) => ({ selector: s, right })),
    canvases,
  }
}

/**
 * Record the resting focus-related styles of every focusable element (and its parent)
 * before any keyboard interaction, tagging each with data-dr-focus-idx.
 */
export function snapshotFocusBase() {
  const FOCUSABLE = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, [tabindex], [contenteditable="true"]'
  const pick = (el) => {
    const cs = getComputedStyle(el)
    return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderTopColor, cs.borderBottomColor, cs.backgroundColor, cs.color, cs.textDecorationLine].join('|')
  }
  const base = []
  document.querySelectorAll(FOCUSABLE).forEach((el, i) => {
    el.setAttribute('data-dr-focus-idx', String(i))
    base.push({ self: pick(el), parent: el.parentElement ? pick(el.parentElement) : '' })
  })
  return base
}

/** Describe the focused element and whether any focus-related style differs from its resting state. */
export function inspectFocused(base) {
  const el = document.activeElement
  if (!el || el === document.body || el === document.documentElement) return null
  const pick = (n) => {
    const cs = getComputedStyle(n)
    return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderTopColor, cs.borderBottomColor, cs.backgroundColor, cs.color, cs.textDecorationLine].join('|')
  }
  const idx = Number(el.getAttribute('data-dr-focus-idx'))
  const cs = getComputedStyle(el)
  const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && !/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(cs.outlineColor)
  let changed = outline
  if (!changed && Number.isFinite(idx) && base[idx]) {
    changed = pick(el) !== base[idx].self || (!!el.parentElement && pick(el.parentElement) !== base[idx].parent)
  }
  let ignoredHere = false
  for (let n = el; n; n = n.parentElement) {
    const v = n.getAttribute && n.getAttribute('data-design-review-ignore')
    if (v !== null && v !== undefined && (v === '' || v === 'all' || v.split(/[\s,]+/).includes('DR-FOCUS-VISIBLE'))) ignoredHere = true
  }
  let path = el.localName
  if (el.id) path += `#${el.id}`
  else if (el.classList.length) path += `.${[...el.classList].slice(0, 2).join('.')}`
  if (el.parentElement) path = `${el.parentElement.localName}${el.parentElement.id ? `#${el.parentElement.id}` : ''} > ${path}`
  return {
    key: `${path}@${Number.isFinite(idx) ? idx : 'x'}`,
    selector: path,
    text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    visibleChange: changed,
    ignored: ignoredHere,
  }
}

/** Running movement animations, from the Web Animations API (CSS animations, transitions and WAAPI). */
export function runningMotion() {
  const MOVE = /^(transform|translate|scale|rotate|left|top|right|bottom|margin|inset|width|height|offset|backgroundPosition|background-position)/
  const out = []
  for (const anim of document.getAnimations()) {
    if (anim.playState !== 'running') continue
    const effect = anim.effect
    if (!effect || typeof effect.getKeyframes !== 'function') continue
    const timing = effect.getComputedTiming()
    const duration = typeof timing.duration === 'number' ? timing.duration : 0
    if (duration < 50) continue
    const props = new Set()
    for (const kf of effect.getKeyframes()) for (const k of Object.keys(kf)) if (!['offset', 'computedOffset', 'easing', 'composite'].includes(k)) props.add(k)
    const moving = [...props].filter((p) => MOVE.test(p))
    if (!moving.length) continue
    const target = effect.target
    let ignoredHere = false
    for (let n = target; n; n = n.parentElement) {
      const v = n.getAttribute && n.getAttribute('data-design-review-ignore')
      if (v !== null && v !== undefined && (v === '' || v === 'all' || v.split(/[\s,]+/).includes('DR-REDUCED-MOTION'))) ignoredHere = true
    }
    if (ignoredHere) continue
    let sel = target ? target.localName : '(none)'
    if (target && target.id) sel += `#${target.id}`
    else if (target && target.classList.length) sel += `.${[...target.classList].slice(0, 2).join('.')}`
    out.push({
      selector: sel,
      name: anim.animationName || anim.transitionProperty || anim.id || anim.constructor.name,
      properties: moving,
      duration: Math.round(duration),
      infinite: timing.iterations === Infinity,
    })
  }
  return out
}

/** Positions of visible elements, used to spot movement that the Web Animations API does not see (rAF loops). */
export function positions() {
  const out = {}
  let i = 0
  for (const el of document.querySelectorAll('body *')) {
    if (i++ > 3000) break
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    if (!el.hasAttribute('data-dr-pos')) el.setAttribute('data-dr-pos', String(i))
    out[el.getAttribute('data-dr-pos')] = [Math.round(r.left + window.scrollX), Math.round(r.top + window.scrollY)]
  }
  return out
}

/** Describe an element tagged by positions(). */
export function describePos(ids) {
  return ids.map((id) => {
    const el = document.querySelector(`[data-dr-pos="${id}"]`)
    if (!el) return `#${id}`
    let ignoredHere = false
    for (let n = el; n; n = n.parentElement) {
      const v = n.getAttribute && n.getAttribute('data-design-review-ignore')
      if (v !== null && v !== undefined && (v === '' || v === 'all' || v.split(/[\s,]+/).includes('DR-REDUCED-MOTION'))) ignoredHere = true
    }
    if (ignoredHere) return null
    let s = el.localName
    if (el.id) s += `#${el.id}`
    else if (el.classList.length) s += `.${[...el.classList].slice(0, 2).join('.')}`
    return s
  })
}

/**
 * Decode a PNG (as base64) in the page and return a colour histogram of its pixels,
 * quantised to 4 bits per channel. Used for canvas ink contrast.
 */
export async function histogram(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
  const c = document.createElement('canvas')
  c.width = bmp.width
  c.height = bmp.height
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { total: 0, bins: [] }
  ctx.drawImage(bmp, 0, 0)
  const d = ctx.getImageData(0, 0, c.width, c.height).data
  const counts = new Map()
  const sums = new Map()
  for (let i = 0; i < d.length; i += 4) {
    const key = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4)
    counts.set(key, (counts.get(key) || 0) + 1)
    const s = sums.get(key) || [0, 0, 0]
    s[0] += d[i]
    s[1] += d[i + 1]
    s[2] += d[i + 2]
    sums.set(key, s)
  }
  const bins = [...counts.entries()].map(([k, n]) => {
    const s = sums.get(k)
    return { colour: [Math.round(s[0] / n), Math.round(s[1] / n), Math.round(s[2] / n)], count: n }
  })
  bins.sort((a, b) => b.count - a.count)
  return { total: d.length / 4, bins: bins.slice(0, 512) }
}
