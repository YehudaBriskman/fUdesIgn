# AI-UI review rubric

> Score each AI surface (chat, inline AI, agent run) on 39 checks in 9 sections, 0–2 points each against explicit criteria with evidence. Ship at 80% or more with no "must" check at 0.

**Category:** AI references and review · **Applies to:** chat assistants, copilots and side panels, inline AI in editors and forms, agent run views, AI settings · **Priority:** must

## When to use / when not
- Design review, pre-release review, and audits of an existing or competing AI feature.
- An agent can run most checks with a scriptable browser, a screen reader and a throttled network. **[DOM]** = verified in markup or computed styles, **[VIS]** = on a screenshot, **[INT]** = by interacting, **[AT]** = with a screen reader, **[NET]** = with network conditions or a mocked backend.
- Not a substitute for evaluating the model's answer quality. The rubric scores the interface around the model: whether people can tell what it is, steer it, check it, correct it, stop it and recover.

## Rules (do)
**Scoring unit:** score each surface type separately (chat, inline, agent). Sections that don't apply to a surface are N/A for that surface (for example section I for a plain chat without tools). Score = points ÷ (2 × applicable checks), rounded down. A must-check at 0 blocks shipping whatever the total.

**Stable IDs:** IDs (A1 … I4) never change meaning and are never renumbered; new checks take the next free number; retired IDs are not reused. `airef-anti-patterns.md` cites these IDs.

**Bands:** ≥ 80% ship · 65–79% ship with tracked fixes · < 65% redesign. Any must-check at 0 means redesign.

**Evidence kit:** screenshots of the empty state, a streaming answer, a finished answer with sources, an error, and (if present) an approval prompt; a screen-reader recording of one full send-and-answer cycle; one run with the backend returning 429, one with 500, one with a refusal, and one with the network cut mid-stream; one run under "Slow 4G"; the DOM of one finished answer; one run with `prefers-reduced-motion: reduce`.

### A. Identity and expectations (`aifound-expectations-and-identity.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| A1 (must) | AI is identified in text at each entry point and on generated artefacts | [VIS] entry buttons, panel header, generated summaries and drafts | Text label everywhere | Some places icon-only | Icon-only or unlabeled everywhere | Add "AI …" text labels |
| A2 | Scope is stated at the entry point with 1–3 examples | [VIS] empty state / launcher | Scope sentence + examples | Examples only, or generic "Ask me anything" | Nothing | Add one scope sentence |
| A3 | Relevant limits appear before the user hits them | [INT] attach an oversized file; ask about out-of-scope data | Limit shown before the action | Shown after failure with a clear reason | Silent failure or generic error | Put limits next to the control |
| A4 (must) | No human impersonation | [VIS] name, avatar, copy | Clearly automated | Human-like name but labelled AI | Presented as a person | Remove persona or label it |

### B. Conversation and streaming (`aichat-layout-and-message-anatomy.md`, `aichat-streaming-text.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| B1 | Answer column is readable: prose ≤ ~75ch, user and assistant turns distinguishable by more than colour | [DOM] measure `max-inline-size`; [VIS] greyscale | Both | One | Neither | Cap the measure; add alignment or labels |
| B2 (must) | Stop is available during generation, in the Send position, and halts rendering within 100 ms | [INT] stop mid-stream | All three | Stop exists elsewhere or halts late | No stop | Morph Send into Stop; abort the stream |
| B3 | No forced auto-scroll: if the user scrolls up mid-stream, the view stays put and a "Jump to latest" control appears | [INT] | Yes | Stays put, no jump control | Yanks the view down | Stick-to-bottom only when at bottom |
| B4 | Streaming causes no layout shift above the growing message and the action row doesn't push content on completion | [VIS]/[DOM] record a stream; Layout Shift regions | No shifts | Minor shift on completion | Content above moves | Reserve space; pin layout |
| B5 | Partial output is kept and marked after Stop or a mid-stream error | [INT]/[NET] | Kept + "Stopped"/error label + Retry | Kept, unlabelled | Discarded | Keep partial text, add a status line |

### C. Prompt input (`aichat-prompt-input.md`, `aichat-empty-state-and-suggestions.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| C1 (must) | Enter is IME-safe: composing Japanese/Chinese/Korean text with Enter doesn't send | [INT] use an IME, confirm a candidate with Enter | Never sends mid-composition (incl. Safari) | Works except Safari keyCode 229 | Sends mid-composition | Check `isComposing` and keyCode 229 |
| C2 | Multiline: Shift+Enter inserts a newline; the field grows to a cap, then scrolls; on touch Enter inserts a newline | [INT] | All | Two | One or none | `field-sizing: content` + max block size |
| C3 | Draft survives navigation, reload and errors | [INT] type, reload; trigger an error | Survives all | Survives some | Lost | Persist the draft per conversation |
| C4 | Attachments show type, size, progress and a named remove control, with limits before upload | [INT]/[DOM] | All | Missing limits or names | No feedback | Chips with progress and labels |
| C5 | Starter suggestions are concrete and context-aware (3–4), follow-ups ≤ 3 below answers | [VIS] | Both | Generic starters or too many | None or 6+ generic | Derive from page context |

