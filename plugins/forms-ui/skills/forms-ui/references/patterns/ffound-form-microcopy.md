# Form microcopy: questions, buttons and reassurance

> Write labels as the plain question, buttons as the verb + object of what happens next, and add one line of reassurance where people hesitate (why we ask, what happens next, what it costs); cut every other word.

**Category:** Form foundations · **Applies to:** labels, hints, legends, buttons, confirmation pages, empty and success states of forms · **Priority:** should

## When to use / when not
- **Every form.** Copy is the interface of a form: most of the screen is labels, hints and buttons.
- Error message wording has its own file: `fvalid-error-messages.md`.
- Confirmation dialogs for destructive actions are in `comp-overlay-choice.md` (dashboard-ui) and `fflow-submit-buttons-and-double-submit.md`.

## Rules (do)
- **Plain words at a reading age of about 9** (GOV.UK's target). "Date of birth", not "DOB"; "Postcode", not "Postal code identifier".
- **Labels**: noun phrase ("Email address") on multi-field pages; the full question ("What is your email address?") on one-question pages, where it doubles as the heading.
- **Say why you ask** anything personal or surprising, in the hint: "We use this to send your receipt", "We'll only call if delivery fails". Baymard found unexplained phone and birth-date fields are a common abandonment trigger.
- **Buttons say what happens**: "Create account", "Pay £24.00", "Send invitation", "Save changes". Not "Submit", "OK" or "Continue" on a final step. On multi-step flows, "Continue" for steps and a specific verb for the last one (GOV.UK: "Continue" then "Accept and send"). The modern-web-guidance forms guide asks for actionable labels and for the exact amount on pay buttons.
- **Same words everywhere for the same thing.** If the label says "Work email", the error and the confirmation say "work email" too.
- **Before the form**: say what people need to have ready and how long it takes ("You'll need your passport. This takes about 10 minutes."), for anything longer than one screen (GOV.UK start pages).
- **After submit**: a confirmation that names what happened, a reference number if any, what happens next and when ("We've sent a confirmation to a@b.com. We'll reply within 2 working days."). GOV.UK's confirmation page pattern.
- **Sentence case** for labels, buttons and headings; no ALL CAPS; no exclamation marks in errors.
- **Second person, active voice**: "We'll email you", "You can change this later".
- **Numbers and limits concrete**: "8 or more characters", "Up to 10 MB", "PDF, JPG or PNG". Never "File too large" without the limit.
- **Checkbox labels say what checking means**: "Email me about new features", not "Newsletter". Never phrase a consent box in the negative ("Uncheck to not receive…").
- **Link text** inside forms names the destination: "Read the privacy notice (opens in new tab)".

## Anti-patterns (don't)
- "Submit", "Go", "OK" as the primary button.
- Buttons whose verb differs from the heading ("Create your account" … [Register]).
- Jargon and internal names in labels ("Tenant ID", "SKU code") for consumer users.
- Double negatives in consent checkboxes; pre-ticked marketing consent (unlawful under GDPR consent rules in the EU and UK).
- "Are you sure?" with "Yes / No" buttons. Name the action: "Delete project" / "Keep project".
- Humour or blame in errors ("Oops! You broke it").
- Reassurance walls: a paragraph of legal text above every field.

## Good references
- [GOV.UK — Writing for GOV.UK](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) — plain English, reading age, front-loading.
- [GOV.UK Design System — Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/) — what happened, the reference, what happens next.
- [GOV.UK Design System — Start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/) — what you need and how long it takes, before the form.
- [GOV.UK Design System — Button](https://design-system.service.gov.uk/components/button/) — short verb-led button text that says what happens.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — actionable submit labels, the amount on pay buttons.
- [NN/g — OK–Cancel or Cancel–OK?](https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/) — order matters less than specific labels.

## Bad references
- [NN/g — Error-message guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — its examples of vague, blaming and jargon-filled messages ("An error occurred").
- Checkout pages with a "Submit" button that actually charges a card: the label hides the consequence that WCAG 3.3.4 asks you to make explicit.

## Accessibility
- Button labels must make sense out of context (screen reader button lists): "Remove item: Blue mug", not "Remove".
- Avoid "click here" and directional words ("the button on the right").
- Keep reading level plain (WCAG 3.1.5 is AAA, but it helps everyone, including people filling in a second language).

## Motion / interaction (if relevant)
- None.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Reading age | ~9 years (GOV.UK) | All labels, hints, buttons |
| Button label | 1–4 words, verb first | Primary and secondary actions |
| Hint length | ≤ 1 sentence, ≤ ~20 words | Per field |
| Pay button | "Pay " + formatted amount | Payment submit |

## Implementation sketch
```html
<p class="lede">You'll need your order number. This takes about 3 minutes.</p>
<form action="/returns" method="post">
  <div class="field">
    <label for="order">Order number</label>
    <p id="order-hint" class="hint">It's in your confirmation email and starts with "A".</p>
    <input id="order" name="order" aria-describedby="order-hint" autocomplete="off" spellcheck="false">
  </div>
  <div class="field-check">
    <input type="checkbox" id="updates" name="updates">
    <label for="updates">Email me when the refund is sent</label>
  </div>
  <button type="submit" class="btn-primary">Start return</button>
</form>
```
```ts
// Pay-button label with the exact, locale-formatted amount.
export function payLabel(amountMinor: number, currency: string, locale: string): string {
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  const amount = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountMinor / 10 ** digits)
  return `Pay ${amount}`
}
```

## Checklist
- [ ] Labels are plain, specific and consistent with errors and confirmations.
- [ ] Every surprising or personal field says why it is asked.
- [ ] Buttons are verb + object; the final step names its consequence (and amount).
- [ ] Long forms say up front what you need and how long it takes.
- [ ] The confirmation says what happened, the reference and what happens next.
- [ ] No pre-ticked consent, no double negatives, no "Are you sure?" with Yes/No.

## Sources
- https://www.gov.uk/guidance/content-design/writing-for-gov-uk
- https://design-system.service.gov.uk/patterns/confirmation-pages/
- https://design-system.service.gov.uk/patterns/start-using-a-service/
- https://design-system.service.gov.uk/components/button/
- https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/
- https://www.nngroup.com/articles/error-message-guidelines/
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/ (no pre-ticked boxes)
