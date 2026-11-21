# Pattern index

20 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

Cross-cutting layer. Per-domain rules stay in their plugins (dashboard-ui contrast, charts and keyboard; forms-ui validation; ai-ui live output; mobile-ui targets; motion-ui reduced motion; i18n-rtl Israeli accessibility teardown); these files map WCAG 2.2 AA across all of them and link there instead of repeating them.

## Build: WCAG 2.2 AA by task, structure, names, keyboard and focus, pointer, help and authentication, colour, motion, reflow, forced colours (`a11y-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Colour and contrast: the cross-UI checks](patterns/a11y-colour-and-contrast.md) | must | Meet 4.5:1 for text (3:1 for large text), 3:1 for component boundaries, focus rings, icons and chart marks, and never use colour as the only way to convey meaning; dashboard-ui `color-contrast-rules.md` owns the numbers and the APCA second check, and this file only routes and adds the audit steps. |
| [Forced colours and high contrast](patterns/a11y-forced-colours-high-contrast.md) | should | In `forced-colors: active` (Windows contrast themes) the browser replaces author colours with the user's system palette and removes background images, box-shadows and gradients, so every boundary, state and focus ring must be drawn with real borders and outlines, icons must use `currentColor`, and `forced-color-adjust: none` is reserved for colour that is the content. |
| [Consistent help, redundant entry and accessible authentication](patterns/a11y-help-entry-authentication.md) | must | Put help (contact details, a contact form, a chat, a self-help link) in the same relative place on every page that has it (WCAG 3.2.6); never make people re-enter what they already gave in the same process (3.3.7); and never make logging in depend on remembering, transcribing or solving something without help (3.3.8). |
| [Keyboard, focus order, focus visibility and focus not obscured](patterns/a11y-keyboard-focus-order.md) | must | Everything works with Tab, Shift+Tab, Enter, Space, arrows and Esc; focus moves in reading order, never gets trapped, is always visible as a 2 px ring at 3:1 or better, and is never hidden behind sticky headers, footers, cookie bars or chat launchers (WCAG 2.4.11). |
| [Motion, flashing, timing and vestibular safety](patterns/a11y-motion-vestibular.md) | must | Anything that moves, blinks or scrolls by itself for more than 5 seconds can be paused, stopped or hidden (WCAG 2.2.2); nothing flashes more than three times a second (2.3.1); time limits can be turned off, adjusted or extended (2.2.1); and `prefers-reduced-motion: reduce` replaces spatial movement rather than deleting feedback, as motion-ui `mfound-reduced-motion-vestibular.md` specifies. |
| [Names, roles, states and text alternatives](patterns/a11y-names-roles-states.md) | must | Every interactive element and every meaningful image has an accessible name that contains its visible text, a role that matches its behaviour and states that update with it; get them from native HTML first (`<label>`, `<button>`, `alt`, `<caption>`), then `aria-labelledby`, and only then `aria-label`. |
| [Pointer input: target size, dragging alternatives, gestures and cancellation](patterns/a11y-pointer-targets-dragging.md) | must | Make every pointer target at least 24 × 24 CSS px or spaced so a 24 px circle around it touches no other target (WCAG 2.5.8), give every drag a single-click or keyboard alternative (2.5.7), give every multi-point or path gesture a single-tap equivalent (2.5.1), and act on pointer-up, not pointer-down (2.5.2). |
| [Text resize, reflow at 320 px, text spacing and content on hover](patterns/a11y-resize-reflow-text-spacing.md) | must | Layouts survive 200% text zoom (WCAG 1.4.4), reflow to a single column at 320 CSS px wide with no horizontal scrolling except for content that needs two dimensions (1.4.10), lose nothing when users raise line height to 1.5, paragraph spacing to 2em, letter spacing to 0.12em and word spacing to 0.16em (1.4.12), and tooltips or popovers on hover stay dismissible, hoverable and persistent (1.4.13). |
| [Structure: landmarks, headings, titles, language and skip links](patterns/a11y-structure-landmarks-headings.md) | must | Give every page one `<main>`, a labelled `<nav>` per navigation block, one `<h1>` and a heading outline with no skipped levels, a unique front-loaded `<title>` that changes on every route, `lang` on `<html>` and on foreign-language parts, and a skip link as the first focusable element. |
| [WCAG 2.2 AA map, grouped by what you build](patterns/a11y-wcag22-aa-map.md) | must | Target WCAG 2.2 Level AA (55 success criteria: 31 at A, 24 at AA) and work through them by builder task, not by guideline number: structure, names, keyboard, focus, pointer, colour, motion, resize, media, forms and help, and status messages; each row names the file that owns the detail. |

