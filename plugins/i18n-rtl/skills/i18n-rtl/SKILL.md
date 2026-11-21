---
name: i18n-rtl
description: Internationalise a UI and build or review right-to-left layouts, with Hebrew and Arabic as first-class cases. Use when adding a language, localising or translating an app, supporting Hebrew, Arabic, Persian or Urdu, mirroring a layout, fixing mixed Hebrew/English/number text, formatting numbers, currency (₪) or dates for a locale, Hebrew or Hijri calendars, week start, plurals and gender in translations (ICU MessageFormat), text expansion, language switchers, pseudo-localisation, RTL testing, or Israeli accessibility (IS 5568). Trigger even without the words "i18n" or "RTL": "make this work in Hebrew", "the punctuation jumps", "dir=rtl", "logical properties", "translate the UI", "שפה", "עברית".
---

# i18n and RTL

A research-backed playbook for internationalised and right-to-left interfaces: 19 pattern files, each with rules, anti-patterns, good and bad references (including real Hebrew sites checked in a headless browser), accessibility, tokens, a compiling implementation sketch and a checklist. This file gives the workflow, the non-negotiables and the decision tables.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. Prefixes: `rtl` (layout, bidi, numbers, icons, typography, forms, tables and charts, CSS tooling), `i18n` (dates and calendars, strings, plurals and gender, expansion, locale negotiation, testing), `iref` (review rubric, anti-patterns, Hebrew-site teardown and Israeli accessibility).
- **Utilities:** `assets/rtl.css` — direction variables, Hebrew/Arabic typography resets, bidi islands, icon mirroring, form and table defaults, and logical spacing utilities on the dashboard-ui role tokens.
- **Related:** number formatting basics live in dashboard-ui's `data-number-formatting.md`; this skill extends it for RTL rather than repeating it.

## Workflow

1. **Set the locale model.**
   - Decide the supported languages, and keep language, region formats, time zone, currency and digit system as separate settings (`i18n-locale-negotiation-and-switchers.md`).
   - Negotiate: stored choice → URL → `Accept-Language` on first visit; never IP. One URL per language.
2. **Markup.**
   - `<html lang dir>` on every page, direction never only in CSS (`rtl-dir-attribute-and-auto.md`).
   - `dir="auto"` or `<bdi>` for every string you didn't write; isolate every placeholder (`rtl-bidi-isolation-mixed-text.md`).
3. **Layout.**
   - Logical properties everywhere (`rtl-logical-properties.md`); `:dir(rtl)` or Tailwind `rtl:` only for physical leftovers (`rtl-css-tooling-dir-tailwind.md`).
   - Decide what mirrors with `rtl-mirroring-what-flips.md`, and icons with the registry in `rtl-icons-directional.md`.
   - Size for expansion, not English (`i18n-text-expansion-and-layout.md`).
4. **Content formatting.**
   - Numbers, money, digits and the minus sign: `rtl-numbers-digits-currency.md` (on top of `data-number-formatting.md`).
   - Dates, calendars, week start, weekend and time zones: `i18n-dates-calendars-and-week-start.md`.
   - Tables and charts: `rtl-tables-and-charts.md`.
5. **Type and forms.**
   - Hebrew/Arabic font stacks, line-height, no faux italics, no Arabic tracking: `rtl-typography-hebrew-arabic.md`.
   - Field direction by value, any-script validation, translated errors: `rtl-forms-input-direction.md`.
6. **Strings.**
   - Catalogue discipline (whole sentences, context, `Intl.ListFormat`/`Collator`/`Segmenter`): `i18n-string-externalisation.md`.
   - Plurals (Hebrew `one/two/other`, Arabic six) and gender: `i18n-plurals-gender-messageformat.md`.
7. **Test.**
   - Accented +40% and forced-RTL pseudo-locales, real Hebrew/Arabic fixtures, the direction audit and screenshots in Playwright (`i18n-pseudo-localisation-and-rtl-testing.md`).
