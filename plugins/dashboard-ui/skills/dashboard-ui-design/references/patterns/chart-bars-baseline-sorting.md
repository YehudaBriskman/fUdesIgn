# Bars: zero baseline, sorted, horizontal for long labels

> Bar length is the value, so bars always start at zero; sort them by value unless the categories have a natural order; and turn them horizontal whenever labels are longer than about 10 characters or there are more than about 7 bars.

**Category:** Charts and data visualisation · **Applies to:** category comparisons, rankings, breakdowns, top-N lists, period columns · **Priority:** must

## When to use / when not
- Use for magnitude and ranking across categories, and columns for a few time periods (fewer than ~10).
- Not when differences are tiny relative to the values (for example 98.1% vs 98.4%) and the difference is the point: a zero-based bar hides it, and a cropped bar lies. Use a dot plot with a non-zero range, a line (if ordered), or chart the differences (Datawrapper).
- Not for more than ~15 to 20 categories in a dashboard panel: show Top N + "Other", or a table with inline bars.

## Rules (do)
**Baseline**
- Start the value axis at zero, always. Datawrapper's tool refuses to start bar/column axes above zero: "Truncated y-axes in column charts and bar charts are considered deceptive and misleading", citing Pandey et al. (CHI 2015), whose participants "perceived the underlying message in its exaggerated form".
- Indicators do not rescue a cut bar: Correll, Bertini and Franconeri (CHI 2020) found readers overestimate differences on truncated axes even when a break symbol marks the cut (summarised by Kosara, Observable 2024).
- With negative values, the axis includes them and the zero line is drawn heavier than gridlines (1.5 to 2 px vs 1 px).
- If differences are too small to see: switch to a dot or range plot ("Readers don't expect dot plots ... to start at zero"), or compute and chart the differences.
- Never use an axis break on a bar. Datawrapper's waterfall guide: readers still compare the broken column's height.

**Sorting and orientation**
- Sort descending by value (largest at top for horizontal bars) unless categories have an inherent order: time, age bands, Likert scales, funnel steps (Storytelling with Data "Death to pie charts" redesign).
- Horizontal bars when labels are long or numerous (NN/g: horizontal bars are "a good option when you're working with long labels", because nothing has to be abbreviated or rotated). Rule of thumb: horizontal when any label exceeds ~10 characters, or more than ~7 categories. Never rotate category labels 45° or 90° to make columns fit.
- Columns (vertical) for time periods, so time reads left to right.
- Keep "Other" and "Unknown" at the bottom regardless of size.

**Geometry**
- Bar thickness ≥ gap: gap between bars 20 to 40% of the band (d3 `paddingInner(0.2–0.4)`). Bars thinner than the gaps look like a barcode.
- Grouped bars: max 3 to 4 bars per group, 0 to 2 px gap within the group, larger gap between groups. Beyond 4, use small multiples.
- Stacked bars: max 4 to 5 segments; only the first segment shares a baseline. NN/g: "use a series of 3 bar charts instead." 100% stacked bars are fine for part-to-whole of several totals.
- Corner radius ≤ 2 to 4 px and only on the value end; the baseline end stays square so the zero anchor reads.

**Labels**
- Label values at the bar end (outside, or inside when the bar is long enough with 4.5:1 contrast). Once all bars are labelled, hide the value axis and gridlines (Datawrapper waterfall guide applies to bars too).
- Numbers use tabular figures and a consistent unit and precision (`$1.2M`, `$860K` mixed precision is acceptable only with the unit always shown).
- Category labels left-aligned on horizontal bars when long; right-aligned against the axis when short.
- Highlight the one bar the title talks about; others in a single neutral colour. Do not rainbow-colour bars by category; colour carries no information there (Storytelling with Data).

## Anti-patterns (don't)
- Truncated value axis (Fox Business tax chart: axis from 34%, 35% vs 39.6% looks like a 460% jump; true change ~13%).
- Rotated column labels; alphabetical sort when the question is "which is biggest".
- Rainbow colours per bar; legend for a single-series bar chart (Carbon: skip the legend when there is one category).
- 3D bars: the front face and the back face suggest two different values.
- Bars for temperatures or other interval scales with an arbitrary zero (Carleton "never bar graph temperatures"): length from 0 °C means nothing. Use dots or lines.
- Stacked bars with 8 segments.
- Thin bars with wide gaps, rounded on both ends ("pill bars"), which hide where zero is.

