# Form accessibility baseline

> Build forms from native controls so names, roles, states and keyboard behaviour come free; then meet the WCAG 2.2 form criteria: labels, error identification and suggestion, input purpose, 24 px targets, visible unobscured focus, no redundant entry and no cognitive tests to log in.

**Category:** Form foundations · **Applies to:** every form and form control · **Priority:** must

## When to use / when not
- **Always.** This file is the floor every other `f*-` pattern stands on. The specific patterns add detail: labels (`ffound-labels-hints-placeholders.md`), errors (`fvalid-*`), authentication (`fflow-authentication-and-passkeys.md`).
- **Custom widgets** (combobox, switch, date picker) only when no native control can do the job, and then follow the WAI-ARIA APG pattern exactly (see `finput-select-combobox-autocomplete.md`).

## Rules (do)
- **Native first.** `<input>`, `<select>`, `<textarea>`, `<button>`, `<fieldset>` give role, name, state, focus and keyboard support. A `<div>` with click handlers gives none of it. "No ARIA is better than bad ARIA" (APG).
- **WCAG 2.2 criteria that land on forms**, and what each means here:

| SC | Level | In a form |
|---|---|---|
| 1.3.1 Info and Relationships | A | Labels, fieldset/legend, `required`, hint links are programmatic |
| 1.3.5 Identify Input Purpose | AA | `autocomplete` tokens on fields about the user (name, email, tel, address, cc-*) |
| 1.4.11 Non-text Contrast | AA | Field borders, checkbox outlines, focus rings ≥ 3:1 against adjacent colour |
| 2.4.7 / 2.4.11 Focus Visible / Not Obscured | AA | A visible ring; sticky footers and cookie bars never cover the focused field |
| 2.5.8 Target Size (Minimum) | AA | Controls ≥ 24 × 24 CSS px, or 24 px spacing; house rule 44 px on touch |
| 3.2.2 On Input | A | Changing a field never submits or navigates by itself |
| 3.3.1 Error Identification | A | The field in error is identified and described in text |
| 3.3.2 Labels or Instructions | A | Visible labels; format instructions before the field |
| 3.3.3 Error Suggestion | AA | The error says how to fix it |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Review step, confirmation or undo for money, legal and data-deletion submits |
| 3.3.7 Redundant Entry | A | Don't ask again for what was given in the same process: prefill or offer "same as" |
| 3.3.8 Accessible Authentication (Minimum) | AA | No memory or transcription test to log in without help: allow paste and password managers, offer passkeys |
| 4.1.2 Name, Role, Value | A | Custom widgets expose them via ARIA |
| 4.1.3 Status Messages | AA | Save, upload and submit results announced without moving focus |

- **Field boundaries ≥ 3:1.** Use `--border-strong` for input borders (≥ 3:1 on surface, surface-2 and surface-3 in the dashboard-ui tokens), not `--border` (about 1.5:1, decorative only). The modern-web-guidance forms guide gives `#767676` on white as the minimum grey.
- **Focus ring**: 2 px solid `--focus-ring`, offset 2 px, ≥ 3:1. Never `outline: none` without an equal replacement. Error state changes the border, never removes the focus ring.
- **Field font size ≥ 16 px** (`font-size: max(1rem, 1em)`): iOS Safari zooms the page when a focused field's text is under 16 px, and the user then has to pinch out.
- **Touch targets**: fields ≥ 44 px tall on `pointer: coarse`; checkbox and radio rows get their target from the whole label row.
- **Keyboard**: Tab reaches every control in order; Enter in a text field submits (implicit submission works only inside a `<form>` with a submit button); Space toggles checkboxes; arrows move within a radio group; Esc closes pop-ups and restores the value.
- **Don't trap**: no `tabindex` > 0, no focus stolen on load except on single-purpose pages (a sign-in page may autofocus the first field; a long form must not).
- **Timeouts**: warn at least 20 s before a session expires and let people extend it (WCAG 2.2.1); keep the data if they re-authenticate (2.2.5, AAA but cheap with saved drafts; see `fflow-multi-step-and-save-progress.md`).
- **Language and direction**: `lang` on `<html>`; logical properties (`margin-inline-start`, `text-align: start`) so RTL layouts mirror correctly; `dir="auto"` on free-text fields that may hold mixed scripts.
- **Forced colours**: borders and focus use real borders and outlines (not only box-shadow), which survive Windows High Contrast.

