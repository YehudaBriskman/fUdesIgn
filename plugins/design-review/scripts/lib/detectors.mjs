// Rendered detectors: stable ids, thresholds and fix hints, plus the functions that
// turn probe facts into findings. Every detector is "never intentional": the gate passes at zero.
import { contrast, hex, luminance, over } from './color.mjs'

export const PATTERNS = 'plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns'

/** @type {Record<string, { title: string, threshold: string, fix: string, pattern: string }>} */
export const DETECTORS = {
  'DR-CONTRAST': {
    title: 'Text contrast below WCAG AA',
    threshold: '4.5:1, or 3:1 for large text (24px+, or 18.66px+ at weight 700+)',
    fix: 'Darken or lighten the text colour role on that surface, or move the text onto a surface it was designed for.',
    pattern: 'color-contrast-rules.md',
  },
  'DR-MIXED-THEME': {
    title: 'Light and dark surfaces mixed on one page',
    threshold: 'minority theme under 20% of sampled content surface (nav, header, footer, aside excluded); and when the minority is the requested theme, under 5%',
    fix: 'Make every region read the same theme tokens (color-scheme, data-theme); do not force one panel dark or light.',
    pattern: 'color-dark-mode.md',
  },
  'DR-OVERFLOW-X': {
    title: 'Horizontal page overflow',
    threshold: 'document scrollWidth <= viewport width + 1px',
    fix: 'Let the offending row wrap, give tables their own overflow-x: auto scroller, or use minmax(0, 1fr) columns.',
    pattern: 'found-responsive-reflow.md',
  },
  'DR-TEXT-OVERLAP': {
    title: 'Text or controls overlap',
    threshold: 'text on one line never overlaps (1px+); other text boxes never overlap by 3px+ in both axes and 30%+ of the smaller box; controls never overlap by 4px+',
    fix: 'Give the row room to wrap or scroll (flex-wrap, gap, overflow-x: auto with a fade), or shorten the labels.',
    pattern: 'found-responsive-reflow.md',
  },
  'DR-TEXT-CLIPPED': {
    title: 'Text cut off by a hidden overflow',
    threshold: 'no text is cut by 2px+ by an overflow: hidden or clip box that neither scrolls nor shows an ellipsis or line clamp',
    fix: 'Let the container scroll (overflow-x: auto with a fade cue), wrap, or truncate with an ellipsis plus title.',
    pattern: 'found-responsive-reflow.md',
  },
  'DR-TARGET-SIZE': {
    title: 'Touch target too small',
    threshold: '44x44 CSS px under 600px wide, 24x24 on desktop; inline links inside sentences are exempt',
    fix: 'Grow the hit area with padding or min-block-size/min-inline-size, or a ::before overlay; keep the visual size if needed.',
    pattern: 'comp-button-hierarchy.md',
  },
  'DR-FOCUS-VISIBLE': {
    title: 'No visible focus indicator',
    threshold: 'every Tab stop changes outline, box-shadow, border, background, colour or underline on itself or its parent',
    fix: 'Add a :focus-visible ring (2px outline, offset 2px, 3:1 against the surface); never remove outline without a replacement.',
    pattern: 'comp-keyboard-shortcuts-focus.md',
  },
  'DR-TRUNCATE-NO-TITLE': {
    title: 'Text truncated with no way to read it',
    threshold: 'every ellipsis or line-clamp that actually clips has a title, aria-label or aria-describedby within 3 ancestors',
    fix: 'Add title (or a tooltip and aria-describedby) with the full text, or let the text wrap.',
    pattern: 'data-table-layout-and-typography.md',
  },
  'DR-MEDIA-ALT': {
    title: 'Image or canvas without a text alternative',
    threshold: 'img has alt; role="img" has a name; canvas 32px+ has a label, fallback content or a captioned figure (aria-hidden counts as decorative)',
    fix: 'Give charts an aria-label with the takeaway plus a data table; give images alt (empty alt for decoration).',
    pattern: 'chart-accessibility.md',
  },
  'DR-TABULAR-NUMS': {
    title: 'Numbers in table cells without tabular figures',
    threshold: 'numeric cell text uses font-variant-numeric: tabular-nums, tnum, or a monospace font',
    fix: 'Set font-variant-numeric: tabular-nums on numeric cells (or the whole table) and right-align them.',
    pattern: 'data-table-layout-and-typography.md',
  },
  'DR-REDUCED-MOTION': {
    title: 'Movement keeps running under prefers-reduced-motion: reduce',
    threshold: 'no running transform/position/size animation of 50ms+, and no element that keeps moving across two 400ms samples',
    fix: 'Wrap movement in @media (prefers-reduced-motion: no-preference), and keep opacity or colour feedback for reduce.',
    pattern: 'motion-reduced-motion.md',
  },
  'DR-CANVAS-INK': {
    title: 'Canvas chart ink fades into its background',
    threshold: 'some mark or label ink reaches 3:1 on the canvas background, and when the background is the same in both themes the 3:1 ink share differs by under 15 points',
    fix: 'Resolve chart colours from the container\'s computed tokens (getComputedStyle), and redraw when the theme changes.',
    pattern: 'chart-accessibility.md',
  },
}

