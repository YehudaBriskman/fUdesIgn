# Hebrew and Arabic sites teardown, and Israeli accessibility (IS 5568)

> Learn from what real Hebrew and Arabic sites ship (root `dir`, `<bdi>`, LTR phone islands, native-name language links are the good habits; CSS-only direction, invalid `lang`, inconsistent `₪` and overlay widgets are the bad ones), and treat IS 5568 as WCAG AA plus a published accessibility statement, not as a widget purchase.

**Category:** References, anti-patterns and review · **Applies to:** products for Israeli and Arabic-speaking audiences; reviews, competitive audits, accessibility compliance · **Priority:** should

## When to use / when not
- Use as the evidence base when someone says "that's how Israeli sites do it", and before an Israeli launch to understand the accessibility obligations.
- Every observation below comes from a headless Chromium session in November 2026 (computed styles, DOM and visible text of the home page, `he-IL` browser locale); sites change, so re-check before quoting. Some major sites (gov.il, Bank Hapoalim, Zap) served bot-protection pages and are not assessed.
- Legal points are a summary for designers and engineers, not legal advice.

## Rules (do)
- **Teardown (home pages, November 2026):**

  | Site | Good | Bad |
  |---|---|---|
  | [Bituach Leumi](https://www.btl.gov.il) | `lang="he" dir="rtl"` on the root; service numbers (`*6050`, regional numbers) in `tel:` links with `dir="ltr"` and `unicode-bidi: isolate`; language links in native script with `lang` (`عربية`, `Русский`, `English`, `Français`, `አማርኛ`); accessibility statement linked (`הצהרת נגישות`); Rubik as the Hebrew family | Physical `text-align: right` on links (works in a Hebrew-only page, fails once CSS is shared with LTR) |
  | [Hebrew Wikipedia](https://he.wikipedia.org/) | `lang="he" dir="rtl"`; 16px body at 26px line-height; interlanguage links each with their own `lang` and native names | — |
  | [Walla](https://www.walla.co.il) | About 110 runs wrapped in `<bdi>`; Ploni family; 18/27px body | No `dir` on the root; direction from CSS |
  | [Kan](https://www.kan.org.il) | `lang="he-il" dir="rtl"` on the root; 16/24px | — |
  | [BBC News Arabic](https://www.bbc.com/arabic) | `lang="ar" dir="rtl"`; dedicated Arabic family (BBC Reith Qalam); 14/22px; English brand strings marked `lang="en-GB"` | — |
  | [Rami Levy](https://www.rami-levy.co.il/he) | `dir="rtl"` on the root; prices consistently `5.40 ₪` | — |
  | [ynet](https://www.ynet.co.il) | `lang="he"` | No `dir` anywhere in markup (body computes `ltr`; inner grid containers set RTL in CSS); Hebrew spans tracked 0.84px; loads an accessibility overlay script (equally.ai) |
  | [Bank Leumi](https://www.leumi.co.il) | `lang="he" dir="rtl"` | Hebrew navigation tracked 0.8px; a paragraph at line-height equal to font size |
  | [Ivory](https://www.ivory.co.il) | — | `lang="heb"` (non-canonical; `he` is correct); `419₪` and `419 ₪` on one tile |
  | [Fox](https://www.fox.co.il) | `lang="he-IL" dir="rtl"` | `199 ₪` and `₪199` in adjacent promos; agorot as superscript Unicode digits (`21⁹⁰₪`) |
  | [Super-Pharm](https://www.super-pharm.co.il) | `lang="he" dir="rtl"` | Unit prices wrapped in legacy RLE/PDF embedding characters |
  | [Shufersal](https://www.shufersal.co.il/online/he/) | `lang="he"` | No root `dir`, body computes `ltr`; mixed `10₪` and `10.90 ₪` spacing |

- **Patterns to copy:** the root `lang` + `dir` pair (Wikipedia, Kan, Bituach Leumi), `<bdi>` around interpolated runs (Walla), LTR-isolated phone numbers (Bituach Leumi), native-name language links with `lang` (Bituach Leumi, Wikipedia), a dedicated script family and roomy line-height (BBC Arabic, Wikipedia).
- **Israeli accessibility law, in brief:**
  - The Equal Rights for Persons with Disabilities Law (1998) and the Equal Rights for People with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013, require services offered to the public, including websites and apps, to be accessible.
  - The technical standard is **IS 5568**, which took effect in October 2017; BOIA summarises it as "conformance with WCAG 2.0 Level AA". Some vendors describe later editions as aligned with WCAG 2.1; aim for WCAG 2.2 AA and you satisfy both readings.
  - Small businesses had until October 2020; BOIA reports fines "up to 50,000 NS" and that plaintiffs need not prove damages.
  - Sites publish an **accessibility statement** (`הצהרת נגישות`) naming the standard and level, known limitations, the date of the last review and an accessibility coordinator's contact details; the State Comptroller's statement is a typical example.
- **Overlays don't make a site conformant.** Accessibility overlay widgets inject a toolbar and automated "fixes" but don't repair markup. In 2025 the US FTC finalised an order requiring accessiBe, an Israeli overlay vendor, to pay $1 million over claims that its tool could make any site WCAG-compliant. Fix the markup; publish an honest statement.
- **What IS 5568 adds to this skill's rules in practice:** WCAG 3.1.1/3.1.2 make `lang` (and in practice `dir`) a legal requirement; 1.4.4/1.4.10/1.4.12 make expansion-safe layouts and Hebrew line-height a requirement; 1.3.1/4.1.2 cover the form labels in `rtl-forms-input-direction.md`.

## Anti-patterns (don't)
- Treating "the CSS makes it RTL" as done (ynet, Walla, Shufersal pattern).
- Non-canonical `lang` values (`heb`, `iw`).
- Different `₪` order or spacing between components of one site.
- Buying an overlay instead of fixing markup, and citing it in the accessibility statement.
- An accessibility statement with no date, no known limitations and no contact.

## Good references
- [Bituach Leumi](https://www.btl.gov.il) — the most complete set of good habits found in this sample.
- [Hebrew Wikipedia](https://he.wikipedia.org/) and [BBC News Arabic](https://www.bbc.com/arabic) — root direction, language-of-parts markup and script-appropriate typography at scale.
- [State Comptroller of Israel, Accessibility statement](https://www.mevaker.gov.il/en/accessibility-statement) — cites the 5773-2013 regulations and IS 5568 at AA, gives a coordinator contact and a last-updated date, and discloses inaccessible PDFs with accessible alternatives.
- [BOIA, Israel's digital accessibility laws: an overview](https://www.boia.org/blog/israels-digital-accessibility-laws-an-overview) — coverage, WCAG 2.0 AA, dates and fines.
- [Standards Institution of Israel, SI 5568 part 2 (Hebrew PDF, September 2023)](https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-2-september-2023.pdf) — the official text for digital documents, published on gov.il.

## Bad references
- [ynet](https://www.ynet.co.il), [Ivory](https://www.ivory.co.il), [Fox](https://www.fox.co.il), [Super-Pharm](https://www.super-pharm.co.il), [Shufersal](https://www.shufersal.co.il/online/he/) — specific defects in the table above.
- [FTC, final order requiring accessiBe to pay $1 million](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million) (April 2025) — overlay compliance claims found deceptive.
- [Overlay Fact Sheet](https://overlayfactsheet.com/) — an open letter signed by hundreds of accessibility practitioners explaining why overlays don't deliver conformance.

## Accessibility
- This whole file is accessibility-adjacent; the operational rule is: conform to WCAG AA (2.2 recommended), test with Hebrew screen-reader voices, and publish a truthful, dated statement with a contact.
- Arabic-language services in Israel need the same conformance in Arabic, including `lang="ar"` and Arabic accessible names.

## Motion / interaction (if relevant)
- Overlay widgets commonly add their own motion and focus traps (floating buttons, auto-opening panels); none of that counts toward WCAG 2.2.2 or 2.3.3, and it can break them.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Legal baseline (Israel) | IS 5568, WCAG 2.0 AA (target WCAG 2.2 AA) | all public-facing services |
| Statement | standard + level, limitations, last-review date, coordinator contact | footer link `הצהרת נגישות` |
| Root markup | `<html lang="he" dir="rtl">` | every Hebrew page |
| Phone markup | `<a href="tel:…" dir="ltr">` | service numbers |
| Overlay widgets | 0 | never a conformance strategy |

## Implementation sketch
```html
<footer lang="he" dir="rtl">
  <nav aria-label="מידע">
    <a href="/he/accessibility">הצהרת נגישות</a>
    <a href="tel:*1234" dir="ltr">*1234</a>
  </nav>
  <ul class="langs">
    <li><a href="/ar/" lang="ar" hreflang="ar">العربية</a></li>
    <li><a href="/en/" lang="en" hreflang="en" dir="ltr">English</a></li>
    <li><a href="/ru/" lang="ru" hreflang="ru" dir="ltr">Русский</a></li>
  </ul>
</footer>
```
```ts
// Accessibility statement content model, so the page can't ship without the required parts.
type AccessibilityStatement = {
  standard: "IS 5568";
  wcag: "2.0 AA" | "2.1 AA" | "2.2 AA";
  lastReviewed: string; // ISO date
  coordinator: { role: string; email: string; phone: string };
  knownLimitations: { area: string; workaround: string }[];
  testedWith: string[]; // browsers and assistive technologies
};

export function missingParts(s: Partial<AccessibilityStatement>): string[] {
  const required: (keyof AccessibilityStatement)[] = ["standard", "wcag", "lastReviewed", "coordinator", "knownLimitations", "testedWith"];
  return required.filter((k) => s[k] === undefined);
}
```

## Checklist
- [ ] Root `lang` + `dir`, canonical tags, LTR-isolated phone numbers, `<bdi>` for interpolations.
- [ ] One `₪` format across the product.
- [ ] WCAG 2.2 AA conformance tested in Hebrew (and Arabic where offered).
- [ ] Accessibility statement published with standard, level, limitations, date and coordinator contact.
- [ ] No overlay widget presented as conformance.
- [ ] Teardown observations re-checked before being quoted.

## Sources
- https://www.btl.gov.il , https://he.wikipedia.org/ , https://www.walla.co.il , https://www.kan.org.il , https://www.bbc.com/arabic , https://www.rami-levy.co.il/he , https://www.ynet.co.il , https://www.leumi.co.il , https://www.ivory.co.il , https://www.fox.co.il , https://www.super-pharm.co.il , https://www.shufersal.co.il/online/he/ (headless Chromium inspection, November 2026)
- https://www.boia.org/blog/israels-digital-accessibility-laws-an-overview
- https://www.mevaker.gov.il/en/accessibility-statement
- https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-2-september-2023.pdf
- https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million
- https://overlayfactsheet.com/
- https://www.w3.org/WAI/WCAG22/quickref/
