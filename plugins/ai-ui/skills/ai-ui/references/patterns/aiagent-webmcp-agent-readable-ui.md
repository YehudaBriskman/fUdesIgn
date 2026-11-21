# WebMCP and agent-readable UI

> Make the product usable by agents the same way it is usable by assistive technology: semantic, labelled, state-exposing HTML first; then, where an agent would otherwise guess, expose explicit tools (WebMCP declarative forms or registered JavaScript tools) with precise names, schemas and structured errors, keep destructive tools behind the user's confirmation, and show the user when an agent is acting on the page.

**Category:** Agents and human in the loop · **Applies to:** web apps that browser agents, extensions or in-page assistants will operate: search, filters, carts, bookings, settings, data entry · **Priority:** should

## When to use / when not
- **Always:** agent-readable markup. Browser agents read the DOM and the accessibility tree; a page that works with a screen reader is most of the way there.
- **WebMCP tools:** when tasks are repeated by agents and the UI path is long or fragile (multi-control filters, canvas widgets, wizards). WebMCP is an Early Preview in Chromium (146.0.7672.0 or later behind a flag) with a draft Community Group spec, so treat it as progressive enhancement; browsers without it ignore the declarative attributes.
- **Don't** expose tools for hyper-dynamic state that changes faster than an agent can react, or destructive actions without a confirmation the agent cannot bypass (modern-web-guidance WebMCP guide).
- Approval of the actions an agent takes is in `aiagent-approval-and-audit.md`.

## Rules (do)
**Agent-readable UI (no API needed)**
- Every control has a visible label tied to it (`<label for>`), every icon button an accessible name, every state an attribute (`aria-pressed`, `aria-expanded`, `aria-selected`, `aria-invalid`, `disabled`). Agents act on names and states exactly as screen readers do.
- Use native elements (`<button>`, `<a href>`, `<select>`, `<dialog>`, `<form>`) over clickable `div`s; real links for navigation so URLs carry state.
- Put view state (filters, sort, tab, selected item) in the URL so an agent can deep-link and recover.
- Errors are text next to the field with `aria-describedby`, not only a red border or a toast.
- Stable, meaningful `name` and `id` values; no randomised class names as the only hook.
- Prices, totals and dates are text in the DOM, not drawn in canvas or images.

**Declarative WebMCP (forms)**
- Add `toolname` and `tooldescription` to self-contained forms. The description says what the tool does and when to use it; it does not repeat field names, options or limits, because the browser builds the schema from the controls and their labels.
- Use `toolparamdescription` only to explain what a value means (with an example), placed on a `<fieldset>` for radio groups.
- Add `toolautosubmit` only for read-only or easily reversible actions (search, filter, add to cart, save draft). Omit it for destructive, financial, outbound-communication and account-security forms, so the browser pauses for the user.
- On submit, check `event.agentInvoked` and answer with `event.respondWith(...)`, returning validation errors as a descriptive string so the agent can correct itself.
- Style the active state: `form:tool-form-active` and `button:tool-submit-active` show the user that an agent is filling or waiting to submit this form.

