# Live regions and announcements

> Announce status changes that don't move focus (WCAG 4.1.3) through one polite and one assertive region that exist in the DOM before they are used; send short, deduplicated, debounced text; use `assertive`/`role="alert"` only for time-critical problems; and move focus instead when the user must act.

**Category:** ARIA · **Applies to:** save/sync status, search result counts, filters, cart updates, uploads, toasts, async errors, reorder results, chat and streaming output, live dashboards · **Priority:** must

## When to use / when not
- **Announce** (no focus change): "Saved", "12 results", "File uploaded", "Item moved to position 3", "Connection lost".
- **Move focus** instead when the user must respond: a failed submit's error summary (forms-ui `fvalid-error-summary-and-focus.md`), a dialog, a new page.
- **Don't announce** loading spinners and "Updating…" interstitials unless they last long enough to matter; use `<progress>` or `aria-busy`.
- **Domain owners:** AI streaming answers are announced once per response (ai-ui `aichat-streaming-text.md`, `aifound-accessible-generated-content.md`); toasts and inline alerts are designed in dashboard-ui `comp-notifications-alerts.md`.

## Rules (do)
- **Urgency table:**

| Urgency | Markup | Behaviour | Examples |
|---|---|---|---|
| Critical | `role="alert"` (implicit `aria-live="assertive"`) | Interrupts current speech | Session about to expire, payment failed, connection lost |
| Standard | `role="status"` (implicit `aria-live="polite"`, `aria-atomic="true"`) | Waits for a pause | Saved, results count, item added |
| Log | `role="log"` (polite, additions only) | Reads new entries | Chat transcript, activity feed |
| Progress | `<progress>`, `role="progressbar"` | Read on demand | Upload percentage |
| Off | `aria-live="off"` or none | Only when user navigates there | Character counter, live tickers |

- **Regions exist first.** Render the empty region on page load; screen readers ignore regions inserted together with their content. Then change its text.
- **Centralise:** one polite and one assertive announcer per page (or the framework's announcer). Components call `announce(message, urgency)`; they don't create their own regions.
- **Short and specific:** one sentence, the result not the action ("3 filters applied, 128 results", not "Filters button clicked").
- **Debounce** frequent changes (typing in search: announce the count about 500 ms after typing stops), and **dedupe**: clearing then re-setting the same text after a short delay lets a repeated "Saved" be heard again.
- **Don't announce into inert DOM:** when a modal `<dialog>` is open, an announcer outside it is inert; place the announcer in the top layer or inside the dialog while it is open.
- **Visible equivalent:** every announcement has a visible counterpart (status text, toast, inline message); live regions are not a hidden channel only screen readers get.
- **`aria-busy="true"`** on a region while it rebuilds, then `false`, to avoid partial reads.
- **Toasts:** polite for success; errors persist inline as well (never toast-only).

## Anti-patterns (don't)
- Wrapping the whole results list in `aria-live`: every re-render reads dozens of items.
- `role="alert"` on success toasts.
- Inserting `<div role="alert">Error</div>` and removing it 2 s later before it is read.
- Announcing every keystroke's result count.
- Per-token announcements of a streamed AI answer.
- Several components each owning their own live region, competing for speech.

## Good references
- [W3C — Understanding 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — what counts as a status message and when focus should move instead.
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — politeness, `aria-atomic`, `aria-relevant`, roles with implicit live behaviour.
- [GOV.UK Design System — Notification banner](https://design-system.service.gov.uk/components/notification-banner/) — success banners with `role="alert"` scoped to page load after an action, and why.
- [Adobe React Aria — LiveAnnouncer](https://react-spectrum.adobe.com/react-aria/) — a centralised announcer used by its components.
- [modern-web-guidance — Accessibility §8 Live Regions](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#8-live-regions) and [Accessible error announcement](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-error-announcement.md) — urgency table, centralising, debouncing, inert DOM.

## Bad references
- Chat widgets that put the whole transcript in `aria-live="assertive"`: every new message interrupts and re-reads earlier ones.
- Single-page apps whose "Saved" toast is inserted with the region, so it is never announced.

## Accessibility
- Verify by listening (VoiceOver and NVDA announce live regions differently; NVDA's Speech Viewer shows the text), and by checking the region is present in the DOM before its first message.

## Motion / interaction (if relevant)
- A visual toast may animate; the announcement is not delayed by its animation.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Regions per page | 1 polite + 1 assertive | Central announcer |
| Debounce for typing-driven counts | ~500 ms | Search, filters |
| Re-announce gap | clear, then set after ~100 ms | Repeated identical messages |
| Message length | one sentence | All announcements |

## Implementation sketch
```ts
type Urgency = 'polite' | 'assertive'

const regions = new Map<Urgency, HTMLElement>()

export function mountAnnouncer(host: HTMLElement = document.body): void {
  for (const urgency of ['polite', 'assertive'] as const) {
    if (regions.has(urgency)) continue
    const el = document.createElement('div')
    el.className = 'sr-only'
    el.setAttribute('role', urgency === 'assertive' ? 'alert' : 'status')
    el.setAttribute('aria-live', urgency)
    el.setAttribute('aria-atomic', 'true')
    host.append(el)
    regions.set(urgency, el)
  }
}

let timer: number | undefined
export function announce(message: string, urgency: Urgency = 'polite', debounceMs = 0): void {
  const el = regions.get(urgency)
  if (!el) throw new Error('mountAnnouncer() must run on page load')
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    el.textContent = ''
    window.setTimeout(() => { el.textContent = message }, 100)
  }, debounceMs)
}
// While a modal <dialog> is open, call mountAnnouncer(dialog) so the regions aren't inert.
```

## Checklist
- [ ] Status changes without focus movement are announced (4.1.3).
- [ ] Live regions are in the DOM before their first message.
- [ ] One polite and one assertive announcer; components don't create their own.
- [ ] `assertive` / `alert` only for critical, time-sensitive problems.
- [ ] Typing-driven counts are debounced; repeated messages re-announce.
- [ ] Announcements work while a modal is open.
- [ ] Each announcement has a visible equivalent.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/TR/wai-aria-1.2/#aria-live
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://design-system.service.gov.uk/components/notification-banner/
- https://react-spectrum.adobe.com/react-aria/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-error-announcement.md (Apache-2.0, linked, not copied)
