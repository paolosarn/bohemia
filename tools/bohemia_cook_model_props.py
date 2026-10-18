#!/usr/bin/env python3
"""BOHEMIA -- COOK [props through the rig]: THE LAMP, THE GUN AND THE WRECK, MODELLED AT THE SOURCE (rule 115a: every
prop is modelled and rendered through DIRECTION's master rig, the clay-and-tape way the truck and the drum were made;
his two NOs on the parts grammar, 'this isn't that' and 'one of the worst cooks', closed the 2D road).

Built like DIRECTION's drum (tools/bohemia_direction_model_drum.py): puppet shapes, not CAD bodies; every base colour a
step of one role of records/target/BOHEMIA_STYLE_PALETTE.json; roughness 1, specular 0 (the rig's source pass puts the
wear on top); real sizes in metres; and ONE asymmetric thing each (the guide's silhouette rule), on the side the S
camera sees (glTF front is -Y).

  lamp   a 3.2 m pedestrian lamp post, the twin's family (pack:18. Light sources and fire barrels#3, the straight-arm
         post): an octagonal plinth, a pole with a collar, a straight arm with its brace, a cone shade hung from the arm
         on a short chain link, a sodium bulb (the only self-lit colour). The odd thing: a strip of masking tape and a
         paper flyer wrapped round the pole at eye height, and the shade knocked 9 degrees off true.
  gun    a heavy machine gun on its low tripod, 1.75 m flash hider to ammo can, the twin's set (pack:12. Weapons and supplies#11, the
         SMG, the nearest he owns): a receiver, a cooling jacket with its vent rings, three splayed legs, an ammo can on
         the ground with the brass belt riding up into the feed. The odd thing: grey tape round a cracked jacket, its
         tail hanging. (A shotgun was tried first: at true size it is a 60 x 6 px stick, under the prop floor.)
  wreck  a 4.7 m four-door sedan, dead (pack:9. Abandoned cards#0): a body shell from boxes pulled into a puppet's
         shape, the cabin sunk, a caved roof, windows gone dark, one front wheel missing so the nose sits on its rim
         (the odd thing), the bonnet sprung open 12 degrees, rust patches as their own panels.

[the block war's cover] 10/18 (his 9/29 'MOST FIGHTS ARE BLOCK WARS'; COVER is the thinnest kind on any board, 389
against 2,899 blockers): the things a man stands behind in a city fight, each with --real-dims (DIRECTION round six).
  sandbags  a 2.6 m sandbag wall, 0.85 m high (cover under the 1.3 m chest line), real 0.56 x 0.3 x 0.13 m bags in
            seven courses, the twin pack:5. Barricades and defenses#2. The odd thing: the right-hand top bag burst, its
            sand poured into a pile at the foot, and one bag fallen off the top.
  fence     a 5.5 m chain-link run with its walk gate: 1.83 m fabric on posts 2.1 m apart, a razor-wire coil on the
            arms, a BLOCKER you see through, the twin pack:6. Chain link fences#0 (his gate 13. Fences and wire#10).
            The odd thing: the gate standing open, the chain that held it cut and hanging off the latch post, the
            padlock still shut on it.

Run with the rig's Blender python (bpy 4.2):
    <venv>/bin/python tools/bohemia_cook_model_props.py lamp|gun|wreck [--out reference/models/bohemia/<name>.glb]
then
    <venv>/bin/python tools/bohemia_direction_master_rig.py reference/models/bohemia/<name>.glb records/target/master_rig/cook_<name> --real-height 3.2 | --real-length 1.75 | 4.7

REFERENCE CHECK (the 9/4 standing law): the twins are his own approved tiles named above, shown whole beside the
render at 1:1 on the sheet; the palette is DIRECTION's source palette; the card of numbers judges the render. No
reference game.
REUSE CHECK: the quartermaster's line counted what he owns first (lamps 237 tiles, 40 approved; guns 40, 37 approved;
wrecked cars 123, 80 approved; verdict COMPOSE BESIDE IT): his tiles are the score on the sheet, never the source,
because rule 115a makes the model the source for every prop. The palette reused is DIRECTION's source palette, the rig
reused is the master rig, the build pattern reused is the drum's modeller. No bank was opened: nothing in banks/ is a
3D model.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']


def lin(h):
    def c(v):
        v = int(h[v:v + 2], 16) / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (c(1), c(3), c(5), 1.0)


def mat(bpy, name, role, step=2, glow=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = lin(PAL[role]['ramp'][step])
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Metallic'].default_value = 0.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    if glow:
        b.inputs['Emission Color'].default_value = lin(PAL[role]['ramp'][step]); b.inputs['Emission Strength'].default_value = glow
    m['palette_role'] = role; m['palette_step'] = step
    return m


def put(bpy, o, name, m, smooth=True):
    o.name = name; o.data.materials.append(m)
    if smooth: bpy.ops.object.shade_smooth()
    return o


def cyl(bpy, name, m, r, depth, loc, rot=(0, 0, 0), verts=16, smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    return put(bpy, bpy.context.active_object, name, m, smooth)


def box(bpy, name, m, size, loc, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        md = o.modifiers.new('bevel', 'BEVEL'); md.width = bevel; md.segments = 2
        bpy.ops.object.modifier_apply(modifier='bevel')
    return put(bpy, o, name, m, smooth=bool(bevel))


def lamp(bpy, mathutils):
    H = 3.2
    paint, rust, steel = mat(bpy, 'paint_olive', 'metal_painted'), mat(bpy, 'rust', 'clay_rust'), mat(bpy, 'steel', 'tape_grey', 1)
    cyl(bpy, 'plinth', paint, 0.17, 0.34, (0, 0, 0.17), verts=8, smooth=False)
    cyl(bpy, 'plinth_cap', rust, 0.13, 0.06, (0, 0, 0.37), verts=8, smooth=False)
    cyl(bpy, 'base_grime', rust, 0.176, 0.07, (0, 0, 0.035), verts=8, smooth=False)
    pole = cyl(bpy, 'pole', paint, 0.05, H - 0.4, (0, 0, 0.4 + (H - 0.4) / 2), verts=16)
    for v in pole.data.vertices:   # a pole a truck leaned on once: 4 cm of lean toward the camera, mostly up high
        t = (v.co.z + (H - 0.4) / 2) / (H - 0.4); v.co.y -= 0.04 * t * t
    cyl(bpy, 'collar', rust, 0.07, 0.08, (0, 0, 1.25))
    cyl(bpy, 'finial', rust, 0.06, 0.1, (0, -0.04, H + 0.03), verts=8)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(0, -0.04, H + 0.11), segments=10, ring_count=6)
    put(bpy, bpy.context.active_object, 'finial_ball', rust)
    # the straight arm and its brace, out to +X (the S camera sees it whole)
    L = 0.78
    cyl(bpy, 'arm', paint, 0.028, L, (L / 2, -0.04, H - 0.12), rot=(0, math.pi / 2, 0), verts=10)
    br = math.hypot(L * 0.55, 0.42)
    cyl(bpy, 'brace', paint, 0.018, br, (L * 0.275, -0.035, H - 0.12 - 0.21), rot=(0, math.atan2(L * 0.55, 0.42), 0), verts=8)
    cyl(bpy, 'hanger', steel, 0.012, 0.16, (L - 0.04, -0.04, H - 0.2), verts=6)
    # the shade, knocked 9 degrees off true, and the sodium bulb under it
    tilt = (math.radians(9), math.radians(-4), 0)
    # round two of the loop: the first shade (0.24 m, rust) read as a copper ball from 45 degrees and hid the bulb; the
    # shade is now smaller, flatter and dark paint, and the bulb hangs below its rim where the camera sees it lit
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.18, radius2=0.05, depth=0.13, location=(L - 0.04, -0.04, H - 0.33), rotation=tilt)
    put(bpy, bpy.context.active_object, 'shade', paint)
    cyl(bpy, 'shade_rim', rust, 0.185, 0.025, (L - 0.04, -0.05, H - 0.395), rot=tilt, verts=16)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(L - 0.04, -0.1, H - 0.56), segments=12, ring_count=8)
    put(bpy, bpy.context.active_object, 'bulb', mat(bpy, 'sodium', 'sodium', 3, glow=1.4))
    cyl(bpy, 'socket', steel, 0.022, 0.16, (L - 0.04, -0.085, H - 0.47), rot=tilt, verts=8)   # the bulb hangs 16 cm under the rim on its socket: from 45 degrees up a bulb inside the shade is never seen
    # THE ONE ASYMMETRIC THING: a flyer taped round the pole at eye height, facing the S camera
    paper = mat(bpy, 'paper', 'tape_masking', 3)   # the flyer and its tape are one material: the guide caps a prop at five
    box(bpy, 'flyer', paper, (0.2, 0.012, 0.27), (0.0, -0.06, 1.62), rot=(0, math.radians(3), 0))
    for z in (1.75, 1.49):
        cyl(bpy, 'tape_%d' % int(z * 100), paper, 0.056, 0.04, (0, -0.002, z), verts=16)


def rod(bpy, name, m, p0, p1, r, verts=8):
    """a cylinder from one point to another (a tripod leg, a brace)"""
    import mathutils
    p0, p1 = mathutils.Vector(p0), mathutils.Vector(p1); d = p1 - p0
    o = cyl(bpy, name, m, r, d.length, (p0 + p1) / 2, verts=verts)
    o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(d)
    return o


def gun(bpy, mathutils):
    # round two of the loop: the first gun was a 1.05 m shotgun on its side and at true size it is a 60 x 6 px stick
    # (the card 5 of 8 out, under the guide's prop floor of 29 x 36 px). A gun that STANDS on a fight tile at its true
    # size is the machine gun on its tripod: his own word for the big weapon (9/24, A MACHINE GUN IS THE GREATSWORD)
    dark, steel = mat(bpy, 'gunmetal', 'rubber', 1), mat(bpy, 'steel', 'metal_painted', 2)
    olive, brass, tape = mat(bpy, 'ammo_can', 'metal_painted', 1), mat(bpy, 'brass', 'clay_mustard', 4), mat(bpy, 'tape', 'tape_grey')
    Z = 0.5   # the bore height on a low tripod
    box(bpy, 'receiver', dark, (0.32, 0.075, 0.11), (0, 0, Z), bevel=0.008)
    box(bpy, 'feed_cover', steel, (0.17, 0.08, 0.025), (0.02, 0, Z + 0.065), bevel=0.005)
    box(bpy, 'back_plate', dark, (0.04, 0.06, 0.12), (-0.18, 0, Z - 0.005), bevel=0.006)
    box(bpy, 'grip', dark, (0.04, 0.045, 0.12), (-0.2, 0, Z - 0.09), rot=(0, math.radians(18), 0), bevel=0.008)
    jacket = cyl(bpy, 'jacket', steel, 0.034, 0.52, (0.42, 0, Z + 0.01), rot=(0, math.pi / 2, 0), verts=14)
    for i in range(6):   # the cooling holes, dark rings let into the jacket
        cyl(bpy, 'vent_%d' % i, dark, 0.036, 0.022, (0.24 + i * 0.07, 0, Z + 0.01), rot=(0, math.pi / 2, 0), verts=14)
    cyl(bpy, 'muzzle', dark, 0.018, 0.4, (0.87, 0, Z + 0.01), rot=(0, math.pi / 2, 0), verts=10)   # the heavy gun's long bare barrel past the jacket
    cyl(bpy, 'flash_hider', steel, 0.026, 0.06, (1.08, 0, Z + 0.01), rot=(0, math.pi / 2, 0), verts=10)
    box(bpy, 'front_sight', dark, (0.012, 0.012, 0.05), (0.66, 0, Z + 0.06))
    box(bpy, 'carry_handle', steel, (0.14, 0.02, 0.05), (0.32, 0, Z + 0.07), bevel=0.006)
    # the tripod: a pintle, one leg forward, two splayed back, a traverse bar between the back two
    cyl(bpy, 'pintle', steel, 0.025, 0.1, (0.04, 0, Z - 0.1), verts=10)
    top = (0.04, 0, Z - 0.15)
    rod(bpy, 'leg_front', steel, top, (0.55, 0.0, 0.0), 0.018)
    rod(bpy, 'leg_left', steel, top, (-0.42, -0.32, 0.0), 0.018)
    rod(bpy, 'leg_right', steel, top, (-0.42, 0.32, 0.0), 0.018)
    rod(bpy, 'traverse', steel, (-0.3, -0.23, 0.1), (-0.3, 0.23, 0.1), 0.012)
    for x, y in ((0.55, 0.0), (-0.42, -0.32), (-0.42, 0.32)):
        box(bpy, 'foot_%d_%d' % (int(x * 100), int(y * 100)), dark, (0.07, 0.05, 0.02), (x, y, 0.01))
    # the ammo can on the ground behind and left, the belt riding up out of it into the feed
    box(bpy, 'ammo_can', olive, (0.28, 0.13, 0.19), (-0.5, -0.12, 0.095), rot=(0, 0, math.radians(-14)), bevel=0.01)
    box(bpy, 'can_lid', steel, (0.29, 0.14, 0.02), (-0.5, -0.12, 0.2), rot=(0, 0, math.radians(-14)), bevel=0.004)
    for i in range(10):
        t = i / 9
        x = -0.46 + t * 0.47; y = -0.11 + t * 0.07; z = 0.22 + (Z - 0.22) * (t ** 0.6) - 0.06 * math.sin(math.pi * t)
        box(bpy, 'round_%d' % i, brass, (0.022, 0.07, 0.02), (x, y - 0.0, z), rot=(0, math.radians(-40 * (1 - t)), math.radians(8)))
    # THE ONE ASYMMETRIC THING: grey tape wound round the jacket where it cracked, a tail hanging loose toward the camera
    for i, dx in enumerate((0.5, 0.525)):
        cyl(bpy, 'tape_%d' % i, tape, 0.039, 0.02, (dx, 0, Z + 0.01), rot=(0, math.pi / 2, math.radians(5 * i)), verts=14)
    box(bpy, 'tape_tail', tape, (0.024, 0.006, 0.09), (0.515, -0.04, Z - 0.05), rot=(math.radians(-12), 0, 0))


def blotch(bpy, name, m, r, loc, rot, seed, thick=0.014):
    """a rust patch with a ragged edge: an n-gon whose every corner sits at its own radius (his car's rust is a stain,
    never a square)"""
    import random
    rnd = random.Random(seed)
    o = cyl(bpy, name, m, r, thick, loc, rot=rot, verts=11, smooth=False)
    for v in o.data.vertices:
        d = math.hypot(v.co.x, v.co.y)
        if d > 1e-6:
            k = rnd.uniform(0.55, 1.25); v.co.x *= k; v.co.y *= k * rnd.uniform(0.6, 1.0)
    return o


def wreck(bpy, mathutils):
    # round two of the loop: the first body sat 0.31 m off the ground over 0.33 m wheels (a toy van), the rust was
    # salmon squares and the sprung bonnet a plank. Now: a sedan's 1.42 m, the body down over bigger wheels, the cabin
    # tapered in plan and in section, the rust ragged stains in two depths, the bonnet up 7 degrees at its front edge
    L, W = 4.7, 1.78
    paint, paint_lo = mat(bpy, 'paint_teal', 'clay_teal', 2), mat(bpy, 'paint_teal_low', 'clay_teal', 1)
    rust, rust_d, glass = mat(bpy, 'rust', 'clay_rust', 1), mat(bpy, 'rust_dark', 'clay_rust', 0), mat(bpy, 'glass_gone', 'glass_eye', 0)
    rubber, trim = mat(bpy, 'tyre', 'rubber', 1), mat(bpy, 'trim', 'tape_grey', 1)
    lo = box(bpy, 'body_low', paint, (L, W, 0.58), (0, 0, 0.55), bevel=0.07)
    sub = lo.modifiers.new('sub', 'SUBSURF'); sub.levels = 1; bpy.ops.object.modifier_apply(modifier='sub')
    for v in lo.data.vertices:
        ex = abs(v.co.x) / (L / 2)
        if ex > 0.75 and v.co.z > 0.55: v.co.z -= (ex - 0.75) * 0.42   # the bonnet and the boot fall away to the bumpers
        if ex > 0.9: v.co.y *= 1 - (ex - 0.9) * 0.7
        if v.co.z < 0.4 and abs(abs(v.co.x) - 1.42) < 0.42: v.co.z += 0.12 * (1 - abs(abs(v.co.x) - 1.42) / 0.42)   # the wheel arches
    cab = box(bpy, 'cabin', paint, (2.25, W * 0.84, 0.46), (-0.3, 0, 1.06), bevel=0.06)
    cs = cab.modifiers.new('sub', 'SUBSURF'); cs.levels = 2; bpy.ops.object.modifier_apply(modifier='sub')
    for v in cab.data.vertices:
        if v.co.z > 1.06:
            u = (v.co.z - 1.06) / 0.23
            v.co.x = (v.co.x + 0.3) * (1 - 0.3 * u) - 0.3 - 0.05 * u   # the screens raked, the rear more upright
            v.co.y *= 1 - 0.12 * u                                       # the roof narrower than the waist
            d = math.hypot(v.co.x + 0.4, v.co.y - 0.12)
            if d < 0.7: v.co.z -= (0.7 - d) * 0.2                         # the cave-in where something sat on it
    box(bpy, 'screen_front', glass, (0.03, W * 0.66, 0.33), (0.5, 0, 1.08), rot=(0, math.radians(-40), 0))
    box(bpy, 'screen_rear', glass, (0.03, W * 0.66, 0.29), (-1.12, 0, 1.07), rot=(0, math.radians(34), 0))
    for side in (-1, 1):
        for x0, w in ((0.05, 0.68), (-0.72, 0.62)):
            box(bpy, 'window_%d_%d' % (side, int(x0 * 10)), glass, (w, 0.04, 0.26), (x0 - 0.2, side * W * 0.43, 1.07))   # under the caved roofline on both sides
    # the rust: ragged stains, the deep ones inside the light ones, on the roof, the boot, the bonnet and down the sides
    stains = ((-0.35, 0.0, 1.27, 0.55, 0), (-0.1, -0.25, 1.28, 0.3, 4), (-1.95, 0.1, 0.79, 0.42, 0), (1.85, -0.3, 0.8, 0.3, 0))
    for i, (x, y, z, r, tilt) in enumerate(stains):
        blotch(bpy, 'rust_%d' % i, rust, r, (x, y, z), (0, math.radians(tilt), 0), seed=i + 1)
        blotch(bpy, 'rust_deep_%d' % i, rust_d, r * 0.45, (x + 0.05, y - 0.03, z + 0.012), (0, math.radians(tilt), 0), seed=i + 11, thick=0.022)
    for i, (x, z, r) in enumerate(((0.75, 0.48, 0.32), (-0.9, 0.42, 0.26), (-1.9, 0.55, 0.2))):
        for side in (-1, 1):
            blotch(bpy, 'rust_side_%d_%d' % (i, side), rust, r, (x + side * 0.1, side * (W / 2 + 0.004), z), (math.pi / 2, 0, 0), seed=21 + i * 2 + side)
    box(bpy, 'sill_rot', rust_d, (3.0, W + 0.02, 0.08), (0, 0, 0.3))
    box(bpy, 'bonnet', paint_lo, (1.12, W * 0.84, 0.03), (1.62, 0, 0.84), rot=(0, math.radians(-7), 0))
    for sx in (-1, 1):
        box(bpy, 'bumper_%d' % sx, trim, (0.12, W * 0.96, 0.15), (sx * (L / 2 + 0.01), 0, 0.36), bevel=0.03)
        for sy in (-1, 1):
            box(bpy, 'lamp_%d_%d' % (sx, sy), rust_d, (0.04, 0.3, 0.11), (sx * (L / 2 - 0.02), sy * 0.62, 0.6))
    # the wheels: three on, THE ONE ASYMMETRIC THING the front left gone, the nose down on its bare rim
    for x, y in ((1.42, W / 2 - 0.1), (-1.42, W / 2 - 0.1), (-1.42, -W / 2 + 0.1)):
        tag = '%d_%d' % (int(x * 10), int(y * 10))
        cyl(bpy, 'tyre_' + tag, rubber, 0.34, 0.22, (x, y, 0.34), rot=(math.pi / 2, 0, 0), verts=20)
        cyl(bpy, 'hub_' + tag, trim, 0.17, 0.235, (x, y, 0.34), rot=(math.pi / 2, 0, 0), verts=12)
    cyl(bpy, 'rim_bare', rust_d, 0.21, 0.12, (1.42, -W / 2 + 0.14, 0.21), rot=(math.pi / 2, 0, 0), verts=14)
    bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.active_object; root.name = 'wreck'
    for o in bpy.context.scene.objects:
        if o is not root: o.parent = root
    root.rotation_euler = (math.radians(-2.5), math.radians(3.0), 0)   # down on the missing wheel: the nose and the left side drop
    root.location.z = -0.04


def prism(bpy, name, m, prof, x0, x1):
    """a profile (y, z) pulled along X from x0 to x1: a jersey barrier's section, a dumpster's side"""
    me = bpy.data.meshes.new(name); n = len(prof)
    vs = [(x0, y, z) for y, z in prof] + [(x1, y, z) for y, z in prof]
    fs = [tuple(range(n))[::-1], tuple(range(n, 2 * n))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    o.data.materials.append(m)
    return o


def cut(bpy, o, size, loc, rot):
    """take a chunk out of o with a box (a broken corner)"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); k = bpy.context.active_object; k.scale = size
    md = o.modifiers.new('cut', 'BOOLEAN'); md.object = k; md.operation = 'DIFFERENCE'
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='cut')
    bpy.data.objects.remove(k, do_unlink=True)


