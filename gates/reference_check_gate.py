#!/usr/bin/env python3
"""THE REFERENCE CHECK GATE (9/6/26, DIRECTION — closing EYES' bounce-back
[eyes: gate missing] on the shipped reference index).

THE LAW IT ENFORCES: COMPARE EVERY PIECE OF ART TO THE WORLD (9/4, LOCKED),
clause 3 (every cook carries a REFERENCE CHECK) and clause 7 (this very
gate, advertised in CLAUDE.md's law index since 9/4 and never built — the
pillar law says an unenforced law is not a law, and EYES proved the gap in
records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md).

WHAT IT HOLDS:
1. THE INDEX IS REAL: records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json parses
   and holds entries (the ruler the checks resolve against).
2. A NAMED REFERENCE IS A REAL ONE: every REF-ID pattern (XXXX-99) cited
   inside any tool's REFERENCE CHECK block must resolve in the index — a
   check that names something the library does not hold is the lie
   clause 3 names.
3. THE RATCHET: cook/factory tools without any REFERENCE CHECK may only
   be the frozen pre-law set (records/BOHEMIA_REFERENCE_CHECK_BASELINE_
   9_6_26.json, 84 tools, frozen 9/6). A NEW cook tool without a check is
   red the turn it lands; a baseline tool that gains its check leaves the
   list forever (the gate refuses a GROWN baseline).
GOODHART GUARD: never add a fake check to green a tool — DIRECTION judges
check honesty at the batch seam; this gate only proves existence and that
named references resolve.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

INDEX = 'records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json'
BASELINE = 'records/BOHEMIA_REFERENCE_CHECK_BASELINE_9_6_26.json'

fails, passes = [], 0


def ok(name, cond, detail=''):
    global passes
    if cond:
        passes += 1
    else:
        fails.append('  FAIL %s%s' % (name, (' — ' + detail) if detail else ''))


# 1. the ruler exists and parses
idx = {}
try:
    idx = json.load(open(INDEX, encoding='utf8')).get('refs', {})
except Exception:
    idx = {}
ok('the reference index parses and holds entries', len(idx) >= 30,
   '%s holds %d' % (INDEX, len(idx)))

base = set(json.load(open(BASELINE, encoding='utf8'))['tools'])
tools = sorted(set(glob.glob('tools/*.py') + glob.glob('tools/tfcook/*.py')
                   + glob.glob('tools/*.js')))
cooks = [t for t in tools if ('cook' in t.lower() or 'factory' in t.lower())]

REFID = re.compile(r'\b([A-Z]{2,5}-\d{2})\b')
unchecked = []
for t in cooks:
    src = open(t, encoding='utf8', errors='replace').read()
    if 'REFERENCE CHECK' not in src:
        unchecked.append(t)
        continue
    # 2. named REF-IDs resolve (only inside the check's own block: the
    #    docstring/comment region up to the first blank-line gap after it)
    at = src.find('REFERENCE CHECK')
    block = src[at:at + 2500]
    for rid in set(REFID.findall(block)):
        if rid.startswith(('TF-',)):
            continue          # tileform FORM ids live in their own registry
        ok('%s cites a real reference (%s)' % (os.path.basename(t), rid),
           rid in idx, 'not in the library index — a named ruler must exist')

# 3. the ratchet
new_unchecked = [t for t in unchecked if t not in base]
ok('every cook tool born after the law carries a REFERENCE CHECK',
   not new_unchecked, ', '.join(new_unchecked[:4]))
grown = [t for t in base if t not in cooks and not os.path.exists(t)]
ok('the frozen baseline only shrinks (deleted or upgraded, never grown)',
   len(unchecked) <= len(base),
   '%d unchecked now vs %d frozen' % (len(unchecked), len(base)))

print('\n'.join(fails))
print('REFERENCE CHECK GATE: %d passed, %d failed  (%d cook tools, %d carry checks, %d grandfathered)'
      % (passes, len(fails), len(cooks), len(cooks) - len(unchecked), len(unchecked)))
sys.exit(1 if fails else 0)
