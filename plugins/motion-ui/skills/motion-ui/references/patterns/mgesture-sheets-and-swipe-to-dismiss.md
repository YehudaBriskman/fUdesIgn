# Sheets, drawers and swipe-to-dismiss

> A sheet enters from its own edge and leaves the same way, follows the finger when dragged, closes when released past 25% of its height or faster than about 400 px/s, otherwise springs back to its nearest detent; swipe actions on rows reveal light actions mid-swipe but run destructive ones only on release, with undo.

**Category:** Gestures · **Applies to:** bottom sheets, side drawers, mobile modals, toasts, swipeable list rows, notification cards, image viewers · **Priority:** should

## When to use / when not
Use a sheet for a secondary task that keeps the parent in context, especially on touch. On desktop, a side drawer or dialog is usually better; which overlay to use is decided in dashboard-ui's `comp-overlay-choice.md`. Use swipe-to-dismiss only as a shortcut: every swipe action needs a visible equivalent.

## Rules (do)
- **Enter and leave from the attached edge.** A bottom sheet translates up its own height and back down; it doesn't fade or scale in the middle of the screen (spatial consistency, see `mtrans-spatial-origin-and-continuity.md`). Duration 240–400 ms depending on height (the house ceiling for UI chrome); Vaul uses 500 ms with `cubic-bezier(0.32, 0.72, 0, 1)` for a full-height sheet, a curve Emil Kowalski says comes from Ionic's iOS sheet.
- **Drag from anywhere sensible.** The handle and the sheet header always drag. The content area drags only when it is scrolled to the top; Vaul waits 100 ms after a scroll before allowing a drag, so a scroll's momentum doesn't turn into a dismiss.
- **Dismiss rule.** Release with downward velocity above 0.4 px/ms (400 px/s), or past 25% of the sheet's height, closes it (Vaul's constants). Otherwise it springs back to the detent nearest the projected position (`mgesture-momentum-projection-and-snap.md`).
- **Detents.** 2–3 at most (for example 50% and 100%); the top detent rubber-bands above it (`mgesture-rubber-banding-and-bounds.md`).
- **Parent recedes.** While a modal sheet is open, the page behind dims (scrim) and may scale down slightly (0.94–0.98 with rounded top corners, the iOS "card" look); both track the drag progress, so dragging the sheet down brightens the page continuously.
- **Settle with velocity.** Closing after a flick is a spring that starts at the release velocity (bounce 0.15 at most; Apple's dismiss example used 80% damping). Opening on tap uses bounce 0.
- **Swipe actions on rows.**
  - Reveal actions as the row moves (the action is already visible under the finger).
  - Light, reversible actions (archive, mark read) may commit once a threshold is crossed mid-swipe, with haptic (`moinput-haptics-vibration.md`) or visual confirmation at the threshold; Rauno's rule is that destructive ones (delete, close) wait for release.
  - Delete always has undo (a toast or inline "Undo" for at least 8 s; see dashboard-ui's `prog-optimistic-ui-and-undo.md`).
- **Toast swipe.** A toast can be swiped away in its exit direction; Sonner dismisses above a swipe velocity of 0.11 (px/ms, tuned by trial) and pauses its 4 s timer while hovered or when the tab is hidden.
- **Use `<dialog>` for modal sheets.** You get the top layer, focus trapping and Escape; animate it with the enter/exit recipe in `mtrans-enter-exit-top-layer.md`.

## Anti-patterns (don't)
- A sheet that fades in from the centre and slides out the bottom (enter and exit disagree).
- Dismiss decided by position alone, so a fast flick from near the top bounces back.
- The content scroll turning into a sheet drag mid-scroll.
- Swipe-to-delete with no undo and no visible delete button.
- A scrim that pops in and out instead of tracking the drag.
- Bounce on a sheet opened by a tap.

## Good references
- [Vaul](https://vaul.emilkowal.ski/) and [Emil Kowalski, Building a drawer component](https://emilkowal.ski/ui/building-a-drawer-component): iOS curve and 500 ms, scroll-to-drag delay, velocity and distance thresholds, background scaling.
- [Sonner](https://sonner.emilkowal.ski/) and [Building a toast component](https://emilkowal.ski/ui/building-a-toast-component): swipe-to-dismiss with a velocity threshold, stacking, pause on hover.
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): Now Playing dismiss with momentum and 80% damping.
- [Apple HIG, sheets](https://developer.apple.com/design/human-interface-guidelines/sheets): detents, grabber, when to use.
- [Material 3, bottom sheets](https://m3.material.io/components/bottom-sheets/overview): standard vs modal, drag handle, scrim.
- [Rauno Freiberg, Invisible details of interaction design](https://rauno.me/craft/interaction-design): light actions mid-gesture, destructive ones on release.

## Bad references
- Many CSS-only "bottom sheet" snippets that open with a fixed-duration tween and can only be closed with a button or by tapping the scrim: no drag, no momentum.
- Mail apps that delete on a full swipe with no undo affordance visible.

## Accessibility
- Visible close button in the sheet header; Escape closes; focus moves in on open and back to the trigger on close.
- The grabber is decorative for screen readers but the sheet has a labelled heading.
- Swipe actions also exist as buttons or a menu (WCAG 2.5.7 Dragging Movements; 2.5.1 Pointer Gestures for path-based gestures).
- Under reduced motion, the sheet fades or appears without travel; dragging still tracks.

## Motion / interaction (if relevant)
Grabbing a sheet while it's opening or closing stops it where it is and resumes tracking (`mgesture-interruptibility-and-velocity.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | sheet enter/exit tween |
| sheet duration | 240 ms (half height) to 400 ms (full height) | Vaul: 500 ms |
| dismiss velocity | 0.4 px/ms (400 px/s) | Vaul |
| dismiss distance | 25% of sheet height | Vaul |
| scroll-to-drag delay | 100 ms | Vaul |
| parent scale | 0.94–0.98 | iOS card look, optional |
| scrim | 0 → 0.4 alpha, tracks progress | |
| undo window | ≥ 5 s | destructive swipe |

## Implementation sketch
```css
dialog.sheet {
  margin: auto 0 0;
  inline-size: 100%;
  max-block-size: 90dvh;
  border-radius: 16px 16px 0 0;
  translate: 0 100%;
  transition:
    translate 360ms var(--motion-ease-drawer),
    overlay 360ms allow-discrete,
    display 360ms allow-discrete;
}
dialog.sheet[open] { translate: 0 var(--drag-y, 0px); }
@starting-style { dialog.sheet[open] { translate: 0 100%; } }
dialog.sheet[data-dragging] { transition: none; }
dialog.sheet::backdrop { background: rgb(0 0 0 / calc(0.4 * (1 - var(--drag-progress, 0)))); }
@media (prefers-reduced-motion: reduce) {
  dialog.sheet { translate: none; opacity: 0; transition: opacity 150ms linear, overlay 150ms allow-discrete, display 150ms allow-discrete; }
  dialog.sheet[open] { translate: 0 var(--drag-y, 0px); opacity: 1; }
  @starting-style { dialog.sheet[open] { translate: none; opacity: 0; } }
}
```
```ts
export interface DismissDecision { close: boolean }

const VELOCITY_PX_PER_MS = 0.4;
const DISTANCE_FRACTION = 0.25;

/** dragY: px moved down from the open position; velocityY: px/ms, positive = downward. */
export function shouldDismiss(dragY: number, velocityY: number, sheetHeight: number): DismissDecision {
  if (velocityY > VELOCITY_PX_PER_MS) return { close: true };
  if (velocityY < -VELOCITY_PX_PER_MS) return { close: false };
  return { close: dragY > sheetHeight * DISTANCE_FRACTION };
}

export function setDrag(sheet: HTMLElement, dragY: number, height: number): void {
  const y = Math.max(0, dragY);
  sheet.style.setProperty('--drag-y', `${y}px`);
  sheet.style.setProperty('--drag-progress', String(Math.min(1, y / height)));
}
```

## Checklist
- [ ] Sheet enters and leaves from the same edge.
- [ ] Dragging tracks 1:1; content drags only when scrolled to top.
- [ ] Closes on > 400 px/s or > 25% height; otherwise returns to the nearest detent.
- [ ] Scrim and parent recede track the drag progress.
- [ ] Destructive swipes commit on release and offer undo; light ones may commit mid-swipe.
- [ ] Visible close button, Escape, focus return; every swipe action has a button.

## Sources
- https://emilkowal.ski/ui/building-a-drawer-component
- https://github.com/emilkowalski/vaul/blob/main/src/constants.ts
- https://vaul.emilkowal.ski/
- https://emilkowal.ski/ui/building-a-toast-component
- https://sonner.emilkowal.ski/
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://m3.material.io/components/bottom-sheets/overview
- https://rauno.me/craft/interaction-design
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
