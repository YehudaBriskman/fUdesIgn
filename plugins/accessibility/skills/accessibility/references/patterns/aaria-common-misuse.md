# Common ARIA misuse and how to fix it

> Most ARIA bugs are a handful of repeat mistakes: redundant roles, `aria-hidden` on focusable content, `aria-label` on elements that can't be named, roles without behaviour, stale states and invalid ID references; find them with the accessibility tree and axe, and fix them by deleting ARIA before adding more.

**Category:** ARIA · **Applies to:** code review of any component, design-system audits, migrations · **Priority:** must

## When to use / when not
- **Use** in code review and during audits. Each row below is a known failure with its fix.
- **Not** a replacement for `aaria-first-rule-and-apg.md`, which says what to build; this file says what to remove or correct.

## Rules (do)
- **Misuse catalogue:**

| Misuse | Effect | Fix |
|---|---|---|
| `<button role="button">`, `<nav role="navigation">`, `<input required aria-required="true">` | Noise; risks drift | Delete the redundant ARIA (exception: `role="list"` on styled lists for Safari) |
| `aria-hidden="true"` on a focusable element or its ancestor | Focus lands on "nothing" | Remove it, or make the content `inert` / `hidden` |
| `role="presentation"` / `none` on a `<button>` or link | Role stripped, still focusable | Remove the role |
| `aria-label` on `<div>`/`<span>` with no role | Ignored by most screen readers | Give it a role, or use visible text |
| `aria-label` that contradicts visible text | Breaks voice control (2.5.3) | Include the visible text first |
| `aria-labelledby` / `aria-describedby` / `aria-controls` pointing at a missing ID | Empty name or description | Keep IDs unique and present; generate them (`useId`) |
| `role="tab"` / `"menuitem"` / `"option"` without its parent role | Invalid tree | Add `tablist` / `menu` / `listbox` parent |
| Interactive role without keyboard (`role="button"` with only `onclick`) | Unusable by keyboard | Use `<button>` |
| Stale state (`aria-expanded="false"` while open) | Wrong announcement | Derive state from one source of truth |
| `aria-live` on a container that re-renders wholesale | Repeated or missed announcements | One persistent region, update text only (`aaria-live-regions-announcements.md`) |
| `role="alert"` for every toast | Interrupts constantly | `role="status"` (polite) unless critical |
| `aria-describedby` to text with links inside | Links read out of context | Point at a plain text span |
| `aria-disabled="true"` without blocking activation | Looks disabled, still acts | Guard the handler |
| `tabindex="0"` on non-interactive text "for screen readers" | Extra tab stops | Remove; screen readers read text without focus |
| `title` as the only name | Hover-only, not keyboard | Visible label or `aria-label` |
| Role on the wrong element (`<li role="button">`) | Breaks list semantics | Put the role on a child element |
| `aria-modal="true"` on a non-modal panel | Hides the page from AT | Use only on true modals; prefer `<dialog>` |

- **How to find them:** axe-core rules `aria-allowed-attr`, `aria-valid-attr-value`, `aria-required-children`, `aria-required-parent`, `aria-hidden-focus`, `button-name`, `link-name`, `duplicate-id-aria`, `aria-prohibited-attr` (`atest-automated-axe-playwright.md`); then the DevTools accessibility tree to read computed names and roles.
- **Fix order:** delete wrong ARIA → switch to native element → only then add the missing ARIA from the APG pattern.

## Anti-patterns (don't)
- Fixing a failed axe rule by adding another ARIA attribute instead of using the native element.
- "ARIA sprinkling" in reviews: adding `role` and `aria-label` to every `div` to look thorough.
- Hiding duplicated visible text with `aria-hidden` and then forgetting it contains a link.

## Good references
- [W3C — ARIA in HTML](https://www.w3.org/TR/html-aria/) — allowed and prohibited roles per element; the basis for the redundancy rows.
- [W3C — Using ARIA](https://www.w3.org/TR/using-aria/) — the rules behind most rows.
- [Deque — axe-core rule descriptions](https://dequeuniversity.com/rules/axe/) — one page per rule with failure examples.
- [modern-web-guidance — Accessibility §2–3](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#aria-roles-and-states) — no redundant roles, don't hide interactive elements, don't name unnamed-role elements.

## Bad references
- [WebAIM Million](https://webaim.org/projects/million/) — reports more detected errors on pages that use ARIA than on pages that don't; misuse, not ARIA itself, is the cause.

## Accessibility
- Every row above is an accessibility failure under 1.3.1 or 4.1.2 (or 2.5.3 for label mismatch).

## Motion / interaction (if relevant)
- None specific; state attributes must update in the same frame as the visual change.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Redundant roles | 0 (except `role="list"` restoration) | Review gate |
| Broken ID references | 0 | Review gate |
| axe ARIA rule violations | 0 | CI gate |

## Implementation sketch
A dev-only DOM lint for three misuses axe sometimes reports as "needs review".
```ts
export interface AriaIssue { el: Element; issue: string }

export function lintAria(root: ParentNode = document): AriaIssue[] {
  const out: AriaIssue[] = []
  const focusable = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
  for (const el of root.querySelectorAll('[aria-hidden="true"]'))
    if (el.matches(focusable) || el.querySelector(focusable)) out.push({ el, issue: 'aria-hidden contains focusable content' })
  for (const el of root.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]'))
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls'])
      for (const id of (el.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean))
        if (!document.getElementById(id)) out.push({ el, issue: `${attr} references missing #${id}` })
  for (const el of root.querySelectorAll('div[aria-label]:not([role]),span[aria-label]:not([role])'))
    out.push({ el, issue: 'aria-label on an element with no role' })
  return out
}
```

## Checklist
- [ ] No redundant roles (except `role="list"` restoration).
- [ ] No `aria-hidden` or `role="none"` on or around focusable elements.
- [ ] Every ID reference resolves.
- [ ] Child roles have their required parents.
- [ ] States update with the UI.
- [ ] axe ARIA rules pass with zero violations.

## Sources
- https://www.w3.org/TR/html-aria/
- https://www.w3.org/TR/using-aria/
- https://www.w3.org/TR/wai-aria-1.2/
- https://dequeuniversity.com/rules/axe/
- https://webaim.org/projects/million/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
