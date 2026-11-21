# Motion review rubric and frame-capture recipe

> Review motion from evidence, not memory: capture every animated interaction as frames (slowed 4× to 10×, full and reduced motion), run the in-page audit, then score the 18 checks below 0–2 each. Ship at 80% or more with no must-check at 0, and report each finding as check ID, evidence (frame, selector or value) and fix.

**Category:** Review · **Applies to:** design and code review of any animated UI: PR reviews, audits, pre-release checks, agent self-review · **Priority:** must

## When to use / when not
Use before calling motion work done and when asked to critique an existing interface's motion. Start flagged by default and let each animation earn a pass (Emil Kowalski's review stance). Use dashboard-ui's `ref-design-review-rubric.md` for the rest of a data UI; this rubric only covers motion and gesture.

## Rules (do)
- **Evidence first.** For each interaction (open/close each overlay, each route, each gesture, each toggle), capture:
  1. a frame strip at 4× slow-down (every 40–80 ms of real time), full motion;
  2. the same with `prefers-reduced-motion: reduce`;
  3. the in-page audit output (running animations, their properties, durations, easings, transform-origins);
  4. a Performance trace for the heaviest interaction with 4× CPU throttling.
- **Fresh eyes.** Where possible, the reviewer sees only the frames, the audit output and this rubric, not the builder's reasoning; every finding must quote a frame or a value.
- **Score each check** 2 = meets, 1 = partly (some instances fail, or minor), 0 = fails or missing. Must-checks are marked **M**.

  | ID | Check | How to test | Pattern |
  |---|---|---|---|
  | MO1 **M** | Every animation has a job (feedback, continuity, orientation, attention; delight only if rare) | List animations from the audit; name each job | `mfound-purpose-and-frequency.md` |
  | MO2 **M** | Keyboard-triggered and 100+/day actions don't animate | Trigger by shortcut; frames show the final state in frame 1 | `mfound-purpose-and-frequency.md` |
  | MO3 **M** | First visual response ≤ 100 ms after input | Frame strip: change visible within the first 1–2 real-time frames | `mperf-compositor-will-change-and-inp.md` |
  | MO4 | Durations from tokens; UI chrome ≤ 400 ms | Audit `duration` values | `mfound-durations-and-easing.md` |
  | MO5 **M** | No `ease-in` on entrances; enters ease out | Audit `easing` per animation | `mfound-durations-and-easing.md` |
  | MO6 | Exits are shorter than enters (≈ 0.75×) | Compare enter/exit durations | `mfound-durations-and-easing.md` |
  | MO7 **M** | Nothing scales from 0; entry scale 0.95–0.97 | Audit keyframes/`@starting-style`; first frame | `mtrans-enter-exit-top-layer.md` |
  | MO8 | Popovers grow from their trigger; exits mirror entrances | Frames: origin at trigger side | `mtrans-spatial-origin-and-continuity.md` |
  | MO9 **M** | Interruptible: reversing mid-way continues from the current state; no queue; no input blocked | Click open/close at 50% of the animation; frames show no jump | `mgesture-interruptibility-and-velocity.md` |
  | MO10 **M** | Drag tracks 1:1 with the grab offset; no transition during drag | Frames during a slow drag: pointer and element stay locked | `mgesture-direct-manipulation-drag.md` |
  | MO11 | Release uses projection and velocity; bounce only after a flick | Flick vs slow drag to the same point give different, sensible results | `mgesture-momentum-projection-and-snap.md` |
  | MO12 | Edges rubber-band; no hard stops | Drag past each limit | `mgesture-rubber-banding-and-bounds.md` |
  | MO13 | Springs as duration + bounce from tokens; bounce 0 on chrome | Read transition configs | `mspring-parameters-and-mapping.md` |
  | MO14 **M** | Only transform/opacity animate on large elements; no `transition: all` | Audit animated properties; grep CSS | `mperf-compositor-will-change-and-inp.md` |
  | MO15 | No dropped frames in the heaviest interaction at 4× throttling | Performance panel: no long frames during the animation | `mperf-compositor-will-change-and-inp.md` |
  | MO16 **M** | Reduced motion replaces spatial movement with fades; nothing is stuck hidden; drag still tracks | Reduced-motion frame strip | `mfound-reduced-motion-vestibular.md` |
  | MO17 **M** | No vestibular triggers: parallax, scroll-jacking, full-viewport zoom, looping motion; autoplay > 5 s has pause | Scroll and idle the page; look for movement not caused by input | `mfound-reduced-motion-vestibular.md` |
  | MO18 | Related elements share timing; stagger ≤ 300 ms total; no replay on revisit | Frames of list/dialog entry; navigate away and back | `mfound-choreography-and-stagger.md` |

- **Pass mark.** (sum / (2 × applicable checks)) ≥ 80%, and no **M** check at 0. Mark checks that don't apply (no gestures) as N/A, not 2.
- **Report format.** One line per finding: `MO9 · frame 06 · .menu reverses from scale 0.96 (jump) · use a transition instead of @keyframes`. Order by severity: M-checks at 0, then other 0s, then 1s.
- **Record what wasn't checked** (no touch device, no Safari, gesture not captured). A missing check is not a pass.

## Anti-patterns (don't)
- Reviewing motion from static screenshots or from reading code alone.
- Watching at full speed only; most defects (jumps, wrong origin, scale from 0) are only visible slowed down or frame by frame.
- Passing reduced motion because a media query exists, without capturing it.
- Scoring N/A checks as passes to raise the percentage.
- "Feels smooth" as evidence.

