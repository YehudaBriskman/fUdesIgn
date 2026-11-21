# App shell: sidebar vs top bar, breadcrumbs and layout

> Use a persistent, collapsible left sidebar for product navigation once there are more than ~5 destinations or they will grow. Reserve the top bar for global, universal actions (search, create, account). Add breadcrumbs only when the hierarchy is ≥3 levels deep.

**Category:** Components and interaction · **Applies to:** the outer frame of a dashboard app: sidebar, top bar, page header, breadcrumbs, content region, mobile navigation · **Priority:** must

## When to use / when not
| Situation | Navigation |
|---|---|
| ≤5 stable top-level sections, content needs maximum width (marketing-style analytics, a single-purpose tool) | **Top bar** with inline links |
| >5 sections, or sections that will grow, or user-specific items (projects, saved views, portfolios) | **Left sidebar** (NN/g: vertical nav scales without shrinking labels; Atlassian moved product navigation into a sidebar in 2024–25) |
| Both global utilities and product sections | **Hybrid:** a top bar for search/⌘K, create, notifications and account; a sidebar for sections and entities |
| Hierarchy ≥3 levels (Portfolio › Company › Filing › Note) | add **breadcrumbs** above the page title |
| Flat or 2-level apps | **no breadcrumbs**. Highlight the current section in the nav instead (NN/g) |
| Viewport < ~1024px | sidebar collapses to icons (rail) or a **modal drawer** opened from a top-bar button |

## Rules (do)
- **Shell grid.**
  - Use CSS grid with named areas: `"sidebar header" "sidebar main"`.
  - The sidebar is full-height. Atlassian's 2025 redesign moved product navigation into the sidebar and left the top bar "dedicated to universal actions like search and create".
  - The top bar is 48–56px. Only `main` scrolls; the sidebar has its own overflow.
- **Landmarks.** Use `<header>`, a `<nav aria-label="Main">` for the sidebar, `<main id="main">`, and a skip link "Skip to main content" as the first focusable element.
- **Sidebar.**
  - Width 240–280px, defaulting to 256px. Atlassian's navigation-system package defaults to 320px, resizable from 240px to 50% of the viewport, and keeps the resized width across collapse and expand.
  - Collapsible to a 56–64px icon rail via a visible toggle in the top bar *and* a shortcut (`[` or ⌘\). Persist the collapsed state per user.
  - Order: product switcher or org at the top, then primary sections, then user content (Starred, Recent, Saved views), then Settings and Help at the bottom.
  - Use text labels, never icon-only at full width. In rail mode, every icon gets a tooltip with the label (NN/g: icon-only nav costs hover time and decoding).
  - Keep ≤ ~10 top-level items visible. Group the rest under collapsible sections with indentation (Atlassian replaced category labels with indentation built from spacing tokens) and ≤2 levels of nesting.
  - Show item actions (⋯, add) on hover or focus, in one consistent position per item (Atlassian).
- **Current location.** The current item has `aria-current="page"`, plus a background, a weight change *and* an inline-start bar. That's 2+ cues, not colour alone. Parent sections of the current page are expanded and marked.
- **Top bar.** Holds global actions only: a search field that also opens ⌘K (see `comp-command-palette-search.md`), "Create", notifications, help and account. Don't duplicate sidebar links here, and don't duplicate the same menu as a bar and a hamburger (NN/g).
- **Page header (inside main).**
  - Breadcrumbs (if any), then the H1 page title.
  - Page-level actions sit on the right: one primary at most (see `comp-button-hierarchy.md`).
  - Tabs, if used, sit directly under the title (see `comp-tabs-segmented-pills.md`).
  - The global filter bar sits under the tabs (see `comp-filter-bar-chips.md`).
- **Breadcrumbs.**
  - Show hierarchy, not history. Each item except the current one links to a real ancestor page.
  - Use `<nav aria-label="Breadcrumbs"><ol>`, and give the current page `aria-current="page"`. The WAI-ARIA APG example keeps it a link; NN/g says don't link it ("You should never have a link that does nothing"). Either is acceptable, but it must look different from the links.
  - Separators (`/` or `›`) are generated in CSS with empty alt text: `content: "/" / ""`.
  - Don't let the trail wrap (NN/g). On narrow screens, collapse the middle items into "…", a menu button, or show only the parent ("‹ Company"), which NN/g allows on mobile only.
  - NN/g starts the trail with Home but says not to duplicate it in both the global navigation and the trail. In an app shell where the logo and sidebar already link home, start from the first meaningful level.
