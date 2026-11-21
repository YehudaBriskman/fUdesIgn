# Marketing page review rubric

> Score every marketing page on these 35 checks (0, 1 or 2 each) with evidence from screenshots, the DOM and a lab trace, and ship only at 80% or more of the applicable points with no must-check at 0.

**Category:** References · **Applies to:** landing pages, product pages, pricing pages, home pages of marketing sites, redesign reviews · **Priority:** must

## When to use / when not
- Use it before calling a marketing page done, when reviewing someone else's page, and as the acceptance test for a redesign. Score the old and the new page with the same rubric so the change is measured, not argued.
- Use it on one page at a time. A site review is a set of page scores plus the shared footer, navigation and metadata.
- Do not use it on signed-in product screens. Those follow the dashboard-ui `ref-design-review-rubric.md`, which forbids some things this rubric allows (an inverse band, display type, one orchestrated motion moment).
- The rubric checks craft and honesty, not whether the offer is good. A page can score 100% and still not convert. Pair it with real analytics and, when traffic allows, a properly powered test (`mkfound-cta-and-conversion.md`).

## Rules (do)
- **Collect evidence first, then score.** Capture at least:
  - screenshots at 360×640, 768×1024 and 1440×900, light theme and, if supported, dark;
  - one screenshot with `prefers-reduced-motion: reduce` emulated;
  - the DOM (or the built HTML) and the computed styles of the hero, CTAs and headings;
  - a Lighthouse or WebPageTest mobile trace (Moto G Power class, Slow 4G), plus CrUX field data if the URL has traffic.
- **Evidence tags.** Every check names how it is verified: [VIS] look at a screenshot, [DOM] inspect markup or computed style, [INT] interact (keyboard, zoom, resize), [PERF] read a trace or field data. A finding without evidence scores as not checked, never as a pass.
- **Score 0, 1 or 2.** 2 = met everywhere; 1 = met with the one exception the row allows; 0 = not met. Mark N/A only when the row says so (for example, no pricing on the page). The score is points ÷ (2 × applicable checks).
- **Ship bar:** 80% or more, and no **must** check at 0. A must at 0 blocks shipping regardless of the total.
- **Report** a table of ID, score, evidence (screenshot frame, selector or metric) and the fix, ordered by severity: musts at 0, then other 0s, then 1s.
- **Fresh eyes.** The reviewer gets the evidence and this rubric, not the builder's intent. The first question is "could this page belong to any product in the category?" (`mkstyle-generated-default-tells.md`).

## Anti-patterns (don't)
- Scoring from memory of the design file instead of the rendered page. Fonts, LCP and contrast over images only exist in the browser.
- Passing a check because it "mostly" holds. Use the 1 score for that, and write down the exception.
- Treating a vendor case study as evidence that a deviation is fine ("their test showed a carousel converts"). The rubric's bar is the pattern file's rule; a deviation needs this page's own data.
- Averaging away a must. Ninety percent with a lazy-loaded LCP image or a fake countdown does not ship.
- Reviewing only the desktop screenshot. Most marketing traffic is mobile; the HTTP Archive measures mobile first for that reason.

