# Cards vs tables vs lists: choosing the container

> Choose by task. Use a table to compare many homogeneous records across attributes, a list to scan and pick one item, and cards for a few heterogeneous summaries. Default to the table for data; cards are the exception.

**Category:** Data display · **Applies to:** collections of records, dashboard sections, search results, overview pages · **Priority:** must

## When to use / when not

| User task | Items | Attributes per item | Use |
|---|---|---|---|
| Compare values across items, sort or rank | any count, homogeneous | 3 or more comparable | **Table** |
| Find or pick one item, then drill in | homogeneous | 1–3 (name plus 1–2 metadata) | **List** (rows) |
| Glance at a few headline numbers | 3–6 | 1 value plus context | **KPI cards** (`data-kpi-stat-card.md`) |
| Browse mixed content types (chart, alert, note) | few, heterogeneous | varies | **Cards** |
| Browse visual items (images, thumbnails) | many | image-led | **Grid** (not cards) |
| Compare 2–5 options side by side on many attributes | 2–5 | many | **Comparison table** (attributes as rows) |

- NN/g: "Cards work best for collections of heterogeneous items." For very homogeneous items, use a vertical list. Cards are "less appropriate than lists when people search for information", "a poor choice when users need to compare between multiple options", "less scannable than lists", "typically deemphasize the ranking of content", and "take more space". Lists win on scanning because each attribute sits in a fixed position.
- If you can't name the columns, you don't have a table. If every card has the same four fields, you have a table drawn badly. If the question is "what happened, in what order", use a timeline (`data-activity-timeline.md`).

## Rules (do)
- **Default to a table** for records with 3 or more shared numeric attributes (transactions, holdings, invoices, deployments, companies in a screen).
- **Use cards only for:**
  - KPI summaries (3–6);
  - heterogeneous dashboard widgets (a chart, a to-do list, an alert feed);
  - entity overviews where each item has a distinct visual (company logo plus 1–2 stats), at 12 items or fewer.
- **Use list rows** for navigation-first collections: projects, watchlists, recent activity, notifications. See `data-list-rows.md`.
- **Responsive switch.** A table may become stacked cards *below a container width* (about 600px) as a presentation of the same data (`ui-atoms/responsive-table.md`). That is the one legitimate "table to cards" transform. Keep sort and filter available.
- **View toggle (table/cards)** only when both tasks are real (for example a portfolio as "compare" vs "browse"). Persist the choice per user. Default to the table.
- **Card grid rules** when cards are right: fixed width with variable height is fine (NN/g), but within a row align regions using subgrid (`ui-components/card.md`). Use the same field order on every card, and limit each card to 1 primary value plus 3 or fewer secondary facts.
- **Comparison tables:** at most 5 compared items (NN/g; "Most dynamic comparison tables accept 3–4 items only"), and about 2 on a phone. Keep column headers fixed while scrolling, and offer a "highlight differences" toggle for long attribute lists.
- **Don't double-encode.** A KPI card row *above* a table that repeats the same totals is fine. Cards *instead of* a table for 50 records is not.

## Anti-patterns (don't)
- **"Card soup":** 40 identically structured cards for records users need to compare (for example customer accounts with MRR, plan, seats and status). Users must memorise values across scattered positions. NN/g notes cards rely on short-term memory because fewer fit on screen.
- Cards with a table inside each card (nested containers, Carbon: "Avoid placing data tables inside data tables or smaller containers").
- Tables used to lay out a dashboard (GOV.UK: "Never use the table component to layout content").
- A list row that tries to show 8 attributes. That's a table squeezed into a list.
- A different field order or position per card, which breaks scanning.
- Wrapping every dashboard section in a card with shadow and border "for consistency". Borders and shadows are ink. Use whitespace and headings to group when there's nothing to contain (Carbon dashboards: "White space either sets elements apart or brings them together"; see `found-visual-hierarchy.md`).