- **Mobile (<768px).**
  - The sidebar becomes a modal drawer: native `<dialog>` + `showModal()`, optionally with swipe-to-close via scroll-snap.
  - If the same element is both sidebar and drawer, use `popover="manual"` + `role="dialog"` toggled by a media query, and handle `inert`, `aria-modal`, Esc and focus return manually.
- **Route changes (SPA).** On navigation, move focus to the new page's H1 (`tabindex="-1"`) and update `document.title`. Gatsby's user testing found heading focus works best for screen reader users, and resetting focus to the top was "very overwhelming".

## Anti-patterns (don't)
- A top bar with 9 section links crammed into shortened, vague labels ("Insights", "Hub", "Center"). NN/g: horizontal nav forces label shortening and generic categories.
- An icon-only sidebar with no labels or tooltips.
- Hiding desktop navigation behind a hamburger. Users forget it exists (NN/g).
- Breadcrumbs that reflect click history, link to non-page categories, or duplicate a 2-level nav.
- Pill-styled breadcrumbs without separators, which read as filters.
- Two scrollbars on the page: body *and* main. Only one region should scroll vertically.
- A sticky top bar + sticky page header + sticky filter bar together taking more than ~25% of a 768px-tall viewport.
- Shifting the layout when the sidebar collapses without animation or persistence, so charts reflow twice on every page load.

