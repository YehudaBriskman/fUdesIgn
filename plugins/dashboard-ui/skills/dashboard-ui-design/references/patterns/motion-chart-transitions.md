# Chart transitions: morphing, staggered entry, and when to animate data

> Animate a chart only to preserve object constancy (the same datum, tracked from old state to new). Key every mark by a stable ID, stage complex changes (axes first, then marks), keep the whole transition around 0.5–1 s, and cut or cross-fade when the data before and after are unrelated.

**Category:** Motion · **Applies to:** bar/line/area/scatter charts, sorted tables, treemaps, chart-type switches, time-step updates, filter changes · **Priority:** should

## When to use / when not
Related: chart choice in `chart-choose-by-question.md`; time-series specifics in `chart-time-series-line-area.md`.

Animate when the **same entities** persist across states and the user needs to follow them:
- re-sorting bars or table rows;
- filtering (items enter or leave, survivors re-layout);
- time step (same series, new period or live append);
- axis rescale after a value change;
- drill-down from aggregate to children, when children visibly come from the parent mark.

Do not animate (use an instant cut or ≤ 150 ms cross-fade):
- switching to an unrelated metric or dimension. Bostock: these "should use a simpler cross-fade or cut rather than gratuitous, nonsensical movement";
- first render of an analysis view (bars "growing from zero" add nothing);
- when the purpose is **comparison across time**. Robertson et al. (2008) found animated trend displays the least effective for analysis: both static alternatives were significantly faster, and small multiples were more accurate. Animation won only on engagement;
- streaming data at more than about 1 update per second. Use append-and-shift with no easing, or batch.

## Rules (do)
- **Key every mark** by a stable domain ID (ticker, account ID, FIPS), never by array index. Index joins animate bar 3 into the new bar 3, which is a different entity, and mislead (Bostock: "the default join-by-index can be misleading").
- **Intermediate frames must be valid charts** (Heer & Robertson, congruence). Interpolate in data space, so a line morphs point by point along a shared x-domain. Don't morph SVG path strings with mismatched point counts.
- **Stage complex transitions.** Heer & Robertson's staged animations beat unstaged ones for tracking. Typical stages:
  1. axis/scale change, ~300–400 ms;
  2. marks move or resize, ~300–400 ms;
  3. entering marks fade in, ~150–200 ms.
  Total ≈ 1 s maximum. Their study used 1.25 s and 2 s transitions; Robertson et al. recommend ~1 s.
