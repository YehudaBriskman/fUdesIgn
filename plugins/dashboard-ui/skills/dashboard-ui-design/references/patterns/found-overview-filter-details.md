# Overview first, filter, details on demand

> Structure every dashboard as three linked layers: an overview of the whole, controls to narrow it, and details that open on request without losing the overview.

**Category:** Foundations · **Applies to:** dashboard information architecture, navigation, drill-down, filter bars, detail panels · **Priority:** must

## When to use / when not
- **Use** for any dashboard over a collection: accounts, transactions, services, holdings or experiments. It's Shneiderman's Visual Information-Seeking Mantra (1996): *"Overview first, zoom and filter, then details-on-demand."*
- **Use** to decide what lives on the home view (overview only), what goes in the filter bar (narrowing), and what goes behind a click (a record, a breakdown or raw rows).
- **Adapt the depth to the dashboard type** (see `found-dashboard-types.md`). Strategic and operational views stop mostly at the overview. Analytical views lean on filter and details.
- **Not** a license to hide the overview behind a filter form. If the first screen is "Select a date range and segment to begin", the mantra is inverted. Nor should the overview be something users must remember while they filter: `found-cognitive-load-and-recall.md`.

## Rules (do)
- **The overview shows the whole collection at once,** with no required interaction. Few defines a dashboard as information "consolidated and arranged on a single screen so the information can be monitored at a glance." Target: P1 and P2 content is visible at 1280×720 without scrolling.
- **Use one overview per question,** not one per data source. Grafana: "A dashboard should tell a story or answer a question", with a "logical progression of data, such as large to small or general to specific". If it has no goal, ask whether you need it.
- **Filters are global, visible and stateful:**
  - One filter bar at the top of the region it affects.
  - Active filters are always shown as removable chips.
  - Filter state lives in the URL, so views are shareable and the back button works.
  - Grafana recommends "maintaining a link to the master dashboard and customizing the view with URL parameters" instead of copying dashboards.
- **Linked views.** A filter or zoom applied in one chart updates every related chart (Carbon: "Mirror chart modifications like filter and zoom").
- **Keep the context on screen during details on demand.** Use a side panel or drawer for a single record, and a full page only for long workflows. Stripe Apps defaults to a side-by-side `ContextView` and reserves the blocking `FocusView` for start-to-finish tasks or a wider canvas.
- **Every summary number is a door.** A KPI, bar or legend item that summarizes rows should link to the filtered rows behind it. Expose this with a visible affordance (chevron, underline on hover, "View all"), not only a hidden click target.
- **Order sections macro to micro** (Datadog: "Go from macro to micro levels within the system" and "from upstream to downstream"), so scrolling *is* zooming in.
- **Support Shneiderman's other tasks once the core three work:**
  - *Relate*: compare to the previous period or a peer.
  - *History*: undo a filter, back.
  - *Extract*: export with the current query parameters.

## Anti-patterns (don't)
- **Fragmented overview.** Radio buttons or tabs that show one metric or slice at a time, so the whole is never seen together. Few's Pitfall #1, Fig. 2: seven sales metrics behind radio buttons, "never together".
- **Dashboard sprawl.** Duplicating a dashboard to change one filter. Copies miss upstream fixes, and users can't find the canonical one (Grafana maturity model, "low").
- **Details that replace the overview.** A click navigates away, and the filters are lost when the user comes back.
- **Hidden filter state.** The data is filtered, but nothing on screen says so, so users misread totals.
- **Drill-down dead ends.** A chart you can't click into, forcing users to rebuild the same query in another tool.
- **"Explore" as the home page.** An empty query builder as the first screen for users who wanted the status.

## Good references
- [Shneiderman, "The Eyes Have It" (1996)](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf): the original mantra and the seven tasks (overview, zoom, filter, details-on-demand, relate, history, extract). He wrote the mantra ten times, once per project where he rediscovered it.
- [Grafana: dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/): template variables in place of per-node copies, hierarchical drill-downs, and service rows ordered by data flow. RED (rate, errors, duration) as the overview of a service.
- [Datadog: integration dashboard guidelines](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): an overview group at the top, groups ordered macro to micro, stream widgets last in their own collapsible group, and template variables that every relevant graph responds to.
- [Stripe Apps design: views](https://docs.stripe.com/stripe-apps/design): the home view is "a quick overview of their business" that "routes them to core workflows". Details open in a drawer next to the object.
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/): splits *presentation* dashboards (status at a glance) from *exploration* dashboards (search, sort, filter, roll-up, drill-down).

