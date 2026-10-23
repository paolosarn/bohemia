#!/usr/bin/env python3
"""BOHEMIA -- RUN TWO [no two people alike] (rule 121(i), Paolo 10/19: 'THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE
CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS FOR CUSTOMIZATIONS, IT'S INSANE'; the coordinator's note of his
nineteenth votes: 'give them hairstyles... the whole enchilada', hair first, hats rare, the cone hat and the odd wraps out).

THE GAP, MEASURED: the game drew thirteen gang looks and three barber cuts, so a gang was thirteen copies of one man and
a crowd was three. CHARACTER made every piece on the 3D man (the barber's book, records/target/character/
BOHEMIA_THE_BARBERS_BOOK.json: 21 cuts, 21 hats, 14 face pieces, 80 tops, 74 coats, beards, marks, skins) and a person
builder (tools/bohemia_character_the_barber_on_the_skull.py build PEOPLE:<roll>), and nobody rolled the people.

THE METHOD, NOTHING DRAWN NEW (rule 121(b), implementation only):
  roll     CHARACTER's own roll (tools/bohemia_character_the_barbers_book.py roll_one: skin by the valley's census, a cut
           weighted to his gang, a hair colour, a face shape, facial hair 45%, a mark 20%, a hat 12% over a short cut only
           and never the cone or the wraps, a face piece 10%) PLUS what it left out: A TOP AND A COAT INSIDE HIS GANG'S
           COLOURS (CHARACTER's 80 tops and 74 coats, the held ones out; a piece is his gang's when its cloth is the hue of
           one of his gang look's own cloths, the shirt, the coat, the mantle, the cape; a gang with a cape or a mantle keeps
           it and takes a vest at most). A repeat is re-drawn (CHARACTER's key, plus the top and the coat).
  build    CHARACTER's person builder, its person_body taught the top and the coat in memory (its file never edited): his
           gang's look in his own skin, the top's pieces (GARMENTS BASE) and the coat's (GARMENTS OUTER) on it, the head and
           cut and hat and face piece by the barber, as built.
  render   DIRECTION's master rig, patched in memory the way COMBAT renders the fight (tools/bohemia_combat_the_fight_wears_
           the_rig.py): the movers' light pass off, Cycles persistent data, samples 24, no calibration, no id pass, the
           dents off. Stand:1 and Anim_0:6 (his eight turns standing and his six-key walk in eight) and a 128 portrait of
           the same head (ONE ID, ONE WHOLE PERSON). Into records/target/character/barber/person_<id>/ (CHARACTER's how_to_build).
  bake     RUN's bake (tools/bohemia_bake_the_rig_cast.py bake(), unedited) over those folders, one sheet a gang:
           slices/rig_mix/<gang>.png / .json, the same index as the gangs' sheet, plus who each person is (the map).
  index    engine/bohemia_people_mix.js, who everybody is, for the towns, the crew screen and the faces.
Run:
    python3 tools/bohemia_run2_no_two_people_alike.py roll [per_gang 8] [town 48]   (10/23: 48 of the places' own people, the
        map's crowds put sixty-odd people on one screen; the first 116 are the same people whatever the count, measured)
    python3 tools/bohemia_run2_no_two_people_alike.py batch [workers 2]      (build + render every person not yet rendered)
    python3 tools/bohemia_run2_no_two_people_alike.py bake
    python3 tools/bohemia_run2_no_two_people_alike.py index
    BOHEMIA_BPY=<venv>/bin/python   (bpy 4.2 on python3.11; see tools/bohemia_direction_master_rig.py)
"""
import colorsys, json, os, random, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
ROLL = os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')
OUT = 'records/target/character/barber'
SAMPLES = 24
GANGS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Homeless', 'Mob', 'Network', 'Reds',
         'Remnants', 'Trades', 'Volunteers']
TOWN = 'Body'   # the people of a place who wear no gang: the man under every look, any colour
NO_TOP = ('TURTLENECK', 'HOOD UP')            # their pieces ride the head (BASE_ONE.head), which a person's build does not call
NO_COAT = ('HOODED PONCHO',)                  # the hood up rides the head too


def hsv(c):
    return colorsys.rgb_to_hsv(*[v / 255.0 for v in c])


def same_cloth(a, b):
    """two cloths read as one colour on the street: both grey and near in value, or both coloured and near in hue"""
    ha, sa, va = hsv(a); hb, sb, vb = hsv(b)
    if sa < 0.2 or sb < 0.2:
        return sa < 0.2 and sb < 0.2 and abs(va - vb) < 0.22
    dh = min(abs(ha - hb), 1 - abs(ha - hb))
    return dh < 0.07 and abs(va - vb) < 0.45


