# Uncertainty, confidence and hallucination warnings without crying wolf

> Use one quiet, persistent reliability notice for the whole surface, and escalate to a specific, actionable warning only when there is a concrete signal (no supporting source, conflicting sources, computed figures, stale data, a high-stakes domain). Never show a model's raw probability as "confidence" unless it is calibrated against real accuracy.

**Category:** AI foundations · **Applies to:** chat answers, summaries, extracted values, classifications, agent results, AI-filled form fields · **Priority:** must

## When to use / when not
- Any surface that shows model output a user may act on.
- Calibrated confidence (a classifier or extractor whose scores were checked against labelled outcomes) can be shown as a category. Free-text LLM output usually has no calibrated score; there, show evidence (sources, checks) instead of a number.
- Sources and citations have their own file: `aichat-citations-and-sources.md`. Refusals and errors are in `aichat-errors-refusals-limits.md`.

## Rules (do)
- **One baseline notice, near the input, always visible**: one sentence in `--text-muted`, for example "AI can make mistakes. Check important info." Not on every message, not in a modal, not dismissible forever. NN/g criticises notices that scroll out of view and recommends placing disclaimers near the input, in plain words, paired with an action.
- **Escalate only on a signal.** Show a specific inline warning, at the claim, when any of these hold:
  1. a factual claim has no retrieved source supporting it;
  2. retrieved sources disagree;
  3. the answer contains numbers the model computed or transcribed (totals, dates, amounts);
  4. the data is older than the freshness the task needs;
  5. the domain is high-stakes (medical, legal, financial, safety) **and** the answer gives a recommendation.
  The warning names the problem and the check: "No source found for this figure. Verify it in the invoice." A warning without an action is noise.
- **Budget warnings.** If more than about 1 in 5 answers carries an escalated warning, the signal threshold is wrong or the feature should not ship for that domain. Habituation to repeated warnings is well documented (Anderson et al., CHI 2015, fMRI study of security warnings), and Raskin's "never use a warning when you mean undo" argument applies here too.
- **Confidence as categories, not decimals.** When a calibrated score exists, map it to 2–3 bands with fixed meaning ("High: matched in 2 sources", "Low: inferred") and tell users what to do for each band. PAIR shows the confusion of "85.8% vs 87%"; Apple says to show confidence only when it tracks quality and to translate it into familiar concepts.
- **Show alternatives when confidence is low.** N-best options (2–3) beat a single confident guess for ambiguous extractions (PAIR, Apple "multiple options").
- **Hedge in the text itself.** Instruct the model (and check outputs) to state uncertainty in words at the start of the sentence that is uncertain, and to say "I couldn't find…" in the first sentence when it can't help (NN/g "less chat, more answer").
- **Invite verification.** Offer a follow-up chip such as "Check this against sources" or "What is this based on?" NN/g found users verified only 22.4% of conversations while rating trust 6/7, and that polished formatting creates a halo effect.
- **Don't let format imply certainty.** Generated tables and numbers get the same source and freshness affordances as data the system stores. A computed total shows "calculated by AI from 12 rows" until it is checked.
- **Resist sycophancy in the UI.** Do not add "Are you sure?" pressure buttons that make the model flip; NN/g documents models reversing correct answers under that challenge. Offer "Show sources" instead.

## Anti-patterns (don't)
- A red "This may be inaccurate" banner on every message (crying wolf).
- A vague "for reference only" footer with no action (NN/g bad example).
- "Confidence: 87%" on LLM prose, with no calibration and no meaning.
- A disclaimer in a dismissible first-run modal and never again.
- Hiding uncertainty to look polished: confident tone, crisp tables, no source.
- First-person reassurance ("I'm confident this is right").

