#!/usr/bin/env python3
"""BOHEMIA -- ROBOT [the robots fight] (ask row 277, Paolo 11/2: 'One of the first things I was impressed by, graphic wise, art
asset wise, was that robot you made that was that Bohemian style... you don't even have those robots, you have characters with
gray skin instead of that robot... where did that robot go'; VAMILY rule 301 and 115(d): the HBO Crashbox vibe, rusty tin robots).

THE ROBOT HE LOVED is DIRECTION's master-rig robot: reference/models/quaternius/RobotExpressive.glb rendered by
tools/bohemia_direction_master_rig.py (records/target/master_rig/DIRECTION_THE_MASTER_RIG_ROBOT.png, rounds five and six,
the style guide). WHAT STOOD IN FOR IT (measured 11/2): the MECHANIC's machines (Battle Brothers' wiederganger and armored
wiederganger, ours.bestiary.mechanic.machines) wore the homeless, caravan, reds, blues and remnants men's sheets, washed grey and
green by the fight's chipBlit: men with grey skin.

THIS TOOL puts the same model in the fight, through the same pipe the fight's men go through:
    <venv>/bin/python tools/bohemia_robot_the_robots_fight.py render
        DIRECTION's master rig, its code run as written with the fight's own in-memory changes (the movers' light pass off,
        Cycles persistent data, samples 24, dents off: tools/bohemia_combat_the_fight_wears_the_rig.py render, the same three
        string patches) plus ONE more: a fight clip may name the model's own clip and the drawn keys as shares of it, so the
        robot's own Punch and Death give the swing, the hit and the fall (CLIP_SRC below). The model is never re-exported and
        never posed by hand: every key is a frame of the robot's own animation. Real height 1.72 m (DIRECTION's, every round),
        57 px a metre, the man's ruler: it stands at its own size beside a man.
        -> records/target/combat/rig/robot/ (regenerated, .gitignore)
    python3 tools/bohemia_robot_the_robots_fight.py pack
        slices/fight_rig/robot.webp: a row per facing (the fight's S, SE, E, NE, N, NW, W, SW), a column per drawn key
        (stand 1, walk 6, swing 3, hit 2, fall 3, idle 12), the fight's one-pixel day rim and its 64 colours, lossless, the
        same as every man's sheet; its look in slices/fight_rig/fight_rig.json (kind 'robot', its own clips); its face is
        DIRECTION's portrait of the same head (rig_portrait_S.png, ONE ID ONE WHOLE PERSON) on the fight's face sheet.

REUSE CHECK: the model, its materials, its clips and the renderer are DIRECTION's, unedited; the sheet layout, rim and colour
count are COMBAT's pack(); nothing is drawn by hand. REFERENCE CHECK (the 9/4 standing duty): the compare law: the proof card
puts the robot beside a man of the fight at the fight's own pixels; analog horror AH-01 (the rust and grime are the master rig's
source pass, at the source); no reference game.
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = 'reference/models/quaternius/RobotExpressive.glb'
RENDERS = 'records/target/combat/rig/robot'
OUT = 'slices/fight_rig'
NAME = 'robot'
HEIGHT_M = 1.72   # DIRECTION's robot in every round (records/target/master_rig/robot/rig.json real_dims_m[2])
# the fight's clip -> the robot's own clip and the drawn keys as shares of it (read off the robot's frames, 11/2: Death's
# first tenth is the blow rocking it back onto its heels, 0.2 it goes over, 0.35 it hits the ground, 1.0 it lies still;
# Punch's hand is furthest out at 0.3 to 0.4)
CLIP_SRC = {'Swing': ('Punch', [0.15, 0.35, 0.65]),
            'Hit': ('Death', [0.10, 0.03]),
            'Fall': ('Death', [0.20, 0.38, 1.0])}
CLIPS = [('Idle', 12), ('Walking', 6), ('Swing', 3), ('Hit', 2), ('Fall', 3)]   # Idle first: the still is its passing pose (DIRECTION round six)
# the sheet's columns: (the fight's clip name, the render's clip, keys); None = the still
COLS = [('stand', None, 1), ('walk', 'Walking', 6), ('swing', 'Swing', 3), ('hit', 'Hit', 2), ('fall', 'Fall', 3), ('idle', 'Idle', 12)]
SPAN_EXTRA_M = 1.0   # the camera's square 1 m wider than the standing robot needs: the fall's 2.78 m fits inside a 2.92 m half-width
SAMPLES = int(os.environ.get('BOHEMIA_RIG_SAMPLES', '24'))


def render():
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    pats = [('lights.append(light_footprint(', 'False and lights.append(light_footprint('),
            ("sc.render.engine = G['engine'];", "sc.render.use_persistent_data = True; sc.render.engine = G['engine'];"),
            ('def clip_actions(sc, name):', 'def clip_actions(sc, name):\n    return _clip_actions0(sc, CLIP_SRC.get(name, (name,))[0])\n\n\ndef _clip_actions0(sc, name):'),
            # THE FALL NEEDS ROOM: the camera's square is cut from the standing robot (span), but its own Death throws it back and its
            # head pops off and rolls: 2.78 m from where it stood at the last key (measured 11/2), against the square's 2.42 half-width
            ('span = math.hypot(dims[0], dims[1]) + dims[2] * zs + 0.6', 'span = math.hypot(dims[0], dims[1]) + dims[2] * zs + 0.6 + SPAN_EXTRA_M'),
            ('frames = [f0 + (f1 - f0) * (i + 0.5) / keys for i in range(keys)]',
             'frames = [f0 + (f1 - f0) * t for t in CLIP_SRC[name][1]] if name in CLIP_SRC else [f0 + (f1 - f0) * (i + 0.5) / keys for i in range(keys)]')]
    for a, b in pats:
        assert src.count(a) == 1, 'the master rig changed: re-read it before patching in memory (%s)' % a
        src = src.replace(a, b)
    out = os.path.join(ROOT, RENDERS)
    argv = ['bohemia_direction_master_rig.py', os.path.join(ROOT, MODEL), out, '--real-height', str(HEIGHT_M), '--family', 'none',
            '--set', 'samples=%d' % SAMPLES, '--no-calibration', '--no-id-pass', '--set', 'dent_m=0']
    for c, k in CLIPS: argv += ['--clip', '%s:%d' % (c, k)]
    code = ('import sys; sys.argv = %r; __file__ = %r; CLIP_SRC = %r; SPAN_EXTRA_M = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'), CLIP_SRC, SPAN_EXTRA_M)) + src
    for i in range(3):   # bpy 4.2 headless dies now and then as Blender exits, after the files are written (COMBAT, 10/19)
        rc = subprocess.call([sys.executable, '-c', code], cwd=ROOT)
        if os.path.exists(os.path.join(out, 'rig.json')): break
    print('RENDERED', RENDERS, rc)


def face():
    """DIRECTION's portrait of the same head (records/target/master_rig/robot/rig_portrait_S.png), squared on its own middle at
    the fight's face size, the way COMBAT's pack squares a tier's"""
    from PIL import Image
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    from bohemia_combat_the_fight_wears_the_rig import FACE_PX
    im = Image.open(os.path.join(ROOT, 'records/target/master_rig/robot/rig_portrait_S.png')).convert('RGBA'); w, h = im.size; s = min(w, h)
    return im.crop(((w - s) // 2, h - s, (w - s) // 2 + s, h)).resize((FACE_PX, FACE_PX), Image.LANCZOS)


def entry():
    """the robot's look in the fight's index: its own clips (aim and the carry fall back to its own swing and walk: it holds no gun)"""
    cols, i = {}, 0
    for n, c, ks in COLS: cols[n] = list(range(i, i + ks)); i += ks
    cols['aim'] = cols['swing']; cols['carry'] = cols['stand']; cols['carrywalk'] = cols['walk']
    return cols, i


def pack():
    import numpy as np
    from PIL import Image
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    from bohemia_combat_the_fight_wears_the_rig import RIM, SHEET_COLOURS, FIGHT_DIRS, FACE_PX
    d = os.path.join(ROOT, RENDERS)
    r = json.load(open(os.path.join(d, 'rig.json')))
    x0, y0, x1, y1 = r['crop_box_px']; w, h = x1 - x0 + 2, y1 - y0 + 2
    clips, ncol = entry()
    sheet = Image.new('RGBA', (w * ncol, h * len(FIGHT_DIRS)), (0, 0, 0, 0))
    for row, f in enumerate(FIGHT_DIRS):
        col = 0
        for n, c, ks in COLS:
            for k in range(ks):
                fn = os.path.join(d, 'rig_%s_%s_k%02d.png' % (c, f, k)) if c else os.path.join(d, 'rig_%s.png' % f)
                a = np.pad(np.asarray(Image.open(fn).convert('RGBA')).copy(), ((1, 1), (1, 1), (0, 0)))
                op = a[..., 3] > 0
                near = np.zeros_like(op)
                near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                a[near & ~op] = RIM
                sheet.paste(Image.fromarray(a, 'RGBA'), (col * w, row * h)); col += 1
    a = np.asarray(sheet); q = Image.fromarray(a[..., :3]).quantize(SHEET_COLOURS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    sheet = Image.fromarray(np.dstack([np.asarray(q), a[..., 3]]), 'RGBA')
    file = NAME + '.webp'
    sheet.save(os.path.join(ROOT, OUT, file), 'WEBP', lossless=True, quality=100, method=6)
    ip = os.path.join(ROOT, OUT, 'fight_rig.json'); index = json.load(open(ip))
    index['looks'][NAME] = dict(file=file, w=w, h=h, foot=[r['ground_px'][0] + 1, r['ground_px'][1] + 1], height_m=r['real_dims_m'][2],
                                kind='robot', rig=os.path.relpath(os.path.join(d, 'rig.json'), ROOT), clips=clips,
                                src='ROBOT [the robots fight] 11/2: DIRECTION\'s master-rig robot (%s), tools/bohemia_robot_the_robots_fight.py' % MODEL)
    # its face on the fight's face sheet, once (the sheet is lossy at 85 like COMBAT's pack writes it)
    F = index['faces']
    if NAME not in F['order']:
        fs = Image.open(os.path.join(ROOT, OUT, F['file'])).convert('RGBA'); n = len(F['order'])
        big = Image.new('RGBA', (FACE_PX * (n + 1), FACE_PX), (0, 0, 0, 0)); big.paste(fs.crop((0, 0, FACE_PX * n, FACE_PX)), (0, 0))
        big.paste(face(), (FACE_PX * n, 0)); big.save(os.path.join(ROOT, OUT, F['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
        F['order'].append(NAME)
    json.dump(index, open(ip, 'w'), indent=1)
    # the map's small index (the map draws the same sheet as a person and never loads the fight's whole index); bytes: the map
    # takes the packed atlas (slices/fight_rig/packed, the demo's cut) only when it was cut from this very sheet, as the fight does
    L = index['looks'][NAME]
    json.dump(dict(file=file, bytes=os.path.getsize(os.path.join(ROOT, OUT, file)), w=w, h=h, foot=L['foot'], dirs=FIGHT_DIRS, clips=clips, height_m=L['height_m'], src=L['src']),
              open(os.path.join(ROOT, OUT, NAME + '.json'), 'w'), indent=1)
    print('PACKED', NAME, sheet.size, os.path.getsize(os.path.join(ROOT, OUT, file)), 'faces', len(F['order']))


if __name__ == '__main__':
    {'render': render, 'pack': pack}[sys.argv[1]]()
