# Pricing tables

> Show real prices for 3–4 tiers with the billing unit, currency and tax status next to every number, recommend at most one plan, state the annual saving honestly, and put the full comparison in a real `<table>` with row and column headers.

**Category:** Sections · **Applies to:** pricing pages, pricing sections on home pages, plan comparison tables, billing toggles, enterprise CTAs · **Priority:** must

## When to use / when not
- Use plan cards plus a comparison table for any self-serve product with 2+ paid tiers.
- Use "Contact sales" only for the enterprise tier, never as the only way to learn any price. NN/g's B2B studies found price was the information business buyers wanted most. Participants left sites that hid it and went to competitors, and hidden prices created a negative halo over the whole brand.
- If the price really varies (usage, seats, volume), show a starting price, a per-unit rate and 2–3 worked examples ("A team of 10 with 1 TB transfer pays about $X"). NN/g recommends representative scenarios over complex configurators, which users found slow and error-prone.
- Don't build a pricing table for a single plan; a price line beside the CTA is enough.

## Rules (do)
- **3–4 tiers.** Typical shape: Free or trial, a team tier, a business tier, Enterprise. Current examples: Linear shows Free, Basic, Business and Enterprise; Tailscale shows Personal, Standard, Premium and Enterprise; Vercel shows Hobby, Pro and Enterprise. Past 4 cards, a desktop row no longer fits a 72rem container at a readable width (about 260px per card minimum).
- **Recommend at most one plan.** Give it a text badge ("Most popular" or "Recommended for teams"), a 2px `--accent` border and the only filled primary CTA. The other cards get secondary CTAs (see `mkfound-cta-and-conversion.md`). Tailscale labels Standard "Most popular". Only use "Most popular" if it is true.
- **Grade the decoy evidence.** Ariely's Economist example (*Predictably Irrational*, 2008: 100 MIT students; adding a print-only option at the same price as print+web moved print+web from 32% to 84%) is a single classroom study, retold widely. Frederick, Lee and Baskin (JMR 2014, "The Limits of Attraction") found the attraction effect weak or absent with more realistic stimuli. A 2024 Kobe University field experiment found a decoy plan did lift sales on one subscription platform. Conclusion: anchoring with a visible higher tier is plausible. A deliberately useless decoy tier is a manipulation with unreliable payoff. Don't build one.
- **Price per what unit.** Every price carries its unit and period in the same line: "$16 per user / month". Linear and Tailscale price per user per month; Basecamp charges a flat price per account with no per-user fees, and says so. Vercel prices usage per unit (per 1M requests, per GB) with included amounts stated.
- **Monthly/annual toggle, shown honestly.**
  - Default to the period most buyers choose, and say which one the cards show ("Billed yearly").
  - Show the saving as both the percentage and the money: "Save 20% ($48 a year vs $20 monthly)". Compute it from the real monthly price.
  - When annual is selected, show the per-month equivalent **and** the amount charged per year ("$16/month, $192 billed yearly").
  - Use a radio group or segmented control, not a bare checkbox switch with no labels.
- **Currency and tax.** Show the currency symbol and code when the audience is international ("US$16" or "$16 USD"), say whether tax is included ("Prices exclude VAT"; Vercel states "USD, excluding taxes"), and localise only if checkout charges the same currency.
- **Free trial vs freemium.** Say exactly which one it is and what happens at the end. Basecamp states a 30-day trial with no card and no automatic charge. If a card is required, say so on the CTA ("Start 14-day trial, card required").
- **Feature comparison as a real `<table>`.** Plans are column headers (`<th scope="col">`), features are row headers (`<th scope="row">`), groups use a heading row or `<tbody>` per group. Use text values ("10", "Unlimited", "Included", "—" with visually hidden "Not included"), not icon-only checkmarks.
- **Sticky plan header on long comparisons.** If the table is taller than about 1.5 screens, pin the plan names (and prices) to the top. Baymard's comparison-tool testing found that users scroll back up to recall which column is which, and sticky column headings fixed it. Offset the sticky header below any sticky site header.
- **Enterprise:** "Contact sales" plus 3–5 concrete reasons (SSO/SAML, audit logs, SLA, invoicing). Linear, Vercel and Tailscale all do this.
- **Card copy budget:** plan name, one-line "for whom", price block, CTA, then 4–6 highlights starting with "Everything in Basic, plus:". The full list lives in the table.

## Anti-patterns (don't)
- "Contact us for pricing" on every tier.
- Showing an annual per-month price without saying it is billed annually.
- A crossed-out "original" price that was never charged.
- Two highlighted plans, or a highlight on the most expensive plan to push it.
- Comparison grids built from `<div>`s with checkmark icons and no text alternative.
- Prices without unit or currency ("16").
- A toggle that moves the layout or changes card heights when switched.

