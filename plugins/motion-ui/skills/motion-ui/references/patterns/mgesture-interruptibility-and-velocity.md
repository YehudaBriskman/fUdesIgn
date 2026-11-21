# Interruptibility and velocity handoff

> Any animation the user can affect must be interruptible at every frame: new input stops it at its current on-screen (presentation) value, carries its current velocity into whatever comes next, and never queues, restarts from the beginning or blocks input until it finishes.

**Category:** Gestures · **Applies to:** sheets and drawers mid-open, menus toggled quickly, drag during a settle, layout animations, page transitions, toggles, carousels · **Priority:** must

## When to use / when not
Always, for anything triggered by the user. The only exceptions are short, non-spatial feedback (a 100 ms colour change), where interruption is invisible anyway.

## Rules (do)
- **Retarget from the presentation value.** When input arrives mid-animation, read where the element *is* on screen (computed style, `getAnimations()`, the library's current value), not where the animation was heading. WWDC18 makes constant redirection a core principle of fluid interfaces.
- **Keep velocity.** The new animation starts with the old one's current velocity. Springs do this naturally: SwiftUI's retargeted springs and Motion's physics and `visualDuration` springs inherit velocity; Motion's fixed-`duration` spring and plain tweens start from rest.
- **Grab stops it.** A pointer-down on a moving element stops the animation at its current position and hands control to the drag, with the grab offset measured from there.
- **Transitions over keyframes in CSS.** A reversed CSS transition starts from the current value; a `@keyframes` animation restarts from its first keyframe, so a fast open-close jumps (Emil Kowalski's review standard treats this as a defect).
- **Never queue.** Clicking "next" three times quickly goes to the third item directly, with one animation, not three in sequence. Don't wait for `transitionend` to accept input.
- **Don't block input during motion.** No `pointer-events: none` on the whole UI while something animates; the user may want to undo it.
- **Reversal without a brick wall.** When a spring reverses direction at high speed, the velocity handoff makes it decelerate and turn around smoothly; with a tween you'd see an instant reversal. If you must use tweens, keep them short (≤ 150 ms) so reversal is barely visible.
- **View Transitions skip, they don't queue.** Starting a new view transition while one runs skips the old one to its end (Chrome docs); that's the right behaviour for fast navigation.

## Anti-patterns (don't)
- `@keyframes slideIn` / `slideOut` on a toggled panel: rapid toggling jumps to frame 0.
- Animation queues (jQuery's default `fx` queue behaviour) where every click plays in turn.
- Ignoring clicks while `isAnimating` is true.
- Reading the target value (React state) as the start of the next animation, so the element jumps back to where the last animation was going.
- A drag that can't start until the sheet has finished settling.

## Good references
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): interruption and redirection at any time; gestures and animations as one continuous interaction.
- [WWDC23, Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/): a retargeted spring keeps its current velocity.
- [Emil Kowalski, Great animations](https://emilkowal.ski/ui/great-animations): interruptible by default; use transitions, not keyframes, for toggled UI.
- [Motion, spring](https://motion.dev/docs/spring): velocity inheritance for physics and `visualDuration` springs.
- [Rauno Freiberg, Invisible details of interaction design](https://rauno.me/craft/interaction-design): change course mid-animation like turning a page part-way.
- [Chrome for Developers, same-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): a new transition skips the running one.

## Bad references
- Older carousel plugins that ignore input until the current slide animation completes, so fast clicks are lost.
- Menus built with `@keyframes` open/close animations that snap to the start when hovered on and off quickly.

## Accessibility
- Interruption must also work from the keyboard: Escape closes a dialog that is still opening, immediately.
- Under reduced motion animations are short, which also makes interruptions rarer; the rules still apply.

## Motion / interaction (if relevant)
This pattern ties together drag (`mgesture-direct-manipulation-drag.md`), release (`mgesture-momentum-projection-and-snap.md`) and the spring tokens (`mspring-parameters-and-mapping.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| retarget source | current presentation value | every interruption |
| velocity | inherited, px/s | springs after interrupt |
| max tween length for reversible UI | 150 ms | when not using springs |
| input blocking during animation | none | always |

## Implementation sketch
```ts
import { animate } from 'motion';

type Controls = ReturnType<typeof animate>;

/** A retargetable x-position: each call starts from where the element is now, with its current velocity. */
export function createRetargetableX(el: HTMLElement) {
  let running: Controls | null = null;
  let current = 0;
  let lastT = performance.now();
  let lastX = 0;
  let velocity = 0;

  const write = (x: number) => {
    const now = performance.now();
    if (now > lastT) velocity = ((x - lastX) / (now - lastT)) * 1000;
    lastT = now; lastX = x; current = x;
    el.style.translate = `${x}px 0`;
  };

  return {
    to(target: number): void {
      running?.stop();
      running = animate(current, target, { type: 'spring', visualDuration: 0.25, bounce: 0, velocity, onUpdate: write });
    },
    grab(): number {
      running?.stop();
      running = null;
      velocity = 0;
      return current;
    },
    set: write,
  };
}
```
```css
/* Toggled panels use transitions, so a reversal starts from the current value. */
.panel { translate: 0 -8px; opacity: 0; transition: translate 150ms var(--motion-ease-enter), opacity 150ms linear; }
.panel[data-open] { translate: 0 0; opacity: 1; }
```

## Checklist
- [ ] Interruptions start from the on-screen value, not the old target.
- [ ] Velocity carries over into the next animation (springs, not fixed-duration tweens).
- [ ] Pointer-down on a moving element stops it and starts tracking.
- [ ] Toggled UI uses CSS transitions, not keyframes.
- [ ] No animation queue and no input blocked while animating.
- [ ] Escape and other keys interrupt immediately.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://developer.apple.com/videos/play/wwdc2023/10158/
- https://emilkowal.ski/ui/great-animations
- https://motion.dev/docs/spring
- https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/generators/spring.ts
- https://rauno.me/craft/interaction-design
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://drafts.csswg.org/css-transitions/#reversing
