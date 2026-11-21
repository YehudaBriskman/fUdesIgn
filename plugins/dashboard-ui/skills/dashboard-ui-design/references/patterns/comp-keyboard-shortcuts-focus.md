# Keyboard shortcuts and focus management

> Every action works from the keyboard with a visible focus ring. Composite widgets are one Tab stop with arrow keys inside. Shortcuts are discoverable (`?` sheet, tooltips, palette), never collide with browser or assistive-tech keys, and single-character shortcuts can be turned off.

**Category:** Components and interaction · **Applies to:** global shortcuts, list and table navigation (j/k), toolbars, menus, tabs, dialogs, route changes, dynamic content insertion and removal · **Priority:** must

## When to use / when not
- **Baseline (always):** Tab order follows visual order. Every interactive element is reachable and operable. Focus is always visible. Overlays manage focus (open → in, close → back to the trigger).
- **Modifier shortcuts** (⌘K, ⌘S, ⌘/, ⌘Enter): use them for frequent global actions. They're safe because they don't fire while typing.
- **Single-key and sequence shortcuts** (`j`/`k`, `e`, `g` then `d`, `/`, `?`): appropriate for expert, high-frequency tools (Linear, GitHub, Gmail, Grafana). They require an off switch or remapping (WCAG 2.1.4, Level A).
- **Don't add shortcuts** for rare actions; put those in the command palette. Shortcuts are an accelerator for the top ~20 actions, not a second UI.

## Rules (do)
- **Focus visibility.** Use `:focus-visible` with an outline ≥2px, ≥3:1 contrast against adjacent colours, and a 2px offset. Never `outline: none` without a replacement. Prefer `outline` over `box-shadow` so forced-colors mode keeps it.
- **Tab order.**
  - Use DOM order. Never use positive `tabindex`.
  - Don't put `tabindex="0"` on natively focusable or non-interactive elements.
  - Hidden content is unfocusable: use `hidden`, `inert`, or closed popovers and dialogs.
- **Composite widgets = one Tab stop.** Tabs, toolbars, menus, radio and segmented groups, listboxes, grids and the sidebar tree all use arrow keys inside. Use native `focusgroup` (`tablist`, `toolbar`, `menu`) where supported (Chrome/Edge 150+). Otherwise use a roving-`tabindex` fallback, loaded only when `'focusGroup' in HTMLElement.prototype` is false. Never run two roving systems at once.
- **Overlays.**
  - Native modal `<dialog>` contains focus and restores it automatically.
  - Popovers restore focus for the first `auto` popover in a stack. Nested menus restore it to their trigger explicitly.
  - Closing a popover from a button inside it loses focus, so send it back to the trigger.
- **Removals.** When the focused element is deleted (a row, chip or toast), move focus to the next sibling, then the previous one, then the container or heading. Never let it fall to `<body>`.
- **Route changes (SPA).** Focus the new page's H1 (`tabindex="-1"`) and update `document.title`. User testing found heading focus best, and resetting to the top "very overwhelming" (Gatsby study, 5 participants including NVDA, JAWS, magnifier, voice and switch users).
- **Global shortcut map** (a dashboard default to adapt):
  - `⌘K` / `Ctrl+K` opens the command palette.
  - `/` focuses search. `?` opens the shortcut sheet.
  - `g` then `h` / `p` / `s` goes to Home / Portfolio / Screener (sequences time out after 1 s).
  - `j` / `k` move to the next or previous row. `Enter` or `o` opens it. `x` selects it.
  - `f` adds a filter. `[` toggles the sidebar.
  - `Esc` closes the topmost overlay or clears the selection.
  - `t` then `←` / `→` shifts the time range. Grafana uses `t-` and `t+` for zoom.
- **Avoid reserved keys.**
  - Browser: ⌘L, ⌘T, ⌘W, ⌘R, ⌘F, ⌘P, ⌘D, ⌘[ and ⌘] (Back and Forward), ⌘1–9, Ctrl+Tab, F5, F6, F11, F12.
  - OS: ⌘Space, ⌘Tab, Alt+F4.
  - Screen readers: NVDA and JAWS use Insert/CapsLock combos and, in browse mode, single letters (h, k, b, t, f, l…). VoiceOver uses Ctrl+Option.
  - Single-letter app shortcuts only work when the screen reader is in focus/application mode. Never rely on them as the only path.
- **Guard character shortcuts.**
  - Ignore character shortcuts when focus is in `input`, `textarea`, `select`, `[contenteditable]` or an open combobox, when `event.isComposing`, or when any modifier other than Shift is held.
  - Provide a setting "Use single-key shortcuts", ON by default for expert tools. GitHub offers Settings › Accessibility › Character keys toggles.