/**
 * @typedef {{ id: string, route: string, theme: string, viewport: string, selector: string, message: string }} Finding
 * @typedef {{ route: string, theme: string, viewport: string, width: number }} Shot
 */

/** @param {Shot} shot @param {string} id @param {string} selector @param {string} message @returns {Finding} */
function finding(shot, id, selector, message) {
  return { id, route: shot.route, theme: shot.theme, viewport: shot.viewport, selector, message }
}

/** Text contrast against the effective background. */
export function detectContrast(shot, facts) {
  const out = []
  for (const t of facts.texts) {
    if (!t.bg || t.disabled || t.ignore.contrast || t.fg[3] === 0) continue
    // against a gradient, judge the worst colour stop
    let bg = t.bg
    let ratio = contrast(over(t.fg, bg), bg)
    for (const cand of t.bgCandidates ?? []) {
      const r = contrast(over(t.fg, cand), cand)
      if (r < ratio) {
        ratio = r
        bg = cand
      }
    }
    const fg = over(t.fg, bg)
    const large = t.fontSize >= 24 || (t.fontSize >= 18.66 && t.fontWeight >= 700)
    const need = large ? 3 : 4.5
    if (ratio + 1e-6 < need) {
      out.push(finding(shot, 'DR-CONTRAST', t.selector, `"${t.text}" ${ratio.toFixed(2)}:1 (needs ${need}:1) — ${hex(fg)} on ${hex(bg)}${t.bgCandidates ? ' (worst gradient stop)' : ''}, ${t.fontSize}px/${t.fontWeight}`))
    }
  }
  return out
}

/** Dark and light surfaces mixed: classify sampled backgrounds by luminance. */
export function detectMixedTheme(shot, facts, minority = 0.2, partialMin = 0.05) {
  const content = facts.samples.filter((s) => !s.chrome)
  /** @type {Record<string, { n: number, providers: Map<string, number> }>} */
  const cls = { dark: { n: 0, providers: new Map() }, light: { n: 0, providers: new Map() } }
  for (const s of content) {
    const L = luminance(s.colour)
    const k = L < 0.12 ? 'dark' : L > 0.45 ? 'light' : null
    if (!k) continue
    cls[k].n++
    cls[k].providers.set(s.provider, (cls[k].providers.get(s.provider) || 0) + 1)
  }
  const total = cls.dark.n + cls.light.n
  if (!total) return []
  const minor = cls.dark.n <= cls.light.n ? 'dark' : 'light'
  const major = minor === 'dark' ? 'light' : 'dark'
  const share = cls[minor].n / total
  // Partial theme following: the page was asked for one theme, part of it obeys, but most
  // of the content is forced the other way (a dark-only app with no light surface passes).
  const partial = shot.theme === minor && share >= partialMin
  if (share < minority && !partial) return []
  const top = (k) =>
    [...cls[k].providers.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([sel, n]) => `${sel} (${Math.round((100 * n) / total)}%)`)
      .join(', ')
  return [
    finding(
      shot,
      'DR-MIXED-THEME',
      top(minor).split(' (')[0],
      `${Math.round(share * 100)}% of the content surface is ${minor} while ${Math.round((1 - share) * 100)}% is ${major} (page emulated as ${shot.theme}). ${minor}: ${top(minor)}; ${major}: ${top(major)}`,
    ),
  ]
}

export function detectOverflow(shot, facts) {
  const d = facts.document
  if (d.scrollWidth <= d.clientWidth + 1) return []
  const who = facts.overflowers.slice(0, 5).map((o) => `${o.selector} (right edge ${o.right}px)`).join('; ')
  return [finding(shot, 'DR-OVERFLOW-X', facts.overflowers[0]?.selector ?? 'html', `page is ${d.scrollWidth}px wide in a ${d.clientWidth}px viewport. Widest: ${who || 'unknown'}`)]
}

export function detectOverlap(shot, facts) {
  return [
    ...facts.overlaps.map((o) => finding(shot, 'DR-TEXT-OVERLAP', o.a, `text "${o.aText}" overlaps "${o.bText}" (${o.b}) by ${o.overlap.width}x${o.overlap.height}px`)),
    ...facts.targetOverlaps.map((o) => finding(shot, 'DR-TEXT-OVERLAP', o.a, `control "${o.aText}" overlaps control "${o.bText}" (${o.b}) by ${o.overlap.width}x${o.overlap.height}px`)),
  ]
}

export function detectClipped(shot, facts) {
  return facts.texts.filter((t) => t.hardClipped && !t.ignore.clipped).map((t) => finding(shot, 'DR-TEXT-CLIPPED', t.selector, `"${t.text}" is cut off by an overflow: hidden box with no ellipsis or scroll`))
}

