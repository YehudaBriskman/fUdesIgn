# fUdesIgn

UI design skills and plugins for coding agents. They are built from researched patterns that come with concrete rules, numbers, good and bad references, and tokens you can use as-is.

The first plugin is **dashboard-ui**. Later plugins will add more design areas, such as forms, marketing pages, mobile, design-system scaffolding and design review tooling.

## What's inside

```
.claude-plugin/marketplace.json          marketplace listing every plugin in this repo
plugins/
  dashboard-ui/
    .claude-plugin/plugin.json
    skills/dashboard-ui-design/
      SKILL.md                           workflow, 29 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 85 patterns, each with its one-line rule
      references/patterns/*.md           one file per pattern (see below)
      assets/tokens.css                  starter light and dark tokens, every value traced to a pattern
  marketing-ui/
    .claude-plugin/plugin.json
    skills/marketing-ui/
      SKILL.md                           workflow, 16 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 19 patterns, each with its one-line rule
      references/patterns/*.md           one file per pattern (see below)
      assets/marketing.css               marketing layer (fluid type, sections, CTA, inverse band) on the dashboard-ui roles
  mobile-ui/
    .claude-plugin/plugin.json
    skills/mobile-ui/
      SKILL.md                           workflow, 20 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 19 patterns, each with its one-line rule
      references/patterns/*.md           one file per pattern
      assets/mobile.css                  touch, safe-area, bar, sheet and rem type tokens on the dashboard-ui roles
  motion-ui/
    .claude-plugin/plugin.json
    skills/motion-ui/
      SKILL.md                           workflow, 18 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 19 patterns, each with its one-line rule
      references/patterns/*.md           one file per pattern
      assets/motion-tokens.css           durations, curves, spring linear() tokens, reduced-motion overrides
  forms-ui/
    .claude-plugin/plugin.json
    skills/forms-ui/
      SKILL.md                           workflow, 20 non-negotiables, decision tables
      references/INDEX.md                all 19 patterns, each with its one-line rule
      references/patterns/*.md           ffound-, finput-, fvalid-, fflow-, fref- (see below)
      assets/forms.css                   starter form styles on the dashboard-ui role tokens
  design-system/
    .claude-plugin/plugin.json
    skills/design-system/
      SKILL.md                           6-step workflow (detect, profile, generate, map, DESIGN.md, keep consistent), 10 non-negotiables
      references/INDEX.md                all 11 patterns, each with its one-line rule
      references/patterns/*.md           dsfound-, dstoken-, dsmap-, dsref- (see below)
      scripts/theme.mjs                  verified OKLCH theme generator: CSS, Tailwind v4, shadcn, DTCG, DESIGN.md front matter
      scripts/theme.test.mjs             node --test suite (APCA reference values, gamut, outputs, CLI)
      assets/DESIGN.template.md          the decision record written into your project
  ai-ui/
    .claude-plugin/plugin.json
    skills/ai-ui/
      SKILL.md                           workflow, 22 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 20 patterns, each with its one-line rule
      references/patterns/*.md           aifound-, aichat-, aiinline-, aiagent-, airef- (see below)
      assets/ai-ui.css                   thread, composer, streaming, citation, diff and approval tokens on the dashboard-ui roles
  i18n-rtl/
    .claude-plugin/plugin.json
    skills/i18n-rtl/
      SKILL.md                           8-step workflow, 20 non-negotiables, decision tables, token defaults
      references/INDEX.md                all 19 patterns, each with its one-line rule
      references/patterns/*.md           rtl-, i18n-, iref- (see below)
      assets/rtl.css                     direction variables, Hebrew/Arabic type resets, bidi islands, logical utilities on the dashboard-ui roles
templates/PATTERN_TEMPLATE.md            the format every pattern file follows
docs/research-brief.md                   how the research was run
```

### dashboard-ui: 85 patterns in 9 clusters

| Prefix | Cluster | Files |
|---|---|---|
| `found-` | Foundations: hierarchy, dashboard types, overview → details, grid and spacing, density, data-ink, typography for data, scanning, responsive reflow, progressive disclosure | 10 |
| `color-` | Colour: system architecture (OKLCH ramps → roles), semantic and money colours, data-viz palettes, dark mode, contrast, minimal colour | 6 |
| `style-` | Soft and rounded style: radius scale and nested corners, shadows vs borders, surfaces and layering, glass | 4 |
| `data-` | Data display: KPI cards, number and money formatting, deltas, table layout and interaction, list rows, cards vs tables vs lists, loading/empty/error states, freshness, units and sources | 10 |
| `chart-` | Charts: choose by question, time series, bars, pies and gauges (mostly not), sparklines, uncertainty, financial charts, tooltips and labels, accessibility, honesty, a bad-chart gallery | 11 |
| `comp-` | Components: buttons, tabs/segmented/pills, overlays (dialog, popover, drawer, toast, tooltip), filters, date ranges, ⌘K, inline edit, sliders, app shell, alerts, keyboard and focus, entity cross-links and hover previews | 14 |
| `motion-` | Motion and interaction: principles and tokens, number tweening, chart transitions, View Transitions, micro-interactions, reduced motion, linked exploration, live what-if recompute | 8 |
| `prog-` | Progressive UI: loading states, stale-while-revalidate, optimistic UI and undo, perceived-performance thresholds | 4 |
| `ref-` | References: fintech, dev/ops, product-analytics and investing teardowns, an anti-pattern catalog, research findings, a 39-check review rubric | 7 |

