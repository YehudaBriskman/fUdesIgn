# Icons and labels

> An icon earns its place by speeding up recognition next to a visible label. Use icon-only controls for a few universally understood actions, from one family, one stroke weight and three sizes tied to the type scale. Every meaningful icon has a name, and no icon is the only carrier of status.

**Category:** Components and interaction · **Applies to:** buttons, toolbars, table row actions, nav items, status badges, empty states, menus · **Priority:** must

## When to use / when not
- Use an icon **with** a visible label for navigation, menu items, domain actions ("Recalculate", "Export CSV") and every status. The label carries the meaning, the icon speeds scanning.
- Use an icon **alone** only for the short list users know from every product: close, search, menu, more (⋯), refresh, copy, settings. Dense chrome (toolbars, row actions) is where this pays off. Button-level rules: `comp-button-hierarchy.md`.
- Don't draw an icon for a concept you can't picture in 5 seconds (NN/g's rule of thumb). Write a word.
- Don't decorate every heading, card title or table header with an icon. It costs width and teaches nothing.

## Rules (do)
- **Label by default.** NN/g: very few icons are universal (home, print, magnifier). Heart and star compete for "like", "save" and "rate". A clock icon for history was never clicked in one study. Keep the label visible: hover-only labels add interaction cost and don't exist on touch.
- **Icon-only controls get two names.** (1) An accessible name: `aria-label="Close"` on the `<button>`, SVG `aria-hidden="true"`. (2) A visible name on hover **and keyboard focus**: a tooltip that follows WCAG 1.4.13 (dismissible with Esc without moving focus, hoverable, persistent). APG: a tooltip never takes focus, and the trigger points to it with `aria-describedby`. Mechanics: `cpover-popover-menu-tooltip.md`. Never rely on native `title` alone: it is neither keyboard- nor touch-reachable.
- **Name the action, not the picture.** WCAG 1.1.1 wants the function ("Refresh data"), not the shape ("circular arrow"). For directional icons name the action ("Back"), not the direction ("Left arrow"), so the name survives mirroring (`rtl-icons-directional.md`).
- **Visible label and accessible name must agree.** WCAG 2.5.3 (Label in Name, level A): the accessible name contains the visible text. "Export" is not named "Download data". Start the name with the visible text. A symbol on an icon (a "B") is not a label.
- **Hide decorative icons.** Text beside the icon already says it: SVG gets `aria-hidden="true"` and `focusable="false"` (Primer requires both; the latter only matters for old IE per Sara Soueidan).
- **A meaningful icon outside a control** gets `role="img"` and a name; better, add visible text.
- **Name the control, not the SVG.** Sara Soueidan: `aria-label` or `aria-labelledby` on the `<svg>` fails in some browser and screen-reader pairs, so label the button (`aria-label`, visually hidden text, or `aria-labelledby`) and hide the icon. Primer instead puts a `<title>` in the SVG for icon-only buttons. House decision: label the control.
- **One family, one stroke weight.** Mixing outline and filled, or 1.5px and 2px strokes, reads as clutter. Allow a **filled** variant for one purpose only: the selected or on state of the same icon (Material Symbols' `FILL` axis, 0 to 1).
- **Match stroke to adjacent text.** Material Symbols has weight (100-700) and optical size (20-48) axes; set `opsz` to the rendered size so stroke stays consistent.
- **Three sizes, tied to the type scale.** Carbon: 16px default, 20/24/32 allowed, 16 and 20 pair with 14 and 16px text, keep sizes consistent, don't change the icon-to-text ratio. House defaults:

  | Text size | Icon | Gap |
  |---|---|---|
  | 12-14px | 16px | 4px inline (chips, badges), 8px in buttons |
  | 16px | 20px | 8px |
  | 20px+, empty states | 24px | 8-12px |

  Gaps stay on the 4px grid (`found-layout-grid-spacing.md`).
- **Centre-align, don't baseline-align** (Carbon): `display: inline-flex; align-items: center`.
- **Icon colour follows text colour** (Carbon). Use `currentColor` for fill or stroke so hover, disabled and dark mode change both together. A status icon takes its role colour from `color-semantic-status.md`.
- **Contrast.** A graphic needed to understand a control needs 3:1 against adjacent colours (WCAG 1.4.11, AA). Exempt: graphics whose same information is in adjacent text, and inactive controls. WCAG's own example: a drop-down arrow beside "Menu" is still required to pass. Carbon asks icons to meet the text ratio (4.5:1). House decision: 4.5:1 for icons that carry meaning alone, 3:1 for the rest, never lower. General ratios: `color-contrast-rules.md`.
- **Status icons are never the only signal.** WCAG 1.4.1: an additional visual indicator is required regardless of contrast ratio. Shape can serve as that cue, but house rule: shape **and** a word ("Failed", "Stale"). Status semantics: `data-verdict-rating-badges.md`.
- **Targets exceed glyphs.** 16px glyph in at least a 24px target (WCAG 2.5.8, AA); house default 32px in dense UI; 44px on coarse pointers (WCAG 2.5.5, AAA; Carbon: 44px minimum, 22px icon in a 48px target as its example). Pad with CSS, never scale the glyph.
- **Prefer inline SVG (or a `<use>` sprite) to an icon font.** SVG takes `currentColor`, follows forced-colors, and can't render as an empty box when a font fails to load. If you use the font, use ligature names (Material's default) and `aria-hidden="true"` on the glyph. Whether screen readers read private-use code points is a tendency, not measured here: test your target reader.
- **Directional icons mirror in RTL; most don't.** Arrows, navigation chevrons, undo/redo flip; clocks, checks, media controls, logos don't. Decide per icon, not per screen: `rtl-icons-directional.md`, `rtl-mirroring-what-flips.md`.

## Anti-patterns (don't)
- Icon-only for a domain action: a bare calculator glyph for "Recalculate DCF".
- Line icons from one set and filled from another, at three stroke widths in one toolbar.
- Green check versus red cross as the only difference between "passed" and "failed" rows.
- `title` as the only name; `aria-label="icon"` or `"Left arrow"`; a name that repeats a visible label so it is announced twice.
- Flipping every SVG under `[dir=rtl]`, which mirrors clocks and checkmarks.

## Good references
- [NN/g - Icon Usability](https://www.nngroup.com/articles/icon-usability/) - few universal icons, ambiguity of heart, star and clock, the 5-second test, labels over hover-only.
- [IBM Carbon - Icons usage](https://carbondesignsystem.com/elements/icons/usage/) - 16/20/24/32 ladder, icon-to-text ratio, centre-align, colour equals text colour, 4.5:1, 44px target with a 22px icon in 48px.
- [Primer - Icons](https://primer.style/product/getting-started/foundations/icons/) - decorative by default with `aria-hidden` and `focusable="false"`; `role="img"` plus `<title>` for meaningful icons.
- [Google Fonts - Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) - weight, optical size 20-48, grade and fill axes; ligature names.
- [Sara Soueidan - Accessible icon buttons](https://www.sarasoueidan.com/blog/accessible-icon-buttons/) - techniques for naming an icon button and why SVG-level labels fail in some pairs.

## Bad references
- [NN/g's usability.gov example](https://www.nngroup.com/articles/icon-usability/) - navigation icons whose labels appeared only on hover on desktop: users had to guess, then hover to confirm.
- [NN/g's mobile hamburger](https://www.nngroup.com/articles/icon-usability/) - an unlabelled icon consuming roughly 20-25% of screen width while saying less than the word "Menu".
- Admin templates that mix three icon packs and use coloured dots for state: nothing names the state (a pattern seen in practice, not a cited source).

## Accessibility
- WCAG: 1.1.1 name or hide; 1.4.1 not colour alone; 1.4.11 3:1; 2.5.3 label in name; 2.5.8 24px targets; 1.4.13 tooltip behaviour. Focus ring: `comp-button-hierarchy.md`.
- Under `forced-colors: active`, SVGs painted with `currentColor` follow the system palette. Don't colour them with hard-coded hex values.
- Keep `aria-label` strings in the localisation catalogue with the visible text: they are not visible content, so page-text translation may miss them (house advice).
- Don't put `aria-label` on a generic `<span>` or `<div>`. It is ignored for roles that cannot be named (MDN).

## Tokens and values
| Token | Default | Notes |
|---|---|---|
| `--icon-sm` / `--icon-md` / `--icon-lg` | 16px / 20px / 24px | Carbon default 16px; house ties size to text |
| `--icon-gap` | 4px inline, 8px in buttons | house default, on the 4px grid |
| `--icon-stroke` | 1.5px at 16–20px, 1.75px at 24px | house default; scale with `opsz`, or `vector-effect: non-scaling-stroke` |
| `--icon-color` | `currentColor` | text role colour |
| Contrast | ≥3:1 (WCAG 1.4.11); 4.5:1 for icon-alone meaning | house decision, Carbon uses 4.5:1 |
| `--icon-target` | 24px min, 32px dense default, 44px coarse | WCAG 2.5.8 / 2.5.5 |
| Tooltip delay | 300-500ms open on hover, 0ms on focus | house default; dismiss with Esc |

## Implementation sketch
```html
<!-- Icon with visible label: the SVG is decoration -->
<button type="button" class="btn">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-download"/></svg>
  <span>Export CSV</span>
</button>

<!-- Icon-only: the button is named, the SVG is hidden, a tooltip shows the name -->
<button type="button" class="btn btn--icon" aria-label="Refresh data" aria-describedby="tip-refresh">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-refresh"/></svg>
</button>
<div id="tip-refresh" role="tooltip" hidden>Refresh data</div>

<!-- Status: shape and word, never colour alone -->
<span class="status status--bad">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
  Failed
</span>
```
```css
:root { --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px; --icon-gap: 8px; }
.icon {
  inline-size: var(--icon-sm); block-size: var(--icon-sm);
  flex: none;
  fill: none; stroke: currentColor; stroke-width: 1.5;
  stroke-linecap: round; stroke-linejoin: round;
}
.btn, .status { display: inline-flex; align-items: center; gap: var(--icon-gap); }
.status { gap: 4px; font-size: 13px; }
.status--bad { color: var(--danger-fg); }
.btn--icon { min-inline-size: 32px; min-block-size: 32px; justify-content: center; }
@media (pointer: coarse) { .btn--icon { min-inline-size: 44px; min-block-size: 44px; } }
:dir(rtl) .icon[data-flip] { scale: -1 1; } /* only icons marked as directional */
@media (forced-colors: active) { .icon { stroke: CanvasText; } }
```
```ts
type IconSize = 'sm' | 'md' | 'lg';
type IconProps =
  | { id: string; size?: IconSize; decorative: true }
  | { id: string; size?: IconSize; decorative?: false; name: string };

const SVG_NS = 'http://www.w3.org/2000/svg';

export function icon(props: IconProps): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('icon');
  if (props.size && props.size !== 'sm') svg.style.setProperty('--icon-sm', `var(--icon-${props.size})`);
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#${props.id}`);
  svg.append(use);
  if (props.decorative) {
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
  } else {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', props.name); // meaningful standalone icon; inside a control, name the control instead
  }
  return svg;
}
```

## Checklist
- [ ] Every non-universal action has a visible text label next to its icon.
- [ ] Every icon-only control has an `aria-label` that names the action and a tooltip on hover and focus (Esc closes it).
- [ ] Decorative SVGs are `aria-hidden="true"`; meaningful standalone icons have a name.
- [ ] One icon family, one stroke weight, and sizes only from 16 / 20 / 24, matched to the adjacent text size.
- [ ] Icons use `currentColor`; meaningful icons pass ≥3:1 (4.5:1 if they stand alone).
- [ ] Every status icon sits next to a word, not only a colour.
- [ ] Directional icons mirror under RTL; clocks, checks and media icons don't.
- [ ] Targets ≥24px, ≥44px on coarse pointers; SVG, not an icon font, unless you've tested it.

## Sources
- https://www.nngroup.com/articles/icon-usability/
- https://carbondesignsystem.com/elements/icons/usage/
- https://primer.style/product/getting-started/foundations/icons/
- https://developers.google.com/fonts/docs/material_symbols
- https://www.sarasoueidan.com/blog/accessible-icon-buttons/
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
- https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label
