# Sheets and bottom sheets with detents

> On phones, put secondary tasks, pickers and action menus in a bottom sheet that rises from the thumb zone, snaps to a small set of detents (medium about 50%, large near full height), and can always be dismissed by a visible control, a scrim tap, a downward swipe and the platform back/Esc.

**Category:** Navigation · **Applies to:** action menus, filters, pickers, share sheets, detail previews, maps with a results panel, compose flows · **Priority:** should

## When to use / when not
| Need | Use |
|---|---|
| A short choice related to the current screen (share, sort, 3–7 actions) | Modal bottom sheet at content height |
| A secondary task the user may expand (filters, details, comments) | Modal sheet with medium and large detents |
| Content that coexists with the main view (map results, a player) | Non-modal (standard) sheet, persistent, with a collapsed detent |
| A blocking decision (delete, discard) | An alert/dialog, not a sheet |
| Full task with its own navigation (compose, checkout) | Full-screen sheet or a pushed page |
| Medium/expanded widths | Side sheet or centred dialog, max 640 px wide |
| A preview of a linked record (what a desktop shows on hover) | Modal sheet at content height or the medium detent, opened by a visible peek control beside the link; the link's tap still navigates |

- For the desktop overlay decision, see dashboard-ui `comp-overlay-choice.md`.
- **Previews without hover.** Touch has no hover, so a hover preview needs another route: a peek button (an info icon of 44 px or more) that opens a tap-to-peek sheet with the same 3–5 context-chosen fields and an "Open" link. Long-press can be an extra route on rows, not on links: mobile browsers already use a long-press on a link for their own link menu. The preview is never the only path to the information. See dashboard-ui `comp-entity-links-and-hover-previews.md`.

## Rules (do)
- **Detents:** at most three: *collapsed/peek* (non-modal only, e.g. 96–120 px showing a title), *medium* (about 50% of the small viewport; iOS `.medium`), *large* (full height minus the top safe area and a 10–12 px peek of the page behind; iOS `.large`). Size with `svh` so the sheet does not jump as the URL bar moves (`mofound-viewport-units-keyboard.md`).
- **Anatomy (M3):** drag handle 32×4 dp, centred, with 22 dp padding above and below; the top 48 dp of a resizable sheet is its touch target; top corners 28 dp (extra-large shape); full width up to 640 dp, then 56 dp top and side margins. Modal sheets sit on a scrim (the M3 scrim token is 32% opacity; on Android the system draws it). iOS sheets show a grabber when resizable and a "Done"/close button in the header.
- **Dismissal, all four:** visible close or Done button (44 px); scrim tap (modal only); swipe down past 25% of the sheet's height or with a flick faster than 400 px/s; Esc and the Android back gesture/button (`<dialog>` with `closedby="any"` and `showModal()`).
- **Unsaved input:** a sheet with edits asks before dismissing on swipe (iOS: block the swipe and confirm), or keeps the draft.
- **Scroll vs drag:** content scrolls inside the sheet; only when scrolled to the top does a downward drag move the sheet. The handle area and header always drag.
- **Keyboard:** a sheet with a text field expands to the large detent when the field focuses, and the field stays above the keyboard.
- **One sheet at a time.** A sheet opening another sheet replaces it or pushes within it; stacked sheets push the parent back slightly (iOS) at most one level.
- **Use the platform element:** `<dialog>` opened with `showModal()` gives top layer, focus trap, Esc and (Chrome 134+, Firefox 141+) back-gesture close requests; stop page scroll beneath with `overscroll-behavior: contain` on the dialog (modern-web-guidance `ui-behaviors/prevent-page-scroll-under-modal-dialog.md`).
- **Snap with scroll snap where possible:** a vertical scroll container whose snap points are the detents gives native momentum without gesture code; otherwise use pointer events with velocity projection.
- **Undo instead of confirm for reversible actions.** Keep confirmation sheets for irreversible ones (house rule, see `prog-optimistic-ui-and-undo.md`); frequent or primary actions live in the visible UI, not behind a menu.

