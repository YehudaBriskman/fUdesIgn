# Methodology, "why this number" and provenance

> Every computed number can answer "why this number?" in one step: a short in-place explanation with its formula and inputs, each input traceable to its source, and a dated methodology page for the full story. Explain at three depths and never hide what the decision depends on.

**Category:** Foundations · **Applies to:** valuation and forecast outputs, scores and verdicts, derived KPIs, model-driven recommendations, methodology and "how it works" pages · **Priority:** must (for any product that computes rather than reports)

## When to use / when not
- **Use** for any number the product *derives*: a fair value, a probability, a score, a forecast, a ratio with a non-obvious definition.
- **Use** a methodology page when the method has more than about 3 steps or any judgement call (a discount rate choice, a peer set, an outlier rule).
- **Lighter touch** for raw reported figures (revenue as filed): a source line and a link to the filing is enough (see `data-units-footnotes-sources.md`).
- **Don't** put the explanation only in a tooltip. Hover is missing on touch and tooltips vanish; definitions the decision depends on must be reachable by click or tap (see `comp-overlay-choice.md`).

## Rules (do)
- **Three depths, each one click from the last:**
  1. **Inline (0 clicks).** A subtitle or footnote under the number: the formula in words and the basis. "Value per share = equity value ÷ diluted shares · DCF, 10-year, WACC 8.9%".
  2. **"Why this number" panel (1 click).** A non-modal side panel or popover showing the calculation as a tree: the output at the top, each input below it with its value, unit, period and source. Each leaf links to the source document (filing, data vendor, user input).
  3. **Methodology page (2 clicks).** The full method, with anchors per section so the panel can deep-link ("#discount-rate").
- **Provenance tree rules:**
  - Each node shows label, value with unit, and origin: *reported* (with document and line), *derived* (with formula), *assumption* (default or user-set) or *external* (vendor, date).
  - Mark user-changed inputs distinctly from defaults (see `comp-assumption-editor-panel.md`).
  - Show the period and as-of date on every leaf. Mixing a TTM figure with an annual one is the most common silent error.
  - Collapse to depth 2 by default; expand on demand. Use native `<details>` for each node.
  - The tree's numbers must sum or compute to the parent exactly as displayed (allow a stated rounding note).
- **Explain "why", not only "what".** Google's PAIR guidebook: in high-stakes cases, don't show a result without its reasoning. "Value fell 12% because the 10-Q lowered operating margin from 31% to 27%" beats "Value updated".
- **Say what the model doesn't know.** State data limits where the user decides, not on a separate page. PAIR's good example names the missing input ("no street-light data after 6 pm"); the bad one is a vague "be careful". Translate: "Excludes off-balance-sheet leases", "Peers limited to US-listed".
- **Confidence next to the output.** Show a range or a categorical confidence with defined cutoffs. PAIR lists categorical, N-best, numeric and visual (error bars, bands) displays; bands suit expert users, categories suit everyone else.
- **Methodology page layout:**
  - Title, a one-paragraph summary ("What this measures and what it doesn't"), then a table of contents.
  - One section per step, each with: what it does, the formula, the default values and why, and the known limits.
  - Body text at a 60–75ch measure (see `found-typography-for-data.md`); formulas as block MathML or code-styled lines, with variables defined directly below.
  - A **"Last changed" date and a changelog** at the top. When the method changes, list the date, what changed, and how much typical outputs moved. Morningstar dates its methodology documents and announced its updated uncertainty-rating method in a dated article that restates every margin-of-safety threshold (6 October 2022).
  - A worked example with real numbers that a reader can recompute.
  - Sticky TOC on wide screens (≥ 1024px), inline TOC on narrow ones.
- **Calibration, if you forecast.** Publish how past outputs did: bins of predicted probability vs observed frequency. A model that says "70%" should be right about 70% of the time.
- **One disclaimer, in one place.** Put the legal or "not advice" line once on the methodology page and once in the footer. Don't repeat it on every card (see `comp-onboarding-and-notices.md`).

## Anti-patterns (don't)
- A "Learn more" link that goes to a generic marketing page instead of the section for this number.
- An explainer that restates the label ("Fair value: the fair value of the stock").
- Formulas as images with no text alternative.
- A methodology page with no date, so readers can't tell if the number they saw used the current method.
- A provenance tree whose leaves don't add up to the parent, or that mixes periods silently.
- "Proprietary model" with no inputs shown: the user can't check anything.
- Hiding limits in a FAQ nobody opens, while the main view shows a confident single number.
- A modal "Why this number" that covers the number it explains.