def gang_cloths(L):
    return [L[k]['colour'] for k in ('shirt', 'coat', 'mantle', 'cape') if isinstance(L.get(k), dict) and L[k].get('colour')]


def wardrobe(gang):
    """the tops and coats a man of this gang may roll, each with its weight"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    import bohemia_character_garments_base as BASE
    import bohemia_character_garments_outer as OUTER
    B = json.load(open(os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_BARBERS_BOOK.json')))
    held_t = set(t['name'] for t in B['tops'] if t['held']); held_c = set(c['name'] for c in B['coats'] if c['held'])
    L = CH.LOOKS[gang]; cl = gang_cloths(L)
    tops = [g for g in BASE.BY.values() if g['name'] not in held_t and g['shape'] not in NO_TOP]
    coats = [g for g in OUTER.BY.values() if g['name'] not in held_c and g['shape'] not in NO_COAT and not g.get('hood')]
    if gang != TOWN:
        tops = [g for g in tops if any(same_cloth(g['mid'], c) for c in cl)] or tops
        coats = [g for g in coats if any(same_cloth(g['mid'], c) for c in cl)] or coats
    caped = any(isinstance(L.get(k), dict) for k in ('cape', 'mantle'))
    if caped: coats = [g for g in coats if g['shape'] == 'VEST']
    p_coat = 0.0 if not coats else 0.25 if caped else 0.6 if isinstance(L.get('coat'), dict) or gang == TOWN else 0.35
    return [g['name'] for g in tops], [g['name'] for g in coats], p_coat


def roll(per_gang=8, town=48):
    import bohemia_character_the_barbers_book as BB
    B = json.load(open(BB.BOOK))
    people, seen = [], set()
    for gang, n in [(g, per_gang) for g in GANGS] + [(TOWN, town)]:
        tops, coats, p_coat = wardrobe(gang)
        deck = random.Random(gang + ':decks')
        dt, dc = [], []   # a deck each: a gang's men go through every top and coat it may wear before one comes round again
        i, got = 0, 0
        while got < n:
            P = BB.roll_one(B, gang, i)
            rng = random.Random('%s:%s:cloth' % (gang, i)); i += 1
            if not dt: dt = deck.sample(tops, len(tops))
            P['top'] = dt.pop()
            if rng.random() < p_coat:
                if not dc: dc = deck.sample(coats, len(coats))
                P['coat'] = dc.pop()
            if gang == TOWN: P['id'] = 'town_%d' % (i - 1)
            k = BB.key(P) + (P['top'], P.get('coat'))
            if k in seen: continue   # no two alike: a repeat is re-drawn, never kept
            seen.add(k); people.append(P); got += 1
        print('%-10s %2d people from %d tops and %d coats (a coat %d%%)' % (gang, n, len(tops), len(coats), round(100 * p_coat)))
    os.makedirs(os.path.dirname(ROLL), exist_ok=True)
    json.dump(people, open(ROLL, 'w'), indent=1)
    print('rolled %d, no two alike -> %s' % (len(people), os.path.relpath(ROLL, ROOT)))


# ---- inside Blender's Python ---------------------------------------------------------------------------------------
def build_one(pid):
    """one person's model, CHARACTER's builder with its person_body taught the top and the coat (in memory)"""
    import bohemia_character_the_barber_on_the_skull as BS
    import bohemia_character_garments_base as BASE
    import bohemia_character_garments_outer as OUTER
    P = next(p for p in json.load(open(ROLL)) if p['id'] == pid)
    one = os.path.join(ROOT, 'records/character/rig/_roll_%s.json' % pid)
    json.dump([P], open(one, 'w'))

    def person_body(spec):
        import bohemia_character_the_thirteen_through_the_rig as CH
        import bohemia_portrait_the_head_from_the_model as PM
        src = CH.LOOKS[spec['gang']]
        L = json.loads(json.dumps(src, default=list))
        for k_, v_ in src.items():
            if callable(v_): L[k_] = v_
        L['skin'] = PM.palette_step(*spec['skin']); L['order'] = 200
        L['worn'] = dict(L.get('worn') or {})
        Gt = BASE.at_source(BASE.BY[spec['top']]) if spec.get('top') else None
        Gc = BASE.at_source(OUTER.BY[spec['coat']]) if spec.get('coat') else None
        if Gt:
            L['shirt'] = dict(colour=Gt['mid'], sleeve={'none': 'none', 'short': 'short'}.get(Gt['sleeves'], 'long'))
            L['worn']['base'] = Gt['name']
            if Gt['fn'] == 'genCoverall':
                L['trousers'] = dict(colour=Gt['mid'], wide=0.014, crop=0.355 if Gt['short'] else 0.0)
        if Gc:
            L.pop('coat', None); L['worn']['outer'] = Gc['name']
        elif spec.get('top'):
            L.pop('coat', None); L['worn'].pop('outer', None)   # his own top, no coat over it
        old = L.get('extra')
        L['extra'] = lambda X, Gt=Gt, Gc=Gc, old=old: ((old(X) or []) if old else []) + \
            (BASE.pieces(Gt, X) if Gt else []) + (OUTER.pieces(Gc, X) if Gc else [])
        L['shape'] = '%s: a person of the %s, his own skin %s %d, %s%s' % (
            spec['tag'], spec['gang'], spec['skin'][0], spec['skin'][1], spec.get('top'), (' under ' + spec['coat']) if spec.get('coat') else '')
        name = spec['tag'].upper()
        CH.LOOKS[name] = L
        if Gt: CH.PRINTS[name] = BASE.prints(Gt)
        elif spec['gang'] in getattr(CH, 'PRINTS', {}): CH.PRINTS[name] = CH.PRINTS[spec['gang']]
        CH.build(name, BS.RIG_DIR)
        spec['body'] = 'records/character/rig/%s.glb' % name.lower()

    BS.person_body = person_body
    if not os.path.exists(os.path.join(ROOT, 'records/character/rig/barberbody.glb')): BS.barber_body()
    for n in BS.people(one): BS.build(n)
    os.remove(one)


def render_code(glb, out, h, clips=None, stand_only=False):
    """DIRECTION's master rig, patched in memory the way COMBAT renders the fight; clips: the fight's poses instead of the
    street's stand and walk and the portrait"""
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    assert src.count(a) == 1 and src.count(b) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    argv = ['bohemia_direction_master_rig.py', glb, out, '--real-height', str(h), '--family', 'none',
            '--set', 'samples=%d' % SAMPLES, '--set', 'dent_m=0', '--no-calibration', '--no-id-pass']
    if clips:
        for c, k in clips: argv += ['--clip', '%s:%d' % (c, k)]
    else:
        argv += ['--clip', 'Stand:1'] + ([] if stand_only else ['--clip', 'Anim_0:6']) + ['--portrait', '128']
        for e in MOUTH: argv += ['--expression', e]   # the face talks: PORTRAIT's head keeps its four speak-along mouths
    return ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src


