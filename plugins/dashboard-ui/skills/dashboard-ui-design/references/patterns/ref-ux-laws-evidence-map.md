# UX laws evidence map: what to cite and what not to

> Cite a named law only at the grade its evidence earns; where it has no testable UI rule, say so and point to the repo pattern that does the real work.

**Category:** Reference gallery / research · **Applies to:** design reviews, ADRs, critique comments, rubric scoring, any "because law X" argument · **Priority:** should

## When to use / when not
- **Use** when a review comment or decision cites "Hick's, Miller's, Zeigarnik..." and you must decide whether the citation holds.
- **Use** to find which repo pattern turns a law into a checkable rule.
- **Not** a spec: each row links to the pattern that carries the numbers.
- Grades: **Strong** = experimental evidence, replicated or field-tested. **Established** = long-standing perception or HCI finding, qualitative. **Heuristic** = expert rule of thumb, no UI experiments. **Contested** = replication or UI-transfer doubts. **Folklore** = no UI evidence.

## Rules (do)
- **Cite the rule, not the law.** A law name is a label for a pattern rule that stands on its own measurements (spacing, contrast, task test). If the rule is only justified by the name, drop the rule or find a real source.
- **Label every number from these laws** as sourced or "house default".
- **Prefer a task test over a law.** A law predicts; a five-person task test on your screen shows.
- **Warn on misuse.** Where a row says "not a UI rule", a review comment citing it should be sent back for a real reason.

| # | Law | Grade | Testable UI rule, or "not a UI rule" | Repo pattern |
|---|---|---|---|---|
| 1 | Aesthetic-usability | Established, perception effect | Judge usability with tasks, not impressions. Polish raises tolerance and hides problems (Kurosu and Kashimura 1995: 26 ATM layouts, 252 people, beauty tracked perceived ease more than actual ease). | `ref-ux-research-findings.md`, `ref-design-review-rubric.md` |
| 2 | Proximity | Established (Gestalt, NN/g) | Inner gap smaller than outer gap; NN/g shows 12 fields as 3 chunks of 4. The ratio itself is a house default. | `found-gestalt-grouping.md`, `found-layout-grid-spacing.md` |
| 3 | Von Restorff | Established in memory research; UI benefit is folklore | One emphasised item per region; not colour or motion alone; do not mimic an ad. | `found-visual-hierarchy.md`, `comp-button-hierarchy.md` |
| 4 | Zeigarnik | Contested (late-2025 meta-analysis found no recall advantage, per Wikipedia) | Not a UI rule. Never cite it for nagging. Show resumable state instead. | `ref-dashboard-anti-patterns.md`, forms-ui `fflow-multi-step-and-save-progress.md` |
| 5 | Tesler (conservation of complexity) | Heuristic | Complexity moves rather than vanishes; decide who carries it (system or user). | design-system `dsfound-conservation-of-complexity.md` |
| 6 | Prägnanz | Established, descriptive, too vague to test | Framing only: simplest reading wins; fewer cues, aligned edges. | `found-gestalt-grouping.md` |
| 7 | Serial position | Strong for lab recall lists; UI transfer is an extrapolation | Heuristic only: tie-break equal-priority items to the ends. Not evidence for a nav layout. | `found-visual-hierarchy.md` |
| 8 | Progressive disclosure | Established, NN/g empirical backing | Frequent options first, defer the rest, at most two levels, label the transition. | `found-progressive-disclosure.md` |
| 9 | Common region | Established (Palmer 1992; NN/g) | A boundary groups only for a shared scope; delete the border test. | `found-gestalt-grouping.md` |
| 10 | Goal-gradient | Moderate; human evidence mostly loyalty and field settings | Show real progress only; no fake or stalling bars. Do not quote percentages unless the primary paper is fetched. | forms-ui `fflow-multi-step-and-save-progress.md`, `prog-loading-states.md` |
| 11 | Similarity | Established, qualitative | Same role, same look; links look distinct from text. No thresholds. | `found-gestalt-grouping.md` |
| 12 | Recognition over recall | Established heuristic (Nielsen H6, 1994) | Visible or searchable options; recents; no hover-only primary actions. | `found-cognitive-load-and-recall.md`, `comp-icons-and-labels.md` |
| 13 | Pareto (80/20) | Folklore as a design law | Not a UI rule. Prioritise by measured usage, not an assumed split. | `found-cognitive-load-and-recall.md`, `found-density-modes.md` |
| 14 | Occam's razor | Heuristic, not testable alone | Not a UI rule. Remove only what is not load-bearing; it can justify stripping needed context. | design-system `dsfound-conservation-of-complexity.md` |
| 15 | Parkinson's law | Folklore (1955 satirical essay on administration) | Not a UI rule. Its usable piece, short forms and autofill, is covered elsewhere. | forms-ui `finput-types-autocomplete-keyboards.md` |
| 16 | Uniform connectedness | Established, qualitative | A visible link groups; the connector must map to a real flow. Rank against proximity not verified first-hand. | `found-gestalt-grouping.md` |
| 17 | Paradox of the active user | Established HCI observation (Rosson and Carroll 1987), no numbers | Put help in context, keep a findable reference. | `found-cognitive-load-and-recall.md`, `comp-onboarding-and-notices.md` |
| 18 | Cognitive load (incl. Miller 7±2, Cowan 4) | Load theory strong in education; 7±2 and 4 contested as UI limits | Cut extraneous load; chunk by task. 7±2 and 4 are not UI limits. | `found-cognitive-load-and-recall.md` |
| 19 | Default effect | Strong for enrollment and consent (Madrian and Shea, NBER w7682); effect varies with stakes | Test: would the user choose this default if asked? Preselect only safe defaults, never consent or upsell. Dark-pattern risk when the default serves the provider. | forms-ui `finput-choice-controls.md`, marketing-ui `mkfound-cta-and-conversion.md` |
| 20 | Peak-end rule | Strong in lab (Kahneman et al. 1993, cold-water trial); product examples are anecdotal | Do not end a flow on an error or dead end; give the success state a next step. Not an excuse to neglect the middle. | forms-ui flow patterns (success states) |

