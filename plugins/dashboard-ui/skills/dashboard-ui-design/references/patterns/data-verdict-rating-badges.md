# Verdicts, ratings and score glyphs

> A verdict ("Undervalued", "4 stars", "Strong buy") is a judgement, not a measurement. Show it as text plus a position on a visible scale with its thresholds, say how confident it is, let it be withheld, and link it in one step to the numbers and rules that produced it.

**Category:** Data display · **Applies to:** valuation verdicts (under / fair / over), star and letter ratings, composite scores, radar "snowflakes", credit and risk grades, health scores, quality badges · **Priority:** must (for products that issue judgements)

## When to use / when not
- **Use** a verdict when the reader's real question is a decision ("Is this cheap?", "Is this account at risk?") and the product has a documented rule that maps numbers to a category.
- **Use** a categorical label instead of a raw number when finer granularity would not change the decision. Google's People + AI Guidebook warns against showing more precision than the decision needs: telling 85.8% from 87% rarely changes what a user does.
- **Don't** issue a verdict when the inputs are missing, stale or outside the model's range. Show "No verdict" with the reason (see Rules, withheld state).
- **Don't** use a verdict as decoration on every row of a table. One per entity, on its header or in one column.
- **Don't** use a composite score (snowflake, radar, 0–100 "health") as the only display when the parts carry different weights or units. Show the parts as a table or bars, and the composite as a summary of them.

## Rules (do)
- **Anatomy, in order:**
  1. **Label in words.** "Undervalued", "Fair", "Overvalued". Sentence case, one or two words. The label is the accessible name; glyphs and colour only repeat it.
  2. **The number behind it.** "Price 18% below value". A verdict with no number is a slogan.
  3. **The scale.** A one-line range bar showing price, value, the fair zone and the band ends (see `chart-financial-price-value.md` for the value band). The thresholds are drawn, not implied.
  4. **Confidence.** "Medium uncertainty" or "Based on 3 of 5 methods". Categorical (low / medium / high) unless the audience reads probabilities well.
  5. **Link to the method.** "How we judge this" opens the provenance for this verdict (see `found-methodology-explainability.md`).
