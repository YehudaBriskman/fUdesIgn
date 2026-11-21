# Form review rubric

> Score a form on 31 testable checks, 0–2 each, across seven areas; ship at 80% or more with no must-check at 0, and report every failed check with evidence and the fixing pattern.

**Category:** References · **Applies to:** design reviews, PR reviews, audits of forms and flows · **Priority:** must

## When to use / when not
- **Use** before calling any form done, after a pass over `fref-form-anti-patterns.md`.
- **Score per form**, not per page; a multi-step flow is one form, with F-checks applied to the whole flow.
- **Skip checks that can't apply** (no file upload → skip I6) and score out of the remaining maximum.

## Rules (do)
- **Scoring**: 2 = fully meets, 1 = partly (some fields or states miss), 0 = fails or absent. **M** marks must-checks: a 0 on any of them blocks shipping regardless of the total.
- **Evidence**: each score cites what was tested (selector, screenshot, keyboard path or file:line).
- **How to test** column says the fastest reliable test.

**Layout and copy (L)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| L1 | One column; only fixed short pairs share a row; reflows at 320 px | M | Resize to 320 px; Tab through | `ffound-layout-single-column-grouping.md` |
| L2 | Label gap < field gap < group gap; related controls in fieldset + legend |  | Inspect spacing; DOM | same |
| L3 | Every field is needed; optional ones marked "(optional)" (or asterisk + legend) | M | Read labels; ask "why" per field | `ffound-required-optional-marking.md` |
| L4 | Buttons say verb + object; final step names its consequence/amount |  | Read buttons | `ffound-form-microcopy.md` |
| L5 | Surprising/personal fields say why; long forms say what you need and how long |  | Read hints and intro | same |

**Labels and inputs (I)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| I1 | Visible, persistent label for every control; hints above fields via `aria-describedby`; no placeholder-only info | M | Clear a field, type; inspect | `ffound-labels-hints-placeholders.md` |
| I2 | Correct `type`, `inputmode`, `enterkeyhint`; no `type="number"` on identifiers or money | M | Phone test of each field's keyboard | `finput-types-autocomplete-keyboards.md` |
| I3 | `autocomplete` tokens on all user-data fields; browser autofill fills the form correctly | M | Autofill with a saved profile | same |
| I4 | Choice controls match the decision table (radios 2–6, select 7–15, combobox beyond; switch only for instant effect) |  | Count options; check save model | `finput-choice-controls.md` |
| I5 | Money, numbers, dates and phones accept locale formats and show the expected format |  | Type "1.234,5", "3-9-2017", "+44 (0)20…" | `finput-money-number-phone.md`, `finput-dates-and-times.md` |
| I6 | File upload states types and size first, has a native button, per-file status and remove |  | Upload a too-big and a wrong-type file | `finput-file-upload.md` |
| I7 | Custom selects/comboboxes follow APG keys and roles; nothing auto-selects or submits |  | Keyboard + screen reader | `finput-select-combobox-autocomplete.md` |

**Validation and errors (V)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| V1 | No error before the user finishes a field; errors clear as soon as fixed | M | Type a partial email; fix an error | `fvalid-timing-and-inline-errors.md` |
| V2 | Every error is text next to its field, with icon, `aria-invalid`, `aria-describedby` | M | Submit empty; inspect | same |
| V3 | Failed submit shows a linked error summary, focuses it and prefixes the title "Error:" (or focuses the first error for ≤ 3 fields) | M | Submit with 3+ errors | `fvalid-error-summary-and-focus.md` |
| V4 | Messages say how to fix, name the field as labelled, no blame or codes | M | Read every message | `fvalid-error-messages.md` |
| V5 | Server errors render in the same slots; answers are kept |  | Force a server-side error | `fvalid-timing-and-inline-errors.md` |

**Submission (S)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| S1 | Submit enabled until a valid submit starts | M | Load the empty form | `fflow-submit-buttons-and-double-submit.md` |
| S2 | Busy state on the button within 100 ms, same width, `aria-disabled` |  | Throttle network; click | same |
| S3 | Double clicks and retries can't create duplicates (client guard + idempotency key) | M | Double-click on slow network; replay request | same |
| S4 | Success names what happened; failure says what was saved and keeps answers | M | Submit both ways | same |
| S5 | Money, legal and destructive submits have review, confirmation or undo (WCAG 3.3.4) | M | Walk the final step | same |

