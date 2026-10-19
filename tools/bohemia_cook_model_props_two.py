#!/usr/bin/env python3
"""BOHEMIA -- COOK [the accessories through the rig] 10/19/26: THE FIGHT'S AND THE MAP'S PROPS THAT HAD NO MODEL, MADE LIKE THE TRUCK.
Rule 121(j) (Paolo 10/19: 'even the floor tiles and building tiles and all accessories have to get remade with this analog
horror Crashbox style. Everything. Everything.'). [props through the rig] made the lamp, the gun and the wreck; the fight
props and the block war's cover made the barrier, the dumpster, the cart, the tyres, the sandbags, the fence, the
container, the propane, the rubble, the corral (and the terrains' seven). What the fight still draws flat
(slices/fight_ground/cover_*.webp) and the families the row names with no model are made here, the same way:

  patrol     the fight's DEAD PATROL CAR ON THE DRIVE (cover_car_drive): last round's sedan imported whole (wreck.glb,
             never remodelled), its teal repainted the black of a county car, white doors, a light bar, a push bar. The
             odd thing: a tow chain hooked to the push bar, its free end lying in the road, nobody on the other end.
  streetlight the arterial's cobra-head: a 9 m galvanised pole, a 2.4 m mast arm, the head. The odd thing: the handhole
             at its foot open and the copper pulled out of it in a coil on the ground (somebody sold it).
  wall       the fight's BLOCK WALL (cover_wall): 6 m of 8-inch block, 1.8 m, its cap course; the odd thing: a tally
             scratched into it, groups of five, a long run of them.
  wall_corner the fight's BLOCK WALL, CORNER (cover_wall_corner): 4 m by 4 m, the same block; the odd thing: a child's
             handprint in house paint at waist height.
  wall_broken the fight's BLOCK WALL, KNOCKED THROUGH (cover_wall_broken): the 6 m wall with its 1.3 m gap, the blocks
             fallen out on the near side; the odd thing: a doormat laid in the gap.
  stop_sign  a stop sign on its square post with the street-name blade over it; the odd thing: the post bent over by a
             car and the sign shot through, five holes, still facing the road.
  trailer    the fight's TRAILER (cover_trailer): a 40-foot box trailer on its landing legs, one axle; the odd thing: the
             rear door rolled up a metre and a mattress inside it.
  shed       the fight's SHED (cover_shed, it blocks a man): a 2.4 x 3 m tin shed 2.2 m tall, corrugated; the odd thing:
             the door open on the dark and the padlock still locked on the open hasp.

Puppet shapes, every base colour a step of a role of records/target/BOHEMIA_STYLE_PALETTE.json, five materials at most a
prop (the guide's prop class), real sizes in metres, one wrong thing each on the side the S camera sees.

  <venv>/bin/python tools/bohemia_cook_model_props_two.py <name>          -> reference/models/bohemia/<name>.glb (prints its size)
  then the master rig: <venv>/bin/python tools/bohemia_cook_rig_one_ray.py reference/models/bohemia/<name>.glb
       records/target/master_rig/cook_<name> --real-length <long side> --real-dims L,W,H

REFERENCE CHECK (the 9/4 standing duty): the fight's own cover sprites (slices/fight_ground/cover_*.webp) and his pack
tiles are the twins at 1:1 on the sheet; real sizes: an 8-inch CMU block 0.4 x 0.2 x 0.2 m, a Clark County block wall
1.8 m, a 40-foot dry van 12.2 x 2.6 x 4.1 m, an MUTCD stop sign 0.75 m on a 2.1 m post, a cobra-head on a 9 m pole. No
reference game.
REUSE CHECK (REUSE-FIRST): the props modeller's helpers and its import_model (the patrol car IS the wreck); the master rig.
TASTE CHECK: the rig is the look (rule 115); one wrong thing each, calm.
"""
import os, sys, math, random
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_model_props as P
mat, box, cyl, rod, prism, put = P.mat, P.box, P.cyl, P.rod, P.prism, P.put
MODELS = os.path.join(R, 'reference/models/bohemia')


