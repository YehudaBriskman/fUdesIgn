# String externalisation and translatable copy

> Every user-visible string lives in a message catalogue as a whole sentence with named placeholders and a note for the translator; code never concatenates, splits or reuses fragments, and lists, names, sorting and truncation go through `Intl` instead of English-shaped helpers.

**Category:** Internationalisation · **Applies to:** UI copy, errors, emails, notifications, `aria-label`s, `alt` text, page titles, server-generated text · **Priority:** must

## When to use / when not
- Use from the first commit of any product that might be translated, which includes products whose users paste Hebrew or Arabic into an English UI and need correct lists and sorting.
- Not for content (articles, help pages, marketing): that belongs in a CMS with per-locale entries, not in a UI catalogue.
- Plurals, gender and ICU MessageFormat syntax are in `i18n-plurals-gender-messageformat.md`.

## Rules (do)
- **One message = one complete sentence** (or one complete label) with named placeholders: `"order.shipped": "Order {orderId} shipped to {name}."`. Translators reorder placeholders; Hebrew puts the recipient before the verb as often as after.
- **Never concatenate translated fragments.** `t("you_have") + n + t("messages")` can't be translated into languages with different word order, case or agreement, and it can't be bidi-isolated (see `rtl-bidi-isolation-mixed-text.md`).
- **Never reuse a string across contexts because the English matches.** "Open" (verb, a button) and "Open" (adjective, a status) are different words in Hebrew (`פתיחה` / `פתוח`). One key per use, with a description: `{ "id": "ticket.status.open", "description": "Status badge: the ticket is not closed yet" }`.
- **Give translators context:** a description, the placeholder types and example values, the maximum length if the slot is constrained, and a screenshot link for anything visual. Most bad translations are context failures.
- **No text in images, icons or SVG paths.** Hebrew and Arabic need different text and often a mirrored composition (see `rtl-mirroring-what-flips.md`).
- **Rich text via tags in the message, not HTML in code:** `"terms": "I accept the <link>terms</link>"` rendered with a tag function, so translators can move the link.
- **Fallback chain and missing-key reporting:** `he-IL → he → en`, log missing keys in development and CI, and never show the raw key to users.
- **Lists use `Intl.ListFormat`.** Hebrew attaches "and" to the last word with no space: `new Intl.ListFormat("he").format(["א", "ב", "ג"])` → `א, ב וג` (verified, Node 26.12). A `join(", ") + " and "` helper is wrong in Hebrew and Arabic.
- **Sorting uses `Intl.Collator`** for the user's locale, never `<` or `localeCompare()` without a locale. Hebrew final letters (`ך ם ן ף ץ`) and Arabic letter forms must sort with their base letters; mixed-script lists need a predictable script order.
- **Truncation and character counting use `Intl.Segmenter`** (graphemes), not `.length` or `slice()`: Hebrew niqqud and Arabic harakat are combining marks, and an emoji is several code units. Prefer CSS truncation (`text-overflow: ellipsis`) with the full text available.
- **Language and region names use `Intl.DisplayNames`**: `new Intl.DisplayNames(["he"], { type: "language" }).of("he")` → `עברית`.
- **Server-generated strings are localised too:** emails, PDFs, push notifications and SMS take the user's stored locale, not the server's default.
- **Keys are stable and semantic** (`checkout.payment.cardDeclined`), not the English text (`"Your card was declined"`), so English copy edits don't orphan every translation.

## Anti-patterns (don't)
- Building sentences from fragments, including "smart" helpers like `pluralize(word)`, `capitalize(word)` or `article(word)`.
- English strings hard-coded in components "for now".
- A shared `common.ok` used for both "OK" and "Confirm payment".
- `items.join(", ")` for user-visible lists; `array.sort()` for names.
- `str.slice(0, 20) + "…"` on user content.
- Error messages assembled on the server in English and shown verbatim to Hebrew users.
- Translating with machine translation at runtime for UI chrome (inconsistent terms, no review, no context).

