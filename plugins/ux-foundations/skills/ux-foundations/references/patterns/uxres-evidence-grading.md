# Evidence grading for design claims

> Before a design rule leans on a study, law or vendor spec, find the primary source, say what it measured and under what conditions, give the claim a grade, and label every number you could not verify "house default".

**Category:** Foundations · **Applies to:** pattern writing, design reviews, ADRs, critique comments, any "research shows" or "per Material/Apple" argument · **Priority:** must

## When to use / when not
- **Use** whenever a rule is justified by a named law, a psychology effect, a statistic, or a design-system spec.
- **Use** before writing a number into a token table or a checklist.
- **Not** a literature review method. It is a five-minute triage that decides how much weight a claim may carry.
- **Not** a reason to drop good rules. A rule can stand on a task test or a labelled house default with no study behind it.

## Rules (do)
- **Prefer primary to secondary.** Primary: the paper, the spec, the standard text, the vendor's own token file. Secondary: Wikipedia, Laws of UX, blog summaries, slide decks. Use secondary sources to find primaries, not as the last stop. In this repo, "per Wikipedia" on a figure is a to-do, not a citation.
- **Use these grades, in the repo's wording** (from `ref-ux-laws-evidence-map.md`): **Strong** (experimental evidence, replicated or field-tested), **Established** (long-standing perception or HCI finding, qualitative), **Heuristic** (expert rule of thumb, no UI experiments), **Contested** (replication or UI-transfer doubts), **Folklore** (no UI evidence).
- **Grade the claim you are making, not the effect's fame.** Von Restorff is Established in memory research; "emphasise one button and users click it" is a different claim with a weaker grade (the contested effects are graded one by one in `uxcog-cognitive-biases-graded.md`).
- **Ask five questions of every claim:**
  1. *Primary source?* Can you name journal, year and DOI, or the spec URL?
  2. *Replication?* Has it held up? Look for a meta-analysis or a replication study.
  3. *Effect size and sample?* A number with n beats an adjective. Small n and one population limit the grade.
  4. *Boundary conditions?* Under what circumstances does the effect appear? Does your UI meet them?
  5. *Transfer?* Was it tested on interfaces, or is moving it from a lab list or a loyalty card to your screen your extrapolation?
- **Separate vendor from research.** A design system's token is a decision, not a finding. "Material says 400 ms" proves Material chose it. It is a fine house default; it is not evidence about users.
- **Label unverifiable numbers "house default".** If you cannot reach the source, either drop the number or label it. Never keep a number "because everyone quotes it".
- **Record the grade where the rule lives.** Put the grade next to the claim, in a review comment or a pattern's Sources, with the date you checked.
- **Re-grade when evidence moves.** Contested findings change; date the check.
- **Prefer a task test to a law.** A five-person task test on your screen outweighs any transferred effect.

### How to check a claim in 5 minutes
1. **Minute 1:** write the claim as one sentence with its number. Name the exact thing it says (the effect, the size, the population).
2. **Minute 2:** search for the primary: the paper title plus "doi", or the spec's own URL. Crossref and Europe PMC give abstracts when publisher pages refuse (this session's psychology checks relied on them).
3. **Minute 3:** read the abstract for sample, effect, and the author's own hedges. Copy the numbers from the abstract or body, not from a summary.
4. **Minute 4:** search "<effect> replication" and "<effect> meta-analysis".
5. **Minute 5:** write the grade, the source URL, and the sentence you can safely state. If the primary was unreachable, say so and label the number.

## Worked cases (this session's real examples)
| Claim | What the checks found | Grade and safe sentence |
|---|---|---|
| **Zeigarnik: unfinished tasks are remembered better** | Ghibellini and Meier (2025, *Humanities and Social Sciences Communications* 12(1), DOI 10.1057/s41599-025-05000-w; abstract read via Crossref) meta-analysed it and "found no memory advantage for unfinished tasks but found a general tendency to resume tasks" (the Ovsiankina effect). The abstract says the Zeigarnik effect "lacks universal validity". The repo's earlier wording gave the date as late 2025; the record says 1 July 2025. | **Contested** for recall. Safe: "unfinished tasks pull people back to them (Ovsiankina); recall advantage is not supported". Show resumable state; never cite Zeigarnik for nagging. |
| **Miller's 7±2 as a limit on menu or list items** | Miller (1956, *Psychological Review* 63(2):81-97) is a rough estimate about chunks, not UI items. Cowan (2001, *Behavioral and Brain Sciences* 24(1):87-114) argues a central limit of about four chunks (range three to five), observable only when rehearsal and chunking are blocked (four boundary conditions in his abstract). A visible UI list is not that situation. | Load theory is strong; 7±2 and 4 as **UI item caps are Contested**. Cap by task and scanning tests, not by 7 or 4. |
| **Material "emphasized" easing is `cubic-bezier(0.2, 0, 0, 1)`** | The repo's motion table had labelled that curve "emphasized". Per the repo's recorded correction, that is Material 3's *standard* curve; M3's emphasized easing is defined as a path (two-segment spline), with `(0.05, 0.7, 0.1, 1)` for emphasized decelerate and `(0.3, 0, 0.8, 0.15)` for emphasized accelerate. | **Vendor spec, mislabelled in the repo.** The value is a fine house default; the label was wrong. Caveat: the M3 page is script-rendered and a direct fetch in this session returned only the title, so these values rest on the repo's earlier record, not a fresh read. Re-check against the M3 token file before quoting. |
| **Kahneman et al. 1993 "peak-end"** | Primary read: 32 men; 22 of 32 (69%) chose to repeat the long trial; among 11 who felt little relief the split was 6:5 for the short trial. | **Strong in lab, small:** one all-male n = 32 study, mechanism supported inside the study, no UI test. |
| **Defaults (Johnson and Goldstein 2003)** | 161-person online experiment: 42% opt-in vs 82% opt-out. Country comparison is correlational and mixes cultural factors; consent is not donation. | **Strong for defaults mattering, causal claim for organ donation not**; state the experiment and the correlation separately. |

