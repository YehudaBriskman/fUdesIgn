# Pies, donuts and gauges: mostly not

> Use a pie or donut only for one whole split into 2 to 5 parts with one part that matters; replace speedometer gauges with a bullet graph or a number plus a bar against target.

**Category:** Charts and data visualisation · **Applies to:** share-of-total widgets, quota/utilisation KPIs, "health" meters, storage/plan usage · **Priority:** must

## When to use / when not
**Pie/donut: allowed when all are true**
- One total, its parts sum to 100%, the reader needs the "whole made of parts" idea more than precise comparison (Storytelling with Data concedes this trade-off).
- 2 to 5 slices. Datawrapper: "five max"; more shares use a stacked bar.
- Shares near 25%, 50%, 75% (Datawrapper), or one highlighted slice versus the rest.

**Pie/donut: not when**
- Comparing shares that are close (23% vs 26%): use bars.
- Only two values: write the number ("38% of revenue is recurring").
- Comparing several totals (two years, two polls): use 100% stacked bars or small multiples of bars, never pies side by side.
- Values do not sum to a meaningful whole (multi-select survey answers, overlapping segments).

**Gauge: almost never**
- Stephen Few's spec opens: "The bullet graph was developed to replace the meters and gauges that are often used on dashboards." His 2006 critique of the Threat Analysis Reporter says its circular gauges use "a great deal of space to say very little".
- Acceptable: a single-purpose display where the physical metaphor is the point (a car app speedometer), or a utilisation ring on a tiny device. On a data dashboard, use a bullet graph, a progress meter, or a number with "of target".

## Rules (do)
**If you use a pie or donut**
- Start the first slice at 12 o'clock, go clockwise, largest first, "Other" last regardless of size.
- One highlight colour for the slice the title talks about; others in tints of one neutral hue (Datawrapper; Storytelling with Data). Do not use the library rainbow; darker slices look bigger than equal lighter ones.
- Direct labels: name + percent next to each slice, small-slice labels outside with leader lines (Datawrapper). No separate legend for 2 to 5 slices.
- Group slices under ~3% into "Other".
- Donut hole ≤ 60% of the outer radius; put the total or the highlighted share in the hole, as text the screen reader can reach.
- Separate slices with a 1 to 2 px stroke in the surface colour so they stay distinct in forced colours and for low vision.
- Percentages shown must sum to 100 (use largest-remainder rounding).
- Place in a sidebar or narrow column; pies cannot use full width (Datawrapper).

**Gauge replacements**
- Bullet graph (Few spec): one featured bar, one target tick, 2 to 5 qualitative background ranges (ideally 3), horizontal, label on the left. Range intensities of one hue: two ranges 35%/10%; three 40%/25%/10%; four 50%/35%/20%/10%; five 50%/35%/20%/10%/3%. Darker = worse. Featured bar ≈ 1/3 of the container thickness. When the scale does not start at zero, the measure becomes a dot or X, not a bar.
- For "lower is better" metrics, reverse the range order rather than reusing the same red-on-the-right template (Few, on a gauge that puts high productivity in the red zone, asks "why a high level of productivity ... is a bad thing").
- For usage/quota: a native `<meter>` or a linear bar with value text ("7.2 of 10 GB, 72%") and threshold markers.

## Anti-patterns (don't)
- 3D pies and exploded pies. Perspective makes front slices larger: in the Wikipedia example, item C looks at least as large as item A while being less than half its size.
- Pies with 8+ slices and a legend the reader must match by colour.
- Two pies side by side to show change over time.
- A grid of 6 donut "KPI rings", each showing one percentage with no target or history.
- Speedometer gauges with red/yellow/green arcs on every KPI: red everywhere means no red stands out (Few).
- Half-donut "gauges" whose arc length is not proportional to the value (arc starts at 180° and ends at 0° but the scale is non-linear).
- Percentages that sum to 99% or 101%.

