# Pick the dashboard type before the layout

> Decide whether a view is operational, analytical or strategic. That choice sets the refresh rate, density, interactivity and time scale, and mixing them on one screen serves none of them.

**Category:** Foundations · **Applies to:** product dashboards, admin home pages, monitoring screens, executive or board views, BI reports · **Priority:** must

## When to use / when not
- **Use** at the start of any dashboard project and when one dashboard "keeps growing". Sprawl is usually two or three types fused into one page.
- Stephen Few (*Information Dashboard Design*, 2006) classifies dashboards by **role: strategic, analytical, operational**. Reviewers note that the role "has the greatest impact on its visual design". NN/g uses the same operational/analytical split. Carbon calls them *presentation* vs *exploration*.
- **Not** a strict taxonomy. Vendors add "tactical" or "informational" as a fourth type, and those are not Few's. A product can ship all three types as separate views linked by drill-down.

## Rules (do)
Apply the defaults for the chosen type:

| | **Operational** | **Analytical** | **Strategic** |
|---|---|---|---|
| Question | "Is something wrong *now*?" | "Why did it change?" | "Are we on track this quarter/year?" |
| Example | Payments failure rate, on-call service health, order queue | Cohort retention, funnel breakdowns, valuation drivers | MRR vs plan, burn and runway, NPS trend |
| Refresh | Seconds to minutes (match data cadence) | On demand | Daily to monthly; static is fine |
| Time window | Last 1h–24h | User-chosen, often 90d–5y | Quarter, year, multi-year |
| Density | Medium; large status indicators | High; tables, small multiples | Low; 3–6 KPIs with targets |
| Interaction | Alerts, acknowledge, jump to runbook | Filter, drill, compare, export | Almost none; maybe period switch |
| Hierarchy | Exceptions first, sorted by severity | Question-and-answer flow | KPI vs target first, then trend |
| Viewing | Glanced at repeatedly, often wall or TV | Long sessions at a desk | Weekly or monthly review, often mobile or print |

- **Operational:**
  - Lead with exceptions. Normal states are quiet (neutral color, small), abnormal states are loud (see `color-semantic-status.md`).
  - Refresh only as often as the data changes. Grafana: "if your data changes every hour, then you don't need to set the dashboard refresh rate to 30 seconds". Faster refresh only adds load.
  - Show "last updated" with a timestamp that is relative and absolute on hover.
- **Analytical:**
  - Make filters and comparison first-class (see `found-overview-filter-details.md`).
  - Allow high density, with tables in compact mode (see `found-density-modes.md`).
  - Keep chart layout and legend position identical across panels (Carbon).
