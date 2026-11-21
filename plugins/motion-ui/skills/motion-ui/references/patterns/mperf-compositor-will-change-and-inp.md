# Performance: compositor-only properties, `will-change` and INP

> Animate only `transform` (or `translate`/`scale`/`rotate`) and `opacity` so the compositor can run the animation off the main thread; never animate layout properties per frame; use `will-change` only to fix a measured problem and remove it afterwards; and keep the input that starts an animation inside INP's 200 ms "good" budget, with the first visual response in the next frame.

**Category:** Performance · **Applies to:** every animation and transition, drag handlers, scroll effects, View Transitions, JS animation libraries · **Priority:** must

## When to use / when not
Always. The budget is the same everywhere: a frame at 60 Hz is 16.7 ms (8.3 ms at 120 Hz), and the browser needs part of it. dashboard-ui's `prog-perceived-performance-thresholds.md` covers interaction budgets for data work (100 ms / 1 s / 10 s, INP phases); this file covers the motion side.

## Rules (do)
- **Transform and opacity.** web.dev's animation guide: keep animations to `transform` and `opacity` where possible, because changing them doesn't need layout or paint and can be handled by the compositor. Use the individual properties (`translate`, `scale`, `rotate`; Baseline widely available) so they compose without overwriting each other.
- **Never per-frame layout.** No animating `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size` or `grid-template-*` on anything bigger than a small control. Animate a `scale` and counter-scale, use FLIP (measure first and last, animate the inverse transform), or use Motion's `layout` / a View Transition, which snapshot and transform.
- **Height to `auto`.** `interpolate-size: allow-keywords` and `calc-size()` are Chromium-only (Chrome 129); treat them as enhancement. Otherwise use `grid-template-rows: 0fr → 1fr` for short disclosures (it does run layout, so keep it to small regions) or a transform-based reveal.
- **Paint-heavy properties sparingly.** `box-shadow`, `filter: blur()`, `backdrop-filter`, `clip-path` and gradients repaint. Animate a pseudo-element's `opacity` to fade a shadow in, rather than the shadow itself; Rauno warns against large blur on filters for the same reason.
- **`will-change` as a last resort.** MDN: use it to fix an existing performance problem, not to anticipate one; applying it to many elements (or `body`) wastes memory and can slow the page. Set it from JS just before a known heavy animation (pointer-down on a draggable) and remove it after.
- **Respond in the next frame.** The input handler does the minimum (set a class, start the animation) and defers the rest (`requestAnimationFrame`, `scheduler.yield()` where supported). INP: good ≤ 200 ms, poor > 500 ms, at p75 of page loads (web.dev). The animation's length doesn't count against INP, but a heavy handler before it does.
- **Batch reads and writes.** In drag handlers, read layout (`getBoundingClientRect`) once at pointer-down, then only write transforms during the move; interleaved reads and writes force layout every event (layout thrashing).
- **Prefer CSS and WAAPI** over per-frame JS. CSS transitions/animations and `element.animate()` (Baseline widely available) on transform/opacity can run on the compositor even when the main thread is busy; a `requestAnimationFrame` loop can't. Motion uses WAAPI for these properties where it can.
- **Measure, don't guess.** Chrome DevTools Performance panel (frames, long tasks, layout shifts), the Animations panel (replay, scrub, slow down), Rendering → Paint flashing and Layer borders, and the Long Animation Frames API (Chromium only, frames delayed > 50 ms) in the field.

## Anti-patterns (don't)
- `transition: all` (animates whatever changes, including layout).
- Animating `height` from 0 to a measured pixel value on a large panel.
- `will-change: transform` on every card "for performance".
- Reading `offsetHeight` inside a `pointermove` handler that also writes styles.
- Animating `filter: blur(20px)` or `backdrop-filter` on a full-screen surface.
- JS `scroll` listeners that set styles on every event (use scroll-driven animations or `IntersectionObserver`).
- Starting a heavy data fetch or render synchronously in the click handler before the press feedback paints.

