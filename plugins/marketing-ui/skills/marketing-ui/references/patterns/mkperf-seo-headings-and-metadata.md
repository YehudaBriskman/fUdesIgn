# SEO structure: headings and metadata

> Every marketing page has one descriptive h1 that matches its `<title>`, a heading outline that reads as a table of contents, a unique title and description, a canonical URL, complete Open Graph and Twitter tags with a 1200×630 image, and only the structured data Google still uses.

**Category:** Performance and discoverability · **Applies to:** `<head>` metadata, headings, landing pages, pricing, product and localized pages, share previews · **Priority:** must

## When to use / when not
- Use on every indexable page: home, product, pricing, feature, comparison, customer story and localized variants.
- For pages that should not rank (thank-you pages, campaign duplicates, staging), use `noindex` rather than skipping metadata; share previews still need OG tags.
- This file is about structure and metadata. Speed signals live in `mkperf-lcp-and-hero-media.md` and `mkperf-web-fonts.md`; the narrative that the headings express lives in `mkfound-page-narrative.md`.

## Rules (do)
- **One h1, live text, descriptive.** It names what the product does for whom ("Payroll for remote teams in 40 countries"), not a slogan alone. Google may build the title link from the h1 when the `<title>` is weak, so they should agree. Google says it does not penalise several h1s; one h1 is the rule here for clarity and screen readers.
- **Heading outline:** h2 per section, h3 inside sections, no skipped levels. Google says heading order does not change ranking, but screen reader users navigate by headings, and the outline doubles as your page's table of contents. Never pick a heading level for its size; style with classes (`.mk-h2`).
- **`<title>`:** unique per page, about 50–60 characters (Google truncates to fit the device width; SEO tools measure roughly 580–600 px on desktop, so pixels, not characters, decide). Lead with the specific topic, then the brand after a separator: `Payroll for remote teams | Acme`. No keyword lists, no "Home".
- **Meta description:** unique, 1–2 sentences of about 140–160 characters, specific (price, audience, proof). Google has no length limit and often writes its own snippet from page text: an Ahrefs study of 20,000 keywords found Google showed a rewrite about 63% of the time (vendor study, 2020). Write one anyway; it is still the default for shares and some queries.
- **Canonical:** a self-referencing absolute `<link rel="canonical">` on every page; campaign URLs with `?utm_` parameters point to the clean URL. One canonical per page, in the `<head>`.
- **Open Graph:** `og:title`, `og:description`, `og:url`, `og:type` (`website`), `og:site_name`, `og:image`, `og:image:width`, `og:image:height` and `og:image:alt`. Meta's sharing docs recommend 1200×630 px (about 1.91:1), a minimum of 600×315 for the large card, and a hard limit of 8 MB. Aim for ≤ 300 KB (PNG for UI and text, JPEG/WebP for photos) so crawlers fetch it fast. Keep text inside a centred safe area of about 1000×520 px, because some apps crop the edges.
- **Twitter/X:** `twitter:card` = `summary_large_image`; X falls back to `og:*` for title, description and image, so add `twitter:*` only where they differ. Third-party guides give a 5 MB image limit for X; the official page was not checked here.
- **Changing a share image?** Use a new URL. Crawlers cache by URL.
- **Structured data (JSON-LD):** `Organization` on the home page (name, url, logo, sameAs). `SoftwareApplication` only if you can supply its required fields (`name`, `offers.price`, and `aggregateRating` or `review` that are real and visible). `BreadcrumbList` on deep pages. Do not add `FAQPage` for a rich result: since August 2023 Google showed it only for well-known government and health sites, and in 2026 Google retired FAQ rich results entirely. The markup is harmless if the Q&A is visible, but it earns no snippet.
- **Robots:** default is index, follow; set `noindex` per page with `<meta name="robots">`. `robots.txt` only blocks crawling, not indexing. Don't block CSS or JS that rendering needs.
- **Sitemap:** XML, absolute canonical URLs only, ≤ 50,000 URLs or 50 MB uncompressed per file, accurate `lastmod`. Google ignores `priority` and `changefreq`.
- **hreflang** for localized marketing sites: every variant lists itself and every other variant with absolute URLs (return links are required, or Google ignores them), plus `x-default` for the language picker or global page. Codes are ISO 639-1 language plus optional ISO 3166-1 region (`en-GB`, `de-CH`); `UK`, `EU` and `es-419` are not valid. Pick one method (head, HTTP header or sitemap), not all three.
- **Semantic HTML:** `<header>`, `<nav>`, `<main>` (one), `<section>` with a heading, `<footer>`. Links are `<a href>` with real URLs, so crawlers can follow them.

## Anti-patterns (don't)
- The h1 is the logo, or the hero headline is an image or a `<div class="h1">`.
- Every page titled "Acme | The best platform for modern teams".
- Two `<link rel="canonical">` tags, or a canonical that points to the home page from every page.
- An OG image of 400×400, or a 6 MB PNG export, or no `og:image:alt`.
- `meta keywords` (Google does not use it) and stuffed alt text.
- `FAQPage` markup added to pages for snippets that no longer exist, or markup for content not visible on the page.
- hreflang on one side only, or a `noindex` page listed in the sitemap.

