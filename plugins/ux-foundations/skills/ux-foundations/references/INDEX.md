# Pattern index

8 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

## Cognition and perception: biases graded, reading patterns, Fitts and Hick, response time (`uxcog-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Cognitive biases in UI decisions: graded, with the safe use of each](patterns/uxcog-cognitive-biases-graded.md) | should | A bias name is a hypothesis, not a proof: cite it at the grade its evidence earns, test it on your own screen, and never use it to justify a choice the user would not approve. |
| [Fitts' and Hick's laws: the right formulas and the common misuse](patterns/uxcog-fitts-and-hick-correct-use.md) | should | Fitts' law is a strong pointing model that justifies bigger, nearer targets; Hick's law only holds for learned, equally likely choices and is a weak reason to cut a menu, so cite each only inside its limits. |
| [Reading and scanning patterns: F, layer-cake, spotted, and the Z folklore](patterns/uxcog-reading-and-scanning-patterns.md) | should | People scan, not read; the F-shape is what they do when a page gives no strong cues, so design the cues (front-loaded headings, short blocks, one clear lead) instead of designing for an F or a Z. |

## Ethics: choice architecture and dark patterns (`uxeth-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Choice architecture and dark patterns: nudge, or manipulation?](patterns/uxeth-choice-architecture-and-dark-patterns.md) | must | Every default, order, label and exit path is a decision made for the user; make it one they would approve of if asked plainly, and make leaving as easy as entering. |

## Research methods: usability testing, information scent and IA, grading evidence (`uxres-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Evidence grading for design claims](patterns/uxres-evidence-grading.md) | must | Before a design rule leans on a study, law or vendor spec, find the primary source, say what it measured and under what conditions, give the claim a grade, and label every number you could not verify "house default". |
| [Information scent and IA methods](patterns/uxres-information-scent-and-ia-methods.md) | should | Every link, tab and result row is a promise about what is behind it: write labels and snippets that let people predict correctly, and pick the research method that matches the question (card sort to generate a structure, tree test to evaluate one). |
| [Usability testing: five users and beyond](patterns/uxres-usability-testing-five-users-and-beyond.md) | should | Run small moderated task tests, several rounds of about five users each, fix between rounds, and use bigger samples only for the methods that need them. |

## Writing: UX writing and content design (`uxwrt-`)

| Pattern | Priority | Rule |
|---|---|---|
| [UX writing and content design](patterns/uxwrt-ux-writing-and-content-design.md) | must | Start from what the user is trying to do, write the shortest text that is specific and honest about what happens next, and review copy with the same gates as code. |
