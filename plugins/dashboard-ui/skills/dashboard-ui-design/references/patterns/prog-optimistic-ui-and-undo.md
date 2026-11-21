# Optimistic UI and undo

> For reversible, likely-to-succeed edits, apply the change in the UI on the same frame, mark it as pending, reconcile with the server, and roll back visibly on failure. For destructive actions, prefer undo (a ≥ 8 s window plus a durable path such as a trash/history) over confirmation dialogs. Reserve confirmations for irreversible, high-stakes actions.

**Category:** Progressive / interaction · **Applies to:** renames, toggles, reordering, status changes, adding notes/annotations, saving views/filters, archiving/deleting rows, assumption edits in a model · **Priority:** should

## When to use / when not
Related: overlay vs inline confirmation choice in `comp-overlay-choice.md`.

Optimistic when **all** hold:
- the server success rate is high (> ~99%) and validation can be mirrored on the client;
- the action is reversible or cheap to redo;
- no server-computed result is needed to render the next state. If it is, show pending state instead.

Not optimistic (show an explicit pending state):
- money movement, trades, payments, sends to third parties, approvals with legal effect;
- actions whose result is computed server-side (a valuation run, a report build), where you'd be inventing numbers;
- multi-user conflicts that are likely (a shared record under active edit).

Undo vs confirm:
- **Undo** for delete/archive/remove/bulk edit where the data can be kept recoverable (soft delete).
- **Confirm** only for truly irreversible or externally visible actions ("Delete workspace", "Send to client"). Use a typed or specific confirmation, not "Are you sure? OK".

