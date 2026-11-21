# Pattern index

Every pattern file in `patterns/`, grouped by cluster. **Priority** says how binding it is: must = always apply, should = apply unless there's a reason not to, nice = optional.
17 patterns in total.


## Foundations: layout, labels, required/optional, accessibility, microcopy

| Pattern | Priority | Rule |
|---|---|---|
| [Form accessibility baseline](patterns/ffound-form-accessibility.md) | must | Build forms from native controls so names, roles, states and keyboard behaviour come free; then meet the WCAG 2.2 form criteria: labels, error identification and suggestion, input purpose, 24 px targets, visible unobscured focus, no redundant entry and no cognitive tests to log in. |
| [Form microcopy: questions, buttons and reassurance](patterns/ffound-form-microcopy.md) | should | Write labels as the plain question, buttons as the verb + object of what happens next, and add one line of reassurance where people hesitate (why we ask, what happens next, what it costs); cut every other word. |
| [Labels, hints and placeholders](patterns/ffound-labels-hints-placeholders.md) | must | Every field has a visible, persistent `<label>`; format rules and examples go in hint text between the label and the field, linked with `aria-describedby`; a placeholder is never the label and never the only place an instruction lives. |
| [Single-column layout, grouping and fieldsets](patterns/ffound-layout-single-column-grouping.md) | must | Lay a form out as one column, labels above fields, in the order people think about the answers; group related fields with space first and a `<fieldset>` + `<legend>` when the group shares one question. |
| [Required vs optional fields](patterns/ffound-required-optional-marking.md) | must | First remove every field you don't need; then, if most fields are required, mark the few optional ones with the word "(optional)" in the label; if you use an asterisk instead, explain it once at the top and still set `required` on the control. |

## Inputs: types and autofill, choice controls, selects and comboboxes, money/number/phone, dates, file upload

| Pattern | Priority | Rule |
|---|---|---|
| [Checkboxes, radios and switches: which and how](patterns/finput-choice-controls.md) | must | Radios for one choice from 2–6 visible options, checkboxes for any number of choices or a single opt-in that takes effect on submit, a switch only for a setting that takes effect immediately; never a select for 2–3 options and never a switch inside a form that has a Save button. |
| [Date and time inputs](patterns/finput-dates-and-times.md) | must | Pick the date control by how people know the date: three labelled numeric fields for dates they remember (birth, passport issue), a calendar picker with typed entry for dates they choose near today, presets for ranges; always show the expected format, accept any sensible separator and never auto-advance between fields. |
| [File upload](patterns/finput-file-upload.md) | must | Build file upload on a real `<input type="file">` with a visible button, state the allowed types and size limit before people choose, add drag-and-drop only as an extra, then show each file's name, progress and a remove action, and check type and size on the client *and* the server. |
| [Money, number and phone inputs with locale handling](patterns/finput-money-number-phone.md) | must | Enter money and quantities in `type="text" inputmode="decimal"` fields that accept the user's locale format, show the currency or unit as a fixed affix, and store exact minor units; take phone numbers in one `type="tel"` field that accepts any formatting and normalises to E.164 on the server. |
| [Selects, comboboxes and autocomplete](patterns/finput-select-combobox-autocomplete.md) | must | Use a native `<select>` for 7–15 known options and a combobox (type to filter) for long or searchable sets; a custom combobox follows the WAI-ARIA APG pattern exactly, keeps focus in the input, and never auto-selects or submits on its own. |
| [Input types, autocomplete, inputmode and enterkeyhint](patterns/finput-types-autocomplete-keyboards.md) | must | Give every field the right `type`, an `autocomplete` token for anything about the user, an `inputmode` that summons the right keyboard and an `enterkeyhint` that names what Enter does; never block paste and never split one value across several boxes. |

## Validation: timing and inline errors, error summary and focus, error messages

| Pattern | Priority | Rule |
|---|---|---|
| [Writing error messages](patterns/fvalid-error-messages.md) | must | An error message says what went wrong and how to fix it, in the user's words, for this field: "Enter a date of birth in the past", not "Invalid input"; no blame, no codes, no jokes, and the same wording inline and in the summary. |
| [Error summary, focus and announcements](patterns/fvalid-error-summary-and-focus.md) | must | When a submit fails, show an error summary at the top of the form that lists every error as a link to its field, move focus to the summary, prefix the page title with "Error:", and keep the same messages inline at each field; announce async results with a polite status region. |
| [Validation timing and inline errors](patterns/fvalid-timing-and-inline-errors.md) | must | Validate a field when the user leaves it after changing it (`:user-invalid` / blur), never while they type; clear the error as soon as the value is fixed; validate everything again on submit; and show each error as text directly above the field, kept until fixed. |

## Flows: submission and double submit, multi-step and saving progress, authentication and passkeys

| Pattern | Priority | Rule |
|---|---|---|
| [Sign-in, sign-up and passkeys](patterns/fflow-authentication-and-passkeys.md) | must | Make authentication work with password managers and passkeys: real `<form>`s, `autocomplete="username webauthn"` / `current-password` / `new-password`, paste allowed, a show-password toggle, one-field OTPs, and passkeys offered through conditional UI (autofill) before any password. |
| [Multi-step forms, wizards and saving progress](patterns/fflow-multi-step-and-save-progress.md) | should | Split a long form into steps only when each step is a coherent group of questions; show where people are and how much is left, let them go back without losing answers, end with a "Check your answers" page, and save progress automatically so a timeout or closed tab never costs them their work. |
| [Submit buttons, submission states and double submit](patterns/fflow-submit-buttons-and-double-submit.md) | must | Keep the submit button enabled until a valid submit starts; then mark it busy on itself (same size, spinner + "Saving…", `aria-disabled`), ignore repeat clicks, send an idempotency key so the server can't do the work twice, and end in a clear success or an inline error that keeps every answer. |
