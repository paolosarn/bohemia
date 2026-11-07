#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the crawl] (rule 390, Paolo 11/4: 'make an animation of people crawling on the floor... a fucked up
scary sad murders type of crawl... plenty of ways we can use that... or make a job for it'). ONE GOLDEN PIECE (rule 408(b)),
made by DIRECTION's common recipe (records/BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md part 3).

THE REAL THING FIRST (recipe step 3; reference/library/walk-cycle/INDEX.md WALK-04 to WALK-06, cited in the record):
  - the low crawl (US Army FM 21-75, ch. 3, and the ROTC text that copies it): the body pressed flat, the arms pushed out ahead,
    the body PULLED up to them, the head low; the slowest way a man moves.
  - care under fire (TCCC): a casualty who can is told to move himself to cover; one who cannot lies flat and still.
  - the belly ('commando') crawl: on the stomach, pulled along by the arms, the legs dragging behind, the body swaying side to
    side as each arm pulls.
  So: the arms do all of it, a pull moves him 15 to 20 cm (a hand's reach less the slack), the hand that pulls stays where it
  was put while the body comes to it, the legs are dragged, and he stops when he cannot.

ONE CRAWL, THREE WEIGHTS (rule 390(a)), on the rig's man (the skeleton every person is built on), every key HELD (three a
beat at 120, Crashbox stop-motion, rule 115(d); nothing between two keys is drawn):
  THE ROLL    once, from the fight's own fall (COMBAT's last Fall key, on his back): onto his side, onto his belly
  THE DRAG    the legs dead, the RIGHT arm pulling, the LEFT stretched out ahead reaching, never pulling; one pull a bar,
              the reach stutters (a held key half way: the hitch), the body swings toward the pulling arm
  THE ELBOWS  low, slow, the head down: both forearms in turn, a pull every bar, the forehead near the ground
  THE LAST    a few inches: one weak reach, a short pull, a stop, the head goes down on its cheek, the hand opens (the wrist
              rolls, the arm goes slack); held there
