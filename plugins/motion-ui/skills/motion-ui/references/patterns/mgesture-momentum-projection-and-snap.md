# Momentum, projection and snapping on release

> On release, project where the element would coast to with its release velocity (distance = v · r / (1 − r) / 1000, with r ≈ 0.998 per ms), snap to the target nearest that projected point rather than the current one, and animate there with a spring that starts at the release velocity, so a flick goes further than a slow drag of the same length.

**Category:** Gestures · **Applies to:** sheets with detents, carousels and pagers, picture-in-picture and floating panels that snap to corners, swipe actions, drawers, sliders with steps · **Priority:** must

## When to use / when not
Use when a drag ends somewhere other than where the element must rest: snap points, pages, corners, open/closed states. Don't use when the user is placing something precisely (a slider value, a resize handle); there, the release position is the answer.

## Rules (do)
- **Decide on the projected position, not the current one.** WWDC18's picture-in-picture example sends the window to the corner nearest where it *would* end up after coasting, so a short, fast flick toward a corner goes to that corner.
- **Project with a deceleration rate.** Treat velocity as decaying by a factor r every millisecond: projected distance = (v / 1000) · r / (1 − r), with v in px/s (the formula comes from Apple's sample code and common practice; it is not in the WWDC18 transcript text). Values in common use: r = 0.998 (iOS "normal" scrolling) and 0.99 ("fast"). Apple's documentation names `UIScrollView.DecelerationRate.normal` and `.fast` without numbers; the 0.998 and 0.99 values are documented by React Native's ScrollView (Android uses 0.985 and 0.9). With r = 0.998, a 1000 px/s release projects about 499 px.
- **Use the same idea for any property.** WWDC18 applies projection to scale and rotation too: project, then snap.
- **Hand the velocity to the spring.** The settle animation starts at the release velocity; otherwise the element stops dead at release and then accelerates again. With Motion, pass `velocity` in px/s; APIs that want a *relative* velocity (UIKit's `initialSpringVelocity`) take v / (target − current).
- **Bounce only if the gesture carried momentum.** Settle with `spring-snappy` (bounce 0.15) after a flick and `spring-default` (bounce 0) after a slow drag or a tap. Apple's Now Playing example: 100% damping on tap, 80% (bounce 0.2) for a swipe.
- **Velocity can decide intent too.** A flick past a velocity threshold commits even if the distance is short. Vaul (Emil Kowalski's drawer) closes when release velocity exceeds 0.4 px/ms (400 px/s) or the drawer is dragged past 25% of its height.
- **Snap points are few and clear.** 2–3 detents for a sheet, one per page in a pager, four corners for a floating panel.
- **CSS scroll snap first.** For scroll containers, `scroll-snap-type` gives native momentum and snapping with no JS; reach for this pattern only when the thing isn't a scroll container.

## Anti-patterns (don't)
- Choosing the snap point nearest the *current* position: a quick flick toward "closed" springs back open.
- A fixed-duration tween to the snap point, ignoring release velocity.
- Bounce on every snap, including after a slow, deliberate drag.
- Velocity sign alone deciding open/closed (any tiny backwards wobble at release flips the result).
- Snap points so close that a flick skips past the one the user wanted with no way to stop.

## Good references
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): projection with a deceleration rate; PIP to the corner nearest the projected point; same idea for scale and rotation.
- [React Native ScrollView, `decelerationRate`](https://reactnative.dev/docs/scrollview#decelerationrate): normal 0.998 and fast 0.99 on iOS; 0.985 and 0.9 on Android.
- [Apple, `UIScrollView.DecelerationRate`](https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate-swift.struct): the named rates.
- [Vaul source constants](https://github.com/emilkowalski/vaul/blob/main/src/constants.ts): velocity threshold 0.4 px/ms, close threshold 0.25.
- [Motion, `inertia` and spring `velocity`](https://motion.dev/docs/inertia): decay animations with snap targets via `modifyTarget`.
- [MDN, CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap): native momentum and snapping.

## Bad references
- Web carousels that advance exactly one slide per swipe after a 300–500 ms tween, whatever the swipe speed: the fling has no effect, so the UI feels heavy.
- Bottom sheets that decide open or closed by position alone, so a fast downward flick from near the top bounces back up.

## Accessibility
- Every snap state is reachable without a gesture (buttons, keyboard, `aria-expanded` toggles).
- Under reduced motion, still snap to the projected target, but settle with bounce 0 and a short duration.

## Motion / interaction (if relevant)
If the user grabs the element again while it is settling, the settle stops at its current presentation position and tracking resumes from there (`mgesture-interruptibility-and-velocity.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| deceleration r (normal) | 0.998 per ms | default projection |
| deceleration r (fast) | 0.99 per ms | pagers, short coasts |
| flick commit velocity | 400 px/s (0.4 px/ms, Vaul) | dismiss or advance regardless of distance |
| distance commit | 25% of the element (Vaul close threshold) | slow drags |
| settle after flick | `spring-snappy` (0.3 s, bounce 0.15) | |
| settle after slow drag | `spring-default` (0.3 s, bounce 0) | |

## Implementation sketch
```ts
import { animate } from 'motion';

/** Distance a value coasts with velocity v (px/s) under per-ms decay r. */
export function project(velocity: number, rate = 0.998): number {
  return ((velocity / 1000) * rate) / (1 - rate);
}

export function nearest(targets: readonly number[], value: number): number {
  return targets.reduce((best, t) => (Math.abs(t - value) < Math.abs(best - value) ? t : best), targets[0]);
}

/** UIKit-style relative velocity for APIs that want it. */
export function relativeVelocity(velocity: number, from: number, to: number): number {
  return to === from ? 0 : velocity / (to - from);
}

export function settle(el: HTMLElement, current: number, velocity: number, snapPoints: readonly number[]) {
  const target = nearest(snapPoints, current + project(velocity));
  const flicked = Math.abs(velocity) > 400;
  return animate(el, { x: [current, target] }, {
    type: 'spring',
    velocity,
    visualDuration: 0.25,
    bounce: flicked ? 0.15 : 0,
  });
}
```

## Checklist
- [ ] Release target = snap point nearest current + projection, not nearest current.
- [ ] The settle spring starts at the release velocity.
- [ ] Bounce only after a flick; bounce 0 after a slow drag or tap.
- [ ] A velocity threshold (about 400 px/s) can commit a short flick.
- [ ] Scroll containers use CSS scroll snap instead of custom code.
- [ ] Every snap state is reachable without the gesture.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate-swift.struct
- https://reactnative.dev/docs/scrollview#decelerationrate
- https://github.com/facebook/react-native-website/blob/main/docs/scrollview.md
- https://github.com/emilkowalski/vaul/blob/main/src/constants.ts
- https://motion.dev/docs/inertia
- https://motion.dev/docs/spring
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap
