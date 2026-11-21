# Glass and translucency (and when not to use it)

> Use translucency only for thin chrome that floats over scrolling content (sticky headers, toolbars, command palettes over a dim scrim), with heavy blur and a high-opacity tint so the text contrast never depends on what's underneath. Never put data, tables or charts on glass.

**Category:** Color and visual style · **Applies to:** sticky top bars, floating toolbars, command palette, modal scrims, map/chart overlays, mobile tab bars · **Priority:** nice (and "must not" for data surfaces)

## When to use / when not
- **OK:** a sticky header or toolbar over a scrolling table, where a hint of what scrolled beneath helps orientation. A command palette or dialog over a blurred, dimmed scrim. A small control cluster floating over a map or full-bleed chart.
- **Not OK:** KPI cards, tables, chart containers, side navigation with dense text, form fields, tooltips over charts. NN/g: glassmorphism is "best when utilized sparingly", and the biggest problems are text legibility and uneven contrast across a translucent card.
- **Not OK over busy, uncontrolled backgrounds** (user photos, video, live charts) unless blur is very high and the tint is nearly opaque. NN/g's iOS 26 review documents text-over-text and icons-over-photos failures in Mail, Messages and Maps.
- Dashboards rarely have the rich imagery that makes glass look good. Over flat grey, glass is just a slightly transparent card with GPU cost.

## Rules (do)
- **Tint opacity ≥ 70–85% for text-bearing glass.** NN/g's examples show 30% opacity with 25 px blur still leaves edges readable through the surface, which competes with text.
- **Blur ≥ 16–24 px**, more over intricate content (NN/g: "more blur is generally better"). With 100 px blur, background elements merge into a smooth field.
- **Add a 1 px hairline border** (white at ~15–25% on dark, black at ~8% on light). It defines the edge and gives the "thickness" illusion NN/g describes.
- **Contrast is tested at the worst case:** sample the darkest and lightest content that can pass beneath. The text token must hit 4.5:1 against the tint composited over both. If it can't, raise opacity.
- **Respect user settings:** `prefers-reduced-transparency: reduce` (Chromium), `prefers-contrast: more`, and `forced-colors: active` all fall back to an opaque `--surface`. Apple and Microsoft give users the same switch (Reduce Transparency, Transparency effects).
- **Prefer a dim scrim to glass for modals.** `::backdrop { background: oklch(0 0 0 / 0.4) }` with an optional light blur (4–8 px) keeps focus on the dialog without making the dialog itself translucent.
- **Never stack glass on glass.** Two translucent layers compound unpredictably, and Apple's guidance against layering materials exists for this reason.
- **Mind performance:** `backdrop-filter` re-samples every frame while content scrolls beneath it. Limit it to 1–2 elements per view, avoid it on elements that animate size, and test scrolling a 1,000-row table on a mid-range laptop.
- **Use system materials where they exist** (NN/g recommends Apple materials / Microsoft Acrylic over hand-rolled effects). On the web, build one `.glass` utility and use only that.