## Good references
- [web.dev, How to create high-performance CSS animations](https://web.dev/articles/animations-guide): transform and opacity, `will-change` only for observed problems.
- [MDN, `will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change): last-resort use, toggle it from script, avoid large subtrees.
- [web.dev, Interaction to Next Paint](https://web.dev/articles/inp): 200 / 500 ms thresholds at p75.
- [Chrome for Developers, Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames): attributing slow frames.
- [Chrome DevTools, Animations panel](https://developer.chrome.com/docs/devtools/css/animations): inspect, replay, slow down and edit animations, including View Transition pseudo-elements.
- [Paul Lewis, FLIP your animations](https://aerotwist.com/blog/flip-your-animations/): measure first/last, animate the inverse transform.
- [Motion, performance](https://motion.dev/docs/performance): which values it can hardware-accelerate via WAAPI.

## Bad references
- Accordion snippets that animate `max-height` from 0 to 1000px: layout every frame, and the timing is wrong because the curve runs over 1000 px rather than the content's real height.
- Landing-page kits that set `will-change: transform, opacity` globally on `*` or on every section.

## Accessibility
- Janky motion is worse than no motion: a stuttering animation is harder to follow and more uncomfortable. If an effect can't hold frame rate on a mid-range phone with 4× CPU throttling, remove it.
- Respect `prefers-reduced-motion`, which also saves work on low-end devices.

## Motion / interaction (if relevant)
Gesture code reads geometry once at pointer-down and writes only transforms while dragging (`mgesture-direct-manipulation-drag.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| frame budget | 16.7 ms at 60 Hz, 8.3 ms at 120 Hz | everything per frame |
| INP good / poor | ≤ 200 ms / > 500 ms, p75 | input that starts motion |
| long animation frame | > 50 ms | LoAF threshold |
| visual response | next frame, ≤ 100 ms | any input |
| animated properties | `transform` family, `opacity` | default allow-list |
| test throttle | 4× CPU slowdown | mid-range phone stand-in |

## Implementation sketch
```css
/* Fade a shadow in by animating a pseudo-element's opacity, not box-shadow. */
.card { position: relative; transition: translate var(--motion-dur-micro) var(--motion-ease-enter); }
.card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.18);
  opacity: 0;
  transition: opacity var(--motion-dur-short) linear;
}
@media (hover: hover) and (pointer: fine) {
  .card:hover { translate: 0 -2px; }
  .card:hover::after { opacity: 1; }
}

/* Short disclosure without measuring height. */
.disclosure { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--motion-dur-short) var(--motion-ease-enter); }
.disclosure[data-open] { grid-template-rows: 1fr; }
.disclosure > * { overflow: hidden; }
```
```ts
/** FLIP: animate a layout change with transforms only. */
export function flip(el: HTMLElement, change: () => void, durationMs = 240): Animation {
  const first = el.getBoundingClientRect();
  change();
  const last = el.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = last.width ? first.width / last.width : 1;
  const sy = last.height ? first.height / last.height : 1;
  return el.animate(
    [
      { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transformOrigin: 'top left', transform: 'none' },
    ],
    { duration: durationMs, easing: 'cubic-bezier(0.2, 0, 0.38, 0.9)' },
  );
}

/** will-change only for the duration of a gesture. */
export function hintDuringGesture(el: HTMLElement): () => void {
  el.style.willChange = 'transform';
  return () => { el.style.willChange = ''; };
}

/** Watch for long animation frames in the field (Chromium only). */
export function observeLongFrames(report: (durationMs: number) => void): void {
  if (!PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) return;
  new PerformanceObserver((list) => list.getEntries().forEach((e) => report(e.duration)))
    .observe({ type: 'long-animation-frame', buffered: true });
}
```

## Checklist
- [ ] Only transform-family properties and opacity animate (exceptions are small and measured).
- [ ] No per-frame layout on large elements; layout changes use FLIP, `layout` or View Transitions.
- [ ] `will-change` is set temporarily around a measured heavy animation, never globally.
- [ ] Input handlers paint feedback in the next frame; INP p75 ≤ 200 ms.
- [ ] No layout reads inside move handlers.
- [ ] Checked in the Performance panel with 4× CPU throttling and with Paint flashing on.

## Sources
- https://web.dev/articles/animations-guide
- https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
- https://web.dev/articles/inp
- https://developer.chrome.com/docs/web-platform/long-animation-frames
- https://developer.chrome.com/docs/devtools/css/animations
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://aerotwist.com/blog/flip-your-animations/
- https://motion.dev/docs/performance
- https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
- https://rauno.me/craft/interaction-design
