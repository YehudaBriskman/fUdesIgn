---
name: design-review
description: Review, audit, critique or score a running UI or dashboard with evidence instead of opinion. Captures screenshots in light and dark at desktop and phone widths, runs a static lint over the source and a deterministic rendered gate (contrast, mixed themes, overflow, collisions, target size, focus, truncation, alt text, tabular figures, reduced motion, canvas ink), hands only the screenshots to a fresh-eye reviewer, scores dashboards with the dashboard-ui rubric, and writes a handover record of what was and was not checked. Use when asked to "review this UI", "audit the dashboard", "critique this page", "score this design", "is this ready to ship", "check accessibility/contrast/dark mode", or before calling UI work done.
---

# Design review

A review is only as good as its evidence. This skill turns a UI review into six steps that each leave a file behind: screenshots, a lint report, a gate report, a reviewer's list, a rubric score and a handover record. Prose rules leak; checks that run do not.

The scripts live in the plugin root, two folders above this file (`${CLAUDE_PLUGIN_ROOT}/scripts/` when installed as a plugin). Below, `$DR` stands for that root.

- **Detectors and lint rules:** `references/detectors.md` lists every ID, what it measures, its threshold, its false positives and the fix.
- **Reviewer brief:** `references/reviewer-prompt.md`.
- **Handover record:** `references/handover-template.md`.
- **Rubric for dashboards:** the `dashboard-ui` plugin's `references/patterns/ref-design-review-rubric.md` (35 checks).

## Before you start

1. Install once: `npm ci --prefix "$DR"` (it only pulls `playwright-core`; no browser download).
2. A browser: the scripts look for `/usr/bin/chromium`, then Chrome and Chromium in the usual places. Override with `--executable-path` or `DESIGN_REVIEW_CHROME=/path/to/chrome`. With no system browser, run `npx --prefix "$DR" playwright-core install chromium` and set `DESIGN_REVIEW_CHROME=bundled`.
3. The app must be running. Write down its base URL and the primary routes, one per view the user cares about (not every URL in the router).
4. Pick an output folder outside the source tree, for example `design-review-out/`.

## Workflow

Do the steps in order. Do not skip a step silently: if one cannot run, say so in the handover record.

### 1. Capture

```
node "$DR/scripts/capture.mjs" --base http://localhost:3000 --routes /,/reports --out design-review-out
```

- Defaults: themes `light,dark` through `prefers-color-scheme`, viewports `1440x900,390x844`. Change with `--themes` and `--viewports`.
- Apps that theme with an attribute or stored setting: add `--theme-attr data-theme` or `--theme-storage theme`.
- Output: one full-page PNG per route × theme × viewport, plus `facts.json` (per shot: a summary, then raw computed facts such as text colours against their effective background, surface samples, targets, canvases and overflow).
- Look at every screenshot yourself before going on. A blank page, a login wall or an error page means the evidence is void; fix the setup first.

### 2. Static lint

```
node "$DR/scripts/lint-ui.mjs" src/ --json > design-review-out/lint.json
```

- 10 rules over CSS, TS/TSX/JS and HTML (`LU-*`), each with a severity and a link to the pattern that explains it.
- Exit code 1 means at least one error. Warnings do not fail unless `--strict`.
- A line can be waived with a comment naming the rule (`design-review-ignore LU-RAW-HEX: brand logo colour`). Every waiver needs the reason in the comment.

### 3. Rendered gate

```
node "$DR/scripts/gate.mjs" --base http://localhost:3000 --routes /,/reports --out design-review-out
```

- 12 detectors (`DR-*`), each with a stable ID, a threshold and a fix hint. Writes `gate.json` and `gate.md`, and exits 1 on any finding. The gate passes only at zero.
- Every detector targets something that is never intentional. Clear a finding by fixing the cause. Hiding the element the finding points at, or shrinking the route list, is not a fix.
- A real false positive is waived on the element with `data-design-review-ignore="DR-ID"` and a code comment saying why. Report each waiver in the handover.
- Paste the summary table from `gate.md` into the handover record as it is.

### 4. Fresh-eye review

Spawn a reviewer subagent with **only** the screenshots and the brief in `references/reviewer-prompt.md`.

