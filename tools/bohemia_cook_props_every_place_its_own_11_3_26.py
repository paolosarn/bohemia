#!/usr/bin/env python3
"""BOHEMIA -- COOK PROPS [every place its own things] 11/3/26 (rule 341 THE FIGHT MAPS ARE NOT DONE: TRUE VARIETY; rule 337
NO MORE CONTENT WITHOUT ITS ASSETS; ask line 350).
Paolo 11/3: 'everything just looked exactly the same as the main suburb shit we have... nothing made them uniquely unique,
nothing made them fun to do, no variety, like true variety, recycled hogwash.'

WHAT IT IS. The THINGS that stand on each place's fight board, so every place is known in one look: each one a real model at
its real size in metres, built the way the props modeller builds (tools/bohemia_cook_model_props.py: puppet shapes, every base
colour a step of one role of DIRECTION's palette, roughness 1, specular 0), exported as a .glb the board's renderer imports,
and shot ALONE from the fight camera through the master rig (its source pass and dents, the vertical stretch, one sun, the
film; orthographic, tilted 45, facing north, 42.92 px a metre, the block's own ruler) onto a shadow catcher, so its picture
is a cover sprite at the fight's scale with its own shadow and its ground point named. COMBAT MAPS 3 lays the boards and
places these; this lane never lays a board.

THE CONTRACT (records/target/fight_props/manifest.json, one entry a model): the place, the name, the model file, its size in
metres, its footprint in cells (a cell is the fight's 12 m house tile), its height in storeys (3 m), cover / blocking / none,
sees through or not, the fight's own words for it (kind COVER, LOW_COVER, HEIGHT, MOUND or NONE; the tile code '#', 'H',
'r' or '.'; blocks_move, blocks_sight, see_through, burns), and its picture from the fight camera with its ground pixel.

THE CARD (the VOTE tab, one a place): the place's things together on a 32 m patch of the place's OWN ground (the floor tool's
build() with COMBAT MAPS 2's ground materials), one render from the game's camera.

  <venv>/bin/python tools/bohemia_cook_props_every_place_its_own_11_3_26.py models <place> ...   (the .glb and the lone shots)
  <venv>/bin/python tools/bohemia_cook_props_every_place_its_own_11_3_26.py card <place> ...     (the place's card)
  python3 tools/bohemia_cook_props_every_place_its_own_11_3_26.py manifest                        (the contract, from the ledgers)
  venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy

ANALOG HORROR (the 9/20 law, at the source, never gore, never a filter): one wrong thing a place, nothing remarks on it;
each prop's 'wrong' line in the manifest names it (the lab's cold-store truck still running, frost on its doors in the
desert; every suitcase on the airport's carts the same suitcase; the golf flag new, bright and standing out with no wind).

REFERENCE CHECK (the 9/4 standing law): the real things at their real sizes: Beechcraft 1900D (17.6 m long, 17.7 m span),
an airport refueller (a 5,000 gallon tank on a two-axle chassis), Harry Reid's baggage tugs and carts, a jet bridge's
rotunda, tunnel, drive column and service stair, a steel-frame hangar's sliding doors; a vivarium's steel holding cages
and an animal lab's portable decon shower, a reefer box truck, 2.4 m security chain-link with its barbed V-arms; a Las
Vegas desert-modern clubhouse with a tile mansard and a portico, an E-Z-GO style cart, a Washingtonia robusta 12 m tall
with its skirt of dead fronds, a tee's ball washer. Each prop's picture sits beside the board it stands on (the place's
old block, the twin on its VOTE card). No reference game; Battle Brothers only for how big a blocker reads on a tile.
REUSE CHECK (REUSE-FIRST): the props modeller's palette materials (mat); the master rig's source_pass, dent_pass and
light_and_film; the floor tool's build(), heights, stones and camera numbers; COMBAT MAPS 2's ground materials (install());
the fight's own cover vocabulary in fight_ground.json (kind, blocks_move, blocks_sight, see_through, burns). Existing
models are imported whole where a place needs one (fence, cart, dumpster, dozer, gantry, propane, trailer), never remodelled.
"""
import os, sys, json, math, time
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
MODELS = os.path.join(R, 'reference/models/bohemia/fight_props')
KIT = os.path.join(R, 'reference/models/bohemia')
OUT = os.path.join(R, 'records/target/fight_props')
PPM = 515 / 12.0                     # the block's own ruler: a 12 m house tile is 515 px
CELL, STOREY = 12.0, 3.0
TILT = 45.0
CARD_SIDE = 32.0
PROP_WEAR = 0.6                      # the rig's own prop wear (the board's ground keeps the floor tool's 0.25)

# the places, worst first (the record's order)
PLACES = [('lab', 'THE LAB YARD'), ('airport', 'THE AIRPORT'), ('golf', 'THE GOLF COURSE'), ('trailer', 'THE TRAILER PARK'),
          ('desert', 'THE DESERT'), ('redrock', 'RED ROCK'), ('pass', 'THE PASS'), ('shore', 'THE SHORE'), ('wash', 'THE WASH'),
          ('suburbs', 'THE SUBURBS'), ('landfill', 'THE LANDFILL'), ('strip', 'THE STRIP'), ('downtown', 'DOWNTOWN'),
          ('works', 'THE WORKS'), ('marina', 'THE MARINA')]
PLACE_NAME = dict(PLACES)

PROPS = {}


def prop(pid, name, role, kind, tile, see=False, landmark=False, burns=False, sight=None, what='', wrong='', hole=None):
    """role: cover | blocking | none (the brief's three); kind: the fight's own (COVER, LOW_COVER, HEIGHT, MOUND, NONE)"""
    def deco(fn):
        PROPS[pid] = dict(id=pid, place=pid.split('.')[0], name=name, fn=fn, role=role, kind=kind, tile=tile, see=see,
                          landmark=landmark, burns=burns, sight=(role in ('blocking', 'cover') and not see and kind != 'LOW_COVER') if sight is None else sight,
                          what=what, wrong=wrong, hole=hole)
        return fn
    return deco


# ======================================================================================================================
# THE MODELLER'S HANDS (only under Blender's python)
# ======================================================================================================================
bpy = mu = None
OBJS, MC = [], {}


def M(role, step=2, glow=0.0):
    """a palette material, cached per scene (the props modeller's own recipe; named so the rig's wear table never reads a
    road in it)"""
    import bohemia_cook_model_props as PM
    k = (role, step, glow)
    if k not in MC or MC[k].name not in bpy.data.materials:
        MC[k] = PM.mat(bpy, 'fp_%s_%d%s' % (role.replace('metal_painted', 'metalp'), step, '_lit' if glow else ''), role, step, glow)
    return MC[k]


def _take(o, name, m):
    o.name = name; o.data.materials.append(m); OBJS.append(o); return o


def B(m, size, loc, rot=(0, 0, 0), name='b'):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.scale = size
    return _take(o, name, m)


def C(m, r, d, loc, rot=(0, 0, 0), v=12, r2=None, name='c'):
    if r2 is None: bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=d, location=loc, rotation=rot)
    else: bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r, radius2=r2, depth=d, location=loc, rotation=rot)
    return _take(bpy.context.active_object, name, m)


def S(m, r, loc, sc=(1, 1, 1), seg=12, ring=7, name='s'):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=ring)
    o = bpy.context.active_object; o.scale = sc
    return _take(o, name, m)


def _aim(p0, p1):
    p0, p1 = mu.Vector(p0), mu.Vector(p1); d = p1 - p0
    return (p0 + p1) / 2, d.length, mu.Vector((0, 0, 1)).rotation_difference(d.normalized()).to_euler()


def ROD(m, p0, p1, r, v=6, name='rod'):
    c, L, e = _aim(p0, p1)
    return C(m, r, L, c, e, v, name=name)


def BAR(m, p0, p1, w, h=None, name='bar'):
    c, L, e = _aim(p0, p1)
    return B(m, (w, h or w, L), c, e, name)


def MESH(m, verts, faces, name='mesh'):
    import bmesh
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces]); me.update()
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    return _take(o, name, m)


def POLY(m, pts, depth, plane='xz', loc=(0, 0, 0), rot=(0, 0, 0), name='poly'):
    """a flat shape extruded: 'xz' a profile (x, z) pushed along y, centred; 'xy' a plan (x, y) raised 0..depth in z"""
    n = len(pts); V = []
    for a, b in pts:
        if plane == 'xz': V += [(a, -depth / 2, b), (a, depth / 2, b)]
        else: V += [(a, b, 0.0), (a, b, depth)]
    F = [[2 * i for i in range(n)], [2 * i + 1 for i in range(n)][::-1]]
    F += [[2 * i, 2 * ((i + 1) % n), 2 * ((i + 1) % n) + 1, 2 * i + 1] for i in range(n)]
    o = MESH(m, V, F, name); o.location = loc; o.rotation_euler = rot
    return o


def LOFT(m, st, n=16, p=2.0, vee=0.0, flat=0.0, name='loft'):
    """a body of rings along x: st = [(x, half_width, half_height, z_centre)]; p the ring's squareness (2 an ellipse);
    vee pulls the bottom to a keel; flat cuts the bottom flat at that share of the half height"""
    V, F = [], []
    for (x, hw, hh, zc) in st:
        for k in range(n):
            a = 2 * math.pi * k / n; c, s = math.cos(a), math.sin(a)
            y = math.copysign(abs(c) ** (2 / p), c) * hw; z = math.copysign(abs(s) ** (2 / p), s)
            if z < 0: y *= 1 - vee * abs(z)
            if flat and z < -flat: z = -flat
            V.append((x, y, zc + z * hh))
    for i in range(len(st) - 1):
        for k in range(n):
            a, b = i * n + k, i * n + (k + 1) % n
            F.append([a, b, b + n, a + n])
    F.append(list(range(n))[::-1]); F.append([(len(st) - 1) * n + k for k in range(n)])
    return MESH(m, V, F, name)


def ROCK(m, loc, size, seed, sub=3, rough=0.28, sink=0.12, name='rock'):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1.0, location=(0, 0, 0))
    o = bpy.context.active_object; off = mu.Vector((seed * 3.17, seed * 1.31, seed * 2.03))
    for v in o.data.vertices:
        n1 = mu.noise.noise(v.co * 1.3 + off); n2 = mu.noise.noise(v.co * 3.1 + off * 2)
        v.co *= 1 + rough * n1 + rough * 0.35 * n2
        v.co.x *= size[0] / 2; v.co.y *= size[1] / 2; v.co.z = max(v.co.z * size[2], -size[2] * 0.25)
    zmin = min(v.co.z for v in o.data.vertices)
    for v in o.data.vertices: v.co.z += -zmin - sink * size[2]
    o.location = loc
    return _take(o, name, m)


def RIBBONS(m, segs, w, name='wire'):
    """thin flat strips in a plane, one quad each: segs = [((x0,y0,z0), (x1,y1,z1), (nx,ny,nz))], the strip lies across n"""
    V, F = [], []
    for a, b, nrm in segs:
        a, b, nrm = mu.Vector(a), mu.Vector(b), mu.Vector(nrm)
        side = (b - a).cross(nrm).normalized() * (w / 2)
        i = len(V); V += [a - side, b - side, b + side, a + side]; F.append([i, i + 1, i + 2, i + 3])
    return MESH(m, V, F, name)


def CHAIN(m, p0, p1, z0, z1, pitch=0.1, w=0.011, name='chainlink'):
    """chain-link diamond fabric between two ground points, from z0 to z1: two sets of diagonal wires, clipped"""
    p0, p1 = mu.Vector((p0[0], p0[1], 0.0)), mu.Vector((p1[0], p1[1], 0.0)); u = p1 - p0; L = u.length; ud = u.normalized()
    nrm = ud.cross(mu.Vector((0, 0, 1))); H = z1 - z0; segs = []
    for sgn in (1, -1):
        c = -H
        while c < L:
            pts = []
            for (s, z) in ((c, 0), (c + H, H)) if sgn > 0 else ((c + H, 0), (c, H)):
                pts.append((s, z))
            (sa, za), (sb, zb) = pts
            # clip the line to 0 <= s <= L
            def at(s): return za + (zb - za) * (s - sa) / (sb - sa)
            lo, hi = sorted((sa, sb))
            s0, s1 = max(lo, 0.0), min(hi, L)
            if s1 > s0 + 1e-3:
                A = p0 + ud * s0; Bv = p0 + ud * s1
                segs.append(((A.x, A.y, z0 + at(s0)), (Bv.x, Bv.y, z0 + at(s1)), tuple(nrm)))
            c += pitch
    return RIBBONS(m, segs, w, name)


def STAINS(face, n, seed, roles=(('clay_rust', 0), ('clay_rust', 1), ('rubber', 1)), r=(0.12, 0.38)):
    """rust and grime as ragged patches on a face (the props modeller's blotch: a stain, never a square):
    face = (cx, cy, cz, sx, sy, axis) where axis 'z' is a face looking up at height cz, '-y' / '+y' / '-x' / '+x' a wall"""
    import random, bohemia_cook_model_props as PM
    rnd = random.Random(seed); cx, cy, cz, sx, sy, ax = face
    for i in range(n):
        u, v = rnd.uniform(-0.5, 0.5) * sx, rnd.uniform(-0.5, 0.5) * sy
        rr = rnd.uniform(*r); m = M(*roles[rnd.randrange(len(roles))])
        if ax == 'z': loc, rot = (cx + u, cy + v, cz + 0.006), (0, 0, rnd.uniform(0, 3))
        elif ax in ('-y', '+y'): loc, rot = (cx + u, cy + (-0.006 if ax == '-y' else 0.006), cz + v), (math.pi / 2, rnd.uniform(0, 3), 0)
        else: loc, rot = (cx + (-0.006 if ax == '-x' else 0.006), cy + u, cz + v), (0, math.pi / 2, rnd.uniform(0, 3))
        OBJS.append(PM.blotch(bpy, 'stain', m, rr, loc, rot, seed * 31 + i, thick=0.01))


def MARK():
    return len(OBJS)


def MOVE(i0, loc=(0, 0, 0), rot=(0, 0, 0), about=(0, 0, 0)):
    """move everything built since MARK(): turned about a point, then shifted"""
    T = mu.Matrix.Translation(mu.Vector(loc) + mu.Vector(about)) @ mu.Euler(rot).to_matrix().to_4x4() @ mu.Matrix.Translation(-mu.Vector(about))
    for o in OBJS[i0:]: o.matrix_basis = T @ o.matrix_basis


def WHEEL(r, w, loc, axis='y', flat=0.0, name='wheel'):
    rot = (math.pi / 2, 0, 0) if axis == 'y' else (0, math.pi / 2, 0)
    t = C(M('rubber', 1), r, w, loc, rot, 14, name=name + '_tyre')
    C(M('tape_grey', 2), r * 0.55, w + 0.02, loc, rot, 10, name=name + '_hub')
    return t


def IMPORT(fn, loc=(0, 0, 0), rot=(0, 0, 0), scale=1.0):
    """an existing model of the kit, whole (REUSE-FIRST): its meshes joined into this prop"""
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(KIT, fn))
    new = [o for o in bpy.context.scene.objects if o not in before]
    for o in list(new):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True); new.remove(o)
    meshes = [o for o in new if o.type == 'MESH']
    bpy.context.view_layer.update()
    T = mu.Matrix.Translation(loc) @ mu.Euler(rot).to_matrix().to_4x4() @ mu.Matrix.Scale(scale, 4)
    for o in meshes:
        mw = o.matrix_world.copy(); o.parent = None; o.matrix_basis = T @ mw; OBJS.append(o)
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o, do_unlink=True)
    return meshes


def join(name):
    """the prop as ONE mesh, its origin its ground centre (0, 0, 0), its parts' materials kept"""
    bpy.ops.object.select_all(action='DESELECT')
    live = [o for o in OBJS if o.name in bpy.context.scene.objects]
    for o in live: o.select_set(True)
    bpy.context.view_layer.objects.active = live[0]
    if len(live) > 1: bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.name = name; o.data.name = name
    OBJS.clear()
    return o


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    OBJS.clear(); MC.clear()


def build(pid):
    OBJS.clear()
    PROPS[pid]['fn']()
    return join(pid.replace('.', '_'))


# ======================================================================================================================
# 1. THE LAB YARD: where the beasts came out (the 9/29 law: every beast broke out of its lab when the dollar died)
# ======================================================================================================================
@prop('lab.cage_block', 'THE CAGE BLOCK', 'blocking', 'COVER', '#', see=True, landmark=True,
      what='four steel holding cages on a concrete plinth under a lean-to roof, numbered; cage three burst open from inside, '
           'its door torn off and thrown out into the yard, the bars beside it bowed out',
      wrong='the bars of cage three are bent OUTWARD, toward you; the straw is dragged out after it')
def lab_cage_block():
    conc, steel, frame, roof, plate, straw, bowl = (M('tape_grey', 3), M('metal_painted', 2), M('metal_painted', 1), M('tape_grey', 2),
                                                    M('clay_mustard', 3), M('clay_mustard', 2), M('chrome', 0))
    CW, CD, CH, N = 2.5, 2.6, 2.2, 4
    L = CW * N + 0.5
    B(conc, (L, CD + 0.9, 0.25), (0, 0.15, 0.125), name='plinth')
    x0, y0, y1, z0 = -CW * N / 2, -CD / 2, CD / 2, 0.25
    z1 = z0 + CH

    def bars(xa, xb, ya, yb, skip=None, bow=None):
        n = max(2, int(round(math.hypot(xb - xa, yb - ya) / 0.13)))
        for k in range(1, n):
            t = k / n; x, y = xa + (xb - xa) * t, ya + (yb - ya) * t
            if skip and skip[0] < x < skip[1]: continue
            if bow:
                d = bow(x)
                zm = z0 + CH * 0.55
                ROD(steel, (x, y, z0), (x + d * 0.2, y - d, zm), 0.013, 5); ROD(steel, (x + d * 0.2, y - d, zm), (x, y, z1), 0.013, 5)
            else:
                ROD(steel, (x, y, z0), (x, y, z1), 0.013, 5)

    for i in range(N):
        xa, xb = x0 + i * CW, x0 + (i + 1) * CW
        for x in (xa, xb):
            for y in (y0, y1): B(frame, (0.09, 0.09, CH), (x, y, z0 + CH / 2), name='post')
        for y in (y0, y1):
            B(frame, (CW, 0.09, 0.09), ((xa + xb) / 2, y, z1)); B(frame, (CW, 0.09, 0.09), ((xa + xb) / 2, y, z0 + 0.05))
        B(frame, (0.09, CD, 0.09), (xb, 0, z1))
        if i == 0: B(frame, (0.09, CD, 0.09), (xa, 0, z1)); bars(xa, xa, y0, y1)
        B(steel, (CW - 0.05, CD - 0.05, 0.03), ((xa + xb) / 2, 0, z1 + 0.04), name='lid')
        bars(xa, xb, y1, y1)                                  # the back
        bars(xb, xb, y0, y1)                                  # the divider (the last is the end wall)
        dx0, dx1 = xa + 0.7, xa + 1.75
        B(plate, (0.42, 0.03, 0.24), ((xa + xb) / 2 + 0.2, y0 - 0.06, z1 - 0.16), name='number')
        B(M('cloth_black', 1), (0.06, 0.032, 0.14), ((xa + xb) / 2 + 0.2 + (i - 1.5) * 0.04, y0 - 0.075, z1 - 0.16), name='numeral')
        C(bowl, 0.19, 0.09, (xa + 0.5, y1 - 0.5, z0 + 0.045), v=12, name='bowl')
        if i != 2:
            bars(xa, xb, y0, y0, skip=(dx0 - 0.02, dx1 + 0.02))
            B(frame, (0.07, 0.07, CH - 0.1), (dx0, y0 - 0.03, z0 + CH / 2), name='jamb'); B(frame, (0.07, 0.07, CH - 0.1), (dx1, y0 - 0.03, z0 + CH / 2))
            # the shut door: its frame and bars, its slide bolt and a padlock
            B(frame, (dx1 - dx0, 0.05, 0.06), ((dx0 + dx1) / 2, y0 - 0.06, z0 + 0.1)); B(frame, (dx1 - dx0, 0.05, 0.06), ((dx0 + dx1) / 2, y0 - 0.06, z1 - 0.12))
            for k in range(1, 8):
                x = dx0 + (dx1 - dx0) * k / 8; ROD(steel, (x, y0 - 0.06, z0 + 0.1), (x, y0 - 0.06, z1 - 0.12), 0.013, 5)
            B(M('chrome', 1), (0.22, 0.05, 0.05), (dx1 - 0.05, y0 - 0.1, z0 + 1.05), name='bolt')
            B(M('clay_mustard', 1), (0.06, 0.04, 0.08), (dx1 + 0.08, y0 - 0.12, z0 + 0.98), name='padlock')
            B(straw, (CW * 0.8, CD * 0.6, 0.04), ((xa + xb) / 2 - 0.1, 0.25, z0 + 0.02), name='straw')
        else:
            # THE BURST CAGE: the front bars bowed out by what pushed through, most at the door
            bars(xa, xb, y0, y0, skip=(dx0 - 0.15, dx1 + 0.15), bow=lambda x: max(0.0, 0.42 - abs(x - (dx0 + dx1) / 2) * 0.35))
            B(frame, (0.07, 0.07, CH - 0.1), (dx0 - 0.1, y0 - 0.15, z0 + CH / 2), rot=(math.radians(-8), 0, 0), name='jamb_bent')
            B(frame, (dx1 - dx0 + 0.4, 0.09, 0.09), ((dx0 + dx1) / 2, y0 - 0.12, z1 - 0.02), rot=(0, 0, 0), name='lintel')
            # the door, torn off and thrown 2 m out into the yard, landed on its face at an angle
            d = MARK()
            B(frame, (dx1 - dx0, 0.05, 0.06), (0, 0, 0.0)); B(frame, (dx1 - dx0, 0.05, 0.06), (0, 0, CH - 0.2))
            B(frame, (0.06, 0.05, CH - 0.2), (-(dx1 - dx0) / 2, 0, (CH - 0.2) / 2)); B(frame, (0.06, 0.05, CH - 0.2), ((dx1 - dx0) / 2, 0, (CH - 0.2) / 2))
            for k in range(1, 8):
                x = -(dx1 - dx0) / 2 + (dx1 - dx0) * k / 8
                ROD(steel, (x, 0, 0), (x + (0.06 if k in (3, 4) else 0.0), -0.12 if k in (3, 4) else 0, CH - 0.2), 0.013, 5)
            B(M('chrome', 1), (0.22, 0.05, 0.05), ((dx1 - dx0) / 2 - 0.05, -0.04, 0.95))
            MOVE(d, loc=((dx0 + dx1) / 2 + 0.6, y0 - 2.3, 0.07), rot=(math.radians(-86), math.radians(4), math.radians(28)))
            # the straw dragged out after it, through the door and across the plinth's lip into the yard
            for k, (sx, sy, w) in enumerate(((0.0, 0.3, 1.2), (0.15, -0.6, 0.9), (0.35, -1.4, 0.7), (0.55, -2.1, 0.5))):
                B(straw, (w, 0.8, 0.035), ((dx0 + dx1) / 2 + sx, sy, (z0 + 0.02) if sy > y0 else 0.02), rot=(0, 0, math.radians(10 * k)), name='straw_out')
    # the lean-to: three posts high at the back, three low at the front, a corrugated sheet roof falling to the front
    yb, yf, hb, hf = y1 + 0.35, y0 - 0.45, 3.35, 2.85
    for x in (-L / 2 + 0.1, 0.0, L / 2 - 0.1):
        B(frame, (0.1, 0.1, hb), (x, yb, hb / 2), name='roofpost'); B(frame, (0.1, 0.1, hf), (x, yf, hf / 2), name='roofpost')
        BAR(frame, (x, yf, hf), (x, yb, hb), 0.08, 0.12, name='rafter')
    run = math.hypot(yb - yf, hb - hf); ang = math.atan2(hb - hf, yb - yf)
    for y in (yf + 0.6, (yf + yb) / 2, yb - 0.6):                 # the purlins the sheets sit on
        BAR(M('clay_rust', 2), (-L / 2 - 0.1, y, hf + (hb - hf) * (y - yf) / (yb - yf) + 0.07), (L / 2 + 0.1, y, hf + (hb - hf) * (y - yf) / (yb - yf) + 0.07), 0.06, 0.08, name='purlin')
    ns = int(round((L + 0.3) / 1.05))
    for k in range(ns):
        x = -(L + 0.3) / 2 + (k + 0.5) * (L + 0.3) / ns
        if 0.9 < x < 2.6: continue                              # the sheets over the burst cage are gone: from above you see in
        tone = roof if k % 3 else M('tape_grey', 1)
        B(tone, (1.02, run + 0.4, 0.03), (x, (yb + yf) / 2, (hb + hf) / 2 + 0.12), rot=(ang, 0, 0), name='sheet')
        for j in range(4): B(tone, (0.05, run + 0.4, 0.04), (x - 0.38 + j * 0.25, (yb + yf) / 2, (hb + hf) / 2 + 0.15), rot=(ang, 0, 0), name='rib')
        STAINS((x, (yb + yf) / 2, (hb + hf) / 2 + 0.14, 0.9, run * 0.9, 'z'), 2, 100 + k)
    # one of the missing sheets hangs off the front edge by a corner
    B(M('tape_grey', 1), (1.02, run * 0.8, 0.03), (2.2, yf - 0.55, hf - 1.0), rot=(math.radians(-70), math.radians(12), 0), name='sheet_hanging')


