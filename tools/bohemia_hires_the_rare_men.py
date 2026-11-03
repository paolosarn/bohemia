#!/usr/bin/env python3
"""BOHEMIA -- HIRES [the rare men's looks] (rule 351(a), Paolo 11/3: 'We need more rare characters'; rule 337: no content
without its assets). FOURTEEN RARE MEN, EACH HIS OWN LOOK: every rare man at the post is ONE person of the valley, his
outfit, hair and face picked piece by piece from CHARACTER's barber's book (never rolled), built by CHARACTER's person
builder and rendered on DIRECTION's master rig through RUN TWO's own people tool (imported, never edited), so the man on
the hire card, the crew screen and the fight board is the same man, and no two rare men look alike.

THE PIPE (RUN TWO's tools/bohemia_run2_no_two_people_alike.py, its functions called with THIS roll):
  roll        the DESIGN below -> records/hires/BOHEMIA_HIRES_THE_RARE_ROLL.json (every piece checked against the book)
  make <pid>  build (bpy) + the street render (eight stills, the walk, the portrait and the four mouths) + his faces
  fight <pid> his model posed with COMBAT's fight poses, the six fight clips rendered on the rig
  batch [n]   make + fight every rare man not yet done, n workers
  pack        his fight sheet into slices/fight_rig/person_rare_<n>.webp in the place's people's cell ('you'), his face
              on the fight's face strip, his row in fight_rig.json (kind 'person', gang 'rare'); never touches anyone else's
  walk        his walk sheet for the town (slices/rig_walk/person_rare_<n>.png/.json)
  index       RUN TWO's index(): the people mix with the rare men in it, marked rare (never dealt to a common slot)
  all         roll, batch, pack, walk, index
Run with BOHEMIA_BPY=<venv>/bin/python (bpy 4.2 on python3.11: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy)
"""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
ROLL = os.path.join(ROOT, 'records/hires/BOHEMIA_HIRES_THE_RARE_ROLL.json')
BOOK = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_BARBERS_BOOK.json')
GANG = 'Body'   # the place's people: no gang's colours on him, his own clothes; his fight cell and guns are YOU's

