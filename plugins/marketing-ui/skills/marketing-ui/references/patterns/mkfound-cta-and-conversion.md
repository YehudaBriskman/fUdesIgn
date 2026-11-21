# CTAs and conversion evidence

> Give each view one primary CTA whose label names the action and its outcome, put the risk reversers right beside it, strip every form field you cannot justify, and never manufacture urgency.

**Category:** Foundations · **Applies to:** hero and section CTAs, sign-up and demo forms, checkout steps, pricing buttons, CTA bands · **Priority:** must

## When to use / when not
- Use for every button or link that asks for commitment: sign up, start trial, book demo, buy, subscribe, join waitlist.
- Use the evidence grades below whenever someone proposes a change "because a case study showed +X%".
- Not for in-app actions inside a product. Those follow `comp-button-hierarchy.md` (dashboard-ui).

## Rules (do)
- **Grade the evidence before you act on it.** Each claim below is tagged:
  - **[A]** large-sample usability or measurement research, such as Baymard benchmarks, NN/g eyetracking, or peer-reviewed studies.
  - **[B]** vendor A/B tests or vendor data: one site or one customer base, often unreplicated, with survivorship bias.
  - **[C]** practitioner opinion.
  A [B] result is a hypothesis to test on your own traffic, never a rule.
- **One primary CTA per view [C, consistent with A].** Every design system cited in `comp-button-hierarchy.md` allows one filled primary per region. NN/g found that 57% of viewing time stays above the fold [A], so that one button must be in the first viewport. A secondary action is outlined or a text link.
- **Label = verb + outcome [C].** Use "Start free trial", "Book a 20-minute demo" or "Get the PDF", not "Submit", "Learn more" or "Click here". Keep it to 2–5 words, in sentence case. The label must match what happens next: if the button leads to a form, don't say "Get instant access".
- **First person ("Start my trial") is a vendor test result, not a rule [B].** Michael Aagaard reported a 90% click-through lift for "Start my free 30 day trial" over "your" on one Unbounce page after 3 weeks. Sample sizes were not published, and it is one page in one language. Test it; don't assume it.
- **Size and contrast.** The CTA height is `--mk-cta-height` (48px) and never below 44×44 CSS px on touch (WCAG 2.5.5 AAA; 2.5.8 AA sets the 24px floor). Label text is ≥4.5:1 on the fill. The button edge is ≥3:1 against the section (SC 1.4.11). It is the only element in the view that uses `--brand-accent` as a fill.
- **Cut fields [A].** Baymard's benchmark finds the average US checkout shows 23.48 form elements (14.88 fields), while 12–14 elements (7–8 fields) is achievable. On a SaaS sign-up, ask for email and password, or SSO, and nothing else. Collect company size, role and phone after activation.
- **Offer a guest or SSO path [A].** In Baymard's abandonment survey, 18% of US shoppers who abandoned for reasons other than browsing said the site wanted them to create an account. "Sign up with Google" next to the primary is the SaaS equivalent (Stripe does this in its hero).
- **Show the total cost early [A].** Baymard's average documented abandonment rate is 70.22% across 50 studies. Among non-browsing reasons, extra costs such as shipping, tax and fees lead at 40%. On pricing and buy buttons, state the price and the billing period beside the button.
- **Use risk-reversal microcopy under the CTA [C, B for effect size].** One line of `--mk-step--1` text such as "14-day trial · no credit card · cancel anytime". Only write what is true. Vendor data (ChartMogul via Userpilot, Adapty) reports that opt-in, no-card trials get more sign-ups but convert to paid at a lower rate (about 18% vs 49% in Adapty's app data) [B]. Choose by business model, then say plainly which one you run.
- **Urgency and scarcity only when real.** A countdown must end when it says. A stock count must be live. Otherwise it is a dark pattern (see Anti-patterns).
- **Test properly or don't claim a win.** Fix the sample size and duration before the test starts and don't stop when it "hits significance" (CXL's 10,000-run simulation: stopping at the first significant peek gave false positives on 30% of no-difference tests at 90% confidence, against 10% expected). Run full weeks. Treat a single test under a few hundred conversions per arm as noise. Convert's analysis of 28,304 experiments found only 20% reached 95% significance [B].

## Anti-patterns (don't)
- Fake timers, "only 2 left" banners with plentiful stock, and "14 people are viewing this" without real data. The FTC's 2022 staff report "Bringing Dark Patterns to Light" lists false scarcity and fake countdown timers as deceptive design.
- Confirmshaming on the decline link ("No thanks, I prefer losing customers").
- A pre-ticked newsletter or add-on box. Sneaking is one of the 7 categories in Mathur et al.
- Two filled CTAs side by side, or a primary in the sticky header plus a different primary in the hero.
- "Free" in the button with a card form on the next screen and no warning.
- Generalising "+300% conversions" from a vendor case study to your page.

## Good references
- [Stripe](https://stripe.com) — the primary "Get started" sits beside a secondary "Sign up with Google": one emphasis level each, and the SSO path removes the password field.
- [Plausible](https://plausible.io) — "Start free trial" plus "View live demo". The secondary lets a sceptic verify the product without committing, and the trial terms are stated plainly in the pricing section.
- [Baymard — Checkout UX benchmark](https://baymard.com/research-articles/current-state-of-checkout-ux) — the field-count and account-creation data behind the friction rules.
- [CXL — A/B testing statistics](https://cxl.com/blog/ab-testing-statistics/) — fixed horizons, why significance is not a stopping rule, and why case studies with tiny samples mislead.

## Bad references
- [Mathur et al., Dark Patterns at Scale (CSCW 2019)](https://webtransparency.cs.princeton.edu/dark-patterns/) — a crawl of ~11,000 shopping sites and ~53,000 product pages found 1,818 dark pattern instances on 1,254 sites. 234 instances on 183 sites were outright deceptive, including fake countdowns and fake low-stock messages.
- [FTC staff report, September 2022](https://www.ftc.gov/reports/bringing-dark-patterns-light) — catalogues fake urgency, false scarcity, hidden costs and hard-to-cancel flows as practices it treats as deceptive or unfair (read through law-firm summaries; the PDF was not loaded).
- [EU Digital Services Act, Article 25](https://eur-lex.europa.eu/eli/reg/2022/2065/oj) — bars online platforms from interfaces that deceive or manipulate users or impair free choice. Practices covered by the UCPD or GDPR are carved out and handled under those laws.

## Accessibility
- A CTA that navigates is an `<a href>`. A CTA that submits a form is a `<button type="submit">`. Don't use `<div onclick>`.
- The accessible name starts with the visible label (SC 2.5.3 Label in Name). Don't add `aria-label="Click here to start"` over "Start free trial".
- Microcopy under the button is plain text, not a tooltip, so touch and screen reader users get it.
- Repeated CTAs keep the same name and destination (SC 3.2.4).
- Countdown timers that are real must be pausable if they update more often than needed (SC 2.2.2) and must not trap focus.

## Motion / interaction (if relevant)
- Hover darkens the fill over `--mk-hover-duration` (150ms). Press feedback is instant. No pulsing, wiggling or glowing "attention" animation on CTAs; it reads as an ad and fails `prefers-reduced-motion`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-cta-height` | 48px | ≥44px touch target |
| `--mk-cta-pad-inline` | 24px | |
| `--mk-cta-radius` | `--radius-md` (8px) | |
| `--mk-cta-font` | 600 `--mk-step-0` | sentence case, 2–5 words |
| Microcopy | `--mk-step--1`, `--text-muted` | ≤ 1 line, ≥4.5:1 |
| Sign-up fields | 1–3 (email, password or SSO) | Baymard checkout ideal 7–8 fields |

**Evidence grades for common claims:**

| Claim | Grade | Basis |
|---|---|---|
| Most attention stays in the first screen (57% / 74% in two) | A | NN/g eyetracking, 120 users, 2018 |
| Fewer form fields reduce abandonment | A | Baymard checkout benchmark and abandonment survey |
| Unexpected costs are the top checkout abandonment reason (40%) | A | Baymard survey, 50-study average 70.22% |
| Fake urgency and scarcity are common and deceptive | A | Mathur et al., 11k sites, peer-reviewed |
| "My" beats "your" in button copy | B | Single Unbounce page, 2013, no sample size published |
| No-card trials: more sign-ups, lower paid conversion | B | ChartMogul / Adapty vendor data |
| Green or orange buttons convert better | C | No generalisable evidence; contrast matters, hue does not |
| One primary CTA per view | C | Design-system consensus, consistent with A |

## Implementation sketch
```html
<form class="cta-form" action="/signup" method="post">
  <label for="cta-email">Work email</label>
  <div class="cta-row">
    <input id="cta-email" name="email" type="email" autocomplete="email" required>
    <button type="submit" class="mk-cta">Start free trial</button>
  </div>
  <p class="cta-note">14-day trial · no credit card · cancel anytime</p>
  <a class="mk-cta" data-variant="secondary" href="/auth/google">Sign up with Google</a>
</form>
```
```css
.cta-form { display: grid; gap: var(--space-2, 8px); max-inline-size: 30rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: var(--space-2, 8px); }
.cta-row input {
  flex: 1 1 14rem;
  min-block-size: var(--mk-cta-height);
  padding-inline: var(--space-4, 16px);
  border: 1px solid var(--border-strong);
  border-radius: var(--mk-cta-radius);
  background: var(--surface);
  color: var(--text);
}
.cta-note { font-size: var(--mk-step--1); color: var(--text-muted); }
@media (pointer: coarse) {
  .mk-cta { min-block-size: max(var(--mk-cta-height), 44px); }
}
```

## Checklist
- [ ] Each viewport has at most one filled primary CTA, and the hero one is in the first viewport at 360×640.
- [ ] Every CTA label is a verb plus an outcome, 2–5 words, and matches what happens next.
- [ ] CTA targets measure ≥44×44 CSS px on touch; label ≥4.5:1, edge ≥3:1.
- [ ] Sign-up asks for 3 fields or fewer, or offers SSO.
- [ ] Price, billing period and trial terms are stated beside pricing CTAs.
- [ ] No timer, stock count or viewer count on the page is fake or reset on reload.
- [ ] Any "proven" change cites its grade; [B] claims have a planned test with a fixed sample size.

## Sources
- https://www.nngroup.com/articles/scrolling-and-attention/
- https://baymard.com/lists/cart-abandonment-rate (70.22%, 50 studies; 40% extra costs; 18% account creation; 23.48 vs 12–14 elements)
- https://webtransparency.cs.princeton.edu/dark-patterns/ (Mathur et al., CSCW 2019)
- https://www.ftc.gov/reports/bringing-dark-patterns-light (staff report PDF, 14 Sep 2022: countdown timers, false scarcity, drip pricing, hard-to-cancel flows)
- https://eur-lex.europa.eu/eli/reg/2022/2065/oj (DSA Art. 25(1) and 25(2), read on EUR-Lex)
- https://cxl.com/blog/ab-testing-statistics/ and https://cxl.com/blog/peeking-sequential-testing/ (10,000 simulations; 30% false positives with peeking at 90% confidence)
- https://www.convert.com/blog/a-b-testing/experiments-statistical-significance-speed/ (28,304 experiments)
- https://unbounce.com/conversion-rate-optimization/design-call-to-action-buttons/ (Aagaard, 22 May 2013: "Start my free 30 day trial" +90% CTR after 3 weeks)
- https://userpilot.com/blog/how-to-increase-free-trial-conversion/ and https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/ (vendor trial data)
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
