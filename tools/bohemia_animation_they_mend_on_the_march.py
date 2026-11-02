#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [they mend on the march] (ask line 314, Paolo 11/2: 'I like these animations, let's make this happen...
it has to look good, that's the main thing... I hope it's not too many tokens... I'm not sure if it needs to be customizable to
all the items, I prefer maybe not').

WHILE THE PARTY WALKS THE MAP, A MAN WHO IS HEALING OR MENDING DOES ONE OF HIS FOUR AS HE WALKS, THE WALK GOING ON UNDER IT:
    march_bind    wraps a bandage round his forearm, biting the end to pull it tight      (his hitpoints coming back)
    march_pills   shakes pills out of a bottle and swallows them dry                      (his hitpoints coming back)
    march_tape    duct tapes his cracked plate and tears the tape with his teeth           (his body armour mended with tape)
    march_helmet  knocks a dent out of his helmet with his knife's butt, puts it back on   (his helmet mended with tape)
The map heals AND mends on the march (engine/bohemia_condition.js elapse(): 1 hitpoint an hour, 3 armour points a piece an hour
paid in TAPE, records/target/bb/condition.json), so all four play on the march itself.

THE SOURCE (rule 128): records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json, the set 'march' (the towns tool's source()
reads it beside the town's, so its pose step makes them; their slots are whole bars on the walk, not the town's loops), each
pose its arms (the bind's own arms for the bandage) on EVERY KEY OF THE MODEL'S OWN SIX-KEY WALK ('walk': 6, the towns tool's
pose_list expands 'MB_over' into 'MB_over@0'..'@5', its apply() lays the arms over the walk's key instead of the stand), so
the legs are the map's walk picture's legs to the pixel and the walk never stops; each act a timeline of held keys, three a
beat at 120, whole bars, every hold two keys or more, starting and ending on its own 'lift' (the forearms up before the belt:
the step between the walk's swing and the work, so no joint jumps from the swing to the chest in one drawn key).
NOT PER ITEM (his preference): the props are generic (one bandage, one pill bottle, one tape roll, one knife); the plate and the
helmet are the ones he WEARS (CHARACTER's wear layer, engine/bohemia_wear.js): the map draws his worn plate over his body and
then his ARMS AGAIN over it (the pixels of his arms the camera sees: his arms cut into
meshes of their own by the towns tool's split_arms, rendered again with everything else held out), so his hands tape the
plate; his worn helmet moves from his head to the bowl in his left fist (flat magenta in the render: the pack finds its middle
and repaints it dull steel) and back.

THE STEPS (bpy 4.2 in a python3.11 venv for render, as the master rig; plain python3 for pack):
    <venv>/bin/python tools/bohemia_animation_they_mend_on_the_march.py render [COMPANY|look,look] [workers]
        YOU and his eleven (the company he starts with: the men the map walks beside him, in his crew list's order), each
        posed by the towns tool's pose (set 'march'), rendered by DIRECTION's master rig at the street's settings on the five
        seen facings, every key again as his arms alone (MARCH_FRONTS, Cycles' holdout), into
        records/target/animation/towns/<look>.march/ (regenerated, .gitignore'd like every render)
    python3 tools/bohemia_animation_they_mend_on_the_march.py pack
        slices/rig_march/<look>.webp (every act's cells: the five facings he can be seen working on, S SE E SW W; turned away
        his hands are behind him and a hand at his mouth reads as a scratch at the back of his head, the 9/24 graveyard's
        lesson), <look>_front.webp (the same cells, only his arms and what his hands hold), slices/rig_march/rig_march.json
        (the cells, each laid on HIS OWN MAP WALK FRAME by its legs, found by matching the legs pixel for pixel; the timelines;
        where the held helmet's middle is)
    python3 tools/bohemia_animation_they_mend_on_the_march.py strips
        records/target/animation/march_strips/<act>.png: every drawn key of each act on one man at the map's pixels, his own
        walk key beside it (the compare law's twin)
    engine/bohemia_march_acts.js picks and plays them on the map (slices/BOHEMIA_CITY_WORLD.html mapPersonDraw).

REUSE CHECK: the poses are the towns tool's (its pose, apply, REACH, props, split_arms), the bandage's arms are the bind's; the
bodies are RUN TWO's builds and COMBAT's YOU (the towns tool's person_one and fight_one, run); the render is DIRECTION's master
rig (render_model / COMBAT's render), patched in memory as render_model already patches it; the colours are snapped to his own map sheet's
colours; nothing drawn by hand. REFERENCE CHECK (the 9/4 duty): the twin of every key is the same man's own walk frame at the
same facing and key (the strips); analog horror AH-01, the held key; no reference game.
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_animation_the_towns_activities as TA
import bohemia_animation_everybody_idles as EI

SET = 'march'
OUT = 'slices/rig_march'
SEEN = ['S', 'SE', 'E', 'SW', 'W']        # the facings he is seen working on (front and side)
STRIPS = 'records/target/animation/march_strips'


LOOP_A = "        for i, f in enumerate(FACINGS):\n            still_key = "
SKIP = "            if name.startswith('TownMarch') and f not in %r: continue\n" % (tuple(SEEN),)
HELD = "        held = sum(len(k['hold']) for f in FACINGS for k in pins[f])"
PROPS = ('bandage', 'pillbottle', 'taperoll', 'tapestrip', 'knife', 'helmetheld')
FRONT = '''
def MARCH_FRONTS(sc, root, name, frames, pins, out):
    """THEY MEND ON THE MARCH (ANIMATION, ask line 314): every key of a march clip again, on the seen facings, with everything but
    his arms and what his hands hold held out (Cycles' holdout: still in front of what it hides, drawn as nothing), at a few
    samples: the pixels of his arms the camera sees, drawn again over the worn plate the map lays on him. Held out once for the
    whole clip (switching it per key re-synced the scene: 2 s a key measured, against 0.7 for the colour)"""
    if not name.startswith('TownMarch'): return
    import bpy
    keep = [o for o in sc.objects if o.type == 'MESH' and not o.name.startswith('arms_') and o.name.split('.')[0] not in %r]
    s0 = sc.cycles.samples; sc.cycles.samples = 4
    for o in keep: o.is_holdout = True
    for i, f in enumerate(FACINGS):
        if f not in %r: continue
        for j, fr in enumerate(frames):
            undo = pose_key(sc, root, i, fr, pins[f][j]); sc.render.filepath = os.path.join(out, 'front_%%s_%%s_k%%02d.png' %% (name, f, j))
            bpy.ops.render.render(write_still=True); unpose(undo)
    for o in keep: o.is_holdout = False
    sc.cycles.samples = s0
''' % (PROPS, tuple(SEEN))


def ids_on(mod):
    """this pass only, in memory, the way render_model already patches the master rig: a march clip rendered on the five facings
    he is seen working on (the other three are never drawn: 3/8 of the render saved), then every key of it again as his arms
    alone (MARCH_FRONTS; the master rig's object-ID pass measured 2.7 s a key against the colour's 0.7, so it stays off)"""
    run0 = mod.run
    def run(cmd, out=None, *a):
        if len(cmd) > 2 and cmd[1] == '-c' and 'bohemia_direction_master_rig' in cmd[2]:
            code = cmd[2]
            assert code.count(LOOP_A) == 1 and code.count(HELD) == 1, 'the master rig changed: re-read it before patching in memory'
            code = code.replace(LOOP_A, LOOP_A.split('\n')[0] + '\n' + SKIP + LOOP_A.split('\n', 1)[1])
            code = code.replace(HELD, "        MARCH_FRONTS(sc, root, name, frames, pins, out)\n" + HELD)
            head, rest = code.split('\n', 1)
            code = head + '\nimport os\n' + FRONT + '\n' + rest
            cmd = cmd[:2] + [code] + cmd[3:]
        return run0(cmd, out, *a) if out is not None else run0(cmd)
    mod.run = run


def one(tag):
    ids_on(EI)
    if tag.startswith('person_'):
        TA.person_one(tag, SET)
    else:
        CF = EI.combat(); ids_on(CF)
        TA.fight_one(tag, SET)


def render(arg='COMPANY', workers=4):
    comp, post, rest = TA.company_first()
    # his order on the crew screen (ours.json people_looks.crew): YOU, then the two the map walks beside him first
    order = ['you', 'person_town_0', 'person_town_1', 'person_town_5', 'person_town_2', 'person_town_6', 'person_town_4', 'person_town_8',
             'person_town_7', 'person_town_11', 'person_town_3', 'person_town_10']
    pool = [x for x in order if x == 'you' or x in comp] + [x for x in comp if x not in order] if arg.upper() == 'COMPANY' else arg.split(',')
    todo = [t for t in pool if not TA.done(t, SET)]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // max(1, workers))),
               BOHEMIA_BPY=os.environ.get('BOHEMIA_BPY') or sys.executable)
    procs = []
    for w in range(max(1, workers)):
        mine = todo[w::max(1, workers)]
        if not mine: continue
        sh = ' ; '.join('%s %s one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'pack'
    if cmd == 'one': one(sys.argv[2])
    elif cmd == 'render': render(sys.argv[2] if len(sys.argv) > 2 else 'COMPANY', int(sys.argv[3]) if len(sys.argv) > 3 else 4)
    elif cmd == 'pack':
        import bohemia_animation_march_pack as MP; MP.pack(sys.argv[2] if len(sys.argv) > 2 else None)
    elif cmd == 'strips':
        import bohemia_animation_march_pack as MP; MP.strips()
    else: raise SystemExit(__doc__)
