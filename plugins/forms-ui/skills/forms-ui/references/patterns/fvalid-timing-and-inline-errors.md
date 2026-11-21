# Validation timing and inline errors

> Validate a field when the user leaves it after changing it (`:user-invalid` / blur), never while they type; clear the error as soon as the value is fixed; validate everything again on submit; and show each error as text directly above the field, kept until fixed.

**Category:** Validation · **Applies to:** every form with client-side checks · **Priority:** must

## When to use / when not
- **The disagreement, and the house rule.**
  - *Baymard* and *Luke Wroblewski's 2009 study* favour inline validation: in Wroblewski's test, on-blur ("after") validation gave a 22% rise in success, 22% fewer errors, 31% higher satisfaction and 42% faster completion than submit-only. Baymard's 2024 benchmark finds 31% of sites offer no inline validation at all, and that premature validation (while typing) is a frequent failure among those that do.
  - *GOV.UK* validates on submit only: its research found inline messages interrupt, are missed by screen-reader users, and fire on half-finished answers.
  - *Adam Silver* (Form Design Patterns) also argues for submit-time validation for most fields.
  - **House rule:** submit-time validation is mandatory and complete. Add on-blur validation for format checks the user can fix immediately (email shape, postcode, date validity, password rules), only after the field was edited, and never on keystroke. Server checks (username taken, card declined) run on blur or submit, shown inline the same way.
- **Live, positive feedback while typing** is acceptable for one case: rules people need to meet as they type (password requirements checklist, character count), shown as neutral progress, not red errors.

## Rules (do)
- **Event timing** (modern-web-guidance forms guide):

| Event | Do |
|---|---|
| `input` | Only *clear* an error once the value becomes valid. Never add one. |
| `blur` / `change` (field was edited) | Run the field's checks; show the error if any. |
| `submit` | Run every check, block, show all errors, move focus to the summary (`fvalid-error-summary-and-focus.md`). |

- **Style with `:user-invalid`**, not `:invalid`. `:user-invalid` matches only after the user has interacted with the field or tried to submit, so empty required fields aren't red on load. Baseline widely available (Chrome 119, Firefox 88, Safari 16.5). Fall back with a `data-touched` attribute set on blur where unsupported.
- **Error position**: above the field, below label and hint (GOV.UK order: label → hint → error → field). Above keeps it visible when the on-screen keyboard or autofill pop-up covers the area below the field. Below the field is acceptable if your system already does that consistently (Carbon, Polaris); never at the top of the form only, and never in a tooltip or toast.
- **Error styling**: a red left border on the whole field group (4–5 px, GOV.UK) or a 2 px red field border, plus an icon and the message text in `--danger-fg`. Never colour alone (WCAG 1.4.1): the text is the signal.
- **Programmatic link**: `aria-invalid="true"` on the field and the error's id added to `aria-describedby` only while the error shows; remove both when fixed.
- **Keep the user's input.** Never clear a field because it is invalid (except password fields after a failed sign-in, by convention).
- **One message per field**: the first failing rule, most important first ("Enter an email address" before "Email address must include @").
- **Native constraint attributes** (`required`, `type`, `minlength`, `maxlength`, `pattern`, `min`, `max`, `step`) drive the checks; replace the browser's default bubble text with your own via `setCustomValidity` or render your own message and use `novalidate` on the form. Don't mix the two.
- **Server validation is the authority.** Client checks are for speed; always re-validate on the server and render server errors in the same inline slots.
- **Don't validate optional empty fields.** Baymard recommends "positive inline validation" (a tick) on all fields; GOV.UK shows none. House rule: show a tick only where the outcome was uncertain (username available, card number recognised, password rules met), because a tick beside "Name" adds noise without information.
- **Don't disable submit** to enforce validity (see `fflow-submit-buttons-and-double-submit.md`).

## Anti-patterns (don't)
- Red error after the first keystroke in an email field ("Enter a valid email" at "a").
- Errors on load for empty required fields (`:invalid` styling).
- Errors only in a toast, an alert dialog, or the browser's native bubble that vanishes.
- Moving focus back into a field on blur because it's invalid (a focus trap).
- Clearing the field on error.
- Errors that appear on blur when the user merely tabbed through without typing.
- Reflowing the page on every error: reserve no space, but don't animate the push either.

