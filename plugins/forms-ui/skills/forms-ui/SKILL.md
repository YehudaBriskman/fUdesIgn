---
name: forms-ui
description: Design, build or review web forms with researched rules and concrete tokens. Use when creating or restyling a form, sign-up, sign-in or checkout, settings page, survey, multi-step wizard or onboarding flow; when choosing input types, autocomplete, inputmode, selects vs radios vs comboboxes, checkboxes vs switches, date, money, phone or file inputs; when deciding validation timing, error messages and error summaries, required/optional marking, submit and double-submit behaviour, saving progress, passkeys and password fields; or when asked to audit or score a form. Trigger even if the word "form" is not used: "the signup flow", "checkout page", "input field", "validation errors", "login screen", "wizard", "make this field better".
---

# Forms UI design

A research-backed playbook for web forms: 19 pattern files, each with rules, anti-patterns, good and bad references, accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiables and the decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. Prefixes: `ffound` (foundations), `finput` (inputs), `fvalid` (validation), `fflow` (submission and flows), `fref` (anti-patterns and review rubric).
- **Starter styles:** `assets/forms.css`. It uses the role tokens of the dashboard-ui plugin's `assets/tokens.css` (`--surface`, `--text`, `--text-muted`, `--border-strong`, `--accent`, `--focus-ring`, `--danger-fg`, `--space-*`, `--radius-*`), with light-mode fallbacks so it also works alone.
- **Shared with dashboard-ui** (not repeated here): inline editing and panel forms (`comp-inline-edit-and-forms.md`), sliders with number inputs (`comp-slider-with-number-input.md`), date-range pickers (`comp-date-range-picker.md`), number display (`data-number-formatting.md`), overlays (`comp-overlay-choice.md`), optimistic save and undo (`prog-optimistic-ui-and-undo.md`).

## Workflow

Follow these steps in order. Each one names the files to open.

1. **Cut and shape.**
   - List every field and the reason it's needed. Delete what the service can do without (`ffound-required-optional-marking.md`; Baymard: most checkouts need about 8 fields).
   - Decide the shape: one page, steps, or a task list (decision table below; `fflow-multi-step-and-save-progress.md`). If the edit is one field in a dashboard, use inline edit instead (`comp-inline-edit-and-forms.md`, dashboard-ui).
2. **Lay out.** One column, labels above, fieldsets for grouped questions, widths that hint at the answer (`ffound-layout-single-column-grouping.md`).
3. **Write the words.** Labels, hints, optional markers, button labels, why-we-ask lines, the confirmation (`ffound-labels-hints-placeholders.md`, `ffound-required-optional-marking.md`, `ffound-form-microcopy.md`).
4. **Pick each control.**
   - Type, `autocomplete`, `inputmode`, `enterkeyhint` per field (`finput-types-autocomplete-keyboards.md`).
   - Choices: radios, checkboxes, switch, select or combobox (`finput-choice-controls.md`, `finput-select-combobox-autocomplete.md`).
   - Special inputs: money, numbers and phones (`finput-money-number-phone.md`), dates (`finput-dates-and-times.md`), files (`finput-file-upload.md`).
5. **Validate.** Timing and inline errors (`fvalid-timing-and-inline-errors.md`), the error summary and focus (`fvalid-error-summary-and-focus.md`), the wording (`fvalid-error-messages.md`).
6. **Submit.** Busy button, double-submit guard, idempotency, success and failure states (`fflow-submit-buttons-and-double-submit.md`). For sign-in and sign-up, `fflow-authentication-and-passkeys.md`.
7. **Accessibility pass.** Walk the WCAG 2.2 table in `ffound-form-accessibility.md` with a keyboard, a screen reader and 400% zoom.
8. **Review before calling it done.**
   - Run `fref-form-anti-patterns.md` (16 failures, with a DOM audit sketch).
   - Score `fref-form-review-rubric.md` (31 checks, 0–2 each). Ship at 80% or more with no must-check at 0.
   - Report the score and each failed check as `ID · evidence · fix (pattern)`.

## Non-negotiables

Break one of these only with a written reason.

**Layout and words**
1. One column. Only short, related pairs (expiry + CVC) share a row, and they collapse on narrow screens.
2. Every control has a visible, persistent `<label>`. Placeholders never carry the label or the only copy of an instruction.
3. Hints and format examples sit between the label and the field, linked by `aria-describedby`.
4. Ask only what you need. Mark the minority kind: "(optional)" in the label when most fields are required. Every required control has `required`.
5. Buttons say verb + object ("Create account", "Pay £24.00"). Never "Submit".

