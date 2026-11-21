# Dashboard design review rubric

> Score any dashboard on 35 checks in 7 sections, 0–2 points each, collecting evidence per check. A dashboard ships at 80% or more with no "must" check at 0.

**Category:** Reference gallery / review tool · **Applies to:** any dashboard screen, KPI row, board, monitoring view, finance home · **Priority:** must

## When to use / when not
- Run it in design review, before release, and when auditing a competitor or an existing screen.
- An agent can run it from a screenshot plus DOM access. Checks marked **[DOM]** are verified in code, **[VIS]** visually, and **[INT]** by interacting.
- Not a substitute for usability testing with real users and tasks. It catches known failure modes, not task fit.

## Rules (do)
**Scoring:** 0 means fails, 1 means partial, 2 means passes, and N/A is excluded from the denominator. Checks tagged **(must)** at 0 block shipping whatever the total. Score = points ÷ (2 × applicable checks).

**Bands:** ≥ 80% ship · 65–79% ship with tracked fixes · < 65% redesign.

### A. Purpose and content (Few #1, #10; Amplitude; Datadog)
| ID | Check | How to verify |
|---|---|---|
| A1 (must) | The dashboard states its audience and question or goal (title, description or "About") | [VIS] header or description present |
| A2 | 3–5 headline KPIs (max 6) | [DOM] count KPI tiles in the first row |
| A3 | ≤ 12 metrics or panels on the board (excluding drill-down pages) | [DOM] count `figure` or panel elements |
| A4 | No vanity metrics: no cumulative all-time counters as headlines, and each KPI maps to a decision | [VIS] plus ask "what would we do if this moved 10%?" |
| A5 | Owner and freshness shown ("Updated 12:04", "Official", owner) | [VIS] |

### B. Context and comparison (Few #2, #4; Stripe; PostHog; Ramp)
| ID | Check | How to verify |
|---|---|---|
| B1 (must) | Every KPI shows at least one comparison: prior period, target, budget or benchmark | [VIS] each tile |
| B2 | The comparison basis is named ("vs previous 30 days"), not just an arrow | [VIS] |
| B3 | Variance is expressed directly (% or pp), not left as two numbers to subtract | [VIS] |
| B4 | Targets or thresholds are shown where they exist (bullet graph, reference line) | [VIS] |

### C. Encoding and chart choice (NN/g; Few #5, #7, #8)
| ID | Check | How to verify |
|---|---|---|
| C1 (must) | No radial gauges, 3D charts, or pie or donut charts with more than 2–3 slices | [VIS] |
| C2 (must) | Bar and area charts start at zero, and truncated line axes are labelled | [VIS] axis |
| C3 | Bars are sorted by value unless the order is inherently ordinal or temporal | [VIS] |
| C4 | Chart type is repeated for like data; no variety for its own sake | [VIS] |
| C5 | Every chart has a table or "view data" alternative | [INT] |

### D. Colour and visual hierarchy (Few #9–#13; Carbon; Baymard)
| ID | Check | How to verify |
|---|---|---|
| D1 (must) | Colour is never the only carrier of meaning: status has text or an icon, and deltas have a sign | [VIS] greyscale screenshot |
| D2 | Single-series charts use one colour, with highlight colour used sparingly | [VIS] |
| D3 | Continuous scales are perceptually ordered (no rainbow or jet), and diverging scales centre on a meaningful zero | [VIS] |
| D4 | The most important element is top-left or largest, and chrome (logo, nav) is subdued | [VIS] squint test |
| D5 | Card internals are identical (header, value, comparison, link), and size varies only for importance | [VIS] |
| D6 | No decoration: no skeuomorphic dials, LED faces, heavy shadows or gradients behind data | [VIS] |

### E. Numbers and units (Few #3, #4; Vercel; NN/g)
| ID | Check | How to verify |
|---|---|---|
| E1 (must) | Every value or axis has a unit or currency, and % and pp are distinguished | [VIS] |
| E2 | Precision fits the task: 2–3 significant digits on KPIs, full precision in tables and tooltips | [VIS] |
| E3 | Currency in one context uses either 0 or 2 decimals, never a mix | [VIS] |
| E4 | Numbers use locale-aware formatting (`Intl.NumberFormat`), and dates use one format per surface | [DOM] |
| E5 | Numeric columns are right-aligned with `tabular-nums` or a mono face | [DOM] computed `font-variant-numeric` |

### F. States, loading and feedback (NN/g; Vercel)
| ID | Check | How to verify |
|---|---|---|
| F1 (must) | Loading is per card or module, not a page-blocking overlay | [INT] throttle network |
| F2 | Indicators are delayed 150–300 ms and visible for at least 300–500 ms; no flash | [INT] |
| F3 | Waits over 10 s switch to progress or an explanation, and a timeout leads to an error plus Retry | [INT] block a request |
| F4 | Empty, error, partial and stale states are designed, and stale data stays visible with an "Updating" badge | [INT] |
| F5 | Modals are used only for destructive or irreversible actions; detail opens in a drawer or inline | [INT] |

