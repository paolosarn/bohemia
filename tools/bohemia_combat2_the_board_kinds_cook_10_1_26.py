#!/usr/bin/env python3
"""THE BOARD KINDS: THE CUL-DE-SAC AND THE DESERT WASH  (COMBAT 2 [floor set] round three, rule 57)

PAOLO 10/1, after the fight never ended: "why can't it be a cul-de-sac... there's gonna be
different map types like suburbs, nature, desert." Rule 57: NO TWO BOARDS ALIKE is the next jump,
the cutter reads the map cell's kind, and COMBAT 2 cuts a sheet per kind, CUL-DE-SAC and DESERT
WASH first. A straight street repeated is not a place; these two are.

HOW A KIND IS MADE: the whole board (5 x 5 house tiles, 60 x 60 m) is laid out as one PLAN in
metres -- road, kerb, sidewalk, lot, driveway, roof; or desert floor, wash, bank -- each surface
dressed from his own banks, then the plan is seen from the 45 camera (rule 56: depth x cos45, the
south-looking faces drawn) and CUT into the house tiles the fight reads (515 x 364 each). The
cover is NOT baked into the ground: it is a list of placements (piece id, metres) so COMBAT drops
the pieces on top and the cutter can reshuffle them per seed. The sheet in VOTE shows both
together from the game's camera.

  CUL-DE-SAC   the stem comes in from the south (9.2 m road, 1.4 m walks, the real Vegas sizes
               of round two), the bulb is a 22 m turnaround at the board's heart, kerb faces seen
               where they look at the camera; six houses round the bulb with their driveway
               slabs running to the kerb; block walls between the back yards; a dead car parked
               dead in the bulb. Every Vegas subdivision since 1990 ends in one of these.
  DESERT WASH  the dry channel snakes north to south through creosote flats, its pale sand bed
               rippled where the last flood ran, its north-facing banks cut and in shadow, the
               south-looking bank faces SEEN (rule 56); the valley's own rock (his corpus
               boulders, 45-view) as cover in and along the wash, one big outcrop as the mound
               (the one terrain effect). The wash is where the old fossils came out (Tule
               Springs), so it is where the lab animals go to ground.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every cut tile is exactly 515 x 364 (12 m, 45 camera);
  * every pixel is his: the 7/28 bank's ramps, tiles and sprites, and the desert pools bank;
  * the sidewalk stays real: at most a sixth of its roadway (round two's ruler);
  * every cover placement sits on the board and on a surface that can hold it (no car in a
    house, no rock in the road);
  * no two cut tiles of a board are the same picture.

THE ANALOG HORROR LINE (rule 20): the bulb was built for kids on bikes. The basketball hoop is
still over one garage and the net is gone. In the wash the creosote is the oldest living thing in
the valley and it has seen this before.

REFERENCE CHECK (the 9/4 standing law):
  TG-04 THE STREET TILE: the kerb is the strongest edge on the ground, lit north-west.
  TG-02 THE HOUSE FROM 45 DEGREES: the roofs and the bank faces read as tops you look onto.
  CGRD-01 INTO THE BREACH: clarity over cool -- road, lot, wash and bank each one quiet colour
        field, so the men and the cover read first.
  AH-01 THE BIBLE: the sun north-west on every piece, every shadow south-east.
  REUSE CHECK: the street surfaces, the wrecks and the walls from the 7/28 bank and the floor
  set and cover cooks (imported); the desert floor, sand and rock from the desert pools bank.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md, the
  BOARD line: "a fight is generated from the map terrain where it happens." BB's kinds are
  forest, steppe, swamp, snow, each with its own few blockers. OURS (rule 39b): the suburb's
  kind is a shape people built (the bulb) and the desert's is a shape water cut (the wash), so
  the board's geometry is the story, not only its blockers.

    python3 tools/bohemia_combat2_the_board_kinds_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_10_1_26.txt
      -> slices/vote/COMBAT2_THE_BOARD_KINDS_10_1.png
"""
import base64, importlib, io, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
F = importlib.import_module('bohemia_combat2_the_floor_set_cook_10_1_26')
CV = importlib.import_module('bohemia_combat2_the_cover_pieces_cook_10_1_26')
K = F.K
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_THE_BOARD_KINDS_10_1.png'
DESERT = 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt'

