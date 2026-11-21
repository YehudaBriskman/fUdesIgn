# Fintech and money dashboards: Stripe, Mercury, Ramp, Robinhood, Wise

> A money dashboard should answer "how much is there, is that good, and where did it go" on the first screen, and every number should be one click from the records behind it.

**Category:** Reference gallery · **Applies to:** finance home pages, balance and cashflow views, spend analytics, portfolio pages, valuation tools · **Priority:** should

## When to use / when not
- Use this teardown when you design the landing page of a product whose main object is money: balances, revenue, spend, portfolio value or fair value.
- Use it to pick defaults such as the comparison period, chart-to-table linking, saved views and the colour rules for gain and loss.
- Don't copy consumer-trading patterns (Robinhood) into a professional analysis tool without changing them. Celebration, streaks and "you're up today" framing push people toward short-term action. Regulators have penalised that (see Bad references).
- Don't copy marketing screenshots literally. They show ideal data with no empty states, no errors and short names.

## Rules (do)
**Stripe (payments)**
- Show a date range and a separate comparison range on the home overview, so every KPI tile can show its delta against a period the user chose. Stripe's Home has one dropdown for the range and one for the comparison range.
- Let users add and remove overview widgets (Stripe: "Add" under *Your overview*, then select or unselect, then *Apply*). Keep the set small and curated: about 6–10 tiles, not an open canvas.
- Put alerts that need action on the home page, above or beside the charts (Stripe surfaces unresolved disputes and identity verifications on Home).
- Mark data that is estimated or refreshes on a different schedule. Stripe labels home charts as estimates and puts a lightning icon on charts that update hourly. Copy this: a small freshness glyph plus a tooltip naming the cadence.
- Provide a `?` shortcut sheet and global search. Stripe documents `?` for its shortcuts list.
- Separate test and sandbox data from live data with a persistent, unmistakable mode indicator, never only a toggle state.
- Build the palette in a perceptually uniform colour space and check text and icon contrast across all hues. Stripe's accessible-colour work found that WCAG 2 contrast alone did not keep hues distinguishable, so they also tuned colour vividness.

**Mercury (business banking)**
- Link the chart to the table. Mercury's cashflow graph reflects whatever filters are applied to the transactions table below it, so there is one filter model, not two.
- Default the time window to the current month and allow zooming to specific days or a custom range.
- Summarise money in and out with the **top 5** sources each, grouped by account, card, category or merchant type. Lump the rest into "Other".
- Ship saved views ("Data Views") with three preinstalled defaults: *My transactions*, *Monthly money in*, *Monthly money out*. Let users save any filter combination as a named view.
- Use a calm visual style. Third-party teardowns repeatedly name Mercury the benchmark for a calm, credible banking UI: mostly neutral surfaces, one thin accent line, and a large balance figure.

**Ramp (spend management)**
- Make every chart clickable. Ramp's reporting page says a user can go from a spike straight to the exact transactions behind it.
- Show budget against actual in real time, with committed amounts (purchase orders, pending bills) as a separate layer from posted amounts.
- Put the remaining budget on the decision screen (approvals), not only on the dashboard. Context belongs where the decision happens.
- Ship pre-built dashboards that answer recurring questions (trend, top vendors, teams over budget) before offering a custom builder.

**Robinhood (consumer investing)**
- Colour the whole-period line by the sign of change over the visible frame: green if the last value is above the first, red if below. Robinhood Legend documents exactly this rule, and a baseline chart that colours above and below a draggable baseline.
- Offer fixed time-range chips (1D, 1W, 1M, 3M, 1Y, 5Y, MAX) right under the chart. A chip changes the range, the colour and the headline delta together.
- Use press-and-hold scrubbing on touch to read any point. Move the headline number to the scrubbed value and restore it on release.
- State what the return is measured from. Robinhood documents that securities are measured from the prior 4 PM ET close, and crypto from midnight local time.

**Wise (international money)**
- Make fees and rates explicit and itemised. Wise's mission page commits to "no hidden fees" and publishes its average fee (0.53%). In the UI, show the fee, the rate and the amount received as separate labelled lines before confirmation.
- Use one typeface system with full international script coverage, so amounts and labels don't fall back to mismatched fonts. Wise rebuilt Wise Sans to cover Greek and Cyrillic.

## Anti-patterns (don't)
- Don't show a balance or revenue number without a comparison. Stripe, Mercury and Ramp all pair the number with a period delta, a budget or a breakdown. See ref-dashboard-anti-patterns.md, "No context".
- Don't celebrate with confetti or game mechanics on financial actions. Robinhood removed confetti in March 2021 under gamification scrutiny, and the Massachusetts consent order required it to "permanently cease" its use.
- Don't let the chart and the table filter separately. Users will read numbers from two different slices.
- Don't mix 0- and 2-decimal currency in one context (see ref-design-review-rubric.md, E3).
- Don't colour gain and loss only by red and green. Add a sign (+/−), an arrow or a label, and offer a colour-blind scheme (TradingView, Finviz and Bloomberg all do).

