# Drag, release and spring physics

> Anything the user can grab follows the pointer 1:1 from where it was grabbed, hands its release velocity to a critically damped spring, settles on the snap target nearest its *projected* resting point, resists softly past its bounds, and can be grabbed again mid-flight without a jump.

**Category:** Motion · **Applies to:** resizable split panes, drawers and bottom sheets, side-panel peek, timeline brush handles, column reordering, card and widget re-arranging · **Priority:** should

## When to use / when not
- **Use** for direct manipulation: the user drags a thing and lets go, and the thing must come to rest somewhere sensible (a pane width, a sheet detent, a column slot).
- **Use** springs (not CSS durations) for the settle after release, because the start velocity comes from the hand and changes every time. Apple's WWDC18 talk avoids "duration" for elastic motion for this reason.
- **Don't** use momentum or projection on a **value control**. A what-if slider, a range handle or a date scrubber must stop exactly where the pointer was released. A thrown slider that lands somewhere else changes the model input without consent (see `comp-slider-with-number-input.md`).
- **Don't** use bounce on **data marks** (bars, lines, values). Overshoot draws a value that does not exist (see `motion-principles-and-tokens.md`, `motion-chart-transitions.md`).
- **Don't** apply any of this to keyboard-driven changes. Arrow keys move a splitter or column by a step, instantly (see `comp-keyboard-shortcuts-focus.md`).
- Spring and duration tokens for everything else stay in `motion-principles-and-tokens.md`. This file covers the gesture-to-spring handoff only. For converting between damping/response, Motion's `bounce`/`visualDuration`, M3 and SwiftUI presets, the canonical table is the motion-ui plugin's `mspring-parameters-and-mapping.md`; the values here (ζ 1.0, 0.8 with momentum, response 0.3–0.45 s) sit inside its ranges.

## Rules (do)
- **Press, then commit.** Give visual feedback on `pointerdown` (handle highlight within 100 ms, see `prog-perceived-performance-thresholds.md`). Don't commit a direction until the pointer has moved past a threshold. Apple calls this distance *hysteresis* and says it is "usually 10 points in iOS". Use 8–10 CSS px for touch and 3–4 px for a mouse.
- **Decide the axis once.** At the threshold, compare |dx| and |dy|. Lock to the larger axis for single-axis things (sheets, splitters). For 2D things (a widget on a grid), keep both axes.
- **Keep the grab offset.** Store `pointer − element origin` at `pointerdown` and subtract it on every move. The element must not jump so that its corner sits under the pointer.
- **Capture the pointer.** Call `setPointerCapture(pointerId)` on `pointerdown`, so the drag continues when the pointer leaves the handle or the window edge. Set `touch-action: none` (or `pan-y` for a horizontal-only handle) so the browser doesn't scroll instead.
- **Track velocity from a short history.** Keep the last ~100 ms of `(time, position)` samples and compute velocity from the oldest and newest in that window, in px/s. Using only the last two events gives noisy, sometimes zero velocity, because the final `pointermove` often repeats the last position. Apple's talk: "We use the history of the touch". The 100 ms window is a house value, not an Apple number.
- **Project, then snap.** On release, compute where the element *would* coast to and snap to the target nearest that projected point, not the target nearest the current point and not by velocity sign alone. Projection distance for a scroll-like deceleration rate `r` (per millisecond) is `(v / 1000) × r / (1 − r)`, with `v` in px/s.
  - `r = 0.998` matches `UIScrollView.DecelerationRate.normal`; `r = 0.99` matches `.fast`. Apple documents the names but not the numbers. These raw values are reported by third-party write-ups (cited below), not Apple; this skill adopts them as its own defaults.
  - The formula is the one shown on screen in the WWDC18 session's sample (the transcript says only that it "mixed in the deceleration rate"). It is the closed-form limit of per-millisecond decay with `ln r` approximated by `(r − 1) / r`.
  - Use `.normal` (0.998) for sheets and drawers that should travel. Use `.fast` (0.99) for small things such as a splitter, where a flick should only nudge the target choice.
