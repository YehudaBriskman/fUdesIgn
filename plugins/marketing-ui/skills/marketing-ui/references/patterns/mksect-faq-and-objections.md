# FAQ and objection handling

> Answer the 5–10 real objections that sales and support hear most (price, security, migration, cancellation) in plain sentences near the final CTA, and never use the FAQ to hide something a buyer needs to decide (the dark-pattern test is `uxeth-choice-architecture-and-dark-patterns.md`).

**Category:** Sections · **Applies to:** landing-page FAQ blocks, pricing-page FAQs, product-page objection sections, standalone help FAQs · **Priority:** should

## When to use / when not
- Use a short FAQ near the end of a landing or pricing page, just before the final CTA band, where hesitation peaks (see `mkfound-page-narrative.md`).
- Use it for questions that are real, recurring and answerable in 1–4 sentences.
- Don't use a FAQ as the main content of a page. Government content guides (plainlanguage.gov, GOV.UK-style guides from Bristol and Co-op) warn that FAQs fragment information and make it hard to find.
- Don't put decision-critical facts only in the FAQ. Price, billing period, trial terms, data location and how to cancel must also appear in the body or beside the CTA.

## Rules (do)
- **Source questions from evidence, not imagination.** Pull the top objections from sales call notes, support tickets, chat transcripts, cancellation surveys and on-site search logs. Rank them by frequency. A question nobody asks ("Why is our product so great?") is marketing copy dressed as a FAQ.
- **5–10 questions on a landing page.** Fewer than 5 rarely covers the main objections. More than 10 belongs on a help page, grouped by topic and linked from the landing page.
- **Cover the four objections that block most purchases:**
  - **Pricing:** what is included, what happens at the limit, taxes, annual vs monthly, discounts.
  - **Security and privacy:** where data is stored, certifications held (only real ones), DPA availability, SSO.
  - **Migration and setup:** import from the competitor by name, how long it takes, who helps.
  - **Cancellation and lock-in:** how to cancel, what happens to data, export format, refunds.
- **Write questions in the customer's words** ("Can I import from Jira?"), not the company's ("Migration capabilities"). Start the answer with yes, no or the number, then explain in 1–3 sentences. Link out for more.
- **Accordion or open list?** NN/g recommends accordions when users need only a few independent answers. They suit a FAQ, which is mostly scanned for one question. Show the answers openly instead when there are 5 or fewer short answers, or when most visitors need most of them, because collapsed content is easily overlooked.
- **Use `<details>`/`<summary>`.** It is native, keyboard and screen reader accessible, and needs no JS. Allow several items open at once; NN/g advises against auto-collapsing. Don't use the `name` attribute (exclusive accordion) here. Make the whole question row clickable, and use a caret or plus icon, which NN/g found work best.
- **Find-in-page:** Chrome/Edge 97+ and Firefox 148+ auto-expand a closed `<details>` when Ctrl/Cmd+F matches text inside (Firefox 139–147 and Safari 26.2 expand it but don't scroll to the match correctly; older browsers don't expand it), which is one more reason to keep critical facts outside the accordion.
- **Structured data: don't expect a rich result.** Google limited FAQ rich results to well-known government and health sites on 8 August 2023. It then announced they would stop showing in Search from 7 May 2026, and removed the documentation on 15 June 2026. `FAQPage` markup is still valid schema.org and harmless. Add it only if it costs nothing. Never add it for a SERP feature, and never mark up questions that are not visible on the page.
- **End with a route to a human:** "Still unsure? Talk to us" with a contact link or chat, then the final CTA band.

## Anti-patterns (don't)
- Hiding the auto-renewal, the cancellation fee or the card requirement inside a collapsed answer while the hero says "Free".
- 25 questions in one accordion, ungrouped.
- Questions nobody asked, written to repeat feature claims.
- Answers that dodge ("It depends") without saying on what.
- A JS accordion built from `<div>`s with no button role, no `aria-expanded` and no keyboard support.
- An accordion that closes the open item when another opens, so two answers can't be compared.
- FAQPage schema on content that is not visible, or on every page of the site.