## Good references
- [Datawrapper: why our column and bar charts start at zero](https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero) — product enforces the rule and gives three alternatives (dot/range plot, line, chart the differences).
- [Storytelling with Data: bar charts must have a zero baseline](https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline) — worked arithmetic on the Fox chart; notes the hidden right-side axis.
- [Storytelling with Data: death to pie charts](https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts) — redesign into a sorted horizontal bar; "sort ... unless categories have a natural order".
- [NN/g: Choosing chart types](https://www.nngroup.com/articles/choosing-chart-types/) — horizontal bars for long labels; replace stacked bars with small multiples.
- [IBM Carbon axes and labels](https://carbondesignsystem.com/data-visualization/axes-and-labels/) — "Always start numerical axes at zero for part-to-whole and comparisons charts."
- [Kosara: it's never okay to crop the y-axis, except when it is (Observable, 2024, archived)](https://web.archive.org/web/20260719070816/https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is) — bars always from zero; lines follow Gelman's "if zero is in the neighborhood, invite it in".
- [Stephen Few bullet graph spec](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf) — when a bar-like measure starts above zero, encode it as a dot or X, not a bar. The same rule generalises to every bar.

## Bad references
- [Fox Business "If Bush tax cuts expire"](https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition) — y-axis from 34; 4.6 percentage points look like a sixfold increase.
- [Carleton: never bar graph temperatures (archived)](https://web.archive.org/web/20250820183424/https://carleton.ca/roslyndakin/2022/never-bar-graph-temperatures/) — bars from an arbitrary zero encode nothing.

## Accessibility
- Bars must meet 3:1 against the background and against adjacent bars where adjacency carries meaning (WCAG 1.4.11).
- Value labels at 4.5:1; inside-bar labels must be checked against the bar fill, in both themes.
- Use patterns/decals for grouped or stacked segments when colour is the only separator (ECharts `aria.decal.show`, Highcharts pattern fills).
- Each bar is a natural keyboard stop; announce "Category, value, rank n of N".

## Motion / interaction (if relevant)
- Grow-from-baseline on first render: ≤400 ms (`--motion-dur-long`) with `--motion-ease-enter`, staggered 20 to 40 ms per bar and 300 ms of stagger in total at most (SKILL.md motion tokens), only under `prefers-reduced-motion: no-preference`.
- Re-sorting on filter: animate positions in 240 ms (`--motion-dur-medium`, `--motion-ease-standard`) so the eye can follow a bar to its new rank. Same-document View Transitions (`document.startViewTransition`) are Baseline newly available since October 2025 (MDN); feature-detect and fall back to FLIP with the Web Animations API, or to an instant re-sort.
- Hover dims other bars to ~30% opacity (Carbon legend behaviour) rather than adding a heavy outline.

## Tokens and values
| Token | Default |
|---|---|
| Band padding inner | 0.2 to 0.4 |
| Horizontal bar thickness | 16 to 24 px (dashboard), 12 px minimum |
| Group size | ≤4 bars |
| Stack segments | ≤5 |
| Zero line | 1.5 px, neutral 600 |
| Gridline | 1 px, neutral 200 |
| Value label | 12 px, tabular-nums, 4 to 6 px from bar end |
| Corner radius | 0 to 4 px, value end only |
| Highlight vs rest | 1 accent + 1 neutral |
| Switch to horizontal | label > 10 chars or > 7 categories |

## Implementation sketch
A pure HTML/CSS horizontal bar list: accessible as a list, no chart library, zero baseline by construction.
```html
<figure class="hbar">
  <figcaption id="hb-cap">Revenue by region, Q3 2025 (USD)</figcaption>
  <ol aria-labelledby="hb-cap">
    <li style="--v: 1.00"><span class="lbl">North America</span><span class="bar"></span><data value="4200000">$4.2M</data></li>
    <li style="--v: 0.62" class="is-focus"><span class="lbl">Europe, Middle East and Africa</span><span class="bar"></span><data value="2600000">$2.6M</data></li>
    <li style="--v: 0.31"><span class="lbl">Asia Pacific</span><span class="bar"></span><data value="1300000">$1.3M</data></li>
    <li style="--v: 0.05" class="is-other"><span class="lbl">Other</span><span class="bar"></span><data value="210000">$0.2M</data></li>
  </ol>
</figure>
```
```css
.hbar ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;
  grid-template-columns: minmax(8ch, max-content) 1fr auto; }
.hbar li { display: contents; }
.hbar .lbl { text-align: start; font-size: 13px; }
.hbar .bar { block-size: 20px; inline-size: calc(var(--v) * 100%); /* starts at 0 by construction */
  background: var(--chart-neutral); border-start-end-radius: 3px; border-end-end-radius: 3px; }
.hbar .is-focus .bar { background: var(--chart-accent); }
.hbar data { font-variant-numeric: tabular-nums; font-size: 12px; color: var(--text-muted); }
@media (forced-colors: active) { .hbar .bar { background: CanvasText; } .hbar .is-focus .bar { background: Highlight; } }
```

## Checklist
- [ ] Value axis starts at zero; no axis breaks on bars.
- [ ] Sorted by value, or by a stated natural order; "Other" is last.
- [ ] Horizontal orientation when labels are long or there are more than ~7 bars; no rotated labels.
- [ ] One highlight colour, everything else neutral; no per-bar rainbow.
- [ ] Value labels present, tabular, with unit; axis hidden if every bar is labelled.
- [ ] Grouped ≤4, stacked ≤5; otherwise small multiples.
- [ ] Interval-scale data (temperature, index with arbitrary zero) is not shown as bars.

## Sources
- https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero
- https://www.datawrapper.de/blog/waterfall-charts-guide
- https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
- https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts
- https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition
- https://web.archive.org/web/20250820183424/https://carleton.ca/roslyndakin/2022/never-bar-graph-temperatures/
- https://www.nngroup.com/articles/choosing-chart-types/
- https://carbondesignsystem.com/data-visualization/axes-and-labels/
- https://carbondesignsystem.com/data-visualization/legends/
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://web.archive.org/web/20260719070816/https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is
- https://doi.org/10.1145/3313831.3376222
- https://echarts.apache.org/handbook/en/best-practices/aria/
- https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
