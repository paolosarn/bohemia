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


def reads(a, tw, th, W, H, open_=None):
    out = dict(block_seen=0, block_n=0, cell_seen=0, cell_n=0, cut=0, where=[])
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
            if open_ is not None:                                         # only between two cells of open ground
                c1, c2 = ((j, k - 1), (j, k)) if vertical else ((k - 1, j), (k, j))
                if not (open_[c1[0]][c1[1]] and open_[c2[0]][c2[1]]): continue
            band = a[s0:s1, :, :] if vertical else a[:, s0:s1, :].transpose(1, 0, 2)
            q = lambda x0, x1: band[:, max(0, x0):x1, :].mean(1)
            L_, R_ = q(p - 6, p - 1), q(p + 2, p + 7)
            d = np.linalg.norm(L_ - R_, axis=1)
            m1, m2 = int(p - step / 2), int(p + step / 2)
            base = max(np.median(np.linalg.norm(q(m1 - 6, m1 - 1) - q(m1 + 2, m1 + 7), axis=1)),
                       np.median(np.linalg.norm(q(m2 - 6, m2 - 1) - q(m2 + 2, m2 + 7), axis=1)), 2.0)
            md = float(np.median(d))
            blockseam = k % 5 == 0
            seen = md >= 9.0 and md >= 2.2 * base
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
    res = {}
    for m in meta:
        a = np.asarray(Image.open(os.path.join(d, m['file'])).convert('RGB')).astype(np.float32)
        r = reads(a, m['tw'], m['th'], m['w'], m['h'], m.get('open'))
        r['road_bad'], r['road_n'] = roads(m['blocks'])
        res.setdefault(m['place'], []).append(r)
    out = {}
    for p, rs in res.items():
        out[p] = dict(block_seen=sum(r['block_seen'] for r in rs), block_n=sum(r['block_n'] for r in rs),
                      cell_seen=sum(r['cell_seen'] for r in rs), cell_n=sum(r['cell_n'] for r in rs),
                      cut=sum(r['cut'] for r in rs), road_bad=sum(len(r['road_bad']) for r in rs), road_n=sum(r['road_n'] for r in rs),
                      road_examples=[x for r in rs for x in r['road_bad']][:4], where=rs[0]['where'][:8])
    print(json.dumps(out))
