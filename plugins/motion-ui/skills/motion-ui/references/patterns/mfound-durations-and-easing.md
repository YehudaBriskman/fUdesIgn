# Durations and easing by element and direction

> Pick the duration from the element's size and travel (press 100 ms, menu 150 ms, dialog or sheet 240 ms, large surface 400 ms, nothing in UI chrome above 400 ms), ease out on enter, ease in only on a permanent exit, ease in-out for on-screen moves, never `ease-in` for anything the user is waiting for, and make the exit shorter than the enter.

**Category:** Motion foundations · **Applies to:** CSS transitions and keyframes, WAAPI, Motion/Framer Motion tweens, any non-spring animation in product UI · **Priority:** must

## When to use / when not
Use for every time-based (tween) animation. For anything a finger or pointer drives, or that can be interrupted mid-flight with velocity, use a spring instead (`mspring-parameters-and-mapping.md`). Dashboard data transitions (chart re-layouts, number tweens) have their own longer bands in dashboard-ui's `motion-chart-transitions.md` and `motion-number-tweening.md`.

## Rules (do)
- **Duration by element.** These bands combine Emil Kowalski's per-element table with Carbon's productive steps and NN/g's 100–500 ms range; the token is the house choice inside each band.

  | Element | Band | Token |
  |---|---|---|
  | Button press, toggle, checkbox, hover colour | 100–160 ms | `--motion-dur-micro` 100 ms |
  | Tooltip, dropdown, menu, popover, select | 125–250 ms | `--motion-dur-short` 150 ms |
  | Dialog, sheet, drawer, toast, route cross-fade | 200–300 ms | `--motion-dur-medium` 240 ms |
  | Full-screen or large panel, shared-element morph | 300–400 ms | `--motion-dur-long` 400 ms |
  | Rare expressive moment | up to 600 ms | none; write it inline with a comment |

  NN/g: around 100 ms for simple feedback, 200–300 ms for large changes, and "at 500 ms, animations start to feel like a real drag".
- **Scale with distance.** Material's guidance and Rauno both tie duration to how far something travels and how big it is: a 24 px nudge and a full-height sheet are not the same token. Small trigger, short motion.
- **Exit faster than enter.** Exit = about 0.75 × enter (240 → 180 ms, 150 → 110 ms). People wait for an entrance; they've already moved on during an exit. The ratio is a house rule, and 0.75 to 0.8 is an accepted band (the token stays 0.75; no source fixes either number); Material's "accelerate" exit tokens are also shorter than their "decelerate" enters.
- **Easing by direction.**

  | Situation | Curve | Token |
  |---|---|---|
  | Entering, appearing, settling, responding to input | ease-out | `--motion-ease-enter` `cubic-bezier(0, 0, 0.38, 0.9)` |
  | Leaving for good (dismissed, deleted) | ease-in | `--motion-ease-exit` `cubic-bezier(0.2, 0, 1, 0.9)` |
  | Moving from one on-screen place to another | ease-in-out | `--motion-ease-standard` `cubic-bezier(0.2, 0, 0.38, 0.9)` |
  | Rare, important arrival | emphasized | `--motion-ease-emphasized` `cubic-bezier(0.2, 0, 0, 1)` (M3) |
  | Sheets and drawers that should feel like iOS | strong ease-out | `--motion-ease-drawer` `cubic-bezier(0.32, 0.72, 0, 1)` (used by Vaul and Ionic for iOS-style sheets) |
  | Opacity cross-fade, progress, spinners | linear | `linear` |

- **Never `ease-in` on something the user is waiting for.** It starts slowly, so the first frames look like lag (Emil Kowalski). An exit is the only place ease-in belongs, and even there a short ease-out is usually fine.
- **Prefer custom curves over the CSS keywords.** `ease`, `ease-in-out` and `ease-out` keywords are weak; the built-in `ease-out` is `cubic-bezier(0, 0, 0.58, 1)`, which feels mushy next to a stronger curve with a fast start.
- **Use tokens only.** Components never contain raw `ms` or `cubic-bezier()` values; the token file is the single place to tune.
- **Match the curve to the property.** Opacity uses `linear` or a mild ease-out; an overshooting curve on opacity clamps at 1 and reads as a stall, not a bounce.
- **Same duration and curve for things that move together** (Gestalt common fate). If a dialog scales and its backdrop fades, they share the duration; the backdrop may use `linear`.

## Anti-patterns (don't)
- `transition: all 0.3s ease`: animates layout and paint properties you didn't intend, with the weakest keyword curve.
- `ease-in` on a menu or dialog entrance: feels slow to start.
- Equal enter and exit durations on a toast or menu, so dismissal drags.
- A 600–1000 ms entrance on UI chrome.
- Bouncy `cubic-bezier` overshoot (y > 1) on opacity or colour.
- Per-component magic numbers (`217ms`, `cubic-bezier(.4,.1,.3,1.1)`) that drift from the system.

