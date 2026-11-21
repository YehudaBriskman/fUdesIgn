#!/usr/bin/env node
// Static UI lint over CSS, TS/TSX/JS/JSX and HTML. Regex and a small tag scanner, no AST
// dependency: each rule is cheap and mechanical, and links to the dashboard-ui pattern
// that explains it.
//
//   node scripts/lint-ui.mjs src/ [more paths] [--json] [--strict]
//
// Exit 1 when any error-severity finding remains (with --strict, warnings count too).
// Waive one line with a comment containing `design-review-ignore LU-ID` on it or the line above.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const PATTERNS = 'plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns'

/** @type {Record<string, { severity: 'error' | 'warn', rationale: string, pattern: string }>} */
export const RULES = {
  'LU-TRANSITION-ALL': {
    severity: 'warn',
    rationale: '`transition: all` animates layout and colour properties nobody chose, and makes motion slow and janky. Name the properties.',
    pattern: 'motion-principles-and-tokens.md',
  },
  'LU-GLOBAL-MOTION-RESET': {
    severity: 'error',
    rationale: 'A universal 0.01ms reset under reduced motion also kills opacity and colour feedback, and fires transitionend at once. Make movement opt-in under no-preference instead.',
    pattern: 'motion-reduced-motion.md',
  },
  'LU-OUTLINE-NONE': {
    severity: 'error',
    rationale: 'Removing the outline without a :focus-visible replacement leaves keyboard users with no focus indicator (WCAG 2.4.7).',
    pattern: 'comp-keyboard-shortcuts-focus.md',
  },
  'LU-RAW-HEX': {
    severity: 'warn',
    rationale: 'Raw hex in a component bypasses the role tokens, so it breaks dark mode and theming. Use a token (var(--…)) defined in a token file.',
    pattern: 'color-system-architecture.md',
  },
  'LU-DISABLED-BUSY': {
    severity: 'error',
    rationale: 'A busy button that becomes `disabled` drops focus and disappears from the accessibility tree. Keep it focusable with aria-disabled and aria-busy, and ignore repeat clicks.',
    pattern: 'comp-button-hierarchy.md',
  },
  'LU-SCALE-ZERO': {
    severity: 'warn',
    rationale: 'Elements that grow from scale(0) look like they appear from nowhere. Start near 0.95 with opacity, from the trigger\'s origin.',
    pattern: 'motion-micro-interactions.md',
  },
  'LU-BACKDROP-NO-FALLBACK': {
    severity: 'warn',
    rationale: 'Glass (backdrop-filter) needs an opaque fallback under prefers-reduced-transparency, or text over busy content loses contrast.',
    pattern: 'style-glass-translucency.md',
  },
  'LU-ANY-TYPE': {
    severity: 'error',
    rationale: 'The `any` type switches off checking exactly where data enters the UI. Use unknown plus a schema (Zod) or a real type.',
    pattern: 'plugins/dashboard-ui/skills/dashboard-ui-design/SKILL.md',
  },
  'LU-TOFIXED-MONEY': {
    severity: 'error',
    rationale: 'toFixed ignores locale, currency minor units, grouping and the true minus sign. Format money with Intl.NumberFormat in one formatting layer.',
    pattern: 'data-number-formatting.md',
  },
  'LU-DIV-ONCLICK': {
    severity: 'error',
    rationale: 'A clickable div or span with no role is invisible to keyboard and screen-reader users. Use a <button>, or add role, tabIndex and key handling.',
    pattern: 'comp-keyboard-shortcuts-focus.md',
  },
}

const CODE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte'])
const STYLE = new Set(['.css', '.scss', '.less'])
const MARKUP = new Set(['.html', '.htm'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', 'design-review-out'])
const TOKEN_FILE = /(^|[-_.])(tokens?|theme|themes|palette|colou?rs?|variables|vars)([-_.]|$)/i
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g

/** Repo path of the pattern file (or SKILL.md) that explains a rule. @param {string} id */
export function link(id) {
  const p = RULES[id].pattern
  return p.startsWith('plugins/') ? p : `${PATTERNS}/${p}`
}

/** @typedef {{ file: string, line: number, col: number, id: string, severity: string, message: string }} LintFinding */

/** @param {string} text @param {number} index */
function position(text, index) {
  const before = text.slice(0, index)
  const line = before.split('\n').length
  return { line, col: index - before.lastIndexOf('\n') }
}

/** Blank out comments, keeping offsets, so rules do not fire on commented code. */
function stripComments(text, kind) {
  const blank = (m) => m.replace(/[^\n]/g, ' ')
  let out = text.replace(/\/\*[\s\S]*?\*\//g, blank)
  if (kind === 'code') out = out.replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)))
  if (kind === 'markup') out = out.replace(/<!--[\s\S]*?-->/g, blank)
  return out
}

