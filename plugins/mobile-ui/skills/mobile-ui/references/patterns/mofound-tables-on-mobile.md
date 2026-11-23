# Tables on mobile

> On a phone, first ask whether the user compares across rows or reads one record: compare means a scroll region with a sticky first column and header; one record at a time means a stacked "card per row" list; and in both cases cut columns to the 2–4 that answer the task.

**Category:** Foundations · **Applies to:** transaction tables, comparison tables, pricing tables, schedules, data grids, admin lists · **Priority:** must

## When to use / when not
- **Use** whenever a `<table>` can render at compact width. The full desktop rules (alignment, numerics, density, interaction) are in dashboard-ui `data-table-layout-and-typography.md` and `data-table-interaction.md`, and the reflow strategy in `found-responsive-reflow.md`. This file adds the phone-specific choices; it does not repeat them.
- **Not** for layout. Never use a table to lay out a form or a card grid.

## Rules (do)
- **Decide by task (NN/g's mobile tables study):**
  - *Comparing across rows* (prices, scores, schedules): keep the table. Put it in a horizontally scrolling region with a sticky first column (the row identity) and a sticky header row. NN/g calls horizontal scrolling "somewhat acceptable" for large tables if the first column and headers are locked.
  - *Reading one record at a time* (orders, tickets, contacts): turn each row into a stacked block: the identity on top, 2–4 label/value pairs below, the rest in the detail view (modern-web-guidance `ui-atoms/responsive-table.md`); the block's anatomy is in `mofound-lists-and-cards.md`.
  - *Few rows, few columns* (up to 3 columns at 360 px): just fit it; keep it a table.
- **Column budget at 360–390 px:** the identifying column plus 2–3 values at 14–16 px text. Move other columns into a detail view or a "Columns" sheet, not off the screen edge.
- **Scroll region semantics:** `role="region"`, an accessible name (`aria-labelledby` the caption) and `tabindex="0"` so keyboard and switch users can scroll it; show a scroll affordance (a fade or shadow at the clipped edge) since mobile scrollbars are hidden (modern-web-guidance `ui-atoms/scrollability-affordance-hints.md`).
- **Sticky first column width:** 30–40% of the viewport at most (about 120–150 px at 390), with wrapping, so the scrolling columns get room.
- **Stacked rows:** keep the real table semantics if screen readers should still navigate by cells, or render a list with `<dl>` per record. Do not keep a `<table>` and override it with `display: block` on all parts without restoring roles: some browsers drop table semantics when `display` changes.
- **Sort and filter** move to a toolbar button that opens a bottom sheet; column-header sort targets are too small on phones.
- **Numbers:** right-aligned, `tabular-nums`, same precision per column; abbreviate large values (1.2M) with the full value in the detail.
- **Pagination:** 20–25 rows per page on phones, or load more, with the total count visible.

## Anti-patterns (don't)
- Shrinking the font to 10–11 px to fit eight columns.
- `overflow-x: hidden` on `body` to hide the table's overflow, which clips columns users cannot reach.
- Asking the user to rotate the phone to see the table.
- A scroll region without a visible cue that more columns exist.
- Stacked rows that repeat every column label for 12 fields, making each record a screen tall.

## Good references
- [NN/g: Mobile Tables: Comparisons and Other Data Tables](https://www.nngroup.com/articles/mobile-tables/): the task-based decision, locked headers and first column, and "rotating the phone is a last resort".
- [modern-web-guidance: Responsive table](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md): scroll region vs stacked rows with container queries.
- [Adrian Roselli: Tables, CSS Display Properties, and ARIA](https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html): which `display` changes drop table semantics and how to restore them.
- [GOV.UK Design System: Table](https://design-system.service.gov.uk/components/table/): numeric alignment and captions that hold up at narrow widths.

## Bad references
- Comparison pages that squeeze eight plans into a 390 px table with 9 px text; NN/g's study shows users then zoom and lose the row identity.
- Admin panels whose mobile view hides all but two columns with no route to the others, failing "never remove, disclose" (dashboard-ui `found-progressive-disclosure.md`).

## Accessibility
- WCAG 1.4.10 Reflow allows two-dimensional scrolling for data tables, but only inside their own scroll region, never the page.
- `<caption>` names the table; header cells use `<th scope>`.
- When stacked, each value keeps a visible label (not only `data-label` in a pseudo-element that some screen readers skip).

## Motion / interaction (if relevant)
- Native momentum scrolling only; no scroll-jacking. Optional `scroll-snap-type: x proximity` with `scroll-snap-align: start` on columns helps line up columns after a flick.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| visible columns at 360–390px | identity + 2–3 | comparison tables |
| sticky first column | max 40% of width (about 120–150px) | row identity |
| stack breakpoint | container < 37.5rem | stacked rows |
| rows per page | 20–25 | phones |
| table text | 14–16px | never below 13px |

## Implementation sketch
```css
.table-wrap {
  container: tbl / inline-size;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  background:
    linear-gradient(to right, var(--surface) 30%, transparent) left / 24px 100% no-repeat local,
    linear-gradient(to left, var(--surface) 30%, transparent) right / 24px 100% no-repeat local,
    linear-gradient(to right, var(--scrim), transparent) left / 8px 100% no-repeat scroll,
    linear-gradient(to left, var(--scrim), transparent) right / 8px 100% no-repeat scroll;
}
.table-wrap table { border-collapse: separate; border-spacing: 0; min-inline-size: 100%; font-variant-numeric: tabular-nums; }
.table-wrap thead th { position: sticky; inset-block-start: 0; background: var(--surface); z-index: 1; }
.table-wrap tbody th { position: sticky; inset-inline-start: 0; max-inline-size: 40cqi; background: var(--surface); text-align: start; }
.records { display: grid; gap: var(--space-3); }
.record dl { display: grid; grid-template-columns: auto 1fr; gap: var(--space-1) var(--space-3); margin: 0; }
.record dd { margin: 0; text-align: end; font-variant-numeric: tabular-nums; }
```
```html
<div class="table-wrap" role="region" aria-labelledby="plans-cap" tabindex="0">
  <table>
    <caption id="plans-cap">Plan comparison</caption>
    <thead><tr><th scope="col">Plan</th><th scope="col">Price</th><th scope="col">Seats</th></tr></thead>
    <tbody><tr><th scope="row">Team</th><td>$12</td><td>10</td></tr></tbody>
  </table>
</div>
```

## Checklist
- [ ] The table's task (compare across rows vs read one record) is decided and the matching layout is used.
- [ ] No page-level horizontal scroll at 320–390 px; tables scroll in a named, focusable region.
- [ ] The first column and header stay visible while scrolling.
- [ ] Only 2–4 columns are visible at 390 px; the rest are one tap away.
- [ ] Text in the table is 14 px or more.
- [ ] Stacked records keep visible labels and real semantics.

## Sources
- https://www.nngroup.com/articles/mobile-tables/
- https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html
- https://design-system.service.gov.uk/components/table/
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/scrollability-affordance-hints.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/found-responsive-reflow.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/data-table-layout-and-typography.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/data-table-interaction.md
