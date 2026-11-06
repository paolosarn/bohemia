#!/usr/bin/env python3
"""BOHEMIA -- COOK [the golden pistol] (rule 408(b), Paolo 11/4: 'I just want the first time you make art to be the final...
the shields were disappearing recently... the two weapons, it's just all fucked up'; DIRECTION's routing in
records/BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md part 3 row 11: A WEAPON is the most urgent kind with no
golden piece, because its bugs were on the NOW pile).

THE ONE WEAPON: the one the demo puts in his hand first. YOU's crew row in records/target/bb/ours.json carries jobs
['pistol', 'car_door']; ours.weapon_rows maps the pistol job to Battle Brothers' 'dagger' row; the first origin at the door
(rebuild, THE CREW THAT IS LEFT) hands two of its three men the same 'dagger' row. So the golden weapon is THE PISTOL, row
'dagger', until now drawn as COOK's 10/18 class pistol (gun_pistol_a): a 1911 made of eight boxes, gunmetal on his black coat,
a ten-pixel blob in the fight that his own clothes swallow (measured below, the 'before').

THE COMMON RECIPE (DIRECTION part 3), every step:
  1 ONE AT A TIME: one pistol, nothing else of its kind.
  2 THE BAR BESIDE IT: a weapon has no bar piece (the bar page's last table); the nearest are the clay robot (robot_S: one
    real object, the right size, matte clay, dirt from its own shape) and the thug's coat (body_thug_S: the shape that catches
    the sun, the one palette). The loop's twin is body_thug_S, the man it is held beside.
  3 THE REAL THING FIRST: WPN-01 in the reference library (added this round, the library had 0 weapons): the Colt Government
    Model 1911 in stainless, .45 ACP, a 5 in (127 mm) barrel, 8.5 in (216 mm) long, 5.5 in (140 mm) tall, 1.25 in (32 mm)
    across the grip panels, 35 to 39 oz (1.0 to 1.1 kg) empty, seven in the magazine and one up. Its proportions are taken
    before any clay: long to tall 1.54, long to wide 6.75 (records/target/cook_golden_pistol/real.json).
  4 ONE SOURCE: modelled here from side profiles (the slide, the frame and its grip at the 1911's 18 degrees, the
    mainspring housing's arch, the beavertail), never a stack of boxes; five materials, every colour a step of
    records/target/BOHEMIA_STYLE_PALETTE.json; THE ORIGIN AT THE FIRING HAND'S GRIP (the middle of the grip, half way down),
    the muzzle +X, up +Z, so it sits on the hand bone as it is. Rendered through the master rig (--class prop, two wear
    seeds, 0 and 1) alone, and in YOU's hands by the fight's own four picture systems (the six guns' tool, imported).
  5 THE LOOP: skills/bohemia-pixel-art/scripts/look.py with body_thug_S as --twin, every cycle in words, on the pistol IN
    HIS HAND at the fight's pixels (the surface he meets it on), records/target/cook_golden_pistol/loop.jsonl.
  6-7 THE CHECKS AND THE SURFACE: the shipped fight on the phone profile, all eight facings, beside the thug, a shield beside
    it, two weapons in two hands; COMBAT 8's check (THE FIGHT DRAWS WHAT HE WEARS) green.
WHAT CHANGED FROM THE CLASS PISTOL, AND WHY (the first time is the final time): stainless, not gunmetal. The real Government
Model has been sold in stainless since the 1980s and a pawn-shop gun of 2050 is most likely one; and at the fight's 12 pixels a
dark gun on his black runway coat is not there at all. The slide is the lightest steel (brushed flats), the frame a step down
(bead-blasted), so the L of a pistol reads against his coat AND, with the fight's dark rim, against the pale ground.
THE ONE WRONG THING (the analog horror bible R1): the serial number ground off the right of the frame, a bright raw scar on
the dust cover ahead of the trigger guard (where Colt stamps it). Somebody owned this gun before you, and made sure nobody would know who.

    <bpy> tools/bohemia_cook_the_golden_pistol_11_6_26.py model             reference/models/bohemia/gun_service_pistol.glb
    <bpy> tools/bohemia_cook_the_golden_pistol_11_6_26.py rig <seed>        the master rig alone, true size and close
    <bpy> tools/bohemia_cook_the_golden_pistol_11_6_26.py render [systems]  in YOU's hands (grid hold idle shield)
    python3 tools/bohemia_cook_the_golden_pistol_11_6_26.py pack            into slices/fight_rig/own_guns.json beside the six
    <bpy> tools/bohemia_cook_the_golden_pistol_11_6_26.py icon; python3 ... shelf; python3 ... manifest
    python3 tools/bohemia_cook_the_golden_pistol_11_6_26.py hand            the in-hand strips for the loop (grid renders)

REUSE CHECK: COOK's gun kit (tools/bohemia_cook_model_guns.py: slab, xcyl, tilted, guard, grooves, to_grip, mat), the six
guns' tool imported whole (its renders, expected(), its pack, shelf and alone), COMBAT's guns tool and ANIMATION's hold, idles
and melee tools patched in memory exactly as the six guns patch them; DIRECTION's master rig. No bank opened: nothing in banks/
is a 3D model.
REFERENCE CHECK (the 9/4 standing law): WPN-01 the real Colt Government Model stainless (makers' and dealers' published numbers,
records/target/cook_golden_pistol/real.json); PROP-02 real object typology (three readable parts: slide, frame with its grip,
the trigger guard); PROP-01 silhouette first; AH-01 the analog horror bible (one wrong thing, grime baked); the twin is the bar
piece body_thug_S (records/target/cook3/rig/thug/rig_S.png) and the nearest method piece robot_S. No reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
OUTD = os.path.join(ROOT, 'records/target/cook_golden_pistol')
MODEL = 'gun_service_pistol'
ROW = 'dagger'   # ours.weapon_rows.pistol: the row every pistol job in the game is
GUN = dict(model=MODEL, kind='pistol', name='the pistol',
           say='a stainless Government Model 1911, .45, five-inch barrel, walnut grips, the serial ground off the frame')
REAL = dict(ref='WPN-01', what='Colt Government Model 1911, stainless, .45 ACP', length_m=0.216, height_m=0.140, width_m=0.032,
            barrel_m=0.127, mass_kg=[1.0, 1.1], rounds='7+1',
            sources=['https://blackstoneshooting.com/colt-1911-government-45-acp-5-00-barrel-7-1-rds-stainless-098289042989',
                     'https://kygunco.com/product/colt-o1911c-ss-government-model-1911-5-45acp-71-stainless',
                     'https://bosque-cat.demo-store.papathemes.com/colt-1911c-government-45acp-5-two-tone'],
            note='overall 8.5 in and 39 oz (Blackstone), 8.5 in and 35 oz (KY Gun Co, O1911C-SS), height 5.5 in (140 mm) and width '
                 '1.25 in (the 1911C listing); no Colt spec sheet was reachable this round, so the numbers are dealers\' listings')

# the grip, where the firing hand holds it: the middle of the grip half way down (the hand bone's point), build frame
TILT = math.radians(18)                  # the 1911's grip angle
DOWN = (-math.sin(TILT), -math.cos(TILT))    # down the grip, toward the butt
BACK = (-math.cos(TILT), math.sin(TILT))     # across the grip, toward the back strap
FRONT_TOP = (-0.029, -0.026)             # where the front strap leaves the frame under the guard
GRIP_LEN, GRIP_DEEP = 0.088, 0.046       # front strap length; front strap to back strap (48 mm across at the 18 degrees, the real ~2 in)
# (the first build put the front strap at -0.052 and came out 247 mm long against the real 216: the butt sat 27 mm behind the
#  slide; on the real gun the butt's back corner is under the grip safety's tang, so the grip is 23 mm further forward)


def gp(s, t):
    """a point on the grip: s down the front strap, t back across it"""
    return (FRONT_TOP[0] + DOWN[0] * s + BACK[0] * t, FRONT_TOP[1] + DOWN[1] * s + BACK[1] * t)


GRIP_AT = gp(0.046, GRIP_DEEP / 2)

# THE LOOP'S KNOBS (each cycle moves one; the values below are where the loop ended, records/target/cook_golden_pistol/loop.jsonl)
TUNE = dict(slide=['tape_grey', 4], frame=['tape_grey', 2], wood=['clay_mustard', 1], seed=1, card_grain=10)
TUNE.update(json.loads(os.environ.get('BOHEMIA_PISTOL_TUNE', '{}')))


def service_pistol(bpy, mathutils):
    import bohemia_cook_model_guns as G
    from bohemia_cook_model_props import mat, box, cut, cyl, rod
    slide_m = mat(bpy, 'stainless_slide', *TUNE['slide'])    # brushed flats, the lightest steel
    frame_m = mat(bpy, 'stainless_frame', *TUNE['frame'])    # bead-blasted, a step down
    wood = mat(bpy, 'walnut', *TUNE['wood'])                 # double-diamond walnut panels
    black = mat(bpy, 'black_parts', 'rubber', 2)             # the sights, the magazine's base, the bore
    raw = mat(bpy, 'raw_steel', 'chrome', 1)                 # filed bright: the bushing's crown, the ground-off serial
    # THE SLIDE: its side profile, 210 mm, 27 mm tall, 23.4 mm across, the muzzle end eased, the rear face square
    sl = [(-0.097, -0.0105), (0.110, -0.0105), (0.110, 0.0120), (0.1060, 0.0165), (-0.0935, 0.0165), (-0.097, 0.0125)]
    slide = G.slab(bpy, 'slide', slide_m, sl, 0.0234, bevel=0.0022)
    G.grooves(bpy, slide, [-0.090 + 0.0042 * i for i in range(8)], (0.0016, 0.0040, 0.020), 0.003)   # the rear serrations
    cut(bpy, slide, (0.034, 0.008, 0.012), (0.014, -0.0117, 0.0105), (0, 0, 0))                     # the ejection port, right
    G.xcyl(bpy, 'barrel_hood', black, 0.0068, 0.000, 0.032, z=0.0050, verts=12)                     # the barrel seen in the port
    G.xcyl(bpy, 'bushing', slide_m, 0.0095, 0.1080, 0.1110, verts=18)
    G.xcyl(bpy, 'crown', raw, 0.0066, 0.1100, 0.1115, verts=14)
    G.xcyl(bpy, 'bore', black, 0.0057, 0.1105, 0.1120, verts=12)
    G.xcyl(bpy, 'spring_plug', frame_m, 0.0046, 0.1000, 0.1100, z=-0.0165, verts=12)
    # THE SIGHTS: a black blade in front, a black notch behind (the eye looks down the slide's light top to them)
    box(bpy, 'front_sight', black, (0.0080, 0.0036, 0.0060), (0.1000, 0, 0.0195), bevel=0.0008)
    box(bpy, 'rear_sight', black, (0.0090, 0.0150, 0.0055), (-0.0850, 0, 0.0190), bevel=0.0010)
    # THE FRAME AND ITS GRIP: one side profile, the dust cover under the slide, the guard's roof, the grip at 18 degrees with
    # the mainspring housing's arch and the beavertail's tang behind
    fb, bb = gp(GRIP_LEN, 0.0), gp(GRIP_LEN, GRIP_DEEP)
    arch = [gp(GRIP_LEN * f, GRIP_DEEP + 0.0035 * math.sin(math.pi * f)) for f in (0.75, 0.5, 0.25)]   # the arched housing
    fr = [(-0.0970, -0.0105), (0.1000, -0.0105), (0.1000, -0.0230), (0.0140, -0.0230), (-0.0250, -0.0235), FRONT_TOP,
          gp(GRIP_LEN * 0.5, -0.0012), fb, bb] + arch + [gp(0.0, GRIP_DEEP + 0.001), (-0.0860, -0.0140), (-0.1040, -0.0085),
          (-0.1035, -0.0055), (-0.0975, -0.0055)]   # the back strap up into the web, the grip safety's tang over it
    G.slab(bpy, 'frame', frame_m, fr, 0.0210, bevel=0.0018)
    # the grip panels, walnut, proud of the frame each side. Cycle 3: a box read as a sticker, so the grip's own outline with its
    # round bottom corners. Cycles 3 to 6: the checkering as boolean grooves read as plaid, then vanished, then at 1 mm let the
    # boolean eat the whole panel twice (58 faces left; the check below caught the second). Cycle 6: THE CHECKERING IS
    # GEOMETRY, a field of small pyramids on the face (what real checkering is), 3 mm apart, 0.8 mm high, on the diagonal,
    # and the two smooth diamonds round the screws left bare (the Colt double diamond)
    outline = [gp(0.012, 0.006), gp(0.074, 0.006), gp(0.081, 0.008), gp(0.084, 0.013), gp(0.084, GRIP_DEEP - 0.013),
               gp(0.081, GRIP_DEEP - 0.008), gp(0.074, GRIP_DEEP - 0.006), gp(0.012, GRIP_DEEP - 0.006)]
    screws = [(0.022, GRIP_DEEP / 2), (0.074, GRIP_DEEP / 2)]
    def knurl(s, pitch=0.0030, hgt=0.0008):
        yf = s * (0.0128 + 0.00225 + 0.0001); r = math.sqrt(0.5)
        e1, e2 = (pitch * r, pitch * r), (-pitch * r, pitch * r)
        vs, fs = [], []
        def P(u, t, lift=0.0):
            x, z = gp(u, t); return (x, yf + s * lift, z)
        for i in range(-40, 41):
            for j in range(-40, 41):
                cu, ct = 0.047 + i * e1[0] + j * e2[0], GRIP_DEEP / 2 + i * e1[1] + j * e2[1]
                cs = [(cu + a * e1[0] / 2 + b * e2[0] / 2, ct + a * e1[1] / 2 + b * e2[1] / 2) for a, b in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
                if not all(0.015 <= u <= 0.080 and 0.009 <= t <= GRIP_DEEP - 0.009 for u, t in cs): continue
                if any(abs(cu - su) / 0.0105 + abs(ct - st) / 0.0105 < 1.0 for su, st in screws): continue   # the smooth diamonds
                k = len(vs); vs += [P(u, t) for u, t in cs] + [P(cu, ct, hgt)]
                for q in range(4): fs.append((k + q, k + (q + 1) % 4, k + 4) if s > 0 else (k + (q + 1) % 4, k + q, k + 4))
        me = bpy.data.meshes.new('checker_%d' % (s + 1)); me.from_pydata(vs, [], fs); me.update()
        o = bpy.data.objects.new('checker_%d' % (s + 1), me); bpy.context.collection.objects.link(o); o.data.materials.append(wood)
        return len(fs)
    for s in (-1, 1):
        pn = G.slab(bpy, 'panel_%d' % (s + 1), wood, outline, 0.0045, bevel=0.0014)
        pn.location.y = s * 0.0128
        nf = knurl(s); assert nf > 400, ('too few pyramids', nf)
        for k, (su, st) in enumerate(screws):
            x, z = gp(su, st); cyl(bpy, 'screw_%d_%d' % (s + 1, k), raw, 0.0026, 0.0014, (x, s * 0.0154, z), rot=(math.pi / 2, 0, 0), verts=10)
    mb = [(fb[0] - 0.002, fb[1] - 0.0005), bb, (bb[0] + DOWN[0] * 0.006, bb[1] + DOWN[1] * 0.006), (fb[0] + DOWN[0] * 0.006 - 0.002, fb[1] + DOWN[1] * 0.006)]
    mx = sum(p[0] for p in mb) / 4; mz = sum(p[1] for p in mb) / 4
    box(bpy, 'mag_base', black, (GRIP_DEEP + 0.002, 0.0225, 0.0055), (mx, 0, mz), rot=(0, TILT, 0), bevel=0.0012)
    # THE GUARD AND THE TRIGGER: the 1911's square guard, a long flat trigger
    # (cycle 2: three rods read as a coat hanger on the card; the real guard is a flat band, 10 mm across, 4 mm thick)
    def seg(name, p0, p1, thick=0.0040, width=0.0105):
        dx, dz = p1[0] - p0[0], p1[1] - p0[1]; ln = math.hypot(dx, dz)
        return box(bpy, name, frame_m, (ln + thick, width, thick), ((p0[0] + p1[0]) / 2, 0, (p0[1] + p1[1]) / 2), rot=(0, -math.atan2(dz, dx), 0), bevel=0.0012)
    lo = -0.0485
    seg('guard_back', (-0.0300, -0.0270), (-0.0255, lo)); seg('guard_bottom', (-0.0255, lo), (0.0100, lo)); seg('guard_front', (0.0100, lo), (0.0135, -0.0232))
    box(bpy, 'trigger', frame_m, (0.0060, 0.0070, 0.0150), (-0.0120, 0, -0.0320), rot=(0, math.radians(-6), 0), bevel=0.0012)
    # THE HAMMER, THE GRIP SAFETY'S TANG, THE THUMB SAFETY AND THE SLIDE STOP (left side, the side away from the port)
    box(bpy, 'hammer', frame_m, (0.0095, 0.0085, 0.0170), (-0.1000, 0, 0.0145), rot=(0, math.radians(-34), 0), bevel=0.0015)   # cycle 11: its spur stands behind the slide
    box(bpy, 'thumb_safety', frame_m, (0.0160, 0.0030, 0.0070), (-0.0780, 0.0125, -0.0070), bevel=0.0008)
    box(bpy, 'slide_stop', frame_m, (0.0220, 0.0030, 0.0060), (0.0000, 0.0125, -0.0085), bevel=0.0008)
    cyl(bpy, 'stop_pin', frame_m, 0.0030, 0.0030, (0.0120, -0.0119, -0.0120), rot=(math.pi / 2, 0, 0), verts=10)
    # THE ONE WRONG THING: the serial ground off the right of the dust cover ahead of the guard, a bright raw scar
    # (cycle 10: one clean bright box read as a machined slot; a grinder leaves strokes: three, overlapping, at slight angles)
    for i, (dx, dz, a_, ln, dy) in enumerate(((0.000, 0.0000, 4, 0.024, 0.0000), (0.006, 0.0018, -7, 0.018, 0.0003), (-0.004, -0.0016, 11, 0.014, 0.0005))):
        box(bpy, 'serial_ground_%d' % i, raw, (ln, 0.0010, 0.0042), (0.0420 + dx, -0.0110 - dy, -0.0168 + dz), rot=(0, math.radians(a_), 0), bevel=0.0004)
    G.to_grip(bpy, GRIP_AT)


def do_model():
    import bohemia_cook_model_guns as G
    G.BUILDERS[MODEL] = service_pistol
    out = os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % MODEL)
    print('MODEL', G.build(MODEL, out), 'grip', [round(x, 4) for x in GRIP_AT], flush=True)
    os.makedirs(OUTD, exist_ok=True)
    json.dump(REAL, open(os.path.join(OUTD, 'real.json'), 'w'), indent=1)


def six():
    """the six guns' tool, imported, with this one gun as its whole list (its renders, expected(), pack, alone read SIX)"""
    import bohemia_cook_the_six_guns_11_3_26 as SG
    SG.SIX = {ROW: GUN}
    SG.OUTD = OUTD
    SG.REND = os.environ.get('BOHEMIA_PISTOL_REND', 'records/target/cook_golden_pistol/renders')
    # the loop's wear seed into every render (COMBAT's guns tool and ANIMATION's melee render_props call the source pass with 0)
    if not getattr(SG, '_golden_seeded', False):
        gp_, sp_ = SG.guns_prog, SG.shield_prog; sd = int(TUNE['seed'])
        def guns_prog(*a):
            c = gp_(*a); k = "MR.source_pass(gparts, float(MR.G['wear']), 1.0, 0)"; assert c.count(k) == 1, 'the guns tool changed its source pass'
            return c.replace(k, "MR.source_pass(gparts, float(MR.G['wear']), 1.0, %d)" % sd)
        def shield_prog(*a):
            return ('import sys; sys.path.insert(0, %r)\nimport bohemia_direction_master_rig as _MR\n_sp = _MR.source_pass\n'
                    '_MR.source_pass = lambda o, w, k, seed=0: _sp(o, w, k, %d)\n' % (os.path.join(ROOT, 'tools'), sd)) + sp_(*a)
        SG.guns_prog, SG.shield_prog, SG._golden_seeded = guns_prog, shield_prog, True
    return SG


