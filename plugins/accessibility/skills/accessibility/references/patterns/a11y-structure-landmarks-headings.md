# Structure: landmarks, headings, titles, language and skip links

> Give every page one `<main>`, a labelled `<nav>` per navigation block, one `<h1>` and a heading outline with no skipped levels, a unique front-loaded `<title>` that changes on every route, `lang` on `<html>` and on foreign-language parts, and a skip link as the first focusable element.

**Category:** Build · **Applies to:** page shells, app shells, SPA routes, dialogs, embedded iframes, every UI type · **Priority:** must

## When to use / when not
- **Always**, before styling. Structure is what screen-reader users navigate by (headings first, then landmarks), so it decides whether the rest of the page is findable.
- **App shells** (sidebar + content, dashboards): same rules; the sidebar is `<nav aria-label="…">`, the content is `<main>`. dashboard-ui `comp-app-shell-navigation.md` owns the layout.
- **Marketing pages** add their own floor (hero h1, section headings, footer): marketing-ui `mkfound-accessibility-floor.md` and `mkperf-seo-headings-and-metadata.md`.
- **Not** a licence to add `role="region"` to every section: too many landmarks dilute them.

## Rules (do)
- **Landmarks (1.3.1):** `<header>` (banner, once at the top level), `<nav>`, `<main>` (exactly one, not nested in another landmark), `<aside>` (complementary), `<footer>` (contentinfo, once at the top level), `<search>` or `<form role="search">` for site search. All visible content sits inside a landmark.
- **Label duplicates:** two or more `<nav>` elements each get a distinct `aria-label` ("Primary", "Breadcrumb", "Pagination"). Never put the role word in the label ("Primary navigation" is read as "Primary navigation navigation").
- **Headings (1.3.1, 2.4.6):** one `<h1>` naming the page's purpose; levels nest without skipping (h2 → h4 is a failure of meaning, not of a criterion, but it breaks the outline). Headings describe their section. Never fake a heading with bold text, and never use a heading tag for size.
- **Dialogs** may start with their own `<h1>` or `<h2>`; they are a separate context.
- **Page title (2.4.2):** unique per page, specific part first: "Invoices · Acme Billing". On SPA route changes, update `document.title` and move focus to the new `<h1>` (dashboard-ui `comp-keyboard-shortcuts-focus.md` cites the user study behind this). After a failed form submit, prefix "Error: " (forms-ui `fvalid-error-summary-and-focus.md`).
- **Language (3.1.1, 3.1.2):** `<html lang="en">` (or `he`, `ar`, … with `dir="rtl"`); wrap other-language phrases in `lang`. A wrong `lang` makes screen readers mispronounce the whole page.
- **Bypass blocks (2.4.1):** a "Skip to main content" link is the first focusable element, visible on focus, pointing at `<main id="main" tabindex="-1">`. Landmarks also satisfy 2.4.1 for screen-reader users, but sighted keyboard users need the link.
- **Reading order (1.3.2):** DOM order matches visual order. CSS `order`, `flex-direction: row-reverse`, `grid-area` placement and absolute positioning must not reorder meaning; the `reading-flow` property is not yet cross-browser, so don't rely on it.
- **Multiple ways (2.4.5):** a site with more than one page offers two of: navigation, search, sitemap, links between related pages (process steps are exempt).
- **Consistent navigation (3.2.3):** repeated nav blocks keep the same relative order on every page.
- **Lists and tables:** groups of links are `<ul>`; data tables use `<th scope>` and `<caption>`. If CSS `list-style: none` removes list semantics in Safari, restore with `role="list"` (the one redundant role worth adding).
- **Iframes:** every `<iframe>` has a `title` describing its content.

## Anti-patterns (don't)
- `<div class="header">` and `<div id="content">` with no landmark elements.
- Two `<main>` elements, or `<main>` inside `<aside>`.
- A logo `<h1>` on every page and the real page title as `<h2>`.
- Headings chosen for font size (an `<h4>` because it "looks right").
- SPA routes that keep the first page's `<title>` and leave focus on the clicked link.
- Skip links that point at an element with no `id`, or that stay off-screen when focused.
- `lang="en"` on a Hebrew or Arabic page from a template default.

## Good references
- [GOV.UK Design System — Skip link](https://design-system.service.gov.uk/components/skip-link/) — first element, visible on focus, targets `main`, tested with assistive tech.
- [W3C WAI — Page Structure tutorial](https://www.w3.org/WAI/tutorials/page-structure/) — regions, labelling, headings, content structure with examples.
- [W3C WAI-ARIA APG — Landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — which HTML element maps to which landmark and when labels are needed.
- [modern-web-guidance — Accessibility §1 and §4](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#1-content-navigability-and-structure) — landmarks, heading rules, titles, language and iframe titles, each tied to a criterion.

## Bad references
- [W3C WAI — Before and After demo, inaccessible home page](https://www.w3.org/WAI/demos/bad/before/home.html) — layout tables, no headings, no skip link, deliberately broken for teaching.
- SPA starter templates whose router never updates `document.title`: every tab in the browser reads the same name.

## Accessibility
- Verify with a screen reader's headings and landmarks lists (VoiceOver rotor, NVDA Elements List; `atest-screen-reader-cheatsheets.md`) and with the browser's accessibility tree.

## Motion / interaction (if relevant)
- The skip link appears without movement under reduced motion (`assets/a11y.css`). Scrolling to the skip target is instant, not smooth, when the user prefers reduced motion.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `<main>` per page | 1 | Landmark |
| `<h1>` per page | 1 (dialogs may add their own) | Outline root |
| Skip link | first focusable, visible on focus | 2.4.1 |
| Title pattern | `Specific · Site` | 2.4.2 |
| `.skip-link` | `assets/a11y.css` | Styles |

## Implementation sketch
SPA route change: title, focus and announcement in one place.
```ts
export function onRouteChange(pageTitle: string, siteName: string): void {
  document.title = `${pageTitle} · ${siteName}`
  const h1 = document.querySelector<HTMLHeadingElement>('main h1')
  if (!h1) return
  if (!h1.hasAttribute('tabindex')) h1.tabIndex = -1
  h1.focus({ preventScroll: false })
}
```
```css
.skip-link:focus-visible { transform: none; }
main:focus { outline: none; }
```
The shell (HTML): `<a class="skip-link" href="#main">Skip to main content</a>` first in `<body>`, then `<header>`, `<nav aria-label="Primary">`, `<main id="main" tabindex="-1"><h1>…</h1></main>`, `<footer>`.

## Checklist
- [ ] Exactly one `<main>`; every visible block is inside a landmark.
- [ ] Repeated `<nav>`s have distinct labels without the word "navigation".
- [ ] One `<h1>`; heading levels never skip; no fake headings.
- [ ] `<title>` is unique, front-loaded and updates on every route.
- [ ] `lang` is correct on `<html>` and on foreign phrases; RTL pages set `dir`.
- [ ] Skip link is first, visible on focus and lands in `<main>`.
- [ ] Visual order matches DOM order at every breakpoint.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html
- https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html
- https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html
- https://www.w3.org/WAI/tutorials/page-structure/
- https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- https://design-system.service.gov.uk/components/skip-link/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
