# Scroll-driven animations

> Link animation to scroll only for progress and context (a reading-progress bar, a header that condenses, an edge fade under sticky chrome, a gentle reveal as content enters), with CSS `animation-timeline: scroll()` or `view()` on `transform` and `opacity`, inside `@supports` and `prefers-reduced-motion: no-preference`; never scroll-jack, never move content at a different speed from the scroll in a working screen.

**Category:** Transitions · **Applies to:** reading progress, sticky headers, scroll-edge fades, table-of-contents highlights, image galleries, marketing sections · **Priority:** nice

## When to use / when not
Use when the scroll position itself is the information (how far through, which section) or when chrome needs to adapt to what's under it. Don't use it to make content appear late: in an app, content that is in the viewport should simply be there. Parallax and scroll-linked zooms are vestibular triggers (`mfound-reduced-motion-vestibular.md`); keep them out of product UI entirely.

## Rules (do)
- **Know the support.** Scroll-driven animations are Baseline newly available since October 2026 (Chrome 115, Safari 26, Firefox 159). Wrap them in `@supports (animation-timeline: scroll())` and make the static version complete.
- **CSS first.** `animation-timeline: scroll()` (progress of a scroller) and `view()` (an element's progress through the viewport), with `animation-range` to pick the window (`entry 0% cover 30%`). Chrome's guidance: these can run off the main thread when they animate composited properties such as `transform` and `opacity`; animating `width` or `top` brings them back onto the main thread.
- **`animation-duration: auto`** (or leave it out) for scroll timelines; time-based durations don't apply.
- **`animation-fill-mode: both`** and linear timing, so the effect maps directly to scroll position.
- **Good uses.**
  - Reading progress: a `scaleX` bar on `scroll(root)`.
  - Condensing header: shrink padding with `translate`/`scale` over the first 0–120 px of scroll.
  - Scroll-edge fade: a mask or shadow under a sticky bar that appears only once content passes under it (Apple's Liquid Glass "scroll edge effect" idea, without the glass).
  - Gentle reveal: opacity 0.4 → 1 and ≤ 16 px travel over `entry 0% entry 60%`, for long-form or marketing pages only.
- **Never hide content until scrolled.** A reveal starts from a visible state (opacity ≥ 0.4), so fast scrolling, find-in-page and screenshots don't show blank sections.
- **No scroll-jacking.** Never take over the wheel or touch scroll to drive a sequence; the user's scroll speed and direction must map 1:1 to the page.

## Anti-patterns (don't)
- Parallax backgrounds in app screens.
- Content that starts at `opacity: 0` and only appears when scrolled into view (blank on fast scroll, in print and for find-in-page).
- JS `scroll` listeners writing styles every event when CSS can do it.
- Scroll-linked animations on `height`, `top` or `filter: blur()` of large areas.
- Pinned, scroll-jacked "story" sections inside a product.

## Good references
- [Chrome for Developers, scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations): timelines, ranges, off-main-thread behaviour, demos.
- [scroll-driven-animations.style](https://scroll-driven-animations.style/) (Bramus): range visualiser and patterns such as progress bars and condensing headers.
- [MDN, `animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) and [`animation-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range).
- [webstatus.dev, scroll-driven animations](https://webstatus.dev/features/scroll-driven-animations): Baseline date and versions.
- [Apple, Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass): scroll-edge effect keeps controls legible over moving content.

## Bad references
- Scroll-jacked product launch pages that pin the viewport and scrub a video with the wheel: users lose control of scroll speed and position.
- Blog templates that fade every paragraph in from `opacity: 0` on scroll, so skimming shows empty space.

## Accessibility
- Wrap movement in `prefers-reduced-motion: no-preference`; under `reduce`, progress indicators can still update (they're not motion of content), reveals are removed.
- WCAG 2.3.3: scroll-linked parallax is "usually non-essential" motion from interaction; remove it under reduced motion, or better, don't add it.

## Motion / interaction (if relevant)
Scroll-driven animations follow the scroll exactly, so there's nothing to interrupt; they must never add inertia or lag of their own.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| reveal start opacity | ≥ 0.4 | never fully hidden |
| reveal travel | ≤ 16 px | long-form pages only |
| reveal range | `entry 0% entry 60%` | |
| header condense range | 0–120 px of scroll | |
| progress bar | `scaleX` 0 → 1 on `scroll(root)` | |

## Implementation sketch
```css
.progress {
  position: fixed; inset: 0 0 auto; block-size: 3px;
  background: var(--accent, AccentColor);
  transform-origin: left;
  scale: 0 1;
}

@supports (animation-timeline: scroll()) {
  .progress { animation: grow-x linear both; animation-timeline: scroll(root block); }

  .app-header {
    animation: edge-shadow linear both;
    animation-timeline: scroll(root block);
    animation-range: 0px 120px;
  }

  @media (prefers-reduced-motion: no-preference) {
    .article > section {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
  }
}
@keyframes grow-x { to { scale: 1 1; } }
@keyframes edge-shadow { from { box-shadow: 0 0 0 transparent; } to { box-shadow: 0 1px 0 rgb(0 0 0 / 0.08), 0 6px 16px rgb(0 0 0 / 0.06); } }
@keyframes reveal { from { opacity: 0.4; translate: 0 16px; } to { opacity: 1; translate: 0 0; } }
```
Without support, the progress bar stays at `scale: 0 1` (invisible), the header keeps its static style and sections are fully visible, which is a complete page.

## Checklist
- [ ] Every scroll-driven effect shows progress or context, not decoration.
- [ ] Inside `@supports`; the static page is complete without it.
- [ ] Only `transform`/`opacity` (and cheap paint like a small shadow) are animated.
- [ ] Nothing starts fully hidden; reveal starts at ≥ 0.4 opacity.
- [ ] No parallax, no scroll-jacking; movement wrapped in reduced-motion `no-preference`.

## Sources
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://scroll-driven-animations.style/
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range
- https://webstatus.dev/features/scroll-driven-animations
- https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
