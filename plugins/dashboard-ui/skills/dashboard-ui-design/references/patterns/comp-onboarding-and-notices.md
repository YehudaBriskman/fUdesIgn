# Onboarding, first-run notices and disclaimers

> First-run help and legal notices sit in the flow, never on top of data. Show a disclaimer once, in one canonical place, linked from wherever it matters. Teach through empty states and on-demand hints instead of tours. Remember every dismissal.

**Category:** Components and interaction · **Applies to:** first-visit notices, terms and "not financial advice" disclaimers, required acknowledgements, cookie and consent banners, coach marks, product tours, "what's new" messages · **Priority:** should

## When to use / when not
Decision table, first match wins:

| Situation | Surface |
|---|---|
| The user must accept terms before *any* use (regulated product, data-processing consent) | One-time **modal dialog** with the terms summary, a link to the full text, and an explicit accept button. See `comp-overlay-choice.md` |
| A notice that applies to every page ("Estimates, not investment advice") | **In-flow notice at the top of the main region**, dismissible, plus a permanent footer link to the full text |
| A notice that applies to one number or one view ("Delayed 15 min", "Estimate based on 3 analysts") | **Inline, next to that number**, never dismissible |
| A region with no data yet on first use | **Empty state** that teaches the next action. See `data-loading-empty-error-states.md` |
| A feature that is genuinely novel (custom gesture, scenario weights) | **One contextual hint** shown when the user first reaches that feature, one at a time |
| A change in the product | **"What's new" entry** in a menu or changelog, pulled by the user, not pushed on load |

- **Don't** use a multi-step tour to explain conventional controls (tables, filters, tabs). NN/g: tutorials interrupt, don't reliably improve task performance and are quickly forgotten.
- **Don't** open a modal on page load for anything that isn't a hard requirement (see `comp-overlay-choice.md`).

## Rules (do)
- **Never cover data.** A notice is part of the layout. It pushes content down; it doesn't float over it.
  - No `position: fixed` or `sticky` bottom bars for notices. GOV.UK's cookie banner sits at the top of the page, before the skip link, and is deliberately not sticky so it can't hide focused content (WCAG 2.2 SC 2.4.11).
  - On a 390px phone, a fixed bar of 3 lines plus buttons takes roughly a quarter of the viewport. That is a quarter of the dashboard hidden until dismissed.
  - If something must stay sticky (a legally required banner), reserve its space with `scroll-padding-block-end` so focused elements are never fully hidden (WCAG technique against failure F110).
- **One canonical disclaimer.** Write it once, at one URL (`/disclaimer` or a methodology section). Everywhere else, link to it in a short line. The SEC's plain-English rule for prospectuses (Rule 421(b)) warns against vague boilerplate and against disclosure "repeated in different sections" that adds size without adding information. Three copies of the same paragraph (banner, footer, page body) train users to skip all three.
- **Put material qualifications next to the claim.** FINRA (Regulatory Notice 13-23) criticised prominent fee claims with the other fees disclosed only in a footnote, and Notice 19-31 encourages weaving disclosures into the message itself. For a dashboard this means "Estimate · 15-min delay · method" next to the value, not only in a footer.
- **Required acknowledgements are explicit.** A checkbox or button that says what is accepted ("I understand these are estimates, not advice"). Record the version accepted and the time. Ask again only when the text's version changes.
- **Dismissal is remembered.** Store the dismissed notice ID and version: on the server for signed-in users, in storage otherwise. A dismissed notice never returns on the next page. GOV.UK keeps the cookie choice for 1 year.
- **Keep a way back.** Every dismissed hint or notice can be found again: "What's new", a help menu or the footer link (NN/g: make help easy to dismiss and easy to recall).
- **Hints: one at a time, at the moment of need.** NN/g's coach-mark study found hint chains make users dismiss faster and the app seem harder. One hint, ≤ 1 short sentence, pointing at the control it explains, shown when the user first reaches it.
- **Tours, if any, are short and user-started.** Chameleon's benchmark data (vendor data, 15M interactions) shows completion falling sharply past 4–5 steps, self-serve tours completing 123% more often than automatic ones, and progress indicators raising completion by 12%. So: ≤ 4 steps, started from a "Take the tour" link or a checklist, with "Step 2 of 4" visible.
- **Hints must look different from controls.** NN/g saw users try to tap decorative overlay icons that looked interactive. Use a distinct callout style and a visible close button.
- **Empty states are the main onboarding surface.** Each first-use empty state says what will appear and offers the one action that fills it (see `found-microcopy-for-data.md`).

