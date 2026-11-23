# Notifications, inline alerts and banners

> Match intrusiveness to urgency and place the message next to its cause. Errors and anything requiring action persist inline until resolved. Toasts are a last resort for low-stakes, recoverable confirmations, and are never the only record.

**Category:** Components and interaction · **Applies to:** save and job results, data-freshness warnings, failed queries in widgets, system outages, form errors, background job completion, notification centre · **Priority:** must

## When to use / when not
| Message | Component | Persistence |
|---|---|---|
| Action result already visible in the UI (row added, value changed) | **Nothing extra**, or a subtle inline "Saved" by the control | auto, ~2s |
| Field-level problem | **Inline validation** under the field (see `comp-inline-edit-and-forms.md`) | until fixed |
| A widget's data failed, is stale or is partial | **Inline alert inside the card** ("Data delayed — last updated 14:02 · Retry") | until resolved |
| Page-wide state affecting this view (filters exclude 40% of data, a read-only snapshot, a delayed data source) | **Page-level inline alert** under the page header | until resolved or dismissed |
| Service-wide issue unrelated to the current task (outage, maintenance, billing) | **Site banner** above the shell, max 1 | until resolved or dismissed for the session |
| Urgent, blocking decision (session expiring, unsaved changes) | **Modal dialog** (see `comp-overlay-choice.md`) | until answered |
| Background job finished while the user is elsewhere (export ready, model recomputed) | **Notification centre** entry + badge; optionally a persistent toast with a link that also lives in the centre | until read |
| Low-importance confirmation with undo ("Scenario archived · Undo") | **Toast**, but Undo must also be reachable elsewhere (e.g. an Archived view) | 8 s (10 s bulk), paused on hover, focus and hidden tab; prefer persistent |

- NN/g: choose by information type, urgency and whether action is needed; never use transient toasts for errors.
- Primer goes further: "Toasts pose significant accessibility concerns and are not recommended." Use banners for errors and dialogs for interruptions.
- Carbon keeps toasts but makes them persistent by default (auto-dismiss after 5 s is opt-in), places them top-right, and limits toast and inline messages to 2 lines.

## Rules (do)
- **4 statuses, each with icon + colour + title text:** Info, Success, Warning, Error. Never use colour alone (see `color-semantic-status.md`). Use the same heading word for the same status across the product (GOV.UK).
- **Content.**
  - Title ≤ ~60 characters, no trailing period, saying what happened.
  - Body of 1–2 sentences that doesn't repeat the title.
  - Errors *must* tell the user what to do next (Carbon: "User actions are mandatory for error messages"). Example: title "Couldn't load Q3 filings", body "SEC EDGAR didn't respond. Your other data is unaffected.", action "Retry".
- **Proximity.**
  - Put the message where the problem is: in the failing card, under the field, at the bottom of the form just above the submit and cancel buttons for form-level errors (Carbon).
  - Don't put widget errors in a global toast. Primer cites the broken gestalt proximity, because users can't connect the message to its cause.
- **One action max** per alert, labelled with 1–2 words ("Retry", "View details"), plus optional dismiss.
- **Dismissal.**
  - Errors and warnings that still apply aren't dismissible, or come back on reload while the condition persists.
  - Info and success can be dismissed with an × that has the accessible name "Dismiss".
  - Callouts that explain a permanent condition have no ×.
- **Count.**
  - ≤1 site banner.
  - ≤1 page-level alert. Combine related messages or show the highest priority (GOV.UK: one notification banner per page).
  - Toasts stack at most 3, then collapse to "+N more" linking to the notification centre.
