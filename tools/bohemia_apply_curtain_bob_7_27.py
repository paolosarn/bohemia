#!/usr/bin/env python3
"""
BOHEMIA — APPLY PAOLO'S UPDATED CURTAIN-BOB HAIR (7/27/26)

He pasted the rig export for `hair/curtain-bob` and said "heres the code for the
updated curtain bob hair please apply". This swaps his new painted layers into
PD_DATA, in place, for the five authored directions (E, N, NE, S, SE -- W, NW and
SW are mirrors and are derived at render time, exactly as before).

RIG LAW: his painted regions are SACROSANCT. This tool copies his pixel indices
across VERBATIM. It does not reshape, mirror, resample, re-index or "clean up"
anything, and it does not touch the ramps (his export carries the same two-stop
ramp the build already had: [[27,26,32],[237,232,220]] -- verified equal before
writing, and the tool refuses if they ever differ, because a silent ramp change
would re-tint his hair without him asking).

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks NO art. Every pixel
written here was painted by Paolo in the rig and pasted by him this turn. No bank
was consulted because nothing was generated.

Idempotent: re-running with the same export is a no-op.

  python3 tools/bohemia_apply_curtain_bob_7_27.py
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
EXPORT = os.path.join(ROOT, 'records', 'rig', 'CURTAIN_BOB_7_27_26.json')

def die(m):
    print('  ! ' + m); sys.exit(1)

if not os.path.exists(EXPORT):
    die('his export is not on disk: ' + EXPORT)
new = json.load(open(EXPORT, encoding='utf-8'))

KEY = new.get('garment')
if KEY != 'hair/curtain-bob':
    die('this tool applies hair/curtain-bob, the export says %r' % KEY)

src = open(ALPHA, encoding='utf-8').read()
i = src.index('const PD_DATA = ')
j = src.index('\n', i)
head, raw, tail = src[:i], src[i + len('const PD_DATA = '):j], src[j:]
trail = ''
raw = raw.rstrip()
if raw.endswith(';'):
    raw, trail = raw[:-1], ';'
pd = json.loads(raw)

if KEY not in pd['layers']:
    die('%s is not in PD_DATA.layers' % KEY)

# THE RAMP IS NOT ALLOWED TO MOVE SILENTLY. A different ramp re-tints his hair.
old_ramp = pd['ramps'][KEY]
if new['ramps'] != old_ramp:
    die('the export ramp %r differs from the build ramp %r -- refusing to retint '
        'his hair as a side effect of a shape update. Decide the ramp explicitly.'
        % (new['ramps'], old_ramp))

old = pd['layers'][KEY]
if old == new['layers']:
    print('CURTAIN BOB: already applied, nothing to do.')
    sys.exit(0)

# AUTHORED DIRECTIONS ONLY. W/NW/SW are mirrors derived at render time; if his
# export ever starts carrying them, that is a real change and must be noticed.
extra = set(new['layers']) - set(old)
if extra:
    die('the export carries directions the build does not author (%s). That is a '
        'pipeline change, not a repaint -- stop and decide it.' % sorted(extra))

print('CURTAIN BOB — applying his 7/27 export:')
for d in sorted(new['layers']):
    a, b = old.get(d), new['layers'][d]
    if a is None:
        print('  %-3s  NEW  %d px' % (d, len(b['px']))); continue
    if a['w'] != b['w'] or a['h'] != b['h']:
        die('%s changes the layer box %dx%d -> %dx%d; the rig grid is fixed'
            % (d, a['w'], a['h'], b['w'], b['h']))
    print('  %-3s  %3d px -> %3d px  (%+d)' % (d, len(a['px']), len(b['px']),
                                               len(b['px']) - len(a['px'])))
missing = set(old) - set(new['layers'])
for d in sorted(missing):
    print('  %-3s  UNCHANGED (not in his export)' % d)

for d, v in new['layers'].items():
    pd['layers'][KEY][d] = v

out = head + 'const PD_DATA = ' + json.dumps(pd, separators=(',', ':')) + trail + tail
open(ALPHA, 'w', encoding='utf-8').write(out)
print('applied to slices/BOHEMIA_ALPHA_0_9.html (ramps untouched, W/NW/SW still mirrored)')
