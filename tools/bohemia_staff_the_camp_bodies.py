#!/usr/bin/env python3
"""BOHEMIA -- STAFF [the camp bodies] (VAMILY rule 468, THE STAFF FIGHT TOO; the research page
records/BOHEMIA_RESEARCH_THE_STAFF_FIGHT_TOO_11_21_26.md, B7 and C10: 'Only 5 of the 18 follower looks have a fight sheet...
ONE ID, ONE WHOLE PERSON says the cook on the board wears the cook's own body, so those 13 sheets are a build step').

Nothing drawn new and nothing of the people's tool edited: the camp's thirteen are people of the valley RUN TWO already rolled,
built and rendered standing (records/run2/people/person_town_<n>, their faces in records/target/character/barber). This puts
them on the fight's board the way RUN TWO's own tool puts the hall's twelve there (tools/bohemia_run2_no_two_people_alike.py,
imported, its functions called as they are):
  walk     his six-key walk in eight turns (the master rig's Anim_0 clip, the street's own render, no portrait: his face and his
           stills stand as committed), into his stowed frames, where the fight pack reads the walk column
  fight    RUN TWO's fight_make: COMBAT's poses on his own model, the six fight clips, into COMBAT's render folder (.gitignore'd)
  pack     RUN TWO's fight_pack, its list taught these thirteen: his sheet slices/fight_rig/person_<id>.webp in YOU's cell with
           YOU's guns; his face on a face strip of the camp's own (the first strip is at WebP's width limit); no band deals a town
           person, so no enemy wears a camp face
Run (bpy 4.2 on python3.11, tools/bohemia_direction_master_rig.py's venv):
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_staff_the_camp_bodies.py all [workers 2]
    python3 tools/bohemia_staff_the_camp_bodies.py pack
    python3 tools/bohemia_staff_the_camp_bodies.py list
"""
import json, os, shutil, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_run2_no_two_people_alike as P   # noqa: E402

SCRATCH = os.environ.get('BOHEMIA_STAFF_SCRATCH') or '/tmp/bohemia_staff_walk'


def camp_people():
    """the followers' looks that have no fight sheet yet (records/target/bb/retinue.json), as RUN TWO's roll ids"""
    R = json.load(open(os.path.join(ROOT, 'records/target/bb/retinue.json')))['followers']['value']
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))['looks']
    roll = {p['id']: p for p in json.load(open(P.ROLL))}
    out = []
    for r in R:
        look = r.get('look') or ''
        pid = look.replace('person_', '', 1)
        if look.startswith('person_') and look not in I and pid in roll and pid not in out: out.append(pid)
    return out


def walk(pid):
    """his walk, the street render's own clip, into his stowed frames (nothing else of his street render is touched)"""
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    tag = 'person_' + pid.lower()
    stow = os.path.join(ROOT, P.STOW, tag)
    if all(os.path.exists(os.path.join(stow, 'rig_Anim_0_%s_k%02d.png' % (d, k))) for d in P.FIGHT_DIRS for k in range(6)): return True
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag)
    if not os.path.exists(glb) and not P.run([py, os.path.join(ROOT, 'tools/bohemia_run2_no_two_people_alike.py'), 'build-one', pid], glb): return False
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(SCRATCH, tag); os.makedirs(out, exist_ok=True)
    t0 = time.time()
    if not P.run([py, '-c', P.render_code(glb, out, h, [('Anim_0', 6)])], os.path.join(out, 'rig.json')): return False
    os.makedirs(stow, exist_ok=True); n = 0
    for f in sorted(os.listdir(out)):
        if f.startswith('rig_Anim_0_') and f.endswith('.png'): shutil.copy2(os.path.join(out, f), os.path.join(stow, f)); n += 1
    print('WALKED %s %d frames %.0fs' % (pid, n, time.time() - t0), flush=True)
    return n >= 48


def fought(pid):
    try: return open(os.path.join(ROOT, P.FIGHT_RENDERS, 'person_' + pid.lower(), 'made.txt')).read().strip() == P.STAMP
    except OSError: return False


def one(pid):
    if not walk(pid): print('NO WALK', pid, flush=True); return
    if not fought(pid): P.fight_make(pid)


def worker(w, n):
    for i, pid in enumerate(camp_people()):
        if i % n == w: one(pid)


