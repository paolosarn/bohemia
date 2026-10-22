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
  bake     RUN's bake (tools/bohemia_bake_the_rig_cast.py bake(), unedited) over those folders into ONE sheet:
           slices/BOHEMIA_RIG_MIX.png / .json, the same index as the gangs' sheet, plus who each person is.
Run:
    python3 tools/bohemia_run2_no_two_people_alike.py roll [per_gang 8] [town 12]
    python3 tools/bohemia_run2_no_two_people_alike.py batch [workers 2]      (build + render every person not yet rendered)
    python3 tools/bohemia_run2_no_two_people_alike.py bake
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


def roll(per_gang=8, town=12):
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


def render_code(glb, out, h):
    """DIRECTION's master rig, patched in memory the way COMBAT renders the fight"""
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    assert src.count(a) == 1 and src.count(b) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    argv = ['bohemia_direction_master_rig.py', glb, out, '--real-height', str(h), '--family', 'none',
            '--set', 'samples=%d' % SAMPLES, '--set', 'dent_m=0', '--no-calibration', '--no-id-pass',
            '--clip', 'Stand:1', '--clip', 'Anim_0:6', '--portrait', '128']
    return ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src


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
    if run([py, '-c', render_code(glb, out, h)], os.path.join(out, 'rig.json')):
        for f in (glb, os.path.join(ROOT, 'records/character/rig/%s.glb' % tag)):   # 25 MB a person, rebuilt from the roll on demand
            if os.path.exists(f): os.remove(f)
        print('MADE %s build %.0fs render %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)


def todo():
    return [p['id'] for p in json.load(open(ROLL))
            if not os.path.exists(os.path.join(ROOT, OUT, 'person_' + p['id'].lower(), 'rig_portrait_SW.png'))]


def batch(n=2):
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


def bake():
    """RUN's bake over the person folders: one sheet, the same index as the gangs', plus who each one is"""
    import bohemia_bake_the_rig_cast as BK
    people = [p for p in json.load(open(ROLL)) if not todo().count(p['id'])]
    looks = ['person_' + p['id'].lower() for p in people]
    BK.SET = dict(looks=looks, src=lambda g: os.path.join(ROOT, OUT, g),
                  png=os.path.join(ROOT, 'slices/BOHEMIA_RIG_MIX.png'), json=os.path.join(ROOT, 'slices/BOHEMIA_RIG_MIX.json'),
                  what='RUN TWO [no two people alike] 10/22: every person rolled from CHARACTER\'s pieces inside his gang\'s colours, rendered on the rig, one row per person and turn',
                  frm=OUT + '/person_<id> (tools/bohemia_run2_no_two_people_alike.py)')
    BK.GANGS = looks
    BK.bake()
    meta = json.load(open(BK.SET['json']))
    meta['people'] = [dict(look='person_' + p['id'].lower(), gang=p['gang'].lower() if p['gang'] != TOWN else None,
                           cut=p['hair_cut'], hat=p.get('hat'), face=p.get('eyewear'), beard=p.get('facial_hair'),
                           mark=p.get('mark_name'), top=p.get('top'), coat=p.get('coat'), skin=p['tone'])
                      for p in people]
    meta['by_gang'] = {}
    for q in meta['people']: meta['by_gang'].setdefault(q['gang'] or 'town', []).append(q['look'])
    with open(BK.SET['json'], 'w') as f:
        json.dump(meta, f, indent=1); f.write('\n')
    print('people', len(people), {k: len(v) for k, v in meta['by_gang'].items()})


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'roll': roll(*[int(x) for x in sys.argv[2:4]])
    elif cmd == 'build-one': build_one(sys.argv[2])
    elif cmd == 'make': make(sys.argv[2])
    elif cmd == 'batch': batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == 'worker': worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'bake': bake()
    else: print(__doc__)
