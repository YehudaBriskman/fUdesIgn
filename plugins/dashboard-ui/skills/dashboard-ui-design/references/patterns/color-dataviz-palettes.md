# Data-viz palettes: categorical, sequential, diverging

> Choose the scale type from the data (unordered → categorical, ordered → sequential, meaningful midpoint → diverging), cap categorical colours at about 6–8, and make every mark meet 3:1 against the plot background.

**Category:** Color and visual style · **Applies to:** line, bar, area, pie/donut, scatter, heatmaps, choropleths, sparklines, legends · **Priority:** must

## When to use / when not
- **Categorical (qualitative):** unordered groups such as products, regions, accounts. Hue does the work, lightness should vary too.
- **Sequential:** ordered magnitude from low to high, such as revenue per region or utilisation %. Few's rule #6: one hue (or a few close hues), pale for low, dark for high.
- **Diverging:** two directions from a meaningful midpoint, such as variance to plan, YoY change, or deviation from average. Datawrapper: "a bright middle value and then go darker to both ends of the scale in different hues". Only use it if the midpoint means something (0, target, average).
- **Not colour at all:** a single series needs one colour. Few's bar-chart example shows that colouring each bar a different hue "adds no meaning" and invites the reader to look for meaning that isn't there.
- Chart type, axes and gridline styling belong to the charts cluster. This file covers only colour.

## Rules (do)
- **Categorical limit: aim for ≤ 6, hard cap 8–10.** Datawrapper's colour-blindness guide says readers disengage beyond 3–4 colours, and Metabase says a chart that needs more than 3–4 colours is showing too much. Tableau 10 caps at 10. Carbon ships 14 ordered colours, but that serves a whole product suite, not one chart. Above the cap, group the tail into "Other" (grey) or use small multiples.
- **Fixed order, not random.** Carbon's 14-colour sequence is "carefully curated to maximize contrast between neighboring colors". The FT and The Economist define a fixed order per chart type. Series 1 always gets colour 1, so the same entity keeps the same colour across every chart on the dashboard (bind colour to entity ID, not array index).
- **Vary lightness within the categorical set** so it survives greyscale and colour-vision deficiency (Datawrapper: "give your hues different lightnesses so that they'd work in greyscale"). Alternate warm and cool hues (Okabe & Ito).
- **Blue as anchor.** Blue reads most consistently for red- and green-blind viewers. Pair blue with orange or red. Avoid blue + purple and green + red at equal lightness (Datawrapper).
- **Grey is a category: "Other", "No data", baselines, prior period.** Define at least one data-grey distinct from the UI greys (Datawrapper style guide).
- **Sequential range: wide.** Datawrapper's defaults span about 69 OKLCH/Lab lightness points from light to dark end. Light theme: darkest = largest value. Dark theme: lightest = largest (Carbon). Discrete sequential: 5–7 classes for maps and heatmaps, and Carbon offers 10-step monochrome scales.
- **Diverging = two sequential scales joined at the light end.** Use a neutral light midpoint, with an equal number of steps on each side (odd total: 5, 7, 9). Carbon: red–cyan for hot/cold data, purple–teal for anything without temperature connotation. Few: blue–red for profit/loss heatmaps instead of green–red.
- **3:1 against the plot background for marks** (WCAG 1.4.11). Lines, bars and points must be distinguishable from the background, unless values are also given as text or a table. Bars and slices touching each other need 3:1 between them or a 1–2 px surface-coloured gap.
- **Thin marks need stronger colours.** Few: lines and small points need "a distinct hue of fairly high intensity", bars can use medium intensity. Or thicken the marks: lines ≥ 2 px, points ≥ 6 px.
- **Label directly where possible.** Directly labelled lines remove the legend lookup and the colour dependency (Datawrapper, Okabe & Ito).
- **Separate dark-mode variants of each palette colour.** Don't reuse light-mode hex values on dark. Datawrapper's dark mode keeps each element's contrast against its background constant: a light blue bar on white becomes a dark blue bar on black.