@prop('lab.gurneys', 'TWO GURNEYS', 'none', 'NONE', '.',
      what='two transport gurneys: one standing with its straps still buckled across an empty mattress and its drip pole, '
           'one knocked over on its side with its mattress slid off',
      wrong='the standing gurney\'s straps are buckled shut, tight, across nothing')
def lab_gurneys():
    steel, chrome, pad, strap, black = M('tape_grey', 2), M('chrome', 1), M('clay_teal', 2), M('cloth_black', 2), M('rubber', 1)

    def gurney():
        L, W, Z = 2.0, 0.62, 0.82
        for sx in (-1, 1):
            BAR(chrome, (-L / 2, sx * W / 2, Z - 0.05), (L / 2, sx * W / 2, Z - 0.05), 0.04, name='rail')
            BAR(chrome, (-L / 2 + 0.25, sx * W / 2 - 0.02, Z + 0.25), (L / 2 - 0.25, sx * W / 2 - 0.02, Z + 0.25), 0.025, name='siderail')
            for x in (-L / 2 + 0.25, L / 2 - 0.25): ROD(chrome, (x, sx * W / 2 - 0.02, Z - 0.05), (x, sx * W / 2 - 0.02, Z + 0.25), 0.012, 5)
            # the scissor legs
            ROD(steel, (-0.55, sx * 0.26, 0.16), (0.55, sx * 0.26, Z - 0.08), 0.022, 6); ROD(steel, (0.55, sx * 0.26, 0.16), (-0.55, sx * 0.26, Z - 0.08), 0.022, 6)
        for x in (-0.55, 0.55):
            BAR(steel, (x, -0.28, 0.14), (x, 0.28, 0.14), 0.05)
            for y in (-0.26, 0.26): C(black, 0.07, 0.05, (x, y, 0.07), (math.pi / 2, 0, 0), 10, name='caster')
        B(steel, (L, W, 0.04), (0, 0, Z - 0.02), name='deck')
        B(pad, (L - 0.06, W - 0.06, 0.12), (0, 0, Z + 0.06), name='mattress')
        B(pad, (0.5, W - 0.1, 0.1), (-L / 2 + 0.32, 0, Z + 0.15), rot=(0, math.radians(-18), 0), name='backrest')
        return L, W, Z

    L, W, Z = gurney()
    for x in (-0.35, 0.35):                                     # the straps buckled across nothing, pulled flat to the pad
        B(strap, (0.07, W + 0.04, 0.025), (x, 0, Z + 0.13), name='strap'); B(chrome, (0.08, 0.06, 0.035), (x, -0.08, Z + 0.14), name='buckle')
    ROD(chrome, (-L / 2 + 0.05, W / 2 + 0.05, Z), (-L / 2 + 0.05, W / 2 + 0.05, 2.05), 0.015, 6, name='drip_pole')
    for a in (0, math.pi):
        ROD(chrome, (-L / 2 + 0.05, W / 2 + 0.05, 2.05), (-L / 2 + 0.05 + 0.16 * math.cos(a), W / 2 + 0.05, 2.12), 0.008, 5)
    B(M('tape_grey', 4), (0.12, 0.03, 0.2), (-L / 2 + 0.17, W / 2 + 0.05, 1.93), name='bag_empty')
    d = MARK(); gurney()
    MOVE(d, rot=(math.radians(90), 0, 0), about=(0, -0.31, 0.0)); MOVE(d, loc=(0.6, 1.6, 0.0), rot=(0, 0, math.radians(14)))
    B(pad, (1.9, 0.56, 0.12), (0.9, 0.5, 0.06), rot=(0, 0, math.radians(31)), name='mattress_off')


@prop('lab.decon', 'THE DECON SHOWER', 'none', 'NONE', '.', sight=True,
      what='a portable decontamination shower: a tube frame under a sheet roof, plastic curtains on three sides (one torn '
           'open), two shower roses, a yellow catch berm, its pump on a skid with the hoses run out, a hazmat suit hung on the frame',
      wrong='')
def lab_decon():
    tube, sheet, berm, pump, hose, suit = M('tape_grey', 3), M('tape_grey', 4), M('clay_mustard', 3), M('clay_teal', 1), M('rubber', 2), M('clay_mustard', 4)
    S2, Hh = 2.2, 2.4
    # the berm: a low yellow wall round a square pan
    for (cx, cy, sx, sy) in ((0, -1.35, 2.9, 0.22), (0, 1.35, 2.9, 0.22), (-1.35, 0, 0.22, 2.5), (1.35, 0, 0.22, 2.5)):
        B(berm, (sx, sy, 0.26), (cx, cy, 0.13), name='berm')
    B(M('tape_grey', 2), (2.5, 2.5, 0.02), (0, 0, 0.012), name='pan')
    for x in (-S2 / 2, S2 / 2):
        for y in (-S2 / 2, S2 / 2): ROD(tube, (x, y, 0.0), (x, y, Hh), 0.03, 8, name='leg')
    for (a, b) in (((-1, -1), (1, -1)), ((-1, 1), (1, 1)), ((-1, -1), (-1, 1)), ((1, -1), (1, 1))):
        ROD(tube, (a[0] * S2 / 2, a[1] * S2 / 2, Hh), (b[0] * S2 / 2, b[1] * S2 / 2, Hh), 0.03, 8, name='top')
    B(sheet, (S2 + 0.3, S2 + 0.3, 0.04), (0, 0, Hh + 0.12), rot=(0, math.radians(4), 0), name='roof')
    STAINS((0, 0, Hh + 0.2, S2, S2, 'z'), 6, 11, (('clay_bone', 0), ('rubber', 1), ('clay_mustard', 0)), (0.2, 0.5))
    for x in (-0.45, 0.45):
        ROD(tube, (x, -S2 / 2, Hh - 0.02), (x, S2 / 2, Hh - 0.02), 0.02, 6, name='spray_bar')
        C(M('chrome', 1), 0.09, 0.07, (x, 0, Hh - 0.1), v=10, r2=0.03, name='rose')
    # curtains: the back and the left whole, the right torn half away (the front is the open way in)
    B(sheet, (S2, 0.02, Hh - 0.25), (0, S2 / 2, Hh / 2 + 0.1), name='curtain')
    B(sheet, (0.02, S2, Hh - 0.25), (-S2 / 2, 0, Hh / 2 + 0.1), name='curtain')
    B(sheet, (0.02, S2 * 0.45, Hh - 0.25), (S2 / 2, S2 * 0.27, Hh / 2 + 0.1), name='curtain')
    B(sheet, (0.02, 0.5, 0.9), (S2 / 2 + 0.05, -0.5, Hh - 0.6), rot=(math.radians(12), 0, math.radians(8)), name='curtain_torn')
    # the pump on its skid, the hoses run out across the ground
    B(M('metal_painted', 1), (1.0, 0.6, 0.1), (2.3, -0.4, 0.05), name='skid')
    C(pump, 0.22, 0.6, (2.25, -0.4, 0.38), (0, math.pi / 2, 0), 12, name='pump')
    B(pump, (0.35, 0.35, 0.4), (2.6, -0.4, 0.35), name='motor')
    pts = [(2.0, -0.2, 0.3), (1.7, 0.4, 0.04), (1.6, 1.0, 0.04), (1.3, 1.4, 0.3), (1.15, 1.15, Hh - 0.1)]
    for a, b in zip(pts, pts[1:]): ROD(hose, a, b, 0.035, 8, name='hose')
    pts = [(2.7, -0.75, 0.15), (3.0, -1.4, 0.04), (2.6, -2.1, 0.04), (2.9, -2.6, 0.04)]
    for a, b in zip(pts, pts[1:]): ROD(hose, a, b, 0.035, 8, name='hose_out')
    # the hazmat suit hung by its hood from the front-right corner, arms down, empty
    hx, hy = S2 / 2 - 0.05, -S2 / 2 - 0.12
    B(suit, (0.42, 0.22, 0.62), (hx, hy, Hh - 0.62), name='suit_body'); S(suit, 0.14, (hx, hy, Hh - 0.2), (1, 1, 1.2), name='suit_hood')
    B(M('glass_eye', 1), (0.18, 0.02, 0.1), (hx, hy - 0.13, Hh - 0.2), name='visor')
    for s in (-1, 1): ROD(suit, (hx + s * 0.24, hy, Hh - 0.4), (hx + s * 0.27, hy, Hh - 0.98), 0.065, 8, name='suit_arm')
    for s in (-1, 1): ROD(suit, (hx + s * 0.1, hy, Hh - 0.92), (hx + s * 0.11, hy, Hh - 1.75), 0.08, 8, name='suit_leg')
    C(M('clay_mustard', 3), 0.29, 0.88, (-1.9, 1.2, 0.44), v=14, name='drum')


@prop('lab.cold_truck', 'THE COLD-STORE TRUCK', 'cover', 'COVER', '#', burns=False,
      what='a refrigerated box truck backed up to the cages, its cab dead, its back doors swung open on an empty box, the '
           'reefer unit on the box\'s nose',
      wrong='the reefer is still running: its panel lit and frost white on the open doors, in the desert, with no one paying for the diesel')
def lab_cold_truck():
    cab, box, chassis, glass, frost, reefer = M('tape_grey', 4), M('clay_bone', 4), M('rubber', 2), M('glass_eye', 0), M('chrome', 2), M('metal_painted', 2)
    # the truck runs along x, its nose to -x (left on the board), its doors at +x
    B(chassis, (7.6, 1.0, 0.25), (0.2, 0, 0.62), name='frame')
    # the cab: a conventional nose and a cab
    B(cab, (1.4, 2.25, 1.1), (-3.0, 0, 1.15), name='hood'); B(cab, (1.8, 2.3, 1.7), (-1.6, 0, 1.75), name='cab')
    B(glass, (0.05, 2.0, 0.7), (-2.52, 0, 2.15), rot=(0, math.radians(-14), 0), name='windscreen')
    for s in (-1, 1): B(glass, (0.9, 0.04, 0.6), (-1.55, s * 1.16, 2.1), name='side_window')
    B(M('chrome', 0), (0.08, 1.9, 0.5), (-3.72, 0, 1.0), name='grille'); B(M('rubber', 1), (0.2, 2.35, 0.25), (-3.75, 0, 0.55), name='bumper')
    for s in (-1, 1):
        B(M('rubber', 1), (0.08, 0.06, 0.32), (-2.4, s * 1.3, 2.2), name='mirror')
    # the box: ribbed panels, its nose against the cab
    BX0, BX1, BW, BZ0, BZ1 = -0.6, 4.1, 2.45, 0.85, 3.8
    B(box, (BX1 - BX0, BW, BZ1 - BZ0), ((BX0 + BX1) / 2, 0, (BZ0 + BZ1) / 2), name='box')
    STAINS(((BX0 + BX1) / 2, 0, BZ1, BX1 - BX0 - 0.4, BW - 0.3, 'z'), 9, 7, (('clay_bone', 0), ('rubber', 1), ('clay_mustard', 0)), (0.15, 0.45))
    STAINS(((BX0 + BX1) / 2, -BW / 2, BZ0 + 0.9, BX1 - BX0 - 0.4, 1.4, '-y'), 6, 8, (('clay_bone', 0), ('rubber', 1), ('clay_mustard', 0)), (0.2, 0.5))
    STAINS((-1.6, 0, 2.61, 1.6, 2.0, 'z'), 3, 9, (('clay_rust', 0), ('rubber', 1)), (0.1, 0.25))
    for k in range(13):
        x = BX0 + 0.1 + k * (BX1 - BX0 - 0.2) / 12
        for s in (-1, 1): B(M('clay_bone', 3), (0.06, 0.03, BZ1 - BZ0 - 0.1), (x, s * (BW / 2 + 0.01), (BZ0 + BZ1) / 2), name='rib')
    B(M('clay_bone', 3), (BX1 - BX0, BW + 0.04, 0.1), ((BX0 + BX1) / 2, 0, BZ1 - 0.02), name='roofrail')
    # the open back: a dark empty box, two doors swung right round against the sides, frost round the frame
    B(M('cloth_black', 0), (0.05, BW - 0.16, BZ1 - BZ0 - 0.14), (BX1 + 0.01, 0, (BZ0 + BZ1) / 2), name='inside')
    for s in (-1, 1):
        B(box, (0.06, BW / 2, BZ1 - BZ0 - 0.1), (BX1 + 0.08, s * (BW / 2 + BW / 4 + 0.04), (BZ0 + BZ1) / 2), name='door')
        for z in (BZ0 + 0.6, BZ1 - 0.6): B(M('chrome', 1), (0.04, BW / 2 - 0.1, 0.04), (BX1 + 0.12, s * (BW / 2 + BW / 4 + 0.04), z), name='lockbar')
        B(frost, (0.05, 0.1, BZ1 - BZ0), (BX1 + 0.04, s * (BW / 2 - 0.05), (BZ0 + BZ1) / 2), name='frost_jamb')
        B(frost, (0.07, BW / 2 - 0.05, 0.3), (BX1 + 0.12, s * (BW / 2 + BW / 4 + 0.04), BZ0 + 0.2), name='frost_door')
    B(frost, (0.05, BW - 0.1, 0.12), (BX1 + 0.04, 0, BZ1 - 0.08), name='frost_head')
    B(frost, (0.4, BW - 0.3, 0.03), (BX1 - 0.15, 0, BZ0 + 0.02), name='frost_floor')
    B(frost, (1.8, 2.6, 0.02), (BX1 + 0.9, 0, 0.01), rot=(0, 0, math.radians(8)), name='frost_ground')
    for k in range(14): B(frost, (0.05, 0.05, 0.12 + 0.1 * (k % 3)), (BX1 + 0.02, -BW / 2 + 0.1 + k * 0.17, BZ1 - 0.2 - 0.05 * (k % 3)), name='icicle')
    B(M('tape_grey', 2), (0.5, BW - 0.2, 0.15), (BX1 + 0.2, 0, BZ0 - 0.1), name='step')
    # the reefer on the box's nose above the cab, its panel lit
    B(reefer, (0.55, 1.9, 1.1), (BX0 - 0.28, 0, BZ1 - 0.6), name='reefer')
    for k in range(5): B(M('metal_painted', 1), (0.04, 1.6, 0.04), (BX0 - 0.57, 0, BZ1 - 1.0 + k * 0.17), name='grille_bar')
    B(M('glass_eye', 2, glow=2.5), (0.3, 0.04, 0.2), (BX0 - 0.3, -0.97, BZ1 - 0.35), name='reefer_panel')
    B(M('sodium', 4, glow=2.0), (0.06, 0.04, 0.06), (BX0 - 0.12, -0.97, BZ1 - 0.35), name='reefer_lamp')
    # six wheels, the front left flat
    for (x, s) in ((-2.9, -1), (-2.9, 1), (2.6, -1), (2.6, 1), (3.5, -1), (3.5, 1)):
        WHEEL(0.5, 0.32, (x, s * 1.0, 0.5 if (x, s) != (-2.9, -1) else 0.42), name='wheel')
    B(M('rubber', 1), (1.0, 0.04, 0.5), (3.05, -1.24, 0.75), name='mudflap')


def chainlink_run(length, height, arms=True, plate=False):
    post, rail, fab, barb = M('tape_grey', 2), M('tape_grey', 2), M('tape_grey', 3), M('metal_painted', 1)
    n = max(1, int(round(length / 3.0)))
    for k in range(n + 1):
        x = -length / 2 + k * length / n
        C(post, 0.05, height + 0.05, (x, 0, (height + 0.05) / 2), v=10, name='post')
        C(M('tape_grey', 3), 0.13, 0.12, (x, 0, 0.06), v=10, name='footing')
        if arms:
            for s in (-1, 1): ROD(post, (x, 0, height), (x, s * 0.32, height + 0.42), 0.022, 6, name='varm')
    ROD(rail, (-length / 2, 0, height - 0.03), (length / 2, 0, height - 0.03), 0.022, 8, name='toprail')
    ROD(rail, (-length / 2, 0, 0.08), (length / 2, 0, 0.08), 0.008, 5, name='tension_wire')
    CHAIN(fab, (-length / 2, 0.0), (length / 2, 0.0), 0.06, height - 0.02)
    if arms:
        for s in (-1, 1):
            for j in (1, 2, 3):
                t = j / 3.3
                ROD(barb, (-length / 2, s * 0.32 * t, height + 0.42 * t), (length / 2, s * 0.32 * t, height + 0.42 * t), 0.006, 4, name='barb')
        # the razor coil riding in the V
        for k in range(int(length / 0.35)):
            x = -length / 2 + 0.17 + k * 0.35
            bpy.ops.mesh.primitive_torus_add(major_radius=0.26, minor_radius=0.012, major_segments=14, minor_segments=4,
                                             location=(x, 0, height + 0.3), rotation=(0, math.radians(90 - 18), 0))
            _take(bpy.context.active_object, 'razor', M('chrome', 1))
    if plate:
        B(M('clay_mustard', 3), (0.6, 0.02, 0.6), (0.8, -0.03, 1.5), rot=(0, math.radians(45), 0), name='hazard_plate')
        for a in range(3):
            aa = math.radians(90 + 120 * a)
            C(M('cloth_black', 1), 0.07, 0.025, (0.8 + 0.09 * math.cos(aa), -0.045, 1.5 + 0.09 * math.sin(aa)), (math.pi / 2, 0, 0), 10, name='trefoil')


@prop('lab.fence_run', 'LAB FENCE, A RUN', 'blocking', 'COVER', '#', see=True,
      what='six metres of 2.4 m security chain-link on galvanised posts, barbed wire on V-arms and a razor coil riding in the V, '
           'a yellow biohazard plate wired to the fabric',
      wrong='')
def lab_fence_run():
    chainlink_run(6.0, 2.4, arms=True, plate=True)


@prop('lab.fence_gate', 'LAB GATE, ONE LEAF DOWN', 'blocking', 'COVER', '#', see=True,
      what='a double vehicle gate in the same fence, 4 m between its posts: the left leaf shut on its chain and padlock, the '
           'right leaf torn off its top hinge and hanging, its corner dug into the ground; the gap is a way through',
      wrong='')
def lab_fence_gate():
    post, fab, frame = M('tape_grey', 2), M('tape_grey', 3), M('tape_grey', 2)
    H = 2.4
    for x in (-2.05, 2.05):
        C(post, 0.075, H + 0.5, (x, 0, (H + 0.5) / 2), v=12, name='gatepost'); C(M('tape_grey', 3), 0.18, 0.15, (x, 0, 0.07), v=12, name='footing')
        C(post, 0.09, 0.06, (x, 0, H + 0.5), v=12, name='cap')

    def leaf(w):
        for z in (0.12, H - 0.08): ROD(frame, (0, 0, z), (w, 0, z), 0.024, 8, name='leaf_rail')
        for x in (0.02, w - 0.02): ROD(frame, (x, 0, 0.1), (x, 0, H - 0.06), 0.024, 8, name='leaf_stile')
        ROD(frame, (0.02, 0, 0.12), (w - 0.02, 0, H - 0.08), 0.018, 6, name='leaf_brace')
        CHAIN(fab, (0.03, 0.0), (w - 0.03, 0.0), 0.14, H - 0.1)

    d = MARK(); leaf(1.95); MOVE(d, loc=(-2.0, 0, 0))
    for k in range(5):                                           # the chain round the meeting stiles, and its padlock
        B(M('chrome', 1), (0.05, 0.05, 0.03), (-0.06 + 0.01 * k, -0.04, 1.1 - k * 0.05), name='chain')
    B(M('clay_mustard', 1), (0.07, 0.04, 0.09), (-0.03, -0.07, 0.86), name='padlock')
    d = MARK(); leaf(1.95)
    MOVE(d, loc=(2.0, -0.05, 0.0), rot=(math.radians(-14), math.radians(-14), math.radians(-128)), about=(0, 0, 0.12))
    B(M('tape_grey', 1), (0.6, 0.4, 0.06), (1.0, -1.35, 0.02), rot=(0, 0, math.radians(30)), name='scrape')


# ======================================================================================================================
# 2. THE AIRPORT: Harry Reid's general aviation side, the planes that never got their fuel
# ======================================================================================================================
@prop('airport.plane', 'THE PLANE ON ITS BELLY', 'cover', 'COVER', '#', landmark=True,
      what='a 19-seat twin turboprop (a Beechcraft 1900 at its true 17.6 m) down on its belly on the apron, gear folded '
           'under it, the left wingtip on the ground, both propellers curled back, its airstair door open',
      wrong='')
def airport_plane():
    skin, stripe, glass, dark, prop_m = M('tape_grey', 4), M('clay_teal', 2), M('glass_eye', 0), M('rubber', 2), M('metal_painted', 1)
    Lf = 17.6
    # the fuselage along x, nose to -x; a loft of rings (x, half width, half height, centre)
    st = [(x, a, b, z - 0.18) for (x, a, b, z) in [(-8.8, 0.05, 0.05, 1.0), (-8.6, 0.35, 0.3, 0.95), (-8.0, 0.66, 0.62, 0.95), (-7.0, 0.82, 0.84, 1.0),
          (-5.6, 0.86, 0.9, 1.0), (2.0, 0.86, 0.9, 1.0), (4.6, 0.7, 0.72, 1.12), (6.8, 0.42, 0.45, 1.35), (8.6, 0.16, 0.2, 1.58), (8.8, 0.05, 0.08, 1.6)]]
    LOFT(skin, st, n=20, p=2.2, flat=0.88, name='fuselage')
    # the cheat line down the side, the windows above it, the cockpit glass
    for s in (-1, 1):
        B(stripe, (12.0, 0.03, 0.14), (-1.6, s * 0.865, 0.54), name='cheatline')
        for k in range(9): B(glass, (0.26, 0.03, 0.3), (-4.6 + k * 0.78, s * 0.86, 1.0), name='window')
        B(glass, (0.9, 0.03, 0.34), (-7.1, s * 0.72, 1.18), rot=(math.radians(-s * 14), 0, math.radians(s * 6)), name='cockpit_side')
    B(glass, (0.05, 1.0, 0.36), (-7.62, 0, 1.28), rot=(0, math.radians(-52), 0), name='windscreen')
    # the airstair door, open, its stair down to the apron on the near side
    B(dark, (0.8, 0.04, 1.3), (3.0, -0.87, 0.87), name='doorway')
    d = MARK()
    for k in range(4): B(M('tape_grey', 3), (0.7, 0.24, 0.04), (0, -0.22 - k * 0.26, 0.62 - k * 0.15), name='tread')
    for xo in (-0.36, 0.36):
        BAR(M('tape_grey', 2), (xo, -0.1, 0.72), (xo, -1.3, 0.0), 0.04, 0.12, name='stringer')
        ROD(M('tape_grey', 2), (xo, -0.1, 1.5), (xo, -1.2, 0.85), 0.012, 5, name='handrope')
    MOVE(d, loc=(3.0, -0.88, 0.0))
    # the wing: a low wing through the belly, the whole plane rolled 5 degrees so the left (far) tip is down
    wing = [(-0.2, 0.0), (1.9, 0.0), (1.45, 8.85), (0.45, 8.85)]
    for s in (-1, 1):
        pts = [(x, s * y) for x, y in wing]
        POLY(skin, pts if s > 0 else pts[::-1], 0.22, 'xy', loc=(-1.3, 0, 0.2), rot=(math.radians(-s * 6), 0, 0), name='wing')
        # the nacelle and the curled propeller
        nx, ny = -1.7, s * 3.3
        o = LOFT(skin, [(nx - 1.5, 0.05, 0.05, 0.6), (nx - 1.3, 0.36, 0.38, 0.6), (nx + 1.0, 0.38, 0.42, 0.64), (nx + 2.4, 0.12, 0.14, 0.6)], n=14, name='nacelle')
        o.location = (0, ny, 0)
        C(M('rubber', 2), 0.16, 0.3, (nx - 1.62, ny, 0.6), (0, -math.pi / 2, 0), 10, r2=0.04, name='spinner')
        for j in range(4):
            a = math.radians(45 + 90 * j); r0 = 0.15
            hub = mu.Vector((nx - 1.68, ny + r0 * math.cos(a), 0.6 + r0 * math.sin(a)))
            tip = hub + mu.Vector((0.55 + 0.3 * (j % 2), 1.0 * math.cos(a), 1.0 * math.sin(a)))   # curled back off the ground
            if tip.z < 0.05: tip.z = 0.05
            BAR(prop_m, tuple(hub), tuple(tip), 0.2, 0.03, name='blade')
    # the T-tail
    POLY(skin, [(5.2, 1.3), (8.7, 1.3), (9.0, 4.2), (8.2, 4.2)], 0.18, 'xz', name='fin')
    POLY(skin, [(7.6, -2.8), (8.7, -2.8), (8.9, 2.8), (7.8, 2.8)][::1], 0.12, 'xy', loc=(0.3, 0, 4.1), name='stabiliser')
    B(stripe, (2.2, 0.2, 0.3), (7.4, 0, 2.4), rot=(0, math.radians(-38), 0), name='fin_band')
    # the belly scraped: a dark scar on the apron behind it, and a blade broken off lying in front
    B(M('tape_grey', 1), (6.0, 0.9, 0.02), (6.5, 0.2, 0.01), rot=(0, 0, math.radians(3)), name='scrape')
    BAR(prop_m, (-4.5, -3.6, 0.03), (-3.3, -4.4, 0.03), 0.2, 0.03, name='blade_off')
    # roll the whole plane: the near (s<0) wing high, the far down onto its tip
    MOVE(0, rot=(math.radians(-4), math.radians(1.5), 0), about=(0, 0, 0))


