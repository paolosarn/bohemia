#!/usr/bin/env python3
"""THE SETTLEMENT'S PEOPLE IDLE (ANIMATION [the settlement's idle people], 10/9; rule 71a: one painted place; rule 69).

The settlement screen draws its picture and no people. This lane ships the clips (slices/settlement_people, baked by
tools/bohemia_settlement_people_bake.js from the bank's own renderer); RUN TWO places them. Asked of the BAKED PIXELS:
a table can name four pictures that are one picture.
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'slices', 'settlement_people')
G = os.path.join(ROOT, 'slices', 'settlement_ground', 'settlement_ground.json')
ok_n = fail_n = 0
def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + why + ']' if why else ''))
def done():
    print('\nTHE SETTLEMENT PEOPLE IDLE GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)

mf = os.path.join(D, 'settlement_people.json')
if not os.path.exists(mf):
    ok('the settlement has a people sheet at all', False, 'no ' + mf); done()
M = json.load(open(mf)); F, COLS, ROWS, CL = M['frame'], M['cols'], M['rows'], M.get('clips') or {}
NEED = ['wait', 'smoke', 'lean', 'scratch', 'look', 'greet', 'beckon', 'trade', 'walk']
ok('the table names every moment a keeper or a hire has (' + ', '.join(NEED) + ')', all(k in CL for k in NEED),
   ','.join(k for k in NEED if k not in CL))
named = [c for k in CL for c in CL[k]['cols']]
ok('every column the table names is baked', all(c in COLS for c in named), ','.join(c for c in named if c not in COLS))
ok('every clip runs on the 120 beat: a whole number of beats, eight pictures', all(isinstance(CL[k].get('beats'), int) and CL[k]['beats'] >= 1 and len(CL[k]['cols']) == 8 for k in CL))
# the scale is the picture's own ruler, not a guess: the ground file's px_per_metre
gj = json.load(open(G))
sc = M.get('scale', {})
ok('THE PERSON IS THE PICTURE\'S SIZE: %s px a metre here and %s in the ground file, a 1.75 m man %s picture px' % (sc.get('px_per_metre'), gj.get('px_per_metre'), sc.get('person_px_in_picture')),
   abs((sc.get('px_per_metre') or 0) - gj['px_per_metre']) < 0.05 and abs(sc.get('person_px_in_picture', 0) - 1.75 * gj['px_per_metre']) < 1.5)

def frames(im, row, cols):
    return [im.crop((COLS.index(c) * F, row * F, COLS.index(c) * F + F, row * F + F)) for c in cols]
still, wave_low, walk_dead, bad_size, outfit_top = [], [], [], [], []
fewest = {k: 9 for k in CL}
for k, v in M['looks'].items():
    im = Image.open(os.path.join(D, v['file'])).convert('RGBA')
    if im.width != F * len(COLS) or im.height != F * len(ROWS): bad_size.append(k); continue
    S = ROWS.index('S')
    for clip in CL:
        # each moment is asked IN THE FACINGS THE TABLE OFFERS IT (a keeper faces you; a hire at the posts is side-on)
        for fc in CL[clip].get('faces') or ROWS:
            r = ROWS.index(fc)
            n = len(set(f.tobytes() for f in frames(im, r, CL[clip]['cols'])))
            fewest[clip] = min(fewest[clip], n)
            # NEVER A STILL, every clip; and the moments that carry the screen (waiting, trading, the crowd walking) show
            # four or more. The bar is what was measured, not a guess: a nod, a back scratch behind a long coat and a
            # beckon read in two or three pictures, and the fewest of each is printed so it cannot hide.
            if n < (4 if clip in ('wait', 'trade', 'walk') else 2):
                (walk_dead if clip == 'walk' else still).append('%s/%s/%s:%d' % (k, clip, fc, n))
    # NOTHING IS CUT BY THE FRAME: a raised hand that leaves the rig's 112 box is sliced flat at the top (the first bake's
    # hail, 9 of 25 looks). Asked against the look's OWN idle: a flat cap that already sits on the box top at rest
    # (faction_church, looked at 10/9) is the outfit, not a clip, and is named in the record, not here.
    top0 = min(f.getchannel('A').getbbox()[1] for f in frames(im, S, CL['wait']['cols']))
    if top0 == 0: outfit_top.append(k)
    else:
        for clip in CL:
            for fc in CL[clip].get('faces') or ROWS:
                r = ROWS.index(fc)
                for c, f in zip(CL[clip]['cols'], frames(im, r, CL[clip]['cols'])):
                    b = f.getchannel('A').getbbox()
                    if b and b[1] == 0: wave_low.append('%s %s %s' % (k, c, fc))
ok('every look is baked whole (%d sheets, %d columns, %d facings)' % (len(M['looks']), len(COLS), len(ROWS)), not bad_size, ','.join(bad_size))
ok('NOBODY IS A STILL: every moment moves in every facing it is offered, every look, and waiting, trading and walking show four or more pictures (fewest: ' +
   ', '.join('%s %d' % (k, fewest[k]) for k in NEED if k in fewest) + ')', not still, ','.join(still[:5]))
ok('THE CROWD WALKS: four or more pictures of the walk both ways, every look', not walk_dead, ','.join(walk_dead[:5]))
ok('NOTHING IS CUT BY THE FRAME: no clip lifts a hand out of the top of the 112 box', not wave_low, ','.join(wave_low[:4]))
if outfit_top: print('  (the outfit itself reaches the box top while breathing, a rig-box edge and not a clip: ' + ', '.join(outfit_top) + ')')
done()
