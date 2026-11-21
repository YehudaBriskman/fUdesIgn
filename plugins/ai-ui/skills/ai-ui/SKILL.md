---
name: ai-ui
description: Design, build or review the UI of AI features (chat assistants, copilots and side panels, streaming answers, AI summaries and rewrites, ghost-text suggestions, AI-filled forms, generated content, agents that take actions) with researched rules and concrete tokens. Use when building a chat thread, message actions, a prompt box with attachments or slash commands, streaming and "stop generating", thinking or agent-step progress, citations and sources, hallucination or confidence messaging, edit/regenerate/branching, suggested prompts, inline AI diffs, tool-approval prompts and audit logs, AI error/refusal/rate-limit states, thumbs feedback, AI data-use notices and consent, accessibility of generated output, WebMCP tools, or when asked to audit or score an AI feature. Trigger even if "AI" is not said: "chatbot", "assistant panel", "LLM output", "copilot", "agent", "the bot's answer", "autocomplete suggestions", "make the chat feel faster".
---

# AI UI design

A research-backed playbook for the interface around a model: 20 pattern files, each with rules, anti-patterns, good and bad references, accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiables and the decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. Prefixes: `aifound` (identity, uncertainty, latency, privacy, accessibility of output), `aichat` (thread, streaming, waiting, markdown, citations, versions, input, suggestions, errors, feedback), `aiinline` (ghost text and diffs), `aiagent` (approvals, audit, WebMCP), `airef` (anti-patterns and review rubric).
- **Starter styles:** `assets/ai-ui.css`. It works on its own in light and dark: the dashboard-ui role tokens it reads are declared at zero specificity, so dashboard-ui's `tokens.css` or the project's own tokens on the same role names override them in any load order.
- **Shared with other plugins** (not repeated here): loading states and perceived performance (`prog-loading-states.md`, `prog-perceived-performance-thresholds.md`), optimistic UI and undo (`prog-optimistic-ui-and-undo.md`), overlays and toasts (`comp-overlay-choice.md`, `comp-notifications-alerts.md`), keyboard and focus (`comp-keyboard-shortcuts-focus.md`), all in dashboard-ui.
- **Sources:** Microsoft HAX (18 guidelines), Google PAIR People + AI Guidebook, Apple HIG Machine learning and Generative AI, NN/g AI research, WAI-ARIA and WCAG 2.2, web.dev and Chrome docs, and GoogleChrome/modern-web-guidance (Apache-2.0, cited by URL). Shape of AI informed the pattern map (ideas only). Product names appear as references; the rules are vendor-neutral.

## Workflow

Follow these steps in order. Each one names the files to open.

1. **Decide whether it should be chat at all, and what it is.**
   - Chat, inline AI (suggestion, rewrite, prefill) or an agent that acts? Many AI features work better without a conversation (NN/g). Inline: `aiinline-ghost-text-and-diffs.md`. Agents: `aiagent-approval-and-audit.md`.
   - Write the scope sentence, 1–3 examples and the limits that matter, and label every entry point in text (`aifound-expectations-and-identity.md`).
2. **Set budgets and data rules first.**
   - Phase budgets: ack ≤ 100 ms, first output ≤ 1 s p75, steps and Cancel past 10 s (`aifound-latency-and-perceived-performance.md`).
   - Data notice, training/retention/human-review facts, temporary mode, memory, share defaults (`aifound-privacy-consent-data-use.md`).
3. **Lay out the thread** (`aichat-layout-and-message-anatomy.md`): 46rem reading column, user turns as bubbles, assistant turns unbubbled with an author line, a reserved action row, composer pinned at the bottom.
4. **Build the input** (`aichat-prompt-input.md`) and the first screen (`aichat-empty-state-and-suggestions.md`): IME-safe Enter, auto-grow to 40dvh, attachments with limits before upload, a slash-command combobox, 3–4 concrete starters.
5. **Render the answer.**
   - Before the first token: `aichat-thinking-and-step-progress.md`.
   - The stream: `aichat-streaming-text.md` (frame-batched append, no forced scroll, one announcement, Stop in the Send position).
   - Markdown, code and tables, sanitised: `aichat-markdown-code-tables.md`. Accessibility of the result: `aifound-accessible-generated-content.md`.
6. **Make it checkable and correctable.**
   - Citations next to claims, opening the passage (`aichat-citations-and-sources.md`); signal-driven warnings, not blanket ones (`aifound-uncertainty-and-disclaimers.md`).
   - Edit, regenerate, versions (`aichat-edit-regenerate-branching.md`); diffs and one-step undo for changes to the user's content (`aiinline-ghost-text-and-diffs.md`).
