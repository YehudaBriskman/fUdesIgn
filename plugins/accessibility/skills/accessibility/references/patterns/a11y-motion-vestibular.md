# Motion, flashing, timing and vestibular safety

> Anything that moves, blinks or scrolls by itself for more than 5 seconds can be paused, stopped or hidden (WCAG 2.2.2); nothing flashes more than three times a second (2.3.1); time limits can be turned off, adjusted or extended (2.2.1); and `prefers-reduced-motion: reduce` replaces spatial movement rather than deleting feedback, as motion-ui `mfound-reduced-motion-vestibular.md` specifies.

**Category:** Build · **Applies to:** carousels, auto-playing video and backgrounds, tickers, animated illustrations, parallax, page transitions, loaders, session timeouts, live dashboards · **Priority:** must

## When to use / when not
- **Use** as the compliance layer over motion. The design rules (durations, substitutions, vestibular triggers) are owned by:
  - motion-ui `mfound-reduced-motion-vestibular.md` (general product UI);
  - dashboard-ui `motion-reduced-motion.md` (data views);
  - marketing-ui `mkstyle-scroll-motion.md` (scroll-driven marketing effects).
- **Not** for essential motion that is the content (a video the user started, a progress indicator), which 2.2.2 exempts when it is essential.

## Rules (do)
- **Pause, Stop, Hide, 2.2.2 A:** moving, blinking or scrolling content that starts automatically, lasts more than 5 s and is shown alongside other content has a visible pause/stop/hide control. Auto-updating content (tickers, live feeds) can be paused or its update frequency controlled. The pause control is reachable before or next to the moving content, and is a real button with a name and `aria-pressed` or a changing label.
- **Three Flashes or Below Threshold, 2.3.1 A:** nothing flashes more than 3 times in any 1-second period, unless it is below the general and red flash thresholds. Safest rule: no flashing at all; never full-screen strobe or red flashes.
- **Animation from Interactions, 2.3.3 (AAA, adopted as a house rule):** motion triggered by interaction can be disabled; honour `prefers-reduced-motion` and, for apps, also offer an in-app setting.
- **Timing Adjustable, 2.2.1 A:** for each time limit the user can turn it off, adjust it to at least 10× the default, or extend it with a simple action after a warning of at least 20 s, repeatable at least 10 times. Exceptions: real-time events, essential limits, limits over 20 hours.
- **Auto-play:** video and background video don't auto-play with sound; audio that plays for more than 3 s has a pause/stop or volume control (1.4.2). Muted decorative video still needs a pause control if it runs over 5 s.
- **Reduced motion:** under `reduce`, replace slides, zooms, parallax, spring overshoot and scroll-linked movement with opacity or colour changes of 150 ms or less; keep feedback; never use a global `animation-duration: 0.01ms !important` override (it breaks `animationend` logic and removes feedback). motion-ui owns the details.
- **Vestibular triggers to avoid for everyone:** large-area movement out of sync with scrolling, background zoom, spinning, and motion that covers most of the viewport.

## Anti-patterns (don't)
- Hero carousels that rotate every 4 s with no pause button.
- Background videos and Lottie loops with no way to stop them.
- News tickers and live stock bars that can't be paused.
- Session timeouts that log out with no warning.
- A "reduced motion" mode that removes the loading spinner and toasts, leaving no feedback.
- Flashing "sale" banners.

## Good references
- [W3C — Understanding 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) — the 5-second rule, auto-updating content and where the control goes.
- [W3C — Understanding 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) — flash thresholds and the red-flash rule.
- [W3C WAI-ARIA APG — Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) — rotation control first, pause on focus and hover.
- [modern-web-guidance — Motion](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/motion.md) — reduced-motion queries and substitutions.

## Bad references
- Auto-advancing homepage sliders with tiny dot controls and no pause: a 2.2.2 failure and, with fast cross-fades, a vestibular trigger.
- Parallax storytelling pages that ignore `prefers-reduced-motion`.

## Accessibility
- Test with the OS reduced-motion setting on (macOS: Accessibility › Display › Reduce motion; Windows: Settings › Accessibility › Visual effects › Animation effects off; iOS and Android equivalents) and with a screen reader, which should not hear constantly changing content.

## Motion / interaction (if relevant)
- This file is the motion criteria. Durations and substitution tokens live in motion-ui `assets/motion-tokens.css`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Auto-motion limit without control | 5 s | 2.2.2 |
| Flash limit | ≤ 3 per second | 2.3.1 |
| Timeout warning | ≥ 20 s, extendable ≥ 10 times | 2.2.1 |
| Reduced-motion substitute | opacity/colour ≤ 150 ms | motion-ui |
| Auto-play audio | ≤ 3 s or a control | 1.4.2 |

## Implementation sketch
A pause control for auto-playing media and animation that also respects the OS preference on load.
```ts
export function wireAutoplayPause(button: HTMLButtonElement, media: HTMLMediaElement): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const setPaused = (paused: boolean): void => {
    if (paused) media.pause()
    else void media.play()
    button.setAttribute('aria-pressed', String(paused))
    button.textContent = paused ? 'Play background video' : 'Pause background video'
  }
  setPaused(reduce.matches)
  button.addEventListener('click', () => setPaused(!media.paused))
  reduce.addEventListener('change', (e) => { if (e.matches) setPaused(true) })
}
```
```css
@media (prefers-reduced-motion: reduce) {
  .carousel__track { scroll-behavior: auto; }
  .hero-parallax { transform: none; }
}
```

## Checklist
- [ ] Every auto-moving, blinking or auto-updating element over 5 s has a pause/stop/hide control.
- [ ] Nothing flashes more than 3 times per second.
- [ ] Time limits can be turned off, adjusted or extended after a warning.
- [ ] No auto-playing sound; muted auto-play can be paused.
- [ ] Reduced motion replaces spatial movement and keeps feedback (motion-ui checklist passed).

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html
- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/motion.md (Apache-2.0, linked, not copied)
