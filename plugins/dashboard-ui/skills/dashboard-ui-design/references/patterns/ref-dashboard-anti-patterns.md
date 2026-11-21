# Dashboard anti-pattern catalog

> Ten recurring failures, each with a symptom you can detect, why it hurts, and the specific fix. Check for all ten before shipping any dashboard.

**Category:** Reference gallery / anti-patterns · **Applies to:** any dashboard, KPI row, card grid, chart panel or admin home · **Priority:** must

## When to use / when not
- Use this as a lint list during design review or when auditing an existing dashboard. Each entry maps to a rubric line in ref-design-review-rubric.md.
- Each entry is phrased as a detectable symptom so an agent can check it against a screenshot or DOM.

## Rules (do)
Each anti-pattern below gives the symptom, why it is bad, and the fix.

### AP1. Too many KPIs
- **Symptom:** more than about 12 metrics on one board, more than 4–6 tiles in the top KPI row, or a page that needs more than 1.5 viewport heights to see everything.
- **Why:** Few's pitfall #1 and #10: "when everything is visually prominent, nothing stands out." Amplitude warns that a "wall of metrics" stalls decisions, and Carbon says "limit the number of metrics".
- **Fix:** keep 3–5 headline KPIs and 8–12 metrics per board (Mixpanel guidance). Move the rest to linked drill-down pages.

### AP2. Vanity metrics
- **Symptom:** cumulative all-time counters (total users, total page views, total revenue since launch) as headline tiles, or metrics with no owner and no decision attached.
- **Why:** cumulative counts only go up, so they can't signal trouble. Amplitude's example: total visitors can fall while results improve. Amplitude also says only metrics tied to your questions and KPIs belong.
- **Fix:** use rates, ratios, per-period values and cohorts (weekly active, conversion %, net revenue retention). For each tile, answer "what would I do if this moved 10%?" Delete the tile if there is no answer.

