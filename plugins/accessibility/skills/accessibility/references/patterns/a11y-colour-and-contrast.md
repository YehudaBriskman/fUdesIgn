# Colour and contrast: the cross-UI checks

> Meet 4.5:1 for text (3:1 for large text), 3:1 for component boundaries, focus rings, icons and chart marks, and never use colour as the only way to convey meaning; dashboard-ui `color-contrast-rules.md` owns the numbers and the APCA second check, and this file only routes and adds the audit steps.

**Category:** Build · **Applies to:** text, controls, states, links in text, icons, charts, images of text, themes · **Priority:** must

## When to use / when not
- **Use** as the audit entry for 1.4.1, 1.4.3, 1.4.11 and 1.4.5 on any UI type. For the rules themselves, open the owner file instead of repeating them here:
  - text, UI and chart contrast, APCA → dashboard-ui `color-contrast-rules.md`;
  - status colours → dashboard-ui `color-semantic-status.md`; dark themes → `color-dark-mode.md`;
  - chart palettes and non-colour encodings → `color-dataviz-palettes.md`, `chart-accessibility.md`;
  - generated themes that verify WCAG and APCA → design-system `dstoken-dark-mode-generation.md`;
  - text over images and gradients → marketing-ui `mkfound-accessibility-floor.md`.
- **Not** for forced-colours behaviour, which overrides author colours entirely: `a11y-forced-colours-high-contrast.md`.

## Rules (do)
- **1.4.3 Contrast (Minimum), AA:** text and images of text ≥ 4.5:1; large text (≥ 24 px regular or ≥ 18.66 px bold) ≥ 3:1. Disabled controls and pure decoration are exempt; placeholder text is not.
- **1.4.11 Non-text Contrast, AA:** visual information needed to identify controls and their states (borders of inputs, checkbox outlines, focus rings, selected-tab indicators, toggle positions) and meaningful graphics (icons, chart lines and bars) ≥ 3:1 against adjacent colours.
- **1.4.1 Use of Color, A:** colour is never the only cue. Links in body text are underlined (or have 3:1 against surrounding text plus a non-colour cue on hover and focus); errors have text and an icon; chart series have labels or shapes; required fields have a word, not only a red asterisk colour.
- **1.4.5 Images of Text, AA:** use real text styled with CSS, except logos.
- **Measure the worst case:** text on gradients, images and translucent surfaces is measured against the lightest (or darkest) pixel behind it; every theme (light, dark, high contrast) and every state (hover, selected, disabled-but-informative) is measured separately.
- **Tools:** browser DevTools contrast picker, axe (`color-contrast` rule, which skips text over images and gradients), and the design-system plugin's `scripts/theme.mjs` for token pairs.

## Anti-patterns (don't)
- Grey placeholder at 2.5:1 used as the field's only label.
- Input borders at about 1.5:1 that vanish on tinted surfaces.
- Red/green as the only difference between profit and loss, pass and fail.
- Links distinguished from text only by a slightly different blue.
- Contrast checked in light mode only.
- Trusting an automated pass on text over hero images (axe marks it "needs review", not pass).

## Good references
- [W3C — Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — the ratios, large-text thresholds and exemptions.
- [W3C — Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — which parts of controls and graphics must reach 3:1, with examples.
- [W3C — Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — links in text and the 3:1 + non-colour cue technique.
- [modern-web-guidance — Color](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/color.md) — contrast minimums, light/dark schemes and forced colours in one guide.

## Bad references
- Light-grey-on-white "minimal" UI kits whose secondary text sits near 3:1 and whose input borders sit near 1.3:1.
- Status dashboards that encode every state as a coloured dot with no label (see dashboard-ui `ref-dashboard-anti-patterns.md`).

## Accessibility
- Also test with a greyscale filter (DevTools rendering emulation: achromatopsia) to spot colour-only meaning, and in forced colours.

## Motion / interaction (if relevant)
- Hover and focus states that only shift hue fail 1.4.1 for colour-blind users; add an underline, outline or icon change.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Body text | ≥ 4.5:1 | 1.4.3 |
| Large text (≥ 24px, or ≥ 18.66px bold) | ≥ 3:1 | 1.4.3 |
| UI boundaries, focus, icons, chart marks | ≥ 3:1 | 1.4.11 |
| `--border-strong` / `--border` | ≥ 3:1 / decorative only | dashboard-ui tokens |

## Implementation sketch
The WCAG 2 contrast ratio for two sRGB colours, for quick checks in tests (the theme generator in the design-system plugin does the full job).
```ts
type Rgb = readonly [number, number, number]  // 0–255

const channel = (c: number): number => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = ([r, g, b]: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
// contrastRatio([118, 118, 118], [255, 255, 255]) ≈ 4.54, the lightest grey that passes on white
```
```css
.prose a { color: var(--accent); text-decoration: underline; text-underline-offset: 0.15em; }
```

## Checklist
- [ ] Text ≥ 4.5:1 (large ≥ 3:1) in every theme and state, worst pixel behind it.
- [ ] Control boundaries, focus rings, icons and chart marks ≥ 3:1.
- [ ] Nothing relies on colour alone: links, errors, required, status, series.
- [ ] No images of text except logos.
- [ ] Domain-specific contrast rules checked in their owner files.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
- https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/color.md (Apache-2.0, linked, not copied)