## Good references
- [Stripe Docs: Web Dashboard](https://docs.stripe.com/dashboard/basics). Shows a customisable overview, alerts on Home, `?` shortcut sheet, and separate sandboxes.
- [Stripe Support: Home page charts](https://support.stripe.com/questions/dashboard-home-page-charts-for-business-insights). Shows a range plus a separate comparison range, estimate labelling and an hourly-update icon.
- [Stripe: Designing accessible color systems](https://stripe.com/blog/accessible-color-systems). A perceptually uniform palette with contrast and hue distinctness checked together.
- [Mercury: Updated transactions page](https://mercury.com/blog/updated-transactions-page). Shows the chart linked to table filters, top-5 in and out, saved Data Views, and a current-month default.
- [Mercury Help: Insights page](https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview). Offers stacked bar, line and Sankey views with side-by-side period compare.
- [Ramp: Reporting](https://ramp.com/reporting). Every chart drills down to transactions, budgets show live against actual, and approval screens include context.
- [Robinhood Legend widgets](https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend) and [Using charts](https://robinhood.com/us/en/support/articles/using-charts). Document the colour-by-frame rule, the baseline chart, range chips and the stated return basis.
- [Wise: mission roadmap](https://wise.com/mission-roadmap/). States the fee transparency commitment as a product principle.

## Bad references
- [CNBC: Robinhood gets rid of confetti amid gamification scrutiny (2021)](https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html). Celebration animations on trades drew a regulatory complaint. Decoration that rewards activity is a liability in finance.
- Generic "fintech dashboard" Dribbble shots, for example as collected in roundups like [AdminLTE's fintech examples](https://adminlte.io/blog/fintech-dashboard-design-examples/). They often show 3D cards, gradient donuts and unlabeled sparklines. They look rich, but have no comparison period, no units and no drill-down.

## Accessibility
- Gain and loss must survive greyscale: use a sign character and an arrow icon with `aria-hidden`, and include "up" or "down" in the accessible name.
- Give every headline amount an accessible name that includes currency and period, for example "Net volume, last 7 days, $12,430, up 8% versus previous 7 days".
- Scrub interactions need a keyboard equivalent: arrow keys move the cursor, and Home and End jump to the ends.

## Motion / interaction
- Range chip change: crossfade the line in 150–200 ms. Don't animate the y-axis rescale for longer than 250 ms.
- Scrubbing must track the finger at 60 fps with no easing lag. Update the headline value on every frame.
- No celebratory motion on monetary actions.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--kpi-value-size` | 28–32px, weight 500–600, `tabular-nums` | headline balance |
| `--kpi-delta-size` | 13–14px | always sign plus % plus comparison label |
| `--chart-line-width` | 1.5–2px | single accent line (Mercury style) |
| `--area-fill-opacity` | 0.08–0.15 | gradient under the line, never solid |
| `--color-gain` / `--color-loss` | role tokens, not raw green/red | pair with a CVD-safe alternative scheme |
| Top-N breakdown | 5 plus "Other" | Mercury's money in and out |
| Default range | current month (banking), 7 or 30 days (payments) | always with a comparison |
| Freshness badge | icon plus "Updated 12:04" | Stripe hourly icon pattern |

## Implementation sketch
```html
<section class="kpi" aria-labelledby="nv-label">
  <h3 id="nv-label">Net volume <span class="period">Last 7 days</span></h3>
  <p class="value"><data value="12430.00">$12,430.00</data></p>
  <p class="delta" data-trend="up">
    <span aria-hidden="true">▲</span> +8.2%
    <span class="vs">vs previous 7 days ($11,488.10)</span>
  </p>
  <p class="fresh"><time datetime="2026-11-21T12:04">Updated 12:04</time> · estimated</p>
</section>
```
```css
.kpi .value { font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.kpi .delta[data-trend="up"]   { color: var(--color-gain); }
.kpi .delta[data-trend="down"] { color: var(--color-loss); }
.kpi .vs, .kpi .fresh { color: var(--text-secondary); font-size: .8125rem; }
```
```ts
type Trend = "up" | "down" | "flat";
export function frameTrend(points: readonly number[]): Trend {
  const first = points.at(0), last = points.at(-1);
  if (first === undefined || last === undefined || last === first) return "flat";
  return last > first ? "up" : "down"; // Robinhood Legend rule: compare frame endpoints
}
```

## Checklist
- [ ] Every headline amount has a comparison (period, budget or target) and states the comparison basis.
- [ ] The chart and table share one filter state, and the filters are in the URL.
- [ ] Clicking any bar or point leads to the underlying records.
- [ ] Gain and loss are readable without colour (sign plus icon), and a CVD palette exists.
- [ ] Estimated or delayed data is labelled with its freshness.
- [ ] Fees, rates and totals are itemised before any money-moving confirmation.
- [ ] No celebratory animation on financial actions.

## Sources
- https://docs.stripe.com/dashboard/basics
- https://support.stripe.com/questions/dashboard-home-page-charts-for-business-insights
- https://stripe.com/blog/accessible-color-systems (via summaries; primary page not fetchable)
- https://mercury.com/blog/updated-transactions-page
- https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview
- https://ramp.com/reporting
- https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend
- https://robinhood.com/us/en/support/articles/using-charts
- https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html
- https://wise.com/mission-roadmap/
- https://medium.com/transferwise-design/creating-a-wise-typographic-set-1052503f9f01
- https://adminlte.io/blog/fintech-dashboard-design-examples/
