# Thinking states and progress for agent steps

> Before the first token, show a specific status that changes with time: "Thinking" after 1 s, the elapsed time after 5 s, and the actual steps with a cancel control after 10 s. For multi-step and agent work, list each step with its state in text. When the work finishes, collapse the list into a one-line summary that can be reopened.

**Category:** Chat and conversation · **Applies to:** waits before the first token, reasoning models, retrieval and search, tool calls, agent runs, deep-research tasks, background jobs · **Priority:** must

## When to use / when not
- Every wait between Send and the first visible output, and every run that has more than one step (search, read, compute, act).
- Under 1 s to the first token, show nothing beyond the assistant slot itself (NN/g: no indicator under 1 s).
- Budgets and percentiles are in `aifound-latency-and-perceived-performance.md`. Approval prompts that interrupt a run are in `aiagent-approval-and-audit.md`.

## Rules (do)
**Escalation by elapsed time** (the 1 s and 10 s thresholds follow NN/g's 0.1 / 1 / 10 s response-time limits; the 5 s elapsed-time step is this skill's choice)
- **0–1 s:** the empty assistant slot (author line only) appears with the user's turn. No spinner yet.
- **≥ 1 s:** a status line in the slot: a small indicator plus specific text, "Thinking…" or better the current phase ("Searching your files…"). Apple's generative AI guidance asks for specific status instead of "Processing…".
- **≥ 5 s:** add elapsed time ("Thinking · 6 s"). Update it at most once per second visually, and don't announce it.
- **≥ 10 s:** show what is happening (the steps below) and a visible Stop or Cancel. NN/g: past 10 s, show progress and a clear way to cancel. If the amount of work is unknown, name each item as it is processed.
- **Over about 30 s** (deep research, long agent runs): let the user leave. The run continues in the background with a notification and a badge on the conversation when done, and a "Running" state in the history list. Never hold the user on a spinner for minutes.

**Steps**
- **One line per step**, as a verb phrase with an object: "Searched 12 sites", "Read invoice-2024-03.pdf", "Ran query on Orders". Use the present tense while running ("Searching…") and the past tense when done.
- **Five states, each with an icon and a text cue:** pending, running, done, failed and skipped. Also "waiting for you" when an approval is needed. Colour is only a third cue.
- **Determinate when the plan is known.** If the agent has a plan of N steps, show "Step 3 of 7" and a determinate `<progress>`. Never show a fake percentage. Indeterminate is fine when the length is unknown.
- **ETA only when reliable.** If remaining-time estimates historically miss by more than 50%, show elapsed time instead.
- **Collapse on completion.** When the answer starts streaming, collapse the step list into one summary line, such as "Searched 12 sites, read 4 · 34 s ▸", that expands in place. Keep the steps for review and audit (`aiagent-approval-and-audit.md`).
- **Reasoning text is optional and collapsed.** If you show a model's reasoning summary, keep it collapsed by default, labelled "Reasoning summary" (not first-person "My thoughts"), and visually secondary. NN/g warns that step-by-step reasoning displays are often rationalisations, not the real process. Don't present them as an explanation of the answer.
- **Failures are local.** A failed step shows the reason and what the agent did next (retried, skipped, stopped). One failed source does not fail the whole answer.
- **Stop at any time** takes effect before the next step starts. Steps already done stay listed as done.

## Anti-patterns (don't)
- Three bouncing dots with no text for 40 s.
- Rotating fake messages ("Consulting the archives…", "Reticulating splines…") that don't match the real work.
- A progress bar that crawls to 90% and stalls.
- Streaming raw chain-of-thought as the main content, or using first-person reasoning to sound human.
- Steps that disappear when done, so the user can't tell what was searched or changed.
- Blocking the whole app while a background research task runs.

