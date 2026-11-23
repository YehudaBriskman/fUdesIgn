# Spring parameters: duration and bounce, mapped across libraries

> Specify every spring as a perceptual duration plus a bounce (bounce 0 by default, 0.1–0.2 only after a gesture with momentum, 0.3 only for rare playful moments), and convert to each library's own parameters with one formula: ω = 2π / duration, damping ratio ζ = 1 − bounce, stiffness = ω², damping = 2ζω (mass 1).

**Category:** Springs · **Applies to:** drag release, sheets and drawers, snapping, layout and shared-element animations, toggles and anything that can be interrupted mid-flight · **Priority:** must

## When to use / when not
Use a spring when the motion can be interrupted or when it continues a gesture: a spring starts from whatever position and velocity the element has now, so a retarget never jumps. Use a tween (`mfound-durations-and-easing.md`) for opacity, colour and fixed, non-interruptible state changes; M3 itself splits "spatial" springs (position, size, shape) from "effects" springs (colour, opacity) and gives effects no bounce.

## Rules (do)
- **Think in duration and bounce, not stiffness and damping.** WWDC18 "Designing Fluid Interfaces" reduced springs to two controls (damping and response) and advised against thinking in physics constants or in settle duration; WWDC23 "Animate with springs" turned them into *duration* (the perceived pace) and *bounce* (−1 to 1).
- **Default bounce 0.** Apple's advice is to start at 100% damping (no overshoot) and add bounce only when the gesture itself carried momentum; its example is the Music "Now Playing" card, which opens on tap with 100% damping and is dismissed by a swipe with 80% damping (bounce 0.2).
- **Bounce bands.** WWDC23's rough guide: 0 smooth, about 0.15 brisk, about 0.3 noticeably bouncy, above about 0.4 too much for most UI. House rule: 0 for UI chrome and anything opacity-based; 0.1–0.2 after a fling; 0.3 only for rare, playful moments; never on data values (an overshooting bar shows a value that doesn't exist).
- **Convert with one formula** (mass 1, bounce ≥ 0): ω = 2π / duration; ζ = 1 − bounce; stiffness k = ω²; damping c = 2ζω = 4π(1 − bounce) / duration. For bounce < 0 (overdamped), ζ = 1 / (1 + bounce). Apple's WWDC23 code listing prints the damping line in a garbled form; use the derivation above, which Motion's source also follows.
- **Know each library's "duration".** SwiftUI's `duration` equals Apple's *response* (2π/ω). Motion's `visualDuration` is slightly longer in physics terms: its source uses ω = 2π / (1.2 × visualDuration), so Motion `visualDuration: 0.3` ≈ SwiftUI `duration: 0.36`. Motion's plain `duration` spring ignores incoming velocity; use `visualDuration` or physics options when velocity matters.
- **Pick a speed by size.** M3's rule: fast springs for small components (switches, buttons), default for partial-screen surfaces (sheets, drawers, menus), slow for full-screen changes.
- **Settling takes longer than the duration.** A critically damped spring with a 0.3 s perceived duration reaches 99.9% of its target at about 0.45 s. Don't chain the next step on "settled"; chain it on the perceived duration (SwiftUI's completion handlers do the same).
- **One table, all stacks.** Keep the conversions below next to your tokens so design and code speak the same units.

