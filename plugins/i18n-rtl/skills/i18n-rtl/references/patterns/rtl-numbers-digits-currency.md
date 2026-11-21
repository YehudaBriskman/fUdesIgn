# Numbers in RTL: digits, minus sign and currency position

> Let `Intl.NumberFormat` with the user's full locale decide digits, separators, sign and currency position, keep the invisible direction marks it emits, choose Western or Arabic-Indic digits per market (Hebrew always Western), and isolate every number that sits next to Latin text.

**Category:** Right-to-left layout and bidi · **Applies to:** prices, KPIs, table cells, deltas, phone and ID numbers, ranges, input fields that accept numbers · **Priority:** must

## When to use / when not
- Use for every number shown in a Hebrew, Arabic, Persian or Urdu UI, and every numeric input those users type into.
- The general formatting rules (one formatter module, precision per metric, U+2212, compact notation, `tabular-nums`) are in dashboard-ui's `data-number-formatting.md`. This file covers only what changes in RTL; don't duplicate the formatter.
- Identifiers that look like numbers (phone, order ID, IBAN, card) are not formatted with `Intl.NumberFormat`. They are strings shown in an LTR island (see `rtl-mirroring-what-flips.md`).

## Rules (do)
- **Hebrew uses Western digits (0–9), always.** `he-IL` resolves to `numberingSystem: "latn"` (verified, Node 26.12, ICU 78.3, CLDR 48). Apple: "Hebrew text uses Western Arabic numerals."
- **Arabic depends on the market, so it's a setting.**
  - `ar-EG` and `ar-SA` default to Arabic-Indic digits (`arab`: ١٬٢٣٤٫٥٠, with U+066C group and U+066B decimal separators).
  - `ar-AE`, and plain `ar` in CLDR 48, default to Western digits (`latn`: 1,234.50).
  - `fa-IR` uses Extended Arabic-Indic digits (`arabext`: ۱۲۳۴) and a true minus.
  - Apple: Arabic "might use either Western or Eastern Arabic numerals"; the choice "varies among countries and regions". Default from the locale, let the user override with the `-u-nu-` extension (`ar-SA-u-nu-latn`) or the `numberingSystem` option, and use one system per screen.
- **Minus sign placement comes from the locale, and it needs the direction mark.** A bare `-5` at the start of Hebrew text displays as `5-`; the same with U+2212 displays as `5−` (rendered in Chromium, November 2026). `Intl` prevents this by emitting an LRM (U+200E) before the sign in `he`, and an ALM (U+061C) in `ar-EG`. Consequences:
  - Hebrew negative money reads `₪ -1,234.50` visually: minus on the left of the digits, shekel sign further left.
  - `ar-EG` places the minus on the right of Arabic-Indic digits (the logical start), as CLDR specifies.
  - When you swap the minus for U+2212 (the dashboard-ui rule), replace only the `minusSign` part from `formatToParts` and keep the `literal` parts that carry the marks. Never `.replace(/[^\d.,-]/g, "")` a formatted string.
- **Currency position in Hebrew.** CLDR `he` writes the number, a no-break space, an RLM and then the symbol: logical `1,234.50 ₪`. In an RTL line that displays with `₪` on the visual left of the number. `en-IL` gives `₪1,234.50`, symbol first. Israeli retail shows both logical orders and both spacings (Fox shows `199 ₪` and `₪199` on one page; Ivory shows `419₪` and `419 ₪`), which renders similarly but copies, sorts and reads aloud differently. Use the `Intl` output, consistently.
- **Other currencies in Hebrew follow the same pattern**: `he-IL` USD is `1,234.50 $` (logical), with an RLM before the symbol. Show the currency code (`USD`) instead of `$` when amounts in several dollar currencies appear together (`currencyDisplay: "code"`).
- **Percent:** `he-IL` gives `‎-4.2%` (LRM first); `ar-EG` gives `؜-٤٫٢٪؜` with the Arabic percent sign U+066A.
- **Isolate numbers next to Latin words**, ranges and phone numbers. In a Hebrew line, `10–20` with an en dash displays as `20–10`; `+972 3-123-4567` displays as `3-123-4567 972+`; `Ben 3 הודעות` attaches the 3 to "Ben" (all rendered in Chromium). Wrap them in `<span dir="ltr">` or `<bdi>` (see `rtl-bidi-isolation-mixed-text.md`).
- **Accept any digits in input; store ASCII.** Users on Arabic keyboards type ٠–٩ (U+0660–0669) or ۰–۹ (U+06F0–06F9). Normalise to 0–9 before parsing and validating, and use `inputmode="decimal"` or `inputmode="numeric"` rather than `type="number"` (whose parsing is locale-inconsistent).
- **Numeric columns stay end-aligned.** In RTL, `text-align: end` puts numbers on the left edge of the cell; that is correct (digits stay aligned on their last digit). See `rtl-tables-and-charts.md`.
- **Never mirror a number's digits** and never reverse a number to "make it RTL" (Apple HIG).

## Anti-patterns (don't)
- `"₪" + n.toFixed(2)` or `` `${n} ₪` ``: no grouping, no marks, wrong minus position.
- Stripping "garbage" characters from `Intl` output: the "garbage" is the LRM/RLM/ALM that keeps the sign in place.
- Forcing `latn` for Arabic everywhere because the design was mocked in English, or forcing `arab` for all Arabic markets because "it's Arabic".
- Mixing digit systems on one screen (Arabic-Indic in prose, Western in tables) without a reason.
- Using superscript Unicode digits for agorot or cents (`99⁹⁰`, seen on Fox): screen readers read them as separate characters, and copy-paste yields a wrong number. Style the cents with CSS instead and keep the text `99.90`.
- `type="number"` for prices in Hebrew or Arabic forms.

