---
name: accessibility
description: Build or audit any UI to WCAG 2.2 AA with researched rules and test recipes. Use when making a page, app, component, dashboard, form, marketing site, mobile web view or AI feature accessible; when choosing landmarks, headings, accessible names, ARIA roles or an APG widget pattern (tabs, combobox, menu, dialog, tree); when fixing keyboard access, focus order, focus rings or focus hidden under sticky bars (2.4.11); target size (2.5.8) and drag alternatives (2.5.7); consistent help, redundant entry and accessible authentication (3.2.6, 3.3.7, 3.3.8); live regions and screen-reader announcements; contrast, forced colours and high contrast; reduced motion, flashing and auto-play; zoom, reflow at 320px and text spacing; when testing with VoiceOver, NVDA or TalkBack or with axe-core and Playwright; when writing an accessibility statement or checking EAA, ADA Title II, Section 508, EN 301 549 or Israel's IS 5568 obligations; or when asked to audit or score accessibility. Trigger even if the word "accessibility" isn't used: "a11y", "screen reader", "WCAG", "keyboard users", "is this compliant", "VPAT", "הצהרת נגישות".
---

# Accessibility (WCAG 2.2 AA)

A research-backed playbook for accessibility across every UI type: 20 pattern files, each with rules, anti-patterns, good and bad references, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiables and the decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. Prefixes: `a11y` (build: the WCAG 2.2 AA map and each builder task), `aaria` (ARIA, APG, misuse, live regions), `atest` (screen readers, manual plan, axe + Playwright), `alaw` (laws and statements), `aref` (audit rubric and report, anti-patterns).
- **Utilities:** `assets/a11y.css` (skip link, `.sr-only`, focus ring, sticky-chrome scroll padding for 2.4.11, target size, text-spacing-safe boxes, forced colours). It reads the dashboard-ui role tokens (`--accent`, `--on-accent`, `--focus-ring`, `--target-min`, `--space-*`, `--radius-sm`) and declares them at zero specificity, so it works alone.
- **This plugin is the cross-cutting layer.** Domain rules stay in their plugins and are linked, not repeated:
  - contrast numbers: dashboard-ui `color-contrast-rules.md`; charts: `chart-accessibility.md`, `chart-canvas-accessibility.md`; shortcuts, roving focus and overlay focus: `comp-keyboard-shortcuts-focus.md`, `comp-overlay-choice.md`;
  - forms, validation and errors: forms-ui `ffound-form-accessibility.md`, `fvalid-error-summary-and-focus.md`, `fflow-authentication-and-passkeys.md`;
  - streamed and generated output: ai-ui `aichat-streaming-text.md`, `aifound-accessible-generated-content.md`;
  - touch targets and text scale: mobile-ui `mofound-touch-targets.md`, `mofound-type-text-scale.md`;
  - reduced motion: motion-ui `mfound-reduced-motion-vestibular.md`;
  - marketing pages: marketing-ui `mkfound-accessibility-floor.md`;
  - Hebrew/Arabic sites and Israeli practice: i18n-rtl `iref-hebrew-sites-and-israeli-accessibility.md`.

## Workflow

1. **Scope.** Name the UI type, the key flows (sign in, search, buy, submit, get help) and the regimes that apply (`alaw-legal-landscape.md`). The target is always WCAG 2.2 AA (`a11y-wcag22-aa-map.md`).
2. **Structure.** Landmarks, one h1 and a clean outline, unique titles per route, `lang`, skip link (`a11y-structure-landmarks-headings.md`).
3. **Names and roles.** Native elements first; names that contain visible labels; alt text (`a11y-names-roles-states.md`). Custom widgets only via a complete APG pattern (`aaria-first-rule-and-apg.md`); sweep for misuse (`aaria-common-misuse.md`).
4. **Keyboard and focus.** Order, visible ring, no traps, never obscured by sticky chrome (`a11y-keyboard-focus-order.md`).
5. **Pointer.** 24 px targets, drag alternatives, gesture equivalents (`a11y-pointer-targets-dragging.md`).
6. **Perception.** Contrast and colour-only meaning (`a11y-colour-and-contrast.md` → dashboard-ui), forced colours (`a11y-forced-colours-high-contrast.md`), reflow, resize and text spacing (`a11y-resize-reflow-text-spacing.md`), motion and timing (`a11y-motion-vestibular.md`).
7. **Process criteria.** Consistent help, no redundant entry, accessible authentication (`a11y-help-entry-authentication.md`); forms details in forms-ui.
8. **Announcements.** Status messages through one polite and one assertive region (`aaria-live-regions-announcements.md`).
9. **Test.**
   - Automated in CI: axe-core via Playwright with the WCAG 2.2 tags (`atest-automated-axe-playwright.md`); report it as partial coverage.
   - Manual: the seven-pass plan (`atest-manual-test-plan.md`) with one desktop and one mobile screen reader (`atest-screen-reader-cheatsheets.md`).
