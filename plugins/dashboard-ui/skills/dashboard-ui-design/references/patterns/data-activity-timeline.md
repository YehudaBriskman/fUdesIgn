# Activity timeline and audit log

> Use a timeline when the question is "what happened, in what order, and what caused it"; keep a filterable table when the question is "find, compare or export", and in both cases give every event an actor, an action, an object and an exact time.

**Category:** Data display · **Applies to:** activity feeds, record history, audit logs, deploy and incident histories, "recent activity" panels · **Priority:** should

## When to use / when not
- **Timeline** when sequence and causality are the point: one subject, one reader, top to bottom (record history, incident, deploy).
- **Filterable table** for search, comparison, sorting or export across many subjects, such as an organisation-wide audit log. GitHub's audit log is one: no free-text search, qualifier filters (operation, actor, repo, action, country, created) and a filter-respecting JSON or CSV export.
- **Plain list rows** for "recent activity" where each item only links onward (`data-list-rows.md`); choosing between forms: `data-cards-vs-tables-vs-lists.md`.
- **Both** is normal: a timeline on the record page, a table at `/audit` (`data-table-interaction.md`). Do not build one component that morphs between them.
- **Not** a timeline: a schedule (calendar or Gantt) or a metric over time (`chart-time-series-line-area.md`).

## Rules (do)
### Anatomy of one event
- **Four facts in fixed positions:** actor (person, service account, "System"), past-tense action, object (a link), time. Add severity only if events genuinely differ in outcome.
- **Write it as a sentence** ("Dana Levi **rejected** invoice INV-2041"); old-to-new values and reasons go on a muted second line. Beyond 2 lines, disclose (`found-progressive-disclosure.md`). Time sits in the same place on every event (`data-list-rows.md`).
- **Automated actors get a labelled identity** ("Billing sync" with a gear icon), never blank or a fake person. A deleted user keeps the stored display name, marked "(removed)".
- **Markers** (8-12px dot or 16-24px icon on a rail) only when they carry event type or severity; never colour alone (`color-semantic-status.md`). Primer's Timeline gives each item a badge with a colour `variant`, and puts the `aria-label` on the badge's icon.
- **Clip the rail** above the first and below the last item so it does not imply unseen history (Primer: `clipSidebar`).

### Grouping and headers
- **Group by the interval users reason in:** day by default, hour for incidents and deploys, month past about 90 days (house default).
- **Headers:** "Today", "Yesterday", then an absolute date (add the year when it is not the current one), as `h3` or a nested list per group.
- **Sticky headers** with an opaque background and `inset-block-start: 0`. Per MDN a sticky element sticks to its nearest scrolling ancestor, so an `overflow: hidden` wrapper breaks it; use `overflow: clip`.
- **Counts in headers** ("14 events") only when the group is fully loaded.
- **Order:** newest first for logs and feeds, oldest first for narratives. State it in text ("Newest first") and, in a table, `aria-sort`.

### Relative and absolute time
- Thresholds, formats and ticking live in `data-timestamps-freshness.md`. Timeline specifics follow.
- **Relative in the row, absolute on demand.** Cloudscape recommends relative for most uses and absolute when the exact moment matters. When the group header carries the date, rows show the clock time ("14:32"). **Audit logs are always absolute with zone** (house decision), since "3 hours ago" gets quoted in reports.
- **Markup:** `<time datetime="2026-11-21T14:32:05Z">`; `datetime` must be a valid date-time (MDN: `Z` or an offset), and a `<time>` without it holds only text. Per Cloudscape, repeat the absolute value in `title` and include the UTC offset, UTC too ("UTC+0:00"). `title` is hover-only, so also expose it on focus (`cpover-popover-menu-tooltip.md`) or in the details.
- **Format with `Intl.RelativeTimeFormat(locale, { numeric: "auto" })`** ("yesterday", per MDN); never concatenate English units.
- **Collapse bursts** (same actor, action and object within 60 s, house default) into one expandable row with a count.

