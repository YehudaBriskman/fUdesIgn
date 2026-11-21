# Design review handover: {{product}} — {{date}}

Copy this file to `DESIGN-REVIEW.md` beside the review output and fill in every section. Leave nothing blank: write "none" or "not checked" instead. The record exists so that nobody, including the agent that wrote it, can claim a check that never ran.

## Scope

| Item | Value |
|---|---|
| App and commit | {{URL, branch, commit SHA}} |
| View type (dashboards) | {{operational / analytical / strategic, or n/a}} |
| User's first question | {{one sentence, or unknown}} |
| Routes captured | {{list}} |
| Themes | {{light, dark}} (applied via {{prefers-color-scheme / data-theme / storage key}}) |
| Viewports | {{1440x900, 390x844}} |
| States shown | {{default only / empty / error / slow / …}} |
| Evidence folder | {{path to screenshots, facts.json, gate.json, lint.json}} |

## Static lint

Command: `{{exact command}}`

{{Paste the last line of the output, then each error with file:line and what was done about it (fixed / waived with reason).}}

## Rendered gate

Command: `{{exact command}}`

{{Paste the summary table from gate.md as it is, including the PASS or FAIL line.}}

| Finding (ID, route, theme, width, selector) | Response |
|---|---|
| {{DR-…}} | {{fixed in <commit> / waived: <reason> / open: <issue link>}} |

Waivers added in this review (`data-design-review-ignore` or `design-review-ignore`): {{list with reasons, or none}}

## Fresh-eye review

Reviewer given: {{N}} screenshots and the brief only. {{Yes / No — if no, say what else it saw.}}

Generic or specific (reviewer's words): {{quote}}

| # | Reviewer finding (with citation) | Response |
|---|---|---|
| 1 | {{P1 file, region — finding}} | {{fixed / won't fix: reason / disputed: evidence}} |

## Rubric score (dashboards only)

| View | Score | Must-checks at 0 | Band |
|---|---|---|---|
| {{route}} | {{x / y = z%}} | {{IDs or none}} | {{ship / ship with tracked fixes / redesign}} |

Minimum {{z%}}, median {{z%}}. Failed checks with evidence and fix:

| Check | Score | Evidence | Fix |
|---|---|---|---|

## Not checked

List everything a reader might assume was covered but was not. At least:
- {{routes or views not captured}}
- {{states not reached: loading, empty, zero results, error, partial, stale, slow (> 10 s)}}
- {{interactions not exercised: keyboard beyond the gate's Tab walk, tooltips on focus, URL state, drag, what-if sliders}}
- {{200% zoom and text spacing, screen reader pass, real touch devices, Windows high contrast}}
- {{rubric checks marked not checked, by ID}}
- {{gate limits that applied: SVG chart text contrast, text over images, canvas animation}}

## Result

{{One paragraph: ship / ship with tracked fixes / do not ship, and the three fixes that matter most, in order.}}
