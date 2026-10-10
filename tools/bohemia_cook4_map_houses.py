#!/usr/bin/env python3
"""COOK FOUR [the house skins back on the map] -- his thirty approved house skins on the map's near stop.

The map's near stop shows a block's hero picture one art pixel to one device pixel (RUN 10/2,
__THE_NEAR_STOP_IS_THE_ART_AT_ITS_OWN_PIXELS__).  The suburb and the town heroes were flat-shaded
grey boxes.  This tool rebuilds them as isometric houses whose every face is one of his skins
(banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26, 30 of 30 UP 7/21) projected on to the box: stucco
walls with their windows and doors, terracotta / desert-brown / grey-brown clay roofs, gravel flat
roofs, yards of desert tan; the street from his cracked street pack (rule 82a).  Our paint is
light only: one sun from the north-west (rule 70a), the faces shaded by which way they look.

DROP-IN: the same names, the same canvas (256 x 154 suburb, 256 x 160 town) and the same plate
pixels as the heroes they replace, so HERO_ANCH / HERO_PLATE hold unchanged.  Output in
slices/cook4_map_houses/; RUN composites them (RUN owns the map's code and the tile chunks).

  python3 tools/bohemia_cook4_map_houses.py

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his thirty house skins themselves, his cracked street tiles, and the heroes they
  replace (slices/BOHEMIA_CITY_TILES_02.js 'suburb', 'town') at the same size; a real Las Vegas
  tract from above (stucco boxes, clay roofs, a gravel yard, a carport, one street).
  structure taken: the existing hero's plate geometry to the pixel (the anchor never moves); the
  skins' cells as texture, never redrawn; one sun.
  what changed: grey shaded boxes become stucco houses with real windows, doors and clay roofs.
"""
import base64, io, json, os, random
from PIL import Image, ImageDraw, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices/cook4_map_houses')
CELL = 16          # one skin cell on the map: a 44 px skin at the near stop's scale (a storey ~3 m)

SK = {t['id']: t for t in json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt')))['tiles']}
_ids = list(SK)
def skin(i, n=CELL):
    t = SK[_ids[i]]
    return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA').resize((n, n), Image.BOX)

_PK = {}
def pack(name, idx):
    """a pack tile, UP-only (the 7/13 confirmed set), cached"""
    if not _PK:
        for i in range(1, 5):
            d = json.load(open(os.path.join(ROOT, f'banks/BOHEMIA_HD_TILE_REPO_part{i}.txt')))
            for k, v in d['packs'].items(): _PK.setdefault(k, v)
        c = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))
        _PK['__up__'] = {(x['pack'], x['idx']) for x in c['verdicts'] if x['v'] == 'UP'}
    if (name, idx) not in _PK['__up__']:
        raise SystemExit(f'REFUSED: {name}#{idx} is not in his approved set')
    return Image.open(io.BytesIO(base64.b64decode(_PK[name][idx]['b64']))).convert('RGBA')

def prop(canvas, iso, im, u, v, h):
    """a pack prop standing on the plate at (u, v), scaled to h px tall, its foot on the ground"""
    s = h / im.height; im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.BOX)
    x, y = iso.P(u, v)
    sh = Image.new('RGBA', canvas.size); ImageDraw.Draw(sh).ellipse([x - im.width * .45 + 2, y - 2, x + im.width * .45 + 3, y + 2], fill=(30, 22, 16, 80))
    canvas.alpha_composite(sh); canvas.alpha_composite(im, (int(x - im.width / 2), int(y - im.height)))

def pack_street():
    for i in range(1, 5):
        d = json.load(open(os.path.join(ROOT, f'banks/BOHEMIA_HD_TILE_REPO_part{i}.txt')))
        if '1. Cracked street tiles' in d['packs']:
            t = d['packs']['1. Cracked street tiles'][0]
            return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')

