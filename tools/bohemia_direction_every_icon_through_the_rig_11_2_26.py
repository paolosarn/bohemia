#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [every icon through the rig] (11/2/26). Paolo: 'all the icons look like dog shit, why do all the icons
you made have to be five pixels by five pixels', 'a fabric icon looks like someone is getting hung by a noose', 'all your icons
suck'; 'you're making 3D-looking 2D sprites, I think we have to do that for the rest of the game' (rule 115); 'no AI slop' (274);
'more new graphics across the board' (290, 267).

MEASURED FIRST (records/BOHEMIA_DIRECTION_EVERY_ICON_THROUGH_THE_RIG_11_2_26.md has the table):
  * THE MAP'S MARKERS (slices/bohemia_his_map.js GLYPHS): sixteen hand grids of 6 to 9 cells, each cell two points, so a pin is
    a 7 x 9 mosaic of 6-device-pixel squares on his phone. These ARE the five-by-five icons.
  * THE TOP BAR'S SUPPLIES (slices/supply_icons/): pack tiles copied as they were (his UP 10/17 over the hand grids), 32 points;
    not ours, three different painters, three different lights.
  * The phone's apps (UI TWO, rule 212) and the fifty perks (COOK, 10/26) are already rig renders; the weapons and armour are
    ARMORY's (left to them); the stat icons are hand-shaded solids (UI, 10/25), next.

THE METHOD IS THE ROBOT'S AND THE TRUCK'S (rule 115): each icon is a small model in real metres, written as a glTF and put
through DIRECTION's master rig (tools/bohemia_direction_master_rig.py: Cycles, the guide's one sun from the upper left and its
sky, the source pass's wear and grime, the population snap toward his prop family, the ring), the same call COOK's item icons
make (tools/bohemia_cook_the_icons_through_the_rig_10_20_26.py: 40 denoised samples, wear 0.3, snap 0.35, rendered at three
times the icon and cut down with a real filter, one dark pixel round the silhouette). One rig, one sun, one style for all.

  /tmp/v/bin/python tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py [name ...]      model + rig + cut
  python3 tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py cut [name ...]           the cut only

