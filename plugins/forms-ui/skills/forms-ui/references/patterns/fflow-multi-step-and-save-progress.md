# Multi-step forms, wizards and saving progress

> Split a long form into steps only when each step is a coherent group of questions; show where people are and how much is left, let them go back without losing answers, end with a "Check your answers" page, and save progress automatically so a timeout or closed tab never costs them their work.

**Category:** Flows · **Applies to:** applications, onboarding, checkout, claims, long settings and setup flows · **Priority:** should

## When to use / when not
| Form shape | Use |
|---|---|
| ≤ ~7 fields, one topic | One page |
| Many fields, sequential, some answers change later questions | Steps (one topic or one question per page) |
| Many independent sections done in any order, maybe over days | **Task list** (GOV.UK "Complete multiple tasks") with per-task status |
| Checkout | A few visible steps or an accordion; cut fields first (Baymard: most checkouts need about 8) |
| Answers that rarely change after setup | Steps for first run; a normal settings page afterwards |

- **Field count matters more than step count.** Baymard's checkout research found the number of fields users must handle affects completion more than the number of steps; split for clarity, not to hide length.
- **One thing per page** (GOV.UK) suits public services with infrequent, unfamiliar users. Expert, frequent users prefer fewer, denser pages.

## Rules (do)
- **Step indicator** for 3–7 steps: "Step 2 of 4: Delivery" as text, optionally a stepper. For branching flows where the total changes, show section names, not a count that jumps. Don't show progress bars that crawl to 90% and then reveal 5 more pages.
- **Back always works** and keeps answers: a "Back" link at the top-left of each step (GOV.UK back link), and the browser Back button restores the previous step (URL per step, or History API).
- **Validate per step** on "Continue"; never let people reach the end to discover an error from step 1.
- **Check your answers** before the final submit: every answer listed with a "Change" link that returns to that question and then back to the summary (GOV.UK pattern). Required by WCAG 3.3.4 for legal, financial and data-changing submissions unless reversible.
- **Don't ask again** (WCAG 3.3.7): carry earlier answers forward; offer "same as" choices; pre-fill from the account.
- **Save progress automatically**:
  - Server-side draft saved on each "Continue" (and debounced on change for long steps, every ~2–5 s idle). Show a quiet "Saved" state with time, not a toast.
  - For anonymous flows, also keep a local draft (`sessionStorage` or `localStorage`) keyed by form and version, and restore with a visible "We restored your answers from 10:42. Start again" note. Never store passwords, card numbers or one-time codes locally.
  - Long flows offer explicit "Save and come back later", which explains how to return (sign in, or an emailed link).
  - Drafts expire on a stated schedule ("We'll keep your answers for 28 days").
- **Timeouts**: warn ≥ 2 minutes before a session times out with a dialog offering "Stay signed in" (WCAG 2.2.1 needs at least 20 s to respond); keep the draft so re-authenticating returns people to the same step with answers intact (2.2.5).
- **Final step button** names the commitment ("Submit application", "Pay £24.00"), not "Continue".
- **Confirmation** says what happened, the reference and what's next (`ffound-form-microcopy.md`).
- **Focus on step change**: move focus to the new step's `<h1>` (or the error summary if there are errors) and update `document.title` ("Delivery – Step 2 of 4 – Checkout").

## Anti-patterns (don't)
- Wizards that break one coherent topic into 10 one-field steps for an expert audience.
- Back buttons that clear the step, or browser Back leaving the flow.
- Progress indicators that lie about the remaining length.
- Losing everything on session timeout, a refresh or a failed final submit.
- A disabled "Next" until the step is valid.
- Stepper tabs that let people jump forward past unanswered required steps without telling them.

