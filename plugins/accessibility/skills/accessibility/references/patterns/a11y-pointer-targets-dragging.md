# Pointer input: target size, dragging alternatives, gestures and cancellation

> Make every pointer target at least 24 × 24 CSS px or spaced so a 24 px circle around it touches no other target (WCAG 2.5.8), give every drag a single-click or keyboard alternative (2.5.7), give every multi-point or path gesture a single-tap equivalent (2.5.1), and act on pointer-up, not pointer-down (2.5.2).

**Category:** Build · **Applies to:** buttons, icon buttons, inline links, sliders, sortable lists, kanban boards, maps, carousels, swipe actions, shake/tilt features · **Priority:** must

## When to use / when not
- **Always** for anything clickable or draggable, on every pointer type. 2.5.8 is not a touch-only rule.
- **Touch layouts** go further (44 pt / 48 dp house rule, thumb reach, spacing): mobile-ui `mofound-touch-targets.md` owns those numbers; the sound use of Fitts's law behind them is in `uxcog-fitts-and-hick-correct-use.md`. Gesture physics are owned by motion-ui `mgesture-direct-manipulation-drag.md` and mobile-ui `monav-gestures-swipe-refresh-back.md`.
- **Exceptions to 2.5.8:** inline links in a sentence, targets whose size is set by the user agent (unstyled native controls), an equivalent control elsewhere on the page that meets the size, and cases where the small size is essential (a map pin at its real location).

## Rules (do)
- **Target Size (Minimum), 2.5.8 AA:** the target is ≥ 24 × 24 CSS px, **or** undersized targets are spaced so a 24 px diameter circle centred on each one's bounding box doesn't intersect another target or its circle. Use `min-inline-size` / `min-block-size` or padding, never a fixed `width`/`height` that shrinks content.
- **House rule:** 44 × 44 on `pointer: coarse` (also the AAA 2.5.5 value), 24 × 24 on fine pointers; `assets/a11y.css` sets `--target-min` to switch between them.
- **Icon buttons in dense tables:** keep the 16 px glyph but give the button a 24 px box; in a row of three icons that means ≥ 24 px pitch.
- **Dragging Movements, 2.5.7 AA:** every function done by dragging can be done with a single pointer without dragging, unless dragging is essential (freehand drawing). Typical alternatives:
  - sortable list → "Move up / Move down" buttons or a "Move to…" menu per item, plus keyboard reordering;
  - kanban card → a "Move to column" menu;
  - slider → click on the track, plus the native `<input type="range">` arrow keys, plus a number field (dashboard-ui `comp-slider-with-number-input.md`);
  - map pan → arrow buttons or keyboard; resizable panes → a menu with preset sizes or a keyboard-operable separator (`role="separator"` with `aria-valuenow`).
- 2.5.7 is about *single-pointer* alternatives; a keyboard alternative alone does not satisfy it, and a drag alternative alone does not satisfy 2.1.1. Ship both.
- **Pointer Gestures, 2.5.1 A:** pinch, two-finger, swipe-path and multi-tap gestures each have a single-pointer, path-free equivalent (zoom buttons, previous/next buttons, a visible swipe-action menu).
- **Pointer Cancellation, 2.5.2 A:** activate on the up event (`click`), so users can slide off to cancel. Down-event actions are allowed only when they are reversible or essential (a piano key).
- **Motion Actuation, 2.5.4 A:** shake-to-undo or tilt features have a UI control and can be turned off.
- **Orientation, 1.3.4 AA:** never lock to portrait or landscape unless essential.
- **Touch action:** set `touch-action` for the axis your gesture owns (`pan-y` for a horizontal swipe), never `none` on scrollable content.

## Anti-patterns (don't)
- 16 × 16 icon buttons packed 4 px apart in table rows.
- Drag-only reordering of a list or dashboard layout.
- Swipe-to-delete with no visible delete control.
- Custom sliders that only respond to dragging the thumb.
- Actions on `pointerdown` / `mousedown` / `touchstart`.
- `touch-action: none` on a full-page carousel, which blocks vertical scrolling.

## Good references
- [W3C — Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — the 24 px circle spacing test with diagrams and the five exceptions.
- [W3C — Understanding 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — single-pointer alternatives for sortables, sliders and maps.
- [W3C WAI-ARIA APG — Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — keyboard-operable resize instead of drag-only.
- [Salesforce — 4 Major Patterns for Accessible Drag and Drop](https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09) — interaction patterns and live announcements for keyboard and screen-reader reordering.
- [modern-web-guidance — Accessibility §5 Target sizes](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#target-sizes) and [drag-and-drop](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/drag-and-drop.md) — `min-block-size` over fixed sizes, scoped `touch-action`.

## Bad references
- Kanban and roadmap tools where moving a card is drag-only: users with tremor, switch access or voice control can't change status at all.
- Map embeds that only zoom by pinch or scroll wheel and hide the zoom buttons on mobile.

## Accessibility
- Announce reorder results through a polite live region ("Invoice 42 moved to position 3 of 8"; `aaria-live-regions-announcements.md`) and keep focus on the moved item.

## Motion / interaction (if relevant)
- Drag tracking, thresholds and velocity are motion-ui's (`mgesture-direct-manipulation-drag.md`). The alternative controls animate the same result with the reduced-motion substitutions of `a11y-motion-vestibular.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--target-min` | 24px; 44px on `pointer: coarse` | Minimum target box |
| Spacing test | 24px circle per undersized target | 2.5.8 alternative |
| `.a11y-target` | `assets/a11y.css` | Utility class |
| Activation event | `click` (up) | 2.5.2 |

## Implementation sketch
A sortable list item with single-pointer and keyboard alternatives to dragging.
```tsx
interface Item { id: string; label: string }
interface Props { items: readonly Item[]; onMove: (id: string, to: number) => void }

export function ReorderControls({ items, onMove }: Props) {
  return (
    <ol>
      {items.map((item, i) => (
        <li key={item.id}>
          <span id={`lbl-${item.id}`}>{item.label}</span>
          <button type="button" className="a11y-target" disabled={i === 0}
            aria-labelledby={`up-${item.id} lbl-${item.id}`} id={`up-${item.id}`}
            onClick={() => onMove(item.id, i - 1)}>Move up</button>
          <button type="button" className="a11y-target" disabled={i === items.length - 1}
            aria-labelledby={`down-${item.id} lbl-${item.id}`} id={`down-${item.id}`}
            onClick={() => onMove(item.id, i + 1)}>Move down</button>
        </li>
      ))}
    </ol>
  )
}
```
```css
.a11y-target { min-inline-size: var(--target-min, 24px); min-block-size: var(--target-min, 24px); }
.swipe-row { touch-action: pan-y; }
```

## Checklist
- [ ] Every target is ≥ 24 × 24 CSS px or passes the 24 px circle spacing test.
- [ ] Touch layouts meet 44 px (mobile-ui `mofound-touch-targets.md`).
- [ ] Every drag has a single-pointer non-drag alternative and a keyboard path.
- [ ] Every multi-finger or path gesture has a single-tap equivalent.
- [ ] Actions fire on pointer up (`click`).
- [ ] Motion-actuated features have a UI control and an off switch.
- [ ] Orientation is not locked.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html
- https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html
- https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/drag-and-drop.md (Apache-2.0, linked, not copied)
