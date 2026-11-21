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
      references/INDEX.md                all 84 patterns, each with its one-line rule
      references/patterns/*.md           one file per pattern (see below)
      assets/tokens.css                  starter light and dark tokens, every value traced to a pattern
templates/PATTERN_TEMPLATE.md            the format every pattern file follows
docs/research-brief.md                   how the research was run
```

### dashboard-ui: 84 patterns in 9 clusters

| Prefix | Cluster | Files |
|---|---|---|
| `found-` | Foundations: hierarchy, dashboard types, overview → details, grid and spacing, density, data-ink, typography for data, scanning, responsive reflow, progressive disclosure | 10 |
| `color-` | Colour: system architecture (OKLCH ramps → roles), semantic and money colours, data-viz palettes, dark mode, contrast, minimal colour | 6 |
| `style-` | Soft and rounded style: radius scale and nested corners, shadows vs borders, surfaces and layering, glass | 4 |
| `data-` | Data display: KPI cards, number and money formatting, deltas, table layout and interaction, list rows, cards vs tables vs lists, loading/empty/error states, freshness, units and sources | 10 |
| `chart-` | Charts: choose by question, time series, bars, pies and gauges (mostly not), sparklines, uncertainty, financial charts, tooltips and labels, accessibility, honesty, a bad-chart gallery | 11 |
| `comp-` | Components: buttons, tabs/segmented/pills, overlays (dialog, popover, drawer, toast, tooltip), filters, date ranges, ⌘K, inline edit, sliders, app shell, alerts, keyboard and focus | 11 |
| `motion-` | Motion and interaction: principles and tokens, number tweening, chart transitions, View Transitions, micro-interactions, reduced motion, linked exploration, live what-if recompute | 8 |
| `prog-` | Progressive UI: loading states, stale-while-revalidate, optimistic UI and undo, perceived-performance thresholds | 4 |
| `ref-` | References: fintech, dev/ops, product-analytics and investing teardowns, an anti-pattern catalog, research findings, a 39-check review rubric | 7 |

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
```

The skill then triggers on dashboard design, build and review tasks. You can also copy `plugins/dashboard-ui/skills/dashboard-ui-design/` into `~/.claude/skills/`.

## Adding a pattern or plugin

- **New pattern:** copy `templates/PATTERN_TEMPLATE.md` into the right cluster folder, keep every section, cite sources, then regenerate `references/INDEX.md`.
- **New plugin:** add `plugins/<name>/.claude-plugin/plugin.json` and `plugins/<name>/skills/<skill>/SKILL.md`, then list it in `.claude-plugin/marketplace.json`.

## Licence

Free to use, not to copy. fUdesIgn is source-available under the [PolyForm Internal Use License 1.0.0](LICENSE.md), with the clarifications in [NOTICE.md](NOTICE.md):
- **Allowed:** using and modifying the skills for personal and company work, including commercial work, and shipping whatever you build with them.
- **Not allowed:** redistributing or republishing the skills, plugins or patterns themselves.
