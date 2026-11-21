# Forms in RTL: input direction, LTR fields and validation

> Mirror the form, but give every field the direction of its *value*: `dir="auto"` for free text, `dir="ltr"` for email, URL, phone, password, codes and card numbers (with an RTL placeholder), accept names and digits in any script, and translate validation messages yourself.

**Category:** Right-to-left layout and bidi · **Applies to:** sign-in and sign-up, checkout, profile, search, filters, contact and government forms · **Priority:** must

## When to use / when not
- Use for every form rendered in Hebrew or Arabic, and for any form in any language that accepts names, addresses or free text from Hebrew or Arabic speakers.
- General form guidance (labels, validation timing, autofill) lives in the modern-web-guidance forms guide ([forms.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md)); the forms-ui plugin covers inputs in depth (`finput-money-number-phone.md`, `finput-dates-and-times.md`, `ffound-labels-hints-placeholders.md`, `fvalid-error-messages.md`). This file covers only what direction and script change.

## Rules (do)
- **Layout mirrors.** Labels and help text align to `start` (right); checkboxes and radios sit at inline-start with their label after them; a search icon sits at inline-start and a clear or show-password button at inline-end; the primary button sits at the inline-start of the button row if that is where it sits in LTR (the reading order is what matters, not "right side"). Use logical properties and flex; the forms guide says "use CSS logical properties (e.g., `margin-inline-start`) for RTL support."
- **Switches mirror**: "on" moves the thumb toward inline-end (left in RTL), matching iOS and Android RTL behaviour.
- **Field direction follows the value:**

  | Field | `dir` | Why |
  |---|---|---|
  | name, address, free text, search, comments | `auto` (+ `dirname`) | either script |
  | email, URL, username handles | `ltr` | LTR by nature ([Codex](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html): URLs and emails "remain unaltered") |
  | phone (`type="tel"`), OTP, card number, IBAN, ID numbers, postcodes | `ltr` | digit groups must not reorder |
  | password | `ltr` | the dots and the reveal must not jump; passwords are often Latin |
  | amount | `ltr` + `inputmode="decimal"` | see `rtl-numbers-digits-currency.md` |
  | code, JSON, regex | `ltr` | LTR content |

- **Placeholders in LTR fields.** A Hebrew placeholder in a `dir="ltr"` field renders left-aligned and LTR. Flip only the empty state: `input[dir="ltr"]:placeholder-shown { direction: rtl; }` puts the Hebrew hint on the right and switches to LTR as soon as the user types (rendered in Chromium, November 2026). Better still, put hints in visible help text, not placeholders.
- **Alignment of LTR values in an RTL form.** Wikimedia Codex keeps phone numbers left-aligned in both directions; many Hebrew forms align LTR values to the right so the column edge stays consistent. Either is acceptable if it's consistent per product; the direction must still be LTR.
- **Names in any script.** Validate with Unicode properties, not `[A-Za-z]`: `/^[\p{L}\p{M}][\p{L}\p{M}'’׳״\- .]*$/u` accepts `ג׳ורג׳`, `O’Brien`, `عبد الله` and Hebrew with niqqud. Don't require two words, don't split "first/last" by space, and don't transliterate.
- **Digits in any script.** Normalise Arabic-Indic and Extended Arabic-Indic digits before validating (`parseLocalisedNumber` in `rtl-numbers-digits-currency.md`). `pattern="[0-9]*"` rejects ٠١٢.
- **Translate validation messages yourself.** Native constraint-validation bubbles use the *browser's* UI language, not the page's `lang`: a Hebrew page in an English Chrome says "Please include an '@' in the email address" (verified in Chromium, November 2026). Use `setCustomValidity()` or your own inline errors with strings from the message catalogue.
- **Native date and time pickers** also follow the browser locale (see `i18n-dates-calendars-and-week-start.md`). Show the selected date formatted for the page locale next to the control.
- **Local formats are data, not decoration.**
  - Israeli mobile numbers are 10 digits starting 05 (`050-1234567`); landlines 9 digits (`03-1234567`); accept with or without dashes, store E.164 (`+972501234567`).
  - Israeli ID (Teudat Zehut) is up to 9 digits with a check digit (Luhn-style, weights 1,2 alternating). Validate it client-side so a typo is caught at blur.
  - Israeli postcodes are 7 digits.
- **Autofill and keyboards.** Keep standard `autocomplete` tokens (`email`, `tel-national`, `postal-code`, `given-name`) and `inputmode` (`email`, `tel`, `numeric`): mobile keyboards switch to Latin for `email` and to digits for `tel`, which saves users a language toggle.
- **Enter-to-submit handlers** must respect IME composition (`event.isComposing`) for users of CJK input methods in the same product ([ime-safe-enter-submit.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md)).

## Anti-patterns (don't)
- An email field that inherits `dir="rtl"`: typing `dana.k@ex-ample.co.il` makes the caret jump at every `.` and `@`, and the user can't see what they typed.
- `pattern="[A-Za-z ]+"` on a name field in an Israeli or Arab-market product.
- English browser validation bubbles on a Hebrew form.
- A phone field that displays `+972 3-123-4567` as `3-123-4567 972+` because it inherited RTL.
- Asterisks for "required" placed with `float: right` (they end up on the wrong side in one of the two directions); use inline content after the label text.
- Splitting full name into first/last by the first space.

