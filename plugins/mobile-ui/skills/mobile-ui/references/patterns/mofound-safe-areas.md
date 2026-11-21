# Safe areas and env(safe-area-inset-*)

> Draw backgrounds edge to edge with `viewport-fit=cover`, then pad every fixed or edge-anchored control by `env(safe-area-inset-*)` so nothing sits under the notch, the Dynamic Island, rounded corners or the home indicator.

**Category:** Foundations · **Applies to:** top bars, bottom bars, sticky CTAs, FABs, sheets, full-bleed heroes, landscape layouts, installed PWAs · **Priority:** must

## When to use / when not
- **Use** whenever the page sets `viewport-fit=cover`, and always in an installed PWA (`display: standalone`), where there is no browser chrome to absorb the insets.
- **Use** in landscape: the notch moves to a side, so left and right insets become 44–59 px on notched iPhones.
- **Not** needed for content in normal flow inside a padded page. Insets matter for things pinned to an edge.
- Without `viewport-fit=cover`, Safari letterboxes the page inside the safe area and all insets are 0. That is safe but looks dated in landscape (white bars beside the content).

## Rules (do)
- **Meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Never add `maximum-scale=1` or `user-scalable=no` (see `moref-mobile-anti-patterns.md`).
- **Backgrounds bleed, content does not.** A bottom bar's background extends to the screen edge; its items sit above `env(safe-area-inset-bottom)`.
- **Always use a fallback and a minimum:** `padding-bottom: max(12px, env(safe-area-inset-bottom, 0px))` for padding that should not grow when the inset exists, or `calc(12px + env(safe-area-inset-bottom, 0px))` when the bar needs its own padding *plus* the inset (most bottom bars).
- **Typical iPhone values** (portrait, Face ID models): top 47–62 pt depending on the model (status bar plus the Dynamic Island), bottom 34 pt (home indicator). Landscape: left and right 44–59 pt, bottom 21 pt. Android with gesture navigation reports a bottom inset of about 16–24 dp in Chrome when edge-to-edge.
- **Android:** Chrome on Android 15+ exposes the system bar insets through the same `env()` variables when the page draws edge to edge. Apps targeting Android 15 are edge-to-edge by default, so WebView-based apps must handle insets too.
- **Pad all four sides of fixed UI:** a bottom bar needs left and right insets in landscape as well as bottom.
- **Scroll padding:** `scroll-padding-bottom` on `html` is the bar height *plus* the bottom inset, so focused elements are not hidden (WCAG 2.4.11).
- **Theme colour:** set `<meta name="theme-color">` (with a `media` attribute per scheme) so the status bar area matches the top bar instead of showing a mismatched stripe.
- **Sheets:** a bottom sheet's last row sits above the bottom inset; its background runs to the edge (`monav-sheets-detents.md`).

## Anti-patterns (don't)
- `viewport-fit=cover` with no inset padding: the bottom tab bar's labels sit under the home indicator, and the top bar's title sits under the Dynamic Island.
- Hard-coding 34 px for the home indicator. It is 0 on Touch ID devices and in many Android browsers, and different in landscape.
- Using the inset as a *margin* on a fixed bar, leaving a transparent gap below it through which content scrolls.
- Padding the inset twice: once on `body` and again on the bar.
- Only testing portrait, so landscape content is clipped by the notch.

## Good references
- [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/): `viewport-fit=cover`, the `env()` safe-area variables, and padding with `max()`.
- [MDN: env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env): the four inset variables and fallback syntax.
- [modern-web-guidance: Adapt to the form factor](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md): bottom-bar padding with `max()` and `scroll-padding-bottom` including the inset.
- [Android Developers: Edge-to-edge in WebView and Chrome](https://developer.chrome.com/docs/css-ui/edge-to-edge): Chrome's edge-to-edge mode on Android and the safe-area variables.
- [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout): respect the safe areas and keep controls out of the corners.

## Bad references
- Many web checkout pages with a fixed "Pay" bar and `viewport-fit=cover`: the button's lower edge sits under the home indicator, and swiping up for the home gesture is mistaken for a tap.
- Full-screen video players that put the close button at the top-left corner of the screen, under the status bar.

## Accessibility
- Hidden controls fail WCAG 2.5.8 in practice even if their box is large: the part under system UI is not tappable.
- Keep focused elements clear of fixed bars with `scroll-padding` (WCAG 2.4.11).
- With 200% text, bars grow; let them grow upward rather than covering more content, and make sure the inset is still applied.

## Motion / interaction (if relevant)
- Animate bars with `transform`, not by changing padding, so the inset padding stays constant.
- The home indicator and the browser's bottom swipe are system gestures. Do not put swipe-up or drag interactions in the bottom 20–34 px.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--safe-top` | `env(safe-area-inset-top, 0px)` | top bars, full-screen sheets |
| `--safe-right` | `env(safe-area-inset-right, 0px)` | landscape bars and FABs |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | bottom bars, CTAs, sheets |
| `--safe-left` | `env(safe-area-inset-left, 0px)` | landscape bars and FABs |
| iPhone bottom inset | 34 pt portrait · 21 pt landscape | reference values only, never hard-code |

## Implementation sketch
```css
.top-bar {
  position: sticky;
  inset-block-start: 0;
  padding: var(--safe-top) max(var(--page-margin), var(--safe-right)) 0 max(var(--page-margin), var(--safe-left));
  min-block-size: calc(var(--top-bar-h) + var(--safe-top));
  background: var(--surface);
}
.bottom-bar {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  padding: 0 var(--safe-right) var(--safe-bottom) var(--safe-left);
  background: var(--surface);
}
.fab {
  position: fixed;
  inset-inline-end: calc(var(--space-4) + var(--safe-right));
  inset-block-end: calc(var(--bottom-bar-h) + var(--space-4) + var(--safe-bottom));
}
html { scroll-padding-bottom: calc(var(--bottom-bar-h) + var(--safe-bottom)); }
```
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1b1d21" media="(prefers-color-scheme: dark)">
```

## Checklist
- [ ] `viewport-fit=cover` is set only together with inset padding on every fixed or edge-anchored element.
- [ ] Every `env(safe-area-inset-*)` has a `0px` fallback.
- [ ] Tested portrait and landscape on a notched iPhone (or the simulator) and an Android phone with gesture navigation.
- [ ] Bar backgrounds reach the screen edge; their controls do not.
- [ ] `scroll-padding` includes the bar height and the inset.
- [ ] `theme-color` is set for light and dark.

## Sources
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- https://developer.mozilla.org/en-US/docs/Web/CSS/env
- https://developer.chrome.com/docs/css-ui/edge-to-edge
- https://developer.android.com/develop/ui/views/layout/edge-to-edge
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
- Note: the per-model iPhone inset values are from Apple's simulator and device measurements reported by developers; Apple publishes them per device, not as a table.
