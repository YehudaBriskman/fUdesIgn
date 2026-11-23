# Choice architecture and dark patterns: nudge, or manipulation?

> Every default, order, label and exit path is a decision made for the user; make it one they would approve of if asked plainly, and make leaving as easy as entering.

**Category:** Foundations · **Applies to:** defaults, consent banners, signup and checkout flows, pricing, cancel and delete flows, notifications, A/B tests · **Priority:** must

## When to use / when not
- **Use** whenever you set a default, choose the order of options, write a button label on a consent or purchase step, or build any flow that someone can enter and later want to leave.
- **Not** legal advice. The regulatory sections below say what regulators have written, not what is lawful in your market. Ask counsel for that.
- **Not** a ban on persuasion: clear value, honest social proof and a sensible default are fine. The line is false beliefs, hidden costs, and friction against the user's interest.
- Evidence grades: **Strong** for prevalence and for the regulator's taxonomy (a field crawl and a staff report). **Moderate** for the size of any single pattern's effect. Do not quote a conversion percentage from one pattern as a general rule.

## Rules (do)
- **Run the two-question test on every choice-shaping decision.** (1) *Would the user choose this if asked plainly?* (2) *Is leaving as easy as entering?* A "no" to either is a defect, whatever the conversion lift. Both questions are house tests, built from the FTC categories below.
- **Treat a default as advice you give.** People often keep the default, so you chose for them. Johnson and Goldstein (Science 2003) found revealed organ-donation consent of 42% under opt-in against 82% under opt-out (161 online respondents). Madrian and Shea (NBER w7682) report the same direction for 401(k) enrolment. Preselect only what a typical user would pick when asked, and never a consent, a data share or a paid add-on. A high rate under an opt-out default is not evidence of informed choice.
- **Show the total price at the start.** The FTC report cites a ticketing study where users not shown fees upfront spent about 20% more and were 14% more likely to complete. If a mandatory fee exists, it is in the first price shown.
- **State recurring charges in the same prominence as the free offer.** The FTC report describes an experiment where the charge sat in small grey text and more than twice as many people accepted the trial as in the control group. Put the trial length, the price after it, and the cancel method next to the button.
- **Give accept and decline equal weight.** Same size, same style tier, same screen. Where a refusal needs more steps than acceptance, it is a dark pattern in the FTC privacy category ("highlight a choice ... while greying out the option").
- **Make cancel, delete and opt-out reachable by the route used to enter.** If signup took one page online, cancellation must not need a call. Name the link "Cancel subscription", not "Manage".
- **Write neutral labels.** "Yes, send me offers" and "No, do not send offers", never "No, I do not like saving money" (confirmshaming, NN/g; label craft in `uxwrt-ux-writing-and-content-design.md`).
- **Only claim urgency and scarcity that is true.** A countdown must end the offer when it reaches zero; "3 left" must reflect stock. The FTC report lists fake timers, false low-stock and false "others are viewing" claims under false beliefs.
- **Do not repeat a refused prompt.** Store the decline; ask again only when context really changes.
- **Audit A/B tests for harm, not only lift.** The FTC report notes that testing at scale finds the most effective deceptive variant easily. Add a guardrail metric (cancellations, refunds, complaints) beside conversion.

### How a UI builder uses this
1. List every default, preselected control and ordering in the change. For each, apply the two-question test and write the answer in the PR.
2. Walk the cancel path from the account page with a stopwatch and count steps. Compare with the steps to sign up. Record both numbers in the review.
3. Put the accept and decline controls side by side and compare their computed size, colour tier and position. They must match.
4. Search the copy for countdowns, "only N left", "N people viewing", and confirm each is driven by real data.

## Anti-patterns (don't)
- **False beliefs**: ads styled as editorial, comparison tables ranked by commission (FTC).
- **Hidden or delayed disclosure**: limits buried in terms; drip pricing (FTC).
- **Unauthorized charges**: a free trial that rolls into a charge without clear notice (FTC).
- **Obstruction**: cancellation by phone only, or through pages of retention offers with no "cancel" word (FTC ABCMouse example).
- **Nagging**: repeated prompts for a refused setting (FTC, NN/g).
- **Confirmshaming**: a decline label that insults the user.
- **Preselection** of a consent, newsletter or paid add-on.
- **Trick wording**: a toggle whose on-state means "do not share"; double negatives.
- **Hiding the decline**: "Accept all" as a button, "Manage options" as a grey link.
- **Sludge** on the user's path to their own goal, while the provider's path is smooth (NN/g).

