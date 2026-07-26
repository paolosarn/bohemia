#!/usr/bin/env python3
"""
BOHEMIA ACT-1 STARTER TILESET + THE REASSEMBLY TEST (7/26/26)

THE LAW THIS EXISTS FOR — amendment C of the art-first reset, THE ANTI-BIOSHOCK
RULE, verbatim:

    "the painted mockup is not the constitution - the target phase's acceptance
     test is CUT the picked mockup into the real starter tileset and REASSEMBLE
     the identical frame from those tiles on the real render path. The
     tile-reassembled frame is the framed target. If reassembly looks worse, the
     mockup lied; fix before locking."

WHAT THE FIRST MEASUREMENT FOUND, BEFORE ANY OF THIS WAS BUILT:
    the target mockup is 264 ground cells and cuts into 262 UNIQUE tiles.
    With the dirt pass and the vignette turned off it is still 256. With the
    cast shadows off too it is still 240.
So the mockup, as painted, is not a tiled world at all - it is a one-off
painting. Every cell got its own random pool pick, its own flip, and its own
row-by-row gradient, so nothing repeats. A world built that way cannot exist:
it would need a unique tile per cell of the whole valley.

THE MOCKUP LIED, EXACTLY THE WAY AMENDMENT C SAYS A MOCKUP LIES. This tool is
the fix: it builds a REAL, BOUNDED tileset, re-lays the same frame out of
nothing but those tiles, and renders it through a real browser canvas with
integer blit and smoothing off (the pipeline rule from the render contract), so
what comes out is a frame the engine could actually draw.

REUSE CHECK: cooks NO new graphic pixels. Every tile in the set is generated
from art Paolo already approved -
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt for stucco, roof tile, gravel
deck, windows, boarded panels, the door leaf and the yard;
used BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt for asphalt, the centre line,
sidewalk, kerb, the crossing bars and the desert;
used BOHEMIA_STREET_PROP_POOLS_7_18_26.txt for the wrecks and the drum;
used BOHEMIA_DESERT_POOLS_7_18_26.txt for rubble and boulders;
used BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt for the street lamp.
The only new pixels are the same structural ones the target screen already
declares: value steps, the roof's pitch shading and the door reveal.

TASTE CHECK: this emits a TILESET, not a candidate batch, so there is no
pre-judge kill pass to run. It inherits every rule the target screen is already
held to (three value bands, no black keyline, dead dark glass, no radiation
iconography, cars 2x3) because it is generated from the same constants, and
gates/target_screen_gate.py checks the tileset against them directly.

NAME IT OR DON'T DRAW IT: every tile in the set carries a name and a plain
sentence. A tileset of anonymous swatches is exactly the thing that law bans.

  python3 tools/bohemia_starter_tileset.py
    -> banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt   the tileset + the map
    -> records/target/TILESET_CONTACT.png               every tile, labelled
    -> slices/BOHEMIA_REASSEMBLY_7_26_26.html           the real render path
"""
import base64
import importlib.util
import io
import json
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
OUT_HTML = 'slices/BOHEMIA_REASSEMBLY_7_26_26.html'
OUTDIR = 'records/target'
MAX_TILES = 96          # a hard ceiling. A "tileset" of 240 is a painting.


def factory():
    spec = importlib.util.spec_from_file_location(
        'bohemia_target_factory', 'tools/bohemia_target_screen_factory.py')
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    os.chdir(REPO)
    return m


class TileSet:
    """A bounded, NAMED set of 38px tiles. Every one is generated exactly once
    and reused everywhere it appears - which is the whole difference between a
    tileset and a painting."""

    def __init__(self, cell):
        self.cell = cell
        self.tiles = []
        self.by_name = {}

    def add(self, name, what, img):
        if name in self.by_name:
            return self.by_name[name]
        if img.size != (self.cell, self.cell):
            img = img.resize((self.cell, self.cell), Image.LANCZOS)
        idx = len(self.tiles)
        self.tiles.append({'id': name, 'what': what, 'img': img.convert('RGBA')})
        self.by_name[name] = idx
        return idx

    def __getitem__(self, name):
        return self.by_name[name]


