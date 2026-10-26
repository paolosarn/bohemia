#!/usr/bin/env python3
"""THE ARMOUR THROUGH THE RIG (COOK [the armour's art], rule 272(b)(d), Paolo 10/26: 'the good armour I have on me doesn't show, like a
police helmet... we're gonna have to cook up so much art'; CHARACTER's NOTE: 'Your real art drops in file for file: slices/wear/wear.json
... Render each through the master rig at ppm 57 with his head as a holdout... The police riot helmet and the police vest first').

Read off what ships (slices/wear/wear.webp, wear_face.webp, wear.json; records/target/cook_armour_rig/pieces.json):
  1. *** FILE FOR FILE ***: wear.json keeps CHARACTER's format: every class and extra armour_looks.json uses has its eight facings,
     a head piece also its drop and its portrait, every cell [x, y, w, h, dx, dy] on its sheet with a body in it.
  2. *** MADE BY THE RIG ***: wear.json says the master rig made it, and every piece has its run (pieces.json: the rig's light,
     film and source pass, no setting moved; the mesh's faces), each piece's fullest view 100 colours or more (from behind a mask
     is its straps: the fullest view is the piece).
  3. *** THE POLICE PIECES FIRST, THEIR OWN ART ***: the riot helmet and the police vest carry parts the placeholder classes do
     not (the helmet's vent ribs, pivot bolts, lift tab and chin strap; the vest's webbing rows, radio pouch and aerial, buckles).
  4. THE VISOR IS GLASS: the riot helmet's facing south shows his face through smoked glass (pixels at partial alpha), the welder's
     lens does not.
  5. THE ANCHORS HOLD: every facing's piece sits where CHARACTER's placeholder put it (its middle within 4 px of the placeholder
     cell's middle, records/target/cook_armour_rig/character_placeholder_wear.json, kept as the reference): a gas mask stays on the
     front of his face, a helmet on his crown, a vest under his chin.
  Run: python3 gates/the_armour_through_the_rig_gate.py
"""
import os, sys, json
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(R, 'slices/wear')
PJ = os.path.join(R, 'records/target/cook_armour_rig/pieces.json')
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
ok_n = bad_n = 0


def leg(ok, what, why=''):
    global ok_n, bad_n
    if ok: ok_n += 1
    else: bad_n += 1
    print(('  ok   ' if ok else '  FAIL ') + what + ('  [' + str(why) + ']' if why != '' else ''))


def main(wdir=W, pj=PJ):
    w = json.load(open(os.path.join(wdir, 'wear.json'))); P = w['pieces']
    sheet = np.asarray(Image.open(os.path.join(wdir, w['sheet'])).convert('RGBA')); face = np.asarray(Image.open(os.path.join(wdir, w['face_sheet'])).convert('RGBA'))
    L = json.load(open(os.path.join(R, 'records/target/bb/armour_looks.json')))
    want = {}
    for slot in ('head', 'body'):
        for rid, r in L[slot].items():
            want[r['class'] + ''.join('+' + f for f in sorted(r.get('feats', [])))] = slot
    miss, cols = [], {}
    for key, slot in sorted(want.items()):
        e = P.get(key)
        if not e: miss.append(key + ' missing'); continue
        for f in DIRS + (['drop', 'portrait'] if slot == 'head' else []):
            c = e.get(f)
            if not c: miss.append('%s %s' % (key, f)); continue
            sh = face if f == 'portrait' else sheet
            x, y, ww, hh = c[:4]
            if x + ww > sh.shape[1] or y + hh > sh.shape[0]: miss.append('%s %s off its sheet' % (key, f)); continue
            a = sh[y:y + hh, x:x + ww]
            if (a[..., 3] > 0).sum() < 12: miss.append('%s %s empty' % (key, f)); continue
            if f in DIRS: cols[key] = max(cols.get(key, 0), len(set(map(tuple, a[a[..., 3] == 255][:, :3].tolist()))))
    leg(not miss, '*** FILE FOR FILE ***: every class and extra in use, eight facings (a helmet also dropped and at portrait size), every cell on its sheet with a body',
        '; '.join(miss[:6]) if miss else '%d pieces' % len(want))
    pj_ = json.load(open(pj)) if os.path.exists(pj) else {}
    bad = []
    if w.get('made') != 'master rig': bad.append('wear.json made %s' % w.get('made'))
    for key in want:
        r = pj_.get(key)
        if not r or r.get('rig') != 'master rig light_and_film + source_pass' or r.get('breaks'): bad.append(key + ' no rig run')
        if key in cols and cols[key] < 100: bad.append('%s %d colours' % (key, cols[key]))
    leg(not bad, '*** MADE BY THE RIG ***: every piece rendered with the master rig\'s light, film and source pass, no setting moved, its fullest view 100 colours or more',
        '; '.join(bad[:6]) if bad else 'fewest colours %d (%s)' % min((v, k) for k, v in cols.items()))
    own = []
    for key, need in (('riot_helmet', ('vent ribs', 'pivot bolts', 'lift tab', 'chin strap')), ('police_vest', ('webbing', 'radio pouch', 'aerial', 'buckles'))):
        got = (pj_.get(key) or {}).get('own_art', [])
        if not all(n in got for n in need): own.append('%s has %s' % (key, got))
    leg(not own, '*** THE POLICE PIECES FIRST, THEIR OWN ART ***: the riot helmet\'s vent ribs, pivot bolts, lift tab and chin strap; the vest\'s webbing, radio pouch, aerial and buckles',
        '; '.join(own) if own else 'both')
    gl = []
    for key, glass in (('riot_helmet', True), ('welder_mask', False)):
        c = P.get(key, {}).get('S')
        if not c: gl.append(key + ' no S'); continue
        a = sheet[c[1]:c[1] + c[3], c[0]:c[0] + c[2], 3]; part = ((a > 0) & (a < 255)).sum()
        if (part > 20) != glass: gl.append('%s %d see-through px' % (key, part))
    leg(not gl, 'the visor is glass: his face shows through the riot shield (pixels at partial alpha), never through the welder\'s lens', '; '.join(gl) if gl else 'both')
    off, worst = [], 0.0
    ref = json.load(open(os.path.join(R, 'records/target/cook_armour_rig/character_placeholder_wear.json')))['pieces']
    for key, slot in want.items():
        for f in DIRS + (['drop'] if slot == 'head' else []):
            c = (P.get(key) or {}).get(f); o = (ref.get(key) or {}).get(f)
            if not c or not o: continue
            d = max(abs((c[4] + c[2] / 2.0) - (o[4] + o[2] / 2.0)), abs((c[5] + c[3] / 2.0) - (o[5] + o[3] / 2.0))); worst = max(worst, d)
            if d > 4: off.append('%s %s %.1f px' % (key, f, d))
    leg(not off, 'the anchors hold: every facing\'s piece where CHARACTER\'s placeholder put it, its middle within 4 px', '; '.join(off[:6]) if off else 'worst %.1f px' % worst)
    print('THE ARMOUR THROUGH THE RIG: %d ok, %d failed' % (ok_n, bad_n))
    return 1 if bad_n else 0


if __name__ == '__main__':
    sys.exit(main())
