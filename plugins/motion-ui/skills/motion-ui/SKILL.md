---
name: motion-ui
description: Design, build or review motion and gestures in product UIs with researched rules and concrete tokens. Covers when to animate at all (purpose and frequency), durations and easing, springs (duration and bounce mapped to CSS linear(), Motion, React Spring, SwiftUI and Material 3), drag, swipe, sheets and drawers, momentum and snapping, rubber-banding, interruptibility, enter and exit animations for dialogs, popovers and menus (@starting-style, allow-discrete, transform-origin), page and route transitions (View Transitions, cross-document), buttons, toggles and toasts, scroll-driven animation, animation performance (compositor, will-change, INP), reduced motion and vestibular safety, and motion review. Use when adding or fixing an animation or transition, building a gesture, tuning a spring, or when asked to critique motion. Trigger even if the word "motion" isn't used, for example "make this feel smoother", "this modal pops in weird", "add a swipe to dismiss", "the drawer feels janky", "animate the page change".
---

# Motion UI

A research-backed playbook for product-UI motion and gesture: 20 pattern files, each with rules, anti-patterns, good and bad references, accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiables, the decision tables and the token defaults. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. The prefixes are `mfound` (purpose, timing, choreography, reduced motion), `mspring` (springs), `mgesture` (drag, momentum, edges, sheets, interruption), `mtrans` (enter/exit, spatial origin, route transitions, micro-interactions, scroll-driven), `mperf` (performance) and `mref` (review rubric, anti-patterns).
- **Starter tokens:** `assets/motion-tokens.css`. Duration, easing and stagger names and values match dashboard-ui's `tokens.css`. It works on its own in light and dark: the dashboard-ui role tokens it reads are declared at zero specificity, so dashboard-ui's `tokens.css` or the project's own tokens on the same role names override them in any load order.
- **Data UIs:** for number tweening, chart transitions, linked exploration, live recompute and loading states, use dashboard-ui's `motion-*` and `prog-*` patterns. This skill doesn't repeat them.

## Workflow

1. **Decide whether it should move at all.** Name the job: feedback, continuity, orientation, attention, or (rarely) delight. Estimate how often it happens and whether it's triggered from the keyboard, then pick the row in the frequency table below (`mfound-purpose-and-frequency.md`). If there is no job, or the action is keyboard-driven or happens 100+ times a day, stop: no animation.
2. **Pick the mechanism.**
   - Rest-to-rest and toggled (menus, dialogs, toggles): a CSS transition (`mfound-durations-and-easing.md`), or a spring `linear()` token (`mspring-css-linear-and-tokens.md`).
   - Driven by a finger or pointer, or interruptible with velocity: a JS spring (`mspring-parameters-and-mapping.md`, `mgesture-interruptibility-and-velocity.md`).
   - Navigation: View Transitions (`mtrans-view-transitions-and-routes.md`).
   - Tied to scroll position: scroll-driven animation (`mtrans-scroll-driven-animations.md`).
3. **Set timing from tokens.** Duration by element, easing by direction, exits at 0.75× the enter, and springs as a duration plus a bounce. Never use raw values in components.
4. **Place it in space.** Use `transform-origin` at the trigger, mirror exits, keep forward and back consistent, and let persistent chrome stay still (`mtrans-spatial-origin-and-continuity.md`). For enter/exit of top-layer elements, follow `mtrans-enter-exit-top-layer.md`.
5. **For gestures**, apply in order:
   - 1:1 tracking with a 10 px threshold (`mgesture-direct-manipulation-drag.md`);
   - projection and velocity on release (`mgesture-momentum-projection-and-snap.md`);
   - rubber-banded edges (`mgesture-rubber-banding-and-bounds.md`);
   - the sheet and swipe rules (`mgesture-sheets-and-swipe-to-dismiss.md`).
