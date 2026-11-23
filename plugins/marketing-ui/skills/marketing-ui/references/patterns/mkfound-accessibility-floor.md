# Accessibility floor for marketing pages

> Every marketing page ships with landmarks, one h1 and no skipped heading levels, a skip link, a `lang` attribute, real alt text, pausable motion, captioned video, 4.5:1 text contrast measured on the worst pixel behind it, focus that is visible and never hidden by sticky bars, and targets of at least 24×24 px.

**Category:** Foundations · **Applies to:** every landing page, home page, product page, pricing page and campaign microsite · **Priority:** must

## When to use / when not
- Always. This is the floor, not a feature. It costs almost nothing when built in and a lot when retrofitted.
- The WebAIM Million 2026 (February 2026 crawl of the top 1,000,000 home pages) found detectable WCAG failures on **95.9%** of pages, averaging **56.1 errors per page**, up from 94.8% and 51 errors per page in 2025. Automated tools catch only part of the real problems, so the true failure rate is higher.
- Top failure types in 2026, by share of home pages: low-contrast text **83.9%**, missing image alt **53.1%**, missing form labels **51.0%**, empty links **46.3%**, empty buttons **30.6%**, missing document language **13.5%**. Skipped heading levels appeared on **41.8%**, and only **46.1%** had a `<main>` landmark. Every one of these is a marketing-page habit: hero text on photos, icon-only social links, a newsletter field with a placeholder instead of a label.
- **Law:** the European Accessibility Act (Directive (EU) 2019/882) has applied since **28 June 2025**. It covers e-commerce and many consumer services sold into the EU, including the path to purchase on marketing sites, with EN 301 549 as the route to presumed conformity (V3.2.1 embeds WCAG 2.1 AA; V4.1.1, published 2 September 2026, moves to WCAG 2.2 AA; check which version the Official Journal cites). Microenterprises providing services are exempt. In the US, ADA lawsuits commonly cite WCAG 2.1/2.2 AA. Target **WCAG 2.2 AA**. Dates and scope per regime: accessibility plugin `alaw-legal-landscape.md`.

## Rules (do)
- **Language:** `<html lang="en">` (SC 3.1.1). Mark passages in another language with `lang` on the element (SC 3.1.2).
- **Landmarks:** one `<header>`, one `<nav aria-label="Main">`, one `<main id="main">`, one `<footer>` (`mksect-footer.md`). Additional `<nav>` elements get distinct labels ("Footer").
- **Headings:** exactly one `<h1>` (the hero headline). Each section starts with an `<h2>`; tiles and cards inside use `<h3>`. Never skip a level for visual size: style the right level with a size token instead. See `mkperf-seo-headings-and-metadata.md`.
- **Skip link:** the first focusable element is "Skip to main content", pointing at `#main`, visible on focus (SC 2.4.1).
- **Alt text for product screenshots:**
  - A meaningful screenshot gets alt that states what it proves, in 5–20 words ("Dashboard showing deploy time dropping from 14 to 3 minutes"). Don't list every pixel or start with "Image of".
  - A decorative image (background blob, texture, repeated hero art) gets `alt=""` or goes into CSS.
  - Text baked into an image is repeated in alt, or better, kept as live text.
  - Logos: alt is the company name.
- **Video:**
  - Autoplay only muted, and only background video with no essential information.
  - Any motion that starts automatically, lasts more than **5 seconds** and sits beside other content needs a visible pause or stop control (SC 2.2.2, Level A). That includes background video, marquees, Lottie loops and carousels.
  - Audio that plays for more than 3 seconds needs a stop or volume control (SC 1.4.2). Better: never autoplay sound.
  - Product videos with speech have captions (SC 1.2.2), authored not auto-generated, and a transcript link. Demo videos that show UI changes without narration need audio description or a text equivalent (SC 1.2.5).
- **Contrast:** body text 4.5:1, large text (24px, or 18.66px bold) 3:1, UI boundaries and focus indicators 3:1 (SC 1.4.3, 1.4.11). For **text over images, video or gradients, measure against the worst pixel** behind the glyphs, at every breakpoint and across every video frame. W3C's guidance is to test the area where contrast is lowest. Add a scrim (a solid or gradient overlay of at least 50–60% opacity) rather than hoping.
- **Focus visible and not obscured:** every interactive element shows a focus ring of at least 2px at 3:1. A sticky header or cookie banner must not completely cover the focused element (SC 2.4.11, AA, new in 2.2). Set `scroll-padding-top` to the sticky header height plus 8px.
- **Target size:** at least **24×24 CSS px** for every control, or 24px spacing (SC 2.5.8). Marketing CTAs use 48px (`--mk-cta-height`). Inline text links are exempt.
- **Link text:** names the destination ("Read the Acme case study"), not "Learn more" or "Click here" (SC 2.4.4). Repeated "Learn more" links get visually hidden context. Icon-only links (social icons) need an accessible name.
- **Forms:** newsletter and demo-request fields have visible `<label>`s. A placeholder is not a label.
- **Reduced motion:** wrap all non-essential motion in `@media (prefers-reduced-motion: no-preference)`. Parallax, scroll-jacking and large zooms are vestibular triggers (SC 2.3.3 Animation from Interactions, Level AAA, so best practice rather than AA). See `mkstyle-scroll-motion.md`.

## Anti-patterns (don't)
- Two `<h1>`s because the logo and the hero both use one (18.1% of home pages in WebAIM 2026 have more than one h1).
- White hero text on a photo, checked only against the dark part of the image.
- A full-bleed background video with no pause button.
- `outline: none` on links and buttons with no replacement.
- A sticky header plus a cookie bar covering the focused link at the bottom of the viewport.
- Social icons in the footer as empty links: the "empty links" failure on 46.3% of pages.
- Text in images (feature lists, price cards exported from the design tool as PNG).

