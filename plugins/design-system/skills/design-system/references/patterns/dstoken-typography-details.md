# Typographic details that replace hacks

> Use the platform's typographic properties for trim, underline, superscript, small caps, quotes and truncation instead of padding hacks, fake glyphs and `text-transform`; never let a state change alter a text box's width.

**Category:** Tokens · **Applies to:** buttons, badges, headings, links, footnotes, acronyms, quoted text, file names and ids · **Priority:** should

## When to use / when not
- Use when polishing a built UI where text sits off-centre in buttons, links look cramped, footnote marks push lines apart, or long ids cut off their useful end.
- Don't use these as a substitute for the scale in `dstoken-typography-scale.md`. They tune details inside a scale that already exists.
- Don't apply any of it to Hebrew or Arabic body text without a visual check: no case, different descender positions, different quote conventions.

## Baseline status
Dates are from MDN's Baseline banners as read in November 2026. Support moves; re-check before relying on a row.

| Feature | Baseline | Note |
|---|---|---|
| `text-box-trim`, `text-box-edge`, `text-box` | 2026, Newly available (since August 2026) | Chrome and Edge 133, Safari 18.2, Firefox 154 (BCD); keep the `@supports` fallback for older installs |
| `text-underline-offset` | Widely available (since Nov 2020) | |
| `font-variant-position` | Widely available (Sept 2023) | |
| `font-variant-caps` | Widely available (Jan 2020) | |
| `quotes` | Widely available (2015) | |
| `hyphens` | Widely available (Sept 2023) | |
| `hyphenate-limit-chars` | Not Baseline (limited availability) | progressive enhancement only |
| unprefixed `line-clamp` | Not Baseline (limited availability) | `-webkit-line-clamp` is still supported |

## Rules (do)
1. **Trim the text box on controls.** `text-box: trim-both cap alphabetic` trims the line box to cap height at the top and the baseline at the bottom (`text-box-trim` takes `trim-start`, `trim-end`, `trim-both`, `none`; `text-box-edge` sets the metrics). Padding then measures from the glyphs, so icon-plus-label buttons, badges and headings centre optically. Wrap it in `@supports (text-box: trim-both cap alphabetic)` and keep ordinary padding otherwise. Apply to buttons, badges and headings only, never body paragraphs. Fonts differ in cap height, so check icon alignment per font.
2. **Offset underlines, don't remove them.** `text-underline-offset` takes `auto`, a length (MDN recommends `em`) or a percentage of 1em; `text-decoration-thickness` sets the stroke. Neither is part of the `text-decoration` shorthand, and both affect underlines only. House default: offset 0.1–0.25em and thickness 1px or `from-font`; tune per font. Keep underlines on links in running text (WCAG 1.4.1 needs a non-colour cue). Check Hebrew and Arabic visually, since the Latin offset may collide with letter shapes.
3. **Superscripts use the font's own glyphs.** `font-variant-position: super` (and `sub`) selects real superscript glyphs that share the em-box, so line height is not disturbed. If any glyph in the run lacks a true superscript, the browser synthesizes the whole run. Many UI fonts lack `sups`, so when you see the mismatch fall back to `vertical-align: super; font-size: .75em; line-height: 0`. `line-height: 0` is what stops lines being pushed apart. Not for Hebrew ordinals.
4. **Small caps for acronyms, not blocks.** `font-variant-caps: all-small-caps` turns uppercase runs (NASA, HTML) into small capitals; `small-caps` only affects lowercase. Without the font feature the browser synthesizes it. MDN warns that large blocks of all-small-caps can be hard to read for people with dyslexia, so use it for acronyms inside lowercase prose. Never fake it with `text-transform` plus a smaller size. No effect in Hebrew or Arabic.
5. **Curly quotes and apostrophes.** Quote with `<q>` and leave `quotes: auto`: the marks come from the `lang` of an ancestor (put `lang` on the ancestor, not on the `<q>`). Override with explicit pairs (`quotes: "“" "”" "‘" "’"`) only when the brand dictates; nesting uses successive pairs. Apostrophes are U+2019 (’), which no stylesheet can produce: it is a content and lint rule (`don't` becomes `don’t`). Hebrew geresh and gershayim: see `rtl-typography-hebrew-arabic.md` in the i18n-rtl plugin.
6. **Truncate the middle of file names and ids.** CSS has no native middle ellipsis. Keep the distinguishing end visible (extension, last id segment). Preferred recipe: two spans in a flex row, a head with `min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` and a tail with `flex: none`. Put the full string in `title` and in the accessible name, and make copy yield the full string. A JS measure is the fallback when the split point must be computed. Technique, not spec: no primary source was fetched for it.
7. **State changes must not change width.** Hover or selected states that switch to bold shift neighbours. Prefer not changing weight at all and use colour, an underline bar or a fill; see "Do not change weight" in `comp-tabs-segmented-pills.md` in dashboard-ui. If bold is mandatory, reserve the width with a real `aria-hidden` bold twin span (pseudo-element `attr()` copies can be read by screen readers and break with translated text) or a `min-inline-size`.

