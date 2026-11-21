# Domain and product-type profiles

> Start the system from the profile whose users and constraints match the product (finance, analytics, dev tools, consumer, marketing, health), take its generator inputs and rules, and record the evidence that chose it; change a default only with a recorded reason.

**Category:** Design-system foundations · **Applies to:** workflow step 2 ("choose or derive a profile"); generator inputs; DESIGN.md Overview · **Priority:** should

## When to use / when not
- Use when a project has no design system yet, or when its tokens give no answer for density, type base, motion budget or status conventions.
- If the project already has a brand and system, use the profile only to fill gaps and to flag conflicts (for example a consumer-style 16px body on a dense trading screen).
- For dashboards, use dashboard-ui's `found-domain-profiles.md` alongside this file: it splits finance, ops and analytics into 15 dashboard domains with must-have states and typical failures. This file sets the system-level inputs (contrast, density, radius, type base, motion budget) those domains share.
- A profile is a starting point backed by evidence, not a style. It never picks a "look" (glass, brutalist, playful); it picks constraints.

## Rules (do)
- **Pick by users and task, not by industry label.** A finance back-office tool for analysts is closer to *analytics* than to *consumer finance*. Ask: how often do users come back (daily expert vs occasional), how much data per screen, what is the cost of a mistake, who regulates it, and what devices.
- **Derive when nothing fits.** Combine axes from two profiles and write which axis came from where (for example: analytics density + health contrast for a clinical dashboard).
- **Condition modifiers** (closed list; add them to DESIGN.md when they apply):
  - *if real-time*: no entrance animation on updates; highlight changed values for at most 1 s; show freshness.
  - *if large dataset*: compact density available; virtualise lists; tabular numbers everywhere.
  - *if regulated money action*: no celebratory motion or decoration on trades and transfers; confirmation states are explicit.
  - *if red-up market* (CN, JP, TW, KR): swap positive and negative money colours (`data-money="red-up"`), keep status colours as they are.
  - *if older or low-vision audience*: body ≥ 16px, contrast ≥ 60 in the generator, targets ≥ 44px.
- **Profiles set generator inputs.** Each row below gives `contrast`, `density`, `radius` and a type base. Hue and accent come from the brand.
- **Record the evidence.** DESIGN.md names the profile and the facts that chose it, so a later session can tell if the product has moved.

## Anti-patterns (don't)
- Picking a profile from the industry name alone ("it's fintech, so dark mode and neon").
- Profiles that prescribe a visual style or font pairing from a catalogue. ui-ux-pro-max's product table, for example, recommends dark OLED by default and pulsing real-time number animation for financial dashboards, and glassmorphism on fintech data; those conflict with the evidence below and with dashboard-ui's rules.
- Applying marketing expressiveness (large type, scroll animation) to an operational tool.
- Applying consumer defaults (16px body, spacious density) to an expert tool used all day.

