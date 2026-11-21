# WCAG 2.2 AA map, grouped by what you build

> Target WCAG 2.2 Level AA (55 success criteria: 31 at A, 24 at AA) and work through them by builder task, not by guideline number: structure, names, keyboard, focus, pointer, colour, motion, resize, media, forms and help, and status messages; each row names the file that owns the detail.

**Category:** Build · **Applies to:** every UI type (pages, apps, dashboards, forms, marketing, mobile web, AI features) · **Priority:** must

## When to use / when not
- **Use** at the start of a build to know which criteria a component touches, and at audit time as the coverage list behind `aref-audit-rubric-and-report.md`.
- **Use** as the router: each row points to the pattern that owns the rule, in this plugin or in a sibling plugin. Don't restate those rules in new code reviews; link them.
- **Not** a substitute for the normative text. When a pass/fail call is close, read the W3C Understanding page for that criterion.
- **Level AAA** is out of scope except where noted as a cheap upgrade (2.4.12, 2.4.13, 2.5.5).

## Rules (do)
- **Conformance target: WCAG 2.2 AA.** It is a superset of 2.0 and 2.1 AA except for 4.1.1 Parsing, which 2.2 removed as obsolete. Meeting 2.2 AA therefore covers laws that cite 2.0 AA (Section 508, Israel's IS 5568) or 2.1 AA (ADA Title II rule, EN 301 549 V3.2.1); see `alaw-legal-landscape.md`.
- **Count:** 2.2 has 31 Level A and 24 Level AA criteria. Six are new since 2.1 at A/AA: 2.4.11, 2.5.7, 2.5.8 (AA); 3.2.6, 3.3.7 (A); 3.3.8 (AA).
- **The map.** Every A/AA criterion, grouped by the task where you decide it:

| Builder task | Criteria (level) | Owner file |
|---|---|---|
| **Structure and landmarks** | 1.3.1 Info and Relationships (A), 1.3.2 Meaningful Sequence (A), 2.4.1 Bypass Blocks (A), 2.4.2 Page Titled (A), 3.1.1 Language of Page (A), 3.1.2 Language of Parts (AA), 2.4.5 Multiple Ways (AA), 3.2.3 Consistent Navigation (AA) | `a11y-structure-landmarks-headings.md` |
| **Headings and labels** | 2.4.6 Headings and Labels (AA), 1.3.1 (A) | `a11y-structure-landmarks-headings.md` |
| **Names, roles, states** | 4.1.2 Name, Role, Value (A), 2.5.3 Label in Name (A), 2.4.4 Link Purpose (A), 3.2.4 Consistent Identification (AA), 1.1.1 Non-text Content (A), 1.3.3 Sensory Characteristics (A) | `a11y-names-roles-states.md`, `aaria-first-rule-and-apg.md` |
| **Keyboard** | 2.1.1 Keyboard (A), 2.1.2 No Keyboard Trap (A), 2.1.4 Character Key Shortcuts (A), 3.2.1 On Focus (A) | `a11y-keyboard-focus-order.md`, dashboard-ui `comp-keyboard-shortcuts-focus.md` |
| **Focus order and visibility** | 2.4.3 Focus Order (A), 2.4.7 Focus Visible (AA), 1.4.11 Non-text Contrast (AA) for the ring | `a11y-keyboard-focus-order.md` |
| **Focus not obscured** | 2.4.11 Focus Not Obscured (Minimum) (AA) | `a11y-keyboard-focus-order.md` |
| **Pointer and touch** | 2.5.1 Pointer Gestures (A), 2.5.2 Pointer Cancellation (A), 2.5.4 Motion Actuation (A), 2.5.7 Dragging Movements (AA), 2.5.8 Target Size (Minimum) (AA), 1.3.4 Orientation (AA) | `a11y-pointer-targets-dragging.md`, mobile-ui `mofound-touch-targets.md` |
| **Colour and contrast** | 1.4.1 Use of Color (A), 1.4.3 Contrast (Minimum) (AA), 1.4.11 Non-text Contrast (AA), 1.4.5 Images of Text (AA) | `a11y-colour-and-contrast.md` → dashboard-ui `color-contrast-rules.md` |
| **Motion, timing and flashing** | 2.2.1 Timing Adjustable (A), 2.2.2 Pause, Stop, Hide (A), 2.3.1 Three Flashes or Below Threshold (A) | `a11y-motion-vestibular.md` → motion-ui `mfound-reduced-motion-vestibular.md` |
| **Resize, reflow, spacing, hover content** | 1.4.4 Resize Text (AA), 1.4.10 Reflow (AA), 1.4.12 Text Spacing (AA), 1.4.13 Content on Hover or Focus (AA) | `a11y-resize-reflow-text-spacing.md` |
| **Media** | 1.2.1 (A), 1.2.2 Captions (Prerecorded) (A), 1.2.3 (A), 1.2.4 Captions (Live) (AA), 1.2.5 Audio Description (AA), 1.4.2 Audio Control (A) | marketing-ui `mkfound-accessibility-floor.md` (video rules) |
| **Forms and errors** | 1.3.5 Identify Input Purpose (AA), 3.2.2 On Input (A), 3.3.1 Error Identification (A), 3.3.2 Labels or Instructions (A), 3.3.3 Error Suggestion (AA), 3.3.4 Error Prevention (AA) | forms-ui `ffound-form-accessibility.md`, `fvalid-error-summary-and-focus.md` |
| **Consistent help** | 3.2.6 Consistent Help (A) | `a11y-help-entry-authentication.md` |
| **Redundant entry** | 3.3.7 Redundant Entry (A) | `a11y-help-entry-authentication.md` |
| **Accessible authentication** | 3.3.8 Accessible Authentication (Minimum) (AA) | `a11y-help-entry-authentication.md`, forms-ui `fflow-authentication-and-passkeys.md` |
| **Status messages** | 4.1.3 Status Messages (AA) | `aaria-live-regions-announcements.md` |
| **Charts and data** | 1.1.1, 1.4.1, 1.4.11 applied to charts | dashboard-ui `chart-accessibility.md`, `chart-canvas-accessibility.md` |
| **Generated content** | 1.3.1, 3.1.2, 4.1.3 applied to model output | ai-ui `aifound-accessible-generated-content.md` |

- **Work order for a new screen:** structure → names → keyboard and focus → pointer → colour → motion → resize → forms and status → test (`atest-manual-test-plan.md`, `atest-automated-axe-playwright.md`).
- **Cheap AAA upgrades worth taking:** 2.4.13 Focus Appearance (a 2 px solid ring at 3:1 already meets it), 2.5.5 Target Size (Enhanced) 44 × 44 on touch (mobile-ui house rule), 2.4.12 Focus Not Obscured (Enhanced) when sticky bars are small.
- **"Accessibility supported":** a technique only counts if real assistive technology supports it. Native HTML first, then ARIA from an APG pattern; verify in at least one screen reader (`atest-screen-reader-cheatsheets.md`).

## Anti-patterns (don't)
- Auditing against WCAG 2.0 or 2.1 checklists and missing the six 2.2 additions (focus hidden under sticky bars, 16 px icon buttons, drag-only reordering, moving help links, re-asking for the address, CAPTCHA-only login).
- Reporting 4.1.1 Parsing failures as WCAG 2.2 failures; it is obsolete in 2.2 (still listed in 2.0/2.1 for laws that cite them).
- Treating an automated score of 100 as conformance; tools test a minority of criteria (`atest-automated-axe-playwright.md`).
- Claiming "WCAG compliant" without a level, version or scope statement (`alaw-accessibility-statement.md`).

## Good references
- [W3C — How to Meet WCAG 2.2 (Quick Reference)](https://www.w3.org/WAI/WCAG22/quickref/) — filterable by level and technology; the practical map behind this table.
- [W3C — What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — the nine new criteria with personas.
- [GOV.UK Service Manual — Making your service accessible](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction) — WCAG 2.2 AA as a team process, not a final check.
- [modern-web-guidance — Accessibility](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md) — each do/don't is tagged with its success criterion, a model for linking rules to criteria.

## Bad references
- Overlay and widget vendors that promise "WCAG 2.2 compliance" from one script tag: the criteria above are about markup, focus and content, which a toolbar cannot fix (see `aref-anti-patterns.md`).
- Checklists that still list only WCAG 2.0's 38 A/AA criteria: they miss reflow, text spacing, non-text contrast, target size and authentication.

## Accessibility
- This file is the accessibility scope. Pair it with the per-domain files it routes to; none of them is optional for its UI type.

## Motion / interaction (if relevant)
- Motion criteria (2.2.2, 2.3.1, and the AAA 2.3.3 that the motion-ui plugin adopts as house rule) are owned by `a11y-motion-vestibular.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Target standard | WCAG 2.2 AA | Build and audit baseline |
| A / AA criteria | 31 / 24 (55 total) | Audit coverage |
| New in 2.2 at A/AA | 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8 | Most-missed rows |
| Removed in 2.2 | 4.1.1 Parsing | Don't report against 2.2 |

## Implementation sketch
A typed map an audit script can iterate; it keeps the owner file next to each criterion so findings link to a fix.
```ts
type Level = 'A' | 'AA'
type Task = 'structure' | 'names' | 'keyboard' | 'focus' | 'pointer' | 'colour' | 'motion'
  | 'resize' | 'media' | 'forms' | 'help' | 'status'
interface Criterion { readonly id: string; readonly name: string; readonly level: Level; readonly task: Task; readonly owner: string }

export const NEW_IN_22: readonly Criterion[] = [
  { id: '2.4.11', name: 'Focus Not Obscured (Minimum)', level: 'AA', task: 'focus', owner: 'a11y-keyboard-focus-order.md' },
  { id: '2.5.7', name: 'Dragging Movements', level: 'AA', task: 'pointer', owner: 'a11y-pointer-targets-dragging.md' },
  { id: '2.5.8', name: 'Target Size (Minimum)', level: 'AA', task: 'pointer', owner: 'a11y-pointer-targets-dragging.md' },
  { id: '3.2.6', name: 'Consistent Help', level: 'A', task: 'help', owner: 'a11y-help-entry-authentication.md' },
  { id: '3.3.7', name: 'Redundant Entry', level: 'A', task: 'forms', owner: 'a11y-help-entry-authentication.md' },
  { id: '3.3.8', name: 'Accessible Authentication (Minimum)', level: 'AA', task: 'forms', owner: 'a11y-help-entry-authentication.md' },
]

export function byTask(list: readonly Criterion[]): Map<Task, Criterion[]> {
  const out = new Map<Task, Criterion[]>()
  for (const c of list) out.set(c.task, [...(out.get(c.task) ?? []), c])
  return out
}
```

## Checklist
- [ ] The project states its target as WCAG 2.2 Level AA.
- [ ] Each builder task in the table was walked for the screen under review.
- [ ] The six 2.2 additions were checked explicitly.
- [ ] Domain rows were delegated to their owner files (charts, forms, AI output, mobile, motion).
- [ ] No finding is reported against 4.1.1 for a 2.2 audit.
- [ ] Automated results were reported as partial coverage, not as conformance.

## Sources
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://www.w3.org/WAI/WCAG22/Understanding/parsing.html
- https://www.w3.org/WAI/WCAG22/Understanding/conformance
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
