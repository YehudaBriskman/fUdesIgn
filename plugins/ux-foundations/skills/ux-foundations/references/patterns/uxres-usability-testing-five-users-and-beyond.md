# Usability testing: five users and beyond

> Run small moderated task tests, several rounds of about five users each, fix between rounds, and use bigger samples only for the methods that need them.

**Category:** Foundations · **Applies to:** any screen, flow or component where "is it usable" is a claim; design reviews, release gates, ADRs · **Priority:** should

## When to use / when not
- **Use** when a rubric or review says "prefer a task test" and you must actually run one. It tests whether real people complete real tasks on your screen; a law, a heuristic or an opinion only predicts.
- **Use** before a launch of a new flow, after a redesign of navigation or forms, and whenever two reviewers disagree and neither has watched a user.
- **Qualitative test (this pattern)** finds problems and explains why. It does not give reliable percentages.
- **Not** for a rate you will quote ("87% succeed"): that is a quantitative study, at least 20 users per NN/g, with its own analysis.
- **Not** a substitute for accessibility testing with assistive technology; see `atest-manual-test-plan.md`.

## Rules (do)
### What the five-user model says
- **Know the formula.** NN/g (Nielsen, 2000) gives problems found = N(1 - (1 - L)^n), with N the total problems, n the users, L the share one user finds. NN/g uses L = 31% as a typical value averaged over many projects. It is an average, not a promise for your product.
- **Read the curve, not the slogan.** Derived from the formula at L = 31% (our arithmetic, except where NN/g states it):

| Users | Share of problems found |
|---|---|
| 1 | 31% (NN/g: "almost a third") |
| 3 | about 67% (derived) |
| 5 | about 84%, rounded to 85% in NN/g's text |
| 10 | about 98% (derived) |

- **Five is where the cost-benefit peaks, not where learning stops.** Return diminishes after the first users; that is why the advice is to spend the budget on more rounds, not more people per round.

