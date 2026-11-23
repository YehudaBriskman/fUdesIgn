# Microcopy for data: labels, errors, empty states and number words

> Every word on a dashboard is part of the data. Labels name what is counted, over what period and in what unit; errors state the cause and the fix; empty states say what will appear and how; and number words ("about", "fewer", "percentage points", "no data") mean exactly one thing everywhere.

**Category:** Foundations · **Applies to:** metric labels, axis titles, column headers, tooltips, empty and error states, buttons, toasts, confirmation dialogs, export file names · **Priority:** must

## When to use / when not
- **Use** whenever a view gets new text: a metric, a column, a filter, a state, an action.
- **Use** it in review. Copy defects (two names for one action, "Error occurred", "N/A" in a numeric column) are cheap to fix and visible to every user.
- **Not** for long-form explainers. Methodology pages follow `found-methodology-explainability.md`. Footnotes and sources follow `data-units-footnotes-sources.md`. General interface writing: `uxwrt-ux-writing-and-content-design.md`.

## Rules (do)
### Labels
- **Name what is counted, then how.** "Net revenue", "Active accounts (30d)", "Median order value (USD)". A label that needs a tooltip to be understood is the wrong label.
- **Unit and period live in the label or the column header,** not only in a footnote: "Revenue, USD millions", "Churn rate, monthly". One unit per column, so cells carry bare numbers.
- **Sentence case** for every label, title, button and tab. GOV.UK uses sentence case everywhere, including page titles. Capitals are reserved for proper nouns and established acronyms.
- **No all-caps labels** over a few characters. All-caps removes word shape and screen readers may spell some words out.
- **Spell out an abbreviation on first use** per view (GOV.UK, Mailchimp), unless the audience uses it daily (API, USD, EBIT for analysts). Keep a glossary for the rest.
- **Avoid "eg" and "etc".** GOV.UK notes screen readers may read "eg" as "egg". Write "for example" or "such as".

### Metric definitions
- One sentence, written for the reader: what is counted, the formula in words, the period and the exclusions. "Margin of safety: how far the price is below our value, as a share of value (1 − price ÷ value)."
- The same definition appears in the tooltip, the methodology page and the export header. Write it once and reuse the string.

### Number words
| Situation | Write | Don't write |
|---|---|---|
| Change in a rate | "Churn fell 1.2 percentage points (pt), from 5.0% to 3.8%" | "Churn fell 1.2%" (that is a relative change of 24%) |
| Relative change | "Revenue rose 12% vs October" | "Revenue rose 12 points" |
| Approximate value | "About $3.8 million" | "~$3.8M" in prose; "$3,848,305.93" when precision is fake |
| Countable things | "Fewer accounts", "fewer than 10 errors" | "Less accounts" |
| Uncountable amounts | "Less revenue", "less time" | "Fewer revenue" |
| Negative number | "−6" with the minus sign U+2212 | "-6" with a hyphen, "–6" with an en dash |
| Ranges | "500 to 900" in prose; "500–900" in tables and UI | "from 500–900" |
| Large round numbers in prose | "$30 million" | "$30M" in sentences (Microsoft, GOV.UK) |
| Compact numbers in UI | "$30M", "8,210" | "8.21K" (same length as "8,210", Microsoft) |
| Leading zero | "0.5" | ".5" |
| Probability from a simulation | "Value exceeded price in 8% of 10,000 draws" | "8% chance the stock is cheap" |

- ONS defines a percentage point as the difference between two percentages: 10% falling by 1 percentage point is 9%, while falling by 1% is 9.9%. Use "pt" as the compact unit in tables (see `data-delta-trend-indicators.md`).
- Match precision to the claim. "About" and compact notation for estimates; full precision only where the reader acts on it (see `data-number-formatting.md`).

### Missing, zero and not applicable
- `0` means a real zero.
- `—` (em dash) with the accessible name "No data" means the value is missing.
- "Pending" or "Available after Jan 15" means it doesn't exist yet.
- "Not applicable" means the metric doesn't apply to this row. GOV.UK: don't use "N/A" in empty table cells; write "no data" or "not applicable".
- See `data-loading-empty-error-states.md` for how each renders.

