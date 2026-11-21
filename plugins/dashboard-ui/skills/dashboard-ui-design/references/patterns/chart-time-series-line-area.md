# Line and area time series

> Lines show change by slope and position, so they may crop the y-axis; areas show amount by filled height, so they must start at zero; gaps in data stay visible gaps, and events get annotations, not legend entries.

**Category:** Charts and data visualisation · **Applies to:** revenue/usage trends, price history, KPI detail views, forecast vs actual · **Priority:** must

## When to use / when not
- Line: ordered x (time), 10+ points, one to ~5 highlighted series. Also the right answer for "which share overtook which" (Datawrapper area guide).
- Stacked area: only when the total is meaningful and you have several series and many dates. Fewer than ~10 dates: stacked columns read better.
- Not for unordered categories (use bars), not for a single value per period with only 3 to 6 periods (use columns), not for comparing shares at one moment.

## Rules (do)
**Axes and baselines**
- Line y-axis may start above zero (Datawrapper: lines "don't need to start from zero"; Carbon axes). Cropping still exaggerates perceived change on lines (Correll et al., CHI 2020), so apply Gelman's rule: "if zero is in the neighborhood, invite it in" (Kosara, Observable 2024). Extend to 100% for shares near 100% (Datawrapper line charts).
- Area y-axis starts at zero, always. Datawrapper: area charts need a zero baseline, so small differences are hard to see; if differences are small, use a line instead.
- Prefer "soft" auto-ranges: let the axis expand to include the data, never clip spikes. Grafana distinguishes soft min/max (preferred limits that keep small wiggles from being magnified) from hard min/max (which clip values and can hide spikes). Use soft limits; never hard-clip.
- When cropping, pick a range where the data fills roughly 60 to 80% of plot height. Cropping that turns a 0.3% move into a cliff is the line-chart version of the truncated bar (see chart-honesty-chartjunk.md).
- Use 3 to 6 horizontal gridlines at round values ("nice" ticks: 1, 2, 2.5, 5 × 10ⁿ). Gridlines in a muted token, 1 px, no vertical gridlines on time series unless the reader needs to read exact dates.
- Time axis: never change tick increments to fit data availability (Carbon). Mark period boundaries ("landmark" labels: new day, month, year) in semibold (Carbon axes and labels).
- Localise dates with `Intl.DateTimeFormat`; first tick shows the full context ("Jan 2025"), later ticks show only what changed ("Feb", "Mar").
- Log scale for series spanning more than ~2 orders of magnitude or when the question is growth rate. Label it "log scale" in the axis title.

**Gaps and nulls**
- Never interpolate across periods with no data; label the start and end of each unavailable period (Carbon). In Grafana terms: connect nulls "Never", or "Threshold" (bridge gaps up to one expected interval only).
- Distinguish "zero" from "no data": a drop to zero is a value; a gap is a missing value. Do not coerce `null` to `0`.
- Partial current period (this month so far): draw dashed or lighter, and label "partial" or "month to date". A solid line dropping at the right edge is the most common false alarm on dashboards.

**Lines and labels**
- Stroke 1.5 to 2 px for the primary series; 1 px for context series in a grey token. Highlight with colour, width and dashes; push comparison series to grey (Datawrapper).
- Label lines directly at the right end, in the line's colour, instead of a legend when there are 5 or fewer lines (see chart-tooltips-crosshair-labels.md).
- No point markers when dates are evenly spaced and dense; use markers when you have few points or irregular sampling (Datawrapper; NN/g CSAT example adds markers to show when data was collected).
- Avoid aggressive smoothing. Datawrapper recommends its "Curved" option over "Curved (natural)" and "Curved (cardinal)", calling it "a still smooth but more honest line"; natural and cardinal splines overshoot and invent peaks. In d3, `curveMonotoneX` has the same no-overshoot property; never `curveCardinal`/`curveBasis` for data.
- Aspect ratio: wider than tall. Tufte: graphics "moderately greater in length than in height"; aim for average slopes near 45° (Cleveland banking). Typical dashboard panel: 2:1 to 3:1.

**Annotations**
- Annotate events (launch, price change, outage) with a vertical rule and a short label inside the plot. Use highlighted ranges for periods (recession, projection). Datawrapper: "Use a highlight range when values shift into projections."
- Annotations must not cover data (Carbon dashboards: "Avoid annotations that obstruct the view of data").
- Two text levels at most: a small grey style and a larger dark style (Datawrapper text guide).

**Stacked area specifics**
- Put the most important series at the bottom on the shared baseline, in the highlight colour (Datawrapper).
- Max ~5 bands; group the rest into "Other".
- Do not use stacked area to compare upper bands: their baselines move.

## Anti-patterns (don't)
- Cropped area charts: the filled region claims "this much", so cropping lies.
- Hard-clipped y-axis that silently hides a spike.
- `connectNulls: true` over a 3-week outage, which draws a confident straight line through missing data.
- Treating "today" as a full period (cliff at the right edge).
- Gradient fills under a line that encode nothing (Grafana "gradient mode" by opacity is fine as decoration only when one series).
- 12 coloured lines with a 12-item legend ("spaghetti"). Use highlight + grey, or small multiples.
- Cardinal/basis spline smoothing that draws peaks that never existed.
- Dual y-axes to put two units on one line chart (see chart-honesty-chartjunk.md).

