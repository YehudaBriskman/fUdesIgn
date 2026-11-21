# Number and money formatting

> Format every number through one locale-aware `Intl.NumberFormat` layer: show only the precision the decision needs, keep precision the same within a column or a row of cards, use a true minus sign, and keep the exact value one hover away.

**Category:** Data display · **Applies to:** KPI cards, table cells, tooltips, axis labels, totals, exports · **Priority:** must

## When to use / when not
- Use for every user-facing number: money, counts, ratios, rates, durations, units.
- Use **compact notation** (`1.2M`) for glanceable surfaces: KPI cards, axis ticks, chart labels, narrow cells.
- Use **full precision** (`$1,234,567.89`) where people reconcile or act on the exact figure: ledgers, invoices, transaction rows, totals that must add up, export files, detail drawers.
- Do not format inside the data layer. Keep raw numbers (or integer minor units for money) in state, and format at render time. Sort and compute on the raw values. See `ui-behaviors/sortable-table.md`: "Read the raw value from a `data-value` attribute ... when the displayed text is formatted, for example `12,104` or `$1.2k`."

## Rules (do)
- **One formatter module.** Build formatters with `Intl.NumberFormat` and cache them per `(locale, options)`. Constructing one per cell is slow in big tables.
- **Locale comes from the user, currency comes from the data.** Never infer the currency from the locale. A Canadian user viewing USD sees `US$5.00` in `en-CA` and `$5.00` in `en-US`. That disambiguation is correct and you get it for free.
- **Money precision:**
  - Tables, ledgers and totals: the currency's minor units (`USD` → 2, `JPY` → 0, `BHD` → 3). `Intl` already defaults to ISO 4217 minor units, so don't hard-code `2`.
  - KPI headline: 0 decimals at or above 1,000 in the currency unit, or compact with 3 significant digits (`$1.23M`).
  - Never mix `$1,250` and `$1,250.00` in the same column.
- **Compact notation:** `notation: "compact"` plus `maximumSignificantDigits: 3` (money) or `maximumFractionDigits: 1` (counts). Verified outputs (Node 26.12, en-US): `1234 → 1.2K`, `999999 → 1M`, `1234567 → $1.23M`, `987654321 → $988M`. Compact output depends on the locale. For 12,500,000, `en-IN` gives `1.3Cr` and `ja-JP` gives `1250万`. `de-DE` doesn't abbreviate thousands at all (`12345 → 12.345`) and writes millions as `1,2 Mio.` Let the locale decide; don't hand-roll `K/M/B`.
- **Precision is a property of the metric, not of the value.** Decide decimals per metric (for example "conversion rate: 1 decimal") and keep that across every row and card. Matthew Ström: "keep the same number of significant figures" in a column, and "the fewer sig figs you can get by with, the better."
- **Negatives:**
  - Use U+2212 MINUS SIGN (`−`), not U+002D hyphen-minus. The true minus matches the width of `+` and the digits, and sits at the right height. GOV.UK: "Use a minus sign for negative numbers: –6."
  - `Intl` emits a hyphen-minus for `en-US` (`-1,234.5`) but U+2212 for `sv-SE` and `fi` (`−1 234,5`). Normalise it with `formatToParts`, replacing the `minusSign` part.
  - Accounting contexts (P&L, statements, ledgers) may use parentheses via `currencySign: "accounting"` → `($1,234.50)`. Pick one convention per product, not per screen.
  - Colour is never the only negative signal. The sign or the parentheses must be in the text.
