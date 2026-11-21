# Stale-while-revalidate and "Updating…" instead of blocking spinners

> Once a panel has shown data, never replace it with a spinner or skeleton again. Keep the last good data visible and interactive, mark it as refreshing with a small non-blocking "Updating…" indicator after a 200 ms show-delay (dimming chart marks to 60% opacity after 1 s when the controls changed), show when it was last updated, and swap in new data without moving the layout.

**Category:** Progressive loading · **Applies to:** filter changes, date-range changes, auto-refresh, polling, tab returns, background refetch, pagination of tables · **Priority:** must

## When to use / when not
Related: freshness labels and as-of formatting are covered in `data-timestamps-freshness.md`; error and partial states in `data-loading-empty-error-states.md`.

Use whenever a query re-runs for a view that already has data: new filters, a new date range, a periodic refresh, refocusing the window, returning to a tab.
Exceptions:
- The **meaning** of the old data no longer matches the controls in a way that could mislead a decision (for example, switching account or entity in a finance tool). Clear it, or label it boldly as previous ("Showing Acme Corp until Beta Inc loads"), so stale numbers aren't attributed to the new selection.
- Data is safety- or money-critical and must not be acted on while stale (placing trades): disable the actions, not the view.

## Rules (do)
- **Three distinct states, three distinct visuals:**
  1. *Initial loading* (no data): skeleton (see `prog-loading-states.md`).
  2. *Refreshing* (data present): old data stays; small inline indicator (top-edge 2 px progress line or "Updating…" spinner in the panel header) after a 200 ms delay.
  3. *Stale/failed refresh*: old data stays plus a visible "Last updated 14:02 · Couldn't refresh · Retry".
