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
  container a twenty-foot ISO box at its real 6.058 x 2.438 x 2.591 m, trapezoid corrugation, doors with four locking
            bars and the owner's code stencilled, a BLOCKER a man can climb, the twin pack:Cargo, crates and
            containers#36. The odd thing: a window torch-cut in the side, the panel leaning under it, a blanket for a
            curtain. On the sheet at SW, the three-quarter his pack draws containers at.
  propane   a 500-gallon propane tank at its real 3.02 m by 0.95 m, 2:1 heads, saddle legs on concrete pads, the valve
            dome, COVER that stops a man, the twins pack:Cargo, crates and containers#22 (his gas bottles) and
            9. Boilers and tanks#25. The odd thing: the dome's lid thrown back and a cut hose run off the open valve.
  rubble    a rubble mound 4.6 m across and 1.4 m high, what a two-storey house comes down to: gravel fill, 450 lumps,
            a floor slab cracked in two across the top with its rebar bridging the crack; the MOUND (high ground) a man
            stands on, the twin pack:9. Rubble and debris#1. The odd thing: a white bathtub tipped up at its foot.
  corral    a supermarket cart corral, 6 m of galvanised pipe, COVER that stops a man, holding LAST ROUND'S CART four
            times nested (imported whole from cart.glb, never remodelled); he owns no cart or corral (the twin is his
            wire bin, pack:15. Street props#21). The odd thing: one cart left outside on its side by the open end.

Run with the rig's Blender python (bpy 4.2):
    <venv>/bin/python tools/bohemia_cook_model_props.py <name> [--out reference/models/bohemia/<name>.glb]   (it prints the model's
        size in metres and its materials; pass the size to the rig as --real-length and --real-dims)
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


def trap(bpy, name, m, length, base=0.21, top=0.072, depth=0.036):
    """one corrugation of container steel: a trapezoid section (the flat outer face, the two slopes that catch the sun
    and shade) pulled along local Z, standing proud of the wall toward local -Y"""
    a, b, h = base / 2, top / 2, length / 2
    vs = [(x, y, z) for z in (-h, h) for x, y in ((-a, 0.0), (-b, -depth), (b, -depth), (a, 0.0))]
    fs = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (0, 4, 7, 3), (3, 2, 1, 0), (4, 5, 6, 7)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    return o


def container(bpy, mathutils):
    # a twenty-foot ISO shipping container at its real outside size, 6.058 x 2.438 x 2.591 m (the twin pack:Cargo,
    # crates and containers#36, his red one): a steel frame (corner posts, top and bottom rails, corner castings), thin
    # walls with the vertical corrugation proud of them every 28 cm, the front wall corrugated across, a flat roof with
    # shallow ribs, the doors at +X with four locking bars and their handles. It blocks a man and a bullet and a man
    # can climb it (the board count's 'container 6.1 x 2.4 BLOCKER climbable'). The odd thing: a window torch-cut in
    # the long side, its edges burnt to rust, the cut-out panel leaning against the wall under it, a blanket hung
    # inside for a curtain: somebody lived in it.
    L, W, H = 6.058, 2.438, 2.591
    # round two of the loop: the straight side read as a plank shed (7.5 cm boxes every 28 cm are boards, not steel:
    # real corrugation is a trapezoid whose two slopes take the sun and the shade), the roof dusted to a pale pink over
    # 40% of the picture, and a brown blanket filling the window read as a framed picture. Trapezoid corrugation, the
    # roof a step darker, the blanket grey and half drawn so the dark inside shows
    # round three: the walls and the roof landed on one middle value (span 75), the dusted roof and the red sides alike;
    # the walls a step down (a container's sides in its own shade), the roof a step up where the sun bleached it
    paint, roofp, rust = mat(bpy, 'paint_red', 'clay_rust', 1), mat(bpy, 'paint_roof', 'clay_rust', 2), mat(bpy, 'rust', 'clay_mustard', 1)
    # round four: the dark walls were one smooth colour (the card BACK: top eight 11.0%, grain 2.61); the walls now
    # carry what a real box carries, rust run down the ribs from the roof and up from the sill, and the owner's code
    # stencilled on the doors (the stencil and the blanket are one pale material: the guide caps a prop at five)
    bars, pale = mat(bpy, 'steel', 'tape_grey', 1), mat(bpy, 'stencil_and_blanket', 'tape_masking', 3)
    T, D, pitch = 0.02, 0.036, 0.28                       # wall plate, the corrugation's depth, its pitch
    yi = W / 2 - 0.06                                     # the side walls' plane, inside the frame
    # the frame
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(bpy, 'post_%d_%d' % (sx, sy), paint, (0.16, 0.16, H - 0.24), (sx * (L / 2 - 0.08), sy * (W / 2 - 0.08), H / 2))
            for z in (0.06, H - 0.06):
                box(bpy, 'casting_%d_%d_%d' % (sx, sy, int(z * 10)), rust, (0.18, 0.162, 0.12), (sx * (L / 2 - 0.09), sy * (W / 2 - 0.081), z), bevel=0.01)
        box(bpy, 'end_sill_%d' % sx, rust, (0.12, W - 0.36, 0.16), (sx * (L / 2 - 0.06), 0, 0.08))
        box(bpy, 'end_header_%d' % sx, paint, (0.12, W - 0.36, 0.12), (sx * (L / 2 - 0.06), 0, H - 0.06))
    for sy in (-1, 1):
        box(bpy, 'sill_%d' % sy, rust, (L - 0.36, 0.12, 0.16), (0, sy * (W / 2 - 0.06), 0.08))         # the bottom rails rot first
        box(bpy, 'top_rail_%d' % sy, paint, (L - 0.36, 0.1, 0.1), (0, sy * (W / 2 - 0.05), H - 0.05))
    # the walls: a thin plate, the corrugation proud of it; the -Y wall carries the window
    win = (-1.05, 1.5, 0.95, 0.62)                        # centre x, centre z, width, height
    zs, ze = 0.16, H - 0.1
    for sy in (-1, 1):
        wall = box(bpy, 'wall_%d' % sy, paint, (L - 0.32, T, ze - zs), (0, sy * yi, (zs + ze) / 2))
        x = -L / 2 + 0.3
        i = 0
        while x < L / 2 - 0.28:
            spans = [(zs, ze)]
            if sy < 0 and abs(x - win[0]) < win[2] / 2 + 0.105:
                spans = [(zs, win[1] - win[3] / 2), (win[1] + win[3] / 2, ze)]
            for k, (a, b) in enumerate(spans):
                r = trap(bpy, 'rib_%d_%d_%d' % (sy, i, k), paint, b - a, depth=D)
                r.location = (x, sy * (yi + T / 2), (a + b) / 2); r.rotation_euler = (0, 0, 0 if sy < 0 else math.pi)
            x += pitch; i += 1
        if sy < 0:
            cut(bpy, wall, (win[2], 0.3, win[3]), (win[0], -yi, win[1]), (0, 0, 0))
    wall = box(bpy, 'front_wall', paint, (T, W - 0.32, ze - zs), (-L / 2 + 0.06, 0, (zs + ze) / 2))
    z = zs + 0.12
    while z < ze - 0.1:   # the front wall corrugated across: the rib's along-axis turned to Y, its outward to -X
        r = trap(bpy, 'front_rib_%d' % int(z * 100), paint, W - 0.36, depth=D)
        r.matrix_world = mathutils.Matrix(((0, 1, 0, -L / 2 + 0.06 - T / 2), (0, 0, 1, 0), (1, 0, 0, z), (0, 0, 0, 1)))
        z += pitch
    box(bpy, 'roof', roofp, (L - 0.2, W - 0.2, 0.03), (0, 0, H - 0.045))
    for i in range(18):
        box(bpy, 'roof_rib_%d' % i, roofp, (0.12, W - 0.24, 0.018), (-L / 2 + 0.4 + i * 0.31, 0, H - 0.025), bevel=0.005)
    box(bpy, 'floor', bars, (L - 0.2, W - 0.2, 0.04), (0, 0, 0.17))
    # the doors at +X: two leaves, a seam, four locking bars with their keepers and handles, the hinges at the edges
    xd = L / 2 - 0.05
    for sy in (-1, 1):
        box(bpy, 'door_%d' % sy, paint, (0.03, W / 2 - 0.17, H - 0.32), (xd, sy * (W / 4 - 0.035), H / 2), bevel=0.006)
        for zz in (0.5, 1.3, 2.1):
            box(bpy, 'hinge_%d_%d' % (sy, int(zz * 10)), bars, (0.05, 0.1, 0.08), (xd + 0.02, sy * (W / 2 - 0.17), zz))
        for yy in (0.27, 0.8):
            cyl(bpy, 'lockbar_%d_%d' % (sy, int(yy * 100)), bars, 0.022, H - 0.42, (xd + 0.05, sy * yy, H / 2), verts=8)
            for zz in (0.3, H - 0.3):
                box(bpy, 'keeper_%d_%d_%d' % (sy, int(yy * 100), int(zz * 10)), bars, (0.05, 0.08, 0.06), (xd + 0.05, sy * yy, zz))
            box(bpy, 'handle_%d_%d' % (sy, int(yy * 100)), bars, (0.04, 0.3, 0.035), (xd + 0.08, sy * (yy - 0.12), 1.15), rot=(math.radians(-8 * sy), 0, 0))
    # the owner's code and the check digit, stencilled on the right-hand leaf: four letters, six figures, the size code
    import random
    rs = random.Random(3)
    for row, (z, n, h) in enumerate(((2.08, 4, 0.11), (1.92, 7, 0.11), (1.62, 4, 0.08))):
        for k in range(n):
            if rs.random() < 0.12: continue                                              # a letter weathered off
            box(bpy, 'stencil_%d_%d' % (row, k), pale, (0.01, 0.055, h), (xd + 0.02, -0.12 - k * 0.075, z))
    # THE ONE ASYMMETRIC THING: the window torch-cut in the long side, a burnt rust edge round it, the panel that came
    # out leaning against the wall below, and a blanket hung inside for a curtain
    x0, z0, ww, wh = win
    y = -yi - D - 0.006
    for (dx, dz, sx_, sz_) in ((0, wh / 2, ww + 0.08, 0.045), (0, -wh / 2, ww + 0.08, 0.045), (ww / 2, 0, 0.045, wh), (-ww / 2, 0, 0.045, wh)):
        box(bpy, 'burn_%d_%d' % (int(dx * 100), int(dz * 100)), rust, (sx_, 0.012, sz_), (x0 + dx, y + 0.02, z0 + dz))
    panel = box(bpy, 'cut_panel', paint, (ww, T, wh), (0, 0, 0))
    for i in range(3):
        r = trap(bpy, 'cut_panel_rib_%d' % i, paint, wh, depth=D); r.location = (-ww / 2 + 0.2 + i * pitch, -T / 2, 0); r.parent = panel
    panel.location = (x0 + 0.3, -W / 2 - 0.08, wh / 2 * math.cos(math.radians(12)) + 0.01); panel.rotation_euler = (math.radians(-12), 0, math.radians(4))
    box(bpy, 'curtain', pale, (ww * 0.45, 0.02, wh * 0.95), (x0 - ww * 0.24, -yi + 0.1, z0 - 0.02), rot=(0, math.radians(2), math.radians(3)), bevel=0.01)
    # the wear: rust run down a few ribs from the roof, and patches on the roof
    rr = random.Random(9)
    for sy in (-1, 1):
        for i in range(19):
            x = -L / 2 + 0.3 + i * pitch
            if sy < 0 and abs(x - win[0]) < win[2] / 2 + 0.105: continue
            yy = sy * (yi + D + T / 2 + 0.004)
            if rr.random() < 0.55:                                                      # run down from the roof seam
                ln = rr.uniform(0.3, 1.5); box(bpy, 'streak_%d_%d' % (sy, i), rust, (rr.uniform(0.03, 0.06), 0.006, ln), (x + rr.uniform(-0.02, 0.02), yy, ze - ln / 2))
            if rr.random() < 0.6:                                                       # and up from the rotten sill
                ln = rr.uniform(0.15, 0.6); box(bpy, 'creep_%d_%d' % (sy, i), rust, (0.065, 0.006, ln), (x, yy, zs + ln / 2))
    for i, (x, y_, r) in enumerate(((-1.8, 0.4, 0.4), (1.2, -0.5, 0.3), (2.3, 0.6, 0.22))):
        blotch(bpy, 'roof_rust_%d' % i, rust, r, (x, y_, H - 0.015), (0, 0, 0), seed=61 + i)


def propane(bpy, mathutils):
    # a 500-gallon propane tank at its real size (3.02 m long, 0.95 m across, 1.2 m to the top of its dome), the kind
    # behind every trailer in the valley; the twins his gas bottles (pack:Cargo, crates and containers#22, approved) and
    # his horizontal boiler (pack:9. Boilers and tanks#25, never judged): a white shell with 2:1 heads and their weld
    # seams, two saddle legs on concrete pads, lifting lugs, the valve dome on top. COVER that also stops a man (the
    # board count's 'propane tank 2.4 x 1.2, cover that stops you'). The odd thing: the dome's lid thrown back and a
    # hose run off the service valve, over the shell and down to the ground, cut: somebody drained it.
    L, R = 3.02, 0.475
    # round two of the loop: the lid stood straight up off its hinge like a lollipop sign (and made the tank 1.6 m),
    # and five dark rust stains sat on the white like cow spots. The lid thrown all the way back onto the shell, the rust
    # a step lighter, smaller, gathered where a tank really rusts: at the seams, the lugs and over the legs
    white, rust, steel = mat(bpy, 'paint_white', 'clay_bone', 3), mat(bpy, 'rust', 'clay_rust', 2), mat(bpy, 'steel', 'tape_grey', 1)
    pad, hose = mat(bpy, 'concrete', 'tape_grey', 2), mat(bpy, 'hose', 'rubber', 1)
    zc, hl = 0.13 + R, 0.24                               # the axis height (legs and pads under it), a 2:1 head's depth
    cyl(bpy, 'shell', white, R, L - 2 * hl, (0, 0, zc), rot=(0, math.pi / 2, 0), verts=32)
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=32, ring_count=16, location=(sx * (L / 2 - hl), 0, zc))
        h = put(bpy, bpy.context.active_object, 'head_%d' % sx, white); h.scale = (hl, R, R)
        cyl(bpy, 'seam_%d' % sx, rust, R + 0.006, 0.025, (sx * (L / 2 - hl), 0, zc), rot=(0, math.pi / 2, 0), verts=32)
        # the saddle leg: a plate curved to the shell, a foot, on its concrete pad
        x = sx * 0.95
        box(bpy, 'saddle_%d' % sx, steel, (0.08, 0.62, 0.3), (x, 0, 0.22))
        box(bpy, 'foot_%d' % sx, steel, (0.2, 0.72, 0.02), (x, 0, 0.11))
        box(bpy, 'pad_%d' % sx, pad, (0.42, 1.0, 0.1), (x + sx * 0.02, 0.0, 0.05), rot=(0, 0, math.radians(3 * sx)), bevel=0.01)
        cyl(bpy, 'lug_%d' % sx, steel, 0.035, 0.03, (sx * 0.7, 0, zc + R + 0.01), rot=(math.pi / 2, 0, 0), verts=10)
    cyl(bpy, 'seam_mid', rust, R + 0.005, 0.02, (0, 0, zc), rot=(0, math.pi / 2, 0), verts=32)
    # rust coming through the white on the upper sides, the dome's weeping first; a stain is laid on the shell's surface
    def on_shell(x, th, r, seed):
        blotch(bpy, 'rust_%d' % seed, rust, r, (x, -(R + 0.004) * math.sin(th), zc + (R + 0.004) * math.cos(th)), (th, 0, 0), seed=seed, thick=0.01)
    for i, (x, th, r) in enumerate(((-1.24, 0.8, 0.06), (-1.27, 1.25, 0.05), (1.25, 0.6, 0.05), (0.02, 0.95, 0.045), (-0.95, 1.5, 0.08),
                                    (0.95, 1.45, 0.07), (-0.7, 0.2, 0.04), (0.7, 0.15, 0.045), (0.4, 1.1, 0.035), (-0.3, 0.5, 0.03))):
        on_shell(x, th, r, 71 + i)
    # the dome: a collar, the valves inside it, and THE ONE ASYMMETRIC THING its lid thrown back on the hinge
    zt = zc + R
    cyl(bpy, 'dome_collar', white, 0.24, 0.1, (0, 0, zt + 0.03), verts=24)
    cyl(bpy, 'dome_well', steel, 0.21, 0.02, (0, 0, zt + 0.075), verts=24)
    for i, (x, y, h) in enumerate(((-0.08, 0.04, 0.09), (0.06, -0.05, 0.07), (0.1, 0.08, 0.05))):
        cyl(bpy, 'valve_%d' % i, steel, 0.025, h, (x, y, zt + 0.08 + h / 2), verts=8)
    cyl(bpy, 'gauge', white, 0.04, 0.02, (-0.1, -0.08, zt + 0.12), verts=12)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=24, ring_count=12, location=(0, 0, 0))
    lid = put(bpy, bpy.context.active_object, 'dome_lid', white); lid.scale = (0.25, 0.25, 0.12)
    for v in lid.data.vertices:
        if v.co.z < 0: v.co.z = 0
    bpy.ops.object.empty_add(location=(-0.25, 0, zt + 0.08)); hinge = bpy.context.active_object; hinge.name = 'dome_hinge'
    lid.parent = hinge; lid.location = (0.25, 0, 0); hinge.rotation_euler = (0, math.radians(-168), 0)   # over onto the shell, toward -X
    # the hose: off the service valve, over the collar, down the near side of the shell to the ground, along it, cut
    pts = [(0.06, -0.05, zt + 0.14), (0.04, -0.2, zt + 0.17), (0.0, -0.3, zt + 0.1)]
    for k in range(1, 9):
        th = 0.55 + k * 0.13
        pts.append((-0.04 * k, -(R + 0.025) * math.sin(th), zc + (R + 0.025) * math.cos(th)))
    pts += [(-0.4, -0.5, 0.16), (-0.48, -0.52, 0.03), (-0.75, -0.48, 0.025), (-1.0, -0.36, 0.025), (-1.18, -0.42, 0.025), (-1.3, -0.5, 0.03)]
    tubes(bpy, 'hose', hose, list(zip(pts[:-1], pts[1:])), 0.02, n=8)
    cyl(bpy, 'hose_cut', steel, 0.024, 0.04, (-1.32, -0.51, 0.03), rot=(0, math.pi / 2, math.radians(-20)), verts=8)


