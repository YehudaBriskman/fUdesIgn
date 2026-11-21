# Enter and exit: `@starting-style`, `allow-discrete` and the top layer

> Animate dialogs, popovers and menus in and out with CSS transitions (not keyframes), with `@starting-style` for the entry state and `display`/`overlay` with `transition-behavior: allow-discrete` for the exit. Start from opacity 0 plus scale 0.95–0.97 or a translate of 8–24 px, never from `scale(0)`, and make the final, visible state the default.

**Category:** Transitions · **Applies to:** `<dialog>`, `[popover]`, menus, tooltips, select lists, toasts, any element toggled with `display: none` or `hidden` · **Priority:** must

## When to use / when not
Use for every element that appears and disappears. Prefer the platform: `<dialog>` and the Popover API give you the top layer, light dismiss and focus handling, and CSS can now animate both directions. Reach for JS (Motion's `AnimatePresence`, WAAPI) only when the exit depends on data (which item was removed) or needs a spring with velocity. Which overlay to use at all is decided in dashboard-ui's `comp-overlay-choice.md`.

## Rules (do)
- **Transitions, not keyframes.** A transition retargets from where it is when the state flips back (open → close mid-way); a keyframe animation restarts from its first frame. Emil Kowalski's review rule treats keyframes on toggled UI as a defect for this reason.
- **Entry with `@starting-style`.** Write the open state as the normal rule, and the "before open" values in `@starting-style` placed after it. Without it, an element going from `display: none` to shown has no previous style to transition from.
- **Exit with `allow-discrete`.** Transition `display` (and `overlay` for top-layer elements) with `allow-discrete`, so the element stays rendered and in the top layer until the exit finishes. Use the same duration as the other exit properties.
- **Never from `scale(0)`.** Real objects don't grow out of nothing. Start at 0.95–0.97 with opacity 0 (house token 0.96). A tooltip can start at 0.97 or use opacity alone.
- **Small travel.** A translate entry moves 8–24 px, not from off-screen, unless the element is a sheet or drawer attached to that edge (then it travels its full size; see `mgesture-sheets-and-swipe-to-dismiss.md`).
- **Grow from the trigger.** Set `transform-origin` to the side nearest the trigger (see `mtrans-spatial-origin-and-continuity.md`). Modals centred on the screen scale from the centre.
- **Backdrop separately.** `::backdrop` needs its own `@starting-style` block and exit transition; fade it with `linear` over the same duration as the panel.
- **Asymmetric timing.** Enter 150 ms (menus) or 240 ms (dialogs) with `--motion-ease-enter`; exit at about 0.75 of that with `--motion-ease-exit` or a plain fade.
- **Final state is the default.** If `@starting-style` or `allow-discrete` isn't supported, the element simply appears and disappears, which is acceptable.
- **Know the gaps.** `@starting-style` and `transition-behavior` are Baseline newly available since August 2024 (Chrome 117, Firefox 129, Safari 17.5). Firefox doesn't transition `display` with `allow-discrete` (MDN browser-compat-data marks Firefox's `transition-behavior` as partial; [bug 1882408](https://bugzil.la/1882408)), so exits snap there; entries work. The `overlay` property is Chromium-only. Treat exits as an enhancement.

## Anti-patterns (don't)
- `transform: scale(0)` → `scale(1)` popovers: the content is unreadable for most of the animation and the motion feels cartoonish.
- `@keyframes` for open and close, so a quick open-then-close jumps.
- Hiding with `opacity: 0` and `pointer-events: none` but leaving the element in the accessibility tree and tab order. Use `display: none`, `hidden`, `[popover]` or `<dialog>`.
- A JS `setTimeout(…, 300)` before removing an element, which drifts from the CSS duration and breaks under reduced motion.
- A menu that fades in over 300 ms but closes instantly, so the user never sees where it went.
- Animating a dialog's `width`/`height` to open it.

## Good references
- [MDN, Animating popovers](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#animating_popovers): the full recipe with `:popover-open`, `@starting-style`, `overlay` and `display` with `allow-discrete`.
- [MDN, Animating dialogs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#animating_dialogs): the same for `dialog:open` and `::backdrop`.
- [Chrome for Developers, Four new CSS features for smooth entry and exit animations](https://developer.chrome.com/blog/entry-exit-animations): why discrete properties needed `allow-discrete` and `overlay`.
- [Emil Kowalski, Great animations](https://emilkowal.ski/ui/great-animations): don't start from `scale(0)`, keep animations interruptible.
- [Radix UI / shadcn popovers](https://www.radix-ui.com/primitives/docs/components/popover): expose `--radix-popover-content-transform-origin` so content scales from its trigger; data-state attributes drive enter/exit.

## Bad references
- Many tooltip libraries' "grow" preset that scales from 0 at the centre of the tooltip: the tooltip appears to come from nowhere and the text is illegible for most of the duration.
- Older jQuery-era modals that slide down from the top of the window over 400–600 ms, regardless of where the trigger was.

## Accessibility
- Focus moves into a modal dialog when it opens (the platform does this for `showModal()`), and returns to the trigger when it closes. Don't delay focus until the animation ends.
- Under reduced motion drop the scale and translate; keep a 150 ms fade.
- `aria-expanded` on the trigger flips at the start of the transition, not the end.

## Motion / interaction (if relevant)
Opening and closing must be interruptible: clicking the trigger twice fast reverses from the current state. CSS transitions do this for free.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-scale-from` | 0.96 | entry scale (range 0.95–0.97) |
| `--motion-distance-sm` | 8 px | menus, toasts |
| `--motion-distance-md` | 16 px | dialogs |
| `--motion-distance-lg` | 24 px | cap for in-place entries |
| menu enter / exit | 150 / 110 ms | `--motion-dur-short` × 1 / × 0.75 |
| dialog enter / exit | 240 / 180 ms | `--motion-dur-medium` × 1 / × 0.75 |

## Implementation sketch
```css
[popover].menu {
  /* closed state = exit end state */
  opacity: 0;
  scale: var(--motion-scale-from);
  transform-origin: var(--menu-origin, top left);
  transition:
    opacity calc(var(--motion-dur-short) * 0.75) linear,
    scale calc(var(--motion-dur-short) * 0.75) var(--motion-ease-exit),
    overlay calc(var(--motion-dur-short) * 0.75) allow-discrete,
    display calc(var(--motion-dur-short) * 0.75) allow-discrete;
}
[popover].menu:popover-open {
  opacity: 1;
  scale: 1;
  transition-duration: var(--motion-dur-short);
  transition-timing-function: linear, var(--motion-ease-enter);
}
@starting-style {
  [popover].menu:popover-open { opacity: 0; scale: var(--motion-scale-from); }
}

dialog {
  opacity: 0;
  translate: 0 var(--motion-distance-md);
  transition:
    opacity 180ms linear,
    translate 180ms var(--motion-ease-exit),
    overlay 180ms allow-discrete,
    display 180ms allow-discrete;
}
dialog[open] { opacity: 1; translate: 0 0; transition-duration: var(--motion-dur-medium); }
@starting-style { dialog[open] { opacity: 0; translate: 0 var(--motion-distance-md); } }

dialog::backdrop {
  background: rgb(0 0 0 / 0);
  transition: background-color 180ms linear, overlay 180ms allow-discrete, display 180ms allow-discrete;
}
dialog[open]::backdrop { background: rgb(0 0 0 / 0.4); }
@starting-style { dialog[open]::backdrop { background: rgb(0 0 0 / 0); } }

@media (prefers-reduced-motion: reduce) {
  [popover].menu, dialog { scale: none; translate: none; }
}
```
```ts
// Remove an element after its exit transition, without guessing a timeout.
export async function closeAndRemove(el: HTMLElement): Promise<void> {
  el.hidePopover();
  await Promise.allSettled(el.getAnimations().map((a) => a.finished));
  el.remove();
}
```

## Checklist
- [ ] Toggled UI uses transitions, not keyframes.
- [ ] Entry state is in `@starting-style`; exit transitions `display` (and `overlay` for top layer) with `allow-discrete`.
- [ ] No `scale(0)`; entry scale is 0.95–0.97 or opacity only.
- [ ] `transform-origin` points at the trigger (centre for centred modals).
- [ ] `::backdrop` has its own entry and exit.
- [ ] Exit is shorter than entry; reduced motion keeps only the fade.
- [ ] Without support, the element still appears and disappears correctly.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- https://developer.mozilla.org/en-US/docs/Web/CSS/overlay
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#animating_popovers
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#animating_dialogs
- https://developer.chrome.com/blog/entry-exit-animations
- https://webstatus.dev/features/overlay
- https://emilkowal.ski/ui/great-animations
- https://www.radix-ui.com/primitives/docs/components/popover
