# Colour system architecture (ramps → roles → components)

> Build colour as three layers (raw OKLCH ramps, semantic role tokens, component usage) so that components never touch a raw colour and themes change only the middle layer.

**Category:** Color and visual style · **Applies to:** every surface, text, border, chart and status colour in a dashboard; theming; dark mode · **Priority:** must

## When to use / when not
- Use from day one of any dashboard that will have more than one screen, a dark mode, or a second brand. Retrofitting roles onto hard-coded hex values is the most common reason dark mode ships broken.
- A one-off internal page with five colours can skip the base layer and define roles directly, but still name colours by role (`--text-muted`), never by appearance (`--gray-500`).
- Not a substitute for a data-viz palette: chart series colours are a separate, parallel set of tokens (see `color-dataviz-palettes.md`).

## Rules (do)
- **Three tiers, one direction of reference.** Base tokens (`--gray-0…13`, `--blue-1…12`) are referenced only by role tokens; role tokens (`--surface`, `--text`, `--border-strong`, `--danger-fg`) are referenced by components. GitHub Primer states base tokens "should never be used directly in code or design".
- **Neutral ramp: 12–14 steps, each step with a job.** Radix Colors' 12-step scale is the clearest contract: 1–2 app and subtle backgrounds, 3–5 component background normal/hover/pressed, 6–8 borders (subtle, interactive, strong/focus), 9–10 solid fills and their hover, 11 low-contrast text, 12 high-contrast text. Vercel Geist uses the same idea in 10 steps (100–300 backgrounds, 400–600 borders, 700–800 high-contrast fills, 900–1000 text).
- **Guarantee contrast by step distance, not by eyeballing.** Stripe's rebuilt palette guarantees that any two colours ≥ 5 levels apart pass 4.5:1 (small text) and ≥ 4 levels apart pass 3:1 (icons and large text). Radix guarantees step 11 on step 2 ≥ APCA Lc 60 and step 12 on step 2 ≥ Lc 90. Write your own equivalent rule down and test it in CI.
- **Author ramps in OKLCH.** Keep hue and chroma roughly fixed and step L. OKLCH lightness is perceptual, so `L 0.50` blue and `L 0.50` yellow look equally light; HSL `l: 50%` does not (Stripe: in HSL "yellows appear lighter and blues darker"). Tailwind v4 moved its whole default palette to `oklch()` for this reason and for P3 gamut.
- **Tint neutrals slightly.** Chroma 0.003–0.02 toward the brand hue (cool blue-grey for most finance/SaaS). Pure `#808080` greys read dead next to a coloured brand. Datawrapper's style-guide advice is the same for chart greys: a slight warm or cool tint, low saturation.
- **Semantic roles, each with fg / bg-muted / bg-emphasis / border.** Primer gives every role (`accent`, `success`, `attention`, `danger`, `done`, …) a foreground, a muted background and an emphasis background, with `fgColor-onEmphasis` always paired on emphasis. Material 3 does the same with `primary / onPrimary / primaryContainer / onPrimaryContainer`.
- **Always pair "on-" colours.** Every background role has a declared foreground role. Material's own example of a bad button is `tertiaryContainer` background with `primaryContainer` text: two legal tokens, illegal pairing.
- **Keep the brand hue out of the chrome.** Linear's 2024 redesign limited how much of the accent hue feeds into surface calculations "for a more neutral, timeless look". Brand colour = primary action, focus ring, selected state, logo. Not panel backgrounds.
- **Generate from few inputs.** Linear reduced each theme from 98 hand-set variables to 3 inputs (base colour, accent colour, contrast). A contrast input of 30 → 100 yields a high-contrast theme for free. Aim for a generator, not a spreadsheet.
- **Keep sRGB-safe defaults.** Provide an in-gamut sRGB value and put wider P3 chroma in `@media (color-gamut: p3)` (Evil Martians). Browsers clip out-of-gamut OKLCH, which can shift hue.

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
- [Stripe's previous palette, as described by Stripe](https://stripe.com/blog/accessible-color-systems) — almost no default text colours passed 4.5:1; darkening each to pass made hues "dark and muddy". The cause was a palette hand-picked in a non-perceptual space.
- [Evil Martians – OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) — documents the HSL failure: "+10% lightness" produces different perceived jumps for blue and purple, and LCH drifts blue toward purple as chroma changes.
- Typical admin templates with `--primary`, `--secondary`, `--success`, `--info`, `--light`, `--dark` (Bootstrap 4-style) — `light` and `dark` are appearance names, and there is no foreground pairing, so `text-warning` on white fails contrast (yellow ~1.6:1).

## Accessibility
- Encode contrast guarantees in the system (see Rules) and test every role pair in both themes: text on each surface level, `-fg` on `-bg-muted`, `on-emphasis` on `-bg-emphasis`.
- Provide a `prefers-contrast: more` variant by shifting role mappings along the ramp (Primer's high-contrast theme uses steps 10 for borders and 11–13 for text, targeting 7:1).
- Map roles to system colours under `@media (forced-colors: active)` (`Canvas`, `CanvasText`, `GrayText`, `Highlight`, `LinkText`).

## Motion / interaction (if relevant)
- Hover/pressed are ramp steps (Radix 3→4→5, 9→10), not opacity hacks; this keeps state colours inside the contrast guarantees.
- Don't transition theme colours on toggle for more than ~150 ms; long cross-fades make the whole dashboard shimmer.

## Tokens and values
| Role | Light (OKLCH → hex) | Dark (OKLCH → hex) | Notes |
|---|---|---|---|
| `--canvas` | 0.985 0.003 250 → #f9fafc | 0.18 0.006 250 → #101214 | page behind cards |
| `--surface` | 1 0 0 → #ffffff | 0.215 0.008 250 → #171a1d | cards, panels |
| `--surface-2` | 0.97 0.004 250 → #f3f5f8 | 0.25 0.009 250 → #1e2226 | raised / hover row |
| `--surface-3` | 0.93 0.006 250 → #e5e8ec | 0.29 0.010 250 → #282c30 | popovers, menus (dark) |
| `--border` (decorative) | 0.88 0.008 250 → #d4d8dd | 0.35 0.012 250 → #363b41 | ~1.5:1, separators only |
| `--border-strong` (controls) | 0.62 0.012 250 → #81878d (3.6:1) | 0.56 0.014 250 → #6e757d (3.8:1) | inputs, chart axes |
| `--text-muted` | 0.50 0.016 250 → #5d646c (6.0:1) | 0.74 0.014 250 → #a4acb4 (7.6:1) | labels, captions |
| `--text` | 0.22 0.02 250 → #141b24 (17.3:1) | 0.95 0.006 250 → #ebeff2 (16.3:1) | body, numbers |
| `--accent` (brand) | 0.50 0.17 265 → #325ac2 (6.2:1) | 0.72 0.13 265 → #7ca2f6 (7.4:1) | primary action, focus |
Contrast figures are WCAG 2 ratios against `--surface`, computed for this file.

## Implementation sketch
```css
:root {
  color-scheme: light dark;
  /* Tier 1: base ramp (never used by components) */
  --gray-l-0: oklch(1 0 0);           --gray-d-0: oklch(0.215 0.008 250);
  --gray-l-12: oklch(0.22 0.02 250);  --gray-d-12: oklch(0.95 0.006 250);
  --blue-l-9: oklch(0.50 0.17 265);   --blue-d-9: oklch(0.72 0.13 265);

  /* Tier 2: role tokens (theme lives here) */
  --surface: light-dark(var(--gray-l-0), var(--gray-d-0));
  --text: light-dark(var(--gray-l-12), var(--gray-d-12));
  --text-muted: light-dark(oklch(0.50 0.016 250), oklch(0.74 0.014 250));
  --border: light-dark(oklch(0.88 0.008 250), oklch(0.35 0.012 250));
  --border-strong: light-dark(oklch(0.62 0.012 250), oklch(0.56 0.014 250));
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
