# The prompt input: multiline, attachments, slash commands, IME-safe Enter

> The composer is a labelled, auto-growing `<textarea>` inside a real `<form>` with a visible Send button. Enter sends only when no IME composition is active and not on touch keyboards, and Shift+Enter inserts a newline. Attachment limits are shown before upload, slash commands use an accessible combobox, and the draft is never lost.

**Category:** Chat and conversation · **Applies to:** chat composers, copilot panels, inline "Ask AI" fields, agent task inputs, search-like AI boxes · **Priority:** must

## When to use / when not
- Every free-text prompt field.
- For a constrained request (rewrite tone, pick a length), offer buttons or chips next to the field rather than asking users to type it. NN/g's articulation-barrier research recommends GUI controls beside the text box.
- Starter and follow-up suggestions are in `aichat-empty-state-and-suggestions.md`. The send-to-stop swap is in `aichat-streaming-text.md`.

## Rules (do)
**Field**
- **A real form:** `<form>` + `<label>` (it may be visually hidden) + `<textarea>` + `<button type="submit">Send</button>`. Keyboard shortcuts are helpers. The button is the guaranteed path (modern-web-guidance IME-safe Enter guide).
- **Auto-grow** from 1 line (`--ai-composer-min-block` 44px) up to `--ai-composer-max-block` (40dvh, about 8–12 lines on desktop), then scroll inside. Use `field-sizing: content` (Baseline 2026, newly available) with `min-block-size` and `max-block-size`, plus a small script fallback that sets the height from `scrollHeight` where it isn't supported. Global `height` or `width` rules override `field-sizing`, so reset them.
- **Placeholder** states the scope in a few words ("Ask about your invoices"). It is not the label and not the only hint.
- **Send state:** with no text and no attachments, Send is `aria-disabled="true"` (still focusable, explains "Type a message to send"). It is not `disabled`.

**Keyboard**
- **Enter sends, Shift+Enter inserts a newline** on devices with a physical keyboard. Show the hint once ("Shift+Enter for a new line") under the field, then hide it after a few uses.
- **IME-safe:** on `keydown` Enter without Shift, call `preventDefault()`, then return without sending if `event.isComposing || event.keyCode === 229`. Otherwise call `form.requestSubmit()`. Older Safari delivered `compositionend` before the confirming Enter `keydown` (WebKit bug 165004), so the 229 check is still needed. Japanese, Chinese and Korean users confirm conversion candidates with Enter, and without this check half-typed messages get sent.
- **Touch keyboards:** Enter inserts a newline and the Send button sends, because a virtual keyboard has no Shift+Enter. Set `enterkeyhint="send"` only if Enter sends on that device. Detect this with `(pointer: coarse)` and no `(any-pointer: fine)`.
- **Ctrl/⌘+Enter always sends** (no IME conflict). **Esc** stops a running response, then closes a slash menu, then does nothing. It never clears the draft.
- **↑ in an empty composer** may recall the last user message for editing (this skill's choice). It triggers only when the field is empty, so it never steals arrow-key navigation inside a draft.

**Attachments**
- Three ways in: an "Attach" button (labelled, opens the file picker), drag-and-drop onto the whole composer (with a visible drop target), and paste.
- **Limits before upload:** accepted types, max size and max count are in the attach button's description and in the file picker's `accept` attribute. NN/g's bad example only reported a 10 MB limit after upload. Reject over-limit files on the client with an inline error at the chip.
- **Chips** above the text: file-type icon + name (middle-truncated to about 24 characters, full name in the accessible name) + size + upload progress + a Remove button named "Remove report.pdf". An image chip shows a 40px thumbnail.
- Send is allowed while uploads finish. The message is queued and shows "Uploading 1 file…". Send isn't blocked silently.
- Tell users before upload where the file goes and whether it's retained (`aifound-privacy-consent-data-use.md`).

**Slash commands and mentions**
- `/` at the start of an empty line, or `@` anywhere, opens a listbox under the caret. It follows the ARIA combobox pattern: the textarea gets `aria-controls`, `aria-expanded` and `aria-activedescendant`; options have `role="option"`.
- Filter as the user types. ↑/↓ move, Enter or Tab picks, Esc closes and leaves the typed `/text` as literal text. Show at most 8 options, each with a name and a one-line description.
- A picked command becomes a token chip in the input or a mode pill beside it ("Summarise"). Backspace on the chip removes it.
- Commands must also be discoverable without typing `/`: a "Commands" or "+" button lists them (NN/g prompt controls: support feature discovery).

**Drafts and limits**
- Save the draft per conversation (`sessionStorage` or local storage, debounced 300 ms), including after a failed send. Clear it only after the server accepts the message.
- Length limit: show a counter from 80% of the limit ("3,200 / 4,000"). Past the limit, Send explains why instead of truncating silently.
- Keep the composer's width equal to the thread column (`--ai-thread-measure`).

## Anti-patterns (don't)
- Sending on Enter during IME composition.
- Enter sends on mobile, with no way to type a newline.
- A `contenteditable` div with no label, no form and no Send button.
- A fixed 1-line input that scrolls sideways.
- Rejecting a 30 MB file after uploading it for a minute.
- Clearing the draft when a send fails or when the user switches chats.
- A disabled Send with no explanation.

## Good references
- The modern-web-guidance [IME-safe Enter guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md) (Apache-2.0): check composition before submitting, prevent default, `requestSubmit()`, keep a real submit button, handle the old Safari event order.
- The modern-web-guidance [field-sizing guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md) (Apache-2.0): auto-size with min and max sizes, and reset global width/height rules.
- [MDN, `enterkeyhint`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint): labels the virtual keyboard's Enter key (Baseline since 2021).
- [NN/g, Prompt controls in GenAI chatbots](https://www.nngroup.com/articles/prompt-controls-genai/): controls around the input help users discover features, set constraints and follow up. Use labelled icons.
- [WAI-ARIA APG, Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): `aria-activedescendant` listbox popup for slash menus.

## Bad references
- Ernie Bot's file limit, reported only after upload ([NN/g, prompt controls](https://www.nngroup.com/articles/prompt-controls-genai/)).
- [WebKit bug 165004](https://bugs.webkit.org/show_bug.cgi?id=165004): the Safari event order that made `isComposing`-only checks send half-converted text. Many chat apps shipped this bug.

## Accessibility
- The textarea has a `<label>` (visually hidden is fine). The scope note, limits and the Shift+Enter hint are linked with `aria-describedby`.
- Upload progress and errors per chip are announced through a polite status region. The chip's Remove button has a specific name.
- The slash menu follows the combobox pattern. The highlighted option is exposed through `aria-activedescendant`, so focus stays in the textarea.
- Drag-and-drop has a button equivalent (WCAG 2.5.7).
- Character counter updates are announced only at 80%, 95% and 100%, not on every keystroke.

## Motion / interaction (if relevant)
- Growth is instant: never animate the textarea height while typing.
- The slash menu appears within 100 ms with no animation, or a 100 ms fade.
- The drop target highlights with a 2px dashed `--accent` border; no bouncing.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-composer-min-block` | 44px | one-line composer |
| `--ai-composer-max-block` | 40dvh | max growth, then scroll |
| `--ai-composer-radius` | `var(--radius-xl)` (16px) | composer shell |
| `--ai-chip-name-max` | 24ch | attachment name, middle-truncated |
| `--ai-chip-thumb` | 40px | image attachment thumbnail |
| draft save debounce | 300 ms | per-conversation draft |
| counter shown | from 80% of the limit | length counter |
| slash menu | ≤ 8 options, open ≤ 100 ms | commands and mentions |

## Implementation sketch
```ts
const touchOnly = (): boolean => matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches;

export function wireComposer(form: HTMLFormElement, field: HTMLTextAreaElement, conversationId: string): void {
  const key = `draft:${conversationId}`;
  field.value = sessionStorage.getItem(key) ?? '';
  if (!touchOnly()) field.enterKeyHint = 'send';

  let t = 0;
  field.addEventListener('input', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => sessionStorage.setItem(key, field.value), 300);
    if (!CSS.supports('field-sizing', 'content')) {
      field.style.height = 'auto';
      field.style.height = `${field.scrollHeight}px`; // capped by max-block-size in CSS
    }
  });

  field.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); form.requestSubmit(); return; }
    if (e.shiftKey || touchOnly()) return;             // newline
    e.preventDefault();
    if (e.isComposing || e.keyCode === 229) return;     // IME is confirming a candidate
    form.requestSubmit();
  });
}