def strip(cells, h_cells=1):
    """a texture: a row of skin cells (h_cells high, the same row repeated)"""
    w = len(cells) * CELL
    im = Image.new('RGBA', (w, h_cells * CELL))
    for r in range(h_cells):
        for k, c in enumerate(cells):
            im.alpha_composite(c if r == h_cells - 1 else (c if not isinstance(c, tuple) else c), (k * CELL, r * CELL))
    return im

def shade(im, f):
    r = Image.new('RGBA', im.size, (int(255 * f), int(255 * f), int(255 * f), 255))
    out = ImageChops.multiply(im, r); out.putalpha(im.split()[3]); return out

def face(canvas, tex, O, E1, E2):
    """paint tex on the parallelogram O + s*E1 + t*E2 (s, t in 0..1); tex (0,0) at O"""
    tw, th = tex.size
    # forward: X = O + (x/tw)*E1 + (y/th)*E2 ; inverse for PIL
    a, b = E1[0] / tw, E2[0] / th
    c, d = E1[1] / tw, E2[1] / th
    det = a * d - b * c
    if abs(det) < 1e-9: return
    ia, ib, ic, id_ = d / det, -b / det, -c / det, a / det
    tx, ty = O
    coef = (ia, ib, -(ia * tx + ib * ty), ic, id_, -(ic * tx + id_ * ty))
    warped = tex.transform(canvas.size, Image.AFFINE, coef, resample=Image.NEAREST)
    m = Image.new('L', canvas.size, 0)
    pts = [O, (O[0] + E1[0], O[1] + E1[1]), (O[0] + E1[0] + E2[0], O[1] + E1[1] + E2[1]), (O[0] + E2[0], O[1] + E2[1])]
    ImageDraw.Draw(m).polygon(pts, fill=255)
    m = ImageChops.multiply(m, warped.split()[3])
    canvas.paste(warped, (0, 0), m)

class Iso:
    def __init__(self, H):
        self.H = H; self.top = H - 1 - 5 - 128
    def P(self, u, v, z=0):
        return (128 + (u - v) * 128, self.top + (u + v) * 64 - z)

def plate(canvas, iso, yard_id, rng):
    tex = Image.new('RGBA', (16 * CELL, 16 * CELL))
    for y in range(16):
        for x in range(16):
            tex.alpha_composite(skin(yard_id), (x * CELL, y * CELL))
    O = iso.P(0, 0); face(canvas, tex, O, (iso.P(1, 0)[0] - O[0], iso.P(1, 0)[1] - O[1]), (iso.P(0, 1)[0] - O[0], iso.P(0, 1)[1] - O[1]))
    # the slab's two visible edges, in the plate's own dust colour darkened (light only)
    d = ImageDraw.Draw(canvas)
    for (a, b, f) in (((1, 0), (1, 1), .55), ((0, 1), (1, 1), .7)):
        p, q = iso.P(*a), iso.P(*b)
        d.polygon([p, q, (q[0], q[1] + 5), (p[0], p[1] + 5)], fill=(int(150 * f), int(128 * f), int(96 * f), 255))

def street(canvas, iso, v0, v1, st):
    tile = st.resize((CELL * 2, CELL * 2), Image.BOX)
    tex = Image.new('RGBA', (16 * CELL, int((v1 - v0) * 16) * CELL or CELL))
    for y in range(0, tex.height, tile.height):
        for x in range(0, tex.width, tile.width):
            tex.alpha_composite(tile, (x, y))
    O = iso.P(0, v0); A = iso.P(1, v0); B = iso.P(0, v1)
    face(canvas, tex, O, (A[0] - O[0], A[1] - O[1]), (B[0] - O[0], B[1] - O[1]))

