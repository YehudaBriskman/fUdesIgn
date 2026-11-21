# Number tweening and counters

> Tween a number only when its value changed for a reason the user cares about, and only the digits that changed. Finish within 400 ms (`--motion-dur-long`; never more than 600 ms), keep the width stable with tabular figures, and announce only the final value to assistive technology.

**Category:** Motion · **Applies to:** KPI tiles, stat cards, totals in tables, live counters, price tickers, valuation outputs that react to inputs · **Priority:** should

## When to use / when not
Related: KPI tile layout in `data-kpi-stat-card.md`; delta chip design in `data-delta-trend-indicators.md`; number formats in `data-number-formatting.md`.

Use:
- A live value updates in place (refresh, websocket tick, what-if input changed). A short roll shows the direction and rough size of the change.
- A value changes in response to the user's own action (slider, toggle, scenario switch). Motion links cause to effect.

Do not use:
- On first paint as decoration, counting from 0 to the value. It shows false intermediate values, delays reading, and replays on every navigation.
- On filter changes or navigation where the new number is a different quantity, not an update of the same one. The roll implies continuity that doesn't exist.
- For high-frequency streams (more than about 2 updates per second; house threshold). The digits never settle and can't be read. Throttle the display, or show the value statically with a small delta indicator.
- For precision-critical values the user may copy mid-animation (account balances, order quantities). Show the final value at once and animate a separate delta chip instead.

## Rules (do)
- **Duration:** `--motion-dur-long` 400 ms per update; `--motion-dur-medium` 240 ms for values that refresh often. Never more than 600 ms, even for large jumps, and do not scale duration with magnitude. Art of Styleframe's demo count-up ran 600 ms and its author would cut it "to 300 or 400 ms for dashboards people open daily"; NN/g's ceiling is 500 ms.
- **Easing:** `--motion-ease-enter` (decelerate) or a critically damped spring, never linear. The value should approach its final digits slowly so they become readable early.
- **Animate per digit, not per value.** Rolling digit columns (NumberFlow style) move only the digits that changed. A JS tween re-renders the text up to 60 times a second.
- **Direction encodes trend:** roll up for increases and down for decreases (NumberFlow `trend` defaults to `Math.sign(new - old)`).
- **Stable width:** `font-variant-numeric: tabular-nums`. Reserve width for the longest expected value, or animate the width change with transforms. Adjacent layout must not shift.
- **Format at every frame with `Intl.NumberFormat`.** Locale separators, currency and compact notation must stay correct during the tween. Never interpolate the formatted string.
- **The correct final value lands exactly.** No floating-point remainders (1,234.0000001). Round to display precision.
- **Interrupt and retarget:** if a new value arrives mid-tween, continue from the current displayed value to the new target. Don't restart from the old target.
- **Pair with a delta chip** (for example ▲ +2.4%) that appears statically or with a 150 ms (`--motion-dur-short`) fade. The chip carries the meaning; the roll is a hint.
- **Only animate changed tiles** on refresh. Unchanged values must stay perfectly still, so motion means "this changed".

## Anti-patterns (don't)
- Count-up from zero on load for every KPI (the default in many template kits).
- Replaying the count on hover or on scroll-into-view.
- Proportional-width digits that make the tile jitter horizontally during the tween.
- `aria-live` on the animating element, which floods screen readers with every intermediate value.
- Tweening a value that crosses a sign or unit boundary (−3 → +5, or 999 K → 1.0 M) without handling the format change. The intermediate frames show nonsense like "1,000 K".
- A spring with overshoot on a money value: the overshoot briefly shows a wrong amount.

