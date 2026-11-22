# Interactive component review rubric and report

> Score a component on 20 checks, 0–2 each, ship at 80% or more with no must-check at 0, and report every failed check as `ID · evidence · fix (pattern)` together with a short implementation report that states what was and was not tested.

**Category:** References · **Applies to:** a finished dialog, menu, toast, list, drag interaction or async control, before calling it done · **Priority:** must

## When to use / when not
- After building or changing an interactive component, and when reviewing someone else's.
- Run `cpref-component-anti-patterns.md` first. For whole-screen visual review use the `design-review` plugin.

## Rules (do)
Score 2 = met with evidence, 1 = partly, 0 = missing. `M` marks a must-check.

| ID | Check |
|---|---|
| R1 M | Existing project component or platform element was considered before custom code |
| R2 | No second foundation, toast or overlay library was added; licences recorded |
| R3 M | Relevant rows of the state matrix are listed and built |
| R4 M | Async status is one tagged union; success follows confirmation |
| R5 | Repeats are ignored while pending; stale responses cannot win |
| R6 M | Every action works with keyboard and with a single tap or click, with no hover dependency |
| R7 M | Focus moves in on open and returns on close; Escape behaves per its APG pattern |
| R8 M | Names, roles and states are exposed (native element or correct ARIA) |
| R9 | Status changes are announced through a pre-existing live region |
| R10 | Destructive actions name the object and action; safe choice has initial focus |
| R11 | Toasts: capped, deduplicated, never the only record, errors persist |
| R12 | Drag has a non-drag alternative |
| R13 | Long lists: measured, with row count and an alternative to find-in-page |
| R14 | Touch targets ≥ 24 px (WCAG 2.5.8, AA); 44 px primary is design guidance (WCAG 2.5.5 is AAA) |
| R15 | Works at 320 px wide and 200% text zoom |
| R16 | RTL layout and arrow-key direction checked where relevant |
| R17 | Reduced motion keeps meaning without animation |
| R18 | Styling uses project tokens, not library demo defaults |
| R19 | Tested: keyboard, one screen reader, throttled network; gaps disclosed |
| R20 | Report below was written |

**Pass:** total ≥ 32 of 40, and every `M` check at 1 or 2 (a 0 on any `M` fails regardless of total).

**Implementation report (paste in the PR)**
```text
Behaviour: <what the user can do>
Component choice: <rung> — <why>
States covered: <matrix rows>
Accessibility and devices: <what was tested>
Dependencies introduced: <names and licences, or none>
Verification: <results and remaining gaps>
```

## Anti-patterns (don't)
- Scoring from the code alone, without running it.
- Giving a 2 for "uses a library"; the library's contract still has to be tested.
- Hiding untested areas; R19 requires disclosure.

## Good references
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) — criteria for R6 to R9, R14 and R15.
- [WAI-ARIA APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) — the expected keyboard model for R7.
- `aref-audit-rubric-and-report.md` — the repo's accessibility audit format this rubric mirrors.

## Bad references
- A review comment "looks good, accessible library" — no evidence, no states, no test list.

## Accessibility
- R6 to R9 map to WCAG 2.1.1, 2.1.2, 2.4.3, 4.1.2 and 4.1.3; R12 to 2.5.7; R14 to 2.5.8; R15 to 1.4.4 and 1.4.10; R17 to 2.3.3 and `a11y-motion-vestibular.md`.

## Motion / interaction (if relevant)
- R17 only; durations come from `mfound-durations-and-easing.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Checks | 20, scored 0–2 | Total 40 |
| Pass | ≥ 32 and no `M` at 0 | House rule |
| Report fields | 6 | PR description |

## Implementation sketch
```ts
export interface Check { readonly id: string; readonly must: boolean; readonly score: 0 | 1 | 2 }

export function verdict(checks: readonly Check[]): { total: number; pass: boolean; failedMust: string[] } {
  const total = checks.reduce((n, c) => n + c.score, 0)
  const failedMust = checks.filter((c) => c.must && c.score === 0).map((c) => c.id)
  return { total, pass: total >= 0.8 * checks.length * 2 && failedMust.length === 0, failedMust }
}
```

## Checklist
- [ ] All 20 checks scored with evidence for each 1 and 2.
- [ ] No must-check at 0; total at least 80%.
- [ ] Each failure reported as `ID · evidence · fix (pattern)`.
- [ ] The implementation report lists what was not tested.

## Sources
- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.w3.org/WAI/ARIA/apg/patterns/
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
