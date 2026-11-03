#!/usr/bin/env python3
"""BOHEMIA -- ARENA, piece (a): THE PIT, the Mob's arena on its town screen (VAMILY rule 375, ask lines 402 and 403; Paolo 11/3).

HIS WORDS: 'they host an arena with exotic DNA lab shits'; AMENDED THE SAME ROUND: 'the mob, they're [held together] by fucking duct
tape and a thread... are they able to get this operational? Like they're barely able to.' So nothing here is slick: a hotel pool
drained to its tiles and turned into a pit, a ring of the dead casino's velvet-rope stands taped where they broke, two light poles
with a sagging string of bulbs (most of them dead), a PA horn, a breaker panel on the pole held shut with a belt, a generator
they cannot always feed, two patched cages for the clones, a row of mismatched casino chairs for a small crowd, a plywood sign
painted by hand. Analog horror at the source: the old water line still on the tiles, a dark stain the hose never got out, sand
drifted in the deep end, a pool ladder bent outward by something that climbed it.

HOW IT IS BUILT (the town screens' way, never a pack tile: rules 82a, 115, 121(l), 123): one scene in metres through the
master rig (tools/bohemia_direction_master_rig.py): the same camera as the towns (orthographic, tilted 45 degrees, facing
north, heights x 1.414, 42.9 px a metre: tools/bohemia_cook_the_settlements_through_the_rig_10_20_26.py), the rig's one sun
and sky fill, its source pass and dent pass on every mesh, DIRECTION's palette roles for every material (the props
modeller's mat()). The ground round the pit is a shadow catcher, so the piece is a transparent picture that lays over any
town's ground with its own shadows; the town screen draws it over the Mob's picture where that picture already sinks a
drained plaza (slices/arena/arena_town.json, the place per composition). NIGHT is the same scene under the towns' moon with
the three bulbs that still work and the crowd's lighters lit.

  <venv>/bin/python tools/bohemia_arena_the_pit.py [--quick]
  -> records/target/arena/render/pit_day.png, pit_night.png
  -> slices/arena/pit_day.webp, slices/arena/pit_night.webp, slices/arena/pit.json (the anchor and the footprint in its pixels)

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' arena (bb_all/0620: a smaller map in front of a crowd); the real
thing: the Strip's hotel pools (the Flamingo's, the Tropicana's) drained since the water stopped, the casino showrooms' velvet
rope stanchions; the Mob's own town picture beside it (its plaza is already a drained basin). No reference game added.
REUSE CHECK (REUSE-FIRST): the master rig's camera, light, source and dent passes; the props modeller's mat, box, rod, cyl;
the towns' camera numbers. Nothing in banks/ is a 3D model.
TASTE CHECK: his 'barely able to'; never drained of colour (167(b)): the tiles keep their faded aqua.
"""
import os, sys, json, math, random
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_direction_master_rig as RIG
import bohemia_cook_model_props as P

PPM = 515 / 12.0                     # the towns' ruler: 42.9 px a metre
TILT = float(RIG.G['tilt_deg'])      # 45
ZS = 1.0 / math.cos(math.radians(TILT))
C = math.cos(math.radians(TILT))
X0, X1 = -4.65, 4.85                  # the picture's ground, metres
V0, V1 = -2.3, 5.4                   # the picture's height on the screen in metres of 'up' (0.707 y + z)
W = int(round((X1 - X0) * PPM)); H = int(round((V1 - V0) * PPM))
PX, PY = 3.0, 1.7                    # the pool's inside, half sizes: 6.0 m x 3.4 m
SHALLOW, DEEP = -1.0, -1.9
OUT = os.path.join(R, 'records/target/arena/render')
SHIP = os.path.join(R, 'slices/arena')


def to_px(x, y, z=0.0):
    return ((x - X0) * PPM, (V1 - (C * y + z)) * PPM)


def floor_z(x):
    return SHALLOW + (DEEP - SHALLOW) * (x + PX) / (2 * PX)


def mesh(bpy, name, verts, faces, m):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m)
    return o


