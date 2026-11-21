# Submit buttons, submission states and double submit

> Keep the submit button enabled until a valid submit starts; then mark it busy on itself (same size, spinner + "Saving…", `aria-disabled`), ignore repeat clicks, send an idempotency key so the server can't do the work twice, and end in a clear success or an inline error that keeps every answer.

**Category:** Flows · **Applies to:** submit, pay, save, send and create buttons; any action that writes data · **Priority:** must

## When to use / when not
- Every form submit and every button that writes data.
- **Instant toggles** (switches, inline edits) don't need a busy button: they use optimistic UI with revert (`prog-optimistic-ui-and-undo.md`, dashboard-ui).
- **Destructive actions** (delete, cancel subscription) add a confirmation or, better, an undo window; see the decision table in SKILL.md.

## Rules (do)
- **Never disable submit before submitting.** A disabled button doesn't say what's missing, can't be focused (so screen-reader users can't find it) and fails people who filled the form in an order you didn't expect. Let them submit and show errors (GOV.UK button guidance; the modern-web-guidance forms guide says the same).
- **One primary button** per form, at the end of the column; a secondary action (Cancel, Back) is a link or a secondary button, never a destructive "Reset".
- **`<button type="submit">`** for the primary action; `type="button"` on every other button inside the form so Enter and clicks don't submit by accident.
- **Busy state on the button itself** (dashboard-ui non-negotiable 17):
  - Keep its width (set a `min-inline-size` from its idle width) so the layout doesn't jump.
  - Label changes to the progressive verb ("Saving…", "Paying £24.00…") with a spinner before it; or keep the label and add the spinner.
  - `aria-disabled="true"` (stays focusable, announced as dimmed), plus a guard in the submit handler. Use the real `disabled` attribute only if you also move focus and announce.
  - Show the busy state immediately (< 100 ms); if the request finishes in < ~300 ms, the flash is fine on a button (unlike page-level loaders).