SHIPS: slices/supply_icons/<k>.png (96 high, the bar shows them at 32 points: one art pixel to one phone pixel), the stall's
copies in slices/market_icons/s_*.png (their own canvases), slices/map_markers/<k>.png (96 high; the map draws them at 26
points, smoothed), and the ledger records/target/direction_icons_rig/swapped.json (a sha1 per shipped file; the gates read it).
REFERENCE CHECK (the 9/4 standing duty, reference_check_gate.py): the twins are the rig's own props in the towns and the camp
(one camera, one sun) and the old icons each one replaces (the same subject: the can, the bottle, the cells, the roll, the tin,
the rounds; the tent, the sign, the crate, the skull, the cross). Real things at real sizes: a D cell 34 x 61 mm, a 400 g can
74 x 110 mm, a half-litre bottle, a 48 mm roll of duct tape, a first-aid tin, 7.62 rounds. No reference game.
REUSE CHECK (REUSE-FIRST): the props modeller's helpers (bohemia_cook_model_props: mat, box, cyl, rod, chunk, dims), COOK's
lathe and loft (bohemia_cook_the_icons_through_the_rig_10_20_26), the master rig through the floor tool's loader, unedited.
TASTE CHECK: a thing is what its name says; no tail on the tape (the noose, graveyard 10/13); every silhouette reads alone.
"""
import os, sys, json, math, hashlib, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/direction_icons_rig')
VENV = '/tmp/v/bin/python'
UP = 3
# name -> (ship path, the cut's box (w, h) in phone pixels)
SUPPLY = ['batteries', 'food_can', 'water', 'food', 'tape', 'meds', 'rounds', 'scrap']
MARKERS = ['camp', 'danger', 'loot', 'shop', 'word', 'cross', 'skull', 'dead', 'tag', 'flyer', 'radio', 'bar', 'rubble', 'door', 'battery', 'ask']
SMALL = ['batteries', 'food', 'water', 'tape', 'meds', 'rounds']
STALL = {'s_food': 'food', 's_food_can': 'food_can', 's_meds': 'meds', 's_rounds': 'rounds', 's_water': 'water'}


def ship_of(n):
    if n in SUPPLY: return os.path.join(R, 'slices/supply_icons', n + '.png'), ((126 if n == 'food' else 96), 96)
    return os.path.join(R, 'slices/map_markers', n + '.png'), (96, 96)


def build(n, bpy, P, IC):
    import mathutils
    M = lambda nm, role, step: P.mat(bpy, nm, role, step)
    black, gold, chrome, copper = M('black', 'rubber', 2), M('gold', 'clay_mustard', 3), M('chrome', 'chrome', 1), M('copper', 'clay_rust', 3)
    bone, rust, red, steel = M('bone', 'clay_bone', 4), M('rust', 'clay_rust', 2), M('red', 'blood', 1), M('steel', 'tape_grey', 2)
    wood, dwood, olive, teal = M('wood', 'clay_mustard', 1), M('dwood', 'clay_mustard', 0), M('olive', 'metal_painted', 2), M('teal', 'clay_teal', 3)

    def poly(nm, m, verts, faces):                # a flat panel (a fly, a sign, a flag): COOK's mesh, its argument order
        return IC.mesh(bpy, nm, verts, faces, m, smooth=False)

    def torus(nm, m, R_, r, loc, rot=(0, 0, 0), arc=None):
        bpy.ops.mesh.primitive_torus_add(major_segments=28, minor_segments=10, major_radius=R_, minor_radius=r, location=loc, rotation=rot)
        o = bpy.context.active_object; o.name = nm; o.data.materials.append(m)
        if arc:                                   # keep only the vertices whose angle about the ring is inside arc (degrees)
            import bmesh
            bm = bmesh.new(); bm.from_mesh(o.data)
            kill = [v for v in bm.verts if not (arc[0] <= (math.degrees(math.atan2(v.co.y, v.co.x)) % 360) <= arc[1])]
            bmesh.ops.delete(bm, geom=kill, context='VERTS'); bm.to_mesh(o.data); bm.free()
        for p in o.data.polygons: p.use_smooth = True
        return o

    def cell(x, y, z=0.0, lie=False, s=1.0):
        """a D cell: 34 mm across, 61 mm long, black body, a gold top third, the steel nub"""
        r, h = 0.017 * s, 0.061 * s
        parts = [IC.lathe(bpy, 'cell', black, [(0, 0), (r * 0.94, 0), (r, 0.002), (r, h * 0.64), (0, h * 0.64)], n=20),
                 IC.lathe(bpy, 'top', gold, [(0, h * 0.64), (r, h * 0.64), (r, h * 0.985), (r * 0.94, h), (0, h)], n=20),
                 IC.lathe(bpy, 'nub', chrome, [(0, h), (r * 0.36, h), (r * 0.36, h + 0.004 * s), (0, h + 0.0045 * s)], n=14)]
        root = bpy.data.objects.new('cellroot', None); bpy.context.scene.collection.objects.link(root)
        for o in parts: o.parent = root
        root.location = (x, y, z + (r if lie else 0)); root.rotation_euler = ((0, math.radians(90), math.radians(-25)) if lie else (0, 0, 0))
        return root

    def can(x, y):
        r, h = 0.037, 0.11
        objs = [IC.lathe(bpy, 'can', chrome, [(0, 0), (r * 0.95, 0), (r, 0.004), (r * 0.985, 0.008), (r * 0.985, h - 0.008), (r, h - 0.004), (r * 0.95, h), (0, h - 0.002)], n=24),
                IC.lathe(bpy, 'label', rust, [(r * 1.0, 0.014), (r * 1.004, 0.014), (r * 1.004, h - 0.014), (r * 1.0, h - 0.014)], n=24),
                IC.lathe(bpy, 'band', gold, [(r * 1.006, 0.042), (r * 1.008, 0.042), (r * 1.008, 0.07), (r * 1.006, 0.07)], n=24),
                torus('pull', chrome, 0.009, 0.0022, (0.012, -0.01, h - 0.0005))]
        for o in objs: o.location.x += x; o.location.y += y

    def bottle(x, y):
        prof = [(0, 0), (0.031, 0), (0.033, 0.006), (0.033, 0.12), (0.03, 0.15), (0.016, 0.175), (0.013, 0.19), (0, 0.19)]
        b = IC.lathe(bpy, 'bottle', M('pet', 'clay_teal', 4), prof, n=22)     # clear water in clear plastic: the palest teal, never the beer-bottle green
        l = IC.lathe(bpy, 'blabel', bone, [(0.0332, 0.05), (0.0336, 0.05), (0.0336, 0.1), (0.0332, 0.1)], n=22)
        c = IC.lathe(bpy, 'cap', M('cap', 'clay_teal', 2), [(0, 0.188), (0.0145, 0.188), (0.0145, 0.207), (0, 0.207)], n=16)
        for o in (b, l, c): o.location.x += x; o.location.y += y

    if n == 'batteries':
        cell(-0.022, 0.012); cell(0.018, 0.02); cell(0.0, -0.035, lie=True)
    elif n == 'food_can':
        can(0, 0)
    elif n == 'water':
        bottle(0, 0)
    elif n == 'food':
        can(-0.035, 0); bottle(0.05, 0.01)
    elif n == 'tape':
        # a 48 mm roll of duct tape on its side, turned to show its hole and its cardboard core: no tail (the noose)
        o = IC.lathe(bpy, 'roll', steel, [(0.036, -0.024), (0.06, -0.024), (0.062, -0.02), (0.062, 0.02), (0.06, 0.024), (0.036, 0.024), (0.036, -0.024)], n=32)
        k = IC.lathe(bpy, 'core', M('core', 'clay_mustard', 2), [(0.03, -0.025), (0.036, -0.025), (0.036, 0.025), (0.03, 0.025), (0.03, -0.025)], n=32)
        for q in (o, k): q.rotation_euler = (math.radians(62), 0, math.radians(18)); q.location.z = 0.06
    elif n == 'meds':
        P.box(bpy, 'tin', bone, (0.2, 0.08, 0.14), (0, 0, 0.07), bevel=0.012)
        P.box(bpy, 'lid', M('lid', 'clay_bone', 3), (0.204, 0.084, 0.012), (0, 0, 0.115), bevel=0.004)
        P.box(bpy, 'crossv', red, (0.026, 0.006, 0.07), (0, -0.042, 0.055)); P.box(bpy, 'crossh', red, (0.07, 0.006, 0.026), (0, -0.042, 0.055))
        P.rod(bpy, 'h1', black, (-0.04, 0, 0.14), (-0.035, 0, 0.165), 0.006); P.rod(bpy, 'h2', black, (0.04, 0, 0.14), (0.035, 0, 0.165), 0.006)
        P.rod(bpy, 'h3', black, (-0.035, 0, 0.165), (0.035, 0, 0.165), 0.007)
        P.box(bpy, 'latch', chrome, (0.02, 0.006, 0.02), (0, -0.043, 0.112))
    elif n == 'rounds':
        for i, (x, y) in enumerate([(-0.02, 0.008), (0.0, 0.012), (0.02, 0.008), (-0.01, -0.012), (0.01, -0.012)]):
            c = IC.lathe(bpy, 'case', gold, [(0, 0), (0.0058, 0), (0.0058, 0.002), (0.0052, 0.003), (0.006, 0.004), (0.0058, 0.04), (0.0042, 0.045), (0.0042, 0.051), (0, 0.051)], n=16)
            b = IC.lathe(bpy, 'bullet', copper, [(0, 0.05), (0.0041, 0.05), (0.004, 0.06), (0.0028, 0.072), (0.0008, 0.079), (0, 0.0795)], n=16)
            for o in (c, b): o.location.x, o.location.y = x, y
    elif n == 'scrap':
        P.box(bpy, 'crate', wood, (0.5, 0.34, 0.26), (0, 0, 0.13), bevel=0.01)
        for i, z in enumerate((0.05, 0.13, 0.21)): P.box(bpy, 'slat%d' % i, dwood, (0.505, 0.345, 0.012), (0, 0, z))
        P.rod(bpy, 'pipe', steel, (-0.18, 0.05, 0.2), (0.05, -0.05, 0.42), 0.022)
        P.box(bpy, 'plate', M('plate', 'metal_painted', 3), (0.2, 0.012, 0.2), (0.1, 0.06, 0.3), (math.radians(-12), math.radians(14), 0.3), bevel=0.004)
        P.rod(bpy, 'rebar', rust, (0.15, -0.08, 0.22), (0.22, 0.08, 0.46), 0.008)
        P.cyl(bpy, 'wheel', black, 0.07, 0.03, (-0.08, 0.06, 0.29), (math.radians(70), 0, 0.4), verts=20)
    # ---------------------------------------------------------------- THE MAP'S MARKERS (each stands on the map)
    elif n == 'camp':
        # a ridge tent: two olive flies on a ridge, the door flap open, a rust stripe
        L, W, H = 1.6, 1.4, 1.1
        poly('tent', olive, [(-L / 2, -W / 2, 0), (L / 2, -W / 2, 0), (L / 2, 0, H), (-L / 2, 0, H), (-L / 2, W / 2, 0), (L / 2, W / 2, 0)],
                [(0, 1, 2, 3), (3, 2, 5, 4), (0, 3, 4), (1, 5, 2)])
        poly('door', black, [(-0.25, -W / 2 - 0.002 + 0.15, 0), (0.25, -W / 2 - 0.002 + 0.15, 0), (0, -0.002 - 0.2, H * 0.72)], [(0, 1, 2)])
        P.rod(bpy, 'pole', dwood, (L / 2 + 0.05, 0, 0), (L / 2 + 0.05, 0, H + 0.18), 0.025)
        P.rod(bpy, 'pole2', dwood, (-L / 2 - 0.05, 0, 0), (-L / 2 - 0.05, 0, H + 0.18), 0.025)
        poly('stripe', rust, [(-L / 2 - 0.001, -W * 0.3, H * 0.3), (L / 2 + 0.001, -W * 0.3, H * 0.3), (L / 2 + 0.001, -W * 0.22, H * 0.44), (-L / 2 - 0.001, -W * 0.22, H * 0.44)], [(0, 1, 2, 3)])
    elif n == 'danger':
        P.rod(bpy, 'post', steel, (0, 0.02, 0), (0, 0.02, 1.2), 0.03)
        s = 0.62; h = s * math.sqrt(3) / 2; z0 = 0.7
        tri = lambda nm, m, k, dy: poly(nm, m, [(-s * k / 2, dy, z0 + (h - h * k) / 3), (s * k / 2, dy, z0 + (h - h * k) / 3), (0, dy, z0 + (h - h * k) / 3 + h * k)], [(0, 1, 2)])
        P.box(bpy, 'back', black, (s * 1.02, 0.02, 0.02), (0, 0.0, z0))
        tri('rim', black, 1.0, -0.012); tri('face', gold, 0.8, -0.016)
        P.box(bpy, 'bang', black, (0.06, 0.006, 0.2), (0, -0.02, z0 + 0.27)); P.box(bpy, 'dot', black, (0.06, 0.006, 0.06), (0, -0.02, z0 + 0.1))
    elif n == 'loot':
        P.box(bpy, 'crate', wood, (0.8, 0.6, 0.5), (0, 0, 0.25), bevel=0.015)
        for i, z in enumerate((0.08, 0.42)): P.box(bpy, 'band%d' % i, dwood, (0.81, 0.61, 0.06), (0, 0, z))
        P.box(bpy, 'lid', wood, (0.82, 0.62, 0.06), (0, 0.16, 0.66), (math.radians(-38), 0, 0), bevel=0.01)
        for i, (x, c) in enumerate(((-0.18, gold), (0.05, steel), (0.2, M('cans', 'clay_teal', 3)))):
            P.cyl(bpy, 'goods%d' % i, c, 0.09, 0.2, (x, -0.02, 0.52), verts=16)
    elif n == 'shop':
        P.box(bpy, 'table', wood, (1.4, 0.7, 0.08), (0, 0, 0.75), bevel=0.01)
        for x in (-0.65, 0.65):
            for y in (-0.3, 0.3): P.rod(bpy, 'leg', dwood, (x, y, 0), (x, y, 1.6 if y > 0 else 0.75), 0.03)
        for x in (-0.65, 0.65): P.rod(bpy, 'fpost', dwood, (x, -0.3, 0.75), (x, -0.42, 1.35), 0.03)
        for i in range(7):     # the striped awning, sloping down to the front
            x0 = -0.75 + i * 1.5 / 7
            poly('aw%d' % i, rust if i % 2 == 0 else bone, [(x0, -0.5, 1.32), (x0 + 1.5 / 7, -0.5, 1.32), (x0 + 1.5 / 7, 0.34, 1.62), (x0, 0.34, 1.62)], [(0, 1, 2, 3)])
            P.box(bpy, 'val%d' % i, rust if i % 2 == 0 else bone, (1.5 / 7, 0.01, 0.12), (x0 + 0.75 / 7, -0.5, 1.26))
        for i, x in enumerate((-0.4, -0.1, 0.25)): P.cyl(bpy, 'ware%d' % i, (gold, teal, steel)[i], 0.1, 0.2, (x, 0, 0.89), verts=16)
    elif n == 'word':
        P.rod(bpy, 'pole', dwood, (0, 0, 0), (0, 0, 1.7), 0.035)
        verts = [(0.03, -0.01, 1.66), (0.85, -0.01, 1.6), (0.8, -0.01, 1.32), (0.03, -0.01, 1.2)]
        poly('flag', bone, verts, [(0, 1, 2, 3)])
        poly('flagband', rust, [(0.03, -0.012, 1.48), (0.83, -0.012, 1.48), (0.82, -0.012, 1.4), (0.03, -0.012, 1.37)], [(0, 1, 2, 3)])
        poly('flagb', bone, [verts[3], verts[2], verts[1], verts[0]], [(0, 1, 2, 3)])
    elif n == 'cross':
        P.box(bpy, 'mound', M('dirt', 'clay_rust', 1), (0.9, 0.5, 0.12), (0, 0.1, 0.06), bevel=0.05)
        P.box(bpy, 'upright', wood, (0.1, 0.07, 1.15), (0, 0, 0.6), bevel=0.01); P.box(bpy, 'arm', wood, (0.62, 0.07, 0.1), (0, -0.002, 0.88), bevel=0.01)
        P.rod(bpy, 'tie', M('rag', 'clay_bone', 2), (-0.06, -0.04, 0.86), (0.06, -0.04, 0.9), 0.012)
    elif n in ('skull', 'dead'):
        sk = red if n == 'skull' else M('sk', 'clay_bone', 3)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.5, location=(0, 0, 0.62)); P.put(bpy, bpy.context.active_object, 'cranium', sk)
        P.box(bpy, 'jaw', sk, (0.56, 0.42, 0.32), (0, -0.05, 0.25), bevel=0.08)
        for x in (-0.18, 0.18):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.14, location=(x, -0.42, 0.55)); P.put(bpy, bpy.context.active_object, 'eye', black)
        P.box(bpy, 'nose', black, (0.08, 0.05, 0.12), (0, -0.47, 0.36))
        for i in range(4): P.box(bpy, 'tooth%d' % i, M('teeth', 'clay_bone', 4) if n == 'skull' else black, (0.08, 0.03, 0.1), (-0.15 + i * 0.1, -0.27, 0.15))
        if n == 'dead':
            P.box(bpy, 'crack', black, (0.03, 0.01, 0.3), (0.12, -0.49, 0.78), (0, math.radians(30), 0))
        # the rig's camera looks down 45 degrees and stands a thing 1.41 tall (its 3/4 stretch): a skull upright shows its crown
        # and reads as an egg. Its face is turned up to the camera (35 degrees) and its height pre-squashed, so the sockets read
        root = bpy.data.objects.new('tilt', None); bpy.context.scene.collection.objects.link(root)
        for o in list(bpy.context.scene.objects):
            if o.parent is None and o is not root: o.parent = root
        root.rotation_euler = (math.radians(-35), 0, math.radians(-12 if n == 'dead' else 0)); root.scale = (1, 1, 0.8); root.location.z = 0.18
    elif n == 'tag':
        P.box(bpy, 'board', M('board', 'metal_painted', 1), (1.0, 0.06, 1.0), (0, 0, 0.62), bevel=0.01)
        P.rod(bpy, 'leg1', dwood, (-0.35, 0.05, 0), (-0.35, 0.05, 0.3), 0.03); P.rod(bpy, 'leg2', dwood, (0.35, 0.05, 0), (0.35, 0.05, 0.3), 0.03)
        for a in (45, -45): P.box(bpy, 'x', red, (0.95, 0.01, 0.13), (0, -0.035, 0.62), (0, math.radians(a), 0))
    elif n == 'flyer':
        P.rod(bpy, 'post', dwood, (0, 0.03, 0), (0, 0.03, 1.5), 0.05)
        P.box(bpy, 'paper', bone, (0.56, 0.006, 0.76), (0, -0.025, 1.0), (0, math.radians(4), 0))
        P.box(bpy, 'head', red, (0.44, 0.004, 0.13), (0, -0.03, 1.27), (0, math.radians(4), 0))
        for i in range(4): P.box(bpy, 'line%d' % i, black, (0.4 - (i % 2) * 0.1, 0.004, 0.035), (-(i % 2) * 0.05, -0.03, 1.1 - i * 0.12), (0, math.radians(4), 0))
        P.cyl(bpy, 'pin', red, 0.03, 0.03, (0, -0.04, 1.33), (math.radians(90), 0, 0), verts=12)
    elif n == 'radio':
        P.box(bpy, 'body', olive, (0.8, 0.3, 0.5), (0, 0, 0.25), bevel=0.04)
        P.box(bpy, 'grille', black, (0.36, 0.01, 0.34), (-0.16, -0.152, 0.25), bevel=0.01)
        for i in range(5): P.box(bpy, 'slot%d' % i, M('slot', 'rubber', 3), (0.34, 0.006, 0.025), (-0.16, -0.158, 0.13 + i * 0.06))
        P.box(bpy, 'dial', M('glass', 'glass_eye', 2), (0.26, 0.01, 0.12), (0.2, -0.152, 0.34))
        P.cyl(bpy, 'knob', chrome, 0.05, 0.03, (0.2, -0.16, 0.14), (math.radians(90), 0, 0), verts=16)
        P.rod(bpy, 'ant', chrome, (0.3, 0.05, 0.48), (0.5, 0.1, 1.25), 0.012)
        P.rod(bpy, 'handle', black, (-0.25, 0, 0.5), (0.15, 0, 0.5), 0.025)
    elif n == 'bar':
        IC.lathe(bpy, 'mug', M('beer', 'sodium', 3), [(0, 0), (0.22, 0), (0.24, 0.02), (0.25, 0.5), (0, 0.5)], n=24)
        IC.lathe(bpy, 'foam', bone, [(0, 0.48), (0.258, 0.48), (0.27, 0.53), (0.22, 0.6), (0.1, 0.63), (0, 0.635)], n=24)
        torus('handle', M('glass', 'clay_mustard', 4), 0.15, 0.04, (0.27, 0, 0.27), (math.radians(90), 0, 0), arc=(270, 450) if False else None)
        for i, z in enumerate((0.12, 0.38)): IC.lathe(bpy, 'ring%d' % i, M('rim', 'clay_mustard', 4), [(0.247, z), (0.26, z), (0.26, z + 0.025), (0.247, z + 0.025)], n=24)
    elif n == 'rubble':
        import random
        rnd = random.Random(7); con = M('con', 'tape_grey', 2); con2 = M('con2', 'tape_grey', 3)
        for i in range(9):
            a = rnd.uniform(0, 6.28); d = rnd.uniform(0, 0.5)
            P.chunk(bpy, 'c%d' % i, con if i % 2 else con2, (rnd.uniform(0.25, 0.5), rnd.uniform(0.2, 0.4), rnd.uniform(0.15, 0.35)), (math.cos(a) * d, math.sin(a) * d * 0.6, 0.12 + (0.25 if d < 0.2 else 0)), (rnd.uniform(0, 1), rnd.uniform(0, 1), rnd.uniform(0, 3)), rnd)
        for i in range(3): P.rod(bpy, 'rebar%d' % i, rust, (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.2, 0.2), 0.1), (rnd.uniform(-0.6, 0.6), rnd.uniform(-0.3, 0.3), rnd.uniform(0.6, 0.9)), 0.018)
    elif n == 'door':
        P.box(bpy, 'wall', M('wall', 'clay_bone', 2), (1.3, 0.16, 1.95), (0, 0.05, 0.975), bevel=0.01)
        P.box(bpy, 'hole', black, (0.82, 0.18, 1.62), (0, 0.04, 0.81))
        P.box(bpy, 'frame', dwood, (0.94, 0.17, 0.08), (0, 0.035, 1.66))
        d = P.box(bpy, 'leaf', M('leaf', 'clay_rust', 2), (0.8, 0.05, 1.6), (0, 0, 0.8), bevel=0.01)
        d.location = (-0.4 + 0.4 * math.cos(math.radians(35)), -0.03 - 0.4 * math.sin(math.radians(35)), 0.8); d.rotation_euler.z = math.radians(-35)
        for z in (0.35, 1.25): P.box(bpy, 'panel', M('panel', 'clay_rust', 1), (0.6, 0.06, 0.6), (d.location.x, d.location.y - 0.003, z), (0, 0, math.radians(-35)))
        P.cyl(bpy, 'knob', gold, 0.04, 0.05, (d.location.x + 0.3 * math.cos(math.radians(35)), d.location.y - 0.3 * math.sin(math.radians(35)) - 0.05, 0.85), (math.radians(90), 0, math.radians(-35)), verts=12)
    elif n == 'battery':
        cell(0, 0, s=14)
    elif n == 'ask':
        q = M('q', 'clay_mustard', 3)
        P.rod(bpy, 'post', dwood, (0, 0.06, 0), (0, 0.06, 0.6), 0.04)
        torus('hook', q, 0.26, 0.075, (0, 0, 1.12), (math.radians(90), 0, 0), arc=(-40 + 360, 360 + 200) if False else None)
        o = bpy.context.active_object
        import bmesh
        bm = bmesh.new(); bm.from_mesh(o.data)
        kill = [v for v in bm.verts if (math.degrees(math.atan2(v.co.y, v.co.x)) % 360) > 200 and (math.degrees(math.atan2(v.co.y, v.co.x)) % 360) < 315]
        bmesh.ops.delete(bm, geom=kill, context='VERTS'); bm.to_mesh(o.data); bm.free()
        P.rod(bpy, 'stem', q, (0.0, 0, 0.88), (0.0, 0, 0.66), 0.075)
        P.rod(bpy, 'join', q, (0.17, 0, 0.92), (0.0, 0, 0.8), 0.075)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.1, location=(0, 0, 0.42)); P.put(bpy, bpy.context.active_object, 'dot', q)
        P.box(bpy, 'base', black, (0.36, 0.3, 0.06), (0, 0.04, 0.03), bevel=0.01)
    else:
        raise KeyError(n)


def model(n):
    import bpy
    import bohemia_cook_model_props as P
    import bohemia_cook_the_icons_through_the_rig_10_20_26 as IC
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(n, bpy, P, IC)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = os.path.join(OUT, 'models', n + '.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    json.dump(d, open(out[:-4] + '.json', 'w'))
    print('  model', n, [round(x, 3) for x in d], flush=True)


def rig(n):
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    RIG.G['samples'] = 40                         # COOK's icon setting: cut down 3x, 40 denoised samples
    glb = os.path.join(OUT, 'models', n + '.glb'); d = json.load(open(glb[:-4] + '.json'))
    _ship, (W, H) = ship_of(n)
    L = max(d[0], d[1]); Hh = d[2] * 1.414          # the rig's 3/4 stretch stands a thing at full height
    ppm = max(W, H) * 0.94 * UP / max(L, Hh * 0.75 + max(d[0], d[1]) * 0.5)
    out = os.path.join(OUT, n); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb, out, '--ppm', repr(ppm), '--no-calibration', '--no-id-pass', '--real-length', repr(L), '--no-shadow', '--wear', '0.3', '--snap', '0.35']
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=sum(map(ord, n)) % 97, bid=n)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post([stills[RIG.FACINGS.index(f)] for f in ('S', 'SE', 'SW')], out, A, pop, shadow=False, one_box=False)
    json.dump(dict(model=os.path.relpath(glb, R), ppm=ppm, files=[os.path.relpath(o, R) for o in outs], box=box), open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print('  rig', n, flush=True)


# the three-quarter turn (SE) shows two faces and reads as a solid; the flat signs read front-on (S)
FACE = {'door': 'S', 'flyer': 'S', 'tag': 'S', 'danger': 'S', 'skull': 'S', 'ask': 'S', 'cross': 'S', 'word': 'S', 'bar': 'S', 'rounds': 'S', 'batteries': 'S', 'food': 'S'}


def cutimg(n, W, H):
    from PIL import Image, ImageFilter
    f = FACE.get(n, 'SE')
    p = os.path.join(OUT, n, 'rig_%s.png' % f)
    im = Image.open(p).convert('RGBA'); im = im.crop(im.getbbox())
    k = min((W - 4) / im.width, (H - 4) / im.height)
    new = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    a = np.asarray(new).astype(np.float32)
    rgb = Image.fromarray(a[..., :3].clip(0, 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=2))
    a[..., :3] = np.asarray(rgb).astype(np.float32); op = a[..., 3] > 110; a[..., 3] = np.where(op, 255, 0)
    pd = np.pad(op, 1); grow = pd[:-2, 1:-1] | pd[2:, 1:-1] | pd[1:-1, :-2] | pd[1:-1, 2:]
    edge = grow & ~op; a[edge] = (22, 19, 17, 235)
    new = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')
    out = Image.new('RGBA', (W, H)); out.alpha_composite(new, ((W - new.width) // 2, H - new.height - 2))
    return out


def cut(n):
    dst, (W, H) = ship_of(n)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    out = cutimg(n, W, H)
    if n in SUPPLY:                                     # the bar's picture: trimmed to the thing, the bar fits it in 32 points
        out = out.crop(out.getbbox())
    out.save(dst, optimize=True)
    led = os.path.join(OUT, 'swapped.json'); L_ = json.load(open(led)) if os.path.exists(led) else {}
    L_[n] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), size=list(out.size))
    if n in SMALL:                                      # the 10-point marks beside a price (supplyIcon): 30 px, one to one
        sm = os.path.join(R, 'slices/supply_icons/small', n + '.png'); os.makedirs(os.path.dirname(sm), exist_ok=True)
        cutimg(n, 30, 30).save(sm, optimize=True)
        L_['small/' + n] = dict(file=os.path.relpath(sm, R), sha1=hashlib.sha1(open(sm, 'rb').read()).hexdigest(), size=[30, 30])
    for s, src in STALL.items():                         # the stall's copy, cut into its own canvas (the market's frame)
        if src != n: continue
        from PIL import Image
        sp = os.path.join(R, 'slices/market_icons', s + '.png'); w, h = Image.open(sp).size
        if s == 's_food':                                 # the stall shows the bar's own picture (the six gate: the same file)
            open(sp, 'wb').write(open(dst, 'rb').read())
        else:
            cutimg(n, w, h).save(sp, optimize=True)
        L_[s] = dict(file=os.path.relpath(sp, R), sha1=hashlib.sha1(open(sp, 'rb').read()).hexdigest(), size=[w, h])
    json.dump(L_, open(led, 'w'), indent=1, sort_keys=True)
    print('  cut', n, out.size, flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd = a[0] if a and a[0] in ('model', 'rig', 'cut') else 'all'
    want = [x for x in a if x not in ('model', 'rig', 'cut')] or SUPPLY + MARKERS
    if cmd == 'model': model(want[0])
    elif cmd == 'rig': rig(want[0])
    elif cmd == 'cut': [cut(n) for n in want]
    else:
        for n in want:
            for step in ('model', 'rig'):
                r = subprocess.run([VENV, os.path.abspath(__file__), step, n], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l)[-700:], flush=True)
            try: cut(n)
            except Exception as e: print('  cut failed', n, e, flush=True)
    sys.stdout.flush(); os._exit(0)
