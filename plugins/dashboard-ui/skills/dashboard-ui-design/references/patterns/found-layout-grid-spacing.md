# Layout grid and spacing scale

> Lay dashboards on a 4/8/12-column grid with a single 4px-based spacing scale. Group with space, not lines, and keep internal gaps smaller than the gaps between groups.

**Category:** Foundations · **Applies to:** page shell, widget grid, cards, forms in settings, tables, toolbars · **Priority:** must

## When to use / when not
- **Use** for every dashboard page and every widget's interior. A consistent scale is what makes 20 widgets read as one product.
- **Use** CSS Grid for the page and widget grid, flexbox for rows of controls, and subgrid when card internals (title, value, sparkline, footer) must line up across siblings (modern-web-guidance `css/css-layout.md` decision tree).
- **Not** a reason for every widget to be the same size. Size follows priority (see `found-visual-hierarchy.md`).
- **Not** pixel-locked. Carbon says it is "acceptable at page breakpoints to jump a step(s) on the spacing scale" (its example: `$spacing-05`, 16px, at 1440px → `$spacing-03`, 8px, at 768px).

## Rules (do)
- **Base unit 4px, rhythm 8px.** All spacing is a token from the scale. The scale is 4, 8, 12, 16, 24, 32, 48, 64 (`assets/tokens.css`). Carbon, Atlassian and Fluent all build on 4px or 8px steps, and Carbon says "deviating from the spacing scales should be avoided whenever possible".
- **Proximity rule: inner < outer.** The gap inside a group must be visibly smaller than the gap between groups, at least 1.5×, ideally 2×. Examples:
  - label → value: 4px
  - value → sparkline: 8px
  - card padding: 16px
  - card → card: 16–24px
  - section → section: 32–48px
- **Use 4 columns below 600px, 8 at 600–1055px and 12 at 1056px or wider.** Fluent's 12 columns fit this; Carbon switches to 16 columns at 1056px, which also works if you map the spans. Common spans on the 12-column grid:
  - KPI tile: 2–3 columns, giving 4–6 per row at 1280px or wider (2 per row at 768px or wider, 1 below; see `data-kpi-stat-card.md`)
  - main chart: 8 columns
  - side list: 4 columns
  - full-width table: 12 columns
- **Set a minimum width per widget type,** not a fixed width. Datadog: timeseries widgets "at least four columns wide in order not to appear squashed on smaller displays", and stream widgets at least 6 columns or half the dashboard width.
- **Set KPI rows explicitly at 1, 2 and 4–6 columns** (below 768px, 768px or wider, 1280px or wider). Use `repeat(auto-fit, minmax(14rem, 1fr))` only inside a region of unknown width. Use explicit `grid-template-areas` for the page skeleton.
- **Cap the content width.** Dashboards are often full-bleed, but text blocks and forms cap at about 60–75ch. Very wide monitors (≥ 1920px) either cap the page (Primer caps full pages at 1280px including 24px padding, about 1232px of content) or add columns (Datadog high-density mode puts the two halves of a dashboard side by side).
- **Use gutters of 16px below 1312px and 24px at 1312px or wider.** Page margins are 16px below 600px, 24px up to 1199px and 32px from 1200px.
- **Use `gap`, never child margins,** for spacing between grid and flex items.
- **Group with space before borders.** Add a 1px hairline only when space alone fails, for example between dense table rows. Use a card background only when widgets have different interaction scopes.

## Anti-patterns (don't)
- **Arbitrary values** (13px, 18px, 22px) scattered across components. They produce "almost aligned" edges users feel but can't name (Linear's redesign aligned labels, icons and buttons for exactly this reason).
- **Equal spacing everywhere.** If the label-to-value gap equals the card-to-card gap, grouping disappears.
- **Card-in-card-in-card.** Three nested borders for one KPI. Containers add clutter (NN/g visual hierarchy).
- **Fixed-pixel widget widths** that overflow at 1280px or leave 600px of dead space at 2560px.
- **Masonry by accident.** Uneven card heights with misaligned baselines, because each card sizes its own header. Use subgrid.
- **Stretching a mobile layout onto desktop.** Huge cards and big gaps disperse related numbers across viewports (NN/g "content dispersion").

