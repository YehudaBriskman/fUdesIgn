# i18n and RTL review rubric

> Score each key screen in each shipped locale (and at least one RTL locale) on 35 checks in 8 sections, 0–2 points each with evidence; ship at 80% or more with no must-check at 0 in any locale.

**Category:** References, anti-patterns and review · **Applies to:** any screen, component library or email template that ships in more than one language or in Hebrew/Arabic · **Priority:** must

## When to use / when not
- Run it before the first release in a new locale, before each release that touches layout or copy, and when auditing an existing product or a competitor.
- An agent can run most checks: **[DOM]** = markup or computed style, **[VIS]** = screenshot, **[INT]** = interaction, **[CAT]** = message catalogue. The automated audit in `i18n-pseudo-localisation-and-rtl-testing.md` covers many [DOM] checks.
- Not a substitute for native-speaker copy review or usability testing.

## Rules (do)
**Scoring unit:** each key screen × each locale (minimum: the source locale, one RTL locale, the longest locale, usually German or Russian). The product score is the mean; a must-check at 0 anywhere blocks shipping.

**Stable IDs:** I-M1 … I-X4 never change meaning and are never renumbered. `iref-i18n-anti-patterns.md` cites these IDs.

**Scoring:** 2 = holds for every instance on the screen; 1 = holds for most, with isolated failures; 0 = systematic failure. N/A only where stated. Score = points ÷ (2 × applicable checks), rounded down. **Bands:** ≥ 80% ship · 65–79% ship with tracked fixes · < 65% fix first.

**Evidence kit:** full-page screenshots in each locale at 1280 and 320 px; the same in the accented and forced-RTL pseudo-locales; DOM and computed styles of the root, forms, tables and charts; the catalogue files; one keyboard pass in RTL.

### M. Markup and direction
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-M1 (must) | `<html>` has canonical `lang` and a `dir` that match the content | [DOM] | Both, canonical, correct | Present but non-canonical (`heb`, `iw`, `he_IL`) | Missing `dir`, or direction only in CSS | `rtl-dir-attribute-and-auto.md` |
| I-M2 (must) | User and third-party strings are isolated (`<bdi>`, `dir="auto"`, isolates in attributes) | [DOM] inspect names, titles, search results, notifications | All | Visible text yes, attributes no | None | `rtl-bidi-isolation-mixed-text.md` |
| I-M3 | Foreign-language passages carry their own `lang` (and `dir`) | [DOM] | All | Some | None | `rtl-dir-attribute-and-auto.md` |
| I-M4 | Bidi override characters are stripped from untrusted input | [INT] paste `U+202E` into a name | Stripped or escaped | — | Rendered | `rtl-bidi-isolation-mixed-text.md` |

### L. Layout and mirroring
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-L1 (must) | Layout mirrors in RTL: nav, columns, steppers, pagination, linear progress, dialogs' close button | [VIS] compare LTR and RTL screenshots | Clean mirror | 1–2 components unmirrored | Mostly unmirrored | `rtl-mirroring-what-flips.md` |
| I-L2 (must) | Things that must not mirror don't: media controls, clocks, chart plots, logos, photos, phone numbers, URLs, code | [VIS] | None mirrored | One | Several, or a global flip | `rtl-mirroring-what-flips.md` |
| I-L3 | Styles use logical properties; physical ones are deliberate | [DOM] grep or computed `text-align: left/right` in RTL | Only allow-listed physical | A few stray | Systematic physical sides | `rtl-logical-properties.md` |
| I-L4 | Directional icons mirror, non-directional don't, from one registry | [VIS] [DOM] | All correct | 1–2 wrong | Global flip or none | `rtl-icons-directional.md` |
| I-L5 | Text containers survive expansion: no clipping or truncated UI chrome in the longest locale and the +40% pseudo-locale | [VIS] at 1280 and 320 px | None | User content only, with full text available | UI labels clipped | `i18n-text-expansion-and-layout.md` |

### B. Bidi text, numbers and dates
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-B1 (must) | Mixed Hebrew/Arabic + Latin + number strings render in the right order | [VIS] fixtures with names, IDs, ranges, phone numbers | All correct | One defect | Several | `rtl-bidi-isolation-mixed-text.md` |
| I-B2 (must) | Numbers and money use `Intl` with the full locale; sign on the correct side in RTL | [VIS] [DOM] negative values, currency | All | Minor inconsistency | Hand-built or `5-` | `rtl-numbers-digits-currency.md` |
| I-B3 | Digit system is one per screen and fits the market (Hebrew Western; Arabic per market, overridable) | [VIS] | Yes | Mixed without reason | Wrong for the market | `rtl-numbers-digits-currency.md` |
| I-B4 | Currency position and spacing consistent across the product | [VIS] | Consistent | Two variants | More | `rtl-numbers-digits-currency.md` |
| I-B5 (must) | Dates and times via `Intl.DateTimeFormat` with locale and time zone | [VIS] [DOM] | All | Some hand-built | `M/D` order shown to day-first locales | `i18n-dates-calendars-and-week-start.md` |
| I-B6 | Week start and weekend from the locale; business days respect it | [INT] calendar, SLA texts | Yes, overridable | Week start only | Hard-coded Monday or Sunday everywhere | `i18n-dates-calendars-and-week-start.md` |

