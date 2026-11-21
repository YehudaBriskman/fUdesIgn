# Motion anti-patterns, with good and bad references

> Refuse these by default: `transition: all`, `scale(0)` entrances, `ease-in` on entrances, keyframes on toggled UI, animation on keyboard actions, motion over 400 ms in UI chrome, bounce on chrome or data, fade-up-on-scroll everywhere, scroll-jacking and parallax, dead-stop gestures, motion without a reduced variant, and layout properties animated per frame. Each one has a named fix below.

**Category:** Review · **Applies to:** design and code review, agent self-checks, linting rules for CSS and animation code · **Priority:** must

## When to use / when not
Use as the quick pass before the full rubric (`mref-motion-review-rubric.md`) and as a source of lint rules. Each row says how to spot the problem, why it's wrong and the fix, with the pattern that has the detail.

## Rules (do)
| # | Anti-pattern | Spot it | Why it's wrong | Fix |
|---|---|---|---|---|
| A1 | `transition: all` | grep CSS | animates layout and paint you didn't intend; weak default curve | list properties (`mfound-durations-and-easing.md`) |
| A2 | Entering from `scale(0)` | keyframes / `@starting-style` | nothing in the real world appears from nothing; unreadable for most of the animation | opacity 0 + scale 0.95–0.97 (`mtrans-enter-exit-top-layer.md`) |
| A3 | `ease-in` on entrances | audit easing | slow start reads as lag | `--motion-ease-enter` |
| A4 | `@keyframes` for open/close of toggled UI | open then close quickly | restarts from frame 0, jumps | CSS transitions or springs (`mgesture-interruptibility-and-velocity.md`) |
| A5 | Animating keyboard-triggered or 100+/day actions | trigger by shortcut | the fastest path becomes the slowest | 0 ms (`mfound-purpose-and-frequency.md`) |
| A6 | UI chrome > 400 ms | audit durations | past NN/g's "real drag" point | token durations |
| A7 | Bounce on chrome, opacity or data values | frames show overshoot | wobble on menus; overshooting data shows values that don't exist | bounce 0 (`mspring-parameters-and-mapping.md`) |
| A8 | Fade-up-on-scroll on every section, every visit | scroll a page twice | delays reading, replays, a generated-UI tell | static content; reveal at most once, from ≥ 0.4 opacity (`mtrans-scroll-driven-animations.md`) |
| A9 | Parallax, scroll-jacking, full-viewport zoom | scroll and navigate | vestibular triggers; takes control from the user | remove (`mfound-reduced-motion-vestibular.md`) |
| A10 | Hard stop at drag limits | drag past an edge | feels frozen | rubber-band (`mgesture-rubber-banding-and-bounds.md`) |
| A11 | Snap to the nearest point, ignoring velocity | flick a sheet | flicks bounce back | projection + velocity (`mgesture-momentum-projection-and-snap.md`) |
| A12 | Transition left on while dragging | slow drag frames | element trails the finger | `transition: none` during drag (`mgesture-direct-manipulation-drag.md`) |
| A13 | No reduced-motion variant, or a global `0.01ms` kill switch | emulate `reduce` | either nauseating or loses useful fades; JS motion untouched | substitute per effect |
| A14 | Width/height/top/left animated on large elements | Performance panel | layout every frame, jank | transforms, FLIP, View Transitions (`mperf-compositor-will-change-and-inp.md`) |
| A15 | Global `will-change` | grep CSS | memory, can slow the page | set temporarily, measure first |
| A16 | Popovers scaling from their centre | frames | appear from mid-air | origin at the trigger (`mtrans-spatial-origin-and-continuity.md`) |
| A17 | Same slide for forward and back | navigate back | spatial model breaks | direction by transition type (`mtrans-view-transitions-and-routes.md`) |
| A18 | Staggered lists with no cap | load a long list | last items arrive seconds late | ≤ 300 ms total (`mfound-choreography-and-stagger.md`) |
| A19 | Toasts that auto-dismiss errors, or Undo in under 8 s | wait 8 s | information and actions lost | errors persist; Undo ≥ 8 s and also reachable elsewhere (`mtrans-micro-interactions.md`) |
| A20 | Loading masked by a long entrance | throttle network | animation pretends to be speed | real loading states (dashboard-ui `prog-loading-states.md`) |

## Anti-patterns (don't)
The table above is the list. Two meta-anti-patterns:
- Adding motion because the brief said "make it feel premium" with no named job for each animation.
- Fixing one instance and not adding a lint rule or token, so it returns.

