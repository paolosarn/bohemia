#!/usr/bin/env python3
"""TF-ART-008 SIGNBAND volume cook — the dead sign fascia above the storefront
glass. The 8/11 TILE BOARD approval of TF-ART-008 names signbands as VOLUME
("Signbands, pilasters, ends and the smashed pair are volume"), so these ship
under that approval per EVERYTHING IS A THUMB (8/9): built, wired, correctable
in game.

WHAT A DEAD VEGAS SIGNBAND IS (research, 8/15): a strip-mall / downtown retail
fascia is a raceway-mounted channel-letter band on a painted or ACM fascia.
Thirty years after the crash you get three states: (1) the PAINTED-OVER band -
an owner's colour block with nothing on it any more; (2) GHOST LETTERS - the
channel letters were salvaged (aluminium is money) and what remains is the
unweathered silhouette where the letters kept the sun off the paint, plus the
raceway line and mounting holes; (3) BROKEN CHANNEL - a few letter cans still
hang, dark (power is territory and this block has none), one skewed off its
mount. Ghost lettering is the single strongest "dead retail" read there is.

45 LAW: the band is a shallow box on the wall face seen from the world's
three-quarter view - its TOP CAP catches the sky (2px lit course bowing
toward the viewer), the face sits below it, and a 1px drop shadow lands on
the wall under the band. No flat side-on strip.

REUSE CHECK:
  banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    sf_boarded_0 / sf_bay_tall_0: HARVESTED as the palette anchors - the band
    colours are resampled from the family's own weathered paint and frame
    metal so the fascia sits in the same world as the glass below it. The
    ghost-letter "unweathered" value is the band colour lifted toward its
    pre-wash value (the letters kept the sun off), never a new white.
  banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    brick_painted_ghost_0: HARVESTED for the chalked-wash treatment (the
    30-year fade convention every painted surface in this valley follows).
  No existing bank holds a fascia/signband tile (walked banks/tileforms/ and
  the harmonized street pool - markings and roadway only), so the geometry is
  cooked fresh here; every colour is harvested.

TASTE CHECK: NEVER a lit sign (power is territory; downtown is dark). NEVER
saturated new paint (30-year wash law). Ghost letters are BLOCKY ABSTRACT
silhouettes, never readable words (words are Paolo's; a legible sign name is
canon he has not written). One band colour per run segment, decided at
placement, so a block reads as different dead shops.

  python3 tools/tfcook/TF-ART-008_signband_cook.py
    -> banks/tileforms/TF-ART-008_SIGNBAND_VOLUME_8_15_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SF_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json')
BR_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json')
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-008_SIGNBAND_VOLUME_8_15_26.json')
C = 44

def tile(bank, name):
    for t in bank['tiles']:
        if t['name'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGB')
    raise SystemExit('missing harvest tile ' + name)

sf = json.load(open(SF_BANK))
br = json.load(open(BR_BANK))
boarded = tile(sf, 'sf_boarded_0')     # weathered paint palette anchor
bay     = tile(sf, 'sf_bay_tall_0')    # frame metal palette anchor
ghostbr = tile(br, 'brick_painted_ghost_0')  # the wash convention

def avg(im, box):
    px = im.crop(box)
    data = list(px.getdata())
    n = len(data)
    return tuple(sum(c[i] for c in data)//n for i in range(3))

# harvested colour anchors
PAINT   = avg(boarded, (4, 4, 40, 20))          # weathered painted wood
METAL   = avg(bay, (2, 2, 42, 10))              # dead frame aluminium
CHALK   = avg(ghostbr, (4, 4, 40, 40))          # the 30yr wash target

def wash(c, t):
    """pull a colour toward the chalked wash by t (the 30-year fade)."""
    return tuple(int(c[i] + (CHALK[i]-c[i])*t) for i in range(3))

def dim(c, f):
    return tuple(max(0, min(255, int(v*f))) for v in c)

# three dead-shop band colours, all harvested-then-washed, low sat by construction
BANDS = [wash(dim((PAINT[0]+20, PAINT[1]-4, PAINT[2]-10), 0.9), 0.45),   # oxblood-ish
         wash(dim((PAINT[0]-14, PAINT[1]+4, PAINT[2]-2), 0.85), 0.5),    # dead green-grey
         wash((PAINT[0], PAINT[1], PAINT[2]), 0.55)]                     # painted-over tan

rng = random.Random(81508)
BT, BB = 10, 36            # band top/bottom rows on the face (26px deep fascia)

def base_cell(band):
    """the fascia box on a transparent cell: lit top cap, face, drop shadow."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    for y in range(BT, BB):
        for x in range(C):
            c = band
            # face weathers streaky: per-column wash jitter
            j = (hash((x, 7)) % 13) - 6
            c = tuple(max(0, min(255, v + j)) for v in c)
            if y == BT or y == BT+1:
                c = dim(c, 1.35)                       # sky-lit top cap (45 law)
            elif y == BT+2:
                c = dim(c, 1.12)
            elif y >= BB-2:
                c = dim(c, 0.78)                       # underside falls dark
            px[x, y] = c + (255,)
    for x in range(C):                                  # 1px drop shadow on the wall
        px[x, BB] = (0, 0, 0, 70)
    return im

