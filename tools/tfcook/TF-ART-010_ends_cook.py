#!/usr/bin/env python3
"""TF-ART-010 TRACK ENDS volume cook — buffers and sand tapers for the yard's
track ends. The 8/11 TILE BOARD approval of TF-ART-010 lists turnouts,
crossings, buffers and the vertical mainline as named volume; this cooks the
BUFFER half plus the honest state of every other end. Ships under the family
approval per EVERYTHING IS A THUMB (8/9).

MEASURED FIRST (8/16 probe, the placement law): the walked world's rail is
the classification yard only - 2,727 track cells, all east-west, 517 east
ends and 517 west ends, ZERO road adjacency (no level crossing exists to
dress; parked). A thousand buffer stops would be a lie - a real dead yard
has steel stops on SOME stubs and thirty years of blown sand burying the
rest. So: rail_buffer_e/w on about one end in four, rail_taper_e/w (the
rails dive under a sand drift) on the rest.

45 LAW: the buffer is a steel frame seen from the world's three-quarter
view - lit top faces on the beam and posts, dark web below, shadow cast
east-down onto the ballast. The taper is a ground read: the drift mounds
toward the viewer with its lit top edge.

REUSE CHECK:
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    rail_plate_0: HARVESTED as the literal base canvas of all four tiles
    (the yard's own approved ballast), and its rail/steel pixels sampled for
    the buffer's metal so the stop matches the track it ends.
  banks/tileforms/TF-ART-014_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    bare_plot_0: HARVESTED for the blown-sand drift colour (the valley's own
    dead soil, not a guessed tan).

TASTE CHECK: rusted steel, never fresh paint; the drift is the desert
reclaiming the yard, not tidy gravel; nothing readable, nothing lit.

  python3 tools/tfcook/TF-ART-010_ends_cook.py
    -> banks/tileforms/TF-ART-010_ENDS_VOLUME_8_16_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAIL_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json')
FARM_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-014_CANDIDATES_8_8_26.json')
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-010_ENDS_VOLUME_8_16_26.json')
C = 44

def tile(bankpath, name):
    bank = json.load(open(bankpath))
    for t in bank['tiles']:
        if t['name'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGB')
    raise SystemExit('missing harvest tile %s in %s' % (name, bankpath))

ballast = tile(RAIL_BANK, 'rail_plate_0')
soil = tile(FARM_BANK, 'bare_plot_0')

def avg(im, box):
    d = list(im.crop(box).getdata())
    return tuple(sum(c[i] for c in d)//len(d) for i in range(3))

STEEL_D = (52, 48, 44)          # rusted web, kept off-black
STEEL_L = (118, 106, 92)        # lit rust top face
SAND = avg(soil, (4, 4, 40, 40))
def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)

rng = random.Random(81616)

def buffer_stop(east):
    """steel stop on the family ballast: a THICK cross beam facing the track,
    two raked posts with lit top caps, real shadow. Mirrored by construction."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    r = random.Random(7 if east else 8)
    d = 1 if east else -1
    beamx = 31 if east else 12
    # the raked back-posts first (behind the beam): from beam top toward the
    # closed side and down, 3px thick, top face lit
    for py0 in (9, 25):
        for k in range(12):
            x = beamx + d*(2 + k//3)
            y = py0 + k
            for w in range(3):
                xx = x + d*w
                if 0 <= xx < C and 0 <= y < C:
                    px[xx, y] = dim(STEEL_D, 1.15 if k == 0 else (0.9 if w == 1 else 0.7)) + (255,)
    # the cross beam: 5px thick vertical bar spanning both rails, banded
    # highlight / face / web / shadow so it has MASS
    for y in range(6, 41):
        for w in range(5):
            x = beamx + d*w
            if 0 <= x < C:
                c = (dim(STEEL_L, 1.2), STEEL_L, dim(STEEL_D, 1.15), STEEL_D, dim(STEEL_D, 0.65))[w]
                j = (hash((y//2, w)) % 9) - 4
                px[x, y] = tuple(max(0, min(255, v + j)) for v in c) + (255,)
    # lit top cap of the beam (45 law: the sky hits the top face)
    for w in range(5):
        x = beamx + d*w
        if 0 <= x < C:
            px[x, 6] = dim(STEEL_L, 1.35) + (255,)
            px[x, 7] = dim(STEEL_L, 1.2) + (255,)
    # beam feet: base plates where it meets the ballast
    for y in (39, 40):
        for w in range(-1, 6):
            x = beamx + d*w
            if 0 <= x < C:
                px[x, y] = dim(STEEL_D, 0.8) + (255,)
    # cast shadow onto the ballast, away from the track
    for y in range(8, 41):
        for k in range(2):
            sx = beamx + d*(6+k)
            if 0 <= sx < C:
                px[sx, y] = (0, 0, 0, 80 - 30*k)
    # rust bleeding down the beam face
    for _ in range(18):
        x = beamx + d*r.randint(0, 4)
        y = r.randint(8, 38)
        if 0 <= x < C and px[x, y][3] > 0:
            px[x, y] = dim(px[x, y][:3], r.uniform(0.75, 0.95)) + (255,)
    return im

def taper(east):
    """the rails dive under thirty years of blown sand: an IRREGULAR drift,
    noisy fingers, feathered edge, one rail tip still showing through."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    r = random.Random(17 if east else 18)
    # per-row depth: mounded but noisy, so the edge is fingers not a wedge
    depths = []
    for y in range(C):
        mound = max(0.0, 1.0 - abs(y - 21)/26.0)
        depths.append(int(24 * mound + r.randint(-4, 5)))
    # smooth once so fingers connect
    depths = [max(0, (depths[max(0,y-1)] + depths[y]*2 + depths[min(C-1,y+1)])//4) for y in range(C)]
    for y in range(C):
        depth = depths[y]
        for k in range(depth):
            x = (C-1-k) if east else k
            base = SAND
            j = (hash((x, y//2)) % 13) - 6
            c = tuple(max(0, min(255, v + j)) for v in base)
            if k >= depth-2 and depth > 3:
                # feathered crest: lit, and broken by gaps
                if r.random() < 0.35: continue
                c = dim(c, 1.15)
            if k < 3:
                c = dim(c, 0.9)     # deep side settles darker
            px[x, y] = c + (255,)
    # ripple lines across the drift (wind writes on sand)
    for ry in (14, 22, 30):
        for k in range(4, max(5, depths[ry]-3)):
            x = (C-1-k) if east else k
            if 0 <= x < C and r.random() < 0.7 and px[x, ry][3] > 0:
                px[x, ry] = dim(px[x, ry][:3], 0.88) + (255,)
    # one rail tip still poking through near the open side
    tipy = 18
    for k in range(3):
        x = (C-1-depths[tipy]-k) if east else (depths[tipy]+k)
        if 0 <= x < C:
            px[x, tipy] = STEEL_L + (255,)
            px[x, tipy+1] = dim(STEEL_D, 0.9) + (255,)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'rail_buffer_e', 'b64': b64(buffer_stop(True))},
    {'name': 'rail_buffer_w', 'b64': b64(buffer_stop(False))},
    {'name': 'rail_taper_e', 'b64': b64(taper(True))},
    {'name': 'rail_taper_w', 'b64': b64(taper(False))},
]
out = {
    'law': 'APPROVED by Paolo 8/11/26 (TILE BOARD sitting, TF-ART-010 UP; the form names '
           'buffers as VOLUME; EVERYTHING IS A THUMB 8/9: volume under an approved family '
           'ships built and correctable). Cooked 8/16 ON the family ballast - see '
           'tools/tfcook/TF-ART-010_ends_cook.py.',
    'family': 'TF-ART-010', 'cooked': '8/16/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d pieces -> %s' % (len(tiles), OUT))
