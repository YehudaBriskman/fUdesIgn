#!/usr/bin/env node
// Capture evidence for a design review: one full-page screenshot per route × theme ×
// viewport, plus facts.json with the computed facts the gate reasons over (text colours
// against their effective backgrounds, surface samples, targets, media, overflow).
//
//   node scripts/capture.mjs --base http://localhost:3000 --routes /,/reports/q3
//   node scripts/capture.mjs --url test/fixtures/good.html --themes light --viewports 390x844
//
// Screenshots are what the fresh-eye reviewer gets, and nothing else.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs, routeUrl, slug } from './lib/cli.mjs'
import { launch, load, newContext } from './lib/browser.mjs'
import { probePage } from './lib/probe.mjs'
import { contrast, luminance, over } from './lib/color.mjs'

async function main() {
  const cfg = parseArgs(process.argv.slice(2))
  mkdirSync(cfg.out, { recursive: true })
  const browser = await launch(cfg)
  const shots = []
  try {
    for (const route of cfg.routes) {
      const url = routeUrl(cfg, route)
      for (const vp of cfg.viewports) {
        for (const theme of cfg.themes) {
          const context = await newContext(browser, { theme, width: vp.width, height: vp.height, themeAttr: cfg.themeAttr, themeStorage: cfg.themeStorage })
          const page = await context.newPage()
          try {
            await load(page, url, cfg.settleMs)
            const file = `${slug(route)}-${theme}-${vp.width}.png`
            await page.screenshot({ path: join(cfg.out, file), fullPage: true, animations: 'disabled' })
            const facts = await page.evaluate(probePage, { maxTexts: 4000, sampleCols: 16, sampleStep: 120, maxSampleRows: 60 })
            // A compact summary first, so a reader does not need the raw arrays.
            const ratios = facts.texts.filter((t) => t.bg).map((t) => contrast(over(t.fg, t.bg), t.bg))
            const dark = facts.samples.filter((s) => !s.chrome && luminance(s.colour) < 0.12).length
            const light = facts.samples.filter((s) => !s.chrome && luminance(s.colour) > 0.45).length
            shots.push({
              route,
              url,
              theme,
              viewport: `${vp.width}x${vp.height}`,
              screenshot: file,
              summary: {
                title: facts.title,
                pageSize: { width: facts.document.scrollWidth, height: facts.document.scrollHeight },
                horizontalOverflow: facts.document.scrollWidth > facts.document.clientWidth + 1,
                textElements: facts.texts.length,
                textWithUnknownBackground: facts.texts.filter((t) => !t.bg).length,
                minTextContrast: ratios.length ? Math.round(Math.min(...ratios) * 100) / 100 : null,
                surfaceSamples: { dark, light, total: facts.samples.length },
                targets: facts.targets.length,
                canvases: facts.canvases.length,
                mediaWithoutAlternative: facts.media.length,
              },
              facts,
            })
            process.stderr.write(`capture: ${file}\n`)
          } finally {
            await context.close()
          }
        }
      }
    }
  } finally {
    await browser.close()
  }
  writeFileSync(join(cfg.out, 'facts.json'), `${JSON.stringify({ generated: new Date().toISOString(), shots }, null, 2)}\n`)
  process.stdout.write(`capture: ${shots.length} screenshot(s) and facts.json in ${cfg.out}\n`)
}

main().catch((error) => {
  process.stderr.write(`capture: ${error instanceof Error ? error.stack : String(error)}\n`)
  process.exitCode = 2
})