@prop('airport.fuel_truck', 'THE FUEL TRUCK', 'cover', 'COVER', '#', burns=True,
      what='an airport refueller: a cab-over cab, a 5,000 gallon tank, a walkway rail on top, the hose reel at the back with '
           'its hose run out across the apron to a nozzle lying on nothing; the Jet A placard',
      wrong='')
def airport_fuel_truck():
    cab, tank, chassis, glass, hose, plac = M('tape_grey', 4), M('tape_grey', 3), M('rubber', 2), M('glass_eye', 0), M('rubber', 1), M('clay_mustard', 3)
    B(chassis, (8.6, 1.0, 0.25), (0.3, 0, 0.62), name='frame')
    B(cab, (1.9, 2.4, 2.1), (-3.6, 0, 1.8), name='cab'); B(glass, (0.04, 2.1, 0.8), (-4.56, 0, 2.3), name='windscreen')
    for s in (-1, 1): B(glass, (1.0, 0.04, 0.6), (-3.6, s * 1.21, 2.3), name='side_window')
    B(M('rubber', 1), (0.2, 2.45, 0.3), (-4.6, 0, 0.6), name='bumper')
    B(M('clay_rust', 2), (0.05, 2.0, 0.24), (-4.58, 0, 1.25), name='grille_rust')
    LOFT(tank, [(-2.4, 0.3, 0.3, 1.95), (-2.25, 1.15, 0.92, 1.95), (3.4, 1.15, 0.92, 1.95), (3.55, 0.3, 0.3, 1.95)], n=18, p=3.0, name='tank')
    for x in (-1.2, 0.4, 2.0): C(M('tape_grey', 2), 0.32, 0.12, (x, 0, 2.9), v=12, name='hatch')
    for s in (-1, 1): ROD(M('clay_mustard', 2), (-2.0, s * 0.7, 3.25), (3.2, s * 0.7, 3.25), 0.025, 6, name='handrail')
    for x in (-2.0, 0.6, 3.2):
        for s in (-1, 1): ROD(M('clay_mustard', 2), (x, s * 0.7, 2.86), (x, s * 0.7, 3.25), 0.02, 5)
    B(plac, (0.5, 0.03, 0.36), (3.0, -1.17, 1.7), rot=(0, math.radians(45), 0), name='placard')
    B(M('cloth_black', 1), (0.3, 0.035, 0.08), (3.0, -1.18, 1.7), name='placard_number')
    # the reel cabinet and the hose run out across the apron
    B(M('tape_grey', 2), (1.0, 2.3, 1.3), (4.2, 0, 1.35), name='cabinet')
    C(M('clay_rust', 2), 0.45, 1.6, (4.2, 0, 1.35), (math.pi / 2, 0, 0), 16, name='reel')
    pts = [(4.75, -0.6, 1.0), (5.2, -1.1, 0.06), (5.6, -2.6, 0.06), (5.0, -3.9, 0.06), (3.7, -4.5, 0.06), (2.8, -4.3, 0.06)]
    for a, b in zip(pts, pts[1:]): ROD(hose, a, b, 0.05, 8, name='hose')
    B(M('chrome', 1), (0.45, 0.16, 0.14), (2.55, -4.25, 0.08), rot=(0, 0, math.radians(15)), name='nozzle')
    for (x, s) in ((-3.4, -1), (-3.4, 1), (2.1, -1), (2.1, 1), (3.1, -1), (3.1, 1)):
        WHEEL(0.52, 0.34, (x, s * 1.02, 0.52), name='wheel')


@prop('airport.baggage', 'THE BAGGAGE CARTS', 'cover', 'COVER', '#',
      what='a baggage tug and three covered carts in a train that slewed as it stopped, each cart still loaded',
      wrong='every suitcase on every cart is the same suitcase: the same size, the same colour, stacked the same way')
def airport_baggage():
    body, frame, canvas, case, handle = M('clay_mustard', 3), M('tape_grey', 2), M('metal_painted', 2), M('clay_teal', 3), M('rubber', 1)
    # the tug
    d = MARK()
    B(body, (2.6, 1.3, 0.75), (0, 0, 0.62), name='tug'); B(body, (0.9, 1.25, 0.5), (0.8, 0, 1.2), name='tug_hood')
    B(M('cloth_black', 2), (0.55, 0.6, 0.55), (-0.5, 0, 1.25), name='seat')
    ROD(frame, (-0.6, 0.0, 1.0), (-0.2, 0.0, 1.55), 0.025, 6); C(M('rubber', 1), 0.18, 0.04, (-0.17, 0, 1.58), (0, math.radians(30), 0), 12, name='wheel_steer')
    for x in (-0.9, 0.85):
        for s in (-1, 1): WHEEL(0.3, 0.22, (x, s * 0.62, 0.3), name='tw')
    BAR(frame, (-1.3, 0, 0.4), (-1.9, 0, 0.4), 0.06)
    MOVE(d, loc=(-5.0, 0.0, 0.0))
    # three carts, each slewed a little more
    for c in range(3):
        d = MARK()
        L, Wd, Zb = 3.0, 1.55, 0.55
        B(frame, (L, Wd, 0.08), (0, 0, Zb), name='bed')
        for xs in (-L / 2 + 0.05, L / 2 - 0.05):
            for s in (-1, 1): ROD(frame, (xs, s * Wd / 2, Zb), (xs, s * Wd / 2, 2.0), 0.025, 6, name='canopy_post')
        B(canvas, (L + 0.1, Wd + 0.1, 0.06), (0, 0, 2.03), name='canopy')
        for s in (-1, 1): B(canvas, (L, 0.03, 0.35), (0, s * (Wd / 2 + 0.02), 1.85), name='rolled_curtain')
        for xs in (-1.0, 1.0):
            for s in (-1, 1): WHEEL(0.2, 0.14, (xs, s * 0.66, 0.2), name='cw')
        BAR(frame, (-L / 2, 0, 0.4), (-L / 2 - 0.5, 0, 0.4), 0.05)
        # THE SAME SUITCASE: one size, one colour, one way, in rows and layers
        for lay in range(3 if c != 2 else 2):
            for i in range(4):
                for j in range(2):
                    cx, cy, cz = -1.08 + i * 0.72, -0.36 + j * 0.72, Zb + 0.04 + 0.13 + lay * 0.27
                    B(case, (0.68, 0.44, 0.26), (cx, cy, cz), name='case')
                    B(handle, (0.18, 0.03, 0.03), (cx, cy - 0.235, cz + 0.02), name='case_handle')
        MOVE(d, loc=(-1.6 + c * 3.6, 0.25 * c * c, 0), rot=(0, 0, math.radians(-6.0 * c)))


@prop('airport.jet_bridge', 'THE JET BRIDGE STUB', 'none', 'HEIGHT', 'H',
      what='a jet bridge standing alone where its terminal was: the rotunda on its column, a corrugated tunnel 4 m up running '
           'out to its cab, the drive column on its two wheels, the service stair from the cab down to the apron; its '
           'terminal end torn off. You walk under it; the stair climbs to it',
      wrong='')
def airport_jet_bridge():
    skin, rib, glass, steel, dark = M('tape_grey', 3), M('tape_grey', 2), M('glass_eye', 1), M('metal_painted', 1), M('cloth_black', 1)
    Z0, Z1 = 3.9, 6.7
    # the rotunda on its column at -x, torn where the terminal was
    C(steel, 0.35, Z0, (-6.5, 0, Z0 / 2), v=14, name='column')
    C(skin, 1.7, Z1 - Z0 + 0.4, (-6.5, 0, (Z0 + Z1) / 2), v=20, name='rotunda')
    for k in range(9):
        a = math.radians(120 + k * 15); r = 1.72
        B(M('clay_rust', 1), (0.25, 0.08, 0.9 + 0.5 * (k % 3)), (-6.5 + r * math.cos(a), r * math.sin(a), Z1 - 0.3 - 0.25 * (k % 2)), rot=(0, math.radians(10 * (k % 4)), a), name='torn_plate')
    B(dark, (0.05, 1.6, Z1 - Z0 - 0.4), (-8.15, 0, (Z0 + Z1) / 2), name='torn_mouth')
    # the tunnel
    B(skin, (10.0, 2.8, Z1 - Z0), (-0.7, 0, (Z0 + Z1) / 2), name='tunnel')
    for k in range(24):
        x = -5.5 + k * 0.42
        for s in (-1, 1): B(rib, (0.06, 0.03, Z1 - Z0 - 0.1), (x, s * 1.41, (Z0 + Z1) / 2), name='corrugation')
    for s in (-1, 1): B(glass, (8.0, 0.03, 0.5), (-0.5, s * 1.42, Z1 - 0.65), name='window_strip')
    B(rib, (10.2, 3.0, 0.12), (-0.7, 0, Z1 + 0.06), name='roof')
    # the cab and its bellows canopy at +x
    B(skin, (2.4, 3.6, Z1 - Z0 + 0.2), (5.4, 0, (Z0 + Z1) / 2), name='cab')
    B(glass, (2.2, 0.03, 0.9), (5.4, -1.82, Z1 - 0.9), name='cab_glass')
    B(M('rubber', 2), (0.8, 3.2, Z1 - Z0 + 0.1), (7.0, 0, (Z0 + Z1) / 2), name='bellows')
    for k in range(5): B(M('rubber', 1), (0.06, 3.25, Z1 - Z0 + 0.12), (6.68 + k * 0.16, 0, (Z0 + Z1) / 2), name='bellows_fold')
    # the drive column: two legs down to a bogie of two wheels
    for s in (-1, 1): BAR(steel, (3.6, s * 0.7, Z0), (3.6, s * 0.7, 0.75), 0.22, name='drive_leg')
    B(steel, (0.6, 2.2, 0.4), (3.6, 0, 0.7), name='bogie')
    for s in (-1, 1): WHEEL(0.5, 0.4, (3.6, s * 1.0, 0.5), name='drive_wheel')
    B(M('clay_mustard', 3), (0.3, 1.8, 0.12), (3.6, -0.0, 1.0), name='bogie_band')
    # the service stair from the cab's side door down to the apron, toward the camera
    sx, top, n = 5.2, Z0, 14
    for k in range(n):
        z = top - (k + 1) * top / (n + 1); y = -1.85 - (k + 1) * 0.27
        B(steel, (1.0, 0.26, 0.05), (sx, y, z), name='tread')
    for xo in (-0.52, 0.52):
        BAR(steel, (sx + xo, -1.85, top), (sx + xo, -1.85 - (n + 1) * 0.27, 0.0), 0.06, 0.18, name='stringer')
        ROD(M('clay_mustard', 2), (sx + xo, -1.85, top + 1.0), (sx + xo, -1.85 - (n + 1) * 0.27, 1.0), 0.02, 5, name='stair_rail')
    B(steel, (1.2, 1.2, 0.08), (sx, -2.0, top), name='landing')
    B(dark, (0.9, 0.04, 2.0), (sx, -1.81, Z0 + 1.0), name='side_door')


@prop('airport.hangar', 'THE HANGAR\'S OPEN FRONT', 'blocking', 'COVER', '#', landmark=False,
      what='the front bay of a steel hangar, 24 m wide and 9 m to the eaves: its sliding door leaves run back to both ends '
           'on their track, one leaf jumped its track and leaning, the dark inside, roof sheets gone, a caged ladder up the '
           'side to the roof',
      wrong='')
def airport_hangar():
    wall, rib, dark, steel, roof, rust = M('tape_grey', 3), M('tape_grey', 2), M('cloth_black', 0), M('metal_painted', 1), M('tape_grey', 2), M('clay_rust', 2)
    Wd, D, E, Rg = 24.0, 12.0, 9.0, 10.6
    # the side and back walls
    for s in (-1, 1): B(wall, (0.2, D, E), (s * Wd / 2, D / 2, E / 2), name='side_wall')
    B(wall, (Wd, 0.2, E), (0, D, E / 2), name='back_wall')
    B(dark, (Wd - 0.4, D - 0.4, 0.02), (0, D / 2, 0.01), name='floor_dark')
    B(M('cloth_black', 1), (Wd - 0.5, 0.05, E - 0.4), (0, D - 0.15, E / 2), name='back_dark')
    # the gable front: a header over the opening and the gable triangle
    B(wall, (Wd + 0.2, 0.3, 1.4), (0, 0, E - 0.7), name='header')
    POLY(wall, [(-Wd / 2 - 0.1, E), (Wd / 2 + 0.1, E), (0, Rg)], 0.3, 'xz', name='gable')
    for k in range(int(Wd / 0.5)):
        x = -Wd / 2 + 0.25 + k * 0.5; h = E + (Rg - E) * (1 - abs(x) / (Wd / 2))
        B(rib, (0.07, 0.04, h - (E - 1.4)), (x, -0.17, (h + E - 1.4) / 2), name='rib')
    # the roof sheets falling both ways, two bays of sheets gone
    run = math.hypot(Wd / 2, Rg - E); a = math.atan2(Rg - E, Wd / 2)
    for s in (-1, 1):
        for k in range(6):
            if (s, k) in ((1, 2), (1, 3), (-1, 4)): continue
            y = k * D / 6 + D / 12
            B(roof if (k + (s > 0)) % 3 else M('tape_grey', 1), (run + 0.3, D / 6 + 0.02, 0.06), (s * Wd / 4, y, (E + Rg) / 2 + 0.05), rot=(0, s * a, 0), name='roof_sheet')
            STAINS((s * Wd / 4, y, (E + Rg) / 2 + 0.1, run * 0.8, D / 6 - 0.3, 'z'), 2, 40 + k + 10 * (s > 0))
    for k in range(4):                                         # the trusses seen through the gaps and the door
        y = 1.0 + k * 3.4
        for s in (-1, 1): BAR(steel, (s * Wd / 2, y, E - 0.2), (0, y, Rg - 0.3), 0.2, 0.3, name='truss')
        BAR(steel, (-Wd / 2, y, E - 0.4), (Wd / 2, y, E - 0.4), 0.15, 0.2, name='tie')
    # the door track and the leaves run back to both ends, one jumped and leaning
    B(steel, (Wd + 0.4, 0.3, 0.25), (0, -0.3, E - 1.45), name='door_track')
    for s in (-1, 1):
        for j in range(2):
            x = s * (Wd / 2 - 1.6 - j * 0.35)
            B(wall, (0.12, 0.14, E - 1.6), (x, -0.45 - j * 0.18, (E - 1.6) / 2), rot=(0, 0, 0), name='leaf_edge')
            B(wall, (3.1, 0.12, E - 1.6), (x - s * 1.4, -0.45 - j * 0.18, (E - 1.6) / 2), name='door_leaf')
            for k in range(6): B(rib, (0.06, 0.04, E - 1.7), (x - s * (0.2 + k * 0.5), -0.53 - j * 0.18, (E - 1.6) / 2), name='leaf_rib')
    d = MARK()
    B(wall, (3.1, 0.12, E - 1.6), (0, 0, (E - 1.6) / 2), name='leaf_down')
    for k in range(6): B(rib, (0.06, 0.04, E - 1.7), (-1.25 + k * 0.5, -0.08, (E - 1.6) / 2))
    B(rust, (3.1, 0.13, 1.2), (0, 0, 0.6), name='leaf_rust')
    MOVE(d, loc=(-4.2, -1.2, 0.0), rot=(math.radians(-14), 0, math.radians(6)), about=(0, 0, 0))
    # the caged ladder up the right wall to the roof
    lx = Wd / 2 + 0.35
    for y in (2.0, 2.5): ROD(steel, (lx, y, 0.4), (lx, y, E + 0.9), 0.025, 6, name='ladder_rail')
    for k in range(int(E / 0.3)): ROD(steel, (lx, 2.0, 0.6 + k * 0.3), (lx, 2.5, 0.6 + k * 0.3), 0.015, 5, name='rung')
    for k in range(9):
        z = 2.4 + k * 0.8
        bpy.ops.mesh.primitive_torus_add(major_radius=0.38, minor_radius=0.018, major_segments=12, minor_segments=4, location=(lx + 0.3, 2.25, z))
        _take(bpy.context.active_object, 'cage_hoop', steel)
    B(M('clay_mustard', 3), (0.05, 2.2, 0.7), (-Wd / 2 - 0.12, 4.0, 3.2), name='bay_number')


# ======================================================================================================================
# 3. THE GOLF COURSE: the desert courses that drank the river, dead the first summer the pumps stopped
# ======================================================================================================================
@prop('golf.clubhouse', 'THE CLUBHOUSE FRONT', 'blocking', 'HEIGHT', 'H', landmark=True,
      what='a desert-modern clubhouse, 22 m by 11 m: stucco walls, a clay-tile mansard round a flat roof you can stand on, '
           'a portico of five arches, its doors and windows boarded, dead shrubs in its planters, a ladder left at the side',
      wrong='')
def golf_clubhouse():
    stucco, trim, tile, ply, dark, conc = M('clay_bone', 3), M('clay_bone', 2), M('clay_rust', 2), M('tape_masking', 2), M('cloth_black', 1), M('tape_grey', 3)
    Wd, D, Hh = 22.0, 11.0, 4.4
    B(conc, (Wd + 1.0, D + 3.4, 0.3), (0, D / 2 - 1.2, 0.15), name='slab')
    B(stucco, (Wd, D, Hh), (0, D / 2, Hh / 2 + 0.3), name='walls')
    # the mansard: a tile band sloped out all round the roof
    for (cx, cy, sx, sy, rx, ry) in ((0, -0.35, Wd + 1.2, 1.4, -1, 0), (0, D + 0.35, Wd + 1.2, 1.4, 1, 0), (-Wd / 2 - 0.35, D / 2, 1.4, D + 1.2, 0, -1), (Wd / 2 + 0.35, D / 2, 1.4, D + 1.2, 0, 1)):
        B(tile, (sx, sy, 0.12), (cx, cy, Hh + 0.55), rot=(math.radians(-38) * rx * -1, math.radians(38) * ry, 0), name='mansard')
    for k in range(int((Wd + 1.2) / 0.3)):                          # the barrel-tile courses on the front
        B(M('clay_rust', 3), (0.12, 1.45, 0.1), (-Wd / 2 - 0.6 + k * 0.3, -0.38, Hh + 0.62), rot=(math.radians(38), 0, 0), name='barrel')
    B(M('tape_grey', 2), (Wd - 0.4, D - 0.4, 0.1), (0, D / 2, Hh + 0.42), name='roof_deck')
    B(M('metal_painted', 2), (2.0, 1.4, 1.1), (5.0, D / 2 + 1.5, Hh + 1.0), name='ac_unit')
    # the portico: five arches on square piers before the door
    PD, PZ = 3.0, 3.6
    B(stucco, (12.0, PD, 0.7), (0, -PD / 2, PZ + 0.35), name='portico_beam')
    B(tile, (12.6, PD + 0.6, 0.12), (0, -PD / 2, PZ + 0.85), rot=(math.radians(-6), 0, 0), name='portico_roof')
    for k in range(6):
        x = -6.0 + k * 2.4
        B(stucco, (0.55, 0.55, PZ), (x, -PD + 0.3, PZ / 2 + 0.3), name='pier')
    for k in range(5):                                            # the arch's soffit: a half-ring of blocks under the beam
        cx = -4.8 + k * 2.4
        for j in range(7):
            a = math.pi * (j + 0.5) / 7; r = 0.92
            B(trim, (0.3, 0.5, 0.18), (cx + r * math.cos(a), -PD + 0.3, PZ - 0.85 + r * math.sin(a) * 0.9), rot=(0, -a + math.pi / 2, 0), name='arch')
        B(stucco, (1.9, 0.5, 0.45), (cx, -PD + 0.3, PZ + 0.1), name='spandrel')
    # the doors and windows, boarded
    B(dark, (2.6, 0.06, 2.6), (0, -0.04, 1.6), name='doorway')
    for k in range(4): B(ply, (0.62, 0.05, 2.5), (-0.95 + k * 0.63, -0.08, 1.58), rot=(0, math.radians(2 * (k - 1.5)), 0), name='door_ply')
    for x in (-9.0, -6.0, 6.0, 9.0):
        B(dark, (1.8, 0.05, 1.5), (x, -0.03, 2.3), name='window')
        B(ply, (1.9, 0.05, 1.6), (x + 0.05, -0.07, 2.28), rot=(0, math.radians(3 if x > 0 else -2), 0), name='window_ply')
    B(dark, (0.2, 0.06, 0.9), (-6.0, -0.1, 2.1), name='ply_gap')
    # the planters and their dead shrubs, and the blank sign over the door
    for x in (-9.5, -7.5, 7.5, 9.5):
        B(conc, (1.4, 0.9, 0.6), (x, -1.2, 0.6), name='planter')
        for j in range(3): ROCK(M('clay_mustard', 1), (x - 0.3 + j * 0.3, -1.2, 0.85), (0.6, 0.5, 0.45), seed=int(x * 10) + j, sub=2, rough=0.45, name='dead_shrub')
    B(trim, (4.0, 0.12, 0.5), (0, -PD - 0.05, PZ + 0.3), name='sign_blank')
    for k in range(3): B(M('clay_rust', 1), (0.18, 0.03, 0.28), (-1.0 + k * 1.0, -PD - 0.12, PZ + 0.3), name='letter_ghost')
    # a ladder left against the side wall: the way up to the roof
    lx = Wd / 2 + 0.25
    for y in (3.0, 3.5): BAR(M('clay_mustard', 3), (lx + 0.9, y, 0.3), (lx, y, Hh + 0.9), 0.06, 0.04, name='ladder_rail')
    for k in range(13):
        t = (k + 0.5) / 13
        ROD(M('clay_mustard', 3), (lx + 0.9 * (1 - t), 3.0, 0.3 + t * (Hh + 0.6)), (lx + 0.9 * (1 - t), 3.5, 0.3 + t * (Hh + 0.6)), 0.018, 5, name='ladder_rung')


def golf_cart(over=False):
    body, seat, canopy, post, tyre, bag = M('tape_grey', 4), M('cloth_black', 2), M('clay_bone', 3), M('tape_grey', 2), M('rubber', 1), M('clay_rust', 2)
    B(body, (2.3, 1.2, 0.35), (0, 0, 0.45), name='floor')
    B(body, (0.7, 1.2, 0.55), (-0.85, 0, 0.75), name='cowl')
    B(body, (0.8, 1.15, 0.5), (0.65, 0, 0.75), name='rear_body')
    B(seat, (0.55, 1.05, 0.15), (0.25, 0, 0.95), name='seat'); B(seat, (0.12, 1.05, 0.5), (0.52, 0, 1.25), name='seat_back')
    for x in (-0.7, 0.55):
        for s in (-1, 1): ROD(post, (x, s * 0.52, 0.9), (x + 0.05, s * 0.52, 1.85), 0.022, 6, name='canopy_post')
    B(canopy, (2.1, 1.25, 0.06), (-0.05, 0, 1.88), rot=(math.radians(4), math.radians(-3), 0), name='canopy')
    ROD(post, (-0.7, -0.3, 0.95), (-0.45, -0.3, 1.25), 0.02, 6); C(M('rubber', 1), 0.17, 0.04, (-0.43, -0.3, 1.27), (0, math.radians(50), 0), 12, name='steer')
    # the bag on the back, clubs up
    C(bag, 0.16, 0.95, (1.2, 0.15, 1.05), (0, math.radians(-14), 0), 10, name='golf_bag')
    for k in range(4): ROD(M('chrome', 1), (1.32 + 0.03 * k, 0.1 + 0.04 * k, 1.5), (1.42 + 0.04 * k, 0.08 + 0.05 * k, 1.85), 0.012, 4, name='club')
    for (x, s, fl) in ((-0.75, -1, 0.07), (-0.75, 1, 0.0), (0.75, -1, 0.0), (0.75, 1, 0.0)):
        C(tyre, 0.23, 0.2, (x, s * 0.5, 0.23 - fl), (math.pi / 2, 0, 0), 12, name='tyre'); C(M('tape_grey', 2), 0.12, 0.21, (x, s * 0.5, 0.23 - fl), (math.pi / 2, 0, 0), 8, name='hub')
    if over:
        MOVE(0, rot=(math.radians(-88), 0, 0), about=(0, 0.62, 0.0)); MOVE(0, loc=(0, -0.9, 0))