## Good references
- [IBM Carbon: Spacing](https://carbondesignsystem.com/elements/spacing/overview/): a 13-step scale from 2px to 160px (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160). It explicitly allows dense sections, as long as the page as a whole leaves room for the eye to rest.
- [IBM Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/): an 8px mini-unit, breakpoints sm 320 / md 672 / lg 1056 / xlg 1312 / max 1584, 4 → 8 → 16 columns, a 32px total gutter (16px per side) and margins of 0 / 16 / 16 / 16 / 24px.
- [Atlassian: Spacing](https://atlassian.design/foundations/spacing): tokens named by percentage of an 8px base (`space.100` = 8px, `space.1000` = 80px), grouped into small (0–8px, compact UI and table cells), medium (12–24px, component padding) and large (32–80px, page layout).
- [Fluent 2: Layout](https://fluent2.microsoft.design/layout): a 4px ramp with 2/6/10 added for icon alignment, a 12-column grid, and size classes from 320 to 1920+.
- [Datadog integration dashboard guidelines](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): minimum widget widths by type, symmetrical halves for high-density mode, and testing at 1280 and 2560px.

## Bad references
- [NN/g: The Negative Impact of Mobile-First Web Design on Desktop](https://www.nngroup.com/articles/content-dispersion/): oversized spacing and blocks on desktop increase scrolling and cognitive load, and create an "illusion of completeness" where users think they reached the end.
- [Few, Common Pitfalls, Fig. 12](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): related widgets (average order size and its trend) are placed far apart because the grid was filled in arbitrary order. Layout ignored relationships.

## Accessibility
- Spacing must survive WCAG 1.4.12 text-spacing overrides. Don't set fixed `height` on text containers; use `min-block-size` (modern-web-guidance `visual-design/typography.md`).
- Reflow at 320 CSS px without page-level horizontal scroll (WCAG 1.4.10). Data tables may scroll inside their own focusable region.
- Visual order from grid placement must match DOM order. Don't use `order` or `grid-area` reshuffles that break the tab sequence.
- Touch targets in toolbars: ≥ 24×24 CSS px, or 44×44 under `pointer: coarse` (modern-web-guidance `user-experience/form-factor-adaptation.md`).

## Motion / interaction (if relevant)
- User-resizable or draggable widget grids (Grafana or Datadog style) should snap to grid columns and animate the reflow in 240ms (`--motion-dur-medium`), or not at all under reduced motion. Keyboard users need a "move widget" menu, not drag only.

## Tokens and values
| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | label ↔ value, icon ↔ text |
| `--space-2` | 8 | inside compact controls, chip gap, table cell padding-block (compact) |
| `--space-3` | 12 | table cell padding-inline, small card padding |
| `--space-4` | 16 | card padding, grid gutter below 1312px |
| `--space-5` | 24 | grid gutter at 1312px or wider, card padding (comfortable) |
| `--space-6` | 32 | between sections, page margin desktop |
| `--space-7` | 48 | between major regions |
| `--space-8` | 64 | page top on marketing-like overview only |
| Radius | xs 4 · sm 6 · md 8 · lg 12 · xl 16 · full | badges · inputs · buttons · cards · dialogs (`style-radius-scale.md`) |
| Columns | 4 (< 600) · 8 (600–1055) · 12 (≥ 1056) | page grid |
| KPI tiles per row | 1 (< 768) · 2 (≥ 768) · 4–6 (≥ 1280) | KPI strip |
| Max text measure | 65ch | prose blocks inside dashboards |

## Implementation sketch
```css
:root {
  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
  --space-5: 1.5rem; --space-6: 2rem; --space-7: 3rem; --space-8: 4rem;
  --cols: 4; --gutter: var(--space-4);
}
@media (width >= 37.5rem) { :root { --cols: 8; } }                 /* 600px */
@media (width >= 66rem)   { :root { --cols: 12; } }                /* 1056px */
@media (width >= 82rem)   { :root { --gutter: var(--space-5); } }  /* 1312px */

.page {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--gutter);
  padding-inline: clamp(var(--space-4), 3vw, var(--space-6));
}
.kpis   { grid-column: 1 / -1; display: grid; gap: var(--gutter); grid-template-columns: 1fr; }
@media (width >= 48rem) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } } /* 768px */
@media (width >= 80rem) { .kpis { grid-template-columns: repeat(var(--kpi-cols, 4), minmax(0, 1fr)); } } /* 1280px: 4–6 */
.main, .aside, .table { grid-column: 1 / -1; }
@media (width >= 66rem) { .main { grid-column: span 8; } .aside { grid-column: span 4; } }

/* Card internals align across siblings */
.kpis > .card { display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: var(--space-1); padding: var(--space-4); }
```

## Checklist
- [ ] Every margin, padding and gap value is a scale token (grep for raw px).
- [ ] The gap between groups is at least 1.5× (ideally 2×) the gap inside a group.
- [ ] Widget spans respect minimums (timeseries ≥ 4/12, lists ≥ 6/12 at desktop), and KPI rows show 1 / 2 / 4–6 tiles at < 768 / ≥ 768 / ≥ 1280px.
- [ ] The layout was checked at 1280, 1440, 1920 and 2560px with no dead zones > 1/3 of the width.
- [ ] No more than one level of bordered container around any single datum.
- [ ] Card headers, values and footers align across a row (subgrid or a fixed row template).
- [ ] The page reflows at 320px with no page-level horizontal scroll.

## Sources
- https://carbondesignsystem.com/elements/spacing/overview/
- https://carbondesignsystem.com/elements/2x-grid/overview/
- https://atlassian.design/foundations/spacing
- https://fluent2.microsoft.design/layout
- https://primer.style/product/getting-started/foundations/layout/
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://www.nngroup.com/articles/content-dispersion/
- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- modern-web-guidance/skills/modern-web-guidance/guides/css/css-layout.md
- modern-web-guidance/skills/modern-web-guidance/guides/visual-design/typography.md
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
