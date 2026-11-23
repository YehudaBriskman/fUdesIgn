# Checkboxes, radios and switches: which and how

> Radios for one choice from 2–5 visible options, checkboxes for any number of choices or a single opt-in that takes effect on submit, a switch only for a setting that takes effect immediately; never a select for 2–3 options and never a switch inside a form that has a Save button.

**Category:** Inputs · **Applies to:** choice questions, consent, settings, filters, conditional reveals · **Priority:** must

## When to use / when not
| Situation | Control |
|---|---|
| One answer from 2–5 options, all worth seeing | **Radios**, stacked |
| One answer from 6–10 known options | **Select** (or radios if scanning matters more than space) |
| One answer from 15+ or a searchable set (countries, currencies) | **Select** or **combobox** (`finput-select-combobox-autocomplete.md`) |
| Any number from a set | **Checkboxes** (or a multi-select combobox beyond ~15) |
| One yes/no that applies when the form is submitted (terms, "email me") | **Single checkbox** |
| A yes/no question that needs an explicit answer (legal or eligibility) | **Two radios**, "Yes" / "No", none preselected |
| An on/off setting that applies the moment it changes | **Switch** |
| Mode of one view (List / Board) | Segmented control (`comp-tabs-segmented-pills.md`, dashboard-ui) |

The modern-web-guidance forms guide gives the same split by count: checkbox for one binary, radios for 2–5 exclusive options, select for 6+, `<datalist>` for long or dynamic sets.

