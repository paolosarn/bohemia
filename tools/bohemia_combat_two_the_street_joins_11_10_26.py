#!/usr/bin/env python3
"""COMBAT TWO 11/10 -- THE STREETS JOIN (VAMILY rule 442(d), ask lines 544 to 547; Paolo 11/9 on his vote 'every building on
the road': 'you really need to make sure intersections, the sidewalk and the streets continue looking good like they're
supposed to').

Two things, both cut from pictures we already have (reuse first; nothing new is painted):

1. THE JOIN PIECES (slices/fight_ground/kit_street/joins/j_<open>_<nubs>_<line>.webp): COOK TWO's street kit
   (slices/fight_ground/kit_street, 515 x 364 a tile, 1.5 m walks) cut and laid together into every piece a street tile can
   need, by what is around it:
     open  N E S W   1 = the street goes on that way (a road beside), 0 = the street ends there: a sidewalk and its kerb
     nubs  NE SE SW NW  1 = an inside corner of a junction (both its sides open, the tile across the corner no road): the
                        sidewalk's corner piece, its kerb turning the corner (the kit's own junction_walks corners)
     line  e / n / x    the centre line east-west (road_ew under it), north-south (road_ns), none (junction)
   So a side street's sidewalks run along it and turn every corner into the cross street's; a T has its two corners; a
   crossroads its four; a wide road no corner where the road goes on across it.
2. THE REACH TABLE (joins.json reach): for every tile of every old block picture
   (fight_ground.json blocks), on each side, how far in from that edge its asphalt starts (a share of the tile: 0 = asphalt
   at the edge; the sidewalk, the gravel, the kerb before it otherwise), read along the middle of the edge, where a joining
   street's asphalt comes in. A new street that meets an old block's street draws its own edge on through that strip (the
   mouth), so the old street's kerb opens where the new one comes in and their sidewalks meet.

   python3 tools/bohemia_combat_two_the_street_joins_11_10_26.py        (writes both; about a minute)
"""
import json, os, sys, itertools
from PIL import Image
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
KIT = os.path.join(ROOT, 'slices/fight_ground/kit_street')
OUT = os.path.join(KIT, 'joins')
TW, TH = 515, 364
# the kit's own measure (rows and columns of its pictures, read off road_ew_both, road_ns_both and junction_walks):
NB, SB = (0, 45), (318, 364)        # the north walk and its kerb (rows 0-41 walk, 42 the lip, 43-44 its face); the south's
WB, EB = (0, 64), (450, 515)        # the west walk (cols 0-60, 61-63 the kerb); the east's (450-452 the kerb, 453- walk)
SIDES = 'NESW'


def load(n):
    return Image.open(os.path.join(KIT, n + '.webp')).convert('RGB')


def piece(op, nubs, line, P):
    """op: dict side->bool (open); nubs: dict corner->bool; line 'e'/'n'/'x'"""
    base = {'e': P['road_ew'], 'n': P['road_ns'], 'x': P['junction']}[line].copy()
    ewb, nsb, jw = P['road_ew_both'], P['road_ns_both'], P['junction_walks']
    if not op['N']:
        base.paste(ewb.crop((0, NB[0], TW, NB[1])), (0, NB[0]))
    if not op['S']:
        base.paste(ewb.crop((0, SB[0], TW, SB[1])), (0, SB[0]))
    if not op['W']:
        base.paste(nsb.crop((WB[0], 0, WB[1], TH)), (WB[0], 0))
    if not op['E']:
        base.paste(nsb.crop((EB[0], 0, EB[1], TH)), (EB[0], 0))
    box = {'NW': (WB[0], NB[0], WB[1], NB[1]), 'NE': (EB[0], NB[0], EB[1], NB[1]),
           'SW': (WB[0], SB[0], WB[1], SB[1]), 'SE': (EB[0], SB[0], EB[1], SB[1])}
    for c, on in nubs.items():
        if on:
            b = box[c]
            base.paste(jw.crop(b), (b[0], b[1]))
    return base


def keys():
    out = []
    for bits in itertools.product([0, 1], repeat=4):
        op = dict(zip(SIDES, bits))
        can = [c for c in ('NE', 'SE', 'SW', 'NW') if op[c[0]] and op[c[1]]]
        lines = ['x'] + (['e'] if op['E'] and op['W'] else []) + (['n'] if op['N'] and op['S'] else [])
        for nb in itertools.product([0, 1], repeat=len(can)):
            nubs = {c: False for c in ('NE', 'SE', 'SW', 'NW')}
            for c, v in zip(can, nb):
                nubs[c] = bool(v)
            for ln in lines:
                out.append((op, nubs, ln))
    return out


def name(op, nubs, ln):
    return 'j_' + ''.join('1' if op[s] else '0' for s in SIDES) + '_' + ''.join('1' if nubs[c] else '0' for c in ('NE', 'SE', 'SW', 'NW')) + '_' + ln