def barrier(bpy, mathutils):
    # a 3.0 m concrete F-shape barrier (the real one: 0.81 m high, 0.61 m at the foot, 0.15 at the top, a 7.5 cm
    # vertical lip, the steep break at 0.33 m), the twin's family (pack:3. Barricades and blockades#4). Forklift slots
    # at the foot, two lifting loops on top with rust bleeding down the face under each, a faded yellow reflector band.
    # The odd thing: the +X top corner broken off, three rebar ends bent out of the break.
    L = 3.0
    # round two of the loop: the first concrete (bone step 2) read tan and flat beside his grey, value span 89; the
    # grime was a disc that stood out of the foot like a shield. Now grey concrete, the slots and two segment seams
    # CUT so their dark is the model's own shadow, and the road's splash a darker band along the foot.
    conc, grime = mat(bpy, 'concrete', 'tape_grey', 2), mat(bpy, 'concrete_grime', 'tape_grey', 0)
    rust, rust_d = mat(bpy, 'rust', 'clay_rust', 2), mat(bpy, 'rust_dark', 'clay_rust', 0)
    half = [(0.305, 0.0), (0.305, 0.075), (0.2, 0.33), (0.075, 0.81)]
    prof = [(-y, z) for y, z in half] + [(y, z) for y, z in reversed(half)]
    o = prism(bpy, 'barrier', conc, prof, -L / 2, L / 2)
    md = o.modifiers.new('bevel', 'BEVEL'); md.width = 0.015; md.segments = 1; bpy.ops.object.modifier_apply(modifier='bevel')
    cut(bpy, o, (0.55, 0.9, 0.5), (L / 2 - 0.02, 0, 0.84), (math.radians(28), math.radians(-25), math.radians(10)))
    for sx in (-1, 1):
        cut(bpy, o, (0.3, 0.8, 0.12), (sx * 0.75, 0, 0.0), (0, 0, 0))            # the forklift slots through the foot
        cut(bpy, o, (0.035, 0.9, 1.0), (sx * L / 6, -0.2, 0.55), (0, 0, 0))      # the seams of a three-piece casting
        cyl(bpy, 'loop_%d' % sx, rust_d, 0.035, 0.05, (sx * 0.9, 0, 0.83), rot=(math.pi / 2, 0, 0), verts=10)
    for i, (y0, z0, a) in enumerate(((-0.05, 0.62, -30), (0.03, 0.58, 15), (-0.02, 0.5, 40))):
        p0 = (L / 2 - 0.2, y0, z0)
        rod(bpy, 'rebar_%d' % i, rust_d, p0, (L / 2 - 0.02 + 0.06 * math.cos(math.radians(a)), y0 - 0.1 * math.sin(math.radians(a)), z0 + 0.16), 0.011, verts=6)
    # the near face is steep (14.6 degrees off vertical), so the stains lie on it: tilted 75.4 degrees about X
    face = math.radians(75.4)
    def on_face(z): return -(0.2 - (z - 0.33) / 0.48 * 0.125) - 0.006
    for i, (x, z, r) in enumerate(((-0.9, 0.66, 0.11), (0.9, 0.64, 0.13), (-0.2, 0.5, 0.08))):
        blotch(bpy, 'rust_%d' % i, rust, r, (x, on_face(z), z), (face, 0, 0), seed=31 + i)
        for k in range(3):   # the bleed down the face under each loop
            zz = z - 0.08 - k * 0.07
            blotch(bpy, 'bleed_%d_%d' % (i, k), rust, r * (0.6 - k * 0.15), (x + 0.02 * k, on_face(zz), zz), (face, 0, 0), seed=41 + i * 3 + k)
    # the road's splash: ONE dark band on the lower slope (round three: nine stains along the foot read as polka dots)
    lo = math.atan2(0.105, 0.255)
    box(bpy, 'splash', grime, (L - 0.06, 0.01, 0.15), (0, -0.268, 0.165), rot=(-lo, 0, 0))


