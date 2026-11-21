# CSS tooling: `:dir()`, Tailwind logical utilities and the `rtl:` variant

> Reach for logical properties first, `:dir(rtl)` second for the physical leftovers, and the Tailwind `rtl:` variant only for those same leftovers; never maintain a second, flipped stylesheet.

**Category:** Right-to-left layout and bidi · **Applies to:** plain CSS, CSS modules, Tailwind, component libraries, build pipelines, lint · **Priority:** should

## When to use / when not
- Use when setting up a codebase that will ship in an RTL language, or when converting an existing LTR codebase.
- `:dir()` and `rtl:` are for declarations logical properties can't express (gradients, transforms, shadows, polygons, icon mirroring, `background-position`). If you find yourself writing `rtl:mr-4 ltr:ml-4`, use `ms-4` instead.
- Don't use the Tailwind variants in a single-direction product. Tailwind's own docs: "If you're building a site that only needs to support a single direction, you don't need these variants."

## Rules (do)
- **Prefer `:dir(rtl)` over `[dir="rtl"]`.** `:dir()` matches the element's *computed* directionality, so it handles inheritance, `dir="auto"` and LTR islands nested in RTL pages. An ancestor attribute selector `[dir="rtl"] .icon` still matches an icon inside a nested `dir="ltr"` video player. `:dir()` is Baseline widely available since June 2026 (newly available December 2023: Chrome and Edge 120, Firefox 49, Safari 16.4).
- **Tailwind logical utilities** (v3.3 added them; v4 extends them):

  | Need | Tailwind | CSS |
  |---|---|---|
  | margin start / end | `ms-4` / `me-4` | `margin-inline-start/end` |
  | padding start / end | `ps-4` / `pe-4` | `padding-inline-start/end` |
  | both inline sides | `mx-4` / `px-4` | `margin-inline` / `padding-inline` (v4) |
  | inset start / end | `start-0` / `end-0` | `inset-inline-start/end` |
  | border start / end | `border-s` / `border-e` | `border-inline-start/end-width` |
  | radius on start side | `rounded-s-lg`, `rounded-ss-lg`, `rounded-ee-lg` | `border-start-start-radius` … |
  | text alignment | `text-start` / `text-end` | `text-align: start/end` |
  | child spacing | `space-x-4` | `margin-inline-start/end` in v4 (physical in v3, needing `rtl:space-x-reverse`) |
  | scroll margins | `scroll-ms-4` / `scroll-ps-4` | `scroll-margin-inline-start` … |

- **The `rtl:`/`ltr:` variants** compile (Tailwind v4) to `&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)`, zero specificity. Use them for:
  - icon mirroring: `rtl:-scale-x-100`;
  - gradients: `bg-linear-to-r rtl:bg-linear-to-l`;
  - transforms and translate-based drawers: `-translate-x-full rtl:translate-x-full`;
  - shadows with horizontal offset.
