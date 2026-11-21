# Dark sections and dark marketing pages

> Use at most two inverse bands on a light page (a feature spotlight and the final CTA), build each by re-declaring the role tokens under `[data-tone="inverse"]` with `color-scheme: dark`, re-check every contrast pair inside it, and keep long reading copy on the light ground.

**Category:** Style (surfaces and tone) · **Applies to:** inverse bands, dark hero, final CTA band, footers, fully dark marketing pages, screenshots and video inside dark areas · **Priority:** should

## When to use / when not
- **Helps:** one feature spotlight where a dark product screenshot or video is the content; the final CTA band that closes the page; a footer. The change of ground marks a new chapter and gives the CTA a stage (`mkfound-page-narrative.md`).
- **Hurts:** more than 2 alternations (light, dark, light, dark, light) turn the page into stripes and the tone change stops meaning anything. Long text (FAQ, pricing details, legal) in a dark band.
- **Fully dark pages** suit products used in the dark or by developers (Linear) and media-heavy pages where screenshots are dark. They still need a light reading mode for long copy, or should honour `prefers-color-scheme`.
- **Divergence from dashboard-ui:** tokens.css says never to mix light and dark regions on one app screen (`color-dark-mode.md`). On a marketing page, a band is a narrative device viewed once, not a working surface. That rule still holds inside the product.

## Rules (do)
- **Re-declare roles, not component colours.** `[data-tone="inverse"]` in marketing.css sets `--canvas`, `--surface`, `--surface-2`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--accent` and `--on-accent` to the dashboard-ui dark values. Every component inside then works without a dark variant.
- **Re-check contrast inside the band.** With the shipped values: text on canvas 16.3:1, muted text 9.6:1 (8.1:1 on `--surface-2`, APCA Lc 60 or more), accent on canvas 9.5:1, `--on-accent` on accent 9.5:1, `--border-strong` 4.0:1. Brand overrides need the same check: ≥ 4.5:1 text, ≥ 3:1 controls and large text.
- **Set `color-scheme: dark` on the band.** Native form controls, scrollbars and autofill then render dark; without it a white `<input>` glares inside the band (MDN).
- **No pure `#000` with pure `#fff`.** 21:1 is more than needed and makes thin strokes bleed for many readers. Use a tinted near-black (L ≈ 0.18, as the tokens do, or Linear's `#08090a`) and off-white text (L ≈ 0.95). Material's dark theme starts at `#121212` for the same reason.
- **Depth by lighter surfaces, not shadows.** Shadows barely show on dark. Raise cards with `--surface` (L 0.215) and `--surface-2` (L 0.25) plus a 1px `--border`, as Material's elevation overlays do.
- **Desaturate the accent for dark.** Use a lighter, less chromatic step (`oklch(0.785 0.10 265)` vs `0.50 0.17` on light). Saturated colours vibrate on dark grounds (Material guidance).
- **Images: ship dark screenshots for dark bands.** A light-theme screenshot in a dark band is the brightest thing on screen. Export the product in its dark theme; when you only have light UI, frame it on a `--surface-2` panel with a 1px border, never edge-to-edge. Transparent PNG logos need a light-on-dark version.
- **Keep reading copy short in the band:** headline, one lead (≤ 52ch), the CTA. NN/g's review found light mode gave better reading performance for people with normal vision, and the gap grows as text gets smaller; keep dark-band text ≥ 18px where it exceeds 2 lines.
- **Weight and size compensation.** Light text on dark looks bolder; drop body weight one step (500 → 400) and avoid weights below 300 in the band.

## Anti-patterns (don't)
- Five alternating bands to "add rhythm".
- A dark band whose components keep light-theme hex values: grey text at 2.5:1, invisible borders, a white input.
- Coloured glow or halo shadows to show depth on dark (Impeccable `dark-glow`, `radial-halo`; `mkstyle-generated-default-tells.md`).
- Pure black canvas with pure white thin body text.
- A light screenshot with white chrome dropped into a black band.
- Dark band for a pricing table or FAQ that people read closely.

