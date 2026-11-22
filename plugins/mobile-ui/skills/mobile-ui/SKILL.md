---
name: mobile-ui
description: Design, build or review mobile web pages, responsive apps and PWAs so they feel native on phones, using Apple HIG and Material 3 conventions with researched rules and concrete tokens. Use when creating or fixing a phone layout, bottom navigation or tab bar, bottom sheet, touch targets, thumb reach, safe areas and notches, 100vh/dvh and on-screen keyboard problems, swipe actions, pull to refresh, mobile forms and keyboards (inputmode, autocomplete), lists, cards and tables on small screens, Dynamic Type and text scaling, dark mode, haptics, PWA install and offline, low-end performance, orientation and foldables, or when asked to audit or score a mobile experience. Trigger even if "mobile" is not said: "make it work on my phone", "iPhone layout is broken", "feels like a website, not an app", "add to home screen".
---

# Mobile UI design

A research-backed playbook for mobile web and responsive apps: 20 pattern files, each with rules, anti-patterns, good and bad references, accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiable rules and the quick decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. The prefixes are `mofound` (foundations), `monav` (navigation, sheets, gestures), `moinput` (forms and haptics), `moplat` (PWA, performance, native conventions) and `moref` (review rubric and anti-patterns).
- **Starter tokens:** `assets/mobile.css`. It works on its own in light and dark: the dashboard-ui role tokens it reads are declared at zero specificity, so dashboard-ui's `tokens.css` or the project's own tokens on the same role names override them in any load order. Mobile-only type tokens are `--mo-type-*`.
- **Responsive reflow** (window classes, container queries, grid columns) lives in dashboard-ui's `found-responsive-reflow.md`. This skill builds on it and does not repeat it.

## Workflow

1. **Set the platform baseline.**
   - Use the viewport tag `width=device-width, initial-scale=1, viewport-fit=cover` with no zoom blocking, `color-scheme` and `theme-color` for both schemes, and `assets/mobile.css` (`mofound-safe-areas.md`, `mofound-dark-mode-system-colors.md`).
   - Decide the conventions: neutral web, or adapted per platform (`moplat-native-feel-hig-material.md`).
   - Prefer detecting, defaulting and remembering over asking on a small screen; see `dsfound-conservation-of-complexity.md` (design-system).
2. **Lay out for the thumb.**
   - Put the primary actions in the lower half and the destructive ones away from them (`mofound-thumb-zones-reach.md`).
   - Use 3–5 top-level destinations in a bottom bar, a rail at 600 px and up (`monav-bottom-nav-tabs-drawers.md`).
3. **Size for touch.** Targets are 44 px (48 px in Material-styled apps), never below 24 px, with 8 px gaps (`mofound-touch-targets.md`).
4. **Handle the viewport.**
   - Shells use `dvh`, sheets use `svh`, and nothing uses `100vh`.
   - Plan for the keyboard (`mofound-viewport-units-keyboard.md`).
   - Fixed UI gets safe-area insets.
   - Test landscape and foldables (`mofound-orientation-foldables.md`).
5. **Choose content containers.** Use list rows for homogeneous items and cards for varied ones (`mofound-lists-and-cards.md`). For tables, decide by task between a scroll region and stacked records (`mofound-tables-on-mobile.md`).
6. **Overlays and gestures.**
   - Use bottom sheets with at most three detents and four ways to dismiss (`monav-sheets-detents.md`).
   - Every gesture has a visible alternative, and the system's edges stay free (`monav-gestures-swipe-refresh-back.md`).
7. **Input.**
   - Give each field the right keyboard, `autocomplete`, 16 px text and one column (`moinput-mobile-forms-input-modes.md`).
   - Use haptics only for commits, snaps and errors (`moinput-haptics-vibration.md`).
8. **Text and theme.** Use `rem` type, a 16 px body, layouts that work at 200% text, and OS text scale where supported (`mofound-type-text-scale.md`). Dark mode follows the OS.
9. **Platform.**
   - Installable apps need a full manifest, an install offer at a moment of value, an offline shell and an honest offline state (`moplat-pwa-install-offline-shell.md`).
   - Budget for a low-end Android on slow 4G (`moplat-low-end-performance.md`).
10. **Review before calling it done.**
    - Run `moref-mobile-anti-patterns.md` (14 failures).
    - Capture at 390×844 and 360×800 with touch on, then score `moref-mobile-review-rubric.md` (30 checks, 0–2 each). Ship at 80% or more with no must-check at 0.
    - Report the score and the failed checks with evidence.

## Non-negotiables

Break one of these only with a written reason.

**Reach and touch**
1. On touch, every target is at least 44×44 CSS px (48 for Material-style apps). Nothing is below 24×24 (WCAG 2.5.8). Adjacent targets are 8 px apart.
2. Each screen's primary action is reachable in the lower half. Destructive actions are never next to it.
3. Top-level navigation is 3–5 labelled items in a bottom bar on compact widths. Never use a hamburger as the only navigation for 5 or fewer destinations.

**Viewport and system UI**

4. Never block zoom (`maximum-scale=1`, `user-scalable=no`). Inputs are 16 px or more, so iOS doesn't zoom on focus.
5. No `100vh` full-height layouts. Shells use `dvh`; sheets, drawers and heroes use `svh`.
6. With `viewport-fit=cover`, every fixed or edge-anchored control is padded by `env(safe-area-inset-*)` with a `0px` fallback.
7. A focused field, its label and its error stay visible above the on-screen keyboard. Fixed bars never hide focus (WCAG 2.4.11).
8. Both orientations work, and nothing asks the user to rotate (WCAG 1.3.4).
9. No page-level horizontal scroll at 320 px. Tables and wide content scroll in their own labelled, focusable region.

