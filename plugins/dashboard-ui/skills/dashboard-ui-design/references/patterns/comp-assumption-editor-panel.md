# Assumption editor panel

> A model-input panel sits beside the outputs it changes, never on top of them. Every field shows its default and where the default came from, marks when the user has changed it, can be reset on its own, and the panel summarises "your inputs vs default" as a diff with the effect on the result.

**Category:** Components and interaction · **Applies to:** DCF and valuation inputs, forecast drivers, pricing calculators, capacity and budget planners, any "adjust assumptions" what-if surface · **Priority:** must (for products with editable models)

## When to use / when not
- **Use** when users tune 3–20 numeric inputs and watch a result change. Fewer than 3: put them inline next to the result. More than about 20: split into tabbed groups or a full page with a sticky result bar.
- **Use** the docked, non-modal panel by default. A modal is only right if the edit must be committed as one transaction and the outputs aren't needed while editing (rare for what-ifs; see `comp-overlay-choice.md`).
- **Don't** use this for settings or preferences that don't change a computed output. Use a normal form.
- The slider-plus-number control itself is in `comp-slider-with-number-input.md`; recompute timing and output animation are in `motion-what-if-live-recompute.md`. This file covers the panel around them.

## Rules (do)
- **Placement.**
  - Desktop (≥ 1024px): a docked column, 320–400px, at the inline-end or inline-start of the outputs. The main result and its chart stay visible and interactive. No scrim.
  - Tablet and mobile: a bottom sheet at about 50% height with the headline result pinned in a sticky bar above it, so the effect stays visible while editing.
- **Group fields** by the user's mental model, not the code's: Growth, Margins, Reinvestment, Risk and discount rate, Terminal value. 3–7 fields per group, groups as `<fieldset>` with `<legend>`.
- **Order fields by impact** within a group when you know it (from a sensitivity run; see `chart-tornado-sensitivity.md`): the most influential first.
- **Each field shows, in this order:**
  1. Label with unit and period: "Revenue growth, years 1–5 (%/yr)".
  2. The control (number input, with a slider only where dragging helps).
  3. **Default and its source**, always visible as muted helper text: "Default 9.3% · 5-yr analyst consensus". Not a placeholder: placeholders vanish when typing.
  4. Optional context: a peer range or historical range, "Peers 4–14% (25th–75th)", drawn as a small band on the slider track.
  5. **Changed marker** when the value differs from the default: a dot plus the word "edited", and a per-field "Reset to 9.3%" link-button that names the value it restores.