## Good references
- [NumberFlow](https://number-flow.barvian.me/): per-digit rolling via a custom element; `Intl.NumberFormat` options passed straight through; `trend` defaults to `Math.sign(value - oldValue)`; `respectMotionPreference` defaults to true; `NumberFlowGroup` syncs related numbers; `isolate` stops layout coupling. Its docs don't state default timings, so set `transformTiming`/`spinTiming` to the tokens yourself. Documented limits: scientific and engineering notation unsupported; non-Latin digits and RTL locales "aren't currently supported". Know these before adopting it in a multilingual finance product.
- [Art of Styleframe, Animated stats cards](https://artofstyleframe.com/blog/animated-stats-cards-ui-dashboard/): a self-critical write-up. "Animate a stats card once, on first load, for under a second, and animate only what changed on refresh"; 300–400 ms for daily-use dashboards; operator dashboards "shouldn't animate entrances at all"; a filter change restarts nothing; `aria-hidden` on the animating digits with the final value sent once to a separate `role="status"` element.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): `font-variant-numeric: tabular-nums` for comparisons, and "display currency with either 0 or 2 decimal places, never mix both".

## Bad references
- [Tabler CountUp plugin](https://docs.tabler.io/ui/plugins/countup) and the many "animated counter up" components on [Framer marketplace](https://www.framer.com/marketplace/components/animated-counter-up/). Their default is a decorative count from 0 on view. Fine on a marketing page; wrong in a working dashboard, where the reader needs the number now and each replay looks like a data change.
- Linear-eased JS counters (`setInterval` += step). Mechanical motion, main-thread work every frame, and float drift in the final value.

## Accessibility
- The animating node gets `aria-hidden="true"`. A visually hidden sibling holds the final formatted value. If the change matters, a polite live region announces it once after the tween ends ("Revenue updated: $1.24 M, up 2.4%").
- Under `prefers-reduced-motion: reduce`, swap the value instantly. A 150 ms (`--motion-dur-short`) opacity cross-fade is acceptable.
- Never rely on roll direction alone to convey up or down. The delta chip needs a sign and text, not only colour (see `color-semantic-status.md`).
- Live tickers that update continuously for more than 5 s need a pause control (WCAG 2.2.2).

## Motion / interaction (if relevant)
- Use the roll as the "settled" signal for what-if recompute *after release*: the number rolls within 400 ms, then rests. While the user drags, update the number directly with no tween (see `motion-what-if-live-recompute.md`).
- When many tiles update together, keep the same duration so they settle at the same moment (common fate). Don't stagger numbers.

## Tokens and values
| Token | Value |
|---|---|
| tween duration | `--motion-dur-long` 400 ms (240 ms for frequent refreshes) |
| max duration | 600 ms |
| easing | `--motion-ease-enter` `cubic-bezier(0, 0, 0.38, 0.9)`, or spring bounce 0 |
| max update rate shown | 2 per second (throttle; house value) |
| delta chip fade | `--motion-dur-short` 150 ms |
| numerals | `font-variant-numeric: tabular-nums lining-nums` |
| reduced motion | 0 ms swap (or 150 ms fade) |

The 1 s maximum and 120 ms chip fade in earlier versions were replaced by the shared tokens.

## Implementation sketch
```ts
// Minimal, dependency-free tween with retargeting, Intl formatting and a11y.
// easeOut below is a cubic ease-out, a close JS stand-in for --motion-ease-enter.
type TweenOpts = { durationMs?: number; format: Intl.NumberFormat };

export function createTweenedNumber(el: HTMLElement, live: HTMLElement, opts: TweenOpts) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let raf = 0;
  el.setAttribute('aria-hidden', 'true');

  return function setValue(target: number): void {
    cancelAnimationFrame(raf);
    const from = current; // retarget from what's on screen now
    const duration = reduce.matches ? 0 : opts.durationMs ?? 400;
    const start = performance.now();
    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

    const tick = (now: number): void => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      current = from + (target - from) * easeOut(t);
      el.textContent = opts.format.format(t === 1 ? target : current);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        current = target;
        live.textContent = opts.format.format(target); // announce once
      }
    };
    raf = requestAnimationFrame(tick);
  };
}
```
```html
<p class="kpi">
  <span class="kpi-value" id="rev"></span>
  <span class="visually-hidden" role="status" id="rev-live"></span>
  <span class="delta" data-trend="up">▲ 2.4%</span>
</p>
<style>
  .kpi-value { font-variant-numeric: tabular-nums lining-nums; min-inline-size: 8ch; display: inline-block; }
</style>
```

## Checklist
- [ ] No count-up from zero on first paint or navigation.
- [ ] Only values that actually changed animate on refresh.
- [ ] Tabular numerals; no horizontal layout shift during the tween.
- [ ] Every frame formatted through `Intl.NumberFormat`; the final value is exact.
- [ ] Duration 400 ms (240 ms for frequent refreshes), never above 600 ms; ease-out; no overshoot.
- [ ] Mid-tween updates retarget from the displayed value.
- [ ] Animating node is `aria-hidden`; one polite announcement of the final value.
- [ ] Reduced motion means an instant swap.

## Sources
- https://number-flow.barvian.me/
- https://artofstyleframe.com/blog/animated-stats-cards-ui-dashboard/
- https://vercel.com/design/guidelines
- https://docs.tabler.io/ui/plugins/countup
- https://www.framer.com/marketplace/components/animated-counter-up/
- https://www.framer.com/community/marketplace/components/stat-reveal/
- https://www.nngroup.com/articles/animation-duration/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
