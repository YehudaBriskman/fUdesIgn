# Bidi isolation and mixed Hebrew/English/number strings

> Wrap every interpolated value in its own isolate (`<bdi>`, an element with `dir`, or FSI…PDI in plain text), so an English name, a number or a URL can't drag neighbouring punctuation and digits into the wrong place inside Hebrew or Arabic text.

**Category:** Right-to-left layout and bidi · **Applies to:** interpolated strings, names, product titles, file names, counters, breadcrumbs, notifications, `<title>`, `aria-label`, SMS and email · **Priority:** must

## When to use / when not
- Use whenever a translated string has a placeholder (`{name}`, `{count}`, `{file}`) and the value may be in the other direction, which in a Hebrew or Arabic product is almost always.
- Use the markup form (`<bdi>`, `dir` on an element) in HTML; use the Unicode control form only where markup is impossible: `<title>`, attribute values (`aria-label`, `title`, `placeholder`), `<option>` text in some engines, push notifications, SMS, plain-text email, CSV exports, canvas text.
- Don't sprinkle LRM/RLM marks as a general fix. W3C: they "only address the isolation problem" and don't solve nesting.

## Rules (do)
- **Know why it breaks.** The Unicode Bidirectional Algorithm (UAX #9) orders text by character class: strong letters (L for Latin, R for Hebrew, AL for Arabic), weak characters (European digits EN, Arabic-Indic digits AN, separators like `+ - , . :`), and neutrals (spaces, most punctuation). Neutrals between runs of different direction take the paragraph direction, and digits attach to the preceding strong run. The result:
  - `C++` at the end of a Hebrew sentence shows as `++C`; `Hello!` shows as `!Hello` at the line end.
  - `Ben 3 הודעות` from `{name} {count} הודעות` can display the `3` next to "Ben" in an unexpected place ("spillover", W3C).
  - A list `iPhone, Pixel, גלקסי` gets its commas reordered.
- **Isolate each placeholder, not the whole sentence.** `שלום, <bdi>{name}</bdi>!` keeps the `!` on the Hebrew side. W3C: when an element has a `dir` attribute, browsers "isolate the text inside the element from the text surrounding it."
- **`<bdi>` = isolate + auto direction.** W3C: "Without a dir attribute, the bdi element behaves as if dir="auto" had been applied." Use `<bdi>` for unknown direction; use `<span dir="ltr">` when you know the value is LTR (an order ID, a SKU, a URL).
- **Plain-text isolates (UAX #9 §2.7):**

  | Character | Code point | Use |
  |---|---|---|
  | FSI, First Strong Isolate | U+2068 | unknown direction (the plain-text `<bdi>`) |
  | LRI, Left-to-Right Isolate | U+2066 | known LTR value |
  | RLI, Right-to-Left Isolate | U+2067 | known RTL value |
  | PDI, Pop Directional Isolate | U+2069 | closes any of the three; always pair them |
  | LRM / RLM | U+200E / U+200F | invisible strong mark, to fix one neutral at a boundary |
  | ALM, Arabic Letter Mark | U+061C | as RLM, for Arabic contexts (CLDR uses it in Arabic number patterns) |

- **Prefer isolates over embeddings.** LRE/RLE/PDF (U+202A/B/C) and overrides LRO/RLO (U+202D/E) are legacy; overrides also reorder *letters*, which is how filename-spoofing attacks work (`invoice‮fdp.exe`). Strip U+202A–U+202E from untrusted input or display it escaped.
- **Numbers are LTR runs.** A number inside Hebrew text displays its digits left to right automatically; a *range* or *ratio* (`10–20`, `3/4`, `1:2`) or a negative number next to a Latin word may not. Wrap ranges and signed values in `<span dir="ltr">` or LRI…PDI. Formatting details are in `rtl-numbers-digits-currency.md`.
- **Hebrew punctuation is part of the script, not ASCII.**
  - Gershayim `״` (U+05F4) marks acronyms and Hebrew-numeral years: `ת״א`, `תשפ״ז` (this is exactly what `Intl.DateTimeFormat("he-u-ca-hebrew")` emits).
  - Geresh `׳` (U+05F3) marks abbreviations and numeral letters: `א׳ בתשרי`.
  - Maqaf `־` (U+05BE) is the Hebrew hyphen; W3C's Hebrew layout draft says it "should behave like a hyphen".
  - ASCII `"` and `'` are common substitutes in typed text and are acceptable in input, but use the Hebrew characters in UI copy and fonts that have them.
- **Brackets mirror by themselves.** `(` and `)` have the Bidi_Mirrored property, so in RTL text the glyph for U+0028 is drawn as `)`. Don't swap them in translations; translators who "fix" them produce `)טקסט(`.
- **Arabic question mark and comma**: `؟` (U+061F) and `،` (U+060C). Hebrew uses the Latin `?` and `,`. Wikimedia Codex lists the question-mark icon as needing an Arabic-specific variant but not a Hebrew one.

## Anti-patterns (don't)
- String concatenation: `"נמצאו " + count + " תוצאות עבור " + query`. No isolation, no plurals, untranslatable word order.
- Wrapping the entire translated sentence in `dir="rtl"` and the value not at all.
- Using RLM/LRM marks inside translation files to fix one screen. They break the next screen where the value differs.
- Rendering a user's display name in `aria-label` or `title` without FSI…PDI. The visual text is fine (it's in `<bdi>`), the tooltip is garbled.
- Leaving U+202E (RLO) in usernames or file names.

## Good references
- [Unicode UAX #9, Unicode Bidirectional Algorithm](https://www.unicode.org/reports/tr9/) — the character classes, isolates (§2.7) and the reason neutrals and numbers move.
- [W3C, Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/) — spillover, `<bdi>`, and "use markup where it is available" rather than control characters.
- [W3C, How to use Unicode controls for bidi text](https://www.w3.org/International/questions/qa-bidi-unicode-controls) — when FSI/LRI/RLI/PDI and the marks are the only option.
- [W3C, Unicode Bidirectional Algorithm basics](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics) — the visual walkthrough to give translators and reviewers.
- [Walla (walla.co.il)](https://www.walla.co.il) — wraps around 110 headline and metadata runs in `<bdi>` on its home page (headless check, November 2026).

## Bad references
- [MDN, `<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi) shows the failure case side by side: an Arabic username followed by a score, where the score renders before the name without isolation. Use it as the "before" picture in reviews.
- [Trojan Source (CVE-2021-42574)](https://trojansource.codes/) — bidi override characters used to make code display differently from how it compiles; the same characters in usernames and file names spoof UI text.

## Accessibility
- Screen readers read logical order, so a visually garbled string may still be voiced correctly, and that hides the bug from screen-reader testing. Test visually in RTL too.
- Isolate characters are invisible but count in `string.length` and validation limits. Strip them before comparing or storing, add them at render time.
- Don't put isolates in `lang`-sensitive accessible names without the language also being right; mark English runs `lang="en"` so the voice switches.

## Motion / interaction (if relevant)
- Caret movement and selection in mixed text follow logical order; the caret jumps visually at direction boundaries. This is correct behaviour, don't try to "fix" it with JS.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `FSI` / `PDI` | `⁨` / `⁩` | isolate a value of unknown direction in plain text |
| `LRI` / `RLI` | `⁦` / `⁧` | isolate a value of known direction |
| `LRM` / `RLM` / `ALM` | `‎` / `‏` / `؜` | single boundary fixes only |
| Strip from input | `U+202A–U+202E`, `U+2066–U+2069` | untrusted names and file names |
| Gershayim / geresh / maqaf | `U+05F4` / `U+05F3` / `U+05BE` | Hebrew UI copy |

## Implementation sketch
```ts
const FSI = "⁨";
const LRI = "⁦";
const PDI = "⁩";
const BIDI_CONTROLS = /[‪-‮⁦-⁩]/g;

/** Isolate an interpolated value for plain-text contexts (title, aria-label, notifications). */
export function isolate(value: string, dir: "auto" | "ltr" = "auto"): string {
  const clean = value.replace(BIDI_CONTROLS, "");
  return `${dir === "ltr" ? LRI : FSI}${clean}${PDI}`;
}

/** Fill a translated pattern, isolating every placeholder. */
export function fill(pattern: string, values: Record<string, string | number>): string {
  return pattern.replace(/\{(\w+)\}/g, (_m, key: string) => {
    const v = values[key];
    if (v === undefined) return `{${key}}`;
    return typeof v === "number" ? isolate(String(v), "ltr") : isolate(v);
  });
}

// document.title = fill("{file} — נשמר", { file: "Q3 report.xlsx" });
```
```html
<!-- markup isolation: the value, not the sentence -->
<p>שלום, <bdi>Ben</bdi>! יש לך <span dir="ltr">3</span> הודעות חדשות.</p>
<p>הזמנה <span dir="ltr">#A-10293</span> נשלחה ל־<bdi>מרים כהן</bdi>.</p>
<p>טווח: <span dir="ltr">10–20</span> ימים</p>
```

## Checklist
- [ ] Every placeholder in a translated string renders inside `<bdi>`, an element with `dir`, or FSI/LRI…PDI.
- [ ] Attribute values and `<title>` use Unicode isolates for interpolated values.
- [ ] Ranges, ratios and signed numbers are LTR-isolated.
- [ ] Bidi override and embedding characters are stripped from untrusted input.
- [ ] Hebrew copy uses ״ ׳ ־ where typographically required; Arabic copy uses ؟ and ،.
- [ ] No string concatenation of translated fragments.

## Sources
- https://www.unicode.org/reports/tr9/
- https://www.w3.org/International/articles/inline-bidi-markup/
- https://www.w3.org/International/articles/inline-bidi-markup/uba-basics
- https://www.w3.org/International/questions/qa-bidi-unicode-controls
- https://w3c.github.io/hlreq/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://trojansource.codes/
- https://www.walla.co.il (headless-browser inspection, November 2026)
- Local verification: Node v26.12 `Intl.DateTimeFormat("he-u-ca-hebrew")` output uses U+05F3 and U+05F4.
