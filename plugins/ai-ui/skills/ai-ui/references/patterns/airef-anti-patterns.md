# AI-UI anti-patterns, with good and bad references

> Twelve recurring failures of AI interfaces, each with the real-world case that shows the cost, the pattern that fixes it, and the rubric IDs that catch it. Check a design against all twelve before scoring it.

**Category:** AI references and review · **Applies to:** any chat, copilot, inline AI or agent surface under design or review · **Priority:** must

## When to use / when not
- Run it in design critique and before `airef-review-rubric.md`; it's the fast pass that finds the expensive problems.
- Product names here are evidence, not endorsements or verdicts on current products; most of these vendors changed their designs after the incidents. The fixes are vendor-neutral.

## Rules (do)
Check each anti-pattern; for each hit, record the evidence and apply the fix file.

| # | Anti-pattern | Real-world evidence | Fix | Rubric |
|---|---|---|---|---|
| 1 | **The bot speaks for the company with no grounding.** Policy, price or legal answers generated without retrieval or citation. | A tribunal held an airline liable for its chatbot inventing a refund policy (Moffatt v. Air Canada, 2024). | Ground answers in the source document, cite it, and say the written policy wins (`aichat-citations-and-sources.md`, `aifound-uncertainty-and-disclaimers.md`). | D1, D3 |
| 2 | **Confident answers above sources, no scope limit.** Showing generated answers for any query, in the most authoritative position. | AI search answers in May 2024 repeated satire and forum jokes; the fix included not answering some query types at all (Google's post-mortem). | Scope the feature; skip AI output when retrieval is weak; signal-driven warnings (`aifound-uncertainty-and-disclaimers.md`). | D3, A2 |
| 3 | **Fabricated citations that look real.** References rendered the same whether or not they were retrieved. | Lawyers sanctioned for filing invented case citations from a chatbot (Mata v. Avianca, 2023). | Only cite retrieved documents; link to the passage; mark unsourced claims (`aichat-citations-and-sources.md`). | D1 |
| 4 | **Agents with unchecked write access to production.** No tiering, no dev/prod split, no approval for destructive actions. | An AI coding agent deleted a production database during a code freeze and misreported it (July 2025). | Tier tools in code; tier 3 for production; plan mode; audit log written by the tool layer (`aiagent-approval-and-audit.md`). | I1, I3 |
| 5 | **Silent consequential choices.** The agent changes the user's request (time, price, recipient) without asking. | A browsing agent changed a booking time and let a hold window expire (NN/g, 2025); hidden fees appeared only at an agent checkout (NN/g, 2026). | Clarify up front; approval with the exact payload and all costs (`aiagent-approval-and-audit.md`). | I1, I2 |
| 6 | **Audience-widening hidden in a routine flow.** Indexing, publishing or training as a small checkbox. | Shared chats became searchable through a "discoverable" checkbox in the share dialog (2025); the option was removed. | Private, `noindex` defaults; preview of what is shared; training as a named setting (`aifound-privacy-consent-data-use.md`). | G1, G2 |
| 7 | **No cue about where pasted data goes.** | A large company banned public chatbots after staff pasted internal material (2023). | Data notice at the input; sensitive-paste warning; enterprise controls (`aifound-privacy-consent-data-use.md`). | G1 |
| 8 | **Crying wolf.** The same red disclaimer on every answer, or a vague "for reference only". | NN/g documents disclaimers that scroll away or offer no action; warning habituation is measured in fMRI work (Anderson et al., 2015). | One quiet notice near the input; escalate only on a signal, with an action (`aifound-uncertainty-and-disclaimers.md`). | D2, D3 |
| 9 | **Token spam and forced scrolling.** Every chunk read aloud; the view yanked to the bottom while the user reads. | NN/g's 2026 chatbot guidelines call out bots that autoscroll during streaming; ARIA `aria-busy` support is inconsistent, so naive live regions misbehave. | Batched rendering, completion announcement, stick-to-bottom only at the bottom (`aichat-streaming-text.md`). | B3, H1 |
| 10 | **Enter sends half-composed CJK text.** | The IME-safe Enter guide documents chat apps sending messages while users confirm IME candidates; Safari's event order needs the keyCode 229 check. | `isComposing` + 229 check, Shift+Enter newline, touch Enter = newline (`aichat-prompt-input.md`). | C1 |
| 11 | **Regenerate destroys the previous answer; rewrite replaces text silently.** | NN/g's "accordion editing" and "apple picking" findings: users want to keep and combine parts of earlier answers. | Version tree with a pager; hunk-level diffs with one-step undo (`aichat-edit-regenerate-branching.md`, `aiinline-ghost-text-and-diffs.md`). | E1, E2, E3 |
| 12 | **Mystery-meat AI.** A sparkle icon as the only label; branded feature names; human personas. | No respondent in NN/g's 107-person survey linked the sparkles icon to AI. | Text labels, plain feature names, no impersonation (`aifound-expectations-and-identity.md`). | A1, A4 |

## Anti-patterns (don't)
- Treating this list as complete. New failure modes (for example prompt injection through retrieved pages) arrive with new capabilities; add them with evidence and a rubric mapping.
- Citing an incident as a verdict on a product today; cite it as evidence of a failure mode.

## Good references
- [VS Code agent approvals](https://code.visualstudio.com/docs/agents/approvals): per-command checks, scoped grants, and a notice naming the rule that auto-approved a command (counter to #4 and #5).
- [GitHub Copilot inline suggestions](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions): Tab, Esc, cycle and word-by-word accept; the de facto ghost-text contract (counter to #11).
- [Temporary chat](https://help.openai.com/en/articles/8914046-temporary-chat-faq) and [incognito chat](https://support.claude.com/en/articles/12260368-using-incognito-chats) modes with a persistent visual state (counter to #6 and #7).
- [Perplexity, how answers are cited](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work): numbered citations linking to the original sources (counter to #1 and #3; still check that each link supports the claim).
- [NN/g, Explainable AI in chat interfaces](https://www.nngroup.com/articles/explainable-ai/): citations next to the claim, linking to the exact passage; disclaimers near the input with an action.

## Bad references
- [ABA on Moffatt v. Air Canada (2024)](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/) (#1).
- [Google, "AI Overviews: About last week" (2024)](https://blog.google/products/search/ai-overviews-update-may-2024/) (#2).
- [Mata v. Avianca sanctions order (2023)](https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/575368/54/) (#3).
- [The Register on the production-database deletion (2025)](https://www.theregister.com/2025/07/22/replit_saastr_response/) (#4).
- [NN/g, first look at a browsing agent (2025)](https://www.nngroup.com/articles/impressions-chatgpt-agent/) and [NN/g, designing AI agents (2026)](https://www.nngroup.com/articles/designing-ai-agents/) (#5).
- [The Register on discoverable shared chats (2025)](https://www.theregister.com/2025/08/01/openai_removes_chatgpt_selfdoxing_option/) (#6).
- [The Register on the generative AI ban after a leak (2023)](https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/) (#7).
- [NN/g, AI chatbots discourage error checking](https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/) (#8).
- [NN/g, 10 guidelines for site AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/) (#9).
- [Microsoft Bing, chat turn limits (Feb 2023)](https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat): 5 turns per session and 50 per day because very long sessions confused the model, with a broom icon to clear context that NN/g later found unclear. A cap is a valid fix, but it needs a clear explanation and a labelled "New topic" control (see `aichat-errors-refusals-limits.md`).

## Accessibility
- Anti-patterns 9, 10 and 12 are accessibility failures first (screen-reader noise, IME users, icon-only labels). Treat them as must-fix.

## Motion / interaction (if relevant)
- Forced auto-scroll (#9) is also a motion problem: it moves content the user is reading. Under `prefers-reduced-motion: reduce`, never smooth-scroll to new content.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| anti-patterns | 12, each mapped to rubric IDs | fast pre-review pass |
| must-fix | #1, #3, #4, #6, #9, #10, #12 | map to must-checks D1, I1, G1, H1, C1, A1/A4 |
| evidence per hit | screenshot or recording + the rubric ID | review report |

## Implementation sketch
```ts
type Hit = { pattern: number; evidence: string; rubricIds: string[]; fixFile: string };

const MUST_FIX = new Set([1, 3, 4, 6, 9, 10, 12]);

export function triage(hits: readonly Hit[]): { mustFix: Hit[]; other: Hit[] } {
  const mustFix = hits.filter((h) => MUST_FIX.has(h.pattern));
  const other = hits.filter((h) => !MUST_FIX.has(h.pattern));
  return { mustFix, other };
}
```

## Checklist
- [ ] All 12 checked against the evidence kit of `airef-review-rubric.md`.
- [ ] Each hit recorded with evidence, rubric ID and fix file.
- [ ] Must-fix hits (#1, #3, #4, #6, #9, #10, #12) resolved before scoring.
- [ ] New failure modes found in review added with evidence and a rubric mapping.

## Sources
- https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/
- https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot
- https://blog.google/products/search/ai-overviews-update-may-2024/
- https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/575368/54/
- https://www.theregister.com/2025/07/22/replit_saastr_response/
- https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/
- https://www.theregister.com/2025/08/01/openai_removes_chatgpt_selfdoxing_option/
- https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/
- https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
- https://www.nngroup.com/articles/designing-ai-agents/
- https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.nngroup.com/articles/accordion-editing-apple-picking/
- https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- https://www.nngroup.com/articles/prompt-controls-genai/
- https://www.nngroup.com/articles/explainable-ai/
- https://dl.acm.org/doi/10.1145/2702123.2702322
- https://code.visualstudio.com/docs/agents/approvals
- https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions
- https://help.openai.com/en/articles/8914046-temporary-chat-faq
- https://support.claude.com/en/articles/12260368-using-incognito-chats
- https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md (Apache-2.0)
