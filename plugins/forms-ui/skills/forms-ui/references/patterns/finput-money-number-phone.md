# Money, number and phone inputs with locale handling

> Enter money and quantities in `type="text" inputmode="decimal"` fields that accept the user's locale format, show the currency or unit as a fixed affix, and store exact minor units; take phone numbers in one `type="tel"` field that accepts any formatting and normalises to E.164 on the server.

**Category:** Inputs · **Applies to:** prices, amounts, budgets, quantities, percentages, rates, phone numbers · **Priority:** must

## When to use / when not
- **Money and decimals:** text input + `inputmode="decimal"` and your own parser. `type="number"` ignores locale grouping, accepts `e`, changes on scroll-wheel in some browsers and shows spinners nobody asked for.
- **Small integer quantities** (1–10 tickets): a native `type="number"` with `min`/`max`/`step`, or a stepper with − / + buttons, is fine.
- **Approximate values over a narrow range:** a slider *paired with* a number field (see `comp-slider-with-number-input.md`, dashboard-ui). Never a slider alone for an exact amount.
- **Displaying** numbers and money (tables, KPIs) is not this file: see `data-number-formatting.md` (dashboard-ui).
- **Phone numbers:** `type="tel"` always. It gives the phone keypad and no numeric validation, which is what you want.

