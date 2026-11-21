#!/usr/bin/env python3
"""Regenerate references/INDEX.md for every plugin skill from its pattern files' title, priority and one-line rule.
Clusters are the filename prefixes; the order and headings come from CLUSTERS below (unknown prefixes are appended)."""
import os, re, sys
ROOT = os.path.join(os.path.dirname(__file__), '..', 'plugins')
CLUSTERS = {
    'found': 'Foundations', 'color': 'Colour', 'style': 'Visual style', 'data': 'Data display', 'chart': 'Charts',
    'comp': 'Components and interaction', 'motion': 'Motion and interaction', 'prog': 'Progressive loading and performance',
    'ref': 'References, anti-patterns and review',
    'aifound': 'AI foundations', 'aichat': 'Chat and conversation', 'aiinline': 'Inline AI in documents, forms and dashboards',
    'aiagent': 'Agents and human in the loop', 'airef': 'AI references, anti-patterns and review',
    'ffound': 'Foundations: layout, labels, required/optional, accessibility, microcopy',
    'finput': 'Inputs: types and autofill, choice controls, selects and comboboxes, money/number/phone, dates, file upload',
    'fvalid': 'Validation: timing and inline errors, error summary and focus, error messages',
    'fflow': 'Flows: submission and double submit, multi-step and saving progress, authentication and passkeys',
    'fref': 'References: anti-pattern catalogue, review rubric',
    'mkfound': 'Foundations: narrative, conversion, accessibility', 'mksect': 'Sections: hero, proof, features, pricing, FAQ, footer',
    'mkstyle': 'Style: type, colour, dark sections, motion, generated-default tells',
    'mkperf': 'Performance and SEO: LCP, fonts, metadata', 'mkref': 'References: anti-pattern gallery and review rubric',
    'mfound': 'Foundations: purpose, timing, choreography, reduced motion', 'mspring': 'Springs',
    'mgesture': 'Gestures and direct manipulation', 'mtrans': 'Transitions and micro-interactions',
    'mperf': 'Performance', 'mref': 'Review and references',
    'mofound': 'Foundations: reach, targets, viewport, type, colour, layout', 'monav': 'Navigation, overlays and gestures',
    'moinput': 'Input and feedback', 'moplat': 'Platform: PWA, performance, native conventions', 'moref': 'Review: rubric and anti-patterns',
    'dsfound': 'Foundations: token architecture and profiles', 'dstoken': 'Tokens: format, theming and scales',
    'dsmap': 'Stack mapping', 'dsref': 'Reference: decision record, governance, anti-patterns',
}
# optional routing note printed under the count line, keyed by skill folder name
NOTES = {
    'motion-ui': "Motion for data (number tweening, chart transitions, linked exploration, loading states) lives in dashboard-ui's `motion-*` and `prog-*` patterns; these files cover general product-UI motion and link there instead of repeating it.",
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
        if skill in NOTES: out += [NOTES[skill], '']
        for p in order:
            out += [f'## {CLUSTERS.get(p, p)} (`{p}-`)', '', '| Pattern | Priority | Rule |', '|---|---|---|']
            out += [row(os.path.join(pdir, f), f) for f in groups[p]] + ['']
        target = os.path.join(skills, skill, 'references', 'INDEX.md')
        new = '\n'.join(out)
        if not os.path.exists(target) or open(target, encoding='utf-8').read() != new:
            if '--check' in sys.argv: print(f'stale: {target}'); changed += 1
            else: open(target, 'w', encoding='utf-8').write(new); print(f'wrote {target}')
sys.exit(1 if changed else 0)