## Good references
- [NN/g — Accordions on desktop](https://www.nngroup.com/articles/accordions-on-desktop/) — when accordions help (few independent answers, as in FAQs), when they hurt (users need most of the content), clickable headings, caret or plus icons, and expand-all for printing.
- [NN/g — FAQs deliver value](https://www.nngroup.com/articles/faqs-deliver-value/) — a FAQ shows the organisation is listening, if the questions are real and the answers direct.
- [Basecamp pricing](https://basecamp.com/pricing) — the 30-day trial, "pick a package when your trial ends", and self-serve cancellation with no contract are stated in the pricing copy itself. The "I have pricing questions" FAQ then handles the second-order questions (upgrades, discounts, users, storage).
- [Plausible](https://plausible.io) — the trial terms, data location ("made and hosted in the EU") and the DPA, security and compliance pages are linked from the page and footer, so a security reviewer finds them without opening an accordion.

## Bad references
- [FTC — Bringing Dark Patterns to Light (2022)](https://www.ftc.gov/reports/bringing-dark-patterns-light) — lists burying key terms and hard-to-cancel subscriptions among deceptive practices. A FAQ that is the only place the renewal terms appear is exactly this.
- [plainlanguage.gov — Avoid FAQs](https://plainlanguage.gov/guidelines/web/avoid-faqs/) — explains how FAQ pages replace structured content with a pile of questions; FAQs should supplement, not replace.
- [Google Search Central — FAQ rich result changes (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — documents why "add FAQ schema for SERP space" advice from older SEO guides is obsolete.

## Accessibility
- `<summary>` is the button. Don't put headings, links or other interactive elements inside it. If questions need to appear in the heading outline, wrap the text in an `<h3>` inside `<summary>`; it is allowed, but test with VoiceOver and NVDA, because some screen readers then announce the item oddly.
- The open/closed state is announced natively. Don't add `aria-expanded` to `<details>`.
- The focus ring is visible on `<summary>`, and the target is ≥44px tall on touch.
- The marker icon is decorative. Rotate a CSS chevron; don't use an icon font glyph that screen readers read.
- Provide "Expand all" only if the list is longer than 8 items. Open all items on `beforeprint` so the printout shows every answer (sketch below).

## Motion / interaction (if relevant)
- Opening is instant by default. If you animate height, use `interpolate-size: allow-keywords` and `::details-content` where supported, within `--motion-dur-medium` (240ms), and skip it under `prefers-reduced-motion`. Rotating the chevron over `--motion-dur-short` (150ms) is enough feedback.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-container-prose` | 42rem | FAQ column width |
| `--mk-step-1` | ~19–22px | question text |
| `--mk-step-0` / `--mk-leading-body` | 16–18px / 1.6 | answer text |
| `--border` | role token | divider between items |
| `--space-4` / `--space-5` | 16px / 24px | summary padding / gap |
| Questions per landing page | 5–10 | >10 → help page |
| Answer length | 1–4 sentences, first word answers | link for detail |

## Implementation sketch
```html
<section class="mk-section faq" aria-labelledby="faq-h">
  <div class="mk-container faq__inner">
    <h2 id="faq-h" class="mk-h2">Questions before you switch</h2>
    <details class="faq__item">
      <summary>Do I need a credit card to start?</summary>
      <p>No. The 14-day trial needs only an email. We ask for payment when you choose a plan.</p>
    </details>
    <details class="faq__item">
      <summary>Can I import my data from Jira?</summary>
      <p>Yes. The importer copies issues, comments and attachments, usually in under 10 minutes. <a href="/docs/import">Import guide</a></p>
    </details>
    <p class="faq__human">Still unsure? <a href="/contact">Talk to a person</a></p>
  </div>
</section>
```
```css
.faq__inner { max-inline-size: var(--mk-container-prose); }
.faq__item { border-block-end: 1px solid var(--border); }
.faq__item summary {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-4, 16px);
  min-block-size: 44px; padding-block: var(--space-4, 16px);
  font: 600 var(--mk-step-1) / 1.3 var(--mk-font-body);
  cursor: pointer; list-style: none;
}
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after {
  content: ""; flex: none; inline-size: 10px; block-size: 10px;
  border-inline-end: 2px solid currentColor; border-block-end: 2px solid currentColor;
  rotate: 45deg;
}
.faq__item[open] summary::after { rotate: 225deg; }
.faq__item summary:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.faq__item p { padding-block-end: var(--space-5, 24px); line-height: var(--mk-leading-body); max-inline-size: var(--mk-measure); }
@media (prefers-reduced-motion: no-preference) {
  .faq__item summary::after { transition: rotate var(--motion-dur-short, 150ms) ease-out; }
}
```
```ts
// Closed <details> content does not print; open every item before printing.
window.addEventListener('beforeprint', () => {
  document.querySelectorAll<HTMLDetailsElement>('.faq__item:not([open])').forEach((d) => {
    d.open = true;
    d.dataset.printOpened = 'true';
  });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll<HTMLDetailsElement>('.faq__item[data-print-opened]').forEach((d) => {
    d.open = false;
    delete d.dataset.printOpened;
  });
});
```

## Checklist
- [ ] Every question traces to a sales, support or search-log source, and there are 5–10 of them.
- [ ] Pricing, security, migration and cancellation are each answered.
- [ ] Price, trial terms and cancellation are also stated outside the accordion.
- [ ] Each answer's first words answer the question, in 1–4 sentences.
- [ ] Items use `<details>`/`<summary>`, several can be open at once, and the summary is ≥44px tall with a visible focus ring.
- [ ] No FAQPage markup describes questions that are not visible on the page, and no one expects a FAQ rich result.

## Sources
- https://www.nngroup.com/articles/accordions-on-desktop/
- https://www.nngroup.com/articles/faqs-deliver-value/
- https://developers.google.com/search/blog/2023/08/howto-faq-changes (8 August 2023 limit)
- https://developers.google.com/search/updates (Search Central changelog: 8 May 2026 "Deprecating the FAQ rich result feature", no longer shown from 7 May 2026; 15 June 2026 "Removing documentation for the FAQ rich result feature")
- https://plainlanguage.gov/guidelines/web/avoid-faqs/
- https://www.ftc.gov/reports/bringing-dark-patterns-light (FTC staff report, September 2022)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- https://github.com/mdn/browser-compat-data/blob/main/html/elements/details.json (`search_match_opens`: Chrome 97, Firefox 148, partial in Firefox 139–147 and Safari 26.2) and https://bugzilla.mozilla.org/show_bug.cgi?id=1724299 (fixed in Firefox 139)
- https://basecamp.com/pricing · https://plausible.io
