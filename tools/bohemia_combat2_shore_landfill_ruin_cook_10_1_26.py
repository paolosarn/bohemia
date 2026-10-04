#!/usr/bin/env python3
"""THE SHORE, THE LANDFILL, THE RUIN  (COMBAT 2 [floor set] round five, rules 57 and 59)

The rest of rule 57's terrain list after round four, the three kinds the beasts and the scrappers
live in: the receded lake, the dump, and the burnt block (the ruin is a CONDITION, act one IS the
ruin, so it is the suburb block after the fire, not a new kind of ground). Same method as rounds
three and four, imported: a 60 x 60 m plan from the banks, seen at 45, cut into 25 house tiles of
515 x 364, cover as placements, every tile's terrain read off the drawing.

  THE SHORE     Lake Mead after the water left. Deep water on the north rows (impassable), a
                shallow band you can wade (WATER: 3 steps and a defence malus, the school page's
                swamp line), the cracked mud flat, and the bathtub ring: the cut bank's face
                bleached white where the lake used to stand, seen from the 45 camera. Rock and
                wreck as cover; the wading band is where the lab things come to drink.
  THE LANDFILL  graded dirt under a haul road, heaps of the city's last trash as the high
                ground (the one place the mound is garbage), rubble piles as cover, dead cars
                crushed flat, tyres everywhere.
  THE RUIN      the suburb block after the fire: half the roofs burnt through to the joists
                (blocked: a burnt house is not a roof to stand on), the yards a debris field
                (DEBRIS: the school's snow line, 2 steps), the street scorched, the cars burnt.

New terrain tags this round: 'water' (wade, 3 steps, defence malus) beside round four's flat,
rough, debris, height, blocked. The art lane owns that the tag agrees with the drawing; the
numbers are TUNING's and COMBAT's.

WHAT IS PROVED, NOT CLAIMED: round three's guard on every kind (size, colours, ruler, legal
placements, no stamped tile), plus no cover in water, and a 'height' tile only where a heap or a
standing roof is drawn.

THE ANALOG HORROR LINE (rule 20): the ring on the rock is the high-water mark of a lake that held
a city's water for ninety years. It is above your head.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: the burnt roofs read as roofs that failed, joists over black.
  CGRD-01 INTO THE BREACH: water, mud and bank each one field, so the men read first.
  AH-01 THE BIBLE: the sun north-west, every shadow south-east.
  REUSE CHECK: water from banks/BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt, rubble and soil from the
  desert pools bank, streets and roofs from the floor set, every helper from rounds three/four.

[bb every floor tile] records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md:
  BB's swamp is the one tile that punishes standing in it, not just walking it. OURS: the
  wading band of a lake that should not be this low.

    python3 tools/bohemia_combat2_shore_landfill_ruin_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_5_10_1_26.txt
      -> slices/vote/COMBAT2_SHORE_LANDFILL_RUIN_10_1.png
"""
import base64, importlib, io, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
R4 = importlib.import_module('bohemia_combat2_four_more_board_kinds_cook_10_1_26')
B, F, K, CV = R4.B, R4.F, R4.K, R4.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_5_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_SHORE_LANDFILL_RUIN_10_1.png'
WATER = 'banks/BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt'
M, mask, dress, R, die = B.M, B.mask, K.dress, K.R, K.die
A, C, G, T, S = B.A, B.C, B.G, B.T, B.S
PX, PY, BP, N, ty = B.PX, B.PY, B.BP, B.N, B.ty

_W = json.load(open(WATER))
wimg = lambda t: Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
WT = [wimg(t) for t in _W['tiles']]
DEEP = [WT[i] for i in (15, 16, 17, 18)]                   # the dark teal swell
SHALLOW = [WT[26], WT[27]]                                 # the pale wading teal
RUBBLE = [B.dimg(b) for b in B._D['rubble']]
for t in WT: B.OK |= K.colours(t)               # his water bank is his art
for r in RUBBLE: B.OK |= K.colours(r)


def sprite_piece(im):
    out = Image.new('RGBA', (im.size[0] + M(0.5), im.size[1] + M(0.4)), (0, 0, 0, 0))
    hard = im.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    out.paste(Image.new('RGBA', im.size, A[1] + (255,)), (M(0.45), M(0.3)), hard)
    out.paste(im.convert('RGB').convert('RGBA'), (0, 0), hard)
    return out


EXTRA = {('rubble_%d' % i): sprite_piece(r) for i, r in enumerate(RUBBLE)}
_piece_img = B.piece_img
B.piece_img = lambda pid, cover: EXTRA[pid] if pid in EXTRA else _piece_img(pid, cover)


