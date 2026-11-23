# Native feel: Apple HIG and Material 3 conventions on the web

> Pick one coherent set of conventions per app (a neutral web style, or adapt per platform where it matters), follow the platform for behaviour users rely on (back, sheets, pickers, text scale, share), and never ship a costume of the other platform's chrome.

**Category:** Platform · **Applies to:** app shells, navigation, overlays, controls, typography, iconography, PWAs and hybrid apps · **Priority:** should

## When to use / when not
- **Use** when building an app-like web experience (PWA, hybrid shell, logged-in product) that users will compare with native apps.
- **Adapt behaviour, not branding.** Behaviour (back, dismissal, keyboard, share, date pickers) should match the OS; the visual brand can stay yours on both. Sheet dismissal and detents follow `mgesture-sheets-and-swipe-to-dismiss.md`; haptics are covered in `moinput-haptics-vibration.md`.
- **Not** pixel-copying iOS or Android widgets in a web page. Costume controls age badly (each OS redesign, such as iOS 26's Liquid Glass or M3 Expressive, makes them look wrong) and confuse users on the other platform.

## Rules (do)
- **Where the two agree, just follow both:**
| Topic | Apple HIG | Material 3 | Web rule |
|---|---|---|---|
| Touch target | 44×44 pt | 48×48 dp | 44 px on touch, 48 for Android-feel |
| Top-level nav | Tab bar, ≤ 5 | Navigation bar, 3–5 | Bottom bar, 3–5, icon + label |
| Secondary tasks | Sheet with detents | Bottom sheet | `<dialog>` bottom sheet |
| Text scaling | Dynamic Type | Font scale to 200% | `rem` + `text-scale` meta |
| Dark mode | System appearance | System theme | `prefers-color-scheme` |
- **Where they differ, choose per platform only if it is cheap and testable:**
| Topic | iOS | Android | Web default |
|---|---|---|---|
| Back | Top-left back button with previous title; edge swipe | System back (gesture or button), predictive back; top app bar up arrow | Browser history; in standalone iOS add a top-left back button |
| Primary action | Top-right text button ("Done", "Save") or bottom toolbar | FAB at bottom trailing | Sticky bottom button (reach) |
| Title | Large title collapsing to inline | Top app bar, left-aligned title | Left-aligned title, collapses on scroll |
| Alerts | Centred alert, buttons side by side, Cancel left/bold default right | Dialog, text buttons right-aligned, confirm rightmost | `<dialog>`, confirm last in DOM order |
| Switch/checkbox | Switch for settings | Switch or checkbox | Native `input` with `switch` where supported |
| Icons | SF Symbols (Apple-only licence) | Material Symbols (Apache-2.0) | Your own set or Material Symbols; never SF Symbols on the web |
| Fonts | SF Pro via `system-ui` | Roboto via `system-ui` | `system-ui` stack |
- **Detect for behaviour, not for looks:** use feature and media queries (`display-mode`, `pointer`, `hover`) rather than user-agent sniffing. If you must branch per OS (for example a share icon: iOS square-arrow vs Android three-dot share), use User-Agent Client Hints `platform` where available and default to a neutral icon.
- **Use the OS for OS things:** `navigator.share()` for sharing, native `<select>`, `type="date"`, the file picker with `accept` and `capture`, Web Push only after a user gesture, `<a href="tel:">` and `mailto:`.
- **Motion:** iOS motion is spring-like and gesture-continuous; M3 uses emphasized easing curves and (in M3 Expressive) spring tokens. On the web, use one house motion system (dashboard-ui `motion-reduced-motion.md` rules apply) and keep gestures 1:1.
- **Materials:** iOS 26's Liquid Glass and Android's tonal surfaces are OS chrome. Do not imitate translucent glass over scrolling content on the web unless contrast holds and `prefers-reduced-transparency` gets a solid fallback.
- **Respect system settings:** reduced motion, increased contrast, bold text (no web signal; use sufficient weight), reduced transparency, text size.

## Anti-patterns (don't)
- An iOS-style segmented control and tab bar shown to Android users, and Material ripples and FABs shown to iPhone users, in the same web app with no reason.
- Imitating iOS alerts with blurred backgrounds that fail contrast.
- Using SF Symbols or the San Francisco font files on a website (Apple's licence restricts them to Apple platforms' apps).
- Re-implementing native pickers, share sheets or keyboards in JavaScript.
- A "back" arrow that does something different from browser back.

## Good references
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/): foundations (layout, typography, accessibility) and components (tab bars, sheets, alerts).
- [Apple: Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass): the iOS 26 material, its layering rules and accessibility settings.
- [Material Design 3](https://m3.material.io/): components, layout and adaptive guidance; [Google Design: Expressive Material Design research](https://design.google/library/expressive-material-design-google-research).
- [Material Symbols](https://github.com/google/material-design-icons): Apache-2.0 icons usable on the web.
- [MDN: Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share): the OS share sheet from the web.
- [modern-web-guidance: Implement natural interactions](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/natural-interactions.md): press, focus and gesture feedback that feels native without imitating a platform.

## Bad references
- [NN/g: Cross-platform design consistency vs platform conventions](https://www.nngroup.com/articles/mobile-native-apps/): discusses users' expectations per platform; apps that mix conventions confuse both groups.
- Hybrid apps from the early Ionic/jQuery Mobile era that shipped iOS 6-style chrome to Android, a lasting example of how costumes date.

## Accessibility
- Native controls carry the OS's accessibility for free (VoiceOver, TalkBack, switch control); custom lookalikes must rebuild it.
- Alert button order differs per platform; screen readers follow DOM order, so keep the safe action reachable first and the destructive one clearly labelled.
- Never rely on a platform-specific gesture without a visible control (`monav-gestures-swipe-refresh-back.md`).

## Motion / interaction (if relevant)
- Use one motion vocabulary; gesture-driven transitions follow the finger and are interruptible; everything respects `prefers-reduced-motion`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--target-touch-ios` / `--target-touch-m3` | 44px / 48px | platform target sizes |
| `--mo-font-sans` | system-ui stack | SF on Apple, Roboto on Android |
| `--sheet-radius` | 28px | M3 sheet; close to iOS |
| alert buttons | stacked when labels are long; destructive labelled, never default | dialogs |
| icon set | own set or Material Symbols (Apache-2.0) | never SF Symbols |

## Implementation sketch
```ts
// Share with the OS sheet where available; fall back to copying the link.
export async function shareOrCopy(data: { title: string; url: string }, status: HTMLElement): Promise<void> {
  if (typeof navigator.share === 'function' && (navigator.canShare?.(data) ?? true)) {
    try {
      await navigator.share(data)
      return
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return // user closed the sheet
    }
  }
  await navigator.clipboard.writeText(data.url)
  status.textContent = 'Link copied'
}

// Behaviour hints from capabilities, never from the user-agent string.
export function shellHints(): { standalone: boolean; touch: boolean } {
  return {
    standalone: matchMedia('(display-mode: standalone)').matches,
    touch: matchMedia('(pointer: coarse)').matches,
  }
}
```
```css
@media (display-mode: standalone) and (pointer: coarse) {
  .top-bar .back { display: inline-grid; }
}
dialog.alert .actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--space-2); }
```

## Checklist
- [ ] The app follows one coherent set of conventions; per-platform differences are deliberate and listed.
- [ ] Back, share, pickers and text scaling use platform behaviour.
- [ ] No imitation of the other platform's chrome, and no SF Symbols or SF font files on the web.
- [ ] Platform branching uses feature or media queries, not user-agent sniffing.
- [ ] Glass or translucent effects keep contrast and have a solid reduced-transparency fallback.
- [ ] Custom controls that replace native ones have equal keyboard and screen-reader support.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/
- https://developer.apple.com/design/human-interface-guidelines/alerts
- https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- https://m3.material.io/
- https://m3.material.io/components/dialogs/guidelines
- https://design.google/library/expressive-material-design-google-research
- https://github.com/google/material-design-icons
- https://developer.apple.com/sf-symbols/
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- https://www.nngroup.com/articles/mobile-native-apps/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/natural-interactions.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/motion-reduced-motion.md
