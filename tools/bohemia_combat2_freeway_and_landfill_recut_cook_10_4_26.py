#!/usr/bin/env python3
"""THE FREEWAY AND THE LANDFILL, RE-CUT  (COMBAT 2 [floor set] round fifteen, rule 67)

PAOLO, HIS SIXTH VOTES (10/2): 'landfill and freeway look like dog shit, re-cut them.' Measured against
what they should be, both were a texture with a few cars or tyres on it: no shape you would know from the
far zoom. A board kind has to be a PLACE first (CGRD-01). So both are rebuilt around their real shapes.

  THE FREEWAY (I-15 through the valley)
    * SOUND WALLS on both edges, the grey block walls every Vegas freeway runs between, their faces seen
      from the 45 camera, the north one tall enough to read as a wall (blocked);
    * EIGHT LANES with their dashes, the yellow inside edges, the shoulders and their rumble strips;
    * THE MEDIAN as a raised concrete jersey run, top lit, face seen (blocked: you climb it or go round);
    * THE OVERPASS (variant one): a north-south deck crossing over the lanes on piers, its railings, its
      deck as HIGH GROUND, the lanes under it in its shadow, the piers as cover;
    * THE JAM: the cars where everyone stopped, nose to tail in the lanes, two of them burnt.
  THE LANDFILL (Apex, north of the city)
    * THE CELLS: the dump is terraced, three benches of compacted trash stepping up to the north, each
      bench's face seen at 45 (height: the top bench is the high ground);
    * THE ACTIVE FACE: the newest trash dense with his rubble, bales and tyre stacks;
    * THE HAUL ROAD: a graded switchback climbing the benches, berms on its edges;
    * THE METHANE VENTS: pipes standing out of the capped cells, and one flare still burning (light);
    * THE FENCE: chain-link on the south edge with the litter caught in it.

Variants 0 and 1 of each share the same lanes and benches at their edges, so they tile side by side in a
board and the lines run through (rule 67).

WHAT IS PROVED, NOT CLAIMED: round three's guard on every block (515 x 364 tiles, his colours, legal
placements, no stamped tile). The variants share their lane and bench rows by construction (the same
metres), which is what lets them sit side by side.

THE ANALOG HORROR LINE (rule 20): the methane flare has burned since before the collapse. Nobody lit it
and nobody can put it out, and at night it is the only light for a mile.

REFERENCE CHECK (the 9/4 standing law):
  TG-04 THE STREET TILE: the lane paint, the shoulder, the kerb of the median.
  TG-02 THE HOUSE FROM 45 DEGREES: every raised thing shows its top and its south face (walls, median,
        deck, benches).
  CGRD-01 INTO THE BREACH: each board has one shape you name from the far zoom: the overpass's cross, the
        stepped benches.
  AH-01 THE BIBLE: the sun north-west, every shadow south-east.
  REUSE CHECK: asphalt, concrete, deck and stucco from his 7/28 bank; the desert soils, rubble and rock
  from the desert pools bank; the wrecks and walls from the cover cook; every helper from rounds 2-14.

[bb the battle map] 02_COMBAT_RULES.md: Battle Brothers' maps read by their landform first (a hill, a
  river, a ruin). OURS: the landforms are the city's: a freeway and the hill it built out of its trash.

    (a module: the round-nine builder imports freeway2 and landfill2)
    python3 tools/bohemia_combat2_freeway_and_landfill_recut_cook_10_4_26.py
      -> slices/vote/COMBAT2_FREEWAY_AND_LANDFILL_RECUT_10_4.png
"""
import importlib, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')
MX, S8, H7, R5, R4, B, F, K, CV = BT.MX, BT.S8, BT.H7, BT.R5, BT.R4, BT.B, BT.F, BT.K, BT.CV
os.chdir(REPO)

OUT_CARD = 'slices/vote/COMBAT2_FREEWAY_AND_LANDFILL_RECUT_10_4.png'
M, ty, PX, PY, N, BP = B.M, B.ty, B.PX, B.PY, B.N, B.BP
A, C, G, T, ST = B.A, B.C, B.G, B.T, K.RAMPS['stucco']


