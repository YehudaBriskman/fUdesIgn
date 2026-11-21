# Mobile anti-pattern catalog

> Check every mobile screen against these 14 recurring failures before scoring the rubric; each one names the rubric check it fails, the fix, and good and bad references.

**Category:** Reference / anti-patterns · **Applies to:** any mobile web page, PWA or responsive app · **Priority:** must

## When to use / when not
- Run it first in a review: it is fast and catches the failures that sink the rubric's must-checks (`moref-mobile-review-rubric.md`).
- Use it as a pre-flight list when generating mobile UI.
- Not a style guide: each item is a failure with evidence, not a taste call.

## Rules (do)
| # | Anti-pattern | Fails | Fix (pattern) |
|---|---|---|---|
| 1 | **Zoom blocked**: `maximum-scale=1` or `user-scalable=no` in the viewport tag | D3 | Remove it; make inputs 16 px (`mofound-type-text-scale.md`) |
| 2 | **`100vh` app shell**: bottom bar hidden under the browser toolbar | C3 | `100dvh` shells, `100svh` sheets (`mofound-viewport-units-keyboard.md`) |
| 3 | **Notch collisions**: `viewport-fit=cover` without inset padding | C2 | `env(safe-area-inset-*)` on fixed UI (`mofound-safe-areas.md`) |
| 4 | **Tiny targets**: 16–32 px icons, dots and links | A1 | 44/48 px hit areas, 8 px gaps (`mofound-touch-targets.md`) |
| 5 | **Hamburger-only navigation** for ≤ 5 destinations | B1 | Bottom bar with labels (`monav-bottom-nav-tabs-drawers.md`) |
| 6 | **Interstitials on load**: install, newsletter, app-download or cookie walls covering the first screen | B4 | Non-modal bars under 15% of the viewport; ask at a moment of value (`moplat-pwa-install-offline-shell.md`) |
| 7 | **Gesture-only actions**: swipe to delete, edge-swipe menus with no button | E2, E3 | Visible alternative; keep edges free (`monav-gestures-swipe-refresh-back.md`) |
| 8 | **Swipe-only sheets**: no close button, no Esc/back | B3 | `<dialog>` sheet with four dismissals (`monav-sheets-detents.md`) |
| 9 | **Wrong keyboards**: `type="number"` for codes, no `autocomplete`, split OTP boxes | E1 | `inputmode`, `autocomplete`, one field (`moinput-mobile-forms-input-modes.md`) |
| 10 | **Keyboard covers the field or the submit** | C4 | `visualViewport`, `scroll-margin`, hide bottom bars on focus |
| 11 | **Squeezed tables**: 8 columns at 10 px, or page-level horizontal scroll | C1, F2 | Scroll region with sticky column, or stacked records (`mofound-tables-on-mobile.md`) |
| 12 | **Hover-only UI**: actions or tooltips that need a mouse | F3 | Visible under `hover: none`, tap to open (modern-web-guidance `user-experience/natural-interactions.md`) |
| 13 | **Orientation lock / "rotate your phone"** | C5 | Support both (`mofound-orientation-foldables.md`) |
| 14 | **Desktop-weight pages**: MB-scale JS, autoplay hero video, lazy LCP image | G1, G2 | Budgets and image priority (`moplat-low-end-performance.md`) |

## Anti-patterns (don't)
- Treating this list as exhaustive: dashboard-specific failures are in dashboard-ui `ref-dashboard-anti-patterns.md`.
- Fixing a symptom with a global override: `overflow-x: hidden` on `body` (hides content), `touch-action: none` on the page (kills scroll and zoom), `* { -webkit-tap-highlight-color: transparent }` with no pressed state (no feedback).

## Good references
- [web.dev: Accessible tap targets](https://web.dev/articles/accessible-tap-targets): sizes and spacing for item 4.
- [Google Search Central: Avoid intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials): the interstitial guidance behind item 6.
- [NN/g: Mobile UX study guide](https://www.nngroup.com/articles/mobile-ux-study-guide/): research-backed mobile usability articles.
- [WebKit: Designing websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/): the safe-area fix for item 3.
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units): the fix for item 2.
- [modern-web-guidance: Maximize content and reduce noise](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md): compact bars, no interruptions.

## Bad references
- [NN/g: Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/): evidence for item 5.
- [GOV.UK: why `type="number"` was dropped](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/): evidence for item 9.
- [NN/g: Mobile tables](https://www.nngroup.com/articles/mobile-tables/): evidence for items 11 and 13.
- [W3C: Understanding SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html): why item 1 is a failure.

## Accessibility
- Items 1, 4, 7, 10, 11 and 13 are WCAG 2.2 AA failures (1.4.4, 2.5.8, 2.5.1/2.5.7, 2.4.11, 1.4.10, 1.3.4), not just usability issues.

## Motion / interaction (if relevant)
- Watch for janky gestures on a mid-range Android: a swipe that lags the finger is a performance anti-pattern (item 14) even when the vitals pass.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| interstitial ceiling | < 15% of viewport, non-modal | consent and notices |
| persistent bars | < 25% of height combined | layout |
| target floor | 44px touch, 24px absolute | controls |
| input font | ≥ 16px | no zoom on focus |

## Implementation sketch
```ts
// Quick DOM scan for items 1, 2, 3 and 9. Run in the page (devtools console or a test).
export function scanMobileAntiPatterns(doc: Document = document): string[] {
  const out: string[] = []
  const vp = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]')?.content ?? ''
  if (/maximum-scale\s*=\s*1(\.0)?\b|user-scalable\s*=\s*(no|0)/i.test(vp)) out.push('1: zoom blocked in viewport meta')
  for (const el of doc.querySelectorAll<HTMLElement>('body *')) {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' && /cover/.test(vp)) {
      const r = el.getBoundingClientRect()
      const touchesBottom = Math.abs(r.bottom - window.innerHeight) < 2
      if (touchesBottom && parseFloat(cs.paddingBottom) < 1) out.push(`3: fixed bottom element without inset padding: ${el.tagName.toLowerCase()}.${el.className}`)
    }
  }
  for (const input of doc.querySelectorAll<HTMLInputElement>('input')) {
    if (input.type === 'number' && /code|otp|card|cc|zip|postal|phone|tel/i.test(`${input.name} ${input.id} ${input.autocomplete}`)) out.push(`9: type=number on ${input.name || input.id}`)
    if (parseFloat(getComputedStyle(input).fontSize) < 16) out.push(`1: input ${input.name || input.id} under 16px (iOS zooms on focus)`)
  }
  if (doc.documentElement.scrollWidth > doc.documentElement.clientWidth) out.push('11/C1: page scrolls horizontally')
  return out
}
```

## Checklist
- [ ] All 14 items checked on at least one primary screen per page type.
- [ ] Each failure is reported with the rubric ID, evidence (screenshot or selector) and the fix.
- [ ] No global-override "fixes" introduced.
- [ ] Rubric scored after the catalog pass.

## Sources
- https://web.dev/articles/accessible-tap-targets
- https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials
- https://www.nngroup.com/articles/mobile-ux-study-guide/
- https://www.nngroup.com/articles/hamburger-menus/
- https://www.nngroup.com/articles/mobile-tables/
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- https://web.dev/blog/viewport-units
- https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/content-first-noise-reduction.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/natural-interactions.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/ref-dashboard-anti-patterns.md