### marketing-ui: 19 patterns in 5 clusters

| Prefix | Cluster | Files |
|---|---|---|
| `mkfound-` | Foundations: page narrative and section order by goal, CTAs and graded conversion evidence, the accessibility floor | 3 |
| `mksect-` | Sections: hero, social proof, features and bento grids, pricing tables, FAQ and objections, footer | 6 |
| `mkstyle-` | Style: display type and pairing, colour and art direction, dark sections, scroll motion, a catalogue of generated-default tells | 5 |
| `mkperf-` | Performance and SEO: LCP and hero media, web fonts, headings and metadata (OG images) | 3 |
| `mkref-` | References: an anti-pattern gallery with named good and bad sites, a 35-check review rubric | 2 |

### mobile-ui: 19 patterns in 5 clusters

Mobile web, responsive apps and PWAs, with Apple HIG and Material 3 conventions. Grid reflow and container queries stay in dashboard-ui's `found-responsive-reflow.md`, which mobile-ui links to.

| Prefix | Cluster | Files |
|---|---|---|
| `mofound-` | Foundations: thumb zones and reach, touch targets (44 pt, 48 dp, 24 px), safe areas, viewport units and the keyboard, Dynamic Type and text scale, dark mode and system colours, orientation and foldables, lists and cards, tables | 9 |
| `monav-` | Navigation: bottom bar vs tabs vs drawer, sheets and detents, gestures (swipe actions, pull to refresh, edge back) | 3 |
| `moinput-` | Input: keyboards, `inputmode` and autofill, haptics and the Vibration API's limits | 2 |
| `moplat-` | Platform: PWA install, offline and app shell, low-end performance budgets, native feel across HIG and Material 3 | 3 |
| `moref-` | Review: a 30-check rubric with a 390×844 / 360×800 capture recipe, an anti-pattern catalog | 2 |

### motion-ui: 19 patterns in 6 clusters

General product-UI motion and gesture. Motion for data views (number tweening, chart transitions, live recompute) stays in dashboard-ui's `motion-*` and `prog-*` patterns, which motion-ui links to.

| Prefix | Cluster | Files |
|---|---|---|
| `mfound-` | Foundations: purpose and frequency budget, durations and easing, choreography and stagger, reduced motion and vestibular safety | 4 |
| `mspring-` | Springs: duration and bounce mapped across CSS `linear()`, Motion, React Spring, SwiftUI and Material 3; generated CSS spring tokens | 2 |
| `mgesture-` | Gestures: 1:1 drag, momentum projection and snapping, rubber-banding, sheets and swipe-to-dismiss, interruptibility and velocity | 5 |
| `mtrans-` | Transitions: enter/exit with `@starting-style` and the top layer, spatial origin, View Transitions (same- and cross-document), buttons, toggles and toasts, scroll-driven animation | 5 |
| `mperf-` | Performance: compositor-only properties, `will-change`, FLIP, INP | 1 |
| `mref-` | Review: an 18-check motion rubric with a frame-capture recipe, an anti-pattern gallery | 2 |

### forms-ui: 19 patterns in 5 clusters

| Prefix | Cluster | Files |
|---|---|---|
| `ffound-` | Foundations: single-column layout and fieldsets, labels/hints/placeholders, required vs optional, the WCAG 2.2 form baseline, microcopy | 5 |
| `finput-` | Inputs: types, `autocomplete`, `inputmode` and `enterkeyhint`; checkboxes, radios and switches; selects and comboboxes; money, number and phone; dates; file upload | 6 |
| `fvalid-` | Validation: timing and inline errors (`:user-invalid`), error summary and focus, error message wording | 3 |
| `fflow-` | Flows: submit states and double submit, multi-step forms and saving progress, sign-in, sign-up and passkeys | 3 |
| `fref-` | References: a 16-item anti-pattern catalogue with a DOM audit, a 31-check review rubric | 2 |

### design-system: 11 patterns in 4 clusters, plus a theme generator

| Prefix | Cluster | Files |
|---|---|---|
| `dsfound-` | Foundations: token tiers (primitive → semantic → component), naming and semver; evidence-based domain profiles (finance, analytics, dev tools, consumer, marketing, health) | 2 |
| `dstoken-` | Tokens: DTCG 2025.10 format, theming and multi-brand, dark-mode generation (WCAG 2 + APCA), type scale, spacing and radius | 5 |
| `dsmap-` | Stack mapping: Tailwind v4 `@theme`, shadcn/ui variables, CSS Modules, vanilla CSS, MUI `createTheme` | 1 |
| `dsref-` | Reference: the DESIGN.md decision record, governance and drift detection, a 12-item anti-pattern list | 3 |