## Good references
- [Apple HIG, Right to left: Numbers and characters](https://developer.apple.com/design/human-interface-guidelines/right-to-left) — Hebrew uses Western digits, Arabic varies by region, don't reverse digits, reverse the order of numerals that show progress.
- [Unicode CLDR](https://cldr.unicode.org/) — the source of every `Intl` pattern quoted here; the [number symbols chart](https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html) lists the marks per locale.
- [MDN, Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) — `numberingSystem`, `currencyDisplay`, `signDisplay`, `formatToParts`.
- [Rami Levy](https://www.rami-levy.co.il/he) — prices consistently `5.40 ₪` (number, space, symbol in logical order, matching CLDR), with `dir="rtl"` on the root (headless check, November 2026).
- dashboard-ui `data-number-formatting.md` — the shared formatter this file extends.

## Bad references
- [Fox (fox.co.il)](https://www.fox.co.il) — `199 ₪` and `₪199` in two adjacent promos, and agorot as superscript Unicode digits `21⁹⁰₪` (headless check, November 2026).
- [Super-Pharm](https://www.super-pharm.co.il) — unit prices built with legacy RLE/PDF embedding characters (U+202B/U+202C) around `₪370`, the approach UAX #9 now replaces with isolates (headless check, November 2026).
- [Ivory (ivory.co.il)](https://www.ivory.co.il) — `419₪` and `419 ₪` on the same product tile (headless check, November 2026).

## Accessibility
- Screen readers voice the number in the page language; the marks are silent. A number built from superscript digits or split across elements (`<span>99</span><sup>90</sup>`) needs an accessible name with the full value ("99.90 שקלים").
- Give compact values the long form in the accessible name, as in `data-number-formatting.md`; `compactDisplay: "long"` works for `he` and `ar`.
- Never use colour alone for negatives; in RTL the sign position differs by locale, so check it is present in the text.

## Motion / interaction (if relevant)
- Count-up animations must animate the number and re-format each frame through the same formatter, or the marks and separators flicker in and out.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Hebrew digits | `latn` | always |
| Arabic digits | locale default (`arab` for `ar-EG`/`ar-SA`, `latn` for `ar-AE` and `ar`), user override | per market |
| Persian digits | `arabext` | `fa-IR` |
| Hebrew money | `Intl` `he-IL` → logical `1,234.50 ₪`, NBSP + RLM before `₪` | all ILS |
| Negative glyph | U+2212 via `formatToParts`, keep `literal` marks | see `data-number-formatting.md` |
| Number island | `<span dir="ltr">` / LRI…PDI | ranges, phone numbers, IDs, numbers next to Latin |
| Numeric input | `inputmode="decimal"`, normalise U+0660–0669 and U+06F0–06F9 | money and quantity fields |

## Implementation sketch
```ts
const MINUS = "−";

export function formatMoney(value: number, locale: string, currency: string, digits?: "latn" | "arab"): string {
  const nf = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...(digits ? { numberingSystem: digits } : {}),
  });
  // swap only the sign; keep the LRM/RLM/ALM literals that hold it in place
  return nf
    .formatToParts(value)
    .map((p) => (p.type === "minusSign" ? MINUS : p.value))
    .join("");
}

const ARABIC_INDIC = /[٠-٩]/g;
const EXTENDED_ARABIC_INDIC = /[۰-۹]/g;

/** Normalise typed digits and separators before parsing. Returns null if not a number. */
export function parseLocalisedNumber(input: string): number | null {
  const ascii = input
    .replace(ARABIC_INDIC, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(EXTENDED_ARABIC_INDIC, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٫]/g, ".") // Arabic decimal separator
    .replace(/[٬,\s‎‏؜]/g, "") // group separators and direction marks
    .replace(/[−]/g, "-");
  const n = Number(ascii);
  return ascii !== "" && Number.isFinite(n) ? n : null;
}

// formatMoney(-1234.5, "he-IL", "ILS") -> "‏‎−1,234.50 ‏₪"  (displays ₪ −1,234.50 in RTL)
// formatMoney(-1234.5, "ar-EG", "EGP") -> Arabic-Indic digits, ALM before the sign
```
```html
<p>יתרה: <data value="-1234.5">‏‎−1,234.50 ‏₪</data></p>
<p>זמן משלוח: <span dir="ltr">3–5</span> ימי עסקים</p>
<label for="amt">סכום</label>
<input id="amt" inputmode="decimal" dir="ltr" autocomplete="transaction-amount">
```

## Checklist
- [ ] All numbers go through the shared `Intl` formatter with the full locale (`he-IL`, `ar-EG`, not `he`/`ar` only when the region matters).
- [ ] Hebrew screens show Western digits; Arabic screens use one digit system, chosen per market and overridable.
- [ ] Negative values render with the sign on the correct side in RTL (no `5-`).
- [ ] Direction marks in `Intl` output are preserved through post-processing.
- [ ] Currency symbol position and spacing are identical across the product.
- [ ] Ranges, phone numbers and numbers adjacent to Latin text are isolated.
- [ ] Numeric inputs accept Arabic-Indic digits and normalise before parsing.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://cldr.unicode.org/
- https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
- https://www.unicode.org/reports/tr9/
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://www.rami-levy.co.il/he , https://www.fox.co.il , https://www.super-pharm.co.il , https://www.ivory.co.il (headless-browser text inspection, November 2026)
- dashboard-ui: `data-number-formatting.md`
- Local verification: Node v26.12 (ICU 78.3, CLDR 48) `Intl.NumberFormat` and `formatToParts` outputs for he-IL, en-IL, ar-EG, ar-SA, ar-AE, ar, fa-IR; Chromium rendering of `-5`, `−5`, `10–20`, `+972 …` and `Ben 3 …` in an RTL paragraph.
