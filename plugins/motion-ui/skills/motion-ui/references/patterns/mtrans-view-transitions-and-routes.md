# Page and route transitions with View Transitions

> Use View Transitions for route changes: same-document `startViewTransition()` in SPAs and `@view-transition { navigation: auto; }` for multi-page sites, both as progressive enhancement. Keep the default 250 ms cross-fade or a 16–24 px directional shift, morph at most 1–3 named elements, set direction with transition types, and move focus after the swap.

**Category:** Transitions · **Applies to:** SPA route changes, multi-page (MPA) navigations, list → detail, tabs, step flows, back/forward · **Priority:** should

## When to use / when not
Use when the user navigates and something persists or relates across the two views (a header, a thumbnail that becomes a hero, a sibling page). Skip for unrelated destinations (a cross-fade or nothing is enough), for navigations triggered from the keyboard many times a minute, and for slow loads (a transition can't hide a 2 s wait; the page snapshot freezes until the new view is ready). dashboard-ui's `motion-view-transitions.md` covers data views (fetch first, element-scoped transitions, tab caching); this file covers general product routes and the cross-document case.

## Rules (do)
- **Know the support.**
  - Same-document (`document.startViewTransition`): Baseline newly available since October 2025 (Chrome 111, Firefox 144, Safari 18).
  - Cross-document (`@view-transition { navigation: auto; }`): not Baseline (Chrome 126, Safari 18.2; not in Firefox stable). Same-origin only; not for address-bar navigations, bookmarks or reloads. Chrome skips the transition if the new page takes more than 4 s.
  - `view-transition-class`: Baseline newly available since October 2025 (Chrome 125, Firefox 144, Safari 18.2). `types` and `:active-view-transition-type()`: Baseline newly available since January 2026 (Chrome 125, Firefox 147, Safari 18.2).
  - Everything degrades to a normal navigation.
- **Start from the default.** The UA stylesheet cross-fades the old and new snapshots over 0.25 s. That is right for most routes; only customise when there's a spatial relationship to show.
- **Directional by type, not by guesswork.** Pass `types: ['forward']` or `['back']` (SPA), or add types in `pageswap`/`pagereveal` (MPA) from the Navigation API's `navigation.activation`, and style `:active-view-transition-type(forward)`.
- **Small shifts.** Forward: the old view moves 16–24 px toward the leading edge and fades out, the new one comes 16–24 px from the trailing edge. Duration `--motion-dur-medium` 240 ms with `--motion-ease-standard`. No full-width slides on desktop.
- **Name 1–3 shared elements.** The element the user tapped (thumbnail → hero), and maybe the page title. Names must be unique at the moment of capture, or the whole transition is skipped. For lists, set the name only on the clicked item, or use `view-transition-name: match-element` (Chrome 137, Firefox 144, Safari 18.4) with a class.
- **Fix stretched text.** Shared elements whose aspect ratio changes distort; use `height: 100%` / `object-fit` on the old/new pseudo-elements, or `width: fit-content` on both states.
- **The app shell doesn't move.** Give persistent chrome (header, sidebar) its own `view-transition-name` with `animation: none`, so it stays crisp instead of cross-fading with the page.
- **Focus and announcements.** After the update, move focus to the new view's main heading (`tabindex="-1"`) and update `document.title`; View Transitions don't do either.
- **MPA specifics.** Put `@view-transition` in both pages' CSS. A `pagereveal` listener must be registered by a parser-blocking script or with `blocking="render"`, so it runs before the first render.
- **Fast navigation skips.** Starting a new transition while one runs skips the running one; don't queue.

## Anti-patterns (don't)
- Wrapping a slow fetch in `startViewTransition`, freezing the old page for seconds.
- A 400–600 ms full-width slide on every route.
- Naming every card in a grid at once (`view-transition-name` duplicates skip the transition).
- Letting the header and sidebar cross-fade with the content on every navigation.
- No focus management after an SPA transition.
- Shipping a JS router animation library when the platform transition would do.

## Good references
- [Chrome for Developers, same-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): `types`, `:active-view-transition-type()`, skip semantics.
- [Chrome for Developers, cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document): `@view-transition`, `pageswap`/`pagereveal`, same-origin and 4 s timeout.
- [CSS View Transitions spec](https://drafts.csswg.org/css-view-transitions-1/): default cross-fade and 0.25 s group duration in the UA stylesheet.
- [MDN, View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): `match-element`, `view-transition-class`.
- [Material 3, transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns): which relationship (container transform, shared axis, fade through) to show.
- [webstatus.dev, view transitions](https://webstatus.dev/features/view-transitions): Baseline status.

## Bad references
- Demo sites that slide every page in from the right for 500 ms, including "back": direction is wrong half the time and every navigation waits.
- Early SPA transition plugins that animated the whole document, including fixed headers, so the chrome flickered on each route.

## Accessibility
- Under reduced motion, keep only the root cross-fade (150 ms) or call `skipTransition()`; remove slides and morphs.
- Move focus to the new view and announce it; keep the back button and URL working (no transition may break history).
- The `::view-transition` overlay takes pointer input while it runs; keep transitions short so the page doesn't feel blocked.

## Motion / interaction (if relevant)
Directional shifts follow `mtrans-spatial-origin-and-continuity.md`; shared-element morphs use the container-transform timing (400 ms, emphasized) only for list → detail.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| root cross-fade | 250 ms UA default, or `--motion-dur-short` 150 ms `linear` | default routes |
| directional shift | 16–24 px, `--motion-dur-medium` 240 ms, `--motion-ease-standard` | forward/back |
| shared-element morph | `--motion-dur-medium` 240 ms, or `--motion-dur-long` 400 ms for list → detail | |
| named elements | 1–3 | per transition |
| reduced motion | 150 ms fade or skip | |

## Implementation sketch
```css
@view-transition { navigation: auto; }

.app-header { view-transition-name: app-header; }
::view-transition-group(app-header) { animation: none; }

@media (prefers-reduced-motion: no-preference) {
  html:active-view-transition-type(forward) {
    &::view-transition-old(root) { animation: 240ms var(--motion-ease-standard) both vt-out-start; }
    &::view-transition-new(root) { animation: 240ms var(--motion-ease-standard) both vt-in-end; }
  }
  html:active-view-transition-type(back) {
    &::view-transition-old(root) { animation: 240ms var(--motion-ease-standard) both vt-out-end; }
    &::view-transition-new(root) { animation: 240ms var(--motion-ease-standard) both vt-in-start; }
  }
}
@keyframes vt-out-start { to { opacity: 0; translate: -24px 0; } }
@keyframes vt-in-end { from { opacity: 0; translate: 24px 0; } }
@keyframes vt-out-end { to { opacity: 0; translate: 24px 0; } }
@keyframes vt-in-start { from { opacity: 0; translate: -24px 0; } }
```
```ts
type Direction = 'forward' | 'back';

export async function navigate(render: () => Promise<void> | void, direction: Direction): Promise<void> {
  const focusMain = () => document.querySelector<HTMLElement>('main h1')?.focus();
  if (!document.startViewTransition) {
    await render();
    focusMain();
    return;
  }
  const transition = document.startViewTransition({ update: render, types: [direction] });
  await transition.updateCallbackDone;
  focusMain();
}

// MPA: tag cross-document transitions with a direction before the first render of the new page.
// The Navigation API isn't in every TS DOM lib yet, so type the small part we read.
interface NavEntry { index: number }
interface NavigationLike { activation?: { from: NavEntry | null; entry: NavEntry } | null }
const nav = (globalThis as typeof globalThis & { navigation?: NavigationLike }).navigation;

addEventListener('pagereveal', (event: Event) => {
  if (!(event instanceof PageRevealEvent) || !event.viewTransition) return;
  const from = nav?.activation?.from?.index ?? -1;
  const to = nav?.activation?.entry.index ?? -1;
  event.viewTransition.types.add(to < from ? 'back' : 'forward');
});
```

## Checklist
- [ ] Transitions are progressive enhancement; navigation works without them.
- [ ] Data is ready before the transition starts.
- [ ] Root transition is the default cross-fade or a 16–24 px directional shift, ≤ 240 ms.
- [ ] Direction comes from transition types (forward/back), not a single slide for both.
- [ ] 1–3 named elements, all unique at capture; persistent chrome doesn't cross-fade.
- [ ] Focus moves to the new view; reduced motion gets a fade or no transition.

## Sources
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- https://drafts.csswg.org/css-view-transitions-1/
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/API/Window/pagereveal_event
- https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name
- https://webstatus.dev/features/view-transitions
- https://m3.material.io/styles/motion/transitions/transition-patterns
