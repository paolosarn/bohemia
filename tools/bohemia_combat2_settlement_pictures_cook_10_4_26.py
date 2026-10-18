#!/usr/bin/env python3
"""THE SETTLEMENT PICTURES: CAMP, TOWN, FORTRESS  (COMBAT 2, round seventeen, rule 71a)

PAOLO 10/4: 'I want the buildings to look natural, like they're part of the settlement; right now they
just look like options and it looks like dog shit.' Rule 71a: the settlement screen is ONE painted place,
cut from this lane's boards and kits, the usable buildings IN the picture -- the barber is a house with a
pole, the clinic a storefront with a cross, the stall a stall on the sidewalk, the posts a wall with paper,
the board a board on a pole -- lit under the finger, named only when touched. RUN TWO builds the screen;
this lane paints the place, one block per size tier, as sheets.

  CAMP       a squat on graded dirt by a dead road: tarps strung over poles, a burning drum, a trailer;
             the barber is a chair under a tarp with a pole lashed to it, the clinic a tent with the cross
             painted on the canvas, the stall a plank table with crates, the posts a run of chain-link with
             paper wired to it, the board a pallet nailed to a pole.
  TOWN       a street of his houses and store fronts at 45: the barber a house with the striped pole by
             its door, the clinic a store front with the cross in its sign band, the stall on the
             sidewalk under a striped awning, the posts a block wall papered with notices, the board on a
             pole at the kerb.
  FORTRESS   a walled compound: block walls round it with a gate and a watch post of stacked
             containers; inside, the apartments, the clinic and barber store fronts, a row of stalls,
             the posted wall by the gate, the board in the yard.

EVERY PICTURE SHIPS WITH ITS HOTSPOTS: slices/settlement_ground/settlement_ground.json gives, per tier, the
picture (lossless WebP, published) and, per usable building, its box in the picture's pixels and its
kind (barber, clinic, stall, posts, board), so the screen lights the building under the finger and names
it only then. Nothing on the picture is text.

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every tier carries all five usable kinds; every hotspot
lies inside its picture and boxes drawn pixels; every pixel is his (the 7/28 ramps and tiles, the desert,
water and sprite banks); no text is drawn (no font is used on a picture).

THE ANALOG HORROR LINE (rule 20): the posted wall is papered three deep, and the bottom layer is notices
for people nobody has seen since. Nobody tears them down.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: every building roof first, then the face (rounds seven, eight, fourteen).
  TG-04 THE STREET TILE: the stall stands on a real sidewalk, the board at a real kerb.
  CGRD-01 INTO THE BREACH: each usable building says what it is with one object you can see from across
        the screen -- a pole, a cross, an awning, paper, a board -- never a label.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: house45, store45, the building shell, the street, walls, wrecks and the lot are rounds two
  to fourteen, imported; his lamp and drum sprites; nothing is drawn twice.

[bb settlements] reference/library/battle_brothers/: a Battle Brothers town screen is one painted scene with
  its buildings in it, and the building IS the button. OURS: the scene is a block of the valley at 45.

    python3 tools/bohemia_combat2_settlement_pictures_cook_10_4_26.py
      -> slices/settlement_ground/{camp,town,fortress}.webp, settlement_ground.json
      -> slices/vote/COMBAT2_SETTLEMENT_PICTURES_10_4.png
"""
import importlib, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')
NB = importlib.import_module('bohemia_combat2_night_boards_cook_10_1_26')   # round eighteen: the same night as the fight's (rule 70a: one light)
MX, S8, H7, R5, R4, B, F, K, CV = BT.MX, BT.S8, BT.H7, BT.R5, BT.R4, BT.B, BT.F, BT.K, BT.CV
os.chdir(REPO)

OUT_DIR = 'slices/settlement_ground'
OUT_CARD = 'slices/vote/COMBAT2_SETTLEMENT_PICTURES_10_4.png'
m, ty, M, PX, PY, die = K.m, B.ty, B.M, B.PX, B.PY, K.die
A, C, G, T, ST, D = B.A, B.C, B.G, B.T, K.RAMPS['stucco'], K.RAMPS['deck']
WIDE, DEEP = 4, 3                                   # a settlement picture is 4 x 3 house tiles


