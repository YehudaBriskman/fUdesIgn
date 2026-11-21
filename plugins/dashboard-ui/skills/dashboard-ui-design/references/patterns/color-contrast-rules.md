# Contrast rules: text, UI and chart marks

> Text must meet WCAG 2.2 AA (4.5:1, or 3:1 for large text), and component boundaries, focus indicators, icons and chart marks must meet 3:1. Use APCA as a second check for dark themes and thin dashboard type, never in place of WCAG.

**Category:** Color and visual style · **Applies to:** all text, numbers, inputs, buttons, focus rings, icons, chart lines/bars/points, legends, gridlines, badges · **Priority:** must

## When to use / when not
- Always. Contrast is a legal baseline. EN 301 549 V3.2.1 (the EU route to conformity) and the 2024 ADA Title II rule cite WCAG 2.1 AA; EN 301 549 V4.1.1 (published 2 September 2026) moves to WCAG 2.2 AA; Section 508 cites WCAG 2.0 AA. ADA Title II compliance dates are 26 April 2027 (population 50,000 or more) and 26 April 2028 (smaller entities), after the 20 April 2026 interim final rule (91 FR 20902). Dates and scope: accessibility plugin `alaw-legal-landscape.md`. 1.4.3 is the same in 2.0, 2.1 and 2.2. 1.4.11 (non-text) arrived in 2.1.
- **Exempt (WCAG):** disabled controls, pure decoration, logos, text in photos, and "essential" encodings such as heatmaps where changing colour would change meaning. A chart is also exempt from 1.4.11 if its values are in text labels or an adjacent table.
- APCA was developed as a candidate for WCAG 3. It is **not** part of any conformance standard today, so use it only to catch dark-mode and thin-font failures that WCAG 2 math misses.

