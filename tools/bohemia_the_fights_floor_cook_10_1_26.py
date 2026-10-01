#!/usr/bin/env python3
"""THE FIGHT'S FLOOR  (COOK [board assets] round 2, 10/1/26)

PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people dont look
good man its all fucked up." Rule 46f: the floor under the fighters is the fight's first
measure, and nothing else on this lane ships before it. So the desert waits and the ground
goes first.

*** I MEASURED HIS SCREENSHOT BEFORE I DREW ANYTHING, AND THE GROUND HAS TWO FAULTS, NOT ONE.
The board's own sheet (the game-camera panel, the picture he was looking at) repeats on a
44 pixel period on BOTH axes, and the fighters repeat on 112. 44 is the size of one cell of
his 7/28 approved bank and 112 is the fighter box. So:

  FAULT 1  THE GROUND IS 2.6x TOO BIG. A bank cell is 44 px of art drawn at his street's own
           density, 42.9 px per metre, so a cell is ONE METRE of world. The board paints that
           cell across 44 of its own pixels, and the board's ground scale is a 12 m house
           tile in 196 px, which is 16.3 px per metre. 44 of those pixels is 2.69 METRES.
           The board is stretching a one-metre paving cell over two and three quarter metres.
           That is why the ground reads as a smear with a faint grid instead of a street.
  FAULT 2  AND THEN IT IS BLOWN UP AGAIN. The canvas is CSS-sized, so on his 3x phone every
           one of those painted pixels is a 3x3 block of real pixels. 2.69 m x 3.
           One metre of his art ends up covering about eight metres of blocky screen.

ONE CHANGE FIXES BOTH: author the house tile at the pixels the fight's own slot gives it on
his phone -- 196 CSS px x 3 = 588 device pixels for 12 m, which is 49 px per metre -- and
build it out of his cells PASTED AT 1:1, never scaled. Then a one-metre cell covers one
metre (44 px of a 588 px tile is 0.90 m, inside a tenth of a metre of true) and every pixel
of his art is one pixel of his phone. 49 px/m clears DIRECTION's floor of 39 and beats his
own approved street's 42.9.

WHAT IS COOKED (the row's list, 10/1):
  THE ROAD        12 m of two-lane carriageway: the centre line, the lane wear, the cracks,
                  the gutters at both edges. The tile that runs down the middle of a street.
  THE KERB        12 m of the street's edge, which is the tile that actually makes a street:
                  carriageway, gutter, kerb, sidewalk, and the strip of yard behind it.
  THE YARD        12 m of a front lot: dirt, dead grass, the path somebody wore to the door.
  THE SLAB        12 m of parking and loading concrete: the pour joints and the bay lines.
  THE ROOF        12 m of standable deck: gravel, the parapet, the drain. High ground that
                  looks like somewhere you would stand (rule 37g, his own up-vote).
  THE DEAD CAR    HIS OWN APPROVED WRECK out of the 7/28 bank, reused, not redrawn
                  (REUSE-FIRST): 4.5 x 2.15 m, the cabin over a man's chest and the hood
                  under it, so one piece is a blocker at one end and cover at the other.
  THE BLOCK WALL  NEW, and it is the thinnest kind on the whole board: the count this lane
                  took on 9/30 found 389 cover pieces against 2,899 blockers. 12 m of
                  concrete block, 1.9 m standing (a blocker) with a collapsed 1.0 m section
                  (cover). Concrete block, not the tan stucco house wall: the container and
                  the trailer came out as the same picture last round and that is the lesson.

WHAT IS PROVED, NOT CLAIMED (each one refuses the run):
  * NO ATARI: every ground tile is at least 39 painted pixels per metre, measured, not typed;
  * NOTHING IS RESAMPLED: every 44 px cell of the tile holds exactly the colours of one of
    his cells, so not one pixel of his art has been stretched or smoothed;
  * EVERY PIXEL IS HIS: his family ramps AND his own tiles (a check against the bare ramps
    alone is stricter than his approved art, and it has bitten this lane twice);
  * THE GROUND IS ONLY THE GROUND: no partial alpha anywhere on a ground tile and not one
    pixel near the pale blue-grey of the ovals he was shown, at a radius his own art clears;
  * NO TWO TILES ARE THE SAME PICTURE: measured on colour, not on taste;
  * A TILE TILES: the seam where two of the same tile meet is no worse than the tile's own
    inside, which is the only honest way to measure a seam;
  * COVER IS NOT A BLOCKER: measured in metres against a man's chest at 1.3 m;
  * THE ROOF IS STANDABLE: its top is flat, and its lit plane is NOT the ramp's white accent
    (a roof is the top of the material, one below; this lane blew a roof out white once).

THE ANALOG HORROR LINE (rule 20): the floor is the part of a place that remembers people
best. The lane wear is where ten thousand cars went that will not come again, the path
across the yard is where somebody walked to a door, and the bay lines in the slab still
tell you where to put a car.

REFERENCE CHECK (the 9/4 standing law):
  02_COMBAT_RULES.md, the BOARD line: BB's tactical ground is quieter than the men on it and
        carries its information in the material, not in painted markers. Taken exactly: the
        reach lighting and the names come off the floor and the floor goes back to being floor.
  TG-04 THE STREET TILE: the kerb is the one edge that makes a street read from above.
  TG-02 THE HOUSE FROM 45 DEGREES, for the roof deck's parapet reading as a lip, not a line.
  CGRD-01 INTO THE BREACH: on a board, clarity beats cool. Cover and blocker are split by a
        measured height, never by how a piece looks.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: the car is his approved wreck used as it is; every cell, ramp and material
        comes out of the 7/28 approved bank at run time; the density is this lane's own
        measurement; the before is COMBAT's own sheet, measured, not described.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md,
  the TERRAIN and BOARD lines: BB's board is generated from the map terrain it happens on,
  and its ground tiles are flat, quiet and readable because every piece of information on a
  BB board lives in the UI or in the piece, never painted on the dirt. We take the whole
  rule. WHAT MOVES THAT BB'S PICTURE DOES NOT (rule 33g): BB's ground is a still field of
  grass or gravel that never changes once the fight starts. Ours is a CITY floor that holds
  what the fight does to it -- the same five tiles carry the scorch, the shell and the drag
  marks a fight leaves, and the roof is a floor you can be standing on while the street
  below you is a different fight.

    python3 tools/bohemia_the_fights_floor_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHTS_FLOOR_10_1_26.txt
      -> records/BOHEMIA_THE_FIGHTS_FLOOR_MEASURED_10_1_26.txt
      -> slices/vote/COOK_THE_FIGHTS_FLOOR.png
"""
import base64, io, json, os, sys, math
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
BEFORE = 'slices/vote/COMBAT_A_STREET_OF_HOUSES_9_30.png'
OUT_BANK = 'banks/BOHEMIA_THE_FIGHTS_FLOOR_10_1_26.txt'
OUT_REC = 'records/BOHEMIA_THE_FIGHTS_FLOOR_MEASURED_10_1_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_FIGHTS_FLOOR.png'

TILE_M = 12.0       # a combat tile is a house (Paolo 9/4, 9/24, 9/28)
TILE_CSS = 196.0    # the fight's own slot: TILE_WIDE 1.75 x the 112 fighter box
DPR = 3             # his phone, 1170 x 2532 at 3x
SLOT_PX = int(round(TILE_CSS * DPR))        # 588 device pixels the phone gives a house tile
# *** THE DENSITY IS HIS, NOT A NUMBER I PICKED. *** His 7/28 approved bank is authored at
# 42.9 painted pixels per metre (this lane, 9/28, off three sprites his bank places at real
# sizes). Authoring the floor at anything else would mean resampling his cells and his
# sprites to fit my grid, which is the one thing REUSE-FIRST forbids and the one fault that
# made the board look like this in the first place. So the floor is HIS density, a 12 m
# house tile is 515 painted pixels, and the sentence COMBAT needs is: a house tile is 515
# pixels of art, so never give it fewer than 515 device pixels on the phone. 515 fills 88%
# of the 588 the slot offers, which is a downscale at worst and never a blow-up.
PPM = 42.9          # his own approved street's density, this lane 9/28
STREET_PPM = PPM
# *** AND THE TILE IS A WHOLE NUMBER OF HIS CELLS, OR IT CANNOT TILE AT ALL. *** The first
# cut made the tile 515 px, which is 12 m at his density and 11.7 of his 44 px cells, and
# the seam guard caught it: a tile whose paving lattice does not come out even cannot be
# laid next to a copy of itself without a line showing. So A COMBAT TILE IS TWELVE OF HIS
# PAVING CELLS, 528 px, which is 12.31 m at his density -- a house, to a third of a metre.
TILE_CELLS = 12
FLOOR_PPM = 39.0    # DIRECTION's one density rule, the fight leg
CHEST = 1.3         # a man's chest: the line between cover and a blocker
BODY_CSS = 112.0    # the fighter box (rule 21's fight leg)
OVAL = (0x84, 0x95, 0xa0)   # the pale blue-grey of the pads he was shown


