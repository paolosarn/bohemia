#!/usr/bin/env python3
"""TF-ART-017 WALL CORNER + OPENING REVEAL — the thickness pass, first slice.

THE JOB (form, HIGH, board row 97): every building in Bohemia is a cardboard
box - its vertical edges are flat lit/shaded strips that never turn, and a
window is a picture pasted on the wall (PIXEL CRAFT 11b: "A DOOR IS A HOLE,
NOT A PICTURE OF A DOOR"). This cooks the joinery as PURE VALUE GEOMETRY:
the form's own light law says "the corner is a VALUE STEP between two planes
and nothing else", so every piece here is an RGBA luminance overlay that
rides WHATEVER material sits beneath it - all fifteen approved house skins
and every civic material get their thickness from ONE set of pieces, which
is STRUCTURE-NOT-COLOR in its purest form (no 30-colourway explosion).

MEASURED FIRST (8/19):
  - suburb bodyTile() already names the corner slots: wall_end_l (lit,
    x1.12) / wall_end_r (shaded, x0.86) wherever a house face ends - ENDS,
    not corners; no second plane anywhere.
  - the window opening rect in the starter tile is x10..33, y12..29; the
    boarded opening x10..35, y6..31.
  - the suburb DOORS are Paolo's own 2-tall animated clip-bank art drawn in
    a LATER overlay pass - a reveal cooked here would be painted over, and
    touching his door pipeline is not this pass. PARKED, named in the form.
  - parapet_corner: STRUCK - TF-ART-012 shipped the full WANG-16 coping
    ring 8/11 (the overlap the form flagged resolves itself: 012 owns it).
  - rake_corner: HELD with TF-CITY-001 (unshipped roof-edge family - they
    must be judged together).
  - corner_in (concave): cooked and BANKED; wired only where a live concave
    site is measured (inert-hook rule).

THE GEOMETRY (form section E): CELL_M=0.75m over 44px puts a real Clark
County wall at 11-13px thick - the return planes and reveals here are 12px,
"about a tenth of a person thick, and it looks it". Light upper-left: a
hole's RIGHT jamb faces west and catches light, the LEFT jamb shades, the
head SOFFIT (facing down) is the darkest surface on the building, the sill
(facing up) the lightest. An outside corner's west return is LIT, east
return SHADED - both hands DRAWN, never mirrored.

THE WEAR (motivated, one word each): BEAD - the stucco corner bead rusts
inside the render and cracks DEAD STRAIGHT down the arris, 1px, with a
2-3px rust bleed fan; WATER - the only streaks on a Vegas wall start at the
sill's two outer corners; SUN - the lit plane reads chalked, the shade
plane keeps its depth (carried by the value step itself).

REUSE CHECK:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — OPENED IN CODE:
    the window/boarded opening rects are MEASURED off the approved tiles so
    every reveal lands exactly on the approved hole, and the corner pieces
    are sized to the same 44px cell.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json — OPENED IN CODE:
    rail_plate_0's rusted steel tints the bead-crack bleed, the same rust
    every other family bleeds.
  Value-only overlays by design: the wall's own material IS the reuse.
TASTE CHECK: no keyline, no dither - value steps and 1px motivated marks
only; nothing lit (LIGHT=TERRITORY); no purple; both corner hands drawn
separately because a flip lights from the wrong side.

  python3 tools/tfcook/TF-ART-017_cook.py
    -> banks/tileforms/TF-ART-017_CANDIDATES_8_19_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-017_CANDIDATES_8_19_26.json')
C = 44
DEPTH = 12                                   # the measured 11-13px wall

# REUSE (opened): measure the approved opening rects
st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
def dark_rect(nm, thr=170):
    im = Image.open(io.BytesIO(base64.b64decode(byid[nm]['b64'].split(',')[-1]))).convert('RGB')
    px = im.load(); xs = []; ys = []
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            if r+g+b < thr: xs.append(x); ys.append(y)
    return (min(xs), min(ys), max(xs), max(ys))
WIN = dark_rect('wall_window')               # (10,12,33,29) measured
BRD = dark_rect('wall_boarded')

# REUSE (opened): the rust that bleeds from the corner bead
rb = json.load(open(os.path.join(REPO, 'banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json')))
def tile_of(bank, nm):
    for t in bank['tiles']:
        if t['name'] == nm:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGBA')
def rust_colour():
    im = tile_of(rb, 'rail_plate_0'); px = im.load(); best = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200 and c[0] > c[2]+30 and c[0] > c[1]+10:   # the true rust browns
                k = (c[0]//16, c[1]//16, c[2]//16); best.setdefault(k, []).append(c[:3])
    p = max(best.values(), key=len)
    return tuple(sum(v[i] for v in p)//len(p) for i in range(3))
RUST = rust_colour()

def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))
LITE = (255, 250, 240)                        # warm key light
DARK = (12, 10, 8)                            # shade, never pure black

def corner_out(hand):
    """the second plane: a 12px return past the arris. West hand LIT (the
    return faces the key), east hand SHADED. The arris carries the bead
    crack with its rust bleed. Value work only - alpha does the step."""
    im = new(); px = im.load(); r = random.Random(17 if hand == 'l' else 71)
    for y in range(C):
        for k in range(DEPTH):
            x = k if hand == 'l' else C-1-k
            t = k/float(DEPTH)                            # 0 at outer edge
            if hand == 'l':
                a = int(52*(1-t)) + 8                     # lit return, brightest outboard
                px[x, y] = LITE + (a,)
            else:
                a = int(74*(1-t)) + 10                    # shaded return, darkest outboard
                px[x, y] = DARK + (a,)
        # the arris: the value step's own 1px line, then the bead crack
        ax = DEPTH if hand == 'l' else C-1-DEPTH
        px[ax, y] = (DARK + (60,)) if hand == 'l' else (LITE + (34,))
    # BEAD: the dead-straight hairline ON the arris, rusting from inside
    bx = DEPTH-1 if hand == 'l' else C-DEPTH
    y0 = r.randint(2, 8)
    for y in range(y0, C):
        px[bx, y] = (dark_mix := tuple(int(v*0.5) for v in RUST)) + (120,)
    # the bleed fan: 2-3px wide, 10-20px long, running down from mid-height
    fy = r.randint(14, 22); fl = r.randint(10, 20)
    for y in range(fy, min(C, fy+fl)):
        w = 2 if (y-fy) < fl//2 else 3
        for k in range(w):
            x = bx + (k if hand == 'l' else -k)
            a = int(64*(1.0-(y-fy)/float(fl)))
            if 0 <= x < C: px[x, y] = RUST + (a,)
    return im

def corner_in(hand):
    """the reentrant corner: a wind-eddy shade wedge where two runs meet -
    the darkest outdoor surface, silt drifted into the foot. BANKED until a
    live concave site is measured (inert-hook rule)."""
    im = new(); px = im.load(); r = random.Random(34 if hand == 'l' else 43)
    for y in range(C):
        for k in range(DEPTH):
            x = k if hand == 'l' else C-1-k
            a = int((84 - 3*k) * (0.7 + 0.3*(y/float(C))))  # deepens toward the foot
            px[x, y] = DARK + (max(0, a),)
    for x in range(C):                                     # the silt drift at the foot
        if (x if hand == 'l' else C-1-x) < DEPTH+6 and r.random() < 0.5:
            px[x, C-2] = (120, 110, 92, 90); px[x, C-1] = (120, 110, 92, 110)
    return im

def reveal(rect, boarded=False):
    """the returned reveal around a measured opening: lit right jamb, shaded
    left jamb, the SOFFIT as the darkest band, lit sill, and the two weep
    streaks that start at the sill's outer corners - nowhere else."""
    x0, y0, x1, y1 = rect
    im = new(); px = im.load()
    J = 3                                                  # visible jamb face
    for y in range(y0, y1+1):
        for k in range(J):
            if x0+k <= x1: px[x0+k, y] = DARK + (70-18*k,)     # left jamb shades
            if x1-k >= x0: px[x1-k, y] = LITE + (48-12*k,)     # right jamb lit
    for x in range(x0, x1+1):                              # the head soffit, darkest
        for k in range(4):
            if y0+k <= y1: px[x, y0+k] = DARK + (95-16*k,)
    if not boarded:
        for x in range(x0, x1+1):                          # the sill catches the sky
            for k in range(2):
                if y1-k >= y0: px[x, y1-k] = LITE + (55-18*k,)
    for sx in (x0, x1):                                    # the only streaks on the wall
        for y in range(y1+1, min(C, y1+12)):
            a = int(52*(1.0-(y-y1)/12.0))
            px[sx, y] = DARK + (a,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'cor_out_l', 'b64': b64(corner_out('l'))},
    {'name': 'cor_out_r', 'b64': b64(corner_out('r'))},
    {'name': 'cor_in_l',  'b64': b64(corner_in('l'))},
    {'name': 'cor_in_r',  'b64': b64(corner_in('r'))},
    {'name': 'rev_window', 'b64': b64(reveal(WIN))},
    {'name': 'rev_boarded', 'b64': b64(reveal(BRD, boarded=True))},
]
json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-017 (board '
           'row 97, HIGH): pure value-geometry overlays - the corner is a value '
           'step between two planes, riding every approved material unchanged. '
           'Opening rects measured off the approved starter tiles; bead rust '
           'from the approved rail steel. tools/tfcook/TF-ART-017_cook.py',
    'family': 'TF-ART-017', 'cooked': '8/19/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d joinery pieces -> %s  (WIN=%s BRD=%s RUST=%s)' % (len(tiles), OUT, WIN, BRD, RUST))
