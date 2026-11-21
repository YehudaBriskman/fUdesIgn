# Dark mode and system colours on mobile

> Follow the OS appearance by default (`color-scheme: light dark` plus `prefers-color-scheme`), tune dark as its own theme, match the browser and status bar with `theme-color`, and use CSS system colours where native-looking controls matter.

**Category:** Foundations · **Applies to:** page theme, status bar and browser chrome, form controls, images, installed PWAs · **Priority:** must

## When to use / when not
- **Use** on every mobile app or site. A large share of phone users run dark mode, many on an automatic sunset schedule, so the theme can flip while the app is open.
- **Use** an in-app override (System / Light / Dark) only as a secondary setting; System is the default.
- **Not** an inversion filter. Dark is a separately tuned palette: dashboard-ui `color-dark-mode.md` has the full rules and contrast values; this file adds the mobile specifics.

## Rules (do)
- **Declare both schemes:** `<meta name="color-scheme" content="light dark">` (before CSS loads, so there is no white flash) and `color-scheme: light dark` on `:root`. Native controls, scrollbars and the default canvas then match the theme.
- **Roles, not raw colours:** use `assets/mobile.css` roles (`--canvas`, `--surface`, `--text`, `--accent`), which match dashboard-ui's values. Dark surfaces are dark grey (OKLCH L about 0.18–0.29), not pure black, except on deliberate OLED "true black" reading or media screens.
- **Elevation by lightness in dark:** sheets and menus are lighter than the canvas (iOS uses "elevated" background colours for sheets in dark mode; M3 uses tonal surface containers).
- **Browser chrome and status bar:** `<meta name="theme-color" content="…" media="(prefers-color-scheme: dark)">` and a light twin. Safari 15+ and Chrome on Android tint the toolbar or status bar from it. In an installed PWA the manifest `theme_color` and `background_color` set the splash and title bar; keep them in step with the light theme and override per scheme with the meta tag.
- **System colours** (CSS Color 4): `Canvas`, `CanvasText`, `LinkText`, `ButtonFace`, `ButtonText`, `Field`, `FieldText`, `Highlight`, `GrayText`, and `AccentColor`/`AccentColorText` (Safari 16.4+, Firefox 103+; check support before relying on them). Use them for focus rings and forced-colours mode, and for UI that should look native.
- **`accent-color`** tints native checkboxes, radios, range and progress in one line; pick a value with 3:1 against the surface in both themes.
- **Images:** provide dark variants with `<picture><source srcset="…" media="(prefers-color-scheme: dark)">`; give transparent PNG logos a dark-safe version; dim photos slightly (`filter: brightness(0.9)`) only if they glare.
- **Platform tints:** iOS system colours shift in dark mode (for example systemBlue is lighter in dark); Material dynamic colour derives a scheme from the wallpaper on Android 12+. A web app cannot read either palette, so it keeps its own brand accent and only tunes it per scheme.
- **Contrast:** re-check every role pair in dark: 4.5:1 for text, 3:1 for icons, borders and focus. Outdoor glare makes low-contrast greys worse on phones.

## Anti-patterns (don't)
- A white flash on load in dark mode because `color-scheme` is only set in a late stylesheet.
- A dark page with a white `theme-color`, giving a bright status bar stripe.
- `filter: invert(1)` on the whole page, which also inverts photos and brand colours.
- Pure `#000` behind pure `#fff` body text: halation and smearing on OLED while scrolling.
- An app-level toggle with no "System" choice, which ignores the user's schedule.

## Good references
- [Apple HIG: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode): base and elevated backgrounds, semantic colours, and testing with Increase Contrast.
- [Material 3: Color roles](https://m3.material.io/styles/color/roles): tonal surface containers instead of shadows in dark themes.
- [web.dev: prefers-color-scheme](https://web.dev/articles/prefers-color-scheme): meta `color-scheme`, image variants, and avoiding the flash.
- [MDN: system colors](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color): the keyword list and its forced-colours role.
- [modern-web-guidance: Dark mode](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/dark-mode.md) and [Browser UI theming](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/browser-ui-theming.md): `color-scheme`, `light-dark()` and `theme-color` per scheme.

## Bad references
- Sites that ship a dark theme but leave native `<select>` and date pickers light because `color-scheme` is missing; the picker pops up as a white sheet over a dark page.
- Apps whose splash screen (manifest `background_color`) is white while the app opens in dark, a bright flash every launch.

## Accessibility
- Honour `prefers-contrast: more` (stronger borders, no muted text) and `forced-colors: active` (system colours, visible focus with `Highlight`).
- Colour is never the only cue in either theme (WCAG 1.4.1).
- Saving the user's override must not stop the System choice from following later OS changes.

## Motion / interaction (if relevant)
- Theme changes are instant. Do not cross-fade the whole page; at most 150 ms on colour properties for an in-app toggle, and none under reduced motion.

## Tokens and values
| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | oklch(0.985 0.003 250) | oklch(0.18 0.006 250) | page background, `theme-color` source |
| `--surface` | oklch(1 0 0) | oklch(0.215 0.008 250) | bars, cards, sheets |
| `--surface-3` | oklch(0.93 0.006 250) | oklch(0.29 0.010 250) | menus, pressed rows |
| `--text` | oklch(0.22 0.02 250) | oklch(0.95 0.006 250) | body text |
| `--accent` | oklch(0.50 0.17 265) | oklch(0.72 0.13 265) | primary actions, `accent-color` |

## Implementation sketch
```css
:root { color-scheme: light dark; accent-color: var(--accent); }
body { background: var(--canvas); color: var(--text); }
.sheet { background: var(--surface); }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .sheet { background: var(--surface-2); } /* elevated is lighter */
}
@media (forced-colors: active) {
  .bottom-bar a[aria-current="page"] { outline: 2px solid Highlight; }
}
```
```html
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fbfbfd" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16181b" media="(prefers-color-scheme: dark)">
<picture>
  <source srcset="/img/logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="/img/logo.svg" alt="Acme" width="96" height="24">
</picture>
```

## Checklist
- [ ] `color-scheme` is declared in a meta tag and on `:root`; no white flash in dark mode.
- [ ] `theme-color` exists for both schemes, and the manifest colours match.
- [ ] Native controls (select, date, checkbox) match the theme.
- [ ] Every role pair passes 4.5:1 (text) and 3:1 (UI) in both themes.
- [ ] Logos and illustrations have dark-safe variants.
- [ ] Theme switching offers System, Light and Dark, defaulting to System.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/dark-mode
- https://m3.material.io/styles/color/roles
- https://web.dev/articles/prefers-color-scheme
- https://developer.mozilla.org/en-US/docs/Web/CSS/system-color
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color
- https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/dark-mode.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/browser-ui-theming.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/color-dark-mode.md
