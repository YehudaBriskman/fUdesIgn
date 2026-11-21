# Progressive loading: skeletons, streaming and staged reveal

> Choose the loading treatment by expected wait and scope. Under 1 s show nothing (delay indicators 200 ms). For first page loads of 1–10 s use a layout-accurate skeleton. For a single panel use an in-place spinner. Past 10 s use determinate progress with a cancel. Stream and reveal panels independently, in priority order, with reserved dimensions so nothing shifts.

**Category:** Progressive loading · **Applies to:** first load of dashboards, panel/widget loads, report generation, exports, long queries · **Priority:** must

## When to use / when not
Related: the five data states (loading/empty/error/partial) and their copy are covered in `data-loading-empty-error-states.md`; this file covers timing, skeleton fidelity and streaming order. Refreshing existing data: `prog-stale-while-revalidate.md`.

| Expected wait | Scope | Treatment |
|---|---|---|
| < 1 s | any | nothing; a 200 ms show-delay (Vercel: 150–300 ms) suppresses flicker |
| 1–10 s | full page / first visit | skeleton mirroring the final layout |
| 1–10 s | one panel or chart | in-panel labelled spinner (NN/g: spinners for a single module, 2–10 s) or a skeleton of that panel ("Loading revenue…") |
| > 10 s | any | determinate progress ("3 of 12 accounts" or %), time estimate, Cancel |
| unknown, could be long | job | job pattern: queue it, notify on completion, let the user leave |
| refresh of data already on screen | panel | keep old data with an "Updating…" indicator; no skeleton (see `prog-stale-while-revalidate.md`) |

Skeletons are for **first** loads of structured content. Not for uploads, exports or conversions (progress bar), and not for refreshes (they wipe valid data).

## Rules (do)
- **Show-delay and minimum display:** don't show any indicator until 200 ms have passed. Once shown, keep it 400 ms to avoid a flash. Vercel gives the ranges "~150–300 ms" and "~300–500 ms"; this skill fixes the midpoints so SKILL.md, this file and the sketch agree.
- **Skeletons match the real layout:** same grid, card sizes, line counts and chart frame (axes and baseline drawn, no fake data). Frame-display skeletons (header and footer only) "should not be used as a progress indicator" (NN/g).
- **Reserve space:** every panel has fixed or `aspect-ratio` dimensions before data arrives. Keep CLS ≤ 0.1 at p75 (Core Web Vitals "good"). Pair `content-visibility: auto` with `contain-intrinsic-size: auto <h>` on below-the-fold panels only; never above the fold, where it delays first render (Chrome guidance). `content-visibility` is Baseline newly available since September 2025; older browsers ignore it and render everything, which is a safe fallback.
- **Independent panels, independent loading:** each widget has its own loading/error/empty state. Never block the whole dashboard on the slowest query.
- **Priority order (staged reveal):** 1) shell and navigation; 2) filters and the primary KPI row; 3) the primary chart; 4) secondary panels; 5) below-the-fold content, deferred with `content-visibility: auto`. Stream above-the-fold first (React Suspense boundaries per panel; native out-of-order HTML streaming with `<template for>` ships only in Chrome/Edge 150+ (Baseline limited; Chrome guidance labels it "volatile"), so treat it as an opt-in enhancement).
- **Reveal without choreography:** content replaces its skeleton with a 150 ms (`--motion-dur-short`) opacity fade. No staggered slide-ins. If several panels resolve within 100 ms of each other (the NN/g "instantaneous" limit), reveal them together in one frame to avoid a popcorn effect.
- **Long waits (> 10 s):** percent-done or step count ("Updating account 3 of 50"), a padded time estimate ("This might take at least a minute"), and a Cancel button (NN/g). "Start the progressive animation slower and allow it to move faster as it approaches the end" rather than racing to 90% and stalling (NN/g).
- **Label the wait:** spinners get text ("Loading positions…"). Static text alone ("Please wait while we process your request") is not enough, because it doesn't show whether the system is alive (NN/g).
- **Timeouts and errors are part of the state machine:** loading → (success | empty | error with retry | partial). After 10 s without data (NN/g's attention limit), add a "Still loading… Retry / Cancel" message; after 15 s, treat it as an error with Retry and keep any cached data visible.
- **Skeleton motion is optional:** static grey blocks are fine. If animated, a slow sweep (1.5–2 s per pass), only under `prefers-reduced-motion: no-preference`.

## Anti-patterns (don't)
- A full-screen blocking spinner over the whole dashboard while one slow panel loads.
- Skeleton flashes on loads under 1 s (NN/g: under 1 s "skeleton screens or spinners aren't necessary"; the flash feels rushed).
- Skeletons whose shape differs from the final layout, which causes a layout shift on reveal (worse than no skeleton).
- Using a skeleton as a substitute for performance work (NN/g calls this out).
- Indeterminate spinners for 30 s+ queries with no cancel and no estimate.
- Staggered "cascade in" of 12 tiles over 1.5 s after the data is already available.
- Skeleton charts drawn with fake data lines that look like real values.

## Good references
- [NN/g, Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/): nothing under 1 s; spinners for 2–10 s and skeletons for waits under 10 s; progress bars "strongly recommended" past 10 s; skeletons for full-page loads, spinners for single modules; frame-display skeletons not recommended; skeletons "do not replace performance-optimization efforts".
- [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/): looped indicator 2–10 s, percent-done ≥ 10 s, label the wait, offer stop, buffered estimates. A cited University of Nebraska–Lincoln study found people shown an animated progress bar "were willing to wait on average 3 times longer" than those shown no indicator.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): "add a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)"; loading buttons "keep the original label".
- Chrome modern web guidance, [Out-of-order HTML streaming](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/out-of-order-html-streaming): stream above-the-fold first; for multi-panel dashboards put `aria-busy="true"` on loading panels and the live region **outside** them; no `role="alert"` for progress; focus stays put while content loads.
- Chrome modern web guidance, [Defer rendering heavy content](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/defer-rendering-heavy-content): `content-visibility: auto` must be paired with `contain-intrinsic-size` (else the element collapses to 0 px off-screen), below the fold only; verify keyboard reachability of off-screen panels.
- Grafana (product behaviour, observed rather than documented on the [settings page](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/)): every panel loads, errors and refreshes independently, with a per-panel loading bar instead of a page blocker.

