#!/usr/bin/env node
// Validate pattern files: template sections, internal links, link syntax, the `any` ban and code sketches.
// Usage (from tools/): npm run check  ·  npm run check:sketches
// --dir <skill dir, relative to the repo root> checks another plugin's skill (default: dashboard-ui).
// The --sketches mode needs `typescript`, `@types/react` and `lightningcss` resolvable (set NODE_PATH to their node_modules).
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'

const ROOT = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const dirAt = args.indexOf('--dir')
const SKILL = resolve(ROOT, dirAt >= 0 ? args[dirAt + 1] ?? '' : 'plugins/dashboard-ui/skills/dashboard-ui-design')
const DIR = join(SKILL, 'references/patterns')
if (!existsSync(DIR)) { console.log(`no patterns folder at ${DIR}`); process.exit(1) }
const SECTIONS = ['## When to use', '## Rules', '## Anti-patterns', '## Good references', '## Bad references',
  '## Accessibility', '## Tokens and values', '## Implementation sketch', '## Checklist', '## Sources']
// cluster prefixes of every plugin: dashboard-ui, forms-ui, marketing-ui, motion-ui, ai-ui, mobile-ui, design-system, i18n-rtl, then accessibility, then components-ui
const PREFIXES = ['found', 'color', 'style', 'data', 'chart', 'comp', 'motion', 'prog', 'ref',
  'ffound', 'finput', 'fvalid', 'fflow', 'fref',
  'mkfound', 'mksect', 'mkstyle', 'mkperf', 'mkref',
  'mfound', 'mspring', 'mgesture', 'mtrans', 'mperf', 'mref',
  'aifound', 'aichat', 'aiinline', 'aiagent', 'airef',
  'mofound', 'monav', 'moinput', 'moplat', 'moref',
  'dsfound', 'dstoken', 'dsmap', 'dsref',
  'rtl', 'i18n', 'iref',
  'a11y', 'aaria', 'atest', 'alaw', 'aref',
  'cpfound', 'cpover', 'cpctl', 'cpref']
const LINK = new RegExp(`\\b((?:${PREFIXES.join('|')})-[a-z0-9-]+\\.md)\\b`, 'g')

const sketches = args.includes('--sketches')
const files = args.filter((a, i) => !a.startsWith('--') && (dirAt < 0 || i !== dirAt + 1)).map((f) => basename(f))
const all = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()
// cross-links may point at a pattern in any plugin of this repo
const plugins = join(ROOT, 'plugins')
const known = new Set(readdirSync(plugins).flatMap((p) => {
  const skills = join(plugins, p, 'skills')
  return existsSync(skills) ? readdirSync(skills).flatMap((s) => {
    const d = join(skills, s, 'references/patterns')
    return existsSync(d) ? readdirSync(d) : []
  }) : []
}))
const targets = files.length ? files : all
const problems = []
const fail = (file, msg) => problems.push(`${file}: ${msg}`)

for (const f of targets) {
  const text = readFileSync(join(DIR, f), 'utf8')
  const lines = text.split('\n')
  if (!PREFIXES.some((p) => f.startsWith(`${p}-`))) fail(f, 'unknown cluster prefix')
  if (!lines[0].startsWith('# ')) fail(f, 'first line must be the "# Title"')
  if (!lines.some((l) => l.startsWith('> '))) fail(f, 'missing the one-sentence "> rule"')
  if (!/\*\*Priority:\*\*\s*(must|should|nice)\b/.test(text)) fail(f, 'missing **Priority:** must|should|nice')
  for (const s of SECTIONS) if (!lines.some((l) => l.startsWith(s))) fail(f, `missing section "${s}"`)
  // internal cross-links must resolve
  for (const m of text.matchAll(LINK))
    if (!known.has(m[1])) fail(f, `broken cross-link ${m[1]}`)
  // markdown links whose URL contains an unescaped "(" break rendering
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]*\([^)\s]*)\)/g)) fail(f, `unescaped "(" in link ${m[1]} (use %28 %29)`)
  // the `any` type is banned in sketches
  for (const block of text.matchAll(/```(ts|tsx)\n([\s\S]*?)```/g))
    if (/(:\s*any\b|<any>|as any\b|any\[\])/.test(block[2])) fail(f, 'uses the `any` type in a TS sketch')
}

