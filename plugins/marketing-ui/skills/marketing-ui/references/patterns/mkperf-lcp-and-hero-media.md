# LCP and hero media

> The hero's largest element must paint within 2.5 s at the 75th percentile on mobile, so the LCP image is discoverable in the HTML, eagerly loaded with `fetchpriority="high"`, sized to its slot in a modern format, and reserved with width and height so nothing shifts.

**Category:** Performance · **Applies to:** hero images, hero video posters, product screenshots above the fold, full-bleed banners · **Priority:** must

## When to use / when not
- Use on every landing, pricing and product page. The first screen is where the visitor decides to stay, and Google uses Core Web Vitals in its page experience signals.
- The rules apply to whatever element becomes the LCP candidate: usually the hero image or poster, sometimes the h1 text block. A text-only hero (see `mksect-hero.md`) is the cheapest LCP of all. If the hero is text, the font rules in `mkperf-web-fonts.md` become the LCP rules.
- Not for below-the-fold media. Those images should be lazy-loaded, and the advice here would waste bandwidth on them.

## Rules (do)
- **Targets (p75 of real visits, mobile and desktop separately):** LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms. "Needs improvement" runs to 4 s, 0.25 and 500 ms. Judge by field data (CrUX or your own RUM), not a single Lighthouse run.
- **Know where the time goes.** web.dev splits LCP into 4 subparts with rough targets: TTFB ~40%, resource load delay <10%, resource load duration ~40%, element render delay <10%. The two delays should be close to zero. If load delay is large, the image is discovered late. If render delay is large, something (a font, a script, a fade-in) blocks the paint.
- **Discoverable in HTML.** Put the hero as an `<img>` (or `<picture>`) in the server HTML. A CSS `background-image` or a client-rendered component is found late. If you cannot avoid that, add `<link rel="preload" as="image" fetchpriority="high">` with `imagesrcset` and `imagesizes` in the head.
- **`fetchpriority="high"` on the one LCP image,** at most 1–2 images per page. Prefer it over preload when the `<img>` is already in the HTML: it changes priority without adding a second fetch path.
- **Never lazy-load the LCP image.** No `loading="lazy"`, no JS lazy library, no `data-src` swap. Leave the default (`loading="eager"`) and add `decoding="async"` only if you have measured it.
- **Responsive formats:** `<picture>` with AVIF, then WebP, then a JPEG fallback in `<img>`. Give `srcset` with 3–5 widths (e.g. 640, 960, 1280, 1920, 2560) and an honest `sizes` that matches the CSS slot. A missing or wrong `sizes` makes mobile download the desktop file.
- **Reserve the box:** `width` and `height` attributes on every `<img>` (the browser derives `aspect-ratio`), or `aspect-ratio` in CSS for art-directed crops. Each `<source>` in `<picture>` can carry its own `width`/`height` when crops differ.
- **Byte budgets for the hero:** ≤ 150 KB for the LCP image at mobile size (390–430 CSS px at 2–3x DPR), ≤ 250 KB at desktop width. AVIF at quality 50–60 usually lands well under these. Total image weight above the fold ≤ 300 KB on mobile.
- **No entry animation on the LCP element.** An opacity fade from 0 delays the paint that counts. Animate secondary elements instead (see `mkstyle-scroll-motion.md`).
- **Hero video:** the poster is the LCP candidate (Chrome counts the poster load or the first frame, whichever is earlier). Give the poster the same treatment as a hero image: a small AVIF/WebP, preloaded with `fetchpriority="high"`. Use `muted autoplay loop playsinline`, `preload="none"` or `"metadata"`, and keep the clip ≤ 1–2 MB, 6–15 s, 720p, H.264 plus AV1 or VP9, no audio track. Provide a visible pause button (WCAG 2.2.2).
- **Use an image CDN** (Cloudinary, imgix, Cloudflare Images, Vercel/Next.js Image, Netlify Image CDN) to generate widths and formats, or a build step (Sharp, Squoosh). Serve from the same origin or `preconnect` to the CDN host so TTFB of the image does not add a new connection.