MOUTH = ('A', 'E', 'O', 'M')
FACE_KEYS = ('rest',) + MOUTH


def faces(out):
    """HIS FACE IS HIS BODY'S FACE (ONE ID, ONE WHOLE PERSON; rule 120(d)): the portrait the master rig rendered of this very
    model's head, rest and the four mouths, squared the way PORTRAIT squares the crew's (its hand_off_window, imported) and
    box-resampled to the 64 and the 128 the screens draw: <person>/face/<key>_<64|128>.png, the names
    engine/bohemia_crew_faces.js reads"""
    from PIL import Image
    import bohemia_portrait_the_head_from_the_model as PM
    pj = json.load(open(os.path.join(out, 'portrait.json')))
    src = dict(rest=pj['files'][0], **pj['expression_files'])
    od = os.path.join(out, 'face'); os.makedirs(od, exist_ok=True)
    for k in FACE_KEYS:
        im = Image.open(os.path.join(ROOT, src[k])).convert('RGBA')
        sq = im.crop(PM.hand_off_window(im, pj['head_px']))
        for n in (64, 128): sq.resize((n, n), Image.BOX).save(os.path.join(od, '%s_%d.png' % (k, n)))


STOW = 'records/run2/people'   # the source frames the bake and the fight pack read; committed, never published (Pages publishes records/target)


def stow(tag):
    """what the screens fetch stays published (the eight stills, the faces, the two jsons); the walk and the rig's three
    portraits and four mouths, read only by the bake and the fight pack, go to STOW with a copy of the stills"""
    import shutil
    src, dst = os.path.join(ROOT, OUT, tag), os.path.join(ROOT, STOW, tag)
    if not os.path.isdir(src): return
    os.makedirs(dst, exist_ok=True)
    for f in os.listdir(src):
        if not f.endswith('.png'): continue
        if f.startswith(('rig_Anim_', 'rig_portrait_')): shutil.move(os.path.join(src, f), os.path.join(dst, f))
        elif f.startswith('rig_'): shutil.copy2(os.path.join(src, f), os.path.join(dst, f))


def frames_of(tag):
    """the folder holding his stills and his walk: STOW once stowed, else the render's own"""
    d = os.path.join(ROOT, STOW, tag)
    return d if os.path.exists(os.path.join(d, 'rig_S.png')) else os.path.join(ROOT, OUT, tag)


