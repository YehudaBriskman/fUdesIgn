# Dashboard anti-pattern catalog

> Ten recurring failures, each with a symptom you can detect, why it hurts, and the specific fix. Check for all ten before shipping any dashboard.

**Category:** Reference gallery / anti-patterns · **Applies to:** any dashboard, KPI row, card grid, chart panel or admin home · **Priority:** must

## When to use / when not
- Use this as a lint list during design review or when auditing an existing dashboard. Each entry names the stable check IDs it maps to in ref-design-review-rubric.md, so a finding here is scored there.
- Each entry is phrased as a detectable symptom so an agent can check it against a screenshot or DOM.

## Rules (do)
Each anti-pattern below gives the rubric checks, the symptom, why it is bad, and the fix.

### AP1. Too many KPIs
- **Rubric:** A2, A3.
- **Symptom:** more than 12 panels on one page, or more than 6 tiles in the top KPI row.
- **Why:** Few's pitfall #10: "When everything is visually prominent, nothing stands out." Amplitude: "Teams with a wall of metrics may stall rather than make any decisions". Carbon: "Limit the number of metrics".
- **Fix:** keep 3–6 headline KPIs and at most 12 panels per page. Move the rest to linked drill-down pages.

### AP2. Vanity metrics
- **Rubric:** A4.
- **Symptom:** cumulative all-time counters (total users, total page views, total revenue since launch) as headline tiles, or metrics with no owner and no decision attached.
- **Why:** cumulative counts only go up, so they can't signal trouble, and a mis-chosen headline misleads: Amplitude's example is a team that sees "total visitors" fall and pulls back even while getting the results it wants. Amplitude: "Only metrics that directly relate to your questions and KPIs have a place in an analytics dashboard."
- **Fix:** use rates, ratios, per-period values and cohorts (weekly active, conversion %, net revenue retention). For each tile, answer "what would I do if this moved 10%?" Delete the tile if there is no answer.

