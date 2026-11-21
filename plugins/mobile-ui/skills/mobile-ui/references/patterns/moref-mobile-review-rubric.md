# Mobile review rubric and capture recipe

> Capture every screen at 390×844 (iPhone) and 360×800 (Android) with touch emulated, in light and dark, at 200% text and in landscape, then score 30 checks in 7 sections 0–2 each; ship at 80% or more with no "must" check at 0.

**Category:** Reference / review tool · **Applies to:** any mobile web page, PWA or responsive app screen · **Priority:** must

## When to use / when not
- Run it in design review, before release, and when auditing an existing mobile site. Pair with `moref-mobile-anti-patterns.md`.
- Checks marked **[DOM]** are verified in code or computed styles, **[VIS]** on a screenshot, **[INT]** by interacting, **[DEV]** on a real device.
- For dashboards viewed on phones, also score dashboard-ui `ref-design-review-rubric.md`; this rubric covers the mobile-specific layer.
- Not a substitute for testing with people on their own phones.

## Rules (do)
**Scoring:** each check scores 2 (criterion holds everywhere), 1 (partly) or 0. N/A only where stated, excluded from the denominator. Score = points ÷ (2 × applicable checks), rounded down. **Bands:** ≥ 80% ship · 65–79% ship with tracked fixes · < 65% redesign. Any **(must)** at 0 means redesign. IDs are stable and never renumbered.

**Capture recipe (evidence kit):**
1. Viewports: **390×844** at DPR 3 (iPhone 12–16 class) and **360×800** at DPR 3 (common Android class), `isMobile` and `hasTouch` on, so `pointer: coarse` and `hover: none` apply.
2. For each primary screen: full-page and first-viewport screenshots, light and dark (`prefers-color-scheme`).
3. Landscape: 844×390.
4. Large text: the same screen with root font size at 200% (or OS text size at its maximum on a device).
5. Keyboard: focus the lowest text field and screenshot (on a device or the iOS simulator; emulators do not show the keyboard).
6. Network: one load with Lighthouse mobile throttling; read the field data (CrUX) if available.
7. Offline: one load with the network off (PWAs).
8. Reduced motion emulated; one pass with a screen reader (VoiceOver or TalkBack) on the main task.

### A. Reach and targets
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| A1 (must) | Touch targets ≥ 44×44 (48 for Material-styled apps), none < 24 | [DOM] measure hit areas of all controls under `pointer: coarse` | All | ≤ 3 below 44, none below 24 | Any below 24 |
| A2 | Adjacent targets ≥ 8 px apart | [DOM] | All | Some | Crowded rows of icons |
| A3 (must) | Primary action of each screen reachable in the lower half | [VIS] 390×844 | Yes on all screens | Some screens | Only top corners |
| A4 | Destructive actions away from the easy zone and from the primary action | [VIS] | Yes | — | Adjacent |

### B. Navigation and overlays
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| B1 (must) | Top-level navigation visible (3–5 labelled items) or justified | [VIS] | Bottom bar or visible nav | Hamburger + visible primary items | Hamburger only for ≤ 5 destinations |
| B2 | Back (browser, gesture, in-app) returns to the previous screen; tabs keep state | [INT] | All | Some state lost | Back exits or loops |
| B3 (must) | Sheets and dialogs dismiss by button, scrim, swipe (sheets), Esc/back | [INT] | All four | Three | Swipe-only or no button |
| B4 | Persistent bars together under 25% of height; none stacked on load | [VIS] | Yes | 25–35% | > 35% |