## Good references
- [Emil Kowalski, skills: review-animations](https://github.com/emilkowalski/skills): flag by default, approval is earned; escalation triggers such as `transition: all`, `scale(0)`, `ease-in`, animation on a keyboard shortcut.
- [Benji Taylor, Stageshow](https://github.com/benjitaylor/skills): filming interactions frame by frame and gating on "never intentional" findings; a fresh-eye reviewer that sees only frames.
- [Chrome DevTools, Animations panel](https://developer.chrome.com/docs/devtools/css/animations): replay, scrub and slow down animation groups; inspect timing and View Transition pseudo-elements.
- [Playwright, emulate media](https://playwright.dev/docs/api/class-page#page-emulate-media): `reducedMotion: 'reduce'`.
- [Chrome DevTools Protocol, Animation domain](https://chromedevtools.github.io/devtools-protocol/tot/Animation/): `setPlaybackRate`, `seekAnimations`, `setPaused` for deterministic frame capture.
- [MDN, `Document.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations): every running CSS animation, transition and WAAPI animation with its timing.

## Bad references
- Design reviews that sign off motion from a Figma prototype only: the shipped code's easing, origin and interruption behaviour are never seen.
- Lighthouse-only performance sign-off: it doesn't exercise interactions, so animation jank and INP problems go unseen.

## Accessibility
MO16 and MO17 are accessibility checks and are must-checks. Also confirm focus moves correctly in every captured transition (dialogs, routes).

## Motion / interaction (if relevant)
Capture each interaction twice: once normally and once interrupted half-way (MO9).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| slow-down | 4× (playback rate 0.25), 10× for springs | frame capture |
| frame interval | 40–80 ms real time | strip spacing |
| CPU throttle | 4× | MO15 |
| pass mark | ≥ 80%, no M-check at 0 | ship gate |
| checks | 18 (10 must) | |

## Implementation sketch
In-page audit, run in the page (DevTools console, or Playwright's `page.evaluate`) while or right after an interaction:
```ts
export interface AnimationFinding { target: string; property: string; durationMs: number; easing: string; origin: string; issues: string[] }

const SAFE = new Set(['transform', 'translate', 'scale', 'rotate', 'opacity', 'display', 'overlay', 'color', 'background-color']);

function describe(el: Element | null): string {
  if (!el) return '(none)';
  const id = el.id ? `#${el.id}` : '';
  const cls = el.classList.length ? `.${[...el.classList].join('.')}` : '';
  return `${el.tagName.toLowerCase()}${id}${cls}`;
}

export function auditAnimations(): AnimationFinding[] {
  return document.getAnimations().map((a) => {
    const effect = a.effect instanceof KeyframeEffect ? a.effect : null;
    const timing = effect?.getComputedTiming();
    const target = effect?.target ?? null;
    const property = a instanceof CSSTransition ? a.transitionProperty : effect?.getKeyframes().flatMap((k) => Object.keys(k)).filter((k) => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)).join(',') ?? '';
    const durationMs = typeof timing?.duration === 'number' ? timing.duration : 0;
    const easing = effect?.getTiming().easing ?? '';
    const origin = target ? getComputedStyle(target).transformOrigin : '';
    const issues: string[] = [];
    if (property === 'all') issues.push('MO14 transition: all');
    for (const p of property.split(',')) if (p && !SAFE.has(p)) issues.push(`MO14 animates ${p}`);
    if (durationMs > 400) issues.push(`MO4 ${durationMs}ms > 400ms`);
    if (/^ease-in$|cubic-bezier\(0\.4, 0, 1, 1\)/.test(easing)) issues.push('MO5 ease-in');
    const frames = effect?.getKeyframes() ?? [];
    if (frames.some((k) => /scale\(0\)|^0$/.test(String(k.scale ?? k.transform ?? '')))) issues.push('MO7 scale from 0');
    return { target: describe(target), property, durationMs, easing, origin, issues };
  });
}
```
Frame capture with Playwright and the DevTools Protocol (plain JS, Chromium):
```js
// node capture.mjs <url> <selector-to-click>
import { chromium } from 'playwright';

const [url, selector] = process.argv.slice(2);
const browser = await chromium.launch();
for (const reducedMotion of ['no-preference', 'reduce']) {
  const page = await browser.newPage({ reducedMotion, viewport: { width: 1280, height: 800 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Animation.enable');
  await page.goto(url);
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.25 }); // 4× slower
  await page.click(selector);
  for (let i = 0; i < 16; i++) {
    await page.screenshot({ path: `frames/${reducedMotion}-${String(i).padStart(2, '0')}.png` });
    await page.waitForTimeout(80); // 80 ms wall clock = 20 ms of animation time at 0.25×
  }
  await page.close();
}
await browser.close();
```
Then lay the frames out as a contact sheet (any image tool) and score against the table.

## Checklist
- [ ] Frame strips captured for every interaction, full and reduced motion, plus one interrupted run.
- [ ] In-page audit run; every flagged issue resolved or justified.
- [ ] All 18 checks scored with evidence; N/A marked, not counted.
- [ ] Score ≥ 80% and no must-check at 0.
- [ ] Findings reported as ID · evidence · fix, ordered by severity.
- [ ] "Not checked" list included.

## Sources
- https://github.com/emilkowalski/skills
- https://github.com/benjitaylor/skills
- https://benji.org/stageshow
- https://developer.chrome.com/docs/devtools/css/animations
- https://chromedevtools.github.io/devtools-protocol/tot/Animation/
- https://playwright.dev/docs/api/class-page#page-emulate-media
- https://playwright.dev/docs/api/class-cdpsession
- https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations
- https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/getKeyframes
- https://web.dev/articles/inp