- **Reset at three levels:**
  - per field (restores that field's default);
  - per group ("Reset margins");
  - all ("Reset all to defaults"), placed away from the primary action and undoable.
  Carbon defines Reset as reverting values to the last saved state, and Nielsen argues Reset is harmful on forms but useful in complex dialogs with good defaults as "a quick way home". So: never a bare "Reset" next to "Apply"; label what it restores, and offer Undo for 10 s or keep history (see `prog-optimistic-ui-and-undo.md`).
- **Diff summary.** At the top of the panel, a collapsed "3 inputs changed" line that expands into a table: input, default, yours, effect on result. "Terminal growth · 2.5% → 3.5% · +$18/share". The effect column is the single-input delta from base (one at a time, holding others at your values), and is labelled so.
- **Presets.** Bear / Base / Bull (or named scenarios) as a segmented control at the top. Choosing a preset sets all fields; editing any field switches the indicator to "Custom (from Base)". Never silently overwrite custom values: confirm or offer Undo (see `chart-scenario-comparison.md`).
- **Validation.**
  - Hard limits as `min`/`max` with an inline message stating the range and why: "Terminal growth must be below the discount rate (8.9%)".
  - Cross-field rules shown at the field that breaks them, plus a summary at the top if the result can't compute. Keep the last valid result visible and marked "Not updated: fix 1 input".
  - Soft warnings for plausible-but-extreme values ("Above all peers") in a muted warning style, not an error.
- **Persistence and sharing.** Changed inputs go in the URL (only the diff from defaults, e.g. `?g=3.5&tg=3.0`) or a saved scenario. On load, show the "edited" markers so a shared link is honest about being non-default.
- **Defaults can change.** If the defaults update (new filing, new consensus) while a user has custom values, keep the user's values and show "Default changed: 9.3% → 8.1%" on the field.
- **Number entry.** Accept typed values in the display unit (percent as 9.3, not 0.093), allow the locale decimal separator, and format on blur (see `data-number-formatting.md`). Step sizes match meaningful precision: 0.1 pt for rates, 1 for years.

## Anti-patterns (don't)
- A modal "Adjust assumptions" sheet with a dimming scrim that hides the chart and value it changes.
- Defaults shown only as placeholders, or not at all, so after one edit the user can't tell what the model assumed.
- A single "Reset" button next to "Apply" with no label of what it resets and no undo.
- Changing a preset silently wipes custom edits.
- Sliders without a typed input, so 8.9% can't be entered exactly.
- Showing the same input at different precision in the editor and in the output prose (9.34% vs 9.3%). Pick one per surface.
- Disabling the result with a spinner while every keystroke recomputes. Keep the last result, mark it pending (see `motion-what-if-live-recompute.md`).
- Inputs in decimal (0.093) in the UI because the model stores them that way.

## Good references
- [GOV.UK check answers pattern](https://design-system.service.gov.uk/patterns/check-answers/) — a summary list of each answer with a per-row "Change" link whose hidden text names the answer; returning from an edit goes straight back to the summary. The model for the diff table and per-input change links.
- [Carbon, Common actions](https://carbondesignsystem.com/patterns/common-actions/) — distinct definitions for Clear (remove a value; restores a default where one exists), Reset (revert to last saved state, usually a link) and Cancel. Useful to name the three levels precisely.
- [Nielsen, Reset and Cancel buttons (NN/g, 2000)](https://www.nngroup.com/articles/reset-and-cancel-buttons/) — Reset is clicked by mistake and rarely helps, except in complex dialogs with good defaults where it is "a quick way home to safe grounds".
- [isee systems, A better chained slider](https://blog.iseesystems.com/stella-ithink/a-better-chained-slider/) — when inputs must total 100%, they stopped auto-reapportioning other values (which changed things users didn't touch), showed the running total red/green, and added an explicit "Distribute" action.
- [Damodaran, valuation spreadsheets](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm) — the simple FCFF model ships with defaults "to protect you from inconsistent assumptions", which is the right posture: defaults are a safety net the user can see and override.

## Bad references
- Assumption editors that open as a full-height right sheet with a scrim over the outputs (common in valuation apps). The user adjusts WACC, closes the sheet, reads the value, reopens the sheet: a loop that hides cause and effect.
- [isee systems, A better chained slider](https://blog.iseesystems.com/stella-ithink/a-better-chained-slider/) — its own "before" state: pushing one slider over 100% silently took the excess from other sliders, changing values the user hadn't touched.
- Spreadsheet-style input grids with no defaults column: after an hour of edits nobody knows which numbers are the analyst's and which are the model's.

## Accessibility
- Each group is a `<fieldset>` with `<legend>`. Each control has a `<label>`; helper text (default, source, range) is tied with `aria-describedby`.
- The "edited" state is text ("edited"), not only a dot or colour.
- Per-field reset buttons have names that say what they restore: "Reset revenue growth to 9.3%".
- Errors use `aria-invalid="true"` and an `aria-describedby` message; the cross-field summary links to each field.
- Recomputed results are announced politely and debounced (once, after input settles): "Value per share $151, up $9 from default" (see `motion-what-if-live-recompute.md`).
- The docked panel is a `<section aria-labelledby>` or `<aside>`, not a `role="dialog"`, and doesn't trap focus.
- Bottom sheet on mobile: the pinned result stays outside the sheet and readable at 200% zoom.

## Motion / interaction (if relevant)
- Input → result update follows `motion-what-if-live-recompute.md` (debounced compute, no digit tweening on every keystroke).
- Reset: the field value changes instantly; the "edited" marker fades out in 150ms.
- Preset switch: fields update together; the diff summary count updates. No staggered field animation.
- Panel open/close on desktop: width transition ≤ 200ms or none; on reduced motion, none.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Panel width | 320–400px (docked) | Desktop editor column |
| Mobile sheet | 50dvh with sticky 56px result bar | Small screens |
| Fields per group | 3–7 | Grouping |
| Field gap | 12px; group gap 24px | Layout |
| Helper text | 0.75rem, `--text-muted` | Default and source line |
| Edited marker | 6px dot `--accent` + "edited" 0.75rem | Changed field |
| Peer band on track | `--accent` at 15% opacity | Context range |
| Undo window for "Reset all" | 10s toast or persistent history | Recovery |
| Recompute debounce | 150–250ms after last input | See `motion-what-if-live-recompute.md` |

## Implementation sketch
```tsx
import { useMemo, useState } from 'react'

type FieldId = 'growth' | 'margin' | 'wacc' | 'terminal'

interface FieldSpec {
  id: FieldId
  label: string
  unit: '%'
  step: number
  min: number
  max: number
  defaultValue: number
  defaultSource: string
}

type Values = Record<FieldId, number>

export function AssumptionPanel(props: {
  fields: readonly FieldSpec[]
  values: Values
  onChange: (next: Values) => void
  effectOf: (id: FieldId, values: Values) => number // value-per-share delta vs default for this input alone
}) {
  const { fields, values, onChange, effectOf } = props
  const [open, setOpen] = useState(false)
  const changed = useMemo(
    () => fields.filter((f) => values[f.id] !== f.defaultValue),
    [fields, values],
  )
  const set = (id: FieldId, v: number) => onChange({ ...values, [id]: v })

  return (
    <aside className="assumptions" aria-labelledby="assumptions-title">
      <h2 id="assumptions-title">Assumptions</h2>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {changed.length === 0 ? 'All defaults' : `${changed.length} inputs changed`}
      </button>
      {open && changed.length > 0 && (
        <table className="diff">
          <thead><tr><th scope="col">Input</th><th scope="col">Default</th><th scope="col">Yours</th><th scope="col">Effect alone</th></tr></thead>
          <tbody>
            {changed.map((f) => (
              <tr key={f.id}>
                <th scope="row">{f.label}</th>
                <td>{f.defaultValue}{f.unit}</td>
                <td>{values[f.id]}{f.unit}</td>
                <td>{effectOf(f.id, values) >= 0 ? '+' : '−'}${Math.abs(effectOf(f.id, values)).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <fieldset>
        <legend>Growth and margins</legend>
        {fields.map((f) => {
          const edited = values[f.id] !== f.defaultValue
          const helpId = `${f.id}-help`
          return (
            <div key={f.id} className="field" data-edited={edited}>
              <label htmlFor={f.id}>{f.label} ({f.unit})</label>
              <input id={f.id} type="number" inputMode="decimal" step={f.step} min={f.min} max={f.max}
                     value={values[f.id]} aria-describedby={helpId}
                     onChange={(e) => { const n = e.currentTarget.valueAsNumber; if (!Number.isNaN(n)) set(f.id, n) }} />
              <p id={helpId} className="help">Default {f.defaultValue}{f.unit} · {f.defaultSource}
                {edited && <span className="edited"> · edited</span>}</p>
              {edited && (
                <button type="button" className="reset" onClick={() => set(f.id, f.defaultValue)}>
                  Reset {f.label.toLowerCase()} to {f.defaultValue}{f.unit}
                </button>
              )}
            </div>
          )
        })}
      </fieldset>
    </aside>
  )
}
```
```css
.layout-whatif { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 400px); gap: 24px; }
@media (width < 1024px) { .layout-whatif { grid-template-columns: minmax(0, 1fr); } }
.assumptions { position: sticky; inset-block-start: 16px; max-block-size: calc(100dvh - 32px);
               overflow-y: auto; padding: 16px; border: 1px solid var(--border-subtle);
               border-radius: 12px; background: var(--surface-1); }
.assumptions fieldset { border: 0; padding: 0; margin: 0 0 24px; display: grid; gap: 12px; }
.field[data-edited="true"] label::before { content: ""; display: inline-block; inline-size: 6px; block-size: 6px;
               border-radius: 50%; background: var(--accent); margin-inline-end: 6px; vertical-align: middle; }
.help { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0; }
.reset { font-size: 0.75rem; background: none; border: 0; padding: 0; color: var(--accent); text-decoration: underline; }
.diff td, .diff th { font-variant-numeric: tabular-nums; text-align: end; padding: 4px 8px; }
.diff th[scope="row"] { text-align: start; font-weight: 400; }
```

## Checklist
- [ ] The editor is docked or a sheet that leaves the headline result visible; no scrim over outputs.
- [ ] Every field shows its default and the default's source as persistent text, not a placeholder.
- [ ] Changed fields are marked with text, and each has a reset that names the value it restores.
- [ ] "Reset all" is labelled, separated from the primary action, and undoable.
- [ ] A diff summary lists default vs yours and the effect of each change.
- [ ] Presets switch to "Custom" on edit and never silently discard custom values.
- [ ] Cross-field errors show at the field, the last valid result stays visible and marked stale.
- [ ] Non-default inputs round-trip through the URL or a saved scenario.

## Sources
- https://design-system.service.gov.uk/patterns/check-answers/
- https://carbondesignsystem.com/patterns/common-actions/
- https://www.nngroup.com/articles/reset-and-cancel-buttons/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset ("You should usually avoid including reset buttons in your forms ... more likely to frustrate users who click them by mistake")
- https://blog.iseesystems.com/stella-ithink/a-better-chained-slider/
- https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm
- https://pair.withgoogle.com/chapter/explainability-trust/ (explanation via interaction: let users try "what if")
- https://www.w3.org/WAI/tutorials/forms/grouping/
