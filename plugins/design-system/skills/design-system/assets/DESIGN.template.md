---
version: alpha
name: <Product name>
description: <One sentence: who uses it and for what.>
colors:
  primary: "<light accent, from theme.mjs>"
  light:
    canvas: "<oklch(...)>"
    surface: "<oklch(...)>"
    surface-2: "<oklch(...)>"
    surface-3: "<oklch(...)>"
    border: "<oklch(...)>"
    border-strong: "<oklch(...)>"
    text: "<oklch(...)>"
    text-muted: "<oklch(...)>"
    accent: "<oklch(...)>"
    on-accent: "<oklch(...)>"
    danger-fg: "<oklch(...)>"
    warning-fg: "<oklch(...)>"
    success-fg: "<oklch(...)>"
    info-fg: "<oklch(...)>"
  dark:
    canvas: "<oklch(...)>"
    surface: "<oklch(...)>"
    text: "<oklch(...)>"
    text-muted: "<oklch(...)>"
    accent: "<oklch(...)>"
    on-accent: "<oklch(...)>"
typography:
  title:
    fontFamily: <family>
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: <family>
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.45
rounded:
  sm: 6px
  md: 8px
  lg: 12px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
components:
  button-primary:
    backgroundColor: "{colors.light.accent}"
    textColor: "{colors.light.on-accent}"
    rounded: "{rounded.md}"
---

<!--
  Generate the front matter with:
    node <skill>/scripts/theme.mjs --config design/theme.json --out design/tokens --format css,design-md,report
  then paste design/tokens/design-md-frontmatter.md over the block above.
  Keep this file in the repo root. Read it before every UI change. Open work goes in issues, not here.
-->

## Overview

<Who the users are, the job they do with this product, and the feeling it should have, in 3–5 sentences.>

- **Profile:** <finance | analytics | dev tools | consumer | marketing | health | derived> (see `dsfound-domain-profiles.md`)
- **Evidence for the profile:** <2–4 facts: audience, density need, regulation, locale, devices>
- **Token set version:** <semver, e.g. 1.0.0>

### Design brief

Written before any token. Every page override and deviation below should trace back to it.

- **Why would someone open this?** <The trigger and the first question they arrive with.>
- **How do they actually use it?** <Frequency, device, glance or deep work, alone or shared.>
- **What would they want to know next?** <The follow-up question; what must link to what.>
- **What are we leaving out?** <Features, data and decoration we won't build, and the trade-off we accept.>
- **Who carries the complexity?** <Where the system absorbs work the user would otherwise do (Tesler's law), and what that costs to build.>

| Borrowed pattern | Why it exists in its source | Does the reason hold here? | Decision |
|---|---|---|---|
| <e.g. email at the top of the account menu> | <disambiguates several signed-in accounts> | <no: one account per user> | <drop; lead with status and workspace> |

## Colors

<Where the accent is used (actions, focus, selection, logo) and where it is not. Status and money conventions (green-up or red-up, colour-blind option). Neutral temperature.>

## Typography

<Families and why. Base size and ratio. Numbers use tabular lining figures.>

## Layout

<Grid, spacing scale, default density and where compact or spacious applies.>

## Elevation & Depth

<Surface steps (canvas, surface, surface-2, surface-3, sunken), when to use a border vs a shadow.>

## Shapes

<Radius base and scale; which components use which step; nested corners.>

## Motion

<Duration and easing tokens; motion budget (none, subtle, expressive); reduced-motion behaviour.>

## Voice & Content Strategy

<Tone, number and date formats, locale.>

## Components

<Component library and the role tokens each key component uses.>

## Do's and Don'ts

- Do <rule specific to this product>.
- Don't <rule specific to this product>.

## Generator inputs

| Input | Value |
|---|---|
| hue | <250> |
| tint | <1> |
| accent | <oklch(0.5 0.17 265) or #hex> |
| contrast | <50> |
| density | <comfortable> |
| radius | <8> |
| lockAccent | <false> |

Command: `<node .../theme.mjs --config design/theme.json --out design/tokens --format css,tailwind,dtcg,design-md,report>`
Report: <N pairs verified, M adjustments, 0 failures>

## Stack mapping

- **Stack:** <Tailwind v4 + shadcn/ui | CSS Modules | vanilla | MUI>
- **Loaded files:** <tokens.css + tailwind.css | shadcn.css | MUI theme from tokens.json>
- **Aliases and gaps:** <existing token → role; roles with no existing token>

## Page overrides

| Scope | Change | Reason |
|---|---|---|
| `<route or component>` | <e.g. density compact> | <why this page differs> |

## Deviations

| What | Where | Why | Agreed by | Revisit |
|---|---|---|---|---|
| <e.g. decorative divider at 1.4:1> | `<file or component>` | <reason> | <name> | <date or version> |

## Decision log

| Date | Version | Decision | Reason |
|---|---|---|---|
| <YYYY-MM-DD> | 1.0.0 | Initial system from profile <x> | <evidence> |
