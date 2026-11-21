# Honest charts: no truncated bars, no dual axes, no 3D, no chartjunk

> The visual size of an effect must match the size of the effect in the data (Tufte's lie factor ≈ 1), and every pixel of ink must either encode data or help read it.

**Category:** Charts and data visualisation · **Applies to:** every chart, especially KPI deltas, investor/board views, marketing pages, exported images · **Priority:** must

## When to use / when not
- Apply in every chart review. Pair with chart-bad-gallery.md for named examples.
- Minimalism is not the goal by itself: research (Bateman et al. 2010, "Useful junk?") found embellished charts are remembered better, and Kosara argues some "junk", like annotations, helps. The rule is "no ink that distorts or distracts", not "no ink".

## Rules (do)
**Scale honesty**
- Lie factor = (size of effect shown in graphic) ÷ (size of effect in data); keep it between 0.95 and 1.05 (Tufte, via Wikipedia "Misleading graph"). Test: measure two bar lengths in px and compare to the two values.
- Bars and areas start at zero (see chart-bars-baseline-sorting.md). Lines may crop, but the axis must be labelled and visible, never hidden on the far side (the Fox tax chart hid its axis on the right).
- Same metric, same scale across small multiples unless each panel says "independent scale".
- Axes run in the conventional direction: up = more, right = later. Inverting the y-axis is only acceptable when the title and labels make it unmissable, and even then usually wrong (Reuters Florida chart).
- Pictograms/symbols scale in one dimension (length) or by area, never both dimensions by the value (doubling width and height shows 4×; 3D volume shows 8×) (Wikipedia, improper scaling).
- Log scales only with a "log scale" label and for growth/multi-order data.
- Time windows: show enough history for context; cherry-picked start dates (starting at a trough) are a distortion. Offer 1Y/5Y/Max and default to a window that includes at least one full cycle for the metric.
- Don't omit categories or periods that change the story (Wikipedia: omitted data).

**Dual axes**
- Default: never. Datawrapper's critique: scales are arbitrary, so the author can make two lines cross, converge or run parallel at will; Isenberg et al. (2011) found dual-scale charts "performed poorly both in terms of accuracy and time".
- Alternatives, in order (Datawrapper): (1) side-by-side charts with a shared x-axis and synchronised crosshair; (2) indexed chart (both series = 100 at a common start date, absolute values in tooltip); (3) show one series and annotate the other; (4) connected scatterplot for expert audiences.
- If a dual axis is unavoidable for expert users (Datawrapper re-allowed it in 2026 for business plans): both axes labelled in the series colour, both start at zero or both at an explicitly justified value, and one series as bars, the other as a line.

**3D and decoration**
- No 3D for 2D data: no 3D bars, pies, or areas. Perspective changes apparent size (Wikipedia 3D pie: item C looks ≥ A while being less than half).
- No drop shadows, bevels, glossy gradients, background images, or textures behind marks (Tufte chartjunk; heavy gridlines and ornamented axes are his examples).
- Gridlines light (1 px, ≤ 20% contrast against the surface), 3 to 6 of them, or none when every mark is labelled.
- No unnecessary borders/frames around the plot area.
- Colour only where it encodes something; one accent for the story, neutrals for the rest.
- Smoothing only monotone; never splines that create peaks (Datawrapper).
- Rounded numbers that sum correctly; no false precision ("$142.3718" value per share).

## Anti-patterns (don't)
- Truncated bar axis (Fox Business 35% vs 39.6% from a 34% axis: looks ~460% bigger, real ~13%).
- Two y-axes tuned so lines cross at the "insight".
- Inverted y-axis with fill (Reuters "Gun deaths in Florida").
- 3D pie with the brand's slice in front (Apple, Macworld 2008).
- Pictogram bags of money scaled in width and height.
- Cumulative charts used to hide a decline (cumulative revenue always rises).
- "Year to date" vs "full prior year" comparisons; partial current period plotted as complete.
- Area charts with cropped baselines.
- Rainbow colour scales on sequential data (perceptually non-uniform; false boundaries).
- Gauges and "dashboard" skeuomorphism (Few).

## Good references
- [Datawrapper: dual-axis charts](https://www.datawrapper.de/blog/dualaxis/) — the clearest argument with a GDP example (~80% vs ~40% growth drawn as equal) and four alternatives; updated 2026 to explain when experts may use them.
- [Datawrapper: why our column and bar charts start at zero](https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero) — product-level enforcement, citing Pandey et al. CHI 2015.
- [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph) — taxonomy (truncated, 3D, improper scaling, omitted data, dual axis, log) and lie-factor definition.
- [Wikipedia: Chartjunk](https://en.wikipedia.org/wiki/Chartjunk) — Tufte's definition plus critiques (Few, Kosara, Holmes, Bateman et al.), useful to avoid over-minimalism.
- [Pandey et al., "How Deceptive are Deceptive Visualizations?" CHI 2015](https://doi.org/10.1145/2702123.2702608) — crowdsourced evidence that truncated axes, area-as-quantity and aspect-ratio distortion change what readers believe.
- [Kaiser Fung, Junk Charts Trifecta Checkup](https://jonpage.github.io/r-course/trifecta.html) — check Question, Data, Visual separately.

## Bad references
See chart-bad-gallery.md for the full annotated gallery. Short list:
- [Fox Business: Bush tax cuts](https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition) — truncated bars.
- [Reuters: Gun deaths in Florida](https://www.livescience.com/45083-misleading-gun-death-chart.html) — inverted axis.
- [Apple Macworld 2008 3D pie](https://daringfireball.net/linked/2008/02/07/snake-oil) — perspective distortion.
- [Wikipedia: military expenditure dual-axis example](https://en.wikipedia.org/wiki/Misleading_graph) — China appears to overtake the US.

## Accessibility
- Honest charts are also more accessible: fewer decorative layers mean fewer things to describe, and the text alternative can state the true effect size.
- 3D, gradients and shadows break in forced-colours mode and print (MDN `forced-colors`), so avoiding them is also a robustness rule.

## Motion / interaction (if relevant)
- Animated axis rescaling can itself mislead: if the y-axis re-crops on every filter, the same 2% change looks huge in one view and flat in the next. Keep the domain stable across filter changes, or show the axis change explicitly.
- "Zoom to fit" buttons must preserve a visible axis and offer "reset to zero".

## Tokens and values
| Check | Threshold |
|---|---|
| Lie factor | 0.95–1.05 |
| Gridline contrast vs surface | ≤ 1.5:1 (subtle), lines 1 px |
| Gridline count | 3–6 or 0 |
| Accent colours per chart | 1 (2 max) |
| Decimal places, currency per share | 2 max; valuation outputs 0–1 |
| Dual axis | 0 (default) |
| 3D effects | 0 |

## Implementation sketch
Automated guardrails in the chart wrapper, so bad charts cannot be built by accident.
```ts
type Mark = "bar" | "column" | "area" | "line" | "point";

interface AxisSpec { min: number; max: number; scale: "linear" | "log"; label: string }
interface ChartSpec { mark: Mark; y: AxisSpec; y2?: AxisSpec; data: ReadonlyArray<number>; independentScale?: boolean }

export function lintChart(spec: ChartSpec): string[] {
  const issues: string[] = [];
  const lengthEncoded = spec.mark === "bar" || spec.mark === "column" || spec.mark === "area";
  const dataMin = Math.min(...spec.data);
  if (lengthEncoded && spec.y.scale === "linear" && spec.y.min > 0 && dataMin >= 0)
    issues.push(`${spec.mark}: value axis must start at 0 (got ${spec.y.min}).`);
  if (lengthEncoded && spec.y.scale === "log")
    issues.push(`${spec.mark}: length marks on a log scale are not comparable by length.`);
  if (spec.y2) issues.push("Dual y-axis: use side-by-side charts or an indexed chart.");
  if (spec.y.max < Math.max(...spec.data)) issues.push("Hard max clips data: use a soft max.");
  if (spec.y.scale === "log" && !/log/i.test(spec.y.label)) issues.push("Log axis must say 'log scale'.");
  return issues;
}

/** Lie factor for two values a -> b drawn with pixel lengths pa -> pb. */
export function lieFactor(a: number, b: number, pa: number, pb: number): number {
  const shown = (pb - pa) / pa;
  const actual = (b - a) / a;
  return shown / actual;
}
// lieFactor(35, 39.6, 10, 56) ≈ 35 → the Fox chart.
```
Run `lintChart` in development (console warning) and in Storybook/visual tests (fail the test).

## Checklist
- [ ] Bars/areas start at zero; any cropped line axis is visible and labelled.
- [ ] Lie factor checked on the headline comparison (≈1).
- [ ] No dual y-axis; alternatives considered (side-by-side, indexed).
- [ ] No 3D, shadows, gradients, background images, or heavy gridlines.
- [ ] Axis direction conventional; log scale labelled.
- [ ] Time window not cherry-picked; partial periods marked.
- [ ] Small multiples share a scale or say they do not.
- [ ] Colour used only to encode, one accent.

## Sources
- https://www.datawrapper.de/blog/dualaxis/
- https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero
- https://www.datawrapper.de/blog/line-charts
- https://en.wikipedia.org/wiki/Misleading_graph
- https://en.wikipedia.org/wiki/Chartjunk
- https://doi.org/10.1145/2702123.2702608
- https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
- https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition
- https://www.livescience.com/45083-misleading-gun-death-chart.html
- https://daringfireball.net/linked/2008/02/07/snake-oil
- https://www.perceptualedge.com/blog/?p=54
- https://jonpage.github.io/r-course/trifecta.html
- https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is (search result; fetch rate-limited)
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
