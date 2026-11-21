# Markdown, code blocks, tables and copy in responses

> Treat model output as untrusted user-generated content. Parse markdown incrementally, sanitise the combined result, allow only a small set of elements, and never load remote images or run anything. Render code blocks and tables as labelled scroll regions with their own copy action. Copying a whole response puts both plain text and rich HTML on the clipboard.

**Category:** Chat and conversation · **Applies to:** chat answers, generated documents, explanations, code assistants, data answers with tables · **Priority:** must

## When to use / when not
- Every place model output is rendered as anything richer than plain text.
- Short single-line outputs (labels, titles) are plain text: no markdown parsing at all.
- Streaming cadence is in `aichat-streaming-text.md`. Accessibility of the resulting structure is in `aifound-accessible-generated-content.md`.

## Rules (do)
**Safety**
- **Sanitise the full combined output, not chunks.** Use the HTML Sanitizer API where supported, otherwise DOMPurify, with an allow-list. If the sanitiser removes anything, stop rich rendering for that message and fall back to plain text (Chrome render-LLM-responses guidance).
- **Allow-list, not block-list:** `p, h1–h6 (demoted), ul, ol, li, strong, em, code, pre, blockquote, table, thead, tbody, tr, th, td, a, hr, br, del, sup`. No `script`, `style`, `iframe`, `form`, `input`, event-handler attributes, `style` attributes or SVG.
- **No remote images by default.** A markdown image whose URL is controlled by injected text can leak conversation data in its query string the moment it loads (prompt-injection exfiltration; OWASP lists improper output handling as LLM05:2025). Render images only from your own origin or an allow-listed CDN. Otherwise show a link labelled with the domain.
- **Links show their destination.** Show the domain after external links ("vendor docs ↗ example.com"). Set `rel="noopener noreferrer nofollow ugc"` and `target="_blank"` with a visible "opens in a new tab" cue. Disallow `javascript:`, `data:` and `vbscript:` URLs. Mark links that differ from their text (`[bank.com](evil.example)`) with the real domain.
- **Nothing executes.** Generated code is displayed, never evaluated. "Run" actions go through the approval flow in `aiagent-approval-and-audit.md`.

**Rendering**
- **Use a streaming parser** that appends nodes as tokens arrive. An unclosed code fence renders as a code block immediately, not as raw backticks that later reflow.
- **Demote headings:** the model's `#` becomes the level below the turn heading (h4 under an h3 turn). Cap at h5.
- **Typography:** body 0.9375–1rem/1.6 in the 46rem column. Lists get 4–8px item spacing. Paragraphs get 12px spacing. Inline code uses `--font-mono` at 0.875em on `--surface-2`.
- **Answer first.** Very long, heavily formatted answers are a smell (NN/g: polish creates a halo effect and long answers overload). Prefer short answers with follow-ups over five H2 sections.

**Code blocks**
- A header bar shows the **language label** (text) and a **Copy** button that is always visible: never hover-only, since touch has no hover. The button is ≥ 24×24 px and named "Copy Python code" (modern-web-guidance copy-button guide: name what is copied).
- On success, show "Copied" in a `role="status"` bubble next to the button for 2 s. The button keeps its size.
- `overflow-x: auto`, no wrapping by default, and a "Wrap lines" toggle for long lines. `tab-size: 2`.
- Over 30 lines: cap the height at about 24 lines with an "Expand" control, but copy always copies the full block.
- Syntax highlighting runs when the fence closes, or incrementally per line. It never re-highlights the whole block on every token.
- If the block is scrollable it is focusable (`tabindex="0"`) and named (`role="region"`, `aria-label="Python code"`), so keyboard users can scroll it (WCAG 2.1.1).

**Tables**
- Wrap every table in a scroll region (`role="region"`, `aria-label="Table: <caption or first header>"`, `tabindex="0"`). Tables never widen the column.
- Real `<th scope="col">` headers. Numeric columns are right-aligned with `tabular-nums` (dashboard-ui `found-typography-for-data.md`). Use a sticky header if the table is taller than the viewport.
- Table actions: "Copy as CSV" (or TSV for spreadsheet paste) and "Download CSV". A generated table of figures gets the computed-figures warning from `aifound-uncertainty-and-disclaimers.md`.

**Copy response**
- "Copy" on the action row copies both `text/plain` (markdown source) and `text/html` (sanitised rendering) through `ClipboardItem`, so pasting into a document keeps the formatting and pasting into an editor keeps the markdown.
- Copy strips UI-only text (citation chips become `[1]` with a source list at the end, "Copied" labels are excluded).

## Anti-patterns (don't)
- `innerHTML = marked(output)` with no sanitiser.
- Auto-loading markdown images from any URL.
- Copy buttons that only appear on hover, or that change width when they say "Copied".
- Code blocks that wrap mid-identifier, or that widen the chat column.
- Tables with no headers, or tables flattened into pipes and dashes because the renderer gave up mid-stream.
- Headings from the model that outrank the page's own headings (an h1 inside an answer).

