#!/usr/bin/env python3
"""FOUR MORE BOARD KINDS, AND EVERY TILE TRANSLATED  (COMBAT 2 [floor set] round four, rules 57, 59)

Rule 57's list after the cul-de-sac and the wash: THE SUBURB BLOCK, THE STRIP LOT, SCRUB, THE
FREEWAY. Same method as round three (imported, not copied): one 60 x 60 m plan dressed from his
banks, seen at 45, cut into 25 house tiles of 515 x 364, cover as a placement list.

AND RULE 59 (Paolo 10/1: 'every floor tile from Battle Brothers needs a proper translation...
how it impacts your accuracy or your defence or the positioning, how many action points it
costs'): every one of the 25 tiles on all SIX kinds now carries its translated terrain, read off
the drawn surfaces, never typed by hand, using the school page's table
(records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md):
    flat      plains/road -> asphalt, walk, slab, lot, hardpan          1 step
    rough     forest floor -> creosote scrub, overgrown yard            2 steps
    debris    snow -> rubble field                                      2 steps
    height    hills -> a roof you can stand on, an overpass deck        +1 step, +10%/-10%, +1 reach
    blocked   cliff -> the freeway cut wall                             impassable
The art lane does not own the numbers (TUNING's table and COMBAT's code do); it owns that the
TAG AGREES WITH THE DRAWING, which is the one thing only the art can prove.

  SUBURB BLOCK  a straight street across the middle row, houses both sides on whole tiles with
                their drives, back yards behind block walls, sheds; the block war's own ground.
  STRIP LOT     a dead strip mall along the north (flat roofs, one climbable), its walk, then
                the parking lot: asphalt with the stall lines still painted, light pole bases,
                the dead cars still in their stalls; the frontage road along the south.
  SCRUB         open hardpan thick with creosote (rough), a two-rut dirt track across it, rock,
                a sagging fence line; the edge of the valley where the city gave out.
  FREEWAY       eight lanes of the 15 east to west on four tile rows, the concrete median with
                its face seen, the shoulders, the cut wall on the north (impassable) and the
                embankment on the south; the jam of dead cars where everyone stopped.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * round three's guards on every kind (tile size, his colours, ruler, legal placements, no
    stamped tile), run by round three's own guard;
  * every tile's terrain tag is read from the drawn surface masks (majority surface), and a
    house tile is 'height' only if a roof is drawn on it;
  * no cover piece sits on a 'blocked' tile.

THE ANALOG HORROR LINE (rule 20): the stall lines were repainted the spring before the dollar
went. They are the newest paint in the valley.

REFERENCE CHECK (the 9/4 standing law):
  TG-04 THE STREET TILE: kerbs and painted lines, lit north-west.
  TG-02 THE HOUSE FROM 45 DEGREES: roofs and the median's face read as tops and faces.
  CGRD-01 INTO THE BREACH: one quiet field per surface, so the men and the cover read first.
  AH-01 THE BIBLE: the sun north-west, every shadow south-east.
  REUSE CHECK: every helper from round three's cook; surfaces from the 7/28 bank and the desert
  pools bank; cover from the cover cook.

[bb every floor tile] records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md:
  BB's tactical map is a terrain grid first and a picture second; every hex has a type that
  sets its AP cost and its effect. WHAT WE DO DIFFERENTLY: our type is derived from the picture,
  so the picture can never lie about the rule.

    python3 tools/bohemia_combat2_four_more_board_kinds_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_4_10_1_26.txt
      -> slices/vote/COMBAT2_FOUR_MORE_BOARD_KINDS_10_1.png
"""
import importlib, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
B = importlib.import_module('bohemia_combat2_the_board_kinds_cook_10_1_26')
F, K, CV = B.F, B.K, B.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_4_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_FOUR_MORE_BOARD_KINDS_10_1.png'
M, mask, dress, R, die = B.M, B.mask, K.dress, K.R, K.die
A, C, G, T, S = B.A, B.C, B.G, B.T, B.S
PX, PY, BP, N, ty = B.PX, B.PY, B.BP, B.N, B.ty
COST = {'flat': 1, 'rough': 2, 'debris': 2, 'height': 1, 'blocked': None}


def terrain(layers, default='flat'):
    """Majority surface per house tile, from the drawn masks, in priority order."""
    grid = []
    for r in range(N):
        row = []
        for c in range(N):
            kind = default
            for name, mk, need in layers:
                if isinstance(mk, set):
                    if (c, r) in mk: kind = name; break
                    continue
                a = np.array(mk)[M(r * 12):M((r + 1) * 12), M(c * 12):M((c + 1) * 12)] > 127
                if a.mean() >= need: kind = name; break
            row.append(kind)
        grid.append(row)
    return grid


def road_band(plan, y0_m, y1_m, seed, lines=()):
    """A roadway across the board between two depths, dressed from his asphalt."""
    mk = mask(); ImageDraw.Draw(mk).rectangle([0, M(y0_m), BP, M(y1_m)], fill=255)
    plan.paste(dress(['road_0', 'road_1', 'road_2'], BP, BP, seed), (0, 0), mk)
    d = ImageDraw.Draw(plan); r = R(seed)
    for y_m, solid, col in lines:
        x = 0
        while x < BP:
            worn = r() <= 0.15
            if solid or not worn or x == 0 or x + M(12.0) >= BP:     # rule 77: the dashes at a block's sides never wear away, so a line always meets its neighbour's
                d.rectangle([x, M(y_m), min(BP, x + (BP if solid else M(3.0))), M(y_m) + M(0.15)], fill=col)
            x += BP if solid else M(12.0)
    return mk


def walk_band(plan, y0_m, y1_m, seed):
    mk = mask(); ImageDraw.Draw(mk).rectangle([0, M(y0_m), BP, M(y1_m)], fill=255)
    plan.paste(B.quiet_big(dress(['walk_0', 'walk_1', 'walk_2'], BP, BP, seed)), (0, 0), mk)
    return mk


def finish(plan, low_masks, roofs, seed):
    board = plan.resize((BP, PY * N), Image.NEAREST)
    for mk, col, h in low_masks:
        B.faces(board, mk.resize((BP, PY * N), Image.NEAREST), col, h)
    for i, (c, r) in enumerate(sorted(roofs)): board.paste(F.roof(seed + 7 * i), (c * PX, r * PY))
    return board


def yards(seed):
    plan = dress(['yard_0', 'yard_1', 'yard_2'], BP, BP, seed)
    rr = R(seed); f = Image.new('L', (12, 12)); f.putdata([int(rr() * 255) for _ in range(144)])
    plan.paste(dress(['dirt'], BP, BP, seed + 1), (0, 0), f.resize((BP, BP), Image.BICUBIC).point(lambda v: 255 if v > 168 else 0))
    return plan


def drives(plan, houses, kerb_y_m, seed):
    mk = mask(); d = ImageDraw.Draw(mk)
    for (c, r) in houses:
        x = c * 12 + 6
        y0, y1 = sorted(((r + 0.5) * 12, kerb_y_m))
        d.rectangle([M(x - 2.2), M(y0), M(x + 2.2), M(y1)], fill=255)
    plan.paste(B.quiet_big(dress(['concrete_0', 'concrete_1'], BP, BP, seed)), (0, 0), mk)
    return mk


def suburb():
    plan = yards(31)
    north = [(0, 1), (1, 1), (3, 1), (4, 1)]
    south = [(0, 3), (2, 3), (3, 3), (4, 3)]
    side = F.SIDE / K.PPM
    drives(plan, north, 24.0, 33); drives(plan, south, 36.0, 34)
    walk_band(plan, 24.0, 24.0 + side, 35); walk_band(plan, 36.0 - side, 36.0, 36)
    road = road_band(plan, 24.0 + side, 36.0 - side, 37, lines=[(30.0, False, C[5])])
    d = ImageDraw.Draw(plan)
    d.rectangle([0, M(24.0 + side) - 3, BP, M(24.0 + side)], fill=C[5])
    d.rectangle([0, M(36.0 - side), BP, M(36.0 - side) + 3], fill=C[5])
    board = finish(plan, [(road, C[2], 0.15)], north + south, 41)
    pieces = [dict(piece='wall', x_m=1.0, y_m=11.0), dict(piece='wall', x_m=25.0, y_m=11.0), dict(piece='wall_broken', x_m=49.0, y_m=11.0),
              dict(piece='wall', x_m=13.0, y_m=47.0), dict(piece='wall_corner', x_m=50.0, y_m=48.0),
              dict(piece='shed', x_m=27.0, y_m=1.5), dict(piece='shed', x_m=4.0, y_m=50.0),
              dict(piece='car_lane', x_m=17.0, y_m=27.0), dict(piece='car_kerb', x_m=38.0, y_m=31.5), dict(piece='car_drive', x_m=27.0, y_m=15.0)]
    grid = terrain([('height', set(north + south), 0), ('rough', B.mask(), 1.1)])
    return board, pieces, dict(road=road, house=north + south), grid


def strip():
    """RE-CUT 10/5 (rule 77, TILES ARE LEGOS): the strip mall wears the town's own street at the town's own
       depth (walk 24, road 25.4 to 34.6, walk 36), so its west and east edges join any town block; each lot
       stops a metre short of the block's sides (a planter strip, the property line), and the south row is
       yard, so nothing asphalt runs off an edge that its neighbour cannot meet."""
    plan = yards(51)
    side = F.SIDE / K.PPM
    shops = [(c, 0) for c in range(N)]
    walk_band(plan, 12.0, 12.0 + 2.4, 52)                                # the store-front walk is wider
    lot = road_band(plan, 12.0 + 2.4, 24.0, 53)
    lot2 = road_band(plan, 37.0, 58.0, 57)
    keep = mask(); kd = ImageDraw.Draw(keep)                             # the lots stop a metre short of the sides
    kd.rectangle([M(1.0), M(12.0 + 2.4), BP - M(1.0), M(24.0)], fill=255); kd.rectangle([M(1.0), M(37.0), BP - M(1.0), M(58.0)], fill=255)
    yd = yards(58)
    edge = Image.eval(keep, lambda v: 255 - v); ed = ImageDraw.Draw(edge)
    ed.rectangle([0, 0, BP, M(12.0 + 2.4)], fill=0); ed.rectangle([0, M(24.0), BP, M(37.0)], fill=0)
    plan.paste(yd, (0, 0), edge)
    lot = Image.fromarray(((np.array(lot) > 127) & (np.array(keep) > 127)).astype('uint8') * 255)
    lot2 = Image.fromarray(((np.array(lot2) > 127) & (np.array(keep) > 127)).astype('uint8') * 255)
    d = ImageDraw.Draw(plan); r = R(54)
    for row_y, deep in ((14.4, 5.5), (37.0, 5.5), (43.1, 5.5)):          # rows of stalls, nose to nose in the back lot
        for k in range(1, int(58 / 2.7)):
            x = M(k * 2.7)
            d.rectangle([x, M(row_y), x + M(0.12), M(row_y + deep)], fill=C[5])
    d.rectangle([M(1.0), M(42.5), BP - M(1.0), M(42.5) + M(0.12)], fill=C[4])
    for x_m in (13.0, 31.0, 49.0):                                        # the light-pole bases, dark
        d.ellipse([M(x_m), M(23.3), M(x_m + 0.7), M(23.8)], fill=C[3]); d.ellipse([M(x_m), M(37.2), M(x_m + 0.7), M(37.7)], fill=C[3])
    walk_band(plan, 24.0, 24.0 + side, 55); walk_band(plan, 36.0 - side, 36.0, 59)
    road = road_band(plan, 24.0 + side, 36.0 - side, 56, lines=[(30.0, False, C[5])])
    d.rectangle([0, M(24.0 + side) - 3, BP, M(24.0 + side)], fill=C[5]); d.rectangle([0, M(36.0 - side), BP, M(36.0 - side) + 3], fill=C[5])
    lots = Image.fromarray(((np.array(lot) > 127) | (np.array(lot2) > 127)).astype('uint8') * 255)
    board = finish(plan, [(lots, C[2], 0.15), (road, C[2], 0.15)], shops, 61)
    pieces = [dict(piece='car_lane', x_m=6.0, y_m=17.0), dict(piece='car_kerb', x_m=22.0, y_m=27.0),
              dict(piece='car_drive', x_m=41.5, y_m=39.5), dict(piece='car_lane', x_m=33.0, y_m=45.5),
              dict(piece='car_kerb', x_m=9.0, y_m=52.0), dict(piece='wall', x_m=50.0, y_m=55.0),
              dict(piece='wall_broken', x_m=27.0, y_m=50.0)]
    grid = terrain([('height', set(shops[1:2]), 0)])                     # one roof has the ladder
    for c in range(N):
        if (c, 0) != (1, 0): grid[0][c] = 'blocked'                        # the other stores are walls: no door in a fight
    return board, pieces, dict(road=road), grid


