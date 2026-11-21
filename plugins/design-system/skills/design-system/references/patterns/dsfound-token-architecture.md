# Token architecture: primitive → semantic → component, naming and versioning

> Keep three token tiers with references pointing one way only (components → semantic roles → primitives), name each tier by what it is for, and version the token set like a public API.

**Category:** Design-system foundations · **Applies to:** every token file, theme, component stylesheet and token package · **Priority:** must

## When to use / when not
- Use whenever a project has more than one screen, a dark mode, a second brand, or more than one person (or agent session) writing UI. Those are the cases where a raw value copied into a component turns into drift.
- A throwaway prototype can stop at two tiers (primitives and roles). It still names roles by job (`--text-muted`), never by look (`--gray-500`), so the third tier can be added later without renames.
- Not a reason to tokenise everything. A value used once, with no theme or brand variation, can stay local to its component (see `dsref-anti-patterns.md`, "token explosion").

## Rules (do)
- **Three tiers, one direction.**
  1. *Primitives* (also called base, core, or reference tokens) hold raw values: the 12-step ramps `--gray-1…12` and `--brand-1…12`, the spacing steps, the radius steps.
  2. *Semantic roles* say what a value is for: `--surface`, `--text`, `--text-muted`, `--border-strong`, `--accent`, `--danger-fg`. Themes and brands change this tier only.
  3. *Component tokens* are optional and local: `--button-bg: var(--accent)`. Add them only when a component needs its own knob (a brand that wants square buttons but round cards).
  Components read roles or their own component tokens. They never read primitives, and roles never read component tokens. Primer, Atlassian and Material all document the same split under different names.
- **The role vocabulary is fixed per project.** This plugin uses the dashboard-ui role set: `canvas, surface, surface-2, surface-3, sunken, hover, zebra, border, border-strong, text, text-muted, accent, on-accent, focus-ring, scrim, glass-tint`, the status quartets `danger|warning|success|info` × `-fg|-bg`, money roles `positive, negative, neutral-delta`, chart roles `chart-grid, chart-axis, chart-ink, chart-crosshair, cat-1…7, cat-other`, and `shadow-color`. `scripts/theme.mjs` emits exactly these names.
- **Every background role names its foreground.** `accent` pairs with `on-accent`, `danger-bg` with `danger-fg`, every surface with `text` and `text-muted`. A pair that is not declared is not verified, so it is not allowed.
- **Name grammar.** Use `--{role}[-{variant}][-{state}]` for roles (`--surface-2`, `--danger-bg`), `--{scale}-{step}` for primitives (`--space-4`, `--gray-11`), and `--{component}-{part}-{property}[-{state}]` for component tokens (`--table-header-bg-hover`). Lower-case kebab case only. Never put a theme or a value in a name (`--dark-surface`, `--blue-button`, `--padding-16`).
- **Steps are numbers, roles are words.** Primitives use numeric steps so new steps can be inserted (Radix uses 1–12; Tailwind 50–950). Roles use words so the meaning survives a re-theme.
- **Ramp steps have jobs.** Use a 12-step ramp where 1–2 are backgrounds, 3–5 interactive backgrounds, 6–8 borders, 9–10 solid fills, 11 low-contrast text and 12 high-contrast text (the Radix contract). The generator checks steps 11 and 12 as text against steps 1 and 2.
- **Version the token set with semver.** Treat the token names as an API:
  - *major*: a token is removed or renamed, or a role changes meaning;
  - *minor*: a token is added, or a value changes visibly (a new accent, a contrast step);
  - *patch*: a value changes invisibly (rounding, a gamut fix, a comment).
  Deprecate before removing. Keep the old name as an alias for one minor release (`--fg: var(--text)`) and mark it (`$deprecated` in DTCG, a comment in CSS). Record the version and the reason in the DESIGN.md decision log (`dsref-design-md-format.md`).
- **One source of truth.** Tokens live in one generated or authored file (CSS, DTCG JSON or DESIGN.md front matter). The others are outputs. Hand-editing an output is drift (`dsref-governance-drift.md`).