def tiles(bpy, name, base_hex, grout_hex, scale=6.0):
    """the pool's tile: a brick node at 15 cm squares, faded aqua, the grout grey; the rig's passes put the wear on"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0.0; br.squash = 1.0
    br.inputs['Color1'].default_value = P.lin(base_hex); br.inputs['Color2'].default_value = P.lin(base_hex)
    br.inputs['Mortar'].default_value = P.lin(grout_hex); br.inputs['Scale'].default_value = scale
    br.inputs['Mortar Size'].default_value = 0.035; br.inputs['Brick Width'].default_value = 0.25; br.inputs['Row Height'].default_value = 0.25
    tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    m['palette_role'] = 'clay_teal'; m['palette_step'] = 3
    return m


def grime(bpy, name, a_hex, b_hex, scale=1.6, detail=6.0):
    """a floor that is two palette colours by a noise: the stain is in the concrete, not over the picture"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = detail
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.42; ramp.color_ramp.elements[1].position = 0.62
    ramp.color_ramp.elements[0].color = P.lin(a_hex); ramp.color_ramp.elements[1].color = P.lin(b_hex)
    nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    return m


def sign_texture(path):
    """THE PIT, painted by hand on plywood: white house paint, one coat, the brush running out, the drips; the old casino's
    'SHOWROOM' still under it where the plywood was cut from a crate"""
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    w, h = 512, 256
    rnd = random.Random(375)
    im = Image.new('RGB', (w, h), (150, 118, 80)); d = ImageDraw.Draw(im)
    for i in range(0, h, 3):                                         # the grain of the ply
        v = 140 + int(18 * math.sin(i * 0.31) + rnd.uniform(-8, 8))
        d.line([(0, i), (w, i + rnd.randint(-3, 3))], fill=(v, int(v * 0.8), int(v * 0.55)), width=2)
    fonts = [os.path.join(R, 'slices/fonts', f) for f in sorted(os.listdir(os.path.join(R, 'slices/fonts')))] if os.path.isdir(os.path.join(R, 'slices/fonts')) else []
    fpath = next((f for f in fonts if f.lower().endswith(('.ttf', '.otf')) and 'bold' in f.lower()), None) or next((f for f in fonts if f.lower().endswith(('.ttf', '.otf'))), None)
    size = 150
    try:
        big = ImageFont.truetype(fpath, size)
        while size > 40 and big.getbbox('THE PIT')[2] > w - 70: size -= 6; big = ImageFont.truetype(fpath, size)
    except Exception: big = ImageFont.load_default()
    try: small = ImageFont.truetype(fpath, 34) if fpath else ImageFont.load_default()
    except Exception: small = ImageFont.load_default()
    d.text((30, 196), 'SHOWROOM  B', fill=(96, 70, 44), font=small)
    lay = Image.new('L', (w, h), 0); dl = ImageDraw.Draw(lay)
    bb = big.getbbox('THE PIT'); dl.text(((w - bb[2]) / 2, (h - bb[3]) / 2 - 18), 'THE PIT', fill=255, font=big)
    lay = lay.rotate(-3, resample=Image.BICUBIC, center=(w / 2, h / 2))
    arr = np.array(lay).astype(np.float32) / 255
    rows = np.linspace(0.0, 1.0, w)[None, :]                         # the brush running dry toward the T
    dry = (np.random.RandomState(375).rand(h, w) < (0.12 + 0.35 * rows)).astype(np.float32)
    arr = arr * (1 - 0.8 * dry)
    for x in range(60, 470, 23):                                     # the drips under the letters
        ys = np.nonzero(arr[:, x] > 0.5)[0]
        if len(ys) and rnd.random() < 0.55:
            y0 = ys.max(); ln = rnd.randint(8, 34); arr[y0:min(h, y0 + ln), max(0, x - 1):x + 2] = 0.85
    paint = np.array(im).astype(np.float32); white = np.array([226, 220, 204], np.float32)
    out = paint * (1 - arr[..., None]) + white * arr[..., None]
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).filter(ImageFilter.SMOOTH).save(path)
    return path


def image_mat(bpy, name, path):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); tx.interpolation = 'Closest'
    nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
    return m


