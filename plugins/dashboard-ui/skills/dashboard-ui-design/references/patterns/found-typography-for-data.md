# Typography for data

> Set every number in tabular lining figures, right-align numeric columns with their headers, use a short type scale, and cap prose at about 65 characters per line.

**Category:** Foundations · **Applies to:** KPI tiles, tables, axis and tooltip labels, financial statements, prose annotations · **Priority:** must

## When to use / when not
- **Use tabular lining figures** anywhere numbers are compared vertically or update live: tables, KPI values, tickers, timers, axis labels, tooltips. Otherwise a value like 1,111 is narrower than 8,888 and columns jitter.
- **Use proportional figures** in running prose, where tabular digits look gappy (Datawrapper).
- **Use monospace** only for IDs, hashes, code and logs, or as the fallback when the brand font lacks tabular figures (Ström).
- **Not** about choosing a "data font" for headings. Headings follow the brand. Numbers follow these rules.

## Rules (do)
- **Apply `font-variant-numeric: tabular-nums lining-nums`** to tables, KPIs and chart text. Old-style figures are "hard to read in a table, tooltip, or as an axis tick" (Datawrapper).
- **Verify the font actually has `tnum`.** Many fonts silently ignore it. Datawrapper lists Roboto, Lato, Open Sans, Source Sans Pro and Noto Sans as having tabular lining figures; Ström names Work Sans and San Francisco. Inter (the `tokens.css` default) also ships `tnum`. Test by stacking "1111" over "8888".
- **Alignment:**
  - numbers right
  - text left
  - headers aligned like their column
  - never center (Ström)
  - Decimal alignment (`text-align: "."`) isn't supported in browsers, so use fixed decimals per column instead.
- **Use consistent precision within a column** (same decimals). Show the unit once, in the header or first row only (Ström: "only include it with the first data point").
- **Show negatives with a true minus "−" (U+2212) or parentheses** for accounting, never color alone. Put the sign before the currency symbol: "−$1,200".
- **Format with `Intl.NumberFormat` per locale.** Never hand-roll separators.
- **Type scale: 6 steps** for a dashboard: 12, 14, 16, 20, 30, 32px. Use rem units, with no px font sizes (modern-web-guidance `visual-design/typography.md`). The Carbon data table uses 14px/400 body, 14px/600 column headers and a 20px/400 table title. The scale maps to `--type-meta` 12, `--type-body` 14, `--type-heading` 16, `--type-title` 20, `--type-kpi` 30 (KPI values in cards) and `--type-hero` 32px (the primary KPI).
- **Use a minimum of 12px** for any data text, including axis ticks (Datawrapper: "everything below 12px will likely be too small"). 14px is the default for tables and body, and Datawrapper's default annotation size.
- **Line height:** unitless. 1.1–1.2 for hero numbers, 1.4–1.5 for body, 1.3 for single-line labels.
- **Line length:** prose annotations, descriptions and empty-state copy cap at `max-inline-size: 65ch`. Butterick: 45–90 characters; modern-web-guidance: ≤ 80.
- **Wrapping:** `text-wrap: balance` on widget titles and `<th>`; `text-wrap: pretty` on descriptions. Never apply either to `*`.
- **Weight for emphasis, not caps.** Use 600 for values and titles and 400 for labels. Uppercase only for very short labels (Datawrapper: "limit it to just a few words"), with +0.04em tracking.
- **Fluid sizes only with `clamp()` in rem,** with the max ≤ 2.5× the min, so 200% zoom still works (WCAG 1.4.4; modern-web-guidance).

## Anti-patterns (don't)
- **Proportional digits in tables or live counters.** Columns don't line up, and values "dance" on each update.
- **Centered numeric columns.** They create ragged edges and make magnitude comparison slow.
- **Mixed precision in a column:** 12.5, 3, 7.125.
- **Unit repeated on every cell:** "$" and "ms" 400 times.
- **Thin weights (100–300) for numbers** on dashboards, which have low contrast at small sizes (Datawrapper: avoid thin fonts unless big and high contrast).
- **Fixed `height` on text containers.** It breaks under WCAG 1.4.12 text-spacing overrides.
- **Truncating numbers with an ellipsis.** "$1,284,0…" is worse than "$1.28M". Abbreviate instead and give the exact value in a tooltip or title.

