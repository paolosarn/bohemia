#!/usr/bin/env python3
"""THE BOSSES' MAP PIECES ARE FINISHED (COOK FIVE, 11/14/26; the coordinator's turn-up round, job 2, VAMILY rules 447 and 441:
'finished art where this round's VOTE cards still say STAND-IN and he will meet it first: the three new bosses' map changes
(the Locksmith's gates, the Charge's mines, the Machinist's nails)').

BOSSES built what the three do to the map and painted a first piece for each; this lane redrew the same seven pictures
(tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py), the same keys, frame and rig. A piece on the map is a block
across and a hundred and some pixels: what can go wrong without anybody seeing it in the tool is a state that jumps when the
map swaps it for another (another box or anchor), a beat frame that does not move (or moves when nothing should), and a piece
that is nearly nothing on the block.

  B1 the seven entries (curfew night, day, after; mine before, after; nails before, after) are in slices/boss_places/
     boss_places.json, marked finished and through the rig; both frames of each are files of the size the entry says
  B2 ONE BOX A PIECE: every state of a piece has the same size and the same anchor (the map swaps one for another in place)
  B3 THE BEAT: where something moves the two frames differ (the gate shut at night: its lamp; the mine spotted: its rag; the
     nails: his caltrops), and where nothing moves they are the same picture
  B4 IT IS THERE: a piece covers 4 in 100 of its box or more, and between its dark twentieth and its pale twentieth there are
     60 steps of tone or more (the first mine was a square of one brown)
  B5 THE LAMP IS LIT WHILE THE STREET IS SHUT: the night gate's lit frame has 8 or more red pixels (bright, twice as red as
     green or blue: the lamp is four pixels across on the map), the day gate under a third of that
  B6 LIGHT: the fourteen files together under 130,000 bytes; PURPLE RESERVATION: not one purple pixel
  P1 PLANTED (in memory): a state with another anchor turns B2 red; a frame copied over its twin turns B3 red; a piece wiped
     to four dots turns B4 red
11/17 (rule 453, the coordinator's 'COOK FIVE full sweep'): the newest three bosses' pieces are held the same way (THE PLATE's
wagon, THE TOOTH's collector, THE LENS's haze, tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py): thirteen
pieces, twenty-six files. What moves in them: the lamp behind the wagon's slit, the collector's lantern, the pots' embers and smoke.
  B7 WHAT HE SPRAYED IS WHERE IT IS SEEN: the collector's wall carries his tooth and the haze's board its eye on the face the
     camera sees (40 red pixels or more on each while he stands). The first ones were painted on the far face: a blank wall.
python3 gates/the_bosses_map_pieces_are_finished_gate.py   (a second)
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'slices', 'boss_places')
PIECES = {'curfew': ('night', 'day', 'after'), 'mine': ('before', 'after'), 'nails': ('before', 'after'),
          'wagon': ('before', 'after'), 'collector': ('before', 'after'), 'haze': ('before', 'after')}      # the last three: 11/17, rule 453
MOVES = ('curfew_night', 'mine_before', 'nails_before', 'wagon_before', 'collector_before', 'haze_before')
BYTES, COVER, SPREAD, RED = 240000, 0.04, 60.0, 8
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def keys(): return ['%s_%s' % (p, s) for p, ss in PIECES.items() for s in ss]


def b2(P):
    bad = []
    for p, ss in PIECES.items():
        box = {(P[p + '_' + s]['w'], P[p + '_' + s]['h'], P[p + '_' + s]['bx'], P[p + '_' + s]['by']) for s in ss}
        if len(box) > 1: bad.append('%s: %s' % (p, sorted(box)))
    return bad


def b3(F):
    bad = []
    for k, (a, b) in F.items():
        d = int((np.abs(a.astype(int) - b.astype(int)).max(2) > 12).sum())
        if k in MOVES and d < 4: bad.append('%s does not move (%d pixels)' % (k, d))
        if k not in MOVES and d: bad.append('%s moves (%d pixels) and nothing in it should' % (k, d))
    return bad


def b4(F):
    out = {}
    for k, (a, _b) in F.items():
        m = a[..., 3] > 128; lum = (a[..., :3].astype(float) @ np.array([0.299, 0.587, 0.114]))[m]
        out[k] = (float(m.mean()), float(np.percentile(lum, 95) - np.percentile(lum, 5)) if lum.size > 20 else 0.0)
    return out


def red(a):
    """pixels that are RED: bright, and twice as red as they are green or blue (a pale pink lamp is not red: the first one was)"""
    r, g, b, al = (a[..., i].astype(int) for i in range(4))
    return int(((r > 150) & (r > 2 * g) & (r > 2 * b) & (al > 60)).sum())


def spray(a):
    """pixels of his spray can's red (redder than green or blue by half again, not dark)"""
    r, g, b, al = (a[..., i].astype(int) for i in range(4))
    return int(((r > 110) & (r > 1.5 * g) & (r > 1.5 * b) & (al > 128)).sum())


