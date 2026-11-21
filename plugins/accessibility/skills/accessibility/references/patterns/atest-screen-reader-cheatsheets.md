# Screen reader cheat-sheets: VoiceOver, NVDA, TalkBack

> Test with the pairings people actually use (NVDA + Chrome or Firefox and JAWS + Chrome on Windows, VoiceOver + Safari on macOS and iOS, TalkBack + Chrome on Android), learn the dozen commands below for each, and navigate the way users do: by headings, landmarks, links and form controls, not only by Tab.

**Category:** Testing · **Applies to:** component and page testing, audits, bug reproduction · **Priority:** must

## When to use / when not
- **Use** whenever you build or change a component with a role, state, name or live update, and in every audit.
- **Minimum set:** one desktop pairing (NVDA + Chrome or Firefox, free) and one mobile pairing (VoiceOver on iOS or TalkBack on Android). Add VoiceOver + Safari on macOS for anything Mac-heavy.
- **Not** a substitute for testing with disabled users; developers using a screen reader for an hour miss what daily users rely on.

## Rules (do)
- **Browse vs focus mode.** Desktop screen readers read web pages in a virtual "browse" mode where single letters jump between elements; they switch to "focus/forms" mode in inputs and widgets so keys go to the page. Test both: a widget that works only in one mode is broken.
- **Turn on speech text** while testing so you can read what was said: NVDA › Tools › Speech Viewer; VoiceOver caption panel is on by default on macOS.

**VoiceOver on macOS (Safari)** — VO = Control + Option (or Caps Lock if set)

| Action | Keys |
|---|---|
| Turn on/off | Cmd + F5 |
| Read from here / stop | VO + A / Control |
| Next / previous item | VO + Right / VO + Left |
| Activate | VO + Space |
| Rotor (headings, links, landmarks, form controls lists) | VO + U, then Left/Right to switch list |
| Next heading / link / form control | VO + Cmd + H / VO + Cmd + L / VO + Cmd + J |
| Enter / leave a group (table, toolbar, web area) | VO + Shift + Down / VO + Shift + Up |
| Tab through focusable elements | Tab / Shift + Tab |

**VoiceOver on iOS (Safari)**

| Action | Gesture |
|---|---|
| Turn on/off | Settings › Accessibility › VoiceOver, or triple-click side button if set |
| Next / previous item | Swipe right / left |
| Activate | Double-tap |
| Read all from top / from here | Two-finger swipe up / down |
| Rotor (choose headings, links, form controls…) | Two-finger rotate |
| Move by rotor setting | Swipe down / up |
| Scroll | Three-finger swipe |
| Back / dismiss | Two-finger scrub (Z shape) |
| Stop speech | Two-finger tap |

**NVDA on Windows (Chrome or Firefox)** — NVDA key = Insert (desktop layout) or Caps Lock (laptop layout)

| Action | Keys |
|---|---|
| Start / quit | Control + Alt + N / NVDA + Q |
| Read all / stop | NVDA + Down Arrow (laptop: NVDA + A) / Control |
| Next / previous item in browse mode | Down / Up Arrow |
| Next heading, level 1–6 (Shift = previous) | H, 1–6 |
| Next landmark / link / form field / button | D / K / F / B |
| Next table / edit field / combo box / checkbox | T / E / C / X |
| Elements list (headings, links, landmarks…) | NVDA + F7 |
| Table navigation | Control + Alt + Arrows |
| Toggle browse / focus mode | NVDA + Space |
| Activate | Enter (Space for checkboxes and buttons) |

**TalkBack on Android (Chrome)** — default gestures; multi-finger alternatives exist on TalkBack 9.1+

| Action | Gesture |
|---|---|
| Turn on/off | Hold both volume keys for 3 s (if the shortcut is on) or Settings › Accessibility › TalkBack |
| Next / previous item | Swipe right / left |
| Activate | Double-tap |
| Scroll | Two-finger swipe |
| Next / previous reading control (headings, links, controls…) | Swipe up then down / down then up (multi-finger: three-finger swipe down / up) |
| Move by reading control | Swipe down / up |
| TalkBack menu | Swipe down then right (multi-finger: three-finger tap) |
| Back | Swipe down then left |
| Explore by touch | Drag one finger |

