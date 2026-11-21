# Dashboard UX research findings: NN/g, Baymard, Few

> Base dashboard decisions on the few findings that are actually evidenced: position and length beat angle and area, every measure needs context, waits have hard thresholds, and consistency beats variety.

**Category:** Reference gallery / research · **Applies to:** chart choice, KPI design, loading states, layout, card dashboards, dialogs · **Priority:** must

## When to use / when not
- Use this when a design choice needs a cited reason, for example in a review comment, an ADR, or a disagreement over gauges or spinners.
- These are research summaries, not visual specs. Pair them with the rubric (ref-design-review-rubric.md) for scoring.
- Caveat: Few's white paper is © 2005 (the edition online is dated February 2006), Baymard's card study is from August 2018 and covers e-commerce account dashboards, NN/g's dashboard article is from 2017, its progress-indicator article from 2014, and its response-time limits date from 1993. They are durable, but cite them with dates.

## Rules (do)
### Stephen Few, *Information Dashboard Design* (2006) and the "Common Pitfalls" white paper (2005/2006)
- **Definition:** a dashboard is the information needed to achieve one or more objectives, "consolidated and arranged on a single screen so the information can be monitored at a glance".
- **Single screen:** "simultaneity of vision" matters. Short-term memory holds only a few chunks, so scrolling or tabbing between metrics breaks comparison (pitfall 1).
- **Context:** every measure needs comparative measures (target, history) plus a qualitative state (pitfall 2).
- **Precision:** $3,848,306 "or perhaps even $3.8M", not $3,848,305.93. Few's example shows four to ten decimal digits and time to the second, both excessive on a dashboard (pitfall 3).
- **Direct measures:** viewers must know "what is being measured and the units". Show the variance (Few: $76,934 actual vs $85,000 budget is better shown as −10%) instead of making users subtract. Percentages compare across departments of different scale (pitfall 4).
- **Right medium:** if you need the labels to read a pie, use a table or a bar chart (pitfall 5).
- **Repeat what works:** using the same chart type many times is fine, and consistency lets users reuse one perceptual strategy (pitfall 6).
- **Accurate encoding:** bars must start at zero. In Few's figure 11 a truncated axis made revenue look "about four times costs" when it was "less than double" (pitfall 8).
- **Arrangement:** the most important data goes in the most prominent place (Few calls the top-left, used for a logo in his example, "prime real estate"), and related data sits adjacent (pitfall 9).
- **Highlight sparingly:** "When everything is visually prominent, nothing stands out." Non-data elements (logo, nav) are subdued (pitfall 10).
- **No decoration:** no faux control panels, LEDs or switches (pitfall 11).
- **Colour:** "keep colors subdued and neutral, except when you are using color to highlight something". Colour on already-labelled bars means nothing, but the brain still searches for a meaning (pitfall 12).
- **Aesthetics matter:** an ugly display hurts use, but beauty comes from displaying the data well, not from ornament (pitfall 13).
- **Bullet graph (Bullet Graph Design Specification):** Few designed it to replace gauges. The featured measure is a 100% black bar "approximately 1/3rd the thickness of its container"; the comparative measure is a short perpendicular line (a second one at 75% black); qualitative ranges are "limited to a maximum of five and ideally to three", drawn as intensities of one hue, darker for poor states: 2 ranges 35/10%, 3 ranges 40/25/10%, 4 ranges 50/35/20/10%, 5 ranges 50/35/20/10/3% black.

### Nielsen Norman Group
- **Dashboard types (Laubheimer, 2017):** operational dashboards "impart critical information quickly to users as they are engaged in time-sensitive tasks"; analytical dashboards prompt "further thought, investigation, research, or analysis".
- **Preattentive ranking:** length and 2D position are best for quantities. Area and angle are hard. Bars are easier to compare when "ordered in an ascending or descending pattern".
- **Colour:** "Color should not be used to communicate information about quantitative values or magnitude." "The combination of color and shape together make for a more noticeable signal than either alone." Up to 4.5% of the population has a colour-vision deficiency, about 8% of men and 0.5% of women.
- **Chart types:** pie charts "should be avoided most of the time", and donuts are even less effective. Treemaps are "not appropriate for simple, actionable dashboards". 3D makes a chart "much more difficult to interpret quickly and accurately". Circular gauges "require a lot of space to communicate little information"; linear bullet charts are "significantly better".
- **Response time limits:** 0.1 s feels instant, 1 s keeps flow, 10 s holds attention.
- **Progress indicators (Sherwin, 2014):** use one "for any action that takes longer than about 1.0 second". Looped animation is "reserved for actions that take between 2-10 seconds". Percent-done indicators are for "10 or more seconds", with an option to stop. Replace static indicators. NN/g reports a University of Nebraska–Lincoln study in which users who saw a looped progress bar "were willing to wait on average 3 times longer" than users who saw none.
- **Skeleton screens (Tankala, 2023):** used "exclusively for full-page loads" with a wait "under 10 seconds"; under 1 s neither skeleton nor spinner is needed. Spinners are "best used on a single module, like a video or a card which is on a dashboard". Frame-only skeletons "should not be used". Skeletons "do not replace performance-optimization efforts".
- **Modals (Fessenden, 2017):** use them for important warnings that prevent or correct critical errors, for information "critical to continuing the current process", or for wizards. Overuse means users "will refuse to give attention to further instances". Don't use them when the decision needs information the modal hides. A form error "should be reported on the page, next to where it occurred".
- **Numbers:** use numerals ("23", not "twenty-three"). For big values use digits plus a magnitude word ("24 billion"). Explain unusual units: "most users couldn't understand phrases like '1 TB'".