8. **Review before shipping a locale.**
   - Run `iref-i18n-anti-patterns.md` (14 entries mapped to rubric IDs).
   - Score `iref-i18n-review-rubric.md`: 35 checks in 8 sections, 0–2 each, per key screen × locale. Ship at 80% or more with no must-check at 0.
   - For Israeli services, check `iref-hebrew-sites-and-israeli-accessibility.md` (IS 5568, accessibility statement, no overlays).

## Non-negotiables

Break one only with a written reason.

**Markup and bidi**
1. `<html>` carries a canonical `lang` and a `dir`; base direction is never set only in CSS.
2. Every interpolated value is isolated: `<bdi>` or an element with `dir` in HTML, FSI/LRI…PDI in titles, attributes and plain text. Strip U+202A–U+202E from untrusted input.
3. URLs, emails, phone numbers, code and IDs render in LTR islands.

**Layout and mirroring**
4. Use logical properties; a physical side needs a `physical-ok` reason.
5. Mirror layout, navigation, linear progress and sequences. Never mirror media controls, clocks and circular time, chart plots, logos, photos or the digits of a number.
6. Mirror icons only through a registry (`mirror | keep | variant`), never with a global flip.
7. No fixed widths on text: budget +30–40% for sentences and up to 200–300% for labels of 10 characters or fewer.

**Numbers and dates**
8. All numbers through `Intl.NumberFormat` with the full locale; keep the LRM/RLM/ALM it emits; swap only the `minusSign` part. Hebrew uses Western digits; Arabic digits follow the market, with a user override.
9. One currency format per product (CLDR: logical `1,234.50 ₪` in Hebrew).
10. All dates through `Intl.DateTimeFormat` with locale and `timeZone`; week start and weekend from CLDR week data (Israel: Sunday start, Friday–Saturday weekend).
11. Hebrew and Hijri calendars via `-u-ca-` and Temporal with `monthCode`, never string tricks.

**Type and forms**
12. Hebrew and Arabic get their own font stacks; body line-height at least 1.5 (Hebrew) and 1.6 (Arabic).
13. No faux italics in Hebrew or Arabic; letter-spacing 0 on Arabic; no meaning carried by uppercase.
14. Field direction follows the value: `auto` for free text, `ltr` for email, URL, tel, password and codes. Validate names and digits in any script; never show native validation bubbles.

**Strings**
15. Whole sentences with named placeholders and translator context; no concatenation, no reused fragments.
16. Plurals through CLDR categories (Hebrew `two` with real dual words, Arabic six forms); second-person copy gender-neutral by default.
17. Lists, sorting and truncation through `Intl.ListFormat`, `Intl.Collator` and `Intl.Segmenter`.

**Locale and testing**
18. Language switcher: native names with `lang`, no flags, keeps the current page.
19. Pseudo-locales and RTL screenshot tests run in CI before translations exist.
20. Accessibility holds in every locale (WCAG AA; for Israel, IS 5568 plus a dated accessibility statement). Overlays are never a conformance strategy.

## Decision tables

**Mirror or not** (`rtl-mirroring-what-flips.md`)

| Element | RTL |
|---|---|
| Page layout, nav, sidebar, breadcrumbs, dialogs' close button | Mirror |
| Back/forward, pagination, steppers, linear progress, sliders, carousels | Mirror |
| Text-representing and forward-motion icons (list, send, undo, volume) | Mirror |
| Media playback controls and scrubbers | Keep LTR |
| Clocks, refresh/history, spinners, checkmarks, search magnifier, slashes | Keep |
| Chart plot and time axis | Keep (mirror titles, legends, tooltips) |
| Logos, photos, illustrations | Keep (commission an RTL version if direction matters) |
| Phone numbers, URLs, emails, code, digits of a number | Keep, in an LTR island |

**Field direction** (`rtl-forms-input-direction.md`)

