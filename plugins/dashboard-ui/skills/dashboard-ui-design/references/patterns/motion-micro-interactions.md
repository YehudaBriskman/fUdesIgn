# Micro-interactions: hover, press, selection and toggles

> Every interactive element gets distinct rest, hover, pressed, focus-visible, selected and disabled states. Respond in the next frame (≤ 100 ms visual change), animate state with colour/opacity in 100 ms (`--motion-dur-micro`), and keep motion to a 0.97–0.98 press scale at most.

**Category:** Motion · **Applies to:** buttons, icon buttons, table rows, chart marks, chips/filters, segmented controls, switches, checkboxes, tabs, sortable headers · **Priority:** must

## When to use / when not
Related: button variants in `comp-button-hierarchy.md`; focus and contrast values in `color-contrast-rules.md`; table row interaction in `data-table-interaction.md`.

Always: every pointer- or keyboard-operable element needs visible state feedback. Without it, users repeat clicks and assume failure (NN/g progress indicators: "Always give some type of immediate feedback").
Be restrained:
- Dense tables and charts: hover is a background tint or crosshair, never a lift or shadow per row.
- High-frequency controls (row selection, filter chips) animate colour only, in 100 ms or less.
- No hover-only affordances on touch (`@media (hover: none)`).

## Rules (do)
- **Response time:** the state change paints in the next frame. INP "good" is ≤ 200 ms at p75 (web.dev), but visual feedback should land within 100 ms and the handler within 50 ms (RAIL: "process user input events within 50 ms").
- **State layers:** overlay the current colour at fixed opacities rather than inventing a new colour per state. M3 values: hover 8%, focus 12%, pressed 12%, dragged 16%.
- **Contrast:** `:hover`, `:active` and `:focus-visible` have more contrast than rest (Vercel). The focus ring is ≥ 3:1 against adjacent colours (WCAG 1.4.11), 2 px, offset 2–3 px.
- **Distinct, composable states:** hover = tint, press = tint + scale 0.97, focus = outline, selected = fill + check icon or weight. Any combination stays legible.
- **Durations (tokens):** colour/tint and press scale both use `--motion-dur-micro` 100 ms; press uses `--motion-ease-enter`. Carbon's own values here are 70 ms (`fast-01`, "buttons and toggles") and 110 ms (`fast-02`, fades); we round to the one 100 ms token. Release returns at the same speed.
- **Toggle/switch knob:** translate `--motion-dur-short` 150 ms with `--motion-ease-standard`. The state must also be shown by fill colour and label, not knob position alone.
- **Selection in charts:** the selected mark keeps full opacity; others drop to 0.3 opacity (the same value as `motion-linked-exploration.md`). Transition opacity over `--motion-dur-micro` 100 ms. Never resize marks on hover (it changes the encoded value).
- **Tooltip delay:** "Delay the first tooltip in a group; subsequent peers have no delay" (Vercel). Vercel gives no number; use about 200 ms to open and 100 ms to close (house values).
- **Hit targets:** ≥ 24 × 24 CSS px (WCAG 2.5.8); 44 px on touch. Expand small icon buttons with padding or pseudo-elements, not visual size.
- **Cursor:** `pointer` for links/actions; `default` for selectable rows if you follow the platform; `grab`/`grabbing` for pan; `ew-resize` for column resizers.
- **Loading buttons:** "Show a loading indicator & keep the original label" (Vercel), and block re-submission while the request is in flight (Vercel's forms rule disables submit during the request; SKILL.md prefers `aria-disabled` so focus stays put, see `comp-button-hierarchy.md`). Vercel: "add a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)" for the spinner (see `prog-loading-states.md`).

## Anti-patterns (don't)
- Hover lifts (translateY −4 px + big shadow) on every dashboard card. Constant motion as the pointer crosses the grid, and it suggests clickability where there is none.
- Scaling a bar or point on hover. Size encodes data.
- Removing `outline` with no replacement.
- Hover-revealed row actions that are invisible to keyboard and touch users.
- Ripple animations of 300–600 ms on dense table rows. Slow and noisy at high frequency.
- `transition: all` on buttons, which animates layout and shadow on theme switch too.
- Checkbox or switch animations longer than 150 ms (`--motion-dur-short`), which feel laggy for a binary action.

## Good references
- [IBM Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/): `duration-fast-01` 70 ms is for "micro-interactions such as buttons and toggles", `fast-02` 110 ms for fades.
- [Material 3 state tokens (material-web)](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss): systematic state layer opacities (0.08/0.12/0.12/0.16) that work in any colour or theme.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): "`:hover`, `:active`, `:focus` have more contrast than rest state"; hit areas expanded to at least 24 px ("On mobile, the minimum size is 44px"); delayed first tooltip with instant peers; loading buttons keep their label.
- [Grafana dashboard settings, Graph tooltip](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/): with "Shared crosshair", hovering one graph panel shows the crosshair on all other graph panels. Hover feedback that carries analytical meaning across a dashboard.