## Anti-patterns (don't)
- Copying `stiffness: 100, damping: 10` (Motion's physics default, ζ = 0.5, bounce 0.5) onto UI chrome: it wobbles.
- React Spring's `wobbly` preset (ζ ≈ 0.45) on menus or dialogs.
- Tuning stiffness and damping by eye for each component, so no two springs share a feel.
- A bounce on opacity, colour or a progress value.
- Treating a spring's settle time as its duration and making the UI wait for it.
- Confusing Motion's `damping` (a physics coefficient) with Apple's damping *ratio*; `damping: 1` in Motion is almost undamped, not critically damped.

## Good references
- [WWDC18, Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): damping and response; start at 100% damping; 80% for the momentum-carrying dismiss.
- [WWDC23, Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/): perceptual duration plus bounce; bounce bands; retargeted springs keep velocity.
- [SwiftUI `Animation.smooth/snappy/bouncy`](https://developer.apple.com/documentation/swiftui/animation/smooth%28duration:extrabounce:%29): Apple's docs describe `smooth` as no bounce, `snappy` as a small amount and `bouncy` as a higher amount, with no numbers. The values 0, 0.15 and 0.3 at 0.5 s are commonly measured, not published by Apple. `Spring(duration:bounce:)` defaults to 0.5 and 0 (not re-checked here).
- [androidx Material 3 motion tokens](https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens): `StandardMotionTokens.kt` and `ExpressiveMotionTokens.kt` hold the spring values below.
- [Material Components for Android, Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md): spatial vs effects springs, fast/default/slow by component size.
- [Motion, spring](https://motion.dev/docs/spring) and [its source](https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/generators/spring.ts): `bounce`, `visualDuration`, velocity inheritance, the bounce→ζ mapping "as SwiftUI does".
- [React Spring config constants](https://github.com/pmndrs/react-spring/blob/main/packages/core/src/constants.ts): tension/friction presets.

## Bad references
- [Motion spring docs](https://motion.dev/docs/spring) list default `stiffness: 1`, `restSpeed: 0.1` and `restDelta: 0.01`, while the shipped source uses 100, 2 and 0.5 (as of November 2026). Trust the source, and set your own values explicitly.
- Libraries and tutorials that present one "spring" preset for everything; a switch thumb and a full-screen sheet need different speeds (M3 fast vs slow).

## Accessibility
- Under reduced motion, use bounce 0 and a short duration (≤ 0.2 s), or replace the spatial spring with a fade. Apple's HIG asks for tighter springs with less bounce when Reduce Motion is on.
- Never use bounce on something a user must read while it moves.

## Motion / interaction (if relevant)
Springs are the right tool for anything interruptible: see `mgesture-interruptibility-and-velocity.md` for retargeting and velocity handoff, and `mspring-css-linear-and-tokens.md` for CSS.

## Tokens and values
Conversions computed with the formula above (mass 1). "Duration" is SwiftUI-style perceptual duration, 2π/ω.

| Source | Native values | ζ | Duration | Bounce |
|---|---|---|---|---|
| M3 Standard, fast spatial | k 1400, ζ 0.9 | 0.9 | 0.17 s | 0.1 |
| M3 Standard, default spatial | k 700, ζ 0.9 | 0.9 | 0.24 s | 0.1 |
| M3 Standard, slow spatial | k 300, ζ 0.9 | 0.9 | 0.36 s | 0.1 |
| M3 effects fast / default / slow (both schemes) | k 3800 / 1600 / 800, ζ 1 | 1 | 0.10 / 0.16 / 0.22 s | 0 |
| M3 Expressive, fast spatial | k 800, ζ 0.6 | 0.6 | 0.22 s | 0.4 |
| M3 Expressive, default spatial | k 380, ζ 0.8 | 0.8 | 0.32 s | 0.2 |
| M3 Expressive, slow spatial | k 200, ζ 0.8 | 0.8 | 0.44 s | 0.2 |
| SwiftUI `.smooth` / `.snappy` / `.bouncy` (values commonly measured, not published by Apple) | duration 0.5 | 1 / 0.85 / 0.7 | 0.5 s | 0 / 0.15 / 0.3 |
| SwiftUI legacy `.spring(response: 0.5, dampingFraction: 0.825)` (default as commonly cited; not verified at developer.apple.com) | | 0.825 | 0.5 s | 0.175 |
| React Spring `default` | tension 170, friction 26 | 1.0 | 0.48 s | 0 |
| React Spring `gentle` / `stiff` / `wobbly` | 120/14 · 210/20 · 180/12 | 0.64 / 0.69 / 0.45 | 0.57 / 0.43 / 0.47 s | 0.36 / 0.31 / 0.55 |
| React Spring `slow` / `molasses` | 280/60 · 280/120 | 1.79 / 3.59 | 0.38 s | overdamped |
| Motion physics default | stiffness 100, damping 10 | 0.5 | 0.63 s | 0.5 |
| Motion default for `x`, `rotate` | stiffness 500, damping 25 | 0.56 | 0.28 s | 0.44 |

House spring tokens (same values in every stack):

| Token | Duration | Bounce | Use | Motion | React Spring (k / c) |
|---|---|---|---|---|---|
| `spring-fast` | 0.24 s | 0 | toggles, small controls | `visualDuration: 0.2, bounce: 0` | 685 / 52 |
| `spring-default` | 0.3 s | 0 | menus, sheets settling, layout | `visualDuration: 0.25, bounce: 0` | 439 / 42 |
| `spring-slow` | 0.45 s | 0 | full-screen surfaces | `visualDuration: 0.375, bounce: 0` | 195 / 28 |
| `spring-snappy` | 0.3 s | 0.15 | release after a fling, snap points | `visualDuration: 0.25, bounce: 0.15` | 439 / 36 |
| `spring-playful` | 0.4 s | 0.3 | rare delight only | `visualDuration: 0.33, bounce: 0.3` | 247 / 22 |

The CSS `linear()` versions of these tokens are in `mspring-css-linear-and-tokens.md` and `assets/motion-tokens.css`.

## Implementation sketch
```ts
export interface SpringSpec { duration: number; bounce: number }
export interface SpringPhysics { stiffness: number; damping: number; mass: number }

/** duration (s, perceptual, 2π/ω) + bounce (−1…1) → mass/stiffness/damping. */
export function toPhysics({ duration, bounce }: SpringSpec): SpringPhysics {
  const omega = (2 * Math.PI) / duration;
  const zeta = bounce >= 0 ? 1 - bounce : 1 / (1 + bounce);
  return { mass: 1, stiffness: omega * omega, damping: 2 * zeta * omega };
}

/** stiffness/damping/mass → duration + bounce, to compare presets. */
export function fromPhysics({ stiffness, damping, mass }: SpringPhysics): SpringSpec {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return { duration: (2 * Math.PI) / omega, bounce: zeta <= 1 ? 1 - zeta : 1 / zeta - 1 };
}

/** Motion's visualDuration uses ω = 2π / (1.2 · visualDuration). */
export const toMotionVisualDuration = (duration: number): number => duration / 1.2;

export const SPRING = {
  fast: { duration: 0.24, bounce: 0 },
  default: { duration: 0.3, bounce: 0 },
  slow: { duration: 0.45, bounce: 0 },
  snappy: { duration: 0.3, bounce: 0.15 },
  playful: { duration: 0.4, bounce: 0.3 },
} as const satisfies Record<string, SpringSpec>;
```
```tsx
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export function Panel({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <motion.div
      animate={{ y: open ? 0 : 24, opacity: open ? 1 : 0 }}
      transition={{
        y: { type: 'spring', visualDuration: 0.25, bounce: 0 },
        opacity: { duration: 0.15, ease: 'linear' },
      }}
    >
      {children}
    </motion.div>
  );
}
```

## Checklist
- [ ] Every spring is written as duration + bounce, from the token table.
- [ ] UI chrome uses bounce 0; bounce > 0 only after a gesture with momentum or in rare moments.
- [ ] Opacity and colour use tweens or bounce-0 "effects" springs.
- [ ] Conversions to Motion, React Spring, SwiftUI or Compose use the formula, not hand tuning.
- [ ] Nothing waits for a spring's settle time.
- [ ] Reduced motion uses bounce 0 and a shorter duration, or a fade.

## Sources
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://developer.apple.com/videos/play/wwdc2023/10158/
- https://developer.apple.com/documentation/swiftui/animation/smooth%28duration:extrabounce:%29
- https://developer.apple.com/documentation/swiftui/spring/init(duration:bounce:)
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md
- https://motion.dev/docs/spring
- https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/generators/spring.ts
- https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/utils/default-transitions.ts
- https://github.com/pmndrs/react-spring/blob/main/packages/core/src/constants.ts