## Good references
- [IBM Carbon, motion](https://carbondesignsystem.com/elements/motion/overview/): productive vs expressive curves, entrance vs exit vs standard, duration steps 70–700 ms.
- [Material 3 easing and duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs): emphasized `cubic-bezier(0.2, 0, 0, 1)`, emphasized decelerate `(0.05, 0.7, 0.1, 1)` for enters, emphasized accelerate `(0.3, 0, 0.8, 0.15)` for exits, and duration steps short1 50 ms to extra-long4 1000 ms.
- [Emil Kowalski, Great animations](https://emilkowal.ski/ui/great-animations): fast start, ease-out for UI, under 300 ms, interruptible.
- [Vaul drawer](https://vaul.emilkowal.ski/): iOS-like sheet curve `cubic-bezier(0.32, 0.72, 0, 1)` at 500 ms for a full-height sheet.
- [NN/g, animation duration](https://www.nngroup.com/articles/animation-duration/): the 100 ms / 200–300 ms / 500 ms anchors.
- [easings.net](https://easings.net/) and the Chrome DevTools easing editor: compare curves visually before choosing.

## Bad references
- Many component libraries' default `transition: all 0.3s ease` on buttons and cards (for example older Bootstrap-era themes): every property, keyword curve, same duration for press and panel.
- Marketing-site templates that use 800 ms `ease-in-out` fades for in-app modals: past NN/g's "real drag" point, and the slow start reads as lag.

## Accessibility
- Under `prefers-reduced-motion: reduce`, keep the duration for opacity and colour but drop translate and scale (see `mfound-reduced-motion-vestibular.md`).
- Long or slow movement across large distances is a vestibular trigger; prefer short travel (≤ 24 px for in-place entrances).

## Motion / interaction (if relevant)
Tweens are not interruptible with velocity. If the user can reverse the action mid-way (open, then immediately close), use a CSS transition (which retargets from its current value) rather than `@keyframes` (which restarts), or use a spring.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-dur-micro` | 100 ms | press, toggle, hover colour |
| `--motion-dur-short` | 150 ms | menus, tooltips, popovers |
| `--motion-dur-medium` | 240 ms | dialogs, sheets, toasts |
| `--motion-dur-long` | 400 ms | large surfaces, morphs |
| `--motion-exit-ratio` | 0.75 | exit = enter × 0.75 |
| `--motion-ease-enter` | `cubic-bezier(0, 0, 0.38, 0.9)` | enter, settle |
| `--motion-ease-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | permanent exit |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | on-screen move |
| `--motion-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | rare arrival |
| `--motion-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | iOS-style sheet |

## Implementation sketch
```css
.popover {
  transform-origin: var(--popover-origin, top center);
  transition:
    opacity var(--motion-dur-short) linear,
    scale var(--motion-dur-short) var(--motion-ease-enter);
}
.popover:not(:popover-open) {
  opacity: 0;
  scale: 0.96;
  /* exit is shorter and accelerates away */
  transition-duration: calc(var(--motion-dur-short) * var(--motion-exit-ratio));
  transition-timing-function: linear, var(--motion-ease-exit);
}
```
```ts
// One source of truth for JS tweens (WAAPI) that mirrors the CSS tokens.
export const DURATION = { micro: 100, short: 150, medium: 240, long: 400 } as const;
export const EASE = {
  enter: 'cubic-bezier(0, 0, 0.38, 0.9)',
  exit: 'cubic-bezier(0.2, 0, 1, 0.9)',
  standard: 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
} as const;

export function exitDuration(enterMs: number): number {
  return Math.round(enterMs * 0.75);
}

export function fadeOut(el: HTMLElement, enterMs: number = DURATION.medium): Animation {
  return el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: exitDuration(enterMs), easing: 'linear', fill: 'forwards' });
}
```

## Checklist
- [ ] Each duration is a token from the table; nothing in UI chrome exceeds 400 ms.
- [ ] Enters ease out; on-screen moves ease in-out; no `ease-in` on entrances.
- [ ] Exits are about 0.75 × the enter duration.
- [ ] No `transition: all`; properties are listed.
- [ ] Opacity uses `linear` or ease-out, never an overshooting curve.
- [ ] Things that move together share duration and curve.

## Sources
- https://carbondesignsystem.com/elements/motion/overview/
- https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss
- https://www.nngroup.com/articles/animation-duration/
- https://emilkowal.ski/ui/great-animations
- https://emilkowal.ski/ui/you-dont-need-animations
- https://github.com/emilkowalski/vaul
- https://rauno.me/craft/interaction-design
- https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
- https://developer.mozilla.org/en-US/docs/Web/CSS/transition
