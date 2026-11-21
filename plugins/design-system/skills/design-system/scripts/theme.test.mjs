// Tests for theme.mjs. Run: node --test plugins/design-system/skills/design-system/scripts/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import {
  apcaFromSrgb, wcagRatio, hexToOklch, oklchToHex, inGamut, fitGamut, quantize, generate, ThemeError,
  toCss, toTailwind, toShadcn, toDtcg, toDesignMd, radii, NEEDS, main,
} from './theme.mjs'

const HERE = new URL('.', import.meta.url).pathname
const SCRIPT = join(HERE, 'theme.mjs')
const TOKENS_CSS = join(HERE, '../../../../dashboard-ui/skills/dashboard-ui-design/assets/tokens.css')
const srgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const run = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' })
const names = (css) => new Set([...css.matchAll(/--([a-z0-9-]+)\s*:/g)].map((m) => m[1]))

test('APCA matches the APCA-W3 0.0.98G reference values', () => {
  assert.equal(apcaFromSrgb(srgb('888888'), srgb('ffffff')).toFixed(3), '63.056')
  assert.equal(apcaFromSrgb(srgb('ffffff'), srgb('888888')).toFixed(3), '-68.541')
  assert.equal(apcaFromSrgb(srgb('000000'), srgb('aaaaaa')).toFixed(3), '58.146')
  assert.equal(apcaFromSrgb(srgb('aaaaaa'), srgb('000000')).toFixed(3), '-56.241')
  assert.equal(apcaFromSrgb(srgb('000000'), srgb('ffffff')).toFixed(2), '106.04')
})

test('WCAG 2 ratios and hex round trips', () => {
  assert.equal(wcagRatio(hexToOklch('#000'), hexToOklch('#fff')).toFixed(2), '21.00')
  assert.equal(wcagRatio(hexToOklch('#777777'), hexToOklch('#ffffff')).toFixed(2), '4.48')
  for (const hex of ['#325ac2', '#ffffff', '#000000', '#f5d90a', '#141b24']) assert.equal(oklchToHex(hexToOklch(hex)), hex)
})

test('gamut mapping keeps L and h and lands in sRGB, also after rounding', () => {
  const wild = { l: 0.7, c: 0.35, h: 145 }
  assert.equal(inGamut(wild), false)
  const fit = fitGamut(wild)
  assert.ok(inGamut(fit) && fit.l === 0.7 && fit.h === 145 && fit.c < 0.35)
  for (let h = 0; h < 360; h += 15) for (const l of [0.2, 0.5, 0.8, 0.97]) assert.ok(inGamut(quantize(fitGamut({ l, c: 0.4, h }))))
})

test('default theme: every pair passes WCAG 2 and APCA, every colour in gamut', () => {
  const g = generate()
  assert.ok(g.results.length > 250)
  for (const r of g.results) {
    assert.ok(r.pass, `${r.theme} ${r.fg} on ${r.bg}: ${r.ratio} / Lc ${r.lc}`)
    assert.ok(r.ratio >= NEEDS[r.need].wcag && Math.abs(r.lc) >= NEEDS[r.need].apca)
  }
  for (const t of Object.values(g.themes)) for (const [n, v] of Object.entries(t.roles)) assert.ok(inGamut(v), `${t.label} ${n}`)
  assert.deepEqual(Object.keys(g.themes), ['light', 'dark', 'light-hc', 'dark-hc'])
})

test('light seeds reproduce dashboard-ui tokens.css values', () => {
  const css = toCss(generate())
  const light = css.slice(css.indexOf(':root {'), css.indexOf('@media (prefers-color-scheme: dark)'))
  for (const [n, v] of [['surface', 'oklch(1 0 0)'], ['text', 'oklch(0.22 0.02 250)'], ['text-muted', 'oklch(0.5 0.016 250)'],
    ['accent', 'oklch(0.5 0.17 265)'], ['border-strong', 'oklch(0.6 0.012 250)'], ['danger-fg', 'oklch(0.53 0.19 27)']])
    assert.ok(light.includes(`--${n}: ${v};`), `${n} should be ${v}`)
})

