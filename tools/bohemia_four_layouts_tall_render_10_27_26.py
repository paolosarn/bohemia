#!/usr/bin/env python3
"""BOHEMIA -- THE FOUR LAYOUTS, THE UPRIGHT TOWNS RE-DRAWN WITH THE PHONE'S OWN GROUND (the coordinator, rule 291, Paolo 10/27:
'the phone will be inside of the city right next to the building... full screen with no outskirt... without a single building
behind it... just plain ground... a little padding around it... I don't even wanna see buildings, I want it to look dedicated').

WHAT WAS WRONG: COOK's upright towns (tools/bohemia_cook_every_town_tall_and_wide_10_26_26.py, 1024 x 1820) end just under the bottom
row of shops, and the bottom corners hold the foreground (walls, the landmark, junk). Filled to an upright phone's width the bottom
row's doors stand right where the phone and its padding go, and whatever stands in the corners shows behind the phone.

WHAT THIS DRAWS: the same scene, the same camera and light, every thing at the same pixel (the picture's TOP is anchored, so every
tap, door and walk block the screen already reads stays true), drawn EXT pixels taller at the bottom (more of the town's own ground in
front of it), and every thing whose box falls in either bottom corner below the bottom row (the phone's ground, left or right, with
its padding) left out, its lamps and fires with it: plain ground there, nothing else. The taps' things are never in that zone (the
check refuses the town if one would be).

  <bvenv>/bin/python tools/bohemia_four_layouts_tall_render_10_27_26.py [Town ...] [--quick] [--day-only] [--no-ship] [--ship-only]
  -> records/target/cook_town_screens/tall4/render/<town>.png, _night.png, .json
  -> slices/settlement_ground_towns/<town>_tall.webp, _tall_night.webp (1024 x 1820+EXT), settlement_ground.json towns[name].tall
"""
import os, sys, json, math, hashlib, random
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_every_town_its_own_screen_10_25_26 as V
import bohemia_cook_every_town_tall_and_wide_10_26_26 as T

EXT = 260                      # px of the town's own ground added under the bottom row
PADTOP = 1262                  # below the bottom row's feet (1253) and its padding
PADX = 410                     # the phone and its padding at an upright phone's width (148 of 390 points at 0.381)
OUT4 = os.path.join(R, 'records/target/cook_town_screens/tall4')


SIDE = 'left'                  # the phone's side this drawing is for: only that corner is cleared, the other keeps its things
def in_pad(b):
    return b[3] > PADTOP and ((SIDE == 'left' and b[0] < PADX) or (SIDE == 'right' and b[2] > T.TW - PADX))


def thing_box(pl, root):
    objs = [o for o in root.children_recursive if o.type == 'MESH'] if hasattr(root, 'children_recursive') else []
    if not objs: return None
    lo, hi = pl._bounds(objs)
    if hi[0] < lo[0]: return None
    pts = [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (max(0.0, lo[2]), hi[2])]
    pp = [T.proj(x, y, z, V.PW, V.PH) for x, y, z in pts]
    return [min(p[0] for p in pp), min(p[1] for p in pp), max(p[0] for p in pp), max(p[1] for p in pp)]


def clear_corners(bpy, pl):
    """every thing standing in the phone's ground goes, with its children; its lamps and fires too"""
    gone = []
    for t in list(pl.things):
        name, root, walk = t
        b = thing_box(pl, root)
        if b is None or not in_pad(b): continue
        kids = list(root.children_recursive) if hasattr(root, 'children_recursive') else []
        for o in kids + [root]:
            if o in pl.meshes: pl.meshes.remove(o)
            if o in getattr(pl, 'roots', []): pl.roots.remove(o)
            try: bpy.data.objects.remove(o, do_unlink=True)
            except Exception: pass
        pl.things.remove(t); gone.append(name)
    keep = lambda x, y, z=0.0: not in_pad([T.proj(x, y, z, V.PW, V.PH)[0]] * 2 + [T.proj(x, y, z, V.PW, V.PH)[1]] * 2)
    pl.lamps[:] = [L for L in pl.lamps if keep(L[0], L[1])]
    pl.fires[:] = [f for f in pl.fires if keep(f[0], f[1])]
    return gone


