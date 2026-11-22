#!/usr/bin/env python3
"""BOHEMIA -- STAFF 2 [the staff push a cart] (VAMILY rule 471, Paolo 11/22: 'the servants of your crew, not regular fighters but
cooks or medics or blacksmith or whatever, they're forced to forever carry instead of a shield... it's like it's a shopping cart...
it can be a one-handed slot. Maybe it could never be removed, maybe it could be upgraded, or it could be like a different type of
shopping cart, wagon maybe... that shopping cart does reflect in the combat, like you'll see it').

THE CART, MODELLED AND RENDERED THROUGH THE RIG (rule 115a, 121(e): every held thing is the master rig's camera, sun, palette and
stretch): three carts, each with the six things a trade carries in it, in the man's own frame (the fight sheet's 57 px a metre, the
45 degree tilt, the 3/4 stretch, the turntable's eight facings), so the fight lays each cart beside any man the way it lays a
shield off the donor's layer (__WHAT_HE_CARRIES_IS_DRAWN__):
  shopping_cart  COOK's own shopping cart (tools/bohemia_cook_model_props.py cart(), IMPORTED AND CALLED: its wire, its red
                 handle, its casters), all four casters on (his staff's cart rolls; COOK's corral cart lost one), its tilt taken
                 off, the bag out of the basket. The odd thing: a strip of masking tape wound round the handle where it split.
  utility_cart   a steel utility cart: two lipped trays on four corner posts, the push handle at one end, five-inch rubber
                 casters, olive paint worn to the steel. The odd thing: a bungee cord across the top tray, its hook hanging.
  wagon          a garden wagon: a steel bed, slat sides, four pneumatic wheels, the steering tongue and its T-handle up to his
                 hand (the tongue pivots, so the handle sits in his fist at any height). The odd thing: one tyre patched in grey tape.
  loads: food (a stock pot with its lid, two rice sacks, a water jug), meds (a white tackle box, rolled bandages, a duffel),
         tape (stacked rolls of grey tape, a red toolbox, a car-door skin), rounds (two ammo cans, a cardboard case),
         gear (a duffel, a cardboard box, a rolled tarp), empty.
WHERE IT STANDS: in the man's frame (he faces -Y, his left is +X), the cart's handle 0.3 m in front of his middle, the cart to his
left (his right fist holds his one-handed weapon), its front the way he faces.
THE LAYERS, for any body in any pose (no holdout of one man's body): BACK, the whole cart and its cast shadow (drawn under him);
FRONT, only what stands nearer the camera than his middle (a holdout half-space behind the plane through him), drawn over him;
TIP, the cart on its side and its load spilled (drawn under a man who fell). The shadow is the sun's own (a shadow catcher), at
most the guide's shadow_alpha_max, its own pixels, never under the cart's.

Run (bpy 4.2 on python3.11, the master rig's venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy):
    <venv>/bin/python tools/bohemia_staff_the_cart.py render [KIND ...]     the raws (records/target/staff_cart/raw, .gitignore'd)
    python3 tools/bohemia_staff_the_cart.py pack                            slices/fight_rig/staff_cart_<kind>.webp + staff_carts.json
    python3 tools/bohemia_staff_the_cart.py sheet                           records/target/staff_cart/the_carts_on_the_camp.png (the
                                                                            twins: each cart laid on three camp people's own fight cells)
REUSE CHECK: the shopping cart is COOK's (imported, called); the materials are the props modeller's palette steps (mat, box, cyl,
rod, sack imported); the wear is the master rig's source_pass; the light and film are the master rig's light_and_film; the frame is
the fight sheet's (ppm, tilt, stretch, turntable, foot). Nothing of a body is rendered here.
REFERENCE CHECK (the 9/4 standing duty): the twin of every cart is the camp person's own fight cell beside it at the fight's pixels
(the sheet); COOK's corral cart (reference/models/bohemia/cart.glb) is the same wire; analog horror AH-01 (worn, never new).
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
RAW = os.path.join(ROOT, 'records/target/staff_cart/raw')
OUT = os.path.join(ROOT, 'slices/fight_rig')
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']   # the master rig's turntable order (180 - 45 i)
DIR8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']      # the fight's
KINDS = ['shopping_cart', 'utility_cart', 'wagon']
LOADS = ['food', 'meds', 'tape', 'rounds', 'gear', 'empty']
PPM = 57
TILT = 45.0
RES = 360
LOOK_Z = 0.55
FOOT = [66, 110]          # the fight cell's foot (slices/fight_rig/fight_rig.json, every man's 144 x 161 cell)
HANDLE_Y = -0.30          # the handle this far in front of his middle (his frame: he faces -Y)
CART_X = 0.20             # the cart's middle this far to his left (+X)
SAMPLES = 24              # the fight sheets' own (fight_rig.json render_changes)
ONLY_L, ONLY_F, ONLY_CART = [], [], False   # a test's narrowing (--loads, --facings, --cart-only)


# ------------------------------------------------------------------------------------------------ the models (bpy)
def build_cart(bpy, mathutils, kind):
    """the cart in its own frame: its front +X, its handle's middle at (hx, 0, hz); returns (root, parts, frame) where frame is
    {handle_x, handle_z, floor: (z, x0, x1, half_w)}"""
    import bohemia_cook_model_props as P
    sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    m = lambda n, role, step=2: P.mat(bpy, '%s_%s' % (kind, n), role, step)
    if kind == 'shopping_cart':
        P.cart(bpy, mathutils)                       # COOK's cart, as he modelled it
        root = bpy.data.objects['cart']
        for o in list(root.children):
            if o.name.split('.')[0] in ('bag', 'bag_knot', 'fork_fl_bare'): bpy.data.objects.remove(o, do_unlink=True)
        root.rotation_euler = (0, 0, 0); root.location = (0, 0, 0)
        rub, rust = m('caster', 'rubber', 1), m('fork', 'clay_rust', 0)
        xf = 0.48
        c = P.cyl(bpy, 'caster_fl', rub, 0.055, 0.035, (xf - 0.04, -0.2, 0.055), rot=(math.pi / 2, 0, 0), verts=12); c.parent = root
        f = P.box(bpy, 'fork_fl', rust, (0.04, 0.05, 0.05), (xf - 0.04, -0.2, 0.1)); f.parent = root
        # THE ODD THING: masking tape wound round the handle where the plastic split, its tail hanging
        tape = m('tape', 'tape_masking', 2)
        for i, y in enumerate((-0.12, -0.09, -0.06)):
            t = P.cyl(bpy, 'handle_tape_%d' % i, tape, 0.026, 0.025, (-0.52, y, 1.0), rot=(math.pi / 2, 0, 0), verts=10); t.parent = root
        t = P.box(bpy, 'handle_tape_tail', tape, (0.012, 0.03, 0.08), (-0.52, -0.09, 0.95), rot=(math.radians(10), 0, 0)); t.parent = root
        frame = dict(handle_x=-0.52, handle_z=1.0, floor=(0.56, -0.40, 0.34, 0.2))
    elif kind == 'utility_cart':
        paint, steel, rub, rust = m('paint', 'metal_painted', 1), m('steel', 'tape_grey', 2), m('caster', 'rubber', 1), m('rust', 'clay_rust', 1)
        L, W = 0.9, 0.48
        for z in (0.24, 0.80):   # two lipped trays
            P.box(bpy, 'tray_%d' % int(z * 100), paint, (L, W, 0.025), (0, 0, z), bevel=0.006)
            for s in (-1, 1):
                P.box(bpy, 'lip_y_%d_%d' % (s, int(z * 100)), paint, (L, 0.018, 0.05), (0, s * (W / 2 - 0.009), z + 0.03))
                P.box(bpy, 'lip_x_%d_%d' % (s, int(z * 100)), paint, (0.018, W, 0.05), (s * (L / 2 - 0.009), 0, z + 0.03))
        for sx in (-1, 1):
            for sy in (-1, 1):
                P.cyl(bpy, 'post_%d_%d' % (sx, sy), steel, 0.016, 0.72, (sx * (L / 2 - 0.02), sy * (W / 2 - 0.02), 0.48), verts=8)
                P.cyl(bpy, 'caster_%d_%d' % (sx, sy), rub, 0.063, 0.04, (sx * (L / 2 - 0.06), sy * (W / 2 - 0.06), 0.063), rot=(math.pi / 2, 0, 0), verts=14)
                P.box(bpy, 'fork_%d_%d' % (sx, sy), rust, (0.05, 0.05, 0.06), (sx * (L / 2 - 0.06), sy * (W / 2 - 0.06), 0.15))
        hx = -L / 2 - 0.08
        for sy in (-1, 1): P.rod(bpy, 'handle_leg_%d' % sy, steel, (-L / 2 + 0.02, sy * 0.2, 0.8), (hx, sy * 0.2, 0.97), 0.015)
        P.cyl(bpy, 'handle', m('grip', 'rubber', 2), 0.02, 0.44, (hx, 0, 0.97), rot=(math.pi / 2, 0, 0), verts=10)
        P.blotch(bpy, 'rust_patch', rust, 0.09, (0.18, -W / 2 - 0.002, 0.27), (math.pi / 2, 0, 0), 7)
        # THE ODD THING: a bungee cord across the top tray, one hook off and hanging over the side
        cord = m('bungee', 'clay_rust', 3)
        P.rod(bpy, 'bungee', cord, (0.3, -W / 2, 0.84), (0.25, W / 2 - 0.05, 0.86), 0.008)
        P.rod(bpy, 'bungee_hang', cord, (0.25, W / 2 - 0.05, 0.86), (0.27, W / 2 + 0.01, 0.62), 0.008)
        frame = dict(handle_x=hx, handle_z=0.97, floor=(0.825, -0.42, 0.42, 0.2))
    else:   # the wagon
        bed, wood, rub, steel, rust = m('bed', 'metal_painted', 2), m('slat', 'clay_mustard', 1), m('tyre', 'rubber', 0), m('axle', 'tape_grey', 1), m('rust', 'clay_rust', 1)
        L, W, Z = 1.05, 0.58, 0.42
        P.box(bpy, 'bed', bed, (L, W, 0.03), (0, 0, Z), bevel=0.01)
        for s in (-1, 1):
            for k, z in enumerate((Z + 0.07, Z + 0.17)):
                P.box(bpy, 'slat_y_%d_%d' % (s, k), wood, (L, 0.022, 0.07), (0, s * (W / 2 - 0.011), z))
                P.box(bpy, 'slat_x_%d_%d' % (s, k), wood, (0.022, W, 0.07), (s * (L / 2 - 0.011), 0, z))
            for x in (-L / 2 + 0.03, 0, L / 2 - 0.03): P.box(bpy, 'stake_%d_%d' % (s, int(x * 100)), steel, (0.03, 0.03, 0.24), (x, s * (W / 2 - 0.011), Z + 0.11))
        for sx in (-1, 1):
            ax = sx * (L / 2 - 0.16)
            P.rod(bpy, 'axle_%d' % sx, steel, (ax, -W / 2 - 0.04, 0.14), (ax, W / 2 + 0.04, 0.14), 0.014)
            P.box(bpy, 'bolster_%d' % sx, steel, (0.06, W - 0.1, 0.24), (ax, 0, 0.28))
            for sy in (-1, 1):
                P.cyl(bpy, 'tyre_%d_%d' % (sx, sy), rub, 0.14, 0.085, (ax, sy * (W / 2 + 0.06), 0.14), rot=(math.pi / 2, 0, 0), verts=18)
                P.cyl(bpy, 'hub_%d_%d' % (sx, sy), steel, 0.055, 0.09, (ax, sy * (W / 2 + 0.06), 0.14), rot=(math.pi / 2, 0, 0), verts=10)
        # the steering tongue off the front (his) axle, up to the T-handle in his fist
        ax0 = -(L / 2 - 0.16); hx, hz = ax0 - 0.62, 0.80
        P.rod(bpy, 'tongue', steel, (ax0, 0, 0.16), (hx, 0, hz), 0.016)
        P.cyl(bpy, 'handle', m('grip', 'rubber', 2), 0.02, 0.2, (hx, 0, hz), rot=(math.pi / 2, 0, 0), verts=10)
        P.blotch(bpy, 'rust_patch', rust, 0.12, (0.25, -W / 2 - 0.001, Z + 0.12), (math.pi / 2, 0, 0), 11)
        # THE ODD THING: the near left tyre patched in grey tape
        P.cyl(bpy, 'tyre_patch', m('patch', 'tape_grey', 3), 0.145, 0.06, (ax0, -(W / 2 + 0.06), 0.14), rot=(math.pi / 2, 0, math.radians(0)), verts=6)
        frame = dict(handle_x=hx, handle_z=hz, floor=(Z + 0.015, -0.46, 0.46, 0.24))
        bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.active_object; root.name = 'cart'
        for o in [o for o in sc.objects if o.name not in before and o is not root]: o.parent = root
    if kind == 'utility_cart':
        bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.active_object; root.name = 'cart'
        for o in [o for o in sc.objects if o.name not in before and o is not root]: o.parent = root
    parts = [o for o in root.children_recursive if o.type == 'MESH']
    return root, parts, frame


def build_load(bpy, mathutils, kind, load, floor):
    """what the trade carries, on the cart's floor (z, x0, x1, half width); returns its parts"""
    import random
    import bohemia_cook_model_props as P
    sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    rnd = random.Random(hash((kind, load)) & 0xffff)
    z, x0, x1, hw = floor
    m = lambda n, role, step=2: P.mat(bpy, 'load_%s_%s' % (load, n), role, step)
    if load == 'food':
        pot, lid, sackm, jug = m('pot', 'tape_grey', 3), m('lid', 'tape_grey', 2), m('sack', 'clay_bone', 2), m('jug', 'clay_teal', 3)
        P.cyl(bpy, 'pot', pot, 0.15, 0.22, (x0 + 0.2, -hw * 0.35, z + 0.11), verts=16)
        P.cyl(bpy, 'pot_lid', lid, 0.155, 0.02, (x0 + 0.2, -hw * 0.35, z + 0.23), verts=16)
        P.cyl(bpy, 'pot_knob', lid, 0.025, 0.03, (x0 + 0.2, -hw * 0.35, z + 0.255), verts=8)
        P.sack(bpy, 'rice_a', sackm, (0.36, 0.22, 0.13), (x0 + 0.42, hw * 0.35, z + 0.06), (0, 0, math.radians(80)), rnd)
        P.sack(bpy, 'rice_b', sackm, (0.34, 0.2, 0.12), (x0 + 0.44, hw * 0.3, z + 0.17), (0, math.radians(-8), math.radians(95)), rnd)
        P.cyl(bpy, 'jug', jug, 0.12, 0.36, (x1 - 0.14, -hw * 0.3, z + 0.18), verts=14)
        P.cyl(bpy, 'jug_neck', jug, 0.04, 0.06, (x1 - 0.14, -hw * 0.3, z + 0.39), verts=8)
    elif load == 'meds':
        box_, latch, band, duf = m('box', 'clay_bone', 3), m('latch', 'tape_grey', 1), m('bandage', 'clay_bone', 4), m('duffel', 'cloth_black', 2)
        P.box(bpy, 'tackle', box_, (0.42, 0.22, 0.18), (x0 + 0.26, 0, z + 0.09), rot=(0, 0, math.radians(6)), bevel=0.01)
        P.box(bpy, 'tackle_handle', latch, (0.16, 0.03, 0.03), (x0 + 0.26, 0, z + 0.195))
        P.box(bpy, 'tackle_stripe', m('stripe', 'clay_rust', 2), (0.42, 0.225, 0.03), (x0 + 0.26, 0, z + 0.12), rot=(0, 0, math.radians(6)))
        for i in range(3): P.cyl(bpy, 'roll_%d' % i, band, 0.045, 0.1, (x1 - 0.16 - i * 0.07, hw * 0.45, z + 0.045), rot=(math.pi / 2, 0, 0), verts=10)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(x1 - 0.2, -hw * 0.3, z + 0.12), segments=12, ring_count=8)
        d = P.put(bpy, bpy.context.active_object, 'duffel', duf); d.scale = (1.4, 0.75, 0.7)
    elif load == 'tape':
        tape, tool, door = m('tape', 'tape_grey', 2), m('toolbox', 'clay_rust', 2), m('door', 'clay_teal', 2)
        for i in range(6):
            P.cyl(bpy, 'tape_%d' % i, tape, 0.06, 0.05, (x0 + 0.14 + (i % 3) * 0.13, -hw * 0.45 + (i // 3) * 0.13, z + 0.025 + (i // 3) * 0.0), verts=12)
        P.cyl(bpy, 'tape_top', tape, 0.06, 0.05, (x0 + 0.2, -hw * 0.38, z + 0.075), verts=12)
        P.box(bpy, 'toolbox', tool, (0.44, 0.2, 0.2), (x1 - 0.26, hw * 0.35, z + 0.1), bevel=0.008)
        P.box(bpy, 'toolbox_lid', m('lid', 'clay_rust', 1), (0.44, 0.2, 0.03), (x1 - 0.26, hw * 0.35, z + 0.215))
        P.box(bpy, 'door_skin', door, (0.6, 0.02, 0.4), (0.0, -hw - 0.02, z + 0.22), rot=(math.radians(-14), 0, 0), bevel=0.006)
    elif load == 'rounds':
        can, lid, card = m('can', 'metal_painted', 1), m('can_lid', 'metal_painted', 2), m('case', 'clay_mustard', 2)
        for i, (x, y) in enumerate(((x0 + 0.18, -hw * 0.4), (x0 + 0.18, hw * 0.4))):
            P.box(bpy, 'can_%d' % i, can, (0.28, 0.14, 0.18), (x, y, z + 0.09), rot=(0, 0, math.radians(90 + 4 * i)), bevel=0.008)
            P.box(bpy, 'can_lid_%d' % i, lid, (0.29, 0.15, 0.02), (x, y, z + 0.19), rot=(0, 0, math.radians(90 + 4 * i)))
        P.box(bpy, 'case', card, (0.36, 0.28, 0.22), (x1 - 0.22, 0, z + 0.11), rot=(0, 0, math.radians(-7)), bevel=0.004)
        P.box(bpy, 'case_tape', m('case_tape', 'tape_masking', 2), (0.37, 0.06, 0.225), (x1 - 0.22, 0, z + 0.112), rot=(0, 0, math.radians(-7)))
    elif load == 'gear':
        duf, card, tarp = m('duffel', 'cloth_black', 1), m('box', 'clay_mustard', 2), m('tarp', 'tape_grey', 1)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.17, location=(x0 + 0.24, 0, z + 0.13), segments=12, ring_count=8)
        d = P.put(bpy, bpy.context.active_object, 'duffel', duf); d.scale = (1.5, 0.85, 0.75)
        P.box(bpy, 'box', card, (0.3, 0.26, 0.24), (x1 - 0.2, -hw * 0.2, z + 0.12), rot=(0, 0, math.radians(11)), bevel=0.004)
        P.cyl(bpy, 'tarp', tarp, 0.08, 0.5, (x1 - 0.2, hw * 0.5, z + 0.32), rot=(math.pi / 2, 0, math.radians(8)), verts=12)
    return [o for o in sc.objects if o.name not in before and o.type == 'MESH']


# ------------------------------------------------------------------------------------------------ the render (bpy)
def render(kinds):
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    from bpy_extras.object_utils import world_to_camera_view
    os.makedirs(RAW, exist_ok=True)
    zs = 1.0 / math.cos(math.radians(TILT))
    meta = json.load(open(os.path.join(RAW, 'meta.json'))) if os.path.exists(os.path.join(RAW, 'meta.json')) else {}
    for kind in kinds:
        for load in (ONLY_L or LOADS):
            bpy.ops.wm.read_factory_settings(use_empty=True)
            sc = bpy.context.scene
            cart, parts, fr = build_cart(bpy, mathutils, kind)
            lp = build_load(bpy, mathutils, kind, load, fr['floor'])
            for o in lp: o.parent = cart
            things = parts + lp
            MR.source_pass(things, float(MR.G['wear']), 1.0, 0)
            # the cart in the man's frame: its front the way he faces (-Y), its handle 0.3 m before his middle, to his left
            place = bpy.data.objects.new('place', None); sc.collection.objects.link(place)
            turn = bpy.data.objects.new('turn', None); sc.collection.objects.link(turn)
            stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, zs)
            turn.parent = stretch; place.parent = turn; cart.parent = place
            place.rotation_euler = (0, 0, math.radians(-90))                   # its +X (front) to his -Y
            place.location = (CART_X, HANDLE_Y + fr['handle_x'], 0)            # its handle (at x = handle_x) lands at y = HANDLE_Y
            # the camera: the fight sheet's (ortho, 57 px a metre, 45 degrees down, facing north, never turned)
            cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = RES / PPM
            cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
            t = math.radians(TILT); cam.rotation_euler = (t, 0, 0)
            look = mathutils.Vector((0, 0, LOOK_Z)); dv = mathutils.Vector((0, math.sin(t), -math.cos(t)))
            cam.location = look - dv * 30; sc.render.resolution_x = sc.render.resolution_y = RES
            MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
            sc.cycles.samples = SAMPLES; sc.render.film_transparent = True
            # the ground that takes its shadow, and the half-space behind his middle (the FRONT layer's holdout)
            bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); ground = bpy.context.active_object; ground.name = 'ground'; ground.is_shadow_catcher = True
            bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 10, 0)); hold = bpy.context.active_object; hold.name = 'behind'; hold.scale = (20, 20, 20); hold.is_holdout = True
            bpy.context.view_layer.update()
            o0 = world_to_camera_view(sc, cam, mathutils.Vector((0, 0, 0)))
            meta['origin_px'] = [o0.x * RES, (1 - o0.y) * RES]
            meta.setdefault('frames', {})[kind] = fr

            def shot(name, show_cart, show_ground, show_hold):
                for o in things: o.visible_camera = show_cart
                ground.hide_render = not show_ground; hold.hide_render = not show_hold
                sc.render.filepath = os.path.join(RAW, name); bpy.ops.render.render(write_still=True)
            keep = {o.name: (o.parent, o.location.copy(), o.rotation_euler.copy(), o.matrix_parent_inverse.copy()) for o in lp}
            for fi, f in enumerate(FACINGS):
                if ONLY_F and f not in ONLY_F: continue
                turn.rotation_euler = (0, 0, math.radians(180 - 45 * fi))
                cart.rotation_euler = (0, 0, 0); cart.location = (0, 0, 0)
                for o in lp:
                    par, loc, rot, inv = keep[o.name]; o.parent = par; o.matrix_parent_inverse = inv; o.location = loc; o.rotation_euler = rot
                bpy.context.view_layer.update()
                tag = '%s_%s_%s' % (kind, load, f)
                shot('cart_%s.png' % tag, True, False, False)
                if ONLY_CART: continue
                shot('front_%s.png' % tag, True, False, True)
                shot('shadow_%s.png' % tag, False, True, False)
                # TIP: the cart over on its left side, its open top to his left, what it held spilled out of it on the ground
                cart.rotation_euler = (math.radians(-88), 0, 0)
                for j, o in enumerate(lp):
                    o.parent = place; o.matrix_parent_inverse = mathutils.Matrix()
                    o.location = (fr['floor'][1] + 0.1 + 0.2 * (j % 4), 1.0 + 0.16 * (j % 3), 0.07)
                    o.rotation_euler = (math.radians(75 * (j % 2)), math.radians(17 * j), math.radians(41 * j))
                bpy.context.view_layer.update()
                lo = min((o.matrix_world @ mathutils.Vector(c)).z for o in parts for c in o.bound_box)
                cart.location = (0, 0, -lo / zs)
                bpy.context.view_layer.update()
                shot('tip_%s.png' % tag, True, False, False)
                shot('tipshadow_%s.png' % tag, False, True, False)
            print('CART', kind, load, flush=True)
    meta.update(dict(res=RES, ppm=PPM, tilt=TILT, look_z=LOOK_Z, handle_y=HANDLE_Y, cart_x=CART_X, samples=SAMPLES, facings=FACINGS))
    json.dump(meta, open(os.path.join(RAW, 'meta.json'), 'w'), indent=1)


