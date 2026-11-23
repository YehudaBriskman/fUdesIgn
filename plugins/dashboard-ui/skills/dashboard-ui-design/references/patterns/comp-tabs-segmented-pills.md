# Tabs vs segmented controls vs pills (and URL-addressable tabs)

> Tabs switch *panels of different content*, segmented controls switch *one view's mode or scope*, pills (chips) *filter or select values*. Whichever you use, the selected state belongs in the URL whenever a colleague opening the link should see the same thing.

**Category:** Components and interaction · **Applies to:** page sections (Overview / Financials / Filings), chart granularity (D / W / M / Q), unit toggles ($ / %), table views, filter value pickers · **Priority:** must

## When to use / when not
| Need | Use | Not |
|---|---|---|
| 2–7 sibling panels of *different* content on one page, one visible at a time | **Tabs** (`tablist` / `tab` / `tabpanel`) | segmented control |
| Sections that are separate *pages*/routes (each with its own URL, loads data) | **Navigation styled as tabs**: `<nav>` with links and `aria-current="page"` | ARIA tabs, which promise in-page panels and arrow-key behaviour that links don't have |
| Switch the mode, scope, unit or granularity of the *same* content (chart: Day / Week / Month; values: $ / %; Table / Chart) | **Segmented control**: a radio group styled as joined buttons, 2–5 options | tabs, because the content isn't a different panel |
| Select one or more *values* to filter a set (e.g. sectors, statuses), possibly many, possibly removable | **Pills / chips**: toggle buttons or checkboxes. Removable chips for applied filters | segmented control (no multi-select, doesn't scale past 5) |
| Content users must compare side by side | **Neither**: one page with subheadings, or a split view | tabs. NN/g: use tabs only when users don't need to compare across them |

Rules of thumb:
- **Count.** A segmented control works for 2–5 options. Android's Compose docs give 2–5 items (more than five → chips); eBay Playbook: "Segmented buttons can have two to four segments." With more, use a select or menu. Tabs work up to about 7 visible; beyond that, overflow into a "More" menu.
- **Does selecting change *what* is shown or *how* it's shown?** If what, use tabs. If how, use a segmented control.

## Rules (do)
- **Tabs**
  - Use a single row, never wrapped. Put the tab list *above* the panel, and keep labels to 1–2 words in one consistent case, never all caps (NN/g).
  - Put the most-used tab first and select it by default. Non-default tabs get much less attention (NN/g).
  - Indicate the selected tab in **at least two ways**, e.g. a 2–3px underline plus weight or colour (NN/g: "Use at least two selection indicators"). Never use colour alone (WCAG 1.4.1).
  - Draw the underline with a border, not `box-shadow`. Forced-colors mode removes shadows.
  - Never change a tab's box size on selection: no `font-weight` jump that reflows neighbours. Do not change weight at all (use colour, an underline bar or a fill). If bold is mandatory, pre-reserve the width with a hidden `aria-hidden` bold twin span or a `min-inline-size` (see `dstoken-typography-details.md`).
  - Keyboard: Tab enters the selected tab. Arrow keys move between tabs, and Home/End go to the first and last. Selection follows focus by default.
  - Use *manual activation* (Enter/Space) when a panel is slow to fetch or when selection writes history, sends analytics or reflows the layout heavily.
  - Hide inactive panels with `hidden="until-found"` so find-in-page still finds their text, and sync the selection on `beforematch`. Not Baseline (Chrome/Edge 102, Firefox 148, Safari 26.2 partial); elsewhere it acts like plain `hidden`, so the panel is hidden but not findable.
  - When tabs overflow, scroll them horizontally with edge fades. Alternatively, move the tail into a "⋯" More menu *outside* the tablist; the selected tab always stays visible.
- **Segmented control**
  - Build it as `<fieldset>` + `<input type="radio">` (or `role="radiogroup"`). The value applies immediately.
  - Make segments equal width, or fit them to content with consistent padding.
  - Don't mix icon-only and text segments in one control. Icon-only segments need `aria-label` and a tooltip.
  - Use the same height as adjacent buttons and inputs (28/32px in dashboards).
  - On narrow widths, collapse to a `<select>` (Primer's SegmentedControl offers `hideLabels` and `dropdown` variants for narrow viewports).
- **Pills / chips**
  - Selectable chips are `<button aria-pressed>` or checkboxes. A selected chip shows a check icon *and* a fill change.
  - Removable chips carry an "×" button with `aria-label="Remove filter: Sector = Energy"`.
  - See `comp-filter-bar-chips.md` for the filter-bar rules.
- **URL-addressable state**
  - The active tab, segmented value and applied filters are written to the URL as path segments or query params, so refresh, Back and share all work.
  - Test: "If another person opening this URL should see the same state, put it in the URL."
  - Use real routes (`/company/AAPL/financials`) for navigation tabs. Use query params (`?view=chart&period=q`) for in-page tabs and modes.
  - Omit default values from the URL.
  - Use `history.pushState` for distinct view changes, so Back steps through them. Use `replaceState` for refinements like a slider being dragged or typing.

## Anti-patterns (don't)
- ARIA `role="tab"` on links that load new routes, or the reverse: a `<nav>` of links visually mixed with in-page tabs in one control (NN/g: mixing them "will disorient users").
- A segmented control with 8 options, or one that changes *which dataset* is shown (that's a tab or a select).
- Two rows of tabs. Tabs whose labels are truncated to "Fin…" or "Valu…".
- Selected state shown only by a colour change, or by a background that disappears in forced-colors mode.
- Tab or filter state held only in memory, so refresh resets the view and a shared link shows something else (Alfy: "in-memory-only SPA state").
- Pills used as breadcrumbs or as tabs without a selected-state cue. Pills without separators read as same-level filters.
- `replaceState` on a tab switch the user expects to undo with Back.

## Good references
- [NN/g — Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) — testable rules: one row, list above the panel, at least two selection indicators, 1–2 word labels, no all-caps, high-use tab first and selected by default, no mixing of navigation tabs and in-page tabs.
- Stripe Dashboard (product, requires a login) — chart granularity and comparison sit in compact segmented and select controls above the chart, while the report sections are real routes. Mode and content are kept apart.
- [Linear docs — Filters](https://linear.app/docs/filters) — applied filters live in the URL, so shared links reproduce the view. View options are deliberately excluded.
- [Ahmad Alfy — Your URL is your state](https://alfy.blog/2025/10/31/your-url-is-your-state.html) — what goes in the URL (filters, sorting, active tabs, date ranges, view modes) and what stays out (open modals, tokens, unsaved input, high-frequency state), plus `pushState` for distinct changes vs `replaceState` for refinements.
- [Grafana](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/) — `?from=now-6h&to=now` and dashboard variables in the URL make every view shareable and bookmarkable.

## Bad references
- [NN/g — Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) shows tab bars that overflow into carousels, which hide tabs and raise interaction cost, and low-contrast unselected tabs that users never discover.
- Generic analytics dashboards that put "Revenue / Users / Sessions" in a segmented control that swaps the whole dataset and chart type. Those are different questions and need tabs or separate cards. Screen readers also announce them as radios.
- [Alfy's anti-pattern list](https://alfy.blog/2025/10/31/your-url-is-your-state.html) — opaque params (`?x=1&f=a3`) and base64 blobs make shared URLs unreadable and undebuggable.

## Accessibility
- Tabs: `role="tablist"` with an accessible name, `aria-selected`, and `role="tabpanel"` with `aria-labelledby`. The APG pattern also sets `aria-controls` on each tab; it's harmless, but don't rely on it, because screen reader support for it is uneven.
- Give a visible panel with no focusable content `tabindex="0"`.
- Use `focusgroup="tablist nomemory"` where supported (experimental, Chrome/Edge 150+ only, not Baseline). Otherwise use the APG roving-tabindex fallback, loaded only if `'focusGroup' in HTMLElement.prototype` is false. Set `role="tablist"` and `role="tab"` explicitly: `focusgroup` infers them on generic elements, but the fallback browsers don't.
- A segmented control is a radio group: one Tab stop, arrows move *and* select, and it has a `legend` (can be visually hidden).
- Chips need a ≥24×24 target and a selected state exposed via `aria-pressed` or `checked`.

## Motion / interaction (if relevant)
- Slide the tab underline between tabs using anchor positioning (`anchor-name` on the active tab, `position-anchor` on the indicator) with a transition on `inset` of `--motion-dur-short` (150 ms) and `--motion-ease-standard`, and none under reduced motion. Don't use `position-area`, which can't be transitioned. `position-anchor` is Baseline only since September 2026 (Safari 27), so gate the sliding indicator in `@supports (position-anchor: --a)` and keep the static `::after` underline as the fallback.
- Cross-fade the panel in ≤150 ms, or not at all. Never slide whole data panels horizontally.

## Tokens and values
| Token | Default |
|---|---|
| Tab height | 40px (dense: 32px) |
| Tab inline padding | 12–16px, gap 4–8px |
| Selected underline | 2–3px `border-block-end`, colour role `--accent` |
| Unselected tab text | `--text-muted`, ≥4.5:1 |
| Segmented control height | 28 / 32px, radius 6px, 1px `--border`, selected = `--surface` + `--text` |
| Segments | 2–5 |
| Tabs visible before overflow | ≤7 |
| Indicator transition | 150ms (`--motion-dur-short`), `--motion-ease-standard` |
| URL write | `pushState` for tab/mode change; `replaceState` + 300ms debounce for continuous input |

## Implementation sketch
```html
<!-- In-page tabs, state in ?tab= -->
<div class="tabs">
  <!-- focusgroup (Chrome/Edge 150+) gives arrow keys natively. Roles are explicit so the
       roving-tabindex fallback in other browsers only has to manage tabindex. -->
  <div role="tablist" focusgroup="tablist nomemory" aria-label="Company sections">
    <button type="button" role="tab" id="t-ov" aria-selected="true" focusgroupstart>Overview</button>
    <button type="button" role="tab" id="t-fin" aria-selected="false">Financials</button>
    <button type="button" role="tab" id="t-fil" aria-selected="false">Filings</button>
  </div>
  <div role="tabpanel" aria-labelledby="t-ov"><div class="panel-body">…</div></div>
  <div role="tabpanel" aria-labelledby="t-fin" hidden="until-found"><div class="panel-body">…</div></div>
  <div role="tabpanel" aria-labelledby="t-fil" hidden="until-found"><div class="panel-body">…</div></div>
</div>

<!-- Segmented control = radio group -->
<fieldset class="segmented">
  <legend class="visually-hidden">Granularity</legend>
  <label><input type="radio" name="g" value="m"> Month</label>
  <label><input type="radio" name="g" value="q" checked> Quarter</label>
  <label><input type="radio" name="g" value="y"> Year</label>
</fieldset>
```
```css
[focusgroup] > button { position: relative; }
[focusgroup] > button[aria-selected="true"] { color: var(--text); }
[focusgroup] > button[aria-selected="true"]::after {
  content: ""; position: absolute; inset: auto 0 0; border-block-end: 3px solid var(--accent);
}
.segmented { display: inline-flex; border: 1px solid var(--border); border-radius: 6px; padding: 2px; }
.segmented label { min-block-size: 28px; padding-inline: 10px; display: grid; place-items: center; border-radius: 4px; }
.segmented input { position: absolute; opacity: 0; }
.segmented label:has(:checked) { background: var(--surface); font-weight: 600; outline: 1px solid var(--border); }
.segmented label:has(:focus-visible) { outline: 2px solid var(--focus-ring); outline-offset: 1px; }
```
```ts
type TabId = 'overview' | 'financials' | 'filings';
const TAB_DEFAULT: TabId = 'overview';
const isTabId = (v: string | null): v is TabId => v === 'overview' || v === 'financials' || v === 'filings';

export function readTab(): TabId {
  const v = new URL(location.href).searchParams.get('tab');
  return isTabId(v) ? v : TAB_DEFAULT;
}
export function writeTab(tab: TabId): void {
  const url = new URL(location.href);
  if (tab === TAB_DEFAULT) url.searchParams.delete('tab'); else url.searchParams.set('tab', tab);
  history.pushState({ tab }, '', url); // distinct view change: Back should undo it
}
window.addEventListener('popstate', () => selectTab(readTab()));
declare function selectTab(tab: TabId): void;
```

## Checklist
- [ ] Tabs swap content, a segmented control swaps the mode, chips filter values. No component is doing another's job.
- [ ] Segmented controls have 2–5 options. Tabs show ≤7 before overflow and sit in a single row.
- [ ] The selected tab has ≥2 visual cues, including a non-colour shape that survives forced colors.
- [ ] Route-level sections are `<nav>` links with `aria-current="page"`, not ARIA tabs.
- [ ] Refresh, Back and a shared link all restore the same tab, mode and filters. Defaults are omitted from the URL.
- [ ] Arrow keys move within the tablist or radio group, and Tab leaves it.
- [ ] Selecting a tab never resizes neighbouring tabs.

## Sources
- https://www.nngroup.com/articles/tabs-used-right/
- https://developer.android.com/develop/ui/compose/components/segmented-button (2–5 items, chips beyond five)
- https://playbook.ebay.com/design-system/components/segmented-button (2–4 segments)
- https://primer.style/components/segmented-control
- https://alfy.blog/2025/10/31/your-url-is-your-state.html
- https://linear.app/docs/filters
- https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://open-ui.org/components/scoped-focusgroup.explainer/ (`focusgroup="tablist"`, `nomemory`, `focusgroupstart`, inferred roles)
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden (`until-found`)
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using
