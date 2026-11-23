# Footer

> End the page with a final CTA band, then one `<footer>` landmark that holds grouped utility links, contact, legal and cookie settings, status and language, with clear labels and real tap targets, and nothing that belongs higher up.

**Category:** Sections · **Applies to:** site-wide footers, landing-page mini footers, final CTA bands, newsletter sign-ups · **Priority:** should

## When to use / when not
- Every page gets a footer. NN/g: users expect it and go there when they cannot find something, so never hide or collapse it.
- Use a **fat footer** (link columns, a doormat nav) on multi-page marketing sites with more than about 10 destinations. NN/g suggests listing a full sitemap only for sites of about 25 pages or fewer, and linking a separate sitemap page beyond that.
- Use a **minimal footer** (one row: legal, privacy, cookie settings, contact) on a single-goal campaign landing page, where extra exits dilute the goal (see `mkfound-page-narrative.md`). It still carries the legally required links.
- Don't use the footer for content that decides the purchase: pricing terms, security claims, the main CTA. Those belong in the page body.

## Rules (do)
- **Final CTA band first, footer second.** Close the page with one band: a headline, the page's primary CTA (same label as the hero) and optional microcopy. Give it `data-tone="inverse"` or `--surface-2` so it reads as the end of the story, then the footer below it (see `mkfound-cta-and-conversion.md`, `mkstyle-dark-sections.md`).
- **What belongs, in priority order:**
  1. Legal: privacy policy, terms, cookie settings, imprint where required, and an accessibility statement if you publish one.
  2. Contact: email or a contact page, support, sales, and a postal address if required.
  3. Product and company links: features, pricing, docs, changelog, about, careers, press.
  4. Trust utilities: a status page, security or trust centre, DPA, compliance.
  5. Language and region selector (`i18n-locale-negotiation-and-switchers.md`).
  6. Social links (3–5 maximum) and an optional newsletter.
- **Group into 3–5 columns of 3–7 links each,** with a short visible heading per group ("Product", "Company", "Legal"). NN/g recommends showing the hierarchy (bold group labels, lighter links) and avoiding vague labels such as "Resources".
- **Legal requirements depend on where you sell:**
  - **Germany:** a commercial site must show provider identification (Impressum) under § 5 DDG, which replaced § 5 TMG on 14 May 2024. It must be easy to recognise, directly reachable and permanently available. A footer link labelled "Impressum" or "Imprint" on every page is the accepted practice. Remove any "according to § 5 TMG" wording, because it is outdated.
  - **Austria:** § 5 ECG applies to commercial sites and § 25 MedienG disclosure applies to all sites. WKO guidance has templates by company type.
  - **Subscriptions in Germany:** § 312k BGB (since July 2022) requires a clearly labelled cancellation button ("Verträge hier kündigen"). It is usually linked from the footer and the account area.
  - **EU consent:** under GDPR Art. 7(3), withdrawing consent must be as easy as giving it. Put a persistent "Cookie settings" link in the footer that reopens the consent dialog.
  - **California:** CCPA requires a "Do Not Sell or Share My Personal Information" link (or the alternative opt-out icon) if you sell or share data.
- **Newsletter: one field, one promise.** "Monthly product notes, no spam" plus an email input and a button. Give it a visible `<label>`, double opt-in in the EU, and a privacy link next to it. It is not a second primary CTA, so style its button as secondary.
- **Status, language, social:** link status.yourdomain with a live dot only if it is real. The language selector shows language names in their own language ("Deutsch", not a flag). Social icons need accessible names.
- **Density and targets:** links are `--mk-step--1` or `--mk-step-0`, with ≥44px row height on touch and ≥24px with spacing on desktop (WCAG 2.5.8). Keep contrast ≥4.5:1 on muted footer text; footers are where `--text-muted` on `--surface-2` most often fails.

## Anti-patterns (don't)
- A dumping ground: 60+ links in 8 columns, SEO keyword links ("best project management software London"), and duplicate logo walls.
- Collapsing all footer groups into accordions on desktop. NN/g says don't hide or collapse the footer. Accordions are acceptable only for long groups on narrow screens.
- Infinite scroll with a footer that keeps escaping. Use a mini footer in a side rail or stop the feed with a "Load more" button.
- Footer text at 11–12px grey on grey.
- The only route to the cookie settings, cancellation or imprint being the bottom of a single page, rather than every page.
- A second, different primary CTA in the footer ("Book a call" when the page goal is "Start free trial").

