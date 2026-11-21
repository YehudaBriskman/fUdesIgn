# Latency budgets and perceived performance for AI features

> Budget every AI interaction in phases: acknowledge the action in under 100 ms, show the first useful output (first token, first step or a specific status) within 1 s at p75, and turn anything that can run past 10 s into visible, cancellable progress that can continue in the background. Never let model latency block typing, scrolling or other work.

**Category:** AI foundations · **Applies to:** chat sends, streaming answers, inline suggestions, rewrite and summarise actions, agent runs, on-device model downloads · **Priority:** must

## When to use / when not
- Every AI request. The model is usually the slowest dependency on the page, so the budget is set by phase, not by total time.
- Loading treatments for non-AI data are in `prog-loading-states.md` and `prog-perceived-performance-thresholds.md`; this file adds the AI phases (queueing, time to first token, streaming rate, tool steps, model download).
- What to show while waiting is in `aichat-thinking-and-step-progress.md`; how to render the stream is in `aichat-streaming-text.md`.

## Rules (do)
- **Phase budgets (p75, measured in the field):**
  | Phase | Budget | What the user sees |
  |---|---|---|
  | Input acknowledged (send, accept, button press) | ≤ 100 ms | the user message in the thread, the pressed state, Send turns into Stop |
  | Time to first visible output (first token or first named step) | ≤ 1 s target, ≤ 2 s acceptable | text starts or a specific status ("Searching your files") |
  | Streaming rate | ≥ the reading rate, so the text never trails a reader | steady reveal, no bursts |
  | Inline suggestion (ghost text) | appears ≤ 300 ms after typing pauses, else dropped | nothing, or a suggestion that still matches the text |
  | Short transform (rewrite, summarise ≤ 1 paragraph) | ≤ 2 s total | a busy state on the control, then the result as a diff |
  | Anything that can exceed 10 s | named steps, elapsed time, Cancel; can run in the background | `aichat-thinking-and-step-progress.md` |
  The 0.1 s / 1 s / 10 s limits are NN/g's response-time limits (instant, flow of thought, limit of attention). INP must stay ≤ 200 ms at p75 while a stream renders (web.dev).
- **Rendering must not cost input latency.** Batch stream chunks into one DOM write per animation frame and append rather than re-parse (`aichat-streaming-text.md`). Typing in the composer while an answer streams must stay under the 200 ms INP budget.
- **Start work early when intent is clear.** Warm the session (or pre-fetch retrieval) when the user focuses the composer or opens the AI panel, not on Send (Chrome built-in AI guidance). Pre-download on-device models only after a user gesture, with determinate progress; never block the page on a model download.
- **Send less.** Trim prompts to what the task needs; latency grows with input size (Chrome built-in AI guidance). Retrieval that returns 50 chunks when 8 are used is a latency bug.
- **Cache identical requests.** Normalise the input (trim, lowercase where safe) and reuse results for repeated identical queries within a short TTL; offer "Regenerate" for a fresh answer.
- **Pick streaming vs batch by task.** Stream long prose and chat. Don't stream short structured output (a title, alt text, a classification, a JSON fill): show a busy state and swap in the complete result, because half a JSON object or half a label is useless.
- **Don't fake speed, and don't fake effort.** A typewriter effect slower than the network is a delay you added. Chrome's guidance notes users may trust near-instant results less; if a transform completes in under 150 ms, use a 150–240 ms transition on the result rather than a fake wait.
- **Queue position and server load.** When requests queue (> 2 s before work starts), say so ("Waiting for capacity · usually under 10 s") instead of showing a thinking animation.
- **Measure in the field:** time to first token, time to first visible paint of the answer, total generation time, stop-to-halt time, INP during streaming, and the rate of user Stops before the first token (a direct signal that the budget is blown).

## Anti-patterns (don't)
- A spinner for 8 s with no status, then a wall of text.
- Blocking the composer (disabled textarea) while the answer streams: users can't draft the follow-up.
- Re-rendering the whole message (markdown parse plus highlighting) on every token, so the tab drops frames and typing lags.
- Artificial typewriter pacing that is slower than the model.
- Starting a multi-hundred-MB model download on page load.
- Streaming a short JSON or label so the UI flickers through invalid states.