### AP3. Gauges everywhere
- **Symptom:** radial gauges, speedometers or donut "progress rings" for single values.
- **Why:** NN/g says circular gauges take a lot of space for little information and rely on angle, which people judge poorly. Few's gauge example has unlabeled ticks and no target, so it "tells us nothing".
- **Fix:** use a **bullet graph** (Few's spec): a bar for the featured measure, a perpendicular tick for the target, and 2–5 (ideally 3) background bands. For the bands use intensities of one hue, for three ranges 40%, 25% and 10% black, darker for worse. Or use the number plus a delta plus a sparkline.

### AP4. Rainbow palettes
- **Symptom:** a different colour per bar in a single-series bar chart, a jet or rainbow colormap for a continuous value, or more than about 6–8 categorical hues.
- **Why:** Few's pitfall #12 says colour on already-labelled bars "means nothing", but the brain searches for meaning. Borland and Taylor's "Rainbow Color Map (Still) Considered Harmful" shows that rainbow maps lack perceptual order and create false boundaries. MATLAB replaced jet with parula for this reason. NN/g says colour "should not be used to communicate information about quantitative values or magnitude" on its own.
- **Fix:** one neutral series colour plus one highlight colour. Use perceptually uniform sequential ramps (single hue, lightness-ordered) and diverging ramps around a meaningful zero. Defer palette tokens to the colour cluster.

### AP5. No context or comparison
- **Symptom:** a headline number with no delta, target, prior period, benchmark or sparkline. Few: "$736,502 without any context means little. Compared to what?"
- **Why:** Few's pitfall #2. The reader can't judge good or bad.
- **Fix:** every KPI shows at least one comparison: vs prior period (PostHog toggle, Stripe comparison range), vs target or budget (Ramp), or vs peer or industry. Express variance directly as a % (Few's pitfall #4), not as two raw numbers to subtract.

### AP6. Wall of cards
- **Symptom:** a uniform grid of 12 or more same-size cards with no hierarchy, inconsistent card internals (some with icons, some with images, different button styles), or heavy borders and shadows on each.
- **Why:** Baymard found card dashboards work only with high consistency. At Best Buy a tester scrolled past the needed link because of inconsistent styling. Few's pitfall #9 says arrangement must follow importance. Carbon says use an F-pattern and give the most important data the "largest area".
- **Fix:** vary size by importance (hero KPI or chart spans 2× width). Give every card identical internals: header, value, comparison, footer link. Use visible headers, minimal text and no ads or promos. Prefer whitespace or a hairline to borders and shadows.

### AP7. Modal overload
- **Symptom:** chart details, filters, edit forms or drill-downs open in blocking modals. Stacked modals. A modal on page load.
- **Why:** NN/g says modals interrupt, hide the content the user needs to decide, cause context loss, and with overuse users "learn to dismiss" even important ones. modern-web-guidance says to match the interruption to the stakes and use blocking dialogs only for consequential actions.
- **Fix:** use drawers or side panels (non-modal `<dialog>` or popover) for detail, inline expansion for drill-down, and a modal only for destructive or irreversible confirmations.

### AP8. Infinite spinners
- **Symptom:** a spinner with no timeout or progress, a page-level spinner blocking all cards, a spinner that flashes for under 200 ms, or a static "Loading…".
- **Why:** NN/g says spinners suit 2–10 s waits. Beyond 10 s users can't tell if the system is stuck, so show percent-done and an estimate. Under 1 s an indicator distracts. Static "Loading…" gives no information.
- **Fix:** load per card. Delay showing the indicator by 150–300 ms and keep it at least 300–500 ms once shown (Vercel). Use a skeleton matching final layout for full-page loads. After 10 s switch to progress or an explanation, and after a timeout show an error with Retry. Keep stale data visible with an "Updating…" badge rather than blanking.

### AP9. Unlabeled units
- **Symptom:** "4.2" with no unit, axes without units, a "%" that might be percentage points, ambiguous "$" across currencies, or "1 TB" style abbreviations unexplained.
- **Why:** Few's pitfall #4: "viewers must know what is being measured and the units." NN/g found that users didn't understand "1 TB".
- **Fix:** put the unit in the title or axis label ("Latency p95 (ms)"), use ISO currency codes when more than one currency appears, distinguish % from pp, and separate number and unit with a non-breaking space (Vercel: `10&nbsp;MB`).

### AP10. Inconsistent number formats
- **Symptom:** $3,848,305.93 next to $3.8M. A mix of 0 and 2 decimals for currency. Dates in mixed formats. Proportional digits in columns, so they misalign.
- **Why:** Few's pitfall #3 is excessive precision, and pitfall #6 is meaningless variety. Vercel: currency in one context uses 0 or 2 decimals, "never a mix". Carbon: don't switch measurement systems.
- **Fix:** one formatter per metric type, using `Intl.NumberFormat` with the user's locale. Use compact notation for KPIs ($3.8M) and full precision in tables and tooltips. Right-align with `tabular-nums`. Use one date format per surface.

## Anti-patterns (don't)
Two more, beyond the ten requested, that showed up in the sources:
- **Decoration:** skeuomorphic dials, LED displays, 3D bars and logo in the top-left prime spot (Few's #9, #11 and #7).
- **Fragmenting across screens:** metrics picked one at a time by radio buttons so they can never be compared (Few's #1).

## Good references
- [Few: Common Pitfalls in Dashboard Design (PDF)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf). The source of 13 pitfalls with real vendor examples.
- [Few: Bullet Graph Design Specification (PDF)](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf). The gauge replacement with exact intensities.
- [NN/g: Dashboards: Making charts easier to understand](https://www.nngroup.com/articles/dashboards-preattentive/). Covers gauges, pie and 3D, and colour for magnitude.
- [NN/g: Progress indicators](https://www.nngroup.com/articles/progress-indicators/). Gives the 1 s, 2–10 s and 10+ s thresholds.
- [Baymard: Dashboard cards must be highly consistent](https://baymard.com/blog/cards-dashboard-layout). Gives the card consistency findings.
- [Vercel: Web Interface Guidelines](https://vercel.com/design/guidelines). Covers loading timings, number formatting and units.

## Bad references
- The figures in Few's white paper: a gauge with unlabeled ticks (fig 3), 4–10 decimal digits (fig 4), a pie needing labels (fig 7), variety gone amok (fig 9), a 3D bright bar chart (fig 10), a non-zero bar baseline exaggerating 2× into 4× (fig 11), and a logo in the top-left (fig 12).
- [Borland and Taylor, "Rainbow Color Map (Still) Considered Harmful", IEEE CG&A 2007](https://ieeexplore.ieee.org/document/4118486), with commentary from [MathWorks](https://blogs.mathworks.com/headlines/2018/10/10/a-dangerous-rainbow-why-colormaps-matter/). Rainbow and jet maps create false boundaries.
- [Baymard: Best Buy's card dashboard (2018 test)](https://baymard.com/blog/cards-dashboard-layout). Inconsistent cards made users scroll past the feature they needed.
- [CNBC: Robinhood confetti](https://www.cnbc.com/2021/03/31/robinhood-gets-rid-of-confetti-feature-amid-scrutiny-over-gamification.html). Decoration with regulatory consequences.

## Accessibility
- AP4 and AP5 overlap with WCAG 1.4.1 (Use of Color). Every colour-coded state needs text or a shape.
- AP8: spinners use `<progress>` without a value (implicit progressbar role) and a label. Respect `prefers-reduced-motion` (modern-web-guidance spinner guide).
- AP9: units must be in the accessible name, not only in a visual suffix.

## Motion / interaction
- Never animate counting-up numbers on load. It delays reading and implies change that didn't happen.
- Bar grow-in animation, if any, should be 200 ms or less and disabled under reduced motion.

## Tokens and values
| Check | Threshold |
|---|---|
| Headline KPIs | 3–5 (max 6) |
| Metrics per board | ≤ 12 |
| Categorical hues per chart | ≤ 6–8 |
| Bullet graph bands | 2–5, ideally 3 (40/25/10% black) |
| Loader show-delay / minimum | 150–300 ms / 300–500 ms |
| Spinner max before progress | 10 s |
| Currency decimals | 0 or 2 per context |
| KPI precision | 2–3 significant digits ($3.8M) |

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
- [ ] ≤ 5 headline KPIs and ≤ 12 metrics on the board.
- [ ] No cumulative all-time counters as headlines.
- [ ] No radial gauges; bullet graphs or number plus delta instead.
- [ ] Single-series charts use one colour; continuous scales are perceptually ordered.
- [ ] Every KPI has a comparison, expressed as a direct % variance.
- [ ] Card internals are identical, and size reflects importance.
- [ ] Modals only for destructive or irreversible actions.
- [ ] Loaders are per card, delayed, time-boxed, with an error and Retry path.
- [ ] Every value has a unit, and one formatter per metric kind.

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
- https://docs.mixpanel.com/docs/boards
- modern-web-guidance: guides/user-experience/content-first-noise-reduction.md, guides/ui-components/spinner.md, guides/ui-components/progress.md, guides/ui-components/dialog.md
