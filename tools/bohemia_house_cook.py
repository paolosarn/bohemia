#!/usr/bin/env python3
"""
BOHEMIA — HOUSE 01, BUILT TO A HUMAN (7/29/26)

Paolo: "lets make a single house realistic to human sizing please." Target down the
line is sixteen approved houses for the suburb slots; this is the first, and it is
the one that settles what "human sizing" means so the other fifteen inherit it.

THE PROBLEM, IN ARITHMETIC, BEFORE ANY PIXEL IS DRAWN. The world's ground cell is
CELL_M = 0.75 m (engine/bohemia_overmap.js:20) and the art cell is 44 px, so one
pixel is 1.705 cm. The THREE-TILE WALL law makes a facade 3 cells and the DOOR LAW
makes a door 2 of them. Multiply it out:

    wall plate   3 x 0.75 =  2.25 m     (a real plate is 2.44 m — 8 ft)
    front door   2 x 0.75 =  1.50 m     (a real door is 2.03 m — 6 ft 8 in)

A 1.75 m person cannot walk through a 1.50 m door upright. That is the bug, and it
is not fixable by stacking a third tile either: real door-to-plate is 2.03/2.44 =
0.83, and whole tiles can only give 2/3 = 0.67 or 3/4 = 0.75. **You cannot build a
human-proportioned facade out of whole 0.75 m tiles.** So this house is authored as
ONE image at true scale rather than assembled from the vertical tile grid. Its
FOOTPRINT still snaps to whole cells so it drops into a suburb slot; everything you
measure yourself against — door, plate, window sill, garage — is real.

EVERY DIMENSION IS A REAL MEASUREMENT, NOT A GUESS (sources in records/):
    footprint      50 x 30 ft   15.0 x 9.0 m   -> 20 x 12 cells, 1453 sq ft, which
                                                  sits in the 1500-1700 sq ft band
                                                  ranch plans actually average
    plate height    8 ft 0 in    2.44 m        143 px
    front door     36 x 80 in    0.91 x 2.03 m  54 x 119 px  (the residential standard)
    garage door    16 x 7 ft     4.88 x 2.13 m 286 x 125 px  (the two-car standard)
    window         4 x 4 ft      1.22 m         72 px, sill at 3 ft = 53 px
    eave overhang  24 in         0.61 m         36 px
    roof pitch     4:12                         low, which is what a concrete-tile
                                                Vegas roof is framed at

REUSE CHECK: cooks no new colour. It opens
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — the 42-tile set Paolo
approved on 7/28 and chose again on 7/29 ("A") — and samples its stucco, terracotta,
concrete and void families for every value this house uses. Nothing is invented, so
the house cannot drift from the street it stands on. No other bank was needed; there
is no house art in banks/ to reuse, which is why this is being cooked at all.

TASTE CHECK, measured after rather than asserted: light from the upper LEFT, the
45-degree law's value bands (sky-lit top > lit front > away side), no pure black, no
white, no dither, dead-dark openings, and no orphan pixels.

  python3 tools/bohemia_house_cook.py
    -> banks/BOHEMIA_HOUSE_01_7_29_26.txt
    -> records/target/HOUSE_01.png
"""
import base64
import io
import json
import os
from collections import Counter

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT_BANK = 'banks/BOHEMIA_HOUSE_01_7_29_26.txt'
OUT_PNG = 'records/target/HOUSE_01.png'

CELL_M = 0.75
CELL_PX = 44
PX_M = CELL_M / CELL_PX          # 0.01705 m per pixel


def m(metres):
    """metres -> pixels, the only place a real dimension becomes art."""
    return int(round(metres / PX_M))


# ---- REAL DIMENSIONS. Change a number here and the house changes; there are no
# ---- magic pixel values anywhere below this block.
FOOT_W_C, FOOT_D_C = 20, 12                 # cells — the slot footprint
PLATE = m(2.44)                             # 143  8 ft
DOOR_W, DOOR_H = m(0.914), m(2.032)         # 54 x 119   36 x 80 in
GAR_W, GAR_H = m(4.877), m(2.134)           # 286 x 125  16 x 7 ft
WIN, SILL = m(1.219), m(0.914)              # 72, 53     4 ft, 3 ft
EAVE = m(0.610)                             # 36  24 in
RISE = m((9.0 / 2.0) * (4.0 / 12.0))        # 4:12 over half the depth

W = FOOT_W_C * CELL_PX                      # 880

# THE ROOF IS DRAWN SHALLOW, AND THE FIRST VERSION OF THIS FILE GOT IT BADLY WRONG.
# I drew the roof at its full PLAN depth — 12 cells, 528 px — so the house came out
# 79% roof and the roof read as a second wall. Cropping the house Paolo actually
# approved out of the re-cook frame settles it: its roof is about two cells deep
# against a four-cell facade. The view is much closer to elevation than to plan, so
# a horizontal plane is foreshortened hard. 120 px against a 143 px plate matches
# what he already said yes to.
ROOF_D = 120
H = ROOF_D + PLATE


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


CEIL = 232.0     # act 1 has no white


def ramp_from(bank, ids, n):
    """REUSE: pull a family's real colours off the approved tiles, darkest first.

    THE CEILING IS NOT OPTIONAL. Sampling the roof family by frequency handed back
    #fdfdf8 at luminance 252 — the sun-caught ridge highlight, which is a few pixels
    on one tile — and the first draw filled an entire hip PLANE with it. A near-white
    roof face is both an act-1 law break and, more simply, wrong: that colour exists
    to be a one-pixel glint, not a surface. Anything over the ceiling is refused
    here, so a highlight can never be mistaken for a material.
    """
    cnt = Counter()
    for t in bank['tiles']:
        if t['id'] not in ids:
            continue
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                if p[x, y][3] > 8:
                    cnt[p[x, y][:3]] += 1
    # the n most-used colours, so we take the material's body and not its specks
    top = [c for c, _ in cnt.most_common(max(n * 4, 16)) if lum(c) <= CEIL]
    top.sort(key=lum)
    if len(top) <= n:
        return top
    step = (len(top) - 1) / float(n - 1)
    return [top[int(round(i * step))] for i in range(n)]


def shade(c, k):
    return tuple(max(0, min(255, int(round(v * k)))) for v in c)


def main():
    bank = json.load(open(BANK))
    stucco = ramp_from(bank, {'wall_0', 'wall_1', 'wall_2', 'wall_base'}, 5)
    tile = ramp_from(bank, {'roof_slope', 'roof_ridge', 'roof_eave'}, 5)
    conc = ramp_from(bank, {'walk_0', 'walk_1', 'concrete_0'}, 4)
    void = ramp_from(bank, {'door_bottom', 'wall_window'}, 3)[:1] or [(26, 24, 22)]

    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    p = im.load()

    def rect(x0, y0, x1, y1, c):
        for y in range(max(0, y0), min(H, y1)):
            for x in range(max(0, x0), min(W, x1)):
                p[x, y] = c + (255,)

    # ================= THE ROOF ================================================
    # FLAT BANDS, NOT A GRADIENT. Version one shaded the roof with a continuous
    # ramp and produced 426 colours of smooth airbrush — photographic, and nothing
    # like the set he approved, whose roof is two or three flat values and a hip
    # line. Every pixel here is one of the family's own steps, so the house cannot
    # carry a colour the street does not have.
    #
    # HIP GEOMETRY, PROPERLY THIS TIME. A hip roof's ends fall away on a 45
    # diagonal, so the ridge is inset from each gable end by the roof's own drawn
    # depth. Version one shaded by x position and produced vertical stripes, which
    # is not a hip, it is a paint job.
    for y in range(ROOF_D):
        for x in range(W):
            d_l, d_r = x, W - 1 - x
            if d_l < ROOF_D and y < ROOF_D - d_l:
                c = tile[4]        # LEFT hip end, turned into the light
            elif d_r < ROOF_D and y < ROOF_D - d_r:
                c = tile[1]        # RIGHT hip end, turned away from it
            else:
                c = tile[3]        # the long near slope
            p[x, y] = c + (255,)

    # BARREL-TILE PANS RUN DOWN THE SLOPE, NOT ACROSS IT. The approved roof reads
    # as vertical streaking because that is the direction water runs; version one
    # laid horizontal courses and got corduroy.
    for x in range(0, W, 6):
        for y in range(ROOF_D):
            base = p[x, y][:3]
            if base == tile[3]:
                p[x, y] = (tile[2] if (x // 6) % 3 else tile[4]) + (255,)
            elif base == tile[4]:
                p[x, y] = tile[3] + (255,)
            else:
                p[x, y] = tile[0] + (255,)

    # THE RIDGE — one step up, one pixel, the top edge of the mass
    for x in range(ROOF_D, W - ROOF_D):
        p[x, 0] = tile[4] + (255,)

    # ================= THE FACADE ==============================================
    fy0 = ROOF_D
    rect(0, fy0, W, H, stucco[3])
    # THE EAVE SHADOW, and it is the darkest thing on the wall. A real 24 in
    # overhang at this sun angle throws about 0.5 m of hard shadow — hard, not a
    # fade, because the sun is a point source and the corpus draws it as one solid
    # dark band. Two flat steps, no ramp.
    rect(0, fy0, W, fy0 + m(0.30), stucco[0])
    rect(0, fy0 + m(0.30), W, fy0 + m(0.50), stucco[2])
    # the fascia board the roof sits on, sitting proud of the wall
    rect(0, fy0 - 3, W, fy0, tile[0])

    # STUCCO TOOTH. Real stucco is a sand float, not a flat colour: a sparse,
    # low-contrast speckle. Deterministic, because a house that re-cooks different
    # every run cannot be approved.
    # STEP UP OR DOWN THE RAMP — never multiply. Multiplying was what minted 426
    # colours; stepping keeps the whole house inside the approved family.
    up = {stucco[i]: stucco[min(i + 1, len(stucco) - 1)] for i in range(len(stucco))}
    dn = {stucco[i]: stucco[max(i - 1, 0)] for i in range(len(stucco))}
    seed = 20260729
    for y in range(fy0 + m(0.5), H):
        for x in range(W):
            seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
            c = p[x, y][:3]
            if (seed >> 16) % 23 == 0 and c in up:
                p[x, y] = up[c] + (255,)
            elif (seed >> 16) % 29 == 0 and c in dn:
                p[x, y] = dn[c] + (255,)

    ground = H
    # ---- the two-car garage, left of the entry (the Vegas tract arrangement:
    # ---- the garage fronts the street and the door is set beside it)
    gx = m(0.9)
    rect(gx, ground - GAR_H, gx + GAR_W, ground, conc[2])
    for y in range(ground - GAR_H, ground, m(0.51)):     # 20 in panel courses
        rect(gx, y, gx + GAR_W, y + 1, conc[0])
    rect(gx - 3, ground - GAR_H - 3, gx + GAR_W + 3, ground - GAR_H, stucco[1])

    # ---- the front door, and this is the number the whole exercise is about
    dx = gx + GAR_W + m(1.2)
    rect(dx - 4, ground - DOOR_H - 4, dx + DOOR_W + 4, ground, stucco[1])
    rect(dx, ground - DOOR_H, dx + DOOR_W, ground, void[0])
    # a door reads as a door because of its stile-and-rail, not its outline
    rect(dx + 6, ground - DOOR_H + 8, dx + DOOR_W - 6, ground - 8, stucco[0])
    rect(dx + DOOR_W - 16, ground - m(1.0) - 2, dx + DOOR_W - 12, ground - m(1.0) + 2,
         stucco[4])                                               # the handle, at 1.0 m

    # ---- windows, sill at a real 3 ft
    for wx in (dx + DOOR_W + m(1.1), dx + DOOR_W + m(1.1) + WIN + m(0.9)):
        if wx + WIN > W - m(0.6):
            continue
        rect(wx - 3, ground - SILL - WIN - 3, wx + WIN + 3, ground - SILL, stucco[1])
        rect(wx, ground - SILL - WIN, wx + WIN, ground - SILL, void[0])
        # glass is DEAD DARK in act 1, but it is still glass: one cool raking
        # highlight across the top pane, no hot yellow anywhere
        for y in range(ground - SILL - WIN, ground - SILL - WIN + WIN // 3):
            for x in range(wx, wx + WIN):
                if (x - wx) + (y - (ground - SILL - WIN)) < WIN // 2:
                    p[x, y] = stucco[0] + (255,)
        rect(wx, ground - SILL - 3, wx + WIN, ground - SILL, stucco[4])

    im.save(OUT_PNG)

    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    json.dump({
        'version': 'BOHEMIA_HOUSE_01_v1',
        'built': '2026-07-29',
        'authority': ('Paolo 7/29: "lets make a single house realistic to human sizing '
                      'please." NOT APPROVED — this is candidate 1 of a target 16.'),
        'colours_from': BANK,
        'footprint_cells': [FOOT_W_C, FOOT_D_C],
        'metres': {'footprint': [FOOT_W_C * CELL_M, FOOT_D_C * CELL_M],
                   'plate': 2.44, 'door': [0.914, 2.032], 'garage': [4.877, 2.134],
                   'window': 1.219, 'sill': 0.914, 'eave': 0.610, 'pitch': '4:12'},
        'px_per_m': 1.0 / PX_M,
        'b64': base64.b64encode(b.getvalue()).decode(),
    }, open(OUT_BANK, 'w'))

    cols = {p[x, y][:3] for y in range(H) for x in range(W) if p[x, y][3] > 8}
    print('HOUSE 01  %dx%d px  = %.1f x %.1f m footprint (%d x %d cells)'
          % (W, H, FOOT_W_C * CELL_M, FOOT_D_C * CELL_M, FOOT_W_C, FOOT_D_C))
    print('   door %d px = %.2f m      plate %d px = %.2f m'
          % (DOOR_H, DOOR_H * PX_M, PLATE, PLATE * PX_M))
    print('   garage %dx%d = %.2f x %.2f m' % (GAR_W, GAR_H, GAR_W * PX_M, GAR_H * PX_M))
    print('   %d colours, all sampled from the approved set' % len(cols))
    print('   -> %s  +  %s' % (OUT_BANK, OUT_PNG))


if __name__ == '__main__':
    main()
