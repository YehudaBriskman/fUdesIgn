# Reduced motion and vestibular safety

> Treat `prefers-reduced-motion: reduce` as "replace, don't delete": swap every spatial effect (slide, zoom, parallax, spring overshoot, scroll-linked movement, large morphs) for an opacity or colour change of 150 ms or less, keep feedback, and design out the known vestibular triggers for everyone, whatever the setting.

**Category:** Motion foundations · **Applies to:** every animation, gesture follow-through, view and route transitions, scroll-driven effects, background video, auto-advancing content · **Priority:** must

## When to use / when not
Always. dashboard-ui's `motion-reduced-motion.md` covers the mechanics (static-first CSS, no global `0.01ms` kill switch, JS listeners, the in-app setting). This file adds the product-UI substitution table, the vestibular triggers to avoid for all users, and what gestures do under reduced motion.

## Rules (do)
- **Substitute, per effect.**

  | Full motion | Under `reduce` |
  |---|---|
  | Slide or translate in/out | Fade, 150 ms, no travel |
  | Scale from 0.95 (popover, dialog) | Fade only |
  | Shared-element morph / View Transition | Cross-fade 150 ms, or skip the transition |
  | Spring with bounce | Spring with bounce 0, or a 150 ms tween |
  | Parallax, scroll-linked movement | None; content static |
  | Zoom into a card to open it | Cross-fade |
  | Auto-advancing carousel | Off; manual controls |
  | Animated background, looping video | Poster frame; play on request |
  | Gesture follow-through (fling, snap) | Still tracks the finger 1:1; the settle after release is short and has no overshoot |

- **Direct manipulation still tracks.** A dragged sheet follows the finger under reduced motion; that is the user's own movement, not an animation. Only the system-driven part after release gets shorter and loses bounce.
- **Avoid vestibular triggers for everyone:**
  - large objects travelling a long way across the viewport (more than about a third of it);
  - motion in a different direction or speed from scrolling (parallax, scroll-jacking);
  - full-viewport zoom or rotation;
  - slow, looping oscillation (bobbing, breathing, wobbling backgrounds);
  - sudden full-screen brightness changes (theme switch without a short fade);
  - spinning or swirling patterns.
