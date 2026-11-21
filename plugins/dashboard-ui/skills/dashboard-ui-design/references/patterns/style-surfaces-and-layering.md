# Surfaces, cards and layering

> Define 4–5 named surface levels (canvas, surface, raised, overlay, plus optional sunken) and place every element on exactly one of them. Use cards only to group a self-contained unit, never as default wrapping for everything.

**Category:** Color and visual style · **Applies to:** page canvas, dashboard grid, KPI tiles, chart cards, side panels, drawers, popovers, dialogs, table containers · **Priority:** must

## When to use / when not
- **Card:** one self-contained unit with its own title: a chart, a KPI group, a list. modern-web-guidance `card.md`: a card "groups one related piece of content or one choice".
- **No card:** a single number with no siblings, toolbar controls, filters, or a full-width table that already *is* the page. A table inside a card inside a section inside a card is "card-ception".
- **Sunken surface:** a backdrop that groups columns or a canvas area (Kanban column, code well). Atlassian: "Only use sunken surfaces on the default surface level."
- **Overlay surface:** anything in the top layer (popover, menu, dialog, toast). These can stack.

## Rules (do)
- **Named levels, fixed meaning:**
  1. `canvas`: the app background behind everything;
  2. `surface`: cards and panels in the layout flow;
  3. `surface-2`: raised/hover/selected rows, nested wells inside a card;
  4. `surface-3` / overlay: menus, popovers, dialogs;
  5. optional `sunken`: grouped backdrop, darker in both themes (Atlassian).
  Material 3 has the same idea as `surfaceContainerLowest → Highest`, five tonal steps.
- **Light theme: canvas slightly darker than cards** (e.g. #f9fafc canvas, #fff cards). That is the "soft" look: cards lift by tone, not shadow. Linear, Stripe and Vercel dashboards use a near-white canvas with white cards and hairline borders (observed in their products, not documented).
- **Dark theme: higher level = lighter** (see `color-dark-mode.md`).
- **Adjacent levels differ by only 1.04–1.14:1** in the default tokens (light canvas→surface 1.04, surface-2→surface-3 1.13; dark 1.07–1.14). That is too little for tone alone, so add a hairline `--border` where levels meet.
- **One nesting level of containers inside a card.** Inside a card, use spacing and `surface-2` wells, not another bordered card. If you need a second card level, the card is too big. Split it.
- **Grid of cards: equal radius, equal padding, aligned internal rows.** Use `subgrid` so titles, values and footers line up across cards (modern-web-guidance `card.md`).
- **Card anatomy order:** media/chart, header (title + optional action), content, footer. Keep source order meaningful, use `<article>`, and keep the heading link as the primary destination if the card links.
- **Container queries, not viewport media queries, for card internals.** `container-type: inline-size` on the card. A KPI card at 240 px stacks, and at 480 px it goes side by side.
- **Padding scale tied to card size:** 12 px compact / 16 px default / 24 px spacious. Density can be a reactive token with container style queries (modern-web-guidance `design-token-reactivity.md`), with a `data-density` fallback.
- **Gutters ≥ card padding.** Grid gap 16 px, 24 px at 1312 px or wider (SKILL.md grid defaults). If gap < padding, cards visually merge.
- **Overlays live in the top layer** (`popover`, `<dialog>`). No z-index ladders, no clipping by card `overflow`.

## Anti-patterns (don't)
- Card around every element: KPI → card, chart → card, card around the cards. Each wrapper adds a border, padding and a radius and costs ~32 px of width per level.
- Different background tints per card to "add colour". Tint then implies category or status (see `color-minimal-usage.md`).
- White cards on a white canvas with no border or shadow. They have no boundary at all.
- Heavy shadows on in-flow cards *and* a contrasting canvas *and* borders (see `style-shadows-and-borders.md`).
- z-index: 9999 popovers inside an `overflow: hidden` card.
- Sticky card headers inside a scrolling page that also has a sticky page header: stacked sticky bars beyond the 12% viewport budget (modern-web-guidance `content-first-noise-reduction.md`).

## Good references
- [Atlassian – Elevation](https://atlassian.design/foundations/elevation) — sunken/default/raised/overlay with strict surface/shadow pairing, and borders or whitespace instead of raised elevation for grouping.
- [Material 3 surface containers](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts) — five tonal container roles replacing opacity overlays, with exact tones for light (100/96/94/92/90) and dark (4/10/12/17/22).
- [Vercel Geist – Colors](https://vercel.com/geist/colors) — only two background tokens (Background 1 default; Background 2 "should be used sparingly"), which forces discipline about layering.
- [Radix Colors scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — step 1 "App background", step 2 "Subtle background"; steps 3–5 are UI element background, hover and active.
- modern-web-guidance `guides/ui-components/card.md` (repo path) — semantic `<article>`, region order, container queries, subgrid alignment.

## Bad references
- [Grafana – dashboard design tips](https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design) — warns about dashboards "so colorful that users don't know where to look any more". Panels that each carry a border, a title bar and their own coloured background are the typical case.
- [Metabase – top dashboard fails](https://metabase.com/blog/top-5-dashboard-fails) — overloaded dashboards where every number gets its own tile and no hierarchy survives.
- Glassmorphism dashboard kits — every card a different translucent layer over a gradient, so "level" has no meaning (see `style-glass-translucency.md`).

## Accessibility
- Card boundaries are decorative (no 3:1 needed), but controls *inside* cards still need 3:1 boundaries.
- Use `<article>` + heading for each card so screen-reader users can navigate by heading. For a whole-card link, wrap only if there are no other interactive elements (modern-web-guidance `card.md`).
- In forced colours, surface tints vanish, so keep a (transparent) border on cards to restore boundaries.

## Motion / interaction (if relevant)
- Selected/hover row: switch to `surface-2` instantly or ≤ 100 ms. Slow row fades lag behind the cursor.
- Drawers and dialogs enter from the top layer with `@starting-style` transitions, 200–250 ms (modern-web-guidance `animate-to-from-top-layer.md`).

## Tokens and values
| Level | Light | Dark | Typical use |
|---|---|---|---|
| `--canvas` | #f9fafc (L 0.985) | #101214 (L 0.18) | app background |
| `--sunken` (optional, not in tokens.css) | #f3f5f8 (L 0.97) | #0b0d10 (L 0.16) | grouped backdrop, code well |
| `--surface` | #ffffff | #171a1d (L 0.215) | cards, panels |
| `--surface-2` | #f3f5f8 (L 0.97) | #1e2226 (L 0.25) | hover/selected row, inner well |
| `--surface-3` (overlay) | #e5e8ec (L 0.93) + shadow-md | #282c30 (L 0.29) + border | menus, popovers, dialogs |
| Card padding | 12 / 16 / 24 px | | compact / default / spacious |
| Grid gap | 16 px; 24 px at ≥ 1312 px (≥ card padding) | | |
| Card radius | 12 px | | see `style-radius-scale.md` |
| Max container nesting inside card | 1 (a well) | | |

## Implementation sketch
```html
<main class="dash-grid">
  <article class="card" data-density="default">
    <header class="card-head">
      <h2>Revenue</h2>
      <button popovertarget="rev-menu" aria-label="Revenue options">⋯</button>
    </header>
    <div class="chart" role="img" aria-label="Revenue by month, Jan to Dec">…</div>
    <footer class="card-foot"><a href="/revenue">Details<span class="visually-hidden"> about revenue</span></a></footer>
  </article>
</main>
<div id="rev-menu" popover class="menu">…</div>
```
```css
body { background: var(--canvas); }
.dash-grid {
  display: grid; gap: var(--space-4); /* 16px; --space-5 (24px) at ≥ 1312px */
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  grid-auto-rows: auto 1fr auto; /* header, chart, footer tracks shared via subgrid */
}
.card {
  container-type: inline-size;
  display: grid; grid-row: span 3; grid-template-rows: subgrid;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: var(--card-pad, 16px);
}
:where([data-density="compact"]) .card, .card:where([data-density="compact"]) { --card-pad: 12px; }
.card .well { background: var(--surface-2); border-radius: max(2px, calc(var(--radius-lg) - var(--card-pad, 16px) - 1px)); }
.menu { background: var(--surface-3); border: 1px solid var(--border); box-shadow: var(--shadow-md); border-radius: var(--radius-md); }
@container (inline-size < 280px) { .card-head { flex-direction: column; align-items: start; } }
```

## Checklist
- [ ] Every element belongs to one named surface level. No ad-hoc background colours.
- [ ] Canvas and card are distinguishable (tone ≥ 1.03:1 plus border, or border alone).
- [ ] No card contains another bordered card.
- [ ] Card grids share radius, padding and subgrid-aligned rows.
- [ ] Overlays use the top layer (`popover`/`<dialog>`) and `surface-3`.
- [ ] Card internals adapt with container queries.

## Sources
- https://atlassian.design/foundations/elevation
- https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://vercel.com/geist/colors
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design
- https://metabase.com/blog/top-5-dashboard-fails
- modern-web-guidance: `guides/ui-components/card.md`, `guides/css/design-token-reactivity.md`, `guides/user-experience/content-first-noise-reduction.md`, `guides/ui-behaviors/animate-to-from-top-layer.md`, `guides/ui-components/dialog.md`
