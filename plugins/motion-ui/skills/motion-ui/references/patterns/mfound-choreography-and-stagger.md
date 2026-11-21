# Choreography, sequencing and stagger

> When several things change at once, lead with the element the user acted on, let dependents follow, and keep the sequence short: stagger 20–40 ms per item and cap the total offset at 300 ms (150 ms inside menus and popovers), so long lists arrive together, and never stagger on repeat visits or keyboard actions.

**Category:** Motion foundations · **Applies to:** lists and grids entering, menus with items, dialogs with backdrop and content, route changes with header and body, multi-element state changes · **Priority:** should

## When to use / when not
Use when a single cause changes more than one element: a dialog (backdrop and panel), a menu (container and items), a page (shell stays, content changes), a list that loads. Skip staggering for content the user has already seen in this session, for any keyboard-triggered change, and for long lists where the tail would arrive after the user has started reading.

## Rules (do)
- **Lead with the cause.** The thing the user touched responds first (press state, then the menu it opens). Dependent elements follow, never precede.
- **Parent before children.** A container appears (or starts appearing) before its contents; contents leave before or with their container, never after.
- **Shared elements don't fade.** If an element persists across the change (a header, an avatar that moves into a detail page), it moves or stays; only what is new fades in. See `mtrans-view-transitions-and-routes.md`.
- **Stagger small, cap total.** 20–40 ms between items. Cap the total offset at 300 ms for lists and grids (the same cap as dashboard-ui's `--motion-stagger` rule) and at 150 ms inside menus and popovers, which are opened tens of times a day. With 30 ms steps, only the first 10 list items (5 menu items) are offset; the rest arrive together.
- **Overlap, don't queue.** Item n + 1 starts while n is still moving. A queue of finished-then-start steps multiplies wait time.
- **One direction of travel.** Items in a sequence move the same way (all up 8 px, or all from the trigger side). Mixed directions read as noise.
- **Exits are simultaneous.** Stagger the arrival, not the departure; on close, everything leaves together in the exit duration.
- **Background recedes when foreground arrives.** A modal dims and slightly recedes what's behind it at the same time as it enters (the backdrop shares the panel's duration with a `linear` curve). Apple's sheets push the parent back; on the web, a scale of about 0.98 or a dim is enough.
- **First visit only.** Choreographed entrances run once per session per view. Returning to a view shows its final state at once.
- **Keep it optional.** Every choreographed element must render correctly if its animation never runs (reduced motion, old browser, `display: none` toggles).

## Anti-patterns (don't)
- A 50-item list with 50 ms stagger: the last row arrives 2.5 s later.
- The content of a dialog animating in before the dialog surface.
- Staggered exits, so the screen takes longer to clear than to fill.
- Header, sidebar and content all sliding in from different directions on each route change.
- Replaying the entrance sequence when the user comes back with the browser's back button.
- Two unrelated regions animating at the same moment with different curves.

## Good references
- [Material 3, motion transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns): container transform, shared axis and fade-through, each defining what persists, what leaves and what enters.
- [Emil Kowalski, Sonner toasts](https://sonner.emilkowal.ski/): stacked toasts offset and scaled as a group so the newest leads, older ones recede.
- [Apple HIG, motion](https://developer.apple.com/design/human-interface-guidelines/motion): motion should feel connected to what the user did and not get in the way.
- [Motion `stagger()` docs](https://motion.dev/docs/stagger): stagger with a start offset and `from` origin, so the item nearest the trigger leads.
- [Carbon motion choreography](https://carbondesignsystem.com/elements/motion/choreography/): sequencing related elements, and keeping motion of one region coherent.

## Bad references
- Portfolio and landing templates that stagger every card on scroll by 100 ms or more: a grid of 12 takes over a second to settle on every visit.
- Admin templates where the sidebar, top bar and content each animate in on every navigation, so nothing feels stable.

## Accessibility
- Under reduced motion, drop the stagger and the travel; keep a single short fade for the group, or none.
- Don't move focus into content that is still animating in; move focus when the container is ready (it may still be fading).
- Large staggered sweeps across the viewport are a vestibular trigger; keep travel at ≤ 16 px per item.

## Motion / interaction (if relevant)
If the user interrupts (closes the dialog while its items are still arriving), everything retargets to the exit at once; pending staggered starts are cancelled, not played.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--motion-stagger` | 30 ms | delay between items (band 20–40 ms) |
| `--motion-stagger-max` | 300 ms | cap on total offset for lists and grids |
| `--motion-stagger-max-menu` | 150 ms | cap inside menus and popovers |
| `--motion-distance-sm` | 8 px | per-item travel on entry |
| backdrop | same duration as panel, `linear` | scrim fade |
| parent recede | scale 0.98 or dim | background under a modal |

## Implementation sketch
```css
.menu-item {
  opacity: 1;
  translate: 0 0;
  transition:
    opacity var(--motion-dur-short) linear,
    translate var(--motion-dur-short) var(--motion-ease-enter);
  /* --i is set per item; delay is capped so long lists arrive together */
  transition-delay: min(calc(var(--i, 0) * var(--motion-stagger)), var(--motion-stagger-max-menu));
}
@starting-style {
  .menu-item { opacity: 0; translate: 0 var(--motion-distance-sm); }
}
@media (prefers-reduced-motion: reduce) {
  .menu-item { transition-delay: 0ms; translate: none; }
}
```
```ts
// Run the entrance once per view per session.
const seen = new Set<string>();

export function shouldChoreograph(viewKey: string): boolean {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (seen.has(viewKey)) return false;
  seen.add(viewKey);
  return true;
}

export function staggerDelay(index: number, stepMs = 30, capMs = 300): number {
  return Math.min(index * stepMs, capMs);
}
```

## Checklist
- [ ] The element the user acted on responds first.
- [ ] Containers enter before their children and leave with or after them.
- [ ] Stagger step 20–40 ms; total offset ≤ 300 ms (≤ 150 ms in menus).
- [ ] Exits are not staggered.
- [ ] Entrance choreography runs once per view per session, never on back/forward.
- [ ] Everything renders correctly with no animation.

## Sources
- https://m3.material.io/styles/motion/transitions/transition-patterns
- https://carbondesignsystem.com/elements/motion/choreography/
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://motion.dev/docs/stagger
- https://sonner.emilkowal.ski/
- https://www.nngroup.com/articles/animation-duration/
- https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