def build(bpy, rnd, night):
    sc = bpy.context.scene
    made = []
    def keep(o):
        made.append(o); return o
    # ---- materials (DIRECTION's palette roles through the props modeller) ----
    coping = P.mat(bpy, 'coping', 'tape_grey', 3)
    wall = tiles(bpy, 'pool_tile', '#7ea499', '#a4a39b', 6.66)
    trim = tiles(bpy, 'trim_tile', '#304544', '#666360', 6.66)
    floor_m = grime(bpy, 'pool_floor', '#3e3c3a', '#304544', 1.1)
    sand = P.mat(bpy, 'sand', 'clay_bone', 2)
    stain = P.mat(bpy, 'stain', 'blood', 0)
    brass = P.mat(bpy, 'stand_brass', 'clay_mustard', 1)
    rope = P.mat(bpy, 'velvet', 'clay_rust', 1)
    tape = P.mat(bpy, 'duct_tape', 'tape_grey', 2)
    steel = P.mat(bpy, 'steel', 'metal_painted', 1)
    rust = P.mat(bpy, 'rust', 'clay_rust', 2)
    wire = P.mat(bpy, 'wire', 'tape_grey', 0)
    ply = P.mat(bpy, 'ply', 'tape_masking', 2)
    tarp = P.mat(bpy, 'tarp', 'clay_teal', 1)
    rubber = P.mat(bpy, 'tyre', 'rubber', 1)
    chair_a = P.mat(bpy, 'chair_red', 'clay_rust', 2)
    chair_b = P.mat(bpy, 'chair_gold', 'clay_mustard', 2)
    chair_leg = P.mat(bpy, 'chair_leg', 'chrome', 0)
    gen_m = P.mat(bpy, 'generator', 'clay_mustard', 1)
    panel_m = P.mat(bpy, 'panel', 'metal_painted', 2)
    belt_m = P.mat(bpy, 'belt', 'cloth_black', 3)
    glass_dead = P.mat(bpy, 'bulb_dead', 'tape_grey', 1)
    glass_live = P.mat(bpy, 'bulb_live', 'sodium', 4, glow=(4.0 if night else 0.6))
    lighter = P.mat(bpy, 'lighter', 'sodium', 4, glow=(6.0 if night else 0.0))
    sign_m = image_mat(bpy, 'sign_paint', sign_texture(os.path.join(OUT, 'pit_sign.png')))
    board_m = P.mat(bpy, 'scoreboard', 'cloth_black', 1)
    digit_m = P.mat(bpy, 'digits', 'blood', 1, glow=(5.0 if night else 1.2))

    # ---- THE POOL: floor sloping to the deep end, four tiled walls, the dark trim row, the coping ----
    nx, ny = 24, 14
    vs, fs = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = -PX + 2 * PX * i / nx; y = -PY + 2 * PY * j / ny
            vs.append((x, y, floor_z(x) + rnd.uniform(-0.012, 0.012)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i; fs.append((a, a + 1, a + nx + 2, a + nx + 1))
    keep(mesh(bpy, 'pool_floor', vs, fs, floor_m))
    TR = 0.16                                                        # the dark trim row under the coping
    for side in ('n', 's', 'w', 'e'):
        k = 20
        if side in ('n', 's'):
            yy = PY if side == 'n' else -PY
            xs = [-PX + 2 * PX * i / k for i in range(k + 1)]
            top = [(x, yy, -TR) for x in xs]; bot = [(x, yy, floor_z(x)) for x in xs]
            ttop = [(x, yy, 0.0) for x in xs]
        else:
            xx = -PX if side == 'w' else PX
            ys = [-PY + 2 * PY * i / k for i in range(k + 1)]
            top = [(xx, y, -TR) for y in ys]; bot = [(xx, y, floor_z(xx)) for y in ys]
            ttop = [(xx, y, 0.0) for y in ys]
        vv = top + bot; ff = [(i, i + 1, k + 2 + i, k + 1 + i) for i in range(k)]
        keep(mesh(bpy, 'wall_' + side, vv, ff, wall))
        vt = ttop + top; keep(mesh(bpy, 'trim_' + side, vt, ff, trim))
    # the old water line: a dark band 0.35 m under the trim on the far wall and the sides, where the water stood for years
    line = P.mat(bpy, 'waterline', 'clay_teal', 0)
    for (a, b) in (((-PX, PY - 0.004), (PX, PY - 0.004)), ((-PX + 0.004, -PY), (-PX + 0.004, PY)), ((PX - 0.004, -PY), (PX - 0.004, PY))):
        n = 16; pts = [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n) for i in range(n + 1)]
        top = [(x, y, -0.42 + 0.03 * math.sin(i * 1.7)) for i, (x, y) in enumerate(pts)]
        bot = [(x, y, -0.52 + 0.04 * math.sin(i * 2.3)) for i, (x, y) in enumerate(pts)]
        keep(mesh(bpy, 'waterline', top + bot, [(i, i + 1, n + 2 + i, n + 1 + i) for i in range(n)], line))
    CW = 0.32                                                        # the coping: concrete, a lip, chipped
    for (cx, cy, sx, sy) in ((0, PY + CW / 2, 2 * PX + 2 * CW, CW), (0, -PY - CW / 2, 2 * PX + 2 * CW, CW),
                             (-PX - CW / 2, 0, CW, 2 * PY), (PX + CW / 2, 0, CW, 2 * PY)):
        keep(P.box(bpy, 'coping', coping, (sx, sy, 0.09), (cx, cy, 0.045), bevel=0.02))
    # the deep end's drain, the sand drifted in, the stain nobody got out, a tyre, a chair the last crowd threw
    keep(P.box(bpy, 'drain', P.mat(bpy, 'drain', 'rubber', 0), (0.42, 0.42, 0.02), (PX - 0.9, 0.1, floor_z(PX - 0.9) + 0.01)))
    for k in range(5):
        x = PX - 0.35 - rnd.uniform(0, 1.2); y = rnd.uniform(-PY + 0.4, PY - 0.4)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=(x, y, floor_z(x) - 0.02), segments=12, ring_count=6)
        o = bpy.context.active_object; o.scale = (rnd.uniform(0.35, 0.7), rnd.uniform(0.3, 0.6), 0.07); P.put(bpy, o, 'sand', sand); keep(o)
    for k, (x, y, r) in enumerate(((-0.6, -0.2, 0.55), (0.4, 0.5, 0.35), (1.2, -0.7, 0.28))):
        keep(P.blotch(bpy, 'stain_%d' % k, stain, r, (x, y, floor_z(x) + 0.006), (0, 0, rnd.uniform(0, 3)), 375 + k))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.32, minor_radius=0.11, location=(-2.1, 1.0, floor_z(-2.1) + 0.11), rotation=(0, 0, 0))
    P.put(bpy, bpy.context.active_object, 'tyre', rubber); keep(bpy.context.active_object)
    keep(P.box(bpy, 'thrown_seat', chair_a, (0.45, 0.42, 0.1), (1.9, -1.1, floor_z(1.9) + 0.06), rot=(0.4, 0.2, 0.9)))

    # ---- THE LADDER on the far wall, bent outward by something that climbed it ----
    for dx in (-0.25, 0.25):
        x = -1.6 + dx
        pts = [(x, PY + 0.25, 0.08), (x, PY + 0.05, 0.55), (x, PY - 0.12, 0.3), (x + 0.03 * (1 if dx > 0 else -1), PY - 0.22, -0.6), (x + 0.12 * (1 if dx > 0 else -1), PY - 0.32, -1.2)]
        for a, b in zip(pts[:-1], pts[1:]): keep(P.rod(bpy, 'ladder', chair_leg, a, b, 0.024))
    for z in (-0.4, -0.85): keep(P.rod(bpy, 'rung', chair_leg, (-1.85, PY - 0.2 - (0.03 if z < -0.5 else 0), z), (-1.35, PY - 0.2, z), 0.02))

    # ---- THE RING: the dead casino's velvet-rope stands round the pool, the rope broken and taped ----
    ring = []
    RY0, RY1, RX = -PY - 0.75, PY + 0.62, PX + 0.7
    for i in range(7): ring.append((-RX + 2 * RX * i / 6, RY0))
    for i in range(1, 3): ring.append((RX, RY0 + (RY1 - RY0) * i / 3))
    for i in range(1, 3): ring.append((-RX, RY0 + (RY1 - RY0) * i / 3))
    for k, (x, y) in enumerate(ring):
        if k == 3: continue                                          # one stand is gone: the gap is the way in
        lean = rnd.uniform(-0.08, 0.08)
        keep(P.cyl(bpy, 'stand_base', brass, 0.16, 0.05, (x, y, 0.025), verts=14))
        keep(P.rod(bpy, 'stand_post', brass, (x, y, 0.05), (x + lean, y, 0.95), 0.025))
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(x + lean, y, 0.98), segments=10, ring_count=6)
        P.put(bpy, bpy.context.active_object, 'stand_cap', brass); keep(bpy.context.active_object)
    front = [p for k, p in enumerate(ring[:7]) if k != 3]
    def sag(a, b, z=0.88, s=0.18, broken=False):
        n = 6; pts = [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, z - s * math.sin(math.pi * i / n)) for i in range(n + 1)]
        if broken: pts = pts[:4] + [(pts[3][0] + 0.05, pts[3][1] - 0.05, 0.12)]
        for p, q in zip(pts[:-1], pts[1:]): keep(P.rod(bpy, 'rope', rope, p, q, 0.028, verts=6))
        mid = pts[len(pts) // 2]
        keep(P.cyl(bpy, 'tape_wrap', tape, 0.045, 0.12, mid, rot=(0, math.pi / 2, 0), verts=8))
    for a, b in zip(front[:2], front[1:3]): sag(a, b)
    sag(front[3], front[4]); sag(front[4], front[5], broken=True)
    for side in (ring[7:9], ring[9:11]): sag(side[0], side[1])

    # ---- THE FAR DECK: a row of mismatched casino chairs for the small crowd, one lighter lit at night ----
    lights = []
    for k, x in enumerate((-3.4, -2.6, -0.9, -0.1, 0.8, 2.3)):
        m = chair_a if k % 3 else chair_b; y = PY + 1.05 + rnd.uniform(-0.08, 0.08); rot = rnd.uniform(-0.25, 0.25)
        keep(P.box(bpy, 'seat', m, (0.46, 0.44, 0.09), (x, y, 0.46), rot=(0, 0, rot), bevel=0.02))
        keep(P.box(bpy, 'back', m, (0.46, 0.08, 0.5), (x - 0.02 * rot, y + 0.22, 0.78), rot=(-0.12, 0, rot), bevel=0.02))
        for lx in (-0.18, 0.18):
            for ly in (-0.16, 0.16): keep(P.rod(bpy, 'leg', chair_leg, (x + lx, y + ly, 0), (x + lx, y + ly, 0.42), 0.014, verts=6))
        if k in (1, 4):
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(x + 0.1, y - 0.1, 1.05), segments=8, ring_count=4)
            P.put(bpy, bpy.context.active_object, 'lighter', lighter); keep(bpy.context.active_object); lights.append(((x + 0.1, y - 0.1, 1.05), 10, (1.0, 0.6, 0.25)))
    # ---- THE CAGES at the deep end: rebar boxes, chain-link patched with a tarp and a door of plywood ----
    for k, (x, y) in enumerate(((PX + 1.05, 1.05), (PX + 1.05, -0.3))):
        w, d, h = 0.9, 1.2, 1.15
        for (ex, ey) in ((-w / 2, -d / 2), (w / 2, -d / 2), (-w / 2, d / 2), (w / 2, d / 2)):
            keep(P.rod(bpy, 'cage_post', rust, (x + ex, y + ey, 0), (x + ex, y + ey, h), 0.03, verts=6))
        for z in (0.05, h):
            for (a, b) in (((-w / 2, -d / 2), (w / 2, -d / 2)), ((w / 2, -d / 2), (w / 2, d / 2)), ((w / 2, d / 2), (-w / 2, d / 2)), ((-w / 2, d / 2), (-w / 2, -d / 2))):
                keep(P.rod(bpy, 'cage_rail', rust, (x + a[0], y + a[1], z), (x + b[0], y + b[1], z), 0.025, verts=6))
        for i in range(1, 6):                                        # the bars on the side that faces the pit
            yy = y - d / 2 + d * i / 6
            keep(P.rod(bpy, 'bar', rust, (x - w / 2, yy, 0.05), (x - w / 2, yy, h), 0.012, verts=5))
        for i in range(1, 5):                                        # the roof is rebar, a sheet of ply thrown on half of it
            xx = x - w / 2 + w * i / 5
            keep(P.rod(bpy, 'roof_bar', rust, (xx, y - d / 2, h), (xx, y + d / 2, h), 0.014, verts=5))
        keep(P.box(bpy, 'cage_floor', P.mat(bpy, 'cage_dark', 'rubber', 0), (w, d, 0.02), (x, y, 0.01)))
        keep(P.box(bpy, 'cage_roof', ply, (w * 0.55, d * 0.6, 0.025), (x + 0.12, y + d * 0.18, h + 0.03), rot=(0.05, -0.06, 0.1)))
        if k == 0: keep(P.box(bpy, 'tarp_patch', tarp, (0.02, d * 0.55, h * 0.6), (x + w / 2 + 0.01, y + 0.1, h * 0.5), rot=(0.05, 0, 0.02)))
        else: keep(P.box(bpy, 'ply_patch', ply, (w * 0.7, 0.02, h * 0.5), (x, y - d / 2 - 0.01, h * 0.35), rot=(0, 0.06, 0)))
    # ---- THE GENERATOR they cannot always feed, a jerrycan, the cable to the poles ----
    gx, gy = PX + 1.0, -PY - 0.6
    keep(P.box(bpy, 'generator', gen_m, (0.9, 0.55, 0.55), (gx, gy, 0.3), bevel=0.03))
    keep(P.box(bpy, 'gen_frame', steel, (0.96, 0.6, 0.06), (gx, gy, 0.6)))
    keep(P.box(bpy, 'jerrycan', P.mat(bpy, 'jerry', 'clay_rust', 2), (0.18, 0.34, 0.42), (gx + 0.12, gy + 0.55, 0.21), rot=(0, 0, 0.3), bevel=0.02))
    # ---- THE TWO POLES, the string of bulbs across the pit (most of them dead), the PA horn, the breaker panel and its belt ----
    poles = [(-PX - 0.75, PY + 0.55), (PX + 0.55, PY + 0.55)]
    PH_ = 3.5
    for k, (x, y) in enumerate(poles):
        keep(P.cyl(bpy, 'pole', P.mat(bpy, 'pole_wood', 'clay_bone', 1), 0.09, PH_, (x, y, PH_ / 2), verts=10))
        keep(P.box(bpy, 'cross', steel, (0.5, 0.06, 0.06), (x, y, PH_ - 0.2)))
    hx, hy = poles[0]
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.2, radius2=0.05, depth=0.38, location=(hx + 0.2, hy - 0.12, PH_ - 0.05), rotation=(math.radians(70), 0, math.radians(-30)))
    P.put(bpy, bpy.context.active_object, 'pa_horn', P.mat(bpy, 'horn', 'tape_grey', 2)); keep(bpy.context.active_object)
    keep(P.box(bpy, 'breaker', panel_m, (0.42, 0.14, 0.55), (hx, hy - 0.14, 1.45), bevel=0.01))
    keep(P.box(bpy, 'breaker_door_gap', P.mat(bpy, 'gap', 'rubber', 0), (0.02, 0.15, 0.5), (hx + 0.14, hy - 0.14, 1.45)))
    for z in (1.3, 1.62):                                            # the belt that holds the door shut, round the pole
        keep(P.box(bpy, 'belt', belt_m, (0.5, 0.18, 0.05), (hx, hy - 0.1, z)))
    keep(P.box(bpy, 'buckle', chair_leg, (0.07, 0.03, 0.07), (hx + 0.18, hy - 0.22, 1.3)))
    keep(P.box(bpy, 'scoreboard', board_m, (0.95, 0.08, 0.5), (hx + 0.1, hy - 0.08, 2.45), bevel=0.01))
    for i, on in enumerate((1, 0, 1, 1, 0, 0, 1)):
        if on: keep(P.box(bpy, 'digit', digit_m, (0.08, 0.02, 0.22), (hx - 0.25 + i * 0.11, hy - 0.13, 2.45)))
    a, b = (poles[0][0] + 0.25, poles[0][1], PH_ - 0.2), (poles[1][0] - 0.25, poles[1][1], PH_ - 0.2)
    n = 12; pts = [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n - 0.9 * math.sin(math.pi * i / n), a[2] - 0.75 * math.sin(math.pi * i / n)) for i in range(n + 1)]
    for p, q in zip(pts[:-1], pts[1:]): keep(P.rod(bpy, 'bulb_wire', wire, p, q, 0.01, verts=5))
    live = {2, 7, 10}
    for i, p in enumerate(pts[1:-1], 1):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, location=(p[0], p[1], p[2] - 0.08), segments=10, ring_count=6)
        P.put(bpy, bpy.context.active_object, 'bulb', glass_live if i in live else glass_dead); keep(bpy.context.active_object)
        if i in live: lights.append(((p[0], p[1], p[2] - 0.15), 70, (1.0, 0.68, 0.32)))
    for i in range(6):                                              # the cable from the generator, along the ground and up the pole
        t0, t1 = i / 6, (i + 1) / 6
        A = (gx + (poles[1][0] - gx) * t0, gy + (poles[1][1] - 0.1 - gy) * t0, 0.02); Bq = (gx + (poles[1][0] - gx) * t1, gy + (poles[1][1] - 0.1 - gy) * t1, 0.02)
        keep(P.rod(bpy, 'cable', P.mat(bpy, 'cable', 'rubber', 0), A, Bq, 0.018, verts=5))
    # ---- THE SIGN, painted by hand on a sheet of ply, wired to the far deck's rail between two posts ----
    sx, sy = 1.55, PY + 1.55
    for dx in (-0.62, 0.62): keep(P.rod(bpy, 'sign_post', P.mat(bpy, 'post_wood', 'clay_bone', 1), (sx + dx, sy, 0), (sx + dx, sy, 1.6), 0.04, verts=6))
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(sx, sy - 0.04, 1.2), rotation=(math.radians(88), 0, math.radians(2)))
    o = bpy.context.active_object; o.scale = (1.36, 0.68, 1); bpy.ops.object.transform_apply(scale=True); P.put(bpy, o, 'sign', sign_m, smooth=False); keep(o)
    keep(P.box(bpy, 'sign_back', ply, (1.38, 0.03, 0.7), (sx, sy - 0.005, 1.2), rot=(math.radians(-2), 0, math.radians(2))))
    # ---- THE DECK: the hotel's pool deck, a raised slab of pavers the pit stands on (it hides whatever the town drew under it),
    #      cracked into four, one corner broken off and lying beside it ----
    LIFT = 0.12
    for o in made: o.location.z += LIFT
    pav = tiles(bpy, 'deck_pavers', '#a4a39b', '#666360', 1.6)
    DX0, DX1, DY0, DY1 = -4.3, 4.65, -2.75, 3.5
    slabs = ((DX0, DX1, PY, DY1), (DX0, DX1, DY0, -PY), (DX0, -PX, -PY, PY), (PX, DX1, -PY, PY))
    for k, (a0, a1, b0, b1) in enumerate(slabs):
        keep(P.box(bpy, 'deck', pav, (a1 - a0 - 0.03, b1 - b0 - 0.03, LIFT), ((a0 + a1) / 2, (b0 + b1) / 2, LIFT / 2), rot=(0, 0, rnd.uniform(-0.004, 0.004))))
    keep(P.box(bpy, 'deck_chunk', pav, (0.55, 0.42, LIFT * 0.8), (DX0 - 0.25, DY0 + 0.2, LIFT * 0.4), rot=(0.06, -0.04, 0.5)))
    # ---- THE GROUND: a shadow catcher with the pool cut out of it ----
    G0, G1 = (X0 - 1, -4.0), (X1 + 1, 6.0)
    gv = [(G0[0], G0[1], 0), (G1[0], G0[1], 0), (G1[0], G1[1], 0), (G0[0], G1[1], 0),
          (-PX, -PY, 0), (PX, -PY, 0), (PX, PY, 0), (-PX, PY, 0)]
    gf = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    gnd = mesh(bpy, 'catcher', gv, gf, P.mat(bpy, 'ground', 'tape_grey', 2)); gnd.is_shadow_catcher = True
    return made, gnd, lights


