# Domain profiles: starting defaults by product type

> Start every dashboard from the profile of its domain (dashboard type, density, theme, motion budget, colour rules, must-have states and the domain's typical failure), then change a default only with a written reason.

**Category:** Foundations · **Applies to:** workflow step 1 (classify the view), new products, design reviews, agent-generated dashboards · **Priority:** should

## When to use / when not
- **Use** at the start, together with `found-dashboard-types.md`. The type file says *how* operational, analytical and strategic views differ. This file says which of them a domain usually needs, and what that domain gets wrong.
- **Use** it to override generic defaults that are wrong for the domain. Examples: a dark default for a consumer finance app, red/green for status in a red-up market, pulsing alerts in clinical software.
- **Don't** treat a row as a style. A profile sets starting values for density, theme and motion. It never picks a font or a brand palette.
- **Don't** use a row when the brief contradicts it. If clinicians asked for a dark room-monitor mode, the brief wins and the decision is written down.

## Rules (do)
### Profiles

Columns:
- **Type:** O = operational, A = analytical, S = strategic (see `found-dashboard-types.md`).
- **Density:** see `found-density-modes.md`.
- **Theme:** the default before the user chooses. "System" means follow `prefers-color-scheme` and offer a toggle (see `style-theme-consistency.md`).
- **Motion:** none (state changes only), low (≤ 200 ms feedback and data transitions) or medium (adds view transitions up to 300 ms). See `motion-principles-and-tokens.md`.

| Domain | Type | Density | Theme | Motion | Colour rules | Must-have states | Typical failure | Read |
|---|---|---|---|---|---|---|---|---|
| Consumer fintech / banking | S, A | Comfortable | System | Low | Money direction separate from status; gains not celebrated | Pending vs posted, zero vs missing, stale balance | Confetti and streaks that push action | `ref-fintech-money-dashboards.md` |
| Trading / brokerage | O | Compact | System; dark offered | Low | Up/down by market convention, setting exposed | Market closed, delayed quote (15 min) labelled, halted | Flashing every tick | `chart-financial-price-value.md` |
| Investing research / valuation | A | Medium | System | Low | Verdict scale neutral, not success/danger | Low confidence, not computable, assumptions changed | Precise-looking verdict with no method | `ref-investing-valuation-tools.md`, `data-verdict-rating-badges.md` |
| Finance back-office / accounting | A | Compact | Light | None | Accounting negatives in parentheses allowed | Period closed or open, restated, unreconciled | Summing mixed currencies | `data-number-formatting.md` |
| DevOps / observability | O | Compact | System; dark common | Low | Status colours only for SLO breach | No data vs zero, partial scrape, silenced alert | Christmas-tree panel colours | `ref-devops-dashboards.md` |
| Security operations (SOC) | O | Compact | System; dark common | None | Severity scale of 4–5 steps, shape plus text | Acknowledged, suppressed, false positive | Every alert "critical" | `color-semantic-status.md` |
| Product analytics | A | Medium | System | Low | Categorical palette, colour-blind safe | Sampling, data delay, small-n warning | Vanity totals without a period | `ref-product-analytics-dashboards.md` |
| Sales / CRM | S, A | Medium | Light | Low | Target vs actual, no traffic lights | Quota not set, territory empty | Gauges for quota | `data-kpi-stat-card.md` |
| E-commerce admin | O, A | Medium | System | Low | Status chips for order states | Out of stock, refund pending, sync failed | Same red for "unpaid" and "loss" | `color-semantic-status.md` |
| Healthcare clinical | O | Medium | Light | None | Colour reserved for abnormal; redundant coding | Result pending, critical value acknowledged | Alert fatigue | `color-minimal-usage.md` |
| Industrial / IoT control | O | Medium | Light neutral grey | None | Grey normal state, colour only for abnormal | Comms lost, stale sensor, manual override | Saturated 3D equipment graphics | `color-minimal-usage.md` |
| Logistics / fleet | O | Medium | System | Low | Map + list linked, status by shape too | GPS stale, ETA unknown | Map-only view with no list | `motion-linked-exploration.md` |
| HR / people | S | Comfortable | Light | Low | No red for people metrics; neutral emphasis | Small-group suppression (n < 5) | Ranking named individuals | `found-scanning-kpi-pyramid.md` |
| Education / LMS | S, A | Comfortable | Light | Low | Progress, not grades, in colour | Not started vs zero score | Leaderboards for minors | `data-delta-trend-indicators.md` |
| Executive / board | S | Comfortable | Light | None | Target lines; one accent | Plan not set, prior period missing | Twelve-card vanity row | `found-scanning-kpi-pyramid.md` |

### Condition modifiers (closed vocabulary)
Apply after the row. Each modifier has one name and one effect. Don't invent free-form conditions.

| Modifier | Effect |
|---|---|
| `if-real-time` | Freshness strip always visible, stale threshold stated, no per-tick animation; see `data-timestamps-freshness.md` and `prog-stale-while-revalidate.md` |
| `if-large-dataset` | Virtualised tables, server-side aggregation, canvas charts with an accessible table; see `chart-canvas-accessibility.md` |
| `if-regulated-money-action` | Confirmation restates amount and account, undo where the law allows, disclosures inline; see `comp-onboarding-and-notices.md` |
| `if-red-up-market` | Mainland China, Taiwan, Japan and Korea quote rises in red; default by locale and expose a setting; see `color-semantic-status.md` |
| `if-shared-screen` | Wall or TV: larger type, no hover-only information, comfortable density |
| `if-public-or-anonymous` | No user-specific state in URLs; suppress small groups |
| `if-print-or-pdf` | Light theme, no colour-only encoding, page-break-safe tables |
| `if-mobile-first` | 44px targets, 1 KPI column, no hover-only details; see `found-responsive-reflow.md` |

### How to use
1. Pick the row. If two fit (a valuation tool inside a brokerage), take the stricter value per column.
2. Apply modifiers.
3. Write the result into the project's design record (classification, row, modifiers, overrides with reasons).
4. Check the "Typical failure" column against the finished view.

### Why these defaults
- **Light or system, not dark, by default.** NN/g's review found that people with normal vision do better in light mode, and the gap widens as text gets smaller. NN/g advises against a dark default for a general audience. Dark is offered, and is common where users choose it (observability, SOC).
- **Colour only for the abnormal** in operational domains. ISA-101 high-performance HMI practice uses a neutral grey normal state so that deviations stand out, and codes alarms by shape, colour and text together.
- **No motion in clinical and control rooms.** AHRQ PSNet reports 187 monitor warnings per ICU patient per day in one 2014 study and recommends ranking warnings by severity and interrupting only for the most serious. Movement is an interruption.
- **Small-group suppression** in HR and education: showing a statistic for a group of 1–4 people identifies them.

## Anti-patterns (don't)
- Using a keyword match on the brief to pick a profile ("portfolio" matched a creative-portfolio landing page in one popular skill's data set). Classify by the user's first question, not by nouns.
- Dark mode by default for finance "because trading terminals are dark". Bloomberg-style terminals are a professional choice, not a consumer default.
- Pulsing or animated numbers as a domain style.
- Glass or blur on data surfaces as a "fintech look" (see `style-glass-translucency.md`).
- Red/green for gain and loss in a red-up market with no setting.
- A profile row applied silently. Every deviation must be written down.

## Good references
- [NN/g: Dark mode vs light mode](https://www.nngroup.com/articles/dark-mode/) — light mode wins for normal vision, and more at small text sizes; keep light as the default for general audiences and offer dark.
- [ISA blog: The high-performance HMI](https://blog.isa.org/the-high-performance-hmi) — recommends redundantly coded alarm indicators (shape, colour, text) instead of changing the colour of a value. See also [Control.com: Going gray](https://control.com/technical-articles/going-gray/) for the grey-normal convention.
- [AHRQ PSNet: Alert fatigue](https://psnet.ahrq.gov/primer/alert-fatigue) — 187 warnings per patient per day; rank by severity, make lower-severity alerts non-interruptive.
- [Grafana preferences](https://grafana.com/docs/grafana/latest/administration/organization-preferences/) — theme is set per server, organisation, team and user, with the lowest level winning. A good model for "domain default, user override".
- [Benzinga: red and green in Asian markets](https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan) — red means up in mainland China, Japan and Taiwan.

## Bad references
- [ui-ux-pro-max skill data](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — its "Financial Dashboard" reasoning row makes dark the default, lists light mode as an anti-pattern and recommends real-time number animation and alert pulses. That contradicts NN/g's polarity findings and our motion rules. (Read 2026-11-21; studied, not copied.)
- [Grafana preferences](https://grafana.com/docs/grafana/latest/administration/organization-preferences/) — the built-in fallback theme is dark unless an admin changes it. Teams inherit a dark default without deciding.

## Accessibility
- The profile never lowers the accessibility floor: 4.5:1 text, 3:1 marks, keyboard paths, reduced motion. "None" motion is also the reduced-motion behaviour for every row.
- `if-shared-screen` must not rely on hover; `if-print-or-pdf` must not rely on colour.
- Red-up settings change colour only. Arrows and signs stay, so meaning never depends on hue.

## Motion / interaction (if relevant)
- Motion budget per row is an upper bound. Anything above "low" in an operational domain needs a written reason.
- Live data in O rows updates in place without count-up or flash (see `motion-number-tweening.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Motion budget none | state changes only, 0 ms | Clinical, control, back-office |
| Motion budget low | ≤ 200 ms, feedback and data transitions | Most rows |
| Motion budget medium | ≤ 300 ms, adds view transitions | Consumer apps only |
| Small-group threshold | n < 5 suppressed | HR, education, public data |
| Delayed quote label | "Delayed 15 min" | Trading rows without real-time entitlement |
| Severity steps | 4–5 | SOC, observability |

## Implementation sketch
Profiles as typed data, so an agent or a lint step can read them. Modifiers are a closed union.
```ts
type DashType = 'operational' | 'analytical' | 'strategic'
type Density = 'compact' | 'medium' | 'comfortable'
type ThemeDefault = 'system' | 'light' | 'light-neutral'
type MotionBudget = 'none' | 'low' | 'medium'
type Modifier =
  | 'if-real-time' | 'if-large-dataset' | 'if-regulated-money-action' | 'if-red-up-market'
  | 'if-shared-screen' | 'if-public-or-anonymous' | 'if-print-or-pdf' | 'if-mobile-first'

interface DomainProfile {
  readonly types: readonly DashType[]
  readonly density: Density
  readonly theme: ThemeDefault
  readonly motion: MotionBudget
  readonly typicalFailure: string
  readonly read: readonly string[]
}

const PROFILES = {
  'investing-research': {
    types: ['analytical'], density: 'medium', theme: 'system', motion: 'low',
    typicalFailure: 'Precise-looking verdict with no method',
    read: ['ref-investing-valuation-tools.md', 'data-verdict-rating-badges.md'],
  },
  'healthcare-clinical': {
    types: ['operational'], density: 'medium', theme: 'light', motion: 'none',
    typicalFailure: 'Alert fatigue', read: ['color-minimal-usage.md'],
  },
} as const satisfies Record<string, DomainProfile>

type Domain = keyof typeof PROFILES

interface Decision { domain: Domain; modifiers: Modifier[]; overrides: { field: keyof DomainProfile; value: string; reason: string }[] }

const ORDER: Record<MotionBudget, number> = { none: 0, low: 1, medium: 2 }

/** Strictest motion wins when a view spans two domains. */
export function mergeMotion(a: Domain, b: Domain): MotionBudget {
  const ma = PROFILES[a].motion, mb = PROFILES[b].motion
  return ORDER[ma] <= ORDER[mb] ? ma : mb
}

export const example: Decision = {
  domain: 'investing-research',
  modifiers: ['if-red-up-market'],
  overrides: [{ field: 'density', value: 'compact', reason: 'Analysts compare 40+ peers in one table' }],
}
```

## Checklist
- [ ] One profile row is chosen from the user's first question, not from keywords.
- [ ] Modifiers come from the closed list; none are invented.
- [ ] Theme default is light or system unless a written reason says otherwise.
- [ ] Motion stays within the row's budget; reduced motion maps to "none".
- [ ] The row's must-have states exist in the build.
- [ ] The row's typical failure was checked and is absent.
- [ ] Every deviation from the row is written in the design record with a reason.

## Sources
- https://www.nngroup.com/articles/dark-mode/
- https://blog.isa.org/the-high-performance-hmi (cited via search summary)
- https://control.com/technical-articles/going-gray/ (cited via search summary)
- https://psnet.ahrq.gov/primer/alert-fatigue
- https://grafana.com/docs/grafana/latest/administration/organization-preferences/ (cited via search summary)
- https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (studied locally; mechanic of a domain table only, no content copied)
- Stephen Few, *Information Dashboard Design* (2006), strategic / analytical / operational roles, via `found-dashboard-types.md`
- Repo: patterns `found-dashboard-types.md`, `found-density-modes.md`, `color-semantic-status.md`, `color-dark-mode.md`
