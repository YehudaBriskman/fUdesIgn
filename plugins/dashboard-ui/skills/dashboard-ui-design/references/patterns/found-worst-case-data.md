# Design against worst-case data

> Demo data flatters every layout. Before a view ships, swap in plausible worst-case data at the same boundary the real data enters (long names, extreme and negative numbers, empties, many rows, mixed scripts, stale and partial results) and fix what breaks.

**Category:** Foundations · **Applies to:** every dashboard view, KPI rows, tables, charts, legends, filters, headers, exports · **Priority:** must

## When to use / when not
- **Use** before the first review of any new view, after any change to a formatter, card or table, and whenever the data source changes (a new market, a new tenant size, a new locale).
- **Use** it as the input to the review rubric. A view that has only ever seen 5 tidy rows has not been reviewed.
- **Don't** hand-edit one card to "see what happens". Hand edits test one place and miss the formatter, the tooltip, the export and the sort. The swap must happen where the data enters the UI (the API client, the loader or the fixture), so every consumer sees it.
- **Don't** invent impossible values to win an argument. Every stress value must be plausible for the domain or sit at a limit the schema allows. A 300-character ticker is not plausible. A 70-character legal entity name is.

## Rules (do)
- **Run the catalogue.** For each data region, try every applicable row:

  | Axis | Stress values | What usually breaks |
  |---|---|---|
  | Text length | Entity names at the schema max (often 80–255 chars), real long names ("Berkshire Hathaway Inc. Class B", "Compagnie Financière Richemont SA") | Truncation without a tooltip, wrapped KPI labels that change card heights, legend overflow |
  | Translation | Short UI labels at 200–300% of English length (IBM figures for ≤ 10 chars, via W3C) | Fixed-width buttons, tabs that collide at 390px |
  | Script and direction | Hebrew or Arabic names, CJK names, a mixed RTL name followed by a number | Digits and punctuation reordered next to RTL text, missing glyphs, wrong line height |
  | Magnitude | 1e12 and 1e-6 in the same column; a value that crosses a compact-notation boundary (999,950 → "1M") | Column width jumps, "1000K", lost precision |
  | Sign | Negative values, exactly 0, negative zero, a delta from 0 (infinite %) | "−0", "+∞%", a bar chart without a zero baseline, a delta coloured "good" when it is bad |
  | Missing | `null`, `undefined`, `NaN`, empty string, "not applicable" | "NaN%", "$undefined", missing shown as 0 |
  | Count | 0 rows, 1 row, page size + 1, 1,284 rows, 10,000 points on a chart | Empty table with headers, a 1-bar chart that fills the width, a 25-row skeleton for 1 row, frozen scroll |
  | Categories | 9–20 series where the palette has 8 | Recycled colours, unreadable legend |
  | Units | Mixed currencies in one table (USD, JPY with 0 decimals, BHD with 3), percent and percentage points in one column | Summed currencies, wrong decimals |
  | Time | A timestamp 3 days old, a future date, a different time zone, a DST boundary | "Updated 0 min ago" on stale data, a missing hour on a chart |
  | Failure | One of 3 endpoints returns 500; one is slow (12 s); one returns an empty body | A blank row of cards, a silent fallback, a spinner forever |

- **Fix the cause, not the sample.** Every fix lands in a shared formatter, component or token, not in the view that showed the bug.
  - Text: truncate with an ellipsis plus the full value in `title` and the accessible name, or wrap to at most 2 lines with `line-clamp` (the unprefixed property is not Baseline; keep `-webkit-line-clamp` as the working form). Never shrink font size to fit. For file names and ids keep the tail visible (two-span middle truncation, `dstoken-typography-details.md`).
  - Numbers: one formatter per metric kind (see `data-number-formatting.md`), with explicit null handling.
  - Direction: wrap user-provided names in `<bdi>`, or set `dir="auto"` on the element that holds them. W3C: wrap each opposite-direction phrase tightly so it is isolated from its neighbours.
  - Missing values follow the four-way split: `0`, `—` (no data), "Pending", "Not applicable" (see `data-loading-empty-error-states.md`).
  - Categories over 8: group the tail into "Other (n)", or switch to small multiples or a table (see `color-dataviz-palettes.md`).
