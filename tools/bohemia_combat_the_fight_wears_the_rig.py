#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [the fight wears the 3D models] (rule 121, Paolo 10/19: 'we have to do a full implementation of the 3D
models, that's top priority... it's just looking so fucking bad'; 'BRO EVERYTHING IS A 3D MODEL NOW FUCK THE UGLY 8 BIT
SHIT'). EVERY MAN AND EVERY ENEMY IN THE FIGHT IS HIS RIG MODEL.

WHAT THE FIGHT DREW (measured 10/19): slices/fight_people, 26 looks baked from the alpha's flat 112 rig (rule 69, 10/4),
two facings (SE, SW), a face painted at 64. The rig models of the same 26 people exist: PORTRAIT built every one of them
on the rig's man in its own skin (records/portrait/rig/crew/bodies: the player, the twelve cast, the thirteen gangs, each
from CHARACTER's tool and its LOOKS) and rendered each fresh head from it (rule 115(h)); COOK THREE built the six enemy
tiers (records/cook3/rig). None of them was in the fight.

THE STEPS (Blender's Python for the first two, plain python3 for the rest; bpy 4.2 in a python3.11 venv):
    <venv>/bin/python tools/bohemia_combat_the_fight_wears_the_rig.py bodies [LOOK|ALL]
        each look's body built by PORTRAIT's tool (--crew-body / --faction-body, CHARACTER's builder underneath, imported,
        never edited), then the fight's clips laid on its skeleton (tools/bohemia_combat_the_fight_poses.py):
        records/combat/rig/<look>.glb (regenerated, .gitignore)
    <venv>/bin/python tools/bohemia_combat_the_fight_wears_the_rig.py render [LOOK|ALL]
        DIRECTION's master rig, its code run as written with two changes made in memory and recorded in the pack: the
        movers' light pass is not rendered (round seven's anti-boil pass: five renders a key, 32 minutes a look on this
        box) and Cycles keeps its scene between renders (persistent data: the same pictures, sooner); samples 64 (--set,
        recorded as a break in rig.json). Clips Stand:1 Anim_0:6 Aim:3 Swing:3 Hit:2 Fall:3, eight facings:
        records/target/combat/rig/<look>/ (regenerated, .gitignore)
    python3 tools/bohemia_combat_the_fight_wears_the_rig.py pack
        one sheet per look for the fight, slices/fight_rig/<look>.webp, lossless: a row per facing (S, SE, E, NE, N, NW,
        W, SW, the fight's order), a column per drawn key, each cell the rig's ONE box, the one-pixel dark rim of the old
        sheets baked in (the day rim, rule 73a, so the page does no pixel work); the faces: PORTRAIT's fresh portrait of
        the same model (rig_portrait_S.png, 128 px head) on one sheet, slices/fight_rig/faces.webp; the index
        slices/fight_rig/fight_rig.json.

REUSE CHECK: the bodies are PORTRAIT's and CHARACTER's builders, the tiers COOK THREE's models, the render DIRECTION's master
rig; nothing is drawn by hand; the faces are PORTRAIT's renders of the same model, never a crop of the body (rule 115(h)).
REFERENCE CHECK (the 9/4 standing duty): the compare law: the VOTE card puts the old sheet (slices/fight_people) beside the
new at the fight's own pixels; analog horror AH-01; no reference game.
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BODIES = 'records/portrait/rig/crew/bodies'
POSED = 'records/combat/rig'
RENDERS = 'records/target/combat/rig'
OUT = 'slices/fight_rig'
CREW = ['you', 'cast_longcoat', 'cast_barearms', 'cast_widebrim', 'cast_poncho', 'cast_shortcoat', 'cast_apron', 'cast_cape', 'cast_pack',
        'cast_satchel', 'cast_skirt', 'cast_shorts', 'cast_bedroll']   # the bedroll: the roster can hand any cast look (engine/bohemia_roster.js lookFor)
GANGS = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless', 'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers']
# COOK THREE's tiers that carry PORTRAIT's starred head on their own body (records/portrait/rig/<tier>_head.glb): the face and
# the body one model. The raider, marauder, leader and marksman have no head yet; their bands keep the gangs' rig models.
TIERS = ['thug', 'poacher']
CLIPS = [('Stand', 1), ('Anim_0', 6), ('Aim', 3), ('Swing', 3), ('Hit', 2), ('Fall', 3)]
# THE BEASTS ON THE RIG (ANIMATION's redone dire wolf, the cave hyena, the feral shepherd, rendered by the master rig with
# their own Walk and Bite; the Hit and the Fall laid on by the poses tool): the dire wolf for the wolves, the hyena for the
# hyenas, the shepherd for the war dogs
BEASTS = ['dire_wolf_redone', 'cave_hyena', 'feral_dog_shepherd']
BEAST_CLIPS = [('Walk', 6), ('Bite', 6), ('Hit', 2), ('Fall', 3)]
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']   # a row per facing; the index is the fight's 8-way angle
SAMPLES = 64


def looks():
    """every look the fight dresses a man in, by the fight's own name (ours.people_looks), and where its body comes from"""
    out = [(c, 'crew', 'crew_' + c) for c in CREW] + [('faction_' + g, 'faction', g) for g in GANGS]
    out += [('tier_' + t, 'tier', t) for t in TIERS]
    out += [('beast_' + b.replace('_redone', ''), 'beast', b) for b in BEASTS]
    return out


def body_glb(kind, src):
    if kind == 'beast':
        return os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % src)
    if kind == 'tier':
        return os.path.join(ROOT, 'records/portrait/rig/%s_head.glb' % src)
    return os.path.join(ROOT, BODIES, src + '.glb')


