// Argument parsing shared by capture.mjs and gate.mjs. No dependencies on purpose.
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

/**
 * @typedef {{ name: string, width: number, height: number }} Viewport
 * @typedef {{
 *   base: string, routes: string[], themes: string[], viewports: Viewport[], out: string,
 *   executablePath?: string, themeAttr?: string, themeStorage?: string, settleMs: number,
 *   only: string[], skip: string[], maxTabs: number, json: boolean
 * }} RunConfig
 */

const DEFAULTS = {
  base: '',
  routes: ['/'],
  themes: ['light', 'dark'],
  viewports: ['1440x900', '390x844'],
  out: 'design-review-out',
  settleMs: 600,
  maxTabs: 40,
}

/** @param {string} v @returns {Viewport} */
function parseViewport(v) {
  const m = /^(\d+)x(\d+)$/.exec(v.trim())
  if (!m) throw new Error(`bad viewport "${v}", expected WIDTHxHEIGHT`)
  return { name: `${m[1]}`, width: Number(m[1]), height: Number(m[2]) }
}

/** @param {string | string[] | undefined} v */
function list(v) {
  if (v === undefined) return undefined
  const arr = Array.isArray(v) ? v : String(v).split(',')
  return arr.map((s) => s.trim()).filter(Boolean)
}

/**
 * Parse argv. Flags: --base, --routes (comma list), --url (one full URL or file path),
 * --themes, --viewports, --out, --executable-path, --theme-attr, --theme-storage,
 * --settle-ms, --only, --skip, --max-tabs, --config (JSON with the same keys), --json.
 * @param {string[]} argv
 * @returns {RunConfig}
 */
export function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) throw new Error(`unexpected argument "${a}"`)
    const eq = a.indexOf('=')
    if (eq > 0) flags[a.slice(2, eq)] = a.slice(eq + 1)
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) flags[a.slice(2)] = argv[++i]
    else flags[a.slice(2)] = 'true'
  }
  /** @type {Record<string, unknown>} */
  let file = {}
  if (flags.config) {
    const parsed = JSON.parse(readFileSync(flags.config, 'utf8'))
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('--config must hold a JSON object')
    file = parsed
  }
  /** @param {string} key @param {string} [fileKey] */
  const pick = (key, fileKey = key) => {
    if (flags[key] !== undefined) return flags[key]
    const v = file[fileKey]
    if (typeof v === 'string' || Array.isArray(v)) return v
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    return undefined
  }

  let base = String(pick('base') ?? DEFAULTS.base)
  let routes = list(pick('routes')) ?? DEFAULTS.routes
  const url = pick('url')
  if (typeof url === 'string') {
    base = ''
    routes = [/^[a-z]+:\/\//i.test(url) ? url : pathToFileURL(resolve(url)).href]
  }
  if (!base && routes.some((r) => !/^[a-z]+:\/\//i.test(r))) throw new Error('give --base or --url (or full URLs in --routes)')

  return {
    base: base.replace(/\/$/, ''),
    routes,
    themes: list(pick('themes')) ?? DEFAULTS.themes,
    viewports: (list(pick('viewports')) ?? DEFAULTS.viewports).map(parseViewport),
    out: String(pick('out') ?? DEFAULTS.out),
    executablePath: /** @type {string | undefined} */ (pick('executable-path', 'executablePath')),
    themeAttr: /** @type {string | undefined} */ (pick('theme-attr', 'themeAttr')),
    themeStorage: /** @type {string | undefined} */ (pick('theme-storage', 'themeStorage')),
    settleMs: Number(pick('settle-ms', 'settleMs') ?? DEFAULTS.settleMs),
    only: list(pick('only')) ?? [],
    skip: list(pick('skip')) ?? [],
    maxTabs: Number(pick('max-tabs', 'maxTabs') ?? DEFAULTS.maxTabs),
    json: flags.json === 'true',
  }
}

/** @param {RunConfig} cfg @param {string} route */
export function routeUrl(cfg, route) {
  if (/^[a-z]+:\/\//i.test(route)) return route
  return `${cfg.base}${route.startsWith('/') ? '' : '/'}${route}`
}

/** File-name-safe slug for a route. @param {string} route */
export function slug(route) {
  const s = route
    .replace(/^[a-z]+:\/\/[^/]*/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return s.slice(-80) || 'root'
}
