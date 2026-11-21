# Pattern index

Every pattern file in `patterns/`, grouped by cluster. **Priority** says how binding it is: must = always apply, should = apply unless there's a reason not to, nice = optional.
19 patterns in total.


## Foundations: narrative, conversion, accessibility

| Pattern | Priority | Rule |
|---|---|---|
| [Accessibility floor for marketing pages](patterns/mkfound-accessibility-floor.md) | must | Every marketing page ships with landmarks, one h1 and no skipped heading levels, a skip link, a `lang` attribute, real alt text, pausable motion, captioned video, 4.5:1 text contrast measured on the worst pixel behind it, focus that is visible and never hidden by sticky bars, and targets of at least 24×24 px. |
| [CTAs and conversion evidence](patterns/mkfound-cta-and-conversion.md) | must | Give each view one primary CTA whose label names the action and its outcome, put the risk reversers right beside it, strip every form field you cannot justify, and never manufacture urgency. |
| [Page structure and narrative](patterns/mkfound-page-narrative.md) | must | One page serves one goal: the hero says what it is and for whom, proof and features answer "does it work for me", objections are cleared before the ask, and the same primary CTA closes every major section. |

## Sections: hero, proof, features, pricing, FAQ, footer

| Pattern | Priority | Rule |
|---|---|---|
| [FAQ and objection handling](patterns/mksect-faq-and-objections.md) | should | Answer the 5–10 real objections that sales and support hear most (price, security, migration, cancellation) in plain sentences near the final CTA, and never use the FAQ to hide something a buyer needs to decide. |
| [Feature sections and bento grids](patterns/mksect-features-and-bento.md) | must | Lead each feature with the benefit, show 3–6 features per section using real product UI rather than icons, and build any bento grid with one hero tile, 5–7 tiles and a DOM order that matches the visual order and the mobile priority order. |
| [Footer](patterns/mksect-footer.md) | should | End the page with a final CTA band, then one `<footer>` landmark that holds grouped utility links, contact, legal and cookie settings, status and language, with clear labels and real tap targets, and nothing that belongs higher up. |
| [The hero](patterns/mksect-hero.md) | must | The first viewport says what the product is and who it is for in a 6–12 word headline, backs it with a one-sentence subhead, one primary and at most one secondary CTA, and shows the real product, not a stock photo or a carousel. |
| [Pricing tables](patterns/mksect-pricing-tables.md) | must | Show real prices for 3–4 tiers with the billing unit, currency and tax status next to every number, recommend at most one plan, state the annual saving honestly, and put the full comparison in a real `<table>` with row and column headers. |
| [Social proof: logos, testimonials and reviews](patterns/mksect-social-proof.md) | must | Show proof a visitor can check: 5–8 permitted customer logos at one optical size, testimonials from named people with a role, company and photo that state a specific outcome, and nothing invented, paid-for without disclosure or rotating on its own. |

## Style: type, colour, dark sections, motion, generated-default tells

| Pattern | Priority | Rule |
|---|---|---|
| [Colour and art direction](patterns/mkstyle-colour-art-direction.md) | must | Derive the palette from the brand and subject, spend one accent in one place per view, build every shade as an OKLCH ramp checked for WCAG contrast, and direct imagery toward the real product and real people, with gradients only where they carry meaning. |
| [Dark sections and dark marketing pages](patterns/mkstyle-dark-sections.md) | should | Use at most two inverse bands on a light page (a feature spotlight and the final CTA), build each by re-declaring the role tokens under `[data-tone="inverse"]` with `color-scheme: dark`, re-check every contrast pair inside it, and keep long reading copy on the light ground. |
| [Display typography and type pairing](patterns/mkstyle-display-type-pairing.md) | must | Choose the display face from the subject and the brief, pair it with at most one other family that contrasts on one axis, and set it tight (−0.01 to −0.04em, leading 1.0–1.15) over body copy at 1.5–1.7 leading and a 45–75ch measure, with fluid sizes whose max is no more than 2.5× their min. |
| [Generated-default tells](patterns/mkstyle-generated-default-tells.md) | must | Refuse every tell in this catalogue by default, and allow one only when the brief names it or the subject earns it in a sentence you can write down; detect them in the rendered DOM, not by eye. |
| [Motion and scroll on marketing pages](patterns/mkstyle-scroll-motion.md) | must | Spend motion on one orchestrated moment (usually the hero load), keep any scroll reveals short (≤ 400–600ms, ≤ 16–24px, transform and opacity only) and progressive, never hijack the scroll, and make every piece of content visible without JavaScript or animation. |

## Performance and SEO: LCP, fonts, metadata

| Pattern | Priority | Rule |
|---|---|---|
| [LCP and hero media](patterns/mkperf-lcp-and-hero-media.md) | must | The hero's largest element must paint within 2.5 s at the 75th percentile on mobile, so the LCP image is discoverable in the HTML, eagerly loaded with `fetchpriority="high"`, sized to its slot in a modern format, and reserved with width and height so nothing shifts. |
| [SEO structure: headings and metadata](patterns/mkperf-seo-headings-and-metadata.md) | must | Every marketing page has one descriptive h1 that matches its `<title>`, a heading outline that reads as a table of contents, a unique title and description, a canonical URL, complete Open Graph and Twitter tags with a 1200×630 image, and only the structured data Google still uses. |
| [Web fonts on marketing pages](patterns/mkperf-web-fonts.md) | must | Self-host subsetted WOFF2, keep the critical path to 2 families and about 4 files, preload only the 1–2 fonts the hero needs, and give every web font a metric-matched fallback so the swap moves nothing. |

## References: anti-pattern gallery and review rubric

| Pattern | Priority | Rule |
|---|---|---|
| [Marketing anti-patterns gallery](patterns/mkref-anti-patterns-gallery.md) | should | Before shipping a marketing page, check it against these 13 documented anti-patterns, each paired with an evidence grade, a named bad case and a named site that does the opposite well, and remove any you find unless the brief gives a measured reason to keep it. |
| [Marketing page review rubric](patterns/mkref-review-rubric.md) | must | Score every marketing page on these 35 checks (0, 1 or 2 each) with evidence from screenshots, the DOM and a lab trace, and ship only at 80% or more of the applicable points with no must-check at 0. |
