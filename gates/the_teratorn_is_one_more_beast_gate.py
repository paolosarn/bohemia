#!/usr/bin/env python3
"""THE TERATORN IS ONE MORE BEAST (WORLD 12, 11/7/26; VAMILY rule 431(e)(f), ask lines 516 and 517).
PAOLO 11/7: 'I thought they would be like an enemy type'; then 'just another animal we can fight'. The coordinator: one more beast in
the roster, met and fought the way the other beasts are; no special systems, no map sign; it looks like a vulture (the bald red head,
the ruff, the long fingered wings) at every size, or it does not ship.
LEGS:
  T1 THE SHEET: beast_teratorn is in the fight's index like every beast (a row a facing, 18 columns, the stand, walk 6, bite 6, blow 2,
     fall 3), its file there, its standing height a teratorn's (0.7 to 1.2 m)
  T2 IT READS AS A VULTURE AT EVERY SIZE: the bald red head and the pale ruff show in most facings at the fight's pixels and still
     show at the map's sizes down to a fifth; the body is dark; the bite throws the wings out to well over twice its standing width
  T3 ONE MORE BEAST: its row uses a brain the beasts already have and no key the other beasts' rows do not have; its faction, mix,
     flock size and waters; the map's look and grounds; the kill table; the roster lists it
  T4 NO SPECIAL SYSTEMS, NO MAP SIGN: no code names it (only the two name tables), and the map's cap holds the vulture and the
     lair birds at nought
  T5 IN THE FIGHT (the demo, phone held up): a flock through the one door is fielded as teratorns on their own sheet, the win leaves
     a teratorn kill on the map in its own picture, one tap: food and a roll of hides
  R  nothing threw
PLANTED (--plant): the red head painted black (T2), a row with a new brain and a 'flies' key (T3), a vulture back on the map's cap
(T4): each must turn its leg red.
    python3 gates/the_teratorn_is_one_more_beast_gate.py [--plant] [--no-browser]
"""
import json, os, re, subprocess, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda p: json.load(open(os.path.join(ROOT, p)))
PASS = FAIL = 0
LEGS = {}


def ok(name, good, why=''):
    global PASS, FAIL
    if good: PASS += 1
    else: FAIL += 1
    LEGS.setdefault(name.split(' ')[0], True)
    if not good: LEGS[name.split(' ')[0]] = False
    print('  %s %s%s' % ('ok  ' if good else 'FAIL', name, ('  [' + why + ']') if why else ''))


def sheet_checks(img, L, tag=''):
    """T1 and T2 off the sheet image (PIL RGBA)"""
    import numpy as np
    a = np.asarray(img).astype(np.int32)
    w, h = L['w'], L['h']
    t1 = img.size == (w * 18, h * 8) and L.get('kind') == 'beast' and L.get('clips') == {'stand': [0], 'walk': [1, 2, 3, 4, 5, 6], 'bite': [7, 8, 9, 10, 11, 12], 'hit': [13, 14], 'fall': [15, 16, 17]} \
        and 0.7 <= float(L.get('height_m', 0)) <= 1.2
    ok('T1%s THE SHEET: in the fight\'s index like every beast, 8 facings x 18 frames, standing %.2f m' % (tag, float(L.get('height_m', 0))), t1, '%s %s' % (img.size, (w, h)))

    def cell(r, c): return a[r * h:(r + 1) * h, c * w:(c + 1) * w]
    def masks(x):
        R, G, B, A = x[..., 0], x[..., 1], x[..., 2], x[..., 3]
        op = A > 0
        red = op & (R > 120) & (R > G * 1.45) & (R > B * 1.45)
        pale = op & (R > 150) & (G > 145) & (B > 130) & (abs(R - B) < 50)
        dark = op & ((R + G + B) < 210)
        return op, red, pale, dark
    heads = ruffs = 0; dark_share = []; widths = []
    for r in range(8):
        op, red, pale, dark = masks(cell(r, 0))
        heads += red.sum() >= 3; ruffs += pale.sum() >= 3
        dark_share.append(dark.sum() / max(1, op.sum()))
        cols = op.any(0); widths.append(int(cols.sum()))
    bite_w = []
    for c in range(7, 13):
        op = cell(0, c)[..., 3] > 0; bite_w.append(int(op.any(0).sum()))
    # at the map's sizes: the SE stand frame shrunk (nearest, the map's own pen) to a half, a third and a fifth
    from PIL import Image
    se = Image.fromarray(cell(1, 0).astype('uint8'), 'RGBA'); small = {}
    for k in (0.5, 0.33, 0.2):
        s = se.resize((max(1, int(w * k)), max(1, int(h * k))), Image.NEAREST); op, red, pale, dark = masks(np.asarray(s).astype(np.int32))
        small[k] = (int(red.sum()), int(pale.sum()))
    t2 = heads >= 6 and ruffs >= 6 and min(dark_share) >= 0.5 and max(bite_w) >= 2.2 * widths[0] and all(v[0] >= 1 and v[1] >= 1 for v in small.values())
    ok('T2%s IT READS AS A VULTURE AT EVERY SIZE: the bald red head and the pale ruff, a dark body, the wings thrown out in the bite' % tag, t2,
       'red head in %d of 8 facings, ruff in %d, dark %.0f%% at least, standing %d px wide facing S, the bite up to %d; at the map\'s half, third and fifth: red/ruff px %s'
       % (heads, ruffs, 100 * min(dark_share), widths[0], max(bite_w), small))


