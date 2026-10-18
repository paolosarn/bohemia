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


BUILDERS = {'lamp': lamp, 'gun': gun, 'wreck': wreck}


def build(name, out):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    BUILDERS[name](bpy, mathutils)
    for o in bpy.context.scene.objects: o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    name = a[0]
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % name)
    print(build(name, out))
