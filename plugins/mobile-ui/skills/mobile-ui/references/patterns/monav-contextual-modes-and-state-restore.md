# Contextual modes and state restore

> Model each mobile screen mode (browse, select, edit, compose, choose-template, search) as a named state with a visible exit, make device back, swipe-back and Esc leave the mode before they leave the screen, keep a mode's primary action in one place, and restore draft, selection, scroll and focus when a sheet or mode closes.

**Category:** Navigation · **Applies to:** lists with bulk actions, inline editors, composers, template pickers, in-screen search, any screen whose toolbar changes meaning · **Priority:** should

## When to use / when not
| Situation | Use |
|---|---|
| Several items acted on together (archive, delete, move, share) | A *select* mode with a contextual action bar |
| One record read by default, edited on demand | An *edit* mode with Done and Cancel |
| New content that may be abandoned (message, note) | A *compose* mode, full-screen or large sheet, with a draft |
| Picking a starting point before composing | A *template* mode that hands over to compose, not a second modal on top |
| Finding within the current screen | A *search* mode that takes over the top bar |
| One reversible action on one item | No mode: an inline control with undo (`prog-optimistic-ui-and-undo.md`) |
| A decision required before anything else | A dialog (`cpover-dialog-focus-and-dismissal.md`), not a mode |

- A mode makes the same input do something different (NN/g: "same input, different results"). That is its cost, so use one only for multi-step or batched work.
- Related: sheets `monav-sheets-detents.md`; back and edge swipes `monav-gestures-swipe-refresh-back.md`; keyboard and viewport `mofound-viewport-units-keyboard.md`; per-mode loading, empty and error states `cpfound-state-matrix-and-async-states.md`.

## Rules (do)
- **Name the modes in one place.** One tagged union with one current value (`browse | select | edit | compose | template | search`). A boolean per mode allows impossible pairs such as selecting while composing. Nest one level at most: a mode may open one sheet, never a mode in a mode in a sheet (Apple HIG: avoid a modal that feels like an app within your app; give a single path through any hierarchy).
- **Show the active mode with two cues.** NN/g strongly recommends at least two visual indicators: the bar changes colour or elevation, and the title names the mode ("3 selected", "Editing", "New message"). Announce the whole phrase politely, not just the number (WCAG 4.1.3 Status Messages).
- **Give every mode a visible exit in the same corner.** Close (X) or Cancel on the leading edge, Done or Save on the trailing edge. Android's contextual action bar puts a close button where the navigation icon was and ends on deselecting everything, Back, or Done; Apple HIG: always give an obvious way to dismiss. A gesture is never the only exit.
- **Back leaves the mode, not the screen.** In a mode, device back, browser back and Esc exit that mode one step (search closes, selection clears, edit asks keep or discard); only in *browse* does back leave the screen. Android: enable a back callback only while the UI state needs it, one job per callback, innermost first. On the web, `history.pushState()` on entry with the mode in the state object, and `history.back()` on a UI exit so the stack does not grow. `CloseWatcher` can capture Esc and Android back, but MDN lists it as limited availability: keep the history fallback.
- **Do not trap.** Unsaved work asks before discarding on back or swipe: Keep editing (default), Save draft, Discard. Apple HIG: if closing could lose user-generated content, explain and offer ways to resolve it. A mode with nothing to lose exits silently.
- **Primary actions do not move within a mode.** Same position, size and label; only the enabled state changes (house default). "Delete" is disabled at zero selected, not shown and hidden. Changing mode may change the bar; changing the count must not.
- **Selection mode.** Enter on long press (about 500 ms, house default) or by tapping a visible checkbox; the bar shows the count, 2-4 icon actions and an overflow. While selecting, a tap toggles instead of opening. Apple HIG says iOS and iPadOS people enter an edit mode before selecting rows, so also give an explicit "Select" entry. Selection stores ids, not row indexes; a vanished row drops out and the count updates.
- **One pinned bar while the keyboard is open.** Of top bar, bottom bar, FAB and composer only one stays pinned: hide bottom navigation and FAB, keep the send or Done bar, lift it with `visualViewport` (`mofound-viewport-units-keyboard.md`). Cap pinned chrome near 25% of the small viewport height (house default).
- **Restore on close, from one snapshot.** Keep the draft until sent or discarded; keep the selection if the user only dismissed a sheet, clear it after a completed action; restore list scroll, then focus the opener or the acted-on row with `focus({ preventScroll: true })` so the focus call does not undo the scroll.
- **Persist drafts.** Write on a debounce (300 ms, house default) and on `visibilitychange` to `hidden`, keyed by record id, because mobile browsers discard background tabs. Offer "Resume draft" instead of silently reopening. `history.scrollRestoration` covers history navigation only, not an in-page sheet.
- **Template hands over, then goes away.** Picking a template replaces the *template* mode with *compose* (no stacking), so back from compose returns to browse; keep the draft if the user returns to change template.
- **Search takes over the top bar.** Entry focuses the field; exit restores the unfiltered list and its scroll; keep the query for the next entry in the session.

