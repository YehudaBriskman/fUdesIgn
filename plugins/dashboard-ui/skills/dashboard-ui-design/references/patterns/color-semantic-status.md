# Semantic status and money colours

> Status colours (danger, warning, success, info) and money colours (positive, negative) are separate token sets, never the only cue, and for money they must be locale- and preference-aware.

**Category:** Color and visual style · **Applies to:** badges, alerts, toasts, KPI deltas, P&L tables, price tickers, health indicators, form validation · **Priority:** must

## When to use / when not
- Use status colour when the user must **act** or **triage**: failed job, breached threshold, overdue invoice. Carbon: skip indicators "when no action is needed or the status isn't significant. Use plain text instead."
- Use money colour (positive/negative) for **direction of change** of a value: deltas, returns, P&L. Direction is not judgement: a rise in costs is "up" but bad.
- Don't colour every number in a table green or red. Colour the delta column or the sign, not the whole row (see `color-minimal-usage.md`).
- Don't use status colours for categories in charts. Red series in a chart reads as "bad" (Carbon reserves alert colours for alerts).

## Rules (do)
- **Fixed meanings, documented.** Carbon's status set: red = danger/error, orange = serious warning, yellow = regular warning, green = success/normal, blue = info/in progress, gray = draft/not started, purple = outlier/undefined. Pick a subset (4–5) and never reuse those hues decoratively.
- **Roll-ups take the worst status.** A group of green + yellow + red is red (Carbon).
- **Never colour alone (WCAG 1.4.1).** Pair colour with at least one of icon, shape or text. Carbon's status pattern requires shape + icon + colour + label for icon indicators; its differential indicator must include `+`/`−`, a caret or an arrow, with colour optional.
- **Money deltas: sign + arrow + colour.** Render `▲ +2.4%` / `▼ −1.1%`. Use the true minus sign U+2212, not a hyphen, and keep tabular numerals so signs align.
- **Separate the tokens:** `--positive` / `--negative` (direction) are distinct from `--success` / `--danger` (status), even if the default hues match. That lets a locale or user swap money colours without turning error banners green.
- **Respect market convention.** Mainland China, Taiwan, Japan and Korea quote rising prices in red and falling in green; Hong Kong TV uses the Western scheme. Brokers (e.g. Webull HK) expose an "up/down colour" setting. For a finance product, default by locale and offer a setting: "Green up / red down" vs "Red up / green down".
- **Offer a colour-blind-safe alternative.** About 8% of men and 0.5% of women have a colour-vision deficiency, mostly red–green. Few's rule #8: avoid red and green together; use blue/red or blue/orange. Datawrapper: "many organizations use blue for positive and red for negative". Ship a "blue / orange" option in settings.
- **If you keep red/green, separate them by lightness.** Make the green noticeably darker or lighter than the red (≥ 15 OKLCH L points) so they differ in greyscale, and keep the arrow.
- **Each role has fg, muted bg, emphasis bg, border.** Text uses `-fg` on surface (≥ 4.5:1). Badges use `-fg` on `-bg-muted`. Solid banners use `on-emphasis` on `-bg-emphasis`. Status icons need ≥ 3:1 against the background (Carbon, WCAG 1.4.11).
- **Yellow never carries text on white.** Yellow fills need dark text, and yellow as a foreground needs a darkened amber (~L 0.55). Carbon notes light orange and yellow shapes need outlines in light themes.
- **Cap visible indicators.** More than 5–6 status indicators in one view overwhelms (Carbon).

## Anti-patterns (don't)
- Red/amber/green "traffic light" cells as the only encoding. All three are equally saturated, so nothing ranks above anything else, and red/green collapse for deuteranopes (Few's heatmap example, Stacey Barr, Grafana's dashboard tips).
- Colouring neutral metrics red/green (e.g. "number of tickets" green because it went up). Red/green imply good/bad; insightsoftware calls this out as a common dashboard mistake.
- Whole-row red backgrounds for negative P&L. Saturated fills under numbers cut contrast and turn the table into a heatmap nobody asked for.
- Using `--danger` for a destructive *button* and also for a chart series. The user can't tell "error" from "category 3".
- Pure `#ff0000` text on dark backgrounds. Deep red looks nearly black to protanopes (Okabe & Ito), and saturated red vibrates on dark.
- Hyphen-minus `-` for negatives in proportional fonts: misaligned columns and easy to miss.

