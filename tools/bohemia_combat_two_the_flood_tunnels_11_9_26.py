#!/usr/bin/env python3
"""THE FLOOD TUNNELS: THE SECOND BIG INTERIOR (COMBAT TWO 11/9/26; VAMILY rule 440(a), rule 416's list, ask line 539; the
coordinator: 'a long chain of house-sized culvert tiles, camps on the walls, the street's light through the grates, dark unless lit,
the flash flood as the event; a fight at a wash or a drain mouth can use it'). The casino floor's recipe
(tools/bohemia_combat_two_the_casino_floor_11_8_26.py): each piece the tunnels had none of is a model in real metres through the master
rig with the 10/20 grime pass at the fight's 42.9 px a metre, his palette roles only; what exists is reused untouched (the wash's own
concrete channel for the floor, the landfill's gravel for the fill round the culverts, the shopping cart, the tyres, the sacks, the
oil drum's fire).
  wall_ew   A CULVERT WALL CUT AWAY, east to west: 12 m of cast concrete 0.5 m thick, cut at 1.8 m so the camera sees in; the cut shows
            the rebar and the aggregate; a waterline and a tag on its face.
  wall_ns   the same wall north to south.
  ladder    THE GRATE'S LADDER: steel rungs up the wall to the street grate (the light through it falls on the floor).
  mouth     THE DRAIN'S MOUTH: the trash rack across the culvert's end, north to south (the main channel runs east to west), two of
            its bars pried apart (the way in from the wash); trash caught on the bars. Drawn on the mouth's own tile.
  rack      the same rack whole, on the channel's other tiles at its end (11/9: the first mouth was drawn east to west, along the
            channel instead of across it).
  camp_a    A CAMP ON THE WALL: a mattress on pallets, blankets, a shopping cart of bags, a crate for a table, a candle jar.
  camp_b    A LEAN-TO: a tarp on a cord along the wall, a camp chair, water jugs, a bucket.
  jam       THE FLOOD'S JAM: what the last flash flood left: a shopping cart on its side, branches, a tyre, a mattress folded on them.
  <venv>/bin/python tools/bohemia_combat_two_the_flood_tunnels_11_9_26.py all [piece ...]
[bb] Battle Brothers fights only outdoors; under the city is our own swag (rule 416).
[analog horror] a candle in a jar still burning on a crate in a camp nobody is in, a hundred metres into the dark.
"""
import os, sys, json, math, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground/tunnels')
OUT = os.path.join(R, 'records/target/cook_flood_tunnels')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
VENV = os.environ.get('BOHEMIA_BPY', '/home/user/v/bin/python')

# piece -> (seed, the facing the camera shows, real length m (its long side))
PIECES = {
    'wall_ew': (201, 'S', 12.0), 'wall_ns': (202, 'S', 12.0), 'ladder': (203, 'S', 1.14), 'mouth': (204, 'S', 12.0), 'rack': (208, 'S', 12.0),
    'camp_a': (205, 'S', 4.0), 'camp_b': (206, 'S', 4.8), 'jam': (207, 'S', 4.4),   # each its long side as built, in metres
}
FLAT = {'wall_ew', 'wall_ns', 'ladder', 'mouth', 'rack'}   # built into the culvert: no contact shadow of their own


def glb_of(piece): return os.path.join(MODELS, 'tunnel_%s.glb' % piece)