- **Keep a dev-only toggle.** Offer "Demo / Worst case" in a development toolbar or a `?fixture=worst` query parameter. Strip it from production builds. The toggle makes the stress set reproducible for every reviewer and every screenshot.
- **Report before fixing.** First list every break with a screenshot and the stress value that caused it, then fix. This stops the reviewer from quietly fixing only the easy ones.
- **Capture at 2 widths × 2 themes.** Run the worst-case set at 1440px and 390px, in light and dark (see `style-theme-consistency.md`). Long names fail at 390px first.
- **Make the stress set part of CI** once it exists: a visual snapshot of each view under `fixture=worst` catches regressions.
- **Label sample data.** Any demo or placeholder number, name or chart is visibly marked as sample data; never present invented values as real, and state assumptions about data shape, frequency and risk before laying out. (Source corpus: local `dashboard-ux-orchestration`.)

## Anti-patterns (don't)
- Lorem-ipsum metrics: "Metric A 1,234 +12%" on every card. Placeholder data hides every length and sign problem (see `ref-ai-default-tells.md`).
- All-positive, all-rising demo series. Real dashboards spend half their life showing declines.
- Testing empties by deleting rows by hand in the browser's dev tools.
- `text-overflow: ellipsis` with no way to read the full name.
- Auto-shrinking font size so a long value fits a card.
- Formatting `null` as `0` or `NaN` as `NaN%`.
- A single colour palette that silently repeats after 8 series.
- One failed request blanking the whole page.

