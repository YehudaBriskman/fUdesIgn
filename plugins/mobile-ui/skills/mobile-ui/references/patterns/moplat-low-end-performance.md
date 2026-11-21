# Performance on low-end phones

> Design and test for a mid-to-low-end Android phone on a slow 4G connection, not a flagship on Wi-Fi: hit LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile of real mobile users, and keep JavaScript small because CPU, not bandwidth, is the bottleneck.

**Category:** Platform · **Applies to:** every mobile page and app shell, images, fonts, JavaScript bundles, lists, animations · **Priority:** must

## When to use / when not
- **Use** from the first design review: performance budgets shape what you can design (hero video, carousels, heavy charts, client-side rendering).
- **Use** the field data (CrUX, RUM) as the judge; lab tests are for debugging.
- **Not** an excuse for skeletons everywhere. Fast first, then honest loading states (dashboard-ui `prog-perceived-performance-thresholds.md`).

## Rules (do)
- **Core Web Vitals at p75, mobile:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 ("good"). Poor is LCP > 4 s, INP > 500 ms, CLS > 0.25.
- **Reference device and network:** Lighthouse's mobile default simulates a 4× CPU slowdown, 150 ms RTT and about 1.6 Mbps down; test on a real mid-range Android (a Moto G or Galaxy A-series class phone) at least once per release.
- **Budget (starting point):** Alex Russell's yearly "performance inequality gap" analysis puts a 3-second-load budget for the median global phone at roughly 150 KiB of critical HTML, CSS, fonts and images and roughly 300–350 KiB of compressed JavaScript. Treat these as ceilings, not targets.
- **JavaScript is the most expensive byte:** it must be downloaded, parsed, compiled and run on a slow core. Ship HTML first (SSR or static), hydrate only interactive islands, split by route, and lazy-load below-the-fold widgets.
- **Images:** `width`/`height` attributes or `aspect-ratio` on every image (no CLS); `srcset`/`sizes` so a 390 px screen gets about 800 px images, not 2400 px; AVIF or WebP; `loading="lazy"` below the fold; `fetchpriority="high"` on the LCP image and never lazy-load it (modern-web-guidance `performance/optimize-image-priority.md`).
- **Fonts:** system fonts on mobile where the brand allows; otherwise at most 2 WOFF2 files, subset, `font-display: swap` with metric-matched fallbacks to avoid layout shift.
- **INP:** keep event handlers under about 50 ms; yield with `scheduler.yield()` (or `setTimeout` fallback) in long tasks; show the visual response first, then do the work (modern-web-guidance `performance/break-up-long-tasks.md`, `identify-inp-causes.md`).
- **Long lists:** `content-visibility: auto` with `contain-intrinsic-size` for off-screen rows, or virtualise above a few hundred rows.
- **Animation:** only `transform` and `opacity` on the compositor; no `filter: blur` or `backdrop-filter` on large, scrolling surfaces on low-end devices, or provide a solid fallback (`prefers-reduced-transparency`).
- **Respect data saver:** `Save-Data: on` header or `navigator.connection.saveData` (Chromium) → no autoplay video, lower image quality, no prefetch.
- **Back/forward cache:** keep pages bfcache-eligible (no `unload` handlers, no `Cache-Control: no-store` on HTML unless required) so back navigation is instant.

## Anti-patterns (don't)
- A 1–2 MB JavaScript bundle to render a mostly static page.
- An autoplaying hero video or carousel as the LCP element on mobile.
- Lazy-loading the LCP image.
- Web fonts with `font-display: block`, leaving text invisible for seconds.
- Blur-heavy glass effects over scrolling content on a low-end GPU.
- Testing only on the newest iPhone on office Wi-Fi.

