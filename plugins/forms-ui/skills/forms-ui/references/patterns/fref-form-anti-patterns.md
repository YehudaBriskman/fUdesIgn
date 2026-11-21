# Form anti-pattern catalogue

> Check every form against these 16 recurring failures before review; each one has a detectable symptom, the harm it causes and the pattern file that fixes it.

**Category:** References · **Applies to:** design reviews, code reviews and audits of any form · **Priority:** must

## When to use / when not
- **Use** as a fast first pass before scoring with `fref-form-review-rubric.md`, and when reviewing a pull request that touches a form.
- **Don't** treat absence of these as "done": the rubric covers the positive requirements.

## Rules (do)
Each row: what you see, how to detect it, why it hurts, and the fix.

| # | Anti-pattern | Detect | Harm | Fix |
|---|---|---|---|---|
| A1 | **Placeholder as label** | `input[placeholder]` with no `<label>` or `aria-labelledby` | Instructions vanish on typing; low contrast; fails 3.3.2 | `ffound-labels-hints-placeholders.md` |
| A2 | **Multi-column layout of unrelated fields** | Two or more fields per row outside fixed pairs | Skipped fields, zig-zag Tab order, slower completion | `ffound-layout-single-column-grouping.md` |
| A3 | **Unmarked or over-marked requirement** | No "(optional)" and no asterisk legend; or asterisks on every field | Guessing, then submit errors | `ffound-required-optional-marking.md` |
| A4 | **Validation while typing** | Error appears on the first `input` event | Users told they're wrong before they finish | `fvalid-timing-and-inline-errors.md` |
| A5 | **Errors far from the field** | Toast, top-only banner, or `alert()` | Users can't find what to fix; fails 3.3.1 | `fvalid-timing-and-inline-errors.md`, `fvalid-error-summary-and-focus.md` |
| A6 | **Generic error text** | "Invalid input", "Error", codes | No path to recovery; fails 3.3.3 | `fvalid-error-messages.md` |
| A7 | **Disabled submit until valid** | `button[type=submit][disabled]` on load | Users don't know what's missing; button unreachable by screen readers | `fflow-submit-buttons-and-double-submit.md` |
| A8 | **No double-submit protection** | No in-flight guard, no idempotency key | Duplicate orders and payments | `fflow-submit-buttons-and-double-submit.md` |
| A9 | **`type="number"` for identifiers or money** | Card, phone, postcode, OTP or amount with `type="number"` | Lost leading zeros, scroll-wheel changes, locale rejection | `finput-types-autocomplete-keyboards.md`, `finput-money-number-phone.md` |
| A10 | **Missing or wrong `autocomplete`** | User-data fields without tokens; `autocomplete="off"` on login | Retyping, autofill failures; fails 1.3.5 | `finput-types-autocomplete-keyboards.md` |
| A11 | **Paste blocked** | `paste` listener calling `preventDefault`, `onpaste` | Weaker passwords, fails 3.3.8 | `fflow-authentication-and-passkeys.md` |
| A12 | **Split single values** | 6 OTP boxes, 3 phone boxes, first/last name for a global audience | Autofill and paste break; names that don't fit | `finput-types-autocomplete-keyboards.md` |
| A13 | **Wrong choice control** | Select with 2–3 options; switch inside a Save form; radios in a row of 5 | Hidden options, unclear when settings apply | `finput-choice-controls.md` |
| A14 | **Custom widgets without semantics** | `<div>` dropdowns, checkboxes or buttons; no keyboard | Unusable by keyboard and screen readers | `finput-select-combobox-autocomplete.md`, `ffound-form-accessibility.md` |
| A15 | **Lost work** | Refresh, Back, timeout or server error clears answers | Abandonment; fails 2.2.1 and 3.3.7 in spirit | `fflow-multi-step-and-save-progress.md` |
| A16 | **Field text under 16 px on mobile** | Computed `font-size` < 16px on inputs | iOS zooms on every focus | `ffound-form-accessibility.md` |