### C. Viewport, safe areas, orientation
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| C1 (must) | No horizontal page scroll at 360 and 320 px | [DOM] `scrollWidth > clientWidth` on `html` | None | Only at 320 | At 360 |
| C2 (must) | Fixed bars pad `env(safe-area-inset-*)` when `viewport-fit=cover`; nothing under notch or home indicator | [DOM]/[DEV] | Yes | Portrait only | Clipped |
| C3 | No `100vh` full-height layouts; shells `dvh`, sheets `svh` | [DOM] | Yes | — | `100vh` shell |
| C4 | Focused field, its label and error visible above the keyboard | [DEV] | Yes | Label or error hidden | Field hidden |
| C5 (must) | Works in landscape; no orientation lock or rotate overlay | [VIS] 844×390 | Usable | Cramped (< 60% content height) | Locked or broken |

### D. Text and colour
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| D1 (must) | Body ≥ 16 px, nothing essential < 13 px, inputs ≥ 16 px | [DOM] | Yes | Secondary text 12 px | Body or inputs < 16 (zoom on focus) |
| D2 (must) | 200% text: no clipping, overlap or horizontal scroll | [VIS] | Clean | Minor truncation of secondary text | Clipped controls or content |
| D3 (must) | Viewport allows zoom (no `maximum-scale=1`/`user-scalable=no`) | [DOM] | Yes | — | Blocked |
| D4 | Dark mode follows the OS, `theme-color` per scheme, native controls themed | [VIS] | All | Some | No dark or a white flash |
| D5 | Contrast 4.5:1 text, 3:1 UI in both themes | [DOM] | All | 1–2 pairs | More |

### E. Input and gestures
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| E1 (must) | Right keyboard and `autocomplete` per field; no `type="number"` for codes | [DOM]/[DEV] | All | ≤ 2 misses | Sign-in or payment fields wrong |
| E2 (must) | Every gesture has a visible alternative | [INT] | All | — | Any gesture-only action |
| E3 | No custom gestures on the iOS back edge or home strip; `touch-action` scoped | [INT] | Yes | — | Conflicts |
| E4 | Forms are one column with labels above, submit visible | [VIS] | Yes | Minor | Multi-column or placeholder labels |
| E5 | Haptics, if any, only on commits, snaps and errors, with visual cue | [INT] N/A if none | Yes | — | Buzz on every tap |

### F. Content layout
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| F1 | Homogeneous items as rows (≥ 44 px), one primary target per row | [VIS] | Yes | Card per row | Multiple tiny targets per row |
| F2 | Tables use a labelled scroll region with sticky first column, or stacked records | [DOM] N/A if no tables | Yes | Scroll without sticky column | Page scroll or < 13 px text |
| F3 | Hover-only content has a touch equivalent | [INT] | All | — | Any hover-only |

### G. Performance and platform
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| G1 (must) | Mobile LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (field p75, else lab) | [DEV] | All good | One needs improvement | Any poor |
| G2 | Images sized (`width`/`height`), responsive `srcset`, LCP image not lazy | [DOM] | Yes | Some | LCP lazy or no dimensions |
| G3 | Installable app (if a PWA): full manifest, no install prompt on load | [DOM] N/A for non-apps | Yes | Minor gaps | Prompt on load or broken manifest |
| G4 | Offline (if a PWA): shell opens, cached data marked offline, actions queued or disabled | [INT] N/A for non-apps | Yes | Shell only | Browser error page |

## Anti-patterns (don't)
- Scoring only from a desktop browser resized to 390 px with a mouse: `hover` and `pointer` are wrong, so hover-only bugs pass.
- Skipping the real-device checks (C2, C4, G1): emulators do not show the keyboard, notch or real CPU speed.
- Averaging away a must-check failure.