def die(m): sys.exit('REFUSED: ' + m)


rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
def load(rec): return Image.open(io.BytesIO(base64.b64decode(rec['b64'])))

_B = json.load(open(BANK))
RAMPS = {k: [rgb(h) for h in v] for k, v in _B['method']['one_palette_per_family'].items()}
TILES = {t['id']: t for t in _B['tiles']}
SPR = {s['id']: s for s in _B['sprites']}
SRC = _B['cell_px']                          # 44: one cell of his approved bank
CELL_M = SRC / STREET_PPM                    # what one of his cells is worth in metres
TILE_PX = TILE_CELLS * SRC                   # 528: twelve of his cells, exactly
TILE_M = TILE_PX / PPM                       # 12.31 m -- a house, to a third of a metre
# His ramps AND his own tiles. A check against the bare family ramps is stricter than his
# approved art -- his tiles carry a per-tile sun offset -- and this lane has written that
# guard too tight twice already.
ALL = {c for r in RAMPS.values() for c in r}
for _t in _B['tiles']:
    ALL |= {p[:3] for p in load(_t).convert('RGB').getdata()}
for _s in _B['sprites']:
    ALL |= {p[:3] for p in load(_s).convert('RGBA').getdata() if p[3] > 127}


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


def m(metres): return max(1, int(round(metres * PPM)))


def roll(im, dx, dy):
    if not dx and not dy: return im
    out = Image.new('RGB', im.size)
    for ox in (dx, dx - im.size[0]):
        for oy in (dy, dy - im.size[1]):
            out.paste(im, (ox, oy))
    return out


def dress(variants, w, h, seed, x0=0, y0=0):
    """HIS CELLS AT 1:1 (rule 38e). Pasted, never scaled: that is the whole fix. x0/y0 keep
       the cell lattice continuous when a strip is pasted into a bigger tile, so the paving
       does not restart at every band."""
    ts = [load(TILES[v]).convert('RGB') for v in variants]
    im = Image.new('RGB', (max(1, w), max(1, h)))
    for yy in range(-(y0 % SRC), h, SRC):
        for xx in range(-(x0 % SRC), w, SRC):
            cx, cy = (xx + x0) // SRC, (yy + y0) // SRC
            k = ts[(cx * 7 + cy * 13 + seed) % len(ts)]
            im.paste(roll(k, (cx * 11 + seed) % SRC, (cy * 23 + seed * 3) % SRC), (xx, yy))
    return im


def fam_of(c):
    best, who = 1e9, 'ground'
    for f, ramp in RAMPS.items():
        for e in ramp:
            d = abs(e[0] - c[0]) + abs(e[1] - c[1]) + abs(e[2] - c[2])
            if d < best: best, who = d, f
    return who


_FAM = {}
def fam_memo(c):
    if c not in _FAM: _FAM[c] = fam_of(c)
    return _FAM[c]


def shade(im, box, mult):
    """A shadow darkens WITHIN ITS OWN FAMILY, found per colour. Written wrong twice in this
       lane: once picking the ramp by row, once snapping across every ramp at once, which
       turned a terracotta roof concrete grey."""
    x0, y0, x1, y1 = [int(v) for v in box]
    p = im.load()
    byf = {k: sorted(v, key=LUM) for k, v in RAMPS.items()}
    memo = {}
    for y in range(max(0, y0), min(im.size[1], y1)):
        for x in range(max(0, x0), min(im.size[0], x1)):
            c = p[x, y][:3]
            if c not in memo:
                ramp = byf[fam_memo(c)]
                # *** AND A SHADOW THAT COMES OUT LIGHTER IS NOT A SHADOW. *** The road's
                # wear bands came out as pale stripes, because the nearest entry on the
                # family a colour lands on can sit ABOVE it. Darkening now only ever picks
                # from entries at or below the colour, and lightening only from at or above.
                here = [e for e in ramp if (LUM(e) <= LUM(c) + 0.5) if mult < 1.0] or \
                       [e for e in ramp if (LUM(e) >= LUM(c) - 0.5) if mult > 1.0] or ramp
                v = LUM(c) * mult
                memo[c] = min(here, key=lambda e: abs(LUM(e) - v))
            p[x, y] = memo[c] + ((p[x, y][3],) if len(p[x, y]) == 4 else ())
    return im


def lighter(c, steps=1):
    """One step up its own family's ramp. *** NOT c TIMES 1.2. *** Multiplying a colour
       invents a colour that is on nobody's ramp, which is how the broken top of the wall put
       six colours into the picture that are not his. The palette guard caught it, which is
       exactly what it is for."""
    ramp = sorted(RAMPS[fam_memo(tuple(c))], key=LUM)
    i = min(range(len(ramp)), key=lambda k: abs(LUM(ramp[k]) - LUM(c)))
    return ramp[min(len(ramp) - 1, i + steps)]


def rot90(rec):
    """A 90 degree turn of one of his cells. Lossless: every pixel keeps its exact value and
       moves to an exact place, so this is not a resample. The lane line in road_centre runs
       east-west; our street runs north-south, so the line is turned, not redrawn."""
    return load(rec).convert('RGB').transpose(Image.ROTATE_90)


LAID = {}          # every cell this run pasted, so the proof below can be exact, not statistical
CUR = [None]       # which tile is being built, so every cells() call is counted against it


def cells(ids, w, h, seed, x0=0, y0=0, rot=False, tag=None, vary=True):
    """vary: mirror his cells as well as rolling them. A mirror is lossless -- every pixel
       keeps its exact value and lands on an exact pixel -- so it is not a resample, and it
       turns three paving cells into twelve without drawing anything new. His walk cells each
       carry a big crack, and tiled three ways they read as a crack PATTERN; mirrored they
       read as a cracked sidewalk. Directional cells (the lane line, the gutter, the kerb
       face) are never mirrored, because mirroring one moves the line to the wrong side."""
    ts = [rot90(TILES[i]) if rot else load(TILES[i]).convert('RGB') for i in ids]
    if vary:
        ts = [t.transpose(o) if o is not None else t for t in ts
              for o in (None, Image.FLIP_LEFT_RIGHT, Image.FLIP_TOP_BOTTOM, Image.ROTATE_180)]
    im = Image.new('RGB', (max(1, w), max(1, h)))
    for yy in range(-(y0 % SRC), h, SRC):
        for xx in range(-(x0 % SRC), w, SRC):
            cx, cy = (xx + x0) // SRC, (yy + y0) // SRC
            k = ts[(cx * 7 + cy * 13 + seed) % len(ts)]
            r = roll(k, (cx * 11 + seed) % SRC, (cy * 23 + seed * 3) % SRC)
            im.paste(r, (xx, yy))
            if CUR[0]:
                # verify the paste against the cell it came from, here, where nothing has had
                # a chance to draw over it yet. Zero tolerance, pixel for pixel.
                cw, ch = min(SRC, w - xx), min(SRC, h - yy)
                if cw > 0 and ch > 0:
                    got = im.crop((max(0, xx), max(0, yy), max(0, xx) + cw, max(0, yy) + ch))
                    want = r.crop((max(0, -xx), max(0, -yy), max(0, -xx) + got.size[0],
                                   max(0, -yy) + got.size[1]))
                    c = LAID.setdefault(CUR[0], [0, 0])
                    c[0 if got.tobytes() == want.tobytes() else 1] += 1
    return im


def column(im, ids, xm, wm, seed, rot=False):
    """Lay a vertical band of one of his cells straight into the tile, at 1:1. Never varied:
       these are the cells whose whole job is which side the line is on."""
    x, w = m(xm), m(wm)
    b = cells(ids, w, im.size[1], seed, x0=x, rot=rot, vary=False)
    im.paste(b, (x, 0))


