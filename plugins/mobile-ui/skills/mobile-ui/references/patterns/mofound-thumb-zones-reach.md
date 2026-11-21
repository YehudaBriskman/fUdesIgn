# Thumb zones and reach

> Put frequent, safe actions where a thumb rests (the lower-middle of the screen), keep destructive or rare actions out of the easy zone, and never make a primary action reachable only in a top corner.

**Category:** Foundations · **Applies to:** primary actions, navigation, toolbars, FABs, sheets, page layout at compact width · **Priority:** must

## When to use / when not
- **Use** for every layout below 600 CSS px wide (compact window class) and for any screen used while standing, walking or holding something.
- **Use** to decide *where* an action goes. Size is a separate rule (`mofound-touch-targets.md`).
- **Not** a reason to cram everything into the bottom. Reading content still starts at the top; the zone map is for *controls*.
- **Not** a fixed heat map. Grips change through a session, phones keep getting taller, and left-handed users mirror the map. Design for the centre and bottom, not for a right-thumb arc.

## Rules (do)
- **Know the grips.** Hoober's field study (1,333 observations, 780 of them touching the screen) found 49% one-handed, 36% cradled (one hand holds, the other taps) and 15% two-handed among people touching the screen. One-handed use is the largest single group, so design for it first.
- **People prefer the centre.** Hoober and Berkman's follow-up work found users tap most accurately and most willingly in the middle of the screen, and scroll content into the centre before tapping. Accuracy degrades at the edges: aim for about 7 mm targets in the centre and about 11–12 mm at the top, bottom and corners.
- **Three zones at 390×844** (a rough guide, mirror for left hands):
  - *easy*: the lower-middle third (roughly y 480–760 px, centre 70% of the width);
  - *stretch*: the middle band and the bottom corners;
  - *hard*: the top 25% and the top corners (y below about 200 px).
- **Primary, repeated actions** (compose, add, next, the main CTA of a step) go in the easy zone: a bottom bar, a sticky bottom CTA, or a FAB at the bottom trailing edge, 16 px from the edges plus the safe-area inset.
- **Navigation between top-level sections** goes in a bottom bar (`monav-bottom-nav-tabs-drawers.md`), not a top hamburger.
- **Rare or destructive actions** (delete account, sign out, reset) go away from the easy zone: the top bar's overflow menu or the end of a settings list. Never put Delete next to Save in a bottom bar.
- **Search** can sit at the top if it is also reachable from the bottom (a bottom search tab, or the iOS 26 pattern of a bottom search field). A top-only search field on a long list costs a stretch every time.
- **Sheets and menus open from the bottom** on phones so their options land in the easy zone (`monav-sheets-detents.md`).
- **Sticky bottom CTA:** at most one primary button, full width minus 16 px margins, 48–56 px tall, plus `env(safe-area-inset-bottom)` padding.
- **Large phones and tablets:** past 600 px wide, one-handed reach no longer covers the bottom bar's ends. Switch to a navigation rail on the leading edge at medium width (`found-responsive-reflow.md`).

## Anti-patterns (don't)
- A top-left hamburger as the only navigation on a phone.
- The primary action as a small text link in the top-right corner (the classic "Done" or "Save" at the hard corner) with nothing at the bottom.
- Destructive and confirming actions side by side at the bottom, where a slip of the thumb deletes.
- Floating buttons that cover the last list row or the bottom bar's labels, with no bottom padding to scroll past them.
- Assuming right-handed use: swipe-only actions that only work towards one side, or a FAB placed where it covers the right-hand content of every row.

## Good references
- [Steven Hoober, UXmatters: How Do Users Really Hold Mobile Devices?](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php): the 1,333-observation field study and the grip percentages above.
- [Steven Hoober, UXmatters: Design for Fingers, Touch, and People, Part 1](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php): why the centre is preferred and edge accuracy is lower, with the 7 mm / 11–12 mm target guidance.
- [Material 3: Navigation bar](https://m3.material.io/components/navigation-bar/overview): top-level destinations at the bottom of compact screens.
- [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars): navigation at the bottom of iPhone apps.
- Apple Maps, Google Maps and Safari on iOS 15+: the search field and primary controls moved into a bottom sheet or bottom bar.

## Bad references
- [NN/g: Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/): hidden navigation reduced discoverability and slowed tasks compared with visible navigation, on both mobile and desktop.
- Sites whose only "Continue" on a checkout step is a top-right text link: hard to reach, easy to miss, and easy to confuse with a header link.

## Accessibility
- Reach is also a motor accessibility issue: people with tremor or limited grip strength are helped most by large, centred, well-spaced targets.
- Moving controls to the bottom must not break DOM and focus order. The bottom bar can come after `<main>` in the DOM; keep the reading order logical (WCAG 1.3.2, 2.4.3).
- Reserve `scroll-padding-bottom` for any fixed bottom bar so focused fields scroll clear of it (WCAG 2.4.11).

## Motion / interaction (if relevant)
- A FAB may shrink to an icon on scroll down and extend on scroll up, but its position must not jump.
- Hiding a bottom bar on scroll down is allowed only if it returns on any scroll up and while it holds focus (modern-web-guidance `user-experience/content-first-noise-reduction.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--page-margin` | 16px | FAB and sticky CTA inset from the edges, plus the safe area |
| `--bottom-bar-h` | 64px | bottom bar content height, plus `--safe-bottom` |
| sticky CTA height | 48–56px | one primary action in the easy zone |
| easy zone at 390×844 | about y 480–760, centre 70% of width | primary and repeated actions |
| hard zone | top 25% and top corners | rare, destructive or read-only items |

## Implementation sketch
```css
.page { padding-block-end: calc(56px + var(--space-4) * 2 + var(--safe-bottom)); } /* scroll past the CTA */
.sticky-cta {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  padding: var(--space-4) max(var(--page-margin), var(--safe-left)) calc(var(--space-4) + var(--safe-bottom)) max(var(--page-margin), var(--safe-right));
  background: var(--surface);
  border-block-start: 1px solid var(--border);
}
.sticky-cta > button { inline-size: 100%; min-block-size: 52px; border-radius: var(--radius-lg); background: var(--accent); color: var(--on-accent); font: var(--type-headline); border: 0; }
@media (width >= 600px) {
  .sticky-cta { position: static; padding: 0; border: 0; background: none; }
  .sticky-cta > button { inline-size: auto; }
}
```
```html
<main class="page">…form…</main>
<div class="sticky-cta"><button type="submit" form="checkout">Continue to payment</button></div>
```

## Checklist
- [ ] Top-level navigation is visible at the bottom on compact widths, not only behind a top hamburger.
- [ ] Each screen's primary action is reachable in the lower half without a grip change.
- [ ] Destructive actions are not adjacent to the primary action and not in the easy zone.
- [ ] Fixed bottom UI has safe-area padding and content can scroll past it.
- [ ] The layout works mirrored (no right-hand-only gestures or placements).
- [ ] Medium widths (600 px and up) switch to a rail or another layout instead of a stretched bottom bar.

## Sources
- https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php
- https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php
- https://www.nngroup.com/articles/hamburger-menus/
- https://m3.material.io/components/navigation-bar/overview
- https://developer.apple.com/design/human-interface-guidelines/tab-bars
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
- Note: the zone coordinates at 390×844 are this repo's working approximation of Hoober's findings, not a published figure.