### D. Trust: sources and uncertainty (`aichat-citations-and-sources.md`, `aifound-uncertainty-and-disclaimers.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| D1 (must) | Factual claims from retrieval have citations next to the claim that open the supporting passage | [INT] open 5 citations | All lead to the supporting passage | Lead to the document, not the passage | No citations, or broken/irrelevant links | Store spans; deep-link |
| D2 | A reliability notice is visible near the input while typing | [VIS] | Visible, 1 line | Only first-run or scrolls away | None | Put it under the composer |
| D3 | Escalated warnings are signal-driven and actionable; ≤ ~20% of 50 sampled answers carry one | [INT] sample 50 answers | Both | Actionable but over budget | Blanket warnings on everything, or none on unsourced numbers | Gate warnings on the 5 signals |
| D4 | No uncalibrated numeric confidence | [VIS] | None, or calibrated bands with meaning | Bands without meaning | Raw percentages on LLM output | Use evidence or calibrated categories |

### E. Control and correction (`aichat-edit-regenerate-branching.md`, `aiinline-ghost-text-and-diffs.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| E1 | Users can edit a sent prompt and regenerate an answer without losing earlier versions | [INT] edit, regenerate, navigate back | Versions navigable (‹ n / m ›) | Possible but old version lost | Neither | Tree model with a version pager |
| E2 (must) | AI changes to the user's existing content are shown as a diff and accepted explicitly | [INT] run a rewrite | Diff with per-change accept/reject | Diff, accept-all only | Silent replace | Hunk review |
| E3 | Every accepted AI change is one undo away | [INT] accept, then ⌘/Ctrl+Z | One step | Several steps | Not undoable | Group into one transaction |
| E4 | Ghost text: Tab accepts only while shown, Esc dismisses, ≥ 4.5:1 and distinct by more than colour | [INT]/[DOM] | All | One missing | Tab trap or invisible text | Scope the key handler; fix colour |

### F. Errors, refusals and feedback (`aichat-errors-refusals-limits.md`, `aichat-feedback-and-reporting.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| F1 (must) | The user's prompt is never lost on any error | [NET] 500, 429, network cut | Prompt kept and retryable | Kept but must be re-sent manually | Lost | Keep the turn; Retry in place |
| F2 | Errors are inline in the message slot, say what happened and what to do | [NET] | All error types | Some generic | Toast-only or "Something went wrong" | Category-specific copy |
| F3 | Rate limits state the limit, the reset time (absolute, local) and what still works | [NET] 429 | All three | Reset time only | "Try again later" | Read Retry-After; show alternatives |
| F4 | Refusals say so in the first sentence and offer an alternative, without blaming | [INT] trigger a refusal | Both | One | Disguised as an error or a lecture | Rewrite refusal template |
| F5 | Feedback is one click, optional reasons, says what happens to the data; harm reporting is separate | [INT] | All | Missing data notice or separate report | Required form or none | Thumbs + chips + notice |

### G. Privacy and consent (`aifound-privacy-consent-data-use.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| G1 (must) | Training use, retention and human review are stated near the input, with a control ≤ 2 clicks away | [VIS]/[INT] | All | Stated but control is deep | Only in terms | Add a notice + settings link |
| G2 | Sharing previews content and audience; links are private and `noindex` by default | [INT]/[DOM] | Both | One | Discoverable by default or by a checkbox in the flow | Fix defaults |
| G3 | Memory writes are visible and editable; temporary mode is visibly on | [INT] | Both | One | Neither | Inline memory notice; mode frame |

### H. Accessibility and performance (`aifound-accessible-generated-content.md`, `aifound-latency-and-perceived-performance.md`, `aichat-markdown-code-tables.md`, `aichat-thinking-and-step-progress.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| H1 (must) | A screen reader hears each answer once, after it completes (or as a short announcement), not per token; focus never moves while streaming | [AT] NVDA and VoiceOver | Both readers | One reader | Token spam or silence | Polite region from load + completion announce |
| H2 | Generated markdown renders as semantic HTML: demoted headings, tables with `th`, labelled code with named copy buttons | [DOM] | All | Some | Divs, ASCII tables | Post-process the sanitised HTML |
| H3 (must) | Output is sanitised and remote images or raw HTML from the model are not rendered | [DOM] inject `<img src=…>` and `<script>` via a crafted prompt | Neither renders | Images render from an allow-list only | Either renders | Sanitise the full output; block remote images |
| H4 | Phase budgets: ack ≤ 100 ms, first output ≤ 1 s p75 (≤ 2 s acceptable), INP ≤ 200 ms while streaming | [NET]/field data | All | First output 1–2 s or one budget missed | Several missed | Warm sessions; batch rendering |
| H5 | Waits over 10 s show named steps, elapsed time and Cancel | [NET] slow run | All | Steps without cancel | Spinner only | Step list with Stop |