## Good references
- [Linear](https://linear.app) — fully dark page on a tinted near-black (`#08090a` theme colour), product screenshots in the dark theme, depth from slightly lighter panels and hairline borders, not shadows.
- [Stripe](https://stripe.com) — a light page with a dark section (`section--dark` in the markup, checked Nov 2026) used as a chapter break rather than alternating stripes.
- [Material Design 2: Dark theme](https://m2.material.io/design/color/dark-theme.html) — `#121212` base, lighter surfaces for elevation, desaturated accents, text at 87% / 60% emphasis.
- [MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) — how the property switches UA controls and scrollbars.

## Bad references
- Generic dark SaaS templates: pure black, cyan or purple glow behind the hero, glassmorphism cards, light-theme screenshots. Impeccable's `ai-color-palette` rule names cyan on dark as a generated tell.
- Pages that alternate dark and light every section; the final CTA band no longer reads as the end.

## Accessibility
- Every pair in the band meets WCAG 1.4.3 (4.5:1) and 1.4.11 (3:1). Focus rings use `--focus-ring`, which follows the band's `--accent`.
- **Evidence on polarity:** NN/g (Budiu, 2020) summarises Piepenbrock 2013: light mode was better for acuity and proofreading in ages 18–33 and 60–85; dark mode may help people with cataract (Legge 1985, 7 participants). Offer, don't force, dark long-form reading.
- **Halation and astigmatism:** an accessibility vendor (Level Access, 2020) says white text on black creates a fuzzing effect called halation for people with astigmatism. It cites no study, and we found no primary study isolating this; treat it as vendor guidance, not evidence. It is one more reason to avoid `#fff` on `#000` and thin weights.
- Forced-colors mode replaces band backgrounds; keep structure with borders and headings, not colour alone.

## Motion / interaction (if relevant)
- Do not cross-fade the page background from light to dark on scroll. It changes the contrast of everything at once and is a large paint; use a hard edge between bands.

## Tokens and values
| Token | Value (in `[data-tone="inverse"]`) | Use |
|---|---|---|
| `--canvas` | `oklch(0.18 0.006 250)` | band ground |
| `--surface` / `--surface-2` | `oklch(0.215 …)` / `oklch(0.25 …)` | raised cards, panels |
| `--text` / `--text-muted` | `oklch(0.95 …)` / `oklch(0.785 …)` | 16.3:1 / 9.6:1 on canvas |
| `--accent` / `--on-accent` | `oklch(0.785 0.10 265)` / `oklch(0.18 …)` | CTA, 9.5:1 |
| `--border` / `--border-strong` | `oklch(0.35 …)` / `oklch(0.56 …)` | hairlines / controls 4.0:1 |
| `color-scheme` | `dark` | UA controls |
| Bands per page | ≤ 2 inverse | spotlight + final CTA |

## Implementation sketch
```html
<section class="mk-section" data-tone="inverse" aria-labelledby="cta-title">
  <div class="mk-container">
    <h2 id="cta-title" class="mk-h2">Start your first project today</h2>
    <p class="mk-lead">Free for up to 3 projects. No card needed.</p>
    <a class="mk-cta" href="/signup">Create an account</a>
    <picture class="mk-band-shot">
      <img src="/img/editor-dark.webp" width="1600" height="1000" alt="The editor in dark theme with a project open" loading="lazy">
    </picture>
  </div>
</section>
```
```css
[data-tone="inverse"] .mk-band-shot {
  display: block;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--mk-media-radius);
  padding: var(--space-2);
}
[data-tone="inverse"] .mk-band-shot img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  border-radius: max(2px, calc(var(--mk-media-radius) - var(--space-2) - 1px));
}
[data-tone="inverse"] .mk-prose { font-weight: 400; }
[data-tone="inverse"] :focus-visible { outline-color: var(--accent); }
```

## Checklist
- [ ] The page has at most 2 inverse bands, and none holds FAQ, pricing detail or legal copy.
- [ ] Each band sets `data-tone="inverse"` (or an equivalent re-declaration of every role) and `color-scheme: dark`.
- [ ] Every text and control pair inside the band measures ≥ 4.5:1 and ≥ 3:1.
- [ ] No `#000` ground with `#fff` text; no coloured glow shadows.
- [ ] Screenshots inside dark bands are dark-theme exports or framed on a surface panel.
- [ ] Inputs, selects and scrollbars inside the band render dark.

## Sources
- https://www.nngroup.com/articles/dark-mode/
- https://m2.material.io/design/color/dark-theme.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.levelaccess.com/blog/accessibility-for-people-with-astigmatism/ (Level Access blog, 30 Jun 2020; vendor claim, no study cited)
- https://github.com/pbakaus/impeccable (Apache-2.0; rules `dark-glow`, `radial-halo`, `ai-color-palette`)
- https://github.com/anthropics/skills/tree/main/skills/frontend-design (ideas only)
- Repo: `plugins/marketing-ui/skills/marketing-ui/assets/marketing.css` (`[data-tone="inverse"]`), `plugins/dashboard-ui/skills/dashboard-ui-design/assets/tokens.css`; contrast ratios computed from those OKLCH values (WCAG 2 formula)
- Site markup checked Nov 2026: linear.app, stripe.com
