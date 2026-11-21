# List rows (resource lists, watchlists, activity rows)

> A list row lets someone find one item and open it. It holds a leading visual, a primary label, at most one line of secondary metadata, and one trailing value or status, in fixed positions, and the whole row is one link.

**Category:** Data display · **Applies to:** resource lists, watchlists, recent activity, notifications, sidebar collections, mobile versions of tables · **Priority:** should

## When to use / when not
- **Use** when the task is "find this one and open it": projects, accounts, tickers in a watchlist, recent transactions on mobile, alerts. Polaris: "Use a resource list to help merchants find individual objects", and a data table "to visualize or analyze highly structured data for comparison."
- **Don't** use a list when users sort or compare by more than one attribute. Use a table (`data-cards-vs-tables-vs-lists.md`).
- **Don't** use a list as a styled table. If a row needs 4 or more attributes aligned in columns, it *is* a table, so give it `<table>` semantics.

## Rules (do)
- **Anatomy (left to right, in logical order):**
  1. **Leading** (optional): avatar, logo, icon or checkbox. Fixed size: 24px icon, 32–40px avatar or logo.
  2. **Primary:** the human-readable name, weight 500, one line, truncated with an ellipsis.
  3. **Secondary** (optional): 1 line of muted metadata. At most 2–3 facts joined with ` · `, such as "NYSE · Technology · Updated 2h ago".
  4. **Trailing value:** one right-aligned number (price, balance, count) in `tabular-nums`, optionally with a delta beneath it (stacked, also right-aligned). The Tremor and Robinhood pattern is ticker | sparkline | price over a delta badge.
  5. **Trailing affordance:** status badge, chevron (`›`) for navigation, or 1 overflow menu.
