#!/usr/bin/env python3
"""ROLLING STOCK — the railyard's stranded boxcars and its dead locomotive.

THE JOB (measured 8/27 on the walked world): 'rolling stock (boxcar)'
x3012 in 118 blobs, 101 of them EXACTLY 7x4 cells - a real 50-foot
boxcar at 0.87 m/cell - plus 'locomotive' x334 in 14 blobs, 11 of them
the same 7x4. Every one draws as generic wall mass today. The engine's
own dossier: "a rusted freight car stranded on the track, doors sprung"
and a dead diesel. One multi-cell RGBA prop each (308x176), seen from
the 45 above - the ROOF is the read:

  boxcar_0/1/2  transverse roof panels with rib seams, the raised
                running board down the centreline, end platforms with
                brake gear hinted, a soft east+south ground shadow.
                Three weathers: faded oxide red, bleached galv, the odd
                bluegrey repaint - a yard sorts cars from everywhere.
  loco_box      the dead road switcher: long hood with its radiator fan
                rings, the cab band a third from one end, walkway edges
                lit, everything a shade darker than the cars because a
                loco is painted steel not galvanised.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a
    (the approved galvanised pale) and capsheet_oxide_0 (the approved
    oxide red for boxcar paint).
  banks/tileforms/TF-ART-002_CANDIDATES_8_8_26.json - metal_paint_bluegrey_0:
    the approved repaint blue-grey.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for blooms and streaks.
TASTE CHECK: no reporting marks, no logos, no numbers ever (the words
are his); thirty summers of fade; blooms cluster at panel seams; no
keyline, no dither, no purple, no self-light.

  python3 tools/tfcook/TF-ART-027_rollingstock_cook.py
    -> banks/tileforms/TF-ART-027_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-027_CANDIDATES_8_27_26.json')
CW, CH = 7*44, 4*44          # 7 cells long (x), 4 deep (y)

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

ALU   = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
OXIDE = pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'capsheet_oxide_0'))[0]
BLUE  = pools(bank_tile('banks/tileforms/TF-ART-002_CANDIDATES_8_8_26.json', 'metal_paint_bluegrey_0'))[0]
RUST  = pools(bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0'))[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def boxcar(v):
    im = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10900 + v*41)
    x0, x1, y0, y1 = 8, CW-10, 10, CH-12
    base = (dim(OXIDE, 1.02),
            tuple(int(a*0.84 + e*0.16) for a, e in zip(ALU, OXIDE)),   # bleached, but thirty dusty years, never fresh mill silver
            dim(BLUE, 0.94))[v]
    for y in range(y0, y1):
        for x in range(x0, x1):
            c = noise(base, r, 5)
            if (x-x0) % 22 == 0: c = dim(c, 1.14)           # panel seam crest
            elif (x-x0) % 22 >= 20: c = dim(c, 0.84)        # panel seam shadow
            t = (y-y0)/float(y1-y0)
            c = dim(c, 1.07 - 0.15*t)                        # north lit, south falls off
            px[x, y] = c + (255,)
    ry = (y0+y1)//2                                          # the running board, lengthwise
    for x in range(x0+8, x1-8):
        px[x, ry-1] = noise(dim(base, 1.18), r, 4) + (255,)
        px[x, ry]   = noise(dim(base, 1.12), r, 4) + (255,)
        px[x, ry+1] = noise(dim(base, 0.8), r, 4) + (255,)
    for ex in (x0, x1-8):                                    # end platforms + brake end
        for y in range(y0+2, y1-2):
            for x in range(ex, ex+8):
                px[x, y] = noise(dim(base, 0.78), r, 5) + (255,)
    bw = (y0+y1)//2                                          # brake wheel, one end: a small
    for dy in range(-3, 4):                                  # solid disc, never a dotted run
        for dx in range(-2, 3):
            if dx*dx + dy*dy <= 8:
                px[x0+3+dx, bw+dy] = noise(dim(base, 1.18 if dx*dx+dy*dy > 3 else 0.75), r, 4) + (255,)
    for k in range(14 + 8*(v == 0)):                         # rust blooms at seams
        bx2 = x0 + 22*r.randint(0, (x1-x0)//22)
        bx2 = min(x1-3, max(x0+2, bx2 + r.randint(-1, 1)))
        by2 = r.randint(y0+3, y1-4)
        for dy in range(-1, 4):
            for dx in range(-2, 3):
                if r.random() < 0.5 and 0 <= bx2+dx < CW and 0 <= by2+dy < CH:
                    a = 120 - 22*abs(dy)
                    if a > 0: px[bx2+dx, by2+dy] = RUST + (a,)
    for x in range(x0, x1):                                  # edges: lit north, dark south
        px[x, y0] = dim(base, 1.22) + (255,)
        px[x, y1-1] = dim(base, 0.5) + (255,)
    for y in range(y0, y1):
        px[x0, y] = dim(base, 1.05) + (255,)
        px[x1-1, y] = dim(base, 0.55) + (255,)
    for y in range(y0+2, y1+4):                              # ground shadow east+south
        for k in range(4):
            x = x1 + k
            if x < CW: px[x, min(y, CH-1)] = (12, 10, 8, 66-14*k)
    for x in range(x0+2, x1+4):
        for k in range(4):
            y = y1 + k
            if y < CH: px[x, y] = (12, 10, 8, 66-14*k)
    return im

def loco():
    im = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11000)
    x0, x1, y0, y1 = 8, CW-10, 10, CH-12
    body = dim(BLUE, 0.72)                                   # dead painted steel, darker
    for y in range(y0, y1):
        for x in range(x0, x1):
            c = noise(body, r, 5)
            t = (y-y0)/float(y1-y0)
            c = dim(c, 1.08 - 0.16*t)
            px[x, y] = c + (255,)
    cab0 = x0 + int((x1-x0)*0.62)                            # the cab band, a third from the east end
    for y in range(y0, y1):
        for x in range(cab0, cab0+26):
            px[x, y] = noise(dim(body, 1.16), r, 4) + (255,)
    for fx in (x0+26, x0+58, x0+90):                         # radiator fan rings on the long hood
        cxf, cyf = fx, (y0+y1)//2
        for a in range(0, 360, 6):
            import math as _m
            xx = int(cxf + 9*_m.cos(_m.radians(a))); yy = int(cyf + 9*_m.sin(_m.radians(a)))
            if x0 < xx < x1 and y0 < yy < y1: px[xx, yy] = dim(body, 1.25) + (255,)
        for a in range(0, 360, 8):
            import math as _m
            xx = int(cxf + 4*_m.cos(_m.radians(a))); yy = int(cyf + 4*_m.sin(_m.radians(a)))
            if x0 < xx < x1 and y0 < yy < y1: px[xx, yy] = dim(body, 0.6) + (255,)
    for x in range(x0, x1):                                  # walkway edges
        px[x, y0+1] = dim(body, 1.3) + (255,)
        px[x, y1-2] = dim(body, 0.45) + (255,)
        px[x, y0] = dim(body, 1.15) + (255,)
        px[x, y1-1] = dim(body, 0.5) + (255,)
    for k in range(20):                                      # thirty years of rust
        bx2, by2 = r.randint(x0+3, x1-4), r.randint(y0+2, y1-3)
        for dy in range(-1, 4):
            for dx in range(-2, 3):
                if r.random() < 0.5:
                    a = 110 - 20*abs(dy)
                    if a > 0: px[bx2+dx, by2+dy] = RUST + (a,)
    for y in range(y0+2, y1+4):                              # the same ground shadow
        for k in range(4):
            x = x1 + k
            if x < CW: px[x, min(y, CH-1)] = (12, 10, 8, 66-14*k)
    for x in range(x0+2, x1+4):
        for k in range(4):
            y = y1 + k
            if y < CH: px[x, y] = (12, 10, 8, 66-14*k)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [{'name': 'boxcar_%d' % v, 'b64': b64(boxcar(v))} for v in range(3)]
tiles.append({'name': 'loco_box', 'b64': b64(loco())})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-027: 118 '
           'boxcar blobs (101 exactly 7x4 cells) and 14 locomotive blobs drew '
           'as wall mass in the railyard. Roof-read rolling stock from the '
           'approved galv, oxide capsheet, bluegrey paint and rail-plate rust; '
           'no reporting mark, no number, ever. '
           'tools/tfcook/TF-ART-027_rollingstock_cook.py',
    'family': 'TF-ART-027', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d rolling-stock sprites -> %s' % (len(tiles), OUT))
