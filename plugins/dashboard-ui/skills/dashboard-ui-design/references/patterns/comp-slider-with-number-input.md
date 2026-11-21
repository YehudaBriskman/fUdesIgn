# Sliders paired with numeric inputs

> A slider is for approximate, exploratory values in a narrow range. In a data product, always pair it with a typed numeric input bound to the same value, and never let the slider be the only way to enter a precise number.

**Category:** Components and interaction · **Applies to:** what-if and sensitivity controls (growth, discount rate, margin), threshold settings, range filters (market cap, price), opacity and zoom · **Priority:** should

## When to use / when not
- **Use a slider + input** when users explore ("what if growth were ~10% instead of ~6%?") and benefit from seeing a live result while dragging, *and* sometimes need an exact value.
- **Use the input alone** (with stepper buttons) when the value is precise by nature: a share count, a tax rate from a filing, a date.
- **Use a slider alone** only for genuinely approximate, low-stakes settings: chart opacity, row density, the zoom of a minimap.
- **Use a range (two-thumb) slider + two inputs** for min/max filters (market cap $1B–$50B). For skewed distributions, use a *log* or bucketed scale, or users can't hit small values.
- **Don't** use a slider when the range is wide relative to the precision needed. NN/g: a weight slider in 0.1 lb increments is a precision trap. Don't use one for ratings with fine granularity either (NN/g's example: a 6–10 wine rating in tenths).

## Rules (do)
- **One value, two controls.** The slider and the input share a single source of truth.
  - Dragging updates the input live.
  - Typing updates the slider on commit (Enter or blur), or live once the text parses.
  - Invalid typed text never moves the slider.
- **Native `<input type="range">`** with `min`, `max` and `step` set to sensible domain values, e.g. a discount rate of 4–15% in 0.25% steps. Don't build a `<div>` slider. The native element gives keyboard, touch and screen reader support for free.
- **Choose `step` so the track has ≤ ~100 positions.** If the domain needs finer precision, keep the slider coarse and let the input carry the precision (slider 0.5% steps, input accepts 0.01%).
- **Keyboard (native):** Arrow keys move one step. PageUp/PageDown should move ~10% of the range (custom handling, since native support varies). Home/End jump to min/max. Shift+Arrow ×10 is optional.
- **Labels.**
  - The visible label sits *above* the control.
  - Show the current value in the paired input, not only in a floating bubble.
  - Show min and max at the track ends.
  - On touch, keep value labels above or beside the thumb, never below where the finger covers them (NN/g).
- **Format the value with its unit** via `aria-valuetext` ("8.25 percent") when the raw number isn't self-explanatory. Use a suffix in the input (`%`, `$B`).
- **Show the default or reference value** as a tick or marker on the track ("Consensus 8.2%"), with a "Reset" link. In valuation tools, users anchor on the base case.
- **Recompute cost.** If one recompute is under 100 ms, update outputs live during the drag. Otherwise throttle (`requestAnimationFrame`, or once per 100–150 ms) and run a final compute on `change`. Never queue a server request per `input` event.
- **Track size.** A track of 4–6px and a thumb of 16–20px inside a ≥40px-tall interactive box. Under `pointer: coarse` the thumb gets a ≥44px hit area. Keep the slider short (160–320px, house default). NN/g cites the steering law: longer, narrower tracks take more time to control accurately.
- **Contrast.** The track meets ≥3:1 against the background, the filled portion is distinct from the unfilled, and the focus ring meets ≥3:1.
- **Range sliders.**
  - Use two native range inputs overlaid, or a well-tested library. Each thumb is labelled "Minimum market cap" and "Maximum market cap".
  - Thumbs can't cross, so clamp the values.
  - The two numeric inputs are the primary precise path.

## Anti-patterns (don't)
- A slider as the only way to enter a precise financial assumption. Users can't land on 7.35% by dragging.
- A value bubble rendered with `::before`/`::after` on slider pseudo-elements. Generated content on `<input>` and its thumb pseudo-elements isn't interoperable; render the value in a real element instead.
- Sliders starting at an arbitrary point that users then hunt from (NN/g). Start at the base or default case and mark it.
- Linear scales for log-distributed data (market caps from $50M to $3T), where 95% of companies crowd the first 2% of the track.
- Firing an expensive query on every `input` event during the drag.
- Removing the native appearance and forgetting a focus style.
- Combining WebKit and Firefox thumb pseudo-elements in one comma-separated selector. The browser drops the whole rule.

## Good references
- [NN/g — Slider design: rules of thumb](https://www.nngroup.com/articles/gui-slider-controls/) — "Sliders work best when the specific value does not matter to the user": narrow ranges, no fine increments or random start values (Weightbot), steps that match the task (Kayak's whole hours), labels above or beside the thumb, and typing when precision matters.
- [Kayak flight filters](https://www.kayak.com) (product, cited by NN/g) — time sliders snap to whole hours, so the slider's precision matches the decision.
- [Desmos](https://www.desmos.com/calculator) (product) — every parameter slider has an editable numeric value and editable min, max and step, so exploration and precision coexist.
- [MDN — `<input type="range">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range) — `min`/`max`/`step`, tick marks via `<datalist>`, and per-engine styling hooks (`::-webkit-slider-*`, `::-moz-range-*`) that must sit in separate rules.

## Bad references
- [NN/g — Slider design](https://www.nngroup.com/articles/gui-slider-controls/) — the Weightbot slider (0.1 lb precision on a long range) is the canonical bad example: users overshoot repeatedly.
- Price-range filters on many e-commerce and screener sites with a linear $0–$10,000 track. Most items sit under $100, so the useful range is a few pixels wide. Use a log scale or the min/max inputs.

## Accessibility
- The native range input exposes the slider role, value, min and max. Add a `<label for>`, and add `aria-valuetext` when a unit or format matters.
- The paired input has its own label ("Discount rate, percent"), or is labelled by the same visible label plus the unit.
- Don't announce live recompute results on every step. Announce the final output politely on `change` ("Implied value per share $182.40").
- The focus indicator is ≥2px with ≥3:1 contrast and an offset, because `appearance: none` removes the native one.
- Respect forced colors: draw the track with borders or system colours, not only gradients.

## Motion / interaction (if relevant)
- Thumb dragging follows the pointer 1:1 with no easing. Output numbers may tween over 300–600 ms when the value is committed, per `motion-number-tweening.md`. Don't tween during the drag, or they lag behind the hand.
- The thumb may scale to 1.1 on `:active` over `--motion-dur-micro` (100 ms). None under reduced motion.

## Tokens and values
| Token | Default |
|---|---|
| Track height | 4–6px, radius 999px |
| Thumb | 16–20px (coarse: 24px visual, ≥44px hit area) |
| Control box height | 40px (`block-size: 2.5rem`) |
| Track length | 160–320px |
| Positions on track | ≤100 (`(max-min)/step`) |
| Input width | 7–9ch, `inputmode="decimal"`, `text-align: end`, `tabular-nums` |
| Gap slider ↔ input | 12px |
| Colours (tokens.css) | track `--border-strong` (≥3:1 vs bg), fill and thumb `--accent`, reference tick `--text-muted` |
| Live recompute budget | <100ms per update, else throttle 100–150ms |

## Implementation sketch
```html
<div class="slider-field">
  <label for="wacc-range" id="wacc-label">Discount rate (WACC)</label>
  <div class="slider-row">
    <span class="bound" aria-hidden="true">4%</span>
    <input type="range" id="wacc-range" min="4" max="15" step="0.25" value="8.25"
           aria-valuetext="8.25 percent" list="wacc-ref">
    <span class="bound" aria-hidden="true">15%</span>
    <input id="wacc-num" inputmode="decimal" value="8.25" aria-labelledby="wacc-label wacc-unit">
    <span id="wacc-unit" class="suffix">%</span>
  </div>
  <datalist id="wacc-ref"><option value="8.2" label="Consensus"></option></datalist>
  <button type="button" class="link-btn">Reset to consensus (8.2%)</button>
</div>
```
```css
input[type="range"] {
  --track: var(--border-strong); --fill: var(--accent);
  --min: 4; --max: 15; --v: 8.25;
  --p: calc((var(--v) - var(--min)) / (var(--max) - var(--min)) * 100%);
  appearance: none; inline-size: clamp(160px, 30vw, 320px); block-size: 2.5rem; background: transparent; margin: 0;
}
input[type="range"]::-webkit-slider-runnable-track {
  block-size: 6px; border-radius: 999px;
  background: linear-gradient(to right, var(--fill) var(--p), var(--track) var(--p));
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; inline-size: 18px; block-size: 18px; border-radius: 50%;
  background: var(--fill); margin-block-start: -6px;
}
input[type="range"]::-moz-range-track { block-size: 6px; border-radius: 999px; background: var(--track); }
input[type="range"]::-moz-range-progress { block-size: 6px; border-radius: 999px; background: var(--fill); }
input[type="range"]::-moz-range-thumb { inline-size: 18px; block-size: 18px; border: 0; border-radius: 50%; background: var(--fill); }
input[type="range"]:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 4px; }
```
```ts
export function bindSliderInput(range: HTMLInputElement, num: HTMLInputElement, onValue: (v: number) => void,
                                format: (v: number) => string = (v) => `${v} percent`): void {
  const min = Number(range.min), max = Number(range.max);
  const apply = (v: number, from: 'range' | 'num'): void => {
    const clamped = Math.min(max, Math.max(min, v));
    range.value = String(clamped);
    range.style.setProperty('--v', String(clamped));
    range.setAttribute('aria-valuetext', format(clamped));
    if (from === 'range') num.value = String(clamped);
    onValue(clamped);
  };
  let frame = 0;
  range.addEventListener('input', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => apply(Number(range.value), 'range'));
  });
  num.addEventListener('change', () => {
    const v = Number(num.value.replace(',', '.').replace('%', ''));
    if (Number.isFinite(v)) apply(v, 'num'); else num.setAttribute('aria-invalid', 'true');
  });
}
```

## Checklist
- [ ] Each precise value has a typed input bound to the slider, with one source of truth.
- [ ] The step gives ≤100 track positions, and the input carries finer precision.
- [ ] The default or reference value is marked on the track, with a Reset action.
- [ ] Skewed ranges use a log or bucketed scale.
- [ ] Live recompute stays within budget or is throttled. Expensive work runs on `change`.
- [ ] The visible label is above, min and max are shown, `aria-valuetext` carries the unit, and the focus ring is ≥3:1.
- [ ] Targets are ≥44px on coarse pointers, and labels aren't hidden under the finger.

## Sources
- https://www.nngroup.com/articles/gui-slider-controls/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
