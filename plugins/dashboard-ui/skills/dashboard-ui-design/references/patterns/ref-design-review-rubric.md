# Dashboard design review rubric

> Score each page type of a dashboard on 39 checks in 8 sections, 0–2 points each against explicit criteria, collecting evidence per check. A dashboard ships at 80% or more with no "must" check at 0 on any page type.

**Category:** Reference gallery / review tool · **Applies to:** any dashboard screen, KPI row, board, monitoring view, finance home · **Priority:** must

## When to use / when not
- Run it in design review, before release, and when auditing a competitor or an existing screen.
- An agent can run it from screenshots, DOM access and a scriptable browser. Checks marked **[DOM]** are verified in code or computed styles, **[VIS]** on a screenshot, and **[INT]** by interacting.
- Not a substitute for usability testing with real users and tasks. It catches known failure modes, not task fit.

## Rules (do)
**Scoring unit:** score each page type separately (for example overview, entity detail, list, settings), using one representative instance plus the extra instances H1 asks for. The dashboard score is the mean of the page-type percentages; a must-check at 0 on any page type blocks the whole dashboard.

**Stable IDs:** check IDs (A1 … H3) never change meaning and are never renumbered. A new check takes the next free number in its section; a retired ID is not reused. ref-dashboard-anti-patterns.md and review reports cite these IDs.

**Scoring:** each check has explicit 2 / 1 / 0 criteria below. Score 2 only when the 2-criterion holds for every instance on the screen; a check with no 1-criterion is binary. N/A is allowed only where the row says so, and is excluded from the denominator. Checks tagged **(must)** at 0 block shipping whatever the total. Score = points ÷ (2 × applicable checks), rounded down to a whole percent.

**Bands:** ≥ 80% ship · 65–79% ship with tracked fixes · < 65% redesign. Any must-check at 0 is "redesign" regardless of the percentage.

**Evidence kit (collect before scoring):** a full-page screenshot at 1440 px wide; the same screenshot with `filter: grayscale(1)` on `<html>`; the DOM (outerHTML) and computed styles of KPI tiles, chart containers and numeric table cells; one reload under DevTools "Slow 4G"; one run with a data endpoint blocked; one run with `prefers-reduced-motion: reduce` emulated; one screenshot at 390 × 844 with `pointer: coarse` emulated. "First viewport" means the top 1440 × 900 px.

### A. Purpose and content (Few pitfalls 1, 10; Amplitude; Datadog)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| A1 (must) | The page states its audience and its question or goal | [VIS] read the title, subtitle, description or "About" text in the first viewport or one click away | Names an audience (role or team) and a question or goal | Names only one | Title only ("Dashboard", "Overview") | Add a subtitle: "For <team>: <question>" |
| A2 | Headline KPI count | [DOM] count KPI tiles in the top KPI row or region | 3–6 tiles | 1–2 or 7–8 | 0 or ≥ 9 | Demote extra KPIs to a table or a second view |
| A3 | Panel count. A *panel* is a visually bounded region with its own title holding one KPI tile, chart, table or list | [DOM] count panels rendered on the page, excluding collapsed sections, tabs not shown and linked drill-down pages | ≤ 12 | 13–20 | > 20 | Split into linked views or collapse secondary panels |
| A4 | No cumulative vanity headline | [VIS] find headline tiles showing an all-time or since-launch total with no period ("Total users", "All-time revenue") | None | 1 tile | ≥ 2 tiles | Replace with a per-period value, rate or ratio |
| A5 | Freshness and ownership shown | [VIS] look for an "Updated …" time (absolute time visible or on hover) and an owner, team or source label | Both | One | Neither | Add "Updated 12:04 UTC · Source: …" in the header |

### B. Context and comparison (Few pitfalls 2, 4; Stripe; PostHog; Ramp)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| B1 (must) | Every KPI has a comparison: prior period, target, budget, benchmark, or a sparkline with a reference | [VIS] inspect each KPI tile | 100% of tiles | ≥ 50% | < 50% | Add a delta vs the prior period or the target |
| B2 | The comparison basis is named in text ("vs previous 30 days", "vs target") | [VIS] each delta, or one board-level label that visibly covers all deltas | Every delta has a visible basis | Basis only on hover, or only for some deltas | No basis anywhere | Append the basis after the delta |
| B3 | Variance is shown directly as a signed %, pp or difference | [VIS] each KPI with a comparison | Every comparison | Some | None (two raw numbers to subtract) | Show "+4.2% vs …" instead of both raw values |
| B4 | Known targets or thresholds are drawn (bullet tick, reference line, "of $4.2M target") | [VIS] each metric whose target, budget or SLO exists in the data or spec. N/A if none exists | All | Some | None | Add a reference line or bullet-graph tick |