- **Toasts, if used at all.**
  - Use `popover="manual"` in one fixed region (Carbon uses top-right; bottom-inline-end is also common, but Primer notes it covers submit buttons), with the newest nearest the edge.
  - The region is a named `role="region"` ("Notifications").
  - Announce via `document.ariaNotify()` (Baseline newly available since September 2026: Chrome 141, Firefox 150, Safari 27) and fall back to a polite live region that existed at page load, as the sketch does.
  - Don't steal focus.
  - Pause auto-dismiss while hovered or focused. Prefer persistence for anything with an action.
  - Never show toasts while a modal is open; queue them until it closes. A popover opened outside the modal is inert to assistive tech while the modal is up (Scott O'Hara).
  - Keep a history (notification centre) so a missed toast is recoverable. Invites and access changes also need a recipient and an audit entry: `comp-sharing-and-permissions.md`.
- **Data-freshness alerts** are first-class in dashboards. Every widget can enter `stale`, `partial`, `error` or `empty` states with an inline message and a timestamp ("As of Nov 20, 16:00 ET"). Don't silently render stale numbers.
- **Live region urgency.**
  - `assertive` / `role="alert"` only for critical, time-sensitive events (session timeout, data loss, connection lost).
  - `polite` / `role="status"` for everything else.
  - Don't announce "Loading…" interstitials. Use `<progress>` or `aria-busy` on the region instead.

## Anti-patterns (don't)
- Error toasts that vanish after 3–5 s ("Something went wrong").
- Toasts as the only path to Undo or "View export". Scott O'Hara and Primer both rule this out.
- Toasts on routine success where the result is already visible. They teach users to ignore all toasts (banner blindness).
- A stack of 4 banners at the top of the page pushing the dashboard below the fold.
- Callouts used as post-action feedback, or with action buttons (Carbon).
- Generic messages: "Error", "Oops!", "Field is blank" (NN/g).
- Global toasts for an error in one chart among twelve. The user can't find which chart failed.
- `role="alert"` on routine messages, which interrupts screen reader speech for nothing.
- A notification banner *and* an error summary on the same page (GOV.UK: show only the error summary).

## Good references
- [IBM Carbon — Notifications](https://carbondesignsystem.com/components/notification/usage/) — a clear taxonomy (inline, toast, actionable, callout), a status table, a 2-line limit, errors that require an action, persistent-by-default toasts, form-level errors placed above the submit button, and one action per notification.
- [Primer — Accessible notifications and messages](https://primer.style/accessibility/toasts/) — "Toasts pose significant accessibility concerns and are not recommended for use", mapped to 8 WCAG SCs (2.2.1, 1.3.2, 2.1.1, 4.1.3, 1.4.4, 1.4.10, 2.4.3, 3.2.4), with a replacement for each scenario.
- [GOV.UK — Notification banner](https://design-system.service.gov.uk/components/notification-banner/) — one per page, placed before the H1, `role="region"` by default and `role="alert"` only for the success-after-action variant, and not used for validation.
- [NN/g — Indicators, validations, notifications](https://www.nngroup.com/articles/indicators-validations-notifications/) — contextual vs global and passive vs action-required, and a toast is "a bad way to implement an error message, be it validation or otherwise".
- [Grafana](https://grafana.com) / [Datadog](https://www.datadoghq.com) (products) — panel-level error and "no data" states render *inside* the affected panel with the query error on hover, so one failure doesn't block the dashboard.

## Bad references
- [Scott O'Hara — A toast to a11y toasts](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html) — common failures: an "Undo" announced as plain text with no role, pause-on-hover that doesn't work for screen reader virtual cursors, and focus lost after Undo.
- [Primer — toasts](https://primer.style/accessibility/toasts/) — toasts in bottom corners covering submit buttons, toasts that fall outside a screen magnifier's window, and toasts that appear far from the cursor on large displays.
- [W3C WAI-IG thread on auto-dismissing toasts](https://lists.w3.org/Archives/Public/w3c-wai-ig/2025AprJun/0076.html) (June 2025) — practitioners disagree on whether timed toasts violate WCAG 2.2.1, and Adrian Roselli argues they do. That uncertainty is itself a reason not to rely on them.

## Accessibility
- Inline alerts present on load don't need a live region. Alerts injected later go into a container that existed at load time, with `role="status"` (polite) or `role="alert"` (critical only).
- Banners use `role="region"` plus `aria-labelledby` pointing at their title, so they're navigable.
- When a submit fails, move focus to the error summary heading or the first invalid field. Don't just announce.
- Toast region requirements: content reflows at 320×256 CSS px (1.4.10), text survives 200% resize (1.4.4), the dismiss button is keyboard reachable without auto-focus, and focus moves to the next toast or the trigger when the focused toast closes.
- Icons in alerts have text alternatives ("Error:"), or the title word carries the status.

## Motion / interaction (if relevant)
- Inline alerts appear without motion, or with a fade of `--motion-dur-short` (150 ms) or less. Never slide content down abruptly under the pointer. Reserve space if an alert is likely to appear (e.g. a stale-data slot in the card header).
- Toasts enter with translate + opacity from the edge over `--motion-dur-medium` (240 ms, `--motion-ease-enter`) and exit at 0.75× the enter (about 180 ms, `--motion-ease-exit`; motion-ui's `mfound-durations-and-easing.md`). Under reduced motion, use opacity only; never a global `0.01ms` reset.
- Auto-dismiss, if used: at least 6 s (Carbon's optional timeout is 5 s; the extra second is a house margin for reading), paused on hover and focus. Pausing doesn't help screen reader users in browse mode (Scott O'Hara), which is why persistent is the default.

## Tokens and values
| Token | Default |
|---|---|
| Inline alert padding / radius | 12px 16px / 8px; 3–4px status border on inline-start |
| Icon | 16–20px, status colour, with text alternative |
| Title / body | 14px 600 / 14px 400, max 2 lines each (toast/inline) |
| Banner height | ≥40px; full width above shell |
| Toast width / offset | 360–420px / 16–24px from edges; gap 8px; max 3 visible |
| Toast auto-dismiss | off by default; if on: ≥ 6 s plain, 8 s (10 s bulk) with Undo, never for errors; paused on hover, focus and hidden tab |
| Colour roles (tokens.css) | `--info-bg`/`--info-fg`, `--success-*`, `--warning-*`, `--danger-*`; border = the `-fg` token; text ≥4.5:1 on its bg; border ≥3:1 |
| Live regions | `polite` default; `assertive` only for critical |

## Implementation sketch
```html
<!-- In a card: inline, persistent, actionable -->
<section class="card" aria-labelledby="rev-title">
  <h2 id="rev-title">Revenue by segment</h2>
  <div class="alert alert--warning" role="status">
    <svg aria-hidden="true" class="alert__icon"></svg>
    <p class="alert__title"><span class="visually-hidden">Warning:</span> Data delayed</p>
    <p class="alert__body">Last updated Nov 20, 16:00 ET. Q4 guidance not yet included.</p>
    <button type="button" class="btn btn--sm btn--ghost">Retry</button>
  </div>
</section>

<!-- One toast region, created at load -->
<div role="region" aria-label="Notifications" class="toast-region"></div>
```
```css
.alert { display: grid; grid-template-columns: 20px 1fr auto; gap: 4px 12px; padding: 12px 16px; border-radius: 8px;
  border: 1px solid var(--warning-fg); border-inline-start-width: 4px; background: var(--warning-bg); color: var(--warning-fg); }
.alert__icon { grid-row: span 2; }
.toast-region { position: fixed; inset: auto 16px 16px auto; display: grid; gap: 8px; inline-size: min(400px, calc(100vw - 32px)); }
.toast[popover] { position: static; margin: 0; inset: auto; }
@media (prefers-reduced-motion: no-preference) {
  .toast[popover] {
    transition: opacity var(--motion-dur-medium, 240ms) var(--motion-ease-enter, ease-out),
      translate var(--motion-dur-medium, 240ms) var(--motion-ease-enter, ease-out),
      display var(--motion-dur-medium, 240ms), overlay var(--motion-dur-medium, 240ms);
    transition-behavior: allow-discrete;
  }
  @starting-style { .toast[popover]:popover-open { opacity: 0; translate: 0 8px; } }
}
```
```ts
type ToastInput = { title: string; actionLabel?: string; onAction?: () => void };

export function showToast(region: HTMLElement, t: ToastInput, modalOpen: () => boolean): void {
  if (modalOpen()) { setTimeout(() => showToast(region, t, modalOpen), 500); return; } // defer until the modal closes
  const el = document.createElement('div');
  el.setAttribute('popover', 'manual');
  el.className = 'toast';
  el.textContent = t.title;
  region.append(el);
  el.showPopover();
  const msg = t.actionLabel ? `${t.title}. Actions available` : t.title;
  if (typeof document.ariaNotify === 'function') document.ariaNotify(msg);
  else document.querySelector('#sr-status')?.replaceChildren(msg); // polite live region present since load
}
declare global { interface Document { ariaNotify?: (message: string) => void } }
```

## Checklist
- [ ] Each message uses the least intrusive component that fits its urgency and scope (see the table).
- [ ] Errors persist, sit next to their cause and include a next step or action.
- [ ] There is ≤1 site banner and ≤1 page alert. Toasts are capped at 3 and logged in a notification centre.
- [ ] No action exists only inside a toast. No toasts appear while a modal is open.
- [ ] Every status uses icon + text + colour. Text ≥4.5:1, borders ≥3:1.
- [ ] Live regions exist at load, are polite by default, and use assertive only for critical events.
- [ ] Widgets have explicit stale, partial, error and empty states with timestamps.

## Sources
- https://carbondesignsystem.com/components/notification/usage/
- https://primer.style/accessibility/toasts/
- https://design-system.service.gov.uk/components/notification-banner/
- https://www.nngroup.com/articles/indicators-validations-notifications/
- https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html
- https://lists.w3.org/Archives/Public/w3c-wai-ig/2025AprJun/0076.html
- https://adrianroselli.com/2020/01/defining-toast-messages.html (status/log roles; timed toasts conflict with 2.2.1)
- https://developer.mozilla.org/en-US/docs/Web/API/Document/ariaNotify
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