## Good references
- [Plausible](https://plausible.io) — the h1 says exactly what the product is ("privacy-friendly Google Analytics alternative") and works as both title link and share title.
- [Google Search Central — Title links](https://developers.google.com/search/docs/appearance/title-link) — the 9 sources Google uses to build a title link, and why the `<title>` and first h1 should agree.
- [Meta for Developers — Images in link shares](https://developers.facebook.com/documentation/sharing/webmasters/images) — the 1200×630, 600×315 and 8 MB numbers.
- [GOV.UK](https://www.gov.uk) — a large site with a strict, plain heading outline and one descriptive h1 per page.

## Bad references
- [Google — FAQ and HowTo changes (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — documents why FAQ markup on a SaaS marketing page stopped producing rich results.
- [Ahrefs — How often Google rewrites meta descriptions](https://ahrefs.com/blog/meta-description-study/) — vague or duplicated descriptions are the ones most often replaced; 25% of top pages had none at all (vendor study).
- Generic SPA landing pages whose `<title>` and OG tags are set by client JS after load. Share crawlers do not run JS, so every share shows the default title and no image.

## Accessibility
- The h1 and heading outline are how screen reader users skim; a skipped level (h2 to h4) or a heading used for styling breaks that.
- `og:image:alt` and `<img alt>` describe the image, not the keywords.
- Set `<html lang>` on every page and on each localized variant; hreflang does not replace it.

## Motion / interaction (if relevant)
- Not applicable. Content revealed by scroll animation must be in the DOM at load so it is indexed (see `mkstyle-scroll-motion.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-step-display` | `clamp(2.5rem, 1.717rem + 3.478vw, 4.5rem)` | the single h1 (`.mk-display`) |
| `--mk-step-4` | `clamp(2.074rem, 1.81rem + 1.17vw, 2.747rem)` | section h2 (`.mk-h2`) |
| `<title>` | ~50–60 chars, ≤ ~600 px | unique per page |
| Meta description | ~140–160 chars | unique per page |
| OG image | 1200×630 px, 1.91:1, ≤ 300 KB (limit 8 MB) | safe area ~1000×520 |
| Sitemap | ≤ 50,000 URLs / 50 MB per file | split with an index |

## Implementation sketch
```html
<html lang="en-GB">
<head>
  <title>Payroll for remote teams in 40 countries | Acme</title>
  <meta name="description" content="Run compliant payroll for contractors and employees in 40 countries from one dashboard. Plans from £20 per person per month.">
  <link rel="canonical" href="https://acme.example/payroll">
  <link rel="alternate" hreflang="en-GB" href="https://acme.example/payroll">
  <link rel="alternate" hreflang="de-DE" href="https://acme.example/de/payroll">
  <link rel="alternate" hreflang="x-default" href="https://acme.example/payroll">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Acme">
  <meta property="og:title" content="Payroll for remote teams in 40 countries">
  <meta property="og:description" content="Compliant payroll for contractors and employees, one dashboard.">
  <meta property="og:url" content="https://acme.example/payroll">
  <meta property="og:image" content="https://acme.example/og/payroll-v3.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Acme payroll run showing 3 countries paid on time">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Organization","name":"Acme","url":"https://acme.example",
   "logo":"https://acme.example/logo-512.png","sameAs":["https://www.linkedin.com/company/acme-example"]}
  </script>
</head>
<body>
  <header><nav aria-label="Main"></nav></header>
  <main>
    <section><h1 class="mk-display">Payroll for remote teams in 40 countries</h1></section>
    <section aria-labelledby="how"><h2 id="how" class="mk-h2">How a pay run works</h2></section>
    <section aria-labelledby="price"><h2 id="price" class="mk-h2">Pricing</h2></section>
  </main>
  <footer></footer>
</body>
</html>
```
```css
/* Visual size is a class, never a heading level. */
h1, h2, h3 { margin: 0; }
.mk-h2--quiet { font: 600 var(--mk-step-0) / 1.3 var(--mk-font-body); color: var(--text-muted); }
```

## Checklist
- [ ] Exactly one `<h1>`, live text, saying what the product does and for whom; it agrees with `<title>`.
- [ ] Headings never skip a level, and every `<section>` has a heading.
- [ ] `<title>` is unique and ≤ 60 characters; meta description is unique and 140–160 characters.
- [ ] One absolute self-referencing canonical per page; UTM variants canonicalise to the clean URL.
- [ ] OG image is 1200×630, ≤ 300 KB, has width, height and alt tags, and renders in a share debugger without JS.
- [ ] JSON-LD validates in the Rich Results Test, includes no `FAQPage` added for snippets, and describes only visible content.
- [ ] Localized pages have reciprocal hreflang plus `x-default`, and matching `<html lang>`.

## Sources
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide (heading order does not matter for ranking; meta keywords unused)
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/structured-data/organization
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
- https://developers.google.com/search/updates (Search Central changelog: FAQ rich results no longer shown from 7 May 2026, deprecation notice 8 May 2026, documentation removed 15 June 2026)
- https://developers.google.com/search/docs/appearance/page-experience
- https://developers.facebook.com/documentation/sharing/webmasters/images
- https://ogp.me/
- https://ahrefs.com/blog/meta-description-study/
