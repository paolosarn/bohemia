#!/usr/bin/env python3
"""MIXED BLOCKS: NO BOARD IS ONE PATTERN CLONED  (COMBAT 2 [floor set] round eleven)

SWEEP L (coordinator, 10/2): 'the boards must not repeat one pattern across the width (the open
frame shows one suburb row cloned); mix kinds inside a board and seed it.' Round nine's suburb
variants changed the dirt, not the plan: every block put houses on the same eight tiles, so at the
fight's far open the board read as one strip copied four times. This round changes the PLAN:

  SUBURB, SEEDED       which lots carry a house is drawn per seed (three to five a side), so the
                       gaps, the climbable flat roof and the drives move; one house in six burnt.
  THE CORNER           a north-south cross street through one column, with its crosswalk where it
                       meets the block's street: boards become a GRID of streets, not stripes.
  THE EMPTY LOTS       a block where the houses were never built or were taken down: graded dirt,
                       the slabs of the foundations, the drive aprons going nowhere, chain-link.

These are the blocks round nine's manifest builder now mixes, seeded, so no two neighbours repeat
and no board row is one block four times.

WHAT IS PROVED, NOT CLAIMED: round three's guard on every block (size, his colours, legal
placements, no stamped tile); the house-guard of round seven on every new house tile.

THE ANALOG HORROR LINE (rule 20): the empty lots have their slabs poured and their drive aprons
cut into the kerb. The houses were supposed to go up the month the money stopped.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES and TG-04 THE STREET TILE, carried by the imported pieces.
  CGRD-01 INTO THE BREACH: variety in the PLAN, not the noise, is what reads at the far zoom.
  AH-01 THE BIBLE: the sun north-west, the shadow south-east.
  REUSE CHECK: house45, store45 and the street, walk, drive and yard helpers from rounds 2-8.

[bb the battle map] 02_COMBAT_RULES.md, the BOARD line: BB scatters its blockers by rule per map so no
  two fights match. OURS: the rule scatters the houses on a real plat.

    (a module: imported by tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py)
"""
import importlib, os, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
S8 = importlib.import_module('bohemia_combat2_store_fronts_and_houses_everywhere_cook_10_2_26')
H7, R5, R4, B, F, K, CV = S8.H7, S8.R5, S8.R4, S8.B, S8.F, S8.K, S8.CV
PX, PY, N, M, C = B.PX, B.PY, B.N, B.M, B.C


def _street(plan, seed):
    side = F.SIDE / K.PPM
    R4.walk_band(plan, 24.0, 24.0 + side, seed); R4.walk_band(plan, 36.0 - side, 36.0, seed + 1)
    road = R4.road_band(plan, 24.0 + side, 36.0 - side, seed + 2, lines=[(30.0, False, C[5])])
    d = ImageDraw.Draw(plan)
    d.rectangle([0, M(24.0 + side) - 3, B.BP, M(24.0 + side)], fill=C[5])
    d.rectangle([0, M(36.0 - side), B.BP, M(36.0 - side) + 3], fill=C[5])
    return road


def suburb_seeded(seed, cross_col=None):
    r = K.R(seed)
    north = [(c, 1) for c in range(N) if r() < 0.72 and c != cross_col]
    south = [(c, 3) for c in range(N) if r() < 0.72 and c != cross_col]
    if len(north) < 2: north = [(c, 1) for c in (0, 3) if c != cross_col]
    if len(south) < 2: south = [(c, 3) for c in (1, 4) if c != cross_col]
    plan = R4.yards(seed)
    R4.drives(plan, north, 24.0, seed + 3); R4.drives(plan, south, 36.0, seed + 4)
    road = _street(plan, seed + 5)
    board = plan.resize((B.BP, PY * N), Image.NEAREST)
    B.faces(board, road.resize((B.BP, PY * N), Image.NEAREST), C[2], 0.15)
    houses = north + south
    flat = {houses[r.i(len(houses))]}
    grid = R4.terrain([])
    for i, (c, rw) in enumerate(houses):
        if (c, rw) in flat:
            board.paste(F.roof(seed + 7 * i), (c * PX, rw * PY)); grid[rw][c] = 'height'; continue
        burnt = r() < 0.16
        t = (S8.burnt45 if burnt else H7.house45)(seed + 13 * i, 'north' if rw == 1 else 'south')
        board.paste(t, (c * PX, rw * PY)); grid[rw][c] = 'blocked'
    if cross_col is not None:
        for rw in range(N):
            t = F.street_small(13, crossing=True) if rw == 2 else F.street_small(19 + 2 * rw, ns=True)
            board.paste(t, (cross_col * PX, rw * PY)); grid[rw][cross_col] = 'flat'
    pieces = []
    for c in range(N):                                                  # back walls, a shed, cars: seeded
        if (c, 1) not in houses and c != cross_col and r() < 0.6: pieces.append(dict(piece='wall' if r() < 0.6 else 'wall_broken', x_m=c * 12 + 3.0, y_m=11.0))
        if (c, 3) not in houses and c != cross_col and r() < 0.5: pieces.append(dict(piece='shed', x_m=c * 12 + 4.0, y_m=50.0))
    for k in range(1 + r.i(3)):
        x = 3 + r() * 50
        if cross_col is not None and cross_col * 12 - 4 < x < cross_col * 12 + 12: continue
        pieces.append(dict(piece='car_lane' if r() < 0.5 else 'car_kerb', x_m=round(x, 1), y_m=27.0 + r() * 4))
    pieces = [p for p in pieces if grid[int(p['y_m'] // 12)][int(p['x_m'] // 12)] != 'blocked']
    return board, pieces, dict(road=road, house=houses), grid


def empty_lots(seed):
    r = K.R(seed)
    plan = R4.yards(seed)
    slabs = Image.new('L', (B.BP, B.BP), 0); sd = ImageDraw.Draw(slabs)
    lots = [(c, rw) for rw in (1, 3) for c in range(N) if r() < 0.8]
    for (c, rw) in lots:                                                # the poured foundations
        x0, y0 = c * 12 + 1.2 + r() * 0.6, rw * 12 + (2.4 if rw == 1 else 1.2)
        sd.rectangle([M(x0), M(y0), M(x0 + 9.6), M(y0 + 7.6)], fill=255)
    plan.paste(B.quiet_big(K.dress(['concrete_0', 'concrete_1'], B.BP, B.BP, seed + 1)), (0, 0), slabs)
    R4.drives(plan, [l for l in lots if l[1] == 1], 24.0, seed + 2)
    R4.drives(plan, [l for l in lots if l[1] == 3], 36.0, seed + 3)
    road = _street(plan, seed + 4)
    board = plan.resize((B.BP, PY * N), Image.NEAREST)
    B.faces(board, road.resize((B.BP, PY * N), Image.NEAREST), C[2], 0.15)
    d = ImageDraw.Draw(board)
    for rw_y in (B.ty(M(11.6)), B.ty(M(48.4))):                         # the chain-link run, sagging posts
        for x in range(0, B.BP, M(3.0)):
            d.rectangle([x, rw_y - 10, x + 3, rw_y + 2], fill=B.A[2])
        d.line([(0, rw_y - 8), (B.BP, rw_y - 6)], fill=B.A[3], width=2)
    grid = R4.terrain([])
    pieces = [dict(piece='rubble_%d' % r.i(len(R5.EXTRA)), x_m=round(4 + r() * 52, 1), y_m=round(2 + r() * 8, 1)) for _ in range(3)]
    pieces += [dict(piece='rubble_%d' % r.i(len(R5.EXTRA)), x_m=round(4 + r() * 52, 1), y_m=round(40 + r() * 16, 1)) for _ in range(3)]
    pieces.append(dict(piece='car_kerb', x_m=round(10 + r() * 30, 1), y_m=31.5))
    return board, pieces, dict(road=road), grid
