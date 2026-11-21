# Bottom navigation vs tab bars vs drawers

> On compact screens, put 3–5 top-level destinations in a visible bottom bar (iOS tab bar, M3 navigation bar); use top tabs only to switch views inside one destination; use a drawer only for more than 5 destinations or secondary items, never as the sole navigation of a small app.

**Category:** Navigation · **Applies to:** app shells, top-level navigation, section switching, account and settings menus, PWAs · **Priority:** must

## When to use / when not
| Need | Use |
|---|---|
| 3–5 top-level destinations, used often | Bottom bar: iOS tab bar / M3 navigation bar |
| 2–5 peer views of the *same* content (All / Unread; Overview / Activity) | Top tabs or a segmented control inside the screen |
| More than 5 destinations, or rarely used ones (settings, help, legal) | Drawer or a "More"/profile destination, plus the bottom bar for the top 4 |
| 1–2 destinations | No bar: a simple top app bar with back |
| Medium width (600–839 px) | Navigation rail on the leading edge |
| Expanded (840 px and up) | Rail or a persistent drawer/sidebar |

- **Not** a bottom bar on content sites with deep hierarchies (news, docs); use a top bar with search and a menu, and keep the primary action in reach.

## Rules (do)
- **3–5 items.** Material 3's navigation bar holds 3–5 destinations; Apple's HIG recommends keeping iPhone tab bars to about five, with extra tabs in a More tab. Never 6+ squeezed items.
- **Icon plus label, always.** Labels are 1–2 short words, 12–14 px, never truncated; icons 24 px. Label-less bars hurt recognition.
- **Height:** about 49 pt for the iOS tab bar (83 pt with the home indicator area); 80 dp for the M3 navigation bar (M3 Expressive adds a shorter flexible bar). On the web use 56–64 px plus `env(safe-area-inset-bottom)`.
- **Selected state:** a filled icon and/or an indicator pill (M3: 64×32 dp active indicator) plus `aria-current="page"`; not colour alone.
- **Each tab keeps its own history.** Re-tapping the active tab scrolls to top, then pops to the tab's root (iOS convention). Switching tabs never loses scroll position or form state.
- **Top-level only.** The bar appears on top-level screens; full-screen tasks (compose, checkout, media) can hide it. Do not change the bar's items by context.
- **No primary action in the bar.** A "+" in the middle is acceptable only if it is genuinely the most common action and opens a sheet; otherwise use a FAB or a screen-level button.
- **Drawers:** M3 modal navigation drawer is up to 360 dp wide, with a scrim; it opens from the leading edge via a visible menu button. Swipe-to-open from the edge conflicts with the system back gesture on Android and iOS: make the button the primary trigger and swipe-to-close the gesture (modern-web-guidance `ui-components/navigation-drawer.md`).
- **Top tabs:** scrollable when more than 4 or labels are long; swipe between tab panes only if the panes have no horizontal gestures of their own.
- **Adapt at width:** bottom bar → rail at 600 px → sidebar at 1200 px, keeping the same destinations and order (dashboard-ui `found-responsive-reflow.md`, `comp-app-shell-navigation.md`).
- **Hide on scroll down** only with immediate return on scroll up and while focused (modern-web-guidance `user-experience/content-first-noise-reduction.md`, scroll-state queries in Chrome 144+, with a script fallback).

## Anti-patterns (don't)
- Hamburger-only navigation on a 4-destination app.
- Bottom bar plus top tabs plus a drawer for the same destinations.
- 6–7 bottom items with icons only.
- A bottom bar that resets the tab's stack or scroll on every switch.
- Using the bottom bar for actions (Share, Delete) on some screens and destinations on others.
- Stacking a sticky header, a sub-nav and a cookie banner above a bottom bar so less than 60% of the screen shows content.

