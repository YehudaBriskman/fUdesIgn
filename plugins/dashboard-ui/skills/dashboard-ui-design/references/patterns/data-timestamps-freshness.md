# Timestamps and data freshness

> Show recent event times as relative ("5 min ago") and older ones as absolute dates. Always expose the exact time with timezone on hover or focus and in `<time datetime>`. Every dashboard states how fresh its data is ("Updated 4 min ago") next to the numbers it qualifies.

**Category:** Data display · **Applies to:** table timestamp columns, activity feeds, KPI footers, dashboard headers, refresh controls · **Priority:** must

## When to use / when not
- **Relative:** recency matters more than the exact instant (last deploy, last login, activity feed, "updated").
- **Absolute:** the exact instant matters (transaction time, audit log, legal or financial records, anything screenshotted or exported), or the event is older than the threshold.
- **Both:** audit trails and tables that are screenshotted for incidents. Aaron Parecki: with a relative date in a screenshot, "Months later, you've completely lost the date."
- **Data freshness indicator:** always on dashboards backed by batch, ETL or cached data, and on any number that can be stale. SaaSframe: "Explain freshness near the metrics where users rely on it."

## Rules (do)
### Relative vs absolute thresholds
- Use one product-wide threshold. Pick from evidence-backed defaults:

  | Product | Relative window |
  |---|---|
  | Vercel dashboard | 3 days ("10m ago" → "Jan 3") |
  | Palantir Foundry freshness | 24 hours |
  | AEM timeline | 7 days (user-adjustable) |
  | GitHub Primer `relative-time` | 30 days (`threshold: P30D`) |
  | Cloudscape | no cut-off; relative up to "# years ago" |

  Recommended for data dashboards: **relative under 24h, absolute after**. Activity feeds can go to 7 days.
- Relative granularity (Cloudscape): 0–59 s is "Now", then "# minutes ago" (1–59 min), "# hours ago" (1–24 h), "# days ago" (1–31 days), then weeks, months and years. Within the 24h window that means: under 60s "Just now", then minutes, then hours. Don't use seconds-level ticking for anything that isn't a live monitor.
- Generate the text with `Intl.RelativeTimeFormat(locale, { numeric: "auto" })`. Verified in `en`: `-1 day` → "yesterday", `-5 minute` → "5 minutes ago" ("5 min. ago" with `style: "short"`, "3 hr. ago" for hours). Never hand-concatenate.
- Absolute format via `Intl.DateTimeFormat`:
  - same year: "Nov 21, 14:32" (`month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23"` in `en-US`);
  - different year: "Nov 21, 2025";
  - tables in ops and finance: ISO-like `2026-11-21 14:32` in a fixed-width column, which sorts visually and is locale-neutral. `Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short" })` produces exactly this (verified).
- **Timezone:** show it whenever users span zones or the data's zone differs from the viewer's: "14:32 UTC" or "(UTC+2:00)". Cloudscape: "Always include the UTC offset, including for UTC itself." For finance, state the business timezone of period boundaries ("Days end at 00:00 America/New_York").
- **Exact time on demand:** wrap every timestamp in `<time datetime="2026-11-21T14:32:05Z">`, with a tooltip on hover *and focus* showing the full absolute time and zone (Primer, Cloudscape, Vercel).
- **Label the timestamp:** "[Noun] [verb]": "Created", "Invoice paid". Omit "date", "time" or "timestamp" from labels. Cloudscape reserves "Last updated" for the last successful refresh. In tables, use the header "Updated" rather than "Date".
- **Future times:** "in 3 days", "Due Nov 24" (Cloudscape: "In [number] [unit of time]").
- **Times in GOV.UK-style prose:** "5:30pm (not 1730hrs)", "midday (not 12 noon, noon or 12pm)", "midnight (not 00:00)". Ranges use "to": "10am to 11am (not 10-11am)". In dense ops tables a 24h clock is the better choice.

### Freshness
- Put a freshness line in the dashboard header near the date-range picker: "Data as of Nov 21, 14:00 UTC · Updated 4 min ago · ↻ Refresh".
- Distinguish two times:
  - **data as of:** the time the source data covers;
  - **fetched at:** the last successful refresh.
  For batch pipelines these differ by hours. Show "as of" whenever it lags more than one refresh interval.
