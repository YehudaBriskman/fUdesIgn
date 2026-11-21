# Accessibility audit rubric and report template

> Score each key flow on 32 checks in 8 sections, 0–2 points each with evidence, map every finding to a WCAG 2.2 criterion and a severity, and write the report in a fixed shape (scope, method, summary score, findings by severity, automated results, what was not tested); ship at 80% or more with no must-check at 0 and no Blocker open.

**Category:** Review · **Applies to:** audits of any UI type, release gates, vendor and ACR preparation · **Priority:** must

## When to use / when not
- **Use** at the end of a build, before release, and for periodic audits. Score per flow (sign-in, search, checkout…) and per template.
- **Domain rubrics** score their own areas in more depth and can be run alongside: dashboard-ui `ref-design-review-rubric.md`, forms-ui `fref-form-review-rubric.md`, marketing-ui `mkref-review-rubric.md`, mobile-ui `moref-mobile-review-rubric.md`, motion-ui `mref-motion-review-rubric.md`, ai-ui `airef-review-rubric.md`.
- **Not** a WCAG conformance claim on its own; a formal claim needs the full criterion list (`a11y-wcag22-aa-map.md`) and WCAG-EM sampling.

## Rules (do)
- **Scoring:** 2 = passes everywhere tested; 1 = minor gaps; 0 = fails on a key flow or blocks a task. Must-checks are marked **M**.

| # | Section · check | Criteria | Owner |
|---|---|---|---|
| S1 **M** | Structure · one `main`, labelled navs, every block in a landmark | 1.3.1 | `a11y-structure-landmarks-headings.md` |
| S2 **M** | Structure · one h1, no skipped levels, no fake headings | 1.3.1, 2.4.6 | same |
| S3 **M** | Structure · unique title per page/route; `lang` correct | 2.4.2, 3.1.1, 3.1.2 | same |
| S4 | Structure · skip link first and working | 2.4.1 | same |
| N1 **M** | Names · every control named; name contains visible label | 4.1.2, 2.5.3 | `a11y-names-roles-states.md` |
| N2 **M** | Names · images have correct alt; decorative hidden | 1.1.1 | same |
| N3 | Names · repeated controls and links disambiguated | 2.4.4 | same |
| N4 **M** | ARIA · native first; custom widgets follow APG fully | 4.1.2 | `aaria-first-rule-and-apg.md` |
| N5 | ARIA · no misuse from the catalogue | 4.1.2, 1.3.1 | `aaria-common-misuse.md` |
| K1 **M** | Keyboard · everything operable, no traps | 2.1.1, 2.1.2 | `a11y-keyboard-focus-order.md` |
| K2 **M** | Keyboard · order follows reading order | 2.4.3 | same |
| K3 **M** | Focus · ring visible, ≥ 2 px, ≥ 3:1 | 2.4.7, 1.4.11 | same |
| K4 **M** | Focus · never fully hidden by sticky or fixed content | 2.4.11 | same |
| K5 | Focus · overlays move and restore focus; removals hand it on | 2.4.3 | same |
| K6 | Keyboard · single-key shortcuts can be turned off | 2.1.4 | same |
| P1 **M** | Pointer · targets ≥ 24 px or spaced | 2.5.8 | `a11y-pointer-targets-dragging.md` |
| P2 **M** | Pointer · every drag has a single-pointer alternative | 2.5.7 | same |
| P3 | Pointer · gestures have single-tap equivalents; up-event activation | 2.5.1, 2.5.2 | same |
| C1 **M** | Colour · text 4.5:1 / 3:1 large in every theme | 1.4.3 | `a11y-colour-and-contrast.md` |
| C2 **M** | Colour · UI and graphics 3:1; no colour-only meaning | 1.4.11, 1.4.1 | same |
| C3 | Colour · usable in forced colours | 1.4.11, 2.4.7 | `a11y-forced-colours-high-contrast.md` |
| R1 **M** | Resize · reflow at 320 px, no page-level horizontal scroll | 1.4.10 | `a11y-resize-reflow-text-spacing.md` |
| R2 | Resize · 200% text and 1.4.12 spacing lose nothing | 1.4.4, 1.4.12 | same |
| R3 | Resize · hover/focus content dismissible, hoverable, persistent | 1.4.13 | same |
| M1 **M** | Motion · auto-motion pausable; no flashing | 2.2.2, 2.3.1 | `a11y-motion-vestibular.md` |
| M2 | Motion · reduced motion substitutes; timeouts adjustable | 2.3.3 (house), 2.2.1 | same |
| F1 **M** | Forms · labels, errors identified and suggested, input purpose | 3.3.1–3.3.3, 1.3.5 | forms-ui `ffound-form-accessibility.md` |
| F2 | Forms · consistent help, no redundant entry | 3.2.6, 3.3.7 | `a11y-help-entry-authentication.md` |
| F3 **M** | Forms · authentication without cognitive tests | 3.3.8 | same |
| A1 **M** | Announce · status messages announced, not over-announced | 4.1.3 | `aaria-live-regions-announcements.md` |
| T1 **M** | Testing · automated run clean at WCAG 2.2 AA tags | — | `atest-automated-axe-playwright.md` |
| T2 **M** | Testing · keyboard and two screen-reader pairings done | — | `atest-manual-test-plan.md` |