- **Positive sign only where change is meant.** Use `signDisplay: "exceptZero"` for deltas (`+12.3%`, `0%`, `−4.1%`). Don't use it for levels: a balance of `+$500` reads like a change. `exceptZero` also suppresses `−0%` after rounding (verified: `-0.0004` → `0%`).
- **No negative zero.** The default `signDisplay: "auto"` keeps it: `-0.0004` with 1 fraction digit formats as `-0` (verified). Use `signDisplay: "negative"` or `"exceptZero"`, both of which drop the sign on zero.
- **Tabular, lining figures everywhere numbers stack or update:** `font-variant-numeric: tabular-nums lining-nums`. shadcn's dashboard KPI title ships `tabular-nums`. If the brand font lacks `tnum`, switch numbers to a font that has it (Inter, IBM Plex Sans, SF, Work Sans). Don't fall back to monospace for whole tables.
- **Leading zero:** `0.5`, never `.5` (GOV.UK).
- **Exact value on demand.** Compact or rounded values get the full value in a tooltip, `title`, or detail view, and in exports. SaaSframe's metrics pattern says "A shortened value should not imply exactness."
- **Missing is not zero.** `null` renders as an explicit "no data" token (see `data-loading-empty-error-states.md`), never `0` or `$0.00`.

## Anti-patterns (don't)
- `toFixed(2)` plus string concatenation of `$`. This breaks every non-US locale and every non-2-decimal currency.
- Hand-rolled `K/M/B` thresholds that turn `999,950` into `1000.0K`. Intl rounds correctly to `1M`.
- Multiplier text instead of formats ("Revenue (in thousands)" above `1,234`). Datawrapper: "There's no need to use multipliers ... consider using number formats like 20b, 20m, or 20k."
- False precision on glance surfaces, such as `Conversion 3.14159%`. Few's pitfall #3 is "Displaying excessive detail or precision" ([white paper](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)).
- Truncating instead of rounding (`Math.floor` for display). Use the default `roundingMode: "halfExpand"`. For finance, use `"halfEven"` if the ledger uses banker's rounding, and match the backend.
- Abbreviating with a bare `m` in prose and accessible names. GOV.UK: "Do not abbreviate million to m." data.europa.eu says the prefix "can be misinterpreted by screen readers" and that the FT stopped using it (it cites only a tweet). In French, `m` and `M` are ambiguous (`fr-FR` compact gives `1,2 M`). Compact output in visible UI is fine, but give the accessible name the long form (`compactDisplay: "long"` → "1.2 million", verified).
- Parsing numbers back out of formatted strings, especially after a U+2212 swap, which breaks `Number()`.

