#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [freeway finished] 11/10/26: THE FOUR FREEWAY BOARDS IN FINISHED ART, THROUGH THE RIG.
VAMILY rule 443(g) and ask row 557 (the coordinator, rule 441: 'the four freeway boards play but still wear stand-in art:
finished art owed on the golden-piece recipe before they count as fully baked'); rule 432 (Paolo 11/7: 'why can't it be an
underpass or a large overpass towering over the rest of the city, you can't quite hop off it'); rule 408(b) (one golden
piece first, then its recipe makes the rest); rule 430 (the art since the Crashbox turn is at the bar: improve, reuse,
never throw away).

WHAT IT IS. FREEWAY's boards (slices/bohemia_freeway_boards.js, the layouts in freeway_boards.json) are untouched as rules
and layouts. Every picture its kit marked STAND-IN is remade here the way every fight block has been made since 10/19:
the ground as geometry and material (the floor tool's own grid, heights, stones and materials: the asphalt and the lane
paint of the map's own freeway block), the structure as meshes in real metres, the master rig's source pass, dents, one
sun and film, the not-final tool's grime across every edge, the rig's camera (orthographic, tilted 45, facing north) at
the fight's 42.92 px a metre. Nothing is drawn by hand and nothing is a filter on the screen.

THE GOLDEN PIECE (rule 408(b)): THE SOUTH EDGE OF THE DECK -- the lane, the parapet, the girder's face, the bent and its
columns going down to the ground 8.5 m below. One render, judged beside the map's own freeway block and the bar; its
recipe (the materials, the wear, the light, the height of 8.48 m = one tile on the glass) makes every other picture.

THE SCENES (each one render of a 60 m block, 2575 x 1820):
  deck     the deck from above: five rows (the north edge, lanes, the median, lanes, the south edge), a wall at each end
  ramp     the one-tile-wide ramp and flyover lanes (walled both sides), the lanes running north-south, the slopes
  face     the viaduct in section: the deck 8.48 m up, the girders, three bents, the ground under it, the street going
           under, both broken ends with their rebar
  under    the ground under the deck in its real shadow (the underpass): dirt, the sidewalk, the street, the lips of light
  props    the bent of the underpass (a column and its hammerhead), the semi's cab, the freeway lamp, as sprites
THE CUT: tiles of 515 x 364 composed from the renders (a wall is a strip of the render laid on a lane of the render), the
city below from the fight's own suburb blocks seen from the deck (dimmer, drained, out of focus: baked, never a filter),
written to slices/fight_ground/freeway/ with freeway.json (every picture's stage 'finished').

  <venv>/bin/python tools/bohemia_cook5_the_freeway_finished_11_10_26.py render <scene> [--quick]   (about 4 min a scene)
  python3 tools/bohemia_cook5_the_freeway_finished_11_10_26.py cut                                 (no bpy: the tiles, the json)
  python3 tools/bohemia_cook5_the_freeway_finished_11_10_26.py sheet                               (the compare sheet)
  (venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy)

ANALOG HORROR (rule 20), at the source: on the south edge one pair of skid marks runs straight into the parapet and the
parapet is whole; under the deck one column carries a hand-high row of tally marks that never ends; in the city below a
handful of windows are lit and nothing moves.

REFERENCE CHECK (the 9/4 standing duty): the map's own freeway block (slices/fight_ground/block_freeway_0.webp) is the
twin for the lanes: same asphalt, same paint, same camera, same light, same ruler; real Las Vegas: I-15 and the 95 on
their viaducts (cast-in-place box girders on hammerhead and two-column bents, a 32-inch concrete parapet flush with the
deck edge, 12 ft lanes, 10 ft dashes on a 40 ft cycle which is one 12 m tile, a yellow line and a concrete barrier at
the median, the Spaghetti Bowl's flyovers); DIRECTION's bar (records/target/direction_bar/THE_BAR.json: the ground's
floor bar is his one real street). the valley from the air (DIST-03, CGRD-03). Lonesome Road is the freeway fight's named reference (rule 432): the broken elevated
highway as a battlefield, nothing of its content. No reference game added.
REUSE CHECK (REUSE-FIRST): the floor tool's plan grid, heights, materials, stones, camera and scene (imported, never
edited); the master rig's source pass, dent pass, light and film; the not-final tool's grime, materials and instances;
COMBAT TWO's street kit and street board for the ground under the deck; the fight's own suburb blocks for the city
below; COOK's gantry and the fight's cover pieces stay as they are.
TASTE CHECK: his 'placeholder shit' (11/4) and 'half baked' (11/10) are the stand-ins this replaces; the rig is the look
(rule 115); 'towering over the rest of the city' is the height: one whole tile of drop under every south edge.
"""
import os, sys, json, math, time
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
FG = os.path.join(R, 'slices', 'fight_ground')
SHIP = os.path.join(FG, 'freeway')
OUT = os.path.join(R, 'records', 'target', 'cook5_freeway')
REND = os.path.join(OUT, 'render')
W, H = 2575, 1820
TW, TH = 515, 364
PPM = 515 / 12.0
SIDE = 60.0
TM = 12.0
DECK_Z = TH / PPM                      # 8.482 m: the deck's surface over the ground, one whole tile on the glass
PARAPET_H = 0.86                       # a 34-inch bridge parapet
PAR_SHIFT = PARAPET_H * PPM / (TH / TM)  # how far (in ground metres) a parapet's top rides up the glass: 1.22

# ======================================================================================================================
# THE PLAN SIDE (numpy only): which ground every pixel is, and the stains painted in metres
# ======================================================================================================================
def grids():
    yy, xx = np.mgrid[0:H, 0:W]
    xm = (xx + 0.5) / PPM; ym = SIDE * (1 - (yy + 0.5) / H)
    return xm, ym


def vnoise(shape, cell_px, rng):
    """value noise: a coarse random field, smooth (the floor tool's own, re-declared so the plan runs without bpy)"""
    gh, gw = int(shape[0] / cell_px) + 3, int(shape[1] / cell_px) + 3
    g = rng.rand(gh, gw).astype(np.float32)
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((int(gw * cell_px), int(gh * cell_px)), Image.BICUBIC)
    a = np.asarray(im, np.float32)[:shape[0], :shape[1]] / 255.0
    return a


def band(v, a, b):
    return (v >= a) & (v < b)


def soft(v, c, half, edge):
    """1 inside |v-c| < half, falling to 0 over 'edge' metres"""
    return np.clip((half + edge - np.abs(v - c)) / max(edge, 1e-6), 0, 1)


def torn_x(ty, base, rng, amp=1.5):
    """a broken end: an x for every row of the deck's width (ty in metres): a ragged line between points 1.5 to 3.5 m apart
    (where a girder let go), never a stair"""
    lo, hi = float(ty.min()) - 4.0, float(ty.max()) + 4.0
    ks = [lo]
    while ks[-1] < hi: ks.append(ks[-1] + rng.uniform(1.5, 3.5))
    vs = base + rng.uniform(-amp, amp, len(ks))
    return (np.interp(ty, ks, vs) + rng.uniform(-0.18, 0.18, len(ty))).astype(np.float32)


def plan_rows(ID, kinds, seed=5, end_walls=True, marks=True):
    """the deck from above, a row of tiles a kind (north to south): 'n' the north edge, 'p' lanes, 'm' the median, 's' the
    south edge, '.' nothing. Lanes run east-west. Every number in metres. Returns the grounds and the two stain fields."""
    xm, ym = grids(); rng = np.random.RandomState(seed)
    ty = SIDE - ym; row = np.clip((ty // TM).astype(int), 0, 4); ly = ty - row * TM; lx = xm % TM; col = np.clip((xm // TM).astype(int), 0, 4)
    kind = np.array(list(kinds))[row]
    gid = np.full((H, W), ID['asphalt'], np.uint8)
    dash = band(lx, 4.5, 7.5)
    line = lambda c, w=0.3: np.abs(ly - c) < w / 2
    n, m, s, p = kind == 'n', kind == 'm', kind == 's', kind == 'p'
    # the lane lines: a 3 m dash on the 12 m cycle (10 ft on 40 ft: one tile), at 2, 6 and 10 m of every tile
    gid[(p | s | m) & line(2.0) & dash] = ID['paint']
    gid[(p | s | n) & line(6.0) & dash] = ID['paint']
    gid[(p | n) & line(10.0) & dash] = ID['paint']
    gid[n & (ly < 2.3)] = ID['gutter']; gid[n & line(2.75)] = ID['paint']                 # the north shoulder and its fog line
    gid[s & (ly > 9.75)] = ID['gutter']; gid[s & line(9.25)] = ID['paint']                # the south shoulder and its fog line
    gid[m & band(ly, 6.45, 8.25)] = ID['gutter']                                          # the median's base
    gid[m & (line(5.55) | line(9.7))] = ID['paint_y']                                     # the yellow lines either side
    if end_walls:                                                                         # a wall across each end: a strip of shoulder under it
        gid[(col == 0) & (lx < 1.3)] = ID['gutter']; gid[(col == 4) & (lx > 10.7)] = ID['gutter']
    # the joints: a thin sealed joint across the deck every 12 m (it lands on the tile seam, so no seam ever cuts a stain)
    gid[(lx < 0.03) | (lx > TM - 0.03)] = ID['seal']
    # the drains: a scupper grate in the shoulder of every edge tile
    gid[(n & band(ly, 1.8, 2.15) | s & band(ly, 9.85, 10.2)) & band(lx, 9.0, 9.7)] = ID['seal']
    dark = np.zeros((H, W), np.float32); pale = np.zeros((H, W), np.float32)
    n1 = vnoise((H, W), 2.2 * PPM, rng); n2 = vnoise((H, W), 0.5 * PPM, rng)
    # the oil line down the middle of every lane (lane centres at 0, 4, 8 m), broken along its length; rubber in the wheel paths
    cen = np.minimum(ly % 4.0, 4.0 - (ly % 4.0))
    dark += np.clip(1 - cen / 0.62, 0, 1) ** 1.5 * (0.25 + 0.75 * n1) * 0.55
    dark += np.clip(1 - np.abs(cen - 0.95) / 0.38, 0, 1) * (0.3 + 0.7 * n2) * 0.16
    dark += np.clip(1 - lx / 0.9, 0, 1) * (n2 > 0.45) * 0.3                               # water and rust weeping out of every joint
    if marks:
        # where a car burned and was dragged off (row 3, column 2)
        d = np.sqrt((xm - 30.5) ** 2 + (ty - 42.5) ** 2) / 2.6
        dark += np.clip(1.25 - d, 0, 1) * 0.9 * (0.55 + 0.45 * n2)
        # rule 20: two tyre lines run straight into the south wall, and the wall is whole (row 4, column 2)
        for off in (0.0, 1.75):
            t = np.clip((xm - 25.0) / 9.0, 0, 1)
            yline = 53.2 + off * 0.55 + (t ** 1.7) * 6.2
            on = (np.abs(ty - yline) < 0.11) & (xm > 25.0) & (xm < 34.0 - off * 0.2)
            gid[on & np.isin(gid, [ID['asphalt'], ID['gutter'], ID['paint']])] = ID['seal']
    pale += np.clip(1 - np.abs(ly - 2.0) / 0.5, 0, 1) * n * (n1 > 0.5) * 0.5              # sand against the walls
    pale += np.clip(1 - np.abs(ly - 10.0) / 0.45, 0, 1) * s * (n1 > 0.55) * 0.5
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


def plan_deck(ID, seed=5):
    return plan_rows(ID, 'npmps', seed)


def plan_ns(ID, seed=9):
    """the ramp's lanes running north-south, a column of tiles a kind: 'b' a wall both sides, 'w' the west wall only, 'e'
    the east wall only"""
    kinds = 'bbweb'
    xm, ym = grids(); rng = np.random.RandomState(seed)
    ty = SIDE - ym; ly = ty % TM; col = np.clip((xm // TM).astype(int), 0, 4); lx = xm - col * TM
    kind = np.array(list(kinds))[col]
    ww, ew = (kind == 'b') | (kind == 'w'), (kind == 'b') | (kind == 'e')
    gid = np.full((H, W), ID['asphalt'], np.uint8)
    dash = band(ly, 4.5, 7.5)
    line = lambda c, w=0.3 * (TH / TM) / PPM * (PPM / (TH / TM)): np.abs(lx - c) < 0.3 / 2
    gid[line(6.0) & dash] = ID['paint']
    gid[~ww & line(2.0) & dash] = ID['paint']; gid[~ew & line(10.0) & dash] = ID['paint']
    gid[ww & (lx < 1.5)] = ID['gutter']; gid[ww & line(2.0)] = ID['paint']
    gid[ew & (lx > 10.5)] = ID['gutter']; gid[ew & line(10.0)] = ID['paint']
    gid[(ly < 0.035) | (ly > TM - 0.035)] = ID['seal']
    dark = np.zeros((H, W), np.float32); pale = np.zeros((H, W), np.float32)
    n1 = vnoise((H, W), 2.2 * PPM, rng); n2 = vnoise((H, W), 0.5 * PPM, rng)
    cen = np.minimum(lx % 4.0, 4.0 - (lx % 4.0))
    dark += np.clip(1 - cen / 0.62, 0, 1) ** 1.5 * (0.25 + 0.75 * n1) * 0.55 * (lx > 2.5) * (lx < 9.5)
    dark += np.clip(1 - np.abs(cen - 0.95) / 0.38, 0, 1) * (0.3 + 0.7 * n2) * 0.16
    dark += np.clip(1 - ly / 0.9, 0, 1) * (n2 > 0.45) * 0.3
    pale += np.clip(1 - np.abs(lx - 1.3) / 0.45, 0, 1) * ww * (n1 > 0.5) * 0.5
    pale += np.clip(1 - np.abs(lx - 10.7) / 0.45, 0, 1) * ew * (n1 > 0.55) * 0.5
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1), kinds


# the face scene: the deck lies on plan rows 1 to 3 (y 12 to 48 m) and is lifted one tile, so it fills rows 0 to 2 of the
# picture and its south face fills row 3; it is broken off at both ends
FACE_Y0, FACE_Y1 = 12.0, 48.0
FACE_BENTS = {18.0: 'round', 42.0: 'square'}


def face_ends(seed=23):
    """the two broken ends: for each 0.6 m strip of the deck's width, where the deck stops (west, east)"""
    rng = np.random.RandomState(seed)
    ys = np.arange(FACE_Y0 + 0.3, FACE_Y1, 0.6)
    return ys, torn_x(ys, 6.6, rng, 1.7), torn_x(ys, 53.4, rng, 1.7)


def plan_face(ID, seed=7):
    gid, dark, pale = plan_rows(ID, '.nps.', seed, end_walls=False, marks=False)
    xm, ym = grids(); rng = np.random.RandomState(seed + 1)
    ys, xa, xb = face_ends()
    k = np.clip(((ym - FACE_Y0) / 0.6).astype(int), 0, len(ys) - 1)
    teeth = (vnoise((H, W), 0.35 * PPM, rng) - 0.5) * 0.7
    a, b = xa[k] + teeth, xb[k] + teeth
    deck = (ym >= FACE_Y0) & (ym < FACE_Y1) & (xm > a) & (xm < b)
    near = np.minimum(xm - a, b - xm)
    dark += np.clip(1 - near / 1.6, 0, 1) * 0.5 * deck                                    # the deck goes dark and cracked toward the break
    gid[~deck] = ID['seal']
    return gid, np.clip(dark, 0, 1), pale * deck, deck


# ======================================================================================================================
# THE RIG SIDE (only under Blender's python)
# ======================================================================================================================
def rig():
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F
    # two grounds the floor tool does not carry: the median's yellow and the black of a sealed joint and of laid rubber
    if 'paint_y' not in F.MATS:
        F.MATS['asphalt'] = {k: v for k, v in F.MATS['asphalt'].items() if k != 'patches'}   # a bridge deck is one pour: no polygon repairs
        F.MATS['paint_y'] = dict(role=('clay_mustard', 2), target=(150, 118, 52), h=0.0, alt=('clay_mustard', 1), alt_amt=0.25, grit=0.10, speck=(45, 0.14),
                                 wornthrough=dict(scale=3.0, cut=0.44, to=('rubber', 2)))
        F.MATS['seal'] = dict(role=('rubber', 1), target=(38, 36, 35), h=0.0, alt=('rubber', 0), alt_amt=0.3, grit=0.12, speck=(45, 0.2))
        for n_ in ('paint_y', 'seal'):
            F.IDS.append(n_); F.ID[n_] = len(F.IDS) - 1
        cal0 = F.cal_mul
        F.cal_mul = lambda: dict(cal0(), paint_y=0.55, seal=0.8)
        F.ROAD_WEAR = dict(F.ROAD_WEAR, seal=0.2)
        gm0 = F.ground_material

        def ground_material(bpy, name):
            """the floor tool's material, plus the two stain fields of this tool painted in metres on the ground's own
            mesh (the 'dark' and 'pale' attributes): oil, rubber, rust, soot; sand and dust"""
            m = gm0(bpy, name); nt = m.node_tree; b = nt.nodes['Principled BSDF']; base = b.inputs['Base Color']
            src = base.links[0].from_socket
            a1 = nt.nodes.new('ShaderNodeAttribute'); a1.attribute_name = 'dark'
            a2 = nt.nodes.new('ShaderNodeAttribute'); a2.attribute_name = 'pale'
            d = nt.nodes.new('ShaderNodeMixRGB'); d.blend_type = 'MULTIPLY'; d.inputs['Color2'].default_value = (0.2, 0.17, 0.15, 1)
            nt.links.new(a1.outputs['Fac'], d.inputs['Fac']); nt.links.new(src, d.inputs['Color1'])
            p = nt.nodes.new('ShaderNodeMixRGB'); p.blend_type = 'MIX'
            p.inputs['Color2'].default_value = tuple(c * F.cal_mul().get('caliche', 1.0) for c in F.role_lin('clay_bone', 2)) + (1,)
            nt.links.new(a2.outputs['Fac'], p.inputs['Fac']); nt.links.new(d.outputs['Color'], p.inputs['Color1'])
            for l in list(base.links): nt.links.remove(l)
            nt.links.new(p.outputs['Color'], base)
            return m
        F.ground_material = ground_material
    return NF, F, F.RIG


def mesh(bpy, name, verts, faces, mat):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(map(float, v)) for v in verts], [], [tuple(f) for f in faces]); me.update(calc_edges=True)
    me.materials.append(mat)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o


class Parts:
    """many convex pieces in one mesh per material (prisms along x or y, boxes, drums)"""
    def __init__(s): s.b = {}
    def _add(s, mat, verts, faces):
        v, f = s.b.setdefault(mat, ([], []))
        k = len(v); v.extend(verts); f.extend([tuple(i + k for i in fc) for fc in faces])
    def prism_x(s, mat, x0, x1, prof):
        """prof: (y, z) points, counter-clockwise seen from +x"""
        n = len(prof)
        verts = [(x0, y, z) for y, z in prof] + [(x1, y, z) for y, z in prof]
        faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        s._add(mat, verts, faces)
    def prism_y(s, mat, y0, y1, prof):
        """prof: (x, z) points, counter-clockwise seen from -y (from the south)"""
        n = len(prof)
        verts = [(x, y0, z) for x, z in prof] + [(x, y1, z) for x, z in prof]
        faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        s._add(mat, verts, faces)
    def box(s, mat, x0, x1, y0, y1, z0, z1):
        s.prism_x(mat, x0, x1, [(y0, z0), (y1, z0), (y1, z1), (y0, z1)])
    def drum(s, mat, cx, cy, z0, z1, r, n=20, r1=None):
        r1 = r if r1 is None else r1
        verts = [(cx + r * math.cos(6.2832 * i / n), cy + r * math.sin(6.2832 * i / n), z0) for i in range(n)] + \
                [(cx + r1 * math.cos(6.2832 * i / n), cy + r1 * math.sin(6.2832 * i / n), z1) for i in range(n)]
        faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        s._add(mat, verts, faces)
    def bar(s, mat, p0, p1, r=0.02):
        """a square bar between two points (a rebar, a pipe)"""
        p0, p1 = np.array(p0, float), np.array(p1, float); d = p1 - p0; L = np.linalg.norm(d)
        if L < 1e-6: return
        d /= L; u = np.cross(d, [0, 0, 1.0]); u = np.array([1.0, 0, 0]) if np.linalg.norm(u) < 1e-6 else u / np.linalg.norm(u); v = np.cross(d, u)
        ring = [u * r + v * r, -u * r + v * r, -u * r - v * r, u * r - v * r]
        verts = [tuple(p0 + q) for q in ring] + [tuple(p1 + q) for q in ring]
        faces = [(i, (i + 1) % 4, (i + 1) % 4 + 4, i + 4) for i in range(4)] + [(3, 2, 1, 0), (4, 5, 6, 7)]
        s._add(mat, verts, faces)
    def wheel(s, mat, cx, cy, cz, r, w, n=18):
        """a drum lying on its side, its axle along y"""
        verts = [(cx + r * math.cos(6.2832 * i / n), cy - w / 2, cz + r * math.sin(6.2832 * i / n)) for i in range(n)] + \
                [(cx + r * math.cos(6.2832 * i / n), cy + w / 2, cz + r * math.sin(6.2832 * i / n)) for i in range(n)]
        faces = [(i, i + n, (i + 1) % n + n, (i + 1) % n) for i in range(n)] + [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))]
        s._add(mat, verts, faces)
    def tube_x(s, mat, x0, x1, cy, cz, r, n=14):
        """a drum lying along x (a fuel tank, an air cleaner)"""
        verts = [(x0, cy + r * math.cos(6.2832 * i / n), cz + r * math.sin(6.2832 * i / n)) for i in range(n)] + \
                [(x1, cy + r * math.cos(6.2832 * i / n), cz + r * math.sin(6.2832 * i / n)) for i in range(n)]
        faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        s._add(mat, verts, faces)
    def poly(s, mat, pts, z0, z1):
        """a flat slab of any outline (pts counter-clockwise from above) between two heights"""
        n = len(pts)
        verts = [(x, y, z0) for x, y in pts] + [(x, y, z1) for x, y in pts]
        faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        s._add(mat, verts, faces)
    def build(s, bpy, name, mats):
        out = []
        for mat, (v, f) in s.b.items():
            if v: out.append(mesh(bpy, '%s_%s' % (name, mat), v, f, mats[mat]))
        return out


def parapet_x(P, mat, x0, x1, y_out, inward, z=0.0, rng=None, seg=3.0):
    """a bridge parapet along x: the outer face plumb at y_out, the traffic face sloped, toward 'inward' (+1 north, -1
    south); cast in 3 m lengths with a joint between"""
    x = x0
    while x < x1 - 1e-6:
        e = min(x + seg, x1); j = 0.012; d = inward
        dz = (rng.uniform(-0.006, 0.006) if rng is not None else 0.0)
        prof = [(y_out, z), (y_out + d * 0.45, z), (y_out + d * 0.45, z + 0.08), (y_out + d * 0.27, z + 0.33), (y_out + d * 0.2, z + PARAPET_H + dz), (y_out, z + PARAPET_H + dz)]
        if d > 0: prof = prof[::-1]
        P.prism_x(mat, x + j, e - j, prof if d < 0 else prof)
        x = e


def parapet_y(P, mat, y0, y1, x_out, inward, z=0.0, rng=None, seg=3.0):
    y = y0
    while y < y1 - 1e-6:
        e = min(y + seg, y1); j = 0.012; d = inward
        dz = (rng.uniform(-0.006, 0.006) if rng is not None else 0.0)
        prof = [(x_out, z), (x_out + d * 0.45, z), (x_out + d * 0.45, z + 0.08), (x_out + d * 0.27, z + 0.33), (x_out + d * 0.2, z + PARAPET_H + dz), (x_out, z + PARAPET_H + dz)]
        if d < 0: prof = prof[::-1]
        P.prism_y(mat, y + j, e - j, prof)
        y = e


def things_mats(bpy, NF):
    return dict(conc=NF.material(bpy, 'fw_concrete', 'tape_grey', 2, 0.92), conc_d=NF.material(bpy, 'fw_concrete_dark', 'tape_grey', 1, 1.0),
                rust=NF.material(bpy, 'fw_rebar', 'clay_rust', 1, 0.9), rubber=NF.material(bpy, 'fw_rubber', 'rubber', 1, 1.0),
                card=NF.material(bpy, 'fw_card', 'tape_masking', 2, 0.8), paper=NF.material(bpy, 'fw_paper', 'tape_grey', 3, 0.9),
                steel=NF.material(bpy, 'fw_steel', 'metal_painted', 2, 0.9), chrome=NF.material(bpy, 'fw_chrome', 'tape_grey', 3, 1.0))


def debris(bpy, NF, M, rng, where, n):
    """what a freeway keeps: tyre shreds, cardboard, paper, a hubcap; all flat, none in a man's way"""
    box = (NF.CUBE_V, NF.CUBE_F); tyre, card, paper = [], [], []
    for i in range(n):
        x, y = where(rng); k = rng.rand()
        if k < 0.45: tyre.append((x, y, 0.0, rng.uniform(0.35, 1.1), rng.uniform(0.1, 0.22), 0.035, rng.uniform(0, 6.3), 0.0))
        elif k < 0.75: card.append((x, y, 0.0, rng.uniform(0.3, 0.7), rng.uniform(0.25, 0.5), 0.015, rng.uniform(0, 6.3), 0.0))
        else: paper.append((x, y, 0.0, rng.uniform(0.15, 0.3), rng.uniform(0.15, 0.25), 0.008, rng.uniform(0, 6.3), 0.0))
    out = [NF.instances(bpy, 'junk_tyre', box, tyre, M['rubber'], 0.5, rng), NF.instances(bpy, 'junk_card', box, card, M['card'], 0.2, rng),
           NF.instances(bpy, 'junk_paper', box, paper, M['paper'], 0.2, rng)]
    return [o for o in out if o is not None]


def set_attr(F, ground, name, a):
    g = F.to_grid(a, nearest=True)
    at = ground.data.attributes.new(name, 'FLOAT', 'POINT'); at.data.foreach_set('value', g.ravel().astype(np.float32))
    pot = ground.data.attributes.get('pot')                     # a deck's pothole shows no pale gravel bed: there is none under it
    if pot is not None: pot.data.foreach_set('value', np.zeros(len(pot.data), np.float32))


def finish(bpy, NF, F, RIG, ground_objs, things, seed, fires=()):
    """the rig's passes: the ground at the ground's dose, the structure at the guide's, the grime across every edge, the
    vertical stretch under the 45 camera"""
    F.scene(bpy, ground_objs)
    if things:
        RIG.source_pass(things, float(RIG.G['wear']), 1.0, seed); RIG.dent_pass(things, 1.0)
        zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
        for o in things: o.scale = (1, 1, zs)
    NF.grime_pass(bpy, list(fires), seed)
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1


def shoot(bpy, F, RIG, name, quick, samples=32, transparent=False):
    sc = bpy.context.scene
    RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = transparent
    F.camera(bpy, sc, quick)
    sc.cycles.samples = 12 if quick else samples
    sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    os.makedirs(REND, exist_ok=True)
    fn = os.path.join(REND, name + ('_quick' if quick else '') + '.png')
    sc.render.filepath = fn; t0 = time.time(); bpy.ops.render.render(write_still=True)
    print('  rendered', name, round(time.time() - t0), 's', fn, flush=True)
    return fn


def scene_deck(quick=False):
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    gid, dark, pale = plan_deck(F.ID)
    objs, g = NF._build(bpy, gid, 4431, quick)
    set_attr(F, objs[0], 'dark', dark); set_attr(F, objs[0], 'pale', pale)
    M = things_mats(bpy, NF); P = Parts(); rng = np.random.RandomState(77)
    # the north parapet stands 1.22 m inside its tile so its top never leaves the tile on the glass; the south one is flush
    parapet_x(P, 'conc', -1.0, 61.0, SIDE - PAR_SHIFT, -1, rng=rng)
    parapet_x(P, 'conc', -1.0, 61.0, 0.0, +1, rng=rng)
    parapet_y(P, 'conc', 0.0, SIDE - PAR_SHIFT, 0.0, +1, rng=rng)
    parapet_y(P, 'conc', 0.0, SIDE - PAR_SHIFT, SIDE, -1, rng=rng)
    things = P.build(bpy, 'fw', M)
    def where(r):
        return r.uniform(2, 58), r.choice([r.uniform(0.6, 1.6), r.uniform(57.4, 58.2), r.uniform(4, 56)], p=[0.3, 0.3, 0.4])
    things += debris(bpy, NF, M, rng, where, 26)
    finish(bpy, NF, F, RIG, objs, things, 11)
    return shoot(bpy, F, RIG, 'deck', quick)


def catcher(bpy, z=0.0):
    """the ground the structure's shadow falls on, kept as shadow only (the cut lays it on the real ground's pixels)"""
    o = mesh(bpy, 'catcher', [(-40, -40, z), (100, -40, z), (100, 100, z), (-40, 100, z)], [(0, 1, 2, 3)], bpy.data.materials.new('catcher'))
    o.is_shadow_catcher = True
    return o


def scene_ns(quick=False):
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    gid, dark, pale, kinds = plan_ns(F.ID)
    objs, g = NF._build(bpy, gid, 4477, quick)
    set_attr(F, objs[0], 'dark', dark); set_attr(F, objs[0], 'pale', pale)
    M = things_mats(bpy, NF); P = Parts(); rng = np.random.RandomState(78)
    for c, k in enumerate(kinds):
        if k in 'bw': parapet_y(P, 'conc', -1.0, 61.0, c * TM, +1, rng=rng)
        if k in 'be': parapet_y(P, 'conc', -1.0, 61.0, (c + 1) * TM, -1, rng=rng)
    things = P.build(bpy, 'fw', M)
    things += debris(bpy, NF, M, rng, lambda r: (r.uniform(2, 58), r.uniform(2, 58)), 14)
    finish(bpy, NF, F, RIG, objs, things, 12)
    return shoot(bpy, F, RIG, 'ns', quick)


def scene_face(quick=False):
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    gid, dark, pale, deck = plan_face(F.ID)
    objs, g = NF._build(bpy, gid, 4499, quick)
    ground = objs[0]
    set_attr(F, ground, 'dark', dark); set_attr(F, ground, 'pale', pale)
    M = things_mats(bpy, NF); P = Parts(); rng = np.random.RandomState(79)
    ys, xa, xb = face_ends()
    Z = DECK_Z; soff = Z - 2.1
    # the deck's own body under the road: the top slab in 0.6 m strips, each broken off where the road is
    for y, a, b in zip(ys, xa, xb):
        P.box('conc', a + rng.uniform(-0.1, 0.3), b + rng.uniform(-0.3, 0.1), y - 0.3, y + 0.3, Z - 0.4, Z - 0.14)   # under the deepest pothole: the road's own black shows in it, never the slab
    # the fascia over the south face and the box girder's webs and soffit, each let go at its own place
    def ends(y, more=0.0):
        k = int(np.clip((y - FACE_Y0) / 0.6, 0, len(ys) - 1))
        return xa[k] + rng.uniform(0.2, 1.8) + more, xb[k] - rng.uniform(0.2, 1.8) - more
    for (y0, y1) in ((12.5, 12.9), (19.3, 19.7), (26.3, 26.7), (33.3, 33.7), (40.3, 40.7), (47.1, 47.5)):
        a, b = ends((y0 + y1) / 2); P.box('conc', a, b, y0, y1, soff, Z - 0.4)
    for y in np.arange(12.5, 47.5, 1.4):
        a, b = ends(y + 0.7, 1.1); P.box('conc_d', a, b, y, min(y + 1.4, 47.5), soff, soff + 0.2)
    # the parapets, broken off short of the end
    ka, kb = 0, len(ys) - 1
    parapet_x(P, 'conc', xa[ka] + 1.9, xb[ka] - 2.3, FACE_Y0, +1, z=Z, rng=rng)
    parapet_x(P, 'conc', xa[kb] + 2.6, xb[kb] - 1.4, FACE_Y1 - PAR_SHIFT, -1, z=Z, rng=rng)
    # the bents: a cap across the deck's width under the girders, tapered at its ends, on its columns
    for bx, how in FACE_BENTS.items():
        top = soff; hw = 0.95
        P.prism_x('conc', bx - hw, bx + hw, [(12.6, top), (12.6, top - 0.75), (14.8, top - 1.5), (45.2, top - 1.5), (47.4, top - 0.75), (47.4, top)][::-1])
        for cy in (16.5, 30.0, 43.5):
            if how == 'round':
                P.drum('conc', bx, cy, 0.0, top - 1.5, 0.85, 22); P.drum('conc', bx, cy, 0.0, 0.3, 1.25, 22, 1.1)
            else:
                P.box('conc', bx - 0.75, bx + 0.75, cy - 0.75, cy + 0.75, 0.0, top - 1.5); P.box('conc', bx - 1.1, bx + 1.1, cy - 1.1, cy + 1.1, 0.0, 0.3)
        if how == 'square':                                   # the deck's drain down the first column, and where it empties
            P.bar('steel', (bx + 0.55, 12.2, Z - 0.3), (bx + 0.55, 15.7, top - 1.6), 0.08); P.bar('steel', (bx + 0.55, 15.7, top - 1.6), (bx + 0.55, 15.7, 0.25), 0.08)
    # the rebar out of every broken strip: two mats, each bar drooping under its own weight
    for y, a, b in zip(ys, xa, xb):
        for (x0, sgn) in ((a, -1), (b, +1)):
            for zz in (Z - 0.1, Z - 0.33):
                if rng.rand() < 0.55: continue
                L = rng.uniform(0.5, 2.3); yy = y + rng.uniform(-0.25, 0.25)
                p0 = (x0 + sgn * -0.3, yy, zz); p1 = (x0 + sgn * L * 0.5, yy + rng.uniform(-0.1, 0.1), zz - L * rng.uniform(0.05, 0.25))
                p2 = (x0 + sgn * L, yy + rng.uniform(-0.25, 0.25), zz - L * rng.uniform(0.35, 1.0))
                P.bar('rust', p0, p1, 0.022); P.bar('rust', p1, p2, 0.022)
    things = P.build(bpy, 'fw', M)
    # the lumps still hanging on the bars
    box = (NF.CUBE_V, NF.CUBE_F); lumps = []
    for y, a, b in zip(ys[::3], xa[::3], xb[::3]):
        for (x0, sgn) in ((a, -1), (b, +1)):
            if rng.rand() < 0.5: continue
            sz = rng.uniform(0.25, 0.7)
            lumps.append((x0 + sgn * rng.uniform(0.4, 1.4), y, Z - rng.uniform(0.9, 2.2), sz, sz * rng.uniform(0.6, 1.2), sz * rng.uniform(0.4, 0.8), rng.uniform(0, 6.3), rng.uniform(-0.6, 0.6)))
    lo = NF.instances(bpy, 'fw_lumps', box, lumps, M['conc'], 0.35, rng)
    if lo: things.append(lo)
    def where(r):
        return r.uniform(12, 48), r.uniform(14, 46)
    junk = debris(bpy, NF, M, rng, where, 10)
    finish(bpy, NF, F, RIG, objs, things + junk, 13)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in objs + junk: o.location = (0, 0, Z * zs)                 # the road and what lies on it, lifted onto the deck
    # everything of the road's grid that is not deck is a hole
    hole = bpy.data.materials.new('hole'); hole.use_nodes = True; nt = hole.node_tree
    for n_ in list(nt.nodes): nt.nodes.remove(n_)
    tb = nt.nodes.new('ShaderNodeBsdfTransparent'); mo = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(tb.outputs[0], mo.inputs['Surface'])
    ground.data.materials.append(hole); hi = len(ground.data.materials) - 1
    keep = F.to_grid(deck.astype(np.uint8))[1:, 1:].ravel().astype(bool)
    mi = np.zeros(len(ground.data.polygons), np.int32); ground.data.polygons.foreach_get('material_index', mi)
    mi[~keep] = hi; ground.data.polygons.foreach_set('material_index', mi); ground.data.update()
    for o in objs[1:]:                                          # no stone floats where the deck is gone
        pass
    catcher(bpy)
    return shoot(bpy, F, RIG, 'face', quick, samples=48, transparent=True)


def scene_props(quick=False):
    """the underpass's bent (a column and its hammerhead) and the semi's cab, each alone on a shadow-catching ground"""
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    M = things_mats(bpy, NF)
    M['cab'] = NF.material(bpy, 'fw_cab_paint', 'clay_bone', 3, 0.92); M['glass'] = NF.material(bpy, 'fw_glass', 'glass_eye', 0, 1.0)
    M['tank'] = NF.material(bpy, 'fw_tank', 'tape_grey', 2, 0.85); M['dark'] = NF.material(bpy, 'fw_dark', 'rubber', 0, 1.0); M['sodium'] = NF.material(bpy, 'fw_marker', 'sodium', 2, 0.9)
    rng = np.random.RandomState(80); things = []
    # THE BENT, for the underpass (the deck itself is cut away there): a round column 5 m to its hammerhead, 6.4 m to the girders
    P = Parts(); bx, by = 12.0, 30.0; top = DECK_Z - 2.1
    P.drum('conc', bx, by, 0.0, top - 1.35, 0.8, 24); P.drum('conc', bx, by, 0.0, 0.3, 1.2, 24, 1.05)
    P.prism_y('conc', by - 0.9, by + 0.9, [(bx - 2.3, top), (bx - 2.3, top - 0.6), (bx - 0.9, top - 1.4), (bx + 0.9, top - 1.4), (bx + 2.3, top - 0.6), (bx + 2.3, top)][::-1])
    for i in range(23):                                         # rule 20: a row of tally marks at hand height, round and round
        ang = math.radians(200 + i * 7.0); r = 0.81
        P.bar('dark', (bx + r * math.cos(ang), by + r * math.sin(ang), 1.25), (bx + r * math.cos(ang), by + r * math.sin(ang), 1.55), 0.012)
    things += P.build(bpy, 'bent', M)
    # THE SEMI'S CAB: a conventional day-cab tractor (the long-nose kind that ran I-15), jackknifed off its trailer; its
    # front tyres flat so it sits nose-down, the driver's door hanging open, the windscreen gone dark
    P = Parts()
    for sy in (-0.42, 0.42): P.box('steel', -3.3, 3.0, sy - 0.07, sy + 0.07, 0.72, 0.95)                       # the frame rails
    for sy in (-1.08, 1.08):                                                                                 # the steer tyres, flat
        P.wheel('rubber', 2.25, sy, 0.40, 0.46, 0.32); P.wheel('chrome', 2.25, sy + (0.17 if sy > 0 else -0.17), 0.40, 0.22, 0.03)
    for wx in (-1.55, -2.85):                                                                                # the tandem's duals
        for wy in (-0.95, 0.95): P.wheel('rubber', wx, wy, 0.52, 0.52, 0.62); P.wheel('dark', wx, wy + (0.32 if wy > 0 else -0.32), 0.52, 0.2, 0.02)
    P.prism_y('cab', -0.92, 0.92, [(1.02, 1.0), (3.2, 0.94), (3.2, 1.62), (2.95, 1.86), (1.02, 2.02)])          # the hood, nose down
    for i in range(7): P.box('chrome', 3.2, 3.25, -0.52 + i * 0.16, -0.46 + i * 0.16, 1.0, 1.66)               # the grille's bars
    P.box('dark', 3.19, 3.22, -0.6, 0.6, 0.98, 1.7)
    P.box('chrome', 3.24, 3.52, -1.24, 1.24, 0.5, 0.86)                                                       # the bumper
    for sy in (-0.98, 0.84): P.box('paper', 3.2, 3.27, sy, sy + 0.14, 1.2, 1.42)                               # the headlights, dead
    P.prism_y('cab', -1.22, 1.22, [(-0.65, 1.0), (1.02, 1.0), (1.02, 2.05), (0.76, 2.86), (-0.65, 2.92)])     # the cab
    P.prism_y('glass', -1.08, -0.04, [(0.8, 2.78), (1.05, 2.1), (1.09, 2.12), (0.84, 2.8)])                    # the windscreen, two panes
    P.prism_y('glass', 0.04, 1.08, [(0.8, 2.78), (1.05, 2.1), (1.09, 2.12), (0.84, 2.8)])
    P.prism_y('cab', -1.26, 1.26, [(0.62, 2.86), (1.0, 2.8), (1.02, 2.86), (0.62, 2.95)])                      # the visor
    for k in range(5): P.box('sodium', 0.5, 0.58, -0.8 + k * 0.4 - 0.05, -0.8 + k * 0.4 + 0.05, 2.93, 3.0)     # the roof's marker lamps
    P.box('glass', -0.3, 0.72, 1.2, 1.24, 2.02, 2.7); P.box('dark', -0.36, -0.33, 1.19, 1.24, 1.05, 2.75); P.box('dark', 0.86, 0.89, 1.19, 1.24, 1.05, 2.05)   # the far door: glass and seams
    P.box('dark', -0.42, 0.9, -1.24, -1.0, 1.02, 2.8)                                                         # the driver's doorway: the door is open, the cab dark inside
    P.box('cab', 0.9, 0.96, -2.25, -1.22, 1.02, 2.72); P.box('glass', 0.88, 0.9, -2.1, -1.34, 2.02, 2.66)      # the door itself, swung out
    for sy in (-1.5, 1.38): P.bar('chrome', (0.95, sy, 2.2), (0.95, sy * 0.86, 2.2), 0.02); P.box('chrome', 0.9, 1.0, sy - 0.06, sy + 0.06, 2.0, 2.5)   # the mirrors
    for sy in (-1.25, 0.72): P.box('cab', 1.5, 3.0, sy, sy + 0.53, 0.98, 1.1); P.box('cab', 1.5, 1.62, sy, sy + 0.53, 0.6, 1.0)          # the fenders
    for sy in (-1.06, 1.06): P.tube_x('tank', -0.55, 0.95, sy, 0.72, 0.3); P.box('dark', -0.2, -0.14, sy - 0.31, sy + 0.31, 0.42, 1.03); P.box('dark', 0.55, 0.61, sy - 0.31, sy + 0.31, 0.42, 1.03)   # the tanks and their straps
    for sy in (-1.3, 1.3): P.box('steel', 0.1, 0.8, sy - 0.12, sy + 0.12, 0.3, 0.36)                           # the steps
    for sy in (-1.12, 1.12): P.drum('chrome', -0.78, sy, 1.0, 3.6, 0.085, 10); P.drum('dark', -0.78, sy, 1.9, 2.9, 0.12, 10)   # the stacks and their heat shields
    for sy in (-1.0, 1.0): P.tube_x('chrome', 1.1, 1.55, sy * 1.02, 2.2, 0.17)                                  # the air cleaners on the cowl
    P.box('steel', -3.1, -1.3, -0.5, 0.5, 0.95, 1.0); P.drum('dark', -2.2, 0.0, 1.0, 1.1, 0.52, 18)            # the deck plate and the fifth wheel
    P.bar('rubber', (-0.7, -0.3, 1.5), (-1.6, -0.5, 1.02), 0.03); P.bar('rubber', (-0.7, 0.2, 1.6), (-1.9, 0.6, 1.02), 0.03)   # the air lines, pulled off
    for sy in (-1.2, 0.72): P.box('dark', -3.42, -3.38, sy, sy + 0.48, 0.25, 0.9)                              # the mud flaps
    cab = P.build(bpy, 'cab', M)
    # THE LOW WALL of a ramp one level up (3.53 m): cast panels between pilasters, a coping, a joint at half height
    P = Parts(); wy = 30.0; wz = DECK_Z * 3.5 / 8.482
    P.box('conc_d', 47.5, 60.5, wy + 0.1, wy + 0.4, 0.0, wz - 0.05)
    for x0 in np.arange(47.5, 60.5, 3.0):
        P.box('conc', x0 + 0.17, x0 + 2.83, wy + 0.04, wy + 0.3, 0.02, wz * 0.5 - 0.02); P.box('conc', x0 + 0.17, x0 + 2.83, wy + 0.04, wy + 0.3, wz * 0.5 + 0.02, wz - 0.3)
        P.box('conc', x0 - 0.15, x0 + 0.15, wy - 0.05, wy + 0.3, 0.0, wz - 0.3)
    P.box('conc', 47.5, 60.5, wy - 0.08, wy + 0.45, wz - 0.3, wz)
    things += P.build(bpy, 'lowwall', M)
    piv = bpy.data.objects.new('cab_root', None); bpy.context.scene.collection.objects.link(piv)
    for o in cab: o.parent = piv
    things += cab
    # THE FREEWAY LAMP: a 9 m mast on its pedestal in the median, two arms, two dead heads (the fight lights one of them)
    P = Parts(); lx_, ly_ = 24.0, 30.0
    P.box('conc', lx_ - 0.3, lx_ + 0.3, ly_ - 0.3, ly_ + 0.3, 0.0, 0.95)
    P.drum('steel', lx_, ly_, 0.95, 9.0, 0.13, 10, 0.075)
    for sg in (-1, 1):
        P.bar('steel', (lx_, ly_, 8.9), (lx_ + sg * 1.2, ly_, 9.35), 0.05); P.bar('steel', (lx_ + sg * 1.2, ly_, 9.35), (lx_ + sg * 2.3, ly_, 9.4), 0.045)
        P.box('tank', lx_ + sg * 2.25 - 0.4, lx_ + sg * 2.25 + 0.4, ly_ - 0.17, ly_ + 0.17, 9.3, 9.46); P.box('glass', lx_ + sg * 2.3 - 0.25, lx_ + sg * 2.3 + 0.25, ly_ - 0.12, ly_ + 0.12, 9.26, 9.3)
    P.box('dark', lx_ - 0.12, lx_ + 0.12, ly_ - 0.31, ly_ - 0.3, 0.3, 0.6)                                    # the handhole cover, off
    things += P.build(bpy, 'lamp', M)
    RIG.source_pass(things, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(things, 1.0)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in things:
        if o.parent is None: o.scale = (1, 1, zs)
    piv.scale = (1, 1, zs); piv.rotation_euler = (0, 0, math.radians(-28)); piv.location = (36.0, 30.0, 0.0)
    NF.grime_pass(bpy, [], 5)
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    catcher(bpy)
    return shoot(bpy, F, RIG, 'props', quick, samples=64, transparent=True)


SCENES = {'deck': scene_deck, 'ns': scene_ns, 'face': scene_face, 'props': scene_props}


# ======================================================================================================================
# THE CUT (no bpy): the renders into the tiles the boards pick from
# ======================================================================================================================
Q = 76                                  # the stand-in kit's own quality: the published list is at its cap (gates/pages_publish_gate.js)
CITY_BLOCKS = dict(subs=['subs_0', 'subs_1', 'subs_2'], cross=['corner_0', 'corner_1'])
KITS = 'kit_street/'


def T(im, r, c):
    return im.crop((c * TW, r * TH, (c + 1) * TW, (r + 1) * TH))


def vjoin(top, bottom, y=TH // 2, f=10):
    """the top of one tile over the bottom of another, feathered across 2f pixels"""
    m = np.clip((np.arange(TH)[:, None] - (y - f)) / (2.0 * f), 0, 1) * np.ones((1, TW))
    return Image.composite(bottom, top, Image.fromarray((m * 255).astype(np.uint8)))


def hjoin(left, right, x=TW // 2, f=10):
    m = np.ones((TH, 1)) * np.clip((np.arange(TW)[None, :] - (x - f)) / (2.0 * f), 0, 1)
    return Image.composite(right, left, Image.fromarray((m * 255).astype(np.uint8)))


def shadow(px, mult):
    """COOK TWO's shadow(): the ground at a darkness, the hue walking cool as it darkens (imported, never redrawn)"""
    import bohemia_cook2_the_fight_floor_10_19_26 as C2
    a = np.asarray(px.convert('RGB')); m = np.broadcast_to(np.asarray(mult, np.float32), a.shape[:2])
    out = C2.shadow(a.reshape(-1, 3), m.reshape(-1).copy()).reshape(a.shape)
    return Image.fromarray(out)


def far(im, k=1.0, blur=2.2):
    """the city seen from the deck, 8.5 m down and further: dimmer, drained, cooler, out of focus (baked, never a filter
    on the glass): the light of a day nobody is in"""
    from PIL import ImageFilter
    a = np.asarray(im.convert('RGB'), np.float32) / 255.0
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    a = lum[..., None] + (a - lum[..., None]) * (1 - 0.35 * k)                # drained
    a = a * (1 - 0.52 * k)                                                    # dimmer
    a = a * np.array([1 - 0.05 * k, 1 - 0.01 * k, 1 + 0.08 * k], np.float32)  # cooler
    a = 0.5 + (a - 0.5) * (1 - 0.0 * k)
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.GaussianBlur(blur * k)) if blur * k > 0.05 else out


def windows(im, seed, share=0.16):
    """rule 20: the windows of a block's houses (the dark panes on their south walls), and which few of them are lit: a
    mask at the block's own pixels"""
    from scipy import ndimage
    a = np.asarray(im.convert('RGB'), np.float32); lum = a.mean(-1)
    lab, n = ndimage.label(lum < 58)
    rng = np.random.RandomState(seed); m = np.zeros(lum.shape, np.float32); lit = 0; seen = 0
    for i, sl in enumerate(ndimage.find_objects(lab)):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if not (26 <= w <= 100 and 24 <= h <= 72): continue
        part = lab[sl] == i + 1
        if part.mean() < 0.55: continue
        y0 = sl[0].start
        if y0 < 12 or lum[y0 - 10:y0 - 3, sl[1]].mean() < 95: continue                # a pane sits in a pale wall, never in a shadow
        seen += 1
        if rng.rand() < share: m[sl][part] = 1.0; lit += 1
    return m, seen, lit


def lay(struct, ground, haze=0.0):
    """a render of the structure (its own pixels, and its shadow as darkness in the alpha) on a ground tile; with haze the
    structure dims toward its foot, where the far ground is"""
    S = np.asarray(struct.convert('RGBA'), np.float32) / 255.0
    rgb, al = S[..., :3], S[..., 3]
    lum = rgb.max(-1)
    sh = np.where(lum < 0.06, al, 0.0)                                         # the catcher: black, its alpha the darkness
    g = shadow(ground, np.clip(1 - sh * 0.92, 0.2, 1.0))
    body = np.where(lum < 0.06, 0.0, al)
    if haze:
        fa = np.asarray(far(Image.fromarray((rgb * 255).astype(np.uint8)), haze, 0.0), np.float32) / 255.0
        k = (np.arange(S.shape[0], dtype=np.float32) / S.shape[0])[:, None, None] ** 1.3
        rgb = rgb * (1 - k) + fa * k
    G = np.asarray(g, np.float32) / 255.0
    out = G * (1 - body[..., None]) + rgb * body[..., None]
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def grade(im, left, right):
    """a ramp's light: a slope that faces the sun is brighter, one that faces away is darker (the rig's one sun, by the
    cosine), a little more so toward its high end"""
    a = np.asarray(im.convert('RGB'), np.float32)
    k = np.linspace(left, right, TW, dtype=np.float32)[None, :, None]
    return Image.fromarray(np.clip(a * k, 0, 255).astype(np.uint8))


def under(im, seed, lit_px=0):
    """a ground tile under the deck: the deck's shadow (the sky's light only), a damp line where a joint overhead has
    wept for years, the salt it left; lit_px: how much of the tile's west side the sun still reaches (the shadow lies 4 m
    east of the deck's edge: the rig's sun is in the south-west)"""
    rng = np.random.RandomState(seed)
    n = vnoise((TH, TW), 60, rng); n2 = vnoise((TH, TW), 9, rng)
    m = 0.56 * (0.95 + 0.10 * n)
    yy = np.arange(TH, dtype=np.float32)[:, None]
    drip = np.clip(1 - np.abs(yy - 97 - (n[:, :1] - 0.5) * 6) / (7 + 10 * n), 0, 1) * (n2 > 0.35)
    m = m * (1 - 0.3 * drip)
    if lit_px:
        xx = np.arange(TW, dtype=np.float32)[None, :]
        edge = np.clip((xx - lit_px + 3) / 6.0, 0, 1)                          # a 6 px penumbra: the sun is 3 degrees wide
        m = 1 - (1 - m) * edge
    out = np.asarray(shadow(im, m), np.float32)
    salt = (drip > 0.6) & (vnoise((TH, TW), 3, rng) > 0.72)
    if lit_px: salt &= (np.arange(TW)[None, :] > lit_px + 8)
    out[salt] = out[salt] * 0.55 + np.array([150, 148, 140], np.float32) * 0.45
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def save(im, name, q=Q):
    im.convert('RGB').save(os.path.join(SHIP, name), 'WEBP', quality=q, method=6)
    return 'freeway/' + name


def save_a(im, name, q=88):
    im.save(os.path.join(SHIP, name), 'WEBP', quality=q, method=6)
    return 'freeway/' + name


def fg(rel):
    return Image.open(os.path.join(FG, rel)).convert('RGB')


def cut():
    os.makedirs(SHIP, exist_ok=True)
    old = json.load(open(os.path.join(SHIP, 'freeway.json')))
    for f in os.listdir(SHIP):                                  # every stand-in picture goes; the gantry is COOK's own render and stays
        if f.endswith('.webp') and f != 'fw_gantry.webp': os.remove(os.path.join(SHIP, f))
    deck = Image.open(os.path.join(REND, 'deck.png')).convert('RGB')
    ns = Image.open(os.path.join(REND, 'ns.png')).convert('RGB')
    face = Image.open(os.path.join(REND, 'face.png')).convert('RGBA')
    props = Image.open(os.path.join(REND, 'props.png')).convert('RGBA')
    SB = json.load(open(os.path.join(FG, 'street_board', 'street_board.json')))
    sg = lambda kind: ['street_board/' + v['src'] for v in SB['ground'][kind]]
    dirt, rubble = sg('dirt'), sg('rubble')
    tiles = {}
    # ---- THE DECK ----
    lanes = [T(deck, r, c) for r, c in ((1, 1), (1, 2), (1, 3), (3, 1), (3, 2), (3, 3))]
    n_ = [T(deck, 0, c) for c in (1, 2, 3)]; s_ = [T(deck, 4, c) for c in (1, 2, 3)]; s_all = list(s_)
    nw, ne, sw, es = T(deck, 0, 0), T(deck, 0, 4), T(deck, 4, 0), T(deck, 4, 4)
    w_ = [T(deck, 1, 0), T(deck, 3, 0)]; e_ = [T(deck, 1, 4), T(deck, 3, 4)]
    ns_ = [vjoin(n_[i], s_all[i * 2]) for i in range(2)]
    nsw, nes = vjoin(nw, sw), vjoin(ne, es)
    walls = {'n': n_, 's': s_, 'w': w_, 'e': e_, 'ns': ns_, 'nw': [nw], 'ne': [ne], 'sw': [sw], 'es': [es], 'nsw': [nsw], 'nes': [nes],
             'nesw': [hjoin(nsw, nes)], 'ew': [hjoin(w_[0], e_[0])], 'new': [hjoin(nw, ne)], 'esw': [hjoin(sw, es)]}
    # two marks are there ONCE on a board, never a pattern (the dealer lays each on one tile): where a car burned and was
    # dragged off, and (rule 20) the skid marks that run into the south wall with the wall whole
    once = {'lane': [save(lanes.pop(4), 'fw_lane_burn.webp')], 'lane_s': [save(s_.pop(1), 'fw_lane_s_skid.webp')]}
    tiles['lane'] = [save(im, 'fw_lane_%d.webp' % i) for i, im in enumerate(lanes)]
    tiles['median'] = [save(T(deck, 2, c), 'fw_median_%d.webp' % i) for i, c in enumerate((1, 2, 3))]
    for k, ims in walls.items():
        tiles['lane_' + k] = [save(im, 'fw_lane_%s_%d.webp' % (k, i)) for i, im in enumerate(ims)]
    # the slopes: the same lanes in a ramp's light (the sun in the south-west: a ramp climbing east faces it, one climbing west faces away)
    for up, (l, r) in (('e', (0.96, 1.12)), ('w', (0.90, 0.78))):
        for ws, base in (('', lanes[:2]), ('n', n_[:2]), ('s', [s_all[0], s_all[2]]), ('ns', ns_[:2])):
            tiles['slope_' + up + ('_' + ws if ws else '')] = [save(grade(im, l, r), 'fw_slope_%s%s_%d.webp' % (up, '_' + ws if ws else '', i)) for i, im in enumerate(base)]
    # the lanes running north-south (the one-tile ramp between two decks)
    tiles['lane_ns_ew'] = [save(T(ns, r, c), 'fw_lane_ns_ew_%d.webp' % i) for i, (r, c) in enumerate(((0, 0), (1, 1), (2, 4), (3, 0)))]
    tiles['lane_ns_w'] = [save(T(ns, r, 2), 'fw_lane_ns_w_%d.webp' % i) for i, r in enumerate((0, 2))]
    tiles['lane_ns_e'] = [save(T(ns, r, 3), 'fw_lane_ns_e_%d.webp' % i) for i, r in enumerate((1, 3))]
    # ---- THE CITY BELOW: the fight's own suburb blocks from the deck ----
    city = {'subs': [], 'cross': [], 'cross_every': 3}
    for fam, names in CITY_BLOCKS.items():
        for nm in names:
            im = fg('block_%s.webp' % nm)
            wm, seen, lit = windows(im, 7 + len(nm) + sum(map(ord, nm)))
            # a quarter of the block's pixels (645 x 455, five whole tiles of 129 x 91): the city is out of focus anyway, and the
            # fight redraws its ground whenever a lamp flickers: a tile cut from a small sheet costs it a quarter of the pixels
            # (measured 11/10 at a 4x slowed phone: half-size sheets cost the deck 4 frames a second upright)
            FAR = (645, 455)
            im = far(im.resize(FAR, Image.LANCZOS), 1.0, 0.55)
            from PIL import ImageFilter
            wmask = Image.fromarray((wm * 255).astype(np.uint8)).resize(FAR, Image.LANCZOS)
            halo = np.asarray(wmask.filter(ImageFilter.GaussianBlur(3.5)), np.float32) / 255.0; core = np.clip(np.asarray(wmask, np.float32) / 255.0 * 1.6, 0, 1)
            a = np.asarray(im, np.float32); warm = np.array([232, 176, 92], np.float32)
            a = a + (warm - a) * np.clip(core * 0.92, 0, 1)[..., None]; a = a + warm * np.clip(halo * 0.55, 0, 1)[..., None] * 0.5
            im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
            city[fam].append(save(im, 'fw_city_%s.webp' % nm, 72))
            print('  city', nm, 'windows', seen, 'lit', lit)
    # the overpass stands on the street: the city round it is the fight's own blocks as they lie, at half their pixels (it is
    # only ever past a wall or in the ring; measured 11/10: the five whole blocks put 3.0 MB on the overpass's load, 5.99 MB
    # against the stand-in's 2.98)
    near = {'subs': [], 'cross': []}
    for fam, names in (('subs', CITY_BLOCKS['subs'][:1]),):   # one block of houses, no cross street: the overpass's load stays what the stand-in's was
        for nm in names:
            near[fam].append(save(fg('block_%s.webp' % nm).resize((1290, 910), Image.LANCZOS), 'fw_near_%s.webp' % nm, 66))
    city['near'] = near
    far_dirt = [far(fg(d), 1.0, 2.2) for d in dirt]
    far_rubble = [far(fg(d), 1.0, 2.2) for d in rubble]
    tiles['below'] = [save(im, 'fw_below_%d.webp' % i, 72) for i, im in enumerate(far_dirt[:2])]
    # ---- NORTH OF A DECK: the deck's own shadow on the ground behind it (the rig's sun is in the south-west: 5.8 m of it), the
    # one thing that says 'this road is up in the air' from the side its face cannot be seen; over the far city and on the street
    def north_shadow(ground, seed):
        rng = np.random.RandomState(seed); n = vnoise((TH, TW), 70, rng)
        yy = np.arange(TH, dtype=np.float32)[:, None]; top = TH - 5.83 * (TH / TM)
        m = 1 - (1 - 0.46 * (0.95 + 0.1 * n)) * np.clip((yy - top + 3) / 6.0, 0, 1)
        return shadow(ground, m)
    tiles['drop_n'] = [save(north_shadow(far_dirt[i], 90 + i), 'fw_drop_n_%d.webp' % i, 72) for i in range(2)]
    tiles['drop_n_st'] = [save(north_shadow(fg(dirt[i]), 94 + i), 'fw_drop_n_st_%d.webp' % i) for i in range(2)]
    # ---- THE FACE: the deck's south edge from the girder down to the ground under it ----
    F3 = [T(face, 3, c) for c in range(5)]
    tiles['face'] = [save(lay(F3[2], far_dirt[i], 1.0), 'fw_face_%d.webp' % i) for i in range(2)]
    tiles['face_bent'] = [save(lay(F3[c], far_dirt[i], 1.0), 'fw_face_bent_%d.webp' % i) for i, c in enumerate((1, 3))]
    tiles['face_brk_e'] = [save(lay(F3[0], far_rubble[0], 1.0), 'fw_face_brk_e.webp')]
    tiles['face_brk_w'] = [save(lay(F3[4], far_rubble[1], 1.0), 'fw_face_brk_w.webp')]
    tiles['face_st'] = [save(lay(F3[2], fg(dirt[i])), 'fw_face_st_%d.webp' % i) for i in range(2)]
    tiles['face_st_bent'] = [save(lay(F3[c], fg(dirt[i])), 'fw_face_st_bent_%d.webp' % i) for i, c in enumerate((1, 3))]
    tiles['face_st_v'] = [save(lay(F3[2], fg(KITS + 'road_ns.webp')), 'fw_face_st_v.webp')]
    tiles['face_st_brk_e'] = [save(lay(F3[0], fg(rubble[0])), 'fw_face_st_brk_e.webp')]
    tiles['face_st_brk_w'] = [save(lay(F3[4], fg(rubble[1])), 'fw_face_st_brk_w.webp')]
    # the low wall of a ramp one level up (the overpass): a wall of precast panels, the street's dirt at its foot
    wtop = 910 - int(round(3.5 * PPM))                           # the wall's top is the ramp's edge: the tile's top line
    wall = props.crop((int(48 * PPM), wtop, int(48 * PPM) + TW, wtop + TH))
    tiles['face_st_low'] = [save(lay(wall, fg(dirt[2])), 'fw_face_st_low.webp')]
    # ---- THE BROKEN ENDS: over the city (the deck, the interchange) and over the fallen span on the street (the overpass) ----
    for side, c in (('e', 0), ('w', 4)):
        rows = {'n': T(face, 0, c), '': T(face, 1, c), 's': T(face, 2, c)}
        for fam, grounds, hz in (('broken', far_rubble, 1.0), ('broken_st', [fg(r_) for r_ in rubble], 0.0)):
            got = {k: lay(v, grounds[i % len(grounds)], 0.0) for i, (k, v) in enumerate(rows.items())}
            got['ns'] = vjoin(got['n'], got['s'])
            for k, im in got.items():
                tiles['%s_%s%s' % (fam, side, '_' + k if k else '')] = [save(im, 'fw_%s_%s%s.webp' % (fam, side, '_' + k if k else ''))]
    # ---- UNDER THE DECK (the underpass): the street kit's own ground in the deck's shadow ----
    bases = {'dirt': dirt[:2], 'road_ew': [KITS + 'road_ew.webp'], 'road_ns': [KITS + 'road_ns.webp'], 'walk': [KITS + 'walk.webp'],
             'junction': [KITS + 'junction.webp'], 'rubble': [rubble[1]]}
    for b, srcs in bases.items():
        tiles['shade_' + b] = [save(under(fg(src), 40 + 7 * i + len(b)), 'fw_shade_%s_%d.webp' % (b, i)) for i, src in enumerate(srcs)]
        if b in ('dirt', 'walk', 'road_ew'):
            tiles['shade_%s_lipw' % b] = [save(under(fg(srcs[0]), 60 + len(b), lit_px=176), 'fw_shade_%s_lipw.webp' % b)]
            tiles['shade_%s_lipe' % b] = list(tiles['shade_' + b])           # the shadow runs on east past the deck's edge: no lip to draw
    # ---- the street's own ground, as it lies ----
    tiles['dirt'] = dirt; tiles['plaza'] = sg('plaza'); tiles['rubble'] = rubble
    for k in ('walk', 'road_ew', 'road_ns', 'junction'): tiles[k] = [KITS + k + '.webp']
    # ---- THE PIECES ----
    def piece(box, foot, name, shadow_too, shade=True):
        im = props.crop(box); a = np.asarray(im, np.float32) / 255.0
        if not shadow_too and not shade:                        # the lamp: its own pixels only (a 9 m mast's shadow would lie across three tiles)
            a[..., 3] = np.where(a[..., :3].max(-1) < 0.06, 0.0, a[..., 3])
        elif not shadow_too:
            # the bent stands in the deck's shade: its own cast shadow goes, it takes the same darkness the ground under the
            # deck takes (COOK TWO's shadow()), and it sits on a soft dark foot
            a[..., 3] = np.where(a[..., :3].max(-1) < 0.06, 0.0, a[..., 3])
            rgb = np.asarray(shadow(Image.fromarray((a[..., :3] * 255).astype(np.uint8)), 0.56), np.float32) / 255.0
            yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
            d = np.sqrt(((xx - (foot[0] - box[0])) / 70.0) ** 2 + ((yy - (foot[1] - box[1])) / 30.0) ** 2)
            seat = np.clip(1 - d, 0, 1) ** 1.5 * 0.5
            al = a[..., 3:4]; a = np.concatenate([rgb * al, np.maximum(al, seat[..., None] * (1 - al))], -1)
            a[..., :3] = np.where(al > 0, a[..., :3] / np.maximum(al, 1e-6), 0)
            # what roosts on the cap leaves its mark round the foot: pale spatter on the ground, thickest under the cap's two ends
            rs = np.random.RandomState(31)
            for cx_ in (-95, 95, -60, 60, 0):
                for _ in range(26):
                    px_ = int(foot[0] - box[0] + cx_ + rs.normal(0, 22)); py_ = int(foot[1] - box[1] + rs.normal(6, 13)); r_ = rs.choice([1, 1, 2, 2, 3])
                    if 0 <= px_ < a.shape[1] - 3 and 0 <= py_ < a.shape[0] - 3 and a[py_, px_, 3] < 0.6:
                        a[py_:py_ + r_, px_:px_ + r_ + rs.randint(0, 2), :3] = (0.46, 0.45, 0.42); a[py_:py_ + r_, px_:px_ + r_ + 1, 3] = np.maximum(a[py_:py_ + r_, px_:px_ + r_ + 1, 3], 0.8)
        im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), 'RGBA'); bb = im.getbbox(); im = im.crop(bb)
        return save_a(im, name), [im.width, im.height, round(foot[0] - box[0] - bb[0], 1), round(foot[1] - box[1] - bb[1], 1)]
    bent_src, bent_sz = piece((int(6 * PPM), 400, int(18 * PPM), 960), (12 * PPM, 910), 'fw_bent.webp', False)
    cab_src, cab_sz = piece((int(30 * PPM), 660, int(42 * PPM), 1060), (36 * PPM, 910), 'fw_cab.webp', True)
    # the lamp is drawn by its foot at the middle of its bottom edge: the picture is cut the same width either side of the mast
    lamp_src, lsz = piece((int(21 * PPM), 440, int(27 * PPM), 925), (24 * PPM, 910), 'fw_lamp.webp', False, shade=False)
    lim = Image.open(os.path.join(SHIP, 'fw_lamp.webp')).convert('RGBA'); half = int(max(lsz[2], lim.width - lsz[2])) + 1
    sym = Image.new('RGBA', (half * 2, int(lsz[3]) + 2), (0, 0, 0, 0)); sym.alpha_composite(lim.crop((0, 0, lim.width, min(lim.height, int(lsz[3]) + 2))), (half - int(round(lsz[2])), 0))
    lamp_src = save_a(sym, 'fw_lamp.webp')
    # the fire in the city below: the fight's own oil drum, its light on the ground round it
    fire = Image.new('RGBA', (220, 160), (0, 0, 0, 0)); yy, xx = np.mgrid[0:160, 0:220]
    d = np.sqrt(((xx - 110) / 110.0) ** 2 + ((yy - 96) / 62.0) ** 2)
    glow = np.clip(1 - d, 0, 1) ** 2.2
    fa = np.zeros((160, 220, 4), np.float32); fa[..., 0] = 255; fa[..., 1] = 132; fa[..., 2] = 48; fa[..., 3] = glow * 150
    fire = Image.fromarray(fa.astype(np.uint8), 'RGBA')
    drum = Image.open(os.path.join(FG, 'light_oil_drum.webp')).convert('RGBA'); drum = drum.resize((drum.width * 3 // 4, drum.height * 3 // 4), Image.LANCZOS)
    fire.alpha_composite(drum, (110 - drum.width // 2, 104 - drum.height))
    city['fire'] = dict(src=save_a(fire, 'fw_city_fire.webp', 80), w=220, h=160)
    # ---- the json ----
    sizes = dict(old['sizes']); sizes['fw_bent'] = bent_sz; sizes['fw_cab'] = cab_sz
    kit = dict(old['kit'])
    for k in kit: kit[k] = dict(kit[k], stage='finished')
    kit['fw_bent'] = dict(kit['fw_bent'], src=bent_src, h=6.4, **{'from': 'the rig: a round column and its hammerhead, in the deck\'s shade'})
    kit['fw_cab'] = dict(kit['fw_cab'], src=cab_src, h=2.9, **{'from': 'the rig: a day-cab tractor built in metres'})
    kit['fw_gantry'] = dict(kit['fw_gantry'], stage='finished', why="COOK's own render through the rig (10/18): at the bar as it is, rule 430")
    out = dict(old, version='freeway-kit-11-10-finished', rule='VAMILY 443(g), ask row 557; 432, 430 (reuse first), 408(b) (the golden piece and its recipe)',
               made_by='tools/bohemia_cook5_the_freeway_finished_11_10_26.py', golden='freeway/fw_face_bent_0.webp', stage='finished',
               deck_height_m=round(DECK_Z, 3), tiles=tiles, city=city, once=once, sizes=sizes, kit=kit,
               lamp=dict(src=lamp_src, w=sym.width, h=sym.height, why='the freeway\'s own mast in the median (the street\'s porch lamp stood there as a stand-in)'))
    out.pop('golden_candidate', None)
    json.dump(out, open(os.path.join(SHIP, 'freeway.json'), 'w'), indent=1)
    made = [f for f in os.listdir(SHIP) if f.endswith('.webp')]
    print('tile kinds', len(tiles), 'pictures', len(made), 'bytes', sum(os.path.getsize(os.path.join(SHIP, f)) for f in made))


# ======================================================================================================================
# THE SHEET (no bpy): the golden piece beside its twin and the bar, and the four boards on his phone before and after
# ======================================================================================================================
def sheet(page_dir):
    """records/target/COOK5_THE_FREEWAY_FINISHED_11_10.webp: what the VOTE card shows. page_dir holds the page's own
    screenshots (fw_<kind>_<upright|sideways>.png at 390 x 844 at 2 and 844 x 390 at 2, the fight's own camera)"""
    from PIL import ImageDraw, ImageFont
    font = lambda sz: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), sz)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12)
    rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im)
        d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    # ---- 1. the golden piece at one art pixel to one screen pixel, beside the map's own freeway and his one real street ----
    g = Image.new('RGB', (TW, TH * 2))
    g.paste(Image.open(os.path.join(SHIP, 'fw_lane_s_0.webp')), (0, 0)); g.paste(Image.open(os.path.join(SHIP, 'fw_face_st_bent_0.webp')), (0, TH))
    twin = fg('block_freeway_0.webp').crop((1030, 1000, 1030 + 310, 1000 + TH * 2))
    bar = Image.open(os.path.join(R, 'records/target/COOK2_ONE_REAL_STREET.webp')).convert('RGB')
    bar = bar.crop((2400, 540, 2700, 540 + TH * 2))             # a yard, its walk, the sidewalk and the street's edge, at the bar's own pixels
    title('THE GOLDEN PIECE: THE SOUTH EDGE OF THE DECK', 'one art pixel to one screen pixel. left: the piece. middle: the map\'s own freeway (its twin). right: his one real street (the bar).')
    r1 = Image.new('RGB', (WID, TH * 2), BG); r1.paste(g, (0, 0)); r1.paste(twin, (TW + 12, 0)); r1.paste(bar, (TW + 12 + 310 + 12, 0)); rows.append(r1)
    # ---- 2. before and after on the phone, upright ----
    old = Image.open(os.path.join(R, 'records/target/FREEWAY_THE_FREEWAY_FIGHT_11_7.webp')).convert('RGB')
    cells = {'deck': (401, 52, 390, 660), 'overpass': (802, 52, 390, 660), 'underpass': (0, 946, 390, 660), 'interchange': (401, 946, 390, 660)}
    names = {'deck': 'THE DECK', 'overpass': 'THE OVERPASS', 'underpass': 'THE UNDERPASS', 'interchange': 'THE INTERCHANGE'}
    title('ON HIS PHONE, UPRIGHT: THE STAND-IN (11/7) AND NOW', 'the fight\'s own camera, 390 x 844; each pair is the same board')
    cw = (WID - 30) // 4
    for pair in (('deck', 'overpass'), ('underpass', 'interchange')):
        r = Image.new('RGB', (WID, int(660 * cw / 390) + 30), BG); d = ImageDraw.Draw(r); x = 0
        for k in pair:
            x0, y0, w, h = cells[k]
            b = old.crop((x0, y0, x0 + w, y0 + h)).resize((cw, int(h * cw / w)), Image.LANCZOS)
            n = Image.open(os.path.join(page_dir, 'fw_%s_upright.png' % k)).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390))).resize((cw, int(660 * cw / 390)), Image.LANCZOS)
            d.text((x + 4, 4), names[k] + ', 11/7', font=font(14), fill=DIM); r.paste(b, (x, 26)); x += cw + 6
            d.text((x + 4, 4), names[k] + ', NOW', font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 12
        rows.append(r)
    # ---- 3. sideways ----
    title('ON HIS PHONE, SIDEWAYS: NOW', '844 x 390; the deck, the overpass, the underpass, the interchange')
    sw = (WID - 10) // 2
    for pair in (('deck', 'overpass'), ('underpass', 'interchange')):
        r = Image.new('RGB', (WID, int(390 * sw / 844)), BG)
        for i, k in enumerate(pair):
            n = Image.open(os.path.join(page_dir, 'fw_%s_sideways.png' % k)).convert('RGB').resize((sw, int(390 * sw / 844)), Image.LANCZOS); r.paste(n, (i * (sw + 10), 0))
        rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height + 8 for r in rows)), BG); y = 0; first = None
    for i, r in enumerate(rows):
        out.paste(r, (0, y))
        if i == 3: first = (cw + 6, y + 26, cw, int(660 * cw / 390))             # the deck, now
        y += r.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_FREEWAY_FINISHED_11_10.webp'); out.save(dst, 'WEBP', quality=78, method=6)
    os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    fx, fy, fw_, fh = first
    n = Image.open(os.path.join(page_dir, 'fw_deck_upright.png')).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390)))
    n.resize((n.width // 2, n.height // 2), Image.LANCZOS).save(os.path.join(R, 'records/target/vote_first/cook5-the-freeway-finished-11-10.webp'), 'WEBP', quality=82, method=6)
    Image.open(os.path.join(page_dir, 'fw_deck_upright.png')).convert('RGB').resize((390, 844), Image.LANCZOS).save(os.path.join(R, 'records/target/COOK5_THE_FREEWAY_FINISHED_11_10_PHONE.webp'), 'WEBP', quality=82, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', first)
    return first


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for s in a[1:]:
            if s in SCENES: SCENES[s]('--quick' in a)
    elif a and a[0] == 'cut':
        cut()
    elif a and a[0] == 'sheet':
        sheet(a[1])
    elif a and a[0] == 'plan':
        import bohemia_cook_the_floor_through_the_rig_10_19_26 as F0
        ID = dict(F0.ID, paint_y=len(F0.IDS), seal=len(F0.IDS) + 1)
        gid, dark, pale = plan_deck(ID)
        pal = np.array([[150, 140, 120]] * 5 + [[60, 60, 60], [150, 140, 120], [230, 230, 220], [90, 120, 70], [140, 140, 135], [210, 170, 60], [15, 15, 15]], np.uint8)
        os.makedirs(OUT, exist_ok=True)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 40
        Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(OUT, 'plan_deck.png'))
        print('plan written')
    else:
        print(__doc__)
