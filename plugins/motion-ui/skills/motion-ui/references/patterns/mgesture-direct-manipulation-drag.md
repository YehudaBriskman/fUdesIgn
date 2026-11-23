# Direct manipulation: drag that tracks 1:1

> A dragged element follows the pointer exactly from the first frame, keeping the offset where it was grabbed. Show the press on pointer-down, commit to a direction only after about 10 px of travel, capture the pointer, set `touch-action` for the axis you own, and record a short velocity history so the release can hand off to a spring.

**Category:** Gestures · **Applies to:** draggable cards and list items, sliders and scrubbers, resizable panes, sheets and drawers, swipe actions, carousels, map and canvas panning · **Priority:** must

## When to use / when not
Use whenever something on screen can be grabbed and moved. The rules here cover the *during* phase; the release is in `mgesture-momentum-projection-and-snap.md`, edges in `mgesture-rubber-banding-and-bounds.md`, and sheets in `mgesture-sheets-and-swipe-to-dismiss.md`. The dashboard-ui spring-physics companion is `motion-drag-and-spring-physics.md`. Don't build a custom drag for what native scrolling already does (a horizontally scrolling list with `scroll-snap` is often enough).

## Rules (do)
- **Track 1:1, no easing during the drag.** The element's position = pointer position − grab offset, set every pointer event (or once per frame). Any smoothing or transition during the drag reads as lag. WWDC18: the content must stay under the finger.
- **Keep the grab offset.** Store where inside the element the pointer went down; never snap the element's corner or centre to the pointer.
- **Acknowledge on pointer-down.** Highlight, lift (scale 1.02, shadow up) or change cursor to `grabbing` immediately, before any movement. WWDC18: taps highlight on touch-down and confirm on touch-up.
- **Hysteresis before committing.** Don't start a drag (or lock an axis) until the pointer has moved about 10 px; WWDC18 notes iOS usually waits about 10 points before deciding a swipe. Below the threshold it's still a tap.
- **Lock the axis when it's clear.** After the threshold, compare |dx| and |dy|; a horizontal swipe on a vertical list locks to x and leaves y to the page scroll.
- **Own the gesture properly.**
  - `setPointerCapture(e.pointerId)` on pointer-down, so the drag continues outside the element.
  - `touch-action: pan-y` on a horizontally swipeable row (the browser keeps vertical scrolling), `none` only on a full 2D canvas.
  - Prevent text selection during the drag (`user-select: none` on the dragged element).
- **Velocity history.** Keep the last ~100 ms of `{ x, y, t }` samples; velocity at release = displacement / time over that window, in px/s. A single last-two-events delta is noisy.
- **Cancel by dragging back.** A drag that returns to (near) its start is a cancel, not a commit. Commit actions on release, not mid-drag, unless they are cheap and reversible (Rauno: light actions may fire once a threshold is crossed mid-gesture; destructive ones wait for release).
- **Run competing gestures in parallel.** WWDC18: recognise tap, drag and long-press at the same time and cancel the losers as soon as intent is clear, rather than delaying with timers. A possible double-tap delays single taps by about 0.5 s on iOS, so only add double-tap where it's worth that.
- **Pointer, touch and keyboard.** Use Pointer Events (one code path for mouse, pen and touch). Every drag has a keyboard or button alternative (WCAG 2.5.7 Dragging Movements, AA).

## Anti-patterns (don't)
- `transition: transform 200ms` left on during the drag: the element trails the finger.
- Snapping the element's centre to the pointer on pointer-down (a visible jump).
- Starting the drag on the first pixel, so every slightly shaky tap becomes a drag.
- `touch-action: none` on a whole list, which kills page scrolling on touch.
- Velocity from the last two events only (spikes on 120 Hz displays and coalesced events).
- Drag as the only way to reorder, move or resize.

