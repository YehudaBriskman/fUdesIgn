# Semantic status and money colours

> Status colours (danger, warning, success, info) and money colours (positive, negative) are separate token sets, never the only cue, and for money they must be locale- and preference-aware.

**Category:** Color and visual style · **Applies to:** badges, alerts, toasts, KPI deltas, P&L tables, price tickers, health indicators, form validation · **Priority:** must

## When to use / when not
- Use status colour when the user must **act** or **triage**: failed job, breached threshold, overdue invoice. Carbon: skip indicators "when no action is needed or the status isn't significant. Use plain text instead."
- Use money colour (positive/negative) for **direction of change** of a value: deltas, returns, P&L. Direction is not judgement: a rise in costs is "up" but bad.
- Don't colour every number in a table green or red. Colour the delta column or the sign, not the whole row (see `color-minimal-usage.md`).
- Don't use status colours for categories in charts. A red series reads as "bad" (Carbon's palette guide: "Alert colors are used to reflect status").

## Rules (do)
- **Fixed meanings, documented.** Carbon's status set: red = danger/error, orange = serious warning, yellow = regular warning, green = success/normal, blue = passive notification/in progress, gray = draft/not started, purple = outlier/undefined. Pick a subset (4–5) and never reuse those hues decoratively.
- **Roll-ups take the worst status.** Carbon: consolidated statuses take the highest-attention colour, so green + yellow + red is red.
- **Never colour alone (WCAG 1.4.1).** Pair colour with at least one of icon, shape or text. Carbon's icon indicators "require an icon, a shape, a meaningful color, and a descriptive inline label"; its differential indicators use a `+`/`−` sign, a caret or an arrow, and "Color is optional".
- **Money deltas: sign + arrow + colour.** Render `▲ +2.4%` / `▼ −1.1%`. Use the true minus sign U+2212, not a hyphen, and keep tabular numerals so signs align.
- **Separate the tokens:** `--positive` / `--negative` (direction) are distinct from `--success` / `--danger` (status), even if the default hues match. That lets a locale or user swap money colours without turning error banners green.
- **Respect market convention.** Mainland China, Taiwan and Japan quote rising prices in red and falling in green (Benzinga). South Korea also shows rising prices in red (a Korean broker's investor guide: "In Korea, red means rising"; the falling colour isn't stated there). For any other market, check its exchange's own quote pages before choosing a default rather than assuming one. Brokers (e.g. Webull HK) let users set the up/down colours. For a finance product, default by locale and offer a setting: "Green up / red down" vs "Red up / green down".
- **Offer a colour-blind-safe alternative.** About 8% of men and 0.5% of women of Northern European descent have a colour-vision deficiency, mostly red–green (Few gives 10% and 1%). Few's rule #8: "avoid using a combination of red and green in the same display"; for positive/negative heatmaps he suggests "blue and red". Datawrapper: "Quite a few companies use blue for positive" and red for negative, and blue paired with orange or red is the safest pair. Ship a blue/orange option (`data-money="cvd"` in tokens.css).
- **If you keep red/green, separate them by lightness.** Make the green noticeably darker or lighter than the red (≥ 15 OKLCH L points) so they differ in greyscale, and keep the arrow. The default `--success-fg` and `--danger-fg` are only 1 L point apart (1.1:1 against each other), so in the default mapping the sign and arrow carry the direction.
- **Each role has fg and bg, plus emphasis and border if you need them.** tokens.css ships `--{role}-fg` and `--{role}-bg` (a 10% `color-mix` tint); Primer adds an emphasis background with `fgColor-onEmphasis` and a border. Text uses `-fg` on surface (≥ 4.5:1). Badges use `-fg` on `-bg` (≥ 4.5:1). Status icons need ≥ 3:1; Carbon also asks for 3:1 between status colours and against the page background.
- **Yellow never carries text on white.** Yellow fills need dark text, and yellow as a foreground needs a darkened amber (~L 0.55). Carbon notes light orange and yellow shapes need outlines in light themes.
- **Cap visible indicators.** More than 5–6 status indicators in one view overwhelms (Carbon).

## Anti-patterns (don't)
- Red/amber/green "traffic light" cells as the only encoding. All three are equally saturated, so nothing ranks above anything else, and red/green collapse for deuteranopes (Few's heatmap example, Stacey Barr, Grafana's dashboard tips).
- Colouring neutral metrics red/green (e.g. "number of tickets" green because it went up). Red/green imply a good/bad judgement that isn't there.
- Whole-row red backgrounds for negative P&L. Saturated fills under numbers cut contrast and turn the table into a heatmap nobody asked for.
- Using `--danger` for a destructive *button* and also for a chart series. The user can't tell "error" from "category 3".
- Pure `#ff0000` text on dark backgrounds. Deep red looks nearly black to protanopes (Okabe & Ito), and saturated red vibrates on dark.
- Hyphen-minus `-` for negatives in proportional fonts: misaligned columns and easy to miss.