## Good references
- [Linear pricing](https://linear.app/pricing) — 4 tiers, per-user unit, "Billed yearly" stated beside the price, a full comparison table and "Contact sales" for Enterprise only. It shows only annual prices, so there is no saving to misstate.
- [Tailscale pricing](https://tailscale.com/pricing) — one "Most popular" plan, a free Personal tier with stated limits (6 users), and a comparison grouped into named categories.
- [Vercel pricing](https://vercel.com/pricing) — states "USD, excluding taxes", lists included usage and per-unit overage rates (from $2 per 1M requests beyond 10M).
- [Basecamp pricing](https://basecamp.com/pricing) — flat per-account prices with no per-user fees, a 30-day no-card trial, and plain cancellation terms.
- [NN/g: State the price](https://www.nngroup.com/articles/show-price/) — the research case for showing prices and sample scenarios.

## Bad references
- [NN/g: Show prices for common scenarios](https://www.nngroup.com/articles/show-prices-for-common-scenarios/) — documents sites that hide variable prices behind forms, and the cost in lost prospects.
- Feature inconsistency between card and table: at the time of review, Basecamp's Freelancer card listed tools (templates, time tracking) that its own comparison table marked as not included. Generate cards and table from one data source.
- Generic "Contact us for a quote" B2B sites (no named company): NN/g's participants abandoned them for competitors that showed prices.

## Accessibility
- The comparison uses `<table>` with a `<caption>`, `<th scope="col">` for plans and `<th scope="row">` for features. Never `display: grid` on table elements, which removes table semantics in some browsers.
- "Not included" cells have text (visually hidden if a dash is shown). Checkmark SVGs have `aria-hidden="true"` with a text sibling.
- The billing toggle is a `<fieldset>` with a `<legend>` and two radios. Changing it updates prices in place, so announce the change in a polite live region ("Showing annual prices").
- The sticky header must not cover focused cells (SC 2.4.11): add `scroll-padding-top` equal to the sticky height.
- Price text meets 4.5:1; the recommended badge isn't conveyed by colour alone.

## Motion / interaction (if relevant)
- Toggle price changes swap instantly or crossfade within `--motion-dur-short` (150ms). No count-up animations on prices. Reserve width with `font-variant-numeric: tabular-nums` and a min-width so the layout doesn't shift.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-container` | 72rem | card row width |
| Card min width | 260px | 4 cards max per row |
| `--mk-card-radius` / `--mk-card-pad` | 12px / clamp(20px … 32px) | plan cards |
| Recommended border | 2px `--accent` | one card only |
| Price | `--mk-step-3`, tabular-nums | |
| `--mk-sticky-offset` (new) | height of the sticky site header, e.g. 64px | sticky table header `top` |
| Highlights per card | 4–6 | |
| Toggle crossfade | `--motion-dur-short` 150ms | |

## Implementation sketch
```html
<fieldset class="billing"><legend>Billing period</legend>
  <label><input type="radio" name="period" value="month"> Monthly</label>
  <label><input type="radio" name="period" value="year" checked> Yearly <span>save 20% ($48/year)</span></label>
</fieldset>
<p class="visually-hidden" role="status" id="period-status"></p>
<table class="compare">
  <caption>Compare plans. Prices in USD, per user per month, billed yearly, excluding VAT.</caption>
  <thead><tr><td></td><th scope="col">Free</th><th scope="col">Team <span>Recommended</span></th><th scope="col">Business</th></tr></thead>
  <tbody>
    <tr><th scope="row">Members</th><td>Up to 3</td><td>Unlimited</td><td>Unlimited</td></tr>
    <tr><th scope="row">SAML SSO</th><td><span aria-hidden="true">—</span><span class="visually-hidden">Not included</span></td><td><span aria-hidden="true">—</span><span class="visually-hidden">Not included</span></td><td>Included</td></tr>
  </tbody>
</table>
```
```css
:root { --mk-sticky-offset: 64px; scroll-padding-block-start: calc(var(--mk-sticky-offset) + 8px); }
.plans {
  display: grid; gap: var(--mk-grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  inline-size: min(100% - 2 * var(--mk-gutter), var(--mk-container)); margin-inline: auto;
}
.plan { padding: var(--mk-card-pad); border: 1px solid var(--border); border-radius: var(--mk-card-radius); background: var(--surface); }
.plan[data-recommended] { border: 2px solid var(--accent); }
.plan__price { font: 700 var(--mk-step-3) / 1 var(--mk-font-display); font-variant-numeric: tabular-nums; }
.compare { inline-size: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.compare th, .compare td { padding: var(--space-3, 12px); border-block-end: 1px solid var(--border); text-align: start; }
.compare thead th { position: sticky; inset-block-start: var(--mk-sticky-offset); background: var(--canvas); z-index: 1; }
.compare tbody th { font-weight: 500; color: var(--text); }
```

## Checklist
- [ ] 3–4 tiers; every price shows currency, unit and period, and tax status is stated.
- [ ] At most one plan is highlighted, with a text label, and it is the only filled CTA.
- [ ] The annual option shows the per-month equivalent, the yearly charge and the saving in % and money, computed from real prices.
- [ ] The comparison is a `<table>` with a caption, column headers and row headers, and no icon-only cells.
- [ ] On a comparison taller than 1.5 screens, plan names stay visible while scrolling and do not hide focused cells.
- [ ] Only Enterprise uses "Contact sales"; variable pricing shows a worked example.
- [ ] Trial terms (length, card or not, what happens at the end) appear next to the trial CTA.

## Sources
- https://www.nngroup.com/articles/show-price/ (Loranger 2013; qualitative B2B usability studies)
- https://www.nngroup.com/articles/show-prices-for-common-scenarios/
- https://baymard.com/blog/user-friendly-comparison-tools (sticky column headings; guideline detail is paywalled, taken from the free article summary)
- https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf (Frederick, Lee, Baskin 2014)
- https://www.rieb.kobe-u.ac.jp/academic/ra/dp/English/DP2024-33.pdf (decoy field experiment, 2024 working paper)
- https://phys.org/news/2019-02-decoy-effect.pdf (retelling of the Ariely Economist example)
- https://linear.app/pricing (checked Nov 2026)
- https://vercel.com/pricing (checked Nov 2026)
- https://basecamp.com/pricing (checked Nov 2026)
- https://tailscale.com/pricing (checked Nov 2026)
- https://www.w3.org/WAI/tutorials/tables/two-headers/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