7. **Design the unhappy paths.** Network, overload, refusal, context length, rate limit, attachment errors (`aichat-errors-refusals-limits.md`); feedback and reporting (`aichat-feedback-and-reporting.md`).
8. **Agents.** Tier every tool, approval cards with the exact payload, Stop before the next call, audit log (`aiagent-approval-and-audit.md`); make your own UI agent-readable and expose WebMCP tools where they help (`aiagent-webmcp-agent-readable-ui.md`).
9. **Review before calling it done.**
   - Run `airef-anti-patterns.md` (12 failures tied to documented incidents, each mapped to rubric IDs).
   - Score `airef-review-rubric.md`: 39 checks in 9 sections, 0–2 each, per surface type (chat, inline, agent). Ship at 80% or more with no must-check at 0.
   - Report the score per surface and each failed check as `ID · evidence · fix (pattern)`.

## Non-negotiables

Break one of these only with a written reason.

**Identity and trust**
1. AI is identified in text at every entry point and on every generated artefact. Never an icon alone, never a human persona.
2. Scope, examples and the limits that matter are stated where the user starts, and limits appear before the user hits them.
3. One quiet reliability notice sits near the input and stays visible while typing. Escalate to an inline warning only on a signal (unsourced, conflicting, computed, stale, high-stakes advice), and every warning names a check to do.
4. No uncalibrated numeric confidence. Use evidence (sources) or calibrated bands with a meaning and an action.
5. Claims from retrieval cite the source next to the claim and open the supporting passage. Never cite a document that was not retrieved.

**Conversation and streaming**
6. Send is acknowledged in ≤ 100 ms: the user's turn appears and Send turns into Stop, in the same place and size.
7. Stream with one DOM append per animation frame; never re-parse the whole message per chunk. Sanitise the combined output.
8. Nothing above the growing answer moves. Pin the new user turn to the top and let the answer fill reserved space; never force auto-scroll once the user scrolls up, show "Jump to latest".
9. Stop halts rendering within 100 ms, keeps the partial answer marked "Stopped", and Esc works.
10. Screen readers hear each response once (completion announcement from a polite region that exists from page load), never per token; focus never moves while streaming.
11. Waiting: nothing for 1 s, then specific status text; elapsed time from 5 s; named steps and Stop from 10 s; collapse to a one-line summary when done.

**Input and output**
12. Enter is IME-safe (`isComposing` or keyCode 229), Shift+Enter inserts a newline, Enter on touch inserts a newline, and a real Send button always exists.
13. The draft survives reload, navigation and errors. The prompt is never lost on any error.
14. Generated markdown renders as semantic HTML with demoted headings, real tables, labelled code with named copy buttons; remote images and raw HTML from the model are not rendered.

**Control**
15. Edits and regenerations create versions; earlier versions stay reachable.
16. AI changes to the user's existing content are shown as a diff, accepted explicitly (per change and all), and undone in one step. Ghost text takes Tab only while it is visible.
17. AI-written passages and AI-filled fields stay marked until the user reviews them; nothing AI-filled is submitted unconfirmed.

**Agents**
18. Every tool has a risk tier in code. Irreversible, external, money, security and production actions ask every time and show the exact payload; tier 3 never gets "always allow"; approvals never time out to Approve.
19. Stop halts before the next tool call, and the audit log (time, actor, input, result, approval, undo) is written by the tool layer, not by the model.

**Errors, feedback and data**
20. Errors appear inline in the message slot with a category-specific cause and next step. Rate limits state the limit, the reset time (absolute, local) and what still works. Refusals say so in the first sentence and offer an alternative.
21. Feedback is one click with optional reasons, says what happens to the data, and harm reporting is separate.
22. Training use, retention and human review are stated near the input with a control ≤ 2 clicks away; share links are private and `noindex` by default; temporary mode is visibly on.

## Decision tables

**Which AI surface** (`aifound-expectations-and-identity.md`, `aiinline-ghost-text-and-diffs.md`)

| Need | Use |
|---|---|
| Open questions, multi-turn exploration | Chat (full page or 400px side panel) |
| Predictable next words while writing | Ghost text |
| Change existing content on request | Selection action → diff review |
| Fill fields from a document | Prefill marked "Suggested", confirm per field or group |
| Explain a chart or table | Inline AI note citing the data points, labelled and dated |
| Multi-step work with effects | Agent with plan, tiers, approvals and audit log |

