#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D] + [the floor, not final] 10/22/26: THE THREE ODD FIGHT BLOCKS IN 3D.
Rule 123 (Paolo 10/20: '...revamping all the 2-D assets into these 3-D sprites... analog horror Crashbox vibes, go
crazy'): no card; same file, same 2575 x 1820, same anchor. The floor tools build ground from the plan's grounds; three
block kinds are mostly NOT ground in the plan, so they never went through (10/19's 24 blocks left them out):

  SHORE     the lake (41% of the picture): here dead still water as its own surface over the lake bed, black where it
            is deep and a dull green-teal on the shelf, a line of scum along the edge, a tyre and some bags afloat.
  LANDFILL  the trash (18%): every old piece is a thing again where it lay: a black bag, a tyre, a rusted crate, a
            cardboard box or a dead appliance, sized off the old piece, on the rough ground of the cells.
  CASINO    the whole floor is carpet (the old picture's red-brown with its gold dots): here a carpet ground, its gold
            lattice, its tile seams, its stains and its worn paths, with the floor's litter of chips, cups and paper.
            ANALOG HORROR: one stool still stands at a clean patch of carpet, a coat over it.

The board's cover (slot banks, tables, the rocks and the rubble on these boards) is its own pictures, already through the
rig (cook_cover_rig); nothing here moves a tile.

  <venv>/bin/python tools/bohemia_cook_the_odd_blocks_through_the_rig_10_22_26.py <block> ...   (about 5 min a block)
  <venv>/bin/python tools/bohemia_cook_the_floor_not_final_10_20_26.py --swap <block> ...
  <venv>/bin/python tools/bohemia_cook_the_odd_blocks_through_the_rig_10_22_26.py <reclaimed|raided> <block> ...   (10/23: the futures)

REFERENCE CHECK (the 9/4 standing duty): the old blocks are the twins (where the water is, where each piece of trash lay,
the carpet's colour); real places: Lake Mead's bathtub-ring shore at low water, the Apex landfill's working cells, an
off-Strip casino floor's patterned carpet; Machine Party's grime (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1).
No reference game.
REUSE CHECK (REUSE-FIRST): the not-final tool and the floor tool whole (their ground, materials, grime, junk, render,
swap), the town tool's hooks, its instancing; the floor tool's own ground-spec mechanism for the carpet.
TASTE CHECK: the rig is the look (rule 115).
"""
import os, sys, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_futures_through_the_rig_10_22_26 as FU            # the town buildings and the futures come with it
T = FU.T; NF = T.NF; F = NF.F
ODD = ('shore', 'landfill', 'casino')
KEEP = {}

# THE CARPET: a ground kind of the floor tool's own spec (red-brown, its tile seams, its stains and spills)
F.MATS['carpet'] = dict(role=('clay_rust', 2), target=(150, 72, 48), h=0.0, alt=('clay_rust', 1), alt_amt=0.25, grit=0.1, speck=(160, 0.18),
                        joints=dict(pitch=0.61, width=0.004), panel_var=0.07,
                        patches=dict(scale=0.45, cut=0.66, mul=0.45), oil=dict(scale=0.6, cut=0.62, mul=0.5))
if 'carpet' not in F.IDS:
    F.IDS.append('carpet'); F.ID['carpet'] = len(F.IDS) - 1
_gm = F.ground_material


def ground_material(bpy, name):
    m = _gm(bpy, name)
    if name != 'carpet': return m
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    src = b.inputs['Base Color'].links[0].from_socket                       # the floor tool's colour, then the gold lattice
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value = (0, 0, math.radians(45)); mp.inputs['Scale'].default_value = (1.6, 1.6, 1.6)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0.0; br.inputs['Brick Width'].default_value = 1.0; br.inputs['Row Height'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.06; br.inputs['Scale'].default_value = 1.0
    br.inputs['Color1'].default_value = (1, 1, 1, 1); br.inputs['Color2'].default_value = (0.9, 0.9, 0.9, 1)
    gold = tuple(F.role_lin('clay_mustard', 1)) + (1,); br.inputs['Mortar'].default_value = gold
    nt.links.new(mp.outputs['Vector'], br.inputs['Vector'])
    mo = nt.nodes.new('ShaderNodeMixRGB'); mo.blend_type = 'MIX'
    nt.links.new(br.outputs['Fac'], mo.inputs['Fac']); nt.links.new(src, mo.inputs['Color1']); mo.inputs['Color2'].default_value = gold
    worn = nt.nodes.new('ShaderNodeTexNoise'); worn.inputs['Scale'].default_value = 0.18; nt.links.new(tc.outputs['Object'], worn.inputs['Vector'])
    wr = nt.nodes.new('ShaderNodeMapRange'); wr.inputs['From Min'].default_value = 0.55; wr.inputs['From Max'].default_value = 0.7
    wr.inputs['To Min'].default_value = 0.85; wr.inputs['To Max'].default_value = 0.35; nt.links.new(worn.outputs['Fac'], wr.inputs['Value'])
    fade = nt.nodes.new('ShaderNodeMath'); fade.operation = 'MULTIPLY'; nt.links.new(wr.outputs['Result'], fade.inputs[0]); nt.links.new(br.outputs['Fac'], fade.inputs[1])
    nt.links.new(fade.outputs[0], mo.inputs['Fac'])                          # the lattice worn off where people walked
    nt.links.new(mo.outputs['Color'], b.inputs['Base Color'])
    return m


F.ground_material = ground_material
_load_plan = F.load_plan


def load_plan(bid):
    gid, ground, lum_, ship, kit = _load_plan(bid)
    kind = bid.split('.')[0]
    if kind not in ODD: return gid, ground, lum_, ship, kit
    from scipy import ndimage
    gid = gid.copy(); lum_ = lum_.copy()
    no = gid == 255
    a = ship.astype(np.int16); L = T.lum(ship)
    if kind == 'shore':
        # the old lake is a diagonal wave pattern: read on a metre, never per pixel (per pixel it left a checkerboard of
        # dry ground in the water and the junk blew onto it)
        bl = F.blur((a[..., 2] - a[..., 0]).astype(np.float32), 0.6 * F.PPM)
        water = no & (bl > 4); water = ndimage.binary_opening(ndimage.binary_closing(water, iterations=8), iterations=4)
        deep = water & (F.blur(L.astype(np.float32), 0.6 * F.PPM) < 85)
        gid[water] = F.ID['playa']; gid[no & ~water] = F.ID['desert']
        KEEP['water'] = water; KEEP['deep'] = deep
    elif kind == 'landfill':
        lab, n = ndimage.label(no); pieces = []
        berm = np.zeros_like(no)
        for i, sl in enumerate(ndimage.find_objects(lab)):
            m = lab[sl] == i + 1
            if m.sum() < 60: continue
            if (sl[1].stop - sl[1].start) > 2.6 * F.PPM or (sl[0].stop - sl[0].start) > 2.6 * F.PPM:   # a cell's dirt berm, not a thing
                berm[sl] |= m; continue
            c = np.median(a[sl][m], axis=0); y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
            pieces.append(dict(x=(x0 + x1) / 2 / F.PPM, y=F.SIDE * (1 - y1 / F.H), w=(x1 - x0) / F.PPM, hs=(y1 - y0) / F.PPM, rgb=[int(v) for v in c]))
        gid[no] = F.ID['rough']; gid[berm] = F.ID['track']; KEEP['pieces'] = pieces
    elif kind == 'casino':
        gid[:] = F.ID['carpet']
    lum_[no] = 255                                                           # the maker had no shading for what was not ground
    ground = gid != 255
    return gid, ground, lum_, ship, kit


F.load_plan = load_plan
_build = F.build


def water_mesh(bpy, mask, z, name, mat, cell=0.1):
    n = int(F.SIDE / cell)
    ys = ((np.arange(n) + 0.5) * cell / F.SIDE * F.H).astype(int); xs = ((np.arange(n) + 0.5) * cell * F.PPM).astype(int)
    m = mask[np.clip(ys, 0, F.H - 1)][:, np.clip(xs, 0, F.W - 1)]
    if not m.any(): return None
    vid = -np.ones((n + 1, n + 1), np.int64); verts = []; faces = []
    for i, j in zip(*np.nonzero(m)):
        q = []
        for (di, dj) in ((1, 0), (1, 1), (0, 1), (0, 0)):
            ii, jj = i + di, j + dj
            if vid[ii, jj] < 0: vid[ii, jj] = len(verts); verts.append((jj * cell, F.SIDE - ii * cell, z))
            q.append(int(vid[ii, jj]))
        faces.append(q)
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update(); me.materials.append(mat)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    return o, m


def build(bpy, gid_full, seed, quick=False):
    objs, g = _build(bpy, gid_full, seed, quick)
    bid = NF.LEDGER.get('bid', ''); kind = bid.split('.')[0]
    if quick or kind not in ODD: return objs, g
    rng = np.random.RandomState(seed + 13)
    ico = F.ico(bpy); lump = (ico[0] * 0.5 + np.array([0, 0, 0.5], np.float32), ico[1]); box = (NF.CUBE_V, NF.CUBE_F)
    add = []
    if kind == 'shore':
        deep = NF.material(bpy, 'water_deep', 'clay_teal', 0, 0.5); shelf = NF.material(bpy, 'water_shelf', 'clay_teal', 2, 0.85)
        scum = NF.material(bpy, 'scum', 'clay_bone', 2, 0.9); bag = NF.material(bpy, 'float_bag', 'rubber', 2)
        r1 = water_mesh(bpy, KEEP['deep'], -0.05, 'water_deep', deep); r2 = water_mesh(bpy, KEEP['water'] & ~KEEP['deep'], -0.06, 'water_shelf', shelf)
        add += [r[0] for r in (r1, r2) if r]
        wm = KEEP['water']; e = np.zeros_like(wm); e[1:] |= wm[1:] != wm[:-1]; e[:-1] |= wm[1:] != wm[:-1]
        ys, xs = np.nonzero(e[::6, ::6]); scums, floats = [], []
        for y, x in zip(ys, xs):
            if rng.rand() < 0.5: continue
            X, Y = x * 6 / F.PPM, F.SIDE * (1 - y * 6 / F.H); s_ = rng.uniform(0.15, 0.5)
            scums.append((X + rng.normal(0, 0.15), Y + rng.normal(0, 0.15), -0.06, s_, s_ * rng.uniform(0.4, 1.0), 0.012, rng.uniform(0, 6.3), 0.0))
        wy, wx = np.nonzero(KEEP['deep'][::40, ::40])
        for k in rng.choice(len(wy), min(len(wy), 6), replace=False) if len(wy) else []:
            floats.append((wx[k] * 40 / F.PPM, F.SIDE * (1 - wy[k] * 40 / F.H), -0.12, 0.45, 0.35, 0.22, rng.uniform(0, 6.3), 0.0))
        add += [NF.instances(bpy, 'shore_scum', box, scums, scum), NF.instances(bpy, 'shore_float', lump, floats, bag, 0.4, rng)]
        if len(wy):                                                          # one tyre afloat, half under
            k = rng.randint(len(wy)); bpy.ops.mesh.primitive_torus_add(major_radius=0.33, minor_radius=0.11, location=(wx[k] * 40 / F.PPM + 1.5, F.SIDE * (1 - wy[k] * 40 / F.H), -0.07))
            t = bpy.context.active_object; t.data.materials.append(NF.material(bpy, 'tyre', 'rubber', 1)); add.append(t)
    elif kind == 'landfill':
        mats = dict(bag=NF.material(bpy, 'lf_bag', 'rubber', 2), rust=NF.material(bpy, 'lf_rust', 'clay_rust', 1), card=NF.material(bpy, 'lf_card', 'tape_masking', 2),
                    grey=NF.material(bpy, 'lf_grey', 'tape_grey', 2), white=NF.material(bpy, 'lf_white', 'clay_bone', 3, 0.85))
        items = {k: [] for k in mats}; lumps = []
        for p in KEEP['pieces']:
            r_, g_, b_ = p['rgb']; Lp = 0.299 * r_ + 0.587 * g_ + 0.114 * b_
            w = max(0.25, p['w']); d = w * rng.uniform(0.7, 1.0); hh = float(np.clip(p['hs'] - 0.707 * d, 0.2, 1.4))
            rz = rng.uniform(-0.4, 0.4)
            if Lp < 45: lumps.append((p['x'], p['y'] + d / 2, -0.05, w, d, hh * 0.9, rng.uniform(0, 6.3), rng.uniform(-0.2, 0.2)))
            elif r_ > 140 and g_ < 0.65 * r_: items['rust'].append((p['x'], p['y'] + d / 2, 0.0, w, d, hh, rz, 0.0))
            elif Lp > 150: items['white'].append((p['x'], p['y'] + d / 2, 0.0, w, d, hh, rz, 0.0))
            elif r_ > b_ + 25: items['card'].append((p['x'], p['y'] + d / 2, 0.0, w, d, hh, rz, rng.uniform(-0.15, 0.15)))
            else: items['grey'].append((p['x'], p['y'] + d / 2, 0.0, w, d, hh, rz, 0.0))
        # 10/23: THE CELLS ARE FULL. The first cut made each old piece one thing and read as a few boxes on a swept lot (the
        # maker's black discs, its tyres, came out as pebble-sized lumps). A working cell of the Apex landfill is a field of
        # split bags, cardboard and scrap in a crust of dirt: the old black discs are TYRES (a real torus, flat or stacked
        # two and three), and the cells' rough ground is filled with bags, boxes and scrap at about one a square metre,
        # with a dead fridge or washer on its side, a mattress and a pallet here and there
        bpy.ops.mesh.primitive_torus_add(major_segments=16, minor_segments=8, major_radius=0.3, minor_radius=0.12)
        tt = bpy.context.active_object; tv = np.array([v.co[:] for v in tt.data.vertices], np.float32); tv[:, 2] += 0.12
        tf = np.array([list(p_.vertices) for p_ in tt.data.polygons], np.int32); bpy.data.objects.remove(tt, do_unlink=True)
        tyres = []
        for (x, y, z0, w, d, hh, rz, tl) in lumps:                          # the maker's black discs
            for k in range(1 if rng.rand() < 0.65 else rng.randint(2, 4)):
                s_ = float(np.clip(w / 0.84, 0.75, 1.25))
                tyres.append((x + rng.normal(0, 0.05), y - d / 2 + rng.normal(0, 0.05), -0.04 + k * 0.23 * s_, s_, s_, s_, rng.uniform(0, 6.3), rng.uniform(-0.12, 0.12) if k == 0 else 0.0))
        rough = np.argwhere(g == F.ID['rough']); fill = {k: [] for k in ('bag', 'white', 'card', 'grey', 'rust')}
        area = len(rough) * F.STEP * F.STEP
        for r_, c_ in rough[rng.randint(0, len(rough), int(area * 1.1))] if len(rough) else []:
            x, y = c_ * F.STEP - 1.0 + rng.uniform(0, F.STEP), (F.SIDE + 1.0) - r_ * F.STEP - rng.uniform(0, F.STEP)
            u = rng.rand(); s_ = rng.uniform(0.35, 0.8)
            if u < 0.55: fill['bag'].append((x, y, -0.06, s_ * 1.15, s_, s_ * rng.uniform(0.45, 0.7), rng.uniform(0, 6.3), 0.0))
            elif u < 0.68: fill['white'].append((x, y, -0.05, s_, s_ * 0.9, s_ * 0.55, rng.uniform(0, 6.3), 0.0))
            elif u < 0.84: fill['card'].append((x, y, -0.02, s_, s_ * rng.uniform(0.6, 1.0), s_ * rng.choice([0.2, 0.5, 0.8]), rng.uniform(0, 6.3), rng.uniform(-0.3, 0.3)))
            elif u < 0.95: fill['grey'].append((x, y, -0.02, s_ * 1.4, s_ * 0.3, s_ * 0.25, rng.uniform(0, 6.3), rng.uniform(-0.4, 0.4)))
            else: tyres.append((x, y, -0.04, 1.0, 1.0, 1.0, rng.uniform(0, 6.3), rng.uniform(-0.2, 0.2)))
        for _ in range(int(area / 90)):                                     # the big things: a fridge or a washer, a mattress, a pallet
            if not len(rough): break
            r_, c_ = rough[rng.randint(len(rough))]; x, y = c_ * F.STEP - 1.0, (F.SIDE + 1.0) - r_ * F.STEP; u = rng.rand()
            if u < 0.45: items['white'].append((x, y, 0.0, 0.75, 1.7, 0.7, rng.uniform(0, 6.3), 0.0))                  # on its back
            elif u < 0.75: items['white'].append((x, y, 0.0, 1.9, 1.35, 0.2, rng.uniform(0, 6.3), rng.uniform(-0.1, 0.1)))   # a mattress
            else: items['card'].append((x, y, 0.0, 1.2, 1.0, 0.14, rng.uniform(0, 6.3), 0.0))                              # a pallet
        for k, it in items.items(): add.append(NF.instances(bpy, 'lf_' + k, box, it, mats[k], 0.12, rng))
        add.append(NF.instances(bpy, 'lf_tyres', (tv, tf), tyres, NF.material(bpy, 'lf_tyre', 'rubber', 1), 0.03, rng))
        for k, it in fill.items():
            add.append(NF.instances(bpy, 'lf_fill_' + k, lump if k in ('bag', 'white') else box, it, mats[k], 0.45 if k in ('bag', 'white') else 0.2, rng))
        NF.LEDGER['landfill'] = dict(tyres=len(tyres), fill=sum(len(v) for v in fill.values()), pieces=len(KEEP['pieces']))
    elif kind == 'casino':
        chip = [NF.material(bpy, 'chip_%d' % i, r_, s_) for i, (r_, s_) in enumerate((('clay_rust', 2), ('clay_teal', 2), ('clay_bone', 3), ('cloth_black', 1)))]
        paper = NF.material(bpy, 'cas_paper', 'clay_bone', 3); cup = NF.material(bpy, 'cas_cup', 'clay_bone', 2)
        chips = [[] for _ in chip]; papers = []; cups = []
        for _ in range(rng.randint(500, 700)):
            x, y = rng.uniform(1, F.SIDE - 1), rng.uniform(1, F.SIDE - 1)
            if rng.rand() < 0.55:                                            # a spill of chips nobody came back for
                for _k in range(rng.randint(1, 6)):
                    chips[rng.randint(len(chip))].append((x + rng.normal(0, 0.12), y + rng.normal(0, 0.12), 0.0, 0.04, 0.04, 0.006, 0.0, rng.uniform(-0.2, 0.2)))
            elif rng.rand() < 0.6: papers.append((x, y, 0.0, rng.uniform(0.08, 0.22), rng.uniform(0.1, 0.3), 0.004, rng.uniform(0, 6.3), 0.0))
            else: cups.append((x, y, 0.0, 0.08, 0.08, 0.11, 0.0, math.radians(90) if rng.rand() < 0.7 else 0.0))
        add += [NF.instances(bpy, 'cas_chips_%d' % i, box, c_, chip[i]) for i, c_ in enumerate(chips)]
        add += [NF.instances(bpy, 'cas_paper', box, papers, paper), NF.instances(bpy, 'cas_cups', lump, cups, cup)]
        sx, sy = rng.uniform(15, 45), rng.uniform(15, 45)                   # the one stool, a coat over it
        st = NF.material(bpy, 'stool', 'rubber', 1); coat = NF.material(bpy, 'coat', 'clay_teal', 0)
        add.append(NF.instances(bpy, 'cas_stool', box, [(sx, sy, 0.0, 0.06, 0.06, 0.72, 0.0, 0.0), (sx, sy, 0.72, 0.42, 0.42, 0.08, 0.3, 0.0)], st))
        add.append(NF.instances(bpy, 'cas_coat', lump, [(sx + 0.05, sy + 0.18, 0.5, 0.45, 0.16, 0.45, 0.3, 0.2)], coat, 0.3, rng))
    add = [o for o in add if o is not None]
    zs = 1.0 / math.cos(math.radians(float(NF.RIG.G['tilt_deg'])))
    for o in add:
        if o.name.startswith('water_'): o.scale = (1, 1, zs)                 # still water takes no dust and no dents
    return objs + [o for o in add if not o.name.startswith('water_')], g


F.build = build


if __name__ == '__main__':
    a = sys.argv[1:]
    if not os.path.exists(os.path.join(NF.ORIG, 'fight_ground.json')): NF.orig()
    if a and a[0] in ('reclaimed', 'raided'):                              # 10/23: the odd blocks' futures, the futures tool's render
        for b in a[1:]: FU.render(a[0], b)
    else:
        region = [int(v) for v in a[a.index('--region') + 1].split(',')] if '--region' in a else None   # 10/23: a test window
        for b in [x for i, x in enumerate(a) if not x.startswith('--') and not (i and a[i - 1] == '--region')]: NF.render(b, region)
    sys.stdout.flush(); os._exit(0)
