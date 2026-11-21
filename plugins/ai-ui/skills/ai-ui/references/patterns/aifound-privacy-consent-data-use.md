# Privacy, data-use notices and consent for AI features

> Tell people, at the point of input, where their prompt, files and feedback go, whether they train a model, who can read them and for how long, and give each choice a control that is two clicks or fewer from the conversation. Anything that widens the audience of a conversation (sharing, publishing, indexing, memory, training) is off by default and asked for in context.

**Category:** AI foundations · **Applies to:** chat composers, file attachments, memory, share links, feedback forms, connectors and agent permissions, enterprise and consumer AI settings · **Priority:** must

## When to use / when not
- Every AI feature that sends user content to a model or stores it. On-device features still need a notice (what stays local, what doesn't).
- Agent permissions to act (send, pay, delete) are in `aiagent-approval-and-audit.md`; this file covers data. Feedback consent is detailed in `aichat-feedback-and-reporting.md`.
- This is design guidance, not legal advice. Legal requirements (GDPR lawful basis, sector rules) still need review.

## Rules (do)
- **Short notice at the input, full policy one click away.** One line under the composer or in the AI panel header: "Chats are kept 30 days and are not used to train models. Data settings". The link opens the setting itself, not a policy PDF.
- **Name the four facts:** (1) is content used to train or improve models, (2) retention period, (3) whether humans may review it (and when, such as abuse checks or feedback), (4) which third parties process it. Use the same wording in the notice, the settings page and the policy.
- **Training is a control, not a clause.** A visible toggle ("Improve the model with my chats") in settings, reachable from the conversation in ≤ 2 clicks. Default it off for sensitive or enterprise contexts. If it is on by default for consumers, say so at first use.
- **Offer a temporary mode.** A temporary or incognito chat that is not saved to history, not used for training and creates no memories, with a persistent visual state (label plus border or header change) so nobody forgets it is on. If temporary chats are still kept for a safety window, state the window ("deleted after 30 days").
- **Memory is visible and editable.** When the assistant remembers something, say so inline ("Saved to memory: prefers metric units · Manage"), and give a list where each item can be viewed, edited and deleted, plus "Turn off memory".
- **Sharing widens the audience: confirm what and to whom.** A share dialog shows a preview of exactly what is shared (which messages, attachments, the user's name or not), the audience (link holders, workspace, public) and whether search engines can index it. Indexing is never a checkbox inside the share flow; default to `noindex`.
- **Warn before sensitive input leaves the device.** When a paste or attachment matches a sensitive pattern (credentials, card numbers, national IDs, a file marked confidential), show an inline warning before sending with "Remove" and "Send anyway". Enterprise policies can block.
- **Minimise what is sent.** Send the selected text or the current document, not the whole workspace; list connected sources the assistant can read ("Can read: Drive folder 'Q3', Calendar") with a control to disconnect each.
- **Ask for permissions per step, just in time.** Request location, contacts or account access when a step needs it, explaining why, not as a bundle at onboarding (NN/g's agent study found a buried permission notice made users feel their data had leaked).
- **Label AI-generated output that leaves the product.** Exports, shared images and published text carry the AI disclosure (EU AI Act Article 50; see `aifound-expectations-and-identity.md`).
- **Deletion works and says what it deletes:** deleting a chat removes its attachments and derived memories, or says plainly what it keeps and for how long.

## Anti-patterns (don't)
- "By using this feature you agree to our Terms" as the only notice.
- A share dialog with a small "make discoverable" checkbox.
- Training opt-out buried three levels deep in account settings, or only via a support form.
- Thumbs-down that silently attaches the whole conversation for human review.
- Memory that stores personal facts with no indication and no list.
- Incognito mode with no persistent visual state.

## Good references
- [OpenAI, Temporary Chat FAQ](https://help.openai.com/en/articles/8914046-temporary-chat-faq): not in history, not used for training, no memories, kept up to 30 days for safety, and the page says so.
- [Claude, incognito chats](https://support.claude.com/en/articles/12260368-using-incognito-chats): a ghost icon, a persistent border and an "Incognito chat" label make the mode visible for the whole session.
- [OpenAI, Data controls FAQ](https://help.openai.com/en/articles/7730893-data-controls-faq): a named "Improve the model for everyone" toggle, and it states that feedback can send the conversation for training even when that toggle is off. Disclose that kind of exception at the feedback control.
- [modern-web-guidance, privacy guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/privacy/privacy.md): data minimisation, purpose limitation and transparency for web developers (Apache-2.0).

## Bad references
- Shared chats indexed by search engines, 2025 ([The Register](https://www.theregister.com/2025/08/01/openai_removes_chatgpt_selfdoxing_option/)): a "make this chat discoverable" checkbox in the share dialog led to thousands of chats in search results; the vendor removed it, saying it created too many chances to share by accident.
- Confidential data pasted into a public chatbot, 2023 ([The Register on Samsung's ban](https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/)): staff reportedly pasted internal material; the company banned generative AI tools. The input gave no cue about where data went.
- A buried data permission in an agent flow ([NN/g, designing AI agents](https://www.nngroup.com/articles/designing-ai-agents/)): users felt their data had leaked.

## Accessibility
- The data notice is text linked to the composer with `aria-describedby`.
- Toggles are real switches (`role="switch"` or a checkbox) with labels that say what "on" means ("Use my chats to improve models").
- The temporary-mode state is announced on entry ("Temporary chat on. This chat won't be saved.") via a polite status, and is visible in text, not only by border colour.

## Motion / interaction (if relevant)
- No motion needed. A mode change (temporary on/off) may use one 240 ms colour transition on the header.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| notice | 1 line, `--type-meta`, `--text-muted`, under the composer | data-use summary + link to settings |
| setting depth | ≤ 2 clicks from the conversation | training, memory, retention, connectors |
| `--ai-private-border` | `2px solid var(--text)` | temporary / incognito mode frame, plus a text label |
| share default | private, `noindex` | share links |
| sensitive paste warning | inline, before send, "Remove" / "Send anyway" | credentials, IDs, card numbers |
| retention statement | a number of days, not "for a period" | notice, settings, policy |

## Implementation sketch
```tsx
import { z } from 'zod';

// Server-provided data policy, validated before it is shown as a promise to the user.
const DataPolicy = z.object({
  trainsOnChats: z.boolean(),
  retentionDays: z.number().int().positive(),
  humanReview: z.enum(['never', 'on-feedback', 'abuse-checks']),
  temporary: z.boolean(),
});
type DataPolicy = z.infer<typeof DataPolicy>;

export function DataNotice({ raw, onOpenSettings }: { raw: unknown; onOpenSettings: () => void }) {
  const parsed = DataPolicy.safeParse(raw);
  if (!parsed.success) return <p id="ai-data" className="ai-meta">Data settings unavailable. <button type="button" onClick={onOpenSettings}>Open settings</button></p>;
  const p: DataPolicy = parsed.data;
  const parts = [
    p.temporary ? 'Temporary chat: not saved to history' : `Kept ${p.retentionDays} days`,
    p.trainsOnChats ? 'used to improve models' : 'not used to train models',
    p.humanReview === 'on-feedback' ? 'reviewed by people only if you send feedback' : null,
  ].filter((s): s is string => s !== null);
  return (
    <p id="ai-data" className="ai-meta">
      {parts.join(' · ')}. <button type="button" className="link" onClick={onOpenSettings}>Data settings</button>
    </p>
  );
}

const SENSITIVE: ReadonlyArray<[string, RegExp]> = [
  ['an access key', /\b(?:sk|pk|ghp|xox[bp])[-_][A-Za-z0-9_-]{16,}\b/],
  ['a card number', /\b(?:\d[ -]?){13,19}\b/],
];
export function sensitiveMatch(text: string): string | null {
  for (const [label, re] of SENSITIVE) if (re.test(text)) return label;
  return null;
}
```

## Checklist
- [ ] A one-line data notice under the input states training, retention and human review, with a link to the settings.
- [ ] Training, memory and retention controls are ≤ 2 clicks from the chat.
- [ ] Temporary mode exists and is visibly on (label plus frame) for the whole session.
- [ ] Memory writes are shown inline and are listable, editable and deletable.
- [ ] Share links default to private and `noindex`, with a preview of what is shared.
- [ ] Sensitive pastes and attachments are flagged before sending.
- [ ] Permissions are requested per step, with a reason.

## Sources
- https://help.openai.com/en/articles/8914046-temporary-chat-faq
- https://help.openai.com/en/articles/7730893-data-controls-faq
- https://support.claude.com/en/articles/12260368-using-incognito-chats
- https://www.theregister.com/2025/08/01/openai_removes_chatgpt_selfdoxing_option/
- https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/
- https://www.nngroup.com/articles/designing-ai-agents/
- https://artificialintelligenceact.eu/article/50/
- https://developer.apple.com/design/human-interface-guidelines/machine-learning (implicit feedback: let people control their information)
- https://pair.withgoogle.com/chapter/data-collection/ (CC BY-NC-SA 4.0; paraphrased)
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G17 provide global controls)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/privacy/privacy.md (Apache-2.0)
- https://www.shapeof.ai/pattern-types/trust-builders (ideas only: consent, data ownership, incognito mode)
