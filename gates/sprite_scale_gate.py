#!/usr/bin/env python3
"""SPRITE SCALE GATE (DIRECTION 10/16/26, row [the master rig]; rule 108 ROUND EIGHT (b), rule 107, rule 102).

Every master-rig render carries a rig.json. This gate refuses any that disagrees with the one ruler: 57 px a metre
(the man is the ruler, records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md), one orthographic camera tilted 45 degrees and
never turned, all eight facings present on disk. A sheet off the ruler is a different game's sprite.
It plants a wrong rig.json in memory first and must refuse it, so it cannot pass by reading nothing.
"""
import os, sys, json, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PPM, TILT, FACINGS = 57.0, 45.0, ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']


def wrong(m, base):
    w = []
    if abs(float(m.get('ppm', 0)) - PPM) > 1e-6: w.append('ppm %s, not %s' % (m.get('ppm'), PPM))
    c = m.get('camera', {})
    if not c.get('ortho') or abs(float(c.get('tilt_deg', -1)) - TILT) > 1e-6 or float(c.get('turn_deg', -1)) != 0:
        w.append('camera %s, not ortho tilt 45 turn 0' % c)
    if m.get('facings') != FACINGS: w.append('facings %s' % m.get('facings'))
    for f in m.get('files', []):
        if not os.path.exists(os.path.join(ROOT, f)): w.append('missing ' + f)
    if len(m.get('files', [])) != 8: w.append('%d files, not 8' % len(m.get('files', [])))
    return w


ok = fail = 0
def chk(c, msg):
    global ok, fail
    print(('  ok   ' if c else '  FAIL ') + msg); ok += c; fail += (not c)

chk(bool(wrong({'ppm': 48, 'camera': {'ortho': True, 'tilt_deg': 60, 'turn_deg': 45}, 'facings': FACINGS[:4], 'files': []}, '')),
    'a planted rig.json off the ruler (48 ppm, a turned camera, four facings) is refused')
rigs = glob.glob(os.path.join(ROOT, 'records/target/**/rig.json'), recursive=True)
chk(len(rigs) > 0, '%d master-rig renders found' % len(rigs))
for r in rigs:
    w = wrong(json.load(open(r)), os.path.dirname(r))
    chk(not w, '%s on the ruler%s' % (os.path.relpath(r, ROOT), (': ' + '; '.join(w)) if w else ''))
print('SPRITE SCALE GATE: %d passed, %d failed' % (ok, fail)); sys.exit(1 if fail else 0)
