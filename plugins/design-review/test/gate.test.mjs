// The rendered gate must fail every detector on bad.html and pass good.html at zero.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DETECTORS } from '../scripts/lib/detectors.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** @param {string} fixture */
function gate(fixture) {
  const out = mkdtempSync(join(tmpdir(), 'design-review-'))
  const run = spawnSync(process.execPath, ['scripts/gate.mjs', '--url', join('test/fixtures', fixture), '--out', out, '--settle-ms', '300'], { cwd: root, encoding: 'utf8', timeout: 240000 })
  assert.notEqual(run.status, 2, run.stderr)
  const report = JSON.parse(readFileSync(join(out, 'gate.json'), 'utf8'))
  const md = readFileSync(join(out, 'gate.md'), 'utf8')
  return { status: run.status, report, md }
}

test('gate fails bad.html on every detector', () => {
  const { status, report, md } = gate('bad.html')
  assert.equal(status, 1)
  assert.equal(report.pass, false)
  const fired = new Set(report.findings.map((f) => f.id))
  for (const id of Object.keys(DETECTORS)) assert.ok(fired.has(id), `${id} did not fire on bad.html`)
  assert.match(md, /^# Design gate: FAIL/)
})

test('gate passes good.html at zero', () => {
  const { status, report } = gate('good.html')
  assert.deepEqual(report.findings, [])
  assert.equal(report.pass, true)
  assert.equal(status, 0)
})
