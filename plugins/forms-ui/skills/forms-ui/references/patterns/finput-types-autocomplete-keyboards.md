# Input types, autocomplete, inputmode and enterkeyhint

> Give every field the right `type`, an `autocomplete` token for anything about the user, an `inputmode` that summons the right keyboard and an `enterkeyhint` that names what Enter does; never block paste and never split one value across several boxes.

**Category:** Inputs · **Applies to:** text-like inputs: name, email, phone, address, password, codes, search, URLs, numbers that are identifiers · **Priority:** must

## When to use / when not
- **`type`** for semantics and validation: `email`, `tel`, `url`, `search`, `password`, `date`. Use `type="text"` + `inputmode` for anything numeric that is not a quantity you would add up (card numbers, postcodes, codes, account numbers).
- **`autocomplete`** on every field that collects data about the user (WCAG 1.3.5) and on credentials. `autocomplete="off"` only for values that are never the user's own data and must not be suggested (a one-off captcha, another person's details in an admin tool); browsers ignore it on login fields anyway.
- **Not `type="number"`** for identifiers: it drops leading zeros, shows spinners, changes value on scroll-wheel in some browsers and rejects spaces. For quantities and money see `finput-money-number-phone.md`.

## Rules (do)
- **Keyboards by `inputmode`** (MDN): `numeric` (0–9; PINs, codes, postcodes in numeric locales), `decimal` (digits + locale decimal separator; amounts), `tel` (phone pad), `email`, `url`, `search`, `text`, `none` (custom keyboard only).
- **Enter key label by `enterkeyhint`**: `next` on fields followed by more fields on mobile, `done` or `go` on the last field, `search` in search, `send` in chat. It only changes the label; it doesn't move focus, so don't use it to fake a "next field" behaviour that skips validation.
- **Autocomplete tokens that matter most** (HTML spec):

| Field | `type` | `autocomplete` | `inputmode` |
|---|---|---|---|
| Full name | text | `name` | — |
| Email | email | `email` (`username` on sign-in) | — |
| Phone | tel | `tel` | — (tel type implies) |
| Street address | textarea | `street-address` (or `address-line1`…`3`) | — |
| Postcode | text | `postal-code` | text (`numeric` only where postcodes are all digits) |
| Country | select | `country` (code) or `country-name` | — |
| Organisation | text | `organization` | — |
| Birth date | text ×3 | `bday-day`, `bday-month`, `bday-year` | numeric |
| Card number | text | `cc-number` | numeric |
| Card expiry | text | `cc-exp` (or `cc-exp-month`, `cc-exp-year`) | numeric |
| Security code | text | `cc-csc` | numeric |
| Name on card | text | `cc-name` | — |
| One-time code | text | `one-time-code` | numeric |
| New password | password | `new-password` | — |
| Current password | password | `current-password` | — |
| Username / passkey | text or email | `username webauthn` | — |

- **Section prefixes** keep two addresses apart: `shipping street-address`, `billing postal-code`; wrap each in a `<fieldset>`. Offer "Billing address is the same as delivery" checked by default (WCAG 3.3.7, Baymard).
- **One field per value.** One name field (`name`), one card-number field, one phone field, one OTP field. Split fields break autofill and paste, and assume a name or number shape that many users don't have. The modern-web-guidance forms, payment and OTP guides all say the same.
- **Turn off correction on identifiers**: `autocapitalize="none"`, `autocorrect="off"`, `spellcheck="false"` on usernames, emails, codes and URLs. Leave them on for prose.
- **Never block paste** or `autocomplete` on passwords, codes or confirmations. Blocking paste fails WCAG 3.3.8 and pushes people to weaker passwords (NCSC, NIST 800-63B).
- **Don't double up**: no "confirm email" or "confirm password" fields. Offer show-password instead and let the confirmation email catch typos (web.dev sign-up guidance).
- **Accept what people type**: trim spaces, accept spaces and dashes in card and phone numbers, accept lowercase postcodes, then normalise on the server.
- **Addresses**: for international users, a `street-address` textarea plus city, region and postcode as needed, with postcode optional where the country has none. Don't force Latin-only characters in names (modern-web-guidance address guide).
- **Highlight autofilled fields** only if it helps scanning (`:autofill`), and never fight the browser's autofill colours with `!important` hacks that break contrast.