`scripts/theme.mjs` turns base hue, accent, contrast and density into light, dark and high-contrast OKLCH roles under the dashboard-ui role names. It checks every pair against WCAG 2 and APCA on the sRGB-gamut values it ships, adjusts lightness automatically, and exits 1 naming the pairs when it can't comply.

### ai-ui: 20 patterns in 5 clusters

UI for AI features: chat, assistants, generation, inline AI and agents. Sources include Microsoft HAX, Google PAIR, Apple HIG, NN/g, WAI-ARIA and modern-web-guidance; product names appear only as good or bad references.

| Prefix | Cluster | Files |
|---|---|---|
| `aifound-` | Foundations: AI identity and expectations, uncertainty and disclaimers without crying wolf, latency budgets, privacy and consent, accessibility of generated content | 5 |
| `aichat-` | Chat: layout and message anatomy, streaming and stop, thinking and agent-step progress, markdown/code/tables, citations, edit/regenerate/branching, IME-safe prompt input, empty states and suggestions, errors/refusals/rate limits, feedback | 10 |
| `aiinline-` | Inline AI: ghost text, accept/reject and diffs in documents, forms and dashboards | 1 |
| `aiagent-` | Agents: approval tiers, human in the loop, undo and audit log; WebMCP and agent-readable UI | 2 |
| `airef-` | References: 12 anti-patterns tied to documented incidents, a 39-check review rubric | 2 |

### i18n-rtl: 19 patterns in 3 clusters

Internationalisation and right-to-left UI, with Hebrew and Arabic as first-class cases. Numbers were verified against Node 26 (ICU 78.3, CLDR 48), bidi renderings in headless Chromium, and twelve real Hebrew and Arabic sites were inspected for good and bad references. General number formatting stays in dashboard-ui's `data-number-formatting.md`, which i18n-rtl links to.

| Prefix | Cluster | Files |
|---|---|---|
| `rtl-` | Right-to-left: logical properties, what mirrors and what must not (media, clocks, charts, logos, phone numbers), `dir` and `dir="auto"`, bidi isolation and mixed Hebrew/English/number strings, digits, minus sign and `₪` position, directional icons, Hebrew and Arabic typography, RTL forms, tables and charts, `:dir()` and Tailwind `rtl:` | 10 |
| `i18n-` | Internationalisation: dates, Hebrew and Hijri calendars and week start, string externalisation, ICU plurals (Hebrew dual forms) and gender, text expansion, locale negotiation and language switchers without flags, pseudo-localisation with a Playwright RTL recipe | 6 |
| `iref-` | References: a 35-check review rubric, a 14-item anti-pattern catalogue, a Hebrew-site teardown with Israeli accessibility (IS 5568) | 3 |

Each pattern file has these sections: the rule, when to use and when not, rules with numbers, anti-patterns, good references, bad references, accessibility, motion, a tokens table, an implementation sketch, a checklist and sources.

## Research

The patterns come from 7 parallel research passes. Together they read about 300 web sources and about 100 guides from [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance).
- **Design systems:** Carbon, Primer, Atlassian, Polaris, Fluent, Cloudscape, GOV.UK and Material.
- **Research and data-viz writing:** Nielsen Norman Group, Baymard, Stephen Few, Tufte, the FT Visual Vocabulary, Datawrapper, web.dev and MDN.
- **Shipped products:** Stripe, Linear, Vercel, Grafana, Datadog, PostHog, Koyfin and others.

Some claims rest on search summaries because the source page wouldn't load, and the affected files say so. Contrast ratios and OKLCH values were computed, not copied.

## Install (Claude Code)

```
/plugin marketplace add YehudaBriskman/fUdesIgn
/plugin install dashboard-ui@fudesign
/plugin install marketing-ui@fudesign
/plugin install mobile-ui@fudesign
/plugin install motion-ui@fudesign
/plugin install forms-ui@fudesign
/plugin install design-system@fudesign
/plugin install ai-ui@fudesign
/plugin install i18n-rtl@fudesign
```

Each skill then triggers on its own design, build and review tasks (dashboards, landing and marketing pages, mobile web and PWAs, product-UI motion and gestures, forms, setting up and keeping a design system, AI features such as chat, copilots and agents, or internationalised and right-to-left UI in Hebrew and Arabic). You can also copy a skill folder, such as `plugins/marketing-ui/skills/marketing-ui/`, into `~/.claude/skills/`.

## Adding a pattern or plugin

- **New pattern:** copy `templates/PATTERN_TEMPLATE.md` into the right cluster folder, keep every section, cite sources, then regenerate `references/INDEX.md`.
- **New plugin:** add `plugins/<name>/.claude-plugin/plugin.json` and `plugins/<name>/skills/<skill>/SKILL.md`, then list it in `.claude-plugin/marketplace.json`.

## Licence

Free to use, not to copy. fUdesIgn is source-available under the [PolyForm Internal Use License 1.0.0](LICENSE.md), with the clarifications in [NOTICE.md](NOTICE.md):
- **Allowed:** using and modifying the skills for personal and company work, including commercial work, and shipping whatever you build with them.
- **Not allowed:** redistributing or republishing the skills, plugins or patterns themselves.
