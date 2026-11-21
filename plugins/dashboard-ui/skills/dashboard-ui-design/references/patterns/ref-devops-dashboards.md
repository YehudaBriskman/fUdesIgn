# Dev and ops dashboards: Vercel, Linear, Grafana, Datadog, Sentry

> Operational dashboards are organised around a method (RED, USE or the golden signals), parameterised by variables instead of copied, and they hide detail behind progressive disclosure until triage needs it.

**Category:** Reference gallery · **Applies to:** monitoring and observability boards, admin consoles, issue and incident pages, product chrome for dense tools · **Priority:** should

## When to use / when not
- Use this when the dashboard monitors something that changes continuously and someone must act on it (NN/g's "operational" dashboard type).
- Use the Linear and Vercel lessons for the chrome of any dense SaaS tool, not just ops.
- Not for executive or analytical summaries. Those need fewer, slower metrics with targets (see ref-product-analytics-dashboards.md).

## Rules (do)
**Grafana: organise by method, fight sprawl**
- Pick a method per dashboard. Use **RED** (Rate, Errors, Duration) for services, **USE** (Utilization, Saturation, Errors) for resources, and the **Four Golden Signals** (Latency, Traffic, Errors, Saturation) when you can track only four.
- Alert on symptoms (RED), and link every alert to the dashboard that explains it, "so browsing is directed rather than guessed".
- Use template variables (environment, cluster, node, data source) instead of one dashboard per node. Copies are the main cause of sprawl.
- Order rows by data flow, from the user-facing edge down to storage. Split a dashboard when magnitudes differ by orders of magnitude.
- Normalise units, for example CPU as % rather than raw cores, so viewers don't need hidden knowledge.
- Turn stacking off by default. Stacked lines hide individual series behaviour.
- Use a dual y-axis only for series with different units, and label both axes with units.
- Prefix throwaway dashboards with `TEST:` and review them periodically. Version-control dashboard JSON.

**Datadog: grid discipline and an "about" description**
- Use a 12-column grid. Timeseries widgets span **at least 4 columns**, and log or stream widgets **at least 6** (half width).
- Write a Markdown description for every dashboard: its goal, owner and what each template variable does. It is "essential for teams who don't use the dashboard daily".
- Define the goal first (service overview, debugging, or self-serve for consumers). A dashboard with a few widgets is fine if the goal needs no more.
- Group related widgets, even single ones, under group headers. Groups lay out side by side in high-density mode on wide screens.
- Share reusable modules (Powerpacks) for golden-signal panels, so every service looks the same.

**Sentry: issue detail as progressive disclosure**
- Separate *actions* (resolve, assign, ignore) from *information* (event, stack, tags) with clear boundaries.
- Make every section collapsible. Put tags, breadcrumbs and activity in drawers so the default view stays short.
- Surface "highlights" (the few most relevant tags) at the top instead of the whole tag table.
- Treat the most-trafficked page (issue details) as a performance budget. Sentry prefetches data to make it fast.

**Linear: calm, dense chrome**
- Frame the work area with an inverted-L of sidebar plus top bar. Headers hold filters and display options, and side panels hold properties.
- Generate themes in **LCH**, not HSL, so equal lightness looks equally light across hues. Linear cut theme inputs from 98 variables to 3: base, accent and contrast.
- Expose a contrast variable so users can raise contrast. Make text and neutral icons darker in light mode and lighter in dark mode.
- Express elevation through surface lightness (background, panel, dialog, modal) rather than heavy shadows.
- Limit the brand accent in chrome. Use neutral chrome so status colours and data carry the signal.

**Vercel: Web Interface Guidelines (data display)**
- Use `font-variant-numeric: tabular-nums` (or a mono face) wherever numbers are compared.
- Delay showing a spinner or skeleton by **150–300 ms**, and once shown keep it visible for **300–500 ms** so it doesn't flicker.
- Use optimistic updates. Mutations should complete in **under 500 ms**, and roll back with an error or Undo on failure.
- Persist filters, tabs, pagination and expanded panels in the URL.
- Design empty, sparse, dense and error states for every view.
- Prefer APCA for perceptual contrast. Interactive states get more contrast than rest. Never use colour alone for status.

## Anti-patterns (don't)
- **Dashboard sprawl:** hundreds of copied boards with copied tags that pollute search (Grafana's "low maturity").
- **Editing in production:** viewers editing the canonical board in the browser, so it drifts without review.
- **Stacked area by default:** it hides which series spiked.
- **Squashed timeseries:** fewer than 4 grid columns makes the x-axis unreadable.
- **Everything expanded:** a full tag table, full breadcrumbs and full stack trace on first paint (Sentry before its redesign).
- **Brand colour as chrome:** a saturated accent on nav, headers and buttons competes with red and amber status.

## Good references
- [Grafana: Dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/). Covers RED, USE and golden signals, a maturity model, variables and anti-sprawl rules.
- [DataDog/effective-dashboards guidelines](https://github.com/DataDog/effective-dashboards/blob/master/guidelines.md). Gives column minimums, a mandatory description, and grouping rules.
- [Datadog: Dashboards and monitors at scale](https://www.datadoghq.com/blog/dashboards-monitors-at-scale/). Covers Powerpacks for consistent shared modules.
- [Sentry changelog: New issue details UI](https://sentry.io/changelog/new-issue-details-ui-now-available/). Applies information hierarchy plus progressive disclosure.
- [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui). Describes LCH themes, 3 inputs, a contrast slider and surface elevation.
- [Vercel: Web Interface Guidelines](https://vercel.com/design/guidelines). Specifies loading timings, tabular numbers, URL state and states coverage.

## Bad references
- Grafana's own "low maturity" description in the page above: everyone edits, copies accumulate, no version control. It is a frank description of most real Grafana installs.
- The classic NOC "wall of gauges" style (see Few's pitfall #11 in ref-ux-research-findings.md). Skeuomorphic dials and LED meters spend space on decoration.

## Accessibility
- Status must have text: "Degraded", not only an amber dot.
- Live-updating panels must not announce every tick. Use a polite `aria-live` only for state changes (OK to Degraded), not for values.
- Collapsible sections use `<details>`/`<summary>` or buttons with `aria-expanded`.
- Respect a high-contrast preference (`prefers-contrast: more`), as Linear's contrast variable does.

## Motion / interaction
- Auto-refresh must not reset scroll, zoom, hover or open drawers. Refresh data in place.
- Shared crosshair: hovering one timeseries shows the same timestamp on all panels in the group.
- Drag-select a time range on any chart to zoom the whole dashboard, with Back to undo.

## Tokens and values
| Token | Default | Source |
|---|---|---|
| Grid | 12 columns | Datadog |
| Timeseries min width | 4 columns | Datadog |
| Log/stream min width | 6 columns | Datadog |
| Spinner show-delay | 150–300 ms | Vercel |
| Spinner min visible | 300–500 ms | Vercel |
| Mutation budget | < 500 ms | Vercel |
| Theme inputs | base, accent, contrast (LCH) | Linear |
| Signals per service row | 3–4 (RED or golden) | Grafana |
| Stacking | off by default | Grafana |

## Implementation sketch
```html
<header class="board-head">
  <h1>checkout-api</h1>
  <details class="about"><summary>About this dashboard</summary>
    <p>RED view for checkout-api. Owner: payments-oncall. <code>$env</code> selects the cluster.</p>
  </details>
  <form class="vars" aria-label="Dashboard variables">
    <label>Env <select name="env"><option>prod</option><option>staging</option></select></label>
  </form>
</header>
<section class="row" aria-label="Requests">
  <figure class="panel span-4"><figcaption>Rate <small>req/s</small></figcaption>…</figure>
  <figure class="panel span-4"><figcaption>Errors <small>% of requests</small></figcaption>…</figure>
  <figure class="panel span-4"><figcaption>Duration p95 <small>ms</small></figcaption>…</figure>
</section>
```
```css
.row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px; }
.span-4 { grid-column: span 4; } .span-6 { grid-column: span 6; }
@container (inline-size < 720px) { .span-4, .span-6 { grid-column: 1 / -1; } }
.panel figcaption small { color: var(--text-secondary); } /* unit always shown */
```

## Checklist
- [ ] The dashboard states its method (RED, USE or golden) and its owner in a description.
- [ ] One dashboard plus variables replaces N copies. Variables are in the URL.
- [ ] Every panel title includes its unit, and dual axes are labelled.
- [ ] Timeseries are at least 4 of 12 columns wide, and logs at least 6.
- [ ] Alerts link to the explaining dashboard.
- [ ] Loading indicators use a show-delay and a minimum duration.
- [ ] Detail (tags, breadcrumbs) is collapsed by default, and actions are visually separate from information.

## Sources
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://github.com/DataDog/effective-dashboards (and guidelines.md)
- https://www.datadoghq.com/blog/dashboards-monitors-at-scale/
- https://sentry.io/changelog/new-issue-details-ui-now-available/
- https://blog.sentry.io/issue-detail-performance-improvements
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://vercel.com/design/guidelines
- https://www.nngroup.com/articles/dashboards-preattentive/
- modern-web-guidance: guides/user-experience/content-first-noise-reduction.md (details/summary for secondary content)
