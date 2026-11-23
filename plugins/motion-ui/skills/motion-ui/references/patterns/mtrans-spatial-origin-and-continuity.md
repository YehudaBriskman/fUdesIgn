# Spatial origin and continuity

> Things come from where they live and go back the same way: set `transform-origin` to the trigger side for menus and popovers, open detail views out of the item that was tapped, keep enter and exit paths mirror images, and keep navigation directions consistent (forward moves in from the trailing edge, back from the leading edge).

**Category:** Transitions · **Applies to:** popovers, menus, tooltips, select lists, cards expanding to detail, navigation stacks, tabs, side panels · **Priority:** should

## When to use / when not
Use whenever an element appears in relation to something else. A centred modal with no specific trigger scales from the centre. Content that replaces unrelated content (a new search result set) has no spatial relationship: cross-fade it. When a straight path is wrong because the user should follow a moving object, see `mtrans-arc-paths-and-mask-reveals.md`.

## Rules (do)
- **Origin at the trigger.** A menu below-left of its button scales from `top left`; one that flipped above scales from `bottom left`. Emil Kowalski: popovers should scale from their trigger, not from their centre. Radix exposes this as `--radix-popover-content-transform-origin`; with CSS anchor positioning, set the origin per fallback position yourself (there is no automatic hook yet; anchored container queries that can detect the flip are Chrome-only and experimental).
- **Detail opens out of its item.** A card expanding to a detail view morphs from the card's rectangle (a shared-element View Transition or Motion `layoutId`) (reuse one `layoutId` on the card and the detail element so the library animates between them; the platform equivalent is one unique `view-transition-name`, see `mtrans-view-transitions-and-routes.md`), and collapses back into it on close. M3 calls this the *container transform*.
- **Mirror paths.** Exit reverses the entrance path. A drawer that slid in from the right leaves to the right; a toast that rose from the bottom drops back down.
- **Consistent direction.**
  - Forward in a hierarchy: new view enters from the trailing edge (right in LTR), the old one shifts toward the leading edge.
  - Back: the reverse.
  - Siblings (tabs): new content enters from the side of the newly selected tab (going from tab 3 to tab 1, it enters from the left).
  - In RTL, mirror all of these.
- **Keep the travel short.** Directional hints need 16–24 px of travel plus a fade, not a full-width slide (see dashboard-ui's `motion-view-transitions.md`).
- **Persistent elements stay put.** Navigation chrome, headers and the app shell don't animate on route changes; only the changing content does.
- **Use M3's three relationships** to decide: container transform (one element becomes another), shared axis (siblings or steps along x, y or z), fade through (unrelated content).

## Anti-patterns (don't)
- Popovers scaling from their own centre, so a menu under a button seems to grow out of mid-air.
- A detail page that slides in from the right after tapping a card in the middle of the grid.
- Back navigation that animates in the same direction as forward.
- Exits that take a different path from the entrance (fade in, slide out sideways).
- Full-screen horizontal slides for tabs on desktop.

## Good references
- [Material 3, transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns): container transform, shared axis, fade through, and when each applies.
- [Emil Kowalski, 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): origin-aware popovers, never from `scale(0)`.
- [Radix popover](https://www.radix-ui.com/primitives/docs/components/popover): `--radix-popover-content-transform-origin` computed from the trigger and side.
- [Rauno Freiberg, Invisible details of interaction design](https://rauno.me/craft/interaction-design): spatial consistency, an app opening from its icon.
- [Apple HIG, motion](https://developer.apple.com/design/human-interface-guidelines/motion): motion that reflects where things are and how they relate.
- [Chrome for Developers, anchored container queries](https://developer.chrome.com/blog/anchored-container-queries): detecting the applied fallback (Chrome-only), which is what an automatic origin flip needs.

## Bad references
- Many dropdown components in older UI kits use `transform-origin: center` with a scale entrance, so menus appear to pop out of their own middle.
- Single-page apps that apply the same slide-left animation to every route change, including "back".

## Accessibility
- Direction must not be the only way to tell forward from back; titles and breadcrumbs do that job.
- Under reduced motion, keep the origin but drop the scale and travel (fade only).

## Motion / interaction (if relevant)
An expanding card is interruptible: closing it mid-expansion collapses it back from its current size (`mgesture-interruptibility-and-velocity.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--popover-origin` | side nearest the trigger | per placement |
| directional travel | 16–24 px + fade | route and tab changes |
| container transform | `--motion-dur-long` 400 ms, `--motion-ease-emphasized` (house timing; M3's container-transform default is 300 ms) | card → detail |
| shared axis | `--motion-dur-medium` 240 ms | siblings, steps |
| fade through | `--motion-dur-short` 150 ms, `linear` | unrelated content |

## Implementation sketch
```css
.menu { position-anchor: --menu-trigger; position-area: bottom span-right; position-try-fallbacks: flip-block; transform-origin: top left; }

/* When the menu flips above its trigger, flip the origin too. Set data-placement from JS (below),
   or, in Chrome only, from an anchored container query (@container anchored(fallback: flip-block)). */
.menu[data-placement^="top"] { transform-origin: bottom left; }
```
```ts
// Without anchor positioning: compute the origin from where the popover ended up.
export function originFor(trigger: DOMRect, popover: DOMRect): string {
  const vertical = popover.top >= trigger.bottom - 1 ? 'top' : 'bottom';
  const horizontal = popover.left >= trigger.left - 1 ? 'left' : 'right';
  return `${vertical} ${horizontal}`;
}

export function placeOrigin(trigger: HTMLElement, popover: HTMLElement): void {
  popover.style.setProperty('--popover-origin', originFor(trigger.getBoundingClientRect(), popover.getBoundingClientRect()));
}
```

## Checklist
- [ ] Popovers and menus scale from the side nearest their trigger, including after a flip.
- [ ] Detail views open out of, and close back into, the item that opened them.
- [ ] Exits mirror entrances.
- [ ] Forward and back move in opposite directions; RTL mirrors them.
- [ ] Persistent chrome doesn't animate on navigation.
- [ ] Unrelated content cross-fades instead of sliding.

## Sources
- https://m3.material.io/styles/motion/transitions/transition-patterns
- https://emilkowal.ski/ui/7-practical-animation-tips
- https://www.radix-ui.com/primitives/docs/components/popover
- https://rauno.me/craft/interaction-design
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.chrome.com/blog/anchored-container-queries
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
