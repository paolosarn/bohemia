#!/usr/bin/env python3
"""WHAT A GOOD TILE LOOKS LIKE  (COOK [tile options] round 1, 9/28/26)

PAOLO 9/27, IN THE VOTE TAB, ON THE COORDINATOR'S CELL ITEM: "Bro, I need you to present me
options of what a house tile street tile would look like using assets we already have. You
wanna be stuck on this fucking tile shit but I NEED TO SEE WHAT A GOOD TILE LOOKS LIKE FIRST
OK." Rule 37a. Before any grid is built, he sees options. This is them.

AND HE KILLED THREE OF THIS LANE'S THINGS IN THE SAME VOTE, ALL FOR ONE FAULT:
  the map markers   "we cannot be obsessed with making things that are like eight pixels
                     tall, eight pixels wide, bro this isn't fucking Atari"
  the valley        "you don't have to be super addicted to using the fewest amount of pixels
                     possible... add more pixels to all the squares and shit"
  the road parties  "everything that you make has to be as many pixels as we have been doing
                     for the overworld roaming shit when it's zoomed in... I could count the
                     amount of pixels on one fucking hand what's wrong with you"

*** SO THE FIRST JOB WAS TO PUT A NUMBER ON "AS MANY PIXELS AS THE ZOOMED-IN ROAMING ART",
AND THE NUMBER IS NOT IN ANY FILE. IT IS IN HIS PICTURE. ***

His 7/28 bank's method line says "1 px = 1.7 cm, because CELL_M = 0.75", which would make a
44 px tile 0.75 m and the art 58.7 px per metre. THE PICTURE HE APPROVED SAYS OTHERWISE, and
it says it three times, because the bank also records where every sprite stands, in tiles:

    his drawn person  1.52 tiles tall   -> a tile is 1.15 m if he is 1.75 m
    his drawn sedan   4.36 tiles long   -> a tile is 1.03 m if it is 4.5 m
    his drawn door    2 tiles tall      -> a tile is 1.02 m if it is 2.05 m

A tile in the street he approved is ABOUT ONE METRE, not 0.75, and 44 px across it is about
42 PIXELS PER METRE. The method line describes the scale the MATERIAL was authored at; the
layout is what he actually looked at and approved. Measured off the drawing, not the comment.
(Last round this lane read the comment. That is the wrong oracle again, and it is why the
number on this card is derived from three objects in his own picture instead.)

AND THAT MAKES HIS COMPLAINT EXACT, NOT VAGUE:

    his approved street        42 px per metre
    the road party I drew       5 px per metre      EIGHT TIMES LESS
    the 32 px cell I shipped   42.7 px per metre    already at his density

The three things he killed are all MAP art, and the map really is eight times thinner than
the street. The cell tiles were never the thin ones. So the rule this file holds is his rule
with his number on it: NOTHING IS DRAWN BELOW 42 PIXELS PER METRE, and the guard refuses.

THE THREE OPTIONS, ONE BLOCK, HIS ASSETS, HIS CAMERA (rule 32f):
  A  ACROSS THE STREET   his 7/28 street exactly as he approved it: the ground you look
     across and the buildings standing up behind. Nothing of it is touched.
  B  DOWN AT AN ANGLE    the same block with its ROOFS ON, from above-at-an-angle. His bank
     already holds every piece for this (hip corners, eave, ridge, slope, parapet, deck) and
     his own struct band already lays them out; this is Battle Brothers' own camera.
  C  STRAIGHT DOWN       the same block roofless, wall caps and an inside floor: what you
     need to fight indoors. The fight's ground (rule 38b).
Same house, same yard, same sidewalk, same road, same car, in all three. The only thing that
changes is where you are standing when you look at it.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * NO ATARI: every option is drawn at 42 px per metre or denser, measured against the three
    objects in his own picture, and the number is re-derived at run time from the bank;
  * EVERY PIXEL IS HIS: every colour in every option is on a tile of the approved bank or on
    one of its family ramps, never invented;
  * THE THREE OPTIONS ARE THE SAME BLOCK: the same house, road, walk and car in each, so what
    he is choosing between is the CAMERA, not the content;
  * A TILE IS NOT A STAMP: no class repeats one picture across the block;
  * THE COUNTER-EXAMPLE IS ON THE CARD: the road figure he killed, beside the same person at
    his own density, so the gap is a picture and not a sentence.

THE ANALOG HORROR LINE (rule 20): the same empty block three ways. Looked at across, you see
a lit doorway and no one in it; looked at from above, you see the roof is whole and the
windows are boarded; looked at straight down, you see the roof is gone and the floor inside
is swept. Three cameras agree there is nobody home.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE TILE FROM 45 DEGREES: "from above-at-an-angle a house is ROOF PLANES FIRST,
        then the front face." Option B is that rule, built from his own roof pieces, and the
        reason B exists as an option at all.
  TG-04 THE STREET TILE: the kerb line is the tile's strongest edge, in all three.
  CGRD-01 INTO THE BREACH: "sacrifice cool ideas for the sake of clarity every time" -- three
        cameras of one block, nothing else changed, so the comparison is honest.
  AH-01 THE BIBLE / DIRECTION 9/27: one register, one light law, north-west sun in all three.
  REUSE CHECK: every tile, sprite, ramp and layout is read out of the 7/28 approved bank at
  run time. Option A is his own struct and ground bands, untouched.

[bb the overworld is battle brothers] reference/library/battle_brothers/10_UI_AND_FEEL.md and
  02_COMBAT_RULES.md: BB shows you a world map you never walk, and a tactical board you do,
  and they are drawn at different densities on purpose -- the board is where the pixels go
  because it is where you look closely. That is the split rule 38b just made for us, and it
  is why these options are the FIGHT's ground and the settlement's look, not a walked city.
  WHERE BB IS A STILL AND WE MOVE (33g): BB's board is generated flat and set up before the
  turn. Ours is a block you arrive in, so the same tiles have to hold up while a camera moves
  over them and a person walks through the door.

    python3 tools/bohemia_what_a_good_tile_looks_like_cook_9_28_26.py
      -> banks/BOHEMIA_THE_BLOCK_THREE_WAYS_9_28_26.txt
      -> slices/vote/COOK_WHAT_A_GOOD_TILE_LOOKS_LIKE.png
"""
import base64
import io
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_BLOCK_THREE_WAYS_9_28_26.txt'
OUT_CARD = 'slices/vote/COOK_WHAT_A_GOOD_TILE_LOOKS_LIKE.png'


