# Colour and art direction

> Derive the palette from the brand and subject, spend one accent in one place per view, build every shade as an OKLCH ramp checked for WCAG contrast, and direct imagery toward the real product and real people, with gradients only where they carry meaning.

**Category:** Style (colour and imagery) · **Applies to:** page palette, CTA colour, section backgrounds, hero media, screenshots, photography, illustration, gradients, the `--brand-*` inputs · **Priority:** must

## When to use / when not
- Use when setting up a new marketing page or rebrand, and when reviewing one that "looks like every other SaaS page".
- If a brand book exists, it wins on hue and logo colours. This file still governs how much accent appears, the ramps, contrast and imagery.
- Product screens keep the dashboard-ui colour rules (`color-minimal-usage.md`, `color-system-architecture.md`). The marketing layer only changes the three `--brand-*` inputs.

## Rules (do)
- **Derive, don't default.** Start from the subject's world: materials, the logo, the category's conventions and where you want to differ from them. Write 4–6 named colours with a reason each (Anthropic's frontend-design process asks for exactly this plan before code). If a colour has no reason, it is a default.
- **One accent, spent in one place.** The accent marks the primary CTA and at most one other focal element per viewport. Links can use a darker step of the same ramp. Anthropic's blog phrases it as dominant colours with sharp accents beating "timid, evenly-distributed palettes".
- **60-30-10 as a heuristic only.** About 60% neutral ground, 30% secondary surface or imagery, 10% accent. It comes from interior decorating with no documented origin or UI research behind it; use it to catch an accent spread over 30% of the page, not as a law (opinion).
- **Build ramps in OKLCH.** Hold hue and adjust lightness in even steps (for example L 0.97, 0.93, 0.85, 0.72, 0.60, 0.50, 0.40, 0.30, 0.22). Equal L steps look equally spaced, unlike HSL, and OKLCH reaches Display P3 (Evil Martians). Lower chroma near the ends to stay in gamut.
- **Contrast on brand colours is computed, not eyeballed.** Text on the accent ≥ 4.5:1, or ≥ 3:1 for text ≥ 24px or ≥ 18.66px bold (WCAG 1.4.3). The CTA shape against its background ≥ 3:1 (1.4.11). The default accent `oklch(0.50 0.17 265)` gives 6.2:1 with white. Light brand hues (yellow, lime, cyan) fail with white: set `--brand-on-accent` to dark ink instead.
- **Imagery: the real product and real people.** NN/g eye-tracking found users ignore generic stock people but study photos of real staff; on one page they spent 10% more time on portraits than on bios that took 316% more space. Show product UI crops (`mksect-features-and-bento.md`), real customers and the team.
- **One illustration style per site.** Fix the stroke width, corner radius, palette (from the ramps) and level of detail, and use it everywhere. Mixed packs (flat here, 3D there) read as assembled.
- **Gradients only when they mean something:** a brand signature applied consistently (Stripe), a direction or progress, light from a real source in a product shot. A gradient behind every section is decoration.
- **Tint neutrals towards the brand hue** at low chroma (C ≤ 0.02), as tokens.css does with hue 250. Pure grey next to a saturated accent looks dead.

## Anti-patterns (don't)
- The purple-to-blue gradient on white. Tailwind's demo button colour `bg-indigo-500` was copied so widely that models learned it as "modern"; Adam Wathan publicly apologised for it in 2025 (summarised by prg.sh). Impeccable's `ai-color-palette` rule flags purple or violet gradients and cyan on dark.
- Gradient text on headings or numbers (`gradient-text`). It is decoration, and contrast varies across the word.
- Accent on everything: icons, borders, headings, bullets and the CTA in the same hue. The CTA no longer stands out.
- Stock photos of people pointing at laptops, and abstract "floating diverse team" illustrations (BuiltIn, 2026, names these as the generic hero).
- A soft orbital gradient blob or radial glow behind the hero as the only art direction (Impeccable `radial-spotlight-glow`).
- Brand colour as body text colour, or grey text on a coloured band (Impeccable `gray-on-color`).
- Warm cream background by reflex (`cream-palette`; see `mkstyle-generated-default-tells.md`).