### Live updates without jumping
- **Never insert above the viewport while the reader is scrolled down.** Past about one row of `scrollTop`, buffer and show an "N new events" button that prepends them and scrolls to top; at 0, insert directly.
- **Scroll anchoring** is on by default (MDN); set `overflow-anchor: none` only on a tailing log that sets scroll itself.
- **Never reorder rows** or move the one under the pointer or focus.
- **Provide "Pause live updates"** (WCAG 2.2.2 Pause, Stop, Hide: auto-updating content needs pause, stop, hide or frequency control unless essential; unlike moving content it has no five-second exemption). On resume, jump to current data.
- **Announce the buffered count, not each event:** a `role="status"` region updated at most every 10 s (house default); SC 4.1.3 wants status messages exposed without moving focus. Not `alert`; never make the list a live region.
- Poll, visibility and "as of" rules: `prog-stale-while-revalidate.md`, `data-timestamps-freshness.md`.

### Pagination vs infinite scroll for logs
- **NN/g:** infinite scroll suits homogeneous content browsed without a goal and is a poor fit for finding or comparing items; without "Load more" the footer is unreachable and Back often resets position. Pagination offers landmarks.
- **GOV.UK:** avoid infinite scroll (a problem for keyboard users); filters apply to the whole list and return to page 1.
- **House decision:** investigative audit and history use cursor pagination (Previous/Next or numbers) or "Load more" with a reachable footer; short record timelines use "Load 25 more" (house default 25-50); pure infinite scroll only for ambient "recent activity".
- **Say how much:** "Showing 1-50 of about 2,300", or that the total is unknown. Keep filters, cursor and range in the URL.
- **Cursor (keyset), not offset,** for live logs, or new rows shift pages and duplicate or drop events.
- **Virtualise** past a few hundred loaded rows, or use `content-visibility: auto` (`cpctl-virtualised-lists-and-tables.md`), with `aria-setsize` and not where users rely on browser find.
- **State retention and default window.** GitHub keeps 180 days but opens on the last three months; older events need a date range, so surface that.

### Filtered and empty states
- Filters per `comp-filter-bar-chips.md` (actor, action, object, severity, range) as removable chips with a result count; empty groups drop out.
- **Three empty states** (`data-loading-empty-error-states.md`): nothing yet, filters match nothing (with "Clear filters"), outside retention or no permission. Never "No data".
- **Export respects filters** and states range, timezone and time format (GitHub exports `created_at` as epoch milliseconds).

### RTL and long names
- **Logical properties only** (`inset-inline-start`, `padding-inline`); rail and markers mirror, the time stays at the inline end.
- **Wrap each user string** (actor, object title, branch) in `<bdi>` or `dir="auto"`. W3C notes detection uses the first strong character and is not foolproof, so isolate each variable, not the sentence.
- **Ids, hashes, paths and IPs** get `dir="ltr"` (`data-display` skill); timestamps via `Intl.DateTimeFormat(locale)`.
- **Truncate actor and object, never the verb or time:** `min-inline-size: 0`, one line, ellipsis, full value in details (`found-worst-case-data.md`).

## Anti-patterns (don't)
- A `div` per event with a decorative line; use an ordered list.
- Relative-only time in an audit log.
- New events pushing down the row being read.
- Infinite scroll with an unreachable footer and no jump to a date.
- "Someone updated something": missing actor, or an object that is not a link.
- Colour-only dots, 8 colours long.
- A timeline used as a table with 6 attributes per event.
- Sticky headers covering the focused row; add `scroll-padding-block-start` equal to the header height.

