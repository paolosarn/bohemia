#!/usr/bin/env python3
"""BOHEMIA -- COOK [the first guns off the rig]: THE GUNS HE STARTS WITH, MODELLED AT THE SOURCE (rule 120a, Paolo
10/18: 'I wanna start off with the guns too... the guns were supposed to be the main way this is gonna be solved';
rule 115a: every prop is modelled and rendered through DIRECTION's master rig, the clay-and-tape way the robot and the
truck were made; rule 47b: the guns go to HIM, two or three options per class, nothing canon before his pick).

The game's three gun lines (records/target/bb/weapon_lines.json, the crew's slots in ours.json): the PISTOL, the
SHOTGUN, the RIFLE. Two options each, the kind a valley pawn shop had on the wall when the dollar died, decades old by
2050, worn and fixed with what was to hand:

  pistol_a   a full-size service pistol of the 1911 pattern, 0.216 m: blued slide and frame, wood grip panels, the
             ejection port on the right (the side the S camera sees). The odd thing: grey tape wound twice round the
             grip where a panel split.
  pistol_b   a four-inch revolver, 0.235 m, bare steel gone dull, a round wood grip, six chambers you can count. The
             odd thing: a string lanyard through the butt ring, hanging.
  shotgun_a  a double barrel sawn off to 0.33 m of barrel and the stock cut short behind the wrist, 0.66 m: two outside
             hammers, two triggers, the cut end raw. The odd thing: the cracked wrist taped (his own pack's #13 does it).
  shotgun_b  a pump gun, 18.5 inches of barrel over its magazine tube, 0.99 m, wood slide and stock, a rubber pad. The
             odd thing: the wrist cracked through and held with two hose clamps.
  rifle_a    a bolt-action deer rifle, 22 inches, 1.08 m, open sights (the scope is the third tile, 9/22, and an
             upgrade), the bolt handle out on the right. The odd thing: the sling is a cut seatbelt with its buckle.
  rifle_b    a lever-action carbine, 20 inches, 0.98 m, the receiver gone to bare steel, a straight wrist. The odd
             thing: the forend wired to the barrel where its band went.
  rack       THE ARMOURER'S RACK all six hang on: two 2x4 posts on their feet, a top and a bottom rail, two slats with
             dowel pegs, a pistol board; each gun is last-built's own glb, imported untouched (the corral's way) and
             seated on its pegs by its real lowest point. The odd thing: a third pair of pistol pegs empty, a blank
             tag tied to one (the gun that went with somebody).

Why a rack (measured, not guessed): a pistol at the fight's true 57 px a metre is 12 px long and a long gun lying down
is a 60 x 6 px stick (last round's first try, 5 of 8 out); no hand-held gun alone can pass the prop floor (29 x 36,
rule 105), and a render that is BACK cannot be a candidate. The rack stands on a tile at true size like any prop, so
its eight facings pass the card; and the rig's own close camera (--portrait, the camera PORTRAIT uses for a face: 80
degrees, front-on and the two front three-quarters) looks straight at the rack's face and shows each gun side-on, the
way his pack draws a gun, at one ruler for all six. No key of the rig is changed: zero breaks.

Every gun is built with its muzzle to +X, up +Z, and its ORIGIN AT THE FIRING HAND'S GRIP, so its own glb can be put
on a hand bone as it is (CHARACTER, COOK THREE); its real size is in metres; every base colour is a step of one role of
records/target/BOHEMIA_STYLE_PALETTE.json; the same five material names in every gun, so the rack's import makes them
one (the guide's prop cap is five).

Run with the rig's Blender python (bpy 4.2):
    <venv>/bin/python tools/bohemia_cook_model_guns.py <pistol_a|...|rifle_b>      -> reference/models/bohemia/gun_<name>.glb
    <venv>/bin/python tools/bohemia_cook_model_guns.py rack                        -> reference/models/bohemia/gun_rack.glb
        (the rack needs the six glbs; it prints its size and writes gun_rack.json: each gun's world box, for the sheet)
then
    <venv>/bin/python tools/bohemia_direction_master_rig.py reference/models/bohemia/gun_rack.glb
        records/target/master_rig/cook_gun_rack --real-dims <x,y,z> --portrait 406 --head-m 0.89

REFERENCE CHECK (the 9/4 standing law): the twins are his own tiles, shown whole beside the renders at 1:1 on the
sheet: pack:12. Weapons and supplies #6 and #9 (his pistols), #8 (his revolver), #5, #12 and #13 (his sawn-offs), and
the never-judged pack:17. Cannons and weapons #15 (his armoury rack) and pack:12. Weapons and armory #10 (his spear
rack); he owns no modern long gun in 294 packs (the nearest is pack:17's flintlock blunderbuss). The real guns'
dimensions are the makers' published ones (a Government Model 1911: 216 mm; a K-frame four-inch: 235 mm; an 870 with
18.5 inches: 990 mm; a bolt deer rifle with 22 inches: 1,080 mm; a 336 carbine: 980 mm). No reference game.
REUSE CHECK: the helpers are the props modeller's (mat, box, cyl, rod, cut, import_model, dims), the palette is
DIRECTION's source palette, the rig is the master rig. No bank was opened: nothing in banks/ is a 3D model.
"""
import json, math, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohemia_cook_model_props import ROOT, mat, put, cyl, box, rod, cut, import_model, dims   # noqa: E402

