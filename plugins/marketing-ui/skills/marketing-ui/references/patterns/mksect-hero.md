# The hero

> The first viewport says what the product is and who it is for in a 6–12 word headline, backs it with a one-sentence subhead, one primary and at most one secondary CTA, and shows the real product, not a stock photo or a carousel.

**Category:** Sections · **Applies to:** home page heroes, landing and campaign heroes, product and feature page heroes · **Priority:** must

## When to use / when not
- Every marketing page has exactly one hero, and it contains the page's only `<h1>`.
- A product-aware page (pricing, comparison, a retargeting landing page) can use a short hero: headline, price or offer, button. An unaware audience needs the problem named in the subhead (see `mkfound-page-narrative.md`).
- Don't use a full-viewport "mood" hero with no product, no claim and a scroll arrow. That is a brand film, not a hero.

## Rules (do)
- **Headline: what it is + for whom, 6–12 words.** Specificity beats cleverness: "Privacy-friendly Google Analytics alternative" tells a visitor more than "Analytics, reimagined". Test it by covering the logo: could a stranger say what the product does? Use `--mk-step-display` at `--mk-measure-headline` (18ch), so it wraps to 2–3 lines.
- **Subhead: one sentence, 15–30 words,** at `--mk-step-1` and `--mk-measure-lead` (52ch). It adds the how or the main differentiator, not a restatement. Stripe's subhead lists the concrete jobs (payments, banking, revenue models).
- **CTAs: one primary, at most one secondary.** The primary is the page goal ("Start free trial"). The secondary is a lower-commitment way to verify ("View live demo", "Take a 3-minute tour"), styled as outline or text. Put risk-reversal microcopy under them (see `mkfound-cta-and-conversion.md`).
- **Visual: the real product.** Use a real UI screenshot, a short muted loop of the product in use, or a live demo. NN/g's eyetracking found people ignore generic stock photos as filler but study images that carry information. In one test, users looked at real team photos about 10% longer than at the bios beside them, though the bios took 316% more space. Crop to the part that proves the headline. Don't shrink a whole dashboard to an unreadable thumbnail.
- **Abstract illustration or gradient only when** the product has no UI (infrastructure, an API) and the copy carries the claim. Then put proof (logos, numbers, a code sample) directly below.
- **First-viewport budget.** NN/g measured 57% of viewing time above the fold. These must all be fully visible without scrolling:
  - **360×640 (small Android):** about 560px is usable after browser chrome. Allow for a header (56px), a 2–3 line H1 at 40px (~130px), a 3–4 line subhead (~110px), the primary CTA (48px) and its microcopy, all at `--mk-gutter` (16px) sides. The product visual may start below the fold but should peek in.
  - **1440×900 (common laptop):** about 780px usable. Fit the headline, subhead, both CTAs and at least the top 40% of the product visual, plus a hint of the next section (avoid a false floor).
- **No carousels.** At Notre Dame, Erik Runyon measured that about 1% of visitors clicked a home page carousel feature, and 84% of those clicks went to the first slide. NN/g advises a single static hero and warns that auto-advancing content is often ignored as an ad. If stakeholders need several messages, make them sections.
- **Above-the-fold proof is optional but strong.** A row of 4–6 recognisable logos or one hard number under the CTAs (Stripe) answers "is this real?" before the scroll (see `mksect-social-proof.md`).
- **LCP: the hero media is usually the Largest Contentful Paint.** Aim for LCP ≤2.5 s at the 75th percentile (web.dev). Never lazy-load the hero image. Give it `fetchpriority="high"`, explicit `width` and `height`, and a poster for video. Details in `mkperf-lcp-and-hero-media.md`.

## Anti-patterns (don't)
- Slogan headlines with no noun ("Build the future, faster").
- Stock photos of people pointing at laptops, or 3D blobs standing in for a product that has a UI.
- Rotating carousels, auto-playing video with sound, and headline text typed out letter by letter.
- Three or more buttons in the hero, or two filled primaries.
- A 100vh hero that pushes the CTA below the fold at 360×640, or that leaves nothing peeking below at 1440×900.
- Text over a busy photo with no scrim, so contrast fails in parts of the image.
- Highlighting one word of the headline in a gradient (see `mkstyle-generated-default-tells.md`).

