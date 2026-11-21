# Errors, refusals and rate limits

> Show every failure inline, in the slot where the answer would have been, and keep the user's prompt and any partial output. Name the cause in plain words and give the next step: Retry, a rephrase hint, a new chat, or an absolute time when the limit resets. A refusal says so in its first sentence and offers an alternative. It is never disguised as a technical error.

**Category:** Chat and conversation · **Applies to:** chat answers, inline AI actions, generators, agent runs, file uploads to an assistant · **Priority:** must

## When to use / when not
- Any model call that can fail, be blocked, be throttled or run out of context.
- Loading and slow states belong to `aichat-thinking-and-step-progress.md`; this file starts when the call has failed or been refused.
- An agent that is waiting for approval has not failed; see `aiagent-approval-and-audit.md`.

## Rules (do)
- **Never lose input.** On any failure the user's prompt stays in the thread, and the composer keeps any draft. Attachments stay attached. Partial streamed output stays visible, marked "Incomplete".
- **Inline, in the message slot.** The error replaces or follows the assistant message it belongs to, with an icon, a one-line cause and one primary action. A toast is never the only record (see `comp-notifications-alerts.md`).
- **One category, one message, one action:**

| Category | Say | Action |
|---|---|---|
| Network lost | "Connection lost. Your message is saved." | Retry; auto-retry once when back online |
| Server busy / 5xx / overloaded | "The assistant is busy. Trying again in 8 s." | Countdown, then auto-retry (max 3, exponential backoff); Retry now |
| Timeout mid-stream | "The answer stopped before it finished." | Continue / Retry, keep the partial text |
| Refusal / policy block | "I can't help with [topic category]." plus why in one clause | A rephrase hint or an allowed alternative |
| Context too long | "This chat is too long to continue." | New chat with a summary carried over |
| Rate or usage limit | "You've reached the limit of 40 messages per 3 hours. It resets at 14:30." | Reset time, what still works (a smaller model, drafts), upgrade if it exists |
| Attachment | "report.pdf is 34 MB; the limit is 20 MB." | Remove / compress, before upload where possible |