def asphalt(rgb):
    """the kit's and the blocks' asphalt: dark and grey (lum under 96, saturation under .11); a walk, sand, gravel, a yard is not"""
    a = rgb.astype(float)
    mx, mn = a.max(axis=2), a.min(axis=2)
    lum = a @ np.array([0.299, 0.587, 0.114])
    sat = (mx - mn) / np.maximum(mx + mn, 1)
    return (lum < 96) & (sat < 0.11)


def span_of(tile, side, STEP=8, DEEP=6, IN=2):
    """the asphalt along an edge, read as the street joins gate reads it (every STEP px, DEEP deep, IN in): the longest run, as
    [from, to] shares of the edge (west to east on N and S, north to south on E and W); None: no asphalt on that edge"""
    A = asphalt(np.asarray(tile))
    if side in ('N', 'S'):
        band = A[IN:IN + DEEP] if side == 'N' else A[TH - IN - DEEP:TH - IN]
        prof = band.mean(axis=0); n = TW
    else:
        band = A[:, IN:IN + DEEP] if side == 'W' else A[:, TW - IN - DEEP:TW - IN]
        prof = band.mean(axis=1); n = TH
    on = [prof[i:i + STEP].mean() >= 0.5 for i in range(0, n - STEP + 1, STEP)]
    best, cur = None, None
    for i, v in enumerate(on + [False]):
        if v and cur is None:
            cur = i
        if not v and cur is not None:
            if best is None or i - cur > best[1] - best[0]:
                best = (cur, i)
            cur = None
    if best is None:
        return None
    return [round(best[0] * STEP / n, 3), round(min(n, best[1] * STEP + (STEP if best[1] * STEP + STEP >= n - STEP else 0)) / n, 3)]


def reach_of(tile):
    """how far in from each edge the asphalt starts, read on the middle of the edge (the kit's road between its walks)"""
    A = asphalt(np.asarray(tile))
    out = {}
    mid_x, mid_y = slice(WB[1], EB[0]), slice(NB[1], SB[0])
    rows = A[:, mid_x].mean(axis=1)            # per row, the share of asphalt across the middle
    cols = A[mid_y, :].mean(axis=0)

    def first(prof, rev):
        seq = prof[::-1] if rev else prof
        n = len(seq)
        for i in range(n - 8):
            if seq[i:i + 8].min() >= 0.55:
                return i / n
        return None
    out['N'] = first(rows, False)
    out['S'] = first(rows, True)
    out['W'] = first(cols, False)
    out['E'] = first(cols, True)
    return {k: (round(v, 3) if v is not None else None) for k, v in out.items()}


def main():
    os.makedirs(OUT, exist_ok=True)
    P = {n: load(n) for n in ('road_ew', 'road_ns', 'junction', 'road_ew_both', 'road_ns_both', 'junction_walks')}
    made = {}
    for op, nubs, ln in keys():
        n = name(op, nubs, ln)
        piece(op, nubs, ln, P).save(os.path.join(OUT, n + '.webp'), quality=82, method=6)
        made[n] = {'src': 'joins/' + n + '.webp', 'open': ''.join(s for s in SIDES if op[s]), 'nubs': [c for c in nubs if nubs[c]], 'line': ln}
    # the reach of every old block's tile, each side
    G = json.load(open(os.path.join(ROOT, 'slices/fight_ground/fight_ground.json')))
    reach = {}
    for b, d in sorted(G['blocks'].items()):
        f = os.path.join(ROOT, 'slices/fight_ground', d['src'])
        if not os.path.exists(f):
            continue
        im = Image.open(f).convert('RGB')
        if im.size != (TW * 5, TH * 5):
            continue
        cells = []
        for cy in range(5):
            for cx in range(5):
                t = im.crop((cx * TW, cy * TH, (cx + 1) * TW, (cy + 1) * TH))
                r = reach_of(t)
                cells.append([r[k] if r[k] is not None else -1 for k in SIDES] + [span_of(t, k) or -1 for k in SIDES])
        reach[d['src']] = cells
    spec = {'by': 'tools/bohemia_combat_two_the_street_joins_11_10_26.py', 'rule': '442(d)', 'dir': 'kit_street/', 'tile_px': [TW, TH],
            'walk_px': {'N': NB[1], 'S': TH - SB[0], 'W': WB[1], 'E': TW - EB[0]},
            'note': 'a street tile by what is around it: open NESW, inside corners NE SE SW NW, centre line e/n/x; reach: how far in from each edge an old block tile\'s asphalt starts (a share of the tile, null: none on the middle of that edge)',
            'pieces': made, 'reach_cells': 'five rows of five, west to east then north to south, as the block picture lies (unmirrored); each [N, E, S, W] reach (-1 none), then [N, E, S, W] the asphalt span on that edge ([from, to] shares of the edge, west to east or north to south; -1 none)',
            'reach': reach}
    json.dump(spec, open(os.path.join(OUT, 'joins.json'), 'w'), separators=(',', ':'))
    print(len(made), 'pieces;', len(reach), 'block pictures read')


if __name__ == '__main__':
    main()