def chunk(bpy, name, m, size, loc, rot, rnd, jit=(0.22, 0.22, 0.22)):
    """a broken lump of concrete: a box cut once and every corner knocked a different way, so no two faces are square
    (jit: how far a corner moves, a share of the size on each axis; a floor slab breaks in plan, not in thickness)"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    o = bpy.context.active_object; o.scale = size; bpy.ops.object.transform_apply(scale=True)
    md = o.modifiers.new('cut', 'SUBSURF'); md.subdivision_type = 'SIMPLE'; md.levels = 1; bpy.ops.object.modifier_apply(modifier='cut')
    seen = {}
    for v in o.data.vertices:
        k = tuple(round(c, 4) for c in v.co)
        if k not in seen: seen[k] = [rnd.uniform(-j, j) * s for j, s in zip(jit, size)]
        v.co = [c + d for c, d in zip(v.co, seen[k])]
    o.location = loc; o.rotation_euler = rot
    return put(bpy, o, name, m, smooth=False)


def rubble(bpy, mathutils):
    # a rubble mound (the twin pack:9. Rubble and debris#1): what a two-storey house comes down to, about 4 m across
    # and 1.2 m high, a dome of broken fill (plaster, brick dust, gravel), concrete lumps from fist to suitcase, a floor
    # slab come down across the top with its rebar torn out of the broken edge, more rebar bent out of the heap. It is
    # the MOUND the fight rests on (high ground, the first floor effect, rule 59): the slab is the flat place a man
    # stands. The odd thing: a white bathtub tipped on its side and half buried at one end of the heap.
    import random
    rnd = random.Random(11)
    # round two of the loop: the slab broke like a crystal (a corner knocked 22% of 1.7 m is a spike), the fill was a
    # smooth beige dome with lumps sat on it, his heap is lumps all the way down, and the tub faced away (a white brick).
    # The slab breaks in plan only, 170 small lumps cover the heap over a darker fill, the tub's open side to the street
    fill, conc, conc_d = mat(bpy, 'fill', 'clay_bone', 0), mat(bpy, 'concrete', 'tape_grey', 2), mat(bpy, 'concrete_old', 'tape_grey', 1)
    rebar, tub = mat(bpy, 'rebar', 'clay_rust', 1), mat(bpy, 'enamel', 'clay_bone', 4)
    A, B, Hd = 1.9, 1.6, 0.62
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=40, ring_count=20, location=(0, 0, 0))
    dome = put(bpy, bpy.context.active_object, 'fill', fill, smooth=False)
    p1, p2 = rnd.uniform(0, 6), rnd.uniform(0, 6)
    for v in dome.data.vertices:
        a = math.atan2(v.co.y, v.co.x)
        k = 1 + 0.13 * math.sin(3 * a + p1) + 0.07 * math.sin(5 * a + p2)               # a ragged edge, never an ellipse
        z = max(0.0, v.co.z) ** 1.4                                                       # slumped, a heap not a ball
        v.co = (v.co.x * A * k, v.co.y * B * k, z * Hd * (1 + 0.12 * math.sin(4 * v.co.x + 2 * v.co.y)))
    # round three: the fill itself knobbled like gravel (a cell texture at 12 cm pushing the surface 7 cm), because a
    # smooth dome under scattered lumps still read as a dome
    sub = dome.modifiers.new('cut', 'SUBSURF'); sub.subdivision_type = 'SIMPLE'; sub.levels = 2; bpy.ops.object.modifier_apply(modifier='cut')
    tex = bpy.data.textures.new('gravel', 'VORONOI'); tex.noise_scale = 0.12; tex.distance_metric = 'DISTANCE'
    dsp = dome.modifiers.new('gravel', 'DISPLACE'); dsp.texture = tex; dsp.texture_coords = 'GLOBAL'; dsp.strength = 0.07; dsp.mid_level = 0.6
    bpy.ops.object.modifier_apply(modifier='gravel')
    for v in dome.data.vertices:
        if v.co.z < 0: v.co.z = 0
    def top(x, y):   # the fill's height under a point, for seating a lump on it
        u = (x / A) ** 2 + (y / B) ** 2
        return Hd * max(0.0, 1 - u) ** 0.7
    # the lumps: big ones round the foot where they rolled, smaller up the slope, a few on the top
    for i in range(30):
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0.15, 1.05) ** 0.6
        x, y = A * d * math.cos(a) * 0.98, B * d * math.sin(a) * 0.98
        s = rnd.uniform(0.12, 0.26) * (1.5 if d > 0.85 else 1.0)
        size = (s * rnd.uniform(1.0, 2.0), s * rnd.uniform(0.8, 1.5), s * rnd.uniform(0.5, 0.9))
        chunk(bpy, 'lump_%d' % i, conc if rnd.random() < 0.65 else conc_d, size, (x, y, top(x, y) + size[2] * 0.2),
              (rnd.uniform(-0.5, 0.5), rnd.uniform(-0.5, 0.5), rnd.uniform(0, 3)), rnd, jit=(0.15, 0.15, 0.15))
    for i in range(420):   # the small stuff the heap is made of, fist to brick, over all of it
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0.0, 1.0) ** 0.5
        x, y = A * d * math.cos(a), B * d * math.sin(a)
        s = rnd.uniform(0.06, 0.14)
        size = (s * rnd.uniform(1.0, 1.8), s * rnd.uniform(0.8, 1.4), s * rnd.uniform(0.5, 0.9))
        chunk(bpy, 'grit_%d' % i, conc if rnd.random() < 0.55 else conc_d, size, (x, y, top(x, y) + size[2] * 0.1),
              (rnd.uniform(-0.6, 0.6), rnd.uniform(-0.6, 0.6), rnd.uniform(0, 3)), rnd, jit=(0.2, 0.2, 0.2))
    # the floor slab across the top, tilted, and the rebar torn out of its broken edge
    # the slab cracked across in two, the far half dropped and tipped (round three: one clean plate looked new)
    chunk(bpy, 'slab_far', conc_d, (0.75, 1.2, 0.16), (-0.62, 0.38, 0.62), (math.radians(4), math.radians(-17), math.radians(22)), random.Random(5), jit=(0.06, 0.06, 0.03))
    slab = chunk(bpy, 'slab', conc, (0.95, 1.25, 0.16), (0.42, -0.02, 0.8), (math.radians(7), math.radians(-9), math.radians(22)), random.Random(4), jit=(0.06, 0.06, 0.03))
    bars = []
    for i in range(7):
        t = -0.55 + i * 0.18
        # out of the crack between the two halves, still bridging it, bent where it tore
        p0 = mathutils.Vector((-0.47, t, 0.0)); p1 = p0 + mathutils.Vector((-rnd.uniform(0.12, 0.3), rnd.uniform(-0.12, 0.12), rnd.uniform(-0.05, 0.25)))
        p2 = p1 + mathutils.Vector((-rnd.uniform(0.05, 0.2), rnd.uniform(-0.15, 0.15), rnd.uniform(-0.25, 0.05)))
        m_ = slab.matrix_world
        bars += [(tuple(m_ @ p0), tuple(m_ @ p1)), (tuple(m_ @ p1), tuple(m_ @ p2))]
    for i in range(6):   # and bars bent up out of the heap itself
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0.3, 0.75)
        x, y = A * d * math.cos(a), B * d * math.sin(a); z = top(x, y)
        p1 = (x + rnd.uniform(-0.2, 0.2), y + rnd.uniform(-0.2, 0.2), z + rnd.uniform(0.3, 0.6))
        bars += [((x, y, z - 0.05), p1), (p1, (p1[0] + rnd.uniform(-0.25, 0.25), p1[1] + rnd.uniform(-0.25, 0.25), p1[2] - rnd.uniform(0.0, 0.2)))]
    tubes(bpy, 'rebar', rebar, bars, 0.016, n=6)
    # THE ONE ASYMMETRIC THING: a bathtub on its side, its open face toward the street, half sunk in the heap's left end
    # (round three: a box with a box cut out of it came out a white frame with no floor; the tub is now an open shell)
    import bmesh
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co.x *= 1.52; v.co.y *= 0.72; v.co.z *= 0.52
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.normal.z > 0.9], context='FACES')
    me = bpy.data.meshes.new('tub'); bm.to_mesh(me); bm.free()
    t = bpy.data.objects.new('tub', me); bpy.context.collection.objects.link(t); t.data.materials.append(tub)
    bpy.context.view_layer.objects.active = t; t.select_set(True)
    bv = t.modifiers.new('round', 'BEVEL'); bv.width = 0.12; bv.segments = 3
    sol = t.modifiers.new('shell', 'SOLIDIFY'); sol.thickness = 0.05; sol.offset = -1
    bpy.ops.object.modifier_apply(modifier='round'); bpy.ops.object.modifier_apply(modifier='shell')
    for p in me.polygons: p.use_smooth = True
    # round four: on its side and sunk in the heap, the fill ran through its inside and it read as a white frame; tipped
    # up at the heap's foot instead, the white inside toward the street and the sky, a few lumps fallen into it
    t.location = (-1.62, -0.72, 0.36); t.rotation_euler = (math.radians(58), math.radians(-12), math.radians(-24))
    for i, (x, y, z) in enumerate(((-1.75, -0.86, 0.3), (-1.42, -0.8, 0.33))):
        chunk(bpy, 'lump_in_tub_%d' % i, conc, (0.16, 0.13, 0.09), (x, y, z), (0.3, 0.1, i * 1.7), rnd)
    for i, (x, y) in enumerate(((-1.0, -0.95), (-1.85, -0.25))):   # the heap spilt over its rim
        chunk(bpy, 'lump_tub_%d' % i, conc_d, (0.3, 0.24, 0.16), (x, y, 0.08), (0.2, -0.3, i), rnd)


def import_model(bpy, path, loc, rot, drop=()):
    """an earlier prop brought in whole (its own glb, untouched) under a new handle: the cart in the corral is last
    round's cart, not a new one. Objects whose names start with a word in drop are removed (a bag left in one cart is
    not left in five); materials of the same name are made one, so the guide's cap counts kinds, not copies"""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    for o in [o for o in new if o.name.split('.')[0].startswith(tuple(drop))] if drop else []:
        new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
    for me in list(bpy.data.meshes):
        if me.users == 0: bpy.data.meshes.remove(me)
    bpy.ops.object.empty_add(location=loc); h = bpy.context.active_object; h.rotation_euler = rot
    for o in new:
        if o.parent is None: o.parent = h
    first = {}
    for m in bpy.data.materials: first.setdefault(m.name.split('.')[0], m)
    for o in new:
        if o.type == 'MESH':
            for s in o.material_slots:
                if s.material: s.material = first[s.material.name.split('.')[0]]
    for m in list(bpy.data.materials):
        if m.users == 0: bpy.data.materials.remove(m)
    return h


