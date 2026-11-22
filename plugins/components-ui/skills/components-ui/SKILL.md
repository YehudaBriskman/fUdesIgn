---
name: components-ui
description: Build or review interactive UI components with researched rules. Use when adding or changing a dialog, modal, confirmation, popover, dropdown or action menu, tooltip, toast or snackbar, drag-and-drop or sortable list, virtualised long list or table, or any async control (save, delete, retry); when choosing between native elements, an existing component, Radix, Base UI, shadcn, React Aria or a specialist library; or when asked to audit a component's keyboard, focus and state handling. Trigger on "add a modal", "toast after save", "dropdown menu", "reorder items", "too many rows", "which component library", "review this component".
---

# Components UI

Behaviour rules for interactive components. A component is a contract (focus, keyboard, dismissal, states), not a rectangle. 10 pattern files; this file gives the workflow and the non-negotiables.

- **Index:** `references/INDEX.md`. **Patterns:** `references/patterns/<prefix>-<name>.md`. Prefixes: `cpfound` (foundations), `cpover` (overlays), `cpctl` (controls), `cpref` (review).
- **Not repeated here:** which overlay to choose (dashboard-ui `comp-overlay-choice.md`), command palettes (`comp-command-palette-search.md`), notifications and banners (`comp-notifications-alerts.md`), optimistic UI (`prog-optimistic-ui-and-undo.md`), forms (forms-ui), sheets (mobile-ui `monav-sheets-detents.md`), ARIA rules and live regions (accessibility plugin).

## Workflow

1. **Inspect, then climb the ladder.** Read `package.json`, the UI folder and tokens; take the first rung that fits (`cpfound-reuse-before-build.md`, `cpfound-library-categories-and-licences.md`).
2. **Decide the states.** Mark which rows of the state matrix apply and model async work as one tagged union (`cpfound-state-matrix-and-async-states.md`).
3. **Build the contract** for the component type: dialog (`cpover-dialog-focus-and-dismissal.md`), popover, menu or tooltip (`cpover-popover-menu-tooltip.md`), toast (`cpover-toast-and-feedback.md`), drag (`cpctl-drag-and-drop-sortable.md`), long list (`cpctl-virtualised-lists-and-tables.md`).
4. **Adapt to the product:** project tokens, radius, density and motion; delete library demo defaults.
5. **Verify.** Keyboard, one screen reader, 320 px and 200% zoom, throttled network, reduced motion. Say what you did not test.
6. **Review.** Scan `cpref-component-anti-patterns.md`, then score `cpref-component-review-rubric.md` and report failures as `ID · evidence · fix (pattern)`.

## Non-negotiables

1. Reuse before building: project component, platform element, installed foundation, specialist, designed, custom, in that order.
2. One foundation and one library per problem; every new dependency has a justification and a recorded licence.
3. Native elements first: `<button>`, `<dialog>` with `showModal()`, the `popover` attribute.
4. Every action works by keyboard and by a single click or tap; nothing essential is hover-only.
5. Focus moves in on open, returns to the trigger on close, and Escape follows the APG pattern.
6. Destructive confirmations name the object and the action, and focus the safe choice.
7. Async state is one tagged union; show success only after confirmation or label it optimistic.
8. Ignore repeats while pending; stale responses never overwrite newer ones.
9. Toasts are brief, capped and deduplicated, never the only record, and errors persist.
10. Live regions exist before their content is injected.
11. Drag always has a single-pointer, non-drag alternative (WCAG 2.5.7).
12. Measure before virtualising; keep row counts and a find alternative when you do.
13. Test keyboard, a screen reader and a throttled network, and disclose gaps.

## Decision table

| Need | Use |
|---|---|
| Blocking decision | `<dialog>` + `showModal()` |
| Light-dismiss panel or menu | `popover` attribute |
| Action list | Menu pattern (`role="menu"`), not navigation |
| Name an icon control | `aria-label` (+ optional tooltip) |
| Transient confirmation or undo | Toast |
| Failure needing action | Persistent inline message |
| Reorder | Move buttons + keyboard drag; mouse drag optional |
| ≥ ~1,000 rows with measured cost | Virtualise; else paginate or `content-visibility` |

## Status of the facts

Verified against W3C APG, WCAG 2.2, MDN, web.dev and shadcn's changelog on 2026-11-22. Library release dates move fast; re-check maintenance before adopting. Numeric defaults marked "house" in token tables are not standards.
