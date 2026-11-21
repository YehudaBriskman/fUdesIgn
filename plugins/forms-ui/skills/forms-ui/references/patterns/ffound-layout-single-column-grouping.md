# Single-column layout, grouping and fieldsets

> Lay a form out as one column, labels above fields, in the order people think about the answers; group related fields with space first and a `<fieldset>` + `<legend>` when the group shares one question.

**Category:** Form foundations · **Applies to:** sign-up, checkout, settings, account and admin forms, side-panel forms · **Priority:** must

## When to use / when not
- **Use one column** for every form that people fill in from top to bottom: checkout, sign-up, applications, settings pages.
- **Short related pairs may share a row** when they are read as one answer and their widths are fixed by content: card expiry + security code, city + postcode in a known locale. Never put unrelated fields side by side.
- **Filter bars and toolbars are not forms in this sense.** A horizontal filter row is fine (see `comp-filter-bar-chips.md`, dashboard-ui). Editing one value in place is inline edit (`comp-inline-edit-and-forms.md`, dashboard-ui).
- **Data-entry grids** (a model's assumptions table, a spreadsheet) are tables of inputs, not forms: use the batch-edit rules in `comp-inline-edit-and-forms.md`.

## Rules (do)
- **One column, one path.** The eye and the Tab key move straight down. CXL Institute measured a single-column version of the same form being completed about 15 s faster than a multi-column one, and NN/g's form guidelines recommend a single column for the same reason: side-by-side fields get skipped or misread.
- **Labels above fields.** Penzo's eye-tracking study (UXmatters, 2006) found top-aligned labels need the fewest fixations and roughly 50 ms to move from label to field, against about 500 ms for left-aligned labels. Top labels also survive translation (German labels run ~30% longer) and narrow screens. Left-aligned labels are acceptable only for long, rarely-completed admin forms where scanning the labels matters more than speed.
- **Checkbox and radio labels sit to the right** of their control (inline-end), never above it.
- **Order fields the way people think.** Name before address, address before payment. Follow the conventional order of the user's locale for addresses (see `finput-types-autocomplete-keyboards.md`).
- **Field width hints at the answer.** A postcode field is about 10 characters wide, a card security code 4–5, a day 2–3, a year 4–5. GOV.UK sizes fields with fixed character-width classes (2, 3, 4, 5, 10, 20 characters) and full-width only for free text. Use `ch`-based widths, capped at the container.
- **Group with space before lines.**
  - Label → field gap: 4–6 px (`--label-gap`).
  - Field → field gap: 24 px (`--field-gap`).
  - Group → group gap: 32–48 px with a group heading (`--group-gap`).
  - The label-to-field gap is always smaller than the gap between fields, so each label belongs visibly to its own field (Gestalt proximity, also in the modern-web-guidance forms guide).
- **`<fieldset>` + `<legend>` whenever a set of controls answers one question:** a radio group, a checkbox group, a date split into day/month/year, an address block. The legend is the question ("Where should we send the card?"), and it is the first child of the fieldset.
- **One `<h1>` per form page.** On one-question pages the legend or label can *be* the heading (GOV.UK question pages wrap the `<h1>` in the legend or label).
- **Primary action at the end of the column**, aligned with the fields' inline-start edge, not floated far right where people miss it on wide screens.
- **Max form width about 40–45 rem** (≈ 640–720 px). Wider fields make lines too long to scan and push the action off the line of sight.
- **Name every form when a page has more than one**, with `aria-labelledby` pointing at the form's heading.

## Anti-patterns (don't)
- Two or three columns of unrelated fields to make a form "look shorter". It hides fields and breaks Tab order.
- First and last name side by side "to save space" when one full-name field would do (see `finput-types-autocomplete-keyboards.md`).
- Full-width inputs for 4-digit answers. Width is a hint, and a wide field invites the wrong answer.
- A `<fieldset>` used as a decorative box with no `<legend>`, or a legend that is not the question.
- Labels to the left on a mobile layout that then wrap onto two lines beside a squashed field.
- CSS `order`, `grid-row` or absolute positioning that makes the visual order differ from the DOM and Tab order (WCAG 1.3.2, 2.4.3).

## Good references
- [GOV.UK Design System — Question pages](https://design-system.service.gov.uk/patterns/question-pages/) — one question per page, the label or legend as the heading, a single "Continue" button at the end of the column.
- [GOV.UK Design System — Text input](https://design-system.service.gov.uk/components/text-input/) — fixed-width classes that match the expected answer length.
- [NN/g — Website forms usability: top 10 recommendations](https://www.nngroup.com/articles/web-form-design/) — single column, labels close to fields, group related fields.
- [Primer — Forms](https://primer.style/product/ui-patterns/forms) — stacked fields with labels above, grouped with headings, one primary action.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — `<fieldset>` with `<legend>` first, single column, label-gap smaller than group-gap, no CSS reordering.

## Bad references
- [CXL — Form field usability: single vs multi-column](https://cxl.com/research-study/form-field-usability-matrix-vs-single-columns/) — the multi-column variant in the study: slower to complete, with fields skipped.
- Multi-column "contact us" forms that put Email beside Phone beside Company: on a 1280 px screen the eye zig-zags and the Tab order jumps rows.
- [UXmatters — Label placement in forms (Penzo)](https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php) — the left-aligned-label variant: the largest label-to-field saccades of the variants tested.

## Accessibility
- Visual order = DOM order = Tab order (WCAG 1.3.2 Meaningful Sequence, 2.4.3 Focus Order).
- A `<fieldset>`'s `<legend>` is read with the first control in the group, so the group question is never lost.
- Reflow at 320 CSS px wide and at 400% zoom with no horizontal scroll (WCAG 1.4.10): any two-field row collapses to one column.
- Do not nest fieldsets more than one level; screen readers announce every legend on entry and it gets noisy.

## Motion / interaction (if relevant)
- None. Conditional fields that appear under a radio or checkbox appear in place with no movement (see `finput-choice-controls.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--form-max` | 42rem | Max width of the form column |
| `--label-gap` | 4px (`--space-1`) | Label → field and hint → field |
| `--field-gap` | 24px (`--space-5`) | Field → next field |
| `--group-gap` | 40px | Group → next group |
| Width classes | 2ch, 3ch, 4ch, 5ch, 10ch, 20ch, 100% | Match the expected answer length |

## Implementation sketch
```html
<form class="form" action="/address" method="post" aria-labelledby="addr-h">
  <h1 id="addr-h">Delivery address</h1>
  <div class="field">
    <label for="name">Full name</label>
    <input id="name" name="name" autocomplete="shipping name" required>
  </div>
  <fieldset class="group">
    <legend>Address</legend>
    <div class="field">
      <label for="street">Street address</label>
      <textarea id="street" name="street" rows="2" autocomplete="shipping street-address" required></textarea>
    </div>
    <div class="field">
      <label for="postcode">Postcode</label>
      <input id="postcode" name="postcode" class="w-10" autocomplete="shipping postal-code">
    </div>
  </fieldset>
  <button type="submit" class="btn-primary">Continue</button>
</form>
```
```css
.form { max-inline-size: var(--form-max, 42rem); display: grid; gap: var(--field-gap, 24px); }
.field { display: grid; gap: var(--label-gap, 4px); justify-items: start; }
.field > input:not(.w-10), .field > textarea, .field > select { inline-size: 100%; }
.group { border: 0; padding: 0; margin: 0; display: grid; gap: var(--field-gap, 24px); margin-block-start: calc(var(--group-gap, 40px) - var(--field-gap, 24px)); }
.group > legend { font: var(--type-heading, 600 1rem/1.4 system-ui); padding: 0; margin-block-end: var(--space-3, 12px); }
.w-10 { inline-size: min(100%, calc(10ch + 2 * var(--field-pad-inline, 12px))); }
.form > .btn-primary { justify-self: start; }
```

## Checklist
- [ ] Fields stack in one column; any shared row holds only short, related fields and collapses on narrow screens.
- [ ] Labels sit above text fields and to the right of checkboxes and radios.
- [ ] Label gap < field gap < group gap.
- [ ] Every group that answers one question is a `<fieldset>` whose first child is a `<legend>` stating the question.
- [ ] Field widths match the expected answer length.
- [ ] Visual order matches DOM and Tab order; nothing is reordered with CSS.
- [ ] The primary action sits at the end of the column, aligned with the fields.

## Sources
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/components/text-input/
- https://design-system.service.gov.uk/components/fieldset/
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://cxl.com/research-study/form-field-usability-matrix-vs-single-columns/
- https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php
- https://www.nngroup.com/articles/web-form-design/
- https://primer.style/product/ui-patterns/forms
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
