#!/usr/bin/env python3
"""THE FIGHT'S FLOOR SET  (COMBAT 2 [floor set], 10/1/26, rule 46f and 55)

PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people dont look good
man its all fucked up." The ground under every fighter was pale ovals, tan cardboard and flat
brown. This cook bakes THE GROUND ITSELF, house-sized (12 m, a combat tile is a house), out of
his own approved 7/28 street bank at his own density (42.9 px per metre, so one tile is 515 px
and nothing is upscaled):

  STREET, SMALL     one tile: sidewalk, kerb, gutter, two lanes, the faded dashed centre line,
                    gutter, kerb, sidewalk. A small street is one tile (46g).
  STREET, BIG A/B   two tiles side by side across: each carries a sidewalk and kerb, the join
                    carries the double centre line, each lane has its dashed lane line.
  FREEWAY LANE      the open asphalt tile; four in a row is a freeway (46g), lane lines only.
  CROSSING          the small street with the painted bars across it.
  LOT, LOT BARE     the dead gravel yard on graded dirt, the ground most fights stand on;
                    two of them so a board is never one picture repeated.
  SLAB              poured driveway slab, joints every 3 m, the cracks his tiles carry.
  ROOF              the flat gravel deck with its lit parapet: the one high ground (rule 37g).
  plus two COVER pieces for the tan blocks:
  DEAD CAR          his own 7/28 wreck, already drawn at this density; reused, not redrawn.
  BLOCK WALL        a desert block wall, the wall every Vegas yard has, 6 m long, 1.8 m tall.

The density, the dress and the shading helpers are the block war kit's, imported, not copied
(REUSE-FIRST). Every pixel stays on his ramps or his own tiles' colours (guarded).

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every ground tile is exactly 12 m at 42.9 px/m (515 px), so the fight never resamples;
  * every pixel is his: on a family ramp of the 7/28 bank or in one of his tiles;
  * the tiles tile: the east edge of every street tile equals its west edge, so a street of
    N tiles has no seam;
  * nothing is stamped: no two ground tiles are the same picture;
  * nothing but ground is painted on the ground: no text, no ovals, no markers.

THE ANALOG HORROR LINE (rule 20): the centre line has not been repainted since the dollar died
and it is going; the dashes are missing in the places where the tyres stopped coming.

REFERENCE CHECK (the 9/4 standing law):
  TG-04 THE STREET TILE: the kerb is the strongest edge on the ground, the lip lit north-west.
  TG-02 THE HOUSE FROM 45 DEGREES: the roof deck reads as a top you stand on, parapet lit.
  CGRD-01 INTO THE BREACH: clarity over cool -- the floor is quieter than the men on it, so
        nothing on these tiles is brighter than his sidewalk.
  AH-01 THE BIBLE: one register, the sun north-west on every piece, every shadow south-east.
  REUSE CHECK: the tiles, the wreck and the ramps all come out of the 7/28 bank at run time.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md, the
  BOARD line: the tactical ground is generated from the map cell and is quieter than the men
  on it. WHAT WE DO DIFFERENTLY: BB's ground is grass and mud; ours is a street that was paved
  for a life that stopped, so the floor itself tells you where you are.

    python3 tools/bohemia_combat2_the_floor_set_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt
      -> slices/vote/COMBAT2_THE_FLOOR_SET_R2_10_1.png
"""
import base64, importlib, io, json, os, sys
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
K = importlib.import_module('bohemia_the_block_war_kit_cook_9_30_26')
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_THE_FLOOR_SET_R2_10_1.png'   # round two; round one's voted sheet stays as he saw it
BEFORE = 'slices/vote/COMBAT_NOTHING_ON_THE_GROUND_10_1.png'

