# Orientation, large phones and foldables

> Support both orientations (WCAG 1.3.4), lay out by available width and window class rather than device type, and treat a foldable's hinge as a layout boundary only where the browser reports one.

**Category:** Foundations · **Applies to:** page shell, media, forms, list-detail layouts, video and camera screens, PWAs on tablets and foldables · **Priority:** should

## When to use / when not
- **Use** for every app: rotation happens by accident, by mount (car, desk stand) and by need (people with a fixed-mount device cannot rotate it).
- **Use** the foldable rules when list-detail, maps, video or two-pane layouts make sense on an unfolded inner screen (about 7–8 inches, roughly 600–900 px wide).
- **Not** device sniffing. "Is this a tablet?" breaks with split screen, resizable windows on Android 16 large screens, and Samsung DeX. Use window size and input queries (dashboard-ui `found-responsive-reflow.md`).

## Rules (do)
- **Never lock orientation for ordinary content.** WCAG 2.2 SC 1.3.4 Orientation (AA) forbids restricting content to one orientation unless it is essential (a piano app, a cheque deposit). `screen.orientation.lock()` only works in fullscreen or installed contexts on Android, and not in iOS Safari; the manifest `orientation` member is a preference, honoured by installed apps on Android.
- **Landscape phone (about 844×390):** height is the scarce axis. Collapse the top bar to a single 44–48 px row or hide it on scroll; turn the bottom bar into a side rail or keep it at 48–56 px; never stack a 56 px header, 48 px tabs and a 64 px bottom bar (over 40% of 390 px). Keep fixed bars under 12% of the viewport height each (modern-web-guidance `user-experience/content-first-noise-reduction.md`).
- **Window classes (Material):** compact < 600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥ 1600 (dp ≈ CSS px). A folded phone is compact; most unfolded book-style foldables are medium or expanded in portrait.
- **Medium and up:** bottom bar → navigation rail; full-screen detail → list-detail two panes; full-screen sheet → side sheet or dialog.
- **Keep state across rotation and folding.** The same DOM node restyled by media or container queries keeps scroll, focus and form input; do not re-mount views on `orientationchange`.
- **Foldable hinge (Chromium only):** the Viewport Segments API reports `@media (horizontal-viewport-segments: 2)` (side-by-side) or `(vertical-viewport-segments: 2)` (top and bottom, "laptop" posture), and the `env(viewport-segment-width 0 0)` / `env(viewport-segment-right 0 0)` family of variables gives segment geometry. The Device Posture API adds `@media (device-posture: folded)`. Use them as progressive enhancement: put the list in segment 1 and the detail in segment 2, and never place a control across the hinge.
- **Media:** `aspect-ratio` on video and images; in landscape, play video full width and move controls to the sides.
- **Test matrix:** 390×844 and 844×390; 360×800 and 800×360; 768×1024; an unfolded foldable at about 884×1104 (Chrome DevTools has Galaxy Z Fold and Surface Duo presets with dual-screen emulation).

## Anti-patterns (don't)
- A "Please rotate your device" overlay on ordinary content.
- Layouts keyed off `screen.width` or user-agent "Mobile", which pick a phone layout for an unfolded foldable or split-screen tablet.
- A dialog or button centred on a foldable's hinge.
- Re-fetching or resetting a form on `orientationchange`.
- Landscape where header, tabs and bottom bar leave less than half the height for content.

## Good references
- [W3C: Understanding SC 1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html): what counts as essential, and why mounted devices make locking a barrier.
- [Android Developers: Use window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes): the breakpoints and the warning against "isTablet" logic.
- [Material 3: Canonical layouts](https://m3.material.io/foundations/layout/canonical-layouts): list-detail, supporting pane and feed for medium and expanded windows.
- [MDN: Viewport Segments API](https://developer.mozilla.org/en-US/docs/Web/API/Viewport_segments_API): media features, `env(viewport-segment-*)` and `window.viewport.segments`.
- [MDN: Device Posture API](https://developer.mozilla.org/en-US/docs/Web/API/Device_Posture_API): `device-posture: continuous | folded`.

## Bad references
- [NN/g: Mobile tables](https://www.nngroup.com/articles/mobile-tables/): "Rotating the Phone Is a Last Resort". Telling users to rotate to see a table trades rows for columns and annoys them.
- Banking web apps that lock to portrait and show a rotate overlay, failing WCAG 1.3.4 for users with mounted devices.

## Accessibility
- WCAG 1.3.4 (AA): content works in both orientations.
- WCAG 1.4.10 Reflow at 320 CSS px, which in landscape means 320 px *high* content must still be usable: avoid fixed headers that eat the height.
- Keep focus and reading position when the layout changes between one and two panes.

## Motion / interaction (if relevant)
- No animated re-layout on rotation; the OS already animates the rotation. Keep the scroll anchored to the item at the top (`overflow-anchor` does this by default for most layouts).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| compact | < 600px | bottom bar, single pane, full-screen sheets |
| medium | 600–839px | rail, list-detail optional, side sheets |
| expanded | ≥ 840px | rail or drawer, list-detail two panes |
| landscape phone bar height | 44–48px | single-row top bar |
| fixed bar budget | < 12% of viewport height each | landscape and small phones |

## Implementation sketch
```css
.list-detail { display: grid; grid-template-columns: 1fr; min-block-size: 100dvh; }
.detail { display: none; }
.list-detail:has(.detail[data-open]) .list { display: none; }
.list-detail:has(.detail[data-open]) .detail { display: block; }
@media (width >= 840px) {
  .list-detail { grid-template-columns: minmax(18rem, 2fr) 3fr; }
  .list-detail .list, .list-detail .detail { display: block; }
}
@media (horizontal-viewport-segments: 2) {
  .list-detail { grid-template-columns: env(viewport-segment-width 0 0) env(viewport-segment-width 1 0); column-gap: calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0)); }
  .list-detail .list, .list-detail .detail { display: block; }
}
@media (orientation: landscape) and (height < 500px) {
  .top-bar { min-block-size: 44px; }
  .bottom-bar { display: none; }
  .rail { display: flex; }
}
```

## Checklist
- [ ] Every screen works in portrait and landscape; nothing asks the user to rotate.
- [ ] Layout decisions use width/height queries, not user-agent or `screen` checks.
- [ ] Landscape phone keeps at least 60% of the height for content.
- [ ] At 840 px and up, list-detail shows two panes and the rail replaces the bottom bar.
- [ ] Rotating or folding keeps scroll position, focus and form input.
- [ ] On a dual-segment emulation, no control crosses the hinge.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- https://m3.material.io/foundations/layout/canonical-layouts
- https://developer.mozilla.org/en-US/docs/Web/API/Viewport_segments_API
- https://developer.mozilla.org/en-US/docs/Web/API/Device_Posture_API
- https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock
- https://developer.mozilla.org/en-US/docs/Web/Manifest/Reference/orientation
- https://www.nngroup.com/articles/mobile-tables/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/found-responsive-reflow.md
- Note: Viewport Segments and Device Posture are Chromium-only at the time of writing; the exact shipping versions could not be confirmed (the Chrome blog URL tried returned 404), so feature-detect rather than version-check.
