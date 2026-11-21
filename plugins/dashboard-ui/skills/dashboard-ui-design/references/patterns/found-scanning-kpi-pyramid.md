# Scanning patterns and the inverted KPI pyramid

> Design for scanning: put the answer top-leading, trends in the middle and detail at the bottom, and give each band a front-loaded heading so the eye can "layer-cake" down the page.

**Category:** Foundations · **Applies to:** dashboard home pages, report pages, KPI strips, widget titles, section headings · **Priority:** must

## When to use / when not
- **Use** for the vertical order of any dashboard and the internal order of each card (label → value → comparison → sparkline → footer).
- **Use** the "five-second test": a target user, shown the page for 5 seconds, can say the state of the main metric (Sisense: "Your dashboard should provide the relevant information in about 5 seconds").
- **Not** a reason to put everything in the top-left. Scanning patterns describe where eyes go when the design provides *no* strong cues. NN/g: "The F-pattern is the default pattern when there are no strong cues". Your job is to provide the cues.
- **Z-pattern** is folk wisdom for sparse, marketing-style layouts. NN/g's eyetracking research doesn't define it (it only mentions a "zigzag" on image-heavy pages). Don't design dashboards around it.

## Rules (do)
- **Use the inverted pyramid, three bands top to bottom** (Sisense: "Display the most significant insights on the top part of the dashboard", trends in the middle, granular details at the bottom):
  1. **Status:** 1 north-star KPI plus 3–6 supporting KPIs, each with comparison or target. 4–6 tiles at desktop is the sweet spot.
  2. **Trends and explanations:** the time series and breakdowns that explain *why* band 1 moved, placed directly under the KPI they explain.
  3. **Details:** tables, lists, logs and links to drill down. Streams and logs go last in their own collapsible group (Datadog).
- **Order KPIs by importance from the leading edge** (left in LTR, right in RTL). The F's top bar is read most completely, and later items in a row get fewer fixations.
- **Front-load headings and labels.** Put the informative word first: "Churn rate, 30d", not "30-day rolling customer churn rate". Users often read only the first 2–3 words of a line (NN/g F-pattern; "bypassing" pattern for lists with repeated starts).
- **Give every band a visible heading** (`<h2>`). The layer-cake pattern, scanning headings and then diving in, is the *most effective* scanning pattern (NN/g).
- **Make the exception the spot.** In the "spotted" pattern eyes jump to visually distinct items and to digits when the user hunts for numbers. Use this deliberately: only abnormal values get color, bold or an icon (see `color-semantic-status.md`).
- **Put related items in the same row or column.** A KPI and its trend chart must be adjacent. Few Fig. 12 separated "avg order size" from its trend.
- **Keep the right side safe.** Content at the far right of wide rows gets fewer fixations. Don't place the only alert indicator or the primary action at the far right of a 1920px row. Pull it into band 1 or next to its subject.
- **Mirror for RTL.** The F mirrors in right-to-left languages, so use logical properties (`inline-start`) throughout.

## Anti-patterns (don't)
- **Pyramid upside down:** a 50-row table on top and KPIs at the bottom "for reference".
- **Undifferentiated grid:** 12 identical tiles with no bands or headings. Users fall back to an F scan and miss the lower right.
- **Same-prefix labels:** "Total revenue", "Total cost", "Total margin", "Total customers". Users bypass the identical start and the distinguishing word arrives late.
- **Key alert in the far bottom-right,** the lowest-attention zone in an F scan.
- **Carousels or rotating KPI panels.** Users see one slice and the rest is never scanned.
- **More than about 9 visualizations** in one scroll (Sisense guidance is 5–9). The pyramid's base becomes a wall.

