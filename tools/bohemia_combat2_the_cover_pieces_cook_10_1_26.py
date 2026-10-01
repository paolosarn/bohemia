#!/usr/bin/env python3
"""THE FIGHT'S COVER  (COMBAT 2 [cover pieces], 10/1/26, rule 46f and 55)

After the floor, the things you hide behind. The tan cardboard blocks die; in their place the
three cover kinds the row names, at house scale, every one tall enough to hide a man:

  DEAD CARS x3      his own 7/28 wrecks, reused whole: the burnt sedan in the lane, the one
                    shoved against the kerb, the stripped patrol car nose-in on a driveway.
  BLOCK WALL x3     the desert block wall every Vegas yard has: a straight 6 m run, a corner
                    (4 m by 4 m, the yard's own), and a run with a gap knocked through it and
                    the masonry lying where it fell (his own rubble sprite).
  SHED              a corrugated backyard shed, 3.0 by 2.4 m and 2.2 m tall, rust where the
                    rain sat, the door hanging open on nothing.

Helpers, ramps and density come from the floor set and the block war kit, imported (REUSE).

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every piece is at or over a man's chest (1.3 m), so it hides him;
  * every pixel is his: his ramps, his tiles, his sprites;
  * no two pieces are the same picture;
  * every piece's footprint fits inside one house tile (12 m), so COMBAT can drop one per tile.

THE ANALOG HORROR LINE (rule 20): the shed door is open and nothing is inside, and nobody on
the street remembers taking what was.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: the shed's roof plane first, then its face.
  CGRD-01 INTO THE BREACH: clarity over cool -- a cover piece says it is cover from across the
        screen: a dark mass with a lit top edge and a hard shadow south-east.
  AH-01 THE BIBLE: the sun north-west on every piece, every shadow south-east.
  REUSE CHECK: the wrecks and the rubble are his 7/28 sprites; ramps and tiles from that bank.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md, the
  BOARD line: three or four blocker kinds per terrain so the board reads. Ours: car, wall,
  shed for the block war, each one something a neighbour left.

    python3 tools/bohemia_combat2_the_cover_pieces_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_COVER_10_1_26.txt
      -> slices/vote/COMBAT2_THE_COVER_PIECES_10_1.png
"""
import importlib, json, os, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
F = importlib.import_module('bohemia_combat2_the_floor_set_cook_10_1_26')
K = F.K
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_COVER_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_THE_COVER_PIECES_10_1.png'
m, dress, shade, load, R, die = K.m, K.dress, K.shade, K.load, K.R, K.die
A, C, T, S = K.RAMPS['asphalt'], K.RAMPS['concrete'], K.RAMPS['terracotta'], K.RAMPS['stucco']
SPR, PX = F.SPR, F.PX


def drop_shadow(im, box, off=0.5, mult=0.62):
    x0, y0, x1, y1 = box
    shade(im, (x0 + m(off), y1, x1 + m(off), y1 + m(off)), mult)
    shade(im, (x1, y0 + m(off), x1 + m(off), y1), mult)


def car(sid):
    s = SPR[sid]
    out = F.car45(sid)                                           # his wreck from the 45 camera
    names = {'wreck_road': 'DEAD CAR, IN THE LANE', 'wreck_kerb': 'DEAD CAR, AT THE KERB',
             'wreck_driveway': 'DEAD PATROL CAR, ON THE DRIVE'}
    return out, dict(w=round(min(s['w'], s['h']), 2), l=round(max(s['w'], s['h']), 2), h=1.45,
                     kind='COVER', name=names[sid], from_sprite=sid)