def lump(o, rnd, r):
    """a full bin bag: soft lumps from what is inside, a flat bottom where it sits, pinched to the knot (round two: a
    sphere with jittered vertices read as a ball)"""
    a, b, c = rnd.uniform(0, 6), rnd.uniform(0, 6), rnd.uniform(0, 6)
    for v in o.data.vertices:
        n = v.co.normalized()
        k = 1 + 0.14 * math.sin(3 * n.x + a) * math.cos(2.5 * n.y + b) + 0.08 * math.sin(4 * n.z + c)
        if n.z > 0.6: k *= 1 - (n.z - 0.6) * 0.9          # gathered at the neck
        v.co *= k
        if v.co.z < -0.45 * r: v.co.z = -0.45 * r         # sat down on whatever is under it


def dumpster(bpy, mathutils):
    # a 2-yard front-load dumpster (1.85 m wide, 1.1 m deep, the back 1.25 m, the front 1.05, the lower front raked in),
    # the twin's family (pack:14. Trash and junk props#3). Painted steel, two black plastic lids, fork pockets on the
    # sides, rust coming through the paint. The odd thing: the right lid thrown back over its hinge and the bin
    # overflowing on that side, bags and a split box, one bag fallen on the ground in front.
    W, D = 1.85, 1.1
    # round two of the loop: the first lid and bags read pale grey (the source pass dusts every up face), the top was a
    # solid slab, not a bin, and the rust was blood red. Darker steps, the bin hollowed, the rust his orange step
    body, rust = mat(bpy, 'paint', 'metal_painted', 2), mat(bpy, 'rust', 'clay_rust', 2)
    lid, bag, card = mat(bpy, 'lid', 'rubber', 0), mat(bpy, 'bags', 'cloth_black', 0), mat(bpy, 'cardboard', 'tape_masking', 2)
    # the side profile (y, z), front is -Y: the foot raked in, the front wall up to 1.05, the top sloping to 1.25
    prof = [(-D / 2 + 0.22, 0.12), (D / 2, 0.12), (D / 2, 1.25), (-D / 2, 1.05), (-D / 2, 0.42)]
    o = prism(bpy, 'body', body, prof, -W / 2, W / 2)
    md = o.modifiers.new('bevel', 'BEVEL'); md.width = 0.025; md.segments = 2; bpy.ops.object.modifier_apply(modifier='bevel')
    # the opening: a dark well under the lids (the inside of a bin from 45 degrees up is mostly shadow)
    slope = math.atan2(0.2, D)
    cut(bpy, o, (W - 0.09, D - 0.09, 1.1), (0, 0, 1.0), (0, 0, 0))   # hollow: the open half shows a dark well
    for sx in (-1, 1):
        box(bpy, 'fork_pocket_%d' % sx, body, (0.06, D * 0.6, 0.16), (sx * (W / 2 + 0.03), 0.05, 0.78), bevel=0.01)
        cyl(bpy, 'caster_%d_f' % sx, lid, 0.06, 0.05, (sx * 0.75, -D / 2 + 0.3, 0.06), rot=(0, math.pi / 2, 0), verts=12)
        cyl(bpy, 'caster_%d_b' % sx, lid, 0.06, 0.05, (sx * 0.75, D / 2 - 0.1, 0.06), rot=(0, math.pi / 2, 0), verts=12)
    # the left lid shut along the slope; the right lid thrown back past the hinge, hanging down the back
    box(bpy, 'lid_left', lid, (W / 2 - 0.03, D + 0.06, 0.05), (-W / 4, 0, 1.18), rot=(slope, 0, 0), bevel=0.012)   # the back is the high side: +slope lifts +Y
    box(bpy, 'lid_right', lid, (W / 2 - 0.03, D + 0.06, 0.05), (W / 4, D / 2 + 0.12, 0.72), rot=(math.radians(-100), 0, 0), bevel=0.012)
    # the overflow on the open side: bags and a split box heaped over the rim, one bag on the ground in front
    import random
    rnd = random.Random(5)
    for i, (x, y, z, r) in enumerate(((0.45, -0.05, 1.22, 0.3), (0.2, 0.2, 1.28, 0.27), (0.7, 0.18, 1.2, 0.24), (0.55, -0.35, 1.12, 0.2))):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, z), segments=12, ring_count=8)
        b = put(bpy, bpy.context.active_object, 'bag_%d' % i, bag)
        b.scale = (1.0, 0.9, 0.72); b.rotation_euler = (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3), rnd.uniform(0, 3))
        lump(b, rnd, r)
        bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.05, radius2=0.0, depth=0.12, location=(x, y, z + r * 0.72 + 0.04))
        put(bpy, bpy.context.active_object, 'bag_knot_%d' % i, bag, smooth=False)
    box(bpy, 'box_split', card, (0.42, 0.34, 0.3), (0.18, -0.2, 1.3), rot=(math.radians(14), math.radians(-24), math.radians(30)), bevel=0.005)
    box(bpy, 'box_flap', card, (0.4, 0.012, 0.22), (0.22, -0.4, 1.45), rot=(math.radians(-40), math.radians(-24), math.radians(30)))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.24, location=(0.55, -D / 2 - 0.32, 0.17), segments=12, ring_count=8)
    b = put(bpy, bpy.context.active_object, 'bag_ground', bag); b.scale = (1.15, 0.95, 0.68)
    lump(b, rnd, 0.24)
    # the rust: ragged stains on the front wall and the raked foot, and a long run down the left corner
    for i, (x, z, r) in enumerate(((-0.55, 0.85, 0.2), (0.35, 0.62, 0.15), (-0.75, 0.55, 0.12), (0.7, 0.92, 0.1))):
        blotch(bpy, 'rust_%d' % i, rust, r, (x, -D / 2 - 0.006, z), (math.pi / 2, 0, 0), seed=51 + i)