- **What to listen for on every element:** name, role, state (checked, expanded, selected, current, invalid), value, description, and position in a set ("2 of 5"). Missing or wrong = 4.1.2 or 1.3.1.
- **Record findings** as: screen reader + version + browser + version, steps, heard vs expected (`aref-audit-rubric-and-report.md`).
- **Known differences are not always bugs.** VoiceOver doesn't announce some states NVDA does; check a11ysupport.io before "fixing" markup to suit one screen reader.

## Anti-patterns (don't)
- Testing only by tabbing: screen-reader users mostly navigate by headings and virtual cursor, and Tab skips all non-interactive text.
- Testing VoiceOver with Chrome as the only Mac pairing: Safari is the supported pairing.
- Adding ARIA to make one screen reader say a particular phrase.
- Leaving the screen reader's verbosity at defaults you changed for comfort without noting it in the report.

## Good references
- [Apple — VoiceOver User Guide for Mac](https://support.apple.com/guide/voiceover/welcome/mac) — full command reference and rotor.
- [Apple — Use VoiceOver gestures on iPhone](https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios) — gestures and the rotor.
- [NV Access — NVDA User Guide](https://download.nvaccess.org/documentation/userGuide.html) — browse mode single-letter navigation, Elements List, Speech Viewer.
- [Google — TalkBack gestures](https://support.google.com/accessibility/android/answer/6151827) — default and multi-finger gestures, reading controls.
- [WebAIM — Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey10/) — which screen readers and browsers people use, and that headings are the primary way to find content.
- [modern-web-guidance — Accessibility §13 Manual testing](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#manual-testing) — calibrated screen reader + browser pairings.

## Bad references
- Test reports that say "tested with a screen reader" without naming which, which version and which browser: the result can't be reproduced.

## Accessibility
- This file is accessibility testing. Learn commands with your monitor on, then repeat key flows with the screen off (VoiceOver: VO + Fn + Shift + Underscore, the screen curtain) to avoid relying on sight.

## Motion / interaction (if relevant)
- Screen readers don't wait for animations; content that appears after a transition must already be in the DOM and named when focus or the virtual cursor reaches it.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Desktop pairing (minimum) | NVDA + Chrome or Firefox | Windows |
| macOS pairing | VoiceOver + Safari | Mac |
| Mobile pairing (minimum one) | VoiceOver + iOS Safari, or TalkBack + Chrome | Touch |
| Per element | name, role, state, value, description, position | Listen for |

## Implementation sketch
A typed finding record so screen-reader results are reproducible and can feed the report.
```ts
type ScreenReader = 'NVDA' | 'JAWS' | 'VoiceOver macOS' | 'VoiceOver iOS' | 'TalkBack' | 'Narrator'

export interface SrFinding {
  readonly sr: ScreenReader
  readonly srVersion: string
  readonly browser: string
  readonly steps: readonly string[]
  readonly heard: string
  readonly expected: string
  readonly criteria: readonly string[]   // e.g. ['4.1.2']
}

export const describe = (f: SrFinding): string =>
  `${f.sr} ${f.srVersion} + ${f.browser}: heard "${f.heard}", expected "${f.expected}" (${f.criteria.join(', ')})`
```

## Checklist
- [ ] One desktop and one mobile pairing tested, versions recorded.
- [ ] Navigated by headings, landmarks, links and form fields, not only Tab.
- [ ] Every interactive element announced with name, role and state.
- [ ] Widgets work in browse and focus modes.
- [ ] Live updates were heard once, at the right time.
- [ ] Findings record steps, heard vs expected and criteria.

## Sources
- https://support.apple.com/guide/voiceover/welcome/mac
- https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios
- https://download.nvaccess.org/documentation/userGuide.html
- https://support.google.com/accessibility/android/answer/6151827 (gesture table checked November 2026)
- https://webaim.org/projects/screenreadersurvey10/
- https://a11ysupport.io/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