## Anti-patterns (don't)
- **Law as veto or decoration** ("violates Miller's law", five laws name-dropped, none tested).
- **Quoting from memory.** Percentages, thresholds and dates you cannot trace.
- **Citing a finding that later replication weakened as if current.** Zeigarnik is the model case.
- **Treating vendor tokens as research.**
- **One source, secondary.** Wikipedia or a law-card site as the sole basis of a threshold.
- **Ignoring population.** Lab undergraduates, a coffee shop loyalty card and a banking dashboard are different settings.
- **Grade inflation by repetition.** A claim repeated by ten decks has one source.

## Good references
- [Ghibellini and Meier 2025 (Crossref record)](https://api.crossref.org/works/10.1057/s41599-025-05000-w): a meta-analysis abstract that states both what failed (recall) and what held (resumption).
- [Cowan 2001 (Crossref record)](https://api.crossref.org/works/10.1017/S0140525X01003922) and [Europe PMC abstract](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1017/S0140525X01003922&resultType=core&format=json): the author states the boundary conditions of the limit.
- [Miller 1956 (Crossref record)](https://api.crossref.org/works/10.1037/h0043158): the primary citation behind a famous misquote.
- [Laws of UX](https://lawsofux.com/): short secondary statements, useful for locating primaries.
- `ref-ux-laws-evidence-map.md`: the graded table this method comes from.

## Bad references
- A deck listing "Hick, Fitts, Miller, Zeigarnik" as proof of a layout: no test, scope or grade.
- A blog quoting "7±2 items per menu": Miller never said it about menus.
- A design-token table headed "Material emphasized" holding a single cubic-bezier: a vendor label applied to a value it does not name.

## Accessibility
- Evidence about "typical users" does not cover different vision, motor or memory needs. A rule backed by a Strong study still fails if it fails WCAG. Check the effect's population before applying it to everyone.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Grades | Strong, Established, Heuristic, Contested, Folklore | label every cited claim |
| Unverified number | "house default" | mandatory label |
| Source classes | primary, secondary, vendor spec | record next to each claim |
| Time box | 5 minutes | triage before citing |
| Date | checked on YYYY-MM-DD | re-grade when stale |

## Implementation sketch
A claim record to paste into a pattern's Sources or a review thread:
```text
Claim: Unfinished tasks are remembered better (Zeigarnik).
Primary: Ghibellini and Meier 2025, doi 10.1057/s41599-025-05000-w (abstract read 2026-11-23).
Finding: no recall advantage; general tendency to resume.
Grade: Contested (recall). Rule kept: show resumable state. Not cited for: nagging.
```

## How a UI builder uses this
- Before a number goes into a token table, run the five questions; if the source is unreachable, label "house default".
- In reviews, cite the rule and its test, with the grade; send back "because law X" with no test.
- Treat vendor tokens as decisions; name them as such.
- Applied in: `ref-ux-laws-evidence-map.md`, `ref-ux-research-findings.md`, `found-cognitive-load-and-recall.md`, `mfound-durations-and-easing.md`, `ref-dashboard-anti-patterns.md`, `mkfound-cta-and-conversion.md`, `fflow-completion-and-end-states.md`.

## Checklist
- [ ] Each cited claim names its primary source or says it could not reach it.
- [ ] Each claim carries one grade from the five.
- [ ] Replication or meta-analysis was searched for, and the result recorded.
- [ ] Sample size and population are stated next to any number.
- [ ] Boundary conditions are compared with the UI the rule is applied to.
- [ ] Vendor values are marked as vendor decisions.
- [ ] Unverified numbers are labelled house default or removed.
- [ ] Test: a colleague can follow the record to the source in under two minutes.

## Sources
- https://api.crossref.org/works/10.1057/s41599-025-05000-w (Ghibellini and Meier 2025; read in the session report)
- https://api.crossref.org/works/10.1017/S0140525X01003922 and https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1017/S0140525X01003922&resultType=core&format=json (Cowan 2001)
- https://api.crossref.org/works/10.1037/h0043158 (Miller 1956)
- https://lawsofux.com/ (secondary)
- Kahneman et al. 1993 and Johnson and Goldstein 2003: figures from the session's psychology report (`r2-psych.md`, primary PDFs read there); not re-fetched for this file.
- Repo: `ref-ux-laws-evidence-map.md`, `ref-ux-research-findings.md`, `found-cognitive-load-and-recall.md`, `mfound-durations-and-easing.md`, `ref-dashboard-anti-patterns.md`, `mkfound-cta-and-conversion.md`, `fflow-completion-and-end-states.md`