## Good references
- [W3C, Internationalization quick tips: text and strings](https://www.w3.org/International/quicktips/) — don't concatenate, avoid text in images, allow for expansion.
- [MDN, Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat), [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator), [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) — the built-ins that replace English-shaped helpers.
- [Unicode MessageFormat 2.0](https://messageformat.unicode.org/) — stable since CLDR 47 (March 2025); the format catalogues should be able to grow into.
- [Mozilla Fluent, good practices for developers](https://github.com/projectfluent/fluent/wiki/Good-Practices-for-Developers) — one message per use, context for localisers, no fragment reuse.

## Bad references
- English-only `pluralize`-style helpers ([pluralize on npm](https://www.npmjs.com/package/pluralize)) used in UI copy: correct for English nouns, meaningless for Hebrew dual forms and Arabic's six plural categories.
- [MDN, `Array.prototype.join()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) used for visible lists: the separator is fixed, so the Hebrew conjunction `ו`, which attaches to the last item with no space (`א, ב וג`), can't be expressed; `Intl.ListFormat` exists for this.

## Accessibility
- `aria-label`, `alt`, `title` and live-region announcements are strings too: they go in the catalogue with the same context rules.
- The page `lang` must match the language of the strings actually rendered; a missing-key fallback to English inside a Hebrew page needs `lang="en"` on that element (WCAG 3.1.2), or better, no fallback in production.

## Motion / interaction (if relevant)
- Announcements in live regions (`aria-live`) should be complete localised sentences, not fragments assembled at runtime.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Catalogue entry | `{ id, message, description, maxLength?, screenshot? }` | every string |
| Placeholder syntax | `{name}` (ICU) | all interpolation |
| Fallback chain | `he-IL → he → en` | missing keys |
| Lists | `Intl.ListFormat(locale, { type: "conjunction" })` | "A, B and C" |
| Sorting | `Intl.Collator(locale, { sensitivity: "base", numeric: true })` | names, files |
| Truncation | `Intl.Segmenter(locale, { granularity: "grapheme" })` | counters, previews |

## Implementation sketch
```ts
type Message = { message: string; description: string; maxLength?: number };
type Catalogue = Record<string, Message>;

export const he: Catalogue = {
  "order.shipped": { message: "ההזמנה {orderId} נשלחה אל {name}.", description: "Toast after shipping; name is the recipient" },
  "ticket.status.open": { message: "פתוח", description: "Status badge: ticket not closed yet", maxLength: 12 },
  "ticket.action.open": { message: "פתיחה", description: "Button: open the ticket details" },
};

const collators = new Map<string, Intl.Collator>();
export function sortByName<T extends { name: string }>(rows: readonly T[], locale: string): T[] {
  let c = collators.get(locale);
  if (!c) { c = new Intl.Collator(locale, { sensitivity: "base", numeric: true }); collators.set(locale, c); }
  const cmp = c;
  return [...rows].sort((a, b) => cmp.compare(a.name, b.name));
}

export const formatList = (items: string[], locale: string): string =>
  new Intl.ListFormat(locale, { type: "conjunction", style: "long" }).format(items);

/** Truncate by user-perceived characters, never inside a grapheme (niqqud, harakat, emoji). */
export function truncateGraphemes(text: string, max: number, locale: string): string {
  const graphemes = [...new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(text)].map((s) => s.segment);
  return graphemes.length <= max ? text : `${graphemes.slice(0, max - 1).join("")}…`;
}

export function translate(cat: Catalogue, fallback: Catalogue, id: string, values: Record<string, string> = {}): string {
  const entry = cat[id] ?? fallback[id];
  if (!entry) {
    console.warn(`missing message ${id}`);
    return "";
  }
  return entry.message.replace(/\{(\w+)\}/g, (_m, k: string) => values[k] ?? `{${k}}`);
}
```

## Checklist
- [ ] No user-visible literal strings in components, templates or server responses.
- [ ] No concatenation of translated fragments; every placeholder is named.
- [ ] Every catalogue entry has a description; constrained slots have `maxLength`.
- [ ] Lists use `Intl.ListFormat`; sorting uses `Intl.Collator` with the user's locale.
- [ ] Truncation and counting use graphemes.
- [ ] Missing keys are reported in CI and never shown raw.
- [ ] Emails, notifications and exports use the user's stored locale.

## Sources
- https://www.w3.org/International/quicktips/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
- https://messageformat.unicode.org/
- https://blog.unicode.org/2025/03/unicode-cldr-47-release-messageformat-2.html
- https://github.com/projectfluent/fluent/wiki/Good-Practices-for-Developers
- https://www.npmjs.com/package/pluralize
- Local verification: Node v26.12 `Intl.ListFormat("he")` and `Intl.DisplayNames(["he"])` outputs.