### T. Typography
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-T1 | Hebrew and Arabic have planned font stacks | [DOM] computed `font-family` on RTL text | Planned stack | Planned on some components | Unplanned fallback | `rtl-typography-hebrew-arabic.md` |
| I-T2 | Line-height ≥ 1.5 (Hebrew) / 1.6 (Arabic) body; no clipped marks | [DOM] [VIS] | Yes | Headings tight | Clipping | `rtl-typography-hebrew-arabic.md` |
| I-T3 (must) | No faux italics and no letter-spacing on Arabic; Hebrew tracking only as emphasis | [DOM] | Yes | Isolated | Systematic | `rtl-typography-hebrew-arabic.md` |
| I-T4 | No meaning carried by uppercase | [VIS] eyebrows, badges | None | One | Several | `rtl-typography-hebrew-arabic.md` |

### F. Forms
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-F1 (must) | Field direction matches the value (`auto` free text, `ltr` email/URL/tel/password/codes) | [DOM] | All | One wrong | Email or phone fields RTL | `rtl-forms-input-direction.md` |
| I-F2 | Names and digits accepted in any script | [INT] enter `ג׳ורג׳`, `عبد الله`, `٠٥٠` | Accepted | One rejected | Latin-only validation | `rtl-forms-input-direction.md` |
| I-F3 | Validation messages in the page language | [INT] submit invalid with an English browser | Catalogue strings | Some native bubbles | Native bubbles only | `rtl-forms-input-direction.md` |
| I-F4 | Placeholders and hints in LTR fields read correctly | [VIS] | Right-aligned while empty, or none | — | Left-aligned Hebrew hints | `rtl-forms-input-direction.md` |

### S. Strings and grammar
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-S1 (must) | No hard-coded or concatenated UI strings | [VIS] accented pseudo-locale: unaccented text or split brackets | None | 1–2 | Systematic | `i18n-string-externalisation.md` |
| I-S2 (must) | Counted strings use CLDR plural categories (Hebrew `two`, Arabic six) | [CAT] | All | Missing `two` or `few/many` in some | `count === 1` logic | `i18n-plurals-gender-messageformat.md` |
| I-S3 | Second-person copy is gender-neutral or follows a user choice; third-person has a neutral branch | [CAT] [VIS] | Yes | Mostly | Masculine default | `i18n-plurals-gender-messageformat.md` |
| I-S4 | Lists, sorting and truncation via `Intl.ListFormat`, `Intl.Collator`, `Intl.Segmenter` | [DOM] [CAT] | Yes | Partly | `join(", ")`, `sort()`, `slice()` | `i18n-string-externalisation.md` |
| I-S5 | Catalogue entries have context; no reused strings across contexts | [CAT] | All described | Most | None | `i18n-string-externalisation.md` |

### C. Charts and tables
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-C1 | Table columns mirror; numeric columns align on the decimal point in RTL | [VIS] | Yes | Mirror but misaligned numbers | Unmirrored | `rtl-tables-and-charts.md` |
| I-C2 | Chart plots not mirrored (or fully mirrored with tables and tooltips); text around them mirrored | [VIS] | Consistent | Partly | Half-mirrored | `rtl-tables-and-charts.md` |
| I-C3 | Horizontal scroll code works in RTL | [INT] scroll shadows, "scroll to column" | Works | Cosmetic issue | Broken | `rtl-tables-and-charts.md` |

### X. Locale, testing and accessibility
| ID | Check | Recipe | 2 | 1 | 0 | Pattern |
|---|---|---|---|---|---|---|
| I-X1 (must) | Locale negotiation: stored choice → URL → `Accept-Language`; never IP for language | [INT] | Yes | URL-less but switchable | Forced by IP or header | `i18n-locale-negotiation-and-switchers.md` |
| I-X2 | Language switcher: native names with `lang`, no flags, keeps the page | [VIS] [DOM] | All | Flags or English names | Hidden or flag-only | `i18n-locale-negotiation-and-switchers.md` |
| I-X3 | Pseudo-locale and RTL screenshot tests in CI | Repository | Both | One | None | `i18n-pseudo-localisation-and-rtl-testing.md` |
| I-X4 (must) | Accessibility in each locale: WCAG 2.x AA, `lang` of parts, translated accessible names; for Israel, IS 5568 conformance and an accessibility statement | [DOM] axe per locale, [VIS] statement link | Yes | Minor gaps | Failing, or an overlay widget relied on for conformance | `iref-hebrew-sites-and-israeli-accessibility.md` |

