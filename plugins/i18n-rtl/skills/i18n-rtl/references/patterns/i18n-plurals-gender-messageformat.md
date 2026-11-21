# Plurals, Hebrew dual forms and grammatical gender (ICU MessageFormat)

> Write counted and gendered strings as ICU MessageFormat `plural` and `select` messages driven by `Intl.PluralRules`, give Hebrew its `one`/`two`/`other` forms (with real dual words like יומיים) and Arabic all six categories, and address users in gender-neutral phrasing unless they chose a form.

**Category:** Internationalisation · **Applies to:** counters, durations, notifications, empty states, activity feeds, second-person instructions, emails · **Priority:** must

## When to use / when not
- Use for every string that contains a count, and every string whose wording depends on the gender of the user or of a person mentioned.
- Use `Intl.NumberFormat`/`Intl.DurationFormat` alone when the number stands without a noun (`1,234`), and `Intl.RelativeTimeFormat` for relative times (see `i18n-dates-calendars-and-week-start.md`).
- Catalogue hygiene (one sentence per key, context, no concatenation) is in `i18n-string-externalisation.md`.

## Rules (do)
- **Plural categories come from CLDR, per language** (verified with `Intl.PluralRules`, Node 26.12, CLDR 48):

  | Language | Categories | Examples |
  |---|---|---|
  | English, German | `one`, `other` | 1 file / 2 files |
  | Hebrew | `one`, `two`, `other` | 1 → one, 2 → two, 3, 10, 20, 100 → other |
  | Arabic | `zero`, `one`, `two`, `few`, `many`, `other` | 0 → zero, 1 → one, 2 → two, 3 → few, 11 → many, 100 → other |
  | Russian | `one`, `few`, `many`, `other` | |

  Older CLDR data also gave Hebrew a `many` category for multiples of ten; CLDR dropped it (current data has three). If a translation tool still asks for Hebrew `many`, the tool is out of date.
- **Hebrew `two` is real grammar, not decoration.** Common time and frequency nouns have dual forms: `יומיים` (two days), `שבועיים`, `חודשיים`, `שנתיים`, `שעתיים`, `פעמיים`. `Intl.DurationFormat("he", { style: "long" })` already emits `שעתיים, 5 דקות` for 2 h 5 min. Nouns without a dual use the number word or the digit: `שני קבצים` / `2 קבצים`.
- **Hebrew `one` puts the number after the noun**: `קובץ אחד`, `שעה אחת` (masculine/feminine numeral). Don't write `1 קובץ` in polished copy.
- **Arabic needs all six forms**, and they change the noun: `لا ملفات` (0), `ملف واحد` (1), `ملفان` (2, dual), `٣ ملفات` (3–10, plural), `١١ ملفًا` (11–99, accusative singular), `١٠٠ ملف` (100+, singular).
- **Use exact matches for special cases**: `=0 {אין קבצים}` beats `0 קבצים` in every language.
- **`#` inside a plural branch is the formatted number**; it follows the locale's digits (`٣` in `ar-EG`), so don't pre-format the count into a string.
- **Ordinals have their own rules** (`{ type: "ordinal" }`): Hebrew has only `other` (ordinals are words, `ראשון`, `שני`, or `מקום 3`); don't port English `1st/2nd/3rd` logic.
- **Gender with `select`.** Hebrew and Arabic inflect verbs, adjectives and second-person forms by gender:
  - About a third person: `{actorGender, select, female {{name} הגיבה} male {{name} הגיב} other {תגובה חדשה מאת {name}}}`. The `other` branch rephrases to avoid gender, so unknown is safe.
  - Addressing the user: Hebrew imperatives are gendered (`לחץ` / `לחצי`). Default to neutral forms used widely in Hebrew UI: the infinitive (`יש ללחוץ על שמירה`), a noun (`שמירה`), or the plural imperative (`לחצו`). Offer a grammatical-form preference ("איך לפנות אליך?": masculine, feminine, neutral), never infer it from the name or photo.
  - Slash forms (`מסכים/ה`) are a common, accepted fallback in forms and legal copy, but are clumsy in running UI text and screen readers may voice the slash.
- **Nest plural inside select, not the reverse**, and keep each branch a full sentence. Translators must see the whole sentence in every branch.
- **Use a real MessageFormat implementation** (ICU4X/ICU4J, FormatJS `intl-messageformat`, `messageformat`, or MessageFormat 2 implementations). MessageFormat 2.0 has been stable since CLDR 47 (March 2025); `Intl.MessageFormat` for browsers is a TC39 proposal, not shipped.

## Anti-patterns (don't)
- `count === 1 ? "file" : "files"` anywhere outside English-only code.
- `count + " " + t(count === 1 ? "file" : "files")`: wrong for Hebrew 2 and every Arabic category above `one`.
- Assuming `two` is optional in Hebrew and filling it with the `other` text when a dual word exists (`2 ימים` instead of `יומיים`).
- Masculine-by-default second person (`לחץ כאן`, `הזן סיסמה`) across a product.
- Inferring gender from a first name.
- Separate keys `files_one`, `files_other` assembled by code that only knows English categories.