def do_rig(seed):
    """the master rig alone: at true size (57 px a metre, --class prop), and close (600 px a metre, a break, for the eye only)"""
    py = sys.executable; glb = os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % MODEL)
    for tag, extra in (('true', []), ('close', ['--ppm', '600'])):
        out = os.path.join(OUTD, 'master_%s_seed%d' % (tag, seed))   # never 'rig_...': the rig names its shadow by replacing '/rig_' in the path
        cmd = [py, 'tools/bohemia_direction_master_rig.py', glb, out, '--class', 'prop', '--seed', str(seed), '--real-length', str(REAL['length_m']),
               '--real-dims', '%s,%s,%s' % (REAL['length_m'], REAL['width_m'], REAL['height_m']), '--no-id-pass'] + extra
        print('RIG', tag, seed, subprocess.call(cmd, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL), flush=True)


def do_hand(tag):
    """the loop's candidate: YOU's grid body with this gun's grid renders laid on (the fight's cut and rim), 8 facings, the
    carry, the aim and the blow; the class pistol beside it from the shipped sheet; at the fight's pixels"""
    import numpy as np
    from PIL import Image
    SG = six()
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); Y = FR['looks']['you']; w, h = Y['w'], Y['h']
    body = Image.open(os.path.join(ROOT, 'slices/fight_rig/you.webp')).convert('RGBA')
    cls = Image.open(os.path.join(ROOT, 'slices/fight_rig/you_guns.webp')).convert('RGBA')
    rj = json.load(open(os.path.join(SG.out_dir('grid', ROW), 'rig.json'))); cx0, cy0 = rj['crop_box_px'][:2]
    fx0, fy0 = cx0 + rj['ground_px'][0] - Y['foot'][0], cy0 + rj['ground_px'][1] - Y['foot'][1]
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']; thr = G['alpha_threshold']; RIM = tuple(FR['rim'])
    def cut(a):
        op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
        near = np.zeros_like(op)
        near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
        a[near & ~op] = RIM; return Image.fromarray(a, 'RGBA')
    rows = [('carry@0', 'Carry', 0, 0), ('aim@1', 'Aim', 1, 8), ('hit@0', 'Hit', 0, 10)]
    W = Image.new('RGBA', (w * 8, h * 3), (0, 0, 0, 0)); C = Image.new('RGBA', (w * 8, h * 3), (0, 0, 0, 0))
    CW, CH = 40, 34; LW = Image.new('RGBA', ((CW + 2) * 8, (CH + 2) * 2), (0, 0, 0, 0)); LC = LW.copy()
    def centre(g):
        ys, xs = np.nonzero(np.asarray(g)[..., 3] > 127)
        return (int(xs.mean()), int(ys.mean())) if len(xs) else (w // 2, h // 2)
    win = {}
    def bbox(g):
        ys, xs = np.nonzero(np.asarray(g)[..., 3] > 127)
        return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1) if len(xs) else None
    for r, (bc, clip, k, gc) in enumerate(rows):
        bi = FR['cols'].index(bc)
        for fi, f in enumerate(SG.FIGHT_DIRS):
            if not os.path.exists(os.path.join(SG.out_dir('grid', ROW), 'guns', '%s_%s_%s_k%02d.png' % (ROW, clip, f, k))): continue
            cell = body.crop((bi * w, fi * h, (bi + 1) * w, (fi + 1) * h))
            mine = cut(np.asarray(Image.open(os.path.join(SG.out_dir('grid', ROW), 'guns', '%s_%s_%s_k%02d.png' % (ROW, clip, f, k))).convert('RGBA')))
            big = Image.new('RGBA', (w + 400, h + 400), (0, 0, 0, 0)); big.alpha_composite(mine, (int(200 - fx0), int(200 - fy0)))
            gun = big.crop((200, 200, 200 + w, 200 + h))
            c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); c.alpha_composite(cell); c.alpha_composite(gun); W.alpha_composite(c, (fi * w, r * h))
            cg = cls.crop((gc * w, fi * h, (gc + 1) * w, (fi + 1) * h))
            c2 = Image.new('RGBA', (w, h), (0, 0, 0, 0)); c2.alpha_composite(cell); c2.alpha_composite(cg)
            C.alpha_composite(c2, (fi * w, r * h))
            if r < 2:   # the loop's candidate: the hands and the gun at 1x, one 40 x 34 window on both guns (the busy corner)
                bs = [q for q in (bbox(gun), bbox(cg)) if q]
                if bs: x, y = (min(q[0] for q in bs) + max(q[2] for q in bs)) // 2, (min(q[1] for q in bs) + max(q[3] for q in bs)) // 2
                else: x, y = w // 2, h // 2
                for src, dst in ((c, LW), (c2, LC)): dst.alpha_composite(src.crop((x - CW // 2, y - CH // 2, x + CW // 2, y + CH // 2)), (fi * (CW + 2), r * (CH + 2)))
    os.makedirs(OUTD, exist_ok=True)
    W.save(os.path.join(OUTD, 'hand_%s.png' % tag)); C.save(os.path.join(OUTD, 'hand_class.png'))
    LW.save(os.path.join(OUTD, 'loop_%s.png' % tag)); LC.save(os.path.join(OUTD, 'loop_class.png'))
    print('HAND', os.path.join(OUTD, 'hand_%s.png' % tag), W.size, 'LOOP', os.path.join(OUTD, 'loop_%s.png' % tag))


def do_pack():
    """the six guns' own pack with this gun as its list, then the six put back beside it (their cells and files untouched);
    the shift tables are recomputed from the shipped sheets by the same code and serve every pistol row alike"""
    SG = six()
    p = os.path.join(ROOT, 'slices/fight_rig/own_guns.json'); old = json.load(open(p))
    SG.do_pack(); new = json.load(open(p))
    for k in ('by_row', 'kind', 'model'):
        merged = dict(old.get(k, {})); merged.update(new[k]); new[k] = merged
    # every row the game calls PISTOL (weapon_lines: class dagger -> job pistol, name PISTOL) holds this one gun: they were all drawn
    # as the class pistol, and on the cards they all wear the one pistol icon; the zip gun and the snub keep their own models
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))['rows']
    for r in W:
        if r.get('class') == 'dagger' and r['id'] not in new['by_row']: new['by_row'][r['id']] = ROW
    guns = dict(old['guns']); guns.update(new['guns']); new['guns'] = guns
    new['version'] = 'own-guns-11-6'; new['lane'] = 'cook (COOK GUNS 11/3, the golden pistol 11/6)'
    new['rule'] = '337 (ask line 344); 408(b) the golden pistol'
    new['record'] = old['record']; new['record_golden'] = 'records/BOHEMIA_COOK_THE_GOLDEN_PISTOL_11_6_26.md'
    json.dump(new, open(p, 'w'), separators=(',', ':'))
    print('MERGED', sorted(new['guns']), 'tables', len(new['shift_tables']), 'old tables', len(old['shift_tables']))


def do_card_render(ppm=1200):
    """the card's picture: the gun alone side-on, the muzzle right, through the master rig's light and source pass (the six
    guns' alone render, its camera and light, at ppm px a metre so it is shrunk, never stretched, into the card's box)"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    out = os.path.join(OUTD, 'card'); os.makedirs(out, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % MODEL))
    for o in [o for o in sc.objects if o.name not in before and o.type == 'MESH' and o.name.startswith('Icosphere') and len(o.data.vertices) == 42]:
        bpy.data.objects.remove(o, do_unlink=True)
    parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
    bpy.context.view_layer.update()
    # cycle 19: the guide's grain is sized for the fight's 57 px a metre; the card is shrunk from ppm to about 430 px a metre, so
    # its grain is scaled by the same ratio (card_grain) or a run of one colour is 3 px long where the fight's is 2 (DETAIL)
    # (cycle 21: on the steel only; the walnut keeps the guide's grain, or its checkering goes to noise, cycle 20)
    g0 = MR.G['grain_per_m']; wood_ = [o for o in parts if any(sl.material and sl.material.name.startswith('walnut') for sl in o.material_slots)]
    MR.G['grain_per_m'] = float(g0) * float(TUNE.get('card_grain', 1.0)); MR.source_pass([o for o in parts if o not in wood_], float(MR.G['wear']), 1.0, int(TUNE['seed']))
    MR.G['grain_per_m'] = g0; MR.source_pass(wood_, float(MR.G['wear']), 1.0, int(TUNE['seed']))
    vs = [o.matrix_world @ v.co for o in parts for v in o.data.vertices]
    lo = mathutils.Vector([min(v[i] for v in vs) for i in range(3)]); hi = mathutils.Vector([max(v[i] for v in vs) for i in range(3)]); c = (lo + hi) / 2
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.rotation_euler = (math.radians(90), 0, 0); cam.location = (c.x, lo.y - 2.0, c.z)
    rx, ry = int((hi.x - lo.x) * ppm) + 24, int((hi.z - lo.z) * ppm) + 24
    cd.ortho_scale = max(rx, ry) / float(ppm); sc.render.resolution_x, sc.render.resolution_y = rx, ry
    MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
    sc.cycles.samples = 48; sc.render.film_transparent = True
    sc.render.filepath = os.path.join(out, 'side_%d.png' % ppm); bpy.ops.render.render(write_still=True)
    print('CARD', sc.render.filepath, rx, ry, flush=True)


def do_card(box_from='slices/market_icons/w_pistol.png'):
    """the card's icon: the side render shrunk with a box filter into the box his pack tile fills (96 x 78, its own margin),
    binary alpha the way the shelf's icons are (> 96), written over w_pistol.png (the picture every PISTOL card draws)"""
    from PIL import Image
    src = Image.open(os.path.join(OUTD, 'card', 'side_1200.png')).convert('RGBA'); src = src.crop(src.getbbox())
    W, H, M = 96, 78, (2, 5, 94, 72)   # his tile's size and the box its pistol filled (read off pack_12_weapons_and_supplies_006)
    mw, mh = M[2] - M[0], M[3] - M[1]; k = min(mw / src.width, mh / src.height)
    im = src.resize((max(1, round(src.width * k)), max(1, round(src.height * k))), Image.BOX)
    im.putalpha(im.split()[3].point(lambda v: 255 if v > 96 else 0))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); out.alpha_composite(im, ((W - im.width) // 2, (H - im.height) // 2))
    out.save(os.path.join(ROOT, box_from), optimize=True); out.save(os.path.join(OUTD, 'card', 'w_pistol.png'))
    print('CARD ICON', box_from, im.size)


def do_manifest():
    """reference/models/bohemia/items.json: the golden pistol its own entry (its glb, its sha1, 'was' the class pistol), owning every
    row the game calls PISTOL (the class dagger rows, the zip gun and the snub keep their own); those rows moved off the class
    entry, which stays for any look that still draws it (COOK WEAPONS' and the six guns' manifest step)"""
    import hashlib
    mp = os.path.join(ROOT, 'reference/models/bohemia/items.json'); M = json.load(open(mp))
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))['rows']
    rows = [r['id'] for r in W if r.get('class') == 'dagger' and r['id'] not in M['items']]
    for k, e in M['items'].items():
        if k != 'service_pistol' and any(r in e.get('rows', []) for r in rows): e['rows'] = [r for r in e['rows'] if r not in rows]
    fn = os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % MODEL)
    M['items']['service_pistol'] = dict(glb=MODEL + '.glb', kind='held', name='pistol', say=GUN['say'],
                                        made='COOK 11/6 the golden pistol (tools/bohemia_cook_the_golden_pistol_11_6_26.py), rule 408(b)',
                                        rows=rows, sha1=hashlib.sha1(open(fn, 'rb').read()).hexdigest(), hands=1, was='pistol', real='WPN-01')
    json.dump(M, open(mp, 'w'), indent=1)
    print('MANIFEST', rows)


