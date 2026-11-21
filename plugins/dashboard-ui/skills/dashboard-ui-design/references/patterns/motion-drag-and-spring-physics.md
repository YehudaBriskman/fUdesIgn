# Drag, release and spring physics

> Anything the user can grab follows the pointer 1:1 from where it was grabbed, hands its release velocity to a critically damped spring, settles on the snap target nearest its *projected* resting point, resists softly past its bounds, and can be grabbed again mid-flight without a jump.

**Category:** Motion · **Applies to:** resizable split panes, drawers and bottom sheets, side-panel peek, timeline brush handles, column reordering, card and widget re-arranging · **Priority:** should

## When to use / when not
- **Use** for direct manipulation in a dashboard: split panes, side panels, brush handles, column and widget reordering.
- **Don't** use momentum or projection on a **value control**. A what-if slider, a range handle or a date scrubber must stop exactly where the pointer was released (see `comp-slider-with-number-input.md`).
- **Don't** use bounce on **data marks** or anything carrying data (bars, values, a column order): overshoot shows a value or order that does not exist (`motion-chart-transitions.md`).
- **Don't** apply any of this to keyboard-driven changes: arrow keys move a splitter or column by a step, instantly.

## Rules (do)
The gesture mechanics are canonical in motion-ui, and this file doesn't repeat them. In short: commit to a drag after 10 px and keep the grab offset (`mgesture-direct-manipulation-drag.md`). Measure velocity over the last 100 ms, then snap to the target nearest the projected position (deceleration 0.998; `mgesture-momentum-projection-and-snap.md`), with 0.99 for dashboard splitters, where a flick should only nudge the target choice. Rubber-band past the bounds with c = 0.55 (`mgesture-rubber-banding-and-bounds.md`). Settle with a bounce-0 spring started at the release velocity, and interrupt from the live value (`mspring-parameters-and-mapping.md`, `mgesture-interruptibility-and-velocity.md`). Sheets follow `mgesture-sheets-and-swipe-to-dismiss.md`.

Dashboard-specific additions:
- **Few, meaningful snap targets.** Split pane: collapsed (0 or the rail width), default width, maximum. Sheet: closed, peek, full. Three or four at most.
- **Commit layout once.** Translate a preview edge while dragging and set the pane width once on settle; never animate `width` per frame on a large pane.
- **Persist the result** (pane width, column order) and put it in the URL or user settings when it changes what the view shows (`found-overview-filter-details.md`).

## Anti-patterns (don't)
- Bounce on a splitter, a table column or a reordered widget.
- Momentum on value sliders or scrubbers.
- Drag as the only way to resize or reorder (WCAG 2.5.7).
- A CSS `transition` on the pane while the pointer drives it.

## Good references
- [WAI-ARIA APG, Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — the keyboard contract for a draggable divider: `separator` role, value attributes, arrow keys, Home/End, Enter to collapse or restore.
- motion-ui's `mgesture-*` and `mspring-*` patterns hold the Apple WWDC18, Motion and Vaul references for the physics.

## Bad references
- Generic "animate on drop" tutorials with a fixed 300 ms `ease-out` after a drag: the duration ignores the hand, so throws feel braked.

## Accessibility
- A splitter gets `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`, `tabindex="0"`, arrow keys (10 px or one detent per press) and Home/End. Column reorder offers "Move left/right" menu items.
- Handle hit area at least 24×24 CSS px, 44 px on touch, even if the visible rule is 1 px.
- Reduced motion: dragging stays 1:1; the release snaps without overshoot (motion-ui `mfound-reduced-motion-vestibular.md`).
- Announce the committed result, not every frame: "Panel width 420 pixels".

## Tokens and values
| Token | Value | Use |
|---|---|---|
| gesture constants | see motion-ui SKILL.md "Gesture thresholds" | threshold, velocity window, projection, rubber band |
| `--motion-ease-spring` | `tokens.css` | CSS settle without incoming velocity |
| splitter step | 10px or 1 detent | arrow-key step |
| splitter deceleration | 0.99 / ms | small handles only nudge the target choice |

## Implementation sketch
```css
.splitter {
  inline-size: 8px;            /* visible rule can be 1px; hit area stays >= 24px with padding */
  padding-inline: 8px;
  margin-inline: -8px;
  cursor: col-resize;
  touch-action: none;          /* no browser panning while dragging */
}
.splitter:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.pane { transition: none; }    /* never transition while the pointer drives the value */
```
The pointer, velocity, projection and spring code is in motion-ui's `mgesture-momentum-projection-and-snap.md` and `mspring-parameters-and-mapping.md`.

## Checklist
- [ ] The motion-ui gesture checklist passes (grab offset, 100 ms velocity, projected snap, interruptible settle, rubber band).
- [ ] No bounce on anything carrying data; value controls have no momentum.
- [ ] Splitters follow the APG window-splitter keyboard contract; 24 px minimum handles, 44 px on touch.
- [ ] The committed size or order persists and is announced once.

## Sources
- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
