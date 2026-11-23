# Generating dark mode

> Generate dark mode as its own theme from the same inputs: dark grey surfaces that get lighter as they rise, lighter and less saturated foregrounds, and contrast checked with APCA as well as WCAG 2, because WCAG 2 overstates contrast on dark backgrounds.

**Category:** Tokens · **Applies to:** every role in the dark theme and the dark high-contrast theme · **Priority:** must

## When to use / when not
- Use whenever the product ships a dark theme, follows the OS setting, or embeds in a host that can be dark (IDEs, chat clients, OS widgets).
- Don't ship dark mode as a filter (`filter: invert()`) or by flipping the light ramp. And don't ship it at all if you can't verify it: a broken dark theme is worse than none.

## Rules (do)
- **Surfaces: dark grey, not black, lighter = higher.** The default generator uses canvas L 0.18, surface 0.215, surface-2 0.25, surface-3 0.29 and sunken 0.165 (OKLCH). Material's dark theme guidance used `#121212` (OKLCH L ≈ 0.18) as the base and expressed elevation as lighter overlays; the same idea applies here.
- **Foregrounds: lighter and calmer.** Accent and status colours move up in lightness (light theme L ≈ 0.50 → dark L ≈ 0.72–0.80) and lose some chroma (the generator uses 0.76× for the accent; gamut mapping trims more at high L). Saturated colours at full chroma vibrate on dark grey.
- **Check APCA, not only WCAG 2.** WCAG 2 ratios are symmetric and overstate contrast for light text on dark. Computed for this pattern: the earlier dark-theme accent `oklch(0.72 0.13 265)` on surface-3 `oklch(0.29 0.01 250)` is 5.62:1 (passes WCAG) but only APCA Lc −48.7 (fails Lc 60 for readable text). The earlier dashboard-ui dark `--text-muted` (L 0.77) was 8.46:1 on surface but Lc −60.6, and Lc −57.8 on surface-3. `theme.mjs` therefore requires both, and at the default inputs moves dark `text-muted` to L 0.785 and the dark accent to L 0.785, the values dashboard-ui's `tokens.css` now ships.
- **Not an inversion.** Inverting the light text colour (L 0.22 → 0.78) gives Lc −62 on the dark surface: barely legal and visibly dimmer than intended. Dark body text sits at L ≈ 0.95 (Lc ≈ −96).
- **Borders get relatively stronger.** Dark `border-strong` is L 0.56 against surface 0.215 (≥ 3:1 on every surface). Shadows barely show on dark surfaces, so elevation comes from the surface step, with a border where needed.
- **Status backgrounds mix more.** The generator mixes 18% of the status foreground into the surface in dark (10% in light) so the tint is visible at all.
- **Ship light and dark from one run.** Both come from the same inputs, so a change to the accent or contrast updates both and both are verified.
- **Follow the OS, allow an override.** `prefers-color-scheme` plus `:root[data-theme="light|dark"]` (in DTCG exports the modes are sibling groups, `dstoken-dtcg-format.md`); set `color-scheme: light dark` so form controls and scrollbars match. `light-dark()` is a compact alternative for single values where the browser support suits the project.
- **Dark high contrast is a separate theme.** The generator runs dark at contrast 100 (text L 0.99, border-strong 0.64, text-muted 0.85) and emits it under `@media (prefers-contrast: more) and (prefers-color-scheme: dark)`.

## Anti-patterns (don't)
- `#000` canvas with `#fff` text: 21:1, Lc −108, harsh glare and halation for many readers, and no room for elevation below the base.
- Reusing light-theme accent and status colours on dark surfaces. Dark blue links on dark grey fail.
- Judging dark mode only by WCAG 2 ratios.
- Shadows as the only elevation cue in dark mode.
- Images and charts left in their light versions (white chart backgrounds in a dark dashboard).
- Mixing light and dark regions on one page (a white "card" in a dark app).

## Good references
- [Material Design – Dark theme (M2)](https://m2.material.io/design/color/dark-theme.html) — dark grey base, lighter surfaces for elevation, desaturated colours on dark.
- [Nielsen Norman Group – Dark mode vs. light mode](https://www.nngroup.com/articles/dark-mode/) — the research summary: light mode reads better for people with normal vision, so dark mode is a preference to support, not a default to impose.
- [APCA in a nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell) — the Lc levels (90/75/60/45/30/15) and why polarity matters.
- [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — separate light and dark scales with the same step jobs, rather than one reversed scale.

## Bad references
- `filter: invert(1) hue-rotate(180deg)` "dark modes" — they invert photos and brand marks too, and produce surfaces and accents nobody chose or checked.
- Dark themes that pass WCAG 2 on paper but use mid-blue links on dark grey (around Lc 45) — readable for some, tiring for many.

## Accessibility
- Thresholds used by the generator: body text WCAG 4.5:1 and |Lc| ≥ 75; other text 4.5:1 and |Lc| ≥ 60; non-text 3:1 and |Lc| ≥ 30. They apply to dark exactly as to light.
- Respect `prefers-contrast: more` in dark as well; it is a separate generated block.
- Never force dark on users (some people with astigmatism read light-on-dark worse); always provide the override.

## Motion / interaction (if relevant)
- Switching theme: swap tokens instantly or cross-fade colours in 150 ms or less. Avoid large brightness jumps animating across the whole screen.

## Tokens and values
| Role | Light (contrast 50) | Dark (contrast 50, after checks) | Why |
|---|---|---|---|
| `--surface` | oklch(1 0 0) | oklch(0.215 0.008 250) | dark grey, room for elevation |
| `--surface-3` | oklch(0.93 0.006 250) | oklch(0.29 0.01 250) | higher = lighter |
| `--text` | oklch(0.22 0.02 250) | oklch(0.95 0.006 250) | Lc ≈ −96 |
| `--text-muted` | oklch(0.5 0.016 250) | oklch(0.785 0.014 250) | moved from 0.77 to reach Lc 60 on surface-3 |
| `--accent` | oklch(0.5 0.17 265) | oklch(0.785 0.109 265) | moved from 0.72 for Lc 60; chroma gamut-mapped (tokens.css rounds it to 0.10) |
| `--danger-bg` mix | 10% | 18% | tint must stay visible |

## Implementation sketch
```css
:root {
  color-scheme: light dark;
  --surface: oklch(1 0 0);
  --text: oklch(0.22 0.02 250);
  --accent: oklch(0.5 0.17 265);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --surface: oklch(0.215 0.008 250);
    --text: oklch(0.95 0.006 250);
    --accent: oklch(0.785 0.109 265);
  }
}
:root[data-theme="dark"] {
  --surface: oklch(0.215 0.008 250);
  --text: oklch(0.95 0.006 250);
  --accent: oklch(0.785 0.109 265);
}
/* charts and images follow the theme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) img.diagram { filter: none; background: var(--surface); }
}
```

## Checklist
- [ ] Dark is generated from the same inputs as light, and the report shows 0 failures in `dark` and `dark-hc`.
- [ ] Every text pair passes both WCAG 2 and APCA in dark.
- [ ] No pure black canvas; surfaces get lighter as they rise.
- [ ] Accent and status colours are lighter and less saturated than in light.
- [ ] `color-scheme` is set, and a `data-theme` override exists.
- [ ] Charts, images and embeds have dark versions or neutral backgrounds.

## Sources
- https://m2.material.io/design/color/dark-theme.html
- https://www.nngroup.com/articles/dark-mode/
- https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell
- https://github.com/Myndex/apca-w3
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
- https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
- Repo: `color-dark-mode.md` (dashboard-ui); contrast figures computed with `scripts/theme.mjs`
