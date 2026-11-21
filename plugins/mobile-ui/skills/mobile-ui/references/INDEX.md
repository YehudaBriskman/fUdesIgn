# Pattern index

Every pattern file in `patterns/`, grouped by cluster. **Priority** says how binding it is: must = always apply, should = apply unless there's a reason not to, nice = optional.
19 patterns in total.


## Foundations: reach, targets, viewport, type, colour, layout

| Pattern | Priority | Rule |
|---|---|---|
| [Dark mode and system colours on mobile](patterns/mofound-dark-mode-system-colors.md) | must | Follow the OS appearance by default (`color-scheme: light dark` plus `prefers-color-scheme`), tune dark as its own theme, match the browser and status bar with `theme-color`, and use CSS system colours where native-looking controls matter. |
| [Lists and cards on small screens](patterns/mofound-lists-and-cards.md) | must | On phones, default to full-width list rows (44–56 px or more, one tap target per row, leading visual, label, one meta line, one trailing value) and use cards only for heterogeneous or visual items; never squeeze a desktop card grid into a single column of tiny cards. |
| [Orientation, large phones and foldables](patterns/mofound-orientation-foldables.md) | should | Support both orientations (WCAG 1.3.4), lay out by available width and window class rather than device type, and treat a foldable's hinge as a layout boundary only where the browser reports one. |
| [Safe areas and env(safe-area-inset-*)](patterns/mofound-safe-areas.md) | must | Draw backgrounds edge to edge with `viewport-fit=cover`, then pad every fixed or edge-anchored control by `env(safe-area-inset-*)` so nothing sits under the notch, the Dynamic Island, rounded corners or the home indicator. |
| [Tables on mobile](patterns/mofound-tables-on-mobile.md) | must | On a phone, first ask whether the user compares across rows or reads one record: compare means a scroll region with a sticky first column and header; one record at a time means a stacked "card per row" list; and in both cases cut columns to the 2–4 that answer the task. |
| [Thumb zones and reach](patterns/mofound-thumb-zones-reach.md) | must | Put frequent, safe actions where a thumb rests (the lower-middle of the screen), keep destructive or rare actions out of the easy zone, and never make a primary action reachable only in a top corner. |
| [Touch targets: 44 pt, 48 dp, 24 px](patterns/mofound-touch-targets.md) | must | On touch, make every control at least 44×44 CSS px (Apple HIG 44 pt; Material 3 says 48 dp, use 48 for Android-feel apps), never go below WCAG 2.5.8's 24×24 floor anywhere, and keep about 8 px between adjacent targets. |
| [Typography, Dynamic Type and OS text scale](patterns/mofound-type-text-scale.md) | must | Set body text at 16 px or more in `rem`, never below 11–13 px for anything, opt in to the OS text size where the browser supports it, and build every layout so 200% text still fits without clipping or horizontal scroll. |
| [Viewport units and the on-screen keyboard](patterns/mofound-viewport-units-keyboard.md) | must | Size app shells with `dvh`, sheets and heroes that must not jump with `svh`, never use plain `100vh` for a full-height layout on mobile, and plan for the on-screen keyboard, which by default covers content rather than resizing the layout. |

## Navigation, overlays and gestures

| Pattern | Priority | Rule |
|---|---|---|
| [Bottom navigation vs tab bars vs drawers](patterns/monav-bottom-nav-tabs-drawers.md) | must | On compact screens, put 3–5 top-level destinations in a visible bottom bar (iOS tab bar, M3 navigation bar); use top tabs only to switch views inside one destination; use a drawer only for more than 5 destinations or secondary items, never as the sole navigation of a small app. |
| [Gestures: swipe actions, pull to refresh, edge back](patterns/monav-gestures-swipe-refresh-back.md) | must | Treat every gesture as a shortcut with a visible equivalent, build swipes on native scrolling (scroll snap) rather than custom touch handlers, keep the screen edges and the bottom strip free for the system's back and home gestures, and never hijack the browser's own pull-to-refresh without replacing it. |
| [Sheets and bottom sheets with detents](patterns/monav-sheets-detents.md) | should | On phones, put secondary tasks, pickers and action menus in a bottom sheet that rises from the thumb zone, snaps to a small set of detents (medium about 50%, large near full height), and can always be dismissed by a visible control, a scrim tap, a downward swipe and the platform back/Esc. |

## Input and feedback

| Pattern | Priority | Rule |
|---|---|---|
| [Haptics and the Vibration API](patterns/moinput-haptics-vibration.md) | nice | Use haptics sparingly to confirm a commit, a snap or an error that the user caused, always together with a visual cue, and treat the web's Vibration API as a progressive enhancement that does nothing on iPhones. |
| [Mobile forms: keyboards, input modes and autofill](patterns/moinput-mobile-forms-input-modes.md) | must | Get the right keyboard and autofill for every field (`type`, `inputmode`, `autocomplete`, `enterkeyhint`), keep inputs at 16 px or more, use one column with labels above fields, and never split one value across several boxes. |

## Platform: PWA, performance, native conventions

| Pattern | Priority | Rule |
|---|---|---|
| [Performance on low-end phones](patterns/moplat-low-end-performance.md) | must | Design and test for a mid-to-low-end Android phone on a slow 4G connection, not a flagship on Wi-Fi: hit LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile of real mobile users, and keep JavaScript small because CPU, not bandwidth, is the bottleneck. |
| [Native feel: Apple HIG and Material 3 conventions on the web](patterns/moplat-native-feel-hig-material.md) | should | Pick one coherent set of conventions per app (a neutral web style, or adapt per platform where it matters), follow the platform for behaviour users rely on (back, sheets, pickers, text scale, share), and never ship a costume of the other platform's chrome. |
| [PWA: install, offline and the app-like shell](patterns/moplat-pwa-install-offline-shell.md) | should | Make the site installable with a complete manifest, offer install only at a moment of value through the browser's own mechanism, cache an app shell and an offline fallback with a service worker, and design an honest offline state instead of a browser error page. |

## Review: rubric and anti-patterns

| Pattern | Priority | Rule |
|---|---|---|
| [Mobile anti-pattern catalog](patterns/moref-mobile-anti-patterns.md) | must | Check every mobile screen against these 14 recurring failures before scoring the rubric; each one names the rubric check it fails, the fix, and good and bad references. |
| [Mobile review rubric and capture recipe](patterns/moref-mobile-review-rubric.md) | must | Capture every screen at 390×844 (iPhone) and 360×800 (Android) with touch emulated, in light and dark, at 200% text and in landscape, then score 30 checks in 7 sections 0–2 each; ship at 80% or more with no "must" check at 0. |