- **Absolute reset times.** Read `Retry-After` (seconds or an HTTP date) and show the local clock time ("Resets at 14:30"), plus a relative hint once ("in about 2 hours"). Don't run a per-second countdown for waits over 60 s.
- **Warn before the wall.** Show remaining quota at 80% used (this skill's threshold; "8 messages left until 14:30"), in the composer meta line, not a modal.
- **Refusals: first sentence, no lecture.** State the refusal in the first sentence, give one clause of reason by category (not the internal policy name), and offer what the assistant can do. NN/g's "less chat, more answer" study recommends saying up front when the bot can't help and offering an alternative. Keep the tone neutral and don't moralise (PAIR: be "human, not machine"; Apple: coach people toward a better result when a request is blocked).
- **Don't fake errors.** A policy block must not read "Something went wrong"; a model failure must not read as a refusal. Users retry fake errors endlessly and rephrase working prompts.
- **Over-refusal is an error too.** Give a "This shouldn't have been refused" feedback option on refusals (see `aichat-feedback-and-reporting.md`).
- **Long conversations degrade.** If quality drops past a length, cap or summarise visibly: say what happens ("Older messages are summarised to keep answers accurate") instead of silently truncating. Microsoft capped Bing Chat at 5 turns per session and 50 per day in February 2023 because long sessions confused the model, and prompted users to start a new topic at the cap.
- **Errors in the tool layer** (an agent step failed) show which step failed and what was already done; never roll back silently.

## Anti-patterns (don't)
- "Something went wrong." with no cause and no action.
- Clearing the composer or deleting the prompt on failure.
- A refusal that runs three paragraphs before saying no, or lectures the user.
- Rate limits shown only as an HTTP 429 or "Too many requests" with no reset time.
- A live countdown announced to screen readers every second.
- Retrying automatically forever, or retrying a non-idempotent agent action.

## Good references
- [NN/g, Less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/): if the bot can't help, say so in the first sentence and offer an alternative; a bad example buried the alternative in the second paragraph.
- [Google PAIR, Errors + graceful failure](https://pair.withgoogle.com/chapter/errors-failing/): distinguish user, system and context errors, weigh stakes, provide paths forward and return control to the user.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): when a request is blocked, help people get a better result; give specific status, not "Processing…".
- [MDN, Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After): seconds or an HTTP date; use it for 429 and 503.
- [Microsoft Bing blog, February 2023](https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat): turn caps (5 per session, 50 per day) with a prompt to start a new topic, an explicit limit instead of silent degradation.

## Bad references
- A file-size limit reported only after the upload finished ([NN/g, prompt controls](https://www.nngroup.com/articles/prompt-controls-genai/), Ernie example): the limit should be visible before the attempt.
- Wall-of-text site chatbot answers that hide the "can't help" ([NN/g, less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/), Ask MISSI example).

## Accessibility
- The error text is in the message's own content and announced through the thread's polite live region; use `role="alert"` only when the user's own action failed and they must act now (a send that didn't go through).
- Countdowns: a `role="status"` region updated at most every 10 s, or only at start and end ("Retrying in 8 seconds", then "Retrying now"). WCAG 4.1.3 covers waiting states; announcing every second floods the queue.
- Retry and other actions are real buttons; after a successful retry, focus stays where it was (usually the composer).
- Icons have text beside them; error colour is never the only cue.

## Motion / interaction (if relevant)
- No shake animation on errors. The error block appears with a 150 ms fade in place of the answer.
- Esc on a pending auto-retry cancels it.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-error-bg` / `--ai-error-fg` | `var(--danger-bg)` / `var(--danger-fg)` | inline error block |
| `--ai-warn-bg` / `--ai-warn-fg` | `var(--warning-bg)` / `var(--warning-fg)` | quota warnings, "Incomplete" label |
| auto-retry | max 3, backoff 2 s · 4 s · 8 s (+ jitter), idempotent calls only | busy / 5xx |
| quota warning | at 80% used (skill's choice) | composer meta line |
| countdown announcements | ≤ 1 per 10 s, or start and end only | `role="status"` |
| per-second countdown | only for waits ≤ 60 s; longer waits show a clock time | |

## Implementation sketch
```ts
type Failure =
  | { kind: 'network' }
  | { kind: 'busy'; retryInMs: number }
  | { kind: 'refusal'; category: string; alternative: string }
  | { kind: 'context' }
  | { kind: 'rate-limit'; limit: string; resetsAt: Date }
  | { kind: 'attachment'; name: string; reason: string };

export function retryAfterMs(header: string | null, now: number = Date.now()): number | null {
  if (!header) return null;
  const secs = Number(header);
  if (Number.isFinite(secs)) return Math.max(0, secs * 1000);
  const at = Date.parse(header);                       // HTTP-date form
  return Number.isNaN(at) ? null : Math.max(0, at - now);
}

export function classify(res: Response, body: { refusal?: { category: string; alternative: string } }): Failure | null {
  if (body.refusal) return { kind: 'refusal', ...body.refusal };
  if (res.status === 429) {
    const ms = retryAfterMs(res.headers.get('Retry-After')) ?? 60_000;
    return { kind: 'rate-limit', limit: res.headers.get('X-Limit-Description') ?? 'the usage limit', resetsAt: new Date(Date.now() + ms) };
  }
  if (res.status === 413) return { kind: 'context' };
  if (res.status >= 500) return { kind: 'busy', retryInMs: retryAfterMs(res.headers.get('Retry-After')) ?? 2000 };
  return null;
}

const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

export function message(f: Failure): { text: string; action: string } {
  switch (f.kind) {
    case 'network': return { text: 'Connection lost. Your message is saved.', action: 'Retry' };
    case 'busy': return { text: `The assistant is busy. Trying again in ${Math.ceil(f.retryInMs / 1000)} s.`, action: 'Retry now' };
    case 'refusal': return { text: `I can't help with ${f.category}. ${f.alternative}`, action: 'Edit message' };
    case 'context': return { text: 'This chat is too long to continue.', action: 'Start new chat with summary' };
    case 'rate-limit': return { text: `You've reached ${f.limit}. It resets at ${clock.format(f.resetsAt)}.`, action: 'OK' };
    case 'attachment': return { text: `${f.name}: ${f.reason}`, action: 'Remove file' };
  }
}
```

## Checklist
- [ ] The prompt, draft, attachments and partial output survive every failure.
- [ ] Errors appear inline in the answer slot with a cause and one action; no toast-only errors.
- [ ] Refusals say so in the first sentence, give a category-level reason and an alternative.
- [ ] Rate limits show an absolute reset time, and a warning appears at 80% of quota.
- [ ] Auto-retry is bounded (≤ 3, backoff) and only for idempotent calls.
- [ ] Countdowns are announced at most every 10 s via `role="status"`.

## Sources
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://pair.withgoogle.com/chapter/errors-failing/ (CC BY-NC-SA 4.0; paraphrased)
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G10 "Scope services when in doubt")
- https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0; error handling and stop as expected AbortError)