## Good references
- [Google PAIR, Explainability + Trust](https://pair.withgoogle.com/chapter/explainability-trust/) — explain data sources, give partial explanations focused on the decision, use example-based and "what if" explanations, and pick a confidence display (categorical, N-best, numeric, visual) to suit the audience. Don't show more precision than the decision needs.
- [Morningstar equity research definitions (PDF)](https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf) — a short, dated definitions document that states the rule from inputs (uncertainty, fair value, price) to output (stars) with every threshold.
- [Simply Wall St Company Analysis Model](https://github.com/SimplyWallSt/Company-Analysis-Model) — the scoring checks are published in a public repository, versioned with history, so anyone can check a rating's rules.
- [Our World in Data, redesigning interactive charts](https://ourworldindata.org/redesigning-our-interactive-data-visualizations) — every chart carries its source and a "Learn more about this data" overlay; past versions of articles stay browsable.
- [GOV.UK check answers pattern](https://design-system.service.gov.uk/patterns/check-answers/) — a summary list of every input with a per-row "Change" link whose hidden text names the input; a good model for listing a calculation's inputs.

## Bad references
- [FiveThirtyEight "checking our work"](https://projects.fivethirtyeight.com/checking-our-work/nfl-games) — once the best public example of calibration reporting; it now redirects to an unrelated news page. Methodology hosted only on a third-party domain can vanish. Keep yours versioned in the product.
- [Seeking Alpha Quant Ratings FAQ](https://help.seekingalpha.com/premium/quant-ratings-and-factor-grades-faq) — explains the inputs but not the weights; a user can't recompute or contest a rating.
- [Damodaran, spreadsheets page](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm) — excellent models, but the defaults "built in to protect you from inconsistent assumptions" are documented only inside each workbook, not on the page. Fine for a teaching site; a product should expose its defaults where they're used.

## Accessibility
- "Why this number" is a `<button>` with `aria-expanded` and `aria-controls`, or a link to an anchor. Its accessible name names the number: "Why $142 value per share".
- The provenance tree uses nested `<details>`/`<summary>` (keyboard and screen-reader support for free) or the ARIA tree pattern if it needs arrow-key navigation.
- Formulas: block `<math display="block">` with an `aria-label` in words, plus the variables defined in a `<dl>` below. MathML has been Baseline across browsers since January 2023.
- The methodology TOC is a `<nav aria-label="On this page">`. Headings follow a strict outline.
- Every source link says what it opens: "10-K filed 1 Nov 2026 (EDGAR, opens in new tab)".

## Motion / interaction (if relevant)
- The panel opens without a scrim and leaves the number visible (non-modal side panel, see `comp-overlay-choice.md`).
- Clicking a chart point or a table cell opens the panel scoped to that point ("Q3 2026 value").
- Deep links: `?why=value` opens the panel on load, so explanations are shareable.
- Hover on a tree node highlights the matching figure on the page (see `motion-linked-exploration.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Panel width | 400–480px (desktop), full width below 768px | Why-this-number side panel |
| Tree indent | 16px per level | Provenance nesting |
| Default expanded depth | 2 | Tree |
| Origin tag | 0.75rem / 500, `--text-muted`, 1px border | reported / derived / assumption / external |
| User-changed marker | 6px dot in `--accent` + text "edited" | Assumption leaves |
| Methodology measure | 60–75ch | Body text |
| Sticky TOC | 220–260px column at ≥ 1024px | Methodology page |
| Changelog entries visible | last 3, rest behind "All changes" | Methodology page |

## Implementation sketch
```html
<p class="kpi-value"><data value="142">$142</data></p>
<p class="kpi-foot">DCF, 10-year · WACC 8.9% ·
  <button type="button" aria-expanded="false" aria-controls="why-value">Why $142 value per share</button></p>

<aside id="why-value" class="why" hidden aria-labelledby="why-title">
  <h2 id="why-title">Why $142 per share</h2>
  <details open>
    <summary>Value per share <data value="142">$142</data> <span class="origin">derived</span></summary>
    <p class="formula">Equity value ÷ diluted shares</p>
    <details>
      <summary>Equity value <data value="2130000000">$2.13B</data> <span class="origin">derived</span></summary>
      <!-- enterprise value, net debt … -->
    </details>
    <details>
      <summary>Diluted shares <data value="15000000">15.0M</data> <span class="origin">reported</span></summary>
      <p><a href="https://www.sec.gov/">10-Q filed 3 Nov 2026, cover page</a> · as of 25 Oct 2026</p>
    </details>
  </details>
  <a href="/methodology#value-per-share">Full methodology</a>
</aside>
```
```ts
import { z } from 'zod'

type Origin =
  | { kind: 'reported'; document: string; url: string; asOf: string }
  | { kind: 'derived'; formula: string }
  | { kind: 'assumption'; source: 'default' | 'user'; defaultValue: number }
  | { kind: 'external'; vendor: string; asOf: string }

export interface ProvNode {
  id: string
  label: string
  value: number
  unit: 'USD' | 'shares' | 'pct' | 'x'
  period: string
  origin: Origin
  children: ProvNode[]
}

const OriginSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('reported'), document: z.string(), url: z.url(), asOf: z.iso.date() }),
  z.object({ kind: z.literal('derived'), formula: z.string() }),
  z.object({ kind: z.literal('assumption'), source: z.enum(['default', 'user']), defaultValue: z.number() }),
  z.object({ kind: z.literal('external'), vendor: z.string(), asOf: z.iso.date() }),
])

export const ProvNodeSchema: z.ZodType<ProvNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    value: z.number(),
    unit: z.enum(['USD', 'shares', 'pct', 'x']),
    period: z.string(),
    origin: OriginSchema,
    children: z.array(ProvNodeSchema),
  }),
)