- **Strategic:**
  - Every KPI shows target, prior period and trend.
  - Precision is low: $3.8M, not $3,848,305.93 (Few Pitfall #3).
  - It must survive a PDF export or a phone screen.
- **One type per view.** If a page needs two, split it into two views and link them. The usual pattern is a strategic summary that links to an analytical breakdown.
- **Title the view by its question,** for example "Is checkout healthy right now?", "Revenue drivers" or "FY26 plan tracking", not by data source.

## Anti-patterns (don't)
- **Real-time strategic metrics.** Ticking annual revenue invites over-reaction to noise.
- **Monthly operational metrics.** An incident view aggregated per day hides the 10-minute outage.
- **Exploration on the home page.** A query builder where a status summary should be.
- **"Everything" dashboards.** 30+ panels mixing live health, quarterly targets and an ad-hoc cohort chart. Sisense: "no more than 5-9 visualizations" per dashboard. Grafana warns against "dashboard sprawl, meaning the uncontrolled growth of dashboards".
- **Gauges for strategic KPIs.** "A great deal of space is used by these gauges to tell us far too little" (Few Pitfall #2, Fig. 3). NN/g calls gauges "harder to interpret than linear graphs" and shows bullet charts as the better replacement.

## Good references
- [NN/g: Dashboards, making charts easier to understand](https://www.nngroup.com/articles/dashboards-preattentive/): operational dashboards "impart critical information quickly to users as they are engaged in time-sensitive tasks". Analytical ones "provide the user with at-a-glance information used for analysis and decision making", without the same time pressure.
- [Grafana: USE / RED / Four Golden Signals](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/): an opinionated operational overview of a fixed 3–4 metrics per service. Grafana: "alert on symptoms rather than causes, so alerting should be done on RED dashboards".
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/): presentation vs exploration dashboards, with different interaction expectations.
- [UXmatters review of Few's *Information Dashboard Design*](https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php): summarises Few's classification dimensions (role, data type, data scope, update frequency, static or interactive, display mechanism, portal function) and notes that role "has the greatest impact on its visual design".

## Bad references
- [Few, Common Pitfalls, Fig. 14](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): a screen styled as an electronic control panel, with LED-style meters and a period selector that looks like a manual switch (Pitfall #11). Decoration consumes the space that exception-first status should own.
- [Few, Common Pitfalls, Pitfall #3](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): times shown to the second and values to four to ten decimal digits on a monitoring dashboard (Fig. 4). Analytical precision is applied to an at-a-glance view.

## Accessibility
- Operational auto-refresh must not move focus or re-announce the whole page. Announce only state changes, using `aria-live="polite"`, or `assertive` for critical alerts only.
- Provide a pause control for auto-refresh and any moving content (WCAG 2.2.2 Pause, Stop, Hide).
- Strategic views are often printed or exported. Ensure they render with `@media print` and without color dependence.

## Motion / interaction (if relevant)
- Operational: value changes may flash a subtle background for ≤ 1s. Never animate chart re-draws on every tick; update in place.
- Analytical: chart transitions on filter change of 240ms (`--motion-dur-medium`) help users track what moved. Disable them under reduced motion.
- Strategic: no motion needed.

## Tokens and values
| Setting | Operational | Analytical | Strategic |
|---|---|---|---|
| Default refresh | 15s–60s (data-bound) | manual | 24h |
| Default range | 1h / 24h | 30d / 90d | QTD / YTD |
| Number precision | as needed for thresholds | full in tables, rounded in KPIs | 2–3 significant figures |
| KPI count above fold | 4–8 status tiles | 2–4 + filters | 3–6 |
| Table density | compact | compact or comfortable (user toggle) | comfortable / none |
| Stale-data warning | > 2× refresh interval | n/a | > 1 period |

## Implementation sketch
```ts
type DashboardRole = "operational" | "analytical" | "strategic";

interface RoleDefaults {
  refreshMs: number | null;
  defaultRange: "1h" | "24h" | "30d" | "90d" | "QTD" | "YTD";
  significantFigures: number;
  density: "compact" | "comfortable";
}

const ROLE_DEFAULTS: Record<DashboardRole, RoleDefaults> = {
  operational: { refreshMs: 30_000, defaultRange: "24h", significantFigures: 4, density: "compact" },
  analytical:  { refreshMs: null,   defaultRange: "90d", significantFigures: 6, density: "compact" },
  strategic:   { refreshMs: null,   defaultRange: "QTD", significantFigures: 3, density: "comfortable" },
};
```
```html
<main data-role="operational" data-density="compact">
  <p class="freshness">Updated <time datetime="2026-11-21T10:42:05Z" title="21 Nov 2026 10:42:05 UTC">12s ago</time>
    <button type="button" aria-pressed="false">Pause updates</button></p>
</main>
```

## Checklist
- [ ] Each view declares one role, and its title states the question it answers.
- [ ] The refresh interval matches the data cadence (no 30s refresh on hourly data).
- [ ] Strategic KPIs show target, prior period and trend, rounded to 2–3 significant figures.
- [ ] Operational views lead with exceptions, and healthy states are visually quiet.
- [ ] Analytical views keep filters in the URL and support drill-down to rows.
- [ ] Auto-updating views have a pause control and a "last updated" timestamp.

## Sources
- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://www.sisense.com/blog/4-design-principles-creating-better-dashboards/
