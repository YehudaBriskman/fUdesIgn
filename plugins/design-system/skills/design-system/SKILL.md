---
name: design-system
description: Set up and maintain a coherent design system in the user's project - detect the stack and existing tokens, choose a product profile from evidence, generate verified OKLCH light/dark/high-contrast tokens (WCAG 2 and APCA checked, sRGB gamut-mapped), map them to Tailwind v4, shadcn/ui, CSS Modules, vanilla CSS or MUI, and keep a DESIGN.md decision record with per-page overrides and the reason for every deviation. Use when starting a UI project, adding dark mode or a second brand, generating a theme or colour palette from a brand colour, unifying inconsistent colours, spacing or type, writing or updating DESIGN.md, exporting tokens to DTCG JSON, or when a later session must stay consistent with earlier design decisions. Trigger even without the words "design system": "set up tokens", "make a theme from this colour", "our colours are a mess", "add dark mode", "keep the UI consistent", "white-label this".
---

# Design system

Sets up a design system in the user's project and keeps it consistent across sessions. It has three parts:
- **A generator:** `scripts/theme.mjs` turns a few inputs into verified tokens.
- **Patterns:** 11 pattern files under `references/patterns/`, each with rules, references, tokens, a sketch and a checklist. `references/INDEX.md` lists them with their one-line rules. The prefixes are `dsfound` (foundations), `dstoken` (tokens), `dsmap` (stack mapping) and `dsref` (decision record, governance, anti-patterns).
- **A decision record:** `assets/DESIGN.template.md`, the DESIGN.md written into the user's project.

The role names are those of the dashboard-ui plugin's `tokens.css`, so its patterns and this plugin's output fit together.

## Workflow

Follow these steps in order. In a later session, start at step 0 and then go straight to step 6 unless the inputs change.

0. **Load context.** If the project has a `DESIGN.md` (or `PRODUCT.md`, `.interface-design/system.md`), read it first. Its decisions win over this skill's defaults; change them only with the user's agreement and a decision-log entry.

1. **Detect the stack and any existing tokens.**
   - Stack: `@import "tailwindcss"` or `@theme` in CSS (Tailwind v4); `tailwind.config.*` (v3); `components.json` (shadcn/ui); `@mui/material` in `package.json` (MUI); `*.module.css` (CSS Modules); otherwise vanilla CSS.
   - Existing tokens: grep for `--[a-z-]+:` declarations, `createTheme(`, `*.tokens.json`, `theme.extend`.
   - Drift baseline: count raw colour literals and arbitrary utility values outside token files (sketch in `dsref-governance-drift.md`).
   - Write down what exists. If there is a system, the next steps map onto it instead of replacing it.

