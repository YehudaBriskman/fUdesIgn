# Design-system anti-patterns

> Check a design system against these twelve failures before calling it done; each one names how to detect it and the pattern that fixes it.

**Category:** Reference · **Applies to:** reviews of tokens, DESIGN.md and the code that uses them; end of every workflow run · **Priority:** must

## When to use / when not
- Use at the end of the workflow, when reviewing someone else's system, and when adopting this plugin in an existing codebase (to find what to fix first).
- Not a visual critique. Whether the brand looks good is a separate question; these are structural failures that make a system inconsistent or inaccessible.

## Rules (do)
Each entry: the failure → how to detect it → the fix.
1. **Raw values in components.** Hex, `oklch()` or pixel literals in component styles or class names. Detect: the drift grep (`dsref-governance-drift.md`). Fix: replace with roles and steps.
2. **Appearance names.** `--blue`, `--light-gray`, `--dark-bg`. Detect: grep token names for colour words and theme words. Fix: role names (`dsfound-token-architecture.md`).
3. **Unpaired backgrounds.** A background role with no declared foreground, so nobody checked the pair. Detect: the generator report lists every pair; a role missing from it is unverified. Fix: declare `on-*`.
4. **Contrast checked only in light, or only with WCAG 2.** Detect: the report has no `dark` rows or no APCA column. Fix: generate both themes; require APCA too (`dstoken-dark-mode-generation.md`).
5. **Dark mode by inversion.** Detect: dark values are 1 − L of the light values, or `filter: invert`. Fix: generate dark separately.
6. **Token explosion.** Hundreds of component tokens nobody varies; several tokens with identical values and meanings. Detect: count tokens per tier; find duplicates by value and name. Fix: delete tokens that no brand, theme or density changes.
7. **Two sources of truth.** CSS, JSON and DESIGN.md edited separately. Detect: regenerate and diff. Fix: one generator run produces all of them.
8. **Name collisions across libraries.** Loading shadcn's `--accent` beside ours. Detect: grep for both files being imported. Fix: one colour file per page (`dsmap-stack-mappings.md`).
9. **Brand colour everywhere.** Accent on panels, sidebars and headers. Detect: count accent uses outside actions, focus, selection and logo. Fix: neutral chrome (`dstoken-theming-multi-brand.md`).
10. **Scales with too many steps.** 12 font sizes, 14 spacing values, 9 radii. Detect: count distinct values in CSS. Fix: 5–7 type steps, 8 spacing steps, 5 radii (`dstoken-typography-scale.md`, `dstoken-spacing-radius-scales.md`).
11. **Undocumented exceptions.** One-off values in code with no reason. Detect: literals not covered by a DESIGN.md Deviations row. Fix: record or remove.
12. **Style picked before users.** A look chosen from a catalogue (glass, neon, brutalist) before the profile. Detect: DESIGN.md Overview names a style but no users or task. Fix: choose the profile from evidence first (`dsfound-domain-profiles.md`).

## Anti-patterns (don't)
- Treating this list as optional polish. Items 1, 3, 4 and 7 are the ones that make the system lie about itself.
- Fixing a failure by adding a waiver without a Deviations row.
- Fixing contrast by editing a generated file by hand.

## Good references
- [Stripe – Designing accessible color systems](https://stripe.com/blog/accessible-color-systems) — shows how unpaired, hand-picked colours led to a palette where nearly no default text colour passed, and how a systematic rebuild fixed it.
- [GitHub Primer – Color overview](https://primer.style/foundations/color/overview) — base vs functional tokens, and the rule that base tokens don't appear in product code (items 1 and 2).
- [WCAG 2.2 – Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — why input borders and focus rings are pairs too (item 3).

## Bad references
- Bootstrap-4-era theme maps (`primary`, `secondary`, `light`, `dark`, `warning`) — appearance names and no foreground pairs; `#ffc107` warning text on white is 1.63:1 and APCA Lc 27.8 (computed).
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) style-first generation — picks a named style and palette by keyword before knowing the users (item 12; ideas only, MIT).

## Accessibility
- Items 3, 4 and 5 are accessibility failures, not style issues. Treat them as blocking.
- Check high contrast and forced colours as part of item 4.

## Motion / interaction (if relevant)
- Raw durations and easings count as item 1 (raw values).

## Tokens and values
| # | Failure | Detection | Blocking? |
|---|---|---|---|
| 1 | raw values in components | drift grep | yes |
| 3 | unpaired backgrounds | pair missing from generator report | yes |
| 4 | light-only or WCAG-only checks | report lacks dark or APCA rows | yes |
| 7 | two sources of truth | regenerate and diff | yes |
| 2, 5, 6, 8–12 | naming, inversion, explosion, collisions, accent spread, long scales, undocumented exceptions, style first | grep, counts, DESIGN.md review | fix before the next minor version |

## Implementation sketch
```css
/* before: items 1, 2 and 9 in one rule */
.sidebar-old { background: #1e3a8a; color: #93c5fd; border-right: 1px solid #1e40af; }

/* after: neutral chrome from roles; the accent only marks the current item */
.sidebar { background: var(--canvas); color: var(--text-muted); border-right: 1px solid var(--border); }
.sidebar [aria-current="page"] { color: var(--text); background: var(--surface-2); box-shadow: inset 2px 0 0 var(--accent); }
```

## Checklist
- [ ] Drift grep returns no new literals (item 1).
- [ ] Token names describe jobs (item 2).
- [ ] Every background role appears in the generator report with its foreground (item 3).
- [ ] The report covers light, dark and high contrast, with WCAG 2 and APCA (items 4 and 5).
- [ ] Regenerate-and-diff is clean (item 7).
- [ ] Type, spacing and radius counts are within the scale sizes (item 10).
- [ ] Every exception has a Deviations row (item 11).
- [ ] DESIGN.md names users and task before any style (item 12).

## Sources
- https://stripe.com/blog/accessible-color-systems
- https://primer.style/foundations/color/overview
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; ideas only)
- Repo: dashboard-ui `ref-dashboard-anti-patterns.md`, `color-system-architecture.md`
