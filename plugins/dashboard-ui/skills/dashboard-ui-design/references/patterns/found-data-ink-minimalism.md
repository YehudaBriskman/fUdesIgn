# Data-ink minimalism done right (not "empty and vague")

> Remove ink that carries no information, but never remove the context that makes a number meaningful: labels, units, comparisons, targets and time frame.

**Category:** Foundations · **Applies to:** charts, KPI tiles, tables, cards, chrome around widgets · **Priority:** must

## When to use / when not
- **Use** as an editing pass on every widget: for each element ask "what does this tell the user?" Tufte: chartjunk is "non-data-ink or redundant data-ink", typically "over-busy grid lines and excess ticks, redundant representations of the simplest data, the debris of computer plotting".
- **Use** the opposite test too: "what question does the user still have after reading this?" If the answer is "compared to what?", "in what unit?" or "since when?", you've cut too much.
- **Not** an aesthetic of flatness or emptiness. NN/g: minimalist visual design "does not always satisfy" the minimalism heuristic, and "a minimalist design contains all necessary elements to support user tasks."
- **Not** a ban on every embellishment. Few concedes embellishments "can at times... represent information redundantly in useful ways". Bateman et al. (CHI 2010) found embellished charts were recalled better 2–3 weeks later with no loss in accuracy. Dashboards are about monitoring, not recall, so the default remains lean.