def hard(im): return im.getchannel('A').point(lambda a: 255 if a > 127 else 0)


def paste(base, im, x, y):
    base.paste(im.convert('RGB'), (int(x), int(y)), hard(im) if im.mode == 'RGBA' else None)
    return (int(x), int(y), int(x) + im.size[0], int(y) + im.size[1])


def ground(seed, street=True):
    """The block, cut from the boards: yards and dirt, and the street on the middle row."""
    W, H = PX * WIDE, PY * DEEP
    plan = R4.yards(seed).crop((0, 0, M(12 * WIDE), M(12 * DEEP)))
    if street:
        side = F.SIDE / K.PPM
        tmp = R4.yards(seed)
        R4.walk_band(tmp, 18.0, 18.0 + side, seed + 1); R4.walk_band(tmp, 30.0 - side, 30.0, seed + 2)
        road = R4.road_band(tmp, 18.0 + side, 30.0 - side, seed + 3, lines=[(24.0, False, C[5])])
        plan = tmp.crop((0, 0, M(12 * WIDE), M(12 * DEEP)))
        board = plan.resize((W, H), Image.NEAREST)
        B.faces(board, road.crop((0, 0, M(12 * WIDE), M(12 * DEEP))).resize((W, H), Image.NEAREST), C[2], 0.15)
        return board
    return plan.resize((W, H), Image.NEAREST)