def corral(bpy, mathutils):
    # a cart corral from a supermarket car park, 6.0 m of galvanised pipe (the board count's 'cart corral 6.0 x 2.5
    # COVER that stops you': 1.0 m rails a man fires over and cannot walk through), a U at the closed end, the open
    # end flared, the sign on its post. Inside, LAST ROUND'S CART four times nested, the model imported whole and
    # untouched (tools/bohemia_cook_model_props.py cart, reference/models/bohemia/cart.glb), the bag taken out of all
    # but the last. He owns no cart and no corral (the quartermaster's line says zero); the nearest he owns is the wire
    # bin and a street railing. The odd thing: one cart left outside on its side by the open end. The pipe is the
    # cart's own wire material and the sign its handle red, so the whole thing stays inside five materials.
    cart_glb = os.path.join(ROOT, 'reference/models/bohemia/cart.glb')
    for i in range(4):
        import_model(bpy, cart_glb, (-2.1 + i * 0.3, 0.0, 0.0), (0, 0, math.pi), drop=('bag',) if i < 3 else ())
    import_model(bpy, cart_glb, (2.0, -0.66, 0.29), (math.radians(90), 0, math.radians(-15)), drop=('bag',))
    pipe = bpy.data.materials['wire']; red = bpy.data.materials['handle_red']
    W, x0, x1 = 0.5, -2.5, 3.0
    rails = []
    for z in (0.15, 0.55, 1.0):
        for sy in (-1, 1):
            rails += [((x0, sy * W, z), (x1 - 0.3, sy * W, z)), ((x1 - 0.3, sy * W, z), (x1, sy * (W + 0.15), z))]   # flared at the mouth
        pts = [(x0 - W * math.sin(math.pi * k / 12), -W * math.cos(math.pi * k / 12), z) for k in range(13)]     # the U at the closed end
        rails += list(zip(pts[:-1], pts[1:]))
    tubes(bpy, 'rails', pipe, rails, 0.028, n=8)
    posts = []
    for x in (-2.5, -0.7, 1.1, 2.7):
        for sy in (-1, 1):
            posts.append(((x, sy * W, 0.0), (x, sy * W, 1.03)))
            box(bpy, 'foot_%d_%d' % (int(x * 10), sy), pipe, (0.14, 0.14, 0.012), (x, sy * W, 0.006))
    posts.append(((x0 - W, 0, 0.0), (x0 - W, 0, 1.95)))
    tubes(bpy, 'posts', pipe, posts, 0.032, n=8)
    box(bpy, 'sign', red, (0.58, 0.04, 0.4), (x0 - W, -0.05, 1.68), rot=(0, 0, math.radians(-20)), bevel=0.01)   # to the car park, not edge-on to it


