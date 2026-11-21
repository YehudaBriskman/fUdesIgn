#!/usr/bin/env python3
"""Regenerate references/INDEX.md for every plugin skill from its pattern files' title, priority and one-line rule.
Clusters are the filename prefixes; the order and headings come from CLUSTERS below (unknown prefixes are appended)."""
import os, re, sys
ROOT = os.path.join(os.path.dirname(__file__), '..', 'plugins')
CLUSTERS = {
    'found': 'Foundations', 'color': 'Colour', 'style': 'Visual style', 'data': 'Data display', 'chart': 'Charts',
    'comp': 'Components and interaction', 'motion': 'Motion and interaction', 'prog': 'Progressive loading and performance',
    'ref': 'References, anti-patterns and review',
}
def row(path, name):
    text = open(path, encoding='utf-8').read()
    lines = text.splitlines()
    title = lines[0].lstrip('# ').strip()
    rule = next((l[2:] for l in lines if l.startswith('> ')), '')
    m = re.search(r"\*\*Priority:\*\*\s*([a-z]+)", text)
    return f"| [{title}](patterns/{name}) | {m.group(1) if m else ''} | {rule.replace('|', chr(92) + '|')} |"
changed = 0
for plugin in sorted(os.listdir(ROOT)):
    skills = os.path.join(ROOT, plugin, 'skills')
    if not os.path.isdir(skills): continue
    for skill in sorted(os.listdir(skills)):
        pdir = os.path.join(skills, skill, 'references', 'patterns')
        if not os.path.isdir(pdir): continue
        files = sorted(f for f in os.listdir(pdir) if f.endswith('.md'))
        groups = {}
        for f in files: groups.setdefault(f.split('-')[0], []).append(f)
        order = [p for p in CLUSTERS if p in groups] + [p for p in groups if p not in CLUSTERS]
        out = ['# Pattern index', '', f'{len(files)} patterns. **Priority:** must = always apply · should = apply unless there is a reason not to · nice = optional.', '']
        for p in order:
            out += [f'## {CLUSTERS.get(p, p)} (`{p}-`)', '', '| Pattern | Priority | Rule |', '|---|---|---|']
            out += [row(os.path.join(pdir, f), f) for f in groups[p]] + ['']
        target = os.path.join(skills, skill, 'references', 'INDEX.md')
        new = '\n'.join(out)
        if not os.path.exists(target) or open(target, encoding='utf-8').read() != new:
            if '--check' in sys.argv: print(f'stale: {target}'); changed += 1
            else: open(target, 'w', encoding='utf-8').write(new); print(f'wrote {target}')
sys.exit(1 if changed else 0)