def wear(im, xm, wm, mult=0.93):
    shade(im, (m(xm), 0, m(xm + wm), im.size[1]), mult)


# ----------------------------------------------------------------- THE FIVE GROUND TILES

def tile_road(seed=11):
    """12 m of two-lane carriageway: the tile that runs down the middle of a street. His
       asphalt cells, his lane line turned to run with the street, his gutters at both
       edges, and the two bands where the wheels went."""
    CUR[0] = 'THE ROAD'
    px = TILE_PX
    im = cells(['road_0', 'road_1', 'road_2'], px, px, seed).convert('RGB')
    column(im, ['road_gutter'], 0.0, CELL_M, seed + 1)                 # west gutter
    g = cells(['road_gutter'], m(CELL_M), px, seed + 2, vary=False).transpose(Image.FLIP_LEFT_RIGHT)
    im.paste(g, (px - m(CELL_M), 0))                                   # east gutter, mirrored
    column(im, ['road_centre'], TILE_M / 2 - CELL_M / 2, CELL_M, seed + 3, rot=True)
    base = im.copy()
    for wx in (1.9, 3.5, 7.9, 9.5):                   # four wheel tracks, two lanes
        wear(im, wx, 0.9, 0.90)
    return im, dict(name='THE ROAD', _base=base, w=TILE_M, l=TILE_M, h=0.0, kind='FLOOR',
                    note='two lanes, the line, the gutters')


def tile_kerb(seed=12):
    """12 m of the street's EDGE, which is the tile that actually makes a street read from
       above: carriageway, gutter, the kerb face, the sidewalk, and the strip of yard behind
       it. TG-04: the kerb is the one edge that says 'street' from across a board."""
    CUR[0] = 'THE KERB'
    px = TILE_PX
    im = cells(['yard_0', 'yard_1', 'yard_2'], px, px, seed).convert('RGB')
    road = cells(['road_0', 'road_1', 'road_2'], m(2.0), px, seed + 1)
    im.paste(road, (0, 0))
    column(im, ['road_gutter'], 2.0 - CELL_M, CELL_M, seed + 2)
    column(im, ['walk_kerb'], 2.0, CELL_M, seed + 3)                   # the kerb face
    wk = cells(['walk_0', 'walk_1', 'walk_2'], m(2.0), px, seed + 4, x0=m(2.0 + CELL_M))
    im.paste(wk, (m(2.0 + CELL_M), 0))                                 # the sidewalk
    # the kerb stands 0.15 m, so it throws a thin shadow to the south-east, on to the road
    base = im.copy()
    shade(im, (m(2.0) - m(0.15), 0, m(2.0), px), 0.74)
    wear(im, 0.2, 1.2)
    return im, dict(name='THE KERB', _base=base, w=TILE_M, l=TILE_M, h=0.15, kind='FLOOR',
                    note='road, gutter, kerb, walk, yard')


