# Dashboard UX research findings: NN/g, Baymard, Few

> Base dashboard decisions on the few findings that are actually evidenced: position and length beat angle and area, every measure needs context, waits have hard thresholds, and consistency beats variety.

**Category:** Reference gallery / research · **Applies to:** chart choice, KPI design, loading states, layout, card dashboards, dialogs · **Priority:** must

## When to use / when not
- Use this when a design choice needs a cited reason, for example in a review comment, an ADR, or a disagreement over gauges or spinners.
- These are research summaries, not visual specs. Pair them with the rubric (ref-design-review-rubric.md) for scoring.
- Caveat: Few's white paper is from 2005, Baymard's card study is from 2018 and covers e-commerce account dashboards, and NN/g's response-time limits date from 1993. They are durable, but cite them with dates.

## Rules (do)
### Stephen Few, *Information Dashboard Design* (2006) and the "Common Pitfalls" white paper (2005)
- **Definition:** a dashboard is information needed to achieve objectives, "consolidated and arranged on a single screen so it can be monitored at a glance".
- **Single screen:** "simultaneity of vision" matters. Short-term memory holds only a few chunks, so scrolling or tabbing between metrics breaks comparison (pitfall 1).
- **Context:** every measure needs comparative measures (target, history) plus a qualitative state (pitfall 2).
- **Precision:** $3,848,306 or $3.8M, not $3,848,305.93. Time to the second is rarely needed (pitfall 3).
- **Direct measures:** show the variance (−10%) instead of making users subtract actual from budget. Percentages compare across departments of different scale (pitfall 4).
- **Right medium:** if you need the labels to read a pie, use a table or a bar chart (pitfall 5).
- **Repeat what works:** using the same chart type many times is fine, and consistency lets users reuse one perceptual strategy (pitfall 6).
- **Accurate encoding:** bars must start at zero. A truncated axis made revenue look 4× costs when it was under 2× (pitfall 8).
- **Arrangement:** the most important data goes in the most prominent place (top-left), and related data sits adjacent (pitfall 9).
- **Highlight sparingly:** non-data elements (logo, nav) are subdued. Not all data is equally important (pitfall 10).
- **No decoration:** no faux control panels, LEDs or switches (pitfall 11).
- **Colour:** subdued and neutral by default, with bright colour only to highlight. Colour that means nothing still costs attention (pitfall 12).
- **Aesthetics matter:** an ugly display hurts use, but beauty comes from displaying the data well, not from ornament (pitfall 13).
- **Bullet graph:** Few designed it to replace gauges. It has a featured bar about 1/3 of the container thickness, a comparative tick, and 2–5 (ideally 3) qualitative bands in one hue's intensities (2: 35/10%, 3: 40/25/10%, 4: 50/35/20/10%, 5: 50/35/20/10/3% black).

### Nielsen Norman Group
- **Dashboard types:** operational (time-sensitive, continuously changing) vs analytical (less time-critical). Both should be single-screen and at-a-glance, needing minimal interaction.
- **Preattentive ranking:** length and 2D position are best for quantities. Area and angle are hard. Sort bars ascending or descending.
- **Colour:** don't use colour alone for magnitude or order. Colour combined with shape is more noticeable than either alone. About 8% of men and 0.5% of women have colour-vision deficiency.
- **Chart types:** avoid pies and donuts except for one overwhelming share. Treemaps are "not appropriate for simple, actionable dashboards". Avoid 3D. Replace gauges with bullet charts.
- **Response time limits:** 0.1 s feels instant, 1 s keeps flow, 10 s holds attention.
- **Progress indicators:** use one for anything over about 1 s. Looped spinners suit 2–10 s. Use percent-done plus a time estimate for 10 s or more, and offer stop for long jobs. Never use a static "Loading…". In a study, users with an indicator were willing to wait about **3× longer**.
- **Skeleton screens:** use them for full-page loads under about 10 s, and not for sub-1 s loads. Spinners are fine for single modules such as a dashboard card. Avoid frame-only skeletons. A skeleton is not a substitute for performance work.
- **Modals:** use them for critical warnings, required missing input or wizards. Overuse trains users to dismiss them, and they hide the content needed for decisions. Inline errors beat modal errors.
- **Numbers:** use numerals ("23", not "twenty-three"). For big values use digits plus a magnitude word ("24 billion"). Explain unusual units, since users didn't understand "1 TB".

### Baymard Institute (account dashboards, 2018 large-scale testing)
- Card dashboards work **only** with high consistency: the same font size and style, backgrounds, icons, button size and link styling across cards.
- Card headers carry "information scent". Make them highly visible with size, weight and whitespace.
- Prefer links to features over showing the underlying data in each card (show "Manage addresses", not the address). Show a metric inline only when analytics prove users check it often.
- Images draw strong attention, so use them sparingly. Ads inside the dashboard read as "tricky" and hurt trust.
- Good examples: REI and Crutchfield. The plain look was fine because of uniform styling and strong headers, and the most recent order spans 3 columns as a deliberate hero. Bad examples: Best Buy (inconsistent cards) and B&H (image-heavy).