## ARIA: the first rule, APG patterns, misuse, live regions (`aaria-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Common ARIA misuse and how to fix it](patterns/aaria-common-misuse.md) | must | Most ARIA bugs are a handful of repeat mistakes: redundant roles, `aria-hidden` on focusable content, `aria-label` on elements that can't be named, roles without behaviour, stale states and invalid ID references; find them with the accessibility tree and axe, and fix them by deleting ARIA before adding more. |
| [ARIA: the first rule, and when to use an APG pattern](patterns/aaria-first-rule-and-apg.md) | must | Don't use ARIA when a native HTML element or attribute already gives the role, state and keyboard behaviour; when no native element exists (tabs, combobox, tree, menu button, grid), build the WAI-ARIA Authoring Practices (APG) pattern completely, roles, states and every listed key, and test it in a screen reader. |
| [Live regions and announcements](patterns/aaria-live-regions-announcements.md) | must | Announce status changes that don't move focus (WCAG 4.1.3) through one polite and one assertive region that exist in the DOM before they are used; send short, deduplicated, debounced text; use `assertive`/`role="alert"` only for time-critical problems; and move focus instead when the user must act. |

## Testing: screen readers, manual test plan, automated checks (`atest-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Automated testing: axe-core with Playwright, and its coverage limit](patterns/atest-automated-axe-playwright.md) | must | Run axe-core through `@axe-core/playwright` on every key page and state in CI with the WCAG 2.2 A/AA tags, fail the build on any violation, keep keyboard and focus assertions as Playwright tests, and report automation as partial coverage: Deque measured about 57% of real audit issues found automatically, but only 16 of the 50 WCAG 2.1 AA criteria (about 30%) produced any automated finding. |
| [Manual accessibility test plan](patterns/atest-manual-test-plan.md) | must | Run seven passes on every key flow, in this order (automated scan, keyboard only, screen reader, zoom and reflow, text spacing, forced colours and contrast, reduced motion and pointer), and record each finding against a WCAG 2.2 criterion; manual passes find what automation can't, which is most of WCAG. |
| [Screen reader cheat-sheets: VoiceOver, NVDA, TalkBack](patterns/atest-screen-reader-cheatsheets.md) | must | Test with the pairings people actually use (NVDA + Chrome or Firefox and JAWS + Chrome on Windows, VoiceOver + Safari on macOS and iOS, TalkBack + Chrome on Android), learn the dozen commands below for each, and navigate the way users do: by headings, landmarks, links and form controls, not only by Tab. |

## Law and statements: EAA, ADA Title II, Section 508, EN 301 549, Israel IS 5568 (`alaw-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Accessibility statements](patterns/alaw-accessibility-statement.md) | should | Publish one honest statement, linked from every page's footer (and the app's settings or help), that names the standard and level (WCAG 2.2 AA), the conformance status, the known gaps with dates or alternatives, how it was evaluated and when, and a working contact route with a response time; never claim "fully compliant" from an automated scan. |
| [The legal landscape: EAA, ADA Title II, Section 508, EN 301 549, Israel](patterns/alaw-legal-landscape.md) | should | Build to WCAG 2.2 AA, which meets or exceeds the web technical standard of every regime below (EU EAA via EN 301 549, US ADA Title II at WCAG 2.1 AA, US Section 508 at WCAG 2.0 AA, Israel's regulation 35 at IS 5568 level AA), then handle what each law adds beyond WCAG: dates, scope, exemptions, statements and complaint routes, checked against the primary text, not vendor blogs. |

## Review: audit rubric and report, anti-patterns (`aref-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Accessibility anti-patterns across UI types](patterns/aref-anti-patterns.md) | must | Eighteen failures recur in every kind of UI, from overlay widgets and `div` buttons to focus hidden under sticky bars, drag-only boards, CAPTCHA logins and toast-only errors; check for each one, link it to its criterion, and fix it with the named pattern rather than more ARIA. |
| [Accessibility audit rubric and report template](patterns/aref-audit-rubric-and-report.md) | must | Score each key flow on 32 checks in 8 sections, 0–2 points each with evidence, map every finding to a WCAG 2.2 criterion and a severity, and write the report in a fixed shape (scope, method, summary score, findings by severity, automated results, what was not tested); ship at 80% or more with no must-check at 0 and no Blocker open. |
