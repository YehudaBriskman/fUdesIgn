# Forms and inline editing inside dashboards

> Edit where the value lives (inline) for single, frequently changed fields. Use a side panel or a page for multi-field changes. Every edit has an obvious affordance, an explicit save/cancel path, a visible saved state and errors next to the field.

**Category:** Components and interaction · **Applies to:** editable table cells, KPI targets, model assumptions (growth rate, WACC), record headers (name, owner, status), settings panels, scenario forms · **Priority:** must

## When to use / when not
| Edit shape | Pattern |
|---|---|
| 1 field, edited often, value already displayed (a name, owner, status, a single assumption) | **Inline edit** (read view ↔ edit view in place) |
| A grid of numeric inputs users tweak repeatedly (a model's assumptions table) | **Always-editable inputs** styled as quiet cells, with *batch* save ("3 unsaved changes · Save / Discard") or autosave with versioning |
| 2–8 related fields that must be valid together (a new alert rule) | **Side panel form** (non-modal) or a small modal for ≤6 fields |
| Long, multi-section configuration | **Full page form** with sections. Not a modal |
| Toggling a boolean that takes effect immediately | **Switch** (`<input type="checkbox" switch>`), no save button |

- Atlassian: inline edit is for *existing* information in fields updated often, and **never inside a form**.
- Don't use inline edit for fields whose change has big consequences (currency, fiscal year start). Route those through a confirm dialog.

## Rules (do)
- **Affordance.** In read view, editable values show a hover background (`surface-hover`), a pencil icon on hover or focus, and `cursor: text`. On touch, which has no hover, show the pencil persistently or make the whole row a clear button.
- **Same geometry.** The read and edit views use *identical* font size, weight and line box, so entering edit mode moves nothing. Atlassian requires this.
- **Enter edit mode** with click, Enter or F2 on a focused cell. Select the existing text on entry for short values.
- **Commit and cancel.**
  - Enter saves and Esc cancels (Atlassian). Tab saves and moves to the next editable field.
  - Show ✓ and ✕ buttons at the end of the field. Keep them visible, because save-on-blur is not obvious.
  - Multi-line text areas keep the edit view open on blur (Atlassian's `keepEditViewOpenOnBlur`) so a stray click doesn't save half-written text.
  - Use IME-safe Enter handling: don't commit while `event.isComposing` is true.
- **Saving states.**
  - Optimistic update first.
  - Show a subtle "Saving…" inline only if the save takes over 300 ms.
  - Show "Saved" for ~2 s, then fade. On failure, revert visibly and show an inline error with Retry, never just a toast.
- **Dirty state for batch editing.**
  - Mark changed cells with a left bar or dot, not only a colour.
  - A sticky footer bar reads "N unsaved changes · Discard · Save".
  - Warn on navigation away (`beforeunload` + in-app route guard).
- **Validation.**
  - Use native constraints (`required`, `min`, `max`, `step`, `pattern`) and style errors with `:user-invalid`, so errors appear only after interaction, not while the user is still typing "1." of "1.5".
  - Error text sits below the field, starts with an icon carrying a text alternative, says how to fix it ("Enter a rate between 0% and 25%"), and is linked through `aria-describedby` only while invalid.
- **Numeric inputs.**
  - Use `<input type="text" inputmode="decimal">`, not `type="number"`. The latter has spinner and scroll-wheel accidents and locale issues.
  - Parse locale formats ("1,234.5", "1.234,5"), shorthand ("10k", "2.5m", "15%") and paste with currency symbols.
  - Right-align numbers in tabular contexts with `font-variant-numeric: tabular-nums`.
  - Put the unit in a visible suffix (`%`, `$M`), not in the value.
- **Labels.**
  - A visible label goes above the field in forms. Inline cells use the column header as the label, programmatically via `aria-labelledby` on the header plus the row.
  - Never use a placeholder as the label.
  - Keep the label-to-input gap smaller than the gap between field groups.
- **Provenance.** For model inputs, show the default or source value and a "Reset to default" action when a user overrides it ("Overridden · was 8.2% (consensus)").
- **Forms in panels.**
  - Primary "Save" at the end of the footer, with "Cancel" as ghost.
  - Disable nothing up front; validate on submit and move focus to the first error, or to an error summary for >3 errors.

## Anti-patterns (don't)
- Inline edit inside a form, which gives two competing save models (Atlassian).
- Read and edit views with different font sizes, so the layout jumps on click.
- Invisible editability: plain text that happens to be clickable, discoverable only by accident.
- Save-on-blur with no visible feedback, so users don't know whether the change stuck.
- Errors shown in a toast or at the top of a long panel, far from the field. NN/g: validation must be next to the field and say how to fix it.
- `type="number"` fields that change value when the user scrolls the page over them.
- Showing errors on every keystroke (`:invalid`) before the user has finished typing.
- Autosaving assumption changes that silently recompute every chart without an undo or a "changed" indicator.
- Disabled "Save" buttons with no explanation of what's missing.

## Good references
- [Atlassian — Inline edit](https://atlassian.design/components/inline-edit/usage) — read and edit views, ✓ and ✕ at the end of the field, Enter saves and Esc cancels, identical styling across views, keep edit open on blur for text areas, never inside a form.
- [NN/g — Indicators, Validations, and Notifications](https://www.nngroup.com/articles/indicators-validations-notifications/) — validation is contextual, next to the field, and explains how to fix the problem. Keep errors out of transient toasts.
- [Linear](https://linear.app) (product) — issue title, status, assignee and estimate are inline-editable in place with keyboard shortcuts, and changes reflect immediately with no separate save step.
- [Airtable](https://www.airtable.com) / [Notion databases](https://www.notion.so) (products) — cell editing with Enter/Esc/Tab semantics that mirror spreadsheets, which users already know.

## Bad references
- [Atlassian — Inline edit](https://atlassian.design/components/inline-edit/usage) — the page's own warning: save-on-navigate-away "isn't obvious", so hiding the confirm controls leads to accidental saves.
- [NN/g — Date input](https://www.nngroup.com/articles/date-input/) — Priceline rejects valid but differently formatted input ("9-3-17") without guidance. The numeric equivalent is rejecting "10%" or "1,000" in a rate field.
- Spreadsheet-like finance models that recompute on every keystroke. Typing "12" passes through "1" and briefly shows a valuation based on 1%, which users then screenshot.

## Accessibility
- An inline-edit trigger is a `<button>` whose name includes the field and value ("Edit growth rate, 8.2%"). The edit view is a labelled input that receives focus. After save or cancel, focus returns to the trigger.
- Announce the save result in a polite live region ("Growth rate saved").
- Link errors via `aria-describedby` and set `aria-invalid="true"` only while invalid. Use `role="alert"` or a summary for submit-time errors.
- Editable grids: use `role="grid"` only if you implement the full arrow-key contract. Otherwise a table of labelled inputs in tab order is more robust.
- Targets: edit triggers and ✓/✕ are ≥24×24.
- Respect 200% zoom; inline editors may wrap but must not clip.

## Motion / interaction (if relevant)
- The read↔edit swap is instant (no animation). The "Saved" check fades out over 200 ms after 2 s.
- A changed value elsewhere (recomputed outputs) may flash its background for 600–800 ms or tween its number (see `motion-number-tweening.md`). Disable both under reduced motion.

## Tokens and values
| Token | Default |
|---|---|
| Inline field height | equal to read-view line box (e.g. 32px in tables) |
| Edit affordance | `surface-hover` bg + 16px pencil at end, on hover/focus |
| Commit buttons | 24×24 ✓/✕, 4px gap, placed at field end |
| Saving indicator delay | 300ms |
| "Saved" confirmation | 2s then 200ms fade |
| Dirty marker | 2px `accent` inline-start bar on the cell |
| Error text | 12–13px, `danger-fg`, icon + text, below field |
| Label gap / group gap | 4–6px / 16–24px |
| Numeric | `inputmode="decimal"`, `text-align: end`, `tabular-nums` |

## Implementation sketch
```html
<div class="inline-edit" data-field="growth">
  <span id="lbl-growth" class="label">Revenue growth (Y1)</span>
  <button type="button" class="ie-read" aria-describedby="lbl-growth">8.2% <svg aria-hidden="true" class="pencil"></svg></button>
  <form class="ie-edit" hidden>
    <input id="growth" name="growth" inputmode="decimal" aria-labelledby="lbl-growth"
           required data-min="-50" data-max="100" aria-describedby="growth-unit">
    <span id="growth-unit" class="suffix">%</span>
    <button type="submit" aria-label="Save growth rate">✓</button>
    <button type="button" aria-label="Cancel editing" class="ie-cancel">✕</button>
    <p id="growth-err" class="error" hidden><span aria-hidden="true">⚠</span> Enter a rate between −50% and 100%.</p>
  </form>
  <p role="status" class="visually-hidden"></p>
</div>
```
```css
.ie-read { font: inherit; line-height: inherit; padding: 2px 6px; border-radius: 4px; background: transparent; border: 0; cursor: text; }
.ie-read .pencil { opacity: 0; }
@media (hover: hover) { .ie-read:hover { background: var(--surface-hover); } .ie-read:hover .pencil { opacity: 1; } }
.ie-read:focus-visible .pencil { opacity: 1; }
@media (hover: none) { .ie-read .pencil { opacity: .6; } }
.ie-edit input { font: inherit; padding: 2px 6px; inline-size: 8ch; text-align: end; font-variant-numeric: tabular-nums; }
.ie-edit input:user-invalid { outline: 2px solid var(--danger-border); }
```
```ts
export function parseNumeric(raw: string): number | null {
  const s = raw.trim().replace(/[\s$€£]/g, '').replace(/%$/, '');
  const m = /^(-?[\d.,]+)([kmb])?$/i.exec(s);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  const mult: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };
  return n * (m[2] ? mult[m[2].toLowerCase()] ?? 1 : 1);
}

export function onEditKeydown(e: KeyboardEvent, commit: () => void, cancel: () => void): void {
  if (e.key === 'Escape') { e.preventDefault(); cancel(); return; }
  if (e.key === 'Enter') { e.preventDefault(); if (e.isComposing) return; commit(); }
}
```
(This parser is deliberately en-US. Use `Intl.NumberFormat(locale).formatToParts` to find the locale's group and decimal separators before stripping.)

## Checklist
- [ ] The edit pattern matches the shape of the edit: inline for one field, panel or page for multi-field, switch for instant booleans.
- [ ] Editable values have a visible affordance on hover, on focus and on touch.
- [ ] The read and edit views share geometry, so nothing shifts.
- [ ] Enter saves, Esc cancels, IME composition is respected, and ✓/✕ are visible.
- [ ] Save progress, success and failure show inline, and failure reverts with Retry.
- [ ] Errors appear after interaction (`:user-invalid`), next to the field, with fix instructions.
- [ ] Numeric fields accept locale and shorthand formats and show units as suffixes.
- [ ] Batch edits show a dirty count with Save/Discard and guard against navigating away.

## Sources
- https://atlassian.design/components/inline-edit/usage
- https://www.nngroup.com/articles/indicators-validations-notifications/
- https://www.nngroup.com/articles/date-input/
- https://atlassian.design/components/button/usage (avoid disabled buttons)
- https://www.nngroup.com/articles/response-times-3-important-limits/
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/forms.md`
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md`
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md`
- modern-web-guidance: `skills/modern-web-guidance/guides/forms/switch.md`
- modern-web-guidance: `skills/modern-web-guidance/guides/accessibility/accessible-error-announcement.md`
- modern-web-guidance: `skills/modern-web-guidance/guides/accessibility/accessibility.md`