test('role names: every custom property in dashboard-ui tokens.css is emitted', { skip: !existsSync(TOKENS_CSS) }, () => {
  const want = names(readFileSync(TOKENS_CSS, 'utf8'))
  const got = names(toCss(generate()))
  const missing = [...want].filter((n) => !got.has(n))
  assert.deepEqual(missing, [])
})

test('the contrast extremes and odd accents still pass, with reported adjustments', () => {
  for (const input of [{ contrast: 0 }, { contrast: 100 }, { accent: '#f5d90a' }, { accent: 145, hue: 30, tint: 3 }, { tint: 0, accent: 'oklch(0.9 0.3 330)' }]) {
    const g = generate(input)
    assert.ok(g.results.every((r) => r.pass), JSON.stringify(input))
  }
  const low = generate({ contrast: 0 })
  assert.ok(low.adjustments.some((a) => a.theme === 'light' && a.role === 'text-muted'), 'low contrast must darken light text-muted')
})

test('higher contrast pulls text further from the surface', () => {
  const lo = generate({ contrast: 20 }).results.find((r) => r.theme === 'light' && r.fg === 'text-muted' && r.bg === 'surface')
  const hi = generate({ contrast: 90 }).results.find((r) => r.theme === 'light' && r.fg === 'text-muted' && r.bg === 'surface')
  assert.ok(hi.ratio > lo.ratio)
})

test('a locked accent that cannot pass fails loudly and names the pairs', () => {
  assert.throws(() => generate({ accent: '#f5d90a', lockAccent: true }), (e) => e instanceof ThemeError && e.problems.some((p) => p.includes('accent on surface')))
  const r = run(['--accent', '#f5d90a', '--lock-accent'])
  assert.equal(r.status, 1)
  assert.match(r.stderr, /FAILED/)
  assert.match(r.stderr, /light: accent on surface is/)
})

test('bad input is rejected with every problem listed (exit 2)', () => {
  assert.throws(() => generate({ contrast: 150, density: 'huge', colour: 1 }), (e) => e.problems.length === 3)
  const r = run(['--contrast', 'x', '--accent', 'blue'])
  assert.equal(r.status, 2)
  assert.match(r.stderr, /contrast must be a number/)
  assert.match(r.stderr, /cannot parse "blue"/)
  assert.equal(run(['--format', 'nope']).status, 2)
})

test('CSS output: themes, high contrast, density and money blocks', () => {
  const css = toCss(generate({ density: 'compact', radius: 10 }))
  for (const s of [':root {', '@media (prefers-color-scheme: dark)', ':root:not([data-theme="light"])', ':root[data-theme="dark"] {',
    '@media (prefers-contrast: more)', ':root[data-density="comfortable"]', ':root[data-density="spacious"]', ':root[data-money="cvd"]',
    '--row-h: 32px;', '--radius-md: 10px;', '--radius-lg: 15px;'])
    assert.ok(css.includes(s), s)
  assert.equal((css.match(/{/g) ?? []).length, (css.match(/}/g) ?? []).length)
  assert.ok(!toCss(generate({ highContrast: false })).includes('prefers-contrast'))
})

test('CSS parses with lightningcss when it is available', (t) => {
  let lightning
  try { lightning = createRequire(resolve(process.env.NODE_PATH ?? HERE, 'x.js'))('lightningcss') } catch { return t.skip('lightningcss not installed') }
  lightning.transform({ filename: 'tokens.css', code: Buffer.from(toCss(generate())), errorRecovery: false })
})

