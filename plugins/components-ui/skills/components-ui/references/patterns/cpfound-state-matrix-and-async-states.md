# The interaction state matrix and async state model

> For every non-trivial control, decide in writing which of the 17 states and modes apply and build all of them; model every async action as `idle → pending → success | error` (plus `cancelled`), and show success only when the outcome is truly known.

**Category:** Foundations · **Applies to:** buttons, form controls, overlays, lists, uploads, saves, deletes, retries, any control that waits on a network · **Priority:** must

## When to use / when not
- Any control with more than a default look, and any action that is not instantaneous.
- Not needed for a static label or purely decorative element.
- Loading visuals and timing thresholds: `prog-loading-states.md`, `prog-perceived-performance-thresholds.md`. Optimistic updates and undo: `prog-optimistic-ui-and-undo.md`.

## Rules (do)
**Decide which rows apply, explicitly.** Walk the matrix, mark each row *applies / not applicable*, then build the applicable ones.

| State or mode | Question to answer |
|---|---|
| Default | Is the affordance recognisable without instructions? |
| Hover | Does it help without becoming a dependency? |
| Focus-visible | Can a keyboard user see where they are? |
| Pressed / active | Is the action or selection unambiguous? |
| Disabled | Is it really unavailable, and is the reason clear where needed? |
| Loading / pending | Progress shown without flicker or false certainty? |
| Success | Did the underlying action truly complete? |
| Error / timeout | Visible failure with a safe recovery path? |
| Empty / no results | Informative and actionable? |
| Dismissed / cancelled | Focus, scroll, dirty changes and cleanup correct? |
| Touch | Doable without hover or a precise pointer? |
| Keyboard | Tab, Enter, Space, arrows, Escape as applicable? |
| Screen reader | Names, roles, state changes and announcements make sense? |
| Reduced motion | Understandable without animation? |
| Responsive / zoom | Works at 320 px width and 200% text zoom? |
| RTL / locale | Direction, order, alignment and gestures correct? |
| Race / repetition | Duplicate requests and stale responses handled? |

**Async model**
- One status per action: `idle`, `pending`, `success`, `error`, and `cancelled` when cancel exists. Store it as one tagged union, never as `isLoading`, `isError` and `data` booleans that can disagree.
- Say "Saved" only after the server confirms. If you update optimistically, label the pending state and roll back visibly on failure.
- Guard repetition: ignore a second trigger while `pending` (`fflow-submit-buttons-and-double-submit.md`), and key requests so a slow older response cannot overwrite a newer one (abort it, or compare a request id).
- Keep the user's input on error; offer retry only when repeating is safe.
- Keep a pending button the same size and keep it focusable (`aria-disabled`), so focus is not lost.
- **Name the four things apart.** An *affordance* is what an element allows; a *signifier* is the cue that says so; a *state* is its current condition; *feedback* is the response to an action. Every cue must be true: nothing that looks clickable, selected or grouped may behave otherwise (Norman's definitions; state and feedback are this file's additions to that pair).
- **Pressed is not selected.** `:active` is momentary feedback. Persistent selection uses `aria-pressed`, `aria-selected` or `aria-current` and a look distinct from hover and pressed.
- **Four states that get confused.** Disabled (unavailable, not focusable or submitted), read-only (focusable, not editable; text-like inputs and textarea only, and exempt from constraint validation), invalid (`aria-invalid` plus text) and inactive-record (a data state, see `data-table-layout-and-typography.md`) each look and behave differently.

## Anti-patterns (don't)
- Only the happy path built, with the other 16 rows left to whoever finds them.
- `isLoading && isError` both true; or a spinner that never ends because the error branch was forgotten.
- A "Saved successfully" toast fired before the request resolves.
- Disabling the submit button so the user cannot see why it will not work.
- Last-response-wins on a search box, so older results replace newer ones.

## Good references
- [GOV.UK Design System, Button](https://design-system.service.gov.uk/components/button/) — documents prevent-double-click behaviour on a real service.
- [MDN, AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — the platform way to drop stale requests.
- [WCAG 2.2, Status Messages 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — pending, success and error must be perceivable without moving focus.

## Bad references
- A save button that shows a green check on click and an error toast two seconds later — the success state lied.

## Accessibility
- Announce pending, success and error through a polite live region that already exists in the DOM (`aaria-live-regions-announcements.md`); move focus only for errors that block the task.
- Disabled is not an excuse to hide the reason: say it in adjacent text, not only in a tooltip.
- State is never colour alone (WCAG 1.4.1).

## Motion / interaction (if relevant)
- Spinner show-delay and minimum-visible timings are defined once in `prog-perceived-performance-thresholds.md`; use those values, not new ones.

## Tokens and values
The 320 px and 200% checks come from WCAG reflow and resize-text; spinner timings live in `prog-perceived-performance-thresholds.md`.

| Token | Value | Use |
|---|---|---|
| Statuses | `idle`, `pending`, `success`, `error`, `cancelled` | One tagged union |
| Zoom / reflow check | 200% text zoom, 320 px width | Responsive row |

## Implementation sketch
```ts
export type Async<T, E = Error> =
  | { readonly status: 'idle' }
  | { readonly status: 'pending'; readonly startedAt: number }
  | { readonly status: 'success'; readonly value: T }
  | { readonly status: 'error'; readonly error: E }
  | { readonly status: 'cancelled' }

// Latest-wins runner: a slow earlier call can never overwrite a later one.
export function latestOnly<A, T>(
  run: (arg: A, signal: AbortSignal) => Promise<T>,
  onState: (s: Async<T>) => void,
): (arg: A) => void {
  let controller: AbortController | undefined
  return (arg) => {
    controller?.abort()
    const mine = new AbortController()
    controller = mine
    onState({ status: 'pending', startedAt: Date.now() })
    run(arg, mine.signal).then(
      (value) => { if (!mine.signal.aborted) onState({ status: 'success', value }) },
      (error: unknown) => {
        if (mine.signal.aborted) return
        onState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) })
      },
    )
  }
}
```

## Checklist
- [ ] Each matrix row is marked applies or not applicable, in the PR or the component docs.
- [ ] Async state is one tagged union with no impossible combinations.
- [ ] Success appears only after confirmation, or is labelled optimistic.
- [ ] Repeat triggers are ignored while pending; stale responses cannot win.
- [ ] Input survives an error; retry only where repeating is safe.
- [ ] Status changes are announced; the reason for disabled is visible text.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- https://design-system.service.gov.uk/components/button/
- Source corpus: local `ui-behavior-component-intelligence` skill (state matrix and async model, restructured)
- https://ixdf.org/literature/topics/signifiers
- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly
