#!/usr/bin/env python3
"""THE CASINO FLOOR: THE ONE INTERIOR BOARD  (COMBAT 2, OPEN row [the casino floor])

The fifteen grounds list the casino floor as an interior (WORLD 9/30): a fight inside a dead Strip casino at 45,
20 x 15 house tiles (4 x 3 blocks), the same manifest. Battle Brothers fights in ruins and camps with walls,
tents and debris as its cover; ours is the pit of a casino the dollar killed.

  THE FLOOR    the carpet every casino has (his terracotta ramp, a diamond lattice, a brass motif), worn to the
               backing in the aisles, stained, a burnt patch where somebody kept a fire. Periodic every 12 m, so
               every casino block meets every other (rule 77: carpet is 'other' to the edge reader, it joins).
  THE COVER    slot banks (6 m rows of machines, COVER 1.7 m, back to back), card tables (felt half-moons,
               LOW_COVER 0.9 m), pillars (BLOCK MOVE, a 1.2 m column with its mirror cladding gone).
  HIGH GROUND  the cashier's cage: a raised counter a step up, bars on its face, one tile you climb (HEIGHT).
  THE DARK     a building with no power: the fight's night pass lights only what still runs, the few slot
               machines on a scavenged battery (circuit 'grid': the map says if the Strip has power) and the
               fires people keep in steel drums (circuit 'fire', always).
  THE AISLES   every tile row 2 (the middle of each block) is an aisle west to east, so your line and theirs
               are always joined across the floor.

THE ANALOG HORROR LINE (rule 20): the machines that still have power still play their attract loop to nobody,
a blue glow on the carpet; everything else is dark.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: the pit reads at a glance: rows of machines, a ring of tables, the cage.
  TG-04 THE STREET TILE: the same 45 degree law and density as the street blocks (42.9 px/m, depth x cos45).
  AH-01 THE BIBLE: his ramps only (terracotta carpet, brass, felt green and screen blue from his tiles' own
        colours); the colour guard B.guard refuses anything else.
  REUSE CHECK: _box45 for every machine, table and the cage (BT), his oil drum light, the builder's manifest.

[bb the battle map] Battle Brothers' interior-feeling maps (ruins, camps) are open ground with dense blockers and
  a raised spot; the lines start 5 tiles apart. OURS: the casino pit, cover in rows, the cage as the hill.

    built by tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py (MAKERS 'casino')
"""
import importlib, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')
B, K, R4 = BT.B, BT.K, BT.R4
M, ty, PX, PY, N, BP = B.M, B.ty, B.PX, B.PY, B.N, B.BP
A, C, G, T = B.A, B.C, B.G, B.T
FELT = [(32, 69, 50), (36, 88, 59), (55, 117, 79)]                     # from his tiles' own colours (B.OK)
BRASS, SCREEN = (234, 193, 93), (79, 162, 194)


def carpet(seed):
    """The casino carpet in plan space, periodic every 12 m (one house tile)."""
    tile = Image.new('RGB', (PX, PX), T[0]); d = ImageDraw.Draw(tile)
    step = PX // 8
    for k in range(-8, 17):                                             # the diamond lattice
        d.line([(k * step, 0), (k * step + PX, PX)], fill=T[1], width=3)
        d.line([(k * step, PX), (k * step + PX, 0)], fill=T[1], width=3)
    for i in range(8):
        for j in range(8):
            cx, cy = i * step + step // 2, j * step + step // 2
            if (i + j) % 2 == 0: d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=BRASS if (i * 3 + j) % 5 == 0 else T[3])
            else: d.rectangle([cx - 3, cy - 3, cx + 3, cy + 3], fill=A[2])
    plan = Image.new('RGB', (BP, BP))
    for y in range(0, BP, PX):
        for x in range(0, BP, PX): plan.paste(tile, (x, y))
    return plan


def wear(plan, seed, aisle_rows=(2,)):
    """Worn to the backing down the aisles, stains, one burnt patch: seeded, never twice the same."""
    r = K.R(seed); d = ImageDraw.Draw(plan)
    for rw in aisle_rows:
        y0 = M(rw * 12 + 3.0); y1 = M(rw * 12 + 9.0)
        for _ in range(140):
            x = M(0.5) + r.i(BP - M(2.5)); y = y0 + r.i(y1 - y0); w = M(0.3 + r() * 1.4)
            d.ellipse([x, y, x + w, y + w // 2], fill=[A[3], T[1], T[0]][r.i(3)])
    for ty_ in range(N):                                                # every tile its own wear: stains, a lost motif, a scorch
        for tx_ in range(N):
            for _ in range(2 + r.i(3)):
                x, y = M(tx_ * 12 + 0.5 + r() * 8.5), M(ty_ * 12 + 0.5 + r() * 9.5)   # clear of the block's sides
                d.ellipse([x, y, x + M(0.4 + r() * 2.2), y + M(0.3 + r() * 1.4)], fill=[A[3], A[2], T[0], T[1]][r.i(4)])
    for _ in range(2):
        x, y = M(1.0) + r.i(BP - M(7)), M(1.0) + r.i(BP - M(5))
        d.ellipse([x, y, x + M(2 + r() * 3), y + M(1.2 + r() * 2)], fill=A[2])


def slot_bank(seed, live=False):
    """6 m of machines back to back at 45: the cabinets' tops, their faces with screens (one lit if live)."""
    im = BT._box45(6.0, 1.6, 1.7, A[2], A[1], seed, ribs=0.75)
    d = ImageDraw.Draw(im); dp, fh = ty(M(1.6)), ty(M(1.7))
    r = K.R(seed)
    for k in range(8):
        x = M(0.75 * k + 0.12)
        lit = live and k == 1 + r.i(5)
        d.rectangle([x, dp + ty(M(0.3)), x + M(0.5), dp + ty(M(0.75))], fill=SCREEN if lit else A[0])   # the screen
        d.rectangle([x, dp + ty(M(0.9)), x + M(0.5), dp + ty(M(1.0))], fill=BRASS if k % 2 else C[4])      # the tray
        d.rectangle([x + M(0.05), 2, x + M(0.45), ty(M(0.25))], fill=T[2] if k % 3 else T[4])             # the topper
    return im


def table(seed):
    """A card table: felt top with a brass rail, the apron's dark face; low cover."""
    im = BT._box45(2.4, 1.4, 0.9, FELT[1], A[3], seed)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, M(2.4), 4], fill=BRASS); d.rectangle([M(0.3), ty(M(0.4)), M(2.1), ty(M(0.9))], outline=FELT[2])
    return im