def house(canvas, iso, rng, u0, v0, du, dv, storeys=1, flat=False, roof=None, wall=None):
    """a box on the plate, its two visible walls (v = v0+dv faces SW, u = u0+du faces SE) and its roof"""
    z = storeys * CELL
    wall = wall if wall is not None else rng.choice([8, 9, 10, 11])
    u1, v1 = u0 + du, v0 + dv
    def wall_tex(n, front):
        cells = []
        for k in range(n):
            if front and k == n // 2: cells.append(skin(rng.choice([18, 19, 20])))
            elif rng.random() < .55: cells.append(skin(rng.choice([12, 13, 14, 15, 16, 17])))
            else: cells.append(skin(wall))
        im = Image.new('RGBA', (n * CELL, storeys * CELL))
        for r in range(storeys):
            for k, cimg in enumerate(cells):
                use = cimg if (r == storeys - 1 or not front) else skin(rng.choice([12, 13, 14, 15, 16, 17]) if rng.random() < .6 else wall)
                im.alpha_composite(use, (k * CELL, r * CELL))
        return im
    L = lambda a, b: (b[0] - a[0], b[1] - a[1])
    # SW face (v = v1): from (u0,v1) to (u1,v1)
    n_sw = max(1, round(du * 256 / 2 / CELL * 1.12)); n_se = max(1, round(dv * 256 / 2 / CELL * 1.12))
    O = iso.P(u0, v1, z); face(canvas, shade(wall_tex(n_sw, True), .86), O, L(O, iso.P(u1, v1, z)), L(O, iso.P(u0, v1, 0)))
    O = iso.P(u1, v1, z); face(canvas, shade(wall_tex(n_se, False), .66), O, L(O, iso.P(u1, v0, z)), L(O, iso.P(u1, v1, 0)))
    if flat:
        g = skin(roof if roof is not None else rng.choice([6, 7]))
        tex = Image.new('RGBA', (CELL * 8, CELL * 8))
        for y in range(8):
            for x in range(8): tex.alpha_composite(g, (x * CELL, y * CELL))
        O = iso.P(u0, v0, z); face(canvas, shade(tex, 1.0), O, L(O, iso.P(u1, v0, z)), L(O, iso.P(u0, v1, z)))
        d = ImageDraw.Draw(canvas)   # the parapet's lit lip
        d.line([iso.P(u0, v1, z), iso.P(u1, v1, z), iso.P(u1, v0, z)], fill=(222, 206, 176, 255), width=1)
        return
    # a gable along u: the ridge at v mid, raised
    rid = roof if roof is not None else rng.choice([21, 22, 23, 24, 25, 26])
    rt = Image.new('RGBA', (CELL * 8, CELL * 3))
    for y in range(3):
        for x in range(8): rt.alpha_composite(skin(rid), (x * CELL, y * CELL))
    vm = v0 + dv / 2; rz = z + CELL * .55
    O = iso.P(u0, vm, rz); face(canvas, shade(rt, .74), O, L(O, iso.P(u1, vm, rz)), L(O, iso.P(u0, v0, z)))   # back plane, away from the sun
    O = iso.P(u0, vm, rz); face(canvas, shade(rt, 1.0), O, L(O, iso.P(u1, vm, rz)), L(O, iso.P(u0, v1, z)))  # front plane, in the sun
    # the gable end (u = u1): the wall's triangle
    d = ImageDraw.Draw(canvas)
    tri = [iso.P(u1, v1, z), iso.P(u1, v0, z), iso.P(u1, vm, rz)]
    wc = skin(wall).resize((1, 1), Image.BOX).getpixel((0, 0))
    d.polygon(tri, fill=tuple(int(x * .66) for x in wc[:3]) + (255,))
    d.line([iso.P(u0, vm, rz), iso.P(u1, vm, rz)], fill=(60, 40, 30, 255), width=1)

def shadow(canvas, iso, u0, v0, du, dv):
    """the house's shadow on the yard, thrown south-east by a north-west sun"""
    sh = Image.new('RGBA', canvas.size); d = ImageDraw.Draw(sh)
    k = .05
    d.polygon([iso.P(u0 + du, v0), iso.P(u0 + du + k, v0 + k * .4), iso.P(u0 + du + k, v0 + dv + k), iso.P(u0 + k * .4, v0 + dv + k), iso.P(u0, v0 + dv)], fill=(30, 22, 16, 90))
    canvas.alpha_composite(sh)