2. **Write the design brief, then choose or derive a profile.**
   - **Form an opinion before any token.** Without one, generated UI lands on the average of its training data. Answer four questions in a few lines each, from what you know of the users (ask only what you can't infer):
     1. *Why would someone open this?* The trigger and the one question they arrive with.
     2. *How do they actually use it?* Frequency, device, glance or deep work, alone or with others.
     3. *What would they want to know next?* The follow-up question after the first answer; it decides what links to what.
     4. *What are you willing to leave out?* Name features, data and decoration you won't build, and the trade-off you accept for it.
   - **Check every borrowed pattern against its reason.** For each pattern taken from another product or a kit (an account popover, a three-field date, an onboarding deck, a card grid), write the reason it exists in its source and whether that reason holds here. If it doesn't, the parts survive but the reason doesn't: drop or redesign the pattern. A single-account app has no reason to lead its account menu with the email address that disambiguates accounts in a multi-account mail client.
   - **Decide who carries the complexity.** Tesler's law (the law of conservation of complexity): some complexity can't be removed, only moved, so move it into the system rather than onto the user. Note where that costs build effort (forms-ui `finput-dates-and-times.md` has a worked example).
   - Record the answers in DESIGN.md under Overview → Design brief. The profile, the emphasis and every later deviation should trace back to them.
   - From the users and task, not the industry label, pick finance, analytics, dev tools, consumer, marketing or health. If none fits, derive one by combining axes. Add the condition modifiers that apply (real-time, large dataset, regulated money, red-up market, older audience). See `dsfound-domain-profiles.md`.
   - The profile gives `contrast`, `density`, `radius`, type base and motion budget. The brand gives `hue`, `tint` and `accent`. Ask the user only for what you cannot infer (usually the brand colour).
   - Never start from a visual style ("glassmorphism", "neon") before the brief and the profile.

3. **Generate the tokens.**
   - Write the inputs to `design/theme.json` and run:
     `node <skill>/scripts/theme.mjs --config design/theme.json --out design/tokens --format css,tailwind,dtcg,design-md,report`
     (`shadcn` instead of or beside `tailwind` for shadcn projects).
   - The script checks every role pair in light, dark and both high-contrast themes against WCAG 2 (4.5:1 text, 3:1 non-text) and APCA (Lc 75 body, 60 text, 30 non-text), gamut-maps to sRGB, and moves foreground lightness until each pair passes. It prints each adjustment. It exits 1 and lists the failing pairs when it cannot comply, for example with `--lock-accent` and a brand colour too light for text.
   - On failure, don't edit the output. Change an input (unlock the accent, use the exact brand colour only for the logo) and run it again.
   - Type, spacing and radius come from `dstoken-typography-scale.md` and `dstoken-spacing-radius-scales.md`. Dark mode is explained in `dstoken-dark-mode-generation.md`. For more than one brand, see `dstoken-theming-multi-brand.md`.

4. **Map them to the stack** (`dsmap-stack-mappings.md`).
   - Tailwind v4: import `tokens.css`, then `tailwind.css`.
   - shadcn/ui: `shadcn.css` alone. Its `--accent` collides with ours, so never load both.
   - CSS Modules or vanilla: load `tokens.css` once globally.
   - MUI: `createTheme({ cssVariables: true, colorSchemes })` from the `hex` values in `tokens.json`.
   - Existing tokens: write an alias layer (existing name → role), list the gaps, and don't rename the project's tokens.
   - DTCG consumers (Style Dictionary, Figma plugins): `tokens.json` (`dstoken-dtcg-format.md`).

5. **Write DESIGN.md** in the project root from `assets/DESIGN.template.md` (`dsref-design-md-format.md`).
   - Paste `design-md-frontmatter.md` over the template's front matter.
   - Fill in Overview (users, task, profile and its evidence), the spec sections, Generator inputs (with the exact command and report summary), Stack mapping, Page overrides, Deviations and the Decision log (version 1.0.0).
   - Lint it when possible: `npx @google/design.md lint DESIGN.md`.

6. **Keep it consistent in later sessions** (`dsref-governance-drift.md`).
   - Before editing UI, read DESIGN.md and the page override for the route you touch.
   - Use roles and steps only. A needed value that has no token is either a new token (an input change, regenerated, logged with a version bump) or a deviation (a row in Deviations with what, where, why, who agreed and when to revisit, plus a `ds-allow:` comment in code that points at the row).
   - A page that needs to differ (compact density, a quieter accent) gets a Page overrides row with its scope and reason. Overrides change role values or steps, never role names.
   - Finish by re-running the drift count. It must not rise. Run `theme.mjs` with the recorded inputs and diff against `design/tokens`. Then go through `dsref-anti-patterns.md`.
   - Offer CI for these checks when the project has CI.

## Non-negotiables

Break one only with a written reason in DESIGN.md Deviations.

1. Components use semantic roles and scale steps, never raw colour, size or radius literals, and never primitive ramp tokens.
2. Roles are named by job (`--text-muted`), never by appearance (`--gray-500`, `--blue`) or theme (`--dark-bg`).
3. Every background role has a declared foreground, and the pair is verified in light, dark and high contrast.
4. Text meets WCAG 2 4.5:1 and APCA |Lc| 60 (body text Lc 75). Non-text UI meets 3:1 and Lc 30 (APCA's minimum for solid semantic non-text; Lc 15 is only for non-semantic dividers). No profile, brand or page override lowers these floors.
5. Dark mode is generated as its own theme, not inverted, and is checked with APCA as well as WCAG 2.
6. Tokens have one source: the generator inputs. CSS, Tailwind, shadcn, DTCG and the DESIGN.md front matter are regenerated outputs, never hand-edited.
7. The brand accent is for actions, focus, selection and the logo. Chrome stays neutral.
8. Scales stay short: 5–7 type steps, 8 spacing steps on a 4px base, and 5 radii from one base. Density swaps steps, not type size.
9. DESIGN.md exists and is read first in every session. Every page override and every deviation has a reason.
10. A design brief (why people open it, how they use it, what they want next, what is left out) is written before any token, and every borrowed pattern names the reason it exists and why that reason holds here.
11. Token names are versioned with semver: removal or rename is major, addition or visible change is minor. Deprecate with an alias before removing.

## Generator reference

| Input | Range | Default | Effect |
|---|---|---|---|
| `hue` | 0–360 | 250 | neutral hue (cool blue-grey) |
| `tint` | 0–3 | 1 | neutral chroma; 0 = pure greys |
| `accent` | `#hex`, `oklch(L C H)` or a hue | `oklch(0.50 0.17 265)` | brand hue and chroma; lightness is generated per theme |
| `contrast` | 0–100 | 50 | distance between text, borders and surfaces; the floors hold at any value |
| `density` | compact, comfortable, spacious | comfortable | default density; the others are `[data-density]` overrides |
| `radius` | 0–32 px | 8 | `md` step; xs/sm/lg/xl = ×0.5/0.75/1.5/2 |
| `lockAccent` | boolean | false | keep the exact accent in light, or fail |
| `highContrast` | boolean | true | emit `prefers-contrast: more` themes (contrast 100) |

| Output (`--format`) | File | Use |
|---|---|---|
| `css` | `tokens.css` | drop-in for dashboard-ui `tokens.css`: ramps, roles, type, spacing, radius, motion, density, light/dark/high-contrast, money conventions |
| `tailwind` | `tailwind.css` | Tailwind v4 `@theme` mapping; load after `tokens.css` |
| `shadcn` | `shadcn.css` | shadcn/ui variables, `:root` and `.dark`, standalone |
| `dtcg` | `tokens.json` | DTCG 2025.10 JSON, modes as `color.light`, `color.dark`, `color.light-hc`, `color.dark-hc` |
| `design-md` | `design-md-frontmatter.md` | DESIGN.md front matter (Google format, version alpha) |
| `report` | `theme-report.json` | every pair checked, with ratio, Lc, pass, adjustments and gamut mapping |

Exit codes: 0 means ok, 1 means the theme cannot meet the checks (the failing pairs are listed), 2 means invalid input. Tests: `node --test scripts/`.

## How to apply this skill

- **New project:** run the full workflow, steps 0–6, starting the design brief in step 2 before any token.
- **Existing system:** run steps 0–1. Then map the roles onto the existing tokens and record the gaps and the drift baseline in DESIGN.md. Generate only what is missing, unless the user asks to replace the system.
- **"Make a theme from this colour":** steps 2–3, then 4–5 if the user wants it in the project.
- **Review:** run `dsref-anti-patterns.md` and report each failure with evidence (file, line, value) and the fix, blocking items first.
- **Dashboards:** use this plugin for the tokens and DESIGN.md, and the dashboard-ui plugin for layout, data display and charts. The role names are the same.
- **Conflicts:** accessibility floors beat brand and aesthetics. The user's recorded decisions beat this skill's defaults. Evidence beats taste.
- Never use the TypeScript `any` type in code you write for the user; parse unknown JSON with a schema (the DTCG and MUI sketches show how).
