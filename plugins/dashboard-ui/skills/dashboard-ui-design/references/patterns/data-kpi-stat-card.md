# KPI / stat card

> A KPI card answers one question at a glance. It holds a short label, one big formatted value, and context: a delta against a named comparison period, a target or a trend. Every card in a row shares the same anatomy and size.

**Category:** Data display · **Applies to:** dashboard summary rows, overview pages, report headers, Grafana or Datadog-style stat panels · **Priority:** must

## When to use / when not
- **Use** for 3–6 headline metrics that the page's audience checks every visit: MRR, net revenue, active users, burn, cash runway, error rate. Maersk's big-number guideline: text and numbers work "when you have only a few important data points to share."
- **Don't** use a KPI card when the reader needs to compare more than 6 values. Use a table (see `data-cards-vs-tables-vs-lists.md`).
- **Don't** use a KPI card for a value without a decision attached. Tufte asks "What are the thinking tasks that the displays are supposed to help with?" Total sign-ups since 2019 is trivia, not a KPI.
- **Don't** use gauges or dials. A bullet graph or a progress bar against a target says the same thing in a fraction of the space (Few's bullet-graph spec was written to replace gauges).

## Rules (do)
- **Anatomy, in source order:**
  1. **Label.** 1–4 words, sentence case, names what is counted and how: "Net revenue", "Active accounts (30d)". SaaSframe: "A metric label should identify what is counted or calculated."
  2. **Value.** One number, formatted per `data-number-formatting.md`, usually compact with 3 significant digits.
  3. **Context**, at least one of:
     - a delta with sign and a visible basis ("+12.3% vs Oct"), see `data-delta-trend-indicators.md`;
     - a prior value ("$1.26M last month");
     - a target or progress ("82% of $1.5M Q4 target");
     - a sparkline (see below).
     Few's pitfall #2 is "Supplying inadequate context for the data" ([Common Pitfalls in Dashboard Design](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)). A bare number is not a KPI.
  4. **Footer (optional).** Period and freshness ("Nov 1–20 · updated 4 min ago") or a link to detail.
- **Hierarchy by size, not colour.** The value is the largest text on the card: 1.875rem (30px), weight 600. The label is 0.875rem in a muted colour, and the delta 0.875rem. Maersk puts the title in a smaller font than the value and says to "ensure that they all use the same font size" across big-number charts. Never auto-shrink one card's value to fit. Use compact notation instead.
- **Two KPI type roles.** A single hero or primary KPI (one per page, often above the card row) uses 2rem (`--type-hero`). Values in a row of secondary KPI cards use 1.875rem (30px), the `--type-kpi` role in `tokens.css`. These two roles are canonical; older text that says 30–36px or 1.5rem for the card value is superseded. Don't mix sizes within one row.
- **Shared time window.** All cards in a row use the dashboard's selected period. If one card differs (for example "trailing 12 months"), its label says so.
- **Equal heights and widths in a row.** Use CSS grid `repeat(auto-fit, minmax(14rem, 1fr))`. With subgrid, label, value, delta and sparkline align across cards even when one card lacks a region (see `ui-components/card.md`, "Align cards in a grid").
- **Sparkline rules** (Tufte: "small, intense, simple, word-sized"):
  - no axes, gridlines or legend;
  - wide and short, about 4:1 to 5:1 (120×28px is the SKILL.md default). Tufte's financial example is about 5:1, and he tunes the ratio so slopes average about 45°;
  - mark the final point with a 2–3px dot;
  - optionally shade the normal range as a light band;
  - use the same time window as the delta, and state it;
  - Y domain: start at zero only for counts and amounts where zero is meaningful. Otherwise fit min to max with about 10% padding, but then don't compare sparkline heights across cards.
  - Grafana auto-hides the sparkline when the panel is too small. Copy that with a container query.
- **Targets.** Show "value / target" plus a thin progress bar or bullet graph. If the target is in the future (a Q4 goal), show pacing ("on track: projected $1.52M"). Few's spec adds a projected segment because distance-to-target alone doesn't tell you whether you're on pace. In a bullet graph the featured bar is about 1/3 of the container's thickness, and the target is a short perpendicular line.
- **Clickable cards** drill down to the filtered detail view. Use one primary link with the stretched-link pattern from `ui-components/card.md`. Don't make the whole card a `<button>` that hides a link.
- **States.** Each card owns its own loading (skeleton of the same size), error ("Couldn't load · Retry") and no-data states. One failed metric must not blank the row (see `data-loading-empty-error-states.md`).
- **Count.** 4–6 cards per row at 1280px or wider, 2 at 768px or wider, 1 below 768px. Keep the total to 3–6. More than 6 KPI cards means the dashboard lacks a point of view.

