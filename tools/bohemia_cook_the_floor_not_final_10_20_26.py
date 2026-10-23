#!/usr/bin/env python3
"""BOHEMIA -- COOK [the floor, not final] 10/20/26: THE FIGHT FLOOR DIRTIER, A PLACE PEOPLE LIVED AND LEFT.
His 22nd votes: YES on [the floor through the rig] with 'Not final', and on COMBAT's floor 'Not final looks like dog
shit'. Rule 123 (Paolo 10/20: 'all that energy has to be spent towards just revamping all the 2-D assets into these 3-D
sprites... analog horror Crashbox vibes, go crazy'): no card; the blocks go straight into the fight (same file, same
2575 x 1820, same anchor: every house on its old footprint, every wall, lamp and car where the board's plan has it).

WHAT IT ADDS to last round's floor (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py, imported, never edited):
  * THE GRIME CROSSES EVERY EDGE (Machine Party's lesson, records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1: Klubnika
    'added dirty and grimy leaks to every corner, which blends everything together rather than having different
    objects'). One grime field in WORLD metres goes into every material of the scene after the rig's source pass: the
    ground, the curb, the stones, the houses, the junk. It gathers where things meet (the scene's own occlusion across
    objects, 1.3 m, broken by a leaky mask), so the dirt at a wall's foot is the same dirt as the yard's beside it; it
    runs down every wall in streaks from the eaves; it climbs a wall's base as rising damp and splash; it lies on the
    ground as old oil and wet stains where cars stood; and soot climbs out of the two or three places a fire was lit,
    across ground, curb and wall alike. Never a random two-soil field (his 'camouflage' NO, COOK TWO 10/19): open ground
    with nothing near it stays his YES street's colour.
  * WHAT THEY LEFT: bags out for a pickup that never came (piled at the curb in front of most houses, some split), a
    mattress and a couch dragged to the yard, cardboard, paper and clothes blown into the corners the wind leaves them in
    (along walls, curbs and gutters), dead weeds in the cracks and against the walls, a cold fire ring with its ash,
    a shopping cart on its side (COOK's own cart, imported untouched). All knee-low or lower: the board's terrain is the
    plan's and nothing here stands where a man needs the tile.
  * ANALOG HORROR (rule 20): one house per block has its bags still neatly tied and its yard swept. Nobody is there.

  <venv>/bin/python tools/bohemia_cook_the_floor_not_final_10_20_26.py <block> ...      (about 4 min a block)
  <venv>/bin/python tools/bohemia_cook_the_floor_not_final_10_20_26.py --swap <block> ...  (into slices/fight_ground, lossy 76)
  The plans first: python3 tools/bohemia_cook_the_floor_through_the_rig_plan_10_19_26.py (about 3 min).
  The originals the plan reads (the pre-swap blocks and the board json) are kept in records/target/cook_floor_not_final/orig
  (regenerated from git by --orig <sha>).

REFERENCE CHECK (the 9/4 standing duty): Machine Party's grime (the 8/3 dossier); real abandoned tract streets in the Las
Vegas valley after the 2008 foreclosures (bags at the curb, furniture dragged out on eviction, dead yards, weeds in the
expansion joints); his YES street stays the colour bar. No reference game added.
REUSE CHECK (REUSE-FIRST): the floor tool's plan, ground, stones, houses, rig passes and compose, imported; the rig's
source pass on every new mesh; the props modeller's cart glb; the style palette's roles.
TASTE CHECK: his 'not final' and 'looks like dog shit' on the floor; his 'camouflage' NO stays honoured.
"""
import os, sys, json, math, time, shutil, subprocess
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_floor_through_the_rig_10_19_26 as F

RIG = F.RIG
OUT = os.path.join(R, 'records/target/cook_floor_not_final')
ORIG = os.path.join(OUT, 'orig')
SHIP = os.path.join(R, 'slices/fight_ground')
BASE_SHA = 'c12f16127eb6424f5007babc0f0e6851daf51698'   # the board as it stood before this lane's first swap
F.SHIP = ORIG; F.OUT = OUT; F.RENDER = os.path.join(OUT, 'render')
PAL = F.PAL
ZS = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))

GRIME_TINT = (0.30, 0.255, 0.20)      # the dirt a wall and a yard share: warm, dark, never black
SOOT = (0.05, 0.045, 0.04)


def lin(role, step):
    return F.role_lin(role, step)


# ---- THE GRIME: one field in world metres, into every material ------------------------------------------------------
ROAD_MATS = ('ground_asphalt', 'ground_paint', 'ground_gutter', 'ground_concrete')