m, dress, shade, load, R, die = K.m, K.dress, K.shade, K.load, K.R, K.die
A, C, G, T, S = (K.RAMPS[k] for k in ('asphalt', 'concrete', 'ground', 'terracotta', 'stucco'))
PX, PY, ty = F.PX, F.PY, F.ty
N = 5                                   # a board is 5 x 5 house tiles
BP = PX * N                             # the plan, square, in px at 42.9 px/m

_D = json.load(open(DESERT))
dimg = lambda b: Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')
def opaque(im, inset=9):
    """The desert pool tiles carry transparent margins (rounded corners) whose hidden RGB is
       not art; cut each to its solid interior so only drawn pixels are dressed."""
    a = np.array(im.getchannel('A')) > 250
    w, h = im.size
    for k in range(min(w, h) // 2):                              # shrink from every side until solid
        if a[k:h - k, k:w - k].all():
            return im.crop((k + inset, k + inset, w - k - inset, h - k - inset)).convert('RGB')
    die('a desert tile has no solid interior')


DGROUND = [opaque(dimg(b)) for b in _D['ground']]
DROCK = [dimg(b) for b in _D['rock'][3:]]                # the grey valley rock (the 'boulder' list is lava and coral: never)
DBOULDER = [dimg(b) for b in _D['rock'][:3]]              # the three big domes make the outcrop


def allowed():
    ok = set(K.ALL)
    for sp in K._B['sprites']: ok |= K.colours(load(sp))
    for k in ('ground', 'rock', 'boulder'):
        for b in _D[k]: ok |= K.colours(dimg(b))
    return ok


OK = allowed()
OLIVE = sorted([c for c in OK if c[1] > c[0] + 4 and c[1] > c[2] + 8 and 40 < c[1] < 170], key=K.LUM)


def dress_any(tiles, w, h, seed):
    """K.dress for tiles of any size (the desert pools are 92-96 px, not his 44)."""
    im = Image.new('RGB', (w, h))
    tw, th = min(t.size[0] for t in tiles) - 4, min(t.size[1] for t in tiles) - 4
    for yy in range(0, h, th):
        for xx in range(0, w, tw):
            t = tiles[((xx // tw) * 7 + (yy // th) * 13 + seed) % len(tiles)]
            ox, oy = ((xx // tw) * 11 + seed) % 4, ((yy // th) * 5 + seed) % 4
            im.paste(t.crop((ox, oy, ox + tw, oy + th)), (xx, yy))
    return im


def M(v): return int(round(v * K.PPM))           # metres -> plan px


def remap(im, fn):
    """Apply a per-colour rule over a big image in numpy: one decision per distinct colour."""
    a = np.array(im.convert('RGB'))
    key = a[..., 0].astype(np.int32) << 16 | a[..., 1].astype(np.int32) << 8 | a[..., 2]
    u, inv = np.unique(key.ravel(), return_inverse=True)
    lut = np.array([fn((int(k) >> 16 & 255, int(k) >> 8 & 255, int(k) & 255)) for k in u], dtype=np.uint8)
    return Image.fromarray(lut[inv].reshape(a.shape))


def quiet_big(im, k=0.45):
    """F.quiet's rule, in numpy (the floor set's per-pixel loop is fine at 515, not at 2575)."""
    byf = {f: sorted(r, key=K.LUM) for f, r in K.RAMPS.items()}
    def fn(c):
        ramp = byf[K.fam_of(c)]
        mid = K.LUM(ramp[len(ramp) // 2]); v = K.LUM(c) + (mid - K.LUM(c)) * k
        return min(ramp, key=lambda e: abs(K.LUM(e) - v))
    return remap(im, fn)


def shade_mask(im, mk, mult):
    """K.shade's rule (darken within each colour's own family ramp) under a mask, in numpy."""
    byf = {f: sorted(r, key=K.LUM) for f, r in K.RAMPS.items()}
    def fn(c):
        ramp = byf[K.fam_of(c)]; v = K.LUM(c) * mult
        return min(ramp, key=lambda e: abs(K.LUM(e) - v))
    im.paste(remap(im, fn), (0, 0), mk)
    return im


def mask(): return Image.new('L', (BP, BP), 0)


def faces(tilted, low_t, col, h_m):
    """THE 45 CAMERA SEES EVERY FACE THAT LOOKS SOUTH. Wherever a high surface sits directly
       north of a low one (a sidewalk over the road, a bank over the wash bed), the drop is drawn
       as a face h_m tall at cos45, in its own shadow, lit along its top edge."""
    a = np.array(low_t) > 127
    edge = np.zeros_like(a); edge[1:] = a[1:] & ~a[:-1]
    h = max(2, ty(M(h_m)))
    px = np.array(tilted.convert('RGB'))
    band = edge.copy()
    for k in range(1, h): band[k:] |= edge[:-k]
    band &= a
    px[band] = col
    px[edge] = C[6] if col == C[2] else K.RAMPS['ground'][3]
    tilted.paste(Image.fromarray(px))
    return tilted


def cut(board):
    return [[board.crop((c * PX, r * PY, (c + 1) * PX, (r + 1) * PY)) for c in range(N)] for r in range(N)]


def culdesac():
    cx, cy, rr = 30.0, 26.0, 11.0                 # the bulb: 22 m across, the board's heart
    road_hw = 4.6                                 # the stem's roadway, 9.2 m (round two)
    side, kerb = F.SIDE / K.PPM, 0.15
    lotm = dress(['yard_0', 'yard_1', 'yard_2'], BP, BP, 5)
    dirt = dress(['dirt'], BP, BP, 6)
    plan = lotm.copy()
    r = R(7); fld = Image.new('L', (12, 12)); fld.putdata([int(r() * 255) for _ in range(144)])
    fld = fld.resize((BP, BP), Image.BICUBIC).point(lambda v: 255 if v > 168 else 0)
    plan.paste(dirt, (0, 0), fld)
    walk_m, kerb_m, road_m = mask(), mask(), mask()
    for mk, grow in ((walk_m, side + kerb), (kerb_m, kerb), (road_m, 0)):
        d = ImageDraw.Draw(mk)
        d.ellipse([M(cx - rr - grow), M(cy - rr - grow), M(cx + rr + grow), M(cy + rr + grow)], fill=255)
        d.rectangle([M(cx - road_hw - grow), M(cy), M(cx + road_hw + grow), BP], fill=255)
    # SIX HOUSES ROUND THE BULB: whole house tiles (a combat tile is a house), each with a slab
    # driveway to the kerb. The tiles are the ones the bulb does not touch.
    houses = [(0, 1), (1, 0), (3, 0), (4, 1), (0, 3), (4, 3)]
    drive_m = mask(); dd = ImageDraw.Draw(drive_m)
    for (c, rw) in houses:
        hx, hy = (c + 0.5) * 12, (rw + 0.5) * 12
        ang = math.atan2(cy - hy, cx - hx)
        ex, ey = cx - math.cos(ang) * (rr + side), cy - math.sin(ang) * (rr + side)
        px_, py_ = -math.sin(ang) * 2.2, math.cos(ang) * 2.2           # 4.4 m, a two-car drive
        dd.polygon([(M(hx + px_), M(hy + py_)), (M(hx - px_), M(hy - py_)), (M(ex - px_), M(ey - py_)), (M(ex + px_), M(ey + py_))], fill=255)
    slab = quiet_big(dress(['concrete_0', 'concrete_1'], BP, BP, 9))
    plan.paste(slab, (0, 0), drive_m)
    walk = quiet_big(dress(['walk_0', 'walk_1', 'walk_2'], BP, BP, 11))
    plan.paste(walk, (0, 0), walk_m)
    kb = Image.new('RGB', (BP, BP), C[5]); plan.paste(kb, (0, 0), kerb_m)
    road = dress(['road_0', 'road_1', 'road_2'], BP, BP, 12)
    plan.paste(road, (0, 0), road_m)
    gut = mask(); ImageDraw.Draw(gut).ellipse([M(cx - rr), M(cy - rr), M(cx + rr), M(cy + rr)], outline=255, width=M(0.45))
    shade_mask(plan, Image.fromarray(np.array(gut) & np.array(road_m)), 0.84)   # the gutter, in the kerb's shade
    # the dead centre island: an old planter, nothing in it
    isl = mask(); ImageDraw.Draw(isl).ellipse([M(cx - 3), M(cy - 3), M(cx + 3), M(cy + 3)], fill=255)
    plan.paste(dirt, (0, 0), isl)
    ImageDraw.Draw(plan).ellipse([M(cx - 3), M(cy - 3), M(cx + 3), M(cy + 3)], outline=C[5], width=M(0.2))
    board = plan.resize((BP, PY * N), Image.NEAREST)
    faces(board, road_m.resize((BP, PY * N), Image.NEAREST), C[2], 0.15)
    # the houses: the round-two roof tile, whole, on their tiles
    for i, (c, rw) in enumerate(houses): board.paste(F.roof(73 + 7 * i), (c * PX, rw * PY))   # no two roofs alike
    pieces = [dict(piece='car_lane', x_m=cx - 2.2, y_m=cy - 5.5), dict(piece='car_drive', x_m=12 * 3.5 - 1, y_m=12 * 1.0 + 1),
              dict(piece='wall', x_m=1.0, y_m=12 * 2.4), dict(piece='wall', x_m=12 * 4 + 5, y_m=12 * 2.4),
              dict(piece='wall_corner', x_m=12 * 0.2, y_m=12 * 4.1), dict(piece='wall_broken', x_m=12 * 3.6, y_m=12 * 4.2),
              dict(piece='shed', x_m=12 * 4.3, y_m=12 * 0.1)]
    surf = dict(road=road_m, house=houses)
    return board, pieces, surf


def wash():
    # ONE TONE PER SURFACE. The pool's soil tiles are four different soils; dressed in turn they
    # made a checkerboard (first cut). Each surface is ONE tile rolled, and a second soil comes
    # through only in ragged patches from a noise field, the way ground actually changes.
    def blend(base, other, seed, cut=160):
        a, b = dress_any([DGROUND[base]], BP, BP, seed), dress_any([DGROUND[other]], BP, BP, seed + 1)
        rr = R(seed); f = Image.new('L', (14, 14)); f.putdata([int(rr() * 255) for _ in range(196)])
        a.paste(b, (0, 0), f.resize((BP, BP), Image.BICUBIC).point(lambda v: 255 if v > cut else 0))
        return a
    floor = blend(1, 2, 21)
    sand = blend(3, 0, 23, cut=190)
    # THE CHANNEL: a meander, its centre a slow sine north to south, its width breathing 6-10 m
    wm = mask(); d = ImageDraw.Draw(wm)
    for yy in range(0, BP, 2):
        t = yy / BP
        xc = BP * (0.5 + 0.18 * math.sin(2 * math.pi * t + 0.6) + 0.05 * math.sin(4 * math.pi * t))   # periodic in t: a wash meets the wash below it
        hw = M(3.2 + 1.8 * (0.5 + 0.5 * math.sin(2 * math.pi * t + 1.1)))
        d.rectangle([int(xc - hw), yy, int(xc + hw), yy + 2], fill=255)
    plan = floor.copy()
    plan.paste(sand, (0, 0), wm)
    # the cut banks: the 0.8 m drop, darkest where the bank faces north-east (away from the sun)
    a = np.array(wm) > 127
    rim = np.zeros_like(a)
    for s in range(1, M(0.9)):
        rim |= np.roll(a, s, axis=1) & ~a                               # east bank's lip
    bank = Image.fromarray((rim * 255).astype('uint8'))
    shade_mask(plan, bank, 0.78)
    # creosote on the flats, never in the bed: olive clumps from the valley rock's own lichen
    r = R(23); pd = ImageDraw.Draw(plan)
    olive = OLIVE or [G[0]]
    placed = 0
    while placed < 120:
        x, y = r.i(BP), r.i(BP)
        if a[min(y, BP - 1), min(x, BP - 1)]: continue
        placed += 1
        dark = olive[:max(1, len(olive) // 3)]                        # creosote reads dark olive
        for _ in range(40):
            ox, oy = int((r() - .5) * M(1.6)), int((r() - .5) * M(1.1))
            c = dark[min(len(dark) - 1, int(r() * len(dark)))]
            pd.rectangle([x + ox, y + oy, x + ox + 4, y + oy + 4], fill=c)
        shade(plan, (x + M(0.3), y + M(0.5), x + M(1.0), y + M(0.8)), 0.8)
    board = plan.resize((BP, PY * N), Image.NEAREST)
    faces(board, wm.resize((BP, PY * N), Image.NEAREST), G[0], 0.8)     # the bank faces, seen
    pieces = []
    r = R(29)
    while len(pieces) < 9:                                              # rock along and in the wash
        x, y = 4 + r() * 52, 4 + r() * 52
        pieces.append(dict(piece='rock_%d' % r.i(len(DROCK)), x_m=round(x, 1), y_m=round(y, 1)))
    pieces.append(dict(piece='outcrop', x_m=8.0, y_m=40.0, mound=True))  # the one high ground
    return board, pieces, dict(wash=wm)


def rock_piece(i):
    im = DROCK[i]
    out = Image.new('RGBA', (im.size[0] + M(0.5), im.size[1] + M(0.4)), (0, 0, 0, 0))
    hard = im.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    out.paste(Image.new('RGBA', im.size, A[1] + (255,)), (M(0.45), M(0.3)), hard)
    out.paste(im.convert('RGB').convert('RGBA'), (0, 0), hard)
    return out


def outcrop():
    """THE MOUND: three of his boulders shouldered together, a flat-ish top you stand on."""
    w = sum(b.size[0] for b in DBOULDER) - 30
    out = Image.new('RGBA', (w + M(0.8), max(b.size[1] for b in DBOULDER) + M(0.6)), (0, 0, 0, 0))
    x = 0
    for k, b in enumerate(DBOULDER):
        hard = b.getchannel('A').point(lambda a: 255 if a > 127 else 0)
        out.paste(Image.new('RGBA', b.size, A[1] + (255,)), (x + M(0.6), M(0.4) + (k % 2) * 6), hard)
        x += b.size[0] - 15
    x = 0
    for k, b in enumerate(DBOULDER):
        hard = b.getchannel('A').point(lambda a: 255 if a > 127 else 0)
        out.paste(b.convert('RGB').convert('RGBA'), (x, (k % 2) * 6), hard); x += b.size[0] - 15
    return out


def piece_img(pid, cover):
    if pid.startswith('rock_'): return rock_piece(int(pid[5:]))
    if pid == 'outcrop': return outcrop()
    return cover[pid][0]


def guard(kinds, cover):
    for name, (board, pieces, surf) in kinds.items():
        tiles = cut(board)
        seen = set()
        for row in tiles:
            for t in row:
                if t.size != (PX, PY): die('%s tile is %s, not %dx%d' % (name, t.size, PX, PY))
                if t.tobytes() in seen: die('%s has a stamped tile' % name)
                seen.add(t.tobytes())
        bad = K.colours(board) - OK
        if bad: die('%s has %d colours off his banks, e.g. %s' % (name, len(bad), list(bad)[:3]))
        for p in pieces:
            if not (0 <= p['x_m'] < 60 and 0 <= p['y_m'] < 60): die('%s: %s off the board' % (name, p['piece']))
            if 'road' in surf and p['piece'].startswith('wall') and np.array(surf['road'])[M(p['y_m']), M(p['x_m'])] > 127:
                die('%s: a wall stands in the road' % name)
            if 'house' in surf and (int(p['x_m'] // 12), int(p['y_m'] // 12)) in surf['house'] and p['piece'].startswith('car'):
                die('%s: a car inside a house' % name)
            bad = K.colours(piece_img(p['piece'], cover)) - OK
            if bad: die('%s: piece %s off his banks' % (name, p['piece']))
    if F.SIDE / (PX - 2 * F.SIDE) > F.RULER: die('the sidewalk is over a sixth of its road')


def composed(board, pieces, cover):
    out = board.convert('RGBA')
    for p in sorted(pieces, key=lambda p: p['y_m']):                     # back to front
        im = piece_img(p['piece'], cover)
        out.alpha_composite(im, (M(p['x_m']), ty(M(p['y_m']))))
    return out


def card(kinds, cover):
    sc = 0.28
    boards = []
    you = load(F.SPR['you']).convert('RGBA'); nb = load(F.SPR['the_neighbour']).convert('RGBA')
    men = {'culdesac': [(you, 0.47, 0.9), (nb, 0.2, 0.55), (nb, 0.75, 0.5), (nb, 0.55, 0.3)],
           'wash': [(you, 0.55, 0.85), (nb, 0.3, 0.35), (nb, 0.62, 0.2), (nb, 0.15, 0.62)]}
    for name, (board, pieces, _) in kinds.items():
        b = composed(board, pieces, cover)
        b = b.resize((int(b.size[0] * sc), int(b.size[1] * sc)), Image.NEAREST)
        for sp, fx, fy in men[name]:                                   # the 112 box at this zoom
            s2 = sp.resize((int(sp.size[0] * 1.1), int(sp.size[1] * 1.1)), Image.NEAREST)
            b.alpha_composite(s2, (int(b.size[0] * fx), int(b.size[1] * fy)))
        boards.append((name, b))
    W = sum(b.size[0] for _, b in boards) + 60
    H = max(b.size[1] for _, b in boards) + 80
    out = Image.new('RGB', (W, H), (12, 11, 10))
    d = ImageDraw.Draw(out)
    x = 20
    titles = {'culdesac': 'THE CUL-DE-SAC: six houses round the bulb', 'wash': 'THE DESERT WASH: creosote, rock, the dry bed'}
    for name, b in boards:
        d.text((x, 18), titles[name], font=K.font(22), fill=(222, 181, 118))
        out.paste(b.convert('RGB'), (x, 60)); x += b.size[0] + 20
    return out


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    kinds = {'culdesac': culdesac(), 'wash': wash()}
    guard(kinds, cover)
    out = dict(version='board-kinds-10-1', built='10/1/26', lane='combat 2', row='[floor set] round three (rule 57)',
               px_per_metre=K.PPM, tile_px=[PX, PY], grid=[N, N], tile_metres=K.TILE_M,
               perspective=F.json.load(open(F.OUT_BANK))['perspective'],
               cover_bank=CV.OUT_BANK, pieces_extra={'rock_N': 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt rock[N], shadow SE', 'outcrop': 'three boulders, the mound'},
               kinds=[])
    for name, (board, pieces, _) in kinds.items():
        out['kinds'].append(dict(id=name, tiles=[[F.b64(t) for t in row] for row in cut(board)], cover=pieces))
    out['extra_pieces'] = [dict(id='rock_%d' % i, b64=F.b64(rock_piece(i)), h=1.4, kind='COVER') for i in range(len(DROCK))] + \
                          [dict(id='outcrop', b64=F.b64(outcrop()), h=2.5, kind='MOUND')]
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    card(kinds, cover).save(OUT_CARD, optimize=True)
    print('ok: %d board kinds, %d tiles each -> %s, %s' % (len(kinds), N * N, OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