- **Ship rule:** total ≥ 80% (≥ 52 of 64) **and** no must-check at 0 **and** no open Blocker.
- **Severity per finding:** Blocker (task impossible) · Major (task very hard or needs a workaround) · Minor (friction).
- **Report template:**
  1. **Summary:** product, version, date, auditor; score per flow; ship decision; top three risks.
  2. **Scope:** flows, templates, viewports, themes; what was out of scope.
  3. **Method:** WCAG 2.2 AA; tools and versions (axe-core, browsers); screen reader + browser pairings and versions; manual passes run.
  4. **Findings**, sorted by severity, each as: `ID · flow/step · WCAG criterion · severity · evidence (screenshot, transcript, selector) · fix (owner pattern) · status`.
  5. **Automated results:** violations by rule, incomplete items triaged, coverage caveat.
  6. **Not tested / limitations:** honest list.
  7. **Statement inputs:** known limitations and dates for `alaw-accessibility-statement.md`.

## Anti-patterns (don't)
- Scores without evidence ("looks fine").
- Findings without a criterion or a fix.
- Averaging away a Blocker: one 0 on a must-check fails the release whatever the total.
- Auditing only the happy path.
- Reports that omit what wasn't tested.

## Good references
- [W3C — WCAG-EM Evaluation Methodology](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/) — scope, sample, audit, report.
- [W3C WAI — WCAG-EM Report Tool](https://www.w3.org/WAI/eval/report-tool/) — a structured report you can export.
- [ITI — VPAT (Accessibility Conformance Report template)](https://www.itic.org/policy/accessibility/vpat) — WCAG, Section 508 and EN 301 549 editions for procurement.
- [GOV.UK Service Manual — Testing for accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility) — audit timing and fixing before release.

## Bad references
- One-page "accessibility certificates" with a score and no findings, method or scope.

## Accessibility
- Deliver the report itself as accessible HTML or tagged PDF.

## Motion / interaction (if relevant)
- M1 and M2 cover motion; for depth use motion-ui `mref-motion-review-rubric.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Checks | 32 (21 must) | Rubric |
| Points | 0–2 each; 64 max | Score |
| Ship threshold | ≥ 80% (52/64), no must at 0, no Blocker | Gate |
| Severity | Blocker / Major / Minor | Findings |

## Implementation sketch
```ts
type Score = 0 | 1 | 2
interface Check { id: string; must: boolean; score: Score; evidence: string }

export interface AuditResult { percent: number; failedMusts: string[]; ship: boolean }

export function scoreAudit(checks: readonly Check[], openBlockers: number): AuditResult {
  const max = checks.length * 2
  const total = checks.reduce((sum, c) => sum + c.score, 0)
  const percent = max === 0 ? 0 : Math.round((total / max) * 100)
  const failedMusts = checks.filter((c) => c.must && c.score === 0).map((c) => c.id)
  return { percent, failedMusts, ship: percent >= 80 && failedMusts.length === 0 && openBlockers === 0 }
}
```

## Checklist
- [ ] All 32 checks scored per key flow, each with evidence.
- [ ] Every finding has a criterion, severity, evidence and fix.
- [ ] Ship rule applied: ≥ 80%, no must at 0, no open Blocker.
- [ ] Report includes scope, method, tool and AT versions, and what wasn't tested.
- [ ] Known limitations passed to the accessibility statement.

## Sources
- https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/
- https://www.w3.org/WAI/eval/report-tool/
- https://www.w3.org/TR/WCAG22/
- https://www.itic.org/policy/accessibility/vpat
- https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility
