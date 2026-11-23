# Fitts' and Hick's laws: the right formulas and the common misuse

> Fitts' law is a strong pointing model that justifies bigger, nearer targets; Hick's law only holds for learned, equally likely choices and is a weak reason to cut a menu, so cite each only inside its limits.

**Category:** Foundations · **Applies to:** buttons, touch targets, toolbars, menus, nav, pickers, action placement · **Priority:** should

## When to use / when not
- **Use** when a review says "bigger target, Fitts" or "fewer options, Hick" and you must decide whether the argument holds.
- **Use** to pick which repo pattern carries the real numbers.
- **Not** a source of pixel sizes: sizes come from WCAG, Apple HIG and Material (`mofound-touch-targets.md`), not from the equation.
- **Not** a reason to cut features: Hick says nothing about menus with unfamiliar, unordered items beyond "scanning is slower".

## Evidence grade
| Law | Grade | Fetched basis | Limit |
|---|---|---|---|
| Fitts | **Strong** for pointing on a screen | Crossref confirms Fitts, J. Exp. Psychology 47(6), 381-391, 1954, "The information capacity of the human motor system in controlling the amplitude of movement". MacKenzie 1992 abstract (fetched at yorku.ca): movement modelled "by analogy to the transmission of information", with a refined index of difficulty, and "tremendous inconsistencies" in how studies measure performance. | Fitts' full text read (APA centennial reprint, Princeton course mirror): eq. 1 `Id = -log2(Ws/2A)` bits/response, eq. 2 `Ip = (1/t)(-log2(Ws/2A))` bits/sec; best conditions 10.3-11.5 bits/sec. Device constants and 2-D width handling vary by study. |
| Hick-Hyman | **Established, narrow** | Crossref confirms Hyman, J. Exp. Psychology 45(3), 188-196, 1953, "Stimulus information as a determinant of reaction time". | Full text and abstract unreachable: Hyman is closed on Semantic Scholar (`CLOSED`, abstract elided), Hick 1952 (QJEP 4, 11-26) is paywalled and the Iowa mirror returns 404. The formula below stays secondary (Wikipedia, per `r2-gaps.md`); still unverified against either primary. |

## Rules (do)
- **Fitts, Shannon form (the HCI standard):** `MT = a + b * log2(A / W + 1)`, where A is distance to the target, W its width along the movement axis, a and b are constants fitted per device and user group (MacKenzie 1992, fetched, eq. 10). Fitts' original index was `-log2(Ws/2A)`, i.e. `log2(2A/W)` (Fitts 1954 eq. 1, read in the reprint); MacKenzie prefers the Shannon form because it cannot go negative and predicts slightly better.
- **Use effective width for measured data:** `We = 4.133 * SD` of endpoint coordinates (MacKenzie, fetched).
- **Design consequences that hold:** time falls as the target gets larger along the movement axis or nearer. So make frequent targets large, put them near where the pointer or thumb already is, and use screen edges and corners on desktop because the pointer stops there (an inference from the model, labelled as such).
- **Do not use the equation to compute a size.** a and b are not published for your device. Use the platform minimums: WCAG 2.5.8 24 CSS px, Apple 44 pt, Material 48 dp (`mofound-touch-targets.md`).
- **Fitts is 1-D point-to-target.** Menu paths with corners and nested submenus are steering tasks (Accot-Zhai steering law, per `r2-gaps.md`); give diagonal tolerance or a hover delay rather than invoking Fitts.
- **Hick, as found:** `T = b * log2(n + 1)` for n equally probable choices (secondary source; do not add an intercept without a primary).
- **Apply Hick only when** choices are familiar, equally likely and the user knows the target; elsewhere choice time grows more like a scan. Order alphabetically or by frequency, group, and use search past about 7-10 items (house default).
- **Never combine**: "fewer buttons so Fitts and Hick are both happy" is two claims; test each.

## Anti-patterns (don't)
- Writing `RT = a + b log2(n+1)` as if Hick's paper said so.
- Shrinking a menu to "reduce Hick" while hiding frequent actions behind another click, which adds a task step.
- Giant buttons everywhere because "Fitts": hit area, not glyph, must be large; keep spacing.
- Citing Fitts for the thumb zone without noting that reach is anatomical, not log-linear (`mofound-thumb-zones-reach.md`).
- Random-order long menus defended with "log time".
- Mixing "7 plus or minus 2" into Hick (a separate, contested claim).