10. **Review and publish.**
    - Run `aref-anti-patterns.md`, then score `aref-audit-rubric-and-report.md` (32 checks, 0–2 each). Ship at 80% or more with no must-check at 0 and no open Blocker.
    - Report findings as `ID · flow/step · WCAG criterion · severity · evidence · fix (pattern)`, plus what wasn't tested.
    - Publish or update the accessibility statement (`alaw-accessibility-statement.md`).

## Non-negotiables

Break one only with a written reason.

**Structure and names**
1. One `<main>`, labelled `<nav>`s, one `<h1>`, no skipped heading levels, a unique `<title>` updated on every route, correct `lang`.
2. A skip link is the first focusable element.
3. Every interactive element is native or a complete APG pattern, and has a name that contains its visible label.
4. Informative images have meaningful alt; decorative ones are hidden.

**Keyboard and focus**
5. Everything works from the keyboard, in reading order, with no traps and no positive `tabindex`.
6. Focus is shown by a `:focus-visible` outline of at least 2 px at 3:1 or better, never removed without replacement.
7. A focused element is never fully hidden by sticky headers, footers, banners or launchers (2.4.11).

**Pointer**
8. Targets are at least 24 × 24 CSS px or spaced by the 24 px circle test; 44 px on touch.
9. Every drag has a single-pointer alternative, and every multi-finger or path gesture a single-tap equivalent.

**Perception**
10. Text 4.5:1 (large 3:1); boundaries, focus, icons and chart marks 3:1; no colour-only meaning.
11. No page-level horizontal scroll at 320 CSS px; nothing lost at 200% text or with 1.4.12 spacing; zoom never disabled.
12. Controls, states and focus stay visible in forced colours.
13. Anything that moves for more than 5 s can be paused; nothing flashes more than three times a second; reduced motion substitutes, never deletes, feedback.

**Process, status and law**
14. Help sits in the same relative place on every page; nothing already given in a process is asked again; sign-in has a route with no memory, transcription or puzzle test.
15. Status changes are announced politely through a region that exists before it's used; `assertive` only for critical problems.
16. ARIA is never added where native HTML does the job.
17. Automated results are never presented as conformance.
18. Published statements name WCAG 2.2 AA, the status, known gaps, the review date and a working contact route.

## Decision tables

**Which criterion owns my task** (`a11y-wcag22-aa-map.md`)

| Building… | Check first |
|---|---|
| A page or route | 1.3.1, 2.4.1, 2.4.2, 3.1.1 |
| A button, link or icon | 4.1.2, 2.5.3, 2.5.8, 2.4.7 |
| A custom widget | 4.1.2, 2.1.1, APG pattern |
| Sticky header, footer, cookie bar | 2.4.11 |
| Drag, swipe, slider | 2.5.7, 2.5.1, 2.1.1 |
| A form or sign-in | 3.3.1–3.3.3, 3.3.7, 3.3.8, 1.3.5 |
| A toast, save state, search count | 4.1.3 |
| A carousel, video, animation | 2.2.2, 2.3.1 |
| A layout or card grid | 1.4.10, 1.4.12, 1.4.4 |

**Native element or ARIA** (`aaria-first-rule-and-apg.md`)

| Need | Use |
|---|---|
| Action | `<button>` |
| Navigation | `<a href>` |
| Show/hide | `<details>` or disclosure button with `aria-expanded` |
| Modal question | `<dialog>` + `showModal()` |
| Tabs, combobox, tree, grid, menu button | The APG pattern, complete |
| Site navigation | `<nav>` + links, never `role="menu"` |

**Announce or move focus** (`aaria-live-regions-announcements.md`)

| Change | Do |
|---|---|
| Saved, counts, item added | Polite status |
| Session expiring, payment failed, connection lost | Assertive alert |
| Failed submit on a full form | Move focus to the error summary |
| New view or route | Update title, focus the h1 |
| Loading | `aria-busy` / `<progress>`, no announcement unless long |

**Which regime** (`alaw-legal-landscape.md`)

| Selling to / operating in | Standard | Extra |
|---|---|---|
| EU consumers (EAA services/products) | EN 301 549 → WCAG 2.1 AA (2.2 in V4.1.1) | Annex V information; microenterprise service exemption |
| US state and local government | WCAG 2.1 AA | Dates 26 Apr 2027 / 26 Apr 2028 |
| US federal agencies | WCAG 2.0 AA (Section 508) | ACR on the VPAT template |
| Israeli public | IS 5568 level AA | Statement (reg. 35ה); fix within 60 days of notice |

## Token defaults

From `assets/a11y.css`:

| Token | Value |
|---|---|
| `--a11y-focus-w` / `--a11y-focus-offset` | 2px / 2px |
| `--a11y-focus-color` | `var(--focus-ring)`; `Highlight` in forced colours |
| `--a11y-sticky-top` / `--a11y-sticky-bottom` | height of sticky chrome (set by the app) → `scroll-padding` |
| `--target-min` | 24px; 44px on `pointer: coarse` |
| `.sr-only`, `.skip-link`, `.a11y-target`, `.a11y-text-box` | utilities |