def teach():
    """RUN TWO's fight list, taught the camp's people (after its own, so nobody's place moves)"""
    base = P.fight_list
    def fight_list():
        out = base(); have = set(p['id'] for p in out)
        roll = {p['id']: p for p in json.load(open(P.ROLL))}
        return out + [roll[pid] for pid in CAMP if pid not in have]
    P.fight_list = fight_list


def pack():
    """RUN TWO's fight_pack's sheet step for the camp's people (its own loop, its own cell, its own rim, called through its own module:
    the sheets), then their index rows as it writes them, and their faces on a strip of their own: the fight's first face strip is at
    WebP's 16,383-pixel limit (127 faces of 128), so they go on the fight's next strip the way faces_more did (DB.rig.faces.more, read by
    the fight's __THE_SECOND_FACE_STRIP__), never a re-encode of the first"""
    import numpy as np
    from PIL import Image
    teach()
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json')
    # 1. the sheets: RUN TWO's own pack, stopped before its face strip (its strip cannot grow), its index rows kept from its loop
    real_save = Image.Image.save
    def save(im, fp, *a, **k):
        if isinstance(fp, str) and os.path.basename(fp) == 'faces.webp': raise StopIteration('the first strip is full')
        return real_save(im, fp, *a, **k)
    Image.Image.save = save
    try: P.fight_pack()
    except StopIteration: pass
    finally: Image.Image.save = real_save
    I = json.load(open(ip)); I0 = json.dumps(I, sort_keys=True)
    camp = ['person_' + pid.lower() for pid in CAMP]
    for tag in camp:
        fd = os.path.join(ROOT, P.FIGHT_RENDERS, tag); sheet = os.path.join(FR, tag + '.webp')
        if not (os.path.exists(sheet) and os.path.exists(os.path.join(fd, 'rig.json'))): print('NO SHEET', tag); continue
        L = I['looks']['you']; fr = json.load(open(os.path.join(fd, 'rig.json')))
        I['looks'][tag] = dict(file=tag + '.webp', w=L['w'], h=L['h'], foot=L['foot'], height_m=fr['real_dims_m'][2], kind='person', ref='you',
                               guns=L.get('guns'), gang='town', rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
    # 2. the faces, their own strip
    F = I['faces']; S = F['size']; more = F.setdefault('more', [])
    have = set(F['order']) | set(l for M in more for l in M.get('order', []))
    mine = [t for t in camp if t in I['looks'] and t not in have and os.path.exists(os.path.join(ROOT, P.OUT, t, 'face', 'rest_128.png'))]
    M = next((m for m in more if m.get('file') == 'faces_camp.webp'), None)
    if mine:
        if M is None: M = {'file': 'faces_camp.webp', 'order': [], 'what': 'STAFF [the camp bodies] 11/21 (VAMILY rule 468): the camp people\'s faces, the head of each one\'s own model (records/target/character/barber/person_<id>/face/rest_128.png)'}; more.append(M)
        order = M['order'] + mine
        out = Image.new('RGBA', (S * len(order), S), (0, 0, 0, 0))
        old = Image.open(os.path.join(FR, M['file'])).convert('RGBA') if M['order'] and os.path.exists(os.path.join(FR, M['file'])) else None
        for i, l in enumerate(order):
            if old is not None and l in M['order']: j = M['order'].index(l); out.paste(old.crop((j * S, 0, j * S + S, S)), (i * S, 0))
            else: out.paste(Image.open(os.path.join(ROOT, P.OUT, l, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX), (i * S, 0))
        real_save(out, os.path.join(FR, M['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
        M['order'] = order
    if json.dumps(I, sort_keys=True) != I0:
        with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    print('camp bodies in the fight:', sum(1 for t in camp if t in I['looks']), 'of', len(camp), '| faces on faces_camp.webp:', len(M['order']) if M else 0)


CAMP = []

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    CAMP[:] = camp_people()
    if cmd == 'list': print(CAMP)
    elif cmd == 'one': one(sys.argv[2])
    elif cmd == 'worker': worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'all':
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 2
        env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 2) // n)))
        procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
        for p in procs: p.wait()
    elif cmd == 'pack':
        pack()
    else: print(__doc__)