if (sketches) {
  const require = createRequire(import.meta.url)
  const ts = require('typescript')
  const { transform } = require('lightningcss')
  // sketches import real packages, so compile them next to the node_modules that NODE_PATH points at
  const work = process.env.NODE_PATH ? join(process.env.NODE_PATH, '..', `.fud-sketches-${process.pid}`) : join(tmpdir(), `fud-sketches-${process.pid}`)
  mkdirSync(work, { recursive: true })
  const tsFiles = []
  for (const f of targets) {
    const text = readFileSync(join(DIR, f), 'utf8')
    let i = 0
    for (const m of text.matchAll(/```(css|ts|tsx)\n([\s\S]*?)```/g)) {
      i += 1
      const [, lang, code] = m
      if (lang === 'css') {
        try { transform({ filename: 'x.css', code: Buffer.from(code), errorRecovery: false }) }
        catch (e) { fail(f, `css block ${i}: ${e.message}`) }
      } else {
        // each block is a module; fragments that only declare are fine
        const name = join(work, `${f.replace('.md', '')}__${i}.${lang}`)
        writeFileSync(name, `export {}\n${code}`)
        tsFiles.push([name, f, i])
      }
    }
  }
  // the skill's starter stylesheets (tokens.css, forms.css, …) must parse too
  const assets = join(SKILL, 'assets')
  if (existsSync(assets)) for (const css of readdirSync(assets).filter((n) => n.endsWith('.css'))) {
    try { transform({ filename: css, code: readFileSync(join(assets, css)), errorRecovery: false }) }
    catch (e) { fail(`assets/${css}`, e.message) }
  }
  if (tsFiles.length) {
    const program = ts.createProgram(tsFiles.map(([n]) => n), {
      strict: true, noEmit: true, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler, lib: ['lib.es2023.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      skipLibCheck: true, noUnusedLocals: false, isolatedModules: true,
      typeRoots: [join(process.env.NODE_PATH ?? '', '@types')],
    })
    for (const d of ts.getPreEmitDiagnostics(program)) {
      const owner = tsFiles.find(([n]) => n === d.file?.fileName)
      const msg = ts.flattenDiagnosticMessageText(d.messageText, ' ')
      if (owner) fail(owner[1], `ts block ${owner[2]}: ${msg}`)
    }
  }
  rmSync(work, { recursive: true, force: true })
}

// Plugin stylesheets are self-sufficient: they declare the dashboard-ui role tokens they read in a
// zero-specificity `:where(:root)` block (light-dark() for themed roles). Those values, and any inverse
// band, must equal dashboard-ui's tokens.css so the plugins never drift apart.
const TOKENS = join(ROOT, 'plugins/dashboard-ui/skills/dashboard-ui-design/assets/tokens.css')
const assetDir = join(SKILL, 'assets')
if (!files.length && existsSync(TOKENS) && existsSync(assetDir) && resolve(assetDir, 'tokens.css') !== TOKENS) {
  const norm = (v) => v.replace(/\s+/g, ' ').trim()
  const decls = (body) => Object.fromEntries([...body.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], norm(m[2])]))
  const tokens = readFileSync(TOKENS, 'utf8')
  const light = decls(tokens.match(/\n:root \{([\s\S]*?)\n\}/)[1])
  const dark = decls(tokens.match(/\n:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1])
  for (const css of readdirSync(assetDir).filter((n) => n.endsWith('.css'))) {
    const text = readFileSync(join(assetDir, css), 'utf8')
    for (const m of text.matchAll(/(?:^|\n):where\(:root\) \{([\s\S]*?)\n\}/g))
      for (const [name, value] of Object.entries(decls(m[1]))) {
        if (!(name in light)) continue
        const d = dark[name] ?? light[name]
        const want = d === light[name] ? light[name] : `light-dark(${light[name]}, ${d})`
        if (value !== want) fail(`assets/${css}`, `${name} is "${value}", dashboard-ui tokens.css gives "${want}"`)
      }
    for (const m of text.matchAll(/\n\[data-tone="inverse"\] \{([\s\S]*?)\n\}/g))
      for (const [name, value] of Object.entries(decls(m[1])))
        if (name in dark && value !== dark[name]) fail(`assets/${css}`, `inverse ${name} is "${value}", dashboard-ui dark gives "${dark[name]}"`)
  }
}

// INDEX.md must list every pattern
const index = readFileSync(join(SKILL, 'references/INDEX.md'), 'utf8')
if (!files.length) for (const f of all) if (!index.includes(`patterns/${f}`)) fail('INDEX.md', `does not list ${f}`)

// SKILL.md routes to pattern files by name, so every name it mentions must exist
const skillMd = join(SKILL, 'SKILL.md')
if (!files.length && existsSync(skillMd))
  for (const m of readFileSync(skillMd, 'utf8').matchAll(LINK))
    if (!known.has(m[1])) fail('SKILL.md', `routes to missing pattern ${m[1]}`)

if (problems.length) { console.log(problems.join('\n')); console.log(`\n${problems.length} problem(s)`); process.exit(1) }
console.log(`ok: ${basename(SKILL)}: ${targets.length} pattern file(s)${sketches ? ' incl. sketches' : ''}`)