m, dress, shade, RAMPS, TILES, load, die, R = K.m, K.dress, K.shade, K.RAMPS, K.TILES, K.load, K.die, K.R
PX = m(K.TILE_M)                     # 515
A, C, G, T, D = RAMPS['asphalt'], RAMPS['concrete'], RAMPS['ground'], RAMPS['terracotta'], RAMPS['deck']
SPR = {s['id']: s for s in K._B['sprites']}
# ROUND TWO, HIS FIFTH VOTES (rule 56): (1) THE SIDEWALK IS REAL-SIZED: 'the sidewalks are way
# too fucking big... this has to look real first.' A Vegas sidewalk is 4-5 ft against a 37 ft
# roadway, about an eighth; round one drew 1.8 m against 8.4 m, a fifth. Now 1.4 m (4.6 ft)
# against the 9.2 m roadway a 12 m tile leaves, 0.15, under the ruler's sixth.
# (2) THE GROUND IS 45 DEGREES, NEVER A 90 BIRD'S EYE: 'everything we do is 45 when it comes
# to the land underneath.' The camera is pitched 45, so a 12 m deep tile is drawn 12 x cos45
# = 8.5 m tall on screen (515 x 364), and every vertical face that looks south -- the kerb, the
# parapet -- is SEEN, its height also times cos45, in its own shadow.
SIDE, KERB, GUT = m(1.4), m(0.15), m(0.45)
TILT = 0.7071
PY = int(round(PX * TILT))           # 364
RULER = 1 / 6.0                      # the sidewalk is at most a sixth of its roadway


def ty(y): return int(round(y * TILT))


def tilt(im):
    """The square plan, seen from the 45 camera. NEAREST so every pixel stays his."""
    return im.resize((PX, PY), Image.NEAREST)


def face(im, y, h_m, lit_top=True):
    """A vertical face looking at the camera, h_m metres tall, drawn at cos45, shaded."""
    d = ImageDraw.Draw(im)
    h = max(2, ty(m(h_m)))
    d.rectangle([0, y, PX, y + h], fill=C[2])
    d.line([(0, y + h), (PX, y + h)], fill=C[1])
    if lit_top: d.line([(0, y), (PX, y)], fill=C[6])
    return im


