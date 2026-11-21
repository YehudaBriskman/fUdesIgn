# Motion principles and tokens for data UIs

> Every animation in a dashboard must explain a change (where something came from, went, or what it became); use the duration tokens 100/150/240/400 ms and the four easing tokens, keep most UI motion at or under 300 ms (400 ms only for large panels, 600–900 ms only for staged data transitions), and never animate what the user does dozens of times a day.

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
- **Budget by size and frequency.** Use the four duration tokens from `assets/tokens.css`; each maps to a Carbon duration step, and NN/g's "100–500 ms" range brackets them all:
  - Micro feedback (toggle, checkbox, press, hover colour): `--motion-dur-micro` 100 ms. Carbon's own steps here are 70 ms (`fast-01`, buttons and toggles) and 110 ms (`fast-02`, fades); NN/g says simple feedback should be "roughly 100 ms".
  - Small move or expand (dropdown, tooltip, row expand): `--motion-dur-short` 150 ms (Carbon `moderate-01`, "small expansions, and short-distance movements").
  - Medium (dialog, side panel, toast in): `--motion-dur-medium` 240 ms (Carbon `moderate-02`, "expansions, system communication, and toasts"). NN/g puts large screen changes such as a modal at 200–300 ms.
  - Large (full-panel morph, one stage of a chart re-layout): `--motion-dur-long` 400 ms (Carbon `slow-01`). NN/g calls 400 ms very slow and says "at 500ms, animations start to feel like a real drag", so no UI-chrome animation goes above 400 ms.
  - Data transitions that people must track (bar sort, axis rescale): 600–900 ms in total, staged as two or more `long` stages (see `motion-chart-transitions.md`). This is the only band above 400 ms.
- **Exit faster than enter**: exit duration = 0.75 × enter (240 ms in, 180 ms out). This ratio is a house rule; none of the cited sources gives a number for it.
- **Easing by role**, never `linear` for movement. The curves are Carbon's productive set (verified against the Carbon motion page):
  - Entering or settling: `--motion-ease-enter`, `cubic-bezier(0, 0, 0.38, 0.9)`. NN/g: "Most frequently, you'll want to use an ease-out animation."
  - Leaving permanently: `--motion-ease-exit`, `cubic-bezier(0.2, 0, 1, 0.9)`.
  - Moving on-screen to on-screen: `--motion-ease-standard`, `cubic-bezier(0.2, 0, 0.38, 0.9)`.
  - Rare, significant moments only: `--motion-ease-emphasized`, `cubic-bezier(0.2, 0, 0, 1)` (Material 3 `emphasized`).
  - `linear` is allowed only for opacity cross-fades, continuous progress, and spinner rotation.
- **Productive, not expressive, by default.** Carbon reserves expressive curves for rare, significant moments; data tables and visualisations use productive motion.
- **Animate only `transform` and `opacity`** (and individual `translate`, `scale`, `rotate`). List properties explicitly; never `transition: all`.
- **Make motion interruptible**: a new input retargets the animation from its current position. Never queue animations or block input until they finish.
- **Springs for direct manipulation** (drag, swipe, pan release). Start critically damped (bounce 0 / 100% damping): Apple recommends "starting with 100% damping, or no overshoot". Add overshoot only when the gesture itself carried momentum; Apple's example is 80% damping for the swipe-to-dismiss of Now Playing (WWDC18 "Designing Fluid Interfaces"). 80% is one worked example, not a system default.
- **Tokenise.** Ship the 4 duration tokens and 4 easing tokens in `assets/tokens.css`. Components may not use raw ms values.
- **One motion at a time per region.** If two things animate together, they must share duration and easing (Gestalt common fate) or be deliberately staggered.

## Anti-patterns (don't)
- `transition: all 0.3s` on cards: animates layout, colour and shadow, causes jank and unintended motion.
- Bouncy springs on data marks: an overshooting bar briefly shows a value that does not exist.
- Bounce or overshoot easing on `opacity`. Opacity is clamped to 0–1, so the overshoot part of the curve renders as a visible stall at full opacity rather than a bounce.
- Slow "luxury" durations (600–1000 ms) on menus and filters in a daily-use tool. Emil Kowalski: "A 180ms dropdown animation feels more responsive than a 400ms one." 
- Entrance choreography that replays on every route change or filter change.
- Animating `width`/`height`/`top`/`left` per frame on large panels: layout per frame, misses the 10 ms frame budget.

## Good references
- [IBM Carbon, Motion](https://carbondesignsystem.com/elements/motion/overview/): explicit productive vs expressive split, six duration tokens (70–700 ms), and three curves per mode. Productive is named as the mode for "rendering data tables and visualizations". The best dashboard-first motion spec.
- [Material 3 motion tokens (material-web source)](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss): 16 duration steps (50–1000 ms) and 10 easing tokens. In this token version `easing-standard` and `easing-emphasized` are the same curve, `cubic-bezier(0.2, 0, 0, 1)`; the older `(0.4, 0, 0.2, 1)` survives only as `easing-legacy`. Our "standard" is Carbon's productive curve, not M3's.
- [NN/g, Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/): "roughly 100 ms" for simple feedback, 200–300 ms for large screen changes such as a modal, 100–500 ms overall, "at 500ms, animations start to feel like a real drag", ease-out by default, "the more frequent the animation, the more subtle and shorter".
- [Apple WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): springs described by damping and response, not duration; constant redirection and interruption; start at 100% damping (no overshoot) and reward a gesture's momentum with a little overshoot (80% in the Now Playing example).
- [Emil Kowalski, You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): frequency is the deciding factor; keyboard-initiated actions: "You should never animate them"; "UI animations should generally stay under 300ms"; a 180 ms dropdown feels more responsive than a 400 ms one.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): CSS before WAAPI before JS libraries; compositor-only properties; "Animations are cancelable by user input"; never `transition: all`.