## Good references
- [Datawrapper: what to consider when creating a pie chart](https://www.datawrapper.de/blog/pie-charts) — five slices max, highlight one slice, label small slices outside, place in a margin.
- [Stephen Few: bullet graph design spec](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf) — complete spec with intensities, thickness, scale and the "≤5, ideally 3 ranges" rule.
- [Storytelling with Data: death to pie charts](https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts) — TechCrunch pie redesigned as a sorted bar; explains darker-looks-bigger.
- [NN/g: choosing chart types](https://www.nngroup.com/articles/choosing-chart-types/) — pies require judging angle/area; prefer bars.
- [Few: Why most dashboards fail](https://blogs.ischool.berkeley.edu/i247s13/files/2013/02/WhyMostDashboardsFail.pdf) — rationale for bullet graphs in less space.

## Bad references
- [Steve Jobs, Macworld 2008, US smartphone share](https://daringfireball.net/linked/2008/02/07/snake-oil) — a tilted 3D pie made Apple's 19.5% slice, placed in front, look larger than the 21.2% "Other" slice behind it. Gruber called the styling "anti-Tufteian chartjunk".
- [Wikipedia: Misleading graph, 3D pie](https://en.wikipedia.org/wiki/Misleading_graph) — side-by-side 2D vs 3D pie of the same data; the 3D one ranks the slices wrongly.
- [Few: "Dashboard design for snail-paced monitoring" (2006)](https://www.perceptualedge.com/blog/?p=54) — the Threat Analysis Reporter: a wall of circular gauges, each with green-left/red-right zones regardless of whether high is good; one number per large circle.
- [TechCrunch pie (via Storytelling with Data)](https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts) — default rainbow palette, slices impossible to rank.

## Accessibility
- Slices fail WCAG 1.4.1 if colour is the only way to match them to labels: direct labels fix this; decals/patterns help when labels cannot fit.
- Adjacent slices need 3:1 against each other or a separating stroke (WCAG 1.4.11).
- Gauges drawn with SVG need `role="img"` and an accessible name with the value and target; a native `<meter min max low high optimum value>` exposes value semantics for free.
- The number in the donut hole must be real text, not part of a canvas bitmap.

## Motion / interaction (if relevant)
- Sweep-in animation on donuts ≤500 ms once; no spinning on refresh. Needle "wobble" on gauges is decoration; remove it.
- Hover a slice: raise it with a 2 px outline, never "explode" it out of the circle.

## Tokens and values
| Token | Default |
|---|---|
| Max slices | 5 (incl. "Other") |
| Small-slice threshold for "Other" | < 3% |
| Start angle | 0° (12 o'clock), clockwise |
| Donut inner radius | 55 to 60% of outer |
| Slice separator | 1 to 2 px, surface colour |
| Bullet graph ranges | 3 (max 5) |
| Bullet range fills | 40% / 25% / 10% of one hue (3 ranges) |
| Bullet featured bar thickness | 1/3 of track |
| Bullet target marker | 2 px wide, 2/3 of track height (house default; Few specifies only a short perpendicular line, 100% black, less dominant than the measure) |
| Bullet height (dashboard row) | 16 to 24 px |

## Implementation sketch
Bullet graph replacing a gauge, using CSS grid and a native `<meter>` for semantics.
```html
<div class="bullet" role="group" aria-labelledby="b1-label">
  <span id="b1-label" class="label">Q4 revenue vs target</span>
  <div class="track" style="--max: 5000; --value: 3900; --target: 4500; --r1: 2500; --r2: 4000;" aria-hidden="true">
    <span class="range r3"></span><span class="range r2"></span><span class="range r1"></span>
    <span class="measure"></span><span class="target"></span>
  </div>
  <meter min="0" max="5000" low="2500" high="4000" optimum="5000" value="3900" class="visually-hidden">
    $3.9M of $4.5M target
  </meter>
  <span class="value">$3.9M <small>of $4.5M target (87%)</small></span>
</div>
```
```css
.bullet { display: grid; grid-template-columns: 12rem 1fr auto; align-items: center; gap: 12px; }
.bullet .track { position: relative; block-size: 20px; }
.bullet .range, .bullet .measure, .bullet .target { position: absolute; inset-block: 0; inset-inline-start: 0; }
.bullet .r1 { inline-size: calc(var(--r1) / var(--max) * 100%); background: color-mix(in oklab, var(--chart-neutral-ink) 40%, var(--surface)); }
.bullet .r2 { inline-size: calc(var(--r2) / var(--max) * 100%); background: color-mix(in oklab, var(--chart-neutral-ink) 25%, var(--surface)); }
.bullet .r3 { inline-size: 100%; background: color-mix(in oklab, var(--chart-neutral-ink) 10%, var(--surface)); }
.bullet .measure { inline-size: calc(var(--value) / var(--max) * 100%); inset-block: 33%; background: var(--chart-ink); }
.bullet .target { inset-inline-start: calc(var(--target) / var(--max) * 100%); inline-size: 2px; inset-block: 16%; background: var(--chart-ink); }
.bullet .value { font-variant-numeric: tabular-nums; }
@media (forced-colors: active) { .bullet .measure, .bullet .target { background: CanvasText; } .bullet .range { border: 1px solid GrayText; } }
```
DOM order paints widest range first, so narrower (darker, worse) ranges sit on top; the measure and target paint last. Note: `<progress>` is for task completion, `<meter>` is for a scalar within a known range, which is what a KPI against target is (MDN `<meter>` vs `<progress>`).

## Checklist
- [ ] Pie/donut has ≤5 slices, one whole, sums to 100%, and one highlighted slice.
- [ ] Slices start at 12 o'clock, sorted, "Other" last; labels are direct.
- [ ] No 3D, no explosion, no rainbow default palette.
- [ ] No side-by-side pies for comparison over time.
- [ ] Every gauge has been challenged; bullet graph or meter used instead on data dashboards.
- [ ] "Lower is better" metrics have reversed qualitative ranges.
- [ ] Value and target are present as text.

## Sources
- https://www.datawrapper.de/blog/pie-charts
- https://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts
- https://www.nngroup.com/articles/choosing-chart-types/
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://www.perceptualedge.com/blog/?p=54
- https://blogs.ischool.berkeley.edu/i247s13/files/2013/02/WhyMostDashboardsFail.pdf
- https://daringfireball.net/linked/2008/02/07/snake-oil
- https://en.wikipedia.org/wiki/Misleading_graph
- https://carbondesignsystem.com/data-visualization/chart-types/
- https://echarts.apache.org/handbook/en/best-practices/aria/
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter
