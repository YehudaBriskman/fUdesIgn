# Fintech and money dashboards: Stripe, Mercury, Ramp, Robinhood, Wise

> A money dashboard should answer "how much is there, is that good, and where did it go" on the first screen, and every number should be one click from the records behind it.

**Category:** Reference gallery · **Applies to:** finance home pages, balance and cashflow views, spend analytics, portfolio pages, valuation tools · **Priority:** should

## When to use / when not
- Use this teardown when you design the landing page of a product whose main object is money: balances, revenue, spend, portfolio value or fair value.
- Use it to pick defaults such as the comparison period, chart-to-table linking, saved views and the colour rules for gain and loss.
- Don't copy consumer-trading patterns (Robinhood) into a professional analysis tool without changing them. Celebration, game-like mechanics and transaction emojis push people toward short-term action, and a regulator has ordered them removed (see Bad references).
- Don't copy marketing screenshots literally. They show ideal data with no empty states, no errors and short names.

## Rules (do)
**Stripe (payments)**
- Show a date range and a separate comparison range on the home overview, so every KPI tile can show its delta against a period the user chose. Stripe's Home has one dropdown for the range and one for the comparison range.
- Let users add and remove overview widgets (Stripe: **Add** under *Your overview*, select or unselect widgets, then **Apply**). Keep the set small and curated (3–6 headline tiles, per ref-design-review-rubric.md A2), not an open canvas.
- Put alerts that need action on the home page, above or beside the charts (Stripe surfaces unresolved disputes and identity verifications on Home).
- Mark data that is estimated or refreshes on a different schedule. Stripe's support page says the home charts "give you estimated information about your account activity". Copy this: a small "estimated" label plus a freshness time and a tooltip naming the refresh cadence. (An earlier draft cited a Stripe "lightning icon" for hourly charts; the current page doesn't mention it, so it is not claimed here.)
- Provide a `?` shortcut sheet and global search. Stripe documents `?` for its shortcuts list.
- Separate test and sandbox data from live data with a persistent, unmistakable mode indicator, never only a toggle state.
- Build the palette in a perceptually uniform colour space and check text and icon contrast across all hues. Stripe (Koopersmith and Miner, 2019) built its palette in CIELAB after finding that darkening colours to pass WCAG 2 made them "dark and muddy and it's difficult to tell the hues apart"; WCAG "intentionally only focuses on the contrast between a foreground and a background color", so hue distinctness and vibrancy need their own check.

**Mercury (business banking)**
- Link the chart to the table. Mercury's cashflow graph reflects whatever filters are applied to the transactions table below it, so there is one filter model, not two.
- Default the time window to the current month and allow zooming to specific days or a custom range.
- Summarise money in and out with the **top 5** sources each, grouped by account, card, category or merchant type. Lump the rest into "Other".
- Ship saved views ("Data Views") with three preinstalled defaults: *My transactions*, *Monthly money in*, *Monthly money out*. Let users save any filter combination as a named view.
- Use a calm visual style: mostly neutral surfaces, one thin accent line, and a large balance figure. (Mercury is often cited for this look in third-party teardowns; this is an observation, not a sourced finding.)

**Ramp (spend management)**
- Make every chart clickable. Ramp's reporting page says a user can go from a spike straight to the exact transactions behind it.
- Show budget against actual in real time, counting committed spend (Ramp: "every card swipe, bill paid, and PO committed"). Draw committed amounts as a separate layer from posted amounts so the reader sees both (our recommendation).
- Put the remaining budget on the decision screen (approvals), not only on the dashboard. Ramp shows approvers "what's left, what's committed, and all the context you need to make the right call".
- Ship pre-built dashboards that answer recurring questions (trend, top vendors, teams over budget) before offering a custom builder (Ramp: "Pre-built dashboards for the questions finance teams ask every single week").

**Robinhood (consumer investing)**
- Colour the whole-period line by the sign of change over the visible frame. Robinhood Legend: "If the last close price in the frame is higher than the first close price in the frame, the line is green", and red if lower. Its baseline chart colours price green above and red below a baseline the user drags up or down.
- Offer fixed time-range chips (Robinhood offers "1 day to MAX for stocks and ETFs, and 1 hour to 5 years for crypto"; the exact chip set is not documented) right under the chart. A chip changes the range, the colour and the headline delta together.
- Use press-and-hold scrubbing on touch to read any point. Move the headline number to the scrubbed value and restore it on release. (Common in consumer trading apps; not documented in the Robinhood help pages cited here.)
- State what the return is measured from. Robinhood documents that a security's daily return uses the previous market close at 4 PM ET, and crypto uses 12 AM in the user's local time zone.

**Wise (international money)**
- Make fees and rates explicit and itemised. Wise's mission page says "No asterisks. No small print. No hidden fees." and publishes its average fee (0.52% when checked in November 2026, a global average across a basket of currencies). In the UI, show the fee, the rate and the amount received as separate labelled lines before confirmation.
- Use one typeface system with full international script coverage, so amounts and labels don't fall back to mismatched fonts. (Wise pairs Inter, "140+ languages", with its display face Wise Sans, "342 languages", and adds dedicated fallback stacks for simplified Chinese, Japanese and Thai.)

