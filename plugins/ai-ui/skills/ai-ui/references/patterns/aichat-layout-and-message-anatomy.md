# Chat layout and message anatomy

> Lay a conversation out as one centred reading column of about 46rem. User turns are compact right-aligned bubbles and assistant turns are full-width, unbubbled prose, and every assistant turn has the same anatomy: an author label, the answer, its sources, then one action row. The composer stays pinned at the bottom.

**Category:** Chat and conversation · **Applies to:** full-page chat, side-panel copilots, support bots, embedded assistants · **Priority:** must

## When to use / when not
- Any turn-based conversation with a model: full-page assistants, a copilot panel beside a document or dashboard, a site support bot.
- For a one-shot action with no conversation (summarise this, rewrite this), don't build a chat: use the inline pattern in `aiinline-ghost-text-and-diffs.md`. NN/g's "AI chat is not (always) the answer" makes the same point.
- Streaming behaviour is in `aichat-streaming-text.md`, the composer in `aichat-prompt-input.md`, and the empty state in `aichat-empty-state-and-suggestions.md`.

## Rules (do)
- **One reading column.** Content column `max-inline-size: 46rem` (≈ 736px, 70–80 characters of body text at 0.9375–1rem), centred, with a 16px gutter on phones. The composer shares the same width so the eye doesn't jump.
- **Two shapes for two authors.**
  - User turn: right-aligned bubble, `max-inline-size: 80%`, `--ai-bubble-bg` (`--surface-2`), radius 12px, padding 8–12px × 12–16px. It is short and quoted back, so a bubble suits it.
  - Assistant turn: no bubble, full column width, starts at the left edge. Long answers with headings, code and tables read badly inside a tinted bubble that is narrower than the column.
- **Fixed anatomy for every assistant turn, in this order:**
  1. author line: "Assistant" (or the product name) in `--type-meta`, plus the model or mode when the user can change it;
  2. the answer, which leads with the answer itself (NN/g "less chat, more answer": the answer and essential caveats first, details on request);
  3. sources (`aichat-citations-and-sources.md`);
  4. follow-up suggestions, at most 3 (`aichat-empty-state-and-suggestions.md`);
  5. one action row: Copy, Regenerate, thumbs up and down, and a More menu (Share, Report, Edit as new). Version pager (`‹ 2 / 3 ›`) sits at the start of the row when versions exist (`aichat-edit-regenerate-branching.md`).
- **Action row visibility.** Always visible on the latest assistant turn and on touch devices. On older turns on pointer devices, it may appear on hover **and** on `:focus-within`, but reserve its 32px height from the start so showing it never shifts layout.
- **Spacing.** 32px (`--ai-turn-gap`) between turns, 8–12px between parts within a turn. Spacing, not divider lines, separates turns (dashboard-ui `found-layout-grid-spacing.md`).
- **Timestamps** on hover/focus or grouped by day ("Today", "Yesterday"), never one per message in the main flow.
- **Composer pinned at the bottom** of the scroll container with `position: sticky; bottom: 0`, a solid `--surface` background and `padding-bottom: max(16px, env(safe-area-inset-bottom))`. The baseline reliability note sits under it (`aifound-uncertainty-and-disclaimers.md`).
- **Side-panel copilot:** 360–480px wide, resizable, collapsible, with its own header ("Assistant", New chat, Close) and the same anatomy at a smaller type size (0.875rem body). Keep the host page fully usable while it is open (NN/g: allow resizing). On viewports under 768px it becomes a full-height sheet.
- **Conversation history** in a collapsible left sidebar (260–300px) with title, last-active date and search; the active chat is marked with `aria-current="page"`. "New chat" is always one click away and has a text label (NN/g: Bing's broom icon for new chat was not understood).
- **Identify the AI.** The author label is text, not only an avatar (`aifound-expectations-and-identity.md`). No human name or photo for the assistant.
- **Long threads stay fast.** Use `content-visibility: auto` with `contain-intrinsic-size: auto 400px` on older turns: content stays in the DOM and the accessibility tree, so find-in-page and screen readers still reach it.

## Anti-patterns (don't)
- Both authors in identical bubbles, or assistant answers inside narrow tinted bubbles with code blocks overflowing them.
- Messaging-app styling (avatars on every line, read receipts, typing dots with a human name) that implies a person.
- Action icons without labels or tooltips (NN/g: unclear icons such as a magic wand or broom were not understood).
- An action row that appears on hover and pushes the next turn down.
- Full-width text lines of 150+ characters on wide screens.
- A floating launcher bubble that covers page content or other controls.

## Good references
- [NN/g, 10 guidelines for site AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/): one consistent entry point, expand details in place instead of adding new messages, allow resizing, saving and sharing.
- [NN/g, Prompt controls in GenAI chatbots](https://www.nngroup.com/articles/prompt-controls-genai/): reply actions with standard icons plus labels or tooltips, grouped by function; follow-up actions happen in half of conversations.
- [NN/g, Less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/): a longer answer was not a better answer; lead with the answer.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): put edit, undo, retry and adjust controls next to the generated output.

## Bad references
- Amazon Rufus's "More details", which appends a new message instead of expanding the current one ([NN/g](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)).
- Bing Chat's 2023 broom icon for "new topic" ([NN/g, prompt controls](https://www.nngroup.com/articles/prompt-controls-genai/)): an unlabelled metaphor for a core action.

## Accessibility
- The thread is a list of `<article>` elements, each named by its author line (`aria-labelledby`), so screen-reader users can jump turn by turn (landmark and heading rules for the page around it: `a11y-structure-landmarks-headings.md`). The model's headings inside an answer start one level below the thread heading (`aifound-accessible-generated-content.md`).
- The thread container is **not** a live region while tokens stream (see `aichat-streaming-text.md`).
- The action row is a `role="toolbar"` with one Tab stop and arrow keys inside (dashboard-ui `comp-keyboard-shortcuts-focus.md`). Every icon button has an accessible name ("Copy response", "Good response").
- Provide a "Skip to composer" link and a keyboard shortcut to focus the composer (for example `/` when focus is not in a field, which can be turned off: WCAG 2.1.4).
- Touch targets ≥ 24×24 CSS px, 44px on coarse pointers.

## Motion / interaction (if relevant)
- A new user turn appears in the same frame as Send (≤ 100 ms), with at most a 150 ms fade. No slide-in per message.
- Under `prefers-reduced-motion: reduce`, keep the fade, drop any movement.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-thread-measure` | 46rem | reading column and composer width |
| `--ai-turn-gap` | `var(--space-6)` (32px) | between turns |
| `--ai-part-gap` | `var(--space-3)` (12px) | between parts of one turn |
| `--ai-bubble-max` | 80% | user bubble width cap |
| `--ai-bubble-bg` | `var(--surface-2)` | user bubble |
| `--ai-bubble-radius` | `var(--radius-lg)` (12px) | user bubble |
| `--ai-actions-block` | 32px | reserved height of the action row |
| `--ai-panel-inline` | 400px (360–480) | side-panel copilot width |
| `--ai-sidebar-inline` | 280px (260–300) | history sidebar |
| `--ai-label-font` / `--ai-label-fg` | `var(--type-meta)` / `var(--text-muted)` | author line |

## Implementation sketch
```tsx
type Turn =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; html: string; sources: number; version: { index: number; count: number } | null };