- **Dim only when it matters:** if the refresh exceeds 1 s (NN/g's flow limit) and the visible data no longer matches the controls (filters changed), dim the chart marks to 0.6 opacity and keep text at full opacity. NN/g notes faceted-search systems "dim the results set and show a progress indicator" before showing new results. Don't dim for background polling where the controls haven't changed.
- **Controls stay responsive:** users can change the filter again mid-refresh. Cancel or ignore the in-flight request (AbortController, latest-wins) so out-of-order responses never overwrite newer ones.
- **Timestamp freshness:** "Updated 2 min ago" (relative, with absolute time on hover/focus) for any data that auto-refreshes or comes from a cache. For finance data, also show the as-of date of the underlying data, which is distinct from the fetch time.
- **Swap without shift:** keep dimensions. Animate changed values only (see `motion-number-tweening.md`) or flash a highlight on changed cells (600 ms background-colour fade; colour only, so it is not movement and stays under reduced motion). Never re-run entrance animations.
- **Cache policy:** server `Cache-Control: max-age=N, stale-while-revalidate=M` (browsers without support ignore the directive and fall back to `max-age`), or client caches (TanStack Query, SWR, RSC) with `placeholderData: keepPreviousData` for paginated or filtered queries. TanStack Query treats cached data as stale immediately by default (`staleTime: 0`), garbage-collects inactive queries after 5 minutes, refetches stale queries on mount, window focus and reconnect, and retries failures 3 times with exponential backoff; set `staleTime` to your refresh interval so focus changes don't trigger a refetch storm.
- **Background refetch on focus/reconnect** is fine, but it must be invisible unless data changes. Send background polls with `fetch(url, { priority: 'low' })` so they don't compete with user-initiated queries (Chrome guidance). Fetch priority is Baseline newly available (Chrome 101+, Safari 17.2+, Firefox 132+); browsers without it ignore the option, so no fallback code is needed.
- **Paginated tables:** keep the current page visible with the "Updating…" indicator; don't collapse to a single spinner row.
- **Auto-refresh dashboards:** show the interval and a pause control. Set a "now delay" for late-arriving data (Grafana: "accommodate known delays in data aggregation to avoid null values") so the latest bucket doesn't flicker between partial and complete values.

## Anti-patterns (don't)
- Replacing a populated chart with a centered spinner every time a filter changes: content flicker, lost context, and layout collapse.
- Global top-of-page loading bars that block clicks during a background poll.
- Showing the old data with no cue while the new query runs: users read old numbers as the new answer.
- Race conditions where a slow earlier request lands after a fast later one.
- "Last updated" stamps that only show the fetch time when the data itself is days old.
- Re-animating every KPI on each 30 s poll.

## Good references
- [web.dev, Keeping things fresh with stale-while-revalidate](https://web.dev/articles/stale-while-revalidate): with `max-age=1, stale-while-revalidate=59`, a repeat within 1 s is fresh, 1–60 s is served stale while a background request refreshes the cache, and after 60 s the browser waits for the network. For service-worker caches, Workbox's Broadcast Cache Update notifies the page when revalidation changed the data.
- [TanStack Query, Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) and [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates): stale-by-default caching, 5-minute GC, 3 retries; `cancelQueries` "so they don't overwrite our optimistic update", the same pattern that powers latest-wins refreshes.
- [NN/g, Applying Filters](https://www.nngroup.com/articles/applying-filters/): interactive filtering needs "the new results to be shown less than one second after each filter has been specified"; dim the results and show progress while updating; "visual cues are necessary so that users are aware that a change has occurred".
- [Grafana dashboard settings](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/): auto-refresh intervals and "now delay" for late data. (That panels refresh without blanking is observed product behaviour, not stated on this page.)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): "Persist state in the URL so share, refresh, Back/Forward navigation work", plus the show-delay (~150–300 ms) and minimum-visible (~300–500 ms) rules.

## Bad references
- Many chart wrappers (for example default Recharts/Chart.js usage behind a `isLoading ? <Spinner/> : <Chart/>` ternary) unmount the chart on every refetch. Tooltip, zoom and scroll state are lost, the panel height collapses, and users see a spinner for queries that take 300 ms. The anti-pattern is the ternary, not the library. Branch on `isPending` (no data yet) and `isFetching` (refresh) separately; in TanStack Query v5 `isLoading` means `isPending && isFetching`.
- Legacy BI "Processing request…" modal overlays on every filter change (classic SSRS and old Tableau Server views): they block all interaction, even with the previous result on screen.

## Accessibility
- Refreshing panel: `aria-busy="true"` while updating. A single polite status outside it announces "Revenue updated" only for user-initiated refreshes, not for background polls.
- Dim chart marks only, never text: lowering text opacity can drop it below 4.5:1, and the reduction depends on the colours involved, so recheck any dimmed text with a contrast checker. Pair the dim with a visible "Updating…" label so the state is not conveyed by opacity alone.
- Freshness stamps are real text, not only an icon colour.

## Motion / interaction (if relevant)
- Top-edge progress line: indeterminate 1.5 s sweep; static under reduced motion.
- New data: opacity stays at 1 and values change in place; changed cells get a 600 ms background highlight fade.

## Tokens and values
| Token | Value |
|---|---|
| refresh indicator show-delay | 200 ms |
| dim threshold | refresh > 1000 ms and controls changed |
| dim opacity | 0.6 (marks), text unchanged |
| refresh line height | 2 px, `--accent` |
| changed-cell highlight | `color-mix(in oklab, var(--accent) 15%, var(--surface))` → transparent over 600 ms (colour fade, outside the 100–400 ms movement tokens on purpose) |
| freshness label | relative ("2 min ago"), absolute on hover; tabular nums |
| stale warning | data older than 2 × refresh interval → `--warning-fg` text plus the word "Stale" (rule of thumb, unsourced) |
| example cache header | `Cache-Control: max-age=30, stale-while-revalidate=300` |

## Implementation sketch
```tsx
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { z } from 'zod';
import type { ReactNode } from 'react';

// App components assumed by this sketch (skeleton, delayed indicator, freshness stamp, chart)
declare function PanelSkeleton(): ReactNode;
declare function DelayedIndicator(p: { delayMs: number; label: string }): ReactNode;
declare function Freshness(p: { at: number; error: boolean; onRetry: () => void }): ReactNode;
declare function RevenueChart(p: { data: { t: string; v: number }[] }): ReactNode;

const Series = z.array(z.object({ t: z.string(), v: z.number() }));
type Series = z.infer<typeof Series>;

async function fetchSeries(range: string, signal: AbortSignal): Promise<Series> {
  const res = await fetch(`/api/revenue?range=${encodeURIComponent(range)}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Series.parse(await res.json() as unknown);
}

export function RevenuePanel({ range }: { range: string }) {
  const q = useQuery({
    queryKey: ['revenue', range],
    queryFn: ({ signal }) => fetchSeries(range, signal), // latest-wins via abort
    placeholderData: keepPreviousData,                    // keep old data while refetching
    staleTime: 30_000,
  });
  const refreshing = q.isFetching && q.data !== undefined;
  const mismatched = q.isPlaceholderData;                 // old data, new controls

  if (q.isPending) return <PanelSkeleton />;
  return (
    <section aria-busy={refreshing} className="panel" data-dim={mismatched || undefined}>
      <header>
        <h2>Revenue</h2>
        {refreshing && <DelayedIndicator delayMs={200} label="Updating…" />}
        <Freshness at={q.dataUpdatedAt} error={q.isError} onRetry={() => void q.refetch()} />
      </header>
      {q.data && <RevenueChart data={q.data} />}
    </section>
  );
}
```
```css
.panel[data-dim] .chart-marks { opacity: 0.6; transition: opacity var(--motion-dur-short) linear 1s; } /* dims only after 1 s */
```

## Checklist
- [ ] A panel with data never reverts to a skeleton or a blocking spinner.
- [ ] Refresh indicator is inline (panel header or a 2 px top line), appears after 200 ms, and no control is disabled while it shows.
- [ ] Old-data-for-new-controls state is visibly marked (marks at 0.6 opacity plus an "Updating…" label) after 1 s; text stays at full opacity.
- [ ] In-flight requests are aborted or ignored when superseded (latest-wins).
- [ ] Freshness ("updated" and data as-of) is visible as text.
- [ ] Failed refresh keeps the old data and offers Retry.
- [ ] No layout shift or entrance animation on data swap.

## Sources
- https://web.dev/articles/stale-while-revalidate
- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- https://www.nngroup.com/articles/applying-filters/
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/
- https://vercel.com/design/guidelines
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/out-of-order-html-streaming
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/deprioritize-background-fetches
- https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/progress
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- https://webstatus.dev/features/fetch-priority