@prop('golf.cart', 'A GOLF CART, DEAD', 'cover', 'LOW_COVER', '.',
      what='an electric golf cart left on the fairway: its canopy sagging, one front tyre flat, a bag of clubs on the back',
      wrong='')
def golf_cart_up():
    golf_cart(False)


@prop('golf.cart_over', 'A GOLF CART ON ITS SIDE', 'cover', 'LOW_COVER', '.',
      what='the same cart, pushed over on its side: its floor toward you, a low wall a man kneels behind', wrong='')
def golf_cart_side():
    golf_cart(True)


@prop('golf.flag_green', 'THE FLAG ON A DEAD GREEN', 'none', 'NONE', '.', landmark=False,
      what='a green gone to straw, raised a little over the fairway in its fringe, the cup cut in it, the pin and its flag',
      wrong='the flag is new: a bright yellow cloth standing straight out from the pin, with no wind, on the only thing on the course anyone still tends')
def golf_flag_green():
    straw, fringe, cup, pin, flag = M('tape_masking', 1), M('clay_mustard', 1), M('cloth_black', 0), M('tape_grey', 4), M('clay_mustard', 4)
    st = []
    for (rx, ry, z) in ((7.4, 5.4, 0.0), (7.0, 5.0, 0.16), (6.2, 4.4, 0.26), (3.0, 2.2, 0.32)):
        st.append((rx, ry, z))
    for i, (rx, ry, z) in enumerate(st):
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=1.0, depth=0.04, location=(0.3 * i, 0.2 * i, z))
        o = bpy.context.active_object; o.scale = (rx, ry, 1.0)
        _take(o, 'green_%d' % i, fringe if i == 0 else straw)
    STAINS((0.6, 0.4, 0.34, 9.0, 6.0, 'z'), 26, 5, (('clay_mustard', 1), ('tape_masking', 0), ('clay_bone', 1)), (0.3, 0.9))   # bare dirt where the turf died first
    C(cup, 0.11, 0.05, (1.2, 0.6, 0.33), v=12, name='cup')
    C(pin, 0.016, 2.3, (1.2, 0.6, 1.47), v=6, name='pin')
    B(flag, (0.55, 0.012, 0.38), (1.2 + 0.29, 0.6, 2.42), name='flag')
    B(M('clay_mustard', 2), (0.06, 0.013, 0.38), (1.21, 0.6, 2.42), name='flag_hem')


@prop('golf.tee', 'THE TEE: A BALL WASHER AND ITS BENCH', 'none', 'NONE', '.',
      what='a tee\'s furniture: the ball washer on its post with its crank and a rag on the hook, a slatted bench, the two '
           'tee markers, a bin, the hole\'s sign on its post',
      wrong='')
def golf_tee():
    post, washer, wood, ball, sign, bin_m = M('metal_painted', 1), M('clay_teal', 2), M('tape_masking', 2), M('tape_grey', 4), M('clay_bone', 3), M('metal_painted', 2)
    C(post, 0.04, 1.0, (-1.2, 0, 0.5), v=8, name='washer_post')
    B(washer, (0.22, 0.32, 0.32), (-1.2, 0, 1.12), name='washer')
    ROD(M('chrome', 1), (-1.2, 0, 1.28), (-1.2, 0, 1.48), 0.012, 5); S(M('rubber', 1), 0.03, (-1.2, 0, 1.5), name='knob')
    B(M('clay_bone', 2), (0.1, 0.03, 0.35), (-1.08, -0.17, 0.9), rot=(0, math.radians(8), 0), name='rag')
    for x in (0.0, 1.5):
        for y in (-0.15, 0.15): B(post, (0.06, 0.06, 0.45), (x, y, 0.225), name='bench_leg')
    for k in range(4): B(wood, (1.8, 0.09, 0.04), (0.75, -0.18 + k * 0.12, 0.47), name='slat')
    for k in range(3): B(wood, (1.8, 0.03, 0.09), (0.75, 0.25, 0.62 + k * 0.12), rot=(math.radians(-12), 0, 0), name='back_slat')
    B(M('clay_mustard', 1), (0.12, 0.03, 0.2), (1.2, 0.25, 0.75), name='slat_missing_gap')
    for x in (-2.6, 2.6): S(ball, 0.13, (x, -1.5, 0.11), name='tee_marker')
    C(bin_m, 0.24, 0.75, (2.5, 0.4, 0.375), v=12, name='bin'); C(M('rubber', 1), 0.25, 0.04, (2.5, 0.4, 0.76), v=12, name='bin_rim')
    C(post, 0.035, 1.6, (-2.4, 0.5, 0.8), v=8, name='sign_post')
    B(sign, (0.6, 0.04, 0.45), (-2.4, 0.47, 1.45), name='hole_sign'); B(M('cloth_black', 1), (0.12, 0.045, 0.22), (-2.4, 0.45, 1.47), name='hole_number')


def palm(down=False):
    trunk, skirt, frond, dead = M('clay_bone', 1), M('clay_mustard', 1), M('clay_mustard', 2), M('tape_masking', 1)
    Ht = 11.5
    lean = lambda z: 0.35 * (z / Ht) ** 2                         # the top 0.35 m over to the east as it rises
    V, Fc, n = [], [], 10
    for i in range(12):
        z = Ht * i / 11; r = 0.26 - 0.08 * i / 11 + (0.08 if i == 0 else 0)
        for k in range(n): a = 2 * math.pi * k / n; V.append((lean(z) + r * math.cos(a), r * math.sin(a), z))
    for i in range(11):
        for k in range(n): Fc.append([i * n + k, i * n + (k + 1) % n, (i + 1) * n + (k + 1) % n, (i + 1) * n + k])
    Fc.append([11 * n + k for k in range(n)])
    MESH(trunk, V, Fc, 'trunk')
    for k in range(18):                                          # the boot scars ringing the trunk
        z = 0.6 + k * 0.55
        C(M('clay_bone', 0), 0.27 - 0.07 * z / Ht, 0.06, (lean(z), 0, z), v=10, name='ring')
    top = mu.Vector((lean(Ht), 0.0, Ht))
    # the skirt: dead fronds hanging flat against the trunk, a cone 3 m long under the crown
    C(skirt, 1.05, 3.2, (0.33, 0, Ht - 1.9), v=18, r2=0.45, name='skirt')
    for k in range(18):
        a = k * 2 * math.pi / 18
        BAR(dead, (0.33 + 0.45 * math.cos(a), 0.45 * math.sin(a), Ht - 0.3), (0.33 + 1.15 * math.cos(a), 1.15 * math.sin(a), Ht - 3.6 - 0.3 * (k % 3)),
            0.32, 0.05, name='hanging_frond')
    # the crown: six fronds, brown, drooped; two snapped and hanging
    for k in range(7):
        a = k * 2 * math.pi / 7 + 0.3
        p0 = top + mu.Vector((0, 0, 0.1)); p1 = p0 + mu.Vector((1.2 * math.cos(a), 1.2 * math.sin(a), 0.7))
        snapped = k in (2, 5)
        p2 = p1 + (mu.Vector((0.3 * math.cos(a), 0.3 * math.sin(a), -1.8)) if snapped else mu.Vector((1.4 * math.cos(a), 1.4 * math.sin(a), -0.6)))
        BAR(frond, tuple(p0), tuple(p1), 0.12, 0.08, name='petiole')
        # the fan: seven leaf segments splayed from the petiole's end, drooping (a snapped one hangs straight down)
        out = mu.Vector((math.cos(a), math.sin(a), 0.0)); side = mu.Vector((-math.sin(a), math.cos(a), 0.0))
        for j in range(7):
            t = (j - 3) / 3.0
            if snapped: tip = p1 + side * (0.35 * t) + out * 0.25 + mu.Vector((0, 0, -1.5 - 0.2 * abs(t)))
            else: tip = p1 + (out * 0.85 + side * (0.8 * t)).normalized() * 1.25 + mu.Vector((0, 0, -0.75 - 0.3 * abs(t)))
            BAR(frond if not snapped else dead, tuple(p1), tuple(tip), 0.16, 0.03, name='leaf_segment')
    C(dead, 0.32, 0.6, tuple(top + mu.Vector((0, 0, 0.1))), v=10, r2=0.1, name='crown_heart')
    # a fallen frond at its foot
    BAR(dead, (0.8, -0.9, 0.04), (2.6, -1.6, 0.04), 1.0, 0.05, name='fallen_frond')
    if down:
        MOVE(0, rot=(0, math.radians(86), math.radians(-12)), about=(0, 0, 0.3)); MOVE(0, loc=(-5.2, 0, 0.15))


@prop('golf.dead_palm', 'A DEAD PALM', 'none', 'NONE', '.',
      what='a Mexican fan palm 11.5 m tall, the kind the valley planted along every fairway: its crown dead brown, two fronds '
           'snapped, the skirt of dead fronds nobody trimmed hanging down its trunk',
      wrong='')
def golf_dead_palm():
    palm(False)


@prop('golf.palm_down', 'A PALM DOWN', 'cover', 'LOW_COVER', 'r',
      what='the same palm fallen across the fairway, its crown smashed on the ground: a long low log a man lies behind, its '
           'dead fronds rough ground to cross', wrong='')
def golf_palm_down():
    palm(True)


def GROUND(i0, z=0.0):
    """everything built since MARK() set down so its lowest point is at z (a thing lying on its side)"""
    lo = min((o.matrix_basis @ v.co).z for o in OBJS[i0:] for v in o.data.vertices)
    for o in OBJS[i0:]: o.matrix_basis = mu.Matrix.Translation((0, 0, z - lo)) @ o.matrix_basis


def SLAB(m, w, d, z0, z1, seed, rough=0.12, n=28, p=4.0, cx=0.0, cy=0.0, name='slab'):
    """a stratum: a squarish outline with a ragged edge, raised from z0 to z1"""
    import random
    rnd = random.Random(seed); pts = []
    for k in range(n):
        a = 2 * math.pi * k / n; c, s = math.cos(a), math.sin(a)
        f = 1 + rough * (0.6 * rnd.uniform(-1, 1) + 0.4 * math.sin(3 * a + seed))
        pts.append((cx + math.copysign(abs(c) ** (2 / p), c) * w / 2 * f, cy + math.copysign(abs(s) ** (2 / p), s) * d / 2 * f))
    return POLY(m, pts, z1 - z0, 'xy', loc=(0, 0, z0), name=name)


def STRATA(w, d, h, seed, shrink=0.05, cx=0.0, cy=0.0, rough=0.16, p=3.4):
    """Aztec sandstone: beds of rust and cream stacked, each a little in from the one under it; potholes on the top"""
    import random
    rnd = random.Random(seed); z = 0.0; i = 0
    tones = [('clay_rust', 2), ('clay_rust', 3), ('clay_rust', 2), ('tape_masking', 3), ('clay_rust', 3), ('clay_rust', 2), ('clay_rust', 1), ('clay_rust', 3)]
    while z < h - 0.05:
        t = min(h, z + rnd.uniform(0.6, 1.3)); k = 1 - shrink * (z / max(h, 0.1)) * 2
        SLAB(M(*tones[(i + seed) % len(tones)]), w * k + rnd.uniform(-0.3, 0.3), d * k + rnd.uniform(-0.3, 0.3), z, t, seed * 13 + i, rough,
             cx=cx + rnd.uniform(-0.15, 0.15), cy=cy + rnd.uniform(-0.15, 0.15), p=p, name='bed')
        z = t; i += 1
    STAINS((cx, cy, h, w * 0.6, d * 0.6, 'z'), 5, seed, (('clay_rust', 0), ('clay_rust', 1)), (0.25, 0.6))
    return h


# ======================================================================================================================
# 4. THE TRAILER PARK: the single-wides on gravel pads off Boulder Highway
# ======================================================================================================================
def single_wide(burnt=False):
    L, W, F, Hb = 16.0, 4.3, 0.8, 2.4
    side = M('rubber', 1) if burnt else M('clay_bone', 4); trim = M('tape_grey', 3); roof = M('rubber', 2) if burnt else M('tape_grey', 4)
    glass = M('cloth_black', 0) if burnt else M('glass_eye', 0); block = M('tape_grey', 2)
    for k in range(7):                                             # the piers: cinder blocks stacked three high under both rails
        x = -L / 2 + 1.0 + k * (L - 2.0) / 6
        for y in (-1.4, 1.4):
            for j in range(3): B(block, (0.4, 0.2, 0.2), (x, y, 0.1 + j * 0.2), rot=(0, 0, math.radians(90 * (j % 2))), name='block')
    for y in (-1.4, 1.4): B(M('rubber', 1), (L, 0.15, 0.2), (0, y, 0.7), name='rail')
    if not burnt:
        B(side, (L, W, Hb), (0, 0, F + Hb / 2), name='box')
        for j in range(8): B(trim, (L, 0.02, 0.03), (0, -W / 2 - 0.01, F + 0.15 + j * 0.3), name='siding_line')
        B(roof, (L + 0.2, W + 0.2, 0.12), (0, 0, F + Hb + 0.06), name='roof')
        B(roof, (L, W * 0.6, 0.12), (0, 0, F + Hb + 0.16), name='roof_crown')
        STAINS((0, 0, F + Hb + 0.23, L - 1, W * 0.5, 'z'), 10, 41)
        STAINS((0, -W / 2, F + 0.9, L - 1, 1.2, '-y'), 7, 42, (('clay_rust', 1), ('clay_bone', 1)), (0.1, 0.3))
    else:                                                          # burnt: the shell black, the roof fallen into the middle
        B(side, (L, 0.08, Hb), (0, -W / 2, F + Hb / 2), name='wall_burnt'); B(side, (L, 0.08, Hb * 0.8), (0, W / 2, F + Hb * 0.4), name='wall_burnt')
        for x in (-L / 2, L / 2): B(side, (0.08, W, Hb), (x, 0, F + Hb / 2), name='end_burnt')
        B(M('cloth_black', 0), (L - 0.2, W - 0.2, 0.05), (0, 0, F + 0.1), name='floor_ash')
        for k in range(5):
            if k == 2: continue
            x = -L / 2 + 1.6 + k * 3.2
            B(roof, (3.1, W, 0.06), (x, 0, F + Hb - (0.9 if k in (1, 3) else 0.0)), rot=(0, math.radians(14 if k == 1 else (-14 if k == 3 else 0)), 0), name='roof_fallen')
        for k in range(8): ROD(M('clay_rust', 1), (-L / 2 + 1 + k * 2, -W / 2, F + Hb), (-L / 2 + 1 + k * 2, W / 2, F + Hb - 0.4 * (k % 3)), 0.04, 5, name='rafter')
        STAINS((0, -W / 2, F + 1.2, L - 1, 2.0, '-y'), 10, 43, (('cloth_black', 0), ('clay_rust', 0)), (0.3, 0.8))
    # windows, the door and its steps, an AC unit, the tongue at the end
    for k, x in enumerate((-6.5, -4.0, -0.5, 2.5, 6.0)):
        B(trim, (1.1, 0.04, 1.0), (x, -W / 2 - 0.02, F + 1.45), name='window_frame')
        B(glass if k != 3 else M('tape_masking', 2), (0.95, 0.05, 0.85), (x, -W / 2 - 0.04, F + 1.45), name='window')
    if not burnt:
        B(M('metal_painted', 3), (0.7, 0.55, 0.45), (-4.0, -W / 2 - 0.3, F + 1.3), name='ac_unit')
    B(trim if not burnt else M('rubber', 0), (0.9, 0.05, 2.0), (4.4, -W / 2 - 0.04, F + 1.0), name='door')
    for j in range(3): B(M('tape_masking', 1), (1.2, 0.45, 0.2), (4.4, -W / 2 - 0.35 - j * 0.12, 0.1 + j * 0.2), name='pallet_step')
    BAR(M('rubber', 1), (L / 2, -1.2, 0.7), (L / 2 + 1.8, 0, 0.55), 0.12); BAR(M('rubber', 1), (L / 2, 1.2, 0.7), (L / 2 + 1.8, 0, 0.55), 0.12)
    C(M('rubber', 1), 0.05, 0.55, (L / 2 + 1.7, 0, 0.27), v=8, name='jack')
    # the skirt: some panels still on, the rest fallen flat on the gravel
    for k in range(10):
        x = -L / 2 + 0.8 + k * 1.6
        if burnt or k % 3 == 1: B(M('tape_masking', 3), (1.55, 0.04, 0.75), (x, -W / 2 - 0.4 - 0.3 * (k % 2), 0.03), rot=(math.radians(88), 0, math.radians(4 * (k % 3))), name='skirt_down')
        else: B(M('tape_masking', 3), (1.55, 0.04, 0.78), (x, -W / 2 + 0.05, 0.39), name='skirt')


@prop('trailer.trailer', 'A TRAILER ON BLOCKS', 'blocking', 'COVER', '#', landmark=True,
      what='a 16 m single-wide on cinder-block piers, its skirt half fallen so you see the blocks, aluminium siding, a crowned '
           'roof, a window unit, one window boarded, pallets for steps, its tongue still on', wrong='')
def trailer_trailer():
    single_wide(False)


@prop('trailer.burnt', 'A TRAILER BURNT OUT', 'blocking', 'COVER', '#',
      what='the next single-wide burnt to its shell: black walls, its roof fallen into the middle, ash on the floor, its '
           'rafters bare', wrong='')
def trailer_burnt():
    single_wide(True)


@prop('trailer.propane', 'THE PROPANE TANKS', 'cover', 'COVER', '.', burns=True,
      what='the park\'s 500 gallon tank (the kit\'s own model, whole) and two 100 pound bottles chained to a post beside it; hit '
           'one and the ground burns', wrong='')
def trailer_propane():
    IMPORT('propane.glb')
    bottle, cap = M('clay_bone', 4), M('tape_grey', 3)
    for k, x in enumerate((2.3, 3.1)):
        C(bottle, 0.37, 1.15, (x, 0.2, 0.62), v=16, name='bottle'); S(bottle, 0.37, (x, 0.2, 1.2), (1, 1, 0.45), name='bottle_top')
        C(cap, 0.22, 0.22, (x, 0.2, 1.42), v=12, name='collar'); C(M('chrome', 1), 0.05, 0.12, (x + 0.05, 0.2, 1.52), v=8, name='valve')
    C(M('rubber', 1), 0.05, 1.5, (2.7, 0.75, 0.75), v=8, name='chain_post')
    ROD(M('chrome', 1), (2.0, 0.0, 1.0), (3.4, 0.0, 1.0), 0.02, 5, name='chain')
    B(M('clay_rust', 2), (0.3, 0.02, 0.2), (2.3, -0.18, 0.9), name='placard')


@prop('trailer.carport', 'A CARPORT', 'none', 'NONE', '.',
      what='a steel carport, 6 m by 3.6 m on four posts, one post buckled so the roof sags to a corner; under it a couch '
           'and a stack of tyres (the kit\'s own)', wrong='')
def trailer_carport():
    post, roof = M('tape_grey', 2), M('tape_grey', 3)
    for (x, y, h) in ((-3, -1.8, 2.4), (3, -1.8, 1.7), (-3, 1.8, 2.5), (3, 1.8, 2.45)):
        C(post, 0.05, h, (x, y, h / 2), v=8, name='post')
    B(roof, (6.4, 4.0, 0.04), (0, 0, 2.3), rot=(math.radians(-5), math.radians(-6), 0), name='roof')
    for k in range(16): B(roof, (0.05, 4.0, 0.05), (-3.1 + k * 0.41, 0, 2.33 + 0.003 * k), rot=(math.radians(-5), math.radians(-6), 0), name='rib')
    STAINS((0, 0, 2.38, 5.6, 3.4, 'z'), 6, 51)
    couch, cush = M('clay_teal', 1), M('clay_teal', 2)
    B(couch, (2.1, 0.9, 0.45), (-1.0, 0.8, 0.23), name='couch'); B(couch, (2.1, 0.25, 0.5), (-1.0, 1.15, 0.7), name='couch_back')
    for x in (-1.95, -0.05): B(couch, (0.22, 0.9, 0.62), (x, 0.8, 0.31), name='arm')
    for x in (-1.5, -0.5): B(cush, (0.9, 0.6, 0.12), (x, 0.7, 0.5), rot=(0, 0, math.radians(3)), name='cushion')
    IMPORT('tyres.glb', loc=(1.6, 0.8, 0.0))


@prop('trailer.clothesline', 'THE CLOTHESLINE', 'none', 'NONE', '.',
      what='two T-posts 6 m apart and three lines between them, the washing pegged out on them, a basket on the gravel',
      wrong='the washing is spotless white, the only clean thing in the park, pegged out fresh, and nobody lives here')
def trailer_clothesline():
    post, line, white = M('tape_grey', 2), M('tape_grey', 3), M('tape_grey', 4)
    for x in (-3.0, 3.0):
        C(post, 0.04, 2.1, (x, 0, 1.05), v=8, name='post'); B(post, (0.06, 1.2, 0.06), (x, 0, 2.05), name='tbar')
    for y in (-0.5, 0.0, 0.5): ROD(line, (-3.0, y, 2.05), (3.0, y, 1.95), 0.008, 4, name='line')
    for (x, y, w, h) in ((-2.2, -0.5, 0.55, 0.7), (-1.4, -0.5, 0.55, 0.7), (-0.4, -0.5, 1.6, 1.3), (1.0, -0.5, 0.45, 0.5), (1.6, -0.5, 0.35, 0.4),
                         (2.2, -0.5, 0.35, 0.4), (-1.8, 0.0, 1.8, 1.4), (0.9, 0.0, 0.6, 0.75), (-0.5, 0.5, 0.5, 0.6), (1.5, 0.5, 1.6, 1.3)):
        B(white, (w, 0.02, h), (x, y, 2.0 - h / 2), name='washing')
        for px in (x - w / 2 + 0.05, x + w / 2 - 0.05): B(M('clay_mustard', 3), (0.03, 0.03, 0.08), (px, y - 0.015, 2.0), name='peg')
    B(M('clay_teal', 3), (0.6, 0.4, 0.3), (2.4, -1.2, 0.15), name='basket')


# ======================================================================================================================
# 5. THE DESERT: the open Mojave between the valley and everything else
# ======================================================================================================================
def joshua(seed, H=4.6):
    import random
    rnd = random.Random(seed)
    bark, shag, leaf, tip = M('clay_bone', 1), M('clay_mustard', 1), M('metal_painted', 2), M('clay_mustard', 2)

    def rosette(q, d):
        for k in range(26):
            a = 2 * math.pi * k / 26 + rnd.uniform(0, 0.3); up = rnd.uniform(-0.4, 0.95)
            v = (d * up + mu.Vector((math.cos(a), math.sin(a), 0)) * (1 - abs(up) * 0.5)).normalized()
            BAR(leaf if k % 3 else tip, tuple(q), tuple(q + v * 0.55), 0.05, 0.012, name='spike')

    def branch(p, d, L, r, lvl):
        q = p + d * L
        ROD(bark, tuple(p), tuple(q), r, 7, name='limb')
        if lvl < 2: ROD(shag, tuple(p + d * L * 0.35), tuple(q), r * 1.9, 8, name='shag')
        if lvl == 0: rosette(q, d); return
        for j in range(2 if lvl == 1 else rnd.choice((2, 3))):
            a = rnd.uniform(0, 2 * math.pi); tilt = rnd.uniform(0.5, 0.9)
            nd = (mu.Vector((math.cos(a) * tilt, math.sin(a) * tilt, 1.0 - 0.35 * tilt))).normalized()
            branch(q, nd, L * rnd.uniform(0.55, 0.75), r * 0.72, lvl - 1)
    branch(mu.Vector((0, 0, 0)), mu.Vector((0.05, 0, 1)).normalized(), H * 0.42, 0.3, 2)
    for k in range(6): B(M('clay_mustard', 1), (0.6, 0.06, 0.03), (0.3 * math.cos(k), 0.3 * math.sin(k) - 0.4, 0.02), rot=(0, 0, k), name='fallen_leaves')


@prop('desert.joshua', 'A JOSHUA TREE', 'none', 'NONE', '.',
      what='a Joshua tree 4.6 m tall, branched twice, each arm ending in its fist of spikes, the dead leaves shagging its limbs', wrong='')
def desert_joshua():
    joshua(5)