- **Discoverability.**
  - `?` opens a shortcut sheet: a modal dialog grouped by area, with searchable `<kbd>` rows.
  - Tooltips on buttons append the shortcut ("Refresh data R").
  - The command palette shows a shortcut on every row.
  - Expose shortcuts with `aria-keyshortcuts` on the controls they trigger.
- **Platform labels.** Show ⌘ ⌥ ⇧ on macOS and Ctrl, Alt, Shift elsewhere. Detect via `navigator.userAgentData?.platform`, falling back to `navigator.platform`. Match on `event.key` for characters and `event.code` only for layout-independent physical keys.
- **Esc layering.** Esc closes only the topmost layer: open menu → popover → dialog → selection. Children that use Esc (comboboxes inside dialogs) must consume it.
- **Feedback.** Shortcut actions give the same visible feedback as clicks. Toggles with no visible result announce through a `role="status"` region ("Sidebar collapsed").

## Anti-patterns (don't)
- `outline: none` on `*:focus` globally, the most common accessibility regression in dashboards.
- Single-letter shortcuts with no off switch. Speech-input users trigger them by dictating words (WCAG 2.1.4: Talon-style non-context-aware software), and keyboard users trigger them accidentally ("S" jumps to search mid-read).
- Shortcuts that fire while typing in a cell editor or the search box.
- Overriding ⌘F with an in-app search that can't search the whole page. If you must, use the second press to fall through to the browser.
- Hijacking ⌘[ ⌘] ⌘L or Ctrl+Tab. GitHub community users report app shortcuts intercepting browser shortcuts even after being "disabled".
- Tab order that jumps between the sidebar, the filter bar and charts because of CSS `order` or grid placement that differs from the DOM.
- Focus lost to `<body>` after closing a dialog, deleting a row, or a re-render that replaces the focused node (React key changes).
- Keyboard handlers added to native `<button>`/`<a>` for Enter or Space. That's redundant, and it double-fires.
- Hover-only actions (row ⋯ menus) with no keyboard path. Reveal them on `:focus-within` as well.

