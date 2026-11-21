# View Transitions for page, tab and panel changes

> Use the View Transitions API to keep users oriented across route, tab and detail changes. Fetch first, then transition. Scope the transition to the component that changes, morph at most one to three named elements, finish within 250–350 ms, move focus afterwards, and skip it entirely under reduced motion.

**Category:** Motion · **Applies to:** SPA route changes, MPA navigations, dashboard tabs, list → detail drill-in, table re-sort, card expand, panel add/remove · **Priority:** should

## When to use / when not
Related: tab vs segmented control choice in `comp-tabs-segmented-pills.md`; drill-down IA in `found-overview-filter-details.md`.

Use:
- **List → detail** (a row or card becomes the detail header): a shared-element morph of 1–2 named elements (title, key figure).
- **Tab or segment change** within a dashboard: a short directional slide or cross-fade of the content panel only, with the tab bar static.
- **Re-sort or filter of DOM lists and tables**: `view-transition-name: match-element` on rows animates the reorder without a chart library.
- **Panel add/remove/resize** in a widget grid.

Avoid:
- Every navigation, every time. High-frequency tab switching (keyboard shortcuts, `j`/`k` navigation) should be instant.
- When the update callback waits on the network. The page is **frozen** while the callback's promise is pending (Chrome docs). Fetch first, then call `startViewTransition` with synchronous DOM work.
- Elements with running animations, such as spinners or live charts. Snapshots freeze them mid-frame for the duration.
- Large, frequently updating regions such as streaming tables or live canvases.

## Rules (do)
- **Data first, transition second:** `await` the data (or have it cached by stale-while-revalidate), then `startViewTransition(() => render(data))`. Keep callback work under ~50 ms.
- **Prefer scoped transitions:** `element.startViewTransition()` on the panel or list. A document-level transition blocks pointer events on the whole page and covers fixed headers and popovers; scoped ones leave the rest of the dashboard interactive and can run concurrently (modern-web-guidance, scoped-component-transitions).
- **Name sparingly:** 1–3 named shared elements for a page transition (the thing the user is tracking). Names must be unique at any moment; a duplicate name skips the whole transition.
- **Use `view-transition-class`** to style groups (all rows, all cards) once.
- **Use `types`** for direction (`forward`/`backward`, `tab-left`/`tab-right`), and style them with `:active-view-transition-type()`.
- **Durations:** cross-fade root 150–200 ms; shared-element morph 250–350 ms; directional tab slide 200–250 ms with ≤ 24 px travel, not a full-width slide.
- **Fix aspect-ratio stretching** of text: `width: fit-content` on both states, or `height: 100%` on `::view-transition-old/new`.
- **Clean up** temporary `view-transition-name`s in `transition.finished`.
- **Focus management is mandatory.** View transitions don't move focus. After `updateCallbackDone`/`finished`, focus the new view's heading (`tabindex="-1"`).
- **Cache inactive tab views** with `content-visibility: hidden` and `inert` for 3–5 tabs, so returning is instant. Add an LRU eviction policy when there are many views.
- **Interrupting:** a new transition skips the running one to its end. For rapid tab clicks, this is the desired behaviour; don't queue.

## Anti-patterns (don't)
- `startViewTransition(async () => { await fetch(...) })`: the UI freezes until the network responds. On a slow API this reads as a hang with no spinner.
- A full-page slide on every tab change: vestibular trigger, and the whole dashboard looks like it moved.
- Giving every card a name on a 50-card grid for a page navigation: the result is a busy snapshot soup, often with duplicate names, so the transition silently doesn't run.
- Document-level transitions while a sticky header or open popover must stay interactive.
- Morphing elements whose aspect ratio changes, without fixing stretch (text smears).
- No fallback branch for browsers without the API.

## Good references
- [Chrome for Developers, Same-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): duplicate names skip the transition; `view-transition-class`; `types`; "During this time, the page is frozen, so delays here should be kept to a minimum"; reduced motion "doesn't mean the user wants no motion" (a gentle fade is fine).
- [MDN, View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): pseudo-element tree (`::view-transition-group/image-pair/old/new`), `ready`/`updateCallbackDone`/`finished`, cross-document opt-in via `@view-transition { navigation: auto; }`.
- modern-web-guidance [scoped-component-transitions](skills/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions.md): `element.startViewTransition()` keeps the rest of the page interactive and allows concurrent transitions per widget. The right default for dashboards made of independent panels.
- modern-web-guidance [faster-spa-view-transitions](skills/modern-web-guidance/guides/performance/faster-spa-view-transitions.md): `content-visibility: hidden` caching of inactive tab views, with explicit RAM trade-offs and an LRU requirement.

## Bad references
- Route-level "page slide" demos that apply a 400–600 ms full-viewport horizontal slide to every navigation in an admin app. Spatial motion without spatial meaning, and repeated hundreds of times a day. NN/g's 500 ms ceiling and its frequency rule both argue against it ([NN/g](https://www.nngroup.com/articles/animation-duration/)).
- SPA routers that wrap the data loader inside the transition callback. The Chrome docs warn explicitly that this freezes the page.

## Accessibility
- Wrap custom VT animations so that under reduced motion they become `animation: none`. Alternatively call `transition.skipTransition()` when `matchMedia('(prefers-reduced-motion: reduce)').matches`. A ≤ 150 ms cross-fade is acceptable as the reduced variant (WCAG 2.3.3: opacity changes are not "motion animation").
- Move focus to the new view's heading after the update. Keep focus on the tab itself for tab panels (ARIA tabs pattern).
- Don't rely on the morph to explain the relationship. Breadcrumbs or a heading must state it.

## Motion / interaction (if relevant)
- Direction: forward (drill-in) slides or morphs content toward the user (scale 0.98 → 1, translate 16 px); back reverses. Set it with `types`.
- Fast-switching tabs: each click skips the previous transition. Effective duration falls to 0 under rapid input, which is correct.

## Tokens and values
| Token | Value |
|---|---|
| `--vt-dur-fade` | 180 ms, `linear` |
| `--vt-dur-morph` | 300 ms, `cubic-bezier(0.2, 0, 0, 1)` |
| `--vt-dur-tab` | 220 ms, `cubic-bezier(0, 0, 0.38, 0.9)` |
| tab slide distance | 16–24 px |
| named shared elements per transition | 1–3 |
| max callback (frozen) time | 50 ms target, 100 ms max |
| cached tab views | 3–5, LRU beyond |

## Implementation sketch
```css
@view-transition { navigation: auto; } /* MPA opt-in, both pages */

.kpi-card[data-selected] h3 { view-transition-name: kpi-title; }
.detail h1 { view-transition-name: kpi-title; width: fit-content; }
.table tbody tr { view-transition-name: match-element; view-transition-class: row; }

@media (prefers-reduced-motion: no-preference) {
  ::view-transition-group(*) { animation-duration: 300ms; animation-timing-function: cubic-bezier(0.2, 0, 0, 1); }
  ::view-transition-group(.row) { animation-duration: 250ms; }
  :active-view-transition-type(tab-right)::view-transition-new(panel) { animation: 220ms cubic-bezier(0,0,.38,.9) both slide-from-right; }
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 150ms !important; animation-name: -ua-view-transition-fade-in, -ua-view-transition-fade-out; }
}
@keyframes slide-from-right { from { translate: 16px 0; opacity: 0; } }
```
```ts
type Direction = 'tab-left' | 'tab-right';

export async function switchTab(panel: HTMLElement, load: () => Promise<DocumentFragment>, dir: Direction): Promise<void> {
  const content = await load();                         // 1. fetch OUTSIDE the transition
  const apply = (): void => { panel.replaceChildren(content); };
  if (!('startViewTransition' in panel)) { apply(); return; }
  const vt = panel.startViewTransition({ update: apply, types: [dir] }); // 2. scoped
  vt.ready.catch(() => {});                             // a rapid re-click skips this one
  await vt.updateCallbackDone;
  panel.querySelector<HTMLElement>('h2')?.focus();      // 3. focus routing
}
```
`element.startViewTransition` is newer than `document.startViewTransition`. Feature-detect, and fall back to `document.startViewTransition` or an instant swap.

## Checklist
- [ ] No network or `await` on remote data inside the update callback.
- [ ] Scoped (`element.startViewTransition`) unless the whole page truly changes.
- [ ] 1–3 named shared elements; names unique; temporary names cleaned up.
- [ ] Durations: fade ≤ 200 ms, morph ≤ 350 ms.
- [ ] Focus moved to the new heading after the update.
- [ ] Reduced motion: skip, or fade only.
- [ ] Fallback path without the API works identically, minus the animation.

## Sources
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://www.nngroup.com/articles/animation-duration/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/same-document-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/group-element-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/cross-document-transitions.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/dynamic-sort.md
- modern-web-guidance: skills/modern-web-guidance/guides/performance/faster-spa-view-transitions.md