@prop('desert.joshua_small', 'A YOUNG JOSHUA TREE', 'none', 'NONE', '.',
      what='a younger Joshua tree, 3 m, branched once', wrong='')
def desert_joshua_small():
    joshua(11, 3.0)


@prop('desert.boulders', 'BOULDERS', 'cover', 'COVER', '.',
      what='four granite boulders, desert-varnished dark on top and pale where they split, the biggest 1.7 m: cover a man '
           'crouches behind', wrong='')
def desert_boulders():
    for i, (x, y, s) in enumerate(((0, 0, (2.6, 2.2, 1.7)), (1.9, 0.6, (1.6, 1.4, 1.1)), (-1.7, 0.4, (1.4, 1.3, 0.9)), (0.7, -1.4, (1.1, 1.0, 0.7)))):
        ROCK(M('clay_rust', 1) if i % 2 else M('metal_painted', 1), (x, y, 0), s, seed=60 + i, sub=3, rough=0.22, sink=0.15, name='boulder')
        STAINS((x, y, s[2] * 0.85, s[0] * 0.5, s[1] * 0.4, 'z'), 2, 61 + i, (('rubber', 1), ('clay_rust', 0)), (0.15, 0.35))


@prop('desert.buried_car', 'A DEAD CAR HALF BURIED', 'cover', 'LOW_COVER', '.',
      what='a sedan (the kit\'s own wreck, whole) half under a sand drift, its nose down in the dune, sand piled over its '
           'bonnet and up its doors', wrong='its headlights are on')
def desert_buried_car():
    d = MARK()
    IMPORT('wreck.glb')
    for y in (-0.6, 0.6): S(M('sodium', 4, glow=4.0), 0.1, (-2.42, y, 0.62), (0.4, 1, 0.8), name='headlight')
    MOVE(d, loc=(0, 0, -0.38), rot=(0, math.radians(-5), 0), about=(-2.4, 0, 0))
    sand = M('clay_bone', 2)
    ROCK(sand, (0.6, 1.3, 0), (6.0, 3.0, 1.25), seed=71, sub=3, rough=0.12, sink=0.05, name='drift')
    ROCK(sand, (2.4, 0.2, 0), (2.6, 2.6, 0.9), seed=72, sub=3, rough=0.12, sink=0.05, name='drift')
    ROCK(sand, (-0.6, -1.1, 0), (3.6, 1.0, 0.35), seed=73, sub=2, rough=0.12, sink=0.05, name='drift')


def lattice_tower(steel, Ht=24.0, base=6.0, waist=2.0, zw=16.0):
    def half(z): return base / 2 + (waist / 2 - base / 2) * z / zw if z <= zw else waist / 2
    lv = [3.0, 6.3, 9.6, 12.9, 16.0, 20.0, Ht]
    cs = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    for i, z in enumerate(lv):
        h = half(z)
        for k in range(4):
            a, b = cs[k], cs[(k + 1) % 4]
            ROD(steel, (a[0] * h, a[1] * h, z), (b[0] * h, b[1] * h, z), 0.05, 4, name='girt')
        if i + 1 < len(lv):
            z2 = lv[i + 1]; h2 = half(z2)
            for k in range(4):
                a, b = cs[k], cs[(k + 1) % 4]
                ROD(steel, (a[0] * h, a[1] * h, z), (a[0] * h2, a[1] * h2, z2), 0.11, 5, name='leg')
                ROD(steel, (a[0] * h, a[1] * h, z), (b[0] * h2, b[1] * h2, z2), 0.045, 4, name='brace')
                ROD(steel, (b[0] * h, b[1] * h, z), (a[0] * h2, a[1] * h2, z2), 0.045, 4, name='brace')
    tips = []
    for (z, span) in ((16.0, 6.5), (20.0, 4.8)):
        for s in (-1, 1):
            ROD(steel, (0, s * waist / 2, z), (0, s * span, z), 0.09, 5, name='arm'); ROD(steel, (0, s * waist / 2, z + 1.4), (0, s * span, z), 0.06, 4, name='arm_tie')
            ROD(M('glass_eye', 1), (0, s * span, z), (0, s * span, z - 1.6), 0.09, 6, name='insulator'); tips.append((0, s * span, z - 1.6))
    return tips


@prop('desert.pylon', 'A POWER PYLON DOWN', 'blocking', 'COVER', '#', see=True, landmark=True,
      what='a 24 m steel lattice transmission tower snapped at its footings and lying on its face across the desert, its '
           'arms and insulators in the dirt, its conductors trailing off; its legs still stand where it broke. You see through it, '
           'you go round it', wrong='')
def desert_pylon():
    steel, conc = M('tape_grey', 2), M('tape_grey', 3)
    for (x, y) in ((3, 3), (-3, 3), (-3, -3), (3, -3)):
        C(conc, 0.45, 0.5, (x, y, 0.25), v=10, name='footing')
        ROD(steel, (x, y, 0.4), (x * 0.95, y * 0.95, 1.6 + 0.3 * ((x > 0) + (y > 0))), 0.11, 5, name='leg_stub')
    d = MARK()
    tips = lattice_tower(steel)
    MOVE(d, rot=(0, math.radians(82.9), 0), about=(0, 0, 0))
    GROUND(d, 0.02)
    MOVE(d, loc=(2.0, 0, 0))
    bpy.context.view_layer.update()
    for o in OBJS[d:]:
        if o.name.startswith('insulator'):
            e = o.matrix_basis @ mu.Vector((0, 0, o.dimensions.z / 2))
            pts = [e, e + mu.Vector((4.0, 1.5, 0)), e + mu.Vector((9.0, 2.0, 0))]
            for a, b in zip(pts, pts[1:]): ROD(M('rubber', 1), (a.x, a.y, 0.04), (b.x, b.y, 0.04), 0.025, 5, name='conductor')


# ======================================================================================================================
# 6. RED ROCK: Calico's Aztec sandstone, height you take
# ======================================================================================================================
@prop('redrock.ledge_1', 'A SANDSTONE LEDGE, ONE STOREY', 'blocking', 'HEIGHT', 'H',
      what='a slickrock ledge 12 m by 9 m and 3 m high, its beds of rust and cream sandstone stepping in as they rise, '
           'potholes on its flat top: height you climb to', wrong='')
def redrock_ledge_1():
    STRATA(11.5, 8.5, 3.0, 1)
    for k in range(4): ROCK(M('clay_rust', 2), (-5.0 + k * 3.2, -4.6 - 0.3 * (k % 2), 0), (1.2, 1.0, 0.7), seed=80 + k, sub=2, name='talus')


@prop('redrock.ledge_2', 'A SANDSTONE LEDGE, TWO STOREYS', 'blocking', 'HEIGHT', 'H',
      what='the same rock, 6 m high: a step up from the one-storey ledge, its face too steep to climb but from the lower one', wrong='')
def redrock_ledge_2():
    STRATA(11.5, 8.5, 6.0, 2)
    for k in range(3): ROCK(M('clay_rust', 3), (-4.0 + k * 3.8, -4.7, 0), (1.4, 1.1, 0.8), seed=90 + k, sub=2, name='talus')


@prop('redrock.ledge_3', 'A SANDSTONE LEDGE, THREE STOREYS', 'blocking', 'HEIGHT', 'H',
      what='the top step, 9 m high, the highest ground on any board', wrong='on its top, where nobody could climb, a cairn of stones somebody stacked')
def redrock_ledge_3():
    STRATA(11.5, 8.5, 9.0, 3)
    for j, r in enumerate((0.42, 0.36, 0.3, 0.24, 0.17)):
        ROCK(M('clay_bone', 2 + (j % 2)), (1.5, 0.5, 9.0 + sum((0.42, 0.36, 0.3, 0.24, 0.17)[:j]) * 0.75), (r * 2.2, r * 2, r * 1.1), seed=95 + j, sub=2, rough=0.15, sink=0.0, name='cairn')


@prop('redrock.fin', 'A SANDSTONE FIN', 'blocking', 'COVER', '#', landmark=True,
      what='an Aztec sandstone fin 14 m long, 2.5 m thick and 10 m tall, weathered round on top, its cross-bedded bands '
           'running along it: a wall across the board you go round or hold', wrong='')
def redrock_fin():
    import random
    rnd = random.Random(7); z = 0.0; i = 0
    while z < 10.0:
        t = min(10.0, z + rnd.uniform(0.5, 1.0)); f = 1 - (z / 10.0) ** 3 * 0.55
        f = 1 - (z / 10.0) ** 4 * 0.45
        SLAB(M(*[('clay_rust', 2), ('clay_rust', 3), ('clay_rust', 2), ('tape_masking', 3), ('clay_rust', 1)][i % 5]), 14 * f, 2.5 * (1 - 0.3 * z / 10), z, t, 200 + i, 0.14,
             cx=0.6 * math.sin(z * 0.4), p=3.2, name='fin_bed')
        z = t; i += 1
    for k in range(5): ROCK(M('clay_rust', 2), (-6 + k * 3, -2.0 - 0.4 * (k % 2), 0), (1.3, 1.1, 0.8), seed=210 + k, sub=2, name='talus')


@prop('redrock.slot', 'THE SLOT CANYON\'S WALLS', 'blocking', 'COVER', '#',
      what='two sandstone walls 12 m long and 7 m high, curving together with a slot 1.1 m wide between them: one man '
           'at a time walks through it', wrong='')
def redrock_slot():
    import random
    for side in (-1, 1):
        rnd = random.Random(30 + side); z = 0.0; i = 0
        while z < 7.0:
            t = min(7.0, z + rnd.uniform(0.5, 1.0))
            wob = 0.35 * math.sin(z * 0.7 + side)
            SLAB(M(*[('clay_rust', 2), ('clay_rust', 3), ('clay_rust', 2), ('tape_masking', 3), ('clay_rust', 1)][i % 5]), 12.5 - 0.4 * z / 7, 2.4, z, t, 300 + i * 7 + side * 50, 0.06,
                 cx=0.3 * math.sin(z), cy=side * (0.55 + 1.2) + wob, p=7.0, n=40, name='slot_bed')
            z = t; i += 1


# ======================================================================================================================
# 7. THE PASS: NV-160 over Mountain Springs, the road on a shelf
# ======================================================================================================================
@prop('pass.guardrail', 'GUARD RAIL, A RUN', 'cover', 'LOW_COVER', '.',
      what='12 m of W-beam guard rail on its posts at the road\'s edge, one section hit and folded out over the drop, the '
           'reflectors on its posts', wrong='')
def pass_guardrail():
    post, beam, refl = M('tape_grey', 2), M('chrome', 0), M('clay_mustard', 4, glow=0.6)
    for k in range(7):
        x = -6 + k * 1.9; bent = k in (4, 5)
        B(post, (0.15, 0.15, 1.0), (x, 0.15 * bent, 0.5), rot=(math.radians(-25 if bent else 0), 0, 0), name='post')
        B(refl, (0.06, 0.02, 0.1), (x, -0.1, 0.85), name='reflector')
    for j in range(3):
        x0, x1 = -6.2 + j * 4.0, -2.2 + j * 4.0
        if j == 2:
            BAR(beam, (x0, 0.3, 0.6), (x1 - 0.5, 1.4, 0.35), 0.32, 0.06, name='w_beam_bent'); continue
        B(beam, (4.05, 0.08, 0.32), ((x0 + x1) / 2, -0.12, 0.6), name='w_beam')
        B(beam, (4.05, 0.1, 0.08), ((x0 + x1) / 2, -0.15, 0.6), name='w_beam_fold')
    STAINS((0, -0.17, 0.6, 9.0, 0.25, '-y'), 6, 77, (('clay_rust', 1), ('rubber', 1)), (0.06, 0.16))


@prop('pass.rockfall', 'A ROCKFALL', 'blocking', 'MOUND', 'H', landmark=False,
      what='limestone blocks down off the cut face across half the road, the biggest 2.6 m, a fan of scree under them: a '
           'heap you climb for the shot, or go round', wrong='')
def pass_rockfall():
    import random
    rnd = random.Random(9)
    for i in range(11):
        s = rnd.uniform(0.9, 2.6); x, y = rnd.uniform(-4.5, 4.5), rnd.uniform(-2.5, 2.5)
        ROCK(M('tape_grey', 2 + (i % 2)), (x, y, 0), (s * 1.2, s, s * 0.8), seed=400 + i, sub=2, rough=0.18, sink=0.2, name='block')
    ROCK(M('tape_grey', 2), (0, 0, 0), (11.0, 7.0, 1.0), seed=420, sub=3, rough=0.15, sink=0.3, name='scree_fan')
    for i in range(30):
        ROCK(M('tape_grey', 3), (rnd.uniform(-5.5, 5.5), rnd.uniform(-3.5, 3.5), 0), (0.35, 0.3, 0.25), seed=430 + i, sub=1, rough=0.2, sink=0.1, name='scree')


@prop('pass.truck', 'A JACKKNIFED TRUCK', 'blocking', 'COVER', '#', landmark=True,
      what='a semi folded on the grade: the tractor turned across the road, its 16 m trailer swung round behind it, its back '
           'doors open', wrong='the trailer is empty and white inside, spotless, in a valley of dust')
def pass_truck():
    cab, box, chassis, glass = M('clay_rust', 2), M('clay_bone', 4), M('rubber', 2), M('glass_eye', 0)
    d = MARK()                                                     # the trailer along x, its kingpin at +x
    B(box, (16.0, 2.6, 2.9), (0, 0, 2.55), name='trailer')
    for k in range(20):
        B(M('clay_bone', 3), (0.06, 2.64, 2.9), (-7.8 + k * 0.82, 0, 2.55), name='trailer_rib')
    STAINS((0, 0, 4.0, 15.0, 2.2, 'z'), 12, 91, (('clay_bone', 0), ('rubber', 1), ('clay_mustard', 0)), (0.2, 0.5))
    STAINS((0, -1.3, 2.4, 15.0, 2.0, '-y'), 8, 92, (('clay_bone', 0), ('clay_rust', 1)), (0.2, 0.5))
    B(M('tape_grey', 4), (0.04, 2.4, 2.7), (-8.02, 0, 2.55), name='inside_white')
    for s in (-1, 1): B(box, (0.06, 1.3, 2.8), (-8.1, s * 1.95, 2.55), rot=(0, 0, math.radians(s * 85)), name='door_open')
    for x in (-6.8, -5.6):
        for s in (-1, 1): WHEEL(0.52, 0.6, (x, s * 0.95, 0.52), name='trailer_wheel')
    B(chassis, (1.2, 2.2, 0.3), (5.5, 0, 0.95), name='landing_gear')
    MOVE(d, rot=(0, 0, math.radians(-38)), about=(7.2, 0, 0))
    d = MARK()                                                     # the tractor, turned across the road
    B(chassis, (6.4, 1.0, 0.3), (0, 0, 0.7), name='frame')
    B(cab, (2.2, 2.5, 2.0), (-0.6, 0, 2.0), name='cab'); B(cab, (1.6, 2.4, 1.5), (1.1, 0, 2.2), name='sleeper')
    B(cab, (2.0, 2.1, 1.1), (-2.6, 0, 1.4), name='hood'); B(M('chrome', 1), (0.1, 1.4, 1.0), (-3.62, 0, 1.4), name='grille')
    B(glass, (0.05, 2.2, 0.8), (-1.72, 0, 2.55), rot=(0, math.radians(-10), 0), name='windscreen')
    for s in (-1, 1):
        C(M('chrome', 1), 0.13, 2.2, (0.4, s * 1.35, 3.0), v=10, name='stack'); C(M('chrome', 1), 0.35, 1.3, (0.4, s * 1.1, 0.95), (0, math.pi / 2, 0), 12, name='tank')
    for (x, s) in ((-2.6, -1), (-2.6, 1), (1.8, -1), (1.8, 1), (2.9, -1), (2.9, 1)):
        WHEEL(0.52, 0.32, (x, s * 1.05, 0.52), name='tractor_wheel')
    MOVE(d, loc=(10.2, -2.0, 0), rot=(0, 0, math.radians(58)))


@prop('pass.barricade', 'THE ROAD CLOSED', 'cover', 'LOW_COVER', '.',
      what='a road-closed barricade (three striped boards on its legs), its sign bent, and three drums beside it, left '
           'when the pass was shut and never opened', wrong='')
def pass_barricade():
    white, stripe, leg = M('tape_grey', 4), M('clay_rust', 2), M('tape_grey', 2)
    for x in (-1.3, 1.3):
        ROD(leg, (x, -0.3, 0), (x, 0, 1.5), 0.04, 5); ROD(leg, (x, 0.3, 0), (x, 0, 1.5), 0.04, 5)
    for j, z in enumerate((0.55, 0.95, 1.35)):
        B(white, (3.0, 0.04, 0.25), (0, -0.02, z), name='board')
        for k in range(5): B(stripe, (0.22, 0.045, 0.25), (-1.2 + k * 0.6, -0.025, z), rot=(0, math.radians(45), 0), name='stripe')
    B(white, (1.0, 0.04, 0.6), (0.4, -0.05, 1.85), rot=(0, math.radians(14), math.radians(8)), name='sign')
    B(M('cloth_black', 1), (0.7, 0.045, 0.12), (0.4, -0.08, 1.85), rot=(0, math.radians(14), math.radians(8)), name='sign_words')
    for k, (x, y) in enumerate(((2.4, 0.2), (3.2, -0.3), (3.6, 0.6))):
        C(M('clay_rust', 2), 0.3, 0.9, (x, y, 0.45), v=14, name='drum'); C(white, 0.305, 0.12, (x, y, 0.6), v=14, name='drum_band')


# ======================================================================================================================
# 8. THE SHORE: Lake Mead gone down, the bathtub ring above everything
# ======================================================================================================================
@prop('shore.intake', 'THE INTAKE TOWER', 'blocking', 'COVER', '#', landmark=True,
      what='a water intake tower standing out on the dry bed: a concrete drum 8 m across and 14 m tall, trash racks on its '
           'sides, its gantry crane on top, a walkway stub that went to shore, the white ring where the water stood', wrong='')
def shore_intake():
    conc, ring, rack, steel = M('tape_grey', 3), M('tape_grey', 4), M('metal_painted', 1), M('clay_mustard', 2)
    C(conc, 4.0, 14.0, (0, 0, 7.0), v=32, name='drum')
    C(ring, 4.03, 2.2, (0, 0, 9.4), v=32, name='bathtub_ring')
    C(M('clay_bone', 1), 4.02, 6.0, (0, 0, 3.0), v=32, name='lake_stain')
    C(conc, 4.4, 0.5, (0, 0, 14.0), v=32, name='cap')
    for k in range(6):
        a = math.radians(-90 + (k - 2.5) * 30)
        for z in (3.0, 7.0):
            B(rack, (2.2, 0.15, 3.2), (4.05 * math.cos(a), 4.05 * math.sin(a), z), rot=(0, 0, a + math.pi / 2), name='trash_rack')
    for s in (-1, 1): B(steel, (0.4, 0.4, 3.0), (s * 2.6, 0, 15.7), name='crane_leg')
    B(steel, (6.0, 0.5, 0.5), (0, 0, 17.2), name='crane_beam'); B(M('rubber', 1), (0.6, 0.6, 0.6), (1.0, 0, 16.6), name='hoist')
    for s in (-1, 1): ROD(M('chrome', 1), (s * 4.2, -0.6, 14.9), (s * 4.2, 0.6, 14.9), 0.03, 5, name='rail')
    B(conc, (2.4, 7.0, 0.6), (0, 7.3, 13.0), name='walkway'); B(M('clay_rust', 1), (2.6, 0.4, 0.8), (0, 10.9, 12.8), rot=(math.radians(20), 0, 0), name='walkway_torn')
    STAINS((0, -4.0, 6.0, 6.0, 10.0, '-y'), 10, 111, (('clay_rust', 1), ('clay_bone', 0), ('rubber', 1)), (0.3, 0.8))


@prop('shore.dock', 'A DOCK ON DRY LAND', 'none', 'HEIGHT', 'H',
      what='a floating dock section 12 m long come to rest on the mud on its black floats, tilted, its planks warped, its '
           'cleats and rail, a gangway climbing from it to nothing: a deck a man stands up on', wrong='')
def shore_dock():
    deck, float_m, cleat = M('tape_masking', 2), M('rubber', 1), M('chrome', 0)
    d = MARK()
    for k in range(8):
        for y in (-1.0, 1.0): B(float_m, (1.3, 1.0, 0.55), (-5.3 + k * 1.5, y, 0.28), name='float')
    B(M('tape_grey', 2), (12.0, 3.0, 0.2), (0, 0, 0.65), name='frame')
    for k in range(40): B(M('tape_masking', 1 + (k % 3 == 0)), (0.27, 2.9, 0.05), (-5.85 + k * 0.3, 0, 0.78 + 0.01 * (k % 2)), name='plank')
    for x in (-5, -1, 3, 5.6):
        for y in (-1.45, 1.45): B(cleat, (0.3, 0.08, 0.08), (x, y, 0.85), name='cleat')
    for x in range(-5, 6, 2): ROD(M('tape_grey', 2), (x, 1.45, 0.8), (x, 1.45, 1.6), 0.025, 5, name='stanchion')
    ROD(M('tape_grey', 2), (-5, 1.45, 1.6), (5, 1.45, 1.6), 0.025, 5, name='rail')
    MOVE(d, rot=(math.radians(3), math.radians(-4), 0))
    BAR(M('tape_grey', 2), (6.0, 0.0, 0.8), (13.0, 0.4, 3.4), 1.0, 0.12, name='gangway')
    for s in (-1, 1): BAR(M('tape_grey', 2), (6.0, s * 0.5, 1.6), (13.0, 0.4 + s * 0.5, 4.2), 0.04, name='gangway_rail')


def hull(L, Bm, D, vee=0.55, cabin=True, dark=False):
    """a planing hull along x, bow at -x: a loft of V rings, a deck, a windscreen or a cabin"""
    gel = M('tape_grey', 4) if not dark else M('clay_bone', 3); stripe = M('clay_teal', 2)
    st = [(-L / 2, 0.05, 0.05, D * 0.75), (-L / 2 + L * 0.08, Bm * 0.28, D * 0.42, D * 0.62), (-L / 2 + L * 0.25, Bm * 0.47, D * 0.5, D * 0.55),
          (L * 0.1, Bm / 2, D * 0.52, D * 0.52), (L / 2 - 0.1, Bm * 0.47, D * 0.5, D * 0.52), (L / 2, Bm * 0.45, D * 0.45, D * 0.55)]
    LOFT(gel, st, n=18, p=2.6, vee=vee, name='hull')
    B(stripe, (L * 0.8, Bm * 0.99, 0.12), (L * 0.05, 0, D * 0.8), name='rub_stripe')
    B(M('tape_grey', 3), (L * 0.75, Bm * 0.85, 0.06), (L * 0.08, 0, D * 1.03), name='deck')
    if cabin:
        B(gel, (L * 0.35, Bm * 0.75, D * 0.7), (-L * 0.05, 0, D * 1.35), name='cabin')
        for s in (-1, 1): B(M('glass_eye', 0), (L * 0.25, 0.04, D * 0.25), (-L * 0.05, s * Bm * 0.376, D * 1.45), name='port')
        B(M('glass_eye', 0), (0.05, Bm * 0.7, D * 0.4), (-L * 0.23, 0, D * 1.5), rot=(0, math.radians(-30), 0), name='windscreen')
    else:
        B(M('glass_eye', 1), (0.05, Bm * 0.8, 0.45), (-L * 0.08, 0, D * 1.3), rot=(0, math.radians(-35), 0), name='windscreen')
        B(M('cloth_black', 2), (0.6, Bm * 0.6, 0.45), (L * 0.12, 0, D * 1.25), name='seats')
    B(M('rubber', 1), (0.45, 0.4, 0.9), (L / 2 + 0.25, 0, D * 0.75), name='outboard')
    STAINS((0, 0, D * 1.07, L * 0.6, Bm * 0.6, 'z'), 5, int(L * 10), (('clay_bone', 0), ('clay_rust', 1)), (0.15, 0.4))


@prop('shore.boat', 'A BOAT ON ITS SIDE', 'cover', 'COVER', '.',
      what='a 7 m runabout lying on its side in the cracked mud where the water left it, its hull to you, its outboard in the air',
      wrong='its anchor line runs taut down into the dry mud, as if something under there is holding it')
def shore_boat():
    d = MARK(); hull(7.0, 2.4, 1.2, cabin=False)
    MOVE(d, rot=(math.radians(-78), 0, 0)); GROUND(d, -0.12)
    ROD(M('tape_masking', 3), (-3.4, -0.5, 0.9), (-5.6, -1.6, 0.0), 0.02, 4, name='anchor_line')
    ROCK(M('rubber', 2), (-5.6, -1.6, 0), (0.5, 0.4, 0.15), seed=500, sub=1, sink=0.5, name='line_hole')


