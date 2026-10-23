#!/usr/bin/env python3
"""EVERYBODY IDLES (ANIMATION [everybody idles], rule 130(a), Paolo 10/23, LOCKED: 'we need a lot of idle animations; right
now everyone's standing still, making my brain fry; it's looking like a chess man and I don't want that vibe at all').

NOBODY STANDS LIKE A CHESS PIECE, asked of the PICTURES and of the PLAYER, never of a table's say-so (a table can name
twenty poses that are one picture):
  S  THE SOURCE (records/target/animation/BOHEMIA_EVERYBODY_IDLES.json, rule 128's kept source): every timeline is one slot
     (24 keys, two bars at 120); every pose it names is in its set; a slot ends standing square, so any follows any;
     AN ENVELOPE RAMPS SLOWER THAN THE GRID: a pose held ONE key sits between two different poses (a step on the way,
     never a flicker out and back), and the opposite sides of a turn are never next to each other.
  P  THE PICTURES (slices/rig_idles, a sheet per set): every man the fight dresses has every bare and gun-held pose in all eight facings,
     every beast the fight brings its own, every man's three guns on every gun-held pose; every cell inside its sheet.
  C  NOT A CHESS PIECE, in the pixels: breathing in is not breathing out (his shoulders and head rise at least a pixel);
     every idle pose differs from standing square; the colours are his own fight sheet's (a man who stops walking keeps
     every colour he walked in).
  F  THE FEET STAY PUT: in every man's every pose and facing his soles are on his stand's ground line (two pixels).
  M  THE MAP: every map look it carries matched the picture the map already draws (silhouette and colour).
  X  THE PLAYER (engine/bohemia_idles.js under node, the shipped file): twelve people over a minute never hold one
     picture four seconds, change at least ten times, no two in step (any two share under half their keys), the slot he
     began to stand in is a breath, every idle of every set is played by somebody in ten minutes.
  W  WIRED: the fight, the crew card, the settlement and the map each load the player and carry the marked block; on
     the real fight (headless) standing men play at least three kinds of idle in twelve seconds with no page error.
  MUTATIONS (the gate must bite): a sheet where every pose is the stand still, a timeline a key short, two opposite
     sides of a turn put next to each other, a player that hands everybody the same offset.
    python3 gates/everybody_idles_gate.py            (all legs)
    python3 gates/everybody_idles_gate.py --quick    (no browser)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_EVERYBODY_IDLES.json')
IDX = os.path.join(ROOT, 'slices/rig_idles/rig_idles.json')
FR = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')
QUICK = '--quick' in sys.argv
ok_n = fail_n = 0


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nEVERYBODY IDLES GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


# ---------------------------------------------------------------------------------------------------- S the source
def source_faults(D):
    out = []
    T = {k: v for k, v in D['timelines'].items() if k != 'why'}
    pairs = [set(p) for p in D.get('never_adjacent', {}).get('pairs', [])]
    used = {}
    for s, kinds in D['idles'].items():
        for k in kinds + [b for side in D['breathe'][s] for b in side]: used.setdefault(k, set()).add(s)
    for k, tl in T.items():
        n = sum(h for _, h in tl)
        if n != 24: out.append('%s is %d keys, not one slot of 24' % (k, n))
        if tl[-1][0] != 'C': out.append('%s does not end standing square' % k)
        for s in used.get(k, ()):
            miss = [p for p, _ in tl if p not in D['sets'][s]['poses']]
            if miss: out.append('%s names %s, not in the %s set' % (k, miss, s))
        for i, (p, h) in enumerate(tl):
            if h == 1 and 0 < i < len(tl) - 1 and tl[i - 1][0] == tl[i + 1][0]:
                out.append('%s flickers %s for one key between two %s' % (k, p, tl[i - 1][0]))
        for (a, _), (b, _) in zip(tl, tl[1:]):
            if {a, b} in pairs: out.append('%s goes %s to %s in one key' % (k, a, b))
    return out


D = json.load(open(SRC)) if os.path.exists(SRC) else None
ok('S0 the kept source is in the repo (rule 128)', D is not None, SRC)
if D is None: done()
f = source_faults(D)
ok('S1 every timeline is one slot, names poses of its set, ends square, never flickers or jumps side to side', not f, '; '.join(f[:4]))
ok('S2 a man has his own idles bare and with the gun, and the beasts theirs (look, roll, scratch, stretch, smoke, lean, strap; check, grip; sniff, pant, shake)',
   set(D['idles']['bare']) >= {'look', 'roll', 'scratch', 'stretch', 'smoke', 'lean', 'strap'} and set(D['idles']['carry']) >= {'look', 'roll', 'check', 'grip'}
   and set(D['idles']['beast']) >= {'sniff', 'pant', 'shake'}, D['idles'])
# mutation: a key short, and two opposite sides next to each other
m1 = json.loads(json.dumps(D)); m1['timelines']['look'][1][1] -= 1
m2 = json.loads(json.dumps(D)); m2['timelines']['look'] = [['lookL', 8], ['lookR', 8], ['C', 8]]
ok('S3 MUTATION: a timeline a key short is caught', any('look is 23' in x for x in source_faults(m1)))
ok('S4 MUTATION: left to right in one key is caught', any('lookL to lookR' in x for x in source_faults(m2)))

# ---------------------------------------------------------------------------------------------------- P the pictures
I = json.load(open(IDX)) if os.path.exists(IDX) else None
ok('P0 the pictures are in (slices/rig_idles/rig_idles.json)', I is not None)
if I is None: done()
F = json.load(open(FR))
men = [k for k, v in F['looks'].items() if v.get('kind') != 'beast']
beasts = [k for k, v in F['looks'].items() if v.get('kind') == 'beast']
miss = [k for k in men + beasts if k not in I['looks']]
ok('P1 every man and every beast the fight dresses has his idles (%d men, %d beasts)' % (len(men), len(beasts)), not miss, 'missing: ' + ', '.join(miss))
holes = []
for k, L in I['looks'].items():
    sets = ('beast',) if F['looks'].get(k, {}).get('kind') == 'beast' else ('bare', 'carry')
    for s in sets:
        for p in D['sets'][s]['poses']:
            col = L['poses'].get(s, {}).get(p)
            if not col or len(col) != 8 or any(c is None for c in col): holes.append('%s %s %s' % (k, s, p))
    if 'carry' in sets:
        G = L.get('guns')
        if not G: holes.append('%s has no guns' % k); continue
        for g in I['guns']:
            for p in D['sets']['carry']['poses']:
                col = G['poses'].get(g, {}).get(p)
                if not col or len(col) != 8: holes.append('%s %s %s' % (k, g, p))
ok('P2 every pose in all eight facings, and his three guns on every gun-held pose', not holes, '; '.join(holes[:5]))
SHEETS = {}
def sheet(fn):
    if fn not in SHEETS: SHEETS[fn] = np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_idles', fn)).convert('RGBA'))
    return SHEETS[fn]
out_of = []
for k, L in I['looks'].items():
    for s_, Sh in L['sheets'].items():
        a = sheet(Sh['file']); H, W = a.shape[:2]
        out_of += ['%s %s cell %d' % (k, s_, i) for i, c in enumerate(Sh['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
ok('P3 every cell sits inside its sheet', not out_of, out_of[:4])


# ---------------------------------------------------------------------------------------------------- C not a chess piece
def cell(L, s, p, f):
    Sh = L['sheets'][s]; c = Sh['cells'][L['poses'][s][p][f]]; a = sheet(Sh['file'])[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    return a, c


def placed(L, s, p, f, size=(260, 260)):
    a, c = cell(L, s, p, f); z = np.zeros(size + (4,), np.uint8); ox, oy = 60 + c[4], 40 + c[5]
    z[oy:oy + c[3], ox:ox + c[2]] = a; return z


def top(L, s, p, f):
    a, c = cell(L, s, p, f); ys = np.nonzero(a[..., 3] > 0)[0]; return c[5] + ys.min()


def chess_faults(I, looks):
    out = []
    for k in looks:
        L = I['looks'][k]
        if 'bare' not in L['poses']: continue
        for s in ('bare', 'carry'):
            rise = top(L, s, 'R_out', 0) - top(L, s, 'R_in', 0)
            if rise < 1: out.append('%s %s: breathing in lifts him %d px' % (k, s, rise))
            C = placed(L, s, 'C', 0)
            for p in D['sets'][s]['poses']:
                if p == 'C': continue
                n = int((np.abs(placed(L, s, p, 0).astype(int) - C.astype(int)).max(2) > 0).sum())
                if n < 12: out.append('%s %s %s is %d px from standing square' % (k, s, p, n))
    return out


cf = chess_faults(I, list(I['looks']))
ok('C1 breathing in lifts every man (shoulders and head, a pixel or more) and every idle pose is its own picture', not cf, '; '.join(cf[:4]))
# mutation: every pose the stand cell
mut = json.loads(json.dumps(I)); k0 = men[0] if men and men[0] in mut['looks'] else list(mut['looks'])[0]
for s in ('bare', 'carry'):
    if s in mut['looks'][k0]['poses']:
        for p in mut['looks'][k0]['poses'][s]: mut['looks'][k0]['poses'][s][p] = list(mut['looks'][k0]['poses'][s]['C'])
ok('C2 MUTATION: a man whose every idle is his still is caught', len(chess_faults(mut, [k0])) > 5)
pal_bad = []
for k, L in I['looks'].items():
    fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', F['looks'][k]['file'])).convert('RGBA'))
    have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist()))
    mine = set()
    for Sh in L['sheets'].values(): a = sheet(Sh['file']); mine |= set(map(tuple, a[a[..., 3] > 0][:, :3].tolist()))
    extra = mine - have
    if extra: pal_bad.append('%s +%d colours' % (k, len(extra)))
ok('C3 every idle wears his own fight sheet\'s colours, not one more', not pal_bad, pal_bad[:4])

# ---------------------------------------------------------------------------------------------------- F the feet
feet_bad = []
for k in men:
    if k not in I['looks']: continue
    L = I['looks'][k]
    for f in range(8):
        a, c = cell(L, 'bare', 'C', f); base = c[5] + np.nonzero(a[..., 3] > 0)[0].max()
        for s in ('bare', 'carry'):
            for p in D['sets'][s]['poses']:
                a, c = cell(L, s, p, f); low = c[5] + np.nonzero(a[..., 3] > 0)[0].max()
                if abs(low - base) > 2: feet_bad.append('%s %s %s %s %+d' % (k, s, p, I['dirs'][f], low - base))
ok('F1 his soles stay on his ground line in every pose and facing (two pixels): nobody floats, sinks or skates', not feet_bad, '; '.join(feet_bad[:5]))

# ---------------------------------------------------------------------------------------------------- M the map
Mp = I.get('map')
ok('M1 the map carries idles for its own models', bool(Mp and Mp['looks']), 'no map block')
if Mp:
    bad = [k for k, v in Mp['looks'].items() if v['match'][0] < 0.9 or v['match'][1] > 28]
    ok('M2 every map look matched the picture the map already draws (silhouette 0.9, colour step 28)', not bad, bad)

# ---------------------------------------------------------------------------------------------------- X the player
PLAYER = r'''
const fs = require('fs'); const M = JSON.parse(fs.readFileSync(process.argv[2]));
global.window = { BOHEMIA_IDLES_BASE: 'x/' }; global.fetch = () => Promise.resolve({ ok: true, json: () => M });
const B = require(process.argv[3]); const same = process.argv[4] === 'same';
if (same) { const h = B.hash; }
B.load(function () {
  const out = { people: [], kinds: {} }, keyMs = 500 / 3, seeds = [];
  for (let i = 0; i < 12; i++) seeds.push(same ? 'one' : 'fight:p' + i);
  seeds.forEach(function (sd, i) {
    const seq = []; let held = 0, maxHeld = 0, changes = 0, last = null;
    for (let t = 0; t < 60000; t += keyMs) { const a = B.at(sd, t + 1, { set: i % 2 ? 'carry' : 'bare' }); seq.push(a.pose);
      if (a.pose === last) { held += keyMs; } else { changes++; held = keyMs; } maxHeld = Math.max(maxHeld, held); last = a.pose; }
    const st = B.at(sd, 5000, { set: 'bare', since: 5000 });
    out.people.push({ seq: seq, maxHeld: maxHeld, changes: changes, sinceKind: st.kind });
  });
  ['bare', 'carry', 'beast', 'map'].forEach(function (s) { out.kinds[s] = {};
    for (let i = 0; i < 40; i++) for (let t = 0; t < 600000; t += 4000) { const a = B.at('k' + i, t, { set: s }); out.kinds[s][a.kind] = 1; } });
  console.log(JSON.stringify(out));
});
'''


def player(same=False):
    js = os.path.join(ROOT, 'gates', '.everybody_idles_player.js')
    open(js, 'w').write(PLAYER)
    try:
        r = subprocess.run(['node', js, IDX, os.path.join(ROOT, 'engine/bohemia_idles.js'), 'same' if same else ''], capture_output=True, text=True, timeout=120)
    finally:
        os.remove(js)
    return json.loads(r.stdout.strip().splitlines()[-1]) if r.stdout.strip() else None


def player_faults(X):
    out = []
    for i, p in enumerate(X['people']):
        if p['maxHeld'] > 4000: out.append('person %d holds one picture %.1f s' % (i, p['maxHeld'] / 1000))
        if p['changes'] < 10: out.append('person %d changes %d times a minute' % (i, p['changes']))
        if not p['sinceKind'].startswith('breathe'): out.append('person %d starts standing in %s' % (i, p['sinceKind']))
    P = X['people']
    for i in range(len(P)):
        for j in range(i + 1, len(P)):
            if i % 2 != j % 2: continue   # bare and carry never share a pose name's picture
            share = sum(1 for a, b in zip(P[i]['seq'], P[j]['seq']) if a == b) / len(P[i]['seq'])
            if share >= 0.5: out.append('people %d and %d share %d%% of their keys' % (i, j, share * 100))
    return out


X = player()
ok('X0 the shipped player runs under node', X is not None)
if X:
    pf = player_faults(X)
    ok('X1 twelve people over a minute: never one picture four seconds, ten changes or more, no two in step, the first slot a breath', not pf, '; '.join(pf[:4]))
    want = {s: set(D['idles'][s]) | set(b for side in D['breathe'][s] for b in side) for s in ('bare', 'carry', 'beast', 'map')}
    lack = {s: sorted(want[s] - set(X['kinds'][s])) for s in want if want[s] - set(X['kinds'][s])}
    ok('X2 every idle of every set is played by somebody in ten minutes', not lack, lack)
    XS = player(same=True)
    ok('X3 MUTATION: twelve people with one seed are caught moving in step', XS is not None and any('share' in x for x in player_faults(XS)))

# ---------------------------------------------------------------------------------------------------- W wired
WIRE = {'slices/BOHEMIA_FIGHT.html': 'COMBAT', 'slices/BOHEMIA_ROSTER_SCREEN.html': 'RUN TWO', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html': 'RUN TWO',
        'slices/BOHEMIA_CITY_WORLD.html': 'RUN'}
for fn, lane in WIRE.items():
    t = open(os.path.join(ROOT, fn)).read()
    ok('W1 %s (%s\'s file) loads the player and carries the marked block' % (os.path.basename(fn), lane),
       'engine/bohemia_idles.js' in t and '__EVERYBODY_IDLES__' in t and 'end __EVERYBODY_IDLES__' in t)
if not QUICK:
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    drv = r'''
const { open } = require(process.argv[2]);
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",deploy:false}' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && window.BohemiaIdles, null, { timeout: 60000 });
  await p.waitForTimeout(12000);
  const seen = await p.evaluate(() => UI.clipSeen);
  console.log(JSON.stringify({ seen: seen, errs: errs }));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
    js = os.path.join(ROOT, 'gates', '.everybody_idles_fight.js'); open(js, 'w').write(drv)
    try:
        r = subprocess.run(['node', js, os.path.join(ROOT, 'tools/bohemia_drive_the_demo.js')], capture_output=True, text=True, timeout=240, cwd=ROOT)
    finally:
        os.remove(js)
    line = [l for l in r.stdout.splitlines() if l.startswith('{')]
    R = json.loads(line[-1]) if line else {'err': r.stdout[-300:] + r.stderr[-300:]}
    kinds = sorted(k[5:] for k in (R.get('seen') or {}) if k.startswith('idle:'))
    ok('W2 on the real fight, standing men play three kinds of idle or more in twelve seconds, no page error', len(kinds) >= 3 and not R.get('errs') and not R.get('err'),
       'kinds %s, errors %s' % (kinds, (R.get('errs') or [R.get('err')])[:2]))
done()
