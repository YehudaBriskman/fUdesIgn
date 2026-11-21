# Page structure and narrative

> One page serves one goal: the hero says what it is and for whom, proof and features answer "does it work for me", objections are cleared before the ask, and the same primary CTA closes every major section.

**Category:** Foundations · **Applies to:** landing pages, home pages, product and feature pages, campaign pages, waitlist pages · **Priority:** must

## When to use / when not
- Use this order for any page whose job is to move a visitor to one action: sign up, book a demo, buy, join a waitlist.
- Use it for product and feature pages too. They are landing pages with a narrower promise.
- Don't force it onto docs, changelogs, blog posts or legal pages. Those are read in the commitment pattern (see Rules) and need a table of contents, not a funnel.
- Don't build one page for two goals ("Start free" and "Talk to sales" as equals). Pick the goal from the business model, then demote the other to a secondary link.

## Rules (do)
- **One page, one goal, one primary CTA label.** Write the goal down before any layout: "visitor starts a free trial". Every section either moves toward it or gets cut. The same verb and label appear in the hero, after features, after pricing and in the final band (see `mkfound-cta-and-conversion.md`).
- **Default narrative:** hero → proof → features → objections → CTA. Proof comes early because the hero claim is not believed yet. Features answer "what will I actually do with it". Objections (pricing, security, migration, cancellation) come just before the final ask, where hesitation peaks.
- **Order sections by goal.** Use the table in Tokens and values. A demo-request page needs more proof and less feature detail than a self-serve page. A purchase page puts price and delivery terms high. A waitlist page is short.
- **Design for scanners, not readers.** NN/g's log-data study (25 users, 45,237 page views) estimated that people read about 20% of the words on an average page and have time for at most 28%. Each section needs a heading that carries the claim on its own, a short lead, then detail.
- **Support the scanning patterns NN/g documented in eyetracking (2019 update):**
  - F-pattern: users read the start of lines and the top of the page. Put the key words first in headings and bullets.
  - Layer-cake: users read headings and dip into one block. This is the pattern to design for, so give every section an H2 that states a benefit, not a label ("Ship changes without a deploy", not "Features").
  - Spotted: users fixate on links, numbers and bold words. Use numbers that mean something ("2-minute setup").
  - Commitment: rare on marketing pages, common on pricing and FAQ. Keep those in readable prose.
- **Spend the first screen on the promise.** NN/g's 2018 eyetracking study (120 participants, 130,000+ fixations, 1920×1080) found 57% of viewing time above the fold and 74% in the first two screenfuls. The headline, subhead, primary CTA and a real product visual belong in that space (see `mksect-hero.md`).
- **Avoid false floors.** NN/g's "illusion of completeness" lists tall hero graphics with no cue below them as a cause of people not scrolling. Let the next section's top edge, a cropped screenshot or a heading peek into the first viewport.
- **Fit length to awareness and complexity.** Opinion, labelled as such: Eugene Schwartz's five awareness stages (Breakthrough Advertising, 1966) are a useful heuristic, not research. Unaware and problem-aware visitors need a longer page that first names the problem. Product-aware and most-aware visitors (from a pricing ad, a comparison search, a referral) need the offer, the price and the button. Copyhackers argues the same: long pages win when the decision is costly or unfamiliar.
- **Repeat the CTA at section ends.** Put an inline CTA after the feature block and after pricing or objections, and close with a final CTA band. Never more than one filled primary per viewport.
- **Each section is self-contained.** It has an H2, one idea, and at most one action. A visitor dropping in from a deep link or a scroll should understand it without the section above.

## Anti-patterns (don't)
- Two equal-weight goals in the hero ("Start free" and "Book a demo", both filled).
- Opening with brand mood (a slogan over a stock photo) before saying what the product is.
- Proof that lives only at the bottom, after the visitor has already decided.
- Section headings that are category labels ("Features", "Integrations", "Why us") rather than claims.
- A long page for a product-aware audience: a retargeting ad landing on 14 sections of education.
- Pricing, security or cancellation terms hidden only inside an FAQ accordion (see `mksect-faq-and-objections.md`).
- A different CTA label in every section ("Get started", "Try it", "Sign up", "Join now"). It reads as different actions.

