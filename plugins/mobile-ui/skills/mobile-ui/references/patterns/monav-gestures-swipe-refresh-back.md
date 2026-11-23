# Gestures: swipe actions, pull to refresh, edge back

> Treat every gesture as a shortcut with a visible equivalent, build swipes on native scrolling (scroll snap) rather than custom touch handlers, keep the screen edges and the bottom strip free for the system's back and home gestures, and never hijack the browser's own pull-to-refresh without replacing it.

**Category:** Navigation · **Applies to:** list rows, carousels, image viewers, drawers, sheets, feeds, maps, full-screen media · **Priority:** must

## When to use / when not
- **Swipe actions** on list rows for 1–3 frequent actions (archive, delete, mark read, pin), as shortcuts.
- **Pull to refresh** on feeds and inboxes that change while open and have no live updates. Not on forms, maps or pages that update themselves.
- **Edge back** is the platform's: iOS Safari swipes back from the left edge, Android gesture navigation from both edges. Do not compete with it (back inside a mode: `monav-contextual-modes-and-state-restore.md`; platform conventions: `moplat-native-feel-hig-material.md`).
- **Not** gestures as the only way to do something (WCAG 2.5.1 Pointer Gestures, 2.5.7 Dragging Movements).

## Rules (do)
- **Every gesture has a button.** Swipe-to-delete also exists in a row menu or edit mode; pull-to-refresh also has a Refresh control or refreshes on return; pinch-zoom also has +/−.
- **Swipe actions:**
  - *Reveal* (swipe partially, then tap a button) for multiple or risky actions; *commit* (a full swipe performs the action) only for the single most common, reversible action, with Undo for 5–10 s.
  - Leading swipe (left to right) for positive actions (read, pin), trailing swipe for destructive ones (delete), matching iOS Mail and M3 lists. Colour plus icon plus label on the revealed area.
  - Commit threshold about 50–60% of row width, or a fast flick; give a visual (and optionally haptic) cue when crossing it.
  - Build on CSS scroll snap: a horizontal scroll container with `scroll-snap-type: x mandatory` gives native momentum and keyboard scrolling (modern-web-guidance `ui-behaviors/swipe-to-reveal.md`, `swipe-to-remove.md`).
- **Gesture conflicts:**
  - Keep horizontal row swipes out of the left 20–30 px on iOS where Safari's back swipe starts; ensure the row's scroller starts at its content snap point so the first leftward move is not an edge gesture.
  - Never put horizontal swipe gestures on a whole page inside a horizontally swiping tab pager.
  - Keep the bottom 20–34 px (home indicator) free of drag-up interactions.
- **Pull to refresh:**
  - Chrome on Android and Safari on iOS 15+ already pull-to-refresh the page. If your app shell scrolls an inner element, add your own; if you replace the browser's, disable it with `overscroll-behavior-y: contain` on the scroller and provide a spinner that appears after a 60–80 px pull.
  - Show progress in place (the spinner at the top), keep the old content visible, and report "Updated just now".
- **Back gesture and history:** each screen pushed in the app is a history entry, so system back and the browser back gesture return to the previous screen. Sheets and dialogs close on back (`<dialog>` close requests); do not intercept back for anything else. Android 14+ predictive back shows the destination during the gesture: for web apps that means same-document View Transitions should not fight the browser's swipe animation.
- **`touch-action`:** declare it on custom gesture surfaces (`pan-y` on a horizontal swiper so vertical scroll still works; `none` only on canvases and maps).
- **Hysteresis:** start a drag after about 8–10 px of movement and decide the axis on the first move; cancel if the finger leaves the target (WCAG 2.5.2).

## Anti-patterns (don't)
- Swipe as the only way to delete, archive or navigate.
- Full-swipe delete with no Undo.
- `touch-action: none` on `body` or a full-page scroller, killing scroll and zoom.
- A custom left-edge "swipe to open menu" that steals iOS's back gesture.
- Disabling the browser's pull-to-refresh (`overscroll-behavior: none` on `html`) without a replacement on a feed users expect to refresh.
- Carousels that auto-advance while the user is trying to swipe.