## Good references
- [Primer Timeline](https://primer.style/components/timeline/) - `Timeline.Badge` with `variant`, `clipSidebar`, `condensed` items, and list semantics behind an experimental feature flag.
- [Cloudscape Timestamps](https://cloudscape.design/patterns/general/timestamps/) - relative for most uses, absolute with UTC offset, `<time>` with `datetime` and `title`, a label on every timestamp.
- [GitHub audit log docs](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) - qualifier filters, filter-respecting export, 180-day retention with a three-month default view.
- [W3C APG Feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) - `role="feed"`, `article`, `aria-busy`, `aria-posinset`, `aria-setsize` (-1 when unknown), suggested Page Up/Down keys.
- [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/) - when to split, ellipses for skipped pages, page number in `<title>`, filters apply to the whole list.
- [NN/g, Infinite Scrolling Tips](https://www.nngroup.com/articles/infinite-scrolling-tips/) - infinite scroll vs Load More vs pagination, footer access, position retention.

## Bad references
- Infinite scroll as the only way through a long audit history ([NN/g](https://www.nngroup.com/articles/infinite-scrolling-tips/)): the footer is unreachable and Back loses position.
- A default window that silently hides retained events: GitHub's audit log retains 180 days but shows three months until a `created` range is set. State retention and window on the page.
- Div-based rails: Primer's Timeline renders `ol`/`li` only when an experimental feature flag is enabled, so the default ships without list semantics.

## Accessibility
- **Markup:** `<ol role="list">` of `<li>` events, DOM order matching visual order; groups are `<li>` with an `h3` and nested `ol`. SC 1.3.1 requires structure available in code; `role="list"` restores semantics Safari drops with `list-style: none`.
- **`role="feed"`** only for an unbounded, load-as-you-read stream, following APG exactly (`aria-busy`, `aria-setsize`, `aria-posinset`); paginated history stays a plain list.
- **Markers** are `aria-hidden` when text says it, else get a text alternative ("Failed"). Link text names the object, not "View".
- **Focus:** "N new events" and "Load more" are real buttons; after "Load more" move focus to the first new item.
- **Motion:** none under `prefers-reduced-motion` (`motion-reduced-motion.md`).

## Motion / interaction (if relevant)
- Arrival: 150-200 ms fade (house default) only at `scrollTop` 0; no flash longer than 1 s.
- Burst or details expand: height transition 150-200 ms, focus stays on the toggle. Sticky header swaps are instant.

## Tokens and values
| Token | Default | Use |
|---|---|---|
| `--tl-rail-width` | 2px | connecting line, `--border` |
| `--tl-marker-size` | 10px dot / 20px icon | rail centred on it |
| `--tl-gap` | 12px | marker to content |
| `--tl-row-pad-block` | 8px compact / 12px default | row padding |
| `--tl-group-header-h` | 32px | sticky header and `scroll-padding-block-start` |
| `--tl-burst-window` | 60s | collapse same actor, action, object |
| `--tl-live-announce` | 10s | max rate of status message |
| `--tl-page-size` | 25-50 | rows per page |
| Time text | 0.75rem, `--text-muted`, `tabular-nums` | per-row clock time |

All values are house defaults; no single source fixes them.

## Implementation sketch
```html
<section aria-labelledby="hist-h">
  <h2 id="hist-h">History</h2>
  <p class="meta">Newest first · last 180 days · times in your zone (UTC+2:00)</p>
  <button type="button" class="new-pill" hidden>5 new events</button>
  <p role="status" class="sr-only" id="live-status"></p>

  <ol class="timeline" role="list">
    <li class="day">
      <h3 class="day-h">Today</h3>
      <ol role="list">
        <li class="event" data-severity="failed">
          <span class="marker" aria-hidden="true"></span>
          <p class="line">
            <bdi class="actor">Dana Levi</bdi>
            <span class="verb">rejected</span>
            <a class="object" href="/invoices/INV-2041"><bdi>Invoice INV-2041</bdi></a>
            <span class="sr-only">Outcome: failed.</span>
          </p>
          <p class="detail">Reason: duplicate of INV-2038</p>
          <time datetime="2026-11-21T14:32:05Z" title="Nov 21, 2026, 14:32 (UTC+0:00)">14:32</time>
        </li>
      </ol>
    </li>
  </ol>
  <button type="button" class="more">Load 25 more</button>
</section>
```
```css
.timeline, .timeline ol { list-style: none; margin: 0; padding: 0; }
.timeline { scroll-padding-block-start: 32px; }
.day-h {
  position: sticky; inset-block-start: 0; z-index: 1;
  block-size: 32px; margin: 0; display: flex; align-items: center;
  padding-inline: 16px; font-size: .75rem; font-weight: 600;
  background: var(--surface);
}
.event {
  position: relative;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  column-gap: 12px;
  padding-block: 8px; padding-inline: 16px;
}
.event::before { /* rail */
  content: ""; position: absolute;
  inset-block: 0; inset-inline-start: 25px; inline-size: 2px;
  background: var(--border);
}
.marker { grid-column: 1; align-self: start; margin-block-start: 6px; inline-size: 10px; block-size: 10px; margin-inline: 5px; border-radius: 50%; background: var(--text-muted); position: relative; }
.event[data-severity="failed"] .marker { background: var(--status-danger); }
.line { grid-column: 2; margin: 0; display: flex; gap: .35em; min-inline-size: 0; }
.actor, .object { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.verb { flex: none; }
.detail { grid-column: 2; margin: 0; font-size: .75rem; color: var(--text-muted); }
.event time { grid-column: 3; grid-row: 1; font-size: .75rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
.timeline-log { overflow-anchor: none; } /* only a tailing log that sets scroll itself */
@media (prefers-reduced-motion: no-preference) {
  .event[data-new] { animation: tl-in 180ms ease-out; }
}
@keyframes tl-in { from { opacity: 0; } to { opacity: 1; } }
```
```ts
interface ActivityEvent {
  id: string
  at: string // ISO 8601 with offset
}

class LiveBuffer {
  private pending: ActivityEvent[] = []
  constructor(
    private readonly list: HTMLElement,
    private readonly pill: HTMLButtonElement,
    private readonly status: HTMLElement,
    private readonly render: (e: ActivityEvent) => HTMLElement,
  ) {
    pill.addEventListener('click', () => this.flush())
  }

  push(e: ActivityEvent): void {
    const nearTop = this.list.scrollTop <= 40
    if (nearTop) {
      this.list.prepend(this.render(e))
      return
    }
    this.pending.push(e)
    this.pill.hidden = false
    this.pill.textContent = `${this.pending.length} new events`
    this.announce()
  }

  private lastAnnounce = 0
  private announce(): void {
    const now = Date.now()
    if (now - this.lastAnnounce < 10_000) return
    this.lastAnnounce = now
    this.status.textContent = `${this.pending.length} new events`
  }

  flush(): void {
    const frag = document.createDocumentFragment()
    for (const e of this.pending) frag.append(this.render(e))
    this.list.prepend(frag)
    this.pending = []
    this.pill.hidden = true
    this.list.scrollTo({ top: 0 })
  }
}
```

## Checklist
- [ ] Form matches the question: timeline for sequence, table for audit and export.
- [ ] Every event shows actor, action, linked object, time in fixed positions; automated actors labelled.
- [ ] `ol`/`li` rows, sticky opaque group headers, no clipping `overflow` ancestor.
- [ ] `<time datetime>` with absolute value and offset on hover and focus; audit logs absolute.
- [ ] Live arrivals buffered behind a button, pausable, announcements rate-limited.
- [ ] Cursor pagination or "Load more" with reachable footer; state in URL; retention stated.
- [ ] Empty, no-match and out-of-retention states differ.
- [ ] RTL: logical properties, `<bdi>`, `dir="ltr"` ids; verb and time never truncate.

## Sources
- https://primer.style/components/timeline/
- https://cloudscape.design/patterns/general/timestamps/
- https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization
- https://www.w3.org/WAI/ARIA/apg/patterns/feed/
- https://design-system.service.gov.uk/components/pagination/
- https://www.nngroup.com/articles/infinite-scrolling-tips/
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- https://www.w3.org/International/questions/qa-html-dir
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time
- https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor
- https://developer.mozilla.org/en-US/docs/Web/CSS/position
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
