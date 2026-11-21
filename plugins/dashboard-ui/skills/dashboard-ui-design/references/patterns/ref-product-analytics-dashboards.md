# Product analytics dashboards: PostHog, Amplitude, Mixpanel

> An analytics board is a curated narrative of at most 12 insights for a named audience. Each insight carries its comparison period, and text cards say what "good" looks like.

**Category:** Reference gallery · **Applies to:** product analytics boards, growth and KPI dashboards, team reporting pages, any "board of saved charts" · **Priority:** should

## When to use / when not
- Use this when users assemble saved charts (insights or reports) onto a shared board that other people read.
- Use it for analytical dashboards (NN/g), where decisions are made over days, not seconds.
- Not for real-time ops (see ref-devops-dashboards.md). Not for a single deep-dive analysis screen, which is an exploration tool, not a dashboard.

## Rules (do)
**Audience and goal first (Amplitude)**
- Name the audience before choosing metrics. Amplitude's guide pairs roles with dashboard types: executives get management dashboards (revenue and customer metrics), marketers get marketing KPI dashboards (campaign and conversion), and PMs get product dashboards (acquisition, engagement, retention and monetisation).
- "Only metrics that directly relate to your questions and KPIs have a place in an analytics dashboard." "Without a goal to drive it, an analytics dashboard is just a fancy collection of stats."
- Order the board as a story with "a clear, logical flow from top to bottom": outcome, then drivers, then diagnostics.
- Mark trusted boards. Amplitude's **Official** designation (an icon by the title, Enterprise plan, set by an admin or manager) tells users they "can trust the dashboard content as current, accurate, and vetted". Copy this as a verified or owner badge.

