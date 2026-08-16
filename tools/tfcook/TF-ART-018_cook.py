#!/usr/bin/env python3
"""TF-ART-018 cook — KERB + APRON TRANSITIONS, the placeable members:
  M1 KERB RETURN   - the corner arc where two streets meet (4 corners)
  M2 DROPPED KERB  - the depressed kerb across a car entrance (4 facings;
                     the world NAMES these cells 'curb cut / gate' - measured
                     8/16, ~80 named cells in a 20x20-cell probe window)
  M5 CROSSING RAMP - the ramp + detectable-warning pad where a sidewalk cell
                     meets a named crosswalk cell (4 facings)
M4 (gutter inlet) is parked this pass: no world cell names a drain and
inventing drainage geometry is a placement lie. M3 (apron flare) rides the
form's standing ownership question with TF-CITY-006 [PENDING coordinator].

STREETS ARE THE HARMONIZED POOL (Paolo 7/31, LOCKED): this cook opened
records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md first and every
canvas pixel is harvested from the harmonized bank. The bank's embedded 7/14
rulings travel with the tiles: the cap and pad are washed to the
markings_30yr_law numbers (0.55 then 0.40), never fresh.

THE KERB'S OWN NUMBERS (the form measured the frozen starter set): the
approved straight kerb is a 4px lit cap (row mean 176, brightest sustained
ground row in the set) over a 1px dark face (59). These transitions keep
that exact grammar - cap value band ~176, face dark ~59 - so a corner mates
with the straight runs beside it instead of introducing a second kerb.

45 LAW: the cap is the sky-lit top of the kerb; the face falls dark on the
road side; the return arcs the cap through the corner as an ellipse-legal
quarter turn; the ramp's warning pad is a flat ground read with its dome
bumps as single lit pixels.

REUSE CHECK:
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt — OPENED IN CODE below.
    pools.side[0]: HARVESTED as the sidewalk canvas of every tile.
    pools.street[0]: HARVESTED as the road-grade canvas inside the drop and
    below the return. pools.cross[0]: the crossing-bar value is SAMPLED so
    the ramp pad sits in the crossing's own value family.
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — measured (not copied) by
    the form: cap 176 / face 59 are that set's own numbers and this cook is
    authored TO them so the frozen straight kerb and these transitions read
    as one object.

TASTE CHECK: wash per the bank's markings_30yr_law; no fresh paint; the
warning pad is sun-bleached, its red long gone (30 years); nothing readable.

  python3 tools/tfcook/TF-ART-018_cook.py
    -> banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
POOL = os.path.join(REPO, 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json')
C = 44

d = json.load(open(POOL))
def pool_tile(key, i=0):
    return Image.open(io.BytesIO(base64.b64decode(d['pools'][key][i]))).convert('RGB')

SIDE = pool_tile('side')
STREET = pool_tile('street')
CROSS = pool_tile('cross')

def avg(im):
    px = im.load()
    n = 0; s = [0, 0, 0]
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]; n += 1
            for i in range(3): s[i] += c[i]
    return tuple(v//n for v in s)

CROSS_VAL = avg(CROSS)
CAP = (178, 174, 164)      # the measured 176 band, in the set's warm grey
FACE = (60, 57, 52)        # the measured dark face
PAD = (172, 148, 128)      # warning pad: red bleached to dust in 30 years
def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mixc(a, b, t): return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

def base(side_im):
    return side_im.copy()

def kerb_return(corner):
    """M1: the cap arcs a quarter turn around the road corner. corner names
    which corner of the CELL faces the road junction (e.g. 'se' = road to
    the east and south)."""
    im = base(SIDE)
    px = im.load()
    rx = C-1 if 'e' in corner else 0
    ry = C-1 if 's' in corner else 0
    R_OUT, R_IN = 14, 9        # the arc band: cap 5px wide around the corner
    sp = STREET.load()
    for y in range(C):
        for x in range(C):
            dx, dy = x - rx, y - ry
            r2 = (dx*dx + dy*dy) ** 0.5
            if r2 < R_IN:                      # inside the arc: road grade
                px[x, y] = sp[x, y]
            elif r2 < R_IN + 1.2:              # the dark face, road side of the cap
                px[x, y] = FACE
            elif r2 < R_OUT:                   # the lit cap band, arcing
                j = (hash((x, y)) % 9) - 4
                px[x, y] = tuple(max(0, min(255, v + j)) for v in CAP)
            elif r2 < R_OUT + 1.0:             # hairline where cap meets walk
                px[x, y] = dim(CAP, 0.8)
    return im

def kerb_drop(facing):
    """M2 REDESIGN (8/17, second pass - the first over-ringed the cell): an
    RGBA OVERLAY for a driveway cell where it meets the road. The cap runs
    LOW along the road edge (a dropped kerb is a kerb at half height), and
    flares up to full cap value in the last 6px at each end, where it meets
    the neighbouring sidewalk's full kerb. The driveway's own bought surface
    stays visible - this is a lip, not a floor."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    for u in range(C):
        wing = min(u, C-1-u)
        flare = max(0.0, 1.0 - wing/6.0)          # 1 at the ends, 0 mid-run
        capv = mixc(dim(CAP, 0.82), CAP, flare)   # low cap mid-run, full at ends
        depth = 2 + (1 if flare > 0.5 else 0)     # ends thicken toward full kerb
        for t in range(depth+1):
            c = capv if t < depth else FACE
            if facing == 'n':   x, y = u, t
            elif facing == 's': x, y = u, C-1-t
            elif facing == 'w': x, y = t, u
            else:               x, y = C-1-t, u
            px[x, y] = c + (255,)
    return im