### C. Encoding and chart choice (NN/g; Few pitfalls 5–8; chart-pies-donuts-gauges.md)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| C1 (must) | No radial gauges, no 3D charts, no pie or donut with more than 5 slices | [VIS] inspect every chart; count pie and donut slices | None present | — | Any present | Gauge → bullet graph; pie > 5 → sorted bars; 3D → 2D |
| C2 (must) | Bars and areas start at zero; a line chart with a non-zero minimum shows labelled y ticks | [VIS] read each y-axis; [DOM] read the scale domain if exposed | All bar and area axes include 0, and every cropped line axis has tick labels | A cropped line axis without tick labels | Any bar or area chart with a non-zero baseline | Set the bar or area domain to start at 0 |
| C3 | Bars of nominal categories are sorted by value | [VIS] each bar chart; ordinal and time categories are exempt. N/A if no nominal bar chart | All sorted | Some | None | Sort descending by value |
| C4 | Like data uses the same chart type and number format | [VIS] group charts by data kind (time series, ranking, share) and compare | No exceptions | 1 exception | ≥ 2 exceptions | Use one chart type per data kind |
| C5 | Every chart has a data-table alternative ("View data", a `<table>`, or a CSV download) | [DOM]/[INT] look for the control or element per chart | All charts | ≥ 50% | < 50% | Add a "View as table" toggle |

### D. Colour and visual hierarchy (Few pitfalls 9–12; Carbon; Baymard)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| D1 (must) | Colour is never the only cue | [VIS] on the greyscale screenshot, check every status, delta direction and series for a text, +/− sign, icon, shape, pattern or direct label | All distinguishable | — | Any element distinguishable only by hue | Add a sign, icon or direct label |
| D2 | Single-series charts use one hue, plus at most one highlight hue | [VIS] each single-series chart | All | 1 violation | ≥ 2 | One neutral series colour plus one highlight |
| D3 | Continuous scales are lightness-ordered (no rainbow or jet); diverging scales centre on a meaningful value | [VIS] each colour scale. N/A if none | All | — | Any rainbow or off-centre diverging scale | Use a single-hue sequential ramp |
| D4 | The focal point is data, not chrome | [VIS] blur the screenshot (`filter: blur(6px)`), name the most salient block, and find where the A1 answer sits | The most salient block is the A1 answer, top-left or the largest data element in the first viewport | The A1 answer is in the first viewport but not the most salient block | Logo, navigation or decoration is most salient, or the A1 answer is below the fold | Enlarge and move the answer; mute chrome |
| D5 | KPI cards share one anatomy (title, value, comparison, footer, in that order) and one value font size | [DOM] compare child order and computed `font-size` of each card's value | Identical | 1 card differs | ≥ 2 differ | Build every tile from one component |
| D6 | No decoration on data: skeuomorphic dials, LED faces, textures, images or gradients behind plotted marks | [VIS] | None | 1 instance | ≥ 2 | Remove; use a flat surface |
| D7 | One theme per page: no region renders in the opposite light or dark theme | [DOM] compare the computed `background-color` lightness (OKLCH L) of every panel with the page canvas: in a light theme all surfaces have L ≥ 0.85, in a dark theme all have L ≤ 0.35 | No mixed regions | — | Any panel, card or chart in the other theme | Map the region to the page's role tokens (`--surface`, `--text`) |