### G. Interaction and accessibility (Vercel; Grafana; WCAG)
| ID | Check | How to verify |
|---|---|---|
| G1 | Filters, date range, tabs and variables persist in the URL | [INT] reload and Back |
| G2 | Charts drill down to underlying records (Ramp or Mercury pattern) | [INT] |
| G3 (must) | Keyboard: all controls are reachable, focus is visible, and tooltips also open on focus | [INT] Tab through |
| G4 | Text contrast is ≥ 4.5:1 (body) or ≥ 3:1 (large text, chart marks against the background) | [DOM] contrast tool |
| G5 | `prefers-reduced-motion` disables non-essential animation, and live regions announce state changes only | [DOM] |

## Anti-patterns (don't)
- Don't average away a blocker: a 90% score with D1 = 0 still fails.
- Don't score from marketing screenshots alone. F and G need interaction with real, messy data.
- Don't mark N/A to inflate the score. N/A is only for checks that are structurally impossible (for example B4 with no target in the domain).
- Don't report a bare score. Every 0 or 1 needs evidence (selector, screenshot region or quote) and a specific fix.

## Good references
- [Few: Common Pitfalls in Dashboard Design](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf). The source for sections A–E.
- [NN/g: Dashboards and preattentive attributes](https://www.nngroup.com/articles/dashboards-preattentive/). The source for C and D.
- [NN/g: Progress indicators](https://www.nngroup.com/articles/progress-indicators/). The source for F.
- [Vercel: Web Interface Guidelines](https://vercel.com/design/guidelines). The source for E, F and G thresholds. It is itself formatted as an agent-runnable checklist.
- [Grafana: Dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/). Its maturity model is a model for scoring bands.
- [Baymard: Card dashboards](https://baymard.com/blog/cards-dashboard-layout). The source for D5.
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/). The source for D4 and the consistent colour per data set.

## Bad references
- Rubrics that score aesthetics ("looks modern") or count features ("has 10 chart types"). They reward Few's pitfall #6 (meaningless variety) and #11 (decoration).
- See ref-dashboard-anti-patterns.md for worked bad examples per check.

## Accessibility
- G3, G4, G5 and D1 are the accessibility floor. D1 and G3 are must-checks.
- Run the greyscale test (CSS `filter: grayscale(1)`) and a CVD simulation (deuteranopia, protanopia) for D1 and D3.

## Motion / interaction
- During the F checks, throttle to "Slow 4G" and block one data endpoint to observe partial failure.
- During G1, apply 2 filters, reload, then press Back. The state must survive both.

## Tokens and values
| Threshold | Value |
|---|---|
| Headline KPIs | 3–5 (max 6) |
| Metrics per board | ≤ 12 |
| Loader delay / minimum | 150–300 ms / 300–500 ms |
| Determinate progress after | 10 s |
| Body text contrast | ≥ 4.5:1 |
| Chart mark / large text contrast | ≥ 3:1 |
| Ship bar | ≥ 80% and no must-check at 0 |

## Implementation sketch
Report format the agent should emit (typed, so it can be validated):
```ts
import { z } from "zod";

export const CheckResult = z.object({
  id: z.string().regex(/^[A-G]\d$/),
  score: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal("na")]),
  must: z.boolean(),
  evidence: z.string().min(1),   // selector, screenshot region, or quoted text
  fix: z.string().optional(),     // required when score < 2
}).refine(r => r.score === 2 || r.score === "na" || (r.fix?.length ?? 0) > 0, { message: "fix required" });

export const Review = z.object({
  target: z.string(),
  results: z.array(CheckResult),
});
export type Review = z.infer<typeof Review>;

export function summarise(review: Review): { pct: number; blocked: boolean; band: "ship" | "fix" | "redesign" } {
  const scored = review.results.filter(r => r.score !== "na");
  const pts = scored.reduce((s, r) => s + (r.score === "na" ? 0 : r.score), 0);
  const pct = scored.length ? Math.round((pts / (2 * scored.length)) * 100) : 0;
  const blocked = scored.some(r => r.must && r.score === 0);
  const band = blocked || pct < 65 ? "redesign" : pct < 80 ? "fix" : "ship";
  return { pct, blocked, band };
}
```
A quick DOM probe for E5 and D1 hints:
```ts
const numericCells = [...document.querySelectorAll<HTMLElement>("td, .kpi .value")]
  .filter(el => /^[\s$€£¥+\-−]*[\d.,]+[%KMBkmb]?\s*$/.test(el.textContent ?? ""));
const notTabular = numericCells.filter(el => !getComputedStyle(el).fontVariantNumeric.includes("tabular-nums"));
```

## Checklist
- [ ] All 35 checks scored with evidence, and N/A justified.
- [ ] No must-check (A1, B1, C1, C2, D1, E1, F1, G3) at 0.
- [ ] Greyscale and CVD screenshots attached for D1 and D3.
- [ ] Throttled-network and blocked-endpoint runs done for F1–F4.
- [ ] URL-state round-trip done for G1.
- [ ] Final score and band reported, with fixes ranked by (must, then points lost).

## Sources
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/modal-nonmodal-dialog/
- https://baymard.com/blog/cards-dashboard-layout
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://vercel.com/design/guidelines
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://github.com/DataDog/effective-dashboards
- https://www.amplitude.com/blog/analytics-dashboard
- modern-web-guidance: guides/user-experience/content-first-noise-reduction.md, guides/ui-components/dialog.md, guides/ui-components/spinner.md