def build(piece, bpy, P):
    import random
    rnd = random.Random(PIECES[piece][0])
    conc, dark = P.mat(bpy, 'concrete', 'tape_grey', 2), P.mat(bpy, 'dark', 'cloth_black', 2)
    steel, rust = P.mat(bpy, 'steel', 'tape_grey', 1), P.mat(bpy, 'rust', 'clay_rust', 1)
    stain = P.mat(bpy, 'waterline', 'clay_rust', 0)
    if piece in ('wall_ew', 'wall_ns'):
        L = 12.0
        P.box(bpy, 'wall', conc, (L, 0.5, 1.8), (0, 0, 0.9))
        P.box(bpy, 'cut', P.mat(bpy, 'aggregate', 'tape_grey', 3), (L, 0.5, 0.03), (0, 0, 1.815))
        for k in range(int(L / 0.4)):                                   # the rebar in the cut
            x = -L / 2 + 0.2 + k * 0.4
            P.rod(bpy, 'rebar_%d' % k, rust, (x, -0.12, 1.78), (x + rnd.uniform(-0.05, 0.05), -0.12, 1.83 + rnd.uniform(0, 0.12)), 0.012, 5)
        P.box(bpy, 'waterline', stain, (L, 0.01, 0.35), (0, -0.255, 0.45))
        P.box(bpy, 'tag', P.mat(bpy, 'tag', 'clay_teal', 2), (rnd.uniform(1.2, 2.4), 0.008, 0.5), (rnd.uniform(-3, 3), -0.256, 1.1))
        if piece == 'wall_ns':
            for o in list(bpy.context.scene.objects): o.rotation_euler[2] += math.pi / 2; o.location.x, o.location.y = -o.location.y, o.location.x
        return
    if piece == 'ladder':
        for x in (-0.25, 0.25): P.rod(bpy, 'rail_%g' % x, steel, (x, 0.0, 0.0), (x, 0.0, 1.8), 0.025, 6)
        for k in range(6): P.rod(bpy, 'rung_%d' % k, rust, (-0.25, -0.02, 0.25 + k * 0.28), (0.25, -0.02, 0.25 + k * 0.28), 0.018, 6)
        P.box(bpy, 'grate', steel, (1.0, 1.0, 0.05), (0, 0.6, 1.82))
        for k in range(7): P.box(bpy, 'bar_%d' % k, dark, (0.04, 1.0, 0.06), (-0.45 + k * 0.15, 0.6, 1.85))
        return
    if piece in ('mouth', 'rack'):
        """built east to west, then turned north to south like wall_ns: the rack stands across the channel's end"""
        P.box(bpy, 'sill', conc, (12.0, 0.6, 0.25), (0, 0, 0.125))
        P.box(bpy, 'rail', rust, (12.0, 0.08, 0.08), (0, 0, 1.76))
        for k in range(24):
            x = -5.75 + k * 0.5
            if piece == 'mouth' and k in (11, 12):                       # pried apart, one each way: the way in
                s = -1 if k == 11 else 1
                P.rod(bpy, 'bent_%d' % k, steel, (x, 0, 0.25), (x + s * 0.7, -0.15, 1.2), 0.03, 6)
                P.rod(bpy, 'bent_top_%d' % k, steel, (x + s * 0.7, -0.15, 1.2), (x, 0, 1.76), 0.03, 6)
                continue
            P.rod(bpy, 'bar_%d' % k, rust if k % 3 else steel, (x, 0, 0.25), (x, 0, 1.76), 0.03, 6)
        for k in range(7):                                               # what the water left on the bars
            x = rnd.uniform(-5.5, 5.5)
            if piece == 'mouth' and abs(x) < 1.0: x += 2.0 * (1 if x >= 0 else -1)
            P.chunk(bpy, 'trash_%d' % k, P.mat(bpy, 'trash_%d' % k, ('clay_bone', 'cloth_black', 'clay_mustard')[k % 3], 1), (rnd.uniform(0.3, 0.7), 0.25, rnd.uniform(0.15, 0.5)), (x, -0.25, 0.4 + rnd.uniform(0, 0.4)), (0, 0, rnd.uniform(0, 6)), rnd)
        for o in list(bpy.context.scene.objects): o.rotation_euler[2] += math.pi / 2; o.location.x, o.location.y = -o.location.y, o.location.x
        return
    if piece == 'camp_a':
        pal = P.mat(bpy, 'pallet', 'clay_bone', 2)
        for k in range(2): P.box(bpy, 'pallet_%d' % k, pal, (1.2, 1.0, 0.14), (-1.2 + k * 1.2, 0.4, 0.07))
        P.box(bpy, 'mattress', P.mat(bpy, 'ticking', 'clay_bone', 3), (2.0, 1.4, 0.22), (-0.6, 0.4, 0.25), bevel=0.05)
        P.box(bpy, 'blanket', P.mat(bpy, 'blanket', 'clay_teal', 1), (1.3, 1.45, 0.06), (-0.2, 0.4, 0.39), (0, 0.06, 0.1), bevel=0.03)
        P.import_model(bpy, os.path.join(MODELS, 'cart.glb'), (1.6, -0.2, 0), (0, 0, 0.4))
        for k in range(3): P.sack(bpy, 'bag_%d' % k, P.mat(bpy, 'bag_%d' % k, 'cloth_black', 1 + k % 2), (0.45, 0.35, 0.35), (1.55 + rnd.uniform(-0.2, 0.2), -0.2 + rnd.uniform(-0.15, 0.15), 0.85 + k * 0.1), (0, 0, rnd.uniform(0, 3)), rnd)
        P.box(bpy, 'crate', pal, (0.5, 0.4, 0.4), (0.6, -0.8, 0.2))
        P.cyl(bpy, 'candle', P.mat(bpy, 'candle', 'sodium', 3, glow=2.0), 0.05, 0.12, (0.6, -0.8, 0.46))
        return
    if piece == 'camp_b':
        tarp = P.mat(bpy, 'tarp', 'clay_teal', 2)
        P.rod(bpy, 'cord', P.mat(bpy, 'cord', 'clay_bone', 1), (-2.4, 0.8, 1.5), (2.4, 0.8, 1.5), 0.01, 5)
        P.box(bpy, 'tarp', tarp, (4.6, 1.8, 0.02), (0, 0.0, 0.8), (math.radians(-55), 0, 0))
        P.box(bpy, 'floor', P.mat(bpy, 'cardboard', 'clay_mustard', 1), (4.0, 1.4, 0.02), (0, 0.1, 0.01))
        chair = P.mat(bpy, 'chair', 'clay_rust', 2)
        P.box(bpy, 'seat', chair, (0.5, 0.5, 0.05), (1.6, -1.1, 0.42)); P.box(bpy, 'back', chair, (0.5, 0.05, 0.45), (1.6, -0.86, 0.65))
        for (dx, dy) in ((-0.22, -0.22), (0.22, -0.22), (-0.22, 0.22), (0.22, 0.22)): P.rod(bpy, 'leg_%g_%g' % (dx, dy), steel, (1.6 + dx, -1.1 + dy, 0), (1.6 + dx, -1.1 + dy, 0.42), 0.015, 5)
        for k in range(3): P.cyl(bpy, 'jug_%d' % k, P.mat(bpy, 'jug_%d' % k, 'glass_eye', 1), 0.13, 0.35, (-1.8 + k * 0.3, -0.9, 0.175))
        P.cyl(bpy, 'bucket', P.mat(bpy, 'bucket', 'clay_mustard', 2), 0.18, 0.3, (-0.6, -1.0, 0.15))
        return
    if piece == 'jam':
        P.import_model(bpy, os.path.join(MODELS, 'cart.glb'), (-1.0, 0.0, 0.25), (math.radians(90), 0, 0.6))
        wood = P.mat(bpy, 'branch', 'clay_rust', 0)
        for k in range(7): P.rod(bpy, 'branch_%d' % k, wood, (rnd.uniform(-2.5, 1.5), rnd.uniform(-0.8, 0.8), 0.1), (rnd.uniform(-1.5, 2.5), rnd.uniform(-0.8, 0.8), rnd.uniform(0.2, 0.9)), rnd.uniform(0.04, 0.09), 6)
        P.import_model(bpy, os.path.join(MODELS, 'tyres.glb'), (1.5, 0.4, 0), (0, 0, 0.3))
        P.box(bpy, 'mattress', P.mat(bpy, 'ticking', 'clay_bone', 1), (1.8, 1.2, 0.18), (0.4, -0.3, 0.75), (0.3, 0.5, 0.2), bevel=0.04)
        return
    raise KeyError(piece)


