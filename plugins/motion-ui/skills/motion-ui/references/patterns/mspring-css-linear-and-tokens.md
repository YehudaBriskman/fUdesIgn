# Springs in CSS with `linear()`

> Use generated `linear()` curves to give CSS transitions a spring's shape, with the transition duration set to the spring's settle time (about 1.5 × its perceived duration), and only for motion that has no incoming velocity; anything thrown, dragged or retargeted mid-flight needs a JS spring.

**Category:** Springs · **Applies to:** CSS transitions and keyframes for popovers, sheets settling, toggles, layout shifts, View Transition pseudo-elements · **Priority:** should

## When to use / when not
`linear()` is a piecewise-linear easing function: you list output values (and optional input percentages) and the browser interpolates between them. With enough points it approximates any curve, including a spring's overshoot. It is Baseline widely available (newly available December 2023: Chrome 113, Firefox 112, Safari 17.2; widely available June 2026).

Use it when the animation always starts at rest: a menu opening, a sheet settling after a tap, a toggle thumb, a View Transition group. Don't use it after a drag or fling: CSS can't take an initial velocity, so the element would stop dead at release and then accelerate again. Use a JS spring there (`mgesture-momentum-projection-and-snap.md`).

## Rules (do)
- **Generate, don't hand-write.** Sample the spring's position at 60 or so points over its settle time and drop points that lie on a straight line between their neighbours (tolerance about 0.002). 12–20 points is enough for bounce ≤ 0.3.
- **Duration = settle time, not perceived duration.** A spring "looks" done at its perceived duration but keeps easing in for longer. For bounce 0 and a 0.3 s perceived duration, the curve reaches 99.9% at 0.45 s; the CSS duration is 450 ms and the curve's shape carries the "done at 0.3 s" feel.
- **Pair curve and duration in tokens.** A spring token is two values (`--motion-spring-default` and `--motion-spring-default-dur`). Never reuse a spring curve with a different duration; that changes its stiffness.
- **Transitions retarget, but lose velocity.** If a transition is reversed mid-flight, CSS starts the reverse from the current value with the full curve (and shortens it via its reversing rules), so there's no jump, but the motion briefly stalls. Acceptable for menus; not for gestures.
- **Bounce only on spatial properties.** Apply the spring curve to `translate`, `scale` or `rotate`; give `opacity` its own `linear` or ease-out timing in the same `transition` list.
- **Keep a cubic-bezier fallback?** Not needed today: `linear()` is widely available. If you must support older engines, declare a `cubic-bezier` first and the `linear()` second; the invalid value is dropped.
- **Motion can generate them.** Motion's `spring()` generator serialises to a `linear()` string, so the same token can drive a CSS transition (see the Motion docs).

## Anti-patterns (don't)
- Using the perceived duration (300 ms) as the CSS duration for a spring curve sampled over its settle time: it plays too fast and the tail snaps.
- A spring `linear()` on a sheet that the user just flung; it ignores the release velocity.
- Hand-writing three-point "springs" (`linear(0, 1.2, 1)`) that look like a jolt, not a spring.
- An overshooting `linear()` on opacity or `background-color` (clamped values stall).
- Dozens of one-off spring curves with no tokens.

