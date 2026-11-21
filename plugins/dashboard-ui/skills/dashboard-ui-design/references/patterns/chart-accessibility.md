# Chart accessibility: text alternative, table view, decals, keyboard

> Every chart ships with four layers: a title that states the takeaway, a short text summary, a real data table one click away, and non-colour encodings (labels, shapes, decals); interactive charts add keyboard navigation that never fights the screen reader.

**Category:** Charts and data visualisation · **Applies to:** every chart, sparkline, KPI visual and map · **Priority:** must

## When to use / when not
- Always. A chart without a text alternative fails WCAG 1.1.1 (Non-text Content, Level A); modern-web-guidance accessibility.md: "Provide semantic data tables as accessible alternatives for charts and other complex visualizations."
- Decorative micro-visuals that repeat adjacent text (a sparkline next to "+4.1% over 30 days") are `aria-hidden="true"`; that is the only exception.

## Rules (do)
**1. Title, summary, caption (Chartability: "No title, summary, or caption" is a critical failure)**
- Title states the takeaway in plain language; subtitle gives measure, unit, period, source.
- Short description (alt/aria-label): chart type + subject + period, ≤ ~150 characters. "Line chart of monthly active users, Oct 2024 to Apr 2025."
- Long description (visible, preferred): 1 to 3 sentences with the key numbers, trend, extremes and any gaps. W3C WAI complex images: a two-part alternative, short + long, where the long one carries "scales, values, relationships, and trends". Prefer visible text: Highcharts advises against visually hidden descriptions because visible text also helps cognitive accessibility.
- Reading level grade 9 or lower (Chartability).
- Markup: `<figure>` + `<figcaption>`; the SVG gets `role="img"` and `aria-labelledby` (title) / `aria-describedby` (summary) (modern-web-guidance accessibility.md, Inline SVGs; W3C WAI). For `aria-describedby`, the target is read as one paragraph, so keep headings and tables out of it (W3C WAI).

**2. Table view (Chartability "No table")**
- A real `<table>` with `<caption>`, `<th scope>`, units in headers, the same numbers and precision the chart uses (or more).
- Expose it with a visible toggle (`Chart | Table` segmented control) or a `<details>` "Show data table". Not visually hidden by default; sighted keyboard and low-vision users need it too.
- Include download as CSV next to it (Our World in Data and Highcharts export-data module do this).
- Large series: table paginates or summarises (monthly instead of daily) and links to full data.

**3. Not colour alone (WCAG 1.4.1)**
- Every colour-coded series also differs by one of: direct label, marker shape, dash pattern, or texture/decal. ECharts `aria.decal.show: true` and Highcharts pattern fills exist for this.
- Contrast: marks (lines, bars, slices, points) ≥ 3:1 against background (WCAG 1.4.11); adjacent fills that must be told apart ≥ 3:1 to each other or separated by a 1 to 2 px gap in the surface colour; text ≥ 4.5:1 (Chartability; modern-web-guidance visual-design/color.md).
- No text smaller than 12 px (Chartability "Small text size": 9 pt / 12 px).
- Test with a colour-blindness simulator (Coblis, Chrome DevTools vision deficiencies) and greyscale (Fossheim).
- Forced colours (Windows High Contrast): map series to `CanvasText`, `Highlight`, `LinkText`, `GrayText` and use dashes/markers to separate them; don't rely on `box-shadow` or background images for marks (modern-web-guidance color.md). Highcharts ships built-in high-contrast support; copy the behaviour.

**4. Keyboard and screen reader (interactive charts)**
- One Tab stop into the chart (Chartability "Controls override AT controls": custom keys only while the chart has focus); arrows move between points; Up/Down switch series; Home/End first/last; Escape leaves. Highcharts: Tab between chart elements, arrows within; series exposed as regions.
- Each point announces "Series, x, y (with units)", optionally "n of N".
- Interactive affordances explained in text (Chartability "No interaction cues or instructions"): a one-line hint near the chart or in `aria-describedby`.
- Every pointer interaction (hover, brush, click-to-filter) has a keyboard and touch equivalent (Chartability "Interaction modality only has one input type").
- Library switches: Recharts/shadcn `accessibilityLayer`, Highcharts accessibility module, ECharts `aria.show` (+ `AriaComponent` import in v5). Turn them on; they are off or warn by default.
- Canvas charts: canvas content is not in the accessibility tree. Provide the DOM table/summary, or use HTML-in-canvas (`<canvas content="drawable">`) where supported (modern-web-guidance visual-design/expose-canvas-content-to-browser-features.md).