## Good references
- [web.dev: Web Vitals](https://web.dev/articles/vitals): LCP, INP and CLS thresholds at p75.
- [Lighthouse: Throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md): the mobile defaults (150 ms RTT, 1,638.4 Kbps, 4× CPU).
- [Alex Russell: The Performance Inequality Gap](https://infrequently.org/series/performance-inequality/): yearly device and network baselines and the resulting byte budgets.
- [modern-web-guidance: Performance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/performance.md), [Break up long tasks](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/break-up-long-tasks.md) and [Optimize image priority](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/optimize-image-priority.md).
- [web.dev: content-visibility](https://web.dev/articles/content-visibility): rendering savings for long pages.
- [web.dev: Back/forward cache](https://web.dev/articles/bfcache): eligibility rules.

## Bad references
- [Alex Russell: The Market for Lemons](https://infrequently.org/2023/02/the-market-for-lemons/): case studies of JavaScript-heavy SPA stacks that shipped slow mobile experiences.
- Sites whose CrUX data shows "good" desktop vitals but "poor" mobile INP: the desktop-only test loop hides the problem.

## Accessibility
- Slow pages hurt users on cheaper devices and slow networks most; performance is an equity issue.
- Layout shifts move tap targets under the finger (mis-taps); CLS ≤ 0.1 is also a usability floor.
- Respect `prefers-reduced-motion` and `prefers-reduced-transparency`, which also reduce GPU work.

## Motion / interaction (if relevant)
- Response to a tap within 100 ms (pressed state), result or progress within 1 s. If a handler cannot finish quickly, paint the pressed state first, then yield.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| LCP (p75, mobile) | ≤ 2.5s | loading |
| INP (p75, mobile) | ≤ 200ms | responsiveness |
| CLS (p75) | ≤ 0.1 | stability |
| critical HTML/CSS/fonts/images | about 150 KiB compressed | first load budget |
| JavaScript | about 300–350 KiB compressed, ceiling | first load budget |
| handler time | ≤ 50ms before yielding | INP |
| lab profile | 4× CPU, 150ms RTT, 1.6 Mbps | Lighthouse mobile |

## Implementation sketch
```ts
// Yield to the main thread between chunks so taps stay responsive (INP).
type SchedulerLike = { yield?: () => Promise<void> }

export function yieldToMain(): Promise<void> {
  const s = (globalThis as typeof globalThis & { scheduler?: SchedulerLike }).scheduler
  if (s?.yield) return s.yield()
  return new Promise((resolve) => setTimeout(resolve, 0))
}

export async function processInChunks<T>(items: readonly T[], work: (item: T) => void, budgetMs = 40): Promise<void> {
  let start = performance.now()
  for (const item of items) {
    work(item)
    if (performance.now() - start > budgetMs) {
      await yieldToMain()
      start = performance.now()
    }
  }
}

export function prefersLightData(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return conn?.saveData === true
}
```
```css
.feed > article { content-visibility: auto; contain-intrinsic-size: auto 320px; }
.hero img { inline-size: 100%; block-size: auto; aspect-ratio: 4 / 3; object-fit: cover; }
@media (prefers-reduced-transparency: reduce) {
  .glass { backdrop-filter: none; background: var(--surface); }
}
```
```html
<img src="/hero-800.avif" srcset="/hero-400.avif 400w, /hero-800.avif 800w, /hero-1600.avif 1600w" sizes="100vw" width="800" height="600" alt="Trail at sunrise" fetchpriority="high">
<img src="/card.avif" width="320" height="240" alt="" loading="lazy" decoding="async">
```

## Checklist
- [ ] Field data (CrUX or RUM) for mobile shows LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75, or there is a plan.
- [ ] Lighthouse mobile run and one real mid-range Android test per release.
- [ ] JavaScript and critical-path bytes are within the budget, checked in CI.
- [ ] The LCP image is not lazy and has `fetchpriority="high"`; all images have dimensions.
- [ ] No handler blocks for more than about 50 ms without yielding.
- [ ] Long lists use `content-visibility` or virtualisation; pages are bfcache-eligible.

## Sources
- https://web.dev/articles/vitals
- https://web.dev/articles/inp
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- https://infrequently.org/series/performance-inequality/
- https://infrequently.org/2023/02/the-market-for-lemons/
- https://web.dev/articles/content-visibility
- https://web.dev/articles/bfcache
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Save-Data
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/performance.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/break-up-long-tasks.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/identify-inp-causes.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/optimize-image-priority.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/prog-perceived-performance-thresholds.md
- Note: the byte budgets are Russell's estimates, which change yearly; re-read the latest edition before quoting exact figures.
