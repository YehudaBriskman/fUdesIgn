# RTL mirroring: what flips and what must not

> Mirror the layout, navigation and anything that shows linear progress or reading order; never mirror media playback controls, clocks and circular time, chart plot areas, logos, photos, phone numbers, URLs, code or the digits inside a number.

**Category:** Right-to-left layout and bidi · **Applies to:** page layout, navigation, steppers, progress, sliders, carousels, media players, charts, images, icons · **Priority:** must

## When to use / when not
- Use this as the decision list whenever a screen ships in Hebrew, Arabic, Persian or Urdu, and in review whenever someone says "just flip it".
- The default for layout is to mirror: an RTL screen is the mirror image of its LTR version (Material: "An RTL layout is the mirror image of an LTR layout"). The exceptions below are the whole skill.
- Icons have their own file (`rtl-icons-directional.md`); tables and charts have theirs (`rtl-tables-and-charts.md`).

## Rules (do)
- **Mirror (flips in RTL):**
  - Page structure: sidebar and primary nav move to the right; the main column reads right to left; the close button of a dialog moves to the top-left; breadcrumbs run right to left with `‹` separators.
  - Navigation with order: back points right, forward and "next page" point left (Apple HIG: "a back button must point to the right").
  - Linear progress and sequence: steppers, wizards, pagination, progress bars (0% on the right, filling leftward), sliders and rating controls, timelines that illustrate a sequence of events, carousels.
  - Ordered rows of images (chronological, ranked): reverse their positions, not the images (Apple HIG).
  - Text-representing icons and forward-motion icons (see `rtl-icons-directional.md`).
- **Do not mirror:**
  - **Media playback**: play, fast-forward, rewind, skip and the video scrubber. Material: "Media controls for playback are always LTR"; they show the direction of the tape, not of time. Wikimedia Codex likewise: don't mirror "the timeline within a video player".
  - **Circular time**: clocks, refresh and history icons, circular progress spinners with an arrowhead. Material: "Clocks still turn clockwise for RTL languages."
  - **Charts and graphs**: Material lists "Charts and graphs" among items not mirrored; Codex says not to mirror them "if mirroring could impact data interpretation". Keep the plot (time axis left to right); mirror only the surrounding text alignment. Details in `rtl-tables-and-charts.md`.
  - **Numbers**: the digits of a number, phone numbers, postcodes, card numbers, prices, version strings, IBANs. Apple: "the digits in a specific number … always appear in the same order." Codex: "Phone numbers should never be mirrored."
  - **LTR-intrinsic content**: URLs, email addresses, code, file paths, chemical formulas, maths. Display them in an LTR island (`dir="ltr"`) inside the RTL page.
  - **Brand and imagery**: logos (Apple: flipping one "can have legal repercussions"), photographs, illustrations, maps, product shots. If an illustration's composition implies reading direction, commission an RTL version instead of flipping.
  - **Physical objects and universal marks**: keyboards, headphones, cameras, checkmarks, right-handed tools (search magnifier, pen), slashes for "off" (Material: "Most RTL countries do not mirror slashes").
  - **Spatially absolute controls**: a "rotate right" or "align left" button means a real direction; it keeps pointing that way (Apple: "Preserve the direction of a control that refers to an actual direction").
- **Mirror the order of numerals that express progress**, never the numerals themselves: a 1–5 rating reads 1 on the right in RTL, but "15" stays "15" (Apple HIG).
- **Mixed content inside an LTR document** (an Arabic paragraph in an English editor) gets RTL tools locally: Material's example mirrors the list and indent buttons for the RTL paragraph only.

## Anti-patterns (don't)
- `body { transform: scaleX(-1) }` or `[dir=rtl] img { transform: scaleX(-1) }`: mirrors photos, logos and text-bearing images.
- A mirrored video player where "play" points left. Every major video player keeps playback LTR in RTL interfaces.
- A mirrored line chart where January is on the right, shown next to a table and tooltip that still read left to right. Mirror everything or nothing; the default is nothing.
- Phone numbers that render as `1234-567-050` because the string was left to the bidi algorithm inside Hebrew text (see `rtl-bidi-isolation-mixed-text.md`).
- A "Next" button with a right-pointing chevron in Hebrew. Users read it as "back".