## Good references
- [Chrome DevTools: Device mode](https://developer.chrome.com/docs/devtools/device-mode): touch, DPR and device presets including foldables.
- [Playwright: Emulation](https://playwright.dev/docs/emulation): `viewport`, `deviceScaleFactor`, `isMobile`, `hasTouch`, `colorScheme`, `reducedMotion`.
- [web.dev: Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): what mobile lab scores measure.
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/): 1.3.4, 1.4.4, 1.4.10, 2.4.11, 2.5.1, 2.5.7, 2.5.8 used above.

## Bad references
- Review reports that cite a "mobile-friendly" badge or a single emulator screenshot as evidence. Google retired its Mobile-Friendly Test tool at the end of 2023, and a badge never covered keyboards, safe areas or text scale.

## Accessibility
- The rubric's must-checks map to WCAG 2.2 AA criteria: A1 (2.5.8), C1 (1.4.10), C5 (1.3.4), D2 (1.4.4), D3 (1.4.4), E2 (2.5.1, 2.5.7), C4 (2.4.11).
- Include a screen-reader pass on the main task; the rubric cannot replace it.

## Motion / interaction (if relevant)
- Record a short screen video of the main gestures (sheet, swipe, back) on a device; judge 1:1 tracking and interruptibility by eye.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| iPhone capture | 390×844, DPR 3 | primary iOS viewport |
| Android capture | 360×800, DPR 3 | primary Android viewport |
| landscape | 844×390 | orientation check |
| reflow floor | 320px wide | WCAG 1.4.10 |
| text | 200% | WCAG 1.4.4 |
| ship band | ≥ 80%, no must at 0 | release gate |

## Implementation sketch
```ts
// Capture recipe. Pass in a Playwright Browser (or anything with the same shape) so the sketch has no hard dependency.
type Shot = { path: string; fullPage?: boolean }
interface PageLike {
  goto(url: string): Promise<unknown>
  screenshot(options: Shot): Promise<unknown>
  emulateMedia(options: { colorScheme?: 'light' | 'dark'; reducedMotion?: 'reduce' | 'no-preference' }): Promise<void>
  addStyleTag(options: { content: string }): Promise<unknown>
  evaluate<R>(fn: () => R): Promise<R>
  close(): Promise<void>
}
interface BrowserLike {
  newPage(options: { viewport: { width: number; height: number }; deviceScaleFactor: number; isMobile: boolean; hasTouch: boolean }): Promise<PageLike>
}

const VIEWPORTS = [
  { name: 'iphone-390x844', width: 390, height: 844 },
  { name: 'android-360x800', width: 360, height: 800 },
  { name: 'landscape-844x390', width: 844, height: 390 },
] as const

export async function captureMobile(browser: BrowserLike, url: string, outDir: string): Promise<string[]> {
  const findings: string[] = []
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
    await page.goto(url)
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.screenshot({ path: `${outDir}/${vp.name}-${scheme}.png` })
      await page.screenshot({ path: `${outDir}/${vp.name}-${scheme}-full.png`, fullPage: true })
    }
    // C1: horizontal page scroll
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    if (overflow) findings.push(`C1 ${vp.name}: page scrolls horizontally`)
    // A1: targets smaller than 44px
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [role="button"]')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44) && !el.closest('p, li > p') })
        .length)
    if (small > 0) findings.push(`A1 ${vp.name}: ${small} targets under 44px (check extended hit areas by hand)`)
    // D2: 200% text
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    await page.screenshot({ path: `${outDir}/${vp.name}-text200.png`, fullPage: true })
    await page.close()
  }
  return findings
}
```

## Checklist
- [ ] Evidence kit captured at 390×844 and 360×800 with touch on, light and dark, landscape and 200% text.
- [ ] Real-device pass for the keyboard, safe areas and performance.
- [ ] Every check scored with evidence; N/A justified.
- [ ] Must-checks at 0 listed first with fixes.
- [ ] Report gives the percentage, the band and a table of check, score, evidence and fix.

## Sources
- https://playwright.dev/docs/emulation
- https://developer.chrome.com/docs/devtools/device-mode
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
- https://www.w3.org/TR/WCAG22/
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/ref-design-review-rubric.md
- Note: 390×844 is the CSS viewport of iPhone 12–14 (iPhone 15–16 are 393×852); 360×800 is a widely used Android CSS viewport. Both are captures for comparability, not claims about market share.