## Anti-patterns (don't)
- **Rainbow / jet scales for magnitude.** Hue isn't perceived as ordered (Few: "try putting the following hues in order from low to high"), and rainbow creates false boundaries at yellow and cyan.
- **Default library palettes used unchecked.** Of the 10 Tableau 10 colours, 6 fall below 3:1 on white (orange 2.4, teal 2.3, yellow 1.6, pink 2.0, grey 2.1). Okabe-Ito's orange (2.3), sky blue (2.3) and yellow (1.3) also fail on white. They are fine on dark and as large filled areas with labels, not as thin lines on white. (Ratios computed for this file.)
- **Gradients for progression.** Carbon: don't use gradients "to show meaningful progression or divergence, or in place of a sequential palette."
- **Status colours as series colours.** A red series reads as an alarm.
- **Diverging scale on data with no midpoint** (e.g. revenue). It invents a "bad half".
- **3-D, glossy or shaded marks.** Few's rule #9: "Avoid using visual effects in graphs."
- **Re-colouring on filter.** Removing series shifts colour-by-index, so "Europe" turns from blue to orange.

## Good references
- [IBM Carbon – Data-viz colour palettes](https://carbondesignsystem.com/data-visualization/color-palettes/) — ordered 14-colour categorical sequence (first 8 all ≥ 3:1 on white by my computation), 10-step monochrome sequential with direction flipped in dark theme, two named diverging palettes with stated use cases.
- [Datawrapper – Which color scale to use](https://www.datawrapper.de/blog/which-color-scale-to-use-in-data-vis) — clean decision rule between categorical, sequential and diverging.
- [Datawrapper – Colors for data vis style guides](https://www.datawrapper.de/blog/colors-for-data-vis-style-guides) — survey of FT, Economist, Pew, Quartz, Urban Institute palettes; greys; ~69-point lightness range; WCAG 3:1 halves the usable lightness range.
- [Datawrapper – Emphasize with color](https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations) — "make everything grey, then restore colour"; highlight at most 1–2 categories.
- [Okabe & Ito – Color Universal Design](https://jfly.uni-koeln.de/color/) — CVD-safe set (orange #E69F00, sky blue #56B4E9, bluish green #009E73, yellow #F0E442, blue #0072B2, vermilion #D55E00, reddish purple #CC79A7, black), alternate warm/cool, label directly.
- [Stephen Few – Practical Rules for Using Color in Charts](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) — nine rules. Soft medium colours for most data, bright/dark only for highlight, three standard palettes (bright, medium, pale).

## Bad references
- [Few's multicoloured bar chart](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 3) — seven countries, seven hues, zero meaning. The single-hue version on p. 4 is faster to compare.
- [Few's 3-D cylinder bars](https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf) (p. 12) — shading and perspective make the bar ends hard to read against the axis.
- [Datawrapper on Okabe-Ito in thin lines](https://www.datawrapper.de/blog/colorblindness-part2/) — even a "colour-blind-safe" palette has pairs that are hard to separate in thin lines. Safe palette ≠ safe chart.
- [Metabase – Top 5 dashboard fails](https://metabase.com/blog/top-5-dashboard-fails) — rainbow charts needing more than 3–4 colours.

## Accessibility
- WCAG 1.4.11: each data line, bar or slice needed for understanding ≥ 3:1 against adjacent colours. Exemptions apply if the same information is in text labels or an adjacent table, or for "essential" encodings such as heatmaps (W3C Understanding 1.4.11).
- WCAG 1.4.1: add a second channel (dash pattern, marker shape, direct label). Datawrapper suggests at most 3–4 shapes.
- Provide a data table or `<figure>` + `<figcaption>` summary. CSS-drawn charts aren't exposed to assistive technology (modern-web-guidance `visual-effects.md`).
- Simulate deuteranopia, protanopia and tritanopia (Chrome DevTools rendering emulation, Sim Daltonism, Viz Palette), and test with real colour-blind users where possible.

## Motion / interaction (if relevant)
- Hover/focus on a series: dim the other series to 20–30% opacity (or to data-grey) instead of brightening the target. This keeps the target's colour stable.
- Legend click toggles a series without re-assigning colours to the rest.

## Tokens and values
| Token | Light (on #fff) | Dark (on #171a1d) | Notes |
|---|---|---|---|
| `--cat-1` blue | oklch(0.50 0.15 255) #1762b6 (6.1) | oklch(0.72 0.13 255) #6aa7f4 (7.1) | anchor, series 1 |
| `--cat-2` orange | oklch(0.62 0.15 55) #c9690c (3.8) | oklch(0.76 0.14 60) #f19a4b (7.9) | |
| `--cat-3` teal | oklch(0.56 0.09 180) #268676 (4.4) | oklch(0.74 0.11 175) #51c1a7 (8.0) | |
| `--cat-4` magenta | oklch(0.52 0.18 340) #a73189 (6.1) | oklch(0.72 0.15 345) #e57bba (6.6) | |
| `--cat-5` olive green | oklch(0.60 0.13 130) #668f33 (3.8) | oklch(0.78 0.13 130) #9cc86c (9.1) | not adjacent to cat-2/red |
| `--cat-6` violet | oklch(0.48 0.15 295) #6646a8 (7.0) | oklch(0.70 0.13 295) #a58de6 (6.3) | not adjacent to cat-1 |
| `--cat-7` ochre | oklch(0.62 0.12 85) #a77f19 (3.7) | oklch(0.84 0.12 90) #e9c769 (10.7) | |
| `--cat-other` | oklch(0.75 0.01 250) #a9afb4 | oklch(0.42 0.01 250) #494e52 | "Other" / context, intentionally low |
| Categorical max | 6 preferred, 8 hard cap | | then group or small-multiple |
| Sequential classes | 5–7 (maps/heatmaps), continuous for dense grids | | L range ≥ 0.55 (≈ 60–70 points) |
| Diverging classes | 7 or 9, odd, neutral midpoint L ≈ 0.95 (light) / 0.30 (dark) | | |
| Line width | 2 px (1.5 px minimum) | | highlight 3 px |
| Point size | 6–8 px diameter | | |
| Gap between touching bars/slices | 1–2 px in `--surface` | | substitutes for 3:1 between neighbours |
These hues are a computed starting point (each verified ≥ 3:1 on its background). Run them through a CVD simulator before adopting them.

## Implementation sketch
```css
:root {
  --cat-1: light-dark(oklch(0.50 0.15 255), oklch(0.72 0.13 255));
  --cat-2: light-dark(oklch(0.62 0.15 55),  oklch(0.76 0.14 60));
  --cat-3: light-dark(oklch(0.56 0.09 180), oklch(0.74 0.11 175));
  --cat-other: light-dark(oklch(0.75 0.01 250), oklch(0.42 0.01 250));
  /* Sequential: interpolate in oklab between two anchors, then sample discrete steps */
  --seq-lo: light-dark(oklch(0.96 0.03 255), oklch(0.30 0.05 255));
  --seq-hi: light-dark(oklch(0.38 0.14 255), oklch(0.86 0.10 255));
}
.heat-cell { background: color-mix(in oklab, var(--seq-hi) calc(var(--t) * 100%), var(--seq-lo)); }
.series path { stroke-width: 2px; }
.series:not(:hover, :focus-within) { transition: opacity 150ms; }
.chart:has(.series:hover) .series:not(:hover) { opacity: 0.25; }
```
```ts
const CATEGORICAL = ["--cat-1", "--cat-2", "--cat-3", "--cat-4", "--cat-5", "--cat-6", "--cat-7"] as const;
type CatToken = (typeof CATEGORICAL)[number] | "--cat-other";

/** Stable colour per entity: assign once by rank, persist, never by current array index. */
export function assignColors(entityIdsByImportance: readonly string[], maxColors = 6): Map<string, CatToken> {
  const out = new Map<string, CatToken>();
  entityIdsByImportance.forEach((id, i) => {
    out.set(id, i < Math.min(maxColors, CATEGORICAL.length) ? CATEGORICAL[i] : "--cat-other");
  });
  return out;
}
```

## Checklist
- [ ] Scale type matches the data (unordered / ordered / midpoint).
- [ ] ≤ 6–8 categorical colours visible, and the tail is grouped as grey "Other".
- [ ] Each entity keeps the same colour across all charts and filters.
- [ ] Every mark ≥ 3:1 against the plot background in light and dark, or values are labelled.
- [ ] Palette passes a deuteranopia/protanopia simulation, and adjacent series differ in lightness.
- [ ] No rainbow scale, no gradient-as-progression, no 3-D or gloss.
- [ ] Dark-mode palette is a separate set of values, and sequential direction is flipped (lightest = most).

## Sources
- https://carbondesignsystem.com/data-visualization/color-palettes/
- https://www.datawrapper.de/blog/which-color-scale-to-use-in-data-vis
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations
- https://www.datawrapper.de/blog/colorblindness-part2/
- https://www.datawrapper.de/blog/dark-mode-for-embedded-visualizations
- https://jfly.uni-koeln.de/color/
- https://www.perceptualedge.com/articles/visual_business_intelligence/rules_for_using_color.pdf
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://metabase.com/blog/top-5-dashboard-fails
- https://grafana.com/blog/2020/08/25/3-tips-to-improve-your-grafana-dashboard-design
- modern-web-guidance: `guides/visual-design/visual-effects.md` (oklab interpolation, CSS pie needs a text equivalent), `guides/visual-design/color.md`
