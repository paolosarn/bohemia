#!/usr/bin/env python3
"""TF-RUN-005 TILT-UP PANEL LANGUAGE — joints, parapet, base, streaks, boards.

THE JOB (form, RUN backlog 0b): the civic and industrial masses already wear
the approved tilt-up concrete field (wired 8/3, recorded as passed in the 8/1
ninety-tile sweep - the bank's PENDING field is stale against that recorded
ruling, and the material has been live sixteen days under CORRECT-AFTER).
What is MISSING is what makes tilt-up read as tilt-up: "big blank fields
punctuated by joints, NOT a repeating texture. Getting the joint rhythm
right is most of this asset." These pieces are RGBA overlays that ride ON
the approved field:

  tu_joint_*    the vertical caulked seam between two lifted panels, at the
                cell's RIGHT edge (the wiring drops it every 4-6 columns of
                a mass, phase locked to the mass anchor)
  tu_parapet_*  the poured cap band at the building's top course (replaces
                the orange starter parapet on tilt-up masses, the way the
                CMU cap did on block masses)
  tu_base_*     the plinth course: darker foot band with efflorescence
                bloom - the pale mineral crust concrete grows at grade
  tu_streak_*   rain weeps: the desert's only aging here is DUST, UV and
                streak - never green (form: no moss, no algae, ever)
  tu_board_*    a boarded punched window, mid-wall, rare

45 LAW + palette: value work only - concrete is a narrow band with almost
no hue; the read comes from form and joints, dither banned on the big
field (nothing here dithers; the overlays are lines, bands and soft alpha).

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE. The three
    approved tilt-up panel tiles are the field these overlays ride on;
    every overlay grey is HARVESTED from their own pools so joint, cap and
    plinth sit in the panel's exact value band.
  banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json — OPENED IN CODE.
    sf_boarded_0: the approved boarded-front plywood; the boarded window
    samples its wood so every board in the valley is the same weathered ply.
TASTE CHECK: dead world - no moss/algae (Vegas dry aging), no readable
text, no purple, no self-light; streaks and bloom are value shifts only.

  python3 tools/tfcook/TF-RUN-005_cook.py
    -> banks/tileforms/TF-RUN-005_CANDIDATES_8_19_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-RUN-005_CANDIDATES_8_19_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')

tex = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
TILT = [load_b64(t['b64']) for t in tex['tiles'] if t.get('material') == 'tiltup_concrete']
if not TILT: raise SystemExit('no tiltup tiles in the texture bank')

sfb = json.load(open(os.path.join(REPO, 'banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json')))
BOARDSRC = None
for t in sfb['tiles']:
    if t['name'] == 'sf_boarded_0': BOARDSRC = load_b64(t['b64'])
if BOARDSRC is None: raise SystemExit('missing sf_boarded_0 harvest')

def pools(im, n=4):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]

TP = pools(TILT[0])
GREY   = TP[0]                                   # the panel's own mid grey
GREY_L = max(TP, key=lambda c: sum(c))           # its light
GREY_D = min(TP, key=lambda c: sum(c))           # its dark
WOOD   = sorted(pools(BOARDSRC, 3), key=lambda c: -sum(c))[:2]   # the ply, not its shadows

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=6):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)
def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))

def joint(v):
    """the caulked seam at the cell's right edge: shadow line, lit chamfer."""
    im = new(); px = im.load(); r = random.Random(500+v)
    for y in range(C):
        px[C-2, y] = dim(GREY_D, 0.62) + (255,)          # the caulk shadow
        px[C-1, y] = noise(dim(GREY_D, 0.78), r, 4) + (255,)
        px[C-3, y] = noise(dim(GREY_L, 1.06), r, 4) + (255,)   # the lit arris
        if v == 1 and y % 9 == 4:
            px[C-2, y] = dim(GREY_D, 0.5) + (255,)       # a chipped spot
    return im

