# Accessibility of generated content

> Generated output must be as accessible as authored content: real semantic HTML (headings, lists, tables with header cells, labelled code regions), correct language tags, text alternatives for generated images, announcements that arrive once per response rather than per token, and focus that never moves while content streams.

**Category:** AI foundations · **Applies to:** chat answers, summaries, generated documents, generated images and charts, inline rewrites, agent result panels · **Priority:** must

## When to use / when not
- Everywhere model output is rendered. Model output is untrusted and unstructured until your renderer makes it structured, so the renderer owns accessibility, not the model.
- Live-region mechanics for streams are detailed in `aichat-streaming-text.md`; rendering markdown, code and tables in `aichat-markdown-code-tables.md`. This file is the cross-cutting checklist.
- Note the name clash: the modern-web-guidance guide "accessible generated content" is about CSS `content` (pseudo-element text and icons). It applies here to decorative icons and labels around AI output; its rules are summarised under Rules.

## Rules (do)
- **Each message is an `<article>`** with an accessible name ("You said", "Assistant said") and a timestamp; the thread is a list of articles under one heading. Screen-reader users move message to message with article or heading navigation.
- **Demote generated headings.** If the thread heading is `h2` and each message title is `h3`, map model `#` to `h4` and below, so the document outline stays valid. Never render a model `#` as a page `h1`.
- **Tables are real tables**: `<table>` with `<th scope="col">`, a caption when the model gives a title, and numeric columns right-aligned. Wide tables sit in a focusable scroll region with a label (`tabindex="0"`, `role="region"`, `aria-label`).
- **Code blocks** are `<pre><code>` with the language named in text ("Python"), and a scrollable `pre` is keyboard-focusable. The copy button names its target ("Copy Python code").
- **Language.** If the output (or a passage) is in a different language than the page, set `lang` on that element. Detect it (for example with the Language Detector API where available) rather than assuming.
- **Generated images need text alternatives.** Use the prompt or a generated description as alt text, edited to describe the image rather than restate the prompt, and offer the user a way to edit it. Mark it as AI-written alt text in the editing UI.
- **Generated charts** follow the chart rules of the dashboard skill: a title stating the takeaway, a one-line summary and a table view.
- **Announce once per response, never per token.** Use a polite live region that exists from page load. `aria-busy="true"` while streaming is allowed by ARIA (assistive tech MAY wait), but support is inconsistent, so also announce completion explicitly (`aichat-streaming-text.md`).
- **Never move focus during generation.** Focus stays in the composer. Offer a shortcut and a visible link to jump to the latest answer. If the Stop button disappears while focused, return focus to the composer.
- **Decorative glyphs in CSS get empty alt text**: `content: "✦" / "";`. Meaningful text (state, labels such as "AI-generated") lives in the DOM, never only in `content` (WCAG F87). Don't give an image icon `/ ""`; images are already presentational. Precede the `/` syntax with a single-value fallback for older browsers (all from the modern-web-guidance guide).
- **Emoji and symbols**: strip or limit decorative emoji in answers (each one is read aloud by name); never use emoji as the only status cue.
- **Contrast and size** follow the base tokens: generated text uses `--text` (not a lighter "AI" grey) and the same type scale as authored content; muted grey is for meta only.
- **Math and formulas**: render as MathML (Baseline newly available since January 2023) or provide a text equivalent, not images of equations.

## Anti-patterns (don't)
- Rendering the streamed text inside an `aria-live` region with no batching, so a screen reader reads fragments for a minute.
- `innerHTML` of model markdown with raw `<h1>`, `<font>` or inline `style`.
- Tables rendered as monospace ASCII art in a code block.
- Focus jumping to each new message, or to the end of the stream.
- "Copy" buttons that are all named "Copy".
- Lighter grey for AI text to "signal" it is generated.

## Good references
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#aria-busy): `aria-busy` lets assistive tech ignore changes until it is false (a MAY), `role="log"` is polite with additions at the end and cites chat as an example, `role="status"` is polite and atomic.
- [MDN, ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions): put the region in the initial markup, empty, before content arrives.
- [WCAG 2.2, 4.1.3 Status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html): results, waiting states and errors are announced without focus; misuse of assertive for non-urgent content fails.
- [modern-web-guidance, accessible generated content](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md): alternative text for CSS `content`, and when not to use it (Apache-2.0).
- [modern-web-guidance, Prompt API guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md): a polite live region present from load, `aria-busy` during streaming, no focus moves, and focus return when Stop disappears.