## Good references
- [W3C, Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir) — `dir="auto"` on inputs and `dirname` to send the direction to the server.
- [modern-web-guidance, forms.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — logical properties for RTL, validation timing, `font-size` at least 1rem.
- [modern-web-guidance, ime-safe-enter-submit.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md) — composition-safe Enter handling.
- [Wikimedia Codex, Bidirectionality](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) — phone numbers, URLs and emails stay LTR.
- [Bituach Leumi](https://www.btl.gov.il) — phone links rendered `dir="ltr"` with `unicode-bidi: isolate` inside Hebrew text (headless check, November 2026).

## Bad references
- Chromium's native validation bubble on a `lang="he"` page in an English browser ("Please include an '@' in the email address. 'x' is missing an '@'.", verified November 2026). Not a browser bug, but a product bug if you rely on it.
- [Patrick McKenzie, Falsehoods programmers believe about names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) — the catalogue of name-validation failures that `[A-Za-z]` patterns reproduce.

## Accessibility
- Labels must be programmatically associated (`<label for>`), whatever the direction; a visually mirrored label that isn't associated fails WCAG 1.3.1 and 4.1.2.
- Error text must be in the page language and linked with `aria-describedby`; a browser bubble in another language fails WCAG 3.1.2 Language of Parts in practice.
- An LTR field's `lang` can stay the page language; the label is Hebrew, the value is an email address.
- Israeli sites must meet IS 5568 (WCAG AA-based) for forms (see `iref-hebrew-sites-and-israeli-accessibility.md`).

## Motion / interaction (if relevant)
- The caret in an LTR field starts at the left; in an RTL field at the right. Don't animate or force caret position.
- Arrow keys in a mixed-direction value move logically; don't override them.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Free-text field | `dir="auto" dirname="x.dir"` | names, addresses, comments, search |
| LTR field | `dir="ltr"` | email, URL, tel, password, OTP, card, IBAN, ID, postcode |
| Placeholder fix | `input[dir="ltr"]:placeholder-shown { direction: rtl }` | Hebrew/Arabic hints in LTR fields |
| Name pattern | `/^[\p{L}\p{M}][\p{L}\p{M}'’׳״\- .]*$/u` | any-script names |
| Israeli mobile | 10 digits, `05X`; store E.164 `+9725…` | phone fields |
| Teudat Zehut | ≤ 9 digits, check digit | ID fields |
| Control font size | `max(1rem, 1em)` | prevents iOS zoom (forms.md) |

## Implementation sketch
```html
<form lang="he" dir="rtl" novalidate>
  <label for="name">שם מלא</label>
  <input id="name" name="name" dir="auto" dirname="name.dir" autocomplete="name" required>

  <label for="email">אימייל</label>
  <input id="email" name="email" type="email" dir="ltr" inputmode="email" autocomplete="email"
         placeholder="name@example.co.il" required>

  <label for="tel">טלפון נייד</label>
  <input id="tel" name="tel" type="tel" dir="ltr" inputmode="tel" autocomplete="tel-national"
         placeholder="050-1234567">

  <label for="tz">תעודת זהות</label>
  <input id="tz" name="tz" dir="ltr" inputmode="numeric" autocomplete="off" aria-describedby="tz-err">
  <p id="tz-err" class="error" hidden></p>

  <label class="check"><input type="checkbox" name="terms"> קראתי ואני מסכים/ה לתנאים</label>
  <button>שליחה</button>
</form>
```
```css
form :is(input, select, textarea) { font: inherit; font-size: max(1rem, 1em); }
input[dir="ltr"]:placeholder-shown { direction: rtl; }
.check { display: flex; gap: var(--space-2, 8px); align-items: center; }
.error { color: var(--danger-fg, #b42318); margin-block-start: var(--space-1, 4px); }
```
```ts
const ARABIC_DIGITS = /[٠-٩۰-۹]/g;
const toAsciiDigits = (s: string): string =>
  s.replace(ARABIC_DIGITS, (d) => String(d.charCodeAt(0) >= 0x06f0 ? d.charCodeAt(0) - 0x06f0 : d.charCodeAt(0) - 0x0660));

/** Israeli ID (Teudat Zehut): up to 9 digits, weights 1,2,1,2…, digit sums, total divisible by 10. */
export function isValidIsraeliId(raw: string): boolean {
  const digits = toAsciiDigits(raw).replace(/\D/g, "");
  if (digits.length === 0 || digits.length > 9) return false;
  const padded = digits.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const n = Number(padded[i]) * ((i % 2) + 1);
    sum += n > 9 ? n - 9 : n;
  }
  return sum % 10 === 0;
}

const NAME = /^[\p{L}\p{M}][\p{L}\p{M}'’׳״\- .]*$/u;
export const isPlausibleName = (s: string): boolean => NAME.test(s.trim());

export function wireIdField(input: HTMLInputElement, error: HTMLElement, message: string): void {
  input.addEventListener("blur", () => {
    const ok = input.value === "" || isValidIsraeliId(input.value);
    input.setCustomValidity(ok ? "" : message); // our translated string, not the browser's
    input.setAttribute("aria-invalid", String(!ok));
    error.hidden = ok;
    error.textContent = ok ? "" : message;
  });
}
```

## Checklist
- [ ] Every field has the `dir` of its value: `auto` for free text, `ltr` for email/URL/tel/password/codes/IDs.
- [ ] Hebrew or Arabic placeholders in LTR fields render right-aligned while empty.
- [ ] Name validation accepts any script, geresh/gershayim and apostrophes.
- [ ] Numeric fields accept Arabic-Indic digits.
- [ ] No native validation bubble text reaches users; messages come from the catalogue.
- [ ] `autocomplete` and `inputmode` are set so mobile keyboards switch script automatically.
- [ ] Local formats (Israeli phone, ID, postcode) are validated at blur and stored normalised.

## Sources
- https://www.w3.org/International/questions/qa-html-dir
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/dirname
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/
- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- https://www.btl.gov.il (headless-browser inspection, November 2026)
- Local verification: Chromium rendering of `dir="ltr"` inputs with Hebrew placeholders and the `:placeholder-shown` fix; `validationMessage` on a `lang="he"` page.