## Good references
- [Stripe](https://stripe.com) — its animated mesh gradient is the brand signature, used consistently as a hero wave and not behind every block. Kevin Hufnagl's breakdown (published on bram.us) shows it is a small WebGL canvas (`minigl`), so it is art, not a CSS background on every section.
- [Mailchimp](https://mailchimp.com) — a light brand yellow (`#ffe01b` in the markup, checked Nov 2026) that only works with dark ink on it, never white text, plus a single, consistent illustration and photo style.
- [Linear](https://linear.app) — near-monochrome dark page (theme colour `#08090a`) where colour comes almost only from product screenshots; the product is the art.
- [Plausible](https://plausible.io) — restrained palette and a real screenshot of its analytics dashboard as the main image (alt "Privacy-focused web analytics dashboard"), with real named customers' photos in the testimonials.
- [Evil Martians: OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) — why OKLCH ramps keep lightness predictable and how P3 fits in.

## Bad references
- [prg.sh: Why your AI keeps building the same purple gradient website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) — documents the indigo default and its origin.
- [BuiltIn: AI makes bad design look good enough](https://builtin.com/articles/ai-design-slop-era) — names the orbital gradient blob and floating-team hero as the interchangeable look.
- [NN/g: Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/) — generic stock people get ignored in eye-tracking; decorative photos waste the space.
- Many reimplementations of the Stripe gradient (gists, CodePens) used as a background on unrelated products: the gradient without the brand that gave it meaning.

## Accessibility
- Text contrast ≥ 4.5:1 (≥ 3:1 large) on every surface it sits on, including gradient and photo backgrounds: check the lightest point under the text.
- Text over photos needs a scrim or a solid panel; no text over busy image areas.
- Never use colour alone to carry meaning (WCAG 1.4.1): "recommended" plans also get a label.
- Check the palette under protanopia and deuteranopia simulation; accent and secondary must still differ in lightness.
- Forced-colors mode removes backgrounds and gradients. Keep borders on CTAs and cards so they remain visible.

## Motion / interaction (if relevant)
- An animated gradient hero pauses under `prefers-reduced-motion: reduce` and when off screen; animating WebGL costs battery (`mkstyle-scroll-motion.md`).
- Hover changes the CTA lightness by one ramp step (`color-mix` 88% with ink), never the hue.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--brand-accent` | `var(--accent)`, default `oklch(0.50 0.17 265)` | primary CTA, one focal element |
| `--brand-on-accent` | `oklch(1 0 0)`, dark ink for light hues | text on accent, ≥ 4.5:1 |
| `--brand-ink` | `var(--text)` | headings, hover mix target |
| Accent area | ≤ 10% of a viewport | heuristic |
| Named palette | 4–6 colours with a reason each | plan |
| Ramp | 9–11 OKLCH steps, fixed hue, chroma eased at ends | tints, shades |
| Neutral tint | chroma ≤ 0.02 at the brand hue | canvas, borders |

## Implementation sketch
```css
:root {
  --brand-hue: 152;
  --brand-accent: oklch(0.48 0.12 var(--brand-hue));
  --brand-on-accent: oklch(1 0 0);
  --brand-ink: oklch(0.22 0.02 var(--brand-hue));
  --brand-50: oklch(0.97 0.02 var(--brand-hue));
  --brand-200: oklch(0.85 0.07 var(--brand-hue));
  --brand-700: oklch(0.40 0.10 var(--brand-hue));
}
.mk-section.is-tinted { background: var(--brand-50); }
.mk-section.is-tinted .mk-prose { color: var(--brand-ink); }
.mk-link { color: var(--brand-700); text-underline-offset: 0.2em; }
.mk-hero-media {
  border: var(--mk-media-border);
  border-radius: var(--mk-media-radius);
  overflow: clip;
}
.mk-photo-caption {
  background: color-mix(in oklab, var(--canvas) 88%, transparent);
  color: var(--text);
  padding: var(--space-2) var(--space-3);
}
```

## Checklist
- [ ] The palette plan names 4–6 colours with a subject or brand reason for each.
- [ ] The accent appears on the primary CTA and at most one other element per viewport.
- [ ] Every text-on-colour pair, including text on the accent, measures ≥ 4.5:1 (≥ 3:1 for large text).
- [ ] No purple-to-blue gradient and no gradient text unless the brand book specifies it.
- [ ] Hero and feature images are the real product or real people, not stock.
- [ ] All illustrations share one stroke, radius and palette.

## Sources
- https://claude.com/blog/improving-frontend-design-through-skills (ideas only)
- https://github.com/anthropics/skills/tree/main/skills/frontend-design (Apache-2.0; ideas only)
- https://github.com/pbakaus/impeccable (Apache-2.0; rules `ai-color-palette`, `gradient-text`, `cream-palette`, `radial-spotlight-glow`, `gray-on-color`)
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- https://www.nngroup.com/articles/photos-as-web-content/
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/
- https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- https://builtin.com/articles/ai-design-slop-era
- https://www.apartmenttherapy.com/interior-design-rule-60-30-10-explained-37504313 (origin of 60-30-10 in decorating)
- Site markup checked Nov 2026: stripe.com, linear.app (`theme-color #08090a`), mailchimp.com, plausible.io
