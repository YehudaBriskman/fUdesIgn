# Text expansion and resilient layout

> Size every text container for the longest supported language, not English: budget +30–40% for sentences and up to 200–300% for labels of 10 characters or fewer, let text wrap before it truncates, and give scripts like Arabic extra vertical room.

**Category:** Internationalisation · **Applies to:** buttons, tabs, nav, table headers, chips, badges, cards, dialogs, form labels, charts' axis labels, email templates · **Priority:** must

## When to use / when not
- Use whenever a component holds translatable text, from the first design, not after translation arrives.
- It is a layout rule, not a translation rule: translators shouldn't be asked to "make it shorter" except for genuinely fixed slots (a 5-character segmented control on a watch face).
- Truncation mechanics (ellipsis, middle truncation, revealing the full text) are in the modern-web-guidance [single-line-overflow.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md); this file is about leaving room so you rarely need them.

## Rules (do)
- **Expansion budget (English source to European languages, IBM figures cited by W3C):**

  | English source length | Average expansion |
  |---|---|
  | up to 10 characters | 200–300% |
  | 11–20 | 180–200% |
  | 21–30 | 160–180% |
  | 31–50 | 140–160% |
  | 51–70 | 151–170% |
  | over 70 | 130% |

  Short labels expand most: "Save" is `Speichern` (German), "Views" became `-mal angesehen` at 2.8× in W3C's Flickr example. Sentences settle around +30–40%.
- **German, Finnish and Dutch build long compounds** that don't wrap (W3C: "Eingabeverarbeitungsfunktionen" for "Input processing features"). Allow `overflow-wrap: anywhere` on narrow labels and `hyphens: auto` with a correct `lang`, since hyphenation only applies to declared languages.
- **Hebrew and Arabic are often shorter than English in characters, but not reliably,** and they need more *vertical* space: W3C lists Arabic among the scripts that "need more vertical space" than Latin. Don't use Hebrew's shortness to justify tight widths; the same component ships in German.
- **No fixed widths on text containers.** Buttons, tabs, chips and badges use `min-inline-size` with padding, never `width`. Table headers wrap (`text-wrap: balance`), and columns size to content.
- **Wrap first, truncate last.** Two-line button labels are better than a truncated verb. Truncate only user content in fixed rows (file names, titles), and keep the full text in the DOM as the accessible name.
- **Nav and tab bars overflow gracefully**: horizontal scroll with fade affordances, or a "More" menu, decided by a container query, not a breakpoint tuned to English.
- **Form fields** can grow with content using `field-sizing: content` with `min-inline-size` and `max-inline-size` ([form-fields-automatically-fit-contents.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md)).
- **Labels above inputs**, not beside them, so label length doesn't fight field width.
- **Icon-only isn't the fix.** Replacing labels with icons to save space trades a layout problem for a comprehension problem (see `rtl-icons-directional.md`).
- **Test with pseudo-localisation** that expands strings by at least 30–40% and wraps them in brackets, before any real translation (see `i18n-pseudo-localisation-and-rtl-testing.md`).
- **Line-height tokens must not clip taller scripts**: use unitless line-heights and no fixed `height` on text rows; `block-size: auto` with `min-block-size`.

## Anti-patterns (don't)
- `width: 96px` buttons sized to "Submit".
- `white-space: nowrap` on every label "to keep it tidy".
- Truncating translated UI chrome with an ellipsis (`Einstellun…`).
- Fixed-height cards whose text gets clipped in German or whose diacritics get clipped in Arabic.
- Concatenating short strings to "save space" (see `i18n-string-externalisation.md`).
- Designing in Hebrew only (short) and assuming English and Russian will fit.

