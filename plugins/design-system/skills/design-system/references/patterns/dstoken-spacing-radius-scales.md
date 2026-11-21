# Spacing and radius scales

> Use one 4px-based, non-linear spacing scale and one radius scale derived from a single base, with density changing which steps components use rather than the steps themselves.

**Category:** Tokens · **Applies to:** padding, gaps, margins, row heights, corner radii, density modes · **Priority:** must

## When to use / when not
- Use in every project. Spacing drift (13px here, 15px there) is the most common inconsistency agents introduce.
- Optical exceptions (1px nudges for icon alignment) are fine inside a component. They are not new tokens.

## Rules (do)
- **4px base, non-linear steps.** `4, 8, 12, 16, 24, 32, 48, 64` (`--space-1…8`). Small steps are close together and large steps far apart, because the difference between 4 and 8 is as visible as the difference between 32 and 64. Carbon's scale (2–160) and Atlassian's (based on 8px with 2px and 4px half steps) follow the same shape.
- **Group with space.** The gap inside a group is smaller than the gap between groups: at least one step apart (12 inside, 24 between).
- **Density swaps steps, not sizes.** Compact, comfortable and spacious change which step a component uses: `--row-h` 32/40/48, `--card-pad` space-4/space-5/space-6, `--grid-gap` space-3/space-4/space-5. Type size stays the same. `theme.mjs --density` sets the default and emits the other two as `[data-density]` overrides.
- **Radius from one base.** `xs = base × 0.5`, `sm × 0.75`, `md × 1`, `lg × 1.5`, `xl × 2`, plus `none` and `full`. Base 8 gives 4/6/8/12/16 (the dashboard-ui values); `theme.mjs --radius` changes the base for the whole set.
- **Radius by size.** Small controls get small radii, containers larger: badges xs, inputs and small buttons sm, buttons and popovers md, cards lg, dialogs xl.
- **Nested corners are concentric.** Inner radius = max(2px, outer radius − padding − border width). A 12px card with 8px padding holds 4px-radius children.
- **Targets aren't spacing.** Minimum target size is its own token (`--target-min`: 24px, 44px on coarse pointers; WCAG 2.5.8 sets 24px as the AA minimum).
- **Tailwind's `--spacing` multiplier is 4px**, so Tailwind's `p-4` is 16px = `--space-4`, but Tailwind's `p-6` (24px) is our `--space-5`. Map by pixels, not by step number (`dsmap-stack-mappings.md`).

## Anti-patterns (don't)
- A linear scale (4, 8, 12, 16, 20, 24, 28 …): too many near-identical choices at the large end.
- Density by scaling everything with `zoom` or `transform`.
- Same radius on everything, including nested children: the inner corners look wrong.
- `border-radius: 9999px` on large rectangles (cards), which turns them into pills.
- Arbitrary values in utility classes (`p-[13px]`, `rounded-[10px]`).

## Good references
- [Carbon – Spacing](https://carbondesignsystem.com/elements/spacing/overview/) — a non-linear spacing scale with named steps and guidance on when to use each.
- [Atlassian – Spacing](https://atlassian.design/foundations/spacing) — spacing as tokens, applied by relationship (inside vs between).
- [WCAG 2.2 – Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — the 24px minimum and its spacing exception.

## Bad references
- Generated UIs where every card uses `p-6`, every gap `gap-6` and every corner `rounded-2xl` — uniform spacing removes grouping, so nothing reads as related.
- Bootstrap's spacer scale used for both layout and component internals, with half-steps added per project (`.mt-n2`, `.p-2-5`) — the extra steps are drift.

## Accessibility
- Spacing must survive the WCAG 1.4.12 text-spacing overrides: no fixed heights on text containers.
- Compact density keeps targets ≥ 24px (44px on touch), even when rows shrink.
- Focus rings need space: 2px outline + 2px offset fits inside a 4px gap without being clipped.

## Motion / interaction (if relevant)
- Don't animate padding or gaps on density switch; swap instantly.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--space-1…8` | 4, 8, 12, 16, 24, 32, 48, 64 px | all spacing |
| `--row-h` | 32 / 40 / 48 px | compact / comfortable / spacious |
| `--card-pad` | space-4 / space-5 / space-6 | same |
| `--grid-gap` | space-3 / space-4 / space-5 | same |
| `--radius-xs…xl` | base × 0.5, 0.75, 1, 1.5, 2 (base 8 → 4, 6, 8, 12, 16) | badges → dialogs |
| `--target-min` | 24px, 44px on coarse pointers | hit areas |

## Implementation sketch
```css
:root {
  --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  --radius-sm: 6px; --radius-lg: 12px;
  --card-pad: var(--space-5);
  --grid-gap: var(--space-4);
}
:root[data-density="compact"] { --card-pad: var(--space-4); --grid-gap: var(--space-3); }

.card {
  padding: var(--card-pad);
  border-radius: var(--radius-lg);
  display: grid;
  gap: var(--space-3);
}
/* concentric child corners: outer radius minus the padding, never below 2px */
.card > .thumb { border-radius: max(2px, calc(var(--radius-lg) - var(--card-pad))); }
.dashboard { display: grid; gap: var(--grid-gap); }
```

## Checklist
- [ ] Every padding, margin and gap uses a `--space-*` token or a density token.
- [ ] Gaps inside a group are at least one step smaller than gaps between groups.
- [ ] Density is set in one place and changes steps, not type size.
- [ ] The radius set comes from one base, and nested corners are concentric.
- [ ] Targets stay ≥ 24px (44px on touch) in compact density.
- [ ] No arbitrary pixel values in utility classes.

## Sources
- https://carbondesignsystem.com/elements/spacing/overview/
- https://atlassian.design/foundations/spacing
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- Repo: `found-layout-grid-spacing.md`, `found-density-modes.md`, `style-radius-scale.md` (dashboard-ui)
