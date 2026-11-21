# Density: comfortable vs compact

> Treat density as value per unit of space and time, not as how full the screen looks. Ship two density modes driven by the same tokens: comfortable by default, compact for expert and analytical views.

**Category:** Foundations · **Applies to:** data tables, lists, KPI grids, sidebars, toolbars, forms in admin views · **Priority:** should

## When to use / when not
- **Use compact** for analytical and operational views used daily by experts: tables over 20 rows, logs, trading-style views, admin lists. Users compare many rows and benefit from seeing more at once.
- **Use comfortable** for strategic views, onboarding, occasional users, touch devices and anything that will be screenshotted into a slide.
- **Offer a toggle** when one view serves both groups. Persist it per user.
- **Not** a replacement for removing low-value elements. Compacting 40 useless columns yields 40 smaller useless columns (see `found-data-ink-minimalism.md`).

## Rules (do)
- **Define density with Matthew Ström:** "UI density is the value a user gets from the interface divided by the time and space the interface occupies." Cut latency before cutting padding. Ström treats responses under 100ms as feeling instant (his own estimate, which he says has no scientific backing) and, citing Nielsen, notes users are most likely to leave within the first 10 seconds.
- **Density changes spacing and row height, not font size.** Keep table text at 14px in both modes (Carbon rows are 14px from 24px to 64px row heights). Never go below 12px for any data text (Datawrapper: "everything below 12px will likely be too small").
- **Use row heights from a fixed set** (Carbon): 24 (xs), 32 (sm), 40 (md), 48 (lg), 64 (xl, only for two-line rows). Defaults:
  - **compact = 32px**
  - **comfortable = 48px**
  - 40px is a fine single default if you ship only one mode
  - 24px only for logs or monospaced streams
- **Pair surrounding components with the row height** (Carbon): a 32px toolbar with sm rows, a 48px toolbar with lg/xl rows, and pagination the same height as the rows (24/32/40/48px).
- **Card padding:** compact 16px, comfortable 24px (the KPI card range is 16–24px). Grid gutter: compact 16px, comfortable 24px. Only table cells drop to 12px inline padding.
- **Use `pointer: coarse` to force comfortable hit areas** (≥ 44px targets) regardless of the chosen visual density.
- **Dense regions, calm page** (Carbon): one dense table is fine, but surround it with normal section spacing so the eye can rest.
- **Separate rows with light rules or light zebra, not both.** NN/g lists zebra striping and light borders as aids that help users "keep their place" across a wide table. Ström recommends light horizontal rules and calls the claim that zebra striping is bad "an unsubstantiated opinion". At compact density, use a 1px `--border` hairline or a very light zebra.

## Anti-patterns (don't)
- **Shrinking type to fit more:** 11px tables, 10px axis labels. That's lower legibility, not density.
- **Compact as the only mode on touch devices.** 32px rows with 24px tap targets fail on phones.
- **Whitespace inflation on desktop.** 72px rows and 48px card padding make users scroll to compare three numbers. NN/g: dispersion "causes an increase in cognitive load and interaction costs".
- **Density toggle that changes layout or content.** Switching mode should not hide columns or reorder anything. It only changes spacing.
- **Mixing densities inside one table,** such as compact rows with a comfortable 64px header.

