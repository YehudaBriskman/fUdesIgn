# Loading, empty, error and partial-data states

> Every data region has five explicit states (loading, empty first-use, zero-results, error, partial or missing), each scoped to the smallest region that has it. "No data" is never shown while still loading, and missing is never shown as zero.

**Category:** Data display · **Applies to:** KPI cards, tables, charts, lists, whole dashboards · **Priority:** must

## When to use / when not
- Always design all five states before shipping a data component. NN/g calls showing "No records" while loading "especially harmful".
- Scope matters. A failed card shows a card-level error, and the dashboard stays up. A whole-page skeleton only appears on first load.

## Rules (do)
### Loading
- **Under 1s:** show nothing. Delay any indicator by 300–500ms so fast loads don't flash (NN/g: under 1s, indicators "aren't necessary").
- **1–10s:** use skeletons for structured content (tables, cards, lists) and a spinner for a single small module or a user-triggered action. Carbon prefers skeletons over spinners for tables; Cloudscape says "avoid [spinners] for standard table loading."
- **Over 10s:** use a determinate progress bar with a time estimate and Cancel (NN/g progress indicators). For exports and recomputes, consider a background job plus a notification.
- **Skeleton fidelity:** match the real layout. Same row height, column widths, alignment (right-aligned bars for numeric columns) and leading avatar if any. Primer: "The placeholder should match the real content as closely as possible."
- **Skeleton row count:** match the expected count (page size, capped at the visible viewport, typically 5–10). Don't show 25 rows for a table that usually has 3.
- **What not to skeleton:** buttons, toolbars, inputs, menus, toasts and modals (Carbon). Render static chrome (headers, labels, column titles) immediately. Only data gets a placeholder.
- **Refresh, not reload:** keep stale data visible during a refetch and show a small inline indicator next to the refresh control or a 2px top progress bar (Cloudscape: "Keep the data visible during the refresh"). Never flash back to skeletons on a filter change if the layout is stable. Dim stale rows to about 60% opacity at most.
- **Shimmer:** optional. NN/g notes animated skeletons can be "distracting ... or even create accessibility problems". Use a slow pulse (1.5–2s) or a static fill, and none under `prefers-reduced-motion`.

### Empty (no data yet, first use)
- Replace the table entirely, with no empty header row (Carbon: column headers should not appear, so screen readers don't read an empty table).
- Structure (Carbon, Cloudscape, Atlassian):
  - a title that states the condition ("No invoices yet");
  - 1–2 sentences on what will appear and why it's empty;
  - one primary action whose label matches the page's create button ("Create invoice");
  - an optional docs link.
- KPI cards on a new account show `0` only if zero is *true* (for example $0 revenue). Stripe shows zeros and flat sparklines plus a "make a test payment" prompt.
- Starter or sample data is acceptable if clearly labelled "Sample data" (Carbon "starter content", Loggly demo data per NN/g).

### Zero results (filters or search)
- The heading is "No matches" or "No invoices match these filters". The action is "Clear filters". Show the counter "Invoices (0)" (Cloudscape).
- Echo the active filters so the cause is visible.

### Error
- The message says what failed and what to do: "Couldn't load revenue. Retry". Use plain language with no error codes in the headline (Carbon), and put the code in a details disclosure for support.
- Scope:
  - a card error stays inside the card, at the card's size;
  - a table error replaces the body and keeps the toolbar;
  - a page-level banner is only for global failure such as auth or network.
- Never use an empty-state illustration for errors (Cloudscape: "Don't use empty states to show errors").
- Retrying keeps prior data visible if any, and marks it as stale with a timestamp (see `data-timestamps-freshness.md`).
- Permission errors are not errors. Say "You don't have access to payroll data · Request access".

### Partial and missing data
- **Missing cell:** use an em dash `—` (U+2014) or "No data" in muted text, with visually hidden "No data". Don't use a hyphen `-` in numeric columns, because it reads as minus (Grafana's default "No value" is `-`). Primer warns placeholder characters confuse screen readers, while Cloudscape uses `-` for empty values. Resolve it with a visible dash plus an accessible label.
- **Zero vs missing vs pending vs not applicable** are four different renderings:
  - `0` is a real zero;
  - `—` is no data;
  - "Pending" or a clock icon means not yet available ("Q4 closes Jan 15");
  - "N/A" means the metric doesn't apply to this row.
  SaaSframe: "Missing data indicates that the system lacks a value."