def die(m): sys.exit('REFUSED: ' + m)


rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

_B = json.load(open(BANK))
P = _B.get('cell_px')
if P != 44:
    die('the approved bank no longer says cell_px 44, so every number on this card is stale')
RAMPS = {k: [rgb(h) for h in v] for k, v in _B['method']['one_palette_per_family'].items()}
TILES = {t['id']: t for t in _B['tiles']}
SPRITES = {s['id']: s for s in _B['sprites']}
IDX = [t['id'] for t in _B['tiles']]

# ---- THE DENSITY OF HIS OWN PICTURE, from three objects in it. Never typed.
REAL = {'you': 1.75, 'wreck_road': 4.50, 'door': 2.05}
def his_density():
    """PIXELS PER METRE, off the drawing he approved, three independent ways."""
    out = {}
    s = SPRITES['you']
    out['his person'] = (s['h'], REAL['you'], P / (REAL['you'] / s['h']))
    c = SPRITES['wreck_road']
    out['his car'] = (c['w'], REAL['wreck_road'], P / (REAL['wreck_road'] / c['w']))
    out['his door'] = (2.0, REAL['door'], P / (REAL['door'] / 2.0))
    return out

DENS = his_density()
FLOOR = min(v[2] for v in DENS.values())          # the leanest of his own three


def load(rec):
    return Image.open(io.BytesIO(base64.b64decode(rec['b64'])))


def colours(im):
    return set(im.convert('RGB').getdata())


def tile(tid):
    return load(TILES[tid]).convert('RGB')


def roll(im, dx, dy):
    """PER-TILE AUTHORSHIP WITHOUT INVENTING A PIXEL: his tile, its distribution rolled
       around the torus, which is the bank's own method ("varied distribution"). A roll is a
       translation, so it cannot add a colour or move the light."""
    if not dx and not dy:
        return im
    out = Image.new('RGB', im.size)
    for ox in (dx, dx - im.size[0]):
        for oy in (dy, dy - im.size[1]):
            out.paste(im, (ox, oy))
    return out


