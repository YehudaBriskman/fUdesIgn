# Feature sections and bento grids

> Lead each feature with the benefit, show 3–6 features per section using real product UI rather than icons, and build any bento grid with one hero tile, 5–7 tiles and a DOM order that matches the visual order and the mobile priority order.

**Category:** Sections · **Applies to:** feature lists, image-text rows, bento grids, "how it works" blocks, product page highlights · **Priority:** must

## When to use / when not
- **Stacked feature rows** (media beside text): use for 3–5 substantial features that each need a screenshot and 40–80 words of explanation.
- **Bento grid:** use when you have 5–7 capabilities of unequal importance and each can be shown in one crop of real UI or one number. The size of a tile signals its rank.
- **Simple list or 3-column grid:** use for 6+ small, equal features (integrations, compliance items). Don't force them into a bento.
- Don't use a bento when the features are all equal. Varied spans then imply a ranking that doesn't exist. Don't use one when you have no product imagery; a bento of icons is the generic card grid with extra steps.

## Rules (do)
- **Benefit-first headings.** The heading names the outcome ("Ship a preview for every pull request"); the body names the mechanism ("Git integration builds each branch"). Keep headings to 3–8 words and under about 45 characters so they fit one line in a tile.
- **3–6 features per section.** Past 6, split into two sections with their own h2, or move the long tail into a compact list or a comparison table (`mksect-pricing-tables.md`).
- **Real UI crops, not generic icons.** Crop to the part of the interface that proves the claim, at 1x–2x real pixel density, with the surrounding chrome trimmed. Apple's product pages and Linear's homepage show the product itself in almost every block. An identical grid of icon-in-a-rounded-square cards is a top generated-default tell (`mkstyle-generated-default-tells.md`).
- **Zig-zag rows: know the cost.** NN/g eye-tracking found that alternating image sides makes scanning less efficient than keeping images in one column. Users fixate on images they would otherwise skip and lose the left edge of the text. The study covered only 4 live pages, so treat it as a strong hint. Default to a fixed side (media right, text left in LTR). Use zig-zag only when each row is a distinct story with a large visual (at least half the container) and 3–4 rows at most.
- **Bento grid structure:**
  - 5–7 tiles. Fewer than 5 is a feature row; more than 7 loses the hierarchy.
  - Exactly 1 hero tile, spanning 2 columns and 2 rows of a 4-column grid (or 2 of 3 columns). It holds the most important capability.
  - Varied spans with at most 3 distinct tile shapes (2×2, 2×1, 1×1). Random spans look like a broken masonry layout.
  - One gap value (`--mk-grid-gap`, 12–24px) and one radius (`--mk-card-radius`, 12px) for every tile. Inner media gets radius minus padding, or none (see `style-radius-scale.md`).
  - Container width `--mk-container-wide` (84rem) at most.
- **Mobile collapses to 1 column in priority order.** Below about 640px, the grid becomes one column and tiles appear in DOM order. Therefore the DOM order **is** the priority order: hero first, then by importance. Between 640 and 1024px, use 2 columns with the hero spanning both.
- **Use container queries for tile internals.** A tile can be 280px or 640px wide depending on its span, and viewport media queries can't see that. Set `container-type: inline-size` on each tile and switch the layout (stacked vs side-by-side, title size) at around 28rem.
- **Copy budget per tile:** a heading plus 1–2 lines (up to about 20 words). If a tile needs a paragraph, it should be a feature row.

## Anti-patterns (don't)
- 6 identical cards, each with a 48px icon in a tinted square, a 2-word title and one generic sentence ("Lightning fast", "Secure by default").
- Feature headings that name the mechanism only ("AI-powered engine", "Real-time sync").
- Using `order`, `grid-auto-flow: dense` or explicit `grid-row` placement to shuffle tiles so the visual order differs from the DOM order. Keyboard focus then jumps around the grid (WCAG 1.3.2, 2.4.3).
- Bento tiles that each hold a different illustration style, gradient and radius.
- Zig-zag rows with small decorative images: all the scanning cost and none of the payoff.
- Tiles that animate on hover with no further content or link behind them.

## Good references
- [Apple — iPhone](https://www.apple.com/iphone/) — product pages where nearly every block shows the device or its screen; Apple's keynote "highlights" slides popularised the bento layout that web teams later adopted (per design write-ups; Apple publishes no design rationale).
- [Linear](https://linear.app) — sections named by outcome ("Planning and monitoring", "Build, review, and ship") illustrated with product-like issue lists, status columns and PR cards rather than icons.
- [Vercel](https://vercel.com) — each feature section opens with an outcome heading ("Ship apps that scale from zero to millions instantly"), pairs a named customer and a number (Zapier, over 100 million monthly visits) and then gives exactly 4 feature tiles. That fits the 3–6 rule.
- [Raycast](https://www.raycast.com) — "Don't repeat yourself" shows snippets, quicklinks and hotkeys as real UI previews; the extension grid pairs each icon with a real screenshot.
- [NN/g: Zigzag image–text layouts make scanning less efficient](https://www.nngroup.com/articles/zigzag-page-layout/) — eye-tracking evidence for the aligned layout default.

## Bad references
- [NN/g gaze plots of zig-zag layouts](https://www.nngroup.com/articles/gazeplots-zigzag/) — the HelloFresh example: one fixation on the first image, then the rest is ignored, so the alternating layout buys nothing.
- Generic SaaS template feature grids (many free landing-page kits): 6 or 9 identical icon cards. See `mkstyle-generated-default-tells.md` and `mkref-anti-patterns-gallery.md`.

## Accessibility
- **Meaningful sequence (SC 1.3.2) and focus order (SC 2.4.3):** the reading and tab order follow the DOM. Place tiles in the DOM in the order you want them read, and make the CSS placement follow it. Check by tabbing through and with a screen reader's reading order.
- Each feature heading is a real heading one level below the section h2 (h3 under h2). Don't skip levels (`mkfound-accessibility-floor.md`).
- Screenshots that carry the claim need `alt` that states what they prove ("Pull request with a preview link and passing checks"). Decorative background art gets `alt=""`.
- If a whole tile is clickable, use one link on the heading and stretch its hit area with a pseudo-element. Don't wrap the tile in `<a>`; the whole tile text then becomes the link name.
- Text on tile images or gradients must meet 4.5:1 on its worst pixel.

## Motion / interaction (if relevant)
- One reveal per section at most, via `.mk-reveal` (16px, 400ms), staggered by 30ms per tile, 300ms total. Never hide tiles until JS runs. Autoplaying UI loops inside tiles must stop after 5 seconds or offer a pause (WCAG 2.2.2). See `mkstyle-scroll-motion.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-container-wide` | 84rem | bento max width |
| `--mk-grid-gap` | clamp(12px … 24px) | one gap for all tiles |
| `--mk-card-radius` | `--radius-lg` 12px | all tiles |
| `--mk-card-pad` | clamp(20px … 32px) | tile padding |
| `--mk-media-radius` | `--radius-xl` 16px | stand-alone screenshots in feature rows |
| Grid | 4 cols ≥1024px, 2 cols 640–1023px, 1 col below | |
| Tiles | 5–7; 1 hero at 2×2 | |
| Tile switch | `@container (inline-size > 28rem)` | side-by-side internals |

## Implementation sketch
```html
<section class="mk-section" aria-labelledby="feat-h">
  <h2 id="feat-h" class="mk-h2">Ship every change with confidence</h2>
  <ul class="bento" role="list">
    <li class="tile tile--hero"><h3>A preview for every pull request</h3><p>Each branch builds its own URL.</p>
      <img src="/ui/preview-pr.avif" alt="Pull request showing a preview link and passing checks" width="1200" height="760"></li>
    <li class="tile tile--wide"><h3>Roll back in one click</h3><p>Every deploy stays addressable.</p></li>
    <li class="tile"><h3>Logs in real time</h3></li>
    <li class="tile"><h3>Edge caching</h3></li>
    <li class="tile tile--wide"><h3>Analytics without cookies</h3></li>
  </ul>
</section>
```
```css
.bento {
  display: grid; gap: var(--mk-grid-gap); padding: 0; list-style: none;
  inline-size: min(100% - 2 * var(--mk-gutter), var(--mk-container-wide)); margin-inline: auto;
  grid-template-columns: 1fr;
}
.tile {
  container-type: inline-size;
  padding: var(--mk-card-pad); border-radius: var(--mk-card-radius);
  background: var(--surface); border: 1px solid var(--border); overflow: clip;
}
.tile h3 { margin: 0; font: 600 var(--mk-step-2) / var(--mk-leading-heading) var(--mk-font-display); text-wrap: balance; }
.tile p { margin-block: var(--space-2, 8px) 0; color: var(--text-muted); }
.tile img { display: block; inline-size: 100%; block-size: auto; margin-block-start: var(--space-5, 24px); border-radius: calc(var(--mk-card-radius) - 4px); }
@media (min-width: 640px) {
  .bento { grid-template-columns: repeat(2, 1fr); }
  .tile--hero { grid-column: span 2; }
}
@media (min-width: 1024px) {
  .bento { grid-template-columns: repeat(4, 1fr); }
  .tile--hero { grid-column: span 2; grid-row: span 2; }
  .tile--wide { grid-column: span 2; }
}
@container (inline-size > 28rem) {
  .tile h3 { font-size: var(--mk-step-3); }
}
```

## Checklist
- [ ] Every feature heading names a benefit, in 3–8 words.
- [ ] Each section shows 3–6 features; a bento holds 5–7 tiles with exactly one hero tile.
- [ ] Tiles show real product UI or real numbers; there is no grid of identical icon cards.
- [ ] All tiles share one gap and one radius token.
- [ ] Tabbing through the grid follows the visual order at every breakpoint; no `order` or `dense` reshuffling.
- [ ] At 375px the grid is one column with the hero first and tiles in priority order.
- [ ] Feature rows keep media on one side, unless each row is a large, distinct story (3–4 rows max).

## Sources
- https://www.nngroup.com/articles/zigzag-page-layout/ (could not load directly; findings from search summary: aligned layouts scan better; 4-page study)
- https://www.nngroup.com/articles/gazeplots-zigzag/
- https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow (dense packing and the order caveat)
- https://webdesignerdepot.com/what-is-the-bento-ui-trend-and-how-can-you-get-started (bento origin disputed: Apple keynotes vs Windows Phone Metro; Linear example)
- https://www.apple.com/iphone/
- https://linear.app
- https://vercel.com
- https://www.raycast.com
