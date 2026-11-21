# Agent actions: approval, human in the loop, undo and audit log

> Gate every agent action by its risk: read-only actions run, reversible writes run with undo, and irreversible or externally visible actions (send, pay, delete, publish, change permissions, touch production) stop for an approval that shows exactly what will happen. Let the user stop at any step, and record every action in an audit log with who, what, when and how to undo it.

**Category:** Agents and human in the loop · **Applies to:** chat agents with tools, browser and computer-use agents, coding agents, workflow automations, copilots that send email or change records · **Priority:** must

## When to use / when not
- Any time a model can cause effects beyond the conversation: tools, APIs, file systems, forms, payments, messages to other people.
- For progress display while the agent runs, see `aichat-thinking-and-step-progress.md`; for exposing your own UI as agent tools, see `aiagent-webmcp-agent-readable-ui.md`.
- Undo and optimistic patterns for ordinary UI are in `prog-optimistic-ui-and-undo.md`; this file adds the agent-specific rules.

## Rules (do)
**Risk tiers (decide per tool, in code, not in the prompt)**
| Tier | Examples | Default |
|---|---|---|
| 0 Read | search, read file, list records, fetch a page | run, show in the step log |
| 1 Reversible write, private | edit a draft, create a file in the workspace, add to cart | run, with undo for ≥ 30 days in history |
| 2 Irreversible or visible to others | send a message or email, publish, delete permanently, submit a form, book, run a shell command outside a sandbox | ask every time, unless the user granted a scoped rule |
| 3 Money, security, production | pay, transfer, change roles or credentials, deploy or write to a production database | ask every time; no "always allow"; optionally require re-authentication |

**The approval prompt**
- Shows the **exact effect**, not the agent's intent: the recipients and full message, the amount and payee, the command line, the files with a diff, the record before and after. A summary sentence on top, the concrete payload below.
- States **reversibility** in words ("Can't be undone", "Can be undone for 30 days") and **why** the agent wants to do it (one line, from the plan).
- Offers: **Approve** (verb-specific: "Send email", "Pay $412.00"), **Edit** (opens the payload for changes), **Deny** (agent continues or stops, the user chooses), and for tier 2 only a **scoped grant**: "Allow for this session", "Always allow `npm test` in this project". Never a global "allow everything" as a button.
- Default focus is on the least destructive choice (Edit or Deny), not on Approve. No auto-approve countdowns.
- Appears inline in the conversation or run view, at the step, and also as a notification if the user is away; the run pauses, it doesn't fail.
- Batch only identical, low-risk actions ("Rename 14 files" with a list), never mix tiers in one approval.

**Watch for approval fatigue.** If a typical task asks more than about 3–5 times, users start approving without reading. Fix it with better scoped grants or a sandbox, not by removing the gate for tier 3.

**Plan first for long or risky work.** Offer a read-only planning mode: the agent proposes a plan (steps, tools, tiers), the user edits and approves the plan, then tier-2 steps inside the approved plan can run with a single grant. Tier 3 still asks.

**Stop, pause, take over.** A Stop control is always visible during a run and halts before the next tool call (≤ 1 step). Pause keeps state. For browser or UI agents, a "Take over" mode hands the controls to the user and resumes the agent afterwards.

**Separate environments.** An agent that can write to production must have a separate development or preview target by default, and touching production is tier 3.

**Audit log**
- One entry per action: timestamp (absolute, with timezone), actor (agent name and version, on behalf of which user), tool, inputs (redacted secrets), result, approval (who approved, which rule), and an **Undo** or "Restore" link where possible.
- Searchable and filterable by run, tool and tier; exportable; kept at least as long as the undo window (≥ 30 days).
- The agent's own textual report is not the record: the log is written by the tool layer, so an agent that misreports what it did is contradicted by the log.

## Anti-patterns (don't)
- "Approve" with a summary only ("Agent wants to clean up the database") and no payload.
- One-click "Always allow all tools" in the approval prompt.
- Approval prompts that time out to Approve.
- Risk decided by the model ("is this dangerous?") rather than by the tool definition.
- No stop control, or a stop that waits for the current multi-minute task to finish.
- An activity feed written by the agent in prose as the only record.
- Agents with production credentials in the same environment as experiments.

