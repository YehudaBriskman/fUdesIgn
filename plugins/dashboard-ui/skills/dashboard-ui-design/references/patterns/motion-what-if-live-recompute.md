# What-if controls with live recompute

> When users tune model assumptions (growth, discount rate, margin), recompute and repaint the outputs while they drag, within 100 ms per step. If you can't, show the instant input value plus a clearly provisional output, and commit on release. Always show the base case next to the scenario, with the delta, and offer one-click reset.

**Category:** Interaction · **Applies to:** valuation/DCF assumptions, pricing calculators, forecasting, budget scenarios, sensitivity analysis, capacity planning · **Priority:** should

## When to use / when not
Use when the model is deterministic, client-computable (or the server responds in < 100–300 ms), and the user's goal is to *understand sensitivity* ("what if growth is 2 points lower?"). Bret Victor's reactive documents: drag a number, see consequences immediately, "like a spreadsheet without the spreadsheet".

Don't use live recompute when:
- a recompute costs seconds (Monte Carlo, server-side model). Use an explicit **Run** button with progress, and keep the previous result visible (see `prog-stale-while-revalidate.md`);
- the input needs an exact typed value (tax rate 21%). Provide a number field; a slider alone is imprecise;
- changes are destructive or saved to shared state. Scenarios are drafts until saved.

## Rules (do)
- **Latency tiers:**
  - recompute ≤ 16 ms: update every `input` event (each frame);
  - 16–100 ms: throttle to one recompute per animation frame, and yield long loops with `scheduler.yield()` every 50 ms;
  - 100 ms–1 s: show the input instantly, mark outputs "Calculating…" (dim to 0.6), compute on `change` (release) or after a 150–250 ms pause in input;
  - > 1 s: Run button, progress, cancel.
- **Never block the thumb.** The slider and its value label must stay at 60 fps; heavy work goes to a Web Worker (or WASM) with latest-wins messaging.
- **Pair every slider with a number input** bound to the same value, with min/max/step and units. Show the current value next to the thumb or label, with `aria-valuetext` ("8.5 percent").
- **Sensible steps:** percent assumptions step 0.1 or 0.25 pp; currency at a round step; keyboard arrows = 1 step, PageUp/PageDown = 10 steps; Home/End = min/max.
- **Base vs scenario:** show the base value as a tick mark on the slider track and the base output as a ghost (dashed line or outlined bar) behind the live output. Show the delta: "Equity value $41.2 (base $38.9, +5.9%)".
- **Changed-assumption markers:** each modified input gets a dot or "edited" badge and an individual reset. A global "Reset to base" resets all.
- **Output motion:** while dragging, values update instantly (no tween; the drag is the animation). After release, a ≤ 200 ms settle is fine. Chart outputs redraw directly without easing during drag.
- **Guard against nonsense:** clamp to valid domains (WACC > terminal growth), and show an inline reason when a combination is invalid rather than producing NaN or infinite values.
- **Scenario persistence:** encode assumptions in the URL (`?g=0.035&wacc=0.09`) so a scenario can be shared. "Save scenario" names it.
- **Sensitivity at a glance:** alongside sliders, a small static sensitivity table (for example WACC × g grid) gives the overview without dragging. Highlight the current cell.

## Anti-patterns (don't)
- A slider with no numeric display or input, which leaves users guessing the value.
- A recompute on every `input` event that takes 200 ms on the main thread: the thumb stutters, INP turns poor, and users overshoot.
- Spring-eased output numbers that lag behind the drag, so users can't see the causal link.
- Resetting the scenario on navigation, or no way back to base.
- Outputs that update with no indication they changed (no delta and no base reference).
- Sliders with ranges so wide that one pixel jumps 5% (step granularity coarser than the decision granularity).

