# Information scent and IA methods

> Every link, tab and result row is a promise about what is behind it: write labels and snippets that let people predict correctly, and pick the research method that matches the question (card sort to generate a structure, tree test to evaluate one).

**Category:** Foundations · **Applies to:** navigation labels, tabs, link text, search results and snippets, dashboard drill-downs, menus, empty-state calls to action, site and app structure decisions · **Priority:** should

## When to use / when not
- **Use** when naming any link, tab, menu item or card header, writing a search snippet, or deciding how to group and name sections.
- **Use** when users "can't find it" and the feature exists: that is a scent or structure fault, not a missing feature.
- **Not** a visual-design pattern; it governs words and structure. Layout and hierarchy live in `found-visual-hierarchy.md`.
- **Not** proof that a structure works: card sorts and tree tests are small studies; confirm with task tests (`uxres-usability-testing-five-users-and-beyond.md`).

## Rules (do)
### The theory, graded
- **Information foraging theory (Pirolli and Card, 1999)** treats searching and browsing as rational, goal-driven activity in which people weigh the effort of finding information against its value. It borrows from optimal foraging theory in ecology. Its terms: *patch* (cluster of related information), *scent* (estimating an item's value from navigation cues and metadata), *diet* (choosing one source over another). Grade: **Established**, peer-reviewed (Psychological Review 106(4), 643-675); we did not read the 1999 full text (no open copy found; Fu and Pirolli 2007, read in full, cites it for the same account: people "develop information-seeking strategies that optimize the utility of information gained in relation to the cost of interaction").
- **A later computational model, SNIF-ACT (Fu and Pirolli, 2007, Human-Computer Interaction 22, 355-412),** models users evaluating the links on a page in sequence and deciding to click or go back from how relevant the link text seems to the goal. Read in full (Google-hosted PDF): it tests the model against protocol data from 8 participants on two information tasks. It supports the practical point that link text drives the click-or-back decision.
- **The design rules below are practitioner synthesis (NN/g)**, not theorems. NN/g's scent article (Budiu, 2020) does not itself name Pirolli or Card; the attribution above comes from the IxDF glossary and the bibliographic record.

### Scent rules (NN/g, Budiu 2020)
- **Scent is relative to the task.** "Food" smells strong to someone seeking cheese and weak to someone seeking a facial cleanser. Judge a label against a task, never in the abstract.
- **Make link labels succinct and accurate.** Ban "More", "Learn more", "Click here"; avoid jargon, brand-coined terms and words the audience will not recognise.
- **Make link names specific without relying on context.** Surrounding text may be hidden on small screens, and screen-reader users often hear links as a list.
- **Write snippets that add to the label**, giving the gist of the page; do not repeat the label or leave an obscure term unexplained.
- **Use images that represent the category**, with a true member, not a convenient one.
- **Close the loop on the landing page.** The first screenful must confirm "you are in the right place"; otherwise the good scent of the link is wasted.
- **Do not bait.** Clickbait lowers the scent of every later link by eroding trust.
- **Beware the right rail:** NN/g notes content there may be taken for an ad and discounted.

### Pick the IA method by the question
| Question | Method | Notes (NN/g) |
|---|---|---|
| How do people group and name this content? | **Open card sort** (generative) | Participants make their own groups and labels; the labels are often not final names |
| Does my proposed structure work? | **Tree test** (evaluative) | Text-only hierarchy; metrics are success and directness |
| Do my categories hold the cards? | Closed card sort | NN/g prefers a tree test for validating navigation categories |
| Is the finished screen findable? | Task test | See `uxres-usability-testing-five-users-and-beyond.md` |

- **Generate, then evaluate.** Card sort to produce options, tree test to compare them.
- **Card sort sizing:** 30-50 cards (past about 50, people dump into a "Miscellaneous" pile and you cannot tell confusion from fatigue). Qualitative at least 15 participants per group, with think-aloud; quantitative at least 30-50.
- **Card sort limits:** cards are judged out of context; only one level of categories is produced; users' mental models differ, so results need interpretation.
- **Avoid hybrid sorts** with predefined categories; they bias results.
- **Tree test setup:** a complete named hierarchy down to leaf level; each task has a defined correct location; tasks must not contain the exact category label; start with an easy warm-up; compare alternatives between-subjects (each person sees one tree).
- **Tree test metrics:** success (reached the right place), directness (went straight vs backtracked; low directness suggests ambiguous labels or low confidence), plus time and wrong categories chosen.
- **Tree test limits:** unmoderated runs capture no reasoning (add a post-test survey, pilot moderated); only leaf nodes count as correct, though real category pages also hold content; no visual design, so mega-menus are not represented.
- **Counts for tree tests are not fixed in the fetched source.** Treat any number you pick as a house default and say so.

## Anti-patterns (don't)
- **Vague links:** "More", "Details", "Resources", "Solutions".
- **Internal vocabulary** as navigation: team names, product codenames, jargon the audience does not use.
- **Same label, different destinations**, or different labels for one destination.
- **A card sort of 150 items**, or one used to name final navigation without a follow-up tree test.
- **Tree tests with leaked labels**, so success measures matching strings.
- **Snippets that repeat the title**, or search results with identical titles and no differentiator.
- **Drill-downs whose target does not echo the label clicked** (click "Churn", land on "Reports").
- **Quoting the theory as proof** for a specific layout; it supports the principle, not a pixel rule.

## Good references
- [NN/g, Information Scent](https://www.nngroup.com/articles/information-scent/) — the practical labelling, snippet and landing-page rules, task-relative definition.
- [NN/g, Tree Testing](https://www.nngroup.com/articles/tree-testing/) — requirements, metrics and honest limits, and the card-sort-then-tree-test sequence.
- [NN/g, Card Sorting: Uncover Users' Mental Models](https://www.nngroup.com/articles/card-sorting-definition/) — open vs closed, card counts and participant counts.
- [IxDF, Information Foraging Theory](https://ixdf.org/literature/book/the-glossary-of-human-computer-interaction/information-foraging-theory) — patch, scent, diet and attribution to Pirolli and Card (1999).
- [Fu and Pirolli, SNIF-ACT (2007)](https://research.google.com/pubs/archive/25938.pdf) — the computational model of link-following; full text read.

## Bad references
- **A label like "Learn more" under every card.** No scent; and links read out of context become a column of identical names.
- **"Information scent proves the mega-menu works."** Misuses a descriptive theory as a layout spec.

## Accessibility
- Link text must make sense out of context (WCAG's link-purpose criteria rest on the same idea); a list of links read by a screen reader is a list of scents.
- Give repeated "Read more" links distinct accessible names, or better, drop them in favour of specific text. Detail: `ffound-form-accessibility.md` for forms; `comp-icons-and-labels.md` for icon-only controls.
- Recruit participants with assistive technology for the tree test and task test as their own group.

## Motion / interaction (if relevant)
- A drill-down transition should preserve the label clicked so the landing page confirms scent (shared-element or matching heading). Motion is secondary; the heading text carries the confirmation.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Cards per sort | 30-50 | Sourced, NN/g |
| Qualitative sort | at least 15 per group | Sourced, NN/g |
| Quantitative sort | at least 30-50 | Sourced, NN/g |
| Banned link labels | "More", "Learn more", "Click here" | NN/g names the first two; third is a house default |
| Tree-test sample | not sourced | House default; state it |

## Implementation sketch
A scented link: specific name, a snippet that adds information, and a landing heading that echoes the label.

```html
<a href="/billing/invoices" aria-describedby="s1">Invoices and receipts</a>
<p id="s1">Download PDFs, resend by email, change the billing contact.</p>
<!-- landing page -->
<h1>Invoices and receipts</h1>
```

## How a UI builder uses this
- For each navigation item, write the user's task it serves in one line; if the label would not make that person click, rename it.
- Replace every "More" or "Learn more" with the specific noun.
- When structure is disputed, run an open card sort for options and a tree test for the chosen tree before building.

**Tests the reader can run**
- Show five people only the labels and ask where they would click for three tasks; count correct first clicks. (A quick tree-test substitute; the counts are small, so report "x of 5".)
- Extract all link texts on a page (`document.querySelectorAll('a')`) and list duplicates and generic ones; any duplicate pointing to different URLs fails.
- On every landing page, check that the `h1` matches the label of the link that led there.

Applied by: `comp-app-shell-navigation.md`, `monav-bottom-nav-tabs-drawers.md`, `comp-command-palette-search.md`, `comp-tabs-segmented-pills.md`, `mksect-footer.md`, `found-progressive-disclosure.md`, `ref-ux-research-findings.md`, `data-loading-empty-error-states.md`, and `uxres-usability-testing-five-users-and-beyond.md`.

## Checklist
- [ ] No link, tab or button is labelled "More", "Learn more" or "Click here".
- [ ] Each label is understandable for a named task without surrounding context.
- [ ] Each landing page confirms the label clicked in its first screenful.
- [ ] Snippets add information beyond the title.
- [ ] Structure decisions: card sort (30-50 cards) for options, tree test for the final tree.
- [ ] Tree-test tasks do not contain the category labels.
- [ ] Participant counts stated, with sourced vs house default marked.

## Sources
- https://www.nngroup.com/articles/information-scent/ (fetched; Budiu, 2 Feb 2020)
- https://www.nngroup.com/articles/tree-testing/ (fetched; 6 Aug 2023)
- https://www.nngroup.com/articles/card-sorting-definition/ (fetched)
- https://ixdf.org/literature/book/the-glossary-of-human-computer-interaction/information-foraging-theory (fetched)
- https://research.google.com/pubs/archive/25938.pdf (fetched, full text read; Fu and Pirolli 2007)
- Pirolli and Card 1999, Psychological Review 106(4) 643-675, DOI 10.1037/0033-295X.106.4.643 (bibliographic record via Crossref; full text not read; the theory is described in Fu and Pirolli 2007, section 2.1)
- Repo: `found-progressive-disclosure.md`, `ref-ux-research-findings.md`, `comp-app-shell-navigation.md`, `monav-bottom-nav-tabs-drawers.md`, `comp-command-palette-search.md`, `comp-tabs-segmented-pills.md`, `mksect-footer.md`, `comp-icons-and-labels.md`, `data-loading-empty-error-states.md`, `ffound-form-accessibility.md`, `found-visual-hierarchy.md`
