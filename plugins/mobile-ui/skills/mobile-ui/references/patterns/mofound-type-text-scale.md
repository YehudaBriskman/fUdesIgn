# Typography, Dynamic Type and OS text scale

> Set body text at 16 px or more in `rem`, never below 11–13 px for anything, opt in to the OS text size where the browser supports it, and build every layout so 200% text still fits without clipping or horizontal scroll.

**Category:** Foundations · **Applies to:** body text, headings, list rows, buttons, bars, inputs, data values · **Priority:** must

## When to use / when not
- **Use** for every mobile screen. Large text is one of the most used accessibility settings on phones.
- **Use** the platform type ramps (iOS text styles, M3 type scale) as references for size steps, not as fonts you must load.
- **Not** a reason to use one huge size everywhere. Hierarchy still needs 4–6 steps.

## Rules (do)
- **Base size:** body 16 px (`1rem`), line height 1.4–1.5 (unitless). iOS Body is 17 pt at the default "Large" setting; M3 Body Large is 16 sp and Body Medium 14 sp.
- **Floors:** secondary text 13 px (iOS Footnote is 13 pt); 11–12 px only for caption metadata that is never the only source of information (iOS Caption 2 is 11 pt, the HIG's smallest).
- **Inputs at 16 px or more.** iOS Safari zooms the page when a focused input's font size is below 16 px. Fix it with the size, never with `maximum-scale=1`.
- **Units:** font sizes, line heights and text-coupled spacing in `rem`/`em`; never set a px font size on `html` or `:root`. Use `clamp(rem, rem + vw, rem)` for fluid headings, with max ≤ 2.5× min (modern-web-guidance `accessibility/respect-os-text-scale.md`).
- **Opt in to the OS setting:**
  - Chromium 146+ honours `<meta name="text-scale" content="scale">`: the root font size follows the Android or ChromeOS text size, so everything in `rem` scales.
  - Safari on iOS exposes Dynamic Type through the system font keywords (`font: -apple-system-body`, `-apple-system-headline`, …), which scale with the user's setting. Use them on the root text element when the app is mainly for iPhone, with a `rem` fallback first.
  - Elsewhere users rely on browser zoom and the browser's text-size setting; `rem` layouts follow both.
- **Range to design for:** iOS Dynamic Type runs from xSmall to xxxLarge, then five accessibility sizes up to AX5, where Body is 53 pt, about 3.1× the default. Android allows font scaling up to 200% since Android 14, with non-linear scaling so large text grows less than body text. Test at 200% at least.
- **Layouts that grow:** `min-block-size`, not `height`; wrapping, not `white-space: nowrap` on sentences; list rows that stack the trailing value under the label when text is large (a container query on the row, or an `em`-based media query).
- **Don't truncate essentials.** Truncate only secondary text, with the full text reachable (detail view, `title` is not enough on touch).
- **System font stack:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` gives SF Pro with optical sizes on Apple devices and Roboto on Android, with no download.
- **Numbers** in lists and stats use `font-variant-numeric: tabular-nums` (dashboard-ui `found-typography-for-data.md`).

## Anti-patterns (don't)
- Body text at 12–14 px "because the screen is small".
- `user-scalable=no` or `maximum-scale=1` to stop the input-zoom jump.
- Bars and buttons with fixed `height`, so 200% text overflows or clips.
- Text set in `vw` only (`font-size: 4vw`), which ignores user text size.
- Icon-only bottom bars because labels "don't fit" at large text. Let the bar grow, or switch to a stacked label.

## Good references
- [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography): the iOS text styles (Large Title 34, Title 1 28, Title 2 22, Title 3 20, Headline 17 semibold, Body 17, Callout 16, Subheadline 15, Footnote 13, Caption 1 12, Caption 2 11 pt) and the Dynamic Type size tables up to AX5.
- [Material 3: Type scale](https://m3.material.io/styles/typography/type-scale-tokens): Display, Headline, Title, Body and Label roles in sp, Body Large 16 sp.
- [modern-web-guidance: Respect operating system text scale](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/respect-os-text-scale.md): the `text-scale` meta tag, `rem` rules, 200% testing and support (Chrome and Edge 146).
- [WebKit: Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/): the `-apple-system-*` font keywords that follow the iOS text size.
- [Android Developers: Non-linear font scaling](https://developer.android.com/about/versions/14/features#non-linear-font-scaling): Android 14 scaling to 200%.

## Bad references
- Sites with `<meta name="viewport" content="…, maximum-scale=1">` to stop iOS zooming into 14 px inputs: it also blocks pinch zoom for people who need it (Safari has ignored it since iOS 10, but other browsers do not).
- Apps whose bottom tab labels clip at "Larger Text", a frequent finding in accessibility audits of hybrid apps.

## Accessibility
- WCAG 1.4.4 Resize Text: 200% without loss of content or function. WCAG 1.4.12 Text Spacing: line height 1.5, paragraph spacing 2×, letter spacing 0.12em and word spacing 0.16em must not break the layout.
- WCAG 1.4.10 Reflow: no horizontal scrolling at 320 CSS px.
- Contrast: 4.5:1 for body text, 3:1 for text at 24 px or 18.66 px bold and above (dashboard-ui `color-contrast-rules.md`).

## Motion / interaction (if relevant)
- When the OS text size changes while the app is open, re-layout without animation and keep the reading position anchored.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--type-large-title` | 700 2.125rem/1.2 | screen title at the top of a scroll view |
| `--type-title` | 600 1.375rem/1.27 | section titles |
| `--type-headline` | 600 1.0625rem/1.3 | row titles, emphasised labels |
| `--type-body` | 400 1rem/1.5 | body text |
| `--type-callout` | 400 0.9375rem/1.4 | secondary text in rows |
| `--type-caption` | 400 0.8125rem/1.35 | metadata, timestamps |
| `--type-input` | max(1rem, 16px) | inputs (prevents iOS focus zoom) |

## Implementation sketch
```css
body { font: var(--type-body); }
@supports (font: -apple-system-body) {
  /* iOS: follow Dynamic Type; rem sizes elsewhere scale from this root */
  html { font: -apple-system-body; }
  body { font: inherit; font-family: var(--font-sans); }
}
h1 { font: var(--type-large-title); font-size: clamp(1.75rem, 1.4rem + 2vw, 2.5rem); text-wrap: balance; }
.row { container: row / inline-size; }
.row-inner { display: flex; gap: var(--space-3); align-items: center; min-block-size: 44px; }
@container row (inline-size < 20em) {
  .row-inner { flex-direction: column; align-items: start; }
}
```
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="text-scale" content="scale">
```

## Checklist
- [ ] Body text is 16 px or more and set in `rem`; nothing essential is below 13 px.
- [ ] All inputs are 16 px or more; the viewport tag has no `maximum-scale` or `user-scalable=no`.
- [ ] At 200% text (browser setting or OS text size) nothing clips, overlaps or scrolls sideways.
- [ ] iOS: tested at an accessibility Dynamic Type size (AX3 or above) where the page opts in.
- [ ] Bottom bar labels and buttons grow instead of clipping.
- [ ] Headings use `clamp()` with a `rem` component, not `vw` alone.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/typography
- https://m3.material.io/styles/typography/type-scale-tokens
- https://webkit.org/blog/3709/using-the-system-font-in-web-content/
- https://developer.android.com/about/versions/14/features#non-linear-font-scaling
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/respect-os-text-scale.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/fluid-scaling.md
- https://developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json (HIG as JSON: the iOS Dynamic Type tables; Large (default) Body 17 pt, AX5 Body 53 pt / 62 pt leading)