## Good references
- [NN/g: F-Shaped Pattern of Reading on the Web (2017, reviewed 2026)](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/): the F appears on desktop and mobile and is mirrored in RTL. Lists the layer-cake, spotted, marking, bypassing and commitment patterns. The cure is formatting: headings, grouping, bolding key terms sparingly.
- [NN/g: Text Scanning Patterns, Eyetracking Evidence](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/): ranks patterns from least to most effective (F < spotted < layer-cake) and notes digits attract fixations when users look for numbers. Useful for KPI tiles.
- [Sisense: 4 design principles for better dashboards](https://www.sisense.com/blog/4-design-principles-creating-better-dashboards/): five-second rule, inverted-pyramid layout, 5–9 visualizations.
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/): "Place the most important content at the top and follow the F-shaped reading pattern for the rest, ending with the least important information."
- [Datadog integration dashboards](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): Overview first, groups ordered macro to micro and upstream to downstream, streams at the end in their own collapsible group. Graph titles lead "with the most important information" and omit "number of".

## Bad references
- [Few, Common Pitfalls, Fig. 12](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): the prime top-left spot is used for logo and nav, and the first metric seen (a gauge) is unlikely to be the most important. Its related trend sits elsewhere.
- [Few, Common Pitfalls, Fig. 13](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): no bands and no distinct exceptions. Every chart competes equally, so there is no scan path at all.

## Accessibility
- Visual bands equal DOM sections: `<section aria-labelledby>` with `<h2>`, in reading order. Screen-reader users scan by headings, the auditory layer-cake.
- KPI tiles are a list (`<ul>` of `<li>`) so assistive tech announces "list, 5 items". Each tile's label precedes its value in the DOM.
- Don't rely on position alone to mark the north-star KPI. Its label or heading should say so ("Primary metric").

## Motion / interaction (if relevant)
- Avoid entrance animations that stagger bands. They force a scan order and delay band 3 for users who came for details.
- Sticky band-1 KPIs while scrolling bands 2–3 are acceptable if the sticky bar stays < 12% of viewport height (modern-web-guidance `user-experience/content-first-noise-reduction.md`).

## Tokens and values
| Band | Height share at 1440×900 | Content | Count |
|---|---|---|---|
| 1 Status | ~15–20% | KPI tiles: label 12px, value 24–32px, comparison 12px | 1 + 3–6 |
| 2 Trends | ~40–50% | 1–3 charts, each under the KPI it explains | 2–4 |
| 3 Details | rest / below fold | table, list, logs, "view all" links | 1–3 |
| Heading per band | 16–20px, 600 | front-loaded, ≤ 5 words | 1 each |
| Visualizations total | ≤ 9 | | |

## Implementation sketch
```html
<main class="pyramid">
  <section aria-labelledby="status-h" class="band status">
    <h2 id="status-h">Status</h2>
    <ul class="kpis">
      <li class="kpi kpi--primary"><span class="kpi-label">Net revenue · Nov</span>
          <span class="kpi-value">$1.28M</span><span class="kpi-compare">▲ 4.1% vs Oct</span></li>
      <li class="kpi"><span class="kpi-label">Churn · 30d</span><span class="kpi-value">2.3%</span>
          <span class="kpi-compare">target ≤ 2.5%</span></li>
      <!-- 3–6 supporting -->
    </ul>
  </section>
  <section aria-labelledby="trend-h" class="band trends"><h2 id="trend-h">Why it moved</h2>…</section>
  <section aria-labelledby="detail-h" class="band details"><h2 id="detail-h">Transactions</h2>…</section>
</main>
```
```css
.pyramid { display: grid; gap: var(--space-6); }
.kpis { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); list-style: none; padding: 0; }
.kpi { display: grid; gap: var(--space-1); }        /* label → value → compare, DOM order = scan order */
.kpi--primary { grid-column: span 2; }              /* north star gets more space, at the leading edge */
.kpi--primary .kpi-value { font-size: var(--type-hero); }
```

## Checklist
- [ ] Five-second test: a target user can state the main metric's status.
- [ ] Bands run status → trends → details, each with a front-loaded `<h2>`.
- [ ] The north-star KPI sits at the leading edge of band 1 and is larger than its peers.
- [ ] Each trend chart is adjacent to the KPI it explains.
- [ ] Labels in a set don't share the same first word.
- [ ] Only abnormal values use color or bold (spotted pattern targets exceptions).
- [ ] There are ≤ 9 visualizations, with streams and logs last and collapsible.

## Sources
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/
- https://www.sisense.com/blog/4-design-principles-creating-better-dashboards/
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
