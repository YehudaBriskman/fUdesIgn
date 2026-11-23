# Deltas and trend indicators

> A change is shown as sign, then magnitude, then comparison basis, as text. Arrow and colour are redundant cues, and the colour encodes *desirability* per metric, not direction.

**Category:** Data display · **Applies to:** KPI cards, table delta columns, badges, tooltips, sparklines endpoints · **Priority:** must

## When to use / when not
- Use when the reader's question is "is this better or worse than before or than the target?"
- Don't show a delta without a stated baseline ("vs previous 30 days", "vs Q3 2026", "vs target"). If no comparable period exists (new account, first period, or a baseline of zero), show "No prior data", not `+∞%` or `+100%`.
- Don't colour deltas for metrics with no agreed good direction (for example "number of SKUs", "headcount"). Use neutral grey.
- Don't show a percent change when the baseline is tiny. Show the absolute change instead (see rules). Honest scaling of any bar or axis drawn beside a delta: `chart-honesty-chartjunk.md`.

## Rules (do)
- **Text first.** The delta string always includes an explicit sign: `+12.3%`, `−4.1%`, `0%`. Use `signDisplay: "exceptZero"` and a U+2212 minus (see `data-number-formatting.md`). The arrow and colour are additive.
- **Name the basis next to the number**, in the same card or column header: "+12.3% vs last month". SaaSframe: "Keep that basis visible rather than showing a red or green percentage beside the value with no explanation." Stripe's home shows the previous-period value in smaller text under each metric (per a 925studios teardown).
- **Encode desirability, not direction.** Every metric definition carries a `goodDirection: "up" | "down" | "neutral"`:
  - up is good: revenue, conversion, NPS, uptime;
  - down is good: churn, CAC, latency, error rate, cost, days sales outstanding;
  - neutral: inventory count, headcount, number of projects.
  Power BI's KPI visual has an explicit **Direction: High is good / Low is good** setting, and Grafana's stat panel has **Percent change color mode: Standard / Inverted / Same as value**. Treat this as a required field on the metric, not a styling option.
