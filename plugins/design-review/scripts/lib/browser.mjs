// Browser discovery and page loading shared by capture.mjs and gate.mjs.
import { existsSync } from 'node:fs'
import { chromium } from 'playwright-core'

// Checked in order when no --executable-path or DESIGN_REVIEW_CHROME is given.
const CANDIDATES = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/opt/google/chrome/chrome',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
]

/**
 * Pick a Chromium binary: --executable-path, then DESIGN_REVIEW_CHROME, then the usual
 * install locations. Returns undefined when nothing is found, which lets
 * playwright-core fall back to a browser installed with `playwright-core install chromium`.
 * @param {string | undefined} explicit
 * @returns {string | undefined}
 */
export function findExecutable(explicit) {
  const wanted = explicit || process.env.DESIGN_REVIEW_CHROME
  // "bundled" skips discovery and uses the browser from `playwright-core install chromium`
  if (wanted === 'bundled') return undefined
  if (wanted) {
    if (!existsSync(wanted)) throw new Error(`executable not found: ${wanted}`)
    return wanted
  }
  return CANDIDATES.find((p) => existsSync(p))
}

/** @param {{ executablePath?: string }} options */
export async function launch(options) {
  const executablePath = findExecutable(options.executablePath)
  try {
    return await chromium.launch({ executablePath, headless: true })
  } catch (error) {
    const hint = executablePath
      ? `could not start ${executablePath}`
      : 'no system Chrome or Chromium found; run `npx playwright-core install chromium` or pass --executable-path'
    throw new Error(`${hint}\n${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Create a context for one theme and viewport. The theme is applied through
 * prefers-color-scheme and, when asked, an attribute or localStorage key set before any script runs.
 * @param {import('playwright-core').Browser} browser
 * @param {{ theme: string, width: number, height: number, themeAttr?: string, themeStorage?: string, reducedMotion?: boolean }} o
 */
export async function newContext(browser, o) {
  const scheme = o.theme === 'dark' ? 'dark' : 'light'
  const context = await browser.newContext({
    viewport: { width: o.width, height: o.height },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: o.reducedMotion ? 'reduce' : 'no-preference',
    hasTouch: o.width < 600,
    isMobile: false,
  })
  if (o.themeAttr || o.themeStorage) {
    await context.addInitScript(
      ({ attr, key, theme }) => {
        if (attr) document.documentElement.setAttribute(attr, theme)
        if (key) {
          try {
            localStorage.setItem(key, theme)
          } catch {
            // storage can be blocked on file:// pages
          }
        }
      },
      { attr: o.themeAttr || '', key: o.themeStorage || '', theme: o.theme },
    )
  }
  return context
}

/**
 * Navigate and wait until the page is quiet: load, then network idle (bounded), fonts, then a settle delay.
 * @param {import('playwright-core').Page} page
 * @param {string} url
 * @param {number} settleMs
 */
export async function load(page, url, settleMs) {
  await page.goto(url, { waitUntil: 'load', timeout: 45000 })
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined)
  await page.evaluate(() => document.fonts.ready.then(() => true)).catch(() => undefined)
  await page.waitForTimeout(settleMs)
}