### Corroborating design systems
- **IBM Carbon:** presentation dashboards rank data by importance, follow the F-pattern, give the most important data the most contrast and area, limit metrics, and keep one colour per data set throughout. Exploration dashboards keep consistent layout and legend positions and link related charts so a filter updates all of them.
- **Grafana and Datadog:** document the goal and owner, use variables over copies, and set column minimums (see ref-devops-dashboards.md).

## Anti-patterns (don't)
- Citing "a dashboard should never scroll" as absolute. Few's single-screen rule is for monitoring dashboards. Exploration and report pages may scroll, but the at-a-glance summary should not.
- Believing skeletons always feel faster. The evidence is mixed: Viget's test found the reverse, and NN/g recommends them only for full-page loads.
- Treating NN/g's 4.5% CVD prevalence as a niche case. In an audience of 1,000 professionals that is about 40 to 80 people (more in male-skewed finance and engineering teams).

## Good references
- [Few, Common Pitfalls in Dashboard Design (2005)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)
- [Few, Bullet Graph Design Specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf)
- [Few, Information Dashboard Design, O'Reilly 2006 / Analytics Press 2013](https://www.perceptualedge.com/library.php)
- [NN/g: Dashboards: making charts and graphs easier to understand](https://www.nngroup.com/articles/dashboards-preattentive/)
- [NN/g: Progress indicators make a slow system less insufferable](https://www.nngroup.com/articles/progress-indicators/)
- [NN/g: Skeleton screens 101](https://www.nngroup.com/articles/skeleton-screens/)
- [NN/g: Modal and nonmodal dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
- [NN/g: Show numbers as numerals](https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/)
- [NN/g: Response time topic](https://www.nngroup.com/topic/response-time/)
- [Baymard: Dashboard cards must be highly consistent](https://baymard.com/blog/cards-dashboard-layout)
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)

## Bad references
- Few's figures 2–16 (vendor dashboards circa 2005) remain the canonical gallery of failures: fragmented radio-button selection, unlabeled gauge ticks, 10-digit precision, a pie needing labels, 3D bright bars, a truncated bar axis, a logo in the prime position, and an LED-styled control panel.
- Baymard's Best Buy and B&H account dashboards (2018 versions), described in the article above.

## Accessibility
- Research-backed minimums: no colour-only encoding (NN/g, WCAG 1.4.1), loaders with semantic `<progress>`, and inline errors instead of modal errors.
- CVD prevalence (NN/g: 8% of men, 0.5% of women; Few cites 10% and 1%) justifies a CVD-safe default palette, not just an optional one.

## Motion / interaction
- Instant feedback (under 100 ms) on every click, even when the result takes longer (NN/g response-time limits).
- Indicator choice by expected wait: none under 1 s, spinner or skeleton for 1–10 s, determinate progress with an estimate and Cancel over 10 s.

## Tokens and values
| Finding | Value | Source |
|---|---|---|
| Instant / flow / attention limits | 0.1 s / 1 s / 10 s | NN/g |
| Spinner window | 2–10 s | NN/g |
| Willingness to wait with indicator | ≈ 3× | NN/g (UNL study) |
| Bullet graph bands | 2–5 (ideal 3) | Few |
| Featured bar thickness | ≈ 1/3 of container | Few |
| CVD prevalence | ≈ 8% men, 0.5% women | NN/g |
| Card hero exception | 1 card spanning 3 columns | Baymard (Crutchfield) |

## Implementation sketch
```ts
type Wait = "none" | "spinner" | "skeleton" | "determinate";
export function indicatorFor(expectedMs: number, fullPage: boolean): Wait {
  if (expectedMs < 1000) return "none";              // NN/g: <1 s, indicator distracts
  if (expectedMs <= 10_000) return fullPage ? "skeleton" : "spinner";
  return "determinate";                               // >10 s: % done + time estimate + cancel
}
```
```html
<!-- Module-level wait, semantic and labelled -->
<progress class="loading-spinner" aria-label="Loading revenue chart"></progress>
```

## Checklist
- [ ] The monitoring summary fits one viewport with no scroll or tabs needed to compare its KPIs.
- [ ] Quantities are encoded by length or position. No angle or area for precise comparison.
- [ ] Every KPI has a comparison and a qualitative state.
- [ ] Precision matches the task (2–3 significant digits on KPIs).
- [ ] The loading indicator type matches the expected wait.
- [ ] Card internals are uniform and headers prominent.
- [ ] Modals are reserved for critical or irreversible actions.

## Sources
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/modal-nonmodal-dialog/
- https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/
- https://www.nngroup.com/topic/response-time/
- https://baymard.com/blog/cards-dashboard-layout
- https://carbondesignsystem.com/data-visualization/dashboards/
- modern-web-guidance: guides/ui-components/spinner.md, guides/ui-components/progress.md, guides/ui-components/dialog.md
