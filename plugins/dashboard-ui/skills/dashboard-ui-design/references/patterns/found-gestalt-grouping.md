# Gestalt grouping: say what belongs together, and nothing else

> Show relationships with the cheapest cue that works, in this order: proximity, then alignment and similarity, then a shared region, and never draw a relationship that the interface does not have.

**Category:** Foundations · **Applies to:** widget interiors, KPI cards, toolbars, filter bars, settings panels, tables with actions, any screen with more than one cluster · **Priority:** must

## When to use / when not
- **Use** whenever you decide whether two things get a gap, a rule, a background or a card. Every grouping decision claims "these act together, those do not".
- **Use** as a review lens after layout: if the grouping the eye sees differs from the grouping the data model has, one of them is wrong.
- **Not** a spacing scale: scale, grid and inner < outer numbers live in `found-layout-grid-spacing.md`. This file picks the *cue*, not the pixel value.
- **Not** hierarchy (`found-visual-hierarchy.md`), surface levels and elevation (`style-surfaces-and-layering.md`), or form fieldsets (`ffound-layout-single-column-grouping.md`, forms-ui).

## Rules (do)
- **Proximity first.** Closeness is the strongest, cheapest cue and can overpower similarity of colour or shape (NN/g). Use whitespace as the first and usually only separator. Split 12 controls into 3 clusters of 4; NN/g's 12-field form reads as less daunting in 3 chunks.
- **Inner gap < outer gap, measurably.** Inner gap at most 2/3 of the outer gap (house default: 8px inside, 24px between; 1.5x is the floor, 2-3x typical). No cited source prescribes a ratio; they only require closer inside, looser between.
- **Ambiguous gaps are the bug.** A gap that is neither clearly inner nor outer (12px where inner is 8 and outer 16) sends the item to the wrong group. Use two gap values per region.
- **Common region only for a shared interaction scope.** A border or background says "these share a purpose" and is a strong cue that can overpower proximity (NN/g). Use it when members share a scope: filters for one chart, one form that saves together, one entity's card with its own actions. Boxes added out of caution create clutter.
- **Region test.** Delete the border. If space and alignment still show the grouping, leave it deleted. Re-add only for a reason you can state in one sentence.
- **One container level per datum.** Never wrap a card in a card; use a heading, hairline or space inside.
- **Similarity means sameness of role.** Same-role elements share geometry, type size, weight and colour (every KPI tile the same height, every row action the same icon button). Different-role elements differ in at least two traits (house default), e.g. shape and colour plus an icon, as with NN/g's Etsy badges.
- **Spend the "different" on purpose.** One break in a uniform set is a signal (one primary action). Two or three is noise.
- **Continuity: align to shared edges.** Items on one path share a start edge or baseline: labels on one inline-start line, numbers on one decimal edge (`data-table-layout-and-typography.md`), card titles on one baseline. A few px of misalignment reads as another group. NN/g eye-tracking shows the left edge of text gets disproportionate fixations, so protect it.
- **Figure vs ground.** Controls differ from their surface by contrast, not decoration. If a non-text boundary is the only cue that a control exists, it needs 3:1 against adjacent colours (WCAG 1.4.11). A decorative border is exempt, another reason to ask if it is needed.
- **Do not fake relationships.**
  - A connector (line, arrow, bracket) must map to a real flow or dependency.
  - A pill row with one highlighted must *be* tabs: switch a panel, with tab roles and arrow keys. Otherwise use the matching pattern (`comp-tabs-segmented-pills.md`).
  - Shared colour must mean shared function. A decorative icon in the button colour looks clickable (NN/g's Tribute example).
- **Programmatic grouping matches visual grouping.** Headings, lists, `fieldset` + `legend`, or `role="group"` + `aria-labelledby` (WCAG 1.3.1). A group that exists only as spacing is invisible to a screen reader.
- **Re-check at every breakpoint.** On reflow keep the inner gap and move whole groups.

## Anti-patterns (don't)
- **Card-in-card.** Each box claims a scope; three nested boxes claim three scopes for one chart.
- **Divider overload.** A rule under every row and around every cell out-shouts the data (`found-data-ink-minimalism.md`). One hairline per level, or space.
- **Tab-shaped non-tabs.** A pill row that only filters, or a stepper styled as tabs.
- **Look-alike for unlike.** A button styled like a badge; a Submit button that blends into Cancel (NN/g's Synchrony Bank example); a video shaped like an ad, mistaken for one (NN/g's Martha Stewart example).
- **Orphan controls.** A control far from what it affects gets missed (NN/g's Kayak "Skip" in a distant corner).
- **Full-bleed bands that look like page ends.** Strongly coloured full-width sections make people think the page has finished (NN/g common region).

## Good references
- [NN/g: Proximity principle](https://www.nngroup.com/articles/gestalt-proximity/): proximity can overpower colour or shape; Wellington City Council spaces Search away from the main navigation; TfL puts two comparable zone links side by side; 12 fields as 3 chunks of 4.
- [NN/g: Similarity principle](https://www.nngroup.com/articles/gestalt-similarity/): Asos uses pills for subcategory links and rectangles for filters; Etsy's badges differ in colour and one adds an icon.
- [NN/g: Common region](https://www.nngroup.com/articles/common-region/): a clear boundary can overpower other grouping cues; asks whether whitespace alone would do before adding borders.
- [Atlassian: Elevation](https://atlassian.design/foundations/elevation): do not use raised elevation to group content when a border or white space would suffice; sunken is a backdrop for groups such as a Kanban board.
- [W3C WAI: Grouping form controls](https://www.w3.org/WAI/tutorials/forms/grouping/): `fieldset`/`legend` or `role="group"` with `aria-labelledby`; keep legends short.
- [IxDF: Gestalt principles](https://ixdf.org/literature/topics/gestalt-principles): proximity, similarity, continuity, closure, figure/ground and common region as UI rules.

## Bad references
- [NN/g: Principles of visual design, IRS form](https://www.nngroup.com/articles/principles-visual-design/): the 2017 IRS form has too little space between fields, making it cumbersome; proximity could have separated the sections.
- [NN/g: Proximity principle, Kayak and TfL mobile](https://www.nngroup.com/articles/gestalt-proximity/): a distant Skip link tricks users into thinking sign-in is required; stacking pushes TfL's second link away so it may never be found.
- [NN/g: Similarity principle, Tribute and Synchrony Bank](https://www.nngroup.com/articles/gestalt-similarity/): a decorative icon in the button colour looks clickable; Submit in the secondary buttons' colour blends in.

## Accessibility
- Visual groups need structure: headings for named regions, lists for repeated items, `fieldset`/`legend` for a set answering one question, `role="group"` + `aria-labelledby` otherwise (WCAG 1.3.1). Some screen readers repeat the legend per control, so keep it short.
- A border that identifies a control needs 3:1 (WCAG 1.4.11); do not rely on a faint border as the sole cue for a group that matters.
- Tabs follow the ARIA APG tabs pattern: `tablist`, `tab`, `tabpanel`, `aria-selected`, arrow keys between tabs, Tab into the panel. If it does not behave so, do not style it as tabs.
- Do not signal membership by colour alone (WCAG 1.4.1); add a label, icon or position.
- Reflow changes proximity; check at 320 CSS px (WCAG 1.4.10).

## Motion / interaction (if relevant)
- Elements that move together read as one group. Animate the container, not children at different times; durations per `motion-principles-and-tokens.md`.
- Highlight a whole group on hover or focus only if the whole group acts together (a clickable card).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--group-gap-inner` | 8px (`--space-2`) | within a cluster (house default) |
| `--group-gap-outer` | 24px (`--space-5`) | between clusters; at least 1.5x inner (house default) |
| `--region-gap` | 32-48px | between sections (house default) |
| `--label-gap` | 4px (`--space-1`) | label to value or field (house default) |
| `--region-border` | 1px neutral | shared-scope region; 3:1 only if it identifies a control |
| `--region-bg` | one step off canvas | shared-scope region without a border |
| Gap values per region | 2 | one inner, one outer |
| Traits that differ for a different role | 2+ | shape, size, colour, weight (house default) |

## Implementation sketch
```html
<section aria-labelledby="rev-h">
  <h2 id="rev-h">Revenue</h2>

  <!-- Cluster 1: filters that apply to the chart below -> shared region is justified -->
  <div class="scope" role="group" aria-labelledby="flt-h">
    <h3 id="flt-h" class="sr-only">Chart filters</h3>
    <label>Period <select><option>12 months</option></select></label>
    <label>Segment <select><option>All</option></select></label>
  </div>

  <!-- Cluster 2: chart; no box of its own, space separates it -->
  <figure class="chart">...</figure>

  <!-- Cluster 3: actions; same role, same geometry; one primary differs -->
  <div class="actions">
    <button class="btn">Export</button>
    <button class="btn">Share</button>
    <button class="btn btn-primary">Save view</button>
  </div>
</section>
```
```css
:root {
  --space-2: .5rem; --space-5: 1.5rem;
  --group-gap-inner: var(--space-2);
  --group-gap-outer: var(--space-5);
}
section { display: grid; gap: var(--group-gap-outer); }      /* between clusters */
.scope, .actions { display: flex; flex-wrap: wrap; gap: var(--group-gap-inner); } /* inside */
.scope { padding: var(--space-2) .75rem; border: 1px solid var(--border); border-radius: 8px; }
.btn { block-size: 2rem; padding-inline: .75rem; border-radius: 6px; }   /* one geometry for the role */
.btn-primary { background: var(--accent); color: var(--on-accent); }      /* the single deliberate break */
```

## The tests
- **Squint / blur test.** Blur the screen (NN/g's visual hierarchy article uses 5 or 10px radius) or squint. Intended clusters should show as blobs with gaps between. If two merge or one splits, fix spacing before adding any line.
- **Grouping audit.** List the groups the product means; screenshot and mark the groups the eye sees; compare. Each mismatch is a spacing, alignment or similarity fix. For each border or background, write its shared scope; none, remove it. For each tab-like or connector-like element, name the behaviour or flow behind it.

## Checklist
- [ ] Each region uses two gap values, outer at least 1.5x inner.
- [ ] Squint test shows the intended clusters, none merged or split.
- [ ] Every border or tint has a one-sentence shared scope; deleting it was tried.
- [ ] No container nests in another for the same datum.
- [ ] Same-role elements share geometry; different-role elements differ in 2+ traits.
- [ ] Left edges, baselines and number edges align within groups and across sibling cards.
- [ ] Nothing styled as tabs, stepper or connector lacks the matching behaviour or flow.
- [ ] Each visual group has heading, list or `fieldset`/`group` structure, and 320px reflow keeps groups intact.

## Sources
- https://www.nngroup.com/articles/gestalt-proximity/
- https://www.nngroup.com/articles/gestalt-similarity/
- https://www.nngroup.com/articles/common-region/
- https://www.nngroup.com/articles/principles-visual-design/
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://ixdf.org/literature/topics/gestalt-principles
- https://atlassian.design/foundations/elevation
- https://www.w3.org/WAI/tutorials/forms/grouping/
- https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset
- repo: found-layout-grid-spacing.md, found-visual-hierarchy.md, style-surfaces-and-layering.md, ffound-layout-single-column-grouping.md (forms-ui), comp-tabs-segmented-pills.md, found-data-ink-minimalism.md, data-table-layout-and-typography.md, motion-principles-and-tokens.md