| Field | `dir` |
|---|---|
| Name, address, free text, search | `auto` + `dirname` |
| Email, URL, username | `ltr` |
| Phone, OTP, card, IBAN, ID, postcode, amount | `ltr` (+ `inputmode`) |
| Password, code | `ltr` |

**Digits and currency** (`rtl-numbers-digits-currency.md`, verified on Node 26.12 / CLDR 48)

| Locale | Digits | −1234.5 in the local currency (logical order, direction marks omitted) |
|---|---|---|
| `he-IL` | Western | `-1,234.50 ₪` (with LRM/RLM; displays `₪ -1,234.50`) |
| `en-IL` | Western | `-₪1,234.50` |
| `ar-EG`, `ar-SA` | Arabic-Indic | `-١٬٢٣٤٫٥٠ ج.م.` / `ر.س.` (ALM before the sign) |
| `ar-AE`, `ar` | Western | `-1,234.50 د.إ.` |
| `fa-IR` | Extended Arabic-Indic | `−ریال ۱٬۲۳۵` (true minus, 0 decimals) |

**Plural categories** (`i18n-plurals-gender-messageformat.md`)

| Language | Categories |
|---|---|
| English, German | one, other |
| Hebrew | one, two, other |
| Arabic | zero, one, two, few, many, other |
| Russian | one, few, many, other |

**Week data** (`i18n-dates-calendars-and-week-start.md`)

| Locale | First day | Weekend |
|---|---|---|
| `he-IL`, `ar-SA` | Sunday | Friday, Saturday |
| `ar-EG` | Saturday | Friday, Saturday |
| `ar-AE` | Monday | Saturday, Sunday |
| `en-US` | Sunday | Saturday, Sunday |
| `en-GB`, `de-DE` | Monday | Saturday, Sunday |

## Token defaults

Full set in `assets/rtl.css`.

| Group | Defaults |
|---|---|
| Direction | `--dir: 1` / `-1` under `:dir(rtl)`; `--edge-start`, `--edge-end` for gradients and positions |
| Hebrew type | `--font-sans-he: "Noto Sans Hebrew", Assistant, Heebo, Rubik, "Segoe UI", "Arial Hebrew", Arial, sans-serif` · body line-height 1.55 · tracking 0 |
| Arabic type | `--font-sans-ar: "Noto Sans Arabic", "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif` · body line-height 1.7 · tracking always 0 |
| Headings (RTL scripts) | line-height 1.3 · emphasis by weight 600, never italic |
| Islands | `.ltr-island`, `.num-ltr`, `.media-controls`, `.chart-plot`: `direction: ltr; unicode-bidi: isolate` |
| Icons | `[data-rtl="mirror"]` → `scale: -1 1` under `:dir(rtl)` |
| Numeric cells | `text-align: right` in both directions, `tabular-nums` |
| Spacing | `ms-*`, `me-*`, `ps-*`, `pe-*` on `--space-1…6` (4, 8, 12, 16, 24, 32 px) |

## How to apply this skill

- **When building:** load `assets/rtl.css` in any order with the design tokens: it declares the dashboard-ui roles it reads (`--space-*`, `--radius-md`, `--cell-pad-*`, `--surface`, `--border`, `--accent`) as zero-specificity `:where(:root)` defaults, so it works alone in light and dark and the project's tokens win. Then follow the workflow. Prefer platform features: `dir`, `<bdi>`, `:dir()`, logical properties, `Intl.*`, Temporal. Never use the TypeScript `any` type.
- **When reviewing:** collect the evidence kit in `iref-i18n-review-rubric.md` (screenshots in each locale and pseudo-locale, DOM, catalogue), run the anti-pattern catalogue, score the rubric, and report each failure by ID with evidence and fix, ordered by severity.
- **When the project has a design system or i18n library:** its tokens and message format win; map them onto these rules and flag the gaps.
- **When rules conflict:** correctness of meaning (bidi order, numbers, plurals) and accessibility beat visual symmetry. A half-mirrored screen is worse than an unmirrored one; mirror deliberately and completely.