# THE DESIGN: one person per rare kind, every piece named from the book (draft:true; DIRECTION may re-dress any).
# who: the 2050 man under the Battle Brothers background (rare_recruits.json carries his numbers and his words).
DESIGN = [
    dict(id='rare_0', who='road knight: a highway patrol trooper who kept riding the 95 after the state stopped paying',
         heritage='white', tone='fair', hair_cut='TEMPLE TAPER', hair='grey', face_name='LANTERN JAW', facial_hair='HORSESHOE MOUSTACHE',
         mark_name='BROKEN NOSE', eyewear='FACE WRAPAROUND SHADES', top='STEEL WORK SHIRT', coat='LEATHER JACKET',
         legs='BLACK CARGOS', feet='TALL MOTO BOOTS', kit=['STEEL PAULDRON', 'LEATHER GLOVES', 'THIGH HOLSTER']),
    dict(id='rare_1', who='gun for hire: a private military contractor\'s rifleman; the firm folded with the dollar, he kept the rifle',
         heritage='hispanic', tone='bronze', hair_cut='FRENCH CROP', hair='black', face_name='BOXER', facial_hair='CHIN STRAP',
         hat='HAT OLIVE FIELD CAP', eyewear='FACE GREY WRAPAROUNDS', top='OLIVE DRAB TEE', coat='TACTICAL VEST',
         legs='KHAKI CARGOS', feet='FIELD BOOTS', kit=['OLIVE CHEST RIG', 'SCAV KNEEPADS', 'OLIVE RUCK PACK']),
    dict(id='rare_2', who='blade master: thirty years the sword in a Strip casino\'s dinner show; the show closed, the blades stayed sharp',
         heritage='asian', tone='olive', hair_cut='HORSESHOE', hair='grey', face_name='GAUNT', facial_hair='MOUSTACHE',
         mark_name='CLOUDED EYE', top='BONE SHOULDER SHIRT', coat='ASH WRAP COAT',
         legs='WIDE PLEAT TROUSER', feet='ASH COLUMN', kit=['HIP SASH', 'HAND WRAPS']),
    dict(id='rare_3', who='contract man: the one the casinos sent when a debt could not be paid',
         heritage='white', tone='pale', hair_cut='GREASE BACK', hair='dyed black', face_name='HAWK', facial_hair='STUBBLE',
         mark_name='LIP SCAR', top='FADED BLACK LONGSLEEVE', coat='SLATE COMMA COAT',
         legs='CROPPED BLACK DENIM', feet='COAL MID BOOT', kit=['SOOT GLOVES', 'CHARCOAL BELT']),
    dict(id='rare_4', who='lab hunter: kept the de-extinction lab\'s pens; when the money died the clones got out, and he knows them',
         heritage='hispanic', tone='tan', hair_cut='HOME CLIPPERS', hair='brown', face_name='HEAVY BROW', facial_hair='FULL BEARD',
         mark_name='STITCHED GASH', top='SAGE FLANNEL', coat='BARN COAT',
         legs='DUST TROUSERS', feet='DUST BROWN BOOTS', kit=['DUST BROWN BANDOLIER', 'OLIVE LEG WRAPS', 'SALVAGE SATCHEL']),
    dict(id='rare_5', who='old guard: a Guard sergeant whose pension died with the dollar; he still stands a line like it is drill',
         heritage='black', tone='deep', hair_cut='SALT SKULL', hair='grey', face_name='BULLDOG', facial_hair='PATCHY BEARD',
         mark_name='CHEEK SCAR', top='FIELD BUTTON-UP', coat='FIELD JACKET',
         legs='FIELD GREEN PANTS', feet='OLIVE BOOTS', kit=['STEEL SHIN GUARDS', 'KHAKI ELBOW PADS', 'DUST BEDROLL']),
    dict(id='rare_6', who='pit fighter: a cage fighter out of the Mob\'s pit, the crowd\'s favourite the year the lights went half out',
         heritage='black', tone='ebony', hair_cut='RAZOR LINES', hair='black', face_name='BROAD AND SQUARE', facial_hair='GOATEE',
         mark_name='CAULIFLOWER EAR', top='BLACK TANK', coat='LEATHER VEST',
         legs='STACKED JERSEY PANT', feet='STACKED SOLE BOOT', kit=['SPIKED PAULDRON', 'OXBLOOD BRACERS', 'SOOT HAND WRAPS', 'SOOT GORGET']),
    dict(id='rare_7', who='casino heir: a casino family\'s son, fenced at a private academy, the fortune went to zero; he wants a story',
         heritage='white', tone='porcelain', hair_cut='SLICK DRAPE', hair='sand', face_name='SMALL FEATURES',
         top='BONE BUTTON-UP', coat='LEATHER SPLIT-TAIL COAT',
         legs='BONE WIDE TROUSER', feet='LEATHER STACK BOOT', kit=['BONE SCARF', 'LEATHER GLOVES']),
    dict(id='rare_8', who='static hunter: hunts the static listeners; he has heard the broadcast and it did not take him',
         heritage='white', tone='chalk', hair_cut='LONG DROP', hair='black', face_name='LONG AND NARROW', facial_hair='MUTTON CHOPS',
         mark_name='BROW SCAR', top='CHARCOAL STRIPED TEE', coat='SOOT TRENCH',
         legs='SOOT CARGOS', feet='CHARCOAL BOOTS', kit=['SHELL BANDOLIER', 'CHARCOAL SCARF']),
    dict(id='rare_9', who='dune rider: a rodeo rider off the old circuit; the bulls are clones now and so is the whip hand',
         heritage='hispanic', tone='brown', hair_cut='CURTAIN CUT', hair='black', face_name='DIAMOND', facial_hair='PENCIL MOUSTACHE',
         top='DUST PLAID SHIRT', coat='DENIM JACKET',
         legs='BLUE JEANS', feet='RANCH BOOTS', kit=['LEATHER BELT', 'TRAILING SCARF']),
    dict(id='rare_10', who='desert wild: ten years off the grid in the Spring Mountains; he walked down and the money was gone',
         heritage='white', tone='olive', hair_cut='WILD MANE', hair='auburn', face_name='FLAT AND LOW', facial_hair='LONG BEARD',
         top='TATTERED FLANNEL', coat='DUST PONCHO',
         legs='PATCHED WORK PANTS', feet='WRAPPED BOOTS', kit=['BLANKET SHOULDER ROLL', 'FIELD LEG WRAPS', 'WORN BRACERS']),
    dict(id='rare_11', who='casino guard: a casino\'s head of security, twenty years of the floor; the casino is dark, he is not',
         heritage='black', tone='onyx', hair_cut='CROPPED CURLS', hair='black', face_name='WIDE SET', facial_hair='SOUL PATCH',
         top='STORM BUTTON-UP', coat='SLATE CAR COAT',
         legs='DROP RISE TROUSER', feet='COAL COLUMN', kit=['LEAD WAIST WRAP', 'DUST GLOVES']),
    dict(id='rare_12', who='oath keeper: a burned-out SWAT medic; he swore to bring them back and still does',
         heritage='asian', tone='tan', hair_cut='DEEP TAPER', hair='black', face_name='BABY FACE',
         mark_name='CHEEK BURN', top='STEEL HOODIE', coat='STORM JACKET',
         legs='SLATE WORK PANTS', feet='GREY SNEAKERS', kit=['ELBOW PADS', 'SCAV TOOL BELT', 'RUCK PACK']),
    dict(id='rare_13', who='road raider: a convoy raider who walked off when his crew turned on each other',
         heritage='mixed', tone='brown', hair_cut='SCORCH', hair='bleach', face_name='SKULL', facial_hair='FULL BEARD',
         eyewear='FACE RUST DUST MASK', top='TATTERED TEE', coat='RUST WORK COAT',
         legs='RUST CARGOS', feet='RUST BOOTS', kit=['SCRAP CHEST PLATE', 'RUST GORGET', 'SAND KNEEPADS']),
]
SEX_M = True   # every rare man is a man's body (the post's women stand by their own share, rule 214)


