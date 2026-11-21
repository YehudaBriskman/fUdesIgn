# Viewport units and the on-screen keyboard

> Size app shells with `dvh`, sheets and heroes that must not jump with `svh`, never use plain `100vh` for a full-height layout on mobile, and plan for the on-screen keyboard, which by default covers content rather than resizing the layout.

**Category:** Foundations · **Applies to:** app shells, full-height screens, bottom sheets, chat composers, forms with sticky actions, splash and hero sections · **Priority:** must

## When to use / when not
- **Use** for any element sized to the viewport height on a phone.
- **Use** the keyboard rules for any screen with a text field near the bottom: chat, comments, search, checkout.
- **Not** for widths: `100vw` includes the scrollbar on desktop and causes horizontal scroll. Use `100%` or `100dvw` sparingly.

## Rules (do)
- **The three heights** (CSS Values 4, Baseline since 2022: Chrome 108, Firefox 101, Safari 15.4):
  - `svh` = small viewport, browser UI (URL bar, toolbars) fully shown. Never hidden under UI, but leaves a gap when the UI collapses.
  - `lvh` = large viewport, browser UI collapsed. Content at the bottom can be covered when the UI shows.
  - `dvh` = dynamic, tracks the current state. Accurate, but changes while scrolling, which can cause re-layout and jumps.
  - `vh` on mobile equals `lvh` in Safari and Chrome. That is why `100vh` layouts put the bottom bar under the toolbar.
- **Which to use:**
  - App shell that owns scrolling (header, scrolling main, bottom bar): `min-block-size: 100dvh`.
  - Bottom sheets, drawers, and heroes visible while the page scrolls: `100svh`, so they do not jump mid-gesture (modern-web-guidance `ui-components/navigation-drawer.md` uses `svh` for exactly this).
  - Full-screen media or splash: `100lvh` with the safe-area padding inside.
- **The keyboard does not shrink `dvh`.** By default (`interactive-widget=resizes-visual`, the default in iOS Safari and in Chrome 108+), the keyboard only shrinks the *visual* viewport; the layout viewport and the viewport units stay the same, and the browser scrolls the focused field into view.
- **Opt in to resizing where it helps:** `<meta name="viewport" content="…, interactive-widget=resizes-content">` makes the keyboard shrink the layout viewport (and `dvh`) so a bottom composer sits above it. It is supported in Chromium on Android and Firefox for Android; Safari ignores it. The third value, `overlays-content`, resizes nothing.
- **For Safari, use `visualViewport`:** listen to `visualViewport` `resize` and `scroll`, and set a custom property for the keyboard's height (`innerHeight − visualViewport.height − visualViewport.offsetTop`). Position the composer with it.
- **VirtualKeyboard API (Chromium only):** `navigator.virtualKeyboard.overlaysContent = true` plus `env(keyboard-inset-height)` gives exact control. Feature-detect it; never depend on it.
- **Fixed elements and the keyboard:** in iOS Safari a `position: fixed` bottom bar is pinned to the *layout* viewport and ends up behind the keyboard. Hide non-essential bottom bars while a text field has focus (`body:has(:is(input, textarea):focus)`), or move the composer with the `visualViewport` value.
- **Scroll the field into view with room:** `scroll-margin-block: 96px` on inputs so the label and the error message also show above the keyboard.
- **Do not use `height`** on text containers; use `min-block-size` so content can grow (modern-web-guidance `css/responsive-design.md`).

## Anti-patterns (don't)
- `height: 100vh` on the app shell: the bottom 50–100 px hides under the Safari toolbar, together with the tab bar.
- `100dvh` on a draggable sheet: it resizes as the URL bar collapses and the sheet jumps under the finger.
- A sticky "Send" bar that stays behind the iOS keyboard, so users type blind.
- Setting `window.scrollTo(0, 0)` on focus to "fix" the keyboard jump.
- JavaScript `window.innerHeight` measured once at load and written into `--vh`. It is wrong after the first rotation or URL bar change. Use the units.