## Anti-patterns (don't)
- A fixed bottom "first visit" bar that sits over the last row of data or the chart axis until dismissed.
- The same disclaimer in a banner, the footer and the page body.
- A 7-step product tour on first load that dims the dashboard.
- Coach marks chained one after another ("Next", "Next", "Next").
- A notice that comes back on every page or every visit after dismissal.
- Hiding a material qualification ("delayed", "estimate", "excludes fees") only in a footer or a tooltip.
- Stacking several banners (cookie, notice, upsell) at once.
- An acknowledgement that is pre-ticked or is accepted by scrolling.

## Good references
- [GOV.UK Design System: Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/) — at the top of the page, before the skip link, not sticky, a confirmation with "Hide cookie message", choice stored for 1 year, focus moved to the confirmation.
- [W3C: Understanding SC 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — sticky headers, footers and banners fail when they fully hide a focused element; scroll padding or a dismissible design fixes it.
- [NN/g: Onboarding tutorials vs contextual help](https://www.nngroup.com/articles/onboarding-tutorials/) — push revelations (shown out of context) fail; pull revelations (shown when the user needs them) work; make help easy to dismiss and to recall.
- [NN/g: Mobile instructional overlays](https://www.nngroup.com/articles/mobile-instructional-overlay/) — one action per hint, no chains, short text, visually distinct from the UI.
- [Carbon: Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) — onboarding as an optional flow started *from* an empty state, plus starter content when useful.
- [Chameleon: Product tour benchmarks](https://www.chameleon.io/blog/product-tour-benchmarks-highlights) — average completion 61%, self-serve tours +123%, checklist-launched tours +21%, progress indicators +12% (vendor data; treat as directional).

## Bad references
- [NN/g: Mobile instructional overlays](https://www.nngroup.com/articles/mobile-instructional-overlay/) — the Makr iPad app's wordy multi-step tips forced users to memorise steps before they could act.
- [FINRA Regulatory Notice 13-23](https://www.finra.org/rules-guidance/notices/13-23) — fee claims made prominent while other fees sat only in a footnote; the regulator treats that as potentially misleading.
- Dogfood review of a valuation product (2026-11-21): a fixed first-visit bar covered about 61px on desktop and about a quarter of a 390px viewport, while the same disclaimer also appeared in every footer and on the methodology page.

## Accessibility
- An in-flow notice is a `<section aria-label="Notice">` (or `role="region"`), not a live region. It is present on load, so it doesn't need announcing.
- When the user dismisses it, move focus to the next sensible element (the main heading), not to `<body>`.
- A required acknowledgement in a `<dialog>` gets a name, a visible heading and the full text reachable by keyboard; the accept control is a real `<button>` or checkbox.
- Hints anchored to a control: `popover="manual"` with a close button, linked to the control by `aria-describedby` while open. Don't trap focus in a hint.
- Respect zoom: at 400% zoom a fixed bar can cover the whole viewport, which is another reason not to fix it.

## Motion / interaction (if relevant)
- A dismissed in-flow notice collapses its height in ≤ 200 ms; with reduced motion it disappears at once.
- No pulsing "hotspot" beacons on data. If a beacon is used, it is static.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Notice max length | 1–2 sentences + 1 link | In-flow notices |
| Hint length | ≤ 1 sentence, about 80 characters | Coach marks |
| Hints at once | 1 | Coach marks |
| Tour length | ≤ 4 steps, with "Step n of N" | Optional tours |
| Dismiss persistence | until notice version changes; consent 1 year | Storage |
| Collapse duration | ≤ 200 ms | Dismissal |

## Implementation sketch
```html
<main id="main">
  <section class="notice" aria-label="Notice" data-notice="estimates" data-version="2026-11">
    <p>Values are model estimates, not investment advice.
       <a href="/methodology#limits">How we calculate them</a></p>
    <button type="button" class="notice-close">Dismiss</button>
  </section>
  <h1 id="title" tabindex="-1">Apple Inc. (AAPL)</h1>
  <!-- dashboard -->
</main>
<footer><a href="/disclaimer">Disclaimer</a></footer>
```
```css
.notice {
  display: flex;
  gap: 12px;
  align-items: start;
  justify-content: space-between;
  padding: 12px 16px;
  margin-block-end: 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-primary);
  /* in flow: no position: fixed or sticky */
}
.notice[hidden] { display: none; }
.notice-close { min-block-size: 24px; min-inline-size: 24px; }
@media (pointer: coarse) { .notice-close { min-block-size: 44px; } }
/* Only if a sticky legal bar is unavoidable: keep focused items visible */
html:has(.legal-bar) { scroll-padding-block-end: 96px; }
```
```ts
interface Dismissal { id: string; version: string; at: string }

const KEY = 'notices.dismissed'

function read(): Dismissal[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((d): d is Dismissal =>
      typeof d === 'object' && d !== null && 'id' in d && 'version' in d) : []
  } catch { return [] }
}

export function initNotices(root: ParentNode = document): void {
  const dismissed = read()
  root.querySelectorAll<HTMLElement>('.notice[data-notice]').forEach((el) => {
    const id = el.dataset.notice ?? '', version = el.dataset.version ?? ''
    if (dismissed.some((d) => d.id === id && d.version === version)) { el.hidden = true; return }
    el.querySelector('.notice-close')?.addEventListener('click', () => {
      el.hidden = true
      try { localStorage.setItem(KEY, JSON.stringify([...read(), { id, version, at: new Date().toISOString() }])) } catch { /* private mode: dismiss for this page only */ }
      document.getElementById('title')?.focus()
    })
  })
}
```

## Checklist
- [ ] No notice, hint or banner is fixed or sticky over data; notices are in flow.
- [ ] Each disclaimer exists in one canonical place; other places link to it.
- [ ] Material qualifications (estimate, delay, fees) sit next to the number they qualify.
- [ ] Required acknowledgements are explicit, versioned and asked again only when the text changes.
- [ ] Dismissals persist across pages and visits, and the content can be found again.
- [ ] Hints appear one at a time, in context, and look different from controls.
- [ ] Any tour is ≤ 4 steps, user-started and shows progress.
- [ ] At 390px and at 400% zoom, nothing covers the data on first visit.

## Sources
- https://design-system.service.gov.uk/components/cookie-banner/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.nngroup.com/articles/onboarding-tutorials/
- https://www.nngroup.com/articles/mobile-instructional-overlay/
- https://www.nngroup.com/articles/empty-state-interface-design/
- https://carbondesignsystem.com/patterns/empty-states-pattern/
- https://www.chameleon.io/blog/product-tour-benchmarks-highlights
- https://www.chameleon.io/benchmark-report-24 (2024 report: tours with more than four steps fall below the 33.5% average; five-step tours 21.6%)
- https://www.sec.gov/pdf/handbook.pdf (A Plain English Handbook, reprint of Rule 421(b) and its note)
- https://www.finra.org/rules-guidance/notices/13-23 (fee claims with other fees only in a footnote do not comply with Rule 2210(d)(1)(C))
- https://finra.org/rules-guidance/notices/19-31 (Q4: disclosures integrated into the body of the message)
- https://www.nngroup.com/articles/cookie-permission-banners/ (fetch failed, 404)
- Dogfood report, valuation product review, 2026-11-21 (A.3 #4)
