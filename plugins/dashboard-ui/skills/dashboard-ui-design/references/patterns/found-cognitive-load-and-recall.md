# Cognitive load and recall: make the screen carry the memory

> Show options instead of asking users to remember them, put help where the task is, cut load that does not serve the task, and never justify a hard item limit with "7±2".

**Category:** Foundations · **Applies to:** navigation, toolbars, filter bars, forms inside dashboards, onboarding hints, settings, data tables, command surfaces · **Priority:** must

## When to use / when not
- **Use** when deciding whether an action, option or definition is visible, searchable or hidden, and when judging how much one screen asks of a person at once.
- **Use** to answer "why is this screen hard to use" before touching colour or spacing: most "hard" screens force recall, bury help, or mix unrelated decisions.
- **Not** a licence to show everything. Visible clutter is also load; NN/g's own balance is H6 (recognition) against H8 (minimalist design), solved with progressive disclosure (`found-progressive-disclosure.md`) and search.
- **Not** a numeric limit on menus, tabs, chart series or KPIs. See the warning below.

## Rules (do)
### Recognition over recall (Nielsen heuristic 6)
- **Make options visible or searchable.** NN/g: "minimize the user's memory load by making elements, actions, and options visible". Test: can a first-time user finish the task without remembering anything from another screen or from a manual?
- **Label, do not memorise.** Icon-only controls beyond the short universal list force users to recall meaning; keep the label next to the icon (`comp-icons-and-labels.md`).
- **Do not hide primary actions** behind hover-only reveals or unlabelled icons. Hover-only is also invisible on touch.
- **Offer a way to find what is not shown.** A palette or search covers the long tail: `comp-command-palette-search.md` in this plugin; for field-level pick-lists use `finput-select-combobox-autocomplete.md` (forms-ui). Show recents and the current value so users pick instead of retype.
- **Keep context on screen.** Selected filters as chips, the active date range in the header, the entity name in the panel title. Users compare what they can see, not what they saw one click ago (Few's pitfall 1 on fragmented displays, `ref-ux-research-findings.md`).
- **Default to remembered state, not blank state.** Restore last filters, sort and period where the user chose them; never hide that state.
- **Show units, definitions and sources next to the number** instead of in a glossary (`data-units-footnotes-sources.md`, `found-microcopy-for-data.md`).

### Paradox of the active user: help lives in the task
- Users skip manuals and start using the product (Rosson and Carroll 1987, as summarised on lawsofux.com). Plan for that: put help in context, as short inline hints, empty-state guidance, a labelled `?` next to a hard term, or a tooltip with one sentence (`comp-onboarding-and-notices.md`).
- **Keep a findable reference too.** The observation says people do not read first; it does not say documentation is useless. Link to depth from the hint.
- **Teach once, at the point of use.** A first-run hint is dismissible, appears next to the thing it explains, and does not return after dismissal.
- No numbers exist for this effect; do not invent a time or word count and attribute it to the law. House default: a hint is one sentence, two at most.

### Cognitive load: cut the extraneous, chunk the rest
- **Intrinsic vs extraneous.** Cognitive load theory (Sweller 1988, education research) separates load from the task's own difficulty (intrinsic) from load added by how it is presented (extraneous). You cannot remove the first in a valuation or a ledger; you can remove the second: decoration, duplicated data, inconsistent patterns, jargon, unlabelled abbreviations.
- **Chunk by task, not by count.** Group things that are used together under one label; NN/g's 12 fields as 3 chunks of 4 is a grouping example, not a limit (`found-gestalt-grouping.md`).
- **Consistency lowers load.** The same control looks and behaves the same everywhere, so people reuse what they learned (Few's pitfall 6, `ref-ux-research-findings.md`).
- **Prioritise by measured usage.** Order and surface actions by observed frequency from analytics, not by an assumed 80/20 split; the Pareto split is an observed skew in some distributions, not a design constant (lawsofux.com).
- **One decision per region.** Do not ask for filter, scenario and export choices in the same visual cluster.
- **Reduce what must be held in the head.** If two values must be compared, put them adjacent or add the delta (`data-delta-trend-indicators.md`) instead of expecting mental subtraction.

### Warning: 7±2 is not a UI limit
- Miller (1956) reported a span of roughly 7±2 items for digits, fewer for letters and words, and used "magical" rhetorically; the span depends on the material (Wikipedia, Magical Number Seven).
- Cowan (2001) proposed about 4 chunks for young adults, fewer for children and older adults. This is a debated working-memory estimate: other analyses report about 2 chunks (Gobet and Clarkson, via Wikipedia). Cowan's abstract was not fetched first-hand here.
- lawsofux.com itself says: "Don't cite the magical number seven to justify unnecessary design restrictions."
- **So:** never write "max 7 nav items", "max 7 series" or "max 5 tabs" and cite Miller or Cowan. Menus and tables are visible, so users scan them rather than hold them in memory. Valid reasons to limit an item count are scan time, space, and testing results, stated as a house default.
- Cowan's figure may be used only as a loose caution for things users must keep in mind and compare across a screen change, never as a threshold to pass or fail a design.

## Anti-patterns (don't)
- **Recall-gated actions.** Keyboard-only or gesture-only features with no visible hint or palette entry.
- **Mystery meat navigation.** Icon-only nav with no labels and no tooltips on a first-run product.
- **Help in a separate manual** for a term the screen uses on every row.
- **Blank slate after every visit.** Filters, sort and period reset on reload.
- **Splitting a comparison across tabs or screens** so users must remember the first number.
- **"Show everything for recognition"** that produces a 40-button toolbar; the cure is progressive disclosure plus search.
- **Citing 7±2** to cap or to pad a design.

## Good references
- [NN/g: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): heuristic 6 text on visible elements, actions and options; the counterweight is heuristic 8.
- [Laws of UX: Paradox of the Active User](https://lawsofux.com/paradox-of-the-active-user/): users start using before reading; design help for that behaviour.
- [Laws of UX: Cognitive Load](https://lawsofux.com/cognitive-load/): extraneous versus intrinsic load, and the warning about overload.
- [Laws of UX: Miller's Law](https://lawsofux.com/millers-law/): states plainly not to cite the magical number seven as a design restriction.

## Bad references
- A dashboard that lists "7 widgets per page" as a rule and cites Miller: the cap is invented, and the widgets are visible, not memorised.
- Icon-only toolbars of 15 unlabelled glyphs: recall with no support.
- A first-run tour of 8 modal steps shown before the user touches the product: users skip it (the paradox of the active user) and the hints are gone when needed.

## Accessibility
- Recognition helps everyone and is essential for users with memory or attention differences: visible labels, consistent placement, no timeouts on help (WCAG 3.2.3 consistent navigation, 3.2.4 consistent identification, 3.3.2 labels or instructions).
- Contextual help must be keyboard reachable and not hover-only; a tooltip is dismissible, hoverable and persistent (WCAG 1.4.13).
- Never rely on a placeholder as the only label; it disappears and forces recall.

## Motion / interaction (if relevant)
- Hints and recents appear without delay or flourish; do not animate help in a way that moves the thing it explains.
- Respect reduced motion for any attention-drawing hint (`motion-reduced-motion.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Hint length | 1 sentence, 2 max | inline contextual help (house default) |
| Recents shown | 3 to 5 | palette or combobox with no query (house default) |
| Item-count cap from Miller or Cowan | none | never; any cap is a stated house default |
| Dismissed hint | stored per user | does not return after dismissal |

## Implementation sketch
```html
<label for="seg">Segment
  <button type="button" class="hint" aria-describedby="seg-help" aria-label="About segment">?</button>
</label>
<input id="seg" list="seg-recents" autocomplete="off">
<datalist id="seg-recents"><option value="Enterprise"><option value="SMB"></datalist>
<p id="seg-help" class="help">Customers grouped by contract size. Changing it recalculates the chart.</p>
```
```css
.help { font-size: .8125rem; color: var(--text-muted); max-inline-size: 48ch; }
.hint { min-inline-size: 24px; min-block-size: 24px; } /* WCAG 2.5.8 target size */
```

## Checklist
- [ ] A first-time user can complete the main task with no memory of other screens.
- [ ] No primary action is hover-only, gesture-only or unlabelled icon-only.
- [ ] Long-tail actions are reachable by search or palette.
- [ ] Last filters, sort and period are remembered and visibly shown.
- [ ] Help for a hard term is next to the term, one sentence, with a link to depth.
- [ ] Comparisons keep both values on screen.
- [ ] No design rule cites 7±2 or Cowan's 4 as a hard limit.
- [ ] Any item-count cap is labelled a house default with its real reason.

## Sources
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://lawsofux.com/paradox-of-the-active-user/
- https://lawsofux.com/cognitive-load/
- https://lawsofux.com/millers-law/
- https://lawsofux.com/pareto-principle/
- https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two
- repo: comp-icons-and-labels.md, comp-command-palette-search.md, comp-onboarding-and-notices.md, found-progressive-disclosure.md, found-gestalt-grouping.md, ref-ux-research-findings.md, forms-ui finput-select-combobox-autocomplete.md