## Bad references
- Material 2-era ripple effects reused in data tables: the 300+ ms radial ripple on every row click is decorative at high frequency. NN/g says simple feedback should be "roughly 100 ms" ([NN/g](https://www.nngroup.com/articles/animation-duration/)).
- Card kits with hover lift and glow on static KPI tiles (common on dashboard template marketplaces). They imply that non-interactive tiles are interactive and add constant motion.

## Accessibility
- `:focus-visible` ring ≥ 3:1 contrast and never removed.
- Native semantics: `<button>`, `aria-pressed` for toggle buttons, `aria-selected` in tabs and listboxes. For switches, `<input type="checkbox" switch>` renders as a switch only in Safari 17.4+ (not Baseline; Chrome and Firefox show a plain checkbox, which still works). For a switch look everywhere, use `<button role="switch" aria-checked="true|false">`.
- Selected state must not rely on colour alone: add a check icon, weight or underline.
- Hover-revealed content must be dismissable (`Esc`), hoverable and persistent (WCAG 1.4.13).
- Under reduced motion, keep colour transitions and drop scale/translate.

## Motion / interaction (if relevant)
- Press feedback appears on `pointerdown`, not `click`, so it shows within the first frame.
- Don't animate on keyboard-driven focus moves in grids (arrow keys). The ring jumps instantly.

## Tokens and values
| Token | Value |
|---|---|
| `--state-hover-opacity` | 0.08 |
| `--state-focus-opacity` | 0.12 |
| `--state-pressed-opacity` | 0.12 |
| `--state-dragged-opacity` | 0.16 |
| state colour/tint | `--motion-dur-micro` 100 ms, `linear` |
| `--motion-press-scale` | 0.97 (0.98 for large surfaces; motion-ui token) |
| press | `--motion-dur-micro` 100 ms, `--motion-ease-enter` |
| switch knob | `--motion-dur-short` 150 ms, `--motion-ease-standard` |
| focus ring | `--focus-ring` colour, 2 px solid, offset 2 px, ≥ 3:1 |
| tooltip delay start / end | 200 ms / 100 ms; peers 0 ms (house values) |

Earlier versions of this file used 120 ms for press and switch; they now use the shared 100/150 ms tokens.
| non-selected mark opacity | 0.3 |
| min target | 24 px (pointer), 44 px (touch) |

## Implementation sketch
```css
/* Uses the role and motion tokens from assets/tokens.css */
.btn {
  position: relative;
  background: var(--surface);
  transition: background-color var(--motion-dur-micro) linear;
}
.btn::after { /* state layer */
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: currentColor; opacity: 0; transition: opacity var(--motion-dur-micro) linear;
  pointer-events: none;
}
.btn:hover::after { opacity: 0.08; }
.btn:active::after { opacity: 0.12; }
.btn:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }

@media (prefers-reduced-motion: no-preference) {
  .btn { transition: background-color var(--motion-dur-micro) linear, scale var(--motion-dur-micro) var(--motion-ease-enter); }
  .btn:active { scale: 0.97; }
}

/* Chart selection: dim the others, never resize */
.chart:has(.mark[aria-selected="true"]) .mark:not([aria-selected="true"]) { opacity: 0.3; }
.mark { transition: opacity var(--motion-dur-micro) linear; }

/* Row actions: visible on hover, focus-within, and on touch */
.row .actions { opacity: 0; transition: opacity var(--motion-dur-micro) linear; }
.row:is(:hover, :focus-within) .actions { opacity: 1; }
@media (hover: none) { .row .actions { opacity: 1; } }

input[type="checkbox"][switch] { accent-color: var(--accent); }
```

## Checklist
- [ ] Rest, hover, pressed, focus-visible, selected and disabled are visually distinct and compose.
- [ ] First visual response within 100 ms; handlers ≤ 50 ms.
- [ ] Focus ring ≥ 3:1 and never removed.
- [ ] State transitions use 100 ms (colour, press) or 150 ms (switch knob); press scale ≥ 0.97; no ripple on dense rows.
- [ ] Data marks never change size on hover or selection.
- [ ] Hover-only affordances also appear on focus and on touch.
- [ ] Targets ≥ 24 px (44 px touch).

## Sources
- https://carbondesignsystem.com/elements/motion/overview/
- https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss
- https://vercel.com/design/guidelines
- https://www.nngroup.com/articles/animation-duration/
- https://www.nngroup.com/articles/progress-indicators/
- https://web.dev/articles/rail
- https://web.dev/articles/inp
- https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/modify-dashboard-settings/
- https://emilkowal.ski/ui/you-dont-need-animations
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/ARIA/apg/patterns/switch/