def roster_checks(E, JK, C, ROS, tag=''):
    rows = {r['id']: r for r in E['rows']}; t = rows.get('teratorn')
    beasts = [r for r in E['rows'] if r.get('beast') and r['id'] != 'teratorn']
    keys = set().union(*[set(r.keys()) for r in beasts]); bkeys = set().union(*[set(r['beast'].keys()) for r in beasts])
    good = bool(t) and t['brain'] in E['brains'] and set(t.keys()) <= keys and set(t['beast'].keys()) <= bkeys and t['beast'].get('rig') == 'beast_teratorn' \
        and t['faction'] == 'teratorns' and E['factions'].get('teratorns', {}).get('beast') is True and 'teratorns' in E['mix'] and E['count_scale'].get('teratorns') \
        and 'teratorns' in E['water']['by_faction'] \
        and JK['beast_looks'].get('teratorns', {}).get('look') == 'beast_teratorn' and any((g.get('teratorns') or 0) > 0 for k, g in JK['beasts_by_ground'].items() if not k.startswith('_')) \
        and C['kinds'].get('teratorn') and C['by_faction'].get('teratorns') == 'teratorn' \
        and any(x.get('type') == 'teratorn' for x in ROS['types'])
    extra = sorted(set(t.keys()) - keys) if t else None
    ok('T3%s ONE MORE BEAST: an existing brain (%s), no key the other beasts lack, its faction, mix, flock, waters, the map\'s look and grounds, the kill, the roster'
       % (tag, t and t.get('brain')), good, 'new keys: %s; grounds %s' % (extra, [k for k, g in JK['beasts_by_ground'].items() if not k.startswith('_') and (g.get('teratorns') or 0) > 0]))


def code_checks(AMB, tag=''):
    names = []
    for p in glob.glob(os.path.join(ROOT, 'slices', '*.js')) + glob.glob(os.path.join(ROOT, 'slices', '*.html')) + glob.glob(os.path.join(ROOT, 'engine', '*.js')):
        try: s = open(p, encoding='utf-8', errors='ignore').read()
        except Exception: continue
        if 'teratorn' in s.lower():
            for ln in s.split('\n'):
                if 'teratorn' in ln.lower(): names.append((os.path.relpath(p, ROOT), ln.strip()))
    allowed = [l for l in names if ("teratorn: ['TERATORN'" in l[1] and l[0] == 'slices/bohemia_job_danger.js') or ("teratorns: 'The teratorns'" in l[1] and l[0] == 'slices/BOHEMIA_FIGHT.html')]
    other = [l for l in names if l not in allowed and l[0] != 'slices/BOHEMIA_DEMO.html' and l[0] != 'slices/BOHEMIA_ALPHA_0_9.html']
    k = AMB['kinds']
    good = len(allowed) == 2 and not other and k.get('vulture', {}).get('at_once') == 0 and k.get('lair_birds', {}).get('at_once') == 0
    ok('T4%s NO SPECIAL SYSTEMS, NO MAP SIGN: only the two name tables say teratorn; the map\'s cap holds the vulture and the lair birds at nought' % tag, good,
       'named in code: %s; vulture %s, lair birds %s' % ([(f, l[:90]) for f, l in other[:3]], k.get('vulture', {}).get('at_once'), k.get('lair_birds', {}).get('at_once')))


