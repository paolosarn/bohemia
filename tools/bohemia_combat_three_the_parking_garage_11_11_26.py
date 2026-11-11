#!/usr/bin/env python3
"""THE PARKING GARAGE'S PARKED CARS (COMBAT THREE 11/11/26; VAMILY rule 440(a), rule 416's list, ask row 539). The garage's floor, its
raised bay, ramps, rails, outer wall, columns, core and pay booths are COOK FIVE's finished kit (slices/fight_ground/garage/
garage_art.json, tools/bohemia_cook5_*). COOK FIVE's note for the board: 'Dead cars: your own cover cars, five to a row, 2.4 m apart.'
This tool makes them, the casino floor's recipe: models in real metres through the master rig with the 10/20 grime pass at the fight's
42.9 px a metre, his palette roles only; every car is the 10/20 rig's own dead sedan (reference/models/bohemia/wreck.glb), reused,
parked nose in, 2.7 m apart.
  cars_a    TWO DEAD CARS IN THEIR STALLS: one down on a bare rim, one with its boot open and what was in it on the floor.
  cars_b    A CAR ON BLOCKS, its wheels gone, and the next one stripped to the shell beside it; a stack of tyres.
  cars_c    A CAR SOMEBODY LIVES IN: a tarp over it, a chair beside it, water jugs, a candle on a crate, the next stall kept swept.
  <venv>/bin/python tools/bohemia_combat_three_the_parking_garage_11_11_26.py all [piece ...]     (BOHEMIA_BPY=<venv python with bpy 4.2>)
Writes slices/fight_ground/garage_cars/garage_<piece>.webp and prints each piece's size and foot (kept in garage.json 'sizes').
[bb] Battle Brothers fights only outdoors; a garage is our own swag (rule 416).
[analog horror] one car in the whole dark deck with towels in its windows and a chair set beside it, the stall next to it swept clean.
REFERENCE CHECK (the 9/4 standing duty): real Strip parking structures (the parking industry's 2.7 m stall); COOK FIVE's garage kit and
the casino floor's pieces beside these in the fight's own camera (the VOTE card).
REUSE CHECK (REUSE-FIRST): bohemia_cook_model_props (every primitive, the wreck's model, the tyres' model), the master rig, the
not-final grime. No new palette, no new camera.
"""
import os, sys, json, math, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground/garage_cars')   # COMBAT's own folder: slices/fight_ground/garage/ is COOK FIVE's kit, every picture in it named by its art file
DATA = os.path.join(R, 'slices/fight_ground/garage/garage.json')
OUT = os.path.join(R, 'records/target/cook_parking_garage')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
VENV = os.environ.get('BOHEMIA_BPY', '/home/user/v/bin/python')

# piece -> (seed, the facing the camera shows, real length m (its long side))
PIECES = {'cars_a': (301, 'S', 5.3), 'cars_b': (302, 'S', 5.3), 'cars_c': (303, 'S', 6.4)}
FLAT = set()


def glb_of(piece): return os.path.join(MODELS, 'garage_%s.glb' % piece)


def car(bpy, P, tag, x, y, nose_north, role, step, drop=(), lift=0.0, tilt=(0, 0)):
    """the wreck's own model (the 10/20 rig's dead sedan), parked nose in, its paint this car's own"""
    h = P.import_model(bpy, os.path.join(MODELS, 'wreck.glb'), (x, y, lift), (tilt[0], tilt[1], math.pi / 2 if nose_north else -math.pi / 2), drop=drop)
    for m in list(bpy.data.materials):
        base = m.name.split('.')[0]
        if base in ('paint_teal', 'paint_teal_low'):
            m.name = '%s_%s' % (base.replace('teal', 'car'), tag)
            c = P.lin(P.PAL[role]['ramp'][max(0, step - (1 if base.endswith('low') else 0))])
            m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = c
            m['palette_role'] = role; m['palette_step'] = step
    return h