**Waiting** (`aichat-thinking-and-step-progress.md`, `aifound-latency-and-perceived-performance.md`)

| Time without output | Show |
|---|---|
| 0–1 s | The empty assistant slot only |
| 1–5 s | Indicator + specific status ("Searching your files…") |
| 5–10 s | + elapsed time |
| > 10 s | Named steps with states, Stop; can continue in the background past 30 s |

**Agent action** (`aiagent-approval-and-audit.md`)

| Tier | Examples | Default |
|---|---|---|
| 0 Read | search, read, fetch | Run; log |
| 1 Reversible, private | edit draft, create workspace file | Run; undo ≥ 30 days |
| 2 Irreversible or visible | send, publish, delete, submit, shell outside sandbox | Ask, or a scoped grant |
| 3 Money, security, production | pay, change roles, deploy, write production data | Ask every time |

**Errors** (`aichat-errors-refusals-limits.md`)

| Cause | Treatment |
|---|---|
| Network drop | Keep partial text; Retry; auto-retry idempotent requests up to 3 times (2/4/8 s) |
| Overload or 5xx | Inline message; Retry with backoff; offer a fallback if one exists |
| Refusal | Say so first, brief reason category, an alternative; never disguised as an error |
| Context too long | Offer a new chat carrying a summary |
| Rate limit | Limit, absolute reset time from `Retry-After`, what still works; warn at 80% used (thresholds are this skill's choice) |
| Attachment | Limit before upload; per-file error on the chip |

**Feedback and versions** (`aichat-feedback-and-reporting.md`, `aichat-edit-regenerate-branching.md`)

| Action | Result |
|---|---|
| Thumbs up/down | Registered in one click, `aria-pressed`; optional 4–6 reason chips |
| Report | Separate flow for harmful content |
| Edit prompt | New branch from that turn; ‹ n / m › pager |
| Regenerate | Sibling answer; previous kept; 2–4 adjustment chips (shorter, more detail…) |

## Token defaults

Full set in `assets/ai-ui.css`.

| Group | Defaults |
|---|---|
| Thread | measure 46rem · turn gap 32 · part gap 12 · user bubble ≤ 80%, radius 12, `--surface-2` · side panel 400 (360–480) · history 280 |
| Composer | min 44 · max 40dvh then scroll · radius 16 · field text ≥ 16px · attachment name ≤ 24ch, thumb 40 |
| Actions | row reserved at 32 · buttons 32 (44 on coarse pointers) · `--text-muted`, pressed `--accent` |
| Timing | control busy after 200 ms, shown ≥ 400 ms · chat status 1 s · elapsed 5 s · steps and Stop 10 s · reveal lag ≤ 300 ms · ghost text ≤ 300 ms after the pause · Copied 2 s |
| Citations | marker ≥ 24×24, `--accent` on a 12% accent tint · ≤ 3 markers per sentence · 3–5 sources shown, then "+N more" |
| Code | `--sunken` · 0.8125rem/1.55 mono · collapse past 30 lines to 24lh |
| Inline AI | ghost `--text-muted` italic · insert `--success-bg` + underline · delete `--danger-bg` + strikethrough · AI passage 8% accent tint + 2px bar |
| Agents | approval 2px `--warning-fg` border · agent-filled form 2px dashed accent · temporary mode 2px `--text` frame |

## How to apply this skill

- **When building:**
  - Start from `assets/ai-ui.css` (map its roles onto the project's tokens if it has them), then follow the workflow.
  - Prefer platform features: `field-sizing: content` with a fallback, `enterkeyhint`, `<dialog>`, the popover API for citation previews, `AbortController` for Stop, WebMCP declarative forms where useful. Each sketch shows the detection and fallback.
  - Treat all model output as untrusted input: sanitise, never `innerHTML` per chunk, no remote images.
  - Never use the TypeScript `any` type; validate model and server payloads with Zod or a typed schema.
- **When reviewing:** collect the evidence kit in `airef-review-rubric.md` (including a 429, a 500, a refusal, a mid-stream network cut and two screen readers), run the anti-patterns, then score. Report a table of check, score, evidence and fix, ordered by severity.
- **When the project has a design system:** its tokens win; map them onto these roles and flag the gaps.
- **When rules conflict:** safety, honesty and accessibility (no silent effects, citations that support the claim, one announcement per answer) beat speed and polish. Evidence beats taste.