## Bad references
- Firefox bug reports on `aria-busy` ([1682063](https://bugzilla.mozilla.org/show_bug.cgi?id=1682063), [1885011](https://bugzilla.mozilla.org/show_bug.cgi?id=1885011)) describe busy regions that are then never announced when cleared in some screen-reader and browser pairs. Relying on `aria-busy` alone can make a whole answer silent.
- Chat widgets whose messages are `div`s with no names or headings: a screen-reader user can only read the thread line by line, from the top.

## Accessibility
This whole file is the accessibility rule set; test it with at least NVDA + Firefox or Chrome, JAWS + Chrome, and VoiceOver + Safari (macOS and iOS), because live-region and `aria-busy` behaviour differ between them.

## Motion / interaction (if relevant)
- Don't animate each token's appearance (fade-in per word). If a reveal effect is used, disable it under `prefers-reduced-motion: reduce`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| message element | `<article aria-labelledby>` | each turn |
| heading offset | model `#` → thread level + 2 (h4 under an h2 thread) | generated headings |
| scroll region | `tabindex="0" role="region" aria-label="…"` | wide tables, long code |
| announcement | once at completion, polite | each response |
| `--ai-text` | `var(--text)` | generated text, same as authored |
| decorative glyph | `content: "✦"; content: "✦" / "";` | AI badges |

## Implementation sketch
```ts
// Post-process sanitised markdown HTML so generated content is structurally accessible.
export function makeAccessible(root: HTMLElement, opts: { headingBase: number; lang: string | null; label: string }): void {
  // 1. Demote headings: model h1 becomes h(base+1), never higher than h6.
  for (const h of Array.from(root.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6'))) {
    const level = Math.min(6, Number(h.tagName[1]) + opts.headingBase);
    const next = document.createElement(`h${level}`);
    next.append(...Array.from(h.childNodes));
    h.replaceWith(next);
  }
  // 2. Table header cells get a scope; wide tables get a labelled scroll region.
  root.querySelectorAll('thead th').forEach((th) => th.setAttribute('scope', 'col'));
  for (const table of Array.from(root.querySelectorAll('table'))) {
    const wrap = document.createElement('div');
    wrap.className = 'ai-scroll';
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', table.caption?.textContent ?? `Table in ${opts.label}`);
    table.replaceWith(wrap);
    wrap.append(table);
  }
  // 3. Long code blocks are focusable so keyboard users can scroll them.
  root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    if (pre.scrollWidth > pre.clientWidth) pre.tabIndex = 0;
  });
  // 4. Language of the output, when it differs from the page.
  if (opts.lang && opts.lang !== document.documentElement.lang) root.lang = opts.lang;
}
```
```css
.ai-badge::before { content: "✦ "; content: "✦ " / ""; }
.ai-scroll { overflow-x: auto; }
.ai-scroll:focus-visible, pre:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
```

## Checklist
- [ ] Each message is an `<article>` with a name; generated headings are demoted below the thread heading.
- [ ] Tables have `th scope`, wide tables and long code are focusable labelled scroll regions.
- [ ] Copy buttons name their target.
- [ ] `lang` is set on output in another language.
- [ ] Generated images have editable alt text describing the image.
- [ ] One polite announcement per response; no focus moves while streaming; focus returns to the composer when Stop disappears.
- [ ] Decorative CSS glyphs use `/ ""`; meaningful text lives in the DOM.
- [ ] Tested on NVDA, JAWS and VoiceOver.

## Sources
- https://www.w3.org/TR/wai-aria-1.2/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/WCAG21/Techniques/failures/F87
- https://bugzilla.mozilla.org/show_bug.cgi?id=1682063
- https://bugzilla.mozilla.org/show_bug.cgi?id=1885011
- https://developer.mozilla.org/en-US/docs/Web/MathML
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/language-detection.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/copy-button.md (Apache-2.0)
