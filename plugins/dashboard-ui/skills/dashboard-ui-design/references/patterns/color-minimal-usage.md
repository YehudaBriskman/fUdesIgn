# Minimal colour: colour only where it carries meaning

> Build the dashboard in neutrals first, then add colour only to encode something (action, status, direction, a data series, a highlight). Target ≤ 10% of the screen area in saturated colour.

**Category:** Color and visual style · **Applies to:** whole dashboard composition, KPI tiles, tables, charts, navigation, badges, empty states · **Priority:** must

## When to use / when not
- Always, for data-heavy products (finance, analytics, ops). The data and its exceptions must be the most salient things on screen.
- Marketing pages, onboarding and empty states can be more expressive. Keep that expression out of the working surfaces.
- "Minimal" doesn't mean grey-only. It means every colour has a reason that you can state in one sentence.

## Rules (do)
- **Few's rule #3: "Use color only when needed to serve a particular communication goal."** Rule #4: use different colours "only when they correspond to differences of meaning in the data."
- **The colour budget.** Allowed reasons, in priority order:
  1. a status that needs action (danger/warning);
  2. direction of change (positive/negative);
  3. data-series identity;
  4. the one primary action per view and the focus ring;
  5. selected/current state.
  Everything else (nav, headers, card backgrounds, icons, dividers) is neutral.
