#!/usr/bin/env python3
"""BOHEMIA -- UI [the blood is CRASHBOX] + [the job tells the truth, in blood] (rule 208(c), Paolo 10/25: 'the button
itself looks bloody depending on how difficult the job is, especially if it's gonna be super overpowered like wolves...
the button looking like some crashbox blood filter'; and his correction the same night: 'not Crash Bandicoot, Crashbox'.
Crashbox is the HBO Family stop-motion show, rule 115(d), the look bible).

THE BLOOD, MODELLED IN CLAY AND RENDERED THROUGH THE RIG, ONE LAYER A BUTTON WEARS FROM CLEAN TO SOAKED.
Nothing here is drawn in canvas code and nothing is a gradient or a filter: every stage is red clay MODELLED as a height
field at its real thickness (half a point for a thumbprint's ridges, a point and a half where a drip has pooled at its
tip), lit by the kit's ONE SUN (the guide's 155.4 degrees, 40 up, the guide's fill, Cycles, matte the guide's way), seen
by the kit's camera (square to the glass, tipped 25 degrees, two texels a point), casting its own shadow onto the tin
under it (a shadow catcher: the shadow is the clay's, not a drop shadow added after), then put through the kit's post
(the hard alpha edge, the ring, the prop family's colours). Where the clay thins at its edge it is DRIED DARK, the way
paint and blood dry from the outside in.

ONE SCALE, EIGHT STOP-MOTION HOLDS. The danger is one number (WORLD's: the chance he comes home with a man dead or down).
The materials file maps it to a stage 0 (clean) to 8 (soaked) and each stage is a held frame of the same clay, every
stage holding everything the stage before had and more of it, darker: a thumbprint first (the hand that pressed the
button), then the blood pooling along the bottom edge and a spatter, then fingers dragged down from the top right and
drips running off the top edge, the drips longer each stage with a bead of clay at each tip, then the smears joining
until the whole plate is soaked. When the danger changes the button steps through the stages between, one held frame at
a time (an animator moving the clay between exposures), never a fade.

THE PIECES (the layers a button wears, any size; slices/ui_kit/blood/<stage>/<piece>.png and slices/ui_kit/kit.json):
  thumb  34 x 40   the thumbprint, at the button's left end, its middle on the button's middle
  hand   56 x 44   four fingers dragged down and to the left from the top right corner
  top    96 x 40   the top edge: a run of blood over the edge and the drips off it, repeating along any width
  foot  112 x 16   the bottom edge: the blood pooled where it ran to, repeating along any width
  field 128 x 128  the spatter and, late, the palm's swipes and the soak: repeating both ways, its middle row on the
                   button's middle (the first swipe crosses there)
The repeating pieces are rendered from geometry that wraps (a margin past each end is the other end's clay), so a tile
meets itself with its light and its shadow continuous.

  /home/user/v/bin/python tools/bohemia_ui_blood.py           (bpy 4.2; about a minute for all forty pictures)

REFERENCE CHECK (the 9/4 duty): the kit's tin, receipt and phone glass (tools/bohemia_ui_crashbox_kit.py) are what it
sits on, and its sun, camera and post are imported from that file, never copied; the look bible's Crashbox (clay that
still looks like clay, stop-motion holds, nothing glows). No reference game. REUSE CHECK: the kit's light_camera(),
mesh_obj(), lin() and post(); the master rig's guide G and population(). TASTE CHECK: every pixel of blood is a lit clay
surface at a real thickness with its own shadow; no gradient, no filter, no splat sprite.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_ui_crashbox_kit as KIT

RAW = os.path.join(R, 'records/target/ui_blood')
SHIP = os.path.join(R, 'slices/ui_kit/blood')
UP = KIT.UP                 # two texels a point, the kit's
STAGES = 8
MARGIN = 8                  # points of wrapped clay past each end of a repeating piece, so its light and shadow wrap
PIECES = {                  # w, h in points; wrap: which way the piece repeats in the browser
    'thumb': dict(w=34, h=40, wrap=''),
    'hand': dict(w=56, h=44, wrap=''),
    'top': dict(w=96, h=40, wrap='x'),
    'foot': dict(w=112, h=16, wrap='x'),
    'field': dict(w=128, h=128, wrap='xy'),
}
ORDER = list(PIECES)
# the clay (sRGB): fresh where it is thick and new, deeper as the stages climb, dried near-black at every thin edge
# (measured: under the guide's sun a matte surface renders at about 0.88 of its colour in sRGB, so these are set to land
# at about 165/25/20 fresh, 120/15/12 deep and 60/12/8 dried on the glass)
FRESH, DEEP, DRIED = np.array([0.76, 0.115, 0.085]), np.array([0.55, 0.06, 0.045]), np.array([0.27, 0.05, 0.035])


# --------------------------------------------------------------------------------------------- periodic noise (numpy)
def anoise(ny, nx, fy, fx, seed, octaves=3, gain=0.5):
    """filtered noise on a torus of ny x nx texels, feature sizes fy, fx (texels) apart: smears are long, not round"""
    rng = np.random.default_rng(seed)
    ky = np.fft.fftfreq(ny)[:, None]; kx = np.fft.fftfreq(nx)[None, :]
    out = np.zeros((ny, nx)); amp = 1.0
    for _ in range(octaves):
        g = np.exp(-0.5 * ((ky * fy / 2.2) ** 2 + (kx * fx / 2.2) ** 2))
        layer = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((ny, nx))) * g)); layer /= (layer.std() + 1e-9)
        out += amp * layer; amp *= gain; fy = max(1.0, fy / 2.0); fx = max(1.0, fx / 2.0)
    lo, hi = np.percentile(out, 1), np.percentile(out, 99)
    return np.clip((out - lo) / (hi - lo + 1e-9), 0, 1)


def grid(name):
    """texel centres of a piece in points (x right, y DOWN from the top edge, the screen's way)"""
    p = PIECES[name]; ny, nx = int(p['h'] * UP), int(p['w'] * UP)
    y, x = np.mgrid[0:ny, 0:nx].astype(float)
    return (x + 0.5) / UP, (y + 0.5) / UP, ny, nx


def wrapd(d, P):
    """the shortest way round a period"""
    return (d + P / 2.0) % P - P / 2.0


def seg_field(x, y, ax, ay, bx, by, w0, w1, P=None):
    """a stroke from a to b, w0 wide at a and w1 at b: positive inside (in points from its edge), and how far along it"""
    dx, dy = x - ax, y - ay
    if P: dx = wrapd(dx, P)
    vx, vy = bx - ax, by - ay; L2 = vx * vx + vy * vy
    t = np.clip((dx * vx + dy * vy) / L2, 0, 1)
    px, py = dx - t * vx, dy - t * vy
    return (w0 + (w1 - w0) * t) / 2.0 - np.hypot(px, py), t


# ------------------------------------------------------------------------------------------------- the clay, staged
# Each piece returns (f, extra) for a stage s of 1..8: f > 0 is clay (points inside its edge), and its thickness comes
# from f; every component is grown by s only, so stage s+1 holds everything stage s held.
def piece_thumb(s):
    x, y, ny, nx = grid('thumb')
    u = s / STAGES
    a, b, rot = 11.5, 15.0, math.radians(-12)
    cx, cy = 17.0, 21.0
    xr = (x - cx) * math.cos(rot) + (y - cy) * math.sin(rot); yr = -(x - cx) * math.sin(rot) + (y - cy) * math.cos(rot)
    rho = np.sqrt((xr / a) ** 2 + (yr / b) ** 2)
    theta = np.arctan2(yr / b, xr / a)
    n = anoise(ny, nx, 10 * UP, 10 * UP, 31)
    patch = anoise(ny, nx, 7 * UP, 7 * UP, 32, 2)
    # a whorl: the ridges run round the core, pushed off-centre and wavering, 2 points apart (four texels: they read on
    # a phone), each ridge about half that wide
    phase = (rho * b / 2.0) * 2 * math.pi + 1.4 * np.sin(theta + 0.6) + 2.4 * (n - 0.5)
    ridge = np.cos(phase)
    # how much of the print took: patches at stage one, the whole print by three; from five the valleys fill
    take = patch + 0.6 * (min(u, 0.375) / 0.375) - 0.25
    cut = 0.1 - 1.3 * max(0.0, u - 0.5)                 # the ridge threshold falls: valleys fill with more blood
    edge = (1.0 - rho) * 6.0
    f = np.minimum(edge, np.where(take > 0.4, 1.2, -1.0))
    f = np.where(ridge > cut, f, np.minimum(f, -0.2))
    # late: a bead of clay running off the print's foot
    if s >= 5:
        L = 4.0 + 5.0 * (s - 5)
        d, _ = seg_field(x, y, 16.0, 33.0, 15.0, min(39.0, 33.0 + L), 2.6, 2.2)
        f = np.maximum(f, d)
        for kk in range(5, s + 1):                     # its bead, and the lump where each stage held it
            f = np.maximum(f, 1.6 - np.hypot(x - 15.0, y - min(38.0, 33.0 + 4.0 + 5.0 * (kk - 5))))
    return f, dict(thick=0.55 + 0.5 * u, dry=0.45, relief=np.clip(ridge, 0, 1))


def piece_hand(s):
    """four fingers dragged down and left from the top right corner; they start at stage three and lengthen"""
    x, y, ny, nx = grid('hand')
    f = np.full((ny, nx), -9.0)
    if s < 3: return f, dict(thick=0.8)
    k = (s - 2) / (STAGES - 2)                         # 1/6 .. 1
    n = anoise(ny, nx, 3 * UP, 14 * UP, 47)
    for i, (sx, sy, w) in enumerate(((52.0, 1.0, 4.4), (55.5, 6.0, 4.0), (56.5, 12.0, 3.8), (56.0, 18.5, 3.2))):
        k_i = max(0.0, k - 0.12 * i)                   # the little finger drags last
        if k_i <= 0: continue
        L = 6.0 + 34.0 * k_i
        ang = math.radians(212 - 4 * i)                # down and to the left
        ex, ey = sx + L * math.cos(ang), sy - L * math.sin(ang)
        d, t = seg_field(x, y, sx, sy, ex, ey, w, w * 0.45)
        d = d + (n - 0.5) * 1.6 * np.minimum(1.0, t * L / 40.0)   # ragged as the finger runs dry, by how far it has run
        f = np.maximum(f, d)
    return f, dict(thick=0.7 + 0.6 * k)


DRIPS = ((14.0, 3, 3.2), (41.0, 4, 3.6), (63.5, 6, 2.8), (84.0, 5, 3.8), (29.0, 7, 2.6), (73.0, 8, 3.0))


def piece_top(s):
    """the top edge: from stage three blood runs over the edge where the drips start, and the drips lengthen each stage,
    each wandering a little as it runs, a bead of clay at its tip"""
    x, y, ny, nx = grid('top'); P = PIECES['top']['w']
    f = np.full((ny, nx), -9.0)
    if s < 3: return f, dict(thick=0.9)
    n = anoise(ny, nx, 2 * UP, 18 * UP, 53)
    for i, (dx, s0, w) in enumerate(DRIPS):
        if s < s0: continue
        k = s - s0
        L = min(37.0, 5.0 + 6.5 * k + (dx % 7))        # each drip runs at its own speed
        wob = 0.9 * np.sin(y / 4.3 + i * 1.7) + 0.5 * np.sin(y / 1.9 + i)     # a drip never runs straight
        wy = w * (1.0 - 0.3 * np.clip(y / max(L, 1), 0, 1))
        d = np.where((y >= 0) & (y <= L), wy / 2.0 - np.abs(wrapd(x - dx - wob, P)), -9.0)
        bead = np.full((ny, nx), -9.0)
        for kk in range(k + 1):                        # the clay gathers at the tip, and a lump stays where it held
            Lk = min(37.0, 5.0 + 6.5 * kk + (dx % 7))
            bx = dx + 0.9 * np.sin(Lk / 4.3 + i * 1.7) + 0.5 * np.sin(Lk / 1.9 + i)
            bead = np.maximum(bead, w * (0.66 if kk == k else 0.6) - np.hypot(wrapd(x - bx, P), (y - Lk) * 0.9))
        # the run over the edge it came from: as wide as the stages have fed it, ragged
        run = (3.0 + 2.2 * k + 3.0 * (n - 0.5)) - np.abs(wrapd(x - dx, P))
        run = np.minimum(run, (1.4 + 0.5 * k + 2.0 * (n - 0.5)) - y)
        f = np.maximum(f, np.maximum(np.maximum(d, bead), run))
    return f, dict(thick=0.9 + 0.25 * (s - 3) / 5)


def piece_foot(s):
    """the bottom edge: what ran down has pooled, in pools first, a run along the edge late, its top edge wavering"""
    x, y, ny, nx = grid('foot'); H = PIECES['foot']['h']
    if s < 2: return np.full((ny, nx), -9.0), dict(thick=0.6)
    n = anoise(ny, nx, 4 * UP, 22 * UP, 61)
    along = anoise(1, nx, 1, 26 * UP, 62)[0][None, :]                      # where along the edge it gathered
    depth = [0, 0, 2.0, 3.2, 4.6, 6.0, 8.0, 10.5, 14.0][s]
    reach = [0, 0, 0.78, 0.66, 0.55, 0.42, 0.25, 0.08, 0.0][s]             # how much of the edge has a pool
    pool = np.clip((along - reach) / max(1e-3, 1.0 - reach), 0, 1) ** 0.5
    f = depth * pool + 1.2 * (n - 0.5) - (H - y)
    return f, dict(thick=0.55 + 0.35 * s / STAGES)


SWIPES = ((6, 64.0, 7.0, 15.0, 0.4), (7, 46.0, 5.0, 12.0, 2.1), (7, 84.0, 6.0, 13.0, 4.0), (8, 26.0, 8.0, 16.0, 1.2),
          (8, 104.0, 5.0, 14.0, 5.3), (8, 6.0, 4.0, 12.0, 3.3))


def piece_field(s):
    """the spatter (stages two to six, a few more each stage) and then the hand: whole-palm swipes across the plate
    (six, seven, eight), each four fingers wide with the grooves the fingers leave, until it is soaked"""
    x, y, ny, nx = grid('field'); P = PIECES['field']['w']
    f = np.full((ny, nx), -9.0)
    rng = np.random.default_rng(71)
    for i in range(26):
        s0 = 2 + (i % 5)
        cx, cy = rng.random() * P, rng.random() * P
        r = 0.6 + rng.random() * 1.6
        ang = rng.random() * 2 * math.pi; tail = rng.random() * 3.5 * (r > 1.2)   # drawn before the stage test: every
        if s < s0: continue                                                      # stage meets the same specks
        d = r - np.hypot(wrapd(x - cx, P), wrapd(y - cy, P))
        if tail:
            dd, _ = seg_field(x, y, cx, cy, cx + tail * math.cos(ang), cy + tail * math.sin(ang), r * 1.1, 0.35, P)
            d = np.maximum(d, dd)
        f = np.maximum(f, d)
    rag = anoise(ny, nx, 3 * UP, 9 * UP, 85)
    relief = np.zeros((ny, nx))
    for j, (s0, y0, A, w, ph) in enumerate(SWIPES):
        if s < s0: continue
        press = anoise(1, nx, 1, 80 * UP, 90 + j, 1)[0][None, :]             # how hard the palm pressed, along the swipe
        yc = y0 + A * np.sin(2 * math.pi * x / P + ph)                     # a palm's arc, wrapping with the tile
        dy = wrapd(y - yc, P)
        wx = w * (0.65 + 0.55 * press)
        band = wx / 2.0 + 2.6 * (rag - 0.5) - np.abs(dy)
        grooves = 0.5 + 0.5 * np.cos(2 * math.pi * (dy / (w / 4.0)))      # four fingers, four ridges of clay
        # where the palm lifted, only the fingers' ridges still drag clay: the swipe breaks into streaks (a dry brush)
        lift = np.clip((0.42 - press) / 0.3, 0, 1)
        band = np.where(grooves > -0.1 + 1.0 * lift, band, np.minimum(band, -0.3))
        f = np.maximum(f, band)
        relief = np.where(band > 0, np.maximum(relief, grooves), relief)
    if s == 8:                                                             # soaked: what the swipes missed fills in
        soak = anoise(ny, nx, 9 * UP, 42 * UP, 83)
        f = np.maximum(f, (soak - np.quantile(soak, 0.12)) * 40.0)
    return f, dict(thick=0.7 + 0.4 * max(0, s - 5) / 3, relief=np.where(relief > 0, relief, 1.0))
MAKERS = dict(thumb=piece_thumb, hand=piece_hand, top=piece_top, foot=piece_foot, field=piece_field)


# ---------------------------------------------------------------------------------------- thickness and the drying
def erode_depth(m, wrap, steps=6):
    """how many texels in from the clay's edge (0 at the edge, capped), the way it dries from the outside in"""
    depth = np.zeros(m.shape); cur = m.copy()
    for i in range(steps):
        if wrap:
            nb = [np.roll(cur, 1, 0), np.roll(cur, -1, 0), np.roll(cur, 1, 1), np.roll(cur, -1, 1)]
        else:
            p = np.pad(cur, 1); nb = [p[:-2, 1:-1], p[2:, 1:-1], p[1:-1, :-2], p[1:-1, 2:]]
        cur = cur & nb[0] & nb[1] & nb[2] & nb[3]
        depth += cur
    return depth


def clay(name, s):
    """the stage's height (points) and colour (sRGB) per texel"""
    f, ex = MAKERS[name](s)
    m = f > 0
    wrap = PIECES[name]['wrap'] == 'xy'
    if PIECES[name]['wrap'] == 'x':   # wrap along x only: pad the rows, roll the columns
        depth = np.zeros(m.shape); cur = m.copy()
        for i in range(6):
            p = np.pad(cur, ((1, 1), (0, 0)))
            cur = cur & p[:-2] & p[2:] & np.roll(cur, 1, 1) & np.roll(cur, -1, 1); depth += cur
    else:
        depth = erode_depth(m, wrap)
    ny, nx = m.shape
    grain = anoise(ny, nx, 1.2 * UP, 1.2 * UP, 101 + s, 2)
    # thickness: a rounded clay edge a point wide, then the stage's body, worked by the thumb (a little lumpy)
    t = ex['thick'] * np.clip(f / 1.0, 0, 1) ** 0.6 * (0.85 + 0.3 * grain)
    if 'relief' in ex: t = t * (0.55 + 0.45 * ex['relief'])   # a print's ridges stand up out of what filled its valleys
    t = np.where(m, np.maximum(t, 0.18), 0.0)
    u = s / STAGES
    base = FRESH + (DEEP - FRESH) * (u ** 1.2)
    dry = ex.get('dry', 1.0) * np.clip(1.0 - depth / 3.0, 0, 1) ** 1.3   # the outer three texels dry dark, the edge darkest
    col = base[None, None, :] * (1 - dry[..., None]) + DRIED[None, None, :] * dry[..., None]
    col = col * (0.92 + 0.16 * grain[..., None])          # the clay is never one flat colour
    return t, np.clip(col, 0, 1), m


# ----------------------------------------------------------------------------------------------------- the render
def build_mesh(bpy, name, t, col, wrap):
    """the height field as one mesh, its vertices at the texel centres; clay faces only, each vertex its colour"""
    P = PIECES[name]
    ny, nx = t.shape; mt = int(MARGIN * UP)
    ix = np.arange(-mt, nx + mt) if 'x' in wrap else np.arange(nx)
    iy = np.arange(-mt, ny + mt) if 'y' in wrap else np.arange(ny)
    T = t[np.ix_(iy % ny, ix % nx)]; C = col[np.ix_(iy % ny, ix % nx)]
    H, W = T.shape
    xs = (ix + 0.5) / UP; ys = P['h'] - (iy + 0.5) / UP       # Blender's y is up: the piece's top edge at y = h
    Z = np.where(T > 0, T, -0.06)
    keep = (T[:-1, :-1] > 0) | (T[1:, :-1] > 0) | (T[:-1, 1:] > 0) | (T[1:, 1:] > 0)
    jj, ii = np.nonzero(keep)
    used = np.zeros((H, W), bool)
    for dj, di in ((0, 0), (1, 0), (0, 1), (1, 1)): used[jj + dj, ii + di] = True
    vid = -np.ones((H, W), int); vj, vi = np.nonzero(used); vid[vj, vi] = np.arange(len(vj))
    verts = np.stack([xs[vi], ys[vj], Z[vj, vi]], 1)
    faces = np.stack([vid[jj, ii], vid[jj + 1, ii], vid[jj + 1, ii + 1], vid[jj, ii + 1]], 1)
    me = bpy.data.meshes.new(name)
    me.vertices.add(len(verts)); me.vertices.foreach_set('co', verts.astype(np.float32).ravel())
    me.loops.add(len(faces) * 4); me.loops.foreach_set('vertex_index', faces.astype(np.int32).ravel())
    me.polygons.add(len(faces)); me.polygons.foreach_set('loop_start', (np.arange(len(faces)) * 4).astype(np.int32))
    me.polygons.foreach_set('loop_total', np.full(len(faces), 4, np.int32))
    me.update(calc_edges=True); me.validate()
    ca = me.color_attributes.new('clay', 'FLOAT_COLOR', 'POINT')
    lc = np.array([KIT.lin(c) for c in C[vj, vi]])
    ca.data.foreach_set('color', np.hstack([lc, np.ones((len(lc), 1))]).astype(np.float32).ravel())
    me.polygons.foreach_set('use_smooth', np.ones(len(faces), bool))
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    return o, (xs.min(), xs.max(), ys.min(), ys.max())


def clay_material(bpy, G):
    """the guide's matte (roughness, no specular, no metal), its colour the clay's own per vertex"""
    m = bpy.data.materials.new('clay'); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = float(G['roughness_min']); b.inputs['Metallic'].default_value = 0.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = float(G['specular'])
    at = N.new('ShaderNodeAttribute'); at.attribute_name = 'clay'
    L.new(at.outputs['Color'], b.inputs['Base Color'])
    return m


def render_one(name, s, pop, G):
    import bpy
    from PIL import Image
    P = PIECES[name]
    t, col, m = clay(name, s)
    out = os.path.join(SHIP, str(s)); os.makedirs(out, exist_ok=True)
    raw_dir = os.path.join(RAW, str(s)); os.makedirs(raw_dir, exist_ok=True)
    if not m.any():
        Image.new('RGBA', (int(P['w'] * UP), int(P['h'] * UP)), (0, 0, 0, 0)).save(os.path.join(out, name + '.png'), optimize=True)
        return 0.0
    bpy.ops.wm.read_factory_settings(use_empty=True)
    o, (x0, x1, y0, y1) = build_mesh(bpy, name, t, col, P['wrap'])
    o.data.materials.append(clay_material(bpy, G))
    # the tin under it, as a shadow catcher: it shows nothing but the clay's own shadow
    pad = 4.0
    cv = [(x0 - pad, y0 - pad, 0.0), (x1 + pad, y0 - pad, 0.0), (x1 + pad, y1 + pad, 0.0), (x0 - pad, y1 + pad, 0.0)]
    cm = bpy.data.meshes.new('tin'); cm.from_pydata(cv, [], [[0, 1, 2, 3]]); cm.update()
    catcher = bpy.data.objects.new('tin', cm); bpy.context.scene.collection.objects.link(catcher); catcher.is_shadow_catcher = True
    KIT.light_camera(bpy, G, P['w'], P['h'], 0.0)
    sc = bpy.context.scene
    sc.render.resolution_x = int(P['w'] * UP); sc.render.resolution_y = int(P['h'] * UP)
    with_sh = os.path.join(raw_dir, name + '_shadow.png'); sc.render.filepath = with_sh; bpy.ops.render.render(write_still=True)
    catcher.hide_render = True
    bare = os.path.join(raw_dir, name + '_clay.png'); sc.render.filepath = bare; bpy.ops.render.render(write_still=True)
    a = KIT.post(bare, float(G['ring']), pop)                         # the kit's post: hard edge, the ring, his colours
    sh = np.asarray(Image.open(with_sh).convert('RGBA')).astype(float)
    clay_px = a[..., 3] > 0
    shadow = (~clay_px) & (sh[..., 3] > 0.18 * 255)                 # the clay's shadow on the tin, one hard value
    a[shadow] = (10, 6, 3, 150)                                        # the kit's own shadow colour (KIT_SHADOW)
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(out, name + '.png'), optimize=True)
    return float(clay_px.mean())


