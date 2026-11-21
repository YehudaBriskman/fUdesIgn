# Marketing anti-patterns gallery

> Before shipping a marketing page, check it against these 13 documented anti-patterns, each paired with an evidence grade, a named bad case and a named site that does the opposite well, and remove any you find unless the brief gives a measured reason to keep it.

**Category:** Reference · **Applies to:** landing pages, home pages, pricing pages, consent banners, promos, hero sections, design reviews · **Priority:** should

## When to use / when not
- Use as a review pass after the page is built and before launch, alongside `mkref-review-rubric.md`. Each entry names the pattern file that holds the fix.
- Use it in critique: point to the entry, its evidence grade and its bad case rather than arguing taste.
- Not a list of banned companies. Bad cases criticise a documented behaviour at a point in time (many have since been fixed). Good cases were checked on the live site in November 2026 and may change.

## Rules (do)
- **Grade the evidence before you cite it.** In this file: **A** = large-sample usability research, field data (HTTP Archive, CrUX) or a regulator's finding; **B** = a single-site vendor or A/B case study (unreplicated, survivorship bias); **C** = expert opinion or heuristic. Never quote a B-grade uplift as a general rule.
- A grade-A anti-pattern is removed, not debated. A grade-C one needs a reason in the brief to keep.
- Fix the cause, not the symptom: the pattern file named in each entry holds the rules and numbers.
- When you cite a bad case, link the article, ruling or study that documents it, and state the date.