## Anti-patterns (don't)
- `loading="lazy"` on the hero. The Web Almanac 2024 found it on 16% of mobile pages' LCP images (9.5% native, 6.7% via JS).
- A 2–4 MB JPEG exported straight from the design tool. JPEG and PNG still make up 87% of LCP images; AVIF is 0.3%.
- `fetchpriority="high"` on every image, which cancels the hint.
- Hero sliders where slide 1 is the LCP and slides 2–5 compete for bandwidth (see `mkref-anti-patterns-gallery.md`).
- A full-screen MP4 with no poster, or a poster of 800 KB.
- Images without dimensions. 66% of mobile pages have at least one unsized image.
- Client-side rendered heroes that wait for a JS bundle before the `<img>` exists.

## Good references
- [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) — the 4 subparts, the target split, and the plain rule that the LCP image should never be lazy-loaded.
- [web.dev — Fetch Priority](https://web.dev/articles/fetch-priority) — how `fetchpriority` changes image priority and when preload is still needed.
- [Stripe](https://stripe.com) — a single static hero message rendered as HTML text with the CTA in the first viewport, so the LCP does not wait for a carousel or a video.
- [Next.js Image `priority`/`preload`](https://nextjs.org/docs/app/api-reference/components/image) — a framework that emits `srcset`, `sizes` and width/height by default and makes the LCP flag explicit.

## Bad references
- [Web Almanac 2024 — Performance](https://almanac.httparchive.org/en/2024/performance) — documents the field: only 59% of mobile origins pass LCP, 43% pass all three vitals, and 16% of pages lazy-load the image that is their LCP.
- [Web Almanac 2024 — Media](https://almanac.httparchive.org/en/2024/media) — only 32% of `<img>` elements carry both `width` and `height`, and only 3% of `<video>` elements set a `poster`.
- Generic agency template: an autoplaying 1080p MP4 background with no poster, a fade-in h1 and a cookie banner on top. All three add to LCP render delay.

## Accessibility
- Every hero image has an `alt` that says what it shows, or `alt=""` if decorative. Text baked into images is not readable and does not reflow (WCAG 1.4.5).
- Video that moves for more than 5 s needs a pause control (WCAG 2.2.2). Under `prefers-reduced-motion: reduce`, show the poster and do not autoplay.
- Never put the h1 inside the image. It must be live text (see `mkperf-seo-headings-and-metadata.md`).

## Motion / interaction (if relevant)
- The LCP element appears at full opacity on first paint. Secondary hero elements may reveal over `--motion-dur-long` (400 ms) after first paint, never before.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| LCP / CLS / INP (p75) | ≤ 2.5 s / ≤ 0.1 / ≤ 200 ms | pass thresholds |
| `--mk-media-radius` | `var(--radius-xl, 16px)` | hero media corners |
| `--mk-media-border` | `1px solid var(--border)` | screenshot frame |
| `--mk-container-wide` | 84rem | max width of full-bleed media; largest `srcset` width ≈ 2× this |
| LCP image budget | ≤ 150 KB mobile, ≤ 250 KB desktop | AVIF q50–60 |
| Hero video budget | ≤ 1–2 MB, 6–15 s, 720p, muted | poster ≤ 60 KB |
| `fetchpriority="high"` | 1 image (max 2) | the LCP candidate |

## Implementation sketch
```html
<section class="mk-section hero">
  <h1 class="mk-display">Close the books in two days, not ten</h1>
  <picture class="hero__media">
    <source type="image/avif" srcset="/hero-640.avif 640w, /hero-1280.avif 1280w, /hero-1920.avif 1920w"
            sizes="(min-width: 84rem) 84rem, 100vw">
    <source type="image/webp" srcset="/hero-640.webp 640w, /hero-1280.webp 1280w, /hero-1920.webp 1920w"
            sizes="(min-width: 84rem) 84rem, 100vw">
    <img src="/hero-1280.jpg" width="1920" height="1080" alt="Reconciliation view with three accounts matched"
         fetchpriority="high" loading="eager">
  </picture>
</section>
<!-- Video hero: the poster is the LCP; preload it -->
<link rel="preload" as="image" href="/hero-poster.avif" type="image/avif" fetchpriority="high">
<video class="hero__video" muted autoplay loop playsinline preload="none" width="1280" height="720"
       poster="/hero-poster.avif" aria-label="Product walkthrough">
  <source src="/hero.av1.mp4" type="video/mp4; codecs=av01.0.05M.08">
  <source src="/hero.h264.mp4" type="video/mp4">
</video>
```
```css
.hero__media img,
.hero__video {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--mk-media-radius);
  border: var(--mk-media-border);
  background: var(--surface-2);
}
@media (prefers-reduced-motion: reduce) {
  .hero__video { display: none; }
}
```
```ts
import { onCLS, onINP, onLCP } from 'web-vitals/attribution';
import type { CLSMetricWithAttribution, INPMetricWithAttribution, LCPMetricWithAttribution } from 'web-vitals/attribution';

type VitalReport = { name: string; value: number; rating: string; detail: Record<string, number | string> };

function send(report: VitalReport): void {
  const body = JSON.stringify(report);
  if (!navigator.sendBeacon('/rum', body)) void fetch('/rum', { method: 'POST', body, keepalive: true });
}

onLCP((m: LCPMetricWithAttribution) => {
  const a = m.attribution;
  send({ name: m.name, value: m.value, rating: m.rating, detail: {
    element: a.target ?? 'unknown', url: a.url ?? '', ttfb: a.timeToFirstByte,
    loadDelay: a.resourceLoadDelay, loadDuration: a.resourceLoadDuration, renderDelay: a.elementRenderDelay,
  } });
});
onCLS((m: CLSMetricWithAttribution) => {
  send({ name: m.name, value: m.value, rating: m.rating, detail: { shifted: m.attribution.largestShiftTarget ?? 'none' } });
});
onINP((m: INPMetricWithAttribution) => {
  send({ name: m.name, value: m.value, rating: m.rating, detail: { target: m.attribution.interactionTarget } });
});
```

## Checklist
- [ ] Field LCP ≤ 2.5 s, CLS ≤ 0.1 and INP ≤ 200 ms at p75 on mobile (CrUX or RUM), not only in Lighthouse.
- [ ] The LCP element is in the server HTML, has `fetchpriority="high"` and no `loading="lazy"`.
- [ ] No more than 2 elements on the page carry `fetchpriority="high"`.
- [ ] The hero image ships AVIF or WebP with a `srcset` of 3+ widths and a `sizes` that matches the CSS slot.
- [ ] Every above-the-fold `<img>` and `<video>` has `width` and `height` or a CSS `aspect-ratio`.
- [ ] The LCP image is ≤ 150 KB on mobile; a hero video is ≤ 2 MB, muted, `playsinline`, has a poster and a pause control.
- [ ] Resource load delay and render delay are each under 10% of LCP in the attribution data.

## Sources
- https://web.dev/articles/vitals
- https://web.dev/articles/lcp (video: poster load or first frame, whichever is earlier)
- https://web.dev/articles/optimize-lcp
- https://web.dev/articles/fetch-priority
- https://web.dev/articles/optimize-cls
- https://almanac.httparchive.org/en/2024/performance (59% mobile / 72–74% desktop good LCP; 43% / 54% pass all three; 73% of mobile LCPs are images; 16% lazy-load LCP; 15% use `fetchpriority=high`; 66% have unsized images; JPG 61%, PNG 26%, WebP 7%, AVIF 0.3%)
- https://almanac.httparchive.org/en/2024/media (68% of LCP elements are images; median largest image 135 KB; 42% use `srcset`; 9.3% `<picture>`; video: 23% autoplay, 3% poster)
- https://almanac.httparchive.org/en/2024/page-weight (median image bytes per home page: 900 KB mobile, 1,054 KB desktop)
- https://developer.chrome.com/blog/autoplay (muted autoplay is always allowed)
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://github.com/GoogleChrome/web-vitals (v5 attribution build)
- https://nextjs.org/docs/app/api-reference/components/image