## Good references
- [Plausible](https://plausible.io) — the H1 states the category and the differentiator ("privacy-friendly Google Analytics alternative"), the visual is the real dashboard, and the secondary CTA "View live demo" lets a sceptic check the claim before signing up.
- [Basecamp](https://basecamp.com) — a long, plain-language page for a broad, mixed-awareness audience. A 3-minute tour and example projects come before the feature detail, and "Try Basecamp free" repeats through the page and again in the footer.
- [Stripe](https://stripe.com) — the hero claim is followed at once by customer logos and hard numbers (currencies, payment volume, uptime). That is proof before features.
- [Linear](https://linear.app) — the hero promise is backed by a real product view in the first viewport; the "Get started" and "Contact sales" pair recurs in a closing band.

## Bad references
- [NN/g — Illusion of completeness](https://www.nngroup.com/articles/illusion-of-completeness/) — documents full-viewport heroes with no scroll cue that make users believe the page has ended.
- Generic template pattern (not one named site): a slogan-only H1 ("Elevate your workflow"), three icon cards, a testimonial carousel and a contact form. The visitor learns neither what it is nor for whom. See `mkstyle-generated-default-tells.md`.

## Accessibility
- One `<h1>` (the hero headline), one `<h2>` per section, no skipped levels. Screen reader users navigate the page by headings, which is the layer-cake pattern in audio (see `mkperf-seo-headings-and-metadata.md`).
- Use `<header>`, `<main>` and `<footer>` landmarks, and `<section aria-labelledby>` for each section so the landmarks list is useful.
- Repeated CTAs keep the same accessible name so they are recognisably the same action (WCAG 3.2.4 Consistent Identification).
- Contrast and target sizes follow `mkfound-accessibility-floor.md`.

## Motion / interaction (if relevant)
- Reveal-on-scroll is optional and must never hide content when unsupported. Use the `.mk-reveal` primitive from marketing.css and see `mkstyle-scroll-motion.md`.
- Don't scroll-jack. Native scrolling is what lets the F and layer-cake patterns work.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-section-space` | clamp(64px, 3.5rem + 6vw, 144px) | gap between sections |
| `--mk-block-space` | clamp(24px, 1rem + 2vw, 48px) | heading to content inside a section |
| `--mk-container` | 72rem | content width |
| `--mk-measure` | 65ch | body copy |
| Sections per page | 5–9 typical; waitlist 2–3 | opinion, scale with awareness |
| CTA repeats | hero + 2–3 section ends + final band | same label each time |

**Section order by goal** (opinion built on the evidence above; adjust after testing):

| Goal | Order | Notes |
|---|---|---|
| Self-serve sign-up | hero (CTA + product visual) → logos → 3–5 features → how it works → testimonials → pricing summary → FAQ → final CTA | Short form, risk reversers next to the CTA |
| Demo request | hero (demo CTA, secondary "watch tour") → logos + case-study numbers → problem → solution features → security and integrations → testimonials → FAQ → final CTA | Proof outweighs features; name the buyer's role |
| Purchase | hero (product, price, buy) → key benefits → details and specs → reviews → delivery, returns, guarantee → FAQ → final buy | Price and total cost visible early (Baymard: surprise costs are the top abandonment reason) |
| Waitlist | hero (promise + email field) → 3 benefits or a preview → who is behind it → final field | 2–3 sections; one field |

## Implementation sketch
```html
<header class="site-header"><!-- logo, 3–5 nav links, the primary CTA --></header>
<main>
  <section class="mk-section hero" aria-labelledby="hero-h">
    <h1 id="hero-h" class="mk-display">Privacy-first analytics for small teams</h1>
    <p class="mk-lead">One script, no cookies, a dashboard you can read in a minute.</p>
    <a class="mk-cta" href="/signup">Start free trial</a>
  </section>
  <section class="mk-section" aria-labelledby="proof-h"><h2 id="proof-h" class="mk-h2">Used by 14,000 sites</h2></section>
  <section class="mk-section" aria-labelledby="feat-h">
    <h2 id="feat-h" class="mk-h2">See every visit without a cookie banner</h2>
    <a class="mk-cta section-cta" href="/signup">Start free trial</a>
  </section>
  <section class="mk-section" aria-labelledby="faq-h"><h2 id="faq-h" class="mk-h2">Questions before you switch</h2></section>
  <section class="mk-section cta-band" data-tone="inverse" aria-labelledby="final-h">
    <h2 id="final-h" class="mk-h2">Try it on your site today</h2>
    <a class="mk-cta" href="/signup">Start free trial</a>
  </section>
</main>
<footer><!-- see mksect-footer.md --></footer>
```
```css
.hero { padding-block-end: var(--mk-block-space); }
.hero + .mk-section { padding-block-start: var(--mk-block-space); }
.section-cta { justify-self: start; }
.cta-band { text-align: center; }
.cta-band .mk-h2 { margin-inline: auto; max-inline-size: 24ch; }
```

## Checklist
- [ ] The page goal is written down and every section supports it, or is cut.
- [ ] H1 plus subhead say what it is and for whom, visible at 360×640 and 1440×900.
- [ ] Every H2 states a claim, and the page makes sense reading only the H1, H2s and CTAs.
- [ ] There is exactly one primary CTA label, repeated at 2–3 section ends and in a final band.
- [ ] Proof (logos, numbers, a named testimonial) appears within the first two screenfuls.
- [ ] Price, security and cancellation terms are visible outside any collapsed FAQ.
- [ ] Section order matches the goal row in the table above.

## Sources
- https://www.nngroup.com/articles/scrolling-and-attention/ (57% above the fold, 74% in two screenfuls, 120 participants, 2018)
- https://www.nngroup.com/articles/how-little-do-users-read/ (20–28% of words, 25 users, 45,237 page views)
- https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ (F, spotted, layer-cake, commitment; 2019)
- https://www.nngroup.com/articles/illusion-of-completeness/
- https://copyhackers.com/2014/07/long-pages/ (long vs short pages; practitioner opinion)
- https://www.copyblogger.com/stages-of-awareness (summary of Schwartz's five stages; opinion)
- https://baymard.com/lists/cart-abandonment-rate (extra costs top abandonment reason)
- https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html
- https://plausible.io · https://basecamp.com · https://stripe.com · https://linear.app (heroes checked November 2026)