## Good references
- [Bret Victor, Explorable Explanations](https://worrydream.com/ExplorableExplanations/): reactive documents where readers drag in-text numbers (a park-fee proposition) and consequences update immediately. "A reactive document requires the author to disclose the models behind their argument." The right stance for valuation tools: assumptions are visible and tweakable.
- [Shneiderman, dynamic queries](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf): sliders coupled to display updates in < 100 ms; "rapid, incremental, and reversible actions" encourage exploration and lowered error rates in the cited study.
- modern-web-guidance [slider](skills/modern-web-guidance/guides/forms/slider.md): native `<input type="range">` with min/max/step, visible formatted value plus `aria-valuetext`, track fill via a `--control-value` custom property, thumb-anchored tooltip via anchor positioning.
- modern-web-guidance [break-up-long-tasks](skills/modern-web-guidance/guides/performance/break-up-long-tasks.md): 50 ms deadline loop with `scheduler.yield()` (fallback `setTimeout`) to keep input responsive during heavy compute.
- [web.dev INP](https://web.dev/articles/inp): ≤ 200 ms p75 is good; each slider key press counts as an interaction, so recompute cost shows up directly in INP.

## Bad references
- Spreadsheet-style models embedded as static PDFs/screenshots in valuation reports. Assumptions are hidden, sensitivity is invisible, and the reader can't test the claim. This is exactly what Victor's essay argues against.
- Calculators that recompute only on a "Calculate" button even for trivial arithmetic. The user has to run a loop (change → click → compare from memory) that a live update removes; it breaks Shneiderman's < 100 ms dynamic-query principle for no performance reason.

## Accessibility
- Native range input, a visible `<label>`, `aria-valuetext` with units. Number input as the precise alternative.
- Outputs that change while dragging are **not** live regions (too chatty). After release (`change`), announce one summary politely: "Equity value 41.2 million, up 5.9 percent from base".
- Base marker and delta are text, not only colour.
- Thumb ≥ 24 px target; track focus ring ≥ 3:1.

## Motion / interaction (if relevant)
- Drag: direct, unanimated output updates. Release: optional 150–200 ms settle for chart axes if the domain changed.
- Reset to base: a 250 ms transition of the slider thumb and the outputs, so the user sees what reverted. Instant under reduced motion.

## Tokens and values
| Token | Value |
|---|---|
| live recompute budget | ≤ 16 ms per step (ideal), ≤ 100 ms max |
| debounce when slow | 150–250 ms idle or on `change` |
| provisional output opacity | 0.6 + "Calculating…" |
| step (percent assumptions) | 0.1–0.25 pp |
| base marker | 2 px tick, `--color-text-muted` |
| ghost base series | dashed 1.5 px, 40% opacity |
| delta format | signed, 1 decimal %, tabular nums |
| reset transition | 250 ms standard easing |
| worker message policy | latest-wins (drop stale results by sequence id) |

## Implementation sketch
```html
<div class="assumption">
  <label for="g">Terminal growth</label>
  <input id="g" type="range" min="0" max="5" step="0.1" value="2.5" aria-valuetext="2.5 percent" list="g-base">
  <datalist id="g-base"><option value="2.5" label="Base"></option></datalist>
  <input type="number" min="0" max="5" step="0.1" value="2.5" aria-label="Terminal growth, percent"> %
  <button type="button" class="reset" hidden>Reset</button>
</div>
<p class="output"><span id="ev">$41.2M</span> <small>base $38.9M · <span class="delta">+5.9%</span></small></p>
<p class="visually-hidden" role="status" id="ev-status"></p>
```
```ts
// Latest-wins worker recompute, throttled to one request per frame.
type Assumptions = { g: number; wacc: number };
type Result = { seq: number; equityValue: number };

const worker = new Worker(new URL('./dcf.worker.ts', import.meta.url), { type: 'module' });
let seq = 0;
let latestShown = 0;
let pending: Assumptions | null = null;

worker.onmessage = (e: MessageEvent<Result>): void => {
  if (e.data.seq < latestShown) return;               // drop stale results
  latestShown = e.data.seq;
  render(e.data.equityValue);
};

export function onInput(a: Assumptions): void {
  if (pending === null) {
    requestAnimationFrame(() => {
      if (pending) worker.postMessage({ seq: ++seq, ...pending });
      pending = null;
    });
  }
  pending = a;
}

export function onCommit(summary: string): void {
  const status = document.getElementById('ev-status');
  if (status) status.textContent = summary;            // one announcement on release
}
declare function render(v: number): void;
```

## Checklist
- [ ] Output updates within 100 ms of input while dragging (or is clearly provisional and commits on release).
- [ ] Slider thumb never stutters; heavy compute runs off the main thread or yields every 50 ms.
- [ ] Every slider has a bound number input, units and `aria-valuetext`.
- [ ] Base value is marked on the track; outputs show base and delta.
- [ ] Per-input and global reset to base.
- [ ] Invalid combinations are explained inline; no NaN or Infinity.
- [ ] Scenario state is in the URL and can be saved.

## Sources
- https://worrydream.com/ExplorableExplanations/
- https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf
- https://web.dev/articles/inp
- https://web.dev/articles/rail
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/applying-filters/
- modern-web-guidance: skills/modern-web-guidance/guides/forms/slider.md
- modern-web-guidance: skills/modern-web-guidance/guides/performance/break-up-long-tasks.md
- modern-web-guidance: skills/modern-web-guidance/guides/performance/schedule-tasks-by-priority.md
- modern-web-guidance: skills/modern-web-guidance/guides/performance/efficient-background-processing.md
