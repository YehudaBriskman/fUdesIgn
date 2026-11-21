# Filter bars and filter chips

> Keep one filter bar per dashboard scope. Show every applied filter as a visible, individually removable chip with a "Clear all". Write the filter state to the URL so the filtered view can be shared.

**Category:** Components and interaction · **Applies to:** dashboard-level filters (date, entity, segment), table and list filters, saved views, cross-filtering from charts · **Priority:** must

## When to use / when not
- **Global filter bar** (top of the dashboard, under the page header): use it for dimensions that apply to *every* widget, such as date range, company or ticker, region, currency or segment. Keep to 3–5 always-visible controls. Further dimensions go behind a "+ Filter" button.
- **Local filters** (inside a card or table header): use these for dimensions that only affect that widget. The card must show its local filter state in its header, so nobody misreads a card that differs from the global scope.
- **Faceted sidebar** (vertical list of facets with counts): use it for large catalog-like datasets with many attributes, such as a screener with 20+ fields. It costs metadata and UI effort, so justify it first (NN/g: "a simple filter can often be easier to understand and faster to use").
- **Don't** use a filter where a *view switch* is meant. "Income statement / Balance sheet" is a tab, not a filter (see `comp-tabs-segmented-pills.md`).
- **Instant vs batch apply:**
  - Apply instantly when one query returns in under ~1 s: chips, single selects, toggles.
  - Use batch apply (an "Apply" button inside the filter popover) when queries are expensive (>1–2 s), when the user is building a multi-condition filter, or on mobile filter sheets.
  - Never mix both models in one bar.

## Rules (do)
- **Applied-filter overview always visible.** Baymard found 28% of sites had no applied-filter overview, and users then lost track of why results were missing. Show each applied filter as a chip in the format `Field operator value`, e.g. `Sector is Energy, Utilities` or `Market cap > $10B`.
  - Include the field name whenever values are ambiguous alone. "90cm" means nothing; "Width: 90cm" does (Baymard). In finance, "> 10" means nothing; "P/E > 10" does.
- **Each chip is removable in one action** via an × button that has `aria-label="Remove filter: Sector is Energy"`. Clicking the chip body reopens its editor with the current values. Don't remove on body click; that's too easy to trigger by accident in dense UIs.
- **"Clear all"** appears as soon as ≥2 filters are applied, at the end of the chip row, as a ghost button.
- **Summarise multi-value selections.** Show up to 2 values, then "+N": `Status is Open, Blocked +2`. Primer recommends a summary like "2 selected" over a comma list.
- **Keep the chip row on one line on desktop.** If it overflows, collapse it with "+3 more" rather than pushing content down. Baymard warns that multi-row overviews push the first results below the fold.
- **Operators are explicit and editable**, as in Linear: is / is not / is any of / includes all / before / after / between. The field type is fixed after creation. The operator and values can change.
- **"+ Filter" opens a searchable field list.** Typing a property name (team, status, sector) offers it as a filter. Linear also lets typing a *value* create the filter directly.
- **Keyboard.** Press `F` (when focus is not in a text field) to open "+ Filter". Esc closes the popover without applying in batch mode. See `comp-keyboard-shortcuts-focus.md` for the single-key shortcut rules.
- **Result count and empty state.** Show the resulting count ("128 of 3,412 companies"). When filters return nothing, the empty state names the filters and offers "Clear filters" or "Remove <last filter>".
- **URL.**
  - Serialise filters as readable query params, e.g. `?sector=energy,utilities&mcap_gt=10e9&from=2025-01-01&to=2025-12-31`.
  - Omit defaults.
  - Use `pushState` when a filter is committed. Use `replaceState` with a 300 ms debounce for text and range input.
  - Shared links reproduce the view (Linear, Grafana).