def resolve(B, d):
    """one DESIGN row as a roll entry the barber builds (the fields roll_one writes), every name checked against the book"""
    def one(kind, name, key='name'):
        hit = [x for x in B[kind] if x[key] == name]
        assert hit, '%s: no %s named %r in the barber\'s book' % (d['id'], kind, name)
        assert not hit[0].get('held'), '%s: %r is held (left out by its card)' % (d['id'], name)
        return hit[0]
    cut = one('cuts', d['hair_cut'])
    assert d['tone'] in B['skins']['tones'][d['heritage']], '%s: %s is not a %s tone' % (d['id'], d['tone'], d['heritage'])
    hc = [h for h in B['hair_colours'] if h['name'] == d['hair']]; assert hc, d['hair']
    face = one('face_shapes', d['face_name'])
    P = dict(id=d['id'], gang=GANG, heritage=d['heritage'], tone=d['tone'], skin=B['skins']['rig_table'][d['tone']],
             hair_cut=cut['name'], hair=list(hc[0]['step']), face=face['dials'] or None, face_name=face['name'], sex='m',
             rare=True, who=d['who'])
    if d.get('facial_hair'):
        fh = one('facial_hair', d['facial_hair']); P['facial_hair'] = fh['name']
        if fh['portrait_part']: P['beard'] = fh['portrait_part']
        if fh['new_kind']: P['new_beard'] = fh['new_kind']
        if fh['stubble']: P['stubble'] = True
    if d.get('mark_name'):
        mk = one('marks', d['mark_name']); P['mark_name'] = mk['name']
        if mk['portrait_scar']: P['scar'] = mk['portrait_scar']
        if mk['new_kind']: P['mark'] = mk['new_kind']
    if d.get('hat'):
        assert cut['short'], '%s: a hat only over a short cut (the book\'s rule)' % d['id']
        P['hat'] = one('hats', d['hat'])['name']
    if d.get('eyewear'): P['eyewear'] = one('face_pieces', d['eyewear'])['name']
    P['top'] = one('tops', d['top'])['name']
    if d.get('coat'): P['coat'] = one('coats', d['coat'])['name']
    P['legs'] = one('trousers', d['legs'])['name']; P['feet'] = one('shoes', d['feet'])['name']
    P['kit'] = [one('kit', k)['name'] for k in d.get('kit', [])]
    return P