WATER_COLS = sorted({c for t in WT for c in K.colours(t)}, key=K.LUM)


def _snap_dark(im, k=0.6):
    """Analog horror: deep water reads as a hole. Each water colour is replaced by the water
       bank's own colour nearest its darkened self (numpy, all colours at once), so every pixel
       stays his."""
    a = np.array(im.convert('RGB')).astype(np.int32)
    pal = np.array(WATER_COLS, dtype=np.int32)
    flat = a.reshape(-1, 3)
    u, inv = np.unique(flat, axis=0, return_inverse=True)
    t = (u * k).astype(np.int32)
    best = np.abs(t[:, None, :] - pal[None, :, :]).sum(-1).argmin(1)
    return Image.fromarray(pal[best][inv.ravel()].reshape(a.shape).astype('uint8'))


TAU = 2 * math.pi / 60.0      # ROUND SIXTEEN (rule 67, the lines run through): every curve repeats every block width,
                              # so the waterline, the ring and the haul road meet the next block at the same height


def noise(seed, n, cut, blur=Image.BICUBIC):
    r = R(seed); f = Image.new('L', (n, n)); f.putdata([int(r() * 255) for _ in range(n * n)])
    return f.resize((BP, BP), blur).point(lambda v: 255 if v > cut else 0)


def shore():
    mud = B.dress_any([B.DGROUND[6]], BP, BP, 91)                      # the cracked flat
    plan = mud.copy()
    plan.paste(B.dress_any([B.DGROUND[2]], BP, BP, 92), (0, 0), noise(93, 10, 170))
    deep, wade = mask(), mask()
    dd, wd = ImageDraw.Draw(deep), ImageDraw.Draw(wade)
    pts_d, pts_w = [(0, 0)], [(0, 0)]
    for x in range(0, 61, 2):                                          # a shoreline that wanders
        yd = 17 + 3.5 * math.sin(TAU * x) + 1.2 * math.sin(TAU * 4 * x)   # periodic over 60 m: blocks meet
        pts_d.append((M(x), M(yd))); pts_w.append((M(x), M(yd + 4.5 + 1.5 * math.sin(TAU * 2 * x))))
    pts_d.append((BP, 0)); pts_w.append((BP, 0))
    wd.polygon(pts_w, fill=255); dd.polygon(pts_d, fill=255)
    plan.paste(B.dress_any(SHALLOW, BP, BP, 94), (0, 0), wade)
    plan.paste(B.dress_any(DEEP, BP, BP, 95), (0, 0), deep)
    plan.paste(_snap_dark(B.dress_any(DEEP, BP, M(24.0), 95)), (0, 0), deep.crop((0, 0, BP, M(24.0))))
    # THE BATHTUB RING: the cut bank above the old waterline, a band of bleached rock on dry land,
    # 3 m back from the wading edge; its face is seen (it looks south, at the camera).
    ring = mask(); rd = ImageDraw.Draw(ring)
    rd.line([(M(x), M(30 + 2.0 * math.sin(TAU * 2 * x))) for x in range(0, 61, 2)], fill=255, width=M(1.6))
    plan.paste(Image.new('RGB', (BP, BP), S[4]), (0, 0), ring)
    below = mask(); bd = ImageDraw.Draw(below)
    bd.polygon([(0, BP)] + [(M(x), M(30 + 2.0 * math.sin(TAU * 2 * x)) + M(0.8)) for x in range(0, 61, 2)] + [(BP, BP)], fill=255)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    B.faces(board, below.resize((BP, PY * N), Image.NEAREST), S[1], 1.6)
    pieces = [dict(piece='rock_%d' % i, x_m=x, y_m=y) for i, (x, y) in enumerate([(6, 35), (18, 41), (33, 37), (47, 44), (55, 33), (25, 52)])]
    pieces += [dict(piece='car_kerb', x_m=40.0, y_m=27.0), dict(piece='rubble_3', x_m=10.0, y_m=48.0)]
    pieces.append(dict(piece='outcrop', x_m=48.0, y_m=50.0, mound=True))
    grid = R4.terrain([('blocked', deep, 0.5), ('water', wade, 0.35)])
    grid[4][4] = 'height'
    return board, pieces, dict(water=wade), grid


