# Keyboard, focus order, focus visibility and focus not obscured

> Everything works with Tab, Shift+Tab, Enter, Space, arrows and Esc; focus moves in reading order, never gets trapped, is always visible as a 2 px ring at 3:1 or better, and is never hidden behind sticky headers, footers, cookie bars or chat launchers (WCAG 2.4.11).

**Category:** Build · **Applies to:** every interactive element, overlays, sticky chrome, SPA routes, removals, composite widgets · **Priority:** must

## When to use / when not
- **Always.** Keyboard access is the base that screen readers, switch access, voice control and many magnifier users depend on.
- **Shortcuts, roving focus inside composite widgets, overlays and route-change focus** are covered in depth by dashboard-ui `comp-keyboard-shortcuts-focus.md`; this file adds the cross-UI rules and 2.4.11, and doesn't repeat that file.
- **Native modal dialogs** need no hand-written focus trap: `showModal()` makes the rest of the page inert (dashboard-ui `comp-overlay-choice.md`).

## Rules (do)
- **Keyboard (2.1.1):** every action available by pointer is available by keyboard, with no timing requirement. Use native controls; custom controls follow their APG pattern (`aaria-first-rule-and-apg.md`).
- **No trap (2.1.2):** focus can always leave a component with standard keys. Embedded editors and iframes that capture Tab must document the escape key (for example Esc then Tab).
- **Character key shortcuts (2.1.4):** single-character shortcuts can be turned off, remapped, or work only while their component has focus.
- **Focus order (2.4.3):** DOM order = visual order. Never use positive `tabindex`. `tabindex="0"` only on custom interactive elements; `tabindex="-1"` for programmatic targets (headings after route change, error summaries).
- **On focus (3.2.1):** receiving focus never submits, navigates, opens a new window or moves focus elsewhere.
- **Focus visible (2.4.7) and contrast (1.4.11):** a `:focus-visible` `outline` of at least 2 px, offset 2 px, with 3:1 or more against the colours next to it. Use `outline`, not `box-shadow`, so it survives forced colours (`a11y-forced-colours-high-contrast.md`). A solid 2 px ring that encloses the control also meets the AAA 2.4.13 Focus Appearance.
- **Focus not obscured (2.4.11, AA):** when an element receives focus it is not *entirely* hidden by author-created content. In practice:
  - set `scroll-padding-block-start` / `-end` to the height of sticky headers, footers and bottom bars so the browser scrolls focused elements clear of them (`assets/a11y.css` exposes `--a11y-sticky-top` / `--a11y-sticky-bottom`);
  - non-modal banners (cookie consent, chat launchers, toasts) must not sit over focusable content, or must be dismissible without moving focus, or must move out of the way while focus is beneath;
  - aim for the AAA 2.4.12 (no part hidden) where sticky bars are short; it costs nothing more than correct scroll padding.
- **Overlays:** focus moves into an opened dialog or menu and returns to the trigger on close. Non-modal popovers don't trap focus.
- **Removals:** when the focused item is deleted, move focus to the next item, then the previous, then the container; never to `<body>`.
- **Disabled vs `aria-disabled`:** `disabled` removes focusability; use `aria-disabled="true"` (and block activation in code) when users need to discover a control and why it is unavailable.
- **Hidden means unfocusable:** off-screen drawers, collapsed sections and closed menus use `hidden`, `inert` or `display: none`, never just `opacity: 0` or `transform`.

## Anti-patterns (don't)
- `*:focus { outline: none }` in a reset with nothing to replace it.
- Focus rings drawn with `box-shadow` only (gone in Windows contrast themes).
- Sticky header 72 px tall and no scroll padding: Shift+Tab upwards hides every focused link under it.
- Cookie banner fixed to the bottom covering the footer links and the form's submit button.
- `tabindex="1"` on the search field to "make it first".
- Off-canvas menus moved off screen with `transform` but still in the tab order.
- `onFocus` handlers that open dropdowns or navigate.

## Good references
- [W3C — Understanding 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — sticky footers, cookie banners and the "entirely hidden" threshold, with the scroll-padding technique.
- [W3C — Technique C43: scroll-padding for un-obscuring content](https://www.w3.org/WAI/WCAG22/Techniques/css/C43) — the CSS technique behind the rule above.
- [GOV.UK Design System — focus states](https://design-system.service.gov.uk/get-started/focus-states/) — a high-contrast yellow + black focus style that works on every background.
- [modern-web-guidance — Accessibility §5](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#5-keyboard-and-focus-management) — tab order, `tabindex`, keyboard handlers, `:focus-visible`, outline over box-shadow.

## Bad references
- News and retail sites whose sticky header plus cookie bar take over 30% of a laptop viewport: keyboard focus disappears beneath them on every Shift+Tab (a direct 2.4.11 failure).
- CSS resets that ship `:focus { outline: 0 }` as a default.

## Accessibility
- Test with a keyboard only (`atest-manual-test-plan.md` step 2) at 100% and 200% zoom; sticky bars grow with zoom, so 2.4.11 failures often only show at 200%.

## Motion / interaction (if relevant)
- Scrolling focused elements into view is instant under `prefers-reduced-motion: reduce`. Focus rings appear without transition.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--a11y-focus-w` / `--a11y-focus-offset` | 2px / 2px | Ring |
| `--a11y-focus-color` | `var(--focus-ring)`; `Highlight` in forced colours | Ring colour, ≥ 3:1 |
| `--a11y-sticky-top` / `--a11y-sticky-bottom` | height of sticky chrome | `scroll-padding` for 2.4.11 |
| Positive `tabindex` | never | 2.4.3 |

## Implementation sketch
Keep scroll padding equal to the live height of sticky chrome, including when it grows with zoom or wraps.
```ts
export function trackStickyChrome(header: HTMLElement | null, footer: HTMLElement | null): () => void {
  const root = document.documentElement
  const update = (): void => {
    root.style.setProperty('--a11y-sticky-top', `${header?.offsetHeight ?? 0}px`)
    root.style.setProperty('--a11y-sticky-bottom', `${footer?.offsetHeight ?? 0}px`)
  }
  const ro = new ResizeObserver(update)
  if (header) ro.observe(header)
  if (footer) ro.observe(footer)
  update()
  return () => ro.disconnect()
}
```
```css
html {
  scroll-padding-block-start: calc(var(--a11y-sticky-top, 0px) + 8px);
  scroll-padding-block-end: calc(var(--a11y-sticky-bottom, 0px) + 8px);
}
:focus-visible { outline: 2px solid var(--focus-ring, Highlight); outline-offset: 2px; }
```

## Checklist
- [ ] Every action works from the keyboard; no traps.
- [ ] Tab order follows reading order; no positive `tabindex`.
- [ ] Focus ring is visible on every focusable element, ≥ 2 px and ≥ 3:1.
- [ ] No focused element is fully hidden by sticky or fixed content at 100% and 200% zoom.
- [ ] Single-key shortcuts can be turned off or remapped.
- [ ] Dialogs move focus in and back; deleted items hand focus on.
- [ ] Hidden content is not focusable.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- https://www.w3.org/WAI/WCAG22/Techniques/css/C43
- https://design-system.service.gov.uk/get-started/focus-states/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
