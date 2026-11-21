# Visual hierarchy: one place to look first

> Every dashboard view has exactly one primary focal point. It answers the user's first question, and size, contrast, position and space are spent on it before anything else.

**Category:** Foundations · **Applies to:** dashboard home pages, overview screens, KPI strips, report pages, detail headers · **Priority:** must

## When to use / when not
- **Use** on every screen that shows more than one number or chart. Hierarchy is not optional. If you don't design it, the loudest thing on the page sets it: the logo, a saturated chart, a red badge.
- **Use** the squint test whenever a new widget, color or alert state is added. Hierarchy decays one widget at a time.
- **Not** a reason to make everything big. A dense, analytical table view still has hierarchy (header, then sticky key column, then values). It is just flatter, with fewer steps between levels.
- **Not** decided by visual taste. The order comes from the content: list the 1–3 questions the user opens the page to answer, then rank the widgets by how directly they answer them (NN/g: define the content hierarchy and key takeaways first, then apply color, scale and grouping).

## Rules (do)
- **Write the priority list before layout.** Rank every element P1 (answers the main question), P2 (explains P1: trend, breakdown, comparison) and P3 (detail, reference, navigation). Allow 1 P1 element, or 1 P1 group of up to 4 KPIs. If you have more than 4 "most important" numbers, you have none.
- **Spend the four levers in this order:** position (top-leading corner first), size, contrast or weight, then whitespace. Color comes last and only for state (see `color-semantic-status.md`).
- **Use at most 3 sizes in a region** (small, medium, large), with at most 2 large elements per view. NN/g gives 14–16px body, 18–22px subheads and up to 32px headers. For a dashboard: a 2rem (32px) hero value (`--type-hero`), a 1.875rem (30px) secondary KPI value in cards (`--type-kpi`), a 14px body and table (`--type-body`), and 12px labels and meta (`--type-meta`).
- **Use at most 3 contrast steps** for text: primary (≥ 7:1 on the surface; `--text` is 17.3:1), secondary (≥ 4.5:1; `--text-muted` is 6.0:1) and disabled or decorative. "If everything is contrasted, then nothing stands out" (NN/g).
- **Put chrome below data in the hierarchy.** The logo, nav and filter bar must sit at lower contrast than P1 data. Few's Pitfall #9 shows a vendor logo and nav occupying the top-left, "a waste of prime real estate".
- **Give the P1 element the most surrounding space.** Use 32px (`--space-6`), 2× the standard 16px gap, around the hero group.
- **Give every KPI context: comparison, target or trend.** A bare number is not a focal point, it's a riddle (Few Pitfall #2: "quarter-to-date sales total $736,502 without any context means little. Compared to what?").
- **Use weight, not boxes, to separate levels.** Prefer a 600 weight or a size step to an extra border or card. NN/g: add borders or backgrounds only when spacing fails, and sparingly, because they add clutter.
- **Reserve bright, saturated color** for the 0–2 items that need attention now. Everything else stays neutral, so an alert is visible pre-attentively.