def cart(bpy, mathutils):
    # a shopping cart (0.95 m long, 0.56 m wide at the handle, 1.0 m to the handle), wire puppet-thick (2.2 cm: a real
    # 5 mm wire is a third of a pixel at 57 px a metre and vanishes), a basket narrowing to the front, the lower tray,
    # a red plastic handle, four casters. He owns no shopping cart (the quartermaster's line says zero); the nearest he
    # owns is the wire bin (pack:15. Street props#21), the same wire. The odd thing: the front left caster gone, the
    # cart dropped onto that corner, a black bag still in the basket.
    wire, handle, rub = mat(bpy, 'wire', 'tape_grey', 3), mat(bpy, 'handle_red', 'clay_rust', 2), mat(bpy, 'caster', 'rubber', 1)
    rust, bag = mat(bpy, 'rust', 'clay_rust', 0), mat(bpy, 'bag', 'cloth_black', 2)
    R = 0.011
    xb, xf, zt, zb = -0.42, 0.48, 0.95, 0.55          # back, front, the basket's top and bottom
    def half_w(x, z):   # the basket narrows to the front and toward the floor
        u = (x - xb) / (xf - xb); return 0.28 - 0.06 * u - 0.03 * (zt - z) / (zt - zb)
    xbf = xf - 0.12                                       # the floor of the basket stops short of the front
    def corner(x, z, s): return (x, s * half_w(x, z), z)
    for s in (-1, 1):
        for z in (zt, zt - 0.13, zt - 0.26, zb):
            xe = xf if z > zb + 0.01 else xbf
            rod(bpy, 'rail_%d_%d' % (s, int(z * 100)), wire, corner(xb, z, s), corner(xe - (zt - z) * 0.3 * (z < zt), z, s), R)
        for i in range(10):
            x = xb + i * (xf - xb) / 9
            if x > xbf + 0.001:
                top = corner(x, zt, s); bot = corner(xbf + (x - xbf) * 0.2, zb + (x - xbf) * 1.3, s)
            else:
                top, bot = corner(x, zt, s), corner(x, zb, s)
            rod(bpy, 'side_%d_%d' % (s, i), wire, top, bot, R * 0.8)
    for i in range(7):   # the front and back grilles, and the floor
        y = -0.25 + i * 0.5 / 6
        rod(bpy, 'front_%d' % i, wire, (xf, y * 0.78, zt), (xbf, y * 0.8, zb), R * 0.8)
        rod(bpy, 'back_%d' % i, wire, (xb, y, zt), (xb + 0.04, y, zb + 0.05), R * 0.8)
        rod(bpy, 'floor_%d' % i, wire, (xb, y * 0.92, zb), (xbf, y * 0.84, zb), R * 0.7)
    rod(bpy, 'front_top', wire, corner(xf, zt, -1), corner(xf, zt, 1), R)
    rod(bpy, 'back_top', wire, corner(xb, zt, -1), corner(xb, zt, 1), R)
    # the frame: two legs down from the handle to the back casters, the base rails forward, the lower tray
    for s in (-1, 1):
        rod(bpy, 'leg_%d' % s, wire, (xb - 0.1, s * 0.27, 1.0), (xb + 0.02, s * 0.25, 0.1), R * 1.4)
        rod(bpy, 'base_%d' % s, wire, (xb + 0.02, s * 0.25, 0.1), (xf - 0.04, s * 0.2, 0.1), R * 1.4)
        rod(bpy, 'strut_%d' % s, wire, (xf - 0.04, s * 0.2, 0.1), (xbf, s * 0.22, zb), R * 1.2)
    for i in range(5):
        x = xb + 0.08 + i * 0.14
        rod(bpy, 'tray_%d' % i, wire, (x, -0.22, 0.17), (x, 0.22, 0.17), R * 0.8)
    box(bpy, 'tray_rust', rust, (0.5, 0.36, 0.008), (xb + 0.33, 0, 0.165))
    # the handle: a red plastic bar across the top of the legs
    cyl(bpy, 'handle', handle, 0.022, 0.62, (xb - 0.1, 0, 1.0), rot=(math.pi / 2, 0, 0), verts=10)
    # the casters: three on; THE ONE ASYMMETRIC THING, the front left gone and the bare fork on the ground
    for x, y, tag in ((xb + 0.02, 0.25, 'bl'), (xb + 0.02, -0.25, 'br'), (xf - 0.04, 0.2, 'fr')):
        cyl(bpy, 'caster_' + tag, rub, 0.055, 0.035, (x, y, 0.055), rot=(math.pi / 2, 0, 0), verts=12)
        box(bpy, 'fork_' + tag, rust, (0.04, 0.05, 0.05), (x, y, 0.1))
    box(bpy, 'fork_fl_bare', rust, (0.04, 0.05, 0.06), (xf - 0.04, -0.2, 0.06))
    # a bag left in the basket, slumped against the back
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(xb + 0.2, 0.02, zb + 0.2), segments=12, ring_count=8)
    b = put(bpy, bpy.context.active_object, 'bag', bag); b.scale = (0.9, 1.2, 1.05)
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.04, radius2=0.0, depth=0.1, location=(xb + 0.2, 0.02, zb + 0.43))
    put(bpy, bpy.context.active_object, 'bag_knot', bag, smooth=False)
    bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.active_object; root.name = 'cart'
    for o in bpy.context.scene.objects:
        if o is not root: o.parent = root
    root.rotation_euler = (math.radians(-4.5), math.radians(5.5), 0)   # down on the missing caster, front left
    root.location.z = -0.01