def _mask(): return Image.new('L', (BP, BP), 0)


def _wall_face(board, y_t, h_m, seed):
    """A sound wall's face across the whole width at board row y_t (tilted px), h_m tall at cos45."""
    h = ty(M(h_m))
    face = K.dress(['concrete_0', 'concrete_1'], BP, h, seed)
    board.paste(face, (0, y_t))
    d = ImageDraw.Draw(board)
    d.rectangle([0, y_t - ty(M(0.3)), BP, y_t], fill=C[5]); d.line([(0, y_t - ty(M(0.3))), (BP, y_t - ty(M(0.3)))], fill=C[6])
    for y in range(y_t, y_t + h, ty(M(0.6))): d.line([(0, y), (BP, y)], fill=C[2])
    for x in range(0, BP, M(6.0)): d.line([(x, y_t), (x, y_t + h)], fill=C[1], width=2)
    K.shade(board, (0, y_t + h - 4, BP, y_t + h + ty(M(1.0))), 0.7)


def freeway2(seed, overpass=False):
    r = K.R(seed)
    plan = B.dress_any([B.DGROUND[1]], BP, BP, seed)
    lanes = [(10.5 + 3.7 * k) for k in range(1, 4)] + [(38.0 + 3.7 * k) for k in range(1, 4)]
    road = R4.road_band(plan, 8.5, 54.5, seed + 1, lines=[(y, False, C[5]) for y in lanes] +
                        [(9.6, True, C[5]), (31.4, True, T[5]), (37.4, True, T[5]), (53.4, True, C[5])])
    d = ImageDraw.Draw(plan)
    for x in range(0, BP, M(0.6)):                                     # the rumble strips on the shoulders
        d.line([(x, M(9.0)), (x, M(9.4))], fill=A[1]); d.line([(x, M(53.6)), (x, M(54.0))], fill=A[1])
    med = _mask(); ImageDraw.Draw(med).rectangle([0, M(33.4), BP, M(34.6)], fill=255)
    plan.paste(Image.new('RGB', (BP, BP), C[5]), (0, 0), med)           # the jersey median, top lit
    under_med = _mask(); ImageDraw.Draw(under_med).rectangle([0, M(34.6), BP, BP], fill=255)
    road_low = Image.fromarray((np.array(road) > 127).astype('uint8') * 255)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    B.faces(board, under_med.resize((BP, PY * N), Image.NEAREST), C[2], 0.8)
    _wall_face(board, ty(M(5.0)), 4.0, seed + 2)                         # the north sound wall
    d = ImageDraw.Draw(board)
    d.rectangle([0, ty(M(56.5)), BP, ty(M(56.5)) + ty(M(0.6))], fill=C[4])   # the south wall's top (its face looks away)
    d.line([(0, ty(M(56.5))), (BP, ty(M(56.5)))], fill=C[6])
    grid = R4.terrain([])
    for c in range(N): grid[0][c] = 'blocked'                            # the north wall row
    pieces = []
    cars = ['car_lane', 'car_kerb']
    for k in range(9):                                                   # the jam, nose to tail
        lane_y = [12.0, 15.8, 19.5, 23.2, 39.5, 43.2, 47.0, 50.6][r.i(8)]
        x = round(2 + r() * 52, 1)
        pieces.append(dict(piece=cars[r.i(2)], x_m=x, y_m=lane_y))
    if overpass:                                                         # THE OVERPASS, north-south over the lanes
        x0, x1 = 24.0, 36.0
        deck_top = ty(M(2.0))
        dk = B.quiet_big(K.dress(['concrete_0', 'concrete_1'], BP, BP, seed + 5)).resize((BP, PY * N), Image.NEAREST).crop((M(x0), 0, M(x1), PY * N))
        shadow = _mask().resize((BP, PY * N)); sd = ImageDraw.Draw(shadow)
        sd.rectangle([M(x1), 0, M(x1 + 3.0), PY * N], fill=255)          # its shadow east of the deck
        B.shade_mask(board, shadow, 0.62)
        for py_ in (ty(M(15.0)), ty(M(44.0))):                           # the piers, seen in the gaps
            d.rectangle([M(x0 + 2), py_, M(x0 + 3.2), py_ + ty(M(6.0))], fill=C[3])
            d.rectangle([M(x1 - 3.2), py_, M(x1 - 2), py_ + ty(M(6.0))], fill=C[3])
        board.paste(dk, (M(x0), 0))
        d.rectangle([M(x0), 0, M(x0) + M(0.4), PY * N], fill=C[6]); d.rectangle([M(x1) - M(0.4), 0, M(x1), PY * N], fill=C[4])   # the railings
        d.line([(M((x0 + x1) / 2), 0), (M((x0 + x1) / 2), PY * N)], fill=T[5], width=3)          # its centre line, faded yellow
        for _ in range(60):                                              # oil stains and spalls, nowhere twice
            sx, sy = M(x0 + 1) + r.i(M(x1 - x0 - 2)), r.i(PY * N)
            d.ellipse([sx, sy, sx + M(0.4 + r() * 1.2), sy + ty(M(0.3 + r() * 0.8))], fill=C[2] if r() < 0.6 else A[3])
        for k in range(1, 9): d.line([(M(x0), k * PY * N // 9 + r.i(20)), (M(x1), k * PY * N // 9 + r.i(20))], fill=C[1], width=2)   # the joints
        for rw in range(N): grid[rw][2] = 'height'
        pieces = [p for p in pieces if not (x0 - 5 < p['x_m'] < x1 + 1)]
    pieces = [p for p in pieces if grid[int(p['y_m'] // 12)][int(p['x_m'] // 12)] not in ('blocked',)]
    return board, pieces, dict(road=road), grid


def landfill2(seed, flare=True):
    r = K.R(seed)
    soil = B.dress_any([B.DGROUND[0]], BP, BP, seed)
    trash = B.dress_any([B.DGROUND[5], B.DGROUND[4]], BP, BP, seed + 1)
    plan = soil.copy()
    benches = [(0.0, 16.0), (16.0, 30.0), (30.0, 42.0)]                 # three benches stepping up to the north
    tops = []
    for k, (y0, y1) in enumerate(benches):
        mk = _mask(); ImageDraw.Draw(mk).rectangle([0, M(y0), BP, M(y1)], fill=255)
        layer = B.dress_any([B.DGROUND[1]], BP, BP, seed + 3) if k == 0 else trash.copy()   # the top cell is capped; the lower two are open trash
        plan.paste(layer, (0, 0), mk); tops.append(mk)
    haul = _mask(); hd = ImageDraw.Draw(haul)                           # the switchback
    hd.line([(M(4), M(58)), (M(50), M(46)), (M(12), M(36)), (M(48), M(24)), (M(20), M(10))], fill=255, width=M(5.0))
    plan.paste(B.dress_any([B.DGROUND[2]], BP, BP, seed + 7), (0, 0), haul)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    for k, (y0, y1) in enumerate(benches):                              # each bench's south face, seen
        below = _mask(); ImageDraw.Draw(below).rectangle([0, M(y1), BP, BP], fill=255)
        hb = np.array(below.resize((BP, PY * N), Image.NEAREST)) > 127
        hb &= ~(np.array(haul.resize((BP, PY * N), Image.NEAREST)) > 127)
        B.faces(board, Image.fromarray(hb.astype('uint8') * 255), G[0], 2.0)
    d = ImageDraw.Draw(board)
    haul_t = np.array(haul.resize((BP, PY * N), Image.NEAREST)) > 127
    def bale(x, y):                                                     # a compacted bale: top lit, face in shadow
        w, h, f = M(1.3), ty(M(1.1)), ty(M(1.1))
        top, col = [(A[5], A[3]), (T[3], T[1]), (C[5], C[3]), (G[2], G[0]), (A[6], A[4])][r.i(5)]   # both on his ramps
        d.rectangle([x, y, x + w, y + h], fill=top)
        d.rectangle([x, y + h, x + w, y + h + f], fill=col)
        d.line([(x, y + h), (x + w, y + h)], fill=A[1])
        for k in range(1, 3): d.line([(x, y + h + k * f // 3), (x + w, y + h + k * f // 3)], fill=A[2])
    for _ in range(90):                                                 # bales stacked on the two open benches
        x, y = r.i(BP - M(2)), ty(M(17 + r() * 24))
        if not haul_t[min(y, haul_t.shape[0] - 1), min(x, BP - 1)]:
            bale(x, y)
            if r() < 0.4: bale(x + M(0.2), y - ty(M(1.1)))
    for _ in range(60):                                                 # tyre stacks: rings of black, three high
        x, y = r.i(BP - M(1)), ty(M(16 + r() * 26))
        if haul_t[min(y, haul_t.shape[0] - 1), min(x, BP - 1)]: continue
        for k in range(3): d.ellipse([x, y - k * 5, x + M(0.8), y - k * 5 + M(0.45)], fill=A[0], outline=A[2])
    for k in range(7):                                                  # the methane vents, standing pipes
        x, y = M(4 + k * 8 + r() * 3), ty(M(4 + r() * 8))
        d.rectangle([x, y - ty(M(2.0)), x + 6, y], fill=C[3]); d.rectangle([x - 2, y - ty(M(2.0)) - 3, x + 8, y - ty(M(2.0))], fill=C[5])
    if flare:                                                           # the flare that never went out
        fx, fy = M(46.0), ty(M(6.0))
        d.rectangle([fx, fy - ty(M(4.0)), fx + 8, fy], fill=C[2])
        for k, col in enumerate((T[3], T[4], T[5])):
            d.polygon([(fx - 6 + k * 2, fy - ty(M(4.0))), (fx + 4, fy - ty(M(4.0)) - 22 + k * 6), (fx + 14 - k * 2, fy - ty(M(4.0)))], fill=col)
    for x in range(0, BP, M(3.0)):                                      # the fence, south, with litter caught in it
        d.rectangle([x, ty(M(59.0)) - 14, x + 3, ty(M(59.0))], fill=A[2])
    d.line([(0, ty(M(59.0)) - 12), (BP, ty(M(59.0)) - 10)], fill=A[3], width=2)
    grid = R4.terrain([])
    for c in range(N):
        grid[0][c] = 'height'; grid[1][c] = 'height'                     # the top bench, high ground
        grid[2][c] = 'rough'
    for (x, y) in [(0, 3), (4, 3)]: grid[y][x] = 'debris'
    pieces = [dict(piece='rubble_%d' % r.i(len(R5.EXTRA)), x_m=round(3 + r() * 54, 1), y_m=round(31 + r() * 9, 1)) for _ in range(7)]
    pieces += [dict(piece='car_kerb', x_m=round(8 + r() * 40, 1), y_m=round(46 + r() * 8, 1))]
    return board, pieces, dict(), grid


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    blocks = {'freeway.0': freeway2(1201), 'freeway.1': freeway2(1213, overpass=True),
              'landfill.0': landfill2(1301), 'landfill.1': landfill2(1313, flare=False)}
    B.guard({k: v[:3] for k, v in blocks.items()}, cover)
    sc = 0.2
    out = Image.new('RGB', (int(BP * sc) * 2 + 60, int(PY * N * sc) * 2 + 120), (12, 11, 10))
    d = ImageDraw.Draw(out)
    for i, (k, (board, pieces, *_)) in enumerate(blocks.items()):
        im = B.composed(board, pieces, cover).convert('RGB').resize((int(BP * sc), int(PY * N * sc)), Image.LANCZOS)
        x, y = 20 + (i % 2) * (im.size[0] + 20), 20 + (i // 2) * (im.size[1] + 50)
        d.text((x, y), {'freeway.0': 'THE FREEWAY: sound walls, eight lanes, the median, the jam',
                        'freeway.1': 'THE FREEWAY: the overpass (its deck is high ground)',
                        'landfill.0': 'THE LANDFILL: three benches, the active face, the flare',
                        'landfill.1': 'THE LANDFILL: the switchback haul road, the vents'}[k], font=K.font(14), fill=(222, 181, 118))
        out.paste(im, (x, y + 24))
    out.save(OUT_CARD, optimize=True)
    print('ok: freeway x2, landfill x2 -> %s' % OUT_CARD)


if __name__ == '__main__':
    main()
