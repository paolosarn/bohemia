#!/usr/bin/env python3
"""BOHEMIA -- ECONOMY TWO [the battery is real] (rule 459, ask line 645; 11/18/26). THE LADDER'S FOUR PICTURES.

Paolo 11/17: 'I want people to really feel like they can look at their battery right now and relate it from the game to
real life.' Paolo 9/4: 'for one AA battery a bag of rice.' The table (records/target/bb/battery_table.json) pays a big sum
in BIG batteries a crew could carry, each shown as the THING it is: an AA, a phone's battery, a tool pack, a car's battery.

MEASURED FIRST: the bar's battery (slices/supply_icons/batteries.png) is three D cells (DIRECTION 11/2, 34 x 61 mm each): a
pile, not his unit, and nothing in the game drew a phone's battery, a tool pack or a car's battery (the pack's one car
battery, reference/art_bank/prop/pack_11_survival_props_044.png, is another painter's light: rule 115, the rig is the source).

THE METHOD IS DIRECTION'S (tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py, rule 115): each picture is a small
model in real metres, written as a glTF and put through DIRECTION's master rig (one sun, the source pass's wear, the snap
toward his prop family), rendered at three times the icon and cut down with a real filter, one dark pixel round the
silhouette. This tool only adds four models and its own ship paths; the rig call and the cut are DIRECTION's, line for line.

REAL THINGS AT REAL SIZES (the reference check, the 9/4 standing duty):
  aa             one AA cell, 14.5 mm across, 50.5 mm long (IEC LR6 / HR6), lying on its side at the three-quarter turn
  phone_battery  a phone's lithium pack, 46 x 72 x 6 mm (a sealed pack out of a cracked phone, drawn a little thick so it
                 reads), its label and its flex tail with the plug, stood on its short edge and leaned back
  tool_pack      an 18 V slide-on drill pack, 115 x 75 x 62 mm: the fat cell box, the narrower rail deck on top, the red
                 release button, the gauge lights
  car_battery    a group 24 12-volt lead-acid battery, 260 x 173 x 205 mm: the black case, the bone lid with its six vent
                 caps, the two lead posts (the plus capped red), the rope handle
The twins: the bar's own cells (DIRECTION's 'batteries', the same black body and gold top third) and the pack tile above.
REUSE CHECK (REUSE-FIRST): the props modeller's helpers (bohemia_cook_model_props: mat, box, cyl, rod, dims), COOK's lathe
(bohemia_cook_the_icons_through_the_rig_10_20_26), the master rig through the floor tool's loader, DIRECTION's cut: unedited.
TASTE CHECK: a thing is what its name says; four silhouettes that read alone at 14 points: a stick, a card, a brick, a box.

  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_economy_two_the_ladder_through_the_rig_11_18_26.py [name ...]
     (bpy 4.2 on python3.11: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy)
  python3 tools/bohemia_economy_two_the_ladder_through_the_rig_11_18_26.py cut [name ...]        the cut only

SHIPS: slices/battery_ladder/<k>.png (96 high, trimmed to the thing) and slices/battery_ladder/small/<k>.png (30 x 30, the
mark beside a count), and the ledger records/target/economy_two_ladder_rig/swapped.json (a sha1 per shipped file).
"""
import os, sys, json, math, hashlib, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/economy_two_ladder_rig')
SHIP = os.path.join(R, 'slices/battery_ladder')
VENV = os.environ.get('BOHEMIA_BPY', '/tmp/v/bin/python')
UP = 3
LADDER = ['aa', 'phone_battery', 'tool_pack', 'car_battery']
FACE = {'aa': 'SE', 'phone_battery': 'S', 'tool_pack': 'SE', 'car_battery': 'S'}   # the car's battery reads front-on (the wide case, both posts, the handle); the phone's pack too (its label to the light)


