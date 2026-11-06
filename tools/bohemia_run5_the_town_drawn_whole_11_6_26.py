#!/usr/bin/env python3
"""BOHEMIA -- RUN FIVE [the town drawn whole] (VAMILY rule 383, Paolo 11/3, moved to NOW by rule 404 amended 11/4; rule 411 opened
the round). His words: 'the straight line cutting off bullshit, it looks so bad just to optimize for the phone, you got to be smarter
than this... all settlement maps probably have this issue... not looking organic... a circular object... cut in half'. 11/4: 'I don't
like any cheap alternative ways you've tried to do the UI with the settlement'.

WHAT WAS WRONG, MEASURED ON THE DEMO (11/6, 390 x 844 and 844 x 390, both phone sides):
  SIDEWAYS (his screenshot is this one): the 2060 x 1092 wide picture ended at the phone's strip. The screen fitted the town to the
  glass LESS the strip (s 0.344, the town 708 px wide on an 844 px glass), and laid a 120 px square of the picture's own ground,
  mirrored four ways and tiled, over the 136 px left (padDraw / padGround): a hard vertical line top to bottom, a flat tiled fill,
  a mirrored gravel band, and Network's two round tanks sliced by the line.
  UPRIGHT: the four-layouts drawings (tools/bohemia_four_layouts_tall_render_10_27_26.py) are whole and their corner is the town's
  own ground, but the screen still laid the same tiled square over the phone's corner as a rectangle (one hard edge); and the 260 px
  of ground those drawings add under the town is the town's plan FLIPPED ('the plan mirrored, laid on south of it, so the seam is the
  same ground meeting itself'): a mirrored band along the bottom of every upright town.
  WHY NOT AT THE SCREEN: drawing the 2060 picture over the whole glass puts a tap under the phone in all 14 towns (measured: the
  armourer or the build ground on the right, the barber, the smith or the bar on the left), so the room has to be made in the
  picture, before it is drawn (rule 383(b)).

WHAT THIS DRAWS (one scene, one camera, one light, nothing cut, nothing mirrored, nothing pasted):
  --wide   the same re-laid wide town (tools/bohemia_cook_every_town_wide_relaid_10_26_26.py: its layout, fill, taps and checks,
           untouched) with the frame opened EXT px on BOTH sides: the town's own ground goes on under the phone whichever side it is
           on. The plan covers 6 m past the old frame; past the plan the ground is CONTINUED, never mirrored (go_on below): every
           band of the plan that runs to that edge runs on (the street, the yard's slab, the centre line), a patch that touches the
           edge runs on a few metres and ends ragged, and a few worn patches of the town's own grounds lie about. Every thing the
           old frame cut at its edge is drawn whole. 2060 + 2 x 600 = 3260 x 1092; every tap, door and walk block of the old
           picture moves by EXT, measured, never retyped.
  --tall   the four-layouts upright drawings (left and right, the phone's corner cleared of things, never of the town's ground)
           with the 260 px under the town CONTINUED south the same way instead of flipped.
  The screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __THE_TOWN_IS_ONE_PICTURE__) then draws the picture over the WHOLE glass, the
  phone floating over it, the taps placed where the phone is not; padDraw and the mirrored square are deleted.

  <bvenv>/bin/python tools/bohemia_run5_the_town_drawn_whole_11_6_26.py --wide|--tall [Town ...] [--side left|right] [--quick]
      [--day-only] [--skip-done] [--no-ship] [--ship-only]
  (venv: python3.11 -m venv bv && bv/bin/pip install bpy==4.2.0 numpy pillow scipy)
  -> records/target/cook_town_screens/whole/{wide,tall}/<slug>[_<side>].png, _night.png (local), .json (committed)
  -> slices/settlement_ground_towns/<slug>.webp, _night.webp (wide, replaced in place), <slug>_tall_<side>.webp, _night.webp;
     settlement_ground.json towns[name].wide (.whole) and .tall_<side> (.phone_ground.ground), settlement_walk.json

REFERENCE CHECK: Battle Brothers' town screen is one painted scene with its menus laid over it; nothing in the scene is cut for a
menu (the coordinator's [bb] line on rule 383). No reference game added. REUSE CHECK: every builder, the plans, the layouts, the
fills, the taps, the checks, the light and the night are COOK's and the four layouts' tools, imported; new here only the frame
opened, the ground continued, and the ship of the shifted taps.
"""
import os, sys, json, math, hashlib, random
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np

