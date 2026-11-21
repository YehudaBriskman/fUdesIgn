# Soft shadows, elevation and borders vs shadows

> Default to borders and whitespace for flat, in-flow surfaces. Reserve shadows for things that genuinely float (raised movable items, popovers, dialogs), use a 3–4 step layered shadow scale from one light source, and never let a shadow be the only boundary.

**Category:** Color and visual style (soft and rounded aesthetic) · **Applies to:** cards, KPI tiles, panels, dropdowns, popovers, tooltips, dialogs, sticky headers, drag previews · **Priority:** should

## When to use / when not
- **Border (or tonal fill):** in-flow content such as dashboard cards in a grid, tables, sidebars, sticky headers. Atlassian: raised elevations "can create visual noise, so don't use to group content when a border or white space would suffice", and "A border is the default approach for scrolled content" such as sticky headers.
- **Shadow:** UI that sits *over* other UI (menus, popovers, dialogs, toasts, drag previews), or a raised movable card. Atlassian reserves raised "for cards that can be moved, such as Jira and Trello cards", and for emphasis says "limit to one section or focal point of the screen".
- **Both:** overlays in dark mode, where shadows are weak and need a lighter surface plus a 1 px border.
- **Neither:** grouping a few controls. Use spacing.

## Rules (do)
- **One light source, top-centre or top-left.** Every shadow on the page uses the same x:y offset ratio (Josh Comeau: y = 2× x, or x = 0 for a symmetric UI).
- **4 elevation levels: flat, raised, popover, dialog** (tokens.css). Atlassian uses sunken, default, raised, overlay (+ overflow). Fluent uses 2, 4, 8, 16 (low ramp) and 28, 64 (high ramp). Map each level to component types and don't invent intermediate shadows.
- **Higher = larger offset + larger blur + lower opacity per layer** (Comeau). Fluent: shadow n has blur n and y-offset n/2 (shadow 16 = `0 8px 16px`).
- **Layer 2–5 shadows.** A tight "key" shadow defines the edge and a wide "ambient" shadow implies distance (Fluent). Comeau's layered stack (y and blur 1/2/4/8/16 px, each at 7.5% black) reads far softer than a single `0 10px 30px rgba(0,0,0,.3)`.
- **Tint shadows with the surface hue**, not pure black. Comeau: black over a coloured background "doesn't just make it darker; it also desaturates it quite a bit." tokens.css uses `--shadow-color: oklch(0.35 0.03 250)` in light.
- **Pair surface + shadow tokens.** Atlassian always pairs `elevation.surface.raised` with `elevation.shadow.raised`, and never mixes levels.
- **Dark mode: lighter surface carries elevation**, plus a 1 px border at `--border`. tokens.css only switches `--shadow-color` to black and keeps the light alphas (6–12%). Fluent instead raises its first low-ramp layer from 14% to 28% in dark; if you want that, use the media-query alphas in the sketch.
- **Borders for soft look: low-contrast 1 px** (`--border`, ≈ 1.3–1.6:1) on cards. That's decorative and fine. If the border is the only thing that marks an *interactive control*, it needs 3:1 (see `color-contrast-rules.md`).
- **Hairline + subtle shadow is the common "soft card"**: 1 px `--border` (1.4:1) plus `--shadow-xs` (`0 1px 2px` at 8%). Seen in Linear, Vercel and Stripe dashboards (observed, not documented by them).
- **Forced colors and print drop `box-shadow`.** Any shadow-only boundary must also have a border (transparent border is fine) or outline (modern-web-guidance `color.md`).
- **Shapes and arrows:** use `filter: drop-shadow()` for tooltips with a tail or non-rectangular shapes (modern-web-guidance `visual-effects.md`).

## Anti-patterns (don't)
- Shadow on every card in a 12-card grid. Everything "floats", nothing does, and it adds a lot of visual noise to a data screen.
- Hard, dark single shadows (`0 4px 8px rgba(0,0,0,.5)`), the 2014 "material card" look.
- Mixed light directions (one card's shadow goes left, the menu's goes down).
- Neumorphism (inset + outset shadows of the same hue as the background). Boundaries fall far below 3:1 and disappear in forced colors.
- Animating layered `box-shadow` on hover across many cards. Each layer adds rendering work, and Comeau advises against animating a layered shadow. Animate `opacity` of a pseudo-element that holds the hover shadow, or `translate`.
- Border *and* heavy shadow *and* tinted background on the same card: three cues for one boundary.