6. **Choreograph** when several things change: cause first, then parent, then children; stagger 20–40 ms, capped (`mfound-choreography-and-stagger.md`).
7. **Make it cheap.** Animate transform and opacity only, use no global `will-change`, and paint feedback in the next frame (`mperf-compositor-will-change-and-inp.md`).
8. **Write the reduced-motion version** as substitutions, not deletions (`mfound-reduced-motion-vestibular.md`).
9. **Review from frames.**
   - Run the anti-pattern pass (`mref-anti-patterns-gallery.md`).
   - Capture frame strips (slowed 4×, full and reduced motion, plus one interrupted run) and the in-page audit.
   - Score the 18-check rubric (`mref-motion-review-rubric.md`). Ship at 80% or more with no must-check at 0.
   - Report each finding as check ID · evidence · fix, plus what you didn't check.

## Non-negotiables

Break one of these only with a written reason.

**Whether and how long**
1. Every animation has a named job. Keyboard-triggered and 100+/day actions have no animation.
2. The first visual response lands within 100 ms of input, whatever the animation length.
3. Durations come from tokens (100 / 150 / 240 / 400 ms). Nothing in UI chrome runs over 400 ms; only rare moments may reach 600 ms.
4. Enters ease out; on-screen moves ease in-out; no `ease-in` on anything the user waits for. Exits are about 0.75× the enter.

**Springs and gestures**

5. Springs are written as duration + bounce. Use bounce 0 for UI chrome, 0.1–0.2 only after a gesture with momentum, and never on opacity, colour or data values.
6. Dragged elements track the pointer 1:1 from the grab point, with no transition while dragging. Commit to a drag after about 10 px.
7. On release, snap to the target nearest the *projected* position, and start the settle spring at the release velocity.
8. Edges rubber-band; nothing hard-stops under the finger.
9. Everything the user can affect is interruptible from its current on-screen value. There are no animation queues and no input blocked during motion. Toggled UI uses transitions, not keyframes.
10. Destructive gesture actions commit on release and offer undo. Every gesture has a button or keyboard equivalent (WCAG 2.5.7).

**Enter, exit and navigation**

11. Never start from `scale(0)`. Enter from opacity 0 plus scale 0.95–0.97 or 8–24 px of travel, with `transform-origin` at the trigger.
12. Use `@starting-style` for entry, and `display`/`overlay` with `allow-discrete` for exit. The visible final state is the default, so unsupported browsers still work.
13. Route transitions are progressive enhancement. Prepare data first, then transition. Use the default cross-fade or a 16–24 px directional shift by transition type, name 1–3 shared elements, and move focus afterwards.
14. Toasts never hold the only copy of information. Errors never auto-dismiss; an Undo toast stays at least 8 s and its action also exists outside the toast. Timers pause on hover, focus and hidden tabs (dashboard-ui `comp-notifications-alerts.md`).

**Performance and safety**

15. Animate only transform-family properties and opacity on anything larger than a small control. No `transition: all`. `will-change` is temporary and only follows a measurement.
16. Under `prefers-reduced-motion: reduce`, replace spatial motion with a fade of 150 ms or less, keep feedback, keep 1:1 drag tracking, and drop bounce. Never ship a global `0.01ms` kill switch, and JS animation must respect the setting too.
17. No parallax, scroll-jacking, full-viewport zoom or idle looping motion in product UI. Autoplay over 5 s has a pause control, and nothing flashes more than 3 times a second.
18. Review motion from captured frames, not from code or memory.

## Decision tables

**Frequency → motion** (`mfound-purpose-and-frequency.md`)

