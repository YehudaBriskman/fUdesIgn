# Tables and charts in RTL

> Mirror a table's column order and its text alignment, but keep numbers aligned on their units digit (physically right) and keep a chart's plot unmirrored, with time running left to right, while titles, legends, labels and tooltips follow the page direction.

**Category:** Right-to-left layout and bidi · **Applies to:** data tables, sticky columns, horizontal scroll, sort indicators, time series, bar charts, legends, tooltips, SVG and canvas charts · **Priority:** must

## When to use / when not
- Use for every table and chart in a Hebrew or Arabic interface, and when a dashboard (dashboard-ui) gets an RTL locale.
- The general table and chart rules (sticky header, `tabular-nums`, chart by question, accessibility) are in dashboard-ui's `data-table-layout-and-typography.md` and `chart-accessibility.md`; this file covers only direction.

## Rules (do)
- **Tables: column order mirrors.** The first column (the row identifier) is on the right, and reading proceeds leftward. This follows from DOM order plus `dir="rtl"`; don't reorder columns in data.
- **Text cells align `start`** (right in RTL). Headers align with their column.
- **Numeric cells align on the units digit, which is physically right.** Digits are always LTR, so the units digit and decimal point of every value sit at its visual right end. With `text-align: end` (left in RTL) a column of `1,234.50`, `12.00` and `104,993.10` lines up on its first digit, not its decimal point; with `text-align: right` the decimal points line up (rendered in Chromium, November 2026). So in RTL tables use physical `right` for numeric columns, with a `physical-ok` comment, and `tabular-nums` as in `data-number-formatting.md`.
- **Put the currency in the header**, not in every cell, when a column holds one currency: `יתרה (₪)`. With per-cell `₪` the symbols float at different positions once decimals align.
- **Sticky first column**: `position: sticky; inset-inline-start: 0` sticks it to the right edge in RTL without extra rules.
- **Horizontal scroll starts at the right.** In RTL the initial scroll position is the inline-start (right) edge, and `scrollLeft` runs from 0 to negative values in current browsers (`scrollTo({ left: -100 })` reads back `-100` in Chromium). Code that assumes positive `scrollLeft` (scroll shadows, "scroll to column") breaks; use `scrollIntoView({ inline: "nearest" })` or normalise with `Math.abs`.
- **Sort and expand indicators** sit at the inline-end of the header text; expand chevrons point toward inline-end when collapsed (see `rtl-icons-directional.md`).
- **Charts: don't mirror the plot.** Material lists "Charts and graphs" among the items not mirrored in RTL; Wikimedia Codex says not to mirror them "if mirroring could impact data interpretation".
  - **Time series**: time runs left to right (oldest on the left) in Hebrew and Arabic interfaces too, per Material's not-mirrored list. Arabic-market products are less uniform than Hebrew ones, so if your audience's reference sources mirror, follow the all-or-nothing rule below. Keep the y-axis where the chart library puts it for LTR.
  - **Everything textual around the plot mirrors**: title, subtitle, legend and annotations align `start` (right); legend item order follows reading order; axis *labels* are in the page language and use `Intl` formatting.
  - **Category bar charts without time** (a ranked list of horizontal bars) may mirror: labels at the right, bars growing leftward, because no time axis is involved. Decide per product and keep it consistent; never mirror a chart whose companion table or tooltip doesn't.
  - If a product *does* mirror time series, mirror everything: x-axis, tooltips, keyboard navigation (ArrowLeft = later), the data table order, and the "latest value" annotation.
- **Tooltips and labels are RTL text**: render them in HTML with `dir` set, isolate values (`<bdi>`, `dir="ltr"` for numbers), and position the tooltip toward inline-start of the cursor so it doesn't cover the next point in reading order.
- **SVG text**: set `direction: rtl` on Hebrew/Arabic `<text>` and remember that `text-anchor="start"` then anchors the right end. Canvas: set `ctx.direction = "rtl"` before `fillText`, and `ctx.textAlign = "start"`.
- **Library switches**: Chart.js has `rtl` and `textDirection` on the legend and tooltip; check your library for the equivalent and set it from the page direction, not per chart.

## Anti-patterns (don't)
- Numeric columns `text-align: end` in RTL, so decimals don't line up.
- A `₪` in every cell of a decimal-aligned column.
- Mirrored time axis with an unmirrored data table beside it.
- Hard-coded `scrollLeft = 0` to "scroll to start" in RTL (it is already 0) or `scrollLeft = scrollWidth` to scroll to end (needs a negative value).
- English axis formatting (`Jan '26`, `1.2K`) in a Hebrew chart: format ticks with `Intl.DateTimeFormat` and `Intl.NumberFormat` for the page locale.
- Legends to the right of the plot in LTR and still on the right in RTL, when the layout otherwise mirrored. Place the legend at inline-end (or top, start-aligned).