## Rules (do)
- **Stack radios and checkboxes vertically**, one per line. Inline (side by side) only for 2 short options like "Yes / No" (GOV.UK).
- **The whole label row is the target.** Label to the right of the control; row ≥ 44 px tall on touch, ≥ 24 px on desktop; control box 20–24 px.
- **Radios: preselect only a safe, sensible default**, and never on questions where the answer has consequences or you need a deliberate choice (NN/g recommends a default in general; GOV.UK avoids one for questions because people miss it). House rule: settings get a default; questions don't.
- **Defaults are advice, not neutral.** Madrian & Shea (NBER w7682) found that moving a 401(k) plan to automatic enrolment raised participation substantially, and many employees kept both the default contribution rate and default fund. People take the default as a recommendation, so a default is a decision you make for them. Test it: **would the user pick this if asked?** If yes, preselect it (a safe setting); if the honest answer is "only because it earns us money or data", do not. Effect size varies with the stakes, and a high consent rate under an opt-out default is not evidence of informed choice.
- **Order options** by likelihood or naturally (alphabetical for long lists, numeric for ranges). Put "Other" or "None" last, separated by "or" (GOV.UK's divider).
- **Exclusive "None of these"** in a checkbox group clears the others when checked (GOV.UK `data-behaviour="exclusive"`).
- **Conditional reveal**: a radio or checkbox can reveal one or two follow-up fields directly beneath it, indented with a left border. Keep it to simple, single questions; anything bigger is a new page (GOV.UK conditional reveal). The revealed fields are not inside the label.
- **Switches** (NN/g toggle-switch guidelines):
  - The effect is immediate, with no Save button; show the result (and an undo if it is costly).
  - Label states what is *on*: "Email notifications", with on/off visible as position plus text or icon, never colour alone.
  - Use `<input type="checkbox" switch>` with `role="switch"` added for browsers that don't support the attribute yet (native switch rendering is Safari 17.4+ only; others show a checkbox, which still works).
  - If the change needs a network call, show a pending state and revert with an inline error on failure.
- **Use `accent-color`** for brand colour on native checkboxes and radios before building custom ones. If you do build custom visuals, keep the native input in the DOM (visually hidden, not `display: none`) and draw on the label.
- **Checked state contrast**: the check mark and box border ≥ 3:1 against the fill and background.

## Anti-patterns (don't)
- A switch in a form that also has "Save": is it saved already? NN/g's top toggle-switch mistake.
- A single checkbox for "I am not a resident" style questions with negative phrasing.
- A select with 2–3 options: hides the choices behind a click.
- Radios laid out in a horizontal row of 5 with wrapping labels.
- Custom checkboxes built from `<div>`s, or native inputs hidden with `display: none`.
- Preselected consent or upsell checkboxes ("Add insurance"). The default effect makes this a dark pattern: it works precisely because people do not change it.
- Auto-submitting or navigating when a radio changes (WCAG 3.2.2).

## Good references
- [GOV.UK Design System — Radios](https://design-system.service.gov.uk/components/radios/) and [Checkboxes](https://design-system.service.gov.uk/components/checkboxes/) — stacked by default, inline only for two short options, "or" divider, exclusive "None", conditional reveals.
- [NN/g — Checkboxes vs. radio buttons](https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/) — the core rules: radios exclusive, checkboxes independent, vertical lists, defaults.
- [NN/g — Toggle-switch guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/) — switches for immediate effect only, clear on/off state.
- [WAI-ARIA APG — Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) and [Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) — roles and keyboard model.
- [modern-web-guidance — Switch](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/switch.md) — the `switch` attribute, its Safari-only support and feature-detected polyfill.

## Bad references
- [NN/g — Toggle-switch guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/) — its example of switches inside a settings form with a separate Save, where users couldn't tell if changes applied.
- Cookie banners with a column of pre-enabled "legitimate interest" switches: the default does the deciding, and the switch states are told apart only by colour.

## Accessibility
- Radios in a `<fieldset>` with a `<legend>` question; arrow keys move and select within the group, Tab enters and leaves it (native).
- Checkboxes: Space toggles; group in a fieldset when they answer one question.
- Switch: role `switch` with checked state; Space toggles; the label is the setting name, not "On"/"Off".
- Conditional fields: the revealed content follows the control in DOM order; set `aria-expanded` on the control only for custom implementations (GOV.UK's script does this).

## Motion / interaction (if relevant)
- Switch thumb slides over `--motion-dur-micro` (100 ms); under reduced motion it jumps. Conditional reveals appear without animation.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--check-size` | 22px | Checkbox and radio box |
| Row min height | 44px coarse / 32px fine | Whole label row is the target |
| Inline radios | max 2 options, ≤ 3 words each | Yes/No |
| Conditional reveal indent | 4px `--border-strong` left bar + 16px padding | Follow-up fields |

## Implementation sketch
```html
<fieldset>
  <legend>How should we contact you?</legend>
  <div class="choices">
    <div class="field-check"><input type="radio" id="c-email" name="contact" value="email"><label for="c-email">Email</label></div>
    <div class="reveal" data-for="c-email"><div class="field"><label for="c-addr">Email address</label><input id="c-addr" name="c-addr" type="email" autocomplete="email"></div></div>
    <div class="field-check"><input type="radio" id="c-phone" name="contact" value="phone"><label for="c-phone">Phone</label></div>
    <p class="or">or</p>
    <div class="field-check"><input type="radio" id="c-none" name="contact" value="none"><label for="c-none">Don't contact me</label></div>
  </div>
</fieldset>
<div class="field-check"><input type="checkbox" switch role="switch" id="notify" name="notify"><label for="notify">Email notifications</label></div>
```
```css
.field-check { display: flex; align-items: center; gap: var(--space-3, 12px); min-block-size: var(--target-min, 24px); }
.field-check > input { inline-size: var(--check-size, 22px); block-size: var(--check-size, 22px); margin: 0; accent-color: var(--accent); flex: none; }
.field-check > label { flex: 1; padding-block: var(--space-2, 8px); cursor: pointer; }
.reveal { margin-inline-start: calc(var(--check-size, 22px) / 2 - 2px); padding-inline-start: var(--space-4, 16px); border-inline-start: 4px solid var(--border-strong); }
.reveal:not(.open) { display: none; }
.choices .or { margin: 0; color: var(--text-muted); }
```
```ts
// Show the follow-up block for the checked radio; hidden blocks are removed from tab order by display:none.
export function wireReveals(fieldset: HTMLFieldSetElement): void {
  const sync = (): void => {
    for (const block of fieldset.querySelectorAll<HTMLElement>('.reveal[data-for]')) {
      const input = fieldset.querySelector<HTMLInputElement>(`#${CSS.escape(block.dataset.for ?? '')}`)
      block.classList.toggle('open', input?.checked === true)
    }
  }
  fieldset.addEventListener('change', sync)
  sync()
}
```

## Checklist
- [ ] Control matches the decision table (count, exclusivity, immediacy).
- [ ] Options are stacked; inline only for two short options.
- [ ] Each group is a fieldset with a question legend.
- [ ] The full label row is clickable and ≥ 24 px (44 px on touch).
- [ ] Switches apply immediately and are never inside a Save form.
- [ ] No preselected consent or upsell; defaults only for safe settings and only ones the user would pick if asked.
- [ ] Native inputs are kept in the DOM even when visuals are custom.

## Sources
- https://design-system.service.gov.uk/components/radios/
- https://design-system.service.gov.uk/components/checkboxes/
- https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/
- https://www.nngroup.com/articles/toggle-switch-guidelines/
- https://www.nngroup.com/articles/radio-buttons-default-selection/
- https://www.nber.org/papers/w7682 (Madrian & Shea, default effect in 401(k) enrolment)
- https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/switch.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (selection control matrix)
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/accent-color
- https://primer.style/product/components/toggle-switch/ (immediate-effect switch, no form submit)