## Good references
- [MDN: font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric): `tabular-nums` (`tnum`), `lining-nums` (`lnum`), `slashed-zero` (`zero`, for IDs where O/0 confusion matters). Baseline widely available since January 2020.
- [Datawrapper: Which fonts to use for your charts and tables](https://www.datawrapper.de/blog/fonts-for-data-visualization): lining plus tabular for viz, 12px practical floor (14px default annotation), avoid thin and condensed faces, and bold only for titles or a few words.
- [Matthew Ström: Design better data tables](https://mattstromawn.com/writing/tables/): the alignment trinity (numbers right, text left, headers match), consistent significant figures, units once, monochrome tables, monospace as fallback.
- [IBM Carbon: Data table style](https://carbondesignsystem.com/components/data-table/style/): 14px body text at every row height (24–64px), 14px/600 column headers, a 20px/400 title and at least 16px between columns.
- [GOV.UK Design System: Type scale](https://design-system.service.gov.uk/styles/type-scale/): a seven-point responsive scale (80/48/36/27/24/19/16) whose large points shrink on small screens (80→53, 48→32, 36→27). `@include govuk-font($size: 19, $tabular: true)` is a design-system-level switch for tabular numbers.
- [Vercel Geist typography](https://vercel.com/geist/typography): size-named classes (`text-label-14`, `text-copy-13`) plus paired mono variants (`text-label-13-mono` pairs with Label 14). Mono is paired one step smaller to match optical size.

## Bad references
- [Few, Common Pitfalls, Pitfall #3](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): "$3,848,305.93 rather than $3,848,306 or perhaps even $3.8M". Precision the decision doesn't need slows reading.
- [Few, Common Pitfalls, Fig. 4](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): measures with four to ten decimal digits and timestamps to the second on a monitoring dashboard.

## Accessibility
- Text contrast is ≥ 4.5:1 for numbers and labels, and ≥ 3:1 only for ≥ 24px regular or ≥ 18.66px bold.
- Abbreviated numbers ("$1.28M") need a full value for assistive tech and on hover: `<data value>` plus a `title`, or visually hidden text.
- Don't convey negatives by red alone. Include the minus sign or parentheses, and an arrow for deltas.
- Use rem sizes so user font preferences apply. Test at 200% zoom with no clipping (WCAG 1.4.4).
- Set `lang` on `<html>` so `hyphens` and locale-aware screen-reader number reading work.

## Motion / interaction (if relevant)
- Live-updating numbers: tabular figures prevent horizontal jitter. Avoid "counting up" animations on load; they delay reading the real value. If used, keep them ≤ 400ms (`--motion-dur-long`) and skip them under reduced motion.

## Tokens and values
| Token | Size / line-height / weight | Use |
|---|---|---|
| `--type-hero` | 2rem / 1.1 / 600 | Primary KPI value |
| `--type-kpi` | 1.875rem (30px) / 1.2 / 600 | Secondary KPI value in cards |
| `--type-title` | 1.25rem / 1.3 / 600 | Page or table title |
| `--type-heading` | 1rem / 1.4 / 600 | Widget title |
| `--type-body` | 0.875rem / 1.45 / 400 | Table cells, body |
| `--type-meta` | 0.75rem / 1.35 / 400 | Axis ticks, captions, timestamps |
| `--measure` | 65ch | Prose max width |
| `--num` | `tabular-nums lining-nums` | All numeric contexts |
| Font stack | `Inter, "SF Pro Text", Roboto, system-ui, sans-serif` | Verify `tnum` |
| Mono stack | `"JetBrains Mono", "SF Mono", ui-monospace, monospace` | IDs, code, logs |

## Implementation sketch
```css
:root { font-family: Inter, "SF Pro Text", Roboto, system-ui, sans-serif; line-height: 1.45; }
table, .kpi-value, .axis text, .tooltip, time { font-variant-numeric: tabular-nums lining-nums; }

th, td { text-align: start; }
:is(th, td).num { text-align: end; }           /* header and cells share the class */
th { text-wrap: balance; font-weight: 600; font-size: .875rem; }
.description, .empty-state p { max-inline-size: 65ch; text-wrap: pretty; }
.id, code { font-family: ui-monospace, monospace; font-variant-numeric: slashed-zero; }
.kpi-value { font-size: clamp(1.875rem, 1.5rem + 1.2cqi, 2.25rem); } /* 30–36px; max ≤ 2.5× min */
```
```ts
const money = (locale: string, currency: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
                                  currencySign: "accounting" }); // (1,200.00) for negatives where locale supports it

const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" });
pct.format(-0.0412); // "-4.1%" in en (hyphen-minus); swap to U+2212 "−" in display if your type system wants a true minus
const trueMinus = (s: string): string => s.replace(/^-/, "−");
```

## Checklist
- [ ] "1111" vs "8888" renders the same width in tables and KPIs (the font has `tnum`).
- [ ] Numeric columns and their headers are right-aligned, text left, nothing centered.
- [ ] Each column uses one precision, and the unit appears once.
- [ ] No data text is below 12px; table body is 14px; all sizes are in rem.
- [ ] Prose blocks are ≤ 65ch.
- [ ] Negative values use a minus or parentheses, not color only.
- [ ] Abbreviated values expose the exact value on hover and to assistive tech.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
- https://www.datawrapper.de/blog/fonts-for-data-visualization
- https://mattstromawn.com/writing/tables/
- https://carbondesignsystem.com/components/data-table/style/
- https://design-system.service.gov.uk/styles/type-scale/
- https://vercel.com/geist/typography
- https://practicaltypography.com/line-length.html
- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- modern-web-guidance/skills/modern-web-guidance/guides/visual-design/typography.md
- modern-web-guidance/skills/modern-web-guidance/guides/visual-design/improve-text-layout-and-legibility.md
- modern-web-guidance/skills/modern-web-guidance/guides/visual-design/precise-text-alignment.md
- modern-web-guidance/skills/modern-web-guidance/guides/css/responsive-design.md
