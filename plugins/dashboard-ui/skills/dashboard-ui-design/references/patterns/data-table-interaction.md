# Data table interaction: sticky, sort, select, act, page

> Freeze the header and the identifier column. Sort with a `<button>` in the `<th>` and `aria-sort`. Keep 1–2 row actions inline and put the rest in an overflow menu. Paginate at about 20–50 rows by default, and virtualise only when you must.

**Category:** Data display · **Applies to:** interactive data tables, admin lists, transaction tables, holdings tables · **Priority:** must

## When to use / when not
- Use when users scan, sort, filter, select or act on many records.
- Don't add sorting, selection or column controls to a 5-row summary table, which gives you interaction without a task.
- If cells are editable and keyboard navigation between cells is needed, use the ARIA grid pattern (`role="grid"`). Otherwise keep a native `<table>`, which is simpler and better supported.

## Rules (do)
### Sticky header and first column
- Make the table header sticky (`position: sticky; inset-block-start: 0`) whenever the table is taller than its scroll container. Make the identifier column sticky (`inset-inline-start: 0`) whenever it scrolls horizontally. NN/g: "Freeze header rows and header columns (if the table is larger than the screen)."
- Stacking: the corner cell gets `z-index: 3`, column headers 2, row headers 1 (Roselli). Every sticky cell needs an opaque background.
- Show a subtle shadow or 1px border on the sticky edge only when content is scrolled under it. Use `@container scroll-state(stuck: top)` with an `IntersectionObserver` fallback (`ui-atoms/state-aware-sticky-headers.md`).
- The scroll container is `<div role="region" aria-labelledby="caption-id" tabindex="0">`, so keyboard users can scroll it (`ui-atoms/responsive-table.md`).
- Set `scroll-padding-top` (equal to or greater than the sticky header height) on the scroller so focused rows aren't hidden under the header (WCAG 2.4.11).
- Keep sticky regions small. Sticky header plus sticky first column should stay at or below about 40% of the viewport width at 200% zoom.

### Sorting
- Put a `<button type="button">` inside each sortable `<th scope="col">`. Set `aria-sort="ascending|descending"` on the sorted `<th>` only, and remove it elsewhere (no `aria-sort="none"`).
- The first click sorts ascending for text and **descending for numbers and dates** (people want the biggest or newest first). The second click toggles. Pick one default and document it. modern-web-guidance defaults to ascending.
- Show the direction icon on the sorted column. Unsorted sortable columns show a faint icon on hover or focus (Carbon) or a persistent neutral chevron (Roselli, for infrequent-use UIs).
- Sort on raw values (`data-value`), with `Intl.Collator({numeric: true})` for text. `null` values sort last in both directions.
- Announce "Sorted by Amount, descending, 248 rows" in one visually hidden `role="status"` element. Never put `aria-live` on the table.
- Move existing `<tr>` nodes (`moveBefore`), don't re-render, so focus and row state survive (`ui-behaviors/sortable-table.md`).
- Server-sorted, paginated tables reset to page 1 on sort change and keep the sort in the URL.

### Selection and batch actions
- Use a checkbox column first (after an expand toggle, if any). The header checkbox is tri-state: checked, unchecked, indeterminate (Carbon).
- When 1 or more rows are selected, a batch action bar replaces the toolbar and shows "3 selected · Export · Delete · Cancel". Row-level actions are disabled during batch mode (Carbon).
- If select-all applies to a page, offer "Select all 2,481 results" explicitly (NN/g).
- The selected row uses a tint plus the checked box, never only the tint.

### Row actions
- **1–2 actions:** inline text or icon buttons with tooltips, visible always (touch has no hover).
- **3 or more:** a `⋯` overflow menu at the row's end. Carbon: with fewer than three options "keep the actions inline as icon buttons instead." The action column has no visible header (Primer) but keeps an accessible name ("Actions").
- The primary row click opens detail (a drawer or page) via a real link in the identifier cell. Don't make the whole `<tr>` a click target without a link.
- Prefer a non-modal side panel for editing (NN/g: "we generally don't recommend modals for deep editing work").