# ------------------------------------------------------------------------------------------------ the pack (plain python3)
def ring(a, op, k=8):
    """the master rig's ring (post()): each edge pixel its own colour k values darker, moved to the nearest colour inside"""
    import numpy as np
    p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    rg = op & ~inner
    if rg.any() and inner.any():
        want = np.clip(a[..., :3][rg] - k, 0, 255); pal = np.unique(a[..., :3][inner].reshape(-1, 3), axis=0)
        best = np.empty_like(want)
        for i in range(0, len(want), 256):
            d = ((want[i:i + 256, None, :] - pal[None, :, :]) ** 2).sum(2); best[i:i + 256] = pal[d.argmin(1)]
        a[..., :3][rg] = best
    return a


def layers(kind, load, f):
    """(back, front, tip) RGBA arrays on the render's canvas"""
    import numpy as np
    from PIL import Image
    rd = lambda n: np.asarray(Image.open(os.path.join(RAW, '%s_%s_%s_%s.png' % (n, kind, load, f))).convert('RGBA')).astype(float)
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    thr, smax = G['alpha_threshold'], float(G['shadow_alpha_max'])
    def body(n):
        a = rd(n); op = a[..., 3] > thr; a[..., 3] = np.where(op, 255, 0); a[..., :3] = np.round(a[..., :3]); return ring(a, op, int(G['ring'])), op
    def shade(n, op):
        s = rd(n); al = np.clip(s[..., 3] / 255.0, 0, 1)   # the catcher's own darkness, capped at the guide's
        al = np.minimum(al * smax / 0.6, smax); al[op] = 0; al[al < 0.03] = 0
        o = np.zeros_like(s); o[..., 3] = np.round(al * 255); return o
    cart, op = body('cart'); front_op = rd('front')[..., 3] > thr
    sh = shade('shadow', op)
    back = sh.copy(); back[op] = cart[op]
    front = np.zeros_like(cart); fo = op & front_op; front[fo] = cart[fo]
    tip, top = body('tip'); tsh = shade('tipshadow', top); tipl = tsh.copy(); tipl[top] = tip[top]
    return back, front if fo.any() else None, tipl


