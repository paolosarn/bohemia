#!/usr/bin/env python3
"""COMBAT MAPS 3 [no board breaks its own picture] 11/3 -- THE READS behind gates/every_place_no_seams_gate.js (VAMILY rule 346(b)(c),
ask line 355; Paolo 11/2 on every ground: 'watch out for straight lines at grid borders and colors that end abruptly and roads that
dont connect and things that dont visually and logically make sense').

Reads the fight's OWN baked board (UI.board, the picture the fight draws every tile from, taken by the gate in the live fight)
and, for every cell border of the 20 x 15 board:
  SEAM     a straight line the eye sees where two cells meet: the colour step across the border (5 px either side, the fight's
           own 1 px grid line stepped over, rule 37f draws it on purpose) against the step across the middle of the two cells
           beside it (the ground's own texture). A border segment is SEEN when its median step is 2.2x that and 9 or more
           (RGB distance, 0-441). Block seams (every fifth border, where two pictures meet) and cell borders inside a picture
           are counted apart.
  CUT-OFF  a colour that stops dead: the two sides are different colour families (hue in 30 degree steps, value in 45s,
           grey or not) and three quarters of the change happens within 4 px of the border, along most of the segment.
  ROADS    every road that reaches a block seam is met by a road on the other side, read from each block's own ground plan
           (asphalt or road paint at its side; mirrored as dealt; the town blocks by the legos reader, the type it was made for,
           tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py): a road run with nothing within 20 px (half a metre) across
           the seam is a road that does not connect.
     python3 tools/bohemia_combat_maps_seams_read_11_3_26.py <dir with board_<place>_<k>.png + boards.json>  -> JSON on stdout
"""
import sys, os, json, importlib
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
L = importlib.import_module('bohemia_combat2_tiles_are_legos_cook_10_5_26')
SHIP = os.path.join(R, 'slices/fight_ground')
G = json.load(open(os.path.join(SHIP, 'fight_ground.json')))
EDGE_CACHE = {}


def strip_mean(a, axis, lo, hi):
    """mean colour of columns (axis 1) or rows (axis 0) lo..hi, per position along the border"""
    return a[:, lo:hi].mean(1) if axis == 1 else a[lo:hi, :].mean(0)


