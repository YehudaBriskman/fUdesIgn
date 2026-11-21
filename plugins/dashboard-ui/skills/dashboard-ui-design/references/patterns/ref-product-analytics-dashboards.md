# Product analytics dashboards: PostHog, Amplitude, Mixpanel

> An analytics board is a curated narrative of 8–12 insights for a named audience. Each insight carries its comparison period, and text cards say what "good" looks like.

**Category:** Reference gallery · **Applies to:** product analytics boards, growth and KPI dashboards, team reporting pages, any "board of saved charts" · **Priority:** should

## When to use / when not
- Use this when users assemble saved charts (insights or reports) onto a shared board that other people read.
- Use it for analytical dashboards (NN/g), where decisions are made over days, not seconds.
- Not for real-time ops (see ref-devops-dashboards.md). Not for a single deep-dive analysis screen, which is an exploration tool, not a dashboard.

## Rules (do)
**Audience and goal first (Amplitude)**
- Name the audience before choosing metrics. Amplitude's guide maps roles to metric families: executives get revenue and customer value, marketers get funnel and campaign, PMs get acquisition, engagement, retention and monetisation.
- Include "only metrics that directly relate to your questions and KPIs". Without a defined objective, a dashboard is "just a fancy collection of stats".
- Order the board as a story with "a clear, logical flow from top to bottom": outcome, then drivers, then diagnostics.
- Mark trusted boards. Amplitude's **Official** badge tells the organisation that content is "current, accurate, and vetted". Copy this as a verified or owner badge.

**Board size and layout (Mixpanel)**
- Allow up to **4 cards per row**. Cards expand to fill the row width, and row height follows the tallest card.
- Keep boards to about **8–12 key metrics**. More dilutes the signal (Mixpanel docs guidance, as mirrored).
- Start with the most important metric and use **text cards** to explain how to read each metric and what "good" looks like.

**Comparison is a toggle on every insight (PostHog)**
- Give every trend and number insight a "Compare to previous period" toggle. On a number card it adds a % change, and in a table it adds a side-by-side column.
- Let one insight live on several dashboards (PostHog). Edit once and update everywhere, instead of copying.
- Apply dashboard-level date and property filters to every insight on the board, and show visibly when an insight overrides them.

## Anti-patterns (don't)
- **Wall of metrics:** Amplitude warns that too many metrics "muddy" decisions. A board with 40 charts has no hierarchy.
- **Vanity metrics:** cumulative totals (all-time sign-ups, total page views) only go up and never prompt action. Amplitude's own example: "total visitors" can fall while results improve. Prefer rates, ratios and cohorts. See ref-dashboard-anti-patterns.md.
- **Unexplained metrics:** a chart titled "Activation" with no definition. Use a text card or an info popover with the event definition.
- **Mixed date ranges without labels:** one card at 7 days, another at 30, and nothing on the card says which.
- **Copies instead of references:** duplicated insights drift apart, the same problem as Grafana sprawl.
- **Untrusted boards:** with no owner and no "official" mark, readers can't tell a vetted board from someone's scratchpad.

## Good references
- [PostHog Docs: Trends, charts](https://posthog.com/docs/product-analytics/trends/charts). The number chart includes "compared to previous period" as a %, and the table adds a comparison column.
- [PostHog Docs: Insight tips](https://posthog.com/docs/product-analytics/trends/tips). Insights can be reused across dashboards.
- [Amplitude: How to build the perfect analytics dashboard](https://www.amplitude.com/blog/analytics-dashboard). Covers audience first, KPI-only selection, top-to-bottom narrative, and the mistakes list.
- [Amplitude Docs: Create a dashboard](https://amplitude.com/docs/analytics/dashboard-create). Covers the Official designation for vetted content.
- [Mixpanel Docs: Boards](https://docs.mixpanel.com/docs/boards). Gives the 4-cards-per-row grid, row height rules and rich text cards.
- [Mixpanel blog: Boards](https://mixpanel.com/blog/boards-collaborate-cards-mixpanel-feature-update/). Recommends text cards to explain how to read critical data and why it's measured that way.

## Bad references
- [Amplitude Community: 3 things that make for a bad dashboard](https://community.amplitude.com/tips-tricks-86/3-things-that-make-for-a-bad-dashboard-4580). A practitioner thread on boards with no goal, no ownership and too many charts. Content was only partly retrievable, so cite it as community opinion.
- The typical self-serve board after a year: dozens of auto-titled charts ("Pageview count, 30d"), with no text, no owner and conflicting date ranges. This is Few's pitfall #9, "arranging the data poorly".

## Accessibility
- Every insight card must be a landmark-friendly `<figure>` with a `<figcaption>` holding the metric name, period and unit.
- Provide a "view as table" for every chart. Product analytics users need exact values, and screen-reader users need them most.
- The comparison delta must be text ("+12% vs prior 30 days"), not only an arrow colour.

## Motion / interaction
- Changing a dashboard-level filter re-queries all cards. Show per-card loading (a spinner in the card after a 300 ms delay), never a page-blocking overlay.
- Cards that fail show an inline error with Retry. The rest of the board still renders.
- Drag-to-reorder cards with a keyboard alternative (move up and down buttons).

## Tokens and values
| Token | Default | Source |
|---|---|---|
| Cards per row | max 4 | Mixpanel |
| Metrics per board | 8–12 | Mixpanel docs guidance |
| Comparison | previous period, toggle on by default for number cards | PostHog |
| Text card | 1 per section, ≤ 60 words | Mixpanel blog pattern |
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
- [ ] 12 or fewer metrics, and 4 or fewer cards per row.
- [ ] Every number card shows a comparison and names the comparison window.
- [ ] Each metric has a definition reachable in one click.
- [ ] The board shows owner, trust status and last-verified date.
- [ ] Insights are referenced, not copied, across boards.
- [ ] Per-card loading and error states; no global blocking spinner.

## Sources
- https://posthog.com/docs/product-analytics/trends/charts
- https://posthog.com/docs/product-analytics/trends/tips
- https://posthog.com/learn/product-analytics/pocket-guide/dashboards
- https://www.amplitude.com/blog/analytics-dashboard
- https://amplitude.com/docs/analytics/dashboard-create
- https://community.amplitude.com/tips-tricks-86/3-things-that-make-for-a-bad-dashboard-4580
- https://docs.mixpanel.com/docs/boards
- https://mintlify.com/mixpanel/docs/reports/boards (mirror with the 8–12 metric guidance)
- https://mixpanel.com/blog/boards-collaborate-cards-mixpanel-feature-update/
- https://www.nngroup.com/articles/dashboards-preattentive/