## Good references
- [GOV.UK](https://www.gov.uk) — skip link as the first focus stop, one h1, landmarks and a high-visibility yellow focus style that survives on any background.
- [Stripe](https://stripe.com) — product visuals built as live HTML and SVG rather than flat images, so text stays real text.
- [WebAIM Million 2026](https://webaim.org/projects/million/) — the annual baseline: what fails on real home pages, and how often.
- [W3C: Understanding SC 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — the sticky-header failure, with the `scroll-padding` fix.

## Bad references
- [WebAIM Million 2026](https://webaim.org/projects/million/) — also the gallery of what goes wrong: 83.9% low contrast, 53.1% missing alt, 41.8% skipped heading levels.
- Generic hero templates with autoplaying full-screen video and white text, no scrim and no pause control (common in page-builder themes): they fail SC 2.2.2 and usually SC 1.4.3. See `mkref-anti-patterns-gallery.md`.

## Accessibility
- This file is the accessibility baseline the other marketing patterns refer to. Test with: keyboard only (Tab, Shift+Tab, Enter, Space); a screen reader (VoiceOver or NVDA) heading and landmark lists; 200% and 400% zoom (SC 1.4.4, 1.4.10 reflow at 320 CSS px); forced-colors mode; and `prefers-reduced-motion: reduce`. Run axe or WAVE for the automatable part, which covers only part of WCAG.

## Motion / interaction (if relevant)
- Default stance: content is visible without motion. Reveal animations must never hide content when JS fails or motion is reduced. Background video: under reduced motion, show the poster frame and no video.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Text contrast | ≥4.5:1 (large ≥3:1) | SC 1.4.3, worst pixel |
| Non-text contrast | ≥3:1 | focus rings, input borders, icons |
| `--focus-ring` | 2px solid, offset 2–3px | `.mk-cta` uses 3px offset |
| Target size | ≥24×24 px floor; `--mk-cta-height` 48px | SC 2.5.8 |
| Auto-motion limit | 5s, then pause control required | SC 2.2.2 |
| `--mk-sticky-offset` (new, shared with pricing) | sticky header height, e.g. 64px | `scroll-padding-top` |
| Scrim | ≥50–60% opacity of `--canvas` (inverse band) | text over media |

## Implementation sketch
```html
<html lang="en">
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header"><nav aria-label="Main"><a href="/pricing">Pricing</a></nav></header>
  <main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="hero-h">
      <video class="hero__video" autoplay muted loop playsinline poster="/hero.avif" aria-hidden="true"><source src="/hero.mp4" type="video/mp4"></video>
      <button type="button" class="hero__pause" aria-pressed="false">Pause background video</button>
      <h1 id="hero-h">Ship previews for every pull request</h1>
    </section>
  </main>
  <footer><a href="https://github.com/acme" aria-label="Acme on GitHub"><svg aria-hidden="true" width="24" height="24"></svg></a></footer>
</body>
</html>
```
```css
:root { --mk-sticky-offset: 64px; scroll-padding-block-start: calc(var(--mk-sticky-offset) + 8px); }
.skip-link { position: absolute; inset-block-start: -100px; inset-inline-start: 8px; padding: 12px 16px; background: var(--surface); color: var(--text); z-index: 100; }
.skip-link:focus { inset-block-start: 8px; }
.site-header { position: sticky; inset-block-start: 0; block-size: var(--mk-sticky-offset); background: var(--canvas); }
:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.hero { position: relative; isolation: isolate; }
.hero::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(to top, oklch(0.18 0.006 250 / 0.72), oklch(0.18 0.006 250 / 0.5)); }
.hero__video { position: absolute; inset: 0; z-index: -2; inline-size: 100%; block-size: 100%; object-fit: cover; }
.hero__pause { min-block-size: 44px; min-inline-size: 44px; }
@media (prefers-reduced-motion: reduce) { .hero__video { display: none; } }
```
```ts
function wirePause(video: HTMLVideoElement, button: HTMLButtonElement): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) video.pause();
  button.addEventListener('click', () => {
    const paused = !video.paused;
    if (paused) video.pause(); else void video.play();
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Play background video' : 'Pause background video';
  });
}
```

## Checklist
- [ ] `<html lang>` is set; the page has header, nav, main and footer landmarks and a working skip link.
- [ ] Exactly one h1, and the heading outline skips no levels.
- [ ] Every meaningful image has descriptive alt, decorative ones have `alt=""`, and no icon-only link or button lacks a name.
- [ ] Any auto-starting motion longer than 5 s has a visible pause control and stops under reduced motion; videos with speech have captions.
- [ ] Text over images, video or gradients reaches 4.5:1 at its worst pixel at 375px and 1440px.
- [ ] Tabbing through the page never hides the focused element behind a sticky header or banner, and every focus ring is visible.
- [ ] All targets measure at least 24×24 px; CTAs are 48px tall.
- [ ] axe or WAVE reports zero errors, and a manual keyboard and screen-reader pass is done.

## Sources
- https://webaim.org/projects/million/ (2026 edition, February 2026 data)
- https://webaim.org/projects/million/2025 (2025 comparison: 94.8%, 51 errors per page)
- https://eur-lex.europa.eu/eli/dir/2019/882/oj (European Accessibility Act)
- https://www.ccpc.ie/business/?p=51685 (microenterprise guidance)
- https://www.twobirds.com/en/insights/2025/a-guide-to-navigating-the-european-accessibility-act-for-online-retailers-service-providers-and-plat
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html
- https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/tutorials/images/decision-tree/
