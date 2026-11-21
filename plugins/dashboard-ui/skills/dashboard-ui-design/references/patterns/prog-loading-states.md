# Progressive loading: skeletons, streaming and staged reveal

> Choose the loading treatment by expected wait and scope. Under 1 s show nothing (delay indicators ~200 ms). For first page loads of 1–10 s use a layout-accurate skeleton. For a single panel use an in-place spinner. Past 10 s use determinate progress with a cancel. Stream and reveal panels independently, in priority order, with reserved dimensions so nothing shifts.

**Category:** Progressive loading · **Applies to:** first load of dashboards, panel/widget loads, report generation, exports, long queries · **Priority:** must

## When to use / when not
Related: the five data states (loading/empty/error/partial) and their copy are covered in `data-loading-empty-error-states.md`; this file covers timing, skeleton fidelity and streaming order. Refreshing existing data: `prog-stale-while-revalidate.md`.

| Expected wait | Scope | Treatment |
|---|---|---|
| < 1 s | any | nothing; show-delay 150–300 ms suppresses flicker |
| 1–10 s | full page / first visit | skeleton mirroring the final layout |
| 1–10 s | one panel or chart | in-panel spinner or skeleton of that panel, with a label ("Loading revenue…") |
| > 10 s | any | determinate progress ("3 of 12 accounts" or %), time estimate, Cancel |
| unknown, could be long | job | job pattern: queue it, notify on completion, let the user leave |
| refresh of data already on screen | panel | keep old data with an "Updating…" indicator; no skeleton (see `prog-stale-while-revalidate.md`) |

Skeletons are for **first** loads of structured content. Not for uploads, exports or conversions (progress bar), and not for refreshes (they wipe valid data).

## Rules (do)
- **Show-delay and minimum display:** don't show any indicator until 150–300 ms have passed. Once shown, keep it ≥ 300–500 ms to avoid a flash (Vercel).
- **Skeletons match the real layout:** same grid, card sizes, line counts and chart frame (axes and baseline drawn, no fake data). Frame-only skeletons (header and footer only) are not recommended (NN/g).
- **Reserve space:** every panel has fixed or `aspect-ratio` dimensions before data arrives. CLS from late panels ≤ 0.1. Use `contain-intrinsic-size` for deferred below-the-fold panels.
- **Independent panels, independent loading:** each widget has its own loading/error/empty state. Never block the whole dashboard on the slowest query.
- **Priority order (staged reveal):** 1) shell and navigation; 2) filters and the primary KPI row; 3) the primary chart; 4) secondary panels; 5) below-the-fold content, deferred with `content-visibility: auto`. Stream above-the-fold first (out-of-order streaming, React Suspense boundaries per panel).
- **Reveal without choreography:** content replaces its skeleton with a ≤ 150 ms opacity fade. No staggered slide-ins. If several panels resolve within ~100 ms of each other, reveal them together (batch with a short coalescing window) to avoid a popcorn effect.
- **Long waits (> 10 s):** percent-done or step count ("Updating account 3 of 50"), a buffered time estimate, a Cancel button. Progress should start slower and speed up near the end rather than race and stall (NN/g).
- **Label the wait:** spinners get text ("Loading positions…"). Static "Loading…" text alone is not enough, because it doesn't show whether the system is alive.
- **Timeouts and errors are part of the state machine:** loading → (success | empty | error with retry | partial). After about 10 s without data, swap to a message with Retry and keep any cached data visible.
- **Skeleton motion is optional:** static grey blocks are fine. If animated, a slow sweep (≥ 1.5 s), honouring reduced motion.

## Anti-patterns (don't)
- A full-screen blocking spinner over the whole dashboard while one slow panel loads.
- Skeleton flashes on loads under 1 s (NN/g: the flashing feels rushed).
- Skeletons whose shape differs from the final layout, which causes a layout shift on reveal (worse than no skeleton).
- Using a skeleton as a substitute for performance work (NN/g calls this out).
- Indeterminate spinners for 30 s+ queries with no cancel and no estimate.
- Staggered "cascade in" of 12 tiles over 1.5 s after the data is already available.
- Skeleton charts drawn with fake data lines that look like real values.

## Good references
- [NN/g, Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/): nothing under 1 s; skeleton or spinner for 2–10 s; progress bar > 10 s; skeletons for full-page loads, spinners for single modules; frame-display skeletons not recommended; skeletons don't replace optimisation.
- [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/): looped indicator 2–10 s, percent-done ≥ 10 s, label the wait, offer stop, buffered estimates. A cited study found users waited about 3× longer with an animated progress bar than with none.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): spinner show-delay ~150–300 ms and minimum visible time ~300–500 ms; loading buttons keep their label.
- modern-web-guidance [out-of-order-html-streaming](skills/modern-web-guidance/guides/performance/out-of-order-html-streaming.md): stream above-the-fold first; placeholders with stable dimensions; for multi-panel dashboards use `aria-busy="true"` on loading panels plus a single live region **outside** them; never move focus as content arrives.
- modern-web-guidance [defer-rendering-heavy-content](skills/modern-web-guidance/guides/performance/defer-rendering-heavy-content.md): `content-visibility: auto` + `contain-intrinsic-size: auto <h>` for below-the-fold panels, never above the fold.
- [Grafana](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/): every panel loads, errors and refreshes independently, with a per-panel loading bar instead of a page blocker.

