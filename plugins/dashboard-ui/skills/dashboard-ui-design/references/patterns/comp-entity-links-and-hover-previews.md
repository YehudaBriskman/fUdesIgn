# Entity cross-links and hover previews

> Every entity named on a page (project, person, account, ticker, filing) links to its own detail view, so users move detail → detail without going back to the sidebar. A hover or focus preview answers the quick question in place (after a 300–500 ms hover pause, at once on keyboard focus), shows only what matters from the current context, and is never the only way to reach that information.

**Category:** Components and interaction · **Applies to:** detail pages, table cells and list rows that name another record, activity feeds, comments and mentions, breadcrumbs of related records, KPI drill links · **Priority:** should

## When to use / when not
| Situation | Do |
|---|---|
| A page names another record the user may want to open (a task's project, an invoice's customer, a holding's issuer) | **Cross-link the name** to that record's detail route |
| The common follow-up question about that record is small (status, owner, last value) and answering it should not cost a page load | Add a **hover/focus preview** on the link |
| The user needs to act on the linked record (edit, assign, approve) | No preview for that: open a **side panel or the detail page** (see `comp-overlay-choice.md`) |
| A one-line definition of a term or icon | A **tooltip**, not a preview card (see `comp-overlay-choice.md`) |
| Touch-only or hover-less devices | Tap navigates; a visible **peek control** opens the same card, as a sheet on phones (see `monav-sheets-detents.md`, mobile-ui) |

- **Don't** add previews to every link on a dense table: a cursor crossing a column would open cards all the way down. Preview the one or two entity columns people actually ask about.
- **Don't** use a preview as a substitute for the information the current page should already show. If every user hovers the same link, that value belongs on the page.

## Rules (do)
- **Link the nouns, the Wikipedia way.** Wikipedia's articles link onward from the entities they mention, so a reader can go from one article to the next without returning to a menu. Apply the same model to records: wherever a page shows another entity's name, make that name a real `<a href>` to its detail route.
  - Links go both ways where the relationship does: the project page lists its tasks, and each task links back to its project.
  - Keep one canonical route per entity (`/projects/:id`), so every link to it lands on the same place and the back button works.
  - A user should be able to answer a two-entity question ("who owns the project this overdue task belongs to?") in one or two clicks, not four trips through the sidebar.
- **Choose the preview's content by the context the link sits in**, not by the entity's full record.
  - From a task, a project preview shows what the task's reader asks: project status, its owner, the team and the due date. From a finance view, the same project shows budget and burn.
  - GitHub's user hovercards add details specific to the viewer's interaction with that person, such as whether they are a code owner on the repository or opening their first pull request (GitHub blog, 2018). That is the model: the card answers "why does this person matter *here*".
  - 3–5 fields at most, plus the entity's name and type, and a link to the full record. Never dump the full record.
- **Delay the open, then show fast.** NN/g's timing guidelines: wait 0.3–0.5 s while the pointer rests on the target before exposing hidden content, then display it within 0.1 s. Keep it open until the pointer has been away for about 0.5 s, which also covers the trip from the link onto the card.
  - Use the shared `--interest-delay` token (500 ms) for the open delay and 250 ms for the close delay, the same values as `found-progressive-disclosure.md`. Lower the open delay towards 300 ms only on sparse layouts where links are far apart.
  - **Keyboard focus opens the preview immediately, with no open delay.** The hover delay exists only to filter out accidental pointer passes (NN/g: revealing content "too quickly on mouseover can result in accidental activations"); focus is a deliberate action, like the click or tap that NN/g says should begin exposing content within 0.1 s. The WAI-ARIA APG tooltip pattern requires the popup to appear on keyboard focus as well as hover and sets no delay for focus. Leaving (blur or pointer-out) still uses the 250 ms close grace period.
- **Meet WCAG 1.4.13 (Content on Hover or Focus, AA).** The preview must be:
  - *dismissible* without moving the pointer or focus (Esc);
  - *hoverable*: the pointer can move onto the card without it closing;
  - *persistent*: it stays until the trigger is removed, the user dismisses it or its information becomes invalid.
- **Never the only path.** The link itself navigates to the full record; the preview is a shortcut. Nothing in the preview (a field, an action, a status) exists only there.
- **Touch and keyboard alternatives.**
  - On touch, a tap on the link navigates as usual. Offer the preview through a visible peek control (an info button beside the name) that opens the same content as a popover or, on phones, a sheet. Long-press is a secondary route only: mobile browsers already use a long-press on a link for their own link menu, so it can't be the sole alternative.
  - On keyboard, focus opens the preview immediately; Esc closes it and keeps focus on the link. If the card holds links, give a key to move focus into it and Esc to return. GitHub uses Alt+Up to move into a hovercard and Esc to restore focus to the link (GitHub changelog, July 2024).
  - Offer a setting to turn previews off. Wikipedia and GitHub both do; Wikipedia's 2017–18 A/B tests found about 0.01% of sessions disabled them.
- **Use the platform.** A `popover="hint"` card with `interestfor` on the link gives hover, focus, long-press and Esc handling natively where supported: `interestfor` is Chromium only (Chrome/Edge 142) and experimental, and `popover="hint"` is not Baseline. Feature-detect it and fall back to scripted `pointerenter` / `focus` timers (sketch below). See the Platform support table in `comp-overlay-choice.md`.
- **Fetch on interest, cache per entity.** Load the preview data when the delay starts, not on page load; show a compact skeleton if it takes longer than 200 ms and keep it at least 400 ms once shown (see `prog-loading-states.md`); reuse the response for the rest of the session or until it is stale.

## Anti-patterns (don't)
- **"Every prompt became a page."** Pages that connect only to the sidebar and never to each other: a task names its project in plain text, so answering "who owns this?" means sidebar → Projects → search → open.
- Entity names rendered as plain text, or as buttons that open a modal instead of a linkable route.
- A preview that dumps the whole record (every field of the project) instead of the 3–5 that matter from here.
- Hover-only previews: nothing on focus, nothing on touch.
- Opening on `mouseover` with no delay, so a cursor crossing a table opens and closes a card per row.
- A preview that closes when the pointer moves onto it, or can't be dismissed without moving away (fails WCAG 1.4.13).
- Actions (Assign, Approve, Delete) that exist only inside a hover card.
- Prefetching previews for every link on page load.

## Good references
- [MediaWiki: Page Previews](https://www.mediawiki.org/wiki/Page_Previews) — Wikipedia's hover and focus previews of linked articles, rolled out across Wikipedias in 2017 and enabled on English and German Wikipedia in April 2018; activates on focus as well as hover and can be turned off.
- [MediaWiki: Page Previews 2017–18 A/B tests](https://www.mediawiki.org/wiki/Page_Previews/2017-18_A/B_Tests) — on English and German Wikipedia, pageviews per session fell 3–5% while distinct pages interacted with rose 20–22%, back-button use fell 2–9%, and about 0.01% of sessions turned previews off. Previews answered the question without a page load.
- [GitHub blog: Get to know your collaborators with hovercards](https://github.blog/news-insights/user-hovercards/) — user hovercards that include information specific to the viewer's interaction (code owner, first pull request).
- [GitHub changelog: Keyboard navigation improvements for hovercards](https://github.blog/changelog/2024-07-29-keyboard-navigation-improvements-for-hovercards/) — Alt+Up moves focus into the card, Esc restores focus to the link, and a setting disables all hovercards.
- [NN/g: Timing Guidelines for Exposing Hidden Content](https://www.nngroup.com/articles/timing-exposing-content/) — 0.3–0.5 s pause before showing, 0.1 s to show, about 0.5 s before hiding.

## Bad references
- A generated project tracker (typical "one page per prompt" output): the task page shows the project as plain text and the project page lists tasks without links, so every cross-entity question goes through the sidebar.
- [NN/g: Timing Guidelines for Exposing Hidden Content](https://www.nngroup.com/articles/timing-exposing-content/) — reveals with no pause cause accidental activations as the cursor passes over targets.

## Accessibility
- The trigger is a real link (`<a href>`), so it is focusable, announced as a link and works with the browser's open-in-new-tab.
- The preview is supplementary. Don't wire a rich card into `aria-describedby`: it would be read in full on every focus. Wikipedia's previews use tooltip semantics and are ignored by screen readers, and the full content is one activation away.
- WCAG 1.4.13: dismissible (Esc), hoverable and persistent, as in Rules.
- Interactive content inside the card needs a keyboard route in (a shortcut or a peek button) and Esc back to the link; never trap focus in a hint card.
- The peek control is a labelled button ("Preview Apollo project") of at least 24×24 px (44 px on touch).

## Motion / interaction (if relevant)
- The card fades in over `--motion-dur-micro` (100 ms), so it is fully shown within NN/g's 0.1 s; no movement under `prefers-reduced-motion: reduce`.
- Once one preview is open, moving to a neighbouring link swaps the card without a second open delay.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--interest-delay` | 500 ms (300 ms floor on sparse layouts) | open delay on pointer hover only |
| Focus open delay | 0 ms | keyboard focus is deliberate |
| Close delay | 250 ms (`interest-delay: var(--interest-delay) 250ms`) | grace period on pointer-out and blur; lets the pointer reach the card |
| Show duration | ≤ 100 ms after the delay | NN/g |
| Preview fields | 3–5, chosen by context | content budget |
| Preview width | 280–360 px | card size |
| Skeleton threshold | 200 ms | data fetch |
| Clicks for a two-entity question | 1–2 | cross-link test |

## Implementation sketch
```html
<p>Part of <a href="/projects/apollo" interestfor="peek-apollo" class="entity-link">Apollo</a>
  <button type="button" class="peek" popovertarget="peek-apollo" aria-label="Preview Apollo project">ⓘ</button></p>
<div id="peek-apollo" popover="hint" class="entity-peek" data-entity="project:apollo" data-context="task"></div>
```
```css
.entity-link { interest-delay: var(--interest-delay, 500ms) 250ms; }
.entity-peek {
  inline-size: min(340px, 90vw); padding: 12px 16px;
  border: 1px solid var(--border); border-radius: var(--radius-md);
  background: var(--surface); color: var(--text); box-shadow: var(--shadow-md);
}
@supports (position-area: block-end) {
  .entity-peek { inset: auto; margin: 4px 0 0; position-area: block-end span-inline-end; position-try-fallbacks: flip-block; }
}
.peek { display: none; min-inline-size: 24px; min-block-size: 24px; }
@media (hover: none) { .peek { display: inline-grid; min-inline-size: 44px; min-block-size: 44px; } }
@media (prefers-reduced-motion: no-preference) {
  .entity-peek { transition: opacity var(--motion-dur-micro, 100ms) ease-out, display var(--motion-dur-micro, 100ms) allow-discrete; }
  .entity-peek:popover-open { opacity: 1; }
  @starting-style { .entity-peek:popover-open { opacity: 0; } }
}
```
```ts
type EntityKind = 'project' | 'person' | 'team'
type PageContext = 'task' | 'finance' | 'people'
interface PreviewField { label: string; value: string }
type Fetcher = (kind: EntityKind, id: string, fields: readonly string[]) => Promise<PreviewField[]>

// The context decides what the card answers; the entity alone does not.
const FIELDS: Record<EntityKind, Record<PageContext, readonly string[]>> = {
  project: { task: ['status', 'owner', 'team', 'due'], finance: ['budget', 'burn', 'forecast'], people: ['owner', 'members'] },
  person: { task: ['status', 'role', 'openTasks'], finance: ['costCentre', 'approvals'], people: ['team', 'manager', 'location'] },
  team: { task: ['lead', 'capacity'], finance: ['budget'], people: ['lead', 'members'] },
}

const isKind = (v: string): v is EntityKind => v === 'project' || v === 'person' || v === 'team'
const isContext = (v: string): v is PageContext => v === 'task' || v === 'finance' || v === 'people'

function ms(el: Element, prop: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(prop).trim()
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return fallback
  return raw.endsWith('ms') ? n : raw.endsWith('s') ? n * 1000 : n
}

const cache = new Map<string, Promise<PreviewField[]>>()

export function wireEntityPreview(link: HTMLAnchorElement, card: HTMLElement, fetchFields: Fetcher): void {
  const [kind = '', id = ''] = (card.dataset.entity ?? '').split(':')
  const context = card.dataset.context ?? ''
  if (!isKind(kind) || !isContext(context) || !id) return

  const render = (): void => {
    const key = `${kind}:${id}:${context}`
    const pending = cache.get(key) ?? fetchFields(kind, id, FIELDS[kind][context])
    cache.set(key, pending)
    void pending.then((fields) => {
      const list = document.createElement('dl')
      for (const f of fields.slice(0, 5)) {
        const dt = document.createElement('dt'); dt.textContent = f.label
        const dd = document.createElement('dd'); dd.textContent = f.value
        list.append(dt, dd)
      }
      const more = document.createElement('a'); more.href = link.href; more.textContent = `Open ${link.textContent ?? ''}`
      card.replaceChildren(list, more)
    })
  }
  card.addEventListener('toggle', () => { if (card.matches(':popover-open')) render() })

  // Keyboard focus is deliberate: open at once, in both the native and the fallback path.
  link.addEventListener('focus', () => { if (link.matches(':focus-visible') && !card.matches(':popover-open')) card.showPopover() })

  // Native interest invokers handle hover, long-press, the hover delay and Esc.
  if (Object.hasOwn(HTMLAnchorElement.prototype, 'interestForElement')) return

  // Fallback: an unknown popover value behaves as "manual", so open and close it ourselves.
  const openDelay = ms(document.documentElement, '--interest-delay', 500)
  const closeDelay = 250
  let timer = 0
  const open = (): void => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { if (!card.matches(':popover-open')) card.showPopover() }, openDelay)
  }
  const close = (): void => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      if (!card.matches(':hover, :focus-within') && !link.matches(':hover, :focus')) card.hidePopover()
    }, closeDelay)
  }
  link.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open() })
  link.addEventListener('pointerleave', close)
  link.addEventListener('blur', close)
  card.addEventListener('pointerenter', () => window.clearTimeout(timer)) // hoverable (WCAG 1.4.13)
  card.addEventListener('pointerleave', close)
  document.addEventListener('keydown', (e) => {                            // dismissible without moving
    if (e.key === 'Escape' && card.matches(':popover-open')) { window.clearTimeout(timer); card.hidePopover() }
  })
}
```

## Checklist
- [ ] Every entity named on a page links to its canonical detail route; related records link both ways.
- [ ] A two-entity question ("who owns this task's project?") takes 1–2 clicks, without the sidebar.
- [ ] Previews show 3–5 fields chosen by the page's context, plus a link to the full record.
- [ ] The open delay is `--interest-delay` (300–500 ms) on pointer hover and 0 ms on keyboard focus; the card opens within 100 ms after it. Leaving uses the 250 ms grace period.
- [ ] Previews are dismissible with Esc, hoverable and persistent (WCAG 1.4.13).
- [ ] Touch has a peek control or long-press alternative; keyboard can reach any links inside the card.
- [ ] Nothing exists only in a preview; previews can be turned off.
- [ ] `interestfor` is feature-detected with a scripted fallback; preview data loads on interest, not on page load.

## Sources
- https://www.mediawiki.org/wiki/Page_Previews (rollout dates, focus activation, opt-out, tooltip semantics ignored by screen readers)
- https://www.mediawiki.org/wiki/Page_Previews/2017-18_A/B_Tests (enwiki/dewiki: pageviews per session −3 to −5%, distinct pages interacted +20 to +22%, back-button −2 to −9%, disable rate about 0.01%)
- https://github.blog/news-insights/user-hovercards/ (2018, viewer-specific hovercard content)
- https://github.blog/changelog/2018-10-08-issue-and-pull-request-hovercards
- https://github.blog/changelog/2024-07-29-keyboard-navigation-improvements-for-hovercards/
- https://www.nngroup.com/articles/timing-exposing-content/ (Aurora Harley, 2015: 0.3–0.5 s hover pause against accidental activation, 0.1 s, 0.5 s; click or tap begins exposing within 0.1 s)
- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ (the popup appears on keyboard focus or hover; Esc dismisses; no focus delay specified)
- https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html (SC 1.4.13, Level AA)
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers (`interestfor`, `interest-delay`, hover/focus/long-press, Esc, feature detection)
- https://html.spec.whatwg.org/multipage/popover.html (an unknown `popover` value falls back to `manual`)