## Good references
- [IBM Carbon – Status indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/) — explicit colour meanings, worst-status roll-up, differential indicator rule (sign or arrow, colour optional), 3:1 requirement, about 5–6 indicators before it overwhelms.
- [GitHub Primer – Color](https://primer.style/foundations/color/overview) — every semantic role has fg / muted / emphasis / border tokens, with fg tested against both muted and default backgrounds.
- [Datawrapper – Colorblindness, part 2](https://www.datawrapper.de/blog/colorblindness-part2/) — "Blue is the safest hue"; pair blue with orange or red; vary lightness; label directly.
- [Stephen Few – Practical Rules for Using Color in Charts](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) — rule #8 (p. 11), avoid red + green in one display; blue/red as the substitute for positive/negative heatmaps.
- [Datawrapper – Colors for data-vis style guides](https://www.datawrapper.de/blog/colors-for-data-vis-style-guides) — blue for positive and red for negative as a colour-blind-safe convention.
- [Benzinga – red/green in Asian markets](https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan) and [Webull HK FAQ](https://www.webull.hk/en/help/faq/1143-What-s-the-meaning-behind-diff) — evidence that colour direction is locale-dependent and that brokers make it a setting.

## Bad references
- [Few's Excel traffic-light heatmap](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 2) — green/yellow/red cells: the most important values (dark red, dark green) are the least readable because black text sits on dark fills.
- [Grafana – 3 tips to improve dashboard design](https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design) — critiques dashboards "so colorful that users don't know where to look any more"; says "try not to juxtapose red and green" and that red on black is "tricky for people with certain kinds of color blindness".

## Accessibility
- WCAG 1.4.1 Use of Color: status and direction need a non-colour cue (icon, sign, text).
- WCAG 1.4.3: status text ≥ 4.5:1 on its background. WCAG 1.4.11: status icons and shapes ≥ 3:1.
- Give screen readers the meaning: `<span class="visually-hidden">down</span>` or `aria-label="down 1.1 percent"` on delta chips; announce new errors through a live region (modern-web-guidance `accessible-error-announcement.md`).
- In forced-colors mode the colour disappears, so the icon and sign must carry meaning alone.

## Motion / interaction (if relevant)
- Price "flash" on tick (background pulse green/red): ≤ 600 ms, opacity only, at most once per value change, and disabled under `prefers-reduced-motion: reduce`. Never flash more than 3 times per second (WCAG 2.3.1).
- Don't animate status colour changes slowly; a 2 s fade from green to red hides the moment of change.

## Tokens and values
| Token | Light | Dark | Contrast light / dark (on `--surface`; on own `-bg`) |
|---|---|---|---|
| `--danger-fg` | oklch(0.53 0.19 27) #c22826 | oklch(0.72 0.16 25) #f97770 | 5.8 / 6.6; on bg 5.0 / 5.8 |
| `--warning-fg` | oklch(0.56 0.12 65) #a46311 | oklch(0.82 0.14 80) #f3b94c | 4.8 / 9.9; on bg **4.2** / 8.3 (light fails; 4.4 on `--surface-2`) |
| `--success-fg` | oklch(0.50 0.13 150) #137738 | oklch(0.76 0.15 150) #61cb7c | 5.6 on surface, 4.6 on surface-3 / 8.6 |
| `--info-fg` | oklch(0.51 0.14 250) #0b68b2 | oklch(0.74 0.12 250) #6db0f4 | 5.8 on surface, 4.7 on surface-3 / 7.6 |
| `--{role}-bg` | `color-mix(in oklab, var(--{role}-fg) 10%, var(--surface))` | same formula | badge background (tokens.css) |
| `--positive` / `--negative` | default = success-fg / danger-fg | same | swappable by locale/setting |
| `--positive` (CVD option) | `--info-fg` blue | `--info-fg` | 5.8 / 7.6 |
| `--negative` (CVD option) | oklch(0.53 0.14 48) #aa4d0a | oklch(0.78 0.14 55) #fb9d59 | 5.6 on surface, 4.5 on surface-3 / 8.4 |
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
/* Locale / user setting: red-up markets (same attribute as tokens.css) */
:root[data-money="red-up"] { --positive: var(--danger-fg); --negative: var(--success-fg); }
/* Colour-vision-friendly option: needs a dark value too (3.9:1 on dark surface otherwise) */
:root[data-money="cvd"] {
  --positive: var(--info-fg);
  --negative: light-dark(oklch(0.53 0.14 48), oklch(0.78 0.14 55));
}
.num { font-variant-numeric: tabular-nums; text-align: end; }
.delta { display: inline-flex; gap: 0.25em; align-items: center; font-weight: 500; }
.delta[data-direction="up"] { color: var(--positive); }
.delta[data-direction="down"] { color: var(--negative); }
.delta-icon { inline-size: 0.75em; block-size: 0.75em; fill: currentColor; }
.badge-danger {
  color: var(--danger-fg);
  background: var(--danger-bg); /* 10% tint, tokens.css */
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
- [ ] Status text ≥ 4.5:1 on every surface level and on its own `-bg`, and status icons ≥ 3:1, in both themes.
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
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan (read via web.archive.org: red up, green down in China, Taiwan and Japan)
- https://view.asiae.co.kr/en/article/2026071309151503447 (Asia Business Daily, July 2026, on Hanyang Securities' guide: "In Korea, red means rising")
- https://www.webull.hk/en/help/faq/1143-What-s-the-meaning-behind-diff
- https://jfly.uni-koeln.de/color/
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- modern-web-guidance: `guides/visual-design/color.md`, `guides/accessibility/accessible-error-announcement.md`
