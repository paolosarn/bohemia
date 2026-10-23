#!/usr/bin/env python3
"""BOHEMIA -- UI [the UI the Crashbox way] (rule 130(b), Paolo 10/23: 'the UI kind of still sucks, it doesn't look as
elevated as the Crashbox style that we're going for'; 121(g): his biggest concern; the 9/20 rule: ALL THE UI LOOKS 3-D,
built with light and form, delivered as pixels).

THE UI KIT, MODELLED AND RENDERED THROUGH THE RIG. Until this file every panel, button, bar and slot the player touches
was four pictures drawn in canvas code at boot (bohemia_ui_materials.js: cardboard(), receipt(), glass(), tape():
gradients and sprinkled dots), so the UI was the one flat thing left on top of 3D people and 3D ground. Here each
material is a THING, modelled in Blender at its real thickness and rendered under the world's one light, the way COOK
renders a prop (rule 115a: one source):
  tin         a pressed tin plate painted bone, a rolled bead round its edge, a rivet in each corner, the paint chipped
              through to rust on the worn edges: the buttons you press
  tin_dark    the same plate painted a dead olive: the dark buttons, and the one that is not picked
  tin_amber   the same plate in signal amber: the one that IS picked (the speed you run at, the fight you chose)
  board       corrugated cardboard, the top liner torn back along the top edge so the flutes show: the long bars
  board_plain the same board with its edges cut clean: the sheets and panels
  receipt     a strip of thermal paper with a slight curl: what the game prints (tags, hints, the drawer, the rows)
  glass       a pane of cracked phone glass on a bevel: SETTINGS, the glass presses
  well        a pocket pressed into a dark tin tray, cracked glass at its floor: an empty slot
  tray        the same pocket long (its floor four times the period): what you carry, the turn's faces
  well_full   the same pocket lined with cardboard: a slot with something in it
  tape        a strip of yellowed packing tape, see-through, torn at both ends: what holds a card on
Every one is lit by ONE SUN at the world's screen angle (the style guide's calibration: 155 degrees, up and to the
left), at 40 degrees over the glass, with the guide's cool sky fill, on Cycles with the guide's samples and film. The
camera is the UI's own: orthographic, square to the glass, tipped 25 degrees so a thing's bottom edge shows its
thickness (a button is a slab you could pick up, not a sticker), its height stretched back by 1/cos(25) the way the
rig stretches a man (so a 44 point button is 44 points).

THE SOURCE PASS, MADE TO TILE. The rig's recipe (tools/bohemia_direction_master_rig.py source_pass: matte, old paint,
crevice grime from the model's own occlusion, dust broken by a mask, a slow colour drift, grain in value weighted by
the wear, chipped edges through to a dark undercoat) is followed key for key with the guide's numbers, but every mask
is a PERIODIC picture made here (numpy, filtered noise on a torus) instead of Blender's 3D noise, because a UI panel is
cut into nine pieces and its edges and middle repeat across any size: a mask that does not repeat would seam. The
middle of every piece is exactly one period of every mask, so the browser can lay it end to end forever.

THE POST is the rig's: alpha cut at the guide's threshold (a hard pixel edge), the ring (the silhouette's outer pixel
the guide's ring darker, moved to a colour the body uses), and the population snap toward the colours his PROP family
actually uses (reference/art_bank/prop), at 0.3 (COOK's icons ran 0.35: at the guide's 0.6 everything went one grey).

THE CUT: each render is cut into nine PNGs (four corners, four edges, the middle) at slices/ui_kit/<piece>/ and every
number the browser needs (the insets, the period, the corner radius, the lip) goes into slices/ui_kit/kit.json, which
bohemia_ui_materials.js reads as BohemiaMaterials.kit(name).

  /home/user/v/bin/python tools/bohemia_ui_crashbox_kit.py [piece ...]      (about half a minute a piece)

REFERENCE CHECK (the 9/4 standing duty): the materials grammar UI shipped 10/4 (cardboard bar, tape, receipt, phone
glass, 67a) is kept, word for word, and made real; the look bible's Crashbox (rule 115d amended 10/18: a handmade broken
game computer, rusty tin, clay that still looks like clay, nothing glows) adds the tin and the rivets; Machine Party's
lesson (121(l)): the grime crosses object boundaries, so the rust bleeds from the rivets into the paint. No reference
game. REUSE CHECK (REUSE-FIRST): the master rig, imported, never edited (its guide G, its population()); the materials
file's four materials are the four this replaces. TASTE CHECK: every piece is a real object at a real thickness under
the world's light; nothing is a gradient.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
RAW = os.path.join(R, 'records/target/ui_crashbox_kit')
SHIP = os.path.join(R, 'slices/ui_kit')
UP = 2                    # texels a CSS point: the render is twice the point grid, so his 3x phone shows it crisp
TILT = 25.0               # the UI camera tips toward the top of the glass this far: a bottom edge shows its thickness
SUN_SCREEN = 155.4        # the guide's calibration: the world's light on the screen (90 = up, 180 = left)
SUN_ELEV = 40.0           # how high the sun stands over the glass: low enough that a bead and a rivet cast
WEAR = 0.45               # the guide's 0.6 is a prop in the desert; a thing in your hand every second is a little cleaner
SNAP = 0.3

# ---------------------------------------------------------------------------------------------------------------------
# THE PIECES. Units are CSS points (one Blender unit = one point). ins = [top, right, bottom, left] on the FACE; the lip
# (the thickness the tilt shows) is added under the bottom inset. P = the period of every mask = the middle piece's size.
# ---------------------------------------------------------------------------------------------------------------------
PIECES = {
    'tin':         dict(kind='plate', paint=(0.93, 0.89, 0.78), P=64, ins=[12, 12, 12, 12], T=4.7, r=5.0, bead=True, rivets=True),
    'tin_dark':    dict(kind='plate', paint=(0.22, 0.22, 0.17), P=64, ins=[12, 12, 12, 12], T=4.7, r=5.0, bead=True, rivets=True, dust=0.25),
    'tin_amber':   dict(kind='plate', paint=(0.97, 0.82, 0.44), P=64, ins=[12, 12, 12, 12], T=4.7, r=5.0, bead=True, rivets=True),
    'board':       dict(kind='board', paint=(0.25, 0.185, 0.12), P=192, ins=[14, 6, 6, 6], T=4.7, r=1.5, flutes=True),
    'board_plain': dict(kind='board', paint=(0.235, 0.175, 0.115), P=192, ins=[6, 6, 6, 6], T=4.7, r=1.5, flutes=False),
    'receipt':     dict(kind='paper', paint=(0.95, 0.92, 0.84), P=96, ins=[6, 6, 6, 6], T=2.4, r=0.6),
    'glass':       dict(kind='glass', paint=(0.10, 0.10, 0.10), P=128, ins=[8, 8, 8, 8], T=3.6, r=3.0, crack_cells=3),
    'well':        dict(kind='well', paint=(0.20, 0.20, 0.16), floor='glass', P=48, ins=[11, 6, 7, 12], T=4.7, r=3.0, crack_cells=2),
    'tray':        dict(kind='well', paint=(0.20, 0.20, 0.16), floor='glass', P=128, ins=[11, 6, 7, 12], T=4.7, r=3.0, crack_cells=3),
    'well_full':   dict(kind='well', paint=(0.20, 0.20, 0.16), floor='board', P=48, ins=[11, 6, 7, 12], T=4.7, r=3.0),
    'tape':        dict(kind='tape', paint=(0.84, 0.74, 0.47), W=96, H=24),
}
ORDER = list(PIECES)


# ----------------------------------------------------------------------------------------------- periodic masks (numpy)
def pnoise(n, feat, seed, octaves=4, gain=0.55):
    """filtered white noise on a torus: wraps at its edges, so a picture of it tiles. feat = feature size in texels."""
    rng = np.random.default_rng(seed)
    fy = np.fft.fftfreq(n)[:, None]; fx = np.fft.fftfreq(n)[None, :]; f = np.sqrt(fx * fx + fy * fy)
    out = np.zeros((n, n)); amp = 1.0
    for _ in range(octaves):
        w = np.fft.fft2(rng.standard_normal((n, n)))
        g = np.exp(-0.5 * (f * feat / 2.2) ** 2)
        layer = np.real(np.fft.ifft2(w * g)); layer /= (layer.std() + 1e-9)
        out += amp * layer; amp *= gain; feat = max(1.0, feat / 2.0)
    lo, hi = np.percentile(out, 1), np.percentile(out, 99)
    return np.clip((out - lo) / (hi - lo + 1e-9), 0, 1)


def cracks(n, seed, cells=3):
    """a crazed glass network that wraps: the ridges of a periodic cell field, thin and broken"""
    rng = np.random.default_rng(seed)
    pts = rng.random((cells * cells, 2)) * n
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    d1 = np.full((n, n), 1e9); d2 = np.full((n, n), 1e9)
    for px, py in pts:
        for ox in (-n, 0, n):
            for oy in (-n, 0, n):
                d = np.hypot(xx - px - ox, yy - py - oy)
                closer = d < d1; d2 = np.where(closer, d1, np.minimum(d2, d)); d1 = np.where(closer, d, d1)
    edge = np.clip(1.0 - (d2 - d1) / 1.1, 0, 1)
    brk = pnoise(n, n / 4, seed + 1, 2) > 0.42                  # a crack runs, stops, runs on
    return edge * brk


def to_image(bpy, name, arr, color=False):
    """a numpy picture (rows top to bottom) into Blender, unsaved, as data"""
    h, w = arr.shape[:2]
    img = bpy.data.images.new(name, w, h, alpha=True, float_buffer=True)
    if arr.ndim == 2: rgba = np.dstack([arr, arr, arr, np.ones_like(arr)])
    else: rgba = np.dstack([arr[..., :3], np.ones((h, w))])
    img.pixels.foreach_set(np.flipud(rgba).astype(np.float32).ravel())
    img.update(); img.pack()             # without update() the buffer reads back empty and the render sees a blank mask
    img.colorspace_settings.name = 'sRGB' if color else 'Non-Color'
    return img


# ------------------------------------------------------------------------------------------------------------ geometry
def rr_outline(x0, y0, x1, y1, r, seg=6):
    """a rounded rectangle as a loop of points, counter-clockwise"""
    r = max(0.0, min(r, (x1 - x0) / 2 - 0.01, (y1 - y0) / 2 - 0.01))
    pts = []
    for cx, cy, a0 in ((x1 - r, y0 + r, -90), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90), (x0 + r, y0 + r, 180)):
        for i in range(seg + 1):
            a = math.radians(a0 + 90.0 * i / seg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def mesh_obj(bpy, name, verts, faces, mat):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(map(float, v)) for v in verts], [], faces); me.update(calc_edges=True)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(mat)
    return o


def slab(bpy, name, outline, z0, z1, mat, bevel=0.0, seg=3):
    """an outline pushed up from z0 to z1 with its rim rounded by `bevel`"""
    n = len(outline)
    verts = [(x, y, z0) for x, y in outline] + [(x, y, z1) for x, y in outline]
    faces = [list(range(n))[::-1], list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    o = mesh_obj(bpy, name, verts, faces, mat)
    if bevel > 0:
        b = o.modifiers.new('rim', 'BEVEL'); b.width = bevel; b.segments = seg; b.limit_method = 'ANGLE'; b.angle_limit = math.radians(50)
    for p in o.data.polygons: p.use_smooth = False
    return o


def ring(bpy, name, outer, inner, z0, z1, mat, bevel=0.0, seg=3):
    """the band between two loops of the same count, pushed up: a bead, a frame"""
    n = len(outer); assert n == len(inner)
    V = [(x, y, z0) for x, y in outer] + [(x, y, z0) for x, y in inner] + [(x, y, z1) for x, y in outer] + [(x, y, z1) for x, y in inner]
    o0, i0, o1, i1 = 0, n, 2 * n, 3 * n
    F = []
    for i in range(n):
        j = (i + 1) % n
        F.append([o1 + i, o1 + j, i1 + j, i1 + i])          # top
        F.append([o0 + j, o0 + i, i0 + i, i0 + j])          # bottom
        F.append([o0 + i, o0 + j, o1 + j, o1 + i])          # outer wall
        F.append([i0 + j, i0 + i, i1 + i, i1 + j])          # inner wall
    o = mesh_obj(bpy, name, V, F, mat)
    if bevel > 0:
        b = o.modifiers.new('rim', 'BEVEL'); b.width = bevel; b.segments = seg; b.limit_method = 'ANGLE'; b.angle_limit = math.radians(50)
    return o


def dome(bpy, name, cx, cy, z, rad, hgt, mat):
    """a rivet: a flattened half sphere"""
    import bmesh
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=1.0)
    for v in bm.verts:
        v.co.z = max(v.co.z, 0.0) * hgt; v.co.x *= rad; v.co.y *= rad
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(mat)
    o.location = (cx, cy, z)
    for p in me.polygons: p.use_smooth = True
    return o


def grid_surface(bpy, name, x0, x1, y0, y1, step, zf, mat):
    """a height field (the flutes under a torn liner)"""
    xs = np.arange(x0, x1 + 1e-6, step); ys = np.arange(y0, y1 + 1e-6, step)
    V = [(x, y, zf(x, y)) for y in ys for x in xs]; nx = len(xs)
    F = [[j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i] for j in range(len(ys) - 1) for i in range(nx - 1)]
    o = mesh_obj(bpy, name, V, F, mat)
    for p in o.data.polygons: p.use_smooth = True
    return o


# ----------------------------------------------------------------------------------------------------------- materials
def lin(c):
    return tuple((v / 12.92) if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c)


def material(bpy, name, base, masks, P, G, kind, wear=WEAR, rough=None, dust=1.0):
    """THE RIG'S SOURCE PASS, KEY FOR KEY (master rig source_pass), every mask a periodic picture of period P points.
    base is an sRGB triple; masks = dict(height, drift_r, drift_g, drift_b, dust, grain, chip, extra) of Blender images."""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links
    bsdf = N['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = float(G['roughness_min']) if rough is None else rough
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in bsdf.inputs: bsdf.inputs[sp].default_value = float(G['specular']) if rough is None else 0.35
    bsdf.inputs['Metallic'].default_value = 0.0
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.vector_type = 'POINT'
    mp.inputs['Scale'].default_value = (1.0 / P, 1.0 / P, 1.0 / P)
    L.new(tc.outputs['Object'], mp.inputs['Vector'])

    def tex(img):
        t = N.new('ShaderNodeTexImage'); t.image = img; t.extension = 'REPEAT'; t.interpolation = 'Linear'
        L.new(mp.outputs['Vector'], t.inputs['Vector']); return t.outputs['Color']

    def bw(sock):
        s = N.new('ShaderNodeRGBToBW'); L.new(sock, s.inputs['Color']); return s.outputs['Val']

    def math_(op, a, b=None, clamp=False):
        n = N.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
        for i, v in enumerate((a, b)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = float(v)
            else: L.new(v, n.inputs[i])
        return n.outputs[0]

    def mix(mode, fac, c1, c2):
        n = N.new('ShaderNodeMixRGB'); n.blend_type = mode
        for sock, v in ((n.inputs['Fac'], fac), (n.inputs['Color1'], c1), (n.inputs['Color2'], c2)):
            if isinstance(v, (int, float)): sock.default_value = float(v)
            elif isinstance(v, tuple): sock.default_value = v
            else: L.new(v, sock)
        return n.outputs['Color']

    def mrange(v, a, b, c=0.0, d=1.0):
        n = N.new('ShaderNodeMapRange'); n.clamp = True
        n.inputs['From Min'].default_value = a; n.inputs['From Max'].default_value = b; n.inputs['To Min'].default_value = c; n.inputs['To Max'].default_value = d
        L.new(v, n.inputs['Value']); return n.outputs['Result']

    GRIME, DUST = (0.11, 0.085, 0.065, 1), (0.66, 0.60, 0.50, 1)
    src = N.new('ShaderNodeRGB'); src.outputs[0].default_value = lin(base) + (1,)
    col = src.outputs[0]
    # the material's own pattern before any wear (the paper's fibre, the board's stain, the glass's crazing)
    if 'extra' in masks:
        ex = bw(tex(masks['extra']))
        tint = {'board': (0.55, 0.47, 0.38, 1), 'paper': (0.80, 0.76, 0.66, 1), 'glass': (0.55, 0.60, 0.62, 1),
                'tin': (0.30, 0.17, 0.09, 1)}.get(kind, (0.5, 0.5, 0.5, 1))
        col = mix('MULTIPLY' if kind != 'glass' else 'SCREEN', math_('MULTIPLY', ex, 0.9 if kind == 'glass' else 0.55, True), col, tint)
    # 1b. the paint is old: saturation times the guide's paint_sat_mul
    hsv = N.new('ShaderNodeHueSaturation'); L.new(col, hsv.inputs['Color']); hsv.inputs['Saturation'].default_value = float(G['paint_sat_mul'])
    col = hsv.outputs['Color']
    # 2. grime where the shape closes on itself: the model's own occlusion (in points: 5 of them reach a bead's foot)
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 5.0; ao.samples = 8; ao.only_local = False
    crev = math_('MULTIPLY', math_('SUBTRACT', 1.0, ao.outputs['AO']), 1.6 * wear, True)
    col = mix('MIX', crev, col, GRIME)
    # 3. dust broken by a mask, on a bright base the wear is the base gone darker and warmer, never frost
    lum = bw(col); bright = mrange(lum, G['dust_bright_value'][0], G['dust_bright_value'][1])
    dark = mix('MULTIPLY', 1.0, col, tuple(G['dust_on_bright_mul']) + (1,))
    dcol = mix('MIX', bright, DUST, dark)
    # (the rig dusts what faces the sky; every face of a UI piece faces the glass, so at the rig's strength the dark
    # pieces read as camouflage, measured on the first sheet: the dust here is the top of its mask only, and light)
    dustm = math_('MULTIPLY', mrange(bw(tex(masks['dust'])), 0.62, 0.95), {'tin': 0.2, 'board': 0.12, 'paper': 0.2, 'glass': 0.0}.get(kind, 0.2) * wear * dust, True)
    col = mix('MIX', dustm, col, dcol)
    # 4. a slow drift of colour (the three drift pictures as one colour), overlay
    drift = N.new('ShaderNodeCombineColor')
    for i, k in enumerate(('drift_r', 'drift_g', 'drift_b')): L.new(bw(tex(masks[k])), drift.inputs[i])
    col = mix('OVERLAY', 0.45 * wear, col, drift.outputs['Color'])
    # 5. the grain, in value, heavy in the grime and the patches, light on clean paint, leaning dark
    patch = mrange(bw(tex(masks['drift_r'])), 0.47, 0.56)
    gp = math_('ADD', math_('MULTIPLY', patch, (float(G['grain_wear']) - float(G['grain_rest'])) * wear), float(G['grain_rest']) * wear)
    gf = math_('ADD', math_('MULTIPLY', crev, 0.8 * wear), gp, True)
    gdark = mrange(bw(tex(masks['grain'])), 0.15, 0.85, 0.0, float(G['grain_lift']))
    gcol = N.new('ShaderNodeCombineColor')
    for i in range(3): L.new(gdark, gcol.inputs[i])
    col = mix('OVERLAY', gf, col, gcol.outputs['Color'])
    # 6. the edges are worn: within a point of a turn the paint chips through to the dark undercoat
    geo = N.new('ShaderNodeNewGeometry'); bev = N.new('ShaderNodeBevel'); bev.samples = 8; bev.inputs['Radius'].default_value = 1.1
    dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'; L.new(bev.outputs['Normal'], dot.inputs[0]); L.new(geo.outputs['True Normal'], dot.inputs[1])
    edge = mrange(dot.outputs['Value'], 0.995, 0.9)
    chip = math_('MULTIPLY', math_('MULTIPLY', edge, mrange(bw(tex(masks['chip'])), 0.36, 0.5)), float(G['edge_wear']) * wear * (1.6 if kind == 'tin' else 1.0), True)
    under = mix('MULTIPLY', 1.0, col, tuple(G['chip_mul']) + (1,))
    if kind == 'tin':
        under = mix('MIX', 0.75, under, lin((0.42, 0.22, 0.10)) + (1,))   # tin chips to rust, not to a grey undercoat
    col = mix('MIX', chip, col, under)
    for l in list(bsdf.inputs['Base Color'].links): L.remove(l)
    L.new(col, bsdf.inputs['Base Color'])
    # the surface's own relief (the paper's tooth, the board's dents, the paint's orange peel), as a bump
    if 'height' in masks:
        bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = {'paper': 0.35, 'glass': 0.15}.get(kind, 0.55); bump.inputs['Distance'].default_value = 0.6
        L.new(bw(tex(masks['height'])), bump.inputs['Height']); L.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return m


def masks_for(bpy, name, P, seed, kind, crack_cells=2):
    n = int(P * UP * 2)                      # two mask texels a render texel
    k = n / P                                # texels a point
    # the drift is one slow field (value) with a little hue riding it, centred on 0.5 the way Blender's noise sits, so
    # an overlay at the guide's strength moves the colour, never turns it to camouflage (the first render did)
    d0 = pnoise(n, 22 * k, seed + 2, 3)
    drift = [np.clip(0.5 + (d0 - 0.5) * 0.36 + (pnoise(n, 30 * k, seed + 3 + i, 2) - 0.5) * 0.10, 0, 1) for i in range(3)]
    ms = dict(height=pnoise(n, 2.2 * k, seed + 1, 4), drift_r=drift[0], drift_g=drift[1], drift_b=drift[2],
              dust=pnoise(n, 30 * k, seed + 5, 3), grain=pnoise(n, 1.1 * k, seed + 6, 2), chip=pnoise(n, 4.5 * k, seed + 7, 3))
    if kind == 'board':
        stain = pnoise(n, 26 * k, seed + 8, 4); ms['extra'] = np.clip((stain - 0.6) * 2.6, 0, 1)         # water stains, old tape glue
        ms['height'] = 0.6 * ms['height'] + 0.4 * pnoise(n, 9 * k, seed + 9, 3)                              # the liner's soft dents
    elif kind == 'paper':
        ms['extra'] = np.clip((pnoise(n, 40 * k, seed + 8, 3) - 0.55) * 2.0, 0, 1) * 0.5                     # a thermal fade, in patches
        ms['height'] = 0.7 * pnoise(n, 0.9 * k, seed + 9, 2) + 0.3 * ms['height']                            # the paper's tooth
    elif kind == 'glass':
        ms['extra'] = cracks(n, seed + 8, crack_cells) * 0.55
    elif kind == 'tin':
        ms['extra'] = np.clip((pnoise(n, 11 * k, seed + 8, 3) - 0.82) * 4.0, 0, 1)                            # a few rust blooms through the paint
        ms['grain'] = 0.5 + (ms['grain'] - 0.5) * 0.45                                                            # paint is smoother than board
        ms['height'] = 0.5 * ms['height'] + 0.5 * pnoise(n, 1.6 * k, seed + 9, 2)                            # orange peel
    return {key: to_image(bpy, '%s_%s' % (name, key), arr) for key, arr in ms.items()}


# ------------------------------------------------------------------------------------------------------------- a piece
def build(bpy, G, name, spec):
    """the piece in points: the face from (0,0) to (W,H) at z = T, the back at z = 0; returns (W, H, T)"""
    P, ins, T = spec['P'], spec['ins'], spec['T']
    W = ins[3] + P + ins[1]; H = ins[2] + P + ins[0]; kind = spec['kind']
    seed = sum(map(ord, name))
    mk = masks_for(bpy, name, P, seed, {'plate': 'tin', 'board': 'board', 'paper': 'paper', 'glass': 'glass', 'well': 'tin'}[kind], spec.get('crack_cells', 2))
    if kind == 'plate':
        paint = material(bpy, name + '_paint', spec['paint'], mk, P, G, 'tin', dust=spec.get('dust', 1.0))
        slab(bpy, 'plate', rr_outline(0, 0, W, H, spec['r']), 0, T, paint, bevel=1.1)
        if spec.get('bead'):
            # the stamped panel: the middle of the plate pressed up 1.2 points on a soft 2.6 point slope, the way a tin
            # toy's panel is struck, so the left slope takes the sun and the right one falls into shade
            b0 = 7.0
            slab(bpy, 'emboss', rr_outline(b0, b0, W - b0, H - b0, 3.0), T - 0.4, T + 1.2, paint, bevel=1.5, seg=4)
        if spec.get('rivets'):
            rust = material(bpy, name + '_rivet', (0.36, 0.24, 0.16), mk, P, G, 'tin', wear=0.9)
            for cx, cy in ((4.0, 4.0), (W - 4.0, 4.0), (4.0, H - 4.0), (W - 4.0, H - 4.0)):
                dome(bpy, 'rivet', cx, cy, T - 0.1, 1.9, 1.2, rust)
    elif kind == 'board':
        board = material(bpy, name + '_board', spec['paint'], mk, P, G, 'board')
        if spec.get('flutes'):
            band = 9.0
            # the board under the liner: the face stops short of the top, the medium (the flutes) shows in the band, and
            # the liner's torn line wanders (a periodic wander, so the edge repeats)
            n = 384; wander = pnoise(n, 30, 77, 3)[0] * 2.6 + pnoise(n, 3, 78, 2)[0] * 0.9
            def tear(x):   # periodic: the sample past the last wraps to the first, so the torn line repeats with the board
                return float(np.interp((x % P) / P * n, np.arange(n + 1), np.append(wander, wander[0])))
            # build the face as a polygon: bottom edge left->right, then the torn top right->left
            poly = [(0, 0), (W, 0), (W, H - band - tear(W))] + [(x, H - band - tear(x)) for x in np.arange(W - 0.5, 0.0, -0.5)] + [(0, H - band - tear(0))]
            slab(bpy, 'board', poly, 0, T, board, bevel=0.6, seg=2)
            medium = material(bpy, name + '_medium', tuple(min(1, c * 1.18) for c in spec['paint']), mk, P, G, 'board')
            grid_surface(bpy, 'flutes', 0, W, H - band - 4.0, H, 0.5,
                         lambda x, y: T - 1.25 + 0.95 * (0.5 + 0.5 * math.cos(2 * math.pi * x / 6.0)) - max(0.0, y - (H - 1.2)) * 1.6, medium)
            # the back liner, so the band has a floor and the top edge is board, not air
            slab(bpy, 'liner_back', rr_outline(0, H - band - 4.0, W, H, 0.01, 1), 0, T - 1.3, board, bevel=0.3, seg=1)
        else:
            slab(bpy, 'board', rr_outline(0, 0, W, H, spec['r']), 0, T, board, bevel=0.6, seg=2)
    elif kind == 'paper':
        paper = material(bpy, name + '_paper', spec['paint'], mk, P, G, 'paper')
        # a strip lying on the glass with a soft curl lifting its left and right edges (uniform down each edge)
        xs = np.concatenate([np.arange(0, 6, 0.5), np.arange(6, W - 6, 2.0), np.arange(W - 6, W + 0.01, 0.5)])
        ys = np.concatenate([np.arange(0, H + 0.01, 2.0)])
        def z(x):
            e = min(x, W - x)
            return T - 1.8 + 1.8 * (max(0.0, 1.0 - e / 6.0) ** 2)
        V = [(x, y, z(x)) for y in ys for x in xs] + [(x, y, 0.0) for y in ys for x in xs]; nx, ny = len(xs), len(ys); off = nx * ny
        F = [[j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i] for j in range(ny - 1) for i in range(nx - 1)]
        F += [[off + j * nx + i, off + (j + 1) * nx + i, off + (j + 1) * nx + i + 1, off + j * nx + i + 1] for j in range(ny - 1) for i in range(nx - 1)]
        for i in range(nx - 1):   # the foot and the head
            F.append([i, i + 1, off + i + 1, off + i]); a = (ny - 1) * nx; F.append([a + i + 1, a + i, off + a + i, off + a + i + 1])
        for j in range(ny - 1):   # the two long sides
            F.append([off + (j + 1) * nx, off + j * nx, j * nx, (j + 1) * nx]); a = nx - 1
            F.append([off + j * nx + a, off + (j + 1) * nx + a, (j + 1) * nx + a, j * nx + a])
        o = mesh_obj(bpy, 'paper', V, F, paper)
        top_faces = (ny - 1) * (nx - 1)
        for p in o.data.polygons: p.use_smooth = p.index < top_faces
    elif kind == 'glass':
        glass = material(bpy, name + '_glass', spec['paint'], mk, P, G, 'glass', rough=0.55)
        frame = material(bpy, name + '_frame', (0.17, 0.17, 0.14), mk, P, G, 'tin')
        slab(bpy, 'frame', rr_outline(0, 0, W, H, spec['r']), 0, T - 1.0, frame, bevel=0.8)
        slab(bpy, 'pane', rr_outline(1.6, 1.6, W - 1.6, H - 1.6, max(0.5, spec['r'] - 1.4)), 0, T, glass, bevel=1.4, seg=4)
    elif kind == 'well':
        tray = material(bpy, name + '_tray', spec['paint'], mk, P, G, 'tin')
        if spec['floor'] == 'glass':
            floor = material(bpy, name + '_floor', (0.075, 0.075, 0.07), masks_for(bpy, name + 'g', P, seed + 50, 'glass', spec.get('crack_cells', 2)), P, G, 'glass', rough=0.6)
        else:
            floor = material(bpy, name + '_floor', (0.235, 0.175, 0.115), masks_for(bpy, name + 'b', P, seed + 50, 'board'), P, G, 'board')
        lip = 3.2   # the tray's lip round the pocket
        outer = rr_outline(0, 0, W, H, spec['r'], 6); inner = rr_outline(lip, lip, W - lip, H - lip, max(0.5, spec['r'] - 1.5), 6)
        ring(bpy, 'tray', outer, inner, 0, T, tray, bevel=0.8, seg=3)
        slab(bpy, 'floor', rr_outline(lip - 0.5, lip - 0.5, W - lip + 0.5, H - lip + 0.5, 1.0), 0, 0.6, floor, bevel=0.2, seg=1)
    return W, H, T


def build_tape(bpy, G, spec):
    """a strip of packing tape, torn at both ends, see-through, creased across"""
    W, H = spec['W'], spec['H']
    m = bpy.data.materials.new('tape'); m.use_nodes = True; N = m.node_tree.nodes; Lk = m.node_tree.links
    b = N['Principled BSDF']; b.inputs['Base Color'].default_value = lin(spec['paint']) + (1,); b.inputs['Roughness'].default_value = 0.55
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.25
    b.inputs['Alpha'].default_value = 0.62
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.35; nz.inputs['Detail'].default_value = 6
    Lk.new(tc.outputs['Object'], nz.inputs['Vector']); bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6
    Lk.new(nz.outputs['Fac'], bump.inputs['Height']); Lk.new(bump.outputs['Normal'], b.inputs['Normal'])
    rng = np.random.default_rng(5)
    left = [(1.5 + rng.random() * 2.5, y) for y in np.linspace(H, 0, 9)]
    right = [(W - 1.5 - rng.random() * 2.5, y) for y in np.linspace(0, H, 9)]
    poly = [(left[-1][0], 0)] + [(x, 0) for x in np.arange(6, W - 6, 4)] + right + [(x, H) for x in np.arange(W - 6, 6, -4)] + left
    # creases: a few lines across the strip where it buckled
    o = slab(bpy, 'tape', poly, 0, 0.5, m, bevel=0.0)
    sub = o.modifiers.new('cut', 'SUBSURF'); sub.subdivision_type = 'SIMPLE'; sub.levels = sub.render_levels = 3
    tex = bpy.data.textures.new('crease', 'CLOUDS'); tex.noise_scale = 6.0
    d = o.modifiers.new('crease', 'DISPLACE'); d.texture = tex; d.strength = 0.8; d.direction = 'Z'
    return W, H, 0.5


# --------------------------------------------------------------------------------------------------- light and camera
def light_camera(bpy, G, W, H, T):
    import mathutils
    sc = bpy.context.scene
    sun_d = bpy.data.lights.new('sun', 'SUN'); sun_d.energy = float(G['sun_energy']); sun_d.angle = math.radians(G['sun_angle_deg'])
    sun = bpy.data.objects.new('sun', sun_d); sc.collection.objects.link(sun)
    a, e = math.radians(SUN_SCREEN), math.radians(SUN_ELEV)
    to_light = mathutils.Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e)))
    sun.rotation_euler = to_light.to_track_quat('Z', 'Y').to_euler()        # the lamp's +Z at the light: it shines down -Z
    world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs[0].default_value = tuple(G['fill_rgb']) + (1,)
    world.node_tree.nodes['Background'].inputs[1].default_value = float(G['fill_strength'])
    sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.image_settings.color_depth = '8'; sc.render.filter_size = float(G['filter_px']); sc.render.use_motion_blur = False
    sc.view_settings.view_transform = G['view_transform']; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0.0; sc.view_settings.gamma = 1.0
    sc.render.dither_intensity = 0.0; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
    sc.cycles.samples = int(G['samples']); sc.cycles.use_denoising = bool(G['denoise'])
    sc.cycles.transparent_max_bounces = 8
    # the camera: square to the glass, tipped TILT toward the top so the bottom edge shows; the face's height stretched
    # back by 1/cos(TILT) (every object's y), so the face is H points on the screen and the lip is T sin(TILT) under it
    th = math.radians(TILT)
    for o in list(sc.objects):
        if o.type == 'MESH':
            o.location.y /= math.cos(th); o.scale.y /= math.cos(th)
    lip = int(math.ceil(T * math.sin(th) - 0.05))
    Hs = H + lip
    cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'; cam_d.sensor_fit = 'HORIZONTAL'; cam_d.ortho_scale = W
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    u = mathutils.Vector((0, math.cos(th), math.sin(th)))            # the screen's up
    back = mathutils.Vector((0, -math.sin(th), math.cos(th)))        # toward the camera
    # a point on the lip's front foot (y=0, z=0) is the screen's bottom: shift the centre up by Hs/2 from it, then T*sin
    # of the lip's own projection is inside [0, lip]
    cam.location = mathutils.Vector((W / 2.0, 0, 0)) + u * (Hs / 2.0 - (lip - T * math.sin(th))) + back * 400.0
    cam.rotation_euler = (th, 0, 0)
    cam_d.clip_start = 1.0; cam_d.clip_end = 2000.0
    sc.render.resolution_x = int(round(W * UP)); sc.render.resolution_y = int(round(Hs * UP)); sc.render.resolution_percentage = 100
    return lip


# ---------------------------------------------------------------------------------------------------- post and the cut
def post(png, A_ring, pop, keep_alpha=False):
    from PIL import Image
    import bohemia_direction_master_rig as RIG
    a = np.asarray(Image.open(png).convert('RGBA')).astype(float)
    if keep_alpha:
        return a
    op = a[..., 3] > RIG.G['alpha_threshold']; a[..., 3] = np.where(op, 255, 0)
    # the render's colours were laid over transparent black at a soft edge: un-premultiply what stays
    if pop is not None and SNAP > 0:
        px = a[..., :3][op]; b = np.clip((px // 8).astype(int), 0, 31); his = pop[b[:, 0], b[:, 1], b[:, 2]]
        a[..., :3][op] = px + (his - px) * SNAP
    p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    ring_ = op & ~inner
    a[..., :3] = np.round(a[..., :3])
    if ring_.any():
        a[..., :3][ring_] = np.clip(a[..., :3][ring_] - A_ring, 0, 255)
    a[..., :3][~op] = 0
    return a


def cut(name, a, spec, lip):
    """nine pictures and their numbers: corners, edges and the middle, in texels of UP per point"""
    from PIL import Image
    t, r, b, l = spec['ins']; P = spec['P']
    b2 = b + lip
    hgt, wid = a.shape[:2]
    assert wid == (l + P + r) * UP and hgt == (t + P + b2) * UP, (name, a.shape, (l + P + r) * UP, (t + P + b2) * UP)
    xs = [0, l * UP, (l + P) * UP, wid]; ys = [0, t * UP, (t + P) * UP, hgt]
    keys = [['tl', 't', 'tr'], ['l', 'c', 'r'], ['bl', 'b', 'br']]
    d = os.path.join(SHIP, name); os.makedirs(d, exist_ok=True)
    for j in range(3):
        for i in range(3):
            Image.fromarray(a[ys[j]:ys[j + 1], xs[i]:xs[i + 1]].astype(np.uint8), 'RGBA').save(os.path.join(d, keys[j][i] + '.png'), optimize=True)
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(RAW, name, 'kit_' + name + '.png'))
    return dict(ins=[t, r, b2, l], P=P, lip=lip, r=spec.get('r', 0), up=UP, w=l + P + r, h=t + P + b2)


def render_piece(name):
    import bpy
    import bohemia_direction_master_rig as RIG
    G = RIG.G
    spec = PIECES[name]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if spec['kind'] == 'tape':
        W, H, T = build_tape(bpy, G, spec)
    else:
        W, H, T = build(bpy, G, name, spec)
    lip = light_camera(bpy, G, W, H, T)
    if spec['kind'] == 'tape':
        bpy.context.scene.render.resolution_y = int(round((H + lip) * UP))
    out = os.path.join(RAW, name); os.makedirs(out, exist_ok=True)
    raw = os.path.join(out, 'raw_' + name + '.png')
    bpy.context.scene.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    cache = os.path.join(RAW, 'population_prop.npy')
    if os.path.exists(cache): pop = np.load(cache)
    else:
        pop = RIG.population('prop')[0]; os.makedirs(RAW, exist_ok=True); np.save(cache, pop)
    a = post(raw, float(G['ring']), pop, keep_alpha=spec['kind'] == 'tape')
    from PIL import Image
    if spec['kind'] == 'tape':
        a = a[:int(H * UP)] if a.shape[0] > H * UP else a
        d = os.path.join(SHIP, name); os.makedirs(d, exist_ok=True)
        Image.fromarray(np.round(a).astype(np.uint8), 'RGBA').save(os.path.join(d, 'tape.png'), optimize=True)
        meta = dict(w=W, h=H, up=UP, single='tape.png')
    else:
        meta = cut(name, a, spec, lip)
    meta.update(kind=spec['kind'], sun=dict(screen_deg=SUN_SCREEN, elev_deg=SUN_ELEV), tilt_deg=TILT, wear=WEAR, snap=SNAP,
                samples=int(G['samples']), engine='CYCLES', fill=dict(rgb=G['fill_rgb'], strength=G['fill_strength']))
    json.dump(meta, open(os.path.join(out, 'kit.json'), 'w'), indent=1)
    print('  piece', name, meta.get('w'), 'x', meta.get('h'), 'points', flush=True)
    return meta


def main():
    names = [a for a in sys.argv[1:] if not a.startswith('-')] or ORDER
    os.makedirs(SHIP, exist_ok=True)
    kit_path = os.path.join(SHIP, 'kit.json')
    kit = json.load(open(kit_path)) if os.path.exists(kit_path) else {}
    for n in names:
        kit[n] = render_piece(n)
    kit = {k: kit[k] for k in ORDER if k in kit}
    json.dump(kit, open(kit_path, 'w'), indent=1)
    print('wrote', os.path.relpath(kit_path, R))


if __name__ == '__main__':
    main()