## Bad references
- [Viget, A Bone to Pick with Skeleton Screens](https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/) ([archived copy](https://web.archive.org/web/20260608091534/https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens)): in a 136-person mobile test with GIF-simulated loaders of identical length, the skeleton "performed the worst by all metrics": mean perceived wait 2.82 s vs 2.41 s (spinner) and 2.29 s (blank), and 36% disagreed that it loaded quickly vs 10% for the spinner. Viget's own explanations are novelty, unfamiliar interfaces and very short waits, not skeleton fidelity. The evidence is mixed: Mejtoft, Långström and Söderström ([ECCE 2018, doi:10.1145/3232078.3232086](https://doi.org/10.1145/3232078.3232086)) found a skeleton news site rated faster than a spinner version. Lesson: skeletons are not a guaranteed win; use them for first loads of a familiar, layout-faithful view.
- "Loading…" full-page overlays in legacy BI tools (the classic Tableau Server and SSRS pattern): the whole view is blocked until every query completes, so one slow data source makes the entire dashboard unusable.

## Accessibility
- Loading containers: `aria-busy="true"` until complete. One polite live region **outside** busy containers announces "Loading dashboard" and then "Dashboard loaded" (not per panel, not `role="alert"`).
- Skeleton blocks are `aria-hidden="true"`. The panel has an accessible name ("Revenue chart, loading").
- Spinners use `<progress>` without `value` (implicitly indeterminate) and an `aria-label`. Determinate progress uses `value`/`max`.
- Focus never jumps to newly streamed content.
- Shimmer respects reduced motion (static blocks or a slow opacity pulse).

## Motion / interaction (if relevant)
- Skeleton → content: 150 ms (`--motion-dur-short`) opacity cross-fade, no movement.
- Indeterminate spinner: 1–1.5 s per rotation; under reduced motion slow it to one rotation per 6 s or replace it with a static icon plus text.
- Determinate bar: transition `inline-size` over 240 ms (`--motion-dur-medium`, `--motion-ease-standard`), so progress doesn't jump.

## Tokens and values
| Token | Value |
|---|---|
| indicator show-delay | 200 ms (range 150–300) |
| indicator minimum visible | 400 ms (range 300–500) |
| skeleton use window | first load, expected 1–10 s |
| percent-done threshold | > 10 s (lower it if variance is high) |
| reveal fade | 150 ms (`--motion-dur-short`), `linear` for opacity |
| coalescing window for simultaneous panels | 100 ms (`--motion-dur-micro`) |
| skeleton colour | `--surface-2` block, `--surface-3` sweep highlight (decorative, no contrast requirement) |
| skeleton sweep | 1.5–2 s, `linear`, reduced: none |
| panel still-loading notice / error with Retry | 10 s / 15 s |
| CLS budget | ≤ 0.1 at p75 (Core Web Vitals "good") |

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
.skeleton { background: var(--surface-2); border-radius: var(--radius-xs); }
@media (prefers-reduced-motion: no-preference) {
  .skeleton {
    background: linear-gradient(90deg, var(--surface-2) 0 40%, var(--surface-3) 50%, var(--surface-2) 60% 100%) 0 0 / 300% 100%;
    animation: sweep 1.6s linear infinite;
  }
}
@keyframes sweep { to { background-position: -150% 0; } }
.panel-body > :not(.skeleton) { animation: reveal var(--motion-dur-short) linear both; }
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
- [ ] No indicator appears for loads under 200 ms; once shown, an indicator stays ≥ 400 ms.
- [ ] First-load skeleton matches the final layout; no CLS on reveal (≤ 0.1).
- [ ] Each panel loads, errors and retries independently; no global blocker.
- [ ] Panels reveal in priority order; simultaneous ones are batched.
- [ ] Waits > 10 s show determinate progress, an estimate and Cancel.
- [ ] `aria-busy` on loading regions; one live region outside them; focus never moves.
- [ ] Shimmer runs only under `prefers-reduced-motion: no-preference`; skeleton blocks are `aria-hidden`.

## Sources
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://vercel.com/design/guidelines
- https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/ (live site rate-limits bots; verified via the archive.org snapshot of 2026-06-08)
- https://doi.org/10.1145/3232078.3232086
- https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a
- https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/out-of-order-html-streaming
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/defer-rendering-heavy-content
- https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/spinner
- https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/progress
- https://web.dev/articles/cls