## Good references
- [Grafana — keyboard shortcuts](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/) — `?` sheet, Ctrl+K palette, `d+`/`t+`/`p+` namespaced sequences (`d+k` kiosk, `t+c` copy time range, `pd` duplicate panel), and Esc to exit modes. A model of scoped single-key shortcuts.
- [Linear](https://linear.app) (product) — tooltips show shortcuts, the ⌘K palette lists them, `g` sequences navigate, `j`/`k` move through lists, and Esc steps back one layer.
- [GitHub — Managing accessibility settings](https://docs.github.com/en/account-and-profile/how-tos/account-settings/managing-accessibility-settings) — a user-level switch to disable character-key shortcuts while keeping modifier shortcuts, which satisfies WCAG 2.1.4.
- [W3C — Understanding SC 2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html) — the three ways to comply (turn off, remap to include a modifier, active only on focus) and why speech users are affected.
- [Superhuman — command palette](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/) — every action gets a command *and* a shortcut, and the palette teaches the shortcut.

## Bad references
- [GitHub community discussion #113472 — "PLEASE let us disable ALL keyboard shortcuts"](https://github.com/orgs/community/discussions/113472) — evidence that partial opt-outs still frustrate users when app shortcuts collide with browser and extension shortcuts.
- [Gatsby — client-side routing study](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) — live-region-only route announcements didn't help magnifier users, and resetting focus to the top was overwhelming. Doing nothing fails blind users.
- Dashboards built from `<div onClick>` cards and chart elements with no `tabindex` or role, where whole drill-down features are unreachable by keyboard.

## Accessibility
- WCAG: 2.1.1 Keyboard (A), 2.1.2 No Keyboard Trap (A), 2.1.4 Character Key Shortcuts (A), 2.4.3 Focus Order (A), 2.4.7 Focus Visible (AA), 2.4.11 Focus Not Obscured (AA: sticky headers and toasts must not cover the focused element; use `scroll-padding-block-start` equal to the sticky chrome height), and 3.2.1 On Focus (A: focusing must not trigger navigation or submit).
- `aria-keyshortcuts` documents shortcuts for AT. Visible `<kbd>` text documents them for everyone.
- Use `disabled` vs `aria-disabled` deliberately. Toolbar buttons that should stay discoverable use `aria-disabled` and block activation in script.

## Motion / interaction (if relevant)
- The focus ring appears instantly, with no transition on `outline`.
- Programmatic focus moves that scroll use `scrollIntoView({ block: 'nearest' })`, smooth only under `prefers-reduced-motion: no-preference`.
- A `g`-sequence pending state may show a small "g…" hint in the corner for the 1 s window.

## Tokens and values
| Token | Default |
|---|---|
| Focus ring | 2px solid `--color-focus`, `outline-offset: 2px` (inset −2px in clipped containers) |
| Focus colour | ≥3:1 vs adjacent colours in light and dark; `Highlight` in forced colors |
| Sequence timeout | 1000ms |
| `scroll-padding-block-start` | = sticky top bar + filter bar height (e.g. 96px) |
| `<kbd>` | 12px mono, 1px `neutral-border`, radius 4px, padding 0 4px, `surface-sunken` bg |
| Shortcut sheet | modal dialog, 640px wide, grouped sections, searchable |
| Reserved (never bind) | ⌘/Ctrl + L T W R N Q P F D [ ] 1–9, Ctrl+Tab, F5–F12, Alt+F4 |

## Implementation sketch
```css
:where(a, button, input, select, textarea, [tabindex], summary):focus-visible {
  outline: 2px solid var(--color-focus); outline-offset: 2px;
}
html { scroll-padding-block-start: var(--sticky-chrome-h, 96px); } /* 2.4.11 */
.row-actions { opacity: 0; } .row:is(:hover, :focus-within) .row-actions { opacity: 1; }
kbd { font: 12px/1.4 var(--font-mono); padding: 0 4px; border: 1px solid var(--neutral-border); border-radius: 4px; background: var(--surface-sunken); }
```
```ts
type Shortcut = { keys: readonly string[]; label: string; run: () => void; characterKey: boolean };

const isTypingTarget = (t: EventTarget | null): boolean =>
  t instanceof HTMLElement &&
  (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.getAttribute('role') === 'combobox');

export function installShortcuts(map: readonly Shortcut[], charKeysEnabled: () => boolean): () => void {
  let pending: string | null = null;
  let timer = 0;
  const onKey = (e: KeyboardEvent): void => {
    if (e.defaultPrevented || e.isComposing || e.altKey || e.metaKey || e.ctrlKey) return; // modifier combos handled elsewhere
    if (isTypingTarget(e.target) || !charKeysEnabled()) return; // WCAG 2.1.4 off switch
    if (document.querySelector('dialog:modal')) return;          // don't fire under a modal
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const seq = pending ? [pending, key] : [key];
    const hit = map.find((s) => s.characterKey && s.keys.join(' ') === seq.join(' '));
    if (hit) { e.preventDefault(); pending = null; window.clearTimeout(timer); hit.run(); return; }
    if (!pending && map.some((s) => s.keys.length === 2 && s.keys[0] === key)) {
      pending = key; timer = window.setTimeout(() => { pending = null; }, 1000);
    } else pending = null;
  };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}

/** Keep focus somewhere sensible when the focused item is removed. */
export function removeWithFocus(el: HTMLElement, fallback: HTMLElement): void {
  const next = (el.nextElementSibling ?? el.previousElementSibling) as HTMLElement | null;
  const target = next?.querySelector<HTMLElement>('button, a, [tabindex]') ?? next ?? fallback;
  const hadFocus = el.contains(document.activeElement);
  el.remove();
  if (hadFocus) target.focus();
}
```

## Checklist
- [ ] Every interactive element is reachable by Tab in visual order and has a ≥3:1 `:focus-visible` ring.
- [ ] Composite widgets are one Tab stop with arrow-key navigation, via native `focusgroup` or one fallback.
- [ ] Overlays, deletions and route changes never drop focus to `<body>`. Route changes focus the H1.
- [ ] Single-character shortcuts are ignored in text fields and during IME composition, and can be disabled in settings (WCAG 2.1.4).
- [ ] No shortcut collides with reserved browser, OS or screen reader keys.
- [ ] Shortcuts are discoverable via the `?` sheet, tooltips, the palette and `aria-keyshortcuts`.
- [ ] Sticky chrome never obscures the focused element (`scroll-padding`).
- [ ] Esc closes only the topmost layer.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
- https://docs.github.com/en/account-and-profile/how-tos/account-settings/managing-accessibility-settings (via search summary)
- https://github.com/orgs/community/discussions/113472
- https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/
- https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/
- https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- modern-web-guidance: `skills/modern-web-guidance/guides/accessibility/accessibility.md` (tab order, focus indicators, keyboard handlers, 3.2.1)
- modern-web-guidance: `skills/modern-web-guidance/guides/ui-components/toolbar.md` (focusgroup toolbar, fallback roving tabindex)
- modern-web-guidance: `skills/modern-web-guidance/guides/ui-components/menu.md` (menu keyboard contract, focus restoration for nested popovers)
- modern-web-guidance: `skills/modern-web-guidance/guides/ui-components/tabs.md` (focusgroup tablist, `nomemory`)
- modern-web-guidance: `skills/modern-web-guidance/guides/ui-behaviors/declarative-dialog-popover-control.md` (focus loss when hiding a popover from inside)
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md`