def render(town, quick=False, day_only=False):
    """V.render's own steps (the 10/25 tool), the upright frame, the corners cleared, the frame drawn EXT taller at the bottom"""
    import bpy, mathutils
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F; RIG = NF.RIG
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = V.plan(town, rnd)
    objs, gg = F.build(bpy, g, 2020 + seed, quick)
    import numpy as np                                  # the ground goes on south past the plan's 60 m: the plan mirrored, laid on south of it,
    objs2, _ = F.build(bpy, np.flipud(g), 3030 + seed, True)   # so the seam is the same ground meeting itself
    SIDE_M = float(getattr(NF.F, 'SIDE', 60.0))
    for o in objs2:
        if o.parent is None: o.location.y -= SIDE_M
    objs = objs + objs2
    F.scene(bpy, objs)
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = V.Town(bpy, P, rnd)
    V.layout(town, pl, K)
    filled = V.fill(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    gone = clear_corners(bpy, pl)
    outlines = pl.outlines()
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
    cd.shift_y = -(EXT / 2.0) / V.PW                     # the top stays where it was; EXT more ground at the bottom
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(float(RIG.G['tilt_deg'])); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((30.0, 30.0, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - dvec * 80; cd.clip_end = 400
    sc.render.resolution_x, sc.render.resolution_y = V.PW, V.PH + EXT; sc.render.resolution_percentage = 25 if quick else 100
    sc.cycles.samples = 8 if quick else 16; sc.cycles.use_denoising = True; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    od = os.path.join(OUT4, 'quick' if quick else 'render'); os.makedirs(od, exist_ok=True)
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
    T._orig_render_dump(dict(name=town['name'], tier=town['tier'], stands=town['stands'], trade=town['trade'], lamps=pl.lamps, fires=pl.fires,
                             outlines=outlines, filled=filled, seed=seed, boxes=T._LAST.get('boxes'), comp='tall', px=[V.PW, V.PH + EXT], cleared=gone),
                        open(os.path.join(od, town['slug'] + '_' + SIDE + '.json'), 'w'), indent=0)
    return day, night


def night_from(town, sd, rd, key):
    """the night of a side's drawing without a second render: COOK's own night of the same scene (the top 1820 rows are the same
    things at the same pixels, its lamps and fires lit), and where this drawing differs from it (the phone's cleared corner and the
    ground added under the town) the day drawing sunk to that night's own ground, measured, feathered in"""
    from PIL import Image, ImageFilter
    import numpy as np
    s = town['slug']
    oldn = os.path.join(V.SHIP, s + '_tall_night.webp'); oldd = os.path.join(V.SHIP, s + '_tall.webp')
    day = np.asarray(Image.open(os.path.join(rd, key + '.png')).convert('RGB')).astype(np.float32)
    if not (os.path.exists(oldn) and os.path.exists(oldd)): return False
    on = np.asarray(Image.open(oldn).convert('RGB')).astype(np.float32); od = np.asarray(Image.open(oldd).convert('RGB')).astype(np.float32)
    Hh, Ww = day.shape[0], day.shape[1]
    # the night's own sinking of the ground, per channel: the open ground of the old pair (the bottom middle, under the bottom row)
    y0, y1, x0, x1 = 1300, 1800, 420, 600
    ratio = np.median(on[y0:y1, x0:x1].reshape(-1, 3) / np.maximum(od[y0:y1, x0:x1].reshape(-1, 3), 4.0), axis=0)
    if float(ratio.max()) > 0.35: ratio = np.array([0.168, 0.170, 0.205], np.float32)   # a fire or a lamp in the sample: the other towns' measured night ground
    sunk = np.clip(day * ratio[None, None, :], 0, 255)
    out = sunk.copy(); out[:on.shape[0], :on.shape[1]] = on
    # where the old night must not stand: the cleared corner (and everything under the old picture's foot)
    m = np.zeros((Hh, Ww), np.float32)
    if sd == 'left': m[PADTOP - 20:, :PADX + 20] = 1.0
    else: m[PADTOP - 20:, Ww - PADX - 20:] = 1.0
    m[on.shape[0]:, :] = 1.0
    mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    mm = (np.asarray(mi).astype(np.float32) / 255.0)[:, :, None]
    res = out * (1 - mm) + sunk * mm
    Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(os.path.join(rd, key + '_night.png'))
    print('  night made from COOK\'s night', key, 'ground sunk by', [round(float(x), 3) for x in ratio], flush=True)
    return True


def ship(towns_, sides):
    from PIL import Image
    SHIP = V.SHIP
    manp = os.path.join(SHIP, 'settlement_ground.json'); walkp = os.path.join(SHIP, 'settlement_walk.json')
    man = json.load(open(manp)); walk = json.load(open(walkp))
    for town in towns_:
        for sd in sides:
            s = town['slug']; rd = os.path.join(OUT4, 'render'); key = s + '_' + sd
            jp = os.path.join(rd, key + '.json')
            if not os.path.exists(jp): print('  not shipped (no render)', key); continue
            meta = json.load(open(jp))
            src = s + '_tall_' + sd + '.webp'; nsrc = s + '_tall_' + sd + '_night.webp'
            if not os.path.exists(os.path.join(rd, key + '_night.png')): night_from(town, sd, rd, key)
            have_night = os.path.exists(os.path.join(rd, key + '_night.png'))
            for suf, out in (('', src), ('_night', nsrc)):
                p = os.path.join(rd, key + suf + '.png')
                if not os.path.exists(p): continue
                a = Image.open(p).convert('RGB'); assert a.size == (T.TW, T.TH + EXT), a.size
                a.save(os.path.join(SHIP, out), quality=82, method=6)
            hot, boxes = T.taps_tall(town, meta)
            e = man['towns'].setdefault(town['name'], {})
            e['tall_' + sd] = dict(src=src, night_src=nsrc if have_night else src, px=[T.TW, T.TH + EXT], hotspots=hot, boxes=boxes,
                                   doors=T.doors_of(hot, boxes, town['tier']), entrance=T.entrance_of(town, T.TW, T.TH), zoom_max=T.ZOOM[town['tier']],
                                   phone_ground={'side': sd, 'top': PADTOP, 'width': PADX, 'note': 'rule 291: below top, within width of the phone side, plain ground'})
            bl = sorted({tuple(o['box']) for o in meta['outlines']})
            for out in (src, nsrc): walk['pictures'][out] = {'blocks': [list(b) for b in bl]}
            print('  shipped', key, len(bl), 'outlines, cleared', len(meta.get('cleared') or []), 'night' if have_night else 'day only', flush=True)
    json.dump(man, open(manp, 'w'), indent=1)
    json.dump(walk, open(walkp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--')]
    sides = ['left', 'right'] if '--side' not in a else [a[a.index('--side') + 1]]
    want = [x for x in want if x not in ('left', 'right')]
    TT = [t for t in V.towns() if not want or t['name'] in want or t['slug'] in want]
    T.patch_tall(); V.Town = T._Hook
    if '--ship-only' not in a:
        for town in list(TT):
            for sd in sides:
                if '--skip-done' in a and os.path.exists(os.path.join(OUT4, 'render', town['slug'] + '_' + sd + '.json')): print('  already drawn', town['name'], sd, flush=True); continue
                SIDE = sd; globals()['SIDE'] = sd
                T._LAST['town'] = town
                try: d, nn = render(town, quick='--quick' in a, day_only='--day-only' in a); print('  rendered tall4', town['name'], sd, d, nn, flush=True)
                except T.LayoutBad as ex: print('  NOT RENDERED', town['name'], sd, str(ex), flush=True)
        T._LAST['town'] = None
    if '--quick' not in a and '--no-ship' not in a: ship(TT, sides)
    sys.stdout.flush(); os._exit(0)