/** Find the matching close brace for the `{` at index. */
function blockEnd(text, open) {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}' && --depth === 0) return i
  }
  return text.length
}

/** Every CSS rule as { selector, body, start } (nested @media bodies are walked too). */
function cssRules(css, offset = 0) {
  const rules = []
  const re = /([^{};]+)\{/g
  let m
  while ((m = re.exec(css))) {
    const open = m.index + m[0].length - 1
    const close = blockEnd(css, open)
    const selector = m[1].trim()
    const body = css.slice(open + 1, close)
    if (selector.startsWith('@')) rules.push(...cssRules(body, offset + open + 1).map((r) => ({ ...r, media: selector })))
    else rules.push({ selector, body, start: offset + m.index + (m[1].length - m[1].trimStart().length), bodyStart: offset + open + 1 })
    re.lastIndex = close + 1
  }
  return rules
}

/** Lint CSS text. `base` is its offset in the file (for <style> blocks inside HTML). */
function lintCss(css, base, ctx) {
  const at = (i, id, message) => ctx.report(base + i, id, message)
  for (const m of css.matchAll(/transition(?:-property)?\s*:\s*all\b/g)) at(m.index, 'LU-TRANSITION-ALL', 'transition: all')
  for (const m of css.matchAll(/@media[^{]*prefers-reduced-motion\s*:\s*reduce[^{]*\{/g)) {
    const open = m.index + m[0].length - 1
    const body = css.slice(open + 1, blockEnd(css, open))
    const universal = /(^|[\s,}])\*(?:::?[a-z-]+)?\s*(?:,|\{)/.test(body)
    if (universal && /(animation|transition)(-duration)?\s*:[^;}]*\b(0?\.\d+m?s|0m?s|1ms)\b/.test(body)) at(m.index, 'LU-GLOBAL-MOTION-RESET', 'universal near-zero duration reset under prefers-reduced-motion')
  }
  const rules = cssRules(css)
  const visibleFocus = rules.filter((r) => /:focus-visible|:focus-within/.test(r.selector) && !/:not\(:focus-visible\)/.test(r.selector))
  for (const r of rules) {
    const m = /outline(?:-style)?\s*:\s*(none|0)\b/.exec(r.body)
    if (m) {
      const replaced = /box-shadow|border(-color)?\s*:|outline-offset|text-decoration/.test(r.body) || /:not\(:focus-visible\)/.test(r.selector)
      const classes = r.selector.match(/[.#][\w-]+/g) || []
      const hasVisible = visibleFocus.some((v) => classes.length === 0 || classes.some((c) => v.selector.includes(c)))
      if (!replaced && !hasVisible) at(r.start, 'LU-OUTLINE-NONE', `outline removed on "${r.selector.slice(0, 60)}" with no focus-visible replacement`)
    }
    if (/(^|,)\s*(from|0%)\s*$/.test(r.selector) && /scale\(\s*0(?:\s*,\s*0)?\s*\)|scale\s*:\s*0(?![.\d])/.test(r.body)) at(r.start, 'LU-SCALE-ZERO', 'keyframe starts at scale(0)')
    if (!ctx.tokenFile) {
      for (const d of r.body.matchAll(/(^|;)\s*([\w-]+)\s*:([^;]*)/g)) {
        if (d[2].startsWith('--')) continue
        for (const h of d[3].matchAll(HEX)) at(r.bodyStart + (d.index ?? 0) + d[0].lastIndexOf(d[3]) + (h.index ?? 0), 'LU-RAW-HEX', `${h[0]} in ${d[2]}`)
      }
    }
  }
  const backdrop = /backdrop-filter\s*:/.exec(css)
  if (backdrop && !ctx.hasReducedTransparency) at(backdrop.index, 'LU-BACKDROP-NO-FALLBACK', 'backdrop-filter with no prefers-reduced-transparency fallback')
}

/** Scan JSX/HTML opening tags, handling braces and quotes so `=>` inside handlers does not end the tag. */
function* tags(text, names) {
  const re = new RegExp(`<(${names})\\b`, 'g')
  let m
  while ((m = re.exec(text))) {
    let depth = 0
    let quote = ''
    let i = m.index + m[0].length
    for (; i < text.length; i++) {
      const c = text[i]
      if (quote) {
        if (c === quote) quote = ''
      } else if (c === '"' || c === "'" || c === '`') quote = c
      else if (c === '{') depth++
      else if (c === '}') depth--
      else if (c === '>' && depth === 0) break
    }
    yield { name: m[1], attrs: text.slice(m.index + m[0].length, i), index: m.index }
  }
}

function lintMarkupAndCode(text, ctx, kind) {
  const at = (i, id, message) => ctx.report(i, id, message)
  for (const t of tags(text, 'div|span|li|td|tr|img|section|article|p')) {
    if (/\bon[Cc]lick\s*=/.test(t.attrs) && !/\brole\s*=/.test(t.attrs)) at(t.index, 'LU-DIV-ONCLICK', `<${t.name}> with a click handler and no role`)
  }
  for (const t of tags(text, 'button|Button')) {
    const jsxBusy = /(?<![-\w])disabled\s*=\s*\{[^}]*\b(?:is)?(?:loading|pending|busy|submitting|saving|fetching|mutating)\w*/i.test(t.attrs)
    const htmlBusy = /(^|\s)disabled(\s|=|$)/.test(t.attrs) && /aria-busy\s*=\s*["']?true|class\s*=\s*["'][^"']*\b(loading|busy|is-loading|pending)\b/i.test(t.attrs)
    if (jsxBusy || htmlBusy) at(t.index, 'LU-DISABLED-BUSY', 'busy or loading button uses disabled')
  }
  if (kind === 'code') {
    for (const m of text.matchAll(/transition-all\b/g)) at(m.index, 'LU-TRANSITION-ALL', 'Tailwind transition-all')
    for (const m of text.matchAll(/transition\s*:\s*['"`]all\b/g)) at(m.index, 'LU-TRANSITION-ALL', 'inline transition: all')
    for (const m of text.matchAll(/(?:initial|from)\s*=\s*\{\{[^}]*\bscale\s*:\s*0(?![.\d])/g)) at(m.index, 'LU-SCALE-ZERO', 'enter animation starts at scale 0')
    for (const m of text.matchAll(/(?:\bfocus:)?outline-none\b/g)) {
      const line = text.slice(text.lastIndexOf('\n', m.index) + 1, text.indexOf('\n', m.index) === -1 ? text.length : text.indexOf('\n', m.index))
      if (!/focus-visible:|focus:ring|focus:outline-|focus:shadow|focus:bg-|ring-|data-\[highlighted\]|data-\[selected|aria-selected:|focus-within:/.test(line)) at(m.index, 'LU-OUTLINE-NONE', 'Tailwind outline-none with no focus-visible ring')
    }
    if (/\.(tsx?|vue|svelte)$/.test(ctx.file)) {
      for (const m of text.matchAll(/(?::\s*any\b(?!\w)|<any>|\bas\s+any\b|\bany\[\]|Array<any>|,\s*any>)/g)) at(m.index, 'LU-ANY-TYPE', 'the `any` type')
    }
    for (const m of ctx.testFile ? [] : text.matchAll(/\.toFixed\(/g)) {
      const start = text.lastIndexOf('\n', m.index) + 1
      const end = text.indexOf('\n', m.index)
      const line = text.slice(start, end === -1 ? text.length : end)
      if (/price|amount|cost|revenue|balance|fee|money|cash|salary|payment|usd|eur|gbp|currency|[$€£¥₪]/i.test(line.replace(/\$\{/g, ''))) at(m.index, 'LU-TOFIXED-MONEY', 'toFixed used to format money')
    }
    if (!ctx.tokenFile && !ctx.testFile) {
      for (const m of text.matchAll(/(['"`]\s*|:\s*|\(\s*|,\s*)(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4}))\b/g)) {
        const before = text.slice(Math.max(0, (m.index ?? 0) - 8), m.index)
        // href="#id" anchors and issue numbers such as "#108" are not colours
        if (/href\s*=?\s*$/.test(before) || /^#\d{3,4}$/.test(m[2])) continue
        at((m.index ?? 0) + m[1].length, 'LU-RAW-HEX', `${m[2]} in component code`)
      }
    }
    for (const m of text.matchAll(/\bbackdrop-blur|backdropFilter\b/g)) {
      if (!ctx.hasReducedTransparency) {
        at(m.index, 'LU-BACKDROP-NO-FALLBACK', 'backdrop blur with no prefers-reduced-transparency fallback')
        break
      }
    }
  }
  if (kind === 'markup') {
    for (const m of text.matchAll(/style\s*=\s*"([^"]*)"/g)) {
      if (/transition\s*:\s*all\b/.test(m[1])) at(m.index, 'LU-TRANSITION-ALL', 'inline transition: all')
      for (const h of m[1].matchAll(HEX)) at(m.index, 'LU-RAW-HEX', `${h[0]} in a style attribute`)
    }
    for (const m of text.matchAll(/\.toFixed\(/g)) {
      const line = text.slice(text.lastIndexOf('\n', m.index) + 1, text.indexOf('\n', m.index))
      if (/price|amount|cost|revenue|balance|fee|money|cash|usd|eur|currency|[$€£¥₪]/i.test(line.replace(/\$\{/g, ''))) at(m.index, 'LU-TOFIXED-MONEY', 'toFixed used to format money')
    }
  }
}

/** Lint one file's text. Exported for tests. @returns {LintFinding[]} */
export function lintText(file, raw) {
  const ext = extname(file).toLowerCase()
  const kind = STYLE.has(ext) ? 'style' : MARKUP.has(ext) ? 'markup' : CODE.has(ext) ? 'code' : null
  if (!kind) return []
  const text = stripComments(raw, kind === 'style' ? 'style' : kind)
  const rawLines = raw.split('\n')
  /** @type {LintFinding[]} */
  const findings = []
  const ctx = {
    file,
    tokenFile: TOKEN_FILE.test(basename(file)),
    // tests assert on literal colours and formatted strings; colour and money rules skip them
    testFile: /\.(test|spec|stories)\.[jt]sx?$|(^|\/)__tests__\//.test(file),
    hasReducedTransparency: /prefers-reduced-transparency/.test(raw),
    report(index, id, message) {
      const { line, col } = position(raw, index)
      const waived = [rawLines[line - 1], rawLines[line - 2]].some((l) => l !== undefined && new RegExp(`design-review-ignore[^\\n]*\\b${id}\\b`).test(l))
      if (!waived && !findings.some((f) => f.line === line && f.id === id)) findings.push({ file, line, col, id, severity: RULES[id].severity, message })
    },
  }
  if (kind === 'style') lintCss(text, 0, ctx)
  else {
    if (kind === 'markup') for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) lintCss(m[1], (m.index ?? 0) + m[0].indexOf(m[1]), ctx)
    lintMarkupAndCode(kind === 'markup' ? text.replace(/<style[^>]*>[\s\S]*?<\/style>/g, (s) => s.replace(/[^\n]/g, ' ')) : text, ctx, kind)
    if (kind === 'markup') {
      for (const m of text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
        const sub = { ...ctx, report: (i, id, msg) => ctx.report((m.index ?? 0) + m[0].indexOf(m[1]) + i, id, msg) }
        lintMarkupAndCode(m[1], sub, 'code')
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.col - b.col)
}

/** @param {string} p @param {string[]} out */
function walk(p, out) {
  const st = statSync(p)
  if (st.isDirectory()) {
    for (const name of readdirSync(p)) if (!SKIP_DIRS.has(name)) walk(join(p, name), out)
  } else out.push(p)
  return out
}

function main() {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const strict = args.includes('--strict')
  const paths = args.filter((a) => !a.startsWith('--'))
  if (!paths.length) {
    process.stderr.write('usage: lint-ui.mjs <path>... [--json] [--strict]\n')
    process.exitCode = 2
    return
  }
  const files = paths.flatMap((p) => walk(p, []))
  const findings = files.flatMap((f) => lintText(relative(process.cwd(), f) || f, readFileSync(f, 'utf8')))
  const errors = findings.filter((f) => f.severity === 'error').length
  const warns = findings.length - errors
  if (json) process.stdout.write(`${JSON.stringify({ files: files.length, errors, warnings: warns, rules: RULES, findings }, null, 2)}\n`)
  else {
    for (const f of findings) process.stdout.write(`${f.file}:${f.line}:${f.col}  ${f.severity.padEnd(5)}  ${f.id.padEnd(24)} ${f.message}  (${link(f.id)})\n`)
    process.stdout.write(`lint-ui: ${files.length} file(s), ${errors} error(s), ${warns} warning(s)\n`)
  }
  process.exitCode = errors || (strict && warns) ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