## Good references
- [MacKenzie 1992, Fitts' law as a research and design tool in HCI](https://www.yorku.ca/mack/hci1992.html): the Shannon form, effective width, and warnings about inconsistent measurement.
- [Fitts 1954 full text (reprint, Princeton course mirror)](https://www.cs.princeton.edu/courses/archive/fall08/cos436/FittsJEP1954.pdf): eq. 1 and 2, read directly. [Hyman 1953 via DOI](https://doi.org/10.1037/h0056940): bibliographic data confirmed through Crossref only.
- Repo: `mofound-touch-targets.md`, `mofound-thumb-zones-reach.md`.

## Bad references
- Wikipedia pages used as the only source for formulas; fine for orientation, not for a pattern's numbers.
- Laws-of-UX style summaries that state Hick as "more choices always means slower".

## Accessibility
- Larger, spaced targets help motor-impaired users; WCAG 2.5.8 sets the floor and 2.5.5 (AAA) 44 px.
- Do not rely on edge targets for pointer-only users; keyboard and switch users bypass Fitts entirely, so keep a logical focus order.
- Hover-delay for submenus also helps tremor; make it configurable if you can.

## Motion / interaction
- Do not animate targets away from the pointer; moving targets break the model's assumption of a fixed W and A.
- Avoid enlarging a target only on hover: the first approach still uses the small size.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--target-min` | 24px (44px coarse) | house rule in `mofound-touch-targets.md` |
| Target spacing | about 8px | same pattern |
| Long list threshold | 7-10 items (house default) | add grouping or search |
| We | 4.133 * SD | measurement only |

## Implementation sketch
```css
.btn { min-block-size: 24px; min-inline-size: 24px; }
@media (pointer: coarse) { .btn { min-block-size: 44px; min-inline-size: 44px; } }
/* hit area bigger than the glyph */
.icon-btn { position: relative; }
.icon-btn::after { content: ""; position: absolute; inset: -10px; }
```
```ts
// Fitting a and b for your own device: collect (A, W, MT) trials, regress MT on log2(A/We + 1).
const id = (a: number, we: number): number => Math.log2(a / we + 1);
```

## How a UI builder uses this
### Rules (do)
1. Size from platform minimums, not from the equation.
2. Make the most frequent action the largest and nearest to where the hand rests.
3. Keep Hick for ordered or familiar lists; otherwise group, order and search.
4. Cite each law with its grade and limit.
5. Never invent constants; fit your own or say "house default".

### Tests the reader can run
- **Pointing trial:** 10 trials per size on your target device, plot MT against `log2(A/W+1)`; if the line is flat the size is not your bottleneck.
- **Mis-tap log:** count mis-taps by element in analytics for a week; the high-miss targets get larger or more spacing.
- **Menu find test:** time five people locating a named item in the sorted and in a shuffled list; the gap is the cost of ordering.
- **Count test:** if a menu is under about 7 items, do not cite Hick to change it.

### Applied in the repo
`mofound-touch-targets.md`, `mofound-thumb-zones-reach.md`, `a11y-pointer-targets-dragging.md`, `monav-bottom-nav-tabs-drawers.md`, `monav-sheets-detents.md`, `comp-button-hierarchy.md`, `cpover-popover-menu-tooltip.md`, `ref-ux-laws-evidence-map.md`.

## Checklist
- [ ] Any Fitts argument uses the Shannon form and names the target axis.
- [ ] No pixel size derived from the equation.
- [ ] Hick cited only for familiar, equally likely choices.
- [ ] Hit area meets platform minimums with spacing.
- [ ] Long menus are ordered or grouped.
- [ ] Submenu paths are not argued with Fitts.
- [ ] Unfetched claims (Hick/Hyman form) are labelled secondary or house default.

## Sources
- https://www.yorku.ca/mack/hci1992.html (fetched; abstract, eq. 10, We = 4.133 SD)
- https://www.cs.princeton.edu/courses/archive/fall08/cos436/FittsJEP1954.pdf (Fitts 1954 full text, fetched and read; eq. 1-2)
- https://api.crossref.org/works/10.1037/h0055392 (Fitts 1954 bibliographic record, fetched)
- https://api.crossref.org/works/10.1037/h0056940 (Hyman 1953 bibliographic record, fetched)
- https://en.wikipedia.org/wiki/Fitts%27s_law and https://en.wikipedia.org/wiki/Hick%27s_law (secondary, from `r2-gaps.md`)
- Repo: `mofound-touch-targets.md`, `mofound-thumb-zones-reach.md`, `a11y-pointer-targets-dragging.md`, `monav-bottom-nav-tabs-drawers.md`, `monav-sheets-detents.md`, `comp-button-hierarchy.md`, `cpover-popover-menu-tooltip.md`, `ref-ux-laws-evidence-map.md`