## Good references
- [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures): standard gestures, never redefine system gestures, and provide alternatives.
- [Material 3: Lists, swipe actions](https://m3.material.io/components/lists/guidelines) and [Gestures](https://m3.material.io/foundations/interaction/gestures): swipe to dismiss and reveal with visible affordances.
- [Android Developers: Predictive back](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture): back previews in Android 14+ and why apps should not intercept back.
- [modern-web-guidance: Swipe to reveal](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/swipe-to-reveal.md) and [Swipe to remove](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/swipe-to-remove.md): scroll-snap swipes with no gesture library.
- [modern-web-guidance: Pull to reveal](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/pull-to-reveal.md): `scroll-initial-target` (Chrome 133+) with a script fallback.
- [MDN: overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior): stopping scroll chaining and the browser's pull-to-refresh.
- iOS Mail: leading and trailing swipe actions, full-swipe commit, Undo by shake or toast.

## Bad references
- [W3C: Understanding SC 2.5.1 Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html): its failure examples (path-based gestures with no single-tap alternative) describe swipe-only carousels and maps.
- Web apps with a hamburger drawer bound to a left-edge swipe: on iOS the gesture triggers Safari's back navigation instead, losing the page.

## Accessibility
- WCAG 2.5.1 (A): path-based or multi-finger gestures have a single-pointer alternative. WCAG 2.5.7 (AA): dragging has a non-drag alternative.
- Screen reader users get swipe actions as a menu (iOS VoiceOver "Actions" rotor; on the web a visible "More" button per row or `aria-haspopup` menu).
- Announce the result of a gesture (`role="status"`: "Archived. Undo").

## Motion / interaction (if relevant)
- Follow the finger 1:1; on release, project velocity and settle with a short decelerate (200–250 ms). Rubber-band beyond limits.
- Reduced motion: keep the gesture, remove decorative bounce and parallax.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| drag start slop | 8–10px | before a drag starts |
| commit threshold | 50–60% of row width or a fast flick | full-swipe commit |
| revealed action width | 72–88px each, max 3 | reveal buttons |
| pull-to-refresh trigger | 60–80px pull | custom refresh |
| iOS back-edge zone | left 20–30px | avoid horizontal swipes here |
| undo window | 5–10s | after a committed swipe |
| `--swipe-destructive` / `--swipe-neutral` | danger / info roles | revealed area colours |

## Implementation sketch
```css
.swipe {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.swipe > * { flex: 0 0 auto; scroll-snap-align: end; }
.swipe > .content { inline-size: 100%; scroll-snap-align: start; background: var(--surface); }
.swipe > .actions { display: flex; }
.swipe .actions button { inline-size: 80px; border: 0; color: var(--on-accent); }
.swipe .archive { background: var(--swipe-neutral); }
.swipe .delete { background: var(--swipe-destructive); }
.feed { overflow-y: auto; overscroll-behavior-y: contain; } /* only with a custom refresh */
@media (hover: none) { .row-menu { display: inline-grid; } } /* the visible alternative */
```
```html
<li class="swipe">
  <div class="content row"><a href="/mail/12">Quarterly report</a> <button class="row-menu" type="button" aria-label="Actions for Quarterly report" popovertarget="m12">⋯</button></div>
  <div class="actions"><button class="archive" type="button">Archive</button><button class="delete" type="button">Delete</button></div>
</li>
```

## Checklist
- [ ] Every swipe, pull, pinch or drag has a visible, single-tap alternative.
- [ ] Full-swipe commits are reversible with Undo for at least 5 s.
- [ ] No custom horizontal gesture starts within the iOS back-edge zone or uses the bottom home strip.
- [ ] Back closes sheets and dialogs and otherwise goes to the previous screen.
- [ ] Pull-to-refresh is either the browser's or a full replacement, never neither.
- [ ] `touch-action` is set on gesture surfaces and never `none` on the page.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/gestures
- https://m3.material.io/components/lists/guidelines
- https://m3.material.io/foundations/interaction/gestures
- https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
- https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
- https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/swipe-to-reveal.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/swipe-to-remove.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/pull-to-reveal.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/natural-interactions.md