## Good references
- [NN/g, Response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/): 0.1 s, 1 s and 10 s; a percent-done indicator plus cancel past 10 s, and naming each item as it is processed when the total is unknown.
- [web.dev, INP](https://web.dev/articles/inp): 200 ms or less is good, over 500 ms poor, at p75.
- [Chrome, Render LLM responses](https://developer.chrome.com/docs/ai/render-llm-responses): append chunks instead of resetting `innerHTML`, which re-parses everything on each chunk.
- [Chrome, built-in AI dos and don'ts](https://developer.chrome.com/docs/ai/built-in-ai-dos-donts): warm up once intent is clear, trim input, stream long output and not short output, cache repeated tasks.

## Bad references
- A long blank wait followed by a long answer ([NN/g, Less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/)): users treated site chatbots like search boxes and found that streaming a long answer made overload worse; the answer should come first.
- The agent test in [NN/g's first look at a browsing agent](https://www.nngroup.com/articles/impressions-chatgpt-agent/): a form a person fills in about 2 minutes took the agent about 11, and a 10-minute hold window expired. Slow automation of a time-boxed task needs a handover, not just a progress bar.

## Accessibility
- Status text changes at phase boundaries only (queued → working → step names → done), announced politely; never announce every token or every second.
- Elapsed-time counters update visually each second but are not in a live region; announce only at milestones (for example every 30 s on long runs).
- A model download shows a `<progress>` with a value and a text percentage.

## Motion / interaction (if relevant)
- A busy state on the control that started a short transform (Rewrite, Summarise) appears only after the 200 ms show-delay (so fast results never flash a spinner) and, once shown, stays at least 400 ms: the same values as dashboard-ui's `prog-loading-states.md`. In a chat thread the status line waits 1 s, because the empty assistant slot already acknowledges the send (`aichat-thinking-and-step-progress.md`).
- Under `prefers-reduced-motion: reduce`, replace shimmer or pulsing with a static "Working…" label.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| acknowledge | ≤ 100 ms | user message rendered, Send → Stop |
| first output | ≤ 1 s target, ≤ 2 s acceptable (p75) | first token or named step |
| `--ai-busy-delay` | 200 ms | delay before a busy state on a control |
| `--ai-thinking-delay` | 1 s | delay before the chat status line |
| busy minimum | 400 ms | once shown |
| ghost text deadline | 300 ms after typing pauses | drop the suggestion after it |
| short transform | ≤ 2 s total | rewrite, summarise |
| long-run threshold | 10 s | steps, elapsed time, Cancel, background |
| INP while streaming | ≤ 200 ms p75 | composer typing, scrolling |
| result transition | 150–240 ms | instant results, instead of fake delay |

## Implementation sketch
```ts
// Field timing for one AI request: report the phases, not just the total.
type Phase = 'ack' | 'firstOutput' | 'done' | 'stopped';
type Timing = Partial<Record<Phase, number>> & { start: number; queued: boolean };

export function trackRequest(report: (t: Timing) => void) {
  const t: Timing = { start: performance.now(), queued: false };
  const mark = (p: Phase): void => { if (t[p] === undefined) t[p] = performance.now() - t.start; };
  return {
    acknowledged: () => mark('ack'),
    queued: () => { t.queued = true; },
    output: () => mark('firstOutput'),            // first token or first named step
    finish: (how: 'done' | 'stopped') => { mark(how); report(t); },
  };
}

// Show a busy state only if nothing arrives within 200 ms, and keep it at least 400 ms.
export function delayedBusy(show: () => void, hide: () => void, delay = 200, min = 400) {
  let shownAt = 0;
  const timer = setTimeout(() => { shownAt = performance.now(); show(); }, delay);
  return (): void => {
    clearTimeout(timer);
    if (!shownAt) return;
    const left = min - (performance.now() - shownAt);
    if (left > 0) setTimeout(hide, left); else hide();
  };
}
```

## Checklist
- [ ] Send is acknowledged in ≤ 100 ms (message in thread, Send → Stop).
- [ ] First token or named step in ≤ 1 s at p75 (≤ 2 s acceptable), measured in the field.
- [ ] Control busy states wait 200 ms (chat status lines 1 s) and stay ≥ 400 ms.
- [ ] Runs that can exceed 10 s show steps, elapsed time and Cancel, and can continue in the background.
- [ ] INP stays ≤ 200 ms while streaming; the composer is never disabled during a stream.
- [ ] Short structured outputs are not streamed; long prose is.
- [ ] Prompts are trimmed, identical requests are cached, sessions warm on intent.

## Sources
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
- https://web.dev/articles/inp
- https://web.dev/articles/cls
- https://developer.chrome.com/docs/ai/render-llm-responses
- https://developer.chrome.com/docs/ai/built-in-ai-dos-donts
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/summarizer.md (Apache-2.0)