def parapet(v):
    """the poured cap band: sky-lit top course, its own shadow under it."""
    im = new(); px = im.load(); r = random.Random(600+v)
    H = 13
    for y in range(H):
        for x in range(C):
            f = 1.24 if y < 2 else (1.10 if y < 5 else 1.0 if y < H-2 else 0.9)
            px[x, y] = noise(dim(GREY_L, f), r, 4) + (255,)
    for x in range(C):
        px[x, H] = dim(GREY_D, 0.68) + (200,)            # the cap's own shadow line
        if v == 1 and x % 11 == 7:
            px[x, 1] = dim(GREY_D, 0.85) + (255,)        # hairline in the cap
    return im

def base(v):
    """the plinth: darker foot band, efflorescence bloom at grade."""
    im = new(); px = im.load(); r = random.Random(700+v)
    H = 12
    for y in range(C-H, C):
        t = (y-(C-H))/float(H)
        for x in range(C):
            c = noise(dim(GREY_D, 0.95 - 0.2*t), r, 5)
            px[x, y] = c + (160 + int(70*t),)            # deepens toward grade
    # the bloom: pale mineral crust in patches along the very bottom
    x = r.randint(0, 8)
    while x < C:
        w = r.randint(4, 9)
        for xx in range(x, min(C, x+w)):
            h2 = r.randint(2, 4)
            for yy in range(C-h2, C):
                px[xx, yy] = noise(dim(GREY_L, 1.18), r, 5) + (235,)
        x += w + r.randint(5, 11)
    return im

def streak(v):
    """rain weeps: two or three soft dark runs from the top of the cell."""
    im = new(); px = im.load(); r = random.Random(800+v*7)
    for s in range(r.randint(2, 3)):
        x0 = r.randint(3, C-4)
        ln = r.randint(18, 40)
        w = r.choice((1, 1, 2))
        for y in range(ln):
            a = int(72 * (1.0 - y/float(ln)))            # fades as it falls
            if a < 8: break
            for k in range(w):
                x = x0 + k + (1 if (y > ln//2 and r.random() < 0.08) else 0)
                if 0 <= x < C:
                    px[x, y] = dim(GREY_D, 0.55) + (a,)
    return im

def board(v):
    """a boarded punched window mid-wall: weathered ply in a shadowed reveal."""
    im = new(); px = im.load(); r = random.Random(900+v)
    x0, y0, x1, y1 = 8, 10, 36, 32
    for y in range(y0, y1):                              # the reveal shadow
        for x in range(x0, x1):
            px[x, y] = dim(GREY_D, 0.55) + (255,)
    for y in range(y0+2, y1-2):                          # the ply, plank courses
        for x in range(x0+2, x1-2):
            c = WOOD[(y-y0)//5 % len(WOOD)]
            c = noise(c, r, 7)
            if (y-y0) % 5 == 4: c = dim(c, 0.72)         # plank gap
            px[x, y] = c + (255,)
    for x in range(x0, x1):                              # sill shadow + weep start
        px[x, y1] = dim(GREY_D, 0.5) + (200,)
    for y in range(y1+1, min(C, y1+9)):                  # the stain under the sill
        a = int(60*(1.0-(y-y1)/9.0))
        px[x0+3, y] = dim(GREY_D, 0.55) + (a,)
        px[x1-4, y] = dim(GREY_D, 0.55) + (a,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2): tiles.append({'name': 'tu_joint_%d' % v,   'b64': b64(joint(v))})
for v in range(2): tiles.append({'name': 'tu_parapet_%d' % v, 'b64': b64(parapet(v))})
for v in range(2): tiles.append({'name': 'tu_base_%d' % v,    'b64': b64(base(v))})
for v in range(3): tiles.append({'name': 'tu_streak_%d' % v,  'b64': b64(streak(v))})
for v in range(2): tiles.append({'name': 'tu_board_%d' % v,   'b64': b64(board(v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-RUN-005: the '
           'tilt-up field has been live since 8/3 under the recorded 8/1 '
           'ninety-tile pass; these are its missing panel language (joints, '
           'cap, plinth, streaks, boarded window), greys harvested from the '
           'field tiles themselves. tools/tfcook/TF-RUN-005_cook.py',
    'family': 'TF-RUN-005', 'cooked': '8/19/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d tilt-up pieces -> %s' % (len(tiles), OUT))
