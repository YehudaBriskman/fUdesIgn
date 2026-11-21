# Sparklines and micro-charts

> A sparkline is a word-sized line that gives a number its history: always pair it with the current value, keep it free of axes and frames, give it a stated time window, and never make it the only carrier of meaning.

**Category:** Charts and data visualisation · **Applies to:** KPI cards, table rows, list items, watchlists, inline text · **Priority:** should

## When to use / when not
- Use when the reader needs the shape of recent history next to a number: "is this up, flat, volatile, recovering?" Tufte: "a small intense, simple, word-sized graphic with typographic resolution".
- Use in tables: one sparkline per row lets the eye compare 20 trends in the space of one chart.
- Not when the exact values over time matter (use a full chart with axes), not for comparing magnitudes across rows (each sparkline is usually scaled to its own range), not for fewer than ~5 points (show the two numbers and the change instead).

## Rules (do)
- Pair it with the number. Tufte: a line "lacking a scale" is "dequantified"; label the latest value at the right end, or put the KPI number immediately to its left.
- State the window once, visibly: "Last 30 days", "12 months". The window must be the same across a row of cards; mixing 7-day and 90-day sparklines in one grid is a lie by layout.
- State the scale policy. Default: each sparkline scaled to its own min/max (shape comparison). If rows must be compared in magnitude, use a shared y-domain and say so in the column header ("shared scale").
- Size: word-sized. Tremor default is 48 × 112 px (`h-12 w-28`); its KPI card example uses 32 × 80 px, 40 × 144 px from `sm`. In tables, height ≈ row text cap-height × 1.5 to 2, i.e. 16 to 24 px; width 60 to 120 px.
- Aspect ratio wider than tall: Tufte's financial sparklines are about 5:1; aim for an average slope near 45° (not spiky, not flat).
- No axes, no gridlines, no frame, no legend, no fill gradient by default. Tufte: "Avoid all data frames."
- Optional context, in this order of value: (1) a dot on the last point; (2) a light grey band for the normal or target range (Tufte's glucose example); (3) min/max dots in a muted second colour with their numbers nearby. Do not add all three to every card.
- Colour: neutral ink for the line. If you colour by direction (green up / red down), the rule must be explicit and consistent, and direction must also appear as text or an arrow with sign ("+4.1%"). Robinhood Legend colours the line green when the last close in the window is above the first close; state this rule if you copy it, because it differs from "change since yesterday".
- Remember that "up" is not always good (costs, churn, latency). Colour by meaning (good/bad), not by direction, or stay neutral. See color-semantic-status.md.
- Locale: in mainland China, Japan and Taiwan red means rising price (Benzinga, Bloomberg). A finance UI with Asian markets must make up/down colours a setting.
- Line 1 to 1.5 px; last-point dot 3 to 4 px diameter.
- Handle nulls as gaps, as in full charts (see chart-time-series-line-area.md). Tremor `connectNulls` defaults to `false`; keep it.
- Variants: spark bar (≤ 30 bars, discrete periods such as daily orders), win/loss bars (sign only), spark area only for a single series with fill ≤ 20% opacity.

## Anti-patterns (don't)
- A sparkline with no number and no window ("decorative squiggle"); KPI cards that show only a line and a percent with no period label.
- Inconsistent windows or scales across a card grid.
- A red line because the last point is below the first, on a metric where down is good.
- Auto-scaled sparkline on a near-flat series: a 0.2% wiggle fills the full height and looks like a crash. Set a minimum y-span (for example ±1% of the mean) so noise looks like noise.
- Tooltips as the only way to read values (Fossheim: don't hide important data behind hovers).
- Stoplight backgrounds behind the sparkline. Tufte warns against "vulgar stoplight charts" masking the line.

## Good references
- [Tufte: Sparkline theory and practice](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/) — definition, 14-letterspace width, ~5:1 aspect, grey normal-range band, red endpoints tied to numbers.
- [Tremor spark charts](https://www.tremor.so/docs/visualizations/spark-charts) — production React components (line/area/bar) with sizes, `connectNulls=false` default, `autoMinValue` option.
- [Robinhood Legend: line colour rule](https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend) — documents exactly when the line is green vs red (first vs last close in frame), which is the kind of rule you must write down.
- [IBM Carbon chart types: sparkline](https://carbondesignsystem.com/data-visualization/simple-charts/) — sparkline as a "modified area chart" in Carbon Charts.

## Bad references
- ["The curse of same-day changes" (Chris Goldammer)](https://chrisgoldammer.notion.site/Stock-price-charts-4-22-2021-179a9339afd544eebee8fbd88d8d7dd1) — critique of brokerage apps where a binary red/green day-change colour drives emotion without magnitude; proposes shaded intensities.
- Card grids in admin templates where each KPI card auto-scales its sparkline independently and uses a different window; the eye compares shapes that are not comparable.

## Accessibility
- The sparkline is supplementary: give the SVG `aria-hidden="true"` when the adjacent text already says the value and trend, or `role="img"` with a short label ("Up 4.1% over 30 days, low 1.02k on 3 Mar, high 1.31k today").
- Never let colour be the only indicator of direction (WCAG 1.4.1, modern-web-guidance visual-design/color.md): add sign and arrow.
- Line contrast 3:1 against the card background when it carries meaning.
- In tables, include the trend summary as text in the cell or a visually hidden span so screen readers get it per row.

## Motion / interaction (if relevant)
- No draw-in animation in tables (twenty lines animating at once is noise). On live updates, shift the line without easing or with ≤150 ms linear.
- Hover/scrub on a sparkline is optional; if present, show value and date in a tooltip and keep the number next to it updating (Robinhood "scrubbing" pattern). Touch: long press to scrub.

## Tokens and values
| Token | Default |
|---|---|
| Sparkline size (card) | 32–48 px high × 80–144 px wide |
| Sparkline size (table) | 16–24 px high × 60–120 px wide |
| Aspect ratio | 4:1 to 6:1 |
| Stroke | 1.25 px, neutral ink |
| Last-point dot | 3–4 px, same ink or accent |
| Normal band | neutral at 10–15% opacity |
| Min y-span | ±1% of mean (configurable) |
| Window label | 12 px, muted, always visible |
| Max spark bars | 30 |

## Implementation sketch
```tsx
interface SparklineProps {
  values: ReadonlyArray<number | null>;
  width?: number;
  height?: number;
  minSpanRatio?: number; // e.g. 0.01 => at least ±1% of mean
  label: string;         // full text alternative
}

export function Sparkline({ values, width = 96, height = 24, minSpanRatio = 0.01, label }: SparklineProps) {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length < 2) return null;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  const minSpan = Math.abs(mean) * minSpanRatio * 2;
  if (max - min < minSpan) { const mid = (max + min) / 2; min = mid - minSpan / 2; max = mid + minSpan / 2; }
  const x = (i: number) => (i / (values.length - 1)) * (width - 4) + 2;
  const y = (v: number) => height - 2 - ((v - min) / (max - min || 1)) * (height - 4);

  // Split into segments at nulls so gaps stay gaps.
  const segments: string[] = [];
  let current = "";
  values.forEach((v, i) => {
    if (v === null) { if (current) segments.push(current); current = ""; return; }
    current += `${current ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });
  if (current) segments.push(current);

  const lastIndex = values.length - 1;
  const last = values[lastIndex];

  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {segments.map((d) => <path key={d} d={d} />)}
      {last !== null && last !== undefined && <circle cx={x(lastIndex)} cy={y(last)} r={2} />}
    </svg>
  );
}
```
```css
.spark path { fill: none; stroke: var(--chart-ink); stroke-width: 1.25; vector-effect: non-scaling-stroke; }
.spark circle { fill: var(--chart-ink); }
@media (forced-colors: active) { .spark path { stroke: CanvasText; } .spark circle { fill: CanvasText; } }
```

## Checklist
- [ ] Every sparkline sits next to its current value.
- [ ] The time window is visible and identical across the group.
- [ ] Scale policy (own vs shared) is consistent and stated when shared.
- [ ] No axes, frames, gridlines, or decorative gradients.
- [ ] Direction is shown in text (sign/arrow), not only colour; colour follows good/bad meaning.
- [ ] Nulls render as gaps; near-flat series are not exaggerated (min span).
- [ ] Screen readers get a text trend summary or the SVG is hidden because text exists.

## Sources
- https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- https://www.tremor.so/docs/visualizations/spark-charts
- https://carbondesignsystem.com/data-visualization/simple-charts/
- https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend
- https://robinhood.com/us/en/support/articles/using-charts
- https://chrisgoldammer.notion.site/Stock-price-charts-4-22-2021-179a9339afd544eebee8fbd88d8d7dd1
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan
- https://www.bloombergquint.com/markets/2018/05/30/the-oddest-things-about-china-s-7-4-trillion-stock-market
- https://fossheim.io/writing/posts/accessible-dataviz-design/
- modern-web-guidance: skills/modern-web-guidance/guides/visual-design/color.md
- modern-web-guidance: skills/modern-web-guidance/guides/accessibility/accessibility.md (Inline SVGs)
