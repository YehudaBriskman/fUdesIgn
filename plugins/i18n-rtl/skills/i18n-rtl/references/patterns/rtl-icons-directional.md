# Icons: directional vs not

> Mirror an icon only when it shows reading direction, forward/back motion or text layout; keep clocks, media controls, checkmarks, right-handed tools, physical objects, slashes and logos as they are, and record the decision as metadata on the icon, not as CSS scattered across screens.

**Category:** Right-to-left layout and bidi · **Applies to:** icon sets, buttons with icons, navigation chevrons, toolbars, empty-state illustrations · **Priority:** must

## When to use / when not
- Use when building or auditing an icon set for a product that ships in any RTL language, and when adding a new icon.
- Applies to inline SVG icons, icon fonts and image icons alike.
- Illustrations and photos are not icons: they are never flipped (see `rtl-mirroring-what-flips.md`).

## Rules (do)
- **Mirror these:**

  | Icon | Why | Source |
  |---|---|---|
  | back / forward arrows, chevrons used for navigation, first/last page, breadcrumb separators | navigation follows reading order; "a back button must point to the right" | Apple HIG, Material |
  | undo / redo, reply, forward (mail), send | depict motion along the reading direction | Material, Apple |
  | list, bulleted list, indent / outdent, text-with-lines, chat bubble with text lines, document with ragged lines | represent text, which is right-aligned in RTL | Material ("Icons that contain representations of text need careful mirroring"), Apple |
  | speaker / volume with waves, a walking person, a bicycle, a moving vehicle | forward motion | Material, Apple ("sound waves … coming from the right") |
  | sidebar toggle, drawer open/close, "exit"/log-out with arrow | point at an area that moves with the layout | Apple |
  | progress-style icons (step 1 → 2 → 3) | sequence | Apple |

- **Do not mirror these:**

  | Icon | Why | Source |
  |---|---|---|
  | clock, history, refresh, sync, circular spinner | "Clocks still turn clockwise for RTL languages" | Material |
  | play, pause, fast-forward, rewind, skip | media direction is the tape, not time | Material, Codex |
  | checkmark, check-circle | universal mark | Apple, Codex |
  | search magnifier, pen, pipette, cup with handle | right-handed use; most RTL readers are right-handed too | Material, Apple |
  | camera, keyboard, headphones, phone handset, printer | physical objects look the same everywhere | Material, Apple |
  | slash for "off" / "muted" | "Most RTL countries do not mirror slashes" | Material, Apple (SF Symbols keeps the backslash) |
  | brand logos, app icons | legal and recognition risk | Apple |
  | "align left", "rotate right", map compass | name a real direction | Apple |
  | charts in icons (bar chart, line trend) | charts are not mirrored | Material |

- **Badges on icons:** if the badge depicts UI that moves (a notification dot on a nav item), mirror its position; if it modifies meaning (a plus on a cart), consider balance. Apple's example moves the cart badge for balance, and keeps tool handedness while flipping the base.
- **Icons with letters** (font size "Aa", signature, text cursor, a "?" help mark): make a localised variant. Hebrew keeps `?`; Arabic uses `؟` (U+061F), and Wikimedia Codex calls out "the question mark in Hebrew versus Arabic" as an icon that needs a language-specific version.
- **Encode the decision in the icon registry**: each icon has `rtl: "mirror" | "keep" | "variant"`. The component applies it; screens never decide.
- **Mirror with `scale: -1 1` (or `transform: scaleX(-1)`) under `:dir(rtl)`**, not by swapping to the opposite icon name. "chevron-left" in LTR and "chevron-right" in RTL look the same but break when the icon is asymmetric (a back arrow with a tail).
- **Icon fonts:** ligature names don't mirror; the same registry rule applies to the wrapping element.

## Anti-patterns (don't)
- `[dir=rtl] svg { transform: scaleX(-1) }`: flips clocks, checkmarks, logos and media controls.
- Choosing the chevron per screen with `isRtl ? <ChevronLeft/> : <ChevronRight/>` scattered through the codebase.
- A mirrored search magnifier or a mirrored "mute" slash.
- A disclosure triangle that points right (collapsed) in RTL. Collapsed disclosure points toward inline-end: left in RTL.
- A mirrored "external link" icon in one place and not another. Decide once in the registry.

## Good references
- [Material Design (v1), Bidirectionality: RTL mirroring guidelines](https://m1.material.io/usability/bidirectionality.html) — icon-level examples: back/forward, volume, text icons, clocks, right-handed icons, slashes.
- [Apple HIG, Right to left: Interface icons](https://developer.apple.com/design/human-interface-guidelines/right-to-left) — flip text and motion icons, localise icons with letters, keep logos and checkmarks, handle badges and handedness.
- [Wikimedia Codex, Bidirectionality](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) — "Don't mirror … icons representing time, containing check symbols, or designed for right hand use", and a per-icon list in the Codex icon set.
- [Firefox RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) — Mozilla's rules for which browser-chrome icons mirror.

## Bad references
- [androidx/media issue #227](https://github.com/androidx/media/issues/227) — next/previous and fast-forward/rewind icons mirrored in RTL in Google's player component, later fixed.
- Global CSS flips of every SVG under `[dir=rtl]`, which mirror clock and checkmark icons along with arrows; the [RTLCSS control directives](https://rtlcss.com/learn/usage-guide/control-directives/) exist because automated flipping needs per-rule exceptions.

## Accessibility
- The accessible name of a directional icon button names the action, not the direction: "Back" / "חזרה", not "Left arrow". Then the name is correct whether or not it mirrors.
- Icon-only buttons still need visible tooltips or labels for unfamiliar actions; translation does not make icons clearer.
- Mirroring with `scale` doesn't affect hit area or focus ring.

## Motion / interaction (if relevant)
- An icon that animates (a chevron rotating on expand) rotates in the mirrored direction in RTL: rotate by `calc(var(--dir) * 90deg)`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `data-rtl="mirror"` | `:dir(rtl) [data-rtl="mirror"] { scale: -1 1 }` | arrows, chevrons, text icons, motion icons |
| `data-rtl="keep"` | no rule | clocks, media, checkmarks, tools, objects, logos |
| `data-rtl="variant"` | a separate asset per script | icons containing letters or `?` |
| Disclosure rotation | `calc(var(--dir) * 90deg)` | expand/collapse chevrons |

## Implementation sketch
```tsx
type RtlBehaviour = "mirror" | "keep" | "variant";
type IconDef = { path: string; rtl: RtlBehaviour; rtlPath?: string };

const ICONS = {
  back: { path: "M15 18l-6-6 6-6", rtl: "mirror" },
  send: { path: "M3 11l18-8-8 18-2-8z", rtl: "mirror" },
  history: { path: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5", rtl: "keep" },
  check: { path: "M5 13l4 4L19 7", rtl: "keep" },
  help: { path: "M9 9a3 3 0 1 1 4 2.8V14", rtl: "variant", rtlPath: "M15 9a3 3 0 1 0-4 2.8V14" },
} satisfies Record<string, IconDef>;

type IconName = keyof typeof ICONS;

export function Icon({ name, label, script }: { name: IconName; label?: string; script?: "Arab" | "Hebr" | "Latn" }) {
  const def: IconDef = ICONS[name];
  // Only Arabic gets the mirrored question mark; Hebrew keeps the Latin "?".
  const d = def.rtl === "variant" && script === "Arab" && def.rtlPath ? def.rtlPath : def.path;
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" data-rtl={def.rtl} role={label ? "img" : undefined}
      aria-label={label} aria-hidden={label ? undefined : true} fill="none" stroke="currentColor" strokeWidth={2}>
      <path d={d} />
    </svg>
  );
}
```
```css
:dir(rtl) [data-rtl="mirror"] { scale: -1 1; }
.disclosure[aria-expanded="false"] .chevron { rotate: calc(var(--dir, 1) * -90deg); }
```

## Checklist
- [ ] Every icon in the registry has an `rtl` value; new icons can't be added without one.
- [ ] Back/forward, chevrons, undo/redo, send/reply, list and text icons mirror.
- [ ] Clocks, refresh/history, media controls, checkmarks, tools, objects, slashes and logos don't.
- [ ] Icons containing letters or `?` have script variants where needed (Arabic `؟`).
- [ ] No global SVG flip rule exists.
- [ ] Accessible names describe actions, not directions.

## Sources
- https://m1.material.io/usability/bidirectionality.html
- https://developer.apple.com/design/human-interface-guidelines/right-to-left
- https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html
- https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html
- https://github.com/androidx/media/issues/227
- https://rtlcss.com/learn/usage-guide/control-directives/