## Good references
- [NN/g, Response times: the 3 important limits](https://www.nngroup.com/articles/response-times-3-important-limits/): 0.1 s instant, 1 s flow of thought, 10 s limit of attention. For unknown amounts of work, name each item as it is processed. Past 10 s, show percent done and a cancel option.
- [NN/g, Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/): no indicator under 1 s; spinners for one module; progress bars with estimates past 10 s.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): during generation, show specific status rather than a generic "Processing".
- [NN/g, Initial impressions of an AI agent](https://www.nngroup.com/articles/impressions-chatgpt-agent/): narrate progress, ask questions up front, get approval before acting.
- The modern-web-guidance [progress guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/progress.md) (Apache-2.0): native `<progress>` for determinate and indeterminate states.

## Bad references
- The first-person "Show thinking" display in Gemini 3 ([NN/g, Explainable AI](https://www.nngroup.com/articles/explainable-ai/)): human-like reasoning text that users may read as the real cause of the answer.
- An agent that changed a reservation time without asking and didn't narrate the change ([NN/g](https://www.nngroup.com/articles/impressions-chatgpt-agent/)): hidden steps hide consequential decisions.

## Accessibility
- The status line lives inside a `role="status"` region that is in the DOM from load. Announce phase changes ("Searching", "Reading 4 sources", "Writing answer"). Don't announce the elapsed-time counter: mark it `aria-hidden="true"` and expose it through the step list's text instead.
- The step list is an `<ol>`. Each step's state is in its text (for example "Done:" as visually hidden text), not only in the icon.
- `<progress>` has an accessible name ("Research progress") and a `value`/`max` when determinate.
- The collapsed summary is a `<details>`/`<summary>`, so it gets keyboard and screen-reader behaviour for free.
- Indicator animations stop under `prefers-reduced-motion: reduce`. The text status remains.

## Motion / interaction (if relevant)
- The indicator is a 3-dot or ring animation at 1–1.4 s per cycle, `--text-muted`, 16px, shown only from 1 s on.
- Steps appear with a 150 ms fade, with no list reordering. Collapse to summary takes 240 ms; under reduced motion it changes instantly.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-thinking-delay` | 1000ms | show the status line |
| elapsed time shown | from 5 s, 1 update/s, not announced | status line |
| steps and cancel | from 10 s | status line expands |
| background hand-off | about 30 s or more | notification and history badge |
| `--ai-step-dur` | `var(--motion-dur-short)` (150ms) | step fade-in |
| `--ai-indicator-size` | 16px | thinking indicator |
| ETA shown | only if past estimates erred ≤ 50% | otherwise elapsed |

## Implementation sketch
```tsx
import { useEffect, useState } from 'react';

type StepState = 'pending' | 'running' | 'done' | 'failed' | 'skipped' | 'waiting';
type Step = { id: string; label: string; state: StepState; detail?: string };

const STATE_TEXT: Record<StepState, string> = {
  pending: 'Pending', running: 'In progress', done: 'Done', failed: 'Failed', skipped: 'Skipped', waiting: 'Waiting for you',
};

function useElapsed(startedAt: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  return Math.floor((now - startedAt) / 1000);
}

export function RunStatus({ startedAt, phase, steps, total, finished, onStop }: {
  startedAt: number; phase: string; steps: Step[]; total: number | null; finished: boolean; onStop: () => void;
}) {
  const s = useElapsed(startedAt);
  if (finished) {
    const done = steps.filter((x) => x.state === 'done').length;
    return (
      <details className="ai-steps-summary">
        <summary>{done} steps · {s} s</summary>
        <StepList steps={steps} />
      </details>
    );
  }
  if (s < 1) return null;
  return (
    <div className="ai-run">
      <p role="status"><span className="ai-indicator" aria-hidden="true" />{phase}…</p>
      {s >= 5 && <span className="ai-meta" aria-hidden="true">{s} s</span>}
      {s >= 10 && (
        <>
          {total !== null && <progress aria-label="Progress" max={total} value={steps.filter((x) => x.state === 'done').length} />}
          <StepList steps={steps} />
          <button type="button" onClick={onStop}>Stop</button>
        </>
      )}
    </div>
  );
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="ai-steps">
      {steps.map((st) => (
        <li key={st.id} data-state={st.state}>
          <span className="visually-hidden">{STATE_TEXT[st.state]}: </span>{st.label}
          {st.detail && <span className="ai-meta"> · {st.detail}</span>}
        </li>
      ))}
    </ol>
  );
}
```
```css
.ai-steps { list-style: none; padding: 0; display: grid; gap: var(--space-1); font: var(--type-body); }
.ai-steps li::before { content: "○ "; content: "○ " / ""; color: var(--text-muted); }
.ai-steps li[data-state="done"]::before { content: "✓ "; content: "✓ " / ""; color: var(--success-fg); }
.ai-steps li[data-state="failed"]::before { content: "✕ "; content: "✕ " / ""; color: var(--danger-fg); }
.ai-steps li[data-state="running"] { font-weight: 600; }
.ai-indicator { display: inline-block; inline-size: var(--ai-indicator-size, 16px); block-size: var(--ai-indicator-size, 16px); margin-inline-end: var(--space-2); border-radius: 50%; border: 2px solid var(--border); border-block-start-color: var(--text-muted); vertical-align: middle; }
@media (prefers-reduced-motion: no-preference) {
  .ai-indicator { animation: ai-spin 1.2s linear infinite; }
  .ai-steps li { animation: ai-fade var(--ai-step-dur) var(--motion-ease-enter); }
}
@keyframes ai-spin { to { rotate: 1turn; } }
@keyframes ai-fade { from { opacity: 0; } }
```

## Checklist
- [ ] Nothing for the first second; specific status text from 1 s; elapsed time from 5 s; steps and Stop from 10 s.
- [ ] Every step is a verb phrase with its state in text; determinate progress only when the plan length is known.
- [ ] Runs over about 30 s can go to the background with a notification.
- [ ] Steps collapse into an expandable summary when the answer starts; they stay reviewable.
- [ ] Reasoning summaries are collapsed, labelled, and not first-person.
- [ ] Phase changes are announced politely; the seconds counter is not.

## Sources
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/explainable-ai/
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/progress.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md (Apache-2.0)
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.shapeof.ai/patterns/stream-of-thought (ideas only)
- https://www.shapeof.ai/patterns/action-plan (ideas only)