## Anti-patterns (don't)
- Don't show a balance or revenue number without a comparison. Stripe, Mercury and Ramp all pair the number with a period delta, a budget or a breakdown. See ref-dashboard-anti-patterns.md, "No context".
- Don't celebrate with confetti or game mechanics on financial actions. Robinhood ceased its confetti "as of March 31, 2021" after the Massachusetts Securities Division's complaint. The January 2024 consent order ($7.5M fine) then requires it, for Massachusetts customers, to "Permanently cease the future use of confetti … or other celebratory imagery directly tied to frequency of trading" and to "Remove all emojis from the life-cycle of a transaction".
- Don't let the chart and the table filter separately. Users will read numbers from two different slices.
- Don't mix decimal counts for currency within one column or one KPI row (see ref-design-review-rubric.md, E3).
- Don't colour gain and loss only by red and green. Add a sign (+/−), an arrow or a label, and offer a colour-blind scheme (TradingView, Finviz and Bloomberg all do).

## Good references
- [Stripe Docs: Web Dashboard](https://docs.stripe.com/dashboard/basics). Shows a customisable overview, alerts on Home, `?` shortcut sheet, and separate sandboxes.
- [Stripe Support: Home page charts](https://support.stripe.com/questions/dashboard-home-page-charts-for-business-insights). Shows a date range plus a separate comparison range, and labels the charts as estimates.
- [Stripe: Designing accessible color systems (2019)](https://stripe.com/blog/accessible-color-systems). A CIELAB palette with contrast and hue distinctness checked together.
- [Mercury: Updated transactions page (July 2025)](https://mercury.com/blog/updated-transactions-page). Shows the chart linked to table filters, top-5 in and out, saved Data Views, and a current-month default.
- [Mercury Help: Insights page](https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview). Charts spend over time "using stacked bars, line graphs, or Sankey diagrams", with a compare tool for periods (e.g. this month vs. last month).
- [Ramp: Reporting](https://ramp.com/reporting). Every chart drills down to transactions, budgets show live against actual, and approval screens include context.
- [Robinhood Legend widgets](https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend) and [Using charts](https://robinhood.com/us/en/support/articles/using-charts). Document the colour-by-frame rule, the draggable baseline chart, the range span and the stated return basis.
- [Wise: mission roadmap](https://wise.com/mission-roadmap/). States the fee transparency commitment as a product principle.

## Bad references
- [CNBC: Robinhood gets rid of confetti amid gamification scrutiny (2021)](https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html) and the [Massachusetts consent order (2024)](https://www.sec.state.ma.us/divisions/securities/download/RH-Consent-Order.pdf). The order lists "Digital confetti raining down from the top of the screen after a customer's first trade" among the engagement practices it reviewed. Decoration that rewards activity is a liability in finance.
- Generic "fintech dashboard" Dribbble shots, for example as collected in roundups like [AdminLTE's fintech examples](https://adminlte.io/blog/fintech-dashboard-design-examples/). They often show 3D cards, gradient donuts and unlabeled sparklines. They look rich, but have no comparison period, no units and no drill-down.

## Accessibility
- Gain and loss must survive greyscale: use a sign character and an arrow icon with `aria-hidden`, and include "up" or "down" in the accessible name.
- Give every headline amount an accessible name that includes currency and period, for example "Net volume, last 7 days, $12,430, up 8% versus previous 7 days".
- Scrub interactions need a keyboard equivalent: arrow keys move the cursor, and Home and End jump to the ends.

## Motion / interaction
- Range chip change: crossfade the line over `--motion-dur-short` (150 ms) and rescale the y-axis over at most `--motion-dur-medium` (240 ms), per `assets/tokens.css`. Under reduced motion, swap instantly or crossfade only.
- Scrubbing must track the finger at 60 fps with no easing lag. Update the headline value on every frame.
- No celebratory motion on monetary actions.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--kpi-value-size` | 30–36px, weight 600, `tabular-nums` | headline balance; SKILL.md KPI card token |
| `--kpi-delta-size` | 13–14px | always sign plus % plus comparison label |
| `--chart-line-width` | 1.5–2px | single accent line (Mercury style) |
| `--area-fill-opacity` | 0.08–0.15 | gradient under the line, never solid |
| `--positive` / `--negative` | role tokens from `assets/tokens.css`, not raw green/red | swapped via `[data-money]` for red-up and CVD-safe schemes |
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
.kpi .value { font-size: 2rem; /* 32px, inside the 30–36px KPI range */ font-weight: 600; font-variant-numeric: tabular-nums; }
.kpi .delta[data-trend="up"]   { color: var(--positive); }
.kpi .delta[data-trend="down"] { color: var(--negative); }
.kpi .vs, .kpi .fresh { color: var(--text-muted); font-size: .8125rem; }
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
- https://stripe.com/blog/accessible-color-systems
- https://www.sec.state.ma.us/divisions/securities/download/RH-Consent-Order.pdf
- https://mercury.com/blog/updated-transactions-page
- https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview (rendered with a headless browser, November 2026)
- https://ramp.com/reporting
- https://robinhood.com/us/en/support/articles/widgets-in-robinhood-legend
- https://robinhood.com/us/en/support/articles/using-charts
- https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html
- https://wise.com/mission-roadmap/
- https://medium.com/transferwise-design/creating-a-wise-typographic-set-1052503f9f01 (read via web.archive.org, July 2025 snapshot)
- https://adminlte.io/blog/fintech-dashboard-design-examples/