- **Thresholds scale with uncertainty.** A fixed ±20% band treats a utility and a biotech alike. Morningstar's documented rule widens the band as uncertainty grows: 5 stars needs a 20% discount at low uncertainty, 30% at medium, 40% at high, 50% at very high and 75% at extreme; 1 star needs a 25%, 35%, 55%, 75% or 300% premium. Use the same idea: the fair zone is wider when the value range is wider.
- **Asymmetric bands are fine.** Downside and upside thresholds need not match (Morningstar's low-uncertainty band is −20% / +25%). Draw them where they are, not mirrored.
- **Colour: a neutral-hue scale, not status colours.** "Overvalued" is not an error, and "Undervalued" is not success. Use one hue family stepped by lightness, or a diverging pair that avoids red/green (see `color-dataviz-palettes.md`). Keep danger red for system failures (see `color-semantic-status.md`). Keep money up/down colours for price moves (see `data-delta-trend-indicators.md`).
- **Shape and text carry the meaning.** The chip has a glyph that differs by category (▼ / ● / ▲ or a filled position marker on the bar), so it survives greyscale and colour-blindness.
- **Withheld state.** When a rule can't run, the chip says "No verdict" in muted ink, and the reason is one line: "Negative earnings: multiples don't apply", "Data older than 120 days". Never fall back to "Fair" because it looks safe.
- **Low-confidence state.** When the value range is so wide that price sits inside it under all scenarios, say "Fair (wide range)" or withhold. A dashed chip outline and the word "low confidence" mark it; colour alone does not.
- **Stars and letter grades.** Use them only if the scale is documented and stable. Show the count as text ("4 of 5 stars"), use filled vs outline shapes (not two colours), and never show half-stars unless the rule produces halves.
- **Composite glyphs (snowflake, radar).** Simply Wall St's open model scores 5 axes with 6 pass/fail checks each (0–6 per axis), and colours the whole shape greener with more passes. If you use a composite glyph:
  - list the checks behind each axis, and show "4 of 6 checks passed" per axis;
  - keep axis order fixed across every entity, so shapes are comparable;
  - pair it with a table, because radar area exaggerates differences (area grows with the square of the radius).
- **Rating changes are events.** When a verdict flips, show "Changed from Fair on 3 Nov" next to the chip, and record why (new filing, price move, method change).
- **User thresholds.** If users can set their own fair zone, show "Your rule: ±15%" on the chip's detail, and keep the house rule one click away. Store it in the URL or profile, not silently.
- **Sector-relative vs absolute.** Say which. Seeking Alpha's factor grades compare each stock's metrics with its own sector, so an "A" in utilities is not an "A" in software. Label it "vs sector".

## Anti-patterns (don't)
- A red "Overvalued" pill and a green "Undervalued" pill using the app's error and success tokens.
- A verdict chip with no number, no thresholds and no link: the user can't tell if 1% or 60% separates price from value.
- A single fixed ±20% fair zone for every company regardless of how uncertain the value is.
- Showing "Fair" when the model failed or data is missing.
- A star rating where 3 stars means "fair value" in one view and "average quality" in another.
- A radar or snowflake as the only display, with axes whose order changes between companies.
- Precision theatre: "Quality score 87.42 / 100".
- An animated pulse or glow on the verdict to draw attention. The verdict is already the focal point (see `found-visual-hierarchy.md`).

## Good references
- [Morningstar equity research definitions (PDF)](https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf) — the star rating is driven by price vs fair value with margin-of-safety bands that widen by uncertainty (Low to Extreme), and bull and bear cases are set so each has a 25% probability of being exceeded. A clear, published mapping from numbers to a verdict.
- [Simply Wall St Company Analysis Model](https://github.com/SimplyWallSt/Company-Analysis-Model) — the snowflake's rules are public: 5 axes, 6 checks each, the value checks being "price at least 20% below DCF value" and "at least 40% below", plus P/E, PEG and P/B vs market and industry. Publishing the checks is what makes the glyph traceable.
- [Google PAIR, Explainability + Trust](https://pair.withgoogle.com/chapter/explainability-trust/) — categorical confidence labels need carefully chosen cutoffs and a clear action per category; avoid showing "what" without "why" when stakes are high.
- [Seeking Alpha Quant Ratings FAQ](https://help.seekingalpha.com/premium/quant-ratings-and-factor-grades-faq) — a 1.0–5.0 score mapped to Strong Sell … Strong Buy, five sector-relative factor grades (A+ to F), updated daily before market open. Grades are stated as sector-relative.

## Bad references
- [Simply Wall St Snowflake help article](https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work) (read via web.archive.org, September 2025 snapshot) — the snowflake's overall colour comes from the count of passed checks across unlike axes, so a large green shape can hide a failing health axis. The help text itself warns that a low score on one criterion shouldn't exclude a stock, which is exactly the nuance the colour flattens.
- [Seeking Alpha Quant Ratings FAQ](https://help.seekingalpha.com/premium/quant-ratings-and-factor-grades-faq) — the overall rating is "not a simple average" of the grades and the weights are not published, so the verdict can't be traced from the visible parts.
- Generic "Buy / Hold / Sell" pills in green, grey and red found in many brokerage UIs: they borrow status colours and money colours at the same time, and give no threshold or confidence.

## Accessibility
- The label is text in the DOM, not only an icon or colour. Glyphs are `aria-hidden="true"`.
- The range bar is `role="img"` with an `aria-label` sentence: "Price $118 is 18% below value $142. Fair zone $114 to $178. Medium uncertainty."
- Stars: one element with "4 of 5 stars" as its accessible name. Don't expose five separate star images.
- Chip text and its background pass 4.5:1. The bar's markers pass 3:1 against the track (WCAG 1.4.11).
- A withheld verdict reads "No verdict: negative earnings", not an empty cell.

## Motion / interaction (if relevant)
- No pulse, glow or count-up on the verdict.
- When a what-if change moves the verdict, cross-fade the label in 150–200 ms and slide the marker on the bar. Respect reduced motion (see `motion-reduced-motion.md`).
- Hover or focus on the bar shows the threshold values. They are also printed in the detail, so hover is never required.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--verdict-under` | `oklch(0.55 0.11 240)` (blue) | Undervalued marker and chip ink |
| `--verdict-fair` | `oklch(0.55 0.01 260)` (neutral grey) | Fair chip and fair-zone band |
| `--verdict-over` | `oklch(0.58 0.13 55)` (orange) | Overvalued marker and chip ink |
| `--verdict-bg-*` | same hue at L 0.95 (light) / 0.28 (dark), C ≤ 0.04 | Chip background |
| `--verdict-withheld` | `--text-muted` | No verdict |
| Chip | 24px tall, 0 8px padding, radius 999px, 0.8125rem / 500 | Verdict label |
| Range bar | 8px track, 2px price tick, 10px value dot | Scale under the chip |
| Default fair zone | value ± uncertainty band (e.g. −20% / +25% at low) | Thresholds, drawn |

## Implementation sketch
```html
<section class="verdict" aria-labelledby="v-title">
  <h3 id="v-title" class="sr-only">Valuation verdict</h3>
  <p class="verdict-chip" data-verdict="under">
    <span aria-hidden="true">▼</span> Undervalued
  </p>
  <p class="verdict-basis">Price <data value="118">$118</data> is 18% below value
    <data value="142">$142</data> · <span class="conf">Medium uncertainty</span></p>
  <svg class="verdict-bar" viewBox="0 0 300 24" role="img"
       aria-label="Price $118 is 18% below value $142. Fair zone $114 to $178.">
    <rect class="track" x="0" y="10" width="300" height="4" rx="2" />
    <rect class="fair" x="120" y="8" width="110" height="8" rx="2" />
    <circle class="value" cx="150" cy="12" r="5" />
    <rect class="price" x="96" y="2" width="2" height="20" />
  </svg>
  <a href="#method-verdict">How we judge this</a>
</section>
```
```css
.verdict-chip {
  display: inline-flex; align-items: center; gap: 6px;
  block-size: 24px; padding: 0 8px; border-radius: 999px; margin: 0;
  font: 500 0.8125rem/1 var(--font-sans);
  border: 1px solid currentColor;
}
.verdict-chip[data-verdict="under"] { color: var(--verdict-under); background: var(--verdict-bg-under); }
.verdict-chip[data-verdict="fair"] { color: var(--verdict-fair); background: var(--verdict-bg-fair); }
.verdict-chip[data-verdict="over"] { color: var(--verdict-over); background: var(--verdict-bg-over); }
.verdict-chip[data-verdict="withheld"] { color: var(--text-muted); background: none; border-style: dashed; }
.verdict-bar { inline-size: 100%; max-inline-size: 320px; block-size: 24px; }
.verdict-bar .track { fill: var(--border-subtle); }
.verdict-bar .fair { fill: var(--verdict-fair); opacity: 0.25; }
.verdict-bar .value { fill: var(--text-primary); }
.verdict-bar .price { fill: var(--verdict-under); }
```
```ts
import { z } from 'zod'

export const Uncertainty = z.enum(['low', 'medium', 'high', 'very-high', 'extreme'])
export type Uncertainty = z.infer<typeof Uncertainty>

// discount / premium to value that ends the fair zone, widening with uncertainty
const BANDS: Record<Uncertainty, { below: number; above: number }> = {
  low: { below: 0.2, above: 0.25 },
  medium: { below: 0.3, above: 0.35 },
  high: { below: 0.4, above: 0.55 },
  'very-high': { below: 0.5, above: 0.75 },
  extreme: { below: 0.75, above: 3 },
}

export type Verdict =
  | { kind: 'under' | 'fair' | 'over'; gap: number; low: number; high: number }
  | { kind: 'withheld'; reason: string }

export function verdict(price: number, value: number | null, u: Uncertainty, ageDays: number): Verdict {
  if (value === null || value <= 0) return { kind: 'withheld', reason: 'No positive value estimate' }
  if (ageDays > 120) return { kind: 'withheld', reason: `Inputs are ${ageDays} days old` }
  const { below, above } = BANDS[u]
  const low = value * (1 - below)
  const high = value * (1 + above)
  const gap = price / value - 1
  const kind = price < low ? 'under' : price > high ? 'over' : 'fair'
  return { kind, gap, low, high }
}
```

## Checklist
- [ ] The verdict is a word in text, with a glyph or marker that differs by category; it reads in greyscale.
- [ ] The number behind it (gap to value) is shown next to it.
- [ ] Thresholds are drawn on a scale, and they widen with uncertainty or are labelled as fixed.
- [ ] Verdict colours are their own tokens, not success/danger or money up/down.
- [ ] A withheld state exists, with a one-line reason; failures never show "Fair".
- [ ] Confidence is stated as a category with a defined cutoff.
- [ ] "How we judge this" reaches the rule and inputs in one step.
- [ ] Composite glyphs list their checks and come with a table.

## Sources
- https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf (redirect from advisor.morningstar.com; uncertainty bands and 25% bull/bear probabilities)
- https://www.morningstar.com/stocks/how-determine-whether-stock-is-cheap-expensive-or-fairly-valued (price compared with fair value)
- https://www.morningstar.co.uk/uk/news/227180/what-is-the-morningstar-uncertainty-rating.aspx (read via web.archive.org; 5-star discount and 1-star premium per uncertainty level, 20/25 to 75/300)
- https://github.com/SimplyWallSt/Company-Analysis-Model (MODEL.markdown: 5 axes × 6 checks, value checks)
- https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work (read via web.archive.org; more passed checks = greener; "a low score in particular assessment criteria should not necessarily exclude a stock")
- https://pair.withgoogle.com/chapter/explainability-trust/
- https://help.seekingalpha.com/premium/quant-ratings-and-factor-grades-faq
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
