# Tooltips, crosshairs, legends vs direct labels

> Put the essential numbers on the chart (direct labels, end labels, annotations); use the tooltip only for detail on demand, triggered by hover, focus and touch alike; snap a crosshair to the nearest x and share it across charts that share an axis; use a legend only when direct labels cannot fit.

**Category:** Charts and data visualisation · **Applies to:** every interactive chart, linked dashboards, small multiples, mobile charts · **Priority:** must

## When to use / when not
- Direct labels: default for ≤5 series, for bars (value at the end), for pies/donuts (2 to 5 slices) and for line ends. Carbon: "Avoid legends when possible and label data directly instead, since legends rely on visual association." Datawrapper: removing the key reduces eye travel.
- Legend: when series are many, labels would collide, or space is tiny (mobile). Skip it entirely for a single-series chart (Carbon).
- Tooltip: details-on-demand for exact values, secondary metrics, dates. Not a home for anything the user needs to understand the chart (NN/g: "Users shouldn't need to find a tooltip in order to complete their task"; Fossheim: don't hide important data behind hovers).
- Crosshair: dense time series (>30 points) and multi-panel views that share an x-axis (price + volume, p50/p99 + error rate). Not on bar charts with few bars; highlight the band instead.

## Rules (do)
**Direct labels**
- Line end labels in the series colour, right of the last point, collision-avoided (nudge vertically, min 14 px apart; if still colliding, fall back to legend).
- Label the latest value too ("EMEA 2.6M") so the most-asked number needs no hover.
- Max two text styles: small muted and larger strong (Datawrapper).
- On mobile, Datawrapper moves the colour key to the top; do the same when end labels would take more than ~25% of width.

**Legends**
- Position: top-left under the title on dashboards where space is scarce, bottom by default (Carbon). Keep the same position in every chart on a dashboard (Carbon dashboards).
- Order legend items in the same order as the data (top-to-bottom of the stack or of line end values), not alphabetically.
- Legend ≤ 2 lines by default; "View more" up to 30% of chart height, then scroll (Carbon).
- Interactive legend: hover dims other series to 30% opacity; click isolates; provide "Show all" reset (Carbon). Legend items are real `<button aria-pressed>` elements.
- Swatch shape matches the mark (line segment for lines, square for bars, circle for points); 12 × 12 px minimum.

**Tooltips**
- Trigger: pointer hover with ~0 to 50 ms delay on a plot (people scrub; long delays feel broken); keyboard focus on a data point; tap on touch (persist until tap elsewhere). Never hover-only.
- Content order: x value (date) as header, then series rows sorted by value or in legend order, each with swatch, name, value with unit, optionally change vs previous. Grafana tooltip modes: single (series under cursor), all (every series, hovered in bold, sortable), hidden. Default to "all" for ≤8 series, "single" beyond.
- Hide zero/empty rows when there are many series (Grafana "Hide zeros").
- Format numbers fully in the tooltip (more precision than the axis): axis "1.2M", tooltip "1,214,503".
- Position: offset 8 to 12 px from the pointer, flip to stay in the viewport, never cover the hovered point. For HTML tooltips, CSS anchor positioning with `position-try-fallbacks: flip-block, flip-inline` (MDN anchor positioning).
- WCAG 1.4.13: dismissible with Escape without moving the pointer, hoverable (pointer can move onto it), persistent until dismissed or focus/hover leaves.
- Max width ~280 px; no scrolling inside tooltips; no interactive content inside hover tooltips. If you need links ("open filing"), make it a click-opened popover (toggletip pattern).
- Hover proximity: snap to the nearest point within ~20 to 30 px (Grafana exposes "hover proximity" in px); outside it, hide.

**Crosshairs**
- Vertical rule 1 px, neutral at ~50% contrast, snapped to the nearest data x (not the raw pointer x), plus a dot on each series at that x.
- Optional horizontal rule only for price charts, with a y-axis value tag.
- Shared crosshair across charts with the same x-domain: hovering one draws the rule on all; only the hovered chart shows the full tooltip, others show dots (Grafana "shared crosshair / shared tooltip" dashboard option).
- Keyboard: Left/Right move the crosshair one data point, Home/End jump to first/last, PageUp/PageDown move by a larger step (mirrors APG grid keys), Escape exits.

## Anti-patterns (don't)
- A 10-item legend under a line chart where colours differ only in hue; readers bounce back and forth.
- Legend in a different position on each panel.
- Tooltips that are the only place values exist (fails touch, keyboard, screen readers, print, screenshots).
- Tooltips that cover the hovered point or jump sides on every mouse move.
- Tooltip with a 400 ms hover delay on a chart (built for buttons, wrong for scrubbing).
- Hover-to-reveal axis labels.
- Crosshair snapping to raw pointer position showing interpolated values that do not exist in the data.
- Sticky tooltips that cannot be dismissed with Escape.

## Good references
- [IBM Carbon: legends](https://carbondesignsystem.com/data-visualization/legends/) — placement rules, 30%-of-height limit, hover dims to 30%, click isolates, "avoid legends when possible".
- [Datawrapper: text in data visualizations](https://www.datawrapper.de/blog/text-in-data-visualizations) — direct labelling by default on desktop, key to the top on mobile, two text levels.
- [Grafana time series: tooltip and legend options](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/time-series/) — single/all/hidden modes, value sort order, hide zeros, hover proximity, legend list vs table, limit + "show all".
- [shadcn/ui charts](https://ui.shadcn.com/docs/components/chart) — `ChartTooltipContent` with indicator styles (dot/line/dashed), config-driven labels, `accessibilityLayer` adds keyboard and screen reader support on Recharts.
- [Highcharts accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview) — Tab to chart sections, arrows between points, values exposed to screen readers.
- [NN/g: tooltip guidelines](https://www.nngroup.com/articles/tooltip-guidelines/) — tooltips are brief "microcontent", not for essential info; on touch use tap-to-open tips.

## Bad references
- Dashboards (common in admin templates) with 8 to 12 series in a bottom legend and no direct labels; matching relies on colour memory and fails for colour-blind readers.
- [Fossheim: accessible dataviz design](https://fossheim.io/writing/posts/accessible-dataviz-design/) — documents the failure mode of hover-only values on mobile and for screen reader users, contrasting Apple Health's labelled bars.

## Accessibility
- Tooltip content must be reachable without a pointer: each focusable data point's accessible name equals the tooltip text ("12 Mar 2025, Revenue $1,214,503, up 3.1%").
- Do not put the tooltip in an `aria-live` region on hover; it floods screen readers. Announce only on keyboard moves. Screen readers do not reliably re-read a changed `aria-label` on an element that already has focus, so in the single-focus-target pattern below, also write the same text into a visually hidden `aria-live="polite"` region, updated only from the key handler. The alternative is one focusable element per data point (roving tabindex), which Highcharts and Recharts' `accessibilityLayer` take.
- Legend buttons: `aria-pressed`, visible focus ring with 3:1 contrast (WCAG 1.4.11), hit area ≥24 × 24 px (WCAG 2.5.8).
- Focus must not be obscured by the tooltip (WCAG 2.4.11).
- Respect `prefers-reduced-motion`: tooltips appear instantly, no slide.

## Motion / interaction (if relevant)
- Tooltip move: follow pointer with no easing (or ≤80 ms) to avoid lag; opacity fade-in ≤100 ms.
- Legend isolate: series fade 150 ms; axis rescale ≤200 ms or none.
- Touch: tap shows tooltip and crosshair; drag scrubs; tap outside dismisses. Long press for scrubbing if the chart sits in a scroll view (Robinhood pattern), so vertical scroll still works.

## Tokens and values
| Token | Default |
|---|---|
| Tooltip offset | 10 px from pointer/point |
| Tooltip max width | 280 px |
| Tooltip padding / radius | 8 px 10 px / 6 px |
| Tooltip font | 12 px, tabular-nums; header 12 px semibold |
| Tooltip show delay (chart) | 0–50 ms; hide delay 100 ms |
| Hover proximity | 24 px |
| Crosshair | 1 px, neutral 500 |
| Series dot at crosshair | 6 px diameter, 2 px surface ring |
| Legend swatch | 12 × 12 px, matches mark shape |
| Legend dim opacity | 0.3 |
| Legend max height | 30% of chart height |
| End-label min spacing | 14 px |

## Implementation sketch
Pointer + keyboard driven crosshair with a single accessible focus target.
```tsx
import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

interface Point { x: number; date: string; values: ReadonlyArray<{ series: string; value: number; color: string }> }

interface CrosshairChartProps {
  points: ReadonlyArray<Point>;  // sorted by x, x in px
  width: number;
  height: number;
  formatValue: (n: number) => string;
  onIndexChange?: (index: number | null) => void; // for shared crosshair across charts
  sharedIndex?: number | null;
}

export function CrosshairLayer({ points, width, height, formatValue, onIndexChange, sharedIndex }: CrosshairChartProps) {
  const [local, setLocal] = useState<number | null>(null);
  const idx = sharedIndex ?? local;
  const tipId = useId();

  const set = (i: number | null) => { setLocal(i); onIndexChange?.(i); };
  const nearest = (px: number): number => {
    let best = 0;
    for (let i = 1; i < points.length; i++) if (Math.abs(points[i].x - px) < Math.abs(points[best].x - px)) best = i;
    return best;
  };
  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    set(nearest(e.clientX - box.left));
  };
  const onKey = (e: KeyboardEvent<SVGRectElement>) => {
    const last = points.length - 1;
    const cur = idx ?? last;
    const step = Math.max(1, Math.round(points.length / 10));
    const next: Record<string, number> = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: last, PageUp: cur - step, PageDown: cur + step };
    if (e.key === "Escape") { set(null); return; }
    if (e.key in next) { e.preventDefault(); set(Math.min(last, Math.max(0, next[e.key]))); }
  };

  const p = idx === null ? null : points[idx];
  const label = p ? `${p.date}: ${p.values.map((v) => `${v.series} ${formatValue(v.value)}`).join(", ")}` : "Chart. Use arrow keys to read values.";

  return (
    <g>
      <rect width={width} height={height} fill="transparent" tabIndex={0} role="img" aria-label={label}
        aria-describedby={tipId} onPointerMove={onMove} onPointerLeave={() => set(null)} onKeyDown={onKey}
        onBlur={() => set(null)} className="hit" />
      {p && <line x1={p.x} x2={p.x} y1={0} y2={height} className="crosshair" aria-hidden="true" />}
      <desc id={tipId}>Left and Right move one point, Home and End jump, Escape clears.</desc>
    </g>
  );
}
```
```css
.crosshair { stroke: var(--chart-crosshair, color-mix(in oklab, CanvasText 50%, Canvas)); stroke-width: 1; pointer-events: none; }
.hit:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.chart-tooltip { position: fixed; max-inline-size: 280px; padding: 8px 10px; border-radius: 6px;
  font: 12px/1.4 var(--font-ui); font-variant-numeric: tabular-nums; pointer-events: auto; }
@media (prefers-reduced-motion: no-preference) { .chart-tooltip { transition: opacity .1s; } }
```
The visible tooltip (HTML, positioned next to `p.x`) repeats `label`; it is `aria-hidden` because the focused element's name already carries the same text.

## Checklist
- [ ] Essential values are visible without interaction (direct labels / end labels / annotations).
- [ ] Legend used only when direct labels do not fit; same position across the dashboard; data order.
- [ ] Tooltip opens on hover, focus and tap; dismisses with Escape; can be hovered.
- [ ] Tooltip never covers the hovered point and flips at viewport edges.
- [ ] Crosshair snaps to real data x; shared across charts with the same x-domain.
- [ ] Arrow/Home/End keys move through points; focus ring visible.
- [ ] Tooltip numbers show full precision with units.

## Sources
- https://carbondesignsystem.com/data-visualization/legends/
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://www.datawrapper.de/blog/text-in-data-visualizations
- https://www.datawrapper.de/blog/line-charts
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/time-series/
- https://ui.shadcn.com/docs/components/chart
- https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview
- https://www.nngroup.com/articles/tooltip-guidelines/
- https://fossheim.io/writing/posts/accessible-dataviz-design/
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- https://robinhood.com/us/en/support/articles/using-advanced-charts
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-fallbacks
- https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