## Good references
- [NN/g, "Cards: UI-Component Definition"](https://www.nngroup.com/articles/cards-component/) — the heterogeneous vs homogeneous rule, and the drawbacks of cards for ranking, scanning and comparison.
- [NN/g, "Data Tables: Four Major User Tasks"](https://www.nngroup.com/articles/data-tables/) — find records that fit criteria, compare data, view or edit a single row, and take actions on records.
- [NN/g, "Comparison Tables"](https://www.nngroup.com/articles/comparison-tables/) — at most 5 items, fixed column headers, hide rows where all items are the same, "unlikely" to fit more than 2 items on a phone.
- [Stripe Dashboard (teardown)](https://www.925studios.co/blog/stripe-dashboard-design-breakdown) — a handful of metric summaries on home, while Payments "leads with a filterable list of recent transactions". Summaries are cards and records are a table.
- [Carbon dashboards](https://carbondesignsystem.com/data-visualization/dashboards) — presentation dashboards "show viewers the current status of key performance indicators", exploration dashboards "allow users to interact with the data". They need different containers.

## Bad references
- Dribbble-style "SaaS dashboard" shots with 12 or more glossy cards, each with an icon, a big number and a fake upward sparkline. No comparisons, no table, no drill-down. Few's pitfall #6 is "Introducing meaningless variety" ([white paper](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)), and Tufte calls this decoration that "pretends to show statistical data" ([Tufte](https://www.edwardtufte.com/notebook/executive-dashboards/)).
- Card-per-row CRM or account views where sorting by revenue is impossible because cards have no column headers. This is the exact comparison failure NN/g describes.

## Accessibility
- Tables keep table semantics, so screen-reader users can navigate by column and hear headers per cell. Cards can't offer this, which is another reason to prefer tables for comparison.
- Card collections are a `<ul>` of `<li><article>`, so the count is announced ("list, 12 items").
- When toggling table/cards, keep focus on the toggle and announce "Showing 24 accounts as cards".
- A responsive stacked table must keep the column labels via injected labels (`::before` content) without duplicating announcements (`accessibility/accessible-generated-content.md`).

## Motion / interaction (if relevant)
- A view toggle swap can use a same-document view transition (`ui-behaviors/same-document-transitions.md`) under 300ms. Skip it for more than about 50 items or under reduced motion.

## Tokens and values
| Decision | Threshold |
|---|---|
| KPI cards in total | 3–6 |
| KPI cards per row | 4–6 at 1280px or wider, 2 at 768px or wider, 1 below |
| Max entity cards before switching to a table | about 12 |
| Max compared items in a comparison table | 5 (ideal 3–4) |
| List row: attributes beyond name | at most 3 |
| Table → stacked cards | container below 600px and 6 or fewer columns |
| Card grid min column | 14–18rem |

## Implementation sketch
```ts
type Task = "compare" | "pick" | "glance" | "browse-mixed" | "browse-visual";

export function chooseContainer(task: Task, itemCount: number, comparableAttrs: number): "table" | "list" | "kpi-cards" | "cards" | "grid" {
  if (task === "compare" || comparableAttrs >= 3) return "table";
  if (task === "glance" && itemCount <= 6) return "kpi-cards";
  if (task === "browse-visual") return "grid";
  if (task === "browse-mixed" && itemCount <= 12) return "cards";
  return "list";
}
```
```css
/* Same data, container-driven presentation: table ≥ 600px, stacked rows below */
.records { container-type: inline-size; }
@container (inline-size < 600px) {
  .records table, .records tbody, .records tr, .records th, .records td { display: block; }
  .records thead { display: none; }
  .records td::before { content: attr(data-label) ": "; color: var(--text-muted); }
}
```
(The `attr()` label must duplicate visible header text only. Keep meaningful text in the DOM per `accessible-generated-content.md`.)

## Checklist
- [ ] The container was chosen from the task (compare, pick, glance or browse), not from aesthetics.
- [ ] Homogeneous records with 3 or more comparable attributes are in a table.
- [ ] Cards are used for 6 or fewer KPIs or for heterogeneous widgets only.
- [ ] Any card grid keeps a fixed field order and regions aligned with subgrid.
- [ ] Narrow containers get a defined fallback (scroll with sticky column, or stacked).
- [ ] No tables inside cards inside cards. No table-for-layout.

## Sources
- https://www.nngroup.com/articles/cards-component/
- https://www.nngroup.com/articles/data-tables/
- https://www.nngroup.com/articles/comparison-tables/
- https://carbondesignsystem.com/data-visualization/dashboards
- https://carbondesignsystem.com/components/data-table/usage/
- https://design-system.service.gov.uk/components/table/
- https://www.925studios.co/blog/stripe-dashboard-design-breakdown
- https://www.edwardtufte.com/notebook/executive-dashboards/
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-components/card.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-atoms/responsive-table.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/accessibility/accessible-generated-content.md
- Repo: modern-web-guidance/skills/modern-web-guidance/guides/ui-behaviors/same-document-transitions.md