**5. Motion, zoom, user styles**
- No flashing; respect `prefers-reduced-motion` (modern-web-guidance ui-behaviors/motion.md). Chart must be understandable without animation (Fossheim).
- Charts reflow to 320 CSS px and survive 200% text zoom: labels wrap or abbreviate, legends stack, nothing clips. Use `rem` for chart text so OS text scale applies (modern-web-guidance accessibility/respect-os-text-scale.md).
- Don't override user style sheets (Chartability "User style change not respected").

## Anti-patterns (don't)
- `<canvas>` with no fallback content; SVG with no `role`/name (Highcharts without the module exposes only the title and warns in the console).
- Alt text "chart" or "graph"; alt text listing 365 values.
- Table hidden with `display:none` behind a "screen readers only" toggle that sighted keyboard users cannot reach.
- Red/green-only status encoding; legends whose swatches are the only link to series.
- Custom key handlers bound on `document` that hijack arrow keys from screen reader browse mode.
- Hover-only values; tooltips as the only text.
- Auto-generated descriptions for 1,000-point series (ECharts warns these get too long; set `aria.description` manually).

## Good references
- [Chartability (Frank Elavsky)](https://chartability.fizz.studio/) and [POUR-CAF heuristics](https://github.com/Chartability/POUR-CAF) — 50 testable heuristics, 14 critical ones (contrast, small text, only visual, no table, single input modality, no instructions, AT override). Use it as the audit script.
- [W3C WAI: complex images](https://www.w3.org/WAI/tutorials/images/complex/) — short + long description approaches with markup.
- [Highcharts accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) and [feature overview](https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview) — keyboard model, info region, series landmarks, data table, sonification, high-contrast mode, pattern fills.
- [Apache ECharts ARIA](https://echarts.apache.org/handbook/en/best-practices/aria/) — auto description, decal patterns as a second channel.
- [shadcn/ui charts `accessibilityLayer`](https://ui.shadcn.com/docs/components/chart) — one prop adds keyboard and screen reader support.
- [Sarah Fossheim: accessible dataviz design](https://fossheim.io/writing/posts/accessible-dataviz-design/) — patterns, direct labels, don't hide data behind hovers; cites Apple Health labelled bars.

## Bad references
- [Highcharts without the accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) — chart reduced to an image whose only name is its title; the docs themselves describe this as the failure state.
- Canvas-only dashboard tiles (many BI embeds) with no DOM table: invisible to screen readers, find-in-page and translation.

## Accessibility
This whole pattern is the accessibility rule set. Minimum bar for "done": WCAG 2.2 AA (1.1.1, 1.4.1, 1.4.3, 1.4.11, 1.4.13, 2.1.1, 2.4.7, 2.4.11, 2.5.8) plus the 14 Chartability critical heuristics.

## Motion / interaction (if relevant)
- Sonification (Highcharts audio charts, Apple Audio Graphs) is a strong enhancement for trend charts; offer it as a button, never autoplay.
- Chart/Table toggle keeps the same scroll position and focus on the toggle after switching.

## Tokens and values
| Token | Default |
|---|---|
| Min chart text | 12 px (0.75 rem) |
| Text contrast | ≥ 4.5:1 |
| Mark contrast vs surface | ≥ 3:1 |
| Adjacent-fill separator | 1–2 px surface-colour stroke |
| Focus ring | 2 px, ≥ 3:1, 2 px offset |
| Target size (legend, toggles) | ≥ 24 × 24 px |
| Short description length | ≤ 150 chars |
| Long description | 1–3 sentences, grade ≤ 9 |
| Decal set | dots, diagonal, cross-hatch, horizontal, vertical |

## Implementation sketch
```html
<figure class="chart" aria-labelledby="c1-title">
  <figcaption>
    <h3 id="c1-title">Revenue grew 18% year over year</h3>
    <p id="c1-sum" class="chart-summary">Quarterly revenue, Q1 2024 to Q2 2025, USD. Rose from $3.1M to $3.7M; dip in Q4 2024 ($3.0M).</p>
  </figcaption>

  <div class="view-switch" role="group" aria-label="View">
    <button type="button" aria-pressed="true"  data-view="chart">Chart</button>
    <button type="button" aria-pressed="false" data-view="table">Table</button>
  </div>

  <svg class="chart-svg" viewBox="0 0 640 260" role="img" aria-labelledby="c1-title" aria-describedby="c1-sum">
    <!-- marks; series differ by colour AND dash/marker -->
  </svg>

  <div class="chart-table" hidden>
    <table>
      <caption>Quarterly revenue (USD millions)</caption>
      <thead><tr><th scope="col">Quarter</th><th scope="col">Revenue</th><th scope="col">Change vs prior year</th></tr></thead>
      <tbody>
        <tr><th scope="row">Q1 2024</th><td>3.1</td><td>+9%</td></tr>
        <tr><th scope="row">Q2 2025</th><td>3.7</td><td>+18%</td></tr>
      </tbody>
    </table>
    <a href="revenue.csv" download>Download CSV</a>
  </div>
</figure>
```
```ts
// View toggle: chart <-> table, keeps focus on the pressed button.
for (const fig of document.querySelectorAll<HTMLElement>("figure.chart")) {
  const buttons = fig.querySelectorAll<HTMLButtonElement>(".view-switch button");
  const svg = fig.querySelector<SVGSVGElement>(".chart-svg");
  const table = fig.querySelector<HTMLElement>(".chart-table");
  if (!svg || !table) continue;
  for (const btn of buttons) {
    btn.addEventListener("click", () => {
      const showTable = btn.dataset.view === "table";
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      table.hidden = !showTable;
      svg.style.display = showTable ? "none" : "";
    });
  }
}
```
```css
.chart-svg text { font-size: max(0.75rem, 12px); }
.series-2 { stroke-dasharray: 6 3; }   /* second channel besides colour */
.series-3 { stroke-dasharray: 2 3; }
@media (forced-colors: active) {
  .chart-svg .series { stroke: CanvasText; }
  .chart-svg .series.is-active { stroke: Highlight; }
  .chart-svg .bar { fill: Canvas; stroke: CanvasText; }
}
```

## Checklist
- [ ] Title states the takeaway; visible summary has the key numbers and period.
- [ ] SVG/canvas has `role="img"` + name + description, or is `aria-hidden` because adjacent text says it all.
- [ ] A visible Chart/Table toggle (or details) exposes a semantic table with units; CSV download available.
- [ ] No information by colour alone; marks ≥ 3:1, text ≥ 4.5:1, no text < 12 px.
- [ ] Keyboard: one tab stop, arrows through points, Escape out, instructions present; works with touch.
- [ ] Forced-colours and 200% zoom / 320 px reflow checked.
- [ ] Library accessibility mode is enabled (accessibilityLayer / Highcharts module / ECharts aria).
- [ ] Chartability 14 critical heuristics pass.

## Sources
- https://chartability.fizz.studio/
- https://github.com/Chartability/POUR-CAF
- https://www.w3.org/WAI/tutorials/images/complex/
- https://www.highcharts.com/docs/accessibility/accessibility-module
- https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview
- https://www.highcharts.com/blog/tutorials/accessibility/
- https://echarts.apache.org/handbook/en/best-practices/aria/
- https://ui.shadcn.com/docs/components/chart
- https://fossheim.io/writing/posts/accessible-dataviz-design/
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- https://ourworldindata.org/faqs
- modern-web-guidance: skills/modern-web-guidance/guides/accessibility/accessibility.md (Inline SVGs; Complex images and charts)
- modern-web-guidance: skills/modern-web-guidance/guides/visual-design/color.md
- modern-web-guidance: skills/modern-web-guidance/guides/visual-design/expose-canvas-content-to-browser-features.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/motion.md
- modern-web-guidance: skills/modern-web-guidance/guides/accessibility/respect-os-text-scale.md