export function detectTargets(shot, facts) {
  const min = shot.width < 600 ? 44 : 24
  return facts.targets
    .filter((t) => !t.inline && (t.width < min || t.height < min))
    .map((t) => finding(shot, 'DR-TARGET-SIZE', t.selector, `"${t.text}" is ${t.width}x${t.height}px (needs ${min}x${min})`))
}

export function detectTruncation(shot, facts) {
  return facts.truncated.map((t) => finding(shot, 'DR-TRUNCATE-NO-TITLE', t.selector, `"${t.text}" is clipped by ${t.kind} with no title or description`))
}

export function detectMedia(shot, facts) {
  return facts.media.map((m) => finding(shot, 'DR-MEDIA-ALT', m.selector, `<${m.tag}>: ${m.problem}`))
}

export function detectTabular(shot, facts) {
  const bad = facts.texts.filter((t) => t.inCell && t.numeric && !t.tabular && !t.ignore.tabular)
  return bad.map((t) => finding(shot, 'DR-TABULAR-NUMS', t.selector, `"${t.text}" uses proportional figures`))
}

/**
 * Canvas ink: decode the canvas screenshot into a colour histogram, drop the background,
 * area fills (bins over 2% of pixels) and near-background pixels (antialiasing, gridlines,
 * under 1.5:1), then require that most of the remaining mark and label ink reaches 3:1.
 * @param {Shot} shot
 * @param {{ index: number, selector: string, bg: number[] | null }} canvas
 * @param {{ total: number, bins: { colour: number[], count: number }[] }} hist
 */
export function canvasInk(canvas, hist) {
  if (!hist.total || !hist.bins.length) return null
  const dominant = hist.bins[0]
  const bg = dominant.count >= 0.3 * hist.total ? dominant.colour : canvas.bg ? canvas.bg.slice(0, 3) : dominant.colour
  let legible = 0
  let faint = 0
  /** @type {{ colour: number[], count: number, ratio: number }[]} */
  const faintBins = []
  for (const b of hist.bins) {
    if (b.count > 0.02 * hist.total) continue
    const ratio = contrast(b.colour, bg)
    if (ratio < 1.5) continue
    if (ratio >= 3) legible += b.count
    else {
      faint += b.count
      faintBins.push({ ...b, ratio })
    }
  }
  const ink = legible + faint
  return { bg, ink, share: ink ? legible / ink : 1, faintBins: faintBins.sort((a, b) => b.count - a.count) }
}

/**
 * Absolute floor: a canvas whose strongest significant ink colour stays under 3:1
 * is effectively invisible.
 */
export function detectCanvasInk(shot, canvas, hist) {
  const r = canvasInk(canvas, hist)
  if (!r) return []
  const minCount = Math.max(20, 0.001 * hist.total)
  const strong = hist.bins.filter((b) => b.count >= minCount && b.count <= 0.02 * hist.total && contrast(b.colour, r.bg) >= 1.5)
  if (!strong.length) return []
  const best = Math.max(...strong.map((b) => contrast(b.colour, r.bg)))
  if (best >= 3) return []
  return [finding(shot, 'DR-CANVAS-INK', `${canvas.selector} [canvas ${canvas.index}]`, `no ink colour reaches 3:1 on ${hex(r.bg)}: the strongest is ${best.toFixed(2)}:1`)]
}

/**
 * Cross-theme check for the "chart reads the OS theme, not its container" bug: the same
 * canvas keeps its background across themes, yet in one theme a clearly smaller share of
 * its mark and label ink reaches 3:1. Flags the weaker theme.
 * @param {Shot} shot shot of the weaker theme
 * @param {{ index: number, selector: string, theme: string, bg: number[], share: number }} weak
 * @param {{ theme: string, bg: number[], share: number }} strong
 */
export function detectCanvasThemeDrift(shot, weak, strong, minDrop = 0.15) {
  if (contrast(weak.bg, strong.bg) >= 1.15) return []
  if (strong.share - weak.share < minDrop) return []
  return [
    finding(
      shot,
      'DR-CANVAS-INK',
      `${weak.selector} [canvas ${weak.index}]`,
      `canvas keeps its ${hex(weak.bg)} background in ${weak.theme} and ${strong.theme}, but only ${Math.round(weak.share * 100)}% of its ink reaches 3:1 in ${weak.theme} vs ${Math.round(strong.share * 100)}% in ${strong.theme}: the chart palette follows the OS theme instead of its container`,
    ),
  ]
}

/** Run every DOM-fact detector for one shot. */
export function detectAll(shot, facts) {
  return [
    ...detectContrast(shot, facts),
    ...detectMixedTheme(shot, facts),
    ...detectOverflow(shot, facts),
    ...detectOverlap(shot, facts),
    ...detectClipped(shot, facts),
    ...detectTargets(shot, facts),
    ...detectTruncation(shot, facts),
    ...detectMedia(shot, facts),
    ...detectTabular(shot, facts),
  ]
}