- **Saved views.** Once a dashboard has ≥3 filter dimensions, let users save the combination as a named view. Show "Modified" with Save and Reset when the current filters diverge from the saved view.
- **Cross-filtering from charts.** Clicking a bar or legend item adds a chip just like a manual filter, so it is visible and removable, never hidden state.
- **Counts on options are optional.** Show them when cheap ("Energy (42)"). Grey out zero-count options and keep them in place rather than hiding them, so the list doesn't reflow.

## Anti-patterns (don't)
- Showing only "Filters (3)" with no visible list of what is applied (Baymard).
- An incomplete overview, where a filter that is applied doesn't appear as a chip. Baymard's example is Adidas omitting an applied size filter.
- Applying filters silently from a chart click, a URL or a saved view without a chip.
- Removing the selected option from its original list when it becomes a chip (it should stay in place, checked).
- Closing the filter menu after every single selection in a multi-select.
- A filter bar that scrolls away while the data below it changes. Make it sticky or repeat the scope in card headers.
- Local and global filters looking identical, so a card silently ignores the global date range.
- Filters stored only in memory, lost on refresh and not shareable.
- Mixing chips with and without field names in one row (Baymard: inconsistent).

## Good references
- [Baymard — How to design applied filters](https://baymard.com/blog/how-to-design-applied-filters) — research-backed: 28% of sites lack an overview; one-tap × removal; "Clear all"; include the filter type for spec-heavy data; truncate rows instead of pushing results down.
- [Linear — Filters](https://linear.app/docs/filters) — explicit editable operators, nested AND/OR groups, an `F` shortcut, property search, and filters persisted in the URL.
- [Grafana — dashboards](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/) — dashboard-wide variables and time range live in the URL and apply to all panels, so scope is unambiguous.
- [Datadog](https://www.datadoghq.com) / [PostHog](https://posthog.com) (products) — filter expressions render as chips such as `env:prod` and `service:api` that read like the query itself, so copying the URL or the expression reproduces the view.

## Bad references
- [Baymard — applied filters, anti-pattern examples](https://baymard.com/blog/how-to-design-applied-filters) — count-only "Filter (3)" buttons on mobile, overviews hidden inside the filter drawer, and multi-row overviews pushing products below the fold.
- [NN/g — Filters vs. Facets](https://www.nngroup.com/articles/filters-vs-facets/) — format-only filter tabs (recipes/photos/videos) that don't match the dimension users actually filter on (diet). In dashboards the equivalent is offering "chart type" filters when users need "segment".
- Typical BI tools with filters hidden in a collapsed right-hand "Filters pane". A report looks complete while 2 filters are silently applied, and screenshots get shared without the filter context.

## Accessibility
- Wrap the bar in `<search>` (or `role="search"`) with an accessible name such as "Dashboard filters".
- The chip row is a list (`<ul aria-label="Applied filters">`). Each chip has a text label and an × button with an explicit name.
- When a chip is removed, move focus to the next chip's ×, or to "+ Filter" if none remain. Never drop focus to `<body>`.
- Announce result changes politely, with debouncing: "128 companies match". Don't announce every keystroke.
- Chips meet the 24×24 target. The × hit area is ≥24×24 even if the glyph is 12px.
- A selected state uses a check or icon as well as colour.

## Motion / interaction (if relevant)
- A chip enters with a 120 ms fade and scale from 0.96 and exits with a 100 ms fade. Neighbours reflow without animation, or use a View Transition with a short duration. No motion under reduced motion.
- While a query runs after a filter change, keep the old data visible but dimmed (opacity .6) with a thin progress bar on the affected widget, instead of blanking it to a skeleton.

## Tokens and values
| Token | Default |
|---|---|
| Filter bar height | 40–48px; sticky under the page header |
| Chip height / radius | 28px / 6px (or 14px pill) |
| Chip padding / gap | 8px inline / 6px between chips |
| Chip text | 13px; field name `fg-muted`, value `fg` |
| Remove × hit area | 24×24 |
| Visible values per chip | 2, then "+N" |
| Always-visible global filters | 3–5 |
| Instant-apply threshold | query < 1s; otherwise batch with Apply |
| URL debounce for text/range | 300ms |
| Colour roles | `chip-bg` = `surface-sunken`, `chip-border` = `neutral-border`, active = `accent-subtle-bg` |

## Implementation sketch
```html
<search aria-label="Dashboard filters" class="filter-bar">
  <button type="button" class="btn btn--sm" popovertarget="date-picker">Last 90 days ▾</button>
  <button type="button" class="btn btn--sm btn--ghost" popovertarget="add-filter" aria-keyshortcuts="F">+ Filter</button>
  <ul class="chips" aria-label="Applied filters">
    <li class="chip">
      <button type="button" class="chip__body" popovertarget="edit-sector">
        <span class="chip__field">Sector</span> is <span class="chip__value">Energy, Utilities</span>
      </button>
      <button type="button" class="chip__remove" aria-label="Remove filter: Sector is Energy, Utilities">×</button>
    </li>
  </ul>
  <button type="button" class="btn btn--sm btn--ghost">Clear all</button>
  <p role="status" class="filter-count">128 of 3,412 companies</p>
</search>
```
```css
.filter-bar { position: sticky; top: var(--header-h); display: flex; align-items: center; gap: 8px;
  min-block-size: 44px; padding-inline: 16px; background: var(--surface); border-block-end: 1px solid var(--neutral-border); }
.chips { display: flex; gap: 6px; overflow: clip; list-style: none; margin: 0; padding: 0; min-inline-size: 0; }
.chip { display: inline-flex; align-items: center; block-size: 28px; border: 1px solid var(--neutral-border);
  border-radius: 6px; background: var(--chip-bg); font-size: 13px; white-space: nowrap; }
.chip__field { color: var(--fg-muted); }
.chip__remove { min-inline-size: 24px; min-block-size: 24px; }
.filter-count { margin-inline-start: auto; color: var(--fg-muted); font-variant-numeric: tabular-nums; }
```
```ts
type Filter = { field: string; op: 'is' | 'is_not' | 'gt' | 'lt' | 'between'; values: readonly string[] };

export function filtersToParams(filters: readonly Filter[], url: URL): URL {
  for (const f of filters) url.searchParams.set(`${f.field}.${f.op}`, f.values.join(','));
  return url;
}
export function commitFilters(filters: readonly Filter[]): void {
  const url = new URL(location.href);
  [...url.searchParams.keys()].filter((k) => k.includes('.')).forEach((k) => url.searchParams.delete(k));
  history.pushState(null, '', filtersToParams(filters, url));
}
```

## Checklist
- [ ] Every applied filter, including those from chart clicks, saved views or the URL, is a visible chip showing field + operator + value.
- [ ] Each chip removes with one × click. "Clear all" appears at ≥2 filters.
- [ ] Global and local scopes are visually distinct. Cards with local filters show them in the header.
- [ ] The filter state round-trips through the URL, and Back undoes a committed filter.
- [ ] The apply model (instant or batch) is consistent across the bar and justified by query latency.
- [ ] Removing a chip leaves focus on a sensible element, and the result count is announced politely.
- [ ] The empty state names the active filters and offers a one-click way out.

## Sources
- https://baymard.com/blog/how-to-design-applied-filters
- https://www.nngroup.com/articles/filters-vs-facets/
- https://linear.app/docs/filters
- https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/
- https://alfy.blog/2025/10/31/your-url-is-your-state.html
- https://primer.style/product/components/button/guidelines (summarised multi-selection labels)
- https://www.nngroup.com/articles/response-times-3-important-limits/
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/forms.md` (wrap filtering controls in `<search>`)
- modern-web-guidance: `skills/modern-web-guidance/guides/accessibility/accessibility.md` (live region urgency, focus management)
- modern-web-guidance: `skills/modern-web-guidance/guides/ui-atoms/scrollability-affordance-hints.md` (fades for overflowing chip rows)