- **Keep motion small by default.** In-place entrances travel ≤ 24 px; scale starts at 0.95–0.97. Small motion rarely needs a reduced variant beyond dropping the travel.
- **Honour the companions.** `prefers-reduced-transparency` swaps blur and translucency for solid surfaces (Chromium only, so treat it as an enhancement and keep translucent surfaces legible without it); `prefers-contrast: more` adds solid outlines. Apple's Liquid Glass guidance asks for the same three checks: reduce motion, reduce transparency, increase contrast.
- **Offer an in-app control** for anything that autoplays, and a site-level "Reduce motion: system / on / off" setting (see dashboard-ui's `motion-reduced-motion.md`).
- **Pause, stop, hide.** Anything that moves by itself for more than 5 s alongside other content needs a control (WCAG 2.2.2, Level A). No more than 3 flashes per second (WCAG 2.3.1).
- **Test with the setting on**, not just in code: Playwright `reducedMotion: 'reduce'`, DevTools rendering emulation, and the OS setting on one real phone.

## Anti-patterns (don't)
- `* { animation: none !important; transition: none !important }`: kills helpful fades and leaves JS-driven motion untouched.
- Removing the drag follow under reduced motion, so the sheet jumps instead of tracking.
- Parallax hero sections in an app's signed-in screens.
- A full-screen zoom transition from a grid tile into a detail page with no reduced alternative.
- Theme toggles that hard-cut the whole screen from white to black.
- Reduced motion handled only in CSS while a JS library (Motion, GSAP, Lottie) keeps animating.

## Good references
- [web.dev, prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion): opt in to motion, the reduced variant is still allowed to animate opacity.
- [W3C technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39): using the reduced-motion query to prevent motion from interactions.
- [WCAG 2.3.3 Animation from Interactions (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): motion triggered by interaction can be disabled unless essential; vestibular disorders as the reason.
- [Val Head, Designing safer web animation for motion sensitivity (A List Apart)](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/): the trigger list (scaling and zooming, spinning, parallax, multi-speed motion, large movement).
- [Apple HIG, motion](https://developer.apple.com/design/human-interface-guidelines/motion) and [accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): replace sliding and zooming with dissolves when Reduce Motion is on.
- [Motion, `useReducedMotion` and `MotionConfig reducedMotion="user"`](https://motion.dev/docs/react-accessibility): turns off transform and layout animations while keeping opacity and colour.

## Bad references
- The iOS 7 launch (2013): the new parallax wallpaper and zooming app launches made some users motion sick, and Apple added the Reduce Motion setting soon after (widely reported at the time; see Val Head's article above).
- Scroll-jacked marketing pages that move content at a different speed from the scroll; the movement the user didn't initiate is the trigger.

## Accessibility
This whole file is accessibility. The test: with reduced motion on, every state change is still visible (opacity, colour, text) and nothing travels further than a few pixels.

## Motion / interaction (if relevant)
Gestures keep 1:1 tracking. Springs used after a gesture lose their bounce and settle quickly (Motion: `bounce: 0`, `visualDuration` ≤ 0.2 s).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| reduced fade | `--motion-dur-short` 150 ms, `linear` | replacement for slides, zooms, morphs |
| in-place travel cap | 24 px | entrances under full motion |
| scale start | 0.95–0.97 (`--motion-scale-from` 0.96) | popovers, dialogs |
| autoplay limit | 5 s, then pause control | WCAG 2.2.2 |
| flash limit | ≤ 3 per second | WCAG 2.3.1 |

## Implementation sketch
```css
.sheet {
  opacity: 1;
  transition: opacity var(--motion-dur-short) linear;
  @starting-style { opacity: 0; }

  @media (prefers-reduced-motion: no-preference) {
    translate: 0 0;
    transition:
      opacity var(--motion-dur-short) linear,
      translate var(--motion-dur-medium) var(--motion-ease-drawer);
    @starting-style { translate: 0 100%; }
  }
}

.glass {
  background: color-mix(in oklch, Canvas 72%, transparent);
  backdrop-filter: blur(16px);
  @media (prefers-reduced-transparency: reduce) {
    background: Canvas;
    backdrop-filter: none;
  }
  @media (prefers-contrast: more) {
    outline: 1px solid CanvasText;
  }
}
```
```ts
import { animate } from 'motion';

// JS-driven motion reads the same preference and listens for changes.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

export function settleSheet(el: HTMLElement, toY: number, velocity: number) {
  if (reduce.matches) {
    return animate(el, { y: toY }, { type: 'spring', bounce: 0, visualDuration: 0.15 });
  }
  return animate(el, { y: toY }, { type: 'spring', bounce: 0.1, visualDuration: 0.3, velocity });
}
```
Support: `prefers-reduced-motion` is Baseline widely available (newly available January 2020) and `prefers-contrast` is Baseline too; `prefers-reduced-transparency` is Chromium-only, so the translucent default must stay legible on its own.

## Checklist
- [ ] Every spatial effect has a listed substitute under `reduce`.
- [ ] Dragging still tracks the finger 1:1 under reduced motion.
- [ ] No parallax, scroll-jacking, full-viewport zoom or looping oscillation.
- [ ] JS animation libraries read the preference and listen for changes.
- [ ] Autoplay over 5 s has a pause control; nothing flashes more than 3 times a second.
- [ ] Tested with Playwright `reducedMotion: 'reduce'` and on a real device.

## Sources
- https://web.dev/articles/prefers-reduced-motion
- https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- https://motion.dev/docs/react-accessibility
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
- https://playwright.dev/docs/emulation#reduced-motion
