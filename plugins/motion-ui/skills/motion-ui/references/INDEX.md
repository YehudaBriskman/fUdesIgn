# Pattern index

19 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

Motion for data (number tweening, chart transitions, linked exploration, loading states) lives in dashboard-ui's `motion-*` and `prog-*` patterns; these files cover general product-UI motion and link there instead of repeating it.

## Foundations: purpose, timing, choreography, reduced motion (`mfound-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Choreography, sequencing and stagger](patterns/mfound-choreography-and-stagger.md) | should | When several things change at once, lead with the element the user acted on, let dependents follow, and keep the sequence short: stagger 20–40 ms per item and cap the total offset at 300 ms (150 ms inside menus and popovers), so long lists arrive together, and never stagger on repeat visits or keyboard actions. |
| [Durations and easing by element and direction](patterns/mfound-durations-and-easing.md) | must | Pick the duration from the element's size and travel (press 100 ms, menu 150 ms, dialog or sheet 240 ms, large surface 400 ms, nothing in UI chrome above 400 ms), ease out on enter, ease in only on a permanent exit, ease in-out for on-screen moves, never `ease-in` for anything the user is waiting for, and make the exit shorter than the enter. |
| [Motion purpose and the frequency budget](patterns/mfound-purpose-and-frequency.md) | must | Every animation needs a job (feedback, continuity, orientation or attention) that you can name in one word, and its size shrinks as its frequency grows: keyboard-driven and 100+-times-a-day actions get no motion, tens-a-day get a short fade, occasional actions get standard motion, and only rare moments may be expressive. |
| [Reduced motion and vestibular safety](patterns/mfound-reduced-motion-vestibular.md) | must | Treat `prefers-reduced-motion: reduce` as "replace, don't delete": swap every spatial effect (slide, zoom, parallax, spring overshoot, scroll-linked movement, large morphs) for an opacity or colour change of 150 ms or less, keep feedback, and design out the known vestibular triggers for everyone, whatever the setting. |

## Springs (`mspring-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Springs in CSS with `linear()`](patterns/mspring-css-linear-and-tokens.md) | should | Use generated `linear()` curves to give CSS transitions a spring's shape, with the transition duration set to the spring's settle time (about 1.5 × its perceived duration), and only for motion that has no incoming velocity; anything thrown, dragged or retargeted mid-flight needs a JS spring. |
| [Spring parameters: duration and bounce, mapped across libraries](patterns/mspring-parameters-and-mapping.md) | must | Specify every spring as a perceptual duration plus a bounce (bounce 0 by default, 0.1–0.2 only after a gesture with momentum, 0.3 only for rare playful moments), and convert to each library's own parameters with one formula: ω = 2π / duration, damping ratio ζ = 1 − bounce, stiffness = ω², damping = 2ζω (mass 1). |

## Gestures and direct manipulation (`mgesture-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Direct manipulation: drag that tracks 1:1](patterns/mgesture-direct-manipulation-drag.md) | must | A dragged element follows the pointer exactly from the first frame, keeping the offset where it was grabbed. Show the press on pointer-down, commit to a direction only after about 10 px of travel, capture the pointer, set `touch-action` for the axis you own, and record a short velocity history so the release can hand off to a spring. |
| [Interruptibility and velocity handoff](patterns/mgesture-interruptibility-and-velocity.md) | must | Any animation the user can affect must be interruptible at every frame: new input stops it at its current on-screen (presentation) value, carries its current velocity into whatever comes next, and never queues, restarts from the beginning or blocks input until it finishes. |
| [Momentum, projection and snapping on release](patterns/mgesture-momentum-projection-and-snap.md) | must | On release, project where the element would coast to with its release velocity (distance = v · r / (1 − r) / 1000, with r ≈ 0.998 per ms), snap to the target nearest that projected point rather than the current one, and animate there with a spring that starts at the release velocity, so a flick goes further than a slow drag of the same length. |
| [Rubber-banding at edges and limits](patterns/mgesture-rubber-banding-and-bounds.md) | should | When a drag goes past a limit, keep tracking the pointer but with diminishing resistance (the common approximation is offset = (1 − 1 / (x · 0.55 / d + 1)) · d, where x is the overshoot and d the container size), then spring back with bounce 0 on release. Never hard-stop at the edge and never let the element follow 1:1 past it. |
| [Sheets, drawers and swipe-to-dismiss](patterns/mgesture-sheets-and-swipe-to-dismiss.md) | should | A sheet enters from its own edge and leaves the same way, follows the finger when dragged, closes when released past 25% of its height or faster than about 400 px/s, otherwise springs back to its nearest detent; swipe actions on rows reveal light actions mid-swipe but run destructive ones only on release, with undo. |