### Pagination vs load more vs virtualisation
- **Pagination (default):** 25 rows per page, with options 10, 25, 50 and 100. Primer suggests 20 as a starting point. The footer shows "1–25 of 2,481" and previous and next controls (Carbon: always at the bottom). This keeps position on return, makes items easy to refind, and gives a reachable footer (NN/g).
- **Load more:** for feeds, activity logs and audit trails read newest-first. Not for tables people compare across.
- **Infinite scroll:** avoid for data tables. NN/g says avoid it when users must "find something specific, compare items spread across a long list".
- **Virtualisation:** only when one view must hold more than about 1,000 rows client-side (traders' blotters, log explorers). Then:
  - use `table-layout: fixed` with fixed row heights (`estimateSize` equal to the density height);
  - use an overscan of 5–10 rows;
  - set `aria-rowcount` on the table and `aria-rowindex` on each rendered row (WAI-ARIA APG);
  - keep find-in-page in mind, because virtualised rows are not searchable. Provide in-table search.
- For long but bounded DOM tables (200–1,000 rows), `content-visibility: auto` with `contain-intrinsic-size: auto var(--row-h)` on row groups gives most of the win without virtualisation (`performance/defer-rendering-heavy-content.md`).

### Filtering and toolbar
- The toolbar sits above the table, with at most 5 actions (Carbon), and the rest in overflow. Put filters outside the header cells (Roselli).
- Active filters are visible as removable chips plus a "Clear filters" link (NN/g: "clear visual indication that filters are active").
- Show a result count: "248 of 2,481 invoices".

### Narrow screens
- Below about 600px of *container* width, either scroll horizontally with a sticky first column, or switch to a stacked card layout per row with injected labels (`ui-atoms/responsive-table.md`). Use stacking for at most 6 columns; scroll beyond that.

## Anti-patterns (don't)
- A clickable `<th>` with no button, or `role="button"` on a `<div>`.
- `aria-sort` on multiple headers, or on the button.
- Hover-only row actions (invisible on touch, undiscoverable). NN/g warns that hiding actions behind hover or generic menus hurts discoverability.
- Infinite scroll on a table with a footer total.
- Re-rendering `tbody` on sort, which loses focus and checkbox state.
- Sticky header whose background is transparent, so text bleeds through when scrolling.
- Modal dialog for every row edit.
- Pagination that resets the sort or filters, or that isn't in the URL.

## Good references
- [Carbon data table usage](https://carbondesignsystem.com/components/data-table/usage/) — batch action bar behaviour, the 3-action inline/overflow threshold, persistent row menus on touch, a toolbar of at most 5 actions, pagination always at the bottom.
- [NN/g, "Data Tables: Four Major User Tasks"](https://www.nngroup.com/articles/data-tables/) — freeze headers and columns, show active filters, side panel over modal for edits, select-all-results.
- [Adrian Roselli, "Sortable Table Columns"](https://adrianroselli.com/2021/04/sortable-table-columns.html) — button in th, one aria-sort, live-region announcement because several screen reader pairs stayed silent.
- [Adrian Roselli, "Fixed Table Headers"](https://adrianroselli.com/2020/01/fixed-table-headers.html) — z-index stacking for corner, header and row header cells; opaque backgrounds; region plus tabindex scroller; borders don't stick, so use gradients.
- [Primer DataTable](https://primer-docs-preview.github.com/product/components/data-table/guidelines) — 20 rows as a starting page size, no header on the action column.
- [WAI-ARIA APG data grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/) — `aria-rowcount` and `aria-rowindex` for partially loaded data.

## Bad references
- [NN/g, "Infinite Scrolling: When to Use It"](https://www.nngroup.com/articles/infinite-scrolling-tips/) — documents the failures of infinite scroll for goal-directed tasks: lost position, unreachable footer, and the illusion of completeness.
- Spreadsheet-style grids that virtualise 50-row tables. They break Ctrl+F, screen reader table navigation and print, for no performance gain.
- Hover-revealed row icon clusters (5 or more unlabeled icons) common in admin templates. NN/g flags crowded unlabeled icons as a discoverability failure.

## Accessibility
- Sort buttons have a visible focus ring, a target of at least 24×24px, and their label stays the column name (not "Sort ascending").
- Batch selection: the header checkbox has an `aria-label` like "Select all rows on this page", and row checkboxes are labelled by the row header (`aria-labelledby`).
- Overflow menu buttons: "More actions for Acme Logistics".
- Pagination is in a `<nav aria-label="Pagination">`, and the current page has `aria-current="page"`.
- After deleting rows, move focus to the next row or the table caption, never `<body>`.

## Motion / interaction (if relevant)
- Optional reorder animation via scoped view transitions for at most about 50 rows, with `prefers-reduced-motion` turning it off (`ui-behaviors/sortable-table.md`).
- The batch bar slides in at 150ms ease-out. The sticky shadow fades in at 120ms.
- Keep the current rows visible while the next page or sort loads, with a 2px progress bar at the top of the table, not a spinner overlay.

## Tokens and values
| Token | Default |
|---|---|
| Page sizes | 10 / 25 / 50 / 100 (default 25) |
| Inline row actions | at most 2; 3 or more go to overflow |
| Toolbar actions | at most 5 visible |
| Sticky z-index | corner 3 / col header 2 / row header 1 |
| Sticky shadow | `0 1px 0 var(--border-subtle), 0 2px 4px rgb(0 0 0 / .06)` |
| Sort icon | 12–16px, `currentColor`, `aria-hidden` |
| Virtualise threshold | more than 1,000 rows client-side |
| Overscan | 5–10 rows |
| Stack breakpoint | container below 600px, 6 or fewer columns |

## Implementation sketch
```html
<div class="dt-scroll" role="region" aria-labelledby="inv-cap" tabindex="0">
  <table class="dt" id="invoices">
    <caption id="inv-cap">Invoices <span class="sr-only">, column headers with buttons are sortable</span></caption>
    <thead><tr>
      <th scope="col" class="sel"><input type="checkbox" aria-label="Select all rows on this page"></th>
      <th scope="col" class="corner"><button type="button" commandfor="invoices" command="--sort">Customer</button></th>
      <th scope="col" class="num" aria-sort="descending" data-type="number">
        <button type="button" commandfor="invoices" command="--sort">Amount (USD)<svg aria-hidden="true">…</svg></button>
      </th>
      <th scope="col"><span class="sr-only">Actions</span></th>
    </tr></thead>
    <tbody>…</tbody>
  </table>
</div>
<p role="status" class="sr-only" id="sort-status"></p>
```
```css
.dt-scroll { overflow: auto; max-block-size: min(70vh, 720px); container-type: inline-size; scroll-padding-block-start: var(--row-h); }
.dt thead th { position: sticky; inset-block-start: 0; z-index: 2; background: var(--surface-1); }
.dt tbody th[scope="row"] { position: sticky; inset-inline-start: 0; z-index: 1; background: var(--surface-1); }
/* Corner: the column header above the sticky row-header column sticks on both axes.
   Mark it in markup (class="corner"); if a checkbox column precedes it, make that sticky too
   and offset the corner/row headers by its width via --sel-w. */
.dt thead th.corner { inset-inline-start: var(--sel-w, 0px); z-index: 3; }
.dt tbody th[scope="row"] { inset-inline-start: var(--sel-w, 0px); }
.dt th > button { all: unset; display: flex; gap: 4px; inline-size: 100%; min-block-size: 24px; cursor: pointer; justify-content: inherit; }
.dt th.num > button { justify-content: flex-end; }
.dt th > button:focus-visible { outline: 2px solid var(--focus); outline-offset: -2px; }
.dt th:not([aria-sort]) > button svg { opacity: 0; }
.dt th:not([aria-sort]) > button:is(:hover, :focus-visible) svg { opacity: .4; }
.dt th[aria-sort="ascending"] svg { rotate: 180deg; }
```

## Checklist
- [ ] The header (and the identifier column, if it scrolls horizontally) is sticky with an opaque background.
- [ ] The scroll region is focusable, named, and has `scroll-padding` for the sticky header.
- [ ] Sort uses a button in `th`, a single `aria-sort`, a raw-value compare, and a status announcement.
- [ ] Row actions are 2 or fewer inline, otherwise overflow. Nothing is hover-only.
- [ ] Batch bar with selection count, and an explicit "select all N results".
- [ ] Pagination with range text ("1–25 of 2,481"), with page, sort and filters in the URL.
- [ ] Virtualisation only above about 1,000 rows, with `aria-rowcount` and `aria-rowindex` and in-table search.
- [ ] The narrow-container behaviour is defined (scroll with sticky column, or stacked).

## Sources
- https://carbondesignsystem.com/components/data-table/usage/
- https://www.nngroup.com/articles/data-tables/
- https://www.nngroup.com/articles/infinite-scrolling-tips/
- https://www.nngroup.com/articles/comparison-tables/
- https://adrianroselli.com/2021/04/sortable-table-columns.html
- https://adrianroselli.com/2020/01/fixed-table-headers.html
- https://primer-docs-preview.github.com/product/components/data-table/guidelines
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/
- https://tanstack.com/virtual/latest/docs/introduction
- https://cloudscape.design/patterns/general/loading-and-refreshing/
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/sortable-table.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/state-aware-sticky-headers.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/performance/defer-rendering-heavy-content.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md