def body_height(kind, src):
    if kind == 'tier':
        r = json.load(open(os.path.join(ROOT, 'records/target/portrait/rig', src, 'rig.json')))
        return r['real_dims_m'][2]
    return json.load(open(os.path.join(ROOT, BODIES, src + '.json')))['real_height_for_rig']


def pick(arg):
    return [l for l in looks() if arg.upper() == 'ALL' or l[0] == arg or l[2] == arg or arg.upper() == l[1].upper()]


def run(cmd, out=None):
    """bpy 4.2 headless dies now and then on this box (a SIGSEGV as Blender exits, after the file is written, measured 10/19):
    a run that wrote its output is a run that worked; else the same command again, three times at most"""
    import time
    for i in range(3):
        t0 = time.time()
        if subprocess.call(cmd, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0: return
        if out and os.path.exists(out) and os.path.getmtime(out) >= t0 - 1: return
    raise SystemExit('FAILED three times: ' + ' '.join(cmd))


def bodies(arg):
    py = sys.executable
    for name, kind, src in pick(arg):
        glb = body_glb(kind, src)
        if kind == 'crew':
            run([py, 'tools/bohemia_portrait_the_head_from_the_model.py', '--crew-body', name.upper()], glb)
        elif kind == 'faction':
            run([py, 'tools/bohemia_portrait_the_head_from_the_model.py', '--faction-body', src.capitalize()], glb)
        out = os.path.join(ROOT, POSED, name + '.glb')
        run([py, 'tools/bohemia_combat_the_fight_poses.py', glb, out] + (['--beast'] if kind == 'beast' else []), out)
        print('POSED', name, os.path.relpath(out, ROOT))


def render(arg):
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    assert src.count(a) == 1 and src.count(b) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))   # a worker of `batch` takes its share of the cores
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    for name, kind, srcname in pick(arg):
        glb = os.path.join(ROOT, POSED, name + '.glb')
        out = os.path.join(ROOT, RENDERS, name)
        size = (['--real-length', str(json.load(open(os.path.join(ROOT, 'records/target/master_rig', srcname, 'rig.json')))['real_dims_m'][1])]
                if kind == 'beast' else ['--real-height', str(body_height(kind, srcname))])
        argv = ['bohemia_direction_master_rig.py', glb, out] + size + ['--family', 'none', '--set', 'samples=%d' % SAMPLES, '--no-calibration', '--no-id-pass']
        for c, k in (BEAST_CLIPS if kind == 'beast' else CLIPS): argv += ['--clip', '%s:%d' % (c, k)]
        code = ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src
        run([sys.executable, '-c', code], os.path.join(out, 'rig.json'))
        print('RENDERED', name, os.path.relpath(out, ROOT), flush=True)


