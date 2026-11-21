# Bad chart gallery

> Learn the failure modes from named, documented examples: for each one know what the reader believed, what the data said, which rule broke, and the fix.

**Category:** Charts and data visualisation · **Applies to:** design reviews, onboarding, chart linting, PR review of chart code · **Priority:** should

## When to use / when not
- Use as a review companion to chart-honesty-chartjunk.md, chart-bars-baseline-sorting.md and chart-pies-donuts-gauges.md: when a chart "looks off", find its twin here.
- Use the "dashboard twins" section for failure modes that happen in product UIs, not just in media.
- Not a style guide on its own: each entry points to the pattern file with the rules.

## Rules (do)
For every entry the gallery records: **What it showed · What was true · Rule broken · Fix**. Add new entries in the same shape, with a link to a public critique, never to a private customer chart.

### Media and public examples

**1. Fox Business, "If Bush tax cuts expire" (2012)**
- Showed: two bars, "Now 35%" and "Jan 1, 2013 39.6%", the second about six times taller.
- True: +4.6 percentage points, about +13%.
- Rule broken: bar axis started at 34; axis labels placed on the far right where few look. Lie factor ≈ 35.
- Fix: zero-based bars, or a single number "Top rate rises from 35% to 39.6%".
- Critiques: [Storytelling with Data](https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline), [Media Matters](https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition), [FlowingData](https://flowingdata.com/2012/08/06/fox-news-continues-charting-excellence/).

**2. Reuters, "Gun deaths in Florida" (2014)**
- Showed: a red shape that appears to fall sharply after the 2005 "Stand Your Ground" law.
- True: deaths rose (by more than 200 in two years per Business Insider's reporting).
- Rule broken: inverted y-axis (0 at top) with an area fill that reads as blood dripping, without a strong cue that "down is more". The designer cited an Iraq casualties chart as inspiration; critics noted that one had cues this one lacked.
- Fix: conventional axis, line not area; annotate the law's date.
- Critiques: [Live Science](https://www.livescience.com/45083-misleading-gun-death-chart.html), [Pacific Standard](https://psmag.com/news/mislead-charts-stand-ground-laws-gun-deaths-79726/), [Misbar fact check (archived)](https://web.archive.org/web/20241107233138/https://seo.misbar.com/en/factcheck/2021/06/30/florida-gun-deaths-graph-inverted-data).

**3. Apple keynote, US smartphone market share (Macworld 2008)**
- Showed: a tilted 3D pie with Apple's slice in the foreground.
- True: Apple 19.5% was smaller than a 21.2% competitor slice that sat at the back and looked smaller.
- Rule broken: 3D perspective inflates near slices; pie used to compare close values.
- Fix: sorted horizontal bar with labels.
- Critiques: [Daring Fireball (quoting Jack Schofield, The Guardian)](https://daringfireball.net/linked/2008/02/07/snake-oil). (Gruber himself called the complaint "weak sauce", which makes it a good example of how subtle 3D distortion is.)

**4. Wikipedia "Misleading pie chart" (3D vs 2D)**
- Showed: in 3D, item C looks at least as large as item A.
- True: C is less than half of A.
- Rule broken: 3D for 2D data.
- Fix: 2D, or bars. [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph).

**5. Dual-axis GDP (Datawrapper's teaching example)**
- Showed: world GDP and German GDP rising in parallel.
- True: world ~+80%, Germany ~+40% over the period.
- Rule broken: two independent y-axes with different baselines; the author picks the relationship.
- Fix: indexed chart (both = 100 at start) or side-by-side panels. [Datawrapper](https://www.datawrapper.de/blog/dualaxis/).

**6. Dual-axis military expenditure (Wikipedia example)**
- Showed: China's line crossing above the US line.
- True: US spending far higher throughout.
- Rule broken: dual axis creates a meaningless crossing point; readers read crossings as events.
- Fix: one axis, or index to a base year. [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph).

**7. Pictogram house sales (Wikipedia, improper scaling)**
- Showed: a house icon about eight times bigger.
- True: sales doubled.
- Rule broken: scaling an icon in 2 or 3 dimensions by the value (2× → 4× area → 8× volume).
- Fix: bars, or repeat icons (isotype) instead of enlarging one.

**8. TechCrunch pie (redesigned by Storytelling with Data)**
- Showed: many similarly sized slices in default rainbow colours.
- True: ranking and differences unreadable; darker slices look larger.
- Rule broken: too many slices, meaningless colour.
- Fix: sorted horizontal bar, one highlight colour. [Storytelling with Data](https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts).

**9. Threat Analysis Reporter dashboard (critiqued by Stephen Few)**
- Showed: a grid of round gauges, each green-left / yellow / red-right.
- True: each gauge carried one number; for some measures high was good, yet high sat in red.
- Rule broken: gauges waste space; red used everywhere so alarms do not pop; fixed colour zones regardless of polarity.
- Fix: bullet graphs or a table with sparklines and targets; red only beside items needing action. [Perceptual Edge](https://www.perceptualedge.com/blog/?p=54).

**10. Bar charts of temperature**
- Showed: bar lengths from 0 °C.
- True: 0 °C is arbitrary; a 10 °C bar is not "half as hot" as 20 °C.
- Rule broken: length encoding on an interval scale.
- Fix: dots or lines. [Carleton University: never bar graph temperatures (archived)](https://web.archive.org/web/20250820183424/https://carleton.ca/roslyndakin/2022/never-bar-graph-temperatures/).

### Dashboard twins (composite, recurring product failures)
These are generic patterns seen across SaaS and fintech dashboards, described without naming a product.
- **The cliff at the edge**: today's partial day drawn as a full period, so every metric "crashes" at the right edge. Fix: dashed partial segment labelled "so far" (chart-time-series-line-area.md).
- **The auto-scaled flatline**: a sparkline auto-fits a 0.2% wiggle to full height, looking like a crash. Fix: minimum y-span (chart-sparklines-micro.md).
- **The confident forecast**: actuals continue as a dashed single-value projection with no interval. Fix: fan chart with labelled bands (chart-distributions-uncertainty.md).
- **The red good news**: a falling churn sparkline painted red because "down = red". Fix: colour by meaning or stay neutral.
- **The rainbow legend**: 10 series, 10 hues, one bottom legend, no direct labels. Fix: highlight + grey, or small multiples (chart-tooltips-crosshair-labels.md).
- **The connected outage**: `connectNulls` draws a straight line across a 3-week data gap. Fix: gap + label.
- **The donut wall**: six donut "rings" each showing a single percent with no target or history. Fix: bullet graphs or number + delta + sparkline.
- **The hover vault**: values exist only in tooltips; nothing readable in a screenshot, on touch, or by screen reader. Fix: direct labels + table view (chart-accessibility.md).
- **The jumping axis**: each filter change re-crops the y-axis so a 2% move looks the same as a 40% one. Fix: stable domain or visible axis change.
- **The price-vs-value dual axis**: share price on the left axis, intrinsic value on the right, lines crossing at an arbitrary point. Fix: one axis (chart-financial-price-value.md).

## Anti-patterns (don't)
- Using these examples to mock: the goal is to recognise the mechanism. Several (Apple, Reuters) are disputed as to intent; describe the effect, not the motive.
- Copying images of the bad charts into the product's docs without attribution; link to the critique.

## Good references
- [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph) — taxonomy with diagrams for each failure.
- [Kaiser Fung, Junk Charts / Trifecta Checkup](https://jonpage.github.io/r-course/trifecta.html) — classify a bad chart by whether the Question, Data or Visual failed.
- [Datawrapper blog](https://www.datawrapper.de/blog/dualaxis/) — redraws each bad example with alternatives side by side.
- [Pandey et al. CHI 2015](https://doi.org/10.1145/2702123.2702608) — empirical backing that these distortions change beliefs.

## Bad references
The whole file is the bad-reference list; each entry links its critique.

## Accessibility
- Many gallery failures are also accessibility failures: colour-only legends (8), hover-only values (hover vault), and decoration that disappears in forced colours (3D, gradients).
- When showing bad examples in internal docs, give each image alt text that states the distortion ("Bar chart with y-axis starting at 34, making 39.6% look six times 35%").

## Motion / interaction (if relevant)
- Motion-specific bad pattern: re-animating bars from zero on every 5-second refresh, which makes users watch the chart instead of reading it; and axis re-crops on filter (the jumping axis).

## Tokens and values
| Failure | Detect automatically? | How |
|---|---|---|
| Truncated bar/area | Yes | `lintChart`: length mark with `y.min > 0` |
| Dual axis | Yes | `y2` present |
| Hard-clipped data | Yes | `max(data) > y.max` |
| 3D / shadows | Yes | design-token lint: no `box-shadow`/`filter` on marks |
| Too many pie slices | Yes | slices > 5 |
| Connected nulls | Yes | `connectNulls === true` with gaps > 1 interval |
| Partial period | Yes | last bucket end > now |
| Colour-only legend | Partly | series > 1 and no direct labels/dash/markers |
| Cherry-picked window | No | review |
| Polarity colour errors | No | review: metric registry carries `higherIsBetter` |

## Implementation sketch
Encode polarity and partial-period facts in the metric registry so charts can be honest by default.
```ts
import { z } from "zod";

export const MetricDef = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.enum(["usd", "percent", "count", "ms", "ratio"]),
  higherIsBetter: z.boolean().nullable(), // null = neutral, never colour by direction
  aggregation: z.enum(["sum", "mean", "last", "p50", "p90", "p99"]),
  lengthEncodable: z.boolean(),           // false for temperatures, indices with arbitrary zero
});
export type MetricDef = z.infer<typeof MetricDef>;

export function deltaTone(def: MetricDef, delta: number): "good" | "bad" | "neutral" {
  if (def.higherIsBetter === null || delta === 0) return "neutral";
  return (delta > 0) === def.higherIsBetter ? "good" : "bad";
}

export function isPartial(bucketEnd: Date, now: Date = new Date()): boolean {
  return bucketEnd.getTime() > now.getTime();
}
```

## Checklist
- [ ] Each new chart is compared against the ten media examples and ten dashboard twins.
- [ ] Automated checks (table above) run in dev and in visual tests.
- [ ] Metric registry carries polarity and whether bars are valid.
- [ ] Partial periods are detected and styled.
- [ ] Bad-example images in docs have alt text naming the distortion and a link to the critique.

## Sources
- https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
- https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition
- https://flowingdata.com/2012/08/06/fox-news-continues-charting-excellence/
- https://www.livescience.com/45083-misleading-gun-death-chart.html
- https://psmag.com/news/mislead-charts-stand-ground-laws-gun-deaths-79726/
- https://web.archive.org/web/20241107233138/https://seo.misbar.com/en/factcheck/2021/06/30/florida-gun-deaths-graph-inverted-data
- https://daringfireball.net/linked/2008/02/07/snake-oil
- https://en.wikipedia.org/wiki/Misleading_graph
- https://en.wikipedia.org/wiki/Chartjunk
- https://www.datawrapper.de/blog/dualaxis/
- https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts
- https://www.perceptualedge.com/blog/?p=54
- https://web.archive.org/web/20250820183424/https://carleton.ca/roslyndakin/2022/never-bar-graph-temperatures/
- https://jonpage.github.io/r-course/trifecta.html
- https://doi.org/10.1145/2702123.2702608
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
