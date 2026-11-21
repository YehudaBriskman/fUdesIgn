# Error summary, focus and announcements

> When a submit fails, show an error summary at the top of the form that lists every error as a link to its field, move focus to the summary, prefix the page title with "Error:", and keep the same messages inline at each field; announce async results with a polite status region.

**Category:** Validation · **Applies to:** submit-time validation of any form; server-side errors; async save results · **Priority:** must

## When to use / when not
- **Summary + inline** when a submit fails with one or more errors on a full-page form (GOV.UK error summary).
- **Focus the first invalid field instead** (no summary) for short forms of ≤ 3 fields in a dialog or panel where the summary would be most of the content. dashboard-ui's `comp-inline-edit-and-forms.md` uses this threshold for panel forms.
- **A form-level error with no field** (payment declined, service down): an error summary with the message and what to do, no field links.
- **Not for blur-time errors**; those stay inline only (`fvalid-timing-and-inline-errors.md`).

## Rules (do)
- **Summary anatomy** (GOV.UK):
  - A heading "There is a problem".
  - A list of links, one per error, in the order fields appear; the link text is the *same* message as inline; each `href="#field-id"` points at the input (for a group, the first input).
  - Placed at the top of the main content, above the `<h1>`.
- **Move focus to the summary** after a failed submit (`tabindex="-1"` on the container, then `.focus()`). Screen readers read the heading and list; sighted users see where they are. Don't use `role="alert"` *and* move focus: one announcement is enough. Focusing is the more reliable of the two.
- **Links focus the field**, scrolling so the field's label and hint are visible too (GOV.UK's script scrolls to the legend or label, not just the input).
- **Prefix the document title** with "Error: " so screen-reader users hear it on page load after a server round-trip.
- **Keep inline messages** at every field, worded the same, so people who jump to a field see why.
- **Update or remove the summary on resubmit** only. Don't live-update it while people fix fields; it shifts the page.
- **Server-rendered first.** The summary must work with JS off: render it on the server on a failed POST; enhance with client-side checks that produce the same markup.
- **Async results** (a save, an upload, a background check): a `role="status"` (polite) region, present in the DOM from page load, whose text you replace: "Changes saved", "2 files uploaded". Use `role="alert"` (assertive) only for failures that block what the user is doing right now.
- **Don't announce every keystroke-level change.** Debounce live regions to ≥ 500 ms and announce results, not progress percents.
- **Focus never jumps** on success unless the page changes; after a successful dialog submit, focus returns to the button that opened the dialog.

## Anti-patterns (don't)
- An error summary with no links ("Please fix the errors below").
- Only highlighting fields red with no summary on a long form, so the first error is off-screen.
- `alert()` dialogs listing errors.
- Moving focus to the first field *and* firing an alert: the screen reader reads two things at once.
- Live regions inserted at the moment of the message (many screen readers miss them; the region must exist first).
- Re-rendering the whole form on error and losing the user's input or file uploads.

## Good references
- [GOV.UK Design System — Error summary](https://design-system.service.gov.uk/components/error-summary/) — anatomy, focus on load, links to fields, "Error:" title prefix.
- [GOV.UK Design System — Validation pattern](https://design-system.service.gov.uk/patterns/validation/) — summary + inline messages together.
- [W3C WAI — Forms tutorial: User notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) — listing errors at the top, linking to fields, success messages.
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status` vs `alert`, region must exist before the update.
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — focus to the first invalid field or a summary on failed submit; announce AJAX results with `role="status"`.

## Bad references
- [W3C WAI — Before and After demo: inaccessible survey](https://www.w3.org/WAI/demos/bad/before/survey.html) — errors returned as a generic message with no link to the fields.
- Checkout pages that show "There were errors" at the top and red borders on fields three screens down.

## Accessibility
- WCAG 3.3.1 Error Identification, 3.3.3 Error Suggestion, 4.1.3 Status Messages, 2.4.3 Focus Order.
- The summary heading is a real heading (`<h2>`) and the list a real list.
- Ensure the focused summary is not hidden under a sticky header (2.4.11): set `scroll-margin-block-start` on it.

## Motion / interaction (if relevant)
- Scroll to the summary instantly or with `scroll-behavior: smooth` only when `prefers-reduced-motion: no-preference`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Summary border | 4–5px solid `--danger-fg` | Container |
| Summary background | `--surface` (not tinted; contrast stays simple) | Container |
| Threshold | > 3 fields → summary; ≤ 3 in a panel → focus first error | When to use |
| Live region debounce | ≥ 500ms | Status messages |

## Implementation sketch
```html
<div class="error-summary" tabindex="-1" aria-labelledby="es-title" hidden>
  <h2 id="es-title">There is a problem</h2>
  <ul class="error-summary-list"></ul>
</div>
<p role="status" class="visually-hidden" id="form-status"></p>
```
```css
.error-summary { border: 5px solid var(--danger-fg); padding: var(--space-5, 24px); margin-block-end: var(--space-6, 32px); scroll-margin-block-start: var(--space-8, 64px); }
.error-summary:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 0; }
.error-summary-list a { color: var(--danger-fg); font-weight: 600; }
```
```ts
export type FieldError = { id: string; message: string }

export function showErrorSummary(summary: HTMLElement, errors: readonly FieldError[]): void {
  const list = summary.querySelector('ul')
  if (!list) return
  list.replaceChildren(...errors.map(({ id, message }) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = `#${id}`
    a.textContent = message
    a.addEventListener('click', (e) => {
      const input = document.getElementById(id)
      if (!input) return
      e.preventDefault()
      const anchor = input.closest('fieldset')?.querySelector('legend') ?? document.querySelector(`label[for="${CSS.escape(id)}"]`) ?? input
      anchor.scrollIntoView({ block: 'start' })
      input.focus({ preventScroll: true })
    })
    li.append(a)
    return li
  }))
  summary.hidden = errors.length === 0
  if (errors.length) {
    if (!document.title.startsWith('Error: ')) document.title = `Error: ${document.title}`
    summary.focus()
  }
}
```

## Checklist
- [ ] A failed submit shows a summary above the `<h1>` listing every error as a link to its field.
- [ ] Focus moves to the summary; the document title starts with "Error: ".
- [ ] Each field shows the same message inline.
- [ ] The summary also renders server-side with JS off.
- [ ] Async results use a pre-existing `role="status"` region; `alert` only for blocking failures.
- [ ] The focused summary isn't hidden by sticky UI.

## Sources
- https://design-system.service.gov.uk/components/error-summary/
- https://design-system.service.gov.uk/patterns/validation/
- https://www.w3.org/WAI/tutorials/forms/notifications/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
