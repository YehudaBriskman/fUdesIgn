# Dark mode done right

> Dark mode is a separately tuned theme, not an inversion: dark grey (not black) base, elevation shown by lighter surfaces, desaturated lighter accents, and every role pair re-checked for contrast.

**Category:** Color and visual style · **Applies to:** whole app theme, charts, status colours, images/logos, embedded iframes · **Priority:** should (must if users work long sessions in dim rooms, e.g. trading or ops desks)

## When to use / when not
- Offer dark mode, and follow the OS by default with `color-scheme: light dark`. NN/g: "in users with normal vision, light mode leads to better performance most of the time", and "the smaller the font, the better it is for users to see the text in light mode". So **don't make dark the only or the forced default** for a data-dense product. In one study all 7 participants with cloudy ocular media (e.g. cataracts) read faster in dark mode, so offer it.
- A persistent in-UI toggle is optional. modern-web-guidance: "Most sites do not need a persistent toggle". Put it in settings.
- Use component-level `color-scheme` to keep a code block or a print preview in a fixed scheme (modern-web-guidance `component-specific-light-dark-theme.md`).

## Rules (do)
- **Declare it early:** `<meta name="color-scheme" content="light dark">` plus `:root { color-scheme: light dark; }` on the root, not on `body`, so scrollbars, form controls and the canvas match and the white flash on load is avoided.
- **Base is dark grey, not black.** Material 2 used `#121212`. Material 3 uses neutral tone 6 for surface. Pure black makes elevation steps invisible and causes halation around white text.
- **Elevation = lighter surface.** Material 3 dark surface containers by tone: lowest 4, low 10, container 12, high 17, highest 22, bright 24 (`material-color-utilities` color_spec_2021). Atlassian: in dark mode "the higher the elevation, the lighter the surface looks", still paired with shadows. Material 2 used white overlays (e.g. 2% for a card, 12% for a bottom app bar). Material 3 replaced the overlays with explicit tone-based tokens. Do the same: define tokens, don't stack translucent white.
- **Keep elevation steps visible: OKLCH ΔL ≈ 0.035–0.04 between adjacent surfaces** (1.07–1.14:1 in the default tokens) and add a 1 px border where they meet. Tone alone is too weak at that ratio.
- **Text is off-white with emphasis levels.** Material: high emphasis 87%, medium 60%, disabled 38% white. Avoid pure `#fff` body text on near-black because it "vibrates". Prefer solid tokens over alpha so contrast is predictable on every surface.
- **Desaturate and lighten accents.** Material: "More saturated colors tend to visually 'vibrate' against darker backgrounds" (dark-theme codelab). Material 2's baseline dark theme used the 200 tone of the primary, which it says meets 4.5:1 at all elevation surfaces. In OKLCH: raise L to 0.70–0.80 and lower C by about 20–30% (the default accent goes from 0.50 0.17 to 0.72 0.13).
- **Flip sequential chart scales.** Carbon: "In dark themes, the lightest color denotes the largest values." Carbon's diverging palettes "do not differentiate between light and dark themes". Keep each mark's contrast against its background constant across modes. Datawrapper's converter aims for "the color contrast of each element against the background is always the same".
- **Re-check contrast on every surface level**, not only the base. Atlassian: "Check the contrast ratio for UI on overlay surfaces in dark mode to ensure it meets accessibility requirements."
- **Use APCA as a sanity check for dark pairs.** WCAG 2's formula "overstates contrast for dark colors", so 4.5:1 near black "can be functionally unreadable" (APCA in a Nutshell). Aim for APCA Lc ≥ 75 for body text and ≥ 60 for secondary text. The default dark `--text-muted` is 7.6:1 but only Lc 55 on `--surface`. It needs about oklch(0.77 0.014 250) to reach Lc 60.
- **Shadows still exist but do less work.** Fluent's low-elevation ramp raises the first shadow layer from 14% in light to 28% in dark (the second stays 14%). Atlassian keeps shadow tokens paired with dark surfaces.
- **Images and logos:** provide dark variants with `<picture><source media="(prefers-color-scheme: dark)">`, or with `light-dark()` image values where supported (modern-web-guidance `dark-mode.md`; support status unverified). Never invert photos.
- **Iframes and embeds:** don't assume the embed follows your theme toggle. Send a `?theme=dark` parameter or use `postMessage` (modern-web-guidance notes Safari doesn't pass `color-scheme` into iframes; unverified).

