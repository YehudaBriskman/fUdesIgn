# UX writing and content design

> Start from what the user is trying to do, write the shortest text that is specific and honest about what happens next, and review copy with the same gates as code.

**Category:** Foundations · **Applies to:** labels, buttons, links, errors, empty states, notices, tooltips, headings, any string a user reads · **Priority:** must

## When to use / when not
- **Use** for every user-facing string, before the string reaches a design file or a translation file.
- **Use** when reviewing a UI where the layout is fine but users still hesitate, misclick or abandon at a label.
- **Not** brand strategy or long-form editorial. The sources here cover short interface copy; there is no fetched evidence for long-form claims.
- **Not** a replacement for the narrower patterns: data labels live in `found-microcopy-for-data.md`, form hints in `ffound-form-microcopy.md`, validation in `fvalid-error-messages.md`. This file is the process and the shared rules above them.

## Rules (do)
- **Start with the user need, not the screen.** GOV.UK's content-design principles open with "start with user needs", then the amount, format and placement of content, then plain English, then keeping it current. Write the sentence "the user wants to ___" before writing any copy; if you cannot finish it, the string probably should not exist.
- **Write plain language, including for experts.** NN/g's definition: plain language "can be understood the first time your audience reads or hears it", and its research with educated users supports concise, scannable writing even for experts (Loranger, 2017). The page gives no participant count, so treat it as qualitative.
- **Lead with the keyword.** Headings and labels carry meaning in their first words (this is information scent, `uxres-information-scent-and-ia-methods.md`); users scan, they do not read. NN/g's "First 2 Words" research looked at how well users understood the first 11 characters of links and headlines. Put the object or verb first: "Export report", not "Click here to export your report".
- **Name the command by what happens after.** A headline tells users where they are; a command label tells them what the action does. Use a verb plus object ("Delete project", "Save changes"). Avoid bare "OK", "Submit", "Yes".
- **Links pass the 4 S test** (NN/g, Moran 2019): specific (says what is behind it), sincere (the click delivers exactly that), substantial (reads alone, because users scan labels), succinct (shortest wording that still passes the other three; important words first). NN/g's own line: "Learn more is the new Click here". Replace with the destination: "Read the refund policy".
- **A link is a promise.** If the label says "Book" and a popup asks for contact details, the label is wrong, not the popup. NN/g records a participant stuck in exactly that case.
- **Errors say what, why, and what to do.** Following NN/g's error-message guidelines (Neusesser and Sunwall, 2023): put the message next to its source; use human-readable language and keep codes for diagnostics; be concise and precise ("An error occurred" has no context); offer a remedy; keep the user's input; do not blame. Words NN/g flags: "invalid", "illegal", "incorrect". Say "Enter an email like name@example.com" instead of "Invalid email".
- **No humour in errors.** NN/g says to avoid it, and counts puns in place of a clear message as a bad example. The one exception it describes is catastrophic outage pages, paired with an apology; treat that as a judgement call, not a default.
- **Do not flag errors early.** NN/g calls errors fired on first focus loss a "hostile pattern". Validate on blur only after the user has typed, or on submit (see `fvalid-error-messages.md`).
- **Pick tone by context, in four dimensions.** NN/g names humour, formality, respectfulness and enthusiasm. Set each for the situation: a payment failure is serious and low on enthusiasm; a first-run welcome can be warmer. Write the position in a tone note, not an adjective like "friendly".
- **Empty states explain and offer one next step.** Say why it is empty, what will appear here, and give the primary action (see `aichat-empty-state-and-suggestions.md`, `data-loading-empty-error-states.md`).
- **One term per concept.** If the nav says "Projects", the page title, the button ("New project") and the error ("Project not found") say so too. Keep the glossary with the strings.
- **Keep strings whole.** Never build a sentence from fragments; translators need the full phrase and plural forms (`i18n-string-externalisation.md`).
- **Content is maintained.** GOV.UK lists "keep it current" as a principle. Give each string an owner and remove copy that describes a removed feature.

## Anti-patterns (don't)
- **"Learn more" / "Click here" / "Get started" as the only label.** NN/g has dedicated articles against each; they fail "specific".
- **Lorem ipsum in a review.** Layout approved on fake text hides every length and tone problem.
- **Error codes as the message.** "Error 0x80070057" is a diagnostic, not copy.
- **Blame wording.** "You entered an invalid date."
- **Clever labels.** A puzzle the user must solve before acting.
- **Button label contradicts the dialog.** Title says "Discard draft?", buttons say "Yes" and "No".
- **Citing reading levels as study results.** "Write at grade 6 to 8" and "15 to 20 words per sentence" are practitioner guidelines. None of the sources fetched for this file tests them. If you use them, label them house default.

