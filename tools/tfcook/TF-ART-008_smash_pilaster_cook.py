#!/usr/bin/env python3
"""TF-ART-008 SMASH + PILASTER volume cook — the last two named volume items
of the storefront family ("Signbands, pilasters, ends and the smashed pair
are volume", the 8/11-approved form). Ships under the family approval per
EVERYTHING IS A THUMB (8/9): built, wired, correctable in game.

WHAT THEY ARE (research, 8/15):
- THE SMASHED FRONT: thirty years after the crash the ground floor of a dead
  retail block has been gone through. A looted bay is not "cracked glass" -
  the pane is GONE: black interior void, the anodized frame bent where it was
  pried, a low drift of dulled glass grit at the sill line inside and out.
  Looters enter at street level, so ONLY the bottom row of a glass run
  smashes; the upper glazing survives (nobody ladders up to break more).
- THE PILASTER: a strip-front reads in bays because masonry piers divide the
  aluminium storefront system every bay or two. A narrow painted-masonry pier
  overlay at each 2-cell segment boundary gives the block its rhythm and
  kills the endless-curtain-wall read.

45 LAW: both are wall-face elements. The pilaster carries a 2px sky-lit cap
course where it meets the signband line and a 1px lit left arris; the smashed
bay keeps the family's frame geometry (harvested) so the hole reads as THAT
bay, broken.

REUSE CHECK:
  banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    sf_bay_tall_0: HARVESTED as the literal base of the smashed tiles - the
    smash is cooked ON the family's own bay art (frame kept, pane knocked
    out), so a broken bay matches the intact bay beside it pixel for pixel.
    sf_boarded_0: palette anchor for the pilaster's painted masonry.
  banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    brick_painted_ghost_0: the 30-year wash target for the pier paint.
  No bank holds a smashed-glass or pier tile (walked banks/tileforms/);
  geometry cooked fresh, base art and every colour harvested.

TASTE CHECK: the void is DARK, never a lit interior (power is territory).
Glass grit is dull grey-green, never sparkling. No boards over the smash -
boarded is its own segment treatment already. The pier is washed paint over
masonry, low sat by construction. Nothing readable, nothing lit.

  python3 tools/tfcook/TF-ART-008_smash_pilaster_cook.py
    -> banks/tileforms/TF-ART-008_SMASH_VOLUME_8_15_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SF_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json')
BR_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json')
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-008_SMASH_VOLUME_8_15_26.json')
C = 44

def tile(bank, name, mode='RGB'):
    for t in bank['tiles']:
        if t['name'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert(mode)
    raise SystemExit('missing harvest tile ' + name)

sf = json.load(open(SF_BANK))
br = json.load(open(BR_BANK))
bay = tile(sf, 'sf_bay_tall_0')
boarded = tile(sf, 'sf_boarded_0')
ghostbr = tile(br, 'brick_painted_ghost_0')

def avg(im, box):
    data = list(im.crop(box).getdata())
    return tuple(sum(c[i] for c in data)//len(data) for i in range(3))

PAINT = avg(boarded, (4, 4, 40, 20))
CHALK = avg(ghostbr, (4, 4, 40, 40))
def wash(c, t): return tuple(int(c[i] + (CHALK[i]-c[i])*t) for i in range(3))
def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)

rng = random.Random(81515)

# ---- THE SMASHED BAY: the family's own bay art with the pane knocked out
def smash(seed):
    im = bay.copy()
    px = im.load()
    r = random.Random(seed)
    # find the pane region: the dark glazing inside the frame. The family bay
    # keeps a light frame at the tile border; treat x 4..40, y 6..40 as pane.
    x0, y0, x1, y1 = 5, 7, 39, 40
    # the pane becomes VOID: near-black, with a ragged remaining-glass fringe
    for y in range(y0, y1):
        for x in range(x0, x1):
            px[x, y] = (7, 8, 9)
    # ragged fringe: shards still in the frame around the edge of the void
    for x in range(x0, x1):
        for edge_y, drop in ((y0, 1), (y1-1, -1)):
            if r.random() < 0.5:
                ln = r.randint(1, 3)
                for k in range(ln):
                    yy = edge_y + drop*k
                    if y0 <= yy < y1:
                        g = r.randint(60, 95)
                        px[x, yy] = (g, g+8, g+6)
    for y in range(y0, y1):
        for edge_x, step in ((x0, 1), (x1-1, -1)):
            if r.random() < 0.4:
                ln = r.randint(1, 3)
                for k in range(ln):
                    xx = edge_x + step*k
                    if x0 <= xx < x1:
                        g = r.randint(60, 95)
                        px[xx, y] = (g, g+8, g+6)
    # pried frame: one jamb kinked, a few bright metal nicks
    kx = x0 if r.random() < 0.5 else x1-1
    for y in range(y0+4, y0+14):
        px[max(0, min(C-1, kx + (1 if (y % 3) else 0))), y] = (150, 152, 148)
    # glass grit drift at the sill, dull, inside and out
    for x in range(2, C-2):
        if r.random() < 0.7:
            g = r.randint(70, 105)
            px[x, y1 + r.randint(0, 2)] = (g, g+6, g+4)
    return im

# ---- THE PILASTER: a 12px painted-masonry pier overlay on the LEFT edge
def pilaster(band_t):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    pc = wash(PAINT, band_t)
    W = 12
    for y in range(C):
        for x in range(W):
            c = pc
            j = (hash((x, y//6)) % 9) - 4          # coursed masonry under paint
            c = tuple(max(0, min(255, v + j)) for v in c)
            if x == 0:
                c = dim(c, 1.25)                    # lit left arris (45 law)
            elif x >= W-2:
                c = dim(c, 0.72)                    # return shadow into the bay
            if y < 2:
                c = dim(c, 1.3)                     # sky-lit cap course
            if y % 11 == 10:
                c = dim(c, 0.85)                    # paint-filled coursing line
            px[x, y] = c + (255,)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'sf_smashed_0', 'b64': b64(smash(1))},
    {'name': 'sf_smashed_1', 'b64': b64(smash(2))},
    {'name': 'sf_pilaster_0', 'b64': b64(pilaster(0.5))},
    {'name': 'sf_pilaster_1', 'b64': b64(pilaster(0.62))},
]
out = {
    'law': 'APPROVED by Paolo 8/11/26 (TILE BOARD sitting, TF-ART-008 UP; the form names '
           'the smashed pair and pilasters as VOLUME; EVERYTHING IS A THUMB 8/9: volume '
           'under an approved family ships built and correctable). Cooked 8/15 ON the '
           'family bay art - see tools/tfcook/TF-ART-008_smash_pilaster_cook.py.',
    'family': 'TF-ART-008', 'cooked': '8/15/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d pieces -> %s' % (len(tiles), OUT))
