# View Transitions for page, tab and panel changes

> Use the View Transitions API to keep users oriented across route, tab and detail changes. Fetch first, then transition. Scope the transition to the component that changes where supported, morph at most one to three named elements, finish within 240 ms (400 ms for a list → detail morph), move focus afterwards, and fade or skip it under reduced motion.

**Category:** Motion · **Applies to:** SPA route changes, MPA navigations, dashboard tabs, list → detail drill-in, table re-sort, card expand, panel add/remove · **Priority:** should

## When to use / when not
**Support (MDN compat data and web-features, November 2026):**

| Feature | Status | Fallback |
|---|---|---|
| `document.startViewTransition()` (same-document) | Baseline 2025, newly available since October 2025 (Chrome/Edge 111, Firefox 144, Safari 18) | feature-detect and apply the DOM change with no animation |
| `view-transition-class` | Baseline 2025, newly available (Chrome 125, Firefox 144, Safari 18.2) | per-name selectors |
| `view-transition-name: match-element` | Chrome 137, Firefox 144, Safari 18.4 | generate unique names (`row-<id>`) in JS |
| `types` and `:active-view-transition-type()` | Baseline 2026, newly available since January 2026 (Chrome 125, Firefox 147, Safari 18.2) | a class on `<html>` set before the transition |
| Cross-document `@view-transition { navigation: auto; }` | not Baseline: Chrome 126, Safari 18.2; Firefox only in preview | plain navigation; the rule is ignored |
| Element-scoped `element.startViewTransition()` | not Baseline, experimental: Chrome/Edge 147 only | `document.startViewTransition()`, or an instant swap |

Related: tab vs segmented control choice in `comp-tabs-segmented-pills.md`; drill-down IA in `found-overview-filter-details.md`.

Use:
- **List → detail** (a row or card becomes the detail header): a shared-element morph of 1–2 named elements (title, key figure).
- **Tab or segment change** within a dashboard: a short directional slide or cross-fade of the content panel only, with the tab bar static.
- **Re-sort or filter of DOM lists and tables**: `view-transition-name: match-element` on rows animates the reorder without a chart library.
- **Panel add/remove/resize** in a widget grid.

Avoid:
- Every navigation, every time. High-frequency tab switching (keyboard shortcuts, `j`/`k` navigation) should be instant.
- When the update callback waits on the network. Chrome's docs: "During this time, the page is frozen, so delays here should be kept to a minimum." Fetch first, then call `startViewTransition` with synchronous DOM work.
- Elements with running animations, such as spinners or live charts. Snapshots freeze them mid-frame for the duration.
- Large, frequently updating regions such as streaming tables or live canvases.

## Rules (do)
- **Data first, transition second:** `await` the data (or have it cached by stale-while-revalidate), then `startViewTransition(() => render(data))`. Keep callback work under 50 ms (the RAIL input-handler budget).
- **Prefer scoped transitions where available:** `element.startViewTransition()` on the panel or list (Chrome 147+ only, so always feature-detect). A document-level transition puts the `::view-transition` overlay over the whole page, which takes pointer input and paints above fixed headers and popovers until it ends; Chrome's element-scoped guide describes scoped transitions as fixing those layering issues "all while keeping the rest of the page interactive". Scoped transitions on different scope roots can run at the same time.
- **Name sparingly:** 1–3 named shared elements for a page transition (the thing the user is tracking). Names must be unique at any moment: "If two rendered elements have the same `view-transition-name` at the same time, the transition will be skipped" (Chrome docs).
- **Use `view-transition-class`** to style groups (all rows, all cards) once.
- **Use `types`** for direction (`forward`/`backward`, `tab-left`/`tab-right`), and style them with `:active-view-transition-type()`.
- **Durations (tokens):** root cross-fade `--motion-dur-short` 150 ms, `linear`; directional tab slide `--motion-dur-medium` 240 ms with `--motion-ease-enter` and ≤ 24 px travel, not a full-width slide; shared-element morph `--motion-dur-medium` 240 ms with `--motion-ease-standard`, or `--motion-dur-long` 400 ms when a list row grows into a full detail panel. The Chrome docs give no default duration to follow, so these come from `motion-principles-and-tokens.md`.
- **Fix aspect-ratio stretching** of text: `width: fit-content` on both states, or `height: 100%` on `::view-transition-old/new`.
- **Clean up** temporary `view-transition-name`s in `transition.finished`.
- **Focus management is mandatory.** View transitions don't move focus. After `updateCallbackDone`/`finished`, focus the new view's heading (`tabindex="-1"`).
- **Cache inactive tab views** with `content-visibility: hidden` and `inert`, so returning is instant. web.dev: `content-visibility: hidden` "hides the element while preserving its rendering state", and Facebook measured "up to 250ms improvement in navigation times when going back to previously cached views". Cached views cost memory, so keep 3–5 and evict the least recently used beyond that (house numbers).
- **Interrupting:** "If a new view transition starts while one is already running, the old transition skips to the end" (Chrome docs). Calling `element.startViewTransition()` on a scope that already hosts one also skips the running one. For rapid tab clicks this is the desired behaviour; don't queue.

## Anti-patterns (don't)
- `startViewTransition(async () => { await fetch(...) })`: the UI freezes until the network responds. On a slow API this reads as a hang with no spinner.
- A full-page slide on every tab change: vestibular trigger, and the whole dashboard looks like it moved.
- Giving every card a name on a 50-card grid for a page navigation: the result is a busy snapshot soup, often with duplicate names, so the transition silently doesn't run.
- Document-level transitions while a sticky header or open popover must stay interactive.
- Morphing elements whose aspect ratio changes, without fixing stretch (text smears).
- No fallback branch for browsers without the API.

