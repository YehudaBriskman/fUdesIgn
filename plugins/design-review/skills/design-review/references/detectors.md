# Detectors and lint rules

Every rendered detector (`DR-*`, in `scripts/gate.mjs`) and static rule (`LU-*`, in `scripts/lint-ui.mjs`) has a stable ID. Cite the ID in findings, waivers and handover records. Pattern links point into the dashboard-ui plugin (`plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/`).

The gate runs each route in every theme × viewport. It passes only when every detector is at zero.

## Waivers

- **Rendered:** `data-design-review-ignore="DR-CONTRAST,DR-TARGET-SIZE"` on an element (or an ancestor) waives those detectors for it; an empty value or `all` waives all of them. Put the reason in a code comment next to it.
- **Detector off for a run:** `--skip DR-ID` or `--only DR-ID,…`. Record it in the handover's "Not checked".
- **Static:** a comment containing `design-review-ignore LU-ID` on the line or the line above.

## Rendered detectors

### DR-CONTRAST — text contrast below WCAG AA
- **Measures:** for every visible text node's parent element, the computed `color` (with cumulative opacity) composited over the effective background. The effective background is found by walking up the ancestors and compositing each `background-color` until an opaque one. A gradient contributes each colour stop, and the worst stop is used.
- **Threshold:** 4.5:1; 3:1 for large text (24px or more, or 18.66px or more at weight 700+). Disabled and `aria-disabled` controls are exempt (WCAG 1.4.3).
- **False positives:** text positioned over a sibling (not an ancestor) background, such as an absolutely placed label over an image or another card. Text inside gradients is judged on the worst stop even when it sits over a better one.
- **Not measured:** text over `url()` background images, SVG text, and text drawn in canvas (see DR-CANVAS-INK).
- **Fix:** adjust the text colour role for that surface, or put the text on the surface its role was designed for. Pattern: `color-contrast-rules.md`.

### DR-MIXED-THEME — light and dark surfaces on one page
- **Measures:** a grid of points (16 columns, a row every ~120px, up to 60 rows) over the whole page. At each point it takes the effective background of the top element and classes it dark (relative luminance under 0.12), light (over 0.45) or neither. Points inside `nav`, `aside`, `header`, `footer`, `dialog` and their ARIA roles are left out, so a dark sidebar on a light page is fine.
- **Threshold:** fails when the minority class covers 20% or more of the classified content points, or when the minority is the theme that was requested and covers 5% or more. The second case is a page that partly follows the OS theme while most of its content is forced the other way. A dark-only app with no light surface passes.
- **False positives:** a deliberate dark hero or code block taking more than a fifth of a light page; image-heavy pages where points land on images (those points are skipped, which can tilt the share).
- **Fix:** make every region read the same theme tokens (`color-scheme`, `data-theme` or the media query); never force one panel dark. Pattern: `color-dark-mode.md`.

### DR-OVERFLOW-X — horizontal page overflow
- **Measures:** `scrollWidth` against `clientWidth` of the scrolling element, at every viewport. Lists the outermost elements whose right edge passes the viewport and that are not inside their own horizontal scroller.
- **Threshold:** no more than 1px of overflow.
- **False positives:** an off-canvas drawer parked with `transform` instead of `visibility: hidden`. That still lets the page pan on touch, so fix it anyway.
- **Fix:** let rows wrap, give wide tables their own `overflow-x: auto` scroller, use `minmax(0, 1fr)` grid tracks. Pattern: `found-responsive-reflow.md`.

### DR-TEXT-OVERLAP — text or controls overlap
- **Measures:** the line boxes of every text node (via `Range.getClientRects`), clipped by overflow ancestors. Two text boxes on the same line that overlap by 1px or more collide; other pairs must overlap by 3px or more in both axes and by 30% of the smaller box. A pair counts only when, at the centre of the overlap, the top element is one of the two (nothing opaque covers them). It also checks interactive controls (buttons, links, tabs) whose boxes overlap by 4px or more without nesting. Text in fixed or sticky layers is compared only with text in the same layer, because overlays cover content by design.
- **Threshold:** zero collisions.
- **False positives:** intentional overprinting (a label set on a chart line), negative letter-spacing on display type.
- **Fix:** give the row room: `flex-wrap`, a `gap`, or an `overflow-x: auto` strip with a fade cue; shorten labels at narrow widths. Pattern: `found-responsive-reflow.md`.