## Good references
- [Plausible](https://plausible.io) — H1 "Easy to use and privacy-friendly Google Analytics alternative" names the category, the audience's current tool and the differentiator. A real dashboard screenshot proves it, and the "View live demo" secondary lets visitors check.
- [Raycast](https://www.raycast.com) — "Your shortcut to everything" is short, but the subhead names the product type (an extendable launcher) and the primary CTA is precise: "Download for Mac", plus a Homebrew option for the target user.
- [Stripe](https://stripe.com) — the headline states the outcome (infrastructure to grow revenue), the subhead lists concrete jobs, "Get started" pairs with "Sign up with Google", and customer logos sit right below the CTAs.
- [Linear](https://linear.app) — the headline names the category and the audience ("product development system for teams and agents"), and the hero visual is a real issue view, not an illustration.
- [Basecamp](https://basecamp.com) — leads with a "Take a 3-minute tour" video as the verification path for a broad audience, with "Try Basecamp free" as the commitment.

## Bad references
- [Erik Runyon — Carousel interaction stats](https://erikrunyon.com/2013/01/carousel-interaction-stats/) — Notre Dame data: ~1% click rate on the ND.edu carousel, with 84% of clicks on slide 1.
- [NN/g — Designing effective carousels](https://www.nngroup.com/articles/designing-effective-carousels/) — people scroll past carousels and miss every frame after the first. Static heroes are recommended.
- [NN/g — Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/) — eyetracking shows generic stock photos are ignored as decoration.

## Accessibility
- The headline is the page's single `<h1>`. The eyebrow (if any) is a `<p>`, not a heading.
- Text over media meets 4.5:1 everywhere it can land. Use a solid or gradient scrim and test at 360px and 1440px crops.
- Decorative visuals take `alt=""`. A screenshot that makes a claim gets alt text that states the claim ("Dashboard showing visitors, sources and top pages for one site").
- Background video is muted, has no audio track to disable, and gets a visible pause button if it plays longer than 5 s (WCAG 2.2.2).
- CTAs follow `mkfound-accessibility-floor.md`: ≥44×44 px, visible focus.

## Motion / interaction (if relevant)
- One orchestrated entrance at most: the headline and visual fade in over `--mk-reveal-duration` (400ms) on load, and only under `prefers-reduced-motion: no-preference`. The headline must never wait for JS or an animation to become visible; that also delays LCP.
- Product loops: 6–15 s, muted, `playsinline`, no autoplay under reduced motion (show the poster). See `mkstyle-scroll-motion.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-step-display` | clamp(2.5rem, …, 4.5rem) | H1, 40px → 72px |
| `--mk-measure-headline` | 18ch | 2–3 line wrap |
| `--mk-step-1` / `--mk-measure-lead` | ~19–22px / 52ch | subhead |
| `--mk-cta-height` | 48px | primary and secondary |
| `--mk-media-radius` / `--mk-media-border` | 16px / 1px `--border` | screenshot frame |
| `--mk-container-wide` | 84rem | visual bleed width |
| Headline length | 6–12 words | opinion, specificity first |
| LCP | ≤2.5 s at p75 | web.dev "good" threshold |

## Implementation sketch
```html
<section class="hero mk-section" aria-labelledby="hero-h">
  <div class="mk-container hero__copy">
    <h1 id="hero-h" class="mk-display">Uptime monitoring for small SaaS teams</h1>
    <p class="mk-lead">Checks every 30 seconds from 12 regions and texts the on-call person before customers notice.</p>
    <div class="hero__ctas">
      <a class="mk-cta" href="/signup">Start free trial</a>
      <a class="mk-cta" data-variant="secondary" href="/demo">View live demo</a>
    </div>
    <p class="hero__note">14 days free · no credit card</p>
  </div>
  <img class="hero__shot" src="/img/dashboard-1600.avif" width="1600" height="1000"
       alt="Status dashboard: 14 monitors up, 1 degraded, response-time chart for the last 24 hours"
       fetchpriority="high" decoding="async">
</section>
```
```css
.hero { padding-block: clamp(32px, 2rem + 4vw, 96px) 0; text-align: center; }
.hero__copy { display: grid; justify-items: center; gap: var(--space-5, 24px); }
.hero__ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3, 12px); }
.hero__note { font-size: var(--mk-step--1); color: var(--text-muted); }
.hero__shot {
  display: block;
  inline-size: min(100% - 2 * var(--mk-gutter), var(--mk-container-wide));
  block-size: auto;
  margin: var(--mk-block-space) auto 0;
  border: var(--mk-media-border);
  border-radius: var(--mk-media-radius);
}
@media (prefers-reduced-motion: no-preference) {
  .hero__shot { animation: hero-in var(--mk-reveal-duration) var(--mk-reveal-ease) both; }
}
@keyframes hero-in { from { opacity: 0; translate: 0 var(--mk-reveal-distance); } to { opacity: 1; translate: 0 0; } }
```

## Checklist
- [ ] The H1 is 6–12 words and names what the product is and who it is for.
- [ ] At 360×640 the H1, subhead and primary CTA are fully visible without scrolling.
- [ ] At 1440×900 the CTAs and the top of the product visual are visible, and the next section peeks in.
- [ ] There is one primary CTA and at most one secondary in the hero.
- [ ] The visual is a real product image, video or demo, with alt text stating its claim.
- [ ] No carousel, no auto-advancing content, no autoplay with sound.
- [ ] The hero image is not lazy-loaded, has `fetchpriority="high"` and dimensions, and LCP ≤2.5 s at p75.

## Sources
- https://www.nngroup.com/articles/scrolling-and-attention/ (57% above the fold, 2018)
- https://www.nngroup.com/articles/photos-as-web-content/ (stock photos ignored; 10% vs 316%)
- https://www.nngroup.com/articles/designing-effective-carousels/
- https://erikrunyon.com/2013/01/carousel-interaction-stats/
- https://www.nngroup.com/articles/illusion-of-completeness/
- https://web.dev/articles/lcp (2.5 s at p75)
- https://almanac.httparchive.org/en/2024/performance (lazy-loading should not be used on LCP elements; 16% of mobile pages with an image LCP lazy-load it, 9.5% with `loading="lazy"`)
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://plausible.io · https://www.raycast.com · https://stripe.com · https://linear.app · https://basecamp.com (hero copy checked November 2026)