## Good references
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units): what each unit measures and when to choose it, with diagrams.
- [MDN: meta name="viewport", interactive-widget](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport): `resizes-visual` (default), `resizes-content` and `overlays-content`.
- [Chrome for Developers: Prepare for Chrome's changes to the viewport resize behavior](https://developer.chrome.com/blog/viewport-resize-behavior): Chrome 108 aligned with Safari (keyboard resizes the visual viewport only) and added `interactive-widget`.
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport): the cross-browser way to measure the keyboard.
- [MDN: VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API): `overlaysContent` and `env(keyboard-inset-*)`, Chromium only.
- [modern-web-guidance: stack drill-down](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/stack-drill-down.md) uses `dvh` for a full-screen app stack; [navigation drawer](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navigation-drawer.md) uses `svh` for a swipeable panel.

## Bad references
- The long-lived "`--vh` hack" (`document.documentElement.style.setProperty('--vh', innerHeight * 0.01 + 'px')`) still copied into many codebases: replaced by `svh`/`dvh` and wrong after rotation.
- Chat widgets that put the input in a fixed footer without `visualViewport` handling: on iOS the field disappears behind the keyboard as soon as the user taps it.

## Accessibility
- WCAG 1.4.10 Reflow and 1.4.4 Resize Text: viewport-height layouts must not clip content at 200% text. Use `min-block-size`, not `block-size`, and let the page scroll.
- WCAG 2.4.11 Focus Not Obscured: a focused field must not be fully covered by a fixed bar or by the keyboard plus a fixed bar.
- Do not trap content in a `100dvh` container with `overflow: hidden`; screen-magnifier users need to scroll.

## Motion / interaction (if relevant)
- Do not animate layout as `dvh` changes. If a composer follows the keyboard, move it with `transform: translateY()` from the `visualViewport` value, without a transition (the keyboard has its own animation).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--vh-fill` | `100dvh` | app shell min height |
| `--vh-stable` | `100svh` | sheets, drawers, heroes |
| `--kb` | set from `visualViewport`, default `0px` | composer offset above the keyboard |
| input `scroll-margin-block` | 96px | keep label and error visible above the keyboard |
| `interactive-widget` | `resizes-content` (opt-in) | chat and composer screens on Android |

## Implementation sketch
```css
.app { display: grid; grid-template-rows: auto 1fr auto; min-block-size: 100dvh; }
.sheet { max-block-size: 100svh; }
:where(input, textarea, select) { scroll-margin-block: 96px; }
.composer { position: sticky; inset-block-end: 0; translate: 0 calc(-1 * var(--kb, 0px)); }
body:has(:is(input, textarea):focus) .bottom-bar { display: none; }
@supports not (height: 100dvh) { .app { min-block-size: 100vh; } }
```
```ts
// Keyboard height for browsers that only resize the visual viewport (iOS Safari).
type KeyboardHost = { virtualKeyboard?: { overlaysContent: boolean } }

export function trackKeyboard(root: HTMLElement = document.documentElement): () => void {
  const vv = window.visualViewport
  if (!vv) return () => {}
  const update = (): void => {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
    root.style.setProperty('--kb', `${Math.round(kb)}px`)
  }
  vv.addEventListener('resize', update)
  vv.addEventListener('scroll', update)
  update()
  return () => {
    vv.removeEventListener('resize', update)
    vv.removeEventListener('scroll', update)
  }
}

// Chromium only: let content flow under the keyboard and use env(keyboard-inset-height) instead.
export function preferKeyboardInsets(): boolean {
  const host = navigator as Navigator & KeyboardHost
  if (!host.virtualKeyboard) return false
  host.virtualKeyboard.overlaysContent = true
  return true
}
```

## Checklist
- [ ] No `100vh` heights on mobile layouts; shells use `dvh`, sheets and heroes `svh`.
- [ ] On a real iPhone and Android phone, the bottom bar is fully visible with the URL bar shown and collapsed.
- [ ] Focusing the lowest text field leaves its label, value and error visible above the keyboard.
- [ ] The chat or composer field stays above the keyboard in iOS Safari (via `visualViewport`) and Android Chrome.
- [ ] No fixed bottom bar hides behind the keyboard.
- [ ] Rotating the phone with the keyboard open leaves the layout usable.

## Sources
- https://web.dev/blog/viewport-units
- https://www.w3.org/TR/css-values-4/#viewport-relative-lengths
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- https://developer.chrome.com/blog/viewport-resize-behavior
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/responsive-design.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/css-layout.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navigation-drawer.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/stack-drill-down.md
- Note: MDN's compatibility table for `interactive-widget` did not load during research; the browser list here follows Chrome's announcement and is worth re-checking on MDN.
