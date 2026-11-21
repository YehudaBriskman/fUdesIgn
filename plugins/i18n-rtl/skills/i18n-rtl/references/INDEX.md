# Pattern index

19 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

General number and money formatting lives in dashboard-ui's `data-number-formatting.md`; `rtl-numbers-digits-currency.md` covers only what changes in RTL and links there.

## Right-to-left: logical layout, mirroring, bidi text, numbers, icons, typography, forms, tables and charts, CSS tooling (`rtl-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Bidi isolation and mixed Hebrew/English/number strings](patterns/rtl-bidi-isolation-mixed-text.md) | must | Wrap every interpolated value in its own isolate (`<bdi>`, an element with `dir`, or FSI…PDI in plain text), so an English name, a number or a URL can't drag neighbouring punctuation and digits into the wrong place inside Hebrew or Arabic text. |
| [CSS tooling: `:dir()`, Tailwind logical utilities and the `rtl:` variant](patterns/rtl-css-tooling-dir-tailwind.md) | should | Reach for logical properties first, `:dir(rtl)` second for the physical leftovers, and the Tailwind `rtl:` variant only for those same leftovers; never maintain a second, flipped stylesheet. |
| [The `dir` attribute, `dir="auto"` and base direction](patterns/rtl-dir-attribute-and-auto.md) | must | Declare `lang` and `dir` together on `<html>`, set direction in markup and never in CSS, put `dir="auto"` on every element that shows text you didn't write, and send `dirname` with form fields that accept free text. |
| [Forms in RTL: input direction, LTR fields and validation](patterns/rtl-forms-input-direction.md) | must | Mirror the form, but give every field the direction of its *value*: `dir="auto"` for free text, `dir="ltr"` for email, URL, phone, password, codes and card numbers (with an RTL placeholder), accept names and digits in any script, and translate validation messages yourself. |
| [Icons: directional vs not](patterns/rtl-icons-directional.md) | must | Mirror an icon only when it shows reading direction, forward/back motion or text layout; keep clocks, media controls, checkmarks, right-handed tools, physical objects, slashes and logos as they are, and record the decision as metadata on the icon, not as CSS scattered across screens. |
| [Logical properties: inline/block, start/end](patterns/rtl-logical-properties.md) | must | Write layout in flow-relative terms (`inline`/`block`, `start`/`end`) so one stylesheet serves LTR and RTL, and keep a physical property only where you have asked "should this flip in RTL?" and the answer is no. |
| [RTL mirroring: what flips and what must not](patterns/rtl-mirroring-what-flips.md) | must | Mirror the layout, navigation and anything that shows linear progress or reading order; never mirror media playback controls, clocks and circular time, chart plot areas, logos, photos, phone numbers, URLs, code or the digits inside a number. |
| [Numbers in RTL: digits, minus sign and currency position](patterns/rtl-numbers-digits-currency.md) | must | Let `Intl.NumberFormat` with the user's full locale decide digits, separators, sign and currency position, keep the invisible direction marks it emits, choose Western or Arabic-Indic digits per market (Hebrew always Western), and isolate every number that sits next to Latin text. |
| [Tables and charts in RTL](patterns/rtl-tables-and-charts.md) | must | Mirror a table's column order and its text alignment, but keep numbers aligned on their units digit (physically right) and keep a chart's plot unmirrored, with time running left to right, while titles, legends, labels and tooltips follow the page direction. |
| [Typography for Hebrew and Arabic](patterns/rtl-typography-hebrew-arabic.md) | must | Give Hebrew and Arabic their own font stacks (Inter has neither script), more line-height than Latin, no faux italics, no Latin-tuned letter-spacing (and none at all in Arabic), and emphasis through weight instead of case or slant. |

## Internationalisation: dates and calendars, strings, plurals and gender, text expansion, locale negotiation, testing (`i18n-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Dates, calendars and week start](patterns/i18n-dates-calendars-and-week-start.md) | must | Format every date and time with `Intl.DateTimeFormat` for the user's full locale and time zone, take the week start and weekend from CLDR (`Intl.Locale` week info) instead of assuming Monday or Sunday, and treat the Hebrew and Hijri calendars as calendars (via `-u-ca-` and Temporal), not as string decorations. |
| [Locale negotiation and language switchers](patterns/i18n-locale-negotiation-and-switchers.md) | must | Pick the language from an explicit choice first, the URL second and `Accept-Language` only as a first-visit guess (never IP); keep language separate from region formats; and offer a switcher of native language names, each tagged with its own `lang`, at the top of the page and with no flags. |
| [Plurals, Hebrew dual forms and grammatical gender (ICU MessageFormat)](patterns/i18n-plurals-gender-messageformat.md) | must | Write counted and gendered strings as ICU MessageFormat `plural` and `select` messages driven by `Intl.PluralRules`, give Hebrew its `one`/`two`/`other` forms (with real dual words like יומיים) and Arabic all six categories, and address users in gender-neutral phrasing unless they chose a form. |
| [Pseudo-localisation and RTL testing (with a Playwright recipe)](patterns/i18n-pseudo-localisation-and-rtl-testing.md) | should | Before any translation exists, run every screen in an accented, +40%, bracketed pseudo-locale and in a forced-RTL pseudo-locale, and gate CI on an automated direction audit plus LTR/RTL screenshots of the key screens in real Hebrew and Arabic. |
| [String externalisation and translatable copy](patterns/i18n-string-externalisation.md) | must | Every user-visible string lives in a message catalogue as a whole sentence with named placeholders and a note for the translator; code never concatenates, splits or reuses fragments, and lists, names, sorting and truncation go through `Intl` instead of English-shaped helpers. |
| [Text expansion and resilient layout](patterns/i18n-text-expansion-and-layout.md) | must | Size every text container for the longest supported language, not English: budget +30–40% for sentences and up to 200–300% for labels of 10 characters or fewer, let text wrap before it truncates, and give scripts like Arabic extra vertical room. |

## References: review rubric, anti-pattern catalogue, Hebrew-site teardown and Israeli accessibility (`iref-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Hebrew and Arabic sites teardown, and Israeli accessibility (IS 5568)](patterns/iref-hebrew-sites-and-israeli-accessibility.md) | should | Learn from what real Hebrew and Arabic sites ship (root `dir`, `<bdi>`, LTR phone islands, native-name language links are the good habits; CSS-only direction, invalid `lang`, inconsistent `₪` and overlay widgets are the bad ones), and treat IS 5568 as WCAG AA plus a published accessibility statement, not as a widget purchase. |
| [i18n and RTL anti-pattern catalogue](patterns/iref-i18n-anti-patterns.md) | must | Fourteen recurring internationalisation and RTL failures, each with a detectable symptom, why it hurts, the fix, a real example and the rubric IDs it fails; check all fourteen before shipping in a new locale. |
| [i18n and RTL review rubric](patterns/iref-i18n-review-rubric.md) | must | Score each key screen in each shipped locale (and at least one RTL locale) on 35 checks in 8 sections, 0–2 points each with evidence; ship at 80% or more with no must-check at 0 in any locale. |