@prop('shore.buoys', 'THE BUOYS', 'none', 'NONE', '.',
      what='a channel can buoy on its side in the mud, its chain run out, and a white no-wake buoy standing up on its sinker '
           'with no water within a mile', wrong='')
def shore_buoys():
    C(M('clay_teal', 2), 0.55, 1.8, (0, 0, 0.5), (math.radians(80), 0, math.radians(20)), 16, name='can_buoy')
    C(M('tape_grey', 4), 0.3, 1.5, (2.2, 0.8, 0.75), v=14, name='nowake'); B(M('clay_mustard', 3), (0.62, 0.62, 0.12), (2.2, 0.8, 1.2), name='nowake_band')
    for k in range(9): S(M('clay_rust', 1), 0.07, (0.6 + k * 0.18, -0.6 - 0.05 * k, 0.05), name='chain')


# ======================================================================================================================
# 9. THE WASH: the Las Vegas Wash, the city's drain
# ======================================================================================================================
@prop('wash.culvert', 'THE CULVERT', 'blocking', 'HEIGHT', 'H', landmark=True,
      what='a twin box culvert under a road: its concrete headwall 10 m wide, two dark mouths 3 m wide you walk through, '
           'its wingwalls, the road slab on top; tags on the headwall, the drift of the last flood piled at the mouths', wrong='')
def wash_culvert():
    conc, dark, road = M('tape_grey', 3), M('cloth_black', 0), M('rubber', 2)
    B(conc, (10.0, 8.0, 3.2), (0, 4.0, 1.6), name='box')
    for x in (-1.8, 1.8):
        B(dark, (3.0, 0.1, 2.4), (x, -0.02, 1.2), name='mouth'); B(dark, (2.8, 7.6, 2.3), (x, 4.0, 1.2), name='barrel')
    B(conc, (0.6, 0.5, 2.4), (0, -0.2, 1.2), name='pier')
    B(conc, (11.0, 0.6, 0.9), (0, -0.1, 3.5), name='headwall_top')
    for s in (-1, 1): B(conc, (0.5, 4.5, 3.2), (s * 6.3, -1.8, 1.6), rot=(0, 0, math.radians(s * 30)), name='wingwall')
    B(road, (12.0, 8.4, 0.3), (0, 4.1, 3.35), name='road_slab'); B(M('clay_mustard', 3), (12.0, 0.15, 0.02), (0, 4.1, 3.52), name='centreline')
    for s in (-1, 1): B(conc, (12.0, 0.3, 0.8), (0, 4.1 + s * 4.0, 3.9), name='parapet')
    STAINS((0, -0.4, 2.5, 9.0, 1.5, '-y'), 6, 120, (('clay_teal', 2), ('clay_rust', 2), ('clay_mustard', 3), ('cloth_black', 1)), (0.3, 0.6))
    STAINS((0, -0.12, 0.5, 9.0, 0.8, '-y'), 6, 121, (('clay_bone', 1), ('rubber', 1)), (0.3, 0.6))
    for k in range(7): ROCK(M('clay_bone', 1 + k % 2), (-4 + k * 1.3, -1.3 - 0.3 * (k % 3), 0), (1.0, 0.7, 0.35), seed=125 + k, sub=1, sink=0.2, name='flood_drift')


@prop('wash.cart', 'A SHOPPING CART IN THE SILT', 'none', 'NONE', '.',
      what='a shopping cart (the kit\'s own, whole) on its side half sunk in the silt, the flood\'s drift caught in its wires', wrong='')
def wash_cart():
    d = MARK(); IMPORT('cart.glb'); MOVE(d, rot=(math.radians(-80), 0, math.radians(25))); GROUND(d, -0.25)
    ROCK(M('clay_bone', 2), (0.2, 0.2, 0), (1.8, 1.4, 0.3), seed=130, sub=2, sink=0.05, name='silt')
    for k in range(5): ROD(M('clay_mustard', 1), (-0.4 + k * 0.2, -0.3, 0.3), (0.0 + k * 0.25, 0.4, 0.5), 0.02, 4, name='drift_twig')


@prop('wash.sofa', 'A SOFA IN THE SILT', 'cover', 'LOW_COVER', '.',
      what='a three-seat sofa sunk to its seat in the silt, its cushions gone, a floor lamp standing beside it on its own',
      wrong='the floor lamp is lit, plugged into nothing')
def wash_sofa():
    fab, cush = M('clay_mustard', 1), M('clay_mustard', 2)
    B(fab, (2.2, 0.9, 0.45), (0, 0, 0.12), rot=(0, math.radians(3), 0), name='seat_base'); B(fab, (2.2, 0.28, 0.6), (0, 0.35, 0.5), rot=(math.radians(-8), 0, 0), name='back')
    for x in (-1.05, 1.05): B(fab, (0.25, 0.9, 0.5), (x, 0, 0.25), name='arm')
    B(cush, (0.7, 0.6, 0.15), (0.6, -0.1, 0.38), rot=(0, 0, math.radians(6)), name='cushion_left')
    ROCK(M('clay_bone', 2), (0, 0, 0), (3.0, 1.8, 0.4), seed=140, sub=2, sink=0.05, name='silt')
    C(M('rubber', 1), 0.16, 0.04, (1.7, -0.3, 0.02), v=12, name='lamp_base'); C(M('chrome', 0), 0.015, 1.55, (1.7, -0.3, 0.78), v=6, name='lamp_pole')
    C(M('clay_bone', 4), 0.22, 0.3, (1.7, -0.3, 1.6), v=14, r2=0.15, name='lamp_shade')
    S(M('sodium', 4, glow=6.0), 0.07, (1.7, -0.3, 1.52), name='bulb'); C(M('sodium', 3, glow=2.5), 0.215, 0.02, (1.7, -0.3, 1.46), v=14, name='shade_glow')


@prop('wash.jam', 'THE DEBRIS JAM', 'cover', 'LOW_COVER', 'r',
      what='what the last flood left against a boulder: a dead tamarisk trunk, tyres, a mattress, a door, plastic: low '
           'cover a man lies behind, rough ground to cross', wrong='')
def wash_jam():
    ROCK(M('metal_painted', 1), (0, 0.4, 0), (2.0, 1.6, 1.3), seed=150, sub=3, name='boulder')
    ROD(M('clay_bone', 1), (-3.0, -0.4, 0.3), (1.2, -0.2, 0.7), 0.22, 8, name='trunk')
    for a in (0.6, 1.2, -0.5): ROD(M('clay_bone', 1), (-2.0, -0.4, 0.4), (-2.0 + 1.4 * math.cos(a), -0.4 + 1.4 * math.sin(a), 0.6), 0.07, 5, name='limb')
    B(M('clay_bone', 3), (1.9, 1.3, 0.2), (-1.2, -1.1, 0.25), rot=(math.radians(-14), 0, math.radians(10)), name='mattress')
    B(M('tape_masking', 2), (0.85, 0.05, 2.0), (1.5, -0.6, 0.5), rot=(math.radians(-62), 0, math.radians(-20)), name='door')
    for k in range(3): C(M('rubber', 1), 0.36, 0.22, (-0.4 + k * 0.6, -0.9, 0.12 + 0.2 * k), (math.radians(60 + 20 * k), 0, k), 14, name='tyre')
    for k in range(6): B(M(*[('clay_teal', 3), ('tape_grey', 4), ('clay_rust', 2)][k % 3]), (0.4, 0.3, 0.05), (-2.4 + k * 0.7, 0.4 - 0.2 * (k % 2), 0.15), rot=(0.3, 0.2, k), name='plastic')


# ======================================================================================================================
# 10. THE SUBURBS: the foreclosure tracts, every backyard walled in block
# ======================================================================================================================
@prop('suburbs.pool', 'AN EMPTY POOL', 'none', 'NONE', 'r', landmark=True, hole=(4.5, 2.3),
      what='a kidney pool dug into its concrete deck, empty: faded plaster, the tile band, its ladder and diving board, the '
           'leaves and a chair at the deep end; a pit a man climbs down into. The board must cut its ground to the deck '
           '(hole_m in the manifest)', wrong='in the deep end, two fingers of perfectly clear water, and no rain in a year')
def suburbs_pool():
    deck, plaster, tile, coping = M('tape_grey', 3), M('clay_teal', 4), M('clay_teal', 2), M('clay_bone', 3)
    Lp, Wp = 9.0, 4.6
    def outline(t, n=36):
        pts = []
        for k in range(n):
            a = 2 * math.pi * k / n; r = 1.0 - 0.18 * math.cos(2 * a) * (1 if math.sin(a) > 0 else 0)
            pts.append((Lp / 2 * t * math.cos(a), Wp / 2 * t * r * math.sin(a)))
        return pts
    o = outline(1.0)
    ring = [(Lp / 2 + 1.6) * math.cos(2 * math.pi * k / 36) for k in range(36)]
    # the deck: a frame of slabs round the hole
    for k in range(36):
        a0, a1 = o[k], o[(k + 1) % 36]
        b0 = (a0[0] * 1.33, a0[1] * 1.6); b1 = (a1[0] * 1.33, a1[1] * 1.6)
        POLY(deck, [a0, a1, b1, b0], 0.1, 'xy', loc=(0, 0, -0.08), name='deck')
        POLY(coping, [a0, a1, (a1[0] * 1.04, a1[1] * 1.06), (a0[0] * 1.04, a0[1] * 1.06)], 0.06, 'xy', loc=(0, 0, 0.0), name='coping')
    # the shell: walls down from the rim, the floor sloping from 1.0 m at the shallow end to 2.4 m at the deep
    depth = lambda x: -1.0 - 1.4 * max(0.0, (x / (Lp / 2) + 0.2) / 1.2)
    V, Fc = [], []
    inner = outline(0.92)
    for k in range(36):
        (x0, y0), (xi, yi) = o[k], inner[k]
        V += [(x0, y0, 0.0), (x0, y0, -0.25), (xi, yi, depth(xi))]
    for k in range(36):
        a, b = 3 * k, 3 * ((k + 1) % 36)
        Fc += [[a, b, b + 1, a + 1], [a + 1, b + 1, b + 2, a + 2]]
    MESH(plaster, V, Fc, 'shell_wall')
    MESH(plaster, [(x, y, depth(x)) for (x, y) in inner], [list(range(36))], 'shell_floor')
    for k in range(36):
        a0, a1 = o[k], o[(k + 1) % 36]
        POLY(tile, [(a0[0], a0[1]), (a1[0], a1[1]), (a1[0] * 0.995, a1[1] * 0.995), (a0[0] * 0.995, a0[1] * 0.995)], 0.22, 'xy', loc=(0, 0, -0.24), name='tile_band')
    STAINS((1.0, 0, -2.0, 4.0, 2.4, 'z'), 9, 160, (('clay_mustard', 1), ('clay_rust', 1), ('rubber', 1)), (0.12, 0.35))
    B(M('glass_eye', 2), (1.4, 1.6, 0.04), (3.2, 0.1, depth(3.2) + 0.05), name='clear_water')
    for s in (-1, 1): ROD(M('chrome', 1), (-3.6, s * 0.3 - 0.9, 0.9), (-3.6, s * 0.3 - 1.2, -0.9), 0.025, 6, name='ladder_rail')
    for k in range(4): ROD(M('chrome', 1), (-3.6, -0.6 - 0.07 * k, 0.4 - 0.4 * k), (-3.6, -1.2 - 0.07 * k, 0.4 - 0.4 * k), 0.02, 5, name='ladder_step')
    B(M('tape_grey', 4), (2.6, 0.5, 0.06), (5.4, 0.0, 0.55), rot=(0, math.radians(-4), 0), name='diving_board'); B(deck, (0.5, 0.5, 0.5), (6.5, 0, 0.25), name='board_stand')
    B(M('clay_bone', 4), (0.5, 0.5, 0.4), (2.6, -0.7, depth(2.6) + 0.2), rot=(0.4, 0.2, 1.0), name='chair_down')


@prop('suburbs.yard_wall', 'A BACKYARD CORNER', 'cover', 'COVER', '.',
      what='the split-face block walls every Vegas backyard has, 1.8 m, two runs meeting at a corner with its pilaster, a '
           'wrought-iron side gate hanging open, a bin against it: walls you fight along and over', wrong='')
def suburbs_yard_wall():
    blk, cap, iron = M('clay_bone', 3), M('clay_bone', 2), M('cloth_black', 1)
    def run(x0, y0, x1, y1, gap=None):
        L = math.hypot(x1 - x0, y1 - y0); n = int(L / 0.4)
        ux, uy = (x1 - x0) / L, (y1 - y0) / L; ang = math.atan2(uy, ux)
        for c in range(9):
            off = 0.2 * (c % 2)
            for k in range(n + 1):
                t = k * 0.4 + off
                if t > L - 0.05: continue
                if gap and gap[0] < t < gap[1]: continue
                w = min(0.4, L - t)
                B(blk if (k + c) % 5 else M('clay_bone', 2), (w - 0.012, 0.2, 0.19), (x0 + ux * (t + w / 2), y0 + uy * (t + w / 2), 0.1 + c * 0.2), rot=(0, 0, ang), name='block')
        segs = [(0, L)] if not gap else [(0, gap[0]), (gap[1], L)]
        for a, b in segs:
            B(cap, (b - a, 0.26, 0.06), (x0 + ux * (a + b) / 2, y0 + uy * (a + b) / 2, 1.83), rot=(0, 0, ang), name='cap')
    run(-5.0, 0.0, 1.0, 0.0, gap=(2.0, 3.0)); run(1.0, 0.0, 1.0, 4.0)
    B(blk, (0.45, 0.45, 2.0), (1.0, 0.0, 1.0), name='pilaster')
    for x in (-3.05, -1.95): B(blk, (0.3, 0.3, 1.95), (x, 0, 0.98), name='gate_pier')
    d = MARK()
    for k in range(10): ROD(iron, (0.1 * k, 0, 0.1), (0.1 * k, 0, 1.6), 0.012, 4, name='picket')
    for z in (0.15, 1.55): ROD(iron, (0, 0, z), (0.9, 0, z), 0.018, 4, name='gate_rail')
    MOVE(d, loc=(-1.95, -0.05, 0), rot=(0, 0, math.radians(-120)))
    C(M('clay_teal', 2), 0.32, 1.05, (0.4, -0.5, 0.53), v=14, name='bin'); B(M('clay_teal', 1), (0.7, 0.7, 0.06), (0.4, -0.55, 1.08), rot=(0.3, 0, 0), name='bin_lid')
    STAINS((-2.0, -0.11, 1.0, 5.5, 1.4, '-y'), 6, 170, (('clay_bone', 0), ('clay_rust', 1), ('cloth_black', 1)), (0.12, 0.3))


@prop('suburbs.swing', 'A DEAD SWING SET', 'none', 'NONE', '.',
      what='a steel A-frame swing set 3.6 m wide, its slide gone to rust, two swings on their chains', wrong='one swing hangs straight; the other is stopped high in the air at the top of its arc, and stays there')
def suburbs_swing():
    tube, seat, slide = M('clay_teal', 2), M('rubber', 1), M('clay_rust', 2)
    for x in (-1.8, 1.8):
        ROD(tube, (x, -1.0, 0), (x, 0, 2.3), 0.04, 6, name='a_leg'); ROD(tube, (x, 1.0, 0), (x, 0, 2.3), 0.04, 6, name='a_leg')
    ROD(tube, (-1.9, 0, 2.3), (1.9, 0, 2.3), 0.05, 8, name='top_bar')
    for s in (-0.45, 0.45): ROD(M('chrome', 0), (-0.6 + s, 0, 2.3), (-0.6 + s, 0, 0.5), 0.01, 4, name='chain')
    B(seat, (0.5, 0.2, 0.04), (-0.6, 0, 0.48), name='seat')
    a = math.radians(70); p = (0.6, -1.8 * math.sin(a), 2.3 - 1.8 * math.cos(a))
    for s in (-0.25, 0.25): ROD(M('chrome', 0), (0.6 + s, 0, 2.3), (0.6 + s, p[1], p[2]), 0.01, 4, name='chain_up')
    B(seat, (0.5, 0.2, 0.04), p, rot=(-a, 0, 0), name='seat_up')
    BAR(slide, (1.8, 0.3, 1.5), (3.9, 0.3, 0.2), 0.5, 0.05, name='slide')
    for s in (-1, 1): BAR(slide, (1.8, 0.3 + s * 0.27, 1.65), (3.9, 0.3 + s * 0.27, 0.35), 0.03, 0.15, name='slide_lip')


@prop('suburbs.trampoline', 'A TRAMPOLINE FRAME', 'none', 'NONE', '.',
      what='a backyard trampoline\'s frame, 4.3 m across, its mat rotted out, its net poles leaning, its springs hanging', wrong='')
def suburbs_trampoline():
    steel = M('tape_grey', 2)
    bpy.ops.mesh.primitive_torus_add(major_radius=2.15, minor_radius=0.03, major_segments=36, minor_segments=6, location=(0, 0, 0.9))
    _take(bpy.context.active_object, 'ring', steel)
    for k in range(6):
        a = 2 * math.pi * k / 6
        ROD(steel, (2.15 * math.cos(a), 2.15 * math.sin(a), 0.9), (2.3 * math.cos(a), 2.3 * math.sin(a), 0.0), 0.025, 5, name='leg')
        lean = 0.25 if k == 2 else 0.0
        ROD(M('cloth_black', 1), (2.15 * math.cos(a), 2.15 * math.sin(a), 0.9), ((2.15 + lean) * math.cos(a), (2.15 + lean) * math.sin(a), 2.6), 0.02, 5, name='net_pole')
    B(M('cloth_black', 1), (1.6, 0.9, 0.02), (0.6, -0.5, 0.05), rot=(0, 0, 0.4), name='mat_rag')


# ======================================================================================================================
# 11. THE LANDFILL: Apex, where the valley's trash went and stopped being covered
# ======================================================================================================================
@prop('landfill.mound', 'A TRASH MOUND', 'blocking', 'MOUND', 'H', landmark=True,
      what='a mound of the valley\'s trash 12 m across and 4 m high, the cover soil eroded off it: bags, boxes, tyres, a fridge, '
           'a mattress, a shopping cart poking out of it: height you climb', wrong='')
def landfill_mound():
    import random
    rnd = random.Random(12)
    ROCK(M('tape_grey', 1), (0, 0, 0), (12.0, 10.0, 4.0), seed=600, sub=4, rough=0.16, sink=0.08, name='mound')
    bpy.context.view_layer.update(); mesh = OBJS[-1]
    tops = sorted(((v.co.x, v.co.y, v.co.z) for v in mesh.data.vertices if v.co.z > 0.2), key=lambda c: rnd.random())[:70]
    for i, (x, y, z) in enumerate(tops):
        k = i % 7
        if k in (0, 1): S(M('cloth_black', 1 + (i % 2)), 0.35, (x, y, z), (1.2, 1, 0.8), name='bag')
        elif k == 2: S(M('tape_grey', 4), 0.3, (x, y, z), (1.1, 1, 0.8), name='bag_white')
        elif k == 3: B(M('tape_masking', 2), (0.6, 0.5, 0.4), (x, y, z + 0.1), rot=(0.3, 0.2, i), name='box')
        elif k == 4: C(M('rubber', 1), 0.38, 0.25, (x, y, z + 0.1), (1.2, 0.3, i), 14, name='tyre')
        else: B(M(*[('clay_teal', 3), ('clay_rust', 2), ('clay_mustard', 3)][i % 3]), (0.4, 0.3, 0.05), (x, y, z + 0.03), rot=(0.4, 0.2, i), name='plastic')
    B(M('tape_grey', 4), (0.75, 0.7, 1.7), (-3.5, -2.6, 0.9), rot=(math.radians(-60), 0, 0.3), name='fridge')
    B(M('clay_bone', 3), (1.9, 1.4, 0.2), (2.8, -3.0, 1.1), rot=(math.radians(-25), 0, -0.4), name='mattress')


@prop('landfill.flare', 'THE METHANE FLARE', 'blocking', 'COVER', '#', burns=True,
      what='the landfill gas flare: a 9 m steel stack on its concrete pad, its wind shield at the top, the knockout drum and the '
           'header pipe feeding it, a fence round it; the ground round it burns', wrong='it is still burning: the flame up top, years after anyone paid for anything')
def landfill_flare():
    steel, conc = M('tape_grey', 3), M('tape_grey', 2)
    B(conc, (4.0, 4.0, 0.25), (0, 0, 0.125), name='pad')
    C(steel, 0.45, 8.5, (0, 0, 4.5), v=16, name='stack'); C(M('clay_rust', 2), 0.6, 1.2, (0, 0, 9.0), v=16, name='shield')
    for k in range(4):
        a = math.pi / 2 * k + 0.4
        ROD(M('tape_grey', 2), (1.8 * math.cos(a), 1.8 * math.sin(a), 0.25), (0.4 * math.cos(a), 0.4 * math.sin(a), 6.0), 0.04, 5, name='guy')
    C(M('sodium', 4, glow=8.0), 0.45, 1.2, (0, 0, 10.2), v=12, r2=0.05, name='flame'); C(M('sodium', 2, glow=5.0), 0.3, 1.6, (0.1, 0, 10.6), v=10, r2=0.02, name='flame_tip')
    C(steel, 0.6, 1.8, (-1.3, 0.9, 0.9), (0, 0, 0), 14, name='knockout_drum')
    ROD(M('tape_grey', 4), (-1.3, 0.9, 1.0), (-6.0, 0.9, 0.35), 0.15, 10, name='header'); ROD(M('tape_grey', 4), (-1.3, 0.9, 1.6), (-0.3, 0.3, 1.6), 0.12, 8, name='feed')
    for x in (-2.2, 2.2):
        for y in (-2.2, 2.2): C(M('tape_grey', 2), 0.04, 1.8, (x, y, 0.9), v=6, name='fence_post')
    CHAIN(M('tape_grey', 3), (-2.2, -2.2), (2.2, -2.2), 0.05, 1.8); CHAIN(M('tape_grey', 3), (2.2, -2.2), (2.2, 2.2), 0.05, 1.8)
    B(M('cloth_black', 0), (2.6, 2.2, 0.02), (1.2, -0.6, 0.26), name='scorch')


@prop('landfill.dozer', 'THE DEAD DOZER', 'cover', 'COVER', '#',
      what='a bulldozer (the kit\'s own, whole) stopped mid-push, its blade full of the trash it was moving, a windrow of it '
           'beside the track it left', wrong='')
def landfill_dozer():
    IMPORT('dozer.glb')
    import random
    rnd = random.Random(3)
    for i in range(16):
        x, y = rnd.uniform(-4.4, -3.4), rnd.uniform(-1.6, 1.6)
        S(M(*[('cloth_black', 1), ('tape_grey', 4), ('clay_teal', 3)][i % 3]), 0.3, (x, y, rnd.uniform(0.2, 1.2)), (1.2, 1, 0.8), name='blade_load')
    ROCK(M('tape_grey', 1), (-4.0, 0, 0), (1.6, 3.6, 1.0), seed=610, sub=2, name='windrow')
    for k in range(10): B(M('rubber', 1), (0.25, 0.6, 0.03), (3.4 + k * 0.5, -1.4, 0.015), name='track_mark'); B(M('rubber', 1), (0.25, 0.6, 0.03), (3.4 + k * 0.5, 1.2, 0.015), name='track_mark')


@prop('landfill.wells', 'THE GAS HEADER', 'cover', 'LOW_COVER', '.',
      what='the landfill gas wells: white pipe wellheads standing out of the cover with their valves, a 0.6 m header pipe '
           'running 12 m along the ground on its saddles between them: a low wall of pipe', wrong='')
def landfill_wells():
    pvc = M('tape_grey', 4)
    ROD(pvc, (-6.0, 0, 0.42), (6.0, 0, 0.42), 0.3, 14, name='header')
    for x in (-5, -2, 1, 4): B(M('tape_grey', 2), (0.3, 0.7, 0.15), (x, 0, 0.07), name='saddle')
    for k, x in enumerate((-4.0, 0.0, 4.0)):
        C(pvc, 0.12, 1.3, (x, -1.6, 0.65), v=10, name='wellhead'); C(M('clay_mustard', 3), 0.1, 0.12, (x, -1.6, 1.0), (math.pi / 2, 0, 0), 8, name='valve')
        ROD(pvc, (x, -1.6, 1.2), (x, -0.25, 0.6), 0.06, 8, name='lateral')
        C(M('clay_rust', 2), 0.25, 0.1, (x, -1.6, 0.05), v=10, name='bentonite')


# ======================================================================================================================
# 12. THE STRIP: the Boulevard's plazas, dry
# ======================================================================================================================
@prop('strip.fountain', 'THE DRY FOUNTAIN', 'cover', 'LOW_COVER', '.', landmark=True,
      what='a casino plaza fountain 12 m across, dry: its marble rim knee high all round (cover), its three-tier centre, '
           'the stained floor, the coins still in it', wrong='')
def strip_fountain():
    marble, dark, gold = M('tape_grey', 4), M('tape_grey', 2), M('clay_mustard', 3)
    for k in range(40):
        a0, a1 = 2 * math.pi * k / 40, 2 * math.pi * (k + 1) / 40
        POLY(marble, [(6.0 * math.cos(a0), 6.0 * math.sin(a0)), (6.0 * math.cos(a1), 6.0 * math.sin(a1)), (5.5 * math.cos(a1), 5.5 * math.sin(a1)), (5.5 * math.cos(a0), 5.5 * math.sin(a0))],
             0.65, 'xy', name='rim')
    C(M('clay_teal', 1), 5.55, 0.08, (0, 0, 0.04), v=40, name='floor')
    STAINS((0, 0, 0.09, 9.0, 9.0, 'z'), 16, 180, (('clay_teal', 0), ('clay_bone', 1), ('rubber', 1)), (0.3, 0.9))
    for (r, h, z) in ((1.4, 1.2, 0.6), (0.5, 1.6, 2.0), (2.4, 0.25, 1.3), (1.4, 0.2, 2.9), (0.3, 1.0, 3.5), (0.7, 0.15, 4.1)):
        C(marble if r > 0.6 else dark, r, h, (0, 0, z), v=24, name='tier')
    S(marble, 0.35, (0, 0, 4.4), name='finial')
    import random
    rnd = random.Random(5)
    for k in range(60):
        a, r = rnd.uniform(0, 6.28), rnd.uniform(2.6, 5.3)
        C(gold, 0.05, 0.01, (r * math.cos(a), r * math.sin(a), 0.09), v=6, name='coin')


@prop('strip.sign', 'A FALLEN CASINO SIGN', 'cover', 'COVER', '#',
      what='a 12 m arrow sign down on the plaza off its snapped pylon, tilted on its edge, its rows of bulbs, its letters\' '
           'ghosts', wrong='one bulb, out of the hundred, is still lit')
def strip_sign():
    face, edge, bulb = M('clay_rust', 2), M('clay_mustard', 3), M('tape_grey', 4)
    d = MARK()
    pts = [(-6, -0.9), (3.5, -0.9), (3.5, -1.8), (6.2, 0.0), (3.5, 1.8), (3.5, 0.9), (-6, 0.9)]
    POLY(face, pts, 0.6, 'xy', name='arrow')
    POLY(edge, [(x * 1.02, y * 1.08) for x, y in pts], 0.5, 'xy', loc=(0, 0, 0.05), name='arrow_edge')
    n = 0
    for k in range(34):
        x = -5.7 + k * 0.28
        for y in (-0.7, 0.7):
            lit = (k == 21 and y < 0)
            S(M('sodium', 4, glow=7.0) if lit else bulb, 0.07, (x, y, 0.62), name='bulb_lit' if lit else 'bulb'); n += 1
    for k, x in enumerate((-4.5, -2.8, -1.1, 0.6)): B(M('clay_rust', 0), (1.2, 0.9, 0.04), (x, 0, 0.61), name='letter_ghost')
    MOVE(d, rot=(math.radians(62), 0, math.radians(-8))); GROUND(d)
    C(M('tape_grey', 2), 0.45, 2.2, (6.8, 2.5, 1.1), v=16, name='pylon_stub'); B(M('clay_rust', 1), (0.7, 0.6, 0.3), (6.8, 2.5, 2.3), rot=(0.3, 0.2, 0), name='pylon_torn')


@prop('strip.bridge', 'THE BRIDGE SPAN', 'none', 'HEIGHT', 'H',
      what='a span of the Boulevard\'s pedestrian bridge, 14 m on two pylons, its deck 6 m up, its glass sides broken out, '
           'the escalator at one end stopped: you walk under it, you climb it by the escalator', wrong='')
def strip_bridge():
    conc, glass, steel = M('clay_bone', 3), M('glass_eye', 1), M('tape_grey', 3)
    Z = 6.0
    for x in (-5.0, 5.0): C(conc, 0.7, Z, (x, 0, Z / 2), v=16, name='pylon')
    B(conc, (14.0, 4.0, 0.7), (0, 0, Z + 0.35), name='deck')
    for s in (-1, 1):
        for k in range(10):
            x = -6.3 + k * 1.4
            ROD(steel, (x, s * 1.9, Z + 0.7), (x, s * 1.9, Z + 2.4), 0.04, 5, name='mullion')
            if k % 3 != 1: B(glass, (1.35, 0.03, 1.6), (x + 0.7, s * 1.9, Z + 1.55), name='pane')
        ROD(steel, (-7, s * 1.9, Z + 2.4), (7, s * 1.9, Z + 2.4), 0.06, 6, name='top_rail')
    B(M('metal_painted', 2), (14.0, 4.2, 0.12), (0, 0, Z + 2.5), name='canopy_frame')
    STAINS((0, 0, Z + 2.57, 13.0, 3.6, 'z'), 10, 190)
    BAR(steel, (7.0, 0, Z + 0.3), (14.5, 0, 0.0), 1.4, 0.5, name='escalator_truss')
    for s in (-1, 1): BAR(M('cloth_black', 1), (7.0, s * 0.72, Z + 1.3), (14.5, s * 0.72, 1.0), 0.08, 0.9, name='escalator_side')
    n = 22
    for k in range(n):
        t = (k + 0.5) / n
        B(M('tape_grey', 2), (0.38, 1.0, 0.06), (7.0 + 7.5 * t, 0, Z + 0.35 - (Z + 0.35) * t + 0.3), name='step')


@prop('strip.limo', 'A STRETCH LIMO', 'cover', 'COVER', '#',
      what='a white stretch limousine, 9 m, dead at the valet line, its tyres flat, its dark windows, a door open', wrong='')
def strip_limo():
    body, glass = M('tape_grey', 4), M('cloth_black', 1)
    LOFT(body, [(-4.6, 0.6, 0.25, 0.6), (-4.4, 0.92, 0.35, 0.65), (-3.4, 0.95, 0.4, 0.7), (3.6, 0.95, 0.42, 0.72), (4.5, 0.9, 0.38, 0.7), (4.65, 0.6, 0.25, 0.68)], n=16, p=4.0, name='body')
    B(body, (6.2, 1.75, 0.5), (0.4, 0, 1.25), name='greenhouse'); B(glass, (6.0, 1.78, 0.32), (0.4, 0, 1.28), name='dark_glass')
    B(body, (5.8, 1.6, 0.06), (0.4, 0, 1.52), name='roof')
    STAINS((0.4, 0, 1.56, 5.6, 1.4, 'z'), 6, 195, (('clay_bone', 1), ('rubber', 1)), (0.15, 0.35))
    for (x, s) in ((-3.3, -1), (-3.3, 1), (3.2, -1), (3.2, 1)): WHEEL(0.34, 0.24, (x, s * 0.82, 0.28), name='wheel')
    B(body, (1.0, 0.06, 0.9), (0.6, -1.3, 0.85), rot=(0, 0, math.radians(-55)), name='door_open')
    B(M('chrome', 1), (0.1, 1.6, 0.35), (-4.65, 0, 0.6), name='grille')


# ======================================================================================================================
# 13. DOWNTOWN: Fremont, under the canopy, and its alleys
# ======================================================================================================================
@prop('downtown.canopy', 'A BAY OF THE CANOPY', 'cover', 'COVER', '.', landmark=True,
      what='one bay of the Fremont canopy over the street: two steel columns 13 m apart, the curved lattice rib between them, '
           'a 3 m band of its screen panels underneath (the board repeats the bay down the street); under it no shot comes '
           'from a roof', wrong='one panel of the dead screen is still showing a picture, a few squares of colour, the same ones, all night')
def downtown_canopy():
    steel, panel = M('tape_grey', 2), M('rubber', 2)
    Hc, R = 11.0, 6.5
    for x in (-R, R):
        C(steel, 0.55, Hc, (x, 0, Hc / 2), v=14, name='column'); C(M('tape_grey', 3), 0.75, 0.5, (x, 0, 0.25), v=14, name='column_base')
    pts = [(R * math.cos(math.pi * k / 16), Hc + 2.6 * math.sin(math.pi * k / 16)) for k in range(17)]
    for y in (-1.5, 1.5):
        for a, b in zip(pts, pts[1:]): ROD(steel, (a[0], y, a[1]), (b[0], y, b[1]), 0.08, 6, name='chord')
        inner = [(x * 0.9, z - 0.8) for x, z in pts]
        for a, b in zip(inner, inner[1:]): ROD(steel, (a[0], y, a[1]), (b[0], y, b[1]), 0.06, 5, name='chord_in')
        for k in range(16): ROD(steel, (pts[k][0], y, pts[k][1]), (inner[k + 1][0], y, inner[k + 1][1]), 0.04, 4, name='web')
    for k in range(17): ROD(steel, (pts[k][0], -1.5, pts[k][1]), (pts[k][0], 1.5, pts[k][1]), 0.04, 4, name='purlin')
    for k in range(16):
        a, b = pts[k], pts[k + 1]
        lit = k in (9, 10)
        B(M('clay_teal', 3, glow=2.0) if (lit and k == 9) else (M('sodium', 3, glow=2.0) if lit else panel), (math.hypot(b[0] - a[0], b[1] - a[1]), 3.0, 0.1),
          ((a[0] + b[0]) / 2 * 0.95, 0, (a[1] + b[1]) / 2 - 0.9), rot=(0, -math.atan2(b[1] - a[1], b[0] - a[0]), 0), name='screen_lit' if lit else 'screen')


@prop('downtown.dumpsters', 'ALLEY DUMPSTERS', 'cover', 'COVER', '.',
      what='two dumpsters (the kit\'s own, whole) in the alley, one tipped on its side and spilled, the bags piled round them', wrong='')
def downtown_dumpsters():
    IMPORT('dumpster.glb', loc=(-1.3, 0, 0))
    d = MARK(); IMPORT('dumpster.glb'); MOVE(d, loc=(1.6, 0.3, 0), rot=(math.radians(-90), 0, math.radians(14))); GROUND(d)
    import random
    rnd = random.Random(8)
    for i in range(14): S(M(*[('cloth_black', 1), ('cloth_black', 2), ('tape_grey', 4)][i % 3]), 0.3, (rnd.uniform(0.2, 3.6), rnd.uniform(-1.8, -0.6), 0.2), (1.2, 1, 0.75), name='bag')


@prop('downtown.fire_escape', 'AN ALLEY WALL AND ITS FIRE ESCAPE', 'blocking', 'HEIGHT', 'H',
      what='the brick back of a three-storey downtown hotel, 10 m of it, its fire escape zigzagging up to the roof, a steel '
           'back door, window units, a drop ladder hanging: the way up to a roof', wrong='')
def downtown_fire_escape():
    brick, iron, dark = M('clay_rust', 1), M('cloth_black', 1), M('cloth_black', 0)
    B(brick, (10.0, 1.0, 9.6), (0, 0.5, 4.8), name='wall')
    for z in range(1, 32): B(M('clay_rust', 0), (10.0, 0.02, 0.02), (0, -0.01, z * 0.3), name='course')
    for x in (-3.4, 0.0, 3.4):
        for z in (3.7, 6.7):
            B(dark, (1.1, 0.05, 1.5), (x, -0.02, z), name='window'); B(M('tape_grey', 3), (1.3, 0.05, 0.12), (x, -0.03, z - 0.82), name='sill')
    B(M('metal_painted', 3), (0.7, 0.5, 0.45), (3.4, -0.3, 3.2), name='ac_unit')
    B(M('tape_grey', 2), (1.0, 0.06, 2.2), (-3.4, -0.03, 1.1), name='back_door')
    B(M('tape_grey', 3), (10.2, 1.2, 0.4), (0, 0.5, 9.8), name='parapet')
    for (z, x0) in ((3.0, -4.5), (6.0, -4.5), (9.0, -4.5)):
        B(iron, (5.0, 1.1, 0.06), (x0 + 2.5 + 2.0, -0.6, z), name='landing')
        ROD(iron, (x0 + 2.0, -1.15, z + 1.0), (x0 + 7.0, -1.15, z + 1.0), 0.02, 4, name='landing_rail')
        for xx in (x0 + 2.0, x0 + 7.0): ROD(iron, (xx, -1.15, z), (xx, -1.15, z + 1.0), 0.02, 4)
    for (z0, z1) in ((3.0, 6.0), (6.0, 9.0)):
        BAR(iron, (-2.0, -0.6, z0), (1.8, -0.6, z1), 0.8, 0.1, name='stair')
    ROD(iron, (2.3, -1.2, 3.0), (2.3, -1.2, 0.9), 0.03, 4, name='drop_ladder'); ROD(iron, (2.8, -1.2, 3.0), (2.8, -1.2, 0.9), 0.03, 4)
    for k in range(7): ROD(iron, (2.3, -1.2, 1.0 + k * 0.3), (2.8, -1.2, 1.0 + k * 0.3), 0.015, 4)
    STAINS((0, -0.02, 4.8, 9.6, 8.6, '-y'), 12, 210, (('cloth_black', 1), ('clay_rust', 0), ('clay_bone', 1)), (0.2, 0.6))


@prop('downtown.deuce', 'THE DEUCE, BURNT', 'blocking', 'COVER', '#',
      what='a double-decker Strip-and-downtown bus burnt out where it stopped: 13 m long, 4.4 m high, its shell black, '
           'both decks\' windows empty, its tyres gone to the rims', wrong='')
def downtown_deuce():
    shell, char, rim = M('cloth_black', 2), M('cloth_black', 0), M('tape_grey', 1)
    B(shell, (13.0, 2.6, 3.9), (0, 0, 2.35), name='body')
    B(M('clay_mustard', 1), (13.0, 2.62, 0.5), (0, 0, 0.7), name='skirt_band')
    for deck_z in (1.9, 3.5):
        for k in range(10):
            B(char, (1.05, 2.64, 0.8), (-5.6 + k * 1.24, 0, deck_z), name='window_hole')
    B(M('clay_rust', 1), (13.0, 2.4, 0.08), (0, 0, 4.33), name='roof_burnt')
    STAINS((0, 0, 4.38, 12.0, 2.0, 'z'), 10, 220, (('clay_rust', 0), ('tape_grey', 1), ('cloth_black', 1)), (0.3, 0.7))
    STAINS((0, -1.3, 1.0, 12.0, 0.6, '-y'), 6, 221, (('clay_rust', 1), ('tape_grey', 2)), (0.15, 0.35))
    for (x, s) in ((-4.5, -1), (-4.5, 1), (4.0, -1), (4.0, 1)): C(rim, 0.38, 0.25, (x, s * 1.15, 0.38), (math.pi / 2, 0, 0), 12, name='rim')
    MOVE(0, loc=(0, 0, -0.05))


# ======================================================================================================================
# 14. THE WORKS: the rail yards and shops off Industrial Road
# ======================================================================================================================
def track(L):
    for k in range(int(L / 0.6)): B(M('rubber', 3), (0.25, 2.6, 0.15), (-L / 2 + 0.3 + k * 0.6, 0, 0.075), name='tie')
    for y in (-0.72, 0.72): B(M('chrome', 0), (L, 0.07, 0.15), (0, y, 0.22), name='rail')


@prop('works.boxcar', 'A BOXCAR', 'blocking', 'COVER', '#', landmark=True,
      what='a 50 foot boxcar on its trucks on a short run of track, its door slid open on the dark inside, rust down its sides, '
           'the ladder at its end to its roof', wrong='')
def works_boxcar():
    body, rust = M('clay_rust', 2), M('clay_rust', 1)
    track(18.0)
    for x in (-6.0, 6.0):
        B(M('rubber', 1), (2.6, 2.0, 0.6), (x, 0, 0.75), name='truck_frame')
        for xx in (x - 0.85, x + 0.85):
            for s in (-1, 1): C(M('rubber', 1), 0.42, 0.15, (xx, s * 0.72, 0.6), (math.pi / 2, 0, 0), 12, name='wheel')
    B(body, (15.5, 3.2, 3.6), (0, 0, 2.95), name='box')
    for k in range(18): B(rust, (0.08, 3.24, 3.5), (-7.4 + k * 0.87, 0, 2.95), name='post')
    B(M('cloth_black', 0), (3.0, 0.05, 3.0), (0.0, -1.62, 2.7), name='door_dark'); B(body, (3.1, 0.12, 3.1), (3.2, -1.7, 2.75), name='door_slid')
    B(M('clay_rust', 3), (15.5, 3.0, 0.12), (0, 0, 4.8), name='roof')
    STAINS((0, -1.62, 3.4, 14.0, 2.0, '-y'), 12, 230, (('clay_rust', 0), ('clay_rust', 3), ('tape_grey', 4)), (0.2, 0.6))
    for k in range(10): ROD(M('rubber', 1), (7.85, -1.4 + 0.0, 1.3 + k * 0.35), (7.85, -0.9, 1.3 + k * 0.35), 0.02, 4, name='ladder_rung')


@prop('works.tankcar', 'A TANK CAR', 'blocking', 'COVER', '#', burns=True,
      what='a black tank car on its trucks, its dome and walkway, a hazmat placard; it burns if it is hit', wrong='')
def works_tankcar():
    track(18.0)
    for x in (-6.0, 6.0):
        B(M('rubber', 1), (2.6, 2.0, 0.6), (x, 0, 0.75), name='truck_frame')
        for xx in (x - 0.85, x + 0.85):
            for s in (-1, 1): C(M('rubber', 1), 0.42, 0.15, (xx, s * 0.72, 0.6), (math.pi / 2, 0, 0), 12, name='wheel')
    B(M('rubber', 1), (15.0, 1.0, 0.3), (0, 0, 1.15), name='sill')
    LOFT(M('rubber', 2), [(-7.6, 0.4, 0.4, 2.6), (-7.3, 1.45, 1.45, 2.6), (7.3, 1.45, 1.45, 2.6), (7.6, 0.4, 0.4, 2.6)], n=20, name='tank')
    C(M('rubber', 2), 0.5, 0.5, (0, 0, 4.15), v=14, name='dome'); B(M('tape_grey', 2), (2.2, 2.0, 0.06), (0, 0, 4.05), name='walkway')
    B(M('tape_grey', 4), (0.6, 0.04, 0.6), (5.0, -1.47, 2.6), rot=(0, math.radians(45), 0), name='placard')
    STAINS((0, -1.45, 2.4, 13.0, 1.4, '-y'), 8, 240, (('tape_grey', 2), ('clay_rust', 1)), (0.2, 0.5))


@prop('works.gantry', 'THE GANTRY CRANE, A CAR ON ITS HOOK', 'cover', 'COVER', '.',
      what='a yard gantry crane: two A-frame legs 8 m tall on rail wheels, the beam 14 m across them, the trolley and its '
           'hook; you fight between its legs', wrong='a car (the kit\'s own wreck) hangs from the hook over your head, and nobody is at the controls')
def works_gantry():
    steel, yellow = M('tape_grey', 2), M('clay_mustard', 3)
    for x in (-7.0, 7.0):
        for s in (-1, 1): BAR(yellow, (x, s * 2.2, 0.6), (x, 0, 8.0), 0.35, 0.35, name='leg')
        B(yellow, (0.6, 5.0, 0.6), (x, 0, 0.3), name='sill')
        for s in (-1, 1): C(M('rubber', 1), 0.3, 0.3, (x, s * 2.0, 0.3), (0, math.pi / 2, 0), 12, name='wheel')
    B(yellow, (15.0, 1.0, 1.2), (0, 0, 8.5), name='beam')
    STAINS((0, 0, 9.1, 14.0, 0.8, 'z'), 6, 250, (('clay_rust', 1), ('rubber', 1)), (0.15, 0.3))
    B(steel, (1.6, 1.5, 1.0), (1.5, 0, 7.7), name='trolley')
    for y in (-0.15, 0.15): ROD(M('chrome', 0), (1.5, y, 7.2), (1.5, y, 5.6), 0.02, 4, name='cable')
    B(M('rubber', 1), (0.4, 0.3, 0.5), (1.5, 0, 5.4), name='hook_block')
    for y in (-0.7, 0.7): ROD(M('chrome', 0), (1.5, 0, 5.2), (1.5 + (y * 2.0), y, 4.25), 0.015, 4, name='sling')
    d = MARK(); IMPORT('wreck.glb'); MOVE(d, loc=(1.5, 0, 2.85), rot=(0, math.radians(4), math.radians(25)))


@prop('works.machines', 'THE MACHINES', 'cover', 'COVER', '#',
      what='a shop\'s machines dragged out onto the slab: a 4 m hydraulic press, a lathe on its bed, an air compressor, a '
           'crate; cover between them', wrong='')
def works_machines():
    green, grey, dark = M('metal_painted', 2), M('tape_grey', 2), M('rubber', 1)
    for s in (-1, 1): B(green, (0.6, 1.2, 4.0), (s * 1.0 - 3.0, 0, 2.0), name='press_side')
    B(green, (2.6, 1.3, 0.9), (-3.0, 0, 3.7), name='press_crown'); B(green, (2.6, 1.3, 0.8), (-3.0, 0, 0.4), name='press_bed')
    C(M('chrome', 1), 0.3, 1.2, (-3.0, 0, 2.7), v=12, name='ram'); B(grey, (1.4, 1.0, 0.25), (-3.0, 0, 1.95), name='platen')
    B(green, (3.8, 0.8, 0.9), (1.3, 0, 0.45), name='lathe_bed'); B(green, (0.8, 0.8, 0.7), (-0.2, 0, 1.25), name='headstock')
    B(grey, (0.5, 0.6, 0.5), (2.6, 0, 1.15), name='tailstock'); C(M('chrome', 1), 0.08, 2.2, (1.1, 0, 1.25), (0, math.pi / 2, 0), 8, name='work')
    C(M('clay_rust', 2), 0.35, 1.4, (3.6, 1.5, 0.5), (0, math.pi / 2, 0), 14, name='compressor_tank'); B(dark, (0.5, 0.5, 0.4), (3.6, 1.5, 1.1), name='compressor_motor')
    B(M('tape_masking', 2), (1.4, 1.1, 1.0), (4.0, -0.8, 0.5), rot=(0, 0, 0.2), name='crate')
    STAINS((-1.0, 0, 0.02, 9.0, 3.0, 'z'), 6, 260, (('rubber', 0), ('cloth_black', 1)), (0.3, 0.7))


@prop('works.pipes', 'A STACK OF PIPE', 'cover', 'COVER', '.',
      what='steel pipe 0.9 m across stacked three high on timber chocks, 9 m long: a wall of cover, and a man can stand in '
           'its ends', wrong='')
def works_pipes():
    for row, (n, z) in enumerate(((4, 0.0), (3, 0.78), (2, 1.56))):
        for k in range(n):
            y = (k - (n - 1) / 2) * 0.92
            C(M('clay_rust', 2 if (k + row) % 2 else 1), 0.45, 9.0, (0, y, 0.47 + z), (0, math.pi / 2, 0), 18, name='pipe')
            C(M('cloth_black', 0), 0.4, 9.02, (0, y, 0.47 + z), (0, math.pi / 2, 0), 14, name='bore')
    for x in (-3.5, 0.0, 3.5): B(M('tape_masking', 1), (0.25, 4.0, 0.15), (x, 0, 0.075), name='chock')


# ======================================================================================================================
# 15. THE MARINA: Las Vegas Bay and Callville, closed when the lake left
# ======================================================================================================================
@prop('marina.houseboat', 'A HOUSEBOAT ON THE DRY BED', 'blocking', 'HEIGHT', 'H', landmark=True,
      what='a Lake Mead houseboat, 18 m, sat down on the cracked bed on its pontoons, listing: its cabin, its windows, the top '
           'deck with its rail and its water slide, the ladder up: a roof you take', wrong='a fresh towel lies at the foot of the slide, where you would land in the water')