## Anti-patterns (don't)
- Components that read `--gray-600`, `#2563eb` or `oklch(...)` directly. Dark mode then needs a per-component override.
- Appearance names for roles (`--light-gray`, `--red`, `--primary-blue`). The name lies after a re-theme.
- Component tokens for every property of every component "just in case". The token count explodes and nobody knows which tier to change.
- Roles that reference other components' tokens (`--card-bg: var(--button-bg)`). That is a hidden coupling.
- Removing or renaming a token in a minor release.
- Two token files that both claim to be the source (a hand-edited `tokens.css` and a DTCG file that no longer matches it).

## Good references
- [GitHub Primer – Color overview](https://primer.style/foundations/color/overview) — base, functional and component tokens, with the rule that base tokens are not used directly in code.
- [Atlassian – Design tokens](https://atlassian.design/foundations/tokens/design-tokens) — semantic token names built from a fixed grammar (foundation, property, modifier), with deprecation handled by tooling.
- [Radix Colors – Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — every ramp step has one declared job, which is what makes the ramp safe to map onto roles.
- [Semantic Versioning 2.0.0](https://semver.org/) — the contract this pattern applies to token names.

## Bad references
- Bootstrap-4-style theme maps with `primary, secondary, success, info, warning, danger, light, dark` — `light` and `dark` are looks, not jobs, and there is no foreground pairing, so `text-warning` on white is 1.6:1 (computed for `#ffc107`).
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) palettes as shipped — one hex per role per product type, with no ramp and no declared pairs, so contrast is a property of each palette, not of the system (ideas only, MIT).

## Accessibility
- Contrast is verified per declared pair, so the pairing rule is an accessibility rule. `scripts/theme.mjs` checks every role pair against WCAG 2 (4.5:1 text, 3:1 non-text) and APCA in both themes.
- High contrast is a role remapping, not a component override: the generator re-runs at contrast 100 and emits only the roles that change under `@media (prefers-contrast: more)`.
- Forced-colours mode maps roles to system colours (`Canvas`, `CanvasText`, `Highlight`) in one place.

## Motion / interaction (if relevant)
- State colours (hover, pressed, selected) are ramp steps or `color-mix` of roles, not opacity on the component, so they stay inside the verified pairs.

## Tokens and values
| Tier | Example names | Who may read it |
|---|---|---|
| Primitive | `--gray-1…12`, `--brand-1…12`, `--space-1…8`, `--radius-xs…xl` | role tokens only (spacing and radius steps are also read directly) |
| Semantic role | `--surface`, `--text`, `--accent`, `--on-accent`, `--danger-fg`, `--danger-bg` | components |
| Component | `--button-bg`, `--table-row-h` | that component only |
| Version bump | rename or remove → major; add or visible change → minor; invisible fix → patch | DESIGN.md decision log |

## Implementation sketch
```css
/* tier 1: primitives, generated per theme */
:root {
  --gray-2: oklch(0.98 0.003 250);
  --gray-12: oklch(0.22 0.02 250);
  --brand-9: oklch(0.5 0.17 265);
  --space-3: 12px;
  --radius-md: 8px;
}
/* tier 2: roles (the generator resolves these to literals so each pair is verified on the shipped value) */
:root {
  --surface: oklch(1 0 0);
  --text: var(--gray-12);
  --accent: var(--brand-9);
  --on-accent: oklch(1 0 0);
  /* deprecated alias, remove in the next major */
  --fg: var(--text);
}
/* tier 3: a component token, only because brands differ here */
.button {
  --button-radius: var(--radius-md);
  background: var(--accent);
  color: var(--on-accent);
  border-radius: var(--button-radius);
  padding-inline: var(--space-3);
}
```

## Checklist
- [ ] No component stylesheet contains a colour literal or a primitive colour token (`grep -E '#[0-9a-f]{3,8}\b|oklch\(|--(gray|brand)-[0-9]'` outside token files returns nothing).
- [ ] Every background role has a declared foreground role, and the pair is in the generator's report.
- [ ] Role names describe jobs; no name contains a colour, a theme or a number of pixels.
- [ ] Component tokens exist only where a brand or density actually varies them.
- [ ] The token set has a version, and the DESIGN.md log says why it last changed.
- [ ] Deprecated names are aliased and marked, with a removal version.

## Sources
- https://primer.style/foundations/color/overview
- https://atlassian.design/foundations/tokens/design-tokens
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://semver.org/
- https://tr.designtokens.org/format/
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; ideas only)
- Repo: `plugins/dashboard-ui/skills/dashboard-ui-design/assets/tokens.css`, `color-system-architecture.md`