export function Thread({ turns }: { turns: Turn[] }) {
  return (
    <div className="ai-thread" aria-label="Conversation">
      {turns.map((t) =>
        t.role === 'user' ? (
          <article key={t.id} className="ai-msg" data-role="user" aria-labelledby={`${t.id}-by`}>
            <h3 id={`${t.id}-by`} className="visually-hidden">You said</h3>
            <p className="ai-bubble">{t.text}</p>
          </article>
        ) : (
          <article key={t.id} className="ai-msg" data-role="assistant" aria-labelledby={`${t.id}-by`}>
            <h3 id={`${t.id}-by`} className="ai-author">Assistant</h3>
            <div className="ai-answer" dangerouslySetInnerHTML={{ __html: t.html }} /> {/* sanitized upstream */}
            <div role="toolbar" aria-label="Response actions" className="ai-actions">
              {t.version && <span className="ai-pager">{t.version.index} / {t.version.count}</span>}
              <button type="button" aria-label="Copy response">Copy</button>
              <button type="button" aria-label="Regenerate response">Regenerate</button>
              <button type="button" aria-label="Good response" aria-pressed="false">Good</button>
              <button type="button" aria-label="Bad response" aria-pressed="false">Bad</button>
            </div>
          </article>
        ),
      )}
    </div>
  );
}
```
```css
.ai-thread { display: grid; gap: var(--ai-turn-gap); max-inline-size: var(--ai-thread-measure); margin-inline: auto; padding-inline: var(--space-4); }
.ai-msg { display: grid; gap: var(--space-3); content-visibility: auto; contain-intrinsic-size: auto 400px; }
.ai-msg[data-role="user"] { justify-items: end; }
.ai-bubble { max-inline-size: var(--ai-bubble-max); background: var(--ai-bubble-bg); border-radius: var(--ai-bubble-radius); padding: var(--space-2) var(--space-4); margin: 0; }
.ai-author { font: var(--ai-label-font); color: var(--ai-label-fg); margin: 0; }
.ai-actions { display: flex; gap: var(--space-1); min-block-size: 32px; }
@media (hover: hover) and (pointer: fine) {
  .ai-msg:not(:last-child) .ai-actions { visibility: hidden; }
  .ai-msg:hover .ai-actions, .ai-msg:focus-within .ai-actions { visibility: visible; }
}
```

## Checklist
- [ ] Column ≤ 46rem, composer the same width, 16px phone gutter.
- [ ] User turns are bubbles ≤ 80% wide; assistant turns are unbubbled, full column width.
- [ ] Every assistant turn: author label, answer first, sources, ≤ 3 follow-ups, one action row.
- [ ] The action row height is reserved; it shows on hover and focus, always on the latest turn and on touch.
- [ ] Each turn is an `<article>` named by its author; the action row is one Tab stop.
- [ ] A labelled "New chat" is one click away; the side panel is resizable and leaves the page usable.

## Sources
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://www.nngroup.com/articles/ai-chat-not-the-answer/
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
- https://www.w3.org/TR/wai-aria-1.2/#log
- https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
- https://www.shapeof.ai/pattern-types/identifiers (ideas only)