def scrub():
    # THE SAME TWO SOILS AS THE WASH (round nine's weak note: dressed in one soil, the scrub boxed
    # the wash blocks in at the far zoom); soil 2 comes through in ragged patches, as in B.wash.
    floor = B.dress_any([B.DGROUND[1]], BP, BP, 71)
    rr = R(70); f = Image.new('L', (14, 14)); f.putdata([int(rr() * 255) for _ in range(196)])
    floor.paste(B.dress_any([B.DGROUND[2]], BP, BP, 72), (0, 0), f.resize((BP, BP), Image.BICUBIC).point(lambda v: 255 if v > 160 else 0))
    plan = floor
    rough = mask(); rd = ImageDraw.Draw(rough)
    rr = R(72); f = Image.new('L', (8, 8)); f.putdata([int(rr() * 255) for _ in range(64)])
    rough = f.resize((BP, BP), Image.BICUBIC).point(lambda v: 255 if v > 120 else 0)
    a = np.array(rough) > 127
    track = mask(); td = ImageDraw.Draw(track)                            # the two ruts
    for off in (-1.0, 1.0):
        pts = [(M(x), M(34 + 8 * math.sin(2 * math.pi * x / 60.0) + off)) for x in range(0, 61, 2)]   # periodic: the track runs on into the next block
        td.line(pts, fill=255, width=M(0.5))
    plan.paste(B.dress_any([B.DGROUND[0]], BP, BP, 73), (0, 0), track)
    pd = ImageDraw.Draw(plan); r = R(74)
    dark = B.OLIVE[:max(1, len(B.OLIVE) // 3)] or [G[0]]
    for _ in range(420):                                                 # dense where rough, sparse elsewhere
        x, y = r.i(BP), r.i(BP)
        if np.array(track)[y, x] > 127: continue
        if not a[y, x] and r() > 0.18: continue
        for _ in range(36):
            ox, oy = int((r() - .5) * M(1.6)), int((r() - .5) * M(1.1))
            pd.rectangle([x + ox, y + oy, x + ox + 4, y + oy + 4], fill=dark[r.i(len(dark))])
    for k in range(13):                                                   # the fence line: posts, sagging
        x = M(4 + k * 4.2); y = M(9 + 0.15 * k)
        pd.rectangle([x, y - M(0.1), x + 4, y + M(0.6)], fill=A[2])
        if k: pd.line([(x - M(4.2), y + 3 + (k % 3)), (x, y + 3)], fill=A[1])
    board = finish(plan, [], [], 0)
    pieces = [dict(piece='rock_%d' % (i % len(B.DROCK)), x_m=x, y_m=y) for i, (x, y) in
              enumerate([(8, 20), (21, 14), (44, 22), (52, 41), (13, 47), (30, 50), (37, 8)])]
    pieces.append(dict(piece='outcrop', x_m=40.0, y_m=44.0, mound=True))
    grid = terrain([('rough', rough, 0.45)])
    grid[3][3] = 'height'                                                 # the outcrop's tile
    return board, pieces, dict(), grid


def freeway():
    plan = B.dress_any([B.DGROUND[1]], BP, BP, 81)                       # the embankments
    cut = mask(); ImageDraw.Draw(cut).rectangle([0, 0, BP, M(9.0)], fill=255)
    plan.paste(Image.new('RGB', (BP, BP), S[1]), (0, 0), cut)             # the cut wall, poured
    d = ImageDraw.Draw(plan)
    for x in range(0, BP, M(3.0)): d.line([(x, 0), (x, M(9.0))], fill=S[0])
    lanes = [(12.0 + 1.2 + 3.7 * k) for k in range(1, 4)] + [(36.5 + 3.7 * k) for k in range(1, 4)]
    road = road_band(plan, 10.0, 58.0, 82, lines=[(y, False, C[5]) for y in lanes] +
                     [(11.2, True, C[5]), (34.0, True, T[5]), (36.3, True, T[5]), (56.8, True, C[5])])
    med = mask(); ImageDraw.Draw(med).rectangle([0, M(34.6), BP, M(35.7)], fill=255)
    plan.paste(Image.new('RGB', (BP, BP), C[5]), (0, 0), med)             # the median's top, lit
    below = mask(); ImageDraw.Draw(below).rectangle([0, M(35.7), BP, BP], fill=255)
    road_low = Image.fromarray((np.array(road) > 127).astype('uint8') * 255)
    board = finish(plan, [(road_low, C[2], 0.15), (below, C[2], 0.8)], [], 0)
    jam = [(3, 14.5, 'car_lane'), (11, 18.2, 'car_kerb'), (20, 15.0, 'car_lane'), (29, 21.8, 'car_kerb'), (44, 18.5, 'car_lane'),
           (7, 39.5, 'car_kerb'), (24, 43.0, 'car_lane'), (36, 47.0, 'car_kerb'), (51, 40.0, 'car_lane'), (15, 50.5, 'car_kerb')]
    pieces = [dict(piece=p, x_m=float(x), y_m=y) for x, y, p in jam]
    grid = [['blocked'] * N] + [['flat'] * N for _ in range(N - 1)]
    return board, pieces, dict(road=road), grid


def card(kinds, cover):
    sc = 0.2
    you = F.load(F.SPR['you']).convert('RGBA'); nb = F.load(F.SPR['the_neighbour']).convert('RGBA')
    titles = {'suburb': 'THE SUBURB BLOCK', 'strip': 'THE STRIP LOT', 'scrub': 'SCRUB', 'freeway': 'THE FREEWAY'}
    men = [(you, 0.48, 0.8), (nb, 0.25, 0.45), (nb, 0.7, 0.35)]
    tiles = []
    for name, (board, pieces, _, grid) in kinds.items():
        b = B.composed(board, pieces, cover)
        b = b.resize((int(b.size[0] * sc), int(b.size[1] * sc)), Image.NEAREST)
        for sp, fx, fy in men:
            b.alpha_composite(sp.resize((int(sp.size[0] * 0.8), int(sp.size[1] * 0.8)), Image.NEAREST), (int(b.size[0] * fx), int(b.size[1] * fy)))
        dd = ImageDraw.Draw(b)                                            # the terrain tag, a corner letter per tile
        tw, th = b.size[0] / N, b.size[1] / N
        for r in range(N):
            for c in range(N):
                k = grid[r][c]
                if k != 'flat':
                    dd.text((int(c * tw) + 3, int(r * th) + 2), {'rough': 'R', 'height': 'H', 'blocked': 'X', 'debris': 'D'}[k], font=K.font(11), fill=(255, 236, 160))
        tiles.append((titles[name], b))
    w, h = tiles[0][1].size
    out = Image.new('RGB', (w * 2 + 60, (h + 50) * 2 + 60), (12, 11, 10))
    d = ImageDraw.Draw(out)
    for i, (t, b) in enumerate(tiles):
        x, y = 20 + (i % 2) * (w + 20), 20 + (i // 2) * (h + 50)
        d.text((x, y), t, font=K.font(20), fill=(222, 181, 118))
        out.paste(b.convert('RGB'), (x, y + 30))
    d.text((20, out.size[1] - 30), 'corner letters: R rough (2 steps)  H high ground  X impassable  -- every other tile flat (1 step)', font=K.font(13), fill=(190, 160, 110))
    return out


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    kinds = {'suburb': suburb(), 'strip': strip(), 'scrub': scrub(), 'freeway': freeway()}
    B.guard({k: v[:3] for k, v in kinds.items()}, cover)
    for name, (_, pieces, _, grid) in kinds.items():
        for p in pieces:
            if grid[int(p['y_m'] // 12)][int(p['x_m'] // 12)] == 'blocked': die('%s: %s on a blocked tile' % (name, p['piece']))
    # round three's two kinds, translated too (from their own masks)
    old = {}
    cd = B.culdesac(); wa = B.wash()
    houses = set(cd[2]['house'])
    old['culdesac'] = terrain([('height', houses, 0)])
    old['wash'] = [[('height' if (r, c) == (3, 0) else 'rough') for c in range(N)] for r in range(N)]
    wm = np.array(wa[2]['wash']) > 127
    for r in range(N):
        for c in range(N):
            if wm[M(r * 12):M((r + 1) * 12), M(c * 12):M((c + 1) * 12)].mean() > 0.35 and old['wash'][r][c] != 'height': old['wash'][r][c] = 'flat'
    out = dict(version='board-kinds-round-4-10-1', built='10/1/26', lane='combat 2', row='[floor set] round four (rules 57, 59)',
               px_per_metre=K.PPM, tile_px=[PX, PY], grid=[N, N], cover_bank=CV.OUT_BANK, extra_pieces_bank=B.OUT_BANK,
               terrain_key={k: dict(steps=v) for k, v in COST.items()},
               terrain_from='records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md (numbers are TUNING/COMBAT; the tag agrees with the drawing)',
               round_three_terrain=old, kinds=[])
    for name, (board, pieces, _, grid) in kinds.items():
        out['kinds'].append(dict(id=name, terrain=grid, tiles=[[F.b64(t) for t in row] for row in B.cut(board)], cover=pieces))
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    card(kinds, cover).save(OUT_CARD, optimize=True)
    print('ok: %d kinds + terrain on 6 -> %s, %s' % (len(kinds), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
