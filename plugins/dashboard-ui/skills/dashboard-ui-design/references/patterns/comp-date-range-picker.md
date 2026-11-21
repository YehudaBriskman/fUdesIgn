# Date-range picker with presets and comparison periods

> Lead with presets (they make the common case one click), always show the resolved absolute dates and timezone, allow typed entry, and make the comparison period explicit, length-matched and visible on every widget it affects.

**Category:** Components and interaction · **Applies to:** global dashboard time range, chart zoom, report periods, KPI deltas ("vs previous period"), fiscal periods · **Priority:** must

## When to use / when not
- Use a **range picker with presets** for any time-series dashboard. It's the most-used control on analytics and finance screens.
- Use **only a preset select** (no calendar) when ranges are always standard, e.g. a valuation tool that only offers LTM / FY / quarterly. Stripe's dashboard home keeps its presets short for this reason.
- Use a **relative-expression input** (Grafana `now-6h`, `now/d`) for monitoring and ops tools whose users are engineers. Don't expose that syntax to finance or business users.
- Don't use a calendar for distant dates (> ~1 year away). Typing is faster (NN/g). For relative times ("now", "in one hour", "tonight") use a select, not a picker (Carbon).

## Rules (do)
- **Trigger button shows the resolved range**, e.g. `Last 90 days · Aug 23 – Nov 20, 2026`. The preset name alone isn't enough. CloudZero changed its presets so "Each one now shows the exact dates it covers."
- **Preset list (left column, 6–10 items)**, grouped:
  - *To date:* Today, Week to date, Month to date, Quarter to date, Year to date.
  - *Rolling:* Last 7 days, Last 30 days, Last 90 days, Last 12 months.
  - *Calendar:* Last month, Last quarter, Last year (or fiscal equivalents).
  - Plus *Custom…* and, where useful, *All time*.
  - Order by frequency of use. Show recently used custom ranges (Grafana lists recently used absolute ranges).
- **Definitions are explicit.**
  - "Last 7 days" either includes today, and says so with an "Include today" toggle as in Looker Studio, or ends yesterday. Pick one convention for the whole product.
  - The week start (Mon or Sun) is a setting, and the default is locale-based.
  - Fiscal year start is configurable for finance products.
  - The end date is *inclusive* in labels.
- **Calendar.**
  - Desktop shows two months side by side; mobile shows one.
  - The range is highlighted as a continuous band, with start and end visually distinct.
  - Mark today.
  - Disable impossible dates, such as the future for actuals or before the data starts, but keep them visible.
  - **Don't shift the months after the start date is picked** (NN/g: users click the wrong date when the view jumps).
- **Typed entry always available** (Carbon: there "should always be a simple way to enter dates in a text field"; NN/g): two text fields `Start` / `End` above the calendar.
  - Accept `-`, `/`, `.` and spaces as separators, and ignore leading zeros (NN/g).
  - Show the format as helper text, never as a placeholder only (Carbon: placeholder text "will disappear from view once the user begins typing").
  - Validate on blur.
- **Apply model.**
  - Presets apply on click and close the popover.
  - Custom calendar ranges need an explicit **Apply**, because picking a start date must not fire an expensive query with a half-range.
  - Esc cancels and restores the previous range.
- **Timezone.** Show it ("All times in America/New_York") in the popover footer and in exported reports. Ranges resolve to day boundaries in that zone. Let users switch between account timezone and UTC where data is global.
- **Comparison period ("Compare to")**
  - It's an explicit toggle (GA4's "Compare" control), off by default unless the dashboard is fundamentally about change.
  - Options:
    - **Previous period:** the same length, immediately before.
    - **Same period last year:** YoY. Offer *day-of-week aligned* (52 weeks back) as an option for weekly-seasonal data; Looker Studio's "Advanced" offsets support day-of-week alignment (Monday matches Monday).
    - **Custom.**
  - **Length matching.** The comparison is always length-matched to the primary range. When the primary range changes, recompute a relative comparison automatically. If a custom comparison no longer matches in length, warn ("Comparison is 30 days; selected range is 7 days").
  - Show the resolved comparison dates under the primary dates: `vs May 25 – Aug 22, 2026`.
  - Rendering (Looker Studio draws the comparison as a second line in another colour, and as a delta with an up/down indicator in tables):
    - On time series, make the comparison a secondary line in a muted or dashed style, *aligned by offset* (day 1 to day 1), with a legend that names both ranges.
    - On KPIs and tables, show a delta with a sign, an arrow and a percentage, e.g. "+12.4% vs prev. 90 days".
    - See `color-semantic-status.md` for delta colours.
