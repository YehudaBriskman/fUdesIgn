#!/usr/bin/env node
// Rendered design gate: load each route in each theme and viewport, run deterministic
// detectors, write gate.json and gate.md, and exit 1 when any finding remains.
//
//   node scripts/gate.mjs --base http://localhost:3000 --routes /,/reports
//   node scripts/gate.mjs --url test/fixtures/bad.html --viewports 390x844
//
// Waive one element with data-design-review-ignore="DR-ID[,DR-ID]"; skip a detector with --skip.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs, routeUrl } from './lib/cli.mjs'
import { launch, load, newContext } from './lib/browser.mjs'
import { describePos, histogram, inspectFocused, positions, probePage, runningMotion, snapshotFocusBase } from './lib/probe.mjs'
import { DETECTORS, PATTERNS, canvasInk, detectAll, detectCanvasInk, detectCanvasThemeDrift } from './lib/detectors.mjs'

const PROBE_OPTS = { maxTexts: 4000, sampleCols: 16, sampleStep: 120, maxSampleRows: 60 }

/** @typedef {import('./lib/detectors.mjs').Finding} Finding */

/** Tab through the page and report stops whose focus state looks like the resting state. */
async function focusWalk(page, shot, maxTabs) {
  /** @type {Finding[]} */
  const out = []
  const base = await page.evaluate(snapshotFocusBase)
  const seen = new Set()
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab')
    const f = await page.evaluate(inspectFocused, base)
    if (!f) {
      if (i > 0) break
      continue
    }
    if (seen.has(f.key)) break
    seen.add(f.key)
    if (!f.visibleChange && !f.ignored) {
      out.push({ id: 'DR-FOCUS-VISIBLE', route: shot.route, theme: shot.theme, viewport: shot.viewport, selector: f.selector, message: `Tab stop ${i + 1} "${f.text}" shows no outline, shadow, border, background, colour or underline change` })
    }
  }
  return out
}

/** Load once with reduced motion emulated and look for movement. */
async function reducedMotion(browser, cfg, route, url, vp, theme) {
  const context = await newContext(browser, { theme, width: vp.width, height: vp.height, themeAttr: cfg.themeAttr, themeStorage: cfg.themeStorage, reducedMotion: true })
  const page = await context.newPage()
  /** @type {Finding[]} */
  const out = []
  const shot = { route, theme, viewport: vp.name }
  try {
    await load(page, url, cfg.settleMs)
    for (const a of await page.evaluate(runningMotion)) {
      out.push({ id: 'DR-REDUCED-MOTION', ...shot, selector: a.selector, message: `${a.name} animates ${a.properties.join(', ')} for ${a.duration}ms${a.infinite ? ', infinitely' : ''}` })
    }
    // rAF-driven movement: an element that moves in two consecutive 400ms windows
    const p0 = await page.evaluate(positions)
    await page.waitForTimeout(400)
    const p1 = await page.evaluate(positions)
    await page.waitForTimeout(400)
    const p2 = await page.evaluate(positions)
    const moved = (a, b, k) => a[k] && b[k] && Math.hypot(a[k][0] - b[k][0], a[k][1] - b[k][1]) > 2
    const ids = Object.keys(p1).filter((k) => moved(p0, p1, k) && moved(p1, p2, k))
    if (ids.length) {
      const names = (await page.evaluate(describePos, ids.slice(0, 50))).filter((n) => n !== null)
      const already = new Set(out.map((f) => f.selector))
      const fresh = [...new Set(names)].filter((n) => !already.has(n))
      if (fresh.length) out.push({ id: 'DR-REDUCED-MOTION', ...shot, selector: fresh[0], message: `${fresh.length} element(s) keep moving with no CSS or Web Animation behind it (script-driven): ${fresh.slice(0, 5).join(', ')}` })
    }
  } finally {
    await context.close()
  }
  return out
}