## Good references
- [FTC, Bringing Dark Patterns to Light (staff report, Sept 2022)](https://www.ftc.gov/reports/bringing-dark-patterns-light) — the four categories used here, each with enforcement examples and the drip-pricing and free-trial findings above. Read the PDF, not only the landing page.
- [Mathur et al., Dark Patterns at Scale (CSCW 2019)](https://arxiv.org/abs/1907.07032) — about 11K shopping sites and about 53K pages crawled; 1,818 instances in 15 types and 7 categories. Gives prevalence, not effect sizes.
- [NN/g, Deceptive Patterns](https://www.nngroup.com/articles/deceptive-patterns/) — plain-language names (obstruction, nagging, confirmshaming, preselection, sludge) and the point that harm falls harder on time-poor and low-literacy users.
- [deceptive.design, Types](https://www.deceptive.design/types) — an 18-name vocabulary for review comments.
- [GOV.UK Design System, Radios](https://design-system.service.gov.uk/components/radios/) — avoids a preselected answer on questions because people miss it.

## Bad references
- Any signup that needs a phone call to cancel: the FTC ABCMouse complaint describes consumers who could not cancel after repeated calls, emails and form submissions despite an "Easy Cancellation" promise.
- Cookie banners with a front-and-centre accept and the refusal behind several screens: named in the FTC privacy section.
- Quoting one pattern's conversion lift as proof it "works": it measures extraction, not user benefit.

## Accessibility
- Equal-weight accept and decline also means equal keyboard order and equal hit area (24 by 24 CSS px minimum, WCAG 2.2 target size, see `a11y-pointer-targets-dragging.md`).
- Dark patterns hit people with cognitive disabilities and low literacy hardest (NN/g). Plain labels, one decision per screen and visible cancel are accessibility work too.
- Timers: a real time limit needs a warning and a way to extend, turn off or adjust it (WCAG 2.2.1 Timing Adjustable). A fake one fails twice.

## Motion / interaction (if relevant)
- Do not animate the preferred choice (pulse, bounce) while the alternative is static, and do not show the decline later than the accept.
- A fake "processing" delay used to make a result seem more valuable is deceptive when nothing is processing; use real progress only (see `prog-perceived-performance-thresholds.md`).

## Regulatory context (read, then ask counsel)
- **FTC (US)**: the staff report ties dark patterns to Section 5 of the FTC Act (unfair or deceptive acts) and ROSCA (online negative-option sales must give a simple cancellation mechanism). It lists four categories: false beliefs, hidden or delayed disclosure, unauthorized charges, and obscured privacy choices.
- **EU Digital Services Act, Article 25**: addresses deceptive or manipulative interface design on online platforms. Its wording was not read for this note; open the Official Journal text at https://eur-lex.europa.eu/eli/reg/2022/2065/oj before citing it.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Accept and decline weight | identical size, tier, position | consent and purchase steps |
| Cancel steps | at most the steps to sign up | any subscription or account |
| Total price shown | first price displayed | checkout, pricing |
| Re-ask after decline | not within the same context | consent, notifications |

The step counts are house defaults derived from the FTC categories, not sourced thresholds.

## Implementation sketch
```html
<div role="group" aria-labelledby="consent-title" class="consent">
  <h2 id="consent-title">Allow analytics cookies?</h2>
  <button type="button" class="btn" data-choice="accept">Allow</button>
  <button type="button" class="btn" data-choice="decline">Do not allow</button>
</div>
<style>
  .consent { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .consent .btn { min-block-size: 44px; padding-inline: 1.25rem; } /* same rule for both */
</style>
```

## Checklist
- [ ] Every default passes "would the user pick this if asked plainly?".
- [ ] No preselected consent, share or paid add-on.
- [ ] Total price, recurring charge and cancel method sit next to the buy button.
- [ ] Accept and decline match in size, tier, position and key order.
- [ ] Cancel route steps do not exceed signup steps; measured, not assumed.
- [ ] Urgency and scarcity claims are backed by live data.
- [ ] A/B tests carry a guardrail metric for refunds, cancellations and complaints.
- [ ] Refused prompts are remembered.

## Related repo patterns
`finput-choice-controls.md` (defaults and preselection), `mkfound-cta-and-conversion.md`, `mkref-anti-patterns-gallery.md`, `mksect-pricing-tables.md`, `mksect-social-proof.md`, `aifound-privacy-consent-data-use.md`, `cpover-dialog-focus-and-dismissal.md` (confirmation dialogs), `cpover-toast-and-feedback.md`, `ref-ux-laws-evidence-map.md` (row 19, default effect), `uxcog-cognitive-biases-graded.md` (which biases these patterns exploit), `alaw-legal-landscape.md`, `found-methodology-explainability.md` (misleading charts are deception too), `aifound-uncertainty-and-disclaimers.md`.

## Sources
- FTC staff report, Bringing Dark Patterns to Light, Sept 2022: https://www.ftc.gov/reports/bringing-dark-patterns-light ; PDF read in full (48 pages): https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf
- Mathur et al., Dark Patterns at Scale: https://arxiv.org/abs/1907.07032 (abstract-level figures)
- NN/g, Deceptive Patterns: https://www.nngroup.com/articles/deceptive-patterns/
- deceptive.design types: https://www.deceptive.design/types
- Johnson and Goldstein 2003, Do defaults save lives? Science 302(5649):1338-1339; author PDF https://www.dangoldstein.com/papers/DefaultsScience.pdf (opt-in 42%, opt-out 82%, n = 161; country comparison is correlational)
- Madrian and Shea, NBER w7682 (as cited in `finput-choice-controls.md`)
- Repo: `plugins/ux-foundations/`, patterns named above