## Good references
- [Linear](https://linear.app/): near-zero motion on keyboard paths, short fades on menus, fast command palette.
- [Vaul](https://vaul.emilkowal.ski/) and [Sonner](https://sonner.emilkowal.ski/): sheet and toast motion that tracks the finger, uses velocity, stacks and can be interrupted.
- [Apple, WWDC18 Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): the reference for gesture-driven motion (1:1 tracking, projection, interruption, rubber-banding).
- [Material 3 motion](https://m3.material.io/styles/motion/overview/how-it-works) and [its Compose tokens](https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens): a coherent spring system with spatial vs effects springs.
- [Emil Kowalski, Great animations](https://emilkowal.ski/ui/great-animations) and [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): the reasoning behind A1–A5.
- [Vercel Web Interface Guidelines, animation](https://vercel.com/design/guidelines): compositor-only properties, no `transition: all`, animations cancelable by user input.

## Bad references
- The iOS 7 launch's parallax wallpaper and zooming app transitions, which made some users motion sick and led to the Reduce Motion setting (A9; see Val Head's [A List Apart article](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/)).
- `max-height: 0 → 1000px` accordion snippets common in tutorials (A14, and the timing is wrong because the curve spans 1000 px).
- Scroll-jacked product launch pages that scrub a video with the wheel (A9).
- [Material 3 Expressive research](https://design.google/library/expressive-material-design-google-research): its own caveat that breaking familiar patterns for expressiveness hurt usability is a warning against A5–A8 dressed up as brand.

## Accessibility
A9 and A13 are accessibility failures (WCAG 2.3.3 at AAA; vestibular safety); A19 conflicts with WCAG 2.2.1 Timing Adjustable.

## Motion / interaction (if relevant)
Most rows can be linted: A1, A2, A3, A13 (global reset), A14 and A15 are greppable in CSS; A4–A6 and A16 show up in the in-page audit in `mref-motion-review-rubric.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| entry scale floor | 0.95 | A2 |
| UI chrome max | 400 ms | A6 |
| stagger cap | 300 ms (150 ms menus) | A18 |
| reveal opacity floor | 0.4 | A8 |
| toast timer | off by default; ≥ 6 s plain, 8 s with Undo, never on errors | A19 |

## Implementation sketch
A minimal lint pass over CSS text for the greppable rows:
```ts
export interface LintHit { rule: string; line: number; text: string }

const RULES: ReadonlyArray<[string, RegExp]> = [
  ['A1 transition: all', /transition(-property)?\s*:\s*all\b/],
  ['A2 scale(0)', /scale\(\s*0\s*\)|\bscale\s*:\s*0\s*[;}]/],
  ['A3 ease-in', /\bease-in\b(?!-out)/],
  ['A13 global reduced-motion kill switch', /animation-duration\s*:\s*0?\.01ms\s*!important/],
  ['A14 animated layout property', /transition(-property)?\s*:[^;]*\b(width|height|top|left|margin|padding)\b/],
  ['A15 global will-change', /^\s*(\*|html|body)\s*\{[^}]*will-change/],
];

export function lintMotionCss(css: string): LintHit[] {
  const hits: LintHit[] = [];
  css.split('\n').forEach((text, i) => {
    for (const [rule, re] of RULES) if (re.test(text)) hits.push({ rule, line: i + 1, text: text.trim() });
  });
  return hits;
}
```
```css
/* Good defaults that avoid A1–A3 in one place. */
.overlay {
  transform-origin: var(--popover-origin, top left);
  transition:
    opacity var(--motion-dur-short) linear,
    scale var(--motion-dur-short) var(--motion-ease-enter);
}
```

## Checklist
- [ ] None of A1–A20 present, or each exception has a written reason.
- [ ] Greppable rows are covered by a lint rule in the project.
- [ ] The in-page audit shows no A2–A6 or A16 hits.
- [ ] Reduced-motion and drag behaviour checked by capture, not by reading code.

## Sources
- https://emilkowal.ski/ui/great-animations
- https://emilkowal.ski/ui/you-dont-need-animations
- https://emilkowal.ski/ui/7-practical-animation-tips
- https://vercel.com/design/guidelines
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://m3.material.io/styles/motion/overview/how-it-works
- https://design.google/library/expressive-material-design-google-research
- https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- https://www.nngroup.com/articles/animation-duration/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://vaul.emilkowal.ski/
- https://sonner.emilkowal.ski/
- https://linear.app/
