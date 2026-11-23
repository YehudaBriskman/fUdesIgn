---
name: ux-foundations
description: The evidence under UI decisions, for when a design argument cites a law, a bias, a number or "best practice". Use when someone justifies a choice with Hick's, Fitts's, Miller's, Zeigarnik, loss aversion, choice overload, the F-pattern, the Doherty threshold or "five users is enough"; when deciding defaults, nudges, consent, cancellation or pricing flows (choice architecture and dark patterns); when planning a usability test, card sort or tree test; when writing labels, errors and empty states; or when you must grade a claim before putting it in a pattern or a PR. Trigger on "is this a real law", "how many users do I need", "is this a dark pattern", "write the copy for", "what does the research say".
---

# UX foundations

Not UI rules: the evidence behind them. Each pattern grades what a claim really shows (strong, established, heuristic, contested), what it does not show, and what a builder should do instead. Pattern files live in `references/patterns/<prefix>-<name>.md`; the index is `references/INDEX.md`.

- **Prefixes:** `uxcog` (cognition and perception), `uxeth` (choice architecture and ethics), `uxres` (research methods and evidence), `uxwrt` (writing).
- **Applies the evidence in:** dashboard-ui (`ref-ux-laws-evidence-map.md` is the 20-law table), forms-ui, mobile-ui, motion-ui, components-ui. Read the owning plugin's pattern for the rule; read this plugin for whether the rule's justification holds.

## Workflow

1. **Name the claim.** Quote the sentence that cites a law, number or study.
2. **Grade it** with `uxres-evidence-grading.md`: primary or secondary source, replication, boundary conditions, vendor or research.
3. **Find the testable rule.** If the claim has none ("Occam's razor", "Pareto"), do not use it as a reason; keep the rule it was attached to only if it stands alone.
4. **Choose the method** when evidence is missing: five-user task test or tree test (`uxres-*`), not argument.
5. **Check the ethics.** Any default, nudge, consent or cancel flow goes through `uxeth-choice-architecture-and-dark-patterns.md`.
6. **Label what is left** as "house default" in the pattern you are editing.

## Non-negotiables

- Never cite "7±2" as a UI limit, Zeigarnik as a reason to nag, or a number you did not fetch.
- A default must pass: would the user choose this if asked plainly, and is leaving as easy as joining?
- A usability test of five users is a discovery tool for one user group, iterated, not proof.
- Copy is part of the interface: user need first, plain words, one idea per message.
- If two sources disagree, say so in the pattern and name which you followed.
