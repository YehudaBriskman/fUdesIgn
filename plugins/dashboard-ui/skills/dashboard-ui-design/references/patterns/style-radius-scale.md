# Radius scale and nested (concentric) corners

> Use a small, fixed radius scale tied to component size, and make nested corners concentric: inner radius = outer radius − the gap between the edges (padding + border), clamped at a small minimum.

**Category:** Color and visual style (soft and rounded aesthetic) · **Applies to:** cards, panels, buttons, inputs, chips, badges, popovers, dialogs, chart tooltips, images inside cards, segmented controls · **Priority:** should

## When to use / when not
- Use a rounded scale to give a dense dashboard a soft, approachable look without adding colour. Radius is one of the cheapest "friendly" signals.
- Keep data cells, table rows, chart bars at small sizes and sparklines square or nearly square (0–2 px). Large radii on bars distort the value end of the bar, and rounded table rows break the grid.
- Full pill radius (`9999px`) only for chips, tags, toggles and avatars, never for cards or inputs taller than ~40 px.

## Rules (do)
- **5–7 named steps, not ad-hoc values.** Material 3 shape scale: none 0, extra-small 4 dp, small 8, medium 12, large 16, extra-large 28, full. Compose examples customise to 4/8/12/16/24. Pick one scale and map components to it.
- **Radius scales with component size.** About 25–35% of the height for controls (32 px button → 8 px), and 12–16 px for cards ≥ 200 px tall. Bigger surfaces get bigger radii, small elements get small radii.
- **Concentric nesting:** `inner = outer − gap`, where gap = padding + border width (Cloud Four, CSS-Tricks). A 16 px card with 12 px padding gives an inner chart/image corner of 4 px, not 16.
- **Or derive outward:** Piccalilli's form is `outer = inner + padding`. Use it when the inner component's radius is the fixed design token, e.g. a 12 px button inside an 8 px-padded toolbar → 20 px toolbar.
- **Clamp the result.** If padding ≥ outer radius, the formula goes to ≤ 0. Use `max(2px, …)` (Frontend Masters notes a zero inner radius inside a rounded parent often looks wrong).
- **Same radius on siblings at the same level.** All cards in a grid share one radius, and all inputs in a form share one.
- **Clip children, not content.** Use `overflow: clip` on cards with edge-to-edge media/tables so the child's square corners don't poke out. Prefer `clip` over `hidden` so it doesn't create a scroll container (modern-web-guidance `overflow-clipping-control.md`).
- **Focus rings follow the radius.** `outline` follows `border-radius` in all evergreen browsers. With `outline-offset: 2px`, the visual ring radius is radius + 2 px, which is automatically concentric.
- **Progressive enhancement:** `corner-shape: squircle` (Chromium, 2025+) gives continuous "Apple-style" corners. Guard it with `@supports` and keep `border-radius` as the base.

## Anti-patterns (don't)
- Same radius inside and outside (16 px image inside a 16 px card with 12 px padding). The inner corner looks bloated and the gap looks uneven at the corners (Cloud Four illustrates this).
- A different radius for every component (6, 7, 10, 14, 20 px) because each was designed in isolation.
- Rounded corners on one side of a panel that docks against a viewport edge. Square the docked edge.
- Rounding chart bars' baseline end. If you round bars at all, round only the value end, by ≤ 2 px, or not at all.
- Pills for everything: pill-shaped cards and inputs waste horizontal space and read as toys in a finance tool.
- `overflow: hidden` on a card that contains a popover or tooltip, which clips the overlay. Overlays belong in the top layer (`popover`, `<dialog>`).