### DR-TEXT-CLIPPED — text cut off by a hidden overflow
- **Measures:** text whose line box is cut by 2px or more by an ancestor (or itself) with `overflow: hidden` or `clip`, where that box neither scrolls nor shows an ellipsis or line clamp.
- **Threshold:** zero.
- **False positives:** marquee-style or reveal animations captured mid-way; icon fonts with oversized line boxes.
- **Fix:** let it scroll, wrap, or truncate with an ellipsis plus `title`. Pattern: `found-responsive-reflow.md`.

### DR-TARGET-SIZE — touch target too small
- **Measures:** the box of every link, button, input, select, textarea, summary, ARIA widget role and positive `tabindex` element that is visible.
- **Threshold:** 44×44 CSS px when the viewport is under 600px wide; 24×24 on desktop (WCAG 2.5.8). Inline links inside a run of sentence text are exempt.
- **False positives:** a small control with enough empty spacing around it to meet WCAG's spacing exception; the detector does not compute spacing.
- **Fix:** grow the hit area with padding, `min-block-size`/`min-inline-size`, or a `::before` overlay, keeping the visual size if needed. Pattern: `comp-button-hierarchy.md`.

### DR-FOCUS-VISIBLE — no visible focus indicator
- **Measures:** before any keyboard input, records the resting outline, box-shadow, border colours, background, colour and underline of every focusable element and its parent. Then presses Tab up to 40 times (`--max-tabs`) and compares each focused element (and its parent) with its resting state. A visible outline also counts.
- **Threshold:** every Tab stop changes something.
- **False positives:** an indicator drawn by a pseudo-element (`::after`) or a sibling; the detector does not read those.
- **Not measured:** whether the change is strong enough (3:1 against the surface, 2px).
- **Fix:** a `:focus-visible` outline of 2px with a 2px offset at 3:1 against the surface. Pattern: `comp-keyboard-shortcuts-focus.md`.

### DR-TRUNCATE-NO-TITLE — truncated text with no way to read it
- **Measures:** elements with `text-overflow: ellipsis` whose `scrollWidth` exceeds `clientWidth`, and `-webkit-line-clamp` elements whose `scrollHeight` exceeds `clientHeight`.
- **Threshold:** each one has a `title`, `aria-label` or `aria-describedby` on itself or within 3 ancestors.
- **False positives:** the full text shown elsewhere on screen (a detail pane). Waive it with a comment.
- **Fix:** add `title` or a tooltip wired with `aria-describedby`, or let it wrap. Pattern: `data-table-layout-and-typography.md`.

### DR-MEDIA-ALT — image or canvas without a text alternative
- **Measures:** visible `img`, `input[type=image]`, `role="img"` elements and canvases of 32px or more that are not `aria-hidden` or `role="presentation"`.
- **Threshold:** `img` has an `alt` attribute (empty is fine for decoration); `role="img"` has a name; a canvas has `aria-label`, `aria-labelledby`, `aria-describedby`, fallback content, or sits in a `figure` with a caption or name.
- **False positives:** a canvas described by an adjacent data table that is not linked. Link it with `aria-describedby`.
- **Fix:** a takeaway label on the chart plus a table view. Pattern: `chart-accessibility.md`.

### DR-TABULAR-NUMS — numbers in table cells without tabular figures
- **Measures:** text in `td`, `th` and grid cell roles that reads as a number (digits with grouping, sign, currency, %, k/M/B, pp, ×).
- **Threshold:** computed `font-variant-numeric` includes `tabular-nums`, or `font-feature-settings` includes `tnum`, or the font family is monospace.
- **False positives:** a font whose default figures are already tabular. Set the property anyway; it is free.
- **Fix:** `font-variant-numeric: tabular-nums` on the table, right-aligned numeric columns. Pattern: `data-table-layout-and-typography.md`.

### DR-REDUCED-MOTION — movement under `prefers-reduced-motion: reduce`
- **Measures:** loads each route once per viewport with reduced motion emulated. (a) Lists running Web Animations (CSS animations, transitions, WAAPI) of 50ms or more that animate transform, translate, scale, rotate, position, size, margin or background position. (b) Samples element positions three times 400ms apart and flags elements that moved more than 2px in both intervals (script-driven loops).
- **Threshold:** zero. Opacity and colour animations are allowed, as the pattern asks.
- **False positives:** a live feed that legitimately reflows every few hundred milliseconds; an essential progress animation. Waive with a reason.
- **Not measured:** animation drawn inside canvas or WebGL.
- **Fix:** put movement inside `@media (prefers-reduced-motion: no-preference)` and keep opacity or colour feedback for reduce. Pattern: `motion-reduced-motion.md`.