## Good references
- [Material 3: Navigation bar](https://m3.material.io/components/navigation-bar/overview): 3–5 destinations, label and icon rules, active indicator.
- [Material 3: Navigation rail](https://m3.material.io/components/navigation-rail/overview) and [Navigation drawer](https://m3.material.io/components/navigation-drawer/overview): when to switch with window size.
- [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars): use for top-level navigation, not actions; keep tabs consistent; preserve state per tab.
- [NN/g: Basic Patterns for Mobile Navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/): tab bars for few top-level items, hidden menus for many, with trade-offs.
- [modern-web-guidance: Navigation drawer](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navigation-drawer.md): a popover drawer with scroll-snap swipe-to-close and `svh` height.
- Instagram, Spotify, Google Maps, the App Store: 4–5 labelled bottom destinations with per-tab history.

## Bad references
- [NN/g: Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/): hidden navigation was used less and made tasks slower and harder than visible navigation.
- Facebook's 2013–2014 move from a drawer to a bottom tab bar on iOS, reported publicly as increasing engagement with the sections that were previously hidden (widely cited; not from a peer-reviewed source).

## Accessibility
- Bottom bar is a `<nav aria-label="Main">` with links, `aria-current="page"` on the active one; do not use `role="tablist"` for page navigation.
- In-screen tabs use the tabs pattern (`role="tablist"`, arrow keys, one Tab stop).
- Targets at least 48 px tall and as wide as the bar allows (`mofound-touch-targets.md`).
- The drawer is a modal: focus moves in, is trapped, returns on close; Esc and back close it.

## Motion / interaction (if relevant)
- Tab switches are instant or a 100–150 ms cross-fade; no sliding between unrelated destinations.
- Drawer slides in from the leading edge in about 250 ms with a scrim fade; under reduced motion, fade only.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--bottom-bar-h` | 64px + `--safe-bottom` | web bottom bar |
| `--bottom-bar-max-items` | 5 | destinations |
| bar icon / label | 24px / 12–14px | bar items |
| active indicator | 64×32px pill | M3 style selected state |
| drawer width | up to 360px, max 85vw | modal drawer |
| rail | 80px wide | 600–1199px windows |

## Implementation sketch
```css
.bottom-bar {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0 var(--safe-right) var(--safe-bottom) var(--safe-left);
  background: var(--surface);
  border-block-start: 1px solid var(--border);
}
.bottom-bar a {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 2px;
  min-block-size: var(--bottom-bar-h);
  font: 500 0.75rem/1.2 var(--mo-font-sans);
  color: var(--text-muted);
  text-decoration: none;
}
.bottom-bar a[aria-current="page"] { color: var(--text); }
.bottom-bar a[aria-current="page"] svg { background: color-mix(in oklab, var(--accent) 18%, transparent); border-radius: var(--radius-full); padding-inline: 20px; }
@media (width >= 600px) {
  .bottom-bar { inset-block: 0; inset-inline-end: auto; inline-size: 80px; grid-auto-flow: row; grid-auto-rows: 72px; align-content: center; border-block-start: 0; border-inline-end: 1px solid var(--border); padding: var(--safe-top) 0 var(--safe-bottom) var(--safe-left); }
}
```
```html
<nav class="bottom-bar" aria-label="Main">
  <a href="/" aria-current="page"><svg aria-hidden="true" width="24" height="24"></svg>Home</a>
  <a href="/search"><svg aria-hidden="true" width="24" height="24"></svg>Search</a>
  <a href="/inbox"><svg aria-hidden="true" width="24" height="24"></svg>Inbox</a>
  <a href="/me"><svg aria-hidden="true" width="24" height="24"></svg>Profile</a>
</nav>
```

## Checklist
- [ ] 3–5 visible, labelled top-level destinations on compact widths.
- [ ] Top tabs switch views within a destination only.
- [ ] A drawer, if any, holds overflow or secondary items and opens from a visible button.
- [ ] Each tab keeps its scroll and stack; re-tapping scrolls to top.
- [ ] Bottom bar uses `nav` + `aria-current`, has safe-area padding, and becomes a rail at 600 px.
- [ ] Persistent bars together take under 25% of the viewport height.

## Sources
- https://m3.material.io/components/navigation-bar/overview
- https://m3.material.io/components/navigation-bar/specs
- https://m3.material.io/components/navigation-rail/overview
- https://m3.material.io/components/navigation-drawer/overview
- https://developer.apple.com/design/human-interface-guidelines/tab-bars
- https://www.nngroup.com/articles/mobile-navigation-patterns/
- https://www.nngroup.com/articles/hamburger-menus/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navigation-drawer.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navbar.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/comp-app-shell-navigation.md
- Note: the m3.material.io and HIG pages render client-side and could not be fetched as text in this pass; the 3–5 count, 80 dp height and 64×32 dp indicator are the published M3 specs, and the iOS 49 pt figure is the long-standing UIKit tab bar height.