## Rules (do)
**Remove (non-data ink):**
- 3D effects, drop shadows on bars, gradients on data marks, background images.
- Heavy gridlines. Keep at most 3–5 light horizontal gridlines (≤ 1px, ~3:1 against the surface for non-text) or none, plus direct labels.
- Chart borders and boxed legends when a direct label fits.
- Redundant encodings: a different color per bar when the axis already names each bar (Few Pitfall #12).
- Precision beyond decision needs. $3.8M rather than $3,848,305.93 on a KPI (Few Pitfall #3). Keep consistent significant figures per column (Ström).
- Widget chrome: per-card menus, maximise and close icons visible at rest. Reveal them on hover or focus.

**Keep or add (data and context ink):**
- **Unit and period on every number:** "$1.28M MRR · Nov 2026", not "1.28".
- **A comparison:** target, previous period or benchmark. Few Pitfall #2 shows a gauge that tells you only "net income is around $3.5 million".
- **Axis labels with numbers at a sensible interval** (Few: the $2M–$5M gauge with unlabeled ticks is unreadable).
- **Data source and freshness** ("Updated 10:42 UTC") as low-contrast meta text.
- **An empty-state explanation** when there is no data: why, and what to do. Not a blank card.
- **Annotations** for spikes, dips and events (Carbon: call out trends, averages, peaks and valleys).
- **Cap visual count:** Sisense suggests ≤ 5–9 visualizations per dashboard. If there are more, split by question (see `found-dashboard-types.md`).

## Anti-patterns (don't)
- **"Empty and vague" dashboards:** four giant numbers without units, period or comparison, in a sea of whitespace. They look calm and inform nothing (NN/g HelloBar example: "extremely minimalist in visual style; however, there is not sufficient information").
- **Hidden essentials:** hiding the date range, units or filter state in a popover to "clean up" the header.
- **Ghost-button and flat-control ambiguity:** users can't tell what's clickable. NN/g: "flat designs often fail to communicate ... which elements are selectable".
- **Low-contrast minimalism:** #999 labels on white (~2.8:1) because gray "looks cleaner".
- **Sparkline without scale or endpoints,** so the user can't tell whether the shape is +1% or +300%. Label the last value at least.
- **Decorative gauges, dials and LED meters** (Few Fig. 14).

## Good references
- [Few, The Chartjunk Debate (2011)](https://www.perceptualedge.com/articles/visual_business_intelligence/the_chartjunk_debate.pdf): quotes Tufte's original definition (*VDQI* p. 107) and dissects the Bateman study. Memorability helps "only to the degree that it conveys the message". A balanced position from a minimalist.
- [Bateman et al., "Useful Junk?" CHI 2010](https://scottbateman.github.io/publication/2010-01-01-Useful-junk-The-effects-of-visual-embellishment-on-comprehension-and-memorability-of-charts): the counter-evidence. Use it to justify a single *meaningful* illustration in a report, not on a monitoring view.
- [NN/g: Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/): maximise signal, minimise noise. The visually dense 16Personalities page still passes because it shows "sufficient information, and only sufficient information".
- [Matthew Ström: Design better data tables](https://mattstromawn.com/writing/tables/): lean tables done right. Right-align numbers, use tabular figures, show the unit once per column, use very light or no rules, and keep tables "monochromatic".
- [Grafana best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/): "Can a viewer tell what each graph represents without effort?" Document panels with descriptions, and turn off stacking that hides data.

## Bad references
- [Few, Common Pitfalls, Fig. 3 (Net Income gauge)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): a large dial with unlabeled major ticks between $2M and $5M, no target and no history. Lots of ink, almost no information.
- [Few, Common Pitfalls, Fig. 10](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): 3D bars, a boxed legend, $0.00-precision axis labels and a different color per region. Every Tufte anti-pattern in one chart.
- [NN/g: Characteristics of Minimalism](https://www.nngroup.com/articles/characteristics-minimalism/): sites that hid the owner's name behind a click ("a big gamble to hide the most important content") and put desktop nav in a hamburger. This is minimalism that removes needed information.

## Accessibility
- Keep text labels in the DOM, not baked into canvas or images, so screen readers and translation work.
- Non-text graphics needed to understand data (axes, the target line) need ≥ 3:1 contrast (WCAG 1.4.11). Decorative gridlines may be lower.
- Units must be readable by assistive tech. Write "$1.28 million" in an `aria-label` or visually hidden text when the visual uses "$1.28M", or use `<abbr title>`.
- Removing a legend requires direct labels, and those labels must not rely on color alone to match series.

## Motion / interaction (if relevant)
- Hover and focus reveal of secondary chrome (card menus, export) is acceptable minimalism, but it must also appear on keyboard focus (`:focus-within`) and be reachable on touch (always visible under `pointer: coarse`).

## Tokens and values
| Element | Default |
|---|---|
| Gridlines | 0–5 horizontal, 1px, `--border-subtle`; no vertical gridlines on time series |
| Axis ticks | none or 4px; labels 12px `--fg-secondary` |
| Bar or area fill | solid; no gradient, no shadow, no 3D |
| KPI precision | 2–3 significant figures + unit suffix (K, M, B) |
| Table precision | consistent decimals per column; currency 2dp only when cents matter |
| Visualizations per view | ≤ 9 (Sisense 5–9) |
| Meta text (source, freshness) | 12px, `--fg-secondary` |
| Empty state | 1-line reason + 1 action, inside the widget's normal footprint |

## Implementation sketch
```html
<article class="kpi" aria-labelledby="arr-l">
  <h3 id="arr-l" class="kpi-label">Annual recurring revenue</h3>
  <p class="kpi-value"><data value="15360000">$15.4M</data><span class="visually-hidden"> (15.36 million dollars)</span></p>
  <p class="kpi-compare">
    <span class="delta" data-dir="up">▲ 6.2%</span> vs Q2 · target $16.0M
  </p>
  <p class="kpi-meta">Stripe billing · updated <time datetime="2026-11-21T10:00Z">10:00 UTC</time></p>
</article>
```
```css
.kpi-card-actions { opacity: 0; }
.kpi:is(:hover, :focus-within) .kpi-card-actions { opacity: 1; }
@media (pointer: coarse) { .kpi-card-actions { opacity: 1; } }
.chart .grid line { stroke: var(--border-subtle); stroke-width: 1; }
```
```ts
function formatCompact(value: number, currency: string, locale = navigator.language): string {
  return new Intl.NumberFormat(locale, {
    style: "currency", currency, notation: "compact", maximumSignificantDigits: 3,
  }).format(value); // 15360000 → "$15.4M"
}
```

## Checklist
- [ ] Every number shows a unit, a period and at least one comparison.
- [ ] No 3D, gradients, shadows or per-bar arbitrary colors on data marks.
- [ ] Gridlines are ≤ 5 and light. Legends are replaced by direct labels where possible.
- [ ] KPI precision is ≤ 3 significant figures, and table columns use consistent decimals.
- [ ] Empty and error states explain why and what to do; no blank cards.
- [ ] Hidden-at-rest controls appear on focus and on touch devices.
- [ ] A "what question remains?" review was done for each widget.

## Sources
- https://www.perceptualedge.com/articles/visual_business_intelligence/the_chartjunk_debate.pdf (quotes Tufte, *The Visual Display of Quantitative Information*, pp. 107, 121)
- https://scottbateman.github.io/publication/2010-01-01-Useful-junk-The-effects-of-visual-embellishment-on-comprehension-and-memorability-of-charts
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.nngroup.com/articles/aesthetic-minimalist-design/
- https://www.nngroup.com/articles/characteristics-minimalism/
- https://mattstromawn.com/writing/tables/
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://www.sisense.com/blog/4-design-principles-creating-better-dashboards/
- https://en.wikipedia.org/wiki/Edward_Tufte
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