def roll():
    B = json.load(open(BOOK))
    people = [resolve(B, d) for d in DESIGN]
    import bohemia_character_the_barbers_book as BB
    keys = [BB.key(P) + (P['top'], P.get('coat')) for P in people]
    assert len(set(keys)) == len(keys), 'two rare men alike'
    for a in range(len(people)):   # no two share a top AND a coat, nor a cut AND a face (each reads as his own man at 112 px)
        for b in range(a + 1, len(people)):
            A_, B_ = people[a], people[b]
            assert (A_['top'], A_.get('coat')) != (B_['top'], B_.get('coat')), (A_['id'], B_['id'])
            assert (A_['hair_cut'], A_['face_name']) != (B_['hair_cut'], B_['face_name']), (A_['id'], B_['id'])
    os.makedirs(os.path.dirname(ROLL), exist_ok=True)
    with open(ROLL, 'w') as f: json.dump(people, f, indent=1); f.write('\n')
    print('rolled %d rare men, no two alike -> %s' % (len(people), os.path.relpath(ROLL, ROOT)))


def M():
    """RUN TWO's people tool, pointed at this roll (its functions read the module's ROLL)"""
    import bohemia_run2_no_two_people_alike as R2
    R2.ROLL = ROLL
    return R2


def make(pid):
    """RUN TWO's make(), the build step called through THIS file so the build reads this roll"""
    R2 = M(); py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    tag = 'person_' + pid.lower()
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag)
    out = os.path.join(ROOT, R2.OUT, tag)
    t0 = time.time()
    if not os.path.exists(glb):
        if not R2.run([py, os.path.abspath(__file__), 'build-one', pid], glb): return False
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    t1 = time.time()
    if not R2.run([py, '-c', R2.render_code(glb, out, h)], os.path.join(out, 'rig.json')): return False
    R2.faces(out); R2.prune(out); R2.stow(tag)
    with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(R2.STAMP + '\n')
    print('MADE %s build %.0fs render %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)
    return True


def fight(pid):
    """RUN TWO's fight_make(): his model in COMBAT's fight poses, the six clips on the rig (the glb kept from make() if there)"""
    R2 = M(); py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    tag = 'person_' + pid.lower()
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag)
    posed = os.path.join(ROOT, 'records/combat/rig/%s.glb' % tag)
    out = os.path.join(ROOT, R2.FIGHT_RENDERS, tag)
    t0 = time.time()
    if not os.path.exists(posed):
        if not os.path.exists(glb) and not R2.run([py, os.path.abspath(__file__), 'build-one', pid], glb): return False
        os.makedirs(os.path.dirname(posed), exist_ok=True)
        if not R2.run([py, os.path.join(ROOT, 'tools/bohemia_combat_the_fight_poses.py'), glb, posed], posed): return False
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    t1 = time.time()
    if not R2.run([py, '-c', R2.render_code(posed, out, h, R2.FIGHT_CLIPS)], os.path.join(out, 'rig.json')): return False
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    for f in (glb, posed, os.path.join(ROOT, 'records/character/rig/%s.glb' % tag)):
        if os.path.exists(f): os.remove(f)
    with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(R2.STAMP + '\n')
    print('FOUGHT %s build+pose %.0fs render %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)
    return True


def done_street(pid):
    return M().made('person_' + pid.lower())


def done_fight(pid):
    R2 = M()
    try: return open(os.path.join(ROOT, R2.FIGHT_RENDERS, 'person_' + pid.lower(), 'made.txt')).read().strip() == R2.STAMP
    except OSError: return False


def todo():
    return [p['id'] for p in json.load(open(ROLL)) if not (done_street(p['id']) and done_fight(p['id']))]


def worker(w, n):
    for i, pid in enumerate(todo()):
        if i % n != w: continue
        if not done_street(pid):
            # make() deletes his model after the street render; the fight builds it again (as RUN TWO's own two passes do)
            make(pid)
        if not done_fight(pid): fight(pid)


def batch(n=2):
    left = todo(); print('%d rare men to make, %d workers' % (len(left), n), flush=True)
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 2) // n)))
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


