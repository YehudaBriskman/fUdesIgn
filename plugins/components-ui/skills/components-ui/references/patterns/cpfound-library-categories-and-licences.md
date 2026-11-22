# Library categories, specialists and licence checks

> Sort every candidate into one of three categories before adopting it: a foundation (one per project, for primitives), a specialist (one per hard problem, for mechanics that are easy to get wrong), or a designed copy-in component (selectively, with real data). Check the exact licence of copy-in code, because "free" and "you own the code" do not mean unrestricted.

**Category:** Foundations · **Applies to:** choosing between UI libraries, registries and copy-paste component sets · **Priority:** should

## When to use / when not
- You have reached rung 3, 4 or 5 of the ladder in `cpfound-reuse-before-build.md` and must pick a concrete option.
- Not a mandate to use any named library: names below are well-known candidates. Verify current maintenance, API and licence before adopting.

## Rules (do)
**Three categories**
| Category | Purpose | Rule |
|---|---|---|
| Foundation | Semantic primitives with keyboard, focus, layering and ARIA solved | One per project. Reuse what is installed. Never mix two in one pattern |
| Specialist | A mechanic that is easy to get wrong | Add one only when the behaviour is missing and a platform feature will not do |
| Designed copy-in | Composed, styled components you paste into the repo | Selective; wire to real events; check the licence |

**Foundation candidates:** native elements first; then shadcn/ui (copied code in your repo, on top of Base UI or Radix), Base UI, Radix Primitives, React Aria, Headless UI. shadcn's July 2026 changelog makes Base UI the default for new projects while Radix stays supported, so no migration is required. Stay on whatever is installed and working; moving between them needs a named benefit and a test plan.

**Specialist candidates by problem**
| Problem | Candidates | Key caution |
|---|---|---|
| Toast queue | Sonner | Not the only record of a critical failure |
| Bottom sheet with drag | Vaul (last release Dec 2024; check issues first) | Test long scroll content, keyboard and touch |
| Command menu | cmdk (last release Mar 2025; check issues first) | Commands reflect permissions and context |
| Animated numbers | NumberFlow | Never obscure exact values; honour reduced motion |
| OTP input | input-otp | Must not break password managers or paste |
| Springs, layout, exit animation | Motion | CSS for simple transitions |
| Drag and drop, sortable | dnd kit | Needs a keyboard alternative (`cpctl-drag-and-drop-sortable.md`) |
| Long lists and tables | Virtuoso, TanStack Virtual | `cpctl-virtualised-lists-and-tables.md` |
| Charts | Recharts for general, a streaming chart for live data | `chart-` patterns in dashboard-ui |

**Designed copy-in components:** use for AI-native parts (streaming, approval cards, diffs, tool chips) and for one deliberate focal moment on a marketing page, never as a whole aesthetic. Drive them from real application events and permissions, not demo state.

**Licence check, every time**
- Read the licence file of the exact repository, and of each component author on aggregator sites.
- Look for attribution requirements, redistribution limits and Commons Clause or non-commercial terms.
- Record the licence and commit in the PR.

## Anti-patterns (don't)
- Presenting a long shopping list for a straightforward component; pick one and say why.
- Wiring a copy-in component to placeholder state, so "running" and "approved" are fake.
- Assuming "open source" or "copy-paste" means no attribution.
- Adding a specialist for one hover effect that CSS handles.

## Good references
- [shadcn/ui, introduction](https://ui.shadcn.com/docs) — explains the open-code model: the code lives in your repo.
- [React Aria](https://react-aria.adobe.com/) — hooks and components with documented accessibility behaviour across input modes.
- [SPDX licence list](https://spdx.org/licenses/) — unambiguous names to record in the PR.

## Bad references
- A component pulled from an aggregator with no licence file — nothing grants you the right to ship it.

## Accessibility
- Compare each candidate's documented keyboard model with the APG pattern for the control (`aaria-first-rule-and-apg.md`), then test it yourself.
- A specialist's accessibility claims cover its own markup; your labels and contrast are still yours.

## Motion / interaction (if relevant)
- Count motion libraries: more than one means two sets of easing and reduced-motion handling (`mfound-reduced-motion-vestibular.md`).

## Tokens and values
House defaults.

| Token | Value | Use |
|---|---|---|
| Foundations per project | 1 | Primitives |
| Specialists per problem | 1 | Mechanics |
| Licence record | SPDX id + commit hash | In the PR |

## Implementation sketch
```ts
// Block a second foundation in CI: fail if more than one is a dependency.
const FOUNDATIONS = ['@radix-ui/react-dialog', '@base-ui/react', '@headlessui/react', 'react-aria-components'] as const

export function foundationsInUse(deps: Readonly<Record<string, string>>): string[] {
  return FOUNDATIONS.filter((name) => name in deps)
}
```

## Checklist
- [ ] The candidate is categorised as foundation, specialist or designed.
- [ ] No second foundation or duplicate specialist was added.
- [ ] The licence of the exact repository is read and recorded.
- [ ] Copy-in components are driven by real events and restyled with project tokens.
- [ ] The documented keyboard model matches the APG pattern, and was tested.

## Sources
- https://ui.shadcn.com/docs
- https://react-aria.adobe.com/
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
- https://base-ui.com/
- https://www.radix-ui.com/primitives
- https://spdx.org/licenses/
- Source corpus: local `ui-behavior-component-intelligence` skill (library categories), and https://github.com/emilkowalski/skills `pick-ui-library` (candidate lists, paraphrased)