def block_mat(bpy, name, role, step):
    """8-inch block in courses: the props' mat() with a Brick texture laid over its colour (0.4 x 0.2 m, 1 cm mortar)"""
    m = mat(bpy, name, role, step); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Scale'].default_value = 1.0; br.inputs['Brick Width'].default_value = 0.4; br.inputs['Row Height'].default_value = 0.2
    br.inputs['Mortar Size'].default_value = 0.012; br.offset = 0.5
    c = b.inputs['Base Color'].default_value
    br.inputs['Color1'].default_value = tuple(c); br.inputs['Color2'].default_value = tuple(x * 0.9 for x in c[:3]) + (1,)
    br.inputs['Mortar'].default_value = tuple(x * 0.62 for x in c[:3]) + (1,)
    sep = nt.nodes.new('ShaderNodeSeparateXYZ'); cmb = nt.nodes.new('ShaderNodeCombineXYZ')   # courses run along x and y, rise in z
    add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'
    nt.links.new(tc.outputs['Object'], sep.inputs[0]); nt.links.new(sep.outputs['X'], add.inputs[0]); nt.links.new(sep.outputs['Y'], add.inputs[1])
    nt.links.new(add.outputs[0], cmb.inputs['X']); nt.links.new(sep.outputs['Z'], cmb.inputs['Y'])
    nt.links.new(cmb.outputs[0], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.5; bump.inputs['Distance'].default_value = 0.01
    nt.links.new(br.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m


def patrol(bpy, mu):
    h = P.import_model(bpy, os.path.join(MODELS, 'wreck.glb'), (0, 0, 0), (0, 0, 0))
    for m in bpy.data.materials:                           # the county's black over the teal: the same body, repainted
        if m.name.startswith('paint_teal'):
            b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = P.lin(P.PAL['rubber']['ramp'][3 if 'low' not in m.name else 2])
    white = mat(bpy, 'county_white', 'clay_bone', 4); red = next(m for m in bpy.data.materials if m.name.startswith('rust') and 'dark' not in m.name)
    for side in (-1, 1):                                    # the white doors
        box(bpy, 'door_white_%d' % side, white, (1.5, 0.02, 0.42), (-0.15, side * 0.9, 0.62), bevel=0.01)
    box(bpy, 'lightbar', white, (1.2, 0.3, 0.1), (-0.35, 0, 1.33), bevel=0.02)
    box(bpy, 'lens_red', red, (0.5, 0.31, 0.07), (-0.62, 0, 1.36))
    trim = next(m for m in bpy.data.materials if m.name.startswith('trim'))
    for y in (-0.5, 0.5): box(bpy, 'pushbar_%d' % int(y * 10), trim, (0.06, 0.06, 0.45), (2.5, y, 0.5))
    box(bpy, 'pushbar_x', trim, (0.06, 1.1, 0.06), (2.5, 0, 0.7))
    # THE ODD THING: a tow chain hooked to the push bar, its free end lying out in the road toward the camera
    rnd = random.Random(7); x, y, z = 2.5, -0.3, 0.55; ang = -0.9
    for i in range(22):                                     # down to the road, then out along it toward the camera, slack
        ang += rnd.uniform(-0.35, 0.45)
        nx, ny = x + 0.1 * math.cos(ang) * (0.4 if z > 0.1 else 1), y + 0.1 * math.sin(ang); nz = max(0.03, z - 0.1)
        rod(bpy, 'chain_%d' % i, trim, (x, y, z), (nx, ny, nz), 0.022, verts=6); x, y, z = nx, ny, nz


def streetlight(bpy, mu):
    galv = mat(bpy, 'galv', 'tape_grey', 2); dark = mat(bpy, 'base_dark', 'rubber', 2); head = mat(bpy, 'head', 'tape_grey', 3)
    copper = mat(bpy, 'copper', 'clay_rust', 2); lamp = mat(bpy, 'lamp_lens', 'glass_eye', 1)
    cyl(bpy, 'footing', dark, 0.32, 0.25, (0, 0, 0.125), verts=12)
    pole = cyl(bpy, 'pole', galv, 0.11, 9.0, (0, 0, 0.25 + 4.5), verts=16)
    for v in pole.data.vertices:                            # tapered: 22 cm at the foot to 12 at the top
        t = (v.co.z + 4.5) / 9.0; v.co.x *= 1 - 0.45 * t; v.co.y *= 1 - 0.45 * t
    a = 2.4; rod(bpy, 'arm', galv, (0, 0, 8.9), (a, 0, 9.35), 0.05, verts=10)
    box(bpy, 'cobra', head, (0.75, 0.32, 0.18), (a + 0.2, 0, 9.33), rot=(0, math.radians(-8), 0), bevel=0.06)
    box(bpy, 'cobra_lens', lamp, (0.55, 0.26, 0.04), (a + 0.22, 0, 9.22), rot=(0, math.radians(-8), 0))
    # THE ODD THING: the handhole at the foot open, its cover on the ground, the copper pulled out in a coil
    box(bpy, 'handhole', dark, (0.12, 0.02, 0.22), (0, -0.2, 0.75))
    box(bpy, 'handhole_cover', galv, (0.14, 0.02, 0.24), (0.25, -0.45, 0.012), rot=(math.radians(88), 0, math.radians(20)))
    for i in range(3):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.18 - i * 0.02, minor_radius=0.012, location=(-0.35 + i * 0.04, -0.5, 0.02 + i * 0.02))
        put(bpy, bpy.context.active_object, 'coil_%d' % i, copper)
    rod(bpy, 'wire_out', copper, (0, -0.21, 0.72), (-0.3, -0.48, 0.05), 0.01, verts=5)


def _wall(bpy, name, blk, cap, x0, x1, y, h=1.8, t=0.2):
    box(bpy, name, blk, (x1 - x0, t, h), ((x0 + x1) / 2, y, h / 2), bevel=0.01)
    box(bpy, name + '_cap', cap, (x1 - x0 + 0.04, t + 0.05, 0.1), ((x0 + x1) / 2, y, h + 0.05), bevel=0.01)


def wall(bpy, mu):
    blk = block_mat(bpy, 'cmu', 'tape_masking', 2); cap = mat(bpy, 'cap', 'tape_grey', 2); mark = mat(bpy, 'scratch', 'clay_bone', 3)
    _wall(bpy, 'wall', blk, cap, -3, 3, 0)
    # THE ODD THING: a tally scratched into the block, groups of five, a long run of them
    for g in range(9):
        x = -2.4 + g * 0.42
        for k in range(4): box(bpy, 'tally', mark, (0.012, 0.004, 0.22), (x + k * 0.06, -0.102, 1.25))
        box(bpy, 'tally_x', mark, (0.27, 0.004, 0.012), (x + 0.09, -0.103, 1.25), rot=(0, math.radians(-38), 0))


def wall_corner(bpy, mu):
    blk = block_mat(bpy, 'cmu', 'tape_masking', 2); cap = mat(bpy, 'cap', 'tape_grey', 2); paint = mat(bpy, 'hand_paint', 'clay_teal', 2)
    _wall(bpy, 'wall_a', blk, cap, -2, 2, -1.9)
    box(bpy, 'wall_b', blk, (0.2, 3.8, 1.8), (-1.9, 0.1, 0.9), bevel=0.01); box(bpy, 'wall_b_cap', cap, (0.25, 3.84, 0.1), (-1.9, 0.1, 1.85), bevel=0.01)
    # THE ODD THING: a child's handprint in house paint at waist height (a palm and five fingers)
    box(bpy, 'palm', paint, (0.08, 0.004, 0.09), (0.6, -2.002, 0.92))
    for i, (dx, dz, l) in enumerate(((-0.045, 0.07, 0.05), (-0.018, 0.085, 0.06), (0.012, 0.088, 0.06), (0.04, 0.075, 0.05), (0.06, 0.0, 0.04))):
        box(bpy, 'finger_%d' % i, paint, (0.016, 0.004, l), (0.6 + dx, -2.003, 0.92 + dz + l / 2 - 0.02), rot=(0, math.radians(-30 if i == 4 else 0), 0))


def wall_broken(bpy, mu):
    blk = block_mat(bpy, 'cmu', 'tape_masking', 2); cap = mat(bpy, 'cap', 'tape_grey', 2); mat_ = mat(bpy, 'doormat', 'clay_rust', 1)
    _wall(bpy, 'wall_l', blk, cap, -3, -0.65, 0); _wall(bpy, 'wall_r', blk, cap, 0.65, 3, 0)
    rnd = random.Random(11)
    for i in range(14):                                     # the blocks fallen out on the near side, some whole, some broken
        x = rnd.uniform(-0.9, 0.9); y = rnd.uniform(-1.2, -0.25); w = 0.4 if rnd.random() < 0.6 else rnd.uniform(0.15, 0.3)
        box(bpy, 'fallen_%d' % i, blk, (w, 0.2, 0.2), (x, y, 0.1 + (0.2 if i % 5 == 4 else 0)), rot=(rnd.uniform(-0.2, 0.2), rnd.uniform(-0.2, 0.2), rnd.uniform(0, math.pi)))
    for x0, sgn in ((-0.65, 1), (0.65, -1)):               # the broken ends stepped, a course lower each block in
        for k in range(4):
            box(bpy, 'stub_%d_%d' % (sgn, k), blk, (0.2, 0.2, 0.2), (x0 + sgn * 0.1, 0, 1.7 - k * 0.42 - 0.1), bevel=0.01)
    # THE ODD THING: a doormat laid in the gap, square to the wall
    box(bpy, 'doormat', mat_, (0.75, 0.48, 0.02), (0, -0.05, 0.01))


def stop_sign(bpy, mu):
    steel = mat(bpy, 'post', 'tape_grey', 2); red = mat(bpy, 'sign_red', 'clay_rust', 2); white = mat(bpy, 'sign_white', 'clay_bone', 4)
    green = mat(bpy, 'blade', 'clay_teal', 2); hole = mat(bpy, 'hole', 'glass_eye', 0)
    bpy.ops.object.empty_add(location=(0, 0, 0)); bent = bpy.context.active_object; bent.name = 'bent'
    parts = []
    parts.append(box(bpy, 'post', steel, (0.05, 0.05, 2.9), (0, 0, 1.45)))
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.38, depth=0.02, location=(0, -0.04, 2.25), rotation=(math.pi / 2, 0, math.pi / 8))
    parts.append(put(bpy, bpy.context.active_object, 'octagon_border', white, smooth=False))
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.35, depth=0.024, location=(0, -0.045, 2.25), rotation=(math.pi / 2, 0, math.pi / 8))
    parts.append(put(bpy, bpy.context.active_object, 'octagon', red, smooth=False))
    for i, dx in enumerate((-0.2, -0.1, 0.0, 0.1, 0.2)): parts.append(box(bpy, 'letter_%d' % i, white, (0.07, 0.006, 0.12), (dx, -0.06, 2.25)))
    parts.append(box(bpy, 'blade_a', green, (0.76, 0.02, 0.16), (0, -0.0, 2.82)))
    parts.append(box(bpy, 'blade_b', green, (0.02, 0.76, 0.16), (0, 0, 3.0)))
    for i, (dx, dz) in enumerate(((-0.12, 0.1), (0.08, 0.16), (0.2, -0.05), (-0.05, -0.18), (0.14, -0.2))):   # five holes, shot through
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.012, depth=0.04, location=(dx, -0.06, 2.25 + dz), rotation=(math.pi / 2, 0, 0))
        parts.append(put(bpy, bpy.context.active_object, 'shot_%d' % i, hole, smooth=False))
    for o in parts: o.parent = bent
    # THE ODD THING: bent over by a car, 18 degrees off true from a point 0.4 m up, still facing the road
    bent.location = (0, 0, 0.4); bent.rotation_euler = (math.radians(-14), math.radians(9), 0)
    for o in parts: o.location.z -= 0.4
    box(bpy, 'post_foot', steel, (0.05, 0.05, 0.42), (0, 0, 0.21))


