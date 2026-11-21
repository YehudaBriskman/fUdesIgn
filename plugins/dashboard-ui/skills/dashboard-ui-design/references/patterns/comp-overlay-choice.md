# Choosing an overlay: dialog, popover, drawer, toast, tooltip

> Pick the least intrusive overlay that does the job. Block the page (modal `<dialog>`) only for a decision the user must make *now*. Everything else is a non-modal popover, drawer or inline message built on the platform's top layer.

**Category:** Components and interaction · **Applies to:** confirmations, settings, detail panels, menus, chart and metric explanations, row inspectors, status feedback · **Priority:** must

## When to use / when not
Decision table, first match wins:

| Situation | Overlay | Platform primitive |
|---|---|---|
| Irreversible or destructive action, or a required input before an action can proceed ("Delete scenario?", "Sign in to save") | **Modal dialog** | `<dialog>` + `showModal()` / `command="show-modal"` |
| Short focused task that would lose context as a page (rename, add a column, 3–6 field form) | **Modal dialog** (≤ ~6 fields). Bigger forms get their own page | `<dialog>` modal |
| Inspect or edit one record while the list stays visible and usable (row details, audit trail, filter panel) | **Non-modal side panel / drawer** | `<dialog popover="manual">` or a layout column; `<dialog>` modal only if it truly blocks |
| Mobile primary navigation | **Navigation drawer** (modal) | `<dialog>` + `showModal()`; optional scroll-snap swipe to close |
| A list of commands or choices anchored to a trigger | **Menu / listbox popover** | `<div popover>` + anchor positioning |
| Rich non-blocking content anchored to a control (date picker, column chooser, "how is this metric computed") | **Popover** with a close button | `popover="auto"` (light-dismiss) |
| A 1-line label for an icon or a term, on hover/focus | **Tooltip** | `popover="hint"` + `interestfor`, with a script fallback (see Platform support) |
| Explanation the user may want deliberately (an "i" next to a KPI) | **Toggletip** (opens on click or tap) | `popover` (auto) + `popovertarget` or `commandfor`/`command="toggle-popover"`; MDN's interest-invoker example pairs it with a separate `hint` tooltip |
| Background result of an action that's already visible elsewhere | **Toast**, sparingly, persistent by default | `popover="manual"` in one region. See `comp-notifications-alerts.md` |
| Error, warning or anything the user must act on | **Inline alert / banner**, never a toast | in-flow element |

NN/g's limits for modals: use them for critical warnings, missing critical info, complex but contained workflows, and time-saving questions. Never use them for nonessential content, in high-stakes flows like checkout, or when the user needs information the modal hides.

## Rules (do)
- **Modal dialogs**
  - Use the native `<dialog>` opened with `showModal()` or `<button command="show-modal" commandfor="id">`. The browser provides an inert background, focus containment, the top layer, `::backdrop`, Esc and back-gesture dismissal, and returns focus to the invoker.
  - Give it a name with `aria-labelledby` pointing at its `<h2>`.
  - Put `autofocus` on the first field, or on the *safe* action (Cancel or Keep) in a destructive confirmation.
  - Size: 400–560px wide for confirmations and small forms, ≤ 800px for complex ones, `max-block-size: min(85dvh, 720px)` with an internal scroll.
  - Footer: the primary goes last (right), with at most 1 primary + 1 secondary (see `comp-button-hierarchy.md`).
  - Choose `closedby` deliberately:
    - `any` (backdrop click + Esc) for low-stakes dialogs;
    - the default `closerequest` (Esc only);
    - `none` plus a `cancel` handler for dirty forms, with an explicit "Discard changes?" step.
  - Block scroll chaining with CSS only: `dialog:modal { overscroll-behavior: contain }` and `dialog::backdrop { overflow: hidden; overscroll-behavior: contain }`. Never lock scroll with `overflow: hidden` on `<body>`.
- **Popovers and menus**
  - Use the `popover` attribute, which gives the top layer and light-dismiss for free.
  - Use `auto` for menus and pickers (one open at a time, Esc or outside-click closes them). Use `manual` for toasts and persistent panels. Use `hint` for tooltips, so opening one doesn't close an open menu.
  - Anchor them to the trigger with CSS anchor positioning: `position-area: block-end span-inline-end; position-try-fallbacks: flip-block, flip-inline`.
  - Gate `inset: auto; margin: 0` inside `@supports (position-area: block-end)`. Otherwise unsupported browsers strand the popover at (0,0). Either keep the UA-centred default or load `@oddbird/css-anchor-positioning` conditionally.
