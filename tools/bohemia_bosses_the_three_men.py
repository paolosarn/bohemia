#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [each his own look] (11/2/26, VAMILY rule 330; ask lines 328 and 329): THE POT, THE TAP AND THE FILTER
AS THEMSELVES, ON THE RIG THE PEOPLE USE.

PAOLO 11/2: 'each one has to have their own aesthetic'. MEASURED FIRST: the three boss men stood in the fight in their KIND's
pool looks (a militia captain, a brigand leader, the mechanic), so THE POT was any captain with his name on him.

THE METHOD, REUSE FIRST. CHARACTER's tool for a new kind of man (tools/bohemia_character_the_three_enemies.py, imported and
never edited) is the pipe: a type is a look on the rig's man, rolled the barber's way and dressed from CHARACTER's wardrobe
already made, built through the barber, rendered on DIRECTION's master rig the way RUN TWO renders a person (stand, walk in
eight, the portrait and its four mouths), COMBAT's fight poses laid on and the six fight clips rendered. Here its TYPES,
ORDER, POOL, COUNT and its folders are set IN MEMORY to three bosses of one man each:
  THE POT     a chef's whites gone grey (the BONE BUTTON-UP), a cook's half apron (DUST HALF APRON), a bone head wrap for
              the cap, crop trousers and coal boots, a big belly and a cook's shoulders. The pot lid on his arm is the
              fight's Wooden Shield, the cleaver the fight's Butcher's Cleaver (the file's gear).
  THE TAP     the waterworks man gone bad: a field button-up under the TACTICAL VEST (the utility vest, pockets for his
              keys), the work cap, wraparound shades, the tool belt the valve wrench hangs off, cargos, rust boots.
  THE FILTER  the last man who knows the plant: WORK COVERALLS, the RUBBER GAS MASK (his respirator), the soot tool belt
              (his remote), soot gloves, field boots, an olive field cap.
His own sheet goes into the fight's sheets (slices/fight_rig/boss_<id>.webp, kind 'boss', in a reference gang's cell so
that gang's gun sheet fits him) and his face into the fight's face strip and into PORTRAIT's crew-face manifest
(records/target/portrait/crew/<look>/, the 64 and 128 of rest and the four mouths) so the meet card and every mouth card
can show his face talking. boss_act_one.json names the look ('boss.look'); the fight dresses the man in it
(__THE_BOSS_IS_A_MAN__).

