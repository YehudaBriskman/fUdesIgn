# Arc paths and mask reveals

> Move an object along an arc only when it travels from one place to another and the user should follow it (add to cart, a drop landing, a chip flying to a counter); reveal content with a `clip-path` or mask only when the shape of the reveal means something; keep menus, sheets and chrome on straight lines and plain fades, and give both a plain opacity fallback under reduced motion.

**Category:** Transitions · **Applies to:** add-to-cart and "fly to target" feedback, drop-and-land after a drag, shared-element transfers, image and card reveals, wipes and colour sweeps · **Priority:** nice

## When to use / when not
Use an arc when an object is carried from A to B and the destination is the point (it says "this went there"). Use a mask when a wipe or iris communicates a change of state or origin (a thumbnail opening from its corner, a before/after slider, a section revealing in the direction of travel).

Don't use either for UI chrome. Menus, popovers, sheets and drawers slide or scale from their trigger on a straight line (`mtrans-spatial-origin-and-continuity.md`); an arc there reads as a game. Both are decoration on frequent actions in a working screen (`mfound-purpose-and-frequency.md`), so spend them on rare, meaningful moments.

## Rules (do)
- **Arc = the transfer only.** The twelve animation principles say natural movement follows arched trajectories and mechanical movement goes straight (Wikipedia summary; craft background, not UI research). Apply that narrowly: the thing that flies gets the arc, everything around it stays linear.
- **Two axes, two easings.** The cheapest arc animates the x and y translate separately with different easings: one axis ease-out, the other ease-in, so the path curves. Both axes share one duration. Use `translate` (independent property) on two nested wrappers, or two keyframe tracks.
- **Or `offset-path`.** `offset-path: path(...)` with an animated `offset-distance` moves an element along a Bezier. Widely available since March 2022, and `offset-rotate` since September 2022 (MDN). Use `offset-rotate: 0deg` when the element should not turn; otherwise it rotates to follow the tangent. Build the path from measured start and end points, then control point(s) off the straight line by about a quarter of the distance (house default).
- **Keep it short and land softly.** 300 to 500 ms for a transfer (house range; see the size bands in `mfound-durations-and-easing.md`). End by fading or shrinking into the target, then give the target one small acknowledgement (a count change, `mtrans-micro-interactions.md`).
- **Reveal with the shape that explains it.** Animate `clip-path` between two shapes with the same function and the same number of points (an `inset()` to an `inset()`, a `circle()` to a `circle()`), starting from the trigger's position for an iris. A wipe follows the direction of travel and mirrors in RTL (use logical inset sides).
- **Mind the cost.** `clip-path` and masks repaint (`mperf-compositor-will-change-and-inp.md`). Keep the area small, avoid animating a mask image, do not stack them on long lists, and measure on a mid-range phone. `clip-path` itself is Widely available since January 2020 (MDN); that is support, not performance.
- **The page is complete without it.** The final state is the normal layout. If the animation is skipped, interrupted or unsupported, content is simply there.
- **Reduced motion.** Replace the arc with a straight, short move or an in-place opacity fade of 150 ms or less, and replace the reveal with a plain opacity fade; never remove the feedback that the action worked.

## Anti-patterns (don't)
- Arcs on dropdowns, sheets, tooltips or page transitions.
- A flying element that overshoots the target and bounces back (bounce stays 0 outside play contexts).
- Animating `top` and `left` for the arc; they lay out on every frame.
- Interpolating `clip-path` between different shape functions or point counts, which jumps instead of tweening.
- Long reveals (over 500 ms) or a reveal that repeats every time a list scrolls into view.
- Using a mask reveal as the only way to see content (screen readers and print do not wait for it).
- Looping arcs or sweeps as ambient decoration.

## Good references
- [Wikipedia, Twelve basic principles of animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation): the arc and straight-mechanical-motion distinction; use as craft vocabulary only.
- [MDN, `offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path): `path()` and `ray()`, Baseline status.
- [MDN, `clip-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path): basic shapes and status.
- [Emil Kowalski, 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): keep UI motion fast and purposeful.