## Good references
- [A List Apart — Inline validation in web forms (Wroblewski)](https://alistapart.com/article/inline-validation-in-web-forms/) — the study and the on-blur result.
- [Baymard — Usability testing of inline form validation](https://baymard.com/blog/inline-form-validation) — premature validation, persistence and placement findings.
- [GOV.UK Design System — Validation](https://design-system.service.gov.uk/patterns/validation/) — why submit-time validation, error summary + inline messages.
- [modern-web-guidance — Validate input after interaction](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md) — `:user-invalid`, its fallback and `aria-invalid` syncing.
- [MDN — :user-invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid) — matching rules and support.
- [Adam Silver — The problem with live validation](https://adamsilver.io/blog/the-problem-with-live-validation-and-what-to-do-instead/) — the case against validating as people type, and what to do instead.

## Bad references
- [Baymard — Inline validation](https://baymard.com/blog/inline-form-validation) — its examples of "premature" errors that appear before users finish typing and of errors that disappear before users read them.
- Sign-up forms that colour every field green and red as you type, with the message inside a tooltip on the field.

## Accessibility
- Error text is real text, linked by `aria-describedby`; `aria-invalid` set only while invalid (WCAG 3.3.1, 4.1.2).
- Don't announce blur-time errors with `role="alert"`: the user is moving to the next field and the interruption collides with its label. The error is read when they return to the field. Submit-time errors are announced via the summary.
- Errors say how to fix (WCAG 3.3.3; see `fvalid-error-messages.md`).
- The error border keeps ≥ 3:1 and does not replace the focus ring.

## Motion / interaction (if relevant)
- Errors appear instantly. No shaking fields (they read as punishment and fail under vestibular sensitivity).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--error-bar` | 4px solid `--danger-fg`, inline-start of the field group | Group marker |
| `--field-border-error` | 2px solid `--danger-fg` | Field border while invalid |
| Error text | `--type-body` 600, `--danger-fg`, icon + text | Message |
| Timing | blur after edit; clear on input; full check on submit | Events |

## Implementation sketch
```html
<div class="field">
  <label for="email">Email address</label>
  <p id="email-err" class="error-msg" hidden><span aria-hidden="true">⚠</span> <span class="visually-hidden">Error:</span> <span class="msg-text"></span></p>
  <input id="email" name="email" type="email" autocomplete="email" required spellcheck="false">
</div>
```
```css
.field.has-error { border-inline-start: 4px solid var(--danger-fg); padding-inline-start: var(--space-4, 16px); }
.error-msg { margin: 0; font-weight: 600; color: var(--danger-fg); }
.error-msg[hidden] { display: none; }
:where(input, select, textarea):user-invalid,
:where(input, select, textarea)[aria-invalid="true"] { border: 2px solid var(--danger-fg); }
```
```ts
type Check = (el: HTMLInputElement) => string | null

// Blur-after-edit validation that only ever *clears* while typing.
export function wireField(el: HTMLInputElement, errorEl: HTMLElement, check: Check): () => boolean {
  let edited = false
  const show = (msg: string | null): void => {
    const field = el.closest('.field')
    const ids = (el.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => id && id !== errorEl.id)
    if (msg) ids.push(errorEl.id)
    el.setAttribute('aria-describedby', ids.join(' '))
    el.setAttribute('aria-invalid', String(Boolean(msg)))
    errorEl.hidden = !msg
    const text = errorEl.querySelector('.msg-text')
    if (text) text.textContent = msg ?? ''
    field?.classList.toggle('has-error', Boolean(msg))
  }
  el.addEventListener('input', () => { edited = true; if (el.getAttribute('aria-invalid') === 'true' && !check(el)) show(null) })
  el.addEventListener('blur', () => { if (edited) show(check(el)) })
  return () => { const msg = check(el); show(msg); return msg === null } // call on submit
}

export const emailCheck: Check = (el) =>
  el.value.trim() === '' ? (el.required ? 'Enter an email address' : null)
  : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) ? null
  : 'Enter an email address in the correct format, like name@example.com'
```

## Checklist
- [ ] Submit runs every check; blur runs format checks only after an edit; typing only clears.
- [ ] Error styling uses `:user-invalid` or an equivalent "touched" flag, never `:invalid` on load.
- [ ] Each error is text above (or consistently below) its field, with icon and colour as extra cues.
- [ ] `aria-invalid` and `aria-describedby` are set while invalid and removed when fixed.
- [ ] Input is never cleared or refocused because it's invalid.
- [ ] The server re-validates, and server errors render in the same inline slot.

## Sources
- https://alistapart.com/article/inline-validation-in-web-forms/
- https://baymard.com/blog/inline-form-validation
- https://design-system.service.gov.uk/patterns/validation/
- https://design-system.service.gov.uk/components/error-message/
- https://adamsilver.io/blog/the-problem-with-live-validation-and-what-to-do-instead/
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (validation event timing)
- https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