def grime_pass(bpy, fires, seed):
    """after the rig's source pass and before the light: every material's colour is multiplied toward the shared dirt
    by one world-space mask. The ground's open middle is left his YES street's colour (no stain field on dirt: his
    'camouflage' NO); the hard ground carries the oil and the wet; every object carries the streaks, the damp and the
    roof's wear; everything carries the dirt where it meets something and the soot where a fire was."""
    done = set()
    for o in bpy.context.scene.objects:
        if o.type != 'MESH': continue
        for slot in o.material_slots:
            m = slot.material
            if not m or m.name in done or not m.use_nodes: continue
            done.add(m.name)
            kind = 'road' if m.name.startswith(ROAD_MATS) else ('dirt' if m.name.startswith('ground_') else 'thing')
            nt = m.node_tree; N = nt.nodes; L = nt.links
            b = next((n for n in N if n.type == 'BSDF_PRINCIPLED'), None)
            if not b: continue
            base = b.inputs['Base Color']
            if base.links: src = base.links[0].from_socket
            else:
                rgb = N.new('ShaderNodeRGB'); rgb.outputs[0].default_value = tuple(base.default_value); src = rgb.outputs[0]

            def math_(op, a, c=None, clamp=False):
                n = N.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
                for i, v in enumerate((a, c)):
                    if v is None: continue
                    if isinstance(v, (int, float)): n.inputs[i].default_value = v
                    else: L.new(v, n.inputs[i])
                return n.outputs[0]

            def ramp(x, a, c, lo=0.0, hi=1.0):
                n = N.new('ShaderNodeMapRange'); n.clamp = True
                n.inputs['From Min'].default_value = a; n.inputs['From Max'].default_value = c
                n.inputs['To Min'].default_value = lo; n.inputs['To Max'].default_value = hi
                L.new(x, n.inputs['Value']); return n.outputs['Result']

            geo = N.new('ShaderNodeNewGeometry')
            pos = geo.outputs['Position']
            sep = N.new('ShaderNodeSeparateXYZ'); L.new(pos, sep.inputs[0])
            nsep = N.new('ShaderNodeSeparateXYZ'); L.new(geo.outputs['Normal'], nsep.inputs[0])
            zreal = math_('DIVIDE', sep.outputs['Z'], ZS)                    # metres above the road (the camera's stretch undone)
            nz = math_('ABSOLUTE', nsep.outputs['Z'])
            vert = ramp(nz, 0.5, 0.15)                                       # 1 on a wall, 0 on the ground and the flats
            slope = math_('MULTIPLY', ramp(nz, 0.25, 0.45), ramp(nz, 0.99, 0.9))   # a roof's pitch

            def noise(per_m, detail=5.0, rough=0.65, stretch=(1, 1, 1), off=(0, 0, 0)):
                mp = N.new('ShaderNodeMapping'); mp.vector_type = 'POINT'
                mp.inputs['Scale'].default_value = tuple(per_m * s for s in stretch)
                mp.inputs['Location'].default_value = tuple(seed * 1.73 + o_ for o_ in off)
                L.new(pos, mp.inputs['Vector'])
                t = N.new('ShaderNodeTexNoise'); t.inputs['Scale'].default_value = 1.0; t.inputs['Detail'].default_value = detail
                t.inputs['Roughness'].default_value = rough; L.new(mp.outputs['Vector'], t.inputs['Vector'])
                return t.outputs['Fac']

            def spots(per_m, r_in, r_out, share, off):
                vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 1.0
                mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (per_m, per_m * 1.6, per_m); mp.inputs['Location'].default_value = (seed * 0.91 + off, 5.0, 0.0)
                L.new(pos, mp.inputs['Vector']); L.new(mp.outputs['Vector'], vo.inputs['Vector'])
                vsep = N.new('ShaderNodeSeparateColor'); L.new(vo.outputs['Color'], vsep.inputs['Color'])
                sp = math_('MULTIPLY', ramp(vo.outputs['Distance'], r_out, r_in), ramp(vsep.outputs['Red'], 1 - share, 1 - share + 0.03))
                return math_('MULTIPLY', sp, ramp(noise(2.6, 4.0, 0.7, off=(off, 9, 0)), 0.28, 0.6, 0.35, 1.0))

            # 1. WHERE THINGS MEET (every kind): the scene's occlusion across objects, broken by a leaky mask so it seeps
            ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 1.6; ao.only_local = False; ao.samples = 1
            meet = ramp(math_('SUBTRACT', 1.0, ao.outputs['AO']), 0.02, 0.38)
            leak = ramp(noise(1.3, 6.0, 0.72), 0.34, 0.66, 0.45, 1.6)
            total = math_('MULTIPLY', meet, leak, clamp=True)
            if kind == 'thing':
                # 2. THE STREAKS off the eaves, the full height of a wall, heavier at the top and the foot
                streak = ramp(noise(2.4, 4.0, 0.62, stretch=(1.0, 1.0, 0.08), off=(3, 1, 0)), 0.45, 0.6)
                streak = math_('MULTIPLY', math_('MULTIPLY', streak, ramp(zreal, 0.6, 2.4, 0.55, 1.0)), vert)
                # 3. RISING DAMP AND SPLASH: a wall's first metre, its upper edge ragged
                damp_h = math_('ADD', 0.5, math_('MULTIPLY', noise(1.6, 3.0, 0.6, off=(7, 2, 0)), 0.8))
                damp = math_('MULTIPLY', ramp(math_('SUBTRACT', damp_h, zreal), 0.0, 0.3), vert)
                # 4. THE ROOF: dark old patches, a broken course here and there, the dust of a desert roof
                roof = math_('MULTIPLY', ramp(noise(0.9, 5.0, 0.7, off=(2, 5, 1)), 0.5, 0.7), math_('MULTIPLY', slope, ramp(zreal, 1.4, 2.0)))
                total = math_('ADD', total, math_('MULTIPLY', streak, 0.9))
                total = math_('ADD', total, math_('MULTIPLY', damp, 0.85))
                total = math_('ADD', total, math_('MULTIPLY', roof, 0.7), clamp=True)
            elif kind == 'road':
                # 5. OIL where cars stood and the WET of a gutter nobody clears: dark spots, longer than wide
                oil = spots(0.42, 0.18, 0.42, 0.42, 0.0)
                wet = math_('MULTIPLY', spots(0.9, 0.12, 0.3, 0.3, 4.0), 0.8)
                total = math_('ADD', total, math_('MULTIPLY', math_('MAXIMUM', oil, wet), 0.9), clamp=True)
            dirt = N.new('ShaderNodeMixRGB'); dirt.blend_type = 'MULTIPLY'; dirt.inputs['Fac'].default_value = 1.0
            dirt.inputs['Color2'].default_value = GRIME_TINT + (1,); L.new(src, dirt.inputs['Color1'])
            mix = N.new('ShaderNodeMixRGB'); mix.blend_type = 'MIX'
            L.new(math_('MULTIPLY', total, 0.92, clamp=True), mix.inputs['Fac']); L.new(src, mix.inputs['Color1']); L.new(dirt.outputs['Color'], mix.inputs['Color2'])
            out = mix.outputs['Color']
            # 6. SOOT where a fire was: a ragged disc on whatever is there, climbing any wall beside it
            for (fx, fy, fr) in fires:
                d = N.new('ShaderNodeVectorMath'); d.operation = 'DISTANCE'; L.new(pos, d.inputs[0]); d.inputs[1].default_value = (fx, fy, 0.0)
                rr = math_('ADD', fr, math_('MULTIPLY', noise(1.1, 4.0, 0.7, off=(fx, fy, 3)), fr * 1.4))
                soot = ramp(math_('SUBTRACT', rr, math_('ADD', d.outputs['Value'], math_('MULTIPLY', zreal, 0.25))), 0.0, 1.2)
                sm = N.new('ShaderNodeMixRGB'); sm.blend_type = 'MIX'; sm.inputs['Color2'].default_value = SOOT + (1,)
                L.new(math_('MULTIPLY', soot, 0.9), sm.inputs['Fac']); L.new(out, sm.inputs['Color1']); out = sm.outputs['Color']
            for l in list(base.links): L.remove(l)
            L.new(out, base)
    return dict(materials=len(done), occlusion_m=1.6, tint=GRIME_TINT, fires=[[round(v, 2) for v in f] for f in fires])


