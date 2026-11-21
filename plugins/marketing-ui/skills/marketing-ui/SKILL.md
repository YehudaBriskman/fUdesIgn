---
name: marketing-ui
description: Design, build or review landing pages, marketing sites and product pages with researched rules and concrete tokens. Use when creating or restyling a landing page, home page, product or feature page, pricing page, hero section, social proof, testimonials, logo wall, feature grid or bento, FAQ, footer, CTA, or when choosing display typography, colour and art direction, dark sections or scroll motion; when improving LCP, fonts, SEO metadata or OG images of a marketing page; or when asked to critique, audit or score one, or to make it look less generic or "less AI". Trigger even without the word "landing": "website for my startup", "pricing section", "make the hero pop", "sign-up page", "waitlist page".
---

# Marketing UI

A research-backed playbook for pages that persuade: 19 pattern files, each with rules, anti-patterns, good and bad references (real sites, named and linked), accessibility, tokens, an implementation sketch and a checklist. This file gives the workflow, the non-negotiables and the decision tables. Open the pattern files for depth.

- **Pattern index:** `references/INDEX.md` lists every pattern with its one-line rule.
- **Pattern files:** `references/patterns/<prefix>-<name>.md`. The prefixes are `mkfound` (narrative, conversion evidence, accessibility), `mksect` (hero, proof, features, pricing, FAQ, footer), `mkstyle` (type, colour, dark sections, motion, generated-default tells), `mkperf` (LCP, fonts, SEO metadata) and `mkref` (anti-pattern gallery, review rubric).
- **Tokens:** `assets/marketing.css`, a marketing layer (fluid type, section rhythm, containers, CTA, inverse band, reveal) on top of the dashboard-ui role tokens. Load `plugins/dashboard-ui/skills/dashboard-ui-design/assets/tokens.css` first for dark mode and status colours; without it, the light fallbacks apply.

Marketing pages are not product screens. This skill allows what dashboard-ui forbids on a working screen (display type, one inverse band, one orchestrated motion moment) and forbids what generators do by default. For signed-in app screens, use dashboard-ui.

## Workflow

1. **Ground the page in the subject.**
   - Write down the product, the audience, the one goal (sign-up, demo, purchase, waitlist) and the visitor's awareness of the problem. If the brief does not say, propose them and confirm.
   - Collect the real material: product screenshots, customer names you may use, numbers with sources, the 5–10 objections sales and support hear. A page without real proof is a draft.
2. **Plan in two passes before code.**
   - Pass 1: a six-line plan: goal and CTA label, section order (`mkfound-page-narrative.md`), headline, type pairing (`mkstyle-display-type-pairing.md`), palette and art direction (`mkstyle-colour-art-direction.md`), the one motion moment (`mkstyle-scroll-motion.md`).
   - Pass 2: read the plan against `mkstyle-generated-default-tells.md` and rewrite every line that would fit any product in the category. Say what changed.
3. **Build the sections in narrative order:** hero (`mksect-hero.md`) → proof (`mksect-social-proof.md`) → features (`mksect-features-and-bento.md`) → pricing if any (`mksect-pricing-tables.md`) → objections (`mksect-faq-and-objections.md`) → final CTA band and footer (`mksect-footer.md`). CTA copy and evidence: `mkfound-cta-and-conversion.md`.
4. **Style.** Start from `assets/marketing.css`. One display face plus one text face, one accent spent in one place per view, real product imagery. Inverse bands only as `mkstyle-dark-sections.md` allows.
5. **Hold the floor while building, not after.** Accessibility (`mkfound-accessibility-floor.md`), LCP and media (`mkperf-lcp-and-hero-media.md`), fonts (`mkperf-web-fonts.md`), headings and metadata (`mkperf-seo-headings-and-metadata.md`).
6. **Review before calling it done.**
   - Capture 360×640, 768×1024 and 1440×900 screenshots, a reduced-motion pass and a mobile trace.
   - Run `mkref-anti-patterns-gallery.md` (13 documented failures) and the tells catalogue.
   - Score `mkref-review-rubric.md` (35 checks, 0–2 each). Ship at 80% or more with no must-check at 0. Report the score and failed checks with evidence. Prefer a reviewer who did not build the page.

## Non-negotiables

Break one only with a written reason.

