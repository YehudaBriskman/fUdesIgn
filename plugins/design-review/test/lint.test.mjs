// The static lint must fire every rule on the bad fixtures and stay silent on the good ones.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RULES, lintText } from '../scripts/lint-ui.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** @param {string} dir */
function lint(dir) {
  const run = spawnSync(process.execPath, ['scripts/lint-ui.mjs', join('test/fixtures/lint', dir), '--json'], { cwd: root, encoding: 'utf8' })
  return { status: run.status, report: JSON.parse(run.stdout) }
}

test('lint fires every rule on the bad fixtures', () => {
  const { status, report } = lint('bad')
  assert.equal(status, 1)
  const fired = new Set(report.findings.map((f) => f.id))
  for (const id of Object.keys(RULES)) assert.ok(fired.has(id), `${id} did not fire`)
})

test('lint is clean on the good fixtures', () => {
  const { status, report } = lint('good')
  assert.deepEqual(report.findings, [])
  assert.equal(status, 0)
})

test('an inline waiver silences one line', () => {
  const css = '.a {\n  /* design-review-ignore LU-TRANSITION-ALL */\n  transition: all 1s;\n}\n'
  assert.equal(lintText('x.css', css).length, 0)
  assert.equal(lintText('x.css', css.replace('design-review-ignore', 'note')).length, 1)
})

test('token files may hold raw hex, components may not', () => {
  assert.equal(lintText('tokens.css', ':root { --x: #fff; }\n.a { color: #fff; }').length, 0)
  assert.equal(lintText('card.css', '.a { color: #fff; }').length, 1)
})

test('aria-disabled on a busy button is the fix, not a finding', () => {
  assert.equal(lintText('a.tsx', '<button aria-disabled={isSaving}>Save</button>').length, 0)
  assert.equal(lintText('a.tsx', '<button disabled={isSaving}>Save</button>').length, 1)
})
