#!/usr/bin/env python3
"""BOHEMIA -- COOK [the floor through the rig] 10/19/26: THE FIGHT FLOOR MODELLED, LIT AND RENDERED LIKE THE ROBOT AND THE TRUCK.
Rule 121(j) (Paolo 10/19: 'even the floor tiles and building tiles and all accessories have to get remade with this analog
horror Crashbox style. Everything. Everything.'); 121(k) ('Remodel everything 3D grimey Crashbox analog horror machine party
vibes'); 121(h): the fight floor is a NO again ('looks like shit'), after 'I hate the ground. I hate the floor' (10/18).

WHAT IT IS. Every fight block (60 m a side, five house tiles, 2575 x 1820 at the block's own 42.92 px a metre) is BUILT as a
ground in Blender and rendered through the master rig's own pieces, imported, never copied:
  * THE PLAN is COMBAT TWO's, read per pixel (step one, tools/bohemia_cook_the_floor_through_the_rig_plan_10_19_26.py) plus
    the town street tiles from COOK TWO's street kit geometry (the walks are 1.5 m bands, kit_street.json): which ground,
    nothing redrawn. Where a block stands a house, a wall, a lamp, the shipped pixels stay (rows two and three remake those).
  * THE GROUND IS GEOMETRY: a 4.7 cm grid (two pixels) carrying the real heights: the sidewalk 15 cm over the road (THE
    CURB, its face lit or in shade by the one sun), the yard a little under the walk, the wash bed 22 cm down, the desert
    rolling 4 cm over a metre and a half, a slab heaved a centimetre on its neighbour, a pothole 6 cm deep; then the stones,
    the rubble and the gravel in the gutter as their own meshes, sitting in the ground with their own shadows.
  * THE SURFACE IS MATERIAL: asphalt with its aggregate, alligator cracking in patches, long cracks, darker repairs and oil;
    the walk in 1.5 m panels (a five-foot panel) with dark joints and its own cracks; caliche, desert and the wash bed's
    mud cracks in his YES street's colours (records/target/COOK2_ONE_REAL_STREET.webp: the asphalt 64,61,61, the dirt
    172,157,134), every mask in metres.
  * THEN THE RIG: RIG.source_pass (the matte, the old paint, the crevice grime from the ground's own occlusion, the dust,
    the drift, the grain, the chipped edge on every curb) and RIG.dent_pass (the hand-made push) on every mesh, at the
    ground's dose (wear 0.25: the guide's 0.6 dusts every up-facing face, and on a ground every face faces up: measured
    below); RIG.light_and_film (the one sun at 40 deg from the upper left, the cool fill, Cycles 128 samples, Standard
    view); RIG.calibrate (the 1 m cube is 43 px at this ruler, the light 155 deg on the screen); the rig's camera
    (orthographic, tilted 45, facing north, never turned) with the rig's vertical stretch (heights x 1.414).
  * THE MAKER'S SHADOWS: the houses that stay flat this round keep the shadows COMBAT TWO's maker cast for them, laid on
    the new ground as darkness (the plan's lum), the hue walking cool (COOK TWO's shadow()).
  * THE ANALOG HORROR LINE (rule 20): the one watered lawn COOK TWO left on corner.1 stays green; and on every town board
    one manhole is open and nothing is round it, no cone, no tape.

  <venv>/bin/python tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py calibrate          (the colours, about 2 min)
  <venv>/bin/python tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py [--quick] block ... (about 3 min a block)
  <venv>/bin/python tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py kit               (the eight materials, seamless)
  (venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow; bpy may segfault on exit AFTER writing)

REFERENCE CHECK (the 9/4 standing duty): his YES street (cook2-one-real-street-10-18) is the twin and the floor bar's
control; real Las Vegas street work: Clark County's standard curb and gutter (a 6-inch curb face, 15 cm), the 5-foot
sidewalk panel (1.5 m), caliche yards; DIRECTION's floor bar (records/target/BOHEMIA_STYLE_GUIDE.json classes.ground) is
run on every block. No reference game.
REUSE CHECK (REUSE-FIRST): the master rig's source_pass, dent_pass, light_and_film and calibrate, imported; the plan from
COOK TWO's coded run of COMBAT TWO's maker; COOK TWO's shadow() and LAWN box; the palette roles of the props modeller.
TASTE CHECK: his NO twice on the floor; his YES street's numbers are the bar; the rig is the look (rule 115).
"""
import os, sys, json, math, time
import numpy as np
from PIL import Image, ImageFilter

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_direction_master_rig as RIG