## Good references
- [Chrome for Developers, Render LLM responses](https://developer.chrome.com/docs/ai/render-llm-responses): sanitise the combined output, stop when the sanitiser removed something, use a streaming markdown parser.
- [Chrome, built-in AI dos and don'ts](https://developer.chrome.com/docs/ai/built-in-ai-dos-donts): use the Sanitizer API where supported and treat all output as untrusted.
- The modern-web-guidance [copy-button guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/copy-button.md) (Apache-2.0): name the copied content, put a `role="status"` confirmation outside the button, minimum 24×24 px target.
- [OWASP Top 10 for LLM applications, LLM05:2025 Improper Output Handling](https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/): treat model output as untrusted before passing it to browsers or interpreters.
- [streaming-markdown](https://github.com/thetarnav/streaming-markdown): an append-only parser built for token streams.

## Bad references
- [NN/g, AI chatbots discourage error checking](https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/): polished formatting makes drafts look finished, so rich rendering without sources lowers verification.
- [NN/g, Less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/): long, heavily structured site-bot answers where the useful part is buried.

## Accessibility
- Generated structure is real HTML (headings, lists, tables with `th`), so screen-reader navigation by heading and table works (`aifound-accessible-generated-content.md`).
- Scrollable code and table regions are focusable and named.
- The copy confirmation is announced politely, and focus stays on the button.
- Language labels on code blocks are text, not only a coloured logo.
- Syntax colours meet 4.5:1 against the code background in both themes. Colour is never the only carrier of meaning in diffs (use +/− markers).

## Motion / interaction (if relevant)
- "Copied" fades in over 100 ms and out after 2 s. Under reduced motion it appears and disappears without the fade.
- "Expand" on long code blocks changes height instantly or within 150 ms. Never animate the height of a 200-line block.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-code-bg` | `var(--sunken)` | code block background |
| `--ai-code-font` | 400 0.8125rem/1.55 `var(--font-mono)` | code blocks |
| `--ai-code-max-block` | 24lh | collapsed height for blocks over 30 lines |
| `--ai-inline-code-bg` | `var(--surface-2)` | inline code |
| copy confirmation | "Copied", 2 s, `role="status"` | code, table, response copy |
| copy target | ≥ 24×24 px (44 on touch) | copy buttons |
| heading demotion | model h1 → turn level + 1, cap h5 | answers |

## Implementation sketch
```ts
const ALLOWED = ['p', 'h4', 'h5', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'hr', 'br', 'del', 'sup'];
const IMAGE_ORIGINS = new Set([location.origin]);

type Sanitize = (html: string) => { html: string; removed: number };

/** Run on the full combined output; returns null when rich rendering must stop. */
export function renderSafe(html: string, sanitize: Sanitize): DocumentFragment | null {
  const { html: clean, removed } = sanitize(html);
  if (removed > 0) return null;
  const tpl = document.createElement('template');
  tpl.innerHTML = clean;
  for (const el of Array.from(tpl.content.querySelectorAll('*'))) {
    if (!ALLOWED.includes(el.localName) && el.localName !== 'img') { el.replaceWith(...Array.from(el.childNodes)); continue; }
    if (el instanceof HTMLImageElement) {
      const url = new URL(el.src, location.href);
      if (!IMAGE_ORIGINS.has(url.origin)) el.replaceWith(linkTo(url, el.alt || 'image'));
    }
    if (el instanceof HTMLAnchorElement) {
      const url = new URL(el.href, location.href);
      if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) { el.removeAttribute('href'); continue; }
      el.rel = 'noopener noreferrer nofollow ugc';
      el.target = '_blank';
      el.dataset.domain = url.hostname;
    }
  }
  return tpl.content;
}

function linkTo(url: URL, label: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = url.href; a.textContent = `${label} (${url.hostname})`; a.rel = 'noopener noreferrer nofollow ugc'; a.target = '_blank';
  return a;
}

export async function copyResponse(markdown: string, html: string, status: HTMLElement): Promise<void> {
  const item = new ClipboardItem({
    'text/plain': new Blob([markdown], { type: 'text/plain' }),
    'text/html': new Blob([html], { type: 'text/html' }),
  });
  await navigator.clipboard.write([item]);
  status.textContent = 'Copied';
  setTimeout(() => { status.textContent = ''; }, 2000);
}
```
```css
.ai-answer a[data-domain]::after { content: " ↗ " attr(data-domain); font: var(--type-meta); color: var(--text-muted); }
.ai-code { border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--ai-code-bg, var(--sunken)); }
.ai-code header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-1) var(--space-3); font: var(--type-meta); }
.ai-code pre { margin: 0; padding: var(--space-3); overflow-x: auto; tab-size: 2; font: var(--ai-code-font, 400 0.8125rem/1.55 var(--font-mono)); }
.ai-code[data-collapsed] pre { max-block-size: var(--ai-code-max-block, 24lh); overflow-y: auto; }
.ai-code [data-copy] { min-inline-size: 24px; min-block-size: 24px; }
.ai-table-wrap { overflow-x: auto; max-inline-size: 100%; }
.ai-table-wrap td.num, .ai-table-wrap th.num { text-align: end; font-variant-numeric: tabular-nums; }
```

## Checklist
- [ ] Full output sanitised with an allow-list; rich rendering stops when anything is removed.
- [ ] No remote images outside allow-listed origins; links show their domain and use safe `rel`.
- [ ] Streaming parser appends; fences render as code immediately.
- [ ] Code blocks: language label, always-visible named Copy, "Copied" status, horizontal scroll, focusable when scrollable.
- [ ] Tables: `th` headers, scroll region, right-aligned tabular numbers, CSV copy.
- [ ] Copy response writes both `text/plain` and `text/html`.

## Sources
- https://developer.chrome.com/docs/ai/render-llm-responses
- https://developer.chrome.com/docs/ai/built-in-ai-dos-donts
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API
- https://github.com/cure53/DOMPurify
- https://github.com/thetarnav/streaming-markdown
- https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/copy-button.md (Apache-2.0)
- https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem
- https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/
- https://www.nngroup.com/articles/less-chat-more-answer/
