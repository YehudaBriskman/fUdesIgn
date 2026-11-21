# Colour system architecture (ramps → roles → components)

> Build colour as three layers (raw OKLCH ramps, semantic role tokens, component usage) so that components never touch a raw colour and themes change only the middle layer.

**Category:** Color and visual style · **Applies to:** every surface, text, border, chart and status colour in a dashboard; theming; dark mode · **Priority:** must

## When to use / when not
- Use from day one of any dashboard that will have more than one screen, a dark mode, or a second brand. Retrofitting roles onto hard-coded hex values is the most common reason dark mode ships broken.
- A one-off internal page with five colours can skip the base layer and define roles directly, but still name colours by role (`--text-muted`), never by appearance (`--gray-500`).
- Not a substitute for a data-viz palette: chart series colours are a separate, parallel set of tokens (see `color-dataviz-palettes.md`).

## Rules (do)
- **Three tiers, one direction of reference.** Base tokens (`--gray-0…13`, `--blue-1…12`) are referenced only by role tokens; role tokens (`--surface`, `--text`, `--border-strong`, `--danger-fg`) are referenced by components. GitHub Primer states base tokens "should never be used directly in code or design".
- **Neutral ramp: 12–14 steps, each step with a job.** Radix Colors' 12-step scale is the clearest contract: 1–2 app and subtle backgrounds, 3–5 UI element background normal/hover/active, 6 subtle borders, 7 element borders and focus rings, 8 hovered borders, 9–10 solid fills and their hover, 11 low-contrast text, 12 high-contrast text. Vercel Geist uses the same idea in 10 steps (100–300 default/hover/active background, 400–600 default/hover/active border, 700–800 high-contrast background and its hover, 900 secondary text, 1000 primary text).
- **Guarantee contrast by step distance, not by eyeballing.** Stripe: "Any two colors are guaranteed to have sufficient contrast for small text if they are at least five levels apart", and four levels apart for icons and large text (4.5:1 and 3:1). Radix guarantees step 11 on step 2 ≥ APCA Lc 60 and step 12 on step 2 ≥ Lc 90. Write your own equivalent rule down and test it in CI.
- **Author ramps in OKLCH.** Keep hue and chroma roughly fixed and step L. OKLCH lightness is perceptual, so `L 0.50` blue and `L 0.50` yellow look about equally light; HSL `l: 50%` does not (Stripe: in HSL "the blues appear especially dark and the yellows and greens appear especially light"). Tailwind v4 "upgraded the entire default color palette from `rgb` to `oklch`", mainly to use the wider P3 gamut.
- **Tint neutrals slightly.** Chroma 0.003–0.02 toward the brand hue (cool blue-grey for most finance/SaaS). Pure `#808080` greys read dead next to a coloured brand. Datawrapper gives the same advice for chart greys: mix in a little yellow/orange/red or blue, but "Make sure your grays don't come with too much saturation."
- **Semantic roles, each with fg / bg (muted) / emphasis / border.** Primer gives every role (`accent`, `success`, `attention`, `danger`, `done`, …) a foreground, a muted and an emphasis background and border, with emphasis backgrounds "always paired with `fgColor-onEmphasis`". tokens.css ships the fg and muted bg (`--danger-fg`, `--danger-bg`). Material 3 does the same with `primary / onPrimary / primaryContainer / onPrimaryContainer`.
- **Always pair "on-" colours.** Every background role has a declared foreground role. Material's own example of a poor-contrast button is a `tertiaryContainer` background with `primaryContainer` text (Compose Material 3 docs): two legal tokens, illegal pairing.
- **Keep the brand hue out of the chrome.** Linear's 2024 redesign limited how much accent blue fed into its colour calculations for "a more neutral and timeless appearance". Brand colour = primary action, focus ring, selected state, logo. Not panel backgrounds.
- **Generate from few inputs.** Linear replaced "98 specific variables for each theme" with 3 inputs (base colour, accent colour, contrast), generated in LCH. Its article shows contrast 30 next to contrast 100, so a high-contrast theme comes from one input. Aim for a generator, not a spreadsheet.
- **Keep sRGB-safe defaults.** Provide an in-gamut sRGB value and put wider P3 chroma in `@media (color-gamut: p3)` (Evil Martians). Evil Martians: "Chrome and Safari use the fast, but inaccurate, clipping method", which can shift hue. All role values in tokens.css are in sRGB gamut.

