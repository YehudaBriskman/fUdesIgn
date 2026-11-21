# Names, roles, states and text alternatives

> Every interactive element and every meaningful image has an accessible name that contains its visible text, a role that matches its behaviour and states that update with it; get them from native HTML first (`<label>`, `<button>`, `alt`, `<caption>`), then `aria-labelledby`, and only then `aria-label`.

**Category:** Build · **Applies to:** buttons, links, icon buttons, form controls, images and SVG icons, custom widgets, repeated row actions · **Priority:** must

## When to use / when not
- **Always** for anything a user can operate or needs to perceive. 4.1.2 Name, Role, Value is the single most-failed criterion in audits of custom widgets.
- **Forms:** labels, hints and error descriptions are owned by forms-ui (`ffound-labels-hints-placeholders.md`, `fvalid-error-summary-and-focus.md`).
- **Charts:** names and text alternatives for charts are owned by dashboard-ui `chart-accessibility.md`.
- **Not** for decorative content: decorative images get `alt=""`, decorative SVG gets `aria-hidden="true"`, and neither gets a name.

## Rules (do)
- **Naming order of preference:** content (`<button>Save</button>`) → native label (`<label for>`, `<caption>`, `<legend>`, `<figcaption>`, `alt`) → `aria-labelledby` pointing at visible text → `aria-label` → nothing else. `title` and `placeholder` are not names.
- **Label in Name (2.5.3):** the accessible name contains the visible label text, in the same order, ideally at the start. Visible "Send" → name "Send message" passes; name "Submit" fails and breaks voice control ("click Send").
- **Icon-only buttons:** a name via `aria-label` or visually hidden text (`.sr-only` in `assets/a11y.css`), the SVG `aria-hidden="true"` and `focusable="false"`, and a tooltip that repeats the name for sighted users.
- **Disambiguate repeats (2.4.4, 4.1.2):** five "Edit" buttons in a table each need a unique name: "Edit Acme Ltd" via hidden text or `aria-labelledby="edit-3 row-3-name"`. Links with the same text go to the same place (3.2.4).
- **Roles:** use the element whose role you need (`<button>` acts, `<a href>` navigates). A link styled as a button is still a link; a button that navigates is wrong.
- **States:** toggle buttons expose `aria-pressed`; disclosures `aria-expanded` on the trigger; current page/step `aria-current="page" | "step"`; selected tab `aria-selected`; invalid field `aria-invalid` only while an error is shown. Don't repeat the state in the name ("Bold, on").
- **Descriptions:** extra context (hints, errors, consequences) goes in `aria-describedby` to visible text, not in the name. Keep names short: 1–5 words.
- **Images (1.1.1):** informative `alt` says what the image conveys in context, not "image of"; functional images (a linked logo) describe the destination ("Acme home"); complex images get a short `alt` plus a nearby long description or data table; images of text are avoided (1.4.5).
- **SVG:** inline informative SVG gets `role="img"` and an `aria-label` or `<title>` child; decorative SVG gets `aria-hidden="true"`.
- **Sensory characteristics (1.3.3):** instructions never rely only on shape, colour, size, position or sound ("press the green button on the right").
- **Custom elements:** roles set through `ElementInternals` don't appear in markup; inspect the accessibility tree, not the HTML.

## Anti-patterns (don't)
- `<div onclick>` or `<span class="btn">` as a button: no role, no name computation, no keyboard.
- `aria-label` that differs from the visible text ("Click here" visible, "Download annual report" announced).
- `aria-label` on a plain `<div>` or `<span>` without a role: most screen readers ignore it.
- `alt="image"`, `alt="photo.jpg"`, or alt text that repeats the adjacent caption word for word.
- Using `title` as the only label of an icon button.
- Twenty "Read more" links on one page.
- `aria-hidden="true"` on a focusable element or its ancestor.

## Good references
- [W3C — Accessible Name and Description Computation](https://www.w3.org/TR/accname-1.2/) — the algorithm browsers run; explains why content beats `title`.
- [W3C WAI — Images tutorial and alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) — decorative, informative, functional, complex.
- [GOV.UK Design System — Button](https://design-system.service.gov.uk/components/button/) — native buttons, verb-first labels, no icon-only primary actions.
- [modern-web-guidance — Accessibility §3](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#3-accessible-names-and-descriptions) — naming mechanisms, label in name, descriptions, the visually hidden utility.
- [Adrian Roselli — Uniquely labelling fields in a table](https://adrianroselli.com/2023/10/uniquely-labeling-fields-in-a-table.html) — `aria-labelledby` combining row and column headers.

## Bad references
- [W3C WAI — Before and After demo](https://www.w3.org/WAI/demos/bad/before/home.html) — images without alt and "click here" links.
- Design-system icon buttons shipped without a required name prop: every consumer ships a nameless button (the fix is to make `label` required in the component type, see sketch).

## Accessibility
- Check names in the browser accessibility pane (Chrome DevTools Accessibility tab, Firefox Accessibility Inspector) and by listening: the name you hear should be what you see.

## Motion / interaction (if relevant)
- Names never change while a control is focused unless the change is the state (use `aria-pressed`, not a renamed button). A changing name re-announces mid-interaction.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Name length | 1–5 words | Buttons, links, icon buttons |
| `.sr-only` | `assets/a11y.css` | Hidden context text |
| Decorative image | `alt=""` | 1.1.1 |
| Decorative SVG | `aria-hidden="true" focusable="false"` | 1.1.1 |

## Implementation sketch
An icon button whose type makes a name mandatory and keeps the visible tooltip equal to the name.
```tsx
import type { ReactNode } from 'react'

interface IconButtonProps {
  label: string            // required: becomes the accessible name and the tooltip
  icon: ReactNode
  pressed?: boolean        // set only for toggle buttons
  onPress: () => void
}

export function IconButton({ label, icon, pressed, onPress }: IconButtonProps) {
  return (
    <button type="button" className="a11y-target" aria-label={label} title={label}
      aria-pressed={pressed} onClick={onPress}>
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
```

## Checklist
- [ ] Every interactive element has a name; icon-only ones via `aria-label` or hidden text.
- [ ] Each name contains the visible label text (2.5.3).
- [ ] Repeated controls ("Edit", "Delete", "Read more") are disambiguated.
- [ ] Roles match behaviour (button acts, link navigates).
- [ ] Toggle, expand, current and selected states are exposed and update.
- [ ] Informative images have meaningful `alt`; decorative ones `alt=""` or `aria-hidden`.
- [ ] No instruction depends only on colour, shape or position.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
- https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
- https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html
- https://www.w3.org/TR/accname-1.2/
- https://www.w3.org/WAI/tutorials/images/decision-tree/
- https://adrianroselli.com/2023/10/uniquely-labeling-fields-in-a-table.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
