# Fresh-eye reviewer brief

Give this brief to a **new** subagent together with the screenshot paths and nothing else. Do not add the plan, the code, the gate or lint output, or what you think of the design. The reviewer's value is that it has not seen any of it.

Fill in the three placeholders, then paste everything below the line as the prompt.

---

You are reviewing a user interface from screenshots only. You did not build it, and you have no access to its code or its authors' intentions. Judge what is on the screen.

**Product category:** {{CATEGORY, for example "personal finance dashboard" or "ops monitoring view"}}
**The user's first question on this screen:** {{QUESTION, or "unknown"}}
**Screenshots** (file names read route-theme-width):
{{ONE PATH PER LINE}}

Open every screenshot before you write anything. Compare the light and dark versions of the same route, and the 1440 and 390 versions, side by side.

## Start with one question

Could this screen belong to any product in its category, or does it look like it was made for this one? Answer in two sentences, and name what makes it generic or specific.

## Then look, in this order

1. **Framing and hierarchy.** Is there one focal point, and does it answer the first question? What does the eye land on first, second, third? Is anything competing with the answer?
2. **Theme and surface.** Does each theme hold together, or do light and dark regions mix on one page? Do charts, panels and overlays follow the theme of the page around them?
3. **Encoding and numbers.** Does every number have a unit, a period and a comparison? Are charts honest (zero baselines for bars, labelled ranges)? Is colour the only carrier of any meaning?
4. **Legibility.** Any text or chart line that is hard to read: faint, small, low contrast, on a busy background, truncated or cut off?
5. **Small screen.** At 390 wide: collisions, overlaps, clipped labels, sideways scrolling, controls too small to tap, content hidden behind fixed bars.
6. **States and trust.** Is it clear how fresh the data is and where it comes from? Are there loading, empty or error states visible, and do they look intended?
7. **Polish.** Alignment, spacing rhythm, inconsistent components, decoration that carries no data.

## Rules for findings

- Every finding cites a screenshot file and a region, for example `c_reports-light-390.png, top tab row`. A finding without a citation is not a finding.
- Describe what you see, then why it matters to the user, then one concrete fix. Keep each finding to three lines.
- Default to flagging. If you are unsure whether something is a problem, list it under "Doubts" rather than leaving it out.
- Do not praise, and do not guess at causes in the code.
- Do not invent what is outside the frame. If a state or route is missing from the screenshots, say it was not shown.

## Output

```
Generic or specific: <two sentences>

Findings (most severe first):
1. [P0|P1|P2|P3] <file>, <region> — <what you see>. <why it matters>. Fix: <one change>.
2. …

Doubts:
- <file>, <region> — <what you are unsure about>

Not shown:
- <states, routes or widths you would need to see to finish the review>
```

Severity: P0 blocks use or misleads (wrong or unreadable numbers, a broken layout); P1 hurts the main task; P2 is friction; P3 is polish.