## Anti-patterns (don't)
- Components referencing `--blue-600` or `#2563eb` directly. Dark mode then needs per-component overrides.
- Naming by appearance (`--light-gray`, `--red`). When dark mode flips lightness, "light gray" is dark.
- Generating tints by setting OKLCH L directly (`oklch(from var(--primary) 0.9 c h)`): modern-web-guidance notes browsers do not gamut-map yet, so results are unpredictable. Use `color-mix(in oklab, …)` or predefined steps.
- Mixing neutrals `in oklch`: a Chromium bug resolves the powerless hue of low-chroma colours to 0° and tints greys pink (modern-web-guidance `visual-effects.md`).
- One-off hex values in a component "just for this card". Every exception becomes a dark-mode bug.
- Registering design tokens with `@property { syntax: '<color>'; inherits: true }`: they resolve once and stop following `light-dark()` in subtrees.

## Good references
- [Radix Colors – Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — every step has a single declared job, with APCA guarantees for the text steps. Best public model for a neutral ramp.
- [Stripe – Designing accessible color systems](https://stripe.com/blog/accessible-color-systems) — perceptual (Lab) tuning so every hue has the same contrast per level; the "5 levels apart = 4.5:1" rule makes contrast a property of the system, not of each design.
- [GitHub Primer – Color overview](https://primer.style/foundations/color/overview) — base vs functional vs component tokens; neutral scale where light and dark run in opposite directions so functional tokens are shared.
- [Linear – How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — LCH theme generator, 3 inputs instead of 98, deliberately reduced accent in chrome.
- [Vercel Geist – Colors](https://vercel.com/geist/colors) — 10 scales × 10 steps with step ranges mapped to backgrounds, borders, fills, text; a compact model for a dev-tool dashboard.
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) — full default palette in OKLCH, opacity via `color-mix(in oklab, …)`.

## Bad references
- [Stripe's previous palette, as described by Stripe](https://stripe.com/blog/accessible-color-systems) — none of the default small-text colours except black passed; darkening them to pass made them "dark and muddy and it's difficult to tell the hues apart". The cause was a palette hand-picked in a non-perceptual space.
- [Evil Martians – OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) — documents the HSL failure ("Adding 10% lightness will have different results for blue and purple colors") and LCH's "unexpected hue shift on chroma and lightness changes in blue colors".
- Typical admin templates with `--primary`, `--secondary`, `--success`, `--info`, `--light`, `--dark` (Bootstrap 4-style) — `light` and `dark` are appearance names, and there is no foreground pairing, so `text-warning` on white fails contrast (Bootstrap 4 `#ffc107` is 1.6:1, computed).

## Accessibility
- Encode contrast guarantees in the system (see Rules) and test every role pair in both themes: text on each surface level, `-fg` on `-bg-muted`, `on-emphasis` on `-bg-emphasis`.
- Provide a `prefers-contrast: more` variant by shifting role mappings along the ramp (Primer's light high-contrast theme uses step 10 for borders and 11–13 for text, targeting "a minimum of 7:1 for most text and interactive elements").
- Map roles to system colours under `@media (forced-colors: active)` (`Canvas`, `CanvasText`, `GrayText`, `Highlight`, `LinkText`).

## Motion / interaction (if relevant)
- Hover/pressed are ramp steps (Radix 3→4→5, 9→10), not opacity hacks; this keeps state colours inside the contrast guarantees.
- Don't transition theme colours on toggle for more than ~150 ms; long cross-fades make the whole dashboard shimmer.

## Tokens and values
| Role | Light (OKLCH → hex) | Dark (OKLCH → hex) | Notes |
|---|---|---|---|
| `--canvas` | 0.985 0.003 250 → #f9fafc | 0.18 0.006 250 → #101214 | page behind cards (1.04:1 / 1.07:1 vs surface) |
| `--surface` | 1 0 0 → #ffffff | 0.215 0.008 250 → #171a1d | cards, panels |
| `--surface-2` | 0.97 0.004 250 → #f3f5f8 | 0.25 0.009 250 → #1e2226 | raised / hover row |
| `--surface-3` | 0.93 0.006 250 → #e5e8ec | 0.29 0.010 250 → #282c30 | popovers, menus (dark), pressed |
| `--border` (decorative) | 0.88 0.008 250 → #d4d8dd (1.43:1) | 0.35 0.012 250 → #363b41 (1.55:1) | separators only |
| `--border-strong` (controls) | 0.60 0.012 250 → #7b8187 (3.9:1; 3.2:1 on surface-3) | 0.56 0.014 250 → #6e757d (3.75:1; 3.02:1 on surface-3) | inputs, chart axes |
| `--text-muted` | 0.50 0.016 250 → #5d646c (6.0:1) | 0.785 0.014 250 → #b2bac2 (8.9:1; APCA Lc 60 on surface-3) | labels, captions |
| `--text` | 0.22 0.02 250 → #141b24 (17.3:1) | 0.95 0.006 250 → #ebeff2 (15.1:1) | body, numbers |
| `--accent` (brand) | 0.50 0.17 265 → #325ac2 (6.2:1) | 0.785 0.10 265 → #9ab8fa (8.8:1; APCA Lc 60 on surface-3) | primary action, focus |
| `--on-accent` | white (6.2:1 on accent) | 0.18 0.006 250 → #101214 (9.5:1 on accent) | text on filled accent |
Contrast figures are WCAG 2 ratios against `--surface` unless noted, computed for this file. tokens.css is canonical, and these rows match it.

## Implementation sketch
```css
:root {
  color-scheme: light dark;
  /* Tier 1: base ramp (never used by components) */
  --gray-l-0: oklch(1 0 0);           --gray-d-0: oklch(0.215 0.008 250);
  --gray-l-12: oklch(0.22 0.02 250);  --gray-d-12: oklch(0.95 0.006 250);
  --blue-l-9: oklch(0.50 0.17 265);   --blue-d-9: oklch(0.785 0.10 265);

  /* Tier 2: role tokens (theme lives here) */
  --surface: light-dark(var(--gray-l-0), var(--gray-d-0));
  --text: light-dark(var(--gray-l-12), var(--gray-d-12));
  --text-muted: light-dark(oklch(0.50 0.016 250), oklch(0.785 0.014 250));
  --border: light-dark(oklch(0.88 0.008 250), oklch(0.35 0.012 250));
  --border-strong: light-dark(oklch(0.60 0.012 250), oklch(0.56 0.014 250));
  --accent: light-dark(var(--blue-l-9), var(--blue-d-9));
  --on-accent: light-dark(white, oklch(0.18 0.006 250));
  /* Derived state via color-mix in oklab, never oklch for neutrals */
  --accent-hover: color-mix(in oklab, var(--accent), var(--text) 12%);
}
@media (prefers-color-scheme: dark) { /* fallback for pre-light-dark() browsers if needed */ }
@media (forced-colors: active) {
  :root { --surface: Canvas; --text: CanvasText; --border-strong: CanvasText; --accent: Highlight; }
}
/* Tier 3: components only see roles */
.button-primary { background: var(--accent); color: var(--on-accent); }
.card { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
```

## Checklist
- [ ] No component stylesheet contains a hex/rgb/oklch literal; grep for `#[0-9a-f]{3,6}` outside the token file returns nothing.
- [ ] Every background role has a named foreground role, and each pair is contrast-tested in light, dark and high-contrast.
- [ ] Neutral ramp has 10–14 steps with a documented job per step.
- [ ] A written "N steps apart ⇒ X:1" rule exists and is verified by a script.
- [ ] Brand hue appears only on actions, focus, selection and the logo.
- [ ] Forced-colors mapping exists for surface, text, border and accent.
- [ ] P3 colours are wrapped in `@media (color-gamut: p3)` with sRGB defaults.

## Sources
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://stripe.com/blog/accessible-color-systems
- https://primer.style/foundations/color/overview
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://vercel.com/geist/colors
- https://tailwindcss.com/blog/tailwindcss-v4
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- https://www.smashingmagazine.com/2023/08/oklch-color-spaces-gamuts-css/
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- modern-web-guidance: `guides/visual-design/color.md`, `guides/visual-design/dark-mode.md`, `guides/visual-design/visual-effects.md`, `guides/ui-atoms/component-specific-light-dark-theme.md`, `guides/css/design-token-reactivity.md`