- **Stale threshold:** each source declares its expected cadence (real-time, 15 min, hourly, daily). When `now − asOf > 2 × cadence`, show a warning status: "Data delayed, last updated 3 h ago", with an amber icon plus text and a tooltip explaining the cause.
- **Manual refresh:** the button sits in the header actions. Keep the data visible during refresh and update "Last updated" on success. Cloudscape: if a refresh can't finish within about 1 to 10 seconds, show a status indicator next to the refresh button; use a warning indicator with a popover for partial or total failure.
- **Auto refresh:** state the interval ("Auto-refresh: 30s" with an off toggle; Cloudscape's example interval is 10s). Pause while the tab is hidden (`document.visibilityState`) and when the user is interacting (open menu, selection, scrolled table).
- **Relative text must tick.** Re-render "4 min ago" every 60s, or the label lies. Use one shared interval, not one per element.
- **Per-widget freshness** only when sources differ. Otherwise one global line (avoid 12 "updated 2 min ago" footers).
- **Exports and screenshots** embed the absolute as-of time and timezone.

## Anti-patterns (don't)
- Relative times on records people cite later (invoices, audit logs) with no absolute fallback.
- "Updated just now" that never re-renders.
- Ambiguous numeric dates (`03/04/2026`). Use month names or ISO. GOV.UK: "2 June and not 2nd June", and no comma between month and year ("4 June 2017").
- Mixing relative and absolute formats in one column. Pick one per column; absolute is the safer default in tables.
- Timezone-less times in multi-region products.
- A spinner replacing all data on each auto-refresh.
- A freshness indicator that shows the fetch time when the pipeline is 6 hours behind, so "Updated 1 min ago" on yesterday's data.

## Good references
- [Cloudscape: Timestamps](https://cloudscape.design/patterns/general/timestamps/) — relative bands from "Now" to "# years ago", "Always include the UTC offset, including for UTC itself", `<time>` with a `title` for absolute, "[Noun] [verb]" labels, "Last updated" for the last successful refresh.
- [Cloudscape: Loading and refreshing](https://cloudscape.design/patterns/general/loading-and-refreshing/) — manual vs auto refresh, "Keep the dataset visible while the refresh operation is ongoing", timestamp after success, a pending or warning indicator with popover for delayed or partial refresh, announcing the new refresh timestamp via a live region.
- [Primer `relative-time`](https://primer.style/product/components/relative-time/) — `threshold` default `P30D`, `tense: auto | past | future`, `format: auto | micro | elapsed`, and a `title` attribute by default (`noTitle` removes it).
- [Vercel changelog: date display](https://vercel.com/changelog/improvement-to-how-dates-display-in-the-dashboard) — "For the first three days, dates are displayed as relative", then absolute; hover reveals the exact timestamp.
- [Palantir Foundry data freshness widget](https://palantir.com/docs/foundry/workshop/widgets-data-freshness/) — a "Last Updated" time per object type and datasource. "If the last index time exceeds 24 hours, the timestamp renders an absolute format."

## Bad references
- [Aaron Parecki, "You should not be displaying relative dates"](https://aaronparecki.com/2012/08/23/3/you-should-not-be-displaying-relative-dates) — the failure modes of relative-only: useless screenshots, no machine-readability, and "9 hours ago" covering every time from 10:25pm to 10:57pm.
- [Appian "Display last refresh time" recipe](https://docs.appian.com/suite/help/25.1/recipe-display-last-refresh-time.html) — the timestamp has its own 30s timer (`refreshInterval: 0.5`) and updates even when the data hasn't changed, so it reports polling, not data currency. That's a useful example of measuring the wrong "freshness".

## Accessibility
- Use `<time datetime>` for every timestamp. The tooltip content is also reachable via focus (`tabindex="0"` on the time element only if it's not inside another control) or exposed via `aria-describedby`.
- Announce freshness changes only after a user-initiated refresh ("Updated, 14:32") via a polite live region. Never announce auto-refresh ticks.
- Relative text that ticks every minute must not live in a live region.
- Warning states use icon plus text, not amber colour alone.

## Motion / interaction (if relevant)
- The refresh button icon rotates while pending (≤ 1 turn/s), and stops under `prefers-reduced-motion`. Show "Refreshing…" text after 1s.
- When new data lands, optionally flash changed cells with a 600ms background fade. Skip it for more than 20 changed cells and under reduced motion. See `motion-number-tweening.md`.

## Tokens and values
| Token | Default |
|---|---|
| Relative window | under 24h (dashboards), under 7d (activity feeds) |
| Relative tick | 60s shared interval |
| "Just now" | under 60s |
| Stale threshold | more than 2× source cadence |
| Auto-refresh default | 30–60s (ops), off (finance or analytics) |
| Tooltip delay | 200ms hover for the first in a group, immediate on focus (`comp-overlay-choice.md`) |
| Absolute, table | `YYYY-MM-DD HH:mm` 24h + zone in header |
| Absolute, prose | `Nov 21, 2026, 2:32 PM UTC` (locale-driven) |
| Freshness text | 0.75rem (`--type-meta`), `--text-muted`; warning `--warning-fg` + icon |

## Implementation sketch
```ts
const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
function rtfFor(locale: string): Intl.RelativeTimeFormat {
  let f = rtfCache.get(locale);
  if (!f) { f = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" }); rtfCache.set(locale, f); }
  return f;
}
const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ["day", 86_400_000], ["hour", 3_600_000], ["minute", 60_000],
];

export function formatEventTime(at: Date, now: Date, locale: string, timeZone: string): { text: string; full: string } {
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "long", timeZone }).format(at);
  const diff = at.getTime() - now.getTime();
  if (Math.abs(diff) < 60_000) return { text: "Just now", full };
  if (Math.abs(diff) < 86_400_000) {
    const [unit, ms] = UNITS.find(([, ms]) => Math.abs(diff) >= ms) ?? ["minute", 60_000];
    return { text: rtfFor(locale).format(Math.trunc(diff / ms), unit), full };
  }
  const year = (d: Date): string => new Intl.DateTimeFormat("en", { year: "numeric", timeZone }).format(d);
  const sameYear = year(at) === year(now); // compare in the display zone, not the host zone
  const text = new Intl.DateTimeFormat(locale, {
    month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }), timeZone,
  }).format(at);
  return { text, full };
}

export function freshness(asOf: Date, now: Date, cadenceMs: number): "fresh" | "stale" {
  return now.getTime() - asOf.getTime() > 2 * cadenceMs ? "stale" : "fresh";
}
```
```html
<div class="freshness" data-state="stale">
  <svg aria-hidden="true" class="icon-warning">…</svg>
  <span>Data delayed · as of <time datetime="2026-11-21T11:00:00Z" title="Nov 21, 2026, 11:00:00 UTC">3 h ago</time></span>
  <button type="button" aria-label="Refresh data">↻</button>
</div>
<p class="sr-only" aria-live="polite" id="refresh-status"></p>
```

## Checklist
- [ ] One product-wide relative/absolute threshold. Tables default to absolute.
- [ ] Every timestamp is in `<time datetime>`, with the full time and zone on hover and focus.
- [ ] The timezone is shown wherever the audience spans zones, and period boundaries state their zone.
- [ ] The dashboard shows "as of" (data time) and "updated" (fetch time) when they differ.
- [ ] The stale state triggers at more than 2× cadence with icon plus text.
- [ ] Relative labels re-render on a shared 60s tick.
- [ ] Auto-refresh pauses on hidden tab or interaction, and never wipes visible data.
- [ ] Exports and screenshots carry the absolute as-of time.

## Sources
- https://cloudscape.design/patterns/general/timestamps/
- https://cloudscape.design/patterns/general/loading-and-refreshing/
- https://primer.style/product/components/relative-time/
- https://vercel.com/changelog/improvement-to-how-dates-display-in-the-dashboard
- https://palantir.com/docs/foundry/workshop/widgets-data-freshness/
- https://aaronparecki.com/2012/08/23/3/you-should-not-be-displaying-relative-dates
- https://uxmovement.com/content/absolute-vs-relative-timestamps-when-to-use-which/
- https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-27917
- https://docs.appian.com/suite/help/25.1/recipe-display-last-refresh-time.html
- https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
- https://www.saasframe.io/patterns/metrics
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/js/coordinate-global-events.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/js/support-global-calendar-systems.md