## Anti-patterns (don't)
- `type="number"` for card numbers, OTPs, postcodes or phone numbers.
- Six one-digit OTP boxes that auto-advance: break autofill, paste and screen readers.
- `autocomplete="off"` on login and payment forms "for security".
- `onpaste="return false"` on any field.
- First/middle/last name fields for a global audience.
- Custom keyboards on mobile web.
- Postcode lookups that are the only way to enter an address.

## Good references
- [web.dev — Sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices) — `autocomplete` tokens, no doubled inputs, paste allowed, show-password.
- [web.dev — Payment and address form best practices](https://web.dev/articles/payment-and-address-form-best-practices) — single fields, `cc-*` tokens, address formats, `shipping`/`billing` sections.
- [MDN — inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode) and [MDN — enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint) — the full value lists.
- [HTML spec — Autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill) — the token grammar, section and `shipping`/`billing` prefixes.
- [modern-web-guidance — Autofill payment form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-payment-form.md) and [Autofill address form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-address-form.md) — single inputs, unmasked CVC, flexible address formats.
- [GOV.UK Design System — Names](https://design-system.service.gov.uk/patterns/names/) — one full-name field where possible, allow any character.

## Bad references
- [Baymard — Credit card field splitting](https://baymard.com/blog/credit-card-field-auto-format-spaces) — the split-field and no-spaces variants users mistyped in testing; auto-format spaces instead.
- [NCSC — Let them paste passwords](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords) — the paste-blocking sites it calls out, and why blocking reduces security.
- [Patrick McKenzie — Falsehoods programmers believe about names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) — the assumptions behind first/last splits and Latin-only patterns.

## Accessibility
- `autocomplete` tokens satisfy WCAG 1.3.5 and let assistive tech add icons to known fields.
- Paste and password managers satisfy WCAG 3.3.8.
- `inputmode` is a hint, not a constraint: still validate on the server.

## Motion / interaction (if relevant)
- Card-number auto-spacing inserts spaces as the user types without moving the caret unexpectedly: recompute the caret position after formatting.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| OTP length | 4–8 chars, one field, `one-time-code` | Verification |
| Card number width | ~20ch | Room for 19 digits + spaces |
| Postcode width | 10ch | Most formats worldwide |
| Phone width | 20ch | E.164 is ≤ 15 digits + `+` and spaces |

## Implementation sketch
```html
<fieldset>
  <legend>Billing address</legend>
  <div class="field-check">
    <input type="checkbox" id="same" name="same" checked>
    <label for="same">Same as delivery address</label>
  </div>
  <div class="field"><label for="b-street">Street address</label>
    <textarea id="b-street" name="b-street" autocomplete="billing street-address" rows="2"></textarea></div>
  <div class="field"><label for="b-post">Postcode <span class="optional">(optional)</span></label>
    <input id="b-post" name="b-post" autocomplete="billing postal-code" autocapitalize="characters" spellcheck="false" enterkeyhint="next"></div>
</fieldset>
<div class="field"><label for="otp">Verification code</label>
  <p id="otp-hint" class="hint">6 digits, from the text we sent to •••• 3210</p>
  <input id="otp" name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="\d{6}" maxlength="6" aria-describedby="otp-hint" enterkeyhint="done"></div>
```
```ts
// Format a card number in groups of 4 while keeping the caret after the same digit.
export function formatCardInput(input: HTMLInputElement): void {
  const caret = input.selectionStart ?? input.value.length
  const digitsBefore = input.value.slice(0, caret).replace(/\D/g, '').length
  const digits = input.value.replace(/\D/g, '').slice(0, 19)
  input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  let pos = 0
  for (let seen = 0; pos < input.value.length && seen < digitsBefore; pos++) if (/\d/.test(input.value[pos] ?? '')) seen++
  input.setSelectionRange(pos, pos)
}
```

## Checklist
- [ ] Identifiers use `type="text"` + `inputmode`; no `type="number"` for codes, cards, phones or postcodes.
- [ ] Every user-data field has the right `autocomplete` token; shipping and billing are sectioned.
- [ ] Mobile keyboards and Enter labels match each field.
- [ ] One field per value (name, card, phone, OTP).
- [ ] Paste works everywhere; no confirm-email or confirm-password fields.
- [ ] Correction is off on identifiers and on for prose.

## Sources
- https://web.dev/articles/sign-in-form-best-practices
- https://web.dev/articles/sign-up-form-best-practices
- https://web.dev/articles/payment-and-address-form-best-practices
- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
- https://design-system.service.gov.uk/patterns/names/
- https://baymard.com/blog/credit-card-field-auto-format-spaces
- https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-payment-form.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-address-form.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md
- https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
