# Canvas and WebGL charts that stay accessible and on-theme

> A canvas chart is a bitmap: it has no accessibility tree, no CSS and no theme. Give it a name, a DOM twin (summary plus table), a keyboard path, and colours read from the container's resolved tokens, and repaint it whenever the theme changes.

**Category:** Charts and data visualisation · **Applies to:** Chart.js, ECharts (canvas renderer), Highcharts boost, uPlot, deck.gl, Pixi/WebGL plots, lightweight-charts, any `<canvas>` or `<webgl>` mark layer · **Priority:** must (when any chart renders to canvas)

## When to use / when not
- **Use canvas** when the mark count is large or redraws are frequent: dense time series (tens of thousands of points), live tickers, heat maps with thousands of cells, scatter plots of 10k+ points. SVG creates one DOM node per mark and slows down long before that.
- **Prefer SVG or HTML** for small charts (a KPI sparkline, a 5-bar chart, a football field). They get CSS tokens, `forced-colors`, find-in-page and screen reader access for free. See `chart-accessibility.md` for the SVG path.
- **A hybrid is often best:** marks on canvas, while axes, labels, legend, annotations and the tooltip stay in the DOM over it. Text stays crisp, translatable and themable.
- This file is about what canvas *loses*. General chart accessibility (text alternatives, colour independence, tables) lives in `chart-accessibility.md`. Theme rules for the whole page live in `style-theme-consistency.md`.

## Rules (do)
**Name and describe**
- Give the `<canvas>` `role="img"` and an `aria-label` with a one-sentence takeaway, or set `aria-hidden="true"` when an adjacent DOM summary carries the meaning. Chart.js's own docs say the developer must add this: a canvas with no role or name is inaccessible, and fallback text like "your browser doesn't support canvas" doesn't count.
- Wrap the chart in `<figure role="group">` with a `<figcaption>`. WAI's complex-image tutorial wants a short description that names the chart and a long description with scales, values and trends. Put the long one in the DOM, not in `aria-describedby`, because that flattens tables and headings into one paragraph.
- Ship a **"View as table"** toggle with the same data the canvas draws. That's the reliable path for screen readers, keyboard users, copy-paste and translation.

**Keyboard path**
- Every hover interaction needs a keyboard equivalent. Either:
  - make the chart one tab stop (`tabindex="0"` on the wrapper) with arrow keys moving a "current point" and a live region announcing it, or
  - put real focusable elements (`<button>`s, one per series or point group) inside the `<canvas>` as fallback content, and call `ctx.drawFocusIfNeeded(path, element)` to draw the native focus ring on the matching mark. MDN lists `drawFocusIfNeeded` as Baseline widely available since 2016.
- Arrow keys: ←/→ move within a series, ↑/↓ switch series, Home/End jump to the ends, Esc clears. Announce "Nov 18, Price $342.56, Value $185.94" in a polite live region, at most once per key press.
- When a canvas can't offer point-level navigation, the keyboard path *is* the table. Say so in the rubric review (see `ref-design-review-rubric.md`).

**Colour and theme**
- **Never hard-code colours in the chart config.** Read role tokens from the chart's own container: `getComputedStyle(container).getPropertyValue('--chart-series-1')`. Don't read `matchMedia` and pick a palette yourself. The container may be in a different scheme than the OS (a forced-dark panel, a print preview, a user override).
- **Resolve to a concrete colour before handing it to canvas.** Canvas `fillStyle` accepts CSS colour strings, but not `var()` or `light-dark()`. Resolve the token via computed style on a probe element so `light-dark()`, `color-mix()` and `oklch()` come back as a used colour.
- **Repaint on every theme change:**
  - `matchMedia('(prefers-color-scheme: dark)')` `change` event (Baseline since 2020);
  - a `MutationObserver` on `<html>` for `data-theme` or `class` changes from an in-app toggle;
  - `matchMedia('(forced-colors: active)')` and `(prefers-contrast: more)` changes.
- **Forced colours:** canvas pixels are not adjusted by the browser. When `forced-colors: active` matches, draw with the system colours (`CanvasText`, `Canvas`, `Highlight`, `GrayText`) resolved the same way, and separate series by dash or marker shape.
- **Re-check contrast after resolving.** Marks need 3:1 against the chart background and text 4.5:1, in both themes (WCAG 1.4.11 and 1.4.3). A common failure: a price line drawn near-black on a near-black panel because the chart took the OS light-theme colours while its panel was forced dark.
- **Device pixel ratio:** size the backing store to `clientWidth × devicePixelRatio` and redraw on resize, so 1px rules and text stay sharp at 200% zoom.

**Library modules**
- **Highcharts:** load `accessibility.js` after the core. It adds keyboard navigation, screen-reader sections and ARIA. Without it, Highcharts logs a console warning. The `sonification` module adds audio charts, with pause-and-explore navigation.
- **ECharts:** accessibility is **off by default**. Set `aria: { enabled: true }` (`aria.show` in older docs) and, since v5, register `AriaComponent`. It generates an `aria-label` from title, type, series and data. Use `aria.description` for dense charts where an item-by-item label is useless. `aria.decal.show: true` adds patterns as a second channel besides colour.
- **Chart.js:** no built-in module. Add `role`, `aria-label` and fallback content yourself, and build the table separately.
- **WebGL (deck.gl, regl, Pixi):** treat it like canvas. Nothing is exposed. The DOM twin is mandatory.

