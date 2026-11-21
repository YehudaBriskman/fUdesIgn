# Reduced motion

> Design the static final state first and opt in to movement under `prefers-reduced-motion: no-preference`. Under `reduce`, remove spatial movement (translate, scale, rotate, parallax, zoom, morph) but keep colour and opacity feedback and slowed, essential activity indicators. Never use a global `0.01ms` override.

**Category:** Motion · **Applies to:** all animation: transitions, view transitions, chart tweens, number rolls, skeleton shimmer, spinners, auto-playing content · **Priority:** must

## When to use / when not
Always. Every animated component ships with an explicit reduced-motion variant. Pick a strategy per animation:
| Animation | Under `reduce` |
|---|---|
| Decorative entrance or parallax | remove entirely |
| Panel/drawer slide, view-transition morph | ≤ 150 ms cross-fade |
| Chart re-sort or morph | instant update + one non-motion highlight on changed marks |
| Number roll | instant swap |
| Skeleton shimmer | static skeleton, or slow opacity pulse ≥ 2 s |
| Spinner | keep, slowed (for example 6 s per turn); still signals activity |
| Hover/press colour | keep |
| Press scale, hover lift | remove |
| Auto-playing ticker or carousel | stopped by default, plus a pause control for everyone |

## Rules (do)
- **Static-first CSS:** declare animation inside `@media (prefers-reduced-motion: no-preference)` when reduced = none. Use `@media (prefers-reduced-motion: reduce)` only to **adjust** parameters (slower spinner, fade instead of slide). Nest the query inside the component rule so both variants sit together (modern-web-guidance motion.md).
- **No global kill switch** (`*, *::before { animation-duration: 0.01ms !important }`). The modern-web-guidance guide warns it can make some animations more jarring. It also breaks JS that waits for `animationend`.
- **"Reduced" ≠ "none"** (Chrome docs). Opacity and colour changes are not "motion animation" under WCAG 2.3.3, so a short fade remains a good way to show what changed.
- **JS-driven motion** (WAAPI, D3 transitions, canvas, number tweens) reads `matchMedia('(prefers-reduced-motion: reduce)')` and **listens for `change`**, so a toggle mid-session takes effect without reload.
- **View transitions:** `transition.skipTransition()` or override the pseudo-elements. Don't leave the default cross-fade unexamined if you customised it into a slide.
- **Keep the final state.** When motion is disabled, the element must end visible and in place. Code waiting on `transitionend`/`animationend` must continue if `element.getAnimations()` is empty, because those events never fire.
- **In-app override:** offer a "Reduce motion" setting (system / on / off) for users whose OS setting doesn't reflect their needs. Store it, apply it as `data-motion="reduce"` on `<html>`, and use it in the same selectors.
- **Pause for everything that auto-moves for more than 5 s** (WCAG 2.2.2), regardless of the preference. Live tickers, auto-rotating KPI carousels and animated backgrounds need a visible pause button.
- **No flashing** > 3 per second (WCAG 2.3.1), even inside `no-preference`.
- **Server hint (optional):** `Sec-CH-Prefers-Reduced-Motion` lets SSR skip shipping animation CSS/JS.

## Anti-patterns (don't)
- Treating reduced motion as "turn off all transitions", which also kills useful state colour changes and loading indicators.
- Spinners that stop rotating completely under reduce, so the page looks frozen.
- Shimmer skeletons that ignore the preference (the sweep is constant motion across the whole viewport).
- Parallax or scroll-linked hero effects in an app shell.
- Reading the preference once at startup and never again.
- `animation: none` overrides scattered in a separate file, far from the animation they cancel.