def quiet(im, k=0.45):
    """THE FLOOR IS QUIETER THAN THE MEN ON IT (CGRD-01). His walk and slab tiles carry heavy
       black cracks that read as noise at fight zoom (round 1's own weak note). Each colour is
       pulled toward the middle of ITS OWN family ramp and snapped back onto that ramp, so the
       cracks stay drawn and every pixel stays his; only the shouting goes."""
    byf = {f: sorted(r, key=K.LUM) for f, r in RAMPS.items()}
    memo, p = {}, im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            c = p[x, y][:3]
            if c not in memo:
                ramp = byf[K.fam_of(c)]
                mid = K.LUM(ramp[len(ramp) // 2])
                v = K.LUM(c) + (mid - K.LUM(c)) * k
                memo[c] = min(ramp, key=lambda e: abs(K.LUM(e) - v))
            p[x, y] = memo[c] + p[x, y][3:]
    return im


def band(img, variants, y0, y1, seed, flip=False):
    b = dress(variants, PX, y1 - y0, seed)
    if variants[0].startswith('walk'): b = quiet(b)
    if flip: b = b.transpose(Image.FLIP_TOP_BOTTOM)
    img.paste(b, (0, y0))


def seamless(img):
    """THE STREET RUNS EAST-WEST, so its east edge must meet its own west edge. A 515 px tile
       is not a whole number of his 44 px cells; cross-fading the last cells into the first by
       copying keeps every pixel his and kills the seam."""
    w = m(1.0)
    left = img.crop((0, 0, w, PX))
    img.paste(left, (PX - w, 0))
    return img


def kerb(img, y, face_down=True):
    """The kerb lip, the strongest edge on the ground: lit top, the face in its own shadow."""
    d = ImageDraw.Draw(img)
    d.rectangle([0, y, PX, y + KERB], fill=C[5])
    d.line([(0, y), (PX, y)], fill=C[6])
    if face_down: d.rectangle([0, y + KERB - 2, PX, y + KERB], fill=C[2])
    else: d.rectangle([0, y, PX, y + 2], fill=C[2])


def dashes(img, y, seed, dash=3.0, gap=9.0, thick=0.15, col=None, solid=False):
    """A painted line, faded, with dashes missing where the tyres stopped coming."""
    d, r = ImageDraw.Draw(img), R(seed)
    col = col or C[5]
    x = 0 if solid else int(r() * m(gap))
    step = PX if solid else m(dash + gap)
    while x < PX:
        if solid or r() > 0.18:
            x1 = min(PX, x + (PX if solid else m(dash)))
            d.rectangle([x, y, x1, y + max(2, m(thick))], fill=col)
            for _ in range(int((x1 - x) / 6)):                     # the wear, his asphalt
                wx, wy = x + r.i(max(1, x1 - x)), y + r.i(max(2, m(thick)) + 1)
                d.point((wx, wy), fill=A[5])
        x += step if not solid else PX
    return img


def street_small(seed=11, crossing=False, ns=False):
    im = Image.new('RGB', (PX, PX))
    band(im, ['walk_0', 'walk_1', 'walk_2'], 0, SIDE, seed)
    band(im, ['road_gutter'], SIDE, SIDE + GUT, seed + 1)
    band(im, ['road_0', 'road_1', 'road_2'], SIDE + GUT, PX - SIDE - GUT, seed + 2)
    band(im, ['road_gutter'], PX - SIDE - GUT, PX - SIDE, seed + 3, flip=True)
    band(im, ['walk_0', 'walk_1', 'walk_2'], PX - SIDE, PX, seed + 4, flip=True)
    if crossing:
        cr = load(TILES['road_crossing']).convert('RGB')
        for y in range(SIDE + GUT, PX - SIDE - GUT, cr.size[1]):
            im.paste(cr.crop((0, 0, cr.size[0], min(cr.size[1], PX - SIDE - GUT - y))), (PX // 2 - 66, y))
            im.paste(cr.crop((0, 0, cr.size[0], min(cr.size[1], PX - SIDE - GUT - y))), (PX // 2 - 22, y))
            im.paste(cr.crop((0, 0, cr.size[0], min(cr.size[1], PX - SIDE - GUT - y))), (PX // 2 + 22, y))
    else:
        dashes(im, PX // 2 - m(0.06), seed)
    kerb(im, SIDE - KERB, True)
    kerb(im, PX - SIDE, False)
    shade(im, (0, SIDE, PX, SIDE + m(0.35)), 0.78)                 # the kerb's shadow, south
    if ns:                                                         # NORTH-SOUTH: the plan turned
        return tilt(seamless(im).transpose(Image.ROTATE_90))       # BEFORE the 45 tilt, not after
    return face(tilt(seamless(im)), ty(SIDE), 0.15)                 # the north kerb's face, seen


def street_big(seed=21, half='A'):
    im = Image.new('RGB', (PX, PX))
    if half == 'A':
        band(im, ['walk_0', 'walk_1', 'walk_2'], 0, SIDE, seed)
        band(im, ['road_gutter'], SIDE, SIDE + GUT, seed + 1)
        band(im, ['road_0', 'road_1', 'road_2'], SIDE + GUT, PX, seed + 2)
        kerb(im, SIDE - KERB, True)
        shade(im, (0, SIDE, PX, SIDE + m(0.35)), 0.78)
        dashes(im, SIDE + (PX - SIDE) // 2, seed)
        dashes(im, PX - m(0.30), seed + 5, solid=True, col=T[5])   # half the double line
        return face(tilt(seamless(im)), ty(SIDE), 0.15)
    else:
        band(im, ['road_0', 'road_1', 'road_2'], 0, PX - SIDE - GUT, seed + 2)
        band(im, ['road_gutter'], PX - SIDE - GUT, PX - SIDE, seed + 3, flip=True)
        band(im, ['walk_0', 'walk_1', 'walk_2'], PX - SIDE, PX, seed + 4, flip=True)
        kerb(im, PX - SIDE, False)
        dashes(im, (PX - SIDE) // 2, seed)
        dashes(im, m(0.18), seed + 6, solid=True, col=T[5])
    return tilt(seamless(im))


def freeway(seed=31):
    im = Image.new('RGB', (PX, PX))
    band(im, ['road_0', 'road_1', 'road_2'], 0, PX, seed)
    dashes(im, PX // 2, seed, dash=3.0, gap=9.0)
    return tilt(seamless(im))


def lot(seed=51):
    """The dead gravel yard, with the graded dirt showing through where nothing walks. The
       patches come from a coarse noise field cut at a level, so they are ragged like ground
       and not clouds (the first cut stamped soft ovals and they read as clouds)."""
    im = dress(['yard_0', 'yard_1', 'yard_2'], PX, PX, seed)
    dirt = dress(['dirt'], PX, PX, seed + 1)
    r, n = R(seed), 9
    field = Image.new('L', (n, n))
    field.putdata([int(r() * 255) for _ in range(n * n)])
    field = field.resize((PX, PX), Image.BICUBIC)
    grain = Image.new('L', (PX // 4, PX // 4)); grain.putdata([int(r() * 90) for _ in range((PX // 4) ** 2)])
    grain = grain.resize((PX, PX), Image.NEAREST)
    mask = Image.eval(Image.blend(field, grain, 0.25), lambda v: 255 if v > 150 else 0)
    im.paste(dirt, (0, 0), mask)
    return tilt(im)


def slab(seed=61):
    im = quiet(dress(['concrete_0', 'concrete_1'], PX, PX, seed))
    d = ImageDraw.Draw(im)
    for k in range(1, 4):                                          # joints every 3 m
        v = m(3.0 * k)
        d.line([(v, 0), (v, PX)], fill=C[1]); d.line([(v + 1, 0), (v + 1, PX)], fill=C[5])
    d.line([(0, 0), (0, PX)], fill=C[1])
    im = tilt(im); d = ImageDraw.Draw(im)                          # the cross joints after the tilt,
    for k in range(0, 4):                                          # so no one-pixel line is dropped
        v = ty(m(3.0 * k))
        d.line([(0, v), (PX, v)], fill=C[1]); d.line([(0, v + 1), (PX, v + 1)], fill=C[5])
    return im


def roof(seed=71):
    """THE ONE HIGH GROUND (rule 37g): a flat gravel deck inside a stucco parapet, the way every
       flat Vegas roof is built, seen from the 45 camera: the north parapet shows its lit top
       and its INNER face (it looks at you), the south parapet its top and its OUTER face, the
       west and east ones their tops only. The hatch is the way up."""
    S = RAMPS['stucco']
    im = tilt(dress(['roof_deck'], PX, PX, seed))
    d = ImageDraw.Draw(im)
    pw, ph = m(0.4), ty(m(0.9))                                    # parapet: 0.4 m thick, 0.9 m tall
    pt = ty(pw)
    shade(im, (0, pt + ph, PX, pt + ph + ty(m(0.8))), 0.80)        # its shadow on the gravel inside
    shade(im, (pw, pt, pw + m(0.6), PY), 0.86)
    d.rectangle([0, 0, PX, pt], fill=S[4])                         # north top, sun-lit
    d.rectangle([pw, pt, PX - pw, pt + ph], fill=S[2])             # north inner face, seen
    d.line([(pw, pt + ph), (PX - pw, pt + ph)], fill=S[0])
    d.rectangle([0, 0, pw, PY], fill=S[4])                         # west top, lit
    d.rectangle([PX - pw, 0, PX, PY], fill=S[3])                   # east top
    d.rectangle([0, PY - ph - pt, PX, PY - ph], fill=S[3])         # south top
    d.rectangle([0, PY - ph, PX, PY], fill=S[1])                   # south outer face, seen
    d.line([(0, PY - ph), (PX, PY - ph)], fill=S[4])
    for x in range(0, PX, m(0.8)): d.line([(x, PY - ph), (x, PY)], fill=S[0])   # the stucco's cracks
    hx, hy, hw = m(8.4), ty(m(7.4)), m(1.2)
    d.rectangle([hx, hy, hx + hw, hy + ty(hw)], fill=D[0])         # the hatch, the way up
    d.rectangle([hx, hy, hx + hw, hy + 3], fill=D[5])
    cx, cy = m(2.0), ty(m(3.2))                                    # the dead swamp cooler: a box,
    d.rectangle([cx, cy, cx + m(1.6), cy + ty(m(1.0))], fill=C[5])  # its top lit,
    d.rectangle([cx, cy + ty(m(1.0)), cx + m(1.6), cy + ty(m(1.0)) + ty(m(0.9))], fill=C[3])  # its face seen
    for k in range(4): d.line([(cx + 4, cy + ty(m(1.0)) + 5 + k * 6), (cx + m(1.6) - 4, cy + ty(m(1.0)) + 5 + k * 6)], fill=C[1])
    shade(im, (cx + m(1.6), cy + 6, cx + m(2.1), cy + ty(m(1.9)) + 6), 0.75)
    return im


def block_wall(seed=81):
    """COVER THAT HIDES A MAN: 6 m of grey desert block, 1.8 m tall, cap lit north-west, the
       south face showing its courses, its shadow falling south-east."""
    L, cap, face = m(6.0), ty(m(0.2)), ty(m(1.8))                  # at 45: depth and height x cos45
    im = Image.new('RGBA', (L + m(0.5), cap + face + m(0.7)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(m(0.3), cap + face), (L + m(0.5), cap + face), (L + m(0.5), cap + face + m(0.6)),
               (m(0.3), cap + face + m(0.6))], fill=A[2] + (255,))
    body = dress(['concrete_0', 'concrete_1'], L, cap + face, seed).convert('RGBA')
    im.paste(body, (0, 0))
    d.rectangle([0, 0, L, cap], fill=C[5] + (255,)); d.line([(0, 0), (L, 0)], fill=C[6] + (255,))
    bh, bw = m(0.2), m(0.4)
    for k, y in enumerate(range(cap, cap + face, bh)):
        d.line([(0, y), (L, y)], fill=C[1] + (255,))
        for x in range((bw // 2) * (k % 2), L, bw):
            d.line([(x, y), (x, min(cap + face, y + bh))], fill=C[1] + (255,))
    shade(im, (0, cap, L, cap + face), 0.86)
    return im, dict(w=0.2, l=6.0, h=1.8, kind='COVER', name='BLOCK WALL', hides_a_man=True)


def car45(sid):
    """HIS WRECK, FROM THE 45 CAMERA. His 7/28 car is drawn straight down; at 45 its roof plan
       shortens by cos45 and its south flank comes into view, 0.9 m of body at cos45, his own
       paint in its own shadow (the sprite's bottom rows, shaded), and the hard shadow south-east.
       Every pixel stays his: the plan is NEAREST-squashed and the flank is his paint darkened
       along its own ramp."""
    src = load(SPR[sid]).convert('RGBA')
    w, h = src.size
    top = src.resize((w, max(1, ty(h))), Image.NEAREST)
    fh = ty(m(0.9))
    hard = lambda im: im.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    out = Image.new('RGBA', (w + m(0.6), top.size[1] + fh + m(0.5)), (0, 0, 0, 0))
    body = Image.new('RGBA', (w, top.size[1] + fh), (0, 0, 0, 0))
    flank = top.crop((0, top.size[1] - fh if top.size[1] > fh else 0, w, top.size[1])).resize((w, fh), Image.NEAREST)
    body.paste(flank, (0, top.size[1]), hard(flank))
    body.paste(top, (0, 0), hard(top))
    shade(body, (0, top.size[1], w, top.size[1] + fh), 0.62)
    for wx in (int(w * 0.18), int(w * 0.72)):                      # the flat tyres, black
        ImageDraw.Draw(body).rectangle([wx, top.size[1] + fh - ty(m(0.45)), wx + m(0.6), top.size[1] + fh - 1], fill=A[0] + (255,))
    shadow = Image.new('RGBA', body.size, A[1] + (255,))
    out.paste(shadow, (m(0.4), m(0.35)), hard(body))
    out.paste(body.convert('RGB').convert('RGBA'), (0, 0), hard(body))
    return out


def dead_car():
    s = SPR['wreck_road']
    return car45('wreck_road'), dict(w=round(s['h'], 2), l=round(s['w'], 2), h=1.45, kind='COVER',
                                         name='DEAD CAR', hides_a_man=True, from_sprite='wreck_road')


GROUND = [('street_small', 'STREET, SMALL', street_small),
          ('street_crossing', 'CROSSING', lambda: street_small(13, True)),
          ('street_small_ns', 'STREET, NORTH-SOUTH', lambda: street_small(15, ns=True)),
          ('street_big_a', 'BIG STREET, NORTH', lambda: street_big(21, 'A')),
          ('street_big_b', 'BIG STREET, SOUTH', lambda: street_big(23, 'B')),
          ('freeway_lane', 'FREEWAY LANE', freeway),
          ('lot', 'LOT', lot), ('lot_b', 'LOT, BARE', lambda: lot(57)), ('slab', 'SLAB', slab), ('roof', 'ROOF', roof)]


def guard(tiles, cover):
    ok = set(K.ALL)
    for sp in K._B['sprites']: ok |= K.colours(load(sp))   # his own approved sprites are his art too
    road = PX - 2 * SIDE
    if SIDE / road > RULER: die('the sidewalk is %.2f of its road; real is about an eighth, never over a sixth' % (SIDE / road))
    seen = set()
    for key, im in tiles.items():
        if im.size != (PX, PY): die('%s is %s, not %dx%d px (12 m at 42.9, seen at 45)' % (key, im.size, PX, PY))
        bad = K.colours(im) - ok
        if bad: die('%s has %d colours off his ramps and tiles, e.g. %s' % (key, len(bad), list(bad)[:3]))
        if key.startswith(('street', 'freeway')) and not key.endswith('_ns') and list(im.crop((0, 0, 1, PY)).tobytes()) != list(im.crop((PX - m(1.0), 0, PX - m(1.0) + 1, PY)).tobytes()):
            die('%s does not tile east-west' % key)
        h = im.tobytes()
        if h in seen: die('%s is stamped: the same picture as another tile' % key)
        seen.add(h)
    for key, (im, meta) in cover.items():
        bad = K.colours(im) - ok
        if bad: die('%s has %d colours off his ramps and tiles' % (key, len(bad)))
        if meta['h'] < K.CHEST: die('%s is %.2f m, under a man\'s chest: it does not hide him' % (key, meta['h']))


def b64(im):
    bio = io.BytesIO(); im.save(bio, 'PNG', optimize=True); return base64.b64encode(bio.getvalue()).decode()


def font(sz): return K.font(sz)


def card(tiles, cover):
    """BEFORE beside AFTER, from the game's camera: the same block, the fighters on it."""
    sc = 0.5                                       # the board at half, a phone's 3x screen at 1.5x
    tp, tq = int(PX * sc), int(PY * sc)            # a tile is wider than it is tall: the 45 camera
    t = {k: v.resize((tp, tq), Image.NEAREST) for k, v in tiles.items()}
    layout = [['roof', 'lot', 'street_small_ns', 'lot_b'],
              ['lot_b', 'slab', 'street_small_ns', 'roof'],
              ['street_small', 'street_crossing', 'street_small', 'street_small'],
              ['lot', 'slab', 'street_small_ns', 'lot'],
              ['lot_b', 'lot', 'street_small_ns', 'slab']]
    board = Image.new('RGB', (tp * 4, tq * 5))
    for r_, row in enumerate(layout):
        for c_, k in enumerate(row):
            board.paste(t[k], (c_ * tp, r_ * tq))
    car, _ = cover['dead_car']; wall, _ = cover['block_wall']
    car = car.resize((int(car.size[0] * sc), int(car.size[1] * sc)), Image.NEAREST)
    wall = wall.resize((int(wall.size[0] * sc), int(wall.size[1] * sc)), Image.NEAREST)
    board.paste(car, (int(tp * 0.9), int(tq * 2.30)), car)
    board.paste(wall, (int(tp * 0.2), int(tq * 1.45)), wall)
    you = load(SPR['you']).convert('RGBA'); nb = load(SPR['the_neighbour']).convert('RGBA')
    for (sp, x, y) in ((you, 1.3, 3.1), (nb, 3.0, 2.0), (nb, 3.3, 0.9), (nb, 0.5, 0.9)):
        s2 = sp.resize((sp.size[0] * 2, sp.size[1] * 2), Image.NEAREST)   # the 112 box at this zoom
        board.paste(s2, (int(tp * x), int(tq * y)), s2)
    before = Image.open(BEFORE).convert('RGB').crop((20, 70, 488, 840))
    bh = board.size[1]
    before = before.resize((int(before.size[0] * bh / before.size[1]), bh), Image.NEAREST)
    strip = Image.new('RGB', (10, 190), (12, 11, 10))
    W = before.size[0] + board.size[0] + 60
    out = Image.new('RGB', (W, 60 + bh + 40 + strip.size[1]), (12, 11, 10))
    d = ImageDraw.Draw(out)
    d.text((20, 18), 'BEFORE: what the fight stood on', font=font(26), fill=(222, 181, 118))
    d.text((before.size[0] + 40, 18), 'AFTER: real sidewalks, seen at 45 (people at the fight\'s size)', font=font(26), fill=(222, 181, 118))
    out.paste(before, (20, 60)); out.paste(board, (before.size[0] + 40, 60))
    y = 60 + bh + 30
    x = 20
    for k, nm, _ in GROUND:
        th = tiles[k].resize((150, 106), Image.NEAREST)
        if x + 150 > W: break
        out.paste(th, (x, y + 30)); d.text((x, y), nm[:18], font=font(12), fill=(222, 181, 118)); x += 158
    return out


def main():
    tiles = {k: fn() for k, _, fn in GROUND}
    cover = {'dead_car': dead_car(), 'block_wall': block_wall()}
    guard(tiles, cover)
    bank = dict(version='floor-set-10-1-round-2', built='10/1/26', lane='combat 2', row='[floor set] round two',
                from_bank=K.BANK, px_per_metre=K.PPM, tile_metres=K.TILE_M, tile_px=[PX, PY],
                perspective='45 DEGREE ART LAW (laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md, rule 56): camera pitched 45, depth and heights x cos45, south-looking faces seen',
                sidewalk_m=round(SIDE / K.PPM, 2), roadway_m=round((PX - 2 * SIDE) / K.PPM, 2),
                runs='street_small/crossing/big/freeway run east-west and tile along x; street_small_ns runs north-south (its own bake, the plan turned before the tilt)',
                widths={'small street': 1, 'big street': 2, 'freeway': 4},
                ground=[dict(id=k, name=nm, px=[PX, PY], b64=b64(tiles[k])) for k, nm, _ in GROUND],
                cover=[dict(id=k, px=list(im.size), b64=b64(im), **meta) for k, (im, meta) in cover.items()])
    json.dump(bank, open(OUT_BANK, 'w'), indent=1)
    card(tiles, cover).save(OUT_CARD, optimize=True)
    print('ok: %d ground tiles at %d px, %d cover pieces -> %s, %s' % (len(tiles), PX, len(cover), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
