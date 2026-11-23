# Cognitive biases in UI decisions: graded, with the safe use of each

> A bias name is a hypothesis, not a proof: cite it at the grade its evidence earns, test it on your own screen, and never use it to justify a choice the user would not approve.

**Category:** Foundations · **Applies to:** design reviews, pricing and plan pages, option lists, defaults, progress indicators, A/B test rationale · **Priority:** should

## When to use / when not
- **Use** when a comment says "anchoring", "loss aversion", "choice overload" or "the default effect" as the reason for a design.
- **Use** to decide what to test instead of what to assert.
- **Not** a list of tricks. Where a bias is real, the question is still whether the user would choose this if asked plainly (`uxeth-choice-architecture-and-dark-patterns.md`).
- Grades: **Strong** = field or large-sample evidence for the specific effect. **Conditional** = real in some settings, near zero on average. **Contested** = a primary-source review argues the general claim is unsupported. **Unverified** = no primary was read for this note, so no numbers.

## Rules (do)
- **Cite the grade with the bias.** "Default effect (Strong for enrolment and consent)" is a claim; "because loss aversion" is not.
- **Label every number** as sourced (with the paper) or "house default".
- **Test, don't assert.** If a decision rests on a bias, run a five-person task test or an A/B test with a harm guardrail before shipping.
- **Prefer the plain mechanism.** "People keep defaults" and "fewer options are quicker to scan" are testable. "Losses loom larger" in a button label is not.

| Bias | Grade | What the primary says | Safe UI use | Not safe |
|---|---|---|---|---|
| Default effect | Strong for enrolment and consent | Johnson and Goldstein 2003: revealed donation consent 42% opt-in vs 82% opt-out (161 online respondents; the opt-out rate did not differ significantly from a neutral condition at 79%). Country registry comparison is correlational. | Preselect the choice most users would make when asked, for safe settings. | Preselecting consent, data sharing or paid add-ons. |
| Choice overload | Conditional | Scheibehenne, Greifeneder and Todd 2010: 63 conditions from 50 experiments (N = 5,036), "mean effect size of virtually zero but considerable variance". Preconditions emerged, no sufficient conditions. | Group and filter long lists because scanning cost is real. | Cutting options on the claim that "more choice reduces conversion". |
| Loss aversion | Contested | Gal and Rucker 2018 review the evidence and conclude it "does not support that losses, on balance, tend to be any more impactful than gains". | Describe a real consequence plainly (what will be lost if you delete). | Loss-framed pressure copy ("Don't miss out") as a proven lever. |
| Anchoring | Unverified here | Tversky and Kahneman 1974 (Science 185:1124-1131) is the standard citation; its text was not retrievable for this note. | Show a real list price or previous price only when it was genuinely charged. | Inflated "was" prices (a false-belief dark pattern per the FTC report). |
| Goal gradient | Strong in loyalty field data | Kivetz, Urminsky and Zheng 2006: 949 completed ten-stamp cards; interpurchase time fell about 20% (0.7 days) from first to last purchase. | Show real progress toward a real goal. | Fake progress bars. |
| Endowed progress | Strong in one field study | Nunes and Dreze 2006: 300 car-wash cards; redemption 34% with two pre-filled stamps (10 stamps, 8 needed) vs 19% with none (8 needed). | Start a multi-step flow with already-done steps that are really done. | Pre-filling a meter with progress the user did not make. |
| Social proof | Unverified here | No primary read for this note. | Show real counts and real, attributable reviews. | Invented numbers, "N people viewing" (FTC false-belief list). |

### Reading the table
- **Default effect** is the one to use deliberately. It is also the one that most needs the ethics test, because it works whether or not the default serves the user.
- **Choice overload** has a near-zero mean and wide variance. The conditions that make it appear (no clear preference, no dominant option, low familiarity) come from a secondary summary, not the paper, so treat them as hypotheses to test with your users.
- **Loss aversion** as "people dislike losing twice as much as they like gaining" is the popular form; the review above contests the general claim. The narrow, well-supported part is that status-quo inertia exists, which is the default effect again.
- **Goal gradient and endowed progress** come from loyalty cards, not software. They justify honest progress indicators, not a specific percentage.

