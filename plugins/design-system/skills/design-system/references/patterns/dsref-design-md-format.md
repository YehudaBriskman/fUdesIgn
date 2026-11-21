# DESIGN.md: the design decision record

> Keep one `DESIGN.md` at the project root: machine-readable tokens in YAML front matter (the Google DESIGN.md format) and a prose record of every decision, per-page override and deviation, each with its reason, so later sessions reuse decisions instead of re-inventing them.

**Category:** Reference · **Applies to:** workflow steps 5 and 6; every later session that touches UI · **Priority:** must

## When to use / when not
- Write it in workflow step 5, as soon as tokens exist. Read it first in every later session, before any UI edit.
- If the project already has a DESIGN.md in another shape, extend it (add the missing sections) rather than replacing it. If it has `PRODUCT.md` or `.interface-design/system.md`, link to them and import their decisions.
- Not a style guide for humans to browse, and not a task list. Open work goes in issues.

## Rules (do)
- **Front matter follows the DESIGN.md format.** Google's `design.md` (Apache-2.0, version `alpha`) defines YAML front matter with `version`, `name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `motion` and `components`, plus `{path.to.token}` references. Mode-dependent colours go in `colors.light` and `colors.dark` groups; keep a top-level `primary` so the linter doesn't warn. `theme.mjs --format design-md` writes this block from the generated theme.
- **Prose sections in the spec's order:** Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Motion, Voice & Content Strategy, Components, Do's and Don'ts. Then this plugin's additions, which consumers preserve as unknown sections: **Generator inputs**, **Stack mapping**, **Page overrides**, **Deviations**, **Decision log**.
- **Generator inputs are recorded exactly**: `hue, tint, accent, contrast, density, radius, lockAccent`, the `theme.mjs` command line, and the report summary (pairs verified, adjustments). Anyone can regenerate the same tokens.
- **The profile and its evidence.** Name the profile from `dsfound-domain-profiles.md` (or "derived") and the 2–4 facts that chose it (audience, density need, regulation, locale).
- **Page overrides are scoped and justified.** One entry per page or view: what differs (density, accent use, type base), the scope (route or component), and the reason. Overrides change roles or steps, never role names.
- **Every deviation has a reason and an owner.** A deviation is any place the code breaks a rule in this skill or a token (an extra colour, a raw value, a lowered contrast for a decorative element). Record: what, where, why, who agreed, and when to revisit.
- **Decision log is append-only.** Date, version (semver of the token set), decision, reason. Supersede, don't delete.
- **Validate it.** `npx @google/design.md lint DESIGN.md` checks structure, references and contrast; `npx @google/design.md diff old new` exits 1 on regressions. Run both in CI when available (`dsref-governance-drift.md`).

## Anti-patterns (don't)
- A DESIGN.md that only describes the look ("clean, modern, minimal"). It must hold the values and the reasons.
- Tokens in DESIGN.md that differ from the generated CSS. One is generated from the other, or both from the inputs.
- Deviations without a reason ("we used #ff6600 here").
- Rewriting history in the decision log.
- One DESIGN.md per page. Use one file with page overrides.

## Good references
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) — the format: tokens in front matter, rationale in prose, section order, light/dark groups, lint and diff commands (Apache-2.0).
- [Michael Nygard – Documenting architecture decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — the decision-record idea (context, decision, consequences), applied here to design.
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — the "master file plus per-page overrides" mechanism that later pages re-read (idea only, MIT).

## Bad references
- Design docs kept in a wiki next to code that has moved on — nobody reads them during implementation, so they drift within weeks. The record has to live in the repo and be read by the agent first.

## Accessibility
- Contrast decisions are part of the record: the verified thresholds, the report summary, and any accepted exception (for example a decorative divider below 3:1) with its reason.
- Record the user-preference support: `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, forced colours.

## Motion / interaction (if relevant)
- The Motion section records the duration and easing tokens and the motion budget of the profile (none, subtle, expressive).

## Tokens and values
| Section | Holds | Source |
|---|---|---|
| Front matter | colors (light/dark), typography, rounded, spacing, components | `theme.mjs --format design-md` |
| Generator inputs | the exact inputs and command | the `theme.mjs` run |
| Stack mapping | which files are loaded, alias table, gaps | `dsmap-stack-mappings.md` |
| Page overrides | scope, change, reason | per page |
| Deviations | what, where, why, owner, revisit date | per exception |
| Decision log | date, version, decision, reason | append-only |

The full template is `assets/DESIGN.template.md`.

## Implementation sketch
```ts
// Read the decisions an agent needs before editing UI: page overrides and deviations for one route.
type Override = { scope: string; change: string; reason: string }

export function overridesFor(designMd: string, route: string): Override[] {
  const section = /^## Page overrides\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(designMd)?.[1] ?? ''
  const rows = section.split('\n').filter((l) => l.startsWith('|') && !l.includes('---'))
  return rows.slice(1).map((row) => {
    const [scope = '', change = '', reason = ''] = row.split('|').slice(1, -1).map((c) => c.trim())
    return { scope, change, reason }
  }).filter((o) => route.startsWith(o.scope.replaceAll('`', '')))
}
```

## Checklist
- [ ] DESIGN.md exists at the root, starts with valid front matter, and lints clean.
- [ ] Front-matter tokens match the generated CSS (regenerate, then diff).
- [ ] The generator inputs and command are recorded.
- [ ] Every page override and deviation has a reason.
- [ ] The decision log has an entry for the current token version.
- [ ] Later sessions read DESIGN.md before editing UI.

## Sources
- https://github.com/google-labs-code/design.md (Apache-2.0; `docs/spec.md`, version alpha)
- https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; ideas only)
- Repo: `plugins/design-system/skills/design-system/assets/DESIGN.template.md`