- **Lint physical properties.** `stylelint-use-logical` (or the `liberty/use-logical-spec` rule) flags `margin-left` and friends in CSS; for Tailwind, an ESLint rule or a grep in CI for `\b(ml|mr|pl|pr|left|right|text-left|text-right|rounded-l|rounded-r|border-l|border-r)-` in class strings. Allow-list intentional cases with a comment.
- **Bidi-aware build tools are a migration aid, not an architecture.** RTLCSS (and Bootstrap 5's RTL build that uses it) generates a flipped stylesheet; it needs `/*rtl:ignore*/` for every do-not-mirror case (media, charts, logos). New code should not need it.
- **Component libraries**: check that the library uses logical properties (Radix primitives take a `DirectionProvider`; MUI needs `direction: "rtl"` in the theme plus an RTL Emotion cache with `stylis-plugin-rtl`; Bootstrap 5 ships `bootstrap.rtl.css`). Pass the direction from one place.
- **`unicode-bidi` and `direction` in CSS** are for things markup can't reach (generated content, SVG text, a component that must stay LTR even if someone forgets `dir`). Pair them: `direction: ltr; unicode-bidi: isolate`. Base direction itself still comes from the `dir` attribute (see `rtl-dir-attribute-and-auto.md`).

## Anti-patterns (don't)
- `rtl:mr-4 ltr:ml-4` (and the v3 habit `ml-4 rtl:ml-0 rtl:mr-4`): use `ms-4`.
- A hand-maintained `app.rtl.css` with hundreds of overrides.
- `[dir=rtl] *` selectors with high specificity that fight component styles.
- Flipping the whole page with RTLCSS and no ignore directives.
- `:dir(rtl)` rules for things that are already logical (`:dir(rtl) .x { margin-inline-start: … }`).

## Good references
- [MDN, `:dir()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:dir) — computed directionality, nested `dir`, `dir="auto"`, and the difference from attribute selectors.
- [Tailwind CSS, RTL support](https://tailwindcss.com/docs/hover-focus-and-other-states) — the `rtl`/`ltr` variants and their generated selector.
- [Tailwind CSS, margin](https://tailwindcss.com/docs/margin) — `ms-*`/`me-*`, logical `mx-*`, and `space-x-*` on inline logical properties.
- [Tailwind CSS v3.3 release notes](https://tailwindcss.com/blog/tailwindcss-v3-3) — the introduction of logical-property utilities.
- [Firefox RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) — `:dir()` and logical properties in a large shipped codebase.
- [modern-web-guidance, tabs.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/tabs.md) — a worked `:dir(rtl)` override for physical gradient masks.

## Bad references
- [Bootstrap 5 RTL docs](https://getbootstrap.com/docs/5.3/getting-started/rtl/) — a separate compiled RTL stylesheet (via RTLCSS); workable for Bootstrap sites, but it shows the cost of not being logical from the start (two builds, ignore directives).
- Tailwind v3 projects that used `space-x-*` in RTL without `rtl:space-x-reverse`: the gap lands on the wrong side of every child until upgraded to v4's logical `space-x`.

## Accessibility
- Tooling changes presentation only. The DOM order and `dir`/`lang` attributes still carry meaning for assistive technology.
- Specificity wars from `[dir=rtl]` overrides commonly break focus styles; `:where()`-based variants (as Tailwind's) avoid that.

## Motion / interaction (if relevant)
- Animations with physical offsets (`translate-x`, `@keyframes` with `left`) need `rtl:` or a `--dir` multiplier; see `rtl-logical-properties.md`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Direction selector | `:dir(rtl)` | physical leftovers in CSS |
| Tailwind variant | `rtl:` → `&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)` | physical leftovers in Tailwind |
| Logical utilities | `ms- me- ps- pe- start- end- border-s border-e rounded-s rounded-e text-start text-end` | everything else |
| Island | `direction: ltr; unicode-bidi: isolate` | components that must stay LTR |
| Lint | `stylelint-use-logical`, CI grep for physical Tailwind classes | CI |

## Implementation sketch
```css
/* attribute selectors leak into LTR islands; :dir() does not */
[dir="rtl"] .icon-leaky { scale: -1 1; } /* also flips icons inside a nested dir="ltr" player */
.icon[data-rtl="mirror"]:dir(rtl) { scale: -1 1; } /* only where the computed direction is rtl */

.toolbar { display: flex; gap: var(--space-2, 8px); padding-inline: var(--space-4, 16px); }
.toolbar__end { margin-inline-start: auto; }
.fade-end {
  background-image: linear-gradient(to right, transparent, var(--surface, #fff));
}
.fade-end:dir(rtl) {
  background-image: linear-gradient(to left, transparent, var(--surface, #fff));
}
```
```tsx
// Tailwind: logical utilities by default, rtl: only for the physical leftovers.
export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div role="status" className="fixed bottom-4 end-4 flex items-center gap-3 rounded-lg border-s-4 border-s-sky-600 bg-white ps-4 pe-2 py-3 shadow-lg">
      <p className="text-start">{message}</p>
      <button type="button" onClick={onClose} aria-label="סגירה" className="ms-auto rounded-md p-1">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden className="rtl:-scale-x-100">
          <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth={2} />
        </svg>
      </button>
    </div>
  );
}
```
```ts
// CI guard for physical Tailwind classes in source files.
const PHYSICAL_TW = /(?:^|[\s"'`])(?:-?m[lr]|p[lr]|left|right|text-left|text-right|rounded-[lr]|border-[lr]|float-left|float-right)(?:-[\w./[\]]+)?(?=$|[\s"'`])/g;

export function physicalTailwindClasses(source: string): string[] {
  return [...source.matchAll(PHYSICAL_TW)].map((m) => m[0].trim());
}
```

## Checklist
- [ ] Physical-only declarations use `:dir(rtl)` (or Tailwind `rtl:`), never `[dir=rtl] *` ancestor selectors.
- [ ] No `rtl:`/`ltr:` pair that a logical utility could replace.
- [ ] Tailwind is v3.3+ (logical utilities) and, ideally, v4 (logical `space-x`, `mx`, `px`).
- [ ] Lint or CI flags physical properties and classes.
- [ ] Component libraries receive the direction from one provider.
- [ ] No generated or hand-written flipped stylesheet in new code.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/:dir
- https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi
- https://tailwindcss.com/docs/hover-focus-and-other-states
- https://tailwindcss.com/docs/margin
- https://tailwindcss.com/blog/tailwindcss-v3-3
- https://getbootstrap.com/docs/5.3/getting-started/rtl/
- https://rtlcss.com/learn/usage-guide/control-directives/
- https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/css/css.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/tabs.md