/** Run every detector for one route, theme and viewport. */
async function runShot(browser, cfg, route, url, theme, vp, inks) {
  const context = await newContext(browser, { theme, width: vp.width, height: vp.height, themeAttr: cfg.themeAttr, themeStorage: cfg.themeStorage })
  const page = await context.newPage()
  const shot = { route, theme, viewport: vp.name, width: vp.width }
  /** @type {Finding[]} */
  let findings = []
  try {
    await load(page, url, cfg.settleMs)
    const facts = await page.evaluate(probePage, PROBE_OPTS)
    findings = detectAll(shot, facts)
    for (const c of facts.canvases) {
      const png = await page.locator(`[data-dr-canvas="${c.index}"]`).screenshot({ animations: 'disabled' }).catch(() => null)
      if (!png) continue
      const hist = await page.evaluate(histogram, png.toString('base64'))
      findings.push(...detectCanvasInk(shot, c, hist))
      const ink = canvasInk(c, hist)
      if (ink && ink.ink >= 200) inks.push({ index: c.index, selector: c.selector, theme, bg: ink.bg, share: ink.share })
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    findings.push(...(await focusWalk(page, shot, cfg.maxTabs)))
  } finally {
    await context.close()
  }
  return findings
}

/** @param {Finding[]} findings @param {string[]} ids */
function markdown(findings, ids, meta) {
  const lines = [`# Design gate: ${findings.length ? 'FAIL' : 'PASS'}`, '', `${meta.urls.length} route(s) × ${meta.themes.join('/')} × ${meta.viewports.join(', ')}. ${findings.length} finding(s).`, '', '| Detector | Count | Threshold |', '|---|---:|---|']
  for (const id of ids) lines.push(`| \`${id}\` ${DETECTORS[id].title} | ${findings.filter((f) => f.id === id).length} | ${DETECTORS[id].threshold} |`)
  for (const id of ids) {
    const hits = findings.filter((f) => f.id === id)
    if (!hits.length) continue
    lines.push('', `## ${id} (${hits.length})`, '', `Fix: ${DETECTORS[id].fix} See \`${PATTERNS}/${DETECTORS[id].pattern}\`.`, '')
    for (const f of hits.slice(0, 25)) lines.push(`- \`${f.route}\` ${f.theme} ${f.viewport}: \`${f.selector}\` — ${f.message}`)
    if (hits.length > 25) lines.push(`- … and ${hits.length - 25} more in gate.json`)
  }
  return `${lines.join('\n')}\n`
}

async function main() {
  const cfg = parseArgs(process.argv.slice(2))
  const ids = Object.keys(DETECTORS).filter((id) => (!cfg.only.length || cfg.only.includes(id)) && !cfg.skip.includes(id))
  const browser = await launch(cfg)
  /** @type {Finding[]} */
  let findings = []
  try {
    for (const route of cfg.routes) {
      const url = routeUrl(cfg, route)
      for (const vp of cfg.viewports) {
        /** @type {{ index: number, selector: string, theme: string, bg: number[], share: number }[]} */
        const inks = []
        for (const theme of cfg.themes) {
          findings.push(...(await runShot(browser, cfg, route, url, theme, vp, inks)))
          process.stderr.write(`gate: ${route} ${theme} ${vp.name}\n`)
        }
        for (const a of inks) {
          for (const b of inks) {
            if (a.index !== b.index || a.theme === b.theme || a.share >= b.share) continue
            findings.push(...detectCanvasThemeDrift({ route, theme: a.theme, viewport: vp.name, width: vp.width }, a, b))
          }
        }
        if (ids.includes('DR-REDUCED-MOTION')) findings.push(...(await reducedMotion(browser, cfg, route, url, vp, cfg.themes[0])))
      }
    }
  } finally {
    await browser.close()
  }
  findings = findings.filter((f) => ids.includes(f.id))
  const counts = Object.fromEntries(ids.map((id) => [id, findings.filter((f) => f.id === id).length]))
  const meta = { urls: cfg.routes.map((r) => routeUrl(cfg, r)), themes: cfg.themes, viewports: cfg.viewports.map((v) => `${v.width}x${v.height}`) }
  const report = { pass: findings.length === 0, generated: new Date().toISOString(), ...meta, detectors: ids.map((id) => ({ id, ...DETECTORS[id], count: counts[id] })), findings }
  mkdirSync(cfg.out, { recursive: true })
  writeFileSync(join(cfg.out, 'gate.json'), `${JSON.stringify(report, null, 2)}\n`)
  const md = markdown(findings, ids, meta)
  writeFileSync(join(cfg.out, 'gate.md'), md)
  if (cfg.json) process.stdout.write(`${JSON.stringify(report)}\n`)
  else {
    process.stdout.write(`${ids.map((id) => `${counts[id] ? 'FAIL' : 'ok  '} ${id.padEnd(22)} ${counts[id]}`).join('\n')}\n`)
    process.stdout.write(`gate: ${report.pass ? 'PASS' : 'FAIL'} (${findings.length} findings) — ${join(cfg.out, 'gate.md')}\n`)
  }
  process.exitCode = report.pass ? 0 : 1
}

main().catch((error) => {
  process.stderr.write(`gate: ${error instanceof Error ? error.stack : String(error)}\n`)
  process.exitCode = 2
})
