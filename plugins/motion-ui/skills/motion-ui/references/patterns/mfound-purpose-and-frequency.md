# Motion purpose and the frequency budget

> Every animation needs a job (feedback, continuity, orientation or attention) that you can name in one word, and its size shrinks as its frequency grows: keyboard-driven and 100+-times-a-day actions get no motion, tens-a-day get a short fade, occasional actions get standard motion, and only rare moments may be expressive.

**Category:** Motion foundations · **Applies to:** every animated element in a product UI: menus, dialogs, sheets, buttons, lists, route changes, toasts, onboarding · **Priority:** must

## When to use / when not
Use this pattern first, before choosing a duration or a curve. It decides *whether* something moves at all.

Motion earns its place when it does one of these jobs:
- **Feedback:** the interface heard you (a press, a toggle, a drag that tracks the finger).
- **Continuity:** the same object is tracked from one state to the next (a card that grows into a page, a row that moves when sorted); add an arc only when the user must follow the object (`mtrans-arc-paths-and-mask-reveals.md`).
- **Orientation:** the user learns where something came from and where it will go back to (a sheet that rises from the bottom edge and leaves the same way).
- **Attention:** a one-off nudge to something that changed and matters (an inline error after submit, a new message).

A fifth job, **delight**, is allowed only for rare moments (first run, finishing a long task) and never on a path the user repeats.

Do not animate when the job is "it looks nicer", when the content before and after is unrelated (cut or cross-fade instead), or when the action is triggered from the keyboard. For dashboards, `motion-principles-and-tokens.md` already applies these ideas to data; this file is the general product-UI version.