## Good references
- [GOV.UK Design System — Check answers](https://design-system.service.gov.uk/patterns/check-answers/) — summary list with Change links that return to the summary.
- [GOV.UK Design System — Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/) — task list with statuses for long, non-linear forms.
- [GOV.UK Design System — Question pages](https://design-system.service.gov.uk/patterns/question-pages/) — one thing per page, back link, Continue.
- [NN/g — Wizards: definition and design recommendations](https://www.nngroup.com/articles/wizards/) — when wizards help, and showing steps.
- [W3C WAI — Multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/) — step indication in title and heading.

## Bad references
- [NN/g — Wizards](https://www.nngroup.com/articles/wizards/) — its examples of wizards used for tasks frequent users do daily, where one page would be faster.
- Insurance quote flows that log people out after 15 minutes idle with no warning and no draft.

## Accessibility
- Step position in the `<h1>` or a caption, and in `document.title`.
- Focus moves to the new step's heading on change.
- Timeout warnings are a modal `<dialog>` with an accessible name and a button to extend (WCAG 2.2.1).
- Steppers are lists of links or plain text, not tabs (they don't switch views of one panel).

## Motion / interaction (if relevant)
- Step changes are page-like: a quick fade (≤ 150 ms) or none. No sideways slides under reduced motion; avoid them generally for forms.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Steps shown as count | 3–7 | Step indicator |
| Autosave idle delay | 2–5s | Long steps |
| Timeout warning | ≥ 2 min before expiry | Session |
| Draft retention | stated, e.g. 28 days | Saved progress |
| "Saved" indicator | `--text-muted` + time, `role="status"` | Autosave |

## Implementation sketch
```html
<nav aria-label="Back"><a class="back-link" href="/apply/contact">Back</a></nav>
<p class="caption">Step 2 of 4</p>
<h1 tabindex="-1">Delivery address</h1>
<p class="save-state" role="status">Saved at 10:42</p>
```
```ts
// Local draft: debounced save, versioned restore, never for secret fields.
const SECRET = /password|cc-|one-time-code/

export function wireDraft(form: HTMLFormElement, key: string, version: number, onRestore: (savedAt: Date) => void): void {
  const storeKey = `draft:${key}:v${version}`
  try {
    const raw = localStorage.getItem(storeKey)
    if (raw) {
      const saved: unknown = JSON.parse(raw)
      if (typeof saved === 'object' && saved !== null && 'at' in saved && 'values' in saved && typeof saved.values === 'object' && saved.values !== null) {
        for (const [name, value] of Object.entries(saved.values)) {
          const el = form.elements.namedItem(name)
          if (el instanceof HTMLInputElement && el.type !== 'checkbox' && el.type !== 'radio' && typeof value === 'string') el.value = value
          if (el instanceof HTMLTextAreaElement && typeof value === 'string') el.value = value
        }
        onRestore(new Date(String(saved.at)))
      }
    }
  } catch { /* storage unavailable: drafts are a convenience only */ }

  let timer = 0
  form.addEventListener('input', () => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      const values: Record<string, string> = {}
      for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')) {
        if (el.type === 'password' || el.type === 'file' || SECRET.test(el.autocomplete)) continue
        if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) continue
        values[el.name] = el.value
      }
      try { localStorage.setItem(storeKey, JSON.stringify({ at: new Date().toISOString(), values })) } catch { /* quota or private mode */ }
    }, 2000)
  })
  form.addEventListener('submit', () => { try { localStorage.removeItem(storeKey) } catch { /* ignore */ } })
}
```

## Checklist
- [ ] Steps are used only where they group coherent questions; the count or sections are visible.
- [ ] Back (link and browser) keeps answers; each step validates on Continue.
- [ ] A check-answers page with Change links precedes the final submit.
- [ ] Progress saves automatically; restored drafts are announced with a "Start again" option.
- [ ] No secrets are stored locally; drafts expire on a stated schedule.
- [ ] Timeouts warn in time, can be extended and don't lose data.
- [ ] Focus and `document.title` update on each step.

## Sources
- https://design-system.service.gov.uk/patterns/check-answers/
- https://design-system.service.gov.uk/patterns/complete-multiple-tasks/
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/components/back-link/
- https://www.nngroup.com/articles/wizards/
- https://www.w3.org/WAI/tutorials/forms/multi-page/
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html
- https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
