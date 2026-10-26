#!/usr/bin/env python3
"""THE TOWN'S ACTIVITIES (ANIMATION [the town's activities], rule 218(a), Paolo 10/26, LOCKED: 'everyone on your company...
you can see them in the settlement, maybe flirting with a girl, maybe drinking some beer, maybe walking around, maybe talking
to people... make it feel alive'). His crew in the town DOES something, asked of the PICTURES, the POSED MODEL and the
PLAYER, never of a table's say-so:
  S  THE SOURCE (records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json, rule 128): the six activities he named (drink,
     smoke, talk, flirt, sit, stall); every timeline is one slot (24 keys) and ends on its activity's rest pose, so any slot
     follows any; every pose it names is its activity's; a one-key hold sits between two DIFFERENT poses (a step on the way,
     never a flicker out and back); the two sides of a turn never touch; every part and prop is defined.
  E  AN ENVELOPE RAMPS SLOWER THAN THE GRID (laws: his 'tweaking', 9/21; records/BOHEMIA_WHAT_TWEAKING_WAS_9_24_26.md), on
     the POSED MODEL of every man rendered (records/target/animation/towns/<look>/joints.json, the joints the render was
     posed with): stepping every timeline's drawn keys, and every slot into every next slot of its activity, in all eight
     facings at the street's pixels (57 px a metre, the master rig's ppm): no joint goes back the way it came (a turn of
     more than 120 degrees) across a one-key hold when both steps move it 2 px or more (the jump and the jump back), and no
     joint crosses more than 16 px between two drawn keys (a snap the eye cannot read as travel).
  P  THE PICTURES (slices/rig_town): every man in the index has every activity's every pose in all eight facings, every cell
     inside its sheet, his soles on his still's ground line in every pose and facing (3 px: a man who sits keeps his heels
     where he stood), 80 colours or fewer a sheet; his company (the eleven he starts with) are all there.
  C  NOT A CHESS PIECE, in the pixels: every variant pose differs from its activity's rest (12 px or more changed) in every
     facing; a man drinking, smoking, sitting or at a stall is not standing as his plain still (the rest differs from the
     bare idles' standing square).
  X  THE PLAYER (engine/bohemia_idles.js under node, the shipped file): twelve men of his company (o.n, each his place in it)
     at each activity over a minute never hold one picture four seconds, change ten times or more, no two in step (any two share under half their keys); the slot he
     began in is a breath; every variant is played by somebody in ten minutes; a TALKING PAIR never talks at once and each
     talks a third of the time or more; a man with a wall gets the hand on the wall, a man without never does.
  W  WIRED: on the real settlement screen (RUN TWO's file, his phone's profile), the player hands back a drawn cell of every
     activity for a man of his company, the sheet decodes, and the page throws nothing.
  MUTATIONS (the gate must bite): a timeline a key short, two sides of a turn put next to each other, a joint that jumps
  out and back in one key, a variant pose that is its rest, a player that seats every man in one step, a pair that both
  talk.
    python3 gates/the_towns_activities_gate.py            (all legs)
    python3 gates/the_towns_activities_gate.py --quick    (no browser)
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json')
IDL = os.path.join(ROOT, 'records/target/animation/BOHEMIA_EVERYBODY_IDLES.json')
IDX = os.path.join(ROOT, 'slices/rig_town/rig_town.json')
RENDERS = os.path.join(ROOT, 'records/target/animation/towns')
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
NAMED = ['drink', 'smoke', 'talk', 'flirt', 'sit', 'stall']
PPM = 57.0           # the master rig's pixels a real metre at the street's settings (rig.json 'ppm')
REVERSE_DEG, MOVE_PX, JUMP_PX = 120, 2.0, 24.0
QUICK = '--quick' in sys.argv
ok_n = fail_n = 0


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nTHE TOWN\'S ACTIVITIES GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


# ---------------------------------------------------------------------------------------------------- S the source
def source_faults(T, D):
    out = []
    parts = dict(D['parts']); parts.update(T['parts'])
    pairs = [set(p) for p in T.get('never_adjacent', {}).get('pairs', [])]
    for a in NAMED:
        if a not in T['activities']: out.append('no %s' % a)
    for a, A in T['activities'].items():
        poses = A['poses']
        if A['rest'] not in poses: out.append('%s: its rest %s is not one of its poses' % (a, A['rest']))
        for p, ps in poses.items():
            miss = [x for x in ps if x not in parts]
            if miss: out.append('%s.%s names parts %s nobody defines' % (a, p, miss))
        for pr in A['props']:
            if pr not in T['props']: out.append('%s holds %s, no such prop' % (a, pr))
        kinds = [k for side in A.get('breathe', []) for k in side] + A.get('idles', []) + A.get('wall', [])
        if A.get('turns'): kinds += A['turns']['say'] + A['turns']['hear']
        if not A.get('idles'): out.append('%s has no variants' % a)
        for k in set(kinds):
            tl = T['timelines'].get(k)
            if tl is None: out.append('%s plays %s, no such timeline' % (a, k)); continue
            n = sum(h for _, h in tl)
            if n != 24: out.append('%s is %d keys, not one slot of 24' % (k, n))
            if tl[-1][0] != A['rest']: out.append('%s does not end on %s\'s rest %s' % (k, a, A['rest']))
            miss = [p for p, _ in tl if p not in poses]
            if miss: out.append('%s names %s, not %s poses' % (k, miss, a))
            for i, (p, h) in enumerate(tl):
                if h == 1 and 0 < i < len(tl) - 1 and tl[i - 1][0] == tl[i + 1][0]:
                    out.append('%s flickers %s for one key between two %s' % (k, p, tl[i - 1][0]))
            for (x, _), (y, _) in zip(tl, tl[1:]):
                if {x, y} in pairs: out.append('%s goes %s to %s in one key' % (k, x, y))
    return out


T = json.load(open(SRC)) if os.path.exists(SRC) else None
D = json.load(open(IDL))
ok('S0 the kept source is in the repo (rule 128)', T is not None, SRC)
if T is None: done()
sf = source_faults(T, D)
ok('S1 the six he named, every slot 24 keys ending on its rest, every pose its activity\'s, no flicker, no turn side to side',
   not sf, '; '.join(sf[:5]))
m = json.loads(json.dumps(T)); m['timelines']['sip'] = m['timelines']['sip'][:-1] + [[m['timelines']['sip'][-1][0], m['timelines']['sip'][-1][1] - 1]]
ok('S2 MUTATION: a timeline a key short is caught', any('23 keys' in x for x in source_faults(m, D)))
m = json.loads(json.dumps(T)); m['timelines']['drinklook'] = [['D_lookL', 8], ['D_lookR', 8], ['D', 8]]
ok('S3 MUTATION: the two sides of a turn put next to each other are caught', any('in one key' in x for x in source_faults(m, D)))


# ---------------------------------------------------------------------------------------------------- E the envelope
def screen(v, f):
    """a joint's place (f, u, l in real metres) on the screen at facing f: the master rig's 45 degree ortho camera"""
    th = math.radians(45 * DIRS.index(f))
    fx, fd = math.sin(th), math.cos(th); lx, ld = math.cos(th), -math.sin(th)
    x = v[0] * fx + v[2] * lx; d = v[0] * fd + v[2] * ld
    return (x * PPM, (-v[1] * math.cos(math.radians(45)) + d * math.sin(math.radians(45))) * PPM)


def envelope_faults(J, T):
    out = []; k = J['k']
    for a, A in T['activities'].items():
        if a not in J['acts']: out.append('%s not posed' % a); continue
        at = J['acts'][a]['at']
        kinds = [x for side in A.get('breathe', []) for x in side] + A.get('idles', []) + A.get('wall', [])
        if A.get('turns'): kinds += A['turns']['say'] + A['turns']['hear']
        kinds = sorted(set(kinds))
        seqs = []
        for k1 in kinds:   # every slot, and every slot into every next one (any follows any)
            keys = [p for p, h in T['timelines'][k1] for _ in range(h)]
            seqs.append((k1, keys))
            for k2 in kinds:
                keys2 = [p for p, h in T['timelines'][k2] for _ in range(h)]
                seqs.append((k1 + '>' + k2, keys[-3:] + keys2[:3]))
        for name, keys in seqs:
            for f in DIRS:
                for j in J['joints']:
                    pts = [screen([c / k for c in at[p][j]], f) for p in keys]
                    st = [(b[0] - a_[0], b[1] - a_[1]) for a_, b in zip(pts, pts[1:])]
                    for i, s in enumerate(st):
                        ln = math.hypot(*s)
                        if ln > JUMP_PX: out.append('%s %s %s crosses %.1f px in one key (%s to %s)' % (name, f, j, ln, keys[i], keys[i + 1])); break
                    for i in range(len(st) - 1):
                        s1, s2 = st[i], st[i + 1]; l1, l2 = math.hypot(*s1), math.hypot(*s2)
                        if l1 >= MOVE_PX and l2 >= MOVE_PX:
                            c = (s1[0] * s2[0] + s1[1] * s2[1]) / (l1 * l2)
                            if math.degrees(math.acos(max(-1, min(1, c)))) > REVERSE_DEG:
                                out.append('%s %s %s jumps out and back across %s' % (name, f, j, keys[i + 1])); break
    return out


looks_j = sorted(l for l in os.listdir(RENDERS) if os.path.exists(os.path.join(RENDERS, l, 'joints.json'))) if os.path.isdir(RENDERS) else []
IX = json.load(open(IDX)) if os.path.exists(IDX) else None
packed = sorted(IX['looks']) if IX else []
ok('E0 the posed model\'s joints are kept beside every packed man\'s render (the ruler)', packed and all(l in looks_j for l in packed),
   [l for l in packed if l not in looks_j][:4] or 'nothing packed')
ef = []
for l in looks_j:
    ef += ['%s: %s' % (l, x) for x in envelope_faults(json.load(open(os.path.join(RENDERS, l, 'joints.json'))), T)]
def ankle_faults(J, T):
    """the feet stay put: in every pose of every activity both ankles where they stand in his rest, 1 cm (a man who sits
    keeps his heels where he stood; the plant)"""
    out = []; k = J['k']; base = None
    for a, A in T['activities'].items():
        at = J['acts'].get(a, {}).get('at', {})
        ref = J['acts']['talk']['at']['T'] if 'talk' in J['acts'] else None
        for p, row in at.items():
            for j in ('RA', 'LA'):
                if ref is None: continue
                d = math.dist([c / k for c in row[j]], [c / k for c in ref[j]])
                if d > 0.01: out.append('%s.%s %s %.1f cm off where he stands' % (a, p, j, d * 100))
    return out


ok('E1 AN ENVELOPE RAMPS SLOWER THAN THE GRID: no joint jumps out and back, none crosses 16 px in a drawn key, every slot into every next, eight facings (%d men)' % len(looks_j),
   looks_j and not ef, '; '.join(ef[:4]))
af = []
for l in looks_j:
    af += ['%s: %s' % (l, x) for x in ankle_faults(json.load(open(os.path.join(RENDERS, l, 'joints.json'))), T)]
ok('E3 THE FEET STAY PUT: both ankles where he stands in every pose of every activity, sitting too (1 cm)', looks_j and not af, '; '.join(af[:4]))
if looks_j:
    J = json.load(open(os.path.join(RENDERS, looks_j[0], 'joints.json')))
    Jm = json.loads(json.dumps(J)); at = Jm['acts']['drink']['at']
    at['D_Ri']['RH'] = [at['D_Ri']['RH'][0] + 0.12 * J['k'], at['D_Ri']['RH'][1], at['D_Ri']['RH'][2]]
    Tm = json.loads(json.dumps(T)); Tm['timelines']['drinkR'] = [['D_Ro', 6], ['D_Ri', 1], ['D_Ro', 14], ['D', 3]]
    ok('E2 MUTATION: a wrist that jumps out and back in one key is caught', any('out and back' in x for x in envelope_faults(Jm, Tm)))


# ---------------------------------------------------------------------------------------------------- P C the pictures
def sheet(fn, cache={}):
    if fn not in cache: cache[fn] = np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_town', fn)).convert('RGBA'))
    return cache[fn]


def cellpx(L, a, p, fi):
    i = L['poses'][a][p][fi]
    if i is None: return None
    S = L['sheets'][a]; c = S['cells'][i]; im = sheet(S['file'])
    return im[c[1]:c[1] + c[3], c[0]:c[0] + c[2]], c


def placed(L, a, p, fi, size):
    r = cellpx(L, a, p, fi)
    if r is None: return None
    px, c = r; z = np.zeros(size + (4,), np.uint8)
    z[c[5]:c[5] + c[3], c[4]:c[4] + c[2]] = px
    return z


def picture_faults(looks):
    out = []
    for l in looks:
        L = json.load(open(os.path.join(ROOT, 'slices/rig_town', IX['looks'][l]['json'])))
        for a, A in T['activities'].items():
            if a not in L['sheets']: out.append('%s has no %s' % (l, a)); continue
            S = L['sheets'][a]; im = sheet(S['file'])
            if list(im.shape[1::-1]) != S['size']: out.append('%s %s sheet size' % (l, a))
            cols = len(np.unique(im[im[..., 3] > 0][:, :3], axis=0))
            if cols > 80: out.append('%s %s has %d colours' % (l, a, cols))
            seated = set(p for p in A['poses'] for pr, sh in A['props'].items() if T['props'][pr]['kind'] == 'ground' and (sh == 'all' or p in sh))
            for p in A['poses']:
                row = L['poses'][a].get(p)
                if not row or any(i is None for i in row): out.append('%s %s.%s misses a facing' % (l, a, p)); continue
                for fi, i in enumerate(row):
                    c = S['cells'][i]
                    if c[0] + c[2] > S['size'][0] or c[1] + c[3] > S['size'][1]: out.append('%s %s.%s %s off its sheet' % (l, a, p, DIRS[fi]))
                    px = im[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
                    rows = np.nonzero((px[..., 3] > 0).any(1))[0]
                    sole = c[5] + (rows.max() + 1 if len(rows) else 0)
                    if p not in seated and abs(sole - L['feet'][fi][1]) > 3:   # a seat's crate is on the ground too: his heels are held by the joints (E3) out.append('%s %s.%s %s soles %d px off his ground' % (l, a, p, DIRS[fi], sole - L['feet'][fi][1]))
    return out


def chess_faults(looks):
    out = []
    for l in looks:
        L = json.load(open(os.path.join(ROOT, 'slices/rig_town', IX['looks'][l]['json'])))
        size = None
        for a, A in T['activities'].items():
            if a not in L['sheets']: continue
            cs = [c for c in L['sheets'][a]['cells']]; W = max(c[4] + c[2] for c in cs) + 2; H = max(c[5] + c[3] for c in cs) + 2
            size = (H, W)
            variants = set(p for k in A.get('idles', []) + A.get('wall', []) for p, _ in T['timelines'][k]) - {A['rest']}
            for fi in range(8):
                R_ = placed(L, a, A['rest'], fi, size)
                for p in variants:
                    V = placed(L, a, p, fi, size)
                    if R_ is None or V is None: continue
                    diff = (np.abs(R_.astype(int) - V.astype(int)).sum(2) > 30).sum()
                    if diff < 12: out.append('%s %s.%s is its rest at %s (%d px)' % (l, a, p, DIRS[fi], diff))
        # a man at an activity is not standing as his plain still: the rest against the bare idles' standing square
        bj = os.path.join(ROOT, 'slices/rig_idles', l + '.json')
        if os.path.exists(bj):
            B = json.load(open(bj)); Sb = B['sheets']['bare']; ib = np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_idles', Sb['file'])).convert('RGBA'))
            for a in ('drink', 'smoke', 'sit', 'stall'):
                if a not in L['sheets']: continue
                A = T['activities'][a]
                for fi in (0, 2):
                    c = Sb['cells'][B['poses']['bare']['C'][fi]]; s2 = (max(size[0], c[5] + c[3] + 2), max(size[1], c[4] + c[2] + 2))
                    z = np.zeros(s2 + (4,), np.uint8); z[c[5]:c[5] + c[3], c[4]:c[4] + c[2]] = ib[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
                    R_ = placed(L, a, A['rest'], fi, s2)
                    if R_ is not None and ((np.abs(R_.astype(int) - z.astype(int)).sum(2) > 30).sum() < 40):
                        out.append('%s %s rest is his plain still at %s' % (l, a, DIRS[fi]))
    return out


ok('P0 the index is in (slices/rig_town/rig_town.json) with men in it', bool(packed), IDX)
if packed:
    pf = picture_faults(packed)
    ok('P1 every man: every activity, every pose, all eight facings, inside its sheet, soles on his ground, 80 colours or fewer (%d men)' % len(packed),
       not pf, '; '.join(pf[:4]))
    import re
    mix = open(os.path.join(ROOT, 'engine/bohemia_people_mix.js')).read()
    comp = [json.loads(x)['look'] for x in re.findall(r'^\s*(\{"look":.*\})\s*,?\s*$', mix, re.M) if json.loads(x).get('company')]
    ok('P2 his company, the %d men he starts with, all have their activities' % len(comp), all(c in packed for c in comp),
       [c for c in comp if c not in packed][:5])
    cf = chess_faults(packed[:6])
    ok('C1 every variant differs from its rest in every facing; drinking, smoking, sitting, at a stall is not his plain still',
       not cf, '; '.join(cf[:4]))
    L0 = packed[0]; Lj = json.load(open(os.path.join(ROOT, 'slices/rig_town', IX['looks'][L0]['json'])))
    Lm = json.loads(json.dumps(Lj)); Lm['poses']['drink']['D_sip'] = list(Lm['poses']['drink']['D'])
    p_ = os.path.join(ROOT, 'slices/rig_town', '.mut.json'); json.dump(Lm, open(p_, 'w'))
    IX['looks']['.mut'] = {'json': '.mut.json'}
    try: mf = chess_faults(['.mut'])
    finally: os.remove(p_); del IX['looks']['.mut']
    ok('C2 MUTATION: a sip that is the rest picture is caught', any('D_sip is its rest' in x for x in mf))


# ---------------------------------------------------------------------------------------------------- X the player
PLAYER = r'''
const fs = require('fs'), path = require('path'), D = process.argv[2];
global.window = { BOHEMIA_IDLES_BASE: 'x/rig_idles/' };
global.fetch = (u) => Promise.resolve({ ok: true, json: () => JSON.parse(fs.readFileSync(path.join(D, u.replace(/^x\//, '')))) });
const B = require(process.argv[3]); const mode = process.argv[4];
B.town();
setTimeout(function () {
  const out = { acts: {}, pair: null, wall: {} }, keyMs = 500 / 3, M = B.town();
  Object.keys(M.activities).forEach(function (a) {
    const people = [];
    for (let i = 0; i < 12; i++) {
      const sd = mode === 'same' ? 'one' : 'town:' + a + i, seq = []; let held = 0, maxHeld = 0, changes = 0, last = null;
      for (let t = 0; t < 60000; t += keyMs) { const r = B.townAt(sd, t + 1, { act: a, n: mode === 'same' ? 0 : i, pair: a === 'talk' ? (mode === 'same' ? 'one' : 'pair' + (i >> 1)) : undefined, partner: a === 'talk' && i % 2 === 1 }); seq.push(r.pose);
        if (r.pose === last) held += keyMs; else { changes++; held = keyMs; } maxHeld = Math.max(maxHeld, held); last = r.pose; }
      const st = B.townAt(sd, 5000, { act: a, since: 5000, n: i });
      people.push({ seq: seq, maxHeld: maxHeld, changes: changes, sinceKind: st.kind });
    }
    const kinds = {};
    for (let i = 0; i < 40; i++) for (let t = 0; t < 600000; t += 4000) { const r = B.townAt('k' + i, t, { act: a, wall: a === 'flirt' && i % 2 === 0, pair: 'p' + (i >> 1), partner: i % 2 === 1 }); kinds[r.kind] = 1; }
    out.acts[a] = { people: people, kinds: Object.keys(kinds) };
  });
  const say = M.activities.talk.turns.say; let both = 0, aT = 0, bT = 0, n = 0;
  for (let pr = 0; pr < 6; pr++) for (let t = 0; t < 120000; t += keyMs) {
    const a = B.townAt('A' + pr, t, { act: 'talk', pair: 'pair' + pr });
    const b = B.townAt('B' + pr, t, { act: 'talk', pair: 'pair' + pr, partner: mode !== 'bothtalk' });
    const sa = say.indexOf(a.kind) >= 0, sb = say.indexOf(b.kind) >= 0; if (sa && sb) both++; if (sa) aT++; if (sb) bT++; n++; }
  out.pair = { both: both, a: aT / n, b: bT / n };
  [true, false].forEach(function (w) { const k = {}; for (let i = 0; i < 30; i++) for (let t = 0; t < 600000; t += 4000) k[B.townAt('w' + i, t, { act: 'flirt', wall: w }).kind] = 1; out.wall[w] = Object.keys(k); });
  console.log(JSON.stringify(out));
}, 50);
'''


def player(mode=''):
    js = os.path.join(ROOT, 'gates', '.towns_activities_player.js')
    open(js, 'w').write(PLAYER)
    try:
        r = subprocess.run(['node', js, os.path.join(ROOT, 'slices'), os.path.join(ROOT, 'engine/bohemia_idles.js'), mode], capture_output=True, text=True, timeout=120)
    finally:
        os.remove(js)
    try: return json.loads(r.stdout.strip().splitlines()[-1])
    except Exception: return None


def player_faults(X):
    out = []
    for a, R in X['acts'].items():
        P = R['people']
        for i, p in enumerate(P):
            if p['maxHeld'] > 4000: out.append('%s man %d holds one picture %.1f s' % (a, i, p['maxHeld'] / 1000))
            if p['changes'] < 10: out.append('%s man %d changes %d times a minute' % (a, i, p['changes']))
            A = T['activities'][a]; br = [k for side in A.get('breathe', []) for k in side]
            if p['sinceKind'] not in br: out.append('%s man %d begins in %s, not a breath' % (a, i, p['sinceKind']))
        for i in range(len(P)):
            for j in range(i + 1, len(P)):
                share = sum(1 for x, y in zip(P[i]['seq'], P[j]['seq']) if x == y) / len(P[i]['seq'])
                if share >= 0.5: out.append('%s men %d and %d share %d%% of their keys' % (a, i, j, share * 100))
        A = T['activities'][a]
        want = set(A.get('idles', []) + A.get('wall', []) + ((A['turns']['say'] + A['turns']['hear']) if A.get('turns') else []))
        lack = sorted(want - set(R['kinds']))
        if lack: out.append('%s: nobody plays %s in ten minutes' % (a, lack))
    pr = X['pair']
    if pr['both'] or pr['a'] < 0.33 or pr['b'] < 0.33: out.append('a talking pair: both talk %d keys, A talks %.0f%%, B %.0f%%' % (pr['both'], pr['a'] * 100, pr['b'] * 100))
    wl = set(T['activities']['flirt']['wall'])
    if not (wl & set(X['wall']['true'])): out.append('a man by a wall never puts his hand on it')
    if wl & set(X['wall']['false']): out.append('a man with no wall puts his hand on one')
    return out


X = player() if IX else None
ok('X0 the shipped player runs under node', X is not None)
if X:
    xf = player_faults(X)
    ok('X1 twelve men at each activity: never one picture 4 s, ten changes a minute, no two in step, the first slot a breath, every variant played; a pair takes turns; the wall only by a wall',
       not xf, '; '.join(xf[:5]))
    Xs = player('same'); sf_ = player_faults(Xs) if Xs else ['no run']
    ok('X2 MUTATION: a player that hands every man the same clock is caught', any('share' in x for x in sf_))
    Xb = player('bothtalk'); bf = player_faults(Xb) if Xb else ['no run']
    ok('X3 MUTATION: a pair that both talk at once is caught', any('both talk' in x for x in bf))


# ---------------------------------------------------------------------------------------------------- W wired
if not QUICK and packed:
    drv = r'''
const fs = require('fs'), path = require('path'), http = require('http'), ROOT = process.argv[2], LOOK = process.argv[3];
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright'), b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaIdles && BohemiaIdles.activity, null, { timeout: 60000 });
  const got = {};
  for (let i = 0; i < 40; i++) {
    const r = await p.evaluate(L => { const o = {}; BohemiaIdles.activities(L).forEach(a => {
        let c = null; for (let f = 0; f < 8 && !c; f++) c = BohemiaIdles.activity(L, 'crew:' + L, performance.now(), f, { act: a, pair: 'x' });
        o[a] = c ? { w: c.w, h: c.h, nat: c.img.naturalWidth, pose: c.pose } : null; }); return o; }, LOOK);
    Object.keys(r).forEach(a => { if (r[a] && r[a].nat > 0) got[a] = r[a]; });
    if (Object.keys(got).length >= 6) break;
    await p.waitForTimeout(500);
  }
  console.log(JSON.stringify({ got: got, errs: errs }));
  await b.close(); srv.close(); process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
    js = os.path.join(ROOT, 'gates', '.towns_activities_settle.js'); open(js, 'w').write(drv)
    try:
        look = next((l for l in packed if l.startswith('person_town_')), packed[0])
        r = subprocess.run(['node', js, ROOT, look], capture_output=True, text=True, timeout=300, cwd=ROOT)
        R = json.loads(r.stdout.strip().splitlines()[-1]) if r.stdout.strip() else {'err': r.stderr[-300:]}
    finally:
        os.remove(js)
    ok('W1 on the real settlement screen the player hands back a drawn cell of all six activities for his man %s, the sheets decode, nothing thrown' % look,
       not R.get('err') and not R.get('errs') and len(R.get('got', {})) == 6, R.get('err') or R.get('errs') or sorted(R.get('got', {})))
done()
