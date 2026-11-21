# Motion and scroll on marketing pages

> Spend motion on one orchestrated moment (usually the hero load), keep any scroll reveals short (≤ 400–600ms, ≤ 16–24px, transform and opacity only) and progressive, never hijack the scroll, and make every piece of content visible without JavaScript or animation.

**Category:** Style (motion) · **Applies to:** hero entrance, section reveals, scroll-driven effects, parallax, sticky storytelling, autoplay video loops, animated backgrounds · **Priority:** must

## When to use / when not
- **Use** one hero entrance (headline, lead, CTA, media staggered, ≤ 700ms total), scroll-linked progress that explains something (a product assembling, a timeline filling), and motion that answers a click (open, expand, confirm).
- **Don't** add a fade-up to every section. Anthropic's frontend-design skill names per-section fade-and-slide entrances as the generic default. Scattered motion competes with the one moment that matters.
- **Skip motion entirely** on pages people use to decide (pricing, docs, comparison). NN/g found users mostly ignore or struggle with parallax effects on goal-driven tasks.
- Motion tokens and easing come from dashboard-ui (`motion-principles-and-tokens.md`); reduced-motion handling follows `motion-reduced-motion.md`.

## Rules (do)
- **One orchestrated moment.** Stagger 3–5 hero elements by 60–75ms each (300ms of stagger at most, motion-ui's cap in `mfound-choreography-and-stagger.md`), each 300–400ms, ease-out (`--mk-reveal-ease`). Total under 700ms so the CTA is usable within the first second.
- **Reveals, if any, are small and fast.** Distance 16px (`--mk-reveal-distance`), at most 24px; duration 400ms (`--mk-reveal-duration`), at most 600ms; finish by the time the element is 40% into the viewport (`animation-range: entry 0% entry 40%`). Play once; don't replay on scroll back (NN/g parallax advice).
- **Use CSS scroll-driven animations, not scroll listeners.** `animation-timeline: view()` and `scroll()` run off the main thread. Support: Chrome/Edge 115, Safari 26, Firefox 159 (enabled by default; web.dev's October 2026 roundup marks it Baseline newly available). Wrap in `@supports (animation-timeline: view())` so older browsers show static content.
- **Content visible at rest.** The default state is the final state. Never ship `opacity: 0` in base CSS that only JavaScript or an animation removes; if the script fails, the page is blank (Impeccable's `content-hidden-at-rest` check catches this). Use `animation-fill-mode: both` only inside the `@supports` and motion-preference guards.
- **Animate `transform`, `translate`, `scale`, `opacity` and `filter` only.** These skip layout, and transform changes do not count as layout shifts for CLS (web.dev). Never animate `top`, `height`, `margin` or `font-size` on scroll.
- **Protect INP.** No scroll or wheel handlers that run work on every event; no synchronous layout reads in `requestAnimationFrame` loops. INP must stay ≤ 200ms at p75 (web.dev).
- **Never scroll-jack.** Do not change scroll speed or direction or snap the page between "slides". NN/g (2023) found most test participants at least mildly disoriented, and some left or refreshed. Sticky storytelling is fine if native scroll still drives it at the normal rate.
- **Parallax limits:** background or peripheral images only, offset ≤ 10–20% of the element's height, never on text. Turn it off under reduced motion.
- **Autoplay video loops:** muted, `playsinline`, ≤ 5 seconds, or with a visible pause control (WCAG 2.2.2 requires a way to pause anything that moves for more than 5 seconds alongside other content). Pause when off screen and under reduced motion; show the poster frame instead.
- **Honour `prefers-reduced-motion: reduce`.** Remove translation, parallax, scroll-linked transforms and autoplay; a short opacity fade (≤ 150ms, motion-ui's `mfound-reduced-motion-vestibular.md`) may stay. WCAG 2.3.3 (AAA) asks that motion from interaction can be disabled; Val Head's A List Apart article lists scaling, spinning, parallax and large-area movement as vestibular triggers.

## Anti-patterns (don't)
- The same fade-up on every section and every card (`mkstyle-generated-default-tells.md`).
- Reveals of 800ms+ or 60px+ travel; content that arrives after the reader has scrolled past it.
- Hiding content with `opacity: 0` in base CSS and revealing it with IntersectionObserver.
- Scroll-snapped full-page "slides", horizontal scroll driven by vertical wheel, scroll speed changes.
- Animated gradient or WebGL canvases running while off screen.
- Bounce or elastic easing on entrances (Impeccable `bounce-easing`), auto-scrolling logo marquees with no pause (`marquee`).
- A hero entrance that delays the LCP element (`mkperf-lcp-and-hero-media.md`): the hero image or h1 must paint at once, not after a 1s fade.

## Good references
- [Chrome for Developers: scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) — `view()`/`scroll()`, ranges, and why they beat scroll listeners for jank.
- [WebKit: A guide to scroll-driven animations with just CSS](https://www.webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) — Safari 26 support and `view()` examples with `@supports` fallbacks.
- [Plausible](https://plausible.io) — no keyframe animations in its homepage markup (checked Nov 2026): content arrives at once and the page reads in one pass.
- [Are.na](https://www.are.na) — its markup carries 13 `prefers-reduced-motion` references against 10 `@keyframes` (checked Nov 2026): motion is gated per effect.
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — "a single orchestrated moment" over scattered effects (Apache-2.0; idea paraphrased).

## Bad references
- [Apple AirPods Pro scroll sequence, as rebuilt on CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/) — honest cost: a canvas pinned to the viewport redraws one of 148 frames per scroll step. Apple's page was measured at about 1 minute to load on slow 3G (author's 2020 test). It works for Apple because the product is the story and the budget is large; most pages have neither.
- [NN/g: Parallax scrolling](https://www.nngroup.com/articles/parallax-usability/) — documents an Apple page where a user scrolled past several near-blank screens before content appeared, and text that vanished before it could be read.
- [NN/g: Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) — disorientation, lost control and abandonment in testing.
- WebGL gradient heroes copied from Stripe (see the bram.us breakdown) that keep animating off screen; users report battery drain (anecdotal).

## Accessibility
- `prefers-reduced-motion: reduce` removes movement; content and order stay identical.
- WCAG 2.2.2: any loop longer than 5 seconds has a visible pause button reachable by keyboard.
- WCAG 2.3.1: nothing flashes more than 3 times per second.
- Content must be in the DOM and visible with CSS animations disabled and JavaScript off.

## Motion / interaction (if relevant)
- Hover on cards: change colour or border within `--mk-hover-duration` (150ms); no lift-and-shadow on every card.
- In-page anchor jumps use `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-reveal-distance` | 16px (max 24px) | reveal travel |
| `--mk-reveal-duration` | `var(--motion-dur-long)` 400ms (max 600ms) | reveal, hero element |
| `--mk-reveal-ease` | `var(--motion-ease-enter)` | entrances |
| `--mk-hover-duration` | `var(--motion-dur-short)` 150ms | hover feedback |
| Hero stagger | 60–75ms per element, ≤ 300ms of stagger, ≤ 700ms total | the one moment |
| Autoplay loop | ≤ 5s or a pause control | WCAG 2.2.2 |
| Parallax offset | ≤ 10–20% of element height | backgrounds only |

## Implementation sketch
```css
@media (prefers-reduced-motion: no-preference) {
  .mk-hero > * {
    animation: mk-hero-in var(--mk-reveal-duration) var(--mk-reveal-ease) both;
  }
  .mk-hero > :nth-child(2) { animation-delay: 80ms; }
  .mk-hero > :nth-child(3) { animation-delay: 160ms; }
  .mk-hero > :nth-child(4) { animation-delay: 240ms; }
  html { scroll-behavior: smooth; }
}
@keyframes mk-hero-in {
  from { opacity: 0; translate: 0 var(--mk-reveal-distance); }
  to { opacity: 1; translate: 0 0; }
}
.mk-hero > .mk-hero-media { animation: none; }
```
```ts
// Pause decorative autoplay loops off screen and under reduced motion.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-loop]'))

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const video = entry.target
    if (!(video instanceof HTMLVideoElement)) continue
    if (entry.isIntersecting && !reduce.matches) void video.play().catch(() => undefined)
    else video.pause()
  }
}, { threshold: 0.25 })

for (const video of videos) observer.observe(video)
reduce.addEventListener('change', () => { if (reduce.matches) videos.forEach((v) => v.pause()) })
```

## Checklist
- [ ] Only one entrance sequence exists (the hero), totalling ≤ 800ms; other sections render static or with the `.mk-reveal` utility.
- [ ] No reveal travels more than 24px or lasts more than 600ms.
- [ ] With JavaScript off and animations disabled, every section's text is visible.
- [ ] Keyframes animate only transform, translate, scale, opacity or filter.
- [ ] No wheel or scroll handler changes scroll speed or direction.
- [ ] Under `prefers-reduced-motion: reduce`, nothing translates and autoplay video is paused.
- [ ] Loops longer than 5s have a visible, keyboard-reachable pause control.

## Sources
- https://www.nngroup.com/articles/scrolljacking-101/
- https://www.nngroup.com/articles/parallax-usability/
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://www.webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/
- https://web.dev/blog/web-platform-10-2026 (Firefox 159, Baseline newly available)
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- https://web.dev/articles/animations-guide
- https://web.dev/articles/cls
- https://web.dev/articles/inp
- https://web.dev/articles/prefers-reduced-motion
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/
- https://github.com/anthropics/skills/tree/main/skills/frontend-design (Apache-2.0; ideas only)
- https://github.com/pbakaus/impeccable (Apache-2.0; rules `content-hidden-at-rest`, `bounce-easing`, `marquee`)
