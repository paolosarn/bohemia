#!/usr/bin/env python3
"""
BOHEMIA RIG NO-DRIFT GATE (7/31/26)

Paolo, shipping a corrected rig export:
  "heres a new proper export of the rig there was a stray pixel on the right leg.
   i had to fix. THE RIG IS LAW FOREVER NEVER TO BE DRIFTED FROM"

He had to hand-fix ONE PIXEL -- 2499 on NE LEG-R -- and that is the whole reason
this gate exists. His painted body is 5,246 pixels across 8 facings and 12 parts.
A single wrong one is invisible in review, survives every other gate, and gets
carried forward forever by whoever copies the file next. RIG LAW already says his
painted regions are sacrosanct; it had no fingerprint, so "sacrosanct" was a
promise instead of a fact.

WHAT THIS PINS. A sha256 over BAKED.layers, canonicalised (sorted keys, no
whitespace) so formatting cannot move it and only real pixel changes can. Plus
the per-facing pixel counts, so a failure says WHERE it drifted instead of just
"the hash moved".

    layers sha256   25a5448330ea0021ac7be78f2ba8c4f31f9ba00f3259aa71ebbf53fe760936e3
    total painted   5248
    S 715  SE 657  E 598  NE 639  N 717  NW 657  W 598  SW 667

RE-PINNED 8/1/26, AND THIS IS THE ONLY TIME IT HAS MOVED WITHOUT AN EXPORT.
Paolo, asked directly whether to delete the leftover ear pixels on NE/NW or send a
fresh export, answered: "Delete them yourself". Ten pixels changed, all inside his
own silhouette: four FACE pixels on each of NE and NW became HEAD, and the one-pixel
HOLE he left at row 10 of each was filled with HEAD. Nothing was added to or removed
from the outline -- the counts move +1 per side purely from filling the two gaps.
Tool: tools/bohemia_rig_delete_ear_remnant_8_1.py. Record:
records/rig/EAR_REMNANT_DELETED_8_1_26.txt. Previous pin, for the audit trail:
sha 1208890003f42d0d..., total 5246, NE 638, NW 656.

HOW TO CHANGE THE RIG, and this is the only way: Paolo exports from his rig tool,
a transcriber tool applies it VERBATIM, and the constants below are updated IN
THE SAME COMMIT with his export saved under records/rig/. Anything else that
moves this hash is drift, and drift is exactly what he just had to fix by hand.

NOT A LICENCE TO EDIT: this gate proving green does not make a rig edit legal.
Only his export does. The hash exists so an ACCIDENT is caught, not so a
deliberate change is easier -- Claude never authors rig pixels, ever
(laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md, and the woman-rig v1-v4
post-mortem is what happens when that slips).

  python3 gates/rig_no_drift_gate.py
"""
import hashlib
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
EXPORT = 'records/rig/RIG_FACE_7_31_26.json'

# HIS RIG, 7/31/26. Only his export may move these.
SHA = '25a5448330ea0021ac7be78f2ba8c4f31f9ba00f3259aa71ebbf53fe760936e3'
TOTAL = 5248
PER_DIR = {'S': 715, 'SE': 657, 'E': 598, 'NE': 639,
           'N': 717, 'NW': 657, 'W': 598, 'SW': 667}
PARTS = 12
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))


print('=== RIG NO-DRIFT GATE ===')

src = open(ALPHA, encoding='utf8').read()
# 2X RE-BLESS (8/20): after the flip the literal is WRAPPED -- `const BAKED=RIG2X({...})`
# -- and an anchored `const BAKED=(\{...\});` matched nothing, so this reported his rig
# as ABSENT on a build where it is present and doubled. The optional wrapper is accepted;
# the sha256 pin below still hashes THE LITERAL HE PAINTED, byte for byte, which is the
# claim. Nothing is weakened: RIG2X only wraps at load, it never edits the literal, and
# --unflip round-trips to the same bytes.
m = re.search(r'^const BAKED=(?:RIG2X\()?(\{.*?\})\)?;?$', src, re.M)
check('BAKED is present in the alpha', bool(m))
if not m:
    print('=== %d passed / %d failed ===' % (passed, len(failed)))
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)

baked = json.loads(m.group(1))
layers = baked['layers']

# structure first, so a failure reads as "NE lost a part" not just "hash moved"
check('all 8 facings are painted', sorted(layers.keys()) == sorted(DIRS),
      'found: ' + ', '.join(sorted(layers.keys())))
for d in DIRS:
    if d not in layers:
        continue
    check('%s carries all %d parts' % (d, PARTS), len(layers[d]) == PARTS,
          '%d parts' % len(layers[d]))
    got = sum(len(v) for v in layers[d].values())
    check('%s is %d painted pixels' % (d, PER_DIR[d]), got == PER_DIR[d],
          'got %d (%+d)' % (got, got - PER_DIR[d]))

total = sum(len(v) for d in layers.values() for v in d.values())
check('the whole body is %d painted pixels' % TOTAL, total == TOTAL,
      'got %d (%+d)' % (total, total - TOTAL))

# HIS ONE-PIXEL FIX, pinned by name so it can never come back
check('the stray pixel he removed (2499 on NE LEG-R) stays removed',
      2499 not in layers.get('NE', {}).get('10', []))

# the fingerprint
canon = json.dumps(layers, sort_keys=True, separators=(',', ':'))
got = hashlib.sha256(canon.encode()).hexdigest()
check('BAKED.layers matches his 7/31 export byte for byte', got == SHA,
      'got %s' % got[:16])

# his export is kept, so the next session can re-apply rather than re-derive
check('his export is checked in at ' + EXPORT, os.path.exists(EXPORT))
check('a verbatim transcriber exists (never a hand edit)',
      os.path.exists('tools/bohemia_apply_rig_face_7_31.py'))

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    print('\nTHE RIG DRIFTED. Do not "fix" it by editing pixels or by updating the\n'
          'constants above. Get his export, apply it verbatim with the transcriber,\n'
          'and update the constants in the SAME commit with the export in records/rig/.')
    sys.exit(1)