def build(piece, bpy, P):
    import random
    rnd = random.Random(PIECES[piece][0])
    conc, conc_d = P.mat(bpy, 'concrete', 'tape_grey', 2), P.mat(bpy, 'concrete_dark', 'tape_grey', 1)
    steel, rust = P.mat(bpy, 'steel', 'tape_grey', 1), P.mat(bpy, 'rust', 'clay_rust', 1)
    stain, dark = P.mat(bpy, 'stain', 'clay_rust', 0), P.mat(bpy, 'dark', 'cloth_black', 1)
    paint_y, paint_w = P.mat(bpy, 'paint_yellow', 'clay_mustard', 2), P.mat(bpy, 'paint_white', 'tape_grey', 3)
    for m_ in (conc, conc_d, steel, rust, stain, dark, paint_y, paint_w): m_.use_fake_user = True   # an imported model's clean-up drops materials nobody wears yet
    if piece == 'cars_a':
        car(bpy, P, 'a', -1.35, 0.0, True, 'clay_teal', 2)
        car(bpy, P, 'b', 1.35, 0.15, False, 'clay_bone', 3)
        P.box(bpy, 'boot_lid', P.mat(bpy, 'boot_lid', 'clay_bone', 2), (W_CAR * 0.84, 1.0, 0.03), (1.35, 2.25, 1.25), (math.radians(-55), 0, 0))   # the boot stands open: somebody went through it
        for k in range(4): P.chunk(bpy, 'spill_%d' % k, P.mat(bpy, 'spill_%d' % k, ('clay_mustard', 'cloth_black', 'tape_masking')[k % 3], 1), (rnd.uniform(0.25, 0.5), rnd.uniform(0.2, 0.35), rnd.uniform(0.08, 0.2)), (1.35 + rnd.uniform(-0.6, 0.6), 2.9 + rnd.uniform(0, 0.5), 0.08), (0, 0, rnd.uniform(0, 6)), rnd)
        return
    if piece == 'cars_b':
        car(bpy, P, 'a', -1.35, 0.0, True, 'clay_rust', 2, drop=('tyre', 'hub', 'rim'), lift=0.12)     # on blocks, every wheel gone
        for (dx, dy) in ((-0.6, -1.42), (0.6, -1.42), (-0.6, 1.42), (0.6, 1.42)):
            P.box(bpy, 'block_%g_%g' % (dx, dy), conc_d, (0.4, 0.2, 0.2), (-1.35 + dx, dy, 0.1)); P.box(bpy, 'block2_%g_%g' % (dx, dy), conc, (0.2, 0.4, 0.2), (-1.35 + dx, dy, 0.3))
        car(bpy, P, 'b', 1.35, -0.1, True, 'tape_grey', 1, drop=('window', 'screen', 'bonnet', 'lamp'))   # stripped: no glass, no bonnet, no lamps
        P.import_model(bpy, os.path.join(MODELS, 'tyres.glb'), (2.9, 1.6, 0), (0, 0, 0.7))
        return
    if piece == 'cars_c':
        car(bpy, P, 'a', -1.6, 0.0, True, 'metal_painted', 2)
        tarp = P.mat(bpy, 'tarp', 'clay_teal', 1)
        P.box(bpy, 'tarp_top', tarp, (1.95, 4.2, 0.04), (-1.6, -0.1, 1.33), (0, math.radians(2), 0), bevel=0.015)
        P.box(bpy, 'tarp_side', tarp, (0.04, 4.0, 0.75), (-0.6, -0.1, 0.95), (0, math.radians(-9), 0))
        P.box(bpy, 'tarp_tail', tarp, (1.9, 0.04, 0.6), (-1.6, -2.2, 1.0), (math.radians(12), 0, 0))
        for k in range(3): P.rod(bpy, 'cord_%d' % k, P.mat(bpy, 'cord_%d' % k, 'clay_bone', 1), (-0.6, -1.6 + k * 1.5, 0.6), (-0.2, -1.6 + k * 1.5, 0.0), 0.01, 5)
        chair = P.mat(bpy, 'chair', 'clay_rust', 2)
        P.box(bpy, 'seat', chair, (0.5, 0.5, 0.05), (0.6, -0.4, 0.42)); P.box(bpy, 'back', chair, (0.05, 0.5, 0.45), (0.86, -0.4, 0.65))
        for (dx, dy) in ((-0.22, -0.22), (0.22, -0.22), (-0.22, 0.22), (0.22, 0.22)): P.rod(bpy, 'leg_%g_%g' % (dx, dy), steel, (0.6 + dx, -0.4 + dy, 0), (0.6 + dx, -0.4 + dy, 0.42), 0.015, 5)
        for k in range(4): P.cyl(bpy, 'jug_%d' % k, P.mat(bpy, 'jug_%d' % k, 'glass_eye', 1), 0.13, 0.35, (0.3 + k * 0.3, 0.7, 0.175))
        P.box(bpy, 'crate', P.mat(bpy, 'crate', 'clay_bone', 2), (0.5, 0.4, 0.4), (1.3, -0.5, 0.2))
        P.cyl(bpy, 'candle', P.mat(bpy, 'candle', 'sodium', 3, glow=2.0), 0.05, 0.12, (1.3, -0.5, 0.46))
        P.box(bpy, 'mat', P.mat(bpy, 'cardboard', 'clay_mustard', 1), (2.2, 1.6, 0.02), (1.6, 0.9, 0.01))   # the swept stall, a flattened box laid in it
        P.box(bpy, 'broom', P.mat(bpy, 'broom', 'tape_masking', 2), (0.04, 0.04, 1.3), (2.6, 1.7, 0.65), (math.radians(12), 0, 0))
        return
    raise KeyError(piece)


W_CAR = 1.78


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
    dst = os.path.join(SHIP, 'garage_%s.webp' % piece)
    pic.save(dst, quality=88, method=6)
    rec = dict(piece=piece, src='garage_cars/garage_%s.webp' % piece, w=pic.width, h=pic.height, facing=f,
               foot=[round((bbb[0] + bbb[2]) / 2 - bb[0], 1), round(bbb[3] - bb[1], 1)], model=os.path.relpath(glb_of(piece), R))
    led = DATA                                       # COMBAT's own data: the cars' sizes live in its 'sizes' (sizes.json is COOK FIVE's kit)
    if os.path.exists(led):
        D = json.load(open(led)); D.setdefault('sizes', {})[piece] = rec; json.dump(D, open(led, 'w'), indent=1)
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