## Good references
- [web.dev, prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion): gate decorative animation behind `no-preference`; load animation CSS conditionally with `<link media="(prefers-reduced-motion: no-preference)">`; `matchMedia` with a `change` listener; `Sec-CH-Prefers-Reduced-Motion` client hint.
- [W3C Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): defines motion animation as changes in perceived size, shape or position. Colour, blur and opacity don't count. Technique C39 uses the media query.
- modern-web-guidance [motion](skills/modern-web-guidance/guides/ui-behaviors/motion.md): `no-preference` for opt-in versus `reduce` for parameter tweaks; never a global 0.01 ms; keep non-motion transitions; handle missing `animationend`.
- modern-web-guidance [spinner](skills/modern-web-guidance/guides/ui-components/spinner.md): under reduce, the spinner slows to 6 s per rotation and drops the dash animation rather than stopping, "so the user still knows that the process is active".
- [NumberFlow](https://number-flow.barvian.me/): `respectMotionPreference` is on by default, a good library default to look for.

## Bad references
- The widely copied "reset" snippet that sets `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` on `*`. Explicitly discouraged by modern-web-guidance motion.md. It removes motion bluntly, can produce abrupt jumps, and changes event timing.
- [NN/g](https://www.nngroup.com/articles/animation-duration/) lists parallax, auto-forwarding carousels and scroll-jacking as vestibular triggers. Dashboards that auto-rotate KPI carousels or parallax their headers are a bad pattern even before the preference is considered.

## Accessibility
This pattern *is* the accessibility control. In addition:
- Test with OS settings: macOS Reduce Motion, Windows "Animation effects" off, iOS/Android remove animations. Emulate in DevTools (Rendering → `prefers-reduced-motion`).
- Vestibular triggers to remove first: large-area translation, zoom/scale of the viewport or big panels, parallax, rotation, scroll-linked movement.

## Motion / interaction (if relevant)
- Direct manipulation (dragging a slider, panning a chart) is user-driven and essential, so it stays. Remove only the inertia/overshoot after release.

## Tokens and values
| Token | Default | Reduced |
|---|---|---|
| `--motion-scale` (multiplier) | 1 | 0 for spatial properties |
| `--dur-fade-reduced` | n/a | 120–150 ms |
| spinner period | 1–1.5 s | 6 s, no dash |
| skeleton | sweep 1.5 s | static or opacity pulse 2 s |
| press scale | 0.97 | 1 |
| view transition | morph 300 ms | fade 150 ms or skip |

## Implementation sketch
```css
.drawer {
  /* static, final state is the default */
  opacity: 1;
  transition: opacity 150ms linear;
  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 150ms linear, translate 240ms cubic-bezier(0, 0, 0.38, 0.9);
    @starting-style { translate: 24px 0; }
  }
  @starting-style { opacity: 0; }
}

/* In-app override mirrors the media query */
:root[data-motion="reduce"] .drawer { transition: opacity 150ms linear; }
```
```ts
type MotionPref = 'system' | 'reduce' | 'full';

export function createMotionPreference(getUserPref: () => MotionPref) {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new Set<(reduce: boolean) => void>();
  const compute = (): boolean => {
    const p = getUserPref();
    return p === 'reduce' || (p === 'system' && mq.matches);
  };
  const apply = (): void => {
    const reduce = compute();
    document.documentElement.dataset.motion = reduce ? 'reduce' : 'full';
    listeners.forEach((fn) => fn(reduce));
  };
  mq.addEventListener('change', apply);
  apply();
  return {
    reduce: compute,
    subscribe(fn: (reduce: boolean) => void): () => void { listeners.add(fn); return () => listeners.delete(fn); },
    refresh: apply,
  };
}

// Safe "wait for exit animation" that works when motion is off
export async function afterAnimations(el: Element): Promise<void> {
  await Promise.allSettled(el.getAnimations().map((a) => a.finished));
}
```

## Checklist
- [ ] Every animation has a documented reduced variant (remove, fade, or slow).
- [ ] Spatial motion lives inside `no-preference`, or is overridden case by case; no global 0.01 ms rule.
- [ ] JS animations read `matchMedia` and react to `change`.
- [ ] Spinners and progress still show activity under reduce.
- [ ] Final states are visible with motion off; no logic depends on `animationend` firing.
- [ ] Auto-moving content lasting > 5 s has a pause control.
- [ ] In-app motion setting (system/reduce/full) exists for long-session tools.

## Sources
- https://web.dev/articles/prefers-reduced-motion
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://www.nngroup.com/articles/animation-duration/
- https://number-flow.barvian.me/
- https://vercel.com/design/guidelines
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/motion.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-components/spinner.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-components/progress.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-behaviors/physics-based-easing.md
- modern-web-guidance: skills/modern-web-guidance/guides/accessibility/accessibility.md