### I. Agents and agent-readable UI (`aiagent-approval-and-audit.md`, `aiagent-webmcp-agent-readable-ui.md`)
| ID | Check | Recipe | 2 | 1 | 0 | Typical fix |
|---|---|---|---|---|---|---|
| I1 (must) | Irreversible, external, money and production actions ask first and show the exact payload | [INT] trigger send/pay/delete | All, with payload | Ask with summary only | Run without asking | Tier tools in code |
| I2 | Approval defaults focus away from Approve, never times out to Approve, and offers scoped grants for tier 2 only | [INT] | All | Two | One or none | Fix the card |
| I3 | Stop halts before the next tool call; the audit log records time, actor, input, result, approval and undo | [INT] stop mid-run; open the log | Both | One | Neither | Check the signal per call; log in the tool layer |
| I4 | Page controls are agent-readable (labels, roles, states, URL state); any WebMCP tools are feature-detected and destructive forms omit auto-submit | [DOM] accessibility tree; tool definitions | All | Most | Div soup or auto-submit on destructive forms | Semantic HTML; fix tool flags |

## Anti-patterns (don't)
- Scoring the model's answers instead of the interface (use a separate eval for answer quality).
- Skipping the [NET] and [AT] checks because they take longer; those catch most must-failures.
- Averaging away a must-check at 0.
- Re-using retired IDs.

## Good references
- [Microsoft HAX guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/): the 18 guidelines grouped by phase (initially, during interaction, when wrong, over time); sections A, D, E, F and G map onto them.
- [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook/): chapters on mental models, explainability and trust, feedback and control, and errors and graceful failure.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): control, transparency, confirmation and output guidance used in E, I and A.
- The dashboard skill's `ref-design-review-rubric.md`: the same scoring mechanics (0–2 per check, must-checks, bands, stable IDs).

## Bad references
- Reviews that only check the happy path. The failures documented in `airef-anti-patterns.md` (chatbots inventing policy, agents deleting production data, shared chats becoming searchable) are all off the happy path.

## Accessibility
- Section H is mandatory for every surface; H1 needs two screen-reader and browser pairs because live-region behaviour differs between them.

## Motion / interaction (if relevant)
- Record one run with `prefers-reduced-motion: reduce`: thinking indicators, ghost text and diff highlights must remain understandable without motion (no check fails silently because an animation carried the meaning).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| checks | 39 in 9 sections (A4, B5, C5, D4, E4, F5, G3, H5, I4) | per surface type |
| must-checks | 11 (A1, A4, B2, C1, D1, E2, F1, G1, H1, H3, I1) | block shipping at 0 |
| points | 0 / 1 / 2 per check | criteria per row |
| bands | ≥ 80% ship · 65–79% fix · < 65% redesign | per surface |

## Implementation sketch
```ts
type Score = 0 | 1 | 2 | 'na';
type Check = { id: string; must: boolean; score: Score; evidence: string; fix?: string };
type Verdict = { percent: number; band: 'ship' | 'ship-with-fixes' | 'redesign'; blockers: string[] };

export function scoreSurface(checks: readonly Check[]): Verdict {
  const applicable = checks.filter((c): c is Check & { score: 0 | 1 | 2 } => c.score !== 'na');
  const points = applicable.reduce((sum, c) => sum + c.score, 0);
  const percent = applicable.length ? Math.floor((points / (2 * applicable.length)) * 100) : 0;
  const blockers = applicable.filter((c) => c.must && c.score === 0).map((c) => c.id);
  const band = blockers.length || percent < 65 ? 'redesign' : percent < 80 ? 'ship-with-fixes' : 'ship';
  return { percent, band, blockers };
}
```

## Checklist
- [ ] Evidence kit collected, including the [NET] failure runs and two screen readers.
- [ ] Each surface type scored separately; N/A only for sections that don't apply.
- [ ] Every score has evidence; every failure has a fix.
- [ ] No must-check at 0; total ≥ 80%.
- [ ] Report lists failed IDs ordered by severity.

## Sources
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf
- https://pair.withgoogle.com/guidebook/ (CC BY-NC-SA 4.0; paraphrased)
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://developer.apple.com/design/human-interface-guidelines/machine-learning
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://web.dev/articles/inp
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md (Apache-2.0)
