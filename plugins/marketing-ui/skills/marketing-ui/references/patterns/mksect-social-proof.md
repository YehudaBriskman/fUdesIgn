# Social proof: logos, testimonials and reviews

> Show proof a visitor can check: 5–8 permitted customer logos at one optical size, testimonials from named people with a role, company and photo that state a specific outcome, and nothing invented, paid-for without disclosure or rotating on its own.

**Category:** Sections · **Applies to:** logo walls, testimonial blocks, case-study teasers, review badges, ratings, "trusted by" strips · **Priority:** must

## When to use / when not
- Use a logo strip directly under the hero when the customers are recognisable to the target buyer. It answers "who else uses this?" before the visitor scrolls far. See `mksect-hero.md`.
- Use one to three testimonials next to the claim they support: a speed quote beside the performance feature, a migration quote beside pricing. Proof works best near the decision it supports (see `mkfound-page-narrative.md`).
- Use review-platform badges (G2, Capterra) only when you hold a current badge and the licence to show it.
- Don't add social proof you cannot verify or get permission for. An empty slot is better than a fake one. Don't add a logo strip of companies the buyer has never heard of; it signals small scale more than trust.
- Low numbers can backfire. NN/g reports a participant who read "1,000 shares" as "unpopular". Hide a counter until it is big enough to impress the intended buyer.

## Rules (do)
- **Logo wall: 5–8 logos in one row on desktop**, wrapping to 2 rows of 3–4 on mobile. More than 8 turns into noise; fewer than 4 looks thin.
- **Monochrome treatment.** Render every logo in one colour (`--text-muted` on the canvas), so no single brand palette pulls the eye. Full-colour logos only when a customer's brand guidelines forbid recolouring.
- **Same optical size, not the same box.** A wide wordmark and a square mark at equal height look unequal. Normalise by visual area: start at a 32px height for square marks and 20–24px for wide wordmarks, and cap width at about 120px. Check by eye with the page zoomed out.
- **Permission in writing** for every logo and every quote. Most enterprise contracts forbid logo use without approval. Keep the approval with the asset.
- **Testimonial anatomy:** a quote of 1–3 sentences (aim for under 40 words), then full name, role, company, and a real photo of the person (48–64px, square or circular). Fogg's Stanford guidelines put "show that honest, trustworthy people stand behind the site" and "make it easy to verify" among the 10 core credibility factors.
- **Outcome numbers beat adjectives.** "Cut our build time from 14 to 3 minutes" beats "game-changing tool". Each quote should carry one concrete, checkable result.
- **Link to the case study** from the testimonial when one exists ("Read how Acme cut build time"). The quote is the hook; the case study is the evidence.
- **Review data, labelled honestly.** Show the rating, the review count and the platform ("4.6 from 1,240 reviews on G2"), linked to the source. Spiegel Research Center (2017, with PowerReviews data) found that a product with 5 reviews had a 270% higher purchase likelihood than one with none, and that most of the effect comes from the first 5–10 reviews. That study covers **e-commerce product pages**, not B2B software landing pages. Treat it as a direction, not a forecast for your page. The same work found that purchase likelihood peaks around 4.0–4.7 stars and drops as ratings approach 5.0, so a perfect score can read as fake.
- **Comply with US law.** The FTC Trade Regulation Rule on Consumer Reviews and Testimonials (16 CFR Part 465) took effect on **21 October 2024**. It bans fake or AI-generated reviews and testimonials, reviews from people with no real experience of the product, incentives tied to a positive (or negative) review, undisclosed insider reviews, company-controlled "independent" review sites, review suppression and bought social-media indicators. Knowing violations can bring civil penalties per violation. The FTC Endorsement Guides (16 CFR Part 255, revised July 2023) add that any material connection (payment, free product, employment) must be disclosed clearly and conspicuously, and that the quoted result must be typical or the typical result must be stated.

## Anti-patterns (don't)
- Stock photos or illustrated avatars beside quotes, and initials-only names ("J.D., CEO"). They read as invented, and under the FTC rule an invented testimonial is a violation, not just a weak design.
- An auto-rotating testimonial carousel. NN/g's research on auto-forwarding carousels found users miss content in rotating slots and are annoyed by losing control. It also fails WCAG 2.2.2 unless it can be paused.
- Logo walls with mixed colours, mixed heights and a "+ 10,000 more" pill.
- An infinitely scrolling logo marquee with no pause control. It is moving content longer than 5 seconds (WCAG 2.2.2).
- Five-star widgets with no source, count or date.
- Quotes that only praise ("Love it!", "Best tool ever").
- Altering a G2 or Capterra badge (recolouring, cropping). G2's licence terms forbid modifying badges.

