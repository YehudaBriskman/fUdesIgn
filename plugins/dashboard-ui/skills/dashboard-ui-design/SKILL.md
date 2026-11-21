---
name: dashboard-ui-design
description: Design, build or review data-heavy dashboard UIs (analytics, finance/money, valuation, SaaS admin, ops/monitoring) with researched rules and concrete tokens. Use when creating or restyling a dashboard, KPI cards, data tables, charts, filters, tabs, popovers/dialogs, loading and empty states, number and money formatting, colour and dark mode, soft/rounded styling, motion and progressive or interactive UI, or when asked to critique, audit or score a dashboard's design. Trigger even if the word "dashboard" is not used: "admin panel", "analytics page", "metrics view", "stats cards", "portfolio screen", "make this data page look better".
---

# Dashboard UI design

A research-backed playbook for dashboards: 84 pattern files, each with rules, anti-patterns, good and bad references, accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiable rules and the quick decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. The prefixes are `found` (foundations), `color` and `style` (visual style), `data` (data display), `chart`, `comp` (components), `motion`, `prog` (progressive loading), and `ref` (product teardowns, anti-patterns, review rubric).
- **Starter tokens:** `assets/tokens.css`, with light and dark themes. Every value in it comes from the pattern files.

## Workflow

Follow these steps in order. Each one names the files to open.

1. **Classify the view and the domain.**
   - Pick the product profile (finance, analytics, ops, consumer…) for density, theme, motion budget and palette (`found-domain-profiles.md`), and skim the matching teardown: `ref-fintech-money-dashboards.md`, `ref-investing-valuation-tools.md`, `ref-devops-dashboards.md` or `ref-product-analytics-dashboards.md`.
   - Decide whether it is operational (live, glanceable), analytical (explore, compare) or strategic (periodic, summary). This sets the refresh rate, density, interactivity and time scale. Never mix them on one screen. See `found-dashboard-types.md`.
   - Write down the user's first question. The answer to it becomes the single focal point (`found-visual-hierarchy.md`).
2. **Structure.**
   - Overview → filter → details on demand (`found-overview-filter-details.md`).
   - Use the inverted KPI pyramid: the answer top-leading, trends in the middle, detail at the bottom (`found-scanning-kpi-pyramid.md`).
   - Use a 12-column grid and a 4px spacing scale (`found-layout-grid-spacing.md`). Reflow by priority, with container queries per widget (`found-responsive-reflow.md`).
   - Disclose progressively, at most 2 levels deep (`found-progressive-disclosure.md`).
   - Design against worst-case data from the start: long names, huge or negative numbers, empties, 1,000 rows (`found-worst-case-data.md`).
3. **Pick containers and data display.**
   - Choose the container: table for many comparable records, list for find-and-open, cards for a few heterogeneous summaries (`data-cards-vs-tables-vs-lists.md`).
   - For KPI cards, numbers, deltas, tables, timestamps and units, see the `data-*` files. Verdicts, ratings and scores: `data-verdict-rating-badges.md`.
   - Model inputs and "why this number": `comp-assumption-editor-panel.md` and `found-methodology-explainability.md`. Labels, errors and empty-state words: `found-microcopy-for-data.md`.
4. **Pick charts by the question, never by looks** (`chart-choose-by-question.md`). Then apply the matching `chart-*` file, plus `chart-honesty-chartjunk.md` and `chart-accessibility.md` every time.
   - Finance: `chart-financial-price-value.md` (price vs value, waterfall, football field), `chart-scenario-comparison.md` (bear/base/bull, weights), `chart-tornado-sensitivity.md` (tornado, sensitivity grid, distributions).
   - Canvas or WebGL charts: `chart-canvas-accessibility.md`.
5. **Colour and style.**
   - Build in neutrals first, then add colour only where it means something (`color-minimal-usage.md`).
   - Use three token layers: ramps → roles → components (`color-system-architecture.md`).
   - Keep status colours and money colours separate (`color-semantic-status.md`).
   - Contrast: `color-contrast-rules.md`. Dark mode: `color-dark-mode.md`. One theme per page, never mixed light and dark regions (`style-theme-consistency.md`).
   - For a soft, rounded look, see `style-radius-scale.md`, `style-shadows-and-borders.md` and `style-surfaces-and-layering.md`.
6. **Components and interaction.**
   - Buttons, tabs, overlays, filters, date ranges, ⌘K, inline edit, sliders, app shell, alerts and keyboard: see the `comp-*` files.
   - For which overlay to use, start at `comp-overlay-choice.md`. First-run notices and disclaimers must not cover content (`comp-onboarding-and-notices.md`).