**Gestures and overlays**

10. Every gesture (swipe, pull, pinch, drag) has a visible single-tap alternative (WCAG 2.5.1, 2.5.7). Full-swipe commits offer Undo.
11. Custom gestures never start on the iOS back edge or the bottom home strip. `touch-action: none` is never set on the page.
12. A sheet dismisses by its button, a scrim tap, a swipe down and Esc or back. It is a named `<dialog>` with managed focus.

**Input**

13. Each field has the right `type`/`inputmode`, `autocomplete` and `enterkeyhint`. Never use `type="number"` for codes, cards or phones, and never split a value into multiple boxes.
14. Forms are one column, with visible labels above the fields.
15. Haptics accompany a visual cue, only for commits, snaps and errors. They are 100 ms or shorter, can be turned off, and are optional (iOS Safari has no Vibration API).

**Text, colour and platform**

16. Body text is 16 px or more in `rem`. Layouts survive 200% text without clipping.
17. Follow the OS colour scheme, with `theme-color` and native controls themed for both schemes. Contrast is 4.5:1 for text and 3:1 for UI in each theme.
18. Mobile p75 targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Every image has dimensions, and the LCP image is never lazy-loaded.
19. No install, newsletter or app-download interstitial on load. Install is offered through the browser's mechanism at a moment of value.
20. Use the OS for OS things: share, pickers, back and text scaling. Never ship a costume of the other platform's chrome.

## Decision tables

**Navigation** (`monav-bottom-nav-tabs-drawers.md`)

| Need | Use |
|---|---|
| 3–5 top-level destinations | Bottom bar, icon and label |
| Peer views inside one destination | Top tabs or a segmented control |
| More than 5, or secondary destinations | Bottom bar for the top 4, plus a drawer or a "More" tab |
| Width 600–839 px | Navigation rail |
| Width 840 px or more | Rail or persistent sidebar |

**Overlay on a phone** (`monav-sheets-detents.md`)

| Need | Use |
|---|---|
| Short choice or action list | Modal bottom sheet at content height |
| Secondary task that may expand | Sheet with medium and large detents |
| Content alongside the main view (map results) | Non-modal sheet with a peek detent |
| Blocking decision | Alert `<dialog>` |
| Full task with its own navigation | Full-screen sheet or a pushed page |

**Viewport unit** (`mofound-viewport-units-keyboard.md`)

| Element | Unit |
|---|---|
| App shell that owns scrolling | `min-block-size: 100dvh` |
| Sheet, drawer, hero | `100svh` |
| Full-screen media | `100lvh`, with safe-area padding inside |
| Chat composer above the keyboard | `visualViewport` offset, or `interactive-widget=resizes-content` on Android |

**Keyboard** (`moinput-mobile-forms-input-modes.md`)

| Data | Markup |
|---|---|
| Email | `type="email" autocomplete="email"` |
| Phone | `type="tel" autocomplete="tel"` |
| One-time code | `inputmode="numeric" autocomplete="one-time-code"` |
| PIN, card number | `inputmode="numeric"` |
| Amount | `inputmode="decimal"` |
| Search | `type="search" enterkeyhint="search"` |

**Table on a phone** (`mofound-tables-on-mobile.md`)

| Task | Layout |
|---|---|
| Compare across rows | Scroll region, sticky first column and header, 2–4 visible columns |
| Read one record at a time | Stacked records with visible labels |
| 3 columns or fewer | Keep the table |

## Token defaults

Full set in `assets/mobile.css`.

| Group | Defaults |
|---|---|
| Targets | 24 px floor · 44 px on `pointer: coarse` · 48 px Material · 8 px gap |
| Safe areas | `--safe-top/right/bottom/left` = `env(safe-area-inset-*, 0px)` |
| Bars | top 56 px · bottom 64 px plus `--safe-bottom` · at most 5 bottom items · rail 80 px |
| Sheets | radius 28 · handle 32×4 (48 target) · medium 50svh · large 100svh − safe top − 12 · max width 640 |
| Type (rem) | large title 2.125 · title 1.375 · headline 1.0625/600 · body 1 · callout 0.9375 · caption 0.8125 · inputs at least 16 px |
| Motion | micro 100 · medium 240 · sheet 300 ms · standard and emphasized easing from dashboard-ui |
| Colour | dashboard-ui roles (`--canvas`, `--surface`, `--text`, `--accent`, …) with light and dark values |
| Capture | 390×844 and 360×800 at DPR 3, touch on · landscape 844×390 · 200% text |

## How to apply this skill

- **When building:**
  - Start from `assets/mobile.css`, or map its roles onto the project's tokens. Then follow the workflow.
  - Prefer platform features: `<dialog>` with `closedby`, the popover API, scroll snap for swipes, `env()` insets, viewport units, `inputmode`/`autocomplete`, `navigator.share`, and the manifest. Each pattern sketch shows feature detection and the fallback.
  - Never use the TypeScript `any` type.
- **When reviewing:**
  - Capture the evidence kit (`moref-mobile-review-rubric.md`), run the anti-pattern catalog, then score the rubric.
  - Do at least one real-device pass for the keyboard, safe areas and performance.
  - Report a table of the check, the score, the evidence and the fix, ordered by severity.
- **With dashboard-ui:** for a dashboard on phones, apply both skills. dashboard-ui owns data display and reflow; this skill owns touch, viewport, navigation and platform.
- **When the project has a design system:** its tokens win. Map them onto these roles and flag the gaps instead of overriding them.
- **When rules conflict:**
  - Accessibility and platform behaviour (zoom, text size, back, targets) beat visual fidelity.
  - Evidence beats habit: each pattern's Sources section says what is measured and what is convention.