## Transitions and micro-interactions (`mtrans-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Enter and exit: `@starting-style`, `allow-discrete` and the top layer](patterns/mtrans-enter-exit-top-layer.md) | must | Animate dialogs, popovers and menus in and out with CSS transitions (not keyframes), with `@starting-style` for the entry state and `display`/`overlay` with `transition-behavior: allow-discrete` for the exit. Start from opacity 0 plus scale 0.95–0.97 or a translate of 8–24 px, never from `scale(0)`, and make the final, visible state the default. |
| [Micro-interactions: buttons, toggles and toasts](patterns/mtrans-micro-interactions.md) | should | Buttons press to scale 0.97 on pointer-down in 100 ms and confirm results on themselves; toggles move their thumb with a bounce-0 spring and change colour at the same time; toasts enter from their edge in about 240 ms, stack with a 0.05 scale step, pause while hovered, can be swiped away, and never carry information that exists nowhere else. |
| [Scroll-driven animations](patterns/mtrans-scroll-driven-animations.md) | nice | Link animation to scroll only for progress and context (a reading-progress bar, a header that condenses, an edge fade under sticky chrome, a gentle reveal as content enters), with CSS `animation-timeline: scroll()` or `view()` on `transform` and `opacity`, inside `@supports` and `prefers-reduced-motion: no-preference`; never scroll-jack, never move content at a different speed from the scroll in a working screen. |
| [Spatial origin and continuity](patterns/mtrans-spatial-origin-and-continuity.md) | should | Things come from where they live and go back the same way: set `transform-origin` to the trigger side for menus and popovers, open detail views out of the item that was tapped, keep enter and exit paths mirror images, and keep navigation directions consistent (forward moves in from the trailing edge, back from the leading edge). |
| [Page and route transitions with View Transitions](patterns/mtrans-view-transitions-and-routes.md) | should | Use View Transitions for route changes: same-document `startViewTransition()` in SPAs and `@view-transition { navigation: auto; }` for multi-page sites, both as progressive enhancement. Keep the default 250 ms cross-fade or a 16–24 px directional shift, morph at most 1–3 named elements, set direction with transition types, and move focus after the swap. |

## Performance (`mperf-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Performance: compositor-only properties, `will-change` and INP](patterns/mperf-compositor-will-change-and-inp.md) | must | Animate only `transform` (or `translate`/`scale`/`rotate`) and `opacity` so the compositor can run the animation off the main thread; never animate layout properties per frame; use `will-change` only to fix a measured problem and remove it afterwards; and keep the input that starts an animation inside INP's 200 ms "good" budget, with the first visual response in the next frame. |

## Review and references (`mref-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Motion anti-patterns, with good and bad references](patterns/mref-anti-patterns-gallery.md) | must | Refuse these by default: `transition: all`, `scale(0)` entrances, `ease-in` on entrances, keyframes on toggled UI, animation on keyboard actions, motion over 400 ms in UI chrome, bounce on chrome or data, fade-up-on-scroll everywhere, scroll-jacking and parallax, dead-stop gestures, motion without a reduced variant, and layout properties animated per frame. Each one has a named fix below. |
| [Motion review rubric and frame-capture recipe](patterns/mref-motion-review-rubric.md) | must | Review motion from evidence, not memory: capture every animated interaction as frames (slowed 4× to 10×, full and reduced motion), run the in-page audit, then score the 18 checks below 0–2 each. Ship at 80% or more with no must-check at 0, and report each finding as check ID, evidence (frame, selector or value) and fix. |