## Anti-patterns (don't)
- `filter: invert(1) hue-rotate(180deg)` on the whole app. It inverts charts, brand colours, photos and status meaning.
- Pure `#000` background with saturated `#00ff00` / `#ff0000` status text.
- Reusing light-mode shadows (black at 10%) as the only elevation cue. They are invisible on dark grey.
- Reusing the light palette for charts: dark-blue series on a dark background falls below 3:1.
- Setting `color-scheme` on an element without its own background, which mixes text and background from different schemes (modern-web-guidance: MANDATORY don't).
- Using `inherit` for colour properties on an element that overrides `color-scheme`, or registering token properties as `<color>`. `light-dark()` resolves at computed-value time and the token stops switching.
- Reading `matchMedia('(prefers-color-scheme: dark)').matches` once and never listening for `change`.

## Good references
- [Material 3 surface tones (material-color-utilities)](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts) — exact tone ladder for dark surfaces (4/6/10/12/17/22/24), plus contrast-level curves that raise them for high contrast.
- [Material 2 dark theme codelab](https://codelabs.developers.google.com/codelabs/design-material-darktheme/index.html) — #121212 base, 87/60/38% text emphasis, white overlays of 2% (cards) to 12% (bottom app bar), lighter accents because saturated colours vibrate.
- [Atlassian – Elevation](https://atlassian.design/foundations/elevation) — sunken/default/raised/overlay with paired surface and shadow tokens. Dark relies on lighter surfaces plus shadows.
- [Linear redesign](https://linear.app/now/how-we-redesigned-the-linear-ui) — LCH-generated surfaces for elevation, with neutral text and icons made lighter in dark mode for contrast.
- [Datawrapper dark mode](https://www.datawrapper.de/blog/dark-mode-for-embedded-visualizations) — contrast-preserving automatic conversion of chart colours, gridlines and heatmaps, not an inversion.

## Bad references
- [NN/g – Dark mode vs light mode](https://www.nngroup.com/articles/dark-mode/) — documents why "dark by default" is a bad default: light mode won on acuity and proofreading, and the gap widens at small font sizes, which is exactly a dense dashboard.
- [Chameleon (arXiv 2512.00516)](https://arxiv.org/html/2512.00516v2) — describes the common failure where only the chart background is darkened and foreground colours are left unchanged, which produces poor contrast.
- Whole-page `invert()` dark-mode extensions or snippets — flip semantic colours (green→magenta) and photos.

## Accessibility
- Respect `prefers-color-scheme`, `prefers-contrast: more` (raise surface contrast and borders, as Material's contrast curves do) and `forced-colors: active`.
- Dark-mode text still needs 4.5:1 (WCAG 1.4.3). Also check APCA Lc, because WCAG 2 over-reports dark pairs.
- Focus rings must be re-tuned. A dark-blue light-mode ring disappears on a dark surface.

## Motion / interaction (if relevant)
- On theme switch, don't animate every colour. If you animate at all, use a View Transition cross-fade of ≤ 200 ms, and none under `prefers-reduced-motion`.
- Scrollbar colours via `scrollbar-color` + `light-dark()`. Don't transition `scrollbar-color` (WebKit flicker bug).

## Tokens and values
| Role | Dark value | Equivalent | Note |
|---|---|---|---|
| `--canvas` | oklch(0.18 0.006 250) #101214 | M3 tone ~6 | page |
| `--surface` (card) | oklch(0.215 0.008 250) #171a1d | M3 container-low ~10 | 1.07:1 vs canvas |
| `--surface-2` (raised/hover) | oklch(0.25 0.009 250) #1e2226 | M3 container ~12–17 | |
| `--surface-3` (popover/menu) | oklch(0.29 0.010 250) #282c30 | M3 highest ~22 | + overlay shadow |
| `--border` | oklch(0.35 0.012 250) #363b41 | | 1.55:1 vs surface, decorative |
| `--border-strong` | oklch(0.56 0.014 250) #6e757d | | 3.75:1 on surface, 3.02:1 on surface-3; inputs/axes |
| `--text` | oklch(0.95 0.006 250) #ebeff2 | ≈ 87% white | 15.1:1 on surface, 12.2:1 on surface-3 |
| `--text-muted` | oklch(0.74 0.014 250) #a4acb4 | ≈ 60% white | 7.6:1 on surface, 6.1:1 on surface-3 (APCA Lc 55) |
| `--accent` | oklch(0.72 0.13 265) #7ca2f6 | "200 tone" | 7.0:1 on surface |
| Shadow colour | `--shadow-color: oklch(0 0 0)`, same alphas as light | Fluent dark: 28% first layer | lighter surface + border carry elevation |
| Accent chroma | −20 to −30% vs light | | avoids vibration |

## Implementation sketch
```html
<meta name="color-scheme" content="light dark">
```
```css
:root {
  color-scheme: light dark;
  --canvas:    light-dark(oklch(0.985 0.003 250), oklch(0.18 0.006 250));
  --surface:   light-dark(oklch(1 0 0),          oklch(0.215 0.008 250));
  --surface-2: light-dark(oklch(0.97 0.004 250), oklch(0.25 0.009 250));
  --surface-3: light-dark(oklch(0.93 0.006 250), oklch(0.29 0.010 250));
  --text:      light-dark(oklch(0.22 0.02 250),  oklch(0.95 0.006 250));
  --shadow-color: light-dark(oklch(0.35 0.03 250), oklch(0 0 0)); /* alphas live in --shadow-* (tokens.css) */
  scrollbar-color: light-dark(#81878d, #6e757d) transparent;
}
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
body { background: var(--canvas); color: var(--text); }
.menu { background: var(--surface-3); border: 1px solid var(--border); box-shadow: var(--shadow-md); }
@media (prefers-contrast: more) {
  :root { --border: var(--border-strong); --text-muted: var(--text); }
}
/* Code blocks always dark: re-specify inherited colour tokens */
pre { color-scheme: dark; background: var(--surface); color: var(--text); }
```
```ts
const mq = window.matchMedia("(prefers-color-scheme: dark)");
function onSchemeChange(e: MediaQueryListEvent): void {
  document.documentElement.dataset.systemScheme = e.matches ? "dark" : "light";
}
mq.addEventListener("change", onSchemeChange);
```

## Checklist
- [ ] `color-scheme` meta + root property present, with no white flash on hard reload in dark OS.
- [ ] Base is dark grey (L ≈ 0.15–0.20), not `#000`.
- [ ] Higher elevation is lighter (ΔL ≥ 0.035 per level), and adjacent surfaces meet at a 1 px border.
- [ ] Accents and status colours have dedicated dark values (lighter, less chroma).
- [ ] Chart palettes have dark variants, and sequential scales flip direction.
- [ ] All text pairs ≥ 4.5:1 and APCA Lc ≥ 60/75 on every surface level, including popovers.
- [ ] Logos and illustrations have dark variants. Nothing is `invert()`ed.

## Sources
- https://www.nngroup.com/articles/dark-mode/
- https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts
- https://codelabs.developers.google.com/codelabs/design-material-darktheme/index.html
- https://m2.material.io/design/color/dark-theme
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://atlassian.design/foundations/elevation
- https://fluent2.microsoft.design/elevation
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://carbondesignsystem.com/data-visualization/color-palettes/
- https://www.datawrapper.de/blog/dark-mode-for-embedded-visualizations
- https://arxiv.org/html/2512.00516v2
- https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell
- modern-web-guidance: `guides/visual-design/dark-mode.md`, `guides/ui-atoms/component-specific-light-dark-theme.md`, `guides/ui-components/dark-mode-toggle.md`, `guides/visual-design/color.md`