## Good references
- [web.dev – Core Web Vitals thresholds](https://web.dev/articles/vitals) — the 75th-percentile field thresholds (LCP 2.5 s, INP 200 ms, CLS 0.1) that the performance rows use.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — the success criteria cited by ID in section F, so a finding can be traced to the normative text.
- [NN/g – How to conduct a heuristic evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) — several independent evaluators, findings rated by severity; the model for the fresh-eyes rule.
- [Baymard – UX benchmark method](https://baymard.com/research/methodology) — scores each guideline against observed usability issues; the model for scoring against evidence, not taste.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) — terse, checkable rules with `file:line` review output; the model for the report format.

## Bad references
- Generic "landing page checklists" that mix opinion ("use orange buttons") with measured findings and cite vendor lifts as laws. They score taste, not outcomes; see `mkfound-cta-and-conversion.md` for evidence grades.
- A Lighthouse score alone. A green lab score on a fast desktop says little about p75 mobile LCP in the field, and it ignores honesty, proof and copy, which are half of this rubric.

## Accessibility
- Section F is the accessibility floor from `mkfound-accessibility-floor.md`. It is not optional and every row in it is a must or close to one.
- Run an automated checker (axe or WAVE) as a first pass, then the manual rows. Automated tools catch only part of WCAG failures; keyboard, zoom and alt-text quality need a person.

## Motion / interaction (if relevant)
- Score motion on a recording, not a still: record the first 5 s of load and one full scroll, then again with reduced motion emulated (G1–G2).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Ship bar | ≥ 80% of applicable points, no must at 0 | release gate |
| Viewports | 360×640 · 768×1024 · 1440×900 | evidence screenshots |
| LCP / INP / CLS | ≤ 2.5 s · ≤ 200 ms · ≤ 0.1 at p75 mobile | H1–H3 |
| Text contrast | ≥ 4.5:1 (≥ 3:1 at 24px, or 18.66px bold) | F3 |
| Target size | ≥ 24×24 px (WCAG 2.5.8), CTAs `--mk-cta-height` 48px | F5 |
| Headline length | 6–12 words | A2 |
| Logos / testimonials | 5–8 logos; named people with role and company | C1–C2 |

## Implementation sketch

### A. Narrative and hero (`mkfound-page-narrative.md`, `mksect-hero.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| A1 (must) | One page goal, one primary CTA label | [DOM] list every button and link styled as primary; compare labels | One label, one destination | Two labels for the same destination | Competing primary goals |
| A2 (must) | The h1 says what it is and for whom | [VIS] read h1 alone | Specific, 6–12 words | Clear but vague on audience | Slogan only |
| A3 | First viewport holds h1, subhead and primary CTA | [VIS] 360×640 and 1440×900 | Both sizes | One size | Neither |
| A4 | The hero visual is the real product | [VIS] | Real UI, video or demo | Stylised but true UI | Stock photo, abstract blob or carousel |
| A5 | Section order follows the goal table; every h2 states a claim | [DOM] read h1, h2s and CTAs only | Reads as an argument | 1–2 label-only h2s ("Features") | Order or headings carry no argument |

### B. CTAs and honesty (`mkfound-cta-and-conversion.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| B1 | CTA label names the action and outcome | [VIS] | All | One generic ("Submit", "Learn more") | Most generic |
| B2 | Risk reversers sit beside the CTA (trial terms, card needed or not, cancel terms) | [VIS] | Beside every primary CTA | Elsewhere on page | Absent |
| B3 (must) | No manufactured urgency, confirmshaming or pre-ticked consent | [INT] reload; decline any modal | None | — | Any |
| B4 | Forms ask only for justified fields | [DOM] count fields | ≤ 3 for sign-up or waitlist | 4–6 with reasons | More, unexplained |

### C. Proof, features, pricing, FAQ (`mksect-*`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| C1 (must) | Proof is checkable and permitted | [VIS] | Named people, roles, companies; real logos | Some anonymous quotes | Invented or unattributable proof |
| C2 | Proof states outcomes, appears within two screenfuls, does not auto-rotate | [VIS]/[INT] | All three | Two | One or none |
| C3 | Features lead with the benefit, 3–6 per section, real UI | [VIS] | All | Icons instead of UI in one section | Identical icon-tile grid |
| C4 | Bento and grid DOM order matches visual and mobile order | [DOM]/[INT] tab through; view at 360 | Matches | One tile out of order | Reading order scrambled |
| C5 (must) | Pricing shows real numbers with unit, currency and tax status (N/A if no pricing) | [VIS] | All tiers | One tier "Contact us" (enterprise) | Prices hidden |
| C6 | Comparison is a real `<table>` with `th` and scope; one recommended plan at most | [DOM] | Yes | Table without row headers | Div grid or several "best" plans |
| C7 | Price, security and cancellation are visible outside collapsed FAQ items | [VIS] | Yes | One only in the FAQ | Decision facts only in FAQ |

### D. Type, colour and art direction (`mkstyle-*`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| D1 | The page fails the "any product in the category" test | [VIS] fresh reviewer names the product from a cropped screenshot | Distinctive | Partly generic | Interchangeable |
| D2 | Generated-default tells: count them (`mkstyle-generated-default-tells.md`) | [VIS]/[DOM] | 0 unearned | 1–2 | ≥ 3 |
| D3 | At most 2 families, display tracking negative, body measure 45–75ch | [DOM] computed styles | All | One off | Two or more off |
| D4 | One accent spent in one place per view | [VIS] greyscale screenshot vs colour | Yes | Two accent zones | Accent everywhere |
| D5 | Inverse bands: ≤ 2, roles re-declared, `color-scheme: dark` (N/A if none) | [DOM] | All | One missing | Unreadable or > 2 alternations |

### E. SEO structure (`mkperf-seo-headings-and-metadata.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| E1 (must) | One h1, no skipped heading levels | [DOM] outline | Yes | One skip | Zero or several h1 |
| E2 | Unique `<title>` and meta description, canonical | [DOM] | All three | One missing | Two or more |
| E3 | Open Graph and Twitter tags with a 1200×630 image and alt | [DOM] fetch the image | Complete | Image without alt or wrong ratio | Missing |

### F. Accessibility floor (`mkfound-accessibility-floor.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| F1 (must) | Landmarks, skip link, `lang` | [DOM] | All | One missing | Two or more |
| F2 (must) | Meaningful alt on content images; decorative ones `alt=""` | [DOM] | All | One weak alt | Missing alt on content images |
| F3 (must) | Text contrast ≥ 4.5:1 incl. text over images and gradients (worst pixel) | [VIS]/[DOM] sample | All | — | Any failure |
| F4 (must) | Keyboard: visible focus, never hidden under sticky bars (2.4.7, 2.4.11) | [INT] Tab through the page | All | — | Any lost or hidden focus |
| F5 | Targets ≥ 24×24 px; CTAs ≥ 44px tall on touch | [DOM] | All | Footer links only | CTAs below 24px |
| F6 | Text reflows at 400% zoom / 320px and resizes to 200% (1.4.10, 1.4.4) | [INT] | No loss | Minor overlap | Content lost |

### G. Motion (`mkstyle-scroll-motion.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| G1 (must) | Reduced motion removes movement; nothing auto-moves > 5 s without pause (2.2.2) | [INT] emulate reduce | Yes | — | No |
| G2 | One orchestrated moment, no scroll-jacking, content visible without animation | [INT] recording; disable JS | Yes | Fade-up on every section | Scroll hijacked or content hidden |

### H. Performance (`mkperf-lcp-and-hero-media.md`, `mkperf-web-fonts.md`)
| ID | Check | Recipe | 2 | 1 | 0 |
|---|---|---|---|---|---|
| H1 (must) | LCP ≤ 2.5 s p75 mobile; LCP image not lazy, `fetchpriority="high"` | [PERF] | Both | Lab only passes | Fails or lazy LCP |
| H2 | CLS ≤ 0.1: media has dimensions, fonts have metric fallbacks | [PERF] | Yes | ≤ 0.25 | > 0.25 |
| H3 | Fonts: ≤ 2 families, ≤ about 4 critical files, WOFF2, preload ≤ 2 | [PERF] network panel | All | One over | More |

A minimal scoring helper, typed and strict:

```ts
type Score = 0 | 1 | 2 | 'na'
interface Finding { id: string; must: boolean; score: Score; evidence: string; fix: string }

export function verdict(findings: Finding[]): { percent: number; ship: boolean; blockers: string[] } {
  const scored = findings.filter((f): f is Finding & { score: 0 | 1 | 2 } => f.score !== 'na')
  const points = scored.reduce((sum, f) => sum + f.score, 0)
  const percent = scored.length ? Math.round((points / (2 * scored.length)) * 100) : 0
  const blockers = scored.filter((f) => f.must && f.score === 0).map((f) => f.id)
  return { percent, ship: percent >= 80 && blockers.length === 0, blockers }
}
```

## Checklist
- [ ] Evidence covers 3 viewports, reduced motion, the DOM and a mobile trace.
- [ ] Every row is scored 0, 1, 2 or N/A, each with a cited piece of evidence.
- [ ] No must check is at 0.
- [ ] The total is 80% or more of applicable points.
- [ ] The report is ordered by severity and every 0 has a concrete fix.
- [ ] The scorer did not build the page, or reviewed only the evidence.

## Sources
- https://web.dev/articles/vitals
- https://web.dev/articles/lcp
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://baymard.com/research/methodology
- https://vercel.com/design/guidelines
- https://almanac.httparchive.org/en/2024/performance
- https://webaim.org/projects/million/
- Pattern files of this plugin, named per section above; dashboard-ui `ref-design-review-rubric.md` for the scoring format.
