# Completion and end states

> End every flow on a clear, specific success state that says what happened and what comes next; never end on an error, a dead end or a blank page, and spend design effort on the single worst moment of the flow (a rejected payment, a failed upload, a timeout) because that is where people judge the whole thing.

**Category:** Flows · **Applies to:** submit results, checkout and application confirmations, onboarding finish, failed or partial submits, account deletion and cancellation · **Priority:** should

## When to use / when not
| Situation | End state |
|---|---|
| Submit succeeded, user needs nothing more | Confirmation page or panel: what happened, reference, what's next |
| Submit succeeded, a follow-up exists (verify email, upload a document, wait for review) | Same, with the next step as the one primary action |
| Submit failed, answers intact | Inline error with a retry; the form stays (`fflow-submit-buttons-and-double-submit.md`) |
| Submit failed, cannot be fixed here (declined card, service down) | Plain reason, a different route (other payment method, contact), and the saved draft |
| Cancellation or deletion | Confirm what was removed and how to undo or return |
| Tiny, reversible action (toggle, "Saved") | Quiet inline status only; do not build a celebration |

## The evidence, and its limits
- The peak-end rule says people retrospectively judge an episode mostly by its most intense moment and its ending, not by an average. The lab basis is Kahneman, Fredrickson, Schreiber and Redelmeier (1993): participants held a hand in 14 °C water for 60 s, or for 60 s plus 30 s in water about 1 °C warmer, and chose to repeat the longer trial because its ending was less unpleasant.
- That is **lab evidence for retrospective evaluation of a short, uniform episode**. It is not a measured UI effect. The product examples usually cited (Mailchimp's send animation, Uber's waiting screens) are **anecdotal**: nobody has shown a completion screen changes recall or retention by a known amount.
- So treat it as a prioritisation hint, not a law. It is **not** a licence to neglect the middle of a flow, and not a reason to add delight to a task that failed.

## Rules (do)
- **Say what happened, specifically.** "Application submitted" beats "Success"; name the thing ("Your order #4821 is placed") and keep the reference visible and copyable.
- **Give one next step.** State what happens now and when ("We'll email a decision within 5 working days"), then offer one primary action (`Track order`, `Add a payment method`). Secondary links stay secondary.
- **Make the result findable again**: a confirmation email or a page the user can return to, and a printable or savable reference where the outcome matters (applications, payments).
- **Never end on an error or dead end.** Every failure screen offers a way forward: retry, edit the answer, another route, or a human. No "Something went wrong" alone (`fvalid-error-messages.md`).
- **Recover the worst moment first.** Find the step where users fail or wait most (failed payment, file rejected, session timeout) and make it the best-designed screen: keep every answer, explain the cause in plain words, put the fix next to the message, and keep the draft.
- **Partial success is stated as such**: "2 of 3 files uploaded; retry the failed one", not a green banner over a red problem.
- **Move focus to the result** (its `<h1>` or `role="status"` region) so keyboard and screen-reader users land on it (WCAG 4.1.3 for status messages).
- **Keep the celebration proportionate.** Match tone to the stakes: an illustration for a finished onboarding is fine; for a tax filing, a calm confirmation. Do not delay the result with an animation.
- **Close the loop on reversibility**: after delete or cancel, show what was removed and an undo or reactivate path for as long as it truly exists, and state the deadline.

## Anti-patterns (don't)
- Redirecting to the homepage with no confirmation after a submit.
- A confirmation that omits the reference, the next step or the timeline.
- Ending an onboarding on a settings page full of empty states.
- A final screen that is an error with only "Try again" and no cause.
- Success wording over a failed or partial result.
- Upsell, survey or referral prompts as the primary content of the confirmation, crowding out the next step.
- Confetti or a long animation on a failure recovery or a regulated submission.

## Good references
- [GOV.UK Design System — Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/) — a clear panel, the reference number, "what happens next" and an email copy.
- [Laws of UX — Peak-End Rule](https://lawsofux.com/peak-end-rule/) — a summary of the Kahneman et al. study and the usual product examples; read the examples as illustrations, not proof.

## Bad references
- Checkout flows that show a generic "Payment failed" page with only a back button, discarding the basket and address: the worst moment of the flow is also its end.
- Confirmation screens that are mostly a promotion with the order reference hidden below the fold.

## Accessibility
- The result is announced: focus the heading, or put the message in a `role="status"` region that exists in the DOM before it changes.
- Success and failure differ by text and icon, not colour alone (WCAG 1.4.1).
- Any animation respects `prefers-reduced-motion` and never carries the only information.
- Reference numbers are real text (selectable, readable by assistive tech), not an image.

## Motion / interaction (if relevant)
- Show the result at once. A short fade (≤ 150 ms) or none; any celebratory animation is decorative, skippable and off under reduced motion (house default).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Result heading | `h1`, focus target (`tabindex="-1"`) | Confirmation, failure |
| Next-step action | one primary button, ≥ 44 px on touch | After success |
| Result panel | `--surface-success` or `--surface-danger` plus icon and text | Outcome |
| Reference | `--font-mono`, selectable, with a copy button | Order or case number |

## Implementation sketch
```html
<main>
  <section class="result" aria-labelledby="done-title">
    <h1 id="done-title" tabindex="-1">Application submitted</h1>
    <p>Reference <strong class="ref">HDJ-2R7-KQ4</strong></p>
    <h2>What happens next</h2>
    <p>We'll email a decision within 5 working days. You can check progress at any time.</p>
    <a class="btn-primary" href="/applications/HDJ-2R7-KQ4">View your application</a>
  </section>
</main>
```
```ts
// After a successful submit, move focus to the result heading.
export function showResult(): void {
  const h = document.getElementById('done-title')
  if (h instanceof HTMLElement) h.focus()
}
```

## Checklist
- [ ] The success state names what happened, shows a reference and says what happens next.
- [ ] There is one primary next step; other links are secondary.
- [ ] No failure screen ends without a retry, an edit or another route, and answers are kept.
- [ ] The worst step of the flow (payment, upload, timeout) has been walked and recovers cleanly.
- [ ] Partial success is described as partial.
- [ ] Focus or a status region announces the result.
- [ ] Tone and animation match the stakes and respect reduced motion.

## Sources
- https://lawsofux.com/peak-end-rule/
- https://design-system.service.gov.uk/patterns/confirmation-pages/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- Kahneman, Fredrickson, Schreiber, Redelmeier (1993), "When More Pain Is Preferred to Less: Adding a Better End", Psychological Science 4(6) (as summarised on lawsofux.com; the paper itself was not fetched)