## Good references
- [Material 3 shape scale (Compose)](https://developer.android.com/develop/ui/compose/designsystems/material3) — named steps (extraSmall → extraLarge) mapped per component, such as Card = medium, FAB = large.
- [Cloud Four – The math behind nesting rounded corners](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/) — derivation (each corner is a circle, so the radii differ by the gap) and `calc()` tokens.
- [Piccalilli – Relative rounded corners](https://piccalil.li/blog/relative-rounded-corners) — `outer = inner + padding` with two custom properties.
- [Frontend Masters – classic border-radius advice](https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/) — points out that the formula is "a little too simplistic" when it reaches zero, and suggests clamping.
- [CSSWG issue #7707](https://github.com/w3c/csswg-drafts/issues/7707) — proposal for a native keyword that computes parent radius − parent padding. Shows the problem is common enough to standardise.

## Bad references
- [DEV – The concentric border-radius rule](https://dev.to/sgbp/the-concentric-border-radius-rule-why-nested-rounded-corners-look-slightly-wrong-3hog) — catalogues the "slightly wrong" look of matching radii in nested cards and forgets-the-border cases (gap must include border width).
- Generic admin templates that put `border-radius: 0.5rem` on everything — chart canvases, tables, cards and buttons — so nesting breaks everywhere and the grid loses crispness.

## Accessibility
- Radius has no direct WCAG requirement, but very large radii on small targets shrink the visible hit area. Keep the hit target ≥ 24×24 CSS px (WCAG 2.5.8), regardless of visual shape.
- In forced-colors mode, borders remain and shadows vanish, so a rounded card still needs a border (transparent is fine: `border: 1px solid transparent` becomes visible as `CanvasText`).

## Motion / interaction (if relevant)
- Animating `border-radius` (e.g. card → modal morph) is fine in View Transitions. Keep it ≤ 300 ms and respect reduced motion.
- Don't change radius on hover. It reads as a glitch rather than feedback.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | table cells, chart bars, docked panels |
| `--radius-xs` | 4px | badges, checkboxes, tooltips, small chips, inner media |
| `--radius-sm` | 6px | inputs, buttons ≤ 32 px tall, menu items |
| `--radius-md` | 8px | buttons 36–40 px, segmented controls, popovers |
| `--radius-lg` | 12px | cards, panels, KPI tiles |
| `--radius-xl` | 16px | dialogs, sheets, hero cards |
| `--radius-full` | 9999px | pills, avatars, toggles |
| Inner radius | `max(2px, outer − padding − border)` | nested elements |
| Bar value-end radius | 0–2px | charts |

## Implementation sketch
```css
:root {
  --radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px;
  --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;
}
.card {
  --card-radius: var(--radius-lg);
  --card-pad: 8px;
  --card-border: 1px;
  border: var(--card-border) solid var(--border);
  border-radius: var(--card-radius);
  padding: var(--card-pad);
  overflow: clip;
  /* exposed to children */
  --inner-radius: max(2px, calc(var(--card-radius) - var(--card-pad) - var(--card-border)));
}
.card > :is(img, figure, .chart, .inset) { border-radius: var(--inner-radius); }

/* Edge-to-edge child: no padding gap, so it inherits the outer radius via clip */
.card > table { margin-inline: calc(-1 * var(--card-pad)); }

@supports (corner-shape: squircle) {
  .card { corner-shape: squircle; }
}
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } /* follows radius */
```

## Checklist
- [ ] All radii come from ≤ 7 tokens. No literal `border-radius` values in components.
- [ ] Nested elements use `outer − padding − border`, clamped to ≥ 2 px.
- [ ] Siblings at one level share the same radius.
- [ ] Charts' bars and table cells are square (≤ 2 px).
- [ ] Cards with edge-to-edge media/tables use `overflow: clip`, and overlays aren't clipped.
- [ ] Docked panels have square edges against the viewport.

## Sources
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/
- https://piccalil.li/blog/relative-rounded-corners
- https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/
- https://dev.to/sgbp/the-concentric-border-radius-rule-why-nested-rounded-corners-look-slightly-wrong-3hog
- https://css-tricks.com/?p=19719
- https://github.com/w3c/csswg-drafts/issues/7707
- modern-web-guidance: `guides/css/overflow-clipping-control.md`, `guides/ui-components/card.md`, `guides/visual-design/complex-shapes.md`
