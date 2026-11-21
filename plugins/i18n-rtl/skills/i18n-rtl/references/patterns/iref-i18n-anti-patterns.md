# i18n and RTL anti-pattern catalogue

> Fourteen recurring internationalisation and RTL failures, each with a detectable symptom, why it hurts, the fix, a real example and the rubric IDs it fails; check all fourteen before shipping in a new locale.

**Category:** References, anti-patterns and review · **Applies to:** any multilingual or RTL product: web apps, dashboards, marketing pages, emails · **Priority:** must

## When to use / when not
- Use as a lint list in design and code review, and as the first pass of an audit before scoring `iref-i18n-review-rubric.md`.
- Every entry is phrased as a symptom an agent can find in a screenshot, the DOM or the catalogue.

## Rules (do)
Each anti-pattern gives the rubric checks, the symptom, why it is bad, the fix, and an example.

### AP1. Direction only in CSS
- **Rubric:** I-M1. **Symptom:** `<html lang="he">` with no `dir`; `body { direction: rtl }` or RTL set on inner containers.
- **Why:** W3C: "Never use CSS to apply the base direction." Markup-reading tools, reader modes and late stylesheets see an LTR document.
- **Fix:** `<html lang="he" dir="rtl">` (`rtl-dir-attribute-and-auto.md`). **Example:** ynet, Walla, Shufersal (November 2026).