**Board size and layout (Mixpanel)**
- Allow up to **4 cards per row** ("Up to four cards (either reports or text) can exist within a row"). Cards "automatically expand to fill the width of that row", resize in 1/12 steps with a 3/12 minimum, and a row's height starts from its tallest card.
- Keep boards to **12 or fewer metrics** (ref-design-review-rubric.md A3). More dilutes the signal. (An earlier draft attributed an "8–12 metrics" rule to Mixpanel via a third-party mirror; the current Mixpanel docs don't state it.)
- Start with the most important metric and use **text cards** to explain how to read each metric and what "good" looks like. Mixpanel suggests text cards to "share the reasoning behind tracking any metric", and section headers to group reports.

**Comparison is a toggle on every insight (PostHog)**
- Give every trend and number insight a "Compare to previous period" toggle. In PostHog it adds "a percentage change pill" to a number card, and in a table "comparison values appear in a dedicated column next to the current values".
- Let one insight live on several dashboards (PostHog: "Any changes to the insight are reflected everywhere it appears"). Edit once instead of copying.
- Apply dashboard-level date and property filters to every insight on the board, and show visibly when an insight overrides them (PostHog marks such tiles "Ignores dashboard filters" or shows a warning).

## Anti-patterns (don't)
- **Wall of metrics:** Amplitude: "Teams with a wall of metrics may stall rather than make any decisions", and extra metrics risk "muddying the decision-making process". A board with 40 charts has no hierarchy.
- **Vanity metrics:** cumulative totals (all-time sign-ups, total page views) only go up and never prompt action. Amplitude's example is the reverse risk: a team that sees "total visitors" fall may pull back even while getting the results it wants. Prefer rates, ratios and cohorts. See ref-dashboard-anti-patterns.md (AP2).
- **Unexplained metrics:** a chart titled "Activation" with no definition. Use a text card or an info popover with the event definition.
- **Mixed date ranges without labels:** one card at 7 days, another at 30, and nothing on the card says which.
- **Copies instead of references:** duplicated insights drift apart, the same problem as Grafana sprawl.
- **Untrusted boards:** with no owner and no "official" mark, readers can't tell a vetted board from someone's scratchpad.

## Good references
- [PostHog Docs: Trends, charts](https://posthog.com/docs/product-analytics/trends/charts). The number chart includes "compared to previous period" as a %, and the table adds a comparison column.
- [PostHog Docs: Dashboards](https://posthog.com/docs/product-analytics/dashboards). Insights on several dashboards at once, dashboard-level filters and override indicators.
- [Amplitude: How to build the perfect analytics dashboard](https://www.amplitude.com/blog/analytics-dashboard). Covers audience first, KPI-only selection, top-to-bottom narrative, and the mistakes list.
- [Amplitude Docs: Create a dashboard](https://amplitude.com/docs/analytics/dashboard-create). Covers the Official designation for vetted content.
- [Mixpanel Docs: Boards](https://docs.mixpanel.com/docs/boards). Gives the 4-cards-per-row grid, 1/12 resizing, row height rules and text cards.
- [Mixpanel blog: Boards](https://mixpanel.com/blog/boards-collaborate-cards-mixpanel-feature-update/). Recommends text cards to explain how to read key data and why success is measured that way.

## Bad references
- [Amplitude Community: 3 things that make for a bad dashboard](https://community.amplitude.com/discussion/12761/3-things-that-make-for-a-bad-dashboard). A September 2024 tips post quoting practitioner Shoin Wolfe: "data overload, poor data visualization in which you can't make actual actions from the data you look at, and lack of customization." One practitioner's opinion, not research.
- The typical self-serve board after a year: dozens of auto-titled charts ("Pageview count, 30d"), with no text, no owner and conflicting date ranges. This is Few's pitfall #9, "arranging the data poorly".

## Accessibility
- Every insight card must be a landmark-friendly `<figure>` with a `<figcaption>` holding the metric name, period and unit.
- Provide a "view as table" for every chart. Product analytics users need exact values, and screen-reader users need them most.
- The comparison delta must be text ("+12% vs prior 30 days"), not only an arrow colour.

## Motion / interaction
- Changing a dashboard-level filter re-queries all cards. Keep each card's old data visible with "Updating…" (prog-stale-while-revalidate.md); a card with no data yet shows its own placeholder after about a 200 ms delay (SKILL.md), never a page-blocking overlay.
- Cards that fail show an inline error with Retry. The rest of the board still renders.
- Drag-to-reorder cards with a keyboard alternative (move up and down buttons).

## Tokens and values
| Token | Default | Source |
|---|---|---|
| Cards per row | max 4 | Mixpanel |
| Metrics per board | ≤ 12 | ref-design-review-rubric.md A3 |
| Comparison | previous period, toggle on by default for number cards | PostHog offers the toggle; on-by-default is our recommendation |
| Text card | 1 per section, ≤ 60 words | our default, after the Mixpanel blog pattern |
| Trust badge | "Official" / owner avatar plus last-verified date | Amplitude |
| Card min height | 240px chart, 120px number | common practice |

## Implementation sketch
```html
<article class="board" aria-labelledby="board-title">
  <header>
    <h1 id="board-title">Activation, weekly</h1>
    <p class="meta"><span class="badge">Official</span> Owner: Growth · Verified 2026-11-14</p>
    <p class="filters">Last 30 days vs previous 30 days · All platforms</p>
  </header>
  <aside class="text-card">
    <h2>How to read this board</h2>
    <p>Activation = created first project within 7 days of sign-up. Healthy: ≥ 35%.</p>
  </aside>
  <figure class="card">
    <figcaption>Activation rate <small>% of sign-ups, 7-day window</small></figcaption>
    <p class="value">37.4%</p><p class="delta">+2.1 pts vs previous 30 days</p>
  </figure>
</article>
```
```css
.board { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 16px; }
.board > header, .board > .text-card { grid-column: 1 / -1; }
.card .value { font-variant-numeric: tabular-nums; font-size: 1.75rem; }
```

## Checklist
- [ ] The board names its audience and question in its header or first text card.
- [ ] 12 or fewer metrics (rubric A3), and 4 or fewer cards per row.
- [ ] Every number card shows a comparison and names the comparison window.
- [ ] Each metric has a definition reachable in one click.
- [ ] The board shows owner, trust status and last-verified date.
- [ ] Insights are referenced, not copied, across boards.
- [ ] Per-card loading and error states; no global blocking spinner.

## Sources
- https://posthog.com/docs/product-analytics/trends/charts
- https://posthog.com/docs/product-analytics/dashboards
- https://posthog.com/learn/product-analytics/pocket-guide/dashboards
- https://www.amplitude.com/blog/analytics-dashboard
- https://amplitude.com/docs/analytics/dashboard-create
- https://community.amplitude.com/discussion/12761/3-things-that-make-for-a-bad-dashboard
- https://docs.mixpanel.com/docs/boards
- https://mixpanel.com/blog/boards-collaborate-cards-mixpanel-feature-update/
- https://www.nngroup.com/articles/dashboards-preattentive/
