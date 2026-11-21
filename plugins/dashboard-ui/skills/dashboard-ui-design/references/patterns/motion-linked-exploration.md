# Interactive exploration: drill-down, cross-filtering, brushing and linking, zoom and pan

> Follow "overview first, zoom and filter, then details on demand". Every exploration action must update linked views within 100 ms during manipulation (redraw directly, no easing), show the active filters as removable chips, be reversible in one step, and live in the URL.

**Category:** Interaction · **Applies to:** multi-chart dashboards, time-series explorers, tables linked to charts, maps, hierarchical drill (portfolio → holding → lot, region → country → store) · **Priority:** should

## When to use / when not
Related: the information architecture behind this (Shneiderman's mantra) is in `found-overview-filter-details.md`; chip and filter-bar components in `comp-filter-bar-chips.md`; crosshair and tooltip rendering in `chart-tooltips-crosshair-labels.md`. This file covers the interaction mechanics, latency and motion.

Use:
- **Drill-down** for hierarchies where the parent is an aggregate of its children.
- **Cross-filtering** (click a bar, filter the other charts) for 2–6 coordinated views over the same records.
- **Brushing and linking** (drag a range on one view, highlight or filter the others) for continuous dimensions, especially time.
- **Zoom/pan** for dense time series and large scatter plots or maps.

Don't use:
- Cross-filtering across views built on **different grains or datasets** that can't be joined. It implies a relationship that doesn't exist.
- Click-to-filter on every chart in a reporting dashboard where readers expect static answers. Hidden state confuses shared screenshots and links.
- Zoom on bar charts with a categorical axis (use filter or sort), or on charts with < 50 points.
- Scroll-wheel zoom that captures page scroll without a modifier key or explicit focus.

## Rules (do)
- **Latency:** dynamic queries need display updates in < 100 ms (Shneiderman: "less than 100 milliseconds … even when there are tens of thousands of displayed items"). Crossfilter shows this is achievable ("<30ms" over nearly a quarter-million flights) with incremental indexes. If you can't meet it, update on release (batch), not on every move.
- **No animation during manipulation.** Brushing, panning and slider drags redraw synchronously each frame. Animate only the discrete commit: button zoom and reset at `--motion-dur-medium` 240 ms, a drill-in re-layout at `--motion-dur-long` 400 ms per stage (see `motion-chart-transitions.md`).
- **Highlight before filter:** default linked behaviour is *highlight* (selected at full opacity, others at 0.3), which preserves context. Offer *filter* (others removed) as an explicit choice. Keep totals honest: show "Filtered: 1,204 of 18,330 rows".
- **Filters are visible state:** every active cross-filter or brush appears as a chip in a filter bar ("Sector: Energy ✕", "Mar 3–Apr 18 ✕") with "Clear all". Never hide state only inside a chart.
- **One-step reversal:** `Esc` clears the current brush or selection; a click on empty plot area clears point selections; "Reset zoom" appears only when zoomed; double-click resets zoom (mirrors Vega-Lite, whose default `clear` event is `dblclick` and which resets a scale-bound view to its initial domains).
- **Drill-down shows the path:** breadcrumbs (Portfolio › Equities › AAPL), and Back returns to the parent with the previous selection and scroll restored. Each level is a URL (`?path=equities/aapl`).
- **URL state:** filters, brush ranges, zoom domain, drill path, selected tab. Share/refresh/back must reproduce the view (Vercel guidelines).
- **Brush mechanics (house values):** minimum brush size 8 px (avoid accidental 1-pixel brushes on click); handles ≥ 8 px wide with an `ew-resize` cursor; drag the body to move; brushed range labelled with exact values.
- **Zoom/pan mechanics:** wheel zoom only with `Ctrl/⌘` or after the chart has focus (or provide +/− buttons). Pinch on touch. Clamp to the data extent. Show an overview "minimap" strip with the visible window for long series. Keyboard: arrows pan, `+`/`−` zoom.
- **Shared crosshair:** on time-aligned panels, hovering one shows the crosshair (Grafana "Shared crosshair") or crosshair plus tooltips (Grafana "Shared tooltip") on all other graph panels. Cheap linking with no state change.
- **Details on demand:** click opens a side panel or drawer with the record. Hover tooltips are not the only path to details.
- **Resolve multi-brush semantics** explicitly when there are several brushes: use *intersect* (AND across dimensions) for filtering, and *union* only when the user asks. Vega-Lite's `resolve` offers `global | union | intersect`, and its default is `global` (one brush shared by all views), so set it explicitly.

## Anti-patterns (don't)
- Hidden cross-filters: clicking a bar silently filters other charts with no chip or indicator. Users then misread totals.
- Easing the redraw during brushing, so linked charts lag behind the cursor.
- Drill-down that opens a modal with no URL, so it can't be shared and Back leaves the dashboard.
- Scroll-jacking zoom on page scroll.
- Zoom that loses the context of where you are (no axis update, no minimap, no reset).
- Linked highlighting in colours that collide with semantic status colours.
- Drill paths that reset the parent's filters when going back.

## Good references
- [Shneiderman, The Eyes Have It (1996)](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf): the Visual Information-Seeking Mantra and seven tasks (overview, zoom, filter, details-on-demand, relate, history, extract). Dynamic queries need "rapid display update (less than 100 milliseconds)" with "rapid, incremental, and reversible actions".
- [Square Crossfilter](https://square.github.io/crossfilter/): the reference coordinated-views demo. Brush any histogram; all others plus a detail table update in < 30 ms over a quarter-million flights.
- [Vega-Lite selections](https://vega.github.io/vega-lite/docs/selection.html): a declarative grammar for point and interval selections, conditional encodings (highlight), filter transforms (cross-filter), scale binding (zoom/pan; clearing resets to the initial domains), `clear` on `dblclick` by default, and `resolve: global | union | intersect` (default `global`) for multi-view brushes.
- [Grafana dashboard settings](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/): the Graph tooltip setting (Default, Shared crosshair, Shared tooltip) at dashboard level, plus a global time picker that every panel follows.
- [NN/g, Applying Filters](https://www.nngroup.com/articles/applying-filters/): live filtering works when results are "shown less than one second" after each selection; otherwise batch with an *Apply* button. Scrolling the page to the top after a filter change can disorient users; NN/g suggests detecting intent before scrolling.
- [MDN, overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior): `overscroll-behavior: contain` on a pannable chart container stops scroll chaining to the page (Baseline widely available).

## Bad references
- Gapminder-style playback as the exploration mechanism: [Robertson et al. 2008](https://www.microsoft.com/en-us/research/?p=145396) found it the least accurate format for trend analysis compared with static traces or small multiples.
- [Power BI, Change how visuals interact](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions): "By default, visualizations on a report page cross-filter and cross-highlight the other visualizations on the page", and only users with edit permission can change it. The model is mixed: the doc's own example has one click on a map highlight the column chart and filter the line chart, and line charts, scatter charts and maps can only be cross-filtered, never cross-highlighted. Readers can misread filtered totals as global, especially in screenshots. The fix is visible chips, an explicit filtered count, and one consistent behaviour (highlight by default).

## Accessibility
- Every pointer exploration has a keyboard and form equivalent: date-range inputs mirror the brush; a select or list mirrors bar clicks; +/−/reset buttons mirror wheel zoom.
- Chart marks that act as filters are focusable (roving tabindex) with `aria-pressed` or `aria-selected`.
- Announce filter results politely: "Filtered to Energy: 42 holdings".
- Drill levels move focus to the new level's heading; Back restores focus to the drilled item.
- Highlighted versus dimmed differs by more than colour (opacity plus outline); dimmed marks stay ≥ 3:1 if they still convey data.

## Motion / interaction (if relevant)
- During drag: 0 ms; frame budget ≤ 10 ms per redraw (RAIL: "Produce each frame in an animation in 10 ms or less"). Use canvas/WebGL beyond ~5 K marks (house heuristic); split heavy recompute with `scheduler.yield()` (Chrome 129+, Firefox 142+, not Safari, so fall back to `setTimeout(0)`).
- On commit: reset zoom 240 ms, drill-in re-layout 400 ms per stage, both `--motion-ease-standard`, keyed marks.
- Zoom with the wheel/pinch tracks input directly; animate only the button-triggered zoom (240 ms).

## Tokens and values
| Token | Value |
|---|---|
| linked update latency | < 100 ms (target < 30 ms) |
| redraw frame budget | ≤ 10 ms |
| dimmed (non-selected) opacity | 0.3 |
| min brush size | 8 px |
| brush handle width | 8 px hit, 2 px visual |
| brush fill | `--accent` at 12% + 1 px border |
| commit transition | 240 ms (reset, button zoom) or 400 ms per stage (drill-in), `--motion-ease-standard` |
| button zoom step | ×2 / ×0.5, `--motion-dur-medium` 240 ms |
| filter chip | 24–28 px tall, removable ✕ ≥ 24 px target |

## Implementation sketch
```ts
// Shared filter state in the URL; views subscribe and redraw synchronously.
import { z } from 'zod';

const FilterState = z.object({
  sector: z.string().optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  path: z.string().optional(),            // drill path: "equities/aapl"
});
type FilterState = z.infer<typeof FilterState>;

type Listener = (s: FilterState) => void;
const listeners = new Set<Listener>();

export function readState(): FilterState {
  const raw: Record<string, string> = Object.fromEntries(new URL(location.href).searchParams);
  return FilterState.parse(raw);
}

export function setState(patch: Partial<FilterState>, mode: 'push' | 'replace'): void {
  const next = { ...readState(), ...patch };
  const url = new URL(location.href);
  for (const [k, v] of Object.entries(next)) v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
  history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
  listeners.forEach((fn) => fn(next));     // synchronous: no animation while brushing
}

export const subscribe = (fn: Listener): (() => void) => { listeners.add(fn); return () => listeners.delete(fn); };
addEventListener('popstate', () => listeners.forEach((fn) => fn(readState())));

// Brushing: replaceState while dragging (no history spam), pushState on release.
export function onBrushMove(from: string, to: string): void { setState({ from, to }, 'replace'); }
export function onBrushEnd(from: string, to: string): void { setState({ from, to }, 'push'); }
addEventListener('keydown', (e) => { if (e.key === 'Escape') setState({ from: undefined, to: undefined }, 'push'); });
```
```html
<div class="filter-bar" role="toolbar" aria-label="Active filters">
  <button class="chip" aria-label="Remove filter Sector: Energy">Sector: Energy ✕</button>
  <button class="chip" aria-label="Remove date range Mar 3 to Apr 18">Mar 3 – Apr 18 ✕</button>
  <button class="link">Clear all</button>
  <output>1,204 of 18,330 rows</output>
</div>
```

## Checklist
- [ ] Linked views update < 100 ms during manipulation, or switch to update-on-release.
- [ ] No easing while brushing/panning/dragging; only commits animate.
- [ ] Every active filter/brush/zoom is a visible, removable chip with a filtered count.
- [ ] `Esc`, Reset zoom and Back reverse exploration in one step.
- [ ] Filters, brush, zoom and drill path are in the URL.
- [ ] Wheel zoom doesn't hijack page scroll; keyboard and button equivalents exist.
- [ ] Cross-filtering only links views that share the same records and grain.

## Sources
- https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf
- https://square.github.io/crossfilter/
- https://vega.github.io/vega-lite/docs/selection.html
- https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/
- https://www.nngroup.com/articles/applying-filters/
- https://www.microsoft.com/en-us/research/?p=145396
- https://vercel.com/design/guidelines
- https://web.dev/articles/rail
- https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions
- https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
- https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- https://web.dev/articles/optimize-long-tasks