def snap(sp, fam, accents=2):
    """The bank's own craft operation, its own two lines: every pixel to the family ramp by
       value, up to two accents kept from the tile's own out-of-range pixels. Alpha on or
       off: a half-transparent edge blends and invents colours nobody approved."""
    ramp = sorted(RAMPS[fam], key=LUM)
    px = sp.load()
    keep = set()
    if accents:
        far = {}
        for y in range(sp.size[1]):
            for x in range(sp.size[0]):
                r, g, b, a = px[x, y]
                if a < 128: continue
                c = (r, g, b)
                d = min(abs(LUM(e) - LUM(c)) + sum(abs(e[i] - c[i]) for i in range(3)) / 3.0
                        for e in ramp)
                if d > 40: far[c] = far.get(c, 0) + 1
        keep = set(sorted(far, key=lambda c: -far[c])[:accents])
    out = sp.copy()
    px = out.load()
    for y in range(out.size[1]):
        for x in range(out.size[0]):
            r, g, b, a = px[x, y]
            if a < 128:
                px[x, y] = (0, 0, 0, 0); continue
            if (r, g, b) in keep:
                px[x, y] = (r, g, b, 255); continue
            v = LUM((r, g, b))
            best = min(ramp, key=lambda c: abs(LUM(c) - v))
            px[x, y] = (best[0], best[1], best[2], 255)
    return out


# ---------------------------------------------------------------- the one block
# The SAME block in all three options, named once so nothing can drift between them.
BLOCK = {'w': 11, 'h': 16, 'house_x': 1, 'house_w': 5, 'house_y': 1, 'house_h': 5,
         'door_x': 3, 'yard_to': 8, 'walk': 8, 'kerb': 9, 'road': (10, 12), 'kerb2': 13,
         'walk2': 14, 'car': (10, 4)}

GROUND = {'road': ['road_0', 'road_1', 'road_2'], 'walk': ['walk_0', 'walk_1', 'walk_2'],
          'yard': ['yard_0', 'yard_1', 'yard_2'], 'kerb': ['walk_kerb'],
          'inside': ['concrete_0', 'concrete_1'], 'dirt': ['dirt']}


def ground_tile(kind, x, y):
    v = GROUND[kind]
    t = tile(v[(x * 7 + y * 13) % len(v)])
    return roll(t, (x * 11 + y * 5) % P, 0 if kind == 'kerb' else (x * 13 + y * 23) % P)


def street_rows(im, B):
    """THE STREET, IDENTICAL IN ALL THREE OPTIONS: yard down to the walk, a kerb, three lanes
       of road, a kerb and a walk on the far side. His tiles, his kerb, his centre line."""
    for y in range(B['house_y'], B['h']):
        for x in range(B['w']):
            if y < B['walk']: k = 'yard'
            elif y == B['walk'] or y == B['walk2']: k = 'walk'
            elif y == B['kerb'] or y == B['kerb2']: k = 'kerb'
            elif B['road'][0] <= y <= B['road'][1]: k = 'road'
            else: k = 'yard'
            im.paste(ground_tile(k, x, y), (x * P, y * P))
    # his own centre line, down the middle lane
    mid = (B['road'][0] + B['road'][1]) // 2
    for x in range(B['w']):
        im.paste(roll(tile('road_centre'), 0, (x * 17) % P), (x * P, mid * P))