**Flows (F)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| F1 | Steps show position; Back (link and browser) keeps answers; each step validates on Continue |  | Go forward 2, back 2 | `fflow-multi-step-and-save-progress.md` |
| F2 | Check-answers page with Change links before final submit (multi-step) |  | Change an answer from the summary | same |
| F3 | Progress survives refresh, timeout and re-authentication; timeouts warn and extend | M | Refresh mid-flow; let session expire | same |
| F4 | No data asked twice in one process (WCAG 3.3.7) |  | Trace each data item | same |

**Authentication (P)** — skip if none

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| P1 | Password managers fill and save; paste works; show-password toggle; no confirm field | M | Save, sign out, sign in with a manager | `fflow-authentication-and-passkeys.md` |
| P2 | Passkeys offered (conditional UI + button) or a documented reason not to |  | Sign in on a passkey-enabled device | same |
| P3 | Credential and reset errors don't reveal whether an account exists | M | Try unknown email | same |

**Accessibility (X)**

| ID | Check | M | How to test | Pattern |
|---|---|---|---|---|
| X1 | Full keyboard path with visible focus; Enter submits; focus never obscured | M | Unplug the mouse | `ffound-form-accessibility.md` |
| X2 | Field borders and focus ≥ 3:1, text ≥ 4.5:1; field text ≥ 16 px; targets ≥ 24 px (44 touch) | M | Contrast checker; computed styles | same |

- **Totals**: 31 checks, 62 points (fewer when sections are skipped). **Ship** at ≥ 80% and no M at 0. **Revise** at 60–79%. **Redesign** below 60%.
- **Report**: score, percentage, the list of 0s and 1s as `ID · evidence · fix (pattern)`, then the top three fixes by user impact.

## Anti-patterns (don't)
- Scoring from screenshots alone: V, S, F and X need interaction.
- Averaging away a must-check failure.
- Scoring 2 for "mostly fine" without evidence.

## Good references
- [GOV.UK Service Manual — Service assessments](https://www.gov.uk/service-manual/service-assessments) — evidence-based assessment against a fixed standard.
- [W3C WAI — Easy checks](https://www.w3.org/WAI/test-evaluate/preliminary/) — fast manual accessibility checks behind X1–X2.
- [Baymard — Checkout optimization](https://baymard.com/blog/checkout-flow-average-form-fields) — benchmarked checkout criteria behind L3 and the P checks.

## Bad references
- Lighthouse-only "accessibility 100" sign-offs: automated tools catch only a minority of WCAG failures and none of V1, V3, S3 or F3.

## Accessibility
- X1, X2, I1, I3, V2, V3, V4 and P1 map directly to WCAG 2.2 AA criteria (see the table in `ffound-form-accessibility.md`).

## Motion / interaction (if relevant)
- Not scored separately; motion problems surface under X (focus) and S2 (busy state).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Checks | 31 (18 must) | Full rubric |
| Ship bar | ≥ 80%, no must at 0 | Release |
| Revise / redesign | 60–79% / < 60% | Outcome |

## Implementation sketch
```ts
export type Score = 0 | 1 | 2
export type Check = { id: string; must: boolean; score: Score | null; evidence: string } // null = not applicable

export type Verdict = { points: number; max: number; percent: number; blockers: string[]; outcome: 'ship' | 'revise' | 'redesign' }

export function scoreRubric(checks: readonly Check[]): Verdict {
  const applicable = checks.filter((c): c is Check & { score: Score } => c.score !== null)
  const points = applicable.reduce((sum, c) => sum + c.score, 0)
  const max = applicable.length * 2
  const percent = max ? Math.round((points / max) * 100) : 0
  const blockers = applicable.filter((c) => c.must && c.score === 0).map((c) => c.id)
  const outcome = blockers.length === 0 && percent >= 80 ? 'ship' : percent >= 60 ? 'revise' : 'redesign'
  return { points, max, percent, blockers, outcome }
}
```

## Checklist
- [ ] Every applicable check scored 0–2 with evidence.
- [ ] Must-checks at 0 listed as blockers.
- [ ] Percentage computed over applicable checks only.
- [ ] Report lists failures as `ID · evidence · fix (pattern)` and the top three fixes.

## Sources
- https://www.gov.uk/service-manual/service-assessments
- https://www.w3.org/WAI/test-evaluate/preliminary/
- https://www.w3.org/TR/WCAG22/
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://design-system.service.gov.uk/patterns/