## Good references
- [Chrome for Developers, Same-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): duplicate names skip the transition; `view-transition-class`; `types`; "During this time, the page is frozen, so delays here should be kept to a minimum"; a new transition skips the running one; reduced motion "doesn't mean the user wants *no motion*" (a gentle fade is fine).
- [MDN, View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): pseudo-element tree (`::view-transition-group/image-pair/old/new`), `ready`/`updateCallbackDone`/`finished`, cross-document opt-in via `@view-transition { navigation: auto; }`.
- [Chrome for Developers, Element-scoped view transitions](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions) and [MDN, Element.startViewTransition()](https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition): Chrome 147+; scope roots are self-participating and get `contain: layout` during the transition; transitions on different scopes run simultaneously; MDN marks it experimental and shows the `if (!el.startViewTransition)` fallback. The right default for dashboards made of independent panels, once feature-detected.
- [web.dev, content-visibility](https://web.dev/articles/content-visibility): `content-visibility: hidden` keeps inactive SPA views' rendering state so they reappear fast.

## Bad references
- Route-level "page slide" demos that apply a 400–600 ms full-viewport horizontal slide to every navigation in an admin app. Spatial motion without spatial meaning, and repeated hundreds of times a day. NN/g's 500 ms ceiling and its frequency rule both argue against it ([NN/g](https://www.nngroup.com/articles/animation-duration/)).
- SPA routers that wrap the data loader inside the transition callback. The Chrome docs warn explicitly that this freezes the page.

## Accessibility
- Wrap custom VT animations so that under reduced motion they become `animation: none`. Alternatively call `transition.skipTransition()` when `matchMedia('(prefers-reduced-motion: reduce)').matches`. A 150 ms cross-fade is acceptable as the reduced variant (WCAG 2.3.3: opacity changes that don't alter size, shape or position are not "motion animation").
- Move focus to the new view's heading after the update. Keep focus on the tab itself for tab panels (ARIA tabs pattern).
- Don't rely on the morph to explain the relationship. Breadcrumbs or a heading must state it.

## Motion / interaction (if relevant)
- Direction: forward (drill-in) slides or morphs content toward the user (scale 0.98 → 1, translate 16 px); back reverses. Set it with `types` (house values for scale and distance).
- Fast-switching tabs: each click skips the previous transition. Effective duration falls to 0 under rapid input, which is correct.

## Tokens and values
| Token | Value |
|---|---|
| root cross-fade | `--motion-dur-short` 150 ms, `linear` |
| shared-element morph | `--motion-dur-medium` 240 ms, `--motion-ease-standard`; 400 ms (`--motion-dur-long`) for list → full detail |
| tab slide | `--motion-dur-medium` 240 ms, `--motion-ease-enter` |
| reduced motion | 150 ms fade, or `skipTransition()` |
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
  ::view-transition-group(*) { animation-duration: var(--motion-dur-medium); animation-timing-function: var(--motion-ease-standard); }
  ::view-transition-group(kpi-title) { animation-duration: var(--motion-dur-long); }
  :active-view-transition-type(tab-right)::view-transition-new(panel) { animation: var(--motion-dur-medium) var(--motion-ease-enter) both slide-from-right; }
}
@media (prefers-reduced-motion: reduce) {
  /* keep the UA cross-fade, drop the morph movement, shorten to 150 ms */
  ::view-transition-group(*) { animation-name: none; }
  ::view-transition-old(*), ::view-transition-new(*) { animation-duration: var(--motion-dur-short); }
}
@keyframes slide-from-right { from { translate: 16px 0; opacity: 0; } }
```
```ts
type Direction = 'tab-left' | 'tab-right';
// Element-scoped View Transitions are newer than the DOM lib types: declare the shape we use.
type ScopedVT = HTMLElement & {
  startViewTransition(opts: { update: () => void; types: string[] }): ViewTransition;
};
const canScope = (el: HTMLElement): el is ScopedVT => 'startViewTransition' in el;

export async function switchTab(panel: HTMLElement, load: () => Promise<DocumentFragment>, dir: Direction): Promise<void> {
  const content = await load();                         // 1. fetch OUTSIDE the transition
  const apply = (): void => { panel.replaceChildren(content); };
  if (!canScope(panel)) { apply(); return; }
  const vt = panel.startViewTransition({ update: apply, types: [dir] }); // 2. scoped
  vt.ready.catch(() => {});                             // a rapid re-click skips this one
  await vt.updateCallbackDone;
  panel.querySelector<HTMLElement>('h2')?.focus();      // 3. focus routing
}
```
`element.startViewTransition` ships only in Chrome/Edge 147+ (not Baseline). Feature-detect it, and fall back to `document.startViewTransition` (Baseline 2025) or an instant swap. `match-element` and `view-transition-class` are ignored by older browsers, so rows simply don't animate.

## Checklist
- [ ] No network or `await` on remote data inside the update callback.
- [ ] Scoped (`element.startViewTransition`) unless the whole page truly changes.
- [ ] 1–3 named shared elements; names unique; temporary names cleaned up.
- [ ] Durations use the tokens: fade 150 ms, tab slide and morph 240 ms, list → detail morph at most 400 ms.
- [ ] Focus moved to the new heading after the update.
- [ ] Reduced motion: skip, or fade only.
- [ ] Fallback path without the API works identically, minus the animation.

## Sources
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://www.nngroup.com/articles/animation-duration/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions
- https://developer.chrome.com/blog/element-scoped-view-transitions
- https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition
- https://web.dev/articles/content-visibility
- https://web.dev/articles/rail
