# Required vs optional fields

> First remove every field you don't need; then, if most fields are required, mark the few optional ones with the word "(optional)" in the label; if you use an asterisk instead, explain it once at the top and still set `required` on the control.

**Category:** Form foundations · **Applies to:** every form with a mix of required and optional fields · **Priority:** must

## When to use / when not
- **Cut first.** Each optional field is a question someone has to read and decide to skip. Baymard finds most checkouts need only 8 form fields, yet the 2024 average was 11.3, and 17% of US shoppers have abandoned an order over a too long or complicated checkout. If you don't need the answer to deliver the service, delete the field.
- **Mark optional fields** when most fields are required (the normal case after cutting). This is GOV.UK's rule: "(optional)" after the label, no asterisks.
- **Mark required fields** only when most fields are optional (a long profile or preferences form). Then use the word "(required)" or an asterisk plus a one-line legend at the top: "Required fields are marked with an asterisk (*)".
- **Mark both** when the form is long and the split is close. Baymard found only about 14% of sites explicitly mark both kinds, and that users then guess which fields they can skip; marking both removes the guess.
- **A one-field form** (search, newsletter email) needs no marking.

## Rules (do)
- **The word beats the symbol.** "(optional)" is read by everyone, translated, and needs no legend. An asterisk is learned convention, is easy to miss at small sizes and needs explaining.
- **Mark in the label text**, not in the placeholder and not with colour alone.
- **Set `required` on every required control.** It gives screen readers "required", enables `:user-invalid` on empty fields and native submit-time validation. If you use custom validation with `novalidate`, keep `required` (or `aria-required="true"` on custom widgets) for the semantics.
- **Hide decorative asterisks from screen readers** (`<span aria-hidden="true">*</span>`), because `required` already announces "required" and "star" adds noise.
- **Groups:** required/optional applies to the question. Mark the `<legend>` ("Contact preferences (optional)"), not each checkbox.
- **Explain why** a sensitive or surprising required field is required, in the hint: "We need your phone number in case there's a problem with delivery" (Baymard found unexplained phone fields cause abandonment).
- **Don't disable the submit button** until required fields are filled. Let people submit, then show what is missing (see `fflow-submit-buttons-and-double-submit.md`, `fvalid-error-summary-and-focus.md`).
- **Error text for a missing answer** says what to enter, not that it is required: "Enter your email address", not "Email is required" (GOV.UK error message style, see `fvalid-error-messages.md`).

## Anti-patterns (don't)
- Red asterisks on every field of a form where everything is required. The marking carries no information.
- An asterisk with no explanation anywhere on the page.
- Asterisk announced as "star" by screen readers because it was not hidden and `required` was also set.
- Marking required-ness only in colour (a red label).
- "Optional" fields that the server then rejects when empty.
- Grey, disabled-looking optional fields. Optional is not disabled.

## Good references
- [GOV.UK Design System — Question pages: asking for optional information](https://design-system.service.gov.uk/patterns/question-pages/) — mark optional with "(optional)", avoid asterisks, ask only what you need.
- [NN/g — Marking required fields in forms](https://www.nngroup.com/articles/required-fields/) — use an asterisk with a legend, and test it, when most fields are required; mark clearly either way.
- [Baymard — Mark both required and optional fields](https://baymard.com/blog/required-optional-form-fields) — why explicit marking of both reduces skipped and abandoned fields.
- [modern-web-guidance — Required field feedback](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/required-field-feedback.md) — `required` plus `:user-invalid`, with the asterisk hidden from assistive tech.

## Bad references
- [Baymard — Required/optional marking](https://baymard.com/blog/required-optional-form-fields) — its examples of sites that mark nothing, leaving users to guess and then hit errors on submit.
- Sign-up forms with a red asterisk on each of 6 fields and no "optional" fields at all: 6 symbols, zero information.

## Accessibility
- `required` or `aria-required="true"` on every required control (WCAG 1.3.1, 3.3.2).
- The visible marker is text or a symbol with a legend, never colour alone (WCAG 1.4.1).
- Decorative asterisks are `aria-hidden="true"`.

## Motion / interaction (if relevant)
- None.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Optional marker | "(optional)" in `--text-muted`, same size as the label | After the label text |
| Required marker (when used) | `*` in `--text`, `aria-hidden` | Plus a legend at the top |
| Threshold | > 50% required → mark optional; > 50% optional → mark required | Which to mark |

## Implementation sketch
```html
<div class="field">
  <label for="org">Organisation <span class="optional">(optional)</span></label>
  <input id="org" name="org" autocomplete="organization">
</div>
<div class="field">
  <label for="tel">Phone number</label>
  <p id="tel-hint" class="hint">We only call if there's a problem with your delivery.</p>
  <input id="tel" name="tel" type="tel" autocomplete="tel" required aria-describedby="tel-hint">
</div>
```
```css
.optional { color: var(--text-muted); font-weight: 400; }
.req-mark { color: var(--text); margin-inline-start: 0.15em; }
```

## Checklist
- [ ] Every field is needed for the service; optional fields were justified one by one.
- [ ] The minority kind (usually optional) is marked in words in the label.
- [ ] Any asterisk is explained once and hidden from screen readers.
- [ ] Every required control carries `required` or `aria-required`.
- [ ] Surprising required fields explain why in the hint.
- [ ] Submit stays enabled; missing answers are reported after submit.

## Sources
- https://design-system.service.gov.uk/patterns/question-pages/
- https://www.nngroup.com/articles/required-fields/
- https://baymard.com/blog/required-optional-form-fields
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/required-field-feedback.md (Apache-2.0, paraphrased)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
