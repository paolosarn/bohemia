#!/usr/bin/env python3
"""THE PACKERS MERGE (PLUMBER 8, 11/10/26; the coordinator's routine 'PLUMBER 8: the packers merge', CHARACTER's block on ask 238).

THE PIPE: the five sheet packers that build the shared people indexes (RUN TWO's fight_pack, ANIMATION's everybody_idles people_pack,
the_towns_activities pack, what_a_man_holds pack, melee_in_hand pack) are fed by render caches that are .gitignore'd: only the box that
rendered a man holds them. MEASURED on a fresh checkout of main (a pack with NOTHING rendered on the box, which is every box but the one
that rendered): fight_pack took 69 rolled men and their 69 faces out of the fight sheet and emptied 18 of the bands' 22 pools;
people_pack took 18 map sheets, 154 men's map idles and the 54 fight men's idles out. So no lane could re-make a few men (CHARACTER's
clothes for the company) without deleting everybody else, and CHARACTER stood BLOCKED.
NOW (__THE_PACKERS_MERGE__ in both tools): the committed sheets and indexes are the truth. A man rendered on the box is added or replaced;
every other entry stands; a shared map sheet that takes a man keeps every other man's cells, cut back out of its committed picture by
their committed boxes; nothing is written when nothing changed. BOHEMIA_PACK_REBUILD=1 is the old way (the plant).

THE LEGS, each in a disposable checkout of HEAD with this tree's five tools laid over it (its caches are empty: none is committed):
  M1 EMPTY CACHE: each of the five packs leaves every committed entry as it was: no picture changes, and every index's looks, faces,
     map files and pools parse equal to the committed ones (a pack may refresh its own settings, e.g. the towns' activity list)
  M2 ONE MAN RE-PACKED INTO A SHARED MAP SHEET (a cache for one man made from his committed cells): people_pack keeps every man of
     the committed map index, and every cell of every man comes back pixel for pixel
  P1 PLANTED: the old way (BOHEMIA_PACK_REBUILD=1) on the same empty cache loses entries, so M1 would be red
python3 gates/the_packers_merge_gate.py   (about 2 min: one checkout, seven packs)
"""
import json, os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = ['tools/bohemia_run2_no_two_people_alike.py', 'tools/bohemia_animation_everybody_idles.py',
         'tools/bohemia_animation_the_towns_activities.py', 'tools/bohemia_animation_what_a_man_holds.py',
         'tools/bohemia_animation_melee_in_hand.py']
PACKS = [('fight_pack', [TOOLS[0], 'fight-pack']), ('people_pack', [TOOLS[1], 'people_pack']), ('towns pack', [TOOLS[2], 'pack']),
         ('holds pack', [TOOLS[3], 'pack']), ('melee pack', [TOOLS[4], 'pack'])]
# what a pack must never lose or change: per index, the parts that are entries (the rest is the pack's own settings)
ENTRIES = {'slices/fight_rig/fight_rig.json': ['looks', 'faces'], 'slices/rig_idles/rig_idles.json': ['looks'],
           'slices/rig_idles/map_people.json': ['files', 'looks'], 'slices/rig_town/rig_town.json': ['looks'],
           'slices/rig_hold/rig_hold.json': ['looks'], 'slices/rig_melee/rig_melee.json': ['looks']}
POOLS = 'records/target/bb/ours.json'
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def git(args, cwd=ROOT):
    return subprocess.run(['git'] + args, cwd=cwd, capture_output=True, text=True)


def committed_json(wt, rel):
    r = git(['show', 'HEAD:' + rel], wt)
    return json.loads(r.stdout) if r.returncode == 0 else None


