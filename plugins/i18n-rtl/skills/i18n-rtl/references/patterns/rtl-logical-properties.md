# Logical properties: inline/block, start/end

> Write layout in flow-relative terms (`inline`/`block`, `start`/`end`) so one stylesheet serves LTR and RTL, and keep a physical property only where you have asked "should this flip in RTL?" and the answer is no.

**Category:** Right-to-left layout and bidi · **Applies to:** every stylesheet, component library and design token that names a side · **Priority:** must

## When to use / when not
- Use logical properties for anything that follows reading direction: padding and margin on the leading or trailing side, borders that mark the start of a row, text alignment, insets of drawers and toasts, corner radii on joined buttons, scroll padding.
- Use them even in a product that ships only in English. The modern-web-guidance CSS guide notes that external translation tools display translated text in context, so an LTR-only site still gets RTL readers ([css.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/css.md)).
- Keep physical properties where the geometry is about the screen, not the text: a media scrubber, a chart's plot area, a drop shadow that implies a light source, a map overlay, an image's focal point (`object-position`). See `rtl-mirroring-what-flips.md` for the full list.
- Don't convert blindly. The same guide warns against using logical properties "indiscriminately": the test is whether you would want the declaration to flip.

## Rules (do)
- **The mapping (horizontal writing modes):**

  | Physical | Logical | In `dir="rtl"` resolves to |
  |---|---|---|
  | `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` | right / left |
  | `padding-left` + `padding-right` | `padding-inline` | both sides |
  | `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` | unchanged |
  | `left` / `right` (positioned) | `inset-inline-start` / `inset-inline-end` | right / left |
  | `border-left` | `border-inline-start` | right border |
  | `border-top-left-radius` | `border-start-start-radius` | top-right corner |
  | `text-align: left` | `text-align: start` | right |
  | `float: left` / `clear: left` | `float: inline-start` / `clear: inline-start` | right |
  | `width` / `height` | `inline-size` / `block-size` | unchanged in horizontal modes |
  | `scroll-padding-left` | `scroll-padding-inline-start` | right |

- **Flexbox and grid are already logical.** `flex-direction: row`, `justify-content: flex-start`, `grid-column: 1` and `gap` all follow `direction`. Don't add `row-reverse` for RTL; that reverses it twice.
- **Shorthands:** `margin-inline: 0 var(--space-4)` is start then end. `inset-inline: 0 auto` pins to the start edge. Use `padding-block`/`padding-inline` pairs instead of four-value `padding` when the sides differ.
- **Tokens name roles, not sides.** `--cell-pad-inline` and `--cell-pad-block` (as in the dashboard-ui tokens) survive direction changes; `--pad-left` does not.
- **Things logical properties do not flip** (handle them explicitly with `:dir(rtl)`, see `rtl-css-tooling-dir-tailwind.md`):
  - `transform: translateX()`, `background-position`, `linear-gradient(to right …)`, `box-shadow` offsets, `clip-path: polygon()`, `object-position`, SVG coordinates and `cursor: e-resize`.
  - The modern-web-guidance tabs guide calls this out for scroll-fade masks: gradient directions and mask positions are physical, so they need a `:dir(rtl)` swap ([tabs.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/tabs.md)).
- **Lint for it.** Add a stylelint rule (for example `stylelint-use-logical` or `liberty/use-logical-spec`) or a grep in CI for `margin-left|padding-right|left:|right:|text-align: left`, with an allow-list comment for intentional physical cases.

## Anti-patterns (don't)
- A parallel `rtl.css` full of `[dir=rtl] .x { margin-left: 0; margin-right: 8px }` overrides. It doubles the surface, drifts out of date and is the main source of half-mirrored screens.
- Automated flipping (RTLCSS, `postcss-rtl`) applied to everything, including media players and charts. It flips what must not flip; if you use it, the `/*rtl:ignore*/` comments become a maintenance load.
- `text-align: right` for Hebrew. It looks right in RTL and breaks the moment the same component renders English.
- `flex-direction: row-reverse` under `[dir=rtl]`: the flex container already reversed.
- `left: 50%; transform: translateX(-50%)` centring. It works in both directions, but its siblings using `left: 16px` don't; prefer `inset-inline: 0; margin-inline: auto` or grid `place-items`.

