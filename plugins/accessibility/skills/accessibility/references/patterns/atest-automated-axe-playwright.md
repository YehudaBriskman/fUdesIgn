# Automated testing: axe-core with Playwright, and its coverage limit

> Run axe-core through `@axe-core/playwright` on every key page and state in CI with the WCAG 2.2 A/AA tags, fail the build on any violation, keep keyboard and focus assertions as Playwright tests, and report automation as partial coverage: Deque measured about 57% of real audit issues found automatically, but only 16 of the 50 WCAG 2.1 AA criteria (about 30%) produced any automated finding.

**Category:** Testing · **Applies to:** CI pipelines, component tests, end-to-end tests, pre-merge checks · **Priority:** must

## When to use / when not
- **Use** in CI on every pull request that touches UI: it catches regressions in contrast, names, labels, ARIA validity, landmarks, duplicate IDs and (with the 2.2 tag) target size, cheaply and consistently.
- **Use Playwright assertions** for what axe can't see: tab order, focus moving into and out of dialogs, focus visibility, Esc behaviour, reflow width.
- **Not** as a conformance claim. Automation can't judge alt text quality, meaningful headings, reading order, keyboard operability of custom widgets, announcement timing, 2.4.11 obscuring, 2.5.7 drag alternatives, 3.2.6, 3.3.7 or 3.3.8; the manual plan covers those (`atest-manual-test-plan.md`).

## Rules (do)
- **Coverage, stated honestly:**
  - Deque's coverage report (13,000+ pages and page states, about 300,000 issues from first-time audits): 57.38% of issues by volume were found by automated tests; automated issues appeared for 16 of 50 WCAG 2.1 AA criteria, which Deque notes matches the commonly cited 20–30% criterion coverage. These are a tool vendor's numbers.
  - GOV.UK GDS (2017) built a page with 143 failures: the best single tool found 41%, the worst 17%, all the tools combined 71%.
  - So: report "automated checks pass" as one input; never as "accessible" or "compliant".
- **Tags for WCAG 2.2 AA:** `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']`. In axe-core 4.14 the only `wcag22aa` rule is `target-size`, which is **disabled by default** and runs only when you include that tag (or enable it by name). Add `best-practice` for landmark and heading hygiene, but keep it non-blocking if it's noisy.
- **Scan states, not just pages:** open menus, dialogs, expanded accordions, error states after an empty submit, dark mode, mobile viewport (390 × 844), and logged-in pages.
- **Fail on violations; triage "incomplete":** `violations` fail the build; `incomplete` ("needs review", e.g. text over images) goes to the manual pass.
- **Scope with `include`/`exclude`** only for third-party embeds you can't fix, and log them as known issues in the accessibility statement.
- **Keyboard tests in Playwright:** press Tab and assert `document.activeElement`; open a dialog and assert focus moved inside and returns on Esc; assert a focus ring is visible via computed `outline-style`.
- **Reflow test:** set the viewport to 320 px wide and assert `scrollWidth <= clientWidth`.
- **Pin versions** of axe-core in lockfiles; rule changes between versions change results.

## Anti-patterns (don't)
- A single axe run on the home page used as the "accessibility test".
- Disabling rules globally to get to green (`disableRules(['color-contrast'])`).
- Running without tags, which skips `target-size` and runs some rules that aren't WCAG requirements.
- Scanning only the default state of pages whose problems live in menus, dialogs and errors.
- Lighthouse scores of 100 quoted as compliance.

## Good references
- [Playwright — Accessibility testing](https://playwright.dev/docs/accessibility-testing) — `@axe-core/playwright` setup, tags, scoping, snapshots of known issues.
- [Deque — axe-core](https://github.com/dequelabs/axe-core) — rules, tags and the "zero false positives" design goal.
- [Deque — Automated Accessibility Coverage Report](https://www.deque.com/automated-accessibility-coverage-report/) — the 57.38% and 16-of-50 figures with method.
- [GOV.UK — What we found when we tested tools on the world's least-accessible webpage](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/) — 143 failures, best tool 41%, combined 71%.
- [modern-web-guidance — Accessibility §13 Automated checks](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#automated-checks) — axe or Lighthouse, and don't rely on scores.

## Bad references
- Vendor dashboards that convert an automated scan into a "compliance score" and a badge; the score measures only the automatable minority.

## Accessibility
- Automated results go into the audit report as their own section, with tool, version, tags and scanned states (`aref-audit-rubric-and-report.md`).

## Motion / interaction (if relevant)
- Run scans with `reducedMotion: 'reduce'` as well as the default so transitional states don't hide content from the scan.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Tags | `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` | WCAG 2.2 AA run |
| `target-size` | off unless `wcag22aa` tag or enabled by id | 2.5.8 |
| Build gate | 0 violations | CI |
| Coverage claim | ~57% of issues by volume; ~30% of AA criteria (Deque) | Reporting |
| Viewports | 1280 × 800, 390 × 844, 320 width for reflow | States |

## Implementation sketch
```ts
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const WCAG22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function expectNoViolations(page: Page, label: string): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG22_AA).analyze()
  const summary = results.violations.map((v) => `${v.id} (${v.impact ?? 'n/a'}): ${v.nodes.length} node(s)`)
  expect(summary, `${label}: axe violations`).toEqual([])
}

test('checkout is axe-clean in default, error and dialog states', async ({ page }) => {
  await page.goto('/checkout')
  await expectNoViolations(page, 'default')
  await page.getByRole('button', { name: 'Pay' }).click()            // empty submit → errors
  await expectNoViolations(page, 'errors')
  await page.getByRole('button', { name: 'Change address' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expectNoViolations(page, 'dialog')
})

test('dialog moves focus in and returns it on Escape', async ({ page }) => {
  await page.goto('/checkout')
  const trigger = page.getByRole('button', { name: 'Change address' })
  await trigger.click()
  const focusInDialog = await page.evaluate(() => document.activeElement?.closest('dialog, [role="dialog"]') != null)
  expect(focusInDialog).toBe(true)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})

test('reflows at 320 px without page-level horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/checkout')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})
```

## Checklist
- [ ] axe runs in CI with the five WCAG tags on every key page and state.
- [ ] Violations fail the build; "incomplete" items feed the manual pass.
- [ ] Error, dialog, menu, dark and mobile states are scanned.
- [ ] Keyboard focus and reflow have Playwright assertions.
- [ ] No rule is disabled globally; exclusions are logged as known issues.
- [ ] Reports state automated coverage as partial, with the cited figures.

## Sources
- https://playwright.dev/docs/accessibility-testing
- https://github.com/dequelabs/axe-core
- https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- https://www.deque.com/automated-accessibility-coverage-report/ (figures checked November 2026)
- https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/ (figures checked November 2026)
- tools/node_modules/axe-core 4.14.1 rule metadata: `target-size` is `enabled: false` with tags `wcag22aa`, `wcag258` (checked locally)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