def losses(wt):
    """what the packs changed in the checkout that a pack must never change: pictures, entries, pools"""
    bad = []
    st = git(['status', '--porcelain'], wt).stdout.splitlines()
    for line in st:
        rel = line[3:].strip()
        if rel.startswith('tools/'): continue
        if rel.endswith(('.webp', '.png', '.jpg')): bad.append(rel + ' (a picture)'); continue
        if rel in ENTRIES:
            a, b = committed_json(wt, rel), json.load(open(os.path.join(wt, rel)))
            for k in ENTRIES[rel]:
                if (a or {}).get(k) != b.get(k):
                    na, nb = len((a or {}).get(k) or {}), len(b.get(k) or {})
                    bad.append('%s %s (%d -> %d)' % (rel, k, na, nb))
        elif rel == POOLS:
            a, b = committed_json(wt, rel), json.load(open(os.path.join(wt, rel)))
            if a['people_looks']['value']['band'] != b['people_looks']['value']['band']:
                d = sum(1 for k in a['people_looks']['value']['band'] if a['people_looks']['value']['band'][k] != b['people_looks']['value']['band'].get(k))
                bad.append('%s bands (%d pools changed)' % (rel, d))
        elif line.startswith(' D') or line.startswith('D'):
            bad.append(rel + ' (deleted)')
    return bad


def run_packs(wt, env_extra=None, only=None):
    env = dict(os.environ); env.update(env_extra or {})
    out = {}
    for name, cmd in PACKS:
        if only and name not in only: continue
        r = subprocess.run([sys.executable] + cmd, cwd=wt, env=env, capture_output=True, text=True, timeout=900)
        out[name] = (r.returncode, (r.stdout + r.stderr).strip().split('\n')[-1][:140])
    return out


def lay_tools(wt):
    for t in TOOLS: shutil.copy(os.path.join(ROOT, t), os.path.join(wt, t))   # the tools under test are this tree's


def reset(wt):
    git(['checkout', '-q', '--', '.'], wt); git(['clean', '-fdq', 'slices', 'records'], wt); lay_tools(wt)   # a checkout puts HEAD's tools back