## Good references
- [IBM Carbon – Status indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/) — explicit colour meanings, worst-status roll-up, differential indicator rule (sign or arrow mandatory, colour optional), 3:1 requirement, limit of 5–6 indicators.
- [GitHub Primer – Color](https://primer.style/foundations/color/overview) — every semantic role has fg / muted / emphasis / border tokens, with fg tested against both muted and default backgrounds.
- [Datawrapper – Colorblindness, part 2](https://www.datawrapper.de/blog/colorblindness-part2/) — "Blue is the safest hue"; pair blue with orange or red; vary lightness; label directly.
- [Stephen Few – Practical Rules for Using Color in Charts](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) — rule #8, avoid red + green in one display; blue/red as the substitute for positive/negative heatmaps.
- [Benzinga – red/green in Asian markets](https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan) and [Webull HK FAQ](https://www.webull.hk/en/help/faq/1143-What-s-the-meaning-behind-diff) — evidence that colour direction is locale-dependent and that brokers make it a setting.

## Bad references
- [Few's Excel traffic-light heatmap](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 2) — green/yellow/red cells: the most important values (dark red, dark green) are the least readable because black text sits on dark fills.
- [Grafana – 3 tips to improve dashboard design](https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design) — critiques dashboards where everything is coloured: "a colorful dashboard leaves users unsure where to look"; calls out red-next-to-green and red-on-black.
- [insightsoftware – dashboard design questions](https://insightsoftware.com/blog/3-questions-to-guide-dashboard-design/) — red/green applied to metrics with no good/bad meaning creates false judgement.

## Accessibility
- WCAG 1.4.1 Use of Color: status and direction need a non-colour cue (icon, sign, text).
- WCAG 1.4.3: status text ≥ 4.5:1 on its background. WCAG 1.4.11: status icons and shapes ≥ 3:1.
- Give screen readers the meaning: `<span class="visually-hidden">down</span>` or `aria-label="down 1.1 percent"` on delta chips; announce new errors through a live region (modern-web-guidance `accessible-error-announcement.md`).
- In forced-colors mode the colour disappears, so the icon and sign must carry meaning alone.

## Motion / interaction (if relevant)
- Price "flash" on tick (background pulse green/red): ≤ 600 ms, opacity only, at most once per value change, and disabled under `prefers-reduced-motion: reduce`. Never flash more than 3 times per second (WCAG 2.3.1).
- Don't animate status colour changes slowly; a 2 s fade from green to red hides the moment of change.

## Tokens and values
| Token | Light | Dark | Contrast vs surface |
|---|---|---|---|
| `--danger-fg` | oklch(0.53 0.19 27) #c22826 | oklch(0.72 0.16 25) #f97770 | 5.8 / 6.9 |
| `--warning-fg` | oklch(0.56 0.12 65) #a46311 | oklch(0.82 0.14 80) #f3b94c | 4.8 / 10.4 |
| `--success-fg` | oklch(0.52 0.13 150) #1d7d3e | oklch(0.76 0.15 150) #61cb7c | 5.2 / 9.1 |
| `--info-fg` | oklch(0.52 0.14 250) #116bb5 | oklch(0.74 0.12 250) #6db0f4 | 5.5 / 8.1 |
| `--{role}-bg-muted` | `color-mix(in oklab, var(--{role}-fg) 10%, var(--surface))` | same, 18% | badge background |
| `--positive` / `--negative` | default = success-fg / danger-fg | same | swappable by locale/setting |
| `--positive` (CVD option) | oklch(0.52 0.14 250) blue | oklch(0.74 0.12 250) | 5.5 / 8.1 |
| `--negative` (CVD option) | oklch(0.58 0.15 48) #bf5914 | oklch(0.78 0.14 55) #fb9d59 | 4.5 / 8.4 |
| Status icon size | 16 px inline, 20 px in banners | | ≥ 3:1 |
| Max indicators in view | 5–6 | | Carbon |

## Implementation sketch
```html
<td class="num">
  <span class="delta" data-direction="down">
    <svg aria-hidden="true" class="delta-icon"><use href="#caret-down"/></svg>
    <span class="visually-hidden">down</span>&minus;1.1%
  </span>
</td>
```
```css
:root {
  --positive: var(--success-fg);
  --negative: var(--danger-fg);
}
/* Locale / user setting: red-up markets */
:root[data-market-colors="red-up"] { --positive: var(--danger-fg); --negative: var(--success-fg); }
/* Colour-vision-friendly option */
:root[data-market-colors="blue-orange"] {
  --positive: light-dark(oklch(0.52 0.14 250), oklch(0.74 0.12 250));
  --negative: light-dark(oklch(0.58 0.15 48), oklch(0.78 0.14 55));
}
.num { font-variant-numeric: tabular-nums; text-align: end; }
.delta { display: inline-flex; gap: 0.25em; align-items: center; font-weight: 500; }
.delta[data-direction="up"] { color: var(--positive); }
.delta[data-direction="down"] { color: var(--negative); }
.delta-icon { inline-size: 0.75em; block-size: 0.75em; fill: currentColor; }
.badge-danger {
  color: var(--danger-fg);
  background: color-mix(in oklab, var(--danger-fg) 10%, var(--surface));
  border: 1px solid color-mix(in oklab, var(--danger-fg) 35%, var(--surface));
}
```
```ts
type Direction = "up" | "down" | "flat";
export function deltaDirection(value: number, epsilon = 1e-9): Direction {
  if (value > epsilon) return "up";
  if (value < -epsilon) return "down";
  return "flat";
}
```

## Checklist
- [ ] Every status and every delta has an icon, sign or word in addition to colour.
- [ ] `--positive/--negative` are separate tokens from `--success/--danger`.
- [ ] A setting (or locale default) exists for red-up / green-up / blue-orange.
- [ ] Status text ≥ 4.5:1 and status icons ≥ 3:1 in both themes.
- [ ] No status hue is used as a chart category colour.
- [ ] Grouped statuses roll up to the worst state.
- [ ] Negatives use U+2212 and tabular numerals.

## Sources
- https://carbondesignsystem.com/patterns/status-indicator-pattern/
- https://carbondesignsystem.com/data-visualization/color-palettes/
- https://primer.style/foundations/color/overview
- https://www.datawrapper.de/blog/colorblindness-part2/
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf
- https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design
- https://insightsoftware.com/blog/3-questions-to-guide-dashboard-design/
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan
- https://www.webull.hk/en/help/faq/1143-What-s-the-meaning-behind-diff
- https://jfly.uni-koeln.de/color/
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- modern-web-guidance: `guides/visual-design/color.md`, `guides/accessibility/accessible-error-announcement.md`
