#!/usr/bin/env python3
"""TF-ART-019 THE GRID KIT — transformer bays, switchgear, busbars, containers.

MEASURED FIRST (8/21, records/tileforms/TF-ART-019_grid_kit.md): the
substation's transformer cells come in 19x20 BAYS (one transformer each,
real firewall spacing), the switchgear is a thin lattice grid, the busbars
are OVERHEAD non-solid runs, and the battery containers come in 14x16
BANKS - a 14-cell run is 10.5 m, a 40-foot container exactly, so a bank is
five containers side by side and this art SUBDIVIDES what the world merged
(rows of 3 cells: two lid rows + a gap seam).

STATES BY CANON: substation MAINTAINED (CLUSTERED POWER: the NETWORK is
eerily perfect - straight, clean, zero streaks); battery DEAD (cold lids,
streaked, silent).

PIECES:
  xf_body        the transformer, one 6x8-cell RGBA prop (264x352): the
                 tank with its sky-lit top, radiator fin banks both sides,
                 three bushings as stacked ellipses, the conservator drum,
                 a clean pad shadow (maintained - no oil).
  swg_post_v/h   the switchgear lattice: galv truss pieces, mostly air.
  bus_over_h/v   the overhead conductors: three 1px lines with sag between
                 supports, a disc insulator at the third points. Ground
                 shows through - you walk under these.
  ins_pin        the pedestal insulator: a stacked-ellipse porcelain column.
  bat_lid_a/b    container lid rows (corrugation ridges across the length,
                 lit north rim on row a), bat_seam (the dark slot between
                 containers), bat_end_w/e (door ends with locking bars),
                 hvac_pack (the thermal unit on its named cell).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised steel for lattice, tank trim and lid rims.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: rust
    for the DEAD battery lids' streaks only (the maintained substation
    carries none - that is the point).
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - concrete_0
    anchors the bay pad values.
TASTE CHECK: maintained means clean ON PURPOSE; porcelain reads pale
grey-brown, never white-bright; conductors are 1px value lines, never
rendered cables; no purple, nothing lit, no text.

  python3 tools/tfcook/TF-ART-019_cook.py
    -> banks/tileforms/TF-ART-019_CANDIDATES_8_21_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-019_CANDIDATES_8_21_26.json')
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
def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
GALV = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
RUST = pools(bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0'))[0]
st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
CONC = pools(load_b64(byid['concrete_0']['b64']))[0]

TANK = (74, 82, 76)                                   # mineral-oil green-grey
PORC = (148, 140, 126)                                # aged porcelain

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def xf_body():
    """the transformer: 6x8 cells, 264x352 RGBA. Tank + fins + bushings."""
    W, H = 264, 352
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = im.load(); r = random.Random(1900)
    tx0, ty0, tx1, ty1 = 66, 96, 198, 300              # the tank
    for y in range(ty0, ty1):
        for x in range(tx0, tx1):
            edge = min(x-tx0, tx1-1-x, y-ty0, ty1-1-y)
            c = noise(TANK, r, 4)
            if y < ty0+34: c = dim(TANK, 1.24)          # the sky-lit top
            elif edge < 3: c = dim(TANK, 0.72)
            elif (y-ty0) % 46 < 3 and y > ty0+40: c = dim(TANK, 0.9)   # weld bands
            px[x, y] = c + (255,)
    # radiator fin banks both sides: vertical fins, deep shade between
    for side in (0, 1):
        fx0 = 22 if side == 0 else tx1+4
        fx1 = tx0-4 if side == 0 else W-22
        for y in range(ty0+30, ty1-16):
            for x in range(fx0, fx1):
                fin = ((x-fx0) % 6) < 2
                c = dim(TANK, 1.05 if fin else 0.55)
                px[x, y] = noise(c, r, 4) + (255,)
        for x in range(fx0, fx1):                       # fin bank top edge, lit
            px[x, ty0+30] = dim(GALV, 1.1) + (255,)
    # three bushings on top: stacked porcelain ellipses, shrinking upward
    for k in range(3):
        bx = tx0+34 + k*48
        for i, (ry, rw) in enumerate([(88, 15), (72, 13), (56, 11), (40, 9), (26, 7)]):
            cy2 = ty0-6-i*0   # base sits at tank top
            yy = ty0 - (88-ry)
            for dx in range(-rw, rw+1):
                dyl = int(4*math.sqrt(max(0.0, 1-(dx/float(rw))**2)))
                for dy in range(-dyl, dyl+1):
                    x, y = bx+dx, ty0-(i*16)-2+dy
                    if 0 <= x < W and 0 <= y < H:
                        f = 1.15 - 0.5*abs(dx)/rw
                        px[x, y] = noise(dim(PORC, f), r, 4) + (255,)
        px[bx, ty0-74] = dim(GALV, 1.2) + (255,)         # the stud
    # conservator drum, top right: a horizontal cylinder
    for x in range(tx1-58, tx1-6):
        for y in range(ty0-28, ty0-6):
            t = abs(y-(ty0-17))/11.0
            if t <= 1.0:
                px[x, y] = noise(dim(TANK, 1.2-0.5*t*t), r, 4) + (255,)
    # clean pad shadow line (maintained - no oil stain)
    for x in range(tx0-8, tx1+8):
        if 0 <= x < W: px[x, ty1+2] = (12, 11, 10, 110)
    return im

def swg_post(axis):
    """switchgear lattice: a galv truss run, mostly air."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1910 + (0 if axis == 'v' else 1))
    for a in range(C):
        for off in (-7, 7):
            x, y = (22+off, a) if axis == 'v' else (a, 22+off)
            px[x, y] = noise(dim(GALV, 0.95), r, 5) + (255,)
        if a % 8 < 2:                                   # the diagonal lacing
            for k in range(-7, 8):
                x, y = (22+k, a) if axis == 'v' else (a, 22+k)
                if 0 <= x < C and 0 <= y < C and abs(k) < 7:
                    px[x, y] = dim(GALV, 0.8) + (200,)
    return im