## Rules (do)
- **Accept what people type** in their locale: "1,234.50" (en), "1.234,50" (de), "1 234,50" (fr, with a narrow no-break space), "1'234.50" (de-CH). Detect group and decimal separators with `Intl.NumberFormat(locale).formatToParts(12345.6)`; strip currency symbols, spaces and group separators, then parse.
- **Fixed affixes, not typed symbols:** show "$", "€", "%", "kg" as a visual prefix or suffix outside the editable text (a non-interactive span), linked to the field via `aria-describedby` or included in the label ("Amount (USD)"). Currency position follows the locale (€ after the number in de-DE).
- **Store exact values:** integer minor units (cents) or a decimal string, never a binary float. Round only for display. Validate the number of decimals against the currency's minor units (JPY 0, USD 2, KWD 3) via `resolvedOptions().maximumFractionDigits`.
- **Reformat on blur, not while typing.** Grouping separators inserted mid-typing move the caret and corrupt edits. On blur, show the canonical locale format ("1,234.50"); on focus, keep it.
- **Shorthand where users expect it** in pro tools: "10k", "2.5m" (dashboard-ui's `comp-inline-edit-and-forms.md` has the parser). Not on consumer checkout forms.
- **Negative values**: accept "-", "−" (U+2212) and "(1,234)" in finance contexts; display with a true minus.
- **Range errors name the range and unit**: "Enter an amount between $1 and $10,000".
- **Right-align** amounts only inside tables of inputs; in a normal form, left-align like other fields.
- **Phone**:
  - One field, `type="tel"`, `autocomplete="tel"`, width ~20ch.
  - Accept spaces, dashes, brackets, dots and a leading `+` or `00`; never reject "+44 (0)20 7946 0000" for its punctuation (GOV.UK telephone numbers pattern).
  - Country: infer from the account or locale, and let a separate country-code select (or a combobox) override only when international numbers are common. Don't force a country selector on a domestic service.
  - Normalise to E.164 (max 15 digits) on the server with libphonenumber; validate by length and pattern for the country, not one regex.
  - Say why you need it and whether it's for SMS.

## Anti-patterns (don't)
- `type="number"` for money: "1,000" is invalid, "1e3" is valid, the wheel changes the value.
- A "$" typed by the user being rejected, or required.
- Floats in storage: 0.1 + 0.2 ≠ 0.3 errors in totals.
- Formatting while typing that jumps the caret to the end.
- Phone fields split into 3 boxes, or with a US-only mask that blocks international numbers.
- Rejecting valid numbers because they contain spaces or brackets.

## Good references
- [GOV.UK Design System — Telephone numbers](https://design-system.service.gov.uk/patterns/telephone-numbers/) — one field, accept any formatting, support international numbers, say why you ask.
- [MDN — Intl.NumberFormat.prototype.formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts) — locale separators without hard-coding.
- [GOV.UK Service Manual — Why the GOV.UK Design System team changed the input type for numbers](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/) — the `type="number"` problems found in testing.
- [Polaris — Text field](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field) — prefix and suffix affixes for currency and units.
- [libphonenumber](https://github.com/google/libphonenumber) — parsing, validation and E.164 formatting by region.

## Bad references
- [GOV.UK — Why we changed the input type for numbers](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/) — its list of `type="number"` failures: scroll-wheel changes, rounding of large numbers, screen-reader announcements.
- US-centric sign-up forms with `(___) ___-____` phone masks that make "+33 6 12 34 56 78" impossible to enter.

## Accessibility
- The unit or currency is in the accessible name or description, not only in a visual affix.
- `inputmode` never replaces validation; errors are text and say the range.
- Steppers (− / +) are buttons named "Decrease quantity" / "Increase quantity", ≥ 24 px (44 px touch), and the value change is in the field itself.

## Motion / interaction (if relevant)
- None while typing. Reformat on blur instantly.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Money field | `type="text" inputmode="decimal"` | Amounts |
| Affix | `--text-muted`, inside the field border, not editable | Currency, unit |
| Amount width | 12–16ch | Most amounts |
| Phone width | 20ch | Up to 15 digits + formatting |
| Storage | integer minor units or decimal string | Money |

## Implementation sketch
```html
<div class="field">
  <label for="amt">Amount</label>
  <div class="affix-field"><span class="affix" aria-hidden="true">€</span>
    <input id="amt" name="amount" inputmode="decimal" autocomplete="transaction-amount" aria-describedby="amt-cur amt-hint"></div>
  <p id="amt-hint" class="hint">Between €1 and €10.000</p>
  <span id="amt-cur" class="visually-hidden">euros</span>
</div>
```
```css
.affix-field { display: flex; align-items: center; border: 1px solid var(--field-border, var(--border-strong)); border-radius: var(--radius-sm, 6px); background: var(--surface); inline-size: 16ch; }
.affix-field:focus-within { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.affix-field > input { border: 0; outline: 0; min-inline-size: 0; flex: 1; background: transparent; }
.affix { padding-inline: var(--field-pad-inline, 12px) 0; color: var(--text-muted); }
```
```ts
// Parse a user-typed amount in the given locale into integer minor units, or null if it isn't a number.
export function parseMoney(raw: string, locale: string, currency: string): number | null {
  const nf = new Intl.NumberFormat(locale, { style: 'currency', currency })
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  const group = parts.find((p) => p.type === 'group')?.value ?? ','
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.'
  const minor = nf.resolvedOptions().maximumFractionDigits ?? 2
  let s = raw.trim().replace(/[\p{Sc}\s]/gu, '').replace(/−/g, '-')
  const negative = /^\(.*\)$/.test(s) || s.startsWith('-')
  s = s.replace(/[()\-+]/g, '').split(group).join('')
  if (group !== "'") s = s.replace(/'/g, '')
  if (decimal !== '.') s = s.replace(decimal, '.')
  if (!/^\d+(\.\d+)?$/.test(s)) return null
  const [int = '0', frac = ''] = s.split('.')
  if (frac.length > minor) return null
  const value = Number(int) * 10 ** minor + Number(frac.padEnd(minor, '0') || '0')
  return Number.isSafeInteger(value) ? (negative ? -value : value) : null
}
```

## Checklist
- [ ] Money and decimals use text + `inputmode="decimal"` with a locale-aware parser.
- [ ] Currency and units are fixed affixes and part of the accessible name.
- [ ] Values are stored as minor units or decimal strings; decimals match the currency.
- [ ] Formatting happens on blur, never mid-typing.
- [ ] Range errors state the range with units.
- [ ] Phone is one `type="tel"` field that accepts any punctuation and international numbers, normalised server-side.

## Sources
- https://design-system.service.gov.uk/patterns/telephone-numbers/
- https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number
- https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field
- https://github.com/google/libphonenumber
- https://www.itu.int/rec/T-REC-E.164 (15-digit maximum)
- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill (`transaction-amount`, `tel`)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (no `type="number"` for identifiers; Apache-2.0, paraphrased)
