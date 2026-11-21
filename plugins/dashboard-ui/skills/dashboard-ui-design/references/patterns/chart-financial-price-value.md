# Financial charts: price vs value, candles, football field, waterfall

> Draw market price as a line over time and intrinsic value as a range, put them on one shared axis so the gap is the message, bridge from one value to another with a waterfall, and compare methods with a football field sorted and anchored by the current price.

**Category:** Charts and data visualisation · **Applies to:** valuation tools, equity research views, portfolio dashboards, P&L and cash bridges, pitch-book style summaries · **Priority:** must (for finance products)

## When to use / when not
| Question | Chart |
|---|---|
| How has price moved; is it above or below our value? | Price line + value band (shared y-axis, same currency/unit) |
| What happened within each trading session? | Candlestick (OHLC); only for short-term, trading-oriented users |
| How do valuation methods compare; where is the defensible range? | Football field (floating horizontal range bars) |
| How do we get from revenue to free cash flow / from last quarter to this one / from EV to equity value? | Waterfall (bridge) |
| How sensitive is value to two assumptions? | Sensitivity table with sequential colour (not a 3D surface) |
- Candles are not for long-term investors: Robinhood's own explainer says "candlesticks are short-term" signals of "a near-term reversal or continuation", while following a line "can give you an indication of the general price direction".

## Rules (do)
**Price vs value**
- One y-axis, one unit. Never put price and value on separate axes (see chart-honesty-chartjunk.md).
- Price: 1.5 to 2 px line in neutral ink. Value: a band (low to high, e.g. 25th–75th percentile of scenarios) with the point estimate as a dashed line. The visual gap between line and band is the "margin of safety".
- Label the latest price and the central value at the right edge with numbers and the implied upside/downside in text: "Price $118 · Value $142 (+20%)".
- Line y-axis may be cropped (it is a line), but the value band must be fully visible; never clip it to fit the price range.
- Use log scale for price histories longer than ~5 years or with >3× moves; label "log scale".
- Mark valuation dates: value changes when a filing lands; draw value as a step function, not an interpolated line, because it does not change between filings.
- Adjust for splits; say "split-adjusted" in the subtitle. Dividends: state whether total return.

**Candlesticks**
- Anatomy (Robinhood): body = open to close; wicks = high and low; up candles closed above open.
- Up/down colours are locale-dependent: green-up/red-down in the US and Europe; red-up/green-down in mainland China, Japan and Taiwan. Make it a user setting and default by market.
- Do not rely on colour alone: hollow body for up, filled for down (classic convention), so the chart survives greyscale and colour-blindness.
- Minimum body width 3 px; below that, switch to OHLC bars or a line. A 1-year daily chart on a 600 px panel (≈250 candles) is already too dense; aggregate to weekly.
- Volume as a separate panel below with its own axis (a separate chart, not a dual axis), height ≈ 20 to 25% of the price panel, sharing the x-axis and crosshair.

**Football field**
- Horizontal floating bars, one per method: e.g. 52-week trading range, analyst targets, trading comps (EV/EBITDA, P/E), precedent transactions, DCF (perpetuity), DCF (exit multiple), LBO. (Wall Street Prep lists DCF, LBO, comparable companies, precedent transactions and the 52-week high/low; analyst targets are a common addition.)
- Each bar labelled with low and high values at its ends; method name and key assumption on the left ("DCF · WACC 8–10%, g 2–3%").
- Vertical reference lines spanning all bars: current price (solid), offer price or our point estimate (dashed). The overlap zone of methods may be shaded lightly as the "consensus range".
- Order: group market-based (52-week, analyst targets) then intrinsic (comps, precedents, DCF), or sort by midpoint. Pick one and keep it identical across the product.
- Axis in value per share (or EV), starting where the data needs it: floating ranges do not need zero (they are positions, like a dot plot), but the axis must be labelled with ticks.
- Use one neutral colour for all bars and a highlight only for the method the narrative depends on. Do not colour by "bullish/bearish".

**Waterfall**
- Start and end totals anchored on zero; intermediate steps float (Datawrapper: totals "sit on the baseline"; when steps are tiny it allows floating or faded totals instead).
- Three colours only: increase, decrease, total (neutral). Datawrapper: "certain combinations of red and green" look alike to colour-blind readers; use "lime green/dark red or teal/red". Add +/− signs to every label so colour is not required.
- Label every step; then hide the y-axis and gridlines (Datawrapper).
- Order: accounting order when the bridge follows a statement (Revenue → COGS → Opex → EBIT → Tax → ...); otherwise group gains and losses and sort each by size (Datawrapper).
- Subtotals as neutral bars anchored at zero (EBITDA, EBIT) where the reader needs a checkpoint.
- Orientation: vertical columns when the categories are time; horizontal when labels are long (SAP Fiori).
- Connector lines 1 px between step ends; omit when all steps move one way (Datawrapper).
- Never break the axis on totals; if steps are tiny relative to totals, float the totals or fade them (Datawrapper).