## Good references
- [Datawrapper: line charts](https://www.datawrapper.de/blog/line-charts) — concrete rules: no zero needed, add zero when near, grey context lines, label colour matches line, monotone curve only.
- [Datawrapper: area charts](https://www.datawrapper.de/blog/area-charts) — when area beats line and the ten-date threshold.
- [IBM Carbon axes and labels](https://carbondesignsystem.com/data-visualization/axes-and-labels/) — never interpolate missing periods, label gap start/end, landmark labels, axis break spec (16 px break, 0.5 px stroke inside).
- [Grafana time series panel](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/time-series/) — explicit null-handling modes (Never / Always / Threshold) and soft vs hard min/max; a good model for settings to expose.
- [Datawrapper: why bars start at zero](https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero) — bars must start at zero; dot plots and lines need not.

## Bad references
- [Reuters "Gun deaths in Florida" (2014)](https://www.livescience.com/45083-misleading-gun-death-chart.html) — inverted y-axis with red fill from the top: deaths rose after 2005 but the chart reads as a fall. Area fill plus inverted axis made the drop-looking shape dominant.
- [Datawrapper dual-axis GDP example](https://www.datawrapper.de/blog/dualaxis/) — two lines that "grow at similar rates" on separate axes, while real growth was ~80% vs ~40%.
- Default library behaviour that connects nulls (for example Recharts `connectNulls`, Tremor `connectNulls`): defaults are `false` in Tremor, which is correct; watch for teams flipping it to make a chart "look complete".

## Accessibility
- Lines need 3:1 contrast against the background (WCAG 1.4.11); grey context lines are decorative-ish but the highlighted series must pass.
- Do not rely on colour alone to separate lines: add direct labels, dash patterns or end markers with different shapes (Highcharts low-vision features).
- Provide the summary sentence and a table view (see chart-accessibility.md).

## Motion / interaction (if relevant)
- Draw-in animation (line path growing) at most 400 to 600 ms, once, only under `prefers-reduced-motion: no-preference`. On data refresh, do not re-animate from zero; transition values in ≤250 ms or swap instantly.
- Zoom/brush: show the selected range in text ("1 Mar to 14 Apr 2025") and a reset button.
- Hover crosshair snaps to the nearest x (see chart-tooltips-crosshair-labels.md).

## Tokens and values
| Token | Default |
|---|---|
| `--chart-line-primary-width` | 2px |
| `--chart-line-context-width` | 1px |
| `--chart-line-context-color` | neutral 400 (≥3:1 only if it carries meaning) |
| `--chart-grid-color` | neutral 200, 1px, solid |
| `--chart-grid-count` | 3 to 6 horizontal lines |
| `--chart-annotation-text` | 12px, neutral 600 |
| `--chart-label-text` | 12px min (Chartability: nothing under 12px) |
| `--chart-partial-dash` | `4 3` stroke-dasharray |
| Aspect ratio (panel) | 2:1 to 3:1 |
| Area fill opacity | 0.15 to 0.25 single series; 1.0 stacked |
| Interpolation | linear or monotoneX |

## Implementation sketch
```html
<figure class="ts" aria-labelledby="ts-title" aria-describedby="ts-summary">
  <figcaption>
    <h3 id="ts-title">Monthly active users passed 40k in March</h3>
    <p id="ts-summary">MAU grew from 31,200 in Oct 2024 to 41,800 in Mar 2025. No data 12 to 18 Jan (outage). April is month to date.</p>
  </figcaption>
  <svg viewBox="0 0 600 240" role="img" aria-labelledby="ts-title" aria-describedby="ts-summary">
    <g class="grid" aria-hidden="true"><!-- 4 horizontal lines --></g>
    <!-- Two path segments: the gap is a real gap, not a connected line -->
    <path class="series" pathLength="1" d="M40,180 L120,170 L200,150" />
    <path class="series" pathLength="1" d="M260,140 L340,120 L420,100" />
    <path class="series partial" d="M420,100 L470,96" />
    <g class="gap-label"><text x="230" y="40">No data</text></g>
    <text class="end-label" x="476" y="96">MAU 41.8k</text>
  </svg>
</figure>
```
```css
.ts { --line: var(--chart-1); }
.ts .series { fill: none; stroke: var(--line); stroke-width: 2; stroke-linejoin: round; }
.ts .partial { stroke-dasharray: 4 3; opacity: .7; }
.ts .grid line { stroke: var(--chart-grid); stroke-width: 1; }
.ts text { font: 12px/1.2 var(--font-ui); fill: var(--text-muted); font-variant-numeric: tabular-nums; }
.ts .end-label { fill: var(--line); font-weight: 600; }
@media (prefers-reduced-motion: no-preference) {
  .ts .series[pathLength] { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw .5s ease-out forwards; }
}
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (forced-colors: active) { .ts .series { stroke: CanvasText; } }
```

## Checklist
- [ ] Area charts start at zero; line charts either start at zero or the crop is a deliberate, labelled choice.
- [ ] No hard-clipped y-axis; spikes remain visible.
- [ ] Missing data renders as a gap with a label; nulls are not zeros.
- [ ] Partial current period is visually distinct and labelled.
- [ ] ≤5 coloured lines; extras are grey context or small multiples.
- [ ] Lines are labelled directly at the end when space allows.
- [ ] Interpolation is linear or monotone; no overshooting splines.
- [ ] Key events are annotated in-plot without covering data.

## Sources
- https://www.datawrapper.de/blog/line-charts
- https://www.datawrapper.de/blog/area-charts
- https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero
- https://www.datawrapper.de/blog/text-in-data-visualizations
- https://www.datawrapper.de/blog/dualaxis/
- https://carbondesignsystem.com/data-visualization/axes-and-labels/
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/time-series/
- https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
- https://web.archive.org/web/20260719070816/https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is
- https://doi.org/10.1145/3313831.3376222
- https://www.nngroup.com/articles/choosing-chart-types/
- https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- https://www.livescience.com/45083-misleading-gun-death-chart.html
- https://www.tremor.so/docs/visualizations/spark-charts
- https://chartability.fizz.studio/ and https://github.com/Chartability/POUR-CAF
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