| How often | Motion |
|---|---|
| Keyboard-triggered, or 100+ times a day (skill's cut-off) | None |
| Tens of times a day | 100–150 ms fade, maybe a small scale; no movement, no bounce |
| A few times a session | 150–240 ms, may move 8–24 px |
| Rare (first run, big success) | Up to 400–600 ms, a spring with bounce allowed |

**Mechanism** (`mspring-parameters-and-mapping.md`, `mspring-css-linear-and-tokens.md`)

| Situation | Use |
|---|---|
| Colour, opacity, state change | CSS transition, `linear` or ease-out |
| Toggled element that may be reversed mid-way | CSS transition (never keyframes) |
| Rest-to-rest spatial motion with a spring feel | CSS spring `linear()` token plus its own duration |
| Release after drag or fling, or retargeting with velocity | JS spring (Motion, React Spring, SwiftUI, Compose) |
| Layout change (reorder, resize, expand) | FLIP, Motion `layout`, or a View Transition |
| Page or route change | View Transition (same- or cross-document) |
| Progress through a scroller | Scroll-driven animation |

**Duration and easing by element** (`mfound-durations-and-easing.md`)

| Element | Duration | Curve |
|---|---|---|
| Press, toggle, hover | 100 ms | ease-out (press scale 0.97) |
| Tooltip, menu, popover | 150 ms in / 110 ms out | ease-out in, ease-in or fade out |
| Dialog, toast | 240 ms in / 180 ms out | ease-out in, ease-in or fade out |
| Sheet, drawer | 240–400 ms | `--motion-ease-drawer`, or a spring after drag |
| Container transform (card → detail) | 400 ms | emphasized |
| Route cross-fade | 150–250 ms | linear |

**Spring presets** (`mspring-parameters-and-mapping.md`)

| Token | Duration / bounce | Use |
|---|---|---|
| `spring-fast` | 0.24 s / 0 | toggles, small controls |
| `spring-default` | 0.3 s / 0 | menus, sheet settle, layout |
| `spring-slow` | 0.45 s / 0 | full-screen surfaces |
| `spring-snappy` | 0.3 s / 0.15 | release after a flick, snaps |
| `spring-playful` | 0.4 s / 0.3 | rare delight only |

Library parameters (Motion, React Spring, SwiftUI, Material 3) come from one formula in `mspring-parameters-and-mapping.md`.

**Gesture thresholds** (`mgesture-*`)

| Value | Default |
|---|---|
| Drag start / axis lock | 10 px |
| Velocity sample window | 100 ms |
| Projection deceleration | 0.998 per ms (0.99 for fast paging) |
| Flick commits | > 400 px/s |
| Sheet closes | > 25% of its height dragged, or a flick |
| Rubber-band constant | 0.55 (the common approximation) |

## Token defaults

Full set in `assets/motion-tokens.css`.

| Group | Defaults |
|---|---|
| Duration | instant 0 · micro 100 · short 150 · medium 240 · long 400 ms · exit ratio 0.75 |
| Easing | standard `cubic-bezier(0.2,0,0.38,0.9)` · enter `(0,0,0.38,0.9)` · exit `(0.2,0,1,0.9)` · emphasized `(0.2,0,0,1)` · drawer `(0.32,0.72,0,1)` |
| Springs (CSS) | `--motion-spring-{fast,default,slow,snappy,playful}` with matching `-dur` (360 / 450 / 670 / 420 / 660 ms) |
| Geometry | scale-from 0.96 · press 0.97 · distance 8 / 16 / 24 px |
| Choreography | stagger 30 ms · max 300 ms (150 ms in menus) |
| Reduced motion | spatial tokens collapse to 0 or 1; fades keep their timing |

## How to apply this skill

- **When building:**
  - Load `assets/motion-tokens.css`, or map it onto the project's tokens.
  - Prefer platform features: CSS transitions, `@starting-style`, `<dialog>` and the popover API, View Transitions, scroll-driven animations, `linear()`. Reach for a JS library only for gestures and velocity.
  - Never use the TypeScript `any` type.
- **When reviewing:** capture frames first, then run the anti-pattern gallery and the rubric. Report a table of check, score, evidence and fix, ordered by severity, and list what you didn't check.
- **When the project has a motion system** (M3, Carbon, its own tokens): its tokens win. Map them onto these roles and flag the gaps.
- **When rules conflict:** accessibility and the user's control (reduced motion, interruptibility, no scroll-jacking) beat expressiveness, and frequency beats delight.