## Bad references
- [Viget, A Bone to Pick with Skeleton Screens](https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/): in their 136-person test, the skeleton condition performed worst on perceived speed, the opposite of the received wisdom. The likely cause is generic, mismatched skeletons. Lesson: a skeleton is only better when it is faithful to the layout and the wait is long enough. The evidence is mixed; Mejtoft et al. 2018 found the opposite ([uxdesign.cc summary](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)).
- "Loading…" full-page overlays in legacy BI tools (the classic Tableau Server and SSRS pattern): the whole view is blocked until every query completes, so one slow data source makes the entire dashboard unusable.

## Accessibility
- Loading containers: `aria-busy="true"` until complete. One polite live region **outside** busy containers announces "Loading dashboard" and then "Dashboard loaded" (not per panel, not `role="alert"`).
- Skeleton blocks are `aria-hidden="true"`. The panel has an accessible name ("Revenue chart, loading").
- Spinners use `<progress>` without `value` (implicitly indeterminate) and an `aria-label`. Determinate progress uses `value`/`max`.
- Focus never jumps to newly streamed content.
- Shimmer respects reduced motion (static blocks or a slow opacity pulse).

## Motion / interaction (if relevant)
- Skeleton → content: 120–150 ms opacity cross-fade, no movement.
- Indeterminate spinner: 1–1.5 s per rotation; 6 s under reduce.
- Determinate bar: transition `inline-size` 300 ms, so progress doesn't jump.

## Tokens and values
| Token | Value |
|---|---|
| indicator show-delay | 200 ms (range 150–300) |
| indicator minimum visible | 400 ms (range 300–500) |
| skeleton use window | first load, expected 1–10 s |
| percent-done threshold | > 10 s (lower it if variance is high) |
| reveal fade | 150 ms `linear` |
| coalescing window for simultaneous panels | 100 ms |
| skeleton colour | `--color-surface-subtle` (≈ 1.1–1.3:1 against surface; decorative) |
| skeleton sweep | 1.5–2 s, `linear`, reduced: none |
| panel timeout → error with Retry | 10–15 s |
| CLS budget | ≤ 0.1 |

## Implementation sketch
```html
<section class="panel" aria-labelledby="rev-h" aria-busy="true">
  <h2 id="rev-h">Revenue</h2>
  <div class="panel-body" style="aspect-ratio: 16 / 7">
    <div class="skeleton skeleton-chart" aria-hidden="true"></div>
  </div>
</section>
<p class="visually-hidden" role="status" id="dash-status"></p>
```
```css
.skeleton { background: var(--color-surface-subtle); border-radius: 4px; }
@media (prefers-reduced-motion: no-preference) {
  .skeleton {
    background: linear-gradient(90deg, var(--color-surface-subtle) 0 40%, var(--color-surface-raised) 50%, var(--color-surface-subtle) 60% 100%) 0 0 / 300% 100%;
    animation: sweep 1.6s linear infinite;
  }
}
@keyframes sweep { to { background-position: -150% 0; } }
.panel-body > :not(.skeleton) { animation: reveal 150ms linear both; }
@keyframes reveal { from { opacity: 0; } }
.below-fold { content-visibility: auto; contain-intrinsic-size: auto 480px; }
```
```ts
// Show-delay + minimum-visible wrapper for any async load
export async function withLoadingIndicator<T>(
  work: Promise<T>,
  show: () => void,
  hide: () => void,
  { delayMs = 200, minVisibleMs = 400 }: { delayMs?: number; minVisibleMs?: number } = {},
): Promise<T> {
  let shownAt: number | null = null;
  const timer = setTimeout(() => { shownAt = performance.now(); show(); }, delayMs);
  try {
    return await work;
  } finally {
    clearTimeout(timer);
    if (shownAt !== null) {
      const remaining = minVisibleMs - (performance.now() - shownAt);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      hide();
    }
  }
}
```

## Checklist
- [ ] No indicator flashes for loads under ~200 ms; shown indicators stay ≥ 300 ms.
- [ ] First-load skeleton matches the final layout; no CLS on reveal (≤ 0.1).
- [ ] Each panel loads, errors and retries independently; no global blocker.
- [ ] Panels reveal in priority order; simultaneous ones are batched.
- [ ] Waits > 10 s show determinate progress, an estimate and Cancel.
- [ ] `aria-busy` on loading regions; one live region outside them; focus never moves.
- [ ] Shimmer obeys reduced motion.

## Sources
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://vercel.com/design/guidelines
- https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/ (via search summary; page rate-limited)
- https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a
- https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/
- modern-web-guidance: skills/modern-web-guidance/guides/performance/out-of-order-html-streaming.md
- modern-web-guidance: skills/modern-web-guidance/guides/performance/defer-rendering-heavy-content.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-components/spinner.md
- modern-web-guidance: skills/modern-web-guidance/guides/ui-components/progress.md
