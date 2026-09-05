#!/usr/bin/env python3
"""THE REFERENCE INDEX (9/5/26, DIRECTION lane — VAMILY [reference index]).

The compare law's gate half needs a ruler: a cook's `REFERENCE CHECK:` that
names a reference must name a REAL one, and "real" has to be checkable by a
machine. This derives the index from the library itself — every `### REF-ID`
entry in reference/library/*/INDEX.md becomes a row with its folder, name,
where, kind and the structural rule it teaches. reference_check_gate (SHARED's
row, when it lands) resolves REF-IDs against this file; until then the index
is also the human table of contents.

DERIVED, NEVER TYPED: edit the library, re-run this. The tool FAILS on a
malformed entry rather than skipping it, because an entry the parser drops
silently is a reference a cook can no longer cite.

REUSE CHECK: reads reference/library/ only; cooks no pixels; writes one JSON.

  python3 tools/bohemia_reference_index.py
    -> records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json
"""
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

OUT = 'records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json'

rows = {}
files = sorted(glob.glob('reference/library/*/INDEX.md'))
if not files:
    sys.exit('REFERENCE INDEX: no library folders found — the library ships first.')
for f in files:
    kind_folder = f.split('/')[2]
    s = open(f, encoding='utf8').read()
    for blk in s.split('\n### ')[1:]:
        m = re.match(r'([A-Z]+-\d\d)\s\s(.+)', blk)
        if not m:
            sys.exit('REFERENCE INDEX: malformed entry header in %s: %r' % (f, blk[:50]))
        rid, name = m.group(1), m.group(2).strip()
        fields = dict(re.findall(r'^- (WHERE|KIND|TEACHES): (.+)$', blk, re.M))
        for req in ('WHERE', 'KIND', 'TEACHES'):
            if req not in fields:
                sys.exit('REFERENCE INDEX: %s in %s is missing %s' % (rid, f, req))
        if rid in rows:
            sys.exit('REFERENCE INDEX: duplicate id %s (%s and %s)' % (rid, rows[rid]['file'], f))
        rows[rid] = {'name': name, 'folder': kind_folder, 'file': f,
                     'where': fields['WHERE'], 'kind': fields['KIND'],
                     'teaches': fields['TEACHES']}

json.dump({'law': 'COMPARE EVERY PIECE OF ART TO THE WORLD 9/4/26 — the gate ruler',
           'format': 'a REFERENCE CHECK cites entries by these ids',
           'refs': rows}, open(OUT, 'w', encoding='utf8'), indent=1)
print('wrote %s: %d references across %d kinds'
      % (OUT, len(rows), len({r['folder'] for r in rows.values()})))