def main():
    from PIL import Image
    print('\nTHE TERATORN IS ONE MORE BEAST (rule 431(e)(f))')
    idx = J('slices/fight_rig/fight_rig.json'); L = idx['looks'].get('beast_teratorn')
    if not L: ok('T1 THE SHEET', False, 'no beast_teratorn in the index'); return finish()
    img = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA')
    sheet_checks(img, L)
    E, JK, C, ROS, AMB = J('records/target/bb/bohemia_enemies.json'), J('records/target/BOHEMIA_JOB_KINDS.json'), J('records/target/bb/carcass.json'), J('records/target/bb/roster.json'), J('records/target/bb/map_ambient.json')
    roster_checks(E, JK, C, ROS)
    code_checks(AMB)
    if '--no-browser' not in sys.argv:
        r = subprocess.run(['node', os.path.join(ROOT, 'gates/the_teratorn_is_one_more_beast_fight.js')], cwd=ROOT, capture_output=True, text=True, timeout=600)
        line = [l for l in r.stdout.split('\n') if l.startswith('RESULT ')]
        res = json.loads(line[-1][7:]) if line else {'err': (r.stderr or '')[-300:]}
        them = res.get('them') or []; k = res.get('kill') or {}; tk = res.get('take') or {}; sh = res.get('sheet') or {}
        ok('T5 IN THE FIGHT: a flock fielded as teratorns on their own sheet; the win leaves a teratorn kill in its own picture; one tap, food and a roll of hides',
           res.get('fight') and len(them) >= 2 and all(u['kind'] == 'teratorn' and u['beast'] and u['look'] == 'beast_teratorn' for u in them) and sh.get('w') == L['w'] * 18
           and k.get('kind') == 'teratorn' and k.get('pic') and tk.get('ok') and tk.get('food', 0) > 0 and tk.get('hides') == 1,
           json.dumps({k2: res.get(k2) for k2 in ('them', 'sheet', 'kill', 'take', 'err')})[:600])
        ok('R nothing threw on the page', not res.get('errs'), '; '.join((res.get('errs') or [])[:2]))
    if '--plant' in sys.argv:
        import copy, numpy as np
        print('\n--- PLANTED (each must go red) ---')
        keep = (PASS, FAIL, dict(LEGS))
        a = np.asarray(img).copy(); R, G, B = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
        red = (a[..., 3] > 0) & (R > 120) & (R > G * 1.45) & (R > B * 1.45); a[red, :3] = (20, 18, 16)
        sheet_checks(Image.fromarray(a, 'RGBA'), L, ' [planted: the head painted black]')
        E2 = copy.deepcopy(E); [r.update(brain='flier', flies=True) for r in E2['rows'] if r['id'] == 'teratorn']
        roster_checks(E2, JK, C, ROS, ' [planted: a new brain and a flies key]')
        A2 = copy.deepcopy(AMB); A2['kinds']['vulture']['at_once'] = 3
        code_checks(A2, ' [planted: three vultures on the map]')
        caught = {k2: LEGS.get(k2) is False for k2 in ('T2', 'T3', 'T4')}
        globals()['PASS'], globals()['FAIL'] = keep[0], keep[1]; LEGS.clear(); LEGS.update(keep[2])
        ok('PLANTS every planted defect turned its leg red', all(caught.values()), json.dumps(caught))
    return finish()


def finish():
    print('\nTHE TERATORN IS ONE MORE BEAST: %d passed, %d failed' % (PASS, FAIL))
    sys.exit(1 if FAIL else 0)


if __name__ == '__main__':
    main()