### Baymard Institute (account dashboards, Edward Scott, August 2018)
- Card dashboards work **only** with high consistency: the same font size and style, backgrounds, icons, button size and link styling across cards.
- Card headers carry "information scent". Make them highly visible with size, weight and whitespace.
- Prefer links to features over showing the underlying data in each card (show "Manage Your Shipping Addresses", not the address). Show data inline only for frequently used items such as reward points; Baymard says the right choice is site-specific.
- Images draw strong attention and can pull users down the wrong path, so prefer text headers and subtle icons. Avoid ads; if they must appear, de-emphasise them and set them apart from the feature cards.
- Good examples: REI, Crutchfield and Overstock. Uniform styling and visible headers made features quick to find; Crutchfield's most recent order is the first card and spans 3 columns as a deliberate hero. Bad examples: Best Buy (cards varied in font size, background and buttons; Best Buy has since redesigned) and B&H (image-heavy).

### Corroborating design systems
- **IBM Carbon:** presentation dashboards rank data by importance, follow the F-shaped pattern, give the most important data the highest contrast and largest area, "limit the number of metrics", and use consistent colours per data set. Exploration dashboards keep layout and legend positions consistent, "do not switch measurement systems", and link related charts so a filter or zoom updates all of them.
- **Grafana and Datadog:** document the goal and owner, use template variables instead of copies, and set column minimums (see ref-devops-dashboards.md).

## Anti-patterns (don't)
- Citing "a dashboard should never scroll" as absolute. Few's single-screen rule is for monitoring dashboards. Exploration and report pages may scroll, but the at-a-glance summary should not.
- Believing skeletons always feel faster. The evidence is mixed: Viget's 2017 test reported skeletons felt slower than a spinner (see prog-loading-states.md), and NN/g recommends them only for full-page loads.
- Treating NN/g's "up to 4.5%" CVD prevalence as a niche case. In an audience of 1,000 professionals that is about 45 people at an even gender split, and up to about 80 in an all-male team (8%).

## Good references
- [Few, Common Pitfalls in Dashboard Design (2005/2006)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)
- [Few, Bullet Graph Design Specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf)
- [Few, Information Dashboard Design, O'Reilly 2006 / Analytics Press 2013](https://www.perceptualedge.com/library.php)
- [NN/g: Dashboards: making charts and graphs easier to understand (Laubheimer, 2017)](https://www.nngroup.com/articles/dashboards-preattentive/)
- [NN/g: Progress indicators make a slow system less insufferable (Sherwin, 2014)](https://www.nngroup.com/articles/progress-indicators/)
- [NN/g: Skeleton screens 101 (Tankala, 2023)](https://www.nngroup.com/articles/skeleton-screens/)
- [NN/g: Modal and nonmodal dialogs (Fessenden, 2017)](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
- [NN/g: Show numbers as numerals](https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/)
- [NN/g: Response time topic](https://www.nngroup.com/topic/response-time/)
- [Baymard: Dashboard cards must be highly consistent (2018)](https://baymard.com/blog/cards-dashboard-layout)
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)

## Bad references
- Few's figures 2–16 (vendor dashboards circa 2005) remain the canonical gallery of failures: fragmented radio-button selection, unlabeled gauge ticks, 10-digit precision, a pie needing labels, 3D bright bars, a truncated bar axis, a logo in the prime position, and an LED-styled control panel.
- Baymard's Best Buy and B&H account dashboards (2018 versions), described in the article above.

## Accessibility
- Research-backed minimums: no colour-only encoding (NN/g, WCAG 1.4.1), loaders with semantic `<progress>` and an accessible name, and inline errors instead of modal errors.
- CVD prevalence (NN/g: 8% of men, 0.5% of women; Few cites 10% and 1%) justifies a CVD-safe default palette, not just an optional one.

## Motion / interaction
- Instant feedback (under 100 ms) on every click, even when the result takes longer (NN/g response-time limits). Any feedback animation uses the motion tokens (100 or 150 ms) in SKILL.md and `assets/tokens.css`.
- Indicator choice by expected wait: none under 1 s (delay any indicator about 200 ms and keep it at least 300–500 ms once shown, per SKILL.md), spinner for one module or skeleton for a full page at 1–10 s, determinate progress with an estimate and Cancel over 10 s.

## Tokens and values
| Finding | Value | Source |
|---|---|---|
| Instant / flow / attention limits | 0.1 s / 1 s / 10 s | NN/g |
| Progress indicator from | > 1 s | NN/g |
| Looped (spinner) window | 2–10 s | NN/g |
| Percent-done from | ≥ 10 s | NN/g |
| Willingness to wait with a looped indicator | ≈ 3× | NN/g, citing a University of Nebraska–Lincoln study |
| Bullet graph bands | 2–5 (ideal 3); 3 bands = 40/25/10% black | Few |
| Featured bar thickness | ≈ 1/3 of container | Few |
| CVD prevalence | ≈ 8% men, 0.5% women (Few: 10% and 1%) | NN/g; Few |
| Skeleton use | full-page loads, 1–10 s | NN/g |
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
- [ ] Precision matches the task (compact, ≤ 3 significant digits on KPIs; exact value on hover).
- [ ] The loading indicator type matches the expected wait.
- [ ] Card internals are uniform and headers prominent.
- [ ] Modals are reserved for a decision needed now (critical warning, required input, short task), per comp-overlay-choice.md.

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
- https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element
