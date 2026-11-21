# Typography for Hebrew and Arabic

> Give Hebrew and Arabic their own font stacks (Inter has neither script), more line-height than Latin, no faux italics, no Latin-tuned letter-spacing (and none at all in Arabic), and emphasis through weight instead of case or slant.

**Category:** Right-to-left layout and bidi · **Applies to:** font stacks, type tokens, headings, body copy, labels, emphasis, numbers in tables · **Priority:** must

## When to use / when not
- Use whenever a type system designed for Latin (like dashboard-ui's `--font-sans: Inter, …`) renders Hebrew or Arabic, which includes user content in an English product.
- Scope every rule with `:lang(he)` / `:lang(ar)` (and `fa`, `ur`), not `:dir(rtl)`. Typography follows the script; direction is a separate fact.
- Put inherited settings (font stack, line-height) on the element that declares the language (`:is(:root, [lang]):lang(he)`): a bare `:lang(he)` matches every descendant and overrides components' own line-heights.
- Persian and Urdu share the Arabic script but have their own typographic traditions (Urdu prefers Nastaliq); treat them as separate locales.

## Rules (do)
- **Font stacks per script.** Inter covers Latin, Greek and Cyrillic, not Hebrew or Arabic, so without a stack the browser falls back to whatever is installed, and line metrics jump.
  - Hebrew UI: `"Noto Sans Hebrew", Assistant, Heebo, Rubik, "Segoe UI", "Arial Hebrew", Arial, sans-serif`. Serif for long reading: `"Frank Ruhl Libre", "Noto Serif Hebrew", David, serif`.
  - Arabic UI: `"Noto Sans Arabic", "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif`. Body reading: `"Noto Naskh Arabic", "Amiri", serif` (Naskh is the default reading style for Arabic news text).
  - To keep a brand Latin face for Latin words and digits, list it first (`Inter, "Noto Sans Hebrew", …`): browsers take each glyph from the first family that has it, so Hebrew falls through to the Hebrew family while digits keep the brand's tabular figures. Set line-height explicitly, since metrics come from the first family.
  - Real Hebrew sites ship their own or licensed families: Rubik on Bituach Leumi, Ploni on Walla, Open Sans (which has a Hebrew subset) on Haaretz, a custom family on ynet; BBC Arabic uses its own BBC Reith Qalam (headless check, November 2026).
- **Line-height: more than Latin.** Measured body text: Hebrew Wikipedia 16/26 px (1.63), Walla 18/27 (1.5), Kan 16/24 (1.5), BBC Arabic 14/22 (1.57) (headless check, November 2026). W3C notes Arabic is among the scripts that "need more vertical space" than Latin. Defaults:
  - Hebrew body 1.5–1.6, headings at least 1.25.
  - Arabic body 1.6–1.8, headings at least 1.3; tall ascenders, descenders and diacritics clip at 1.1.
  - The dashboard-ui display tokens (`--type-hero` and `--type-kpi` at line-height 1.1) are tuned for Latin numerals; for Arabic text labels raise them to 1.3.
- **No faux italics.** W3C's Hebrew layout draft: "The use of italic fonts in Hebrew is controversial" and "Slanted fonts are not used in newspapers." Arabic has no italic tradition either; synthetic obliques of Arabic look broken. Set `em, i, cite, dfn { font-style: normal }` under `:lang(he)` and `:lang(ar)`, emphasise with weight (600) or colour, and add `font-synthesis-style: none` so the browser never fakes a slant.
- **Letter-spacing:**
  - **Arabic: 0, always.** Arabic is cursive; CSS Text 3 says a browser that "cannot expand text from a cursive script without breaking its cursive connections … must not apply spacing" at all, and browsers that do apply it break the joins. Reset the Latin tokens (`--track-display: -0.02em`, `--track-meta: 0.01em`) to 0.
  - **Hebrew: 0 by default.** Hebrew does use tracking as a deliberate emphasis device (W3C hlreq: Hebrew "uses letter-spacing (tracking) to emphasise or highlight text"), so it isn't banned, but Latin-tuned tracking on every label is not that. Leumi tracks its Hebrew navigation labels at 0.8px and ynet tracks Hebrew quote spans at 0.84px (headless check, November 2026); neither is emphasis.
- **No case.** Hebrew and Arabic have no uppercase, so `text-transform: uppercase` does nothing, and an "eyebrow" label that relied on caps + tracking loses its cue. Replace it with weight, size or colour under `:lang(he)`/`:lang(ar)`.
- **Optical size next to Latin.** Hebrew and Arabic glyphs look smaller than Latin capitals at the same `font-size`. Apple suggests increasing RTL text "by about 2 points" when it sits next to all-caps Latin. On the web: bump Hebrew/Arabic labels one step (14 → 15px), or pick fonts designed as a matched Latin/Hebrew or Latin/Arabic pair (Noto, IBM Plex Sans Hebrew/Arabic, Rubik).
- **Alignment and justification.** Use `text-align: start` everywhere. Avoid `justify` for Arabic UI text: proper Arabic justification uses kashida elongation, which browsers don't implement well; for Hebrew, justified columns are traditional in print but produce rivers in narrow UI columns.
- **Numbers.** Hebrew fonts' Latin digits often lack `tnum`. Check `font-variant-numeric: tabular-nums` actually changes widths in your Hebrew font; if not, set numeric cells in a matched Latin font (see `data-number-formatting.md`).
- **Niqqud and harakat** (vowel marks) need extra line-height and fonts that position them well; they appear in children's, religious and language-learning content, and in names. Test with a pointed string.
- **Load only the scripts you need.** `@font-face` with `unicode-range: U+0590-05FF, U+FB1D-FB4F` (Hebrew) and `U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF` (Arabic) lets Latin-only pages skip the download.

## Anti-patterns (don't)
- Shipping a Latin-only webfont and letting Hebrew fall back to Times New Roman or Arial in some browsers, with different metrics and line-height per OS.
- `<em>` rendering as a synthetic Hebrew oblique.
- Uppercase tracked eyebrows (`text-transform: uppercase; letter-spacing: 0.08em`) copied to the Hebrew build.
- Any `letter-spacing` on Arabic, including the negative tracking of display tokens.
- `line-height: 1` or `1.1` on Arabic headings: diacritics and descenders collide between lines.
- Mixing two Hebrew families with different x-heights in one view.

## Good references
- [W3C, Hebrew Layout Requirements (editor's draft)](https://w3c.github.io/hlreq/) — italics, emphasis with bold and tracking, maqaf behaviour.
- [W3C, Arabic and Persian Layout Requirements](https://www.w3.org/TR/alreq/) — cursive joining, kashida, why spacing breaks Arabic.
- [CSS Text Module Level 3, cursive scripts](https://www.w3.org/TR/css-text-3/#cursive-tracking) — the rule against letter-spacing that breaks joins.
- [Apple HIG, Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left) — the "about 2 points" optical balance with uppercase Latin.
- [Noto Sans Hebrew](https://fonts.google.com/noto/specimen/Noto+Sans+Hebrew) and [Noto Naskh Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic) — open fonts with matching Latin; [Rubik](https://fonts.google.com/specimen/Rubik), [Heebo](https://fonts.google.com/specimen/Heebo) and [Assistant](https://fonts.google.com/specimen/Assistant) are common Hebrew UI choices.
- [Hebrew Wikipedia](https://he.wikipedia.org/) — body 16px at 26px line-height (1.63).
- [BBC News Arabic](https://www.bbc.com/arabic) — a dedicated Arabic family (BBC Reith Qalam) at 1.57 line-height, no tracking.

## Bad references
- [Bank Leumi](https://www.leumi.co.il) — Hebrew navigation labels tracked at 0.8px and a paragraph set at line-height equal to its font size (37.3px/37.3px) (headless check, November 2026).
- [ynet](https://www.ynet.co.il) — Hebrew quote spans with 0.84px tracking (headless check, November 2026).
- Templates that set `font-family: Inter, sans-serif` with no Hebrew or Arabic stack: Inter has no Hebrew or Arabic glyphs, so every RTL string renders in an unplanned fallback with different metrics per OS ([Inter](https://rsms.me/inter/) lists Latin, Greek and Cyrillic only).

## Accessibility
- WCAG 1.4.12 Text Spacing: content must survive user overrides of line-height 1.5, letter-spacing 0.12em and word-spacing 0.16em. Users of Arabic may set letter-spacing that breaks joins; that's their choice, but your layout must not clip or overlap when they do.
- Faux italics and tight tracking hurt legibility for readers with dyslexia in Hebrew as in Latin; weight-based emphasis is safer.
- IS 5568 inherits WCAG's resize and spacing criteria (see `iref-hebrew-sites-and-israeli-accessibility.md`).

## Motion / interaction (if relevant)
- Font swaps between fallback and webfont shift Hebrew and Arabic lines more than Latin because metrics differ more. Use `size-adjust`, `ascent-override` and `descent-override` on the fallback `@font-face` to match the webfont.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--font-sans-he` | `"Noto Sans Hebrew", Assistant, Heebo, Rubik, "Segoe UI", "Arial Hebrew", Arial, sans-serif` | Hebrew UI |
| `--font-sans-ar` | `"Noto Sans Arabic", "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif` | Arabic UI |
| `--leading-body-he` | `1.55` | Hebrew body |
| `--leading-body-ar` | `1.7` | Arabic body |
| `--leading-heading-rtl` | `1.3` | Hebrew and Arabic headings, KPI labels |
| `--track-*` under `:lang(ar)` | `0` | always |
| `--track-*` under `:lang(he)` | `0` (tracking only as deliberate emphasis) | default |
| Emphasis | `font-weight: 600; font-style: normal` | `em`, `i`, `cite` |

## Implementation sketch
```css
:root {
  --font-sans-he: "Noto Sans Hebrew", Assistant, Heebo, Rubik, "Segoe UI", "Arial Hebrew", Arial, sans-serif;
  --font-sans-ar: "Noto Sans Arabic", "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif;
}
/* on the element that declares the language only: :lang() alone matches every descendant
   and would override components' own line-heights */
:is(:root, [lang]):lang(he) {
  --font-sans: var(--font-sans-he);
  --track-display: 0;
  --track-meta: 0;
  line-height: 1.55;
}
:is(:root, [lang]):lang(ar) {
  --font-sans: var(--font-sans-ar);
  --track-display: 0;
  --track-body: 0;
  --track-meta: 0;
  line-height: 1.7;
}
:lang(ar) { letter-spacing: 0; } /* every element: never track Arabic */
:is(:lang(he), :lang(ar)) :is(h1, h2, h3) { line-height: 1.3; }
:is(:lang(he), :lang(ar)) :is(em, i, cite, dfn) {
  font-style: normal;
  font-weight: 600;
}
:is(:lang(he), :lang(ar)) { font-synthesis-style: none; }
:is(:lang(he), :lang(ar)) .eyebrow {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}
@font-face {
  font-family: "Noto Sans Hebrew";
  src: url("/fonts/noto-sans-hebrew.woff2") format("woff2");
  font-display: swap;
  unicode-range: U+0590-05FF, U+FB1D-FB4F;
}
```

## Checklist
- [ ] Hebrew and Arabic have explicit font stacks; no script falls back to an unplanned system font.
- [ ] Body line-height is at least 1.5 for Hebrew and 1.6 for Arabic; headings at least 1.25–1.3.
- [ ] `em`/`i` render upright and bold in Hebrew and Arabic; `font-synthesis-style: none` is set.
- [ ] Letter-spacing is 0 on Arabic everywhere and 0 on Hebrew unless used as deliberate emphasis.
- [ ] No component relies on uppercase for meaning.
- [ ] Tabular figures verified in the Hebrew font, or numbers set in a matched Latin font.
- [ ] Text with niqqud or harakat renders without clipping.

## Sources
- https://w3c.github.io/hlreq/
- https://www.w3.org/TR/alreq/
- https://www.w3.org/TR/css-text-3/#cursive-tracking
- https://www.w3.org/International/articles/article-text-size
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- https://fonts.google.com/noto/specimen/Noto+Sans+Hebrew
- https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic
- https://fonts.google.com/specimen/Rubik , https://fonts.google.com/specimen/Heebo , https://fonts.google.com/specimen/Assistant
- https://he.wikipedia.org/ , https://www.walla.co.il , https://www.kan.org.il , https://www.bbc.com/arabic , https://www.btl.gov.il , https://www.haaretz.co.il , https://www.leumi.co.il , https://www.ynet.co.il (headless-browser computed styles, November 2026)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/typography.md
