# Reuse before you build: the selection ladder

> Before writing any interactive component, inspect what the project already has and take the first rung of the ladder that fits: existing project component, installed foundation primitive, a proven specialist, a designed copy-in component, and only then custom behaviour. A component is a behavioural contract (focus, keyboard, dismissal, states), not a rectangle, so never re-solve a solved contract without a written reason.

**Category:** Foundations · **Applies to:** dialogs, popovers, menus, selects, toasts, drawers, command palettes, tabs, any new interactive control, any new UI dependency · **Priority:** must

## When to use / when not
- Any request that adds or changes an interactive control, or proposes installing a UI package.
- Not for purely visual work (colour, type, imagery); that is `dashboard-ui`, `marketing-ui` or `design-system`.
- The behaviour of each overlay and control is in the `cpover-` and `cpctl-` patterns; this file decides *whether and what to adopt*.

## Rules (do)
**Inspect first (5 minutes, before the first line of code)**
- Read `package.json`, the lockfile, the `components/ui` (or equivalent) folder, the token file and the routing framework. Search the code for an existing equivalent by role (`dialog`, `toast`, `popover`, `combobox`), not only by name.
- Note which foundation is installed (shadcn/ui copied code, Base UI, Radix, React Aria, Headless UI, native elements). That is the default for everything new.

**The ladder, top to bottom**
| Rung | Take it when | Example |
|---|---|---|
| 1. Existing project component | An equivalent exists, even if it needs a prop | The app's `<Dialog>` wrapper |
| 2. Platform element | The browser ships the behaviour | `<dialog>`, `popover`, `<details>`, `<select>` |
| 3. Installed foundation primitive | Keyboard, focus and layering are needed beyond the platform | Base UI, Radix, React Aria, Headless UI |
| 4. Proven specialist | The mechanics are famously easy to get wrong | toast queue, bottom-sheet drag, command menu (see `comp-command-palette-search.md`), OTP input, virtualised list, sortable drag and drop |
| 5. Designed copy-in component | A composed experience that real events can drive | AI chat parts, approval cards |
| 6. Custom | No rung fits | Document why; test to primitive-level quality |

**A new dependency must pay for itself.** Before installing, write one line each on:
- the missing behaviour it adds (not a nicer look);
- framework and React version fit, last release date, open security advisories;
- bundle cost (check the published size), SSR and hydration behaviour, CSS conflicts;
- its accessibility contract, RTL and reduced-motion support;
- the licence and attribution terms of the exact repository (copy-in does not mean unrestricted);
- whether it introduces a second overlay, animation or form stack.

**Adapt, do not transplant.** A library demo's look is not your design system: apply the project's tokens, radius, density, focus ring and motion values, and delete the demo's stray one-off values.

## Anti-patterns (don't)
- Installing a competing stack because a demo looked better.
- Mixing two foundations (Radix and Base UI, or two toast libraries) in the same pattern.
- A `div` with `onClick` where a `button`, or a hand-rolled focus trap where `<dialog>` or a primitive, would do.
- Treating a third-party component as automatically accessible, maintained, secure or free of licence terms.
- Churning a working dependency for fashion; migration needs a named benefit and a test plan.

## Good references
- [WAI-ARIA Authoring Practices, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — "no ARIA is better than bad ARIA", and native HTML first, which is rung 2.
- [Base UI overview](https://base-ui.com/react/overview/quick-start) — headless, unstyled, accessible primitives that you restyle fully.
- [Radix Primitives, Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility) — states which WAI-ARIA patterns each primitive follows.

## Bad references
- A pull request that adds a second toast library "for one screen" — duplicates queueing, announcement and dismissal logic, and the two will disagree.
- A copied marketing-site component dropped into a work surface unchanged — brings its own tokens, motion and licence terms.

## Accessibility
- Rungs 2 and 3 inherit names, roles and keyboard support, but composition, labelling and contrast stay your job: check each adopted control with a keyboard and one screen reader (`atest-manual-test-plan.md`).
- Never claim accessibility from a library's marketing page; verify the behaviour you ship.

## Motion / interaction (if relevant)
- One motion stack per project: CSS for simple transitions, one library for springs, layout and exit animation. See `mfound-purpose-and-frequency.md`.

## Tokens and values
House defaults, not standards.

| Token | Value | Use |
|---|---|---|
| Inspect budget | 5 minutes | Before picking a rung |
| Foundations in one pattern | 1 | Never mix |
| New dependency justification | 6 lines (see list) | In the PR description |
| Last-release staleness to question | > 12 months | Check issues and advisories before adopting |

## Implementation sketch
```ts
// Record the choice in the PR, in one line per decision.
export type Rung = 'project' | 'platform' | 'foundation' | 'specialist' | 'designed' | 'custom'

export interface ComponentChoice {
  readonly behaviour: string
  readonly rung: Rung
  readonly why: string
  readonly newDependencies: readonly string[]
}

export function describeChoice(c: ComponentChoice): string {
  const deps = c.newDependencies.length ? c.newDependencies.join(', ') : 'none'
  return `${c.behaviour}: ${c.rung} (${c.why}); new dependencies: ${deps}`
}
```

## Checklist
- [ ] `package.json`, the UI folder and tokens were read before choosing.
- [ ] The rung is stated, and rungs above it were ruled out in one sentence.
- [ ] No second foundation, toast, overlay or animation stack was introduced.
- [ ] Each new dependency has the six justification lines, including the licence.
- [ ] Library demo styling was replaced by project tokens.
- [ ] Custom behaviour, if any, has a written reason and primitive-level tests.

## Sources
- https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- https://base-ui.com/react/overview/quick-start
- https://www.radix-ui.com/primitives/docs/overview/accessibility
- Source corpus: local `ui-behavior-component-intelligence` skill, and the `pick-ui-library` skill in https://github.com/emilkowalski/skills (selection philosophy, paraphrased)