def nine(piece, W, H):
    """a kit piece laid at W x H texels from its nine shipped pictures, the way the browser lays them"""
    from PIL import Image
    d = os.path.join(R, 'slices/ui_kit', piece); k = json.load(open(os.path.join(R, 'slices/ui_kit/kit.json')))[piece]
    t, r, b, l = [v * k['up'] for v in k['ins']]
    im = {n: Image.open(os.path.join(d, n + '.png')).convert('RGBA') for n in ('tl', 't', 'tr', 'l', 'c', 'r', 'bl', 'b', 'br')}
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for yy in range(t, H - b, im['c'].height):
        for xx in range(l, W - r, im['c'].width): out.alpha_composite(im['c'], (xx, yy))
    for xx in range(l, W - r, im['t'].width): out.alpha_composite(im['t'], (xx, 0)); out.alpha_composite(im['b'], (xx, H - b))
    for yy in range(t, H - b, im['l'].height): out.alpha_composite(im['l'], (0, yy)); out.alpha_composite(im['r'], (W - r, yy))
    out.alpha_composite(im['tl'], (0, 0)); out.alpha_composite(im['tr'], (W - r, 0)); out.alpha_composite(im['bl'], (0, H - b)); out.alpha_composite(im['br'], (W - r, H - b))
    return out