### DR-CANVAS-INK — canvas chart ink fades into its background
- **Measures:** screenshots each canvas of 80×40px or more, and builds a colour histogram (4 bits per channel). The background is the dominant colour (or the DOM background if no colour covers 30%). Ink is every colour that is not an area fill (over 2% of pixels) and not near the background (under 1.5:1).
- **Threshold:** (a) at least one significant ink colour reaches 3:1. (b) Across themes: when a canvas keeps the same background in light and dark (under 1.15:1 apart), the share of its ink at 3:1 or more must not drop by 15 points or more in one theme. A drop means the chart picks its palette from the OS theme while its container does not follow, which is how a price line ends up near-black on near-black.
- **False positives:** charts whose data changes between the two loads (live tickers); deliberately faint decorative canvases (waive them, or mark them `aria-hidden`).
- **Fix:** resolve chart colours from the container with `getComputedStyle`, not `matchMedia`, and redraw when the theme changes. Pattern: `chart-accessibility.md`.

## Static rules

| ID | Severity | Fires on | Rationale | Pattern |
|---|---|---|---|---|
| `LU-TRANSITION-ALL` | warn | `transition: all`, `transition-property: all`, Tailwind `transition-all` | Animates properties nobody chose, including layout; slow and janky | `motion-principles-and-tokens.md` |
| `LU-GLOBAL-MOTION-RESET` | error | a universal selector setting a near-zero animation or transition duration inside `prefers-reduced-motion: reduce` | Kills opacity and colour feedback too, and fires end events at once; movement should be opt-in | `motion-reduced-motion.md` |
| `LU-OUTLINE-NONE` | error | `outline: none` or `0` with no box-shadow, border or offset in the same rule and no matching `:focus-visible` rule; Tailwind `outline-none` with no focus-visible, ring or highlight class on the line | Keyboard users lose the focus indicator | `comp-keyboard-shortcuts-focus.md` |
| `LU-RAW-HEX` | warn | hex colours in CSS declarations (custom property definitions excepted), in component code and in style attributes; files named like tokens, theme, palette, colours or variables are exempt, and test files are skipped | Bypasses role tokens, so theming and dark mode break | `color-system-architecture.md` |
| `LU-DISABLED-BUSY` | error | JSX `disabled={…loading/pending/busy/submitting/saving…}`; HTML buttons that are `disabled` and `aria-busy` or carry a loading class | `disabled` drops focus and hides the button from assistive tech while it works; use `aria-disabled` and `aria-busy` | `comp-button-hierarchy.md` |
| `LU-SCALE-ZERO` | warn | keyframes whose `from` or `0%` uses `scale(0)`; `initial={{ scale: 0 }}` | Things should not appear from nowhere; start near 0.95 with opacity | `motion-micro-interactions.md` |
| `LU-BACKDROP-NO-FALLBACK` | warn | `backdrop-filter`, Tailwind `backdrop-blur` or `backdropFilter` in a file with no `prefers-reduced-transparency` | Glass needs an opaque fallback or text over busy content loses contrast | `style-glass-translucency.md` |
| `LU-ANY-TYPE` | error | `: any`, `<any>`, `as any`, `any[]`, `Array<any>`, `, any>` in TS/TSX | Switches off checking where data enters the UI; use `unknown` plus a schema | dashboard-ui `SKILL.md` (How to apply) |
| `LU-TOFIXED-MONEY` | error | `.toFixed(` on a line that mentions a currency symbol or a money word (price, amount, cost, revenue, balance, fee, money, cash, salary, payment, a currency code); test files skipped | Ignores locale, minor units, grouping and the true minus sign | `data-number-formatting.md` |
| `LU-DIV-ONCLICK` | error | `div`, `span`, `li`, `td`, `tr`, `img`, `section`, `article` or `p` with `onClick`/`onclick` and no `role` | Not reachable or announced; use a `button` | `comp-keyboard-shortcuts-focus.md` |

Static false positives to expect:
- `LU-TOFIXED-MONEY` on a money-adjacent line that formats a non-money number (a ratio next to a price). Waive with a reason, or move the formatting into a named helper.
- `LU-RAW-HEX` in canvas or chart code that must pass literal colours to a library. Resolve them from CSS custom properties at draw time instead; that is also the DR-CANVAS-INK fix.
- `LU-OUTLINE-NONE` on a container that receives focus only programmatically (a dialog panel). Waive with a reason.
- `LU-DIV-ONCLICK` where a parent wrapper delegates the click to a real button inside. Move the handler onto the button.

## Verification

`npm test` in the plugin folder runs the gate against `test/fixtures/bad.html` (every detector must fire) and `test/fixtures/good.html` (zero findings, in both themes at both widths), and the lint against `test/fixtures/lint/bad` (every rule must fire) and `test/fixtures/lint/good` (zero findings).
