# Theme consistency: one scheme per screen, one pipeline for every surface

> Every surface on a screen, including canvas charts, embeds and native controls, renders in the same active scheme from the same role tokens. The user chooses System, Light or Dark once, the choice persists, and the first paint is already correct.

**Category:** Color and visual style · **Applies to:** app shell, panels, charts (SVG and canvas), iframes and embeds, native form controls, scrollbars, theme toggles, server-rendered pages · **Priority:** must

## When to use / when not
- **Always.** This is the pipeline under `color-dark-mode.md` (how to tune a dark theme) and `color-system-architecture.md` (how tokens are layered). It answers "is the theme applied everywhere, the same way, every time?"
- **Legitimate fixed-scheme regions** are rare and must be self-contained: a code sample, a print preview, a brand-mandated video player, or an image editor's neutral canvas. Each sets its own `color-scheme`, its own background *and* its own text colour, and doesn't contain other app UI.
- **Not a reason to drop dark mode.** If you can't keep dark consistent, ship light only with `color-scheme: light` until you can, rather than a half-dark product.

## Rules (do)
**One scheme per screen**
- **No mixed-scheme screens.** If the OS or user says light, the shell, page canvas, panels, charts, tooltips, menus, dialogs and footers are all light. A "terminal-style" dark panel inside a light page is a second product, not an accent.
- **Like entities use like layouts and like tokens.** Two company pages with different chrome, navigation and verdict styles read as two apps. Migrate one layout onto the other's anatomy (see `found-visual-hierarchy.md`).
- **Elevation, not inversion, distinguishes regions.** A "hero" area gets `--surface-2`, not a dark slab on a light page. See `style-surfaces-and-layering.md`.

**One pipeline**
- **Tokens are the only colour source.** Components, charts and canvas code read role tokens (`--surface`, `--text`, `--chart-*`). Raw hex outside the token file is a bug.
- **Declare the scheme at the root, before CSS loads:** `<meta name="color-scheme" content="light dark">` in `<head>`. web.dev and MDN both say the meta tag lets the browser paint the page background in the right scheme before stylesheets arrive. Also set `:root { color-scheme: light dark }`. `color-scheme` changes the canvas background, form controls, scrollbars, spellcheck underlines and system colours.
- **Express pairs once with `light-dark()`** on role tokens, so a single `color-scheme` flip switches every role. A user override then only sets `color-scheme: light` or `dark` on `<html>`.
- **Canvas and WebGL charts follow the container**, not `matchMedia`. Resolve their colours from computed style and repaint on change (see `chart-canvas-accessibility.md`).
- **Embeds get the theme passed in.** Iframes don't inherit the parent's preference reliably. Send `?theme=dark` or `postMessage`, and set `color-scheme` on the `<iframe>` element to avoid a white backdrop.
- **Browser surfaces too:** `accent-color`, `caret-color`, `::selection`, `scrollbar-color` and the focus ring come from tokens in both schemes.

**The toggle**
- **Three states: System, Light, Dark**, default System. A binary light/dark switch loses "follow my OS" forever after one click. Put it in settings or the account menu, with an optional quick toggle in the header for products used in changing light (trading desks, ops rooms). See `color-dark-mode.md` on whether a persistent header toggle is needed at all.
- **Use a radio group** (`role="radiogroup"` or native radios), labelled "Theme", with visible text for each option. Icons alone (sun and moon) are ambiguous about "System".
- **Persist the explicit choice** in `localStorage` *and*, if the user is signed in, in their profile, so it follows them across devices. "System" is stored as "system", not as the scheme it resolved to.
- **No flash of the wrong theme.** A tiny blocking inline script in `<head>` reads the stored choice and sets `data-theme` and `color-scheme` on `<html>` before first paint. Josh Comeau measured the synchronous `localStorage` read at about 12µs, so the blocking cost is negligible. For SSR, the `Sec-CH-Prefers-Color-Scheme` client hint or a cookie lets the server render the right scheme.
- **Listen for OS changes while on System** (`matchMedia('(prefers-color-scheme: dark)')` `change` event) and apply them live, without reload.
- **Switch instantly.** Theme changes are a cut or a ≤ 150ms colour cross-fade. Never animate a full-screen brightness flip slowly, which is a vestibular and photosensitivity trigger. Under `prefers-reduced-motion: reduce`, cut.

