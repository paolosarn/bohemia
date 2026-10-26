#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [a few women at the post]: HER BODY ON THE RIG (rules 203(a) and 214, Paolo 10/25 and 10/26, LOCKED:
'I'm willing to give a chance to women... make it 4 percent'; the ruling: each a whole person, her own body on the rig, never a
renamed man). RUN THREE's roll at the post plays at 0 until a woman's body exists; this makes her.

MEASURED FIRST (10/26): no woman's body anywhere. The valley's 152 rolled people are men's bodies (71 marked, 81 unset); the
person builder (CHARACTER's tools/bohemia_character_the_thirteen_through_the_rig.py) shapes the rig's man by four dials only
(height, shoulders, belly, hips), and the barber writes the real height the rig scales to off the model's top, so the height
dial never reached the picture: every person stands 1.72 to 1.77 m.

THE SOURCE (rule 128): records/target/animation/BOHEMIA_HER_BODY.json. Her body is the SAME rig, skeleton and scale as every
man's (THE GROUND MAY ZOOM, THE PERSON MAY NOT): her band's own dials moved by hers (narrower shoulders, a wider seat, a waist,
about 1.60 m), a bust and a waist the four dials cannot make (two soft bumps on the torso's front, the torso narrowed at the
navel: every garment is the body's skin lifted, so her clothes take her shape), and HER WALK on her model's own walk (the hips
list and turn with the stride, the feet land nearer the line, the arms swing closer). Because it is the same skeleton, every
clip every lane lays on a person (COMBAT's fight poses, the idles, the work, the shield arm and the two hands, the town's
activities) lays on her unchanged.

THE STEPS (Blender's Python where bpy is used: bpy 4.2 in a python3.11 venv, as the master rig):
    python3 tools/bohemia_animation_her_body.py roll
        appends the women to RUN TWO's roll (records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json) after every man, so no man's draw
        moves: a person of the place (gang Body, no band), the barber's book rolled the way it rolls a man (her skin, her hair
        colour, her trousers, shoes and kit) with her face, her cut and no beard; sex 'f'
    RUN TWO's own tool builds and renders her like any person (build-one, make, fight-make, fight-pack, index): its build-one
    calls dress() and finish() below for a person whose roll says 'f' (the one hook in RUN TWO's tool), so any lane that
    builds her again (the idles, the work, the town's activities, the shield arm) builds HER, never a man in her name
    <venv>/bin/python tools/bohemia_animation_her_body.py preview <out.png>
        her and a man of the same place side by side, standing and in four keys of the walk, four facings (never shipped)

REUSE CHECK: the body, its bones, its walk and its clothes are the rig's man and CHARACTER's builder (its build() run, with one
block added in memory, the way this repo runs another lane's tool: COMBAT's guns tool, the master rig); the roll is the barber's
book (its roll_one) and RUN TWO's wardrobe; the render is DIRECTION's master rig through RUN TWO's own steps; the legs' reach is
the idles' two-bone plant; nothing drawn by hand. REFERENCE CHECK (the 9/4 standing duty): the compare law's twin is a man of
the same place built the same way, side by side at the street's pixels (the record); analog horror AH-01; no reference game.
"""
import inspect, json, math, os, random, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_HER_BODY.json')
ROLL = os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
HIPS = "                p.x *= 1.0 + 0.06 * D['hips'] * math.exp(-((p.z - 0.64) / 0.08) ** 2)\n"
SHAPE = ("            if L.get('her') and fm in ('torso', 'neck'):   # ANIMATION [her body] (rule 203(a)): the bust and the waist\n"
         "                H_ = L['her']; ax_ = abs(p.x)\n"
         "                if p.y < -0.02: p.y -= H_['bust'] * math.exp(-((p.z - H_['bust_z']) / H_['bust_dz']) ** 2) * math.exp(-((ax_ - H_['bust_x']) / H_['bust_dx']) ** 2)\n"
         "                p.x *= 1.0 - H_['waist'] * math.exp(-((p.z - H_['waist_z']) / H_['waist_dz']) ** 2)\n")


def source():
    return json.load(open(SRC))


def her_dials(D, H=None):
    """her band's dials moved by hers"""
    H = H or source()['dials']
    return dict(D, height=D['height'] + H['height'], shoulders=D['shoulders'] + H['shoulders'], hips=D['hips'] + H['hips'],
                belly=min(D['belly'], H['belly_cap']) + H['belly'])


# ------------------------------------------------------------------------------------------------ the build (bpy, in RUN TWO's build-one)
def dress(name):
    """CHARACTER's build() taught her shape, in memory (its file never written): her dials on her look, and the bust and the
    waist in the body's own loop, right after the hips; a man is built byte for byte as before (the block reads L['her'])"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    if not getattr(CH, '_HER', None):
        src = inspect.getsource(CH.build)
        assert src.count(HIPS) == 1, 'CHARACTER\'s build() changed where the hips are shaped: re-read it before patching in memory'
        exec(compile(src.replace(HIPS, HIPS + SHAPE), CH.__file__, 'exec'), CH.__dict__)
        CH._HER = set(); built = CH.build
        def build(nm, outdir, built=built):
            if nm.upper() in CH._HER:
                S = source(); L = CH.LOOKS[nm]
                L['dials'] = her_dials(L['dials'], S['dials']); L['her'] = {k: v for k, v in S['shape'].items() if k != 'why'}
            return built(nm, outdir)
        CH.build = build
    CH._HER.add(name.upper())


def finish(pid):
    """after the barber has built her: the real height the rig scales her to (the barber writes it off the model's top, a
    man's 1.72; hers is that times her height dial's 5 percent a step), and her walk on her own model"""
    tag = 'person_' + pid.lower(); glb = os.path.join(RIG_DIR, 'barber_%s.glb' % tag); js = glb[:-4] + '.json'
    S = source(); J = json.load(open(js))
    if not J.get('her'):
        J['real_height_for_rig'] = round(J['real_height_for_rig'] * (1 + 0.05 * S['dials']['height']), 4)
        J['her'] = 'ANIMATION [a few women at the post]: her height (the barber\'s x %.2f), her shape and her walk (records/target/animation/BOHEMIA_HER_BODY.json)' % (1 + 0.05 * S['dials']['height'])
        json.dump(J, open(js, 'w'), indent=1)
    walk(glb)


def walk(glb, out=None):
    """HER WALK on her model's own walk (every lane reads 'Anim_0'): at every key the walk has, the hips list toward the
    swinging leg's side and turn with the forward leg, the chest counter-turns so she still faces where she walks, the
    ankles land nearer the midline (the legs reached there, the idles' two-bone plant, knees forward, each foot keeping its
    turn on the ground), the arms in closer; keyed back into Anim_0 at the same frames"""
    import bpy, mathutils
    S = source()['walk']; B = json.load(open(os.path.join(ROOT, 'records/target/animation/BOHEMIA_EVERYBODY_IDLES.json')))['bones']
    V = mathutils.Vector; Fv, Uv, Lv = V((1, 0, 0)), V((0, -1, 0)), V((0, 0, 1))
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(glb))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    acts = list(bpy.data.actions)
    walk_a = [x for x in acts if x.name.startswith('Anim_0')][0]
    frames = sorted(set(round(k.co[0], 4) for fc in walk_a.fcurves for k in fc.keyframe_points))
    PB = arm.pose.bones
    order = []
    def down(b):
        order.append(b.name)
        for c in b.children: down(c)
    for b in arm.data.bones:
        if b.parent is None: down(b)
    legs = [(B['LT'], B['LS'], B['LA'], 1), (B['RT'], B['RS'], B['RA'], -1)]

    def rot(pb, P, R):
        pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
        bpy.context.view_layer.update()

    def reach(t, s, a, At, Rf):
        H = PB[t].head.copy(); K0 = PB[s].head.copy(); A0 = PB[a].head.copy()
        l1, l2 = (K0 - H).length, (A0 - K0).length
        d = At - H; dist = min(d.length, (l1 + l2) * 0.9999); n = d.normalized()
        p = Fv - n * Fv.dot(n); p = p.normalized() if p.length > 1e-6 else V((1, 0, 0))
        a_ = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, l1 * l1 - a_ * a_))
        K = H + n * a_ + p * h
        q = (K0 - H).rotation_difference(K - H); rot(PB[t], H, q.to_matrix().to_4x4())
        K1 = PB[s].head.copy(); A1 = PB[a].head.copy()
        q = (A1 - K1).rotation_difference(At - K1); rot(PB[s], K1, q.to_matrix().to_4x4())
        M = Rf.to_4x4(); M.translation = PB[a].matrix.translation; PB[a].matrix = M
        bpy.context.view_layer.update()

    ad.action = walk_a
    # the stride's phase from the walk itself: which ankle leads (forward) and which swings (higher)
    samp = []
    for fr in frames:
        sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr)); bpy.context.view_layer.update()
        la, ra = PB[B['LA']].head, PB[B['RA']].head
        samp.append((ra.dot(Fv) - la.dot(Fv), ra.dot(Uv) - la.dot(Uv)))
    dmax = max(abs(x[0]) for x in samp) or 1.0; hmax = max(abs(x[1]) for x in samp) or 1.0
    keyed = []
    for fr, (dfw, dup) in zip(frames, samp):
        sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr)); bpy.context.view_layer.update()
        feet = {a: (PB[a].head.copy(), PB[a].matrix.to_3x3().copy(), side) for _, _, a, side in legs}
        P = PB[B['P']]; Sp = PB[B['S']]
        turn = S['turn_deg'] * (dfw / dmax)          # the right leg forward: the right hip forward (about up, toward his left)
        lst = S['list_deg'] * (dup / hmax)           # the right foot swinging: the right hip drops (about forward, his left side up)
        rot(P, P.head.copy(), mathutils.Matrix.Rotation(math.radians(turn), 4, Uv) @ mathutils.Matrix.Rotation(math.radians(lst), 4, Fv))
        rot(Sp, Sp.head.copy(), mathutils.Matrix.Rotation(math.radians(-turn * 0.9), 4, Uv) @ mathutils.Matrix.Rotation(math.radians(-lst * 0.75), 4, Fv))
        for t, s, a, side in legs:
            At, Rf, sd = feet[a]
            reach(t, s, a, At - Lv * sd * S['narrow_m'], Rf)
        for bn, sd in ((B['LU'], 1), (B['RU'], -1)):
            pb = PB[bn]; rot(pb, pb.head.copy(), mathutils.Matrix.Rotation(math.radians(-sd * S['arm_in_deg']), 4, Fv))
        keyed.append((fr, {pb.name: pb.matrix_basis.copy() for pb in PB}))
    new = bpy.data.actions.new('Anim_0_her'); ad.action = new
    for fr, basis in keyed:
        for pb in PB:
            pb.matrix_basis = basis[pb.name]
            for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
    nm = walk_a.name; walk_a.name = nm + '_man'; new.name = nm
    for t in ad.nla_tracks:   # the importer's own strip of the walk plays hers (a strip left without its action exports a still)
        for s in t.strips:
            if s.action == walk_a: s.action = new
    for x in list(bpy.data.actions):   # every other action on a track of its own, as the idles' pose() leaves them
        if x is walk_a or any(s.action == x for t in ad.nla_tracks for s in t.strips): continue
        t = ad.nla_tracks.new(); t.name = x.name.split('_Armature')[0]; t.strips.new(t.name, int(x.frame_range[0]), x); t.mute = True
    ad.action = None
    bpy.data.actions.remove(walk_a)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out or glb), export_format='GLB', export_skins=True, export_animations=True,
                              export_morph=True, export_morph_normal=False, export_apply=False, use_selection=False,
                              export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('HER WALK', out or glb, len(frames), 'keys, turn %.1f list %.1f' % (S['turn_deg'], S['list_deg']))


# ------------------------------------------------------------------------------------------------ the roll (python3)
def roll():
    """the women appended to RUN TWO's roll after every man: no man's draw moves, nobody is rolled twice"""
    import bohemia_character_the_barbers_book as BB
    import bohemia_run2_no_two_people_alike as R2
    S = source(); Fc = S['face']; R = S['roll']
    B = json.load(open(BB.BOOK)); people = json.load(open(ROLL))
    have = set(p['id'] for p in people); shapes = {f['name']: f for f in B['face_shapes']}
    cuts = {c['name']: c for c in B['cuts']}
    tops, coats, p_coat = R2.wardrobe(R['gang'])
    seen = set(BB.key(p) + (p.get('top'), p.get('coat')) for p in people)
    added = 0
    for i in range(R['count']):
        pid = R['id'] % i
        if pid in have: continue
        j = 0
        while True:
            P = BB.roll_one(B, R['gang'], 'w%d_%d' % (i, j)); rng = random.Random('her:%s:%d' % (pid, j)); j += 1
            for k in ('facial_hair', 'beard', 'new_beard', 'stubble'): P.pop(k, None)
            short = rng.random() < Fc['short_share']
            P['hair_cut'] = rng.choice([c for c in (Fc['short_cuts'] if short else Fc['long_cuts']) if c in cuts and not cuts[c]['held']])
            if not cuts[P['hair_cut']]['short']: P.pop('hat', None)
            sh = shapes[rng.choice([s for s in Fc['shapes'] if s in shapes])]
            d = dict(sh['dials'] or {}); FD = {x['key']: x for x in B['face_dials']}
            for k, v in Fc['soften'].items():   # her jaw and chin softer, her brows finer, inside the face maker's own range
                if k in FD: d[k] = max(FD[k]['lo'], min(FD[k]['hi'], d.get(k, FD[k]['default']) + v))
            P['face'] = d or None; P['face_name'] = sh['name']
            P['top'] = rng.choice(tops)
            if rng.random() < p_coat and coats: P['coat'] = rng.choice(coats)
            P['id'] = pid; P['sex'] = 'f'
            P['her'] = 'ANIMATION [a few women at the post] (rule 203(a)): her body, her walk and her face (records/target/animation/BOHEMIA_HER_BODY.json)'
            k = BB.key(P) + (P['top'], P.get('coat'))
            if k in seen: continue
            seen.add(k); break
        people.append(P); added += 1
        print('HER', pid, P['hair_cut'], P['face_name'], P['top'], P.get('coat'), P['heritage'], P['tone'])
    if added:
        with open(ROLL, 'w') as f: json.dump(people, f, indent=1)
    print('roll: %d women added, %d people' % (added, len(people)))


# ------------------------------------------------------------------------------------------------ her in the game (python3)
# RUN TWO's own steps make every person (make: her eight stills, her walk and her face; fight-make: COMBAT's fight poses on
# her model), and its packs put them where the screens read them. Its packs are written for a container that holds EVERY
# person's renders (they are gitignored): run whole here, fight-pack would first drop every rolled man from the fight's sheet
# index, its face strip and the bands' pools, and walk-sheets would remake every walker. So her packs are RUN TWO's own
# functions run on her alone, in memory: the women's roll only, nobody else's entry deleted, the bands left as they are.
def women():
    return [p for p in json.load(open(ROLL)) if p.get('sex') == 'f']


def _r2_women_only():
    import tempfile
    import bohemia_run2_no_two_people_alike as R2
    fd, path = tempfile.mkstemp(suffix='.json', dir=os.path.join(ROOT, 'records/run2')); os.close(fd)
    json.dump(women(), open(path, 'w'))
    full, R2.ROLL = R2.ROLL, path
    return R2, path, full


def fight_pack_her():
    """RUN TWO's fight_pack() on the women alone: her sheet in YOU's cell with YOU's guns (a person of the place), her face
    added to the fight's face strip after everybody already in it; no man's entry, face or band touched"""
    R2, path, full = _r2_women_only()
    try:
        src = inspect.getsource(R2.fight_pack)
        cuts = [("    for k in [k for k, v in I['looks'].items() if v.get('kind') == 'person']: del I['looks'][k]\n",
                 "    for k in [k for k in I['looks'] if k in HERS]: del I['looks'][k]\n"),
                ("    keep = [l for l in F['order'] if not l.startswith('person_')]\n",
                 "    keep = [l for l in F['order'] if l not in HERS]\n")]
        for a, b in cuts:
            assert src.count(a) == 1, 'RUN TWO\'s fight_pack() changed: re-read it before running it for her'
            src = src.replace(a, b)
        bands = src.index("    # THE BANDS")
        src = src[:bands] + "    print('fight women', len(made))\n"
        ns = dict(R2.__dict__); ns['HERS'] = set('person_' + p['id'].lower() for p in women())
        exec(compile(src, R2.__file__, 'exec'), ns)
        ns['fight_pack']()
    finally:
        os.remove(path); R2.ROLL = full


def walk_sheets_her():
    """RUN TWO's walk_sheets() on the women alone (her own sheet for the town's lanes and the crew's stroll)"""
    R2, path, full = _r2_women_only()
    try: R2.walk_sheets()
    finally: os.remove(path); R2.ROLL = full


def idles_her(pids=None):
    """the idles' own steps for her (ANIMATION [everybody idles]): her bare idles and her gun-held idles rendered on her own
    model (person_idles, carry_one: her build through the hook), then the idles' people_pack run on her alone: it would
    otherwise write the map's people file with only the people rendered here and drop every rolled man's fight idles"""
    import bohemia_animation_everybody_idles as EI
    for p in (pids or [q['id'] for q in women()]):
        tag = 'person_' + p.lower()
        if not EI.person_done(tag): EI.person_idles(p)
        if tag in EI.fight_people() and not EI.carry_done(tag): EI.carry_one(p)
    src = inspect.getsource(EI.people_pack)
    cuts = [("    json.dump(mj, open(os.path.join(ROOT, OUT, 'map_people.json'), 'w'), separators=(',', ':'))\n",
             "    if mj['looks']: json.dump(mj, open(os.path.join(ROOT, OUT, 'map_people.json'), 'w'), separators=(',', ':'))\n"),
            ("    for k in [k for k in index['looks'] if k.startswith('fight_person_')]: del index['looks'][k]\n",
             "    for k in [k for k in index['looks'] if k[len('fight_'):] in HERS]: del index['looks'][k]\n")]
    for a, b in cuts:
        assert src.count(a) == 1, 'the idles\' people_pack() changed: re-read it before running it for her'
        src = src.replace(a, b)
    ns = dict(EI.__dict__); ns['HERS'] = set('person_' + q['id'].lower() for q in women())
    exec(compile(src, EI.__file__, 'exec'), ns)
    ns['people_pack']()


def make_her(pid):
    """RUN TWO's own steps for one woman: COMBAT's fight poses rendered on her (fight-make), then her stills, walk and face
    (make); each builds her again through the hook if her model is gone"""
    import subprocess
    py = os.environ.get('BOHEMIA_BPY') or sys.executable
    env = dict(os.environ, BOHEMIA_BPY=py)
    for cmd in ('fight-make', 'make'):
        subprocess.call([sys.executable, os.path.join(ROOT, 'tools/bohemia_run2_no_two_people_alike.py'), cmd, pid], cwd=ROOT, env=env)
    print('HER MADE', pid, flush=True)


# ------------------------------------------------------------------------------------------------ preview (bpy)
def preview(out, her='woman_0', him='town_0'):
    """her beside a man of the same place: standing and four keys of the walk, four facings (Cycles 8 samples; never shipped)"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    from PIL import Image
    FA = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; fs = ['S', 'SE', 'E', 'SW']; R = 300
    sheet = Image.new('RGBA', (R * 5 * 2, R * len(fs)), (70, 66, 60, 255))
    for wi, pid in enumerate((her, him)):
        glb = os.path.join(RIG_DIR, 'barber_person_%s.glb' % pid)
        h = json.load(open(glb[:-4] + '.json'))['real_height_for_rig']
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        bpy.ops.import_scene.gltf(filepath=glb)
        for o in list(sc.objects):
            if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
        objs = [o for o in sc.objects if o.type == 'MESH']
        root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
        MR.clip_actions(sc, 'Stand'); sc.frame_set(1); lo, hi = MR.bounds(sc, objs)
        centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z)); k = h / (hi.z - lo.z)   # her own real height
        for o in list(sc.objects):
            if o.parent is None and o is not root: o.parent = root; o.location -= centre
        root.scale = (k, k, k * 1.414)
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = 3.4
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        t = math.radians(45); cam.rotation_euler = (t, 0, 0); cam.location = mathutils.Vector((0, 0, 1.3)) - mathutils.Vector((0, math.sin(t), -math.cos(t))) * 30
        sc.render.resolution_x = sc.render.resolution_y = R
        MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg']))); sc.cycles.samples = 8; sc.render.film_transparent = True
        tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '_her.png')
        cols = [('Stand', 0.5, 1)] + [('Anim_0', (i + 0.5) / 6, 6) for i in (0, 1, 3, 4)]
        for c, (clip, at, n) in enumerate(cols):
            a0, a1 = MR.clip_actions(sc, clip); fr = a0 + (a1 - a0) * at; sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
            for r, f in enumerate(fs):
                root.rotation_euler = (0, 0, math.radians(180 - 45 * FA.index(f)))
                sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
                sheet.alpha_composite(Image.open(tmp).convert('RGBA'), (R * (c + 5 * wi), R * r))
    sheet.save(out); print('PREVIEW HER', out)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[2:]
    if cmd == 'roll': roll()
    elif cmd == 'walk': walk(a[0], a[1] if len(a) > 1 else None)
    elif cmd == 'finish': finish(a[0])
    elif cmd == 'preview': preview(*a)
    elif cmd == 'make': [make_her(p) for p in (a or [q['id'] for q in women()])]
    elif cmd == 'fight-pack': fight_pack_her()
    elif cmd == 'walk-sheets': walk_sheets_her()
    elif cmd == 'idles': idles_her(a or None)
    else: sys.exit('roll | make [pid..] | fight-pack | walk-sheets | walk <in.glb> [out.glb] | finish <pid> | preview <out.png> [her] [him]')
