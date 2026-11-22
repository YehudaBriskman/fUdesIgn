# Toasts and transient feedback

> A toast is for brief, non-blocking confirmation of something that already happened. Field corrections stay inline, consequential failures get a durable message, and a toast is never the only record of anything the user must act on.

**Category:** Overlays · **Applies to:** snackbars, toasts, "saved" confirmations, undo prompts, background-job notices · **Priority:** must

## When to use / when not
- Use for low-stakes confirmation ("Link copied"), undo after a reversible action, and completion of a background task.
- Not for form errors (inline, `fvalid-error-summary-and-focus.md`), blocking errors, anything with remedial steps, or legal and security notices.
- Persistent alerts and banners: `comp-notifications-alerts.md`.

## Rules (do)
- **Right channel:** inline for field errors; a persistent panel or banner for failures that need action; a toast for transient success or undo.
- **Truthful:** show success after the server confirms, or label the optimistic state (`prog-optimistic-ui-and-undo.md`). Never toast "Saved" before the request resolves.
- **Deduplicate and cap:** collapse identical messages (count them), show at most 3 visible, queue the rest.
- **Duration:** WCAG sets no toast minimum. This repo's heuristic: text-only 5–6 s, plus about 1 s per 20 words over 20; with an action at least 8 s; pause on hover, focus and while the tab is hidden. Errors do not auto-dismiss. A toast that times out can fall under WCAG 2.2.1 (Timing Adjustable, A), so a Dismiss control and pause are the practical route to turn off or extend.
- **Actions:** one action maximum ("Undo", "Retry"). Retry only where repeating is safe and not while a request is pending.
- **Reachable:** the toast region is in tab order after the content that triggered it, or the action is offered elsewhere too; a dismiss button is always present.
- **Placement:** consistent corner or edge; do not cover the control that triggered it or the primary action; respect safe areas on mobile and `prefers-reduced-motion`.
- **Copy actions.** Write "Copied" only after `await navigator.clipboard.writeText()` resolves; it rejects with `NotAllowedError` when writing is not allowed (no permission or no focus) and needs a secure context, so on rejection show an error and a select-the-text fallback. Announce through the polite region and leave focus where it is.

## Anti-patterns (don't)
- A toast as the sole message for a failed payment.
- A toast stack that grows without a cap on repeated events.
- Success toast before the mutation resolves.
- Auto-dismissing error with the retry button inside it.
- Colour as the only difference between success and error.
- Custom toast code with no queue, collision handling or announcement.

## Good references
- [WAI-ARIA, `status` role](https://www.w3.org/TR/wai-aria-1.2/#status) and [`alert` role](https://www.w3.org/TR/wai-aria-1.2/#alert) — polite versus assertive announcements.
- [WCAG 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) — why auto-dismissal needs an off switch.
- [Sonner](https://sonner.emilkowal.ski/) — a maintained toast library to compare behaviour against (stacking via `visibleToasts`, promise toasts); check its docs for current defaults.

## Bad references
- A "Failed to save" toast that disappears after four seconds while the form clears — the user lost both their data and the message.

## Accessibility
- Regions exist in the DOM before content is added: a persistent `role="status"` container (polite) for success and info, a separate persistent `role="alert"` container (assertive) only for errors (`aaria-live-regions-announcements.md`). WCAG 4.1.3 Status Messages.
- Do not move focus to a toast; keep the user's place.
- Text contrast 4.5:1, icon plus text, not colour alone.
- Keep text to the point: screen readers read it once.

## Motion / interaction (if relevant)
- Enter 200 ms ease-out from the nearest edge, exit 150 ms; with reduced motion, fade only.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Visible toasts | ≤ 3 | Stack cap |
| Text duration | 5–6 s (+1 s per 20 words over 20) | Auto-dismiss |
| Action duration | ≥ 8 s | Undo and Retry |
| Error duration | no auto-dismiss | Needs attention |
| Width | `min(24rem, 100vw - 2rem)` | Layout |

## Implementation sketch
```html
<div id="toasts-status" role="status" aria-atomic="false"></div>
<div id="toasts-alert" role="alert" aria-atomic="false"></div>
```
```ts
type Kind = 'info' | 'error'
const regions: Record<Kind, HTMLElement | null> = {
  info: document.querySelector<HTMLElement>('#toasts-status'),
  error: document.querySelector<HTMLElement>('#toasts-alert'),
}
const seen = new Map<string, { el: HTMLElement; count: number }>()

export function toast(message: string, kind: Kind = 'info', ms = 6000): void {
  const region = regions[kind]
  if (!region) return
  const prior = seen.get(message)
  if (prior) { prior.count += 1; prior.el.dataset.count = String(prior.count); return }

  const el = document.createElement('div')
  el.className = `toast toast-${kind}`
  el.textContent = message
  const close = Object.assign(document.createElement('button'), { type: 'button', textContent: 'Dismiss' })
  close.addEventListener('click', () => remove())
  el.append(close)
  region.append(el)
  seen.set(message, { el, count: 1 })

  let timer = kind === 'error' ? 0 : window.setTimeout(remove, ms)
  const pause = (): void => window.clearTimeout(timer)
  const resume = (): void => { if (kind !== 'error') timer = window.setTimeout(remove, ms) }
  el.addEventListener('pointerenter', pause)
  el.addEventListener('pointerleave', resume)
  el.addEventListener('focusin', pause)
  el.addEventListener('focusout', resume)
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else resume() })
  function remove(): void { window.clearTimeout(timer); seen.delete(message); el.remove() }
}
```

## Checklist
- [ ] Field errors are inline; failures needing action are persistent, not toasts.
- [ ] Success appears only after confirmation, or is labelled optimistic.
- [ ] Duplicates collapse; at most 3 visible; one action maximum.
- [ ] Timer pauses on hover, focus and hidden tab; errors never auto-dismiss.
- [ ] The live region exists before content is injected; focus is not stolen.
- [ ] Contrast, icon plus text, and reduced-motion fallback are checked.

## Sources
- https://www.w3.org/TR/wai-aria-1.2/#status
- https://www.w3.org/TR/wai-aria-1.2/#alert
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://sonner.emilkowal.ski/
- Source corpus: local `ui-behavior-component-intelligence` skill (toast contract); durations are this repo's heuristics, flagged above
- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