def reads(a, tw, th, W, H, open_=None, street=None):
    out = dict(block_seen=0, block_n=0, cell_seen=0, cell_n=0, cut=0, where=[], kerb_n=0, kerb_bare=0)
    def segs(vertical):
        n = W if vertical else H
        for k in range(1, n):
            p = int(round(k * (tw if vertical else th)))
            step = tw if vertical else th
            for j in range(H if vertical else W):
                s0, s1 = int(round(j * (th if vertical else tw))) + 2, int(round((j + 1) * (th if vertical else tw))) - 2
                yield k, j, p, step, s0, s1
    for vertical in (True, False):
        for k, j, p, step, s0, s1 in segs(vertical):
            c1, c2 = ((j, k - 1), (j, k)) if vertical else ((k - 1, j), (k, j))
            if open_ is not None:                                         # only between two cells of open ground
                if not (open_[c1[0]][c1[1]] and open_[c2[0]][c2[1]]): continue
            band = a[s0:s1, :, :] if vertical else a[:, s0:s1, :].transpose(1, 0, 2)
            q = lambda x0, x1: band[:, max(0, x0):x1, :].mean(1)
            # A STREET'S OWN EDGE IS A KERB, NOT A SEAM (COMBAT THREE 11/14, rule 442(d), ask rows 547 and 577): where a street tile meets
            # the ground beside it the line you see is the street's kerb or its sidewalk, the honest grid the way a wall on its house
            # tile is (measured on the suburbs since their streets went in: 97 of the 98 borders 'seen' were a street against a yard;
            # ground against ground 0 of 279). What is wrong at a street's edge is asphalt run bare to the ground with NO kerb: the
            # strip on the street's side of the border must not be the asphalt 40 px further in. Street against street still counts
            # as any border: a kerb drawn across a junction, a street that stops dead at its neighbour, is a line you see.
            L_, R_ = q(p - 6, p - 1), q(p + 2, p + 7)
            d = np.linalg.norm(L_ - R_, axis=1)
            m1, m2 = int(p - step / 2), int(p + step / 2)
            base = max(np.median(np.linalg.norm(q(m1 - 6, m1 - 1) - q(m1 + 2, m1 + 7), axis=1)),
                       np.median(np.linalg.norm(q(m2 - 6, m2 - 1) - q(m2 + 2, m2 + 7), axis=1)), 2.0)
            md = float(np.median(d))
            blockseam = k % 5 == 0
            seen = md >= 9.0 and md >= 2.2 * base
            if street is not None and len(street):
                a1, a2 = bool(street[c1[0]][c1[1]]), bool(street[c2[0]][c2[1]])
                if a1 != a2:
                    near = q(p - 8, p - 2) if a1 else q(p + 3, p + 9)
                    deep = q(p - 56, p - 40) if a1 else q(p + 41, p + 57)
                    out['kerb_n'] += 1
                    # bare: the border is a line you see (the same reading as any border) and the street's side of it is still its asphalt
                    if seen and float(np.median(np.linalg.norm(near - deep, axis=1))) < 10.0: out['kerb_bare'] += 1
                    continue
            if blockseam: out['block_n'] += 1; out['block_seen'] += int(seen)
            else: out['cell_n'] += 1; out['cell_seen'] += int(seen)
            # the cut-off: different families, and the change made within 4 px of the border along most of the segment
            fam = lambda c: (int(rgb_hue(c) // 30), int(c.max() // 45), bool(c.max() - c.min() < 18))
            Lw, Rw = q(p - 12, p - 4).mean(0), q(p + 5, p + 13).mean(0)
            if fam(Lw) != fam(Rw) and seen:
                near = np.linalg.norm(q(p - 3, p - 1) - q(p + 2, p + 4), axis=1)
                far = np.linalg.norm(q(p - 12, p - 8) - q(p + 9, p + 13), axis=1) + 1e-6
                sharp = float(np.mean(near / far >= 0.75))
                if sharp >= 0.6:
                    out['cut'] += 1
                    if len(out['where']) < 12: out['where'].append(('V' if vertical else 'H', k, j))
            if seen and len(out['where']) < 12 and blockseam: out['where'].append(('v' if vertical else 'h', k, j))
    return out


def rgb_hue(c):
    r, g, b = [float(x) for x in c]; mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn < 1e-6: return 0.0
    if mx == r: h = (g - b) / (mx - mn) % 6
    elif mx == g: h = (b - r) / (mx - mn) + 2
    else: h = (r - g) / (mx - mn) + 4
    return h * 60.0


def edges(name):
    base, flip = name.split('|')[0], '|h' in name
    key = (base, flip)
    if key not in EDGE_CACHE:
        img = Image.open(os.path.join(SHIP, G['blocks'][base]['src'])).convert('RGB')
        if flip: img = img.transpose(Image.FLIP_LEFT_RIGHT)
        EDGE_CACHE[key] = L.edges_of_img(img)
    return EDGE_CACHE[key]


PLAN_SIDES = {}


def plan_sides(name):
    """a block's road at each of its four sides, from the ground plan its picture was rendered from (this round's blocks and COMBAT
    MAPS 1's), else the legos reader (the town blocks it was made for): asphalt or road paint within 6 px of the side"""
    base, flip = name.split('|')[0], '|h' in name
    if (base, flip) in PLAN_SIDES: return PLAN_SIDES[(base, flip)]
    T = importlib.import_module('bohemia_combat_maps_every_place_its_own_board_11_3_26')
    NB = importlib.import_module('bohemia_combat_maps_new_blocks_through_the_rig_11_2_26')
    g = None
    if base in T.BLOCKS or base in NB.BLOCKS:
        _, EG, _, F = T.rig()
        g = (T.plan if base in T.BLOCKS else NB.plan)(base, F)[0]
        road = np.isin(g, [EG.ID['asphalt'], EG.ID['paint']])
        if flip: road = road[:, ::-1]
        res = {'N': road[:6, :].mean(0) > 0.5, 'S': road[-6:, :].mean(0) > 0.5, 'W': road[:, :6].mean(1) > 0.5, 'E': road[:, -6:].mean(1) > 0.5}
    elif base.split('.')[0] not in L.TOWN_KINDS:                       # an older block with no plan here and no town street: no road read
        z = lambda k: np.zeros(k, bool); res = {'N': z(2575), 'S': z(2575), 'W': z(1820), 'E': z(1820)}
    else:
        e = edges(name); res = {}
        for sd, side in e.items():
            m = np.zeros(side['n'], bool)
            for ty, a0, b0 in side['runs']:
                if ty == 'road': m[a0:b0] = True
            res[sd] = m
    PLAN_SIDES[(base, flip)] = res
    return res


def roads(blocks):
    """road runs at block seams with nothing across (20 px tolerance, the blocks' full pixels)"""
    bad, n = [], 0
    grow = lambda m, k: np.convolve(m.astype(int), np.ones(2 * k + 1, int), 'same') > 0
    for r in range(len(blocks)):
        for c in range(len(blocks[0])):
            for (dr, dc, s, t) in ((0, 1, 'E', 'W'), (1, 0, 'S', 'N')):
                rr, cc = r + dr, c + dc
                if rr >= len(blocks) or cc >= len(blocks[0]): continue
                ma, mb = plan_sides(blocks[r][c])[s], plan_sides(blocks[rr][cc])[t]
                if len(ma) != len(mb): continue
                n += 1
                lone = (ma & ~grow(mb, 20)) | (mb & ~grow(ma, 20))
                if lone.sum() >= 30: bad.append('%s %s %s: %d px of road meet nothing' % (blocks[r][c], s, blocks[rr][cc], int(lone.sum())))
    return bad, n


if __name__ == '__main__':
    d = sys.argv[1]
    meta = json.load(open(os.path.join(d, 'boards.json')))
    res = {}; plant = None
    for m in meta:
        a = np.asarray(Image.open(os.path.join(d, m['file'])).convert('RGB')).astype(np.float32)
        r = reads(a, m['tw'], m['th'], m['w'], m['h'], m.get('open'), m.get('street'))
        r['_m'] = m
        r['road_bad'], r['road_n'] = roads(m['blocks'])
        res.setdefault(m['place'], []).append(r)
    # THE PLANT (once, on the board with the most street edges): every kerb painted over with its own street's asphalt must read bare,
    # and a kerb's colour drawn across every street-to-street border must read as lines; and read the old way (no street map) the
    # honest board is the red it was
    best = max((r for rs in res.values() for r in rs), key=lambda r: r['kerb_n'], default=None)
    if best is not None and best['kerb_n'] >= 8 and '--plant' in sys.argv:
        m, r = best['_m'], best
        a = np.asarray(Image.open(os.path.join(d, m['file'])).convert('RGB')).astype(np.float32)
        if True:
            st, op, tw_, th_ = m['street'], m.get('open'), m['tw'], m['th']; b1, b2 = a.copy(), a.copy()
            for vertical in (True, False):
                for k in range(1, m['w'] if vertical else m['h']):
                    p = int(round(k * (tw_ if vertical else th_)))
                    for j in range(m['h'] if vertical else m['w']):
                        s0, s1 = int(round(j * (th_ if vertical else tw_))), int(round((j + 1) * (th_ if vertical else tw_)))
                        c1, c2 = ((j, k - 1), (j, k)) if vertical else ((k - 1, j), (k, j))
                        a1, a2 = bool(st[c1[0]][c1[1]]), bool(st[c2[0]][c2[1]])
                        if a1 != a2:
                            lo, hi = (p - 30, p) if a1 else (p, p + 30); d0, d1 = (p - 56, p - 40) if a1 else (p + 41, p + 57)
                            if vertical: b1[s0:s1, lo:hi, :] = b1[s0:s1, d0:d1, :].mean(axis=(0, 1))
                            else: b1[lo:hi, s0:s1, :] = b1[d0:d1, s0:s1, :].mean(axis=(0, 1))
                        elif a1 and a2:
                            if vertical: b2[s0:s1, p - 9:p, :] = (205., 198., 180.)
                            else: b2[p - 9:p, s0:s1, :] = (205., 198., 180.)
            r1, r2, r0 = reads(b1, tw_, th_, m['w'], m['h'], op, st), reads(b2, tw_, th_, m['w'], m['h'], op, st), reads(a, tw_, th_, m['w'], m['h'], op, None)
            plant = dict(place=m['place'], kerb_n=r['kerb_n'], kerb_bare=r['kerb_bare'], painted_bare=r1['kerb_bare'],
                         street_seen=r['cell_seen'] + r['block_seen'], barred_seen=r2['cell_seen'] + r2['block_seen'],
                         old_cell_seen=r0['cell_seen'], old_cell_n=r0['cell_n'])
    out = {}
    for p, rs in res.items():
        out[p] = dict(block_seen=sum(r['block_seen'] for r in rs), block_n=sum(r['block_n'] for r in rs),
                      cell_seen=sum(r['cell_seen'] for r in rs), cell_n=sum(r['cell_n'] for r in rs),
                      cut=sum(r['cut'] for r in rs), road_bad=sum(len(r['road_bad']) for r in rs), road_n=sum(r['road_n'] for r in rs),
                      kerb_n=sum(r['kerb_n'] for r in rs), kerb_bare=sum(r['kerb_bare'] for r in rs),
                      road_examples=[x for r in rs for x in r['road_bad']][:4], where=rs[0]['where'][:8])
    if plant is not None: out['_plant'] = plant
    print(json.dumps(out))