def trailer(bpy, mu):
    body = mat(bpy, 'van_white', 'tape_grey', 3); rust = mat(bpy, 'rust', 'clay_rust', 1); rubber = mat(bpy, 'tyre', 'rubber', 1)
    dark = mat(bpy, 'inside', 'glass_eye', 0); stripe = mat(bpy, 'mattress', 'clay_bone', 3)
    L, W, H = 12.2, 2.6, 2.75; z0 = 1.3
    box(bpy, 'box', body, (L, W, H), (0, 0, z0 + H / 2), bevel=0.04)
    for i in range(int(L / 0.6)):                          # the posts down the side, every 60 cm
        for s in (-1, 1): box(bpy, 'rib', body, (0.05, 0.03, H - 0.1), (-L / 2 + 0.3 + i * 0.6, s * (W / 2 + 0.01), z0 + H / 2))
    box(bpy, 'rail', rust, (L, W + 0.06, 0.2), (0, 0, z0 - 0.05))
    for k, (x, ln) in enumerate(((-3.0, 2.4), (2.6, 3.5), (-5.2, 1.4))): box(bpy, 'streak_%d' % k, rust, (0.25, 0.01, ln), (x, -W / 2 - 0.02, z0 + H - ln / 2))
    for x in (-4.6, -3.4):                                  # one tandem pair at the rear (the trailer's rear is -X)
        for s in (-1, 1):
            cyl(bpy, 'tyre_%d_%d' % (int(x), s), rubber, 0.5, 0.28, (x, s * 0.95, 0.5), rot=(math.pi / 2, 0, 0), verts=18)
    for s in (-1, 1): box(bpy, 'leg_%d' % s, rust, (0.12, 0.12, 1.25), (3.8, s * 0.9, 0.62))
    box(bpy, 'leg_foot', rust, (0.4, 2.2, 0.06), (3.8, 0, 0.03))
    # THE ODD THING: the rear door rolled up a metre, the dark inside, a mattress laid on the floor of it
    box(bpy, 'rear_gap', dark, (0.04, W - 0.2, 1.0), (-L / 2 - 0.01, 0, z0 + 0.55))
    box(bpy, 'mattress', stripe, (0.7, 1.9, 0.2), (-L / 2 + 0.3, 0, z0 + 0.12), bevel=0.05)


