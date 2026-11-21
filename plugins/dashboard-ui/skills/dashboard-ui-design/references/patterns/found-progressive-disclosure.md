# Progressive disclosure in dashboards

> Show everything users frequently need up front, put the rest one clearly labelled step away, and never nest more than two levels deep.

**Category:** Foundations · **Applies to:** KPI tiles, widget menus, advanced filters, table row expansion, metric definitions, settings, mobile reflow · **Priority:** should

## When to use / when not
- **Use** for:
  - rarely used controls (advanced filters, export options, chart settings)
  - secondary metrics
  - per-row details in tables
  - metric definitions and methodology
  - content that doesn't fit compact windows
- **Use staged disclosure** (a wizard) only for linear setup tasks whose steps barely interact, such as connecting a data source. NN/g: avoid it when users must "alternate between" steps.
- **Don't use** when users need most of the content, or must compare sections side by side. Accordions on desktop fail here (NN/g accordions on desktop). Show it instead.
- **Don't use** to hide the context that makes a number meaningful (unit, period, comparison). That's "empty and vague", not disclosure (see `found-data-ink-minimalism.md`).
- **Don't use** to hide core navigation or the primary action on desktop (NN/g minimalism: hamburger-hidden desktop nav).

## Rules (do)
- **Split primary from secondary with data, not guesses.** Use frequency-of-use analytics plus observation. NN/g: "disclose everything that users frequently need up front" and supplement analytics with "observational usability testing". High usage can mean errors, not value.
- **Max two levels.** Overview → one disclosure (panel, row expansion, popover) → at most one more (full detail page). NN/g: designs beyond 2 levels "typically have low usability". If you need 3, simplify or regroup.
- **Use one home for advanced things.** Put all advanced filters in one "More filters" panel, not three different overflow menus. Avoid multiple routes to the same secondary options.
- **Use labels that set expectations:** "More filters (4)", "Show 12 more metrics", "How is churn calculated?". Avoid "More", "…" and "Advanced" alone (NN/g: give the trigger strong information scent).
- **Indicate hidden state.** When something hidden is active (filters inside "More filters", a non-default setting), show a count or badge on the trigger.
- **Pick the right disclosure mechanism:**
  | Need | Mechanism |
  |---|---|
  | Short help or definition of a metric | `popover="hint"` / toggletip via `interestfor` or click |
  | Rich preview of a linked entity on hover/focus | hovercard (`interestfor` + anchor positioning) |
  | Optional section within the page | `<details>` (searchable, no JS) |
  | Extra columns or rows | "Show columns" menu; "Show N more" row |
  | One record's details next to the list | side panel / drawer (non-modal) |
  | Long multi-step task | dedicated page or modal `<dialog>` (FocusView-style) |
- **Prefer `<details>` or `hidden="until-found"`** over `display:none` for collapsed content, so Ctrl/Cmd+F and text-fragment links can find and auto-expand it (modern-web-guidance `ui-behaviors/search-hidden-content.md`).
- **Allow several sections open at once.** Avoid exclusive (`name=`) accordions when users might compare, and offer "Expand all" for 4 or more sections (NN/g; modern-web-guidance `ui-components/accordion.md`).
- **Remember disclosure state** per user for analytical views (an expanded group stays expanded on return). Reset it for shared links unless the state is encoded in the URL.
- **On compact windows**, disclosure replaces columns: KPIs 5–8 go behind "Show more metrics", and secondary charts go behind section headers (see `found-responsive-reflow.md`).