- **Fixed positions.** Every row puts the same field in the same place. NN/g: fixed positions are what make lists scannable for an attribute.
- **Row heights** (comparable to Carbon's table scale and Material list densities):
  - one-line: 40px compact, 48px default;
  - two-line: 56–64px;
  - three-line: 72–88px, and only if the third line is essential.
  Touch targets are at least 44px, at least 24px per WCAG 2.5.8.
- **The whole row is one link** to the detail view. Use a stretched link on the primary label (`ui-components/card.md` "Clickable cards with independent actions"). Secondary controls (star, overflow) sit above the overlay with `position: relative; z-index: 1`.
- **Actions:**
  - At most 1 persistent trailing action (star, toggle, overflow).
  - Hover-revealed shortcut actions are allowed only if the same action exists elsewhere (Polaris: they "don't show on small screens, so the same action must also be reachable elsewhere").
  - On touch, use swipe actions only as an accelerator, never the sole path (`ui-behaviors/swipe-to-reveal.md`).
- **Separators:** 1px hairlines inset to align with the primary text start (skip the leading visual), or none with 4–8px gaps. Not both.
- **Grouping:** group rows by date ("Today", "Yesterday", "Nov 18") or by category with sticky section headers (`ui-atoms/state-aware-sticky-headers.md`), not by inserting cards.
- **Count and sort:** show "248 accounts" and the current sort ("Sorted by: Last activity") above the list (Polaris shows a total count and a sort select).
- **Long lists:** paginate or "Load more" (NN/g). For more than about 300 rows, use `content-visibility: auto` on row groups.
- **Unread or new state:** a bold primary label plus a dot with accessible text ("Unread"), not colour alone.

## Anti-patterns (don't)
- Rows with 6 or more facts scattered across two lines. Nothing can be scanned, so use a table.
- A different layout per row (some with avatars, some without, values jumping position). If the leading visual is optional, reserve its space or drop it for all rows.
- Whole row as a `<div onclick>`. It isn't keyboard reachable, has no link semantics, and you can't middle-click to open in a new tab.
- Hover-only actions with no other path.
- A chevron on rows that don't navigate.
- Centred trailing numbers, or numbers in proportional figures.
- Coloured row backgrounds for status. Use a badge.

## Good references
- [Polaris ResourceList (v4 docs)](https://app.unpkg.com/@shopify/polaris@4.6.1/files/docs/components/ResourceList/README.md) — clear purpose split (find-and-act vs analyse), every item clickable to detail, hover shortcut actions must exist elsewhere, persistent actions "rarely" and collapsing into overflow on small screens, "View details for …" accessibility labels.
- [NN/g, "Cards: UI-Component Definition"](https://www.nngroup.com/articles/cards-component/) — lists beat cards for homogeneous items, search, comparison and attribute scanning, thanks to fixed positions.
- [Tremor spark chart KPI example](https://www.tremor.so/docs/visualizations/spark-charts) — the watchlist row: ticker plus name | spark area | price plus delta badge, a compact three-zone row.
- [Material Web list](https://github.com/material-components/material-web/blob/main/docs/components/list.md) — slot model `start` / `headline` / `supporting-text` / `trailing-supporting-text` / `end`, a clean anatomy to mirror. Avatar is 40px.

## Bad references
- Notification and activity feeds that use infinite scroll with no date grouping. Users can't refind an item ([NN/g infinite scroll](https://www.nngroup.com/articles/infinite-scrolling-tips/)).
- Mobile "tables" that become lists by dumping every column into stacked rows with no hierarchy. The primary label gets lost among 8 equal-weight lines.

## Accessibility
- Markup: `<ul role="list">` (Safari drops list semantics when `list-style: none`, so add the role explicitly) containing `<li>`. Inside, the primary label is an `<a>`.
- The link's accessible name is the primary label only. Secondary metadata is regular text, not stuffed into `aria-label`.
- Trailing controls have specific names ("Remove AAPL from watchlist").
- Focus ring on the row (via `:has(a:focus-visible)`), at least 2px, with at least 3:1 contrast.
- The trailing delta follows `data-delta-trend-indicators.md` (sign in text, SR sentence).

## Motion / interaction (if relevant)
- Hover background tint, 0–100ms.
- Live-updating values (prices) change in place with `tabular-nums`. An optional 600ms background flash on change is off under reduced motion.
- Removing a row collapses its height over 150–200ms (`ui-behaviors/animate-element-entry-exit.md`) and moves focus to the next row.

## Tokens and values
| Token | Default |
|---|---|
| Row height, 1-line | 40px compact / 48px default |
| Row height, 2-line | 56–64px |
| Row padding inline | 12–16px |
| Leading visual | icon 20–24px, avatar or logo 32–40px, gap 12px |
| Primary text | 0.875–1rem, weight 500 |
| Secondary text | 0.75–0.8125rem, `--text-muted`, separator ` · ` |
| Trailing value | 0.875–1rem, weight 500, `tabular-nums`, end-aligned |
| Separator | 1px `--border-subtle`, inset to text start |
| Section header | 0.75rem, weight 600, sticky, `--surface-1` background |

## Implementation sketch
```html
<p class="list-meta">248 accounts · Sorted by last activity</p>
<ul role="list" class="rows">
  <li class="row">
    <img src="/logos/acme.svg" alt="" width="32" height="32">
    <div class="row-main">
      <a href="/accounts/acme" class="row-link">Acme Logistics</a>
      <p class="row-sub">Enterprise · 42 seats · Active 2h ago</p>
    </div>
    <div class="row-value">
      <data value="12500">$12.5K</data>
      <span class="delta" data-tone="positive"><span aria-hidden="true">+4.1%</span><span class="sr-only">up 4.1% versus last month</span></span>
    </div>
    <button type="button" class="row-more" aria-label="More actions for Acme Logistics">⋯</button>
  </li>
</ul>
```
```css
.rows { list-style: none; margin: 0; padding: 0; }
.row {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 12px;
  min-block-size: 56px;
  padding: 8px 16px;
}
.row + .row::before { content: ""; position: absolute; inset-block-start: 0; inset-inline: 60px 0; border-block-start: 1px solid var(--border-subtle); }
.row-main { min-inline-size: 0; }
.row-link { font-weight: 500; color: inherit; text-decoration: none; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-link::after { content: ""; position: absolute; inset: 0; } /* stretched link */
.row-sub { margin: 0; font-size: .8125rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-value { display: grid; justify-items: end; font-variant-numeric: tabular-nums; font-weight: 500; }
.row-more { position: relative; z-index: 1; min-inline-size: 32px; min-block-size: 32px; }
.row:hover { background: var(--surface-hover); }
.row:has(.row-link:focus-visible) { outline: 2px solid var(--focus); outline-offset: -2px; }
.row-link:focus-visible { outline: none; }
```

## Checklist
- [ ] The list is for find-and-open. Comparison tasks use a table instead.
- [ ] Fixed slots: leading, primary, at most 1 secondary line, trailing value, at most 1 trailing control.
- [ ] Trailing numbers are end-aligned and use `tabular-nums`.
- [ ] The whole row is one real link (stretched), and secondary controls sit above the overlay.
- [ ] No hover-only actions without an alternate path.
- [ ] Count and sort are shown, and long lists are paginated or grouped.
- [ ] `role="list"` is set, and the focus ring draws on the row.

## Sources
- https://app.unpkg.com/@shopify/polaris@4.6.1/files/docs/components/ResourceList/README.md
- https://www.nngroup.com/articles/cards-component/
- https://www.nngroup.com/articles/infinite-scrolling-tips/
- https://www.tremor.so/docs/visualizations/spark-charts
- https://github.com/material-components/material-web/blob/main/docs/components/list.md
- https://carbondesignsystem.com/components/data-table/usage/
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-components/card.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/state-aware-sticky-headers.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/swipe-to-reveal.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/animate-element-entry-exit.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/performance/defer-rendering-heavy-content.md