def pack():
    """his fight sheet in the place's people's cell (YOU's box, ground point and guns), COMBAT's columns, the one-pixel rim,
    64 colours lossless (RUN TWO's fight_pack(), for these men only); his face added to the fight's face strip; his row in
    fight_rig.json. Nobody else's sheet, face or row is touched."""
    import numpy as np
    from PIL import Image
    R2 = M()
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json'); I = json.load(open(ip))
    want = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in R2.FIGHT_COLS for k in range(ks)]
    assert I['cols'] == want, 'COMBAT changed the fight sheet\'s columns: re-read its pack() before packing people'
    RIM = tuple(I['rim'])
    made = []
    for p in json.load(open(ROLL)):
        tag = 'person_' + p['id'].lower(); fd = os.path.join(ROOT, R2.FIGHT_RENDERS, tag); sd = R2.frames_of(tag)
        if not (os.path.exists(os.path.join(fd, 'rig.json')) and os.path.exists(os.path.join(ROOT, R2.OUT, tag, 'face', 'rest_128.png'))):
            print('NOT YET %s' % tag); continue
        ref = 'you'; L = I['looks'][ref]; w, h = L['w'], L['h']; fx, fy = L['foot']
        fr = json.load(open(os.path.join(fd, 'rig.json'))); sr = json.load(open(os.path.join(ROOT, R2.OUT, tag, 'rig.json')))
        sheet = np.zeros((h * len(R2.FIGHT_DIRS), w * len(want), 4), np.uint8); lost = 0
        for row, f in enumerate(R2.FIGHT_DIRS):
            col = 0
            for n, c, ks in R2.FIGHT_COLS:
                for k in range(ks):
                    if c == 'Stand': fn, gp = os.path.join(sd, 'rig_%s.png' % f), sr['ground_px']
                    elif c == 'Anim_0': fn, gp = os.path.join(sd, 'rig_Anim_0_%s_k%02d.png' % (f, k)), sr['ground_px']
                    else: fn, gp = os.path.join(fd, 'rig_%s_%s_k%02d.png' % (c, f, k)), fr['ground_px']
                    a = np.asarray(Image.open(fn).convert('RGBA'))
                    ox, oy = fx - gp[0], fy - gp[1]
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
                               guns=L.get('guns'), gang='rare', rare=True, rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
        made.append(tag); print('PACKED %s in %s\'s cell, %d px outside it, %d KB' % (tag, ref, lost, os.path.getsize(os.path.join(FR, tag + '.webp')) // 1024))
    # THE FACES: the strip the fight's bar and turn row draw from; his face replaces his old tile or joins the end
    F = I['faces']; strip = Image.open(os.path.join(FR, F['file'])).convert('RGBA'); S = F['size']
    order = list(F['order']); tiles = [strip.crop((i * S, 0, i * S + S, S)) for i in range(len(order))]
    for tag in made:
        t = Image.open(os.path.join(ROOT, R2.OUT, tag, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX)
        if tag in order: tiles[order.index(tag)] = t
        else: order.append(tag); tiles.append(t)
    out = Image.new('RGBA', (S * len(tiles), S), (0, 0, 0, 0))
    for i, t in enumerate(tiles): out.paste(t, (i * S, 0))
    out.save(os.path.join(FR, F['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
    F['order'] = order
    I['rare'] = ("HIRES [the rare men's looks] 11/3: the fourteen rare men (kind 'person', gang 'rare'), packed by "
                 "tools/bohemia_hires_the_rare_men.py pack into the place's people's cell with their guns; RUN TWO's fight-pack drops "
                 "'person' rows it did not make, so run this pack after it (gates/more_rare_hires_gate.js H2 says so)")
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    print('packed %d rare men; face strip %d' % (len(made), len(order)))
    # RUN's atlases (the fight holds a sheet's atlas, not the whole sheet): his new sheet packed the same round
    subprocess.call([sys.executable, os.path.join(ROOT, 'tools/bohemia_run_the_sheets_packed.py')], cwd=ROOT)


def walk():
    """his walk sheet for the town (RUN TWO's walk_sheets(), these men only)"""
    R2 = M(); R2.walk_sheets()


def index():
    """RUN TWO's index() writes the people mix; its HIRES hook reads this roll and marks the rare men"""
    import importlib
    R2 = importlib.import_module('bohemia_run2_no_two_people_alike')
    R2.ROLL = os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')   # the valley's own roll; the hook adds ours
    R2.index()


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'roll': roll()
    elif cmd == 'build-one': M().build_one(sys.argv[2])
    elif cmd == 'make': make(sys.argv[2])
    elif cmd == 'fight': fight(sys.argv[2])
    elif cmd == 'worker': worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'batch': batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == 'pack': pack()
    elif cmd == 'walk': walk()
    elif cmd == 'index': index()
    elif cmd == 'all':
        roll(); batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2); pack(); walk(); index()
    else: print(__doc__)