EXT = 600                       # px of the town's own ground opened on each side of the wide frame (the sideways phone and its gap
                                # are 150 of 844 points, 21 percent on the smallest phones: 600 px holds the phone's side either way)
OUT = os.path.join(R, 'records/target/cook_town_screens/whole')
MODE = 'wide' if '--wide' in sys.argv else 'tall' if '--tall' in sys.argv else None


# ---- the plan's bands, read as the plan lays them ------------------------------------------------------------------------
def bands_of(planfn, town, seed):
    """every band the plan paints, in its order: ((row0, row1), (col0, col1), id) on the plan's own grid (rows north to south,
    columns west to east); read by watching the plan's own array, with its own seed, so nothing is retyped"""
    rec = []
    class Rec(np.ndarray):
        def __setitem__(self, k, v):
            try:
                rs, cs = k
                H, W = self.shape
                rec.append(((rs.start or 0, H if rs.stop is None else rs.stop), (cs.start or 0, W if cs.stop is None else cs.stop), int(v)))
            except Exception: pass
            return np.ndarray.__setitem__(self, k, v)
    real = np.full
    def full(shape, val, dtype=None): return real(shape, val, dtype).view(Rec)
    np.full = full
    try: g = planfn(town, random.Random(seed))
    finally: np.full = real
    return np.asarray(g).copy(), rec


def go_on(g, rec, way, seed, F):
    """THE GROUND GOES ON (rule 383(c)): the plan's ground past its edge `way` ('east', 'west', 'south'), a 60 m grid of its own laid
    beside the plan, NEVER the plan mirrored. Every band of the plan that runs to that edge runs on: a band the plan lays across the
    whole of it (the street, the base, a slab wall to wall, the centre line) runs on all the way; one that only touches that edge runs
    on 3 to 9 m and ends ragged. Then three worn patches of the town's own grounds within 12 m of the seam."""
    Hh, Ww = g.shape; rng = np.random.default_rng(seed)
    base = rec[0][2] if rec else int(F.ID['caliche'])
    out = np.full((Hh, Ww), base, np.uint8)
    mx, my = Ww / 60.0, Hh / 60.0                       # cells a metre
    def wob(n, amp_m, cell):
        t = np.arange(n, dtype=np.float32)
        ph = rng.uniform(0, 6.3, 3)
        return amp_m * cell * (0.55 * np.sin(t / (3.1 * cell) + ph[0]) + 0.3 * np.sin(t / (1.2 * cell) + ph[1]) + 0.15 * np.sin(t / (0.45 * cell) + ph[2]))
    for (r0, r1), (c0, c1), v in rec:
        if way in ('east', 'west'):
            touches = c1 >= Ww if way == 'east' else c0 <= 0
            if not touches or r1 <= r0: continue
            if c0 <= 0 and c1 >= Ww: out[r0:r1, :] = v; continue
            L = rng.uniform(3.0, 9.0) * mx; lr = np.clip(L + wob(r1 - r0, 0.9, mx), 2 * mx, None).astype(int)
            for i, r in enumerate(range(r0, r1)):
                if way == 'east': out[r, :lr[i]] = v
                else: out[r, Ww - lr[i]:] = v
        else:
            touches = r1 >= Hh
            if not touches or c1 <= c0: continue
            if r0 <= 0 and r1 >= Hh: out[:, c0:c1] = v; continue
            L = rng.uniform(3.0, 9.0) * my; lc = np.clip(L + wob(c1 - c0, 0.9, my), 2 * my, None).astype(int)
            for i, c in enumerate(range(c0, c1)): out[:lc[i], c] = v
    # three worn patches: grounds the plan itself uses (paint, gutter, lawn never), near the seam, only on the base
    ids, cnt = np.unique(g, return_counts=True)
    skip = {int(F.ID[n]) for n in ('paint', 'gutter', 'lawn') if n in F.ID} | {base}
    pool = [(int(i), int(c)) for i, c in zip(ids, cnt) if int(i) not in skip]
    if pool:
        w = np.array([c for _, c in pool], np.float64); w /= w.sum()
        for _ in range(3):
            v = pool[int(rng.choice(len(pool), p=w))][0]
            a, b = rng.uniform(1.6, 3.6), rng.uniform(1.2, 2.6)          # half sizes, metres
            if way == 'east': cx, cy = rng.uniform(1.0, 11.0), rng.uniform(8, 52)
            elif way == 'west': cx, cy = 60 - rng.uniform(1.0, 11.0), rng.uniform(8, 52)
            else: cx, cy = rng.uniform(4, 56), 60 - rng.uniform(1.0, 8.0)
            ys, xs = np.mgrid[0:Hh:4, 0:Ww:4]
            X, Y = xs / mx, 60 - ys / my
            d = ((X - cx) / a) ** 2 + ((Y - cy) / b) ** 2 + 0.35 * np.sin(X * 2.3 + Y * 1.7)
            m = (d < 1.0) & (out[0:Hh:4, 0:Ww:4] == base)
            rr, cc = np.nonzero(m)
            for r, c in zip(rr * 4, cc * 4): out[r:r + 4, c:c + 4] = v
    return out