def model(piece):
    import bpy
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(piece, bpy, P)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    os.makedirs(MODELS, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=glb_of(piece), export_format='GLB', use_selection=False)
    print('  model', piece, d, '->', os.path.relpath(glb_of(piece), R), flush=True)


def rig(piece):
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    out = os.path.join(OUT, piece); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb_of(piece), out, '--ppm', repr(PPM), '--no-calibration', '--no-id-pass', '--seed', str(PIECES[piece][0]), '--real-length', str(PIECES[piece][2])] + (['--no-shadow'] if piece in FLAT else [])
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=PIECES[piece][0] % 97, bid=piece)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post(list(stills), out, A, pop, shadow=A['shadow'])
    meta.update(model=os.path.relpath(glb_of(piece), R), ppm=A['ppm'], files=[os.path.relpath(o, R) for o in outs], crop_box_px=box, grime=NF.LEDGER.get('grime'))
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1, default=str)
    print('  rig', piece, 'box', box, flush=True)


def cut(piece):
    """the body over its contact shadow, trimmed to what it shows; its foot (the middle of its bottom edge) recorded"""
    from PIL import Image
    f = PIECES[piece][1]
    body = Image.open(os.path.join(OUT, piece, 'rig_%s.png' % f)).convert('RGBA')
    shp = os.path.join(OUT, piece, 'shadow_%s.png' % f)
    layer = Image.open(shp).convert('RGBA') if os.path.exists(shp) and piece not in FLAT else Image.new('RGBA', body.size)
    layer.alpha_composite(body)
    bb = layer.getbbox(); pic = layer.crop(bb)
    bbb = body.getbbox()
    os.makedirs(SHIP, exist_ok=True)
    dst = os.path.join(SHIP, 'tunnel_%s.webp' % piece)
    pic.save(dst, quality=88, method=6)
    rec = dict(piece=piece, src='tunnels/tunnel_%s.webp' % piece, w=pic.width, h=pic.height, facing=f,
               foot=[round((bbb[0] + bbb[2]) / 2 - bb[0], 1), round(bbb[3] - bb[1], 1)], model=os.path.relpath(glb_of(piece), R))
    led = os.path.join(SHIP, 'sizes.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[piece] = rec; json.dump(L, open(led, 'w'), indent=1)
    print('  cut', piece, rec, flush=True)


def sub(cmd, piece):
    r = subprocess.run([VENV, os.path.abspath(__file__), cmd, piece], cwd=R, capture_output=True, text=True)
    lines = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l]
    print('\n'.join(lines[-8:]), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'model': model(names[0])
    elif cmd == 'rig': rig(names[0])
    elif cmd == 'cut':
        for p in names or list(PIECES): cut(p)
    elif cmd == 'all':
        for p in names or list(PIECES):
            sub('model', p); sub('rig', p)
            try: cut(p)
            except Exception as e: print('  cut failed', p, e, flush=True)
    sys.stdout.flush(); os._exit(0)