test('Tailwind v4 output maps every colour role and avoids self-references', () => {
  const tw = toTailwind(generate())
  assert.match(tw, /@theme inline \{/)
  for (const n of ['canvas', 'surface', 'text', 'accent', 'on-accent', 'danger-fg', 'cat-7', 'positive'])
    assert.ok(tw.includes(`--color-${n}: var(--${n});`), n)
  assert.ok(!/--(radius-\w+|font-sans|shadow-\w+): var\(--\1\)/.test(tw))
  assert.match(tw, /--spacing: 4px;/)
})

test('shadcn output: light and .dark with resolved values that pass', () => {
  const g = generate()
  const css = toShadcn(g)
  assert.match(css, /^:root \{/m)
  assert.match(css, /^\.dark \{/m)
  for (const n of ['background', 'foreground', 'primary', 'primary-foreground', 'muted-foreground', 'destructive', 'ring', 'chart-5', 'sidebar-ring'])
    assert.ok(css.includes(`--${n}: oklch(`), n)
  // the shadcn pairs that matter are verified role pairs
  const v = (sel, n) => new RegExp(`${sel} \\{[^}]*--${n}: (oklch\\([^)]*\\))`).exec(css)[1]
  const parse = (s) => { const [l, c, h] = s.slice(6, -1).split(' ').map(Number); return { l, c, h } }
  for (const sel of [':root', '\\.dark']) {
    assert.ok(wcagRatio(parse(v(sel, 'primary-foreground')), parse(v(sel, 'primary'))) >= 4.5)
    assert.ok(wcagRatio(parse(v(sel, 'destructive-foreground')), parse(v(sel, 'destructive'))) >= 4.5)
    assert.ok(wcagRatio(parse(v(sel, 'muted-foreground')), parse(v(sel, 'muted'))) >= 4.5)
  }
})

test('DTCG output uses 2025.10 colour objects and resolvable aliases', () => {
  const j = toDtcg(generate())
  const text = j.color.light.text
  assert.equal(text.$type, 'color')
  assert.equal(text.$value.colorSpace, 'oklch')
  assert.match(text.$value.hex, /^#[0-9a-f]{6}$/)
  for (const [mode, group] of Object.entries(j.color))
    for (const [n, tok] of Object.entries(group))
      if (typeof tok.$value === 'string') {
        const [, m, target] = /^\{color\.([\w-]+)\.([\w-]+)\}$/.exec(tok.$value)
        assert.ok(j.color[m][target], `${mode}.${n} -> ${tok.$value}`)
      }
  assert.deepEqual(j.radius.md.$value, { value: 8, unit: 'px' })
  assert.deepEqual(j.easing.standard.$value, [0.2, 0, 0.38, 0.9])
})

test('DESIGN.md front matter has light and dark groups and a primary colour', () => {
  const fm = toDesignMd(generate())
  assert.match(fm, /^---\nversion: alpha\n/)
  assert.match(fm, /\n {2}primary: "oklch\(/)
  assert.match(fm, /\n {2}light:\n {4}canvas:/)
  assert.match(fm, /\n {2}dark:\n {4}canvas:/)
  assert.match(fm, /textColor: "\{colors\.light\.on-accent\}"/)
})

test('radius scale follows the base', () => {
  assert.deepEqual(radii(8), { 'radius-none': '0', 'radius-xs': '4px', 'radius-sm': '6px', 'radius-md': '8px', 'radius-lg': '12px', 'radius-xl': '16px', 'radius-full': '9999px' })
})

test('CLI: --config JSON, flag overrides and --out writes every format', () => {
  const dir = mkdtempSync(join(tmpdir(), 'theme-'))
  const cfg = join(dir, 'theme.json')
  writeFileSync(cfg, JSON.stringify({ hue: 40, accent: '#0f766e', contrast: 70, density: 'spacious' }))
  const r = run(['--config', cfg, '--contrast', '60', '--out', join(dir, 'out'), '--format', 'css,tailwind,shadcn,dtcg,design-md,report'])
  assert.equal(r.status, 0, r.stderr)
  assert.deepEqual(readdirSync(join(dir, 'out')).sort(), ['design-md-frontmatter.md', 'shadcn.css', 'tailwind.css', 'theme-report.json', 'tokens.css', 'tokens.json'])
  const report = JSON.parse(readFileSync(join(dir, 'out', 'theme-report.json'), 'utf8'))
  assert.equal(report.input.contrast, 60)
  assert.equal(report.input.hue, 40)
  assert.equal(report.summary.failed, 0)
  assert.match(readFileSync(join(dir, 'out', 'tokens.css'), 'utf8'), /--row-h: 48px;/)
})

test('CLI: stdout mode prints one format; main() returns exit codes', () => {
  const r = run(['--hue', '200'])
  assert.equal(r.status, 0)
  assert.match(r.stdout, /^\/\*/)
  assert.match(r.stderr, /pairs verified/)
  assert.equal(run(['--format', 'css,dtcg']).status, 2)
  const sink = { write() { return true } }
  assert.equal(main(['--help'], { stdout: sink, stderr: sink }), 0)
})