## Anti-patterns (don't)
- Price and value on dual y-axes "so both fit".
- An unlabelled "fair value" dot with no range: false precision.
- Interpolated value line between quarterly filings.
- Red/green-only candles; candles on 5-year daily data.
- Football fields with each bar a different saturated colour and no current-price line.
- Waterfalls with an axis break, or with 15 tiny steps (group into "Other").
- Logarithmic axis on a waterfall or football field (ranges stop being comparable by length).

## Good references
- [Robinhood: What is a candlestick](https://robinhood.com/us/en/learn/articles/3YzdYQ8bI4XqfnYUNj3dac/what-is-a-candlestick) — plain-language anatomy and line-vs-candle guidance.
- [Robinhood Legend widgets](https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend) — documents the line colour rule (first vs last close in frame) and a draggable baseline for area charts; good pattern for "price vs my reference".
- [Datawrapper: waterfall charts guide](https://www.datawrapper.de/blog/waterfall-charts-guide) — ordering, totals, three colours, colour-blind-safe pairs, connectors.
- [SAP Fiori: waterfall chart usage](https://www.sap.com/design-system/fiori-design-web/v1-136/ui-elements/waterfall-chart/usage) — enterprise defaults (positive blue, negative orange, totals grey) and orientation by time vs category. Unverified: the page blocks automated fetching, so check it before relying on these colours.
- [Wall Street Prep football field](https://www.wallstreetprep.com/knowledge/football-field-valuation-real-example-excel-template/) — the standard method list (DCF, LBO, comps, precedents, 52-week range) with a worked example. [CFI's template page](https://corporatefinanceinstitute.com/resources/valuation/football-field-chart/) gives only a one-line definition.

## Bad references
- [Chris Goldammer: The curse of same-day changes](https://chrisgoldammer.notion.site/Stock-price-charts-4-22-2021-179a9339afd544eebee8fbd88d8d7dd1) — binary red/green by day change drives emotion and hides magnitude.
- [Datawrapper dual-axis critique](https://www.datawrapper.de/blog/dualaxis/) — the general failure of two-scale charts, which is exactly what "price on left, value on right" becomes.
- Pitch-book football fields that colour each method in a different brand colour and omit the current share price, so the reader cannot answer "cheap or expensive?".

## Accessibility
- Candles: hollow/filled plus colour; text alternative per candle "12 Mar: open 101.2, high 104.0, low 100.5, close 103.8 (up)".
- Football field table view: Method · Low · High · Midpoint; plus current price row.
- Waterfall table view: Step · Change (signed) · Running total.
- Signed numbers use a real minus (U+2212) or a leading "−"; screen readers announce "minus". Do not show negatives only in red or only in parentheses.
- Upside/downside percent must be text, not just the visual gap.

## Motion / interaction (if relevant)
- Shared crosshair between price and volume panels; tooltip shows OHLC + volume + value range on that date.
- Range selector chips (1M, 6M, 1Y, 5Y, Max) with the selected one as `aria-pressed="true"`; changing range re-scales without animation or in ≤240 ms (`--motion-dur-medium`).
- Football field: hovering a bar reveals assumptions; clicking opens the method's detail. Keep the current-price line visible during hover.

## Tokens and values
| Token | Default |
|---|---|
| Price line | 1.75 px, neutral ink |
| Value band | accent at 20% fill, 1 px edge at 60% |
| Value central | 1.5 px dashed `4 3` |
| Current price rule | 1 px solid, neutral 700, label at top |
| Up/down colours | `--fin-up`, `--fin-down` (locale-mapped) |
| Candle min body width | 3 px; gap ≥1 px |
| Volume panel height | 20–25% of price panel |
| Football field bar height | 16–20 px, 8–12 px gap |
| Waterfall colours | `--wf-increase`, `--wf-decrease`, `--wf-total` (neutral) |
| Waterfall connector | 1 px, neutral 400 |

## Implementation sketch
Football field as semantic HTML with CSS positioning; ranges are `[low, high]` mapped to a shared domain.
```html
<figure class="ff" style="--min: 80; --max: 220; --price: 118; --point: 142">
  <figcaption id="ff-cap">Value per share by method (USD). Current price $118.</figcaption>
  <ul aria-labelledby="ff-cap">
    <li style="--lo: 96;  --hi: 131"><span class="m">52-week range</span><span class="r"><span class="lo">$96</span><span class="hi">$131</span></span></li>
    <li style="--lo: 110; --hi: 158"><span class="m">Trading comps · EV/EBITDA 9–12×</span><span class="r"><span class="lo">$110</span><span class="hi">$158</span></span></li>
    <li style="--lo: 125; --hi: 176"><span class="m">Precedent transactions</span><span class="r"><span class="lo">$125</span><span class="hi">$176</span></span></li>
    <li style="--lo: 118; --hi: 171" class="is-key"><span class="m">DCF · WACC 8–10%, g 2–3%</span><span class="r"><span class="lo">$118</span><span class="hi">$171</span></span></li>
  </ul>
  <div class="ref price" aria-hidden="true"><span>Price $118</span></div>
  <div class="ref point" aria-hidden="true"><span>Our estimate $142</span></div>
</figure>
```
```css
.ff { --w: calc(100% - 16rem); position: relative; }
.ff ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.ff li { display: grid; grid-template-columns: 16rem 1fr; align-items: center; }
.ff .r { position: relative; block-size: 18px;
  margin-inline-start: calc((var(--lo) - var(--min)) / (var(--max) - var(--min)) * 100%);
  inline-size: calc((var(--hi) - var(--lo)) / (var(--max) - var(--min)) * 100%);
  background: var(--chart-neutral); display: flex; justify-content: space-between; }
.ff .is-key .r { background: var(--chart-accent); }
.ff .lo, .ff .hi { font: 12px/18px var(--font-ui); font-variant-numeric: tabular-nums; }
.ff .lo { margin-inline-start: -4ch; } .ff .hi { margin-inline-end: -4ch; }
.ff .ref { position: absolute; inset-block: 0; inline-size: 0; border-inline-start: 1px solid var(--text-strong);
  inset-inline-start: calc(16rem + (var(--price) - var(--min)) / (var(--max) - var(--min)) * var(--w)); }
.ff .ref.point { border-inline-start-style: dashed;
  inset-inline-start: calc(16rem + (var(--point) - var(--min)) / (var(--max) - var(--min)) * var(--w)); }
.ff .ref span { position: absolute; inset-block-start: -1.5em; translate: -50% 0; font-size: 12px; white-space: nowrap; }
```
```ts
interface WaterfallStep { label: string; delta: number; kind?: "step" | "total" }
interface WaterfallBar { label: string; start: number; end: number; kind: "increase" | "decrease" | "total" }

export function toWaterfall(steps: ReadonlyArray<WaterfallStep>): WaterfallBar[] {
  let running = 0;
  return steps.map(({ label, delta, kind = "step" }) => {
    if (kind === "total") return { label, start: 0, end: running, kind: "total" };
    const start = running;
    running += delta;
    return { label, start, end: running, kind: delta >= 0 ? "increase" : "decrease" };
  });
}
```

## Checklist
- [ ] Price and value share one axis and unit; value is a range with a stated basis.
- [ ] Value is drawn as steps at filing dates, not interpolated.
- [ ] Candle colours follow the user's market setting and are backed by hollow/filled shapes.
- [ ] Football field has labelled low/high, consistent method order, and a current-price line.
- [ ] Waterfall totals anchor at zero, steps float, three colours, signed labels, no axis break.
- [ ] Table views exist for each chart with signed numbers.

## Sources
- https://robinhood.com/us/en/learn/articles/3YzdYQ8bI4XqfnYUNj3dac/what-is-a-candlestick
- https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend
- https://robinhood.com/us/en/support/articles/using-advanced-charts
- https://www.datawrapper.de/blog/waterfall-charts-guide
- https://www.sap.com/design-system/fiori-design-web/v1-136/ui-elements/waterfall-chart/usage
- https://corporatefinanceinstitute.com/resources/valuation/football-field-chart/
- https://www.wallstreetprep.com/knowledge/football-field-valuation-real-example-excel-template/
- https://www.datawrapper.de/blog/dualaxis/
- https://chrisgoldammer.notion.site/Stock-price-charts-4-22-2021-179a9339afd544eebee8fbd88d8d7dd1
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- See also ref-fintech-money-dashboards.md (product references) and chart-distributions-uncertainty.md (value ranges)
