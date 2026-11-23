# Streaming text: cadence, announcements, no layout shift, Stop

> Append streamed tokens at most once per animation frame, never re-render the whole message per chunk, and keep everything above the growing answer still. Don't follow the stream with auto-scroll once the user has scrolled away. Announce the response to assistive technology once, when it is complete, not chunk by chunk. A Stop control replaces Send in the same place and halts rendering within 100 ms.

**Category:** Chat and conversation · **Applies to:** chat answers, streamed summaries, rewrites and translations, agent narration · **Priority:** must

## When to use / when not
- Stream when the output is long (more than about 2 lines) and the user is waiting for it: chat answers, summaries, drafts.
- Don't stream short outputs (alt text, a title, a label, a classification) or results the user isn't blocked on. Render them whole, with a short transition. Chrome's built-in AI guidance makes the same split.
- What to show before the first token is in `aichat-thinking-and-step-progress.md`. Markdown rendering and sanitising are in `aichat-markdown-code-tables.md`. How the turn sits in the thread while it streams: `aichat-layout-and-message-anatomy.md`.

## Rules (do)
**Render cadence**
- **Buffer chunks and flush once per frame** (`requestAnimationFrame`). Network chunks arrive in bursts. Writing on every chunk wastes layout work and makes text jitter.
- **Append, don't replace.** Add new text with `append()` or a streaming markdown parser that appends nodes. Setting `innerHTML` for every chunk re-parses everything so far (Chrome's render-LLM-responses guide). Setting `textContent` throws away all child nodes on each set.
- **Smooth bursts, but never lag.** You may reveal buffered text at a steady rate, but cap the reveal lag at about 300 ms behind what has arrived. Flush everything at once when the stream ends or is stopped. Never slow text below arrival speed to look like typing.
- **Sanitise the combined output, not each chunk.** An attack can be split across chunks. If the sanitiser removes anything, stop rendering rich output for that message.