GUNS = ['pistol_a', 'pistol_b', 'shotgun_a', 'shotgun_b', 'rifle_a', 'rifle_b']
# where the firing hand holds each gun, in its build frame (the bore on z = 0): the glb's origin, the hand bone's point
GRIP = dict(pistol_a=(-0.0815, -0.0706), pistol_b=(-0.048, -0.064), shotgun_a=(-0.142, -0.026), shotgun_b=(-0.160, -0.030),
            rifle_a=(-0.175, -0.058), rifle_b=(-0.150, -0.025))


def mats(bpy):
    """the same five names in every gun, so the rack's import makes them one"""
    return dict(blued=mat(bpy, 'gunmetal', 'rubber', 2), steel=mat(bpy, 'steel_worn', 'tape_grey', 1),
                wood=mat(bpy, 'wood', 'clay_mustard', 1), tape=mat(bpy, 'tape', 'tape_grey', 2), pine=mat(bpy, 'pine', 'tape_masking', 1))


def tilted(bpy, name, m, size, top, deg, bevel=0.0):
    """a block hung from its top centre and leaned back deg degrees about Y (a grip, a butt): its long side runs down
    and to the rear, the way a hand holds it"""
    a = math.radians(deg); ax = (-math.sin(a), 0.0, -math.cos(a))
    c = tuple(t + ax_i * size[2] / 2 for t, ax_i in zip(top, ax))
    return box(bpy, name, m, size, c, rot=(0, a, 0), bevel=bevel)


def xcyl(bpy, name, m, r, x0, x1, y=0.0, z=0.0, verts=16):
    """a round part along the bore (a barrel, a tube, a band)"""
    return cyl(bpy, name, m, r, x1 - x0, ((x0 + x1) / 2, y, z), rot=(0, math.pi / 2, 0), verts=verts)


def xcone(bpy, name, m, r0, r1, x0, x1, verts=16):
    """a barrel that tapers from the breech to the muzzle"""
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r0, radius2=r1, depth=x1 - x0, location=((x0 + x1) / 2, 0, 0), rotation=(0, math.pi / 2, 0))
    return put(bpy, bpy.context.active_object, name, m)


def ring(bpy, name, m, r, w, x, y=0.0, z=0.0):
    """a band round the bore axis: tape, wire, a hose clamp"""
    return xcyl(bpy, name, m, r, x - w / 2, x + w / 2, y, z, verts=18)