## Good references
- [Nielsen Norman Group – Dark mode vs. light mode](https://www.nngroup.com/articles/dark-mode/) — light mode reads better for most people with normal vision; dark is a supported preference, which is why no profile defaults to dark-only.
- [Google Design – Expressive Material Design research](https://design.google/library/expressive-material-design-google-research) — size, colour and containment on key actions helped people find them faster in consumer apps, and breaking familiar patterns hurt; the basis for the consumer and marketing rows.
- [GOV.UK Design System – Type scale](https://design-system.service.gov.uk/styles/type-scale/) and [NHS digital service manual – Typography](https://service-manual.nhs.uk/design-system/styles/typography) — large body text tested with broad public and health audiences; the basis for the health row.
- [Nielsen Norman Group – Usability for senior citizens](https://www.nngroup.com/articles/usability-for-senior-citizens/) — older users are slower with small text and targets; the basis for the older-audience modifier.
- [Linear – How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — a dense expert tool that keeps chrome neutral and lets content carry the colour; the basis for the dev-tools row.

## Bad references
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) `--design-system` for "fintech portfolio investing dashboard" — in our run it matched "portfolio" to a creative-portfolio landing style with 900-weight display type, the opposite of a data-dense finance view. Keyword matching without user and task facts picks the wrong profile (idea of product-type reasoning kept, data not used; MIT).

## Accessibility
- Every profile keeps the same floors (WCAG 2 4.5:1 text and 3:1 non-text, APCA Lc 75/60/30); profiles only raise them.
- The health profile and the older-audience modifier raise the generator contrast to 70 and the body to 16–19px.
- Reduced-motion support is required in every profile, including marketing.

## Motion / interaction (if relevant)
- Motion budget per profile: *none* (change explanation only), *subtle* (100–240 ms micro and overlay motion), *expressive* (staged entrances, allowed only on marketing pages and never on data or money actions).

## Tokens and values
| Profile | Users and task | contrast | density | radius | Type base | Motion | Key rules and evidence |
|---|---|---|---|---|---|---|---|
| **Finance** (money, trading, banking) | daily users acting on money; errors cost money | 60 | comfortable, compact for traders | 6 | 14px, tabular numbers | none–subtle | money colours separate from status; red-up option; no decoration on money actions (dashboard-ui `ref-fintech-money-dashboards.md`, `color-semantic-status.md`); light default with dark offered |
| **Analytics** (product, BI, ops dashboards) | analysts exploring and comparing | 50 | compact available, comfortable default | 8 | 14px | subtle | neutral chrome, colour only for meaning, 6–8 series max (`color-dataviz-palettes.md`, `found-density-modes.md`) |
| **Dev tools** (IDEs, consoles, CI) | experts, all-day use, keyboard first | 50 | compact | 6 | 13–14px; mono for code and IDs only | none–subtle | chrome recedes, accent for focus and selection (Linear); command palette (`comp-command-palette-search.md`); dark offered, not forced |
| **Consumer** (apps for the public) | occasional, mobile, mixed ability | 55 | comfortable–spacious | 12 | 16px | subtle–expressive on key moments | big clear primary action (Material Expressive research); targets 44px; familiar patterns over novelty |
| **Marketing** (landing, product pages) | first-time visitors scanning | 50 | spacious | 8–16 | 16–18px, ratio 1.25–1.333 | expressive allowed, reduced-motion respected | one primary call to action per view; visible, button-looking CTAs (NN/g on flat UI); no layout shift |
| **Health** (clinical and patient) | clinicians under time pressure; patients of all ages | 70 | comfortable (clinical lists may be compact) | 8 | 16px patient-facing (GOV.UK/NHS use 19px on large screens), 14px clinical | none | plain language; status never by colour alone; large targets; high contrast by default |

## Implementation sketch
```ts
// Profiles as data: one lookup gives generator inputs plus the rules to record in DESIGN.md.
type Density = 'compact' | 'comfortable' | 'spacious'
type Profile = { contrast: number; density: Density; radius: number; typeBasePx: number; motion: 'none' | 'subtle' | 'expressive' }
type Modifier = 'real-time' | 'large-dataset' | 'regulated-money' | 'red-up-market' | 'older-audience'

const PROFILES = {
  finance: { contrast: 60, density: 'comfortable', radius: 6, typeBasePx: 14, motion: 'none' },
  analytics: { contrast: 50, density: 'comfortable', radius: 8, typeBasePx: 14, motion: 'subtle' },
  devtools: { contrast: 50, density: 'compact', radius: 6, typeBasePx: 14, motion: 'none' },
  consumer: { contrast: 55, density: 'comfortable', radius: 12, typeBasePx: 16, motion: 'subtle' },
  marketing: { contrast: 50, density: 'spacious', radius: 12, typeBasePx: 16, motion: 'expressive' },
  health: { contrast: 70, density: 'comfortable', radius: 8, typeBasePx: 16, motion: 'none' },
} satisfies Record<string, Profile>

export function deriveProfile(name: keyof typeof PROFILES, modifiers: readonly Modifier[]): Profile {
  const p: Profile = { ...PROFILES[name] }
  if (modifiers.includes('large-dataset')) p.density = 'compact'
  if (modifiers.includes('older-audience')) { p.contrast = Math.max(p.contrast, 60); p.typeBasePx = Math.max(p.typeBasePx, 16) }
  if (modifiers.includes('regulated-money') && p.motion === 'expressive') p.motion = 'subtle'
  return p
}
```

## Checklist
- [ ] The profile was chosen from user and task facts, which DESIGN.md lists.
- [ ] Modifiers that apply are recorded, and their rules are visible in the tokens or components.
- [ ] Generator inputs match the profile, or the difference has a reason.
- [ ] No profile default lowered a contrast floor or removed reduced-motion support.
- [ ] Money, status and data colours follow the dashboard-ui rules where data is shown.

## Sources
- https://www.nngroup.com/articles/dark-mode/
- https://www.nngroup.com/articles/usability-for-senior-citizens/
- https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/
- https://design.google/library/expressive-material-design-google-research
- https://design-system.service.gov.uk/styles/type-scale/
- https://service-manual.nhs.uk/design-system/styles/typography
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; product-type reasoning idea only)
- Repo: dashboard-ui `found-domain-profiles.md`, `ref-fintech-money-dashboards.md`, `ref-devops-dashboards.md`, `ref-product-analytics-dashboards.md`, `found-density-modes.md`