## Anti-patterns (don't)
- **Law as veto.** "Violates Miller's law" with no test.
- **Law as decoration.** A pattern that name-drops five laws and cites none.
- **Percentages from memory.** Johnson and Goldstein organ-donation rates, Kivetz and Nunes and Dreze figures: not fetched first-hand; do not quote.
- **Zeigarnik, Pareto, Parkinson, Occam as justification** for nagging, feature cuts, deadlines or minimalism.
- **Pretty equals done.** Skipping task testing because the design looks polished.
- **Dark-pattern defaults** defended with the default effect.

## Good references
- [Laws of UX](https://lawsofux.com/): short statements per law, including its own caveat on Miller and an admission that Zeigarnik offers no numbers.
- [NN/g: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): the dated source for recognition over recall.
- [NBER w7682, Madrian and Shea](https://www.nber.org/papers/w7682): the default effect on 401(k) enrollment, a field study rather than a UI test.

## Bad references
- Slide decks that list "Hick, Fitts, Miller, Zeigarnik" as proof of a layout: no test, no scope, no grade.
- Wikipedia as the only source for any figure above: acceptable for a hedged mention, not for a threshold.

## Accessibility
- Laws describe typical perception; they do not cover users with different vision, memory or motor needs. A design that follows a law but fails WCAG still fails.
- Von Restorff emphasis must not rely on colour or motion alone (WCAG 1.4.1, 2.3.3).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Evidence grades | Strong, Established, Heuristic, Contested, Folklore | label in review comments |
| Unsourced numbers | "house default" | mandatory label |
| Citable-as-rule laws | rows 2, 8, 9, 11, 12, 16, 17, 19 | rule backed by its own pattern |
| Do-not-cite-as-rule | rows 4, 13, 14, 15; 7±2 inside 18 | warnings only |

## Implementation sketch
A review comment that cites a law well:
```text
Filters and chart are 12px apart, same as the gap between cards (proximity, found-gestalt-grouping.md).
Rule: inner gap <= 2/3 of outer gap (house default). Fix: 8px inside, 24px between. Verify with the squint test.
```
and badly: "This breaks Miller's law." (no rule, no test, contested law).

## Checklist
- [ ] Each cited law has a grade from this table.
- [ ] Each rule derived from a law stands on a measurement or a labelled house default.
- [ ] No review cites rows 4, 13, 14, 15 or 7±2 as a reason.
- [ ] Defaults are defended by the user-interest test, not the default effect alone.
- [ ] Aesthetic claims are backed by a task test.
- [ ] No figure from an unfetched paper is quoted.

## Sources
- https://lawsofux.com/aesthetic-usability-effect/
- https://lawsofux.com/von-restorff-effect/
- https://lawsofux.com/zeigarnik-effect/
- https://lawsofux.com/serial-position-effect/
- https://lawsofux.com/goal-gradient-effect/
- https://lawsofux.com/law-of-similarity/
- https://lawsofux.com/law-of-uniform-connectedness/
- https://lawsofux.com/pareto-principle/
- https://lawsofux.com/occams-razor/
- https://lawsofux.com/parkinsons-law/
- https://lawsofux.com/paradox-of-the-active-user/
- https://lawsofux.com/cognitive-load/
- https://lawsofux.com/millers-law/
- https://lawsofux.com/peak-end-rule/
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://www.nngroup.com/articles/progressive-disclosure/
- https://www.nngroup.com/articles/common-region/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nber.org/papers/w7682
- https://en.wikipedia.org/wiki/Zeigarnik_effect
- https://en.wikipedia.org/wiki/Aesthetic%E2%80%93usability_effect
- https://en.wikipedia.org/wiki/Principles_of_grouping
- https://en.wikipedia.org/wiki/Serial-position_effect
- https://en.wikipedia.org/wiki/Von_Restorff_effect