def quant(cells, n=64):
    """the sheet's colours: the opaque pixels' to n (the fight sheets' 64 a sheet), the shadow's black kept"""
    import numpy as np
    from PIL import Image
    ops = [c[c[..., 3] == 255][:, :3] for c in cells if c is not None]
    allp = np.concatenate(ops).astype(np.uint8)
    pal_im = Image.fromarray(allp.reshape(1, -1, 3), 'RGB').quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal = np.array(pal_im.getpalette()[:n * 3]).reshape(-1, 3).astype(float)
    out = []
    for c in cells:
        if c is None: out.append(None); continue
        c = c.copy(); m = c[..., 3] == 255
        if m.any():
            px = c[..., :3][m]; best = np.empty_like(px)
            for i in range(0, len(px), 512):
                d = ((px[i:i + 512, None, :] - pal[None]) ** 2).sum(2); best[i:i + 512] = pal[d.argmin(1)]
            c[..., :3][m] = best
        out.append(c)
    return out


def pack():
    import numpy as np
    from PIL import Image
    meta = json.load(open(os.path.join(RAW, 'meta.json')))
    ox, oy = meta['origin_px']
    index = dict(version='staff-carts-11-22', lane='STAFF 2', rule='471', foot=FOOT, ppm=PPM, tilt=TILT,
                 source='tools/bohemia_staff_the_cart.py (COOK\'s shopping cart, the props modeller\'s materials, the master rig\'s wear, light and frame)',
                 how='a cell is [x, y, w, h, dx, dy] on its kind\'s sheet; dx, dy from the top left of a man\'s 144 x 161 fight cell whose foot is foot; '
                     'back under him (the cart and its shadow), front over him (what stands nearer the camera than his middle), tip under a man who fell',
                 place=dict(handle_y_m=HANDLE_Y, cart_x_m=CART_X, note='his frame: he faces -Y, his left +X; the handle before his middle, the cart to his left'),
                 frames=meta.get('frames', {}), kinds={})
    for kind in KINDS:
        cells, keys = [], []
        for load in LOADS:
            for f in FACINGS:
                b, fr, t = layers(kind, load, f)
                for nm, arr in (('back', b), ('front', fr), ('tip', t)): cells.append(arr); keys.append((load, f, nm))
        cells = quant(cells)
        crops = []
        for arr in cells:
            if arr is None: crops.append(None); continue
            ys, xs = np.nonzero(arr[..., 3] > 0)
            if not len(ys): crops.append(None); continue
            x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
            crops.append((arr[y0:y1, x0:x1], int(round(x0 - ox + FOOT[0])), int(round(y0 - oy + FOOT[1]))))
        # shelves, tallest first, 2048 wide
        order = sorted([i for i, c in enumerate(crops) if c], key=lambda i: -crops[i][0].shape[0])
        W, x, y, sh, at = 2048, 0, 0, 0, {}
        for i in order:
            h, w = crops[i][0].shape[:2]
            if x + w > W: x, y, sh = 0, y + sh + 1, 0
            at[i] = (x, y); x += w + 1; sh = max(sh, h)
        H = y + sh
        sheet = np.zeros((H, W, 4), np.uint8)
        K = index['kinds'][kind] = dict(file='staff_cart_%s.webp' % kind, cells={})
        for i, (load, f, nm) in enumerate(keys):
            c = crops[i]
            slot = K['cells'].setdefault(load, {}).setdefault(f, {})
            if not c: slot[nm] = None; continue
            px, py = at[i]; h, w = c[0].shape[:2]
            sheet[py:py + h, px:px + w] = c[0].astype(np.uint8)
            slot[nm] = [int(px), int(py), int(w), int(h), c[1], c[2]]
        Image.fromarray(sheet, 'RGBA').save(os.path.join(OUT, K['file']), 'WEBP', lossless=True, quality=100, method=6)
        print('PACKED', kind, W, H, os.path.getsize(os.path.join(OUT, K['file'])), 'bytes', flush=True)
    json.dump(index, open(os.path.join(OUT, 'staff_carts.json'), 'w'), separators=(',', ':'))


