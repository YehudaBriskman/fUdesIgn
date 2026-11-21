# Selects, comboboxes and autocomplete

> Use a native `<select>` for 6–10 known options and a combobox (type to filter) for long or searchable sets; a custom combobox follows the WAI-ARIA APG pattern exactly, keeps focus in the input, and never auto-selects or submits on its own.

**Category:** Inputs · **Applies to:** country, currency, timezone, assignee and tag pickers, address lookup, search-as-you-type fields · **Priority:** must

## When to use / when not
| Options | Use |
|---|---|
| 2–5 | Radios (`finput-choice-controls.md`) |
| 6–10, known, short labels | Native `<select>` |
| More than 10, user knows the name (countries, currencies) | A combobox that filters, with a native `<select>` in sensible order as the fallback |
| Large or remote sets (people, products, addresses) | Combobox with async suggestions |
| Free text with helpful suggestions | `<input list>` + `<datalist>`, or a combobox with "use what I typed" |
| Many-of-many (tags, labels) | Multi-select combobox with removable chips, or checkboxes ≤ ~15 (this skill's cut-off) |

- Luke Wroblewski calls dropdowns "the UI of last resort". Baymard: "Drop-downs are generally a poor choice for offering fewer than 5 or more than 10 options" (rough guidance; the table follows it). Hidden options cost a click and a scan.
- GOV.UK: avoid the select if possible; its accessible-autocomplete component replaces long selects such as country.

## Rules (do)
- **Native `<select>` first** for known lists: free keyboard, type-ahead, mobile pickers and screen-reader support.
  - First option `value=""` with a prompt ("Select a country"), `required` on the select, so `:user-invalid` flags a missed choice only after interaction (modern-web-guidance select guide).
  - Style it with `appearance: base-select` where supported (Chrome/Edge 135+; Firefox doesn't support it yet), falling back to the native picker (modern-web-guidance branded-select guide).
- **Combobox (APG "combobox with listbox popup")**:
  - `<input role="combobox" aria-expanded aria-controls aria-autocomplete="list">`, popup `role="listbox"` with `role="option"` children.
  - Focus stays in the input; ↓/↑ move the active option via `aria-activedescendant`; Enter selects; Esc closes, then a second Esc clears; Tab accepts nothing and moves on (or accepts the highlighted option, but pick one behaviour and keep it).
  - Show results after 1–2 characters (remote: debounce 150–300 ms); show at most 8–10 options with a "Show all" or scroll.
  - Match anywhere in the label, highlight the matched text in **bold**, and accept synonyms and local names ("Deutschland" → Germany; GOV.UK's location picker uses a synonym list).
  - Announce the count of results politely ("5 results available") after typing stops.
  - Empty state: "No results for 'xyz'" plus a way out (clear, or "use what I typed").
- **Never auto-select the first suggestion on blur** and never submit on selection. Selection fills the field; submit is the user's.
- **Keep the typed text if nothing was chosen**, and validate it on blur like any other field.
- **Address lookup**: postcode → choose address is an accelerator, never the only path; always offer "Enter address manually" (Baymard: autocomplete address helps, a mandatory lookup blocks users whose address is missing).
- **`<datalist>`** is fine for light suggestions, but you can't style the popup and its screen-reader and mobile behaviour varies; don't use it where the value must come from the list.
- **Multi-select**: chosen items appear as chips before the input, each with a remove button named "Remove Design"; Backspace on an empty input removes the last chip.

## Anti-patterns (don't)
- A `<div>` dropdown with no listbox role, no keyboard and focus jumping into the popup.
- Selects with 200 unsorted options and no type-ahead (custom ones lose native type-ahead).
- Country selects that start at "Afghanistan" when 90% of users are in one country: preselect from locale or put the likely few first, separated.
- Autocomplete that replaces what the user typed on blur with the first match.
- Search-as-you-type that fires a request per keystroke with no debounce or cancel.
- Selects that submit or navigate on change (WCAG 3.2.2).

## Good references
- [WAI-ARIA APG — Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — roles, states and the full keyboard contract, with tested examples.
- [GOV.UK — accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete) — a select replacement tested with assistive tech: results count announced, synonyms, no auto-select.
- [modern-web-guidance — Select menu interaction](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/select-menu-interaction.md) and [Branded select styling](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/branded-select-styling.md) — empty first option + `required` + `:user-invalid`; `appearance: base-select` with fallback.
- [Baymard — Drop-down usability](https://baymard.com/blog/drop-down-usability) — when selects hurt, and the alternatives.
- [Primer — Autocomplete](https://primer.style/product/components/autocomplete/) — input-owned focus, highlighted match, explicit "no results".

## Bad references
- [Luke Wroblewski — Dropdowns should be the UI of last resort](https://www.lukew.com/ff/entry.asp?1950) — the date-of-birth triple-select and long state lists it uses as examples.
- [Baymard — Drop-down usability](https://baymard.com/blog/drop-down-usability) — its test sessions where users scrolled long, unsorted selects and picked neighbouring options by mistake.

## Accessibility
- Follow APG exactly; test with VoiceOver (macOS and iOS) and NVDA, which differ on `aria-activedescendant`.
- The listbox has an accessible name (`aria-labelledby` the field label).
- Option targets ≥ 24 px tall (44 px on touch).
- Result count in a polite live region, debounced so it doesn't chatter.

## Motion / interaction (if relevant)
- Popup opens in `--motion-dur-short` (150 ms) with opacity only; no slide under reduced motion. Never animate the option list while filtering.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Min chars before suggesting | 1 (local list) / 2 (remote) | Combobox |
| Debounce (remote) | 150–300ms | Requests |
| Max visible options | 8–10 | Then scroll or "Show all" |
| Option height | 36px fine / 44px coarse | Listbox rows |
| Popup surface | `--surface-3`, `--shadow-md`, `--radius-md` | Listbox |

## Implementation sketch
```html
<div class="field combo">
  <label id="ctry-l" for="ctry">Country</label>
  <input id="ctry" name="country" role="combobox" aria-expanded="false" aria-controls="ctry-list" aria-autocomplete="list" autocomplete="country-name">
  <ul id="ctry-list" role="listbox" aria-labelledby="ctry-l" hidden></ul>
  <p id="ctry-status" class="visually-hidden" aria-live="polite"></p>
</div>
```
```ts
export type Option = { value: string; label: string; synonyms?: readonly string[] }

export function filterOptions(options: readonly Option[], query: string, max = 10): Option[] {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return []
  const hit = (s: string): boolean => s.toLocaleLowerCase().includes(q)
  const starts = (o: Option): boolean => o.label.toLocaleLowerCase().startsWith(q)
  return options.filter((o) => hit(o.label) || (o.synonyms ?? []).some(hit))
    .sort((a, b) => Number(starts(b)) - Number(starts(a)))
    .slice(0, max)
}

// Arrow keys move aria-activedescendant; Enter picks; Escape closes. Focus never leaves the input.
export function comboKeydown(e: KeyboardEvent, input: HTMLInputElement, list: HTMLElement, pick: (el: HTMLElement) => void): void {
  const items = [...list.querySelectorAll<HTMLElement>('[role="option"]')]
  const current = items.findIndex((el) => el.id === input.getAttribute('aria-activedescendant'))
  const move = (i: number): void => {
    items.forEach((el, j) => el.setAttribute('aria-selected', String(j === i)))
    const target = items[i]
    if (target) { input.setAttribute('aria-activedescendant', target.id); target.scrollIntoView({ block: 'nearest' }) }
  }
  if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); move((current + 1) % items.length) }
  else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); move((current - 1 + items.length) % items.length) }
  else if (e.key === 'Enter' && current >= 0 && !e.isComposing) { e.preventDefault(); const el = items[current]; if (el) pick(el) }
  else if (e.key === 'Escape') { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant') }
}
```

## Checklist
- [ ] Control chosen by option count and data source (table above).
- [ ] Native selects have an empty prompt option and `required` where needed.
- [ ] Custom comboboxes follow APG roles and keys; focus stays in the input.
- [ ] Matches highlight; synonyms and local names match; result count announced.
- [ ] Nothing auto-selects on blur or submits on selection.
- [ ] Address lookups always offer manual entry.

## Sources
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- https://github.com/alphagov/accessible-autocomplete
- https://design-system.service.gov.uk/components/select/
- https://baymard.com/blog/drop-down-usability
- https://www.lukew.com/ff/entry.asp?1950
- https://primer.style/product/components/autocomplete/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist
- https://developer.chrome.com/blog/a-customizable-select
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/select-menu-interaction.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/branded-select-styling.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/custom-select-picker-layouts.md
