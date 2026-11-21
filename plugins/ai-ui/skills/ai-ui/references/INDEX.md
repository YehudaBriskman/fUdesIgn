# Pattern index

20 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

## AI foundations (`aifound-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Accessibility of generated content](patterns/aifound-accessible-generated-content.md) | must | Generated output must be as accessible as authored content: real semantic HTML (headings, lists, tables with header cells, labelled code regions), correct language tags, text alternatives for generated images, announcements that arrive once per response rather than per token, and focus that never moves while content streams. |
| [Set expectations: say it is AI, what it can do and how well](patterns/aifound-expectations-and-identity.md) | must | Before the first prompt and at every AI surface, tell people that they are dealing with an AI system, what it can do here, how reliable it is, and what it cannot do. Do it in plain words beside the feature, not in marketing copy or a terms page. |
| [Latency budgets and perceived performance for AI features](patterns/aifound-latency-and-perceived-performance.md) | must | Budget every AI interaction in phases: acknowledge the action in under 100 ms, show the first useful output (first token, first step or a specific status) within 1 s at p75, and turn anything that can run past 10 s into visible, cancellable progress that can continue in the background. Never let model latency block typing, scrolling or other work. |
| [Privacy, data-use notices and consent for AI features](patterns/aifound-privacy-consent-data-use.md) | must | Tell people, at the point of input, where their prompt, files and feedback go, whether they train a model, who can read them and for how long, and give each choice a control that is two clicks or fewer from the conversation. Anything that widens the audience of a conversation (sharing, publishing, indexing, memory, training) is off by default and asked for in context. |
| [Uncertainty, confidence and hallucination warnings without crying wolf](patterns/aifound-uncertainty-and-disclaimers.md) | must | Use one quiet, persistent reliability notice for the whole surface, and escalate to a specific, actionable warning only when there is a concrete signal (no supporting source, conflicting sources, computed figures, stale data, a high-stakes domain). Never show a model's raw probability as "confidence" unless it is calibrated against real accuracy. |

## Chat and conversation (`aichat-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Citations and sources: next to the claim, one step from the passage](patterns/aichat-citations-and-sources.md) | must | Put a numbered citation marker right after the claim it supports. On hover, focus or tap it previews the source's title, domain, date and the exact supporting passage, and it opens that passage, not just the page. List every source below the answer. Never show a citation for a source the system did not actually retrieve. |
| [Edit, regenerate, branching and version history](patterns/aichat-edit-regenerate-branching.md) | must | Treat a conversation as a tree, not a list. Editing a prompt or regenerating an answer adds a sibling version instead of overwriting, a "‹ 2 / 3 ›" pager on that message switches between versions, and no version is ever destroyed without an explicit delete. Let people revise part of an answer without regenerating all of it. |
| [Empty states, starter prompts and follow-up suggestions](patterns/aichat-empty-state-and-suggestions.md) | should | A new chat opens with a one-line statement of what the assistant can do here and 3–4 concrete starter prompts drawn from the user's current context. After an answer, offer at most 3 follow-ups directly below it. A complete prompt sends on click; a template with blanks goes into the composer for editing. |
| [Errors, refusals and rate limits](patterns/aichat-errors-refusals-limits.md) | must | Show every failure inline, in the slot where the answer would have been, and keep the user's prompt and any partial output. Name the cause in plain words and give the next step: Retry, a rephrase hint, a new chat, or an absolute time when the limit resets. A refusal says so in its first sentence and offers an alternative. It is never disguised as a technical error. |
| [Feedback (thumbs) and reporting](patterns/aichat-feedback-and-reporting.md) | should | Put thumbs up and down on every answer, registered with one click. Reasons are optional chips that appear only after a thumbs-down. Say plainly what happens to the feedback and what data it sends. Keep "Report" for harmful content as a separate action with its own flow. |
| [Chat layout and message anatomy](patterns/aichat-layout-and-message-anatomy.md) | must | Lay a conversation out as one centred reading column of about 46rem. User turns are compact right-aligned bubbles and assistant turns are full-width, unbubbled prose, and every assistant turn has the same anatomy: an author label, the answer, its sources, then one action row. The composer stays pinned at the bottom. |
| [Markdown, code blocks, tables and copy in responses](patterns/aichat-markdown-code-tables.md) | must | Treat model output as untrusted user-generated content. Parse markdown incrementally, sanitise the combined result, allow only a small set of elements, and never load remote images or run anything. Render code blocks and tables as labelled scroll regions with their own copy action. Copying a whole response puts both plain text and rich HTML on the clipboard. |
| [The prompt input: multiline, attachments, slash commands, IME-safe Enter](patterns/aichat-prompt-input.md) | must | The composer is a labelled, auto-growing `<textarea>` inside a real `<form>` with a visible Send button. Enter sends only when no IME composition is active and not on touch keyboards, and Shift+Enter inserts a newline. Attachment limits are shown before upload, slash commands use an accessible combobox, and the draft is never lost. |
| [Streaming text: cadence, announcements, no layout shift, Stop](patterns/aichat-streaming-text.md) | must | Append streamed tokens at most once per animation frame, never re-render the whole message per chunk, and keep everything above the growing answer still. Don't follow the stream with auto-scroll once the user has scrolled away. Announce the response to assistive technology once, when it is complete, not chunk by chunk. A Stop control replaces Send in the same place and halts rendering within 100 ms. |
| [Thinking states and progress for agent steps](patterns/aichat-thinking-and-step-progress.md) | must | Before the first token, show a specific status that changes with time: "Thinking" after 1 s, the elapsed time after 5 s, and the actual steps with a cancel control after 10 s. For multi-step and agent work, list each step with its state in text. When the work finishes, collapse the list into a one-line summary that can be reopened. |