## Rules (do)
- **Name the job.** Write it next to the animation in code review: `feedback`, `continuity`, `orientation`, `attention` or `delight`. If you can't, remove the animation.
- **Budget by frequency.** Estimate how often a typical user triggers it, then pick the row:

  | How often | Example | Motion |
  |---|---|---|
  | Keyboard shortcut, or 100+ times a day (this skill's cut-off) | ⌘K palette, list navigation with arrows, tab switch by shortcut | None (0 ms). Emil Kowalski: keyboard-initiated actions "You should never animate them"; Raycast, which he opens "hundreds of times a day", has no open animation |
  | Tens of times a day | context menu, dropdown, hover card | Short (100–180 ms), fade plus at most a small scale, no bounce |
  | Occasional (a few times a session) | dialog, sheet, route change, toast | Standard (200–300 ms), enter and exit, may move |
  | Rare (once a session or less) | onboarding, first success, plan upgraded | May be expressive (400–600 ms, a spring with bounce) |

- **Feedback within 100 ms.** Whatever the animation length, the first visible response lands within 100 ms of input (NN/g response-time limits; web.dev RAIL). A long animation that starts late feels broken; a short one that starts at once feels fast.
- **The more frequent, the shorter and subtler** (NN/g, animation duration). Re-check frequency after launch with analytics; a dialog that turns out to be opened 40 times a day drops a row.
- **Motion follows cause.** Something moves because the user did something, or because the system has news for them. Nothing moves on its own in a working screen (no idle loops, no autoplay carousels, no floating blobs).
- **One motion per region at a time.** If two things animate together, they share duration and curve, or one clearly follows the other (see `mfound-choreography-and-stagger.md`).
- **Expressive is a budget, not a style.** Spend at most one expressive moment per flow; M3 Expressive's research found that breaking familiar patterns for novelty hurt usability even while users liked the look.
- **Respect the platform's own motion.** Native scrolling, text selection and system sheets already move; don't add a second layer on top.

## Anti-patterns (don't)
- Fade-up-on-scroll on every section of an app screen. It delays reading and replays every visit; frontend-design calls the same fade on every section a tell of generated UI.
- Animating the command palette, autocomplete list or a menu opened with a shortcut.
- A 400 ms "luxury" dropdown in a tool people use all day. A 180 ms dropdown feels more responsive (Emil Kowalski).
- Delight on a repeated path: confetti every time a task is ticked off, a bouncing icon on every save.
- Animation as a loading mask: a slow entrance used to hide that data hasn't arrived (use a real loading state; see `prog-loading-states.md` in dashboard-ui).
- Motion with no exit: things that animate in but vanish instantly, so the user can't see where they went.

## Good references
- [Emil Kowalski, You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): frequency decides; keyboard actions never animate; a 180 ms dropdown beats a 400 ms one; Raycast as the example of no open animation.
- [NN/g, The role of animation and motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/): feedback, state change, navigation metaphors, attention as the legitimate purposes.
- [NN/g, Executing UX animations: duration and motion characteristics](https://www.nngroup.com/articles/animation-duration/): 100–500 ms range, frequent animations shorter and subtler.
- [Rauno Freiberg, Invisible details of interaction design](https://rauno.me/craft/interaction-design): frequent actions skip animation; motion should come from a metaphor the user already holds.
- [Linear](https://linear.app/): almost no motion on high-frequency paths (issue list, keyboard navigation), short fades on menus.
- [Material 3, motion overview](https://m3.material.io/styles/motion/overview/how-it-works): motion should be informative, focused and expressive only where it helps.

## Bad references
- [Material 3 Expressive research write-up](https://design.google/library/expressive-material-design-google-research): the caveat section reports that replacing familiar patterns with novel ones hurt usability. The lesson is the caveat, not the expressive look.
- Template landing-page kits used inside apps (for example the "fade up on scroll" presets in many no-code site builders): every section animates in, every visit, whatever the content.
- Productivity apps that animate the open of a shortcut-driven palette for 300 ms or more, which makes the fastest path feel slow.

## Accessibility
- Honour `prefers-reduced-motion` on every row of the table (see `mfound-reduced-motion-vestibular.md`).
- Anything that starts by itself, moves for more than 5 s and sits next to other content needs pause, stop or hide (WCAG 2.2.2, Level A).
- Never flash more than 3 times a second (WCAG 2.3.1).
- Motion must never be the only signal: a state change also shows in text, icon or colour.

## Motion / interaction (if relevant)
The frequency row sets the duration band; `mfound-durations-and-easing.md` picks the exact token and curve inside it.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-dur-instant` | 0 ms | keyboard-driven and 100+/day actions |
| `--motion-dur-micro` | 100 ms | press, hover, toggle feedback |
| `--motion-dur-short` | 150 ms | menus, dropdowns, tooltips (tens a day) |
| `--motion-dur-medium` | 240 ms | dialogs, sheets, toasts, route changes |
| `--motion-dur-long` | 400 ms | large surfaces; ceiling for UI chrome |
| expressive ceiling | 600 ms | rare moments only |
| first response | ≤ 100 ms | any input |

## Implementation sketch
```ts
// Decide motion from frequency and input source, once, in one place.
export type MotionJob = 'feedback' | 'continuity' | 'orientation' | 'attention' | 'delight';
export type Frequency = 'constant' | 'frequent' | 'occasional' | 'rare';

export interface MotionBudget { durationMs: number; allowMove: boolean; allowBounce: boolean }

const BUDGET: Record<Frequency, MotionBudget> = {
  constant: { durationMs: 0, allowMove: false, allowBounce: false },
  frequent: { durationMs: 150, allowMove: false, allowBounce: false },
  occasional: { durationMs: 240, allowMove: true, allowBounce: false },
  rare: { durationMs: 400, allowMove: true, allowBounce: true },
};

export function motionBudget(job: MotionJob, frequency: Frequency, fromKeyboard: boolean): MotionBudget {
  if (fromKeyboard) return BUDGET.constant;
  if (job === 'delight' && frequency !== 'rare') return BUDGET.constant;
  return BUDGET[frequency];
}
```
```css
/* A menu opened from the keyboard skips its animation. */
.menu { transition: opacity var(--motion-dur-short) var(--motion-ease-enter), scale var(--motion-dur-short) var(--motion-ease-enter); }
.menu[data-opened-by="keyboard"] { transition: none; }
```

## Checklist
- [ ] Every animation has a named job; "decoration" is not one.
- [ ] Keyboard-triggered actions and 100+/day actions don't animate.
- [ ] First visible response within 100 ms of input.
- [ ] At most one expressive moment per flow, never on a repeated path.
- [ ] Nothing moves without a cause (no idle loops, no autoplay).
- [ ] Every enter has a matching exit that shows where the thing went.

## Sources
- https://emilkowal.ski/ui/you-dont-need-animations
- https://www.nngroup.com/articles/animation-purpose-ux/
- https://www.nngroup.com/articles/animation-duration/
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://web.dev/articles/rail
- https://rauno.me/craft/interaction-design
- https://m3.material.io/styles/motion/overview/how-it-works
- https://design.google/library/expressive-material-design-google-research
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- https://github.com/anthropics/skills/tree/main/skills/frontend-design (idea: same fade on every section as a generated-UI tell)