def pillar(seed):
    """A column, its mirror cladding stripped: a tall face you cannot pass."""
    im = BT._box45(1.2, 1.2, 3.6, C[4], C[3], seed)
    d = ImageDraw.Draw(im); dp = ty(M(1.2))
    for y in range(dp + 8, dp + ty(M(3.6)), ty(M(0.6))): d.line([(2, y), (M(1.2) - 2, y)], fill=C[2], width=2)
    d.rectangle([M(0.2), dp + ty(M(0.5)), M(0.6), dp + ty(M(1.4))], fill=C[6])    # the one mirror tile left
    return im


def slot_glow(seed):
    """The light sprite of a machine that still runs: a small blue screen; the pool is the fight's."""
    im = Image.new('RGBA', (M(0.6), ty(M(0.5))), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, M(0.6) - 1, ty(M(0.5)) - 1], fill=SCREEN + (255,), outline=A[0] + (255,))
    return im


def casino(variant):
    """One 60 x 60 m block of the floor. variant 0: rows of slots; 1: the cashier's cage; 2: the table pit."""
    seed = 1500 + variant * 37
    plan = carpet(seed); wear(plan, seed)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    grid = R4.terrain([])
    pieces = []
    r = K.R(seed)
    rows_y = [3.0, 8.4, 39.0, 44.4, 51.0]                              # the bank rows, clear of the aisle (24-36 m)
    if variant == 0:
        for y in rows_y:
            for x in (2.0, 9.0, 31.0, 38.0, 45.0):
                if r() < 0.86: pieces.append(dict(piece='slot_bank', x_m=x, y_m=y))
        pieces.append(dict(piece='pillar', x_m=24.4, y_m=15.0)); pieces.append(dict(piece='pillar', x_m=24.4, y_m=45.0))
    elif variant == 1:                                                  # THE CAGE: tiles (1, 2) and (1, 3), raised
        d = ImageDraw.Draw(board)
        x0, x1, y0, y1 = M(24.0), M(48.0), ty(M(12.0)), ty(M(22.0))
        d.rectangle([x0, y0, x1, y1], fill=C[4])                        # the counter's floor, a step up
        for xx in range(x0, x1, M(1.0)): d.line([(xx, y0), (xx, y1)], fill=C[3], width=2)
        d.rectangle([x0, y1, x1, y1 + ty(M(1.1))], fill=G[1])           # its face, south, seen
        for xx in range(x0 + 6, x1, M(0.25)): d.line([(xx, y1 - ty(M(2.4))), (xx, y1 + ty(M(1.1)))], fill=A[1], width=2)   # the bars
        d.rectangle([x0, y1 - ty(M(2.4)) - 4, x1, y1 - ty(M(2.4))], fill=BRASS)
        for xx in (M(28.0), M(36.0), M(44.0)): d.rectangle([xx, y1 - ty(M(1.0)), xx + M(1.6), y1 - ty(M(0.6))], fill=A[0])   # the windows
        grid[1][2] = grid[1][3] = 'height'
        for y in (39.0, 44.4):
            for x in (2.0, 9.0, 38.0, 45.0): pieces.append(dict(piece='slot_bank', x_m=x, y_m=y))
        for x in (3.0, 10.0): pieces.append(dict(piece='slot_bank', x_m=x, y_m=8.4))
        pieces.append(dict(piece='pillar', x_m=54.0, y_m=15.0))
    else:                                                               # THE PIT: card tables in a ring
        for (x, y) in [(6, 4), (14, 4), (40, 4), (48, 4), (6, 42), (14, 42), (22, 47), (34, 47), (42, 42), (50, 42)]:
            pieces.append(dict(piece='table', x_m=float(x), y_m=float(y)))
        pieces.append(dict(piece='pillar', x_m=29.4, y_m=8.0)); pieces.append(dict(piece='pillar', x_m=29.4, y_m=50.0))
    return board, pieces, {}, grid


FURN = {'slot_bank': (slot_bank, dict(h=1.7, kind='COVER')), 'table': (table, dict(h=0.9, kind='LOW_COVER')),
        'pillar': (pillar, dict(h=3.6, kind='COVER', blocks_move=True))}


def install():
    """The casino's pieces join the buildings' furniture (BT.FURNITURE / FURN_META), so the builder ships them."""
    for k, (fn, meta) in FURN.items():
        if k in BT.FURNITURE: continue
        im = fn(3000 + len(BT.FURNITURE)); BT.FURNITURE[k] = im; BT.FURN_META[k] = meta; B.OK |= K.colours(im)
    g = slot_glow(0); B.OK |= K.colours(g)
    return g