# ---------------------------------------------------------------------------
# THE TILES. Each one is generated ONCE from approved material and reused.
# ---------------------------------------------------------------------------
def build_tiles(M, C):
    T = TileSet(M.CELL)

    def mat(pool, seed, tone=1.0, warm=(1.0, 1.0, 1.0), texel=None):
        im = Image.new('RGBA', (M.CELL, M.CELL), (0, 0, 0, 0))
        M.fill_rect(im, pool, 0, 0, M.CELL, M.CELL, size=texel or M.CELL,
                    seed=seed, uniform=True)
        return M.shade(im, tone, warm=warm) if (tone != 1.0 or warm != (1, 1, 1)) else im

    # --- GROUND -----------------------------------------------------------
    for i in range(3):
        T.add('road_%d' % i, 'cracked asphalt, the plain lane surface', mat(C.street['street'], 2 + i))
    T.add('road_centre', 'asphalt carrying the faded white centre line', mat(C.street['lane_div'], 3))
    for i in range(3):
        T.add('walk_%d' % i, 'poured concrete sidewalk, cracked and weedy', mat(C.street['side'], 4 + i))
    k = mat(C.street['side'], 4)
    M.band(k, 0, M.CELL - 5, M.CELL, 4, (200, 190, 164, 205))
    M.band(k, 0, M.CELL - 1, M.CELL, 2, (30, 26, 17, 150))
    T.add('walk_kerb', 'the sidewalk tile that has the kerb lip on its road edge', k)
    g = mat(C.street['street'], 2)
    for i in range(9):
        M.band(g, 0, i, M.CELL, 1, (26, 22, 14, 120 - i * 12))
    T.add('road_gutter', 'the asphalt right against the kerb, in the kerb shadow', g)
    cb = mat(C.street['cross'], 2, tone=1.55)
    m = Image.new('L', cb.size, 0)
    d = ImageDraw.Draw(m)
    bar, gap = max(8, int(M.CELL * 0.40)), max(5, int(M.CELL * 0.26))
    x = 2
    while x < M.CELL - 2:
        d.rectangle([x, 0, x + bar, M.CELL], fill=255)
        x += bar + gap
    base = mat(C.street['street'], 2)
    cb.putalpha(m)
    base.alpha_composite(cb)
    T.add('road_crossing', 'asphalt with the painted crossing bars on it', base)
    for i in range(3):
        T.add('yard_%d' % i, 'the dead gravel yard surface', mat(C.house['yard_deserttan'], 6 + i,
                                                                tone=0.94))
    for i in range(2):
        T.add('concrete_%d' % i, 'a poured concrete path or driveway slab',
              mat(C.street['side'], 7 + i, tone=1.04))
    T.add('dirt', 'the graded dirt every lot sits on', mat(C.house['yard_deserttan'], 1, tone=0.82))

    # --- WALLS ------------------------------------------------------------
    W_TONE = M.FRONT
    for i in range(3):
        T.add('wall_%d' % i, 'pale cracked stucco wall', mat(C.house['wall_plain'], 3 + i,
                                                             tone=W_TONE, warm=(1.02, 1.0, 0.97)))
    wb = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
    for i in range(M.CELL // 2):
        a = int(86 * (1 - i / (M.CELL / 2.0)) ** 1.3)
        M.band(wb, 0, M.CELL - 1 - i, M.CELL, 1, (34, 26, 16, a))
    T.add('wall_base', 'the bottom course of a wall, with thirty years of dust on it', wb)
    wt = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
    for i in range(11):
        M.band(wt, 0, i, M.CELL, 1, (24, 19, 11, int(120 * (1 - i / 11.0) ** 1.4)))
    T.add('wall_under_eave', 'the top course of a wall, in the shadow the eave throws', wt)

    def pane(kind, seed):
        w = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
        src = C.house[kind][seed % len(C.house[kind])]
        p = src.crop((6, 6, 38, 32)).resize((int(M.CELL * 0.66), int(M.CELL * 0.50)),
                                            Image.LANCZOS)
        px, py = (M.CELL - p.width) // 2, int(M.CELL * 0.24)
        M.band(w, px - 3, py - 3, p.width + 6, p.height + 6, (78, 70, 55, 255))
        M.band(w, px - 3, py - 3, p.width + 6, 2, (198, 186, 158, 215))
        w.alpha_composite(M.shade(p, 0.92), (px, py))
        M.band(w, px, py, p.width, 3, (18, 14, 9, 150))
        M.band(w, px - 5, py + p.height + 3, p.width + 10, 3, (208, 196, 168, 235))
        for i in range(5):
            M.band(w, px - 5, py + p.height + 6 + i, p.width + 10, 1, (28, 22, 14, 100 - i * 18))
        return w
    T.add('wall_window', 'a wall tile with a window in it - dead dark glass, sill and reveal',
          pane('wall_window', 0))
    T.add('wall_boarded', 'a wall tile whose window is boarded over', pane('wall_boarded', 1))

    # --- THE DOOR, two tiles tall (the law) --------------------------------
    dw, dh = M.CELL, M.CELL * 2
    leaf = Image.new('RGBA', (dw, dh), (0, 0, 0, 0))
    leaf.alpha_composite(M.interior_plate(C, dw, dh, seed=2))
    leaf.alpha_composite(M.door_panel(C, dw, dh, 0.56))
    for half, nm, wht in ((0, 'door_top', 'the top half of an open two-tile doorway, with its '
                                          'lit lintel'),
                          (1, 'door_bottom', 'the bottom half of an open two-tile doorway, with '
                                             'the room and the threshold showing')):
        t = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
        t.alpha_composite(leaf.crop((0, half * M.CELL, dw, (half + 1) * M.CELL)))
        M.band(t, 0, 0, 2, M.CELL, (40, 31, 19, 210))
        M.band(t, M.CELL - 2, 0, 2, M.CELL, (40, 31, 19, 210))
        if half == 0:
            M.band(t, 0, 0, M.CELL, 3, (192, 178, 148, 230))
        T.add(nm, wht, t)

    gt = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
    M.band(gt, 0, 0, M.CELL, M.CELL, (24, 20, 13, 245))
    for i in range(5):
        v = 150 - i * 16
        M.band(gt, 0, 3 + i * 3, M.CELL, 2, (v, v - 12, v - 30, 255))
    M.band(gt, 0, 0, M.CELL, 3, (192, 178, 148, 225))
    T.add('garage_top', 'the top half of an open garage bay, roll-up door stacked in its header',
          gt)
    gb = Image.new('RGBA', (M.CELL, M.CELL), (0, 0, 0, 0))
    gb.alpha_composite(M.shade(mat(C.house['wall_plain'], 21), 0.20, warm=(1.05, 0.99, 0.9)))
    fl = mat(C.street['side'], 22)
    gb.alpha_composite(M.shade(fl, 0.30).crop((0, 0, M.CELL, int(M.CELL * 0.45))),
                       (0, int(M.CELL * 0.55)))
    M.band(gb, 0, int(M.CELL * 0.55), M.CELL, 2, (16, 13, 9, 200))
    T.add('garage_bottom', 'the bottom half of an open garage bay - the empty floor inside', gb)

    # --- ROOF -------------------------------------------------------------
    def roofmat(fam, tone, seed):
        im = Image.new('RGBA', (M.CELL, M.CELL), (0, 0, 0, 0))
        M.fill_rect(im, C.pool(fam), 0, 0, M.CELL, M.CELL, size=18, seed=seed, uniform=True)
        return M.shade(im, tone, warm=(1.03, 1.0, 0.93))
    R = 'house:roof_stile_terracotta'
    T.add('roof_slope', 'terracotta roof, the near slope you look at', roofmat(R, M.TOP * 0.86, 31))
    rr = roofmat(R, M.TOP, 31)
    M.band(rr, 0, 0, M.CELL, 3, (255, 246, 216, 235))
    M.band(rr, 0, 3, M.CELL, 2, (58, 44, 26, 170))
    T.add('roof_ridge', 'the sun-caught ridge course along the top of a roof', rr)
    re_ = roofmat(R, M.TOP * 0.86, 31)
    M.band(re_, 0, M.CELL - 6, M.CELL, 5, (96, 80, 56, 255))
    M.band(re_, 0, M.CELL - 6, M.CELL, 2, (214, 198, 162, 255))
    M.band(re_, 0, M.CELL - 1, M.CELL, 2, (40, 31, 19, 255))
    T.add('roof_eave', 'the bottom course of a roof, carrying the fascia board', re_)
    # THE HIP CORNERS. A hip roof is a TRAPEZOID, and a trapezoid is not a grid
    # of squares - the first reassembly laid the roof as flat horizontal stripes
    # and the house lost its silhouette completely. These four tiles carry the
    # diagonal, with the outside of it TRANSPARENT so the roof reads as a shape
    # sitting on a house instead of a band running off the edge of the world.
    def hip(base_tone, seed, poly):
        t = roofmat(R, base_tone, seed)
        mk = Image.new('L', t.size, 0)
        ImageDraw.Draw(mk).polygon(poly, fill=255)
        t.putalpha(Image.composite(t.getchannel('A'), Image.new('L', t.size, 0), mk))
        return t
    Cc = M.CELL
    T.add('roof_hipTL', 'the top-left corner of a hip roof: the slope cuts in, and above '
          'the cut there is nothing', hip(M.TOP, 32, [(Cc, 0), (Cc, Cc), (0, Cc)]))
    T.add('roof_hipBL', 'the bottom-left corner of a hip roof, sloping in toward the sun',
          hip(M.TOP * 0.94, 32, [(0, 0), (Cc, 0), (Cc, Cc), (0, Cc)]))
    T.add('roof_hipTR', 'the top-right corner of a hip roof, the shaded side',
          hip(M.SIDE * 1.30, 33, [(0, 0), (0, Cc), (Cc, Cc)]))
    T.add('roof_hipBR', 'the bottom-right corner of a hip roof, the shaded side',
          hip(M.SIDE * 1.24, 33, [(0, 0), (Cc, 0), (Cc, Cc), (0, Cc)]))
    # WALL ENDS. Without a value step at the corner a row of wall tiles reads as
    # one endless wall, which is what the first reassembly produced.
    for nm, wht, lit in (('wall_end_l', 'the left-hand corner of a building - the sunlit '
                          'edge that tells you the wall stops here', True),
                         ('wall_end_r', 'the right-hand corner of a building - the shaded '
                          'edge that tells you the wall stops here', False)):
        w = mat(C.house['wall_plain'], 3, tone=W_TONE, warm=(1.02, 1.0, 0.97))
        if lit:
            M.band(w, 0, 0, 3, Cc, (255, 246, 220, 70))
        else:
            M.band(w, Cc - 4, 0, 4, Cc, (36, 28, 18, 130))
        T.add(nm, wht, w)
    T.add('roof_deck', 'a flat gravel roof deck', roofmat('house:roof_gravel', M.TOP * 0.78, 44))
    rp = roofmat('house:roof_gravel', M.TOP * 0.78, 44)
    M.band(rp, 0, M.CELL - 9, M.CELL, 9, (150, 139, 116, 255))
    M.band(rp, 0, M.CELL - 9, M.CELL, 3, (224, 212, 184, 255))
    M.band(rp, 0, M.CELL - 1, M.CELL, 2, (44, 34, 21, 255))
    T.add('roof_parapet', 'the parapet wall around a flat roof, lit along its coping', rp)
    return T


# ---------------------------------------------------------------------------
# THE MAP. The same frame, re-laid out of nothing but the tiles above. Two
# layers: what you walk on, and what stands on it.
# ---------------------------------------------------------------------------
def build_map(T, GW, GH):
    ground = [['dirt'] * GW for _ in range(GH)]
    struct = [[None] * GW for _ in range(GH)]

    def fill(layer, x0, y0, x1, y1, pick):
        for y in range(max(0, y0), min(GH, y1 + 1)):
            for x in range(max(0, x0), min(GW, x1 + 1)):
                layer[y][x] = pick(x, y)

    v = lambda base, n: (lambda x, y: '%s_%d' % (base, ((x * 7 + y * 13) % n)))
    fill(ground, 0, 9, 7, 13, v('yard', 3))               # the front yard
    fill(ground, 8, 6, 10, 15, v('concrete', 2))          # the driveway
    fill(ground, 3, 9, 3, 13, v('concrete', 2))           # the front walk
    fill(ground, 0, 14, 10, 14, v('walk', 3))             # sidewalk, house side
    fill(ground, 0, 15, 10, 15, lambda x, y: 'walk_kerb')
    fill(ground, 0, 16, 10, 21, v('road', 3))             # the carriageway
    fill(ground, 0, 16, 10, 16, lambda x, y: 'road_gutter')
    fill(ground, 0, 18, 10, 18, lambda x, y: 'road_centre')
    fill(ground, 2, 16, 4, 21, lambda x, y: 'road_crossing')
    fill(ground, 0, 22, 10, 22, lambda x, y: 'walk_kerb')
    fill(ground, 0, 23, 10, 23, v('walk', 3))

    shadows = []

    def house(x0, x1, roof_top, wall_top, wall_bot, hipped=True, windows=(), door=None,
              garage=None):
        """Lay ONE building, with the edge tiles that give it a silhouette and a
        cast shadow on the ground in front of it. A building without corners and
        without a shadow is a wall running off the edge of the world - which is
        exactly what the first reassembly produced."""
        for y in range(roof_top, wall_top):
            for x in range(x0, x1 + 1):
                if hipped:
                    top = (y == roof_top)
                    t = ('roof_hipTL' if (x == x0 and top) else
                         'roof_hipBL' if x == x0 else
                         'roof_hipTR' if (x == x1 and top) else
                         'roof_hipBR' if x == x1 else
                         'roof_ridge' if top else 'roof_eave')
                else:
                    t = 'roof_deck' if y == roof_top else 'roof_parapet'
                if 0 <= y < GH and 0 <= x < GW:
                    struct[y][x] = t
        for y in range(wall_top, wall_bot + 1):
            for x in range(x0, x1 + 1):
                if not (0 <= y < GH and 0 <= x < GW):
                    continue
                t = ('wall_under_eave' if y == wall_top else
                     'wall_base' if y == wall_bot else
                     'wall_%d' % ((x * 7 + y * 13) % 3))
                if x == x0:
                    t = 'wall_end_l'
                elif x == x1:
                    t = 'wall_end_r'
                struct[y][x] = t
        for wx in windows:
            if 0 <= wall_top + 1 < GH:
                struct[wall_top + 1][wx] = 'wall_window' if wx % 2 == 0 else 'wall_boarded'
        if door:
            struct[wall_bot - 1][door] = 'door_top'
            struct[wall_bot][door] = 'door_bottom'
        if garage:
            struct[wall_bot - 1][garage] = 'garage_top'
            struct[wall_bot][garage] = 'garage_bottom'
        shadows.append({'x': x0, 'y': wall_bot + 1, 'w': x1 - x0 + 1,
                        'h': max(0.6, (wall_bot - roof_top) * 0.30)})

    # the row of houses on the next street back, cut off by the top of frame.
    # A gap of dirt between them is what makes them read as separate houses.
    house(0, 4, -1, 1, 3, hipped=True, windows=(1, 3))
    house(6, 10, -1, 1, 3, hipped=False, windows=(7, 9))
    house(1, 7, 4, 6, 9, hipped=True, windows=(2, 6), door=3)   # YOUR HOUSE
    house(8, 10, 4, 6, 8, hipped=False, garage=9)               # THE GARAGE
    return ground, struct, shadows


def sprites(M, C):
    """The things that STAND on the map. These are sprites, not tiles: they carry
    their own contact shadow and their own footprint, exactly as the engine would
    hold them. Every one is named, per NAME IT OR DON'T DRAW IT."""
    out = []

    def add(name, what, img, gx, gy, w_cells, h_cells, rot=0):
        if rot:
            img = img.transpose(Image.ROTATE_90)
        px = (int(w_cells * M.CELL), int(h_cells * M.CELL))
        out.append({'id': name, 'what': what, 'x': gx, 'y': gy,
                    'w': w_cells, 'h': h_cells,
                    'img': img.resize(px, Image.LANCZOS).convert('RGBA')})

    add('wreck_driveway', 'a stripped patrol car nose-in on the driveway',
        C.prop['car_wreck'][6], 8.4, 9.2, M.CAR_W, M.CAR_L)
    add('wreck_road', 'a burnt-out sedan dead in the near lane, clear of the crossing',
        C.prop['car_wreck'][2], 6.5, 16.5, M.CAR_L, M.CAR_W, rot=1)
    add('wreck_kerb', 'another dead car shoved against the far kerb',
        C.prop['car_wreck'][14], 0.2, 19.4, M.CAR_L, M.CAR_W, rot=1)
    add('oil_drum', 'a plain rusted drum with a fire in it - no hazard markings on it',
        C.prop['fire_barrel'][7], 0.1, 13.3, 0.85, 1.7)
    add('lamp_house_side', 'a cast-iron street lamp on a slim post, three tiles of post',
        C.lamp[3], 9.4, 12.8, 1.3, 3.2)
    add('lamp_your_side', 'the matching street lamp on your side of the road',
        C.lamp[3], 6.3, 20.8, 1.3, 3.2)
    add('rubble_yard', 'broken masonry dumped in the yard', C.desert['rubble'][2], 6, 12.2, 1.2, 0.8)
    add('boulder_yard', 'a decorative boulder from when this yard was landscaped',
        C.desert['boulder'][11], 1, 11.3, 0.9, 0.7)
    add('rubble_road', 'a heap of broken concrete swept to the side of the carriageway',
        C.desert['rubble'][5], 4, 20.2, 1.3, 0.9)
    for clip, nm, wht, gx, gy in (
            ('idle_S', 'you', 'the character you built, on your own front walk', 3.0, 12.3),
            ('walk_E_1', 'the_neighbour', 'somebody else off this block, walking east', 6.4, 13.9)):
        b = Image.open(os.path.join(OUTDIR, 'char', clip + '.png')).convert('RGBA')
        b = b.crop(b.getbbox())
        h = M.BODY_PX * M.BODY_K / float(M.CELL)
        add(nm, wht, b, gx, gy, h * b.width / float(b.height), h)
    return out


def b64(img):
    b = io.BytesIO()
    img.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


HTML = """<meta charset="utf-8">
<title>BOHEMIA - THE REASSEMBLED FRAME</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#0b0d09">
<canvas id="cv" width="__W__" height="__H__" style="display:block;width:100%%;
  image-rendering:pixelated;image-rendering:crisp-edges"></canvas>
<script>
/* THE REAL RENDER PATH, per the mobile render contract section 7:
   render the world offscreen at 1x, integer-blit it up, smoothing OFF.
   Nothing here is a painting - every ground and structure cell is one of the
   __N__ tiles in the starter set, drawn by index out of a map. */
var D = __DATA__;
var CELL = D.cell, S = D.scale;
var off = document.createElement('canvas');
off.width = D.gw * CELL; off.height = D.gh * CELL;
var o = off.getContext('2d'); o.imageSmoothingEnabled = false;
var cv = document.getElementById('cv'), c = cv.getContext('2d');
c.imageSmoothingEnabled = false;
var imgs = {}, left = 0, total = D.tiles.length + D.sprites.length;
function done(){
  for (var y = 0; y < D.gh; y++) for (var x = 0; x < D.gw; x++) {
    var t = D.ground[y][x]; if (t !== null) o.drawImage(imgs['t'+t], x*CELL, y*CELL);
  }
  /* THE CAST SHADOWS, drawn at RUNTIME from data. A building's shadow cannot
     live in a ground tile - it would need a unique tile per building per hour.
     This is the single biggest thing the first reassembly was missing. */
  D.shadows.forEach(function(sh){
    var g = o.createLinearGradient(0, sh.y*CELL, 0, (sh.y+sh.h)*CELL);
    g.addColorStop(0, 'rgba(22,17,9,0.46)'); g.addColorStop(1, 'rgba(22,17,9,0)');
    o.fillStyle = g;
    o.beginPath();
    o.moveTo(sh.x*CELL, sh.y*CELL);
    o.lineTo((sh.x+sh.w)*CELL, sh.y*CELL);
    o.lineTo((sh.x+sh.w)*CELL + sh.h*CELL*0.8, (sh.y+sh.h)*CELL);
    o.lineTo(sh.x*CELL + sh.h*CELL*0.8, (sh.y+sh.h)*CELL);
    o.closePath(); o.fill();
  });
  for (var y2 = 0; y2 < D.gh; y2++) for (var x2 = 0; x2 < D.gw; x2++) {
    var s = D.struct[y2][x2]; if (s !== null) o.drawImage(imgs['t'+s], x2*CELL, y2*CELL);
  }
  D.sprites.forEach(function(sp, i){
    /* a sprite's contact shadow, drawn at RUNTIME - it cannot live in a tile */
    o.save(); o.globalAlpha = 0.32; o.fillStyle = '#18120a';
    o.beginPath();
    o.ellipse((sp.x + sp.w/2)*CELL, (sp.y + sp.h)*CELL - 3,
              sp.w*CELL*0.42, Math.max(3, sp.h*CELL*0.07), 0, 0, 7);
    o.fill(); o.restore();
    o.drawImage(imgs['s'+i], Math.round(sp.x*CELL), Math.round(sp.y*CELL),
                Math.round(sp.w*CELL), Math.round(sp.h*CELL));
  });
  /* INTEGER BLIT. Never a fractional scale for world art. */
  c.drawImage(off, 0, 0, off.width, off.height, 0, 0, off.width*S, off.height*S);
  document.title = 'REASSEMBLED';
}
function load(key, src){
  var im = new Image();
  im.onload = function(){ imgs[key] = im; if (--left === 0) done(); };
  im.src = 'data:image/png;base64,' + src;
}
left = total;
D.tiles.forEach(function(t, i){ load('t'+i, t.b64); });
D.sprites.forEach(function(s, i){ load('s'+i, s.b64); });
</script>"""


def main():
    M = factory()
    C = M.load_extra(M.Corpus())
    T = build_tiles(M, C)
    if len(T.tiles) > MAX_TILES:
        raise SystemExit('the "tileset" is %d tiles. Over %d it is a painting, not a set.'
                         % (len(T.tiles), MAX_TILES))
    ground, struct, shadows = build_map(T, M.GRID_W, M.GRID_H)
    sprs = sprites(M, C)

    bank = {
        'version': 'BOHEMIA_STARTER_TILESET_ACT1_v1',
        'built': '2026-07-26',
        'law': ('art-first reset amendment C (the ANTI-BIOSHOCK rule): the picked mockup '
                'is CUT into a real starter tileset and the identical frame is REASSEMBLED '
                'from those tiles on the real render path.'),
        'finding': ('the painted mockup cut into 262 unique tiles for 264 cells - it was '
                    'never a tiled world. This set is %d tiles for the same 264 cells.'
                    % len(T.tiles)),
        'cell_px': M.CELL, 'grid': [M.GRID_W, M.GRID_H],
        'tiles': [{'id': t['id'], 'what': t['what'], 'b64': b64(t['img'])} for t in T.tiles],
        'ground': [[T[c] for c in row] for row in ground],
        'struct': [[(T[c] if c else None) for c in row] for row in struct],
        'sprites': [{'id': s['id'], 'what': s['what'], 'x': s['x'], 'y': s['y'],
                     'w': s['w'], 'h': s['h'], 'b64': b64(s['img'])} for s in sprs],
        'shadows': shadows,
        'shadow_note': ('a building\'s cast shadow CANNOT live in a ground tile - it would '
                        'need a unique tile per building per time of day. The engine draws '
                        'it at runtime from these rects, which is why they ship as data.'),
    }
    with open(OUT_BANK, 'w') as f:
        json.dump(bank, f)

    data = {'cell': M.CELL, 'scale': M.SCALE, 'gw': M.GRID_W, 'gh': M.GRID_H,
            'ground': bank['ground'], 'struct': bank['struct'],
            'tiles': [{'b64': t['b64']} for t in bank['tiles']],
            'sprites': [{'x': s['x'], 'y': s['y'], 'w': s['w'], 'h': s['h'], 'b64': s['b64']}
                        for s in bank['sprites']],
            'shadows': shadows}
    html = (HTML.replace('__W__', str(M.GRID_W * M.CELL * M.SCALE))
                .replace('__H__', str(M.GRID_H * M.CELL * M.SCALE))
                .replace('__N__', str(len(T.tiles)))
                .replace('__DATA__', json.dumps(data)))
    open(OUT_HTML, 'w').write(html)

    # the contact sheet: every tile in the set, labelled, so the set itself is judgeable
    cols, sw = 6, M.CELL * 2
    rows = (len(T.tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * sw, rows * (sw + 15)), (16, 16, 13))
    d = ImageDraw.Draw(sheet)
    for i, t in enumerate(T.tiles):
        x, y = (i % cols) * sw, (i // cols) * (sw + 15)
        sheet.paste(t['img'].resize((sw - 2, sw - 2), Image.NEAREST).convert('RGB'), (x + 1, y + 1))
        d.text((x + 2, y + sw), t['id'][:22], fill=(228, 208, 158))
    sheet.save(os.path.join(OUTDIR, 'TILESET_CONTACT.png'))
    print('OK  %d tiles, %d sprites, %d cells -> %s' %
          (len(T.tiles), len(sprs), M.GRID_W * M.GRID_H, OUT_BANK))
    print('    the real render path: %s' % OUT_HTML)


if __name__ == '__main__':
    main()
