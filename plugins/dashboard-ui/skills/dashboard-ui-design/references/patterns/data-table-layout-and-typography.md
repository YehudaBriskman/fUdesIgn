# Data table layout and typography

> Left-align text, right-align numbers *and their headers*, use tabular figures with consistent decimals, separate rows with thin horizontal rules (not grids, not heavy zebra), and pick one row density from a fixed scale.

**Category:** Data display · **Applies to:** data tables, financial statements, comparison tables, transaction lists rendered as tables · **Priority:** must

## When to use / when not
- Use a table when the reader compares values *across rows* on the same attributes, or looks up a cell by row and column. See `data-cards-vs-tables-vs-lists.md`.
- Don't use `<table>` for layout. GOV.UK: "Never use the table component to layout content on a page."
- Behaviour (sticky, sort, selection, pagination) is covered in `data-table-interaction.md`. This file covers the static design.

## Rules (do)
- **Alignment (Ström's "3½ rules", Polaris, GOV.UK, data.europa.eu):**
  1. Numbers right-aligned (`text-align: end`).
  2. Text left-aligned (`start`). Never centre, since centring makes both edges ragged.
  3. The header aligns with its column's data, so numeric headers are right-aligned too (GOV.UK `govuk-table__header--numeric`).
  4. Exceptions: short fixed-width codes, status badges, icons and checkboxes may be centred or start-aligned, but be consistent per column.
  5. Dates in a fixed format (ISO `2026-11-21` or `21 Nov 2026`) can be start-aligned. Durations and amounts are numbers.
- **Numerals:** `font-variant-numeric: tabular-nums lining-nums` on the whole table (A List Apart, Ström). Same decimals per column. Use decimal alignment (`text-align: "." center`) only if precision must vary, which is rare. Better to fix the precision.
- **Units in the header, not in every cell.** "Revenue (USD)", "Latency (ms)", "Margin (%)". If the currency varies per row, show the code in the cell (`USD 1,234.00`), and never mix currencies in one column total. Ström shows the unit once, with the first data point, which is an acceptable alternative for print-like tables.
- **Column order:** the identifier first (a human-readable name, not a UUID; NN/g: "should be a human-readable record identifier"), then the most important attributes, with related columns adjacent. Put the main numeric column first or second (data.europa.eu).
- **Row separators:** 1px horizontal rules in a subtle border colour (about 1.2–1.5:1 against the surface). No vertical rules. If alignment is right, "rules are largely redundant" (Ström). No outer frame (A List Apart).
- **Zebra striping:** optional, and only for wide tables (8 or more columns) or ones without row hover. If used, keep the stripe very light (about 2–4% luminance delta). The evidence is mixed: NN/g lists zebra among aids to tracking rows, Carbon offers it as an optional modifier, and Ström and A List Apart advise against it. Pick rules *or* stripes, not both.
- **Row hover** is always on for interactive tables (Carbon: "The data table's row hover state should always be enabled"). Use a background tint, never a border-width change.
- **Density scale**, from Carbon. Row height equals header height:

  | Density | Row height | Use |
  |---|---|---|
  | xs | 24px | log viewers, power-user grids |
  | sm (compact) | 32px | finance or ops tables, 20 or more rows visible |
  | md (default) | 40px | general admin tables |
  | lg | 48px | touch, tables with avatars or two-line cells |
  | xl | 64px | only when cells hold 2 lines |

  The toolbar and pagination bar match the row height. Offer a density toggle when users stay in the table all day.
- **Cell padding:** 8–12px inline, 16px on the first and last cells. Vertical padding is derived from the row height.
- **Width:** size columns to content (`table-layout: auto`) for read-only tables. Use `table-layout: fixed` with explicit widths when truncating or virtualising, because auto layout grows cells instead of truncating (`ui-atoms/single-line-overflow.md`). Don't stretch a 3-column table to 1600px. A List Apart: "Don't stretch tables to full width."
- **Truncation:** one line per cell, ellipsis at the end. For IDs and file names, keep the end visible (`…-v2.pdf`). The full text stays in the DOM, with a tooltip on hover *and* focus. Headers wrap to at most 2 lines, then truncate (Carbon).
- **Totals and summary rows:** in `<tfoot>`, weight 600, with a 2px top rule (or a background tint, which is Ström's "backgrounds mark different data types"). Polaris supports totals in header or footer, so pick one per product.
- **Inline sparklines in a column:** fixed 80–120×20px, no axes, a shared Y scale across rows *if* the reader compares rows (say so in the header: "Trend (30d, shared scale)"), otherwise per-row scale. Put them after the numeric value they explain.
- **Empty cells:** see `data-loading-empty-error-states.md`. Never a bare `-` in a numeric column, where it reads as minus.
- **Status columns:** text plus icon badge, never colour alone. See `color-semantic-status.md`.

## Anti-patterns (don't)
- Centred numbers or centred headers over right-aligned numbers.
- Proportional figures in numeric columns, which leaves digits misaligned so `1,111` and `8,888` differ in width.
- A full grid of vertical and horizontal borders (spreadsheet look). It doubles the ink with no information gain.
- Zebra plus rules plus hover plus selected-row tint all in one table. That's four competing fills.
- Repeating `$` and `ms` in every cell while the header has no unit.
- Mixed precision in a column (`12.5`, `12.50`, `13`).
- Status by red or green text only.
- Truncating numbers. Never ellipsize a numeric value. Use compact notation or widen the column.
- UUIDs as the first column.

## Good references
- [Matthew Ström, "Design better data tables"](https://mattstromawn.com/writing/tables) — alignment rules, tabular lining figures, minimal light horizontal rules, and annotation symbols (✻ † ▵) instead of colour.
- [A List Apart, "Web Typography: Designing Tables to be Read, Not Looked At"](https://alistapart.com/article/web-typography-tables/) — CSS for `lining-nums tabular-nums`, no outer borders, content-sized columns, `caption-side`.
- [IBM Carbon data table usage](https://carbondesignsystem.com/components/data-table/usage/) — the explicit 24/32/40/48/64px row scale, header matching row size, and the 2-line-then-truncate header rule.
- [GOV.UK Design System: Table](https://design-system.service.gov.uk/components/table/) — the numeric cell and header modifier classes, `<caption>` as heading, `scope` attributes.
- [data.europa.eu: Table design for scannability](https://data.europa.eu/apps/data-visualisation-guide/table-design-scannability) — consistent rounding per column, no wrapping, grouping by extra spacing.
- [Primer DataTable guidelines](https://primer-docs-preview.github.com/product/components/data-table/guidelines) — "Right-align numeric values and use the `tabular-num` font variant", and column width modes (grow, grow-or-collapse, auto, explicit) with a warning that `auto` causes layout shift.

## Bad references
- Spreadsheet-export tables (the default Excel-to-HTML look): every cell boxed, centred headers and proportional figures. They are the "awful" tables Ström opens with.
- [Polaris DataTable summary-row alignment bug (PR #7693)](https://github.com/Shopify/polaris-react/pull/7693) — a text label in a numeric column's summary row inherited right alignment. Totals labels need explicit handling.
- Default shadcn/TanStack table demos that left-align every column, including amounts. Alignment is opt-in per column there, and teams forget it.

## Accessibility
- Use a real `<table>` with `<caption>` (it can be visually hidden), `<th scope="col">` and `<th scope="row">` on the identifier cell.
- Don't use `display: block`/`flex` on `table`, `tr` or `td` unless you restore roles, since it strips table semantics in some engines.
- Contrast: body text at least 4.5:1. Separators are decorative and exempt, but header text must still meet 4.5:1.
- The truncated full text is reachable by keyboard (focusable cell or a disclosure), not by hover only.
- Text spacing (WCAG 1.4.12): no fixed row `height` on text rows; use `min-block-size`.

## Motion / interaction (if relevant)
- Hover tint transitions in 0–100ms, or none. Don't animate row height on density change; snap it.

## Tokens and values
| Token | Default |
|---|---|
| `--row-h-xs/sm/md/lg/xl` | 24 / 32 / 40 / 48 / 64px |
| Cell padding inline | 12px (16px on first and last) |
| Body font | 0.875rem (14px) / 1.4; xs density 0.75rem |
| Header font | 0.75–0.8125rem, weight 600, `--text-muted`, sentence case |
| Row rule | 1px `--border-subtle` |
| Zebra tint | `--surface-2` at about 2–4% luminance delta (optional) |
| Hover tint | `--surface-hover` |
| Totals row | weight 600, 2px top rule `--border-strong` |
| Inline sparkline | 96×20px, 1.25px stroke |
| Numerals | `tabular-nums lining-nums` |

## Implementation sketch
```html
<table class="dt" data-density="sm">
  <caption class="sr-only">Invoices, November 2026</caption>
  <thead>
    <tr>
      <th scope="col">Customer</th>
      <th scope="col">Status</th>
      <th scope="col" class="num">Amount (USD)</th>
      <th scope="col" class="num">Margin (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><span class="trunc">Acme Logistics International Ltd</span></th>
      <td><span class="badge" data-status="overdue">Overdue</span></td>
      <td class="num"><data value="12500">12,500.00</data></td>
      <td class="num"><data value="-0.032">−3.2</data></td>
    </tr>
  </tbody>
  <tfoot>
    <tr><th scope="row" colspan="2">Total</th><td class="num">12,500.00</td><td class="num"></td></tr>
  </tfoot>
</table>
```
```css
.dt {
  --row-h: 40px;
  border-collapse: separate; border-spacing: 0;
  font-size: .875rem;
  font-variant-numeric: tabular-nums lining-nums;
}
.dt[data-density="sm"] { --row-h: 32px; }
.dt[data-density="lg"] { --row-h: 48px; }
.dt :is(th, td) {
  block-size: var(--row-h);           /* acts as min-height on table cells */
  padding: 0 12px;
  text-align: start;
  border-block-end: 1px solid var(--border-subtle);
  white-space: nowrap;
}
.dt :is(th, td):first-child { padding-inline-start: 16px; }
.dt :is(th, td):last-child  { padding-inline-end: 16px; }
.dt thead th { font-weight: 600; font-size: .8125rem; color: var(--text-muted); text-wrap: balance; }
.dt tbody th { font-weight: 500; }
.dt .num { text-align: end; }
.dt tbody tr:hover { background: var(--surface-hover); }
.dt tfoot :is(th, td) { font-weight: 600; border-block-start: 2px solid var(--border-strong); border-block-end: 0; }
.dt .trunc { display: block; max-inline-size: 24ch; overflow: hidden; text-overflow: ellipsis; }
```

## Checklist
- [ ] Numeric cells and their headers are right-aligned. Nothing is centred except icon or checkbox columns.
- [ ] `tabular-nums` is on, and decimals are consistent per column.
- [ ] Units live in headers, and no column mixes currencies.
- [ ] Only horizontal hairlines, or very light zebra, not both. No outer frame.
- [ ] Row height comes from the density scale, and the header matches it.
- [ ] The first column is a human-readable identifier and is a `<th scope="row">`.
- [ ] Truncated text keeps the full value in the DOM plus a hover and focus reveal. Numbers are never truncated.
- [ ] The totals row is visually distinct and aligned with its columns.

## Sources
- https://mattstromawn.com/writing/tables
- https://alistapart.com/article/web-typography-tables/
- https://carbondesignsystem.com/components/data-table/usage/
- https://design-system.service.gov.uk/components/table/
- https://data.europa.eu/apps/data-visualisation-guide/table-design-scannability
- https://primer-docs-preview.github.com/product/components/data-table/guidelines
- https://www.nngroup.com/articles/data-tables/
- https://app.unpkg.com/@shopify/polaris@2.7.0/files/docs/components/DataTable/README.md
- https://github.com/Shopify/polaris-react/pull/7693
- https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/visual-design/typography.md