## Good references
- [Plausible](https://plausible.io) — a fat footer grouped into Why Plausible, Explore, Resources and Company. Company carries Privacy, Data policy, Terms, DPA, Security, Compliance, Procurement and Imprint, which is everything an EU buyer's reviewer needs in one place.
- [Basecamp](https://basecamp.com) — the footer repeats "Try Basecamp free", then lists Status, Support, Security, Policies and Sign in, plus the parent-company line. It's plain, conventional and predictable.
- [GOV.UK Design System — Footer](https://design-system.service.gov.uk/components/footer/) — a documented, accessible footer component: inline meta links (cookies, accessibility statement, privacy), a licence line, and optional navigation columns.
- [NN/g — Footers 101](https://www.nngroup.com/articles/footers/) — the catalogue of footer content types (utility links, doormat nav, sitemap, secondary tasks, engagement) and design rules.

## Bad references
- [NN/g — Footers 101](https://www.nngroup.com/articles/footers/) — describes footers used as dumping grounds and bloated footers that slow page loading, and warns against full sitemaps on large sites.
- [e-recht24 — Digitale-Dienste-Gesetz](https://www.e-recht24.de/datenschutz/13328-digitale-dienste-gesetz-ddg.html) — documents that imprints still citing § 5 TMG are outdated after May 2024 and can draw costly warning letters (Abmahnungen) in Germany.
- Generic SaaS template pattern (no single site named): a footer with 7 columns, many "Resources" links to thin SEO pages, social icons without names, and no cookie settings link.

## Accessibility
- Use exactly one page-level `<footer>` that is a direct child of `<body>` (not inside `<main>`, `<article>` or `<section>`), so it maps to the `contentinfo` landmark (`a11y-structure-landmarks-headings.md`). Don't add `role="contentinfo"` to section-level footers.
- Wrap link columns in `<nav aria-label="Footer">`. Each group heading is a real heading (`<h2>` styled small) or the list's label, so screen reader users can jump between groups.
- Social icon links get names ("Plausible on Mastodon"); the SVG is `aria-hidden="true"`.
- The language selector uses `lang` and `hreflang` on each option link.
- The newsletter input has a visible label, `autocomplete="email"`, and announces success or error in a live region.

## Motion / interaction (if relevant)
- None needed. Link hover is an underline or colour change over `--mk-hover-duration` (150ms). No parallax and no reveal animation on the footer.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--surface-2` or `[data-tone="inverse"]` | role tokens | footer and CTA band background |
| `--mk-section-space` | clamp(64px, …, 144px) | CTA band padding |
| `--mk-step--1` | ~13–14px | footer links and legal line |
| `--text-muted` | role token | secondary text, verify ≥4.5:1 on the footer surface |
| `--mk-grid-gap` | clamp(12px, …, 24px) | column gap |
| Columns × links | 3–5 × 3–7 | more → sitemap page |
| Link row height | ≥44px touch, ≥24px fine pointer | WCAG 2.5.5 / 2.5.8 |
| Social links | ≤5 | |

## Implementation sketch
```html
<section class="mk-section cta-band" data-tone="inverse" aria-labelledby="final-h">
  <h2 id="final-h" class="mk-h2">Start monitoring in two minutes</h2>
  <a class="mk-cta" href="/signup">Start free trial</a>
</section>
<footer class="site-footer">
  <nav class="mk-container site-footer__nav" aria-label="Footer">
    <div><h2>Product</h2><ul><li><a href="/pricing">Pricing</a></li><li><a href="/changelog">Changelog</a></li></ul></div>
    <div><h2>Company</h2><ul><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></div>
    <div><h2>Trust</h2><ul><li><a href="https://status.example.com">Status</a></li><li><a href="/security">Security</a></li></ul></div>
  </nav>
  <div class="mk-container site-footer__legal">
    <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/imprint">Imprint</a>
    <button type="button" class="link-button" data-open-consent>Cookie settings</button>
    <a href="/de/" hreflang="de" lang="de">Deutsch</a>
  </div>
</footer>
```
```css
.cta-band { text-align: center; display: grid; justify-items: center; gap: var(--mk-block-space); }
.site-footer { background: var(--surface-2); color: var(--text); padding-block: var(--space-8, 64px) var(--space-6, 32px); font-size: var(--mk-step--1); }
.site-footer__nav { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: var(--mk-grid-gap); }
.site-footer h2 { font: 600 var(--mk-step--1) / 1.4 var(--mk-font-body); margin-block-end: var(--space-2, 8px); }
.site-footer ul { list-style: none; padding: 0; margin: 0; }
.site-footer a, .site-footer .link-button {
  display: inline-flex; align-items: center; min-block-size: 24px;
  color: var(--text-muted); text-underline-offset: 3px;
}
.site-footer__legal { display: flex; flex-wrap: wrap; gap: var(--space-2, 8px) var(--space-5, 24px); margin-block-start: var(--space-7, 48px); padding-block-start: var(--space-5, 24px); border-block-start: 1px solid var(--border); }
.link-button { background: none; border: 0; padding: 0; font: inherit; cursor: pointer; text-decoration: underline; }
@media (pointer: coarse) {
  .site-footer a, .site-footer .link-button { min-block-size: 44px; }
}
@media (hover: hover) {
  .site-footer a:hover, .site-footer .link-button:hover { color: var(--text); }
}
.site-footer a:focus-visible, .site-footer .link-button:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
```

## Checklist
- [ ] The page ends with one CTA band using the page's primary CTA label, then the footer.
- [ ] There is exactly one `<footer>` as a direct child of `<body>`, exposed as `contentinfo`, with link groups in `<nav aria-label="Footer">`.
- [ ] Privacy, terms, cookie settings and contact are linked on every page; Impressum for DE/AT audiences; a cancellation link for DE subscriptions.
- [ ] Link groups are 3–5 columns of at most 7 links, with no vague "Resources" dumping group.
- [ ] Footer links are ≥44px tall under `pointer: coarse` and muted text is ≥4.5:1 on the footer surface.
- [ ] Social icon links and the newsletter field have accessible names and visible labels.

## Sources
- https://www.nngroup.com/articles/footers/ (Fessenden, 2019)
- https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/contentinfo.html
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer
- https://www.ihk-muenchen.de/ratgeber/recht/internetrecht/impressum/ (§ 5 DDG replaces § 5 TMG, 14 May 2024)
- https://www.e-recht24.de/datenschutz/13328-digitale-dienste-gesetz-ddg.html
- https://www.wko.at/internetrecht/website-impressum (Austria: § 5 ECG, § 25 MedienG)
- https://www.gesetze-im-internet.de/bgb/__312k.html (Kündigungsbutton)
- https://gdpr-info.eu/art-7-gdpr/ (Art. 7(3) withdrawal as easy as consent)
- https://oag.ca.gov/privacy/ccpa (Do Not Sell or Share link)
- https://design-system.service.gov.uk/components/footer/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://plausible.io · https://basecamp.com (footers checked November 2026)
