#!/usr/bin/env python3
"""TF-ART-016 SOLAR / BATTERY YARD — rank, shadow and steel (merged TF-RUN-007).

THE JOB (form, board row 25; TF-RUN-007 merged in 8/19 as the form's own
section B ordered): the two power districts read as POWER instead of as
fields of pale suburban stucco. MEASURED 8/19 on the walked world:
  solar: 'solar panel' x4248/cell in tables 27 or 36 cells long x EXACTLY 4
    deep (the form's 9-cell tables butted in threes and fours),
    'inverter / transformer pad' x156 (3x4-cell pads), gravel access roads
    already drawing the bought pool. Structure, solid - the dossier's
    locked ruling: waist-to-head-high racks, you route BETWEEN the rows.
  battery: NO panel cells (its array was never built out in this world) -
    its 'inverter / transformer rack' x480 is the DEAD member here.
So the two-state split lands as: MAINTAINED panels + pads at the solar
farm (CLUSTERED POWER canon: eerily perfect, dust haze only), DEAD racks
at the battery yard (cold, oil-stained, gutted). The dead-panel sub-states
(browned tea-black, milky crumb) are COOKED AND BANKED - no stripped block
exists in this seed to wear them (inert-hook rule).

THE 45 READ (form section E, the sharpest test on the board): a panel is a
tilted plane - sky-lit top foreshortened, the near frame edge a 2px lit
lip, the underside the deepest shade in the district, posts under it. The
4-deep table reads north row = high back rail, two glass rows, south row =
front lip over the dark under-slot. THE BUDGET: module frame 2px (the ONE
hard line), module gap 1px shared by 2-3 modules in irregular clumps never
per-module, at most three implied busbar lines per tile NEVER a grid,
glass has no drawable thickness, fastener rust is a 6-18px streak never a
dot. Value skeleton: lane brightest, post rank mid, panel top dark,
underside darkest - the largest legal value gap in the game, for free.

REUSE CHECK: (banks OPENED in code, per the form's own shopping)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - wall_window is
    the ONLY approved dead-dark-glass in the corpus: harvested as the VALUE
    TARGET for the glass (target, not pixels - it cannot be re-cut into a
    tilted plane). concrete_0 anchors the pad slab values.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised steel for rails, piles and frames (chalky zinc,
    never wholesale rust).
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    rust for cut ends and fastener streaks.
  The gravel lane member folds into the approved yard gravel as the form
  itself predicted - the bought pool already draws it; no second gravel.
TASTE CHECK: maintained means CLEAN ON PURPOSE (unsettling, eerily
perfect - straight frames, even haze, zero streaks); dead means thirty
summers (warm tea-brown glass, chalked backsheet, slack 1px harness
loops, oil at the rack foot); nothing green ever; glass never emissive;
no keyline, no dither - the module rhythm is declared structure.

  python3 tools/tfcook/TF-ART-016_cook.py
    -> banks/tileforms/TF-ART-016_CANDIDATES_8_19_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-016_CANDIDATES_8_19_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')
def pools(im, n=4, amin=200):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > amin:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
GLASS_POOL = pools(load_b64(byid['wall_window']['b64']))
GLASS = min(GLASS_POOL, key=lambda c: sum(c))            # the dead-glass value target
CONC  = pools(load_b64(byid['concrete_0']['b64']))[0]

tf12 = json.load(open(os.path.join(REPO, 'banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json')))
tf10 = json.load(open(os.path.join(REPO, 'banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json')))
def bank_tile(bank, nm):
    for t in bank['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
GALV = max(pools(bank_tile(tf12, 'parapet_galv_run_n_a')), key=lambda c: sum(c))
RUST = pools(bank_tile(tf10, 'rail_plate_0'))[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)
def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))

# glass shades: maintained = dark + even dust haze; the top of the value
# skeleton's dark end. Warm tea-brown reserved for the banked DEAD state.
G_TOP   = dim(GLASS, 1.15)
G_HAZE  = tuple(min(255, v+16) for v in G_TOP)           # even dust, matte
BROWN   = (min(255, GLASS[0]+26), GLASS[1]+8, GLASS[2])  # EVA browning (dead)

def glass_field(row, phase, dead=False):
    """one cell of the table top. row: 0=back rail, 1..2=glass, 3=front lip.
    phase 0 carries the module frame line pair; 1 and 2 run unbroken."""
    im = new(); px = im.load(); r = random.Random(160 + row*10 + phase + (500 if dead else 0))
    base = BROWN if dead else G_TOP
    for y in range(C):
        for x in range(C):
            c = noise(base, r, 4)
            if dead and ((x//9 + y//9) % 3 == 0):         # browning follows the cells
                c = noise(dim(BROWN, 1.12), r, 5)
            elif not dead and (x+y) % 13 == 0:
                c = noise(G_HAZE, r, 3)                   # the even haze, never glossy
            px[x, y] = c + (255,)
    if row == 0:
        for x in range(C):                                 # the high back rail, galv
            px[x, 0] = dim(GALV, 1.2) + (255,)
            px[x, 1] = noise(GALV, r, 4) + (255,)
            px[x, 2] = dim(GALV, 0.8) + (255,)
    if row == 3:
        for x in range(C):                                 # the 2px lit front lip
            px[x, C-9] = dim(GALV, 1.25) + (255,)
            px[x, C-8] = noise(GALV, r, 4) + (255,)
        for y in range(C-7, C):                            # the under-slot: darkest thing here
            t = (y-(C-7))/7.0
            for x in range(C):
                px[x, y] = dim((14, 12, 10), 1.0) + (255 if t < 0.6 else 220,)
        for x in range(4, C, 15):                          # pile glimpses in the slot
            for y in range(C-4, C):
                px[x, y] = noise(dim(GALV, 0.75), r, 4) + (255,)
        if dead:
            for x in range(2, C, 11):                      # slack harness loops, 1px
                for k in range(5):
                    y = C-6+int(2*abs(k-2)/2)
                    if 0 <= x+k < C: px[x+k, y] = dim((14, 12, 10), 1.6) + (255,)
    if phase == 0 and row in (1, 2):
        for y in range(C):                                 # the ONE hard line: 2px frame
            px[20, y] = dim(GALV, 0.95) + (255,)
            px[21, y] = dim(GALV, 0.7) + (255,)
    if row in (1, 2):
        # implied busbars: TWO faint CONTINUOUS 1px lines (the first render's
        # dotted columns read as stipple, which is the banned thing)
        for k in range(2):
            x = 9 + k*17 + phase*3
            for y in range(C):
                if x < C: px[x, y] = dim(base, 1.16) + (90,)
    return im

def row_end(side):
    """SINGLE PLACEMENT at a table's end: torque tube stub + bearing + pile.
    RGBA overlay so the glass row beneath keeps its material."""
    im = new(); px = im.load(); r = random.Random(1600 if side == 'w' else 1601)
    x0 = 2 if side == 'w' else C-3
    for y in range(10, 34):                                # the pile
        for k in range(4):
            x = (x0+k) if side == 'w' else (x0-k)
            f = 1.1 - 0.18*k
            px[x, y] = noise(dim(GALV, f), r, 4) + (255,)
    # the torque tube stub: a 7px cylinder poking past the last module
    ty = 16
    for k in range(7):
        x = (x0+k) if side == 'w' else (x0-k)
        for yy in range(ty, ty+7):
            t = abs(yy-(ty+3))/3.5
            px[x, yy] = noise(dim(GALV, 1.15-0.5*t*t), r, 4) + (255,)
    ex = x0 + (7 if side == 'w' else -7)
    for yy in range(ty, ty+7):                             # the cut end rusts
        px[ex, yy] = noise(RUST, r, 6) + (255,)
    for yy in range(ty+7, min(C, ty+19)):                  # its streak, 6-18px
        a = int(70*(1.0-(yy-ty-7)/12.0))
        px[ex, yy] = RUST + (a,)
    return im

def inv_box():
    """the pad-mount transformer/inverter cabinet, 2x2 cells RGBA, anchored
    right-bottom on its measured 3x4 concrete pad (slab = bought concrete).
    Maintained: straight, clean, a dark cabinet with cooling fins."""
    W = H = 88
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = im.load(); r = random.Random(1616)
    bx0, by0, bx1, by1 = 12, 22, 76, 74
    cab = (52, 56, 54)                                     # mineral-oil green-grey
    for y in range(by0, by1):
        for x in range(bx0, bx1):
            edge = min(x-bx0, bx1-1-x, y-by0, by1-1-y)
            c = noise(cab, r, 4)
            if y < by0+8: c = dim(cab, 1.3)                # the sky-lit top
            elif edge < 2: c = dim(cab, 0.7)
            if by0+8 <= y < by1-6 and (x-bx0) % 5 == 4 and x < bx1-14:
                c = dim(cab, 0.82)                         # cooling fins
            px[x, y] = c + (255,)
    for x in range(bx1-12, bx1-4):                         # the HV bushing hood
        for y in range(by0+2, by0+12):
            px[x, y] = noise(dim(cab, 1.1), r, 4) + (255,)
    for x in range(bx0, bx1):                              # ground shadow line
        px[x, by1] = (10, 9, 8, 130)
    return im

def rack_dead(v):
    """the battery yard's dead inverter rack, one cell: dark cabinet, doors
    ajar on v1, oil stain running from the foot. Thirty years cold."""
    im = new(); px = im.load(); r = random.Random(1660+v)
    cab = (44, 44, 46)
    for y in range(4, C):
        for x in range(3, C-3):
            edge = min(x-3, C-4-x)
            c = noise(cab, r, 5)
            if y < 10: c = dim(cab, 1.22)                  # top catches sky
            elif edge < 1: c = dim(cab, 0.7)
            if 12 <= y < C-6 and (y % 7 == 5): c = dim(cab, 0.85)   # vent louvres
            px[x, y] = c + (255,)
    if v == 1:
        for y in range(14, 34):                            # a door hangs open: dark gut
            for x in range(C-16, C-5):
                px[x, y] = noise((16, 14, 13), r, 4) + (255,)
        for y in range(15, 30):
            px[C-16, y] = dim(cab, 1.25) + (255,)          # the door edge catches light
    for x in range(8, 20):                                 # the oil, at the foot only
        for y in range(C-3, C):
            px[x, y] = (24, 20, 14, 150)
    return im

def glass_banked(kind):
    """BANKED dead-panel sub-states: browned tea-black / milky crumb."""
    if kind == 'browned': return glass_field(1, 0, dead=True)
    im = glass_field(1, 1, dead=True); px = im.load(); r = random.Random(1699)
    for y in range(C):
        for x in range(C):
            if (x//3 + y//3 + ((x*7+y*3) % 5)) % 4 != 0:
                c = px[x, y][:3]
                px[x, y] = tuple(min(255, v+52+r.randint(-8, 8)) for v in c) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for row in range(4):
    for phase in range(3):
        tiles.append({'name': 'sol_r%d_p%d' % (row, phase),
                      'b64': b64(glass_field(row, phase))})
tiles.append({'name': 'sol_end_w', 'b64': b64(row_end('w'))})
tiles.append({'name': 'sol_end_e', 'b64': b64(row_end('e'))})
tiles.append({'name': 'sol_inv_box', 'b64': b64(inv_box())})
tiles.append({'name': 'bat_rack_dead_0', 'b64': b64(rack_dead(0))})
tiles.append({'name': 'bat_rack_dead_1', 'b64': b64(rack_dead(1))})
tiles.append({'name': 'sol_glass_browned', 'b64': b64(glass_banked('browned'))})
tiles.append({'name': 'sol_glass_crumb',  'b64': b64(glass_banked('crumb'))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-016 '
           '(TF-RUN-007 merged in as the form ordered; the dossier layering '
           'ruling governs). Glass value target harvested from the approved '
           'wall_window, steel from the approved galv parapet, rust from the '
           'approved rail plate. Maintained clean on purpose at the solar '
           'farm; dead at the battery yard; dead-panel sub-states BANKED. '
           'tools/tfcook/TF-ART-016_cook.py',
    'family': 'TF-ART-016', 'cooked': '8/19/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d solar/battery pieces -> %s (GLASS=%s GALV=%s)' % (len(tiles), OUT, GLASS, GALV))