## Rules (do)
- **Body and UI text: ≥ 4.5:1** (WCAG 1.4.3 AA). That includes table numbers, axis tick labels, legend text, placeholder text and muted captions.
- **Large text: ≥ 3:1.** Large means ≥ 24 px regular or ≥ 18.66 px (14 pt) bold. A 32 px KPI number qualifies, but its 12 px label doesn't.
- **AAA / high-contrast theme: 7:1** for text (Primer's high-contrast themes target 7:1 for most text and interactive elements).
- **Non-text: ≥ 3:1** (WCAG 1.4.11) for:
  - input and control boundaries when the boundary is the only way to see the control (a borderless text field needs a 3:1 underline or border);
  - state indicators (checkmarks, toggle thumbs, selected tab underline);
  - focus indicators against adjacent colours;
  - icons that carry meaning without a text label;
  - every chart part "required to understand the content": each line, each bar, each pie slice against its neighbours.
- **Thresholds don't round.** W3C: "the computed values should not be rounded (e.g. 2.999:1 would not meet the 3:1 threshold)" (Understanding 1.4.11).
- **Test gradients and translucency at the worst point.** W3C: test the least-contrasting area of a gradient. For glass, test against the brightest and darkest content that can scroll underneath (see `style-glass-translucency.md`).
- **Hover-revealed graphics must already be 3:1 in their default state.** W3C: "the unfocused default version must already have sufficiently contrasting colors or text."
- **Focus ring:** ≥ 2 px solid outline, ≥ 3:1 against the adjacent background, with offset 2 px. WCAG 2.2 2.4.13 Focus Appearance (AAA) asks for an area at least that of a 2 CSS px perimeter and 3:1 change between focused and unfocused states. Treat it as the target.
- **APCA cross-check (Lc, absolute value):** body text ≥ Lc 75 (Lc 90 preferred), other readable text ≥ Lc 60, large or heavy headings ≥ Lc 45, placeholder/disabled ≥ Lc 30, discernible non-text ≥ Lc 15. APCA ties these to size: at weight 400, non-body text needs Lc 75 from 15 px and Lc 90 down to 12 px (APCA in a Nutshell). So 12–14 px dashboard labels need about Lc 90 to pass APCA.
- **Thin fonts raise the bar.** A 300-weight 12 px label at 4.5:1 is technically AA but fails APCA. Use weight ≥ 400 for text ≤ 14 px.
- **Gridlines are not "required" if tick labels carry the values.** Keep them intentionally low (≈ 1.3–1.6:1, APCA Lc 15+). Few rule #7: non-data components "should be displayed just visibly enough to perform their role". Axes that define the zero baseline should still be ≥ 3:1.
- **Muted text needs a floor.** `--text-muted` ≥ 4.5:1 on the *highest* surface it can appear on (popover, hover row, selected row), not only on white. The default passes: 4.9:1 light and 6.1:1 dark on `--surface-3`.
- **Check every role on every surface level.** In the default tokens, light `--border-strong` is 3.6:1 on `--surface` but 2.95:1 on `--surface-3`, and light `--warning-fg` is 4.8:1 on `--surface` but 4.4:1 on `--surface-2`. Don't put controls or warning text on those levels until the tokens are fixed (see Tokens and values).
- **Automate it.** Run axe-core/Lighthouse in CI on light and dark builds, plus a token-pair script that computes every declared fg/bg pair.

## Anti-patterns (don't)
- Grey-on-grey "elegant" secondary text (#999 on #fff = 2.85:1). It's a very common dashboard failure.
- 1 px `#e5e7eb` input borders as the only control boundary (≈ 1.2:1).
- Placeholder text as label in light grey (modern-web-guidance `accessibility.md`: placeholder contrast "is very low" and it disappears on input).
- Coloured text on coloured badge backgrounds that both come from mid-ramp (e.g. step 9 text on step 5 bg).
- Passing in light mode and assuming dark passes. WCAG 2 over-reports dark pairs (APCA docs), and Atlassian requires separate dark checks.
- Using `opacity: 0.5` to make text "secondary". Contrast then depends on whatever surface it lands on.
- Chart series below 3:1 on white drawn as 1 px lines (Tableau 10's orange #f28e2b is 2.4:1 and teal #76b7b2 is 2.3:1, computed).

## Good references
- [W3C – Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — exactly how to test charts: split graphics into parts, test each part against adjacent colours, ignore decorative shadows, exemption when data is also in text.
- [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell) — Lc table mapping contrast to font size and weight; explains why WCAG 2 is unreliable for dark mode.
- [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — contrast built into the scale: step 11 ≥ Lc 60, step 12 ≥ Lc 90 on step 2.
- [Stripe accessible colour system](https://stripe.com/blog/accessible-color-systems) — "5 levels apart ⇒ 4.5:1, 4 levels apart ⇒ 3:1" rule.
- [GitHub Primer](https://primer.style/foundations/color/overview) — neutral step 8 is the minimum for "interactive control borders against `bgColor-muted`", step 9 is the minimum for text on steps 0–4, and the high-contrast themes target "a minimum of 7:1 for most text and interactive elements".

## Bad references
- [Datawrapper – Colors for data-vis style guides](https://www.datawrapper.de/blog/colors-for-data-vis-style-guides) — of the palettes it reviewed, "most don't comply with the 3:1 rule", and a compliant gradient "would cover only half of the lightness range". That's the trade-off you must accept, not skip.
- [Stephen Few's traffic-light heatmap](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 2) — black numbers on dark red and dark green cells are least readable exactly where values matter most.
- [Tableau 10 default palette](https://www.tableau.com/blog/colors-upgrade-tableau-10-56782) — 5 of 10 colours are below 3:1 on white (orange 2.4, teal 2.3, yellow 1.6, pink 2.0, grey 2.1; computed from the published hex values). Fine for large labelled areas, a failure as thin unlabelled lines.

## Accessibility
This pattern is the accessibility rule set. Additional notes:
- Support `prefers-contrast: more`: shift `--border` to `--border-strong`, `--text-muted` to `--text`, and thicken focus rings to 3 px. modern-web-guidance: it reinforces colours that already pass, it doesn't fix a failing default.
- Forced-colors: author colours are replaced, and `box-shadow` focus rings vanish, so use `outline` (modern-web-guidance `accessibility.md`).
- Do not rely on colour alone (1.4.1), even when contrast passes.

## Motion / interaction (if relevant)
- Hover/pressed states must keep text ≥ 4.5:1 on the new background. Check states, not only rest.
- Skeleton shimmer and loading placeholders are exempt (decorative), but the "loading" message is not.

## Tokens and values
| Element | WCAG 2.2 minimum | APCA target (Lc) | Default token |
|---|---|---|---|
| Body/table text ≤ 16 px | 4.5:1 | 75 (90 preferred) | `--text` (17.3:1 light, 15.1:1 dark on `--surface`) |
| Secondary text, labels | 4.5:1 | 60 (90 at 12–14 px) | `--text-muted` (6.0:1 light, 7.6:1 dark; APCA Lc 80 light, Lc 55 dark) |
| Large KPI ≥ 24 px / ≥ 18.66 px bold | 3:1 | 45 | `--text` |
| Placeholder text | 4.5:1 | 30+ (but WCAG still 4.5) | `--text-muted` |
| Disabled text | exempt | 30 suggested | `--text-disabled` ≈ 2.5–3:1 |
| Input/control border (only boundary) | 3:1 | 15–30 | `--border-strong` (3.6:1 light, 3.75:1 dark on `--surface`) |
| Card/divider border (decorative) | none | 15 | `--border` (1.43:1 light, 1.55:1 dark) |
| Focus ring | 3:1, ≥ 2 px | — | `--accent`, 2 px + 2 px offset |
| Meaningful icon | 3:1 | 45 | `--text-muted` or role fg |
| Chart line/bar/point | 3:1 vs background (and between touching parts) | — | `--cat-*` |
| Gridline | none if labelled | 15 | `--border` |
| Zero baseline / axis | 3:1 | — | `--border-strong` |
| High-contrast theme text | 7:1 | 90 | — |

## Implementation sketch
```css
:root {
  --focus-ring: 2px solid var(--accent);
}
:focus-visible { outline: var(--focus-ring); outline-offset: 2px; }
input, select, textarea { border: 1px solid var(--border-strong); }
.chart .gridline { stroke: var(--border); stroke-width: 1; }
.chart .baseline { stroke: var(--border-strong); stroke-width: 1; }
.label-sm { font-size: 0.75rem; font-weight: 450; color: var(--text-muted); }
@media (prefers-contrast: more) {
  :root { --border: var(--border-strong); --text-muted: var(--text); --focus-ring: 3px solid var(--accent); }
}
@media (forced-colors: active) {
  :focus-visible { outline-color: Highlight; }
}
```
```ts
// Token-pair contrast check for CI (WCAG 2 relative luminance). Inputs are sRGB hex.
type Hex = `#${string}`;
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance(hex: Hex): number {
  const n = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
export function contrastRatio(a: Hex, b: Hex): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
export interface PairRule { fg: Hex; bg: Hex; min: 3 | 4.5 | 7; name: string }
export function failingPairs(rules: readonly PairRule[]): PairRule[] {
  return rules.filter((r) => contrastRatio(r.fg, r.bg) < r.min); // no rounding: 2.999 fails
}
```

## Checklist
- [ ] Every text token passes 4.5:1 on every surface it can appear on, in light, dark and high-contrast.
- [ ] Control boundaries, state indicators and focus rings are ≥ 3:1.
- [ ] Each chart series is ≥ 3:1 against the plot background, or values are labelled or tabulated.
- [ ] Text ≤ 14 px uses weight ≥ 400 and passes APCA Lc ≥ 60 (secondary) / 75 (body).
- [ ] Hover, selected and pressed states re-checked.
- [ ] CI runs axe on both themes plus a token-pair script.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://stripe.com/blog/accessible-color-systems
- https://primer.style/foundations/color/overview
- https://atlassian.design/foundations/elevation
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf
- modern-web-guidance: `guides/visual-design/color.md`, `guides/visual-design/contrast-color.md`, `guides/accessibility/accessibility.md`