def slab(bpy, name, m, prof, w, bevel=0.006):
    """a side profile (x, z) pulled across the gun's thickness w and rounded at its edges: a stock is a shape, not a
    box (the first render: five rectangles read as a toy's blocks)"""
    me = bpy.data.meshes.new(name); n = len(prof)
    vs = [(x, -w / 2, z) for x, z in prof] + [(x, w / 2, z) for x, z in prof]
    fs = [tuple(range(n)), tuple(range(n, 2 * n))[::-1]] + [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)]
    me.from_pydata(vs, [], fs); me.update(); me.validate()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.mesh.quads_convert_to_tris(); bpy.ops.object.mode_set(mode='OBJECT')
    if bevel:
        md = o.modifiers.new('bevel', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
        bpy.ops.object.modifier_apply(modifier='bevel')
    o.data.materials.append(m); bpy.ops.object.shade_smooth()
    return o


def span_at(prof, x):
    """the profile's bottom and top at x (where a band of tape or a clamp goes round it)"""
    zs = []
    for (x0, z0), (x1, z1) in zip(prof, prof[1:] + prof[:1]):
        if (x0 - x) * (x1 - x) <= 0 and x0 != x1: zs.append(z0 + (z1 - z0) * (x - x0) / (x1 - x0))
    return min(zs), max(zs)


def band(bpy, name, m, prof, x, w, thick, deg=0.0):
    """a band of tape or a hose clamp round a stock, sized to the stock where it sits"""
    lo, hi = span_at(prof, x)
    return box(bpy, name, m, (thick, w + 0.006, hi - lo + 0.006), (x, 0, (lo + hi) / 2), rot=(0, math.radians(deg), 0), bevel=0.002)


def guard(bpy, m, back, bottom_x, front, r=0.0028, deep=0.022):
    """a trigger guard as three bars: down from the frame behind, along the bottom, up to the frame in front"""
    (bx, bz), (fx, fz) = back, front; lo = min(bz, fz) - deep
    rod(bpy, 'guard_back', m, (bx, 0, bz), (bottom_x[0], 0, lo), r)
    rod(bpy, 'guard_bottom', m, (bottom_x[0], 0, lo), (bottom_x[1], 0, lo), r)
    rod(bpy, 'guard_front', m, (bottom_x[1], 0, lo), (fx, 0, fz), r)


def grooves(bpy, o, xs, size, z, sides=(-1, 1)):
    """grooves cut into a flat side: slide serrations, a forend's ribs"""
    w = o.dimensions[1] / 2
    for s in sides:
        for x in xs: cut(bpy, o, size, (x, s * w, z), (0, 0, 0))


def to_grip(bpy, grip):
    """every part moved so the firing hand's grip is the origin (the hand bone's point)"""
    gx, gz = grip
    for o in bpy.context.scene.objects:
        if o.parent is None: o.location.x -= gx; o.location.z -= gz


def pistol_a(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp = M['blued'], M['steel'], M['wood'], M['tape']
    slide = box(bpy, 'slide', bl, (0.210, 0.023, 0.030), (0.005, 0, 0.006), bevel=0.003)
    grooves(bpy, slide, [-0.094 + 0.0045 * i for i in range(7)], (0.0018, 0.004, 0.022), 0.008)
    cut(bpy, slide, (0.032, 0.008, 0.011), (0.012, -0.0115, 0.0155), (0, 0, 0))        # the ejection port, right side
    box(bpy, 'slide_wear', st, (0.200, 0.0235, 0.003), (0.006, 0, 0.0205), bevel=0.001)  # the top edges worn to bare steel
    xcyl(bpy, 'bushing', st, 0.0105, 0.108, 0.114)
    xcyl(bpy, 'muzzle', bl, 0.0062, 0.112, 0.116, verts=12)
    box(bpy, 'dust_cover', bl, (0.130, 0.021, 0.014), (0.032, 0, -0.016), bevel=0.002)
    box(bpy, 'frame', bl, (0.064, 0.025, 0.017), (-0.068, 0, -0.016), bevel=0.002)
    tilted(bpy, 'grip_frame', bl, (0.034, 0.027, 0.100), (-0.066, 0, -0.022), 18, bevel=0.003)
    for s in (-1, 1): tilted(bpy, 'grip_panel_%d' % (s + 1), wd, (0.029, 0.005, 0.080), (-0.0655, s * 0.0155, -0.031), 18, bevel=0.0018)
    tilted(bpy, 'mag_base', st, (0.036, 0.026, 0.006), (-0.0975, 0, -0.1170), 18, bevel=0.0015)
    box(bpy, 'beavertail', bl, (0.016, 0.021, 0.009), (-0.102, 0, -0.012), rot=(0, math.radians(-12), 0), bevel=0.003)
    box(bpy, 'hammer', bl, (0.011, 0.009, 0.017), (-0.104, 0, 0.016), rot=(0, math.radians(-28), 0), bevel=0.002)
    guard(bpy, bl, (-0.060, -0.024), (-0.058, -0.019), (-0.016, -0.023))
    box(bpy, 'trigger', st, (0.006, 0.007, 0.015), (-0.046, 0, -0.031), bevel=0.0015)
    box(bpy, 'front_sight', bl, (0.006, 0.004, 0.006), (0.104, 0, 0.0235))
    box(bpy, 'rear_sight', bl, (0.009, 0.016, 0.006), (-0.091, 0, 0.0235))
    # THE ONE ASYMMETRIC THING: grey tape wound twice round the grip where a panel split
    for i, d in enumerate((0.030, 0.058)): tilted(bpy, 'tape_%d' % i, tp, (0.040, 0.035, 0.011), (-0.066 - 0.309 * d, 0, -0.022 - 0.951 * d), 18, bevel=0.002)
    to_grip(bpy, GRIP['pistol_a'])


def pistol_b(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp = M['blued'], M['steel'], M['wood'], M['tape']
    xcyl(bpy, 'barrel', st, 0.0085, 0.028, 0.140)
    box(bpy, 'rib', st, (0.110, 0.007, 0.006), (0.085, 0, 0.0095), bevel=0.0015)
    xcyl(bpy, 'shroud', st, 0.0055, 0.030, 0.118, z=-0.0125, verts=12)
    box(bpy, 'front_sight', st, (0.011, 0.003, 0.009), (0.131, 0, 0.0145), rot=(0, math.radians(-12), 0))
    xcyl(bpy, 'muzzle', bl, 0.0045, 0.138, 0.142, verts=10)
    cyl_o = xcyl(bpy, 'cylinder', st, 0.0185, -0.013, 0.027, z=-0.013, verts=24)
    for k in range(6):   # the flutes between the chambers
        a = math.radians(30 + 60 * k)
        cut(bpy, cyl_o, (0.026, 0.006, 0.0042), (0.007, 0.019 * math.sin(a), -0.013 + 0.019 * math.cos(a)), (-a, 0, 0))
    box(bpy, 'top_strap', st, (0.048, 0.016, 0.006), (0.006, 0, 0.0085), bevel=0.0015)
    box(bpy, 'frame_front', st, (0.010, 0.020, 0.032), (0.031, 0, -0.008), bevel=0.002)
    box(bpy, 'recoil_shield', st, (0.015, 0.023, 0.036), (-0.0205, 0, -0.012), bevel=0.002)
    box(bpy, 'frame_bottom', st, (0.052, 0.018, 0.008), (0.004, 0, -0.035), bevel=0.0015)
    box(bpy, 'hammer', bl, (0.012, 0.007, 0.019), (-0.031, 0, 0.010), rot=(0, math.radians(-35), 0), bevel=0.0015)
    tilted(bpy, 'grip', wd, (0.034, 0.032, 0.088), (-0.033, 0, -0.024), 22, bevel=0.010)
    guard(bpy, st, (-0.024, -0.036), (-0.030, 0.012), (0.018, -0.038))
    box(bpy, 'trigger', bl, (0.007, 0.006, 0.018), (-0.008, 0, -0.042), rot=(0, math.radians(15), 0), bevel=0.0015)
    # THE ONE ASYMMETRIC THING: a string lanyard through the butt ring, hanging toward the camera side
    a = math.radians(22); bx, bz = -0.033 - math.sin(a) * 0.088, -0.024 - math.cos(a) * 0.088
    cyl(bpy, 'butt_ring', st, 0.006, 0.003, (bx, 0, bz - 0.004), rot=(math.pi / 2, 0, 0), verts=12)
    pts = [(bx, -0.003, bz - 0.009), (bx + 0.004, -0.008, bz - 0.030), (bx + 0.016, -0.011, bz - 0.052), (bx + 0.034, -0.010, bz - 0.064)]
    for i in range(len(pts) - 1): rod(bpy, 'lanyard_%d' % i, tp, pts[i], pts[i + 1], 0.0016, verts=6)
    to_grip(bpy, GRIP['pistol_b'])


def shotgun_a(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp, pn = M['blued'], M['steel'], M['wood'], M['tape'], M['pine']
    for s in (-1, 1): xcyl(bpy, 'barrel_%d' % (s + 1), bl, 0.0115, 0.0, 0.330, y=s * 0.0115, verts=20)
    near = [o for o in bpy.context.scene.objects if o.name == 'barrel_0'][0]
    cut(bpy, near, (0.010, 0.012, 0.010), (0.329, -0.020, 0.004), (0, math.radians(25), 0))   # the hacksaw's ragged end
    box(bpy, 'rib_top', st, (0.330, 0.008, 0.004), (0.165, 0, 0.0125))
    box(bpy, 'rib_bottom', bl, (0.300, 0.008, 0.004), (0.165, 0, -0.0125))
    box(bpy, 'forend', wd, (0.170, 0.040, 0.022), (0.096, 0, -0.020), bevel=0.006)
    box(bpy, 'action', st, (0.090, 0.046, 0.050), (-0.045, 0, -0.008), bevel=0.004)
    box(bpy, 'top_lever', bl, (0.032, 0.010, 0.006), (-0.074, 0, 0.0195), rot=(0, 0, math.radians(25)), bevel=0.0015)
    for s in (-1, 1): box(bpy, 'hammer_%d' % (s + 1), bl, (0.010, 0.007, 0.022), (-0.083, s * 0.012, 0.016), rot=(0, math.radians(-30), 0), bevel=0.0015)
    for i, x in enumerate((-0.050, -0.035)): box(bpy, 'trigger_%d' % i, bl, (0.006, 0.005, 0.016), (x, 0, -0.042), bevel=0.0012)
    guard(bpy, bl, (-0.080, -0.033), (-0.072, -0.018), (-0.010, -0.033))
    stock = [(-0.088, 0.012), (-0.150, 0.002), (-0.205, -0.010), (-0.312, -0.024), (-0.312, -0.106), (-0.250, -0.094),
             (-0.180, -0.072), (-0.128, -0.050), (-0.088, -0.034)]
    slab(bpy, 'stock', wd, stock, 0.036)
    box(bpy, 'cut_end', pn, (0.004, 0.037, 0.080), (-0.3135, 0, -0.065))   # the saw's face, raw
    for i, x in enumerate((-0.124, -0.152)): band(bpy, 'tape_%d' % i, tp, stock, x, 0.036, 0.013)
    to_grip(bpy, GRIP['shotgun_a'])


def shotgun_b(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp = M['blued'], M['steel'], M['wood'], M['tape']
    rec = box(bpy, 'receiver', bl, (0.205, 0.036, 0.052), (0.0, 0, -0.008), bevel=0.004)
    cut(bpy, rec, (0.066, 0.008, 0.022), (0.026, -0.018, 0.004), (0, 0, 0))                # the ejection port, right side
    box(bpy, 'receiver_wear', st, (0.195, 0.037, 0.003), (0.0, 0, 0.0165), bevel=0.001)
    xcyl(bpy, 'barrel', bl, 0.0105, 0.100, 0.570)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0028, location=(0.562, 0, 0.0128), segments=8, ring_count=6)
    put(bpy, bpy.context.active_object, 'bead', st)
    xcyl(bpy, 'mag_tube', bl, 0.0115, 0.100, 0.490, z=-0.024)
    xcyl(bpy, 'mag_cap', st, 0.0128, 0.488, 0.512, z=-0.024)
    box(bpy, 'barrel_ring', bl, (0.012, 0.024, 0.042), (0.476, 0, -0.012), bevel=0.002)
    fe = box(bpy, 'forend', wd, (0.200, 0.046, 0.038), (0.232, 0, -0.027), bevel=0.009)
    grooves(bpy, fe, [0.150 + 0.020 * i for i in range(9)], (0.006, 0.006, 0.030), -0.027)
    box(bpy, 'trigger_plate', bl, (0.110, 0.030, 0.018), (-0.040, 0, -0.041), bevel=0.003)
    guard(bpy, bl, (-0.072, -0.050), (-0.066, -0.026), (-0.020, -0.050))
    box(bpy, 'trigger', st, (0.006, 0.006, 0.016), (-0.044, 0, -0.058), bevel=0.0012)
    stock = [(-0.100, 0.017), (-0.200, 0.002), (-0.420, -0.022), (-0.420, -0.140), (-0.300, -0.112), (-0.205, -0.080),
             (-0.178, -0.088), (-0.150, -0.070), (-0.120, -0.046), (-0.100, -0.040)]
    slab(bpy, 'stock', wd, stock, 0.040, bevel=0.008)
    box(bpy, 'pad', bl, (0.020, 0.042, 0.122), (-0.430, 0, -0.081), bevel=0.004)
    # THE ONE ASYMMETRIC THING: the wrist cracked through and held with two hose clamps
    for i, x in enumerate((-0.138, -0.176)): band(bpy, 'clamp_%d' % i, st, stock, x, 0.040, 0.009)
    lo, hi = span_at(stock, -0.138); box(bpy, 'clamp_screw', st, (0.010, 0.010, 0.008), (-0.138, -0.025, (lo + hi) / 2 + 0.008))
    to_grip(bpy, GRIP['shotgun_b'])


def rifle_a(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp = M['blued'], M['steel'], M['wood'], M['tape']
    rec = xcyl(bpy, 'receiver', bl, 0.0165, -0.130, 0.080, verts=20)
    cut(bpy, rec, (0.076, 0.010, 0.016), (-0.030, -0.0165, 0.006), (0, 0, 0))              # the ejection port, right side
    xcyl(bpy, 'shroud', bl, 0.0140, -0.160, -0.128, verts=16)
    rod(bpy, 'bolt_handle', st, (-0.105, -0.012, 0.004), (-0.104, -0.048, -0.020), 0.0042)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0092, location=(-0.104, -0.050, -0.022), segments=12, ring_count=8)
    put(bpy, bpy.context.active_object, 'bolt_knob', st)
    xcone(bpy, 'barrel', bl, 0.0145, 0.0088, 0.080, 0.610)
    box(bpy, 'front_sight', bl, (0.014, 0.004, 0.010), (0.598, 0, 0.0125), rot=(0, math.radians(-10), 0))
    box(bpy, 'rear_sight', bl, (0.012, 0.010, 0.007), (0.300, 0, 0.0145))
    stock = [(0.385, -0.010), (0.080, -0.009), (-0.130, -0.011), (-0.165, -0.004), (-0.240, -0.008), (-0.460, -0.030),
             (-0.460, -0.150), (-0.330, -0.112), (-0.232, -0.084), (-0.214, -0.118), (-0.178, -0.122), (-0.160, -0.084),
             (-0.150, -0.050), (-0.020, -0.048), (0.200, -0.040), (0.380, -0.034), (0.392, -0.022)]
    slab(bpy, 'stock', wd, stock, 0.040, bevel=0.009)
    box(bpy, 'pad', bl, (0.020, 0.042, 0.124), (-0.470, 0, -0.090), bevel=0.004)
    box(bpy, 'floorplate', st, (0.090, 0.030, 0.004), (-0.040, 0, -0.049))
    guard(bpy, st, (-0.140, -0.044), (-0.134, -0.074), (-0.070, -0.044))
    box(bpy, 'trigger', st, (0.006, 0.006, 0.016), (-0.108, 0, -0.054), bevel=0.0012)
    for x, z in ((0.300, -0.048), (-0.360, -0.120)):
        cyl(bpy, 'swivel_%d' % int(x * 1000), st, 0.0075, 0.003, (x, 0, z), rot=(math.pi / 2, 0, 0), verts=12)
    # THE ONE ASYMMETRIC THING: the sling is a cut seatbelt, its buckle still on, hung from the two swivels
    a, b, sag, n = (0.300, -0.053), (-0.360, -0.126), 0.060, 12
    pts = [(a[0] + (b[0] - a[0]) * i / n, -0.006, a[1] + (b[1] - a[1]) * i / n - sag * math.sin(math.pi * i / n)) for i in range(n + 1)]
    for i in range(n):
        (x0, y0, z0), (x1, y1, z1) = pts[i], pts[i + 1]
        box(bpy, 'sling_%d' % i, bl, (math.hypot(x1 - x0, z1 - z0) + 0.002, 0.0025, 0.036), ((x0 + x1) / 2, y0, (z0 + z1) / 2),
            rot=(0, -math.atan2(z1 - z0, x1 - x0), 0))
    box(bpy, 'buckle', st, (0.032, 0.006, 0.048), (pts[7][0], -0.0095, pts[7][2]), rot=(0, -math.atan2(pts[8][2] - pts[6][2], pts[8][0] - pts[6][0]), 0), bevel=0.002)
    to_grip(bpy, GRIP['rifle_a'])


def rifle_b(bpy, mathutils):
    M = mats(bpy); bl, st, wd, tp = M['blued'], M['steel'], M['wood'], M['tape']
    box(bpy, 'receiver', st, (0.165, 0.030, 0.052), (-0.020, 0, -0.008), bevel=0.003)
    box(bpy, 'loading_gate', bl, (0.032, 0.004, 0.015), (0.030, -0.0155, -0.017), bevel=0.001)
    box(bpy, 'hammer', bl, (0.011, 0.008, 0.021), (-0.101, 0, 0.019), rot=(0, math.radians(-30), 0), bevel=0.0015)
    xcyl(bpy, 'barrel', bl, 0.0105, 0.060, 0.550)
    xcyl(bpy, 'mag_tube', bl, 0.0095, 0.060, 0.530, z=-0.022)
    box(bpy, 'front_band', st, (0.012, 0.026, 0.044), (0.522, 0, -0.011), bevel=0.002)
    box(bpy, 'front_sight', bl, (0.010, 0.004, 0.010), (0.540, 0, 0.0135))
    box(bpy, 'rear_sight', bl, (0.010, 0.012, 0.007), (0.200, 0, 0.0130))
    slab(bpy, 'forend', wd, [(0.064, -0.004), (0.282, -0.004), (0.290, -0.012), (0.284, -0.034), (0.064, -0.036)], 0.034)
    rod(bpy, 'lever_front', bl, (-0.032, 0, -0.034), (-0.052, 0, -0.080), 0.0046)
    rod(bpy, 'lever_bottom', bl, (-0.052, 0, -0.080), (-0.134, 0, -0.074), 0.0046)
    rod(bpy, 'lever_back', bl, (-0.134, 0, -0.074), (-0.112, 0, -0.050), 0.0046)
    box(bpy, 'trigger', st, (0.006, 0.006, 0.015), (-0.072, 0, -0.044), bevel=0.0012)
    slab(bpy, 'stock', wd, [(-0.100, 0.015), (-0.200, -0.002), (-0.425, -0.020), (-0.425, -0.128), (-0.300, -0.098),
                             (-0.165, -0.052), (-0.100, -0.036)], 0.036, bevel=0.008)
    box(bpy, 'butt_plate', st, (0.008, 0.040, 0.110), (-0.429, 0, -0.074), bevel=0.002)
    # THE ONE ASYMMETRIC THING: the forend wired to the barrel where its band went, three turns and a twisted tail
    for i in range(3): ring(bpy, 'wire_%d' % i, st, 0.0262, 0.0022, 0.255 + 0.006 * i, z=-0.012)
    rod(bpy, 'wire_tail', st, (0.261, -0.026, -0.030), (0.268, -0.030, -0.046), 0.0016, verts=6)
    to_grip(bpy, GRIP['rifle_b'])


def rack(bpy, mathutils):
    """the armourer's rack, with the six guns imported whole from their own glbs; each peg is cut to the height of its
    gun's own underside, the way a rack is built to what it holds"""
    pn = mat(bpy, 'pine', 'tape_masking', 1)
    H, X, SL = 1.36, 0.68, 0.30
    for s in (-1, 1):
        box(bpy, 'post_%d' % (s + 1), pn, (0.038, 0.089, H), (s * X, 0.065, H / 2), bevel=0.003)
        box(bpy, 'foot_%d' % (s + 1), pn, (0.089, 0.50, 0.038), (s * X, 0.065, 0.019), bevel=0.003)
        rod(bpy, 'brace_%d' % (s + 1), pn, (s * X, -0.13, 0.03), (s * X, 0.03, 0.30), 0.012)
        box(bpy, 'slat_%d' % (s + 1), pn, (0.040, 0.019, H - 0.25), (s * SL, 0.030, 0.20 + (H - 0.25) / 2), bevel=0.002)
    box(bpy, 'top_rail', pn, (2 * X + 0.12, 0.089, 0.038), (0, 0.065, H - 0.019), bevel=0.003)
    box(bpy, 'bottom_rail', pn, (2 * X + 0.04, 0.089, 0.038), (0, 0.065, 0.20), bevel=0.003)
    box(bpy, 'pistol_board', pn, (2 * X - 0.02, 0.019, 0.170), (0, 0.030, 0.385), bevel=0.003)
    pegs, placed = [], {}
    def peg(name, x, top):
        z = top - 0.0085; cyl(bpy, name, pn, 0.0085, 0.080, (x, -0.020, z), rot=(math.pi / 2, 0, 0), verts=10); pegs.append((round(x, 4), round(z, 4)))
    def world(h, skip=('sling', 'buckle', 'lanyard')):
        bpy.context.view_layer.update(); out = []
        for o in h.children_recursive:
            if o.type == 'MESH' and not o.name.split('.')[0].startswith(skip): out += [o.matrix_world @ v.co for v in o.data.vertices]
        return out
    def underside(h, x, skip=('sling', 'buckle', 'lanyard')):
        """the gun's own underside over a peg: a ray up from under it at three depths across its thickness, the highest
        first hit that is the gun and not its sling (a box has corners only, so its vertices cannot say where it is)"""
        import mathutils as mu
        bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); mine = set(h.children_recursive)
        z0 = min(v.z for v in world(h, skip=())) - 0.01; hits = []
        for y in (-0.040, -0.032, -0.024):
            o = mu.Vector((x, y, z0))
            for _ in range(8):
                ok, loc, nrm, idx, ob, mx = bpy.context.scene.ray_cast(dg, o, mu.Vector((0, 0, 1)), distance=0.5)
                if not ok: break
                if ob in mine and not ob.name.split('.')[0].startswith(skip): hits.append(loc.z); break
                o = mu.Vector((x, y, loc.z + 0.0005))
        return max(hits)
    def hang(name, bore_z, centre_x, peg_xs):
        h = import_model(bpy, os.path.join(ROOT, 'reference/models/bohemia/gun_%s.glb' % name), (0, -0.032, bore_z + GRIP[name][1]), (0, 0, 0))
        vs = world(h); h.location.x += centre_x - (min(v.x for v in vs) + max(v.x for v in vs)) / 2
        for px in peg_xs: peg('peg_%s_%d' % (name, int(px * 1000)), px, underside(h, px))
        placed[name] = h
    for name, bz in (('rifle_a', 1.250), ('rifle_b', 1.030), ('shotgun_b', 0.820), ('shotgun_a', 0.620)): hang(name, bz, 0.0, (-SL, SL))
    for name, x in (('pistol_a', -0.40), ('pistol_b', -0.05)): hang(name, 0.460, x, (x - 0.045, x + 0.045))
    # THE ONE ASYMMETRIC THING: a third pair of pistol pegs empty, a blank tag tied to its left peg on a string
    for dx in (-0.045, 0.045): peg('peg_empty_%d' % int(dx * 1000), 0.33 + dx, 0.420)
    tp = bpy.data.materials.get('tape') or mat(bpy, 'tape', 'tape_grey', 2)   # made late: an import clears a material nobody uses yet
    rod(bpy, 'tag_string', tp, (0.285, -0.050, 0.411), (0.292, -0.056, 0.360), 0.0015, verts=6)
    box(bpy, 'tag', tp, (0.034, 0.002, 0.052), (0.294, -0.057, 0.332), rot=(0, math.radians(-8), 0))
    boxes = {}
    for name, h in placed.items():
        vs = world(h, skip=())
        boxes[name] = dict(lo=[round(min(getattr(v, a) for v in vs), 4) for a in 'xyz'], hi=[round(max(getattr(v, a) for v in vs), 4) for a in 'xyz'])
    every = [v for o in bpy.context.scene.objects if o.type == 'MESH' for v in [o.matrix_world @ w.co for w in o.data.vertices]]
    rack_box = dict(lo=[round(min(getattr(v, a) for v in every), 4) for a in 'xyz'], hi=[round(max(getattr(v, a) for v in every), 4) for a in 'xyz'])
    json.dump(dict(what="each gun's world box on the rack in metres (x right, y away from the S camera, z up), before the rig's scale; the sheet projects it through the rig's cameras; rack_box is the whole model's, whose ground centre the rig puts at the origin",
                   guns=boxes, pegs=pegs, rack_box=rack_box), open(os.path.join(ROOT, 'reference/models/bohemia/gun_rack.json'), 'w'), indent=1)


BUILDERS = dict(pistol_a=pistol_a, pistol_b=pistol_b, shotgun_a=shotgun_a, shotgun_b=shotgun_b, rifle_a=rifle_a, rifle_b=rifle_b, rack=rack)


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
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(ROOT, 'reference/models/bohemia/gun_%s.glb' % name)
    print(build(name, out))