def render(quick=False):
    import bpy, mathutils
    rnd = random.Random(375)
    out = {}
    for night in (False, True):
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        made, gnd, lights = build(bpy, rnd if not night else random.Random(375), night)
        meshes = [o for o in made if o.type == 'MESH']
        RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, 3); RIG.dent_pass(meshes, 1.0)
        stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, ZS)
        for o in list(sc.objects):
            if o.parent is None and o is not stretch and o.type in ('MESH', 'EMPTY'): o.parent = stretch
        sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
        sc.render.film_transparent = True
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = W / PPM
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        t = math.radians(TILT); cam.rotation_euler = (t, 0, 0)
        vc = (V0 + V1) / 2                                           # the picture's middle, in metres of 'up'
        look = mathutils.Vector(((X0 + X1) / 2, vc / C, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
        cam.location = look - dvec * 60; cd.clip_end = 300
        sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 50 if quick else 100
        sc.cycles.samples = 8 if quick else 48; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
        sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
        for m in bpy.data.materials:
            if m.use_nodes:
                for nd in m.node_tree.nodes:
                    if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
        if night:                                                    # the towns' moon (the 10/25 tool's numbers), the live bulbs, the lighters
            sun.data.energy *= 0.045; sun.data.color = (0.55, 0.66, 1.0)
            bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value
            bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.08
            for (loc, e, col) in lights:
                L_ = bpy.data.lights.new('bulb', 'POINT'); L_.energy = e; L_.color = col; L_.shadow_soft_size = 0.08
                o = bpy.data.objects.new('bulb_light', L_); sc.collection.objects.link(o); o.location = (loc[0], loc[1], loc[2] * ZS)
        os.makedirs(OUT, exist_ok=True)
        fn = os.path.join(OUT, 'pit_%s%s.png' % ('night' if night else 'day', '_quick' if quick else ''))
        sc.render.filepath = fn; bpy.ops.render.render(write_still=True); out['night' if night else 'day'] = fn
    return out


def ship(files):
    from PIL import Image
    os.makedirs(SHIP, exist_ok=True)
    meta = dict(_what='THE PIT (ARENA, rule 375): a transparent piece in the towns\' own camera, drawn by the town screen over the Mob\'s '
                      'picture at slices/arena/arena_town.json\'s place. anchor = where the pool\'s centre on the ground (0, 0, 0) lands in '
                      'this picture\'s pixels; footprint = the ground it covers (nobody walks there); door = where the bookie stands.',
                px=[W, H], ppm=round(PPM, 4), anchor=[round(to_px(0, 0)[0], 1), round(to_px(0, 0)[1], 1)],
                footprint=[round(to_px(-4.3, 0)[0]), round(to_px(0, 3.5, 0.12)[1]), round(to_px(4.65, 0)[0]), round(to_px(0, -2.75)[1])],
                door=[round(to_px(-0.6, -3.45)[0]), round(to_px(-0.6, -3.45)[1])],
                pool=[round(to_px(-PX, 0)[0]), round(to_px(0, PY)[1]), round(to_px(PX, 0)[0]), round(to_px(0, -PY)[1])],
                source='tools/bohemia_arena_the_pit.py', draft=True)
    for k, fn in files.items():
        im = Image.open(fn).convert('RGBA')
        if im.size != (W, H): im = im.resize((W, H), Image.LANCZOS)
        a = np.asarray(im).astype(np.float32); al = a[..., 3] / 255.0
        shade = al < 0.62                                            # the shadow catcher's pixels: shadow only, never caught light
        a[shade, :3] = 0; a[shade, 3] = np.minimum(a[shade, 3], 255 * float(RIG.G['shadow_alpha_max']))
        im = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
        im.save(os.path.join(SHIP, 'pit_%s.webp' % k), 'WEBP', quality=92, method=6)
    json.dump(meta, open(os.path.join(SHIP, 'pit.json'), 'w'), indent=1)
    print(json.dumps(meta))


if __name__ == '__main__':
    quick = '--quick' in sys.argv
    files = render(quick)
    if not quick: ship(files)
    print(files)
