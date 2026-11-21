# Feedback (thumbs) and reporting

> Put thumbs up and down on every answer, registered with one click. Reasons are optional chips that appear only after a thumbs-down. Say plainly what happens to the feedback and what data it sends. Keep "Report" for harmful content as a separate action with its own flow.

**Category:** Chat and conversation · **Applies to:** chat answers, generated drafts and images, inline AI suggestions, agent run results, search answers · **Priority:** should

## When to use / when not
- Every AI output that someone will judge. Feedback is the main signal for evaluation and the visible proof that the system listens (HAX G15 "Encourage granular feedback", G16 "Convey the consequences of user actions").
- Implicit signals (copy, accept, edit, regenerate) are logged too, but never instead of explicit feedback, and never without disclosure in the data-use notice (`aifound-privacy-consent-data-use.md`).
- Reporting illegal or harmful content is a trust-and-safety flow, not quality feedback, and needs its own path.

## Rules (do)
- **Thumbs on every answer**, in the answer's action row with Copy and Regenerate. Visible on the latest answer at all times; on older answers they may appear on hover or focus, but stay reachable by keyboard and touch.
- **One click registers.** The thumb toggles on (`aria-pressed="true"`) and the vote is sent at once; clicking again removes it; clicking the other thumb switches. No required form.
- **Optional reasons after thumbs-down**: 4–6 chips (Incorrect, Not helpful, Didn't follow instructions, Unsafe or offensive, Outdated, Other) plus an optional text field, inline under the answer, dismissable. After thumbs-up, at most an optional "What was good?" field, or nothing.
- **Label by consequence where you can.** Apple's ML guidance says to label feedback by what it does ("Suggest less like this"), ask only when needed and keep it voluntary, and act on it immediately when it changes personalisation.
- **Say what is sent.** Next to the submit, one line: what is shared (this answer, the whole conversation, attachments), who may see it (human reviewers), whether it may be used to train models, and how long it is kept. OpenAI's data-controls FAQ notes that feedback can send the entire conversation for training even when the user has opted out of training in general; if your product does the same, say so at this point, not only in a policy.
- **Confirm in place**: "Thanks, feedback sent." under the buttons, which then stay in their pressed state. No toast-only confirmation and no modal.
- **Report is separate.** "Report" lives in the answer's overflow menu with categories for harm (harassment, sexual content, self-harm, illegal content, personal data, other), an optional note, and a statement of what happens next (reviewed, timeframe). Reporting must not require a thumbs-down first.
- **Feedback on parts.** For long answers, let people flag a selected passage or a single source; for agent runs, feedback per step. Granular feedback is more useful than a whole-answer vote (HAX G15).
- **Close the loop over time.** When feedback changes behaviour (a preference, a fixed bug), say so ("Updated: answers now include sources by default"). HAX G18 "Notify users about changes".
- **Don't nag.** No feedback prompts in a modal, no "Rate this conversation" interrupt mid-task, at most one end-of-session survey per week per user.

## Anti-patterns (don't)
- A required form after every thumbs-down.
- Thumbs that look pressed but send nothing, or that show no pressed state.
- Feedback silently uploading the whole conversation for training.
- One "Feedback" link that mixes bug reports, quality votes and harm reports in one queue.
- Vague labels: "Like/Dislike" for a feature where the effect is personalisation.
- Popup ratings that block the answer ("How did I do?").

## Good references
- [Apple HIG, Machine learning: explicit feedback](https://developer.apple.com/design/human-interface-guidelines/machine-learning): ask only when necessary, keep it voluntary, label options by what they do, act on feedback immediately and persist it.
- [Google PAIR, Feedback + control](https://pair.withgoogle.com/chapter/feedback-controls/): separate implicit and explicit feedback, use clear wording, and tell users what their feedback does and when.
- [Microsoft HAX G15 and G16](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/): encourage granular feedback; convey the consequences of user actions.
- [OpenAI Data controls FAQ](https://help.openai.com/en/articles/7730893-data-controls-faq): documents that feedback can include the full conversation for training, which is the kind of consequence to disclose at the point of feedback.

## Bad references
- Feedback flows that state their data use only in a help article: the OpenAI FAQ above is good documentation, but users meet the thumbs, not the FAQ. Put the sentence at the thumbs.
- Icon-only reply controls without labels or tooltips ([NN/g, prompt controls](https://www.nngroup.com/articles/prompt-controls-genai/)): participants could not tell what unlabeled icons did.

## Accessibility
- Thumbs are `<button>`s with names "Good response" and "Bad response" and `aria-pressed`. Don't use icon glyphs as the only name.
- The reason chips are a group of toggle buttons (or checkboxes) labelled "What went wrong? (optional)". Focus moves to the group after thumbs-down only if the user clicked with keyboard; pointer users keep their position.
- "Thanks, feedback sent." is announced via a `role="status"` region next to the buttons (polite, no focus move).
- The Report flow is a dialog with a heading, labelled radio group and a cancel path; it returns focus to the overflow button.
- Targets at least 24×24 CSS px; 44 px on touch.

## Motion / interaction (if relevant)
- Pressed state changes colour and fills the icon within 100 ms; no confetti, bounce or celebratory animation.
- The reasons panel expands over 150 ms; under reduced motion it appears without height animation.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| reason chips | 4–6 + Other + optional text | after thumbs-down only |
| `--ai-action-size` | 32px (44px on `pointer: coarse`) | thumbs, copy, regenerate buttons |
| `--ai-action-fg` | `var(--text-muted)`; pressed `var(--accent)` | action row icons |
| confirmation | inline `role="status"`, "Thanks, feedback sent." | no toast-only |
| data-use line | 1 sentence: what, who, training, retention | beside the submit |
| survey cap | ≤ 1 per user per week | end-of-session survey |

## Implementation sketch
```tsx
import { useState } from 'react';

type Vote = 'up' | 'down' | null;
const REASONS = ['Incorrect', 'Not helpful', "Didn't follow instructions", 'Unsafe or offensive', 'Outdated', 'Other'] as const;
type Reason = (typeof REASONS)[number];

export function Feedback({ messageId, send }: {
  messageId: string;
  send: (p: { messageId: string; vote: Vote; reasons: Reason[]; note: string }) => Promise<void>;
}) {
  const [vote, setVote] = useState<Vote>(null);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [status, setStatus] = useState('');

  async function cast(v: Exclude<Vote, null>): Promise<void> {
    const next: Vote = vote === v ? null : v;
    setVote(next);
    await send({ messageId, vote: next, reasons: [], note: '' });   // one click registers
    setStatus(next ? 'Thanks, feedback sent.' : 'Feedback removed.');
  }
  function toggle(r: Reason): void {
    setReasons((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));
  }

  return (
    <div className="ai-feedback">
      <button type="button" aria-pressed={vote === 'up'} onClick={() => cast('up')}>Good response</button>
      <button type="button" aria-pressed={vote === 'down'} onClick={() => cast('down')}>Bad response</button>
      <span role="status" className="ai-meta">{status}</span>
      {vote === 'down' && (
        <form onSubmit={(e) => { e.preventDefault(); void send({ messageId, vote, reasons, note: '' }); }}>
          <fieldset>
            <legend>What went wrong? (optional)</legend>
            {REASONS.map((r) => (
              <button key={r} type="button" aria-pressed={reasons.includes(r)} onClick={() => toggle(r)}>{r}</button>
            ))}
          </fieldset>
          <p className="ai-meta">Sends this conversation to our review team. It may be used to improve the model and is kept for 30 days.</p>
          <button type="submit">Send details</button>
        </form>
      )}
    </div>
  );
}
```
```css
.ai-feedback button { min-inline-size: var(--ai-action-size, 32px); min-block-size: var(--ai-action-size, 32px); color: var(--ai-action-fg, var(--text-muted)); }
.ai-feedback button[aria-pressed="true"] { color: var(--accent); }
@media (pointer: coarse) { .ai-feedback { --ai-action-size: 44px; } }
```

## Checklist
- [ ] Thumbs on every answer, one click registers, `aria-pressed` reflects state.
- [ ] Reasons are optional, shown only after thumbs-down, 4–6 chips plus Other.
- [ ] One sentence at the point of feedback says what is sent, who sees it, training use and retention.
- [ ] Confirmation is inline and announced politely.
- [ ] Report is a separate flow with harm categories and next steps.
- [ ] Feedback can target a passage, source or agent step, not only the whole answer.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/machine-learning
- https://pair.withgoogle.com/chapter/feedback-controls/ (CC BY-NC-SA 4.0; paraphrased)
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- https://help.openai.com/en/articles/7730893-data-controls-faq
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/ARIA/apg/patterns/button/