def build(n, bpy, P, IC):
    M = lambda nm, role, step: P.mat(bpy, nm, role, step)
    black, gold, chrome = M('black', 'rubber', 2), M('gold', 'clay_mustard', 3), M('chrome', 'chrome', 1)
    bone, red, steel, dark = M('bone', 'clay_bone', 4), M('red', 'blood', 1), M('steel', 'tape_grey', 2), M('dark', 'rubber', 1)

    if n == 'aa':
        # one AA on its side, turned a little so the gold end and the nub show: the bar's own cell, at an AA's real size
        r, h = 0.00725, 0.0505
        parts = [IC.lathe(bpy, 'cell', black, [(0, 0), (r * 0.9, 0), (r, 0.0015), (r, h * 0.62), (0, h * 0.62)], n=20),
                 IC.lathe(bpy, 'top', gold, [(0, h * 0.62), (r, h * 0.62), (r, h * 0.975), (r * 0.9, h * 0.99), (0, h * 0.99)], n=20),
                 IC.lathe(bpy, 'nub', chrome, [(0, h * 0.99), (r * 0.38, h * 0.99), (r * 0.38, h + 0.0012), (0, h + 0.0014)], n=14)]
        root = bpy.data.objects.new('aaroot', None); bpy.context.scene.collection.objects.link(root)
        for o in parts: o.parent = root
        root.location = (-0.02, 0.012, r); root.rotation_euler = (0, math.radians(72), math.radians(-32))
    elif n == 'phone_battery':
        # a phone's pack stood on its long edge and leaned back: the black cell, the bone label, four gold contacts on the top edge
        W, T, H = 0.046, 0.006, 0.072
        lean = math.radians(-14)
        root = bpy.data.objects.new('pbroot', None); bpy.context.scene.collection.objects.link(root)
        objs = [P.box(bpy, 'cell', black, (W, T, H), (0, 0, H / 2), bevel=0.0014),
                P.box(bpy, 'label', bone, (W * 0.8, 0.0008, H * 0.6), (0, -T / 2 - 0.0002, H * 0.4)),
                P.box(bpy, 'stripe', gold, (W * 0.8, 0.0009, H * 0.12), (0, -T / 2 - 0.0003, H * 0.76)),
                # the label's own mark, printed dark: a cell with its nub and two bars of charge left
                P.box(bpy, 'g_top', dark, (W * 0.50, 0.0010, 0.0026), (-W * 0.03, -T / 2 - 0.0004, H * 0.50)),
                P.box(bpy, 'g_bot', dark, (W * 0.50, 0.0010, 0.0026), (-W * 0.03, -T / 2 - 0.0004, H * 0.28)),
                P.box(bpy, 'g_l', dark, (0.0026, 0.0010, H * 0.22 + 0.0026), (-W * 0.28, -T / 2 - 0.0004, H * 0.39)),
                P.box(bpy, 'g_r', dark, (0.0026, 0.0010, H * 0.22 + 0.0026), (W * 0.22, -T / 2 - 0.0004, H * 0.39)),
                P.box(bpy, 'g_nub', dark, (0.0034, 0.0010, H * 0.10), (W * 0.27, -T / 2 - 0.0004, H * 0.39)),
                P.box(bpy, 'g_b1', dark, (W * 0.13, 0.0010, H * 0.13), (-W * 0.17, -T / 2 - 0.0004, H * 0.39)),
                P.box(bpy, 'g_b2', dark, (W * 0.13, 0.0010, H * 0.13), (-W * 0.01, -T / 2 - 0.0004, H * 0.39)),
                P.box(bpy, 'print', dark, (W * 0.5, 0.0010, H * 0.028), (-W * 0.1, -T / 2 - 0.0004, H * 0.17)),
                # the flex tail and its plug, off the top edge: what makes a slab a phone's battery
                P.box(bpy, 'flex', gold, (W * 0.26, 0.0012, 0.010), (W * 0.2, 0, H + 0.004)),
                P.box(bpy, 'plug', dark, (W * 0.32, 0.0030, 0.005), (W * 0.2, 0, H + 0.0105))]
        for o in objs: o.parent = root
        root.rotation_euler = (lean, 0, math.radians(8))
    elif n == 'tool_pack':
        # an 18 V slide-on pack: the fat cell box, the narrower rail deck, the release button, three gauge lights
        yel, yel2 = M('yel', 'clay_mustard', 3), M('yel2', 'clay_mustard', 2)
        P.box(bpy, 'cells', black, (0.115, 0.075, 0.040), (0, 0, 0.020), bevel=0.004)
        P.box(bpy, 'band', yel, (0.117, 0.077, 0.014), (0, 0, 0.020), bevel=0.002)
        P.box(bpy, 'deck', yel, (0.092, 0.058, 0.018), (-0.008, 0, 0.049), bevel=0.003)
        P.box(bpy, 'rail_l', yel2, (0.092, 0.006, 0.006), (-0.008, -0.032, 0.054)); P.box(bpy, 'rail_r', yel2, (0.092, 0.006, 0.006), (-0.008, 0.032, 0.054))
        P.box(bpy, 'slot', dark, (0.060, 0.036, 0.004), (-0.014, 0, 0.0585))
        for i in range(3): P.box(bpy, 'contact%d' % i, chrome, (0.004, 0.006, 0.006), (0.026, -0.012 + i * 0.012, 0.0575))
        P.box(bpy, 'button', red, (0.016, 0.030, 0.012), (0.052, 0, 0.044), bevel=0.002)
        for i in range(3): P.box(bpy, 'led%d' % i, bone, (0.0012, 0.006, 0.004), (0.0582, -0.012 + i * 0.012, 0.022))
    elif n == 'car_battery':
        # a group 24 lead-acid: the black case with its ribs, the bone lid and its six vent caps, two posts, the rope handle
        L, W, H = 0.26, 0.173, 0.19
        P.box(bpy, 'case', black, (L, W, H), (0, 0, H / 2), bevel=0.006)
        for i in range(5): P.box(bpy, 'rib%d' % i, dark, (0.006, W + 0.004, H * 0.7), (-L * 0.36 + i * L * 0.18, 0, H * 0.4))
        P.box(bpy, 'lid', bone, (L + 0.006, W + 0.006, 0.022), (0, 0, H + 0.006), bevel=0.004)
        P.box(bpy, 'label', gold, (L * 0.5, 0.002, H * 0.3), (-L * 0.1, -W / 2 - 0.001, H * 0.5))
        for i in range(6): P.cyl(bpy, 'cap%d' % i, steel, 0.011, 0.008, (-L * 0.3 + i * L * 0.12, 0.022, H + 0.021), verts=12)
        P.cyl(bpy, 'post_p', chrome, 0.011, 0.024, (-L * 0.36, -0.045, H + 0.029), verts=12)
        P.cyl(bpy, 'boot_p', red, 0.016, 0.012, (-L * 0.36, -0.045, H + 0.023), verts=12)
        P.cyl(bpy, 'post_n', chrome, 0.011, 0.024, (L * 0.36, -0.045, H + 0.029), verts=12)
        P.cyl(bpy, 'boot_n', dark, 0.016, 0.012, (L * 0.36, -0.045, H + 0.023), verts=12)
        # the rope handle: up from each end of the lid, across the top
        P.rod(bpy, 'h1', gold, (-L * 0.46, 0.03, H + 0.012), (-L * 0.30, 0.03, H + 0.075), 0.006)
        P.rod(bpy, 'h2', gold, (L * 0.46, 0.03, H + 0.012), (L * 0.30, 0.03, H + 0.075), 0.006)
        P.rod(bpy, 'h3', gold, (-L * 0.30, 0.03, H + 0.075), (L * 0.30, 0.03, H + 0.075), 0.007)
    else:
        raise KeyError(n)


