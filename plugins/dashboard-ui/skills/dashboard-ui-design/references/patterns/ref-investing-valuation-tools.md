# Investing and valuation tools: Koyfin, Simply Wall St, TradingView, Morningstar, Finviz, Bloomberg

> Investing UIs succeed when they compress a judgement into a glyph the eye can compare across many securities (a snowflake, a style box, a heatmap tile) while keeping the method open and the raw numbers one hover away.

**Category:** Reference gallery · **Applies to:** valuation and fair-value pages, screeners, watchlists, market maps, company report cards, research terminals · **Priority:** should

## When to use / when not
- Use this when you design a per-security summary (score, fair value, style), a screener or watchlist, or a market overview.
- Use the Bloomberg critique to decide how dense a professional tool may be.
- Don't use composite score glyphs (snowflake-style radar) as the only representation. Use them as a thumbnail and an index, never as the evidence.

## Rules (do)
**Simply Wall St: an explainable composite glyph**
- Build the composite from **binary checks**: 5 areas (Value, Future performance, Past performance, Health, Dividends) × **6 checks** = "a total of 30 checks". Each pass scores 1, so each axis is 0–6. The open-sourced model documents every check.
- Encode the total as **size** ("The greater the total number of successful checks the larger the snowflake") and as a **red to green hue**. The glyph is meant for a "quick 'eyeball' scan" of a stock, a group of stocks or the market, and for side-by-side comparison.
- State the limits on the page. Simply Wall St says a low score in one area "should not necessarily exclude a stock from investment consideration", and that the app "is not intended to provide investment advice or recommendations".
- Copy this for a valuation product: publish the methodology, make each axis clickable to its checks, and show pass or fail per check with the input numbers.