## Good references
- [Stripe customers](https://stripe.com/customers) — named companies with one concrete result each (for example a 10% uplift in payment acceptance for Twilio), each linking to a full story. The proof is a number, not an adjective.
- [Vercel customers](https://vercel.com/customers) — a case-study index that gives home-page logos somewhere to lead.
- [Linear](https://linear.app) — a single "Powering the companies building the future" logo row directly under the hero, then no further logo noise.
- [Stanford Web Credibility guidelines](https://credibility.stanford.edu/guidelines/index.html) (B.J. Fogg, 2002) — the 10 credibility guidelines: verifiable claims, a real organisation, real people, easy contact.

## Bad references
- [FTC: rule banning fake reviews and testimonials](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials) — documents the exact practices (invented, AI-written, insider and bought reviews) that make a testimonial block illegal, not just unconvincing.
- Generic template testimonial sections: three cards, a stock headshot, a first name and "CEO", five gold stars, an adjective-only quote. The pattern is listed in `mkstyle-generated-default-tells.md`.
- [NN/g: Auto-forwarding carousels annoy users](https://www.nngroup.com/articles/auto-forwarding/) — rotating testimonial sliders hide most quotes most of the time.

## Accessibility
- Mark each testimonial up as `<figure>` with a `<blockquote>` and a `<figcaption>` for attribution. The `cite` element is for a work title, not a person's name.
- Logos are images of text: give each `alt` with the company name ("Acme"). Don't write "Acme logo". Group them in a list with a visible or visually hidden heading ("Used by teams at").
- The person's photo is decorative when the name sits right beside it: use `alt=""`.
- Star ratings need a text equivalent ("Rated 4.6 out of 5 from 1,240 reviews"), not 5 star glyphs read aloud.
- Muted logos must still reach 3:1 against the canvas (SC 1.4.11 for graphics conveying meaning). `--text-muted` on `--canvas` passes in both themes.
- Any moving strip needs a visible pause button and must stop under `prefers-reduced-motion: reduce`.

## Motion / interaction (if relevant)
- Prefer no motion. If a marquee is a brand choice, run it at no more than about 30px/s, pause on hover and focus, provide a pause button, and render a static wrapped row under reduced motion. See `mkstyle-scroll-motion.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-logo-h` (new) | 24px wordmark / 32px square mark | starting heights before optical correction |
| `--mk-logo-max-w` (new) | 120px | cap for wide wordmarks |
| Logo colour | `--text-muted` | monochrome wall |
| Logo gap | `--mk-grid-gap` row, `--space-7` (48px) column | |
| Avatar | 56px, `--radius-full` | testimonial photo |
| Quote size | `--mk-step-2` for a featured quote, `--mk-step-0` for cards | |
| Card | `--surface`, `--mk-card-radius`, `--mk-card-pad`, 1px `--border` | testimonial card |
| Logos per row | 5–8 desktop, 3–4 mobile | |

## Implementation sketch
```html
<section class="mk-section" aria-labelledby="proof-h">
  <h2 id="proof-h" class="visually-hidden">Customers</h2>
  <ul class="logo-wall" role="list">
    <li><img src="/logos/acme.svg" alt="Acme" width="96" height="24"></li>
    <li><img src="/logos/globex.svg" alt="Globex" width="32" height="32"></li>
  </ul>
  <figure class="quote">
    <blockquote><p>We cut our build time from 14 minutes to 3 in the first week.</p></blockquote>
    <figcaption>
      <img src="/people/dana-levi.jpg" alt="" width="56" height="56">
      <span><strong>Dana Levi</strong>, Head of Platform, Acme</span>
      <a href="/customers/acme">Read the Acme case study</a>
    </figcaption>
  </figure>
</section>
```
```css
.logo-wall {
  display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
  gap: var(--mk-grid-gap) var(--space-7, 48px);
  padding: 0; list-style: none;
}
.logo-wall img {
  block-size: var(--mk-logo-h, 24px); inline-size: auto; max-inline-size: var(--mk-logo-max-w, 120px);
  filter: grayscale(1); opacity: 0.7;
}
.quote {
  margin: 0; padding: var(--mk-card-pad); max-inline-size: var(--mk-container-prose);
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--mk-card-radius);
}
.quote blockquote { margin: 0; font: 500 var(--mk-step-2) / 1.35 var(--mk-font-body); text-wrap: pretty; }
.quote figcaption { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3, 12px); margin-block-start: var(--space-5, 24px); color: var(--text-muted); }
.quote figcaption img { border-radius: var(--radius-full, 9999px); }
@media (forced-colors: active) { .logo-wall img { filter: none; opacity: 1; } }
```

## Checklist
- [ ] Logo wall holds 5–8 logos, all monochrome, matched by optical size, each with written permission on file.
- [ ] Every testimonial has a full name, role, company and a real photo, and states one specific outcome.
- [ ] No testimonial or review is invented, AI-written or from an undisclosed insider (16 CFR 465), and paid or gifted endorsers are disclosed.
- [ ] Ratings show score, count, platform and a link to the source.
- [ ] Testimonials use `<figure>`, `<blockquote>` and `<figcaption>`, and logos have the company name as `alt`.
- [ ] Nothing auto-rotates; any marquee has a pause button and stops under reduced motion.

## Sources
- https://www.nngroup.com/articles/social-proof-ux/ (Cardello 2014: low counts backfire; test implementations)
- https://www.nngroup.com/articles/auto-forwarding/ (could not load the page; findings taken from search summaries of the article)
- https://credibility.stanford.edu/guidelines/index.html
- https://spiegel.medill.northwestern.edu/How-Online-Reviews-Influence-Sales (270% with 5 reviews; e-commerce data; 4.0–4.7 star peak)
- https://www.federalregister.gov/documents/2024/08/22/2024-18519/trade-regulation-rule-on-the-use-of-consumer-reviews-and-testimonials (16 CFR 465, effective 21 Oct 2024)
- https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
- https://www.federalregister.gov/documents/2023/07/26/2023-14795/guides-concerning-the-use-of-endorsements-and-testimonials-in-advertising (Endorsement Guides, 16 CFR 255)
- https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255
- https://legal.g2.com/g2-profile-free-service-description (badges may not be altered) and https://company.g2.com/news/badge-accessibility-changes
- https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