- **Grey first, then restore.** Datawrapper: "make everything grey, then restore colour selectively". Highlight 1–2 categories at most, with everything else in one grey.
- **Soft for most, bright for highlight.** Few's rule #5: soft, natural colours for most information, bright and/or dark colours for what needs attention. Keep three tiers: pale (context), medium (data), bright/dark (highlight).
- **Non-data ink just visible enough** (Few rule #7): axes thin medium grey, borders usually unnecessary, plot background = card background.
- **Monochrome charts by default.** A single-series chart uses one colour. Bars in a ranked list use one colour, plus a highlight colour for the bar in focus.
- **Brand appears in 2–3 places:** logo, primary button, focus/selection. Linear deliberately limited how much of the accent hue enters the UI chrome.
- **Status colour only where action is needed.** Carbon: skip indicators when "no action is needed", and more than 5–6 indicators overwhelm. A wall of green "OK" checks trains people to ignore colour, so show OK as quiet text and failures in colour.
- **One accent per screen.** If two different things are both bright, neither stands out. Grafana: "Reserve bright colours for what matters… Otherwise, a colorful dashboard leaves users unsure where to look."
- **Use weight, size and position before colour** for hierarchy: KPI value at 28–32 px semibold in `--text`, label 12–13 px in `--text-muted`. No coloured headings.
- **Audit by squint and greyscale.** In greyscale, hierarchy should still be clear. With colour on, the coloured pixels should be exactly the exceptions.

## Anti-patterns (don't)
- Rainbow KPI tiles (blue revenue tile, green users tile, orange churn tile). Colour implies a category or status that doesn't exist, and the user's eye has nowhere to land.
- Coloured icons in the sidebar nav, one hue per section.
- Every bar a different hue (Few p. 3: "What do the different bar colors in this graph mean? Not a thing.").
- Green "healthy" badges on 40 rows. The single red row is then less salient.
- Gradient headers and decorative blobs behind charts. Few rule #1: keep the background consistent so equal colours look equal.
- Using brand colour for chart series 1 *and* the primary button *and* links. Users try to link the series to the action.
- Red/green colouring of numbers that have no good/bad direction.

## Good references
- [Stephen Few – Practical Rules for Using Color in Charts](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) — rules #3–#5 and #7 are the whole doctrine, with a clear before/after (multicoloured vs single-hue bars, pp. 3–4).
- [Datawrapper – Emphasize with color](https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations) — grey as a storytelling tool, 1–2 highlights, desaturate instead of adding hues. Examples from the Washington Post, WSJ, Economist and FT.
- [Linear – How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — reduced the accent's influence on the chrome for a "neutral, timeless" look, while increasing text contrast.
- [IBM Carbon – Status indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/) — use plain text when no action is needed, cap of 5–6 indicators.
- [Grafana – 3 tips](https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design) — limited consistent palette, bright colours reserved for thresholds and errors.
- [Vercel Geist](https://vercel.com/geist/colors) — the product UI is almost entirely the gray and gray-alpha scales, and colour scales are used for status and highlights.

## Bad references
- [Few's multicoloured bar chart](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 3) — seven hues for seven countries, with labels already on the axis. Pure decoration that slows comparison.
- [Metabase – Top 5 dashboard fails](https://metabase.com/blog/top-5-dashboard-fails) — charts needing more than 3–4 colours, which signals too much at once.
- [insightsoftware – dashboard design](https://insightsoftware.com/blog/3-questions-to-guide-dashboard-design/) — red/green applied to neutral metrics, which implies a good/bad judgement that isn't there.
- Default BI themes (Excel/Power BI default palettes) — each visual gets the next palette colour automatically, so a page of single-series charts ends up in six unrelated hues.

## Accessibility
- Minimal colour helps users with low vision and colour-vision deficiencies: fewer hues means fewer confusable pairs.
- It doesn't remove the need for non-colour cues (WCAG 1.4.1). The few coloured elements still need icons, text or signs.
- Muted greys must still meet contrast (4.5:1 for text). "Minimal" isn't an excuse for low-contrast grey on grey (see `color-contrast-rules.md`).

## Motion / interaction (if relevant)
- Hover/focus can temporarily add colour (highlight the hovered series and grey the rest), then revert. That's colour as a response, not decoration.
- Don't use colour animation (pulsing badges) for anything that isn't urgent. Pulsing is itself an alarm.

## Tokens and values
| Rule | Value |
|---|---|
| Saturated colour area | ≤ ~10% of viewport pixels on a working screen (heuristic) |
| Accent (brand) usages per view | primary button (1), focus ring, selected state, logo |
| Highlighted categories in a chart | 1–2 (Datawrapper) |
| Categorical colours in one chart | ≤ 6 (see `color-dataviz-palettes.md`) |
| Visible status indicators | ≤ 5–6 (Carbon) |
| Single-series chart | 1 hue (`--cat-1` or `--text-muted` + highlight) |
| De-emphasised data | `--cat-other` grey or 25–40% opacity of the hue |
| Hierarchy tools before colour | size (12 → 32 px), weight (400 → 600), position, whitespace |

## Implementation sketch
```css
/* Neutral by default: components inherit grey; colour must be opted in via a role */
.kpi { color: var(--text); }
.kpi-label { font-size: 0.8125rem; color: var(--text-muted); }
.kpi-value { font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.kpi-delta { color: var(--text-muted); }          /* quiet by default */
.kpi-delta[data-significant="true"][data-direction="down"] { color: var(--negative); }
.kpi-delta[data-significant="true"][data-direction="up"]   { color: var(--positive); }

/* Charts: grey context, one highlight */
.chart { --series: var(--cat-other); --highlight: var(--cat-1); }
.chart .bar { fill: var(--series); }
.chart .bar[aria-current="true"], .chart .bar:hover { fill: var(--highlight); }

/* Status: OK rows stay neutral, only exceptions get colour */
.status[data-state="ok"] { color: var(--text-muted); }
.status[data-state="failed"] { color: var(--danger-fg); font-weight: 500; }
```
```ts
/** Only colour deltas that matter, so small noise stays grey. */
export function isSignificant(changePct: number, thresholdPct = 1): boolean {
  return Math.abs(changePct) >= thresholdPct;
}
```

## Checklist
- [ ] For each coloured element, you can state the meaning in one sentence (status, direction, series, action, selection).
- [ ] Greyscale screenshot still shows clear hierarchy (size, weight, position).
- [ ] Single-series charts use one hue, and highlights are limited to 1–2 items.
- [ ] Brand hue appears only on the primary action, focus, selection and logo.
- [ ] "OK" states are neutral, and only exceptions are coloured.
- [ ] Nav, headings, card backgrounds and icons are neutral.

## Sources
- https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf
- https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://carbondesignsystem.com/patterns/status-indicator-pattern/
- https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design
- https://vercel.com/geist/colors
- https://metabase.com/blog/top-5-dashboard-fails
- https://insightsoftware.com/blog/3-questions-to-guide-dashboard-design/
- modern-web-guidance: `guides/user-experience/content-first-noise-reduction.md`, `guides/visual-design/color.md`