### AP3. Gauges everywhere
- **Rubric:** C1.
- **Symptom:** radial gauges, speedometers or donut "progress rings" for single values.
- **Why:** NN/g: circular visualisations "require a lot of space to communicate little information", and linear bullet charts are "significantly better". Few's gauge example (figure 3) has unlabeled ticks and no target, so "this gauge tells us nothing" beyond the rough value.
- **Fix:** use a **bullet graph** (Few's spec): a bar for the featured measure about 1/3 of the container's thickness, a perpendicular tick for the target, and 2–5 (ideally 3) background ranges. For the ranges use intensities of one hue, for three ranges 40%, 25% and 10% black, darker for worse. Or use the number plus a delta plus a sparkline.

### AP4. Rainbow palettes
- **Rubric:** D2, D3 (and D1 when hue is the only cue).
- **Symptom:** a different colour per bar in a single-series bar chart, a jet or rainbow colormap for a continuous value, or more than 8 categorical hues (6 preferred, SKILL.md rule 12).
- **Why:** Few's pitfall #12: when bars are already labelled, "the colors mean nothing", yet our brains "search for the nonexistent meaning of these differences". Borland and Taylor's "Rainbow Color Map (Still) Considered Harmful" shows that rainbow maps lack perceptual order and create false boundaries. MATLAB replaced jet with parula for this reason. NN/g says colour "should not be used to communicate information about quantitative values or magnitude" on its own.
- **Fix:** one neutral series colour plus one highlight colour. Use perceptually uniform sequential ramps (single hue, lightness-ordered) and diverging ramps around a meaningful zero. Defer palette tokens to the colour cluster.

### AP5. No context or comparison
- **Rubric:** B1, B2, B3.
- **Symptom:** a headline number with no delta, target, prior period, benchmark or sparkline. Few: "$736,502 without any context means little. Compared to what?"
- **Why:** Few's pitfall #2. The reader can't judge good or bad.
- **Fix:** every KPI shows at least one comparison: vs prior period (PostHog toggle, Stripe comparison range), vs target or budget (Ramp), or vs peer or industry. Express variance directly as a % (Few's pitfall #4), not as two raw numbers to subtract.

### AP6. Wall of cards
- **Rubric:** D4, D5, A3.
- **Symptom:** a uniform grid of 12 or more same-size cards with no hierarchy, inconsistent card internals (some with icons, some with images, different button styles), or heavy borders and shadows on each.
- **Why:** Baymard (2018) found card dashboards work only with high consistency. On Best Buy's inconsistent card dashboard, a tester had the needed link in view for about 3 seconds, then scrolled back to the top before finding it. Few's pitfall #9 says arrangement must follow importance. Carbon: follow the F-shaped pattern and give the most important data the highest contrast and largest area.
- **Fix:** vary size by importance (hero KPI or chart spans 2× width). Give every card identical internals: header, value, comparison, footer link. Use visible headers, minimal text and no ads or promos. Prefer whitespace or a hairline to borders and shadows.

### AP7. Modal overload
- **Rubric:** F5.
- **Symptom:** chart details, filters, edit forms or drill-downs open in blocking modals. Stacked modals. A modal on page load.
- **Why:** NN/g (Fessenden, 2017): modals "block the content in the background", which can hide the information needed to answer them, and after overuse users "will refuse to give attention to further instances of this format". comp-overlay-choice.md: block the page only for a decision the user must make now.
- **Fix:** use drawers or side panels (non-modal `<dialog>` or popover) for detail, inline expansion for drill-down, and a modal only for a decision needed now: a destructive or irreversible confirmation, a required input, or a short task of ≤ 6 fields (comp-overlay-choice.md).

### AP8. Infinite spinners
- **Rubric:** F1, F2, F3, F4.
- **Symptom:** a spinner with no timeout or progress, a page-level spinner blocking all cards, a spinner that flashes for under 200 ms, or a static "Loading…".
- **Why:** NN/g (Sherwin, 2014): looped indicators are "reserved for actions that take between 2-10 seconds"; percent-done indicators are for "10 or more seconds"; static indicators "should be replaced". NN/g's skeleton-screen article adds that under 1 s neither a skeleton nor a spinner makes a difference.
- **Fix:** load per card. Delay showing the indicator about 200 ms and keep it at least 300–500 ms once shown (SKILL.md; Vercel gives "~150–300 ms" and "~300–500 ms"). Use a skeleton matching final layout for full-page loads. After 10 s switch to progress or an explanation, and after a timeout show an error with Retry. Keep stale data visible with an "Updating…" badge rather than blanking.

### AP9. Unlabeled units
- **Rubric:** E1.
- **Symptom:** "4.2" with no unit, axes without units, a "%" that might be percentage points, ambiguous "$" across currencies, or "1 TB" style abbreviations unexplained.
- **Why:** Few's pitfall #4: "viewers must know what is being measured and the units in which the measure is being expressed." NN/g: "most users couldn't understand phrases like '1 TB'".
- **Fix:** put the unit in the title or axis label ("Latency p95 (ms)"), use ISO currency codes when more than one currency appears, distinguish % from pp, and separate number and unit with a non-breaking space (Vercel: `10&nbsp;MB`).

### AP10. Inconsistent number formats
- **Rubric:** E2, E3, E4, E5.
- **Symptom:** different precision within one column or one KPI row (for example $3,848,305.93 next to $3.8M in the same row, or $12 next to $12.50 in one column). Dates in mixed formats. Proportional digits in columns, so they misalign.
- **Why:** Few's pitfall #3 is excessive precision, and pitfall #6 is meaningless variety. data-number-formatting.md: precision is a property of the metric, so keep it the same within a column or a row of cards. Carbon: "Do not switch measurement systems".
- **Fix:** one formatter per metric type, using `Intl.NumberFormat` with the user's locale. Use compact notation with 3 significant digits for KPIs ($3.85M) and the currency's minor units (USD 2, JPY 0) in tables, with the exact value in tooltips. Right-align with `tabular-nums`. Use one date format per page.

## Anti-patterns (don't)
Two more, beyond the ten requested, that showed up in the sources:
- **Decoration:** skeuomorphic dials, LED displays and 3D bars (Few's #11 and #7), and a logo in the top-left prime spot (Few's #9). Rubric: D6, C1, D4.
- **Fragmenting across screens:** metrics picked one at a time by radio buttons so they can never be compared (Few's #1, figure 2). Rubric: A3 by its spirit; no direct check.
- **Zeigarnik as a nagging justification:** the claim that unfinished tasks are remembered better does not replicate (a recent meta-analysis found no recall advantage, per Wikipedia). Never cite it for incomplete-profile badges, cliffhangers or reminder nagging; show saved, resumable state instead. See `ref-ux-laws-evidence-map.md`.
- **Mixed shells and themes:** one entity's page renders in a different layout, or a panel in the opposite light or dark theme. Rubric: H1, D7.

## Good references
- [Few: Common Pitfalls in Dashboard Design (PDF)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf). The source of 13 pitfalls with real vendor examples.
- [Few: Bullet Graph Design Specification (PDF)](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf). The gauge replacement with exact intensities (2 ranges 35/10%, 3 ranges 40/25/10%, 4 ranges 50/35/20/10%, 5 ranges 50/35/20/10/3% black).
- [NN/g: Dashboards: Making charts easier to understand](https://www.nngroup.com/articles/dashboards-preattentive/). Covers gauges, pie and 3D, and colour for magnitude.
- [NN/g: Progress indicators](https://www.nngroup.com/articles/progress-indicators/). Gives the 1 s, 2–10 s and 10+ s thresholds.
- [Baymard: Dashboard cards must be highly consistent](https://baymard.com/blog/cards-dashboard-layout). Gives the card consistency findings.
- [Vercel: Web Interface Guidelines](https://vercel.com/design/guidelines). Covers loading timings ("~150–300 ms" show-delay, "~300–500 ms" minimum), tabular numbers and the non-breaking space between number and unit.

## Bad references
- The figures in Few's white paper: a gauge with unlabeled ticks (fig 3), 4–10 decimal digits (fig 4), a pie needing labels (fig 7), variety gone amok (fig 9), a 3D bright bar chart (fig 10), a non-zero bar baseline exaggerating 2× into 4× (fig 11), and a logo in the top-left (fig 12).
- [Borland and Taylor, "Rainbow Color Map (Still) Considered Harmful", IEEE CG&A 27(2), 2007, doi:10.1109/MCG.2007.323435](https://doi.org/10.1109/MCG.2007.323435), with commentary from [MathWorks](https://blogs.mathworks.com/headlines/2018/10/10/a-dangerous-rainbow-why-colormaps-matter/). Rainbow and jet maps create false boundaries.
- [Baymard: Best Buy's card dashboard (2018 test)](https://baymard.com/blog/cards-dashboard-layout). Inconsistent cards slowed a tester who had the needed link in view; Best Buy has since redesigned.
- [CNBC: Robinhood confetti](https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html) and the [Massachusetts Securities Division consent order (January 2024)](https://www.sec.state.ma.us/divisions/securities/download/RH-Consent-Order.pdf). Decoration with regulatory consequences: for Massachusetts customers Robinhood must "Permanently cease the future use of confetti … or other celebratory imagery directly tied to frequency of trading", alongside a $7.5M fine for the wider case.

## Accessibility
- AP4 and AP5 overlap with WCAG 1.4.1 (Use of Color). Every colour-coded state needs text or a shape.
- AP8: spinners use `<progress>` without a value (implicit progressbar role) and a label. Under `prefers-reduced-motion: reduce`, slow the spinner rather than remove it, and never use a global `0.01ms` reset (motion-reduced-motion.md).
- AP9: units must be in the accessible name, not only in a visual suffix.

## Motion / interaction
- Never animate counting-up numbers on load. It delays reading and implies change that didn't happen.
- Don't grow bars from the baseline on load or on every filter change; the "change" carries no data (motion-chart-transitions.md). Entering marks fade in over `--motion-dur-medium` (240 ms) with `--motion-ease-enter` from `assets/tokens.css`, and appear instantly under reduced motion.

## Tokens and values
| Check | Threshold |
|---|---|
| Headline KPIs | 3–6 (rubric A2) |
| Panels per page | ≤ 12 (rubric A3) |
| Categorical hues per chart | 6 preferred, 8 hard cap |
| Bullet graph bands | 2–5, ideally 3 (40/25/10% black) |
| Loader show-delay / minimum | 200 ms / 400 ms (Vercel's ranges: 150–300 / 300–500 ms) |
| Spinner max before progress | 10 s |
| Currency decimals | one count per column or KPI row; ISO 4217 minor units in tables |
| KPI precision | compact, ≤ 3 significant digits ($3.85M) |

## Implementation sketch
```ts
type MetricKind = "currency" | "percent" | "count" | "duration-ms";
interface FormatOptions { readonly kind: MetricKind; readonly compact: boolean; readonly currency?: string; }

export function formatMetric(value: number, opts: FormatOptions, locale = navigator.language): string {
  const base: Intl.NumberFormatOptions = opts.compact
    ? { notation: "compact", maximumSignificantDigits: 3 }
    : { maximumFractionDigits: 2 };
  switch (opts.kind) {
    case "currency":
      return new Intl.NumberFormat(locale, { ...base, style: "currency", currency: opts.currency ?? "USD",
        ...(opts.compact ? {} : { minimumFractionDigits: 2 }) }).format(value);
    case "percent":
      return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(value);
    case "count":
      return new Intl.NumberFormat(locale, base).format(value);
    case "duration-ms":
      return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} ms`;
  }
}
```
```html
<!-- Bullet graph instead of a gauge -->
<figure class="bullet" aria-label="Revenue QTD $3.8M of $4.2M target; satisfactory range">
  <div class="bands"><i style="--w:60%"></i><i style="--w:25%"></i><i style="--w:15%"></i></div>
  <div class="bar" style="--v:90%"></div><div class="target" style="--t:100%"></div>
  <figcaption>Revenue QTD <b>$3.8M</b> / $4.2M target</figcaption>
</figure>
```

## Checklist
- [ ] 3–6 headline KPIs and ≤ 12 panels on the page (A2, A3).
- [ ] No cumulative all-time counters as headlines (A4).
- [ ] No radial gauges; bullet graphs or number plus delta instead (C1).
- [ ] Single-series charts use one colour; continuous scales are perceptually ordered (D2, D3).
- [ ] Every KPI has a named comparison, expressed as a signed variance (B1–B3).
- [ ] Card internals are identical, and size reflects importance (D4, D5).
- [ ] Modals only for a decision needed now (F5).
- [ ] Loaders are per card, delayed, time-boxed, with an error and Retry path (F1–F4).
- [ ] Every value has a unit, and one formatter per metric kind (E1–E5).

## Sources
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/modal-nonmodal-dialog/
- https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/
- https://baymard.com/blog/cards-dashboard-layout
- https://www.amplitude.com/blog/analytics-dashboard
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://vercel.com/design/guidelines
- https://blogs.mathworks.com/headlines/2018/10/10/a-dangerous-rainbow-why-colormaps-matter/
- https://www.cs.toronto.edu/~jacobson/weblog/4082.html
- https://doi.org/10.1109/MCG.2007.323435
- https://www.sec.state.ma.us/divisions/securities/download/RH-Consent-Order.pdf
- https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html
- https://en.wikipedia.org/wiki/Zeigarnik_effect