def landfill():
    plan = B.dress_any([B.DGROUND[0]], BP, BP, 101)
    plan.paste(B.dress_any([B.DGROUND[1]], BP, BP, 102), (0, 0), noise(103, 9, 150))
    haul = mask(); ImageDraw.Draw(haul).line([(M(x), M(42 + 6 * math.sin(TAU * x))) for x in range(0, 61, 2)], fill=255, width=M(6.0))
    plan.paste(B.dress_any([B.DGROUND[2]], BP, BP, 104), (0, 0), haul)
    heaps = noise(105, 6, 175)                                         # the trash heaps: the high ground
    hp = np.array(heaps) > 127; hp &= ~(np.array(haul) > 127)
    heaps = Image.fromarray(hp.astype('uint8') * 255)
    trash = B.dress_any([B.DGROUND[5], B.DGROUND[4]], BP, BP, 106)
    plan.paste(trash, (0, 0), heaps)
    pd = ImageDraw.Draw(plan); r = R(107)
    for _ in range(260):                                               # tyres, everywhere
        x, y = r.i(BP), r.i(BP)
        if np.array(haul)[y, x] > 127: continue
        rr = M(0.35)
        pd.ellipse([x, y, x + rr * 2, y + int(rr * 1.4)], outline=A[0], width=4)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    hp_t = Image.fromarray((~hp).astype('uint8') * 255)                # the heaps' faces look south
    B.faces(board, hp_t.resize((BP, PY * N), Image.NEAREST), G[0], 1.2)
    pieces = [dict(piece='rubble_%d' % i, x_m=x, y_m=y) for i, (x, y) in enumerate([(5, 10), (20, 6), (37, 13), (52, 9), (12, 26), (44, 28), (28, 54), (50, 55)])]
    pieces += [dict(piece='car_lane', x_m=17.0, y_m=40.0), dict(piece='car_kerb', x_m=40.0, y_m=46.0)]
    grid = R4.terrain([('height', heaps, 0.35), ('rough', Image.fromarray(((np.array(haul) < 128)).astype('uint8') * 255), 0.98)])
    return board, pieces, dict(), grid


def burnt_roof(seed):
    """A ROOF THAT FAILED: the round-two roof scorched, then burnt through to the joists."""
    im = F.roof(seed)
    B.shade_mask(im, Image.new('L', im.size, 255), 0.55)
    d = ImageDraw.Draw(im); r = R(seed)
    x0, y0 = M(2 + r() * 3), ty(M(2 + r() * 2)); x1, y1 = x0 + M(6 + r() * 2), y0 + ty(M(5 + r() * 2))
    d.polygon([(x0, y0 + 10), (x0 + 30, y0), (x1, y0 + 6), (x1 - 12, y1), (x0 + 8, y1 - 4)], fill=A[0])
    for x in range(x0, x1, M(0.6)): d.line([(x, y0 + 4), (x, y1 - 4)], fill=A[2], width=3)
    return im