def shed(bpy, mu):
    tin = mat(bpy, 'tin', 'tape_grey', 2); rust = mat(bpy, 'rust', 'clay_rust', 1); dark = mat(bpy, 'dark', 'glass_eye', 0); lock = mat(bpy, 'lock', 'clay_mustard', 2)
    L, D, H = 3.0, 2.4, 2.2
    box(bpy, 'walls', tin, (L, D, H - 0.2), (0, 0, (H - 0.2) / 2), bevel=0.02)
    for i in range(int(L / 0.076)):                       # the corrugation on the front, ribs every 7.6 cm
        box(bpy, 'cor', tin, (0.03, 0.02, H - 0.25), (-L / 2 + 0.04 + i * 0.076, -D / 2 - 0.01, (H - 0.25) / 2))
    prism(bpy, 'roof', tin, [(-D / 2 - 0.12, H - 0.25), (D / 2 + 0.12, H - 0.05), (D / 2 + 0.12, H), (-D / 2 - 0.12, H - 0.2)], -L / 2 - 0.1, L / 2 + 0.1)
    for k, x in enumerate((-1.1, 0.9)): box(bpy, 'rust_%d' % k, rust, (0.35, 0.03, 0.9), (x, -D / 2 - 0.03, 0.55))
    # THE ODD THING: the door open on the dark, and the padlock still locked on the open hasp
    box(bpy, 'doorway', dark, (1.0, 0.04, 1.85), (0.2, -D / 2 - 0.02, 0.93))
    box(bpy, 'door_leaf', tin, (1.0, 0.03, 1.85), (-0.3 - 0.0, -D / 2 - 0.5, 0.93), rot=(0, 0, math.radians(-80)))
    box(bpy, 'hasp', rust, (0.12, 0.02, 0.04), (0.72, -D / 2 - 0.04, 1.0))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.025, minor_radius=0.006, location=(0.78, -D / 2 - 0.06, 1.0), rotation=(math.pi / 2, 0, 0))
    put(bpy, bpy.context.active_object, 'shackle', rust)
    box(bpy, 'padlock', lock, (0.05, 0.025, 0.06), (0.78, -D / 2 - 0.06, 0.95), bevel=0.008)


