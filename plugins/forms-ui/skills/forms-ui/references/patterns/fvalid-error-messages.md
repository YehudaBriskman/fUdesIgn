# Writing error messages

> An error message says what went wrong and how to fix it, in the user's words, for this field: "Enter a date of birth in the past", not "Invalid input"; no blame, no codes, no jokes, and the same wording inline and in the summary.

**Category:** Validation · **Applies to:** field errors, error summaries, form-level and server errors · **Priority:** must

## When to use / when not
- Every validation and server error shown to a user.
- Not for empty states or warnings that don't block; those are hints or alerts (`comp-notifications-alerts.md`, dashboard-ui).

## Rules (do)
- **Structure: instruction first.** "Enter …", "Select …", "… must be …". GOV.UK's patterns by error type:

| Error type | Pattern | Example |
|---|---|---|
| Missing text | Enter [the thing] | Enter your full name |
| Missing choice | Select [the thing] / Select if [question] | Select if you have a passport |
| Wrong format | Enter [the thing] in the correct format, like [example] | Enter an email address in the correct format, like name@example.com |
| Too long / short | [The thing] must be [n] characters or fewer / more | Password must be 8 characters or more |
| Out of range | [The thing] must be between [a] and [b] | Amount must be between £1 and £10,000 |
| Must be past/future | [The thing] must be in the past / today or in the future | Date of birth must be in the past |
| Wrong file | The selected file must be [rule] | The selected file must be smaller than 10 MB |
| Doesn't match a record | Plain statement + next step | We couldn't find an account with that email address. Check it or create an account |

- **Name the field as its label does**, in lowercase mid-sentence, so people can match them.
- **Specific beats generic.** One message per cause; don't reuse "Enter a valid X" for every failure (missing, too long and wrong format each get their own).
- **Give the fix, not the rule's internals**: "Enter a 6-digit code" rather than "Code must match ^\d{6}$".
- **Don't blame or alarm.** No "invalid", "illegal", "forbidden", "error!", "oops", "you failed to". NN/g's error-message guidelines: be human-readable, precise, constructive, polite.
- **Keep it short**: one sentence, about 5–15 words. A second sentence only for the next step.
- **Server and system errors**: say what happened, whether data was saved, and what to do: "We couldn't save your changes because the connection dropped. Your answers are still here. Try again." Include a reference ID only as secondary text for support.
- **Security-sensitive messages** stay vague on purpose: sign-in failures say "Email or password is incorrect" without revealing which one; password reset says "If an account exists for that email, we've sent a link" (OWASP authentication guidance).
- **Same text everywhere**: inline, summary and screen-reader announcement.
- **Prefix visually hidden "Error:"** before the message so screen-reader users hear the state (GOV.UK error message component).
- **Translate the meaning, not the words**: keep messages in your i18n catalogue with placeholders for label, limit and example.

## Anti-patterns (don't)
- "Invalid input", "Field is required", "Error 422".
- Messages that blame: "You entered an invalid date".
- Messages that state the rule but not the action: "Format: DD/MM/YYYY".
- Different words inline and in the summary.
- ALL CAPS, exclamation marks, red text with no words.
- Over-specific sign-in errors that leak which accounts exist.

## Good references
- [GOV.UK Design System — Error message](https://design-system.service.gov.uk/components/error-message/) — the wording patterns by error type, "Error:" prefix, position above the field.
- [NN/g — Error-message guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — visibility, communication and efficiency guidelines with examples.
- [Carbon — Notification and validation content](https://carbondesignsystem.com/patterns/forms-pattern/#validation) — be specific and actionable.
- [OWASP — Authentication cheat sheet: authentication and error messages](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages) — generic messages for sign-in and recovery.

## Bad references
- [NN/g — Hostile patterns in error messages](https://www.nngroup.com/articles/hostile-error-messages/) — vague, blaming and code-filled messages it collects.
- Payment forms that answer a declined card with "Transaction failed (code 05)" and no next step.

## Accessibility
- Messages are text (WCAG 3.3.1), suggest a fix (3.3.3), and don't rely on colour (1.4.1).
- "Error:" prefix in visually hidden text so the state is read with the message.
- Plain language helps people with cognitive disabilities and second-language users.

## Motion / interaction (if relevant)
- None.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Length | 5–15 words, 1 sentence (+1 for next step) | Field errors |
| Prefix | visually hidden "Error:" | Every field error |
| Voice | instruction first, plain, no blame | All errors |

## Implementation sketch
```ts
// Error messages as data: one per cause, worded from the field's label, ready for i18n.
export type Rule =
  | { kind: 'missing'; choice?: boolean }
  | { kind: 'format'; example: string }
  | { kind: 'max'; chars: number }
  | { kind: 'min'; chars: number }
  | { kind: 'range'; from: string; to: string }
  | { kind: 'past' }

export function errorMessage(label: string, rule: Rule): string {
  const thing = label.charAt(0).toLowerCase() + label.slice(1)
  const Thing = label.charAt(0).toUpperCase() + label.slice(1)
  switch (rule.kind) {
    case 'missing': return rule.choice ? `Select ${thing}` : `Enter ${thing}`
    case 'format': return `Enter ${thing} in the correct format, like ${rule.example}`
    case 'max': return `${Thing} must be ${rule.chars} characters or fewer`
    case 'min': return `${Thing} must be ${rule.chars} characters or more`
    case 'range': return `${Thing} must be between ${rule.from} and ${rule.to}`
    case 'past': return `${Thing} must be in the past`
  }
}
```
```html
<p id="dob-error" class="error-msg"><span class="visually-hidden">Error:</span> Date of birth must be in the past</p>
```

## Checklist
- [ ] Every message starts with what to do and names the field as its label does.
- [ ] Each failure cause has its own message; no "invalid" catch-alls.
- [ ] No blame, codes, jokes, caps or exclamation marks.
- [ ] Server errors say whether data was kept and what to do next.
- [ ] Sign-in and recovery messages don't reveal which accounts exist.
- [ ] Inline, summary and announced text are identical, with an "Error:" prefix for screen readers.

## Sources
- https://design-system.service.gov.uk/components/error-message/
- https://www.nngroup.com/articles/error-message-guidelines/
- https://www.nngroup.com/articles/hostile-error-messages/
- https://carbondesignsystem.com/patterns/forms-pattern/
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html