### How to apply it
- **Test about 5 users per round, then fix, then test again.** NN/g's example is three studies of five, not one study of fifteen: a fix can fail or create a new problem, and later rounds reach deeper issues such as information architecture and task flow.
- **Never rely on one user.** NN/g puts three as the minimum to see a range of behaviour.
- **Test each distinct audience separately.** The model assumes comparable users. For two distinct groups NN/g recommends 3-4 per group; for three or more, 3 per group. Groups with overlapping experience need fewer (NN/g's example: 3 each of novice, intermediate and expert, 9 in total).
- **Match count to method** (NN/g, 2012): qualitative 5; very low-overhead projects as few as 2 per round; consulting engagements around 8; quantitative at least 20; card sorting at least 15 per group; eyetracking 39 for stable heatmaps. Most research should be the qualitative kind.
- **Pair testing with inspection.** Before recruiting, walk the screen against Nielsen's ten heuristics (published 1994, last reviewed 2024): visibility of system status; match with the real world; user control and freedom; consistency and standards; error prevention; recognition rather than recall; flexibility and efficiency; aesthetic and minimalist design; help users recognise, diagnose and recover from errors; help and documentation. Fix the obvious, so participants spend time on the non-obvious.

### One-page test script (house default)
This script is a house default assembled for this repo; the counts and wording are ours, not NN/g's.

1. **Prepare (before).** Write 3-5 tasks as goals, not instructions ("You need the March invoice for the Acme account"), never naming a button or menu label. Define the success state for each in one sentence. Pilot with a colleague.
2. **Open (2 min).** "We are testing the screen, not you. There are no wrong answers. Please think aloud. I may not answer questions during the task; that is deliberate." Ask for recording consent. Do not demo the product.
3. **Warm-up task (easy).** Settles the participant and tests the setup.
4. **Tasks (about 30 min total).** Read each task aloud and hand it over in writing. Stay silent. If the participant is stuck for a long time, ask "what are you looking for?" or "what did you expect to happen?", not "did you see the button?". Note, per task: success, partial or fail; where they hesitated or backtracked; what they said.
5. **Close (5 min).** "What was the most confusing part?" "What would you change first?" Thank, stop recording.
6. **Debrief (right after, with observers).** Each observer lists problems alone first, then merge; this stops the loudest voice fixing the list.

### Success criteria and severity (house default)
- **Per task:** success = reached the defined state unaided; partial = reached it after a prompt or a detour of your own definition; fail = gave up or ended in a wrong state. Write the definitions before the first session.
- **Severity scale** (ours, adapt freely):

| Level | Meaning | Action |
|---|---|---|
| 4 Blocker | Participant could not complete a core task | Fix before release |
| 3 Major | Completed only after long detour or help | Fix this round |
| 2 Minor | Noticed, slowed, recovered alone | Schedule |
| 1 Cosmetic | Commented but no effect on the task | Log only |

- **Rank by how many of the five hit it times the level**; one participant hitting a blocker is still a blocker. A problem seen once at level 1-2 is a note, not a finding.
- **Report counts honestly:** "3 of 5 failed task 2", never "60% fail". With five people a percentage is decoration.

## Anti-patterns (don't)
- **One big test of 15-20 people** instead of three rounds of five with fixes between.
- **Testing colleagues** or only fans; they know the product, so the test finds nothing.
- **Leading tasks** that name the label ("click Billing and find..."). Tree-testing guidance gives the same rule: do not use the exact category label in the task.
- **Quoting percentages from five users**, or from the 85% figure as a guarantee.
- **Pooling different audiences** into one group of five.
- **Asking opinions instead of watching**: "would you use this?" is not a task.
- **Treating the five-user rule as a reason to skip testing** or to stop after one round.

## Good references
- [NN/g, Why You Only Need to Test with 5 Users](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) — states the model, the 31% average, three rounds of five, three-user minimum and distinct-group counts.
- [NN/g, How Many Test Users in a Usability Study?](https://www.nngroup.com/articles/how-many-test-users/) — the method-by-method numbers, and the honest reminder that most research is qualitative.
- [NN/g, 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — the inspection checklist to run first.

## Bad references
- **"Five users find 85% of problems, so five is enough."** Drops the average-across-projects, comparable-users and iterate caveats that the source itself states.
- **A single-round test used to quote success percentages.** Needs the quantitative sample, at least 20 per NN/g.

## Accessibility
- Recruit participants who use assistive technology as a separate group, not as one seat in the five; their problems differ and a screen-reader user is not "comparable" to a mouse user. Method detail: `atest-manual-test-plan.md`.
- Make the test itself accessible: written tasks in a readable size, no timed pressure beyond the task, consent and recording explained plainly.

## Motion / interaction (if relevant)
- Record time to first meaningful response and visible waits; see `prog-perceived-performance-thresholds.md`. A hesitation after a click is a finding even when the task succeeds.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Users per round | 5 (3-4 per distinct group) | Qualitative test; sourced, NN/g |
| Minimum users | 3 | Seeing the range of behaviour; sourced |
| Quantitative minimum | 20 | Only if you will quote rates; sourced |
| Tasks per session | 3-5 plus a warm-up | House default |
| Session length | about 45 min | House default |
| Severity levels | 1-4 | House default |

## Implementation sketch
A findings log that forces the honest-count habit; a plain table is enough.

```html
<table>
  <caption>Round 2 findings, 5 participants, ranked</caption>
  <thead><tr><th>Finding</th><th>Task</th><th>Seen by</th><th>Severity</th></tr></thead>
  <tbody>
    <tr><td>Export hidden under overflow menu</td><td>T3</td><td>4 of 5</td><td>3 Major</td></tr>
  </tbody>
</table>
```

## How a UI builder uses this
- Before calling a flow done, run one round: five people from the real audience, three to five goal-worded tasks, silent observation.
- Fix the findings, then run a second round on the fixed build; do not quote percentages.
- When a rubric says "prefer a task test", link the finding log in the review comment.

**Tests the reader can run**
- Open the task list: does any task name a button or menu label? If yes, rewrite it as a goal.
- Open the report: does any number have a denominator under 20 and a percent sign? Replace it with "x of n".
- Count the audiences in the product; is each tested by 3 or more people? If not, the round is incomplete.

Applied by: `ref-design-review-rubric.md`, `ref-ux-laws-evidence-map.md`, `fvalid-timing-and-inline-errors.md`, `atest-manual-test-plan.md`, `found-cognitive-load-and-recall.md`, and the sibling `uxres-information-scent-and-ia-methods.md` for navigation tests.

## Checklist
- [ ] Tasks are goals, none name a UI label, and success is defined before session one.
- [ ] About 5 users per round and per distinct audience (3-4 if groups overlap).
- [ ] Heuristic walk-through done before recruiting.
- [ ] Moderator silent; think-aloud requested; no demo.
- [ ] Findings merged from independent observer lists, severity-ranked.
- [ ] Report uses "x of n", never percentages, for n under 20.
- [ ] Fixes made and a second round planned.

## Sources
- https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ (fetched; Nielsen, 2000; Nielsen and Landauer 1993 primary not fetched, so not cited)
- https://www.nngroup.com/articles/how-many-test-users/ (fetched)
- https://www.nngroup.com/articles/ten-usability-heuristics/ (fetched; published 24 Apr 1994, reviewed 30 Jan 2024)
- https://www.nngroup.com/articles/tree-testing/ (fetched; task wording rule)
- Repo: `ref-design-review-rubric.md`, `ref-ux-laws-evidence-map.md`, `fvalid-timing-and-inline-errors.md`, `atest-manual-test-plan.md`, `found-cognitive-load-and-recall.md`, `prog-perceived-performance-thresholds.md`, `uxres-information-scent-and-ia-methods.md`