def rss(tag):
    try:
        kb = int([l for l in open('/proc/self/status').read().split('\n') if l.startswith('VmRSS')][0].split()[1])
        print('  [mem] %-28s %6d MB' % (tag, kb // 1024), flush=True)
    except Exception: pass


def trim(bpy, objs, keep):
    """ONLY THE GROUND THE FRAME SEES (memory: three whole 60 m grids with their stones held 7.3 GB and the kernel killed the render
    beside a gate): every vertex of a grid laid beside the plan that the frame never sees is deleted before the render, its stones
    with it; keep(x, y) is in the grid's own metres, before it is moved beside the plan"""
    import bmesh
    for o in objs:
        if o.type != 'MESH' or o.data is None: continue
        bm = bmesh.new(); bm.from_mesh(o.data)
        gone = [v for v in bm.verts if not keep(v.co.x, v.co.y)]
        if gone: bmesh.ops.delete(bm, geom=gone, context='VERTS')
        bm.to_mesh(o.data); bm.free(); o.data.update()


def mirrored_rows(img, at, k=60, thr=6.0):
    """the self-check (the gate has its own): is the picture's band below `at` the band above it flipped? mean abs difference of k
    rows each side, flipped against straight; a mirror is far nearer flipped than the ground is to itself straight"""
    a = img[at - k:at].astype(np.float32); b = img[at:at + k].astype(np.float32)
    flip = float(np.abs(a[::-1] - b).mean()); straight = float(np.abs(a - b).mean())
    return flip, straight


# ---- the wide frame, opened ----------------------------------------------------------------------------------------------
def render_wide(town, quick=False, day_only=False):
    import bpy, mathutils
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    import bohemia_cook_every_town_tall_and_wide_10_26_26 as T
    import bohemia_cook_every_town_wide_relaid_10_26_26 as WR
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F; RIG = NF.RIG
    PW, PH, PPM = V.PW, V.PH, V.PPM
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    g0, rec = bands_of(V.plan, town, seed)
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = V.plan(town, rnd)
    assert np.array_equal(np.asarray(g), g0), 'the plan read twice must be the same plan'
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = V.Town(bpy, P, rnd)                              # WR._HookW: the re-laid wide's own checks run on its own frame
    V.layout(town, pl, K)
    filled = V.fill(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    rss('town laid'); outlines = pl.outlines(); rss('outlines')                              # the old frame's measure: the taps and the checks, as COOK wrote them
    V.PW = PW + 2 * EXT
    try: outlines_whole = T.TallTown.outlines(pl)         # the opened frame's measure: the walk, everything whole
    finally: V.PW = PW
    # THE GROUND AFTER THE TOWN (measured 11/6, Mob: every one of the layout's build steps refreshes the whole scene, and with the big
    # ground meshes already in it the layout took 20 minutes; nothing in the layout reads the ground, so it is built last, the same
    # ground from the same seeds)
    # MEMORY, MEASURED (the kernel's log: Cartel, a town paved in rubble, 13.9 GB and killed at the render's first sample): the wide
    # frame sees the ground from 12 m to 48 m of the plan's 60; the rows it never sees are laid as bare slab (no stones) before the
    # build, a 2 m margin kept. Nothing on the picture changes; the stones the frame never showed are not made.
    def unseen_rows(a):
        H = a.shape[0]; a[:int((60.0 - 50.0) / 60.0 * H), :] = F.ID['concrete']; a[int((60.0 - 10.0) / 60.0 * H):, :] = F.ID['concrete']; return a
    objs, gg = F.build(bpy, unseen_rows(np.asarray(g).copy()), 2020 + seed, quick)
    # and the render's own copy of the ground is what killed it (measured: 1.9 GB built, past 12.7 GB as the render readied the meshes,
    # Cartel): every grid is cut to the band the frame sees before the render, the plan's own included
    trim(bpy, objs, lambda x, y: 10.0 <= y <= 50.0)
    SIDE_M = float(getattr(F, 'SIDE', 60.0))
    reach = (EXT + PW / 2) / PPM - 30.0 + 2.0              # metres past the plan's edge the opened frame sees, and two more
    for way, dx, sd in (('east', SIDE_M, 4040), ('west', -SIDE_M, 5050)):
        ge = go_on(np.asarray(g), rec, way, seed + sd, F)
        # MEMORY, MEASURED (Cartel, a town of rubble): the stones scattered over a whole 60 m grid before the trim held 13.5 GB;
        # the part the frame never sees is laid as bare slab (no stones) before it is built, then trimmed away
        cut = int(min(60.0, reach + 2.0) / 60.0 * ge.shape[1])
        if way == 'east': ge[:, cut:] = F.ID['concrete']
        else: ge[:, :ge.shape[1] - cut] = F.ID['concrete']
        oe, _ = F.build(bpy, unseen_rows(ge), sd + seed, quick)
        trim(bpy, oe, (lambda x, y: x < reach and 10.0 <= y <= 50.0) if way == 'east' else (lambda x, y: x > 60.0 - reach and 10.0 <= y <= 50.0))
        for o in oe:
            if o.parent is None: o.location.x += dx
        objs = objs + oe
    rss('ground built'); F.scene(bpy, objs); rss('ground rigged')
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o not in objs]
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, seed % 5); RIG.dent_pass(meshes, 1.0); rss('things rigged')
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, zs)
    for o in bpy.context.scene.objects:
        if o.parent is None and o not in objs and o is not stretch and o.type in ('MESH', 'EMPTY'): o.parent = stretch
    NF.LEDGER['fires'] = NF.LEDGER.get('fires', []) + [(x, y, r) for (x, y, r) in pl.fires]
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = False
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = (PW + 2 * EXT) / PPM
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(float(RIG.G['tilt_deg'])); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((30.0, 30.0, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - dvec * 80; cd.clip_end = 400
    sc.render.resolution_x, sc.render.resolution_y = PW + 2 * EXT, PH; sc.render.resolution_percentage = 25 if quick else 100
    # 16 samples and the denoiser, as the four layouts' upright towns; a town too heavy for the box (Cartel: the denoiser's load at the
    # first sample took it past 14 GB at any size) is rendered as COOK's 10/25 tool rendered the wide towns: 32 samples, no denoiser
    nd = '--no-denoise' in sys.argv
    if '--simplify' in sys.argv:   # a town too heavy for the box (Cartel measured 13.6 GB and killed): the rig's handmade dents cut once, not twice (finer than a pixel at the screen's size)
        sc.render.use_simplify = True; sc.render.simplify_subdivision_render = 1
    sc.cycles.samples = 8 if quick else (32 if nd else 16); sc.cycles.use_denoising = not nd; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    od = os.path.join(OUT, 'quick' if quick else 'wide'); os.makedirs(od, exist_ok=True)
    day = os.path.join(od, town['slug'] + '.png'); sc.render.filepath = day
    bpy.ops.render.render(write_still=True)
    night = None
    if not day_only:
        sun.data.energy *= 0.045; sun.data.color = (0.55, 0.66, 1.0)
        bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value; bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.08
        for m in K.night_win: m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 2.4
        for (x, y, h) in pl.lamps:
            L_ = bpy.data.lights.new('lamp', 'POINT'); L_.energy = 1600 if h < 5 else 3200; L_.color = (1.0, 0.62, 0.28); L_.shadow_soft_size = 0.3
            o = bpy.data.objects.new('lamp_light', L_); sc.collection.objects.link(o); o.location = (x, y, min(h, 8.0) * zs)
        for (x, y, r) in pl.fires:
            L_ = bpy.data.lights.new('fire', 'POINT'); L_.energy = 900; L_.color = (1.0, 0.5, 0.18); L_.shadow_soft_size = 0.4
            o = bpy.data.objects.new('fire_light', L_); sc.collection.objects.link(o); o.location = (x, y, 1.6 * zs)
        night = os.path.join(od, town['slug'] + '_night.png'); sc.render.filepath = night; bpy.ops.render.render(write_still=True)
    WR._orig_dump(dict(name=town['name'], tier=town['tier'], lamps=pl.lamps, fires=pl.fires, outlines=outlines, outlines_whole=outlines_whole,
                       boxes=WR._LASTW.get('boxes'), filled=filled, seed=seed, ext=EXT, px=[PW + 2 * EXT, PH], comp='wide', frame=[PW, PH],
                       bands=len(rec)), open(os.path.join(od, town['slug'] + '.json'), 'w'), indent=0)
    return day, night


def shift(v, dx):
    if isinstance(v, dict): return {k: shift(x, dx) for k, x in v.items()}
    if isinstance(v, list) and len(v) in (2, 4) and all(isinstance(x, (int, float)) for x in v):
        return [v[i] + dx if i % 2 == 0 else v[i] for i in range(len(v))]
    if isinstance(v, list): return [shift(x, dx) for x in v]
    return v


def ship_wide(towns_):
    from PIL import Image
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    import bohemia_cook_every_town_tall_and_wide_10_26_26 as T
    import bohemia_cook_every_town_wide_relaid_10_26_26 as WR
    SHIP = V.SHIP; PW, PH = V.PW, V.PH; WPX = [PW + 2 * EXT, PH]
    manp = os.path.join(SHIP, 'settlement_ground.json'); walkp = os.path.join(SHIP, 'settlement_walk.json')
    man = json.load(open(manp)); walk = json.load(open(walkp))
    for town in towns_:
        s = town['slug']; rd = os.path.join(OUT, 'wide'); jp = os.path.join(rd, s + '.json')
        if not os.path.exists(jp) or not os.path.exists(os.path.join(rd, s + '_night.png')): print('  not shipped (no render)', s, flush=True); continue
        meta = json.load(open(jp))
        for suf in ('', '_night'):
            a = Image.open(os.path.join(rd, s + suf + '.png')).convert('RGB'); assert list(a.size) == WPX, a.size
            a.save(os.path.join(SHIP, s + suf + '.webp'), quality=82, method=6)
        hot, boxes = WR.taps_wide(town, meta)                 # measured on the old frame, as COOK's checks passed them
        hot, boxes = shift(hot, EXT), shift(boxes, EXT)
        e = man['towns'].setdefault(town['name'], {})
        # the doors already shipped are carried over, moved by EXT (measured: Reds' smith door had been set by hand by RUN TWO, 1044,1062,
        # off the picture's bottom edge; recomputing it put it back on the edge and the screen refused the whole drawing)
        was = e.get('wide') or {}
        keep_doors = (was.get('doors') if was.get('whole') else shift(was.get('doors'), EXT)) if was.get('doors') else None
        whole = {'ext': EXT, 'town': [EXT, 0, EXT + PW, PH],
                 'note': 'rule 383 (11/6, RUN FIVE): the re-laid wide town with its own ground opened EXT px on both sides (the plan, then the '
                         'plan continued, never mirrored); the phone floats over the town\'s own ground on either side; every tap, door and '
                         'walk block moved by EXT, measured'}
        e.update(tier=town['tier'], src=s + '.webp', night_src=s + '_night.webp', px=WPX, hotspots=hot, boxes=boxes,
                 lights=len(meta['lamps']) + len(meta['fires']))
        e['wide'] = dict(src=s + '.webp', night_src=s + '_night.webp', px=WPX, hotspots=hot, boxes=boxes,
                         doors=keep_doors or T.doors_of(hot, boxes, town['tier']), entrance=T.entrance_of(town, WPX[0], WPX[1], wide=True),
                         zoom_max=T.ZOOM[town['tier']], relaid=True, whole=whole)
        bl = sorted({tuple(o['box']) for o in meta['outlines_whole']})
        for suf in ('', '_night'): walk['pictures'][s + suf + '.webp'] = {'blocks': [list(b) for b in bl]}
        print('  shipped wide whole', s, WPX, len(bl), 'outlines', flush=True)
    json.dump(man, open(manp, 'w'), indent=1)
    json.dump(walk, open(walkp, 'w'), indent=1)
    # THE ARENA's pit stands at a spot in Mob's wide picture (slices/arena/arena_town.json, ARENA's data): the opened picture holds the
    # old frame EXT px in, so the spot moves by EXT, once (whole_ext says it moved)
    ap = os.path.join(R, 'slices/arena/arena_town.json')
    if os.path.exists(ap):
        A = json.load(open(ap)); changed = False
        for town in towns_:
            k = town['slug'] + '.webp'; q = (A.get('pictures') or {}).get(k)
            if q and q.get('whole_ext') != EXT and os.path.exists(os.path.join(OUT, 'wide', town['slug'] + '.json')):
                q['at'][0] = q['at'][0] + EXT - int(q.get('whole_ext') or 0); q['whole_ext'] = EXT; changed = True
                print('  the arena\'s pit in', k, 'moved by', EXT, flush=True)
        if changed: json.dump(A, open(ap, 'w'), indent=1)


# ---- the upright frame, its ground continued south -----------------------------------------------------------------------
def render_tall(town, T4, quick=False, day_only=False):
    """the four layouts' render (tools/bohemia_four_layouts_tall_render_10_27_26.py render()), line for line, but the ground south
    of the plan is go_on(plan, 'south'), never np.flipud(plan)"""
    import bpy, mathutils
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    import bohemia_cook_every_town_tall_and_wide_10_26_26 as T
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F; RIG = NF.RIG; EXT4 = T4.EXT; SIDE = T4.SIDE
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    g0, rec = bands_of(V.plan, town, seed)
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = V.plan(town, rnd)
    assert np.array_equal(np.asarray(g), g0), 'the plan read twice must be the same plan'
    g2 = go_on(np.asarray(g), rec, 'south', seed + 6060, F)
    keep_m = EXT4 / (V.PPM * math.cos(math.radians(45.0))) + 3.0      # the 260 px under the town are 8.6 m of ground
    g2[int((keep_m + 2.0) / 60.0 * g2.shape[0]):, :] = F.ID['concrete']   # what the frame never sees (the rows far from the seam): bare slab, no stones (memory)
    T4.LOT[0] = 0
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = V.Town(bpy, P, rnd)
    V.layout(town, pl, K)
    filled = V.fill(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    gone = T4.clear_corners(bpy, pl, town)
    outlines = pl.outlines()
    # the ground after the town (render_wide says why); the same ground from the same seeds
    objs, gg = F.build(bpy, g, 2020 + seed, quick)
    objs2, _ = F.build(bpy, g2, 3030 + seed, quick)
    trim(bpy, objs2, lambda x, y: y > 60.0 - keep_m)
    SIDE_M = float(getattr(NF.F, 'SIDE', 60.0))
    for o in objs2:
        if o.parent is None: o.location.y -= SIDE_M
    objs = objs + objs2
    F.scene(bpy, objs)
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o not in objs]
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, seed % 5); RIG.dent_pass(meshes, 1.0)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, zs)
    for o in bpy.context.scene.objects:
        if o.parent is None and o not in objs and o is not stretch and o.type in ('MESH', 'EMPTY'): o.parent = stretch
    NF.LEDGER['fires'] = NF.LEDGER.get('fires', []) + [(x, y, r) for (x, y, r) in pl.fires]
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = False
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = V.PW / V.PPM
    cd.shift_y = -(EXT4 / 2.0) / V.PW
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(float(RIG.G['tilt_deg'])); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((30.0, 30.0, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - dvec * 80; cd.clip_end = 400
    sc.render.resolution_x, sc.render.resolution_y = V.PW, V.PH + EXT4; sc.render.resolution_percentage = 25 if quick else 100
    sc.cycles.samples = 8 if quick else 16; sc.cycles.use_denoising = True; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    od = os.path.join(OUT, 'quick' if quick else 'tall'); os.makedirs(od, exist_ok=True)
    # ONLY THE GROUND THAT CHANGED IS DRAWN AGAIN: everything north of the plan's south edge is the same scene at the same pixels as the
    # four layouts' drawing (the same seed, plan, layout, fill, corner and light), so the frame is rendered from row CUT_FROM down and
    # pasted under the shipped drawing from row PASTE_AT (2 m inside the plan's own ground, past the denoiser's edge), unless --full
    crop = not quick and '--full' not in sys.argv
    if crop:
        sc.render.use_border = True; sc.render.use_crop_to_border = False
        sc.render.border_min_x, sc.render.border_max_x = 0.0, 1.0
        sc.render.border_min_y, sc.render.border_max_y = 0.0, (V.PH + EXT4 - CUT_FROM) / float(V.PH + EXT4)
    day = os.path.join(od, town['slug'] + '_' + SIDE + '.png'); sc.render.filepath = day
    bpy.ops.render.render(write_still=True)
    night = None
    if not day_only:
        sun.data.energy *= 0.045; sun.data.color = (0.55, 0.66, 1.0)
        bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value; bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.08
        for m in K.night_win: m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 2.4
        for (x, y, h) in pl.lamps:
            L_ = bpy.data.lights.new('lamp', 'POINT'); L_.energy = 1600 if h < 5 else 3200; L_.color = (1.0, 0.62, 0.28); L_.shadow_soft_size = 0.3
            o = bpy.data.objects.new('lamp_light', L_); sc.collection.objects.link(o); o.location = (x, y, min(h, 8.0) * zs)
        for (x, y, r) in pl.fires:
            L_ = bpy.data.lights.new('fire', 'POINT'); L_.energy = 900; L_.color = (1.0, 0.5, 0.18); L_.shadow_soft_size = 0.4
            o = bpy.data.objects.new('fire_light', L_); sc.collection.objects.link(o); o.location = (x, y, 1.6 * zs)
        night = os.path.join(od, town['slug'] + '_' + SIDE + '_night.png'); sc.render.filepath = night; bpy.ops.render.render(write_still=True)
    pasted = None
    if crop:
        pasted = []
        for p, sfx in ((day, ''), (night, '_night')):
            if p and os.path.exists(p): pasted.append(paste_under(p, os.path.join(V.SHIP, town['slug'] + '_tall_' + SIDE + sfx + '.webp')))
    T._orig_render_dump(dict(name=town['name'], tier=town['tier'], stands=town['stands'], trade=town['trade'], lamps=pl.lamps, fires=pl.fires, pasted=pasted,
                             outlines=outlines, filled=filled, seed=seed, boxes=T._LAST.get('boxes'), comp='tall', px=[V.PW, V.PH + EXT4], cleared=gone,
                             taps_in_pad=list(T4.TAPS_IN_PAD), lot_cells=0, moved=list(T4.MOVED), landmark_in_pad=list(T4.STUCK),
                             ground_south='continued (rule 383), never mirrored', bands=len(rec)),
                        open(os.path.join(od, town['slug'] + '_' + SIDE + '.json'), 'w'), indent=0)
    return day, night


CUT_FROM = 1640                 # the row the upright strip is rendered from (the plan's south edge is row 1820)
PASTE_AT = 1760                 # the row it is pasted from: 2 m inside the plan's own ground, 120 rows past the render's edge


def paste_under(png, shipped):
    """the shipped upright drawing above PASTE_AT, this render below it (the same scene at the same pixels): one picture. Returns
    what the self-check measured at the old seam (row 1820): the band below against the band above flipped, and straight"""
    from PIL import Image
    new = np.asarray(Image.open(png).convert('RGB')).copy()
    old = np.asarray(Image.open(shipped).convert('RGB'))
    assert old.shape == new.shape, (old.shape, new.shape)
    out = old.copy(); out[PASTE_AT:] = new[PASTE_AT:]
    # the join: the two must agree where both are the same scene (rows PASTE_AT-40..PASTE_AT), or the paste would show
    jd = float(np.abs(old[PASTE_AT - 40:PASTE_AT].astype(np.float32) - new[PASTE_AT - 40:PASTE_AT].astype(np.float32)).mean())
    Image.fromarray(out).save(png)
    g = out.mean(axis=2)
    flip, straight = mirrored_rows(g, 1820)
    return {'png': os.path.basename(png), 'join_diff': round(jd, 2), 'seam_flipped': round(flip, 2), 'seam_straight': round(straight, 2)}


def ship_tall(towns_, sides, T4):
    """the four layouts' own ship, reading this tool's renders; then each drawing's phone ground says its ground is continued"""
    T4.OUT4 = os.path.dirname(os.path.join(OUT, 'tall', 'x'))
    import shutil
    rd = os.path.join(OUT, 'tall'); r4 = os.path.join(T4.OUT4, 'render'); os.makedirs(r4, exist_ok=True)
    for town in towns_:
        for sd in sides:
            for suf in ('.png', '_night.png', '.json'):
                p = os.path.join(rd, town['slug'] + '_' + sd + suf)
                if os.path.exists(p): shutil.copy(p, os.path.join(r4, town['slug'] + '_' + sd + suf))
    okn = [(t, sd) for t in towns_ for sd in sides if os.path.exists(os.path.join(r4, t['slug'] + '_' + sd + '_night.png'))]
    T4.ship([t for t in towns_ if any(t is a for a, _ in okn)], sides)
    manp = os.path.join(R, 'slices/settlement_ground_towns/settlement_ground.json'); man = json.load(open(manp))
    for t, sd in okn:
        c = man['towns'][t['name']].get('tall_' + sd) or {}
        if c.get('phone_ground'): c['phone_ground']['ground'] = 'the town\'s own, continued south of the plan, never mirrored (rule 383, RUN FIVE 11/6)'
        c['whole'] = {'ground_south': 'continued', 'note': 'rule 383: one scene, the corner cleared of things only, the ground under the town continued'}
    json.dump(man, open(manp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--') and x not in ('left', 'right')]
    if MODE is None: raise SystemExit('--wide or --tall')
    if not os.environ.get('BOHEMIA_RENDER_NOLOCK'):     # ONE BLENDER AT A TIME (a deliberate second one, small, says so in the environment)
        import fcntl; _lock = open('/tmp/bohemia_cook_render_v2.lock', 'w'); fcntl.flock(_lock, fcntl.LOCK_EX)
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    TT = [t for t in V.towns() if not want or t['name'] in want or t['slug'] in want]
    if MODE == 'wide':
        import bohemia_cook_every_town_wide_relaid_10_26_26 as WR
        WR.patch_wide(); json.dump = WR._dumpw
        if '--ship-only' not in a:
            for town in list(TT):
                if '--skip-done' in a and os.path.exists(os.path.join(OUT, 'wide', town['slug'] + '.json')): print('  already drawn', town['name'], flush=True); continue
                WR._LASTW['town'] = town
                try: d, nn = render_wide(town, quick='--quick' in a, day_only='--day-only' in a); print('  rendered wide whole', town['name'], d, nn, flush=True)
                except WR.T.LayoutBad as ex: print('  NOT RENDERED', town['name'], str(ex), flush=True)
            WR._LASTW['town'] = None
        json.dump = WR._orig_dump
        if '--quick' not in a and '--no-ship' not in a: ship_wide(TT)
    else:
        import bohemia_cook_every_town_tall_and_wide_10_26_26 as T
        import bohemia_four_layouts_tall_render_10_27_26 as T4
        sides = ['left', 'right'] if '--side' not in a else [a[a.index('--side') + 1]]
        T.patch_tall(); V.Town = T._Hook
        if '--ship-only' not in a:
            for town in list(TT):
                for sd in sides:
                    if '--skip-done' in a and os.path.exists(os.path.join(OUT, 'tall', town['slug'] + '_' + sd + '.json')): print('  already drawn', town['name'], sd, flush=True); continue
                    T4.SIDE = sd; T._LAST['town'] = town
                    try: d, nn = render_tall(town, T4, quick='--quick' in a, day_only='--day-only' in a); print('  rendered tall whole', town['name'], sd, d, nn, flush=True)
                    except T.LayoutBad as ex: print('  NOT RENDERED', town['name'], sd, str(ex), flush=True)
            T._LAST['town'] = None
        if '--quick' not in a and '--no-ship' not in a: ship_tall(TT, sides, T4)
    sys.stdout.flush(); os._exit(0)