def model(n):
    import bpy
    import bohemia_cook_model_props as P
    import bohemia_cook_the_icons_through_the_rig_10_20_26 as IC
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(n, bpy, P, IC)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = os.path.join(OUT, 'models', n + '.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    json.dump(d, open(out[:-4] + '.json', 'w'))
    print('  model', n, [round(x, 4) for x in d], flush=True)


def rig(n):
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    RIG.G['samples'] = 40                         # COOK's icon setting: cut down 3x, 40 denoised samples
    glb = os.path.join(OUT, 'models', n + '.glb'); d = json.load(open(glb[:-4] + '.json'))
    W = H = 96
    L = max(d[0], d[1]); Hh = d[2] * 1.414          # the rig's 3/4 stretch stands a thing at full height
    ppm = max(W, H) * 0.94 * UP / max(L, Hh * 0.75 + max(d[0], d[1]) * 0.5)
    out = os.path.join(OUT, n); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb, out, '--ppm', repr(ppm), '--no-calibration', '--no-id-pass', '--real-length', repr(L), '--no-shadow', '--wear', '0.3', '--snap', '0.35']
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=sum(map(ord, n)) % 97, bid=n)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post([stills[RIG.FACINGS.index(f)] for f in ('S', 'SE', 'SW')], out, A, pop, shadow=False, one_box=False)
    json.dump(dict(model=os.path.relpath(glb, R), ppm=ppm, files=[os.path.relpath(o, R) for o in outs], box=box), open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print('  rig', n, flush=True)


def cutimg(n, W, H):
    """DIRECTION's cut (tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py cutimg), line for line, on this tool's renders"""
    from PIL import Image, ImageFilter
    f = FACE.get(n, 'SE')
    p = os.path.join(OUT, n, 'rig_%s.png' % f)
    im = Image.open(p).convert('RGBA'); im = im.crop(im.getbbox())
    k = min((W - 4) / im.width, (H - 4) / im.height)
    new = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    a = np.asarray(new).astype(np.float32)
    rgb = Image.fromarray(a[..., :3].clip(0, 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=2))
    a[..., :3] = np.asarray(rgb).astype(np.float32); op = a[..., 3] > 110; a[..., 3] = np.where(op, 255, 0)
    pd = np.pad(op, 1); grow = pd[:-2, 1:-1] | pd[2:, 1:-1] | pd[1:-1, :-2] | pd[1:-1, 2:]
    edge = grow & ~op; a[edge] = (22, 19, 17, 235)
    new = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')
    out = Image.new('RGBA', (W, H)); out.alpha_composite(new, ((W - new.width) // 2, H - new.height - 2))
    return out


def cut(n):
    os.makedirs(os.path.join(SHIP, 'small'), exist_ok=True)
    dst = os.path.join(SHIP, n + '.png')
    out = cutimg(n, 96, 96); out = out.crop(out.getbbox()); out.save(dst, optimize=True)
    sm = os.path.join(SHIP, 'small', n + '.png'); cutimg(n, 30, 30).save(sm, optimize=True)
    led = os.path.join(OUT, 'swapped.json'); L_ = json.load(open(led)) if os.path.exists(led) else {}
    L_[n] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), size=list(out.size))
    L_['small/' + n] = dict(file=os.path.relpath(sm, R), sha1=hashlib.sha1(open(sm, 'rb').read()).hexdigest(), size=[30, 30])
    json.dump(L_, open(led, 'w'), indent=1, sort_keys=True)
    print('  cut', n, out.size, flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd = a[0] if a and a[0] in ('model', 'rig', 'cut') else 'all'
    want = [x for x in a if x not in ('model', 'rig', 'cut')] or LADDER
    if cmd == 'model': model(want[0])
    elif cmd == 'rig': rig(want[0])
    elif cmd == 'cut': [cut(n) for n in want]
    else:
        for n in want:
            for step in ('model', 'rig'):
                r = subprocess.run([VENV, os.path.abspath(__file__), step, n], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l)[-900:], flush=True)
            try: cut(n)
            except Exception as e: print('  cut failed', n, e, flush=True)
    sys.stdout.flush(); os._exit(0)