## Good references
- [MDN, `linear()` easing](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear): syntax, input percentages, how points are interpolated.
- [Chrome for Developers, Create complex animation curves in CSS with `linear()`](https://developer.chrome.com/docs/css-ui/css-linear-easing-function): springs and bounces in CSS, generator tools.
- [Jake Archibald's linear() generator](https://linear-easing-generator.netlify.app/): converts a JS easing or an SVG path into a pruned `linear()` string.
- [Motion, spring](https://motion.dev/docs/spring): `spring()` usable in CSS transitions via its generated `linear()` string.
- [webstatus.dev, linear easing](https://webstatus.dev/features/linear-easing): the Baseline dates above.

## Bad references
- Snippets that paste a 200-point `linear()` with 3-decimal percentages into every component: unreadable and untokenised; a pruned 15-point curve is visually identical.
- Demos that apply a bouncy `linear()` to every hover state, so the whole interface wobbles on mouse-over.

## Accessibility
Under reduced motion, swap the spring token for the bounce-0 curve and drop spatial movement, or use a 150 ms fade (`mfound-reduced-motion-vestibular.md`).

## Motion / interaction (if relevant)
For interruptible gestures, see `mgesture-interruptibility-and-velocity.md`. CSS curves are for rest-to-rest motion.

## Tokens and values
Generated with the sketch below (ζ = 1 − bounce, ω = 2π / duration), 99.9% settle threshold, pruning tolerance 0.002.

| Token | Value | Use |
|---|---|---|
| `--motion-spring-fast` / `-dur` | duration 0.24 s, bounce 0 → CSS 360 ms | toggles, small controls |
| `--motion-spring-default` / `-dur` | duration 0.3 s, bounce 0 → CSS 450 ms | menus, sheets settling, layout |
| `--motion-spring-slow` / `-dur` | duration 0.45 s, bounce 0 → CSS 670 ms | full-screen surfaces |
| `--motion-spring-snappy` / `-dur` | duration 0.3 s, bounce 0.15 → CSS 420 ms | snap after tap, card lift |
| `--motion-spring-playful` / `-dur` | duration 0.4 s, bounce 0.3 → CSS 660 ms | rare delight only |
| `--motion-ease-spring` | dashboard-ui's critically damped curve (same value as its tokens.css) | drag release, sheet snap |

The full `linear()` strings live in `assets/motion-tokens.css`.

## Implementation sketch
```ts
/** Sample a damped spring (rest → 1) and serialise it as a pruned CSS linear() string. */
export interface LinearSpring { easing: string; durationMs: number }

function position(t: number, omega: number, zeta: number): number {
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return 1 - (1 + omega * t) * Math.exp(-omega * t);
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -omega * (zeta - s);
  const r2 = -omega * (zeta + s);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

export function springToLinear(duration: number, bounce = 0, tolerance = 0.002): LinearSpring {
  const omega = (2 * Math.PI) / duration;
  const zeta = bounce >= 0 ? 1 - bounce : 1 / (1 + bounce);
  let settle = 0;
  for (let t = 0; t < 10; t += 0.001) if (Math.abs(1 - position(t, omega, zeta)) > 0.001) settle = t;
  settle = Math.ceil(settle * 100) / 100;
  const n = Math.max(12, Math.round(settle * 60));
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) pts.push([position((settle * i) / n, omega, zeta), (i / n) * 100]);
  const kept: Array<[number, number]> = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [av, ap] = kept[kept.length - 1];
    const [cv, cp] = pts[i + 1];
    const [pv, pp] = pts[i];
    if (Math.abs(av + ((cv - av) * (pp - ap)) / (cp - ap) - pv) > tolerance) kept.push(pts[i]);
  }
  const body = kept.slice(1).map(([v, p]) => `${+v.toFixed(3)} ${+p.toFixed(1)}%`);
  return { easing: `linear(0, ${body.join(', ')}, 1)`, durationMs: Math.round(settle * 1000) };
}
```
```css
:root {
  --motion-spring-default: linear(0, 0.048 3.7%, 0.155 7.4%, 0.407 14.8%, 0.521 18.5%, 0.619 22.2%, 0.701 25.9%, 0.768 29.6%, 0.821 33.3%, 0.863 37%, 0.896 40.7%, 0.921 44.4%, 0.941 48.1%, 0.967 55.6%, 0.982 63%, 0.998 88.9%, 1);
  --motion-spring-default-dur: 450ms;
}
.switch-thumb {
  translate: 0 0;
  transition:
    translate var(--motion-spring-default-dur) var(--motion-spring-default),
    background-color var(--motion-dur-micro) linear;
}
.switch[aria-checked="true"] .switch-thumb { translate: 20px 0; }
```

## Checklist
- [ ] Spring curves are generated and tokenised with their CSS duration.
- [ ] CSS duration = settle time (≈ 1.5 × perceived duration for bounce 0).
- [ ] Spring curves apply only to spatial properties; opacity has its own timing.
- [ ] No CSS spring follows a drag or fling; those use a JS spring with velocity.
- [ ] Reduced motion swaps to the bounce-0 curve or a fade.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- https://developer.chrome.com/docs/css-ui/css-linear-easing-function
- https://linear-easing-generator.netlify.app/
- https://webstatus.dev/features/linear-easing
- https://motion.dev/docs/spring
- https://developer.apple.com/videos/play/wwdc2023/10158/
- https://drafts.csswg.org/css-transitions/#reversing