Run (BOHEMIA_BPY = a python3.11 venv with bpy 4.2, the studio's way; tools/bohemia_direction_master_rig.py):
    python3 tools/bohemia_bosses_the_three_men.py roll
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_the_three_men.py batch [workers]
    python3 tools/bohemia_bosses_the_three_men.py pack

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twins are the fight's own cast at the same cell (THE MECHANIC
and the gangs in slices/fight_rig) and real photographs of the garments' kind (a line cook's whites and half apron, a water
utility worker's vest and cap, a plant operator's coveralls and half-face respirator). No reference game.
REUSE CHECK (REUSE-FIRST): no garment is modelled here; CHARACTER's wardrobe, the barber, the rig, COMBAT's poses, RUN TWO's
render and faces, CHARACTER's pack shape.
"""
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_the_three_enemies as TE

SOOT = (34, 32, 30)
BOSSES = {
    'Pot': dict(
        what="THE POT: a casino line cook who took the last good kitchen; his chef's whites gone grey, a half apron, a head wrap",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.20, belly=0.95, shoulders=0.70, hips=0.35)],
        look=dict(shirt=dict(colour=(186, 180, 166), sleeve='long'), coat=None,
                  trousers=dict(colour=(52, 50, 48), wide=0.02), shoes=dict(colour=SOOT, kind='boot', top=0.20), belt=None),
        tops=['BONE BUTTON-UP'], coats=['DUST HALF APRON'], legs=['CHARCOAL CROP TROUSER'], feet=['COAL MID BOOT'],
        kit=[['LEATHER BELT']], hats=['HAT BONE HEAD WRAP'], eyewear=[None],
        pieces=[], cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER']),
    'Tap': dict(
        what='THE TAP: a waterworks man who keeps the valve key; a utility vest over his work shirt, the work cap, shades, a tool belt',
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.45, belly=0.25, shoulders=0.55, hips=0.10)],
        look=dict(shirt=dict(colour=(92, 88, 70), sleeve='long'), coat=None,
                  trousers=dict(colour=(96, 86, 62), wide=0.02), shoes=dict(colour=(98, 62, 40), kind='boot', top=0.22), belt=None),
        tops=['FIELD BUTTON-UP'], coats=['TACTICAL VEST'], legs=['KHAKI CARGOS'], feet=['RUST BOOTS'],
        kit=[['SCAV TOOL BELT', 'LEATHER GLOVES']], hats=['HAT DUST WORK CAP'], eyewear=['FACE WRAPAROUND SHADES'],
        pieces=[], cuts=['DEEP TAPER', 'TEMPLE TAPER', 'DRY TAPER']),
    'Filter': dict(
        what='THE FILTER: the last man who knows the water plant; work coveralls, a rubber respirator, a tool belt with his remote',
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.30, belly=-0.30, shoulders=0.05, hips=-0.15)],
        look=dict(shirt=dict(colour=(70, 74, 54), sleeve='long'), coat=None,
                  trousers=dict(colour=(70, 74, 54), wide=0.014), shoes=dict(colour=SOOT, kind='boot', top=0.22), belt=None),
        tops=['WORK COVERALLS'], coats=[None], legs=['PATCHED WORK PANTS'], feet=['FIELD BOOTS'],
        kit=[['SOOT TOOL BELT', 'SOOT GLOVES']], hats=['HAT OLIVE FIELD CAP'], eyewear=['FACE RUBBER GAS MASK'],
        pieces=[], cuts=['HOME CLIPPERS', 'TEMPLE TAPER', 'RAZOR SKULL']),
}
ORDER = ['Pot', 'Tap', 'Filter']
POOL = {'Pot': 'pot', 'Tap': 'tap', 'Filter': 'filter'}
FACE_KEYS = ['rest', 'A', 'E', 'O', 'M']
MANIFEST = os.path.join(ROOT, 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json')


def patch():
    """CHARACTER's tool, pointed at the three bosses (in memory; its file is never edited)"""
    TE.TYPES.clear(); TE.TYPES.update(BOSSES)
    TE.ORDER[:] = ORDER
    TE.POOL = dict(POOL)
    TE.COUNT = {t: 1 for t in ORDER}
    TE.ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_ROLL.json')
    TE.OUT = 'records/target/character/bosses'
    TE.STOW = 'records/character/bosses'
    TE.SHEET_DIR = 'records/target/character/bosses_sheet'
    TE.STAMP = 'bosses-11-2'
    TE.look_of = lambda pid: 'boss_' + pid.lower()

    def ensure_model(pid):
        glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
        if not os.path.exists(glb):
            if not TE.R2().run([TE.bpy_py(), os.path.abspath(__file__), 'build-one', pid], glb): return None
        return glb
    TE.ensure_model = ensure_model

    def worker(w, n):
        left = [p['id'] for p in json.load(open(TE.ROLL)) if not (TE.made(p['id']) and TE.fought(p['id']))]
        for i, pid in enumerate(left):
            if i % n == w: TE.make(pid)
    TE.worker = worker


def roll():
    TE.roll()
    # the barber's tag is his rolled name for the model: one person a boss, his own
    R = json.load(open(TE.ROLL))
    for P in R: P['boss'] = {'pot': 'THE POT', 'tap': 'THE TAP', 'filter': 'THE FILTER'}[P['id'].split('_')[0]]
    json.dump(R, open(TE.ROLL, 'w'), indent=1)


def batch(n=1):
    import subprocess
    left = [p['id'] for p in json.load(open(TE.ROLL)) if not (TE.made(p['id']) and TE.fought(p['id']))]
    print('%d to make, %d workers' % (len(left), n), flush=True)
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 2) // n)))
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


def pack():
    """CHARACTER's pack, kind 'boss' (its own pack rebuilds kind 'enemy' only and would drop the three enemies' looks if pointed
    here): the sheet into the fight's sheets, the face onto the fight's face strip, the face into PORTRAIT's manifest"""
    import numpy as np
    from PIL import Image
    R = TE.R2()
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json'); I = json.load(open(ip))
    cols = R.FIGHT_COLS
    want = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in cols for k in range(ks)]
    assert I['cols'] == want, "COMBAT changed the fight sheet's columns: re-read its pack() before packing"
    RIM = tuple(I['rim'])
    made_ = []
    for p in json.load(open(TE.ROLL)):
        pid = p['id']; lk = TE.look_of(pid)
        if not (TE.fought(pid) and TE.made(pid)): print('NOT MADE', pid); continue
        fd = os.path.join(ROOT, TE.FIGHT_RENDERS, lk); sd = TE.frames_of(pid)
        ref = BOSSES[p['gang']]['cell']; Lr = I['looks'][ref]; w, h = Lr['w'], Lr['h']; fx, fy = Lr['foot']
        fr = json.load(open(os.path.join(fd, 'rig.json'))); sr = json.load(open(os.path.join(ROOT, TE.OUT, lk, 'rig.json')))
        sheet = np.zeros((h * len(R.FIGHT_DIRS), w * len(want), 4), np.uint8)
        for row, f in enumerate(R.FIGHT_DIRS):
            col = 0
            for n, c, ks in cols:
                for k in range(ks):
                    if c == 'Stand': fn, gp = os.path.join(sd, 'rig_%s.png' % f), sr['ground_px']
                    elif c == 'Anim_0': fn, gp = os.path.join(sd, 'rig_Anim_0_%s_k%02d.png' % (f, k)), sr['ground_px']
                    else: fn, gp = os.path.join(fd, 'rig_%s_%s_k%02d.png' % (c, f, k)), fr['ground_px']
                    a = np.asarray(Image.open(fn).convert('RGBA'))
                    ox, oy = fx - gp[0], fy - gp[1]
                    cell = np.zeros((h, w, 4), np.uint8)
                    x0, y0 = max(0, ox), max(0, oy); x1, y1 = min(w, ox + a.shape[1]), min(h, oy + a.shape[0])
                    cell[y0:y1, x0:x1] = a[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
                    op = cell[..., 3] > 0; near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    cell[near & ~op] = RIM
                    sheet[row * h:(row + 1) * h, col * w:(col + 1) * w] = cell; col += 1
        q = Image.fromarray(sheet[..., :3]).quantize(64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        Image.fromarray(np.dstack([np.asarray(q), sheet[..., 3]]), 'RGBA').save(os.path.join(FR, lk + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        I['looks'][lk] = dict(file=lk + '.webp', w=w, h=h, foot=Lr['foot'], height_m=fr['real_dims_m'][2], kind='boss', ref=ref,
                              guns=Lr.get('guns'), boss=p['boss'], rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
        made_.append((p, lk)); print('PACKED %s in %s\'s cell, %d KB' % (lk, ref, os.path.getsize(os.path.join(FR, lk + '.webp')) // 1024))
    # the fight's face strip: his face after everyone already on it (his own replaced if packed before)
    F = I['faces']; strip = Image.open(os.path.join(FR, F['file'])).convert('RGBA'); S = F['size']
    mine = set(lk for p, lk in made_)
    keep = [l for l in F['order'] if l not in mine]
    tiles = [strip.crop((F['order'].index(l) * S, 0, F['order'].index(l) * S + S, S)) for l in keep]
    for p, lk in made_: tiles.append(Image.open(os.path.join(ROOT, TE.OUT, lk, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX))
    out = Image.new('RGBA', (S * len(tiles), S), (0, 0, 0, 0))
    for i, t in enumerate(tiles): out.paste(t, (i * S, 0))
    out.save(os.path.join(FR, F['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
    F['order'] = keep + [lk for p, lk in made_]
    I['bosses'] = ("BOSSES [each his own look] 11/2: THE POT, THE TAP, THE FILTER (kind 'boss'), packed by "
                   "tools/bohemia_bosses_the_three_men.py into a reference gang's cell; records/target/bb/boss_act_one.json names each")
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    # PORTRAIT's manifest: his face talks on every mouth card (engine/bohemia_crew_faces.js reads it at load, no code to change)
    M = json.load(open(MANIFEST))
    for p, lk in made_:
        d = os.path.join(ROOT, 'records/target/portrait/crew', lk); os.makedirs(d, exist_ok=True)
        for k in FACE_KEYS:
            for n in (64, 128): shutil.copy2(os.path.join(ROOT, TE.OUT, lk, 'face', '%s_%d.png' % (k, n)), os.path.join(d, '%s_%d.png' % (k, n)))
        M['faces'][lk] = dict(name=p['boss'], look=lk, model='the barber and the master rig (tools/bohemia_bosses_the_three_men.py)', boss=True,
                             files={k: 'records/target/portrait/crew/%s/%s_{64|128}.png' % (lk, k) for k in FACE_KEYS})
    with open(MANIFEST, 'w') as f: f.write(json.dumps(M, indent=1, ensure_ascii=False))
    print('packed', len(made_), [lk for p, lk in made_])


if __name__ == '__main__':
    patch()
    a = sys.argv[1:]
    cmd = a[0] if a else 'roll'
    if cmd == 'roll': roll()
    elif cmd == 'build-one': TE.build_one(a[1])
    elif cmd == 'batch': batch(int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'worker': TE.worker(int(a[1]), int(a[2]))
    elif cmd == 'make': TE.make(a[1])
    elif cmd == 'pack': pack()
