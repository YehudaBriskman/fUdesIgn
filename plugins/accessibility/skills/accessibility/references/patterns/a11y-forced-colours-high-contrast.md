# Forced colours and high contrast

> In `forced-colors: active` (Windows contrast themes) the browser replaces author colours with the user's system palette and removes background images, box-shadows and gradients, so every boundary, state and focus ring must be drawn with real borders and outlines, icons must use `currentColor`, and `forced-color-adjust: none` is reserved for colour that is the content.

**Category:** Build · **Applies to:** buttons, inputs, toggles, tabs, selected rows, focus rings, icons, charts, custom checkboxes, badges · **Priority:** should

## When to use / when not
- **Use** for every component with a custom look. Native unstyled controls already adapt.
- **Also** honour `prefers-contrast: more` (macOS and iOS "Increase contrast") by switching to a higher-contrast token set; the design-system plugin generates one (`scripts/theme.mjs`, high-contrast output).
- **Not** a substitute for 1.4.3 / 1.4.11 contrast in normal mode (`a11y-colour-and-contrast.md`). WCAG has no forced-colours criterion; failures here surface as 1.4.11, 2.4.7 and 1.4.1 failures for people who rely on it.

## Rules (do)
- **Boundaries:** every control that has a visible edge in normal mode has a `border` (transparent is fine: it becomes visible in forced colours). Never rely on `background-color` or `box-shadow` alone to show where a button or input is.
- **Focus:** `outline`, not `box-shadow`. In forced colours set `outline-color: Highlight` (or leave it to the UA) so it is visible in every theme.
- **States:** selected, current, pressed and checked states change something forced colours keep: border width, outline, an icon, text decoration, or the system pair `Highlight` / `HighlightText`. A selected tab shown only by a tinted background disappears.
- **Disabled:** `GrayText`.
- **Icons:** inline SVG uses `fill="currentColor"` / `stroke="currentColor"` so it follows text colour; CSS background-image icons vanish or keep their own colours; use inline SVG or `mask-image` with `background-color: CanvasText` in forced colours.
- **System colour keywords** to use inside `@media (forced-colors: active)`: `Canvas`, `CanvasText`, `LinkText`, `VisitedText`, `ButtonFace`, `ButtonText`, `ButtonBorder`, `Field`, `FieldText`, `Highlight`, `HighlightText`, `SelectedItem`, `SelectedItemText`, `GrayText`, `AccentColor`, `AccentColorText`, `Mark`, `MarkText`.
- **`forced-color-adjust: none`** only where colour is the information (a colour swatch, a heatmap legend, a syntax highlighter the user chose) and then set both foreground and background yourself to a pair that passes contrast. Charts: keep series distinguishable by shape, dash and label (dashboard-ui `chart-accessibility.md`).
- **Test in a real contrast theme**, light and dark (Windows Settings › Accessibility › Contrast themes: "Night sky", "Desert"), or emulate with DevTools › Rendering › Emulate CSS media feature `forced-colors: active`.

## Anti-patterns (don't)
- Buttons drawn only with background colour and shadow: they become plain text in forced colours.
- Focus rings made with `box-shadow: 0 0 0 3px`.
- Custom checkboxes whose tick is a background-image.
- Selected rows or tabs shown only by background tint.
- `forced-color-adjust: none` on the whole app "to keep the brand".
- Hard-coded hex colours inside the forced-colours block (they get overridden or clash).

## Good references
- [MDN — forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) — what is overridden and which properties survive.
- [MDN — system colors](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color) — the keyword list and what each pairs with.
- [Microsoft Edge blog — Styling for Windows high contrast with forced colors](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/) — the standard, emulation and examples.
- [Adrian Roselli — WHCM and system colors](https://adrianroselli.com/2021/02/whcm-and-system-colors.html) — common breakages and fixes.
- [modern-web-guidance — Color, Forced Colors Mode](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/color.md#forced-colors-mode) — system colour fallbacks for tokens and when `forced-color-adjust: none` is justified.

## Bad references
- Toggle switches built from two `div`s with background colours only: in a contrast theme the track and thumb disappear and the state can't be read.
- Icon fonts and background-image icons in toolbars that render as empty squares or vanish.

## Accessibility
- People who use forced colours often also zoom and use a screen magnifier; combine this test with 200% zoom.

## Motion / interaction (if relevant)
- Hover states in forced colours change border or outline, not only background, because background changes may be flattened.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Focus in forced colours | `outline-color: Highlight` | Ring |
| Control edge | `border: 1px solid transparent` in normal mode | Becomes visible |
| Selected / pressed | `Highlight` outline or `SelectedItem` pair | State |
| Disabled | `GrayText` | State |
| Icons | `currentColor` | Follow text |

## Implementation sketch
```css
.btn { border: 1px solid transparent; background: var(--accent, #3b4bd8); color: var(--on-accent, #fff); }
.tab[aria-selected="true"] { background: var(--surface-2, #f3f4f6); box-shadow: inset 0 -2px 0 var(--accent, #3b4bd8); }
.icon { fill: currentColor; }

@media (forced-colors: active) {
  .btn { border-color: ButtonText; }
  .tab[aria-selected="true"] { border-block-end: 3px solid Highlight; }
  :focus-visible { outline-color: Highlight; }
  .swatch { forced-color-adjust: none; border: 1px solid CanvasText; }
}
@media (prefers-contrast: more) {
  :root { --border: var(--border-strong); }
}
```
```ts
export const isForcedColors = (): boolean => window.matchMedia('(forced-colors: active)').matches
```

## Checklist
- [ ] Every control is still visible as a control in a dark and a light contrast theme.
- [ ] Focus rings use `outline` and show in forced colours.
- [ ] Selected, current, pressed and checked states survive.
- [ ] Icons follow `currentColor`; no background-image icons carry meaning.
- [ ] `forced-color-adjust: none` appears only on colour-as-content, with an explicit passing pair.
- [ ] `prefers-contrast: more` raises border and text contrast.

## Sources
- https://www.w3.org/TR/css-color-adjust-1/#forced
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
- https://developer.mozilla.org/en-US/docs/Web/CSS/system-color
- https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/
- https://adrianroselli.com/2021/02/whcm-and-system-colors.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/color.md (Apache-2.0, linked, not copied)
