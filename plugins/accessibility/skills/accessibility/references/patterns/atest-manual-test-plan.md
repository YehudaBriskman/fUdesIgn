# Manual accessibility test plan

> Run seven passes on every key flow, in this order (automated scan, keyboard only, screen reader, zoom and reflow, text spacing, forced colours and contrast, reduced motion and pointer), and record each finding against a WCAG 2.2 criterion; manual passes find what automation can't, which is most of WCAG.

**Category:** Testing · **Applies to:** feature QA, release gates, audits, pull-request reviews of UI changes · **Priority:** must

## When to use / when not
- **Per feature:** passes 1–3 on the changed flow (about 15–30 minutes).
- **Per release or audit:** all seven passes on each key flow and on one page per template.
- **Scope by flows, not pages:** sign up, sign in, search, browse to detail, add to cart and pay, submit a form, change settings, get help. A flow passes only if every step passes.

## Rules (do)
- **Pass 1 — Automated scan** (`atest-automated-axe-playwright.md`): zero violations at WCAG 2.2 AA tags; triage "needs review" items into the manual passes.
- **Pass 2 — Keyboard only** (unplug or ignore the mouse):
  - Tab from the address bar: the skip link appears first and works.
  - Every interactive element is reachable, in reading order, with a visible ring (2.1.1, 2.4.3, 2.4.7).
  - Focus is never hidden by sticky or fixed content (2.4.11), including at 200% zoom.
  - Widgets follow their APG keys (arrows in tabs, menus, radios; Esc closes overlays and returns focus).
  - No traps; single-key shortcuts can be turned off (2.1.2, 2.1.4).
- **Pass 3 — Screen reader** (`atest-screen-reader-cheatsheets.md`), one desktop and one mobile pairing:
  - Headings list makes sense alone; landmarks list shows banner, navigation, main, contentinfo.
  - Each control's name, role and state are right; images have meaningful or empty alt.
  - Errors, status messages and dynamic changes are announced once (4.1.3).
  - Route changes announce the new page (title, focused h1).
- **Pass 4 — Zoom and reflow:**
  - Browser zoom 200%: nothing lost (1.4.4).
  - 1280 px window at 400% zoom, or a 320 px wide viewport: one column, no page-level horizontal scroll (1.4.10).
  - Text-only zoom 200% (Firefox): nothing clipped.
- **Pass 5 — Text spacing:** apply the 1.4.12 values (bookmarklet or the test stylesheet in `a11y-resize-reflow-text-spacing.md`); nothing clipped or overlapping.
- **Pass 6 — Colour, contrast and forced colours:**
  - Spot-check text, borders, focus rings and icons in every theme (1.4.3, 1.4.11); greyscale emulation for colour-only meaning (1.4.1).
  - Windows contrast theme (or DevTools emulation): every control, state and focus ring still visible.
- **Pass 7 — Motion, timing and pointer:**
  - OS reduce-motion on: spatial motion replaced, feedback kept.
  - Anything moving over 5 s can be paused (2.2.2); timeouts warn (2.2.1).
  - Targets ≥ 24 px or spaced (2.5.8); every drag has a click alternative (2.5.7); actions fire on release (2.5.2).
- **Plus the 2.2 process checks** on flows: help in the same place (3.2.6), no re-entry (3.3.7), sign-in with a password manager and no puzzle (3.3.8).
- **Record** every finding: flow, step, criterion, severity, evidence (screenshot, screen-reader transcript), fix. Feed `aref-audit-rubric-and-report.md`.
- **Severity scale:** Blocker (a task can't be completed), Major (completed with significant difficulty or workaround), Minor (annoyance, no task impact).

## Anti-patterns (don't)
- Treating a clean axe run as the test.
- Testing only the home page, never the checkout or error states.
- Testing error states without triggering them (empty submit, server failure, timeout).
- Skipping mobile screen readers because "it's a desktop app" when the site is responsive.
- Findings recorded as "not accessible" with no criterion, steps or evidence.

## Good references
- [W3C WAI — Easy Checks: A First Review of Web Accessibility](https://www.w3.org/WAI/test-evaluate/preliminary/) — quick manual checks for titles, headings, contrast, keyboard, zoom.
- [W3C — WCAG-EM Evaluation Methodology](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/) — scope, sample, audit, report; the structure behind this plan.
- [GOV.UK Service Manual — Testing for accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility) — when to test what, and why manual testing and user research both matter.
- [W3C — ACT Rules](https://www.w3.org/WAI/standards-guidelines/act/rules/) — consistent, testable rule definitions to align manual and automated results.
- [modern-web-guidance — Accessibility §13 Testing](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#13-testing-validations) — automated checks are not enough; keyboard-only and screen-reader passes.

## Bad references
- "Accessibility certified" badges issued after a single automated scan with no manual passes.

## Accessibility
- Include disabled people in usability testing for key flows; this plan finds conformance failures, not every usability barrier.

## Motion / interaction (if relevant)
- Pass 7 covers motion; record both full and reduced motion behaviour.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Passes | 7 (+ 2.2 process checks) | Plan |
| Reflow viewport | 320 × 256 CSS px | Pass 4 |
| Zoom | 200% and 400% | Pass 4 |
| Severity | Blocker / Major / Minor | Findings |
| Per-feature subset | Passes 1–3 | PR review |

## Implementation sketch
A typed test plan that can be printed as a checklist or tracked per release.
```ts
type Pass = 'automated' | 'keyboard' | 'screen-reader' | 'zoom-reflow' | 'text-spacing' | 'colour-forced' | 'motion-pointer'
type Severity = 'blocker' | 'major' | 'minor'

export interface Finding { flow: string; step: string; pass: Pass; criterion: string; severity: Severity; evidence: string; fix: string }
export interface FlowRun { flow: string; passes: Partial<Record<Pass, 'pass' | 'fail' | 'not-run'>>; findings: Finding[] }

export const PASS_ORDER: readonly Pass[] = ['automated', 'keyboard', 'screen-reader', 'zoom-reflow', 'text-spacing', 'colour-forced', 'motion-pointer']

export function flowPasses(run: FlowRun): boolean {
  return PASS_ORDER.every((p) => run.passes[p] === 'pass') && !run.findings.some((f) => f.severity === 'blocker')
}
```

## Checklist
- [ ] Key flows listed; each run through all seven passes for a release.
- [ ] Keyboard pass covers skip link, order, visibility, 2.4.11 at 200%.
- [ ] Screen-reader pass on one desktop and one mobile pairing.
- [ ] Reflow at 320 px, 200% text, 1.4.12 spacing checked.
- [ ] Forced colours and reduced motion checked.
- [ ] 2.2 process checks (help, re-entry, authentication) done on flows.
- [ ] Every finding has a criterion, severity, evidence and fix.

## Sources
- https://www.w3.org/WAI/test-evaluate/preliminary/
- https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/
- https://www.w3.org/WAI/standards-guidelines/act/rules/
- https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
