# Button hierarchy, sizing and loading state

> One primary button per view region, every other action steps down in emphasis, every target is at least 24×24 CSS px, and a busy button keeps its size, its focus and its label.

**Category:** Components and interaction · **Applies to:** toolbars, page headers, card actions, dialogs, forms, table row actions, icon buttons · **Priority:** must

## When to use / when not
- Use a `<button>` for an action on the current page: save, run, export, open a dialog, toggle a panel.
- Use a link (`<a href>`) when the action changes the URL or moves to another page. A "View report" control that navigates is a link styled as a button, never a `<button>` with an `onclick` redirect. Carbon and Atlassian both state this rule. Screen readers announce the two differently, and only links get open-in-new-tab and copy-URL.
- Use a menu button ("Actions ▾") when 4 or more actions act on the same object. Carbon recommends groups of 2–3 buttons and a menu beyond 3.
- Use an icon-only button only for universally recognised glyphs in dense chrome, such as close, more (⋯), refresh, copy, expand and settings. Anything domain-specific ("Recalculate DCF") gets a text label.

## Rules (do)
- **Hierarchy, 4 levels plus a modifier:**
  1. **Primary (filled, brand colour):** the single most likely next step. Allow **at most 1 per page or per independent region**: a dialog, a side panel or a card with its own task. Atlassian, Primer and Carbon all set this limit.
  2. **Secondary (outlined or tonal):** the default for most actions. Primer: "use the secondary variant for most buttons".
  3. **Tertiary or ghost (text only, visible on hover):** supplementary actions, Cancel in progressive flows, and row actions in tables.
  4. **Inline link button:** inside sentences only.
  - **Destructive is a modifier, not a level.** Use a filled danger button only as the confirm button of a destructive dialog. Elsewhere use a ghost or outline danger. Carbon allows danger as primary, tertiary or ghost, and never icon-only.
- **Order:** put the primary at the *end* of a button group in dialogs, wizards and toolbars (bottom-right in LTR). Primer flags a primary placed at the start of a ButtonGroup as an anti-pattern. Pair one primary with one secondary or ghost. Never put two filled buttons side by side.
- **Labels:** use verb + noun in sentence case, 1–4 words: "Export CSV", "Save assumptions". NN/g recommends 2–4 words and leading with a verb. Don't use "OK" in confirmations; name the action ("Delete scenario").
- **Sizes for dense dashboards:** use 3 heights, 28 / 32 / 40 px. Match the button height to adjacent inputs in the same row. Carbon pairs small buttons with 32px inputs and medium buttons with 40px inputs. Never mix button sizes inside one group.
- **Target size:** every target must be **≥24×24 CSS px** (WCAG 2.2 SC 2.5.8, AA), or have a 24px-diameter clear circle around it. Under `@media (pointer: coarse)`, raise targets to **≥44×44** (SC 2.5.5, AAA). Use `min-inline-size` and `min-block-size`, not fixed `width` and `height`, so content can grow the button but never shrink it. A 16px icon in a 28px button is fine. A 16px icon with 4px padding (24px total) is the absolute floor.
- **Icon-only buttons:** give them an accessible name (`aria-label` or visually hidden text) and a visible tooltip naming the action. Carbon makes the tooltip mandatory. Icons are 16px in buttons and sit 8px from the label.
- **Loading state** (see the timings in Tokens):
  - Show nothing for the first ~300 ms. Under 1 s, users stay in flow and need no feedback (NN/g response-time limits).
  - Then swap the leading icon, or add one, for a spinner and keep the label (Vercel: "Show a loading indicator & keep the original label"). Put the progressive wording ("Saving…") in the live region, not on the button.
  - **Lock the button's inline size** so the swap causes no layout shift.
  - Keep the button focusable: set `aria-disabled="true"`, not `disabled`. Primer: "don't remove them from the DOM or add `disabled` to avoid disrupting focus and keyboard navigation."
  - Guard the handler against re-entry to prevent double submits.
  - Announce the progress and the result through a polite live region that exists on page load (Primer: "The live region must be present on page load").
  - Past ~10 s, replace the spinner with determinate progress and a Cancel action.
