# Lists and cards on small screens

> On phones, default to full-width list rows (44–56 px or more, one tap target per row, leading visual, label, one meta line, one trailing value) and use cards only for heterogeneous or visual items; never squeeze a desktop card grid into a single column of tiny cards.

**Category:** Foundations · **Applies to:** inboxes, feeds, settings, search results, product listings, transaction lists, contact lists · **Priority:** must

## When to use / when not
- **List rows** for homogeneous items users scan and open: messages, transactions, settings, files, contacts.
- **Cards** for items that differ in shape or carry media: feed posts, products with photos, a few summary tiles.
- **Horizontal carousels** only for a secondary row of related items (modern-web-guidance `user-experience/content-first-noise-reduction.md`), never for the primary list.
- For the desktop decision (table vs list vs cards), see dashboard-ui `data-cards-vs-tables-vs-lists.md`; this file covers the compact-width version.

## Rules (do)
- **Row anatomy:** leading (avatar 40 px or icon 24 px) · title (one line, `--mo-type-headline` or body) · supporting line (one line, muted) · trailing (value, time, chevron or switch). Matches iOS list cells and M3 list items.
- **Row heights:** at least 44 px (iOS minimum); M3 list items are 56 dp (one line), 72 dp (two lines) and 88 dp (three lines). Let rows grow with text size.
- **One primary target per row.** The whole row opens the item. A second action (switch, checkbox, overflow) sits at the trailing edge with its own 44–48 px target and 8 px from the row's edge; do not nest more.
- **Insets and separators:** 16 px page margin; separators inset to the text start (not under the avatar), 1 px `--border`. Or use grouped sections ("inset grouped" on iOS) with 8–12 px radius containers for settings.
- **Section headers** sticky at the top of their section (`position: sticky`) for long, grouped lists (by date, by letter).
- **Long lists:** paginate or load more on scroll with a visible "Load more" fallback button and a count; keep the scroll position when returning from a detail (bfcache, or restore with `history.scrollRestoration`). Use `content-visibility: auto` with `contain-intrinsic-size` on off-screen rows to cut rendering cost (`moplat-low-end-performance.md`).
- **Cards on compact:** full-bleed or 16 px-inset, one per row, 12–16 px apart; image with `aspect-ratio` and `width`/`height` attributes; whole card is one link; secondary actions are buttons outside the link.
- **Two-column grids** only for visual items (products, photos) at 360 px and up, each tile 160 px wide or more.
- **Swipe actions** on rows are shortcuts, never the only route (`monav-gestures-swipe-refresh-back.md`).
- **Empty, loading and error states** at list level: skeleton rows matching the real row height; empty state with one action.
- **Cards only where they group or act.** Avoid card-in-card; at 360 px each nested card spends padding twice, so prefer headers, dividers and spacing. Mobile empty states differ by cause (the first, collection and no-results cases are in NN/g; offline, permission and deleted are this repo's additions): first run, empty collection, no search results (quote the query and offer to clear it), filtered, permission, offline with stale data still shown, and deleted with Undo.

## Anti-patterns (don't)
- Each row a separate bordered card with shadow: 12 px gaps and borders cost one row in five of screen height.
- Rows with three or four tappable regions (avatar opens profile, title opens item, icon likes, chevron opens menu).
- Truncating the title to one line with ellipsis while leaving the supporting line full.
- Hover-revealed row actions with no touch equivalent (modern-web-guidance `user-experience/natural-interactions.md`: visible by default under `hover: none`).
- Infinite scroll with a footer the user can never reach, and no way back to the same position.

## Good references
- [Apple HIG: Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables): plain, grouped and inset-grouped styles, row accessories and swipe actions.
- [Material 3: Lists](https://m3.material.io/components/lists/specs): one, two and three-line items at 56, 72 and 88 dp, leading and trailing elements.
- [NN/g: Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/): cards suit heterogeneous, browsable content and are a poor fit for homogeneous lists users scan.
- [modern-web-guidance: Card](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/card.md): one link per card with a stretched hit area and separate secondary buttons.
- iOS Mail and Settings: rows, inset separators, chevrons and trailing values done consistently.

## Bad references
- [NN/g: Infinite Scrolling Is Not for Every Website](https://www.nngroup.com/articles/infinite-scrolling/): loss of position and unreachable footers when infinite scroll is used for goal-oriented lists.
- Desktop dashboards collapsed to one column of 8 KPI cards on phones, each with its own shadow and border, pushing the first list item four screens down.

## Accessibility
- Use real list semantics (`<ul>`/`<li>`) and one link or button per row; the row's accessible name is its title, with the meta line in `aria-describedby` only if needed.
- Trailing switches have their own label (`aria-labelledby` the row title).
- Swipe actions are also available via a visible menu or a long-press menu and via assistive technology (WCAG 2.5.1, 2.5.7).

## Motion / interaction (if relevant)
- Pressed state on the whole row within 100 ms; on release, navigate. Do not animate row height on load.
- Removing a row animates its collapse in 200–250 ms (under reduced motion, remove without the collapse) and offers Undo.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| row min height | 44px (iOS) · 56 / 72 / 88px (M3 one, two, three lines) | list rows |
| leading avatar | 40px | people and entities |
| leading icon | 24px in a 40px slot | settings, files |
| separator inset | page margin + leading slot + 12px | rows with a leading visual |
| card gap | 12–16px | stacked cards |
| grid tile min | 160px | two-column product or photo grid |

## Implementation sketch
```css
.list { list-style: none; margin: 0; padding: 0; }
.list > li { content-visibility: auto; contain-intrinsic-size: auto 64px; }
.row {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  column-gap: var(--space-3);
  min-block-size: 56px;
  padding: var(--space-2) var(--page-margin);
  color: inherit;
  text-decoration: none;
}
.row:active { background: var(--surface-3); }
.row + .row, li + li > .row { border-block-start: 1px solid var(--border); }
.row-title { font: var(--mo-type-headline); }
.row-meta { font: var(--mo-type-callout); color: var(--text-muted); }
.row-trail { font-variant-numeric: tabular-nums; text-align: end; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3); padding-inline: var(--page-margin); }
```
```html
<ul class="list">
  <li><a class="row" href="/tx/481">
    <img src="/m/coffee.png" alt="" width="40" height="40">
    <span><span class="row-title">Blue Bottle Coffee</span><br><span class="row-meta">Today, 08:14 · Card 4021</span></span>
    <span class="row-trail">−$6.50</span>
  </a></li>
</ul>
```

## Checklist
- [ ] Homogeneous items use list rows, not one card per item.
- [ ] Every row is at least 44 px tall and grows with text size.
- [ ] Each row has one primary target plus at most one trailing control with its own target.
- [ ] Row actions revealed by swipe or hover are also reachable by a visible control.
- [ ] Returning from a detail restores the list position.
- [ ] Long lists use pagination or load-more with a reachable footer and `content-visibility` for off-screen rows.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
- https://m3.material.io/components/lists/specs
- https://www.nngroup.com/articles/cards-component/
- https://www.nngroup.com/articles/infinite-scrolling/
- https://web.dev/articles/content-visibility
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/card.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/natural-interactions.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/data-cards-vs-tables-vs-lists.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/data-list-rows.md
- https://www.nngroup.com/articles/empty-state-interface-design/
