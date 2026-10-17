#!/usr/bin/env python3
"""SPRITE SCALE GATE (DIRECTION 10/16/26, row [the master rig]; rule 108 ROUND EIGHT (b), rule 107, rule 102;
ROUND TWO 10/17: the model moves, and the face comes from the body).

Every master-rig render carries a rig.json. This gate refuses any that disagrees with the one ruler: 57 px a metre
(the man is the ruler, records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md), one orthographic camera tilted 45 degrees and
never turned, the height stretched 1/cos(45) so a standing thing is drawn at full height like his packs (round two,
measured: without it a 1.72 m man was 61 px), the base turn 180 so N walks away from the camera (round two: N and S
came out swapped), all eight facings present on disk. A sheet off the ruler is a different game's sprite.
ROUND TWO LEGS: every clip is drawn at the men's grid, three keys a beat (a whole number of beats: 3, 6, 12 ...),
eight facings times its keys on disk, every sampled frame inside the clip's range (AN ENVELOPE RAMPS SLOWER THAN THE
GRID: nothing between two keys is ever rendered); a portrait.json names the SAME model as its body's rig.json (ONE ID,
ONE WHOLE PERSON), its head at or over 96 px (PORTRAIT's floor), an orthographic camera, S/SE/SW on disk.
It plants a wrong rig.json and a wrong portrait.json in memory first and must refuse them, so it cannot pass by
reading nothing.
"""
import os, sys, json, glob, math
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PPM, TILT, FACINGS = 57.0, 45.0, ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
PORTRAIT_FACINGS, HEAD_FLOOR = ['S', 'SE', 'SW'], 96


def wrong(m, base):
    w = []
    if abs(float(m.get('ppm', 0)) - PPM) > 1e-6: w.append('ppm %s, not %s' % (m.get('ppm'), PPM))
    c = m.get('camera', {})
    if not c.get('ortho') or abs(float(c.get('tilt_deg', -1)) - TILT) > 1e-6 or float(c.get('turn_deg', -1)) != 0:
        w.append('camera %s, not ortho tilt 45 turn 0' % c)
    zs = 1.0 / math.cos(math.radians(TILT))
    if abs(float(m.get('z_stretch', 0)) - zs) > 1e-3: w.append('z_stretch %s, not %.4f (full height, the 3/4 cheat)' % (m.get('z_stretch'), zs))
    if int(m.get('base_turn_deg', -1)) != 180: w.append('base_turn_deg %s, not 180 (N must walk away)' % m.get('base_turn_deg'))
    if m.get('facings') != FACINGS: w.append('facings %s' % m.get('facings'))
    for f in m.get('files', []):
        if not os.path.exists(os.path.join(ROOT, f)): w.append('missing ' + f)
    if len(m.get('files', [])) != 8: w.append('%d files, not 8' % len(m.get('files', [])))
    if m.get('keys_per_beat', 3) != 3: w.append('keys_per_beat %s, not 3' % m.get('keys_per_beat'))
    for name, c in (m.get('clips') or {}).items():
        k = int(c.get('keys', 0)); lo, hi = c.get('frame_range', [0, 0])
        if k <= 0 or k % 3: w.append('clip %s: %d keys is not a whole number of beats at three a beat' % (name, k))
        if len(c.get('files', [])) != 8 * k: w.append('clip %s: %d files, not 8 x %d' % (name, len(c.get('files', [])), k))
        if len(c.get('frames', [])) != k or any(fr < lo - 1e-6 or fr > hi + 1e-6 for fr in c.get('frames', [])):
            w.append('clip %s: sampled frames %s are not %d keys inside %s' % (name, c.get('frames'), k, c.get('frame_range')))
        for f in c.get('files', []):
            if not os.path.exists(os.path.join(ROOT, f)): w.append('clip %s: missing %s' % (name, f))
    return w


def wrong_portrait(p, m):
    w = []
    if p.get('model') != m.get('model'): w.append('portrait model %s is not the body\'s %s (ONE ID, ONE WHOLE PERSON)' % (p.get('model'), m.get('model')))
    if int(p.get('head_px', 0)) < HEAD_FLOOR: w.append('head %s px, under the %d floor' % (p.get('head_px'), HEAD_FLOOR))
    c = p.get('camera', {})
    if not c.get('ortho') or float(c.get('turn_deg', -1)) != 0: w.append('portrait camera %s, not ortho turn 0' % c)
    if p.get('facings') != PORTRAIT_FACINGS or len(p.get('files', [])) != len(PORTRAIT_FACINGS): w.append('portrait facings %s / %d files' % (p.get('facings'), len(p.get('files', []))))
    for f in p.get('files', []):
        if not os.path.exists(os.path.join(ROOT, f)): w.append('portrait missing ' + f)
    return w


ok = fail = 0
def chk(c, msg):
    global ok, fail
    print(('  ok   ' if c else '  FAIL ') + msg); ok += c; fail += (not c)

chk(bool(wrong({'ppm': 48, 'camera': {'ortho': True, 'tilt_deg': 60, 'turn_deg': 45}, 'facings': FACINGS[:4], 'files': []}, '')),
    'a planted rig.json off the ruler (48 ppm, a turned camera, four facings) is refused')
good = {'ppm': 57.0, 'camera': {'ortho': True, 'tilt_deg': 45.0, 'turn_deg': 0}, 'z_stretch': 1.4142, 'base_turn_deg': 180, 'facings': FACINGS, 'files': [], 'model': 'x.glb',
        'clips': {'Walk': {'keys': 5, 'frame_range': [0, 17], 'frames': [1, 4, 7, 10, 30], 'files': []}}}
chk(any('whole number of beats' in x for x in wrong(good, '')) and any('inside' in x for x in wrong(good, '')),
    'a planted clip with 5 keys and a frame outside its range is refused (three keys a beat; nothing outside the clip)')
chk(bool(wrong_portrait({'model': 'y.glb', 'head_px': 64, 'camera': {'ortho': False}, 'facings': ['S'], 'files': []}, good)),
    'a planted portrait.json from another model at 64 px with a perspective camera is refused')
rigs = glob.glob(os.path.join(ROOT, 'records/target/**/rig.json'), recursive=True)
chk(len(rigs) > 0, '%d master-rig renders found' % len(rigs))
moving = 0
for r in rigs:
    m = json.load(open(r)); w = wrong(m, os.path.dirname(r))
    chk(not w, '%s on the ruler%s' % (os.path.relpath(r, ROOT), (': ' + '; '.join(w)) if w else ''))
    if m.get('clips'): moving += 1
    if m.get('portrait'):
        pp = os.path.join(os.path.dirname(r), m['portrait'])
        pw = wrong_portrait(json.load(open(pp)), m) if os.path.exists(pp) else ['portrait.json missing']
        chk(not pw, '%s: the face comes from the body%s' % (os.path.relpath(pp, ROOT), (': ' + '; '.join(pw)) if pw else ''))
chk(moving > 0, '%d rig(s) with a clip drawn at the men\'s grid (the model moves)' % moving)
print('SPRITE SCALE GATE: %d passed, %d failed' % (ok, fail)); sys.exit(1 if fail else 0)