## Anti-patterns (don't)
- Back that jumps two screens because the mode was never in history, or does nothing because the mode swallowed it.
- A Delete that slides in at the first tick and shifts when a second action appears.
- FAB, bottom bar and composer all pinned under an open keyboard.
- Clearing the draft or selection because a sheet closed.
- Modal-on-modal: select, sheet, template picker, confirm.
- Mode booleans scattered across components that disagree after a fast double-tap.

## Good references
- [Android Developers: Menus, contextual action mode](https://developer.android.com/develop/ui/views/components/menus): the bar takes over on touch and hold or a checkbox; ends on deselecting all, Back or Done; the title can show the selected count.
- [Material Components Android: Top app bar](https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md): contextual action bar anatomy (close button, contextual title, actions, overflow).
- [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality): clear benefit only, short tasks, single path, obvious dismissal, confirm before losing user content.
- [Apple HIG: Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables): on iOS and iPadOS people enter edit mode to select rows.
- [Android Developers: Predictive back](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture): state-driven, single-responsibility back callbacks, innermost first.

## Bad references
- [NN/g: Modes in User Interfaces](https://www.nngroup.com/articles/modes/): mode errors, and why a single weak cue is not enough.
- Web apps that hold a "mode" in component state but never touch history: browser back leaves the page and the selection or draft goes with it.

## Accessibility
- Entering or leaving a mode updates the heading and a polite `role="status"` region with the whole phrase ("3 items selected"). Keep the status text separate from the `<h1>`: `role="status"` on a heading replaces its heading semantics.
- Move focus on entry to the mode's first control or title; on exit return it to the trigger or the nearest surviving row. W3C's focus-order page shows focus returning to the button when a dialog is dismissed.
- Esc leaves the mode; the close control is a real `<button>` with a name ("Clear selection").
- Long press is a single-pointer gesture, so WCAG 2.5.1 does not force an alternative, but a "Select" button still serves users who cannot hold and keyboard users (2.1.1 Keyboard).
- A focused field must not sit under the one pinned bar (WCAG 2.4.11 Focus Not Obscured, Minimum).
- Selected rows expose `aria-selected="true"` (listbox or grid) or a checked checkbox, not only a background colour.

## Motion / interaction (if relevant)
- Bar swap is a 150-200 ms cross-fade or short slide (house default); with reduced motion, an instant swap.
- Swap in place so the first row does not jump when the mode starts.
- Never auto-exit a mode on a timer; show an "archived" toast with Undo after the mode exits.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mode-bar-h` | 56px (house default) | bar height, same in every mode |
| `--mode-bar-gap` | 8px (house default) | space between bar actions |
| `--mode-target` | 44px minimum | close, Done, bar actions (`mofound-touch-targets.md`) |
| `--longpress-ms` | 500ms (house default) | enter select mode |
| `--draft-debounce-ms` | 300ms (house default) | draft autosave |
| `--mode-swap-ms` | 150-200ms (house default) | bar cross-fade |
| `--sticky-budget` | 25svh (house default) | total pinned chrome |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | bar padding (`mofound-safe-areas.md`) |
| `--kb` | from `visualViewport`, default `0px` | offset of the pinned bar above the keyboard |

## Implementation sketch
```ts
// One current mode, one reducer, one snapshot so close restores everything.
type Mode =
  | { kind: 'browse' }
  | { kind: 'select'; ids: ReadonlySet<string> }
  | { kind: 'compose'; draft: string }
  | { kind: 'template'; draft: string }
  | { kind: 'search'; query: string }

interface Snapshot { scrollTop: number; focusId: string | null }
interface State { mode: Mode; snapshot: Snapshot }

type Action =
  | { type: 'enter-select'; id: string; snap: Snapshot }
  | { type: 'toggle'; id: string }
  | { type: 'pick-template' }
  | { type: 'back' } // device back, swipe-back, Esc and the visible exit all dispatch this

export function reduce(state: State, action: Action): State {
  const { mode } = state
  switch (action.type) {
    case 'enter-select':
      return { mode: { kind: 'select', ids: new Set([action.id]) }, snapshot: action.snap }
    case 'toggle': {
      if (mode.kind !== 'select') return state
      const ids = new Set(mode.ids)
      if (!ids.delete(action.id)) ids.add(action.id)
      // Deselecting the last item leaves the mode (Android contextual bar behaviour).
      return { ...state, mode: ids.size ? { kind: 'select', ids } : { kind: 'browse' } }
    }
    case 'pick-template':
      // Replace the picker, do not stack: back from compose returns to browse.
      return mode.kind === 'template' ? { ...state, mode: { kind: 'compose', draft: mode.draft } } : state
    case 'back':
      return mode.kind === 'browse' ? state : { ...state, mode: { kind: 'browse' } }
  }
}

// Restore after the mode closes: scroll first, then focus without scrolling again.
export function restore(list: HTMLElement, snap: Snapshot): void {
  list.scrollTop = snap.scrollTop
  const el = snap.focusId ? document.getElementById(snap.focusId) : null
  el?.focus({ preventScroll: true })
}

// Platform back leaves the mode. On enter: history.pushState({ mode: 'select' }, '');
// on a visible-exit tap: history.back() so the stack does not grow.
export function bindBack(getMode: () => Mode, dispatch: (a: Action) => void): void {
  window.addEventListener('popstate', () => {
    if (getMode().kind !== 'browse') dispatch({ type: 'back' })
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getMode().kind !== 'browse') history.back()
  })
}
```
```html
<!-- The one sticky bar. Same height in every mode; the swap changes content, not geometry. -->
<header class="mode-bar" data-mode="select">
  <button type="button" class="mode-exit" aria-label="Clear selection">&times;</button>
  <h1 class="mode-title">3 selected</h1>
  <p class="visually-hidden" role="status">3 items selected</p>
  <button type="button" class="mode-primary">Archive</button>
  <button type="button" class="mode-more" aria-label="More actions">&hellip;</button>
</header>
<main class="mode-list" tabindex="-1"><!-- rows --></main>
```
```css
:root { --mode-bar-h: 56px; --safe-bottom: env(safe-area-inset-bottom, 0px); --kb: 0px; /* from visualViewport */ }
.mode-bar {
  position: sticky; inset-block-start: 0; z-index: 2;
  display: grid; grid-template-columns: 44px 1fr auto 44px; align-items: center; gap: 8px;
  block-size: var(--mode-bar-h);
  padding-inline: max(8px, env(safe-area-inset-left, 0px)) max(8px, env(safe-area-inset-right, 0px));
  background: var(--surface-raised);
}
.mode-bar > button { min-block-size: 44px; min-inline-size: 44px; }
/* Bottom variant: lifted above the keyboard and the home indicator. */
.mode-bar--bottom { position: fixed; inset-block: auto 0; inline-size: 100%; padding-block-end: var(--safe-bottom); translate: 0 calc(-1 * var(--kb)); }
/* While a field is focused, only the composer's bar stays pinned. */
body:has(:is(input, textarea):focus) :is(.tabbar, .fab) { display: none; }
@media (prefers-reduced-motion: no-preference) { .mode-bar > * { transition: opacity 150ms ease; } }
```

## Checklist
- [ ] Modes are one tagged union, one nesting level at most.
- [ ] Every mode shows two cues and a visible exit in the same corner.
- [ ] Back, edge swipe and Esc leave the mode first; exits do not grow history.
- [ ] The primary action keeps position, size and label; only enabled state changes.
- [ ] With the keyboard open, one bar is pinned and it clears keyboard and safe area.
- [ ] Closing a sheet or mode restores draft, selection (by id), scroll and focus.
- [ ] Unsaved work asks Keep editing, Save draft or Discard; empty modes exit silently.
- [ ] Count and mode name are announced in a status region; long press has a visible alternative.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
- https://developer.android.com/develop/ui/views/components/menus
- https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md
- https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
- https://www.nngroup.com/articles/modes/
- https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher
- https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
- https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- https://web.dev/articles/bfcache
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