def bus_over(axis):
    """three 1px conductors with sag, a disc at the third points. Overhead."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1920 + (0 if axis == 'h' else 1))
    for k in range(3):
        base = 12 + k*10
        for a in range(C):
            sag = int(2.0*math.sin(math.pi*a/float(C)))
            x, y = (a, base+sag) if axis == 'h' else (base+sag, a)
            px[x, y] = dim((30, 30, 32), 1.0) + (215,)
    for third in (14, 30):                              # disc insulators
        for k in range(3):
            base = 12 + k*10
            x, y = (third, base) if axis == 'h' else (base, third)
            for dx in (-1, 0, 1):
                xx, yy = (x+dx, y-1) if axis == 'h' else (x-1, y+dx)
                if 0 <= xx < C and 0 <= yy < C: px[xx, yy] = dim(PORC, 0.95) + (255,)
    return im

def ins_pin():
    """pedestal insulator: porcelain stack on a short galv pedestal."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1930)
    for y in range(30, 42):                             # the pedestal
        for x in range(18, 27):
            px[x, y] = noise(dim(GALV, 0.9), r, 4) + (255,)
    for i in range(4):                                  # the sheds, shrinking up
        rw = 10-i*2; cy2 = 27-i*6
        for dx in range(-rw, rw+1):
            dyl = int(3*math.sqrt(max(0.0, 1-(dx/float(rw))**2)))
            for dy in range(-dyl, dyl+1):
                x, y = 22+dx, cy2+dy
                if 0 <= x < C and 0 <= y < C:
                    px[x, y] = noise(dim(PORC, 1.12-0.4*abs(dx)/rw), r, 4) + (255,)
    return im