def build(name, H, rng, lots, yard, st, props=()):
    c = Image.new('RGBA', (256, H)); iso = Iso(H)
    plate(c, iso, yard, rng)
    street(c, iso, .46, .56, st)
    for L in sorted(lots, key=lambda l: l[0] + l[1]):
        shadow(c, iso, L[0], L[1], L[2], L[3])
    for L in sorted(lots, key=lambda l: (l[0] + l[2] / 2) + (l[1] + l[3] / 2)):
        house(c, iso, rng, *L[:4], **(L[4] if len(L) > 4 else {}))
    for (pk, ix, u, v, h) in sorted(props, key=lambda q: q[2] + q[3]):
        prop(c, iso, pack(pk, ix), u, v, h)
    return c

def main():
    os.makedirs(OUT, exist_ok=True)
    st = pack_street(); rng = random.Random('cook4 map houses')
    # the suburb: two rows of single-storey tract houses either side of the street, clay roofs
    sub = [(u, v, .15, .15) for u in (.06, .28, .50, .72) for v in (.12,)] + \
          [(u, v, .15, .15) for u in (.08, .30, .52, .74) for v in (.66,)] + [(.08, .30, .13, .11)]
    CARS = '9. Abandoned cards'; TREE = '16. Dead trees and plants'
    sub_props = [(CARS, 0, .25, .3, 9), (CARS, 3, .69, .31, 9), (CARS, 5, .27, .62, 9), (TREE, 3, .03, .2, 16),
                 (TREE, 7, .92, .78, 16), (TREE, 3, .47, .86, 14), (CARS, 8, .58, .50, 9)]
    S = build('suburb', 154, rng, sub, 27, st, sub_props)
    # the town: two-storey stucco shops with gravel flat roofs on the street, houses behind
    town = [(.04, .25, .22, .17, dict(storeys=2, flat=True)), (.30, .25, .2, .17, dict(storeys=2, flat=True)),
            (.54, .27, .18, .15, dict(storeys=1, flat=True)), (.76, .25, .19, .17, dict(storeys=2, flat=True)),
            (.06, .62, .2, .17, dict(storeys=2, flat=True)), (.54, .62, .2, .17, dict(storeys=2, flat=True)),
            (.78, .64, .14, .14), (.08, .04, .15, .14), (.62, .04, .15, .14)]
    # the open lot where a house was: a parked car and a burn barrel on the bare ground
    town_props = [(CARS, 10, .36, .68, 9), (CARS, 2, .44, .72, 9), ('18. Light sources and fire barrels', 24, .40, .80, 9),
                  (CARS, 12, .2, .51, 9), (TREE, 9, .95, .1, 15)]
    T = build('town', 160, rng, town, 28, st, town_props)
    # the trailer park: long single-wides in rows on gravel, a car at each, no street through (a dirt lane)
    trl = [(u, v, .26, .07, dict(flat=True, roof=7, wall=rng.choice([8, 10]))) for u in (.06, .38, .70) for v in (.1, .3, .66, .86)]
    trl = [t for t in trl if not (t[0] == .70 and t[1] == .86)]
    tr_props = [(CARS, 14, .8, .9, 9), (CARS, 4, .2, .5, 9), (TREE, 12, .9, .4, 15), ('18. Light sources and fire barrels', 24, .55, .5, 9)]
    R_ = build('trailer', 138, rng, trl, 27, st, tr_props)
    S.save(os.path.join(OUT, 'suburb.png')); T.save(os.path.join(OUT, 'town.png')); R_.save(os.path.join(OUT, 'trailer.png'))
    json.dump({'version': 'cook4-map-houses-10-10', 'lane': 'cook 4', 'for': 'RUN: HERO_SRC suburb and town, same names, same canvas, HERO_ANCH/HERO_PLATE unchanged',
               'heroes': {'suburb': [256, 154], 'town': [256, 160], 'trailer': [256, 138]}, 'skins': 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (30 of 30 UP)',
               'pack': '1. Cracked street tiles#0'}, open(os.path.join(OUT, 'map_houses.json'), 'w'), indent=1)
    print('suburb', S.size, 'town', T.size)

if __name__ == '__main__':
    main()