def seat(bpy, h, objs=None):
    """drop a handle so the lowest vertex of its meshes sits on the ground (z 0): a car rolled onto its roof rests on
    whatever is lowest once it is over"""
    import mathutils
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get(); lo = 1e9
    for o in objs or [o for o in bpy.context.scene.objects if o.type == 'MESH']:
        e = o.evaluated_get(dg); me = e.to_mesh()
        for v in me.vertices: lo = min(lo, (e.matrix_world @ v.co).z)
        e.to_mesh_clear()
    h.location.z -= lo
    bpy.context.view_layer.update()


def shards(bpy, name, m, rnd, centre, spread, n, size=(0.03, 0.08)):
    """broken glass or grit scattered flat on the road round a point, thicker near it (one mesh)"""
    vs, fs = [], []
    for i in range(n):
        a = rnd.uniform(0, 2 * math.pi); d = spread * rnd.random() ** 1.6
        x, y = centre[0] + d * math.cos(a) * 1.4, centre[1] + d * math.sin(a)
        s = rnd.uniform(*size); t = rnd.uniform(0, math.pi)
        b = len(vs)
        for k in range(3):
            aa = t + k * 2.1 + rnd.uniform(-0.3, 0.3)
            vs.append((x + s * math.cos(aa), y + s * math.sin(aa), 0.004 + 0.003 * rnd.random()))
        fs.append((b, b + 1, b + 2))
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    return o


def rolled(bpy, mathutils):
    # [the empty terrains' cover] 10/18: THE FREEWAY. Last round's wreck (reference/models/bohemia/wreck.glb) rolled onto
    # its roof, imported whole and untouched (rule 115a: one table), its belly and three wheels to the sky, the bare rim
    # where the fourth was. A BLOCKER a man crouches behind (1.4 m of car on its back). The twin his own wreck
    # (pack:9. Abandoned cards#0): he draws every car on its wheels. The odd thing: the boot sprung open against the road
    # and a suitcase slid out of it, burst, and the glass of the rear screen spread out behind in a fan.
    import random
    rnd = random.Random(17)
    h = import_model(bpy, os.path.join(ROOT, 'reference/models/bohemia/wreck.glb'), (0, 0, 0), (0, 0, 0))
    glass, trim, paint_lo = bpy.data.materials['glass_gone'], bpy.data.materials['trim'], bpy.data.materials['paint_teal_low']
    under, rubber, rust = bpy.data.materials['rust_dark'], bpy.data.materials['tyre'], bpy.data.materials['rust']
    # round two of the loop: the belly came out one pale slab (the wreck was modelled to be seen from above, and the
    # source pass dusts every up face). What a car shows on its back, built in its own upright frame under the 0.26 m
    # sill and turned over with it: the floor pan, the chassis rails, the exhaust and its silencer, the fuel tank, the
    # sump, the two axles, all in the wreck's own dark materials (nothing new: the guide's cap)
    belly = [box(bpy, 'floor_pan', under, (3.9, 1.5, 0.04), (0, 0, 0.245)),
             box(bpy, 'sump', under, (0.6, 0.5, 0.18), (1.35, 0, 0.17), bevel=0.02),
             box(bpy, 'fuel_tank', rubber, (0.75, 1.05, 0.2), (-1.65, 0.05, 0.16), bevel=0.03),
             box(bpy, 'silencer', rust, (0.7, 0.26, 0.17), (-0.6, -0.42, 0.17), bevel=0.04)]
    for sy in (-1, 1):
        belly.append(box(bpy, 'rail_%d' % sy, rubber, (4.0, 0.1, 0.12), (0, sy * 0.52, 0.2)))
    for x in (1.42, -1.42):
        belly.append(rod(bpy, 'axle_%d' % int(x * 10), rubber, (x, -0.8, 0.34), (x, 0.8, 0.34), 0.045))
    belly.append(rod(bpy, 'diff', rubber, (-1.42, -0.02, 0.24), (-1.42, 0.02, 0.24), 0.16, verts=12))
    belly.append(rod(bpy, 'driveshaft', rust, (1.0, 0.0, 0.2), (-1.3, 0.0, 0.22), 0.04))
    belly.append(rod(bpy, 'exhaust_a', rust, (1.25, -0.3, 0.17), (-0.25, -0.42, 0.16), 0.032))
    belly.append(rod(bpy, 'exhaust_b', rust, (-0.95, -0.42, 0.16), (-2.4, -0.48, 0.2), 0.032))
    for o in belly:
        if o.parent is None: o.parent = h
    h.rotation_euler = (math.radians(176), math.radians(-4), math.radians(8))
    seat(bpy, h)
    # the boot lid, sprung on its hinges and down on the road behind (the wreck's tail is -X, now at the far end)
    box(bpy, 'boot_lid', paint_lo, (0.86, 1.42, 0.03), (-2.62, 0.04, 0.34), rot=(0, math.radians(-62), math.radians(8)))
    box(bpy, 'suitcase', rust, (0.62, 0.42, 0.2), (-3.05, -0.55, 0.1), rot=(0, 0, math.radians(32)), bevel=0.02)
    box(bpy, 'suitcase_lid', rust, (0.6, 0.4, 0.04), (-3.12, -0.98, 0.07), rot=(math.radians(-12), 0, math.radians(18)), bevel=0.01)
    for i in range(5):   # what was in it, out on the road: folded clothes as small flat slabs
        box(bpy, 'clothes_%d' % i, paint_lo if i % 2 else trim, (rnd.uniform(0.18, 0.3), rnd.uniform(0.14, 0.24), 0.04),
            (-3.4 + rnd.uniform(-0.3, 0.3), -0.75 + rnd.uniform(-0.35, 0.35), 0.02), rot=(0, 0, rnd.uniform(0, 3)), bevel=0.01)
    shards(bpy, 'screen_glass', glass, rnd, (-2.6, 0.2), 1.1, 160)


def pier(bpy, mathutils):
    # THE FREEWAY: an overpass pier, the bent that held the deck where the interchange came down. A hammerhead column at
    # a real freeway's size: a 1.5 x 1.1 m column with chamfered corners on its footing, 4.9 m to the cap (the 16 ft
    # clearance a freeway keeps), the cap 5.6 m across and 1.2 m deep, the four girders on their bearing pads, and the
    # stub of the deck over them broken off toward the street, rebar hanging out of the break. A BLOCKER nothing passes.
    # No pack twin is a pier: his concrete is his barricade wall (pack:3. Barricades and blockades#10). The odd thing:
    # under the stub, out of the rain, a bed of flattened boxes and a blanket, somebody's.
    # round two of the loop: one pale grey everywhere (value span 100), the water stains thin dark stripes like paint,
    # the deck a plank floating over two stubs. Now the column a step down and the cap a step up (the container's
    # lesson), the water runs ragged under the joint, a corner spalled to its rebar, the girders full length under a
    # deck broken toward the camera, and the bed under it big enough to read as a bed.
    import random
    rnd = random.Random(23)
    lo, conc = mat(bpy, 'concrete_shade', 'tape_grey', 1), mat(bpy, 'concrete', 'tape_grey', 2)
    stain, steel, card = mat(bpy, 'stain_and_pads', 'tape_grey', 0), mat(bpy, 'rebar', 'clay_rust', 1), mat(bpy, 'cardboard_bed', 'tape_masking', 2)
    CX, CY, CH = 1.5, 1.1, 4.9
    box(bpy, 'footing', lo, (2.6, 2.1, 0.3), (0, 0, 0.15), bevel=0.02)
    col = box(bpy, 'column', lo, (CX, CY, CH - 0.3), (0, 0, 0.3 + (CH - 0.3) / 2), bevel=0.12)
    cut(bpy, col, (0.5, 0.42, 0.75), (-CX / 2 + 0.06, -CY / 2 + 0.05, 1.55), (math.radians(8), math.radians(14), math.radians(40)))   # the corner a truck took off
    tubes(bpy, 'spall_rebar', steel, [((-CX / 2 + 0.1, -CY / 2 + 0.1, 1.25), (-CX / 2 + 0.1, -CY / 2 + 0.1, 1.88)),
                                       ((-CX / 2 + 0.1, -CY / 2 + 0.1, 1.4), (-CX / 2 + 0.38, -CY / 2 + 0.1, 1.4)),
                                       ((-CX / 2 + 0.1, -CY / 2 + 0.1, 1.68), (-CX / 2 + 0.1, -CY / 2 + 0.36, 1.68))], 0.016, n=6)
    for i in range(5):   # the spall's lumps on the footing under it
        chunk(bpy, 'spall_%d' % i, lo, (rnd.uniform(0.08, 0.18), rnd.uniform(0.07, 0.15), rnd.uniform(0.05, 0.1)), (-0.9 + rnd.uniform(-0.25, 0.2), -0.75 + rnd.uniform(-0.2, 0.2), 0.33), (rnd.uniform(0, 1), rnd.uniform(0, 1), rnd.uniform(0, 3)), rnd)
    # the cap: a hammerhead, deep at the column and tapering to its tips
    half = [(1.0, 1.2), (2.8, 0.7)]
    prof = [(-x, z) for x, z in reversed(half)] + [(x, z) for x, z in half]
    pts = [(x, CH + 1.2 - z) for x, z in prof] + [(2.8, CH + 1.2), (-2.8, CH + 1.2)]
    me = bpy.data.meshes.new('cap')
    n = len(pts)
    vs = [(x, y, z) for y in (-0.6, 0.6) for x, z in pts]
    fs = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)]
    me.from_pydata(vs, [], fs); me.update()
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    cap = bpy.data.objects.new('cap', me); bpy.context.collection.objects.link(cap); cap.data.materials.append(conc)
    bpy.context.view_layer.objects.active = cap; cap.select_set(True)
    bv = cap.modifiers.new('bevel', 'BEVEL'); bv.width = 0.04; bv.segments = 1; bpy.ops.object.modifier_apply(modifier='bevel')
    zb = CH + 1.2
    for x in (-2.1, -0.7, 0.7, 2.1):
        box(bpy, 'bearing_%d' % int(x * 10), stain, (0.42, 0.42, 0.08), (x, 0, zb + 0.04))
    # the girders run along the road (Y) over the cap; the far span is gone at the joint behind, the near span broke off
    # 1.6 m out toward the street, the girder ends at different lengths
    zg, GH = zb + 0.08, 0.9
    for i, (x, yf) in enumerate(((-2.1, -1.55), (-0.7, -1.8), (0.7, -1.35), (2.1, -1.65))):
        g = box(bpy, 'girder_%d' % i, conc, (0.45, 0.6 - yf, GH), (x, (0.6 + yf) / 2, zg + GH / 2))
        cut(bpy, g, (0.9, 0.6, 1.4), (x, yf - 0.1, zg + GH / 2), (math.radians(rnd.uniform(-30, 30)), 0, math.radians(rnd.uniform(-15, 15))))
    deck = box(bpy, 'deck', conc, (5.6, 2.3, 0.26), (0, -0.55, zg + GH + 0.13))
    # round three: the deck's top was one pale flat (the source pass dusts every up face); a freeway deck carries its
    # asphalt, broken back from the edge, dark on the pale concrete
    road = box(bpy, 'asphalt', stain, (5.5, 2.05, 0.07), (0, -0.4, zg + GH + 0.295))
    for k in range(4):   # the break, jagged: four bites out of the near edge
        c = (-2.1 + k * 1.4 + rnd.uniform(-0.2, 0.2), -1.85 + rnd.uniform(-0.25, 0.15), zg + GH + 0.13); a_ = (math.radians(rnd.uniform(-25, 25)), 0, math.radians(rnd.uniform(-35, 35)))
        cut(bpy, deck, (1.6, 0.9, 1.0), c, a_)
        cut(bpy, road, (1.6, 1.2, 1.0), (c[0], c[1] + 0.15, c[2]), a_)   # the asphalt broken back further than the slab
    box(bpy, 'deck_edge', stain, (5.62, 0.04, 0.3), (0, 0.6, zg + GH + 0.13))   # the joint behind, black with the years
    bars = []
    for i in range(22):   # the deck's rebar hanging out of the break toward the street, bent down by its own weight
        x = -2.6 + i * 0.25 + rnd.uniform(-0.05, 0.05)
        y0 = -1.45 + rnd.uniform(-0.2, 0.2); z0 = zg + GH + 0.13
        p1 = (x + rnd.uniform(-0.08, 0.08), y0 - rnd.uniform(0.15, 0.35), z0 - rnd.uniform(0.1, 0.3))
        p2 = (p1[0] + rnd.uniform(-0.1, 0.1), p1[1] - rnd.uniform(0.0, 0.15), p1[2] - rnd.uniform(0.2, 0.6))
        bars += [((x, y0, z0), p1), (p1, p2)]
    tubes(bpy, 'rebar', steel, bars, 0.018, n=6)
    # the water from the joint, run down the cap and the column's near face in ragged runs, the splash at the foot
    yf = -CY / 2 - 0.006
    # round three: a run of overlapping discs read as a chain of beads; each run is now a few long ragged pieces, a
    # stain stretched down the face (the disc's own Y is the wall's height once it is stood on the face)
    for i, (x, top_, ln, r) in enumerate(((-0.4, CH - 0.05, 3.4, 0.13), (0.15, CH - 0.05, 2.1, 0.09), (0.5, CH - 0.4, 1.3, 0.07))):
        k = 0; z = top_
        while z > top_ - ln:
            rr = r * (1 - 0.45 * (top_ - z) / ln)
            o = blotch(bpy, 'run_%d_%d' % (i, k), stain, rr, (x + 0.025 * math.sin(k * 1.7), yf, z - rr * 2.2), (math.pi / 2, 0, 0), seed=300 + i * 40 + k)
            o.scale = (1, 4.0, 1)
            z -= rr * 6.5; k += 1
    for i, x in enumerate((-2.0, -0.9, 0.3, 1.6)):
        blotch(bpy, 'cap_run_%d' % i, stain, 0.16, (x, -0.606, CH + 0.95 - 0.12 * (i % 2)), (math.pi / 2, 0, 0), seed=360 + i)
    for i in range(6):
        blotch(bpy, 'splash_%d' % i, stain, 0.2, (-0.6 + i * 0.25, yf, 0.48 + 0.05 * (i % 2)), (math.pi / 2, 0, 0), seed=380 + i)
    # THE ONE ASYMMETRIC THING: a bed at its foot under the stub, out of the rain: flattened boxes laid two deep, a
    # dark blanket thrown over, a bundled pillow, a carrier bag of what he owns
    for i, (x, y, sx, sy, a) in enumerate(((-0.35, -1.55, 1.15, 0.75, 6), (0.55, -1.6, 1.0, 0.8, -9), (0.1, -1.8, 1.9, 0.95, 2))):
        box(bpy, 'box_flat_%d' % i, card, (sx, sy, 0.025), (x, y, 0.013 + 0.014 * i), rot=(0, 0, math.radians(a)))
    bl = box(bpy, 'blanket', stain, (1.35, 0.9, 0.09), (0, 0, 0), bevel=0.035)   # box() bakes its place: rumpled at the origin, then placed
    for v in bl.data.vertices:
        v.co.z += 0.035 * math.sin(v.co.x * 5) * math.cos(v.co.y * 4)
    bl.location = (0.25, -1.75, 0.09); bl.rotation_euler = (0, 0, math.radians(-4))
    for i, (x, y, r, sc) in enumerate(((-0.6, -1.72, 1.0, (0.3, 0.22, 0.12)), (0.95, -1.35, 1.0, (0.2, 0.17, 0.22)))):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=12, ring_count=8, location=(x, y, 0.06 + sc[2]))
        b = put(bpy, bpy.context.active_object, 'bundle_%d' % i, stain); b.scale = sc   # cloth, dark (round three: pale card bundles read as eggs)
        lump(b, rnd, r)