### Errors
- **Say what failed and what to do,** in that order: "Couldn't load value history. Retry". GOV.UK: describe what happened and tell the user how to fix it.
- **Plain words, no codes in the headline.** Put the code or request ID in a details disclosure for support (NN/g).
- **No blame, no apology, no jokes.** Avoid "invalid", "illegal", "forbidden", "oops", "sorry" and "please" (GOV.UK). Neutral and specific: "Enter a growth rate between −50% and 100%".
- **Specific beats generic.** "This field is required" becomes "Enter a discount rate". Use the field's label in the message, and the same text beside the field and in any error summary.
- **Keep the user's input** and the last good data (NN/g).
- **Partial results say what is missing:** "Showing 2 of 3 accounts. Chase didn't respond. Retry".

### Empty states
- **Title states the condition or the next step;** the body says what will appear here and how to get it; one primary action (Carbon, NN/g).
- First use: "No scenarios saved yet. Save the current inputs to compare them later. [Save scenario]".
- Zero results: "No companies match these filters. [Clear filters]", with the active filters echoed.
- NN/g's good example teaches the feature in place: Datadog's favourites panel says to star items to list them there.

### Actions and names
- **One name per action across the flow.** The button says "Save scenario", the toast says "Scenario saved", the list is "Saved scenarios", the audit log says "Saved scenario". Never "Save", then "Snapshot created", then "Bookmarks".
- **Verbs say what happens:** "Export CSV", "Reset to defaults", "Delete scenario". Not "OK", "Submit" or "Yes".
- **Destructive confirmations restate the object and consequence:** "Delete scenario "Bear case"? This can't be undone." Buttons: "Delete scenario" and "Keep".

## Anti-patterns (don't)
- "Error occurred", "Something went wrong" with no cause, fix or retry.
- "Invalid input" with no allowed range.
- "N/A" and "-" used for both missing and not-applicable in one table.
- A delta labelled "%" when it is a change in percentage points.
- "~", "approx." and "c." all used for "about" on one page.
- Title Case Headings Mixed With Sentence case ones.
- Tracked all-caps micro-labels on every panel (see `ref-ai-default-tells.md`).
- Different names for the same metric across tabs ("Fair value", "Intrinsic value", "Our value").
- Tooltips that repeat the visible label.
- "Click here" links.