**Optional: sonification**
- An audio rendering (pitch for value, time for x) helps blind users hear the shape of a long series. Offer it as an explicit "Play as sound" button with pause, never autoplay. Highcharts ships it as a module.

## Anti-patterns (don't)
- `<canvas>` with no role, no name and no fallback, or fallback text that only says canvas isn't supported.
- Chart colours chosen from `matchMedia` while the container uses a different theme (the half-dark page bug).
- Colours read once at mount and never refreshed, so toggling theme leaves an off-theme chart until reload.
- Hex literals in the chart config, bypassing tokens and `forced-colors`.
- Axis labels and legends painted into the bitmap. They can't be zoomed, translated, selected or read.
- Tooltips that only open on `mousemove`.
- An ECharts setup that sets `aria` options but never registers `AriaComponent`, so nothing happens.
- A per-point live region that fires on every animation frame or every streamed tick.

## Good references
- [Chart.js: Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html) — states plainly that canvas is invisible to screen readers, and shows `role="img"`, `aria-label` and meaningful fallback content.
- [Highcharts accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) — keyboard navigation, screen-reader sections, ARIA roles, plus low-vision, voice input and tactile export.
- [Highcharts: Getting started with audio charts](https://www.highcharts.com/docs/sonification/getting-started) — sonification as an opt-in module with interactive navigation.
- [Apache ECharts handbook: Web accessibility](https://echarts.apache.org/handbook/en/best-practices/aria) — the `aria` option, generated descriptions, `aria.description` for dense charts, and decal patterns.
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/) — short plus long description, placement with `<figure role="group">`, and why `aria-describedby` loses structure.
- [MDN: drawFocusIfNeeded()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) — native focus rings on canvas paths linked to fallback elements.
- [WAI-ARIA Graphics Module 1.0](https://www.w3.org/TR/graphics-aria-1.0/) — `graphics-document`, `graphics-object` and `graphics-symbol` roles (W3C Recommendation, 2018). Useful on SVG overlays; screen reader support is uneven, so keep `role="img"` on the canvas itself.

## Bad references
- [Chart.js: Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html) — its own "inaccessible" examples: a bare canvas, and one whose only fallback says the browser lacks canvas support. Many dashboards ship exactly that.
- [Apache Superset issue #28173](https://www.github.com/apache/superset/issues/28173) and [PR #28171](https://www.github.com/apache/superset/pull/28171) — a widely used BI tool rendered ECharts without `aria` until 2024, so every chart was a nameless bitmap.
- A valuation app reviewed while writing this skill (2026-11): canvas charts painted with light-theme colours inside a forced-dark panel. The price label disappeared and the value label fell well under 3:1.

## Accessibility
- Name: `role="img"` + `aria-label` on the canvas, or `aria-hidden="true"` with a DOM summary next to it. Not both.
- The data table is reachable by keyboard, has a `<caption>`, and uses the same formatting as the chart's labels.
- Focus ring: 2px, at least 3:1 against both the mark and the background (WCAG 2.4.7 and 2.4.11). Use `drawFocusIfNeeded` or draw it from the `--focus-ring` token.
- Live announcements are polite and throttled to one per key press. Streaming charts announce on demand ("Read latest" button), not per tick.
- Respect `prefers-reduced-motion`: turn off the library's animation (`animation: false` in Chart.js, `animation: false` in ECharts) under `reduce`. See `motion-reduced-motion.md`.
- Test at 200% zoom: the DOM overlay text must reflow, and the canvas must re-render at the new size.

## Motion / interaction (if relevant)
- Theme change repaints in one frame. Don't cross-fade the bitmap, since it shows a frame of mixed colours.
- Keyboard "current point" moves the same crosshair and tooltip as hover (see `chart-tooltips-crosshair-labels.md`).
- Library entry animations default on in Chart.js and ECharts. Keep them ≤ 300ms or turn them off for dashboards that refresh often.

## Tokens and values
| Token | Default | Use |
|---|---|---|
| `--chart-series-1…7` | maps to `--cat-1…7` | resolved per container, then passed to the library |
| `--chart-axis` / `--chart-grid` | `--text-muted` / `--border` | axes and gridlines |
| `--chart-bg` | `--surface` | canvas clear colour (don't leave it transparent if the library composites text) |
| `--focus-ring` | existing token | focused mark outline |
| Mark contrast | ≥ 3:1 vs `--chart-bg` | both themes |
| Live-region rate | ≤ 1 announcement per key press | keyboard navigation |
| SVG → canvas switch | roughly 1k–5k marks, measure first | renderer choice |
| Backing store | `clientWidth × devicePixelRatio` | sharp at zoom |

## Implementation sketch
```ts
export type ChartPalette = {
  series: string[]
  axis: string
  grid: string
  bg: string
  text: string
  focus: string
  forced: boolean
}

const ROLES = ['--chart-axis', '--chart-grid', '--chart-bg', '--text', '--focus-ring'] as const

/** Resolve a custom property to a used colour, in the container's own scheme. */
function resolveColor(container: HTMLElement, token: string, fallback: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token}, ${fallback})`
  probe.style.display = 'none'
  container.append(probe)
  const used = getComputedStyle(probe).color // light-dark(), color-mix(), oklch() come back resolved
  probe.remove()
  return used
}

export function readChartPalette(container: HTMLElement, seriesCount: number): ChartPalette {
  const forced = matchMedia('(forced-colors: active)').matches
  if (forced) {
    const c = (sys: string) => resolveColor(container, '--__none', sys)
    return { series: Array.from({ length: seriesCount }, () => c('CanvasText')), axis: c('CanvasText'),
      grid: c('GrayText'), bg: c('Canvas'), text: c('CanvasText'), focus: c('Highlight'), forced }
  }
  const [axis, grid, bg, text, focus] = ROLES.map((t) => resolveColor(container, t, 'CanvasText'))
  const series = Array.from({ length: seriesCount }, (_, i) =>
    resolveColor(container, `--chart-series-${i + 1}`, `var(--cat-${(i % 7) + 1})`))
  return { series, axis, grid, bg, text, focus, forced }
}

/** Call `repaint` whenever anything that can change the resolved palette changes. Returns a cleanup. */
export function watchTheme(container: HTMLElement, repaint: () => void): () => void {
  const queries = ['(prefers-color-scheme: dark)', '(forced-colors: active)', '(prefers-contrast: more)']
    .map((q) => matchMedia(q))
  const onChange = () => requestAnimationFrame(repaint)
  queries.forEach((q) => q.addEventListener('change', onChange))
  const mo = new MutationObserver(onChange)
  for (let el: HTMLElement | null = container; el; el = el.parentElement)
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] })
  const ro = new ResizeObserver(onChange)
  ro.observe(container)
  return () => {
    queries.forEach((q) => q.removeEventListener('change', onChange))
    mo.disconnect()
    ro.disconnect()
  }
}

