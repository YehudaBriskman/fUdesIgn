# Reading and scanning patterns: F, layer-cake, spotted, and the Z folklore

> People scan, not read; the F-shape is what they do when a page gives no strong cues, so design the cues (front-loaded headings, short blocks, one clear lead) instead of designing for an F or a Z.

**Category:** Foundations · **Applies to:** articles, docs, dashboards, landing pages, search results, forms with explanatory text, any text-heavy screen · **Priority:** should

## When to use / when not
- **Use** when a layout argument says "users read in an F" or "put the CTA where the Z ends", and when writing or restructuring any screen with more than a few lines of text.
- **Use** to decide where the single most important item goes and how headings are worded.
- **Not** a placement formula. No eye-tracking study gives you a coordinate to put a button at. Task tests on your screen do.
- **Not** for non-text interfaces (canvas tools, maps, games): the studies concern text pages.

## Evidence grade (be honest about it)
| Claim | Grade | What was fetched |
|---|---|---|
| People often scan text pages in an F-shape (top bar, shorter second bar, vertical sweep down the left) | **Strong as a descriptive observation** | NN/g (Nielsen 2006; revisited 2017): heatmaps from eye-tracking of 45+ and 47 people on two tasks; the 2017 data showed the same pattern 11 years later; also seen on mobile and, mirrored, in right-to-left Arabic. |
| It is the **default only when** there are no strong cues | **Established, NN/g's own qualification** | NN/g names three conditions: a dense block of unformatted text, a user who wants efficiency, a user not motivated to read every word. |
| Other patterns exist: layer-cake (eyes ride the headings and skip the body), spotted (hunting for a link, number or word), commitment (motivated readers fixate on nearly everything) | **Established, qualitative** | Same NN/g article. Its advice: assume most users will scan. |
| **Z-pattern** for sparse or landing pages | **Folklore here** | No primary source was found or fetched. NN/g's page does not define it. Do not cite it as research. |

Limits: the NN/g pages give participant counts for some heatmaps only; effect sizes and the exact share of users who show an F are not stated, so none is quoted here. A heatmap aggregates fixations; it shows where people looked, not what they understood.

## Rules (do)
- **Treat F as a failure mode, not a template.** NN/g argues it hurts users and businesses because content on the right of the page gets skipped. Break it with cues.
- **Front-load.** Put the point in the first two paragraphs, and start headings and subheadings with the words that carry the most information (NN/g). Test: read only the first two words of each heading; the gist should survive.
- **Layer-cake by design.** Descriptive headings with short blocks beneath let a layer-cake scan work. One heading per idea; no heading that is a verbless label like "Overview" when a specific one exists.
- **Support the spotted reader.** Make links, numbers and key terms findable: descriptive link text, bold for genuinely key terms (sparingly), bullets for parallel items, tabular numbers in columns (see `found-scanning-kpi-pyramid.md`).
- **One lead per region.** Give the primary item the strongest weight (size, contrast, position); two leads halve each other (`found-visual-hierarchy.md`).
- **Keep line length and blocks short.** Cap long-form measure near 60-75 characters and paragraphs to a few lines: house default, not from the fetched NN/g pages.
- **Group before you decorate.** Spacing and boundaries tell the eye where chunks start (`found-gestalt-grouping.md`, `found-layout-grid-spacing.md`).
- **Mirror in RTL.** NN/g reports a mirrored F for Arabic readers; use logical properties so start-side cues stay at the reading start.

## Anti-patterns (don't)
- Placing the primary action "at the end of the Z" and calling it evidence-based.
- Wall of unformatted text with the key fact in paragraph four.
- Headings that repeat the same first words ("Learn more about...", "Learn more about...") so the first-two-words test fails.
- Bold on a third of the text, which restores a uniform wall.
- Hiding key content in the right-hand column of a text page and expecting it to be seen.
- Citing "20% of words read" or "F-pattern says" without the source and its limits.

