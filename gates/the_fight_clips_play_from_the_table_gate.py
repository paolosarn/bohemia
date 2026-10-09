#!/usr/bin/env python3
"""THE FIGHT'S CLIPS PLAY FROM THE TABLE (ANIMATION [the fight's clips in the new fight], 10/9, rule 69).

The rebuilt fight draws every man from slices/fight_people (the 112 rig in his clothes, baked from the bank).
Until this round it froze every standing man on ONE idle frame and laid the dead in the SLEEP pose, which
lies the other way round from any fall. The baker now appends the breathing idle, a fall (the bank's
floor-rise played backwards) and the man struck down and not dead (crawl-dying), and writes a CLIP TABLE
into fight_people.json that says which columns play for which fight event.

Asked of the BAKED PIXELS, never of the table's say-so: a table can name eight frames that are one picture.
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'slices', 'fight_people')
ok_n = fail_n = 0
def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + why + ']' if why else ''))

M = json.load(open(os.path.join(D, 'fight_people.json')))
F, COLS, CL = M['frame'], M['cols'], M.get('clips') or {}
if not CL:
    print('  FAIL there is no clip table in fight_people.json: the fight can only guess which picture plays')
    print('\nTHE FIGHT CLIPS PLAY FROM THE TABLE GATE: 0 passed, 1 failed'); sys.exit(1)
EVENTS = ['idle', 'step', 'swing', 'shot', 'hit', 'fall', 'down', 'dead']
ok('the table names every fight event (' + ', '.join(EVENTS) + ')', all(e in CL for e in EVENTS),
   'missing: ' + ','.join(e for e in EVENTS if e not in CL))
named = [c for e in CL for c in CL[e]['cols']]
ok('every column the table names is baked into the sheet', all(c in COLS for c in named),
   ','.join(c for c in named if c not in COLS))
# the fight already reads these by name and by position (col('walk@0') + k): they may never move
FIRST = ['idle@0', 'walk@0', 'walk@0.25', 'walk@0.5', 'walk@0.75', 'stagger-hit@0.03', 'stagger-hit@0.09',
         'stagger-hit@0.16', 'stagger-hit@0.26', 'bat-arc@0.2', 'bat-arc@0.5', 'bat-arc@0.68', 'two-hand@0', 'sleep@0']
ok('the fourteen columns the fight already reads keep their names AND their places', COLS[:14] == FIRST)
ok('the fall flows into the man struck down (then: down), and the dead have their own pose',
   CL.get('fall', {}).get('then') == 'down' and CL['dead']['cols'][0] not in CL['fall']['cols'] + CL['down']['cols'])

def frames(im, row, cols):
    return [im.crop((COLS.index(c) * F, row * F, COLS.index(c) * F + F, row * F + F)) for c in cols]
def box(fr):
    a = fr.getchannel('A'); b = a.getbbox()
    return b  # (l, t, r, b)
def differs(a, b):
    pa, pb = a.tobytes(), b.tobytes()
    n = sum(1 for i in range(3, len(pa), 4) if pa[i] or pb[i])
    d = sum(1 for i in range(0, len(pa), 4) if pa[i:i + 4] != pb[i:i + 4])
    return d / max(1, n)

looks = M['looks']
bad_w, idle_dead, down_dead, fall_bad, fall_flat, fall_stand, seam, apart = [], [], [], [], [], [], [], []
idle_min = down_min = 1e9
for k, v in looks.items():
    im = Image.open(os.path.join(D, v['file'])).convert('RGBA')
    if im.width != F * len(COLS) + 64 or im.height != F * len(M['rows']): bad_w.append(k); continue
    for r in range(len(M['rows'])):
        idl = frames(im, r, CL['idle']['cols'])
        n_idle = len(set(f.tobytes() for f in idl)); idle_min = min(idle_min, n_idle)
        if n_idle < 3: idle_dead.append(k + '/' + M['rows'][r])
        dn = frames(im, r, CL['down']['cols'])
        n_down = len(set(f.tobytes() for f in dn)); down_min = min(down_min, n_down)
        if n_down < 3: down_dead.append(k + '/' + M['rows'][r])
        fl = [box(f) for f in frames(im, r, CL['fall']['cols'])]
        tops = [b[1] for b in fl]
        # a fall goes DOWN: the top of the body never rises between two drawn frames
        if any(tops[i + 1] < tops[i] for i in range(len(tops) - 1)): fall_bad.append(k + '/' + M['rows'][r] + ' tops ' + ','.join(map(str, tops)))
        h0, h1 = fl[0][3] - fl[0][1], fl[-1][3] - fl[-1][1]
        if h0 < 80: fall_stand.append(k)
        if h1 > 0.88 * h0: fall_flat.append(k + ' ' + str(h0) + '->' + str(h1))
        # NO POP: the fall's last picture and the down man's first share their box to 2 px
        d0 = box(frames(im, r, CL['down']['cols'][:1])[0])
        if max(abs(a - b) for a, b in zip(fl[-1], d0)) > 2: seam.append(k + '/' + M['rows'][r])
        # ALIVE AND DEAD READ APART: the man struck down SITS UP (taller than wide, head on top); the dead LIE
        # (as wide as tall or wider, on a diagonal, head at the bottom). Shape, not the box top: on SW the top of
        # the flat body is his raised FEET, which a 'head 12 px lower' ruler misread (tried first, 10/9).
        dd = box(frames(im, r, CL['dead']['cols'])[0])
        wd, hd = dd[2] - dd[0], dd[3] - dd[1]; wu, hu = d0[2] - d0[0], d0[3] - d0[1]
        if not (wd >= 0.95 * hd and wu <= 0.90 * hu): apart.append(k + '/' + M['rows'][r] + ' dead %d/%d down %d/%d' % (wd, hd, wu, hu))
ok('every look carries the appended columns (' + str(len(looks)) + ' sheets, ' + str(len(COLS)) + ' columns)', not bad_w, ','.join(bad_w))
ok('THE IDLE BREATHES: at least 3 different pictures of its 4, every look, both ways (fewest ' + str(idle_min) + ')', not idle_dead, ','.join(idle_dead[:4]))
ok('THE MAN STRUCK DOWN AND NOT DEAD MOVES on the ground: at least 3 of 4 pictures (fewest ' + str(down_min) + ')', not down_dead, ','.join(down_dead[:4]))
ok('THE FALL GOES DOWN: the top of the body never rises from one drawn frame to the next, every look, both ways', not fall_bad, '; '.join(fall_bad[:3]))
ok('  and it starts on his feet (over 80 px tall) and ends on the ground (under 88% of that)', not fall_stand and not fall_flat,
   'standing fails ' + ','.join(fall_stand[:3]) + ' / ground fails ' + ','.join(fall_flat[:3]))
ok('NO POP from the fall into the man struck down: the last fall picture and the first crawl share their box to 2 px', not seam, ','.join(seam[:4]))
ok('DOWN AND DEAD READ APART AT A GLANCE: the man struck down sits up (taller than wide), the dead lie (as wide as tall)', not apart, ','.join(apart[:4]))
# THE SHOT KICKS (ANIMATION [the shot kicks], 10/9): the shot was two-hand@0, the aim held. Asked of the baked pixels:
# three or more pictures, the kick's peak changes a real share of the body against the settled pose, and the body
# ROCKS BACK, away from where he aims (facing right on SE, left on SW), at the peak.
def centroid_x(fr):
    a = fr.getchannel('A'); w, h = a.size; px = a.load(); n = sx = 0
    for y in range(h):
        for x in range(w):
            if px[x, y]: n += 1; sx += x
    return sx / max(1, n)
kick_few, kick_small, kick_fwd = [], [], []
for ev in ('shot', 'shot_1h'):
    if ev not in CL: kick_few.append(ev + ' missing'); continue
    for k, v in looks.items():
        im = Image.open(os.path.join(D, v['file'])).convert('RGBA')
        for r in range(len(M['rows'])):
            fr = frames(im, r, CL[ev]['cols'])
            if len(set(f.tobytes() for f in fr)) < 3: kick_few.append('%s/%s/%s' % (ev, k, M['rows'][r]))
            if differs(fr[1], fr[3]) < 0.30: kick_small.append('%s/%s/%s %.2f' % (ev, k, M['rows'][r], differs(fr[1], fr[3])))
            sign = 1 if M['rows'][r] in ('SE', 'E', 'NE') else -1
            if (centroid_x(fr[1]) - centroid_x(fr[3])) * sign > -0.5: kick_fwd.append('%s/%s/%s' % (ev, k, M['rows'][r]))
ok('THE SHOT KICKS: the rifle and the pistol each show three or more pictures, every look, both ways', not kick_few, ','.join(kick_few[:4]))
ok('  and at the peak of the kick 30% or more of his body has moved against the settled shot', not kick_small, ','.join(kick_small[:4]))
ok('  and the body ROCKS BACK, away from where he aims, at the peak (half a pixel or more)', not kick_fwd, ','.join(kick_fwd[:4]))
print('\nTHE FIGHT CLIPS PLAY FROM THE TABLE GATE: %d passed, %d failed' % (ok_n, fail_n))
sys.exit(1 if fail_n else 0)
