# Motion principles and tokens for data UIs

> Every animation in a dashboard must explain a change (where something came from, went, or what it became); use a small set of duration and easing tokens, keep UI motion at or under 300 ms, and never animate what the user does dozens of times a day.

**Category:** Motion · **Applies to:** every animated element: panels, popovers, rows, charts, toasts, focus/selection states · **Priority:** must

## When to use / when not
Use motion when it carries information:
- **Continuity:** an element moves, reorders, expands or changes form, so the user can track it (object constancy).
- **Feedback:** confirms that input registered (press, toggle, drag).
- **Orientation:** shows where a panel or drawer came from and where it will go back to.
- **Attention:** a one-off nudge to something that just changed (a delta chip after a refresh).

Do not animate when:
- the action is keyboard-driven or repeated many times per session (command palette, row navigation, tab switching via shortcut). Emil Kowalski: Raycast "has no open animation... That's the optimal experience."
- the content is unrelated before and after (switching to a different dataset or metric): cut or cross-fade, don't morph.
- the motion is decorative only (count-ups on every render, bouncing icons, parallax, looping shimmer that never ends).
- the user is an operator scanning for change: entrance animations hide what actually changed.

## Rules (do)
- **Budget by size and frequency** (NN/g, Carbon, M3 agree):
  - Micro feedback (toggle, checkbox, press, hover colour): 70–120 ms.
  - Small move or expand (dropdown, tooltip, row expand): 150–200 ms.
  - Medium (dialog, side panel, toast in): 200–300 ms.
  - Large (full-panel morph, chart re-layout): 300–500 ms. Never exceed 500 ms for UI chrome; NN/g calls >500 ms "a real drag".
  - Data transitions that people must track (bar sort, axis rescale): up to ~1 s total, staged (see `motion-chart-transitions.md`).
- **Exit faster than enter**: exit duration ≈ 0.7–0.8 × enter (for example 250 ms in, 200 ms out).
- **Easing by role**, never `linear` for movement:
  - Entering or settling: decelerate (ease-out).
  - Leaving permanently: accelerate (ease-in).
  - Moving on-screen to on-screen: standard (ease-in-out, asymmetric).
  - `linear` is allowed only for opacity cross-fades, continuous progress, and spinner rotation.
- **Productive, not expressive, by default.** Carbon reserves expressive curves for rare, significant moments; data tables and visualisations use productive motion.
- **Animate only `transform` and `opacity`** (and individual `translate`, `scale`, `rotate`). List properties explicitly; never `transition: all`.
- **Make motion interruptible**: a new input retargets the animation from its current position. Never queue animations or block input until they finish.
- **Springs for direct manipulation** (drag, swipe, pan release). Start critically damped (bounce 0 / 100% damping). Add overshoot (≈80% damping) only when the gesture itself carried momentum (Apple, WWDC18 "Designing Fluid Interfaces").
- **Tokenise.** Ship 4–6 duration tokens and 3–4 easing tokens. Components may not use raw ms values.
- **One motion at a time per region.** If two things animate together, they must share duration and easing (Gestalt common fate) or be deliberately staggered.

## Anti-patterns (don't)
- `transition: all 0.3s` on cards: animates layout, colour and shadow, causes jank and unintended motion.
- Bouncy springs on data marks: an overshooting bar briefly shows a value that does not exist.
- Bounce easing on `opacity` (values overshoot past 0 or 1 and flicker; noted in modern-web-guidance physics-based-easing).
- Slow "luxury" easing (600–1000 ms) on menus and filters in a daily-use tool.
- Entrance choreography that replays on every route change or filter change.
- Animating `width`/`height`/`top`/`left` per frame on large panels: layout per frame, misses the 10 ms frame budget.

## Good references
- [IBM Carbon, Motion](https://carbondesignsystem.com/elements/motion/overview/): explicit productive vs expressive split, six duration tokens (70–700 ms), and three curves per mode. Productive is named as the mode for "rendering data tables and visualizations". The best dashboard-first motion spec.
- [Material 3 motion tokens (material-web source)](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss): 16 duration steps (50–1000 ms) and named easing curves (standard, emphasized, decelerate, accelerate), all as tokens.
- [NN/g, Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/): ~100 ms for simple feedback, 200–300 ms for screen changes, ease-out default, "the more frequent the animation, the more subtle and shorter".
- [Apple WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): springs described by damping and response, not duration; redirectable motion; 100% damping by default, about 80% only when the gesture has momentum.
- [Emil Kowalski, You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): frequency is the deciding factor; keyboard actions should never animate; UI animation under 300 ms; a 180 ms dropdown feels faster than a 400 ms one.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): CSS before WAAPI before JS libraries; compositor-only properties; "Animations are cancelable by user input"; never `transition: all`.