## Anti-patterns (don't)
- Scoring only the English screens, or only the home page in RTL.
- Treating I-L2 as N/A because the product "has no video": charts, phone numbers and logos are in it too.
- Accepting a vendor's accessibility overlay as I-X4 evidence.
- Renumbering or reusing check IDs.

## Good references
- dashboard-ui `ref-design-review-rubric.md` — the same 0–2 scoring and bands, so dashboards that ship in RTL can report both scores together.
- [W3C Internationalization checker](https://validator.w3.org/i18n-checker/) — automated checks for `lang`, `dir`, encoding and language declarations ([DOM] evidence for I-M1, I-M3).
- [Material (v1)](https://m1.material.io/usability/bidirectionality.html), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/right-to-left) and [Wikimedia Codex](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) bidirectionality guidance — the source of the L-section criteria.
- [W3C, Internationalization quick tips](https://www.w3.org/International/quicktips/) — a short cross-check for the S-section.

## Bad references
- Rubric results from the sites recorded in `iref-hebrew-sites-and-israeli-accessibility.md` (headless checks, November 2026): ynet scores 0 on I-M1 (no `dir`), and its accessibility overlay script (equally.ai) is not I-X4 evidence; Ivory scores 1 on I-M1 (`lang="heb"`); Fox scores 0 on I-B4.

## Accessibility
- I-X4 bundles the accessibility checks that differ by locale. Run the full WCAG review separately; this rubric doesn't replace it.
- For Israeli sites, an accessibility statement page and a named accessibility coordinator contact are expected under the 2013 regulations (see the Israel pattern).

## Motion / interaction (if relevant)
- Slide and swipe directions are part of I-L1 (they mirror) and of reduced-motion review (they disappear).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Checks | 35 in 8 sections (M 4, L 5, B 6, T 4, F 4, S 5, C 3, X 4) | per screen × locale |
| Must-checks | I-M1, I-M2, I-L1, I-L2, I-B1, I-B2, I-B5, I-T3, I-F1, I-S1, I-S2, I-X1, I-X4 | block at 0 |
| Bands | ≥ 80% ship · 65–79% ship with fixes · < 65% fix first | release gate |
| Minimum locales | source, one RTL, the longest | scoring unit |

## Implementation sketch
```ts
type Score = 0 | 1 | 2 | "na";
type CheckId = `I-${"M" | "L" | "B" | "T" | "F" | "S" | "C" | "X"}${number}`;
type Result = { id: CheckId; score: Score; evidence: string; fix?: string };

const MUST = new Set<CheckId>(["I-M1", "I-M2", "I-L1", "I-L2", "I-B1", "I-B2", "I-B5", "I-T3", "I-F1", "I-S1", "I-S2", "I-X1", "I-X4"]);

export function grade(results: readonly Result[]): { percent: number; blocked: CheckId[]; band: "ship" | "ship-with-fixes" | "fix-first" } {
  const scored = results.filter((r): r is Result & { score: 0 | 1 | 2 } => r.score !== "na");
  const points = scored.reduce((sum, r) => sum + r.score, 0);
  const percent = scored.length ? Math.floor((points / (2 * scored.length)) * 100) : 0;
  const blocked = scored.filter((r) => r.score === 0 && MUST.has(r.id)).map((r) => r.id);
  const band = blocked.length || percent < 65 ? "fix-first" : percent < 80 ? "ship-with-fixes" : "ship";
  return { percent, blocked, band };
}
```

## Checklist
- [ ] Each key screen scored in the source locale, one RTL locale and the longest locale.
- [ ] Evidence (screenshot, DOM, catalogue excerpt) attached to every non-2 score.
- [ ] No must-check at 0 in any locale.
- [ ] Report lists each failure by ID with its fix, ordered by severity.
- [ ] Results stored so the next review compares against them.

## Sources
- https://validator.w3.org/i18n-checker/
- https://www.w3.org/International/quicktips/
- https://m1.material.io/usability/bidirectionality.html
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://www.w3.org/WAI/WCAG22/quickref/
- dashboard-ui: `ref-design-review-rubric.md`
- Every pattern file in this skill (linked per check).
