# ARIA: the first rule, and when to use an APG pattern

> Don't use ARIA when a native HTML element or attribute already gives the role, state and keyboard behaviour; when no native element exists (tabs, combobox, tree, menu button, grid), build the WAI-ARIA Authoring Practices (APG) pattern completely, roles, states and every listed key, and test it in a screen reader.

**Category:** ARIA · **Applies to:** custom widgets, design-system components, framework component libraries · **Priority:** must

## When to use / when not
- **Native first.** `<button>`, `<a href>`, `<input type=checkbox|radio|range>`, `<select>`, `<details>/<summary>`, `<dialog>`, `popover`, `<progress>`, `<meter>`, `<table>`, `<fieldset>` cover most needs with no ARIA.
- **Use an APG pattern** only when the interaction has no native equivalent, or the native one can't be styled or extended enough (customisable `<select>` is arriving and may remove some of these).
- **Prefer a tested library** (React Aria, Radix, Headless UI, the platform `<dialog>`) over hand-writing a pattern; audit it anyway.
- **Not** to add "extra" semantics to native elements (`<button role="button">`), and not to describe visual style.

## Rules (do)
- **The five rules of ARIA use (W3C *Using ARIA*):**
  1. If a native element or attribute has the semantics and behaviour, use it.
  2. Don't change native semantics unless you really have to (`<h2 role="tab">` is wrong; put a `<button role="tab">` inside the heading if needed).
  3. All interactive ARIA controls are keyboard operable.
  4. Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements.
  5. All interactive elements have an accessible name.
- **APG decision table:**

| Need | Native first | APG pattern if native won't do |
|---|---|---|
| Show/hide a section | `<details>` | Disclosure (button + `aria-expanded` + `aria-controls`) |
| Several views, one visible | links to separate pages, or a list of `<details>` | Tabs (`tablist`/`tab`/`tabpanel`, arrows, Home/End) |
| Pick one from a list with typing | `<select>`, `<input list>` | Combobox (+ listbox) |
| Menu of actions from a button | a `popover` list of buttons | Menu button (`menu`/`menuitem`, arrows, Esc) |
| Modal question | `<dialog>` + `showModal()` | Dialog (modal) only if `<dialog>` can't be used |
| Hierarchy | nested lists of links | Tree view |
| Spreadsheet-like editing | `<table>` with inputs | Grid |
| On/off applied immediately | `<input type="checkbox">` styled | Switch (`role="switch"` on a button or checkbox) |
| Horizontal set of tools | buttons in a `<div>` | Toolbar (roving tabindex) |
| Rotating content | static list | Carousel (with rotation control) |

- **Complete the pattern:** every role in the pattern, every required state (`aria-selected`, `aria-expanded`, `aria-activedescendant`, `aria-controls`), and every keyboard interaction in the APG table for it. A partial pattern is worse than none: it promises behaviour the screen reader user then can't get.
- **Menus are for application menus.** A site's navigation is a `<nav>` with links, not `role="menu"`; `menu` changes screen-reader keyboard mode and expects arrow keys.
- **Respect support notes.** APG examples are reference implementations, not guaranteed accessibility-supported everywhere; check a11ysupport.io or test in VoiceOver and NVDA.
- **ARIA changes only semantics.** It adds no focusability, keyboard handling or styling; you write those.

## Anti-patterns (don't)
- `<div role="button">` without `tabindex="0"` and Enter/Space handlers.
- `role="menu"` on a site header navigation.
- Tabs with `role="tab"` that don't respond to arrow keys or don't set `aria-selected`.
- `role="application"` on a page region "to make keyboard work".
- Copy-pasting APG example markup without its script.

## Good references
- [W3C — Using ARIA (the rules of ARIA use)](https://www.w3.org/TR/using-aria/) — the first rule and its four companions.
- [W3C WAI-ARIA Authoring Practices Guide — Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) — roles, states and keyboard tables for about 30 widget patterns.
- [W3C APG — Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — "No ARIA is better than bad ARIA" and why examples aren't production code.
- [W3C — ARIA in HTML](https://www.w3.org/TR/html-aria/) — which roles each HTML element may take and which are redundant.
- [React Aria](https://react-spectrum.adobe.com/react-aria/) — hooks that implement APG patterns, tested across screen readers.
- [modern-web-guidance — Accessibility §2](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md#2-semantic-html-and-aria) — native first, no redundant roles, match ARIA to behaviour.

## Bad references
- [WebAIM Million (annual report)](https://webaim.org/projects/million/) — home pages with ARIA present averaged more detected errors than those without; ARIA added without behaviour makes things worse.
- Component libraries that expose `role="menu"` for every dropdown, including navigation and selects.

## Accessibility
- After building a pattern, test its keyboard table key by key, then in a screen reader in browse and focus modes (`atest-screen-reader-cheatsheets.md`).

## Motion / interaction (if relevant)
- Panel switches in tabs and disclosures follow reduced motion; focus moves are instant.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| ARIA used where native exists | 0 | Rule 1 |
| APG keyboard table coverage | 100% of listed keys | Rule 3 |
| Screen readers tested | ≥ 2 (VoiceOver + NVDA) | Support check |

## Implementation sketch
APG Tabs (manual activation is simpler; this is automatic activation) with roving `tabindex`.
```tsx
import { useRef, useState, type KeyboardEvent } from 'react'

interface Tab { id: string; label: string; panel: string }

export function Tabs({ tabs, label }: { tabs: readonly Tab[]; label: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const focusTab = (i: number): void => { const n = (i + tabs.length) % tabs.length; setActive(n); refs.current[n]?.focus() }
  const onKey = (e: KeyboardEvent<HTMLButtonElement>): void => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 }
    const to = moves[e.key]
    if (to === undefined) return
    e.preventDefault()
    focusTab(to)
  }
  return (
    <div>
      <div role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={t.id} id={`tab-${t.id}`} role="tab" type="button" ref={(el) => { refs.current[i] = el }}
            aria-selected={i === active} aria-controls={`panel-${t.id}`} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)} onKeyDown={onKey}>{t.label}</button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} tabIndex={0} hidden={i !== active}>
          {t.panel}
        </div>
      ))}
    </div>
  )
}
```
In RTL, swap the ArrowLeft/ArrowRight meanings (i18n-rtl `rtl-mirroring-what-flips.md`).

## Checklist
- [ ] No ARIA role duplicates a native element's role.
- [ ] Every custom widget maps to a named APG pattern.
- [ ] Every role, state and key in that pattern's tables is implemented.
- [ ] No `role="menu"` on site navigation; no `role="application"`.
- [ ] Tested in at least two screen readers.

## Sources
- https://www.w3.org/TR/using-aria/
- https://www.w3.org/WAI/ARIA/apg/patterns/
- https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/TR/html-aria/
- https://www.w3.org/TR/wai-aria-1.2/
- https://webaim.org/projects/million/
- https://react-spectrum.adobe.com/react-aria/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md (Apache-2.0, linked, not copied)
