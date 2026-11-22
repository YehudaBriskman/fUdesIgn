# Dialogs: focus, dismissal and cleanup

> Build a modal on the native `<dialog>` opened with `showModal()`: focus moves in, the page behind is inert, Escape and the Cancel button close it, focus returns to the trigger, and a destructive confirmation names its action and puts initial focus on the safe choice.

**Category:** Overlays · **Applies to:** confirmations, small forms, alerts, pickers that block the page · **Priority:** must

## When to use / when not
- Use a modal only for a decision the user must make now (`comp-overlay-choice.md` decides modal vs popover vs drawer vs toast).
- Not for passive messages (toast), a menu (popover) or long forms (page or panel).
- On phones, tall content belongs in a sheet (`monav-sheets-detents.md`).

## Rules (do)
- Open with `dialog.showModal()`. The browser puts it in the top layer, makes the rest of the page inert, and gives Escape a `cancel` event. Do not use `dialog.show()` for a modal and do not fake the backdrop with a `div`.
- Give it an accessible name (`aria-labelledby` pointing at the heading) and, when useful, `aria-describedby`.
- **Initial focus:** the first focusable control, or for a long dialog the heading (`tabindex="-1"`). For a destructive confirmation focus the safe button ("Keep project"), not the destructive one. Use `autofocus` on the intended element.
- **Return focus** to the control that opened it. Native `showModal()` does this on close when the previously focused element is still connected; verify it, and restore manually if the trigger was removed (focus the nearest logical element, not `body`).
- **Dismissal is deliberate:** Escape always closes a non-critical dialog; a backdrop click may close it only if nothing is lost. If the dialog holds unsaved input, intercept `cancel` and ask, or keep the data.
- **Confirmation wording:** title names the object ("Delete project Atlas?"), the primary button names the action ("Delete project"), the other is "Cancel" or the safe verb. Never "OK / Cancel" for a destructive step.
- Use `role="alertdialog"` only when the dialog interrupts with an urgent, must-answer message.
- Let `showModal()` make the page behind inert; do not add a manual `body` scroll lock you must remember to remove. Add `overscroll-behavior: contain` on a scrolling dialog only to stop scroll chaining.
- A pending action keeps the dialog open, shows busy on the confirming button and ignores repeat clicks. If you also block Escape with `preventDefault()` on `cancel`, test it: browsers may limit repeated cancel prevention, so always keep a working Cancel.
- No stacked modals. If a second decision appears, replace the content or restructure the flow.

## Anti-patterns (don't)
- A `div` with `role="dialog"` and a hand-written focus trap, scroll lock and Escape handler.
- Initial focus on "Delete".
- Closing on backdrop click while the form has unsaved input.
- Focus dropped to `body` after close.
- Modal that opens another modal, or opens on page load.

## Good references
- [WAI-ARIA APG, Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — focus placement, Tab containment, Escape and return focus.
- [MDN, `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) — `showModal()`, `::backdrop`, the `cancel` and `close` events.
- [MDN, `inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) — how the page behind is neutralised.

## Bad references
- A confirmation reading "Are you sure? OK / Cancel" over a delete — the button does not say what it does, and Enter on the default destroys data.

## Accessibility
- WCAG 2.1.2 No Keyboard Trap (A) requires only that keyboard users can leave. Tab cycling inside a modal is fine because Escape (APG) and a visible Close leave it; both are this pattern's rules, not WCAG's.
- WCAG 2.4.3 Focus Order, and 2.4.11 Focus Not Obscured (AA): a focused control is never entirely hidden by author content such as sticky bars. The on-screen keyboard is outside 2.4.11, so scroll focused fields into view anyway.
- Screen readers announce the dialog name on open; test with one real screen reader (`atest-screen-reader-cheatsheets.md`).
- Visible Close control at least 24 × 24 CSS px (WCAG 2.5.8, AA); 44 is design guidance, not WCAG (`a11y-pointer-targets-dragging.md`).

## Motion / interaction (if relevant)
- Enter 150–240 ms ease-out, exit shorter; animate the top layer with `@starting-style` and `allow-discrete` (`mtrans-enter-exit-top-layer.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Dialog max width | 32rem (confirm) / 40rem (form) | Readable line length |
| Enter / exit | 240 ms / 160 ms | Per `mfound-durations-and-easing.md` |
| Backdrop | `oklch(0 0 0 / 0.5)` | `::backdrop` |
| Close target | 44 px | Pointer |

## Implementation sketch
```html
<button type="button" id="open-delete">Delete project</button>

<dialog id="confirm-delete" aria-labelledby="del-title" aria-describedby="del-desc">
  <form method="dialog">
    <h2 id="del-title">Delete project Atlas?</h2>
    <p id="del-desc">This removes 14 files and cannot be undone.</p>
    <div class="actions">
      <button value="cancel" autofocus>Keep project</button>
      <button value="delete" class="danger">Delete project</button>
    </div>
  </form>
</dialog>
```
```ts
const dialog = document.querySelector<HTMLDialogElement>('#confirm-delete')
const opener = document.querySelector<HTMLButtonElement>('#open-delete')

opener?.addEventListener('click', () => dialog?.showModal())

dialog?.addEventListener('close', () => {
  if (dialog.returnValue === 'delete') void deleteProject()
  // showModal() restores focus to the opener; do it by hand if the opener is gone.
  if (opener?.isConnected && document.activeElement === document.body) opener.focus()
})

async function deleteProject(): Promise<void> {
  await fetch('/api/projects/atlas', { method: 'DELETE' })
}
```

## Checklist
- [ ] Opened with `showModal()` on a `<dialog>`; no fake backdrop or hand-rolled trap.
- [ ] Named with `aria-labelledby`; destructive text names object and action.
- [ ] Initial focus is on the safe or first control; focus returns to the trigger.
- [ ] Escape closes it (or asks, when input would be lost); a visible Close exists.
- [ ] Pending state blocks repeat and accidental dismissal.
- [ ] No nested modals; scroll behind is inert.

## Sources
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
- https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
- Source corpus: local `ui-behavior-component-intelligence` skill (dialog contract, restructured)
