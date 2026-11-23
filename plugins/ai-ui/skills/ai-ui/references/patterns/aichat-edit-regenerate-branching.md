# Edit, regenerate, branching and version history

> Treat a conversation as a tree, not a list. Editing a prompt or regenerating an answer adds a sibling version instead of overwriting, a "‹ 2 / 3 ›" pager on that message switches between versions, and no version is ever destroyed without an explicit delete. Let people revise part of an answer without regenerating all of it.

**Category:** Chat and conversation · **Applies to:** chat threads, assistant side panels, generated drafts, image and code generation, any "try again" action · **Priority:** must

## When to use / when not
- Every multi-turn chat and every generator with a retry button. Where the action row sits in a turn: `aichat-layout-and-message-anatomy.md`.
- One-shot inline transforms (rewrite this sentence) use accept/reject and undo instead; see `aiinline-ghost-text-and-diffs.md`.
- Agent runs that changed external state can't be "regenerated" by replaying; offer a new run and keep the old one's audit trail (`aiagent-approval-and-audit.md`).

## Rules (do)
- **Data model is a tree.** Each message has an `id` and a `parentId`. The visible thread is the path from the root to the active leaf. Editing a user message creates a sibling of that message (same parent); regenerating an assistant message creates a sibling of that answer. The UI stores which child is active at each fork.
- **Pager on any message with siblings**: "‹ 2 / 3 ›" next to that message's actions. Switching versions shows the subtree under that version (its own later turns), not the later turns of another branch.
- **Never destroy on edit or regenerate.** The previous version remains one click away. Deleting a version is a separate action with undo (8 s, see `prog-optimistic-ui-and-undo.md`).
- **Edit in place.** "Edit" turns the user message into a textarea with the old text, Save (or Enter) and Cancel (or Esc); the edit is a new version and regenerates the answer below. Saving an unchanged prompt does nothing.
- **Regenerate with intent.** Next to "Regenerate", offer 2–4 one-click adjustments that people otherwise type (Shorter, Longer, Simpler, More formal). NN/g's prompt-controls study found 77% of conversations had more than one exchange and named one-click "Shorter" as good; its accordion-editing study shows users repeatedly asking to shrink or grow answers.
- **Revise part of an answer.** Let users select a passage and act on just that ("Rewrite this", "Explain this", "Quote in reply"). The rest of the answer stays byte-identical and the revised passage is shown as a diff. NN/g calls the workaround "apple picking": users copy fragments of earlier answers into new prompts by hand.
- **Number long answers' sections** or make paragraphs quotable, so people can refer to "point 3" without retyping it (NN/g's stopgap for apple picking).
- **Compare versions** side by side or as a diff when there are 2 or more; keep the pager order stable (creation order) and mark the version the user copied, exported or accepted.
- **Edits that invalidate later turns**: when a user edits turn 3 of 10, the new branch starts at turn 3. Show "Later messages are kept in version 1" so nothing seems lost.
- **Branch to a new chat** ("Continue in new chat from here") for long side explorations, with a link back to the source message.
- **Persist the tree** server-side with the conversation; versions survive reloads and sharing shows only the active path unless the user chooses otherwise.

## Anti-patterns (don't)
- Regenerate that replaces the answer with no way back (the "lost a good answer" failure).
- Editing a prompt that silently deletes every later turn.
- A pager with arrows only and no count ("which version am I on?").
- "Regenerate" as the only control, so people re-roll instead of steering.
- Version controls hidden behind hover only, unreachable on touch and keyboard.
- Re-generating the whole answer to change one paragraph.