**Verify**
- **Screenshot every primary view in both schemes**, at 2 widths, and look at them side by side. Mixed-scheme bugs are invisible in DOM probes and obvious in screenshots.
- **Grep for escape hatches:** hard-coded `#000`, `#fff`, `rgb(`, `bg-black`, `dark:` utilities used without a light pair, and `color-scheme: only`.

## Anti-patterns (don't)
- A forced-dark panel inside a light page, or a light footer under a dark app (half-light, half-dark).
- Charts that pick their palette from `matchMedia` while their panel uses a different scheme, so lines vanish into the background.
- A binary toggle that overwrites "System" with a fixed value and has no way back.
- Storing the *resolved* scheme ("dark") instead of the *choice* ("system").
- Applying the theme in a `useEffect` after hydration, which paints one frame of the wrong theme on every load.
- `color-scheme: only light` used to opt out of the browser's auto-dark while the product claims to support dark. Chrome's own guidance is to ship a curated dark theme instead.
- `filter: invert()` on one region to "make it dark".
- Toggle state shown only by an icon, or a toggle that renders the wrong state on first paint (Comeau: render it only after the mode is known).
- A loading skeleton in the light theme that then flips to a dark panel.

## Good references
- [web.dev: Improved dark mode default styling with color-scheme](https://web.dev/articles/color-scheme) — the meta tag beats the CSS property for first paint, and `color-scheme` sets canvas, `color` and system colours.
- [MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) — what the property affects, `only`, `light-dark()`, and putting the meta tag before any CSS.
- [Josh W. Comeau: The quest for the perfect dark mode](https://www.joshwcomeau.com/react/dark-mode/) — the flash explained, a blocking head script (stored choice, then OS preference, then default), CSS variables set before paint, and rendering the toggle only once the mode is known.
- [web.dev: prefers-color-scheme (Thomas Steiner)](https://web.dev/prefers-color-scheme) — the `<dark-mode-toggle>` element that follows the OS but allows an override, and the `Sec-CH-Prefers-Color-Scheme` hint for server-rendered pages.
- [MDN: MediaQueryList change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event) — live OS scheme changes, Baseline since 2020.
- [GitHub appearance settings](https://github.com/settings/appearance) (product, sign-in required) — "Sync with system" vs a single theme, with separate day and night theme picks.

## Bad references
- [Chrome: Auto Dark Theme](https://developer.chrome.com/blog/auto-dark-theme) — the browser's algorithmic darkening of light-only pages produces exactly the mixed, half-adjusted look this pattern forbids. Chrome itself recommends a curated dark theme, and the per-element `only light` opt-out leaves islands of light.
- [NN/g: Dark mode vs light mode](https://www.nngroup.com/articles/dark-mode/) — explains why forcing dark everywhere hurts acuity for most readers. Forced-dark "terminal" panels inside a light product hurt twice.
- A valuation app reviewed while writing this skill (2026-11, internal): a forced-dark company panel inside a light page canvas, with a light header and footer, and a second, older card layout for one sector. Two visual systems in one product, and its canvas chart labels were unreadable in light mode.

## Accessibility
- Respect `prefers-color-scheme` by default, and `prefers-contrast: more` and `forced-colors: active` on top of it. A user's explicit in-app choice wins over the OS.
- Re-check every role pair in both schemes: text 4.5:1, UI and chart marks 3:1 (WCAG 1.4.3 and 1.4.11).
- The toggle is a labelled radio group, operable by keyboard, with the current state announced.
- Don't flash: a full-page brightness flip during load is a jarring change, and repeated flips risk WCAG 2.3.1 territory on slow devices.
- The theme must not change on focus or hover (WCAG 3.2.1).

## Motion / interaction (if relevant)
- Theme change: instant, or a ≤ 150ms cross-fade of `background-color` and `color` only. View Transitions can cross-fade the whole page in one step (see `motion-view-transitions.md`), but keep it short and skip it under reduced motion.
- No per-component transitions on colour during the switch. They stagger and expose mixed-scheme frames.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `color-scheme` on `:root` | `light dark` (System); `light` or `dark` when overridden | single switch for all roles |
| `<meta name="color-scheme">` | `light dark` | first paint |
| Role tokens | `light-dark(<light>, <dark>)` | every surface, text, border and chart role |
| `data-theme` on `<html>` | `system` / `light` / `dark` | mirrors the stored choice |
| Storage key | `theme` = `system` / `light` / `dark` | `localStorage` + profile |
| Theme switch duration | 0ms, max 150ms | colour cross-fade |
| Head script budget | < 1KB inline, no imports | blocking pre-paint |
| Screenshot matrix | 2 schemes × 2 widths (390 and 1440) per primary view | review |

## Implementation sketch
```html
<head>
  <meta name="color-scheme" content="light dark">
  <script>
    // Blocking and tiny: apply the stored choice before first paint.
    (function () {
      var c = 'system'; try { c = localStorage.getItem('theme') || 'system'; } catch (e) {}
      var r = document.documentElement; r.dataset.theme = c;
      if (c !== 'system') r.style.colorScheme = c;
    })();
  </script>
  <link rel="stylesheet" href="/app.css">
</head>
```
```css
:root {
  color-scheme: light dark;
  --surface: light-dark(oklch(0.99 0.003 250), oklch(0.2 0.006 250));
  --text: light-dark(oklch(0.22 0.01 250), oklch(0.93 0.005 250));
  --chart-series-1: light-dark(oklch(0.5 0.13 250), oklch(0.75 0.11 250));
  accent-color: var(--accent);
}
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
body { background: var(--surface); color: var(--text); }
/* A legitimate fixed island sets scheme, background and text together. */
.code-sample { color-scheme: dark; background: var(--surface); color: var(--text); }
@media (prefers-reduced-motion: no-preference) {
  body { transition: background-color 120ms linear, color 120ms linear; }
}
```
```tsx
import { useEffect, useState } from 'react'
import { z } from 'zod'

const ThemeChoice = z.enum(['system', 'light', 'dark'])
type ThemeChoice = z.infer<typeof ThemeChoice>

function readChoice(): ThemeChoice {
  try { return ThemeChoice.catch('system').parse(localStorage.getItem('theme')) } catch { return 'system' }
}

function apply(choice: ThemeChoice): void {
  const root = document.documentElement
  root.dataset.theme = choice
  root.style.colorScheme = choice === 'system' ? '' : choice
}

export function ThemePicker({ onPersist }: { onPersist?: (c: ThemeChoice) => void }) {
  const [choice, setChoice] = useState<ThemeChoice | null>(null) // unknown until mounted: no wrong first state
  useEffect(() => setChoice(readChoice()), [])

  const select = (next: ThemeChoice) => {
    setChoice(next)
    apply(next)
    try { localStorage.setItem('theme', next) } catch { /* private mode: session only */ }
    onPersist?.(next) // e.g. save to the user's profile
  }

  if (choice === null) return null
  const options: ReadonlyArray<[ThemeChoice, string]> = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]
  return (
    <fieldset className="theme-picker">
      <legend>Theme</legend>
      {options.map(([value, label]) => (
        <label key={value}>
          <input type="radio" name="theme" value={value} checked={choice === value} onChange={() => select(value)} />
          {label}
        </label>
      ))}
    </fieldset>
  )
}
```

## Checklist
- [ ] Screenshots of every primary view in light and dark show no region in the other scheme.
- [ ] `<meta name="color-scheme">` is in `<head>` before CSS, and `:root` sets `color-scheme`.
- [ ] All colours come from role tokens. No raw hex, `bg-black` or `only light` outside the token file.
- [ ] Canvas charts and iframes follow the container's scheme and update on change without reload.
- [ ] The toggle offers System, Light and Dark as a labelled radio group, defaulting to System.
- [ ] The choice (not the resolved scheme) persists, and a head script applies it before first paint.
- [ ] While on System, OS scheme changes apply live.
- [ ] Theme switches are instant or ≤ 150ms, and cut under reduced motion.

## Sources
- https://web.dev/articles/color-scheme
- https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
- https://www.joshwcomeau.com/react/dark-mode/
- https://web.dev/prefers-color-scheme (search summary only)
- https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event (search summary only)
- https://developer.chrome.com/blog/auto-dark-theme (search summary only)
- https://www.nngroup.com/articles/dark-mode/
- https://github.com/settings/appearance (product, not fetched; requires sign-in)
- https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/customizing-your-github-profile/managing-your-theme-settings (fetch failed, 404)
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Internal dogfood review of a valuation app, 2026-11-21 (rubric G4, finding "two visual systems in one product")
- Repo: patterns/color-dark-mode.md, patterns/color-system-architecture.md, patterns/chart-canvas-accessibility.md