def drums(bpy, mathutils):
    # THE FREEWAY: the lane closure nobody took down. Channelizer drums (a real one: 0.46 m across, 0.91 m tall, ribbed,
    # two white bands, sat in a 0.9 m rubber base ring) and 28-inch cones (0.71 m on a 0.38 m square base, two white
    # bands) in a taper across a lane, 4.6 m of them. COVER only knee to waist high: the twins his own drum and cone
    # (pack:17. Warning Signs and road props#23 and #17). The odd thing: the third drum knocked out of its ring and rolled
    # into the lane, and the cone the truck went over crushed flat.
    import random
    rnd = random.Random(29)
    # round two of the loop: the source pass dusted the orange (rust step 3) to salmon and four thin white bands made
    # candles of the drums; his drum is a deep red-orange with one broad band. The orange a step down, two broad
    # bands, the rubber a step darker, half the grit
    orange, white = mat(bpy, 'plastic_orange', 'clay_rust', 2), mat(bpy, 'reflective_white', 'clay_bone', 3)
    base, grit = mat(bpy, 'rubber_base', 'rubber', 0), mat(bpy, 'road_grit', 'tape_grey', 1)
    def drum(name, loc, rot=(0, 0, 0), ring=True):
        parts = []
        r0, r1, H = 0.24, 0.215, 0.91
        bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=r0, radius2=r1, depth=H, location=(0, 0, H / 2 + 0.04))
        d = put(bpy, bpy.context.active_object, name, orange); parts.append(d)
        for k, z in enumerate((0.4, 0.67)):   # two broad white bands, orange between and above
            rr = r0 + (r1 - r0) * (z / H) + 0.006
            parts.append(cyl(bpy, '%s_band_%d' % (name, k), white, rr, 0.15, (0, 0, z + 0.04), verts=20))
        for z in (0.2, 0.535, 0.84):
            rr = r0 + (r1 - r0) * (z / H) + 0.012
            parts.append(cyl(bpy, '%s_rib_%d' % (name, int(z * 100)), orange, rr, 0.03, (0, 0, z + 0.04), verts=20))
        parts.append(cyl(bpy, '%s_handle' % name, orange, 0.06, 0.08, (0, 0, H + 0.08), verts=10))
        parts.append(cyl(bpy, '%s_lid' % name, orange, r1 * 0.9, 0.04, (0, 0, H + 0.04), verts=20))
        bpy.ops.object.empty_add(location=(0, 0, 0)); e = bpy.context.active_object; e.name = name + '_drum'
        for p in parts: p.parent = e
        e.location = loc; e.rotation_euler = rot
        if ring:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.09, major_segments=24, minor_segments=8, location=(loc[0], loc[1], 0.06))
            t = put(bpy, bpy.context.active_object, name + '_ring', base); t.scale = (1, 1, 0.65)
        return e
    def cone(name, loc, rot=(0, 0, 0), crushed=False):
        H = 0.71
        bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.15, radius2=0.035, depth=H - 0.04, location=(0, 0, (H - 0.04) / 2 + 0.04))
        c = put(bpy, bpy.context.active_object, name, orange)
        bands = [cyl(bpy, '%s_band_%d' % (name, k), white, 0.15 - 0.115 * (z / H) + 0.004, 0.1 if k == 0 else 0.07, (0, 0, z), verts=16) for k, z in enumerate((0.42, 0.6))]
        b = box(bpy, name + '_base', base, (0.38, 0.38, 0.04), (0, 0, 0.02), bevel=0.02)
        bpy.ops.object.empty_add(location=(0, 0, 0)); e = bpy.context.active_object; e.name = name + '_cone'
        for p in [c, b] + bands: p.parent = e
        if crushed:   # the truck went over it: pressed flat to its base and splayed, the tip folded over
            for o in [c] + bands:
                for v in o.data.vertices:
                    wz = o.location.z + v.co.z
                    v.co.x *= 1 + 0.9 * (wz / H); v.co.z = 0.05 + wz * 0.1 + 0.015 * math.sin(v.co.x * 9) - o.location.z
        e.location = loc; e.rotation_euler = rot
        return e
    # the taper: drums on the lane line, cones between them, all leaning a little the way the wind has had them
    drum('drum_0', (-2.0, 0.55, 0), (0, 0, 0.3))
    drum('drum_1', (-0.9, 0.2, 0), (math.radians(2), 0, 1.1))
    cone('cone_0', (-1.45, 0.5, 0), (0, 0, 0.4))
    cone('cone_1', (-0.35, 0.05, 0), (0, math.radians(3), 1.0))
    cone('cone_2', (0.75, -0.25, 0), (0, 0, 0.2))
    drum('drum_3', (1.9, -0.6, 0), (0, math.radians(-2), 2.0))
    cone('cone_4', (1.25, 0.55, 0.16), (0, math.radians(90), math.radians(-30)))   # one cone blown over
    # THE ONE ASYMMETRIC THING: the third drum out of its ring and rolled into the lane, the ring left where it stood;
    # and the cone the truck went over, crushed flat
    bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.09, major_segments=24, minor_segments=8, location=(0.2, -0.1, 0.06))
    t = put(bpy, bpy.context.active_object, 'ring_empty', base); t.scale = (1, 1, 0.65)
    drum('drum_2', (0.35, -0.95, 0.235), (0, math.radians(90), math.radians(-62)), ring=False)
    cone('cone_crushed', (-1.1, -0.75, 0), (0, 0, 1.4), crushed=True)
    shards(bpy, 'grit', grit, rnd, (0.0, 0.0), 1.5, 70, size=(0.02, 0.05))


