# Labels, hints and placeholders

> Every field has a visible, persistent `<label>`; format rules and examples go in hint text between the label and the field, linked with `aria-describedby`; a placeholder is never the label and never the only place an instruction lives.

**Category:** Form foundations · **Applies to:** every text input, textarea, select, checkbox and radio group · **Priority:** must

## When to use / when not
- **Always a visible label**, including on search fields and one-field forms. The only exception is a field whose purpose is already shown by an adjacent visible element that is wired as its name (a search box beside a "Search" button that labels it via `aria-labelledby`).
- **Hint text** when the answer has a format ("For example, 27 3 2007"), a constraint ("8 or more characters"), or needs a reason ("We only call if there's a problem with your delivery").
- **No hint** when the label is enough. Hints on every field are noise, and people stop reading them.
- **Placeholders**: at most a short *example* of a format, and only when the same example is also in the hint. Prefer none.

## Rules (do)
- **`<label for>` + `id`**, or wrap the control in the label. Clicking the label focuses or toggles the control, which also enlarges the target.
- **Label text is a noun phrase or a question,** short and specific: "Email address", "What is your date of birth?". Sentence case, no colon, no trailing asterisk dance (see `ffound-required-optional-marking.md`).
- **Hint between label and field**, not below it. Below the field it is hidden by autofill pop-ups and the on-screen keyboard (modern-web-guidance's SMS OTP and payment guides make the same point for format hints). The order is label → hint → error → field (GOV.UK puts the error between hint and field).
- **Link the hint with `aria-describedby`**, so it is read after the label when the field gets focus. Add the error message's id to the same attribute only while the error shows.
- **Labels and hints stay visible while typing.** NN/g found placeholder-as-label hurts memory (the instruction vanishes on the first keystroke), makes empty and filled fields hard to tell apart, and is often skipped by autofill-driven users.
- **Floating labels are not a fix.** They start as placeholders (low contrast, inside the field), shrink to 11–12 px when focused and leave no room for a hint. If a design system forces them, the floated label must keep ≥ 4.5:1 contrast and ≥ 12 px.
- **Hint contrast ≥ 4.5:1** (`--text-muted` on `--surface`, which is ≥ 4.5:1 in the dashboard-ui tokens). Placeholder text, if used, also meets 4.5:1, because it is text the user needs.
- **Keep the visible label in the accessible name** (WCAG 2.5.3 Label in Name). Never override a visible label with a different `aria-label`.
- **Character limits**: show "You can enter up to 500 characters" as the hint, and a live count only near the limit (GOV.UK's character count shows the remaining count from a threshold, e.g. 75%). Let people type past the limit and show an error, rather than silently truncating with `maxlength` (which also truncates pasted text).

## Anti-patterns (don't)
- Placeholder as the only label ("Email" in grey inside the box).
- Format instructions only in the placeholder ("DD/MM/YYYY") that vanish on the first keystroke.
- Hint text in a tooltip behind an ⓘ icon, for information everyone needs. Tooltips are for optional detail.
- Labels inside the field that float up and shrink to 10 px.
- "Enter your…" in every label. The verb adds nothing; "Email address" is enough.
- Label text that differs from what an error message calls the field ("E-mail" in the label, "Email address is invalid" in the error).

## Good references
- [GOV.UK Design System — Text input](https://design-system.service.gov.uk/components/text-input/) — label, then hint, then error, then field; hints linked by `aria-describedby`; no placeholders.
- [NN/g — Placeholders in form fields are harmful](https://www.nngroup.com/articles/form-design-placeholders/) — the memory, contrast and "is it filled?" problems, with the alternatives.
- [Carbon — Text input usage](https://carbondesignsystem.com/components/text-input/usage/) — label above, helper text for format, warns that placeholder text disappears once the user types.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — `<label for>` before text controls, format rules in persistent helper text, no mismatched `aria-label`.
- [GOV.UK Design System — Character count](https://design-system.service.gov.uk/components/character-count/) — count shown from a threshold, over-limit typing allowed and reported.

## Bad references
- [NN/g — Placeholders in form fields are harmful](https://www.nngroup.com/articles/form-design-placeholders/) — its examples of placeholder-only sign-up forms where users can't check what a filled field was for.
- [Baymard — Mobile form usability: don't use inline labels](https://baymard.com/blog/mobile-forms-avoid-inline-labels) — test sessions where users forgot what a pre-filled field was for once its inline label was gone.
- Material Design 2 filled text fields with floating labels and no helper text: the label shrinks on focus and the format rule has nowhere to go.

## Accessibility
- Accessible name = visible label (WCAG 1.3.1, 2.5.3, 3.3.2 Labels or Instructions).
- Hints and errors referenced by `aria-describedby`; nothing important only in `title` or `placeholder`.
- Labels wrap, never truncate with an ellipsis, at 200% zoom and in long languages.
- Do not hide labels visually "for a cleaner look". If you must (a search field), use the visually-hidden recipe, never `display: none`.

## Motion / interaction (if relevant)
- None. Labels and hints do not move or animate on focus.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--label-font` | 500 1rem/1.4 | Label: same size as field text, slightly heavier |
| `--hint-font` | 400 0.875rem/1.45 (`--type-body`) | Hint text, `--text-muted` |
| `--label-gap` | 4px | Label → hint → field |
| Character count threshold | 75% of the limit | When the live count appears |

## Implementation sketch
```html
<div class="field">
  <label for="event">Event name</label>
  <p id="event-hint" class="hint">Up to 60 characters. People see this in their invitation.</p>
  <p id="event-err" class="error-msg" hidden><span aria-hidden="true">⚠</span> Event name must be 60 characters or fewer</p>
  <input id="event" name="event" aria-describedby="event-hint" data-limit="60">
  <p id="event-count" class="hint" aria-live="polite"></p>
</div>
```
```css
.field label { font: var(--label-font, 500 1rem/1.4 system-ui); color: var(--text); }
.hint { margin: 0; font: var(--type-body, 400 0.875rem/1.45 system-ui); color: var(--text-muted); }
input::placeholder { color: var(--text-muted); opacity: 1; }
```
```ts
// Show a remaining-characters count from 75% of the limit; never truncate what was typed.
export function wireCharacterCount(input: HTMLInputElement | HTMLTextAreaElement, out: HTMLElement): void {
  const limit = Number(input.dataset.limit)
  if (!Number.isFinite(limit) || limit <= 0) return
  const update = (): void => {
    const left = limit - [...input.value].length
    const show = input.value.length >= limit * 0.75
    out.textContent = !show ? '' : left >= 0
      ? `You have ${left} character${left === 1 ? '' : 's'} remaining`
      : `You have ${-left} character${left === -1 ? '' : 's'} too many`
  }
  input.addEventListener('input', update)
  update()
}
```

## Checklist
- [ ] Every control has a visible `<label>` programmatically tied to it.
- [ ] Format rules and examples are in hint text above the field, linked by `aria-describedby`.
- [ ] No placeholder carries information that is not also visible elsewhere.
- [ ] Label, hint and placeholder text meet 4.5:1.
- [ ] The accessible name contains the visible label text.
- [ ] Length limits are stated up front and over-limit text is reported, not truncated.

## Sources
- https://design-system.service.gov.uk/components/text-input/
- https://design-system.service.gov.uk/components/character-count/
- https://www.nngroup.com/articles/form-design-placeholders/
- https://baymard.com/blog/mobile-forms-avoid-inline-labels
- https://carbondesignsystem.com/components/text-input/usage/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md (hint above the field)
- https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
- https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
