# Mobile forms: keyboards, input modes and autofill

> Get the right keyboard and autofill for every field (`type`, `inputmode`, `autocomplete`, `enterkeyhint`), keep inputs at 16 px or more, use one column with labels above fields, and never split one value across several boxes.

**Category:** Input · **Applies to:** sign-in, sign-up, checkout, address, search, OTP, settings and any text entry on touch · **Priority:** must

## When to use / when not
- **Use** for every form that can be filled on a phone.
- **Scope:** this file covers what is different on touch (keyboards, autofill, focus, layout). General form design (labels, validation timing, error summaries) belongs to a forms pattern set; the dashboard-ui file `comp-inline-edit-and-forms.md` covers in-table editing.

## Rules (do)
- **Pick the keyboard with `type` and `inputmode`:**
| Data | Markup | Keyboard |
|---|---|---|
| Email | `type="email" autocomplete="email"` | @ and . keys |
| Phone | `type="tel" autocomplete="tel"` | phone pad |
| One-time code | `type="text" inputmode="numeric" autocomplete="one-time-code"` | digits, SMS code suggestion |
| PIN, card number, postcode (US) | `type="text" inputmode="numeric" pattern="[0-9]*"` | digits, no spinner |
| Amount, quantity with decimals | `type="text" inputmode="decimal"` | digits and the locale's decimal separator |
| URL | `type="url"` | / and .com keys |
| Search | `type="search" enterkeyhint="search"` | Search key |
- **Avoid `type="number"`** for codes, cards and amounts: it adds spinners, drops leading zeros, and scroll-wheel changes values. Use `inputmode` instead (modern-web-guidance `forms/forms.md`).
- **`enterkeyhint`** labels the Enter key: `next` between fields, `done` on the last field of a step, `go`/`send`/`search` for submit-like actions.
- **Autofill everything it knows.** `autocomplete` tokens (`name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `cc-exp`, `cc-csc`, `username`, `current-password`, `new-password`, `one-time-code`) let iOS and Android fill fields from contacts, password managers and cards; Baymard found autofill and fewer fields are the largest wins in mobile checkout.
- **Turn off what hurts:** `autocapitalize="none" autocorrect="off" spellcheck="false"` on usernames, emails and codes; `autocapitalize="words"` on names.
- **16 px minimum** input font size (iOS Safari zooms on focus below 16 px).
- **One column, labels above fields,** full-width inputs 44–48 px tall, 16–24 px between fields. Side-by-side fields only for short pairs that belong together (expiry month and year; city and postcode) at 360 px and up.
- **Native pickers** for dates and times (`type="date"`, `type="time"`) on mobile; they open the OS wheel or calendar. Use a custom picker only when the native one cannot express the task (date ranges, see dashboard-ui `comp-date-range-picker.md`).
- **Selects:** under about 7 options, use radio buttons (visible at once); above about 15, use a searchable list in a sheet; the native `<select>` opens the OS picker in between.
- **OTP:** one field, not six boxes (modern-web-guidance `forms/sms-otp-form.md`); the WebOTP API (Chromium on Android) and iOS's "From Messages" suggestion fill it.
- **Keep the submit visible:** a sticky bottom action or a button directly after the last field; the keyboard must not hide errors (`scroll-margin-block`, see `mofound-viewport-units-keyboard.md`).
- **Preserve input** through rotation, app switching and back navigation (bfcache, or save drafts to `sessionStorage`).

## Anti-patterns (don't)
- `type="number"` for card numbers, phone numbers or OTPs.
- Six auto-advancing OTP boxes that break paste and autofill.
- Placeholder text as the only label: it disappears as soon as the user types.
- Custom JavaScript date wheels that ignore the OS picker and its accessibility.
- `autocomplete="off"` on sign-in fields "for security", which blocks password managers.
- Disabling paste in password or confirmation fields.
- Two columns of fields at 390 px.

## Good references
- [MDN: inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode) and [enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint): the values and what each keyboard shows.
- [WHATWG HTML: Autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill): the full `autocomplete` token list.
- [modern-web-guidance: Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md): `inputmode`, `enterkeyhint` and the no-split-fields rule; [SMS OTP form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md); [Autofill payment form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-payment-form.md).
- [Baymard: Mobile checkout usability](https://baymard.com/blog/mobile-form-usability-autocomplete): autofill, keyboard and field-count findings from mobile checkout testing.
- [GOV.UK Design System: Text input](https://design-system.service.gov.uk/components/text-input/): `inputmode="numeric"` instead of `type="number"`, with the reasons.
- [web.dev: Sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices): `autocomplete` for passwords and usernames.

## Bad references
- [GOV.UK: Why the GOV.UK Design System team changed the input type for numbers](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/): the documented problems with `type="number"` (scroll changes, rounding, accessibility) that led them to `inputmode`.
- Banking sign-in pages that block paste into password fields, breaking password managers.

## Accessibility
- Every field has a visible `<label>`; hints and errors linked with `aria-describedby`; errors announced (`role="alert"` or a summary that receives focus).
- WCAG 1.3.5 Identify Input Purpose (AA): `autocomplete` on fields about the user.
- WCAG 3.3.8 Accessible Authentication (AA): allow paste and password managers; no cognitive tests.
- Targets 44–48 px; checkboxes and radios with full-row labels (`mofound-touch-targets.md`).

## Motion / interaction (if relevant)
- No animated label tricks that move text while the user is typing. An error appears on blur or submit, not on every keystroke (modern-web-guidance `forms/validate-input-after-interaction.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mo-type-input` | max(1rem, 16px) | input text |
| input height | 44–48px | text fields, selects |
| field gap | 16–24px | between fields |
| label gap | 4–8px | label to field |
| radios instead of select | ≤ 7 options | visible choices |
| searchable sheet | ≥ 15 options | long lists (countries) |

## Implementation sketch
```css
.field { display: grid; gap: var(--space-1); margin-block-end: var(--space-5); }
.field input, .field select {
  font-size: var(--mo-type-input);
  min-block-size: 48px;
  padding-inline: var(--space-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text);
  scroll-margin-block: 96px;
}
.field input:user-invalid { border-color: var(--danger-fg); }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
@media (width < 360px) { .pair { grid-template-columns: 1fr; } }
```
```html
<form id="checkout">
  <div class="field"><label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" enterkeyhint="next" required></div>
  <div class="field"><label for="cc">Card number</label>
    <input id="cc" name="cc" type="text" inputmode="numeric" autocomplete="cc-number" enterkeyhint="next"></div>
  <div class="pair">
    <div class="field"><label for="exp">Expiry (MM/YY)</label><input id="exp" name="exp" inputmode="numeric" autocomplete="cc-exp" enterkeyhint="next"></div>
    <div class="field"><label for="zip">Postcode</label><input id="zip" name="zip" autocomplete="postal-code" enterkeyhint="done"></div>
  </div>
  <div class="field"><label for="otp">Code from SMS</label>
    <input id="otp" name="otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></div>
</form>
```

## Checklist
- [ ] Each field opens the right keyboard (checked on a real iPhone and Android phone).
- [ ] Every user-data field has the right `autocomplete` token; sign-in works with a password manager.
- [ ] No `type="number"` on codes, cards, phones or amounts; no split OTP boxes.
- [ ] Inputs are 16 px or more; there is no zoom on focus and no `maximum-scale`.
- [ ] One column at 390 px; labels above fields; 44–48 px fields.
- [ ] The submit button and the current field's error are visible with the keyboard open.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- https://baymard.com/blog/mobile-form-usability-autocomplete
- https://design-system.service.gov.uk/components/text-input/
- https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
- https://web.dev/articles/sign-in-form-best-practices
- https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
- https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-payment-form.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md