def gantry(bpy, mathutils):
    # THE FREEWAY: the overhead sign gantry come down across the lanes. A box truss of galvanised pipe (four chords, a
    # real sign bridge's 1.0 x 1.2 m section, braced every 0.9 m), 5 m of it lying on the road with its end post still
    # bolted on, torn off its footing and tipped over, and the green sign panel (3.6 x 2.1 m, white letters as bars a man cannot read, an
    # arrow) hung off its front, face up to the sky. A BLOCKER you fire through the truss of. No sign bridge in his
    # packs: the twin his chevron board (pack:17. Warning Signs and road props#10). The odd thing: the walkway grating
    # torn free and hanging off one end, and somebody's white paint line struck through the arrow.
    import random
    rnd = random.Random(31)
    # round two of the loop: the sign lay face up to the sky and the source pass dusted its green to a grey board; it now
    # leans back 45 degrees against the truss, a step brighter, and the truss a step darker so the sign is the light
    steel, green = mat(bpy, 'galvanised', 'tape_grey', 1), mat(bpy, 'sign_green', 'clay_teal', 2)
    white, rust = mat(bpy, 'sign_white', 'clay_bone', 4), mat(bpy, 'rust', 'clay_rust', 1)
    L, Wt, Ht = 5.0, 1.0, 1.2   # a sign bridge spans the road; the span broke at a splice and 5 m of it came down here
    x0 = -L / 2 + 0.8
    segs = []
    ch = [(-Wt / 2, 0.0), (Wt / 2, 0.0), (-Wt / 2, Ht), (Wt / 2, Ht)]   # (y, z) of the four chords, the truss lying down
    for y, z in ch: segs.append(((x0, y, z + 0.08), (x0 + L, y, z + 0.08)))
    k = 0; x = x0
    while x < x0 + L - 0.01:
        x1 = min(x + 0.9, x0 + L)
        for y, z in ch[:2]: segs.append(((x, y, 0.08), (x, y, Ht + 0.08)))            # the verticals each side
        segs.append(((x, -Wt / 2, Ht + 0.08), (x, Wt / 2, Ht + 0.08)))
        sgn = 1 if k % 2 else -1                                                         # the diagonals, zig-zag
        segs.append(((x, -Wt / 2, 0.08 if sgn > 0 else Ht + 0.08), (x1, -Wt / 2, Ht + 0.08 if sgn > 0 else 0.08)))
        segs.append(((x, Wt / 2, 0.08 if sgn > 0 else Ht + 0.08), (x1, Wt / 2, Ht + 0.08 if sgn > 0 else 0.08)))
        x = x1; k += 1
    tubes(bpy, 'truss', steel, segs, 0.055, n=8)
    # the end post at -X, still bolted to the truss, torn off its footing and tipped over onto the road, its base plate
    # and the anchor bolts that let go on the end of it
    xp = x0 - 1.9
    tubes(bpy, 'post', steel, [((x0 - 0.15, -0.35, 0.22), (xp, -0.62, 0.3)), ((x0 - 0.15, 0.35, 0.22), (xp, 0.08, 0.3))], 0.11, n=12)
    for i in range(4):
        t = (i + 0.5) / 4
        a_, b_ = (x0 - 0.15 - 1.75 * t, -0.35 - 0.27 * t, 0.22 + 0.08 * t), (x0 - 0.15 - 1.75 * (t + 0.1), 0.35 - 0.27 * (t + 0.1), 0.24)
        tubes(bpy, 'post_brace_%d' % i, steel, [(a_, b_)], 0.04, n=6)
    box(bpy, 'base_plate', rust, (0.04, 1.1, 0.62), (xp - 0.02, -0.27, 0.34), bevel=0.01)
    tubes(bpy, 'anchor_bolts', rust, [((xp - 0.04, -0.6 + 0.22 * i, 0.12 + 0.4 * (i % 2)), (xp - 0.3 - 0.08 * (i % 3), -0.62 + 0.24 * i, 0.1 + 0.42 * (i % 2))) for i in range(5)], 0.025, n=6)
    # the sign hung off the S face, tipped up toward the sky (the truss fell on its back, the sign went with it)
    SW, SH = 3.6, 2.1
    sx = 0.6
    panel = box(bpy, 'sign', green, (SW, 0.06, SH), (0, 0, 0), bevel=0.02)
    parts = [panel]
    parts.append(box(bpy, 'sign_border', white, (SW - 0.12, 0.065, 0.05), (0, -0.003, SH / 2 - 0.08)))
    parts.append(box(bpy, 'sign_border_b', white, (SW - 0.12, 0.065, 0.05), (0, -0.003, -SH / 2 + 0.08)))
    for side in (-1, 1):
        parts.append(box(bpy, 'sign_border_%d' % side, white, (0.05, 0.065, SH - 0.12), (side * (SW / 2 - 0.08), -0.003, 0)))
    # the legend: two lines of letters as bars and blocks (no word a man could read), the arrow under them
    for row, (z, n) in enumerate(((0.55, 9), (0.18, 6))):
        xx = -1.25
        for c in range(n):
            w = rnd.choice((0.13, 0.17, 0.2)); hh = 0.26 if row == 0 else 0.22
            if rnd.random() < 0.1: xx += 0.12; continue
            parts.append(box(bpy, 'letter_%d_%d' % (row, c), white, (w, 0.07, hh), (xx + w / 2, -0.006, z)))
            xx += w + 0.06
    parts.append(box(bpy, 'arrow_shaft', white, (0.12, 0.07, 0.55), (0.0, -0.006, -0.42)))
    bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=0.24, depth=0.07, location=(0, -0.006, -0.12), rotation=(math.pi / 2, 0, 0))
    ah = put(bpy, bpy.context.active_object, 'arrow_head', white, smooth=False); ah.rotation_euler = (math.pi / 2, math.radians(30), 0); parts.append(ah)
    # THE ONE ASYMMETRIC THING (1): a white paint line struck through the arrow by a hand, a little crooked
    parts.append(box(bpy, 'struck', white, (0.95, 0.075, 0.07), (0.05, -0.008, -0.38), rot=(0, math.radians(32), 0)))
    for i in range(4):   # the sign's own rust where it bolts to its brackets
        parts.append(blotch(bpy, 'sign_rust_%d' % i, rust, 0.09, ((-1.3, 1.3, -1.3, 1.3)[i], -0.035, (0.85, 0.85, -0.85, -0.85)[i]), (math.pi / 2, 0, 0), seed=81 + i))
    bpy.ops.object.empty_add(location=(0, 0, 0)); sg = bpy.context.active_object; sg.name = 'sign_panel'
    for p in parts: p.parent = sg
    sg.location = (sx, -Wt / 2 - 0.8, 0.84); sg.rotation_euler = (math.radians(-45), 0, math.radians(3))
    tubes(bpy, 'sign_brackets', steel, [((sx + x, -Wt / 2, 0.15 + z), (sx + x, -Wt / 2 - 0.45, 0.3 + z * 0.5)) for x in (-1.3, 1.3) for z in (0.0, 0.6)], 0.035, n=6)
    # THE ONE ASYMMETRIC THING (2): the walkway grating torn off the truss's +X end, hanging over it down to the road
    g, xe = [], x0 + L
    for i in range(9):
        y = -0.42 + i * 0.105
        g.append(((xe - 0.05, y, Ht + 0.1), (xe + 0.75, y + 0.06, 0.05)))
    g += [((xe - 0.05, -0.45, Ht + 0.1), (xe - 0.05, 0.45, Ht + 0.1)), ((xe + 0.38, -0.42, 0.6), (xe + 0.4, 0.48, 0.62)), ((xe + 0.75, -0.42, 0.05), (xe + 0.78, 0.5, 0.05))]
    tubes(bpy, 'grating', rust, g, 0.016, n=4)