- **Drawers / side panels**
  - Desktop width is 360–480px. They slide in from the inline-end edge for record details.
  - Non-modal panels must have a visible Close button and must not trap focus.
  - If the panel shows a record, put its id in the URL (`?inspect=txn_123`) so the view is shareable. The *open/closed* state of a pure modal does not go in the URL.
- **Tooltips**
  - Plain text, never task-critical (NN/g: "keep it brief"; NN/g sets no length, so cap it at ~80 characters as a house rule).
  - Show on hover *and* keyboard focus: the first tooltip in a group after a 200 ms hover delay (house value; Vercel gives no number), its neighbours instantly once one is open (Vercel: "Delay the first tooltip in a group; subsequent peers have no delay"), and immediately on focus. Hide 100 ms after leaving. Same values as `motion-micro-interactions.md`.
  - Must be hoverable, dismissible with Esc and persistent while hovered (WCAG 1.4.13).
  - In a horizontal toolbar, position them on the axis the toolbar doesn't stack along (`block-end`). Otherwise the hint covers the next button and swallows its click.
- **Nesting:** never put a modal on a modal. A popover inside a dialog is fine because it's in the top layer.
- **Platform support** (MDN browser-compat-data 8.1.10 and web-features 3.47, checked November 2026). Feature-detect each one and ship the fallback:

  | Feature | Status | Fallback |
  |---|---|---|
  | `<dialog>` + `showModal()` | Baseline widely available | none needed |
  | `popover` (`auto`, `manual`) | Baseline; core API widely available since October 2026 (Chrome 114, Firefox 125, Safari 17) | none needed |
  | `command` / `commandfor` | Baseline newly available since December 2025 (Chrome 135, Firefox 144, Safari 26.2) | a click handler that calls `showModal()` / `togglePopover()`, or `popovertarget` for popovers |
  | `closedby` | Not Baseline: Chrome/Edge 134, Firefox 141, Safari 27.3 | without it a modal behaves as `closerequest`. For `any`, close on a click whose target is the `<dialog>` itself (the backdrop). For `none`, cancel the `cancel` event |
  | `popover="hint"` | Not Baseline: Chrome/Edge 151, Firefox 153, Safari 27.3 | an unknown `popover` value falls back to `manual` (HTML spec), so the hint still shows but you must hide it yourself on `pointerleave`, `focusout` and Esc |
  | `interestfor` | Chromium only (Chrome/Edge 142), experimental | open on `pointerenter`/`focusin` after the delay, close on `pointerleave`/`focusout`/Esc |
  | Anchor positioning (`anchor-name`, `position-area`, `position-try-fallbacks`) | Baseline newly available since January 2026 (Chrome 125–129, Firefox 147, Safari 26); `position-anchor` only since September 2026 (Safari 27) | gate it in `@supports`; otherwise keep the UA-centred popover or load `@oddbird/css-anchor-positioning` |
  | `@starting-style`, `transition-behavior: allow-discrete` | Baseline newly available since August 2024; Firefox does not transition `display` ([bug 1882408](https://bugzil.la/1882408)), so exits snap there | the overlay appears without animation |
  | `overlay` in a transition list | Chromium only | ignored elsewhere; the exit animation may be cut short, which is harmless |

## Anti-patterns (don't)
- `<div class="modal">` with a hand-rolled focus trap, `role="dialog"`, `aria-modal` and `z-index: 9999`. The native element already provides these, and the manual versions drift.
- Opening a modal on page load ("What's new!") before the user has seen any value (NN/g).
- A modal that hides the data needed to make the decision it asks for (NN/g's upsell example). In dashboards this is the "Edit assumptions" modal that covers the chart it changes. Use a side panel instead.
- Multi-step wizards in a modal without a progress indicator.
- Critical or required information in a tooltip: password rules, units, the definition a number depends on. Hover isn't available on touch and tooltips vanish.
- Tooltips that repeat the visible label (NN/g's "Add new line" example).
- Toasts that carry errors or the only path to an action.
- `display: flex` set unconditionally on `dialog`, which forces closed dialogs visible. Scope it to `dialog[open]`.
- Locking background scroll with `body { overflow: hidden }`: the scrollbar disappears, the layout shifts and sticky headers break.

## Good references
- [NN/g — Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/) — the 4 legitimate modal uses and 3 forbidden ones, plus the Gmail compose window as a model non-modal side task.
- [NN/g — Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/) — no task-critical info, no redundant text, brief, show on keyboard focus as well as mouse hover, and use a click- or tap-opened popup tip on touch.
- Stripe Dashboard (product, requires a login) — payment details open as full routes or side panels with their own URLs. Destructive actions (refund, cancel subscription) get a focused modal that restates the amount.
- [Linear](https://linear.app) (product) — issue peek opens a non-modal side panel. The list stays keyboard-navigable and Esc closes the peek.

## Bad references
- [NN/g — Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/) — documents page-load newsletter modals and checkout-blocking login modals as trust-eroding.
- [NN/g — Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/) — Amtrak's password requirements hidden in a hover tooltip: the info is needed while typing and disappears. Sprint's "Add new line" button repeats its own label in a tooltip.
- [Scott O'Hara — A toast to a11y toasts](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html) — "popover alone isn't enough to make a toast component": it has no implicit role, isn't a live region, and is inert (unreachable by assistive tech) while a modal dialog is open.

## Accessibility
- Native modal: don't add `role="dialog"`, `aria-modal`, `inert` toggling or an Esc handler. Do provide a name and a visible close or cancel button.
- Read `dialog.returnValue` in `close` and reset it to `''`. Esc sets no value.
- Popovers closed from a button *inside* them lose focus. Return focus to the trigger yourself.
- Tooltips: plain hints become the trigger's description, or its name if it has none. Don't duplicate the name. Don't move focus into a hint on interest (WCAG 3.2.1).
- Toggletips get `aria-expanded` on the trigger, synced from the popover's `toggle` event (`toggle` doesn't bubble, so listen with capture).
- In a dialog with an Esc-using child (combobox, menu), the child must consume Esc first.

## Motion / interaction (if relevant)
- Animate entry and exit with `@starting-style` and `transition: opacity, translate, display, overlay`, plus `transition-behavior: allow-discrete` as a *separate* declaration.
- Durations use the token scale from `motion-principles-and-tokens.md` and `assets/tokens.css`:
  - dialog and drawer in: `--motion-dur-medium` (240 ms) with `--motion-ease-enter`; out: `--motion-dur-short` (150 ms) with `--motion-ease-exit`;
  - popover and menu: `--motion-dur-short` (150 ms) in, `--motion-dur-micro` (100 ms) out;
  - backdrop fade: 150 ms, at `rgb(0 0 0 / .4)` (light) or `/.6` (dark).
- Reduced motion: opacity only, `--motion-dur-micro` (100 ms) or less. Scope animations inside `@media (prefers-reduced-motion: no-preference)` as the sketch does; never use a global `0.01ms` reset.

## Tokens and values
| Token | Default |
|---|---|
| Dialog width sm / md / lg | 400 / 560 / 800px; `max-inline-size: calc(100vw - 32px)` |
| Dialog max height | `min(85dvh, 720px)`, body scrolls |
| Dialog padding / radius | 24px / 12px |
| Drawer width | 360–480px; full-width below 640px |
| Popover offset from anchor | 4–8px |
| Popover radius / shadow | 8px (`--radius-md`) / `--shadow-md`; dialog `--shadow-lg` |
| Tooltip max width / font | 280px / 12–13px; delay 200ms hover for the first in a group, 0ms for peers and on focus; hide after 100ms |
| Backdrop | `rgb(0 0 0 / .4)`; optional `backdrop-filter: blur(2px)` |
| Z-order | top layer. No z-index scale needed for overlays |

## Implementation sketch
```html
<button type="button" class="btn btn--ghost" command="show-modal" commandfor="del">Delete scenario</button>
<dialog id="del" aria-labelledby="del-title" closedby="closerequest">
  <h2 id="del-title">Delete "Base case 2026"?</h2>
  <p>This removes the scenario and its 14 saved assumptions. This can't be undone.</p>
  <form method="dialog" class="dialog-actions">
    <button value="" autofocus class="btn">Keep scenario</button>
    <button value="delete" class="btn btn--danger">Delete scenario</button>
  </form>
</dialog>

<button type="button" class="btn btn--icon" popovertarget="cols" aria-label="Choose columns">⋮</button>
<div id="cols" popover class="anchored">…column checkboxes…</div>
```
```css
dialog:modal { overscroll-behavior: contain; inline-size: min(560px, calc(100vw - 32px)); padding: 24px; border-radius: 12px; }
dialog::backdrop { overflow: hidden; overscroll-behavior: contain; background: rgb(0 0 0 / .4); }
@media (prefers-reduced-motion: no-preference) {
  [popover] {
    transition: opacity var(--motion-dur-short, 150ms) var(--motion-ease-enter, ease-out),
      translate var(--motion-dur-short, 150ms) var(--motion-ease-enter, ease-out),
      display var(--motion-dur-short, 150ms), overlay var(--motion-dur-short, 150ms);
    transition-behavior: allow-discrete;
  }
  dialog, dialog::backdrop {
    transition: opacity var(--motion-dur-medium, 240ms) var(--motion-ease-enter, ease-out),
      translate var(--motion-dur-medium, 240ms) var(--motion-ease-enter, ease-out),
      display var(--motion-dur-medium, 240ms), overlay var(--motion-dur-medium, 240ms);
    transition-behavior: allow-discrete;
  }
  dialog:not([open]), [popover]:not(:popover-open) { opacity: 0; translate: 0 4px; }
  @starting-style { dialog[open], [popover]:popover-open { opacity: 0; translate: 0 4px; } }
}
@supports (position-area: block-end) {
  .anchored { inset: auto; margin: 0; position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block, flip-inline; margin-block-start: 4px; }
}
```
```ts
const dlg = document.querySelector<HTMLDialogElement>('#del');
dlg?.addEventListener('close', () => {
  if (dlg.returnValue === 'delete') void deleteScenario();
  dlg.returnValue = ''; // Esc leaves no value; reset to avoid a stale one
});
declare function deleteScenario(): Promise<void>;
```
Feature-detect polyfills, and load them only when missing: `'commandForElement' in HTMLButtonElement.prototype` (invokers), `Object.hasOwn(HTMLElement.prototype, 'popover')`, `CSS.supports('anchor-name: --a')`, `'interestForElement' in HTMLButtonElement.prototype` and `'closedBy' in HTMLDialogElement.prototype`. See the Platform support table under Rules for each fallback.

## Checklist
- [ ] Each overlay matches the decision table. A modal is used only for blocking decisions or required input.
- [ ] Modals use native `<dialog>` + `showModal()`, have no manual focus trap or `aria-modal`, and are named via `aria-labelledby`.
- [ ] Destructive confirmations autofocus the safe action and name the action in the confirm button.
- [ ] Background scroll is contained by `overscroll-behavior`, not by `body { overflow: hidden }`.
- [ ] Anchored popovers fall back gracefully where anchor positioning or `position-area` is unsupported, and every non-Baseline feature in use (`closedby`, `popover="hint"`, `interestfor`) has a scripted fallback.
- [ ] Tooltips hold no task-critical content, open on focus as well as hover, and can be hovered and dismissed with Esc.
- [ ] No toast carries an error or the only route to an action.
- [ ] Animations use `allow-discrete` as a separate declaration and are disabled under reduced motion.

## Sources
- https://www.nngroup.com/articles/modal-nonmodal-dialog/
- https://www.nngroup.com/articles/tooltip-guidelines/
- https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html
- https://primer.style/accessibility/toasts/
- https://carbondesignsystem.com/components/notification/usage/
- https://vercel.com/design/guidelines (first tooltip in a group delayed, peers instant)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog (`closedby` values and defaults, Esc behaviour)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button (`command`/`commandfor` values, `interestfor`)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover (`auto` / `manual` / `hint` behaviour)
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style
- https://html.spec.whatwg.org/multipage/popover.html (an unknown `popover` value falls back to `manual`)