- **Ignore repeat submits** with a flag on the form, not just CSS. GOV.UK's `data-prevent-double-click` ignores a second click within 1 s; an in-flight flag covers slow requests too.
- **Idempotency on the server**: generate a key per form render (hidden input or header `Idempotency-Key`), and make the server return the original result for a repeated key (Stripe's API model). This covers double-clicks, retries, back-button resubmits and flaky networks.
- **Post/Redirect/Get** for full-page forms: after a successful POST, redirect to a confirmation URL so refresh doesn't resubmit.
- **Outcome**:
  - Success: navigate to a confirmation page, or show an inline success message in a `role="status"` region and reset the button. Name what happened ("Invitation sent to a@b.com").
  - Failure: re-enable the button, keep every answer, show the error inline or in the summary (`fvalid-error-summary-and-focus.md`), and say whether anything was saved.
  - Timeout (> 10 s): keep the busy state with a message ("Still working… don't close this page"), never a silent spinner forever.
- **Money and legal submits** (WCAG 3.3.4): a review step, a confirm checkbox, or reversibility (cancel within N minutes). The button names the amount: "Pay £24.00".
- **Implicit submission**: Enter in a text field submits the form; don't break it. Make it IME-safe in custom key handlers (`event.isComposing`).
- **Unsaved changes**: warn on leaving a dirty form (`beforeunload` + in-app route guard), not on clean ones.

## Anti-patterns (don't)
- Submit disabled until the form is "valid".
- A button that turns into a spinner and shrinks to 40 px.
- Page-wide overlays blocking everything for a 300 ms save.
- No server-side idempotency: two orders from a double-tap on a slow phone.
- Clearing the form after a server error.
- "Reset" or "Clear form" next to "Submit".
- `<div onclick>` buttons; `<a href="#">` submitting forms.

## Good references
- [GOV.UK Design System — Button](https://design-system.service.gov.uk/components/button/) — avoid disabled buttons, prevent double clicks, start buttons and secondary buttons.
- [Stripe — Idempotent requests](https://docs.stripe.com/api/idempotent_requests) — the client key, server-side result replay and key lifetime (24 hours).
- [modern-web-guidance — Forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md) — don't disable submit to block validation; do block repeat posts after a valid submit; `type="button"` for helpers.
- [Atlassian — Button: loading](https://atlassian.design/components/button/usage) — the loading button keeps its size and label slot.
- [modern-web-guidance — IME-safe Enter submit](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md) — `isComposing` (and the 229 keyCode fallback) before treating Enter as submit.

## Bad references
- [Smashing — Usability pitfalls of disabled buttons](https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/) — examples of forms whose disabled submit gave no clue what was missing.
- Checkout buttons that show nothing for 3 s after the click; users click again and are charged twice.

## Accessibility
- Busy buttons use `aria-disabled="true"` so they stay in the tab order and announce state; the label change is announced because focus stays on the button. For long waits, also update a `role="status"` region.
- The success or failure result is announced (WCAG 4.1.3).
- Targets ≥ 24 px (44 px on touch); primary button height = field height (44–48 px).

## Motion / interaction (if relevant)
- Spinner rotates at ~1 turn per 800–1000 ms; under reduced motion, replace it with a static "…" or a pulsing opacity.
- No success confetti on money actions (dashboard-ui non-negotiable 29).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Button height | = `--field-h` (44px; 48px coarse) | Primary and secondary |
| Busy feedback | < 100ms after click | Button state |
| Double-click guard | in-flight flag + 1s debounce | Client |
| Idempotency key | 1 per form render, kept ≥ 24h server-side | Server |
| Timeout message | after 10s | Slow submits |

## Implementation sketch
```html
<form id="invite" action="/invites" method="post">
  <input type="hidden" name="idempotency_key" value="b2f1c0de-…">
  <!-- fields -->
  <button type="submit" class="btn-primary"><span class="spinner" aria-hidden="true"></span><span class="btn-label">Send invitation</span></button>
  <p role="status" class="visually-hidden"></p>
</form>
```
```css
.btn-primary { min-block-size: var(--field-h, 44px); padding-inline: var(--space-5, 24px); border: 0; border-radius: var(--radius-sm, 6px); background: var(--accent); color: var(--on-accent); font-weight: 600; display: inline-flex; align-items: center; gap: var(--space-2, 8px); }
.btn-primary .spinner { display: none; inline-size: 1em; block-size: 1em; border: 2px solid currentColor; border-inline-end-color: transparent; border-radius: 50%; }
.btn-primary[aria-disabled="true"] { opacity: 0.8; cursor: progress; }
.btn-primary[aria-disabled="true"] .spinner { display: inline-block; }
@media (prefers-reduced-motion: no-preference) { .btn-primary[aria-disabled="true"] .spinner { animation: spin 0.9s linear infinite; } }
@keyframes spin { to { rotate: 1turn; } }
```
```ts
// Busy state on the button, repeat-submit guard and an idempotency key per render.
export function wireSubmit(form: HTMLFormElement, send: (data: FormData) => Promise<Response>, busyLabel: string): void {
  let inFlight = false
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (inFlight || !form.checkValidity()) return
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    const label = btn?.querySelector('.btn-label')
    const idle = label?.textContent ?? ''
    const status = form.querySelector('[role="status"]')
    inFlight = true
    if (btn) { btn.style.minInlineSize = `${btn.offsetWidth}px`; btn.setAttribute('aria-disabled', 'true') }
    if (label) label.textContent = busyLabel
    const slow = setTimeout(() => { if (status) status.textContent = "Still working. Please don't close this page." }, 10_000)
    try {
      const res = await send(new FormData(form))
      if (status) status.textContent = res.ok ? 'Invitation sent' : 'We couldn’t send the invitation. Your answers are still here. Try again.'
    } catch {
      if (status) status.textContent = 'Connection lost. Your answers are still here. Try again.'
    } finally {
      clearTimeout(slow)
      inFlight = false
      btn?.removeAttribute('aria-disabled')
      if (label) label.textContent = idle
    }
  })
}
```

## Checklist
- [ ] Submit is enabled until a valid submit starts; errors are shown after submit, not prevented by disabling.
- [ ] Busy state appears on the button within 100 ms, keeps its width and uses `aria-disabled`.
- [ ] Repeat submits are ignored client-side and de-duplicated server-side with an idempotency key.
- [ ] Full-page forms use Post/Redirect/Get.
- [ ] Success names what happened; failure keeps answers and says what was saved.
- [ ] Money and legal submits have review, confirmation or undo, and the amount on the button.
- [ ] Non-submit buttons inside forms have `type="button"`.

## Sources
- https://design-system.service.gov.uk/components/button/
- https://docs.stripe.com/api/idempotent_requests
- https://atlassian.design/components/button/usage
- https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled
- https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
- https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/forms.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md