### E. Numbers and units (Few pitfalls 3, 4; data-number-formatting.md)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| E1 (must) | Every value, axis and numeric column header has a unit or currency, and percentage-point changes are written "pp" | [VIS] KPI tiles, axes and column headers | All | 1 missing | ≥ 2 missing | Put the unit in the title, axis label or header |
| E2 | KPI precision fits the task: compact notation with ≤ 3 significant digits ($3.85M), or 0 decimals at ≥ 1,000 currency units, with the exact value on hover or focus | [VIS] KPI tiles; [INT] hover or focus one | All tiles, exact value reachable | Precision fine but exact value unreachable, or 1 tile over-precise | ≥ 2 tiles over-precise (for example $3,848,305.93) | `Intl.NumberFormat` with `notation: "compact"`, full value in a tooltip |
| E3 | One precision per column and per KPI row; tables and ledgers use the currency's minor units (USD 2, JPY 0) | [VIS] compare decimal counts within each column and each KPI row | No mix | — | Any mix within one column or row | Set precision per metric, not per value |
| E4 | One formatting layer: grouping separators on values ≥ 1,000, a true minus sign (U+2212) for negatives, one date format per page | [DOM] read the text of numbers and dates | All 3 | 2 | ≤ 1 | Route all output through one `Intl` formatter |
| E5 | Numeric columns and their headers are right-aligned with tabular figures | [DOM] computed `text-align` (`right` or `end`) and `font-variant-numeric` containing `tabular-nums`, or a monospace family | All numeric columns | ≥ 50% | < 50% | `text-align: end; font-variant-numeric: tabular-nums` |

### F. States, loading and feedback (NN/g; Vercel; prog-loading-states.md; comp-overlay-choice.md)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| F1 (must) | Loading is scoped per panel, and a refresh never blanks shown data | [INT] reload under DevTools "Slow 4G", then change a filter and screenshot mid-request | Each panel has its own placeholder, and on refresh existing data stays visible | Per-panel on first load, but panels blank on refresh | A page-blocking overlay or spinner covers the board | Per-panel skeletons; keep stale data with "Updating…" |
| F2 | Indicators have a show-delay (about 200 ms, 150–300 ms) and a minimum visible time (300–500 ms) | [INT] intercept one data request and delay it 100 ms, then 600 ms; record a performance trace or screenshots every 50 ms | No indicator paints for the 100 ms response, and the 600 ms indicator stays ≥ 300 ms once shown | One of the two holds | Neither (flash or flicker) | Wrap the indicator in a delay and minimum-duration timer |
| F3 | Long waits and failures are handled | [INT] delay one request 12 s; then make it fail (HTTP 500 or blocked) | By 10 s the panel shows determinate progress or an explanation with Cancel, and the failure ends in an in-panel error with Retry | One of the two | Neither: an indefinite spinner | Add a 10 s progress or message state and an error state with Retry |
| F4 | Empty, error, partial and stale states are designed and scoped to the panel | [INT] apply a filter with no results, block one of several endpoints, trigger a refresh | All 4 states have specific copy, and stale data shows "Updating…" plus a last-updated time | 2–3 states | ≤ 1 | Design each state per panel |
| F5 | A modal `<dialog>` is used only for a decision needed now: a destructive or irreversible confirmation, a required input before an action, or a short task of ≤ 6 fields. Detail and inspection open inline, in a popover or a non-modal drawer | [INT] open every detail, filter and edit flow | No misuse | 1 non-blocking task in a modal | ≥ 2, stacked modals, or a modal on page load | Move detail to a non-modal drawer or popover |

### G. Interaction and accessibility (Vercel; Grafana; WCAG 2.2)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| G1 | View state (filters, range, tab, sort) is in the URL | [INT] change 2 filters and the tab, reload, then press Back | Survives reload, and Back restores the previous state | Survives reload only | Lost on reload | Serialise view state to query parameters |
| G2 | Charts drill down to the underlying records | [INT] click a bar, point or KPI. N/A if the page has no record-level data | Every chart reaches the records in ≤ 2 clicks | Some charts | None | Link each mark to a pre-filtered record list |
| G3 (must) | Keyboard: every control is reachable by Tab, focus is visible with an indicator ≥ 3:1 against adjacent colours, chart tooltips also open on focus, and Escape closes overlays | [INT] Tab through the whole page | All hold | All controls reachable with visible focus, but tooltips are hover-only or Escape fails | Any control unreachable, or focus invisible anywhere | `:focus-visible` ring with `--focus-ring`; open tooltips on focus |
| G4 | Contrast: text ≥ 4.5:1, large text (≥ 24 px, or ≥ 18.66 px bold) ≥ 3:1, chart marks, control boundaries and icons ≥ 3:1 | [DOM] run an automated contrast audit (for example axe-core) and sample chart marks manually | No failures | 1–2 failing elements, none of them body text | ≥ 3, or any body-text failure | Use the role tokens in `assets/tokens.css` |
| G5 | Reduced motion and quiet live regions | [INT] emulate `prefers-reduced-motion: reduce`; search the CSS for a global `animation-duration: 0.01ms` or `transition-duration: 0.01ms` reset; watch `aria-live` regions during a refresh | No movement (transform or position animation) remains, opacity or colour feedback is kept, no global reset exists, and live regions announce state changes only | One of the two holds (motion or live regions) | Neither, or a global `0.01ms` reset is present | Per-component `prefers-reduced-motion` variants (motion-reduced-motion.md) |