export function clearDraftAfterAccept(conversationId: string): void {
  sessionStorage.removeItem(`draft:${conversationId}`); // only once the server accepted the message
}

type Limits = { types: string[]; maxBytes: number; maxCount: number };
export function checkFiles(files: File[], current: number, l: Limits): { ok: File[]; errors: string[] } {
  const ok: File[] = [];
  const errors: string[] = [];
  for (const f of files) {
    if (current + ok.length >= l.maxCount) { errors.push(`${f.name}: at most ${l.maxCount} files`); continue; }
    if (!l.types.some((ty) => f.type === ty || f.name.toLowerCase().endsWith(ty))) { errors.push(`${f.name}: this file type isn't supported`); continue; }
    if (f.size > l.maxBytes) { errors.push(`${f.name}: larger than ${Math.round(l.maxBytes / 1e6)} MB`); continue; }
    ok.push(f);
  }
  return { ok, errors };
}
```
```css
.ai-composer { position: sticky; inset-block-end: 0; max-inline-size: var(--ai-thread-measure); margin-inline: auto; background: var(--surface); border: 1px solid var(--border-strong); border-radius: var(--ai-composer-radius, 16px); padding: var(--space-2); padding-block-end: max(var(--space-2), env(safe-area-inset-bottom)); }
.ai-composer:focus-within { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.ai-composer textarea { inline-size: 100%; block-size: auto; resize: none; border: 0; background: transparent; font: var(--type-body); min-block-size: var(--ai-composer-min-block); max-block-size: var(--ai-composer-max-block); overflow-y: auto; }
@supports (field-sizing: content) { .ai-composer textarea { field-sizing: content; } }
.ai-composer textarea:focus { outline: none; }
.ai-composer[data-drop-active] { border: 2px dashed var(--accent); }
```

## Checklist
- [ ] `<form>`, `<label>`, auto-growing `<textarea>` (44px to 40dvh) and a visible Send button.
- [ ] Enter sends only without Shift, without IME composition (`isComposing` or keyCode 229) and not on touch-only devices; Ctrl/⌘+Enter always sends.
- [ ] Attachment types, size and count are stated before upload; chips show name, size, progress and a named Remove.
- [ ] Slash commands use the combobox pattern and are also reachable from a button.
- [ ] The draft survives a failed send, a reload and switching chats.
- [ ] Send is `aria-disabled` with a reason, never silently disabled.

## Sources
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md (Apache-2.0)
- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
- https://bugs.webkit.org/show_bug.cgi?id=165004
- https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.nngroup.com/articles/ai-articulation-barrier/
- https://www.shapeof.ai/patterns/attachments (ideas only)
