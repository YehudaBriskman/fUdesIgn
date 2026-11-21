# Perceived performance thresholds: 100 ms, 1 s, 10 s and INP

> Design every interaction against four budgets: visual acknowledgement < 100 ms (handler ≤ 50 ms), INP ≤ 200 ms at p75, result or clear progress < 1 s to keep flow, and anything over 10 s becomes a cancellable, estimated, background-able job. Measure them in the field, not only in the lab.

**Category:** Progressive loading / performance · **Applies to:** every click, key press, filter, sort, drill, save, export and report generation · **Priority:** must

## When to use / when not
Always. Use this table as the decision key for which feedback pattern to apply.

| Elapsed since input | User perception (Nielsen; RAIL) | Required UI response |
|---|---|---|
| 0–16 ms | per-frame smoothness (60 fps) | animation frames ≤ 10 ms of app work, 16 ms frame budget (RAIL) |
| ≤ 100 ms | "instantaneous"; direct manipulation | visible state change (pressed, selected, optimistic update) |
| 100 ms–1 s | flow uninterrupted, delay noticed | no spinner needed; an inline cue after the 200 ms show-delay is OK |
| 1–10 s | attention holds, flow breaks | skeleton (first load) or labelled spinner (one module; NN/g: 2–10 s); keep old data on refresh (SWR) |
| > 10 s | attention lost; users switch tasks or abandon | percent-done/steps, estimate, Cancel, run in background + notify |

