# Rubber-banding at edges and limits

> When a drag goes past a limit, keep tracking the pointer but with diminishing resistance (the common approximation is offset = (1 − 1 / (x · 0.55 / d + 1)) · d, where x is the overshoot and d the container size), then spring back with bounce 0 on release. Never hard-stop at the edge and never let the element follow 1:1 past it.

**Category:** Gestures · **Applies to:** sheets dragged above their top detent, carousels at the first and last page, pull-to-refresh, panels with min/max sizes, zoom past its limits, custom scroll areas · **Priority:** should

## When to use / when not
Use wherever a draggable value has a boundary. Native scroll containers already rubber-band on Apple platforms (and use a glow or stretch on Android), so don't add it to them. Use a hard stop only where moving past the limit would be misleading (a slider value that cannot exceed 100%; there, clamp the value but you may still let the thumb stretch a few pixels).

## Rules (do)
- **Keep responding.** WWDC18: rubber-banding tells the user they've hit an edge while the content still tracks the finger, which also tells a frozen interface apart from content at its end.
- **Resistance grows with distance.** Use a curve whose slope starts at about 0.55 and falls toward 0, so the element never travels further than the container size d however far the pointer goes. The widely used approximation, reverse-engineered from iOS 6 and shared by Grant Paul, is b(x) = (1 − 1 / (x · c / d + 1)) · d with c = 0.55. Apple never published it; treat it as a good-feeling default, not a platform constant.
- **Px-capped form (carousels, fixed-travel limits).** When the cap should be a fixed number of pixels rather than the container size, use b(over) = max · over / (over + k), with over = max(0, pull − deadZone). The cap is `max`, the slope at the origin is max / k, and the half-cap point is over = k. Pick k = max / desiredSlope (for example max 64 px and k 150 px gives slope ≈ 0.43). An optional dead zone (for example 12 px, house default) lets small accidental pulls past the edge do nothing before resistance starts.
- **Relation to the 0.55 form.** They are the same hyperbola. Expand (1 − 1/(c·x/d + 1)) · d = d · c·x / (c·x + d) = d · x / (x + d/c): max = d, k = d / c, slope = max / k = c. So c = 0.55 is the px-capped form with max = d and k ≈ 1.82 · d. The constants of either form are empirical, not a platform specification.
- **Feel check.** With d = 960 px: 5 px of overshoot shows about 2.7 px; 960 px shows about 341 px.
- **Alternative curves are fine.** Vaul uses a logarithmic damping (8 · (ln(v + 1) − 2)) for over-drag; Motion's `dragElastic` (0 to 1, default 0.5) scales overshoot linearly. Choose one per product and use it everywhere.
- **Spring back with bounce 0.** Release past the edge returns to the limit with `spring-default` (bounce 0) carrying the release velocity; a bounce here exaggerates the edge.
- **Apply per axis.** Rubber-band x and y independently; a 2D pan can be in bounds on one axis and past the edge on the other.
- **Pull-to-refresh threshold.** Trigger the action at a fixed rubber-banded distance (for example 64–80 px of visible pull), shown by an indicator that fills as you pull; commit on release, not mid-pull.

## Anti-patterns (don't)
- A hard stop at the edge: feels broken, like the app froze.
- 1:1 movement past the edge, then a jump back.
- Bouncing back with a wobbly spring.
- Rubber-banding a value whose overshoot is shown as data (a slider label that briefly reads 104%).
- Custom rubber-banding on top of the browser's own overscroll on a native scroll container (double effect); use `overscroll-behavior` to control the native one instead.

## Good references
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): why rubber-banding (feedback at the edge, telling "end of content" from "frozen").
- [Grant Paul's formula, as reproduced in this gist](https://gist.github.com/originell/6961057): b = (1 − 1/(x·c/d + 1))·d, c = 0.55, with sample values.
- [Vaul helpers](https://github.com/emilkowalski/vaul/blob/main/src/helpers.ts): a logarithmic over-drag damping as an alternative.
- [Motion, `dragElastic` and `dragConstraints`](https://motion.dev/docs/react-drag): elastic overshoot past constraints.
- [MDN, `overscroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior): control native overscroll and scroll chaining.

## Bad references
- Web carousels that stop dead at the first and last slide with no feedback.
- Custom sheets that let the user drag them off the top of the screen 1:1 and then snap back with a jolt.

## Accessibility
- Rubber-banding is user-driven motion, so it stays under reduced motion; shorten the spring back (bounce 0, ≤ 0.2 s).
- Keyboard users reach the same limits with no rubber-band; the limit is communicated by the control's state (disabled "next" button, `aria-valuemax`).

## Motion / interaction (if relevant)
Grabbing the element during the spring-back resumes tracking from its current (rubber-banded) position, with the resistance recalculated from there.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| rubber-band constant c | 0.55 | the common approximation |
| max visual overshoot | < d (the container size) | by construction |
| spring back | `spring-default` (0.3 s, bounce 0) + release velocity | |
| pull-to-refresh trigger | 64–80 px of visible pull | house range |
| px-capped form | max, k = max / slope, dead zone 0–12 px | carousels; house defaults |
| Motion `dragElastic` | 0.2–0.35 | if using Motion's linear elasticity |

## Implementation sketch
```ts
/** Rubber-banded offset for an overshoot x past a limit, in a container of size d. */
export function rubberband(overshoot: number, dimension: number, c = 0.55): number {
  const sign = Math.sign(overshoot);
  const x = Math.abs(overshoot);
  return sign * (1 - 1 / ((x * c) / dimension + 1)) * dimension;
}

/** Apply rubber-banding to a raw value against [min, max]. */
export function rubberbandClamp(value: number, min: number, max: number, dimension: number, c = 0.55): number {
  if (value < min) return min + rubberband(value - min, dimension, c);
  if (value > max) return max + rubberband(value - max, dimension, c);
  return value;
}
```
```css
/* Stop the page from scroll-chaining or rubber-banding behind a custom sheet. */
.sheet-scroll { overscroll-behavior: contain; }
```

```ts
/** Px-capped hyperbola: never exceeds `max`; initial slope = max / k; optional dead zone. */
export function rubberbandCapped(pull: number, max: number, k: number, deadZone = 0): number {
  const over = Math.max(0, Math.abs(pull) - deadZone);
  return Math.sign(pull) * (max * over) / (over + k);
}
```

## Checklist
- [ ] Past a limit, the element still tracks with resistance; no hard stop.
- [ ] Visual overshoot can never exceed the container size.
- [ ] Release springs back with bounce 0 and the release velocity.
- [ ] x and y are banded independently.
- [ ] No custom rubber-band on native scroll containers; `overscroll-behavior` set where needed.
- [ ] Overshoot is never shown as a data value.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://gist.github.com/originell/6961057
- https://github.com/emilkowalski/vaul/blob/main/src/helpers.ts
- https://motion.dev/docs/react-drag
- https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
