# Scenario comparison: bear, base, bull and weights

> Show scenarios as a small, fixed set (usually 3) on one shared axis, each with its defining assumptions and its probability. Compare them side by side against the base, make the switcher a stateful segmented control in the URL, and show any weighted value as a derived number whose weights sum visibly to 100%.

**Category:** Charts and data visualisation · **Applies to:** valuation scenarios, budget and forecast cases, capacity plans, stress tests, saved what-if snapshots · **Priority:** should (must for valuation products)

## When to use / when not
| Question | Display |
|---|---|
| What is the value under each case, and where is the price? | Scenario range strip: one axis, a dot per scenario, price as a vertical line |
| How do the cases differ in inputs and outputs? | Side-by-side table: rows = inputs then outputs, columns = scenarios, deltas vs base |
| How does each case evolve over time? | Small multiples or one line chart with ≤ 3 lines, direct-labelled |
| How likely is each outcome over a continuous range? | A distribution, not scenarios (see `chart-distributions-uncertainty.md` and `chart-tornado-sensitivity.md`) |
| Which inputs matter most? | Tornado chart (see `chart-tornado-sensitivity.md`) |
- **Don't** use scenarios when there are more than about 5 cases. Beyond that, readers can't hold the definitions in mind; use a distribution or a sensitivity grid.
- **Don't** call something a "bull case" without saying what makes it bullish. Every scenario needs its 2–4 defining assumptions written next to its name.

## Rules (do)
- **Fixed set and order.** Bear, Base, Bull, always in that order (low to high), in every view, legend and table. Saved user scenarios come after, in creation order.
- **Name + definition.** Each scenario card shows: name, value, delta vs base ("−32%"), probability, and the assumptions that differ from base ("Growth 4% (base 9%), margin 24% (base 29%)"). Only the differing inputs, so the reader sees what drives the gap.
- **Probabilities say what they mean.** Morningstar sets bull and bear so each has a 25% chance of being exceeded, which makes them the quartiles of a value distribution. If your cases mean that, say "25th / 50th / 75th percentile". If they're judgement weights, say "Your weights" or "Analyst weights".
- **Weighted value is derived and shown with its parts.** "Weighted value $138 = 25% × $96 + 50% × $142 + 25% × $172". Damodaran's illustration uses 25 / 50 / 25 for three cases, and stresses that the expected value only makes sense if the scenarios cover all outcomes; if they don't, the weights won't sum to 1.
- **Weights UI.**
  - Three number inputs (%) with a live "Total 100%" readout; the total turns to a warning with text ("Total 110%: must be 100%") when it's off.
  - Don't auto-change the other weights when one changes; it alters values the user didn't touch. Offer an explicit "Balance to 100%" action that scales the others proportionally.
  - With exactly 3 scenarios, a two-handle range control on a 0–100 track is an alternative: the segments are bear / base / bull, and dragging a divider trades share between neighbours only. Always pair it with typed inputs.
  - Block compute (keep last value, marked stale) while the total isn't 100%.
- **Switcher.** A segmented control (`radiogroup` or toggle buttons with `aria-pressed`) with the selection in the URL (`?s=bull`). Choosing a scenario changes all views on the page together. Keep the base visible as a ghost or reference line when another scenario is selected (see `comp-tabs-segmented-pills.md`).
- **One axis, one unit.** Plot all scenarios on the same scale as price (see `chart-financial-price-value.md`; where scenarios are bars they start at zero, `chart-bars-baseline-sorting.md`). The range strip's x-axis is value per share; draw price as a solid vertical line and the weighted value as a dashed one.
- **Colour.** Scenarios are ordered categories: use one hue stepped in lightness (light = bear, mid = base, dark = bull) or neutral ink with the base emphasised. Don't use red / green; bear is not an error and bull is not success (see `data-verdict-rating-badges.md`).
- **Comparison table.**
  - Columns: Bear, Base, Bull (and saved ones). Rows: the inputs that differ, then outputs.
  - Show deltas vs base under each non-base value in muted text: "$96 (−32%)".
  - Right-align numbers, tabular figures, one precision per row (see `data-table-layout-and-typography.md`).
  - Highlight cells that differ from base with a subtle background, not a colour per scenario.
- **Saved scenarios.** Name, creation date and the source preset ("Custom from Base, 3 changes"). Limit the comparison to 4 columns at once; more goes in a picker.
- **Snapshots age.** A saved scenario keeps its inputs but recomputes on new data, or is marked "Saved 12 Mar; data has changed since". Say which.

## Anti-patterns (don't)
- Bull in green, bear in red, base in blue: three status colours for one ordered variable.
- A "weighted value" headline with no visible weights.
- Weights that silently re-normalise when one is edited.
- Scenario names with no assumptions ("Optimistic") so the reader can't judge plausibility.
- Different axes or units for each scenario chart, so bars look comparable but aren't.
- Ten scenarios as overlaid lines in rainbow colours.
- Scenario selection held only in component state, so a shared link shows Base.
- Treating best and worst case as the only risk display. Damodaran notes that best/worst analysis can double count risk and says little about likelihood.

## Good references
- [Morningstar equity research definitions (PDF)](https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf) — analysts set at least a bull and bear case around the base, chosen so there's a 25% probability of doing better than bull and 25% of doing worse than bear; the spread drives the uncertainty rating.
- [Microsoft, Switch between sets of values using scenarios](https://support.microsoft.com/en-US/excel/switch-between-various-sets-of-values-by-using-scenarios) — Excel's Scenario Manager stores named sets of up to 32 changing cells and builds a side-by-side summary; naming the cells first makes the report readable.
- [Damodaran, probabilistic approaches (scenario analysis)](https://pages.stern.nyu.edu/~adamodar/pdfiles/valrisk/ch6.pdf) — best / most likely / worst case, values per scenario plus an expected value when probabilities can be estimated, and the caveat that incomplete scenario sets can't be probability-weighted.
- [isee systems, A better chained slider](https://blog.iseesystems.com/stella-ithink/a-better-chained-slider/) — totals shown red/green with text, no silent reapportioning, and an explicit "Distribute" action for weights that must sum to 100%.

## Bad references
- [Microsoft, Scenario summary reports](https://support.microsoft.com/en-au/excel/switch-between-various-sets-of-values-by-using-scenarios) — the summary report is static: it doesn't recalculate when scenario values change, so a stale comparison looks current. A product's comparison must stay live or be dated.
- Brokerage "analyst price target" widgets that show low / average / high targets as a coloured gauge with no definitions of the cases or how many analysts sit behind each.
- Linked-slider widgets where moving one weight drags the other two automatically (common in allocation demos), changing inputs the user never touched.

## Accessibility
- The switcher is a `role="radiogroup"` of radios or buttons with `aria-pressed`; arrow keys move between options.
- The range strip is `role="img"` with a sentence: "Bear $96, base $142, bull $172; price $118; weighted $138." The comparison table carries the same numbers.
- Scenario identity is in text labels next to each mark (direct labels), not only colour.
- The weights total is announced politely when it changes and its error is text, not only red.
- Deltas vs base use a true minus sign (U+2212) and include "vs base" in the accessible text.

## Motion / interaction (if relevant)
- Switching scenario: marks move to new positions in 200–300ms with ease-out; the base ghost stays put (see `motion-chart-transitions.md`). Reduced motion: swap instantly.
- Hover or focus on a scenario in the table highlights its mark in every chart (see `motion-linked-exploration.md`).
- Editing a weight updates the weighted line after a 150–250ms debounce; individual scenario values don't move.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--scenario-bear` | `oklch(0.75 0.06 250)` | Light step |
| `--scenario-base` | `oklch(0.55 0.10 250)` | Mid step, emphasised |
| `--scenario-bull` | `oklch(0.38 0.10 250)` | Dark step |
| Default scenario count | 3 (max 5 in one chart) | Set size |
| Comparison columns | ≤ 4 at once | Table |
| Default weights | 25 / 50 / 25 (only if they're quartiles or stated) | Weighted value |
| Weight input step | 1% (0.1% if needed) | Weights UI |
| Mark size | 10px dot, 2px price line, 1.5px dashed weighted line | Range strip |

## Implementation sketch
```html
<fieldset class="scenario-switch">
  <legend class="sr-only">Scenario</legend>
  <label><input type="radio" name="s" value="bear"> Bear</label>
  <label><input type="radio" name="s" value="base" checked> Base</label>
  <label><input type="radio" name="s" value="bull"> Bull</label>
</fieldset>

<table class="scenarios">
  <caption>Value per share by scenario, vs base</caption>
  <thead><tr><th scope="col">Input or output</th><th scope="col">Bear</th><th scope="col">Base</th><th scope="col">Bull</th></tr></thead>
  <tbody>
    <tr><th scope="row">Revenue growth, yrs 1–5</th><td class="diff">4.0%</td><td>9.0%</td><td class="diff">13.0%</td></tr>
    <tr><th scope="row">Value per share</th>
      <td>$96 <span class="delta">(−32%)</span></td><td>$142</td><td>$172 <span class="delta">(+21%)</span></td></tr>
    <tr><th scope="row">Weight</th><td>25%</td><td>50%</td><td>25%</td></tr>
  </tbody>
</table>
```
```ts
export type ScenarioId = 'bear' | 'base' | 'bull'
export type Weights = Record<ScenarioId, number> // percents

export type WeightCheck =
  | { ok: true; weighted: number }
  | { ok: false; total: number; message: string }

export function weightedValue(values: Record<ScenarioId, number>, w: Weights): WeightCheck {
  const total = w.bear + w.base + w.bull
  if (Math.abs(total - 100) > 0.05) return { ok: false, total, message: `Total ${total}%: must be 100%` }
  return { ok: true, weighted: (values.bear * w.bear + values.base * w.base + values.bull * w.bull) / 100 }
}

// explicit "Balance to 100%": keep the edited weight, scale the others proportionally
export function balance(w: Weights, keep: ScenarioId): Weights {
  const others = (Object.keys(w) as ScenarioId[]).filter((k) => k !== keep)
  const rest = 100 - w[keep]
  const sum = others.reduce((s, k) => s + w[k], 0)
  const next: Weights = { ...w }
  for (const k of others) next[k] = sum === 0 ? rest / others.length : Math.round((w[k] / sum) * rest * 10) / 10
  return next
}

export function readScenario(url: URL): ScenarioId {
  const s = url.searchParams.get('s')
  return s === 'bear' || s === 'bull' ? s : 'base'
}
```
```css
.scenario-switch { display: inline-flex; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 2px; gap: 2px; }
.scenario-switch label { padding: 4px 12px; border-radius: 6px; cursor: pointer; }
.scenario-switch label:has(input:checked) { background: var(--surface-2); font-weight: 600; }
.scenario-switch input { position: absolute; opacity: 0; }
.scenario-switch label:has(input:focus-visible) { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.scenarios td, .scenarios th[scope="col"] { text-align: end; font-variant-numeric: tabular-nums; }
.scenarios td.diff { background: var(--surface-2); }
.scenarios .delta { color: var(--text-muted); font-size: 0.8125rem; }
```

## Checklist
- [ ] Scenarios appear in a fixed order (bear, base, bull) everywhere, with no more than 5 in one chart.
- [ ] Each scenario shows the assumptions that differ from base, its value and its delta vs base.
- [ ] Probabilities state their meaning (percentiles or judgement weights).
- [ ] The weighted value shows its weights and parts; weights visibly total 100% and never auto-rebalance silently.
- [ ] All scenarios share one axis and unit with price.
- [ ] Scenario colours are ordered lightness steps, not red/green; labels are direct.
- [ ] The selected scenario is in the URL and drives every view on the page.
- [ ] Saved scenarios say whether they recompute on new data.

## Sources
- https://advhypo.morningstar.com/Enterprise/VTC/UpdatedEquityResearchDefinitions.pdf
- https://support.microsoft.com/en-US/excel/switch-between-various-sets-of-values-by-using-scenarios
- https://support.microsoft.com/en-au/excel/switch-between-various-sets-of-values-by-using-scenarios (up to 32 changing cells per scenario; summary reports don't recalculate)
- https://pages.stern.nyu.edu/~adamodar/pdfiles/valrisk/ch6.pdf (Table 6.2: growth scenarios weighted 0.25 / 0.50 / 0.25; best/worst analysis "not very informative"; double counting of risk)
- https://pages.stern.nyu.edu/~adamodar/pdfiles/DSV2/Ch3.pdf (later edition of the same chapter)
- https://blog.iseesystems.com/stella-ithink/a-better-chained-slider/
- https://www.w3.org/WAI/ARIA/apg/patterns/radio/