## Good references
- [W3C i18n: Text size in translation](https://www.w3.org/International/articles/article-text-size) — IBM's expansion table: strings up to 10 characters grow 200–300% in translation, over 70 characters about 130%. Short labels need the most room.
- [W3C i18n: Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/) — when the direction of inserted text is unknown, use `dir="auto"` or `<bdi>`, which isolate it from surrounding text.
- [Big List of Naughty Strings](https://github.com/minimaxir/big-list-of-naughty-strings) (MIT) — a maintained corpus of strings that break input handling: zero-width characters, RTL overrides, emoji, very long tokens. Use a subset for entity-name fields.
- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) — `notation: "compact"`, `signDisplay: "exceptZero"` and `currencySign: "accounting"` handle most magnitude and sign cases in one place.
- [NN/g: Designing empty states in complex applications](https://www.nngroup.com/articles/empty-state-interface-design/) — a "No records" message that shows on load and is then replaced by data erodes trust. Test the empty case and the loading case together.

## Bad references
- [shadcn/ui dashboard-01 demo data](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4/blocks/dashboard-01) (see `data-kpi-stat-card.md`) — every value is short, positive and in one currency. Teams copy the layout and only discover truncation and sign bugs in production.
- [NN/g: Designing empty states](https://www.nngroup.com/articles/empty-state-interface-design/) — documents an ERP alerts panel that stays completely blank with zero alerts, giving no status and no next step.

## Accessibility
- Truncated text must keep the full value in the accessible name. `title` alone is not reachable by keyboard or touch, so pair it with a focusable cell or a details view.
- `<bdi>` and `dir="auto"` also fix screen-reader order for mixed-direction names.
- Check that the 1,284-row table is still usable by keyboard (virtualisation keeps focus and row count; see `data-table-interaction.md`).
- Check that "Other (n)" groups and capped series are explained in the chart's text alternative.

## Motion / interaction (if relevant)
- Under the slow-endpoint case (12 s), loaders must follow `prog-loading-states.md`: delayed show, then a "Still working" message and Cancel after about 10 s.
- Toggling the fixture must not animate the whole page; swap the data in place.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Name max (stress) | schema limit, else 80 chars | Entity name fixture |
| Label expansion | ×3 for ≤ 10 chars, ×1.3 for > 70 | Button, tab and header width checks |
| Magnitudes | 1e-6, 0, 1e12, −1e9 | Number column fixture |
| Row counts | 0, 1, page + 1, 1,284 | Table fixture |
| Series count | palette size + 1 (9) and 20 | Legend and colour fixture |
| Stale age | 72 h | Freshness fixture |
| Slow endpoint | 12,000 ms | Loader fixture |
| Capture widths | 1440px and 390px | Screenshots |

## Implementation sketch
A typed fixture applied at the data boundary. The loader returns real data unless the dev-only flag is set.
```ts
import { z } from 'zod'

const Holding = z.object({
  id: z.string(),
  name: z.string().max(120),
  ticker: z.string().max(12),
  currency: z.enum(['USD', 'JPY', 'BHD', 'EUR']),
  value: z.number().nullable(),       // null = no data, never 0
  changePct: z.number().nullable(),   // fraction: 0.12 = +12%
  asOf: z.string(),                   // ISO 8601 with offset
})
type Holding = z.infer<typeof Holding>

type Fixture = 'real' | 'worst'

const NAMES = [
  'Compagnie Financière Richemont SA, Registered Shares Series A',
  'בנק לאומי לישראל בע"מ',          // RTL name
  '株式会社三菱UFJフィナンシャル・グループ', // CJK name
  'X',
]

export function worstCaseHoldings(count: number): Holding[] {
  const values: Array<number | null> = [1e12, 1e-6, 0, -1e9, null, 999_950]
  const ccys: Holding['currency'][] = ['USD', 'JPY', 'BHD', 'EUR']
  return Array.from({ length: count }, (_, i): Holding => ({
    id: `h${i}`,
    name: NAMES[i % NAMES.length] ?? 'X',
    ticker: i % 7 === 0 ? 'BRK.B' : `T${i}`,
    currency: ccys[i % ccys.length] ?? 'USD',
    value: values[i % values.length] ?? null,
    changePct: i % 5 === 0 ? null : (i % 2 === 0 ? -1 : 1) * (i / 100),
    asOf: new Date(Date.now() - 72 * 3_600_000).toISOString(), // stale
  }))
}

export async function loadHoldings(fixture: Fixture, fetcher: () => Promise<unknown>): Promise<Holding[]> {
  if (fixture === 'worst' && import.meta.env?.DEV) return worstCaseHoldings(1284)
  return z.array(Holding).parse(await fetcher())
}

declare global {
  interface ImportMeta { env?: { DEV?: boolean } }
}
```
```css
/* Fixes that belong in shared components, not one view */
.entity-name {
  unicode-bidi: isolate;          /* same effect as <bdi> when markup can't change */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
}
td.num { font-variant-numeric: tabular-nums; text-align: end; white-space: nowrap; }
```

## Checklist
- [ ] The stress set is applied at the data boundary, behind a dev-only toggle or query parameter.
- [ ] Every axis in the catalogue was tried on every region, and breaks were listed before fixing.
- [ ] Long names truncate or clamp with the full value still readable by pointer, keyboard and screen reader.
- [ ] RTL and CJK names render in the right order next to numbers (`<bdi>` or `dir="auto"`).
- [ ] `null`, `0`, "pending" and "not applicable" render differently; no `NaN` or `undefined` reaches the screen.
- [ ] 0, 1 and 1,284 rows and 9+ series all have a designed state.
- [ ] One failed or slow endpoint degrades only its own region.
- [ ] Screenshots exist at 1440px and 390px in both themes under the worst-case set.

## Sources
- https://www.w3.org/International/articles/article-text-size
- https://www.w3.org/International/articles/inline-bidi-markup/
- https://github.com/minimaxir/big-list-of-naughty-strings
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
- https://www.nngroup.com/articles/empty-state-interface-design/
- Dogfood review of a valuation product (2026-11-21): a silent fallback to flat lines when one endpoint was aborted, and no message on a 500 from another, were both found only by fault injection.
- Idea credit (not copied): "worst-case data at the data boundary, report before fixing" appears in community agent skills (Emil Kowalski's break-ui, Raphael Salaja's stress); facts here are from the primary sources above.