- **Prefer "inactive" to `disabled`.** A greyed button with no explanation is a dead end. Keep it clickable and, on click, explain why it cannot run: Primer's "inactive" pattern, Atlassian's "avoid disabling buttons". If you must disable it, put the reason in visible text next to it, not in a tooltip on the disabled button. Disabled elements can't receive hover or focus on many devices.

## Anti-patterns (don't)
- Two or more filled primary buttons in one toolbar ("Save", "Publish", "Export" all blue). Nothing is primary any more.
- A primary in the page header *and* another primary in the content below it. Carbon lists this as an anti-pattern.
- Buttons that navigate, or links that run a mutation.
- Icon-only buttons with no name and no tooltip, or a tooltip that simply repeats a visible label.
- Removing the button and showing a spinner in its place. Focus is lost, the layout jumps, and keyboard users are dropped to `<body>`.
- Showing a spinner for 120 ms on every click. Flicker reads as instability.
- ALL-CAPS labels, centred labels in wide buttons, and labels that wrap onto 2 lines inside a toolbar.
- Tooltips on `disabled` buttons, which can't be reached by keyboard or touch.

## Good references
- [IBM Carbon — Button usage](https://carbondesignsystem.com/components/button/usage/) — explicit emphasis ladder (primary, secondary, tertiary, ghost, danger), recommended and banned combinations, "Each page should have only one primary button", "a tooltip is always required" on icon-only buttons, and "Do not use buttons as navigational elements".
- [Primer — Button guidelines](https://primer.style/product/components/button/guidelines) and [Button accessibility](https://primer.style/product/components/button/accessibility) — the "inactive" state as an alternative to disabled, a loading state that uses `aria-disabled` plus a polite live region, and a 24×24 floor with the honest note that their small variant can fall to ~21.5px wide.
- [Atlassian — Button usage](https://atlassian.design/components/button/usage) — one primary per area, buttons vs links, "avoid disabling buttons", and alignment rules (right-align in modals, left-align in full-page forms).
- [Linear](https://linear.app) (product) — a single high-emphasis "New issue" button. Every other chrome action is a ghost icon button with a tooltip that shows the shortcut.

## Bad references
- [Carbon's own anti-pattern list](https://carbondesignsystem.com/components/button/usage/) — "Two high-emphasis buttons in one group" and "Primary button in both the page header and the content section". These are the most common mistakes in SaaS admin screens.
- Generic admin templates (e.g. many Bootstrap dashboards) that colour every action button differently (blue Save, green Export, orange Share, red Delete). Colour then means nothing, and red reads as an error, not as "destructive". See `color-semantic-status.md`.
- [GitLab issue: accessible loading button](https://gitlab.com/gitlab-org/gitlab-ui/-/issues/1044) — documents how a natively `disabled` loading button leaves the focus order and gives screen reader users no change of state.

## Accessibility
- Every target is ≥24×24 CSS px (SC 2.5.8). Primary actions on touch are ≥44×44.
- The focus ring uses `:focus-visible` with an outline ≥2px, ≥3:1 against adjacent colours, and `outline-offset: 2px`. Never use `outline: none` without a replacement.
- Toggle buttons expose `aria-pressed`. Action buttons don't.
- Text on filled buttons must meet 4.5:1. The button boundary against the page must meet 3:1 (SC 1.4.11), or the label alone must make it identifiable.
- Busy buttons use `aria-disabled="true"` plus a polite live region. Don't rely on `aria-busy` alone: it can hide the button's children from screen readers.

## Motion / interaction (if relevant)
- Hover background change: 100–150 ms ease-out. Press: `scale: 0.98` or a darker background, 80 ms. Wrap both in `@media (prefers-reduced-motion: no-preference)` and `@media (hover: hover)`.
- Spinner rotation runs at ~0.8–1 s per turn. Under reduced motion, use a pulsing opacity or static "Saving…" text. See `motion-principles-and-tokens.md`.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--btn-h-sm` / `--btn-h-md` / `--btn-h-lg` | 28px / 32px / 40px | Dashboards default to md |
| `--btn-pad-inline` | 12px (sm 8px, lg 16px) | |
| `--btn-gap` | 8px | between icon and label, and between buttons |
| `--btn-radius` | 6px | match inputs |
| `--btn-font` | 14px / 500 (sm 13px) | sentence case |
| `--btn-icon` | 16px | 20px only in lg |
| `--target-min` | 24px; 44px when `pointer: coarse` | WCAG 2.5.8 / 2.5.5 |
| `--focus-ring` | 2px solid `--color-focus`, offset 2px | ≥3:1 |
| `--loading-delay` | 300ms | before the spinner shows |
| `--loading-long` | 10s | switch to progress + Cancel |
| Roles | `primary-bg`, `primary-fg`, `neutral-border`, `ghost-hover-bg`, `danger-bg`, `danger-fg` | colours are roles, not hues |

## Implementation sketch
```html
<div class="btn-group">
  <button type="button" class="btn btn--ghost">Cancel</button>
  <button type="submit" class="btn btn--primary" data-busy-label="Saving…">
    <span class="btn__icon" aria-hidden="true"></span><span class="btn__label">Save assumptions</span>
  </button>
</div>
<p role="status" class="visually-hidden" id="save-status"></p>

<button type="button" class="btn btn--ghost btn--icon" aria-label="Refresh data" interestfor="tip-refresh">
  <svg aria-hidden="true" width="16" height="16"><use href="#i-refresh"/></svg>
</button>
<div id="tip-refresh" popover="hint" role="tooltip">Refresh data <kbd>R</kbd></div>
```
```css
.btn {
  min-block-size: var(--btn-h-md, 32px);
  min-inline-size: 24px;
  padding-inline: 12px;
  display: inline-flex; align-items: center; gap: 8px;
  border-radius: 6px; font: 500 14px/1 var(--font-ui);
  border: 1px solid var(--neutral-border); background: var(--surface); color: var(--fg);
}
.btn--primary { background: var(--primary-bg); color: var(--primary-fg); border-color: transparent; }
.btn--ghost { background: transparent; border-color: transparent; }
.btn--icon { padding: 0; inline-size: var(--btn-h-md, 32px); justify-content: center; }
.btn:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
@media (pointer: coarse) { .btn { min-block-size: 44px; min-inline-size: 44px; } }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .btn { transition: background-color .12s ease-out; }
}
.btn[aria-disabled="true"] { cursor: progress; opacity: .8; }
.btn[aria-disabled="true"] .btn__icon { /* spinner glyph here; under reduced motion, no rotation */ }
```
```ts
async function runBusy(button: HTMLButtonElement, status: HTMLElement, task: () => Promise<void>): Promise<void> {
  if (button.getAttribute('aria-disabled') === 'true') return; // re-entry guard
  const width = button.getBoundingClientRect().width;
  const timer = window.setTimeout(() => {
    button.style.minInlineSize = `${width}px`; // no layout shift
    button.setAttribute('aria-disabled', 'true');
    status.textContent = button.dataset.busyLabel ?? 'Working…';
  }, 300);
  try { await task(); status.textContent = 'Saved'; }
  catch { status.textContent = 'Save failed'; }
  finally { window.clearTimeout(timer); button.removeAttribute('aria-disabled'); button.style.minInlineSize = ''; }
}
```

## Checklist
- [ ] There is at most one filled primary per page region, placed at the end of its group.
- [ ] Every button that navigates is an `<a>`, and every mutation is a `<button>`.
- [ ] All targets measure ≥24×24 CSS px, and ≥44×44 under `pointer: coarse`.
- [ ] Every icon-only button has an accessible name and a visible tooltip.
- [ ] The loading state appears after ~300 ms, keeps the width and focus, uses `aria-disabled` and blocks double submit.
- [ ] No unexplained `disabled` buttons. The reason is visible or given on click.
- [ ] The focus ring is visible, ≥3:1, and survives forced-colors mode.

## Sources
- https://carbondesignsystem.com/components/button/usage/
- https://atlassian.design/components/button/usage
- https://primer.style/product/components/button/guidelines
- https://primer.style/product/components/button/accessibility
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/ui-copy/
- https://gitlab.com/gitlab-org/gitlab-ui/-/issues/1044
- https://www.bekk.christmas/post/2023/24/accessible-loading-button (`aria-busy` "hides the busy element's children from screenreaders")
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html (44×44, AAA)
- https://vercel.com/design/guidelines (keep the label while loading; spinner show-delay ~150–300 ms and minimum visible ~300–500 ms; 24px hit targets, 44px on mobile)
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers
