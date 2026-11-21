# Search and the command palette (⌘K)

> Give power users one keyboard-summoned palette that finds *every* command, entity and page with fuzzy matching and teaches shortcuts. Keep a visible search field and visible buttons for everyone else, because the palette is an accelerator, not the only path.

**Category:** Components and interaction · **Applies to:** global search (tickers, companies, reports, users), command execution ("Export CSV", "Toggle dark mode", "New scenario"), navigation jumps, in-table quick find · **Priority:** should (must for apps with >30 commands or >3 entity types)

## When to use / when not
- **Command palette (⌘K / Ctrl+K):** use it once the app has many actions spread across screens, plus searchable entities. It complements the GUI rather than replacing it. Maggie Appleton notes GUIs remain better for new users, and bars hide functionality from people who don't know the shortcut.
- **Visible global search field** in the top bar: always present on data products. It opens the *same* palette UI pre-scoped to entities, with a visible "⌘K" hint inside the field.
- **Local find / filter field:** use one inside a table or list for filtering the current dataset. That's a filter, not the palette (see `comp-filter-bar-chips.md`).
- **Don't** build separate palettes for commands (⌘K) and files (⌘P). Superhuman: "Your command palette must be the one place where users can find every command." Scope prefixes are fine (`>` for commands, `#` for tickers, `/` for pages).
- **Don't** use a palette for a 10-screen app with 5 actions. A visible nav and buttons suffice.

## Rules (do)
- **Trigger.**
  - ⌘K on macOS, Ctrl+K elsewhere, bound at the app root. Pressing it again closes the palette.
  - Also open it from the visible search field, and optionally from `/`.
  - Remember the element focused before opening and return focus to it on close.
  - Decide deliberately whether ⌘K fires inside text inputs. Recommended: yes for ⌘K, which has a modifier; no for `/`, a character key.
- **Container.**
  - Use a modal `<dialog>` near the top: `inset-block-start: 12–20vh`, 560–720px wide, results area ≤ 60vh.
  - A modal is right here even though `comp-overlay-choice.md` reserves modals for decisions: the user summoned it for a short focused task, it blocks nothing they didn't ask to leave, and Esc or the shortcut closes it.
  - Inside it, a combobox input (`role="combobox"`, `aria-controls` → `role="listbox"`, `aria-activedescendant`) keeps DOM focus in the input while arrows move a virtual highlight (ARIA APG).
- **Empty state (before typing).** Show "Recent" (last 5 items or commands used) and "Suggested", the 5–8 highest-value commands for the current context. Superhuman gives commands a default score so the best features surface before typing.
- **Matching.**
  - Case-insensitive fuzzy match, tolerant of typos ("lnik" matches "link") and characters in order.
  - Match against title *and* aliases or synonyms ("export", "download" and "csv" all hit "Export table as CSV"). Display the matched alias in muted text so users learn the canonical name.
  - Rank by match score × context boost × usage frequency.
  - Drop results below a threshold rather than showing 300 weak matches.
- **Grouping.** Group results by type (Commands, Companies, Reports, Pages, Settings) with ≤ 5 per group by default and "Show all N" per group. Keep group order stable, so muscle memory works.
- **Each row shows:** an icon, a title, muted context (e.g. `AAPL · Apple Inc. · Nasdaq`, or the page path) and, on the right, the keyboard shortcut in `<kbd>`. That way the palette teaches shortcuts (Superhuman, Linear).
- **Context.** Commands that apply to the current selection appear first ("Archive 3 selected rows"). Hide only commands that are *completely* irrelevant; boost or dampen the rest.
- **Execution.**
  - Enter runs the command; ⌘Enter opens it in a new tab when it's navigation.
  - Commands that need an argument open a nested step in the same palette with a breadcrumb chip ("Change status ›"); Backspace on an empty input goes back.
  - After execution, close and give feedback where the result appears, not in a toast-only message.
- **Performance.**
  - Show local results (commands, recent items) synchronously, in under 50 ms.
  - Remote entity search is debounced 100–150 ms, keeps the previous results visible while loading, and shows a subtle inline spinner after 300 ms.
  - Cancel stale requests (`AbortController`).
- **No-result state.** Say "No results for 'xyz'" and offer "Search all reports for 'xyz'" or "Create 'xyz'" where creation makes sense.

## Anti-patterns (don't)
- The palette as the *only* way to reach a feature, with no button or menu in the GUI.
- Two or more overlapping palettes or search boxes with different scopes and no explanation (⌘K for actions, ⌘P for files, a header search for content).
- Exact-substring-only matching, so "rev growth" doesn't find "Revenue growth (YoY)".
- Results that reorder while the user is arrowing through them (late-arriving remote results inserted above the highlighted item). Append remote groups below, or freeze the order until typing.
- Moving DOM focus onto each option. Focus stays in the input via `aria-activedescendant`, or typing breaks.
- The palette opening on a single-key shortcut that fires while typing in a cell editor.
- No visible hint that ⌘K exists. Discoverability depends on a `⌘K` badge in the search field and in tooltips.