- **Partial aggregates:** if a total excludes failed sources, label it: "$1.24M · 2 of 3 accounts" with a warning icon and tooltip listing the missing sources. Cloudscape: "Partial or total failure: use a warning status indicator ... popover explains the failure and offers recovery."
- **Provisional or restated numbers:** mark them with a footnote marker (`†`) and a note. See `data-units-footnotes-sources.md`.
- **Charts with gaps:** break the line at missing points (`connectNulls: false`, Tremor's default). Never interpolate silently.

## Anti-patterns (don't)
- "No results" flashing before data arrives.
- A full-page spinner over a dashboard where 9 of 10 widgets have already loaded.
- Repeating the same large illustration in 8 failed widgets (Carbon: repeated illustrated states lose impact, so use text-only).
- `0` or `$0.00` for a failed fetch.
- A blank table with headers and no message (NN/g's "log dialogue" example).
- Jokes in error states (Carbon).
- Skeletons that don't match the layout, causing layout shift (CLS) when content arrives.
- "Frame-display" loading (only header and footer chrome). NN/g says it reads as broken.

## Good references
- [NN/g, "Skeleton Screens 101"](https://www.nngroup.com/articles/skeleton-screens/) — timing bands (under 1s none, under 10s skeleton or spinner, over 10s progress bar) and skeletons for full-page loads, spinners for single modules.
- [Carbon loading pattern](https://carbondesignsystem.com/patterns/loading-pattern/) — which components get skeletons and which never do, and progressive loading for dashboards and filter changes.
- [Carbon empty states pattern](https://carbondesignsystem.com/patterns/empty-states-pattern/) — replace the table entirely, text-only when many widgets fail, positive titles ("Start by adding data assets").
- [Cloudscape empty states](https://cloudscape.design/patterns/general/empty-states/) and [loading and refreshing](https://cloudscape.design/patterns/general/loading-and-refreshing/) — empty vs zero-results split, the "Clear filter" action, the resource counter "(0)", keeping data visible during refresh, a warning indicator for partial failure.
- [Atlassian empty state messages](https://atlassian.design/foundations/content/designing-messages/empty-state) — 1–2 sentence body, 1–2 word imperative CTA.
- [Primer DataTable](https://primer-docs-preview.github.com/product/components/data-table/guidelines) — skeletons match column width, alignment and leading visuals. Blankslate replaces the table.

## Bad references
- [NN/g empty state examples](https://www.nngroup.com/articles/empty-state-interface-design/) — an employee screen showing "No records" during loading, and an alerts panel left fully blank.
- Grafana's default "No value" of `-` ([docs](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/)) — on a big stat panel it is indistinguishable from a sign glyph and says nothing about why.
- Dashboards that render `NaN`, `undefined`, `Infinity%` (divide-by-zero deltas), common in hand-rolled React admin templates. They reveal no state model at all.

## Accessibility
- The loading region has `aria-busy="true"`. Skeleton shapes are `aria-hidden="true"`, with one visually hidden "Loading invoices" text per region, not per row.
- Use `<progress>` (indeterminate) for spinners (`ui-components/spinner.md`) and determinate `<progress value max>` for long jobs (`ui-components/progress.md`).
- Errors from user actions (retry or refresh failed) are announced via `role="alert"` once. Initial-load errors are just rendered in place (`accessibility/accessible-error-announcement.md`).
- On retry success, move focus back to the region heading if focus was on the Retry button, which no longer exists.
- Empty-state illustrations use `alt=""` (Carbon recommends an empty alt over `role="presentation"`).

## Motion / interaction (if relevant)
- Skeleton pulse: opacity 1 → 0.5 → 1 over 1.6s ease-in-out, infinite, off under `prefers-reduced-motion`.
- Content swap-in: 150ms opacity fade, with no slide (positions are already reserved).
- Indicator delay: 300ms (avoids flash). Minimum display once shown: 500ms (avoids flicker).

## Tokens and values
| Token | Default |
|---|---|
| Indicator delay | 300ms |
| Min indicator display | 500ms |
| Skeleton fill | `--surface-3` (about 1.3:1 to surface) |
| Skeleton radius | 4px text bars, card radius for blocks |
| Skeleton text bar height | 0.6em of the font size it replaces; numeric bars right-aligned, 40–60% cell width |
| Pulse | 1.6s ease-in-out |
| Stale data dim | opacity 0.6 at most |
| Missing glyph | `—` U+2014 in `--text-muted` plus SR "No data" |
| Empty-state max width | 40ch text block |
| Empty CTA | secondary or tertiary button when multiple empties are on screen |

## Implementation sketch
```ts
type LoadState<T> =
  | { kind: "loading" }
  | { kind: "refreshing"; data: T; since: Date }
  | { kind: "ready"; data: T; asOf: Date }
  | { kind: "empty" }                       // no records exist
  | { kind: "noMatch"; filters: readonly string[] }
  | { kind: "error"; message: string; retry: () => void; stale?: { data: T; asOf: Date } }
  | { kind: "partial"; data: T; missingSources: readonly string[]; asOf: Date };
```
```html
<!-- Loading table body: real header, skeleton rows -->
<tbody aria-busy="true">
  <tr class="sk" aria-hidden="true"><th><span class="bar" style="--w:70%"></span></th><td class="num"><span class="bar" style="--w:50%"></span></td></tr>
</tbody>
<p class="sr-only" role="status">Loading invoices</p>

<!-- Missing cell -->
<td class="num"><span class="missing" aria-hidden="true">—</span><span class="sr-only">No data</span></td>

<!-- Card-scoped error -->
<article class="kpi kpi--error" aria-labelledby="k1">
  <h3 id="k1" class="kpi-label">Net revenue</h3>
  <p>Couldn't load this metric.</p>
  <button type="button">Retry</button>
</article>
```
```css
.sk .bar { display: block; block-size: .6em; inline-size: var(--w); border-radius: 4px; background: var(--surface-3); }
.sk td.num .bar { margin-inline-start: auto; }
@media (prefers-reduced-motion: no-preference) {
  .sk .bar { animation: pulse 1.6s ease-in-out infinite; }
}
@keyframes pulse { 50% { opacity: .5; } }
.missing { color: var(--text-muted); }
[data-state="refreshing"] tbody { opacity: .6; transition: opacity .15s; }
```

## Checklist
- [ ] All five states are designed for every data component (loading, empty, zero-results, error, partial).
- [ ] The indicator is delayed by 300ms, and skeletons match the final layout (zero CLS).
- [ ] A refetch keeps data visible. No skeleton flash on filter change.
- [ ] An empty table is replaced by a message with one action. Zero-results offers "Clear filters".
- [ ] Errors are scoped to the failing region, in plain language, with Retry.
- [ ] Missing, zero, pending and N/A render differently. No bare hyphen in numeric cells.
- [ ] Partial aggregates are labelled with what's missing.
- [ ] `aria-busy`, a single status message, and reduced-motion handling are in place.

## Sources
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/empty-state-interface-design/
- https://carbondesignsystem.com/patterns/loading-pattern/
- https://carbondesignsystem.com/patterns/empty-states-pattern/
- https://cloudscape.design/patterns/general/empty-states/
- https://cloudscape.design/patterns/general/loading-and-refreshing/
- https://atlassian.design/foundations/content/designing-messages/empty-state
- https://primer-docs-preview.github.com/product/components/data-table/guidelines
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/
- https://www.saasframe.io/patterns/metrics
- https://www.925studios.co/blog/stripe-dashboard-design-breakdown
- https://www.tremor.so/docs/visualizations/spark-charts
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-components/spinner.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-components/progress.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/accessibility/accessible-error-announcement.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md