## Good references
- [NN/g, Accordion editing and apple picking](https://www.nngroup.com/articles/accordion-editing-apple-picking/): users repeatedly resize answers and pick pieces from earlier answers; recommends partial edits, direct editing, pointing at earlier content and numbered paragraphs.
- [NN/g, Prompt controls in GenAI chatbots](https://www.nngroup.com/articles/prompt-controls-genai/): edit, regenerate, quote and follow-ups matter because most conversations have follow-ups; one-click adjustments beat retyping.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): put edit, undo, retry and adjust near generated output; consider offering alternate versions.
- [Chrome built-in AI guidance, "Allow users to quickly navigate and undo AI edits"](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md): a stepper or history so users can explore results and never lose a draft they liked.
- [Shape of AI, Branches and Variations](https://www.shapeof.ai/patterns/branches) (ideas only).

## Bad references
- Version arrows that disappear: in February 2026 users of a major chat app reported that the inline "‹ 2/2 ›" arrows were gone after a web update, leaving no way to reach edited history; support could still see them in its own tests, so the cause is unconfirmed, but users experienced lost history ([OpenAI community thread](https://community.openai.com/t/chatgpt-web-update-removed-message-version-arrows-cannot-access-edited-message-history/1374666), user reports, not an official change). Whatever the control, it must stay where the edit happened.
- Generators whose "Try again" overwrites the previous output (common in image tools): the only way to keep a result is to download it before retrying.

## Accessibility
- The pager is a group (`role="group"`, `aria-label="Response versions"`) with two buttons named "Previous version" and "Next version" and a visible "2 / 3" text that is also announced: after switching, a polite status reads "Version 2 of 3".
- Disabled ends use `aria-disabled="true"` so they stay focusable and announced.
- Switching versions keeps focus on the pager button that was pressed; it never jumps to the top of the thread.
- Edit mode: focus moves into the textarea with the caret at the end; Esc cancels and returns focus to the Edit button.

## Motion / interaction (if relevant)
- Switching versions cross-fades the message body over 150 ms; no horizontal slide (it implies a carousel) and no animation under reduced motion.
- Keyboard: with focus on a message, `[` and `]` (or Alt+← / Alt+→) switch versions; single-key shortcuts can be turned off (WCAG 2.1.4).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| pager format | "‹ n / N ›", count always visible | any message with siblings |
| adjustment chips | 2–4 (Shorter, Longer, Simpler, More formal) | beside Regenerate |
| version switch | 150 ms cross-fade (`--motion-dur-short`), none under reduced motion | |
| delete version undo | 8 s toast + restore from history | |
| `--ai-pager-gap` | `var(--space-1)` | between pager buttons and count |

## Implementation sketch
```ts
type Role = 'user' | 'assistant';
type Msg = { id: string; parentId: string | null; role: Role; text: string; createdAt: number };
type Tree = { msgs: Map<string, Msg>; active: Map<string | null, string> }; // parentId → active child id

export function children(t: Tree, parentId: string | null): Msg[] {
  return [...t.msgs.values()].filter((m) => m.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt);
}

// The visible thread: follow the active child (or the newest) from the root.
export function activePath(t: Tree): Msg[] {
  const path: Msg[] = [];
  let parent: string | null = null;
  for (;;) {
    const kids = children(t, parent);
    if (kids.length === 0) return path;
    const chosen = kids.find((k) => k.id === t.active.get(parent)) ?? kids[kids.length - 1];
    path.push(chosen);
    parent = chosen.id;
  }
}

// Edit or regenerate: add a sibling, make it active. Nothing is removed.
export function addSibling(t: Tree, of: Msg, text: string, id: string): Tree {
  const msgs = new Map(t.msgs).set(id, { ...of, id, text, createdAt: Date.now() });
  const active = new Map(t.active).set(of.parentId, id);
  return { msgs, active };
}

export function versionLabel(t: Tree, m: Msg): { index: number; total: number } {
  const sibs = children(t, m.parentId);
  return { index: sibs.findIndex((s) => s.id === m.id) + 1, total: sibs.length };
}
```
```css
.ai-pager { display: inline-flex; align-items: center; gap: var(--ai-pager-gap, 4px); font: var(--type-meta); color: var(--text-muted); font-variant-numeric: tabular-nums; }
.ai-pager button { min-inline-size: 24px; min-block-size: 24px; }
.ai-pager button[aria-disabled="true"] { opacity: 0.5; cursor: default; }
@media (prefers-reduced-motion: no-preference) {
  .ai-msg__body { transition: opacity var(--motion-dur-short) var(--motion-ease-standard); }
}
```

## Checklist
- [ ] Messages are stored as a tree (`parentId`); edit and regenerate add siblings.
- [ ] A "‹ n / N ›" pager appears on every message with siblings and shows that branch's later turns.
- [ ] No version is lost without an explicit delete with undo.
- [ ] 2–4 one-click adjustments sit beside Regenerate.
- [ ] Users can revise a selected passage without regenerating the whole answer.
- [ ] Switching versions announces "Version n of N" and keeps focus on the pager.

## Sources
- https://www.nngroup.com/articles/accordion-editing-apple-picking/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G9 "Support efficient correction")
- https://community.openai.com/t/chatgpt-web-update-removed-message-version-arrows-cannot-access-edited-message-history/1374666
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/built-in-ai/prompt-api.md (Apache-2.0)
- https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
- https://www.shapeof.ai/patterns/branches (ideas only; CC BY-NC-SA, no text reused)
- https://www.shapeof.ai/patterns/variations (ideas only)
