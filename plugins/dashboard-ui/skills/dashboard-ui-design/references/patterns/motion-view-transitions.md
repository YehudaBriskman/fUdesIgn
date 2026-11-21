# View Transitions for page, tab and panel changes

> Use the View Transitions API to keep users oriented across route, tab and detail changes. Fetch first, then transition. Scope the transition to the component that changes where supported, morph at most one to three named elements, finish within 240 ms (400 ms for a list → detail morph), move focus afterwards, and fade or skip it under reduced motion.

**Category:** Motion · **Applies to:** SPA route changes, MPA navigations, dashboard tabs, list → detail drill-in, table re-sort, card expand, panel add/remove · **Priority:** should

## When to use / when not
The general mechanics are canonical in motion-ui, and this file doesn't repeat them: browser support and Baseline status, the default cross-fade, transition types for direction, naming rules (1–3 unique names), stretched-text fixes, the static app shell, focus after the swap and the cross-document (MPA) case are in `mtrans-view-transitions-and-routes.md`. Directional travel (16–24 px) is in `mtrans-spatial-origin-and-continuity.md`; durations and easing in `mfound-durations-and-easing.md`; the reduced-motion fallback in `mfound-reduced-motion-vestibular.md`. This file adds what data views need.

Related: tab vs segmented control choice in `comp-tabs-segmented-pills.md`; drill-down IA in `found-overview-filter-details.md`; keyed chart re-sorts in `motion-chart-transitions.md`.

Use:
- **List → detail** (a row or card becomes the detail header): a shared-element morph of 1–2 named elements (title, key figure).
- **Tab or segment change** within a dashboard: a short directional slide or cross-fade of the content panel only, with the tab bar static.
- **Re-sort or filter of DOM lists and tables**: `view-transition-name: match-element` on rows animates the reorder without a chart library.
- **Panel add/remove/resize** in a widget grid.

Avoid:
- High-frequency switching (keyboard shortcuts, `j`/`k` navigation): make it instant.
- Elements with running animations, such as spinners or live charts. Snapshots freeze them mid-frame for the duration.
- Large, frequently updating regions such as streaming tables or live canvases.

## Rules (do)
- **Data first, transition second.** `await` the data (or have it cached by stale-while-revalidate), then `startViewTransition(() => render(data))`. Chrome's docs: "During this time, the page is frozen, so delays here should be kept to a minimum." Keep callback work under 50 ms (the RAIL input-handler budget). Dashboard APIs are often slow, so this is the rule most often broken.
- **Prefer scoped transitions where available.** `element.startViewTransition()` on the panel or list is not Baseline and experimental (Chrome/Edge 147 only, MDN, November 2026), so always feature-detect and fall back to `document.startViewTransition()` or an instant swap. A document-level transition puts the `::view-transition` overlay over the whole page, which takes pointer input and paints above fixed headers and popovers until it ends; Chrome's element-scoped guide describes scoped transitions as fixing those layering issues "all while keeping the rest of the page interactive". Transitions on different scope roots can run at the same time, which suits dashboards made of independent panels.
- **Tab panels:** slide only the panel, by 16–24 px, in `--motion-dur-medium` 240 ms with `--motion-ease-enter`; direction from the tab order (`tab-left`/`tab-right` types). Keep focus on the tab itself (ARIA tabs pattern), not on the panel heading.
- **List → detail:** the morph may take `--motion-dur-long` 400 ms when a row grows into a full detail panel; everything else stays within 240 ms.
- **Table rows:** `view-transition-name: match-element` plus `view-transition-class: row`; never hand-name every row of a 50-row table.
- **Cache inactive tab views** with `content-visibility: hidden` and `inert`, so returning is instant. web.dev: `content-visibility: hidden` "hides the element while preserving its rendering state", and Facebook measured "up to 250ms improvement in navigation times when going back to previously cached views". Cached views cost memory, so keep 3–5 and evict the least recently used beyond that (house numbers).
- **Rapid tab clicks skip, never queue.** A new transition skips the running one (Chrome docs), including on a scope that already hosts one, so effective duration falls to 0 under rapid input. That is correct.

## Anti-patterns (don't)
- `startViewTransition(async () => { await fetch(...) })`: the UI freezes until the network responds. On a slow API this reads as a hang with no spinner.
- A full-page slide on every tab change: vestibular trigger, and the whole dashboard looks like it moved.
- Giving every card a name on a 50-card grid: duplicate names make the transition silently not run.
- Document-level transitions while a sticky header, filter bar or open popover must stay interactive.
- Transitioning a panel that holds a live chart or streaming table.

## Good references
- [Chrome for Developers, Element-scoped view transitions](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions) and [MDN, Element.startViewTransition()](https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition): Chrome 147+; scope roots get `contain: layout` during the transition; transitions on different scopes run simultaneously; MDN marks it experimental and shows the `if (!el.startViewTransition)` fallback.
- [web.dev, content-visibility](https://web.dev/articles/content-visibility): `content-visibility: hidden` keeps inactive SPA views' rendering state so they reappear fast.
- motion-ui's `mtrans-view-transitions-and-routes.md` holds the Chrome same-document and cross-document guides, the spec and MDN references.

## Bad references
- Route-level "page slide" demos that apply a 400–600 ms full-viewport horizontal slide to every navigation in an admin app. Spatial motion without spatial meaning, repeated hundreds of times a day ([NN/g](https://www.nngroup.com/articles/animation-duration/)).
- SPA routers that wrap the data loader inside the transition callback. The Chrome docs warn explicitly that this freezes the page.

## Accessibility
- Reduced motion: a 150 ms fade or `skipTransition()` (motion-ui `mfound-reduced-motion-vestibular.md`; `motion-reduced-motion.md`).
- Focus: the new view's heading after a route or drill-in; the tab itself for tab panels.
- Don't rely on the morph to explain the relationship. Breadcrumbs or a heading must state it.

## Tokens and values
| Token | Value |
|---|---|
| tab slide | `--motion-dur-medium` 240 ms, `--motion-ease-enter`, 16–24 px |
| list → detail morph | `--motion-dur-long` 400 ms |
| other transitions, reduced motion | see `mtrans-view-transitions-and-routes.md` |
| max callback (frozen) time | 50 ms target, 100 ms max |
| cached tab views | 3–5, LRU beyond |

## Implementation sketch
```css
.table tbody tr { view-transition-name: match-element; view-transition-class: row; }
.panel { view-transition-name: panel; }

@media (prefers-reduced-motion: no-preference) {
  :active-view-transition-type(tab-right)::view-transition-new(panel) { animation: var(--motion-dur-medium) var(--motion-ease-enter) both slide-from-right; }
}
@keyframes slide-from-right { from { translate: 16px 0; opacity: 0; } }
.tab-view[data-cached] { content-visibility: hidden; }
```
```ts
type Direction = 'tab-left' | 'tab-right';
// Element-scoped View Transitions are newer than the DOM lib types: declare the shape we use.
type ScopedVT = HTMLElement & {
  startViewTransition(opts: { update: () => void; types: string[] }): ViewTransition;
};
const canScope = (el: HTMLElement): el is ScopedVT => 'startViewTransition' in el;

export async function switchTab(panel: HTMLElement, tab: HTMLElement, load: () => Promise<DocumentFragment>, dir: Direction): Promise<void> {
  const content = await load();                         // 1. fetch OUTSIDE the transition
  const apply = (): void => { panel.replaceChildren(content); };
  if (!canScope(panel)) { apply(); return; }            // fallback: instant swap
  const vt = panel.startViewTransition({ update: apply, types: [dir] }); // 2. scoped
  vt.ready.catch(() => {});                             // a rapid re-click skips this one
  await vt.updateCallbackDone;
  tab.focus();                                          // 3. focus stays on the tab
}
```

## Checklist
- [ ] The motion-ui view-transition checklist passes (progressive enhancement, 1–3 unique names, direction from types, focus, reduced motion).
- [ ] No network or `await` on remote data inside the update callback.
- [ ] Scoped (`element.startViewTransition`, feature-detected) unless the whole page truly changes.
- [ ] No transition over live charts or streaming tables; rapid tab clicks skip.
- [ ] Inactive tab views cached (3–5).

## Sources
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions
- https://developer.chrome.com/blog/element-scoped-view-transitions
- https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition
- https://web.dev/articles/content-visibility
- https://web.dev/articles/rail
- https://www.nngroup.com/articles/animation-duration/