- **Arrow shows direction, colour shows desirability.** Latency up 20% gets an up-arrow in the negative (bad) colour. Never flip the arrow to mean "good".
- **Percent vs percentage points.** When the metric is itself a rate (conversion, margin, churn %), show the change in percentage points: `+0.3 pp`. A move from 1.8% to 2.1% is +0.3 pp but +16.7% relative to 1.8%. data.europa.eu's mask-study example uses the same two rates and reports the gap as 0.3 pp or a 14% relative effect (measured against 2.1%), so always say which baseline a relative change uses. Label it explicitly with `pp` (or "pts" in finance UIs) and the long form in the accessible name. If you show relative change on a rate, say so ("+16.7% relative").
- **Small-baseline guard.** If `|baseline| < threshold` (per metric, for example fewer than 20 events or under $100), show an absolute delta (`+3 orders`) instead of `+300%`. SaaSframe: "A small numerical change can create a large relative movement without representing a large operational effect."
- **Sign flips.** If the baseline is negative (a loss to a profit), percent change is meaningless. Show the absolute change (`+$42K`) and the state ("from loss to profit").
- **Partial periods.** Compare like-for-like elapsed time ("month to date vs same days last month") or label it as partial. SaaSframe: "A partial current day should not silently be compared with a full prior day."
- **Noise threshold.** Treat changes within ±0.5% (a house default, not a sourced number; better, the metric's normal variance) as flat: neutral colour, `→` or no arrow. SaaSframe: "A metric should not become alarming solely because it changed, especially when normal variation is expected."
- **Colour roles, not hues.** Use the `tokens.css` roles `--positive`, `--negative` and `--text-muted` (neutral), resolved by `goodDirection` times sign. For regions where red means up (China, Japan, Taiwan markets, per Benzinga), set `data-money="red-up"` on the root, which swaps the two roles. Robinhood ships an "Accessible colors" theme setting for red-green colour blindness; the `tokens.css` equivalent is `data-money="cvd"` (blue and orange).
- **Pick a CVD-safe pair.** Datawrapper: "Quite a few companies use blue for positive and red for negative instead to get around colorblindness issues." Also make the two colours differ in lightness (Datawrapper's general rule for categorical colours), so they survive greyscale and red-green CVD. Validate in a simulator (Sim Daltonism, Viz Palette).
- **Restraint.** If more than 30% of a screen is red or green, nothing stands out. Stripe's home keeps trend indicators monochrome and reserves colour for status (succeeded, failed, pending), per 925studios.

## Anti-patterns (don't)
- **Auto-green for every increase.** SaaSframe: "avoid assigning green to every increase automatically." The classic bug is a "Churn +12%" badge in green.
- **Colour as the only signal.** Red and green text with no sign, or an arrow with no text.
- **`+20%` with no basis.** Which period? What baseline? Few's pitfall #2 is "Supplying inadequate context for the data" ([white paper](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)).
- **Percent change of a percentage labelled `%`.** "Growth rate 4.5%, badge +4.5%" (shadcn dashboard-01 sample) is ambiguous between pp and relative.
- **Triangles plus colour plus sign plus a "Trending up" sentence all saying the same thing.** Pick sign plus one cue, and use the footer line for the *why* or the basis.
- **Whole-tile background in red or green** (Grafana "Background Solid" colour mode) for a delta. It reads as an alarm, and it fails contrast for the value text in many themes.
- **Gauges or traffic lights for a delta.** Few's bullet graph spec exists because gauges waste space and hide the comparative measure.

## Good references
- [Power BI KPI visual](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-kpi) — "People consider some KPIs better for *higher* values and consider some better for *lower* values. For example, earnings versus wait time." It makes Direction an explicit setting.
- [Grafana stat panel](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/) — percent change colour mode Standard, Inverted, or Same as Value, the right primitive for good direction. Percent change is off by default.
- [SaaSframe metrics pattern](https://www.saasframe.io/patterns/metrics) — "Direction is not the same as desirability", partial periods, and small baselines.
- [Stephen Few, Bullet Graph Design Specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf) — for "low is good" metrics such as expenses, reverse the order of the qualitative ranges; the bar may keep its usual direction or be reversed with the scale. Encode ranges as intensities of one hue (40%, 25% and 10% black for three ranges), darker for poor states, not distinct hues.
- [data.europa.eu: Percentages versus percentage points](https://data.europa.eu/apps/data-visualisation-guide/percentages-versus-percentage-points) — the mask study: infection rates of 1.8% and 2.1%. The 0.3 gap was called a "percentage difference" and quoted as "0,3 percent", hiding a 14% relative effect.

## Bad references
- [shadcn/ui dashboard-01 section cards](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx) — "Growth Rate 4.5%" with a "+4.5%" badge is unclear between pp and relative, and has no comparison period on the badge. "Total Revenue" has the subtext "Visitors for the last 6 months", a basis that doesn't match the metric. It is copied into many starter dashboards.
- Grafana stat panel **Standard** percent-change colour mode ([docs](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/)) — "Green if the percent change is positive, red if the percent change is negative", so an error-rate panel shows green when errors go *up* unless someone picks "Inverted".
- [Benzinga: red means up in China, Japan, Taiwan](https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan) — hard-coded red=bad mappings are wrong for these users.

## Accessibility
- The accessible text reads the full sentence: "Up 12.3% versus last month, favourable". Hide the arrow icon (`aria-hidden="true"`).
- Write "percentage points" in full in the accessible name, since "pp" is read as letters.
- Don't put `aria-live` on deltas that refresh often. Announce only on user-initiated refresh (see `data-timestamps-freshness.md`).
- Delta text contrast is at least 4.5:1 against the card surface in both themes. Green-on-white is the usual failure; check `--positive` on `--surface` in both themes before shipping.

## Motion / interaction (if relevant)
- Hover or focus on the delta shows a tooltip with both absolute values and the period ranges: "$1.42M (Nov 1–20) vs $1.26M (Oct 1–20)".
- Don't animate colour changes on live updates. Swap them instantly, and see `motion-number-tweening.md` for value tweening.

## Tokens and values
| Token | Role | Light (example) | Dark (example) |
|---|---|---|---|
| `--positive` | favourable | `--success-fg` (blue `--info-fg` under `data-money="cvd"`), at least 4.5:1 | dark-theme `--success-fg` |
| `--negative` | unfavourable | `--danger-fg` | dark-theme `--danger-fg` |
| `--text-muted` | flat or no good direction | `--text-muted` | `--text-muted` |
| Flat threshold | below which there's no colour or arrow | ±0.5% or per-metric σ | |
| Small-baseline threshold | switch to absolute delta | per metric (for example n < 20) | |
| Badge padding | | 2px 6px, radius `--radius-xs` (4px) or `--radius-sm` (6px) | |
| Delta font size | | 0.75–0.875rem, weight 500 | |
| Arrow glyph | | ▲ ▼ or 12px icon, `aria-hidden` | |

## Implementation sketch
```ts
type GoodDirection = "up" | "down" | "neutral";
type DeltaTone = "positive" | "negative" | "neutral";

interface DeltaInput {
  current: number;
  previous: number | null;
  goodDirection: GoodDirection;
  isRate: boolean;          // rates stored as fractions (0.021); true → percentage points
  minBaseline: number;      // below → absolute delta
  flatThreshold: number;    // relative, e.g. 0.005 = ±0.5%
}

interface DeltaView { text: string; tone: DeltaTone; arrow: "up" | "down" | "flat"; srText: string }

export function computeDelta(d: DeltaInput, locale: string, basisLabel: string): DeltaView | null {
  if (d.previous === null) return null; // render "No prior data"
  const abs = d.current - d.previous;
  const useAbsolute = Math.abs(d.previous) < d.minBaseline || Math.sign(d.previous) !== Math.sign(d.current);
  const rel = useAbsolute || d.isRate ? null : abs / Math.abs(d.previous);
  const flat = rel !== null ? Math.abs(rel) < d.flatThreshold : abs === 0;
  const arrow = flat ? "flat" : abs > 0 ? "up" : "down";
  const tone: DeltaTone =
    flat || d.goodDirection === "neutral" ? "neutral"
    : (abs > 0) === (d.goodDirection === "up") ? "positive" : "negative";
  const fmt = new Intl.NumberFormat(locale, {
    signDisplay: "exceptZero", maximumFractionDigits: 1,
    ...(rel !== null ? { style: "percent" } : {}),
  });
  const value = rel ?? (d.isRate ? abs * 100 : abs);
  const num = fmt.formatToParts(value).map((p) => (p.type === "minusSign" ? "−" : p.value)).join("");
  const text = d.isRate ? `${num} pp` : num;
  const bare = num.replace(/^[+−]/, "");
  const srText = `${arrow === "up" ? "Up" : arrow === "down" ? "Down" : "Unchanged"} ${
    d.isRate ? `${bare} percentage points` : bare
  } ${basisLabel}, ${tone === "positive" ? "favourable" : tone === "negative" ? "unfavourable" : "neutral"}`;
  return { text, tone, arrow, srText };
}
```
```html
<p class="delta" data-tone="negative">
  <span aria-hidden="true">▲</span>
  <span aria-hidden="true">+18.2%</span>
  <span class="basis" aria-hidden="true">vs last 7 days</span>
  <span class="sr-only">Up 18.2% versus last 7 days, unfavourable</span>
</p>
```
```css
.delta { display: inline-flex; gap: .25rem; align-items: baseline; font-size: .875rem; font-variant-numeric: tabular-nums; }
.delta[data-tone="positive"] { color: var(--positive); }
.delta[data-tone="negative"] { color: var(--negative); }
.delta[data-tone="neutral"]  { color: var(--text-muted); }
.delta .basis { color: var(--text-muted); }
```

## Checklist
- [ ] Every metric definition has `goodDirection`. Cost, latency and churn render "up" as unfavourable.
- [ ] The delta text has an explicit sign, and the comparison basis is visible.
- [ ] Changes in rates show `pp`, and relative changes on rates are labelled "relative".
- [ ] Small or zero or sign-flipped baselines fall back to an absolute delta or "No prior data".
- [ ] Partial periods are compared like-for-like, or labelled.
- [ ] The colour pair is CVD-checked and differs in lightness. Meaning survives greyscale.
- [ ] Red=up locales or users can swap the mapping.
- [ ] The accessible name states direction, magnitude, basis and favourability.

## Sources
- https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-kpi
- https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/
- https://www.saasframe.io/patterns/metrics
- https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- https://data.europa.eu/apps/data-visualisation-guide/percentages-versus-percentage-points
- https://en.wikipedia.org/wiki/Percentage_point
- https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan
- https://robinhood.com/support/articles/accessibility-options
- https://www.925studios.co/blog/stripe-dashboard-design-breakdown
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/visual-design/color.md (colour-only signalling)