## Anti-patterns (don't)
- A sheet that can only be dismissed by swiping (no button, no Esc, no back).
- A `100dvh` sheet that jumps while the finger is on it.
- Nested sheets three deep.
- A bottom sheet on a 1280 px desktop stretched to full width.
- Destructive confirmations as a swipe-dismissable sheet, where a stray swipe chooses for the user.
- A drag handle drawn as decoration with no keyboard or screen-reader way to resize.

## Good references
- [Apple HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets): resizable sheets with medium and large detents, the grabber, and when to confirm before dismissing.
- [Apple Developer: UISheetPresentationController.Detent](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/detent): `.medium()`, `.large()` and custom detents (iOS 16).
- [Material 3: Bottom sheets](https://m3.material.io/components/bottom-sheets/overview): standard vs modal, drag handle, scrim, 640 dp max width.
- [modern-web-guidance: Platform controls dismiss dialog](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/platform-controls-dismiss-dialog.md) and [Light-dismiss a dialog](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/light-dismiss-a-dialog.md): `closedby`, back gesture and Esc.
- Apple Maps and Google Maps: a persistent sheet with three detents over a live map.

## Bad references
- Cookie and app-install "sheets" that cover 60% of the first screen on load, the interruption modern-web-guidance `user-experience/content-first-noise-reduction.md` tells you to avoid (non-modal, under 15% of the viewport).
- Web sheets built from a `div` with `position: fixed` and no focus management: screen-reader users read the page underneath.

## Accessibility
- Modal sheets are `<dialog>` with an accessible name (`aria-labelledby` the sheet title); focus moves to the title or first control and returns to the trigger on close.
- Dragging needs a single-pointer, non-drag alternative (WCAG 2.5.7): an "Expand" button or the handle as a button that toggles detents.
- The handle is a `<button aria-label="Resize sheet">` reporting its state, not a bare `div`.

## Motion / interaction (if relevant)
- Enter: slide up from off-screen over `--motion-dur-sheet` (300 ms, inside motion-ui's 240–400 ms sheet range) with `--motion-ease-drawer`; exit the same way at 0.75× (about 225 ms). With reduced motion, fade in 150 ms.
- Drag, release and dismissal follow motion-ui's `mgesture-sheets-and-swipe-to-dismiss.md`: 1:1 tracking, velocity from the last 100 ms, snap to the detent nearest the projected position, close past 25% of the height or faster than 400 px/s, rubber-band past the large detent.
- A light haptic on snapping to a detent is an iOS-native touch (`moinput-haptics-vibration.md`); never required.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--sheet-detent-medium` | 50svh | medium detent |
| `--sheet-detent-large` | 100svh − safe top − 12px | large detent |
| `--sheet-radius` | 28px | top corners |
| `--sheet-handle-w` / `-h` | 32px / 4px | grabber (48px target) |
| `--sheet-max-w` | 640px | centre above this |
| `--scrim` | 40% (light) / 60% (dark) black | modal scrim |
| `--motion-dur-sheet` / `--motion-ease-drawer` | 300ms / `cubic-bezier(0.32, 0.72, 0, 1)` | enter |

## Implementation sketch
```css
dialog.sheet {
  position: fixed;
  inset: auto 0 0;
  margin: 0 auto;
  inline-size: min(100%, var(--sheet-max-w));
  max-inline-size: none;
  max-block-size: var(--sheet-detent-large);
  block-size: var(--sheet-detent-medium);
  padding: 0 0 var(--safe-bottom);
  border: 0;
  border-radius: var(--sheet-radius) var(--sheet-radius) 0 0;
  background: var(--surface);
  color: var(--text);
  overflow: auto;
  overscroll-behavior: contain;
}
dialog.sheet[data-detent="large"] { block-size: var(--sheet-detent-large); }
dialog.sheet::backdrop { background: var(--scrim); overflow: hidden; overscroll-behavior: contain; }
.sheet-handle { display: block; margin: 0 auto; inline-size: 48px; block-size: 24px; border: 0; background: none; }
.sheet-handle::before { content: ""; display: block; margin: auto; inline-size: var(--sheet-handle-w); block-size: var(--sheet-handle-h); border-radius: var(--radius-full); background: var(--border-strong); }
@media (prefers-reduced-motion: no-preference) {
  dialog.sheet[open] { animation: sheet-in var(--motion-dur-sheet) var(--motion-ease-drawer); }
}
@keyframes sheet-in { from { translate: 0 100%; } }
```
```ts
// Drag the sheet from its handle; snap to the nearest detent using release velocity.
type Detent = 'medium' | 'large' | 'closed'

export function attachSheetDrag(sheet: HTMLDialogElement, handle: HTMLElement): void {
  let startY = 0
  let lastY = 0
  let lastT = 0
  let velocity = 0
  handle.addEventListener('pointerdown', (e: PointerEvent) => {
    handle.setPointerCapture(e.pointerId)
    startY = lastY = e.clientY
    lastT = e.timeStamp
    velocity = 0
  })
  handle.addEventListener('pointermove', (e: PointerEvent) => {
    if (!handle.hasPointerCapture(e.pointerId)) return
    const dt = Math.max(1, e.timeStamp - lastT)
    velocity = (e.clientY - lastY) / dt // px per ms, positive = down
    lastY = e.clientY
    lastT = e.timeStamp
    sheet.style.translate = `0 ${Math.max(0, e.clientY - startY)}px`
  })
  handle.addEventListener('pointerup', (e: PointerEvent) => {
    handle.releasePointerCapture(e.pointerId)
    sheet.style.translate = ''
    const projected = lastY - startY + velocity * 200 // where a flick would come to rest
    const height = sheet.getBoundingClientRect().height
    const next: Detent = projected > height * 0.3 ? 'closed' : projected < -height * 0.2 ? 'large' : sheet.dataset.detent === 'large' ? 'large' : 'medium'
    if (next === 'closed') sheet.close()
    else sheet.dataset.detent = next
  })
  // Non-drag alternative (WCAG 2.5.7): a click toggles between detents.
  handle.addEventListener('click', () => {
    sheet.dataset.detent = sheet.dataset.detent === 'large' ? 'medium' : 'large'
  })
}
```
```html
<dialog id="filters" class="sheet" closedby="any" aria-labelledby="filters-title" data-detent="medium">
  <button class="sheet-handle" type="button" aria-label="Resize sheet"></button>
  <header><h2 id="filters-title">Filters</h2><button type="button" commandfor="filters" command="close">Done</button></header>
</dialog>
```

## Checklist
- [ ] Sheets have at most three detents and use `svh` sizes.
- [ ] Close button, scrim tap, swipe down, Esc and back all dismiss (or confirm when there are unsaved edits).
- [ ] Inner content scrolls; dragging the sheet only starts from the handle or at scroll top.
- [ ] The sheet is a named `<dialog>` with focus moved in and restored on close.
- [ ] Resizing works without dragging (button or keyboard).
- [ ] At 600 px and up, the sheet is centred at 640 px or becomes a side sheet or dialog.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/detent
- https://m3.material.io/components/bottom-sheets/overview
- https://m3.material.io/components/bottom-sheets/specs
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/platform-controls-dismiss-dialog.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/light-dismiss-a-dialog.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/prevent-page-scroll-under-modal-dialog.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/dialog.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/comp-overlay-choice.md
- https://m3.material.io/components/bottom-sheets/accessibility (top 48 dp is the touch target)
- https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens (SheetBottomTokens: handle 32×4 dp, shape CornerExtraLargeTop = 28 dp; ScrimTokens: opacity 0.32)
- Note: the m3.material.io spec and accessibility pages were rendered with a headless browser (November 2026) to read the 22 dp padding, 640 dp width and 56 dp margins.