### How a UI builder uses this
1. When you write "because of <bias>" in a PR or ADR, add the grade from the table and the safe-use row. If the grade is Contested or Unverified, add the test you ran instead.
2. For any option list longer than about 7, do not argue overload; add search, grouping or a recommended item and measure time to select on five users. The 7 is a house default, not a threshold from the meta-analysis.
3. For a price or plan page, show the real price and the real comparison. If a struck-through price was never charged, remove it.
4. For progress and onboarding, show only progress the user has actually made or that the system has actually done.
5. Run the two-question test from `uxeth-choice-architecture-and-dark-patterns.md` on each bias-based choice.

## Anti-patterns (don't)
- Citing "Hick's, Miller's or loss aversion" as the sole reason for a layout; grade the claim first (`uxres-evidence-grading.md`).
- Quoting the "jam study" or "twice as painful" as settled fact.
- Using urgency copy because "loss aversion works".
- Reducing a plan list to three tiers on the strength of overload alone.
- Treating a lab or loyalty-card effect size as a prediction for your product.

## Good references
- [Gal and Rucker 2018, The Loss of Loss Aversion (J Consumer Psychology 28:497-516)](https://doi.org/10.1002/jcpy.1047) — abstract read via Crossref: a review that finds current evidence does not support losses outweighing gains on balance, and discusses why the belief persists.
- [Scheibehenne, Greifeneder and Todd 2010 (J Consumer Research 37:409-425)](https://doi.org/10.1086/651235) — the figures above, read from the open-access record.
- [Johnson and Goldstein 2003](https://www.dangoldstein.com/papers/DefaultsScience.pdf) — the default-effect figures.
- [FTC, Bringing Dark Patterns to Light](https://www.ftc.gov/reports/bringing-dark-patterns-light) — what happens when biases are exploited.

## Bad references
- Popular listicles of "cognitive biases for designers" that give percentages with no paper.
- Citing a bias from a blog without reading the study; this note's own Unverified rows are the warning.

## Accessibility
- Bias-based nudges (defaults, urgency, progress) land hardest on people with cognitive load or limited literacy. Plain language, no timers without extend (WCAG 2.2.1) and no hidden decline protect them.
- Progress indicators need a text equivalent ("Step 2 of 4"), not only a bar.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Option-list review trigger | more than 7 items | add search or grouping; house default |
| Evidence label | Strong, Conditional, Contested, Unverified | every bias citation |
| Numbers | sourced or "house default" | review comments |

## Implementation sketch
```html
<!-- Honest progress: state is text first, the bar is decoration -->
<p id="p">Step 2 of 4</p>
<progress max="4" value="2" aria-labelledby="p"></progress>
```

## Checklist
- [ ] Each bias citation carries a grade.
- [ ] Contested and Unverified biases are not the sole rationale.
- [ ] Every number is sourced or marked house default.
- [ ] Defaults and anchors pass the "would the user choose this if asked?" test.
- [ ] Progress and social-proof elements show real data.
- [ ] A test, not the bias name, backs the shipped decision.

## Related repo patterns
`ref-ux-laws-evidence-map.md` (laws, rows 19 and 20), `found-cognitive-load-and-recall.md`, `finput-choice-controls.md`, `fflow-multi-step-and-save-progress.md` (progress), `mksect-pricing-tables.md`, `mksect-social-proof.md`, `found-progressive-disclosure.md`, `uxeth-choice-architecture-and-dark-patterns.md`.

## Sources
- Gal and Rucker 2018, https://doi.org/10.1002/jcpy.1047 (abstract via Crossref API)
- Scheibehenne, Greifeneder and Todd 2010, https://doi.org/10.1086/651235 ; open record https://archive-ouverte.unige.ch/unige:76440 (abstract-level figures only)
- Tversky and Kahneman 1974, https://doi.org/10.1126/science.185.4157.1124 (bibliographic record only)
- Johnson and Goldstein 2003, https://www.dangoldstein.com/papers/DefaultsScience.pdf
- Kivetz, Urminsky and Zheng 2006, https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf
- Nunes and Dreze 2006, J Consumer Research 32(4):504-512, DOI 10.1086/500480
- FTC staff report 2022, https://www.ftc.gov/reports/bringing-dark-patterns-light
- Choice-overload preconditions: https://en.wikipedia.org/wiki/Overchoice (secondary)