### H. Consistency and small screens (found-responsive-reflow.md; comp-app-shell-navigation.md; WCAG 2.5.5, 2.5.8)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| H1 | One shell per page type: every page of the same type (for example every entity detail page) uses the same app shell, navigation and header layout | [VIS] screenshot 2–3 instances of each page type (for example two different bank or customer records) and compare shell, nav position and header anatomy | Identical across instances | Minor differences (an extra header action) | A different shell or navigation for some entities | Render all instances through one page template |
| H2 | At a 390 px wide viewport nothing collides or overflows | [INT] set the viewport to 390 × 844; check `document.documentElement.scrollWidth <= 390` and screenshot for overlapping text or truncated values without a tooltip | No horizontal page scroll, no overlap, no unrecoverable truncation | Overflow inside one panel only (a table that scrolls in its own container is fine) | Horizontal page scroll or overlapping text | Container queries per panel; reflow by priority |
| H3 | Touch targets at 390 px are ≥ 44 × 44 CSS px | [DOM] under `pointer: coarse` emulation, measure `getBoundingClientRect()` of every button, link, chip and control | All ≥ 44 × 44 | All ≥ 24 × 24 (WCAG 2.5.8 AA) but some < 44 | Any < 24 × 24 | `min-block-size: 44px` under `@media (pointer: coarse)` |

## Anti-patterns (don't)
- Don't average away a blocker: a 90% score with D1 = 0 still fails.
- Don't score from marketing screenshots alone. F and G need interaction with real, messy data.
- Don't mark N/A to inflate the score. N/A is allowed only on B4, C3, D3 and G2, and only under the condition stated in that row.
- Don't give 2 for "mostly". A 2 needs every instance to pass; one failing tile makes it 1 or 0 per the row.
- Don't report a bare score. Every 0 or 1 needs evidence (selector, screenshot region or quote) and a specific fix.