**Inputs**
6. Every user-data field has the right `autocomplete` token; credentials use `username`, `current-password`, `new-password`, `one-time-code`.
7. No `type="number"` for identifiers or money: use `type="text"` with `inputmode="numeric"` or `"decimal"` and a locale-aware parser.
8. One field per value: one name, one card number, one phone, one OTP. Never auto-advance between fields.
9. Never block paste, and never ask people to retype email or password; offer show-password instead.
10. Radios for 2–5 exclusive options, a select for 6–10, a combobox beyond that (Baymard: drop-downs are a poor choice below 5 or above 10 options). A switch only when the change applies immediately.
11. Field text is at least 16 px; fields are at least 44 px tall on touch; borders and focus rings are 3:1 or more.

**Validation**
12. Never show an error while the user is typing. Validate on blur after an edit (`:user-invalid`) and always on submit; clear an error as soon as the value is fixed.
13. Each error is text next to its field, says how to fix it, and is linked with `aria-invalid` and `aria-describedby`. Never only colour, a toast or a tooltip.
14. A failed submit on a full-page form shows a linked error summary, moves focus to it and prefixes the title with "Error:".
15. Keep the user's answers through every error, refresh, Back and timeout.

**Submission and flows**
16. Submit is never disabled to enforce validity. Once a valid submit starts, the button shows busy on itself (same width, `aria-disabled`) and repeat submits are ignored.
17. Every write is idempotent on the server (an idempotency key per form render); full-page forms use Post/Redirect/Get.
18. Money, legal and destructive submits get a review step, a confirmation or an undo window (WCAG 3.3.4).
19. Multi-step flows show position, keep answers on Back, end with a check-answers page and save progress automatically.
20. Authentication works with password managers and passkeys; no CAPTCHA puzzles or memory tests (WCAG 3.3.8); credential errors don't reveal whether an account exists.

## Decision tables

**Form shape** (`fflow-multi-step-and-save-progress.md`)

| Form | Use |
|---|---|
| One value in an existing view | Inline edit (dashboard-ui `comp-inline-edit-and-forms.md`) |
| ≤ ~7 fields, one topic | One page |
| 2–8 related fields beside other work | Side panel; modal only for ≤ 6 fields and a decision needed now |
| Sequential, answers shape later questions | Steps, then check answers |
| Independent sections done over time | Task list with per-task status |

**Choice control** (`finput-choice-controls.md`, `finput-select-combobox-autocomplete.md`)

| Options | Control |
|---|---|
| One opt-in applied on submit | Checkbox |
| Yes/No that needs a deliberate answer | Two radios, none preselected |
| On/off applied immediately | Switch |
| 2–5 exclusive | Radios, stacked |
| 6–10 exclusive | Native select |
| Long or remote set | Combobox (APG pattern) |
| Many of many | Checkboxes (≤ ~15, this skill's cut-off), else multi-select combobox |

**Input type** (`finput-types-autocomplete-keyboards.md`, `finput-money-number-phone.md`, `finput-dates-and-times.md`)

| Value | Markup |
|---|---|
| Email | `type="email" autocomplete="email"` (`username` on sign-in) |
| Phone | `type="tel" autocomplete="tel"`, any punctuation accepted |
| Money / decimal | `type="text" inputmode="decimal"` + affix + locale parser |
| Code, card, postcode | `type="text" inputmode="numeric"` + `autocomplete` token |
| Small integer quantity | `type="number"` with `min`/`max`, or a stepper |
| Memorable date | Three fields: Day, Month, Year |
| Near date | Calendar picker with typed entry |
| Date range | Presets + range picker (dashboard-ui `comp-date-range-picker.md`) |

**Validation timing** (`fvalid-timing-and-inline-errors.md`)

| Event | Action |
|---|---|
| `input` | Clear an error once fixed; never add one |
| `blur` after an edit | Run the field's format checks |
| `submit` | Run all checks, show summary + inline, focus the summary |
| Server response | Same inline slots and summary; keep answers |

**Destructive or costly action** (`fflow-submit-buttons-and-double-submit.md`, dashboard-ui `comp-overlay-choice.md`)

| Action | Use |
|---|---|
| Reversible, low cost (archive, remove from list) | Do it, then offer Undo in place for about 5–10 s |
| Irreversible or high cost (delete account, pay) | Review step or confirmation dialog naming the action ("Delete project" / "Keep project") |
| Legal or financial commitment | Check-answers page + explicit final button with the amount |

## Token defaults

From `assets/forms.css`:

| Token | Value |
|---|---|
| `--form-max` | 42rem |
| `--label-gap` / `--field-gap` / `--group-gap` | 4px / 24px / 40px |
| `--field-h` | 44px (48px on coarse pointers) |
| `--field-font-size` | `max(1rem, 1em)` |
| `--field-border` | `var(--border-strong)` (≥ 3:1) |
| `--check-size` | 22px |
| Error bar / field error border / summary border | 4px / 2px / 5px `--danger-fg` |
