#!/usr/bin/env python3
"""TF-ART-007 CIVIC FAMILY, MEASURED AND CORRECTED — columns + dead glazing.

THE FORM ASKED FOR 1920s CUT STONE. THE WORLD BUILT SOMETHING ELSE, AND THE
MEASUREMENT WINS (8/19, all four civic districts probed on the walked
world): the courthouse names 'precast panel joint' x748 on its own mass -
it is a MODERN PRECAST courthouse (which is what Clark County actually
builds) - and the terminal is curtain-wall. The form's WHY ("a courthouse
and a self-storage unit are the same pixels") was answered on 8/3 when the
civic material system put the approved civic_stone / tiltup fields on
these masses. What is STILL BROKEN is what the world names and nothing
draws:
  courthouse 'precast panel joint' x748  -> REUSED, not cooked: the
    TF-RUN-005 tu_joint piece IS this object; the wiring lays the mass's
    own material and hangs the shipped joint on it.
  chapel 'arcade columns' x66            -> cooked here: a pale stone
    column, ellipse cross-section per the 45 law, lit side, base + cap.
  chapel 'stained glass' x62             -> cooked: dead dark leaded glass,
    muted jewel tints at low value (unlit - LIGHT=TERRITORY; no purple).
  courthouse 'dome glazing' x149, library 'clerestory glazing' x627 +
  'oculus ring' x509, terminal 'curtain wall glazing' x476
                                         -> cooked: dead civic glazing,
    dark panes in thin mullion grids, glass value from the same approved
    wall_window target the solar family used.

REUSE CHECK: (banks OPENED in code)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - wall_window: the
    approved dead-glass value target for every pane cooked here.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    mullion + column-cap steel greys.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne: the
    pale stone family for the column barrel (the valley's civic pale).
  banks/tileforms/TF-RUN-005_CANDIDATES_8_19_26.json - tu_joint_0/1 are
    REUSED AS-IS for the courthouse's named precast joints (opened by the
    wiring, already grabbed into the page; nothing recooked).
TASTE CHECK: nothing lit, no purple (stained glass is muted amber/teal/
oxblood at dead values), no keyline, no dither; the column's two hands of
light come from the one upper-left key on a round barrel, never a flip.

  python3 tools/tfcook/TF-ART-007_cook.py
    -> banks/tileforms/TF-ART-007_CANDIDATES_8_19_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-007_CANDIDATES_8_19_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')
def pools(im, n=4):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
GLASS = min(pools(load_b64(byid['wall_window']['b64'])), key=lambda c: sum(c))

def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
GALV  = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
STONE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)
def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))

def column():
    """one arcade column cell: a round pale barrel, 45 law - lit on the key
    side, an ellipse foot, a square cap; soiling ONLY under the cap."""
    im = new(); px = im.load(); r = random.Random(70)
    x0, x1 = 14, 30
    for y in range(4, C):
        for x in range(x0, x1):
            t = (x - (x0+x1)/2.0) / ((x1-x0)/2.0)         # -1..1 across the barrel
            f = 1.18 - 0.30*(t+0.35)*(t+0.35)             # lit left-of-centre
            c = noise(dim(STONE, max(0.6, f)), r, 4)
            if y < 9: c = dim(c, 0.8)                      # soiled under the cap
            px[x, y] = c + (255,)
    for x in range(x0-3, x1+3):                            # the cap
        for y in range(0, 4):
            px[x, y] = noise(dim(STONE, 1.12 if y < 2 else 0.9), r, 4) + (255,)
    for x in range(x0-2, x1+2):                            # the foot ellipse
        dy = int(2.2*math.sqrt(max(0.0, 1-((x-(x0+x1)/2.0)/((x1-x0)/2.0+2))**2)))
        yy = C-2-dy
        if 0 <= yy < C: px[x, yy] = dim(STONE, 0.65) + (255,)
    return im

def glazing(v):
    """dead civic glazing: dark panes in a thin mullion grid. v0 tighter
    grid (curtain wall / clerestory), v1 wider (dome / oculus)."""
    im = new(); px = im.load(); r = random.Random(700+v)
    step = 11 if v == 0 else 15
    for y in range(C):
        for x in range(C):
            c = noise(dim(GLASS, 1.05), r, 4)
            if (x % step) == step-1 or (y % step) == step-1:
                c = noise(dim(GALV, 0.85), r, 4)           # the mullion
            elif ((x*3+y*7) % 29) == 0:
                c = dim(GLASS, 1.5)                        # a dusty sky glint, matte
            px[x, y] = c + (255,)
    # one cracked pane per few tiles' worth: a milky lighter pane
    if v == 1:
        for y in range(0, step-1):
            for x in range(step, 2*step-1):
                if x < C and y < C:
                    px[x, y] = noise(tuple(min(255, k+38) for k in GLASS), r, 6) + (255,)
    return im

def stained():
    """the chapel's leaded glass, dead: muted jewel tints at glass values -
    amber, teal, oxblood - in leaded panels. Unlit, and never purple."""
    im = new(); px = im.load(); r = random.Random(777)
    tints = [(58, 42, 22), (26, 44, 42), (52, 26, 24)]     # dark amber / teal / oxblood
    for y in range(C):
        for x in range(C):
            cellx, celly = x//9, y//11
            t = tints[(cellx*3+celly*5) % 3]
            c = noise(t, r, 5)
            if x % 9 == 8 or y % 11 == 10:
                c = (16, 15, 14)                            # the lead came
            px[x, y] = c + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'civ_column_0', 'b64': b64(column())},
    {'name': 'glz_dead_0', 'b64': b64(glazing(0))},
    {'name': 'glz_dead_1', 'b64': b64(glazing(1))},
    {'name': 'glz_stained_0', 'b64': b64(stained())},
]
json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-007, '
           'CORRECTED BY MEASUREMENT: the walked courthouse is precast (it '
           'names its own panel joints - those reuse the shipped TF-RUN-005 '
           'tu_joint), the material half shipped 8/3; these are the named '
           'remainders - the chapel arcade columns, dead civic glazing, the '
           'stained glass. tools/tfcook/TF-ART-007_cook.py',
    'family': 'TF-ART-007', 'cooked': '8/19/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d civic pieces -> %s (STONE=%s GLASS=%s)' % (len(tiles), OUT, STONE, GLASS))