def tyres(bpy, mathutils):
    # car tyres (0.64 m across, 0.2 m wide) in two stacks, the twin's family (pack:3. Barricades and blockades#5): three
    # on the left, two on the right, tread blocks round every one, one rusted steel rim still inside the bottom of the
    # short stack. The odd thing: the top tyre of the tall stack slid half off and tipped, and black water standing in
    # the tall stack's well.
    # round two of the loop: the first tyres (0.23 + 0.1) were donuts with a fist-sized hole, 93 px long (under the 96
    # floor), and the tread blocks stood off the shoulder as a dotted halo. Now a 0.72 m tyre with its real 0.32 m
    # hole, the tread flush and full width, darker rubber (the source pass dusts the up faces), a third tyre on the ground
    tyre, tread, rim, water = mat(bpy, 'rubber', 'rubber', 0), mat(bpy, 'tread', 'rubber', 1), mat(bpy, 'rim', 'clay_rust', 1), mat(bpy, 'water', 'glass_eye', 0)
    R, r = 0.275, 0.09
    def one(name, loc, rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=32, minor_segments=10, location=(0, 0, 0))
        t = put(bpy, bpy.context.active_object, name, tyre)
        t.scale = (1, 1, 0.95); bpy.ops.object.transform_apply(scale=True)
        for v in t.data.vertices:   # squared shoulders: a tyre's section is a box with round corners, not a doughnut
            d = math.hypot(v.co.x, v.co.y); k = (d - R) / r
            if abs(k) > 0.2:
                s = 1 + 0.18 * (1 - abs(v.co.z) / r); v.co.x *= (R + (d - R) * s) / d; v.co.y *= (R + (d - R) * s) / d
        parts = [t]
        for i in range(26):   # the tread blocks round the outside
            a = 2 * math.pi * i / 26
            bpy.ops.mesh.primitive_cube_add(size=1, location=((R + r + 0.004) * math.cos(a), (R + r + 0.004) * math.sin(a), 0), rotation=(0, 0, a))
            b = bpy.context.active_object; b.scale = (0.022, 0.05, 0.13)   # inside the shoulder: taller blocks stood up as a dotted halo from above; bpy.ops.object.transform_apply(scale=True)
            put(bpy, b, '%s_tread_%d' % (name, i), tread, smooth=False); parts.append(b)
        bpy.ops.object.select_all(action='DESELECT')
        for p in parts: p.select_set(True)
        bpy.context.view_layer.objects.active = t; bpy.ops.object.join()
        t.location = loc; t.rotation_euler = rot
        return t
    h = 2 * r * 0.95 + 0.005
    for i in range(3):
        one('tall_%d' % i, (-0.3 + 0.02 * (i % 2), -0.02 * i, h / 2 + i * h), (0, 0, 0.3 * i))
    for i in range(2):
        one('short_%d' % i, (0.38, 0.12 + 0.015 * i, h / 2 + i * h), (0, 0, 0.5 + 0.4 * i))
    cyl(bpy, 'rim', rim, 0.2, 0.15, (0.38, 0.12, h / 2), verts=20)
    cyl(bpy, 'rim_hub', rim, 0.07, 0.17, (0.38, 0.12, h / 2), verts=10)
    cyl(bpy, 'water', water, R - 0.01, 0.01, (-0.29, -0.03, 2 * h + 0.04), verts=24)
    # THE ONE ASYMMETRIC THING: the top of the tall stack slid half off toward the camera and tipped against it
    one('ground', (0.25, -0.62, h / 2 - 0.03), (math.radians(4), 0, 0.2))   # rolled off the pile, lying where it fell
    one('slid', (-0.18, -0.28, 3 * h + 0.03), (math.radians(-22), math.radians(8), 0.9))