## Good references
- [Google PAIR, Explainability + Trust](https://pair.withgoogle.com/chapter/explainability-trust/): calibrate trust, decide whether to show confidence at all, use categorical or N-best formats, prompt users to check low-confidence or high-stakes output.
- [Apple HIG, Machine learning: confidence and attribution](https://developer.apple.com/design/human-interface-guidelines/machine-learning): show confidence only when it tracks quality; prefer "Because you…" style attribution over percentages.
- [NN/g, Explainable AI in chat interfaces](https://www.nngroup.com/articles/explainable-ai/): disclaimers near the input, plain words, paired with an action; cites a short "can make mistakes, please double-check" notice as good.
- Gemini's "Double-check response" (launched 2023, [Google blog](https://blog.google/products/gemini/google-bard-new-features-update-sept-2023/)): claim-level highlighting based on a search check, a signal-driven warning rather than a blanket one. The current help page no longer describes it, so treat it as a historical example.

## Bad references
- Google AI Overviews, May 2024 ([Google's own post-mortem](https://blog.google/products/search/ai-overviews-update-may-2024/)): answers drawn from satire and forum jokes were shown above results with no hedge. Google's fix included not showing an overview at all for some queries, the strongest form of "scope services when in doubt" (HAX G10).
- Lawyers in Mata v. Avianca, S.D.N.Y. June 2023 ([opinion and order on sanctions](https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0.pdf)) filed fabricated case citations a chatbot produced; nothing in the output distinguished invented authorities from real ones.
- The IEA site chatbot's disclaimer that scrolls away ([NN/g](https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/)).

## Accessibility
- The baseline notice is linked to the composer with `aria-describedby`; screen-reader users hear it once on focus, not on every message.
- An escalated warning is inline text with an icon and the word "Check" or "Unverified", never colour or a squiggle alone (WCAG 1.4.1). It is part of the message content, so it is read in order.
- Don't put warnings in `role="alert"`: they are not time-critical. WCAG 4.1.3 lists misuse of assertive announcements for non-urgent content as a failure.

## Motion / interaction (if relevant)
- No pulsing or shaking warnings. A warning appears with the content it qualifies, not after it.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| baseline notice | 1 sentence, `--type-meta`, `--text-muted` | under the composer, always visible |
| escalation signals | 5 (unsourced, conflicting, computed, stale, high-stakes advice) | the only reasons to warn |
| warning budget | ≤ ~20% of answers | above it, fix the threshold or the scope |
| confidence bands | 2–3 named bands, each with an action | only for calibrated scores |
| alternatives when low | 2–3 options | ambiguous extractions |
| `--ai-warn-bg` / `--ai-warn-fg` | `var(--warning-bg)` / `var(--warning-fg)` | escalated inline warning |

## Implementation sketch
```ts
type Signal = 'unsourced' | 'conflicting' | 'computed' | 'stale' | 'high-stakes-advice';
type Claim = { id: string; text: string; sourceIds: string[]; conflicting: boolean; computed: boolean; dataAgeDays: number | null };

const WARNING: Record<Signal, string> = {
  unsourced: 'No source found for this. Verify before using it.',
  conflicting: 'Sources disagree on this. Compare them before relying on it.',
  computed: 'Calculated by AI. Check the figure against the source rows.',
  stale: 'Based on data that may be out of date.',
  'high-stakes-advice': 'This is not professional advice. Confirm with a qualified person.',
};

export function signalsFor(c: Claim, opts: { maxAgeDays: number; highStakes: boolean; isAdvice: boolean }): Signal[] {
  const s: Signal[] = [];
  if (c.sourceIds.length === 0) s.push('unsourced');
  if (c.conflicting) s.push('conflicting');
  if (c.computed) s.push('computed');
  if (c.dataAgeDays !== null && c.dataAgeDays > opts.maxAgeDays) s.push('stale');
  if (opts.highStakes && opts.isAdvice) s.push('high-stakes-advice');
  return s;
}

export function warningText(signals: Signal[]): string | null {
  return signals.length ? WARNING[signals[0]] : null; // one warning per claim, the most important first
}
```

## Checklist
- [ ] One baseline notice near the input, visible while typing, `aria-describedby` on the composer.
- [ ] Escalated warnings only for the 5 signals, at the claim, each with a check to do.
- [ ] Under ~20% of answers carry an escalated warning in a sample of 50.
- [ ] No numeric confidence on uncalibrated output; categories with actions otherwise.
- [ ] Computed figures are marked until verified.
- [ ] Warnings are text plus icon, never colour alone, never `role="alert"`.

## Sources
- https://pair.withgoogle.com/chapter/explainability-trust/ (CC BY-NC-SA 4.0; paraphrased)
- https://pair.withgoogle.com/chapter/errors-failing/
- https://developer.apple.com/design/human-interface-guidelines/machine-learning
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- https://www.nngroup.com/articles/explainable-ai/
- https://www.nngroup.com/articles/ai-chatbots-discourage-error-checking/
- https://www.nngroup.com/articles/generative-ai-diary/
- https://www.nngroup.com/articles/sycophancy-generative-ai-chatbots/
- https://www.nngroup.com/articles/less-chat-more-answer/
- https://blog.google/products/search/ai-overviews-update-may-2024/
- https://blog.google/products/gemini/google-bard-new-features-update-sept-2023/
- https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0.pdf
- https://dl.acm.org/doi/10.1145/2702123.2702322 (Anderson et al., polymorphic warnings and habituation, CHI 2015)
- https://alistapart.com/article/neveruseawarning/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.shapeof.ai/patterns/caveat (ideas only)