# ---- WHAT THEY LEFT: the junk as meshes ------------------------------------------------------------------------------
CUBE_V = np.array([[x, y, z] for z in (0, 1) for y in (-0.5, 0.5) for x in (-0.5, 0.5)], np.float32)
CUBE_V[:, 2] -= 0.0
CUBE_F = np.array([[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]], np.int32)


def material(bpy, name, role, step, mul=1.0):
    m = bpy.data.materials.new('junk_' + name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = tuple(min(1.0, c * mul) for c in lin(role, step)) + (1,)
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Specular IOR Level'].default_value = 0.0
    m['palette_role'] = role; m['palette_step'] = step
    return m


def instances(bpy, name, tpl, items, mat, jitter=0.0, rng=None):
    """one mesh of many copies of a template: items are (x, y, z, sx, sy, sz, rotz, tilt)"""
    if not items: return None
    v0, f0 = tpl; vs, fs = [], []
    for i, (x, y, z, sx, sy, sz, rz, tilt) in enumerate(items):
        v = v0.copy()
        if jitter and rng is not None: v = v * (1.0 + (rng.rand(*v.shape) - 0.5) * jitter)
        v = v * np.array([sx, sy, sz], np.float32)
        if tilt:                                               # a lean about x (a bag slumped, a box crushed)
            c, s = math.cos(tilt), math.sin(tilt); y_, z_ = v[:, 1] * c - v[:, 2] * s, v[:, 1] * s + v[:, 2] * c; v[:, 1], v[:, 2] = y_, z_
        c, s = math.cos(rz), math.sin(rz); x_, y_ = v[:, 0] * c - v[:, 1] * s, v[:, 0] * s + v[:, 1] * c
        vs.append(np.stack([x_ + x, y_ + y, v[:, 2] + z], -1)); fs.append(f0 + i * len(v0))
    v = np.concatenate(vs).astype(np.float32); f = np.concatenate(fs)
    me = bpy.data.meshes.new(name); me.vertices.add(len(v)); me.vertices.foreach_set('co', v.ravel())
    k = f.shape[1]
    me.loops.add(f.size); me.loops.foreach_set('vertex_index', f.ravel()); me.polygons.add(len(f)); me.polygons.foreach_set('loop_start', np.arange(0, f.size, k))
    me.update(calc_edges=True); me.materials.append(mat)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o


def litter(bpy, g, h, houses, seed):
    """the junk, placed on the plan's grid (g: ground ids, rows north to south, a vertex every STEP metres); never under a
    house (its footprint in metres, the roof's depth behind its front), never in the road's middle"""
    rng = np.random.RandomState(seed); ID = F.ID; STEP = F.STEP; SIDE = F.SIDE
    ico_v, ico_f = F.ico(bpy)
    lump = (ico_v * 0.5 + np.array([0, 0, 0.5], np.float32), ico_f)       # a unit lump sitting on z 0
    box = (CUBE_V, CUBE_F)
    ny, nx = g.shape
    def at(r, c): return (c * STEP - 1.0, (SIDE + 1.0) - r * STEP, float(h[min(max(r, 0), ny - 1), min(max(c, 0), nx - 1)]))
    def cell(x, y):
        c = int(round((x + 1.0) / STEP)); r = int(round(((SIDE + 1.0) - y) / STEP)); return min(max(r, 0), ny - 1), min(max(c, 0), nx - 1)

    # the houses on the grid: x0..x1 east-west, the front wall's line and 9 m behind it (the plan's rects are the old
    # picture's, roof included, so the footprint is the rect's bottom 9 m less a margin)
    under = np.zeros(g.shape, bool); fronts = []
    for (x0, y0, x1, y1) in houses:
        xa, xb = x0 / F.PPM - 0.4, x1 / F.PPM + 0.4; yfront = SIDE * (1 - y1 / F.H)
        ra, ca = cell(xa, yfront + 9.5); rb, cb = cell(xb, yfront - 0.3)
        under[ra:rb + 1, ca:cb + 1] = True; fronts.append((xa + 0.4, xb - 0.4, yfront))
    concrete = (g == ID['concrete']) & ~under; road = np.isin(g, [ID['asphalt'], ID['gutter'], ID['paint']])
    dirt = np.isin(g, [ID['caliche'], ID['desert'], ID['rough'], ID['track'], ID['lawn']]) & ~under
    # where the wind leaves things: within half a metre of a change of ground (the curb, a walk's edge, a house's foot)
    edge = np.zeros(g.shape, bool)
    edge[1:] |= g[1:] != g[:-1]; edge[:-1] |= g[1:] != g[:-1]; edge[:, 1:] |= g[:, 1:] != g[:, :-1]; edge[:, :-1] |= g[:, 1:] != g[:, :-1]
    hedge = np.zeros(g.shape, bool); hedge[1:] |= under[1:] != under[:-1]; hedge[:, 1:] |= under[:, 1:] != under[:, :-1]
    windy = F.blur((edge | hedge).astype(np.float32), 0.35 / STEP) > 0.012
    gutter = np.isin(g, [ID['gutter']])
    objs = []
    bags, bags_open, paper, card, cloth, weeds, mattress, couch, ash, char, deadlawn, paths, bins, tracks = ([] for _ in range(14))
    tidy = rng.randint(len(houses)) if len(houses) else -1
    burnt = (tidy + 1 + rng.randint(max(1, len(houses) - 1))) % len(houses) if len(houses) > 1 else -1
    fires = []
    for i, (xa, xb, yfront) in enumerate(fronts):
        xc = (xa + xb) / 2
        # 4. THE BURNED HOUSE: its front was a fire; the soot climbs its wall and lies on its yard
        if i == burnt:
            fires.append((xc + rng.uniform(-1.5, 1.5), yfront + 0.6, 3.2))
        # the street this house is on: the nearer of the road south of its front and the road north of its back
        best = None
        for step, (x0_, y0_) in ((1, (xc, yfront - 0.6)), (-1, (xc, yfront + 9.8))):
            r, c = cell(x0_, y0_); rr = r
            while 0 < rr < ny - 1 and not concrete[rr, c] and not road[rr, c]: rr += step
            walk_r = rr
            while 0 < rr < ny - 1 and not road[rr, c]: rr += step
            if 0 < rr < ny - 1 and abs(rr - r) * STEP <= 16 and (best is None or abs(rr - r) < best[0]): best = (abs(rr - r), step, r, c, walk_r, rr)
        if best is None: continue
        _, step, r, c, walk_r, rr = best
        # 1. THE WORN PATH from the door to the walk: compacted, darker, a man's width (only where the door faces the street)
        y_w = at(walk_r, c)[1]
        if step == 1 and yfront - y_w > 0.8:
            paths.append((xc + rng.uniform(-1.5, 1.5), (yfront + y_w) / 2, at(r, c)[2] - 0.004, rng.uniform(0.7, 1.0), yfront - y_w + 0.4, 0.012, rng.uniform(-0.08, 0.08), 0.0))
        # 2. THE DEAD LAWN: straw and bare patches across the front yard
        if i != tidy and step == 1 and yfront - y_w > 1.6:
            for _ in range(rng.randint(6, 16)):
                px, py = rng.uniform(xa, xb), rng.uniform(y_w + 0.4, yfront - 0.3)
                if not dirt[cell(px, py)]: continue
                s_ = rng.uniform(0.35, 1.1)
                deadlawn.append((px, py, at(*cell(px, py))[2] - 0.01, s_, s_ * rng.uniform(0.6, 1.0), 0.035, rng.uniform(0, 6.3), 0.0))
        # 3. THE BAGS at the curb, out for a pickup that never came
        if rng.rand() < 0.85 or i == tidy:
            x, y, z = at(rr - step * int(0.55 / STEP), c)
            n = 3 if i == tidy else rng.randint(4, 10)
            for k in range(n):
                s_ = 0.6 if i == tidy else rng.uniform(0.5, 0.78)
                px, py = x + (k - n / 2) * 0.45 + rng.uniform(-0.2, 0.2), y + step * rng.uniform(-0.2, 0.5)
                torn = i != tidy and rng.rand() < 0.35
                (bags_open if torn else bags).append((px, py, z - 0.03, s_ * 1.15, s_, s_ * (0.5 if torn else 0.8), rng.uniform(0, 6.3), 0.0))
                if torn:                                           # what spilled out of it, along the gutter
                    for _ in range(rng.randint(5, 12)):
                        paper.append((px + rng.normal(0, 0.9), py + rng.normal(-0.4 * step, 0.5), z + 0.005, rng.uniform(0.08, 0.32), rng.uniform(0.06, 0.24), 0.012, rng.uniform(0, 6.3), 0.0))
            if i != tidy and rng.rand() < 0.5:                     # a wheelie bin knocked over in the gutter
                bins.append((x + rng.uniform(-2, 2), y - 0.6 * step, z, 0.62, 1.05, 0.62, rng.uniform(-0.4, 0.4) + math.pi / 2 * rng.randint(2), 0.0))
    # 4b. DESIRE LINES across the open dirt (where people walked for years, the short way) and one set of tyre tracks
    open_dirt = np.argwhere(dirt & ~windy)
    def strip(lst, pts, width, z_off=-0.004):
        for (x0_, y0_), (x1_, y1_) in zip(pts[:-1], pts[1:]):
            L_ = math.hypot(x1_ - x0_, y1_ - y0_)
            if L_ < 1e-3: continue
            r_, c_ = cell((x0_ + x1_) / 2, (y0_ + y1_) / 2)
            if under[r_, c_] or road[r_, c_]: continue
            lst.append(((x0_ + x1_) / 2, (y0_ + y1_) / 2, float(h[r_, c_]) + z_off, L_ + width * 0.6, width, 0.004, math.atan2(y1_ - y0_, x1_ - x0_), 0.0))
    if len(open_dirt) > 2000:
        for _ in range(0):                                      # desire lines as strips read as planks (measured 10/20): none
            r0, c0 = open_dirt[rng.randint(len(open_dirt))]; x, y, _z = at(r0, c0)
            a_ = rng.uniform(0, 6.3); pts = [(x, y)]
            for k in range(rng.randint(8, 20)):
                a_ += rng.normal(0, 0.18); x += math.cos(a_) * 1.5; y += math.sin(a_) * 1.5
                if not (0 < x < SIDE and 0 < y < SIDE): break
                pts.append((x, y))
            strip(paths, pts, rng.uniform(0.55, 0.85))
        if rng.rand() < 0.8:
            r0, c0 = open_dirt[rng.randint(len(open_dirt))]; x, y, _z = at(r0, c0)
            a_ = rng.uniform(0, 6.3); A_, B_ = [], []
            for k in range(28):
                a_ += rng.normal(0, 0.05); x += math.cos(a_) * 1.4; y += math.sin(a_) * 1.4
                if not (-2 < x < SIDE + 2 and -2 < y < SIDE + 2): break
                nx_, ny_ = -math.sin(a_) * 0.8, math.cos(a_) * 0.8
                A_.append((x + nx_, y + ny_)); B_.append((x - nx_, y - ny_))
            strip(tracks, A_, 0.3, -0.006); strip(tracks, B_, 0.3, -0.006)
    # 5. THE BIG THINGS dragged out: a mattress, a couch, on a yard or the walk
    yard = np.argwhere(dirt & ~windy) if (dirt & ~windy).any() else np.argwhere(dirt)
    walk = np.argwhere(concrete)
    for kind, n in (('mattress', rng.randint(1, 4)), ('couch', rng.randint(1, 3))):
        for _ in range(n):
            pool = walk if (kind == 'mattress' and rng.rand() < 0.4 and len(walk)) else yard
            if not len(pool): break
            r, c = pool[rng.randint(len(pool))]; x, y, z = at(r, c)
            if kind == 'mattress':
                mattress.append((x, y, z, 1.9, 1.35, 0.18, rng.uniform(0, 6.3), rng.choice([0.0, 0.0, 0.1])))
            else:
                rz = rng.choice([0.0, math.pi / 2, math.pi, -math.pi / 2]) + rng.uniform(-0.3, 0.3)
                ca, sa = math.cos(rz), math.sin(rz)
                couch.append((x, y, z, 2.0, 0.9, 0.42, rz, 0.0))                                   # the seat
                couch.append((x - sa * 0.36, y + ca * 0.36, z + 0.38, 2.0, 0.22, 0.48, rz, 0.0))  # the back
                for side in (-1, 1):
                    couch.append((x + ca * side * 0.92, y + sa * side * 0.92, z + 0.3, 0.2, 0.9, 0.34, rz, 0.0))
    # 6. PAPER, CARDBOARD AND CLOTHES blown into the corners, thickest in the gutter
    wind_cells = np.argwhere(windy & (dirt | concrete | gutter) & ~under)
    area = len(wind_cells) * STEP * STEP
    for lst, dens, lo, hi, thick in ((paper, 0.6, 0.08, 0.32, 0.01), (card, 0.12, 0.25, 0.7, 0.03), (cloth, 0.06, 0.3, 0.8, 0.025)):
        n = int(area * dens)
        if not n or not len(wind_cells): continue
        for r, c in wind_cells[rng.randint(0, len(wind_cells), n)]:
            x, y, z = at(r, c)
            lst.append((x + rng.uniform(0, STEP), y - rng.uniform(0, STEP), z + 0.004, rng.uniform(lo, hi), rng.uniform(lo, hi) * 0.7, thick, rng.uniform(0, 6.3), rng.uniform(-0.15, 0.15)))
    for k in range(int(area * 0.03)):                            # boxes, some still boxes, most crushed
        r, c = wind_cells[rng.randint(len(wind_cells))]; x, y, z = at(r, c); s_ = rng.uniform(0.3, 0.6)
        card.append((x, y, z, s_, s_ * rng.uniform(0.7, 1.2), s_ * rng.choice([0.25, 0.4, 0.8]), rng.uniform(0, 6.3), rng.uniform(-0.2, 0.2)))
    # 6b. THE LOT'S OWN JUNK: thin across all open dirt, what blew out of the corners (a can, a board, a rag)
    open_c = np.argwhere(dirt & ~windy)
    oarea = len(open_c) * STEP * STEP
    for lst, dens, lo, hi, thick in ((paper, 0.03, 0.08, 0.3, 0.01), (card, 0.008, 0.3, 0.9, 0.03), (cloth, 0.004, 0.3, 0.8, 0.025)):
        n = int(oarea * dens)
        for r, c in (open_c[rng.randint(0, len(open_c), n)] if len(open_c) and n else []):
            x, y, z = at(r, c)
            lst.append((x, y, z + 0.004, rng.uniform(lo, hi), rng.uniform(lo, hi) * 0.7, thick, rng.uniform(0, 6.3), rng.uniform(-0.15, 0.15)))
    # tumbleweed: dry Russian thistle, blown loose and stopped, a few a block
    for _ in range(int(oarea * 0.006)):
        r, c = open_c[rng.randint(len(open_c))]; x, y, z = at(r, c); s_ = rng.uniform(0.45, 0.9)
        weeds.append((x, y, z - 0.02, s_, s_ * rng.uniform(0.85, 1.1), s_ * rng.uniform(0.75, 0.95), rng.uniform(0, 6.3), 0.0))
    # 7. DEAD WEEDS against every edge and in the walk's joints
    weed_cells = np.argwhere((windy & dirt) | (concrete & (rng.rand(*g.shape) < 0.002)))
    n = int(len(weed_cells) * STEP * STEP * 1.2)
    for r, c in (weed_cells[rng.randint(0, len(weed_cells), n)] if len(weed_cells) and n else []):
        x, y, z = at(r, c); s_ = rng.uniform(0.1, 0.4)
        weeds.append((x, y, z - 0.01, s_, s_ * rng.uniform(0.7, 1.1), s_ * rng.uniform(0.35, 0.8), rng.uniform(0, 6.3), 0.0))
    # 8. THE COLD FIRE: a ring of stones round the ash, a few black sticks, on open dirt
    for _ in range(rng.randint(1, 3)):
        if not len(yard): break
        r, c = yard[rng.randint(len(yard))]; x, y, z = at(r, c); fires.append((x, y, 1.0))
        ash.append((x, y, z - 0.01, 1.3, 1.3, 0.03, 0.0, 0.0))
        for k in range(9):
            a_ = k / 9 * 2 * math.pi + rng.uniform(-0.15, 0.15)
            char.append(('stone', x + math.cos(a_) * 0.72, y + math.sin(a_) * 0.72, z - 0.02, 0.22, 0.18, 0.14, rng.uniform(0, 6.3), 0.0))
        for k in range(5):
            char.append(('stick', x + rng.normal(0, 0.18), y + rng.normal(0, 0.18), z + 0.03, 0.6, 0.06, 0.06, rng.uniform(0, 6.3), rng.uniform(-0.3, 0.3)))
    # the materials: the palette's roles, the junk faded (the rig's source pass bleaches and dusts it further)
    M = dict(bag=material(bpy, 'bag', 'rubber', 2), bag_open=material(bpy, 'bag_open', 'cloth_black', 3),
             paper=material(bpy, 'paper', 'clay_bone', 3), card=material(bpy, 'card', 'tape_masking', 2),
             cloth_a=material(bpy, 'cloth_a', 'clay_teal', 2), cloth_b=material(bpy, 'cloth_b', 'clay_rust', 2), cloth_c=material(bpy, 'cloth_c', 'metal_painted', 2),
             weed=material(bpy, 'weed', 'clay_bone', 1, 0.9), mattress=material(bpy, 'mattress', 'clay_bone', 3, 0.92),
             couch=material(bpy, 'couch', ['clay_teal', 'clay_rust', 'metal_painted'][rng.randint(3)], 1),
             ash=material(bpy, 'ash', 'tape_grey', 1), char=material(bpy, 'char', 'cloth_black', 1), stone=material(bpy, 'stone', 'clay_bone', 1),
             deadlawn=material(bpy, 'deadlawn', 'tape_masking', 3, 0.9), deadlawn_b=material(bpy, 'deadlawn_b', 'clay_bone', 1, 1.1),
             path=material(bpy, 'path', 'clay_bone', 3, 0.86), track=material(bpy, 'track', 'clay_bone', 1, 1.05), bin=material(bpy, 'bin', ['metal_painted', 'clay_teal', 'tape_grey'][rng.randint(3)], 1))
    half = len(deadlawn) // 2
    for nm, tpl, items, mat, jit in (('junk_bags', lump, bags, 'bag', 0.35), ('junk_bags_open', lump, bags_open, 'bag_open', 0.5),
                                     ('junk_paper', box, paper, 'paper', 0), ('junk_card', box, card, 'card', 0.2),
                                     ('junk_cloth_a', box, cloth[0::3], 'cloth_a', 0.4), ('junk_cloth_b', box, cloth[1::3], 'cloth_b', 0.4),
                                     ('junk_cloth_c', box, cloth[2::3], 'cloth_c', 0.4), ('junk_weeds', lump, weeds, 'weed', 0.6),
                                     ('junk_mattress', box, mattress, 'mattress', 0.04), ('junk_couch', box, couch, 'couch', 0.03),
                                     ('junk_ash', lump, ash, 'ash', 0.3), ('junk_fire_stones', lump, [c_[1:] for c_ in char if c_[0] == 'stone'], 'stone', 0.3),
                                     ('junk_fire_sticks', box, [c_[1:] for c_ in char if c_[0] == 'stick'], 'char', 0.2),
                                     ('junk_deadlawn', lump, deadlawn[:half], 'deadlawn', 0.5), ('junk_deadlawn_b', lump, deadlawn[half:], 'deadlawn_b', 0.5),
                                     ('junk_paths', box, paths, 'path', 0.0), ('junk_tracks', box, tracks, 'track', 0.0), ('junk_bins', box, bins, 'bin', 0.05)):
        objs.append(instances(bpy, nm, tpl, items, M[mat], jit, rng))
    # 9. A SHOPPING CART on its side, COOK's own, imported untouched (one block in two)
    if len(walk) and rng.rand() < 0.5:
        try:
            before = set(bpy.context.scene.objects)
            bpy.ops.import_scene.gltf(filepath=os.path.join(R, 'reference/models/bohemia/cart.glb'))
            new = [o for o in bpy.context.scene.objects if o not in before]
            outer = bpy.data.objects.new('junk_cart_stretch', None); bpy.context.scene.collection.objects.link(outer)
            root = bpy.data.objects.new('junk_cart', None); bpy.context.scene.collection.objects.link(root); root.parent = outer
            for o in new:
                if o.parent is None: o.parent = root
            r, c = walk[rng.randint(len(walk))]; x, y, z = at(r, c)
            root.location = (x, y, z + 0.28); root.rotation_euler = (0.0, math.radians(88), rng.uniform(0, 6.3))
            meshes = [o for o in new if o.type == 'MESH']
            RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, 0); RIG.dent_pass(meshes, 1.0)
            outer.scale = (1.0, 1.0, ZS)                          # the camera's stretch on an unturned parent
        except Exception as e:                                # a block without its cart is still a block
            print('  cart skipped:', e, flush=True)
    counts = dict(bags=len(bags) + len(bags_open), paper=len(paper), card=len(card), cloth=len(cloth), weeds=len(weeds),
                  mattresses=len(mattress), couches=len(couch) // 4, fires=len(fires), dead_lawn=len(deadlawn), paths=len(paths),
                  bins=len(bins), tracks=len(tracks), tidy_house=int(tidy), burnt_house=int(burnt))
    return [o for o in objs if o], fires, counts


