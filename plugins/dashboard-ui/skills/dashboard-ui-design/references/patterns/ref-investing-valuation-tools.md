# Investing and valuation tools: Koyfin, Simply Wall St, TradingView, Morningstar, Finviz, Bloomberg

> Investing UIs succeed when they compress a judgement into a glyph the eye can compare across many securities (a snowflake, a style box, a heatmap tile) while keeping the method open and the raw numbers one hover away.

**Category:** Reference gallery · **Applies to:** valuation and fair-value pages, screeners, watchlists, market maps, company report cards, research terminals · **Priority:** should

## When to use / when not
- Use this when you design a per-security summary (score, fair value, style), a screener or watchlist, or a market overview.
- Use the Bloomberg critique to decide how dense a professional tool may be.
- Don't use composite score glyphs (snowflake-style radar) as the only representation. Use them as a thumbnail and an index, never as the evidence.

## Rules (do)
**Simply Wall St: an explainable composite glyph**
- Build the composite from **binary checks**: 5 areas (Value, Future, Past, Health, Dividends) × **6 checks** = 30 checks. The score per axis is 0–6. The open-sourced model documents every check.
- Encode the total as **size** (more passes means a bigger shape) and as a **red to green hue**. The glyph is meant for an "eyeball scan" across stocks, filter results, side-by-side compare and portfolio views.
- State the limits on the page. Simply Wall St says a low axis "should not necessarily exclude a stock", and that the snowflake is not a recommendation.
- Copy this for a valuation product: publish the methodology, make each axis clickable to its checks, and show pass or fail per check with the input numbers.

**Morningstar: a 3×3 classification grid**
- A **3×3 style box**: rows are Large, Mid, Small cap, and columns are Value, Blend, Growth. One shaded cell is instantly comparable across hundreds of funds and survives tiny sizes (16–24px).
- Show the methodology cadence. Stock assignments update monthly, and fund assignments when new holdings arrive.
- Copy this for categorical position on two ordinal axes. It beats a scatter plot when only the bucket matters.

**TradingView heatmaps: user-chosen encodings plus a legend**
- Let the user pick the **size basis** (market cap, volume, turnover, or **Mono size** so all tiles are equal) and the **colour basis** (change, performance, volatility, gap, relative volume).
- Always show a **legend with exact % boundaries** under the map.
- Offer **Classic, Colour-blind-friendly and Monochrome** schemes.
- Drill down by clicking a group name to zoom into it, keeping the size and colour settings. Clicking a tile opens the symbol page.
- Show key metrics on hover for small tiles, and let the user toggle tile labels (ticker, description, none).

**Finviz: maps plus breadth**
- The classic map groups by sector and industry, sizes tiles by market cap and colours them by performance.
- Finviz built **Matrix** because cap-weighted maps can hide breadth: "a few giant companies are creating the appearance of strength." Matrix uses a grid of industry × market-cap tier with equal-size tiles, or clusters, so breadth is visible.
- Hover shows "Why is it moving", news and the company description. Context sits next to the number.
- Offer a **colour-blind mode** palette.

**Koyfin: user-composed research dashboards**
- Let users build "My Dashboards" from resizable widgets (watchlists, charts, news, tables) or start from templates.
- Let users choose columns in data tables (fundamental, technical, market), so the table serves the user's own screen.
- Reviewers praise it as an affordable Bloomberg alternative, and the main critique is that it "can feel a little crowded". Ship sane templates and density presets, not just a blank canvas.

**Bloomberg Terminal: what density buys and costs**
- Density works for daily experts: many simultaneous panels, mnemonic commands, and colour-coded function keys so users "didn't have to remember". It keeps one stable layout for years.
- Bloomberg ships alternate **colour-vision-deficiency schemes** (deuteranopia, protanomaly) through `PDFU COLORS <GO>`. A professional dense tool still needs CVD palettes.
- Change management is part of the design. Bloomberg notes that even a font change or a moved button disrupts users. Evolve in place rather than redesign.

## Anti-patterns (don't)
- **Density as status symbol.** UX Magazine's critique of Bloomberg: amber text on black, an 86-page manual, "a week and a few painful hours" to become functional, and users who "favor complexity and clutter over efficiency" as a status signal. Don't copy that learning curve into a product for occasional users.
- **Cap-weighted maps as a breadth signal.** A green treemap can mean "5 mega-caps went up". Show equal-weight or breadth alongside.
- **Composite score without method.** A 0–100 "health" number with no inspectable inputs teaches users to trust a black box.
- **Daily colour on long-horizon tools.** A day's red and green on a long-term valuation page invites short-term reactions. Third-party guides note that one day's colour is often insignificant for multi-week horizons. Default long-horizon views to longer periods.
- **Radar charts for precise comparison.** Snowflake-style radars are fine as thumbnails but bad for reading values, because area grows with the square of the score. Show the numbers next to them.
- **Red and green as the only signal** (see ref-dashboard-anti-patterns.md, "Rainbow palettes").

## Good references
- [Simply Wall St: Company Analysis Model (GitHub)](https://github.com/SimplyWallSt/Company-Analysis-Model). Documents 30 binary checks, the 0–6 axis score, size and colour mapping, and stated limits.
- [Simply Wall St Help: How does the Snowflake work](https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work). The official explainer.
- [Morningstar: Style Box](https://www.morningstar.com/investing-terms/morningstar-style-box). A 3×3 grid readable at icon size.
- [TradingView: Heatmaps](https://www.tradingview.com/support/solutions/43000766446). Offers selectable size and colour bases, Mono size, a legend with boundaries, CVD and monochrome schemes, and drill-down.
- [Finviz: Introducing Finviz Matrix](https://finviz.com/blog/the-finviz-matrix-market-breadth-visualized/). Designed explicitly against cap-weighted illusion, with a colour-blind mode and "why is it moving" context.
- [Koyfin: My Dashboards help](https://koyfin.com/help/mydashboards-myd). Covers templates and resizable widgets.
- [Bloomberg: Designing the Terminal for colour accessibility](https://www.techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/). Describes CVD schemes in a dense pro tool.

## Bad references
- [UX Magazine: The impossible Bloomberg makeover](https://uxmag.com/articles/the-impossible-bloomberg-makeover). Covers the learnability and amber-on-black critique, and why redesigns stall (opinion piece, 2010).
- [Core77: Multi-monitor mayhem, and why some prefer interface design that sucks](https://core77.com/posts/24893/moneymaking-multi-monitor-mayhem-and-why-some-prefer-interface-design-that-sucks-24893). Density tolerated for status, not usability.
- [Daytradereview: Koyfin review](https://daytradereview.com/koyfin-review). The "a little crowded" critique of user-composed boards.

## Accessibility
- Heatmaps: the legend must be text, tiles must have accessible names ("AAPL, −1.2%, market cap $3.4T"), and a table view must exist.
- Score glyphs: always pair them with the numeric score ("Health 4/6"). A radar alone is invisible to screen readers.
- Provide colour-blind and monochrome schemes. TradingView, Finviz and Bloomberg all do.

## Motion / interaction
- Hover or focus on a tile shows a tooltip after 300–500 ms, with no delay for adjacent tiles (Vercel tooltip-group rule).
- Drill-down zoom: animate the group expanding over 200–300 ms, keep breadcrumbs, and make Back return to the parent.
- Live price ticks: flash the cell background for ≤ 300 ms, never shake or move it. Respect `prefers-reduced-motion`.

## Tokens and values
| Token | Default | Source |
|---|---|---|
| Composite axes | 5 | Simply Wall St |
| Checks per axis | 6 (binary) | Simply Wall St |
| Classification grid | 3 × 3 | Morningstar |
| Heatmap colour scale | diverging, symmetric around 0, 5–7 steps, ±3% clamp for 1D | TradingView-style legend |
| Heatmap size options | cap / volume / mono | TradingView |
| Colour schemes | default, CVD-safe, monochrome | TradingView, Finviz, Bloomberg |
| Tooltip delay | 300–500 ms first, 0 ms subsequent | Vercel guidelines |

## Implementation sketch
```html
<figure class="stylebox" aria-label="Morningstar-style box: Large Growth">
  <div role="img" aria-hidden="true" class="grid">
    <span></span><span></span><span class="on"></span>
    <span></span><span></span><span></span>
    <span></span><span></span><span></span>
  </div>
  <figcaption>Large · Growth</figcaption>
</figure>

<table class="checks">
  <caption>Valuation checks (4 of 6 passed)</caption>
  <tr><th scope="row">Price below fair value</th><td>Pass</td><td>$182 vs $214 (−15%)</td></tr>
  <tr><th scope="row">P/E below industry</th><td>Fail</td><td>31.2× vs 24.8×</td></tr>
</table>
```
```css
.stylebox .grid { display: grid; grid-template-columns: repeat(3, 8px); gap: 1px; }
.stylebox .grid span { aspect-ratio: 1; background: var(--surface-2); }
.stylebox .grid .on { background: var(--accent); }
.checks td:nth-child(3) { font-variant-numeric: tabular-nums; text-align: end; }
```

## Checklist
- [ ] Every composite score links to its inputs and pass or fail checks.
- [ ] Heatmaps show a legend with numeric boundaries and offer CVD and monochrome schemes.
- [ ] Cap-weighted views are paired with an equal-weight or breadth view.
- [ ] Long-horizon pages default to a long period, not 1D.
- [ ] Glyphs (radar, style box) always appear with numbers or text.
- [ ] Density presets or templates exist for user-composed dashboards.
- [ ] Redesigns are staged, with old layouts preserved or migrated (Bloomberg change-management lesson).

## Sources
- https://github.com/SimplyWallSt/Company-Analysis-Model (MODEL.markdown)
- https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work
- https://www.morningstar.com/investing-terms/morningstar-style-box
- https://en.wikipedia.org/wiki/Morningstar_Style_Box
- https://www.tradingview.com/support/solutions/43000766446
- https://finviz.com/blog/the-finviz-matrix-market-breadth-visualized/
- https://koyfin.com/help/mydashboards-myd
- https://www.koyfin.com/features/custom-dashboards
- https://daytradereview.com/koyfin-review
- https://www.techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/
- https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/
- https://uxmag.com/articles/the-impossible-bloomberg-makeover
- https://core77.com/posts/24893/moneymaking-multi-monitor-mayhem-and-why-some-prefer-interface-design-that-sucks-24893
- https://en.wikipedia.org/wiki/Bloomberg_Terminal
- https://vercel.com/design/guidelines