THE SLIDE: the body is rendered IN PLACE (his pelvis on his foot point, so every cell sits on his own fight cell's ground) and
every key carries how far he has come (model units, along the way he crawls); the screen moves the picture by it, so a hand
put down stays on its pixel while his body comes up to it (the pull's hand targets are its plant minus the slide: made so
here, never by hand). The roll starts where the fall left his pelvis (BASE, measured on his model, recorded in the pack).
He crawls the way his head lies after the fall: AWAY from the man he faced when he fell, toward his own side (the crawl's
facing is the fall's + 4).

THE STEPS (Blender's Python for pose/render: bpy 4.2 in a python3.11 venv, as the master rig; plain python3 for the rest):
    python3 tools/bohemia_animation_the_crawl.py source
        records/target/animation/BOHEMIA_THE_CRAWL.json, the kept source (rule 128), from the numbers below
    <venv>/bin/python tools/bohemia_animation_the_crawl.py pose <in.glb> <out.glb>
        the four clips laid on any man by the town's own pose step (its LIE and REACH, imported and called, pointed at this
        source), joints beside it (<out>.joints.json, the envelope gate's ruler)
    <venv>/bin/python tools/bohemia_animation_the_crawl.py render [LOOK]
        COMBAT's posed man (records/combat/rig/<look>.glb, its `bodies` when missing), posed here, rendered by COMBAT's
        render() over DIRECTION's master rig (the same camera, sun, scale and samples as his fight sheet; Stand first so
        his box is his own) into records/target/animation/crawl/<look>/; joints kept in records/animation/crawl_joints/
    node tools/bohemia_animation_the_crawl_capture.js, then python3 tools/bohemia_animation_the_crawl.py shots
        the real fight on the phone's profile: the crawl's pictures at each weight and the whole phone screen
        (records/target/animation/crawl_shots/*.webp, the VOTE card's surface)
    python3 tools/bohemia_animation_the_crawl.py pack
        slices/rig_crawl/<look>.webp (every pose, eight facings, each cell cut to what is drawn, his fight sheet's own
        colours and its one-pixel rim), slices/rig_crawl/<look>.json, slices/rig_crawl/rig_crawl.json (the clips, the
        program, the slide)
    engine/bohemia_crawl.js plays it; the fight draws it in its __THE_CRAWL__ block.

REUSE CHECK: the body is COMBAT's posed man (PORTRAIT's whole person, CHARACTER's builder); the pose step is the town's
(tools/bohemia_animation_the_towns_activities.py pose: LIE, REACH, the joints), imported and called; the roll's first key is
COMBAT's own last Fall key (tools/bohemia_combat_the_fight_poses.py man_keys, read, never copied by hand); the render is
COMBAT's render() over DIRECTION's master rig; the pack is the idles' (their cut, rim and palette, the same numbers); nothing
drawn by hand. REFERENCE CHECK (the 9/4 standing duty): WALK-04 the low crawl, WALK-05 care under fire, WALK-06 the belly
crawl, WALK-03 the controlled fall; AH-01 the ordinary frame with one wrong thing; the bar: body_thug_S (his love words
10/18) and the town is alive (motion's bar, a page); twin of every key: the same man's own fall cell on his fight sheet.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))

SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_THE_CRAWL.json')
POSED = 'records/animation/crawl'                    # the posed models (regenerated, .gitignore)
RENDERS = 'records/target/animation/crawl'           # the master rig's renders (regenerated, .gitignore)
JOINTS_KEPT = 'records/animation/crawl_joints'       # every man's posed joints, committed (the gate's ruler where renders are not)
OUT = 'slices/rig_crawl'
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']  # the fight's order (a row per facing)
LOOKS = ['cast_barearms']                            # the golden piece: one man of his company (rule 408(b): one, not a batch)
ACTS = ['roll', 'drag', 'elbows', 'last']


def clip(act):
    return 'Crawl' + act.capitalize()


# ------------------------------------------------------------------------------------------------ the source (the numbers)
# Model units (the rig's man: 1.52 tall, so about 0.89 of a real metre; the pack records his own scale). A REACH is the town's:
# ['REACH', side, 'G', [f, u, l], pole [f, u, l]]: the hand carried to the floor point under his pelvis plus [f, u, l] (f ahead
# of him along the floor, u up off it, l to his left), the elbow toward the pole. Every other op is in the STANDING frame
# before he is laid down (the town's LIE tips the whole man about his pelvis): about L, + tips forward (so the head tilted
# back, -, lifts the face off the ground when he lies on his belly); about F, + leans to his left (lying, a turn of the
# shoulders along the floor); about U, + turns to his left (lying, a roll of the head onto its cheek).
PRONE = ['LIE', -90, 0, 0.10]                # on his belly, the head ahead, the pelvis 10 cm (of model) off the floor
# THE LEGS ARE DEAD: straight behind him, apart, the toes pointed back so the tops of the feet lie on the ground, the right
# turned out and a little bent (a leg nobody is holding falls open); they are dragged, never used
LEGS = [['LT', 'F', 6], ['RT', 'F', -5], ['RT', 'U', -22], ['RS', 'L', 12], ['LA', 'L', 55], ['RA', 'L', 42]]
SWAY_R = [['S', 'F', -3], ['C', 'F', -4], ['LT', 'F', 3], ['RT', 'F', 3]]   # the shoulders swing to the pulling arm, the hips the other way
SWAY_L = [['S', 'F', 3], ['C', 'F', 4], ['LT', 'F', -3], ['RT', 'F', -3]]
HEAD_DOWN_R = [['N', 'L', 8], ['H', 'U', -38]]   # the head down on the floor, the face turned toward the right arm
HEAD_LIFT = [['N', 'L', -14], ['H', 'L', -14]]   # looking along the ground to where he is going
HEAD_STRAIN = [['N', 'L', -20], ['H', 'L', -20], ['S', 'L', -4], ['C', 'L', -6]]   # the pull: the chest comes up, the face with it
HEAD_LOW = [['N', 'L', 12], ['H', 'L', 10], ['S', 'L', -4], ['C', 'L', -5]]        # the elbows: propped a little, the forehead down
BREATH = [['MOVE', 'C', [-0.022, 0, 0]]]         # standing back = lying up: his back rises on the breath

# the poles: the elbow up and out when an arm pulls, down and out when a forearm lies on the ground
POLE_PULL_R, POLE_LIFT_R, POLE_REST_R = [-0.5, 1, -0.5], [-0.2, 1, -0.7], [-0.2, 1, -0.7]   # one family from the rest to the reach: the elbow never hops
POLE_REACH_L = [0, 1, 0.3]
POLE_FORE_L, POLE_FORE_R = [0.5, -1, 1], [0.5, -1, -1]


def reach(side, at, pole):
    return ['REACH', side, 'G', [round(x, 4) for x in at], pole]


def build_source():
    P = {}   # pose -> ops
    ACT = {a: [] for a in ACTS}
    def pose(act, name, ops):
        P[name] = ops; ACT[act].append(name)

    # THE ROLL: the first key is COMBAT's own last Fall key (his still on his back), laid in this frame (the crawl faces the
    # other way: his head lies where his back was), then onto his right side and over onto his belly
    import bohemia_combat_the_fight_poses as CP
    B = json.load(open(os.path.join(ROOT, 'records/target/animation/BOHEMIA_EVERYBODY_IDLES.json')))['bones']
    short = {v: k for k, v in B.items()}
    AXN = {(1, 0, 0): 'F', (0, -1, 0): 'U', (0, 0, 1): 'L'}
    still = [k for k in CP.man_keys()['Fall'][-1] if k[0] != 'ROOT']
    # COMBAT turns its bones AFTER the root has tipped him (its ROOT op sorts first), about the world's axes; this source turns
    # them BEFORE he is laid down. A turn about world axis a after the tip R is a turn about R^-1 a before it (R = -90 about L:
    # world F is standing -U, world U is standing F, L stays), so: F d -> U -d, U d -> F d, L d -> L d
    CONJ = {'F': ('U', -1), 'U': ('F', 1), 'L': ('L', 1)}
    fall_ops = [[short[b], CONJ[AXN[tuple(ax)]][0], CONJ[AXN[tuple(ax)]][1] * d] for b, ax, d in still]
    SUPINE = ['LIE', -90, 180, 0.10]        # = COMBAT's ROOT -90 about L, seen from the other side (the record shows the algebra)
    pose('roll', 'RO1', fall_ops + [SUPINE])
    pose('roll', 'RO1b', [o for o in fall_ops if o[0] not in ('LU', 'LF', 'RU', 'RF', 'H')] + [['H', 'U', -10], ['LIE', -90, 152, 0.11],
         reach('L', [0.08, 0.30, -0.04], [0, 1, 0.5]), reach('R', [0.08, 0.22, 0.06], [0, 1, -0.5])])   # the head turns, the left arm starts over him
    pose('roll', 'RO1c', [o for o in fall_ops if o[0] in ('LT', 'LS', 'RT', 'RS')] + [['H', 'U', -14], ['LIE', -90, 122, 0.13],
         reach('L', [0.26, 0.22, 0.08], [0.2, 1, 0.4]), reach('R', [0.24, 0.15, -0.02], [0, 0.6, -1])])   # half over: both arms come up past his face
    pose('roll', 'RO2', LEGS[:2] + [['LT', 'L', -25], ['LS', 'L', 30], ['H', 'L', 6], ['LIE', -90, 90, 0.15],
         reach('L', [0.38, 0.03, 0.24], [0.2, 1, 0.3]), reach('R', [0.46, 0.08, -0.07], [0.4, 0.7, -1])])   # on his right side (the right arm comes over ahead of him, the elbow up), the left hand down ahead of him
    pose('roll', 'RO3', LEGS + [['H', 'U', -20], ['N', 'L', 6], ['LIE', -90, 35, 0.12],
         reach('L', [0.62, 0.02, 0.24], POLE_REACH_L), reach('R', [0.66, 0.02, -0.12], POLE_REST_R)])

    # THE DRAG: the right hand put down ahead and pulled to; the left arm out ahead along the ground, reaching, dragged
    L_OUT = [0.80, 0.025, 0.32]                   # out past his head, so it reads from the side
    RP = [0.80, 0.015, -0.19]                       # where the right hand is put down (ahead of his head, inside his reach: 0.445 of arm)
    DRAG = [0.05, 0.10, 0.14]                       # how far he has come at each key of the pull (model units)
    rest_R = [RP[0] - DRAG[-1], RP[1], RP[2]]
    base = LEGS + [PRONE, reach('L', L_OUT, POLE_REACH_L)]
    pose('drag', 'D_rest', base[:-1] + HEAD_DOWN_R + [PRONE, reach('L', L_OUT, POLE_REACH_L), reach('R', rest_R, POLE_REST_R)])
    pose('drag', 'D_in', base[:-1] + HEAD_DOWN_R + BREATH + [PRONE, reach('L', L_OUT, POLE_REACH_L), reach('R', rest_R, POLE_REST_R)])
    # the hand rises less than it goes forward (rise under forward x 0.7), so on the camera facing him it never hops up and back
    pose('drag', 'D_lift', base + HEAD_LIFT + [reach('R', [rest_R[0] + 0.04, 0.04, -0.20], POLE_LIFT_R)])
    pose('drag', 'D_reach1', base + HEAD_LIFT + [reach('R', [rest_R[0] + 0.08, 0.045, -0.20], POLE_LIFT_R)])   # THE STUTTER: held half way
    pose('drag', 'D_reach2', base + HEAD_STRAIN + [reach('R', [RP[0] - 0.01, 0.03, -0.19], POLE_LIFT_R)])   # the face comes up before the hand lands
    pose('drag', 'D_plant', base + HEAD_STRAIN + [reach('R', RP, POLE_PULL_R)])
    for i, s in enumerate(DRAG):
        pose('drag', 'D_pull%d' % (i + 1), base + HEAD_STRAIN + SWAY_R + [reach('R', [RP[0] - s, RP[1], RP[2]], POLE_PULL_R)])

    # THE ELBOWS: both forearms flat, in turn; each put down at FP ahead and pulled to; one arm's pull carries the other back
    FP = 0.70; EP = [0.02, 0.04, 0.05]; S1 = EP[-1]   # a forearm flat: shoulder to wrist 0.32 of the 0.445 arm, the elbow bent near square
    def fore(side, f, u=0.015):
        return reach(side, [f, u, 0.22 if side == 'L' else -0.22], POLE_FORE_L if side == 'L' else POLE_FORE_R)   # wide of his head, the elbow out and down
    eb = LEGS + HEAD_LOW + [PRONE]
    pose('elbows', 'IE1', LEGS + HEAD_DOWN_R + [PRONE, reach('L', [0.74, 0.05, 0.30], [0.3, 0.3, 1]), fore('R', FP - S1)])
    pose('elbows', 'E_rest', eb + [fore('L', FP - 2 * S1), fore('R', FP - S1)])
    pose('elbows', 'E_in', eb + BREATH + [fore('L', FP - 2 * S1), fore('R', FP - S1)])
    pose('elbows', 'EL_lift', eb + [fore('L', FP - 0.04, 0.05), fore('R', FP - S1)])
    pose('elbows', 'EL_out', eb + [fore('L', FP), fore('R', FP - S1)])
    for i, s in enumerate(EP):
        pose('elbows', 'EL_p%d' % (i + 1), eb + SWAY_L + [fore('L', FP - s), fore('R', FP - S1 - s)])
    pose('elbows', 'ER_lift', eb + [fore('L', FP - S1), fore('R', FP - 0.04, 0.05)])
    pose('elbows', 'ER_out', eb + [fore('L', FP - S1), fore('R', FP)])
    for i, s in enumerate(EP[:-1]):
        pose('elbows', 'ER_p%d' % (i + 1), eb + SWAY_R + [fore('L', FP - S1 - s), fore('R', FP - s)])

    # THE LAST: a few inches, a stop, the hand that opens
    LP = [FP + 0.04, 0.015, -0.20]; LS = [0.015, 0.03]   # one weak reach, a hand's width past where his forearm lay
    pose('last', 'LA1', eb + [fore('L', FP - 2 * S1), reach('R', [FP, 0.035, -0.21], POLE_LIFT_R)])
    pose('last', 'LA2', eb + [fore('L', FP - 2 * S1), reach('R', LP, POLE_PULL_R)])
    pose('last', 'LA3', eb + [fore('L', FP - 2 * S1 - LS[0]), reach('R', [LP[0] - LS[0], LP[1], LP[2]], POLE_PULL_R)])
    pose('last', 'LA4', eb + [fore('L', FP - 2 * S1 - LS[1]), reach('R', [LP[0] - LS[1], LP[1], LP[2]], POLE_PULL_R)])
    pose('last', 'LA5', LEGS + HEAD_DOWN_R + [['N', 'L', 14], PRONE, reach('L', [0.46, 0.015, 0.23], [-0.6, 0.2, 0.8]),
         reach('R', [LP[0] - LS[1], LP[1], LP[2]], POLE_REST_R)])
    pose('last', 'LA6', LEGS + HEAD_DOWN_R + [['N', 'L', 14], ['RH', 'U', 100], PRONE, reach('L', [0.26, 0.015, 0.17], [-1, 0.2, 0.3]),
         reach('R', [LP[0] - LS[1] + 0.05, 0.012, LP[2] - 0.04], [0, 0.3, -1])])   # the elbow goes flat, the arm slides out, the palm rolls up; the left hand lies at his ribs (an arm lying away from the camera reads raised)

    # THE TIMELINES: [pose, keys held, how far he has come at that key]; three keys a beat, twelve a bar
    D3 = DRAG[-1]
    TL = {
        'roll': [['RO1', 2, 0], ['RO1b', 2, 0], ['RO1c', 2, 0], ['RO2', 2, 0], ['RO3', 2, 0], ['D_rest', 2, 0]],
        'drag': [['D_lift', 1, 0], ['D_reach1', 3, 0], ['D_reach2', 2, 0], ['D_plant', 1, 0], ['D_pull1', 1, DRAG[0]],
                 ['D_pull2', 1, DRAG[1]], ['D_pull3', 2, D3], ['D_rest', 1, D3]],   # the hitch held three, the hand down ON beat three
        'drag_breath': [['D_rest', 3, 0], ['D_in', 3, 0], ['D_rest', 3, 0], ['D_in', 3, 0]],
        'into_elbows': [['IE1', 3, 0], ['E_rest', 3, 0]],
        'elbows': [['EL_lift', 3, 0], ['EL_out', 3, 0], ['EL_p1', 2, EP[0]], ['EL_p2', 2, EP[1]], ['EL_p3', 2, S1],
                   ['ER_lift', 3, S1], ['ER_out', 3, S1], ['ER_p1', 2, S1 + EP[0]], ['ER_p2', 2, S1 + EP[1]], ['E_rest', 2, 2 * S1]],   # each forearm down ON beat two of its bar
        'elbows_breath': [['E_rest', 3, 0], ['E_in', 3, 0], ['E_rest', 3, 0], ['E_in', 3, 0]],
        'last': [['LA1', 3, 0], ['LA2', 3, 0], ['LA3', 2, LS[0]], ['LA4', 4, LS[1]], ['LA5', 6, LS[1]], ['LA6', 6, LS[1]]],
    }
    # THE ARC (one man, once): stunned on his back, the roll, the drag twice with his breath between, the elbows, the last;
    # then he lies there, the hand open. Every clip is whole bars or whole halves, so every pull lands on the bar.
    PROGRAM = ['roll', 'drag_breath', 'drag', 'drag_breath', 'drag_breath', 'drag', 'drag_breath', 'into_elbows', 'elbows',
               'elbows_breath', 'elbows_breath', 'last']
    T = {
        'what': "ANIMATION [the crawl] (rule 390, Paolo 11/4: 'a fucked up scary sad murders type of crawl'). THE KEPT SOURCE "
                "(rule 128), written by tools/bohemia_animation_the_crawl.py source from its numbers. One crawl, three weights "
                "(the drag, the elbows, the last) and the roll from COMBAT's fall, in the town tool's format (parts, activities, "
                "timelines) so its pose step lays it on any man; the timelines here carry a third number, how far he has come "
                "(model units along the way he crawls), which the screen adds so a hand put down stays put.",
        'keys': 'three a beat at 120, held (Crashbox stop-motion, rule 115(d)); 12 a bar',
        'units': 'model units of the rig\'s man (the pack records each man\'s rig px a unit)',
        'facing': 'the crawl faces the fall + 4: his head lies where his back was, so he crawls away from the man he faced',
        'parts': P, 'props': {},
        'activities': {a: {'set': 'crawl', 'what': a, 'rest': ACT[a][0], 'props': {}, 'poses': {n: [n] for n in ACT[a]}} for a in ACTS},
        'timelines': TL, 'program': PROGRAM,
        'advance': {k: v[-1][2] for k, v in TL.items()},
        'never_adjacent': [],
    }
    return T


def source():
    return json.load(open(SRC))


def write_source():
    T = build_source()
    os.makedirs(os.path.dirname(SRC), exist_ok=True)
    with open(SRC, 'w') as f: json.dump(T, f, indent=1); f.write('\n')
    n = sum(h for k in T['program'] for _, h, _ in T['timelines'][k])
    print('SOURCE', os.path.relpath(SRC, ROOT), len(T['parts']), 'poses,', n, 'keys in the arc,', round(sum(T['advance'][k] for k in T['program']), 3), 'units crawled')


# ------------------------------------------------------------------------------------------------ pose (bpy): the town's own step
def town():
    import bohemia_animation_the_towns_activities as TA
    TA.SRC = SRC; TA.MARCH_SRC = os.path.join(ROOT, 'records/target/animation/__no_march__.json'); TA.clip = clip
    return TA


def pose(src, out):
    town().pose(src, out, ','.join(ACTS))


# ------------------------------------------------------------------------------------------------ render
def render(name):
    import bohemia_animation_everybody_idles as EI
    T = source(); CF = EI.combat(); py = sys.executable
    src = os.path.join(ROOT, EI.COMBAT_POSED, name + '.glb')
    if not os.path.exists(src): EI.run([py, 'tools/bohemia_combat_the_fight_wears_the_rig.py', 'bodies', name], src)
    posed = os.path.join(ROOT, POSED, name + '.glb')
    EI.run([py, os.path.abspath(__file__), 'pose', src, posed], posed)
    CF.POSED, CF.RENDERS = POSED, RENDERS
    CF.render(name, clips=[('Stand', 1)] + [(clip(a), len(T['activities'][a]['poses'])) for a in ACTS], suffix='')
    out = os.path.join(ROOT, RENDERS, name)
    r = subprocess.run([py, os.path.abspath(__file__), 'base', src], cwd=ROOT, capture_output=True, text=True)
    bl = [l for l in r.stdout.splitlines() if l.startswith('BASE ')]
    if not bl: raise SystemExit('the fall\'s pelvis was not read: ' + r.stderr[-400:])
    json.dump(json.loads(bl[-1][5:]), open(os.path.join(out, 'base.json'), 'w'))
    os.makedirs(os.path.join(ROOT, JOINTS_KEPT), exist_ok=True)
    J = json.load(open(posed[:-4] + '.joints.json'))
    json.dump(J, open(os.path.join(ROOT, JOINTS_KEPT, name + '.json'), 'w'), separators=(',', ':'))
    os.replace(posed[:-4] + '.joints.json', os.path.join(out, 'joints.json'))
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    print('CRAWL rendered', name, flush=True)


# ------------------------------------------------------------------------------------------------ the fall's pelvis (bpy)
def base(src):
    """where COMBAT's last Fall key leaves his pelvis, along the way he will crawl (model units): the roll starts there"""
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    sc = bpy.context.scene; arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    fa = [a for a in bpy.data.actions if a.name.startswith('Fall')][0]
    arm.animation_data.action = fa; sc.frame_set(5); bpy.context.view_layer.update()   # key 2 of 3 at frame 2k+1 (COMBAT's poses tool)
    h = arm.pose.bones['Skeleton_torso_joint_1'].head
    print('BASE', json.dumps({'f': round(-h.dot(mathutils.Vector((1, 0, 0))), 4), 'l': round(-h.dot(mathutils.Vector((0, 0, 1))), 4)}))


# ------------------------------------------------------------------------------------------------ pack (python3)
def pack():
    import numpy as np
    from PIL import Image
    T = source()
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    RIM = tuple(FR['rim']); thr = int(G['alpha_threshold'])
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    index = dict(version='rig-crawl-11-7', lane='animation', row='[the crawl]', rule='390, 408(b), 128',
                 source='records/target/animation/BOHEMIA_THE_CRAWL.json (the poses, the timelines, the slide), laid on COMBAT\'s posed men '
                        'by tools/bohemia_animation_the_crawl.py, rendered by DIRECTION\'s master rig the way COMBAT renders the fight',
                 dirs=DIRS, keys_per_beat=3, timelines=T['timelines'], program=T['program'], advance=T['advance'],
                 facing=T['facing'], cell='[x, y, w, h, dx, dy]: the cell on the sheet and where its top left sits from the look\'s '
                 'fight-sheet cell origin, with the pelvis on his foot point; add the slide (units x ppu along his crawl facing, the '
                 'master rig\'s 45 degree camera: x = d sin(45 i), y = d cos(45 i) 0.7071)', looks={})
    for look in LOOKS:
        d = os.path.join(ROOT, RENDERS, look)
        if not os.path.exists(os.path.join(d, 'rig.json')): print('SKIP', look, 'not rendered'); continue
        rj = json.load(open(os.path.join(d, 'rig.json'))); fl = FR['looks'][look]
        cx0, cy0, cx1, cy1 = rj['crop_box_px']
        fx0 = cx0 + rj['ground_px'][0] - fl['foot'][0]; fy0 = cy0 + rj['ground_px'][1] - fl['foot'][1]
        sheet = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        pal = np.array(sorted(set(map(tuple, sheet[sheet[..., 3] > 0][:, :3].tolist()))), np.int32)
        def to_pal(a):
            u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
            dd = ((u.astype(np.int32)[:, None, :] - pal[None, :, :]) ** 2).sum(2)
            a[..., :3] = pal[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
        def full(fn):
            a = np.asarray(Image.open(fn).convert('RGBA')).copy()
            if a.shape[0] != rj['res']:
                z = np.zeros((rj['res'], rj['res'], 4), np.uint8); z[cy0:cy1, cx0:cx1] = a; a = z
            return a
        def cut(a):   # the idles' cut: what is drawn, the one-pixel day rim round it
            op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
            ys, xs = np.nonzero(op)
            if not len(xs): return None
            y0, y1, x0, x1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
            a = np.pad(a, ((1, 1), (1, 1), (0, 0)))[y0 + 1:y1 + 1, x0 + 1:x1 + 1].copy(); op = a[..., 3] > 0
            near = np.zeros_like(op)
            near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
            a[near & ~op] = RIM
            return a, x0, y0
        items, cells = [], {}
        for a_ in ACTS:
            for pi, p in enumerate(T['activities'][a_]['poses']):
                for row, f in enumerate(DIRS):
                    r = cut(full(os.path.join(d, 'rig_%s_%s_k%02d.png' % (clip(a_), f, pi))))
                    if r is None: continue
                    a, x0, y0 = r
                    cells.setdefault(p, [None] * 8)[row] = len(items); items.append((to_pal(a), x0 - fx0, y0 - fy0))
        order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items); width = 2048
        for i in order:
            h, w = items[i][0].shape[:2]
            if x + w > width: x = 0; y += sh; sh = 0
            rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
        im = Image.new('RGBA', (width, y + sh), (0, 0, 0, 0))
        for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
        im.save(os.path.join(ROOT, OUT, look + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        meta = json.load(open(os.path.join(d, 'base.json')))
        entry = dict(fight=fl['file'], foot=fl['foot'], file=look + '.webp', size=list(im.size), cells=rects, poses=cells,
                     ppu=round(rj['scale_from_model'] * rj['ppm'], 3), base=meta['f'],
                     ppu_why='rig px a model unit: the master rig\'s scale_from_model (his metres a unit) x 57 px a metre',
                     base_why='where COMBAT\'s last Fall key leaves his pelvis, along the crawl (units): the roll starts there')
        json.dump(entry, open(os.path.join(ROOT, OUT, look + '.json'), 'w'), separators=(',', ':'))
        index['looks'][look] = dict(json=look + '.json')
        print('PACKED', look, im.size, len(items), 'cells', flush=True)
    json.dump(index, open(os.path.join(ROOT, OUT, 'rig_crawl.json'), 'w'), separators=(',', ':'))
    print('INDEX', os.path.join(OUT, 'rig_crawl.json'), len(index['looks']), 'looks')


def shots():
    """the capture's browser pictures (PNG, the only lossless kind a page screenshot gives) into webp beside them: the phone's
    whole screen lossy at 88, the close cuts at 92; the PNGs go (tools/bohemia_animation_the_crawl_capture.js writes them)"""
    from PIL import Image
    d = os.path.join(ROOT, 'records/target/animation/crawl_shots')
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'): continue
        Image.open(os.path.join(d, f)).convert('RGB').save(os.path.join(d, f[:-4] + '.webp'), 'WEBP', quality=88 if 'phone' in f else 92, method=6)
        os.remove(os.path.join(d, f)); print('SHOT', f[:-4] + '.webp')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[2:]
    if cmd == 'source': write_source()
    elif cmd == 'pose': pose(a[0], a[1])
    elif cmd == 'render': render(a[0] if a else LOOKS[0])
    elif cmd == 'base': base(a[0])
    elif cmd == 'pack': pack()
    elif cmd == 'shots': shots()
    else: print(__doc__)