BUILDERS = dict(patrol=patrol, streetlight=streetlight, wall=wall, wall_corner=wall_corner, wall_broken=wall_broken, stop_sign=stop_sign,
                trailer=trailer, shed=shed)
# the master rig's sizing for each (its long side, and the real thing's L, W, H)
RIG_ARGS = dict(patrol=('--real-length', '4.7', '--real-dims', '4.7,1.85,1.45'), streetlight=('--real-height', '9.5'),
                wall=('--real-length', '6.0', '--real-dims', '6.0,0.25,1.9'), wall_corner=('--real-length', '4.0'),
                wall_broken=('--real-length', '6.0'), stop_sign=('--real-height', '3.08'),
                trailer=('--real-length', '12.2', '--real-dims', '12.2,2.6,4.1'), shed=('--real-length', '3.2', '--real-dims', '3.0,2.4,2.2'))


def build(name, out):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    BUILDERS[name](bpy, mathutils)
    bpy.context.view_layer.update()
    print('DIMS x y z (m):', P.dims(bpy), 'materials:', sorted(m.name for m in bpy.data.materials if m.users))
    for o in bpy.context.scene.objects: o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    for name in [x for x in a if x in BUILDERS]:
        print(build(name, os.path.join(MODELS, '%s.glb' % name)))
    sys.stdout.flush(); os._exit(0)
