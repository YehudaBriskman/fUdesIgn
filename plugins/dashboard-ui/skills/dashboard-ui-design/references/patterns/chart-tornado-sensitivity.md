# Tornado charts, sensitivity grids and probability headlines

> Show which inputs move the answer most with a sorted tornado around a labelled base case. Show two-input interactions as a coloured table, not a surface. State every probability as a count of outcomes with its sample size ("410 of 5,000 draws, 8%").

**Category:** Charts and data visualisation · **Applies to:** valuation models, DCF and Monte Carlo output, forecasts, pricing models, capacity plans, any "what drives this number" view · **Priority:** should (must when a model output is the page's headline)

## When to use / when not
| Question | Chart | Notes |
|---|---|---|
| "Which inputs matter most, one at a time?" | **Tornado** (horizontal floating bars around the base case) | One-way sensitivity. 4–12 inputs. |
| "How do two inputs interact?" | **Sensitivity grid** (table + sequential or diverging cell colour) | Two-way. 5×5 to 7×7 cells. |
| "How does the output respond across an input's whole range?" | **Spider / line chart** (output vs % change in input, one line per input) | Use when responses are non-linear. |
| "How likely is value above price?" | **Histogram or quantile dot plot split at the threshold**, with a count headline | See `chart-distributions-uncertainty.md` for bins and bands. |
| "Which named story is most likely?" | Scenario comparison, not sensitivity | See `chart-scenario-comparison.md`. |

- **Don't** use a tornado to claim that two inputs together are safe. It varies one input at a time. Two plausible bad values at once can move the output more than any single bar. Show the top pair as a two-way grid.
- **Don't** use a 3D surface for two-way sensitivity. Readers can't read values off it, and occlusion hides cells.
- **Don't** headline a probability from fewer than about 1,000 simulation draws without showing its uncertainty. At n = 1,000, a true 8% has a standard error of about 0.9 points.

## Rules (do)
**Tornado**
- **One bar per input.** The bar spans the output at the input's low test value to the output at its high test value.
- **Sort by swing**, widest at the top. Oracle's Crystal Ball docs and the health-economics glossaries put the most influential input first. Never sort alphabetically or by model order.
- **Base case as a vertical rule** through all bars, labelled with its value ("Base $142"). Bars extend left (lower output) and right (higher output) from it.
- **State the test range per input** in the row label: "WACC 8.0–10.0%", "Terminal growth 2.0–3.0%". Use the same rule for every input: either the same percentiles of each input's distribution (for example P10–P90) or a stated ±% change. Say which in the subtitle. Mixed rules make bar lengths incomparable.
- **Colour by input direction, not by good or bad.** Use two neutral-to-accent tones: one for "input at low value", one for "input at high value". Crystal Ball shows the inverse relationship by swapping the colours on that row. Never use money red and green here, since a lower value isn't a loss (see `color-semantic-status.md`).
- **Label both ends with the output value** in `tabular-nums` ("$118 ← → $171"). The axis is in output units.
- **Include the current price or target as a second reference rule** when one exists, so the reader sees which inputs alone can flip the verdict (see `data-verdict-rating-badges.md`).
- **Cap at about 10–12 bars.** Group the rest as "Other inputs (7), each < $2 swing" so the tail isn't hidden but doesn't dominate.
- **Mark non-monotonic inputs.** If the output peaks inside an input's range, draw the bar's extreme with a small tick and note "peak at 2.6%". Crystal Ball switches such charts to one colour because left/right no longer means low/high.

**Sensitivity grid (two-way)**
- **Rows and columns are the two inputs** with even steps. Keep the range narrow: FE Training's worked DCF example steps WACC (5.6–6.0%) and terminal growth (1.8–2.2%) by 0.1 point each, and recommends not sensitising either by more than 0.5 point.
- **The base cell sits in the centre**, outlined 2px and labelled "base". Odd counts (5×5, 7×7) keep it centred.
- **Colour encodes the output relative to a reference.** Use a diverging scale centred on the current price (value above price on one side), or a sequential scale when there's no reference. Use 5–7 steps, not a continuous rainbow. See `color-dataviz-palettes.md`.
- **Every cell keeps its number as text.** Colour is a second channel. The grid must work in greyscale.
- **Blank out invalid cells** (for example terminal growth ≥ WACC, where a perpetuity-growth terminal value explodes or goes negative). Show "n/a" with a footnote, never a huge number.
- **Show 1 decimal less than the editor.** If the inputs are edited at 0.01%, the grid shows 0.1% steps and whole dollars (see `data-number-formatting.md`).

**Probability headlines**
- **Count first, then percent, then n:** "Value beats price in 410 of 5,000 draws (8%)". Gigerenzer and Hoffrage (1995) found people reason more accurately with frequencies than with single-event probabilities.
- **Never "8% chance the stock is undervalued."** The model output is conditional on the model's assumptions. Write "in 8% of simulated outcomes under these assumptions" and link to the input distributions (see `found-methodology-explainability.md`).
- **Pair it with a frequency chart.** A quantile dot plot of 20–50 dots or a histogram split at the price. Fernandes et al. (2018) found 50-dot quantile dot plots led to decisions at about 97% of the optimal payoff.
- **Round honestly.** Show whole percents. Show "< 1%" rather than "0%" when any draws hit. Show "0 of 5,000" rather than "never".
- **State the seed and draw count** in the footer so a rerun is reproducible ("5,000 draws · seed 42 · run Nov 20").

## Anti-patterns (don't)
- An unsorted tornado, or one sorted by the order of inputs in the model.
- Bars drawn from zero instead of from the base case. That makes it a bar chart of levels, not swings.
- Different test ranges per input with no label ("±10%" for one, "P5–P95" for another).
- Red/green tornado bars that read as loss/gain.
- A WACC × growth grid with cells where g ≥ WACC showing "$12,480".
- A heat map with no numbers, or a rainbow scale.
- "8.3471% probability" from 1,000 draws. That is false precision.
- Probability as a gauge or a speedometer (see `chart-pies-donuts-gauges.md`).
- A tornado as the only uncertainty view. It shows sensitivity, not likelihood. Pair it with the distribution.

## Good references
- [Oracle Crystal Ball: Tornado chart](https://docs.oracle.com/cd/E36352_01/epm.1112/cb_user/ch09s05s01.html) — largest swing at the top, bars extend left and right of the base case, colours swap for inverse relationships, and non-monotonic inputs collapse to one colour.
- [Clemen and Reilly, *Making Hard Decisions*, ch. 5 lecture notes (GWU EMSE 269)](https://www2.seas.gwu.edu/~dorpjr/EMSE269/Lecture%20Notes/Chapter%205.pdf) — tornado diagrams as the first screen for which variables matter, followed by two-way analysis of the top pair.
- [YHEC glossary: Tornado diagram](https://www.yhec.co.uk/glossary/tornado-diagram/) — the health-economics convention: one-way analyses ranked by spread around the base-case result.
- [Kay, Kola, Hullman, Munson: When(ish) is my bus? (CHI 2016)](https://idl.uw.edu/papers/when-ish-is-my-bus) — quantile dot plots beat density plots for probability estimates on small screens.
- [Fernandes et al.: Uncertainty displays using quantile dotplots or CDFs improve transit decision-making (CHI 2018)](https://www.hullmanlab.northwestern.edu/paper%20discrete-outcome/2018/01/01/uncertainty-bus.html) — 50-dot plots reached about 97% of the optimal expected payoff.
- [Gigerenzer and Hoffrage, How to improve Bayesian reasoning without instruction (1995)](https://pages.ucsd.edu/~scoulson/203/GG_How_1995.pdf) — the frequency-format evidence behind "410 of 5,000".
- [FE Training: DCF sensitizing for key variables](https://www.fe.training/?p=10001433) — the standard WACC × terminal-growth grid with the base case in the middle.

## Bad references
- Spreadsheet "data tables" pasted into dashboards with Excel's default red-yellow-green conditional formatting and 2-decimal dollars in every cell. Readers see traffic-light judgements and noise, not the shape.
- [YHEC glossary: Tornado diagram](https://www.yhec.co.uk/glossary/tornado-diagram/) and the same GWU notes — both warn that one-way bars hide joint effects. Dashboards that show only a tornado inherit the blind spot.
- Retail "probability of profit" widgets that show one percent with no draw count, no assumptions link and three decimals.

## Accessibility
- The tornado is a list: `<ol>` in swing order, each item "WACC 8.0 to 10.0 percent: value $171 to $118, swing $53". Screen readers get the ranking for free.
- The grid is a real `<table>` with `<th scope="col">` and `<th scope="row">` headers, and a `<caption>` that names both inputs, the output and the base cell. Mark the base cell with `aria-current="true"` or visually hidden text "(base case)".
- Cell colours meet 3:1 against neighbours only if the number isn't printed. Since it is printed, text in each cell must reach 4.5:1 on its own fill. Switch text to the light or dark ink per cell.
- The probability headline is plain text, never only a chart.
- Under `forced-colors: active`, keep the numbers and draw the base cell outline in `CanvasText`.

## Motion / interaction (if relevant)
- Hover or focus on a tornado bar shows the input's test values and the output at each end. Click opens that input in the assumption editor (see `comp-assumption-editor-panel.md`).
- When an assumption changes, re-sort the tornado with a 200–300ms position transition, or cut instantly under reduced motion (see `motion-chart-transitions.md`). Don't animate bars growing from zero.
- Grid: hover highlights the row and column headers. Arrow keys move a roving focus across cells.

## Tokens and values
| Token | Default | Use |
|---|---|---|
| `--tornado-low` | `--cat-1` at 70% | output when the input is at its low test value |
| `--tornado-high` | `--cat-2` at 70% | output when the input is at its high test value |
| Bar height / gap | 16–20px / 6–8px | tornado rows |
| Max bars | 10–12, then "Other (n)" | tornado |
| Base rule | 1px solid `--text`, labelled | tornado and spider |
| Reference rule (price) | 1px dashed `--text-muted` | tornado |
| Grid size | 5×5 or 7×7, odd | two-way |
| Grid steps | 0.5pt WACC × 0.25pt growth (DCF) | two-way |
| Grid scale | 5–7 diverging steps centred on price | two-way |
| Base cell | 2px outline `--text` | two-way |
| Min draws for a headline | 1,000 (prefer ≥ 5,000) | probability |
| Dot plot | 20–50 dots | probability |

## Implementation sketch
```ts
export interface InputSwing {
  id: string
  label: string
  lowLabel: string   // "8.0%"
  highLabel: string  // "10.0%"
  outputAtLow: number
  outputAtHigh: number
}

export interface TornadoRow extends InputSwing {
  swing: number
  left: number   // min output
  right: number  // max output
  inverse: boolean
}

/** Sort one-way sensitivities by swing, widest first, and fold the tail into one row. */
export function toTornado(
  inputs: ReadonlyArray<InputSwing>,
  maxRows = 10,
): { rows: TornadoRow[]; other: { count: number; maxSwing: number } | null } {
  const rows = inputs
    .map((i): TornadoRow => ({
      ...i,
      swing: Math.abs(i.outputAtHigh - i.outputAtLow),
      left: Math.min(i.outputAtLow, i.outputAtHigh),
      right: Math.max(i.outputAtLow, i.outputAtHigh),
      inverse: i.outputAtHigh < i.outputAtLow,
    }))
    .sort((a, b) => b.swing - a.swing)
  const head = rows.slice(0, maxRows)
  const tail = rows.slice(maxRows)
  return {
    rows: head,
    other: tail.length ? { count: tail.length, maxSwing: Math.max(...tail.map((r) => r.swing)) } : null,
  }
}

/** "410 of 5,000 draws (8%)": count first, honest rounding. */
export function probabilityHeadline(hits: number, draws: number, locale = 'en-US'): string {
  const n = new Intl.NumberFormat(locale)
  const share = hits / draws
  const pct = hits > 0 && share < 0.01 ? '< 1%'
    : hits < draws && share > 0.99 ? '> 99%'
    : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(share)
  return `${n.format(hits)} of ${n.format(draws)} draws (${pct})`
}
```
```html
<figure class="tornado" style="--min: 90; --max: 200; --base: 142; --price: 118">
  <figcaption id="tor-cap">What moves value per share most (USD). Each input tested P10–P90, others at base.</figcaption>
  <ol aria-labelledby="tor-cap">
    <li style="--l: 118; --r: 171" data-inverse>
      <span class="in">WACC 8.0–10.0%</span>
      <span class="bar"><span class="lo">$118</span><span class="hi">$171</span></span>
      <span class="sr-only">Value $171 at 8.0%, $118 at 10.0%, swing $53</span>
    </li>
    <li style="--l: 128; --r: 160">
      <span class="in">Terminal growth 2.0–3.0%</span>
      <span class="bar"><span class="lo">$128</span><span class="hi">$160</span></span>
      <span class="sr-only">Value $128 at 2.0%, $160 at 3.0%, swing $32</span>
    </li>
  </ol>
  <div class="rule base" aria-hidden="true"><span>Base $142</span></div>
  <div class="rule price" aria-hidden="true"><span>Price $118</span></div>
</figure>
```
```css
.tornado { --label: 14rem; position: relative; }
.tornado ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.tornado li { display: grid; grid-template-columns: var(--label) 1fr; align-items: center; }
.tornado .bar {
  position: relative; block-size: 18px; display: flex; justify-content: space-between;
  margin-inline-start: calc((var(--l) - var(--min)) / (var(--max) - var(--min)) * 100%);
  inline-size: calc((var(--r) - var(--l)) / (var(--max) - var(--min)) * 100%);
  background: linear-gradient(to right,
    var(--tornado-low, var(--cat-1)) 0 calc((var(--base) - var(--l)) / (var(--r) - var(--l)) * 100%),
    var(--tornado-high, var(--cat-2)) 0);
}
.tornado li[data-inverse] .bar {
  background: linear-gradient(to right,
    var(--tornado-high, var(--cat-2)) 0 calc((var(--base) - var(--l)) / (var(--r) - var(--l)) * 100%),
    var(--tornado-low, var(--cat-1)) 0);
}
.tornado .lo, .tornado .hi { font-size: 12px; line-height: 18px; font-variant-numeric: tabular-nums; }
.tornado .lo { margin-inline-start: -4.5ch; }
.tornado .hi { margin-inline-end: -4.5ch; }
.tornado .rule { position: absolute; inset-block: 0; border-inline-start: 1px solid var(--text);
  inset-inline-start: calc(var(--label) + (var(--base) - var(--min)) / (var(--max) - var(--min)) * (100% - var(--label))); }
.tornado .rule.price { border-inline-start: 1px dashed var(--text-muted);
  inset-inline-start: calc(var(--label) + (var(--price) - var(--min)) / (var(--max) - var(--min)) * (100% - var(--label))); }
.tornado .rule span { position: absolute; inset-block-start: -1.5em; translate: -50% 0; font-size: 12px; white-space: nowrap; }
.sens td[aria-current="true"] { outline: 2px solid var(--text); outline-offset: -2px; }
.sens td { font-variant-numeric: tabular-nums; text-align: end; }
@media (forced-colors: active) { .tornado .bar { background: CanvasText; } }
```

## Checklist
- [ ] Tornado bars are sorted by swing, widest first, and start from a labelled base-case rule.
- [ ] Every row states its test range, and all rows use the same range rule (named in the subtitle).
- [ ] Bar colours encode input direction, not gain or loss. No money red/green.
- [ ] The top two inputs also appear as a two-way grid with a centred, outlined base cell.
- [ ] Grid cells keep their numbers, invalid cells read "n/a" with a footnote, and the scale has 5–7 steps.
- [ ] Probabilities read "X of N draws (P%)", with honest rounding ("< 1%"), the draw count and a link to assumptions.
- [ ] The tornado is an `<ol>` and the grid a `<table>` with headers and caption.

## Sources
- https://docs.oracle.com/cd/E36352_01/epm.1112/cb_user/ch09s05s01.html
- https://docs.oracle.com/cd/E36352_01/epm.1112/cb_user/apgs06.html (bibliography: Clemen 1997; Morgan and Henrion 1990)
- https://www2.seas.gwu.edu/~dorpjr/EMSE269/Lecture%20Notes/Chapter%205.pdf (read via web.archive.org; tornado diagram, then two-way sensitivity on the top variables)
- https://www.yhec.co.uk/glossary/tornado-diagram/ (bars with the greatest spread at the top)
- https://sk.sagepub.com/ency/edvol/embed/medical/chpt/tornado-diagram (largest range at the top)
- https://idl.uw.edu/papers/when-ish-is-my-bus
- https://www.hullmanlab.northwestern.edu/paper%20discrete-outcome/2018/01/01/uncertainty-bus.html
- https://pages.ucsd.edu/~scoulson/203/GG_How_1995.pdf (frequency formats improve Bayesian reasoning)
- https://www.fe.training/?p=10001433 (example grid in 0.1-point steps; sensitise WACC and growth by no more than 0.5%)
- https://clauswilke.com/dataviz/visualizing-uncertainty.html
- Repo: patterns/chart-distributions-uncertainty.md, patterns/chart-financial-price-value.md