## Rules (do)
- **Same-frame update:** the optimistic state renders in the event handler's frame (≤ 100 ms visual). Network latency is never visible for optimistic actions.
- **Pending is visible but quiet:** a reduced-opacity item (≈ 0.6), a small "Saving…" label or a clock icon, appearing only if the request exceeds ~500 ms. Vercel's budget: POST/PATCH/DELETE complete in < 500 ms.
- **Reconcile:** on success, replace the optimistic item with the server record (IDs, timestamps, normalised values) without visual jump. On failure, roll back to the snapshot and show an inline error at the item with **Retry**. Don't use a toast alone; the user must see which item failed.
- **Cancel competing fetches** before writing optimistic state (`cancelQueries`), then invalidate on settle, so stale refetches don't overwrite the optimistic value.
- **Concurrent mutations:** key each optimistic item uniquely (client UUID). Apply updates through a reducer so they compose on the latest state (React `useOptimistic` reducer form).
- **Undo window:** an undo toast/snackbar visible ≥ 8 s, longer for bulk actions (10 s), that pauses its timer while hovered or focused. NN/g warns snackbar undo is easy to miss because it disappears after a few seconds.
- **Durable recovery:** soft-delete into Trash/Archive and/or an activity history with per-entry revert. The toast is a shortcut, not the only path (modern-web-guidance toast guide: don't put controls in toasts for actions not available elsewhere).
- **Keyboard undo:** `Cmd/Ctrl+Z` undoes the last app-level action when focus is not in a text field. Support multi-level undo for frequent edits (NN/g).
- **Defer the irreversible part:** on delete, hide the row immediately and send the actual delete when the undo window closes, or soft-delete server-side and purge later. Gmail's undo send delays the send itself.
- **Describe exactly what happened:** "Archived 3 holdings · Undo" with a count and object name. Never "Success!".

## Anti-patterns (don't)
- "Are you sure?" dialogs on every delete. Habituation makes users click OK reflexively (Raskin: "Never use a warning when you mean undo").
- Optimistic UI with a silent rollback: the item just vanishes or reverts with no message.
- Optimistic rendering of server-computed numbers (showing a guessed NPV before the model runs).
- Spinners inside every toggle for 300 ms requests that almost never fail.
- An undo toast that auto-dismisses in 3–4 s, or dismisses while the user is tabbing to it.
- Undo that restores the item but loses its position, selection or related annotations.
- Disabling the whole form or table while one row saves.

## Good references
- [React `useOptimistic`](https://react.dev/reference/react/useOptimistic): the optimistic state exists only while the Action is pending. On throw, React re-renders with the unchanged real `value` (automatic rollback). The reducer form handles concurrent updates. The docs recommend per-item `pending` flags for "Sending…" labels.
- [TanStack Query, Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates): two levels. Render from `variables` for a single location, or write to the cache with `onMutate` snapshot → `onError` rollback → `onSettled` invalidate. `cancelQueries` first; retry UI from retained `variables`.
- [Aza Raskin, Never Use a Warning When You Mean Undo (A List Apart)](https://alistapart.com/article/neveruseawarning/): habituation defeats confirmations; Gmail-style undo plus trash gives two layers of recovery.
- [NN/g, User Control and Freedom](https://www.nngroup.com/articles/user-control-and-freedom/): visible undo; multi-level undo/redo for frequent actions; contextual snackbars are easy to miss when they vanish quickly.
- Linear's local-first sync model (described in a [reverse-engineering study endorsed by Linear's CTO](https://github.com/wzhudev/reverse-linear-sync-engine)): mutations apply to the local store instantly and queue transactions to the server. This is why issue edits never show a spinner.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): "Update the UI immediately when success is likely; reconcile on server response"; on failure roll back or provide Undo; mutations < 500 ms.

## Bad references
- Google Calendar and Highrise delete flows (as critiqued by [Raskin](https://alistapart.com/article/neveruseawarning/)): warning dialogs with no undo. Habituated users confirm by reflex and the data is gone.
- Google Drive's fast-vanishing undo snackbar (cited by [NN/g](https://www.nngroup.com/articles/user-control-and-freedom/)): users must know they want to undo and act within seconds.

## Accessibility
- Announce outcomes politely: "Holding archived. Undo available." (modern-web-guidance toast guide: append "Actions available"; don't steal focus).
- The undo control is keyboard reachable. The toast's timer pauses while focus is inside. If focus was on the deleted row, move it to the next row (or the previous one if it was last).
- Failure messages are inline, associated with the item (`aria-describedby`), and use text, not only a red tint.
- Pending state is conveyed in text ("Saving") and not by opacity alone.

## Motion / interaction (if relevant)
- Removal: the row collapses height and fades over 150–200 ms (scoped view transition). Undo re-inserts it with the reverse animation at the original index.
- Rollback: a brief (≤ 300 ms) highlight on the reverted item, so the eye finds it. No shake animations.

## Tokens and values
| Token | Value |
|---|---|
| optimistic paint | same frame (≤ 100 ms) |
| pending label show-delay | 500 ms |
| pending opacity | 0.6 + text label |
| mutation latency budget | < 500 ms p75 |
| undo toast duration | 8 s (10 s bulk), paused on hover/focus |
| soft-delete retention | ≥ 30 days in Trash/History |
| row remove animation | 180 ms height+opacity, exit easing |
| rollback highlight | 300 ms `--color-danger-subtle` fade |
| confirmation | only for irreversible actions; specific verb button ("Delete workspace") |

## Implementation sketch
```tsx
import { useOptimistic, startTransition, useState } from 'react';

type Holding = { id: string; name: string; archived: boolean; pending?: boolean };
type Action = { type: 'archive'; id: string } | { type: 'restore'; id: string };

function reducer(list: Holding[], a: Action): Holding[] {
  return list.map((h) => (h.id === a.id ? { ...h, archived: a.type === 'archive', pending: true } : h));
}

export function Holdings({ holdings, archive, restore }: {
  holdings: Holding[];
  archive: (id: string) => Promise<void>;   // parent refreshes `holdings` on success
  restore: (id: string) => Promise<void>;
}) {
  const [view, apply] = useOptimistic(holdings, reducer);
  const [error, setError] = useState<{ id: string; msg: string } | null>(null);

  function onArchive(id: string): void {
    startTransition(async () => {
      apply({ type: 'archive', id });          // same-frame UI
      try {
        await archive(id);
        showUndoToast({ text: 'Holding archived', ms: 8000, onUndo: () => onRestore(id) });
      } catch (e: unknown) {
        setError({ id, msg: e instanceof Error ? e.message : 'Could not archive' }); // auto-rollback
      }
    });
  }
  function onRestore(id: string): void {
    startTransition(async () => { apply({ type: 'restore', id }); await restore(id); });
  }

  return (
    <ul>
      {view.filter((h) => !h.archived).map((h) => (
        <li key={h.id} aria-describedby={error?.id === h.id ? `err-${h.id}` : undefined}>
          {h.name} {h.pending && <span className="pending">Saving…</span>}
          <button onClick={() => onArchive(h.id)}>Archive</button>
          {error?.id === h.id && <p id={`err-${h.id}`} role="status">{error.msg} <button onClick={() => onArchive(h.id)}>Retry</button></p>}
        </li>
      ))}
    </ul>
  );
}
declare function showUndoToast(o: { text: string; ms: number; onUndo: () => void }): void;
```
```css
.pending { opacity: 0; animation: show 1ms linear 500ms forwards; } /* label only after 500 ms */
@keyframes show { to { opacity: 1; } }
```

## Checklist
- [ ] Optimistic only for reversible, high-success, client-computable changes.
- [ ] UI updates in the same frame; pending label appears only after ~500 ms.
- [ ] Failure rolls back and shows an inline, item-level error with Retry.
- [ ] In-flight refetches are cancelled before writing; invalidated on settle.
- [ ] Destructive actions use undo (≥ 8 s, timer pauses on focus) plus Trash/History.
- [ ] Confirm dialogs only for irreversible actions, with a specific verb.
- [ ] `Cmd/Ctrl+Z` works; focus is managed when rows disappear.

## Sources
- https://react.dev/reference/react/useOptimistic
- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- https://alistapart.com/article/neveruseawarning/
- https://www.nngroup.com/articles/user-control-and-freedom/
- https://vercel.com/design/guidelines
- https://github.com/wzhudev/reverse-linear-sync-engine
- https://stack.convex.dev/object-sync-engine
- modern-web-guidance: skills/modern-web-guidance/guides/ui-components/persistent-toast-notifications.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/swipe-to-remove.md
