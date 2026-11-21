# Choose the chart by the question

> Name the comparison the reader must make (change, rank, part-to-whole, distribution, deviation, correlation, flow, magnitude, spatial) and pick the chart from that row; never pick a chart for looks or because the library offers it.

**Category:** Charts and data visualisation · **Applies to:** every chart, KPI card, report and dashboard panel · **Priority:** must

## When to use / when not
- Use before drawing any chart, and again in review: write the question as one sentence ("Did revenue grow faster than costs since 2022?") and the comparison word in it tells you the row.
- Do not chart at all when the reader needs one or two exact numbers. A single number plus its comparison ("$4.2M, +12% vs last quarter") beats any chart. NN/g: "People need to compare a number against another number in order to interpret it."
- Do not chart when a sortable table answers the question better: many exact values, lookups by name, more than ~12 categories with long labels and no pattern to see.

## Rules (do)
- Write the question first, in the chart title or a sticky note. The title states the takeaway ("Costs grew twice as fast as revenue"), the subtitle states the measure and unit (Datawrapper text guidance).
- Map the question to an FT Visual Vocabulary row (Financial Times, chart-doctor):

| Question word | FT row | Default chart | Good alternatives |
|---|---|---|---|
| "over time", "trend", "since" | Change over time | Line (many dates), column (fewer than ~10 dates) | Area (only if the total matters), slope (2 dates), fan chart (forecast) |
| "bigger/smaller", "how much" | Magnitude | Bar / column from zero | Dot plot (non-zero range), lollipop, paired bar |
| "top", "rank", "best/worst" | Ranking | Sorted horizontal bar | Dot strip, slope (rank change), lollipop |
| "share of", "breakdown" | Part-to-whole | 100% stacked bar, or single bar list | Pie/donut (2 to 5 slices), treemap, waterfall (when parts add and subtract) |
| "above/below target, average, zero" | Deviation | Diverging bar | Surplus/deficit filled line, bullet graph |
| "spread", "how often", "typical" | Distribution | Histogram | Box plot, strip/beeswarm, density, cumulative curve |
| "related to", "drives" | Correlation | Scatter | Connected scatter (time), line + column (careful) |
| "from where to where" | Flow | Sankey | Waterfall (value bridge), chord |
| "where" | Spatial | Choropleth (rates only) | Proportional symbol (counts), cartogram |

- Default to the basic three: bar, line, scatter. NN/g: these let people "quickly and accurately perceive the differences between values"; pie, bubble, mosaic, waffle, Sankey and stacked area "require users to visually assess angle, area, or volume". Use a complex type only when it shows something a basic one cannot.
- Use position on a common scale whenever precision matters (bar ends, dots, line points). Encodings below that (length without common baseline, angle, area, colour saturation) are for gist only.
- Put the important comparison next to each other: group bars by the comparison the reader should make (NN/g). Two series that must be compared go in one chart; two that are independent go in two.
- Replace stacked bars by small multiples when the middle segments matter. NN/g: segments that share a baseline are easy to compare, the middle ones "much harder"; "use a series of 3 bar charts instead."
- One chart, one message. If the panel needs two messages, use two charts with a shared x-axis (see chart-tooltips-crosshair-labels.md for synchronised crosshairs).
- For dashboards, also decide the mode: monitoring (at a glance, sparkline + number + target) vs exploration (filters, drill-down, linked charts). Carbon dashboards: exploration views must "mirror chart modifications like filter and zoom" across linked charts.
- Match the chart family across the product: the same metric uses the same chart type and colour everywhere (Carbon dashboards: "Always use consistent colors for each data set within a dashboard").

## Anti-patterns (don't)
- Pie because "it is a share": only valid for 2 to 5 slices with one highlighted (see chart-pies-donuts-gauges.md).
- Line chart over unordered categories (countries, products). Lines imply continuity; use bars.
- Bars for a 200-point daily series. Use a line.
- Area chart for a single series where the filled area adds no meaning: Datawrapper says use a line.
- Dual-axis "line + column" to imply correlation (see chart-honesty-chartjunk.md).
- Radar charts for comparing products on 6+ metrics: area depends on axis order. Use a grouped dot plot.
- Picking a chart from a library gallery ("this one looks cool") rather than from the question.
- Word clouds for anything quantitative.

## Good references
- [FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary) — nine relationship rows with about 70 chart entries (some charts appear in two rows); each row has a one-line purpose ("Use where an item's position in an ordered list is more important than its absolute or relative value"). Print it next to the design review.
- [NN/g: Choosing Chart Types](https://www.nngroup.com/articles/choosing-chart-types/) — pushes everyday UX dashboards to bar, line, scatter and gives the reason (angle/area judgements are poor).
- [Datawrapper: area charts](https://www.datawrapper.de/blog/area-charts) — decision rules: area "works best if the total is as important as its shares", fewer than ~10 dates use stacked columns, small differences use lines.
- [IBM Carbon dashboards](https://carbondesignsystem.com/data-visualization/dashboards/) — separates presentation vs exploration dashboards and gives layout consistency rules.
- [Kaiser Fung's Trifecta Checkup](https://jonpage.github.io/r-course/trifecta.html) — review a chart on Question, Data and Visual separately; many "bad charts" have a fine visual and a broken question.

## Bad references
- [Fox Business "If Bush tax cuts expire"](https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline) — right chart type, wrong scale; shows that type choice is necessary but not sufficient.
- [Few: Threat Analysis Reporter dashboard](https://www.perceptualedge.com/blog/?p=54) — gauges chosen for "dashboard feel"; each shows one number in a large circle where a table row would do.
- Library-default "chart picker" UIs that offer 3D, radar and donut first: they optimise for variety, not for the question.

## Accessibility
- The chosen type changes how hard the text alternative is: a sorted bar or line is easy to describe ("rose from X to Y, peak in Z"), a Sankey is not. Prefer forms whose summary fits in two sentences. See chart-accessibility.md.
- Simpler forms lower the cognitive load (Chartability "Data density is inappropriate").

## Motion / interaction (if relevant)
- Do not animate between chart types (bar morphing into pie). It looks clever and hides the comparison.
- Toggles between "absolute" and "relative change" views (as Our World in Data offers) are good: the question changes, so the chart changes.

## Tokens and values
| Decision | Default |
|---|---|
| Max categories in a pie/donut | 5 (Datawrapper) |
| Dates below which columns beat lines/areas | ~10 |
| Max lines before switching to highlight + grey context | 5 coloured, rest grey |
| Max bars before a table or "Top N + Other" | ~15 |
| Max segments in a stacked bar | 4 to 5 |
| Charts per dashboard row | 2 to 3 at ≥1280 px wide; 1 below 768 px |

## Implementation sketch
```ts
type Question =
  | "change-over-time" | "magnitude" | "ranking" | "part-to-whole"
  | "deviation" | "distribution" | "correlation" | "flow" | "spatial";

interface ChartChoiceInput {
  question: Question;
  pointCount: number;      // dates or categories
  seriesCount: number;
  totalMatters?: boolean;  // for part-to-whole over time
}

type ChartKind =
  | "line" | "column" | "stacked-area" | "stacked-column" | "bar-sorted" | "stacked-bar-100" | "donut"
  | "diverging-bar" | "histogram" | "box" | "scatter" | "sankey" | "waterfall" | "table";

export function chooseChart({ question, pointCount, seriesCount, totalMatters = false }: ChartChoiceInput): ChartKind {
  switch (question) {
    case "change-over-time":
      if (totalMatters && seriesCount > 1) return pointCount < 10 ? "stacked-column" : "stacked-area";
      return pointCount < 10 ? "column" : "line"; // Datawrapper: under ~10 dates, columns read better
    case "magnitude":
    case "ranking":
      return pointCount > 15 ? "table" : "bar-sorted";
    case "part-to-whole":
      return seriesCount === 1 && pointCount <= 5 ? "donut" : "stacked-bar-100";
    case "deviation": return "diverging-bar";
    case "distribution": return pointCount < 30 ? "box" : "histogram";
    case "correlation": return "scatter";
    case "flow": return "sankey";
    case "spatial": return "table"; // maps are a separate decision
  }
}
```

## Checklist
- [ ] The question is written as one sentence and the title states its answer.
- [ ] The chart type comes from the matching FT Visual Vocabulary row.
- [ ] A basic chart (bar, line, scatter) was considered first and rejected for a stated reason.
- [ ] No pie with more than 5 slices, no radar, no 3D, no word cloud for numbers.
- [ ] Same metric uses the same chart type and colour across the dashboard.
- [ ] If one or two exact numbers answer the question, a number + comparison replaces the chart.

## Sources
- https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary
- https://www.nngroup.com/articles/choosing-chart-types/
- https://www.datawrapper.de/blog/area-charts
- https://www.datawrapper.de/blog/pie-charts
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://carbondesignsystem.com/data-visualization/simple-charts/
- https://jonpage.github.io/r-course/trifecta.html
- https://www.perceptualedge.com/blog/?p=54
- https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
- https://www.w3.org/WAI/tutorials/images/complex/
