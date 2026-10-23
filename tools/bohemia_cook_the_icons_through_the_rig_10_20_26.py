#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], THE ITEM ICONS THROUGH THE RIG, SWAPPED STRAIGHT IN (10/20/26).
Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'; 'items and their icons'); rule 123: no card.
The market and the crew screen draw slices/market_icons/*.png: eighteen pack tiles copied as they were (RUN TWO 10/11,
SOURCES.txt), three of them the wrong thing (the 'rifle' is his suppressed pistol, the 'shotgun' his SMG, the 'spear' a
crowbar). Each is made here as the thing its name says, in real metres with flat palette colours, and rendered through
the master rig (tools/bohemia_direction_master_rig.py, imported, never edited: its source pass, dents, sun and post) with
the floor tool's grime, the item stood up on its diagonal the way an inventory shows a thing, the rig's own camera (45 degrees, heights at full
size); the guns are COOK's own (gun_pistol_a, gun_rifle_a, gun_shotgun_a, the rig's first guns, imported untouched).
Cut into the old icon's canvas (the same file, the same size), centred, the widest side at the old one's.

  <venv>/bin/python tools/bohemia_cook_the_icons_through_the_rig_10_20_26.py [w_axe ...]   (about 15 s an icon)

REFERENCE CHECK (the 9/4 standing duty): the old icons are the twins (their canvas, their fill); real things at real
sizes: a felling axe 0.9 m, a sledge 0.9 m, a machete 0.6 m, a meat cleaver 0.3 m, a Molotov in a 0.75 l bottle, a
spear of rebar on a pole 1.8 m, a one-gallon water jug, a can of beans, an ammunition box, a farrier's anvil on its
stump, a bench vise on its bench. No reference game.
REUSE CHECK (REUSE-FIRST): the props modeller's helpers (mat, box, cyl, rod, chunk), COOK's gun glbs, the master rig.
TASTE CHECK: the rig is the look (rule 115); a thing is what its name says.
"""
import os, sys, json, math, hashlib, subprocess
import numpy as np
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/market_icons')
OUT = os.path.join(R, 'records/target/cook_icons_rig')
MODELS = os.path.join(R, 'reference/models/bohemia')
VENV = '/home/user/v/bin/python'
BASE_SHA = 'c12f16127eb6424f5007babc0f0e6851daf51698'
GUNS = {'w_pistol': 'gun_pistol_a.glb', 'w_rifle': 'gun_rifle_a.glb', 'w_shotgun': 'gun_shotgun_a.glb'}
UP = 3                                   # 10/22: the render is three times the icon, cut down with a real filter
DIAG = {'w_bottles': 0, 'b_smith': 0, 'b_armourer': 0, 's_food': 0, 's_meds': 0, 's_rounds': 0, 's_water': 0, 'w_pistol': 0, 'w_rifle': 0, 'w_shotgun': 0,
        # 10/23: the long weapons are drawn as icons (their heads and hafts at icon proportions, see LONG) and lean to their
        # old frame's own diagonal (atan of its width over its height); the flail is drawn in the plane, its chain hanging
        'w_axe': 0, 'w_sledge': 0, 'w_spear': 37, 'w_pole': 33, 'w_chain': 0}
# 10/23: THE LONG WEAPONS AS ICONS. 10/22's cut fattened the whole of a long thing across its length (up to 2.2x) and every
# one came out a log: a spear, a pole and a flail read as the same brown cylinder at 96 px. An inventory icon is not a
# thing at its girth: it is a TAPERED haft at about 1.5x, a HEAD at 1.5 to 1.7x its real size with a bright ground edge
# against a dark body, and a silhouette that says what it is (the axe's wedge, the flail's chain and ball, the Molotov's
# rag). So these are built that way here and the global fatten is kept for the guns only (1.6x their girth).
LONG = ('w_axe', 'w_sledge', 'w_spear', 'w_pole', 'w_chain', 'w_bottles')
GUN_GIRTH = 1.6


def mesh(bpy, name, verts, faces, m, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(map(float, v)) for v in verts], [], faces); me.update(calc_edges=True)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(m)
    if smooth:
        for p in me.polygons: p.use_smooth = True
    return o


def lathe(bpy, name, m, prof, n=18, smooth=True):
    """a turned thing: prof is (radius, z) from the bottom up, revolved about z; a radius of 0 closes the end"""
    verts, faces, rings = [], [], []
    for r, z in prof:
        if r <= 0: rings.append([len(verts)]); verts.append((0, 0, z)); continue
        rings.append(list(range(len(verts), len(verts) + n)))
        verts += [(r * math.cos(2 * math.pi * k / n), r * math.sin(2 * math.pi * k / n), z) for k in range(n)]
    for a, b in zip(rings[:-1], rings[1:]):
        if len(a) == 1 and len(b) == 1: continue
        if len(a) == 1: faces += [(a[0], b[(k + 1) % n], b[k]) for k in range(n)]
        elif len(b) == 1: faces += [(a[(k + 1) % n], b[0], a[k]) for k in range(n)]
        else: faces += [(a[k], a[(k + 1) % n], b[(k + 1) % n], b[k]) for k in range(n)]
    return mesh(bpy, name, verts, faces, m, smooth)


def loft(bpy, name, m, secs, axis='z'):
    """a flat steel thing (a blade, a wedge, a head) from cross-sections: each is (s, a0, a1, t0, t1): at s along the axis
    it spans a0..a1 across, t0 thick (each way) at the a0 side and t1 at the a1 side; y is always the depth"""
    verts, faces = [], []
    for s, a0, a1, t0, t1 in secs:
        q = ((a0, -t0), (a1, -t1), (a1, t1), (a0, t0))
        verts += [((a, d, s) if axis == 'z' else (s, d, a)) for a, d in q]
    for i in range(len(secs) - 1):
        o = 4 * i
        faces += [(o + k, o + (k + 1) % 4, o + 4 + (k + 1) % 4, o + 4 + k) for k in range(4)]
    faces += [(3, 2, 1, 0), (4 * (len(secs) - 1), 4 * (len(secs) - 1) + 1, 4 * (len(secs) - 1) + 2, 4 * (len(secs) - 1) + 3)]
    o = mesh(bpy, name, verts, faces, m, smooth=False)
    if axis == 'x':                                            # the axis swap mirrors the winding: put the normals out again
        for p in o.data.polygons: p.flip()
    return o


def link(bpy, name, m, at, along, turn, major=0.03, minor=0.009):
    """one chain link at a point, its long side along a direction, turned a quarter about it every other link"""
    import mathutils
    bpy.ops.mesh.primitive_torus_add(major_segments=14, minor_segments=6, major_radius=major, minor_radius=minor, location=at)
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m)
    t = mathutils.Vector(along).normalized(); up = mathutils.Vector((0, 1, 0)) if abs(t.y) < 0.9 else mathutils.Vector((1, 0, 0))
    n1 = t.cross(up).normalized(); n2 = t.cross(n1).normalized()
    nz = n2 if turn else n1; ny = nz.cross(t).normalized()
    M = mathutils.Matrix((t * 1.45, ny, nz)).transposed()     # the torus's x stretched along the chain: an oval link
    o.matrix_world = mathutils.Matrix.Translation(mathutils.Vector(at)) @ M.to_4x4()
    for p in o.data.polygons: p.use_smooth = True
    return o


def build(name, bpy, P):
    """an icon is read at 96 px: a 2 cm haft is one pixel, so every rod is drawn 1.9 times its real thickness (the
    way his pack's icons draw a handle), lengths and heads at their real size"""
    import random
    rod0 = P.rod
    class _P: pass
    Q = _P(); Q.__dict__.update({k: getattr(P, k) for k in dir(P) if not k.startswith('__')})
    Q.rod = lambda bpy_, n, m, a, b, r, v=8: rod0(bpy_, n, m, a, b, r * 1.9, v)
    P = Q
    rnd = random.Random(sum(map(ord, name)))
    wood, steel, rust, dark = P.mat(bpy, 'wood', 'clay_mustard', 1), P.mat(bpy, 'steel', 'tape_grey', 2), P.mat(bpy, 'rust', 'clay_rust', 1), P.mat(bpy, 'grip', 'rubber', 1)
    if name in GUNS:
        P.import_model(bpy, os.path.join(MODELS, GUNS[name]), (0, 0, 0), (0, 0, 0)); return
    # 10/23: THE LONG WEAPONS AS ICONS (LONG above): turned hafts, heads 1.5 to 1.7x, a bright ground edge on a dark body
    iron = P.mat(bpy, 'iron', 'metal_painted', 1); edge = P.mat(bpy, 'edge', 'chrome', 1); haft = P.mat(bpy, 'haft', 'clay_mustard', 1)
    tape = P.mat(bpy, 'tape', 'rubber', 2)
    if name == 'w_axe':
        lathe(bpy, 'haft', haft, [(0, 0), (0.042, 0), (0.046, 0.025), (0.033, 0.07), (0.028, 0.45), (0.031, 0.72), (0.036, 0.84), (0.036, 0.95), (0, 0.955)])
        lathe(bpy, 'wrap', tape, [(0, 0.08), (0.035, 0.08), (0.035, 0.24), (0, 0.24)], n=14)
        # the head: the poll, the eye round the haft, the cheek flaring to a bearded bit, then the ground edge
        loft(bpy, 'head', iron, [(-0.1, 0.79, 0.9, 0.05, 0.05), (-0.05, 0.775, 0.915, 0.056, 0.056), (0.05, 0.78, 0.91, 0.052, 0.052),
                                 (0.2, 0.69, 0.94, 0.018, 0.018), (0.25, 0.66, 0.95, 0.01, 0.01)], axis='x')
        loft(bpy, 'bit', edge, [(0.25, 0.66, 0.95, 0.01, 0.01), (0.3, 0.63, 0.965, 0.003, 0.003)], axis='x')
    elif name == 'w_sledge':
        lathe(bpy, 'haft', haft, [(0, 0), (0.04, 0), (0.044, 0.03), (0.034, 0.08), (0.03, 0.5), (0.034, 0.8), (0.038, 0.93), (0, 0.935)])
        lathe(bpy, 'grip', tape, [(0, 0.06), (0.042, 0.06), (0.042, 0.3), (0, 0.3)], n=14)
        P.box(bpy, 'head', iron, (0.36, 0.17, 0.17), (0, 0, 0.88), bevel=0.025)
        for s in (-1, 1): P.box(bpy, 'face_%d' % s, edge, (0.025, 0.15, 0.15), (s * 0.185, 0, 0.88), bevel=0.012)
        P.box(bpy, 'wedge', P.mat(bpy, 'wedge', 'clay_rust', 1), (0.05, 0.05, 0.04), (0, 0, 0.975))
    elif name == 'w_spear':
        # a sign post's pipe sharpened into a leaf of spring steel, lashed with wire, a rag tied under it
        lathe(bpy, 'shaft', haft, [(0, 0), (0.032, 0), (0.034, 0.03), (0.03, 0.8), (0.033, 1.42), (0, 1.43)], n=12)
        lathe(bpy, 'grip', tape, [(0, 0.55), (0.037, 0.55), (0.037, 0.8), (0, 0.8)], n=12)
        loft(bpy, 'blade', iron, [(1.3, -0.03, 0.03, 0.022, 0.022), (1.45, -0.075, 0.075, 0.018, 0.018), (1.62, -0.06, 0.06, 0.012, 0.012), (1.82, -0.004, 0.004, 0.004, 0.004)])
        loft(bpy, 'edge_l', edge, [(1.45, -0.088, -0.07, 0.003, 0.016), (1.62, -0.07, -0.055, 0.003, 0.011), (1.82, -0.006, 0.0, 0.002, 0.004)])
        loft(bpy, 'edge_r', edge, [(1.45, 0.07, 0.088, 0.016, 0.003), (1.62, 0.055, 0.07, 0.011, 0.003), (1.82, 0.0, 0.006, 0.004, 0.002)])
        for k in range(6): lathe(bpy, 'wire_%d' % k, steel, [(0, 1.3 + k * 0.025), (0.04, 1.3 + k * 0.025), (0.04, 1.315 + k * 0.025), (0, 1.315 + k * 0.025)], n=10)
        rag = P.mat(bpy, 'rag', 'clay_rust', 2)
        loft(bpy, 'rag', rag, [(1.29, 0.03, 0.11, 0.012, 0.008), (1.22, 0.05, 0.13, 0.01, 0.006), (1.1, 0.08, 0.15, 0.008, 0.005), (1.0, 0.1, 0.15, 0.006, 0.004)])
    elif name == 'w_pole':
        # a polearm: a pipe topped with a glaive cut from a mower blade, two bolts, a rebar hook behind
        post = P.mat(bpy, 'post', 'metal_painted', 2)
        lathe(bpy, 'pole', post, [(0, 0), (0.03, 0), (0.03, 1.32), (0, 1.33)], n=12)
        lathe(bpy, 'grip', tape, [(0, 0.35), (0.035, 0.35), (0.035, 0.6), (0, 0.6)], n=12)
        blade = P.mat(bpy, 'blade', 'clay_rust', 2)
        loft(bpy, 'blade', blade, [(1.18, -0.035, 0.07, 0.02, 0.014), (1.32, -0.035, 0.15, 0.016, 0.01), (1.48, -0.03, 0.16, 0.012, 0.006), (1.62, -0.01, 0.1, 0.008, 0.004), (1.72, 0.03, 0.045, 0.003, 0.002)])
        loft(bpy, 'blade_edge', edge, [(1.18, 0.07, 0.085, 0.012, 0.003), (1.32, 0.15, 0.17, 0.009, 0.003), (1.48, 0.16, 0.18, 0.006, 0.002), (1.62, 0.1, 0.12, 0.004, 0.002), (1.72, 0.045, 0.05, 0.002, 0.001)])
        for z in (1.22, 1.3): P.cyl(bpy, 'bolt_%d' % int(z * 100), steel, 0.014, 0.08, (0.0, 0, z), (math.radians(90), 0, 0), verts=8)
        hook = P.mat(bpy, 'hook', 'clay_rust', 1)
        P.rod(bpy, 'hook_a', hook, (-0.02, 0, 1.36), (-0.15, 0, 1.4), 0.01, 8); P.rod(bpy, 'hook_b', hook, (-0.15, 0, 1.4), (-0.17, 0, 1.31), 0.01, 8)
    elif name == 'w_chain':
        # a flail: a turned club handle, a chain off its head, a spiked iron ball on the chain, drawn in the plane
        import mathutils
        h0, h1 = mathutils.Vector((-0.3, 0, 0)), mathutils.Vector((0.08, 0, 0.42))
        hd = lathe(bpy, 'handle', haft, [(0, 0), (0.045, 0), (0.048, 0.025), (0.032, 0.06), (0.03, 0.3), (0.038, 0.5), (0.044, 0.56), (0, 0.565)], n=16)
        hd.rotation_mode = 'QUATERNION'; hd.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(h1 - h0); hd.location = h0
        g_ = lathe(bpy, 'grip', tape, [(0, 0.05), (0.036, 0.05), (0.036, 0.24), (0, 0.24)], n=12)
        g_.rotation_mode = 'QUATERNION'; g_.rotation_quaternion = hd.rotation_quaternion; g_.location = h0
        top = h0 + (h1 - h0).normalized() * 0.57
        cap = P.cyl(bpy, 'cap', steel, 0.05, 0.05, tuple(top), verts=12); cap.rotation_mode = 'QUATERNION'; cap.rotation_quaternion = hd.rotation_quaternion
        # the chain droops off the head and down to the ball
        pts = [top + mathutils.Vector((0.05 + 0.055 * k, 0, 0.03 - 0.012 * k * k)) for k in range(7)]
        for k in range(len(pts) - 1):
            link(bpy, 'link_%d' % k, steel, tuple((pts[k] + pts[k + 1]) / 2), tuple(pts[k + 1] - pts[k]), k % 2, major=0.026, minor=0.008)
        ball_at = pts[-1] + mathutils.Vector((0.03, 0, -0.08))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=18, ring_count=10, radius=0.085, location=tuple(ball_at)); P.put(bpy, bpy.context.active_object, 'ball', P.mat(bpy, 'ball', 'clay_rust', 1))
        for k in range(14):                                     # bolts welded on as spikes
            th, ph = rnd.uniform(0, 2 * math.pi), math.acos(rnd.uniform(-0.9, 0.9)); d = mathutils.Vector((math.sin(ph) * math.cos(th), math.sin(ph) * math.sin(th), math.cos(ph)))
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.018, depth=0.06, location=tuple(ball_at + d * 0.1))
            o = bpy.context.active_object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(d); P.put(bpy, o, 'spike_%d' % k, steel, smooth=False)
    elif name == 'w_machete':
        P.box(bpy, 'grip', dark, (0.03, 0.025, 0.14), (0, 0, 0.07), bevel=0.006)
        P.box(bpy, 'blade', steel, (0.05, 0.004, 0.45), (0.005, 0, 0.37)); P.box(bpy, 'rust_patch', rust, (0.035, 0.006, 0.08), (0.01, 0, 0.3))
    elif name == 'w_cleaver':
        P.box(bpy, 'grip', wood, (0.028, 0.024, 0.12), (0, 0, 0.06), bevel=0.006)
        P.box(bpy, 'blade', steel, (0.1, 0.005, 0.18), (0.035, 0, 0.21))
    elif name == 'w_pipe':
        P.rod(bpy, 'pipe', P.mat(bpy, 'pipe', 'metal_painted', 1), (0, 0, 0), (0, 0, 0.62), 0.018, 10)
        P.cyl(bpy, 'elbow', steel, 0.028, 0.06, (0, 0, 0.64), verts=10); P.box(bpy, 'tape', dark, (0.04, 0.04, 0.12), (0, 0, 0.08))
    elif name == 'w_bottles':
        # 10/23: a Molotov: a turned brown bottle, its paper label, tape round the neck, a rag stuffed in and hanging
        # down its shoulder, the rag's tip black where it was lit once and went out
        glass = P.mat(bpy, 'bottle', 'clay_rust', 1); label = P.mat(bpy, 'label', 'clay_bone', 3); rag = P.mat(bpy, 'rag', 'clay_bone', 2)
        lathe(bpy, 'body', glass, [(0, 0), (0.036, 0), (0.042, 0.008), (0.043, 0.17), (0.04, 0.195), (0.028, 0.22), (0.017, 0.245), (0.0155, 0.3), (0.018, 0.303), (0.018, 0.315), (0, 0.316)], n=22)
        lathe(bpy, 'label', label, [(0, 0.05), (0.0445, 0.05), (0.0445, 0.13), (0, 0.13)], n=22)
        lathe(bpy, 'neck_tape', P.mat(bpy, 'neck_tape', 'tape_grey', 2), [(0, 0.255), (0.019, 0.255), (0.019, 0.285), (0, 0.285)], n=14)
        loft(bpy, 'rag', rag, [(0.3, -0.016, 0.016, 0.012, 0.012), (0.34, -0.022, 0.024, 0.014, 0.01), (0.39, -0.01, 0.035, 0.012, 0.008), (0.41, 0.01, 0.04, 0.008, 0.006)])
        loft(bpy, 'rag_tail', rag, [(0.15, 0.044, 0.064, 0.005, 0.004), (0.2, 0.038, 0.062, 0.006, 0.005), (0.26, 0.02, 0.05, 0.008, 0.006), (0.31, 0.012, 0.04, 0.01, 0.008)])
        loft(bpy, 'rag_tip', P.mat(bpy, 'soot', 'cloth_black', 1), [(0.41, 0.01, 0.04, 0.008, 0.006), (0.435, 0.02, 0.038, 0.005, 0.004)])
    elif name == 's_food':
        # 10/22: two cans, one stood and one rolled over, rims and a ring pull, so it reads as tins at 96 px
        tin = P.mat(bpy, 'tin', 'chrome', 2); lab = P.mat(bpy, 'label', 'clay_rust', 2); lab2 = P.mat(bpy, 'label_band', 'clay_mustard', 2)
        for k, (loc, rot) in enumerate((((0, 0, 0.055), (0, 0, 0)), ((0.07, 0.05, 0.043), (math.radians(90), 0, math.radians(30))))):
            P.cyl(bpy, 'can_%d' % k, tin, 0.042, 0.11, loc, rot, verts=20); P.cyl(bpy, 'label_%d' % k, lab, 0.0428, 0.07, loc, rot, verts=20)
            P.cyl(bpy, 'band_%d' % k, lab2, 0.0431, 0.016, loc, rot, verts=20)
        for z in (0.002, 0.108): P.cyl(bpy, 'rim_%d' % int(z * 1000), tin, 0.0445, 0.006, (0, 0, z), verts=20)
        P.box(bpy, 'pull', P.mat(bpy, 'pull', 'tape_grey', 3), (0.03, 0.012, 0.003), (0.012, 0, 0.112))
    elif name == 's_meds':
        bag = P.mat(bpy, 'bag', 'clay_bone', 1); cross = P.mat(bpy, 'cross', 'blood', 1)
        P.box(bpy, 'case', bag, (0.3, 0.12, 0.2), (0, 0, 0.1), bevel=0.02)
        P.box(bpy, 'cross_h', cross, (0.09, 0.004, 0.03), (0, -0.061, 0.11)); P.box(bpy, 'cross_v', cross, (0.03, 0.004, 0.09), (0, -0.061, 0.11))
        P.rod(bpy, 'handle', dark, (-0.06, 0, 0.2), (0.06, 0, 0.2), 0.01, 6)
    elif name == 's_rounds':
        # 10/22: the rounds are the thing: five rifle cartridges on a stripper clip, standing, copper tips, at 2x their
        # real girth against the clip so the brass reads at 96 px (the first cut's five rods read as a comb)
        brass = P.mat(bpy, 'brass', 'clay_mustard', 1); tip = P.mat(bpy, 'tip', 'clay_rust', 1)
        P.box(bpy, 'clip', P.mat(bpy, 'clip', 'tape_grey', 1), (0.08, 0.03, 0.012), (0, 0, 0.006), bevel=0.002)
        for k in range(3):
            x = -0.025 + k * 0.025
            P.cyl(bpy, 'case_%d' % k, brass, 0.011, 0.07, (x, 0, 0.047), verts=14)
            P.cyl(bpy, 'neck_%d' % k, brass, 0.007, 0.012, (x, 0, 0.088), verts=12)
            bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.0068, depth=0.03, location=(x, 0, 0.108)); P.put(bpy, bpy.context.active_object, 'tip_%d' % k, tip)
    elif name == 's_water':
        jug = P.mat(bpy, 'jug', 'clay_teal', 3)
        P.box(bpy, 'jug', jug, (0.15, 0.15, 0.26), (0, 0, 0.13), bevel=0.03); P.cyl(bpy, 'cap', P.mat(bpy, 'cap', 'tape_grey', 3), 0.02, 0.03, (0.04, 0, 0.275), verts=10)
        P.box(bpy, 'handle', jug, (0.025, 0.05, 0.08), (-0.05, 0, 0.27))
    elif name == 'b_smith':
        # 10/22: the anvil is the thing: big on a short stump, its horn and heel and a hammer across its face
        iron = P.mat(bpy, 'anvil', 'metal_painted', 3)
        P.cyl(bpy, 'stump', wood, 0.2, 0.2, (0, 0, 0.18), verts=14)
        P.box(bpy, 'foot', iron, (0.34, 0.24, 0.07), (0, 0, 0.315), bevel=0.012); P.box(bpy, 'waist', iron, (0.2, 0.15, 0.1), (0, 0, 0.4))
        P.box(bpy, 'face', iron, (0.5, 0.17, 0.11), (0, 0, 0.5), bevel=0.012); P.box(bpy, 'heel', iron, (0.1, 0.13, 0.05), (0.27, 0, 0.53), bevel=0.008)
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.075, depth=0.24, location=(-0.36, 0, 0.51), rotation=(0, math.radians(-90), 0)); P.put(bpy, bpy.context.active_object, 'horn', iron)
        P.rod(bpy, 'hammer', wood, (0.05, -0.04, 0.58), (0.36, -0.16, 0.6), 0.014, 8); P.box(bpy, 'hammer_head', steel, (0.05, 0.05, 0.11), (0.05, -0.04, 0.59), bevel=0.006)
    elif name == 'b_armourer':
        # 10/22: a low bench so the tools are the icon, not the legs
        P.box(bpy, 'bench', wood, (0.9, 0.4, 0.06), (0, 0, 0.8)); [P.box(bpy, 'leg_%d' % i, wood, (0.08, 0.08, 0.2), (x, 0, 0.69)) for i, x in enumerate((-0.4, 0.4))]
        # 10/22: the vise big and teal, a riveted plate stood against the wall board, a helmet on the bench
        vm = P.mat(bpy, 'vise', 'clay_teal', 1)
        P.box(bpy, 'vise', vm, (0.24, 0.16, 0.14), (0.24, -0.04, 0.9), bevel=0.012); P.box(bpy, 'jaw', vm, (0.06, 0.16, 0.2), (0.38, -0.04, 0.93), bevel=0.01)
        P.rod(bpy, 'vise_bar', steel, (0.43, -0.2, 0.92), (0.43, 0.12, 0.92), 0.012, 8)
        P.box(bpy, 'board', wood, (0.9, 0.04, 0.5), (0, 0.2, 1.08))
        P.box(bpy, 'plate', P.mat(bpy, 'plate', 'tape_grey', 1), (0.32, 0.03, 0.4), (-0.2, 0.15, 1.04), (math.radians(-8), 0, 0.08), bevel=0.015)
        for i in range(4): P.cyl(bpy, 'rivet_%d' % i, steel, 0.012, 0.01, (-0.32 + (i % 2) * 0.24, 0.13, 0.9 + (i // 2) * 0.3), (math.radians(90), 0, 0), verts=8)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.19, location=(-0.08, -0.06, 0.83)); h = bpy.context.active_object
        for v in h.data.vertices:
            if v.co.z < 0: v.co.z = 0
        P.put(bpy, h, 'helmet', P.mat(bpy, 'helmet', 'metal_painted', 2))
    else:
        raise KeyError(name)


def model(name):
    import bpy
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(name, bpy, P)
    from PIL import Image
    ow, oh = Image.open(os.path.join(OUT, 'orig', name + '.png')).size
    lean = math.radians(DIAG.get(name, 40 if ow > oh * 0.6 else 0))      # a narrow frame takes the thing upright
    root = bpy.data.objects.new('lean', None); bpy.context.scene.collection.objects.link(root)
    for o in list(bpy.context.scene.objects):
        if o.parent is None and o is not root: o.parent = root
    # 10/22: AN ICON'S PROPORTIONS: a long thin thing (a spear, a pole, a rifle) is fattened across its length up to 2.2x,
    # the way every inventory icon draws it (at true girth a 1.8 m spear is a two-pixel line in a 96 px frame)
    bpy.context.view_layer.update(); d0 = P.dims(bpy); ax = int(np.argmax(d0)); mid = sorted(d0)[1]
    fat = GUN_GIRTH if name in GUNS else (1.0 if name in LONG else float(np.clip(d0[ax] / max(mid, 1e-3) / 5.0, 1.0, 2.2)))   # 10/23
    root.scale = tuple(1.0 if i == ax else fat for i in range(3))
    root.rotation_euler = (0, lean, 0)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = os.path.join(OUT, 'models', name + '.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    json.dump(d, open(out[:-4] + '.json', 'w'))
    print('  model', name, d, flush=True)


def rig(name):
    from PIL import Image
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    RIG.G['samples'] = 40                     # 10/22: an icon is cut down 3x from the render: 40 denoised samples, not the guide's 128
    glb = os.path.join(OUT, 'models', name + '.glb'); d = json.load(open(glb[:-4] + '.json'))
    old = Image.open(os.path.join(OUT, 'orig', name + '.png'))
    # 10/22: rendered at THREE times the icon (the first cut rendered at the icon's own size and read blurry and small), the
    # wear at 0.3 and the snap at 0.35 (at the guide's 0.6 and 0.6 every icon came out the same dusty grey: the vibe went
    # down, rule 123(d)); three facings posted, the cut keeps the one that fills the old frame best
    span_px = max(old.size) * 0.94 * UP
    L = max(d[0], d[1]); Hh = d[2]
    ppm = span_px / max(L, Hh * 1.05)
    out = os.path.join(OUT, name); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb, out, '--ppm', repr(ppm), '--no-calibration', '--no-id-pass', '--real-length', repr(L), '--no-shadow', '--wear', '0.3', '--snap', '0.35']
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=sum(map(ord, name)) % 97, bid=name)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post([stills[RIG.FACINGS.index(f)] for f in ('S', 'SE', 'SW')], out, A, pop, shadow=False, one_box=False)
    json.dump(dict(model=os.path.relpath(glb, R), ppm=ppm, files=[os.path.relpath(o, R) for o in outs], box=box), open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print('  rig', name, outs[0], flush=True)


def cut(name):
    from PIL import Image
    from PIL import ImageFilter
    old = Image.open(os.path.join(OUT, 'orig', name + '.png')).convert('RGBA'); W, H = old.size
    best = None
    for f in ('S', 'SE', 'SW'):                                # the facing that fills the old frame most (S wins a tie)
        p = os.path.join(OUT, name, 'rig_%s.png' % f)
        if not os.path.exists(p): continue
        im = Image.open(p).convert('RGBA'); im = im.crop(im.getbbox())
        k = min((W - 4) / im.width, (H - 4) / im.height)
        area = im.width * im.height * k * k * (float((np.asarray(im)[..., 3] > 0).mean()))
        if best is None or area > best[0] * 1.08: best = (area, im, k, f)
    _a, new, k, face = best
    new = new.resize((max(1, round(new.width * k)), max(1, round(new.height * k))), Image.LANCZOS)   # down from 3x: premultiplied
    a = np.asarray(new).astype(np.float32)
    rgb = Image.fromarray(a[..., :3].clip(0, 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=2))
    a[..., :3] = np.asarray(rgb).astype(np.float32); op = a[..., 3] > 110; a[..., 3] = np.where(op, 255, 0)
    # THE EDGE: one pixel of near-black outside the silhouette, the way every icon on the market shelf reads at 96 px
    pd = np.pad(op, 1); grow = pd[:-2, 1:-1] | pd[2:, 1:-1] | pd[1:-1, :-2] | pd[1:-1, 2:]
    edge = grow & ~op; a[edge] = (22, 19, 17, 235)
    new = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')
    out = Image.new('RGBA', (W, H)); out.alpha_composite(new, ((W - new.width) // 2, (H - new.height) // 2))
    dst = os.path.join(SHIP, name + '.png'); out.save(dst, optimize=True)
    led = os.path.join(OUT, 'swapped.json'); L_ = json.load(open(led)) if os.path.exists(led) else {}
    L_[name] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), size=[W, H])
    json.dump(L_, open(led, 'w'), indent=1)
    print('  cut', name, (W, H), flush=True)


def names():
    return sorted(n[:-4] for n in os.listdir(os.path.join(OUT, 'orig')) if n.endswith('.png'))


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd = a[0] if a and a[0] in ('model', 'rig', 'cut') else 'all'
    want = [x for x in a if x not in ('model', 'rig', 'cut')]
    os.makedirs(os.path.join(OUT, 'orig'), exist_ok=True)
    for f in sorted(os.listdir(SHIP)):
        if f.endswith('.png') and not os.path.exists(os.path.join(OUT, 'orig', f)):
            open(os.path.join(OUT, 'orig', f), 'wb').write(subprocess.check_output(['git', 'show', '%s:slices/market_icons/%s' % (BASE_SHA, f)], cwd=R))
    if cmd == 'model': model(want[0])
    elif cmd == 'rig': rig(want[0])
    elif cmd == 'cut': [cut(n) for n in (want or names())]
    else:
        for n in (want or names()):
            for step in ('model', 'rig'):
                r = subprocess.run([VENV, os.path.abspath(__file__), step, n], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l)[-600:], flush=True)
            try: cut(n)
            except Exception as e: print('  cut failed', n, e, flush=True)
    sys.stdout.flush(); os._exit(0)
