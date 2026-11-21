# Touch targets: 44 pt, 48 dp, 24 px

> On touch, make every control at least 44×44 CSS px (Apple HIG 44 pt; Material 3 says 48 dp, use 48 for Android-feel apps), never go below WCAG 2.5.8's 24×24 floor anywhere, and keep about 8 px between adjacent targets.

**Category:** Foundations · **Applies to:** buttons, icon buttons, links in lists, checkboxes, radios, chips, steppers, tab items, close buttons · **Priority:** must

## When to use / when not
- **Use** for every interactive element on a page that can be used with touch. Size by input (`pointer: coarse`), not by screen width: tablets and touch laptops are wide but coarse.
- **Not** for links inside running text: WCAG 2.5.8 exempts inline targets, and Apple and Google apply their minimums to controls. Give inline links generous line height instead.
- **Not** a reason to draw every control huge. The *hit area* must meet the size; the visible glyph can be 24 px inside a 44–48 px target.

## Rules (do)
- **Units:** with `width=device-width`, 1 CSS px ≈ 1 iOS pt ≈ 1 Android dp. So 44 pt ≈ 44 px and 48 dp ≈ 48 px.
- **The three numbers:**
  - Apple HIG: controls at least **44×44 pt** (60 pt on visionOS).
  - Material 3: touch targets at least **48×48 dp**, about 9 mm physical, even when the visible element is smaller (a 24 dp icon, a 20 dp checkbox, a 40 dp icon button).
  - WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA: **24×24 CSS px**, or smaller if a 24 px circle centred on each target does not overlap another target or its circle. SC 2.5.5 (AAA) asks for 44×44.
- **House rule:** `--target-min: 24px` by default and **44 px under `(pointer: coarse)`**. Use 48 px when the app follows Material or Android conventions.
- **Spacing:** at least 8 px between adjacent touch targets (M3 recommends 8 dp). With spacing, a 40 px visual button is acceptable if its hit area extends to 48.
- **Extend hit areas, not visuals:** a `::after` pseudo-element with negative `inset` grows the hit area of a small icon button. Extended areas must not overlap each other or the screen edge (modern-web-guidance `user-experience/form-factor-adaptation.md`).
- **Checkboxes and radios:** wrap the input in its `<label>` and size the label row to 44–48 px; the whole row is the target.
- **List rows** are targets: at least 44 px (iOS list rows are 44 pt minimum; M3 one-line list items are 56 dp).
- **Close buttons on sheets and dialogs:** 44 px, in a corner the thumb can reach, *and* the sheet can be dismissed by swipe, scrim tap and the platform back/Esc.
- **Physical size check:** Parhi, Karlson and Bederson (2006) found one-handed thumb targets reach low error rates around 9.2–9.6 mm, which is about 44–48 px on a typical phone.

## Anti-patterns (don't)
- A 16 px "×" close icon with no extended hit area.
- Rows of 32 px icon buttons with 2 px gaps in a toolbar.
- Sizing by `@media (max-width: …)` only, so an iPad or touch laptop gets mouse-sized targets.
- Overlapping extended hit areas, where a tap lands on the neighbour.
- Pagination links "1 2 3 4 5" as 18 px text with no padding.

## Good references
- [Apple HIG: Accessibility, buttons and controls](https://developer.apple.com/design/human-interface-guidelines/accessibility#Buttons-and-controls): the 44×44 pt minimum (60 pt in visionOS).
- [Material Design 3: Accessibility, designing for touch targets](https://m3.material.io/foundations/designing/structure#dab862b1-e042-4c40-b680-b484b9f077f6): 48×48 dp targets and 8 dp spacing.
- [W3C: Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): the 24 px rule, the spacing exception and the inline exemption.
- [modern-web-guidance: Adapt to the form factor](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md): the `pointer: coarse` token switch and the `::after` hit-area extension.
- iOS Settings: every row is a full-width 44 pt target, with the chevron as a cue, not the target.

## Bad references
- [W3C: Understanding SC 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html): its failure examples (small adjacent icons) are the common cookie-banner and carousel-dot mistakes.
- Carousel dot indicators drawn as 8 px dots with no larger target: almost impossible to hit, so offer swipe and previous/next buttons instead.

## Accessibility
- WCAG 2.5.8 (AA) is the legal floor in many jurisdictions; 44/48 is the usable target on touch.
- Give icon-only buttons an accessible name (`aria-label`) and hide the glyph with `aria-hidden="true"`.
- WCAG 2.5.2 Pointer Cancellation: activate on release (`click`), not on `pointerdown`, so a user can slide off to cancel.

## Motion / interaction (if relevant)
- Show a pressed state within 100 ms (background tint or `scale: 0.97`), and keep it while the finger is down. On release outside the target, cancel without firing.
- Remove the grey tap flash only when you provide your own pressed state.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--target-min` | 24px; 44px under `pointer: coarse` | floor for every control |
| `--target-touch-ios` | 44px | Apple HIG 44 pt |
| `--target-touch-m3` | 48px | Material 3 48 dp |
| `--target-gap` | 8px | spacing between adjacent targets |
| icon glyph | 20–24px | visible size inside the target |

## Implementation sketch
```css
.icon-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  inline-size: 40px;
  block-size: 40px;
  border-radius: var(--radius-full);
  border: 0;
  background: transparent;
  color: var(--text);
  -webkit-tap-highlight-color: transparent;
}
.icon-button::after { content: ""; position: absolute; inset: -4px; } /* 48 px hit area */
.icon-button:active { background: var(--surface-3); }
.toolbar { display: flex; gap: var(--target-gap); }
.check-row { display: flex; align-items: center; gap: var(--space-3); min-block-size: max(var(--target-min), 48px); padding-inline: var(--space-4); }
```
```html
<button class="icon-button" type="button" aria-label="Close"><svg aria-hidden="true" width="24" height="24"></svg></button>
<label class="check-row"><input type="checkbox" name="news"> Email me product news</label>
```

## Checklist
- [ ] With `pointer: coarse` emulated, every control's hit area is at least 44×44 (48×48 for Material-styled apps).
- [ ] No control anywhere is below 24×24 unless the 24 px spacing exception holds.
- [ ] Adjacent targets are at least 8 px apart, and extended hit areas do not overlap.
- [ ] Checkbox and radio rows are fully tappable via their labels.
- [ ] Icon-only buttons have accessible names.
- [ ] Actions fire on release, not on press.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://m3.material.io/foundations/designing/structure
- https://developer.android.com/guide/topics/ui/accessibility/apps#large-controls
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html
- https://doi.org/10.1145/1152215.1152260 (Parhi, Karlson, Bederson 2006, "Target size study for one-handed thumb use on small touchscreen devices")
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/form-factor-adaptation.md
- Note: the HIG and m3.material.io pages render client-side and could not be fetched as text during this research; the 44 pt and 48 dp values are the long-standing published figures, also restated on developer.android.com.
