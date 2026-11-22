# Pattern index

10 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

## Foundations: reuse before build, library categories and licences, state matrix and async states (`cpfound-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Library categories, specialists and licence checks](patterns/cpfound-library-categories-and-licences.md) | should | Sort every candidate into one of three categories before adopting it: a foundation (one per project, for primitives), a specialist (one per hard problem, for mechanics that are easy to get wrong), or a designed copy-in component (selectively, with real data). Check the exact licence of copy-in code, because "free" and "you own the code" do not mean unrestricted. |
| [Reuse before you build: the selection ladder](patterns/cpfound-reuse-before-build.md) | must | Before writing any interactive component, inspect what the project already has and take the first rung of the ladder that fits: existing project component, installed foundation primitive, a proven specialist, a designed copy-in component, and only then custom behaviour. A component is a behavioural contract (focus, keyboard, dismissal, states), not a rectangle, so never re-solve a solved contract without a written reason. |
| [The interaction state matrix and async state model](patterns/cpfound-state-matrix-and-async-states.md) | must | For every non-trivial control, decide in writing which of the 17 states and modes apply and build all of them; model every async action as `idle → pending → success \| error` (plus `cancelled`), and show success only when the outcome is truly known. |

## Overlays: dialog, popover/menu/tooltip, toast (`cpover-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Dialogs: focus, dismissal and cleanup](patterns/cpover-dialog-focus-and-dismissal.md) | must | Build a modal on the native `<dialog>` opened with `showModal()`: focus moves in, the page behind is inert, Escape and the Cancel button close it, focus returns to the trigger, and a destructive confirmation names its action and puts initial focus on the safe choice. |
| [Popovers, menus and tooltips](patterns/cpover-popover-menu-tooltip.md) | must | Anything a pointer can reveal, a keyboard and a touch user must be able to reveal too. Use the `popover` attribute for light-dismiss surfaces, a real menu pattern for action lists, and tooltips only for naming a control: a tooltip never holds essential instructions or the only route to an action. |
| [Toasts and transient feedback](patterns/cpover-toast-and-feedback.md) | must | A toast is for brief, non-blocking confirmation of something that already happened. Field corrections stay inline, consequential failures get a durable message, and a toast is never the only record of anything the user must act on. |

## Controls: drag and drop, virtualised lists and tables (`cpctl-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Drag and drop and sortable lists](patterns/cpctl-drag-and-drop-sortable.md) | must | Every drag interaction needs a non-drag alternative that does the same job (WCAG 2.5.7): keyboard reordering with announcements, or move buttons and a "move to" menu. Use a maintained library for the mechanics, keep the grab handle separate from the content, and show where the item will land. |
| [Virtualised lists and tables](patterns/cpctl-virtualised-lists-and-tables.md) | should | Measure before virtualising: paginate or use `content-visibility: auto` for hundreds of rows, and virtualise only when thousands of rows cost real frames or memory. When you do, keep the scroll position, row semantics (`aria-rowcount`, `aria-rowindex`), keyboard navigation and find-in-page behaviour intact, or give an alternative. |

## References: anti-pattern catalogue, review rubric (`cpref-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Interactive component anti-patterns](patterns/cpref-component-anti-patterns.md) | must | Twelve failures that recur in hand-built and AI-generated interactive UI, each with the symptom you can see in a browser, the cause and the fix. Scan for these before you review in detail. |
| [Interactive component review rubric and report](patterns/cpref-component-review-rubric.md) | must | Score a component on 20 checks, 0–2 each, ship at 80% or more with no must-check at 0, and report every failed check as `ID · evidence · fix (pattern)` together with a short implementation report that states what was and was not tested. |