# ---- THE BLOCK: last round's render with the grime and the junk wrapped in ---------------------------------------------
LEDGER = {}
_build = F.build
_laf = RIG.light_and_film


def build(bpy, gid_full, seed, quick=False):
    objs, g = _build(bpy, gid_full, seed, quick)
    if quick: return objs, g
    bid = LEDGER['bid']
    houses = F.old_houses(gid_full) if bid.split('.')[0] in F.HOUSE_KINDS else []
    ground = objs[0]
    co = np.zeros(len(ground.data.vertices) * 3, np.float32); ground.data.vertices.foreach_get('co', co)
    h = co.reshape(g.shape[0], g.shape[1], 3)[..., 2] if co.size == g.shape[0] * g.shape[1] * 3 else np.zeros(g.shape, np.float32)
    junk, fires, counts = litter(bpy, g, h, houses, seed + 77)
    LEDGER['fires'] = fires; LEDGER['junk'] = counts
    if OPEN_KEEP.get('bid') == bid:                             # 10/23: the open ground's bushes and fences, as things
        junk += open_things(bpy, g, h, seed + 91)
    return objs + junk, g


# ---- 10/23: THE OPEN GROUND IS THE PLAN, NOT THE OLD PICTURE ------------------------------------------------------------
# The plan's `keep` (the shipped pixel still equals COMBAT TWO's maker) is how the floor tool tells ground it may rebuild
# from a pixel a later round painted. On the open blocks it now says almost nothing: COOK TWO's 10/19 recolour (his
# 'camouflage' NO) moved every desert pixel off the maker's orange, so keep is 2.6% of scrub.1 and 15% of lots.0, and the
# compose laid the render on that 2.6% and the OLD FLAT PICTURE everywhere else (measured 10/23: scrub.1 came back
# byte-identical to the old block, and lots.0, swapped 10/22, is 87% its old pixels). On these kinds nothing was painted
# over the maker but the recolour, so the plan's grounds are the truth: every pixel is the render. What the maker drew
# that is not ground becomes a thing: each cluster of its shrub dots a creosote bush (a dusty olive mound of leaf lumps on
# its dark stems, its footprint the cluster's), each run of its fence wire on the desert kinds a ranch fence (posts every
# 2.4 m, three strands); the rest (the freeway's patches, the wash's bank line) is the nearest ground.
OPEN_KINDS = ('scrub', 'wash', 'scrubroad', 'freeway', 'freewayo', 'lots')
OPEN_KEEP = {}