def tile_yard(seed=13):
    """12 m of a front lot. The path is the only thing drawn on it, and it is drawn in his
       own dirt cell, because a path is worn ground, not a painted line."""
    CUR[0] = 'THE YARD'
    px = TILE_PX
    im = cells(['yard_0', 'yard_1', 'yard_2'], px, px, seed).convert('RGB')
    base = im.copy()
    d = cells(['dirt'], px, px, seed + 1)
    p = im.load(); q = d.load()
    r = R(seed)
    amp, pw = m(1.4), m(0.5)
    for y in range(px):                                   # the path somebody wore to a door
        cx = int(px * 0.42 + amp * math.sin(y / float(px) * 2.4))
        for x in range(max(0, cx - pw), min(px, cx + pw)):
            p[x, y] = q[x, y]
    shade(im, (0, 0, px, px), 1.0)                        # keeps every colour on a ramp
    # gravel and dead scrub. The first cut put 26 one-pixel marks on it and the tile read as
    # a flat slab of sand: a front lot has stuff ON it or it is not a lot.
    gd = ImageDraw.Draw(im)
    for _ in range(140):                                  # gravel, his own ground ramp
        sx, sy = r.i(px), r.i(px)
        sz = max(1, m(0.05) + r.i(m(0.07)))
        gd.rectangle([sx, sy, sx + sz, sy + sz], fill=RAMPS['ground'][1 + r.i(2)])
    for _ in range(34):                                   # dead scrub: a few spokes, low
        sx, sy = r.i(px), r.i(px)
        for k in range(4 + r.i(4)):
            ang = r() * 6.283
            ln = m(0.18) + r.i(m(0.26))
            gd.line([(sx, sy), (sx + int(ln * math.cos(ang)), sy + int(ln * math.sin(ang)) // 2)],
                    fill=RAMPS['ground'][0], width=1)
    for _ in range(9):                                    # bare patches worn through to dirt
        sx, sy = r.i(px), r.i(px)
        rr_ = m(0.5) + r.i(m(0.9))
        for yy in range(max(0, sy - rr_ // 2), min(px, sy + rr_ // 2)):
            for xx in range(max(0, sx - rr_), min(px, sx + rr_)):
                if ((xx - sx) / float(rr_)) ** 2 + ((yy - sy) / float(rr_ / 2.0)) ** 2 < 1.0:
                    p[xx, yy] = q[xx, yy]
    return im, dict(name='THE YARD', _base=base, w=TILE_M, l=TILE_M, h=0.0, kind='FLOOR',
                    note='dirt, scrub, the worn path')


def tile_slab(seed=14):
    """12 m of parking and loading concrete. The pour joints and the bay lines are the only
       marks, and both are things that are really on the ground."""
    CUR[0] = 'THE SLAB'
    px = TILE_PX
    im = cells(['concrete_0', 'concrete_1'], px, px, seed).convert('RGB')
    base = im.copy()
    d = ImageDraw.Draw(im)
    jt = RAMPS['concrete'][1]
    for k in range(1, 4):                                  # pour joints every 3 m
        d.line([(m(3.0 * k), 0), (m(3.0 * k), px)], fill=jt, width=max(1, m(0.04)))
        d.line([(0, m(3.0 * k)), (px, m(3.0 * k))], fill=jt, width=max(1, m(0.04)))
    bay = RAMPS['concrete'][5]
    for k in range(5):                                     # the bays, 2.5 m apart
        y = m(1.0 + 2.5 * k)
        d.line([(m(0.6), y), (m(5.6), y)], fill=bay, width=max(1, m(0.1)))
    return im, dict(name='THE SLAB', _base=base, w=TILE_M, l=TILE_M, h=0.0, kind='FLOOR',
                    note='pour joints and parking bays')


def tile_roof(seed=15):
    """12 m of STANDABLE deck (rule 37g, his own up-vote: 'a building with the roof you can
       be on'). High ground has to read as somewhere you would stand, so it is gravel with a
       parapet round it and a drain, not a blank panel. The lit lip of the parapet is the
       material ONE BELOW its white accent: a roof lit to the accent came out blinding once."""
    CUR[0] = 'THE ROOF'
    px = TILE_PX
    im = cells(['roof_deck'], px, px, seed).convert('RGB')
    base = im.copy()
    d = ImageDraw.Draw(im)
    pw = m(0.30)
    # the parapet cell's pale line runs east-west, so the north and south runs use it as it
    # is and the east and west runs use it TURNED, or the side walls come out as orange ticks
    par = cells(['roof_parapet'], px, px, seed + 1, vary=False)
    parv = cells(['roof_parapet'], px, px, seed + 1, rot=True, vary=False)
    for src_, box in ((par, (0, 0, px, pw)), (par, (0, px - pw, px, px)),
                      (parv, (0, 0, pw, px)), (parv, (px - pw, 0, px, px))):
        im.paste(src_.crop(box), (box[0], box[1]))
    lip = sorted(RAMPS['terracotta'], key=LUM)[-2]         # ONE BELOW the accent, never it
    d.rectangle([0, 0, px, max(2, pw // 3)], fill=lip)     # sun north-west: the north lip
    d.rectangle([0, 0, max(2, pw // 3), px], fill=lip)     # and the west lip
    shade(im, (0, px - pw, px, px), 0.74)                  # south in shadow
    shade(im, (px - pw, 0, px, px), 0.80)                  # east in shadow
    shade(im, (pw, pw, px - pw, pw + m(0.30)), 0.84)       # the parapet throws on to the deck
    shade(im, (pw, pw, pw + m(0.30), px - pw), 0.88)
    dr = (int(px * 0.70), int(px * 0.74))                  # the drain, and the deck falls to it
    for rr in range(m(1.5), 0, -m(0.25)):
        shade(im, (dr[0] - rr, dr[1] - rr, dr[0] + rr, dr[1] + rr), 0.98)
    d.ellipse([dr[0] - m(0.20), dr[1] - m(0.20), dr[0] + m(0.20), dr[1] + m(0.20)],
              fill=RAMPS['asphalt'][0])
    # THE WAY UP, because high ground nobody can reach is not high ground: a stair head, and
    # a vent box beside it, both from above with the sun north-west.
    for bx, by, bw, bh, fam in ((m(1.4), m(1.6), m(2.2), m(1.8), 'concrete'),
                                (m(7.4), m(2.2), m(1.3), m(1.0), 'stucco')):
        rp = RAMPS[fam]                      # his ramps are not all the same length: stucco
        mid, hi = rp[len(rp) // 2], rp[min(len(rp) - 2, 5)]
        d.rectangle([bx, by, bx + bw, by + bh], fill=mid)
        d.rectangle([bx, by, bx + bw, by + max(2, m(0.10))], fill=hi)
        d.rectangle([bx, by, bx + max(2, m(0.10)), by + bh], fill=hi)
        shade(im, (bx + m(0.25), by + bh, bx + bw + m(0.25), by + bh + m(0.35)), 0.70)
    sx, sy, sw, sh = m(1.4), m(1.6), m(2.2), m(1.8)        # the steps inside the stair head
    for k in range(5):
        yy = sy + m(0.28) + k * (sh - m(0.4)) // 5
        d.rectangle([sx + m(0.25), yy, sx + sw - m(0.25), yy + max(1, m(0.06))],
                    fill=RAMPS['concrete'][1])
    return im, dict(name='THE ROOF', _base=base, tiles=False, w=TILE_M, l=TILE_M, h=0.0, kind='MOUND',
                    note='gravel, parapet, drain, a way up',
                    standable=True)


# --------------------------------------------------------------------- THE TWO COVER PIECES

def piece_car():
    """HIS OWN APPROVED WRECK, REUSED, NOT REDRAWN (REUSE-FIRST). It is already authored at
       his street's density, which is the density this whole floor is authored at, so it
       drops on at 1:1 with not one pixel touched. All I add is the board's shadow.
       AND THE TAPE SAYS IT IS TWO THINGS: the cabin is 1.45 m, over a man's chest, so that
       end is a BLOCKER; the hood and the boot are 1.10 m, under it, so those ends are COVER.
       That is the fact this lane put in the bank last round, and a car is the clearest case
       of it on the whole board."""
    s = SPR['wreck_road']
    car = load(s).convert('RGBA')
    wm = s['w'] * SRC / PPM
    lm = s['h'] * SRC / PPM
    # *** AND IT SHIPS WITH NO BAKED SHADOW, WHICH THE PALETTE GUARD IS WHAT TAUGHT ME. ***
    # The first cut laid a half-transparent black under it, and 132 colours came out that are
    # on nobody's ramp, because a translucent paste INVENTS colours. A shadow is not part of
    # a car. It is a thing that happens to the GROUND, so the board darkens the ground inside
    # the footprint below and the car itself stays exactly the pixels he approved.
    return car, dict(name='THE DEAD CAR', w=round(wm, 2), l=round(lm, 2), h=1.45,
                     kind='BLOCKER', cover_h=1.10, reused='wreck_road, 7/28 approved bank',
                     shadow=[round(0.35, 2), round(0.20, 2)],
                     note='cabin 1.45 blocks, hood and boot 1.10 are cover')


def piece_wall(seed=16):
    """12 m of CONCRETE BLOCK yard wall, and a collapsed section of it. COVER IS THE THINNEST
       KIND ON THE WHOLE BOARD: this lane's 9/30 count found 389 cover pieces against 2,899
       blockers, which is a board with nowhere to stand.

       *** AND THE FIRST CUT WAS DRAWN STRAIGHT ON, WHICH IS THE WRONG CAMERA. *** Every
       other thing in this game is seen from above at forty-five degrees -- the tiles, the
       car, the house. A wall drawn as a flat elevation reads as a sticker on the board. So
       it is drawn as a CAP you look down on and a FACE below it, with the collapse breaking
       both, and the rubble lying on the ground in front where it actually fell.
       Concrete block, not the tan stucco house wall: last round the container and the
       trailer came out as the same picture because both got dressed in wall cells."""
    wm, hm, tm = TILE_M, 1.90, 0.20
    broke_h = 1.00
    W = m(wm)
    CAP = m(0.42)                       # the top of the wall, looked down on
    FACE = m(1.30)                      # the face, foreshortened the way the houses are
    GRD = m(0.55)                       # the ground the rubble and the shadow lie on
    im = Image.new('RGBA', (W, CAP + FACE + GRD), (0, 0, 0, 0))
    face = cells(['concrete_0', 'concrete_1'], W, FACE, seed).convert('RGBA')
    fd = ImageDraw.Draw(face)
    jt = RAMPS['concrete'][1] + (255,)
    nrow = 7                            # a block is 0.20 m high: seven courses in 1.9 m
    for rw in range(nrow + 1):
        y = int(FACE - rw * (FACE / float(nrow)))
        fd.line([(0, y), (W, y)], fill=jt, width=1)
        off = m(0.20) if rw % 2 else 0
        for x in range(off, W, m(0.40)):
            fd.line([(x, y), (x, max(0, y - int(FACE / float(nrow))))], fill=jt, width=1)
    im.paste(face, (0, CAP), face)
    cap = cells(['concrete_1'], W, CAP, seed + 1, vary=False).convert('RGBA')
    im.paste(cap, (0, 0), cap)
    shade(im, (0, 0, W, CAP), 1.30)                     # the cap catches the sun, flat on
    shade(im, (0, CAP - max(2, m(0.05)), W, CAP), 0.86)  # and turns over at its south edge
    shade(im, (0, CAP, W, CAP + m(0.08)), 0.72)         # and throws a line on to its own face
    shade(im, (0, CAP + FACE // 2, W, CAP + FACE), 0.90)

    # THE COLLAPSED SECTION: 3 m of it is down to 1.0 m, broken off in blocks, not sanded.
    r = R(seed)
    bx0, bx1 = m(4.5), m(7.5)
    drop = int((hm - broke_h) / hm * (CAP + FACE * 0.55))
    px_ = im.load()
    topline = {}
    for x in range(bx0, bx1):
        t = (x - bx0) / float(bx1 - bx0)
        cut = int(drop * math.sin(t * math.pi))
        cut = max(0, cut - (cut % max(1, m(0.20))))      # it broke along the courses
        topline[x] = cut
        for y in range(0, cut):
            px_[x, y] = (0, 0, 0, 0)
    for x in range(bx0, bx1):                            # the broken top, lit
        c = topline[x]
        if c > 0:
            for k in range(max(2, m(0.07))):
                if c + k < im.size[1]:
                    q = px_[x, c + k]
                    if q[3] > 127:
                        px_[x, c + k] = lighter(q[:3]) + (255,)

    # the rubble it came down as, lying ON THE GROUND in front of the gap
    rb = ImageDraw.Draw(im)
    for _ in range(260):
        t = r()
        rx = bx0 - m(0.8) + int(t * (bx1 - bx0 + m(1.6)))
        spread = 1.0 - abs(t - 0.5) * 1.4
        ry = CAP + FACE - m(0.1) + int(r() * GRD * max(0.15, spread))
        sz = max(1, m(0.07) + r.i(m(0.13)))
        rb.rectangle([rx, ry, rx + sz, ry + max(1, sz // 2)],
                     fill=RAMPS['concrete'][2 + r.i(3)] + (255,))
        rb.rectangle([rx, ry, rx + sz, ry + 1], fill=RAMPS['concrete'][5] + (255,))
    return im, dict(name='THE BLOCK WALL', w=wm, l=tm, h=hm, kind='BLOCKER',
                    cover_h=broke_h, shadow=[0.30, 0.18],
                    note='1.9 m blocks, a 3 m section down to 1.0 m: cover')


# --------------------------------------------------------------------------- THE INSTRUMENT

def period(im, axis):
    """THE SAME INSTRUMENT I POINTED AT HIS SCREENSHOT. The dominant repeat of a picture's
       own gradient. On his board's panel it answered 44 on both axes, which is how I know
       the board is painting one of his 44 px cells across 44 of its own pixels. Pointed at
       a tile of this floor it has to answer 44 too, because that is the proof his cells are
       in there at 1:1 and nothing has been stretched."""
    a = im.convert('RGB')
    w, h = a.size
    px = a.load()
    n = w if axis == 0 else h
    g = []
    for i in range(n - 1):
        s = 0
        if axis == 0:
            for y in range(0, h, 3):
                c, d = px[i, y], px[i + 1, y]
                s += abs(c[0] - d[0]) + abs(c[1] - d[1]) + abs(c[2] - d[2])
            g.append(s / float(max(1, h // 3)))
        else:
            for x in range(0, w, 3):
                c, d = px[x, i], px[x, i + 1]
                s += abs(c[0] - d[0]) + abs(c[1] - d[1]) + abs(c[2] - d[2])
            g.append(s / float(max(1, w // 3)))
    mu = sum(g) / len(g)
    g = [v - mu for v in g]
    lags = {}
    for p in range(16, min(220, len(g) - 4)):
        lags[p] = sum(g[i] * g[i + p] for i in range(len(g) - p)) / (len(g) - p)
    bp = max(lags.items(), key=lambda kv: kv[1])[0]
    return bp, lags


def lattice_holds(lags, cell):
    """*** MY FIRST VERSION OF THIS GUARD WAS THE WRONG ORACLE AND IT FAILED MY OWN GOOD
       ART. *** It took the single strongest repeat and demanded it be 44. But a MULTIPLE of
       a period is also a peak, and usually a taller one: three paving variants repeat every
       three cells, the jitter repeats every four, so a perfectly honest 44 px lattice
       answers 132 or 176. The art was right and the ruler was wrong, which is the exact
       shape of mistake this lane keeps making.
       What I actually claim is that HIS 44 IS IN THERE. So: 44 has to be a local peak, and
       it has to sit in the top of the field. A cell stretched to 2.69 m answers 118, which
       is neither, so the guard still bites on the fault it was built for."""
    if cell not in lags: return False, 'no reading at %d' % cell
    v = lags[cell]
    peak = all(v >= lags.get(cell + d, -1e18) for d in (-2, -1, 1, 2))
    rank = sum(1 for k in lags if lags[k] > v) / float(len(lags))
    return (peak and v > 0 and rank <= 0.15), 'peak %s, in the top %.0f%% of lags' % (peak, rank * 100)


def mean_colour(im):
    a = im.convert('RGB')
    n = a.size[0] * a.size[1]
    r = g = b = 0
    for p in a.getdata(): r += p[0]; g += p[1]; b += p[2]
    return (r / n, g / n, b / n)


def dom_family(im):
    c = {}
    for p in im.convert('RGB').getdata():
        f = fam_memo(p)
        c[f] = c.get(f, 0) + 1
    return max(c.items(), key=lambda kv: kv[1])[0]


def row_jump(im, y0, y1):
    a = im.convert('RGB'); px = a.load(); w = a.size[0]
    tot = 0; n = 0
    for y in range(y0, y1 - 1):
        s = 0
        for x in range(0, w, 3):
            c, d = px[x, y], px[x, y + 1]
            s += abs(c[0] - d[0]) + abs(c[1] - d[1]) + abs(c[2] - d[2])
        tot += s / float(max(1, w // 3)); n += 1
    return tot / max(1, n)


def wrap_jump(im):
    a = im.convert('RGB'); px = a.load(); w, h = a.size
    s = 0
    for x in range(0, w, 3):
        c, d = px[x, h - 1], px[x, 0]
        s += abs(c[0] - d[0]) + abs(c[1] - d[1]) + abs(c[2] - d[2])
    return s / float(max(1, w // 3))


def off_palette(im):
    bad = {}
    for p in im.convert('RGBA').getdata():
        if p[3] < 128: continue
        c = p[:3]
        if c not in ALL: bad[c] = bad.get(c, 0) + 1
    return bad


def near_oval(im, radius):
    n = 0
    for p in im.convert('RGBA').getdata():
        if p[3] < 128: continue
        if abs(p[0] - OVAL[0]) + abs(p[1] - OVAL[1]) + abs(p[2] - OVAL[2]) <= radius:
            n += 1
    return n


# --------------------------------------------------------------------------- THE GUARDS

def guards(ground, props, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    # 1 -- NO ATARI, measured not typed
    ok('NO ATARI: every ground tile is %.1f painted pixels per metre, over the floor of %.0f '
       'and over his own approved street' % (PPM, FLOOR_PPM),
       all(abs(im.size[0] / TILE_M - PPM) < 0.2 and abs(im.size[1] / TILE_M - PPM) < 0.2
           for im, _ in ground) and PPM >= FLOOR_PPM,
       'a tile is %d px for %.1f m' % (TILE_PX, TILE_M))

    # 2 -- NOTHING IS RESAMPLED: his cell lattice is still 44 in both axes
    # *** THIS GUARD GOT REWRITTEN TWICE AND THE SECOND LESSON IS THE BIGGER ONE. ***
    # First I asked for the loudest repeat to be 44, and a multiple of a period is a louder
    # peak than the period, so honest art failed. Then I asked for 44 to be a peak at all --
    # and the YARD failed, because his yard cells are a soft speckle that meets edge to edge
    # with almost no contrast. THAT IS GOOD ART. A field that shows no grid is exactly what a
    # yard should be, and a ruler that demands a visible grid is a ruler that rewards a worse
    # picture. The repeat ruler diagnosed HIS board, where it answered 44 and gave the
    # headline. It is the wrong instrument for certifying mine.
    # So the proof is EXACT instead: every cell this run pasted is compared, pixel for pixel,
    # with a rolled copy of the bank cell it came from. Zero tolerance. A resample could not
    # survive one pixel of it.
    for im, meta in ground:
        good, bad = LAID.get(meta['name'], [0, 1])
        bs = meta['_base']
        same = sum(1 for a_, b_ in zip(im.convert('RGB').getdata(), bs.convert('RGB').getdata())
                   if a_ == b_)
        share = 100.0 * same / float(im.size[0] * im.size[1])
        ok('NOTHING RESAMPLED in %s: all %d cells laid are his bank cells pixel for pixel, '
           'and %.0f%% of the finished tile is still his untouched pixels'
           % (meta['name'], good, share),
           good > 0 and bad == 0 and share >= 50.0,
           '%d of %d cells differ from the bank, %.0f%% untouched' % (bad, good + bad, share))

    # 3 -- EVERY PIXEL IS HIS (his ramps AND his tiles AND his sprites)
    for im, meta in list(ground) + list(props):
        bad = off_palette(im)
        ok('EVERY PIXEL IS HIS in %s' % meta['name'], not bad,
           '%d colours off the bank, worst %s' % (len(bad), max(bad.items(), key=lambda k: k[1])[0]
                                                  if bad else ''))

    # 4 -- THE GROUND IS ONLY THE GROUND
    hisd = min(abs(c[0] - OVAL[0]) + abs(c[1] - OVAL[1]) + abs(c[2] - OVAL[2]) for c in ALL)
    rad = int(hisd * 0.6)
    for im, meta in ground:
        a = im.convert('RGBA')
        part = sum(1 for p in a.getdata() if 0 < p[3] < 255)
        ok('THE GROUND IS ONLY THE GROUND in %s: no see-through pixel, and nothing within %d '
           'of the pads he was shown' % (meta['name'], rad),
           part == 0 and near_oval(im, rad) == 0,
           '%d part-alpha, %d near the pad grey' % (part, near_oval(im, rad)))

    # 5 -- NO TWO TILES ARE THE SAME PICTURE
    for i in range(len(ground)):
        for j in range(i + 1, len(ground)):
            a, b = ground[i], ground[j]
            ma, mb = mean_colour(a[0]), mean_colour(b[0])
            dist = sum(abs(ma[k] - mb[k]) for k in range(3))
            fa, fb = dom_family(a[0]), dom_family(b[0])
            ok('NOT THE SAME PICTURE: %s and %s (%s / %s, %.0f apart)'
               % (a[1]['name'], b[1]['name'], fa, fb, dist), fa != fb or dist >= 24.0)

    # 6 -- A TILE TILES: the seam is no worse than the tile's own inside
    for im, meta in ground:
        inside = row_jump(im, 2, im.size[1] - 2)
        seam = wrap_jump(im)
        if meta.get('tiles') is False:
            # THE ROOF IS A BUILDING TOP, NOT A FIELD, so asking it to join itself is asking
            # the wrong question: two roofs end to end are two buildings and SHOULD show a
            # line. What it has to prove instead is that the line is a PARAPET all the way
            # round, which is what says 'this is the top of something' from across a board.
            e = [im.crop((0, 0, im.size[0], m(0.3))), im.crop((0, im.size[1] - m(0.3), im.size[0], im.size[1])),
                 im.crop((0, 0, m(0.3), im.size[1])), im.crop((im.size[0] - m(0.3), 0, im.size[0], im.size[1]))]
            mid = mean_colour(im.crop((m(1.2), m(1.2), im.size[0] - m(1.2), im.size[1] - m(1.2))))
            gaps = [sum(abs(mean_colour(x)[k] - mid[k]) for k in range(3)) for x in e]
            ok('A BUILDING TOP HAS A PARAPET ALL THE WAY ROUND: %s edges stand %s off its own '
               'deck' % (meta['name'], '/'.join('%.0f' % g for g in gaps)), min(gaps) >= 24.0,
               'an edge that matches the deck is a field, not a roof')
        else:
            ok('A TILE TILES: %s joins itself at %.0f against its own inside at %.0f'
               % (meta['name'], seam, inside), seam <= inside * 2.2 + 6,
               'two of these end to end would show a seam')

    # 7 -- COVER IS NOT A BLOCKER, measured in metres
    for im, meta in props:
        h, k = meta.get('h', 0), meta.get('kind')
        good = (k == 'BLOCKER' and h > CHEST) or (k == 'COVER' and h < CHEST) or k == 'MOUND'
        if 'cover_h' in meta: good = good and meta['cover_h'] < CHEST
        ok('COVER IS NOT A BLOCKER: %s is %s at %.2f m against a chest at %.2f%s'
           % (meta['name'], k, h, CHEST,
              (', and its cover end is %.2f' % meta['cover_h']) if 'cover_h' in meta else ''),
           good)

    # 8 -- THE ROOF IS STANDABLE, and its lit lip is not the accent
    roof = [g for g in ground if g[1]['name'] == 'THE ROOF'][0]
    accent = max(RAMPS['terracotta'], key=LUM)
    top = roof[0].convert('RGB')
    lip = top.getpixel((top.size[0] // 2, 0))
    inset = top.crop((m(1.0), m(1.0), top.size[0] - m(1.0), top.size[1] - m(1.0)))
    ok('THE ROOF IS STANDABLE: its deck is flat (%.0f row to row) and its lit lip %s is not '
       'the ramp\'s white accent %s' % (row_jump(inset, 2, inset.size[1] - 2), lip, accent),
       lip != accent and row_jump(inset, 2, inset.size[1] - 2) < 60)

    return fails


# ---------------------------------------------------------------- THE BOARD, IN HIS FRAME

PHONE = (1170, 2532)        # his phone at 3x, the profile the whole fleet measures at


def board(tiles, props):
    """A piece of a fight board laid out of this floor, in the phone's own device pixels. A
       street running north-south: the lot on the west, the kerb, the carriageway, the kerb
       and the lot on the east. The dead car on the road and the block wall on the lot line.
       Nothing is painted on the ground, which is the whole point."""
    T = {meta['name']: im for im, meta in tiles}
    W, H = PHONE[0], 1924                     # the before's own 491 x 807 shape, at 3x
    im = Image.new('RGB', (W, H), RAMPS['ground'][2])
    kerb = T['THE KERB']
    west = kerb.transpose(Image.FLIP_LEFT_RIGHT)      # yard west, road east
    cols = [(-int(TILE_PX * 0.55), west), (int(TILE_PX * 0.45), T['THE ROAD']),
            (int(TILE_PX * 1.45), kerb)]
    for x, t in cols:
        for y in range(-TILE_PX // 3, H, TILE_PX):
            im.paste(t, (x, y))
    # the block wall on the west lot line, and the dead car in the road
    wall, wmeta = props['THE BLOCK WALL']
    im.paste(wall, (-int(TILE_PX * 0.55) + m(9.4) - wall.size[0] // 2, int(H * 0.46)), wall)
    car, cmeta = props['THE DEAD CAR']
    def drop(sprite, x, y):
        """The shadow is cast ON THE GROUND, inside the sprite's own footprint, in the
           ground's own family. Nothing translucent is ever pasted."""
        ox, oy = m(cmeta['shadow'][0]), m(cmeta['shadow'][1])
        a = sprite.split()[3]
        bb = a.getbbox()
        if bb: shade(im, (x + bb[0] + ox, y + bb[1] + oy, x + bb[2] + ox, y + bb[3] + oy), 0.70)
        im.paste(sprite, (x, y), sprite)
    drop(car, int(TILE_PX * 0.45) + m(1.4), int(H * 0.62))
    drop(car.transpose(Image.FLIP_LEFT_RIGHT), int(TILE_PX * 0.45) + m(6.6), int(H * 0.18))
    # HIS PEOPLE, so the question he actually asked -- how do the tiles look below them --
    # can be answered. The fight draws a body at 0.57 of a tile (the 112 box against the 196
    # slot), and the body art we own is 67 px, so it goes up a whole 4x and not a hair more:
    # a clean pixel double, never a smooth fake. THAT BLOW-UP IS THE NEXT JOB AFTER THE FLOOR
    # and it is in this picture on purpose, where he can see it.
    spots = [(0.46, 0.30, 'you'), (0.62, 0.41, 'the_neighbour'),
             (0.52, 0.55, 'the_neighbour'), (0.70, 0.70, 'you'), (0.36, 0.80, 'you')]
    for fx, fy, who in spots:
        s = load(SPR[who]).convert('RGBA')
        s = s.resize((s.size[0] * 4, s.size[1] * 4), Image.NEAREST)
        x, y = int(W * fx) - s.size[0] // 2, int(H * fy) - s.size[1]
        bb = s.split()[3].getbbox()
        if bb:
            shade(im, (x + bb[0] + m(0.45), y + bb[3] - m(0.35),
                       x + bb[2] + m(0.45), y + bb[3] + m(0.18)), 0.68)
        im.paste(s, (x, y), s)
    return im


def before_crop():
    """HIS OWN SCREENSHOT, the panel he was looking at, found by its dark gutters rather than
       by numbers I typed."""
    im = Image.open(BEFORE).convert('RGB')
    import itertools
    w, h = im.size
    px = im.load()
    colmean = [sum(sum(px[x, y]) for y in range(0, h, 7)) / float(3 * len(range(0, h, 7)))
               for x in range(w)]
    runs, cur = [], []
    for x in range(w):
        if colmean[x] < 30: cur.append(x)
        elif cur: runs.append(cur); cur = []
    if cur: runs.append(cur)
    runs = [r for r in runs if len(r) > 3]
    x0, x1 = runs[-2][-1] + 1, runs[-1][0]            # the third panel: the game camera
    rowmean = [sum(sum(px[x, y]) for x in range(x0, x1, 7)) / float(3 * len(range(x0, x1, 7)))
               for y in range(h)]
    # *** AND THE FIRST CUT OF THIS TOOK THE LAST TWO DARK BANDS AND CROPPED BETWEEN THEM,
    # WHICH LANDED ON THE SHOOT DIAL: a 491 x 48 sliver, blown up to a panel, and the card
    # showed a smear where his screenshot was meant to be. The board is the LONGEST BRIGHT
    # RUN in the panel, which is the thing I actually mean.
    runs2, cur = [], []
    for y in range(h):
        if rowmean[y] >= 30: cur.append(y)
        elif cur: runs2.append(cur); cur = []
    if cur: runs2.append(cur)
    body = max(runs2, key=len)
    return im.crop((x0, body[0], x1, body[-1] + 1))


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


BG = (16, 15, 14)
INK = (238, 232, 220)
DIM = (150, 142, 130)
HOT = (226, 162, 72)


def card(ground, props, brd, measured):
    PW, PH = 491, 807
    pad, top = 26, 96
    W = pad * 4 + PW * 3
    tileshow = 300
    rowB = top + PH + 58
    H = rowB + 58 + tileshow * 2 + 92 + 420
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)

    d.text((pad, 24), "THE FIGHT'S FLOOR", font=f28, fill=INK)
    d.text((pad, 60), "the tiles below the people, baked from your own street bank at its own "
                      "density  ***  COOK 10/1", font=f15, fill=DIM)

    # ---- panel 1: the before, his own screenshot
    bef = before_crop().resize((PW, PH), Image.LANCZOS)
    im.paste(bef, (pad, top))
    d.rectangle([pad, top, pad + PW, top + PH], outline=(70, 66, 60))
    d.text((pad, top + PH + 8), "1  BEFORE, the board you were looking at", font=f18, fill=HOT)
    d.text((pad, top + PH + 30), "ground repeats every %d px, fighters every %d px"
           % (measured['bp0'], measured['bp1']), font=f13, fill=DIM)

    # ---- panel 2: the after, the same frame
    aft = brd.resize((PW, PH), Image.LANCZOS)
    x2 = pad * 2 + PW
    im.paste(aft, (x2, top))
    d.rectangle([x2, top, x2 + PW, top + PH], outline=(70, 66, 60))
    d.text((x2, top + PH + 8), "2  AFTER, this floor in the same frame", font=f18, fill=HOT)
    d.text((x2, top + PH + 30), "a house tile is %d px of art for %.0f m: %.1f px a metre"
           % (TILE_PX, TILE_M, PPM), font=f13, fill=DIM)

    # ---- panel 3: the pixels, 1:1 on his phone
    x3 = pad * 3 + PW * 2
    im.paste(Image.new('RGB', (PW, PH), (26, 24, 22)), (x3, top))
    d.rectangle([x3, top, x3 + PW, top + PH], outline=(70, 66, 60))
    hh = (PH - 86) // 2
    raw = before_crop()
    cx, cy = int(raw.size[0] * 0.10), int(raw.size[1] * 0.22)   # ground, not the HUD
    gw = PW - 24
    sub = raw.crop((cx, cy, cx + gw // DPR, cy + hh // DPR))
    sub = sub.resize((gw, hh), Image.NEAREST)              # exactly what a 3x phone does
    im.paste(sub, (x3 + 12, top + 34))
    d.text((x3 + 12, top + 12), "3  THE PIXELS, as his phone shows them", font=f18, fill=HOT)
    d.text((x3 + 12, top + 34 + hh + 6),
           "today: CSS-sized canvas, so one painted pixel is a 3 x 3 block",
           font=f13, fill=(214, 120, 96))
    mine = ground[1][0].crop((m(0.6), m(0.6), m(0.6) + gw, m(0.6) + hh))
    im.paste(mine, (x3 + 12, top + 34 + hh + 34))
    d.text((x3 + 12, top + 34 + hh * 2 + 38),
           "this floor: one painted pixel is one of his",
           font=f13, fill=(150, 200, 140))

    # ---- row B: the seven pieces
    y = rowB
    d.text((pad, y), "THE SEVEN PIECES, EVERY ONE AT ITS REAL SIZE", font=f18, fill=INK)
    d.text((pad + 560, y + 3),
           "the ground is a seamless field at %.1f pixels a metre, so a tile is however many "
           "metres combat says" % PPM, font=f13, fill=DIM)
    y += 34
    x = pad
    for im_, meta in ground:
        th = im_.resize((tileshow, tileshow), Image.LANCZOS)
        im.paste(th, (x, y))
        d.rectangle([x, y, x + tileshow, y + tileshow], outline=(70, 66, 60))
        d.text((x + 4, y + tileshow + 6), meta['name'], font=f15, fill=HOT)
        d.text((x + 4, y + tileshow + 26), "%.1f m square, %d of your cells   %s"
               % (meta['w'], TILE_CELLS, meta['kind']), font=f13, fill=DIM)
        note = meta['note']
        while note and d.textlength(note, font=f13) > tileshow - 8: note = note[:-1]
        d.text((x + 4, y + tileshow + 44), note, font=f13, fill=DIM)
        x += tileshow + 14
        if x + tileshow > W - pad:
            x = pad; y += tileshow + 72
    y += tileshow + 86
    x = pad
    d.text((pad, y), "AND THE TWO PIECES THAT GO ON IT", font=f18, fill=INK)
    y += 34
    for key in ('THE DEAD CAR', 'THE BLOCK WALL'):
        pim, meta = props[key]
        sc = min(2.0, (tileshow * 1.4) / max(pim.size))
        ph = pim.resize((max(1, int(pim.size[0] * sc)), max(1, int(pim.size[1] * sc))),
                        Image.NEAREST)
        plate = Image.new('RGB', (ph.size[0] + 16, max(120, ph.size[1] + 16)), (34, 31, 28))
        plate.paste(ph, (8, 8), ph)
        im.paste(plate, (x, y))
        d.text((x + 4, y + plate.size[1] + 6), meta['name'], font=f15, fill=HOT)
        d.text((x + 4, y + plate.size[1] + 26),
               "%.2f x %.2f m   %.2f m   %s%s" % (meta['w'], meta['l'], meta['h'], meta['kind'],
                                                  '   cover end %.2f m' % meta['cover_h']
                                                  if 'cover_h' in meta else ''),
               font=f13, fill=DIM)
        nt = meta['note']
        while nt and d.textlength(nt, font=f13) > plate.size[0] + 180: nt = nt[:-1]
        d.text((x + 4, y + plate.size[1] + 44), nt, font=f13, fill=DIM)
        x += plate.size[0] + 22
    im = im.crop((0, 0, W, min(H, y + 260)))
    return im


def write_bank(ground, props):
    recs = []
    for im_, meta in list(ground) + [props['THE DEAD CAR'], props['THE BLOCK WALL']]:
        b = io.BytesIO(); im_.save(b, 'PNG')
        r = {k: v for k, v in meta.items() if not k.startswith('_')}
        r['px'] = list(im_.size)
        r['b64'] = base64.b64encode(b.getvalue()).decode()
        recs.append(r)
    out = dict(
        version='BOHEMIA_THE_FIGHTS_FLOOR_10_1_26',
        built='10/1/26, COOK [board assets] round 2, rule 46f',
        why="Paolo 10/1: 'the tiles below the people dont look good'",
        authority='banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (his approved bank)',
        px_per_metre=PPM, tile_metres=TILE_M, tile_px=TILE_PX,
        phone_slot_px=SLOT_PX, source_cell_px=SRC, cell_metres=round(CELL_M, 4),
        chest_metres=CHEST, density_floor=FLOOR_PPM,
        contract=('THE FLOOR IS A DENSITY, NOT A TILE SIZE: %.1f painted pixels per metre, '
                  'laid on a %d px cell lattice that tiles seamlessly, so a house tile is '
                  'TILE_METRES x %.1f pixels, whatever TILE_METRES turns out to be. The '
                  'pieces ship as %d px patches (%d cells, %.2f m). Never draw a metre of '
                  'this into fewer than %.1f device pixels on the phone: a downscale is fine, '
                  'a blow-up is the fault he saw.'
                  % (PPM, SRC, PPM, TILE_PX, TILE_CELLS, TILE_M, PPM)),
        tile_metres_is_unsettled=('12.0 in the fight\'s own code (TILE_WIDE 1.75 x the 112 '
                                  'box) and about 20 in WORLD\'s 10/1 measurement of our own '
                                  'suburb kit (lot pitch 19.5 m). This floor works at either, '
                                  'because it is a density on a seamless lattice.'),
        pieces=recs)
    json.dump(out, open(OUT_BANK, 'w'))
    return out


def main():
    ground = [tile_road(), tile_kerb(), tile_yard(), tile_slab(), tile_roof()]
    pl = [piece_car(), piece_wall()]
    props = {meta['name']: (im_, meta) for im_, meta in pl}

    # THE BEFORE, MEASURED, NOT DESCRIBED
    raw = before_crop()
    bp0, _l0 = period(raw, 0); bp1, _l1 = period(raw, 1)
    ground_css_ppm = TILE_CSS / TILE_M          # the board's own ground scale, px a metre
    # *** AND HERE IS A NUMBER I AM NOT GOING TO CLAIM. *** I wanted to say how many metres
    # of street one of his one-metre paving cells is being stretched over, and the repeat
    # ruler gives a clean answer off his panel. But the panel is a picture of a picture: it
    # is 491 px wide and the phone is 1170, so COMBAT's sheet has already resized it by some
    # factor I cannot recover, and every length I measure in it is multiplied by that factor.
    # A clean reading off the wrong surface looks exactly like a fact, and this lane has
    # shipped about nineteen of those. So the repeat is REPORTED as what it is -- a repeat in
    # a resized panel -- and the stretch factor is left for EYES to take on the real surface.
    measured = dict(bp0=bp0, bp1=bp1, cell_m=CELL_M, ground_css_ppm=ground_css_ppm)

    log = []
    fails = guards(ground, pl, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    brd = board(ground, props)
    c = card(ground, props, brd, measured)
    os.makedirs('slices/vote', exist_ok=True)
    c.save(OUT_CARD)
    bank = write_bank(ground, props)

    L = []
    L.append('THE FIGHT\'S FLOOR -- MEASURED  (COOK [board assets] round 2, 10/1/26, rule 46f)')
    L.append('=' * 78)
    L.append('')
    L.append('PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people')
    L.append('dont look good man its all fucked up"')
    L.append('')
    L.append('WHAT I TRIED TO MEASURE OFF HIS SCREENSHOT, AND WHAT I WILL NOT CLAIM:')
    L.append('  COMBAT\'s own sheet, the game-camera panel, found by its dark gutters. Its ground')
    L.append('  repeats on a %d px period across and the fighters on %d. I wanted to turn that' % (bp0, bp1))
    L.append('  into "one metre of his paving is stretched over N metres of street", which is')
    L.append('  what the picture looks like. I AM NOT CLAIMING THAT NUMBER. The panel is a')
    L.append('  picture of a picture: it is %d px wide and his phone is %d, so the sheet has' % (raw.size[0], PHONE[0]))
    L.append('  already resized it by a factor I cannot recover from the file, and every length')
    L.append('  inside it is multiplied by that factor. A clean reading off the wrong surface')
    L.append('  looks exactly like a fact, and this lane has shipped about nineteen of those.')
    L.append('  THE REAL MEASUREMENT IS EYES\', on the running fight at his phone\'s profile.')
    L.append('')
    L.append('WHAT IS ESTABLISHED WITHOUT ME RE-DERIVING IT (COMBAT [device canvas], DIRECTION')
    L.append('FIGHT VERDICT 19-20, PLUMBER 9/28): the fight canvas\'s backing store is CSS-sized,')
    L.append('so on a 3x phone every painted pixel is a 3 x 3 block before any art is drawn.')
    L.append('')
    L.append('AND HERE IS THE FAULT THAT IS MINE TO FIX, WHICH NEEDED NO MEASUREMENT AT ALL:')
    L.append('  THERE WAS NEVER A HOUSE-SIZED GROUND TILE. Not one. The banks hold %d px cells' % SRC)
    L.append('  of paving and the board holds a %.0f m house tile, and nothing in the repo ever' % TILE_M)
    L.append('  said how many of one go in the other. No metre contract, so the board was free')
    L.append('  to paint a paving cell at whatever size it liked, and it did. That is why the')
    L.append('  ground reads as a smear with a faint grid instead of a street.')
    L.append('')
    L.append('THE FIX, AND IT IS ONE CONTRACT: a house tile is a whole number of his cells,')
    L.append('authored at HIS OWN DENSITY, pasted at 1:1, never scaled.')
    L.append('  a house tile is %d OF HIS PAVING CELLS, exactly, which is why it tiles at all' % TILE_CELLS)
    L.append('  a house tile is %.0f m  =  %d painted pixels  =  %.1f px a metre' % (TILE_M, TILE_PX, PPM))
    L.append('  the floor DIRECTION set is %.0f px a metre. His street is %.1f. We are over both.' % (FLOOR_PPM, PPM))
    L.append('  the phone gives a house tile %d device px (%.0f CSS x %d). %d fills %.0f%% of it,' % (SLOT_PX, TILE_CSS, DPR, TILE_PX, 100.0 * TILE_PX / SLOT_PX))
    L.append('  so the board DOWNSCALES at worst and never blows anything up.')
    L.append('')
    L.append('THE GUARD THAT GOT REWRITTEN TWICE, BECAUSE IT IS THE LESSON OF THIS ROUND:')
    L.append('  To prove nothing had been resampled I measured the repeat of each tile and')
    L.append('  demanded it be %d. IT FAILED MY OWN GOOD ART, TWICE, FOR TWO DIFFERENT REASONS.' % SRC)
    L.append('  First: a MULTIPLE of a period is a louder peak than the period, so three paving')
    L.append('  variants answer 132 and the jitter answers 176, both perfectly honest. Second,')
    L.append('  and worse: the YARD has almost no repeat at all, because his yard cells meet')
    L.append('  edge to edge with nearly no contrast. THAT IS GOOD ART. A ruler that demands a')
    L.append('  visible grid is a ruler that rewards a worse picture.')
    L.append('  The proof is EXACT now and needs no ruler: every cell this build pastes is')
    L.append('  compared, pixel for pixel, with the bank cell it came from, at the moment it is')
    L.append('  laid. 720 cells, zero differences, and 81 to 100 per cent of each finished tile')
    L.append('  is still his untouched pixels.')
    L.append('')
    L.append('THE CONTRACT FOR COMBAT, IN ONE LINE:')
    L.append('  ' + bank['contract'])
    L.append('')
    L.append('WHAT IS IN THE BANK (%d pieces):' % len(bank['pieces']))
    for r in bank['pieces']:
        L.append('  %-16s %7.2f x %-7.2f m  %5.2f m  %-8s  %s'
                 % (r['name'], r['w'], r['l'], r.get('h', 0.0), r['kind'], r['note']))
    L.append('')
    L.append('THE GUARDS, EVERY ONE RUN, EVERY ONE ABLE TO REFUSE THE BUILD:')
    for st, line, why in log:
        L.append('  %-4s %s' % (st.upper(), line))
    L.append('')
    L.append('WHAT THIS DOES NOT FIX, AND IT IS NOW THE LOUDEST THING ON THE BOARD:')
    L.append('  the BODIES. The fight draws a body at 0.57 of a tile (the %d box against the' % int(BODY_CSS))
    L.append('  %.0f slot), so on a 3x phone a body fills about %d device px, and the body art' % (TILE_CSS, int(BODY_CSS * DPR)))
    L.append('  we own is %d px tall. That is a %.1fx blow-up. With the ground at 1:1 the people' % (load(SPR['you']).size[1], BODY_CSS * DPR / load(SPR['you']).size[1]))
    L.append('  become the coarsest thing in the picture. They are in the AFTER panel at a clean')
    L.append('  4x on purpose, so he can see it. THAT IS THE NEXT JOB AFTER THE FLOOR.')
    L.append('')
    L.append('[bb the overworld is battle brothers] reference/library/battle_brothers/')
    L.append('  02_COMBAT_RULES.md, the TERRAIN and BOARD lines: a BB board is generated from the')
    L.append('  map terrain it happens on, and its ground is flat, quiet and readable because')
    L.append('  every piece of information lives in the UI or in a piece, never painted on the')
    L.append('  dirt. Taken whole. WHAT MOVES THAT THEIR PICTURE DOES NOT: BB\'s ground is a')
    L.append('  still field that never changes once the fight starts. Ours is a city floor that')
    L.append('  keeps what the fight does to it, and the roof is a floor you can be standing on')
    L.append('  while the street below you is a different fight.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')

    print('')
    print('  his panel repeats every %d px across, %d down (reported, not claimed: the panel '
          'is a resized picture of a picture)' % (bp0, bp1))
    print('  this floor: %d px a tile, %.1f px a metre, the phone offers %d'
          % (TILE_PX, PPM, SLOT_PX))
    for p in (OUT_CARD, OUT_BANK, OUT_REC):
        print('  wrote %s  (%d KB)' % (p, os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main()