## Pointers (already covered, do not repeat)
- **Fluid type:** `dstoken-typography-scale.md` (rem term in `clamp`, WCAG 1.4.4; F94 lists viewport-unit-only sizing as a failure).
- **Hyphenation:** `hyphens: auto` needs a correct `lang` and a dictionary; `hyphenate-limit-chars` and the narrow-measure condition are in `i18n-text-expansion-and-layout.md`.
- **Line clamp:** `found-worst-case-data.md` in dashboard-ui.

## Anti-patterns (don't)
- `padding-top: 2px` nudges to centre text in buttons that break in the next font.
- `<sup>` with default styles in a paragraph: the line gets taller at every footnote.
- `text-transform: uppercase; font-size: .8em` as "small caps".
- Straight `"` and `'` in prose and in translation strings.
- Middle truncation with `direction: rtl` on the text node. It misorders neutral characters (slashes, dots, punctuation), which is worst in an RTL UI. See `rtl-bidi-isolation-mixed-text.md`.
- Removing link underlines in body text and relying on colour.

## Good references
- [MDN: text-box-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim) — values, edge metrics and Baseline status.
- [MDN: text-underline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset) — values and the `em` recommendation.
- [MDN: font-variant-position](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-position) — real vs synthesized superscripts.
- [MDN: font-variant-caps](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps) — `all-small-caps` and the dyslexia caution.
- [MDN: quotes](https://developer.mozilla.org/en-US/docs/Web/CSS/quotes) — `auto`, explicit pairs, nesting.

## Bad references
- Button CSS with hand-tuned `padding-top` per font: the fix breaks when the font changes, and `text-box-trim` removes the need.
- Footnote styles with `sup { font-size: 70%; position: relative; top: -.5em }` and no `line-height: 0`: every footnote opens a gap.

## Accessibility
- Underlines carry meaning for links in text; changing offset or thickness is fine, removing them is not (WCAG 1.4.1).
- Keep the truncated string's full value in the accessible name and in the clipboard; an ellipsis is visual only.
- Quotation marks from `<q>` are generated content that screen readers may or may not announce, so don't rely on them for meaning.
- Zoom to 200% and check that trimmed boxes still clip nothing (WCAG 1.4.4, 1.4.12).

## Motion / interaction (if relevant)
- Don't animate `text-box-trim` or underline offset on hover. Fade `text-decoration-color` instead.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--text-box-ui` | `trim-both cap alphabetic` | buttons, badges, headings (inside `@supports`) |
| `--underline-offset` | 0.1–0.25em (house default) | links in running text |
| `--underline-thickness` | 1px (house default) | links in running text |
| `--sup-fallback` | `super` · `.75em` · line-height 0 | footnote marks without `sups` |
| `--hyphen-limit` | `6 3 3` (house default) | `hyphenate-limit-chars` on narrow measures |

## Implementation sketch
```css
.btn, .badge, h1, h2, h3 { text-box: trim-both cap alphabetic; }
@supports not (text-box: trim-both cap alphabetic) {
  .btn, .badge { padding-block: calc(var(--space-2) + 1px); }
}

.prose a { text-decoration: underline; text-underline-offset: 0.15em; text-decoration-thickness: 1px; }

sup { font-variant-position: super; }
@supports not (font-variant-position: super) {
  sup { vertical-align: super; font-size: .75em; line-height: 0; }
}

abbr.acronym { font-variant-caps: all-small-caps; }

/* Middle truncation: <span class="mid"><span class="mid-head">long-report-name</span><span class="mid-tail">-final.pdf</span></span> */
.mid { display: flex; min-inline-size: 0; }
.mid-head { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mid-tail { flex: none; white-space: nowrap; }
```

## Checklist
- [ ] Button and badge text is centred by `text-box`, with an `@supports` fallback.
- [ ] Links in running text keep an underline with a tuned offset.
- [ ] Footnote marks do not change line spacing.
- [ ] Acronyms use `all-small-caps`; no `text-transform` fake.
- [ ] Prose has `lang` set, uses `<q>` or curly marks, and U+2019 apostrophes.
- [ ] Long ids and file names keep their tail and expose the full string.
- [ ] No hover or selected state changes a text box's width.
- [ ] Hebrew and Arabic strings were checked visually for each rule used.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-position
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps
- https://developer.mozilla.org/en-US/docs/Web/CSS/quotes
- https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens
- https://developer.mozilla.org/en-US/docs/Web/CSS/hyphenate-limit-chars
- https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- Repo: `dstoken-typography-scale.md`, `i18n-text-expansion-and-layout.md`, `found-worst-case-data.md`, `comp-tabs-segmented-pills.md`