## Good references
- [Material Design (v1), Bidirectionality](https://m1.material.io/usability/bidirectionality.html) — the most complete public do/don't list: what mirrors, the media-control exception, circular time, slashes and right-handed icons.
- [Apple HIG, Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left) — flip progress and ordered navigation, preserve real directions, never reverse digits, don't flip logos or photos.
- [Wikimedia Codex, Bidirectionality](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) — a short mirror/don't-mirror list built for a site with more than 300 languages, including phone numbers, URLs, currency symbols and video timelines.
- [Bituach Leumi (btl.gov.il)](https://www.btl.gov.il) — a Hebrew government site that mirrors the layout but renders its service numbers (`*6050`, `04-8812345`) inside `tel:` links with `dir="ltr"` and `unicode-bidi: isolate` (checked with a headless browser, November 2026).

## Bad references
- [androidx/media issue #227](https://github.com/androidx/media/issues/227) — Google's own `PlayerControlView` mirrored the next/previous and fast-forward/rewind icons in RTL; fixed in January 2023 by a commit titled "Fix order of playback controls in RTL layout". Proof that even platform media components get this wrong.
- Automated RTL flips through RTLCSS or a CSS-in-JS "rtl" plugin with no ignore list — the usual source of mirrored video scrubbers and mirrored chart axes in localised dashboards. [RTLCSS documents `/*rtl:ignore*/`](https://rtlcss.com/learn/usage-guide/control-directives/) for exactly these cases; a build without any ignore directives is a red flag.

## Accessibility
- Mirroring is visual. DOM order must already be the logical reading order; `dir="rtl"` then handles the visual order, and screen readers read the DOM. Don't reorder the DOM per direction.
- Arrow-key behaviour in composite widgets follows the visual direction: in an RTL tablist or slider, ArrowLeft moves to the *next* item or *increases* the value (WAI-ARIA APG keyboard guidance for sliders and tabs is direction-aware).
- A non-mirrored island (video player, code block) needs `dir="ltr"` on its container so that its own keyboard behaviour stays LTR.

## Motion / interaction (if relevant)
- Page transitions and carousels slide in from the inline-end edge for "forward" (from the left in RTL); motion-ui's `mtrans-spatial-origin-and-continuity.md` mirrors every spatial transition the same way.
- Swipe-to-go-back on mobile web starts at the right edge in RTL; don't fight the platform gesture.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--dir` | `1` / `-1` | sign for slide and swipe animations |
| `.flip-rtl` | `scale: -1 1` under `:dir(rtl)` | the only way an icon is mirrored (see `rtl-icons-directional.md`) |
| `.ltr-island` | `direction: ltr; unicode-bidi: isolate` (prefer `dir="ltr"` in markup) | media players, code, phone, URL, email |
| Progress fill origin | `inset-inline-start: 0` | linear progress, not media |
| Media scrubber | `direction: ltr` always | video and audio timelines |

## Implementation sketch
```html
<html lang="he" dir="rtl">
  <nav aria-label="פירורי לחם"><ol class="crumbs">…</ol></nav>
  <!-- mirrors: linear progress -->
  <progress value="40" max="100" class="progress">40%</progress>
  <!-- does not mirror: media is an LTR island -->
  <div class="player" dir="ltr" lang="he">
    <button aria-label="הפעלה">▶</button>
    <input type="range" aria-label="מיקום בסרטון" min="0" max="312" value="45">
  </div>
  <!-- does not mirror: phone number -->
  <p>מוקד: <a href="tel:+97231234567" dir="ltr">03-123-4567</a></p>
</html>
```
```css
.progress { inline-size: 100%; } /* the native element already fills from inline-start */
.player { direction: ltr; unicode-bidi: isolate; } /* belt and braces for a component reused without the dir attribute */
.player button { font-family: system-ui, sans-serif; }
img, video, .logo { scale: none; } /* nothing in the content flips */
```

## Checklist
- [ ] Layout, nav, steppers, pagination, sliders and linear progress mirror.
- [ ] Video and audio controls and scrubbers stay LTR.
- [ ] Clocks, refresh/history icons and spinners are unchanged.
- [ ] Chart plot areas are not mirrored (or are mirrored together with their tables and tooltips, by explicit decision).
- [ ] Logos, photos and illustrations are not flipped.
- [ ] Phone numbers, URLs, emails and code render in LTR islands.
- [ ] Arrow keys in sliders and tablists follow the visual direction in RTL.

## Sources
- https://m1.material.io/usability/bidirectionality.html
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://www.w3.org/International/questions/qa-html-dir
- https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- https://github.com/androidx/media/issues/227
- https://rtlcss.com/learn/usage-guide/control-directives/
- https://www.btl.gov.il (headless-browser inspection, November 2026)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/breadcrumbs.md