def ruin():
    plan = R4.yards(111)
    north = [(0, 1), (1, 1), (3, 1), (4, 1)]; south = [(0, 3), (2, 3), (3, 3), (4, 3)]
    burnt = {(1, 1), (3, 1), (2, 3), (4, 3)}
    side = F.SIDE / K.PPM
    R4.drives(plan, north, 24.0, 112); R4.drives(plan, south, 36.0, 113)
    R4.walk_band(plan, 24.0, 24.0 + side, 114); R4.walk_band(plan, 36.0 - side, 36.0, 115)
    road = R4.road_band(plan, 24.0 + side, 36.0 - side, 116, lines=[(30.0, False, C[5])])
    deb = noise(117, 12, 140)                                         # the debris field over the yards
    yard = np.array(deb) > 127
    yard[M(24.0):M(36.0), :] = False
    deb = Image.fromarray(yard.astype('uint8') * 255)
    plan.paste(B.dress_any([B.DGROUND[4]], BP, BP, 118), (0, 0), deb)
    scorch = noise(119, 10, 150)
    B.shade_mask(plan, scorch, 0.6)                                  # soot over everything
    board = plan.resize((BP, PY * N), Image.NEAREST)
    B.faces(board, road.resize((BP, PY * N), Image.NEAREST), C[2], 0.15)
    for i, (c, r) in enumerate(north + south):
        board.paste(burnt_roof(121 + 7 * i) if (c, r) in burnt else F.roof(121 + 7 * i), (c * PX, r * PY))
    pieces = [dict(piece='rubble_%d' % i, x_m=x, y_m=y) for i, (x, y) in enumerate([(26, 4), (27, 15), (14, 47), (6, 53), (52, 52), (19, 43)])]
    pieces += [dict(piece='car_lane', x_m=12.0, y_m=27.0), dict(piece='car_kerb', x_m=44.0, y_m=31.5),
               dict(piece='wall_broken', x_m=2.0, y_m=10.5), dict(piece='wall_corner', x_m=49.0, y_m=48.0)]
    grid = R4.terrain([('blocked', burnt, 0), ('height', set(north + south) - burnt, 0), ('debris', deb, 0.30)])
    return board, pieces, dict(road=road, house=north + south), grid


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    kinds = {'shore': shore(), 'landfill': landfill(), 'ruin': ruin()}
    B.guard({k: v[:3] for k, v in kinds.items()}, cover)
    for name, (_, pieces, surf, grid) in kinds.items():
        for p in pieces:
            g = grid[int(p['y_m'] // 12)][int(p['x_m'] // 12)]
            if g == 'blocked': die('%s: %s on a blocked tile' % (name, p['piece']))
            if 'water' in surf and np.array(surf['water'])[M(p['y_m']), M(p['x_m'])] > 127: die('%s: %s in the water' % (name, p['piece']))
    titles = {'shore': 'THE SHORE', 'landfill': 'THE LANDFILL', 'ruin': 'THE RUIN'}
    img = _card(kinds, cover, titles)
    img.save(OUT_CARD, optimize=True)
    out = dict(version='board-kinds-round-5-10-1', built='10/1/26', lane='combat 2', row='[floor set] round five (rules 57, 59)',
               px_per_metre=K.PPM, tile_px=[PX, PY], grid=[N, N], cover_bank=CV.OUT_BANK, extra_pieces_bank=B.OUT_BANK,
               terrain_key=dict({k: dict(steps=v) for k, v in R4.COST.items()}, water=dict(steps=3, defence='malus while standing in it')),
               pieces_extra={k: F.b64(v) for k, v in EXTRA.items()}, kinds=[])
    for name, (board, pieces, _, grid) in kinds.items():
        out['kinds'].append(dict(id=name, terrain=grid, tiles=[[F.b64(t) for t in row] for row in B.cut(board)], cover=pieces))
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    print('ok: %d kinds -> %s, %s' % (len(kinds), OUT_BANK, OUT_CARD))


def _card(kinds, cover, titles):
    sc = 0.2
    you = F.load(F.SPR['you']).convert('RGBA'); nb = F.load(F.SPR['the_neighbour']).convert('RGBA')
    men = [(you, 0.48, 0.82), (nb, 0.25, 0.6), (nb, 0.7, 0.62)]
    tiles = []
    for name, (board, pieces, _, grid) in kinds.items():
        b = B.composed(board, pieces, cover)
        b = b.resize((int(b.size[0] * sc), int(b.size[1] * sc)), Image.NEAREST)
        for sp, fx, fy in men:
            b.alpha_composite(sp.resize((int(sp.size[0] * 0.8), int(sp.size[1] * 0.8)), Image.NEAREST), (int(b.size[0] * fx), int(b.size[1] * fy)))
        dd = ImageDraw.Draw(b); tw, th = b.size[0] / N, b.size[1] / N
        for r in range(N):
            for c in range(N):
                k = grid[r][c]
                if k != 'flat':
                    dd.text((int(c * tw) + 3, int(r * th) + 2), {'rough': 'R', 'height': 'H', 'blocked': 'X', 'debris': 'D', 'water': 'W'}[k], font=K.font(11), fill=(255, 236, 160))
        tiles.append((titles[name], b))
    w, h = tiles[0][1].size
    out = Image.new('RGB', (w * 2 + 60, (h + 50) * 2 + 60), (12, 11, 10))
    d = ImageDraw.Draw(out)
    for i, (t, b) in enumerate(tiles):
        x, y = 20 + (i % 2) * (w + 20), 20 + (i // 2) * (h + 50)
        d.text((x, y), t, font=K.font(20), fill=(222, 181, 118)); out.paste(b.convert('RGB'), (x, y + 30))
    d.text((w + 40, 20 + h + 80), 'corner letters:', font=K.font(16), fill=(222, 181, 118))
    for k, line in enumerate(['W wade (3 steps, defence down)', 'D debris (2 steps)', 'R rough (2 steps)', 'H high ground', 'X impassable', 'no letter: flat (1 step)']):
        d.text((w + 40, 20 + h + 110 + k * 24), line, font=K.font(15), fill=(190, 160, 110))
    return out


if __name__ == '__main__':
    main()
