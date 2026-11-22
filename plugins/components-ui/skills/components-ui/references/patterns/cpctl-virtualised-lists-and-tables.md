# Virtualised lists and tables

> Measure before virtualising: paginate or use `content-visibility: auto` for hundreds of rows, and virtualise only when thousands of rows cost real frames or memory. When you do, keep the scroll position, row semantics (`aria-rowcount`, `aria-rowindex`), keyboard navigation and find-in-page behaviour intact, or give an alternative.

**Category:** Controls · **Applies to:** logs, data tables, activity feeds, large selects, file trees · **Priority:** should

## When to use / when not
- Use when a list or grid is large enough that rendering all of it measurably hurts input latency or memory.
- Not for ordinary lists: virtualisation breaks find-in-page, anchors, print, and simple semantics, so it is a cost.
- Table design and density: `data-` patterns in dashboard-ui; numeric alignment is in the `data-display` skill.

## Rules (do)
**Decide with numbers**
| Rows | Start with |
|---|---|
| < ~200 | Render all |
| ~200–1,000 | Paginate, or `content-visibility: auto` with `contain-intrinsic-size` |
| > ~1,000, or heavy rows, or measured long frames | Virtualise |
Profile first: a list that scrolls at 60 fps does not need it. Treat the thresholds as starting points and confirm with the performance panel and INP (`mperf-compositor-will-change-and-inp.md`).

**If you virtualise**
- Use a maintained library (Virtuoso, TanStack Virtual, or a grid with built-in virtualisation) rather than writing windowing yourself.
- **Semantics:** on a table or grid set `aria-rowcount` to the total (`-1` if unknown) and `aria-rowindex` on each rendered row; for lists use `aria-setsize` and `aria-posinset` ([WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#aria-setsize)).
- **Stable row height** or measured heights with a good estimate; reserve space to avoid layout jumps. Overscan 5–10 rows to hide blank flashes.
- **Keep focus:** a focused row that scrolls out must not be unmounted silently; keep it mounted or restore focus on return. Page Up, Page Down, Home and End move by page and to the ends.
- **Find and jump:** offer in-app search and "jump to row" since browser find cannot see unrendered rows; deep links scroll to the item.
- **Preserve scroll** across data refresh and back navigation; keep sticky headers truly sticky.
- **Selection** and bulk actions refer to ids, not row indexes, and say "all 12,431 rows" explicitly if the selection spans unrendered rows.
- **Loading more:** infinite scroll needs a visible footer, an end-of-list message, and a way to reach controls below the list; prefer "Load more" or pages for goal-oriented tasks.

## Anti-patterns (don't)
- Virtualising 80 rows "for performance".
- Rows with variable height and no measurement, so the scrollbar jumps.
- Browser Ctrl+F silently missing most rows with no alternative.
- Infinite scroll that pushes the footer out of reach.
- Selecting "all" by index, so rows loaded later are missed.

## Good references
- [web.dev, `content-visibility`](https://web.dev/articles/content-visibility) — skips rendering off-screen content with far less machinery.
- [WAI-ARIA APG, Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) — `aria-rowcount`, `aria-rowindex` and keyboard model.
- [TanStack Virtual](https://tanstack.com/virtual/latest) — headless windowing with measurement and scroll restoration.

## Bad references
- A 500-row table virtualised by hand with fixed `top` offsets — breaks zoom, text spacing and screen reader row counts.

## Accessibility
- Screen readers learn total size from `aria-rowcount`; without it a 10,000-row table reads as 30 rows.
- Reflow and text-spacing overrides change row height: measure instead of hard-coding (`a11y-resize-reflow-text-spacing.md`).
- Infinite scroll must not trap keyboard users before the footer (WCAG 2.4.3, 2.1.2).

## Motion / interaction (if relevant)
- No animation on rows entering the window; it is scroll, not an event. Smooth-scroll to a jump target only when reduced motion is off.

## Tokens and values
House defaults, not standards: confirm with a profile.

| Token | Value | Use |
|---|---|---|
| Overscan | 5–10 rows | Hide blank flashes |
| Row height | 32 / 40 / 48 px density steps | Stable estimate |
| `contain-intrinsic-size` | `auto 40px` | `content-visibility` rows |
| Page jump | visible rows − 1 | Page Up and Down |

## Implementation sketch
```css
.row {
  content-visibility: auto;
  contain-intrinsic-size: auto 40px;
}
```
```ts
// Window a fixed-height list: which rows to mount for a scroll offset.
export function visibleRange(
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  total: number,
  overscan = 8,
): { start: number; end: number } {
  const first = Math.floor(scrollTop / rowHeight)
  const last = Math.ceil((scrollTop + viewportHeight) / rowHeight)
  return { start: Math.max(0, first - overscan), end: Math.min(total, last + overscan) }
}

export function rowAria(index: number, total: number): { 'aria-rowindex': number; 'aria-rowcount': number } {
  return { 'aria-rowindex': index + 2, 'aria-rowcount': total + 1 } // +1 header row
}
```

## Checklist
- [ ] A measurement justifies virtualising; cheaper options were tried first.
- [ ] `aria-rowcount` and `aria-rowindex` (or setsize and posinset) are set.
- [ ] Focus survives scrolling; Page, Home and End keys work.
- [ ] In-app search or jump replaces browser find; deep links work.
- [ ] Scroll position is preserved on refresh and back.
- [ ] Select-all uses ids and states the real count.

## Sources
- https://web.dev/articles/content-visibility
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/
- https://www.w3.org/TR/wai-aria-1.2/#aria-setsize
- https://tanstack.com/virtual/latest
- https://virtuoso.dev/
- Source corpus: https://github.com/emilkowalski/skills `pick-ui-library` (Virtuoso pick, "1,000+ row" mismatch); thresholds are this repo's measured-first heuristics