## Good references
- [MDN: CSS logical properties and values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) — the full property map and the "flow-relative" model; every property listed is Baseline.
- [modern-web-guidance, css.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/css.md) — prefer logical properties, but ask "would I want this to flip in RTL?" before converting.
- [modern-web-guidance, breadcrumbs.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/breadcrumbs.md) — logical corner properties mirror a bevelled breadcrumb with no `:dir(rtl)` rule, while `polygon()` shapes need an explicit mirror.
- [RTL Styling 101 (Ahmad Shadeed)](https://rtlstyling.com/) — worked component examples of logical properties and the things that still need manual flips.
- [Firefox RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) — Mozilla's own rule set for its UI: logical properties first, `:dir()` for the rest.

## Bad references
- Bootstrap 4 and older (`ml-*`, `mr-*`, `float-left`) — physical utility names baked into thousands of templates; Bootstrap 5 renamed them `ms-*`/`me-*`/`float-start` precisely because RTL needed a separate build ([Bootstrap 5 RTL docs](https://getbootstrap.com/docs/5.3/getting-started/rtl/)).
- Any component library whose tokens are `paddingLeft`/`paddingRight` props (common in older React Native and design-tool exports): every RTL consumer has to patch the component.

## Accessibility
- Logical properties don't change DOM order, so reading order and focus order stay correct. Physical "visual reorder" hacks (`order`, `row-reverse`) risk WCAG 1.3.2 Meaningful Sequence and 2.4.3 Focus Order.
- Focus rings drawn with `outline` are direction-neutral; rings faked with `box-shadow: -2px 0 …` are not.

## Motion / interaction (if relevant)
- Slide-in drawers and toasts should enter from the inline-start or inline-end edge. Animate `translate` with a direction variable: `--dir: 1` in LTR, `-1` under `:dir(rtl)`, and `translate: calc(var(--dir) * 100%) 0`.
- Swipe gestures (dismiss, carousel next) follow the reading direction: "next" is a swipe toward inline-start (leftward in LTR, rightward in RTL).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--cell-pad-inline` | `var(--space-3)` (12px) | table cell inline padding, from dashboard-ui tokens |
| `--cell-pad-block` | `var(--space-2)` (8px) | table cell block padding |
| `--dir` | `1` (LTR), `-1` (RTL) | multiplier for `translate`, gradients and other physical values |
| `--edge-start` | `left` (LTR), `right` (RTL) | for physical-only APIs (`background-position`, gradient `to`) |

## Implementation sketch
```css
.card {
  padding-block: var(--space-4, 16px);
  padding-inline: var(--space-5, 24px);
  border-inline-start: 3px solid var(--accent, #3b5bdb);
  border-start-end-radius: var(--radius-lg, 12px);
  border-end-end-radius: var(--radius-lg, 12px);
  text-align: start;
}
.card__badge {
  position: absolute;
  inset-block-start: var(--space-2, 8px);
  inset-inline-end: var(--space-2, 8px);
}
:root { --dir: 1; --edge-start: left; }
:root:dir(rtl) { --dir: -1; --edge-start: right; }
.drawer[data-state="closed"] {
  translate: calc(var(--dir) * -100%) 0; /* off the inline-start edge in both directions */
}
.scroller {
  /* gradients are physical: build the direction from the variable */
  mask-image: linear-gradient(to var(--edge-start), transparent, #000 24px);
}
```
```ts
// A CI guard: flag physical side properties unless the line carries an allow comment.
const PHYSICAL = /\b(margin|padding|border)-(left|right)\b|(^|[\s;{])(left|right)\s*:|text-align:\s*(left|right)/;

export function findPhysicalSides(css: string): { line: number; text: string }[] {
  return css
    .split("\n")
    .map((text, i) => ({ line: i + 1, text }))
    .filter(({ text }) => PHYSICAL.test(text) && !text.includes("physical-ok"));
}
```

## Checklist
- [ ] No `margin/padding/border-left|right`, `left:`/`right:` or `text-align: left|right` without a `physical-ok` reason.
- [ ] No `row-reverse` or `order` used to fake RTL.
- [ ] Gradients, transforms, shadows, `background-position` and polygons that should mirror have a `:dir(rtl)` or `--dir` rule.
- [ ] Tokens are named by role (`-inline`, `-block`, `-start`, `-end`), not by side.
- [ ] Screenshot diff of the component in `dir="ltr"` and `dir="rtl"` shows a clean mirror (see `i18n-pseudo-localisation-and-rtl-testing.md`).

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/css.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/tabs.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/breadcrumbs.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md
- https://www.w3.org/International/questions/qa-html-dir
- https://rtlstyling.com/
- https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html
- https://getbootstrap.com/docs/5.3/getting-started/rtl/