def batch(n):
    """every look not yet rendered, shared by n workers of two threads each (the clip holds are plain Python on one core,
    the renders are small: three workers keep this box's four cores busy where one Cycles at four threads does not)"""
    todo = [l[0] for l in looks() if not os.path.exists(os.path.join(ROOT, RENDERS, l[0], 'rig.json'))]
    env = dict(os.environ, BOHEMIA_RIG_THREADS='2')
    procs = []
    for w in range(n):
        mine = todo[w::n]
        if not mine: continue
        sh = ' && '.join('%s %s render %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()
    print('BATCH DONE', [l[0] for l in looks() if not os.path.exists(os.path.join(ROOT, RENDERS, l[0], 'rig.json'))], 'still missing')


COLS = [('stand', 'Stand', 1), ('walk', 'Anim_0', 6), ('aim', 'Aim', 3), ('swing', 'Swing', 3), ('hit', 'Hit', 2), ('fall', 'Fall', 3)]
RIM = (16, 11, 6, 230)   # the day rim of the old sheets (rule 73a), one pixel round the silhouette, baked so the page does no pixel work
FACE_PX = 128


def face_of(name, kind, src):
    """PORTRAIT's fresh portrait of the same model (rule 115(h)), square and sized by PORTRAIT: rest_128.png; the tiers' from
    PORTRAIT's head on the tier's own body (records/target/portrait/rig/<tier>/rig_portrait_S.png), squared on its own
    middle the way PORTRAIT squares the crew's"""
    from PIL import Image
    p = os.path.join(ROOT, 'records/target/portrait/crew', name, 'rest_128.png')
    if os.path.exists(p): return Image.open(p).convert('RGBA')
    p = os.path.join(ROOT, 'records/target/portrait/rig', src, 'rig_portrait_S.png')
    im = Image.open(p).convert('RGBA'); w, h = im.size; s = min(w, h)
    return im.crop(((w - s) // 2, h - s, (w - s) // 2 + s, h)).resize((FACE_PX, FACE_PX), Image.LANCZOS)


def pack():
    import numpy as np
    from PIL import Image
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    cols = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in COLS for k in range(ks)]
    clips, i = {}, 0
    for n, c, ks in COLS: clips[n] = list(range(i, i + ks)); i += ks
    index = dict(version='fight-rig-10-19', lane='combat', row='[the fight wears the 3D models]', rule='121, 115',
                 source='the rig models: PORTRAIT\'s bodies of the 26 (records/portrait/rig/crew/bodies, CHARACTER\'s builder), PORTRAIT\'s '
                        'thug and poacher (records/portrait/rig/*_head.glb, COOK THREE\'s tiers with the starred head), posed by '
                        'tools/bohemia_combat_the_fight_poses.py, rendered by DIRECTION\'s master rig (records/target/combat/rig/<look>/rig.json)',
                 render_changes=['the movers\' light pass not rendered (round seven anti-boil, five renders a key)', 'Cycles persistent data',
                                 'samples %d (--set, a break in each rig.json)' % SAMPLES],
                 dirs=FIGHT_DIRS, cols=cols, clips=clips, keys_per_beat=3, ruler=dict(px=98, m=1.72), rim=list(RIM), looks={}, faces=None)
    faces, order = [], []
    for name, kind, src in looks():
        d = os.path.join(ROOT, RENDERS, name)
        if not os.path.exists(os.path.join(d, 'rig.json')): continue
        r = json.load(open(os.path.join(d, 'rig.json')))
        x0, y0, x1, y1 = r['crop_box_px']; w, h = x1 - x0 + 2, y1 - y0 + 2
        sheet = Image.new('RGBA', (w * len(cols), h * len(FIGHT_DIRS)), (0, 0, 0, 0))
        cols_here = [('stand', None, 1), ('walk', 'Walk', 6), ('bite', 'Bite', 6), ('hit', 'Hit', 2), ('fall', 'Fall', 3)] if kind == 'beast' else COLS
        for row, f in enumerate(FIGHT_DIRS):
            col = 0
            for n, c, ks in cols_here:
                for k in range(ks):
                    fn = os.path.join(d, 'rig_%s_%s_k%02d.png' % (c, f, k)) if c else os.path.join(d, 'rig_%s.png' % f)
                    a = np.asarray(Image.open(fn).convert('RGBA')).copy()
                    a = np.pad(a, ((1, 1), (1, 1), (0, 0)))
                    op = a[..., 3] > 0
                    near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    a[near & ~op] = RIM
                    sheet.paste(Image.fromarray(a, 'RGBA'), (col * w, row * h)); col += 1
        # 256 colours a sheet, no dither (the render's grain is 48,000 colours a man; held to 256 the mean step is one value
        # of 255 and the sheet is half the bytes: a fight loads only the looks it wears, about ten)
        a = np.asarray(sheet); q = Image.fromarray(a[..., :3]).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        sheet = Image.fromarray(np.dstack([np.asarray(q), a[..., 3]]), 'RGBA')
        file = name + '.webp'
        sheet.save(os.path.join(ROOT, OUT, file), 'WEBP', lossless=True, quality=100, method=6)
        index['looks'][name] = dict(file=file, w=w, h=h, foot=[r['ground_px'][0] + 1, r['ground_px'][1] + 1], height_m=r['real_dims_m'][2],
                                    kind=kind, rig=os.path.relpath(os.path.join(d, 'rig.json'), ROOT))
        if kind == 'beast':   # a beast's own columns: its still, its walk, its bite (six keys), the blow, the fall
            index['looks'][name]['clips'] = dict(stand=[0], walk=list(range(1, 7)), bite=list(range(7, 13)), hit=[13, 14], fall=[15, 16, 17])
        else:
            faces.append(face_of(name, kind, src)); order.append(name)
        print('PACKED', name, sheet.size, os.path.getsize(os.path.join(ROOT, OUT, file)))
    fs = Image.new('RGBA', (FACE_PX * len(faces), FACE_PX), (0, 0, 0, 0))
    for i, f in enumerate(faces): fs.paste(f, (i * FACE_PX, 0))
    fs.save(os.path.join(ROOT, OUT, 'faces.webp'), 'WEBP', lossless=True, quality=100, method=6)
    index['faces'] = dict(file='faces.webp', size=FACE_PX, order=order, src='records/target/portrait/crew/<look>/rest_128.png (PORTRAIT)')
    json.dump(index, open(os.path.join(ROOT, OUT, 'fight_rig.json'), 'w'), indent=1)
    print('INDEX', os.path.join(OUT, 'fight_rig.json'), len(order), 'looks')


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'bodies': bodies(sys.argv[2] if len(sys.argv) > 2 else 'ALL')
    elif cmd == 'render': render(sys.argv[2] if len(sys.argv) > 2 else 'ALL')
    elif cmd == 'batch': batch(int(sys.argv[2]) if len(sys.argv) > 2 else 3)
    elif cmd == 'pack': pack()
    else: sys.exit('bodies | render | pack')