- **Partial periods are flagged.**
  - "Quarter to date" compared with the full previous quarter is misleading. Default to *same elapsed days* in the previous quarter, or label it clearly.
  - Mark an incomplete current bucket (this week or month) on charts with a hatched or lighter final bar or dot.
- **Granularity follows range.** Suggest or adapt the bucket size (house defaults): ≤ 2 days → hourly, ≤ 90 days → daily, ≤ 2 years → weekly or monthly, longer → monthly or quarterly.
- **URL.** Write `?from=2026-08-23&to=2026-11-20&cmp=prev` or `?range=last_90d&cmp=yoy` with a relative key, so a shared link means "last 90 days" or "these exact dates" as intended. Grafana supports both relative and absolute `from`/`to`.
- **Keyboard (calendar grid).** Arrows move by day, PgUp/PgDn by month, Shift+PgUp/PgDn by year, Home/End to the start and end of the week. Enter selects the start, then the end. Esc closes.

## Anti-patterns (don't)
- A trigger that says only "Custom" or "Last quarter" with no dates. Users can't tell whether it's the calendar or fiscal quarter, or whether today is included.
- Firing queries on the start-date click of a custom range.
- Comparisons of different lengths (7 days vs 30 days) left silently in place after the user changes the main range. An Adobe Analytics community post warns "the comparison will most likely fail (even with relative date ranges)".
- Comparing a partial current period with a full previous one without a label, which always shows a scary decline.
- A calendar-only picker with no typed entry, or month/day/year dropdown triples (NN/g).
- Placeholder-only date format hints that vanish when typing starts (Carbon).
- Timezone unspecified, so a daily revenue number differs between the dashboard and the CSV export.
- Each widget carrying its own hidden date range that silently overrides the global one. If widget overrides exist (in Adriel, "the dashboard date range is completely ignored for that widget"), show them on the widget.

