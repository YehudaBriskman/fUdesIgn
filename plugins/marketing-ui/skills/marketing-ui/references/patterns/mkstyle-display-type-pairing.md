# Display typography and type pairing

> Choose the display face from the subject and the brief, pair it with at most one other family that contrasts on one axis, and set it tight (−0.01 to −0.04em, leading 1.0–1.15) over body copy at 1.5–1.7 leading and a 45–75ch measure, with fluid sizes whose max is no more than 2.5× their min.

**Category:** Style (typography) · **Applies to:** hero h1, section h2, pull quotes, prices, body copy, captions, the `--mk-font-*` and `--mk-step-*` tokens · **Priority:** must

## When to use / when not
- Use on every marketing page. Type carries more of the brand than colour does on most landing pages, because it is on screen in every section.
- A product with an existing brand typeface uses it. This file then governs sizes, tracking, leading and measure, not the choice.
- One family is a valid answer. Anthropic's frontend-design skill says a second family is optional, and if you add one it must be clearly different. Basecamp's site runs almost entirely on one grotesque.
- Dashboards inside the product keep the dashboard-ui type rules (`found-typography-for-data.md`). Do not import a display face into data tables.

## Rules (do)
- **Pick from the subject, not from habit.** Write down 3 words for the subject's world (materials, era, vernacular) before opening a font catalogue. A synth maker (teenage.engineering) lands on a thin Univers; a project tool with a hand-drawn voice (basecamp.com) adds a marker face. If the choice would fit any SaaS page, choose again.
- **Max 2 families and about 4 weights in total** (for example display 700 + body 400/500/600). Each extra weight is another file to load (`mkperf-web-fonts.md`). Monospace counts as a family; use it only for code.
- **Pair by contrast on one axis, agreement on the rest.** Contrast: serif vs sans, wide vs condensed, or heavy vs light. Agreement: similar x-height (within about 5% at the same font-size) and similar proportions, so the two sit on one baseline rhythm. Two grotesques that differ only slightly look like a mistake.
- **Make the size steps visible.** Body to h2 at least 1.25× per step (Impeccable's `flat-type-hierarchy` rule fires below that). The hero h1 sits 2.2–4× body (`--mk-step-display` is 2.5–4.5rem over 1–1.125rem body). Anthropic's blog argues for jumps of 3× or more over 1.5×; treat that as opinion that suits one bold hero, not every heading.
- **Display tracking negative, scaled to size.** −0.01em at 32px, −0.02 to −0.03em at 48–72px, up to −0.04em above 80px. `--mk-track-display` is −0.025em. Never tighter than −0.07em: Impeccable's `extreme-negative-tracking` check treats −0.07em (body) and −0.09em (≥ 40px) as crushed.
- **Leading:** 1.0–1.15 for display (`--mk-leading-display` 1.05), 1.15 for h2/h3, 1.5–1.7 for body (`--mk-leading-body` 1.6). Serif body text gets the top of that range.
- **Measure 45–75ch for body**, 65ch as the default (`--mk-measure`). Baymard puts the optimum at 50–75 characters; Bringhurst's classic range is 45–75. Hero h1 wraps to 2–3 lines at about 18ch (`--mk-measure-headline`), the lead at about 52ch.
- **`text-wrap: balance` on headings, `text-wrap: pretty` on body.** Balance is in Chrome 114, Firefox 121 and Safari 17.5. Pretty is in Chrome 117 and Safari 26 but not Firefox (caniuse, Nov 2026); it degrades to normal wrapping, so ship it.
- **Fluid sizes with `clamp(rem, rem + vw, rem)`, max ≤ 2.5× min.** Maxwell Barvian showed that when the maximum is at most 2.5 times the minimum, text still reaches 200% at the 500% browser zoom cap (WCAG 1.4.4). Every `--mk-step-*` token meets this (display: 4.5/2.5 = 1.8). Always include a rem term so zoom moves the value.
- **Variable fonts and optical sizing.** Prefer one variable file over 4 static weights when it is smaller. Leave `font-optical-sizing: auto` on, so faces with an `opsz` axis (Inter 4, Roboto Flex, Fraunces) draw tighter display cuts at large sizes.
- **System stacks as the fallback, or as the choice.** Use the named stacks from modernfontstacks.com (CC0): Transitional `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif` is already `--mk-font-serif`. Industrial (`Bahnschrift, 'DIN Alternate', …`) and Old Style stacks give character with zero font requests.

## Anti-patterns (don't)
- Inter, Roboto, Arial or Space Grotesk as the display face by reflex. Anthropic's write-up notes that banning Inter moved the model's default to Space Grotesk, not to a choice. Impeccable's `overused-font` list also names Fraunces, Geist and Plus Jakarta Sans (`mkstyle-generated-default-tells.md`).
- Weights 400 vs 600 with 1.2× size steps everywhere: a flat page where nothing leads.
- Oversized italic serif hero as a stand-in for taste (Impeccable `italic-serif-display`).
- Positive tracking on lowercase body or headings; wide tracking (> 0.05em) belongs to short all-caps labels only, if at all.
- `font-size: 5vw` or `clamp(1.5rem, 5vw, 3rem)`: no rem term, so zoom cannot enlarge it. Adrian Roselli calls that example a guaranteed WCAG failure.
- Centred body paragraphs longer than 3 lines, and body copy wider than 80ch.
- Three or more families (display serif + sans + mono + script) "for variety".

## Good references
- [Stripe](https://stripe.com) — preloads Söhne (Klim Type Foundry, file `Sohne.*.woff2`, checked Nov 2026) for display and body: one family, contrast by weight and size alone.
- [Basecamp](https://basecamp.com) — Graphik plus Sharpie, a marker face used only for hand-drawn annotations, and mono for code (`fonts.css`, checked Nov 2026). The root size is `max(1.25rem, 2.225vw)` with no upper cap, which is the zoom-safe approach Roselli recommends.
- [teenage engineering](https://teenage.engineering) — Univers Next Pro Thin as the voice; the thin weight at large sizes reads like a product label, which fits a hardware maker.
- [Mailchimp](https://mailchimp.com) — serif display (files named Means) with a separate sans for UI copy: serif/sans contrast with matched proportions.
- [Are.na](https://www.are.na) — its own `areal` family with an Arial fallback and plain Times for serif: deliberately unstyled type as the identity.
- [Linear](https://linear.app) — preloads InterVariable 4.1, whose optical-size axis gives display cuts. Proof that Inter can be a decision when it is tuned and owned, not a default.

## Bad references
- [Anthropic: Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) — documents the generated default: Inter, purple on white, little motion, from "distributional convergence".
- [Adrian Roselli: Responsive Type and Zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) — shows the `clamp(1.5rem, 5vw, 3rem)` pattern that cannot reach 200%.
- Generic template pages: one sans at 400/600, steps of 1.125×, centred everything. The hierarchy depends on bold alone.

## Accessibility
- WCAG 1.4.4: text resizes to 200%. Keep max/min ≤ 2.5 in every clamp and test at 200% and 400% zoom at 1280px wide.
- WCAG 1.4.12 (text spacing): layouts survive line-height 1.5, letter-spacing 0.12em, word-spacing 0.16em. Do not fix heading heights.
- Body text ≥ 16px (`--mk-step-0` minimum 1rem). Captions ≥ 13px (`--mk-step--1` minimum 0.833rem).
- Thin display weights (100–300) only at ≥ 48px, and only where contrast stays ≥ 4.5:1; thin strokes lose apparent contrast.

## Motion / interaction (if relevant)
- Do not animate `font-size`, `letter-spacing` or variable axes on scroll; it reflows text on every frame. Animate `opacity` and `transform` only (`mkstyle-scroll-motion.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-font-display` | system stack, replace with the brief's face | h1, h2, prices |
| `--mk-font-body` | system UI stack | body, UI copy |
| `--mk-font-serif` | Charter stack (modernfontstacks Transitional) | editorial body or display |
| `--mk-step-display` | `clamp(2.5rem, 1.717rem + 3.478vw, 4.5rem)` | the one hero h1 |
| `--mk-step-4` / `--mk-step-0` | 2.074–2.747rem / 1–1.125rem | section h2 / body |
| `--mk-track-display` | −0.025em | display tracking |
| `--mk-leading-display` / `-heading` / `-body` | 1.05 / 1.15 / 1.6 | leading |
| `--mk-measure` / `-lead` / `-headline` | 65ch / 52ch / 18ch | line length |
| Families / weights | ≤ 2 / ≤ 4 | budget |

## Implementation sketch
```css
@font-face {
  font-family: "Brief Display";
  src: url("/fonts/brief-display-var.woff2") format("woff2");
  font-weight: 300 800;
  font-display: swap;
}
:root {
  --mk-font-display: "Brief Display", Charter, "Bitstream Charter", "Sitka Text", Cambria, serif;
}
.mk-display {
  font: 700 var(--mk-step-display) / var(--mk-leading-display) var(--mk-font-display);
  letter-spacing: var(--mk-track-display);
  font-optical-sizing: auto;
  max-inline-size: var(--mk-measure-headline);
  text-wrap: balance;
}
.mk-h2 { text-wrap: balance; }
.mk-prose {
  font: 400 var(--mk-step-0) / var(--mk-leading-body) var(--mk-font-body);
  max-inline-size: var(--mk-measure);
  text-wrap: pretty;
}
.mk-prose.is-serif {
  font-family: var(--mk-font-serif);
  line-height: 1.7;
}
```

## Checklist
- [ ] The display face is named in the brief or justified by the subject in one sentence; it is not Inter, Roboto, Arial or Space Grotesk by default.
- [ ] At most 2 families and 4 weights are requested.
- [ ] Every `clamp()` font size has a rem term and a max ≤ 2.5× its min.
- [ ] Display letter-spacing is between −0.01em and −0.04em; body is 0.
- [ ] Body line-height is 1.5–1.7 and body lines render at 45–75 characters.
- [ ] Headings use `text-wrap: balance`, paragraphs use `text-wrap: pretty`.
- [ ] Text reaches 200% at browser zoom with no clipping or overlap.

## Sources
- https://claude.com/blog/improving-frontend-design-through-skills (Apache-2.0 skill; ideas only)
- https://github.com/anthropics/skills/tree/main/skills/frontend-design
- https://github.com/pbakaus/impeccable (Apache-2.0; rules `overused-font`, `flat-type-hierarchy`, `extreme-negative-tracking`, `italic-serif-display`)
- https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
- https://adrianroselli.com/2019/12/responsive-type-and-zoom.html
- https://oddbird.net/2025/08/26/type-visual
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- https://baymard.com/blog/line-length-readability
- https://caniuse.com/wf-text-wrap-pretty
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
- https://web.dev/articles/variable-fonts
- https://modernfontstacks.com/
- https://rsms.me/inter/
- https://klim.co.nz/retail-fonts/soehne/
- Site markup checked Nov 2026: stripe.com, linear.app, basecamp.com (`/assets/css/fonts.css`, `root.css`), mailchimp.com, teenage.engineering, www.are.na