def sheet():
    """the twins: every cart, every facing, laid on three camp people's own fight cells at the fight's pixels, 2x"""
    import numpy as np
    from PIL import Image, ImageDraw
    I = json.load(open(os.path.join(OUT, 'staff_carts.json'))); R = json.load(open(os.path.join(OUT, 'fight_rig.json')))
    who = [('person_woman_0', 'food', 'shopping_cart'), ('person_town_44', 'meds', 'utility_cart'), ('person_town_23', 'tape', 'wagon')]
    cw, ch, fx, fy = 250, 230, 105, 150   # room round the man's cell for the wagon's tongue and the shadow; his foot at (fx, fy)
    out = Image.new('RGBA', (cw * 8, ch * len(who)), (58, 54, 48, 255))
    for r, (look, load, kind) in enumerate(who):
        L = R['looks'][look]; body = Image.open(os.path.join(OUT, L['file'])).convert('RGBA')
        sh = Image.open(os.path.join(OUT, I['kinds'][kind]['file'])).convert('RGBA')
        for c, d in enumerate(DIR8):
            cell = body.crop((0, c * L['h'], L['w'], (c + 1) * L['h']))
            canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
            q = I['kinds'][kind]['cells'][load][d]
            ox, oy = fx - L['foot'][0], fy - L['foot'][1]   # the man's cell's top left on this canvas
            def lay(k):
                g = q.get(k)
                if g: canvas.alpha_composite(sh.crop((g[0], g[1], g[0] + g[2], g[1] + g[3])), (ox + g[4], oy + g[5]))
            lay('back'); canvas.alpha_composite(cell, (ox, oy)); lay('front')
            out.alpha_composite(canvas, (c * cw, r * ch))
    out = out.resize((out.width * 2, out.height * 2), Image.NEAREST)
    d = os.path.join(ROOT, 'records/target/staff_cart'); os.makedirs(d, exist_ok=True)
    out.save(os.path.join(d, 'the_carts_on_the_camp.png')); print('SHEET', os.path.join(d, 'the_carts_on_the_camp.png'))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(0)
    if '--loads' in a: ONLY_L = a[a.index('--loads') + 1].split(','); del a[a.index('--loads'):a.index('--loads') + 2]
    if '--facings' in a: ONLY_F = a[a.index('--facings') + 1].split(','); del a[a.index('--facings'):a.index('--facings') + 2]
    if '--cart-only' in a: ONLY_CART = True; a.remove('--cart-only')
    if a[0] == 'render': render(a[1:] or KINDS)
    elif a[0] == 'pack': pack()
    elif a[0] == 'sheet': sheet()
    else: print(__doc__)