## Good references
- [W3C, Text size in translation](https://www.w3.org/International/articles/article-text-size) — the IBM expansion table, German compounds and vertical expansion of non-Latin scripts.
- [modern-web-guidance, single-line-overflow.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md) — truncation as a visual-only last resort, the full text kept for accessibility and find-in-page.
- [modern-web-guidance, typography.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/typography.md) — `overflow-wrap` for long strings, `hyphens: auto` needs `lang`, `text-wrap: balance` for headers.
- [Material Design (v1), Bidirectionality: Localization](https://m1.material.io/usability/bidirectionality.html) — "Graphics that include text usually require localization", a reason to keep text out of images so it can expand.

## Bad references
- The W3C article's own Flickr example: "views" translated to German as `-mal angesehen`, 2.8 times longer, in a slot sized for the English word ([Text size in translation](https://www.w3.org/International/articles/article-text-size)).
- Fixed-width segmented controls and tab bars in dashboards (dashboard-ui `comp-tabs-segmented-pills.md` lists tab labels truncated to "Fin…" or "Valu…" as an anti-pattern), which are the first components to break in German.

## Accessibility
- WCAG 1.4.4 Resize Text and 1.4.10 Reflow require content to survive 200% zoom and 320 CSS px width; a layout that survives German at 200% zoom is a layout that survives most of i18n.
- WCAG 1.4.12 Text Spacing overrides add width and height too; fixed containers fail both.
- Truncated text must keep its full value as the accessible name.

## Motion / interaction (if relevant)
- Animating `width` for expanding buttons (busy states) breaks when the label length changes per language; animate `opacity`/`scale` of an inner element, keep the width intrinsic.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Sentence budget | +30–40% over English | paragraphs, descriptions, errors |
| Short-label budget | up to 200–300% for ≤ 10 chars | buttons, tabs, chips |
| Button sizing | `min-inline-size` + `padding-inline`, no `width` | all buttons |
| Long words | `overflow-wrap: anywhere`, `hyphens: auto` with `lang` | narrow labels, German |
| Headers | `text-wrap: balance` | table and card headers |
| Pseudo-loc expansion | +40% and bracket markers | CI screenshots |

## Implementation sketch
```css
.btn {
  min-inline-size: 6rem;
  padding-inline: var(--space-4, 16px);
  padding-block: var(--space-2, 8px);
  white-space: normal;
  text-wrap: balance;
  overflow-wrap: anywhere;
}
.chip { max-inline-size: 100%; }
.chip__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* user content only: the full text stays in the DOM */
}
th { text-wrap: balance; hyphens: auto; }
.tabs { container-type: inline-size; }
@container (inline-size < 32rem) {
  .tabs__list { overflow-x: auto; scroll-snap-type: x proximity; }
}
.card { min-block-size: 8rem; block-size: auto; }
input.fit { field-sizing: content; min-inline-size: 8ch; max-inline-size: 100%; }
```
```ts
/** Rough expansion budget for a source string, using the W3C/IBM table. */
export function expansionBudget(source: string): number {
  const n = [...source].length;
  if (n <= 10) return 3.0;
  if (n <= 20) return 2.0;
  if (n <= 30) return 1.8;
  if (n <= 50) return 1.6;
  if (n <= 70) return 1.7;
  return 1.3;
}

/** Flag catalogue entries whose maxLength can't hold the expected expansion. */
export function tightSlots(entries: { id: string; source: string; maxLength?: number }[]): string[] {
  return entries
    .filter((e) => e.maxLength !== undefined && [...e.source].length * expansionBudget(e.source) > e.maxLength)
    .map((e) => e.id);
}
```

## Checklist
- [ ] No fixed `width` or `height` on text-bearing components.
- [ ] Buttons and tabs survive +200% on short labels (wrap, not clip).
- [ ] Long compounds wrap (`overflow-wrap`, `hyphens` with `lang`).
- [ ] Only user content truncates, and its full text is available.
- [ ] Nav and tab overflow is handled with container queries.
- [ ] Pseudo-localised screenshots pass at 100% and 200% zoom.
- [ ] Arabic text has room for diacritics (no fixed row heights).

## Sources
- https://www.w3.org/International/articles/article-text-size
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/single-line-overflow.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/typography.md
- https://m1.material.io/usability/bidirectionality.html
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- dashboard-ui: `comp-tabs-segmented-pills.md`