- Do not pass your plan, the code, the gate output, the lint output or your opinion. The point is a read that is not anchored on what you meant to build.
- Fill in the brief's placeholders: the product category, the user's first question if known, and the list of image paths. Nothing else.
- Every finding must cite a screenshot file and a region. Treat findings without a citation as noise.
- Answer every finding in the handover record: fixed, won't fix (with a reason), or disputed (with evidence).

### 5. Score (dashboards)

When the UI is a dashboard or data-heavy view, score `ref-design-review-rubric.md` from the dashboard-ui plugin.

- Score each primary view separately, then report the minimum and the median. Score app-wide checks (theme, navigation, formats) once.
- Use the gate as evidence for the `[DOM]` checks it covers. For example, `DR-CONTRAST` and `DR-CANVAS-INK` feed G4, `DR-FOCUS-VISIBLE` feeds G3, `DR-REDUCED-MOTION` feeds G5, `DR-TABULAR-NUMS` feeds the number checks, and `DR-MIXED-THEME` feeds the dark-mode checks.
- `[VIS]` checks come from the screenshots, and `[INT]` checks need you to interact (Tab walk, throttled network, a failing endpoint). If you did not do the interaction, the check is "not checked", not 2.
- Ship at 80% or more with no must-check at 0.

For a UI that is not a dashboard, skip the score and say so in the handover.

### 6. Handover record

Write `DESIGN-REVIEW.md` next to the output (or in the reply if the user wants no file), from `references/handover-template.md`.

- It lists what was captured (routes, themes, widths), the lint and gate results verbatim, the reviewer's findings with a response to each, the rubric score, the waivers, and **what was not checked**.
- "Not checked" is mandatory. Typical entries: routes not captured, states not reached (empty, error, slow), interactions not exercised, 200% zoom, screen readers, real devices, and every rubric check marked not checked.
- Never claim a check you did not run.

## What the gate cannot see

State these limits when you report, so a pass is not read as more than it is:
- It renders one moment per page: loading, empty, error and slow states need routes or fixtures that show them.
- Contrast over images, video and canvas text is not measured from the DOM. `DR-CANVAS-INK` judges canvas ink from pixels, roughly.
- SVG chart text is not contrast-checked; chart marks are only checked inside canvases.
- Script-driven motion is found only when elements keep moving; canvas animation is invisible to it.
- It knows nothing about hierarchy, honesty of charts, copy or whether the page answers the user's question. That is what steps 4 and 5 are for.

## Sample output (Mosa, live, 2026-11-21)

Gate on four routes of a valuation app, light and dark, at 1440 and 390:

```
FAIL DR-CONTRAST            16
FAIL DR-MIXED-THEME         3
ok   DR-OVERFLOW-X          0
FAIL DR-TEXT-OVERLAP        6
ok   DR-TEXT-CLIPPED        0
FAIL DR-TARGET-SIZE         386
ok   DR-FOCUS-VISIBLE       0
ok   DR-TRUNCATE-NO-TITLE   0
FAIL DR-MEDIA-ALT           64
ok   DR-TABULAR-NUMS        0
ok   DR-REDUCED-MOTION      0
FAIL DR-CANVAS-INK          14
gate: FAIL (489 findings)
```

Excerpts from `gate.md`:

- `DR-MIXED-THEME` `/c/AAPL/summary` light 1440: 13% of the content surface is light while 87% is dark (page emulated as light). Dark: `main.co-panel` (80%).
- `DR-CANVAS-INK` `/c/AAPL/summary` light 1440: the canvas keeps its #121a21 background in light and dark, but only 51% of its ink reaches 3:1 in light vs 72% in dark. The chart palette follows the OS theme instead of its container.
- `DR-CONTRAST` `/c/AAPL/rel` light 1440: "+3% vs median" 2.74:1 (needs 4.5:1), #0f6b5c on #121a22, 9.4px/400.
- `DR-TEXT-OVERLAP` `/c/AAPL/summary` light 390: tab "Relative" overlaps "Financials" by 1.8×15px.

These are the defects a manual rubric pass on the same app missed: a forced-dark panel inside a light page, a chart price line and labels drawn in light-theme colours on that dark panel, and tab labels running together at 390px. The lint on the same app's `src/` reported 36 errors (mostly `LU-DISABLED-BUSY` and `LU-TOFIXED-MONEY`) and 7 warnings.
