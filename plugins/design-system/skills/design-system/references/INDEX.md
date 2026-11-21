# Pattern index

11 patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.

## Foundations: token architecture and profiles (`dsfound-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Domain and product-type profiles](patterns/dsfound-domain-profiles.md) | should | Start the system from the profile whose users and constraints match the product (finance, analytics, dev tools, consumer, marketing, health), take its generator inputs and rules, and record the evidence that chose it; change a default only with a recorded reason. |
| [Token architecture: primitive → semantic → component, naming and versioning](patterns/dsfound-token-architecture.md) | must | Keep three token tiers with references pointing one way only (components → semantic roles → primitives), name each tier by what it is for, and version the token set like a public API. |

## Tokens: format, theming and scales (`dstoken-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Generating dark mode](patterns/dstoken-dark-mode-generation.md) | must | Generate dark mode as its own theme from the same inputs: dark grey surfaces that get lighter as they rise, lighter and less saturated foregrounds, and contrast checked with APCA as well as WCAG 2, because WCAG 2 overstates contrast on dark backgrounds. |
| [DTCG token format](patterns/dstoken-dtcg-format.md) | should | Exchange tokens as W3C Design Tokens (DTCG) JSON: every token has a `$value` and a `$type`, aliases are `{group.token}` paths, and colours carry an explicit colour space so OKLCH survives the trip. |
| [Spacing and radius scales](patterns/dstoken-spacing-radius-scales.md) | must | Use one 4px-based, non-linear spacing scale and one radius scale derived from a single base, with density changing which steps components use rather than the steps themselves. |
| [Theming and multi-brand](patterns/dstoken-theming-multi-brand.md) | should | A theme or a brand is a different set of inputs to the same generator, applied by swapping the role tier under one attribute; components and role names never change per brand. |
| [Generating a typography scale](patterns/dstoken-typography-scale.md) | must | Generate the type scale from a base size and one ratio chosen for the product's density, in rem, with line height falling as size rises; keep the scale short and name steps by role. |

## Stack mapping (`dsmap-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Mapping tokens to the stack (Tailwind v4, shadcn/ui, CSS Modules, vanilla CSS, MUI)](patterns/dsmap-stack-mappings.md) | must | Keep the generated role tokens as the single source and expose them through each stack's native mechanism (Tailwind `@theme`, shadcn variables, MUI `createTheme`), so components use the stack's idiom while every value still comes from one verified file. |

## Reference: decision record, governance, anti-patterns (`dsref-`)

| Pattern | Priority | Rule |
|---|---|---|
| [Design-system anti-patterns](patterns/dsref-anti-patterns.md) | must | Check a design system against these twelve failures before calling it done; each one names how to detect it and the pattern that fixes it. |
| [DESIGN.md: the design decision record](patterns/dsref-design-md-format.md) | must | Keep one `DESIGN.md` at the project root: machine-readable tokens in YAML front matter (the Google DESIGN.md format) and a prose record of every decision, per-page override and deviation, each with its reason, so later sessions reuse decisions instead of re-inventing them. |
| [Governance and drift detection](patterns/dsref-governance-drift.md) | should | Make drift visible by machine: lint for raw values outside the token files, regenerate and diff the tokens in CI, and require a recorded reason for every exception, so consistency does not depend on anyone remembering the rules. |