7. **Motion and progressive UI.**
   - Motion tokens: `motion-principles-and-tokens.md`. Reduced motion: `motion-reduced-motion.md`.
   - Loading: `prog-loading-states.md` and `prog-stale-while-revalidate.md`.
   - Interactive exploration: `motion-linked-exploration.md` and `motion-what-if-live-recompute.md`.
   - Performance budgets: `prog-perceived-performance-thresholds.md`.
   - Drag, sheets and flicks: `motion-drag-and-spring-physics.md`; for general product motion use the `motion-ui` plugin.
8. **Review before calling it done.**
   - If the `design-review` plugin is installed, run its static lint and rendered gate first; both must pass at zero.
   - Run `ref-dashboard-anti-patterns.md` (10 failures, each mapped to rubric IDs) and check for the generated-dashboard tells in `ref-ai-default-tells.md`.
   - Score `ref-design-review-rubric.md`: 39 checks in 8 sections, 0–2 each, scored per page type. Ship at 80% or more with no must-check at 0 on any page type.
   - Report the score per page type and each failed check with its ID, evidence and fix.

## Non-negotiables

Break one of these only with a written reason.

**Hierarchy and layout**
1. Each view has one primary focal point that answers the first question; size, contrast and position are spent there first.
2. Every number has context: a unit, a period, and a comparison, target or trend. A bare number is not a KPI.
3. Group with space before lines or boxes. Gaps inside a group are smaller than gaps between groups. Use cards for self-contained units, not as default wrapping.
4. Each KPI row has at most about 4–6 cards, all with the same anatomy and size. More KPIs means you need a table or a second view.

**Numbers and money**

5. Use one locale-aware formatting layer (`Intl.NumberFormat`), with a true minus sign (U+2212, normalised via `formatToParts`) and the same precision within a column or row. Keep the exact value one hover or focus away.
6. Use tabular lining figures for every number. Right-align numeric columns and their headers.
7. Show a delta as sign, then magnitude, then basis, in text ("+4.2% vs last 30 days"). Arrow and colour are redundant cues. Colour encodes *desirability* per metric (up can be bad), never direction alone. Write "pp" for percentage points.
8. Never show missing as zero. Use a muted em dash with visually hidden "No data".

**Colour**

9. Build in neutrals first, then add colour only to encode meaning. Aim for 10% or less of the screen in saturated colour.
10. Text contrast is 4.5:1 or more (3:1 for large text). Component boundaries, focus rings, icons and chart marks are 3:1 or more. Colour is never the only cue.
11. Money positive/negative tokens are separate from success/danger. Red-up markets exist (CN, JP, TW, KR), so offer red-up, green-up and colour-blind-safe blue/orange settings.
12. Categorical palettes use 6 colours by preference, 8 as a hard cap, then "Other" or small multiples. Use sequential for ordered data and diverging only when the midpoint means something.

**Charts**

13. Choose by the comparison (change, rank, part-to-whole, distribution, deviation, correlation, flow, magnitude). Bars and areas start at zero; lines may crop. No 3D, no dual axes for general readers, and no pies with more than about 5 slices. Replace gauges with bullet graphs.
14. Label directly at line ends and on marks. Use a legend only when labels can't fit. Tooltips are detail on demand, and hover, focus and touch all trigger them.
15. Every chart has a takeaway title, a one-line text summary and a table view, and uses non-colour encodings.
16. Show uncertainty as labelled ranges ("80% of simulated outcomes"), never a single confident line.

**Components**

17. One primary button per region. Targets are 24×24 CSS px or more (44 px on touch). A busy button keeps its size and label and uses `aria-disabled`, not `disabled`.
18. Tabs switch content, segmented controls switch the mode of one view, and pills filter. View state (tab, filters, range, sort) lives in the URL.
19. Use the least intrusive overlay. Use a modal `<dialog>` only for a decision needed now. Errors appear inline next to their cause and persist; toasts are a last resort and never the only record.
20. Date ranges: lead with presets, show the resolved absolute dates and timezone, and make the comparison period explicit and length-matched.
21. Everything works by keyboard with a visible focus ring. Composite widgets are one Tab stop with arrow keys inside. Single-key shortcuts can be turned off (WCAG 2.1.4).

**Motion and loading**

22. Motion only explains a change. Most UI motion is 300 ms or less; use the token durations of 100/150/240/400 ms. Don't animate actions users repeat dozens of times a day.
23. Under `prefers-reduced-motion: reduce`, remove movement but keep opacity and colour feedback. Never use a global `0.01ms` reset.
24. Loading depends on the wait:
    - under 1 s, nothing (delay indicators about 200 ms);
    - 1–10 s on first load, a layout-accurate skeleton;
    - one panel refreshing, in-place;
    - over 10 s, determinate progress with cancel.
25. Once a panel has shown data, never blank it again. Keep the stale data visible with "Updating…" and a last-updated time (stale-while-revalidate).
26. Budgets: visual acknowledgement under 100 ms, INP 200 ms or less at p75, result or clear progress under 1 s. What-if sliders recompute while dragging, or show a provisional value and commit on release.
27. Every region has explicit loading, empty, zero-results, error and partial states, each scoped to the smallest region that has it.