## Bad references
- [Few, Common Pitfalls, Pitfall #1, Fig. 2](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): a sales dashboard split into radio-button-selected slices. The viewer "can never compare the performance of products or regions".
- [Grafana maturity model, "low" stage](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/): everyone edits, copies proliferate, JSON is not under version control, and there is "lots of browsing for dashboards, searching for the right dashboard". This is how filter-by-duplication ends.

## Accessibility
- The filter bar is a `<form role="search">` or `<search>` element with labelled controls. Announce result changes with a polite live region, for example "Showing 214 of 3,902 transactions".
- Active filter chips are buttons with names like "Remove filter: Region = EMEA".
- Detail drawers: use `<dialog>` (modal) only when the background is genuinely inert. Otherwise use a non-modal panel or `popover` that keeps focus management simple, and return focus to the triggering row on close.
- Drill-down targets inside charts must have a keyboard-reachable equivalent, such as a linked table or list (see the chart accessibility cluster).

## Motion / interaction (if relevant)
- Opening a detail panel: slide in over 240ms (`--motion-dur-medium`, `--motion-ease-enter`). Closing: 150ms (`--motion-dur-short`, `--motion-ease-exit`). Under `prefers-reduced-motion`, cross-fade or switch instantly.
- Applying a filter should update in place under 100ms for client-side data, which Ström estimates feels instant. Above about 1s, show a skeleton in the affected widgets only, not a full-page spinner.
- Preserve scroll position and selection when returning from a detail view.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| Overview fold target | P1 + P2 visible at 1280×720 | Few's single-screen ideal, relaxed for scrollable web |
| Filter bar height | 48–56px, single row | modern-web-guidance: sticky bars < 12% of viewport |
| Detail drawer width | `clamp(360px, 40vw, 480px)`; full width < 600px | Keeps the overview visible on desktop |
| Drawer open/close | 240ms enter / 150ms exit | `--motion-dur-medium` / `--motion-dur-short` |
| URL state | `?from=&to=&segment=&sel=` | Every filter and selection is serialisable |
| Max drill depth | 2 levels from overview | NN/g: > 2 disclosure levels has low usability |

## Implementation sketch
```html
<header class="filters">
  <search>
    <form method="get" action="">
      <label>Range <select name="range"><option>Last 30 days</option></select></label>
      <label>Segment <select name="segment"><option>All</option></select></label>
    </form>
  </search>
  <ul class="chips" aria-label="Active filters">
    <li><button type="button" data-remove="segment">Segment: Enterprise ✕</button></li>
  </ul>
  <p class="visually-hidden" aria-live="polite" id="result-count"></p>
</header>

<main class="overview">…KPIs and charts; each KPI is an <a href="?view=rows&metric=…">…</a></main>

<aside id="detail" popover="manual" aria-labelledby="detail-h">
  <h2 id="detail-h">Invoice INV-2041</h2>…
</aside>
```
```ts
type FilterState = { range: string; segment: string; sel: string | null };

function readFilters(url: URL): FilterState {
  const p = url.searchParams;
  return { range: p.get("range") ?? "30d", segment: p.get("segment") ?? "all", sel: p.get("sel") };
}
function writeFilters(next: FilterState): void {
  const url = new URL(location.href);
  for (const [k, v] of Object.entries(next)) v === null ? url.searchParams.delete(k) : url.searchParams.set(k, v);
  history.pushState(null, "", url); // back button = undo filter (Shneiderman "history")
}
```

## Checklist
- [ ] The first screen shows the whole collection with zero required input.
- [ ] Every filter is visible, removable and serialised in the URL.
- [ ] Every KPI or aggregate links to the rows that produce it.
- [ ] Details open beside the overview (drawer or panel) and close back to the same scroll and selection.
- [ ] Sections run macro to micro, top to bottom.
- [ ] Drill depth from the overview is ≤ 2 levels.
- [ ] There are no duplicated dashboards that differ only by a filter value.

## Sources
- https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://docs.stripe.com/stripe-apps/design
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://www.nngroup.com/articles/progressive-disclosure/
- https://mattstromawn.com/writing/ui-density/
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- modern-web-guidance/skills/modern-web-guidance/guides/ui-components/stack-drill-down.md