- **Hand the velocity to the spring.** Start the settle spring with the release velocity. APIs that want a *relative* velocity (UIKit's `initialVelocity`, some JS libraries) need `v / (target − current)`, set to 0 when the distance is 0. Motion takes absolute units per second.
- **Spring parameters are damping ratio and response, not duration.**
  - **Damping ratio** ζ: 1.0 = critically damped, no overshoot; below 1 overshoots. Apple: "start with 100% damping". Use about 0.8 only when the gesture itself had momentum toward the target (the Music "Now Playing" swipe-to-dismiss in the talk).
  - **Response** R: roughly the time of one undamped oscillation. For unit mass, `stiffness = (2π / R)²` and `damping = 4π·ζ / R`.
  - The talk gives **no numeric response values**. Values such as "0.4 s for moves" or "0.3 s for drawers" that circulate in skills and blog posts are not in the transcript; treat them as tuning starting points, not Apple's numbers.
  - Published Apple defaults you *can* cite: SwiftUI `spring()` defaults to response 0.5, damping fraction 0.825; `interactiveSpring()` to response 0.15, damping fraction 0.86.
- **Interrupt from the live value.** If the user grabs the element mid-settle, read its *current rendered* position and velocity, stop the spring, and continue the drag from there with a new grab offset. Never restart from the old target or the model value. The talk calls for "constant redirection and interruption".
- **One spring per axis.** A 2D move (widget re-arrange) runs independent X and Y springs, each with its own velocity, so a diagonal throw curves naturally into the slot. The talk discusses mixed two-axis gestures but not the implementation; per-axis springs are the standard way to get it.
- **Rubber-band at the bounds.** Past a limit, move the element by a damped amount `f(x) = (1 − 1 / (x·c / d + 1))·d`, where `x` is the overshoot, `d` the dimension (pane width or sheet height) and `c ≈ 0.55`. The curve and constant come from Grant Paul's (@chpwn) 2013 description of UIScrollView, written up in a January 2013 analysis (gist below); Apple doesn't publish them. It approaches `d` asymptotically, so the element never escapes. On release, spring back to the bound with ζ = 1.
- **Snap targets are few and meaningful.** For a split pane: collapsed (0 or the rail width), the default width and the maximum. For a sheet: closed, peek and full. Three or four detents at most; more make the projection feel random.
- **Persist the result** (pane width, column order) and put it in the URL or user settings when it changes what the view shows (see `found-overview-filter-details.md`).

## Anti-patterns (don't)
- Element jumps on grab because the grab offset was dropped.
- Snapping by the nearest target to the *current* position, so a quick flick toward "closed" bounces back open.
- A CSS `transition` on `translate` while dragging. It lags the pointer by the transition duration. Disable transitions during the drag and only animate the settle.
- Restarting a settle animation from its start or target when grabbed, which teleports the element.
- `bounce > 0` on a splitter, a table column or anything carrying data. Overshoot on a column reorder briefly shows the wrong column order.
- Momentum on value sliders or scrubbers (see above).
- Drag as the only way to resize or reorder. WCAG 2.5.7 requires a single-pointer alternative.
- Animating `width` per frame on a large pane. Translate a preview edge, then commit the width once on settle, or accept that a layout-per-frame resize must stay cheap (see `motion-principles-and-tokens.md`).

## Good references
- [Apple WWDC18, Designing Fluid Interfaces (session 803)](https://developer.apple.com/videos/play/wwdc2018/803/) — damping and response instead of duration; 100% damping by default, 80% when the gesture had momentum; 10-point hysteresis; projection from velocity plus deceleration rate; rubber-banding to show edges; constant redirection.
- [Apple, UISpringTimingParameters `initialVelocity`](https://developer.apple.com/documentation/uikit/uispringtimingparameters/initialvelocity) — the relative-velocity recipe: velocity divided by remaining distance, per axis, 0 when the distance is 0.
- [Nathan Gitter, Building Fluid Interfaces](https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5) and [the open-source demos](https://github.com/nathangitter/fluid-interfaces) — working implementations of the talk's ideas, including momentum projection and rubber-banding.
- [Motion, spring](https://motion.dev/docs/spring) — `bounce: 0` is critically damped; a `visualDuration` spring inherits the velocity of the gesture or animation it interrupts.
- [Motion source, `spring.ts`](https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/generators/spring.ts) — `bounce` maps to damping ratio `1 − bounce` "as SwiftUI does"; `visualDuration` sets the natural frequency to `2π / (1.2 × visualDuration)`. So Apple's response R ≈ 1.2 × `visualDuration`.
- [WAI-ARIA APG, Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — the keyboard contract for a draggable divider: `separator` role, value attributes, arrow keys, Home/End and Enter to collapse or restore.

## Bad references
- [Rubber-band formula gist (2013)](https://gist.github.com/originell/6961057) — useful, but often quoted as "Apple's code". It is a reverse-engineered approximation; say so when you use it.
- Generic "animate on drop" tutorials that use a fixed 300 ms `ease-out` after a drag: a slow drop then feels sticky and a fast throw feels braked. The duration ignores the hand.
- [Motion spring options](https://motion.dev/docs/spring) misread: copies of Apple-style advice that set Motion `damping: 1` believing it is Apple's damping ratio. In Motion, `damping` is a physical coefficient (default 10), so `damping: 1` oscillates for a long time; the ratio equivalent is `bounce: 0`.

## Accessibility
- **Single-pointer and keyboard alternatives** (WCAG 2.5.7, AA in 2.2): a splitter gets `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`, `tabindex="0"`, and arrow keys (10 px or one detent per press, Home/End for min/max). Column reorder offers "Move left/right" menu items.
- Handle hit area at least 24×24 CSS px (WCAG 2.5.8), 44 px on touch, even if the visible rule is 1 px.
- **Reduced motion:** dragging itself stays 1:1, because the user drives it. On release, skip projection overshoot and snap with ζ = 1 and a short response (≤ 0.2 s), or jump to the target. Don't play the rubber-band return as a visible spring; clamp instead (see `motion-reduced-motion.md`).
- Announce the committed result, not every frame: "Panel width 420 pixels" or "Revenue column moved to position 3" in a polite live region.

## Motion / interaction (if relevant)
- First visual response under 100 ms from `pointerdown`.
- During the drag, render from `pointermove` inside `requestAnimationFrame`; never queue transitions.
- Double-click (and Enter, per the APG splitter pattern) on a splitter restores the default width, a common desktop convention. Only add a double-tap gesture where it exists: the talk notes double-tap delays single tap by about half a second.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--drag-threshold-touch` | 10px | Apple's "usually 10 points" hysteresis |
| `--drag-threshold-mouse` | 3–4px | house value; mice jitter less |
| `--velocity-window` | 100ms | sample window for release velocity (house value) |
| `--decel-normal` | 0.998 / ms | sheets, drawers (house value; matches third-party reports of UIScrollView `.normal`) |
| `--decel-fast` | 0.99 / ms | splitters, small handles (house value; reported `.fast`) |
| `--spring-damping` | 1.0 | default for all structural moves |
| `--spring-damping-momentum` | 0.8 | only when the gesture threw toward the target, never on data |
| `--spring-response` | 0.3–0.45s | tuning start; ≈ Motion `visualDuration` 0.25–0.38s |
| `--rubber-band-c` | 0.55 | not an Apple number: Grant Paul's (@chpwn) 2013 description, written up in the gist below |
| `--splitter-step` | 10px or 1 detent | arrow-key step |
| Motion mapping | `bounce = 1 − ζ`, `visualDuration ≈ R / 1.2` | from Motion's source |

## Implementation sketch
```ts
type Sample = { t: number; x: number }
const DECEL_NORMAL = 0.998
const WINDOW_MS = 100

/** Velocity in px/s from the samples in the last WINDOW_MS. */
export function releaseVelocity(samples: readonly Sample[]): number {
  const last = samples.at(-1)
  if (!last) return 0
  const first = samples.find((s) => last.t - s.t <= WINDOW_MS) ?? last
  const dt = last.t - first.t
  return dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0
}

/** Where a scroll-like deceleration would come to rest (rate per ms). */
export const project = (v: number, rate = DECEL_NORMAL): number => ((v / 1000) * rate) / (1 - rate)

export function nearestTarget(at: number, targets: readonly number[]): number {
  return targets.reduce((best, t) => (Math.abs(t - at) < Math.abs(best - at) ? t : best))
}

/** UIScrollView-style rubber band (Grant Paul, 2013; not Apple-published); never reaches `dim`. */
export const rubberBand = (over: number, dim: number, c = 0.55): number =>
  Math.sign(over) * (1 - 1 / ((Math.abs(over) * c) / dim + 1)) * dim

/** Damped spring from damping ratio and response (s), unit mass, semi-implicit Euler. */
export function springStep(
  s: { x: number; v: number }, target: number, zeta: number, response: number, dt: number,
): { x: number; v: number } {
  const k = (2 * Math.PI / response) ** 2
  const c = (4 * Math.PI * zeta) / response
  const v = s.v + (-k * (s.x - target) - c * s.v) * dt
  return { x: s.x + v * dt, v }
}

export function attachSplitter(handle: HTMLElement, apply: (w: number) => void, targets: readonly number[]): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  let state = { x: targets[1] ?? 320, v: 0 }
  let grab = 0
  let raf = 0
  let samples: Sample[] = []
  const [min, max] = [Math.min(...targets), Math.max(...targets)]

  handle.addEventListener('pointerdown', (e) => {
    cancelAnimationFrame(raf)                       // interrupt from the live value
    handle.setPointerCapture(e.pointerId)
    grab = e.clientX - state.x
    samples = [{ t: e.timeStamp, x: state.x }]
  })
  handle.addEventListener('pointermove', (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return
    const raw = e.clientX - grab
    const over = raw < min ? raw - min : raw > max ? raw - max : 0
    state = { x: over === 0 ? raw : (over < 0 ? min : max) + rubberBand(over, max), v: 0 }
    samples.push({ t: e.timeStamp, x: raw })
    apply(state.x)
  })
  handle.addEventListener('pointerup', (e) => {
    handle.releasePointerCapture(e.pointerId)
    const v = releaseVelocity(samples)
    const target = nearestTarget(state.x + (reduce.matches ? 0 : project(v, 0.99)), targets)
    if (reduce.matches) { state = { x: target, v: 0 }; apply(target); return }
    state = { x: state.x, v }
    let last = performance.now()
    const tick = (now: number): void => {
      state = springStep(state, target, 1, 0.35, Math.min((now - last) / 1000, 1 / 30))
      last = now
      if (Math.abs(state.x - target) < 0.5 && Math.abs(state.v) < 5) state = { x: target, v: 0 }
      apply(state.x)
      if (state.x !== target) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  })
}
```
```css
.splitter {
  inline-size: 8px;            /* visible rule can be 1px; hit area stays >= 24px with padding */
  padding-inline: 8px;
  margin-inline: -8px;
  cursor: col-resize;
  touch-action: none;          /* no browser panning while dragging */
}
.splitter:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.pane { transition: none; }    /* never transition while the pointer drives the value */
```

## Checklist
- [ ] No jump on grab: the grab offset is kept, and the pointer is captured.
- [ ] Direction commits only after the movement threshold (about 10 px on touch).
- [ ] Release velocity comes from a ~100 ms history, and the target is chosen from the *projected* position.
- [ ] Settle uses a spring started with the release velocity; ζ = 1 unless the gesture threw toward the target, and never bounce on data.
- [ ] Grabbing mid-settle continues from the rendered position, with no restart.
- [ ] Bounds rubber-band and spring back; value controls (sliders, scrubbers) have no momentum.
- [ ] Keyboard and single-pointer alternatives exist (WCAG 2.5.7), with 24 px minimum handles.
- [ ] Reduced motion: drag stays 1:1, the release snaps without overshoot or a visible rubber-band return.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/ (transcript: damping and response definitions, 100% / 80% damping, 10-point hysteresis, projection, rubber-banding, redirection; no numeric response values)
- https://developer.apple.com/documentation/uikit/uispringtimingparameters
- https://developer.apple.com/documentation/uikit/uispringtimingparameters/initialvelocity
- https://developer.apple.com/documentation/uikit/uispringtimingparameters/init%28dampingratio:initialvelocity:%29
- https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate-swift.struct/normal (no numeric value published)
- https://developer.apple.com/documentation/swiftui/animation/spring%28response:dampingfraction:blendduration:%29 (defaults 0.5 / 0.825)
- https://developer.apple.com/documentation/swiftui/animation/interactivespring%28response:dampingfraction:blendduration:%29 (defaults 0.15 / 0.86)
- https://motion.dev/docs/spring
- https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/generators/spring.ts
- https://teletype.in/@swift-discipline/uiscrollview-deceleration (0.998 / 0.99 and the `(d − 1) / d` approximation)
- https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
- https://github.com/nathangitter/fluid-interfaces
- https://gist.github.com/originell/6961057 (rubber-band formula, attributed to Grant Paul)
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