## Good references
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): content under the finger, highlight on touch-down, about 10 points before a swipe, parallel gesture recognition, the double-tap delay.
- [Rauno Freiberg, Invisible details of interaction design](https://rauno.me/craft/interaction-design): responsive gestures, light actions mid-gesture, destructive ones on release.
- [MDN, Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) and [`setPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture).
- [MDN, `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action): which axes the browser keeps.
- [Motion, drag gestures](https://motion.dev/docs/react-drag): `drag="x"`, `dragDirectionLock`, `dragConstraints`, `dragElastic` and release momentum.
- [nathangitter/fluid-interfaces](https://github.com/nathangitter/fluid-interfaces): community re-implementation of the WWDC18 demos in UIKit, useful to feel the behaviour.

## Bad references
- HTML5 native drag and drop (`draggable="true"`) for reordering UI: a ghost image, no 1:1 tracking, poor touch support, no velocity. Fine for files, poor for UI.
- Carousels that move one slide per swipe regardless of how far or fast the finger travelled, after a fixed 300 ms tween.

## Accessibility
- Provide non-drag alternatives (buttons, menu items, arrow keys) for every drag action (WCAG 2.5.7, AA).
- Targets at least 24 × 24 CSS px (WCAG 2.5.8), 44 px on touch.
- Announce the result of a keyboard move ("Moved to position 3 of 8") in a live region.

## Motion / interaction (if relevant)
During the drag, no animation at all on the dragged property. Siblings that make room (reorder) may animate with `spring-fast`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| drag threshold | 10 px | before committing to a drag or axis |
| velocity window | 100 ms | samples used at release |
| lift on grab | scale 1.02 + raised shadow | pointer-down feedback |
| double-tap delay | ≈ 500 ms | only where double-tap exists |
| target size | ≥ 24 px (44 px touch) | handles |

## Implementation sketch
```css
.draggable { touch-action: pan-y; user-select: none; cursor: grab; }
.draggable[data-dragging] { cursor: grabbing; transition: none; scale: 1.02; box-shadow: var(--shadow-raised, 0 8px 24px rgb(0 0 0 / 0.16)); }
```
```ts
export interface Sample { x: number; y: number; t: number }

export class VelocityTracker {
  private samples: Sample[] = [];
  constructor(private windowMs = 100) {}
  add(x: number, y: number, t: number): void {
    this.samples.push({ x, y, t });
    while (this.samples.length > 2 && t - this.samples[0].t > this.windowMs) this.samples.shift();
  }
  /** px per second */
  velocity(): { vx: number; vy: number } {
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    if (!first || !last || last.t === first.t) return { vx: 0, vy: 0 };
    const dt = (last.t - first.t) / 1000;
    return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt };
  }
}

export function makeDraggableX(el: HTMLElement, onRelease: (x: number, vx: number) => void): () => void {
  const THRESHOLD = 10;
  let startX = 0, startY = 0, grabOffset = 0, x = 0, active = false, decided = false;
  const tracker = new VelocityTracker();

  const down = (e: PointerEvent) => {
    startX = e.clientX; startY = e.clientY; grabOffset = e.clientX - x;
    active = true; decided = false;
    el.setPointerCapture(e.pointerId);
    el.dataset.pressed = '';
  };
  const move = (e: PointerEvent) => {
    if (!active) return;
    if (!decided) {
      const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
      if (Math.max(dx, dy) < THRESHOLD) return;
      decided = true;
      if (dy > dx) { active = false; el.releasePointerCapture(e.pointerId); return; } // vertical: let the page scroll
      el.dataset.dragging = '';
    }
    x = e.clientX - grabOffset;
    tracker.add(e.clientX, e.clientY, e.timeStamp);
    el.style.translate = `${x}px 0`;
  };
  const up = () => {
    delete el.dataset.pressed;
    if (!active || !decided) { active = false; return; }
    active = false;
    delete el.dataset.dragging;
    onRelease(x, tracker.velocity().vx);
  };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
}
```

## Checklist
- [ ] The element stays exactly under the pointer, grab offset preserved, no transition during the drag.
- [ ] Press feedback on pointer-down; drag starts after ~10 px.
- [ ] Pointer captured; `touch-action` leaves the other axis to the page.
- [ ] Release velocity comes from a ~100 ms window, in px/s.
- [ ] Destructive commits wait for release; dragging back cancels.
- [ ] A keyboard or button alternative exists for every drag.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://rauno.me/craft/interaction-design
- https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
- https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- https://motion.dev/docs/react-drag
- https://github.com/nathangitter/fluid-interfaces
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