def prune(out):
    """what the screens and the bake read stays (the eight stills, the walk, the three portraits, the faces, the two
    jsons); the rig's raw frames, its shadows and the Stand clip (the stills again) go: 1.2 MB a person"""
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_', 'rig_Stand_')): os.remove(os.path.join(out, f))


def run(cmd, out):
    """bpy 4.2 headless dies now and then as Blender exits, after the file is written (COMBAT measured it 10/19):
    a run that wrote its output worked; else the same again, three times at most"""
    for i in range(3):
        t0 = time.time()
        if subprocess.call(cmd, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0: return True
        if os.path.exists(out) and os.path.getmtime(out) >= t0 - 1: return True
    print('FAILED three times:', cmd[:3]); return False


def make(pid):
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    tag = 'person_' + pid.lower()
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag)
    out = os.path.join(ROOT, OUT, tag)
    t0 = time.time()
    if not os.path.exists(glb):
        if not run([py, os.path.abspath(__file__), 'build-one', pid], glb): return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    t1 = time.time()
    if run([py, '-c', render_code(glb, out, h, stand_only=standing_only(pid))], os.path.join(out, 'rig.json')):
        faces(out); prune(out); stow(tag)
        with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(STAMP + '\n')
        for f in (glb, os.path.join(ROOT, 'records/character/rig/%s.glb' % tag)):   # 25 MB a person, rebuilt from the roll on demand
            if os.path.exists(f): os.remove(f)
        print('MADE %s build %.0fs render %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)


# ---- THE FIGHT (the same people on COMBAT's board) ----------------------------------------------------------------
# The fight draws a man from his look's sheet in slices/fight_rig (COMBAT [the fight wears the 3D models]): his stand and
# walk, the gun up, the blow, the blow that rocks him, the fall, and the carry, eight facings, and his gun from a second
# sheet rendered in his look's hands with his body as a holdout. A rolled person gets the same: COMBAT's poses laid on his
# own model (tools/bohemia_combat_the_fight_poses.py, unedited), the six fight clips rendered on the master rig the way
# COMBAT renders them, his stand and walk taken from his street render (the same rig, the same 57 px a metre and the same
# camera, so the same pixels), all of it packed INTO HIS GANG'S CELL (its box, its ground point) so the gang's gun sheet
# sits in his hands as it sits in theirs: the skeleton, the poses and the scale are one, only the clothes differ. The
# people of a place (no gang) take YOU's cell and guns. 144 frames a person instead of 504 with his own three guns.
FIGHT_CLIPS = [('Aim', 3), ('Swing', 3), ('Hit', 2), ('Fall', 3), ('Carry', 1), ('CarryWalk', 6)]
FIGHT_RENDERS = 'records/target/combat/rig'   # COMBAT's render folder (regenerated, its .gitignore)
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
FIGHT_COLS = [('stand', 'Stand', 1), ('walk', 'Anim_0', 6), ('aim', 'Aim', 3), ('swing', 'Swing', 3), ('hit', 'Hit', 2), ('fall', 'Fall', 3),
              ('carry', 'Carry', 1), ('carrywalk', 'CarryWalk', 6)]   # COMBAT's pack(), column for column
PER_GANG_FIGHT = 3   # a band of a few (change 1: sized to the crew) needs at most its pool: tier + 3 a gang it names; 4 cost 25 more minutes for no screen that needs it


def fight_ref(p):
    return 'faction_' + p['gang'].lower() if p['gang'] != TOWN else 'you'


def fight_list():
    """who goes on the board, in the order they are made: each gang's first PER_GANG_FIGHT and the place's people (the
    hall's hires), dealt round by round so a short run still covers every band"""
    R = json.load(open(ROLL)); out = []
    for k in range(max(PER_GANG_FIGHT, 12)):
        for g in GANGS + [TOWN]:
            mine = [p for p in R if p['gang'] == g]
            if k < len(mine) and (g == TOWN or k < PER_GANG_FIGHT): out.append(mine[k])
    return out


def fight_todo():
    def done(pid):
        try: return open(os.path.join(ROOT, FIGHT_RENDERS, 'person_' + pid.lower(), 'made.txt')).read().strip() == STAMP
        except OSError: return False
    return [p['id'] for p in fight_list() if not done(p['id'])]


def fight_make(pid):
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    tag = 'person_' + pid.lower()
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag)
    posed = os.path.join(ROOT, 'records/combat/rig/%s.glb' % tag)
    out = os.path.join(ROOT, FIGHT_RENDERS, tag)
    t0 = time.time()
    if not os.path.exists(posed):
        if not os.path.exists(glb) and not run([py, os.path.abspath(__file__), 'build-one', pid], glb): return
        os.makedirs(os.path.dirname(posed), exist_ok=True)
        if not run([py, os.path.join(ROOT, 'tools/bohemia_combat_the_fight_poses.py'), glb, posed], posed): return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    t1 = time.time()
    if run([py, '-c', render_code(posed, out, h, FIGHT_CLIPS)], os.path.join(out, 'rig.json')):
        for f in os.listdir(out):
            if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
        for f in (glb, posed, os.path.join(ROOT, 'records/character/rig/%s.glb' % tag)):
            if os.path.exists(f): os.remove(f)
        with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(STAMP + '\n')
        print('FOUGHT %s build+pose %.0fs render %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)


def fight_batch(n=2):
    wipe()
    left = fight_todo(); print('%d to put on the board, %d workers' % (len(left), n), flush=True)
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, os.cpu_count() // n)))
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'fight-worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


def fight_worker(w, n):
    for i, pid in enumerate(fight_todo()):
        if i % n == w: fight_make(pid)


def fight_pack():
    """every rolled person with a fight render, packed into slices/fight_rig/person_<id>.webp in his gang's cell (COMBAT's
    pack(): the same columns, the one-pixel day rim, 64 colours lossless), his face added to the fight's face strip, and the
    bands' pools in ours.people_looks taught his look after the first of each pool (that one stands as it was)"""
    import numpy as np
    from PIL import Image
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json'); I = json.load(open(ip))
    want = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in FIGHT_COLS for k in range(ks)]
    assert I['cols'] == want, 'COMBAT changed the fight sheet\'s columns: re-read its pack() before packing people'
    RIM = tuple(I['rim'])
    for k in [k for k, v in I['looks'].items() if v.get('kind') == 'person']: del I['looks'][k]
    made = []
    for p in fight_list():
        tag = 'person_' + p['id'].lower(); fd = os.path.join(ROOT, FIGHT_RENDERS, tag); sd = frames_of(tag)
        if not (os.path.exists(os.path.join(fd, 'rig.json')) and os.path.exists(os.path.join(ROOT, OUT, tag, 'face', 'rest_128.png'))): continue
        ref = fight_ref(p); L = I['looks'][ref]; w, h = L['w'], L['h']; fx, fy = L['foot']
        fr = json.load(open(os.path.join(fd, 'rig.json'))); sr = json.load(open(os.path.join(ROOT, OUT, tag, 'rig.json')))
        sheet = np.zeros((h * len(FIGHT_DIRS), w * len(want), 4), np.uint8); lost = 0
        for row, f in enumerate(FIGHT_DIRS):
            col = 0
            for n, c, ks in FIGHT_COLS:
                for k in range(ks):
                    if c == 'Stand': fn, gp = os.path.join(sd, 'rig_%s.png' % f), sr['ground_px']
                    elif c == 'Anim_0': fn, gp = os.path.join(sd, 'rig_Anim_0_%s_k%02d.png' % (f, k)), sr['ground_px']
                    else: fn, gp = os.path.join(fd, 'rig_%s_%s_k%02d.png' % (c, f, k)), fr['ground_px']
                    a = np.asarray(Image.open(fn).convert('RGBA'))
                    ox, oy = fx - gp[0], fy - gp[1]   # his ground pixel on his gang's: the gang's gun sits in his hands
                    cell = np.zeros((h, w, 4), np.uint8)
                    x0, y0 = max(0, ox), max(0, oy); x1, y1 = min(w, ox + a.shape[1]), min(h, oy + a.shape[0])
                    cell[y0:y1, x0:x1] = a[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
                    lost += int((a[..., 3] > 0).sum()) - int((cell[..., 3] > 0).sum())
                    op = cell[..., 3] > 0; near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    cell[near & ~op] = RIM
                    sheet[row * h:(row + 1) * h, col * w:(col + 1) * w] = cell; col += 1
        q = Image.fromarray(sheet[..., :3]).quantize(64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        im = Image.fromarray(np.dstack([np.asarray(q), sheet[..., 3]]), 'RGBA')
        im.save(os.path.join(FR, tag + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        I['looks'][tag] = dict(file=tag + '.webp', w=w, h=h, foot=L['foot'], height_m=fr['real_dims_m'][2], kind='person', ref=ref,
                               guns=L.get('guns'), gang=p['gang'].lower() if p['gang'] != TOWN else 'town',
                               rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
        made.append((p, tag)); print('PACKED %s in %s\'s cell, %d px outside it, %d KB' % (tag, ref, lost, os.path.getsize(os.path.join(FR, tag + '.webp')) // 1024))
    # THE FACES: the strip the fight's bar and turn row draw from, its own looks as they were and the people after them
    F = I['faces']; strip = Image.open(os.path.join(FR, F['file'])).convert('RGBA'); S = F['size']
    keep = [l for l in F['order'] if not l.startswith('person_')]
    tiles = [strip.crop((F['order'].index(l) * S, 0, F['order'].index(l) * S + S, S)) for l in keep]
    for p, tag in made: tiles.append(Image.open(os.path.join(ROOT, OUT, tag, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX))
    out = Image.new('RGBA', (S * len(tiles), S), (0, 0, 0, 0))
    for i, t in enumerate(tiles): out.paste(t, (i * S, 0))
    out.save(os.path.join(FR, F['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
    F['order'] = keep + [tag for p, tag in made]
    F['people'] = OUT + '/person_<id>/face/rest_128.png (RUN TWO [no two people alike], the head of his own model)'
    I['people'] = "RUN TWO [no two people alike] 10/23: the rolled people (kind 'person'), packed by tools/bohemia_run2_no_two_people_alike.py fight-pack into their gang's cell with their gang's guns; COMBAT's pack() keeps them"
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    # THE BANDS: each pool keeps its first look and then deals the rolled people of every gang it names
    op_ = os.path.join(ROOT, 'records/target/bb/ours.json'); O = json.load(open(op_)); PL = O['people_looks']['value']
    by = {}
    for p, tag in made: by.setdefault(p['gang'].lower(), []).append(tag)
    for kind, pool in PL['band'].items():
        base = [l for l in pool if not l.startswith('person_')]
        gangs = [l.replace('faction_', '') for l in base if l.startswith('faction_')]
        PL['band'][kind] = base[:1] + [t for g in gangs for t in by.get(g, [])] + [l for l in base[1:] if not by.get(l.replace('faction_', ''))]
    O['people_looks']['why'] = O['people_looks']['why'].split(' (10/23, RUN TWO')[0] + (
        " (10/23, RUN TWO [no two people alike], rule 121(i), his 'SO MANY OF THE SAME HATS... 2 OPTIONS FOR CUSTOMIZATIONS': after "
        "each pool's first look, its gangs' rolled people, each his own mix of CHARACTER's pieces; the fight hands a man the first "
        "look nobody on the board wears)")
    with open(op_, 'w') as f: f.write(json.dumps(O, indent=1, ensure_ascii=False) + '\n')
    print('fight people', len(made), {k: len(v) for k, v in by.items()})


def standing_only(pid):
    """a person of the place past the hall's twelve only ever stands (a keeper, a man in a crowd): no walk is rendered for
    him, the map's sheet leaves his walk cells empty and its 'walks' list leaves him out"""
    return pid.startswith('town_') and pid not in [p['id'] for p in fight_list()]


STAMP = 'layers-10-23'   # CHARACTER [the clothes look real] (rule 129): the outfit's layers, his trousers, shoes and gear off his id


def made(tag):
    d = os.path.join(ROOT, OUT, tag)
    try: return os.path.exists(os.path.join(d, 'face', 'M_128.png')) and open(os.path.join(d, 'made.txt')).read().strip() == STAMP
    except OSError: return False


def walk_sheets():
    """THE SETTLEMENT IS BUSY (rule 131): a walker's own sheet for the town screen, slices/rig_walk/<look>.png/.json, a row
    per turn (S SE E NE N NW W SW), his still then the six keys of his walk, every cell his own box with his ground pixel at
    one spot, held to 256 colours of HIS OWN (one man's palette: a tan face stays tan, unlike a sheet shared by thirteen)"""
    from PIL import Image
    od = os.path.join(ROOT, 'slices/rig_walk'); os.makedirs(od, exist_ok=True)
    dirs = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']; n = 0
    for p in json.load(open(ROLL)):
        tag = 'person_' + p['id'].lower(); d = frames_of(tag)
        if standing_only(p['id']) or not os.path.exists(os.path.join(d, 'rig_Anim_0_S_k05.png')): continue
        try:   # ANIMATION's sheet (his work and the walk with a load, tools/bohemia_animation_everybody_idles.py) is made from
            if 'work' in json.load(open(os.path.join(od, tag + '.json'))): continue   # this one and is newer: kept as it is
        except (OSError, ValueError): pass
        gx, gy = json.load(open(os.path.join(ROOT, OUT, tag, 'rig.json')))['ground_px']
        F = [[Image.open(os.path.join(d, 'rig_%s.png' % t)).convert('RGBA')] +
             [Image.open(os.path.join(d, 'rig_Anim_0_%s_k%02d.png' % (t, k))).convert('RGBA') for k in range(6)] for t in dirs]
        bb = [im.getbbox() for row in F for im in row if im.getbbox()]
        half = max(max(gx - b[0], b[2] - gx) for b in bb) + 1
        top, bot = min(b[1] for b in bb), max(b[3] for b in bb)
        w, h, foot = 2 * half, bot - top + 1, gy - top
        sheet = Image.new('RGBA', (w * 7, h * 8), (0, 0, 0, 0))
        for r, row in enumerate(F):
            for c, im in enumerate(row): sheet.alpha_composite(im, (c * w + half - gx, r * h - top))
        sheet.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(os.path.join(od, tag + '.png'), optimize=True)
        with open(os.path.join(od, tag + '.json'), 'w') as f:
            json.dump(dict(w=w, h=h, foot=foot, mid=half, cols=7, dirs=dirs, walk=[1, 2, 3, 4, 5, 6], still=0, look=tag), f); f.write('\n')
        n += 1
    print('walk sheets', n, '->', os.path.relpath(od, ROOT), '(ANIMATION\'s sheets with work kept as they are; its tool remakes them)')


def todo():
    return [p['id'] for p in json.load(open(ROLL)) if not made('person_' + p['id'].lower())]


def rendered():
    """everybody with a finished render, whatever round made it (the index and the sheets read these)"""
    return [p['id'] for p in json.load(open(ROLL)) if os.path.exists(os.path.join(ROOT, OUT, 'person_' + p['id'].lower(), 'face', 'M_128.png'))]


def wipe():
    """a batch starts alone: a model left by a run that was stopped mid-export is not trusted, it is built again"""
    for d in ('records/character/rig', 'records/combat/rig'):
        for f in os.listdir(os.path.join(ROOT, d)):
            if 'person_' in f and f.endswith('.glb'): os.remove(os.path.join(ROOT, d, f))


def batch(n=2):
    wipe()
    left = todo(); print('%d to make, %d workers' % (len(left), n), flush=True)
    if n <= 1:
        for pid in left: make(pid)
        return
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, os.cpu_count() // n)))
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


def worker(w, n):
    for i, pid in enumerate(todo()):
        if i % n == w: make(pid)


BAND = {'porcelain': 'very light', 'chalk': 'very light', 'pale': 'very light', 'fair': 'light', 'olive': 'intermediate',
        'tan': 'tan', 'bronze': 'tan', 'brown': 'brown', 'deep': 'dark', 'ebony': 'dark', 'onyx': 'dark'}   # CHARACTER's tones on the ITA bands engine/bohemia_names.js reads skin by


def who(p):
    """one person as the screens read him: his look, his gang ('town' for a person of the place), every piece he wears
    (read off his build when it is made: CHARACTER's outfit may wear his top or coat in another colour of the same cut, and
    adds his trousers, shoes and gear), and what his face reads as for his name (a beard or stubble reads as a man)"""
    q = dict(look='person_' + p['id'].lower(), gang=p['gang'].lower() if p['gang'] != TOWN else 'town',
             cut=p['hair_cut'], hat=p.get('hat'), face=p.get('eyewear'), beard=p.get('facial_hair'), mark=p.get('mark_name'),
             top=p.get('top'), coat=p.get('coat'), heritage=p['heritage'], skin=BAND.get(p['tone']),
             sex='m' if (p.get('facial_hair') or p.get('stubble')) else None)
    bj = os.path.join(ROOT, 'records/character/rig/person_%s.json' % p['id'].lower())
    if os.path.exists(bj):
        w = json.load(open(bj)).get('worn') or {}
        q['top'] = w.get('base', q['top']); q['coat'] = w.get('outer', q['coat'])
        q['wears'] = {k: v for k, v in w.items() if k not in ('hair', 'outfit') and v}
    return q


def index():
    """engine/bohemia_people_mix.js: everyone rendered, read by engine/bohemia_rig_bodies.js (the body) and
    engine/bohemia_crew_faces.js (the talking face) before any screen draws a man"""
    have = set(rendered())
    people = [who(p) for p in json.load(open(ROLL)) if p['id'] in have]
    fought = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))['looks']
    for q in people:
        if q['look'] in fought: q['fight'] = True   # his sheet is on the fight's board: the hall may hire him
        if standing_only(q['look'][len('person_'):]): q['stands'] = True   # he only ever stands: no walk made
    by = {}
    for q in people: by.setdefault(q['gang'], []).append(q['look'])
    J = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':'))
    head = dict(what="RUN TWO [no two people alike] (rule 121(i)): every person rolled from CHARACTER's pieces inside his gang's colours, "
                     "built by CHARACTER's person builder, rendered on DIRECTION's master rig; nobody on one screen is the same man",
                src=OUT + '/person_<id> (rig_<turn>.png standing, rig_Anim_0_<turn>_k<nn>.png the walk, face/<key>_<64|128>.png)',
                tool='tools/bohemia_run2_no_two_people_alike.py', roll=os.path.relpath(ROLL, ROOT), draft=True)
    with open(os.path.join(ROOT, 'engine/bohemia_people_mix.js'), 'w') as f:
        f.write('/* BOHEMIA PEOPLE MIX -- written by tools/bohemia_run2_no_two_people_alike.py index; do not edit by hand, roll again */\n')
        f.write('(function (root) { root.BOHEMIA_PEOPLE_MIX = {\n')
        for k, v in head.items(): f.write(' %s: %s,\n' % (k, J(v)))
        f.write(' people: [\n%s\n ],\n' % ',\n'.join('  ' + J(q) for q in people))
        f.write(' by_gang: {\n%s\n }\n' % ',\n'.join('  %s: %s' % (J(g), J(v)) for g, v in by.items()))
        f.write('}; })(typeof window !== \'undefined\' ? window : this);\n')
    print('index', len(people), {k: len(v) for k, v in by.items()})


def bake():
    """RUN's bake (tools/bohemia_bake_the_rig_cast.py bake(), unedited) over the person folders, ONE SHEET A GANG
    (slices/rig_mix/<gang>.png / .json, 'town' for the place's people): the same index as the gangs' sheet, so the map's
    own rigSheetSet() cuts it as it is, and a map fetches a gang's sheet only when that gang is first drawn (one sheet of
    116 people would be 126,000 px tall, past what a phone decodes)"""
    import bohemia_bake_the_rig_cast as BK
    have = set(rendered())
    people = [who(p) for p in json.load(open(ROLL)) if p['id'] in have]
    by = {}
    for q in people: by.setdefault(q['gang'], []).append(q)
    od = os.path.join(ROOT, 'slices/rig_mix'); os.makedirs(od, exist_ok=True)
    sheets, pools = {}, {}
    for g, qs in by.items():   # twelve people a sheet at most (96 rows, 13,000 px: the gangs' own sheet is 14,144 and his phone reads it)
        for c in range(0, len(qs), 12):
            name = g if not c else '%s_%d' % (g, c // 12 + 1)
            sheets[name] = qs[c:c + 12]; pools.setdefault(g, []).append(name)
    for f in os.listdir(od):
        if f.endswith(('.png', '.json')) and f[:-5 if f.endswith('.json') else -4] not in sheets and f != 'index.json': os.remove(os.path.join(od, f))
    for g, qs in sheets.items():
        looks = [q['look'] for q in qs]
        BK.SET = dict(looks=looks, src=frames_of,
                      png=os.path.join(od, g + '.png'), json=os.path.join(od, g + '.json'),
                      what="RUN TWO [no two people alike] 10/23: the %s, every man his own roll of CHARACTER's pieces, rendered on the rig, one row per person and turn" % g,
                      frm=OUT + '/person_<id> (tools/bohemia_run2_no_two_people_alike.py)')
        BK.GANGS = looks
        BK.bake()
        meta = json.load(open(BK.SET['json']))
        meta['people'] = qs
        with open(BK.SET['json'], 'w') as f:
            json.dump(meta, f, indent=1); f.write('\n')
    with open(os.path.join(od, 'index.json'), 'w') as f:
        json.dump(dict(what="RUN TWO [no two people alike]: the map's people, a sheet of twelve at most, read by the map's seat keeper",
                       pools=pools, sheets={k: [q['look'] for q in v] for k, v in sheets.items()}), f, indent=1); f.write('\n')
    print('people', len(people), {k: len(v) for k, v in by.items()}, 'sheets', len(sheets))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'roll': roll(*[int(x) for x in sys.argv[2:4]])
    elif cmd == 'build-one': build_one(sys.argv[2])
    elif cmd == 'make': make(sys.argv[2])
    elif cmd == 'batch': batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == 'worker': worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'bake': bake()
    elif cmd == 'index': index()
    elif cmd == 'walk-sheets': walk_sheets()
    elif cmd == 'stow':
        for q in json.load(open(ROLL)): stow('person_' + q['id'].lower())
    elif cmd == 'fight-make': fight_make(sys.argv[2])
    elif cmd == 'fight-batch': fight_batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == 'fight-worker': fight_worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'fight-pack': fight_pack()
    else: print(__doc__)