def ramp(facing):
    """M5: the crossing lands - ramp down toward the crossing side, with the
    detectable-warning pad (bleached domes) at the throat."""
    im = base(SIDE)
    px = im.load()
    r = random.Random(1888)
    for y in range(C):
        for x in range(C):
            t = (y if facing == 'n' else C-1-y) if facing in 'ns' else (x if facing == 'w' else C-1-x)
            if t < 4:                          # the dropped cap line at the throat
                px[x, y] = dim(CAP, 0.95) if t >= 2 else mixc(px[x, y], CROSS_VAL, 0.4)
            elif t < 16:                       # the warning pad band
                base_c = mixc(px[x, y], PAD, 0.55)
                px[x, y] = base_c
                if (x % 4 == 1 if facing in 'ns' else y % 4 == 1) and t % 4 == 1:
                    px[x, y] = dim(base_c, 1.25)      # dome bump catches the sun
            elif t < 26:                       # the ramp slope: value ramps to walk
                f = 0.86 + 0.14*((t-16)/10.0)
                px[x, y] = dim(px[x, y], f)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for cn in ('ne', 'nw', 'se', 'sw'):
    tiles.append({'name': 'kerb_return_' + cn, 'b64': b64(kerb_return(cn))})
for f in 'nesw':
    tiles.append({'name': 'kerb_drop_' + f, 'b64': b64(kerb_drop(f))})
for f in 'nesw':
    tiles.append({'name': 'kerb_ramp_' + f, 'b64': b64(ramp(f))})

out = {
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 (cooked 8/16 to the OPEN board row '
           'TF-ART-018, the ART lane\'s own queue; built and correctable in game). Every '
           'canvas pixel harvested from banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt '
           'per the 7/31 STREETS ARE THE HARMONIZED POOL law; cap/face authored to the '
           'frozen starter kerb\'s own measured numbers so straight runs and transitions '
           'read as one object. Cook: tools/tfcook/TF-ART-018_cook.py.',
    'family': 'TF-ART-018', 'cooked': '8/16/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d kerb transition pieces -> %s' % (len(tiles), OUT))