## Anti-patterns (don't)
- **Bare numbers:** "1,234" with no period, no comparison and no unit.
- **"Vanity row":** 8–12 identical cards, all green, all up and to the right. When everything is highlighted, nothing is.
- **Mixed precision across cards:** `$1.2M`, `$845,213.27`, `12.3K`.
- **Decorative icons** (a dollar-bag glyph next to "Revenue"). They take space and carry no data.
- **Different value sizes per card** so the longest one fits.
- **Gradient or coloured tile backgrounds** to signal status. Grafana's "Background Solid" mode turns a wall of panels into a Christmas tree. Status belongs in a small badge or icon plus text.
- **Sparkline with its own unlabeled time window** that disagrees with the delta's window.
- **Counting up the number on every load.** It delays reading the value. See `motion-number-tweening.md` for when tweening is acceptable.

## Good references
- [Maersk Design System: Big number chart](https://designsystem.maersk.com/guidelines/data-visualisation/chart-types/big-number-chart/) — a short title in a smaller font than the value, the same value size on every big-number chart, and four context options: previous period, sparkline, average or previous highs and lows, and target with progress.
- [Stripe Dashboard home (teardown by 925studios)](https://www.925studios.co/blog/stripe-dashboard-design-breakdown) — four metrics (gross volume, net volume, new customers, successful payments), each showing "the current period alongside the previous period in smaller text beneath the primary number". Trends are "monochrome sparklines", and green, red and yellow are kept for status. An empty account shows zeros, flat sparklines and a "Make your first test payment" prompt.
- [Tremor spark charts](https://www.tremor.so/docs/visualizations/spark-charts) — axis-free spark charts. The component default is `h-12 w-28` (48×112px), and the card example uses `h-8 w-20 sm:h-10 sm:w-36` beside ticker, price and delta badge.
- [Grafana stat panel](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/) — graph mode "Area" draws the sparkline behind the value, and "The graph sparkline is automatically hidden if the panel becomes too small." Percent change (off by default) has an Inverted colour mode.
- [Stephen Few, Bullet Graph Design Specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf) — "developed to replace the meters and gauges". Target as a short perpendicular line, at most 5 qualitative ranges and "ideally" 3, in intensities of one hue (40%, 25%, 10% black for three), and the featured bar about 1/3 of the container's thickness.
- [Tufte, "Sparkline theory and practice"](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/) — "a small intense, simple, word-sized graphic with typographic resolution". Oldest and newest points in red, low and high in blue, a grey normal-range band.

## Bad references
- [shadcn/ui dashboard-01 section cards](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx) — a good skeleton (tabular-nums, container query bumps the value to `text-3xl` at 250px or wider). But the sample copy pairs "Total Revenue $1,250.00" with "Visitors for the last 6 months", and its deltas have no period on the badge. Teams ship the placeholder semantics.
- [Tableau, "Why bullet graphs pack more punch than gauge charts"](https://www.tableau.com/blog/bullet-graphs-beat-gauge-charts) and [Stacey Barr, "Why dashboard dials and gauges are useless for KPIs"](https://www.staceybarr.com/?p=2378) — gauges hide the comparison and use arbitrary red zones that imply judgements.
- [Tufte on executive dashboards](https://www.edwardtufte.com/notebook/executive-dashboards/) — Tufte (2003 forum reply) calls the typical display "a low resolution, decorative display method that pretends to show statistical data."

## Accessibility
- Markup: `<article>` or `<section aria-labelledby>` with the label as a heading-level element (`<h3>`). The value is in a `<data value>` element.
- Use one accessible sentence per card (visually hidden): "Net revenue, $1.42 million, up 12.3% versus October, favourable." Hide the arrow glyph and sparkline from the accessibility tree, or give the sparkline `role="img"` with an `aria-label` summarising the trend ("rising steadily over 30 days, high $1.5M on Nov 18").
- Value text at least 3:1 (large text), and label and delta at least 4.5:1.
- If the card is a link, the link's accessible name is the label, not the whole card text.
- Respect text zoom. Don't set fixed `height` on cards; use `min-block-size` (from `visual-design/typography.md`).

## Motion / interaction (if relevant)
- Hover or focus on the sparkline shows a crosshair and tooltip for the nearest point. Keep it optional, since the card must read without it.
- When the period changes, cross-fade the value in 150–200ms. Don't animate digits on every live tick.
- The skeleton keeps the exact card size, so there's no layout shift when data arrives.

## Tokens and values
| Token | Default |
|---|---|
| Card padding | 16px `--space-4` (compact) / 24px `--space-5` (comfortable) |
| Card radius | 8–12px; default 12px `--radius-lg` |
| Card gap (grid) | 16px |
| Card min width | 14rem (224px) |
| Label | 0.875rem / 1.25, weight 500, `--text-muted` |
| Value | 1.875rem (30px) / 1.1, weight 600, `tabular-nums` (`--type-kpi`). Hero KPI: 2rem (`--type-hero`) |
| Delta | 0.875rem, weight 500, `--positive` / `--negative` / `--text-muted` |
| Footer | 0.75rem (`--type-meta`), `--text-muted` |
| Sparkline | 120×28px (min 80×24), stroke 1.5px, end dot r=2.5px |
| Bullet graph | height 8–12px; ranges 40% / 25% / 10% of `--text` (Few's three-range values) |
| Cards per row | 4–6 at 1280px or wider, 2 at 768px or wider, 1 below |

## Implementation sketch
```html
<section class="kpis" aria-label="Key metrics, Nov 1–20 2026">
  <article class="kpi" aria-labelledby="kpi-rev">
    <h3 id="kpi-rev" class="kpi-label">Net revenue</h3>
    <p class="kpi-value"><data value="1423000">$1.42M</data></p>
    <p class="delta" data-tone="positive">
      <span aria-hidden="true">▲ +12.3%</span>
      <span class="basis" aria-hidden="true">vs Oct 1–20</span>
      <span class="sr-only">Up 12.3% versus October 1 to 20, favourable</span>
    </p>
    <svg class="kpi-spark" viewBox="0 0 120 28" role="img"
         aria-label="Daily net revenue, rising over 20 days"><!-- path + end dot --></svg>
    <footer class="kpi-foot"><a href="/revenue?from=2026-11-01">View revenue</a></footer>
  </article>
  <!-- … -->
</section>
```
```css
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--space-4);
}
.kpi {
  container-type: inline-size;
  display: grid;
  grid-template-rows: subgrid;   /* when parent defines rows; else auto */
  grid-row: span 5;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}
.kpi-label { font-size: .875rem; font-weight: 500; color: var(--text-muted); margin: 0; }
.kpi-value { font-size: 1.875rem; line-height: 1.1; font-weight: 600; margin: 0;
             font-variant-numeric: tabular-nums lining-nums; }
.kpi-spark { inline-size: 100%; max-inline-size: 160px; block-size: 28px; }
@container (inline-size < 13rem) { .kpi-spark { display: none; } }  /* Grafana-style auto-hide */
```

## Checklist
- [ ] Each card has a label, a formatted value and at least one context element (delta with basis, target or prior value).
- [ ] All cards share value size, precision rules and the time window, or label any exception.
- [ ] Deltas respect the metric's good direction.
- [ ] There are no more than 6 KPI cards, ordered by importance (top-left first).
- [ ] The sparkline has no axes, uses the same window as the delta, and hides at narrow widths.
- [ ] Per-card loading, error and no-data states keep the card size.
- [ ] One accessible sentence per card. Decorative glyphs are hidden.
- [ ] No gauges, no tile-background status colours, no decorative icons.

## Sources
- https://designsystem.maersk.com/guidelines/data-visualisation/chart-types/big-number-chart/
- https://carbondesignsystem.com/data-visualization/dashboards
- https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/
- https://www.925studios.co/blog/stripe-dashboard-design-breakdown
- https://www.tremor.so/docs/visualizations/spark-charts
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- https://www.edwardtufte.com/notebook/executive-dashboards/
- https://www.saasframe.io/patterns/metrics
- https://www.thedataschool.co.uk/anh-vu/are-you-making-these-13-dashboard-design-mistakes/
- https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-kpi
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx
- https://www.staceybarr.com/?p=2378
- https://www.tableau.com/blog/bullet-graphs-beat-gauge-charts (read via web.archive.org, May 2026 snapshot: gauges "lack context" and "waste space"; not included by default in Tableau)
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-components/card.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/visual-design/typography.md