def wall_run(im, x, y, L, seed, vertical=False):
    """One run of block: cap lit north-west, the south face showing its courses."""
    d = ImageDraw.Draw(im)
    cap, face = F.ty(m(0.2)), F.ty(m(1.8))                       # 45: depth and height x cos45
    if vertical:
        d.rectangle([x, y, x + cap, y + L], fill=C[5] + (255,))
        d.line([(x, y), (x, y + L)], fill=C[6] + (255,))
        d.rectangle([x + cap, y, x + cap + m(0.12), y + L], fill=C[2] + (255,))   # the east face, shaded
        for yy in range(y, y + L, m(0.4)): d.line([(x, yy), (x + cap, yy)], fill=C[3] + (255,))
        return (x, y, x + cap + m(0.12), y + L)
    body = dress(['concrete_0', 'concrete_1'], L, face, seed).convert('RGBA')
    im.paste(body, (x, y + cap))
    d.rectangle([x, y, x + L, y + cap], fill=C[5] + (255,)); d.line([(x, y), (x + L, y)], fill=C[6] + (255,))
    bh, bw = m(0.2), m(0.4)
    for k, yy in enumerate(range(y + cap, y + cap + face, bh)):
        d.line([(x, yy), (x + L, yy)], fill=C[1] + (255,))
        for xx in range(x + (bw // 2) * (k % 2), x + L, bw):
            d.line([(xx, yy), (xx, min(y + cap + face, yy + bh))], fill=C[1] + (255,))
    shade(im, (x, y + cap, x + L, y + cap + face), 0.86)
    return (x, y, x + L, y + cap + face)


def wall_straight():
    im = Image.new('RGBA', (m(6.6), m(1.8)), (0, 0, 0, 0))
    b = wall_run(im, 0, 0, m(6.0), 81)
    _shadow_under(im, b)
    return im, dict(w=0.2, l=6.0, h=1.8, kind='COVER', name='BLOCK WALL')


def _shadow_under(im, b):
    x0, y0, x1, y1 = b
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).polygon([(x0 + m(0.2), y1), (x1, y1), (x1 + m(0.5), y1 + m(0.5)),
                                (x0 + m(0.7), y1 + m(0.5))], fill=A[2] + (255,))
    sh.alpha_composite(im); im.paste(sh, (0, 0))


def wall_corner():
    im = Image.new('RGBA', (m(4.8), m(4.8)), (0, 0, 0, 0))
    bv = wall_run(im, 0, 0, m(4.0), 82, vertical=True)
    bh = wall_run(im, 0, m(3.0), m(4.0), 83)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(sh)
    dd.polygon([(bv[2], m(0.3)), (bv[2] + m(0.5), m(0.6)), (bv[2] + m(0.5), m(3.0)), (bv[2], m(3.0))], fill=A[2] + (255,))
    dd.polygon([(m(0.2), bh[3]), (bh[2], bh[3]), (bh[2] + m(0.5), bh[3] + m(0.5)), (m(0.7), bh[3] + m(0.5))], fill=A[2] + (255,))
    sh.alpha_composite(im); im.paste(sh, (0, 0))
    return im, dict(w=4.0, l=4.0, h=1.8, kind='COVER', name='BLOCK WALL, CORNER')


def wall_broken():
    im = Image.new('RGBA', (m(6.6), m(2.6)), (0, 0, 0, 0))
    b1 = wall_run(im, 0, 0, m(2.4), 84)
    b2 = wall_run(im, m(3.7), 0, m(2.3), 85)
    _shadow_under(im, b1); _shadow_under(im, b2)
    d = ImageDraw.Draw(im)
    for bx in (m(2.4), m(3.7)):                                  # the broken ends, jagged
        r = R(bx)
        for k in range(6):
            yy = m(0.22) + k * m(0.15)
            dx = (r.i(m(0.25)) - m(0.12))
            d.rectangle([bx + min(0, dx), yy, bx + max(0, dx), yy + m(0.15)], fill=C[2] + (255,))
    for sid, at in (('rubble_yard', (m(2.5), m(1.25))), ('rubble_road', (m(3.0), m(1.55)))):
        rb = load(SPR[sid]).convert('RGBA')
        im.paste(rb.convert('RGB').convert('RGBA'), at, rb.getchannel('A').point(lambda a: 255 if a > 127 else 0))
    return im, dict(w=0.2, l=6.0, h=1.8, kind='COVER', name='BLOCK WALL, KNOCKED THROUGH', gap_m=1.3)


def shed():
    """A corrugated backyard shed from 45 degrees: the roof plane first, then the face."""
    W, Dp, H = m(3.0), m(2.4), m(2.2)
    top, face = F.ty(Dp), F.ty(H)                                # 45: depth and height x cos45
    im = Image.new('RGBA', (W + m(0.8), top + face + m(0.8)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(m(0.3), top + face), (W, top + face), (W + m(0.7), top + face + m(0.7)),
               (m(1.0), top + face + m(0.7))], fill=A[2] + (255,))   # its shadow, south-east
    d.polygon([(W, m(0.2)), (W + m(0.5), m(0.6)), (W + m(0.5), top + face + m(0.3)), (W, top + face)], fill=A[2] + (255,))
    d.rectangle([0, 0, W, top], fill=C[4] + (255,))              # the roof, lit
    for x in range(0, W, m(0.2)):                                # corrugations
        d.line([(x, 0), (x, top)], fill=C[2] + (255,)); d.line([(x + 1, 0), (x + 1, top)], fill=C[6] + (255,))
    r = R(91)
    for _ in range(26):                                          # rust where the rain sat
        rx, ry = r.i(W), int(top * 0.5) + r.i(top // 2)
        d.rectangle([rx, ry, rx + m(0.12), ry + m(0.06)], fill=T[1 + r.i(2)] + (255,))
    d.line([(0, top - 1), (W, top - 1)], fill=C[6] + (255,))     # the drip edge catching sun
    d.rectangle([0, top, W, top + face], fill=C[3] + (255,))     # the face
    for x in range(0, W, m(0.2)): d.line([(x, top), (x, top + face)], fill=C[2] + (255,))
    shade(im, (0, top, W, top + face), 0.84)
    dx = W // 2 - m(0.45)
    d.rectangle([dx, top + m(0.1), dx + m(0.9), top + face], fill=A[0] + (255,))   # the open door
    d.polygon([(dx, top + m(0.1)), (dx - m(0.35), top + m(0.2)), (dx - m(0.35), top + face + m(0.1)), (dx, top + face)], fill=C[2] + (255,))
    return im, dict(w=2.4, l=3.0, h=2.2, kind='COVER', name='SHED', blocks_move=True)


PIECES = [('car_lane', lambda: car('wreck_road')), ('car_kerb', lambda: car('wreck_kerb')),
          ('car_drive', lambda: car('wreck_driveway')), ('wall', wall_straight),
          ('wall_corner', wall_corner), ('wall_broken', wall_broken), ('shed', shed)]


def guard(pieces):
    ok = set(K.ALL)
    for sp in K._B['sprites']: ok |= K.colours(load(sp))
    seen = set()
    for key, (im, meta) in pieces.items():
        bad = K.colours(im) - ok
        if bad: die('%s has %d colours off his ramps, tiles and sprites, e.g. %s' % (key, len(bad), list(bad)[:3]))
        if meta['h'] < K.CHEST: die('%s is %.2f m: under a man\'s chest, it hides nobody' % (key, meta['h']))
        if max(meta['w'], meta['l']) > K.TILE_M: die('%s does not fit one house tile' % key)
        if im.tobytes() in seen: die('%s is stamped' % key)
        seen.add(im.tobytes())


def card(pieces):
    fl = json.load(open(F.OUT_BANK))
    g = {t['id']: Image.open(__import__('io').BytesIO(__import__('base64').b64decode(t['b64']))).convert('RGB') for t in fl['ground']}
    sc = 0.5; tp, tq = int(PX * sc), int(F.PY * sc)
    lay = [['lot', 'slab', 'lot_b', 'roof'], ['street_small', 'street_small', 'street_crossing', 'street_small'],
           ['lot_b', 'lot', 'slab', 'lot']]
    board = Image.new('RGBA', (tp * 4, tq * 3))
    for r_, row in enumerate(lay):
        for c_, k in enumerate(row): board.paste(g[k].resize((tp, tq), Image.NEAREST), (c_ * tp, r_ * tq))
    put = [('shed', 0.25, 0.35), ('wall_corner', 1.1, 0.05), ('car_drive', 1.62, 0.1), ('car_lane', 0.4, 1.35),
           ('car_kerb', 2.9, 1.22), ('wall', 0.2, 2.15), ('wall_broken', 2.2, 2.2)]
    for k, x, y in put:
        im = pieces[k][0]; im = im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.NEAREST)
        board.alpha_composite(im, (int(tp * x), int(tq * y)))
    you = load(SPR['you']).convert('RGBA'); nb = load(SPR['the_neighbour']).convert('RGBA')
    for sp, x, y in ((you, 0.55, 1.9), (nb, 2.6, 1.85), (nb, 1.95, 0.1), (nb, 3.25, 0.75)):
        s2 = sp.resize((sp.size[0] * 2, sp.size[1] * 2), Image.NEAREST)
        board.alpha_composite(s2, (int(tp * x), int(tq * y)))
    before = Image.open(F.BEFORE).convert('RGB').crop((20, 70, 488, 840))
    bh = board.size[1]
    before = before.resize((int(before.size[0] * bh / before.size[1]), bh), Image.NEAREST)
    W = before.size[0] + board.size[0] + 60
    strip_h = 260
    out = Image.new('RGB', (W, 60 + bh + 40 + strip_h), (12, 11, 10))
    d = ImageDraw.Draw(out)
    d.text((20, 18), 'BEFORE: tan cardboard', font=K.font(26), fill=(222, 181, 118))
    d.text((before.size[0] + 40, 18), 'AFTER: a car, a wall, a shed to hide behind', font=K.font(26), fill=(222, 181, 118))
    out.paste(before, (20, 60)); out.paste(board.convert('RGB'), (before.size[0] + 40, 60))
    x, y = 20, 60 + bh + 30
    for k, _ in PIECES:
        im, meta = pieces[k]
        f = min(1.0, 180 / im.size[0], 190 / im.size[1])
        th = im.resize((max(1, int(im.size[0] * f)), max(1, int(im.size[1] * f))), Image.NEAREST)
        bg = Image.new('RGB', (190, 200), (40, 36, 32)); bg.paste(th, (5, 5), th)
        out.paste(bg, (x, y + 26)); d.text((x, y), meta['name'][:26], font=K.font(12), fill=(222, 181, 118))
        x += 198
    return out


def main():
    pieces = {k: fn() for k, fn in PIECES}
    guard(pieces)
    bank = dict(version='fight-cover-10-1', built='10/1/26', lane='combat 2', row='[cover pieces]',
                from_bank=K.BANK, px_per_metre=K.PPM, tile_metres=K.TILE_M, chest_m=K.CHEST,
                pieces=[dict(id=k, px=list(im.size), b64=F.b64(im), **meta) for k, (im, meta) in pieces.items()])
    json.dump(bank, open(OUT_BANK, 'w'), indent=1)
    card(pieces).save(OUT_CARD, optimize=True)
    print('ok: %d cover pieces -> %s, %s' % (len(pieces), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
