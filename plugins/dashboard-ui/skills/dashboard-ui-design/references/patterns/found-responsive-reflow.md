# Responsive dashboards: reflow by priority, adapt by container

> Use media queries only for the page shell (columns, navigation). Let each widget adapt to its own container with container queries, and reflow by priority so the overview stays first on every size.

**Category:** Foundations · **Applies to:** page shell, widget grid, KPI tiles, charts, tables, side panels · **Priority:** must

## When to use / when not
- **Use** for every dashboard, even "desktop-only" internal tools. Windows get split, sidebars open, laptops run at 1280px with 125% zoom, and WCAG 1.4.10 requires reflow at 320 CSS px.
- **Use container queries** for any widget that can appear in more than one slot (a KPI tile in a 4-up row, in a sidebar, in a drawer). The component shouldn't need to know where it lives (modern-web-guidance `css/size-aware-styling.md`).
- **Not** "shrink everything". Mobile dashboards are a *different selection* of the same content: band 1 KPIs, then one key trend, then links to details. They are not the desktop grid at 30% scale.
- **Not** "mobile-first stretched to desktop" either. NN/g found that dispersed mobile layouts on desktop increase scrolling and cognitive load.

## Rules (do)
- **Shell breakpoints by window class** (Android/Material WindowSizeClass): **compact < 600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥ 1600** (dp ≈ CSS px). Page columns follow `tokens.css`, not the window classes:
  - 4 columns below 600px
  - 8 columns at 600–1055px
  - 12 columns at 1056px or wider (Carbon's lg breakpoint)
  - gutter 16px, 24px at 1312px or wider
  - optionally a side-by-side "high density" second column of groups at 1600px or wider (Datadog)
- **Shell changes at the window level** (media queries):
  - nav: bottom bar or drawer at compact, rail at medium, full sidebar at expanded+
  - detail panel: full-screen sheet at compact, overlay drawer at medium, docked pane at large+
- **Widgets change at the container level** (`@container`). A KPI tile switches from stacked to inline at about 18rem. A chart drops its legend for direct labels below about 28rem and hides the secondary axis below about 20rem. A table switches to a stacked "card per row" view below about 600px container width (modern-web-guidance `ui-atoms/responsive-table.md`).
- **Reflow order = priority order.** On compact, the order is band 1 → band 2's single most important chart → links to the rest. Make DOM order the priority order so single-column flow is correct with no CSS reordering.
- **KPI rows:** 1 tile per row below 768px, 2 at 768px or wider, 4–6 at 1280px or wider (`data-kpi-stat-card.md`). Inside a region of unknown width, use `repeat(auto-fit, minmax(14rem, 1fr))`. On compact, show at most 4 KPIs and collapse the rest behind "More metrics".
- **Tables on small screens:**
  - Use horizontal scroll in a focusable region with a sticky first column and sticky header, when users compare across attributes.
  - Use stacked cards when users look at one record at a time (modern-web-guidance `ui-atoms/responsive-table.md`). NN/g calls horizontal scroll "somewhat acceptable for large tables on mobile screens" if the first column and headers are locked.
  - Never squash columns below legibility.
- **Charts:**
  - Keep the aspect ratio with `aspect-ratio` to avoid CLS.
  - Reduce tick count with width (about 1 tick per 80–100px).
  - Prefer fewer series over smaller text.
  - Touch tooltips open on tap, not hover.
- **Use fluid type inside widgets with `clamp(rem, cqi, rem)`,** max ≤ 2.5× min (modern-web-guidance `css/fluid-scaling.md`).
- **Use `dvh` for full-height panels** on mobile, and `env(safe-area-inset-*)` padding for fixed bars.
- **Test at 360, 768, 1024, 1280, 1440, 1920 and 2560px,** plus 1280px at 200% zoom.
- **Resize continuously, not only at named breakpoints.** Drag the viewport from 320 px to wide and add a breakpoint or container query where the content breaks, rather than where a device class starts. WCAG 1.4.10 Reflow is the floor (320 CSS px, no two-dimensional scrolling for text). (Source corpus: local `visual-hierarchy-layout`, `mobile-ux-architecture`.)

## Anti-patterns (don't)
- **Viewport media queries inside widgets.** The tile breaks when placed in a 320px sidebar on a 1920px screen.
- **Scaling the desktop canvas** (`transform: scale`, `zoom`). Text becomes unreadable and targets tiny.
- **Hiding data on mobile with no route to it.** Collapse or link it instead (see `found-progressive-disclosure.md`).
- **Horizontal page scroll,** or `overflow-x: hidden` on `body` to "fix" it. That clips content (modern-web-guidance `form-factor-adaptation.md`).
- **Different metrics or definitions per device.** "Revenue" must mean the same on phone and desktop.
- **Desktop-only hover interactions:** drill-down only on hover, or tooltips with no tap equivalent.
- **Over-stretched desktop:** a 4-tile KPI row spanning 2560px with 600px-wide tiles holding a single number.

## Good references
- [Android: Use window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes): five width classes with device coverage stats (compact covers 99.96% of phones in portrait). Explicitly *not* for "isTablet" logic, because the window class changes with split-screen and resizing.
- [MDN: Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries): `container-type: inline-size`, named containers, and `cqi`/`cqb` units. Units fall back to small-viewport units when there's no container.
- [web.dev: Baseline in action, container queries](https://web.dev/articles/baseline-in-action-container-queries): grid cells need a wrapper to act as containers, and an element can't query itself. Mix with media queries: container for components, media for the shell.
- [GitHub Primer: Layout](https://primer.style/product/getting-started/foundations/layout/): viewport ranges narrow (< 768, 1 column), regular (≥ 768, up to 2), wide (≥ 1400, up to 3); full pages cap at 1280px. List-detail splits into separate pages on narrow, and auxiliary panes become bottom sheets.
- [IBM Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/): 4/8/16 columns at 320/672/1056+, with fluid and fixed grids meeting at breakpoints.
- [Datadog integration dashboards](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): designed for high-density mode at large widths (symmetrical halves), tested at 1280 and 2560px.

## Bad references
- [NN/g: Negative Impact of Mobile-First Web Design on Desktop](https://www.nngroup.com/articles/content-dispersion/): oversized blocks and accordions on desktop lead to longer pages, more interaction cost, an illusion of completeness and lower trust.
- [NN/g: Mobile tables](https://www.nngroup.com/articles/mobile-tables/): "Rotating the Phone Is a Last Resort". It gains width, costs rows, and dictating how users hold the phone annoys them. Avoid it as the responsive strategy.

## Accessibility
- WCAG 1.4.10 Reflow: no two-dimensional scrolling at 320 CSS px except for content that needs it (tables, charts). Those scroll inside a `role="region"` with `tabindex="0"` and an accessible name.
- WCAG 1.4.4: text resizes to 200%. Containers must not shrink when zooming (modern-web-guidance `fluid-scaling.md`).
- Targets ≥ 44×44 under `pointer: coarse` (modern-web-guidance `form-factor-adaptation.md`).
- Don't reorder with CSS between breakpoints in a way that diverges from DOM order. Keyboard focus would jump.
- Fixed bars: `scroll-padding` at least the bar height so focused elements aren't obscured (WCAG 2.4.11).

## Motion / interaction (if relevant)
- Don't animate layout reflow on resize. On orientation change, keep the scroll anchored to the current section.
- A detail pane changing from docked to sheet should keep its state and focus. Use `moveBefore()` where supported, or keep a single DOM node and restyle it via container or media queries (modern-web-guidance `ui-behaviors/move-dom-element-without-losing-state.md`).

## Tokens and values
| Window class | Width | Columns | Margin | Gutter | Nav | Detail pane |
|---|---|---|---|---|---|---|
| compact | < 600 | 4 | 16 | 16 | bottom bar / drawer | full-screen sheet |
| medium | 600–839 | 8 | 24 | 16 | rail | overlay drawer |
| expanded | 840–1199 | 8 (12 from 1056) | 24 | 16 | rail or sidebar | overlay drawer |
| large | 1200–1599 | 12 | 32 | 16 (24 from 1312) | sidebar | docked, 360–480px |
| extra-large | ≥ 1600 | 12 (+ 2 group columns) | 32 | 24 | sidebar | docked, 360–480px |

| Widget container breakpoint | Change |
|---|---|
| KPI tile ≥ 18rem | value and sparkline inline |
| Chart < 28rem | legend → direct labels; fewer ticks |
| Table < 37.5rem (600px) | stacked rows or scroll region with sticky first column |

## Implementation sketch
```css
/* Shell: media queries */
.shell { display: grid; grid-template-columns: 1fr; min-block-size: 100dvh; }
@media (width >= 840px)  { .shell { grid-template-columns: 4.5rem 1fr; } }      /* rail */
@media (width >= 1200px) { .shell { grid-template-columns: 15rem 1fr 26rem; } } /* sidebar + docked detail */

/* Widgets: container queries */
.widget { container: widget / inline-size; }
.kpi { display: grid; gap: .25rem; }
@container widget (inline-size >= 18rem) {
  .kpi { grid-template-columns: 1fr auto; align-items: end; }
}
.chart { aspect-ratio: 16 / 9; }
@container widget (inline-size < 28rem) {
  .chart .legend { display: none; }      /* direct labels are rendered instead */
}

/* Tables: scroll in their own region */
.table-wrap { overflow: auto; max-inline-size: 100%; container-type: inline-size; }
.table-wrap thead th { position: sticky; inset-block-start: 0; }
.table-wrap tbody th { position: sticky; inset-inline-start: 0; background: var(--surface); }
```
```html
<div class="table-wrap" role="region" aria-labelledby="tx-cap" tabindex="0">
  <table><caption id="tx-cap">Recent transactions</caption>…</table>
</div>
```

## Checklist
- [ ] DOM order equals priority order, and single-column flow reads band 1 → 2 → 3.
- [ ] Widgets use `@container`, and only the shell uses `@media` for width.
- [ ] Tested at 360/768/1024/1280/1440/1920/2560px and at 1280px with 200% zoom.
- [ ] No page-level horizontal scroll at 320px. Tables scroll in a labelled, focusable region.
- [ ] Every hover interaction has a tap or keyboard equivalent.
- [ ] Charts reserve space with `aspect-ratio` and reduce ticks and legends at narrow widths.
- [ ] Content hidden on compact is reachable via disclosure or link, never removed.

## Sources
- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- https://web.dev/articles/baseline-in-action-container-queries
- https://primer.style/product/getting-started/foundations/layout/
- https://carbondesignsystem.com/elements/2x-grid/overview/
- https://fluent2.microsoft.design/layout
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://www.nngroup.com/articles/content-dispersion/
- https://www.nngroup.com/articles/mobile-tables/
- https://docs.stripe.com/stripe-apps/design
- modern-web-guidance/skills/modern-web-guidance/guides/css/responsive-design.md
- modern-web-guidance/skills/modern-web-guidance/guides/css/size-aware-styling.md
- modern-web-guidance/skills/modern-web-guidance/guides/css/fluid-scaling.md
- modern-web-guidance/skills/modern-web-guidance/guides/css/css-layout.md
- modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
- modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/move-dom-element-without-losing-state.md
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
