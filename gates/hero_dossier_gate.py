#!/usr/bin/env python3
"""BOHEMIA HERO DOSSIER GATE (Paolo 7/24/26, LOCKED) — "you shouldn't be making
any buildings if you can't talk about and write about all the parts of the
buildings you said you made."

DOSSIER-OR-DON'T: every hero in the bank must have its parts written up. This
gate fails if any baked hero has no dossier entry, or if the dossier is stale
(missing a district that's in the bank). It also checks each entry actually
describes multiple parts (not a one-liner) and names the walkable-district
landmarks it mirrors (a "code N" reference), so the dossier stays honest to the
engine module rather than hand-waving.

  python3 gates/hero_dossier_gate.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
DOSSIER = 'records/BOHEMIA_DISTRICT_HERO_DOSSIER.md'

pass_n = fail_n = 0


def ok(name, cond):
    global pass_n, fail_n
    if cond:
        pass_n += 1
    else:
        fail_n += 1
        print('  FAIL:', name)


bank = json.load(open(BANK))
districts = [h['district'] for h in bank['heroes']]

ok('dossier file exists', os.path.exists(DOSSIER))
if not os.path.exists(DOSSIER):
    print('HERO DOSSIER GATE: %d passed, %d failed' % (pass_n, fail_n)); sys.exit(1)

text = open(DOSSIER, encoding='utf8').read()
# split into per-district sections keyed by the "## NAME" header
sections = {}
cur = None
for line in text.splitlines():
    m = re.match(r'## (\w+)', line)
    if m:
        cur = m.group(1).lower(); sections[cur] = []
    elif cur is not None:
        sections[cur].append(line)

for d in districts:
    body = '\n'.join(sections.get(d, []))
    parts = [l for l in body.splitlines() if l.strip().startswith('- ')]
    ok('%s: has a dossier section' % d, d in sections)
    ok('%s: multiple parts documented (>=3)' % d, len(parts) >= 3)
    ok('%s: parts name the walkable landmarks (code refs)' % d, 'code' in body)

print('HERO DOSSIER GATE: %d passed, %d failed (%d districts)' % (pass_n, fail_n, len(districts)))
sys.exit(1 if fail_n else 0)
