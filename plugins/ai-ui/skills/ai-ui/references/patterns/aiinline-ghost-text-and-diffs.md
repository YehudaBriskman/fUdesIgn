# Inline AI: ghost text, accept or reject, and diffs

> AI that edits the user's own work (a document, a form, a dashboard note) proposes and never imposes: suggestions appear as clearly distinct ghost text or as a reviewable diff, one key accepts, one key or simply continuing to type dismisses, every accepted change is one undo away, and AI-inserted content stays marked until the user has reviewed it.

**Category:** Inline AI · **Applies to:** text editors and documents, code editors, form fields and AI prefill, rewrite/shorten/translate actions on a selection, "explain this chart" and generated notes in dashboards · **Priority:** must

## When to use / when not
- **Ghost text** (inline completion): continuous writing where the next words are predictable (code, email replies, long-form text, free-text form fields). Short, low-stakes, appears without being asked.
- **Diff review**: any change the user asked for on existing content (rewrite, fix grammar, translate, refactor, "apply to all rows"). Changes to what is already there must be shown as a diff, never silently replaced.
- **Suggested values in forms**: AI prefill of fields from a document or prior data. Mark them as suggested until confirmed.
- **Don't** use ghost text in password, payment, legal-signature or other fields where a plausible guess is harmful, or for numbers that matter (amounts, dosages, dates of record). Don't show inline AI where the user has not opted in, and let it be turned off globally (HAX G17).
- Chat-based editing of whole documents still ends in the diff review below; branching of chat answers is in `aichat-edit-regenerate-branching.md`.

