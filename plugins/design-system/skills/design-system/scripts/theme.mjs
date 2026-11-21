#!/usr/bin/env node
// theme.mjs: generate a verified OKLCH theme (light, dark, high contrast) from a few inputs.
//
//   node theme.mjs --hue 250 --accent "#325ac2" --contrast 50 --density comfortable
//   node theme.mjs --config theme.json --out src/styles/tokens --format css,tailwind,shadcn,dtcg,design-md
//
// Inputs (flags or a JSON file with the same keys; flags win):
//   hue        neutral hue in degrees, 0–360 (default 250, a cool blue-grey)
//   tint       neutral chroma multiplier, 0–3 (default 1; 0 gives pure greys)
//   accent     brand colour: "#rgb", "#rrggbb", "oklch(L C H)" or a hue number (default oklch(0.50 0.17 265))
//   contrast   0–100 (default 50). Moves text, borders and surfaces apart; minimums are enforced either way
//   density    compact | comfortable | spacious (default comfortable)
//   radius     base radius in px for the md step (default 8)
//   lockAccent keep the accent's exact colour in the light theme; fail instead of adjusting it
//   highContrast emit a prefers-contrast: more block (default true)
//
// Every role pair is checked in the exact rounded value that is printed: WCAG 2 (4.5:1 text, 3:1 non-text),
// APCA Lc, and the sRGB gamut. Failing foreground roles are moved in lightness, 0.005 at a time, until they
// pass. If a pair still fails, the script exits 1 and names it. Role names match dashboard-ui's tokens.css.
// No dependencies: Node 18+ only.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// ── Colour maths (OKLab by Björn Ottosson; sRGB transfer per IEC 61966-2-1) ───────────────────────────────
export function oklchToOklab({ l, c, h }) {
  const r = (h * Math.PI) / 180
  return { L: l, a: c * Math.cos(r), b: c * Math.sin(r) }
}
export function oklabToOklch({ L, a, b }) {
  const c = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h: c < 1e-4 ? 0 : h }
}
export function oklabToLinearSrgb({ L, a, b }) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}
export function linearSrgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}
const encode = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)
const decode = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/** Gamma-encoded sRGB channels (0–1, unclipped) of an OKLCH colour. */
export function oklchToSrgb(lch) {
  return oklabToLinearSrgb(oklchToOklab(lch)).map((v) => Math.sign(v) * encode(Math.abs(v)))
}
export function hexToOklch(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new ThemeError([`not a hex colour: ${hex}`])
  const h = m[1].length === 3 ? [...m[1]].map((d) => d + d).join('') : m[1]
  const rgb = [0, 2, 4].map((i) => decode(parseInt(h.slice(i, i + 2), 16) / 255))
  return oklabToOklch(linearSrgbToOklab(rgb))
}
export function oklchToHex(lch) {
  return '#' + oklchToSrgb(lch).map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')).join('')
}

// A colour counts as in gamut when every channel rounds to a valid 8-bit value (within half a step).
const GAMUT_EPS = 0.5 / 255
export function inGamut(lch) {
  return oklchToSrgb(lch).every((v) => v >= -GAMUT_EPS && v <= 1 + GAMUT_EPS)
}
/** Reduce chroma (keeping lightness and hue) until the colour is in sRGB; the CSS Color 4 idea, simplified. */
export function fitGamut(lch) {
  if (inGamut(lch)) return { ...lch }
  let lo = 0
  let hi = lch.c
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    if (inGamut({ ...lch, c: mid })) lo = mid
    else hi = mid
  }
  return { ...lch, c: lo }
}
const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d
/** Round to the printed precision, then re-check the gamut on the rounded value. */
export function quantize(lch) {
  let q = { l: round(clamp01(lch.l), 3), c: round(Math.max(0, lch.c), 3), h: round(lch.h, 1) }
  if (q.c === 0) q.h = 0
  while (!inGamut(q) && q.c > 0) q = { ...q, c: round(q.c - 0.001, 3) }
  return q
}
export function cssOklch({ l, c, h }, alpha) {
  const a = alpha === undefined || alpha === 1 ? '' : ` / ${alpha}`
  return `oklch(${+l.toFixed(3)} ${+c.toFixed(3)} ${+h.toFixed(1)}${a})`
}
/** Mix in OKLab like color-mix(in oklab, a p, b): both opaque. */
export function mixOklab(a, b, p) {
  const A = oklchToOklab(a)
  const B = oklchToOklab(b)
  return oklabToOklch({ L: A.L * p + B.L * (1 - p), a: A.a * p + B.a * (1 - p), b: A.b * p + B.b * (1 - p) })
}

