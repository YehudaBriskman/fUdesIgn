# Mapping tokens to the stack (Tailwind v4, shadcn/ui, CSS Modules, vanilla CSS, MUI)

> Keep the generated role tokens as the single source and expose them through each stack's native mechanism (Tailwind `@theme`, shadcn variables, MUI `createTheme`), so components use the stack's idiom while every value still comes from one verified file.

**Category:** Stack mapping · **Applies to:** wiring tokens into a project; detecting an existing stack; `theme.mjs --format tailwind|shadcn|css|dtcg` · **Priority:** must

## When to use / when not
- Use in workflow step 4 ("map them to the stack"), after the tokens are generated.
- If the project already has tokens under other names, don't rename the project's tokens. Map the roles onto them (an alias layer), list the gaps, and record the mapping in DESIGN.md.

## Rules (do)
- **Detect before mapping.** Look for: `@import "tailwindcss"` or `@theme` in CSS (Tailwind v4); `tailwind.config.*` (v3); `components.json` (shadcn/ui); `@mui/material` in `package.json` (MUI); `*.module.css` files (CSS Modules); otherwise vanilla CSS. Also search for existing `--*` custom properties and `createTheme(` calls to find current tokens.
- **Tailwind v4.** Load `tokens.css`, then `tailwind.css` from `theme.mjs`. It maps each role into the colour namespace with `@theme inline { --color-surface: var(--surface); }`, so `bg-surface`, `text-text-muted`, `border-border-strong` follow the theme at runtime. It clears the default palette with `--color-*: initial` so `bg-blue-500` stops existing (delete that line while migrating an older codebase). Tokens whose names already match a Tailwind namespace (`--radius-*`, `--font-*`, `--shadow-*`) are repeated with literal values in a plain `@theme`, because `--radius-md: var(--radius-md)` would point at itself. `--spacing: 4px` keeps the default multiplier, so map by pixels: `p-4` = 16px = `--space-4`, `p-6` = 24px = `--space-5`.
- **shadcn/ui.** shadcn's names collide with ours: its `--accent` is a subtle hover background, ours is the brand colour (shadcn's `--primary`). So `shadcn.css` is a standalone file with shadcn's names and our verified values, and it replaces `tokens.css` rather than sitting beside it. Mapping: `background ← canvas`, `card ← surface`, `popover ← surface` (light) or `surface-2` (dark), `primary ← accent`, `primary-foreground ← on-accent`, `secondary`/`muted ← surface-2`, `muted-foreground ← text-muted`, `accent ← surface-2` (light) or `surface-3` (dark), `destructive ← danger-fg`, `border ← border`, `input ← border-strong` (inputs need 3:1), `ring ← accent`, `chart-1…7 ← cat-1…7`, `sidebar ← canvas`, `sidebar-foreground ← text-muted`. shadcn ships five chart slots; `chart-6` and `chart-7` are our extension, and more than 7 series need "Other" or small multiples. Dark mode uses shadcn's `.dark` class.
- **CSS Modules.** CSS Modules scope class names, not custom properties, so load `tokens.css` once globally (in the root layout or entry) and read `var(--surface)` inside modules. Don't `@import` the token file from every module; it duplicates the rules in the bundle.
- **Vanilla CSS.** `tokens.css` is drop-in. Theme switch with `data-theme`, density with `data-density`, brand with `data-brand`.
- **MUI (v6 or later).** Use `createTheme({ cssVariables: true, colorSchemes: { light, dark } })` and fill the palette from `tokens.json`. Use the DTCG `hex` field for palette values (`dstoken-dtcg-format.md`), because MUI's colour helpers (`alpha`, `darken`, automatic `contrastText`) parse hex, rgb and hsl. Map `primary.main ← accent`, `primary.contrastText ← on-accent`, `background.default ← canvas`, `background.paper ← surface`, `text.primary ← text`, `text.secondary ← text-muted`, `divider ← border`, `error.main ← danger-fg`, `warning.main ← warning-fg`, `success.main ← success-fg`, `info.main ← info-fg`. Set `contrastText` explicitly; don't let MUI compute it from a threshold you haven't verified.
- **One generated source, many outputs.** All of these files come from one `theme.mjs` run with the same inputs. Re-run it instead of editing an output.

## Anti-patterns (don't)
- Loading `tokens.css` and `shadcn.css` together: `--accent` means two things and the later file silently wins.
- Arbitrary values in Tailwind (`bg-[#325ac2]`, `p-[13px]`). They bypass the tokens.
- Keeping Tailwind's default palette after the migration; agents will reach for `text-gray-500`.
- Duplicating token values into `tailwind.config.js` v3-style `extend.colors` with hex literals, so dark mode needs `dark:` variants on every element.
- Letting MUI derive `contrastText` and hover shades without verifying them.
- `@import "./tokens.css"` inside each CSS Module.

