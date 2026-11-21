# Text resize, reflow at 320 px, text spacing and content on hover

> Layouts survive 200% text zoom (WCAG 1.4.4), reflow to a single column at 320 CSS px wide with no horizontal scrolling except for content that needs two dimensions (1.4.10), lose nothing when users raise line height to 1.5, paragraph spacing to 2em, letter spacing to 0.12em and word spacing to 0.16em (1.4.12), and tooltips or popovers on hover stay dismissible, hoverable and persistent (1.4.13).

**Category:** Build · **Applies to:** every layout, cards, buttons, badges, tabs, tables, navigation, tooltips, popovers, mobile web · **Priority:** must

## When to use / when not
- **Always.** 320 CSS px is what a 1280 px wide desktop window shows at 400% zoom, so reflow is a desktop low-vision requirement as much as a mobile one.
- **Grid and container-query reflow for dashboards** is owned by dashboard-ui `found-responsive-reflow.md`; OS text scale and Dynamic Type by mobile-ui `mofound-type-text-scale.md`; text expansion in translation by i18n-rtl `i18n-text-expansion-and-layout.md`. This file holds the criteria and the test values.
- **Exempt from reflow:** content that needs two-dimensional layout to be used: data tables, maps, diagrams, video, games, toolbars that must stay on one line. Even then, the page around them reflows and only the component scrolls.

## Rules (do)
- **Resize Text, 1.4.4 AA:** text scales to 200% (browser zoom or text-only zoom) without loss of content or function. Size type in `rem`/`em`; never set `html { font-size: 62.5% }` tricks that break user defaults, and never disable zoom (`user-scalable=no`, `maximum-scale=1`).
- **Reflow, 1.4.10 AA:** at 320 CSS px wide (or 256 CSS px tall for horizontal-scrolling text) content is readable and operable without scrolling in two directions.
  - Use fluid grids (`minmax(min(100%, 20rem), 1fr)`), `flex-wrap`, and container queries.
  - Long strings (URLs, IDs, emails) wrap: `overflow-wrap: anywhere`.
  - Wide tables scroll inside their own focusable, labelled region (`tabindex="0"`, `role="region"`, `aria-label`), not the page.
  - Sticky headers and footers shrink or unstick at small heights so they don't eat the viewport (also 2.4.11).
- **Text Spacing, 1.4.12 AA:** no loss of content or function when users override to line-height 1.5 × font size, spacing after paragraphs 2 × font size, letter-spacing 0.12 × and word-spacing 0.16 × font size.
  - Never set a fixed `height` on text containers (buttons, badges, tabs, cards); use `min-block-size` and padding.
  - Avoid `overflow: hidden` + `text-overflow: ellipsis` on text that is the only copy of a label; if truncating, the full text is available (title is not enough; use a tooltip reachable by keyboard or an expanded view).
  - Line-height unitless (`1.5`) so it scales with font size.
- **Content on Hover or Focus, 1.4.13 AA:** content that appears on hover or focus (tooltips, previews, sub-menus) is:
  - dismissible without moving pointer or focus (Esc), unless it obscures nothing;
  - hoverable: the pointer can move onto it without it vanishing;
  - persistent: it stays until hover/focus leaves, the user dismisses it, or it's no longer valid.
  Native `popover="hint"` and interest invokers help; a custom tooltip must implement all three.
- **Orientation and zoom on mobile:** keep `<meta name="viewport" content="width=device-width, initial-scale=1">`; never block pinch zoom. Where supported, the `text-scale` meta opt-in respects the OS text size (mobile-ui owns the details).

## Anti-patterns (don't)
- `height: 40px` buttons whose labels overflow when text spacing is raised.
- Fixed-width `960px` containers that force horizontal scrolling at 400% zoom.
- `white-space: nowrap` on navigation and running text.
- Data tables that make the whole page scroll sideways.
- Tooltips that close when the pointer moves towards them, or can't be closed with Esc.
- `maximum-scale=1` in the viewport meta.

## Good references
- [W3C — Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — the 320 px / 256 px rule, the 400% zoom equivalence and the two-dimensional exception.
- [W3C — Understanding 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) — the four override values and failure examples.
- [W3C — Understanding 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) — dismissible, hoverable, persistent.
- [Steve Faulkner — Text spacing bookmarklet](https://www.html5accessibility.com/tests/tsbookmarklet.html) — applies the 1.4.12 values to any page in one click.
- [modern-web-guidance — Typography](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/typography.md) and [Respect OS text scale](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/respect-os-text-scale.md) — relative units, no fixed heights on text boxes, the `text-scale` meta opt-in.

## Bad references
- Web apps that ship `user-scalable=no` to "feel native": low-vision users can't zoom at all.
- Admin templates with fixed-height cards that clip the last line once letter spacing is raised.

## Accessibility
- Test at 320 × 256 (responsive mode), at 400% zoom on a 1280 px window, at 200% text-only zoom (Firefox View › Zoom › Zoom Text Only), and with the text-spacing bookmarklet (`atest-manual-test-plan.md`).

## Motion / interaction (if relevant)
- Pointer-hover content appears after the delay its owning pattern sets (dashboard-ui: tooltips 200 ms in `comp-overlay-choice.md`, hover previews `--interest-delay` 500 ms in `comp-entity-links-and-hover-previews.md`). Keyboard focus opens it immediately: the hover delay only filters out accidental pointer passes (NN/g, Harley 2015), focus is deliberate, and the WAI-ARIA APG tooltip pattern shows the popup on focus with no delay. Leaving keeps a short close grace period (100 ms tooltips, 250 ms previews) so the pointer can reach the content. It stays while hovered; it doesn't animate away when the pointer crosses the gap.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Reflow width / height | 320 CSS px / 256 CSS px | 1.4.10 |
| Text zoom | 200% | 1.4.4 |
| Spacing overrides | line-height 1.5, paragraph 2em, letter 0.12em, word 0.16em | 1.4.12 |
| `.a11y-text-box` | `min-block-size`, `overflow-wrap: anywhere` | `assets/a11y.css` |

## Implementation sketch
The 1.4.12 overrides as a test stylesheet, and a layout that reflows.
```css
/* Inject in tests: nothing may clip, overlap or disappear */
.text-spacing-test * {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
.text-spacing-test p { margin-block-end: 2em !important; }

.cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); }
.badge, .btn { min-block-size: 1.5rem; block-size: auto; padding-block: 0.25em; }
.table-scroll { overflow-x: auto; max-inline-size: 100%; }
```
```ts
// Playwright-free check usable in any test runner: is there horizontal page scroll?
export function hasPageHorizontalScroll(doc: Document = document): boolean {
  return doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1
}
```

## Checklist
- [ ] At 320 CSS px, no page-level horizontal scroll; only 2-D components scroll in labelled regions.
- [ ] 200% text zoom loses nothing.
- [ ] The 1.4.12 overrides cause no clipping or overlap.
- [ ] No fixed heights on text containers; long strings wrap.
- [ ] Zoom is never disabled.
- [ ] Hover/focus content is dismissible with Esc, hoverable and persistent.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ (the tooltip appears on keyboard focus or hover; Esc dismisses; no focus delay specified)
- https://www.nngroup.com/articles/timing-exposing-content/ (Aurora Harley, 2015: 0.3–0.5 s hover pause against accidental activation; click or tap begins exposing within 0.1 s)
- https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- https://www.html5accessibility.com/tests/tsbookmarklet.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/typography.md (Apache-2.0, linked, not copied)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/respect-os-text-scale.md (Apache-2.0, linked, not copied)