## Bad references
- Template "stat card" kits (for example [Framer stat-reveal components](https://www.framer.com/community/marketplace/components/stat-reveal/)) that count every KPI up from zero and slide cards in on each view. The motion is the same whatever the data says, so it carries no information and delays reading by around a second.
- Marketing-site motion pasted into apps: long staggered fades of 600–1200 ms on dashboard tiles. That is past NN/g's 500 ms "real drag" point and past the 300 ms stagger cap below.

## Accessibility
- Respect `prefers-reduced-motion`, which is Baseline widely available (newly available January 2020): drop spatial movement, keep colour and opacity feedback (see `motion-reduced-motion.md`).
- Anything that starts automatically, moves for more than 5 s and sits alongside other content needs a pause, stop or hide control (WCAG 2.2.2, Level A).
- Never flash more than 3 times per second (WCAG 2.3.1).
- Make the final state the default state, so disabling animation never leaves content at `opacity: 0`.

## Motion / interaction (if relevant)
- Under 100 ms between input and first visual response, whatever the animation length (see `prog-perceived-performance-thresholds.md`).
- When interrupted, retarget from the current value. With springs, preserve velocity: Motion's `visualDuration` springs inherit the velocity of the animation they interrupt.

## Tokens and values
Rows marked † are in `assets/tokens.css`; the others are values this file adds and that are not yet tokens there.

| Token | Value | Use |
|---|---|---|
| `--motion-dur-instant` | 0 ms | keyboard-driven changes, reduced motion (not in tokens.css; write `0ms`) |
| `--motion-dur-micro` † | 100 ms | hover, press, toggle, colour change (Carbon fast-01/02: 70/110 ms) |
| `--motion-dur-short` † | 150 ms | tooltip, dropdown, row expand, reduced-motion fade (Carbon moderate-01) |
| `--motion-dur-medium` † | 240 ms | dialog, drawer, toast (Carbon moderate-02) |
| `--motion-dur-long` † | 400 ms | large panel, one chart re-layout stage (Carbon slow-01) |
| `--motion-dur-data` | 600–900 ms total | staged chart transitions only (SKILL.md "staged data"; not in tokens.css) |
| `--motion-ease-standard` † | `cubic-bezier(0.2, 0, 0.38, 0.9)` | on-screen moves (Carbon productive standard) |
| `--motion-ease-enter` † | `cubic-bezier(0, 0, 0.38, 0.9)` | entering, settling (Carbon productive entrance) |
| `--motion-ease-exit` † | `cubic-bezier(0.2, 0, 1, 0.9)` | leaving permanently (Carbon productive exit) |
| `--motion-ease-emphasized` † | `cubic-bezier(0.2, 0, 0, 1)` | rare, important moments (M3 emphasized) |
| `--motion-ease-spring` | `linear()` sample of a critically damped spring, below | drag release, sheet snap |
| spring in JS (Motion) | bounce 0, visualDuration 0.3 s | drag release, sheet snap |
| exit / enter ratio | 0.75 (house rule) | 240 → 180 ms, 150 → 110 ms |
| stagger per item | 20–40 ms, max total 300 ms (house rule) | list or bar entry |

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
  /* Critically damped spring x(t) = 1 − (1 + ωt)·e^(−ωt), ωT = 6.6, sampled for linear() (same value as tokens.css).
     linear() is Baseline widely available since June 2026 (newly available December 2023: Chrome 113, Firefox 112, Safari 17.2). */
  --motion-ease-spring: linear(0, 0.044 5%, 0.142 10%, 0.261 15%, 0.380 20%, 0.589 30%, 0.740 40%, 0.841 50%, 0.905 60%, 0.968 80%, 1);
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
Support and fallback: `@starting-style` and `transition-behavior: allow-discrete` (the `display … allow-discrete` line) are Baseline newly available since August 2024 (Chrome 117, Firefox 129, Safari 17.5). Firefox supports both but does not transition `display` with `allow-discrete` (MDN browser-compat-data marks Firefox 129 as a partial implementation, [bug 1882408](https://bugzil.la/1882408)), so in Firefox the entry animates and the exit snaps. Older browsers ignore both, so the panel simply appears and disappears without the entry or exit animation, which is an acceptable fallback because the final state is the default state. Individual `translate`/`scale`/`rotate` properties are Baseline widely available (newly available August 2022).

## Checklist
- [ ] Every animation has a stated purpose: continuity, feedback, orientation or attention.
- [ ] No raw ms or `cubic-bezier` values outside the token file.
- [ ] Every duration is one of 0 / 100 / 150 / 240 / 400 ms, or 600–900 ms total for a staged data transition; no other values.
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
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- https://github.com/mdn/browser-compat-data/blob/main/css/properties/transition-behavior.json (Firefox 129 partial: no `display` transition)
