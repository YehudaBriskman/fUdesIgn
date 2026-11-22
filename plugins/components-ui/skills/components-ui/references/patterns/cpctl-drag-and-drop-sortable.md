# Drag and drop and sortable lists

> Every drag interaction needs a non-drag alternative that does the same job (WCAG 2.5.7): keyboard reordering with announcements, or move buttons and a "move to" menu. Use a maintained library for the mechanics, keep the grab handle separate from the content, and show where the item will land.

**Category:** Controls · **Applies to:** reorderable lists, kanban boards, file drop zones, layout builders, priority ranking · **Priority:** must

## When to use / when not
- Reordering or moving items where position carries meaning, or dropping files.
- Not when a sort control or a numeric "position" field does the job; dragging is the slow path for long lists.
- Touch dragging, sheets and swipe: `mgesture-direct-manipulation-drag.md`, `mgesture-sheets-and-swipe-to-dismiss.md`.

## Rules (do)
- **Alternative first.** Provide Move up, Move down (and Move to top or "Move to…" for long lists or boards) as real buttons or menu items that work with a single click or tap. WCAG 2.5.7 (AA) requires a single-pointer, non-drag route, and keyboard-only dragging does not satisfy it on its own.
- **Keyboard drag** if you offer it: Space or Enter lifts, arrows move, Space or Enter drops, Escape cancels and returns the item. Announce each step ("Picked up Task 3, position 3 of 8", "Moved to position 2 of 8", "Dropped at position 2", "Cancelled").
- **Handle:** a visible grip button (`aria-label="Reorder Task 3"`), at least 24 × 24 CSS px (WCAG 2.5.8, AA), 44 px on touch as design guidance; the rest of the row stays clickable and selectable. Put `touch-action: none` only on the handle so scrolling still works.
- **Feedback:** a clear drop indicator (line or gap), the lifted item raised with a shadow and slightly scaled, siblings animating to open space. Respect reduced motion by dropping the sibling animation.
- **Cancel and undo:** Escape or dropping outside returns the item; after a drop offer Undo when the order is persisted.
- **Persist optimistically** and roll back on failure (`prog-optimistic-ui-and-undo.md`); send the new position, not the whole list, when order is stable.
- **Scroll while dragging:** auto-scroll near edges; test long lists and nested scroll regions.
- **File drop zones** are also a button that opens the file picker (`finput-file-upload.md`).

## Anti-patterns (don't)
- Drag as the only way to reorder.
- Whole-row drag that blocks text selection, links and touch scrolling.
- No indication of the drop position.
- Silent keyboard drag with no announcements.
- Re-implementing sensors, collision detection and auto-scroll by hand.

## Good references
- [WCAG 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — single-pointer alternative required.
- [dnd kit, accessibility (legacy `@dnd-kit/core` docs)](https://dndkit.com/legacy/guides/accessibility/) — keyboard sensor, screen reader instructions and live announcements; check the current `@dnd-kit/react` docs before starting new work.
- [Atlassian, Pragmatic drag and drop accessibility guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines) — guidance that favours visible button and menu alternatives to dragging and live-region announcements (it advises against arrow-key controls, a point where it differs from dnd kit).

## Bad references
- A kanban board where cards move only with the mouse — keyboard and switch users cannot change status at all.

## Accessibility
- Handle is a native `<button>` with a name that includes the item. Announce through a polite live region (`aaria-live-regions-announcements.md`).
- Position is exposed as text ("3 of 8"), not only visually.
- Focus stays on the moved item after a move.

## Motion / interaction (if relevant)
- Lift 100 ms, siblings 150–200 ms with a spring or ease-out, drop settles 200 ms; velocity-aware release on touch (`mgesture-interruptibility-and-velocity.md`).

## Tokens and values
House defaults except the 24 px handle (WCAG 2.5.8); tune by testing.

| Token | Value | Use |
|---|---|---|
| Handle target | 24 px min, 44 px touch | Pointer |
| Drop indicator | 2 px accent line | Position |
| Lifted item | scale 1.02, raised shadow | Feedback |
| Auto-scroll zone | 48 px from edge | Long lists |

## Implementation sketch
```ts
// Pure reorder helper shared by buttons, keyboard drag and pointer drag.
export function move<T>(items: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return [...items]
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item as T)
  return next
}

export function announce(label: string, index: number, total: number, verb: 'Moved to' | 'Dropped at'): string {
  return `${label}. ${verb} position ${index + 1} of ${total}`
}
```
```html
<li>
  <button type="button" class="grip" aria-label="Reorder Task 3">⋮⋮</button>
  <span>Task 3</span>
  <button type="button" aria-label="Move Task 3 up">↑</button>
  <button type="button" aria-label="Move Task 3 down">↓</button>
</li>
```

## Checklist
- [ ] A single-pointer, non-drag way to do the same task exists and is discoverable.
- [ ] Keyboard lift, move, drop and cancel work and are announced.
- [ ] Handle is a named button of adequate size; the row stays selectable.
- [ ] A drop indicator shows the landing spot; Escape cancels.
- [ ] Order is persisted optimistically with rollback.
- [ ] Long and nested scroll lists were tested.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://dndkit.com/legacy/guides/accessibility/
- https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Source corpus: https://github.com/emilkowalski/skills `pick-ui-library` (dnd kit pick); keyboard model follows the dnd kit accessibility guide