## Good references
- [GOV.UK A to Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/) — sentence case everywhere, "no data" or "not applicable" instead of "N/A", minus sign for negatives, "0.5" not ".5", "to" in ranges, avoid "eg".
- [GOV.UK Design System: Error message](https://design-system.service.gov.uk/components/error-message/) — say what happened and how to fix it; no "invalid", "oops", "sorry" or "please"; same text beside the field and in the summary.
- [Microsoft Writing Style Guide: Numbers](https://learn.microsoft.com/en-us/style-guide/numbers) — minus sign for negatives, avoid K/M/B in prose, en dash ranges in tables and UI, leading zero.
- [NN/g: Error-message guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — visible near the source, human-readable, precise, constructive, no blame, preserve input.
- [Carbon: Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) — positive titles ("Start by adding data assets"), one primary action, no dead ends, no jokes in error states.
- [ONS service manual: Percentages](https://service-manual.ons.gov.uk/content/numbers/percentages) — percentage points written in full and defined as the difference between two percentages.

## Bad references
- [NN/g: Designing empty states](https://www.nngroup.com/articles/empty-state-interface-design/) — a developer tool's empty state tells users to "Send a request to view details in the workspace" but not how or where.
- [GOV.UK Design System: Error message](https://design-system.service.gov.uk/components/error-message/) — lists "This field is required" and "Select an option" as generic messages to replace.

## Accessibility
- Plain language helps everyone and especially people with cognitive disabilities. Aim for short sentences (under about 20 words) in states and errors.
- Missing values need an accessible name ("No data"); a bare dash may be read as "dash" or skipped.
- Use the minus sign U+2212 so screen readers say "minus". Check your screen reader; if it is silent, add visually hidden text.
- Error text is linked to its field with `aria-describedby`, and an error summary links to each field.
- Abbreviations that matter get their expansion in the accessible name or an `<abbr title>` plus a glossary link (`title` alone is not reliable).

## Motion / interaction (if relevant)
- Toasts confirming an action reuse the action's name and stay until dismissed (see `comp-notifications-alerts.md`).
- Inline errors appear after blur or submit, not on the first keystroke (NN/g: avoid premature errors).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Missing glyph | `—` U+2014 + accessible "No data" | Table and card cells |
| Minus | `−` U+2212 | All negative numbers |
| Range dash | `–` U+2013 in UI, "to" in prose | Ranges |
| Percentage point unit | "pt" in tables, "percentage points" in prose | Rate changes |
| Approximation word | "about" | One word for estimates |
| Max error headline | about 8 words | Errors |
| Max empty-state body | 1–2 sentences | Empty states |

## Implementation sketch
One copy module so the same strings and number words appear everywhere.
```ts
type Cell =
  | { kind: 'value'; value: number }
  | { kind: 'missing' }
  | { kind: 'pending'; availableFrom: string }
  | { kind: 'notApplicable' }

const MINUS = '−'

export function cellText(c: Cell, fmt: Intl.NumberFormat): { text: string; label: string } {
  switch (c.kind) {
    case 'value': {
      const text = fmt.format(c.value).replace('-', MINUS)
      return { text, label: text }
    }
    case 'missing': return { text: '—', label: 'No data' }
    case 'pending': return { text: `Available ${c.availableFrom}`, label: `Available ${c.availableFrom}` }
    case 'notApplicable': return { text: 'Not applicable', label: 'Not applicable' }
  }
}

/** Absolute change between two rates, in percentage points. */
export function rateChange(fromPct: number, toPct: number): string {
  const d = toPct - fromPct
  const n = Math.abs(d).toFixed(1)
  const dir = d > 0 ? 'rose' : d < 0 ? 'fell' : 'was unchanged'
  return d === 0 ? `${dir} at ${toPct.toFixed(1)}%` : `${dir} ${n} percentage points, from ${fromPct.toFixed(1)}% to ${toPct.toFixed(1)}%`
}

/** One name per action: button, toast and log entry come from one record. */
export const ACTIONS = {
  saveScenario: { button: 'Save scenario', done: 'Scenario saved', list: 'Saved scenarios' },
  resetInputs: { button: 'Reset to defaults', done: 'Inputs reset to defaults', list: 'Resets' },
} as const

export function errorText(what: string, fix: 'retry' | 'checkInput' | 'requestAccess'): string {
  const tail = { retry: 'Retry', checkInput: 'Check the highlighted fields', requestAccess: 'Request access' }[fix]
  return `Couldn't load ${what}. ${tail}`
}
```

## Checklist
- [ ] Every metric label names what is counted, and its unit and period are visible without hovering.
- [ ] All labels, titles, tabs and buttons use sentence case.
- [ ] Rate changes use percentage points; relative changes use %.
- [ ] `0`, `—` (No data), "Pending" and "Not applicable" are distinct; no "N/A" or "NaN".
- [ ] Negative numbers use U+2212.
- [ ] Every error states cause and fix, with no code, blame, apology or joke in the headline.
- [ ] Every empty state names the condition and offers one next action.
- [ ] Each action has one name across button, toast, list and log.

## Sources
- https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
- https://design-system.service.gov.uk/components/error-message/
- https://learn.microsoft.com/en-us/style-guide/numbers
- https://www.nngroup.com/articles/error-message-guidelines/
- https://www.nngroup.com/articles/empty-state-interface-design/
- https://carbondesignsystem.com/patterns/empty-states-pattern/
- https://service-manual.ons.gov.uk/content/numbers/percentages ("A value of 10% falling by 1 percentage point becomes 9% ... A fall of 1% would result in a value of 9.9%")
- https://styleguide.mailchimp.com/grammar-and-mechanics/ (abbreviations on first use, % sign, cents only when non-zero)
- https://styleguide.mailchimp.com/numbers/ (fetch failed, 404)
- https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/l/less-fewer (fetch failed, 404; fewer/less rule is standard English usage)
- Idea credit (not copied): "one name per action" and "errors give cause and fix" also appear in Anthropic's frontend-design skill; wording and facts here come from the primary sources above.