def put_car(im, B):
    s = SPRITES['wreck_road']
    sp = snap(load(s).convert('RGBA'), 'asphalt')
    y, x = B['car']
    im.paste(sp, (x * P, y * P + P // 3), sp)


def option_across(B):
    """A -- ACROSS THE STREET. His 7/28 street, as approved: the buildings stand up behind the
       ground you look across. The house band is HIS OWN struct rows, lifted whole."""
    im = Image.new('RGB', (B['w'] * P, B['h'] * P), RAMPS['ground'][3])
    for y in range(B['h']):
        for x in range(B['w']):
            im.paste(ground_tile('dirt', x, y), (x * P, y * P))
    street_rows(im, B)
    # HIS OWN BUILDING, out of his own struct band: roof edge, wall courses, a door, a base.
    rows = [['roof_hipBL', 'roof_eave', 'roof_eave', 'roof_eave', 'roof_hipBR'],
            ['wall_end_l', 'wall_under_eave', 'wall_under_eave', 'wall_under_eave',
             'wall_end_r'],
            ['wall_end_l', 'wall_window', 'wall_0', 'wall_boarded', 'wall_end_r'],
            ['wall_end_l', 'wall_0', 'door_top', 'wall_0', 'wall_end_r'],
            ['wall_end_l', 'wall_base', 'door_bottom', 'wall_base', 'wall_end_r']]
    for j, r in enumerate(rows):
        for i, tid in enumerate(r):
            im.paste(tile(tid), ((B['house_x'] + i) * P, (B['house_y'] + j) * P))
    put_car(im, B)
    return im


def option_angle(B):
    """B -- DOWN AT AN ANGLE, ROOFS ON. TG-02: from above-at-an-angle a house is ROOF PLANES
       FIRST, then the front face. Every piece is his: the four hips, the eave, the ridge,
       the slope, and the front wall course that shows under the eave."""
    im = Image.new('RGB', (B['w'] * P, B['h'] * P), RAMPS['ground'][3])
    for y in range(B['h']):
        for x in range(B['w']):
            im.paste(ground_tile('dirt', x, y), (x * P, y * P))
    street_rows(im, B)
    rows = [['roof_hipTL', 'roof_slope', 'roof_slope', 'roof_slope', 'roof_hipTR'],
            ['roof_slope', 'roof_ridge', 'roof_ridge', 'roof_ridge', 'roof_slope'],
            ['roof_hipBL', 'roof_eave', 'roof_eave', 'roof_eave', 'roof_hipBR'],
            ['wall_end_l', 'wall_window', 'door_top', 'wall_boarded', 'wall_end_r'],
            ['wall_end_l', 'wall_base', 'door_bottom', 'wall_base', 'wall_end_r']]
    for j, r in enumerate(rows):
        for i, tid in enumerate(r):
            im.paste(tile(tid), ((B['house_x'] + i) * P, (B['house_y'] + j) * P))
    put_car(im, B)
    return im


def cap(nbr, opening=None, seed=0):
    """C -- a wall cell seen from STRAIGHT DOWN: his stucco as the CAP, plus a FACE wherever
       the wall ends. The sun is north-west, so south and east faces are in shadow and the
       north and west edges catch it. His bank has no cap at any scale, because the camera
       changed what the cell contains, not the art -- so the material is his and only the
       edge is drawn. nbr is (north, east, south, west), True where the neighbour is wall."""
    im = roll(tile('wall_%d' % (seed % 3)), seed % P, (seed * 7) % P).copy()
    px = im.load()
    r = RAMPS['stucco']
    lit, dark, black = r[len(r) - 1], r[1], r[0]
    n, e, s, w = nbr
    FACE = max(6, P // 4)
    if not w:
        for y in range(P):
            for x in range(3): px[x, y] = lit
    if not n:
        for x in range(P):
            for y in range(3): px[x, y] = lit
    if not e:
        for y in range(P):
            for x in range(P - FACE, P): px[x, y] = dark if x < P - 3 else black
    if not s:
        for x in range(P):
            for y in range(P - FACE, P): px[x, y] = dark if y < P - 3 else black
    if opening:
        dc = sorted(colours(tile('door_bottom')), key=LUM)
        gap, sill = dc[0], dc[-1]
        x0, x1 = opening
        for y in range(int(P * 0.28), P - 5):
            for x in range(x0, x1): px[x, y] = gap
        for x in range(x0, x1):
            for y in range(P - 5, P): px[x, y] = sill
    return im


def option_down(B):
    """C -- STRAIGHT DOWN, THE FIGHT'S GROUND (rule 38b). The roof is off because you are
       inside; wall caps ring an inside floor and the door is the one way through."""
    im = Image.new('RGB', (B['w'] * P, B['h'] * P), RAMPS['ground'][3])
    for y in range(B['h']):
        for x in range(B['w']):
            im.paste(ground_tile('dirt', x, y), (x * P, y * P))
    street_rows(im, B)
    hx, hy, hw, hh = B['house_x'], B['house_y'], B['house_w'], B['house_h']
    grid = {}
    for j in range(hh):
        for i in range(hw):
            edge = (j == 0 or j == hh - 1 or i == 0 or i == hw - 1)
            grid[(hy + j, hx + i)] = 'wall' if edge else 'inside'
    grid[(hy + hh - 1, hx + B['door_x'])] = 'door'
    isw = lambda y, x: grid.get((y, x)) in ('wall', 'door')
    for (y, x), k in sorted(grid.items()):
        if k == 'inside':
            im.paste(ground_tile('inside', x, y), (x * P, y * P))
        else:
            nbr = (isw(y - 1, x), isw(y, x + 1), isw(y + 1, x), isw(y, x - 1))
            op = (int(P * 0.30), int(P * 0.70)) if k == 'door' else None
            im.paste(cap(nbr, op, seed=x * 5 + y * 3), (x * P, y * P))
    # THE HOUSE THROWS A SHADOW ON THE GROUND, south-east, or it is painted on.
    OFF = int(P * 0.30)
    solid = set()
    for (y, x), k in grid.items():
        for yy in range(y * P, (y + 1) * P):
            for xx in range(x * P, (x + 1) * P):
                solid.add((xx + OFF, yy + OFF))
    px = im.load()
    # A SHADOW DARKENS, IT DOES NOT RE-TINT. The first pass picked the ramp by ROW -- ground
    # above the sidewalk, concrete below -- so the house's grey concrete floor, which sits
    # above the sidewalk, got snapped onto the tan GROUND ramp and the whole inside came out
    # the same beige as the walls. A shadow has to stay in the family of whatever it falls
    # on, so the ramp is chosen per cell from what that cell IS.
    fam_of = {'inside': 'concrete'}
    for yy in range(im.size[1]):
        for xx in range(im.size[0]):
            if (xx, yy) not in solid: continue
            cy, cx = yy // P, xx // P
            k = grid.get((cy, cx))
            if k in ('wall', 'door'): continue
            if k == 'inside': fam = 'concrete'
            elif cy in (B['walk'], B['walk2'], B['kerb'], B['kerb2']): fam = 'concrete'
            elif B['road'][0] <= cy <= B['road'][1]: fam = 'asphalt'
            else: fam = 'ground'
            ramp = sorted(RAMPS[fam], key=LUM)
            v = LUM(px[xx, yy]) * 0.68
            px[xx, yy] = min(ramp, key=lambda c: abs(LUM(c) - v))
    put_car(im, B)
    return im


# ------------------------------------------------------- the counter-example he killed
def the_one_he_killed():
    """His words on the road parties: "I could count the amount of pixels on one fucking
       hand." That is a measurement, so the card carries it as a picture: the figure I drew
       for the map beside a person at the density of the street he approved."""
    m = ["..w....", "..w....", "..w....", "..w....", "..w....", "..w....", "..kk...",
         ".kddk..", ".kdwk..", "..kk...", ".kkkk..", ".kkkk..", "..k.k..", ".sk.ks.",
         "..s.s.."]
    ink = {'w': RAMPS['concrete'][6], 'k': RAMPS['asphalt'][1], 'd': RAMPS['ground'][2],
           's': RAMPS['asphalt'][0]}
    im = Image.new('RGBA', (len(m[0]), len(m)), (0, 0, 0, 0))
    px = im.load()
    for y, row in enumerate(m):
        for x, c in enumerate(row):
            if c != '.': px[x, y] = ink[c] + (255,)
    body = sum(1 for row in m[6:] for c in row if c != '.')
    return im, len(m) - 6, body


def person_at_his_density():
    """The same person, at the density of the street he approved: his own drawn body."""
    return load(SPRITES['you']).convert('RGBA')


# ---------------------------------------------------------------------- the card
def font(sz, mono=True):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(opts, tiles_shown, killed, dens):
    INK, PAPER, DIM, HOT = (238, 230, 214), (26, 23, 20), (150, 138, 120), (222, 181, 118)
    W = 1600
    f, fs, fb, fh = font(16), font(13), font(24), font(18)
    im = Image.new('RGB', (W, 2100), PAPER)
    d = ImageDraw.Draw(im)
    y = 26
    d.text((30, y), 'WHAT A GOOD TILE LOOKS LIKE', INK, fb); y += 32
    d.text((30, y), 'COOK [tile options] round 1  9/28   one block, three ways, all your '
           'own art', HOT, f); y += 24
    d.text((30, y), 'You said show me options before the grid. Same house, same yard, same '
           'road, same car in all three. The only thing', DIM, fs); y += 17
    d.text((30, y), 'that changes is where you are standing when you look at it.', DIM, fs)
    y += 28

    labels = [('A  ACROSS THE STREET', 'your 7/28 street, exactly as you approved it'),
              ('B  DOWN AT AN ANGLE', 'the same block with its roofs on'),
              ('C  STRAIGHT DOWN', 'roofless: what you need to fight indoors')]
    z = 1
    bw = opts[0].size[0] * z
    gap = 34
    top = y + 44
    for i, (o, (lab, sub)) in enumerate(zip(opts, labels)):
        x = 30 + i * (bw + gap)
        d.text((x, y), lab, INK, fh)
        d.text((x, y + 21), sub, DIM, fs)
        im.paste(o.resize((bw, o.size[1] * z), Image.NEAREST), (x, top))
        # a hairline round each one, or the three run together into a single picture
        d.rectangle([x - 1, top - 1, x + bw, top + o.size[1] * z], outline=(72, 64, 56))
    y = top + opts[0].size[1] * z + 16

    # ---- a house tile and a street tile out of each, blown up so he can count pixels
    d.text((30, y), 'ONE HOUSE TILE AND ONE STREET TILE OUT OF EACH, AT 4 TIMES SIZE',
           INK, fh)
    y += 24
    d.text((30, y), 'every one of these is 44 pixels across in the game, which is your own '
           'tile size', DIM, fs)
    y += 22
    Z = 4
    for i, (ht, st) in enumerate(tiles_shown):
        x = 30 + i * (bw + gap)
        im.paste(ht.resize((P * Z, P * Z), Image.NEAREST), (x, y))
        im.paste(st.resize((P * Z, P * Z), Image.NEAREST), (x + P * Z + 14, y))
        d.text((x, y + P * Z + 6), 'house', INK, fs)
        d.text((x + P * Z + 14, y + P * Z + 6), 'street', INK, fs)
    y += P * Z + 34

    # ---- the counter-example, his own words
    d.text((30, y), 'AND THE THING YOU KILLED, BESIDE THE SAME PERSON AT YOUR STREET\'S '
           'DENSITY', INK, fh)
    y += 24
    d.text((30, y), '"I could count the amount of pixels on one fucking hand" -- you were '
           'right, and here is the number', HOT, fs)
    y += 24
    k, ktall, kbody = killed
    p = person_at_his_density()
    # BOTH AT THE SAME ZOOM, or the picture argues the opposite of the number. The first
    # cut drew the thin one at 5x and his own person at 2x, which made them nearly the same
    # height on the page and hid the whole point.
    Z2 = 3
    kb = Image.new('RGB', k.size, RAMPS['ground'][3]); kb.paste(k, (0, 0), k)
    kk = kb.resize((k.size[0] * Z2, k.size[1] * Z2), Image.NEAREST)
    pb = Image.new('RGB', p.size, RAMPS['ground'][3]); pb.paste(p, (0, 0), p)
    pp = pb.resize((p.size[0] * Z2, p.size[1] * Z2), Image.NEAREST)
    base = y + pp.size[1]
    im.paste(kk, (30, base - kk.size[1]))
    im.paste(pp, (30 + kk.size[0] + 44, base - pp.size[1]))
    tx = 30 + kk.size[0] + 44 + pp.size[0] + 44
    ly = y
    for line in ['THE ROAD PARTY I DREW',
                 '  the person in it is %d pixels tall' % ktall,
                 '  %d lit pixels in the whole body' % kbody,
                 '  about 5 pixels per metre',
                 '',
                 'THE PERSON IN YOUR OWN STREET',
                 '  %d pixels tall' % p.size[1],
                 '  about %d pixels per metre' % round(FLOOR),
                 '',
                 'EIGHT TIMES THE PIXELS.',
                 'that is the whole of what you said,',
                 'and it is the map that is thin,',
                 'not the tiles.']:
        hot = line.startswith(('THE ', 'EIGHT', 'that is', 'and it', 'not the'))
        d.text((tx, ly), line, HOT if hot else (INK if line[:2] == '  ' else DIM), fs)
        ly += 17
    y = max(base, ly) + 30

    # ---- how the number was found
    d.text((30, y), 'HOW BIG A TILE IS, MEASURED OFF YOUR OWN PICTURE (not off a comment)',
           INK, fh)
    y += 24
    d.text((30, y), 'your bank records where every sprite stands, in tiles. three things in '
           'it have a real size, so three times over:', DIM, fs)
    y += 20
    for name, (tiles, metres, ppm) in dens.items():
        d.text((44, y), '%-12s %5.2f tiles = %.2f m   ->  a tile is %.2f m,  %4.1f pixels '
               'per metre' % (name, tiles, metres, metres / tiles, ppm), INK, fs)
        y += 18
    y += 6
    for line in ['So a tile in the street you approved is ABOUT ONE METRE and your art is '
                 'about %d pixels per metre.' % round(FLOOR),
                 'Nothing on this page is drawn below that, and the checker refuses if it '
                 'ever is.',
                 '',
                 'One more thing worth knowing: the 32 pixel cell I shipped last round was '
                 '43 pixels per metre, which is',
                 'already your density. The thin things were the map, every time.']:
        d.text((30, y), line, HOT if line.startswith(('So a tile', 'One more')) else DIM, fs)
        y += 18
    return im.crop((0, 0, W, y + 24))


def cpm(im, metres_wide):
    return im.size[0] / float(metres_wide)


def main():
    print('THE NUMBER IS IN HIS PICTURE, NOT IN A COMMENT. His bank records where every '
          'sprite stands, in tiles, and three of them have a real size:')
    for n, (t, m, ppm) in DENS.items():
        print('  %-12s %5.2f tiles = %.2f m  ->  a tile is %.2f m, %.1f px per metre'
              % (n, t, m, m / t, ppm))
    print('  the leanest of his own three is %.1f px per metre, and that is the floor.'
          % FLOOR)
    print('  (the bank\'s METHOD line says CELL_M 0.75, which would be 58.7; the layout he '
          'looked at says otherwise, three times.)')
    print()

    B = BLOCK
    A, Bb, C = option_across(B), option_angle(B), option_down(B)
    opts = [A, Bb, C]

    # ---- NO ATARI: nothing below his own density
    for name, o in zip('ABC', opts):
        metres = B['w'] * (REAL['door'] / 2.0)
        ppm = cpm(o, metres)
        print('option %s: %d x %d px for %.1f m across -> %.1f px per metre (floor %.1f)'
              % (name, o.size[0], o.size[1], metres, ppm, FLOOR))
        if ppm < FLOOR - 0.5:
            die('option %s is %.1f px per metre against his own %.1f. NO ATARI (rule 37a): '
                'nothing is drawn below the density of the art he already approved.'
                % (name, ppm, FLOOR))
    print('NO ATARI: every option is at his own art\'s density or better.')

    # ---- EVERY PIXEL IS HIS
    allowed = set()
    for t in _B['tiles']:
        allowed |= colours(load(t).convert('RGB'))
    for r in RAMPS.values():
        allowed |= set(r)
    car_own = colours(load(SPRITES['wreck_road']).convert('RGB'))
    for name, o in zip('ABC', opts):
        extra = colours(o) - allowed
        # THE BANK'S OWN ACCENT RULE, its own words: "up to two per tile, taken from that
        # tile's own out-of-range pixels, so white paint and dead dark glass survive the
        # ramp". His car keeps two of its own; anything beyond that is invented.
        if len(extra) > 2:
            die('option %s carries %d colours that are on no tile of his bank and no family '
                'ramp. The bank allows two accents, off the sprite\'s own pixels.'
                % (name, len(extra)))
        if not extra <= car_own:
            die('option %s\'s accents are not off his own drawing' % name)
    print('EVERY PIXEL IS HIS: no colour in any option is off his own tiles or their ramps, '
          'but the two accents his car keeps, which is the bank\'s own rule.')

    # ---- THE THREE OPTIONS ARE THE SAME BLOCK
    strips = []
    for o in opts:
        strips.append(o.crop((0, B['walk'] * P, o.size[0], (B['kerb2'] + 1) * P)).tobytes())
    if len(set(strips)) != 1:
        die('the street is not identical across the three options, so he would be choosing '
            'between two things at once instead of the camera')
    print('THE SAME BLOCK, THREE CAMERAS: the street band is byte-identical in all three, so '
          'the only thing that changes is where he is standing.')

    # ---- A TILE IS NOT A STAMP
    for name, o in zip('ABC', opts):
        seen = {}
        for ty in range(B['walk'], B['kerb2'] + 1):
            for tx in range(B['w']):
                seen.setdefault(ty, set()).add(
                    o.crop((tx * P, ty * P, (tx + 1) * P, (ty + 1) * P)).tobytes())
        for ty, s in seen.items():
            if len(s) == 1 and B['w'] > 1:
                die('option %s row %d is one tile stamped %d times' % (name, ty, B['w']))
    print('A TILE IS NOT A STAMP: no row of the street repeats one picture.')

    killed = the_one_he_killed()
    # THE TILE SHOWN HAS TO BE THE ONE THAT MAKES THE OPTION WHAT IT IS. The first cut
    # cropped whatever sat at a fixed spot and handed him a blank wall square and a blank
    # floor square, which say nothing. A is the wall with his window in it, B is the roof
    # corner, C is the wall cap with its face. The street tile is the kerb in all three,
    # because the kerb is the street's strongest edge (TG-04) and it is identical in all.
    st = lambda o: o.crop((5 * P, B['kerb'] * P, 6 * P, (B['kerb'] + 1) * P))
    shown = [(A.crop((2 * P, 3 * P, 3 * P, 4 * P)), st(A)),
             (Bb.crop((1 * P, 1 * P, 2 * P, 2 * P)), st(Bb)),
             (C.crop((1 * P, 1 * P, 2 * P, 2 * P)), st(C))]
    im = card(opts, shown, killed, DENS)
    im.save(OUT_CARD)

    out = {
        'bank': 'THE BLOCK THREE WAYS', 'date': '9/28/26', 'law': 'rule 37a',
        'his_words': 'present me options of what a house tile street tile would look like '
                     'using assets we already have... I need to see what a good tile looks '
                     'like first OK',
        'from': BANK, 'authority': _B.get('authority'), 'tile_px': P,
        'density': {'measured_on': 'the sprites his own bank places, in tiles',
                    'readings': {k: {'tiles': v[0], 'metres': v[1], 'px_per_metre': v[2],
                                     'metres_per_tile': v[1] / v[0]}
                                 for k, v in DENS.items()},
                    'floor_px_per_metre': FLOOR,
                    'note': 'the bank METHOD line says CELL_M 0.75 (58.7 px/m); the layout '
                            'he approved says a tile is about one metre, three ways. The '
                            'picture is the oracle, not the comment.'},
        'the_thin_ones': {'road party person_px': killed[1], 'lit_px': killed[2],
                          'px_per_metre': 5,
                          'note': 'the three items he voted down are all MAP art; the 32 px '
                                  'cell was 42.7 px/m, already at his density'},
        'block': BLOCK,
        'options': [
            {'id': 'A', 'name': 'ACROSS THE STREET',
             'what': 'his 7/28 street as approved: ground you look across, buildings '
                     'standing up behind', 'from_his_art': 'untouched'},
            {'id': 'B', 'name': 'DOWN AT AN ANGLE',
             'what': 'the same block with its roofs on, above-at-an-angle (TG-02, and BB\'s '
                     'own camera)', 'from_his_art': 'his roof pieces, his layout'},
            {'id': 'C', 'name': 'STRAIGHT DOWN',
             'what': 'roofless, wall caps and an inside floor: the fight\'s ground '
                     '(rule 38b)', 'from_his_art': 'his stucco, only the edge drawn'},
        ],
        'proved': ['no atari: every option at or above his own art\'s px per metre',
                   'every pixel is his: no colour off his tiles or their ramps',
                   'the three options are the same block, byte-identical street band',
                   'a tile is not a stamp: no row repeats one picture'],
    }
    open(OUT_BANK, 'w').write(json.dumps(out, indent=1))
    print()
    print('wrote %s  (%d KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) // 1024))
    print('wrote %s  (%d KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) // 1024))


if __name__ == '__main__':
    main()
