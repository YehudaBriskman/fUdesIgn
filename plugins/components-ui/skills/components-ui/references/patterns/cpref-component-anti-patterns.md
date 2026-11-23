# Interactive component anti-patterns

> Twelve failures that recur in hand-built and AI-generated interactive UI, each with the symptom you can see in a browser, the cause and the fix. Scan for these before you review in detail.

**Category:** References · **Applies to:** reviewing any dialog, menu, popover, toast, list, drag interaction or async action · **Priority:** must

## When to use / when not
- First pass of a component review, and when auditing generated code that "looks right". Manipulative defaults (pre-checked consent, lopsided confirm buttons) are covered in `uxeth-choice-architecture-and-dark-patterns.md`.
- Scoring and the report format are in `cpref-component-review-rubric.md`. Colour and layout faults are in the dashboard-ui `ref-` patterns.

## Rules (do)
Check each failure with the stated test; fix with the linked pattern.

| # | Failure | Test | Fix |
|---|---|---|---|
| 1 | Hand-rolled dialog | Tab out of it, press Escape, check focus after close | `cpover-dialog-focus-and-dismissal.md` |
| 2 | Clickable `div` as button or menu item | Tab to it, press Enter and Space | Native `<button>`; `cpfound-reuse-before-build.md` |
| 3 | Hover-only action or reveal | Use keyboard only, then a touch emulator | `cpover-popover-menu-tooltip.md` |
| 4 | `role="menu"` on navigation | Check the DOM role against the APG menu pattern | Disclosure plus links |
| 5 | Tooltip holding essential content or links | Hover, then move the pointer onto it; focus the trigger | Visible text or a popover |
| 6 | "Saved" before the server answers | Throttle the network to offline and save | `cpfound-state-matrix-and-async-states.md` |
| 7 | Toast as the only error record | Trigger a failure and wait 10 s | `cpover-toast-and-feedback.md` |
| 8 | Toast stack with no cap or dedupe | Fire the same event 10 times | Same pattern |
| 9 | Stale response overwrites a newer one | Type fast with a delayed network | `latestOnly` in the state pattern |
| 10 | Drag as the only way to reorder | Try with keyboard and single click | `cpctl-drag-and-drop-sortable.md` |
| 11 | Virtualised list with no row count or find alternative | Inspect `aria-rowcount`; press Ctrl+F | `cpctl-virtualised-lists-and-tables.md` |
| 12 | Second foundation or duplicate library | List UI dependencies | `cpfound-library-categories-and-licences.md` |

## Anti-patterns (don't)
- Reviewing by screenshot only; most of these cannot be seen in one.
- Fixing the symptom with more ARIA instead of the native element (`aaria-common-misuse.md`).
- Treating a library's accessibility claim as a test result.

## Good references
- [WAI-ARIA APG, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — native first, and the five rules of ARIA use.
- [Deque, axe-core rules](https://dequeuniversity.com/rules/axe/) — which of these faults automation can and cannot catch.

## Bad references
- A generated dialog built from `div` plus `onClick` plus a `useEffect` focus trap — fails #1 and #2 together, which is the commonest generated-UI shape.

## Accessibility
- Mapping: #1 to 2.1.2 and 2.4.3; #2 to 2.1.1 and 4.1.2; #3 to 2.1.1 (1.4.13 for hover reveals); #4 to 4.1.2; #5 to 1.4.13; #10 to 2.5.7; #11 has no single criterion (row counts are best practice, find-in-page is not covered by WCAG). Automated tools catch only a minority, so keep the manual tests in the Test column (`atest-manual-test-plan.md`).

## Motion / interaction (if relevant)
- None specific; see `mref-anti-patterns-gallery.md` for motion failures.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Failures to scan | 12 | First pass |
| Network test | offline and throttled | #6, #9 |

## Implementation sketch
```ts
// Cheap DOM audit for #2: elements that behave like buttons but are not.
export function fakeButtons(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('div[onclick], span[onclick], [role="button"]:not(button)')]
    .filter((el) => !el.matches('button, a[href], input, summary'))
}
```

## Checklist
- [ ] All 12 tests were run, not skimmed.
- [ ] Each hit names the failure number and the file and line.
- [ ] Fixes use the native element or the linked pattern.
- [ ] Network-dependent checks ran with throttling or offline.

## Sources
- https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- https://dequeuniversity.com/rules/axe/
- https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