## Rules (do)
- **Acknowledge in the next frame:** every click, tap or key press paints visible feedback within 100 ms. Keep the event handler to ≤ 50 ms (RAIL) and defer everything else (`requestAnimationFrame` → `setTimeout`, `scheduler.yield()`, `scheduler.postTask({ priority: 'background' })`).
- **Scheduler API support:** `scheduler.yield()` ships in Chrome/Edge 129+ and Firefox 142+, `scheduler.postTask()` in Chrome/Edge 94+ and Firefox 142+; neither is in Safari, so both are Baseline *limited availability* (MDN, webstatus.dev, checked Nov 2026). Always feature-detect and fall back to `setTimeout(resolve, 0)` (see the sketch).
- **INP budget:** good ≤ 200 ms, needs improvement > 200 ms and ≤ 500 ms, poor > 500 ms, at the 75th percentile of field page loads, segmented by mobile and desktop (web.dev). Only mouse clicks, touchscreen taps and key presses count; hover, scroll and zoom do not.
- **Diagnose by phase:** input delay (other work already running), processing (your handlers), presentation delay (style/layout/paint). Use `web-vitals/attribution`, which adds Long Animation Frames (LoAF) data, to find the script and to separate style recalculation from layout (Chrome, identify INP causes). LoAF is Chromium-only (Chrome 123+, Baseline limited), so attribution is richest in Chrome; Firefox and Safari still report the three phases where `web-vitals` supports INP.
- **Async results get their own metric:** INP covers only the next frame. Track interaction → contentful paint with `PerformanceObserver({ type: 'interaction-contentful-paint', buffered: true })` (WICG soft-navigations spec; Chrome/Edge 151+, Baseline limited), and fall back to custom `performance.mark`/`measure` for "filter applied → chart painted" everywhere else. The < 1 s p75 target for filter/sort/drill is this skill's budget, derived from NN/g's 1 s flow limit, not a published threshold.
- **Mutations:** "POST/PATCH/DELETE complete in <500ms" (Vercel). Hide even that with optimistic UI (see `prog-optimistic-ui-and-undo.md`).
- **Live filtering requires results < 1 s after each filter change**, otherwise batch with an Apply button (NN/g). **Dynamic queries (sliders, brushes) need redraws < 100 ms** ("rapid display update (less than 100 milliseconds) is the goal, even when there are tens of thousands of displayed items", Shneiderman 1996), otherwise update on release.
- **Long tasks:** nothing on the main thread > 50 ms during interaction windows. Chunk table renders, chart layouts and CSV parsing with a 50 ms deadline + `scheduler.yield()`.
- **Large DOM:** virtualise tables over ~500 rows and switch to canvas/WebGL past ~5 K chart marks (heuristics from practice, not sourced: profile your own data). Use `content-visibility: auto` paired with `contain-intrinsic-size: auto <h>` for below-the-fold panels only (Baseline newly available since September 2025; unsupported browsers simply render everything).
- **Indicators follow thresholds:** show-delay 200 ms (Vercel range 150–300 ms); once shown, keep them visible 400 ms (Vercel range 300–500 ms); switch to determinate progress past 10 s (or sooner if variance is high). These match SKILL.md's loading table and `prog-loading-states.md`.
- **Set budgets per interaction type** and enforce them in CI (Lighthouse or Playwright traces with 4× CPU slowdown, Lighthouse's mobile default) **and** in RUM (p75).

## Anti-patterns (don't)
- A synchronous 300 ms re-render of all panels on every filter click, with the pressed state painting only after it finishes. INP is poor and the click feels ignored.
- Spinners for 150 ms operations (flicker), or no feedback for 3 s operations (double submissions).
- "Please don't click again" text instead of instant acknowledgement (NN/g).
- Measuring only lab data on a fast developer laptop. INP is a field metric.
- Unbounded `useEffect` chains that recompute derived data on the main thread after every keystroke in a search box.
- Progress bars that race to 90% and stall.

## Good references
- [NN/g, Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/): 0.1 s feels instantaneous, 1 s keeps the flow of thought, 10 s keeps attention. Percent-done for > 10 s, with a way to interrupt. 2–10 s can use a busy indicator.
- [web.dev, RAIL](https://web.dev/articles/rail): 100 ms response with a 50 ms input-handling budget, 10 ms per animation frame (16 ms frame maximum), 50 ms idle chunks, and the perception bands (0–16 ms, 0–100, 100–1000, 1000+, 10000+). The page now calls Core Web Vitals "the recommended approach for defining performance goals over RAIL"; use RAIL for the bands, CWV for the thresholds.
- [web.dev, Interaction to Next Paint](https://web.dev/articles/inp): ≤ 200 ms good, > 500 ms poor at p75; the three phases (input delay, processing duration, presentation delay).
- Chrome modern web guidance, [Identify INP causes](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/identify-inp-causes) and [Interaction paint timing](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/interaction-paint-timing): field attribution via `web-vitals/attribution` + LoAF (`styleDuration` vs `layoutDuration`); `interaction-contentful-paint` closes the gap between the next frame and the async result paint.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): "POST/PATCH/DELETE complete in <500ms"; loading states get "a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)".
- [Square Crossfilter](https://square.github.io/crossfilter/): "extremely fast (<30ms) interaction with coordinated views, even with datasets containing a million or more records", via incremental indexing. Square no longer maintains it; the community fork at github.com/crossfilter/crossfilter is maintained.

## Bad references
- Dashboards that wrap every interaction in a full-page "Processing…" overlay. Even a 300 ms query becomes a visible block, which converts the 100 ms–1 s "flow" band into a 1–10 s-feeling interruption.
- NN/g's [Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) calls out static "Loading…" text and "don't click again" warnings as failures. Both are still common in enterprise report builders.

## Accessibility
- Fast acknowledgement helps everyone, but especially screen-reader and switch users, who can't see subtle spinners: pair visual feedback with `aria-busy` and one polite status message for waits > 1 s.
- For waits > 10 s, provide text progress ("Step 3 of 5: Fetching filings") and Cancel; don't time out user sessions during long jobs without warning (WCAG 2.2.1).
- Don't rely on motion to show progress under reduced motion (static progress values remain).

## Motion / interaction (if relevant)
- An animation never extends perceived latency: start it in the same frame as the input, and allow the result to interrupt it.
- Pressed state on `pointerdown`; result on completion; no artificial delay "to feel substantial".

## Tokens and values
| Budget | Value | Measured as |
|---|---|---|
| visual acknowledgement | < 100 ms | INP presentation of first frame |
| event handler | ≤ 50 ms | LoAF script duration |
| animation frame work | ≤ 10 ms | DevTools frames |
| INP | ≤ 200 ms p75 (poor > 500 ms) | web-vitals RUM |
| filter/sort/drill → chart painted | < 1 s p75 | custom mark or `interaction-contentful-paint` |
| dynamic query (slider/brush) redraw | < 100 ms | custom mark |
| mutation round trip | < 500 ms p75 | server + RUM |
| spinner show-delay / min visible | 200 ms / 400 ms | design rule |
| percent-done threshold | > 10 s | design rule |
| long task ceiling | 50 ms | Long Tasks / LoAF |

## Implementation sketch
```ts
// 1) Acknowledge first, then do the work off the critical path.
async function onFilterClick(btn: HTMLButtonElement, apply: () => Promise<void>): Promise<void> {
  btn.setAttribute('aria-pressed', 'true');        // paints in the next frame
  await yieldToMain();                              // let that frame paint before heavy work
  performance.mark('filter:start');
  await apply();                                    // chunked internally with yieldToMain()
  requestAnimationFrame(() => setTimeout(() => {
    performance.measure('filter→paint', 'filter:start');
  }));
}

function yieldToMain(): Promise<void> {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
}

// 2) Field INP with attribution.
import { onINP } from 'web-vitals/attribution';
onINP((m) => {
  navigator.sendBeacon('/rum', JSON.stringify({
    name: m.name, value: m.value, rating: m.rating,
    inputDelay: m.attribution.inputDelay,
    processing: m.attribution.processingDuration,
    presentation: m.attribution.presentationDelay,
    target: m.attribution.interactionTarget,
  }));
});
```

## Checklist
- [ ] Every click, tap and key press paints visible feedback < 100 ms; no handler runs > 50 ms (check LoAF or a DevTools trace).
- [ ] INP ≤ 200 ms p75 on mobile and desktop in RUM, with phase attribution captured.
- [ ] Filter/sort/drill → painted result < 1 s p75, measured with a custom mark or interaction-contentful-paint.
- [ ] No main-thread task > 50 ms during interaction windows.
- [ ] Feedback type matches the threshold table: none < 200 ms, subtle cue to 1 s, skeleton or labelled spinner 1–10 s, percent-done + Cancel > 10 s.
- [ ] `scheduler.*` and `interaction-contentful-paint` are feature-detected with a `setTimeout` / `performance.mark` fallback.
- [ ] Budgets enforced in CI under CPU throttling and in production monitoring.

## Sources
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/applying-filters/
- https://web.dev/articles/rail
- https://web.dev/articles/inp
- https://vercel.com/design/guidelines
- https://square.github.io/crossfilter/
- https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/identify-inp-causes
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/interaction-paint-timing
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/break-up-long-tasks
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/schedule-tasks-by-priority
- https://developer.chrome.com/docs/modern-web-guidance/guides/performance/defer-rendering-heavy-content
- https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield
- https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask
- https://webstatus.dev/features/interaction-contentful-paint
- https://webstatus.dev/features/long-animation-frames