/** Size the backing store for sharp lines at any zoom. */
export function fitCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(canvas.clientWidth * dpr)
  canvas.height = Math.round(canvas.clientHeight * dpr)
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}
```
```html
<figure role="group" class="cv-chart" aria-labelledby="pv-cap">
  <figcaption id="pv-cap">Price vs estimated value, last 5 years (USD). Price has stayed above value since 2023.</figcaption>
  <div class="cv-stage" tabindex="0" aria-describedby="pv-help">
    <canvas role="img" aria-label="Line chart: price rose from $130 to $343 while estimated value rose from $120 to $186.">
      <button data-series="price">Price series</button>
      <button data-series="value">Value series</button>
    </canvas>
    <!-- axes, labels and tooltip stay in the DOM over the canvas -->
  </div>
  <p id="pv-help" class="sr-only">Arrow keys move between points. Up and down switch series.</p>
  <p class="sr-only" aria-live="polite" data-chart-announcer></p>
  <details><summary>View as table</summary><table><!-- same data, same formatting --></table></details>
</figure>
```
```css
.cv-stage { position: relative; block-size: 320px; }
.cv-stage canvas { inline-size: 100%; block-size: 100%; display: block; }
.cv-stage:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.cv-chart { color-scheme: inherit; background: var(--surface); }
```

## Checklist
- [ ] Every canvas has `role="img"` + a takeaway `aria-label`, or is hidden next to a DOM summary.
- [ ] A "View as table" with the same data and formatting is one keyboard step away.
- [ ] Hover details are reachable by keyboard, with throttled polite announcements.
- [ ] Chart colours come from the container's resolved tokens, with no hex in the chart config.
- [ ] The chart repaints on OS scheme change, in-app theme toggle, forced colours and resize.
- [ ] Marks reach 3:1 and text 4.5:1 in both themes, checked with screenshots of each.
- [ ] Library accessibility is switched on (Highcharts `accessibility.js`, ECharts `aria.enabled` + `AriaComponent`).

## Sources
- https://www.chartjs.org/docs/latest/general/accessibility.html
- https://www.highcharts.com/docs/accessibility/accessibility-module
- https://www.highcharts.com/docs/sonification/getting-started (search summary only)
- https://www.highcharts.com/docs/sonification/navigation (search summary only)
- https://echarts.apache.org/handbook/en/best-practices/aria
- https://www.github.com/apache/superset/issues/28173 (search summary only)
- https://www.github.com/apache/superset/pull/28171 (search summary only)
- https://www.w3.org/WAI/tutorials/images/complex/
- https://www.w3.org/TR/graphics-aria-1.0/
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded
- https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event (search summary only)
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility (fetch failed, 404; page removed)
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Internal dogfood review of a valuation app, 2026-11-21 (rubric G4)
- Repo: patterns/chart-accessibility.md, patterns/color-dark-mode.md