**Morningstar: a 3×3 classification grid**
- A **3×3 style box**, "a nine-square grid": the vertical axis is market cap (small, mid, large) and the horizontal axis is value, blend, growth. One shaded cell is comparable across hundreds of funds and stays legible at icon size (16–24px is our sizing, not Morningstar's).
- Show the methodology cadence: say when the classification was last computed and from which holdings. (The commonly cited Morningstar cadence, monthly for stocks and on new holdings for funds, is not on the cited Morningstar page, so it is unverified.)
- Copy this for categorical position on two ordinal axes. It beats a scatter plot when only the bucket matters.

**TradingView heatmaps: user-chosen encodings plus a legend**
- Let the user pick the **size basis** (for stocks: market cap, volume, FD market cap, turnover, or **mono size** so all tiles are equal) and the **colour basis** (change, performance, volatility, gap; for stocks also pre/post-market change, volume change, relative volume).
- Always show a **legend with exact % boundaries** under the map (TradingView shows one at the bottom of the screen).
- Offer **Classic, Color Blind friendly and Monochrome** schemes.
- Drill down by clicking a group name to zoom into it, keeping the size and colour settings. Clicking a tile opens the symbol page.
- Show key metrics on hover for small tiles, and let the user toggle tile labels (title: none, ticker or description; value: price, volume, performance or none; logos on or off).

**Finviz: maps plus breadth**
- The classic map groups by sector and industry, sizes tiles by market cap and colours them by performance.
- Finviz's **Matrix** shows breadth that a cap-weighted map hides: its Clusters view shows whether the market moves together or whether "a few giant companies are creating the appearance of strength." The grid view lays out industries in rows and market-cap tiers in columns, with small colour-coded ticker tiles in each cell; the Clusters view sizes circles by market cap within sector × cap-tier groups.
- Hover shows what the company does, related news and why it is moving, and a separate "Why Is It Moving" option adds more. Context sits next to the number.
- Offer an optional **colour-blind mode** palette (Finviz has one).

**Koyfin: user-composed research dashboards**
- Let users build "My Dashboards" from widgets (table or watchlist, historical graph, performance graph, news) that are "resizable" and can be dragged around, or start from a template.
- Let users choose columns in data tables and save them as a template ("a saved selection of columns, groups, sort and summary rows"), so the table serves the user's own screen.
- One review's main critique is that "Koyfin can feel a little bit crowded" ("Interface can feel crowded at times"). Ship sane templates and density presets, not just a blank canvas.

**Bloomberg Terminal: what density buys and costs**
- Density works for daily experts: many simultaneous panels, mnemonic commands and colour-coded function keys, and one stable layout for years. (Bloomberg's own story on concealing complexity is the source for the function-key and stability points; it blocks automated fetching, so treat them as unverified.)
- Bloomberg ships alternate **colour-vision-deficiency schemes** for deuteranopia and protanomaly in `{PDFU COLORS}`, using blue for "up" and red for "down" while keeping the default amber for non-semantic information. A professional dense tool still needs CVD palettes.
- Change management is part of the design: in a tool used all day, even a font change or a moved button disrupts users (unverified, from the same Bloomberg story). Evolve in place rather than redesign.

## Anti-patterns (don't)
- **Density as status symbol.** UX Magazine's critique of Bloomberg (Leca, 2010): "yellow and orange text" on black, an "86-page manual", "a week and a few painful hours" to handle it, and users who "favor complexity and clutter over efficiency and clarity to sustain a fictive status symbol". Don't copy that learning curve into a product for occasional users.
- **Cap-weighted maps as a breadth signal.** A green treemap can mean "5 mega-caps went up". Show equal-weight or breadth alongside.
- **Composite score without method.** A 0–100 "health" number with no inspectable inputs teaches users to trust a black box.
- **Daily colour on long-horizon tools.** A day's red and green on a long-term valuation page invites short-term reactions. Default long-horizon views to a period that matches the decision (1Y or longer for a fair-value page).
- **Radar charts for precise comparison.** Snowflake-style radars are fine as thumbnails but bad for reading values: the filled area grows roughly with the square of the scores, so a stock scoring 6 on every axis looks 4× the size of one scoring 3. Show the numbers next to them.
- **Red and green as the only signal** (see ref-dashboard-anti-patterns.md, "Rainbow palettes").

## Good references
- [Simply Wall St: Company Analysis Model (GitHub)](https://github.com/SimplyWallSt/Company-Analysis-Model/blob/master/MODEL.markdown). Documents 30 binary checks, the 0–6 axis score, size and colour mapping, and stated limits.
- [Simply Wall St Help: How does the Snowflake work](https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work). The official explainer (blocks automated fetching; the GitHub model above is the verified source).
- [Morningstar: Style Box](https://www.morningstar.com/investing-terms/morningstar-style-box). A nine-square grid for stocks and funds, with a matching fixed-income box (credit quality × interest-rate sensitivity).
- [TradingView: Heatmaps](https://www.tradingview.com/support/solutions/43000766446). Offers selectable size and colour bases, Mono size, a legend with boundaries, CVD and monochrome schemes, and drill-down.
- [Finviz: Introducing Finviz Matrix](https://finviz.com/blog/the-finviz-matrix-market-breadth-visualized/). Grid and Clusters views of breadth, a colour-blind mode, and "why is it moving" context.
- [Koyfin: My Dashboards help](https://koyfin.com/help/mydashboards-myd). Covers templates and resizable, draggable widgets.
- [Bloomberg: Designing the Terminal for colour accessibility](https://www.techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/) ([archived copy](https://web.archive.org/web/20211203164720/https://www.techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/)). Describes CVD schemes in a dense pro tool.

## Bad references
- [UX Magazine: The impossible Bloomberg makeover](https://uxmag.com/articles/the-impossible-bloomberg-makeover). Covers the learnability and orange-on-black critique, and why redesigns stall (opinion piece, Leca, March 2010).
- [Core77: Multi-monitor mayhem, and why some prefer interface design that sucks](https://core77.com/posts/24893/moneymaking-multi-monitor-mayhem-and-why-some-prefer-interface-design-that-sucks-24893). Density tolerated for status, not usability.
- [Daytradereview: Koyfin review](https://daytradereview.com/koyfin-review/). The "a little bit crowded" critique of user-composed boards.

## Accessibility
- Heatmaps: the legend must be text, tiles must have accessible names ("AAPL, −1.2%, market cap $3.4T"), and a table view must exist.
- Score glyphs: always pair them with the numeric score ("Health 4/6"). A radar alone is invisible to screen readers.
- Provide colour-blind and monochrome schemes. TradingView, Finviz and Bloomberg all do.

## Motion / interaction
- Hover or focus on a tile shows a tooltip within 0–50 ms, because a heatmap is a chart people scrub (chart-tooltips-crosshair-labels.md); adjacent tiles then show theirs with no delay (Vercel: "subsequent peers have no delay").
- Drill-down zoom: animate the group expanding over `--motion-dur-medium` (240 ms) with `--motion-ease-standard`, keep breadcrumbs, and make Back return to the parent. Under reduced motion, cut or crossfade instead of zooming.
- Live price ticks: flash the cell background for `--motion-dur-medium` (240 ms) or less, never shake or move it. A colour flash is not movement, so it can stay under reduced motion; keep it short and don't repeat it more than 3 times per second (WCAG 2.3.1).

## Tokens and values
| Token | Default | Source |
|---|---|---|
| Composite axes | 5 | Simply Wall St |
| Checks per axis | 6 (binary) | Simply Wall St |
| Classification grid | 3 × 3 | Morningstar |
| Tile flash, drill zoom | 240 ms (`--motion-dur-medium`) | `assets/tokens.css` |
| Heatmap colour scale | diverging, symmetric around 0, 5–7 steps, ±3% clamp for 1D | our default; TradingView shows its own boundaries in the legend |
| Heatmap size options | cap / volume / mono | TradingView |
| Colour schemes | default, CVD-safe, monochrome | TradingView, Finviz, Bloomberg |
| Tooltip delay | 0–50 ms on chart tiles, 0 ms for subsequent peers | chart-tooltips-crosshair-labels.md; Vercel |

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
- https://github.com/SimplyWallSt/Company-Analysis-Model/blob/master/MODEL.markdown
- https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work
- https://www.morningstar.com/investing-terms/morningstar-style-box
- https://en.wikipedia.org/wiki/Morningstar_Style_Box
- https://www.tradingview.com/support/solutions/43000766446
- https://finviz.com/blog/the-finviz-matrix-market-breadth-visualized/
- https://koyfin.com/help/mydashboards-myd
- https://www.koyfin.com/features/custom-dashboards
- https://daytradereview.com/koyfin-review/
- https://www.techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/ (archived 2021-12-03 copy linked above)
- https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/ (blocks automated fetching; unverified)
- https://uxmag.com/articles/the-impossible-bloomberg-makeover
- https://core77.com/posts/24893/moneymaking-multi-monitor-mayhem-and-why-some-prefer-interface-design-that-sucks-24893
- https://en.wikipedia.org/wiki/Bloomberg_Terminal
- https://vercel.com/design/guidelines