def barber_pole(h_m=2.2):
    w, h = m(0.28), ty(m(h_m))
    im = Image.new('RGBA', (w + 6, h + 10), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([3, 6, 3 + w, 6 + h], fill=T[6] + (255,))
    for y in range(6, 6 + h, 9): d.polygon([(3, y), (3 + w, y + 5), (3 + w, y + 9), (3, y + 4)], fill=T[1] + (255,))   # the red stripe, spiralling
    d.rectangle([1, 0, w + 5, 7], fill=C[5] + (255,)); d.rectangle([1, h + 4, w + 5, h + 10], fill=C[5] + (255,))
    K.shade(im, (3 + w // 2, 6, 3 + w, 6 + h), 0.8)
    return im


def cross(size):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, size - 1, size - 1], fill=T[6] + (255,))
    t = size // 4
    d.rectangle([t + t // 2, 2, size - t - t // 2, size - 3], fill=T[1] + (255,)); d.rectangle([2, t + t // 2, size - 3, size - t - t // 2], fill=T[1] + (255,))
    return im


def stall(seed):
    """A plank table under a striped awning, crates and jugs on it; the sidewalk market."""
    r = K.R(seed)
    w, d_, h = m(3.2), ty(m(1.6)), ty(m(2.2))
    im = Image.new('RGBA', (w + m(0.8), d_ + h + ty(m(0.8))), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    dr.polygon([(m(0.4), d_ + h), (w, d_ + h), (w + m(0.8), d_ + h + ty(m(0.8))), (m(0.8), d_ + h + ty(m(0.8)))], fill=A[2] + (255,))
    for px_ in (m(0.1), w - m(0.2)): dr.rectangle([px_, 6, px_ + 5, d_ + h], fill=D[1] + (255,))   # the poles
    for k in range(int(w / m(0.4)) + 1):                               # the awning, striped
        x = k * m(0.4)
        dr.rectangle([x, 0, min(w, x + m(0.4)), d_], fill=(T[3] if k % 2 else T[6]) + (255,))
    dr.line([(0, d_), (w, d_)], fill=T[0] + (255,), width=3)
    ty0 = d_ + h - ty(m(0.9))
    dr.rectangle([0, ty0, w, ty0 + ty(m(0.5))], fill=D[4] + (255,))     # the table top
    dr.rectangle([0, ty0 + ty(m(0.5)), w, d_ + h], fill=D[1] + (255,))
    for k in range(5):                                                  # crates and jugs on it
        x = m(0.2) + k * m(0.6)
        col = [C[4], T[2], A[4], G[2], D[3]][r.i(5)]
        dr.rectangle([x, ty0 - ty(m(0.5)), x + m(0.45), ty0], fill=col + (255,))
    return im


def posted_wall(seed, n=26):
    """A block wall papered three deep: the posts, where contracts and notices go up."""
    wall, _ = CV.PIECES[3][1]()
    im = wall.copy(); dr = ImageDraw.Draw(im); r = K.R(seed)
    cap, face = ty(m(0.2)), ty(m(1.8))
    for k in range(n):
        x, y = r.i(im.size[0] - m(0.5)), cap + r.i(max(1, face - ty(m(0.6))))
        w_, h_ = m(0.3 + r() * 0.25), ty(m(0.4 + r() * 0.2))
        dr.rectangle([x, y, x + w_, y + h_], fill=[ST[4], T[6], C[6], ST[3]][r.i(4)] + (255,))
        for l in range(2): dr.line([(x + 2, y + 3 + l * 4), (x + w_ - 2, y + 3 + l * 4)], fill=C[2] + (255,))
    return im


def board_on_pole(seed):
    r = K.R(seed)
    w, h, ph = m(1.4), ty(m(1.0)), ty(m(2.4))
    im = Image.new('RGBA', (w + m(0.6), ph + ty(m(0.6))), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    dr.rectangle([w // 2 - 3, 0, w // 2 + 3, ph], fill=D[1] + (255,))   # the pole
    dr.rectangle([0, 4, w, 4 + h], fill=D[4] + (255,)); dr.rectangle([0, 4, w, 8], fill=D[5] + (255,))   # the board, lit edge
    for k in range(4):
        x, y = m(0.1) + r.i(w - m(0.4)), 8 + r.i(max(1, h - ty(m(0.35))))
        dr.rectangle([x, y, x + m(0.3), y + ty(m(0.3))], fill=T[6] + (255,))
    dr.polygon([(w // 2, ph), (w // 2 + m(0.6), ph + ty(m(0.6))), (w // 2 + m(0.2), ph + ty(m(0.6)))], fill=A[2] + (255,))
    return im


def tarp(seed, w_m=4.0, d_m=3.0, cross_on=False):
    """A tarp strung over poles: the camp's roof. Ridge lit, the near slope in its own shade."""
    r = K.R(seed)
    w, d_, h = m(w_m), ty(m(d_m)), ty(m(2.0))
    im = Image.new('RGBA', (w + m(1.0), d_ + h + ty(m(1.0))), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    col = [(C[5], C[3]), (A[5], A[3]), (G[3], G[1]), (D[4], D[2])][r.i(4)]
    dr.polygon([(m(0.5), d_ + h), (w, d_ + h), (w + m(1.0), d_ + h + ty(m(1.0))), (m(1.0), d_ + h + ty(m(1.0)))], fill=A[2] + (255,))
    dr.polygon([(0, d_ // 2 + h // 2), (w, d_ // 2 + h // 2), (w, d_ + h), (0, d_ + h)], fill=col[1] + (255,))   # the near slope
    dr.polygon([(0, d_ // 2 + h // 2), (w, d_ // 2 + h // 2), (w, d_ // 2), (0, d_ // 2)], fill=col[0] + (255,))  # the ridge strip, lit
    dr.rectangle([w // 2 - m(0.6), d_ // 2 + h // 2 + 4, w // 2 + m(0.6), d_ + h], fill=A[0] + (255,))           # the opening
    if cross_on: im.paste(cross(m(1.0)), (m(0.4), d_ // 2 + h // 2 + 6), cross(m(1.0)))
    return im


def camp(seed):
    base = ground(seed, street=False)
    spots = {}
    paste(base, tarp(seed + 1, 5.0, 3.0), m(2.0), ty(m(3.0)))
    spots['clinic'] = paste(base, tarp(seed + 2, 5.0, 3.5, cross_on=True), m(14.0), ty(m(2.0)))
    trailer, _ = CV.PIECES[6][1]()                                        # the shed reads as the camp's lock-up
    paste(base, trailer, m(30.0), ty(m(4.0)))
    bt = tarp(seed + 3, 3.4, 2.4); b = paste(base, bt, m(26.0), ty(m(17.0)))
    pole = barber_pole(1.9); paste(base, pole, b[0] + m(0.2), b[3] - pole.size[1])
    spots['barber'] = (b[0], b[1], b[2], b[3])
    spots['stall'] = paste(base, stall(seed + 4), m(6.0), ty(m(18.0)))
    for k in range(10):                                               # the chain-link run with paper wired on
        x = m(2.0 + k * 1.2)
        ImageDraw.Draw(base).rectangle([x, ty(m(30.5)), x + 3, ty(m(30.5)) + ty(m(1.6))], fill=A[2])
    pw = posted_wall(seed + 5, 14).crop((0, 0, m(12.0), ty(m(2.0)) + 12))
    spots['posts'] = paste(base, pw, m(2.0), ty(m(29.6)))
    spots['board'] = paste(base, board_on_pole(seed + 6), m(40.0), ty(m(26.0)))
    r = K.R(seed)
    lights = []
    drum = F.load(F.SPR['oil_drum']).convert('RGBA')
    for (x, y) in ((20.0, 14.0), (36.0 + r() * 4, 20.0)):              # the fires people keep burning, a ring of stone round one
        bx = paste(base, drum, m(x), ty(m(y)))
        lights.append(((bx[0] + bx[2]) // 2, bx[3], m(5.5)))
    for k in range(9):
        a = k / 9 * 6.283; ImageDraw.Draw(base).ellipse([m(20.4 + 1.3 * __import__('math').cos(a)), ty(m(14.6 + 1.0 * __import__('math').sin(a))), m(20.4 + 1.3 * __import__('math').cos(a)) + 8, ty(m(14.6 + 1.0 * __import__('math').sin(a))) + 6], fill=C[3])
    paste(base, tarp(seed + 7, 3.6, 2.6), m(6.0 + r() * 3), ty(m(9.0)))   # more of the squat: tarps, scrap, a second wreck
    paste(base, tarp(seed + 8, 4.2, 3.0), m(38.0 + r() * 3), ty(m(9.5)))
    for k in range(5):
        rb = R5.EXTRA['rubble_%d' % r.i(len(R5.EXTRA))]; paste(base, rb, m(3 + r() * 40), ty(m(22 + r() * 6)))
    for k in range(4):                                                   # pallets stacked by the lock-up
        ImageDraw.Draw(base).rectangle([m(31 + k * 0.3), ty(m(10.5)) - k * 6, m(32.4 + k * 0.3), ty(m(10.5)) - k * 6 + 6], fill=D[3 + (k % 2)])
    paste(base, CV.PIECES[1][1]()[0], m(34.0), ty(m(28.0)))            # a dead car pulled in off the road
    paste(base, CV.PIECES[0][1]()[0], m(10.0 + r() * 8), ty(m(32.0)))
    return base, spots, lights


def town(seed):
    base = ground(seed)
    spots = {}
    h1 = H7.house45(seed + 1, 'north'); paste(base, h1, 0, 0)
    hb = H7.house45(seed + 2, 'north'); b = paste(base, hb, PX, 0)
    pole = barber_pole(); paste(base, pole, b[0] + m(1.0), b[3] - ty(m(1.6)) - pole.size[1] // 2)
    spots['barber'] = b
    st = S8.store45(seed + 3)                                            # the clinic: a store front with the cross
    cr = cross(ty(m(1.1)) - 4); st.paste(cr, (m(5.4), PY - ty(m(4.5)) - ty(m(1.2)) - ty(m(1.1)) + 2), cr)
    spots['clinic'] = paste(base, st, 2 * PX, 0)
    paste(base, S8.store45(seed + 4), 3 * PX, 0)
    sb = stall(seed + 5)                                                # on the north sidewalk, its feet on the walk
    spots['stall'] = paste(base, sb, 2 * PX + m(2.0), ty(m(19.2)) - sb.size[1])
    wall = posted_wall(seed + 6)                                        # in the front yards, facing the street
    spots['posts'] = paste(base, wall, m(1.5), ty(m(14.0)))
    for k, c in enumerate((0, 2, 3)):                                   # the south row, behind its own walk
        paste(base, H7.house45(seed + 7 + k, 'south'), c * PX, ty(m(30.0)))
    bp = board_on_pole(seed + 9)                                        # at the south kerb
    spots['board'] = paste(base, bp, PX + m(5.0), ty(m(29.8)) - bp.size[1])
    im = CV.PIECES[1][1]()[0]; paste(base, im, m(32.0), ty(m(21.5)))
    r = K.R(seed); lights = []
    for (x, y, sid) in ((5.0, 19.0, 'lamp_house_side'), (29.0, 19.0, 'lamp_house_side'), (17.0, 30.0, 'lamp_your_side'), (41.0, 30.0, 'lamp_your_side')):
        fx, fy = NB.place(base, sid, x, y)
        if r() < 0.5 or not lights: lights.append((fx, fy, m(7.0)))     # one in two still burns; at least one
    return base, spots, lights


def fortress(seed):
    base = ground(seed, street=False)
    spots = {}
    W, H = base.size
    ap = BT.apartments(seed + 1); paste(base, ap, m(2.0), ty(m(1.0)))
    st = S8.store45(seed + 2); cr = cross(ty(m(1.1)) - 4); st.paste(cr, (m(5.4), PY - ty(m(4.5)) - ty(m(1.2)) - ty(m(1.1)) + 2), cr)
    spots['clinic'] = paste(base, st, 2 * PX + m(2.0), ty(m(4.0)))
    sb = S8.store45(seed + 3); b = paste(base, sb, m(1.0), PY + ty(m(4.0)))
    pole = barber_pole(); paste(base, pole, b[0] + m(1.0), b[3] - ty(m(1.6)) - pole.size[1] // 2)
    spots['barber'] = b
    s1 = paste(base, stall(seed + 4), PX + m(4.0), PY + ty(m(8.0)))
    s2 = paste(base, stall(seed + 5), PX + m(8.0), PY + ty(m(8.0)))
    spots['stall'] = (s1[0], min(s1[1], s2[1]), s2[2], max(s1[3], s2[3]))
    spots['board'] = paste(base, board_on_pole(seed + 6), 2 * PX + m(4.0), PY + ty(m(9.0)))
    wall, _ = CV.PIECES[3][1]()                                         # the walls round it, with the gate gap
    for x in range(0, W, wall.size[0] - m(0.5)):
        if 2 * PX - m(1.0) < x < 2 * PX + m(6.0): continue
        paste(base, wall, x, H - ty(m(4.0)))
    spots['posts'] = paste(base, posted_wall(seed + 7, 30), 2 * PX + m(7.0), H - ty(m(4.0)))
    tower = Image.new('RGBA', (m(2.6), ty(m(7.0))), (0, 0, 0, 0)); td = ImageDraw.Draw(tower)   # the watch post: containers stacked
    for k in range(3):
        y = k * ty(m(2.3)); td.rectangle([0, y, m(2.6), y + ty(m(2.3)) - 2], fill=(A[3] if k % 2 else T[1]) + (255,))
        for x in range(0, m(2.6), m(0.28)): td.line([(x, y), (x, y + ty(m(2.3)) - 2)], fill=A[1] + (255,))
    paste(base, tower, W - m(4.0), H - ty(m(9.0)))
    lights = []
    for x in (6.0, 20.0, 34.0, 44.0):                                   # the fortress keeps a generator: its wall lamps all burn
        fx, fy = NB.place(base, 'lamp_your_side', x, 33.0)
        lights.append((fx, fy, m(7.0)))
    bx = paste(base, F.load(F.SPR['oil_drum']).convert('RGBA'), 2 * PX + m(8.0), PY + ty(m(12.0)))
    lights.append(((bx[0] + bx[2]) // 2, bx[3], m(5.0)))
    return base, spots, lights


def guard(name, im, spots):
    need = {'barber', 'clinic', 'stall', 'posts', 'board'}
    if set(spots) != need: die('%s is missing %s' % (name, need - set(spots)))
    for k, (x0, y0, x1, y1) in spots.items():
        if x0 < 0 or y0 < 0 or x1 > im.size[0] or y1 > im.size[1]: die('%s: %s hotspot off the picture' % (name, k))
    bad = K.colours(im) - B.OK
    if bad: die('%s has %d colours off his banks, e.g. %s' % (name, len(bad), list(bad)[:3]))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # ROUND EIGHTEEN: two variants a tier (no two settlements of a size the same picture), each with its
    # NIGHT: round six's night (a third of itself, colder, snapped to his palette), lit only by the lamps
    # and drums that still burn, the pools in hard rings; the same night the fight uses (rule 70a, one light).
    make = {'camp': camp, 'town': town, 'fortress': fortress}
    seeds = {'camp': (1401, 1451), 'town': (1501, 1551), 'fortress': (1601, 1651)}
    man = dict(version='settlement-ground-10-4b', built='10/4/26', lane='combat 2', for_screen='RUN TWO, the settlement screen (rule 71a)',
               note='the picture is one place; light the building under the finger, name it only when touched; no text on the picture; variants[] pick one per settlement by seed; night_src at night',
               px_per_metre=K.PPM, perspective='45 DEGREE ART LAW', tiers={})
    tiers = {}
    for name, fn in make.items():
        vs = []
        for i, sd in enumerate(seeds[name]):
            im, spots, lights = fn(sd)
            guard(name, im, spots)
            nim, keep = NB.night_sun(im, lights)                         # ROUND NINETEEN: rule 73's sun-readable night
            guard(name + ' night', nim, spots)
            sm = NB.sun_measure(nim, keep)
            if sm['plain']['ground_median'] < 0.20 or sm['plain']['lit_vs_unlit'] < 3.0 or sm['sun']['ground_median'] < 0.20:
                die('%s night under rule 73: %s' % (tag if False else name, sm))
            tag = '%s_%d' % (name, i)
            im.save('%s/%s.webp' % (OUT_DIR, tag), 'WEBP', lossless=True, method=6)
            nim.save('%s/%s_night.webp' % (OUT_DIR, tag), 'WEBP', lossless=True, method=6)
            vs.append(dict(src='%s.webp' % tag, night_src='%s_night.webp' % tag, px=list(im.size),
                           hotspots={k: dict(box=list(v), kind=k) for k, v in spots.items()}, lights=len(lights), night_measured=sm))
            if i == 0: tiers[name] = (im, spots, nim)
        man['tiers'][name] = dict(src=vs[0]['src'], px=vs[0]['px'], hotspots=vs[0]['hotspots'], variants=vs)
    for old in ('camp.webp', 'town.webp', 'fortress.webp'):
        if os.path.exists(os.path.join(OUT_DIR, old)): os.remove(os.path.join(OUT_DIR, old))
    json.dump(man, open(OUT_DIR + '/settlement_ground.json', 'w'), indent=1)
    sc = 0.36
    thumbs = [(k, im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.LANCZOS), sp) for k, (im, sp, nim) in tiers.items()]
    nights = [nim.resize((int(nim.size[0] * sc), int(nim.size[1] * sc)), Image.LANCZOS) for k, (im, sp, nim) in tiers.items()]
    w, h = thumbs[0][1].size
    out = Image.new('RGB', (w * 2 + 60, (h + 50) * 3 + 20), (12, 11, 10)); d = ImageDraw.Draw(out)
    for i, (k, im, sp) in enumerate(thumbs):
        y = 20 + i * (h + 50)
        d.text((20, y), {'camp': 'CAMP', 'town': 'TOWN', 'fortress': 'FORTRESS'}[k] + '   (dotted: what lights up under your finger)', font=K.font(15), fill=(222, 181, 118))
        out.paste(im, (20, y + 26)); out.paste(nights[i], (w + 40, y + 26))
        d.text((w + 40, y), 'AT NIGHT: only the lamps and fires that still burn', font=K.font(15), fill=(222, 181, 118))
        for kk, (x0, y0, x1, y1) in sp.items():
            bx = [20 + int(x0 * sc), y + 26 + int(y0 * sc), 20 + int(x1 * sc), y + 26 + int(y1 * sc)]
            for t in range(0, bx[2] - bx[0], 6): d.point((bx[0] + t, bx[1]), fill=(255, 236, 160)); d.point((bx[0] + t, bx[3]), fill=(255, 236, 160))
            for t in range(0, bx[3] - bx[1], 6): d.point((bx[0], bx[1] + t), fill=(255, 236, 160)); d.point((bx[2], bx[1] + t), fill=(255, 236, 160))
    out.save(OUT_CARD, optimize=True)
    tot = sum(os.path.getsize(os.path.join(OUT_DIR, f)) for f in os.listdir(OUT_DIR))
    print('ok: 3 settlement pictures, %.1f MB in %s' % (tot / 1e6, OUT_DIR))


if __name__ == '__main__':
    main()