def heap(bpy, mathutils):
    # THE LANDFILL: a heap of bags and junk as a MOUND (high ground, rule 59), what the trucks tipped on the last day
    # and nobody pushed in: about 5 m across and 1.5 m high, a slumped dome of cover dirt under black and pale bin bags,
    # boards, a mattress, sheet tin, a door laid across the top where a man stands. The twin his bag-and-junk pile
    # (pack:7. Trash and debris#0). The odd thing: an armchair sunk into the top of the heap, turned to face the
    # street, as if somebody sat up there to watch the road.
    import random
    rnd = random.Random(37)
    dirt, black = mat(bpy, 'cover_dirt', 'clay_bone', 0), mat(bpy, 'bags_black', 'cloth_black', 1)
    pale, wood, rust = mat(bpy, 'bags_pale', 'tape_masking', 3), mat(bpy, 'boards', 'tape_masking', 1), mat(bpy, 'tin_and_chair', 'clay_rust', 1)
    A, B, Hd = 2.5, 1.9, 1.15
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=40, ring_count=20, location=(0, 0, 0))
    dome = put(bpy, bpy.context.active_object, 'dirt', dirt, smooth=False)
    p1, p2 = rnd.uniform(0, 6), rnd.uniform(0, 6)
    for v in dome.data.vertices:
        a = math.atan2(v.co.y, v.co.x)
        k = 1 + 0.12 * math.sin(3 * a + p1) + 0.08 * math.sin(5 * a + p2)
        z = max(0.0, v.co.z) ** 1.3
        v.co = (v.co.x * A * k, v.co.y * B * k, z * Hd * (1 + 0.1 * math.sin(3 * v.co.x + 2 * v.co.y)))
    sub = dome.modifiers.new('cut', 'SUBSURF'); sub.subdivision_type = 'SIMPLE'; sub.levels = 2; bpy.ops.object.modifier_apply(modifier='cut')
    tex = bpy.data.textures.new('clods', 'VORONOI'); tex.noise_scale = 0.18
    dsp = dome.modifiers.new('clods', 'DISPLACE'); dsp.texture = tex; dsp.texture_coords = 'GLOBAL'; dsp.strength = 0.08; dsp.mid_level = 0.6
    bpy.ops.object.modifier_apply(modifier='clods')
    for v in dome.data.vertices:
        if v.co.z < 0: v.co.z = 0
    def top(x, y):
        u = (x / A) ** 2 + (y / B) ** 2
        return Hd * max(0.0, 1 - u) ** 0.77
    # the bags, thick over the whole heap, heavier round the foot where they rolled
    for i in range(150):
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0.0, 1.08) ** 0.65
        x, y = A * d * math.cos(a), B * d * math.sin(a)
        r = rnd.uniform(0.17, 0.3)
        if abs(x - 0.35) < 0.75 and abs(y - 0.1) < 0.5: continue            # the door's place on the top
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, top(x, y) + r * 0.25), segments=12, ring_count=8)
        b = put(bpy, bpy.context.active_object, 'bag_%d' % i, black if rnd.random() < 0.68 else pale)
        b.scale = (rnd.uniform(0.9, 1.2), rnd.uniform(0.8, 1.0), rnd.uniform(0.6, 0.8)); b.rotation_euler = (rnd.uniform(-0.4, 0.4), rnd.uniform(-0.4, 0.4), rnd.uniform(0, 3))
        lump(b, rnd, r)
        if rnd.random() < 0.5:
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.045, radius2=0.0, depth=0.1, location=(x, y, top(x, y) + r * 0.85))
            put(bpy, bpy.context.active_object, 'knot_%d' % i, b.data.materials[0], smooth=False)
    # the junk: boards and sheet tin stuck out of the slope at angles, a mattress folded over the right-hand flank
    for i in range(14):
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0.35, 0.95)
        x, y = A * d * math.cos(a), B * d * math.sin(a)
        if rnd.random() < 0.6:
            box(bpy, 'board_%d' % i, wood, (rnd.uniform(0.8, 1.4), 0.14, 0.025), (x, y, top(x, y) + 0.1), rot=(rnd.uniform(-0.35, 0.35), rnd.uniform(-0.3, 0.3), rnd.uniform(0, 3)))
        else:
            tin = box(bpy, 'tin_%d' % i, rust, (rnd.uniform(0.6, 1.0), rnd.uniform(0.5, 0.8), 0.012), (x, y, top(x, y) + 0.08), rot=(rnd.uniform(-0.7, 0.7), rnd.uniform(-0.7, 0.7), rnd.uniform(0, 3)))
            sb = tin.modifiers.new('ribs', 'SUBSURF'); sb.subdivision_type = 'SIMPLE'; sb.levels = 3; bpy.ops.object.modifier_apply(modifier='ribs')
            for v in tin.data.vertices: v.co.z += 0.02 * math.sin(v.co.x * 40)                   # corrugated
    mt = box(bpy, 'mattress', pale, (1.4, 0.95, 0.18), (0, 0, 0), bevel=0.06)   # box() bakes its place into the mesh: bent at the origin, then placed
    for v in mt.data.vertices: v.co.z -= 0.08 * (v.co.x / 0.7) ** 2                                # folded over the flank
    mt.location = (1.85, -0.55, 0.5); mt.rotation_euler = (math.radians(-18), math.radians(20), math.radians(18))
    box(bpy, 'mattress_stain', dirt, (0.5, 0.42, 0.01), (1.78, -0.66, 0.6), rot=(math.radians(-18), math.radians(20), math.radians(18)))
    # the door laid flat across the top: the place a man stands on the mound
    box(bpy, 'door', wood, (1.5, 0.78, 0.045), (0.35, 0.1, top(0.35, 0.1) + 0.02), rot=(math.radians(-4), math.radians(5), math.radians(12)), bevel=0.01)
    box(bpy, 'door_panel', dirt, (0.55, 0.26, 0.01), (0.12, 0.02, top(0.35, 0.1) + 0.05), rot=(math.radians(-4), math.radians(5), math.radians(12)))
    # THE ONE ASYMMETRIC THING: an armchair sunk into the top at the left, turned to face the street (-Y)
    cx, cy = -0.95, -0.05; cz = top(cx, cy) - 0.08; tilt = (math.radians(8), math.radians(-6), math.radians(-14))
    parts = [box(bpy, 'chair_seat', rust, (0.72, 0.66, 0.2), (0, 0, 0.3), bevel=0.06),
             box(bpy, 'chair_back', rust, (0.72, 0.18, 0.6), (0, 0.3, 0.62), rot=(math.radians(-10), 0, 0), bevel=0.06)]
    for sx in (-1, 1):
        parts.append(box(bpy, 'chair_arm_%d' % sx, rust, (0.15, 0.7, 0.32), (sx * 0.4, 0.02, 0.4), bevel=0.05))
    parts.append(box(bpy, 'chair_cushion_torn', pale, (0.24, 0.2, 0.03), (0.14, -0.08, 0.41), rot=(0, 0, 0.4)))
    bpy.ops.object.empty_add(location=(0, 0, 0)); ch = bpy.context.active_object; ch.name = 'armchair'
    for p in parts: p.parent = ch
    ch.location = (cx, cy, cz); ch.rotation_euler = tilt


def crumple(o, rnd, amp):
    """a crushed car's skin: the box subdivided, then dented by a few big blows and many small folds"""
    hits = [(rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(0.25, 0.6)) for _ in range(9)]
    p = [rnd.uniform(0, 6) for _ in range(4)]
    for v in o.data.vertices:
        n = v.co.normalized()
        d = 0.0
        for hx, hy, hz, w in hits:
            q = (n.x - hx) ** 2 + (n.y - hy) ** 2 + (n.z - hz) ** 2
            d += math.exp(-q / (w * w)) * 0.6
        f = math.sin(v.co.x * 23 + p[0]) * math.sin(v.co.y * 19 + p[1]) + 0.6 * math.sin(v.co.z * 31 + p[2] + v.co.x * 7)
        v.co -= n * amp * (d + 0.45 * f)


def bales(bpy, mathutils):
    # THE LANDFILL: crushed cars, baled. A car baler presses a stripped car into a block about 1.6 x 0.8 x 0.7 m with
    # its paint still on the skin; here eleven of them stacked in steps by the scrap pile (2.1, 1.4, 0.7 m high), a
    # COVER you climb up in three steps to high ground. Each bale its car's own colour, rust and torn glass in the
    # folds, the strap wire round it. The twin his own crushed block (pack:7. Trash and debris#3). The odd thing: a
    # steering wheel still standing out of the end of the top bale.
    import random
    rnd = random.Random(41)
    teal, red, bone = mat(bpy, 'paint_teal', 'clay_teal', 2), mat(bpy, 'paint_red', 'clay_rust', 2), mat(bpy, 'paint_white', 'clay_bone', 3)
    rust, black = mat(bpy, 'rust_dark', 'clay_rust', 0), mat(bpy, 'rubber_and_glass', 'rubber', 1)
    BL, BW, BH = 1.6, 0.8, 0.7
    colours = [teal, red, bone, rust, teal, bone, red, rust, bone, teal, red, bone]
    spots = []
    for c, xs in enumerate(((-1.7, 0.0, 1.7), (-1.7, 0.0), (-1.7,))):
        for i, x in enumerate(xs):
            for y in ((-0.43, 0.43) if c < 2 else (0.0,)):
                spots.append((x + rnd.uniform(-0.06, 0.06), y + rnd.uniform(-0.03, 0.03), BH / 2 + c * (BH + 0.01), rnd.uniform(-0.05, 0.05)))
    for k, (x, y, z, a) in enumerate(spots):
        m = colours[k % len(colours)]
        b = box(bpy, 'bale_%d' % k, m, (BL, BW, BH), (0, 0, 0))
        sb = b.modifiers.new('sub', 'SUBSURF'); sb.subdivision_type = 'SIMPLE'; sb.levels = 3; bpy.ops.object.modifier_apply(modifier='sub')
        crumple(b, rnd, 0.035)
        b.location = (x, y, z); b.rotation_euler = (rnd.uniform(-0.02, 0.02), rnd.uniform(-0.02, 0.02), a)
        # rust and the dark of torn glass and rubber pressed into the folds, on the faces the camera sees
        for j in range(4):
            px, pz = rnd.uniform(-BL / 2 + 0.15, BL / 2 - 0.15), rnd.uniform(-BH / 2 + 0.12, BH / 2 - 0.12)
            pm = rust if m is not rust else bone
            p = blotch(bpy, 'bale_%d_patch_%d' % (k, j), pm if j < 3 else black, rnd.uniform(0.08, 0.17), (px, -BW / 2 - 0.02, pz), (math.pi / 2, 0, 0), seed=900 + k * 7 + j)
            p.parent = b
        top = blotch(bpy, 'bale_%d_top' % k, rust if m is not rust else black, rnd.uniform(0.14, 0.25), (rnd.uniform(-0.4, 0.4), 0, BH / 2 + 0.01), (0, 0, 0), seed=700 + k)
        top.parent = b
        for sx in (-0.45, 0.45):   # the strap wire round it
            st = box(bpy, 'bale_%d_strap_%d' % (k, int(sx * 10)), rust, (0.025, BW + 0.05, BH + 0.05), (sx, 0, 0))
            st.parent = b
    # one bale fallen off the stack and tipped at its foot
    f = box(bpy, 'bale_fallen', red, (BL, BW, BH), (0, 0, 0))
    sb = f.modifiers.new('sub', 'SUBSURF'); sb.subdivision_type = 'SIMPLE'; sb.levels = 3; bpy.ops.object.modifier_apply(modifier='sub')
    crumple(f, rnd, 0.04)
    f.location = (1.55, -1.25, 0.42); f.rotation_euler = (math.radians(14), math.radians(-6), math.radians(-24))
    # THE ONE ASYMMETRIC THING: the steering wheel still standing out of the -X end of the top bale
    sx_, sz_ = -1.7 - BL / 2 - 0.12, BH / 2 + 2 * (BH + 0.01) + 0.12
    bpy.ops.mesh.primitive_torus_add(major_radius=0.19, minor_radius=0.025, major_segments=24, minor_segments=8, location=(sx_, 0.06, sz_), rotation=(math.radians(10), math.radians(70), 0))
    put(bpy, bpy.context.active_object, 'steering_wheel', black)
    rod(bpy, 'steering_column', black, (sx_ + 0.02, 0.06, sz_), (sx_ + 0.3, 0.04, sz_ - 0.1), 0.03)
    for a in (0, 2.1, 4.2):
        rod(bpy, 'spoke_%d' % int(a * 10), black, (sx_, 0.06, sz_), (sx_ - 0.06 * math.cos(a), 0.06 + 0.17 * math.sin(a), sz_ + 0.17 * math.cos(a)), 0.012)


