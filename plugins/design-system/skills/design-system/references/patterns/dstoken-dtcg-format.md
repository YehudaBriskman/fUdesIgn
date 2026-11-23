# DTCG token format

> Exchange tokens as W3C Design Tokens (DTCG) JSON: every token has a `$value` and a `$type`, aliases are `{group.token}` paths, and colours carry an explicit colour space so OKLCH survives the trip.

**Category:** Tokens · **Applies to:** token files shared between design tools, build tools and code; `scripts/theme.mjs --format dtcg` · **Priority:** should

## When to use / when not
- Use when tokens must move between tools: Figma variables or Tokens Studio, Style Dictionary, Terrazzo, the DESIGN.md CLI export, or a second codebase.
- Skip it when one CSS file is the only consumer and nothing reads tokens programmatically. Generate it later from `theme.mjs`; don't hand-maintain a JSON copy nobody reads.

## Rules (do)
- **Follow the stable format.** The Design Tokens Community Group published its first stable Format Module as version 2025.10. A token is an object with `$value`; `$type` is required unless a parent group sets it; `$description`, `$extensions` and `$deprecated` are optional. Keys starting with `$` are reserved, and names may not contain `{`, `}` or `.`.
- **Colours are objects, not strings.** Use `{ "colorSpace": "oklch", "components": [L, C, H], "alpha": 1, "hex": "#rrggbb" }`. The `hex` field is an optional fallback for tools that only read sRGB hex; `theme.mjs` always fills it.
- **Dimensions and durations are objects too.** `{ "value": 8, "unit": "px" }` (units `px` or `rem`), `{ "value": 150, "unit": "ms" }`. Cubic Béziers are four-number arrays.
- **Aliases point at tokens, not groups.** `"$value": "{color.light.success-fg}"`. Keep money and chart roles as aliases (`positive → success-fg`, `chart-axis → border-strong`), so a status colour change carries through.
- **Modes as sibling groups.** `theme.mjs` writes `color.light`, `color.dark`, `color.light-hc` and `color.dark-hc` with identical keys. Tools that understand the DTCG Resolver Module can map these groups to modes; tools that don't can still read one group.
- **Resolve what JSON can't express.** CSS `color-mix()` roles become literal colours (`danger-bg`), and translucent roles become a colour plus `alpha` (`hover` = text at alpha 0.05, `scrim` = black at 0.4 or 0.6).
- **Name files `*.tokens.json`**, or `tokens.json` inside a `tokens/` folder, and generate CSS from it with one tool. Style Dictionary v4 and Terrazzo read the DTCG format.
- **Deprecate in the file.** Set `"$deprecated": "use color.light.text"` on an old token for one minor version before removing it (`dsfound-token-architecture.md`).

## Anti-patterns (don't)
- Colours as bare strings (`"$value": "#325ac2"`) in a file that claims to be DTCG 2025.10. Older tools accept it; the stable spec uses the object form, and the string loses the colour space.
- Aliases that point at a group (`{color.light}`) or form a cycle.
- Encoding modes in token names (`text-dark`, `text-light`) instead of groups.
- Editing the JSON by hand when it is a generated output. Change the generator inputs.
- Putting CSS expressions (`color-mix(...)`, `var(--x)`) in `$value`; other tools cannot evaluate them.

## Good references
- [Design Tokens Format Module](https://tr.designtokens.org/format/) — the specification: token and group structure, types, aliases, `$deprecated`.
- [design-tokens/community-group](https://github.com/design-tokens/community-group) — the group's repository, with the issues where the colour object and the resolver were decided.
- [Style Dictionary](https://styledictionary.com/) — a build tool that reads DTCG and writes CSS, iOS and Android outputs.
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) — its CLI exports DESIGN.md front matter to DTCG, so DESIGN.md and DTCG can round-trip (the decision record that points at the token file is `dsref-design-md-format.md`).

## Bad references
- Token JSON exported as `{ "primary": "#325ac2" }` with no `$value` and no type — any consumer must guess what each value is, and dark mode becomes a second file with no shared keys.

## Accessibility
- Keep the verification with the tokens: `theme.mjs --format report` writes every checked pair (WCAG ratio, APCA Lc, pass/fail) next to `tokens.json`. A token file without that report is unverified.
- The `hex` fallback is the sRGB value the checks ran on, so tools that only read hex see the same contrast.

## Motion / interaction (if relevant)
- Durations and easings are tokens too (`duration.micro`, `easing.standard`), so motion stays consistent across platforms.

## Tokens and values
| DTCG type | Value shape | Example from `theme.mjs` |
|---|---|---|
| `color` | `{colorSpace, components, alpha, hex}` | `color.light.text` = oklch `[0.22, 0.02, 250]`, hex `#141b24` |
| `color` (alias) | `"{color.light.success-fg}"` | `color.light.positive` |
| `dimension` | `{value, unit}` | `radius.md` = `{8, "px"}` |
| `duration` | `{value, unit}` | `duration.short` = `{150, "ms"}` |
| `cubicBezier` | `[x1, y1, x2, y2]` | `easing.standard` = `[0.2, 0, 0.38, 0.9]` |
| `fontFamily` | string or array | `font.sans` |

## Implementation sketch
```ts
// Read a theme.mjs tokens.json safely: unknown JSON in, typed tokens out (no `any`).
import { z } from 'zod'

const Oklch = z.object({
  colorSpace: z.literal('oklch'),
  components: z.tuple([z.number(), z.number(), z.number()]),
  alpha: z.number().min(0).max(1),
  hex: z.string().regex(/^#[0-9a-f]{6}$/),
})
const ColorToken = z.object({ $type: z.literal('color'), $value: z.union([Oklch, z.string().regex(/^\{[\w.-]+\}$/)]) })
const Tokens = z.object({ color: z.record(z.string(), z.record(z.string(), ColorToken)) })
type Tokens = z.infer<typeof Tokens>

export function resolveColor(tokens: Tokens, mode: string, name: string, depth = 0): z.infer<typeof Oklch> {
  const token = tokens.color[mode]?.[name]
  if (!token) throw new Error(`no token color.${mode}.${name}`)
  if (typeof token.$value !== 'string') return token.$value
  if (depth > 8) throw new Error(`alias cycle at color.${mode}.${name}`)
  const [, m, n] = token.$value.slice(1, -1).split('.')
  return resolveColor(tokens, m, n, depth + 1)
}

export function parseTokens(input: unknown): Tokens {
  return Tokens.parse(input)
}
```

## Checklist
- [ ] Every token has `$value` and a `$type` (its own or inherited from the group).
- [ ] Colours use the object form with `colorSpace` and a `hex` fallback.
- [ ] Every alias resolves to a token, with no cycles (the `theme.mjs` tests check this).
- [ ] Light and dark groups have the same keys.
- [ ] No CSS expressions in `$value`.
- [ ] The JSON is generated, and the generator inputs are recorded in DESIGN.md.

## Sources
- https://tr.designtokens.org/format/
- https://github.com/design-tokens/community-group
- https://styledictionary.com/
- https://github.com/google-labs-code/design.md (Apache-2.0)
- Repo: `plugins/design-system/skills/design-system/scripts/theme.mjs` (`toDtcg`)