## Good references
- [Google Looker Studio — date ranges](https://docs.cloud.google.com/looker/docs/studio/set-report-date-ranges) — clear comparison taxonomy (previous period, previous year, fixed, advanced offsets with day-of-week alignment), an explicit "Include today" checkbox on rolling ranges, and how comparisons render in time series and tables.
- [Grafana — time range picker](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/) — quick ranges, a filterable list, recently used ranges, relative syntax for power users, `from`/`to`/`timezone` URL params, and `t-`/`t+` zoom shortcuts.
- [Date Range Picker UX — Square, Stripe & GA compared](https://mfsbo.github.io/mfsbo/posts/2025-09-27-date-range-picker-patterns-square-stripe-google-analytics.html) — an opinion piece (Laws of UX applied to screenshots, no usage data): Stripe's tiered presets aim to keep sessions single-click, and GA's explicit "Compare to" toggle supports benchmarking.
- [Carbon — Date picker](https://carbondesignsystem.com/components/date-picker/usage/) — always offer typed entry, format as helper text not placeholder, set min/max, and the range keyboard flow (Arrows + Enter for the start, Arrows + Enter for the end).

## Bad references
- [Adobe Analytics community — "Fully dynamic Compare date range"](https://experienceleaguecommunities.adobe.com/adobe-analytics-3/fully-dynamic-compare-date-range-2873) — users report that changing the main range leaves a fixed-length comparison mismatched. It's a real-world failure of length matching.
- [NN/g — Date input](https://www.nngroup.com/articles/date-input/) — Priceline rejecting "9-3-17" without guidance, and split month/day/year dropdowns that add clicks.
- Dashboards whose KPI tiles show "▲ 23%" without stating the comparison period. The number is uninterpretable, since it could be vs yesterday, last month or last year.

## Accessibility
- Make the trigger a button with `aria-haspopup="dialog"` and `aria-expanded`. Its accessible name includes the resolved dates.
- Give the popover a name and use `role="dialog"` semantics: `<dialog popover>` or `<div popover role="dialog">`. Present presets as a list of buttons or a radio group.
- Support: `popover` is Baseline. Anchoring the popover to its trigger needs CSS anchor positioning (Baseline newly available since January 2026), so gate it in `@supports` as in `comp-overlay-choice.md`. `Temporal` is not Baseline (Chrome/Edge 144, Firefox 139, no Safari); load a polyfill or use a date library there.
- The calendar is a `role="grid"` with one tab stop and arrow navigation. Each day has a full accessible name ("Tuesday, November 18, 2026"), plus `aria-selected` for the range ends and `aria-disabled` for impossible dates.
- Typed inputs have visible labels, `inputmode="numeric"` or a type, and error text linked via `aria-describedby`.
- When applied, announce politely: "Showing Aug 23 – Nov 20, 2026, compared with May 25 – Aug 22."

## Motion / interaction (if relevant)
- The popover opens in `--motion-dur-short` (150 ms) with opacity and translate. Month paging is instant or a 150 ms slide (none under reduced motion).
- After apply, charts transition their data at ≤300 ms (see `motion-number-tweening.md`). Don't animate both the axis rescale and the data for long.

## Tokens and values
| Token | Default |
|---|---|
| Popover width | ~640px (presets 180px + 2 months × ~224px); single month below 640px viewport |
| Day cell | 32×32px desktop, 44×44 touch (≥24×24 minimum) |
| Range band | `color-mix(in oklab, var(--accent) 15%, var(--surface))`; ends `--accent` with `--surface` text |
| Today marker | 1px ring or dot, not colour-fill only |
| Presets | 6–10 visible; recent customs ≤3 |
| Comparison line | same hue at 50% opacity or dashed 4/3; legend names both ranges |
| Week start | locale default; configurable |
| Apply latency | presets instant; custom ranges need Apply |

## Implementation sketch
```html
<button type="button" class="btn btn--sm" popovertarget="range" aria-haspopup="dialog">
  Last 90 days · <time datetime="2026-08-23">Aug 23</time> – <time datetime="2026-11-20">Nov 20, 2026</time>
</button>
<div id="range" popover role="dialog" aria-label="Date range" class="anchored range-popover">
  <ul class="presets" aria-label="Presets">
    <li><button type="button" data-range="last_7d">Last 7 days</button></li>
    <li><button type="button" data-range="last_90d" aria-pressed="true">Last 90 days</button></li>
    <li><button type="button" data-range="qtd">Quarter to date</button></li>
    <li><button type="button" data-range="ytd">Year to date</button></li>
  </ul>
  <div class="custom">
    <label>Start <input name="from" inputmode="numeric" aria-describedby="fmt"></label>
    <label>End <input name="to" inputmode="numeric" aria-describedby="fmt"></label>
    <span id="fmt" class="hint">YYYY-MM-DD</span>
    <!-- calendar grid(s) -->
    <label><input type="checkbox" name="cmp"> Compare to</label>
    <select name="cmp_mode"><option value="prev">Previous period</option><option value="yoy">Same period last year</option></select>
    <p class="cmp-resolved">vs May 25 – Aug 22, 2026</p>
    <p class="tz">Times in America/New_York</p>
    <button type="button" class="btn btn--primary">Apply</button>
  </div>
</div>
```
```ts
import type { Temporal } from 'temporal-spec'; // or the global Temporal where shipped, or a polyfill

type DateRange = { start: Temporal.PlainDate; end: Temporal.PlainDate }; // end inclusive
type CompareMode = 'prev' | 'yoy' | 'yoy_dow';

export function comparisonFor(r: DateRange, mode: CompareMode): DateRange {
  const days = r.start.until(r.end).days + 1;
  switch (mode) {
    case 'prev': { const end = r.start.subtract({ days: 1 }); return { start: end.subtract({ days: days - 1 }), end }; }
    case 'yoy': return { start: r.start.subtract({ years: 1 }), end: r.end.subtract({ years: 1 }) };
    case 'yoy_dow': return { start: r.start.subtract({ weeks: 52 }), end: r.end.subtract({ weeks: 52 }) }; // weekday-aligned
  }
}
```
(Use `Temporal` where available, or a date library. Never do day arithmetic on `Date` in local time across DST changes.)

## Checklist
- [ ] The trigger shows the preset name *and* the resolved absolute dates. The popover footer shows the timezone.
- [ ] Presets apply in one click. Custom ranges need an explicit Apply. Esc restores the previous range.
- [ ] Typed entry is available with a visible format hint and lenient parsing.
- [ ] Comparison is an explicit toggle, length-matched, with its resolved dates displayed, and recomputed when the range changes.
- [ ] Partial current periods are labelled or compared on the same elapsed days.
- [ ] The range and comparison round-trip via the URL (relative or absolute, as intended).
- [ ] The calendar grid is fully keyboard-operable with full date names for screen readers.

## Sources
- https://docs.cloud.google.com/looker/docs/studio/set-report-date-ranges
- https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/
- https://mfsbo.github.io/mfsbo/posts/2025-09-27-date-range-picker-patterns-square-stripe-google-analytics.html
- https://carbondesignsystem.com/components/date-picker/usage/
- https://www.nngroup.com/articles/date-input/
- https://www.cloudzero.com/blog/custom-date-comparisons/ (presets show exact dates; custom comparisons match the base period's length)
- https://experienceleaguecommunities.adobe.com/adobe-analytics-3/fully-dynamic-compare-date-range-2873
- https://docs.adriel.com/dashboards/filters-and-dates/date-ranges (widget period and comparison override the dashboard's)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using