## Good references
- [Matthew Ström: UI Density](https://mattstromawn.com/writing/ui-density/): splits density into visual, information, design, temporal and value density. Uses the Bloomberg Terminal as the example of *temporal* density, where near-instant load lets experts move through many views quickly.
- [IBM Carbon: Data table style](https://carbondesignsystem.com/components/data-table/style/): five explicit row sizes (24/32/40/48/64px, lg 48 is the default), 14px body at every size, at least 16px between columns, and toolbar and pagination heights matched to row height.
- [Atlassian: Spacing](https://atlassian.design/foundations/spacing): the 0–8px range is for compact UI (table cells, badges, icon buttons), 12–24px for component padding and 32–80px for page layout. Atlassian says the scale lays the groundwork for customisable density later.
- [Datadog dashboards: high-density mode](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): on large monitors the two halves of a dashboard sit side by side automatically. This is density gained through layout, not smaller type.
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui): goals were to "reduce visual noise ... and increase the hierarchy and density of navigation elements". Density and calm achieved together through alignment and neutral color.

## Bad references
- [NN/g: Negative impact of mobile-first design on desktop](https://www.nngroup.com/articles/content-dispersion/): participants had to scroll and hold numbers in memory to compare options ("It takes me five seconds to scroll..."). This is under-density as an anti-pattern.
- [Few, Common Pitfalls, Fig. 2](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): the opposite failure. Seven major sales metrics are picked one at a time with radio buttons or list boxes, so they are seen "separate, never together". Low density by fragmentation.

## Accessibility
- Compact mode must still meet WCAG 2.5.8: targets ≥ 24×24 CSS px, or spaced so their 24px circles don't overlap.
- Keep row contrast and focus outlines identical across modes. Focus rings must not be clipped by tight `overflow` on cells.
- Persist the preference, but also respect user zoom. At 200% zoom a compact table must still reflow or scroll in its own region (WCAG 1.4.10).
- Label the toggle clearly ("Row density: Compact / Comfortable") using a radio group or segmented control, not an unlabeled icon.

## Motion / interaction (if relevant)
- Switching density: animate row height over at most 150ms, or not at all. Keep the focused or selected row anchored in view after the switch (scroll anchoring is on by default in most browsers; don't disable it).

## Tokens and values
| Token | Compact | Comfortable | Notes |
|---|---|---|---|
| `--row-h` | 32px | 48px | Carbon sm / lg |
| `--cell-pad-inline` | 12px | 16px | |
| `--cell-pad-block` | 4px | 12px | row height comes from `--row-h` |
| `--card-pad` | 16px | 24px | `--space-4` / `--space-5` |
| `--grid-gap` | 16px | 24px | matches the page gutter |
| `--toolbar-h` | 32px | 48px | matches rows |
| `--text-table` | 14px | 14px | unchanged |
| `--target-min` | 24px (fine pointer) | 24px; 44px under `pointer: coarse` | |

## Implementation sketch
```css
:root, [data-density="comfortable"] {
  --row-h: 3rem; --cell-pad-inline: 1rem; --cell-pad-block: .75rem;
  --card-pad: 1.5rem; --grid-gap: 1.5rem; --toolbar-h: 3rem;
}
[data-density="compact"] {
  --row-h: 2rem; --cell-pad-inline: .75rem; --cell-pad-block: .25rem;
  --card-pad: 1rem; --grid-gap: 1rem; --toolbar-h: 2rem;
}
@media (pointer: coarse) {
  [data-density] { --row-h: max(var(--row-h), 2.75rem); } /* 44px targets on touch */
}
td, th { block-size: var(--row-h); /* acts as a minimum on table cells */ padding: var(--cell-pad-block) var(--cell-pad-inline); font-size: .875rem; }
```
```html
<fieldset class="density">
  <legend>Row density</legend>
  <label><input type="radio" name="density" value="comfortable" checked> Comfortable</label>
  <label><input type="radio" name="density" value="compact"> Compact</label>
</fieldset>
```
```ts
type Density = "compact" | "comfortable";
const isDensity = (v: unknown): v is Density => v === "compact" || v === "comfortable";

function applyDensity(d: Density): void {
  document.documentElement.dataset.density = d;
  try { localStorage.setItem("density", d); } catch { /* storage may be blocked */ }
}
```

## Checklist
- [ ] Density changes only spacing tokens. Font sizes and content are identical in both modes.
- [ ] Row heights come from {24, 32, 40, 48, 64}, and toolbars or pagination match.
- [ ] No data text is below 12px. Table text is 14px.
- [ ] Touch devices get ≥ 44px targets even in compact mode.
- [ ] The density choice persists per user and is a labelled control.
- [ ] Compact tables still have visible row separation (hairline or light zebra), not both heavy.

## Sources
- https://mattstromawn.com/writing/ui-density/
- https://mattstromawn.com/writing/tables/
- https://carbondesignsystem.com/components/data-table/style/
- https://carbondesignsystem.com/elements/spacing/overview/
- https://atlassian.design/foundations/spacing
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://www.nngroup.com/articles/content-dispersion/
- https://www.nngroup.com/articles/data-tables/
- https://www.datawrapper.de/blog/fonts-for-data-visualization
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
