# Distributions and uncertainty

> Show spread, not just a mean, and show uncertainty as graded ranges with a stated meaning ("80% of simulated outcomes"), never as a single confident line or an unlabelled error bar.

**Category:** Charts and data visualisation · **Applies to:** forecasts, valuation ranges, Monte Carlo output, latency percentiles, survey results, A/B tests, model calibration · **Priority:** must (for any forecast or estimate)

## When to use / when not
- Distribution charts (histogram, box, strip, density, ECDF) when the question is "how spread out / what is typical / are there outliers". FT Visual Vocabulary "Distribution" row.
- Uncertainty displays (fan chart, interval band, graded error bars, quantile dot plot) whenever a number is an estimate or a projection. A valuation tool showing one value per share with no range overstates precision.
- Not: a box plot for fewer than ~10 observations (show the dots), a density curve for small samples (Wilke: density plots "can mislead with only a few points"), a histogram of 3 bins.

## Rules (do)
**Histograms**
- Equal-width bins, always (Wilke: unequal widths make the histogram invalid).
- Try several bin widths; library defaults are often wrong (Wilke's Titanic example: 1-year bins too busy, 15-year too coarse, 3 to 5 years right). Start with Freedman–Diaconis, then check visually; expose the bin width in the UI for analysts.
- Bars touch (0 to 1 px gap): the x-axis is continuous. Y starts at zero (counts are lengths).
- Label bin edges, not bin centres; state the bin width in the subtitle ("bins of $5").
- Do not stack histograms or overlay semi-transparent ones; they create a phantom third colour (Wilke). Use overlapping density lines, small multiples, or a back-to-back pyramid (exactly two groups).
- When group sizes differ a lot, show each as a proportion (Wilke).

**Box and strip plots**
- Box plots for comparing ≥3 groups with ≥10 points each. Define whiskers in the caption (1.5×IQR or 5th/95th percentile); dashboards disagree on this silently.
- Overlay or replace with raw points (jittered strip/beeswarm) when n < ~50 per group; boxes hide bimodality.
- Percentile ladders for latency: show p50, p90, p99 as separate lines over time, never averages alone.

**Uncertainty: intervals and bands**
- Always state what the interval is: "95% confidence interval", "±1 standard error", "80% of 10,000 simulations" (Wilke: "Always state what the error bars show").
- Prefer graded intervals: e.g. 50% / 80% / 95% bands, with the narrowest darkest. Wilke: graded bars reduce "deterministic construal errors", where readers treat a single interval as hard min and max.
- Fan chart for forecasts: past data as a solid line, future as a central line plus widening bands. Bank of England has used it since the 1990s; in BoE convention each pair of identically shaded bands holds 10% probability and the whole fan covers 90%. Symmetric fans of ±1σ, ±2σ, ±3σ correspond to ~68%, 95%, 99.7% (Wikipedia, fan chart).
- Separate history from forecast with a vertical "today" rule and a label ("Forecast"). Datawrapper: use a highlight range "when values shift into projections".
- Show the central estimate as a line, but do not let it be visually dominant over the band: 1.5 px line, bands carrying most of the ink.
- For skewed distributions (valuation outcomes are usually right-skewed), use quantile-based bands (HPD/percentiles), not mean ± kσ.
- Quantile dot plot for "what are my chances" questions: ~20 to 50 dots, each a 1/N chance. Wilke: frequency framing is judged better than areas under curves; too many dots read as a continuum.
- Do not judge significance from overlapping error bars; chart the difference with its interval instead (Wilke).

**Valuation-specific (applies to a value-per-share tool)**
- Show value per share as a range bar with the point estimate marked, plus the current price as a reference rule. See chart-financial-price-value.md.
- Sensitivity grids (WACC × terminal growth) are a table with a sequential colour scale, not a 3D surface.

## Anti-patterns (don't)
- A single forecast line extending into the future with no band ("spaghetti of certainty").
- "Dynamite plots": bar of the mean + SE whisker, hiding the data (Wilke: technically correct but hides within-group variation).
- Unlabelled error bars or bands; mixing SD and SE across panels.
- Uniform-opacity confidence strips that readers perceive as a solid region (Wilke's "confidence strips are hard to integrate").
- Density curves that extend into impossible values (negative ages, negative prices) (Wilke).
- Averages of percentiles (averaging p99s across hosts is meaningless).
- Gaussian bands over a skewed or bounded quantity.
- Smoothly morphing hypothetical-outcome animations: Wilke says fade or cut between outcomes; morphing makes probabilities harder to judge.

## Good references
- [Claus Wilke, Fundamentals of Data Visualization, ch. 16 "Visualizing uncertainty"](https://clauswilke.com/dataviz/visualizing-uncertainty.html) — graded error bars, frequency framing, quantile dot plots, HOPs, and why overlap tests mislead.
- [Claus Wilke, ch. 7 "Histograms and density plots"](https://clauswilke.com/dataviz/histograms-density-plots.html) — bin width examples, no stacked/overlaid histograms, density pitfalls.
- [Bank of England fan charts (Inflation Report, Feb 2017)](https://www.bankofengland.co.uk/-/media/boe/files/inflation-report/2017/fan-charts-february-2017.pdf) — the reference implementation: graded bands, each pair 10% probability, central 90% shown.
- [Wikipedia: Fan chart (time series)](https://en.wikipedia.org/wiki/Fan_chart_(time_series)) — symmetric vs HPD construction; centre darkest.
- [FT Visual Vocabulary, Distribution row](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary) — histogram, box, violin, strip, barcode, cumulative curve, plus fan chart under change over time.
- [Stephen Few bullet graph spec](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf) — includes a projection segment for "will we hit target by period end", a lightweight uncertainty cue.

## Bad references
- Forecast charts in many SaaS revenue dashboards that extend the actuals line with a dashed "projection" of a single value and no interval: the dash signals "future" but not "uncertain by ±X".
- [Wilke's "confidence strip" and "bar + SE" counter-examples](https://clauswilke.com/dataviz/visualizing-uncertainty.html) — the book labels them as harder to read; useful as a "don't" gallery.

## Accessibility
- Band shading must remain distinguishable: graded bands differ in lightness by ≥ ~15 L* steps, and the outermost band still reaches 3:1 against the surface, or is outlined.
- Text alternative must say the range, not just the centre: "Central estimate $142; 80% range $118 to $171; 95% range $101 to $199."
- Table view lists percentiles as columns (p5, p25, p50, p75, p95).
- In forced-colors mode bands lose fills; draw band edges as 1 px lines so the range survives (modern-web-guidance visual-design/color.md: don't rely on backgrounds to convey state).

## Motion / interaction (if relevant)
- HOPs (cycling outcomes) only on explicit play, ≥ 400 ms per frame, with pause control (WCAG 2.2.2; modern-web-guidance ui-behaviors/motion.md).
- A slider for confidence level (50 to 95%) is a good exploratory control; update bands without easing.
- Hover on a forecast date shows all percentiles in the tooltip, not only the median.

## Tokens and values
| Token | Default |
|---|---|
| Band levels | 50% / 80% / 95% |
| Band fill (accent hue) | 45% / 28% / 14% opacity, centre darkest |
| Band edge (forced colours, print) | 1 px |
| Central line | 1.5 px |
| "Today" rule | 1 px dashed, neutral 500, label "Forecast →" |
| Histogram bar gap | 0–1 px |
| Box whisker definition | 1.5×IQR, stated in caption |
| Quantile dot plot dots | 20 (dashboard), 50 (detail) |
| Min n for box plot | 10 per group |

## Implementation sketch
```html
<figure class="fan" aria-labelledby="fan-t" aria-describedby="fan-d">
  <figcaption>
    <h3 id="fan-t">Value per share: central estimate $142</h3>
    <p id="fan-d">Based on 10,000 simulations. 50% range $129 to $156; 80% $118 to $171; 95% $101 to $199. Bands show the share of simulated outcomes, not a guarantee.</p>
  </figcaption>
  <svg viewBox="0 0 600 220" role="img" aria-labelledby="fan-t" aria-describedby="fan-d">
    <path class="band b95" d="..." /> <path class="band b80" d="..." /> <path class="band b50" d="..." />
    <path class="history" d="..." /> <path class="central" d="..." />
    <line class="today" x1="300" x2="300" y1="0" y2="220" /><text x="306" y="14">Forecast</text>
  </svg>
</figure>
```
```css
.fan .band { fill: var(--chart-accent); stroke: none; }
.fan .b95 { fill-opacity: .14; } .fan .b80 { fill-opacity: .28; } .fan .b50 { fill-opacity: .45; }
.fan .history { fill: none; stroke: var(--chart-ink); stroke-width: 2; }
.fan .central { fill: none; stroke: var(--chart-ink); stroke-width: 1.5; stroke-dasharray: 4 3; }
.fan .today { stroke: var(--text-muted); stroke-dasharray: 2 3; }
@media (forced-colors: active) {
  .fan .band { fill: none; stroke: CanvasText; stroke-width: 1; }
}
```
```ts
// Percentile bands from simulation output (no `any`).
export function percentiles(samples: ReadonlyArray<number>, ps: ReadonlyArray<number>): Record<number, number> {
  const s = [...samples].sort((a, b) => a - b);
  const out: Record<number, number> = {};
  for (const p of ps) {
    const idx = (s.length - 1) * p;
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    out[p] = s[lo] + (s[hi] - s[lo]) * (idx - lo);
  }
  return out;
}
// percentiles(sims, [0.025, 0.1, 0.25, 0.5, 0.75, 0.9, 0.975])
```

## Checklist
- [ ] Every estimate or forecast shows a range, and the caption says what the range means.
- [ ] Bands are graded (≥2 levels), centre darkest; skewed outputs use percentile bands.
- [ ] History and forecast are visually separated and labelled.
- [ ] Histograms use equal bins, a stated bin width, and a zero baseline.
- [ ] No stacked or overlaid semi-transparent histograms; no bar-of-mean with SE as the only view.
- [ ] Text alternative and table include the interval bounds, not just the central value.
- [ ] Forced-colours mode still shows band edges.

## Sources
- https://clauswilke.com/dataviz/visualizing-uncertainty.html
- https://clauswilke.com/dataviz/histograms-density-plots.html
- https://en.wikipedia.org/wiki/Fan_chart_(time_series)
- https://www.bankofengland.co.uk/-/media/boe/files/inflation-report/2017/fan-charts-february-2017.pdf (search result summary)
- https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/1998/the-inflation-report-projections-understanding-the-fan-chart (search result)
- https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary
- https://www.datawrapper.de/blog/line-charts
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- modern-web-guidance: skills/modern-web-guidance/guides/visual-design/color.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/motion.md
