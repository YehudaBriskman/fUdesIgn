# The `dir` attribute, `dir="auto"` and base direction

> Declare `lang` and `dir` together on `<html>`, set direction in markup and never in CSS, put `dir="auto"` on every element that shows text you didn't write, and send `dirname` with form fields that accept free text.

**Category:** Right-to-left layout and bidi · **Applies to:** document root, app shell, user-generated content, search results, chat, comments, form fields, notifications, `<title>` · **Priority:** must

## When to use / when not
- Every page: `<html lang="he" dir="rtl">` (or `lang="ar" dir="rtl"`, `lang="en" dir="ltr"`). The two attributes travel together; `lang` alone doesn't set direction.
- Every place that renders text whose language you don't control (user names, product titles from a feed, search queries, chat messages, comments, filenames): `dir="auto"` or `<bdi>`.
- Local direction changes for known content: an English quote in a Hebrew page gets `lang="en" dir="ltr"` on its element.
- Not on the root as `dir="auto"`. The root's direction is a decision, not a guess.

## Rules (do)
- **Base direction in markup, not CSS.** W3C: "Never use CSS to apply the base direction." Markup survives reader modes, translation tools, copy-paste, search snippets, email clients and stylesheets that fail to load; `direction: rtl` in CSS does not. The CSS `direction` and `unicode-bidi` properties are for cases markup can't reach (SVG text, `::before` content), and the `rtl:`/`:dir()` styling hooks in `rtl-css-tooling-dir-tailwind.md` read the attribute.
- **Set both on language switch.** When the user switches locale client-side, update `document.documentElement.lang` and `.dir` in the same task, before the new strings paint, so there is no LTR flash of Hebrew.
- **Derive direction from the locale, not from a hard-coded list of two.** `new Intl.Locale(tag).getTextInfo().direction` gives `"rtl"` for `he`, `ar`, `fa`, `ur` (verified, Node 26 with ICU 78.3). Firefox doesn't ship `getTextInfo` yet, so keep a fallback set: `ar`, `he`, `fa`, `ur`, `ps`, `sd`, `ckb`, `yi`, `dv`, `ug`, plus any `-Arab`/`-Hebr` script subtag.
- **`dir="auto"` uses the first strong character.** W3C: it "looks at the first strong character to determine what base direction to apply." So `"iPhone 17 של אמא"` is detected LTR. When the first strong character is misleading, set the direction from metadata (the content's stored language) instead.
- **Inputs and textareas take `dir="auto"`** when they accept free text in either script (W3C: "The solution is to just add `dir="auto"` to the `input` tag."). W3C recommends `dir="auto"` on textareas too; browsers differ on whether each paragraph gets its own direction, so test multi-paragraph mixed input.
- **Send the direction with the value.** `<input name="title" dirname="title.dir" dir="auto">` posts `title.dir=rtl` or `ltr`. Store it, and render the saved text with that `dir` later ([MDN `dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/dirname)).
- **Fields that are LTR by nature** (email, URL, phone, IBAN, code, password) get `dir="ltr"`, not `auto`; see `rtl-forms-input-direction.md`.
- **`<title>` and attribute values can't contain markup**: if a title mixes directions, use Unicode isolates (see `rtl-bidi-isolation-mixed-text.md`).

## Anti-patterns (don't)
- `<html lang="he">` with `body { direction: rtl }` in CSS and no `dir` attribute. It renders, until a stylesheet is late or a tool reads the markup.
- `<html lang="he" dir="rtl">` on a page whose content is English (a common copy-paste from a template).
- `dir="rtl"` on the root and `text-align: left` on content wrappers to "fix" English blocks. Mark the English block `dir="ltr" lang="en"` instead.
- Detecting direction per keystroke with a regex and toggling `style.direction`. `dir="auto"` does this natively.
- Using `lang` to style direction (`:lang(he) { direction: rtl }`): language and direction are separate facts (Yiddish and Ladino in Hebrew script are RTL; Hebrew transliterated in Latin script is LTR).

## Good references
- [W3C, Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir) — root `dir`, "Never use CSS to apply the base direction", `dir="auto"` for inputs, `dirname`.
- [W3C, Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/) — how `dir` isolates content and when `dir="auto"` is right.
- [Hebrew Wikipedia](https://he.wikipedia.org/) — `<html lang="he" dir="rtl">`, and the interlanguage list tags each link with its own `lang` (checked with a headless browser, November 2026).
- [Kan (kan.org.il)](https://www.kan.org.il) and [BBC News Arabic](https://www.bbc.com/arabic) — `dir="rtl"` on the root element, `lang="he-il"` and `lang="ar"` respectively, and English brand strings marked `lang="en-GB"` on BBC (headless check, November 2026).
- [MDN, `dir` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) — values, inheritance and the `auto` algorithm.

## Bad references
- [ynet (ynet.co.il)](https://www.ynet.co.il) — `<html lang="he">` with no `dir` anywhere in the markup; the body computes to `direction: ltr` and RTL is applied by CSS on inner grid containers (headless check, November 2026). Anything outside those containers, and any tool reading the markup, sees an LTR document.
- [Walla (walla.co.il)](https://www.walla.co.il) — mixed: it ships `<bdi>` around 110 runs of text (good) but sets the page direction in CSS with no root `dir` (headless check, November 2026).

## Accessibility
- Screen readers pick voice and pronunciation from `lang` (WCAG 3.1.1 Language of Page, 3.1.2 Language of Parts). Direction comes from `dir`. Both are required; neither implies the other.
- IS 5568 (the Israeli web accessibility standard) is based on WCAG, so 3.1.1 and 3.1.2 apply to Israeli sites by law (see `iref-hebrew-sites-and-israeli-accessibility.md`).

## Motion / interaction (if relevant)
- Switching direction re-lays the whole page. Do it as a navigation (new URL per locale, see `i18n-locale-negotiation-and-switchers.md`) or inside a View Transition with no slide animation; a mirrored layout sliding across the screen is disorienting.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Root | `<html lang="{bcp47}" dir="{ltr\|rtl}">` | every page |
| Unknown content | `dir="auto"` or `<bdi>` | user and third-party strings |
| Free-text field | `dir="auto" dirname="{name}.dir"` | inputs, textareas |
| LTR-by-nature field | `dir="ltr"` | email, URL, tel, code, IBAN |
| RTL fallback set | `ar he fa ur ps sd ckb yi dv ug` + `-Arab`/`-Hebr` scripts | when `getTextInfo` is missing |

## Implementation sketch
```ts
type Direction = "ltr" | "rtl";
type TextInfoLocale = Intl.Locale & { getTextInfo?: () => { direction: Direction }; textInfo?: { direction: Direction } };

const RTL_LANGS = new Set(["ar", "he", "fa", "ur", "ps", "sd", "ckb", "yi", "dv", "ug"]);

export function directionOf(tag: string): Direction {
  const locale = new Intl.Locale(tag) as TextInfoLocale;
  const info = locale.getTextInfo?.() ?? locale.textInfo; // Chromium: method; Safari 17: accessor
  if (info) return info.direction;
  const script = locale.maximize().script;
  if (script === "Arab" || script === "Hebr" || script === "Thaa" || script === "Syrc") return "rtl";
  return RTL_LANGS.has(locale.language) ? "rtl" : "ltr";
}

export function applyLocale(tag: string): void {
  const root = document.documentElement;
  root.lang = tag;
  root.dir = directionOf(tag);
}
```
```html
<html lang="he" dir="rtl">
  <h1>הזמנות אחרונות</h1>
  <!-- third-party text: let the browser decide, isolated from the surrounding Hebrew -->
  <p>לקוח: <bdi>Ben's Café Ltd.</bdi> · 3 הזמנות</p>
  <form>
    <label for="t">כותרת</label>
    <input id="t" name="title" dir="auto" dirname="title.dir">
    <label for="e">אימייל</label>
    <input id="e" name="email" type="email" dir="ltr" autocomplete="email">
  </form>
  <blockquote lang="en" dir="ltr">Ship it.</blockquote>
</html>
```

## Checklist
- [ ] `<html>` has both `lang` and `dir`, and they agree with the content.
- [ ] No base direction set only in CSS.
- [ ] Every user- or feed-supplied string renders in `dir="auto"` or `<bdi>`.
- [ ] Free-text inputs have `dir="auto"` and `dirname`, and the stored direction is used when rendering.
- [ ] Email, URL, phone and code fields are `dir="ltr"`.
- [ ] Locale switch updates `lang` and `dir` before paint.
- [ ] Foreign-language passages carry their own `lang` (and `dir` if it differs).

## Sources
- https://www.w3.org/International/questions/qa-html-dir
- https://www.w3.org/International/articles/inline-bidi-markup/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/dirname
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTextInfo
- https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
- https://he.wikipedia.org/ , https://www.kan.org.il , https://www.bbc.com/arabic , https://www.ynet.co.il , https://www.walla.co.il (headless-browser inspection, November 2026)
- Local verification: Node v26.12 (ICU 78.3, CLDR 48) `Intl.Locale.prototype.getTextInfo`.
