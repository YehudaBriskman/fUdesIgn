# Accessibility anti-patterns across UI types

> Eighteen failures recur in every kind of UI, from overlay widgets and `div` buttons to focus hidden under sticky bars, drag-only boards, CAPTCHA logins and toast-only errors; check for each one, link it to its criterion, and fix it with the named pattern rather than more ARIA.

**Category:** Review · **Applies to:** design and code reviews, audits, onboarding new team members · **Priority:** must

## When to use / when not
- **Use** as a quick pass before the full rubric (`aref-audit-rubric-and-report.md`), and in pull-request reviews.
- **Domain catalogues** go deeper for their areas: dashboard-ui `ref-dashboard-anti-patterns.md`, forms-ui `fref-form-anti-patterns.md`, marketing-ui `mkref-anti-patterns-gallery.md`, mobile-ui `moref-mobile-anti-patterns.md`, motion-ui `mref-anti-patterns-gallery.md`, ai-ui `airef-anti-patterns.md`.

## Rules (do)
- **Catalogue (bad → criterion → fix):**

| # | Anti-pattern | Criterion | Fix (pattern) |
|---|---|---|---|
| 1 | Accessibility overlay or toolbar sold as compliance | all | Fix the markup; publish an honest statement (`alaw-accessibility-statement.md`) |
| 2 | `<div>`/`<span>` buttons and links | 2.1.1, 4.1.2 | Native `<button>` / `<a href>` (`aaria-first-rule-and-apg.md`) |
| 3 | `outline: none` with no replacement | 2.4.7 | 2 px `:focus-visible` outline (`a11y-keyboard-focus-order.md`) |
| 4 | Focus hidden under sticky header, cookie bar or chat launcher | 2.4.11 | `scroll-padding`, non-overlapping banners (same) |
| 5 | Icon buttons with no name | 4.1.2 | `aria-label` or hidden text (`a11y-names-roles-states.md`) |
| 6 | Visible label differs from accessible name | 2.5.3 | Name starts with the visible text (same) |
| 7 | 16 px targets packed together | 2.5.8 | 24 px box or spacing (`a11y-pointer-targets-dragging.md`) |
| 8 | Drag-only reorder, kanban, slider | 2.5.7 | Move buttons or menu (same) |
| 9 | Colour-only status, errors or links | 1.4.1 | Text, icon, underline (`a11y-colour-and-contrast.md`) |
| 10 | Low-contrast placeholder used as label | 1.4.3, 3.3.2 | Visible label (forms-ui `ffound-labels-hints-placeholders.md`) |
| 11 | Fixed heights clipping text; no reflow at 320 px | 1.4.10, 1.4.12 | Fluid layout, `min-block-size` (`a11y-resize-reflow-text-spacing.md`) |
| 12 | `user-scalable=no` | 1.4.4 | Allow zoom (same) |
| 13 | Auto-rotating carousel or video with no pause | 2.2.2 | Pause control (`a11y-motion-vestibular.md`) |
| 14 | Toast-only errors; `role="alert"` on every toast | 3.3.1, 4.1.3 | Inline errors + polite status (`aaria-live-regions-announcements.md`) |
| 15 | `role="menu"` on site navigation; partial APG widgets | 4.1.2 | `<nav>` with links; complete the pattern (`aaria-first-rule-and-apg.md`) |
| 16 | Puzzle CAPTCHA or paste-blocked login | 3.3.8 | Passkeys, autofill, paste (`a11y-help-entry-authentication.md`) |
| 17 | Help link moves between templates; re-asking for addresses | 3.2.6, 3.3.7 | Shared help slot; "same as" (same) |
| 18 | Box-shadow focus and background-only states | forced colours (1.4.11, 2.4.7) | Outlines, borders, system colours (`a11y-forced-colours-high-contrast.md`) |

- **Fix order:** remove what's wrong (overlays, wrong ARIA), use native elements, then add what's missing.
- **Review habit:** for every new component, check rows 2, 3, 5, 7 and 14 before merge.

## Anti-patterns (don't)
- "Accessibility mode" toggles that switch to a separate, reduced version of the product; the main product must conform.
- Treating these rows as edge cases: each one blocks real tasks for keyboard, screen-reader, low-vision, motor or cognitive users.

## Good references
- [GOV.UK Design System](https://design-system.service.gov.uk/) — components built to avoid every row above, with published known issues.
- [W3C WAI — Before and After Demonstration](https://www.w3.org/WAI/demos/bad/) — the same site inaccessible and fixed, side by side.
- [Overlay Fact Sheet](https://overlayfactsheet.com/) — statement signed by accessibility practitioners on why overlays don't fix sites.
- [modern-web-guidance — Accessibility](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md) — the "Mandatory - Don't" rules map onto rows 2, 3 and 15.

## Bad references
- [FTC — Final order requiring accessiBe to pay $1 million (April 2025)](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million) — the FTC alleged the claim that its overlay could make any site WCAG-compliant was false, misleading or unsubstantiated; the order bars such claims without evidence.
- [W3C WAI — inaccessible demo home page](https://www.w3.org/WAI/demos/bad/before/home.html) — rows 2, 5, 9 and 11 in one page.

## Accessibility
- Every row is a WCAG 2.2 A/AA failure or a direct cause of one.

## Motion / interaction (if relevant)
- Row 13 and motion-ui's gallery cover motion failures.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Catalogue rows | 18 | Review pass |
| Merge-blocking rows | 2, 3, 5, 7, 14 | PR review |

## Implementation sketch
A quick DOM sweep for four rows a reviewer can run in the console or a test.
```ts
export interface Hit { row: number; el: Element }

export function sweep(root: Document = document): Hit[] {
  const hits: Hit[] = []
  for (const el of root.querySelectorAll('div[onclick], span[onclick]')) hits.push({ row: 2, el })
  for (const el of root.querySelectorAll('button, a[href], [role="button"]')) {
    const named = (el.textContent ?? '').trim() !== '' || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
    if (!named) hits.push({ row: 5, el })
    const r = el.getBoundingClientRect()
    if (r.width > 0 && (r.width < 24 || r.height < 24) && !el.closest('p, li > a:only-child')) hits.push({ row: 7, el })
  }
  const vp = root.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? ''
  if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(vp)) hits.push({ row: 12, el: root.documentElement })
  return hits
}
```
Row 7 hits are candidates only: confirm with the 24 px spacing test.

## Checklist
- [ ] No overlay script; statement is honest.
- [ ] No non-native interactive elements without full APG behaviour.
- [ ] Focus visible and never hidden by sticky content.
- [ ] All controls named; names match visible labels.
- [ ] Targets ≥ 24 px or spaced; drags have alternatives.
- [ ] No colour-only meaning; no clipped text at 320 px or with spacing overrides; zoom allowed.
- [ ] Auto-motion pausable; errors inline and announced politely.
- [ ] Login has no cognitive test; help is consistent; no re-entry.

## Sources
- https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million
- https://overlayfactsheet.com/
- https://www.w3.org/WAI/demos/bad/
- https://design-system.service.gov.uk/
- https://www.w3.org/TR/WCAG22/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