## Anti-patterns (don't)
- `<div contenteditable>` or `<div role="textbox">` instead of an input.
- Clickable `<span>` checkboxes with no role or keyboard support.
- `outline: none` on `:focus` with a 1 px colour change as the only cue.
- Input borders at 1.5:1 light grey that disappear on a tinted surface.
- Field text at 14 px so the page zooms on every focus on iPhone.
- Submitting on `<select>` change (WCAG 3.2.2).
- CAPTCHAs that require solving a puzzle with no accessible alternative (WCAG 3.3.8).

## Good references
- [W3C — WCAG 2.2: What's new](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — 2.4.11, 2.5.8, 3.3.7, 3.3.8 explained with form examples.
- [W3C WAI — Forms tutorial](https://www.w3.org/WAI/tutorials/forms/) — labels, grouping, instructions, validation, notifications and multi-page forms.
- [GOV.UK Design System](https://design-system.service.gov.uk/components/) — components tested with assistive technology, with the known issues published per component.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — native semantics, `font-size: max(1rem, 1em)`, 3:1 borders, visible focus, visually-hidden recipe.
- [MDN — Using the aria-invalid attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid) — when to set and clear it.

## Bad references
- [W3C WAI — Before and After demo, inaccessible survey](https://www.w3.org/WAI/demos/bad/before/survey.html) — unlabelled fields, colour-only required marks and a layout table, deliberately broken for teaching.
- Sign-up forms with grey-on-white borders below 2:1: the field is invisible to low-vision users until it is focused.

## Accessibility
- This whole file is accessibility. Test with: keyboard only; a screen reader (VoiceOver + Safari, NVDA + Firefox or Chrome); 200% and 400% zoom; Windows forced colours; iPhone Safari for the 16 px zoom rule.

## Motion / interaction (if relevant)
- Focus and error state changes are instant. Any reveal under 150 ms, and none under `prefers-reduced-motion: reduce` beyond opacity.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--field-border` | `var(--border-strong)` | Input, select, checkbox borders, ≥ 3:1 |
| `--field-font-size` | `max(1rem, 1em)` | Never under 16 px |
| `--field-h` | 44px; 48px on `pointer: coarse` | Single-line control height |
| `--focus-ring` | 2px solid, offset 2px | All controls |
| `--target-min` | 24px; 44px coarse (dashboard-ui tokens) | Hit areas |

## Implementation sketch
```css
input, select, textarea, button { font: inherit; font-size: max(1rem, 1em); }
:where(input:not([type="checkbox"], [type="radio"], [type="range"]), select, textarea) {
  min-block-size: var(--field-h, 44px);
  border: 1px solid var(--field-border, var(--border-strong));
  border-radius: var(--radius-sm, 6px);
  background: var(--surface);
  color: var(--text);
  padding-inline: var(--field-pad-inline, 12px);
}
:where(input, select, textarea, button):focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
@media (pointer: coarse) { :root { --field-h: 48px; } }
@media (forced-colors: active) { :where(input, select, textarea) { border-color: FieldText; } }
.visually-hidden { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; margin: -1px; padding: 0; border: 0; }
```

## Checklist
- [ ] Every control is native, or a custom widget that follows its APG pattern.
- [ ] Each WCAG 2.2 row in the table above was checked.
- [ ] Field borders and focus rings are ≥ 3:1; text ≥ 4.5:1.
- [ ] Field text is ≥ 16 px; fields are ≥ 44 px tall on touch.
- [ ] Nothing submits or navigates on change; Enter submits from text fields.
- [ ] Sticky headers, footers and banners never cover the focused field.
- [ ] Tested with keyboard, one screen reader, 400% zoom and forced colours.

## Sources
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://www.w3.org/WAI/tutorials/forms/
- https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
- https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid
- https://design-system.service.gov.uk/components/