## Bad references
- "Add to cart" demos where an item loops across the screen for 1 s or more on every click: a delay on the most frequent action.
- Scroll-triggered mask reveals on every paragraph of a working screen.

## Accessibility
- Reveals and transfers are visual extras: the new state is announced by text or a live region (`role="status"`: "Added to cart, 3 items"), and focus does not follow the flying element.
- Honour `prefers-reduced-motion: reduce` as described above, in CSS and in any JS animation (`mfound-reduced-motion-vestibular.md`).
- A cleared mask must not leave content unreachable: the revealed region stays in the accessibility tree and tab order throughout.

## Motion / interaction (if relevant)
Transfers are one-shot and not interruptible by design, but a second action during flight starts a second flight rather than cancelling the first. Reveals tied to a trigger reverse from the current progress if the user closes them mid-way.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| arc duration | 300–500 ms | transfer to target (house range) |
| arc control offset | about 25% of the distance off the line | `path()` control point (house default) |
| reveal duration | 200–400 ms | `clip-path` wipe or iris |
| reduced-motion fallback | opacity, at most 150 ms | both |
| `offset-path` support | Widely available since March 2022 | MDN |
| `clip-path` support | Widely available since January 2020 | MDN |

## Implementation sketch
```css
/* Arc by two axes: x eases out, y eases in; same duration. */
@keyframes fly-x { to { translate: var(--dx) 0; } }
@keyframes fly-y { to { translate: 0 var(--dy); } }
.fly { animation: fly-x 400ms cubic-bezier(0.2, 0, 0, 1) forwards; }
.fly > .inner { animation: fly-y 400ms cubic-bezier(0.55, 0, 1, 0.45) forwards; }

/* Or along a path measured at runtime (set --path from JS). */
.fly-path {
  offset-path: var(--path);
  offset-rotate: 0deg;
  animation: along 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes along { from { offset-distance: 0%; } to { offset-distance: 100%; } }

/* Iris reveal from the trigger; same function, same arity. */
.reveal {
  clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
  transition: clip-path 300ms cubic-bezier(0.2, 0, 0, 1);
}
.reveal[data-open] { clip-path: circle(150% at var(--x, 50%) var(--y, 50%)); }

@media (prefers-reduced-motion: reduce) {
  .fly, .fly > .inner, .fly-path { animation: fade 150ms linear forwards; }
  .reveal { clip-path: none; opacity: 0; transition: opacity 150ms linear; }
  .reveal[data-open] { opacity: 1; }
}
@keyframes fade { from { opacity: 0.6; } to { opacity: 1; } }
```
```ts
/** Quadratic arc path from a to b, control point lifted off the line. */
export function arcPath(a: {x: number; y: number}, b: {x: number; y: number}, lift = 0.25): string {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const cx = mx + dy * lift, cy = my - dx * lift; // perpendicular to the chord
  return `path("M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}")`;
}
```

## Checklist
- [ ] The arc is used only for object-to-target transfer, never for chrome.
- [ ] Both axes share one duration; no bounce or overshoot at the target.
- [ ] Only `translate`, `offset-distance` or `clip-path` animate; no `top` or `left`.
- [ ] Reveal shapes use the same function and point count at both ends, logical sides in RTL.
- [ ] Final state is the normal layout; content is complete if the animation is skipped.
- [ ] Reduced motion swaps both for an opacity fade of 150 ms or less.
- [ ] The result is also announced in text; focus is not tied to the animation.

## Sources
- https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
- https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path
- https://developer.mozilla.org/en-US/docs/Web/CSS/offset-rotate
- https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
- https://emilkowal.ski/ui/7-practical-animation-tips
- plugins/motion-ui/skills/motion-ui/references/patterns/mperf-compositor-will-change-and-inp.md