## Anti-patterns (don't)
- Glass KPI cards over a gradient blob background (the 2021 Dribbble "glassmorphism dashboard"). Numbers sit on varying backgrounds, and the gradient competes with the data.
- Low-opacity (10–30%) tint with light blur behind text.
- Glass tooltips over line charts: series lines show through the tooltip text.
- Translucent sidebars where the content behind them shows through, so the nav text contrast changes as the page scrolls.
- Floating controls that cover content without a reserved area (NN/g: Safari's floating controls and status bar overlapping page content).
- Animating blur radius.

## Good references
- [NN/g – Glassmorphism](https://www.nngroup.com/articles/glassmorphism/) — when it helps (depth over complex backgrounds), opacity/blur trade-offs with concrete examples (90/60/30% opacity, 25 vs 100 px blur), hairline strokes, and offering reduce-transparency.
- [Microsoft Fluent – Elevation & materials](https://fluent2.microsoft.design/elevation) — Acrylic/Mica are system materials with defined use (transient surfaces), not decoration for content.
- [Apple HIG – Materials](https://developer.apple.com/design/human-interface-guidelines/materials) — materials for the functional layer that floats above content, vibrancy for text on materials, and Reduce Transparency as a supported user setting.
- [Atlassian – Elevation](https://atlassian.design/foundations/elevation) — overlays are opaque surfaces with paired shadows, a solid dashboard-grade alternative to glass.

## Bad references
- [NN/g – Liquid Glass Is Cracked, and Usability Suffers in iOS 26](https://www.nngroup.com/articles/liquid-glass/) — a documented field failure: Mail's search bar overlapping previews gives "an illegible mess", Maps icons blend into photos despite blur, faint floating search bars get missed, and morphing glass controls distract. The verdict: "prioritizing spectacle over usability."
- [Fast Company / Jakob Nielsen coverage of iOS 26](https://fastcompanyme.com/?p=41660) — notes that low-vision users who don't switch the effect off bear the cost.
- Glassmorphism dashboard UI kits (Dribbble/Behance, 2021–2022) — frosted KPI cards on neon blobs. Contrast changes card to card, and charts are illegible in screenshots without the blob.

## Accessibility
- WCAG 1.4.3 / 1.4.11 apply at the worst point of the background (W3C: test the least-contrasting area).
- Provide opaque fallbacks for `prefers-reduced-transparency`, `prefers-contrast: more` and `forced-colors: active`.
- Glass chrome must not obscure focused elements. Use `scroll-padding-top` equal to the sticky bar height (WCAG 2.4.11 Focus Not Obscured).

## Motion / interaction (if relevant)
- Fade glass in and out with opacity (150–200 ms). Never animate `backdrop-filter` values.
- Hiding sticky glass bars on scroll-down is fine (modern-web-guidance `content-first-noise-reduction.md`, scroll-state container query) and reduces the area where text overlaps text.
- Avoid the "morphing" control transitions NN/g criticised. Motion should signal state change only.

## Tokens and values
| Token | Value | Notes |
|---|---|---|
| `--glass-tint` light | `color-mix(in oklab, var(--surface) 80%, transparent)` | ≥ 70% for text |
| `--glass-tint` dark | `color-mix(in oklab, var(--surface) 75%, transparent)` | |
| `--glass-blur` | 20px (16–24); 40px+ over imagery | `backdrop-filter: blur()` |
| `--glass-saturate` | 1.2–1.5 | keeps the backdrop from going muddy grey |
| `--glass-border` | 1px, `color-mix(in oklab, var(--text) 10%, transparent)` | edge definition |
| Scrim for modals | oklch(0 0 0 / 0.35–0.5) + 0–8px blur | preferred over glass dialogs |
| Max glass elements per view | 2 | perf and hierarchy |
| Fade duration | 150–200 ms opacity | |

## Implementation sketch
```css
.glass {
  background: var(--surface); /* opaque base for every fallback */
  border-bottom: 1px solid var(--border);
}
@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: color-mix(in oklab, var(--surface) 80%, transparent);
    backdrop-filter: blur(20px) saturate(1.3);
    border-bottom-color: color-mix(in oklab, var(--text) 10%, transparent);
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active) {
  .glass { background: var(--surface); backdrop-filter: none; }
}
.app-header.glass { position: sticky; top: 0; z-index: 1; }
html { scroll-padding-top: 4rem; } /* focused rows never hide under the bar */

dialog::backdrop { background: oklch(0 0 0 / 0.4); backdrop-filter: blur(4px); }
dialog { background: var(--surface); border: 1px solid var(--border); } /* dialog itself stays opaque */
```

## Checklist
- [ ] No table, chart, KPI or form sits on a translucent surface.
- [ ] Glass text passes 4.5:1 over the lightest and darkest content that can scroll beneath.
- [ ] Tint ≥ 70% opacity, blur ≥ 16 px, 1 px edge border.
- [ ] Opaque fallback for reduced transparency, more contrast, forced colours and no `backdrop-filter` support.
- [ ] ≤ 2 glass elements per view, never nested.
- [ ] Scrolling performance checked with a long table under the glass bar.

## Sources
- https://www.nngroup.com/articles/glassmorphism/
- https://www.nngroup.com/articles/liquid-glass/
- https://fastcompanyme.com/?p=41660
- https://developer.apple.com/design/human-interface-guidelines/materials
- https://fluent2.microsoft.design/elevation
- https://atlassian.design/foundations/elevation
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- modern-web-guidance: `guides/user-experience/content-first-noise-reduction.md`, `guides/visual-design/color.md`, `guides/visual-design/soft-edge-content-fade.md`, `guides/ui-components/dialog.md`