def purple(a):
    r, g, b, al = (a[..., i].astype(int) for i in range(4))
    return int(((r > g + 25) & (b > g + 25) & (r > 80) & (al > 40)).sum())


def main():
    print('\nTHE BOSSES\' MAP PIECES ARE FINISHED\n')
    P = json.load(open(os.path.join(D, 'boss_places.json')))['pictures']; K = keys(); gone = []; F = {}
    for k in K:
        e = P.get(k)
        if not e or not e.get('finished') or not e.get('through_the_rig'): gone.append(k + ' not marked finished'); continue
        fr = []
        for f in e['frames']:
            p = os.path.join(D, f)
            if not os.path.exists(p): gone.append(f + ' is not a file'); continue
            im = Image.open(p).convert('RGBA')
            if im.size != (e['w'], e['h']): gone.append('%s is %dx%d, its entry says %dx%d' % (f, im.size[0], im.size[1], e['w'], e['h']))
            fr.append(np.asarray(im))
        if len(fr) == 2: F[k] = fr
    ok('B1 the %d pieces are in, marked finished and through the rig, both frames of each a file of its entry\'s size' % len(K), not gone and len(F) == len(K), '; '.join(gone[:4]) or '%d pieces, %d pictures' % (len(K), 2 * len(K)))
    if gone or len(F) != len(K): print('\nTHE BOSSES\' MAP PIECES ARE FINISHED: %d passed, %d failed' % (passed, failed)); return 1
    x2 = b2(P); ok('B2 ONE BOX A PIECE: every state of a piece the same size and anchor', not x2, '; '.join(x2) or ', '.join('%s %dx%d at %d,%d' % (p, P[p + '_' + ss[0]]['w'], P[p + '_' + ss[0]]['h'], P[p + '_' + ss[0]]['bx'], P[p + '_' + ss[0]]['by']) for p, ss in PIECES.items()))
    x3 = b3(F); ok('B3 THE BEAT: what burns or flaps moves between the two frames (the lamps, the rag, the caltrops, the smoke), nothing else does', not x3, '; '.join(x3) or '%d move, %d still' % (len(MOVES), len(K) - len(MOVES)))
    r4 = b4(F); x4 = [k for k, v in r4.items() if v[0] < COVER or v[1] < SPREAD]
    ok('B4 IT IS THERE: every piece 4 in 100 of its box or more, 60 steps of tone or more between its dark and its pale', not x4, ', '.join('%s %.0f%% %.0f' % (k.replace('_', ' '), v[0] * 100, v[1]) for k, v in r4.items()))
    rn, rd = red(F['curfew_night'][1]), red(F['curfew_day'][1])
    ok('B5 THE LAMP IS LIT WHILE THE STREET IS SHUT: red on the night gate, not on the day gate', rn >= RED and rd * 3 < rn, 'night %d red pixels, day %d' % (rn, rd))
    tot = sum(os.path.getsize(os.path.join(D, f)) for k in K for f in P[k]['frames']); pur = sum(purple(a) for fr in F.values() for a in fr)
    ok('B6 LIGHT and no purple: the %d files under %s bytes, not one purple pixel' % (2 * len(K), format(BYTES, ',')), tot <= BYTES and not pur, '%s bytes, %d purple' % (format(tot, ','), pur))
    sp = {k: spray(F[k][0]) for k in ('collector_before', 'haze_before')}
    ok('B7 WHAT HE SPRAYED IS WHERE IT IS SEEN: his tooth on the collector\'s wall, his eye on the haze\'s board (40 red pixels or more)', all(v >= 40 for v in sp.values()), ', '.join('%s %d' % (k.replace('_', ' '), v) for k, v in sp.items()))
    P2 = json.loads(json.dumps(P)); P2['curfew_day']['bx'] += 9; p2 = bool(b2(P2))
    F3 = dict(F); F3['curfew_night'] = [F['curfew_night'][0], F['curfew_night'][0]]; p3 = bool(b3(F3))
    z = np.zeros_like(F['mine_before'][0]); z[10:12, 10:12] = 255; F4 = dict(F); F4['mine_before'] = [z, z]; r = b4(F4)['mine_before']; p4 = r[0] < COVER or r[1] < SPREAD
    ok('P1 PLANTED: another anchor turns B2 red, a frame copied over its twin B3, a piece wiped to four dots B4', p2 and p3 and p4, 'B2 %s, B3 %s, B4 %s' % (p2, p3, p4))
    print('\nTHE BOSSES\' MAP PIECES ARE FINISHED: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