**Imperative WebMCP (registered tools)**
- Register from a framework hook or a route-level module, never ad hoc inside components; pass an `AbortSignal` and abort it when the route or component goes away (there is no `unregisterTool`).
- Names are specific verbs (`add-to-cart`, `search-flights`), parameters have types, enums, defaults and per-parameter descriptions. Accept raw user values (dates as typed, quantities) and do the maths in code.
- Validate inputs in `execute` (the browser doesn't) and **return** structured errors (`{ error, allowed }`) instead of throwing; a thrown error reaches the agent as a generic failure. Re-throw only on abort.
- Honour the per-execution `signal` for network and long work. Return only after the UI has updated, so the page and the agent agree on state.
- Mark read-only tools with `annotations: { readOnlyHint: true }`. Use `exposedTo` only for specific HTTPS origins that need the tool across frames.

**Show agent activity to the user**
- While an agent operates the page, show a persistent, labelled indicator ("Assistant is using this page · Stop") and highlight the form or element it is acting on. The user can stop it at any time.

## Anti-patterns (don't)
- Clickable `div`s with no role or name; icon-only buttons with no label.
- One "do-everything" tool with a free-text `command` parameter.
- Tool descriptions that repeat the schema or contain flow-control instructions ("never call B after A").
- `toolautosubmit` on checkout, delete or send forms.
- Throwing errors with useful messages that the agent never receives.
- Agents acting invisibly on a page the user is looking at.

## Good references
- [modern-web-guidance, WebMCP overview](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/webmcp.md): client-side tools only, early preview, naming and schema advice, when to discourage it (Apache-2.0).
- [modern-web-guidance, agentic forms](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-forms.md): `toolname`, `tooldescription`, `toolparamdescription`, `toolautosubmit` rules, `agentInvoked`/`respondWith`, the `:tool-form-active` and `:tool-submit-active` pseudo-classes (Apache-2.0).
- [modern-web-guidance, agentic JavaScript tools](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-javascript-tools.md): `registerTool` with an `AbortSignal`, returning errors as values, honouring the execution signal, `exposedTo` (Apache-2.0).
- [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/): the evolving Community Group draft.

## Bad references
- Div-based custom selects and date pickers with no roles: agents and screen readers both fail to set values. The same root cause, measured for people, is documented in the forms and accessibility guides; agents inherit it.
- Checkout flows that reveal fees only on the last step ([NN/g, designing AI agents](https://www.nngroup.com/articles/designing-ai-agents/)): an agent-readable page states all costs before the action that commits them.

## Accessibility
- Agent readability and accessibility are the same work: labels, roles, states and text errors. Test with a screen reader and with the browser's accessibility tree view.
- The "agent is acting" indicator is announced politely once when it appears and includes a Stop button reachable by keyboard.
- `:tool-form-active` styling must not rely on colour alone; use an outline plus a text label.

## Motion / interaction (if relevant)
- Avoid pulsing animations on `:tool-submit-active`; a static outline plus "Waiting for your confirmation" is enough. If a pulse is used, disable it under `prefers-reduced-motion: reduce`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--ai-agent-outline` | `2px dashed var(--accent)` | form an agent is filling |
| `--ai-agent-submit-outline` | `2px solid var(--warning-fg)` | submit awaiting user review |
| `toolautosubmit` | read-only and reversible only | declarative forms |
| tool errors | returned `{ error, … }`, never thrown | imperative tools |
| tool lifetime | `AbortSignal`, aborted on route change | registration |
| support | Chromium ≥ 146.0.7672.0 behind a flag (early preview) | feature-detect |

## Implementation sketch
```ts
// Types for the parts of the early-preview API used here.
type JsonSchema = { type: 'object'; properties: Record<string, { type: string; description: string; enum?: readonly string[] }>; required?: string[] };
type ToolDef = {
  name: string; description: string; inputSchema: JsonSchema;
  execute: (input: Record<string, unknown>, opts: { signal: AbortSignal }) => unknown | Promise<unknown>;
  annotations?: { readOnlyHint?: boolean };
};
type ModelContext = { registerTool: (tool: ToolDef, opts?: { signal?: AbortSignal; exposedTo?: string[] }) => Promise<void> };
declare global { interface Document { modelContext?: ModelContext } }

const SORTS = ['relevance', 'price-asc', 'newest'] as const;
type Sort = (typeof SORTS)[number];
const isSort = (v: unknown): v is Sort => typeof v === 'string' && (SORTS as readonly string[]).includes(v);

export async function registerSearchTool(search: (q: string, sort: Sort, signal: AbortSignal) => Promise<{ count: number; items: string[] }>): Promise<AbortController | null> {
  const mc = document.modelContext;
  if (!mc) return null;                                   // not supported: the normal UI still works
  const controller = new AbortController();
  await mc.registerTool({
    name: 'search-products',
    description: 'Searches the product catalogue by keyword. Use when the user wants to find or compare products.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Words to search for, as the user said them.' },
        sort: { type: 'string', enum: SORTS, description: 'Order of the results.' },
      },
      required: ['query'],
    },
    async execute(input, { signal }) {
      const query = input.query;
      const sort = input.sort ?? 'relevance';
      if (typeof query !== 'string' || query.trim() === '' || !isSort(sort)) {
        return { error: 'Pass a non-empty query and a supported sort.', sorts: SORTS };
      }
      const result = await search(query, sort, signal);     // updates the visible results before returning
      return { count: result.count, items: result.items.slice(0, 20) };
    },
    annotations: { readOnlyHint: true },
  }, { signal: controller.signal });
  return controller;                                       // abort() on route change to unregister
}
```
```css
form:tool-form-active { outline: var(--ai-agent-outline); outline-offset: 4px; }
button:tool-submit-active { outline: var(--ai-agent-submit-outline); outline-offset: 2px; }
```

## Checklist
- [ ] Every control has a label, role and exposed state; errors are text tied to fields.
- [ ] View state lives in the URL; prices and totals are DOM text.
- [ ] Declarative tools have a purpose-focused `tooldescription`; `toolautosubmit` only on read-only or reversible forms.
- [ ] Imperative tools register with an `AbortSignal`, validate inputs, return structured errors and honour the execution signal.
- [ ] Read-only tools carry `readOnlyHint`.
- [ ] The user sees when an agent acts on the page and can stop it.
- [ ] Feature-detected: the page works unchanged without WebMCP.

## Sources
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/webmcp.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-forms.md (Apache-2.0)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/webmcp/agentic-javascript-tools.md (Apache-2.0)
- https://webmachinelearning.github.io/webmcp/
- https://www.nngroup.com/articles/designing-ai-agents/
- https://www.w3.org/TR/wai-aria-1.2/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