## Anti-patterns (don't)
- **Uniform prominence.** Six equally bold, equally colorful charts leave "a wash of sameness and no clue where to focus" (Few Pitfall #10).
- **Decorative focal points.** Gauges, 3D bars, hero illustrations or a saturated brand header attract the eye first and hold no data.
- **Color as the only hierarchy.** Red-on-everything, or a different color per bar "for interest". Few Pitfall #12, Fig. 15: "the colors mean nothing", yet time is wasted as our brains search for the meaning.
- **ALL CAPS for emphasis.** On NN/g's Williams-Sonoma example, "because most text is in all caps, very little of it stands out". Datawrapper: limit uppercase "to just a few words".
- **Hierarchy by card size alone,** where the biggest card holds the least important chart because it "fit the grid".
- **Logo or welcome banner in the top-left.** It wastes the highest-attention position.

## Good references
- [NN/g: Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/): concrete caps of 3 sizes, 2 large elements and 3 contrast variations, plus the blur test. With 5–10px blur the intended hierarchy survived in their Spotify example, while 20px blur exposed an unintended focal point.
- [IBM Carbon: Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/): "The most important data should have the highest contrast and occupy the largest area", placed at the top.
- [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui): cut accent (blue) usage to make the chrome neutral, darkened text in light mode for contrast, and aligned sidebar labels, icons and buttons. The data becomes the hierarchy, not the chrome.
- [Datadog integration dashboard guide](https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard): Overview group at the top with "the most important statistics first". Use the vivid header color for the more important group and the light color for the less important one, and avoid overusing color.

## Bad references
- [Stephen Few, Common Pitfalls in Dashboard Design (2005), Fig. 13](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): the logo and strongly bordered nav buttons are more prominent than the data, and the charts are "equally bold and colorful, leaving us with a wash of sameness and no clue where to focus".
- [Same paper, Fig. 12](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): the top-left holds the logo and nav. The first data point is a meter for average order size, and its related trend chart is not adjacent, so the relationship is lost.
- [Same paper, Fig. 14](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf): LED-style meters and a time-period selector that looks like a manual switch. Skeuomorphic decoration is the focal point, and it carries no data.

## Accessibility
- The hierarchy must also exist in the DOM: one `<h1>` per view and `<h2>` per region in visual order. Screen-reader users navigate by headings, the layer-cake pattern in audio form.
- Don't use `order` or `grid` placement to move the P1 widget visually without moving it in the source. Focus order would contradict the visual order (modern-web-guidance `css/css-layout.md`).
- Contrast: P1 and P2 text ≥ 4.5:1, large hero numerals (≥ 24px, or ≥ 18.66px bold) ≥ 3:1 minimum. Aim for ≥ 7:1 on the hero value anyway.
- Never encode priority or status by color alone. Pair it with an icon, a label or position. NN/g puts color blindness at around 8% of men and 0.5% of women; Few uses 10% of males.

## Motion / interaction (if relevant)
- Don't animate P2 or P3 widgets on load to "draw attention". Movement is the strongest pre-attentive cue and will override your static hierarchy.
- A live-updating P1 value may get a brief highlight on change: a 600–1000ms background fade, disabled under `prefers-reduced-motion`. It must not pulse continuously.

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--type-hero` | 2rem (32px) / 1.1, weight 600, tabular | One per view (or per KPI group) |
| `--type-kpi` | 1.875rem (30px) / 1.2, weight 600 | Secondary KPIs in cards |
| `--type-title` | 1.25rem (20px) / 1.3, weight 600 | Page or region title |
| `--type-heading` | 1rem (16px) / 1.4, weight 600 | Widget titles |
| `--type-body` | 0.875rem (14px) / 1.45 | Tables, body |
| `--type-meta` | 0.75rem (12px) / 1.35 | Labels, axis ticks; never below 12px |
| `--text` | ≥ 7:1 on surface (17.3:1 light) | Values, titles |
| `--text-muted` | ≥ 4.5:1 (6.0:1 light) | Labels, deltas' context |
| `--border` / `--border-strong` | ~1.4:1 decorative / ≥ 3:1 | Gridlines and separators / axes and controls |
| `--accent` | 1 hue | Selection, focus, links; not decoration |
| `--space-6` | 32px around the hero group | 2× standard 16px gap |

## Implementation sketch
```html
<main class="dash">
  <h1 class="visually-hidden">Revenue overview</h1>
  <section class="hero" aria-labelledby="mrr-label">
    <p id="mrr-label" class="kpi-label">Monthly recurring revenue</p>
    <p class="kpi-hero"><data value="1284000">$1.28M</data></p>
    <p class="kpi-context">+4.1% vs last month · target $1.30M</p>
  </section>
  <section class="secondary" aria-label="Supporting metrics">…</section>
  <section class="detail" aria-labelledby="tx-h"><h2 id="tx-h">Recent transactions</h2>…</section>
</main>
```
```css
.kpi-hero  { font: var(--type-hero); /* tokens.css --type-* are font shorthands */
             font-variant-numeric: tabular-nums lining-nums; color: var(--text);
             text-box: trim-both cap alphabetic; } /* progressive enhancement */
.kpi-label, .kpi-context { font: var(--type-meta); color: var(--text-muted); }
.hero      { padding-block: var(--space-6); }
.app-chrome{ color: var(--text-muted); } /* chrome quieter than data */
```

## Checklist
- [ ] A written P1/P2/P3 list exists and P1 has at most 4 items.
- [ ] A 5–10px blur screenshot shows the P1 element as the first thing you see.
- [ ] No more than 3 font sizes and 3 text-contrast steps in any region.
- [ ] The top-left (top-right in RTL) cell holds data, not a logo or banner.
- [ ] Every KPI has a comparison (target, previous period or trend).
- [ ] Saturated color appears only on items needing action, and each is paired with an icon or text.
- [ ] Heading order in the DOM matches visual priority.

## Sources
- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf (Pitfalls #2, #9, #10, #11, #12)
- https://carbondesignsystem.com/data-visualization/dashboards/
- https://carbondesignsystem.com/elements/spacing/overview/
- https://fluent2.microsoft.design/layout
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://docs.datadoghq.com/developers/integrations/create-an-integration-dashboard
- https://www.datawrapper.de/blog/fonts-for-data-visualization
- modern-web-guidance/skills/modern-web-guidance/guides/visual-design/precise-text-alignment.md
- modern-web-guidance/skills/modern-web-guidance/guides/css/css-layout.md