SHIP = os.path.join(R, 'slices/fight_ground')
OUT = os.path.join(R, 'records/target/cook_floor_rig')
PLANS = os.path.join(OUT, 'plans')
RENDER = os.path.join(OUT, 'render')
CAL = os.path.join(OUT, 'ground_calibration.json')
W, H = 2575, 1820
PPM = 515 / 12.0                       # the block's own ruler: a 12 m house tile is 515 px
SIDE = 60.0                            # a block is five house tiles
STEP = 2 * SIDE / W                    # the grid: two pixels
WEAR = 0.25
GROUND_SAMPLES = 32
ROAD_WEAR = {'asphalt': 0.2, 'paint': 0.35}
PAL = json.load(open(os.path.join(R, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']

# the plan's grounds (step one's order) and the ones this tool adds from the street kit
PLAN_GROUNDS = ['caliche', 'desert', 'rough', 'playa', 'concrete', 'asphalt', 'track']
IDS = PLAN_GROUNDS + ['paint', 'lawn', 'gutter']
ID = {n: i for i, n in enumerate(IDS)}

# THE MATERIALS: a palette role and step for the base (the props modeller's source palette), a target from his YES street
# (sRGB, read off records/target/COOK2_ONE_REAL_STREET.webp: road median 64,61,61; dirt 172,157,134), the height and the
# surface features in metres. 'cal' is the calibration's value multiplier (records the render meeting the target).
MATS = {
    'asphalt':  dict(role=('rubber', 2), target=(68, 65, 62), h=0.0, alt=('rubber', 3), alt_amt=0.32, grit=0.2, speck=(45, 0.45),
                     cracks=dict(cell=0.34, width=0.026, region=0.35, cut=0.46, depth=0.8), long_cracks=dict(cell=3.2, width=0.032),
                     patches=dict(scale=0.22, cut=0.7, mul=0.6), oil=dict(scale=0.9, cut=0.72, mul=0.6), pot=True),
    'paint':    dict(role=('tape_grey', 3), target=(120, 113, 102), h=0.0, alt=('tape_grey', 2), alt_amt=0.2, grit=0.10, speck=(45, 0.14),
                     wornthrough=dict(scale=3.0, cut=0.46, to=('rubber', 2))),
    'gutter':   dict(role=('tape_grey', 2), target=(142, 139, 133), h=0.0, alt=('clay_bone', 1), alt_amt=0.15, grit=0.10, speck=(60, 0.14),
                     joints=dict(pitch=3.0, width=0.016), panel_var=0.06),
    'concrete': dict(role=('tape_grey', 2), target=(166, 162, 154), h=0.15, alt=('clay_bone', 2), alt_amt=0.12, grit=0.08, speck=(70, 0.12),
                     joints=dict(pitch=1.5, width=0.014), panel_var=0.07, cracks=dict(cell=0.9, width=0.008, region=0.35, cut=0.6, depth=0.5)),
    'caliche':  dict(role=('clay_bone', 2), target=(170, 157, 135), h=0.11, alt=('clay_bone', 1), alt_amt=0.05, grit=0.62, speck=(45, 0.68)),
    'desert':   dict(role=('clay_bone', 2), target=(174, 159, 134), h=0.04, alt=('tape_masking', 2), alt_amt=0.1, grit=0.6, speck=(40, 0.66)),
    'rough':    dict(role=('clay_bone', 2), target=(160, 149, 130), h=0.06, alt=('clay_bone', 1), alt_amt=0.1, grit=0.62, speck=(36, 0.68)),
    'playa':    dict(role=('clay_bone', 3), target=(176, 165, 145), h=-0.22, alt=('clay_bone', 2), alt_amt=0.08, grit=0.2, speck=(60, 0.25),
                     mud=dict(cell=0.38, width=0.032, depth=0.9)),
    'track':    dict(role=('clay_bone', 2), target=(152, 140, 120), h=-0.02, alt=('clay_bone', 1), alt_amt=0.15, grit=0.3, speck=(40, 0.36)),
    'lawn':     dict(role=('metal_painted', 2), target=(104, 116, 74), h=0.12, alt=('metal_painted', 1), alt_amt=0.3, grit=0.18, speck=(110, 0.25),
                     green=0.35),
}
# THE STONES: what lies on the ground, per ground: (per m2, min m, max m, the stone materials)
STONES = {
    'desert':  [(4.0, 0.05, 0.13, 'pebble'), (0.35, 0.14, 0.34, 'rock')],
    'caliche': [(1.8, 0.045, 0.11, 'pebble'), (0.06, 0.12, 0.22, 'rock')],
    'rough':   [(3.0, 0.05, 0.12, 'pebble'), (1.4, 0.08, 0.30, 'rubble'), (0.35, 0.06, 0.16, 'brick')],
    'track':   [(1.2, 0.04, 0.09, 'pebble')],
    'playa':   [(0.25, 0.04, 0.09, 'pebble')],
    'gutter':  [(4.0, 0.03, 0.07, 'gravel')],
}
STONE_MATS = {'pebble': ('clay_bone', 1), 'rock': ('clay_bone', 2), 'rubble': ('tape_grey', 2), 'brick': ('clay_rust', 1), 'gravel': ('tape_grey', 1)}


def lin1(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def role_lin(role, step):
    h = PAL[role]['ramp'][step]
    return tuple(lin1(int(h[i:i + 2], 16)) for i in (1, 3, 5))


# ---- THE PLAN --------------------------------------------------------------------------------------------------------
def street_ids(bid, ship):
    """the town street tiles COMBAT TWO lays from COOK TWO's kit (fight_ground.json kit_plan): the kit's walks are 1.5 m
    bands along the road's sides (kit_street.json walk_metres), the junction is all road; paint is where the kit's own
    picture is paint-bright over a few pixels (the zebras sit at 99 of 255, the road at 64), never a lone light fleck"""
    man = json.load(open(os.path.join(SHIP, 'fight_ground.json')))
    plan = man['blocks'].get(bid, {}).get('kit_plan', {})
    out = np.full((H, W), 255, np.uint8)
    yy, xx = np.mgrid[0:364, 0:515]; ym = (yy + 0.5) / 364 * 12; xm = (xx + 0.5) / 515 * 12
    for rc, piece in plan.items():
        r, c = map(int, rc.split(','))
        y0, x0 = r * 364, c * 515
        kit = np.asarray(Image.open(os.path.join(SHIP, 'kit_street', piece + '.webp')).convert('RGB'))[:364, :515]
        if '_ew' in piece: walk = (ym < 1.5) | (ym > 10.5); near = (ym < 1.75) | (ym > 10.25)
        elif '_ns' in piece: walk = (xm < 1.5) | (xm > 10.5); near = (xm < 1.75) | (xm > 10.25)
        else: walk = near = np.zeros((364, 515), bool)
        L = kit.astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
        paint = (blur(L, 1.6) > 88) & ~near
        out[y0:y0 + 364, x0:x0 + 515] = np.where(walk, ID['concrete'], np.where(paint, ID['paint'], ID['asphalt']))
    return out


def lawn_mask(box, shape, seed):
    """COOK TWO's watered yard, its edge a lawn's edge (the grass gives out unevenly into the caliche), not a mat"""
    x0, y0, x1, y1 = box; yy, xx = np.mgrid[0:shape[0], 0:shape[1]]
    d = np.minimum.reduce([xx - x0, x1 - xx, (yy - y0) / 0.7071, (y1 - yy) / 0.7071]) / PPM      # metres inside the box
    n = vnoise(shape, 0.8 * PPM, np.random.RandomState(seed)) + vnoise(shape, 0.2 * PPM, np.random.RandomState(seed + 1)) * 0.5
    return d > 0.6 + n * 1.6


def load_plan(bid):
    z = np.load(os.path.join(PLANS, bid.replace('.', '_') + '.npz'))
    ship = np.asarray(Image.open(os.path.join(SHIP, 'block_%s.webp' % bid.replace('.', '_'))).convert('RGB'))
    gid = z['gid'].copy(); lum = z['lum']; keep = z['keep']
    st = street_ids(bid, ship)
    gid[st != 255] = st[st != 255]; kit = st != 255; keep = keep | kit     # a street tile is ground, every pixel of it
    import bohemia_cook2_the_fight_floor_10_19_26 as C2
    if bid in C2.LAWN:                                         # COOK TWO's one watered yard, kept
        gid[lawn_mask(C2.LAWN[bid], gid.shape, 23) & (gid == ID['caliche'])] = ID['lawn']
    ground = (gid != 255) & keep
    return gid, ground, lum, ship, kit


def fill_nearest(gid):
    """under a house there is ground too: each not-ground pixel takes the nearest ground's id (row then column sweeps),
    so the 3D ground is whole and nothing at a house's edge reads as a hole"""
    g = gid.copy()
    for _ in range(2):
        for axis in (1, 0):
            a = np.moveaxis(g, axis, 0).copy()
            for rng in (range(1, a.shape[0]), range(a.shape[0] - 2, -1, -1)):
                for i in rng:
                    j = i - 1 if rng.step == 1 else i + 1
                    m = a[i] == 255; a[i][m] = a[j][m]
            g = np.moveaxis(a, 0, axis)
    g[g == 255] = ID['caliche']
    return g


# ---- numpy noise in metres -------------------------------------------------------------------------------------------
def vnoise(shape, cell_px, rng):
    gh, gw = int(shape[0] / cell_px) + 3, int(shape[1] / cell_px) + 3
    small = Image.fromarray(rng.rand(gh, gw).astype(np.float32), mode='F')
    big = np.asarray(small.resize((int(gw * cell_px), int(gh * cell_px)), Image.BICUBIC))
    return big[:shape[0], :shape[1]] - 0.5


def blur(a, px):
    """a gaussian of sigma px, as three box passes a side (float, edges held)"""
    a = a.astype(np.float32); r = max(1, int(round(px * 0.87)))
    for axis in (0, 1):
        for _ in range(3):
            p = np.pad(a, [(r + 1, r) if ax == axis else (0, 0) for ax in range(2)], mode='edge')
            c = np.cumsum(p, axis=axis, dtype=np.float64)
            a = ((np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis) - np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)) / (2 * r + 1)).astype(np.float32)
    return a


def heights(g, rng):
    """the ground's heights on the grid (g: ids on the grid, rows north to south): the curb is sharp, the dirt is soft"""
    H0 = np.zeros(g.shape, np.float32)
    for n, k in ID.items(): H0[g == k] = MATS[n]['h']
    sharp = np.isin(g, [ID['asphalt'], ID['paint'], ID['concrete'], ID['gutter']])
    soft = blur(H0, 0.45 / STEP)
    h = np.where(sharp, H0, soft)
    # the desert rolls, the yard is lumpy, the rough is heaped, the wash bed is flat
    amp = np.zeros(g.shape, np.float32)
    for n, a in (('desert', 0.045), ('caliche', 0.012), ('rough', 0.05), ('track', 0.02), ('playa', 0.006), ('lawn', 0.01)):
        amp[g == ID[n]] = a
    amp = blur(amp, 0.3 / STEP)
    h += amp * (vnoise(g.shape, 1.6 / STEP, rng) * 1.6 + vnoise(g.shape, 0.35 / STEP, rng) * 0.6)
    # the walk's panels heave on each other (a five-foot panel, a centimetre)
    ys, xs = np.mgrid[0:g.shape[0], 0:g.shape[1]]
    pid = ((xs * STEP) // 1.5).astype(np.int64) * 7919 + ((ys * STEP) // 1.5).astype(np.int64)
    heave = (np.sin(pid * 12.9898) * 43758.5453) % 1.0 - 0.5
    h += np.where(g == ID['concrete'], heave * 0.022, 0)
    # the road sags in its wheel paths and holds a few potholes
    road = np.isin(g, [ID['asphalt'], ID['paint']])
    h += np.where(road, vnoise(g.shape, 2.5 / STEP, rng) * 0.02, 0)
    pots = np.zeros(g.shape, np.float32)
    rr = np.argwhere(road[::8, ::8]) * 8
    if len(rr):
        for y, x in rr[rng.choice(len(rr), min(len(rr), max(1, int(road.sum() * STEP * STEP / 70))), replace=False)]:
            r = rng.uniform(0.18, 0.5) / STEP; yy, xx = np.ogrid[-int(r) - 1:int(r) + 2, -int(r) - 1:int(r) + 2]
            d = np.sqrt(yy * yy + xx * xx) / r
            w = np.clip(1.0 - d ** 3, 0, 1) * rng.uniform(0.035, 0.07)
            y0, x0 = max(0, y - int(r) - 1), max(0, x - int(r) - 1)
            sl = pots[y0:y + int(r) + 2, x0:x + int(r) + 2]
            sl[:] = np.maximum(sl, w[:sl.shape[0], :sl.shape[1]])
    h -= pots * road
    return h, pots


# ---- the Blender scene -----------------------------------------------------------------------------------------------
class NT:
    def __init__(s, m):
        s.t = m.node_tree; s.n = s.t.nodes; s.co = None
    def new(s, typ, **kw):
        n = s.n.new(typ)
        for k, v in kw.items():
            if k.startswith('_'): setattr(n, k[1:], v)
            else: n.inputs[k].default_value = v
        return n
    def link(s, a, b): s.t.links.new(a, b)
    def coords(s, per_m, off=(0, 0, 0)):
        if s.co is None: s.co = s.new('ShaderNodeTexCoord')
        mp = s.new('ShaderNodeMapping', _vector_type='POINT'); mp.inputs['Scale'].default_value = (per_m,) * 3
        mp.inputs['Location'].default_value = off
        s.link(s.co.outputs['Object'], mp.inputs['Vector']); return mp.outputs['Vector']
    def noise(s, per_m, detail=3.0, rough=0.55, off=(0, 0, 0)):
        n = s.new('ShaderNodeTexNoise', Scale=1.0, Detail=detail, Roughness=rough); s.link(s.coords(per_m, off), n.inputs['Vector']); return n.outputs['Fac']
    def math(s, op, a, b=None, clamp=False):
        n = s.new('ShaderNodeMath', _operation=op, _use_clamp=clamp)
        for i, v in enumerate((a, b)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: s.link(v, n.inputs[i])
        return n.outputs[0]
    def ramp(s, x, a, b, lo=0.0, hi=1.0):
        n = s.new('ShaderNodeMapRange', _clamp=True); n.inputs['From Min'].default_value = a; n.inputs['From Max'].default_value = b
        n.inputs['To Min'].default_value = lo; n.inputs['To Max'].default_value = hi; s.link(x, n.inputs['Value']); return n.outputs['Result']
    def mix(s, fac, c1, c2, blend='MIX'):
        n = s.new('ShaderNodeMixRGB', _blend_type=blend)
        for sock, v in ((n.inputs['Fac'], fac), (n.inputs['Color1'], c1), (n.inputs['Color2'], c2)):
            if isinstance(v, (int, float)): sock.default_value = v
            elif isinstance(v, tuple): sock.default_value = v if len(v) == 4 else tuple(v) + (1.0,)
            else: s.link(v, sock)
        return n.outputs['Color']
    def edges(s, cell_m, width_m, distort=0.0, off=(0, 0, 0)):
        """a crack network: the voronoi cell edges (distance to edge in cell units), thin lines width_m wide"""
        v = s.new('ShaderNodeTexVoronoi', _feature='DISTANCE_TO_EDGE', Scale=1.0)
        vec = s.coords(1.0 / cell_m, off)
        if distort:
            nz = s.new('ShaderNodeTexNoise', Scale=2.0, Detail=2.0); s.link(vec, nz.inputs['Vector'])
            sub = s.new('ShaderNodeVectorMath', _operation='SUBTRACT'); s.link(nz.outputs['Color'], sub.inputs[0]); sub.inputs[1].default_value = (0.5, 0.5, 0.5)
            sc = s.new('ShaderNodeVectorMath', _operation='SCALE'); s.link(sub.outputs[0], sc.inputs[0]); sc.inputs['Scale'].default_value = distort
            ad = s.new('ShaderNodeVectorMath', _operation='ADD'); s.link(vec, ad.inputs[0]); s.link(sc.outputs[0], ad.inputs[1]); vec = ad.outputs[0]
        s.link(vec, v.inputs['Vector'])
        return s.ramp(v.outputs['Distance'], width_m / cell_m, 0.0)    # 1 on the line, 0 off it


def cal_mul():
    return json.load(open(CAL))['mul'] if os.path.exists(CAL) else {}


def ground_material(bpy, name):
    spec = MATS[name]; cal = cal_mul().get(name, 1.0)
    m = bpy.data.materials.new('ground_' + name); m.use_nodes = True
    T = NT(m); b = T.n['Principled BSDF']
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Metallic'].default_value = 0.0; b.inputs['Specular IOR Level'].default_value = 0.0
    seed = (sum(map(ord, name)) % 97) * 1.37
    base = tuple(min(1.0, c * cal) for c in role_lin(*spec['role'])); alt = tuple(min(1.0, c * cal) for c in role_lin(*spec['alt']))
    if spec.get('green'):                                   # the watered lawn: the olive pushed to grass, never glowing
        base = (base[0] * (1 - spec['green']), base[1] * (1 + spec['green'] * 0.6), base[2] * (1 - spec['green'])); alt = base
    col = T.mix(T.math('MULTIPLY', T.noise(0.7, 3, 0.5, (seed, 0, 0)), spec['alt_amt'] * 2, clamp=True), base, alt)
    # the grit: a value step in metres (two to three pixels), and the speck: single stones of the aggregate, cell colours
    g1 = T.ramp(T.noise(30.0, 2, 0.6, (seed, 3, 0)), 0.3, 0.7, 1 - spec['grit'], 1 + spec['grit'])
    vor = T.new('ShaderNodeTexVoronoi', Scale=1.0); T.link(T.coords(spec['speck'][0], (0, seed, 0)), vor.inputs['Vector'])
    sp = T.new('ShaderNodeSeparateColor'); T.link(vor.outputs['Color'], sp.inputs['Color'])
    g2 = T.ramp(sp.outputs['Red'], 0.0, 1.0, 1 - spec['speck'][1], 1 + spec['speck'][1])
    val = T.math('MULTIPLY', g1, g2)
    height = T.math('MULTIPLY', T.noise(30.0, 2, 0.5), 0.3)
    dark = None
    def darken(mask, mul):
        nonlocal dark
        d = T.math('SUBTRACT', 1.0, T.math('MULTIPLY', mask, 1.0 - mul))
        dark = d if dark is None else T.math('MULTIPLY', dark, d)
    if 'cracks' in spec:
        c = spec['cracks']
        region = T.ramp(T.noise(c['region'], 2, 0.5, (seed, 9, 0)), c['cut'], c['cut'] + 0.06)
        cr = T.math('MULTIPLY', T.edges(c['cell'], c['width'], 0.35, (seed, 0, 5)), region)
        darken(cr, 0.25); height = T.math('SUBTRACT', height, T.math('MULTIPLY', cr, c['depth']))
    if 'long_cracks' in spec:
        c = spec['long_cracks']
        lc = T.edges(c['cell'], c['width'], 0.6, (seed, 4, 1))
        darken(lc, 0.3); height = T.math('SUBTRACT', height, T.math('MULTIPLY', lc, 0.6))
    if 'patches' in spec:
        p = spec['patches']; v = T.new('ShaderNodeTexVoronoi', Scale=1.0); T.link(T.coords(p['scale'], (seed, 7, 0)), v.inputs['Vector'])
        sp2 = T.new('ShaderNodeSeparateColor'); T.link(v.outputs['Color'], sp2.inputs['Color'])
        darken(T.ramp(sp2.outputs['Green'], p['cut'], p['cut'] + 0.01), p['mul'])
    if 'oil' in spec:
        o = spec['oil']; darken(T.ramp(T.noise(o['scale'], 3, 0.6, (seed, 11, 0)), o['cut'], o['cut'] + 0.08), o['mul'])
    if 'joints' in spec:
        j = spec['joints']
        dist = []
        for axis in ('X', 'Y'):
            sep = T.new('ShaderNodeSeparateXYZ'); T.link(T.coords(1.0), sep.inputs[0])
            f = T.math('PINGPONG', sep.outputs[axis], j['pitch'] / 2)            # 0 on a joint, pitch/2 mid-panel
            dist.append(f)
        jn = T.ramp(T.math('MINIMUM', dist[0], dist[1]), j['width'], 0.0)
        darken(jn, 0.45); height = T.math('SUBTRACT', height, T.math('MULTIPLY', jn, 1.0))
        snap = T.new('ShaderNodeVectorMath', _operation='SNAP'); T.link(T.coords(1.0), snap.inputs[0]); snap.inputs[1].default_value = (j['pitch'],) * 3
        wn = T.new('ShaderNodeTexWhiteNoise', _noise_dimensions='3D'); T.link(snap.outputs[0], wn.inputs['Vector'])
        val = T.math('MULTIPLY', val, T.ramp(wn.outputs['Value'], 0, 1, 1 - spec['panel_var'], 1 + spec['panel_var']))
    if 'mud' in spec:
        mu = spec['mud']; e = T.edges(mu['cell'], mu['width'], 0.25, (seed, 2, 2))
        darken(e, 0.35); height = T.math('SUBTRACT', height, T.math('MULTIPLY', e, mu['depth']))
    if 'wornthrough' in spec:
        wt = spec['wornthrough']; worn = T.ramp(T.noise(wt['scale'], 4, 0.65, (seed, 5, 5)), wt['cut'] + 0.1, wt['cut'])   # 1 where the noise is under the cut
        col = T.mix(worn, col, tuple(c * cal_mul().get('asphalt', 1.0) for c in role_lin(*wt['to'])))
    # the gutter: sand blown against the curb (the 'gutter' attribute, 1 at the curb's foot)
    if name in ('asphalt', 'paint', 'gutter'):
        at = T.new('ShaderNodeAttribute', _attribute_name='gutter')
        sand = T.math('MULTIPLY', at.outputs['Fac'], T.ramp(T.noise(3.0, 3, 0.6, (seed, 1, 9)), 0.3, 0.6, 0.35, 0.95))
        col = T.mix(sand, col, tuple(c * cal_mul().get('caliche', 1.0) for c in role_lin('clay_bone', 2)))
    if spec.get('pot'):                                       # the pothole's floor: the road's gravel base, pale and dusty
        pa = T.new('ShaderNodeAttribute', _attribute_name='pot')
        col = T.mix(T.math('MULTIPLY', pa.outputs['Fac'], 0.85, clamp=True), col, tuple(c * cal_mul().get('caliche', 1.0) * 0.8 for c in role_lin('clay_bone', 1)))
    if dark is not None: val = T.math('MULTIPLY', val, dark)
    vv = T.new('ShaderNodeCombineColor'); [T.link(val, vv.inputs[i]) for i in range(3)]
    col = T.mix(1.0, col, vv.outputs['Color'], 'MULTIPLY')
    T.link(col, b.inputs['Base Color'])
    bump = T.new('ShaderNodeBump', Strength=0.6, Distance=0.01); T.link(height, bump.inputs['Height']); T.link(bump.outputs['Normal'], b.inputs['Normal'])
    m['palette_role'] = spec['role'][0]; m['palette_step'] = spec['role'][1]
    return m


def stone_material(bpy, kind):
    role, step = STONE_MATS[kind]; cal = cal_mul().get('caliche', 1.0)
    m = bpy.data.materials.new('stone_' + kind); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = tuple(min(1, c * cal) for c in role_lin(role, step)) + (1,)
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Specular IOR Level'].default_value = 0.0
    m['palette_role'] = role; m['palette_step'] = step
    return m


def grid_mesh(bpy, g, h, gutter, mats, pots=None):
    """the ground as one mesh: a vertex every STEP metres (two pixels), x east, y north, the face's material from the plan"""
    ny, nx = g.shape
    xs = np.arange(nx, dtype=np.float32) * STEP - 1.0
    ys = (SIDE + 1.0) - np.arange(ny, dtype=np.float32) * STEP
    X, Y = np.meshgrid(xs, ys)
    co = np.stack([X, Y, h], -1).reshape(-1, 3)
    me = bpy.data.meshes.new('ground')
    me.vertices.add(len(co)); me.vertices.foreach_set('co', co.ravel())
    i = np.arange(ny * nx).reshape(ny, nx)
    q = np.stack([i[1:, :-1], i[1:, 1:], i[:-1, 1:], i[:-1, :-1]], -1).reshape(-1, 4)   # counter-clockwise from above: up normals
    me.loops.add(q.size); me.loops.foreach_set('vertex_index', q.ravel())
    me.polygons.add(len(q)); me.polygons.foreach_set('loop_start', np.arange(0, q.size, 4))
    me.update(calc_edges=True)
    fid = g[1:, 1:]
    for n in IDS: me.materials.append(mats[n])
    me.polygons.foreach_set('material_index', fid.ravel().astype(np.int32))
    me.polygons.foreach_set('use_smooth', np.ones(len(q), bool))
    at = me.attributes.new('gutter', 'FLOAT', 'POINT'); at.data.foreach_set('value', gutter.ravel().astype(np.float32))
    pt = me.attributes.new('pot', 'FLOAT', 'POINT')
    pt.data.foreach_set('value', (np.clip(pots / 0.03, 0, 1) if pots is not None else np.zeros(g.shape)).ravel().astype(np.float32))
    o = bpy.data.objects.new('ground', me); bpy.context.scene.collection.objects.link(o)
    return o


def ico(bpy):
    import bmesh
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
    v = np.array([x.co[:] for x in bm.verts], np.float32); f = np.array([[l.index for l in fc.verts] for fc in bm.faces], np.int32)
    bm.free(); return v, f


def stones_mesh(bpy, name, pts, sizes, zs, rng, tpl, mat, flat=0.55):
    v0, f0 = tpl; n = len(pts)
    if not n: return None
    ang = rng.uniform(0, 2 * np.pi, n)
    sx = sizes * rng.uniform(0.8, 1.25, n); sy = sizes * rng.uniform(0.6, 1.0, n); sz = sizes * flat * rng.uniform(0.6, 1.1, n)
    jit = 1.0 + (rng.rand(n, len(v0), 3) - 0.5) * 0.45                 # every stone its own lump
    v = v0[None] * jit
    v = v * np.stack([sx, sy, sz], -1)[:, None, :] / 2
    c, s = np.cos(ang)[:, None], np.sin(ang)[:, None]
    vx = v[..., 0] * c - v[..., 1] * s; vy = v[..., 0] * s + v[..., 1] * c
    v = np.stack([vx + pts[:, 0:1], vy + pts[:, 1:2], v[..., 2] + zs[:, None] + sz[:, None] * 0.12], -1).reshape(-1, 3)
    f = (f0[None] + (np.arange(n) * len(v0))[:, None, None]).reshape(-1, 3)
    me = bpy.data.meshes.new(name); me.vertices.add(len(v)); me.vertices.foreach_set('co', v.astype(np.float32).ravel())
    me.loops.add(f.size); me.loops.foreach_set('vertex_index', f.ravel()); me.polygons.add(len(f)); me.polygons.foreach_set('loop_start', np.arange(0, f.size, 3))
    me.update(calc_edges=True); me.polygons.foreach_set('use_smooth', np.ones(len(f), bool)); me.materials.append(mat)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o


def scatter(g, h, gutter, rng, tpl, smats, bpy):
    objs = []; ny, nx = g.shape
    area = STEP * STEP
    for where, kinds in STONES.items():
        sel = (gutter > 0.55) & np.isin(g, [ID['asphalt']]) if where == 'gutter' else (g == ID[where])
        cells = np.argwhere(sel)
        if not len(cells): continue
        for dens, lo, hi, kind in kinds:
            n = int(len(cells) * area * dens)
            if n < 1: continue
            pick = cells[rng.randint(0, len(cells), n)]
            pts = np.stack([pick[:, 1] * STEP - 1.0 + rng.rand(n) * STEP, (SIDE + 1.0) - pick[:, 0] * STEP - rng.rand(n) * STEP], -1)
            sizes = lo * (hi / lo) ** (rng.rand(n) ** 1.8)                 # many small, a few big
            zs = h[pick[:, 0], pick[:, 1]]
            objs.append(stones_mesh(bpy, 'stones_%s_%s' % (where, kind), pts, sizes, zs, rng, tpl, smats[kind], 0.7 if kind in ('rubble', 'brick') else 0.55))
    return [o for o in objs if o]


def to_grid(a, nearest=True):
    """a W x H picture plan to the ground grid (rows north to south, a vertex every two pixels, 1 m apron each side)"""
    ny = int(round((SIDE + 2) / STEP)) + 1; nx = ny
    ys = (SIDE + 1.0) - np.arange(ny) * STEP; xs = np.arange(nx) * STEP - 1.0
    r = np.clip(((SIDE - ys) / SIDE * H).astype(int), 0, H - 1); c = np.clip((xs / SIDE * W).astype(int), 0, W - 1)
    return a[r][:, c]


def build(bpy, gid_full, seed, quick=False):
    rng = np.random.RandomState(seed)
    g = to_grid(fill_nearest(gid_full))
    # THE GUTTER PAN: Clark County's curb and gutter is an L, a concrete pan 0.45 m wide at the road's edge under every curb
    curbside = (g == ID['concrete']).astype(np.float32)
    near = blur(curbside, 0.18 / STEP) > 0.02
    pan = near & (g == ID['asphalt'])
    for _ in range(int(0.45 / STEP)):                         # grow the pan out from the curb, two pixels a step
        grow = np.zeros_like(pan); grow[1:] |= pan[:-1]; grow[:-1] |= pan[1:]; grow[:, 1:] |= pan[:, :-1]; grow[:, :-1] |= pan[:, 1:]
        pan |= grow & (g == ID['asphalt'])
    g[pan] = ID['gutter']
    h, pots = heights(g, rng)
    gutter = np.clip(blur(np.isin(g, [ID['gutter']]).astype(np.float32), 0.25 / STEP) * 2.0, 0, 1) * np.isin(g, [ID['asphalt'], ID['paint'], ID['gutter']])
    mats = {n: ground_material(bpy, n) for n in IDS}
    o = grid_mesh(bpy, g, h, gutter, mats, pots)
    tpl = ico(bpy); smats = {k: stone_material(bpy, k) for k in STONE_MATS}
    objs = [o] + ([] if quick else scatter(g, h, gutter, rng, tpl, smats, bpy))
    return objs, g


def camera(bpy, sc, quick=False):
    import mathutils
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = W / PPM
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(float(RIG.G['tilt_deg'])); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((SIDE / 2, SIDE / 2, 0)); d = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - d * 80; cd.clip_end = 400
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 25 if quick else 100


def scene(bpy, objs):
    """THE RIG: the source pass and the dents on every mesh, then the vertical stretch under the 45 camera"""
    # a road is swept by every wheel that crosses it: the dust and the chips on the asphalt and its paint at a share, the
    # rig's own wear_by_material mechanism (the guide carries hair, skin and eye; the ground's two are recorded in rig.json)
    RIG.G['wear_by_material'] = dict(RIG.G['wear_by_material'], **ROAD_WEAR)
    src = RIG.source_pass(objs, WEAR, 1.0, 0)
    RIG.dent_pass(objs, 1.0)
    # the source pass's occlusion and bevel nodes cast 8 rays each per camera sample; a pixel averages them over every
    # camera sample anyway, so one each is the same picture in expectation at an eighth of the rays
    for m in {s.material for o in objs for s in o.material_slots if s.material}:
        for n in m.node_tree.nodes:
            if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in objs: o.scale = (1, 1, zs)
    return src


# ---- THE HOUSES (row two's ranches, in the fight's suburb blocks) -----------------------------------------------------
HOUSE_KINDS = ('subs', 'corner', 'culdesac', 'suburb_stem')
RANCH_W = {'ranch_plain': 11.0, 'ranch_porch': 12.0, 'ranch_wing': 14.3}     # each kind's width over its eaves, m
# a Las Vegas tract's stucco and roofs, as shades of the palette base (never orange: his 10/17 'more tan'): the pale tan,
# a sand beige, a light grey, a cream, a sage; roofs tan, grey-brown, darker brown, grey
WALL_TINTS = [(1.0, 1.0, 1.0), (1.04, 0.98, 0.93), (0.95, 0.97, 1.0), (1.05, 1.02, 0.9), (0.96, 1.0, 0.94)]
ROOF_TINTS = [(1.0, 1.0, 1.0), (0.9, 0.9, 0.92), (0.82, 0.78, 0.74), (0.92, 0.93, 0.95)]


def old_houses(gid):
    """the block's old houses: the not-ground pieces that are whole rectangles 8 to 13 m wide and 6 to 9 m tall on the
    screen (measured on corner.1, subs.0, culdesac.0, suburb_stem.0: every house is one, fill 0.99 to 1.00; walls, lamps
    and the cul-de-sac's ring are not)"""
    m = (gid == 255)[::4, ::4]; lab = np.zeros(m.shape, np.int32); n = 0; out = []
    Hh, Ww = m.shape
    for y in range(Hh):
        for x in range(Ww):
            if m[y, x] and not lab[y, x]:
                n += 1; st = [(y, x)]; lab[y, x] = n; ys, xs = [], []
                while st:
                    cy, cx = st.pop(); ys.append(cy); xs.append(cx)
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < Hh and 0 <= nx < Ww and m[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; st.append((ny, nx))
                x0, y0, x1, y1 = min(xs) * 4, min(ys) * 4, (max(xs) + 1) * 4, (max(ys) + 1) * 4
                w, h = (x1 - x0) / PPM, (y1 - y0) / PPM; fill = len(ys) * 16 / ((x1 - x0) * (y1 - y0))
                if 8 <= w <= 13 and 6 <= h <= 9 and fill > 0.9: out.append((x0, y0, x1, y1))
    return out


def place_houses(bpy, houses, seed):
    """a ranch of COOK FOUR's family on each old house's footprint: centred on it, its front wall on the old facade's
    ground line, the kind the width allows (plain or porch, the L where it is wide), its fence left out (the block has its
    own); depth x 0.82 so the roof stays inside its own house tile. Returns the meshes and their parents."""
    import mathutils
    import bohemia_cook_model_buildings as BLD
    rnd = np.random.RandomState(seed); meshes, roots, rects, kinds = [], [], [], []
    for i, (x0, y0, x1, y1) in enumerate(houses):
        w = (x1 - x0) / PPM
        fits = [k for k, kw in RANCH_W.items() if 0.80 <= w / kw <= 1.15]
        kind = fits[rnd.randint(len(fits))] if fits else 'ranch_plain'
        if i and kinds and kinds[-1] == kind and len(fits) > 1: kind = [k for k in fits if k != kind][rnd.randint(len(fits) - 1)]   # no two side by side the same
        s_ = w / RANCH_W[kind]
        before = set(bpy.context.scene.objects)
        BLD.TINT = dict(stucco=WALL_TINTS[rnd.randint(len(WALL_TINTS))], pale=WALL_TINTS[rnd.randint(len(WALL_TINTS))], roof=ROOF_TINTS[rnd.randint(len(ROOF_TINTS))])
        BLD.M.clear(); BLD.BUILDERS[kind](bpy, mathutils); BLD.TINT = {}
        new = [o for o in bpy.context.scene.objects if o not in before]
        for o in [o for o in new if '_fence' in o.name]: new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        xc = (x0 + x1) / 2 / PPM; yfront = SIDE * (1 - y1 / H)
        root = bpy.data.objects.new('house_%d' % i, None); bpy.context.scene.collection.objects.link(root)
        for o in new:
            if o.parent is None: o.parent = root
        root.location = (xc, yfront + 4.0 * 0.82 * s_, 0.0); root.scale = (s_, 0.82 * s_, s_)
        meshes += [o for o in new if o.type == 'MESH']; roots.append(root); kinds.append(kind)
        rects.append((x0, y0, x1, y1))
    return meshes, roots, rects, kinds


def render_block(bid, quick=False, region=None):
    import bpy
    t0 = time.time()
    gid, ground, lum, ship, kit = load_plan(bid)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    objs, g = build(bpy, gid, 1019 + sum(map(ord, bid)), quick)
    houses = old_houses(gid) if bid.split('.')[0] in HOUSE_KINDS and not quick else []
    hmesh, hroots, hrects, hkinds = place_houses(bpy, houses, 31 + sum(map(ord, bid))) if houses else ([], [], [], [])
    if hmesh:                                                 # the houses are buildings: the guide's own wear, 0.6
        RIG.source_pass(hmesh, float(RIG.G['wear']), 1.0, 0); RIG.dent_pass(hmesh, 1.0)
        for m in {s.material for o in hmesh for s in o.material_slots if s.material}:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
        zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
        for r in hroots: r.scale = (r.scale[0], r.scale[1], r.scale[2] * zs)
    src = scene(bpy, objs)
    A = dict(sun_rot=list(RIG.G['sun_rot_deg']))
    RIG.light_and_film(sc, A)
    sc.render.film_transparent = False
    camera(bpy, sc, quick)
    # THE GROUND'S SAMPLES: the guide's 128 put a block at half an hour (11 s a sample, measured on corner.1); a block is a
    # flat field under one sun, seen at a third of its pixels on the opening camera, so 32 adaptive samples and one diffuse
    # bounce (the fill is the sky's, not the ground's): recorded in blocks.json, a ground setting, not the rig's
    sc.cycles.samples = 16 if quick else GROUND_SAMPLES
    sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    os.makedirs(RENDER, exist_ok=True)
    if region:                                                # a test window of the block, at full pixels (the floor bar's own read)
        x0, y0, x1, y1 = region; sc.render.use_border = True; sc.render.use_crop_to_border = True
        sc.render.border_min_x, sc.render.border_max_x = x0 / W, x1 / W; sc.render.border_min_y, sc.render.border_max_y = 1 - y1 / H, 1 - y0 / H
    fn = os.path.join(RENDER, '%s%s.png' % (bid.replace('.', '_'), '_quick' if quick else ('_region' if region else '')))
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
    print('  rendered', bid, round(time.time() - t0), 's', flush=True)
    if quick: return fn
    if region:
        x0, y0, x1, y1 = region; r = np.asarray(Image.open(fn).convert('RGB'))
        full = ship.copy(); full[y0:y0 + r.shape[0], x0:x0 + r.shape[1]] = r
        o = compose(bid, full, gid, ground, lum, ship, kit, hrects)[y0:y1, x0:x1]
        Image.fromarray(o).save(fn.replace('.png', '_composed.png')); return fn
    out = compose(bid, np.asarray(Image.open(fn).convert('RGB')), gid, ground, lum, ship, kit, hrects)
    Image.fromarray(out).save(os.path.join(OUT, 'block_%s.webp' % bid.replace('.', '_')), lossless=True, quality=100, method=4)
    led = os.path.join(OUT, 'blocks.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[bid] = dict(seconds=round(time.time() - t0), ground_share=round(float(ground.mean()), 4), wear=WEAR, samples=int(sc.cycles.samples),
                  meshes=len(objs), vertices=sum(len(o.data.vertices) for o in objs), houses=[dict(kind=k, old_px=list(map(int, r))) for k, r in zip(hkinds, hrects)])
    json.dump(L, open(led, 'w'), indent=1)
    return fn


def compose(bid, rend, gid, ground, lum, ship, kit, hrects=()):
    """the new ground where the plan says ground; the shipped pixels everywhere else (houses, walls, lamps: rows two and
    three); the maker's own house shadows laid on the new ground as darkness, the hue walking cool (COOK TWO's shadow())"""
    import bohemia_cook2_the_fight_floor_10_19_26 as C2
    out = ship.copy()
    if hrects:                                                # the 3D houses stand in their own light: no old house, no old shadow
        keep_old = (gid == 255)
        for x0, y0, x1, y1 in hrects:                          # each new house over its old one, its roof up to 3 m higher
            keep_old[max(0, y0 - int(3.0 * PPM)):y1 + 6, max(0, x0 - 20):x1 + 20] = False
        out[~keep_old] = rend[~keep_old]
        return out
    mult = lum.astype(np.float32) / 255.0
    plan_ground = ground & ~kit                               # the street kit's pixels carry no maker shadow
    m = np.where(plan_ground, np.clip(mult, 0.35, 1.0), 1.0)
    px = rend[ground]
    out[ground] = C2.shadow(px, m[ground]) if (m[ground] < 0.985).any() else px
    return out


# ---- the colours: one flat patch of each ground through the same rig, measured against his YES street ----------------
def calibrate_colours(rounds=2):
    import bpy
    for it in range(rounds):
        gid = np.zeros((H, W), np.uint8)
        bands = list(IDS); bw = W // len(bands)
        for i, n in enumerate(bands): gid[:, i * bw:(i + 1) * bw] = ID[n]
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        rng = np.random.RandomState(7)
        g = to_grid(gid); h = np.zeros(g.shape, np.float32)
        mats = {n: ground_material(bpy, n) for n in IDS}
        o = grid_mesh(bpy, g, h, np.zeros(g.shape, np.float32), mats)
        scene(bpy, [o]); RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg']))); sc.render.film_transparent = False
        camera(bpy, sc, quick=True); sc.cycles.samples = 32
        fn = os.path.join(RENDER, 'calibration_bands.png'); os.makedirs(RENDER, exist_ok=True)
        sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
        a = np.asarray(Image.open(fn).convert('RGB')).astype(float); sw = a.shape[1] / len(bands)
        cal = json.load(open(CAL)) if os.path.exists(CAL) else dict(mul={})
        rows = {}
        for i, n in enumerate(bands):
            patch = a[a.shape[0] // 4: 3 * a.shape[0] // 4, int(i * sw + sw * 0.2): int((i + 1) * sw - sw * 0.2)].reshape(-1, 3)
            med = np.median(patch, 0); tgt = np.array(MATS[n]['target'], float)
            Lm = med @ [0.299, 0.587, 0.114]; Lt = tgt @ [0.299, 0.587, 0.114]
            k = (lin1(Lt) / max(1e-4, lin1(Lm)))
            cal['mul'][n] = round(cal['mul'].get(n, 1.0) * k, 4)
            rows[n] = dict(render=[int(x) for x in med], target=list(MATS[n]['target']), mul=cal['mul'][n])
        cal['rounds'] = cal.get('rounds', 0) + 1; cal['last'] = rows
        cal['how'] = 'a flat band of each ground through the rig (wear %g, the one sun, the fill), its median sRGB against his YES street\'s; the value multiplier on the palette base that meets it' % WEAR
        json.dump(cal, open(CAL, 'w'), indent=1)
        print('  calibration round', cal['rounds'], json.dumps(rows), flush=True)


# ---- THE KIT FOR THE MAP (RUN): each ground a seamless 12 m tile, straight down, the same materials and the same sun -----
KIT = ['asphalt', 'sidewalk', 'curb', 'dirt', 'sand', 'wash', 'rough', 'track', 'lot', 'lawn', 'roof_shingle', 'roof_gravel']
KIT_IDS = dict(asphalt='asphalt', sidewalk='concrete', dirt='caliche', sand='desert', wash='playa', rough='rough', track='track', lawn='lawn', lot='asphalt')


def render_kit(names=None):
    """a 14 m field of each ground (its stones too) under the rig's sun, seen straight down at 42.9 px a metre; the 2 m it
    runs past the 12 m tile is crossfaded back over its own start, both ways, so the tile lays edge to edge with no seam
    (the curb strip runs east-west and is seamless along it). Straight down, so RUN lays it in the map's own 2:1."""
    import bpy, mathutils
    out_dir = os.path.join(OUT, 'kit'); os.makedirs(out_dir, exist_ok=True)
    T, O = 12.0, 2.0; n_in = int(round((T + O) / STEP)) + int(round(2 / STEP))
    led = {}
    for name in names or KIT:
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; rng = np.random.RandomState(sum(map(ord, name)))
        if name.startswith('roof'):
            import bohemia_cook_model_buildings as BLD
            BLD.M.clear(); mm = BLD.mats(bpy); m = mm['roof' if name == 'roof_shingle' else 'flat']
            bpy.ops.mesh.primitive_plane_add(size=T + O + 2, location=(7.0, 53.0, 0.0)); o = bpy.context.active_object; o.data.materials.append(m)
            if name == 'roof_shingle': o.rotation_euler = (math.radians(18.4), 0, 0)
            objs = [o]; RIG.source_pass(objs, float(RIG.G['wear']), 1.0, 0); RIG.dent_pass(objs, 1.0)
        else:
            g = np.full((n_in, n_in), ID[KIT_IDS.get(name, 'asphalt')], np.uint8)
            yy = (SIDE + 1.0) - np.arange(n_in) * STEP; xx = np.arange(n_in) * STEP - 1.0
            if name == 'curb':                                   # the walk to the north, the curb, the gutter pan, the road
                g[:] = ID['asphalt']; g[yy > 53 + 1.5, :] = ID['concrete']; g[(yy <= 54.5) & (yy > 54.05), :] = ID['gutter']
            if name == 'lot':                                    # an old lot: stalls 3 m wide, 5.5 m deep, the paint worn
                for k in range(-1, 6):
                    sel = (np.abs(xx[None, :] - (k * 3.0 + 1.0)) < 0.06) & (np.abs(yy[:, None] - 53.0) < 2.75); g[sel] = ID['paint']
            if name == 'track':
                for x0 in (5.4, 7.2): g[:, np.abs(xx - x0) < 0.25] = ID['track']; g[:, (np.abs(xx - x0) >= 0.25) & (g[0] == ID['track'])] = ID['desert']
                g[g != ID['track']] = ID['desert']
            h, pots = heights(g, rng)
            gutter = np.clip(blur((g == ID['gutter']).astype(np.float32), 0.25 / STEP) * 2.0, 0, 1) * np.isin(g, [ID['asphalt'], ID['gutter']])
            mats = {n: ground_material(bpy, n) for n in IDS}
            o = grid_mesh(bpy, g, h, gutter, mats, pots)
            tpl = ico(bpy); smats = {k: stone_material(bpy, k) for k in STONE_MATS}
            objs = [o] + scatter(g, h, gutter, rng, tpl, smats, bpy)
            scene(bpy, objs)
        RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg']))); sc.render.film_transparent = False
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = T + O
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        cam.location = (0.0 + (T + O) / 2, 60.0 - (T + O) / 2, 60.0); cam.rotation_euler = (0, 0, 0); cd.clip_end = 200
        res = int(round((T + O) * PPM)); sc.render.resolution_x = sc.render.resolution_y = res
        sc.cycles.samples = GROUND_SAMPLES; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
        sc.cycles.max_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
        fn = os.path.join(RENDER, 'kit_%s.png' % name); os.makedirs(RENDER, exist_ok=True); sc.render.filepath = fn
        bpy.ops.render.render(write_still=True)
        a = np.asarray(Image.open(fn).convert('RGB')).astype(np.float32)
        t, ov = int(round(T * PPM)), res - int(round(T * PPM))
        w = np.linspace(0, 1, ov, dtype=np.float32)
        a2 = a[:, :t].copy(); a2[:, :ov] = a[:, t:t + ov] * (1 - w)[None, :, None] + a[:, :ov] * w[None, :, None]
        if name != 'curb':
            a3 = a2[:t].copy(); a3[:ov] = a2[t:t + ov] * (1 - w)[:, None, None] + a2[:ov] * w[:, None, None]
        else: a3 = a2[:t]
        tile = a3.round().clip(0, 255).astype(np.uint8)
        dst = os.path.join(out_dir, 'COOK_GROUND_%s.webp' % name.upper()); Image.fromarray(tile).save(dst, lossless=True, quality=100, method=4)
        led[name] = dict(file=os.path.relpath(dst, R), px=list(tile.shape[:2][::-1]), metres=T, ppm=round(PPM, 3), seamless='east-west' if name == 'curb' else 'both ways',
                         ground=KIT_IDS.get(name, name))
        print('  kit', name, tile.shape, flush=True)
    kp = os.path.join(out_dir, 'COOK_GROUND_KIT.json'); old = json.load(open(kp)) if os.path.exists(kp) else {}
    old.update(dict(lane='cook', row='[the floor through the rig]', made='10/19', camera='straight down (RUN lays it in the map\'s 2:1)', light='the rig\'s one sun and fill',
                    how='a 14 m field rendered, its 2 m overrun crossfaded back over its start, both ways', tiles=dict(old.get('tiles', {}), **led)))
    json.dump(old, open(kp, 'w'), indent=1)


def rig_check():
    """the rig's own calibration at this ruler: the 1 m cube 43 px, the light on the screen"""
    A = dict(ppm=PPM, tilt=float(RIG.G['tilt_deg']), out=os.path.join(OUT, 'calibration'), sun_rot=list(RIG.G['sun_rot_deg']))
    os.makedirs(A['out'], exist_ok=True)
    c = RIG.calibrate(A); print('  rig calibration', c, flush=True); return c


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'kit':
        render_kit(a[1:] or None)
    elif a and a[0] == 'calibrate':
        if '--colours-only' not in a: rig_check()
        calibrate_colours(int(a[1]) if len(a) > 1 and a[1].isdigit() else 2)
    else:
        quick = '--quick' in a
        region = [int(v) for v in a[a.index('--region') + 1].split(',')] if '--region' in a else None
        bids = [x for i, x in enumerate(a) if not x.startswith('--') and not (i and a[i - 1] == '--region')]
        for b in bids: render_block(b, quick, region)
    sys.stdout.flush(); os._exit(0)