**Announcements (`aria-live`)**
- Don't make the streaming node a live region that reads every append. Screen readers would read fragments, and polite announcements would queue up for minutes.
- **Approach A (Chrome built-in AI guidance):** the answer container is a polite live region present from page load, with `aria-busy="true"` while streaming and `"false"` at the end, so the whole response is read once. ARIA 1.2 only says assistive tech *may* ignore changes while busy. Support is inconsistent, and some screen readers say nothing when busy clears. Test it on your target pairs.
- **Approach B (belt and braces, this skill's default):** the streaming node is not live. A separate, visually hidden `role="status"` region, in the DOM from page load, announces three things:
  - "Assistant is responding" at the start;
  - nothing during the stream;
  - when it ends, the full plain text if it is 600 characters or fewer, otherwise "Response ready, about N words. Press Alt+↑ to read it." (the 600-character threshold is this skill's choice).
- **Never move focus while streaming** (Chrome built-in AI guidance). Focus stays in the composer.
- Errors at the end of a stream are announced through the same polite region with plain language (WCAG 3.3.1). `role="alert"` is only for urgent failures that lose data.

**No layout shift, scroll and reading**
- **Pin the new user turn to the top.** When the user sends, scroll their message to the top of the viewport. Give the assistant slot `min-block-size` set to the visible height of the thread minus that message, so the answer fills downward into space that already exists. Nothing moves while it streams, and the user starts reading at the first line.
- **No forced auto-scroll.** Follow the stream only while the bottom of the answer is in view and the user hasn't scrolled. Once they scroll up by more than 64px, stop following and show a "Jump to latest ↓" button. NN/g lists autoscroll during streaming as a site-chatbot failure.
- **Use browser scroll anchoring** (`overflow-anchor: auto`, the default) so content added above the viewport doesn't push what the user is reading. Some browsers support it only recently, so the pinning above is the fallback.
- **Reserve space for what appears at the end.** The action row (copy, regenerate, thumbs), sources and follow-ups render into reserved placeholders, or appear below the fold. They must not push the answer the user is reading. CLS counts shifts more than 500 ms after the last input, and a stream lasts far longer than that, so a CLS of 0.1 or less at p75 holds only if nothing above the answer moves.
- **Fixed widths.** The answer column has a fixed width, so wrapping doesn't reflow as text arrives. Code blocks and tables are scroll containers, so a long line never widens the column.

**Stop generating**
- **Stop replaces Send in the same position and size** while a response streams, labelled "Stop" (accessible name "Stop generating"). It is not a second button somewhere else.
- **Esc stops** when focus is in the composer or thread and nothing else (a menu, a dialog) would handle Esc.
- **Stop is instant on screen:** stop rendering within 100 ms, even if the server takes longer to cancel. Abort the request with an `AbortController`. Treat the resulting `AbortError` as expected, not as an error.
- **Keep the partial answer**, marked "Stopped" in `--type-meta`, with Regenerate and Continue available. Never discard what was generated.
- **Focus:** if Stop had focus when it turns back into Send, keep focus on that same button. If the stop control disappears, move focus to the composer (WCAG 2.4.3, Chrome built-in AI guidance).

## Anti-patterns (don't)
- `el.innerHTML = markdown(fullText)` on every chunk.
- Auto-scrolling to the bottom on every token while the user is trying to read the top.
- A thread container with `aria-live="polite"` and no busy handling, so a screen reader reads half-words for a minute.
- A stop button that appears somewhere else, or only after a delay, or that hides the partial answer.
- Fake typewriter delays that are slower than the model.
- Action rows, citations or a "Sources" panel popping in above the text as the stream ends.

## Good references
- [Chrome for Developers, Render LLM responses](https://developer.chrome.com/docs/ai/render-llm-responses): append rather than `innerHTML` or `textContent`, sanitise combined output, stop on sanitiser removals, use a streaming markdown parser.
- [Chrome, built-in AI dos and don'ts](https://developer.chrome.com/docs/ai/built-in-ai-dos-donts): stream long output, render short output whole, treat output as untrusted.
- The modern-web-guidance [Prompt API guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md) (Apache-2.0): polite live region present from load with `aria-busy` while streaming, abort with a signal, focus rules for the stop control.
- [NN/g, 10 guidelines for site AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/): don't autoscroll to the end of a streaming answer.

## Bad references
- Turo's and Mississippi's MISSI site chatbots, which autoscroll while streaming ([NN/g](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)): readers lose their place as the answer grows.
- Ask MISSI's long streamed answers ([NN/g, Less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/)): streaming a wall of text made overload worse.

## Accessibility
- One polite announcement per response (Approach B), from a region that exists before content is injected (MDN: create the live region first, then update it in a later task).
- `role="status"` is atomic by default; keep its text short apart from the ≤ 600-character full-text case.
- A keyboard shortcut moves to the latest response's heading (Alt+↑ in the sketch). Document it and allow it to be remapped.
- The "Stopped" and "Response ready" states are text, not only an icon change.
- Under `prefers-reduced-motion: reduce`, skip smooth reveal and append each frame's buffer as it arrives. The blinking caret becomes a static one.

## Motion / interaction (if relevant)
- A caret at the end of streaming text: 1px wide, `--text-muted`, blinking at 1 s if motion is allowed, static otherwise. It is removed when the stream ends.
- "Jump to latest" fades in over 150 ms. Clicking it scrolls with `behavior: 'smooth'`, or `'auto'` under reduced motion.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| DOM writes | ≤ 1 per animation frame | stream flush |
| `--ai-stream-lag-max` | 300ms | max reveal lag behind arrival |
| stop to visual halt | ≤ 100 ms | Stop / Esc |
| follow threshold | 64px from the bottom | keep following the stream |
| full-text announce cap | 600 characters | Approach B, longer = summary line |
| CLS | ≤ 0.1 at p75 | nothing above the answer moves |
| `--ai-caret-w` | 1px, blink 1 s | stream caret, static under reduced motion |
| `--ai-thread-measure` | 46rem | fixed answer width |

## Implementation sketch
```ts
type StreamUi = { target: HTMLElement; status: HTMLElement; stop: HTMLButtonElement; composer: HTMLTextAreaElement };

export async function streamInto(res: Response, ui: StreamUi, controller: AbortController): Promise<void> {
  if (!res.body) throw new Error('No response body');
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  let full = '';
  let frame = 0;
  const flush = (): void => { frame = 0; if (buffer) { ui.target.append(buffer); buffer = ''; } };

  ui.status.textContent = 'Assistant is responding';
  ui.target.setAttribute('aria-busy', 'true');
  const onEsc = (e: KeyboardEvent): void => { if (e.key === 'Escape') controller.abort(); };
  document.addEventListener('keydown', onEsc);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;
      full += value;
      if (!frame) frame = requestAnimationFrame(flush);
    }
    flush();
    const words = full.trim().split(/\s+/).length;
    ui.status.textContent = full.length <= 600 ? full : `Response ready, about ${words} words. Press Alt+Up to read it.`;
  } catch (e: unknown) {
    cancelAnimationFrame(frame);
    flush();
    if (e instanceof DOMException && e.name === 'AbortError') ui.status.textContent = 'Stopped. The partial response is kept.';
    else ui.status.textContent = 'The response failed. Your message is kept; you can retry.';
  } finally {
    document.removeEventListener('keydown', onEsc);
    ui.target.setAttribute('aria-busy', 'false');
    if (document.activeElement === ui.stop && ui.stop.hidden) ui.composer.focus();
  }
}

/** Follow the stream only while the user is near the bottom. */
export function shouldFollow(scroller: HTMLElement, threshold = 64): boolean {
  return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= threshold;
}
```
```css
.ai-thread { overflow-anchor: auto; }
.ai-msg[data-streaming] .ai-answer { min-block-size: var(--ai-slot-min, 50dvh); } /* set from JS: viewport minus the pinned user turn */
.ai-msg[data-streaming] .ai-answer::after { content: ""; display: inline-block; inline-size: 1px; block-size: 1em; background: var(--text-muted); vertical-align: text-bottom; }
@media (prefers-reduced-motion: no-preference) {
  .ai-msg[data-streaming] .ai-answer::after { animation: ai-caret 1s steps(1) infinite; }
}
@keyframes ai-caret { 50% { opacity: 0; } }
.visually-hidden { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
```

## Checklist
- [ ] At most one DOM write per frame, by appending; no `innerHTML` per chunk.
- [ ] The combined output is sanitised; rendering stops if the sanitiser removed anything.
- [ ] One polite announcement per response, from a region that exists at load; focus never moves while streaming.
- [ ] Nothing above the answer moves; the user's turn is pinned and the answer fills reserved space.
- [ ] No auto-follow after the user scrolls up 64px; "Jump to latest" appears.
- [ ] Stop replaces Send in place, Esc works, rendering halts within 100 ms, and the partial answer is kept as "Stopped".

## Sources
- https://developer.chrome.com/docs/ai/render-llm-responses
- https://developer.chrome.com/docs/ai/built-in-ai-dos-donts
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0)
- https://www.w3.org/TR/wai-aria-1.2/#aria-busy
- https://www.w3.org/TR/wai-aria-1.2/#status
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://a11ysupport.io/tech/aria/aria-busy_attribute (support table could not be loaded; treated as weak evidence)
- https://web.dev/articles/cls
- https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://github.com/thetarnav/streaming-markdown
