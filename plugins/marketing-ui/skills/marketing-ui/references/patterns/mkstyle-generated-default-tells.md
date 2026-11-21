# Generated-default tells

> Refuse every tell in this catalogue by default, and allow one only when the brief names it or the subject earns it in a sentence you can write down; detect them in the rendered DOM, not by eye.

**Category:** Style (review) · **Applies to:** the whole marketing page: type, colour, hero, feature sections, cards, icons, copy, motion, logo walls · **Priority:** must

## When to use / when not
- Use in two passes: on the design plan before code (Anthropic's frontend-design process reviews the plan and rewrites any line that "could fit any similar page"), and on the rendered page before review (`mkref-review-rubric.md`).
- Each tell is legitimate for some brief. Anthropic's skill says the brief's own words win, including when it asks for one of these looks. What makes it a tell is appearing regardless of subject.
- **Dashboard caveat:** a KPI row with a unit, a comparison and a time frame is information, not the hero-metric tell (`data-kpi-stat-card.md`). The tell is big decorative numbers with no source on a marketing hero.
- Bans move the default rather than remove it: Anthropic's blog reports that with Inter discouraged the model reached for Space Grotesk. Expect new tells and add them here; prefer detectors over prose.

## Rules (do)
- Every row below is **refuse by default unless the brief earns it**. "Earned" means the brief or brand book names it, or the subject supplies a reason in one sentence ("monospace: the product is a terminal").
- Run the detectors on the rendered page (Impeccable: `npx impeccable detect <url>` covers many; its rule ids are given in brackets). Record each waiver with its reason.
- Replace a tell with the "instead" column, not with the next default.

| Tell [Impeccable id] | Why it reads as generated | Detect (DOM/CSS) | Instead |
|---|---|---|---|
| Inter, Roboto, Arial or Space Grotesk as display face [`overused-font`] | Most common faces in training data; bans shift to the next one | First family of computed `font-family` on `h1`/`h2` is in {Inter, Roboto, Arial, Space Grotesk, Geist, Plus Jakarta Sans, Fraunces} | A face picked from the subject (`mkstyle-display-type-pairing.md`) |
| Purple-to-blue gradient [`ai-color-palette`] | Tailwind's indigo demo default copied everywhere | `linear-gradient` stops with OKLCH hue 250–310 and C > 0.1 on hero or CTA | Brand-derived palette, flat accent (`mkstyle-colour-art-direction.md`) |
| Gradient text [`gradient-text`] | Decoration on the words that should be clearest | `background-clip: text` with `color: transparent` | Solid ink; colour on one element elsewhere |
| Hero-metric template | Big numbers, tiny labels, gradient accent is the stock hero | ≥ 3 siblings in the first viewport, value ≥ 2× body size, mostly digits/%/+, no date or source nearby | Lead with the product's most characteristic thing; sourced numbers go in proof (`mksect-social-proof.md`) |
| Identical icon-tile cards, 3-up [`icon-tile-stack`] | Every generator emits rounded-square icon over heading over one line | ≥ 3 sibling cards whose first child is a square ≤ 64px with a tinted background, then a heading | Real UI crops, unequal tiles (`mksect-features-and-bento.md`) |
| Tracked all-caps eyebrow or chip above the h1 [`hero-eyebrow-chip`, `kicker-above-heading`] | Template chrome that appears whatever the subject | Element right before `h1`/`h2` with `text-transform: uppercase` and `letter-spacing` > 0.05em, or pill radius | Put the context in the headline, or a real breadcrumb |
| One headline word in accent colour or italic | Commonest headline treatment in generated pages | `h1` child `span`/`em`/`strong` with a different `color`, `font-style` or background | Let the whole headline carry the weight; rewrite it |
| Emoji as icons | No drawn icon system was chosen | Icon slots or list markers whose text matches `\p{Extended_Pictographic}` | One icon set with fixed stroke, or no icon |
| Sparkle "AI" icon | The cliché glyph for "smart" | U+2728, or SVG/class/label containing "sparkle" | Name what the feature does in words |
| Glow halos, coloured shadows on dark [`dark-glow`, `radial-halo`] | The default "cool" look | `box-shadow`/`text-shadow` with chroma > 0.05 and 0 offset, or any coloured blur on a ground with L < 0.3 | Lighter surfaces and borders (`mkstyle-dark-sections.md`) |
| Glassmorphism everywhere | Blur used as style, not depth | More than 2 elements with `backdrop-filter: blur()` | One overlay at most (`style-glass-translucency.md`) |
| Nested cards [`nested-cards`] | Card kit applied without hierarchy | A bordered or shadowed radius box inside another | Spacing, dividers, type |
| One-side accent stripe on rounded cards [`side-tab`, `border-accent-on-rounded`] | Generic "callout" treatment | `border-left-width` ≥ 3px in a colour unlike the other sides, with `border-radius` > 0 | Full border, tint or a leading label |
| Middle-dot meta strings | "A · B · C" template chrome | Text with 2+ ` · ` separators | Separate fields, or a sentence |
| Monospace as costume | Borrowed developer aesthetic | Monospace computed font outside `code`, `pre`, `kbd`, `samp` | Mono for code only (`--mk-font-mono`) |
| Same fade-up on every section | Default entrance motion | 3+ sections share one `animation-name` or reveal class | One orchestrated moment (`mkstyle-scroll-motion.md`) |
| Cream + serif + terracotta [`cream-palette`] | The "tasteful" default; terracotta near `#D97757` is Anthropic's own accent | Canvas near `#F4F1EA` (L 0.94–0.97, warm hue, low chroma), serif `h1`, clay accent | Palette from the brand |
| Near-black with one acid accent | The "edgy" default | Canvas L < 0.2 and a single accent with C > 0.2 (acid green, vermilion) | Palette from the brand |
| Buzzword copy [`marketing-buzzword`] | "Transform your workflow" fits any product | Regex: transform, supercharge, empower, streamline, seamless, unlock, next-generation, world-class, cutting-edge | Name the outcome and the mechanism |
| Em-dash overuse [`em-dash-overuse`] | AI cadence in copy | ≥ 8 em dashes at about 1 per 500 characters of body text | Commas, colons, full stops |
| Centred everything | No layout decision made | > 50% of paragraphs over 2 lines have `text-align: center` | Left-aligned body; centre only short hero text |
| Fake or placeholder logo wall | Invented proof erodes trust | Logos with placeholder names (Acme, Globex), unlinked, or a "10,000+ teams" claim with no source | Real customers with permission, or no wall |
| Numbered markers on non-sequences [`numbered-section-labels`] | Editorial scaffolding as decoration | "01/02/03" labels on sections that are not an `<ol>` or a process | Numbers only for real steps or timelines |

## Anti-patterns (don't)
- Swapping one tell for its sibling (Inter to Space Grotesk, purple to cyan on dark).
- Fixing the detector instead of the design: adding a waiver with no reason.
- Treating this list as the whole design brief. A page with no tells can still be generic; start from the subject.
- Stacking 4–5 "allowed" tells on one page because each was earned alone.

## Good references
- [Impeccable](https://github.com/pbakaus/impeccable) — 62 deterministic rules, run on source or a URL, with JSON, GitHub annotations or SARIF output and inline waivers (Apache-2.0; ideas and rule ids only).
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — lists five calibration clusters (cream/serif/terracotta, near-black/acid, broadsheet, SaaS card kit, template chrome) and the plan-review-build-critique loop (Apache-2.0; paraphrased).
- [Capital & Compute: How to fix AI slop in web design, tell by tell](https://capitalandcompute.net/blog/fix-ai-slop-design/) — pairs each tell with a fix and recommends a scanner in CI.
- [Plausible](https://plausible.io) — a real dashboard screenshot and real named customers instead of icon tiles and metric rows.

## Bad references
- [prg.sh: Why your AI keeps building the same purple gradient website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) — the indigo button default and the 3-box icon grid.
- [BuiltIn: AI makes bad design look good enough](https://builtin.com/articles/ai-design-slop-era) — orbital gradient blob, floating-team illustrations, interchangeable layouts.
- Generic generated landing template (unnamed): pill chip, centred h1 with one accented word, three icon cards, metric row, fake logo wall.

## Accessibility
- Several tells are also failures: gradient text and glows lower contrast; emoji icons are read aloud by name ("sparkles"); centred long text slows reading; all-caps labels lose word shapes.
- Icons kept after review need `aria-hidden="true"` when decorative, or an accessible name when they act.

## Motion / interaction (if relevant)
- Pulsing status dots, blinking cursors and auto-scrolling marquees are motion tells (Impeccable `pulsing-dot`, `blinking-cursor`, `marquee`): use them only for live data or a real input.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-font-display` | not Inter, Roboto, Arial, Space Grotesk by default | display face |
| `--mk-track-caps` | 0.06em, only where all-caps is earned | labels |
| `--mk-font-mono` | code only | code samples |
| Glass elements | ≤ 1 per view | overlays |
| Em dashes | < 1 per 500 characters | copy |
| Waivers | 1 written reason each | review |

## Implementation sketch
```ts
// Quick in-page check for a few tells; run in the browser console or a Playwright evaluate.
type Finding = { tell: string; selector: string }

const overused = ['inter', 'roboto', 'arial', 'space grotesk', 'geist', 'plus jakarta sans']
const findings: Finding[] = []

for (const h of Array.from(document.querySelectorAll<HTMLElement>('h1, h2'))) {
  const style = getComputedStyle(h)
  const first = style.fontFamily.split(',')[0]?.trim().replace(/["']/g, '').toLowerCase() ?? ''
  if (overused.includes(first)) findings.push({ tell: 'overused display face', selector: h.tagName })
  if (style.backgroundClip === 'text') findings.push({ tell: 'gradient text', selector: h.tagName })
  const prev = h.previousElementSibling
  if (prev instanceof HTMLElement) {
    const p = getComputedStyle(prev)
    if (p.textTransform === 'uppercase' && parseFloat(p.letterSpacing) > 0.05 * parseFloat(p.fontSize)) {
      findings.push({ tell: 'eyebrow above heading', selector: h.tagName })
    }
  }
}
const body = document.body.innerText
const dashes = (body.match(/\u2014/g) ?? []).length
if (dashes >= 8 && dashes / Math.max(1, body.length) > 1 / 500) findings.push({ tell: 'em-dash overuse', selector: 'body' })
if (/\u2728/u.test(body)) findings.push({ tell: 'sparkle glyph', selector: 'body' })
console.table(findings)
```

## Checklist
- [ ] The design plan was reviewed against this table before any code, and changes were noted.
- [ ] The rendered page passes a detector run (Impeccable or the sketch above) with zero unexplained findings.
- [ ] Every waived tell has a one-sentence reason tied to the brief or subject.
- [ ] No display face from the overused list unless the brand owns it.
- [ ] No number on the hero lacks a unit, a time frame and a source.
- [ ] Logos and testimonials are real and permitted; none are placeholders.

## Sources
- https://github.com/pbakaus/impeccable (Apache-2.0; rule ids from `npx impeccable detect --list-rules` and `crates/live/assets/antipatterns.json`; ideas only)
- https://github.com/anthropics/skills/tree/main/skills/frontend-design (Apache-2.0; ideas only)
- https://claude.com/blog/improving-frontend-design-through-skills
- https://capitalandcompute.net/blog/fix-ai-slop-design/
- https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- https://builtin.com/articles/ai-design-slop-era
- https://www.nngroup.com/articles/photos-as-web-content/
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