**Narrative and conversion**
1. One page, one goal, one primary CTA label. It closes the hero and every major section with the same words and destination.
2. The h1 says what the product is and for whom in 6–12 words. At 360×640 the h1, subhead and primary CTA are visible without scrolling.
3. Show the real product (UI, video or demo), never a stock photo, an abstract blob or a carousel.
4. Proof is checkable: permitted logos, named people with role and company, outcome numbers with a source. Nothing invented, nothing auto-rotating, paid endorsements disclosed (FTC 16 CFR 465 and 255).
5. Price, security and cancellation terms are visible outside collapsed FAQ items. Pricing shows real numbers, unit, currency and tax status.
6. No manufactured urgency, confirmshaming, fake timers or pre-ticked consent. Regulators fine these (FTC, CMA, CNIL).
7. Grade the evidence before citing it: usability research (Baymard, NN/g) over vendor A/B case studies over opinion. A vendor's "+300%" is never a rule.

**Style**

8. Refuse the generated-default tells unless the brief earns one in a sentence: overused display faces, purple-to-blue gradients, gradient text, eyebrow chips, accented headline words, identical icon-tile grids, glow halos, emoji icons, buzzword copy, the same fade-up on every section.
9. At most two families and about four weights. Display tracking −0.01 to −0.04em, leading 1.0–1.15; body leading 1.5–1.7, measure 45–75ch. Fluid sizes keep max ≤ 2.5× min.
10. One accent per view. Every text pair meets 4.5:1, measured over the worst pixel when text sits on an image or gradient.
11. At most two inverse bands per light page, each re-declaring the role tokens with `color-scheme: dark`. Long reading copy stays on the light ground.
12. One orchestrated motion moment. Reveals ≤ 600 ms and ≤ 24 px, transform and opacity only, content visible without JS, no scroll-jacking, reduced motion removes movement, nothing moves for more than 5 s without a pause control.

**Floor**

13. Landmarks, a skip link, `lang`, one h1 with no skipped levels, real alt text, captions, visible focus never hidden by sticky bars, targets ≥ 24×24 px (CTAs 48 px).
14. LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms at p75 mobile. The LCP image is in the HTML, not lazy, `fetchpriority="high"`, sized, AVIF or WebP.
15. Fonts: self-hosted WOFF2, ≤ 2 families and about 4 critical files, preload ≤ 2, metric-matched fallbacks.
16. A unique title and description, a canonical URL, Open Graph and Twitter tags with a 1200×630 image and alt text.

## Decision tables

**Section order by goal** (`mkfound-page-narrative.md`)

| Goal | Order |
|---|---|
| Self-serve sign-up | Hero (CTA + product visual) → logos → 3–5 features → how it works → testimonials → pricing summary → FAQ → final CTA |
| Demo request | Hero (demo CTA) → logos + case-study numbers → problem → features → security and integrations → testimonials → FAQ → final CTA |
| Purchase | Hero (product, price, buy) → key benefits → details and specs → reviews → delivery, returns, guarantee → FAQ → final buy |
| Waitlist | Hero (promise + email field) → 3 benefits or a preview → who is behind it → final field |

**Hero visual** (`mksect-hero.md`)

| Product | Visual |
|---|---|
| Software with a UI | Real UI crop or short muted loop with a poster frame |
| API or developer tool | Real code and its result |
| Physical product | Photography of the product in use |
| Service | Real people doing the work, or the deliverable |

**Evidence grade** (`mkfound-cta-and-conversion.md`)

| Grade | Kind | Use |
|---|---|---|
| A | Large-sample usability or measurement research (Baymard, NN/g, peer-reviewed) | Rule |
| B | Vendor A/B tests and benchmarks | Hypothesis to test on this page |
| C | Practitioner opinion | Taste; label it |

## Token defaults

Full set in `assets/marketing.css`.

| Group | Defaults |
|---|---|
| Type scale | fluid 360→1280 px, ratio 1.2→1.25; body 16→18 px; display 40→72 px |
| Leading and tracking | display 1.05 / −0.025em · heading 1.15 · body 1.6 |
| Measure | body 65ch · lead 52ch · headline 18ch |
| Layout | container 72rem · wide 84rem · prose 42rem · gutter 16–40 px · section space 64–144 px |
| CTA | 48 px tall · 24 px inline padding · radius 8 px |
| Motion | reveal 400 ms, 16 px, view-timeline, reduced-motion safe |
| Inverse band | `[data-tone="inverse"]` re-declares the dashboard-ui dark roles |

## How to apply this skill

- **When building:** follow the workflow, start from `assets/marketing.css`, prefer platform features (`<details>`, `<picture>`, `fetchpriority`, `animation-timeline`, `text-wrap: balance`). Never use the TypeScript `any` type.
- **When reviewing:** collect evidence first, then run the gallery, the tells and the rubric. Report a table of check, score, evidence and fix, ordered by severity.
- **When the project has a brand or design system:** its tokens and type win. Map them onto these roles and flag gaps instead of overriding them.
- **When rules conflict:** accessibility and honesty beat conversion tricks and aesthetics; graded evidence beats taste.