def bat_lid(row, dead=True):
    """container lid rows: corrugation across the length; row a keeps the
    lit north rim; dead lids carry streaks."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1940+row)
    base = (88, 92, 96)
    for y in range(C):
        for x in range(C):
            rib = (x % 7) < 3
            c = noise(dim(base, 1.02 if rib else 0.86), r, 4)
            if dead and (x*3+y) % 37 == 0: c = dim(c, 0.8)     # grime flecks
            px[x, y] = c + (255,)
    if row == 0:
        for x in range(C):
            px[x, 0] = dim(GALV, 1.25) + (255,)          # the lit rim
            px[x, 1] = noise(GALV, r, 4) + (255,)
    if dead:
        for sx in (9, 31):                               # rain streaks down the lid
            for y in range(6, 40):
                px[sx, y] = dim((20, 20, 22), 1.0) + (46,)
    return im

def bat_seam():
    """the dark slot between two containers: ground far below, deep shade."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1950)
    for y in range(C):
        for x in range(C):
            t = min(y, C-1-y)/(C/2.0)
            px[x, y] = noise(dim((16, 15, 14), 1.0+0.8*t), r, 3) + (255,)
    return im

def bat_end(side):
    """the door end: locking bars, RGBA overlay on the lid cell."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1960 + (0 if side == 'w' else 1))
    x0 = 1 if side == 'w' else C-8
    for y in range(2, C-2):
        for k in range(7):
            x = x0+k
            c = noise(dim((78, 82, 86), 0.9), r, 4)
            if k in (1, 4): c = dim(GALV, 1.05)          # the locking bars
            px[x, y] = c + (255,)
    return im

def hvac_pack():
    """the container's thermal unit, dead: a boxy pack with a stopped fan."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(1970)
    for y in range(8, 38):
        for x in range(6, 38):
            edge = min(x-6, 37-x, y-8, 37-y)
            c = noise((70, 72, 74), r, 4)
            if y < 14: c = dim((70, 72, 74), 1.25)
            elif edge < 1: c = dim((70, 72, 74), 0.7)
            px[x, y] = c + (255,)
    cx2, cy2 = 22, 26
    for dx in range(-8, 9):                              # the stopped fan ring
        for dy in range(-8, 9):
            d = math.hypot(dx, dy)
            if 7 <= d <= 8.4:
                px[cx2+dx, cy2+dy] = dim((30, 30, 32), 1.0) + (255,)
            elif d < 7 and abs(dx*dy) % 11 == 0:
                px[cx2+dx, cy2+dy] = dim((44, 46, 48), 1.0) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'xf_body', 'b64': b64(xf_body())},
    {'name': 'swg_post_v', 'b64': b64(swg_post('v'))},
    {'name': 'swg_post_h', 'b64': b64(swg_post('h'))},
    {'name': 'bus_over_h', 'b64': b64(bus_over('h'))},
    {'name': 'bus_over_v', 'b64': b64(bus_over('v'))},
    {'name': 'ins_pin', 'b64': b64(ins_pin())},
    {'name': 'bat_lid_a', 'b64': b64(bat_lid(0))},
    {'name': 'bat_lid_b', 'b64': b64(bat_lid(1))},
    {'name': 'bat_seam', 'b64': b64(bat_seam())},
    {'name': 'bat_end_w', 'b64': b64(bat_end('w'))},
    {'name': 'bat_end_e', 'b64': b64(bat_end('e'))},
    {'name': 'hvac_pack', 'b64': b64(hvac_pack())},
]
json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-019 (the '
           'grid kit, measured 8/21): the substation and battery containers '
           'rendered as flat slabs. Steel from the approved galv parapet, rust '
           'from the approved rail plate, pad values from the approved '
           'concrete. Substation maintained by CLUSTERED POWER canon; battery '
           'dead by its dossier. tools/tfcook/TF-ART-019_cook.py',
    'family': 'TF-ART-019', 'cooked': '8/21/26', 'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d grid pieces -> %s' % (len(tiles), OUT))
