# Theming and multi-brand

> A theme or a brand is a different set of inputs to the same generator, applied by swapping the role tier under one attribute; components and role names never change per brand.

**Category:** Tokens · **Applies to:** white-label products, sub-brands, customer theming, light/dark/high-contrast, per-tenant accents · **Priority:** should

## When to use / when not
- Use when more than one look must run from one codebase: a white-label product, a parent brand with sub-brands, a tenant-chosen accent, or a marketing site and an app that share components.
- Don't build a multi-brand layer for one brand "in case". The three-tier architecture (`dsfound-token-architecture.md`) already makes a second brand cheap; the extra layer is only worth it when a second brand exists.

## Rules (do)
- **Brands differ in inputs, not structure.** A brand is `{ hue, tint, accent, contrast, density, radius }` for `scripts/theme.mjs`, plus a font stack. Linear replaced dozens of hand-set variables per theme with three generator inputs (base colour, accent, contrast); the same idea makes every brand pass the same checks.
- **Swap roles under one selector.** Generate one CSS file per brand and scope it: `:root[data-brand="acme"] { … }`. Light/dark and high contrast stay media queries and `data-theme` inside each brand. Order of axes: brand → theme → contrast → density.
- **What may vary by brand:** accent hue and chroma, neutral hue and tint, radius base, font family, and density default. **What may not:** role names, status hues (danger stays red-ish, success green-ish), the money convention unless the market differs, spacing steps, and any contrast floor.
- **Keep the accent in its lane.** The brand colour goes on primary actions, focus, selection and the logo, not on panels and chrome (Linear's 2024 redesign cut the accent's share of the chrome on purpose). This keeps a loud brand from failing contrast or overwhelming data.
- **Tenant-chosen accents go through the generator at runtime or on save.** Never paste a customer hex into `--accent`. Run it through `theme.mjs` (or the same maths on the server); the generator keeps hue and chroma and moves lightness until the pairs pass. Use `--lock-accent` only when the brand team requires the exact colour, and accept that it can fail.
- **Every brand has a DESIGN.md entry** with its inputs, the generator report summary and the reason it exists (`dsref-design-md-format.md`).
- **Test every brand × theme × contrast cell.** With 3 brands that is 12 generated themes. The generator verifies each one; visual regression should screenshot each.

## Anti-patterns (don't)
- Brand-specific component overrides (`.acme .button { … }`). The brand should change tokens, not components.
- A brand that changes role meaning (`--accent` as a background wash in one brand, a button fill in another).
- Copying a brand palette from a style guide straight into roles without checking the pairs. Brand guides are usually written for print and marketing, not for 13px UI text.
- Per-brand status colours chosen for harmony ("our danger is purple"). People read red as danger across products; keep the hue family.
- Shipping a high-contrast mode only for the default brand.

## Good references
- [Linear – How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — themes generated from base, accent and contrast in a perceptual colour space; a contrast input yields accessible high-contrast themes.
- [GitHub Primer – Color overview](https://primer.style/foundations/color/overview) — functional tokens shared across themes, so a new theme is a new mapping, not new components.
- [Atlassian – Design tokens](https://atlassian.design/foundations/tokens/design-tokens) — one token set, many themes (light, dark, and additional themes), switched at the root.
- [Stripe – Designing accessible color systems](https://stripe.com/blog/accessible-color-systems) — the palette was rebuilt so contrast is a property of the system across hues, which is what lets brands vary hue safely.

## Bad references
- White-label admin templates that expose a single "brand colour" picker and apply it to buttons, links, sidebars and headers with no contrast check — a pale brand colour makes the links unreadable.
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) per-product palettes — a fixed hex set per product type, with no way to derive a brand's dark or high-contrast variant (ideas only, MIT).

## Accessibility
- The contrast floor is global. No brand can lower it; the generator refuses or adjusts.
- High-contrast and forced-colours blocks are generated for every brand, not only the default.
- If a brand changes the font family, re-check the type scale's x-height: a font with a small x-height may need body text one step larger (`dstoken-typography-scale.md`).

## Motion / interaction (if relevant)
- Theme and brand switches cross-fade colours in 150 ms or less, or not at all. A long fade makes the whole interface shimmer.

## Tokens and values
| Axis | Selector | Generated by |
|---|---|---|
| Brand | `:root[data-brand="…"]` | one `theme.mjs` run per brand |
| Theme | `prefers-color-scheme` + `:root[data-theme="light|dark"]` | the same run (light and dark) |
| Contrast | `prefers-contrast: more` | the same run (contrast 100), unless `--no-high-contrast` |
| Density | `:root[data-density="compact|comfortable|spacious"]` | the same run |
| Tenant accent | runtime | the generator maths, never a raw hex |

## Implementation sketch
```css
/* brand files are generated: node theme.mjs --config brands/acme.json --out tokens/acme */
:root[data-brand="acme"] {
  --accent: oklch(0.52 0.16 150);
  --on-accent: oklch(1 0 0);
  --canvas: oklch(0.985 0.003 40);
  --radius-md: 6px;
  --font-sans: "Source Sans 3", system-ui, sans-serif;
}
:root[data-brand="acme"][data-theme="dark"] {
  --accent: oklch(0.76 0.12 150);
  --on-accent: oklch(0.18 0.006 40);
}
/* components never mention a brand */
.button-primary { background: var(--accent); color: var(--on-accent); border-radius: var(--radius-md); }
```

```ts
// Apply a stored tenant theme. The values come from the generator, never from the raw tenant input.
type ThemeAxis = { brand: string; theme: 'light' | 'dark' | 'system'; density: 'compact' | 'comfortable' | 'spacious' }

export function applyAxes(root: HTMLElement, axes: ThemeAxis): void {
  root.dataset.brand = axes.brand
  root.dataset.density = axes.density
  if (axes.theme === 'system') delete root.dataset.theme
  else root.dataset.theme = axes.theme
}
```

## Checklist
- [ ] Each brand is a generator input file, stored in the repo and listed in DESIGN.md.
- [ ] No component stylesheet mentions a brand.
- [ ] Every brand × theme × contrast combination has a passing generator report.
- [ ] Status hues and role meanings are the same across brands.
- [ ] Tenant accents pass through the generator before use.
- [ ] Brand switches don't animate colour for more than 150 ms.

## Sources
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://primer.style/foundations/color/overview
- https://atlassian.design/foundations/tokens/design-tokens
- https://stripe.com/blog/accessible-color-systems
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; ideas only)