## Good references
- [Few: Common Pitfalls in Dashboard Design](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf). The source for sections A–E.
- [NN/g: Dashboards and preattentive attributes](https://www.nngroup.com/articles/dashboards-preattentive/). The source for C and D.
- [NN/g: Progress indicators](https://www.nngroup.com/articles/progress-indicators/). The source for F.
- [Vercel: Web Interface Guidelines](https://vercel.com/design/guidelines). The source for the F2 timings ("show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)"), URL state (G1) and tabular numbers (E5). It is itself formatted as an agent-runnable checklist. Its "0 or 2 decimal places, never mix both" currency rule sits in Vercel's own copywriting section, which it says "aren't universal guidelines"; E3 follows data-number-formatting.md instead (precision per metric, ISO 4217 minor units in tables).
- [Grafana: Dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/). Its low, medium and high maturity model is a model for scoring bands.
- [W3C: Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/). The source for D1 (1.4.1 Use of Color), G4 (1.4.3 Contrast Minimum, 1.4.11 Non-text Contrast), G3 (2.1.1 Keyboard, 2.4.7 Focus Visible) and H3 (2.5.8 Target Size Minimum, 2.5.5 Target Size Enhanced).
- [Baymard: Card dashboards](https://baymard.com/blog/cards-dashboard-layout). The source for D5.
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/). The source for D4 and the consistent colour per data set.

## Bad references
- Rubrics that score aesthetics ("looks modern") or count features ("has 10 chart types"). They reward Few's pitfall #6 (meaningless variety) and #11 (decoration).
- See ref-dashboard-anti-patterns.md for worked bad examples per check.

## Accessibility
- D1, G3, G4, G5 and H3 are the accessibility floor. D1 and G3 are must-checks.
- Run the greyscale test (CSS `filter: grayscale(1)`) and a CVD simulation (deuteranopia, protanopia; Chrome DevTools > Rendering > "Emulate vision deficiencies") for D1 and D3.
- Large text in G4 follows WCAG: 18 pt (24 px) regular or 14 pt (about 18.66 px) bold.

## Motion / interaction
- During the F checks, throttle to "Slow 4G" and block one data endpoint to observe partial failure. Stub response times (100 ms, 600 ms, 12 s) with request interception rather than relying on network luck.
- During G1, apply 2 filters, reload, then press Back. The state must survive both.
- During H2 and H3, emulate a 390 × 844 viewport with touch (`pointer: coarse`) rather than only narrowing a desktop window.

## Tokens and values
| Threshold | Value |
|---|---|
| Headline KPIs (A2) | 3–6 for a 2 |
| Panels per page (A3) | ≤ 12 for a 2 |
| Pie or donut slices (C1) | ≤ 5 (chart-pies-donuts-gauges.md) |
| KPI precision (E2) | compact with ≤ 3 significant digits, or 0 decimals at ≥ 1,000 currency units (data-number-formatting.md) |
| Theme lightness (D7) | light surfaces OKLCH L ≥ 0.85, dark surfaces L ≤ 0.35 |
| Small-screen viewport (H2) | 390 × 844 |
| Touch target (H3) | ≥ 44 × 44 px for a 2; 24 × 24 px floor (WCAG 2.5.8) |
| Loader show-delay / minimum visible (F2) | about 200 ms (150–300 ms) / 300–500 ms, matching SKILL.md |
| Determinate progress after (F3) | 10 s |
| Body text contrast (G4) | ≥ 4.5:1 |
| Large text, chart mark, control boundary, focus indicator contrast (G3, G4) | ≥ 3:1 |
| Drill-down depth (G2) | ≤ 2 clicks to records |
| Ship bar | ≥ 80% and no must-check at 0 |

## Implementation sketch
Report format the agent should emit (typed, so it can be validated):
```ts
import { z } from "zod";

export const MUST_IDS = ["A1", "B1", "C1", "C2", "D1", "E1", "F1", "G3"] as const;
export const NA_ALLOWED = ["B4", "C3", "D3", "G2"] as const;

export const CheckResult = z.object({
  id: z.string().regex(/^[A-H]\d$/),
  score: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal("na")]),
  must: z.boolean(),
  evidence: z.string().min(1),   // selector, screenshot region, or quoted text
  fix: z.string().optional(),     // required when score < 2
}).refine(r => r.score === 2 || r.score === "na" || (r.fix?.length ?? 0) > 0, { message: "fix required" });

export const PageReview = z.object({
  pageType: z.string(),           // "overview", "entity detail", …
  results: z.array(CheckResult).length(39),
}).refine(r => r.results.every(c => c.score !== "na" || (NA_ALLOWED as readonly string[]).includes(c.id)),
  { message: "N/A used on a check that does not allow it" });

export const Review = z.object({ target: z.string(), pages: z.array(PageReview).min(1) });
export type Review = z.infer<typeof Review>;
type Band = "ship" | "fix" | "redesign";

function pagePct(results: z.infer<typeof CheckResult>[]): number {
  const scored = results.filter(r => r.score !== "na");
  const pts = scored.reduce((s, r) => s + (r.score === "na" ? 0 : r.score), 0);
  return scored.length ? Math.floor((pts / (2 * scored.length)) * 100) : 0;
}

export function summarise(review: Review): { pct: number; blocked: boolean; band: Band } {
  const pcts = review.pages.map(p => pagePct(p.results));
  const pct = Math.floor(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  const blocked = review.pages.some(p => p.results.some(r => r.must && r.score === 0));
  const band: Band = blocked || pct < 65 ? "redesign" : pct < 80 ? "fix" : "ship";
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
- [ ] Every page type scored on all 39 checks against their 2 / 1 / 0 criteria, each with evidence, and every N/A uses a row that allows it.
- [ ] No must-check (A1, B1, C1, C2, D1, E1, F1, G3) at 0.
- [ ] Greyscale and CVD screenshots attached for D1 and D3.
- [ ] Throttled-network, stubbed-latency and blocked-endpoint runs done for F1–F4.
- [ ] Reduced-motion emulation run for G5, and the CSS searched for a global `0.01ms` reset.
- [ ] 390 px touch-emulated run done for H2 and H3, and 2–3 instances per page type compared for H1.
- [ ] URL-state round-trip done for G1.
- [ ] Per-page-type and mean scores and the band reported, with fixes ranked by (must, then points lost).

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
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