## Good references
- [MDN: Intl.NumberFormat() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) — the full option set (`notation`, `signDisplay`, `currencySign: "accounting"`, `roundingMode`, `trailingZeroDisplay: "stripIfInteger"`). It covers 95% of dashboard formatting needs.
- [Matthew Ström, "Design better data tables"](https://mattstromawn.com/writing/tables) — tabular lining figures, the same significant figures per column, as few as you can get by with.
- [data.europa.eu: Number formatting](https://data.europa.eu/apps/data-visualisation-guide/number-formatting) — "in China and Japan, large numbers are read with groups of 10.000", the ambiguous `M` prefix in French, and the screen-reader reason for dropping "m".
- [GOV.UK A–Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/) — "Do not use decimals unless pence are included: £75.50 but not £75.00", a minus sign for negatives, a leading zero ("0.5 not .5"), and "Do not abbreviate million to m."
- [shadcn/ui dashboard-01 `section-cards.tsx`](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx) — `tabular-nums` on KPI values by default.

## Bad references
- shadcn dashboard-01 sample data ([source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx)) — the `-20%` badge uses an ASCII hyphen, and `Total Revenue $1,250.00` shows cents on a headline KPI. Both get copied into real products verbatim.
- Grafana stat panel ["No value" default](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/) — "The default value is a hyphen (-)", which looks like a minus sign on a numeric tile. Override it with a muted em dash and hidden "No data".
- Few, ["Common Pitfalls in Dashboard Design"](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf), pitfall #3 — precision that forces viewers to filter digits slows comprehension.

## Accessibility
- The accessible name should carry the unabbreviated value or long compact form: visible `$1.2M`, accessible "1.2 million US dollars". Use `aria-label` on the `<data>` wrapper or a visually hidden span.
- Use `<data value="1234567.89">` so the machine value travels with the formatted text.
- Don't assume every screen reader voices U+2212 as "minus": test with the readers your users run, or put the signed value in words in the accessible name. Parentheses for accounting negatives are not announced as negative, so add visually hidden text "negative" or `aria-label`.
- Never rely on red alone for negatives (WCAG 1.4.1).

## Motion / interaction (if relevant)
- Animated count-ups are covered in `motion-number-tweening.md`. Tabular figures are mandatory there, or the width jitters.
- On hover or focus, show the exact value in a tooltip after about 300 ms. It must also be reachable by keyboard focus.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--num-font-features` | `"tnum" 1, "lnum" 1` | Or `font-variant-numeric: tabular-nums lining-nums` |
| Money, table | currency minor units | `minimumFractionDigits` = `maximumFractionDigits` = ISO 4217 |
| Money, KPI compact | `maximumSignificantDigits: 3` | `$1.23M`, `$988M` |
| Count, compact | `maximumFractionDigits: 1` | `15.5K` |
| Percent, rate | 1 decimal below 10%, 0 at or above 10% (pick per metric, keep consistent) | `3.4%`, `42%` |
| Delta sign | `signDisplay: "exceptZero"` | `+2.1%`, `0%`, `−0.4%` |
| Negative glyph | U+2212 `−` | Swap via `formatToParts` |
| Missing value | muted `—` (U+2014) plus visually hidden "No data" | Never `0` (SKILL.md non-negotiable) |
| Rounding | `halfExpand` (UI), match backend for money | |

## Implementation sketch
```ts
type FormatKind = "money" | "moneyCompact" | "count" | "countCompact" | "percent" | "delta";

const cache = new Map<string, Intl.NumberFormat>();
const MINUS = "−";

function getFormatter(locale: string, opts: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(opts)}`;
  let f = cache.get(key);
  if (!f) { f = new Intl.NumberFormat(locale, opts); cache.set(key, f); }
  return f;
}

const presets = (currency: string): Record<FormatKind, Intl.NumberFormatOptions> => ({
  money:        { style: "currency", currency },
  moneyCompact: { style: "currency", currency, notation: "compact", maximumSignificantDigits: 3 },
  count:        { maximumFractionDigits: 0 },
  countCompact: { notation: "compact", maximumFractionDigits: 1 },
  percent:      { style: "percent", maximumFractionDigits: 1 },
  delta:        { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" },
});

export function formatNumber(
  value: number | null,
  kind: FormatKind,
  { locale, currency = "USD" }: { locale: string; currency?: string },
): string | null {
  if (value === null || Number.isNaN(value)) return null; // caller renders the "no data" state
  const parts = getFormatter(locale, presets(currency)[kind]).formatToParts(value);
  return parts.map((p) => (p.type === "minusSign" ? MINUS : p.value)).join("");
}
```
```html
<td class="num">
  <data value="-1234.5" title="−$1,234.50">−$1.23K</data>
</td>
```
```css
.num, .kpi-value, [data-numeric] {
  font-variant-numeric: tabular-nums lining-nums;
  text-align: end;
  white-space: nowrap;
}
```

## Checklist
- [ ] Every number goes through the shared formatter. No `toFixed` and no string-concatenated `$` in UI code.
- [ ] Currency comes from the data record, and locale from user settings.
- [ ] Decimals are consistent within each column and across sibling KPI cards.
- [ ] Negatives use U+2212 (or accounting parentheses, product-wide), and never colour alone.
- [ ] No `−0`, `−0.0%` or `+0%` appears after rounding.
- [ ] Compact values expose the exact value (tooltip or detail) and a long-form accessible name.
- [ ] `tabular-nums` is applied to tables, KPI values and anything that live-updates.
- [ ] `null` renders as an explicit no-data state, not `0`.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
- https://mattstromawn.com/writing/tables
- https://alistapart.com/article/web-typography-tables/
- https://data.europa.eu/apps/data-visualisation-guide/number-formatting
- https://data.europa.eu/apps/data-visualisation-guide/table-design-scannability
- https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
- https://www.datawrapper.de/blog/text-in-data-visualizations
- https://www.saasframe.io/patterns/metrics
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/sortable-table.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/visual-design/typography.md
- Local verification: Node v26.12 `Intl.NumberFormat` outputs quoted above (en-US, en-CA, sv-SE, fi, de-DE, fr-FR, en-IN, ja-JP).
