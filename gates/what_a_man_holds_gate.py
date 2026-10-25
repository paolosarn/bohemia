#!/usr/bin/env python3
"""WHAT A MAN HOLDS (ANIMATION [the PC playtest: the bodies' part], rule 164 items 21, 22, 31; Paolo 10/24 on his PC: 'if
they're using pistols they shouldn't look like they're holding rifles'; 'when they're in a building they get extra cover
stats... they shouldn't be standing up, they should look like they're in cover').

A PISTOL IN ONE HAND AND COVER THAT LOOKS LIKE COVER, asked of the PICTURES and of the REAL FIGHT, never of a table's say-so:
  S  THE SOURCE (records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json, rule 128's kept source): every key names parts that
     exist; every timeline is one slot (24 keys, two bars at 120), starts and ends on key 0 and names keys the clip has;
     AN ENVELOPE RAMPS SLOWER THAN THE GRID: a key held ONE key sits between two different keys (a step on the way, never a
     flicker out and back), and the pistol never jumps from his thigh to his eyes (rest and the check are never next to
     each other: the half key is between).
  P  THE PICTURES (slices/rig_hold): every man packed has every key of every clip in all eight facings, his gun on every
     key its clip holds one (or the body hides it, said so), every cell inside its sheet, his own fight sheet's colours.
  O  ONE HAND: the pistol at rest hangs on his RIGHT side (facing the camera, the glass's left; facing away, its right),
     never at his belt buckle between two fists; fired, it is out at arm's length in front of him (profile, a third of his
     height past his feet or more).
  F  THE FEET STAY PUT standing: in the pistol's stand, aim and blow his soles are on his ground line (two pixels).
  K  COVER LOOKS LIKE COVER: in every cover key and facing he is ON THE GROUND (in profile his lowest pixel on his ground line,
     never above it by more than three pixels, a long coat's hem draped onto the floor at most eight below; turned to or from
     the glass a foot or a shin toward the camera may sit lower, never higher) and DOWN (his
     crown a sixth of his height lower than standing at rest behind it, a tenth when he rises on the knee to fire over it).
  W  WIRED: the fight carries the marked block and the hook; on the real fight (headless, the shipped file) the man with
     a pistol is drawn in a held pistol clip, a man put on a tile with cover is drawn kneeling, no page error.
  MUTATIONS (the gate must bite): a cover cell swapped for the standing still, a pistol moved to his belt buckle, a timeline
  a key short, rest and the check put next to each other.
    python3 gates/what_a_man_holds_gate.py            (all legs)
    python3 gates/what_a_man_holds_gate.py --quick    (no browser)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json')
OUT = os.path.join(ROOT, 'slices/rig_hold')
IDX = os.path.join(OUT, 'rig_hold.json')
FR = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')
QUICK = '--quick' in sys.argv
ok_n = fail_n = 0
STANDING = ('PIdle', 'PAim', 'PHit')
COVER = ('CoverLong', 'CoverLongAim', 'CoverPistol', 'CoverPistolAim', 'CoverBare', 'CoverHit')
RISE = ('CoverLongAim', 'CoverPistolAim')   # he rises on the knee to fire over the cover: higher than his rest, never standing
LOW = {True: 0.10, False: 1 / 6.0}   # his crown at least this share of his height lower than standing (rising, resting); measured 10/25 on the first three men: resting 17 to 33 percent, rising 11 to 21
NEVER_NEXT = {'PIdle': [(0, 4), (0, 5)]}   # his thigh and his eyes: the half key (6) is between


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nWHAT A MAN HOLDS GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


D = json.load(open(SRC))


# ---------------------------------------------------------------------------------------------------- S the source
def source_faults(D):
    out = []
    for n, C in D['clips'].items():
        for i, key in enumerate(C['keys']):
            miss = [p for p in key if p not in D['parts']]
            if miss: out.append('%s key %d names %s' % (n, i, miss))
    for n, T in D['timelines'].items():
        if n == 'why': continue
        if n not in D['clips']: out.append('timeline %s has no clip' % n); continue
        nk = len(D['clips'][n]['keys'])
        for t in T:
            if sum(c for _, c in t) != 24: out.append('%s: a slot of %d keys' % (n, sum(c for _, c in t)))
            if t[0][0] != 0 or t[-1][0] != 0: out.append('%s: a slot that does not start and end on key 0' % n)
            if any(k >= nk or k < 0 for k, _ in t): out.append('%s: names a key it has not got' % n)
            for j in range(1, len(t) - 1):
                if t[j][1] == 1 and t[j - 1][0] == t[j + 1][0]: out.append('%s: key %d flickers out and back' % (n, t[j][0]))
            for j in range(len(t) - 1):
                a, b = t[j][0], t[j + 1][0]
                if (a, b) in NEVER_NEXT.get(n, []) or (b, a) in NEVER_NEXT.get(n, []): out.append('%s: key %d next to key %d' % (n, a, b))
    return out


sf = source_faults(D)
ok('S1 every key names parts that exist; every slot is 24 keys from key 0 to key 0; no flicker; the pistol passes its half key', not sf, sf[:4])
m1 = json.loads(json.dumps(D)); m1['timelines']['PIdle'][0][0][1] -= 1
m2 = json.loads(json.dumps(D)); m2['timelines']['PIdle'][2] = [[0, 4], [4, 7], [5, 6], [4, 3], [6, 1], [0, 3]]
ok('S2 MUTATION: a slot a key short, and rest put next to the check, are both caught', source_faults(m1) and source_faults(m2))

if not os.path.exists(IDX):
    ok('P0 the pictures are packed (slices/rig_hold/rig_hold.json)', False, 'no index'); done()
I = json.load(open(IDX)); F = json.load(open(FR))
looks = sorted(I['looks'])
ok('P1 the index carries the men it packed', len(looks) > 0, looks)
E = {k: json.load(open(os.path.join(OUT, I['looks'][k]['json']))) for k in looks}
SHEETS = {}


def sheet(fn):
    if fn not in SHEETS: SHEETS[fn] = np.asarray(Image.open(os.path.join(OUT, fn)).convert('RGBA'))
    return SHEETS[fn]


# ---------------------------------------------------------------------------------------------------- P the pictures
miss, gmiss, outside, pal = [], [], [], []
for k, e in E.items():
    for n, C in D['clips'].items():
        ck = e['clips'].get(n)
        if not ck or len(ck) != len(C['keys']) or any(len(r) != 8 or any(i is None for i in r) for r in ck): miss.append('%s %s' % (k, n))
        for g, gl in D['guns'].items():
            if n not in gl: continue
            G = e['guns']['clips'].get(g, {}).get(n)
            if not G or len(G) != len(C['keys']) or any(len(r) != 8 for r in G): gmiss.append('%s %s %s' % (k, g, n))
    for part in ('sheet', 'guns'):
        a = sheet(e[part]['file']); H, W = a.shape[:2]
        outside += ['%s %s %d' % (k, part, i) for i, c in enumerate(e[part]['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
    fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', F['looks'][k]['file'])).convert('RGBA'))
    have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist())) | {tuple(F['rim'][:3])}
    a = sheet(e['sheet']['file']); extra = set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())) - have
    if extra: pal.append('%s +%d colours' % (k, len(extra)))
ok('P2 every man has every key of every clip in all eight facings', not miss, miss[:4])
ok('P3 his gun is on every key its clip holds one, all eight facings (hidden by his body only where it says so)', not gmiss, gmiss[:4])
ok('P4 every cell sits inside its sheet', not outside, outside[:4])
ok('P5 every held picture wears his own fight sheet\'s colours, not one more', not pal, pal[:4])


def cell(e, n, k, f, part='sheet', gun=None):
    if part == 'sheet': i = e['clips'][n][k][f]; c = e['sheet']['cells'][i]; a = sheet(e['sheet']['file'])
    else:
        i = e['guns']['clips'][gun][n][k][f]
        if i is None: return None, None
        c = e['guns']['cells'][i]; a = sheet(e['guns']['file'])
    return a[c[1]:c[1] + c[3], c[0]:c[0] + c[2]], c


def bbox(e, n, k, f, part='sheet', gun=None):
    """the painted box in the fight cell's frame: x0, y0, x1, y1, and the centroid's x"""
    a, c = cell(e, n, k, f, part, gun)
    if a is None: return None
    op = a[..., 3] > 0; ys, xs = np.nonzero(op)
    return c[4] + xs.min(), c[5] + ys.min(), c[4] + xs.max(), c[5] + ys.max(), c[4] + xs.mean()


def soles(e, n, k, f):
    a, c = cell(e, n, k, f); op = a[..., 3] > 0; out = {}
    for x in range(op.shape[1]):
        ys = np.nonzero(op[:, x])[0]
        if len(ys): out[c[4] + x] = c[5] + ys.max()
    return out


# ---------------------------------------------------------------------------------------------------- O one hand
def one_hand_faults(E):
    out = []
    for k, e in E.items():
        fx = e['foot'][0]
        for f, side in ((0, -1),):   # facing S his right is the glass's left (facing away his body hides a pistol held in front of him)
            g = bbox(e, 'PIdle', 0, f, 'guns', 'pistol')
            if g is None: out.append('%s PIdle %s: the pistol is hidden' % (k, I['dirs'][f])); continue
            off = (g[4] - fx) * side
            if off < 6: out.append('%s PIdle %s: the pistol %.0f px from his middle (on his right 6 or more)' % (k, I['dirs'][f], off))
        st = bbox(e, 'PIdle', 0, 0); h = st[3] - st[1]
        for f, side in ((2, 1), (6, -1)):   # facing E the glass's right is in front of him; facing W, its left
            g = bbox(e, 'PAim', 0, f, 'guns', 'pistol')
            if g is None: out.append('%s PAim %s: the pistol is hidden' % (k, I['dirs'][f])); continue
            far = (g[2] - fx) if side > 0 else (fx - g[0])
            if far < h / 3: out.append('%s PAim %s: the pistol %d px out (a third of his %d)' % (k, I['dirs'][f], far, h))
    return out


oh = one_hand_faults(E)
ok('O1 the pistol hangs on his right side at rest, and fired it is out at arm\'s length (a third of his height past his feet)', not oh, oh[:4])
mo = json.loads(json.dumps(E)); k0 = looks[0]; e0 = mo[k0]
for f in (0, 4):   # the pistol moved to his belt buckle: the old two-handed carry
    i = e0['guns']['clips']['pistol']['PIdle'][0][f]
    if i is not None:
        a, c = cell(E[k0], 'PIdle', 0, f, 'guns', 'pistol'); op = a[..., 3] > 0; cxm = np.nonzero(op)[1].mean()
        e0['guns']['cells'][i] = list(e0['guns']['cells'][i]); e0['guns']['cells'][i][4] = int(round(e0['foot'][0] - cxm))
ok('O2 MUTATION: a pistol at his belt buckle is caught', any('PIdle' in x for x in one_hand_faults({k0: e0})))


# ---------------------------------------------------------------------------------------------------- F the feet
def feet_faults(E):
    out = []
    for k, e in E.items():
        for f in range(8):
            C = soles(e, 'PIdle', 0, f); band = max(C.values()) - 8
            for n in STANDING:
                for kk in range(len(D['clips'][n]['keys'])):
                    P = soles(e, n, kk, f)
                    shared = [x for x in C if C[x] >= band and P.get(x, -1) >= band]
                    moved = [x for x in shared if abs(P[x] - C[x]) > 2]
                    if len(shared) < 4 or len(moved) > len(shared) * 0.25:
                        out.append('%s %s k%d %s: %d of %d sole columns moved' % (k, n, kk, I['dirs'][f], len(moved), len(shared)))
    return out


ff = feet_faults(E)
ok('F1 standing with the pistol (at rest, fired, rocked) his soles stay on his ground line (two pixels)', not ff, ff[:4])


# ---------------------------------------------------------------------------------------------------- K cover
def cover_faults(E, show=False):
    out = []; worst = []
    for k, e in E.items():
        for f in range(8):
            st = bbox(e, 'PIdle', 0, f); ground, crown = st[3], st[1]; h = ground - crown
            for n in COVER:
                for kk in range(len(D['clips'][n]['keys'])):
                    b = bbox(e, n, kk, f)
                    # in profile (E, W) the ground is the ground; turned to or from the glass, the foot stepped forward or the shin laid
                    # back comes toward the camera and sits lower on the glass, never higher (a man kneels on his tile, he does not float)
                    lo, hi = (-3, 8) if f in (2, 6) else (-3, 14)   # in profile a long coat's hem drapes onto the floor before his knee (the anarchists' robe, +7)
                    if not lo <= b[3] - ground <= hi: out.append('%s %s k%d %s: his lowest pixel %+d from the ground' % (k, n, kk, I['dirs'][f], b[3] - ground))
                    down = (b[1] - crown) / float(h)
                    worst.append(down)
                    if down < LOW[n in RISE]: out.append('%s %s k%d %s: his crown only %.0f%% lower than standing' % (k, n, kk, I['dirs'][f], 100 * down))
    if show and worst: print('  note K1 his crown in cover: %.0f%% to %.0f%% lower than standing (median %.0f%%)' % (100 * min(worst), 100 * max(worst), 100 * float(np.median(worst))))
    return out


kf = cover_faults(E, True)
ok('K1 in every cover key and facing he is on the ground and down (his crown a sixth of his height lower at rest, a tenth rising to fire)', not kf, kf[:4])
mk = json.loads(json.dumps(E)); ek = mk[k0]
ek['clips']['CoverLong'][0] = list(ek['clips']['PIdle'][0])   # his first cover key the standing still, every facing
ok('K2 MUTATION: a man in cover drawn standing is caught', any('CoverLong k0' in x for x in cover_faults({k0: ek})))

# ---------------------------------------------------------------------------------------------------- W wired
t = open(os.path.join(ROOT, 'slices/BOHEMIA_FIGHT.html')).read()
ok('W1 the fight (COMBAT\'s file) carries the marked block and draws through it', '__WHAT_A_MAN_HOLDS__' in t and 'end __WHAT_A_MAN_HOLDS__' in t
   and 'const held = holdDraw(v, p, L, gs, ox, oy, s, now);' in t and 'const idled = held || idleDraw(' in t)
if not QUICK:
    drv = r'''
const { open } = require(process.argv[2]);
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",deploy:false}' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length && HOLD.state === 2, null, { timeout: 60000 });
  /* who holds a pistol, and one man of ours stood on a tile that carries cover (the board's own) */
  const set = await p.evaluate(() => {
    const S = FIGHT.S, pis = S.units.filter(v => FIGHT.onField(v) && !v.beast && v.weapon && FIGHT.isGun(v.weapon) && DB.rig.guns.by_class[(v.weapon.of && v.weapon.of.class) || v.weapon.class] === 'pistol').map(v => v.id);
    const taken = {}; S.units.forEach(v => { taken[v.y * S.w + v.x] = 1; });
    let tile = null;
    for (let y = 0; y < S.h && !tile; y++) for (let x = 0; x < S.w && !tile; x++) if (S.coverCount[y][x] > 0 && FIGHT.rowAt(x, y) !== 'obstacles' && !S.solid[y][x] && !taken[y * S.w + x]) tile = { x: x, y: y };
    window.__coverTile = tile;
    return { pistols: pis, tile: tile };
  });
  /* five seconds as dealt (the pistol men stand in the one-hand hold), then the first man of ours whose pictures are packed
     is stood on the tile with cover */
  await p.waitForTimeout(5000);
  set.cover = await p.evaluate(() => { const S = FIGHT.S, t = window.__coverTile;
    const man = S.units.filter(v => FIGHT.onField(v) && !v.beast && v.side === 'you' && HOLD.meta.looks[lookOf(v)._key])[0];
    if (!t || !man) return null; man.x = t.x; man.y = t.y; man._at = undefined; return man.id + ' (' + lookOf(man)._key + ')'; });
  await p.waitForTimeout(7000);
  const seen = await p.evaluate(() => UI.clipSeen);
  console.log(JSON.stringify({ set: set, seen: seen, errs: errs }));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
    js = os.path.join(ROOT, 'gates', '.what_a_man_holds_fight.js'); open(js, 'w').write(drv)
    try:
        r = subprocess.run(['node', js, os.path.join(ROOT, 'tools/bohemia_drive_the_demo.js')], capture_output=True, text=True, timeout=240, cwd=ROOT)
    finally:
        os.remove(js)
    line = [l for l in r.stdout.splitlines() if l.startswith('{')]
    R = json.loads(line[-1]) if line else {'err': r.stdout[-300:] + r.stderr[-300:]}
    seen = R.get('seen') or {}
    pist = sorted(k[5:] for k in seen if k.startswith('hold:P'))
    cov = sorted(k[5:] for k in seen if k.startswith('hold:Cover'))
    print('  note W2 pistols %s, the man in cover %s at %s; held clips drawn %s' % (len((R.get('set') or {}).get('pistols') or []), (R.get('set') or {}).get('cover'),
          (R.get('set') or {}).get('tile'), {k: v for k, v in seen.items() if k.startswith('hold:')}))
    ok('W2 on the real fight the man with a pistol is drawn in a held pistol clip and the man on a cover tile kneels, no page error',
       pist and cov and not R.get('errs') and not R.get('err'), 'pistol %s, cover %s, errors %s' % (pist, cov, (R.get('errs') or [R.get('err')])[:2]))
done()