def sack(bpy, name, m, size, loc, rot, rnd, tied=1, flat=0.55):
    """a filled sack (a sandbag): a superellipsoid, boxy in the middle, round at the edges, the tied end pinched to its
    neck, the bottom pressed flat by the course under it, lumps from what is inside"""
    L, W, H = size
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=20, ring_count=10, location=(0, 0, 0))
    o = put(bpy, bpy.context.active_object, name, m)
    a, b = rnd.uniform(0, 6), rnd.uniform(0, 6)
    for v in o.data.vertices:
        c = [math.copysign(abs(x) ** 0.7, x) for x in v.co]                       # pushed out toward the box, round enough that the gaps between bags go dark
        u = c[0] * tied
        k = 1 - 0.55 * max(0.0, (u - 0.72) / 0.28)                                  # the tied end gathered to its neck
        x, y, z = c[0] * L / 2, c[1] * W / 2 * k, c[2] * H / 2 * k
        z *= 1 + 0.12 * math.sin(4 * c[0] + a) * math.cos(3 * c[1] + b)            # the fill sits lumpy
        if z < -flat * H / 2: z = -flat * H / 2
        v.co = (x, y, z)
    o.location = loc; o.rotation_euler = rot
    return o


def sandbags(bpy, mathutils):
    # a sandbag wall (pack:5. Barricades and defenses#2 is his twin): real bags of 0.56 x 0.3 x 0.13 m filled (the
    # standard 14 by 26 inch bag), laid in courses, the bottom four two bags deep and the top three one deep and stepped
    # back, each course offset half a bag, 0.9 m high: cover a man kneels behind, under the 1.3 m chest line, so it is
    # COVER and not a blocker. Burlap in two ages (the bottom course rotted dark where the ground's damp wicks up). The odd thing: the top bag at the right end split open, its sand run
    # down the face in a cone on the ground, and one bag fallen off the top, lying at the foot.
    import random
    rnd = random.Random(7)
    # round two of the loop: the first burlap (masking step 2) dusted to a pale grey-cream beside his warm brown bags,
    # the bags were boxy slabs with no dark between them (value span 105), two green poly bags read as grey stones, and
    # the sand run down the face stood up as a pole. Warmer burlap, rounder bags, no poly, the spill a low pile
    # round three: the rotted course (masking step 1) and the sand (bone step 2) still dusted to grey stones; both are
    # now the burlap's own clay, a step down for the rot and a step up for the sand
    burlap, old, sand = mat(bpy, 'burlap', 'clay_mustard', 2), mat(bpy, 'burlap_rotted', 'clay_mustard', 1), mat(bpy, 'sand', 'clay_mustard', 3)
    L, W, H = 0.56, 0.3, 0.13
    pitch, step = 0.6, H * 0.9
    for c in range(7):
        rows = (-0.16, 0.16) if c < 4 else (0.04,)
        xs = [-0.9, -0.3, 0.3, 0.9] if c % 2 == 0 else [-0.6, 0.0, 0.6] + ([1.12] if c < 4 else [])
        if c >= 5: xs = [x for x in xs if abs(x) < 0.95]                         # the top courses stop short of the ends
        for r, y in enumerate(rows):
            for i, x in enumerate(xs):
                if c == 6 and x > 0.25: continue                                   # the burst bag's place, and the fallen one's
                m = old if c == 0 else burlap
                sack(bpy, 'bag_%d_%d_%d' % (c, r, i), m, (L * rnd.uniform(0.95, 1.04), W * rnd.uniform(0.95, 1.05), H),
                     (x + rnd.uniform(-0.03, 0.03), y + rnd.uniform(-0.02, 0.02), H / 2 * 0.55 + c * step),
                     (rnd.uniform(-0.03, 0.03), rnd.uniform(-0.04, 0.04), rnd.uniform(-0.06, 0.06)), rnd, tied=rnd.choice((-1, 1)))
    # THE ONE ASYMMETRIC THING: the right-hand top bag split along its seam and slumped, its sand down the face to a cone
    top = H / 2 * 0.55 + 6 * step
    sack(bpy, 'bag_burst', burlap, (L, W * 1.15, H * 0.5), (0.55, 0.02, top - 0.03), (0.08, -0.05, 0.1), rnd, flat=0.9)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=16, ring_count=8, location=(0.6, -0.12, top + 0.005))
    s = put(bpy, bpy.context.active_object, 'burst_sand', sand); s.scale = (0.2, 0.09, 0.03)
    bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=0.3, radius2=0.03, depth=0.13, location=(0.62, -0.38, 0.065))
    cone = put(bpy, bpy.context.active_object, 'sand_pile', sand)
    for v in cone.data.vertices:   # a pile poured from above, slumped against the foot of the wall
        v.co.x *= 1 + 0.18 * math.sin(3 * math.atan2(v.co.y, v.co.x)); v.co.y *= 0.8
    # and one bag off the top, lying on the ground at the foot, turned across the wall
    sack(bpy, 'bag_fallen', burlap, (L, W, H), (1.08, -0.36, H / 2 * 0.55), (0.0, 0.12, math.radians(35)), rnd, flat=0.6)