## Good references
- [NN/g, F-Shaped Pattern for Reading Content](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/): the pattern, its three conditions, the other patterns, and format-based fixes. Fetched.
- [NN/g, F-Shaped Pattern of Reading on the Web (2006)](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/): the original study, cited by the scratchpad report as fetched.
- Repo: `found-scanning-kpi-pyramid.md` turns scanning into a KPI layout with a stated limit on Z.

## Bad references
- Blog infographics showing a Z on a landing page with no study attached: the pattern is asserted, not measured.
- Heatmaps used to justify putting content in "hot" zones on pages whose cues differ from the studied text pages.

## Accessibility
- Scanning aids are accessibility aids: real headings (`h1`-`h6` in order) give screen-reader users the same layer-cake via heading navigation.
- Descriptive link text also helps people who hear links read aloud (NN/g).
- Do not rely on bold or colour alone to mark key terms.

## Motion / interaction
Not relevant, with one note: sticky or animated elements in the scan path pull fixation (Von Restorff-style); keep them to the single lead.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Heading information front-load | key term in first 2 words | NN/g advice |
| Lead paragraph | main point within first 2 paragraphs | NN/g advice |
| `--measure` | 60-75ch (house default) | long-form text |
| Paragraph length | 2-4 lines (house default) | scannable blocks |

## Implementation sketch
```html
<article class="prose">
  <h1>Refunds take 5 business days</h1>
  <p class="lead">Refunds reach your card within 5 business days; bank delays can add 2.</p>
  <h2>Check a refund's status</h2>
  <p>Open Orders, choose the order, then Refund status.</p>
  <h2>Refund not arrived after 7 days</h2>
  <ul><li>Confirm the card is active.</li><li>Contact support with the order number.</li></ul>
</article>
<style>
  .prose { max-inline-size: 70ch; padding-inline: 1rem; }
  .prose h2 { margin-block: 1.5em 0.4em; }
  .prose p { margin-block: 0 0.8em; }
</style>
```

## How a UI builder uses this
### Rules (do)
1. Write the heading list first; if the headings alone do not tell the story, rewrite them.
2. Put the answer before the explanation, in the first two paragraphs.
3. Make exactly one element the visual lead per region.
4. Use lists, tabular numbers and descriptive links for the spotted reader.
5. Never justify a layout with "F" or "Z" in a review; name the cue you added.

### Tests the reader can run
- **Two-word heading test:** list only the first two words of each heading; can a colleague say what the page covers?
- **Five-second test:** show the page for five seconds, ask what it is about and what to do next; record answers from five people.
- **Task find test:** ask five people to find one specific number; time it. A slow spot is a missing cue, not a missing zone.
- **Squint test:** blur the page; the lead and the headings should still stand out.

### Applied in the repo
`found-scanning-kpi-pyramid.md`, `found-visual-hierarchy.md`, `found-gestalt-grouping.md`, `found-layout-grid-spacing.md`, `ffound-layout-single-column-grouping.md`, `mkfound-page-narrative.md`, `mksect-hero.md`, `mksect-features-and-bento.md`, `ref-ux-laws-evidence-map.md`.

## Checklist
- [ ] Headings pass the two-word test.
- [ ] Main point is within the first two paragraphs.
- [ ] One visual lead per region.
- [ ] Links are descriptive; key terms are marked sparingly.
- [ ] No layout decision cites F or Z as evidence.
- [ ] Measure and block length are marked "house default" where stated.
- [ ] Layout uses logical properties for RTL.
- [ ] A five-second or task test was run, not only a heatmap argument.

## Sources
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ (fetched this session)
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/ (fetched per r2-gaps.md)
- Repo: `found-scanning-kpi-pyramid.md`, `found-visual-hierarchy.md`, `found-gestalt-grouping.md`, `found-layout-grid-spacing.md`, `ffound-layout-single-column-grouping.md`, `mkfound-page-narrative.md`, `mksect-hero.md`, `mksect-features-and-bento.md`, `ref-ux-laws-evidence-map.md`
