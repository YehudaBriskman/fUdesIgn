# Empty states, starter prompts and follow-up suggestions

> A new chat opens with a one-line statement of what the assistant can do here and 3–4 concrete starter prompts drawn from the user's current context. After an answer, offer at most 3 follow-ups directly below it. A complete prompt sends on click; a template with blanks goes into the composer for editing.

**Category:** Chat and conversation · **Applies to:** new-chat screens, assistant side panels, site chatbots, copilots opened from a page, AI search boxes · **Priority:** should

## When to use / when not
- Every empty assistant surface and every answer that has an obvious next step.
- Skip follow-ups after errors, refusals and one-word confirmations; they read as the bot ignoring what happened.
- Skip starters in contexts where the user arrived with a question already (opened from a selection or an "Ask about this" button): put that question in the composer instead.
- Autocomplete of the prompt as the user types is a third kind of suggestion; it follows the ghost-text rules in `aiinline-ghost-text-and-diffs.md`.

## Rules (do)
- **Capability line first**: one sentence of scope above the starters ("Ask about orders, returns and delivery"), as in `aifound-expectations-and-identity.md`. No greeting paragraph, no mascot.
- **3–4 starters**, each a complete task the assistant does well here, 40–70 characters, starting with a verb or a question word: "Summarise the open invoices over 30 days", not "Invoices" or "Tell me a joke".
- **From context, not a fixed list.** Pick starters from the current page, selection, record or recent activity (NN/g's chatbot guidelines praise page-specific suggestions). Rotate at most once per session; don't reshuffle while the user reads.
- **Insert or send by completeness.** A starter that is a complete prompt sends on click. A starter with a blank ("Compare [product] with…") inserts into the composer with the blank selected. Mark the inserting kind with an ellipsis or an edit icon so the outcome is predictable.
- **Follow-ups below the answer**: at most 3, shown only after streaming completes, specific to that answer ("Show this as a table", "What are the risks?", "Where does the 12% come from?"). NN/g's prompt-suggestions article finds follow-ups the most useful kind. Include one that invites scrutiny when the answer has numbers or claims (NN/g error-checking study).
- **Follow-ups replace each other.** Only the latest answer shows follow-ups; older ones disappear when a new message is sent, so the thread doesn't fill with stale chips.
- **Show examples of results, not only prompts**, for open-ended generators: a small gallery of outputs with the prompt that made them helps people over the articulation barrier (NN/g articulation-barrier study; Shape of AI "gallery" and "templates" ideas).
- **Teach controls in place.** If the composer has attachments, modes or slash commands, the empty state names one ("Type / for commands") in the placeholder or a one-line hint, not in a tour.
- **Returning users** see recent chats and pinned prompts in the empty state before generic starters.

## Anti-patterns (don't)
- Six or more starter cards that push the composer below the fold.
- Generic starters unrelated to the product ("Write a poem", "Tell me a fun fact").
- Starters that send immediately but contain placeholders.
- Follow-up chips on every past answer in the thread.
- A follow-up that answers a question nobody asked, padding the response (NN/g "less chat, more answer").
- An empty chat that only says "How can I help you today?".

## Good references
- [NN/g, Prompt suggestions](https://www.nngroup.com/articles/prompt-suggestions/): three kinds (starter, follow-up, autocomplete); follow-ups below the answer are the most useful.
- [NN/g, Prompt controls in GenAI chatbots](https://www.nngroup.com/articles/prompt-controls-genai/): controls around the input help users discover features, get inspired, set constraints and follow up; follow-up suggestions cited as good.
- [NN/g, 10 guidelines for site AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/): state what the bot can do and use suggestions that fit the current page; good examples are retail assistants with page-specific suggestions and follow-ups that change with the conversation.
- [NN/g, The articulation barrier](https://www.nngroup.com/articles/ai-articulation-barrier/): users struggle to put intent into words; recognition (suggestions, thumbnails) beats recall.
- [Shape of AI, Wayfinders](https://www.shapeof.ai/pattern-types/wayfinders) (ideas only): suggestions, templates, galleries and follow-ups as ways into a blank prompt.

## Bad references
- Site chatbots that open with "Ask me anything" and no scope, then fail on half the questions people ask ([NN/g, less chat, more answer](https://www.nngroup.com/articles/less-chat-more-answer/) describes users treating them like search boxes).
- A broom or magic-wand icon as the only "new chat" or "improve" control ([NN/g, prompt controls](https://www.nngroup.com/articles/prompt-controls-genai/)): participants did not understand the icons.

## Accessibility
- Starters are `<button>` elements in a list with a heading ("Try asking"), not divs. Their accessible name is the full prompt text.
- Inserting starters say so: `aria-description="Inserts into the message box"` or visible text, and focus moves to the composer with the blank selected.
- Follow-ups appear after the answer is announced; don't announce the chips themselves. They are a `role="group"` labelled "Suggested follow-ups" so screen-reader users can find them.
- Targets at least 24×24 CSS px (44 px on touch); chips wrap rather than scroll horizontally.

## Motion / interaction (if relevant)
- Follow-ups fade in over 150 ms once the stream ends, with no layout shift: reserve their row while streaming (see `aichat-streaming-text.md`).
- Starters don't animate in on every new chat; a static grid reads faster.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| starter count | 3–4 | new chat / empty panel |
| starter length | 40–70 characters, verb or question first | |
| follow-up count | ≤ 3, latest answer only | below the answer |
| `--ai-chip-radius` | `var(--radius-full)` | follow-up chips |
| `--ai-chip-pad` | `var(--space-1) var(--space-3)` | chip padding (4px 12px) |
| `--ai-starter-cols` | `repeat(auto-fit, minmax(14rem, 1fr))` | starter grid, 1 column on phones |
| follow-up reveal | 150 ms fade after stream end | reserved row, no shift |

## Implementation sketch
```tsx
type Starter = { text: string; kind: 'send' | 'insert'; blank?: [number, number] }; // blank = selection range to edit

export function Starters({ items, onSend, composer }: {
  items: Starter[];
  onSend: (text: string) => void;
  composer: HTMLTextAreaElement | null;
}) {
  function pick(s: Starter): void {
    if (s.kind === 'send') { onSend(s.text); return; }
    if (!composer) return;
    composer.value = s.text;
    composer.focus();
    const [a, b] = s.blank ?? [s.text.length, s.text.length];
    composer.setSelectionRange(a, b);          // the blank is selected, ready to overtype
  }
  return (
    <section aria-labelledby="starters-h">
      <h2 id="starters-h" className="ai-meta">Try asking</h2>
      <ul className="ai-starters">
        {items.slice(0, 4).map((s) => (
          <li key={s.text}>
            <button type="button" onClick={() => pick(s)}
              aria-description={s.kind === 'insert' ? 'Inserts into the message box' : undefined}>
              {s.text}{s.kind === 'insert' ? '…' : ''}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```css
.ai-starters { display: grid; grid-template-columns: var(--ai-starter-cols, repeat(auto-fit, minmax(14rem, 1fr))); gap: var(--space-2); padding: 0; list-style: none; }
.ai-starters button { inline-size: 100%; min-block-size: var(--target-min, 24px); padding: var(--space-3); text-align: start; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); color: var(--text); font: var(--type-body); }
.ai-followups { display: flex; flex-wrap: wrap; gap: var(--space-2); min-block-size: 32px; } /* row reserved while streaming */
.ai-followups button { padding: var(--ai-chip-pad, 4px 12px); border-radius: var(--ai-chip-radius, 9999px); border: 1px solid var(--border); background: var(--surface); }
```

## Checklist
- [ ] Empty state has a one-line capability statement and 3–4 context-specific starters.
- [ ] Complete prompts send; templates insert with the blank selected, and the difference is visible.
- [ ] ≤ 3 follow-ups, below the latest answer only, after streaming ends, none after errors.
- [ ] One follow-up invites checking when the answer contains claims or numbers.
- [ ] Starters and follow-ups are buttons with full-text names in a labelled group.
- [ ] The follow-up row is reserved during streaming (no layout shift).

## Sources
- https://www.nngroup.com/articles/prompt-suggestions/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.nngroup.com/articles/ai-articulation-barrier/
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G1, G4 "Show contextually relevant information")
- https://pair.withgoogle.com/chapter/mental-models/ (CC BY-NC-SA 4.0; paraphrased)
- https://www.shapeof.ai/pattern-types/wayfinders (ideas only; CC BY-NC-SA, no text reused)