def sheet():
    """every stage of every piece, laid on the kit's tin, the receipt and the phone's dark card: the record's picture"""
    from PIL import Image
    tiles = {base: None for base in ('tin', 'receipt')}
    rows = []
    W, Hh = 180 * UP, 44 * UP
    for s in range(0, STAGES + 1):
        row = Image.new('RGBA', (3 * (W + 8 * UP), Hh + 6 * UP), (40, 32, 24, 255))
        for k, base in enumerate(('tin', 'receipt', 'phone')):
            if base == 'phone': b = Image.new('RGBA', (W, Hh), (28, 26, 22, 255))
            else: b = nine(base, W, Hh)
            if s:
                lay = Image.new('RGBA', (W, Hh), (0, 0, 0, 0))
                def put(name, x, y, rep=''):
                    im = Image.open(os.path.join(SHIP, str(s), name + '.png'))
                    if rep == 'x':
                        for xx in range(0, W, im.width): lay.alpha_composite(im, (xx, y))
                    elif rep == 'xy':   # its middle row on the button's middle, the way the browser lays it
                        for yy in range((Hh // 2 - im.height // 2) % im.height - im.height, Hh, im.height):
                            for xx in range(0, W, im.width): lay.alpha_composite(im, (xx, yy))
                    else: lay.alpha_composite(im, (x, y))
                put('field', 0, 0, 'xy'); put('foot', 0, Hh - PIECES['foot']['h'] * UP, 'x'); put('top', 0, 0, 'x')
                put('hand', W - PIECES['hand']['w'] * UP, 0); put('thumb', 2 * UP, (Hh - PIECES['thumb']['h'] * UP) // 2)
                b = Image.alpha_composite(b, lay)
            row.alpha_composite(b, (k * (W + 8 * UP) + 4 * UP, 3 * UP))
        rows.append(row)
    out = Image.new('RGBA', (rows[0].width, sum(r.height for r in rows)), (40, 32, 24, 255))
    y = 0
    for r in rows: out.alpha_composite(r, (0, y)); y += r.height
    out.save(os.path.join(R, 'records/target/UI_THE_BLOOD_IS_CRASHBOX_10_26_26.png'), optimize=True)


def main():
    import bohemia_direction_master_rig as RIG
    G = RIG.G
    os.makedirs(RAW, exist_ok=True)
    cache = os.path.join(R, 'records/target/ui_crashbox_kit', 'population_prop.npy')
    if os.path.exists(cache): pop = np.load(cache)
    else:
        pop = RIG.population('prop')[0]; np.save(cache, pop)
    names = [a for a in sys.argv[1:] if a in PIECES] or ORDER
    cover = {}
    for s in range(1, STAGES + 1):
        for n in names:
            cover['%d/%s' % (s, n)] = round(render_one(n, s, pop, G), 4)
            print('  stage', s, n, cover['%d/%s' % (s, n)], flush=True)
    kit_path = os.path.join(R, 'slices/ui_kit/kit.json')
    kit = json.load(open(kit_path))
    kit['blood'] = dict(stages=STAGES, up=UP, pieces={k: dict(w=v['w'], h=v['h'], wrap=v['wrap']) for k, v in PIECES.items()},
                        cover=cover, kind='clay', sun=dict(screen_deg=KIT.SUN_SCREEN, elev_deg=KIT.SUN_ELEV), tilt_deg=KIT.TILT,
                        samples=int(G['samples']), engine='CYCLES', snap=KIT.SNAP)
    json.dump(kit, open(kit_path, 'w'), indent=1)
    if '--no-sheet' not in sys.argv: sheet()
    print('wrote', os.path.relpath(kit_path, R))


if __name__ == '__main__':
    main()
