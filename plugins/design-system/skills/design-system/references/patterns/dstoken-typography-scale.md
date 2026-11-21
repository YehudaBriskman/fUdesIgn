# Generating a typography scale

> Generate the type scale from a base size and one ratio chosen for the product's density, in rem, with line height falling as size rises; keep the scale short and name steps by role.

**Category:** Tokens · **Applies to:** font-size, line-height, weight and tracking tokens; headings, body, labels, numbers · **Priority:** must

## When to use / when not
- Use when setting up a design system, adding a brand font, or when a project has more than about 8 distinct font sizes in its CSS (a sign of drift).
- Don't invent a new scale for a project that already has one in its design system or DESIGN.md. Map it onto the role names instead.

## Rules (do)
- **Pick a base by product type.** 14px (0.875rem) for dense apps and dashboards, 16px (1rem) for consumer apps and documentation, and 18–19px for long reading and public services (GOV.UK uses 19px body text on large screens and 16px on small ones). See `dsfound-domain-profiles.md`.
- **Pick a ratio by density.** Dense UIs need small steps: 1.125 (major second) or 1.2 (minor third). Marketing and editorial pages can afford 1.25–1.333. A large ratio on a dense app makes the headings shout and leaves no in-between sizes.
- **Keep it short: 5–7 steps.** Name them by role: `meta`, `body`, `heading`, `title`, `kpi`/`display`, `hero`. The dashboard-ui scale is 0.75 / 0.875 / 1 / 1.25 / 1.875 / 2 rem. Round to the nearest 0.125rem (2px) so sizes land on the pixel grid.
- **Line height falls as size rises.** About 1.45–1.6 for body, 1.3–1.4 for headings, 1.1–1.2 for display numbers. Express it unitless.
- **Tracking:** slightly negative for large display sizes (−0.01 to −0.02em), 0 for body, slightly positive for small meta text (+0.01em). Uppercase labels need +0.04em or more.
- **Use rem, and keep fluid type zoomable.** Use `clamp(min-rem, rem + vw, max-rem)` only for display sizes, and always include a rem term so browser zoom still enlarges the text (WCAG 1.4.4 Resize Text). Never set body text in `vw` alone.
- **Two weights per family in UI.** Regular (400) and semibold (600) carry almost every hierarchy; add a third only with a stated reason.
- **Numbers get tabular lining figures.** `font-variant-numeric: tabular-nums lining-nums` on any number that changes or aligns.
- **Write the scale as tokens.** One shorthand token per role (`--type-body: 400 0.875rem/1.45 var(--font-sans)`) plus tracking tokens, so components never set size and line height separately.

## Anti-patterns (don't)
- A 12-step scale where the app uses 4. Unused steps get used by accident.
- Pixel font sizes that ignore the user's browser font setting.
- `font-size: 4vw` with no rem term: zoom does nothing (WCAG 1.4.4 failure).
- One line height for every size (1.5 on a 48px heading looks broken).
- Hierarchy by size alone; weight and colour (`text` vs `text-muted`) are cheaper and calmer.
- More than two type families without a role for each.

## Good references
- [GOV.UK Design System – Type scale](https://design-system.service.gov.uk/styles/type-scale/) — a short role-named scale with different sizes for small and large screens, tested with a very wide public audience.
- [Utopia – Fluid type scale calculator](https://utopia.fyi/type/calculator/) — generates a fluid scale from a min and max base and ratio, with clamp() output.
- [Modular Scale](https://www.modularscale.com/) — the ratio idea and the named ratios.
- [WCAG 2.2 – Understanding 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) — the overrides (line height 1.5, letter 0.12em, word 0.16em, paragraph 2em) your layout must survive.

## Bad references
- Admin templates with `h1`–`h6` at 2.5 / 2 / 1.75 / 1.5 / 1.25 / 1rem and body at 1rem used for tables — the scale was written for articles, so table headers and KPI numbers have no fitting step.
- Landing-page kits that set the hero with `font-size: 8vw` — huge on wide screens and unzoomable (WCAG 1.4.4).

## Accessibility
- Body text never below 0.875rem in apps or 1rem in reading contexts. Meta text at 0.75rem is the floor, and only for secondary labels.
- Text must reflow at 200% zoom and under WCAG 1.4.12 spacing overrides without clipping. Avoid fixed heights on text containers.
- Contrast for small text uses the text thresholds (4.5:1, Lc 60–75); large text (≥ 24px, or ≥ 18.66px bold) may use 3:1 in WCAG 2 but keep Lc ≥ 45.

## Motion / interaction (if relevant)
- Don't animate font-size. Transition `scale` or opacity if a number must grow.

## Tokens and values
| Ratio | Use | Steps meta → hero in px (rounded to 2px, as `typeScale` below) |
|---|---|---|
| 1.125 | dense data apps (14px base) | 12 · 14 · 16 · 18 · 20 · 22 |
| 1.2 | dashboards, admin (14px base) | 12 · 14 · 16 · 20 · 24 · 30 |
| 1.25 | consumer apps (16px base) | 12 · 16 · 20 · 26 · 32 · 40 |
| 1.333 | marketing, editorial (16px base) | 12 · 16 · 22 · 28 · 38 · 50 |
| line height | body 1.45–1.6 · heading 1.3–1.4 · display 1.1–1.2 | |
| tracking | display −0.02em · body 0 · meta +0.01em · caps +0.04em | |

## Implementation sketch
```ts
// Generate role-named type tokens from a base and a ratio (rem, rounded to 2px steps).
type Role = 'meta' | 'body' | 'heading' | 'title' | 'display' | 'hero'
const STEPS: Record<Role, number> = { meta: -1, body: 0, heading: 1, title: 2, display: 3, hero: 4 }
const LEADING: Record<Role, number> = { meta: 1.35, body: 1.45, heading: 1.4, title: 1.3, display: 1.15, hero: 1.1 }

export function typeScale(basePx: number, ratio: number): Record<Role, string> {
  const out = {} as Record<Role, string>
  for (const role of Object.keys(STEPS) as Role[]) {
    const px = Math.round((basePx * ratio ** STEPS[role]) / 2) * 2
    const weight = STEPS[role] > 0 ? 600 : 400
    out[role] = `${weight} ${px / 16}rem/${LEADING[role]} var(--font-sans)`
  }
  return out
}
// typeScale(14, 1.2).body === '400 0.875rem/1.45 var(--font-sans)'
```

```css
:root {
  --type-body: 400 0.875rem/1.45 var(--font-sans);
  --type-title: 600 1.25rem/1.3 var(--font-sans);
  /* display only: fluid, with a rem term so zoom still works */
  --type-hero: 600 clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)/1.1 var(--font-sans);
  --track-display: -0.02em;
}
.page-title { font: var(--type-title); }
.hero { font: var(--type-hero); letter-spacing: var(--track-display); }
.num { font-variant-numeric: tabular-nums lining-nums; }
```

## Checklist
- [ ] The CSS uses no font size outside the scale (count distinct `font-size` values; 7 or fewer).
- [ ] Sizes are in rem; any `vw` sizing also has a rem term.
- [ ] Base and ratio match the product profile and are written in DESIGN.md.
- [ ] Line height falls as size rises; tracking tokens exist for display and meta.
- [ ] Numbers use tabular lining figures.
- [ ] Layout survives 200% zoom and the WCAG 1.4.12 spacing overrides.

## Sources
- https://design-system.service.gov.uk/styles/type-scale/
- https://utopia.fyi/type/calculator/
- https://www.modularscale.com/
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- Repo: `found-typography-for-data.md` (dashboard-ui), `assets/tokens.css`