## Good references
- [Tailwind CSS – Theme variables](https://tailwindcss.com/docs/theme) — `@theme`, namespaces, `inline`, and clearing a namespace with `initial`.
- [shadcn/ui – Theming](https://ui.shadcn.com/docs/theming) — the background/foreground convention, the variable list and `.dark`.
- [MUI – CSS theme variables](https://mui.com/material-ui/customization/css-theme-variables/overview/) — `cssVariables`, `colorSchemes` and the `--mui-*` variables.
- [CSS Modules](https://github.com/css-modules/css-modules) — what is scoped (class names, animation names) and what is not.

## Bad references
- shadcn projects that recolour by editing `--primary` to a brand hex and leave `--primary-foreground` white — a light brand colour then fails contrast on every primary button.
- Tailwind v4 projects that paste a v3 `theme.extend.colors` object of hex values into `@theme` — the colours stop following the dark theme, so every component grows `dark:` variants.

## Accessibility
- Every mapped pair is one of the generator's verified pairs. The `theme.mjs` test suite re-checks `primary-foreground/primary`, `destructive-foreground/destructive` and `muted-foreground/muted` in the shadcn output for both themes.
- `input ← border-strong`, not `border`: input outlines are non-text UI and need 3:1 (WCAG 1.4.11).
- Keep `focus-ring`/`ring` mapped; never `outline: none` without a replacement.

## Motion / interaction (if relevant)
- Tailwind easings are exposed as `ease-standard`, `ease-enter`, `ease-exit`, `ease-emphasized`; durations stay CSS variables (`duration-(--motion-dur-short)`).

## Tokens and values
| Our role | Tailwind v4 utility | shadcn variable | MUI palette |
|---|---|---|---|
| `canvas` | `bg-canvas` | `--background` | `background.default` |
| `surface` | `bg-surface` | `--card` | `background.paper` |
| `text` / `text-muted` | `text-text` / `text-text-muted` | `--foreground` / `--muted-foreground` | `text.primary` / `text.secondary` |
| `accent` / `on-accent` | `bg-accent text-on-accent` | `--primary` / `--primary-foreground` | `primary.main` / `primary.contrastText` |
| `border` / `border-strong` | `border-border` / `border-border-strong` | `--border` / `--input` | `divider` / (input outline override) |
| `danger-fg` | `text-danger-fg` | `--destructive` | `error.main` |
| `cat-1…7` | `fill-cat-1` | `--chart-1…7` | (chart library config) |
| `space-5` (24px) | `p-6` | — | `theme.spacing(6)` with spacing 4 |

## Implementation sketch
```css
/* app.css, Tailwind v4: generated files, in this order */
@import "tailwindcss";
@import "./tokens/tokens.css";
@import "./tokens/tailwind.css";
```

```tsx
// Tailwind: components use role utilities only
export function PrimaryButton({ label }: { label: string }) {
  return <button className="rounded-md bg-accent px-3 py-2 text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{label}</button>
}
```

```ts
// MUI: palette from tokens.json (hex fallbacks), parsed without `any`
import { z } from 'zod'

const Hex = z.object({ $value: z.object({ hex: z.string() }) })
const Mode = z.object({
  accent: Hex, 'on-accent': Hex, canvas: Hex, surface: Hex, text: Hex, 'text-muted': Hex, border: Hex,
  'danger-fg': Hex, 'warning-fg': Hex, 'success-fg': Hex, 'info-fg': Hex,
})
const TokenFile = z.object({ color: z.object({ light: Mode, dark: Mode }) })

export function muiColorSchemes(json: unknown) {
  const { color } = TokenFile.parse(json)
  const palette = (m: z.infer<typeof Mode>) => ({
    primary: { main: m.accent.$value.hex, contrastText: m['on-accent'].$value.hex },
    background: { default: m.canvas.$value.hex, paper: m.surface.$value.hex },
    text: { primary: m.text.$value.hex, secondary: m['text-muted'].$value.hex },
    divider: m.border.$value.hex,
    error: { main: m['danger-fg'].$value.hex },
    warning: { main: m['warning-fg'].$value.hex },
    success: { main: m['success-fg'].$value.hex },
    info: { main: m['info-fg'].$value.hex },
  })
  return { light: { palette: palette(color.light) }, dark: { palette: palette(color.dark) } }
}
// createTheme({ cssVariables: { colorSchemeSelector: 'data-theme' }, colorSchemes: muiColorSchemes(tokensJson), spacing: 4 })
```

## Checklist
- [ ] The stack was detected from files, and DESIGN.md records it.
- [ ] Exactly one generated colour file is loaded per page (`tokens.css` + `tailwind.css`, or `shadcn.css`, or the MUI theme).
- [ ] No arbitrary colour or spacing values in class names or `sx` props.
- [ ] Tailwind's default palette is cleared, or DESIGN.md says why not yet.
- [ ] MUI `contrastText` values are set explicitly from the verified pairs.
- [ ] Re-running the generator regenerates every stack file; none is hand-edited.

## Sources
- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/dark-mode
- https://ui.shadcn.com/docs/theming
- https://mui.com/material-ui/customization/css-theme-variables/overview/
- https://mui.com/material-ui/customization/palette/
- https://github.com/css-modules/css-modules
- Repo: `plugins/design-system/skills/design-system/scripts/theme.mjs` (`toTailwind`, `toShadcn`)
