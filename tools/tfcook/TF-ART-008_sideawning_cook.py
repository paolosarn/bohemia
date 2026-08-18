#!/usr/bin/env python3
"""TF-ART-008 SIDE-FACING AWNING volume cook — the vertical-run remainder.

MEASURED FIRST (8/17, the awning wiring pass): downtown's overhead awning
cells include long VERTICAL runs along east- and west-facing shopfronts, and
the family's approved awning drops are authored for SOUTH-FACING fronts -
stamped sideways they read as a dark ribbon, so those runs were excluded and
side-facing drops became the named volume remainder. This cooks them.

WHAT A SIDE AWNING IS AT THE 45 VIEW: a continuous canopy jutting E or W
from the facade, seen mostly as its sky-lit FABRIC TOP (a plane bowing
toward the viewer), with the torn VALANCE edge on the street side and the
dark gap under the fabric line. Thirty years dead: the fabric is bleached,
sagging between arms, torn through in places so the sidewalk shows.

45 LAW: fabric top lit (sky hits it), a 1px brighter crest along the street-
side edge curve, valance falls dark, support arms are single dark pixels at
the facade side every few rows. No straight ruled edge - the sag writes a
soft scallop per arm bay.

REUSE CHECK:
  banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    sf_awning_rust_0 / _teal_0 / _sand_stripe_0 / _sage_0: the fabric COLOUR
    of each side drop is SAMPLED from the family's own approved south-facing
    drop of the same colourway, so a shop that turns a corner keeps one
    awning colour around it. sand_stripe keeps its stripe (sampled two-tone).
  No other bank holds awning fabric; geometry cooked fresh, colours harvested.

TASTE CHECK: bleached fabric, never fresh; tears show the ground through
(RGBA holes), never black voids; nothing lit from below (power is territory).

  python3 tools/tfcook/TF-ART-008_sideawning_cook.py
    -> banks/tileforms/TF-ART-008_SIDEAWNING_VOLUME_8_18_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SF_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json')
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-008_SIDEAWNING_VOLUME_8_18_26.json')
C = 44

sf = json.load(open(SF_BANK))
def tile(name):
    for t in sf['tiles']:
        if t['name'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGBA')
    raise SystemExit('missing harvest tile ' + name)

def fabric_colours(name):
    """the two dominant opaque colours of the family's own drop (base + accent)."""
    im = tile(name)
    px = im.load()
    seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//12, c[1]//12, c[2]//12)
                seen.setdefault(k, []).append(c[:3])
    pools = sorted(seen.values(), key=len, reverse=True)[:2]
    out = []
    for p in pools:
        out.append(tuple(sum(v[i] for v in p)//len(p) for i in range(3)))
    if len(out) == 1:
        out.append(out[0])
    return out

CW = {}
for cw in ('rust', 'teal', 'sand_stripe', 'sage'):
    CW[cw] = fabric_colours('sf_awning_' + cw + '_0')

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)

def side_drop(cw, west, seed):
    """one cell of a continuous N-S awning. west=True: facade west of the
    cell, fabric occupies the left ~24px, torn valance edge toward the street
    (right). Mirrored by construction for east."""
    base, accent = CW[cw]
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    px = im.load()
    r = random.Random(8800 + seed + (0 if west else 100))
    W = 24
    # the sag scallop: edge depth varies down the cell (arm bays every ~11px)
    for y in range(C):
        bay = (y % 11) / 11.0
        sag = int(3.0 * (1.0 - abs(bay*2 - 1.0)))           # 0 at arms, 3 mid-bay
        edge = W - sag
        torn = r.random() < 0.06                             # a run of missing fabric
        for k in range(edge):
            x = k if west else C-1-k
            # stripe colourway keeps its stripe, along the run
            c = accent if (cw == 'sand_stripe' and (y//4) % 2 == 0) else base
            j = (hash((k, y//3)) % 11) - 5
            c = tuple(max(0, min(255, v + j)) for v in c)
            f = 1.0 - 0.25*(k/float(W))                      # falls off toward the edge
            c = dim(c, 0.85 + 0.3*f)
            if torn and k > 4 and r.random() < 0.7:
                continue                                     # the ground shows through
            px[x, y] = c + (255,)
        # the lit crest along the street-side curve (45 law)
        cx2 = (edge-1) if west else (C-edge)
        if 0 <= cx2 < C and px[cx2, y][3] > 0:
            px[cx2, y] = dim(px[cx2, y][:3], 1.3) + (255,)
        # valance shadow pixel just past the crest
        vx = edge if west else C-1-edge
        if 0 <= vx < C:
            px[vx, y] = (20, 18, 16, 120)
        # support arm at each bay line, facade side
        if y % 11 == 0:
            ax = 1 if west else C-2
            px[ax, y] = (52, 48, 44, 255)
            px[ax + (1 if west else -1), y] = (76, 70, 62, 255)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for cw in ('rust', 'teal', 'sand_stripe', 'sage'):
    for side, west in (('w', True), ('e', False)):
        for v in (0, 1):
            tiles.append({'name': 'awn_side_%s_%s_%d' % (side, cw, v),
                          'b64': b64(side_drop(cw, west, v))})

out = {
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 (volume under the 8/11-approved '
           'TF-ART-008 family, whose form names awnings as volume; the 8/17 wiring '
           'measured the side-facing remainder). Fabric colours sampled from the '
           'family\'s own approved drops - tools/tfcook/TF-ART-008_sideawning_cook.py.',
    'family': 'TF-ART-008', 'cooked': '8/18/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d side-awning pieces -> %s' % (len(tiles), OUT))