**Trust**

28. State data freshness ("Updated 4 min ago", with the exact time and timezone on hover) and the source and definition next to the numbers they qualify.
29. No celebratory decoration on money actions: a 2024 Massachusetts consent order requires Robinhood to permanently cease confetti and other celebratory imagery tied to trading frequency. Keep judgement glyphs and verdicts traceable to the raw numbers in one step.

## Decision tables

**Container** (`data-cards-vs-tables-vs-lists.md`)

| Task | Use |
|---|---|
| Compare many records across attributes | Table: sticky header and first column, sortable, 20–50 rows per page |
| Find and open one item | List rows: leading visual, label, one meta line, one trailing value |
| A few heterogeneous summaries | Cards |

**Overlay** (`comp-overlay-choice.md`)

| Need | Use |
|---|---|
| Blocking decision now | Modal `<dialog>` |
| Contextual detail or small form, page still usable | Popover (popover API, Baseline; anchor positioning with an `@supports` fallback to fixed placement) |
| Large secondary task beside the context | Drawer or sheet |
| Low-stakes, recoverable confirmation | Toast, persistent if it holds an action |
| Name or hint of an icon or term | Tooltip, never essential content (`popover="hint"` and `interestfor` are not Baseline: feature-detect) |

**Loading** (`prog-loading-states.md`)

| Expected wait | Treatment |
|---|---|
| Under 1 s | Nothing; delay any indicator about 200 ms, keep it visible at least 300–500 ms once shown |
| 1–10 s, first load | Layout-accurate skeleton |
| One panel refreshing | Keep the data, show "Updating…" (`prog-stale-while-revalidate.md`) |
| Over 10 s | Determinate progress with cancel, can continue in the background |

**Chart by question** (`chart-choose-by-question.md`)

| Question | Chart |
|---|---|
| Change over time | Line (area if the total matters) |
| Rank | Sorted bars, horizontal for long labels |
| Part to whole | Stacked bar, or a donut with 2–5 parts |
| Distribution | Histogram or strip plot |
| Uncertainty | Fan or band chart, labelled interval |
| Deviation from a reference | Diverging bars |
| Correlation | Scatter |
| Bridge between two values | Waterfall |
| Methods compared to price | Football field |
| Value vs target | Bullet graph |
| Trend next to a number | Sparkline |

## Token defaults

Full set in `assets/tokens.css`.

| Group | Defaults |
|---|---|
| Spacing (4px base) | 4, 8, 12, 16, 24, 32, 48, 64 |
| Radius | xs 4 · sm 6 · md 8 · lg 12 (cards) · xl 16 (dialogs) · full. Nested radius: inner = max(2px, outer − padding − border) |
| Type | hero 2rem/600 · kpi 1.875rem/600 · tracking −0.02em on hero and KPI · title 1.25rem · heading 1rem/600 · body 0.875rem · meta 0.75rem · prose 65ch or less · `tabular-nums` |
| Motion | 0 instant · 100 micro · 150 short · 240 medium · 400 long · 600–900 staged data. Standard ease `cubic-bezier(0.2,0,0.38,0.9)`, emphasized `cubic-bezier(0.2,0,0,1)`. Stagger 20–40 ms, 300 ms max total |
| Elevation | 4 levels: flat, raised, popover, dialog. Layered, hue-tinted shadows; borders for in-flow surfaces |
| Surfaces | canvas, surface, surface-2, surface-3, sunken; plus on-accent, scrim, hover, zebra, chart grid/axis/ink roles. Density: `[data-density="compact"]`. Dark mode uses dark grey (not black), lighter means higher, desaturated accents |
| KPI card | padding 16–24 · radius 12 · value 1.875rem/600 · sparkline 120×28 · 4–6 per row at 1280px or wider, 2 at 768px or wider, 1 below |
| Grid | 4 columns under 600px · 8 at 600–1055px · 12 at 1056px or wider · gutter 16 (24 at 1312px or wider) |

## How to apply this skill

- **When building:**
  - Start from `assets/tokens.css` (or map its roles onto the project's existing tokens), then follow the workflow.
  - Prefer platform features: `<dialog>`, the popover API, anchor positioning, container queries, View Transitions (fetch first, then transition), `:has()`. The implementation sketch in each pattern shows the feature detection and fallback.
  - Never use the TypeScript `any` type in sketches or code.
- **When reviewing:** collect evidence (screenshots, DOM, CSS), then run the anti-pattern catalog and the rubric. Report a table of the check, the score, the evidence and the fix, ordered by severity.
- **When the project has a design system:** its tokens win, so map them onto these roles and flag the gaps instead of overriding them.
- **When rules conflict:** accessibility and honesty (contrast, non-colour cues, zero baselines, states) beat aesthetics. Evidence beats taste: `ref-ux-research-findings.md` lists what is actually evidenced.