## Inline AI in documents, forms and dashboards (`aiinline-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Inline AI: ghost text, accept or reject, and diffs](patterns/aiinline-ghost-text-and-diffs.md) | must | AI that edits the user's own work (a document, a form, a dashboard note) proposes and never imposes: suggestions appear as clearly distinct ghost text or as a reviewable diff, one key accepts, one key or simply continuing to type dismisses, every accepted change is one undo away, and AI-inserted content stays marked until the user has reviewed it. |

## Agents and human in the loop (`aiagent-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Agent actions: approval, human in the loop, undo and audit log](patterns/aiagent-approval-and-audit.md) | must | Gate every agent action by its risk: read-only actions run, reversible writes run with undo, and irreversible or externally visible actions (send, pay, delete, publish, change permissions, touch production) stop for an approval that shows exactly what will happen. Let the user stop at any step, and record every action in an audit log with who, what, when and how to undo it. |
| [WebMCP and agent-readable UI](patterns/aiagent-webmcp-agent-readable-ui.md) | should | Make the product usable by agents the same way it is usable by assistive technology: semantic, labelled, state-exposing HTML first; then, where an agent would otherwise guess, expose explicit tools (WebMCP declarative forms or registered JavaScript tools) with precise names, schemas and structured errors, keep destructive tools behind the user's confirmation, and show the user when an agent is acting on the page. |

## AI references, anti-patterns and review (`airef-`)

| Pattern | Priority | Rule |
|---|---|---|
| [AI-UI anti-patterns, with good and bad references](patterns/airef-anti-patterns.md) | must | Twelve recurring failures of AI interfaces, each with the real-world case that shows the cost, the pattern that fixes it, and the rubric IDs that catch it. Check a design against all twelve before scoring it. |
| [AI-UI review rubric](patterns/airef-review-rubric.md) | must | Score each AI surface (chat, inline AI, agent run) on 39 checks in 9 sections, 0–2 points each against explicit criteria with evidence. Ship at 80% or more with no "must" check at 0. |