def main():
    print('\nTHE PACKERS MERGE (the coordinator\'s routine, CHARACTER\'s block on ask 238)\n')
    tmp = tempfile.mkdtemp(prefix='bohemia_packers_')
    wt = os.path.join(tmp, 'wt')
    try:
        add = git(['worktree', 'add', '--detach', '-q', wt, 'HEAD'])
        ok('a disposable checkout of HEAD could be made', add.returncode == 0, (add.stderr or '').strip()[-120:])
        if add.returncode != 0: return
        lay_tools(wt)
        # M1 the empty cache
        res = run_packs(wt)
        crashed = [n for n, (rc, _) in res.items() if rc != 0]
        bad = losses(wt)
        ok('M1 EMPTY CACHE: the five packs ran with nothing rendered on the box and lost nothing committed (no picture changed; '
           'looks, faces, map files and pools as committed)', not crashed and not bad,
           ('CRASHED: ' + '; '.join('%s: %s' % (n, res[n][1]) for n in crashed) + '; ' if crashed else '') + ('; '.join(bad) or
           'nothing lost: ' + ', '.join('%s %s' % (n, res[n][1][:60]) for n in res)))
        reset(wt)
        # M2 one man re-packed into a shared map sheet, from a cache made of his own committed cells
        M2 = committed_json(wt, 'slices/rig_idles/map_people.json')
        m2_ok, m2_say = False, 'no man to re-pack'
        try:
            import numpy as np
            from PIL import Image
            tags = sorted(t for t, L in M2['looks'].items() if t.startswith('person_') and L.get('mix') and
                          os.path.exists(os.path.join(wt, 'records/target/character/barber', t, 'rig.json')) and
                          os.path.exists(os.path.join(wt, 'slices/rig_idles', t + '.json')))
            if tags:
                tag = tags[0]; L = M2['looks'][tag]; fn = L['file']; rects = M2['files'][fn]
                atl = np.asarray(Image.open(os.path.join(wt, 'slices/rig_idles', fn)).convert('RGBA'))
                keys, cells = [], []
                for pose, rows in L['poses'].items():
                    for r_, ci in enumerate(rows):
                        if ci is None: continue
                        x, y, w, h, dx, dy = rects[ci]; keys.append((pose, r_, dx, dy)); cells.append(atl[y:y + h, x:x + w].copy())
                d = os.path.join(wt, 'records/target/animation/idles', tag); os.makedirs(d, exist_ok=True)
                open(os.path.join(d, 'made.txt'), 'w').write('made by the packers-merge gate\n')
                ca = np.empty(len(cells), dtype=object)
                for i, a in enumerate(cells): ca[i] = a
                np.savez(os.path.join(d, 'map_cells.npz'), sheet=np.array(L['mix']), keys=np.array(keys, dtype=object), cells=ca)
                os.utime(os.path.join(wt, 'slices/rig_idles', tag + '.json'), None)   # his sheet stands: newer than his made.txt
                r = run_packs(wt, only=('people_pack',))['people_pack']
                N2 = json.load(open(os.path.join(wt, 'slices/rig_idles/map_people.json')))
                lost = sorted(set(M2['looks']) - set(N2['looks']))
                diff = 0; checked = 0; opened = {}
                def pic(f):
                    if f not in opened: opened[f] = np.asarray(Image.open(os.path.join(wt, 'slices/rig_idles', f)).convert('RGBA'))
                    return opened[f]
                for t2, L2 in N2['looks'].items():
                    L1 = M2['looks'].get(t2)
                    if not L1: continue
                    for pose, rows in L1['poses'].items():
                        for r_, ci in enumerate(rows):
                            if ci is None: continue
                            nci = (L2['poses'].get(pose) or [None] * 8)[r_]
                            if nci is None: diff += 1; continue
                            x, y, w, h, dx, dy = M2['files'][L1['file']][ci]; X, Y, W, H, DX, DY = N2['files'][L2['file']][nci]
                            checked += 1
                            if (w, h, dx, dy) != (W, H, DX, DY): diff += 1; continue
                            old = committed_pic(wt, 'slices/rig_idles/' + L1['file'])[y:y + h, x:x + w]
                            if not np.array_equal(old, pic(L2['file'])[Y:Y + H, X:X + W]): diff += 1
                m2_ok = r[0] == 0 and not lost and checked > 50 and diff == 0
                m2_say = '%s re-packed into %s: %d men kept of %d, %d cells compared, %d differ%s' % (tag, fn, len(set(M2['looks']) & set(N2['looks'])), len(M2['looks']), checked, diff,
                                                                                                ('; LOST ' + ', '.join(lost[:5])) if lost else '')
        except Exception as e:
            m2_say = 'threw: %s' % str(e)[:140]
        ok('M2 ONE MAN RE-PACKED INTO A SHARED MAP SHEET: every man of the committed map index kept, every cell pixel for pixel', m2_ok, m2_say)
        reset(wt)   # (git clean removes the made cache: it is untracked)
        # P1 the plant: the old way on the same empty cache
        run_packs(wt, env_extra={'BOHEMIA_PACK_REBUILD': '1'}, only=('fight_pack', 'people_pack'))
        badp = losses(wt)
        ok('P1 PLANTED: the old way (BOHEMIA_PACK_REBUILD=1) on the same empty cache loses entries, so M1 would be red', len(badp) >= 2, '; '.join(badp))
    finally:
        git(['worktree', 'remove', '--force', wt]); shutil.rmtree(tmp, ignore_errors=True); git(['worktree', 'prune'])
    print('\nTHE PACKERS MERGE: %d passed, %d failed' % (passed, failed))


_COMMITTED = {}
def committed_pic(wt, rel):
    import io
    import numpy as np
    from PIL import Image
    if rel not in _COMMITTED:
        b = subprocess.run(['git', 'show', 'HEAD:' + rel], cwd=wt, capture_output=True).stdout
        _COMMITTED[rel] = np.asarray(Image.open(io.BytesIO(b)).convert('RGBA'))
    return _COMMITTED[rel]


if __name__ == '__main__':
    main()
    sys.exit(1 if failed else 0)