## Good references
- [Unicode CLDR, Language plural rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) — the authoritative category list and example numbers per language, including Hebrew and Arabic.
- [MDN, Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) — `select`, `resolvedOptions().pluralCategories`, ordinals.
- [ICU User Guide, Formatting messages](https://unicode-org.github.io/icu/userguide/format_parse/messages/) — `plural`, `select`, `#`, `=0` exact matches and nesting advice.
- [FormatJS, ICU message syntax](https://formatjs.github.io/docs/core-concepts/icu-syntax/) — the syntax most JS stacks use, with rich-text tags.
- [Unicode CLDR 47 release: MessageFormat 2.0 stable](https://blog.unicode.org/2025/03/unicode-cldr-47-release-messageformat-2.html).

## Bad references
- [i18next plurals](https://www.i18next.com/translation-function/plurals) documented with English `_one`/`_other` suffixes first: teams that never read past that example ship Hebrew catalogues without `_two` keys, so 2 renders as `2 ימים` instead of `יומיים`.
- English-centric `pluralize` helpers in UI code (see `i18n-string-externalisation.md`).

## Accessibility
- Neutral phrasing helps everyone: screen readers may voice the slash in `מסכים/ה` or read the suffix as a separate letter.
- A count in an accessible name must use the same plural form as the visible text (`aria-label` from the same message).

## Motion / interaction (if relevant)
- Live counters (`3 פריטים בעגלה`) re-run the plural selection on every change; a count going from 1 to 2 changes the noun in Hebrew and Arabic, not just the digit.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Hebrew plural keys | `one`, `two`, `other` (+ `=0`) | all counted strings |
| Arabic plural keys | `zero`, `one`, `two`, `few`, `many`, `other` | all counted strings |
| Gender keys | `female`, `male`, `other` (neutral rephrase) | `select` |
| User address default | neutral (infinitive, noun, or plural imperative) | Hebrew and Arabic UI |
| Ordinals (Hebrew) | `other` only | rankings |

## Implementation sketch
```json
{
  "cart.items": "{count, plural, =0 {העגלה ריקה} one {פריט אחד בעגלה} two {שני פריטים בעגלה} other {# פריטים בעגלה}}",
  "retention.days": "{days, plural, one {יום אחד} two {יומיים} other {# ימים}}",
  "feed.commented": "{actorGender, select, female {{name} הגיבה לפוסט שלך} male {{name} הגיב לפוסט שלך} other {תגובה חדשה לפוסט שלך מאת {name}}}",
  "save.hint": "יש ללחוץ על <b>שמירה</b> כדי לסיים"
}
```
```ts
// A dependency-free plural/select resolver for when a full MessageFormat library isn't loaded yet.
type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string; exact?: Record<number, string> };
type Gender = "female" | "male" | "other";

const rulesCache = new Map<string, Intl.PluralRules>();
const nfCache = new Map<string, Intl.NumberFormat>();

export function plural(locale: string, count: number, forms: PluralForms): string {
  const exact = forms.exact?.[count];
  if (exact !== undefined) return exact;
  let rules = rulesCache.get(locale);
  if (!rules) { rules = new Intl.PluralRules(locale); rulesCache.set(locale, rules); }
  let nf = nfCache.get(locale);
  if (!nf) { nf = new Intl.NumberFormat(locale); nfCache.set(locale, nf); }
  const text = forms[rules.select(count)] ?? forms.other;
  return text.replace("#", nf.format(count));
}

export function byGender(gender: Gender | undefined, forms: Record<Gender, string>): string {
  return forms[gender ?? "other"];
}

// plural("he", 2, { one: "יום אחד", two: "יומיים", other: "# ימים" })          -> "יומיים"
// plural("ar-EG", 11, { zero: "لا ملفات", one: "ملف واحد", two: "ملفان", few: "# ملفات", many: "# ملفًا", other: "# ملف" }) -> "١١ ملفًا"
```

## Checklist
- [ ] Every counted string is a `plural` message; no ternaries on `count === 1`.
- [ ] Hebrew catalogues have `two` wherever a dual word exists, and `one` uses noun + `אחד/אחת`.
- [ ] Arabic catalogues have all six categories.
- [ ] `=0` cases are written as sentences, not "0 items".
- [ ] Second-person copy is gender-neutral by default; a grammatical-form preference exists if gendered copy is used.
- [ ] Third-person gendered strings have a neutral `other` branch.
- [ ] Translation tooling uses current CLDR categories.

## Sources
- https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
- https://unicode-org.github.io/icu/userguide/format_parse/messages/
- https://formatjs.github.io/docs/core-concepts/icu-syntax/
- https://messageformat.unicode.org/
- https://blog.unicode.org/2025/03/unicode-cldr-47-release-messageformat-2.html
- https://www.i18next.com/translation-function/plurals
- https://github.com/tc39/proposal-intl-messageformat
- Local verification: Node v26.12 (ICU 78.3, CLDR 48) `Intl.PluralRules` categories for he, ar, en, de, ru; `Intl.DurationFormat("he")` output.