## Good references
- [VS Code, agent tool approvals](https://code.visualstudio.com/docs/agents/approvals): Allow once, In this session, Always allow or Skip; each terminal command checked separately, read-only commands auto-run and risky ones still prompt; a notice links to the rule that auto-approved something; the docs warn that a global bypass removes review.
- [Claude Code, permissions](https://code.claude.com/docs/en/permissions): deny, ask and allow rules evaluated in that order; a read-only plan mode; admins can disable the bypass modes.
- [OpenAI Codex, approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security): sandbox modes (read-only, workspace-write with network off by default, full access) are separate from approval policies.
- [Replit, Plan mode](https://docs.replit.com/core-concepts/agent/plan-mode): read-only planning, then an explicit "Start building" approval.
- [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai): ask before irreversible or significant actions.
- [modern-web-guidance, agentic forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-forms.md): omit auto-submit for destructive, financial, high-impact communication and account-security actions (Apache-2.0).

## Bad references
- An AI coding agent deleted a production database during a code freeze and then misreported what it had done ([The Register, July 2025](https://www.theregister.com/2025/07/22/replit_saastr_response/); [Fortune](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/)). Development and production shared one database; the vendor responded with automatic dev/prod separation and pointed to one-click restore.
- A browsing agent changed a reservation time without asking and let a hold window expire ([NN/g](https://www.nngroup.com/articles/impressions-chatgpt-agent/)): consequential choices made silently, no clarifying question.
- Hidden fees appearing only at the agent's checkout step ([NN/g, designing AI agents](https://www.nngroup.com/articles/designing-ai-agents/)): the approval did not show the full cost.

## Accessibility
- The approval card is a region with a heading ("Approval needed: Send email"), announced politely when it appears; it does not steal focus unless the user is in the run view, and then focus goes to the card heading.
- Payload diffs use `<ins>`/`<del>` with visually hidden "added"/"removed" text.
- Approve, Edit and Deny are real buttons with verb labels; the scoped grant is a radio group, not a hidden dropdown.
- The audit log is a table with column headers, sortable by keyboard.

## Motion / interaction (if relevant)
- The approval card appears without motion beyond a 150 ms fade; the run's step list shows the paused step with a static "Waiting for you" label, not a spinner.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| tiers | 0 read · 1 reversible · 2 irreversible/visible · 3 money/security/production | per tool, in code |
| `--ai-approval-border` | `2px solid var(--warning-fg)` | approval card |
| default focus | Edit or Deny | approval card |
| approval timeout | none (pauses; never auto-approves) | all tiers ≥ 2 |
| prompts per task | ≤ 3–5 before fatigue | tune scoped grants |
| stop latency | before the next tool call (≤ 1 step) | Stop |
| undo window | ≥ 30 days in history | tier 1 |
| audit fields | time+tz, actor, on behalf of, tool, inputs, result, approval, undo | each action |

## Implementation sketch
```ts
import { z } from 'zod';

type Tier = 0 | 1 | 2 | 3;
type Decision = { kind: 'approve' } | { kind: 'edit'; payload: unknown } | { kind: 'deny' };
type Grant = { tool: string; scope: 'session' | 'project'; match: (input: unknown) => boolean };

type Tool<I> = {
  name: string;
  tier: Tier;
  input: z.ZodType<I>;
  describe: (i: I) => { summary: string; payload: string; reversible: boolean };
  run: (i: I, signal: AbortSignal) => Promise<{ result: string; undo?: () => Promise<void> }>;
};

type AuditEntry = {
  at: string; actor: string; onBehalfOf: string; tool: string; input: unknown;
  result: string; approvedBy: 'auto-tier' | 'grant' | 'user'; undoable: boolean;
};

export async function callTool<I>(
  tool: Tool<I>, raw: unknown, ctx: {
    grants: readonly Grant[]; signal: AbortSignal; user: string; agent: string;
    ask: (card: { title: string; payload: string; reversible: boolean; allowGrant: boolean }) => Promise<Decision>;
    log: (e: AuditEntry) => void;
  },
): Promise<string> {
  ctx.signal.throwIfAborted();                       // Stop halts before the next tool call
  const parsed = tool.input.safeParse(raw);
  if (!parsed.success) return `Invalid input for ${tool.name}: ${parsed.error.message}`;
  let input: I = parsed.data;
  let approvedBy: AuditEntry['approvedBy'] = 'auto-tier';

  if (tool.tier >= 2) {
    const granted = tool.tier === 2 && ctx.grants.some((g) => g.tool === tool.name && g.match(input));
    if (granted) approvedBy = 'grant';
    else {
      const d = tool.describe(input);
      const decision = await ctx.ask({ title: d.summary, payload: d.payload, reversible: d.reversible, allowGrant: tool.tier === 2 });
      if (decision.kind === 'deny') return `User denied ${tool.name}.`;
      if (decision.kind === 'edit') {
        const edited = tool.input.safeParse(decision.payload);
        if (!edited.success) return `Edited input invalid: ${edited.error.message}`;
        input = edited.data;
      }
      approvedBy = 'user';
    }
  }

  const { result, undo } = await tool.run(input, ctx.signal);
  ctx.log({ at: new Date().toISOString(), actor: ctx.agent, onBehalfOf: ctx.user, tool: tool.name,
    input, result, approvedBy, undoable: undo !== undefined });
  return result;
}
```

## Checklist
- [ ] Every tool has a tier set in code; tier 3 never gets "always allow".
- [ ] Approval shows the exact payload, reversibility and reason, with verb-specific Approve, Edit and Deny.
- [ ] Default focus is not on Approve; prompts never time out to Approve.
- [ ] Scoped grants exist for tier 2 and the UI shows which rule auto-approved an action.
- [ ] Stop halts before the next tool call; take-over exists for UI agents.
- [ ] Production is a separate, tier-3 target.
- [ ] The audit log is written by the tool layer with time, actor, input, result, approval and undo.

## Sources
- https://code.visualstudio.com/docs/agents/approvals
- https://code.claude.com/docs/en/permissions
- https://learn.chatgpt.com/docs/agent-approvals-security
- https://docs.replit.com/core-concepts/agent/plan-mode
- https://www.theregister.com/2025/07/22/replit_saastr_response/
- https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
- https://www.nngroup.com/articles/designing-ai-agents/
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ (G10 scope services when in doubt, G16 convey consequences)
- https://alistapart.com/article/neveruseawarning/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-forms.md (Apache-2.0)
- https://www.shapeof.ai/pattern-types/governors (ideas only: action plan, controls, draft mode, cost estimates)