def marina_houseboat():
    hullm, cabin, trim, glass = M('tape_grey', 3), M('tape_grey', 4), M('clay_teal', 2), M('glass_eye', 0)
    d = MARK()
    for y in (-1.9, 1.9):
        LOFT(hullm, [(-9.0, 0.2, 0.2, 0.55), (-8.4, 0.75, 0.55, 0.6), (8.8, 0.75, 0.55, 0.6), (9.0, 0.6, 0.5, 0.6)], n=14, name='pontoon')
        OBJS[-1].location = (0, y, 0)
    B(M('tape_grey', 2), (18.0, 5.0, 0.25), (0, 0, 1.25), name='deck')
    B(cabin, (13.0, 4.6, 2.5), (0.5, 0, 2.6), name='cabin')
    B(trim, (13.05, 4.65, 0.25), (0.5, 0, 1.55), name='cabin_band')
    for s in (-1, 1):
        for k in range(6): B(glass, (1.4, 0.05, 1.0), (-4.5 + k * 2.0, s * 2.31, 2.9), name='window')
    B(glass, (0.05, 3.6, 1.2), (-6.02, 0, 2.9), name='front_glass')
    B(M('tape_grey', 2), (14.0, 5.0, 0.12), (0.5, 0, 3.9), name='top_deck')
    for s in (-1, 1): ROD(M('chrome', 1), (-6.4, s * 2.45, 4.9), (7.4, s * 2.45, 4.9), 0.03, 5, name='rail')
    for k in range(8):
        for s in (-1, 1): ROD(M('chrome', 1), (-6.4 + k * 1.97, s * 2.45, 3.96), (-6.4 + k * 1.97, s * 2.45, 4.9), 0.025, 4)
    B(M('clay_mustard', 3), (2.4, 2.4, 0.05), (2.0, 0.6, 5.4), rot=(0, math.radians(3), 0), name='sun_canopy')
    for x in (0.9, 3.1):
        for y in (-0.5, 1.7): ROD(M('chrome', 1), (x, y, 3.96), (x, y, 5.4), 0.02, 4)
    # the slide, off the stern's top deck down past the pontoons to where the water was
    for k in range(10):
        t = k / 9
        B(M('clay_teal', 3), (1.1, 0.75, 0.08), (7.5 + 4.2 * t, -1.2, 3.95 - 3.4 * t ** 1.4), rot=(0, math.radians(30 * (1 - t) + 10), 0), name='slide')
    B(M('clay_mustard', 4), (0.9, 0.5, 0.03), (12.2, -1.2, 0.03), rot=(0, 0, 0.3), name='towel')
    for k in range(9): ROD(M('chrome', 1), (6.5, 2.0, 1.4 + k * 0.28), (6.5, 2.5, 1.4 + k * 0.28), 0.015, 4, name='ladder_rung')
    STAINS((0.5, 0, 4.0, 13.0, 4.4, 'z'), 10, 280, (('clay_bone', 0), ('clay_rust', 1), ('rubber', 1)), (0.2, 0.6))
    MOVE(d, rot=(math.radians(4), math.radians(-2), 0)); GROUND(d, -0.15)


@prop('marina.cruiser', 'A CRUISER ON ITS KEEL', 'cover', 'COVER', '#',
      what='an 11 m cabin cruiser sat on its keel in the mud, heeled over 14 degrees, its flybridge and its cabin windows',
      wrong='')
def marina_cruiser():
    d = MARK(); hull(11.0, 3.6, 1.8, vee=0.85, cabin=True)
    B(M('tape_grey', 4), (2.4, 2.6, 0.8), (-0.6, 0, 3.5), name='flybridge'); B(M('glass_eye', 0), (0.05, 2.2, 0.5), (-1.85, 0, 3.6), rot=(0, math.radians(-25), 0), name='fly_screen')
    MOVE(d, rot=(math.radians(14), 0, 0)); GROUND(d, -0.35)
    ROCK(M('rubber', 2), (0, 0.6, 0), (10.0, 2.4, 0.35), seed=700, sub=2, sink=0.1, name='mud_berm')


@prop('marina.bass_boat', 'A BASS BOAT ON ITS TRAILER', 'cover', 'LOW_COVER', '.',
      what='a 6 m bass boat still strapped on its rusted trailer, both trailer tyres flat and sunk in the mud, its tongue down', wrong='')
def marina_bass_boat():
    d = MARK(); hull(6.0, 2.3, 0.9, vee=0.45, cabin=False)
    for o in OBJS[d:]: o.location.z += 0.55
    for y in (-0.7, 0.7): BAR(M('clay_rust', 1), (-3.2, y, 0.45), (3.0, y, 0.45), 0.12, 0.15, name='trailer_rail')
    BAR(M('clay_rust', 1), (-3.2, -0.7, 0.45), (-4.6, 0, 0.05), 0.1); BAR(M('clay_rust', 1), (-3.2, 0.7, 0.45), (-4.6, 0, 0.05), 0.1)
    for s in (-1, 1): C(M('rubber', 1), 0.33, 0.2, (0.8, s * 1.15, 0.22), (math.pi / 2, 0, 0), 12, name='flat_tyre')
    ROCK(M('rubber', 2), (0.8, 0, 0), (1.2, 3.0, 0.25), seed=710, sub=2, sink=0.1, name='mud')


# ======================================================================================================================
# THE CARDS: the place's own ground (COMBAT MAPS 2's materials, the floor tool's build), the things laid on it
# ======================================================================================================================
def ground_plan(place, H2, W2, ID):
    """a ground id per pixel of the card's patch, from the place's own grounds"""
    yy, xx = np.mgrid[0:H2, 0:W2]; xm = (xx + 0.5) / PPM; ym = CARD_SIDE * (1 - (yy + 0.5) / H2)
    rng = np.random.RandomState(sum(map(ord, place)))
    n = np.zeros((H2, W2), np.float32)
    for f, w in ((0.08, 1.0), (0.21, 0.5), (0.5, 0.25)):
        ph = rng.uniform(0, 6.3, 4)
        n += w * (np.sin(xm * f * 6.28 + ph[0]) * np.cos(ym * f * 5.1 + ph[1]) + np.sin((xm + ym) * f * 3.7 + ph[2]))
    g = np.zeros((H2, W2), np.uint8)
    if place == 'lab':
        g[:] = ID['epoxy']
        band = (np.abs(ym - 13.2) < 0.35) | (np.abs(xm - 3.0) < 0.3)
        g[band & (((xm + ym) * 2.2).astype(int) % 2 == 0)] = ID['hazard']
    elif place == 'airport':
        g[:] = ID['apronslab']
        for cx in (6.0, 16.0, 26.0):
            for cy in (4.0, 20.0):
                g[(xm - cx) ** 2 + (ym - cy) ** 2 < 0.12] = ID['tiedown']
        g[(np.abs(ym - 12.5) < 0.12) & (xm > 2) & ((xm * 1.2).astype(int) % 2 == 0)] = ID['hazard']
    elif place == 'golf':
        g[:] = ID['fairway']; g[((xm + 0.4 * ym) / 3.2).astype(int) % 2 == 1] = ID['fairway_b']
        g[(((xm - 26.0) / 4.2) ** 2 + ((ym - 4.0) / 2.6) ** 2 + 0.15 * n) < 1.0] = ID['bunker']
        g[(np.abs(ym - 10.0 - 1.5 * np.sin(xm / 5.0)) < 0.9) & (xm < 20)] = ID['concrete']
    elif place == 'trailer':
        g[:] = ID['caliche']
        for (x0, y0, x1, y1) in ((1, 21, 21, 29), (6, 10, 24, 18), (1, 2, 12, 11)): g[(xm > x0) & (xm < x1) & (ym > y0) & (ym < y1)] = ID['gravel']
        g[(np.abs(ym - 19.5) < 1.6)] = ID['asphalt']
    elif place == 'desert':
        g[:] = ID['pavement']; g[n > 1.45] = ID['calcrete']
        w = np.abs(ym - 0.35 * xm - 3.0 - 1.2 * np.sin(xm / 4.0)) < 1.4
        g[w] = ID['silt']; g[w & (n > 0.2)] = ID['cobble']
    elif place == 'redrock':
        g[:] = ID['redsand']; g[n > 0.25] = ID['slickrock']
    elif place == 'pass':
        g[:] = ID['scree']; road = np.abs(ym - 0.18 * xm - 12.0) < 4.2
        g[road] = ID['asphalt']; g[road & (np.abs(ym - 0.18 * xm - 12.0) < 0.08) & ((xm * 0.8).astype(int) % 2 == 0)] = ID['paint']
    elif place == 'shore':
        g[:] = ID['mud']; g[np.abs(ym - 29.5 - 0.6 * n) < 1.6] = ID['ring']; g[ym > 31.0 + 0.6 * n] = ID['caliche']
    elif place == 'wash':
        g[:] = ID['caliche']; ch = np.abs(xm - 16.0 - 2.0 * np.sin(ym / 6.0)) < 9.0
        g[ch] = ID['silt']; g[ch & (n > 0.3)] = ID['cobble']
    elif place == 'suburbs':
        g[:] = ID['deadlawn']; g[((xm + ym) / 2.6).astype(int) % 2 == 1] = ID['deadlawn_b']; g[n > 0.8] = ID['caliche']
        g[(np.abs(xm - 16) < 7.2) & (np.abs(ym - 14) < 4.6)] = ID['concrete']
        g[(xm > 26) & (ym < 12)] = ID['concrete']
    elif place == 'landfill':
        g[:] = ID['coversoil']; g[n > 0.6] = ID['rubbleg']
    elif place == 'strip':
        g[:] = ID['marble']; g[ym < 4.0] = ID['asphalt']; g[(ym < 4.0) & (np.abs(ym - 2.0) < 0.07) & ((xm * 0.8).astype(int) % 2 == 0)] = ID['paint']
        g[(xm > 26) & (ym > 20)] = ID['pooltile']
    elif place == 'downtown':
        g[:] = ID['asphalt']; g[(ym > 26.5) | (ym < 1.5)] = ID['concrete']
        g[(np.abs(xm - 16.0) < 0.07) & ((ym * 0.7).astype(int) % 2 == 0) & (ym > 1.5) & (ym < 26.5)] = ID['paint']
    elif place == 'works':
        g[:] = ID['oilcrete']
        for yc in (24.0, 16.0): g[np.abs(ym - yc) < 2.0] = ID['ballast']
        g[(n > 0.8) & (g == ID['oilcrete'])] = ID['gravel']
    elif place == 'marina':
        g[:] = ID['mud']; g[np.abs(ym - 30.0 - 0.6 * n) < 1.4] = ID['ring']; g[ym > 31.4 + 0.6 * n] = ID['caliche']
    else:
        g[:] = ID['caliche']
    return g


CARDS = {
    'lab':     [('lab.cage_block', 15.5, 19.0, 0), ('lab.fence_run', 4.0, 27.5, 0), ('lab.fence_gate', 11.0, 27.5, 0), ('lab.fence_run', 20.0, 27.5, 0),
                ('lab.cold_truck', 23.5, 8.0, 180), ('lab.decon', 5.5, 7.5, 0), ('lab.gurneys', 13.0, 7.0, 15)],
    'airport': [('airport.hangar', 14.0, 19.5, 0), ('airport.plane', 13.5, 8.5, -8), ('airport.jet_bridge', 25.0, 13.0, 90),
                ('airport.fuel_truck', 4.0, 13.5, 70), ('airport.baggage', 25.0, 3.0, 0)],
    'golf':    [('golf.clubhouse', 13.0, 22.0, 0), ('golf.flag_green', 9.0, 6.0, 0), ('golf.cart', 22.0, 13.0, 30), ('golf.cart_over', 25.0, 9.5, -20),
                ('golf.tee', 4.0, 14.5, 0), ('golf.dead_palm', 28.0, 18.0, 0), ('golf.palm_down', 20.5, 5.0, -15)],
    'trailer': [('trailer.trailer', 11.0, 25.0, 0), ('trailer.burnt', 15.0, 14.0, 0), ('trailer.propane', 26.5, 25.0, 0),
                ('trailer.carport', 5.5, 6.0, 0), ('trailer.clothesline', 18.0, 5.0, 0)],
    'desert':  [('desert.pylon', 3.5, 25.0, 0), ('desert.joshua', 7.0, 12.0, 0), ('desert.joshua_small', 14.0, 16.0, 0), ('desert.joshua', 28.0, 15.0, 0),
                ('desert.boulders', 23.0, 9.0, 0), ('desert.buried_car', 13.0, 5.0, 20)],
    'redrock': [('redrock.ledge_3', 7.5, 25.5, 0), ('redrock.ledge_2', 20.0, 25.5, 0), ('redrock.ledge_1', 20.0, 14.5, 0),
                ('redrock.fin', 29.0, 13.0, 90), ('redrock.slot', 7.5, 9.5, 0)],
    'pass':    [('pass.truck', 9.0, 17.0, 0), ('pass.rockfall', 24.0, 25.0, 0), ('pass.guardrail', 9.0, 3.5, 10), ('pass.guardrail', 22.0, 5.8, 10),
                ('pass.barricade', 26.0, 13.0, 10)],
    'shore':   [('shore.intake', 22.0, 21.0, 0), ('shore.dock', 8.0, 15.0, 8), ('shore.boat', 20.0, 7.0, 0), ('shore.buoys', 6.0, 5.0, 0)],
    'wash':    [('wash.culvert', 16.0, 23.0, 0), ('wash.sofa', 9.0, 10.0, 0), ('wash.cart', 21.0, 8.0, 0), ('wash.jam', 25.0, 14.0, 0)],
    'suburbs': [('suburbs.yard_wall', 14.0, 26.0, 0), ('suburbs.pool', 16.0, 14.0, 0), ('suburbs.swing', 26.0, 24.0, 0),
                ('suburbs.trampoline', 6.0, 6.5, 0), ('suburbs.yard_wall', 30.0, 8.0, 90)],
    'landfill': [('landfill.mound', 10.0, 21.0, 0), ('landfill.flare', 25.0, 23.0, 0), ('landfill.dozer', 23.0, 9.0, 15), ('landfill.wells', 9.0, 6.0, 0)],
    'strip':   [('strip.bridge', 13.0, 27.0, 0), ('strip.fountain', 10.0, 13.0, 0), ('strip.limo', 25.0, 15.0, 0), ('strip.sign', 21.0, 6.5, 0)],
    'downtown': [('downtown.fire_escape', 16.0, 29.0, 0), ('downtown.dumpsters', 5.0, 24.0, 0), ('downtown.canopy', 16.0, 14.0, 0),
                 ('downtown.deuce', 16.0, 6.0, 0)],
    'works':   [('works.boxcar', 15.0, 24.0, 0), ('works.tankcar', 15.0, 16.0, 0), ('works.pipes', 29.0, 18.0, 90), ('works.gantry', 19.0, 7.0, 0),
                ('works.machines', 5.0, 6.0, 0)],
    'marina':  [('marina.houseboat', 14.0, 24.0, 0), ('marina.cruiser', 9.0, 12.0, 0), ('marina.bass_boat', 24.0, 8.0, 0), ('shore.dock', 25.0, 16.0, 0)],
}


# ======================================================================================================================
# THE RIG: the lone shot (a cover sprite) and the card
# ======================================================================================================================
def rig_scene(props, ground=()):
    """the master rig's source pass and dents on every mesh, the board's wear on its ground and a thing's wear on the
    things, then the vertical stretch under the 45 camera about each object's ground origin"""
    import bohemia_direction_master_rig as RIG
    RIG.source_pass(list(ground), 0.25, 1.0, 0) if ground else None
    RIG.source_pass(list(props), PROP_WEAR, 1.0, 0)
    RIG.dent_pass(list(props) + list(ground), 1.0)
    for m in {s.material for o in list(props) + list(ground) for s in o.material_slots if s.material}:
        for n in m.node_tree.nodes:
            if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 2
    zs = 1.0 / math.cos(math.radians(TILT))
    for o in list(props) + list(ground): o.scale = (o.scale[0], o.scale[1], zs)
    return RIG


def camera_on(sc, sx0, sx1, sy0, sy1):
    """the fight camera (orthographic, tilted 45, facing north, never turned) framing a screen box in metres; screen y of a
    world point is y cos45 + z sin45 (z already stretched)"""
    t = math.radians(TILT)
    W, H = int(math.ceil((sx1 - sx0) * PPM)), int(math.ceil((sy1 - sy0) * PPM))
    sx1, sy1 = sx0 + W / PPM, sy0 + H / PPM
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = W / PPM; cd.clip_end = 500
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.rotation_euler = (t, 0, 0)
    cx, cy = (sx0 + sx1) / 2, (sy0 + sy1) / 2
    look = mu.Vector((cx, cy * math.cos(t), cy * math.sin(t))); d = mu.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - d * 150
    sc.render.resolution_x, sc.render.resolution_y = W, H
    return W, H, sx0, sy1


def shot(o, fn, samples=64):
    """one prop alone from the fight camera, through the rig, onto a shadow catcher: a cover sprite at 42.92 px a metre"""
    sc = bpy.context.scene
    co = np.zeros(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    lo, hi = co.min(0).astype(float), co.max(0).astype(float)
    RIG = rig_scene([o])
    t = math.radians(TILT); h = float(hi[2])
    reach = h * 0.9 + 1.0
    sx0, sx1 = lo[0] - 0.6, hi[0] + 0.6 + reach
    sy0, sy1 = lo[1] * math.cos(t) - 0.6 - reach * 0.7, hi[1] * math.cos(t) + h + 0.6
    bpy.ops.mesh.primitive_plane_add(size=1, location=((sx0 + sx1) / 2, (lo[1] + hi[1]) / 2 - reach * 0.5, 0.0))
    pl = bpy.context.active_object; pl.scale = ((sx1 - sx0) * 1.6, (hi[1] - lo[1]) + 2 * reach + 6, 1); pl.is_shadow_catcher = True
    RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg']))); sc.render.film_transparent = True
    sc.cycles.samples = samples; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    W, H, X0, Y1 = camera_on(sc, sx0, sx1, sy0, sy1)
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
    return dict(res=[W, H], origin_px=[round((0 - X0) * PPM, 1), round((Y1 - 0) * PPM, 1)], size_m=[round(float(v), 2) for v in (hi - lo)],
                bounds_m=[[round(float(v), 2) for v in lo], [round(float(v), 2) for v in hi]])


def models(place):
    """every prop of a place: built, its .glb, its lone shot, its ledger"""
    global bpy, mu
    import bpy as _b, mathutils as _m
    bpy, mu = _b, _m
    from PIL import Image
    os.makedirs(MODELS, exist_ok=True); os.makedirs(os.path.join(OUT, place.split('.')[0]), exist_ok=True)
    led_fn = os.path.join(OUT, 'ledger.json'); L = json.load(open(led_fn)) if os.path.exists(led_fn) else {}
    for pid in ([place] if place in PROPS else [p for p in PROPS if PROPS[p]['place'] == place]):
        t0 = time.time(); reset()
        o = build(pid)
        stem = pid.replace('.', '_')
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True)
        glb = os.path.join(MODELS, stem + '.glb')
        bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=True, export_extras=True)
        nv, nmat = len(o.data.vertices), len(o.data.materials)
        raw = os.path.join('/tmp/claude-0/fight_props_raw', stem + '.png'); os.makedirs(os.path.dirname(raw), exist_ok=True)
        info = shot(o, raw)
        a = Image.open(raw).convert('RGBA'); bb = a.getchannel('A').point(lambda v: 255 if v > 6 else 0).getbbox()
        a = a.crop(bb); pic = os.path.join(OUT, PROPS[pid]['place'], stem + '.webp'); a.save(pic, quality=90, method=6)
        info.update(model=os.path.relpath(glb, R), picture=os.path.relpath(pic, R), picture_px=list(a.size),
                    anchor_px=[round(info['origin_px'][0] - bb[0], 1), round(info['origin_px'][1] - bb[1], 1)],
                    verts=nv, materials=nmat, glb_kb=os.path.getsize(glb) // 1024, seconds=round(time.time() - t0))
        info.pop('origin_px'); info.pop('res')
        L[pid] = info
        json.dump(L, open(led_fn, 'w'), indent=1)
        print('  %-24s %5.1f x %5.1f x %4.1f m  %6d verts  %4d KB  %s px  %ds' % (pid, *info['size_m'], nv, info['glb_kb'], a.size, info['seconds']), flush=True)


def card(place, samples=24):
    global bpy, mu
    import bpy as _b, mathutils as _m
    bpy, mu = _b, _m
    from PIL import Image
    import bohemia_combat_maps_every_ground_its_own_11_2_26 as EG
    F = EG.F
    EG.install()
    t0 = time.time(); reset(); sc = bpy.context.scene
    side = CARD_SIDE; W2 = int(round(side * PPM)); H2 = int(round(W2 * 1820 / 2575))
    F.SIDE, F.W, F.H = side, W2, H2
    gid = ground_plan(place, H2, W2, EG.ID)
    gobjs, g = F.build(bpy, gid, 1103 + sum(map(ord, place)))
    for (pid, x, y, rz) in CARDS[place]:                       # a pit (the pool): its ground cut away to the rim
        if PROPS[pid]['hole']:
            import bmesh
            rx, ry = PROPS[pid]['hole']; me = gobjs[0].data; bm = bmesh.new(); bm.from_mesh(me)
            kill = [f for f in bm.faces if ((f.calc_center_median().x - x) / (rx * 1.02)) ** 2 + ((f.calc_center_median().y - y) / (ry * 1.06)) ** 2 < 1.0]
            bmesh.ops.delete(bm, geom=kill, context='FACES'); bm.to_mesh(me); bm.free()
    things, top = [], side * math.cos(math.radians(TILT))
    for (pid, x, y, rz) in CARDS[place]:
        o = build(pid); o.location = (x, y, 0.0); o.rotation_euler = (0, 0, math.radians(rz))
        co = np.zeros(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
        rr = math.radians(rz); yy = co[:, 0] * math.sin(rr) + co[:, 1] * math.cos(rr) + y
        top = max(top, float(np.max(yy * math.cos(math.radians(TILT)) + co[:, 2])))
        things.append(o)
    RIG = rig_scene(things, gobjs)
    RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg']))); sc.render.film_transparent = True
    sc.cycles.samples = samples; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    W, H, _, _ = camera_on(sc, 0.0, side, 0.0, top + 0.4)
    raw = os.path.join('/tmp/claude-0/fight_props_raw', 'card_%s.png' % place); sc.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    a = Image.open(raw).convert('RGBA')
    bg = Image.new('RGBA', a.size, (20, 19, 19, 255)); bg.alpha_composite(a)
    fn = os.path.join(OUT, 'CARD_%s.webp' % place.upper()); bg.convert('RGB').save(fn, quality=84, method=6)
    print('  card', place, a.size, round(time.time() - t0), 's ->', os.path.relpath(fn, R), flush=True)


# ======================================================================================================================
# THE CONTRACT (plain python)
# ======================================================================================================================
def manifest():
    L = json.load(open(os.path.join(OUT, 'ledger.json')))
    out = dict(about='COOK PROPS 11/3 (rule 341, rule 337): each place\'s own things as real models through the master rig, for '
                     'COMBAT MAPS 3 to place on its boards. tools/bohemia_cook_props_every_place_its_own_11_3_26.py',
               px_per_metre=round(PPM, 3), cell_m=CELL, storey_m=STOREY,
               camera='orthographic, tilted 45 from straight down, facing north, never turned; heights drawn full (x 1/cos45); one sun upper left',
               front='every model faces -Y (south, the camera); turn it on a board in quarters; its origin is its ground centre, metres, z up',
               anchor='anchor_px is the model\'s ground centre (its origin) in its picture, from the top-left pixel',
               role_key=dict(cover='stops a shot, a man stands behind it', blocking='nobody walks through it', none='stands there, the fight walks past it'),
               tile_key={'#': 'blocked (BB impassable)', 'H': 'height (+1 level, a roof or ledge you climb)', 'r': 'rough (3 AP)', '.': 'flat; the thing is a piece on it'},
               places=[dict(id=p, name=n, card='records/target/fight_props/CARD_%s.webp' % p.upper(),
                            props=[k for k in PROPS if PROPS[k]['place'] == p and k in L]) for p, n in PLACES if any(PROPS[k]['place'] == p and k in L for k in PROPS)],
               models=[])
    for pid, P in PROPS.items():
        if pid not in L: continue
        l = L[pid]; sx, sy, sz = l['size_m']
        out['models'].append(dict(
            id=pid, place=P['place'], place_name=PLACE_NAME[P['place']], name=P['name'], landmark=P['landmark'],
            model=l['model'], picture=l['picture'], picture_px=l['picture_px'], anchor_px=l['anchor_px'],
            size_m=l['size_m'], footprint_cells=[max(1, math.ceil(sx / CELL - 0.08)), max(1, math.ceil(sy / CELL - 0.08))],
            fills_cell=round(min(1.0, sx * sy / CELL ** 2), 3), height_m=l['bounds_m'][1][2], height_storeys=round(l['bounds_m'][1][2] / STOREY, 2),
            role=P['role'], sees_through=bool(P['see']),
            fight=dict(kind=P['kind'], tile=P['tile'], blocks_move=P['role'] == 'blocking' or P['tile'] == '#', blocks_sight=bool(P['sight']),
                       see_through=bool(P['see']), burns=bool(P['burns'])),
            what=P['what'], wrong=P['wrong'] or None, verts=l['verts'],
            **({'hole_m': dict(ellipse_radii=list(P['hole']), about='a pit: cut the board\'s ground inside this ellipse round the model\'s origin')} if P['hole'] else {})))
    fn = os.path.join(OUT, 'manifest.json'); json.dump(out, open(fn, 'w'), indent=1)
    print('  manifest:', len(out['models']), 'models,', len(out['places']), 'places ->', os.path.relpath(fn, R))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'manifest': manifest()
    elif a[0] == 'models':
        for p in a[1:]: models(p)
    elif a[0] == 'card':
        for p in a[1:]: card(p)
    sys.stdout.flush(); os._exit(0)