def dozer(bpy, mathutils):
    # THE LANDFILL: the dozer that pushed the trash in, dead where it stopped. A mid-size crawler dozer at its real size
    # (the class of a D6: 2.6 m of track on the ground, 1.9 m gauge, 0.56 m shoes, a 3.3 m blade, 3.1 m to the roof of
    # its cage), faded yellow, the engine hood ahead of an open cab, the blade on its push arms, the lift rams, a single
    # ripper shank behind. A BLOCKER that hides a man, its cage climbable. He owns no dozer (the quartermaster's line
    # says zero); the truck maquette is beside it. The odd thing: the near track thrown, run off its idler and lying out
    # flat on the dirt in front of it, the machine sat down on its bare rollers on that side.
    import random
    rnd = random.Random(43)
    yellow, steel = mat(bpy, 'paint_yellow', 'clay_mustard', 2), mat(bpy, 'steel', 'tape_grey', 1)
    track, rust, glass = mat(bpy, 'track_steel', 'rubber', 2), mat(bpy, 'rust', 'clay_rust', 1), mat(bpy, 'glass_gone', 'glass_eye', 0)
    G, TL, TH, SW = 1.9, 3.0, 0.82, 0.56
    def rollers(y, z0):
        out = []
        for i, x in enumerate((-1.25, -0.62, 0.0, 0.62, 1.25)):
            out.append(cyl(bpy, 'roller_%d_%d' % (int(y * 10), i), steel, 0.12, SW * 0.7, (x, y, z0 + 0.12), rot=(math.pi / 2, 0, 0), verts=14))
        out.append(cyl(bpy, 'idler_%d' % int(y * 10), steel, 0.36, SW * 0.6, (TL / 2 - 0.38, y, z0 + 0.36), rot=(math.pi / 2, 0, 0), verts=20))
        sp = cyl(bpy, 'sprocket_%d' % int(y * 10), rust, 0.4, SW * 0.6, (-TL / 2 + 0.4, y, z0 + 0.45), rot=(math.pi / 2, 0, 0), verts=11)
        out.append(sp)
        out.append(box(bpy, 'track_frame_%d' % int(y * 10), yellow, (TL - 0.9, SW * 0.55, 0.3), (0.05, y, z0 + 0.32)))
        return out
    # the far track whole: a loop of shoes round its idler and sprocket
    yf = G / 2
    tk = box(bpy, 'track_far', track, (TL, SW, TH), (0, yf, TH / 2), bevel=0.38)
    for i in range(int(TL / 0.2)):   # the grousers across the top run and the ground run
        x = -TL / 2 + 0.3 + i * 0.2
        if x > TL / 2 - 0.3: break
        box(bpy, 'grouser_top_%d' % i, track, (0.05, SW + 0.02, 0.05), (x, yf, TH + 0.02))
    rollers(yf - SW / 2 - 0.02, 0.0)
    # the near track THROWN: its rollers, idler and sprocket bare (the chain is laid out on the dirt last, below)
    yn = -G / 2
    rollers(yn, 0.0)
    # the main frame and the engine hood forward, the radiator guard at the nose
    root_parts = []
    root_parts.append(box(bpy, 'mainframe', yellow, (TL - 0.3, G - SW - 0.1, 0.5), (0.1, 0, 0.7)))
    root_parts.append(box(bpy, 'hood', yellow, (1.75, 1.18, 0.82), (0.72, 0, 1.36), bevel=0.04))
    for i in range(9):
        root_parts.append(box(bpy, 'grille_%d' % i, steel, (0.04, 0.03, 0.7), (1.61, -0.48 + i * 0.12, 1.32)))
    root_parts.append(box(bpy, 'radiator_guard', yellow, (0.08, 1.24, 0.86), (1.64, 0, 1.33), bevel=0.02))
    root_parts.append(box(bpy, 'grille_back', track, (0.04, 1.05, 0.7), (1.62, 0, 1.32)))
    root_parts.append(cyl(bpy, 'exhaust', rust, 0.07, 0.75, (1.05, 0.32, 2.12), verts=12))
    root_parts.append(cyl(bpy, 'precleaner', steel, 0.1, 0.22, (0.85, -0.3, 1.88), verts=12))
    # the cab: the deck, the seat, the levers, the cage (four posts and a roof), the glass gone but for one cracked pane
    root_parts.append(box(bpy, 'cab_deck', yellow, (1.5, G + 0.3, 0.12), (-0.6, 0, 1.0)))
    for sy in (-1, 1):
        root_parts.append(box(bpy, 'fender_%d' % sy, yellow, (TL - 0.5, SW + 0.12, 0.05), (-0.05, sy * G / 2, TH + 0.12)))
    root_parts.append(box(bpy, 'seat', track, (0.55, 0.55, 0.16), (-0.75, 0, 1.24), bevel=0.04))
    root_parts.append(box(bpy, 'seat_back', track, (0.12, 0.55, 0.6), (-1.02, 0, 1.6), rot=(0, math.radians(-12), 0), bevel=0.04))
    root_parts.append(box(bpy, 'fuel_tank', yellow, (0.5, 1.5, 0.75), (-1.35, 0, 1.45), bevel=0.04))
    for i, sy in enumerate((-0.25, 0.25)):
        root_parts.append(rod(bpy, 'lever_%d' % i, steel, (-0.35, sy, 1.1), (-0.48, sy * 1.05, 1.55), 0.018))
    for sx in (-0.02, -1.45):
        for sy in (-1, 1):
            root_parts.append(box(bpy, 'rops_%d_%d' % (int(sx * 10), sy), yellow, (0.12, 0.12, 2.0), (sx, sy * 0.78, 2.06), bevel=0.02))
    root_parts.append(box(bpy, 'rops_roof', yellow, (1.65, 1.8, 0.1), (-0.73, 0, 3.08), bevel=0.02))
    root_parts.append(box(bpy, 'pane_cracked', glass, (0.02, 1.0, 0.8), (-0.06, 0.1, 2.5), rot=(0, 0, math.radians(2))))
    root_parts.append(box(bpy, 'pane_crack', steel, (0.025, 0.6, 0.02), (-0.065, 0.1, 2.55), rot=(math.radians(28), 0, 0)))
    # the blade, a curved moldboard on its push arms, its cutting edge on the dirt, the two lift rams
    # the moldboard's section is an arc open to the front: the cutting edge low and forward, the belly back, the top
    # curled forward over it (centre 0.85 m ahead of the belly)
    cx, cz, R, n = 3.1, 0.62, 0.85, 14
    prof = [(cx + R * math.cos(math.pi - 0.8 + 1.6 * i / (n - 1)), cz + R * math.sin(math.pi - 0.8 + 1.6 * i / (n - 1))) for i in range(n)]
    vs = [(x, y, z) for y in (-1.65, 1.65) for x, z in prof]
    fs = [(i, i + 1, n + i + 1, n + i) for i in range(n - 1)]
    me = bpy.data.meshes.new('blade'); me.from_pydata(vs, [], fs); me.update()
    bl = bpy.data.objects.new('blade', me); bpy.context.collection.objects.link(bl); bl.data.materials.append(yellow)
    bpy.context.view_layer.objects.active = bl; bl.select_set(True)
    so = bl.modifiers.new('shell', 'SOLIDIFY'); so.thickness = 0.07; bpy.ops.object.modifier_apply(modifier='shell')
    box(bpy, 'cutting_edge', rust, (0.08, 3.3, 0.16), (2.55, 0, 0.08))
    for sy in (-1, 1):
        box(bpy, 'end_bit_%d' % sy, rust, (0.4, 0.06, 0.95), (2.35, sy * 1.65, 0.5))
        rod(bpy, 'push_arm_%d' % sy, yellow, (2.2, sy * 1.05, 0.45), (-0.2, sy * 1.05, 0.42), 0.09)
        rod(bpy, 'lift_ram_%d' % sy, steel, (1.55, sy * 0.68, 1.62), (2.3, sy * 0.72, 1.02), 0.065)
        rod(bpy, 'lift_rod_%d' % sy, rust, (1.95, sy * 0.71, 1.3), (2.4, sy * 0.73, 0.95), 0.035)
    # the ripper behind: a frame and one shank, its tooth in the dirt
    box(bpy, 'ripper_frame', yellow, (0.25, 1.4, 0.22), (-1.9, 0, 0.75))
    rod(bpy, 'ripper_shank', steel, (-2.0, 0, 0.8), (-2.15, 0, 0.0), 0.06)
    # rust where the yellow is worn: the hood's edges, the blade's face, the fenders
    for i, (x, y, z, r, rot) in enumerate(((0.9, -0.6, 1.5, 0.22, (math.pi / 2, 0, 0)), (0.3, 0.0, 1.78, 0.3, (0, 0, 0)), (2.2, -0.9, 0.55, 0.3, (0, math.pi / 2, 0)),
                                           (2.2, 0.8, 0.4, 0.25, (0, math.pi / 2, 0)), (-0.6, -0.95, 0.85, 0.2, (0, 0, 0)), (-1.35, -0.76, 1.5, 0.18, (math.pi / 2, 0, 0)))):
        blotch(bpy, 'rust_%d' % i, rust, r, (x, y, z), rot, seed=111 + i)
    # the near side sits down where the track left it: the whole machine tipped 3 degrees onto its bare rollers (the
    # far side still rides 0.1 m up on its shoes), then seated on the ground
    machine = [o for o in bpy.context.scene.objects]
    bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.active_object; root.name = 'dozer'
    for o in machine:
        if o.parent is None: o.parent = root
    root.rotation_euler = (math.radians(3.0), 0, 0)
    seat(bpy, root, [o for o in machine if o.type == 'MESH'])
    # THE ONE ASYMMETRIC THING: the near track's chain, run off the idler and laid out flat on the dirt toward the
    # street, a kink in it where it came off
    for i in range(30):
        t = i / 29
        x = TL / 2 - 0.3 - t * 4.2 + 0.25 * math.sin(t * 3.0)
        y = yn - 0.25 - 0.9 * t + 0.5 * t * t
        a = math.atan2(-0.9 + t, -4.2)
        box(bpy, 'shoe_%d' % i, track, (0.19, SW, 0.045), (x, y, 0.025 + 0.012 * (i % 2)), rot=(0, 0, a), bevel=0.01)
        box(bpy, 'shoe_grouser_%d' % i, rust if i % 7 == 3 else track, (0.04, SW, 0.05), (x + 0.03 * math.cos(a), y + 0.03 * math.sin(a), 0.07), rot=(0, 0, a))


def dims(bpy):
    """the model's size from its real vertices (an object's own box, turned, over-reads a tilted mattress by 0.6 m)"""
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    lo, hi = [1e9] * 3, [-1e9] * 3
    for o in bpy.context.scene.objects:
        if o.type != 'MESH': continue
        e = o.evaluated_get(dg); me = e.to_mesh()
        for v in me.vertices:
            p = e.matrix_world @ v.co
            lo = [min(a, b) for a, b in zip(lo, p)]; hi = [max(a, b) for a, b in zip(hi, p)]
        e.to_mesh_clear()
    return [round(h - l, 3) for l, h in zip(lo, hi)]


BUILDERS = {'lamp': lamp, 'gun': gun, 'wreck': wreck, 'barrier': barrier, 'dumpster': dumpster, 'cart': cart, 'tyres': tyres,
            'sandbags': sandbags, 'fence': fence, 'container': container, 'propane': propane, 'rubble': rubble, 'corral': corral,
            'rolled': rolled, 'pier': pier, 'drums': drums, 'gantry': gantry, 'heap': heap, 'bales': bales, 'dozer': dozer}


def build(name, out):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    BUILDERS[name](bpy, mathutils)
    bpy.context.view_layer.update()
    print('DIMS x y z (m):', dims(bpy), 'materials:', sorted(m.name for m in bpy.data.materials if m.users))
    for o in bpy.context.scene.objects: o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    name = a[0]
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % name)
    print(build(name, out))