## Good references
- [Atlassian – Elevation](https://atlassian.design/foundations/elevation) — clearest rules for when to use border vs elevation, paired surface/shadow tokens, dark-mode behaviour, "one section or focal point of the screen".
- [Josh W. Comeau – Designing beautiful shadows](https://www.joshwcomeau.com/css/designing-shadows/) — consistent light source, layered shadows, colour-matched shadows, concrete small/medium/large values.
- [Microsoft Fluent 2 – Elevation](https://fluent2.microsoft.design/elevation) — key vs ambient shadows, a 2/4/8/16/28/64 ramp, opacities (low ramp 14%/14% light, 28%/14% dark; high ramp 24%/20% light, 28%/20% dark), and a luminosity formula for shadows on brand-coloured surfaces.
- [Material 3 in Compose – Elevation](https://developer.android.com/develop/ui/compose/designsystems/material3) — tonal elevation (colour) as the primary cue, with shadow as an additional one.

## Bad references
- [Stephen Few – rule #9](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) — "Avoid using visual effects in graphs". Light-and-shadow effects that make bars, lines and points look 3-D "add only superficial appeal, but rarely any real value" (pp. 11–12).
- Neumorphism showcases (Dribbble "soft UI" dashboards, 2020) — beautiful in mock-ups, but boundaries are ~1.1:1 and controls are indistinguishable from labels. They fail WCAG 1.4.11 by construction.

## Accessibility
- Shadows are not a boundary for WCAG purposes when they are decorative (W3C 1.4.11 says ignore subtle drop shadows when testing). If a control's only boundary is a shadow, it must reach 3:1, which soft shadows never do, so add a border.
- `@media (forced-colors: active)`: shadows are removed, so ensure overlays have `border: 1px solid CanvasText` or an outline.
- `prefers-contrast: more`: strengthen borders to `--border-strong` rather than darkening shadows.

## Motion / interaction (if relevant)
- Hover on clickable cards: lift by `translate: 0 -1px` + swap to the next shadow level, 150 ms `ease-out`. Not for non-clickable cards.
- Drag: the item moves to overlay elevation while dragged and returns on drop (Atlassian).
- Menus/popovers: fade + 4–8 px translate in 120–200 ms. Disable translate under `prefers-reduced-motion`.

## Tokens and values
| Token | Light value | Dark value | Use |
|---|---|---|---|
| `--shadow-color` | oklch(0.35 0.03 250) | oklch(0 0 0) | hue-tinted shadow base |
| `--shadow-xs` (detail, not a level) | `0 1px 2px color-mix(in oklab, var(--shadow-color) 8%, transparent)` | same alphas, black | buttons, inputs at rest |
| `--shadow-sm` (raised) | `0 1px 1px …6%, 0 2px 4px …6%` | same alphas, black | hover card, draggable card |
| `--shadow-md` (popover) | `0 1px 2px …8%, 0 4px 8px …8%, 0 12px 24px …8%` | same alphas, black | menus, tooltips, popovers |
| `--shadow-lg` (dialog) | `0 2px 4px …8%, 0 8px 16px …8%, 0 24px 48px …12%` | same alphas, black | dialogs, sheets |
| `--border` (decorative) | 1.43:1 vs surface | 1.55:1 | cards, dividers |
| Hover lift | translate 0 −1px, 150 ms ease-out | | clickable cards only |
| Max elevation levels used | 4 | | flat, raised, popover, dialog |

## Implementation sketch
```css
:root {
  --shadow-color: light-dark(oklch(0.35 0.03 250), oklch(0 0 0));
}
/* Optional stronger dark shadows (tokens.css keeps the light alphas).
   light-dark() works only for colours, not percentages, so switch alphas with a media query */
:root { --sh-1: color-mix(in oklab, var(--shadow-color) 6%, transparent);
        --sh-2: color-mix(in oklab, var(--shadow-color) 8%, transparent); }
@media (prefers-color-scheme: dark) {
  :root { --sh-1: color-mix(in oklab, var(--shadow-color) 14%, transparent);
          --sh-2: color-mix(in oklab, var(--shadow-color) 28%, transparent); } /* Fluent dark */
}
:root {
  --shadow-sm: 0 1px 1px var(--sh-1), 0 2px 4px var(--sh-1);
  --shadow-md: 0 1px 2px var(--sh-1), 0 4px 8px var(--sh-1), 0 12px 24px var(--sh-2);
}

.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.card[data-clickable] { position: relative; transition: translate 150ms ease-out; }
.card[data-clickable]::after {               /* shadow on a pseudo-element: animate opacity only */
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: var(--shadow-sm); opacity: 0; transition: opacity 150ms ease-out; pointer-events: none;
}
.card[data-clickable]:hover { translate: 0 -1px; }
.card[data-clickable]:hover::after { opacity: 1; }

[popover].menu { background: var(--surface-3); border: 1px solid var(--border); box-shadow: var(--shadow-md); }
@media (forced-colors: active) { [popover].menu { border-color: CanvasText; } }
@media (prefers-reduced-motion: reduce) { .card[data-clickable]:hover { translate: none; } }
```

## Checklist
- [ ] In-flow cards use a border/whitespace, not a shadow.
- [ ] ≤ 4 elevation levels, each a paired surface + shadow token.
- [ ] All shadows share one light direction and are tinted, not pure black (light theme).
- [ ] Every shadowed element also has a border (visible or transparent) for forced colours.
- [ ] Dark mode shows elevation by lighter surface plus border, not shadow alone.
- [ ] No layered `box-shadow` is animated directly. Hover uses opacity/translate.

## Sources
- https://atlassian.design/foundations/elevation
- https://www.joshwcomeau.com/css/designing-shadows/
- https://fluent2.microsoft.design/elevation
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf
- https://linear.app/now/how-we-redesigned-the-linear-ui
- modern-web-guidance: `guides/visual-design/visual-effects.md` (layered shadows, drop-shadow), `guides/visual-design/color.md` (forced colors removes box-shadow), `guides/ui-behaviors/animate-element-entry-exit.md`