def open_plan(bid, gid, ship):
    from scipy import ndimage
    a = ship.astype(np.int16); no = gid == 255
    lumv = a.mean(2); sat = a.max(2) - a.min(2)
    green = no & (a[..., 1] > a[..., 0] + 12) & (a[..., 1] > a[..., 2] + 4)
    lab, n = ndimage.label(ndimage.binary_dilation(green, iterations=9))
    bushes = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        m = (lab[sl] == i + 1) & green[sl]
        if m.sum() < 25: continue
        ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min() + sl[0].start, ys.max() + sl[0].start, xs.min() + sl[1].start, xs.max() + sl[1].start
        w = float(np.clip((x1 - x0) / F.PPM, 0.5, 2.6)); d = float(np.clip((y1 - y0) / (F.PPM * 0.7071), 0.4, 2.0))
        bushes.append(((x0 + x1) / 2 / F.PPM, F.SIDE * (1 - (y0 + y1) / 2 / F.H), w, d))
    wire = no & ~green & (lumv < 85) & (sat < 16)
    lab, n = ndimage.label(ndimage.binary_closing(wire, iterations=3))
    fences = []
    for i, sl in enumerate(ndimage.find_objects(lab) if bid.split('.')[0] in ('scrub', 'scrubroad', 'wash') else []):
        hh, ww = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if ww >= 40 and ww >= 4 * hh:                          # a run of wire across the picture (east-west, as the maker draws it)
            fences.append((sl[1].start / F.PPM, sl[1].stop / F.PPM, F.SIDE * (1 - sl[0].stop / F.H)))
    OPEN_KEEP.clear(); OPEN_KEEP.update(bid=bid, bushes=bushes, fences=fences)
    LEDGER['open'] = dict(bushes=len(bushes), fences=len(fences), not_ground_px=int(no.sum()))