## Anti-patterns (don't)
- Fixing a symptom in CSS only (hiding an asterisk visually but leaving "star" announced; turning red text bold without adding words).
- Adding a confirm-email field to "fix" typos (use show-password and confirmation emails instead).
- Replacing an error summary with a toast "for a cleaner look".

## Good references
- [GOV.UK Design System — Patterns](https://design-system.service.gov.uk/patterns/) — each pattern lists the research behind its rules; the inverse of most rows above.
- [Baymard — Checkout optimization: minimize form fields](https://baymard.com/blog/checkout-flow-average-form-fields) — field count, account creation and other checkout failures with benchmark data.
- [W3C WAI — Forms tutorial](https://www.w3.org/WAI/tutorials/forms/) — the accessibility side of A1, A5, A6 and A14.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — DON'T lists covering A7, A9, A11 and A12.

## Bad references
- [W3C WAI — Before and After demo: inaccessible survey](https://www.w3.org/WAI/demos/bad/before/survey.html) — a deliberately broken form showing A1, A3, A5 and A14 together.
- [NN/g — Hostile patterns in error messages](https://www.nngroup.com/articles/hostile-error-messages/) — A5 and A6 in the wild.
- [NCSC — Let them paste passwords](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords) — A11.

## Accessibility
- A1, A3, A5, A6, A10, A11, A14 and A16 are WCAG failures, not just usability issues; treat them as blockers.

## Motion / interaction (if relevant)
- Shaking fields on error and animated success confetti on money actions are anti-patterns too (`fvalid-timing-and-inline-errors.md`, dashboard-ui non-negotiable 29).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Blocker rows | A1, A3, A5, A6, A7, A8, A10, A11, A14, A15, A16 | Must be fixed before shipping |
| Report format | `A<n> · selector or file:line · fix` | Review findings |

## Implementation sketch
```ts
// A quick DOM audit for the mechanically detectable rows. Run in the browser console or a test.
export type Finding = { id: string; el: Element; note: string }

export function auditForm(root: ParentNode = document): Finding[] {
  const out: Finding[] = []
  const controls = root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"], [type="submit"], [type="button"]), select, textarea')
  for (const el of controls) {
    if (el.labels?.length === 0 && !el.getAttribute('aria-labelledby')) out.push({ id: 'A1', el, note: 'no <label>' })
    if (el instanceof HTMLInputElement && el.type === 'number' && /card|cc-|tel|postal|one-time|zip|amount|price/i.test(`${el.name} ${el.autocomplete}`))
      out.push({ id: 'A9', el, note: 'type="number" on an identifier or amount' })
    if (el instanceof HTMLInputElement && el.type === 'password' && el.autocomplete === 'off') out.push({ id: 'A10', el, note: 'autocomplete=off on a password' })
    if (Number.parseFloat(getComputedStyle(el).fontSize) < 16) out.push({ id: 'A16', el, note: 'field text under 16px' })
  }
  for (const btn of root.querySelectorAll<HTMLButtonElement>('form button[type="submit"][disabled]'))
    out.push({ id: 'A7', el: btn, note: 'submit disabled before submit' })
  for (const sel of root.querySelectorAll('select'))
    if (sel.querySelectorAll('option:not([value=""])').length <= 3) out.push({ id: 'A13', el: sel, note: 'select with ≤ 3 options: use radios' })
  for (const group of root.querySelectorAll('[data-otp], .otp')) if (group.querySelectorAll('input').length > 1)
    out.push({ id: 'A12', el: group, note: 'one value split across several inputs' })
  return out
}
```

## Checklist
- [ ] A1–A16 checked; every finding reported as `A<n> · selector or file:line · fix`.
- [ ] Blocker rows fixed, or waived with a written reason.
- [ ] The DOM audit runs clean on each form page.
- [ ] The manual rows (A2, A4, A5, A8, A15) were tested by hand: type, tab, submit with errors, double-click, refresh.

## Sources
- https://design-system.service.gov.uk/patterns/
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://baymard.com/blog/inline-form-validation
- https://www.w3.org/WAI/tutorials/forms/
- https://www.w3.org/WAI/demos/bad/before/survey.html
- https://www.nngroup.com/articles/hostile-error-messages/
- https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