// leaves the user changed, so the panel can mark them and offer "reset"
export function editedLeaves(node: ProvNode): ProvNode[] {
  const self = node.origin.kind === 'assumption' && node.origin.source === 'user' ? [node] : []
  return [...self, ...node.children.flatMap(editedLeaves)]
}
```
```css
.why { inline-size: min(100%, 440px); padding: 16px 20px; border-inline-start: 1px solid var(--border-subtle);
       background: var(--surface-1); overflow-y: auto; }
.why details details { margin-inline-start: 16px; }
.why summary { display: flex; gap: 8px; align-items: baseline; padding-block: 4px; cursor: pointer; }
.why data { margin-inline-start: auto; font-variant-numeric: tabular-nums; }
.origin { font-size: 0.75rem; font-weight: 500; color: var(--text-muted);
          border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0 4px; }
.formula { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--text-muted); margin: 0 0 4px; }
```

## Checklist
- [ ] Every derived number has an inline basis (formula in words or method) under it.
- [ ] "Why this number" opens in one click, non-modal, and keeps the number visible.
- [ ] Each leaf shows value, unit, period, as-of date and origin, and links to its source.
- [ ] User-changed assumptions are marked and distinguishable from defaults.
- [ ] Known limits are stated next to the output, not only in a FAQ.
- [ ] The methodology page has a summary, TOC, section anchors, a worked example and a dated changelog.
- [ ] Formulas are text (MathML or code), with variables defined.
- [ ] The disclaimer appears once, not on every card.

## Sources
- https://pair.withgoogle.com/chapter/explainability-trust/
- https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf
- https://morningstar.co.uk/uk/news/227180/what-is-the-morningstar-uncertainty-rating.aspx (6 October 2022, updated methodology and thresholds; read via web.archive.org)
- https://github.com/SimplyWallSt/Company-Analysis-Model
- https://ourworldindata.org/redesigning-our-interactive-data-visualizations
- https://ourworldindata.org/how-to-use-our-world-in-data (how to cite charts and data)
- https://design-system.service.gov.uk/patterns/check-answers/
- https://projects.fivethirtyeight.com/checking-our-work/nfl-games (now redirects to abcnews.go.com)
- https://help.seekingalpha.com/premium/quant-ratings-and-factor-grades-faq
- https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm
- https://developer.mozilla.org/en-US/docs/Web/MathML/Reference/Element/math
- https://developer.dynatrace.com/design/guided-interaction/components-pattern/ (tooltips and expandable text are not for critical information or content users need to decide)