## Bad references
- Template "stat card" kits (for example [Framer stat-reveal components](https://www.framer.com/community/marketplace/components/stat-reveal/)) that count every KPI up from zero and slide cards in on each view. The motion is the same whatever the data says, so it carries no information and delays reading by around a second.
- Marketing-site motion pasted into apps: long staggered fades of 600–1200 ms on dashboard tiles. NN/g's 500 ms ceiling exists for this reason.

## Accessibility
- Respect `prefers-reduced-motion`: drop spatial movement, keep colour and opacity feedback (see `motion-reduced-motion.md`).
- Anything that moves for more than 5 s alongside other content needs a pause control (WCAG 2.2.2).
- Never flash more than 3 times per second (WCAG 2.3.1).
- Make the final state the default state, so disabling animation never leaves content at `opacity: 0`.

## Motion / interaction (if relevant)
- Under 100 ms between input and first visual response, whatever the animation length (see `prog-perceived-performance-thresholds.md`).
- When interrupted, retarget from the current value. With springs, preserve velocity: Motion's `visualDuration` springs inherit the velocity of the animation they interrupt.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-dur-instant` | 0 ms | keyboard-driven changes, reduced motion |
| `--motion-dur-micro` | 100 ms | hover, press, toggle, colour change |
| `--motion-dur-short` | 150 ms | tooltip, dropdown, row expand |
| `--motion-dur-medium` | 240 ms | dialog, drawer, toast (Carbon moderate-02) |
| `--motion-dur-long` | 400 ms | large panel, chart re-layout stage |
| `--motion-dur-data` | 600–900 ms total | staged chart transitions only |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | on-screen moves (Carbon productive) |
| `--motion-ease-enter` | `cubic-bezier(0, 0, 0.38, 0.9)` | entering, settling |
| `--motion-ease-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | leaving permanently |
| `--motion-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | rare, important moments (M3 emphasized) |
| spring (direct manipulation) | bounce 0, visualDuration 0.3 s | drag release, sheet snap |
| exit / enter ratio | 0.75 | |
| stagger per item | 20–40 ms, max total 300 ms | list or bar entry |

## Implementation sketch
```css
:root {
  --motion-dur-micro: 100ms;
  --motion-dur-short: 150ms;
  --motion-dur-medium: 240ms;
  --motion-dur-long: 400ms;
  --motion-ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
  --motion-ease-enter: cubic-bezier(0, 0, 0.38, 0.9);
  --motion-ease-exit: cubic-bezier(0.2, 0, 1, 0.9);
  /* Critically damped spring approximation via linear() (Baseline 2023) */
  --motion-ease-spring: linear(0, 0.25 8%, 0.6 18%, 0.86 30%, 0.97 45%, 1);
}

.panel {
  translate: 0 0;
  opacity: 1;
  transition:
    translate var(--motion-dur-medium) var(--motion-ease-enter),
    opacity var(--motion-dur-short) linear,
    display var(--motion-dur-medium) allow-discrete;
}
@starting-style { .panel { translate: 0 8px; opacity: 0; } }
.panel[hidden] {
  display: none; opacity: 0; translate: 0 8px;
  transition-duration: calc(var(--motion-dur-medium) * 0.75);
  transition-timing-function: var(--motion-ease-exit);
}
@media (prefers-reduced-motion: reduce) {
  .panel, .panel[hidden] { translate: none; }
  @starting-style { .panel { translate: none; } }
}
```

## Checklist
- [ ] Every animation has a stated purpose: continuity, feedback, orientation or attention.
- [ ] No raw ms or `cubic-bezier` values outside the token file.
- [ ] UI chrome animations ≤ 300 ms; nothing over 500 ms except staged data transitions.
- [ ] Keyboard-triggered and high-frequency actions have 0 ms motion.
- [ ] Only `transform`/`opacity` (or individual transform properties) animate; no `transition: all`.
- [ ] New input interrupts and retargets any running animation.
- [ ] Reduced-motion variant exists and leaves the final state visible.

## Sources
- https://carbondesignsystem.com/elements/motion/overview/
- https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss
- https://www.nngroup.com/articles/animation-duration/
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://emilkowal.ski/ui/you-dont-need-animations
- https://vercel.com/design/guidelines
- https://motion.dev/docs/spring
- https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/
- https://web.dev/articles/rail
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/motion.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/physics-based-easing.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/animate-element-entry-exit.md
- modern-web-guidance: skills/modern-web-guidance/guides/user-experience/natural-interactions.md