def tubes(bpy, name, m, segs, r, n=6):
    """many thin round bars in ONE mesh (a chain-link's wires, barbed strands): each segment a ring of n at both ends"""
    import mathutils
    vs, fs = [], []
    for p0, p1 in segs:
        p0, p1 = mathutils.Vector(p0), mathutils.Vector(p1); d = (p1 - p0).normalized()
        u = d.orthogonal().normalized(); w = d.cross(u)
        b = len(vs)
        for p in (p0, p1):
            for i in range(n):
                a = 2 * math.pi * i / n; vs.append(tuple(p + r * (math.cos(a) * u + math.sin(a) * w)))
        fs += [(b + i, b + (i + 1) % n, b + n + (i + 1) % n, b + n + i) for i in range(n)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    for p in me.polygons: p.use_smooth = True
    return o


def diamonds(x0, x1, z0, z1, pitch):
    """the chain-link weave as straight wires: two families of 45 degree lines clipped to the panel"""
    segs = []
    for sgn in (1, -1):
        c = x0 - (z1 - z0)
        while c < x1 + (z1 - z0):
            pts = []
            for z in (z0, z1):                                   # where the line z - z0 = sgn (x - c) meets the top and bottom
                x = c + (z - z0) * sgn if sgn > 0 else c + (z1 - z)
                pts.append((x, z))
            (xa, za), (xb, zb) = pts
            # clip to x0..x1 along the line
            if xa > xb: (xa, za), (xb, zb) = (xb, zb), (xa, za)
            if xb > x0 and xa < x1:
                k = (zb - za) / (xb - xa)
                if xa < x0: za += k * (x0 - xa); xa = x0
                if xb > x1: zb -= k * (xb - x1); xb = x1
                segs.append(((xa, 0.0, za), (xb, 0.0, zb)))
            c += pitch
    return segs


def fence(bpy, mathutils):
    # a chain-link run with its walk gate (the twin pack:6. Chain link fences#0; his gate pack:13. Fences and wire#10):
    # 1.83 m (six foot) fabric on line posts 2.1 m apart, a top rail, three strands of barbed wire on arms leaning out
    # toward the street, a 1.2 m walk gate between two heavier gate posts. It blocks a man and a bullet passes it: a
    # BLOCKER you see through (the board count's 'chain-link run 6.0 x 0.1 BLOCKER see-through'). The weave at a
    # puppet's 10 cm diamond and 1.8 cm wire (a real 5 cm diamond in 3 mm wire is under a pixel at 57 px a metre and
    # vanishes). The odd thing: the gate standing open toward the camera, the chain that held it cut and hanging off
    # the latch post with its padlock still locked; a yellow sign wired to the fabric.
    # round two of the loop: the first run was pale and thin beside his (his posts chunky with knob caps, his weave
    # dark, his wire on top reading as wire); the three strands leant at the camera and flattened to a rusty rail from
    # 45 degrees up (value span 100, 2,005 colours). Heavier posts with ball caps, the weave a step darker, and a coil
    # of razor wire along the arms, which reads from any side
    steel, wire, barb, sign = mat(bpy, 'galvanised', 'tape_grey', 2), mat(bpy, 'fabric', 'tape_grey', 0), mat(bpy, 'barbed_rust', 'clay_rust', 1), mat(bpy, 'sign_yellow', 'clay_mustard', 3)
    H, P, R = 1.83, 0.10, 0.009
    posts = [-2.7, -0.6, 1.5, 2.7]                                   # terminal, line, gate post, latch post
    for i, x in enumerate(posts):
        heavy = i != 1
        cyl(bpy, 'post_%d' % i, steel, 0.06 if heavy else 0.045, H + 0.06, (x, 0, (H + 0.06) / 2), verts=10)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07 if heavy else 0.055, location=(x, 0, H + 0.1), segments=10, ring_count=6)
        put(bpy, bpy.context.active_object, 'cap_%d' % i, steel)
        cyl(bpy, 'footing_%d' % i, steel, 0.075 if heavy else 0.06, 0.06, (x, 0, 0.03), verts=10)
        if i < 3:   # the barbed arm on every post but the latch post, leaning out 30 degrees toward the street (-Y)
            rod(bpy, 'arm_%d' % i, steel, (x, 0, H + 0.04), (x, -0.18, H + 0.35), 0.02, verts=6)
    rod(bpy, 'top_rail', steel, (posts[0], 0, H - 0.02), (posts[2], 0, H - 0.02), 0.022, verts=8)
    rod(bpy, 'tension_wire', wire, (posts[0], 0, 0.06), (posts[2], 0, 0.06), 0.007, verts=6)
    segs = diamonds(posts[0] + 0.05, posts[2] - 0.05, 0.05, H - 0.03, P)
    tubes(bpy, 'fabric', wire, segs, R)
    # a coil of razor wire along the arms (0.3 m across, a turn every 0.22 m), barbs as small crosses on each turn,
    # and one straight strand under it
    coil, barbs, x0, x1 = [], [], posts[0] + 0.04, posts[2] - 0.02
    cy, cz, cr = -0.1, H + 0.3, 0.15
    n = int((x1 - x0) / 0.22 * 14)
    pts = [(x0 + (x1 - x0) * i / n, cy + cr * math.cos(2 * math.pi * i / 14), cz + cr * math.sin(2 * math.pi * i / 14) * 0.85) for i in range(n + 1)]
    coil = list(zip(pts[:-1], pts[1:]))
    for i in range(0, n, 4):
        x, y, z = pts[i]
        barbs += [((x - 0.03, y, z - 0.03), (x + 0.03, y, z + 0.03)), ((x - 0.03, y, z + 0.03), (x + 0.03, y, z - 0.03))]
    tubes(bpy, 'razor_coil', barb, coil, 0.009)
    tubes(bpy, 'razor_barbs', barb, barbs, 0.008, n=4)
    tubes(bpy, 'barbed', barb, [((posts[0], -0.09, H + 0.2), (posts[2], -0.09, H + 0.2))], 0.008)
    # the gate: a tube frame with its own fabric and a middle brace, hung on the gate post, swung 50 degrees open
    # toward the camera
    gw, gh = 1.12, 1.75
    parts = [tubes(bpy, 'gate_frame', steel, [((0, 0, 0.06), (gw, 0, 0.06)), ((gw, 0, 0.06), (gw, 0, gh)), ((gw, 0, gh), (0, 0, gh)),
                                              ((0, 0, gh), (0, 0, 0.06)), ((0, 0, 0.9), (gw, 0, 0.9))], 0.02, n=8),
             tubes(bpy, 'gate_fabric', wire, diamonds(0.03, gw - 0.03, 0.08, gh - 0.02, P), R)]
    for z in (0.3, 1.45):   # the hinges
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.035, depth=0.08, location=(0.0, 0, z))
        parts.append(put(bpy, bpy.context.active_object, 'hinge_%d' % int(z * 100), steel))
    bpy.ops.object.empty_add(location=(posts[2] + 0.06, 0, 0)); g = bpy.context.active_object; g.name = 'gate'
    for p in parts: p.parent = g
    g.rotation_euler = (0, 0, math.radians(-50))
    # THE ONE ASYMMETRIC THING: the chain that held the gate cut through, hanging off the latch post, the padlock still
    # shut on it; links as small rings
    import mathutils as mu
    for i in range(9):   # round three: links at a real 5 cm were a rusty smear; a heavy gate chain's 8 cm links read
        z = 1.1 - i * 0.1; dx = 0.08 + 0.02 * math.sin(i * 1.3)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.045, minor_radius=0.013, major_segments=10, minor_segments=5,
                                         location=(posts[3] - dx, -0.05, z), rotation=(0 if i % 2 else math.pi / 2, math.pi / 2, 0))
        put(bpy, bpy.context.active_object, 'link_%d' % i, barb)
    box(bpy, 'padlock', barb, (0.08, 0.035, 0.1), (posts[3] - 0.09, -0.05, 0.16), bevel=0.01)
    # a sign wired to the fabric on the first panel, a little crooked
    box(bpy, 'sign', sign, (0.48, 0.015, 0.32), (-1.75, -0.025, 1.2), rot=(0, math.radians(4), 0), bevel=0.006)


def dims(bpy):
    import mathutils
    lo, hi = [1e9] * 3, [-1e9] * 3
    for o in bpy.context.scene.objects:
        if o.type != 'MESH': continue
        for c in o.bound_box:
            p = o.matrix_world @ mathutils.Vector(c)
            lo = [min(a, b) for a, b in zip(lo, p)]; hi = [max(a, b) for a, b in zip(hi, p)]
    return [round(h - l, 3) for l, h in zip(lo, hi)]


BUILDERS = {'lamp': lamp, 'gun': gun, 'wreck': wreck, 'barrier': barrier, 'dumpster': dumpster, 'cart': cart, 'tyres': tyres,
            'sandbags': sandbags, 'fence': fence}


def build(name, out):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    BUILDERS[name](bpy, mathutils)
    bpy.context.view_layer.update()
    print('DIMS x y z (m):', dims(bpy), 'materials:', len(bpy.data.materials))
    for o in bpy.context.scene.objects: o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    name = a[0]
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % name)
    print(build(name, out))
