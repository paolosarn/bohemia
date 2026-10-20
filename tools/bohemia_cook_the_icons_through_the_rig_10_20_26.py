#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], THE ITEM ICONS THROUGH THE RIG, SWAPPED STRAIGHT IN (10/20/26).
Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'; 'items and their icons'); rule 123: no card.
The market and the crew screen draw slices/market_icons/*.png: eighteen pack tiles copied as they were (RUN TWO 10/11,
SOURCES.txt), three of them the wrong thing (the 'rifle' is his suppressed pistol, the 'shotgun' his SMG, the 'spear' a
crowbar). Each is made here as the thing its name says, in real metres with flat palette colours, and rendered through
the master rig (tools/bohemia_direction_master_rig.py, imported, never edited: its source pass, dents, sun and post) with
the floor tool's grime, the item stood up on its diagonal the way an inventory shows a thing, the rig's own camera (45 degrees, heights at full
size); the guns are COOK's own (gun_pistol_a, gun_rifle_a, gun_shotgun_a, the rig's first guns, imported untouched).
Cut into the old icon's canvas (the same file, the same size), centred, the widest side at the old one's.

  <venv>/bin/python tools/bohemia_cook_the_icons_through_the_rig_10_20_26.py [w_axe ...]   (about 15 s an icon)

REFERENCE CHECK (the 9/4 standing duty): the old icons are the twins (their canvas, their fill); real things at real
sizes: a felling axe 0.9 m, a sledge 0.9 m, a machete 0.6 m, a meat cleaver 0.3 m, a Molotov in a 0.75 l bottle, a
spear of rebar on a pole 1.8 m, a one-gallon water jug, a can of beans, an ammunition box, a farrier's anvil on its
stump, a bench vise on its bench. No reference game.
REUSE CHECK (REUSE-FIRST): the props modeller's helpers (mat, box, cyl, rod, chunk), COOK's gun glbs, the master rig.
TASTE CHECK: the rig is the look (rule 115); a thing is what its name says.
"""
import os, sys, json, math, hashlib, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/market_icons')
OUT = os.path.join(R, 'records/target/cook_icons_rig')
MODELS = os.path.join(R, 'reference/models/bohemia')
VENV = '/home/user/v/bin/python'
BASE_SHA = 'c12f16127eb6424f5007babc0f0e6851daf51698'
GUNS = {'w_pistol': 'gun_pistol_a.glb', 'w_rifle': 'gun_rifle_a.glb', 'w_shotgun': 'gun_shotgun_a.glb'}
DIAG = {'b_smith': 0, 'b_armourer': 0, 's_food': 0, 's_meds': 0, 's_rounds': 0, 's_water': 0, 'w_pistol': 0, 'w_rifle': 0, 'w_shotgun': 0}   # these stand as they are; the rest lean 45


def build(name, bpy, P):
    """an icon is read at 96 px: a 2 cm haft is one pixel, so every rod is drawn 1.9 times its real thickness (the
    way his pack's icons draw a handle), lengths and heads at their real size"""
    import random
    rod0 = P.rod
    class _P: pass
    Q = _P(); Q.__dict__.update({k: getattr(P, k) for k in dir(P) if not k.startswith('__')})
    Q.rod = lambda bpy_, n, m, a, b, r, v=8: rod0(bpy_, n, m, a, b, r * 1.9, v)
    P = Q
    rnd = random.Random(sum(map(ord, name)))
    wood, steel, rust, dark = P.mat(bpy, 'wood', 'clay_bone', 1), P.mat(bpy, 'steel', 'tape_grey', 2), P.mat(bpy, 'rust', 'clay_rust', 1), P.mat(bpy, 'grip', 'rubber', 1)
    if name in GUNS:
        P.import_model(bpy, os.path.join(MODELS, GUNS[name]), (0, 0, 0), (0, 0, 0)); return
    if name == 'w_axe':
        P.rod(bpy, 'haft', wood, (0, 0, 0), (0, 0, 0.9), 0.02, 8)
        P.box(bpy, 'head', steel, (0.2, 0.04, 0.11), (0.06, 0, 0.84)); P.box(bpy, 'edge', P.mat(bpy, 'edge', 'tape_grey', 3), (0.02, 0.03, 0.15), (0.16, 0, 0.84))
    elif name == 'w_sledge':
        P.rod(bpy, 'haft', wood, (0, 0, 0), (0, 0, 0.9), 0.022, 8)
        P.box(bpy, 'head', steel, (0.26, 0.09, 0.09), (0, 0, 0.9), bevel=0.01)
    elif name == 'w_machete':
        P.box(bpy, 'grip', dark, (0.03, 0.025, 0.14), (0, 0, 0.07), bevel=0.006)
        P.box(bpy, 'blade', steel, (0.05, 0.004, 0.45), (0.005, 0, 0.37)); P.box(bpy, 'rust_patch', rust, (0.035, 0.006, 0.08), (0.01, 0, 0.3))
    elif name == 'w_cleaver':
        P.box(bpy, 'grip', wood, (0.028, 0.024, 0.12), (0, 0, 0.06), bevel=0.006)
        P.box(bpy, 'blade', steel, (0.1, 0.005, 0.18), (0.035, 0, 0.21))
    elif name == 'w_pipe':
        P.rod(bpy, 'pipe', P.mat(bpy, 'pipe', 'metal_painted', 1), (0, 0, 0), (0, 0, 0.62), 0.018, 10)
        P.cyl(bpy, 'elbow', steel, 0.028, 0.06, (0, 0, 0.64), verts=10); P.box(bpy, 'tape', dark, (0.04, 0.04, 0.12), (0, 0, 0.08))
    elif name == 'w_spear':
        P.rod(bpy, 'pole', wood, (0, 0, 0), (0, 0, 1.55), 0.018, 8)
        P.rod(bpy, 'rebar', rust, (0, 0, 1.45), (0, 0, 1.82), 0.008, 6)
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.02, depth=0.08, location=(0, 0, 1.85)); P.put(bpy, bpy.context.active_object, 'tip', steel, smooth=False)
        P.box(bpy, 'wire', P.mat(bpy, 'wire', 'tape_grey', 1), (0.03, 0.03, 0.1), (0, 0, 1.46))
    elif name == 'w_pole':
        P.rod(bpy, 'pole', P.mat(bpy, 'pole', 'metal_painted', 2), (0, 0, 0), (0, 0, 1.6), 0.016, 8)
        P.box(bpy, 'hook', rust, (0.12, 0.02, 0.02), (0.05, 0, 1.6))
    elif name == 'w_chain':
        P.rod(bpy, 'bat', wood, (0, 0, 0), (0, 0, 0.82), 0.03, 10)
        for k in range(9):                                     # a chain wound round the barrel
            P.cyl(bpy, 'link_%d' % k, steel, 0.038, 0.012, (0, 0, 0.45 + k * 0.04), (0, rnd.uniform(-0.3, 0.3), k * 0.7), verts=8, smooth=False)
    elif name == 'w_bottles':
        glass = P.mat(bpy, 'bottle', 'clay_mustard', 1)
        P.cyl(bpy, 'body', glass, 0.04, 0.2, (0, 0, 0.1), verts=12); P.cyl(bpy, 'neck', glass, 0.014, 0.08, (0, 0, 0.24), verts=8)
        P.box(bpy, 'rag', P.mat(bpy, 'rag', 'clay_bone', 3), (0.03, 0.02, 0.09), (0.012, 0, 0.31), (0, 0.4, 0))
    elif name == 's_food':
        tin = P.mat(bpy, 'tin', 'tape_grey', 2); lab = P.mat(bpy, 'label', 'clay_rust', 2)
        P.cyl(bpy, 'can', tin, 0.042, 0.11, (0, 0, 0.055), verts=16); P.cyl(bpy, 'label', lab, 0.0425, 0.07, (0, 0, 0.055), verts=16)
    elif name == 's_meds':
        bag = P.mat(bpy, 'bag', 'clay_bone', 1); cross = P.mat(bpy, 'cross', 'blood', 1)
        P.box(bpy, 'case', bag, (0.3, 0.12, 0.2), (0, 0, 0.1), bevel=0.02)
        P.box(bpy, 'cross_h', cross, (0.09, 0.004, 0.03), (0, -0.061, 0.11)); P.box(bpy, 'cross_v', cross, (0.03, 0.004, 0.09), (0, -0.061, 0.11))
        P.rod(bpy, 'handle', dark, (-0.06, 0, 0.2), (0.06, 0, 0.2), 0.01, 6)
    elif name == 's_rounds':
        brass = P.mat(bpy, 'brass', 'clay_mustard', 2)
        P.box(bpy, 'box', P.mat(bpy, 'ammo_can', 'metal_painted', 1), (0.12, 0.06, 0.05), (0, 0, 0.025), bevel=0.004)
        for k in range(5): P.cyl(bpy, 'round_%d' % k, brass, 0.0055, 0.06, (-0.04 + k * 0.02, 0, 0.08), verts=8)
    elif name == 's_water':
        jug = P.mat(bpy, 'jug', 'clay_teal', 3)
        P.box(bpy, 'jug', jug, (0.15, 0.15, 0.26), (0, 0, 0.13), bevel=0.03); P.cyl(bpy, 'cap', P.mat(bpy, 'cap', 'tape_grey', 3), 0.02, 0.03, (0.04, 0, 0.275), verts=10)
        P.box(bpy, 'handle', jug, (0.025, 0.05, 0.08), (-0.05, 0, 0.27))
    elif name == 'b_smith':
        P.cyl(bpy, 'stump', wood, 0.22, 0.5, (0, 0, 0.25), verts=12)
        P.box(bpy, 'anvil', P.mat(bpy, 'anvil', 'rubber', 2), (0.5, 0.14, 0.12), (0, 0, 0.62), bevel=0.01); P.box(bpy, 'waist', P.mat(bpy, 'anvil_b', 'rubber', 2), (0.16, 0.12, 0.1), (0, 0, 0.53))
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.06, depth=0.2, location=(-0.33, 0, 0.62), rotation=(0, math.radians(-90), 0)); P.put(bpy, bpy.context.active_object, 'horn', P.mat(bpy, 'horn', 'rubber', 2), smooth=False)
        P.rod(bpy, 'hammer', wood, (0.1, -0.05, 0.69), (0.35, -0.1, 0.72), 0.012, 6); P.box(bpy, 'hammer_head', steel, (0.04, 0.04, 0.09), (0.1, -0.05, 0.69))
    elif name == 'b_armourer':
        P.box(bpy, 'bench', wood, (0.9, 0.4, 0.06), (0, 0, 0.8)); [P.box(bpy, 'leg_%d' % i, wood, (0.06, 0.06, 0.78), (x, 0, 0.39)) for i, x in enumerate((-0.4, 0.4))]
        P.box(bpy, 'vise', P.mat(bpy, 'vise', 'clay_teal', 1), (0.18, 0.12, 0.12), (0.25, 0, 0.89), bevel=0.01); P.rod(bpy, 'vise_bar', steel, (0.25, -0.12, 0.88), (0.25, -0.2, 0.88), 0.008, 6)
        P.box(bpy, 'plate', P.mat(bpy, 'plate', 'tape_grey', 1), (0.3, 0.02, 0.36), (-0.15, 0.1, 1.0), (math.radians(-12), 0, 0.1), bevel=0.01)
    else:
        raise KeyError(name)


def model(name):
    import bpy
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(name, bpy, P)
    from PIL import Image
    ow, oh = Image.open(os.path.join(OUT, 'orig', name + '.png')).size
    lean = math.radians(DIAG.get(name, 40 if ow > oh * 0.6 else 0))      # a narrow frame takes the thing upright
    root = bpy.data.objects.new('lean', None); bpy.context.scene.collection.objects.link(root)
    for o in list(bpy.context.scene.objects):
        if o.parent is None and o is not root: o.parent = root
    root.rotation_euler = (0, lean, 0)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = os.path.join(OUT, 'models', name + '.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    json.dump(d, open(out[:-4] + '.json', 'w'))
    print('  model', name, d, flush=True)


def rig(name):
    from PIL import Image
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    glb = os.path.join(OUT, 'models', name + '.glb'); d = json.load(open(glb[:-4] + '.json'))
    old = Image.open(os.path.join(OUT, 'orig', name + '.png'))
    span_px = max(old.size) * 0.94
    L = max(d[0], d[1]); Hh = d[2]
    ppm = span_px / max(L, Hh * 1.05)
    out = os.path.join(OUT, name); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb, out, '--ppm', repr(ppm), '--no-calibration', '--no-id-pass', '--real-length', repr(L), '--no-shadow']
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=sum(map(ord, name)) % 97, bid=name)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post([stills[RIG.FACINGS.index('S')]], out, A, pop, shadow=False)
    json.dump(dict(model=os.path.relpath(glb, R), ppm=ppm, files=[os.path.relpath(o, R) for o in outs], box=box), open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print('  rig', name, outs[0], flush=True)


def cut(name):
    from PIL import Image
    old = Image.open(os.path.join(OUT, 'orig', name + '.png')).convert('RGBA'); W, H = old.size
    new = Image.open(os.path.join(OUT, name, 'rig_S.png')).convert('RGBA')
    bb = new.getbbox(); new = new.crop(bb)
    k = min((W - 2) / new.width, (H - 2) / new.height, 1.0)
    if k < 1.0: new = new.resize((max(1, round(new.width * k)), max(1, round(new.height * k))), Image.NEAREST)
    out = Image.new('RGBA', (W, H)); out.alpha_composite(new, ((W - new.width) // 2, (H - new.height) // 2))
    dst = os.path.join(SHIP, name + '.png'); out.save(dst, optimize=True)
    led = os.path.join(OUT, 'swapped.json'); L_ = json.load(open(led)) if os.path.exists(led) else {}
    L_[name] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), size=[W, H])
    json.dump(L_, open(led, 'w'), indent=1)
    print('  cut', name, (W, H), flush=True)


def names():
    return sorted(n[:-4] for n in os.listdir(os.path.join(OUT, 'orig')) if n.endswith('.png'))


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd = a[0] if a and a[0] in ('model', 'rig', 'cut') else 'all'
    want = [x for x in a if x not in ('model', 'rig', 'cut')]
    os.makedirs(os.path.join(OUT, 'orig'), exist_ok=True)
    for f in sorted(os.listdir(SHIP)):
        if f.endswith('.png') and not os.path.exists(os.path.join(OUT, 'orig', f)):
            open(os.path.join(OUT, 'orig', f), 'wb').write(subprocess.check_output(['git', 'show', '%s:slices/market_icons/%s' % (BASE_SHA, f)], cwd=R))
    if cmd == 'model': model(want[0])
    elif cmd == 'rig': rig(want[0])
    elif cmd == 'cut': [cut(n) for n in (want or names())]
    else:
        for n in (want or names()):
            for step in ('model', 'rig'):
                r = subprocess.run([VENV, os.path.abspath(__file__), step, n], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l)[-600:], flush=True)
            try: cut(n)
            except Exception as e: print('  cut failed', n, e, flush=True)
    sys.stdout.flush(); os._exit(0)