- **Sorting:** stagger movement onset by 20–40 ms per item (cap the total stagger at ~300 ms). This reduces occlusion when three or more items cross (Heer & Robertson's DynaVis).
- **Entering and leaving items fade** (alpha). Don't fly in from the edge or grow from the baseline. Heer & Robertson chose fades for consistency across chart types and to avoid "nonmeaningful changes".
- **Slow-in/slow-out** (ease-in-out) for marks that move; it improves predictability. Never use springs with overshoot on data marks: overshoot draws false values.
- **Same operation, same transition** across all charts (filter is always fade + re-layout; sort is always staggered translate).
- **Prefer translate and scale.** Avoid rotation (hard to track; Heer & Robertson cite translation and expansion as easiest). Pie-to-bar morphs are spectacle, not analysis.
- **Axis ticks cross-fade** at their new positions; gridlines move with the scale.
- **Interrupt cleanly**: a new filter mid-transition retargets from current positions, never queues.

## Anti-patterns (don't)
- Bars that grow from zero on every filter change. The user re-reads the whole chart, and the "change" carries no data.
- Index-keyed transitions, where a bar morphs into a different category's bar.
- Morphing a line chart into a bar chart because the library can.
- Animated bubble playback (Gapminder style) as the main analysis tool for trends.
- A stagger across 50+ items that takes 2 s or more to complete.
- Area or stacked charts that interpolate `d` strings, producing self-intersecting shapes mid-tween.
- Live charts that ease every tick, so the line never rests.

## Good references
- [Mike Bostock, Object Constancy](https://bost.ocks.org/mike/constancy/): the canonical argument. Use keys; animate filtering, reordering and dimension switching for the same entities; cross-fade or cut for unrelated data. Animation "should only be used when it enhances understanding."
- [Heer & Robertson, Animated Transitions in Statistical Data Graphics (InfoVis 2007, PDF)](https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf): design principles (keep intermediate states valid; group similar transitions; minimise occlusion; maximise predictability; use staging; "make transitions as long as needed, but no longer") plus experiments showing animated transitions significantly improve graphical perception over static cuts.
- [Square Crossfilter demo](https://square.github.io/crossfilter/): linked histograms update in under 30 ms with no easing during brushing. Shows that direct manipulation needs instant redraw, not animation.

## Bad references
- [Robertson et al., Effectiveness of Animation in Trend Visualization (InfoVis 2008)](https://www.microsoft.com/en-us/research/?p=145396): Gapminder-style animated bubbles were the slowest and least accurate format for analysis, though participants found them "enjoyable and exciting". The evidence against animation-as-analysis. A 2019 mobile follow-up ([Brehmer et al.](https://arxiv.org/abs/1907.03919v1)) found small multiples consistently faster.
- Chart-library demos (Highcharts, Chart.js defaults) with `animation: true` that grows every series from the baseline on load and on each `update()`. It is on by default, so most dashboards ship it unexamined.

## Accessibility
- Under `prefers-reduced-motion: reduce`, replace movement with an instant update or a ≤ 150 ms cross-fade. Keep a brief highlight (outline or colour pulse once) on changed marks, so the change is still signalled without motion.
- Announce data changes through the chart's text alternative or data table, not through motion alone ("Sorted by revenue, descending").
- Animated charts that auto-play time steps for more than 5 s need pause/play (WCAG 2.2.2).
- Focus stays on the control that triggered the change. Don't move focus into the chart.

## Motion / interaction (if relevant)
- During brushing, slider drags and zoom/pan: **no easing**; redraw each frame directly (see `motion-linked-exploration.md`). Animate only the discrete commit (filter applied, sort chosen).
- Live time series: shift by translating the plot group with linear easing over the tick interval, or no animation. Never ease-in-out per tick.

## Tokens and values
| Token | Value |
|---|---|
| `--chart-dur-axis` | 350 ms |
| `--chart-dur-marks` | 400 ms |
| `--chart-dur-enter-exit` | 200 ms (opacity) |
| total staged transition | ≤ 1000 ms |
| stagger per item | 25 ms, total cap 300 ms |
| easing (moving marks) | `cubic-bezier(0.4, 0, 0.2, 1)` (slow-in/slow-out) |
| unrelated data switch | cut, or 150 ms cross-fade |
| reduced motion | 0 ms, plus one 600 ms highlight outline on changed marks |
| animate when item count | ≤ ~200 marks; above that, cut |

## Implementation sketch
```ts
// D3-style keyed join with staging; types only, no `any`.
import { select, type Selection } from 'd3-selection';
import 'd3-transition';
import { easeCubicInOut } from 'd3-ease';

type Row = { id: string; label: string; value: number };

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = reduce ? 0 : 1;

export function updateBars(
  g: Selection<SVGGElement, unknown, null, undefined>,
  rows: readonly Row[],
  y: (id: string) => number,
  x: (v: number) => number,
): void {
  const bars = g.selectAll<SVGRectElement, Row>('rect').data(rows, (d) => d.id); // KEYED

  bars.exit().transition().duration(200 * D).style('opacity', 0).remove();

  const entered = bars.enter().append('rect')
    .attr('y', (d) => y(d.id)).attr('width', (d) => x(d.value)).style('opacity', 0);

  // Stage 1 (axis) is handled by the caller over 350 ms; marks start after it.
  bars.merge(entered)
    .transition()
    .delay((_, i) => (350 + Math.min(i * 25, 300)) * D)
    .duration(400 * D)
    .ease(easeCubicInOut)
    .attr('y', (d) => y(d.id))
    .attr('width', (d) => x(d.value))
    .style('opacity', 1);
}
```
For DOM-based charts or tables, `element.startViewTransition()` with `view-transition-name: match-element` on rows gives keyed re-sort animation for free (see `motion-view-transitions.md`).

## Checklist
- [ ] Every mark is keyed by a stable domain ID.
- [ ] Unrelated-data switches cut or cross-fade; they don't morph.
- [ ] Complex changes are staged (axis → marks → enter) with a total ≤ 1 s.
- [ ] Enter and exit use opacity, not fly-ins or grow-from-zero.
- [ ] No overshoot or bounce on data marks.
- [ ] No easing during continuous manipulation (brush, drag, pan).
- [ ] Reduced motion means an instant update plus a non-motion highlight.
- [ ] Trend comparisons are offered as small multiples or static overlays, not only playback.

## Sources
- https://bost.ocks.org/mike/constancy/
- https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf (redirected; accessible via https://idl.uw.edu)
- https://www.microsoft.com/en-us/research/?p=145396
- https://faculty.cc.gatech.edu/~stasko/papers/infovis08-anim.pdf
- https://arxiv.org/abs/1907.03919v1
- https://square.github.io/crossfilter/
- https://www.nngroup.com/articles/animation-duration/
- https://carbondesignsystem.com/elements/motion/overview/
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/group-element-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/dynamic-sort.md