## Good references
- [NN/g — Left-side vertical navigation on desktop](https://www.nngroup.com/articles/vertical-nav/) — when vertical beats horizontal (broad or growing IA), keep it visible, text labels, left-aligned, and the trade-off against the content-to-chrome ratio.
- [Atlassian — Designing Atlassian's new navigation](https://www.atlassian.com/blog/design/designing-atlassians-new-navigation) — why they moved from top bar to sidebar, research with 16 Jira users then 160 users via a Chrome plugin, one consistent position for hover actions, and indentation instead of category labels (12px chosen over 26px, which truncated items).
- [NN/g — Breadcrumbs: 11 design guidelines](https://www.nngroup.com/articles/breadcrumbs/) — hierarchy not history, current page last and unlinked, skip on sites with only 1–2 levels, no wrapping, and on mobile show only the parent level.
- [Linear](https://linear.app) and the Vercel dashboard (products; Vercel's requires a login) — a full-height sidebar with workspace switcher, Inbox, My issues, Favorites and Teams. A collapsible rail and ⌘K search in the shell, and a quiet top area.
- [WAI-ARIA APG — Breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) — `<nav>` with a label, an ordered list, separators added in CSS so they aren't read, and `aria-current="page"` on the last item.

## Bad references
- [NN/g — Vertical nav](https://www.nngroup.com/articles/vertical-nav/) — sites that duplicate the same menu as a horizontal bar and a hamburger, and centred labels that create a jagged scanning edge.
- [Atlassian's own retrospective](https://www.atlassian.com/blog/design/designing-atlassians-new-navigation) — the 2018 "one identical nav for every product" failed product needs. An audit then found hundreds of custom components and 23 major inconsistencies. Consistency doesn't mean identical.
- [Gatsby — accessible client-side routing study](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) — SPAs that leave focus on the clicked link (or reset it to the top) after a route change disorient screen reader and magnifier users.

## Accessibility
- Landmarks: one `<main>`, and labelled `<nav>`s ("Main", "Breadcrumbs").
- Put a skip link first. Its target is `<main>` or the H1, with `tabindex="-1"` if not focusable.
- `aria-current="page"` on the active sidebar item and the last breadcrumb.
- The collapse toggle is a `<button aria-expanded aria-controls>` with the name "Collapse sidebar".
- Rail tooltips use `interestfor` hints, open on focus and are positioned `inline-end`.
- The tab order follows the visual order: skip link → top bar → sidebar → main. Never use positive `tabindex`.
- At 400% zoom (320px wide), the shell reflows to the drawer pattern with no horizontal scroll (WCAG 1.4.10).

## Motion / interaction (if relevant)
- Sidebar collapse and expand: 200 ms width/translate, ease-out. Main content reflows once at the end, or uses `transition` on the grid's `grid-template-columns`. None under reduced motion.
- The mobile drawer is driven by the finger (scroll-snap), with the backdrop opacity tied to the scroll position.
- Route transitions: a cross-fade of ≤150 ms via View Transitions is optional. Never animate the sidebar on route change.

## Tokens and values
| Token | Default |
|---|---|
| Sidebar width | 256px (range 240–320; resizable 240–50vw) |
| Sidebar rail width | 56–64px |
| Top bar height | 48px (dense) / 56px |
| Sidebar item height | 32–36px; icon 16–20px; label 14px |
| Nested indent | 12px per level, max 2 levels |
| Active item | `nav-active-bg` + 2px `accent` inline-start bar + 600 weight |
| Breadcrumb font | 13–14px, `fg-muted` links, `fg` current |
| Content max width | none for dashboards (fluid), 1200–1440px for reading pages; gutter 24px (16px mobile) |
| Breakpoints | rail <1280px (optional), drawer <1024px |

## Implementation sketch
```html
<a class="skip-link" href="#main">Skip to main content</a>
<div class="shell">
  <nav class="sidebar" aria-label="Main" id="sidebar">
    <ul>
      <li><a href="/portfolio" aria-current="page"><svg aria-hidden="true"></svg><span>Portfolio</span></a></li>
      <li><a href="/screener"><svg aria-hidden="true"></svg><span>Screener</span></a></li>
    </ul>
  </nav>
  <header class="topbar">
    <button type="button" aria-expanded="true" aria-controls="sidebar" aria-label="Collapse sidebar" aria-keyshortcuts="[">⟨</button>
    <!-- search / ⌘K, create, notifications, account -->
  </header>
  <main id="main">
    <nav aria-label="Breadcrumbs" class="breadcrumb">
      <ol><li><a href="/portfolio">Portfolio</a></li><li><a href="/c/aapl">Apple Inc.</a></li>
          <li><a href="/c/aapl/filings/10-k-2026" aria-current="page">10-K 2026</a></li></ol>
    </nav>
    <h1 tabindex="-1">10-K 2026</h1>
  </main>
</div>
```
```css
.shell { display: grid; grid-template: "side top" 48px "side main" 1fr / var(--sidebar-w, 256px) 1fr; block-size: 100dvh; }
.shell:has(#sidebar.is-collapsed) { --sidebar-w: 60px; }
.sidebar { grid-area: side; overflow-y: auto; border-inline-end: 1px solid var(--neutral-border); }
.topbar { grid-area: top; display: flex; align-items: center; gap: 8px; padding-inline: 16px; }
main { grid-area: main; overflow-y: auto; padding: 24px; container-type: inline-size; }
.sidebar a[aria-current="page"] { background: var(--nav-active-bg); font-weight: 600; box-shadow: inset 2px 0 0 var(--accent); }
@media (forced-colors: active) { .sidebar a[aria-current="page"] { border-inline-start: 2px solid CanvasText; } }
.breadcrumb ol { display: flex; gap: 6px; list-style: none; padding: 0; margin: 0 0 4px; white-space: nowrap; overflow: hidden; }
.breadcrumb li + li::before { content: "/" / ""; margin-inline-end: 6px; color: var(--fg-muted); }
@media (max-width: 1023px) { .shell { grid-template: "top" 48px "main" 1fr / 1fr; } .sidebar { display: none; } /* drawer dialog instead */ }
@media (prefers-reduced-motion: no-preference) { .shell { transition: grid-template-columns .2s ease-out; } }
```
```ts
export function onRouteChange(title: string): void {
  document.title = `${title} · App`;
  const h1 = document.querySelector<HTMLHeadingElement>('main h1');
  h1?.focus({ preventScroll: false });
}
```

## Checklist
- [ ] The navigation type matches the IA: a sidebar for >5 or growing sections, a top bar for global actions only.
- [ ] The sidebar has text labels, collapses to a rail with tooltips, and persists its state.
- [ ] The current page is marked with `aria-current` and ≥2 visual cues that survive forced colors.
- [ ] Breadcrumbs appear only for ≥3 levels, show hierarchy, don't wrap, and use CSS-generated separators.
- [ ] Skip link, landmarks and labelled navs are present. Only `main` scrolls.
- [ ] SPA route changes move focus to the H1 and update `document.title`.
- [ ] Below 1024px the shell becomes a drawer. At 320px wide there's no horizontal page scroll.

## Sources
- https://www.nngroup.com/articles/vertical-nav/
- https://www.nngroup.com/articles/breadcrumbs/
- https://www.atlassian.com/blog/design/designing-atlassians-new-navigation
- https://cdn.jsdelivr.net/npm/@atlaskit/navigation-system@7.2.1/constellation/layout/examples.mdx (side nav 320px default, 240px–50vw resize)
- https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
- https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