## Rules (do)
**Ghost text**
- Render after the caret in `--ai-ghost-fg` (the muted text colour, still ≥ 4.5:1, never lighter) and, where the font allows, italic or a dotted underline, so it differs by more than colour.
- Show only after typing pauses (debounce 150–300 ms) and only if the suggestion arrives within 300 ms of the pause; drop late suggestions that no longer match the text before the caret (`aifound-latency-and-perceived-performance.md`).
- Keys: **Tab** accepts all; **Ctrl/⌘ + →** accepts the next word; **Esc** dismisses; typing a matching character keeps the suggestion and consumes it; typing anything else discards it. Alt/Option + ] and [ cycle alternatives when there are several. These match the most widely used code-completion conventions.
- **Tab is a focus key.** Capture Tab only while a suggestion is visible; otherwise Tab moves focus as normal (WCAG 2.1.2 no keyboard trap). In forms, prefer an explicit "Accept" button or → at the end of the field over Tab.
- Limit length: about one line (≤ 80 characters) in prose and forms; whole blocks only in code editors. Long ghost text covers what the user is reading.
- Tell screen-reader users a suggestion exists without reading it on every keystroke: a polite "Suggestion available, Tab to accept" at most once per pause, and a shortcut to read the suggestion.

**Diff review**
- Show the proposal as a diff against the original: inline (strikethrough deletions, underlined insertions) for changes inside a paragraph; side by side or stacked for a whole document or code. Deletions use `--ai-diff-del-bg` plus strikethrough; insertions `--ai-diff-ins-bg` plus underline, never colour alone.
- Accept and reject per change (hunk), plus **Accept all** and **Reject all**. Keyboard: arrows or J/K between hunks, Enter or Y accept, Backspace or N reject, with visible buttons for all.
- Keep the user's original until they accept; nothing is written to the saved document before acceptance. Accepted changes form one undo step (⌘/Ctrl + Z restores the original in one press).
- Show what the AI was asked ("Rewrite: more formal") above the diff, with **Try again** and **Edit instruction**. Let the user edit the proposed text directly in the diff before accepting.
- For large edits, summarise first ("12 changes in 4 paragraphs") and let the user step through them.

**Marking and provenance**
- After acceptance, keep a subtle mark (gutter bar or faint background, `--ai-inserted-bg`) on AI-written passages until the user edits or dismisses the mark, and keep an "AI-assisted" note in version history.
- AI-prefilled form fields show a "Suggested" tag and a per-field source ("from invoice.pdf, page 2"); they are not submitted until the user confirms each one or the group ("Confirm 6 suggested fields").
- AI notes on dashboards ("Revenue fell 8% because…") cite the data points they used, show when they were generated, and are labelled as AI explanations, not as the metric definition.

## Anti-patterns (don't)
- Replacing a paragraph in place with no diff and no undo.
- Ghost text that keeps appearing while the user is reading or deleting.
- Tab permanently hijacked by an AI field, trapping keyboard users.
- Light-grey ghost text below 4.5:1, or ghost text distinguished by colour only.
- Prefilled form values that look exactly like user-entered values and are submitted unchecked.
- One giant "Accept" for a 40-change rewrite with no way to review individual changes.

## Good references
- [GitHub Copilot, code suggestions in the IDE](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions): grey inline text, Tab to accept, Esc to dismiss, Alt/Option + ] and [ to cycle, Ctrl/⌘ + → to accept word by word; next-edit suggestions marked in the gutter.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): let people dismiss, revert and retry; keep edit, undo and retry near generated output.
- [modern-web-guidance, Prompt API guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md): make the user the final editor, never overwrite a draft without a way back, provide a stepper or history to compare results (Apache-2.0).
- [NN/g, Accordion editing and apple picking](https://www.nngroup.com/articles/accordion-editing-apple-picking/): users want to change one part of an answer rather than regenerate all of it; direct editing beats re-prompting.

## Bad references
- AI rewrite buttons that replace the selection immediately with only the editor's general undo as a way back: the user can't compare, and the next keystroke may push the original out of the undo stack.
- Autofill-style AI prefill that silently enters guessed values in required fields ([NN/g, designing AI agents](https://www.nngroup.com/articles/designing-ai-agents/) documents hidden costs appearing only at checkout; the same failure applies to unconfirmed AI-filled values).

## Accessibility
- Ghost text is not in the field's value. Expose it via `aria-describedby` on the field pointing to a visually hidden "Suggestion: …, Tab to accept", updated at most once per pause.
- Diffs: insertions and deletions are `<ins>` and `<del>`; add visually hidden "inserted" / "deleted" text, because many screen readers don't announce those elements by default.
- Each hunk's Accept and Reject buttons name the change ("Accept change 3 of 12").
- After Accept all or Reject all, move focus to the edited text and announce the result ("12 changes applied").

## Motion / interaction (if relevant)
- Accepted text fades its highlight over 400 ms (`--motion-dur-long`); no motion under `prefers-reduced-motion: reduce` beyond an instant colour change.
- Ghost text appears without animation, so it doesn't draw the eye while the user is typing.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-ghost-fg` | `var(--text-muted)` (≥ 4.5:1) | ghost text, plus italic or dotted underline |
| ghost debounce | 150–300 ms after the last keystroke | when to request |
| ghost deadline | 300 ms after the pause | drop later suggestions |
| ghost length | ≤ 80 chars (prose, forms); blocks in code | per suggestion |
| `--ai-diff-ins-bg` | `var(--success-bg)` + underline | insertions |
| `--ai-diff-del-bg` | `var(--danger-bg)` + strikethrough | deletions |
| `--ai-inserted-bg` | `color-mix(in oklab, var(--accent) 8%, transparent)` | AI-written passage after acceptance |
| keys | Tab accept · ⌘/Ctrl+→ word · Esc dismiss · Alt+]/[ cycle | ghost text |
| accept undo | one step | Accept or Accept all |

## Implementation sketch
```ts
// Hunk-level review of an AI proposal. Nothing is written until resolve() runs.
type Hunk = { id: string; start: number; end: number; replacement: string; state: 'pending' | 'accepted' | 'rejected' };

export function applyAccepted(original: string, hunks: readonly Hunk[]): string {
  let out = '';
  let cursor = 0;
  for (const h of [...hunks].sort((a, b) => a.start - b.start)) {
    out += original.slice(cursor, h.start);
    out += h.state === 'accepted' ? h.replacement : original.slice(h.start, h.end);
    cursor = h.end;
  }
  return out + original.slice(cursor);
}

// Ghost text keydown: only take Tab while a suggestion is visible.
export function onGhostKey(e: KeyboardEvent, ghost: { text: string } | null, accept: (t: string) => void, dismiss: () => void): void {
  if (!ghost || e.isComposing) return;
  if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); accept(ghost.text); return; }
  if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    const word = /^\s*\S+/.exec(ghost.text)?.[0] ?? ghost.text;
    accept(word);
    return;
  }
  if (e.key === 'Escape') { e.preventDefault(); dismiss(); }
}
```
```css
.ai-ghost { color: var(--ai-ghost-fg, GrayText); font-style: italic; pointer-events: none; }
ins.ai-diff { background: var(--ai-diff-ins-bg); text-decoration: underline; }
del.ai-diff { background: var(--ai-diff-del-bg); text-decoration: line-through; }
.ai-inserted { background: var(--ai-inserted-bg); box-shadow: inset 2px 0 0 var(--accent); }
@media (forced-colors: active) {
  ins.ai-diff, del.ai-diff { background: none; }
}
```

## Checklist
- [ ] Ghost text: muted but ≥ 4.5:1, distinct by more than colour, ≤ 80 chars outside code.
- [ ] Tab accepts only while a suggestion shows; Esc dismisses; typing past it discards it.
- [ ] Changes to existing content are shown as a diff with per-hunk accept and reject plus Accept all.
- [ ] Nothing is saved before acceptance; one undo restores the original.
- [ ] AI-written passages and prefilled fields stay marked until reviewed.
- [ ] No ghost text or prefill in passwords, payments, signatures or critical numbers.
- [ ] Screen readers hear "suggestion available" once per pause; diffs expose inserted/deleted in text.

## Sources
- https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://developer.apple.com/design/human-interface-guidelines/machine-learning
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G8 efficient dismissal, G9 efficient correction, G17 global controls)
- https://www.nngroup.com/articles/accordion-editing-apple-picking/
- https://www.nngroup.com/articles/designing-ai-agents/
- https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0)
- https://www.shapeof.ai/pattern-types/inputs (ideas only: inline action, auto-fill, restructure)
