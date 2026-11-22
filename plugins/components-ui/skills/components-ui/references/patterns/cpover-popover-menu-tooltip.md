# Popovers, menus and tooltips

> Anything a pointer can reveal, a keyboard and a touch user must be able to reveal too. Use the `popover` attribute for light-dismiss surfaces, a real menu pattern for action lists, and tooltips only for naming a control: a tooltip never holds essential instructions or the only route to an action.

**Category:** Overlays · **Applies to:** dropdown menus, action menus, info popovers, tooltips, hover cards, date and colour pickers · **Priority:** must

## When to use / when not
- Popover: a non-modal surface anchored to a trigger. Menu: a list of actions. Tooltip: a short name or hint for a control.
- Not for blocking decisions (`cpover-dialog-focus-and-dismissal.md`) or ephemeral status (`cpover-toast-and-feedback.md`).
- Entity hover previews have their own rules: `comp-entity-links-and-hover-previews.md`.

## Rules (do)
**Popover (the platform way)**
- Use `popover` on the surface and `popovertarget` on a `<button>`. `popover="auto"` gives light dismiss and Escape, closes other auto popovers, and puts the surface in the top layer; `popover="manual"` for surfaces you close yourself.
- Anchor with CSS anchor positioning where supported (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`) so it flips at viewport edges; fall back to a primitive library elsewhere. Test clipping, scrolling parents and RTL.
- Opening does not move focus unless a descendant has `autofocus`, so move it yourself when the content is a menu or form. Escape and `hidePopover()` return focus to the trigger; light dismiss by click does not, which is correct.

**Menu**
- Use `role="menu"` only for application action menus. Navigation links and filters are not menus; use a list of links or a disclosure.
- Trigger is a button with `aria-haspopup="menu"`, `aria-expanded`. Enter, Space or ArrowDown opens and focuses the first item; ArrowUp may focus the last.
- Inside: Arrow keys move (Up and Down opening is optional in APG), Home and End jump, typing a letter jumps by label, Escape closes and returns focus, Tab closes. Items are `menuitem`, `menuitemcheckbox` or `menuitemradio` with `aria-checked`.
- Disabled items stay discoverable (`aria-disabled`) with the reason nearby.

**Tooltip**
- Show on hover and on keyboard focus; hide on Escape, blur, and mouse-out. The pointer must be able to move onto the tooltip without it vanishing (WCAG 1.4.13: dismissible, hoverable, persistent).
- `role="tooltip"` on the bubble, `aria-describedby` from the control (APG marks its tooltip pattern work in progress, so test with a screen reader). If the tooltip supplies the control's only name (an icon button), use `aria-label` for the name and keep the tooltip as a visual repeat.
- Text is short (one phrase). Anything longer, interactive or essential becomes visible text or a popover.
- Touch has no hover: critical information must not live only in a tooltip.

## Anti-patterns (don't)
- Hover-only menus, or destructive actions revealed only on row hover with no keyboard or touch route.
- `role="menu"` on a site navigation list.
- Tooltips containing links, buttons or required instructions.
- A popover clipped by `overflow: hidden` because it was not in the top layer.
- Hover delays that close the surface when the pointer crosses a 2 px gap.

## Good references
- [WAI-ARIA APG, Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — full keyboard contract.
- [WAI-ARIA APG, Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) — focus, Escape, `aria-describedby`.
- [MDN, Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) — attributes, light dismiss, events.
- [WCAG 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html).

## Bad references
- A table where "Delete" and "Edit" appear on `:hover` only — invisible to keyboard and touch.

## Accessibility
- Visible focus on the trigger and on the active menu item (`a11y-keyboard-focus-order.md`).
- Do not use `aria-haspopup="true"` loosely; match the popup role (`menu`, `listbox`, `dialog`).
- `aria-expanded` mirrors the real state; update it on light dismiss too (listen to `toggle`).

## Motion / interaction (if relevant)
- Menu and popover enter 150 ms, no stagger beyond 150 ms total; tooltips 100–150 ms, with a 300–500 ms open delay on hover only and no delay on focus (`mfound-choreography-and-stagger.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Menu item height | 32 px pointer / 44 px coarse | Target size |
| Tooltip open delay | 300–500 ms hover, 0 ms focus | Hover only |
| Pointer gap tolerance | ≥ 8 px safe corridor | Hoverable content |
| Popover max height | `min(24rem, 100dvh - 2rem)` | Scroll inside |

## Implementation sketch
```html
<button type="button" popovertarget="actions" aria-haspopup="menu" id="actions-btn">Actions</button>
<div id="actions" popover="auto" role="menu" aria-labelledby="actions-btn">
  <button role="menuitem" type="button">Rename</button>
  <button role="menuitem" type="button">Duplicate</button>
  <button role="menuitem" type="button">Archive</button>
</div>
```
```css
#actions-btn { anchor-name: --actions; }
#actions {
  position-anchor: --actions;
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-block, flip-inline;
  margin: 0.25rem 0;
  max-block-size: min(24rem, 100dvh - 2rem);
  overflow: auto;
}
```
```ts
const menu = document.querySelector<HTMLElement>('#actions')

menu?.addEventListener('keydown', (e) => {
  const items = [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')]
  const i = items.indexOf(document.activeElement as HTMLElement)
  const go = (n: number) => items[(n + items.length) % items.length]?.focus()
  if (e.key === 'ArrowDown') { e.preventDefault(); go(i + 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); go(i - 1) }
  else if (e.key === 'Home') { e.preventDefault(); go(0) }
  else if (e.key === 'End') { e.preventDefault(); go(items.length - 1) }
})

menu?.addEventListener('toggle', (e) => {
  const open = (e as ToggleEvent).newState === 'open'
  document.querySelector('#actions-btn')?.setAttribute('aria-expanded', String(open))
  if (open) menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
})
```

## Checklist
- [ ] Every revealed control is reachable by keyboard and touch; nothing essential is hover-only.
- [ ] Popovers use the `popover` attribute and the top layer; Escape closes and returns focus.
- [ ] `role="menu"` is used for action menus only, with arrows, Home, End, type-ahead and Escape.
- [ ] Tooltips show on focus, dismiss on Escape and are hoverable; they carry no essential content.
- [ ] Positioning flips at viewport edges and in RTL.
- [ ] `aria-expanded` follows the real open state.

## Sources
- https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
- https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- Source corpus: local `ui-behavior-component-intelligence` skill (popover, menu, tooltip contracts, restructured)