## Good references
- [Superhuman — How to build a remarkable command palette](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/) — one palette for everything, toggle shortcut, focus restoration, fuzzy plus alias matching (their command-score library, example cutoff 0.0015), default scores (0 hides a command until typed), context boosting, and "you shouldn't use Cmd+K for some types of actions, and Cmd+P for others".
- [Maggie Appleton — Command bars](https://maggieappleton.com/command-bar) — explains why palettes exist (GUIs don't scale to hundreds of commands), recall vs recognition, shortcut hints, chained actions (Tana), and the downside that they hide functionality.
- [Linear](https://linear.app) (product) — ⌘K lists contextual actions for the focused issue first, every row shows its shortcut, and nested steps ("Change status ›") stay in the same surface.
- [Grafana — Use dashboards](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/) — Ctrl+K "Opens the command palette", alongside `f` for the dashboard finder and `?` for shortcut help.
- [WAI-ARIA APG — Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — the authoritative roles and keyboard contract for an input with a listbox popup.

## Bad references
- [Maggie Appleton — Command bars](https://maggieappleton.com/command-bar) — the CLI heritage problem: hard-to-remember commands and invisible system state. A palette with no empty-state suggestions and no shortcut hints recreates it.
- Apps that add ⌘K for "quick actions" while keeping a different header search for entities. Users must guess which box finds "Q3 report". Superhuman calls out splitting commands across ⌘K and ⌘P as an anti-pattern.
- [GitHub community — shortcuts intercepting the browser](https://github.com/orgs/community/discussions/113472) — users complain that app-level shortcuts, including command mode, intercept browser shortcuts even after being "disabled". Respect reserved browser and OS combos.

## Accessibility
- Use a modal `<dialog>` with `aria-label="Command palette"`. Native modality handles focus containment and Esc.
- The sketch's `command="show-modal"` is Baseline newly available (December 2025: Chrome 135, Firefox 144, Safari 26.2); the ⌘K handler calls `showModal()` anyway. `closedby="any"` is not Baseline (Chrome/Edge 134, Firefox 141, Safari 27.3), so also close on a click whose target is the `<dialog>` itself.
- The input is `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-autocomplete="list"`. Results are `role="listbox"` with `role="option"` rows. Group headings use `role="group"` with `aria-label`.
- Announce the result count politely after debouncing ("12 results"), not on every keystroke.
- Shortcut hints are visible text in `<kbd>`. Also expose the trigger's shortcut with `aria-keyshortcuts="Meta+K Control+K"` on the search field.
- Rows are ≥32px tall (≥44px on coarse pointers), and the highlighted row has a non-colour indicator (background plus a left bar or outline).

## Motion / interaction (if relevant)
- The palette opens in 100–120 ms (opacity plus `scale` from 0.98) with no slide; it must feel instant. It closes in ≤100 ms.
- The highlight moves without animation. Scroll the highlighted option into view with `block: 'nearest'`.
- Under reduced motion, use opacity only.

## Tokens and values
| Token | Default |
|---|---|
| Palette width | `min(640px, calc(100vw - 32px))` |
| Offset from top | 15vh (mobile: full-screen sheet) |
| Input height / font | 48px / 16px (16px avoids iOS zoom) |
| Row height | 36px (coarse: 44px) |
| Results max height | 60vh |
| Items per group before "Show all" | 5 |
| Recent items | 5 |
| Debounce remote search | 100–150ms; spinner after 300ms |
| Local result latency | <50ms |
| Colour roles | `surface-overlay`, `option-highlight-bg`, `fg-muted` for context, `kbd-bg`/`kbd-border` |

## Implementation sketch
```html
<button type="button" class="search-trigger" command="show-modal" commandfor="palette" aria-keyshortcuts="Meta+K Control+K">
  Search or run a command… <kbd>⌘K</kbd>
</button>

<dialog id="palette" aria-label="Command palette" closedby="any" class="palette">
  <input role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list"
         aria-activedescendant="opt-1" placeholder="Search companies, reports, commands…" autofocus>
  <div id="palette-list" role="listbox" aria-label="Results">
    <div role="group" aria-label="Commands">
      <div role="option" id="opt-1" aria-selected="true">Export table as CSV <span class="alias">download</span><kbd>⇧E</kbd></div>
    </div>
    <div role="group" aria-label="Companies">
      <div role="option" id="opt-2" aria-selected="false">AAPL <span class="ctx">Apple Inc. · Nasdaq</span></div>
    </div>
  </div>
  <p role="status" class="visually-hidden"></p>
</dialog>
```
```ts
type Command = { id: string; title: string; aliases: readonly string[]; defaultScore: number; shortcut?: string; run: () => void };

const palette = document.querySelector<HTMLDialogElement>('#palette');
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
  e.preventDefault();
  if (!palette) return;
  if (palette.open) palette.close(); else palette.showModal(); // native modal restores focus on close
});

export function rank(query: string, commands: readonly Command[], score: (q: string, s: string) => number): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...commands].filter((c) => c.defaultScore > 0).sort((a, b) => b.defaultScore - a.defaultScore);
  return commands
    .map((c) => ({ c, s: Math.max(score(q, c.title), ...c.aliases.map((a) => score(q, a))) }))
    .filter((r) => r.s > 0.0015) // tune the threshold (Superhuman's example value)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.c);
}
```

## Checklist
- [ ] One palette finds every command, entity and page. Scopes are prefixes, not separate tools.
- [ ] ⌘K/Ctrl+K toggles it from anywhere, focus returns to the previous element, and a visible search field with a `⌘K` hint exists.
- [ ] The empty state shows recent and suggested, context-relevant items.
- [ ] Matching is fuzzy, alias-aware and thresholded. Result order doesn't jump under the highlight.
- [ ] Every command row shows its keyboard shortcut.
- [ ] Combobox semantics: focus stays in the input, `aria-activedescendant` tracks the highlight, and the result count is announced politely.
- [ ] Local results appear in under 50 ms. Remote results are debounced and cancellable.

## Sources
- https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/
- https://maggieappleton.com/command-bar
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/
- https://github.com/orgs/community/discussions/113472
- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button (`command="show-modal"`)
- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing (don't run commands on Enter during IME composition)