## Anti-patterns (don't)
1. **Hero carousel.** Rotating slides each claiming the hero. Why: users rarely interact and the first slide takes most clicks. Grade A/B (Notre Dame field data). Bad: [Erik Runyon's Notre Dame data](https://erikrunyon.com/2013/01/carousel-interaction-stats/) — about 1% of homepage visitors clicked a feature, and slide 1 got 84% of those clicks. Good: [Stripe](https://stripe.com) — one static headline and two CTAs. Fix: `mksect-hero.md`.
2. **Scrolljacking.** Script changes scroll speed, direction or snaps sections. Why: users feel out of control, think the page is broken, and miss content; worst on mobile and with text to read. Grade A (NN/g usability study). Bad: [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) — documents disorientation across sites from several industries. Good: [Basecamp](https://basecamp.com) — a long sales page on native scroll. Fix: `mkstyle-scroll-motion.md`.
3. **Autoplay video with sound.** Why: startles, competes with screen readers, and browsers block it. Chrome 66 (April 2018) allows sound only after the user has engaged with media on that site. Grade A (platform policy). Bad: [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay) — written in response to unwanted sound on load. Good: [Basecamp](https://basecamp.com) — its tour videos are click-to-play ("Take a 3-minute tour"), never autoplayed with sound. Fix: `mkperf-lcp-and-hero-media.md`.
4. **Hidden pricing ("Contact sales" only).** Why: business buyers rank price as their top information need and leave for competitors that show it. Grade A (NN/g B2B studies, qualitative). Bad: [NN/g — State the price (2013)](https://www.nngroup.com/articles/show-price/). Good: [Basecamp pricing](https://basecamp.com/pricing) — 5 plans from $0 to $199/month, all public. Fix: `mksect-pricing-tables.md`.
5. **Dark-pattern cookie consent.** Accept in one click, refuse buried behind several. Why: illegal in the EU when refusal is harder than consent. Grade A (regulator). Bad: [CNIL fines, Jan 2022](https://www.hunton.com/privacy-and-cybersecurity-law-blog/cnil-fines-big-tech-companies-210-million-euros-for-cookie-violations) — €150M on Google and €60M on Facebook because google.fr, youtube.com and facebook.com needed several clicks to refuse. Good: [GOV.UK](https://www.gov.uk/help/cookies) — "Accept" and "Reject additional cookies" side by side, same wording. Fix: `mkfound-cta-and-conversion.md`.
6. **Confirmshaming.** The decline link insults the user ("No, I prefer to bleed to death"). Why: guilt-tripping erodes trust; deceptive.design links it to the FTC's case against Amazon. Grade A for the pattern being documented (catalogued cases), C for the size of the effect. Bad: [Deceptive.design — Confirmshaming](https://www.deceptive.design/types/confirmshaming) — the Mymedic 2018 example and a hall of shame. Good: [Plausible](https://plausible.io) — no nag modal and no cookie banner to decline at all. Fix: `mkfound-cta-and-conversion.md`.
7. **Fake urgency timers.** Countdowns that reset on refresh, "high demand" claims. Why: misleading under UK consumer law. Grade A (regulator). Bad: [CMA v Emma Sleep](https://www.gov.uk/government/news/court-endorses-cma-action-as-emma-sleep-agrees-to-change-sales-practices) — the High Court consent order (May 2026) records breaches of consumer law by timers that restarted; Emma says it changed its messaging in December 2022. Good: [Basecamp pricing](https://basecamp.com/pricing) — the same public price every day, no timer. Fix: `mksect-pricing-tables.md`.
8. **Intrusive interstitials.** A full-page newsletter or app modal before the content. Why: blocks the task, and Google says it can harm search performance. Grade A (Google guidance). Bad: [Google — Avoid intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials) — whole-page overlays and redirects for input. Good: [GOV.UK](https://www.gov.uk) — the only banner is the small cookie banner, and content is readable behind it. Fix: `mkfound-accessibility-floor.md`.
9. **Stock-photo hero.** Smiling models at laptops instead of the product. Why: users ignore decorative filler and look at real people and real product. Grade A/C (NN/g eye-tracking, 2010, single-user gaze plots). Bad: [NN/g — Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/) — a decorative photo treated as filler. Good: [Plausible](https://plausible.io) — the hero shows the real dashboard. Fix: `mkstyle-colour-art-direction.md`.
10. **Logo wall of unknown brands.** Twenty grey logos nobody recognises, no links. Why: proof that cannot be checked reads as filler. Grade C (opinion; no NN/g study found on unfamiliar logos). Bad: the generic template pattern; vendor claims that logos lift conversions "regardless of recognition" trace to a single vendor blog. Good: [Stripe](https://stripe.com) — recognisable logos that link to customer stories. Fix: `mksect-social-proof.md`.
11. **Vague headline.** "The future of work, reimagined." Why: users scan the first words; clever or generic headings do not say what the product is. Grade A/C (NN/g writing guidance). Bad: [NN/g — Microcontent](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/) — warns against cute, unspecific headlines. Good: [Plausible](https://plausible.io) — "Easy to use and privacy-friendly Google Analytics alternative". Fix: `mksect-hero.md`, `mkperf-seo-headings-and-metadata.md`.
12. **Slow LCP from hero media.** A background MP4 with no poster or a 2 MB hero JPEG. Why: only 59% of mobile origins pass LCP; Chrome counts the poster or first frame as LCP, and only 3% of `<video>` elements set a poster. Grade A (HTTP Archive). Bad: [Web Almanac 2024 — Media](https://almanac.httparchive.org/en/2024/media). Good: [Stripe](https://stripe.com) — text-first hero, so LCP does not wait on a video. Fix: `mkperf-lcp-and-hero-media.md`.
13. **Generated-default look.** Purple-to-blue gradient, centred hero, three identical icon cards, Inter everywhere, the same fade-up on every section. Why: visitors now recognise it as unconsidered, so the brand reads as interchangeable. Grade C (practitioner opinion, Anthropic and Impeccable write-ups). Bad: [Anthropic — Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) — lists these tells as what models produce by default. Good: [Basecamp](https://basecamp.com) — a multi-paragraph founder letter signed by Jason Fried and opinionated copy that no template would produce. Fix: `mkstyle-generated-default-tells.md`.

## Good references
- [Stripe](https://stripe.com) — static, single-message hero; logos linked to customer stories.
- [Basecamp](https://basecamp.com) and [Basecamp pricing](https://basecamp.com/pricing) — click-to-play video, a distinctive first-person voice, every price public, no timers.
- [Plausible](https://plausible.io) — literal headline, real product screenshot, no cookie banner because it sets no cookies.
- [GOV.UK cookies](https://www.gov.uk/help/cookies) — accept and reject offered as parallel, equally worded buttons.

## Bad references
- [Erik Runyon — Carousel interaction stats](https://erikrunyon.com/2013/01/carousel-interaction-stats/) (2013 field data, one university).
- [CNIL fines on Google and Facebook](https://www.hunton.com/privacy-and-cybersecurity-law-blog/cnil-fines-big-tech-companies-210-million-euros-for-cookie-violations) (decisions of 31 Dec 2021, announced Jan 2022).
- [CMA — Emma Sleep](https://www.gov.uk/cma-cases/emma-group-consumer-protection-case) (case opened Nov 2022, claim filed Oct 2024, consent order May 2026; the separate reference-pricing claim failed in July 2026).
- [FTC — Bringing Dark Patterns to Light (2022)](https://www.ftc.gov/reports/bringing-dark-patterns-light).
- [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/).

## Accessibility
- Carousels, autoplay video and scrolljacking each break WCAG 2.2.2 (pause, stop, hide) unless they have controls, and they ignore `prefers-reduced-motion` unless you honour it.
- Interstitials and consent walls must trap and return focus correctly, and close with Escape. Most dark-pattern banners also fail on reject-button contrast.
- Confirmshaming text is read aloud verbatim by screen readers; the insult is not softened by styling.

## Motion / interaction (if relevant)
- Every entry above that moves (1, 2, 3, 12, 13) has a reduced-motion state: a static first slide, native scroll, a poster image, no reveal. See `mkstyle-scroll-motion.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Evidence grades | A / B / C | research or regulator / vendor case / opinion |
| `--mk-reveal-distance` | 16px | max reveal travel; scrolljacking never applies |
| `--mk-reveal-duration` | `var(--motion-dur-long, 400ms)` | no reveal on the LCP element |
| `--mk-cta-height` | 48px | accept and reject buttons share it |
| LCP target | ≤ 2.5 s p75 | entry 12 |
| Carousel engagement | ~1% clicked; 84% on slide 1 | entry 1 (Notre Dame) |

## Implementation sketch
```html
<!-- Equal-weight consent: same element, same size, same order of emphasis (entry 5). -->
<section class="consent" aria-labelledby="consent-title">
  <h2 id="consent-title">Cookies on this site</h2>
  <p>We use analytics cookies to learn which pages help. You can change this later in Settings.</p>
  <div class="consent__actions">
    <button type="button" class="mk-cta" data-variant="secondary">Accept analytics cookies</button>
    <button type="button" class="mk-cta" data-variant="secondary">Reject analytics cookies</button>
  </div>
</section>
```
```css
.consent {
  position: fixed;
  inset: auto var(--mk-gutter) var(--mk-gutter);
  max-inline-size: var(--mk-container-prose);
  padding: var(--mk-card-pad);
  border: 1px solid var(--border);
  border-radius: var(--mk-card-radius);
  background: var(--surface);
  color: var(--text);
}
.consent__actions { display: flex; flex-wrap: wrap; gap: var(--space-3); }
.consent__actions .mk-cta { flex: 1 1 12rem; }
```

## Checklist
- [ ] No hero carousel, no scroll-speed or snap override, no audio autoplay.
- [ ] Prices or a typical-scenario price are visible without contacting sales.
- [ ] Reject is as easy as accept: same element, same size, same number of clicks.
- [ ] No decline copy that shames the user, and no countdown that is not tied to a real, stated end date.
- [ ] No full-page interstitial before content on load; prompts are small banners.
- [ ] The hero shows the real product or real people, and the h1 says what the product is.
- [ ] Every logo in a logo wall is recognisable to the target buyer or links to a story.
- [ ] Each remaining anti-pattern has a documented reason and evidence grade in the brief.

## Sources
- https://erikrunyon.com/2013/01/carousel-interaction-stats/
- https://www.nngroup.com/articles/scrolljacking-101/
- https://developer.chrome.com/blog/autoplay
- https://www.nngroup.com/articles/show-price/
- https://www.hunton.com/privacy-and-cybersecurity-law-blog/cnil-fines-big-tech-companies-210-million-euros-for-cookie-violations
- https://www.cnbc.com/2022/01/06/google-hit-with-150-million-euro-french-fine-for-cookie-breaches.html
- https://www.deceptive.design/types/confirmshaming
- https://www.ftc.gov/reports/bringing-dark-patterns-light
- https://www.gov.uk/government/news/court-endorses-cma-action-as-emma-sleep-agrees-to-change-sales-practices
- https://www.gov.uk/cma-cases/emma-group-consumer-protection-case
- https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials
- https://www.nngroup.com/articles/photos-as-web-content/
- https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/
- https://www.nngroup.com/articles/trustworthy-design/
- https://almanac.httparchive.org/en/2024/media
- https://almanac.httparchive.org/en/2024/performance
- https://claude.com/blog/improving-frontend-design-through-skills
- https://github.com/pbakaus/impeccable (Apache-2.0; ideas only)
- https://stripe.com · https://basecamp.com/pricing · https://plausible.io · https://www.gov.uk/help/cookies
