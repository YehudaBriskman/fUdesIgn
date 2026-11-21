# Date and time inputs

> Pick the date control by how people know the date: three labelled numeric fields for dates they remember (birth, passport issue), a calendar picker with typed entry for dates they choose near today, presets for ranges; always show the expected format, accept any sensible separator and never auto-advance between fields.

**Category:** Inputs · **Applies to:** date of birth, document dates, booking and scheduling dates, deadlines, times · **Priority:** must

## When to use / when not
| The date is… | Use |
|---|---|
| Memorable or on a document (birth date, passport issue, start of tenancy) | **Three fields: Day, Month, Year** (GOV.UK date input) |
| Chosen relative to today (appointment, delivery, due date) | **Calendar picker + a typed field** (native `<input type="date">` is acceptable) |
| A range for reporting or filtering | **Presets + range picker** (`comp-date-range-picker.md`, dashboard-ui) |
| Approximate ("around March 2019") | Month + year fields, or a select of years |
| A time of day | `<input type="time">` or a text field accepting "2pm", "14:00"; a select of slots for bookings |

- NN/g: typing is faster than any calendar for dates more than a few months away; calendars help when the weekday or proximity matters.
- **Who carries the complexity?** Tesler's law (the law of conservation of complexity, named after Larry Tesler, who co-developed cut, copy and paste at Xerox PARC and later worked at Apple): some complexity can't be removed, only moved between the system and the user. Every row above moves it into the system: typed fields that parse what people know, calendars that show weekdays, presets for common ranges. Three drop-downs move it onto the user: simple to build, slow to use.

## Rules (do)
- **Three-field memorable dates** (GOV.UK):
  - A `<fieldset>` whose `<legend>` is the question, hint "For example, 27 3 2007".
  - Fields labelled "Day", "Month", "Year"; widths 2ch, 2ch, 4ch (plus padding); `inputmode="numeric"`; `autocomplete="bday-day"` etc. for birth dates.
  - Order follows the locale (D M Y in the UK, M D Y in the US); the labels make the order explicit either way.
  - Accept "3" and "03", month names and abbreviations ("Mar") in the month field.
  - **Never auto-tab** to the next field after two digits: it breaks correction and confuses screen-reader and keyboard users (GOV.UK).
  - Errors name the specific part: "Date of birth must include a year", and highlight only the fields in error.
- **Single text field with a format** (when space or convention demands): hint "DD/MM/YYYY" above, accept `/`, `-`, `.` and spaces, leading zeros optional, two-digit years only if unambiguous (NN/g date-input guidelines).
- **Relative dates** ("this Friday", "tomorrow", "in 2 weeks"): with a calendar plus a typed field, the user picks the day by its weekday or types the words; three drop-downs make them work out the date first. If the typed field accepts relative words, echo the resolved date ("Friday 27 November 2026") next to it before submit.
- **Calendar pickers**:
  - Keep a typed field always available (Carbon: there should always be a simple way to enter the date in a text field).
  - Open on the current or selected month; mark today; disable impossible dates but keep them visible; show weekday names in the locale's first day of week.
  - The dialog follows the APG date-picker dialog pattern: grid with arrow keys, PageUp/PageDown by month, Esc closes and returns focus to the button.
  - Native `<input type="date">` is acceptable for near dates: it is localised and accessible, but its displayed format follows the browser locale, not your page, and it can't be styled much. Avoid it for birth dates (scrolling back 40 years in a calendar is slow).
- **Time zones**: say which zone a time is in when users and the service may differ ("2:00 pm UK time"). Store UTC + zone id; display in the user's zone.
- **Times**: accept "9", "9am", "09:00", "21:00"; show 12- or 24-hour by locale; for bookings, offer available slots as radios or buttons, not a free time field.
- **Validate logically**: real dates (no 31 February), plausible ranges ("Date of birth must be in the past"), ordering of start and end dates, with the error on the field that should change.

## Anti-patterns (don't)
- A calendar as the only way to enter a birth date.
- Three `<select>`s for day, month and year (Luke Wroblewski's "last resort" example; NN/g: split drop-downs "require a lot of unnecessary steps"). Note the difference from GOV.UK's three *text* fields: those let people type a date they remember; drop-downs make them scroll for it.
- Auto-advancing date segments; masks that fight the user's separators.
- `placeholder="DD/MM/YYYY"` as the only format cue.
- US-format dates (03/04/2026) shown to an international audience with no month name.
- Rejecting "3-9-2017" when the format hint shows "03/09/2017" (NN/g's Priceline example).

## Good references
- [GOV.UK Design System — Date input](https://design-system.service.gov.uk/components/date-input/) and [Dates pattern](https://design-system.service.gov.uk/patterns/dates/) — three fields, hints, error wording, no auto-tab, accept month names.
- [NN/g — Date-input form fields](https://www.nngroup.com/articles/date-input/) — when to use calendars vs typing, accept multiple formats.
- [WAI-ARIA APG — Date picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) — keyboard model for an accessible calendar.
- [Carbon — Date picker usage](https://carbondesignsystem.com/components/date-picker/usage/) — typed entry always available; simple, single and range variants.

## Bad references
- [NN/g — Date-input form fields](https://www.nngroup.com/articles/date-input/) — Priceline rejecting valid but differently formatted dates without guidance.
- Airline booking forms that force a calendar for passport expiry ten years out: dozens of "next month" clicks.

## Accessibility
- Three-field dates: one fieldset + legend; each field labelled; error linked from the fieldset or each field in error.
- Calendar grids: `role="grid"`, the selected date `aria-selected`, today `aria-current="date"`, every cell with a full date name ("Tuesday 3 March 2026").
- The picker button is named "Choose date" with the current value ("Choose date, selected 3 March 2026").

## Motion / interaction (if relevant)
- Month changes are instant. The dialog may fade in over 150 ms; no slide under reduced motion.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Day / month field | 2ch + padding | Memorable dates |
| Year field | 4ch + padding | Memorable dates |
| Field gap | 16px | Between day, month, year |
| Calendar day cell | 40×40px desktop, 44×44px touch via `pointer: coarse` | Picker grid; WCAG 2.5.8 minimum is 24×24 |
| Today marker | 1px `--border-strong` ring | Calendar |

## Implementation sketch
```html
<fieldset class="date" aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>
  <p id="dob-hint" class="hint">For example, 27 3 2007</p>
  <div class="date-fields">
    <div class="field"><label for="dob-d">Day</label><input id="dob-d" name="dob-day" class="w-2" inputmode="numeric" autocomplete="bday-day"></div>
    <div class="field"><label for="dob-m">Month</label><input id="dob-m" name="dob-month" class="w-2" inputmode="numeric" autocomplete="bday-month"></div>
    <div class="field"><label for="dob-y">Year</label><input id="dob-y" name="dob-year" class="w-4" inputmode="numeric" autocomplete="bday-year"></div>
  </div>
</fieldset>
```
```css
.date { border: 0; padding: 0; margin: 0; }
.date-fields { display: flex; gap: var(--space-4, 16px); }
.w-2 { inline-size: calc(2ch + 2 * var(--field-pad-inline, 12px) + 2px); }
.w-4 { inline-size: calc(4ch + 2 * var(--field-pad-inline, 12px) + 2px); }
.cal button { inline-size: 40px; block-size: 40px; } /* calendar day cell: 40px desktop */
@media (pointer: coarse) { .cal button { inline-size: 44px; block-size: 44px; } } /* 44px touch */
```
```ts
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export type DateParts = { day: string; month: string; year: string }
export type DateResult = { ok: true; year: number; month: number; day: number } | { ok: false; missing: ('day' | 'month' | 'year')[]; message: string }

// Validate a memorable date; the message names the part to fix (GOV.UK wording style).
export function readMemorableDate(p: DateParts, label: string): DateResult {
  const d = p.day.trim(), m = p.month.trim().toLowerCase(), y = p.year.trim()
  const missing = ([['day', d], ['month', m], ['year', y]] as const).filter(([, v]) => v === '').map(([k]) => k)
  if (missing.length === 3) return { ok: false, missing, message: `Enter your ${label.toLowerCase()}` }
  if (missing.length) return { ok: false, missing, message: `${label} must include a ${missing.join(' and ')}` }
  const month = /^\d{1,2}$/.test(m) ? Number(m) : MONTHS.indexOf(m.slice(0, 3)) + 1
  const day = Number(d), year = Number(y)
  if (!/^\d{1,2}$/.test(d) || !/^\d{4}$/.test(y) || month < 1 || month > 12)
    return { ok: false, missing: [], message: `${label} must be a real date` }
  // Round-trip through UTC so 31 February is rejected rather than rolled over to March.
  const t = new Date(Date.UTC(year, month - 1, day))
  if (t.getUTCFullYear() !== year || t.getUTCMonth() !== month - 1 || t.getUTCDate() !== day)
    return { ok: false, missing: [], message: `${label} must be a real date` }
  return { ok: true, year, month, day }
}
```
(Where `Temporal` is available, `Temporal.PlainDate.from({ year, month, day }, { overflow: 'reject' })` does the same check. Plausibility rules such as "must be in the past" run after this.)

## Checklist
- [ ] The control matches how users know the date (memorable, chosen, range).
- [ ] Format shown as hint text above the field; multiple separators accepted.
- [ ] No auto-advance between date segments.
- [ ] Calendar pickers always have typed entry and follow the APG keyboard model.
- [ ] Calendar day cells are 40×40 px on desktop and 44×44 px under `pointer: coarse` (same as `dashboard-ui` `comp-date-range-picker.md`).
- [ ] No day/month/year drop-down triples; the system carries the date complexity (Tesler's law), and any relative words typed are echoed as the resolved date.
- [ ] Errors name the missing or wrong part and highlight only that part.
- [ ] Times state their time zone when it can differ.

## Sources
- https://design-system.service.gov.uk/components/date-input/
- https://design-system.service.gov.uk/patterns/dates/
- https://www.nngroup.com/articles/date-input/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- https://carbondesignsystem.com/components/date-picker/usage/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate
- https://www.lukew.com/ff/entry.asp?1950
- https://lawsofux.com/teslers-law/ (Tesler's law, the law of conservation of complexity)
- https://en.wikipedia.org/wiki/Larry_Tesler (Xerox PARC 1973–80, copy and paste with Tim Mott on Gypsy; Apple 1980–97)