## Good references
- [Material Design (v1), Bidirectionality](https://m1.material.io/usability/bidirectionality.html) — "Charts and graphs" in the not-mirrored list.
- [Wikimedia Codex, Bidirectionality](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) — don't mirror charts "if mirroring could impact data interpretation"; time elements keep their direction.
- [Chart.js, Legend configuration](https://www.chartjs.org/docs/latest/configuration/legend.html) — `rtl` and `textDirection` options for RTL legends (and the same on tooltips).
- [CSSOM View, scrolling](https://drafts.csswg.org/cssom-view/#dom-element-scrollleft) — the standardised negative `scrollLeft` in RTL scroll containers.
- dashboard-ui `data-table-layout-and-typography.md` and `chart-accessibility.md` — the direction-independent rules.

## Bad references
- Spreadsheet-style RTL tables that left-align every number because "numbers align to the end": the decimal points stop lining up, which is the job of numeric alignment (demonstrated with `he-IL` currency values in Chromium, November 2026).
- [androidx/media issue #227](https://github.com/androidx/media/issues/227) — the same mistake as a mirrored time axis, in a media timeline: time-based controls flipped by a generic RTL rule.

## Accessibility
- Table semantics (`<th scope>`, `<caption>`) are direction-independent; screen readers read columns in DOM order, which matches visual order once `dir="rtl"` is set.
- A chart's text summary and data table (dashboard-ui `chart-accessibility.md`) must be translated and use the same number and date formatting as the axes.
- Keyboard navigation over chart points follows the *visual* direction: if time runs left to right, ArrowRight is "later" even in RTL. Announce it in the chart's instructions.

## Motion / interaction (if relevant)
- New data in a live time series still enters from the right (the latest end), unmirrored.
- Horizontal-scroll affordances (fade masks) are physical gradients and need the `:dir(rtl)` swap described in `rtl-logical-properties.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Text cell alignment | `text-align: start` | labels, names |
| Numeric cell alignment | `text-align: right` (physical, both directions) | money, counts, percentages |
| Sticky column | `inset-inline-start: 0` | row header |
| Time axis | left → right, unmirrored | line, area, candlestick, bar-over-time |
| Category bars | may mirror, decide once | ranked horizontal bars |
| Legend and title | `text-align: start`, legend at inline-end or top | all charts |

## Implementation sketch
```css
table { border-collapse: collapse; font-variant-numeric: tabular-nums lining-nums; }
th, td { padding-block: var(--cell-pad-block, 8px); padding-inline: var(--cell-pad-inline, 12px); text-align: start; }
td.num, th.num {
  text-align: right; /* physical-ok: digits are LTR, align the units digit in both directions */
  white-space: nowrap;
}
th[scope="row"] { position: sticky; inset-inline-start: 0; background: var(--surface, #fff); }
.chart-plot { direction: ltr; } /* physical-ok: the plot never mirrors */
.chart-title, .chart-legend { text-align: start; }
```
```ts
/** Scroll a horizontal container to its inline-start or inline-end edge in either direction. */
export function scrollToInlineEdge(el: HTMLElement, edge: "start" | "end"): void {
  const rtl = getComputedStyle(el).direction === "rtl";
  const max = el.scrollWidth - el.clientWidth;
  // RTL: 0 is the start (right) edge and the end is negative
  const left = edge === "start" ? 0 : rtl ? -max : max;
  el.scrollTo({ left, behavior: "smooth" });
}

/** Distance scrolled from the inline-start edge, always positive. */
export const scrolledFromStart = (el: HTMLElement): number => Math.abs(el.scrollLeft);

/** Canvas label in the page direction. */
export function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, dir: "ltr" | "rtl"): void {
  ctx.direction = dir;
  ctx.textAlign = "start";
  ctx.fillText(text, x, y);
}
```
```html
<figure dir="rtl" lang="he">
  <figcaption class="chart-title">ההכנסות עלו ב־<span dir="ltr">12%</span> ברבעון השלישי</figcaption>
  <div class="chart-plot" role="img" aria-label="הכנסות לפי חודש, ינואר עד ספטמבר 2026">…</div>
  <table>
    <caption>הכנסות לפי חודש (₪)</caption>
    <thead><tr><th scope="col">חודש</th><th scope="col" class="num">הכנסות</th></tr></thead>
    <tbody><tr><th scope="row">ינואר</th><td class="num">1,234.50</td></tr></tbody>
  </table>
</figure>
```

## Checklist
- [ ] Table columns read right to left in RTL; text cells are `start`-aligned.
- [ ] Numeric columns line up on the decimal point in RTL (physical right alignment).
- [ ] Single-currency columns carry the symbol in the header.
- [ ] Scroll code works with negative `scrollLeft`.
- [ ] Time-series plots are not mirrored; titles, legends and tooltips are.
- [ ] Axis ticks use `Intl` formatting for the page locale.
- [ ] Chart and companion table agree on order and formatting.

## Sources
- https://m1.material.io/usability/bidirectionality.html
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://www.chartjs.org/docs/latest/configuration/legend.html
- https://drafts.csswg.org/cssom-view/#dom-element-scrollleft
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/direction
- https://github.com/androidx/media/issues/227
- dashboard-ui: `data-table-layout-and-typography.md`, `chart-accessibility.md`, `data-number-formatting.md`
- Local verification: Chromium rendering of an RTL table with `text-align: end` vs `right` on `he-IL` currency values; `scrollLeft` after `scrollTo({ left: -100 })` in an RTL container.