def do_bar():
    """THE BAR BESIDE IT (recipe step 2), at one pixel to one pixel: the thug (body_thug_S) and the robot (robot_S) from THE_BAR.json,
    YOU holding the golden pistol in the low ready and the one-hand aim (his shipped held-clip sheet with the new gun laid on the
    way the fight lays it), and the card"""
    import numpy as np
    from PIL import Image, ImageDraw
    B = {x['key']: x for x in json.load(open(os.path.join(ROOT, 'records/target/direction_bar/THE_BAR.json')))['pieces']}
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); Y = FR['looks']['you']; RIM = tuple(FR['rim']); W0, H0 = Y['w'], Y['h']
    H = json.load(open(os.path.join(ROOT, 'slices/rig_hold/you.json'))); sheet = Image.open(os.path.join(ROOT, 'slices/rig_hold', H['sheet']['file'])).convert('RGBA')
    rd = os.path.join(ROOT, 'records/target/cook_golden_pistol/renders/hold_%s/you' % ROW); rj = json.load(open(rd + '/rig.json'))
    fx0, fy0 = rj['crop_box_px'][0] + rj['ground_px'][0] - Y['foot'][0], rj['crop_box_px'][1] + rj['ground_px'][1] - Y['foot'][1]
    def cut(a):
        op = a[..., 3] > 127; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
        near = np.zeros_like(op); near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
        a[near & ~op] = RIM; return Image.fromarray(a, 'RGBA')
    def man(clip, k, f, dname):
        c = Image.new('RGBA', (W0, H0)); x, y, w, h, dx, dy = H['sheet']['cells'][H['clips'][clip][k][f]]; c.alpha_composite(sheet.crop((x, y, x + w, y + h)), (dx, dy))
        g = cut(np.asarray(Image.open('%s/guns/%s_%s_%s_k%02d.png' % (rd, ROW, clip, dname, k)).convert('RGBA')))
        big = Image.new('RGBA', (W0 + 400, H0 + 400)); big.alpha_composite(g, (int(200 - fx0), int(200 - fy0)))
        c.alpha_composite(big.crop((200, 200, 200 + W0, 200 + H0))); return c.crop(c.getbbox())
    items = [('thug (bar)', Image.open(os.path.join(ROOT, B['body_thug_S']['src'])).convert('RGBA')),
             ('robot (bar)', Image.open(os.path.join(ROOT, B['robot_S']['src'])).convert('RGBA')),
             ('YOU, low', man('PIdle', 0, 1, 'SE')), ('YOU, aim', man('PAim', 1, 2, 'E')),
             ('the card', Image.open(os.path.join(ROOT, 'slices/market_icons/w_pistol.png')).convert('RGBA'))]
    cols = [max(i.width, 6 * len(n)) for n, i in items]; Hh = max(i.height for _, i in items) + 16
    V = Image.new('RGBA', (sum(cols) + 10 * (len(items) + 1), Hh), (118, 104, 84, 255)); d = ImageDraw.Draw(V); x = 10
    for (n, i), cw in zip(items, cols):
        V.alpha_composite(i, (x + (cw - i.width) // 2, Hh - i.height - 2)); d.text((x, 1), n, fill=(30, 26, 22)); x += cw + 10
    V.save(os.path.join(OUTD, 'beside_the_bar_1x.png')); print('BAR', V.size)


def do_sheet():
    """the VOTE card: the shipped fight on his phone (the proof's frames, 3x, shrunk to 2x), WAS (the class pistol) beside NOW
    (the golden pistol), moving: YOU with his car door turned through the eight facings (300 ms each), the same with the pistol
    alone, then YOU, RAUL and the thug at the fight's opening zoom (held), then the card's picture beside his pack tile and the
    gun beside the bar at one pixel to one pixel (held)"""
    from PIL import Image, ImageDraw
    D = os.path.join(OUTD, 'proof'); k = 2 / 3.0; BG = (24, 22, 20)
    def fr(n): im = Image.open(os.path.join(D, n)).convert('RGB'); return im.resize((round(im.width * k), round(im.height * k)), Image.BOX)
    def pair(a, b, label):   # WAS above NOW: an upright card for his upright phone (taller than the glass, so it pans both ways)
        A, B = fr(a), fr(b); W = max(A.width + 12, 480); H = A.height * 2 + 52; x = (W - A.width) // 2
        S = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(S)
        d.text((6, 5), 'WAS: the class pistol  ' + label, fill=(200, 190, 170)); S.paste(A, (x, 22))
        d.text((6, A.height + 31), 'NOW: the new pistol, a STAND-IN (not yet the bar)', fill=(240, 200, 120)); S.paste(B, (x, A.height + 48))
        S.info['now'] = [x, A.height + 48, B.width, B.height]; return S
    seq, dur = [], []
    for kit, lab in (('door', 'with his car door'), ('bare', 'one hand')):
        for f in range(8): seq.append(pair('%s_before_turn%d.png' % (kit, f), '%s_after_turn%d.png' % (kit, f), lab)); dur.append(300)
    seq.append(pair('door_before_group_open.png', 'door_after_group_open.png', 'YOU, RAUL, THE THUG')); dur.append(1400)
    W = max(s.width for s in seq); H = max(s.height for s in seq)
    # the card and the bar, held: his pack tile and the new card at 3x, the gun beside the bar at 2x
    C = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(C)
    old = Image.open(os.path.join(OUTD, 'card', 'w_pistol_pack.png')).convert('RGBA'); new = Image.open(os.path.join(OUTD, 'card', 'w_pistol.png')).convert('RGBA')
    d.text((6, 5), 'THE CARD: his pack tile (kept)', fill=(200, 190, 170)); d.text((6 + 2 * 96 + 20, 5), 'the new card (NOT shipped)', fill=(240, 200, 120))
    for i, im in enumerate((old, new)):
        im = im.resize((im.width * 2, im.height * 2), Image.NEAREST); C.paste(im, (6 + i * (2 * 96 + 20), 24), im)
    bar = Image.open(os.path.join(OUTD, 'beside_the_bar_1x.png')).convert('RGB'); kb = max(1, min(2, (W - 12) // bar.width, (H - 24 - 2 * 78 - 30) // bar.height))
    bar = bar.resize((bar.width * kb, bar.height * kb), Image.NEAREST)
    d.text((6, 24 + 2 * 78 + 10), 'BESIDE THE BAR at %dx: the thug, the robot, YOU holding it' % kb, fill=(240, 200, 120))
    C.paste(bar, (6, 24 + 2 * 78 + 26)); seq.append(C); dur.append(2200)
    seq = [s if s.size == (W, H) else (lambda c: (c.paste(s, (0, 0)), c)[1])(Image.new('RGB', (W, H), BG)) for s in seq]
    sp = os.path.join(OUTD, 'CARD_THE_PISTOL_STAND_IN.webp'); seq[0].save(sp, 'WEBP', save_all=True, append_images=seq[1:], duration=dur, loop=0, quality=82, method=6)
    na = seq[1].info.get('now') or [0, 0, W, H]
    first = seq[1].crop((na[0], na[1], na[0] + na[2], na[1] + na[3])); fp = os.path.join(OUTD, 'first.webp'); first.save(fp, 'WEBP', quality=85, method=6)
    json.dump(dict(firstAt=na, size=[W, H]), open(os.path.join(OUTD, 'card_first_at.json'), 'w'))
    seq[1].save(os.path.join(OUTD, 'card_still_turn_SE.png')); seq[16].save(os.path.join(OUTD, 'card_still_group.png')); C.save(os.path.join(OUTD, 'card_still_bar.png'))
    print('SHEET', sp, (W, H), len(seq), os.path.getsize(sp))


if __name__ == '__main__':
    cmd, a = sys.argv[1], sys.argv[2:]
    if cmd == 'model': do_model()
    elif cmd == 'rig': do_rig(int(a[0]) if a else 0)
    elif cmd == 'render':
        SG = six(); systems = [x for x in a if x in SG.SYSTEMS] or list(SG.SYSTEMS)
        SG.do_render([ROW], systems, int(os.environ.get('BOHEMIA_WORKERS', '4')))
    elif cmd == 'hand': do_hand(a[0] if a else 'now')
    elif cmd == 'pack': do_pack()
    elif cmd in ('icon', 'alone'):
        import bohemia_direction_master_rig as MR
        _sp = MR.source_pass; MR.source_pass = lambda objs, wear, k, seed=0: _sp(objs, wear, k, int(TUNE['seed']))   # the loop's wear seed
        six().do_alone([ROW], icon=(cmd == 'icon'))
    elif cmd == 'card_render': do_card_render()
    elif cmd == 'card': do_card()
    elif cmd == 'sheet': do_sheet()
    elif cmd == 'bar': do_bar()
    elif cmd == 'manifest': do_manifest()
    else: sys.exit('model | rig <seed> | render [systems] | hand <tag> | pack | icon | alone | shelf | manifest')
