# Set expectations: say it is AI, what it can do and how well

> Before the first prompt and at every AI surface, tell people that they are dealing with an AI system, what it can do here, how reliable it is, and what it cannot do. Do it in plain words beside the feature, not in marketing copy or a terms page.

**Category:** AI foundations · **Applies to:** chat entry points, copilots, inline AI buttons, agent launchers, onboarding, AI labels on generated content · **Priority:** must

## When to use / when not
- Every product surface that runs a model: chat, summaries, suggestions, autofill, generated images, agents acting for the user.
- It also covers the HAX "Initially" phase (G1, G2) and the identity part of Apple's generative AI guidance. The later phases of HAX map onto other files: correction (G9) to `aichat-edit-regenerate-branching.md`, dismissal (G8) to `aiinline-ghost-text-and-diffs.md`, feedback (G15) to `aichat-feedback-and-reporting.md`, global controls (G17) to `aifound-privacy-consent-data-use.md`.
- Don't label things that are not generative or model-driven (a sort order, a rules engine) as "AI". The label is a promise about how the output was made.
- Not every AI feature needs a chat. NN/g warns against bolting chat onto products where prediction, personalisation or automation would serve better; decide that first.

## Rules (do)
- **Identify AI in text.** Every entry point and every generated artefact carries a text label ("AI summary", "Drafted with AI", "Assistant"). An icon alone fails: in NN/g's 107-person survey nobody linked the sparkles icon to AI and 16.8% read it as favourite or save. Pair any icon with a word.
- **State the scope in one sentence** at the entry point (empty state, launcher tooltip, panel header): what it can do here, over which data ("Answers questions about your invoices from 2023 on"). Use 1–3 capability examples, not a feature list.
- **State reliability in one sentence, once, near the input**: "Answers can be wrong. Check figures against the source." Place it where it stays visible while typing (NN/g found a notice that scrolls away is effectively absent). Details of when to escalate a warning are in `aifound-uncertainty-and-disclaimers.md`.
- **State the limits that matter for this task**: knowledge cut-off or data freshness, which data it cannot see, which actions it cannot take, and language support. Put each limit where the user would otherwise hit it (a "can't see attachments over 20 MB" note next to the attach button, not after upload: NN/g's bad example reports a file limit only after upload).
- **Never pass AI off as a person.** No human names with stock photos, no "typing…" human metaphors, no first-person emotional claims. EU AI Act Article 50(1) requires that people be informed that they are interacting with an AI system unless it is obvious; it applies from 2 August 2026.
- **Name features plainly.** "Summarise", "Rewrite shorter", "Ask about this page", not branded names or magic-wand metaphors (NN/g: nobody in the study understood a magic-wand icon).
- **Mark generated content where it lands.** A persistent, low-key "AI-generated" label on summaries, drafts, alt text and images, kept after the user edits until they accept it as their own. Article 50(2) requires machine-readable marking of synthetic content; render a visible label as well.
- **Onboard in stages.** Introduce a capability when it becomes useful (first time a long document is opened, show "Summarise"), not in a 6-screen tour (PAIR: mental models; Apple: set expectations before use).
- **Offer a non-AI path** for every critical task (manual form, search, human support). Apple's generative AI guidance and PAIR both call for a fallback.

## Anti-patterns (don't)
- A sparkle or wand icon as the only cue for "AI".
- "Ask me anything" on an assistant that can only answer about one product area.
- Persona chatbots with a human first name and avatar that never say they are automated.
- Capability claims in onboarding that the model fails on in the first session ("understands any document").
- Limitations only in the terms of service or a help article.
- Labelling everything with "AI" so the label stops meaning anything.

## Good references
- [Microsoft HAX guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/): G1 "Make clear what the system can do" and G2 "Make clear how well the system can do what it can do" open the 18 guidelines (Amershi et al., CHI 2019).
- [Google PAIR, Mental models](https://pair.withgoogle.com/chapter/mental-models/): explain the benefit, not the technology; avoid "AI magic" framing; onboard in stages; be clear it is an algorithm.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): identify where AI is used, never present AI content as human-authored, set expectations about what it can and can't do.
- [NN/g, 10 guidelines for site AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/): one consistent entry point, and a statement of what the bot can do with suggestions that fit the current page.

## Bad references
- Air Canada's site chatbot ([ABA summary of Moffatt v. Air Canada, 2024](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/)): it stated a refund policy that didn't exist; the tribunal held the airline liable and rejected the idea that the bot was a separate entity. Nothing told the customer that the written policy took precedence.
- Generic sparkles-only AI buttons ([NN/g, the sparkles icon problem](https://www.nngroup.com/articles/ai-sparkles-icon-problem/)): the icon reads as "favourite" more often than as AI.

## Accessibility
- The AI label is real text in the DOM (or the accessible name), never only a CSS `content` glyph. If a decorative glyph sits next to it, give it empty alt text: `content: "✦" / "";` (see the modern-web-guidance guide on accessible generated content).
- Label the assistant region: `<aside aria-label="Assistant">` or a heading "Assistant" so screen-reader users can jump to it.
- Capability and limit text is associated with the input via `aria-describedby`, so it is read when the field gets focus.

## Motion / interaction (if relevant)
- No attention-seeking animation on AI entry points (pulsing gradients, shimmer on idle). One 240 ms fade on first reveal is enough.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-label-font` | `var(--type-meta)` (0.75rem/400) | "AI-generated" labels |
| `--ai-label-fg` | `var(--text-muted)` (≥ 4.5:1) | label colour; never below text contrast |
| capability statement | 1 sentence + 1–3 examples | entry point / empty state |
| reliability statement | 1 sentence, visible while typing | below the composer |
| AI label on artefacts | kept until the user accepts or edits and confirms | summaries, drafts, alt text |

## Implementation sketch
```tsx
type AiSurfaceProps = {
  scope: string;          // "Answers questions about your invoices from 2023 on."
  limits: string[];       // ["Can't see attachments over 20 MB", "No access to bank feeds"]
  examples: string[];     // 1–3
};

export function AiEntry({ scope, limits, examples }: AiSurfaceProps) {
  return (
    <section aria-labelledby="ai-entry-title" className="ai-entry">
      <h2 id="ai-entry-title"><span className="ai-badge">AI</span> Assistant</h2>
      <p id="ai-scope">{scope}</p>
      <ul aria-label="Examples">{examples.slice(0, 3).map((e) => <li key={e}>{e}</li>)}</ul>
      <p id="ai-limits" className="ai-meta">{limits.join(' · ')}</p>
      <label htmlFor="ai-input">Ask the assistant</label>
      <textarea id="ai-input" aria-describedby="ai-scope ai-limits ai-reliability" />
      <p id="ai-reliability" className="ai-meta">Answers can be wrong. Check figures against the source.</p>
    </section>
  );
}
```
```css
.ai-badge::before { content: "✦ "; content: "✦ " / ""; } /* decorative; the word "AI" is the label */
.ai-meta { font: var(--type-meta); color: var(--text-muted); }
```

## Checklist
- [ ] Every AI entry point and artefact has a text label, not only an icon.
- [ ] One-sentence scope plus 1–3 examples at the entry point.
- [ ] A one-sentence reliability notice stays visible while typing.
- [ ] Limits appear where the user would hit them, before the failure.
- [ ] No human persona; the system says it is automated.
- [ ] A non-AI path exists for every critical task.

## Sources
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- https://pair.withgoogle.com/chapter/mental-models/ (CC BY-NC-SA 4.0; paraphrased)
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://developer.apple.com/design/human-interface-guidelines/machine-learning
- https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.nngroup.com/articles/ai-chat-not-the-answer/
- https://artificialintelligenceact.eu/article/50/
- https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/
- https://www.shapeof.ai/pattern-types/identifiers (ideas only; CC BY-NC-SA, no text reused)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md (Apache-2.0)