## Anti-patterns (don't)
- **Mystery meat:** a "⋯" icon with no label holding the export, date range and units.
- **Three-level nesting:** tab → accordion → popover → modal.
- **Hover-only reveal** of drill-down or critical actions (keyboard and touch users can't reach it).
- **Disclosure that loses context,** where opening a detail navigates away and filters reset.
- **Hiding active filters** inside a collapsed panel, so totals look wrong with no visible reason.
- **Accordions for short content on desktop.** The page looks empty and clicks multiply (NN/g).
- **Auto-collapsing (exclusive) accordions** in comparison tasks. They cause layout shift for magnifier users (modern-web-guidance accordion guide).

## Good references
- [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): the canonical rules: up-front vs deferred, the > 2 levels warning, a single place for advanced features, and labels with clear expectations.
- [NN/g: Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/): when accordions help (few needed sections, independent content) and hurt (users need most content, must compare, print). Caret or plus icons work best, and the whole heading should be clickable.
- [Stripe Apps: ContextView vs FocusView](https://docs.stripe.com/stripe-apps/design): default to a side-by-side drawer that keeps the page context. Escalate to a blocking FocusView only for start-to-finish tasks or when a wider canvas is needed. A clear two-level disclosure model.
- [Datadog integration dashboards](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): About text moved into the dashboard title's hovercard, and stream widgets in their own collapsible group at the end. Rarely needed content is disclosed in place without leaving the dashboard.
- [NN/g: Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/): a timer's "zen mode" shows only remaining time at idle and reveals controls on hover. Necessary elements appear when needed.

## Bad references
- [NN/g: Characteristics of Minimalism](https://www.nngroup.com/articles/characteristics-minimalism/): desktop navigation hidden behind a hamburger, and a portfolio owner's name hidden behind a click. Primary content treated as secondary.
- [Few, Common Pitfalls, Pitfall #1](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): radio-button disclosure of core sales metrics one at a time. The overview itself was disclosed away, so comparison is impossible.
- [NN/g: Negative Impact of Mobile-First on Desktop](https://www.nngroup.com/articles/content-dispersion/): mobile accordions carried to desktop add clicks and make users feel "the company is hiding information".

## Accessibility
- Disclosure buttons follow the WAI-ARIA APG disclosure pattern: role `button`, Enter/Space toggles, `aria-expanded` true/false, optional `aria-controls`. Native `<details>/<summary>` provides this for free.
- Don't put headings inside `<summary>`. Screen readers expose `summary` as a button and drop the heading (modern-web-guidance accordion guide).
- Hover-revealed content must also appear on focus, be dismissible (Esc) and stay while the pointer moves onto it (WCAG 1.4.13). The `interestfor` default delay of 0.5s handles hover intent.
- When a panel opens, move focus into it only if it's modal. On close, return focus to the trigger.
- Collapsed content must be removed from the accessibility tree (not just visually hidden) so it isn't read while "closed". `<details>` and `hidden` do this.

## Motion / interaction (if relevant)
- Expand and collapse: 150–250ms height transition using `interpolate-size: allow-keywords` or `::details-content` transitions where supported. Content fades in about 100ms after the height starts. Use an instant switch under `prefers-reduced-motion`.
- Drawer: 200–250ms slide in, 150–200ms out. Popovers and hints: 100–150ms fade.
- Never animate the overview away when details open. The context must stay still.

## Tokens and values
| Token | Default |
|---|---|
| Max disclosure depth | 2 |
| Hint/tooltip delay (hover) | 500ms in / 100–250ms out (`interest-delay`) |
| Expand/collapse duration | 200ms, `cubic-bezier(.2,0,0,1)` |
| Drawer width | `min(480px, 100vw)` |
| "Show more" threshold | > 6 KPIs, > 8 table columns, > 10 list items |
| Trigger label | verb + object + count ("Show 12 more metrics") |
| Disclosure icon | chevron/caret, rotates 90°/180° on open |

## Implementation sketch
```html
<!-- Metric definition as an on-demand hint -->
<h3 class="kpi-label">Net revenue retention
  <button type="button" class="info" popovertarget="nrr-def" aria-label="How is net revenue retention calculated?">ⓘ</button>
</h3>
<div id="nrr-def" popover>Revenue this month from customers active 12 months ago ÷ their revenue then.</div>

<!-- Secondary metrics: searchable, keyboard-accessible, no JS -->
<details class="more-metrics">
  <summary>Show 6 more metrics</summary>
  <ul class="kpis">…</ul>
</details>

<!-- Advanced filters in one place, with hidden-active count -->
<button type="button" popovertarget="more-filters">More filters <span class="count">(2 active)</span></button>
<div id="more-filters" popover aria-label="More filters">…</div>
```
```css
:root { interpolate-size: allow-keywords; }           /* progressive enhancement */
details::details-content { block-size: 0; overflow: clip;
  transition: block-size 200ms cubic-bezier(.2,0,0,1), content-visibility 200ms allow-discrete; }
details[open]::details-content { block-size: auto; }
@media (prefers-reduced-motion: reduce) { details::details-content { transition: none; } }
summary { cursor: pointer; min-block-size: 2.75rem; display: flex; align-items: center; gap: .5rem; }
```

## Checklist
- [ ] The primary vs secondary split is backed by usage data or user observation.
- [ ] No path from the overview needs more than 2 disclosure steps.
- [ ] Every trigger has a text label with an object and, where relevant, a count.
- [ ] Hidden-but-active state (filters, settings) is signalled on the trigger.
- [ ] Collapsed content uses `<details>` or `hidden="until-found"` and is findable with Find in page.
- [ ] Hover reveals have focus and tap equivalents and satisfy WCAG 1.4.13.
- [ ] Opening details keeps the overview and filters intact.

## Sources
- https://www.nngroup.com/articles/progressive-disclosure/
- https://www.nngroup.com/articles/accordions-on-desktop/
- https://www.nngroup.com/articles/aesthetic-minimalist-design/
- https://www.nngroup.com/articles/characteristics-minimalism/
- https://www.nngroup.com/articles/content-dispersion/
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- https://docs.stripe.com/stripe-apps/design
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- modern-web-guidance/skills/modern-web-guidance/guides/ui-components/accordion.md
- modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/search-hidden-content.md
- modern-web-guidance/skills/modern-web-guidance/guides/ui-components/hovercard.md
- modern-web-guidance/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
