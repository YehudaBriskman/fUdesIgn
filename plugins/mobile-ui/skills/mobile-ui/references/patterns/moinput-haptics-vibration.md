# Haptics and the Vibration API

> Use haptics sparingly to confirm a commit, a snap or an error that the user caused, always together with a visual cue, and treat the web's Vibration API as a progressive enhancement that does nothing on iPhones.

**Category:** Input · **Applies to:** swipe commits, sheet detent snaps, toggles, long-press menus, errors, pull-to-refresh trigger, scanners and games · **Priority:** nice

## When to use / when not
- **Use** for moments a native app would tick: crossing a swipe-commit threshold, a sheet snapping to a detent, a long-press menu opening, a failed payment or scan.
- **Not** for every tap, scroll, page load, notification or marketing moment. Haptics lose meaning (and drain battery) when frequent.
- **Not** as the only feedback: many devices cannot vibrate, many users turn system haptics off, and the web API is missing on iOS.

## Rules (do)
- **Know the platform gap:**
  - `navigator.vibrate(pattern)` works in Chromium browsers on Android (Chrome, Edge, Samsung Internet). It is **not supported in Safari on iOS or macOS**, and caniuse lists Firefox as unsupported from version 129.
  - The web cannot reach the iOS Taptic Engine's refined patterns (selection, impact light/medium/heavy, success/warning/error) or Android's `HapticFeedbackConstants`; only a motor buzz with on/off durations.
  - Chrome requires sticky user activation: calls before the user has interacted with the page are ignored, and cross-origin iframes need permission.
- **Feature-detect** (`'vibrate' in navigator`) and wrap the call; it returns `false` when blocked.
- **Durations** (this skill's own values; no platform publishes web vibration durations): 8–15 ms for a tick (snap, threshold), 20–30 ms for a confirm, a short pattern like `[30, 60, 30]` for an error. Never above 100 ms in ordinary UI; long buzzes feel like a phone call.
- **Same frame as the visual.** Fire the haptic in the same event handler as the visual change (Apple's multimodal guidance: causality and harmony), not after a network round-trip. For success that depends on the server, haptic on the result, not on tap.
- **User control:** respect a site setting to turn haptics off; default on only for moments listed above. There is no web media query for the OS haptics setting.
- **Native-feeling toggles on iOS:** Safari 17.4+ renders `<input type="checkbox" switch>` as a native switch; since Safari 18 on iOS it plays a haptic when toggled (Safari 18.0 release notes: "Added haptic feedback for `<input type=checkbox switch>` on iOS"). Treat that as a bonus, not a mechanism to rely on.
- **Hybrid apps** (Capacitor, React Native, Expo) should call the native haptics API (UIFeedbackGenerator, Android `performHapticFeedback`) rather than vibrate.

## Anti-patterns (don't)
- Vibrating on every button tap or list scroll.
- Long (200 ms+) vibrations for confirmations.
- Haptic as the only error cue ("it buzzed, so it failed") with no message.
- Firing haptics on page load or for promotions.
- Polling `navigator.vibrate` support and showing "your device does not support haptics" messages.

## Good references
- [Apple HIG: Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics): use haptics consistently, complement visual and audio feedback, avoid overuse, and let people turn them off.
- [Android Developers: Haptics design principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles): clear, crisp haptics for meaningful moments, avoid buzzy and long effects.
- [MDN: Navigator.vibrate()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate): pattern syntax, sticky activation, and limited availability.
- [caniuse: Vibration API](https://caniuse.com/vibration): Chromium-only support today, none in Safari, removed in Firefox 129.
- [WWDC 2019: Designing Audio-Haptic Experiences](https://developer.apple.com/videos/play/wwdc2019/810/): causality, harmony and utility as the three principles.

## Bad references
- Early web games and ad units that vibrated on load, the kind of abuse that led Chrome to ignore `vibrate()` before the user has interacted with the page.
- Apps that buzz on every keyboard key in a custom web keyboard: users switch haptics off and lose the useful ones too.

## Accessibility
- Haptics help some deaf and hard-of-hearing users, but never replace visible feedback (WCAG 1.3.3 Sensory Characteristics in spirit: no single-sense instructions).
- Some users with sensory processing differences find vibration distressing: offer an in-app off switch.
- Do not vibrate continuously or repeatedly (motion and seizure guidelines do not cover haptics, but sustained vibration is uncomfortable).

## Motion / interaction (if relevant)
- Pair the haptic tick with the visual snap at the same moment; under `prefers-reduced-motion`, keep the haptic (it is not motion) unless the user turned haptics off.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| haptic tick | 10ms | detent snap, swipe threshold crossed |
| haptic confirm | 20–30ms | committed action (archive, add to cart) |
| haptic error | [30, 60, 30]ms | failed action, invalid scan |
| max single pulse | 100ms | never exceed in UI |
| setting | on by default, user can disable | site preference |

## Implementation sketch
```ts
// Progressive-enhancement haptics: Chromium on Android only; a no-op elsewhere (iOS Safari, Firefox 129+).
type HapticKind = 'tick' | 'confirm' | 'error'

const PATTERNS: Record<HapticKind, number | number[]> = {
  tick: 10,
  confirm: 25,
  error: [30, 60, 30],
}

let enabled = true

export function setHapticsEnabled(on: boolean): void {
  enabled = on
  try { localStorage.setItem('haptics', on ? '1' : '0') } catch { /* storage may be blocked */ }
}

export function haptic(kind: HapticKind): boolean {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return false
  try {
    return navigator.vibrate(PATTERNS[kind])
  } catch {
    return false
  }
}

// Usage: call in the same handler that changes the UI.
export function onDetentSnap(sheet: HTMLElement, detent: string): void {
  sheet.dataset.detent = detent
  haptic('tick')
}
```
```html
<label class="check-row"><input type="checkbox" switch name="haptics" checked> Vibrate on actions</label>
```

## Checklist
- [ ] Haptics fire only for commits, snaps, long-press and errors, never for ordinary taps or scrolling.
- [ ] Every haptic has a visible counterpart in the same frame.
- [ ] Calls are feature-detected and happen only after a user gesture.
- [ ] Pulses are 100 ms or shorter.
- [ ] Users can turn haptics off in the app.
- [ ] Hybrid apps use the native haptics API, not `navigator.vibrate`.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/playing-haptics
- https://developer.android.com/develop/ui/views/haptics/haptics-principles
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
- https://caniuse.com/vibration
- https://developer.apple.com/videos/play/wwdc2019/810/
- https://developer.chrome.com/blog/user-activation
- https://webkit.org/blog/15054/an-html-switch-control/
- https://developer.apple.com/documentation/safari-release-notes/safari-18-release-notes (Forms: haptic feedback for switch checkboxes on iOS)
- Note: vibration support follows the caniuse data file (Firefox supported through 128, unsupported from 129; no Safari support), checked November 2026.