def add_raceway(im):
    px = im.load()
    y = BT + 12
    for x in range(C):
        c = dim(METAL, 0.85)
        px[x, y] = c + (255,)
    return im

def add_ghost(im, band, seed):
    """unweathered letter silhouettes: the band colour PRE-wash, blocky shapes."""
    px = im.load()
    r = random.Random(seed)
    fresh = wash(band, -0.35)          # lift back toward pre-fade
    x = r.randint(2, 6)
    while x < C - 6:
        w = r.randint(4, 7)
        h = r.randint(10, 14)
        y0 = BT + 6 + r.randint(0, 3)
        for yy in range(y0, min(y0+h, BB-3)):
            for xx in range(x, min(x+w, C-2)):
                if r.random() < 0.9:
                    px[xx, yy] = fresh + (255,)
        # mounting holes where the can was bolted through
        px[min(x+1, C-1), min(y0+1, C-1)] = dim(band, 0.5) + (255,)
        x += w + r.randint(3, 6)
    return im

def add_broken(im, seed):
    """a few dead letter cans still hanging, one skewed."""
    px = im.load()
    r = random.Random(seed)
    can = dim(METAL, 0.55)
    dark = dim(can, 0.6)
    x = r.randint(3, 8)
    n = 0
    while x < C - 8 and n < 3:
        w = r.randint(5, 8)
        h = r.randint(11, 15)
        y0 = BT + 5 + r.randint(0, 2)
        skew = 1 if (n == 1) else 0     # the middle can hangs off its mount
        for yy in range(y0, min(y0+h, BB-2)):
            dx = skew * ((yy - y0) // 4)
            for xx in range(x+dx, min(x+dx+w, C-2)):
                edge = (yy == y0) or (xx == x+dx) or (xx == min(x+dx+w, C-2)-1)
                px[xx, yy] = (can if edge else dark) + (255,)
        px[x, min(y0, C-1)] = dim(METAL, 1.1) + (255,)   # top edge catch
        x += w + r.randint(5, 9)
        n += 1
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for i, band in enumerate(BANDS):
    tiles.append({'name': 'sb_blank_%d' % i, 'b64': b64(add_raceway(base_cell(band)))})
    tiles.append({'name': 'sb_ghost_%d' % i, 'b64': b64(add_ghost(add_raceway(base_cell(band)), band, 100+i))})
tiles.append({'name': 'sb_broken_0', 'b64': b64(add_broken(add_raceway(base_cell(BANDS[0])), 300))})
tiles.append({'name': 'sb_broken_1', 'b64': b64(add_broken(add_raceway(base_cell(BANDS[1])), 301))})

out = {
    'law': 'APPROVED by Paolo 8/11/26 (TILE BOARD sitting, TF-ART-008 UP; the form names '
           'signbands as VOLUME, and EVERYTHING IS A THUMB 8/9: volume under an approved '
           'family ships built and correctable, never queued). Cooked 8/15 from harvested '
           'family palette - see tools/tfcook/TF-ART-008_signband_cook.py REUSE CHECK.',
    'family': 'TF-ART-008', 'cooked': '8/15/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d signband pieces -> %s' % (len(tiles), OUT))
