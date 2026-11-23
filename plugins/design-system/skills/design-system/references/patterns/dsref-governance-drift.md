# Governance and drift detection

> Make drift visible by machine: lint for raw values outside the token files, regenerate and diff the tokens in CI, and require a recorded reason for every exception, so consistency does not depend on anyone remembering the rules.

**Category:** Reference · **Applies to:** workflow step 6; CI; code review; every later session · **Priority:** should

## When to use / when not
- Use once the token files exist and DESIGN.md is written. Start with the cheap checks (grep, regenerate-and-diff) and add stylelint and visual tests as the project grows.
- For a one-week prototype, skip CI and run the grep by hand before handing over.

## Rules (do)
- **Define drift precisely.** Drift is any of:
  1. a colour, size or radius literal outside the token files;
  2. a token file that differs from what the generator produces from the recorded inputs;
  3. DESIGN.md front matter that differs from the generated tokens;
  4. a deviation in code that is not in DESIGN.md's Deviations table;
  5. a role used against its meaning (`--danger-fg` as a brand colour).
- **Check 1: raw literals.** Fail CI on hex, `rgb()`, `hsl()` and `oklch()` literals and on arbitrary Tailwind values (`-[#`, `-[13px]`) outside the token files. Stylelint's `color-no-hex` and `declaration-property-value-disallowed-list` cover CSS; a grep covers class names in TSX. Allowlist the token files and nothing else.
- **Check 2: regenerate and diff.** In CI, run `theme.mjs` with the inputs recorded in DESIGN.md into a temporary folder and diff against the committed files. Any difference means someone hand-edited an output (the DTCG file is one of them: `dstoken-dtcg-format.md`), or changed inputs without regenerating. The generator also exits 1 if contrast or gamut checks fail, so a contrast regression cannot merge.
- **Check 3: DESIGN.md.** Run `npx @google/design.md lint DESIGN.md`; on pull requests run `npx @google/design.md diff` between the base and head versions (exit 1 on a regression).
- **Check 4: exceptions are recorded.** Inline waivers in code (`/* ds-allow: decorative chart halo, see DESIGN.md Deviations #3 */`) must point at a Deviations row. CI fails on waivers without a matching row and reports rows whose waiver no longer exists (stale exceptions).
- **Track a drift count, don't hide it.** When adopting the system in an existing codebase, record the starting count of raw literals and make CI fail only if it rises. Burn it down per page; note progress in the decision log.
- **Version and review changes to tokens.** A token change is a pull request that updates inputs, regenerated files, DESIGN.md (front matter and decision log) and the version together (`dsfound-token-architecture.md`).
- **In each agent session (workflow step 6):** read DESIGN.md, run the raw-literal check on the files you are about to change, and finish by running it again. New exceptions go into Deviations with a reason before the work is called done.

## Anti-patterns (don't)
- "We'll catch it in review." Reviewers miss `#3b82f6` in a 400-line diff.
- Allowlisting whole folders (`src/legacy/**`) forever, without a count or an owner.
- Exceptions agreed in chat and never recorded.
- Regenerating tokens locally with different inputs than DESIGN.md records.
- Snapshot tests of computed styles that are updated blindly whenever they fail.

## Good references
- [Stylelint – color-no-hex](https://stylelint.io/user-guide/rules/color-no-hex/) and [declaration-property-value-disallowed-list](https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/) — built-in rules that make raw values a lint error.
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) — `lint` and `diff` commands with JSON output and non-zero exit codes for CI.
- [Atlassian – Design tokens](https://atlassian.design/foundations/tokens/design-tokens) — token adoption backed by lint rules and automated migration of deprecated tokens.

## Bad references
- Design systems that publish a Figma library and a written guideline but no code checks — adoption is measured by surveys, and drift is found by accident.

## Accessibility
- The regenerate-and-diff check is also an accessibility check: the generator refuses themes that fail contrast or gamut.
- Lint for `outline: none` and `outline: 0` without a `:focus-visible` replacement.
- Visual regression includes the dark and high-contrast themes, not only light.

## Motion / interaction (if relevant)
- Lint for raw durations and easings (`transition: all 0.3s ease`) the same way as colours; they should be motion tokens.

## Tokens and values
| Check | Command | Fails when |
|---|---|---|
| Raw literals | grep or stylelint (sketch below) | a literal outside token files, or the count rises |
| Regenerate and diff | `node theme.mjs --config design/theme.json --out "$TMP" --format css,tailwind,dtcg && diff -r "$TMP" design/tokens` | any difference; generator exit 1 |
| DESIGN.md | `npx @google/design.md lint DESIGN.md` | errors |
| DESIGN.md regression | `npx @google/design.md diff base.md DESIGN.md` | exit 1 |
| Waivers | grep `ds-allow:` vs Deviations rows | missing or stale rows |

## Implementation sketch
```ts
// check-drift.ts: count raw colour literals and arbitrary utility values outside the token files.
// Pure function over { path: contents }, so it runs in Node (read the files first) or in a test.
const TOKEN_FILES = new Set(['design/tokens/tokens.css', 'design/tokens/tailwind.css', 'design/tokens/shadcn.css'])
const SOURCE = /\.(css|scss|tsx?|jsx?|vue|svelte)$/
const RAW = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(|-\[(?:#|\d+px)/
const WAIVER = /ds-allow:/

export type DriftHit = { file: string; line: number; text: string }

export function countDrift(files: ReadonlyMap<string, string>): DriftHit[] {
  const hits: DriftHit[] = []
  for (const [file, contents] of files) {
    if (TOKEN_FILES.has(file) || !SOURCE.test(file)) continue
    contents.split('\n').forEach((text: string, i: number) => {
      if (!WAIVER.test(text) && RAW.test(text)) hits.push({ file, line: i + 1, text: text.trim() })
    })
  }
  return hits
}
// CI: fail if countDrift(files).length is above the baseline recorded in DESIGN.md.
```

## Checklist
- [ ] CI fails on new raw colour, size and arbitrary utility values outside the token files.
- [ ] CI regenerates tokens from the recorded inputs and diffs them against the committed files.
- [ ] DESIGN.md is linted, and diffed on pull requests.
- [ ] Every waiver in code has a Deviations row, and stale rows are reported.
- [ ] A drift baseline exists for legacy code and only goes down.
- [ ] Token changes update inputs, outputs, DESIGN.md and the version in one pull request.

## Sources
- https://stylelint.io/user-guide/rules/color-no-hex/
- https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/
- https://github.com/google-labs-code/design.md (Apache-2.0)
- https://atlassian.design/foundations/tokens/design-tokens
- https://semver.org/
