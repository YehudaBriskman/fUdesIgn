# Micro-interactions: buttons, toggles and toasts

> Buttons press to scale 0.97 on pointer-down in 100 ms and confirm results on themselves; toggles move their thumb with a bounce-0 spring and change colour at the same time; toasts enter from their edge in about 240 ms, stack with a 0.05 scale step, pause while hovered, can be swiped away, and never carry information that exists nowhere else.

**Category:** Transitions · **Applies to:** buttons and icon buttons, switches, checkboxes, segmented controls, like/favourite buttons, copy buttons, toasts and snackbars · **Priority:** should

## When to use / when not
Use for the small, frequent responses that make an interface feel alive. Because they're frequent, they stay short and quiet (`mfound-purpose-and-frequency.md`). dashboard-ui's `motion-micro-interactions.md` defines the full state model (hover, focus, pressed, selected, disabled, state-layer opacities); this file adds the product-UI motion details and toasts.

## Rules (do)
- **Press on pointer-down.** `:active` scales to 0.97 (Emil Kowalski's value) in `--motion-dur-micro` 100 ms with `--motion-ease-enter`; release returns at the same speed. Never scale below 0.95; never move the button's position.
- **Hover only where hover exists.** Gate hover effects with `@media (hover: hover) and (pointer: fine)` so touch devices don't get sticky hover states.
- **Confirm on the control.** A copy button swaps its icon to a check for about 1.5–2 s; a save button shows "Saved" in place. One message in place beats a toast (Raphael Salaja's "restraint": no toast when the screen already shows the result).
- **Icon swaps cross-fade with a small scale** (0.8 → 1 and opacity), 150 ms; blurring by 2 px during the swap hides imperfect overlaps (Emil Kowalski).
- **Toggles.**
  - Thumb moves with `spring-fast` (0.24 s, bounce 0) or `--motion-dur-short` 150 ms ease; track colour changes in the same time.
  - The state is shown by fill and position and a label or `aria-checked`, never position alone.
  - Optimistic: flip immediately; roll back visibly if the request fails.
- **Like / favourite.** A single small scale pop (1 → 1.15 → 1, ≤ 300 ms) only on the *on* transition; nothing on off. This is a rare-delight budget only if the action is occasional.
- **Toasts.**
  - Enter from the screen edge they live on, 240 ms ease-out or a spring; exit faster, the same way (Sonner uses CSS transitions, not keyframes, so they can be interrupted).
  - Stack: older toasts move back 14 px and shrink by 0.05 scale per step (Sonner: −14 px / 0.95, −28 px / 0.9); expand the stack on hover.
  - Timing follows dashboard-ui's `comp-notifications-alerts.md`: auto-dismiss is off by default; when on, at least 6 s for a plain confirmation and 8 s (10 s bulk) for an Undo, paused while hovered, focused or the tab is hidden. Errors never auto-dismiss, and a toast's action is also reachable outside it (WCAG 2.2.1 Timing Adjustable).
  - Swipe to dismiss in the exit direction (`mgesture-sheets-and-swipe-to-dismiss.md`).
  - Announce with a polite live region; never put the only copy of an error in a toast.
- **Loading buttons keep their size and label**, add a spinner after the 200 ms show-delay and keep it at least 400 ms, and use `aria-disabled` while busy (dashboard-ui's `comp-button-hierarchy.md`; form submit buttons go busy at once, per forms-ui's `fflow-submit-buttons-and-double-submit.md`).

## Anti-patterns (don't)
- Buttons that bounce, wobble or grow on hover.
- Press scale of 0.9 or less (looks broken) or press feedback only on release.
- Hover transforms on touch devices.
- Toggles animating their thumb with a bouncy spring, or only changing position with no colour change.
- Toasts that slide in from the top-left corner while the app's toasts normally live bottom-right.
- A success toast after an action whose result is already visible on screen.
- Auto-dismissing error toasts, or Undo toasts shorter than 8 s whose action exists nowhere else.

## Good references
- [Emil Kowalski, 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): `scale(0.97)` on `:active`, tooltip timing, blur to mask cross-fades.
- [Sonner](https://sonner.emilkowal.ski/) and [Building a toast component](https://emilkowal.ski/ui/building-a-toast-component): stacking offsets, 4 s timer paused on hover and hidden tab, swipe velocity, interruptible transitions.
- [raphaelsalaja/skills](https://github.com/raphaelsalaja/skills): restraint rules (no redundant feedback toast).
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): loading buttons keep their label; show-delay and minimum visible time.
- [Material 3, switch](https://m3.material.io/components/switch/overview) and [snackbar](https://m3.material.io/components/snackbar/overview): thumb and track, one snackbar at a time, action placement.
- [MDN, `@media (hover)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover): gating hover effects.

## Bad references
- Toast libraries that auto-dismiss everything after 3 s, including errors and undo actions (conflicts with WCAG 2.2.1).
- "Animated button" collections with 300–600 ms ripple, glow and bounce effects on every click: decoration on the most frequent interaction in the app.

## Accessibility
- Toasts: `role="status"` (polite) for confirmations, `role="alert"` only for urgent errors; dismiss button reachable by keyboard; timers paused on focus.
- Switches use `role="switch"` with `aria-checked`, or a native checkbox styled as a switch.
- Reduced motion: keep colour and opacity feedback; drop the press scale, thumb travel can stay (it's tiny) but without overshoot; toasts fade in place.

## Motion / interaction (if relevant)
All of these are CSS transitions so rapid toggling reverses smoothly (`mgesture-interruptibility-and-velocity.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| press scale | 0.97 | `:active` |
| press duration | `--motion-dur-micro` 100 ms | |
| icon swap | 150 ms, scale 0.8 → 1, blur 2 px → 0 | copy → check |
| confirmation hold | 1.5–2 s | in-place "Copied" |
| toggle thumb | `spring-fast` or 150 ms | |
| toast enter / exit | 240 / 180 ms | exit = 0.75 × enter |
| toast stack step | −14 px, scale −0.05 | Sonner |
| toast timer | off by default; ≥ 6 s plain, 8 s with Undo; paused on hover/focus/hidden | never on errors |

## Implementation sketch
```css
.button {
  transition: scale var(--motion-dur-micro) var(--motion-ease-enter), background-color var(--motion-dur-micro) linear;
  &:active { scale: 0.97; }
  @media (hover: hover) and (pointer: fine) {
    &:hover { background-color: var(--hover, color-mix(in oklch, currentColor 8%, transparent)); }
  }
  @media (prefers-reduced-motion: reduce) { &:active { scale: none; } }
}

.icon-swap > * {
  transition: opacity 150ms linear, scale 150ms var(--motion-ease-enter), filter 150ms linear;
}
.icon-swap > [data-hidden] { opacity: 0; scale: 0.8; filter: blur(2px); }

.toast {
  --i: 0;
  translate: 0 calc(var(--i) * -14px);
  scale: calc(1 - var(--i) * 0.05);
  transition: translate 240ms var(--motion-ease-enter), scale 240ms var(--motion-ease-enter), opacity 240ms linear;
  @starting-style { translate: 0 100%; opacity: 0; }
}
.toaster:hover .toast { scale: 1; translate: 0 calc(var(--i) * -100% - var(--i) * 8px); }
```
```ts
// A toast timer that pauses on hover, focus and hidden tabs.
export function toastTimer(el: HTMLElement, ms: number, onDone: () => void): () => void {
  let remaining = ms;
  let started = 0;
  let id: number | undefined;
  const start = () => { started = performance.now(); id = window.setTimeout(onDone, remaining); };
  const pause = () => { if (id === undefined) return; clearTimeout(id); id = undefined; remaining -= performance.now() - started; };
  const onVisibility = () => (document.hidden ? pause() : start());
  el.addEventListener('pointerenter', pause);
  el.addEventListener('pointerleave', start);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', onVisibility);
  start();
  return () => {
    pause();
    el.removeEventListener('pointerenter', pause);
    el.removeEventListener('pointerleave', start);
    el.removeEventListener('focusin', pause);
    el.removeEventListener('focusout', start);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
```

## Checklist
- [ ] Press feedback on pointer-down: scale 0.97 in 100 ms, no movement.
- [ ] Hover effects gated to hover-capable pointers.
- [ ] Results confirmed on the control when visible there; no redundant toast.
- [ ] Toggles change colour and position together, no bounce, with an accessible state.
- [ ] Toasts enter from their edge, stack, pause on hover/focus/hidden, and swipe away.
- [ ] Error toasts don't auto-dismiss, Undo toasts last at least 8 s, and nothing exists only in a toast.

## Sources
- https://emilkowal.ski/ui/7-practical-animation-tips
- https://emilkowal.ski/ui/building-a-toast-component
- https://sonner.emilkowal.ski/
- https://github.com/raphaelsalaja/skills
- https://vercel.com/design/guidelines
- https://m3.material.io/components/switch/overview
- https://m3.material.io/components/snackbar/overview
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