## Good references
- [NN/g UX Writing Study Guide](https://www.nngroup.com/articles/ux-writing-study-guide/): a curated hub (reading, plain language, tone, jargon, formatting, short copy) that points to the primary articles below.
- [NN/g Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/): visibility, communication and efficiency rules, each with a named real-site example.
- [NN/g Better Link Labels: 4 Ss](https://www.nngroup.com/articles/better-link-labels/): four testable properties, with a documented failure ("MORE INFO & BOOK" opening a form in a popup).
- [NN/g Plain Language Is for Everyone, Even Experts](https://www.nngroup.com/articles/plain-language-experts/): the evidence that experts also prefer plain wording.
- [GOV.UK: understand content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/): four principles, stated as principles, not as research results.

## Bad references
- A marketing homepage where every card ends in "Learn more": the scanning reader gets no information scent, which is the failure NN/g describes in its Mailchimp example.
- A form that shows "Invalid input" in grey text above the page: breaks "near the source", "constructive" and "not by colour alone" at once.

## Accessibility
- Link text must make sense out of context: screen-reader users often list links alone, so "Read the refund policy" works and "here" does not (WCAG has a link-purpose criterion; its number and wording were not fetched for this file, so look it up before citing). Related: `a11y-names-roles-states.md`.
- Error text must not depend on colour or animation alone; NN/g's guideline and WCAG 1.4.1 Use of Color (Level A) agree; see https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html.
- Plain language helps users with cognitive disabilities and non-native readers; it is an accessibility measure, not only a style one.
- Do not put essential information in a tooltip: touch and keyboard users may never see it (`cpover-popover-menu-tooltip.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Link label test | specific, sincere, substantial, succinct | review every link and button |
| Error structure | what happened, why, what to do | every error message |
| Banned error words | invalid, illegal, incorrect | replace with the fix |
| Tone axes | humour, formality, respectfulness, enthusiasm | one tone note per product area |
| Sentence length, reading grade | house default, unsourced | label if quoted |

## Implementation sketch
Keep strings in one typed dictionary so a review diffs words, not markup.
```ts
export const copy = {
  projectDeleteTitle: 'Delete project "{name}"?',
  projectDeleteBody: 'Its 12 reports are deleted too. You cannot undo this.',
  projectDeleteConfirm: 'Delete project',
  projectDeleteCancel: 'Keep project',
  emailError: 'Enter an email like name@example.com',
} as const;
```
```html
<a href="/refunds">Read the refund policy</a>
<p id="email-err" role="alert">Enter an email like name@example.com</p>
```

## How a UI builder uses this
- Write the user-need sentence, then the label; reject any label that does not name its object.
- Run every link and button through the 4 S test; rewrite "Learn more".
- Write each error as what, why, fix; keep the user's input.
- Put strings in a dictionary with one term per concept; keep sentences whole.
- Applied in: `found-microcopy-for-data.md`, `ffound-form-microcopy.md`, `fvalid-error-messages.md`, `aichat-empty-state-and-suggestions.md`, `mkfound-cta-and-conversion.md`, `comp-icons-and-labels.md`, `comp-onboarding-and-notices.md`, `i18n-string-externalisation.md`.

## Checklist
- [ ] Every string has a user need it serves.
- [ ] No link or button reads "Learn more", "Click here", "OK" or "Submit" alone.
- [ ] Every link passes specific, sincere, substantial, succinct.
- [ ] Every error says what, why and the fix, near the field, without blame words.
- [ ] One term per concept across nav, title, button and error.
- [ ] No sentence is assembled from concatenated fragments.
- [ ] Reading-level or length targets are labelled house default.
- [ ] Test: ask five people what a button will do before showing the result; any wrong guess is a copy bug.

## Sources
- https://www.nngroup.com/articles/ux-writing-study-guide/ (fetched)
- https://www.nngroup.com/articles/error-message-guidelines/ (fetched)
- https://www.nngroup.com/articles/better-link-labels/ (fetched)
- https://www.nngroup.com/articles/plain-language-experts/ (fetched in the session report)
- https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/ (fetched in the session report)
- Repo: `found-microcopy-for-data.md`, `ffound-form-microcopy.md`, `fvalid-error-messages.md`, `aichat-empty-state-and-suggestions.md`, `data-loading-empty-error-states.md`, `mkfound-cta-and-conversion.md`, `comp-icons-and-labels.md`, `comp-onboarding-and-notices.md`, `i18n-string-externalisation.md`, `a11y-names-roles-states.md`, `cpover-popover-menu-tooltip.md`