### AP2. The global flip
- **Rubric:** I-L2, I-L4. **Symptom:** `[dir=rtl] img, [dir=rtl] svg { transform: scaleX(-1) }`, or RTLCSS with no ignore directives; mirrored logos, clocks, checkmarks, media controls.
- **Why:** mirrors meaning, not just layout; Apple warns flipped logos "can have legal repercussions".
- **Fix:** an icon registry with `mirror | keep | variant` (`rtl-icons-directional.md`). **Example:** [androidx/media #227](https://github.com/androidx/media/issues/227).

### AP3. Physical sides everywhere
- **Rubric:** I-L3. **Symptom:** `margin-left`, `left:`, `text-align: left`, Tailwind `ml-`/`pr-`/`text-left` in components; a second `rtl.css` with overrides.
- **Why:** every component needs a manual RTL patch, and patches drift.
- **Fix:** logical properties and `ms-`/`me-`, `:dir(rtl)` only for physical leftovers (`rtl-logical-properties.md`, `rtl-css-tooling-dir-tailwind.md`).

### AP4. Un-isolated interpolation
- **Rubric:** I-M2, I-B1. **Symptom:** `C++` shows as `++C`; `+972 3-123-4567` as `3-123-4567 972+`; `10–20` as `20–10`; a name and a count trade places.
- **Why:** the Unicode Bidirectional Algorithm (UAX #9) attaches neutrals and digits to the wrong run.
- **Fix:** `<bdi>`/`dir` per placeholder, FSI…PDI in attributes and plain text (`rtl-bidi-isolation-mixed-text.md`).

### AP5. Stripped direction marks and hand-built numbers
- **Rubric:** I-B2, I-B4. **Symptom:** `5-` instead of `-5` in Hebrew; `"₪" + n.toFixed(2)`; `₪` before and after the number on one page.
- **Why:** `Intl` emits LRM/RLM/ALM to keep the sign and symbol in place; removing them or bypassing `Intl` breaks RTL.
- **Fix:** one formatter (dashboard-ui `data-number-formatting.md`), swap only `minusSign` parts (`rtl-numbers-digits-currency.md`). **Example:** Fox `199 ₪` / `₪199`, Ivory `419₪` / `419 ₪`.

### AP6. Wrong digits for the market
- **Rubric:** I-B3. **Symptom:** Arabic-Indic digits forced for all Arabic users, or Western digits forced for Egypt and Saudi users; both systems on one screen.
- **Why:** digit preference differs by country (Apple: it "varies among countries and regions").
- **Fix:** locale default plus a user override via `-u-nu-` (`rtl-numbers-digits-currency.md`).

### AP7. Hard-coded week and date order
- **Rubric:** I-B5, I-B6. **Symptom:** `9/12/2026` in a Hebrew UI; calendars starting Monday for Israel; business days Monday–Friday.
- **Why:** Israel's week starts Sunday and its weekend is Friday–Saturday; CLDR has the data.
- **Fix:** `Intl.DateTimeFormat`, `getWeekInfo()` with fallback (`i18n-dates-calendars-and-week-start.md`).

### AP8. Latin typography applied to Hebrew and Arabic
- **Rubric:** I-T1–I-T4. **Symptom:** Inter-only font stacks; faux-italic `<em>`; tracked uppercase eyebrows; letter-spacing on Arabic; line-height 1.1 on Arabic headings.
- **Why:** no glyphs (fallback roulette), no italic tradition, no case, cursive joins broken by spacing (CSS Text 3).
- **Fix:** `:lang()` stacks and resets (`rtl-typography-hebrew-arabic.md`). **Example:** Leumi and ynet tracking on Hebrew text.

### AP9. RTL email and phone fields
- **Rubric:** I-F1, I-F4. **Symptom:** typing an email in an RTL input makes the caret jump at `.` and `@`; Hebrew placeholders left-aligned in LTR fields.
- **Why:** these values are LTR by nature.
- **Fix:** `dir="ltr"` with `:placeholder-shown { direction: rtl }` (`rtl-forms-input-direction.md`).

### AP10. Latin-only validation and browser-language errors
- **Rubric:** I-F2, I-F3. **Symptom:** `[A-Za-z]` name patterns; `pattern="[0-9]*"` rejecting `٠٥٠`; English constraint-validation bubbles on Hebrew pages.
- **Fix:** `\p{L}` patterns, digit normalisation, catalogue messages via `setCustomValidity` (`rtl-forms-input-direction.md`).

### AP11. Concatenated strings and English plurals
- **Rubric:** I-S1, I-S2. **Symptom:** `"You have " + n + " files"`; `n === 1 ? … : …`; Hebrew catalogues without `two`; Arabic with only `one`/`other`.
- **Why:** word order, agreement and CLDR categories differ (Hebrew `one/two/other`, Arabic six).
- **Fix:** ICU `plural`/`select` messages (`i18n-plurals-gender-messageformat.md`, `i18n-string-externalisation.md`).

### AP12. Masculine-default address
- **Rubric:** I-S3. **Symptom:** `לחץ כאן`, `הזן סיסמה` across the product.
- **Why:** excludes half of users in a gendered language.
- **Fix:** infinitive, noun or plural forms by default; optional grammatical-form preference (`i18n-plurals-gender-messageformat.md`).

### AP13. Fixed-width English layouts
- **Rubric:** I-L5. **Symptom:** clipped German buttons, truncated tab labels, clipped Arabic diacritics in fixed-height rows.
- **Why:** short labels expand up to 200–300% (W3C/IBM); Arabic needs more vertical space.
- **Fix:** intrinsic sizing, wrap before truncate (`i18n-text-expansion-and-layout.md`).

### AP14. Flags, IP redirects and translated language names
- **Rubric:** I-X1, I-X2. **Symptom:** 🇮🇱/🇸🇦 language buttons; auto-redirect by IP; `אנגלית` instead of `English`; switching languages drops the user on the home page.
- **Why:** W3C: "Flags represent countries, not languages"; `Accept-Language` is only a first guess.
- **Fix:** native names with `lang`, URL per locale, stored choice (`i18n-locale-negotiation-and-switchers.md`). **Example of the good version:** Bituach Leumi's language links.

## Anti-patterns (don't)
- Using this catalogue as a substitute for the rubric score.
- Fixing a symptom with a local hack (an RLM in a translation, a one-off `[dir=rtl]` override) instead of the pattern fix.
- Reporting a finding without the rubric ID and evidence.

## Good references
- [Bituach Leumi](https://www.btl.gov.il), [Hebrew Wikipedia](https://he.wikipedia.org/), [BBC News Arabic](https://www.bbc.com/arabic) — counter-examples for AP1, AP4, AP8 and AP14.
- [W3C Internationalization articles](https://www.w3.org/International/articlelist) — the primary source for AP1, AP4, AP13 and AP14.
- [Unicode UAX #9](https://www.unicode.org/reports/tr9/) and [CLDR](https://cldr.unicode.org/) — the data behind AP4–AP7 and AP11.

## Bad references
- The headless-browser findings in `iref-hebrew-sites-and-israeli-accessibility.md` (ynet, Walla, Shufersal, Ivory, Fox, Super-Pharm, Leumi), each mapped to the entries above.
- [androidx/media issue #227](https://github.com/androidx/media/issues/227) for AP2.

## Accessibility
- AP1, AP4, AP9, AP10 and AP14 are also accessibility failures (WCAG 1.3.1, 3.1.1, 3.1.2, 3.3.1), and under IS 5568 legal ones for Israeli services.

## Motion / interaction (if relevant)
- Slides and swipes that don't mirror (a drawer entering from the left in RTL) belong to AP3; carousels whose "next" arrow points right in RTL belong to AP2's icon registry fix.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Entries | AP1–AP14, stable IDs | review reports |
| Mapping | each AP → rubric IDs | scoring in `iref-i18n-review-rubric.md` |

## Implementation sketch
```ts
// Map findings to anti-patterns and rubric IDs for a review report.
type ApId = `AP${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14}`;
type Finding = { ap: ApId; where: string; evidence: string };

const RUBRIC: Record<ApId, string[]> = {
  AP1: ["I-M1"], AP2: ["I-L2", "I-L4"], AP3: ["I-L3"], AP4: ["I-M2", "I-B1"], AP5: ["I-B2", "I-B4"],
  AP6: ["I-B3"], AP7: ["I-B5", "I-B6"], AP8: ["I-T1", "I-T2", "I-T3", "I-T4"], AP9: ["I-F1", "I-F4"],
  AP10: ["I-F2", "I-F3"], AP11: ["I-S1", "I-S2"], AP12: ["I-S3"], AP13: ["I-L5"], AP14: ["I-X1", "I-X2"],
};

export function reportRows(findings: readonly Finding[]): string[] {
  return findings.map((f) => `| ${f.ap} | ${RUBRIC[f.ap].join(", ")} | ${f.where} | ${f.evidence} |`);
}
```

## Checklist
- [ ] All fourteen entries checked on every key screen in an RTL locale.
- [ ] Each finding cites its AP and rubric IDs with evidence.
- [ ] Fixes use the pattern file named in the entry, not local hacks.

## Sources
- https://www.w3.org/International/questions/qa-html-dir
- https://www.w3.org/International/articles/inline-bidi-markup/
- https://www.w3.org/International/articles/article-text-size
- https://www.w3.org/International/questions/qa-link-lang
- https://www.w3.org/International/questions/qa-accept-lang-locales
- https://www.w3.org/International/articlelist
- https://www.unicode.org/reports/tr9/
- https://cldr.unicode.org/
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://www.w3.org/TR/css-text-3/#cursive-tracking
- https://github.com/androidx/media/issues/227
- Headless-browser observations: see `iref-hebrew-sites-and-israeli-accessibility.md`.