def srgb_mat(bpy, name, rgb, role='clay_teal'):
    m = bpy.data.materials.new('junk_' + name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = tuple(((c / 255.0) / 12.92 if c <= 10 else ((c / 255.0 + 0.055) / 1.055) ** 2.4) for c in rgb) + (1,)
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Specular IOR Level'].default_value = 0.0
    m['palette_role'] = role; m['palette_step'] = 1
    return m


def open_things(bpy, g, h, seed):
    rng = np.random.RandomState(seed); STEP = F.STEP; SIDE = F.SIDE; ny, nx = g.shape
    def z_at(x, y):
        c = int(round((x + 1.0) / STEP)); r = int(round(((SIDE + 1.0) - y) / STEP))
        return float(h[min(max(r, 0), ny - 1), min(max(c, 0), nx - 1)])
    ico_v, ico_f = F.ico(bpy); lump = (ico_v * 0.5 + np.array([0, 0, 0.5], np.float32), ico_f); box = (CUBE_V, CUBE_F)
    leaf_a, leaf_b, stems = [], [], []
    for (x, y, w, d) in OPEN_KEEP.get('bushes', []):
        z0 = z_at(x, y); top = float(np.clip(0.55 * max(w, d) + rng.uniform(-0.1, 0.25), 0.45, 1.5))
        for k in range(rng.randint(3, 6)):                     # the stems, splayed out of one crown
            a_ = rng.uniform(0, 6.3); L_ = top * rng.uniform(0.6, 0.95)
            stems.append((x + math.cos(a_) * 0.12, y + math.sin(a_) * 0.12, z0, 0.035, 0.035, L_, a_, rng.uniform(0.2, 0.55)))
        for k in range(int(np.clip(w * d * 26, 14, 48))):      # the leaf lumps: many and small, an airy crown, never a ball
            u, v = rng.uniform(-1, 1), rng.uniform(-1, 1)
            if u * u + v * v > 1: continue
            s_ = rng.uniform(0.1, 0.2) * max(w, d) + 0.06
            zz = z0 + top * rng.uniform(0.15, 0.95) * (1.0 - 0.35 * (u * u + v * v)) - s_ * 0.4
            (leaf_a if rng.rand() < 0.55 else leaf_b).append((x + u * w * 0.45, y + v * d * 0.45, zz, s_, s_ * rng.uniform(0.8, 1.1), s_ * rng.uniform(0.6, 0.85), rng.uniform(0, 6.3), 0.0))
    posts, wires = [], []
    for (x0, x1, y) in OPEN_KEEP.get('fences', []):
        n = max(1, int(round((x1 - x0) / 2.4)))
        xs = [x0 + (x1 - x0) * k / n for k in range(n + 1)]
        for x in xs:
            posts.append((x + rng.uniform(-0.1, 0.1), y, z_at(x, y) - 0.05, 0.1, 0.1, rng.uniform(1.15, 1.3), rng.uniform(-0.2, 0.2), rng.uniform(-0.06, 0.06)))
        for k in range(n):
            if rng.rand() < 0.15: continue                     # a span cut and gone
            xm = (xs[k] + xs[k + 1]) / 2; zg = z_at(xm, y)
            for zz in (0.45, 0.75, 1.05):
                wires.append((xm, y - 0.06, zg + zz - rng.uniform(0, 0.08), xs[k + 1] - xs[k], 0.025, 0.025, rng.uniform(-0.01, 0.01), 0.0))
    M = dict(leaf_a=srgb_mat(bpy, 'creosote_a', (78, 84, 52)), leaf_b=srgb_mat(bpy, 'creosote_b', (58, 64, 42)),
             stem=material(bpy, 'creosote_stem', 'clay_rust', 0, 0.9), post=material(bpy, 'fence_post', 'clay_bone', 1),
             wire=material(bpy, 'fence_wire', 'tape_grey', 1))
    out = [instances(bpy, 'junk_bush_stems', box, stems, M['stem'], 0.0, rng), instances(bpy, 'junk_bush_a', lump, leaf_a, M['leaf_a'], 0.7, rng),
           instances(bpy, 'junk_bush_b', lump, leaf_b, M['leaf_b'], 0.7, rng), instances(bpy, 'junk_fence_posts', box, posts, M['post'], 0.0, rng),
           instances(bpy, 'junk_fence_wire', box, wires, M['wire'], 0.0, rng)]
    LEDGER['open_things'] = dict(bushes=len(OPEN_KEEP.get('bushes', [])), leaf_lumps=len(leaf_a) + len(leaf_b), fence_posts=len(posts))
    return [o for o in out if o is not None]


def laf(sc, A):
    import bpy
    if 'fires' in LEDGER and not LEDGER.get('grimed'):
        LEDGER['grime'] = grime_pass(bpy, LEDGER['fires'], LEDGER['seed']); LEDGER['grimed'] = True
        for m in bpy.data.materials:                            # every occlusion and bevel node at one ray a camera sample
            if m.use_nodes:
                for n in m.node_tree.nodes:
                    if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    return _laf(sc, A)


_load_plan = F.load_plan


def load_plan(bid):
    """on the lots blocks the old house slabs (flat grey, whole rectangles) are concrete ground, so the rig builds them
    with the rest of the ground instead of keeping the old picture's pixels"""
    gid, ground, lum, ship, kit = _load_plan(bid)
    if bid.split('.')[0] == 'lots':
        a = ship.astype(np.int16); sat = a.max(2) - a.min(2); lumv = a.mean(2)
        slab = (gid == 255) & (sat < 22) & (lumv > 80) & (lumv < 170)
        from PIL import Image as _I
        sm = np.asarray(_I.fromarray((slab * 255).astype(np.uint8)).resize((F.W // 8, F.H // 8), _I.BOX)) > 200
        sm = np.asarray(_I.fromarray((sm * 255).astype(np.uint8)).resize((F.W, F.H), _I.NEAREST)) > 0
        slab = slab | (sm & (gid == 255) & (sat < 30))
        gid = gid.copy(); gid[slab] = F.ID['concrete']; ground = ground | slab
        LEDGER['slab_px'] = int(slab.sum())
    if bid.split('.')[0] in OPEN_KINDS:                       # 10/23: the plan is the truth on the open blocks (OPEN_KINDS above)
        open_plan(bid, gid, ship)
        lum = lum.copy(); lum[gid == 255] = 255
        ground = np.ones_like(ground)
    else:
        OPEN_KEEP.clear()
    return gid, ground, lum, ship, kit


F.load_plan = load_plan
F.build = build
RIG.light_and_film = laf


def orig(sha=BASE_SHA):
    """the pre-swap blocks and the board json, out of git, for the plan to read as 'the shipped picture'"""
    os.makedirs(ORIG, exist_ok=True)
    man = json.loads(subprocess.check_output(['git', 'show', '%s:slices/fight_ground/fight_ground.json' % sha], cwd=R))
    json.dump(man, open(os.path.join(ORIG, 'fight_ground.json'), 'w'))
    for b, v in man['blocks'].items():
        dst = os.path.join(ORIG, v['src'])
        if not os.path.exists(dst):
            open(dst, 'wb').write(subprocess.check_output(['git', 'show', '%s:slices/fight_ground/%s' % (sha, v['src'])], cwd=R))
    print('  originals at', os.path.relpath(ORIG, R), flush=True)


def render(bid, region=None):
    t0 = time.time()
    LEDGER.clear(); LEDGER['bid'] = bid; LEDGER['seed'] = sum(map(ord, bid)) % 97
    F.render_block(bid, False, region)
    if region: print('  region', bid, region, round(time.time() - t0), 's', LEDGER.get('junk'), flush=True); return
    src = os.path.join(OUT, 'block_%s.webp' % bid.replace('.', '_'))
    led = os.path.join(OUT, 'not_final.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[bid] = dict(seconds=round(time.time() - t0), junk=LEDGER.get('junk'), grime=LEDGER.get('grime'), file=os.path.relpath(src, R))
    json.dump(L, open(led, 'w'), indent=1)
    print('  block', bid, 'done', round(time.time() - t0), 's', LEDGER.get('junk'), flush=True)


def swap(bid):
    """into the fight: the same file name, the same 2575 x 1820, lossy 90 like the handover (the lossless master stays here)"""
    man = json.load(open(os.path.join(SHIP, 'fight_ground.json')))
    src = os.path.join(OUT, 'block_%s.webp' % bid.replace('.', '_'))
    dst = os.path.join(SHIP, man['blocks'][bid]['src'])
    a = Image.open(src).convert('RGB'); b = Image.open(dst)
    assert a.size == b.size == (F.W, F.H), (a.size, b.size)
    a.save(dst, quality=76, method=6)          # 90 was 1.5 MB a block, 2.6x the old: a board is a dozen of them on a phone
    import hashlib
    led = os.path.join(OUT, 'swapped.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[bid] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), master=os.path.relpath(src, R))
    json.dump(L, open(led, 'w'), indent=1)
    print('  swapped', bid, '->', os.path.relpath(dst, R), os.path.getsize(dst) // 1024, 'KB', flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--orig':
        orig(a[1] if len(a) > 1 else BASE_SHA)
    elif a and a[0] == '--swap':
        for b in a[1:]: swap(b)
    else:
        if not os.path.exists(os.path.join(ORIG, 'fight_ground.json')): orig()
        region = [int(v) for v in a[a.index('--region') + 1].split(',')] if '--region' in a else None
        for b in [x for i, x in enumerate(a) if not x.startswith('--') and not (i and a[i - 1] == '--region')]: render(b, region)
    sys.stdout.flush(); os._exit(0)