// ── Contrast: WCAG 2.x and APCA-W3 0.0.98G-4g ──────────────────────────────────────────────────────────────
export function relativeLuminance(lch) {
  const [r, g, b] = oklchToSrgb(lch).map((v) => decode(clamp01(v)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function wcagRatio(fg, bg) {
  const a = relativeLuminance(fg)
  const b = relativeLuminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
/** APCA lightness contrast Lc of text on a background, from 8-bit-style sRGB channels 0–1. */
export function apcaFromSrgb(txt, bg) {
  const y = ([r, g, b]) => {
    const Y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4
    return Y < 0.022 ? Y + (0.022 - Y) ** 1.414 : Y
  }
  const Yt = y(txt)
  const Yb = y(bg)
  if (Math.abs(Yb - Yt) < 0.0005) return 0
  if (Yb > Yt) {
    const s = (Yb ** 0.56 - Yt ** 0.57) * 1.14
    return s < 0.1 ? 0 : (s - 0.027) * 100
  }
  const s = (Yb ** 0.65 - Yt ** 0.62) * 1.14
  return s > -0.1 ? 0 : (s + 0.027) * 100
}
export function apcaLc(fg, bg) {
  return apcaFromSrgb(oklchToSrgb(fg).map(clamp01), oklchToSrgb(bg).map(clamp01))
}

// ── Inputs ──────────────────────────────────────────────────────────────────────────────────────────────
export class ThemeError extends Error {
  constructor(problems) {
    super(problems.join('\n'))
    this.problems = problems
  }
}
export const DEFAULTS = Object.freeze({
  hue: 250, tint: 1, accent: 'oklch(0.50 0.17 265)', contrast: 50, density: 'comfortable', radius: 8,
  lockAccent: false, highContrast: true,
})
const DENSITIES = ['compact', 'comfortable', 'spacious']
export function parseColor(input) {
  if (typeof input === 'number') return { l: 0.5, c: 0.17, h: ((input % 360) + 360) % 360 }
  const s = String(input).trim()
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseColor(Number(s))
  if (s.startsWith('#')) return hexToOklch(s)
  const m = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/i.exec(s)
  if (m) return { l: Number(m[1]) / (m[2] ? 100 : 1), c: Number(m[3]), h: Number(m[4]) % 360 }
  throw new ThemeError([`accent: cannot parse "${s}" (use #rrggbb, oklch(L C H) or a hue number)`])
}
/** Validate and normalise raw input; collects every problem before throwing. */
export function normalizeInput(raw) {
  const known = new Set(Object.keys(DEFAULTS))
  const problems = Object.keys(raw).filter((k) => !known.has(k)).map((k) => `unknown option "${k}"`)
  const o = { ...DEFAULTS, ...raw }
  const num = (k, lo, hi) => {
    const v = Number(o[k])
    if (!Number.isFinite(v) || v < lo || v > hi) problems.push(`${k} must be a number from ${lo} to ${hi}, got ${JSON.stringify(o[k])}`)
    return v
  }
  const bool = (k) => {
    if (typeof o[k] === 'boolean') return o[k]
    if (o[k] === 'true' || o[k] === 'false') return o[k] === 'true'
    problems.push(`${k} must be true or false, got ${JSON.stringify(o[k])}`)
    return false
  }
  const out = {
    hue: num('hue', 0, 360), tint: num('tint', 0, 3), contrast: num('contrast', 0, 100), radius: num('radius', 0, 32),
    density: String(o.density), lockAccent: bool('lockAccent'), highContrast: bool('highContrast'), accent: null,
  }
  if (!DENSITIES.includes(out.density)) problems.push(`density must be one of ${DENSITIES.join(', ')}, got "${o.density}"`)
  try { out.accent = parseColor(o.accent) } catch (e) { problems.push(e.message) }
  if (out.accent && !(out.accent.l > 0 && out.accent.l < 1)) problems.push('accent lightness must be between 0 and 1 (exclusive)')
  if (problems.length) throw new ThemeError(problems)
  return out
}

// ── The model: role recipes at contrast 50, with a lightness slope per unit of contrast ──────────────────
// [L at contrast 50, chroma at tint 1, ΔL when contrast goes 50 → 100]. Seeds reproduce dashboard-ui tokens.css.
const NEUTRAL = {
  light: {
    canvas: [0.985, 0.003, -0.005], surface: [1, 0, 0], 'surface-2': [0.97, 0.004, -0.01],
    'surface-3': [0.93, 0.006, -0.02], sunken: [0.955, 0.005, -0.01], border: [0.88, 0.008, -0.04],
    'border-strong': [0.6, 0.012, -0.08], 'text-muted': [0.5, 0.016, -0.1], text: [0.22, 0.02, -0.07],
  },
  dark: {
    canvas: [0.18, 0.006, -0.01], surface: [0.215, 0.008, 0], 'surface-2': [0.25, 0.009, 0.01],
    'surface-3': [0.29, 0.01, 0.02], sunken: [0.165, 0.006, -0.01], border: [0.35, 0.012, 0.04],
    'border-strong': [0.56, 0.014, 0.08], 'text-muted': [0.77, 0.014, 0.08], text: [0.95, 0.006, 0.04],
  },
}
// status roles: [hue, chroma, L] per theme; slope −0.05 light, +0.04 dark
const STATUS = {
  'danger-fg': { light: [27, 0.19, 0.53], dark: [25, 0.16, 0.72] },
  'warning-fg': { light: [65, 0.11, 0.52], dark: [80, 0.14, 0.82] },
  'success-fg': { light: [150, 0.13, 0.5], dark: [150, 0.15, 0.76] },
  'info-fg': { light: [250, 0.14, 0.51], dark: [250, 0.12, 0.74] },
  'cvd-negative': { light: [48, 0.14, 0.53], dark: [55, 0.14, 0.78] },
}
// categorical palette: fixed (validated for colour-vision deficiency in dashboard-ui); checked, never moved
const CAT = {
  light: ['0.58 0.19 259', '0.54 0.14 36', '0.56 0.09 178', '0.46 0.14 343', '0.63 0.09 137', '0.48 0.15 295', '0.63 0.12 88'],
  dark: ['0.73 0.11 267', '0.75 0.14 62', '0.74 0.11 178', '0.69 0.19 3', '0.79 0.10 140', '0.63 0.16 291', '0.89 0.13 91'],
}
const CAT_OTHER = { light: '0.75 0.01 250', dark: '0.42 0.01 250' }
const GRAY_L = {
  light: [0.993, 0.98, 0.96, 0.94, 0.918, 0.89, 0.85, 0.78, 0.62, 0.57],
  dark: [0.165, 0.195, 0.235, 0.265, 0.295, 0.33, 0.38, 0.46, 0.6, 0.66],
}
const GRAY_C = {
  light: [0.002, 0.003, 0.004, 0.005, 0.006, 0.008, 0.009, 0.01, 0.012, 0.013, 0.016, 0.02],
  dark: [0.005, 0.006, 0.008, 0.009, 0.01, 0.012, 0.013, 0.014, 0.014, 0.014, 0.014, 0.006],
}
const BRAND_L = {
  light: [0.993, 0.978, 0.955, 0.93, 0.9, 0.87, 0.82, 0.74],
  dark: [0.17, 0.2, 0.245, 0.28, 0.315, 0.36, 0.42, 0.5],
}
const BRAND_F = [0.05, 0.1, 0.18, 0.26, 0.34, 0.42, 0.55, 0.7, 1, 1, 0.85, 0.45]
const lch = (s) => { const [l, c, h] = s.split(' ').map(Number); return { l, c, h } }

// Thresholds. WCAG 2: SC 1.4.3 (text 4.5:1) and SC 1.4.11 (non-text 3:1).
// APCA: Lc 75 for body text, Lc 60 for other readable text, Lc 15 as the floor for meaningful non-text.
export const NEEDS = {
  body: { wcag: 4.5, apca: 75 },
  text: { wcag: 4.5, apca: 60 },
  nontext: { wcag: 3, apca: 15 },
}
const BGS = ['canvas', 'surface', 'surface-2', 'surface-3', 'sunken']

function buildTheme(mode, o, contrast) {
  const k = (contrast - 50) / 50
  const dir = mode === 'light' ? -1 : 1
  const roles = {}
  const meta = {}
  const set = (name, target, opts = {}) => {
    roles[name] = quantize(fitGamut(target))
    meta[name] = { target, ...opts }
  }
  for (const [name, [L, C, s]] of Object.entries(NEUTRAL[mode])) set(name, { l: clamp01(L + s * k), c: C * o.tint, h: o.hue })
  // accent: hue and chroma from the input; lightness generated per theme unless locked (light only)
  const a = o.accent
  if (mode === 'light' && o.lockAccent) set('accent', a, { locked: true })
  else set('accent', { l: mode === 'light' ? 0.5 - 0.06 * k : 0.72 + 0.06 * k, c: mode === 'light' ? a.c : a.c * 0.76, h: a.h })
  for (const [name, t] of Object.entries(STATUS)) {
    const [h, c, L] = t[mode]
    set(name, { l: clamp01(L + (mode === 'light' ? -0.05 : 0.04) * k), c, h })
  }
  CAT[mode].forEach((v, i) => set(`cat-${i + 1}`, lch(v), { locked: true }))
  set('cat-other', { ...lch(CAT_OTHER[mode]), h: o.hue })
  set('shadow-color', mode === 'light' ? { l: 0.35, c: 0.03, h: o.hue } : { l: 0, c: 0, h: 0 })
  // 12-step ramps (primitives). Steps 11 and 12 carry text and are checked like roles.
  GRAY_L[mode].forEach((L, i) => set(`gray-${i + 1}`, { l: L, c: GRAY_C[mode][i] * o.tint, h: o.hue }))
  set('gray-11', { l: roles['text-muted'].l, c: GRAY_C[mode][10] * o.tint, h: o.hue })
  set('gray-12', { l: roles.text.l, c: GRAY_C[mode][11] * o.tint, h: o.hue })
  const A = roles.accent
  BRAND_L[mode].forEach((L, i) => set(`brand-${i + 1}`, { l: L, c: A.c * BRAND_F[i], h: A.h }))
  set('brand-9', { ...A })
  set('brand-10', { l: clamp01(A.l + 0.04 * dir), c: A.c, h: A.h })
  set('brand-11', mode === 'light' ? { l: 0.45 - 0.06 * k, c: A.c * BRAND_F[10], h: A.h } : { l: clamp01(0.8 + 0.05 * k), c: A.c * BRAND_F[10], h: A.h })
  set('brand-12', mode === 'light' ? { l: 0.27 - 0.06 * k, c: A.c * BRAND_F[11], h: A.h } : { l: clamp01(0.94 + 0.03 * k), c: A.c * BRAND_F[11], h: A.h })
  return { mode, roles, meta, dir }
}

// derived colours that verification needs: on-accent and status backgrounds (color-mix in oklab)
const WHITE = { l: 1, c: 0, h: 0 }
function onColor(theme, bgName) {
  const bg = theme.roles[bgName]
  const dark = theme.mode === 'light' ? theme.roles.text : theme.roles.canvas
  return wcagRatio(WHITE, bg) >= wcagRatio(dark, bg) ? WHITE : dark
}
const STATUS_BG_MIX = { light: 0.1, dark: 0.18 }
function derived(theme) {
  const r = theme.roles
  const d = { 'on-accent': onColor(theme, 'accent'), 'on-danger': onColor(theme, 'danger-fg') }
  for (const s of ['danger', 'warning', 'success', 'info']) d[`${s}-bg`] = quantize(mixOklab(r[`${s}-fg`], r.surface, STATUS_BG_MIX[theme.mode]))
  return d
}
const colorOf = (theme, d, name) => theme.roles[name] ?? d[name]

// every pair that is verified, grouped by the role that is moved when it fails
function checksFor(theme) {
  const cats = Array.from({ length: 7 }, (_, i) => `cat-${i + 1}`)
  const on = (fg, bgs, need) => bgs.map((bg) => ({ fg, bg, need }))
  const c = [
    { subject: 'text', pairs: on('text', BGS, 'body') },
    { subject: 'text-muted', pairs: on('text-muted', BGS, 'text') },
    { subject: 'border-strong', pairs: on('border-strong', BGS, 'nontext') },
    { subject: 'accent', pairs: [...on('accent', BGS, 'text'), { fg: 'on-accent', bg: 'accent', need: 'text' }] },
  ]
  for (const s of ['danger', 'warning', 'success', 'info'])
    c.push({ subject: `${s}-fg`, pairs: [...on(`${s}-fg`, BGS, 'text'), { fg: `${s}-fg`, bg: `${s}-bg`, need: 'text' }] })
  c.push({ subject: 'danger-fg', pairs: [{ fg: 'on-danger', bg: 'danger-fg', need: 'text' }] })
  c.push({ subject: 'cvd-negative', pairs: on('cvd-negative', BGS, 'text') })
  for (const cat of cats) c.push({ subject: cat, pairs: on(cat, ['surface', 'surface-2'], 'nontext') })
  c.push({ subject: 'gray-11', pairs: on('gray-11', ['gray-1', 'gray-2'], 'text') })
  c.push({ subject: 'gray-12', pairs: on('gray-12', ['gray-1', 'gray-2'], 'body') })
  c.push({ subject: 'brand-11', pairs: on('brand-11', ['gray-1', 'gray-2', 'brand-2'], 'text') })
  c.push({ subject: 'brand-12', pairs: on('brand-12', ['gray-1', 'gray-2', 'brand-2'], 'body') })
  return c
}
function evaluate(theme, pair) {
  const d = derived(theme)
  const fg = colorOf(theme, d, pair.fg)
  const bg = colorOf(theme, d, pair.bg)
  const need = NEEDS[pair.need]
  const ratio = wcagRatio(fg, bg)
  const lc = apcaLc(fg, bg)
  return { ...pair, ratio: round(ratio, 2), lc: round(lc, 1), wcagNeed: need.wcag, apcaNeed: need.apca,
    pass: ratio >= need.wcag && Math.abs(lc) >= need.apca }
}

const STEP = 0.005
function satisfy(theme, check, adjustments, failures) {
  const name = check.subject
  const start = theme.roles[name]
  let fails = check.pairs.map((p) => evaluate(theme, p)).filter((r) => !r.pass)
  if (!fails.length) return
  if (theme.meta[name].locked) {
    for (const f of fails) failures.push(failure(theme, f, `${name} is fixed (locked or validated palette) so it was not moved`))
    return
  }
  const target = theme.meta[name].target
  let l = start.l
  while (fails.length) {
    l = round(l + theme.dir * STEP, 4)
    if (l < 0 || l > 1) {
      for (const f of fails) failures.push(failure(theme, f, `${name} reached L=${theme.dir < 0 ? 0 : 1} and still fails`))
      theme.roles[name] = start
      return
    }
    theme.roles[name] = quantize(fitGamut({ ...target, l }))
    fails = check.pairs.map((p) => evaluate(theme, p)).filter((r) => !r.pass)
  }
  adjustments.push({ theme: theme.label, role: name, from: cssOklch(start), to: cssOklch(theme.roles[name]) })
}
function failure(theme, r, why) {
  return `${theme.label}: ${r.fg} on ${r.bg} is ${r.ratio}:1 / Lc ${r.lc}; needs ${r.wcagNeed}:1 and |Lc| ${r.apcaNeed}. ${why}.`
}

/** Generate and verify every theme. Throws ThemeError (with every failing pair) when it cannot comply. */
export function generate(rawInput = {}) {
  const o = normalizeInput(rawInput)
  const variants = [['light', 'light', o.contrast], ['dark', 'dark', o.contrast]]
  if (o.highContrast) variants.push(['light', 'light-hc', 100], ['dark', 'dark-hc', 100])
  const themes = {}
  const adjustments = []
  const failures = []
  const gamut = []
  for (const [mode, label, contrast] of variants) {
    const t = buildTheme(mode, o, Math.max(o.contrast, contrast))
    t.label = label
    for (const [name, m] of Object.entries(t.meta)) {
      if (!inGamut(m.target) && !m.locked) gamut.push({ theme: label, role: name, from: cssOklch(m.target), to: cssOklch(t.roles[name]) })
    }
    // the ramp's text steps follow their roles, so adjust roles first, then ramps
    for (const check of checksFor(t)) satisfy(t, check, adjustments, failures)
    themes[label] = t
  }
  // locked accent: the input itself must be in gamut
  if (o.lockAccent && !inGamut(o.accent)) failures.push(`light: the locked accent ${cssOklch(o.accent)} is outside sRGB`)
  const results = []
  for (const t of Object.values(themes)) {
    for (const check of checksFor(t)) for (const p of check.pairs) results.push({ theme: t.label, ...evaluate(t, p) })
    for (const [name, v] of Object.entries(t.roles)) if (!inGamut(v)) failures.push(`${t.label}: ${name} ${cssOklch(v)} is outside sRGB`)
  }
  for (const r of results) if (!r.pass && !failures.some((f) => f.startsWith(`${r.theme}: ${r.fg} on ${r.bg} `)))
    failures.push(failure({ label: r.theme }, r, 'final check'))
  if (failures.length) throw new ThemeError(failures)
  return { input: o, themes, adjustments, gamut, results }
}

// ── Token sets shared by every output ───────────────────────────────────────────────────────────────────
const SPACE = [4, 8, 12, 16, 24, 32, 48, 64]
const DENSITY = {
  compact: { 'row-h': '32px', 'cell-pad-block': 'var(--space-1)', 'cell-pad-inline': 'var(--space-2)', 'card-pad': 'var(--space-4)', 'grid-gap': 'var(--space-3)' },
  comfortable: { 'row-h': '40px', 'cell-pad-block': 'var(--space-2)', 'cell-pad-inline': 'var(--space-3)', 'card-pad': 'var(--space-5)', 'grid-gap': 'var(--space-4)' },
  spacious: { 'row-h': '48px', 'cell-pad-block': 'var(--space-3)', 'cell-pad-inline': 'var(--space-4)', 'card-pad': 'var(--space-6)', 'grid-gap': 'var(--space-5)' },
}
export function radii(base) {
  const r = (f) => `${round(base * f, 1)}px`
  return { 'radius-none': '0', 'radius-xs': r(0.5), 'radius-sm': r(0.75), 'radius-md': r(1), 'radius-lg': r(1.5), 'radius-xl': r(2), 'radius-full': '9999px' }
}
const TYPE = {
  'font-sans': 'Inter, "SF Pro Text", Roboto, system-ui, sans-serif',
  'font-mono': '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
  'type-hero': '600 2rem/1.1 var(--font-sans)', 'type-kpi': '600 1.875rem/1.1 var(--font-sans)',
  'type-title': '600 1.25rem/1.3 var(--font-sans)', 'type-heading': '600 1rem/1.4 var(--font-sans)',
  'type-body': '400 0.875rem/1.45 var(--font-sans)', 'type-meta': '400 0.75rem/1.35 var(--font-sans)',
  'track-display': '-0.02em', 'track-body': '0', 'track-meta': '0.01em', measure: '65ch',
}
const MOTION = {
  'motion-dur-instant': '0ms', 'motion-dur-micro': '100ms', 'motion-dur-short': '150ms', 'motion-dur-medium': '240ms', 'motion-dur-long': '400ms', 'motion-dur-data': '750ms',
  'motion-stagger': '30ms', 'motion-ease-standard': 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  'motion-ease-enter': 'cubic-bezier(0, 0, 0.38, 0.9)', 'motion-ease-exit': 'cubic-bezier(0.2, 0, 1, 0.9)',
  'motion-ease-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
  'motion-ease-spring': 'linear(0, 0.044 5%, 0.142 10%, 0.261 15%, 0.380 20%, 0.589 30%, 0.740 40%, 0.841 50%, 0.905 60%, 0.968 80%, 1)',
  'interest-delay': '500ms',
}
const SHADOWS = {
  'shadow-xs': '0 1px 2px color-mix(in oklab, var(--shadow-color) 8%, transparent)',
  'shadow-sm': '0 1px 1px color-mix(in oklab, var(--shadow-color) 6%, transparent),\n    0 2px 4px color-mix(in oklab, var(--shadow-color) 6%, transparent)',
  'shadow-md': '0 1px 2px color-mix(in oklab, var(--shadow-color) 8%, transparent),\n    0 4px 8px color-mix(in oklab, var(--shadow-color) 8%, transparent),\n    0 12px 24px color-mix(in oklab, var(--shadow-color) 8%, transparent)',
  'shadow-lg': '0 2px 4px color-mix(in oklab, var(--shadow-color) 8%, transparent),\n    0 8px 16px color-mix(in oklab, var(--shadow-color) 8%, transparent),\n    0 24px 48px color-mix(in oklab, var(--shadow-color) 12%, transparent)',
}
// colour roles in tokens.css order; values: a literal role name, or a CSS expression
const NEUTRAL_ROLES = ['canvas', 'surface', 'surface-2', 'surface-3', 'sunken']
const STATUS_ROLES = ['danger-fg', 'warning-fg', 'success-fg', 'info-fg']
function colorDecls(t) {
  const r = t.roles
  const out = []
  const lit = (n) => out.push([n, cssOklch(r[n])])
  for (let i = 1; i <= 12; i++) out.push([`gray-${i}`, cssOklch(r[`gray-${i}`])])
  for (let i = 1; i <= 12; i++) out.push([`brand-${i}`, cssOklch(r[`brand-${i}`])])
  NEUTRAL_ROLES.forEach(lit)
  out.push(['hover', 'color-mix(in oklab, var(--text) 5%, transparent)'], ['zebra', 'color-mix(in oklab, var(--text) 3%, transparent)'])
  ;['border', 'border-strong', 'text', 'text-muted', 'accent'].forEach(lit)
  const onA = derived(t)['on-accent']
  out.push(['on-accent', cssOklch(onA)], ['focus-ring', 'var(--accent)'])
  out.push(['scrim', t.mode === 'light' ? 'oklch(0 0 0 / 0.4)' : 'oklch(0 0 0 / 0.6)'])
  out.push(['glass-tint', 'color-mix(in oklab, var(--surface) 85%, transparent)'])
  STATUS_ROLES.forEach(lit)
  const pct = Math.round(STATUS_BG_MIX[t.mode] * 100)
  for (const s of ['danger', 'warning', 'success', 'info']) out.push([`${s}-bg`, `color-mix(in oklab, var(--${s}-fg) ${pct}%, var(--surface))`])
  out.push(['positive', 'var(--success-fg)'], ['negative', 'var(--danger-fg)'], ['neutral-delta', 'var(--text-muted)'])
  out.push(['chart-grid', 'var(--border)'], ['chart-axis', 'var(--border-strong)'], ['chart-ink', 'var(--text-muted)'], ['chart-crosshair', 'var(--border-strong)'])
  for (let i = 1; i <= 7; i++) lit(`cat-${i}`)
  lit('cat-other')
  lit('shadow-color')
  return out
}
// the subset that differs between themes (everything that is a literal)
const themeDecls = (t) => colorDecls(t).filter(([, v]) => v.startsWith('oklch(') || v.startsWith('color-mix(in oklab, var(--') && /\d+%, var\(--surface\)/.test(v))

// ── CSS (drop-in for tokens.css) ───────────────────────────────────────────────────────────────────────
const block = (sel, decls, indent = '') =>
  `${indent}${sel} {\n${decls.map(([n, v]) => `${indent}  --${n}: ${v};`).join('\n')}\n${indent}}`
function header(g, what) {
  const i = g.input
  return `/*\n * ${what}.\n * Generated by design-system/scripts/theme.mjs. Do not hand-edit: change the inputs and re-run.\n` +
    ` * Inputs: hue ${i.hue}, tint ${i.tint}, accent ${cssOklch(i.accent)}, contrast ${i.contrast}, density ${i.density}, radius ${i.radius}px` +
    `${i.lockAccent ? ', accent locked' : ''}.\n * Verified: ${g.results.length} pairs (WCAG 2 text 4.5:1, non-text 3:1; APCA body Lc 75, text Lc 60, non-text Lc 15); every colour in sRGB.\n */`
}
export function toCss(g) {
  const { light, dark } = g.themes
  const root = [
    ['space-1', '4px'], ...SPACE.slice(1).map((v, i) => [`space-${i + 2}`, `${v}px`]),
    ['cols', '12'], ['gutter', 'var(--space-4)'],
    ...Object.entries(radii(g.input.radius)), ...Object.entries(TYPE), ...Object.entries(MOTION),
    ...Object.entries(DENSITY[g.input.density]), ['target-min', '24px'],
    ...colorDecls(light), ...Object.entries(SHADOWS),
  ]
  const parts = [header(g, 'Design tokens: light and dark themes')]
  parts.push(`:root {\n  color-scheme: light dark;\n${block('', root).split('\n').slice(1, -1).join('\n')}\n}`)
  const darkDecls = themeDecls(dark)
  parts.push(`/* Dark: follows the OS unless <html data-theme="light|dark"> forces one */\n@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', darkDecls, '  ')}\n}`)
  parts.push(block(':root[data-theme="dark"]', darkDecls))
  if (g.themes['light-hc']) {
    const diff = (a, b) => themeDecls(a).filter(([n, v]) => themeDecls(b).find(([m]) => m === n)?.[1] !== v)
    const hcL = diff(g.themes['light-hc'], light).concat([['border', 'var(--border-strong)'], ['chart-grid', 'var(--border-strong)']])
    const hcD = diff(g.themes['dark-hc'], dark).concat([['border', 'var(--border-strong)'], ['chart-grid', 'var(--border-strong)']])
    parts.push(`/* High contrast: the same generator at contrast 100 */\n@media (prefers-contrast: more) {\n${block(':root', hcL, '  ')}\n}`)
    parts.push(`@media (prefers-contrast: more) and (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', hcD, '  ')}\n}`)
    parts.push(`@media (prefers-contrast: more) {\n${block(':root[data-theme="dark"]', hcD, '  ')}\n}`)
  }
  const neg = (t) => [['negative', cssOklch(t.roles['cvd-negative'])]]
  parts.push(`/* Money conventions: red-up markets, and colour-blind-safe blue/orange */\n:root[data-money="red-up"] { --positive: var(--danger-fg); --negative: var(--success-fg); }\n` +
    `${block(':root[data-money="cvd"]', [['positive', 'var(--info-fg)'], ...neg(light)])}\n` +
    `@media (prefers-color-scheme: dark) {\n${block(':root[data-money="cvd"]:not([data-theme="light"])', neg(dark), '  ')}\n}\n` +
    block(':root[data-theme="dark"][data-money="cvd"]', neg(dark)))
  for (const d of DENSITIES.filter((x) => x !== g.input.density)) parts.push(block(`:root[data-density="${d}"]`, Object.entries(DENSITY[d])))
  parts.push('@media (pointer: coarse) {\n  :root { --target-min: 44px; }\n}')
  parts.push('@media (prefers-reduced-transparency: reduce) {\n  :root { --glass-tint: var(--surface); }\n}')
  parts.push('@media (forced-colors: active) {\n  :root { --focus-ring: Highlight; --accent: Highlight; --on-accent: HighlightText; --border-strong: CanvasText; }\n}')
  return parts.join('\n\n') + '\n'
}

// ── Tailwind v4: utilities that read the role variables ──────────────────────────────────────────────────
export function toTailwind(g) {
  const colors = colorDecls(g.themes.light).map(([n]) => n).filter((n) => n !== 'shadow-color')
  return header(g, 'Tailwind v4 theme. Load after tokens.css') + '\n' +
    '/* Remove the default palette so only role colours exist (delete this line while migrating). */\n' +
    '@theme {\n  --color-*: initial;\n}\n\n' +
    `@theme inline {\n  --color-transparent: transparent;\n  --color-current: currentColor;\n${colors.map((n) => `  --color-${n}: var(--${n});`).join('\n')}\n` +
    `  --ease-standard: var(--motion-ease-standard);\n  --ease-enter: var(--motion-ease-enter);\n  --ease-exit: var(--motion-ease-exit);\n  --ease-emphasized: var(--motion-ease-emphasized);\n}\n\n` +
    '/* Same names as tokens.css, so the values are repeated literally (a var() here would point at itself). */\n' +
    `@theme {\n  --spacing: 4px;\n${Object.entries(radii(g.input.radius)).filter(([n]) => n !== 'radius-none').map(([n, v]) => `  --${n}: ${v};`).join('\n')}\n` +
    `  --font-sans: ${TYPE['font-sans']};\n  --font-mono: ${TYPE['font-mono']};\n` +
    `${Object.entries(SHADOWS).map(([n, v]) => `  --${n}: ${v};`).join('\n')}\n}\n`
}

// ── shadcn/ui: its variable names, resolved to the verified values ─────────────────────────────────────
export function shadcnMap(t) {
  const d = derived(t)
  const r = (n) => cssOklch(colorOf(t, d, n))
  const light = t.mode === 'light'
  const m = {
    background: r('canvas'), foreground: r('text'), card: r('surface'), 'card-foreground': r('text'),
    popover: r(light ? 'surface' : 'surface-2'), 'popover-foreground': r('text'),
    primary: r('accent'), 'primary-foreground': r('on-accent'), secondary: r('surface-2'), 'secondary-foreground': r('text'),
    muted: r('surface-2'), 'muted-foreground': r('text-muted'), accent: r(light ? 'surface-2' : 'surface-3'), 'accent-foreground': r('text'),
    destructive: r('danger-fg'), 'destructive-foreground': r('on-danger'), border: r('border'), input: r('border-strong'), ring: r('accent'),
  }
  for (let i = 1; i <= 7; i++) m[`chart-${i}`] = r(`cat-${i}`)
  Object.assign(m, {
    sidebar: r('canvas'), 'sidebar-foreground': r('text-muted'), 'sidebar-primary': r('accent'), 'sidebar-primary-foreground': r('on-accent'),
    'sidebar-accent': r('surface-2'), 'sidebar-accent-foreground': r('text'), 'sidebar-border': r('border'), 'sidebar-ring': r('accent'),
  })
  return m
}
export function toShadcn(g) {
  const L = shadcnMap(g.themes.light)
  const D = shadcnMap(g.themes.dark)
  const rad = radii(g.input.radius)
  return header(g, 'shadcn/ui variables (globals.css). Standalone: do not also load tokens.css, whose --accent means something else') + '\n' +
    '@custom-variant dark (&:is(.dark *));\n\n' +
    `${block(':root', [['radius', rad['radius-md']], ...Object.entries(L)])}\n\n${block('.dark', Object.entries(D))}\n\n` +
    `@theme inline {\n${Object.keys(L).map((n) => `  --color-${n}: var(--${n});`).join('\n')}\n` +
    `  --radius-sm: ${rad['radius-sm']};\n  --radius-md: ${rad['radius-md']};\n  --radius-lg: ${rad['radius-lg']};\n  --radius-xl: ${rad['radius-xl']};\n}\n`
}

// ── DTCG (Design Tokens Format Module 2025.10) ────────────────────────────────────────────────────────
const dtcgColor = (v, alpha = 1) => ({ $type: 'color', $value: { colorSpace: 'oklch', components: [v.l, v.c, v.h], alpha, hex: oklchToHex(v) } })
const dim = (px) => ({ $type: 'dimension', $value: { value: Number.parseFloat(px), unit: 'px' } })
export function toDtcg(g) {
  const mode = (t) => {
    const d = derived(t)
    const out = {}
    for (const [n, v] of colorDecls(t)) {
      if (v.startsWith('oklch(0 0 0 /')) out[n] = dtcgColor({ l: 0, c: 0, h: 0 }, t.mode === 'light' ? 0.4 : 0.6)
      else if (v.startsWith('oklch(')) out[n] = dtcgColor(colorOf(t, d, n) ?? d[n])
      else if (n.endsWith('-bg')) out[n] = dtcgColor(d[n])
      else if (n === 'hover' || n === 'zebra') out[n] = dtcgColor(t.roles.text, n === 'hover' ? 0.05 : 0.03)
      else if (n === 'glass-tint') out[n] = dtcgColor(t.roles.surface, 0.85)
      else out[n] = { $type: 'color', $value: `{color.${t.label}.${/var\(--([\w-]+)\)/.exec(v)[1]}}` }
    }
    out['on-accent'] = dtcgColor(d['on-accent'])
    return out
  }
  const color = {}
  for (const t of Object.values(g.themes)) color[t.label] = mode(t)
  const ms = (v) => ({ $type: 'duration', $value: { value: Number.parseFloat(v), unit: 'ms' } })
  const bez = (v) => ({ $type: 'cubicBezier', $value: v.slice(13, -1).split(',').map(Number) })
  return {
    $description: `Generated by design-system/scripts/theme.mjs (hue ${g.input.hue}, accent ${cssOklch(g.input.accent)}, contrast ${g.input.contrast}). Mode groups: ${Object.keys(color).join(', ')}.`,
    color,
    space: Object.fromEntries(SPACE.map((v, i) => [String(i + 1), dim(`${v}px`)])),
    radius: Object.fromEntries(Object.entries(radii(g.input.radius)).map(([n, v]) => [n.slice(7), dim(v === '0' ? '0px' : v)])),
    density: Object.fromEntries(DENSITIES.map((d) => [d, { 'row-h': dim(DENSITY[d]['row-h']) }])),
    font: { sans: { $type: 'fontFamily', $value: ['Inter', 'SF Pro Text', 'Roboto', 'system-ui', 'sans-serif'] },
      mono: { $type: 'fontFamily', $value: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace'] } },
    duration: Object.fromEntries(['micro', 'short', 'medium', 'long'].map((n) => [n, ms(MOTION[`motion-dur-${n}`])])),
    easing: Object.fromEntries(['standard', 'enter', 'exit', 'emphasized'].map((n) => [n, bez(MOTION[`motion-ease-${n}`])])),
  }
}

// ── DESIGN.md front matter (google-labs-code/design.md, version alpha) ──────────────────────────────────
export function toDesignMd(g) {
  const L = g.themes.light
  const D = g.themes.dark
  const roles = ['canvas', 'surface', 'surface-2', 'surface-3', 'border', 'border-strong', 'text', 'text-muted', 'accent', ...STATUS_ROLES]
  const grp = (t) => {
    const d = derived(t)
    return [...roles.map((n) => `    ${n}: "${cssOklch(t.roles[n])}"`), `    on-accent: "${cssOklch(d['on-accent'])}"`].join('\n')
  }
  const rad = radii(g.input.radius)
  return '---\nversion: alpha\nname: <Product name>\ncolors:\n' +
    `  primary: "${cssOklch(L.roles.accent)}"\n  light:\n${grp(L)}\n  dark:\n${grp(D)}\n` +
    'typography:\n  title:\n    fontFamily: Inter\n    fontSize: 1.25rem\n    fontWeight: 600\n    lineHeight: 1.3\n' +
    '  body:\n    fontFamily: Inter\n    fontSize: 0.875rem\n    fontWeight: 400\n    lineHeight: 1.45\n' +
    '  meta:\n    fontFamily: Inter\n    fontSize: 0.75rem\n    fontWeight: 400\n    lineHeight: 1.35\n    letterSpacing: 0.01em\n' +
    `rounded:\n${['xs', 'sm', 'md', 'lg', 'xl'].map((n) => `  ${n}: ${rad[`radius-${n}`]}`).join('\n')}\n` +
    `spacing:\n${SPACE.map((v, i) => `  "${i + 1}": ${v}px`).join('\n')}\n` +
    'components:\n  button-primary:\n    backgroundColor: "{colors.light.accent}"\n    textColor: "{colors.light.on-accent}"\n    rounded: "{rounded.md}"\n' +
    '  card:\n    backgroundColor: "{colors.light.surface}"\n    textColor: "{colors.light.text}"\n    rounded: "{rounded.lg}"\n---\n'
}

export function toReport(g) {
  return {
    input: { ...g.input, accent: cssOklch(g.input.accent) },
    summary: { pairs: g.results.length, failed: g.results.filter((r) => !r.pass).length, adjustments: g.adjustments.length, gamutMapped: g.gamut.length },
    adjustments: g.adjustments, gamut: g.gamut, results: g.results,
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────────────
const FORMATS = { css: ['tokens.css', toCss], tailwind: ['tailwind.css', toTailwind], shadcn: ['shadcn.css', toShadcn],
  dtcg: ['tokens.json', (g) => JSON.stringify(toDtcg(g), null, 2) + '\n'], 'design-md': ['design-md-frontmatter.md', toDesignMd],
  report: ['theme-report.json', (g) => JSON.stringify(toReport(g), null, 2) + '\n'] }
const HELP = `Usage: node theme.mjs [--config file.json] [--hue N] [--tint N] [--accent COLOR] [--contrast N]
       [--density compact|comfortable|spacious] [--radius PX] [--lock-accent] [--no-high-contrast]
       [--format ${Object.keys(FORMATS).join(',')}] [--out DIR]
Without --out, one format is printed to stdout (default css). With --out, each format is written to DIR.
Exit 1 with the failing pairs when the theme cannot meet the contrast and gamut checks; exit 2 on bad input.`

export function parseArgs(argv) {
  const opts = {}
  let config = null
  let out = null
  let formats = null
  const flags = { '--hue': 'hue', '--tint': 'tint', '--accent': 'accent', '--contrast': 'contrast', '--density': 'density', '--radius': 'radius' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => { if (i + 1 >= argv.length) throw new ThemeError([`${a} needs a value`]); return argv[++i] }
    if (a === '--help' || a === '-h') return { help: true }
    else if (flags[a]) opts[flags[a]] = next()
    else if (a === '--lock-accent') opts.lockAccent = true
    else if (a === '--no-high-contrast') opts.highContrast = false
    else if (a === '--config') config = next()
    else if (a === '--out') out = next()
    else if (a === '--format') formats = next().split(',').map((s) => s.trim()).filter(Boolean)
    else throw new ThemeError([`unknown argument ${a}`])
  }
  for (const f of formats ?? []) if (!FORMATS[f]) throw new ThemeError([`unknown format "${f}" (${Object.keys(FORMATS).join(', ')})`])
  let input = opts
  if (config) {
    let parsed
    try { parsed = JSON.parse(readFileSync(config, 'utf8')) } catch (e) { throw new ThemeError([`cannot read --config ${config}: ${e.message}`]) }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new ThemeError([`--config ${config} must hold a JSON object`])
    input = { ...parsed, ...opts }
  }
  return { input, out, formats: formats ?? ['css'] }
}

export function main(argv, io = { stdout: process.stdout, stderr: process.stderr }) {
  let args
  try { args = parseArgs(argv) } catch (e) { io.stderr.write(`theme.mjs: ${e.message}\n`); return 2 }
  if (args.help) { io.stdout.write(HELP + '\n'); return 0 }
  let g
  try { g = generate(args.input) } catch (e) {
    if (!(e instanceof ThemeError)) throw e
    const bad = e.problems.some((p) => /must be|cannot parse|unknown option|not a hex/.test(p))
    io.stderr.write(`theme.mjs: ${bad ? 'invalid input' : 'FAILED: the theme cannot meet its contrast and gamut checks'}\n${e.problems.map((p) => `  - ${p}`).join('\n')}\n`)
    return bad ? 2 : 1
  }
  const summary = `theme.mjs: ok, ${g.results.length} pairs verified, ${g.adjustments.length} lightness adjustment(s), ${g.gamut.length} gamut-mapped colour(s)\n` +
    g.adjustments.map((a) => `  adjusted ${a.theme} ${a.role}: ${a.from} -> ${a.to}\n`).join('')
  if (args.out) {
    mkdirSync(args.out, { recursive: true })
    for (const f of args.formats) {
      const [file, fn] = FORMATS[f]
      writeFileSync(join(args.out, file), fn(g))
      io.stderr.write(`wrote ${join(args.out, file)}\n`)
    }
  } else {
    if (args.formats.length !== 1) { io.stderr.write('theme.mjs: several formats need --out DIR\n'); return 2 }
    io.stdout.write(FORMATS[args.formats[0]][1](g))
  }
  io.stderr.write(summary)
  return 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main(process.argv.slice(2))
