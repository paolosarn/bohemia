#!/usr/bin/env python3
"""THE THING IN HIS HAND (ANIMATION [the PC playtest: the bodies' part], the next line; rule 164 item 31, Paolo 10/24 on his
PC: 'more and better animations when people hold things'; the coordinator's order 10/25: 'melee weapons held right in the
hand: the club, the bat, the pipe, the knife, the poacher's hatchet: idle, walk, the swing, the hit taken').

MEASURED BEFORE: on sixteen real fights 225 of 360 men held a melee or thrown weapon and every one was drawn bare-fisted.
Asked of the PICTURES and of the REAL FIGHT, never of a table's say-so:
  S  THE SOURCE (records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json, rule 128): every new key names parts that exist;
     every timeline slot is 24 keys from key 0 to key 0, no key flickers out and back (AN ENVELOPE RAMPS SLOWER THAN THE
     GRID); every key of every melee clip is a key some sheet draws and that the props are rendered on; every row it names
     is a row of the armoury (records/target/bb/weapons.json).
  P  THE PICTURES (slices/rig_melee): every man packed has the melee idle's own keys in all eight facings; every named look
     has every prop on every key of every melee clip in all eight facings (hidden behind him in at most two facings of a key,
     where he stands in front of it); every cell inside its sheet; the body wears his own fight sheet's colours, a prop the
     style palette's.
  H  IN HIS HAND: wherever the thing shows, it touches him (two pixels at most from his body on the same key: a prop that
     floats free of the fist is caught); IT IS SWUNG: in profile the wind takes it up to his head or over it, and the blow
     carries it out in front of him; THE TAP crosses his middle facing the glass; ON THE SHOULDER it rides above his
     shoulder line.
  W  WIRED: the fight carries the melee draw inside the marked block; on the real fight (headless, the shipped file) a man
     with a melee row stands in the melee idle holding his thing, a swing plays with it in his hand, a man stood on cover
     kneels with it, no page error; and IN THE DEMO (a road fight from the map, inside the shell he plays) the same idle.
  MUTATIONS (the gate must bite): a prop moved off his fist, a wind that stays at his belt, a slot a key short.
    python3 gates/melee_in_hand_gate.py            (all legs)
    python3 gates/melee_in_hand_gate.py --quick    (no browser)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json')
HSRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json')
OUT = os.path.join(ROOT, 'slices/rig_melee')
HOLD = os.path.join(ROOT, 'slices/rig_hold')
IDX = os.path.join(OUT, 'rig_melee.json')
FR = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')
QUICK = '--quick' in sys.argv
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
ok_n = fail_n = 0
TOUCH = 2          # px: the thing in his fist is never further than this from his body on the same key
HIDDEN_MAX = 2     # facings of one key the thing may be wholly behind him in


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nTHE THING IN HIS HAND GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


D = json.load(open(SRC)); HD = json.load(open(HSRC))
FIGHT_CLIPS = {'Swing': 3}   # COMBAT's own clips the melee clips borrow (tools/bohemia_combat_the_fight_poses.py man_keys)


# ---------------------------------------------------------------------------------------------------- S the source
def source_faults(D):
    out = []; parts = set(HD['parts']) | set(D['parts'])
    nkeys = {n: len(c['keys']) for n, c in HD['clips'].items()}; nkeys.update({n: len(c['keys']) for n, c in D['clips'].items()}); nkeys.update(FIGHT_CLIPS)
    for n, C in D['clips'].items():
        for i, key in enumerate(C['keys']):
            miss = [p for p in key if p not in parts]
            if miss: out.append('%s key %d names %s' % (n, i, miss))
    for n, T in D['timelines'].items():
        if n == 'why': continue
        if n not in D['composite']: out.append('timeline %s has no clip' % n); continue
        nk = len(D['composite'][n])
        for t in T:
            if sum(c for _, c in t) != 24: out.append('%s: a slot of %d keys' % (n, sum(c for _, c in t)))
            if t[0][0] != 0 or t[-1][0] != 0: out.append('%s: a slot that does not start and end on key 0' % n)
            if any(k >= nk or k < 0 for k, _ in t): out.append('%s: names a key it has not got' % n)
            for j in range(1, len(t) - 1):
                if t[j][1] == 1 and t[j - 1][0] == t[j + 1][0]: out.append('%s: key %d flickers out and back' % (n, t[j][0]))
    for n, ks in D['composite'].items():
        if n == 'why': continue
        lay = next((L for L in D['layers'].values() if all(src in L['clips'] for src, _ in ks)), None)
        if lay is None: out.append('%s: no layer renders its props' % n); continue
        for src, k in ks:
            if src not in nkeys or not 0 <= k < nkeys[src]: out.append('%s: %s key %d is drawn by no sheet' % (n, src, k)); continue
            if k not in lay['keys'].get(src, range(len(D['hold'].get(src, [])))) or k >= len(D['hold'].get(src, [])):
                out.append('%s: no prop is rendered on %s key %d' % (n, src, k))
            if src in D.get('shield_hold', {}) and k >= len(D['shield_hold'][src]): out.append('%s: no shield is held on %s key %d' % (n, src, k))
    shields = set(s['id'] for s in json.load(open(os.path.join(ROOT, 'records/target/bb/armor.json')))['shields'])
    for r, p in D.get('shield_by_row', {}).items():
        if r == 'why': continue
        if not D['props'].get(p, {}).get('shield'): out.append('shield row %s carries %s, which is not a shield' % (r, p))
        if r not in shields: out.append('shield row %s is not in the armoury' % r)
    rows = set(w['id'] for w in json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))['rows'])
    for r, p in D['by_row'].items():
        if r == 'why': continue
        if p not in D['props']: out.append('row %s holds %s, which is not a prop' % (r, p))
        if rows is not None and r not in rows: out.append('row %s is not in the armoury' % r)
    return out


sf = source_faults(D)
ok('S1 every new key names parts that exist; every slot is 24 keys from key 0 to key 0, no flicker; every melee key is drawn and has its prop; every row is the armoury\'s', not sf, sf[:4])
m1 = json.loads(json.dumps(D)); m1['timelines']['MIdle'][0][0][1] -= 1
m2 = json.loads(json.dumps(D)); m2['composite']['MIdle'].append(['PIdle', 5])
ok('S2 MUTATION: a slot a key short, and a key with no prop rendered on it, are both caught', source_faults(m1) and source_faults(m2))

if not os.path.exists(IDX):
    ok('P0 the pictures are packed (slices/rig_melee/rig_melee.json)', False, 'no index'); done()
I = json.load(open(IDX)); F = json.load(open(FR))
looks = sorted(I['looks'])
named = [k for k in looks if not F['looks'][k].get('ref')]
ok('P1 the index carries the men it packed, named looks among them', len(named) > 0, looks[:6])
E = {k: json.load(open(os.path.join(OUT, I['looks'][k]['json']))) for k in looks}
EH = {k: json.load(open(os.path.join(HOLD, k + '.json'))) for k in looks if os.path.exists(os.path.join(HOLD, k + '.json'))}
SHEETS = {}


def sheet(fn, d=OUT):
    p = os.path.join(d, fn)
    if p not in SHEETS: SHEETS[p] = np.asarray(Image.open(p).convert('RGBA'))
    return SHEETS[p]


def fight_cell(k, col, f):
    L = F['looks'][k]; a = sheet(L['file'], os.path.join(ROOT, 'slices/fight_rig'))
    return a[f * L['h']:(f + 1) * L['h'], col * L['w']:(col + 1) * L['w']], [col * L['w'], f * L['h'], L['w'], L['h'], 0, 0]


def body(k, src, kk, f):
    """his body on this key, in his fight cell's frame: (alpha mask array, x0, y0)"""
    e = E[k]
    if src in D['clips']:   # this lane's own new keys (the melee idle's, the shield's)
        i = e['clips'][src][kk][f]; c = e['sheet']['cells'][i]; a = sheet(e['sheet']['file'])[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    elif src == 'Swing':
        L = F['looks'][k]; col = (L.get('clips') or F['clips'])['swing'][kk]; a, c = fight_cell(k, col, f)
    else:
        h = EH[k]; i = h['clips'][src][kk][f]; c = h['sheet']['cells'][i]; a = sheet(h['sheet']['file'], HOLD)[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    return a[..., 3] > 0, c[4], c[5]


def prop(k, p, src, kk, f, e=None):
    e = e or E[k]; P = e['props']; i = P['by'][p][src][kk][f]
    if i is None: return None
    c = P['cells'][i]; a = sheet(P['file'])[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    return a[..., 3] > 0, c[4], c[5], a


READY = D.get('layers_ready', list(D['layers']))


def layer_of(n):
    """the layer whose clips draw every key of this melee clip"""
    for ly, L in D['layers'].items():
        if all(src in L['clips'] for src, _ in D['composite'][n]): return ly
    return None


COMPOSITES = [n for n in D['composite'] if n != 'why' and layer_of(n) in READY]
OWN = [n for n in D['clips'] if any(src == n for c in COMPOSITES for src, _ in D['composite'][c])]   # the new body keys the ready clips draw


def keys_of(layer=None, prop_=None):
    out = []
    for n in COMPOSITES:
        ly = layer_of(n)
        if layer and ly != layer: continue
        only = D['layers'][ly].get('only', {}).get(prop_, 'all') if prop_ else 'all'
        out += [(src, k) for src, k in D['composite'][n] if only == 'all' or src in only]
    return sorted(set(out))


def props_of(ly):
    return D['layers'][ly]['props']


# ---------------------------------------------------------------------------------------------------- P the pictures
miss, pmiss, outside, pal, hid = [], [], [], [], []
PALS = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
ppal = set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in PALS.values() for h in r['ramp']) | {tuple(F['rim'][:3])}
for k, e in E.items():
    for n in OWN:
        C = D['clips'][n]; ck = e['clips'].get(n)
        if not ck or len(ck) != len(C['keys']) or any(len(r) != 8 or any(i is None for i in r) for r in ck): miss.append('%s %s' % (k, n))
    a = sheet(e['sheet']['file']); H, W = a.shape[:2]
    outside += ['%s body %d' % (k, i) for i, c in enumerate(e['sheet']['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
    fs = sheet(F['looks'][k]['file'], os.path.join(ROOT, 'slices/fight_rig'))
    have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist())) | {tuple(F['rim'][:3])}
    extra = set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())) - have
    if extra: pal.append('%s body +%d colours' % (k, len(extra)))
    if 'props' not in e: continue
    P = e['props']; pa = sheet(P['file']); H, W = pa.shape[:2]
    outside += ['%s props %d' % (k, i) for i, c in enumerate(P['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
    extra = set(map(tuple, pa[pa[..., 3] > 0][:, :3].tolist())) - ppal
    if extra: pal.append('%s props +%d colours off the palette' % (k, len(extra)))
    for ly in READY:
      for p in props_of(ly):
        for src, kk in keys_of(ly, p):
            r = P['by'].get(p, {}).get(src)
            if not r or kk >= len(r) or len(r[kk]) != 8: pmiss.append('%s %s %s k%d' % (k, p, src, kk)); continue
            if sum(1 for i in r[kk] if i is None) > HIDDEN_MAX: hid.append('%s %s %s k%d hidden in %d facings' % (k, p, src, kk, sum(1 for i in r[kk] if i is None)))
ok('P2 every man packed has the melee idle\'s own keys in all eight facings', not miss, miss[:4])
ok('P3 every named look has every prop on every key of every melee clip in all eight facings', not pmiss, pmiss[:4])
ok('P4 a prop is wholly behind him in at most two facings of a key', not hid, hid[:4])
ok('P5 every cell sits inside its sheet', not outside, outside[:4])
ok('P6 his body wears his own fight sheet\'s colours; a prop the style palette\'s', not pal, pal[:4])


# ---------------------------------------------------------------------------------------------------- H in his hand
def gap(bm, bx, by, pm, px, py):
    """the fewest pixels between the prop and his body (0 where they overlap)"""
    ys, xs = np.nonzero(pm); ys = ys + py; xs = xs + px
    by_, bx_ = np.nonzero(bm); by_ = by_ + by; bx_ = bx_ + bx
    if not len(xs) or not len(bx_): return 99
    B = set(zip(bx_.tolist(), by_.tolist()))
    best = 99
    for x, y in zip(xs.tolist(), ys.tolist()):
        for r in range(0, TOUCH + 1):
            if any((x + dx_, y + dy_) in B for dx_ in range(-r, r + 1) for dy_ in range(-r, r + 1)): best = min(best, r); break
        if best == 0: break
    return best


def hand_faults(E, only=None):
    out = []
    for k, e in E.items():
        if 'props' not in e or (only and k not in only): continue
        for p, src, kk in sorted(set((p_, s_, k_) for ly in READY for p_ in props_of(ly) for s_, k_ in keys_of(ly, p_) if not D['props'][p_].get('shield'))):
                for f in range(8):
                    pr = prop(k, p, src, kk, f, e)
                    if pr is None: continue
                    bm, bx, by = body(k, src, kk, f)
                    g = gap(bm, bx, by, pr[0], pr[1], pr[2])
                    if g > TOUCH: out.append('%s %s %s k%d %s: %d px off his body' % (k, p, src, kk, DIRS[f], g))
    return out


def swing_faults(E, only=None):
    """in profile (E, W): the wind takes the thing up to his head (its top no lower than a fifth of his height under his
    crown); the blow carries it out in front of him (its far end a fifth of his height past his foot)"""
    out = []
    for k, e in E.items():
        if 'props' not in e or (only and k not in only): continue
        fx, fy = e['foot']
        for f, side in ((2, 1), (6, -1)):
            bm, bx, by = body(k, 'PIdle', 0, f); ys = np.nonzero(bm)[0]; crown = by + ys.min(); h = fy - crown
            for p in D['layers']['m1']['props']:
                w = prop(k, p, 'Swing', 0, f, e); b = prop(k, p, 'Swing', 1, f, e)
                if w is None or b is None: out.append('%s %s Swing %s: hidden' % (k, p, DIRS[f])); continue
                wy = w[2] + np.nonzero(w[0])[0].min()
                if wy > crown + h * 0.2: out.append('%s %s wind %s: its top %d px under his crown' % (k, p, DIRS[f], wy - crown))
                xs = np.nonzero(b[0])[1] + b[1]; far = (xs.max() - fx) if side > 0 else (fx - xs.min())
                if far < h * 0.2: out.append('%s %s blow %s: only %d px in front of him' % (k, p, DIRS[f], far))
    return out


def tap_faults(E, only=None):
    out = []
    for k, e in E.items():
        if 'props' not in e or (only and k not in only): continue
        for p in D['layers']['m1']['props']:
            t = prop(k, p, 'MIdleX', 2, 0, e)
            if t is None: out.append('%s %s tap S: hidden' % (k, p)); continue
            xs = np.nonzero(t[0])[1] + t[1]
            if not xs.min() < e['foot'][0] < xs.max(): out.append('%s %s tap S: it does not cross his middle' % (k, p))
    return out


hf = hand_faults(E)
ok('H1 wherever the thing shows it touches him (%d px at most from his body on the same key and facing)' % TOUCH, not hf, hf[:4])
sw = swing_faults(E)
ok('H2 IT IS SWUNG: in profile the wind takes it up to his head, the blow out in front of him', not sw, sw[:4])
tf = tap_faults(E)
ok('H3 THE TAP crosses his middle facing the glass', not tf, tf[:4])
k0 = next((k for k in named if 'props' in E[k]), None)
if k0:
    me = json.loads(json.dumps(E[k0])); p0 = D['layers']['m1']['props'][0]
    i = me['props']['by'][p0]['PIdle'][0][0]; me['props']['cells'][i] = list(me['props']['cells'][i]); me['props']['cells'][i][4] -= 30
    j = me['props']['by'][p0]['Swing'][0][2]; jb = me['props']['by'][p0]['Swing'][2][2]
    me['props']['by'][p0]['Swing'][0][2] = me['props']['by'][p0]['PHit'][1][2]   # the wind drawn as the thing hanging at his side
    ok('H4 MUTATION: a prop moved off his fist, and a wind that stays at his side, are both caught',
       any('PIdle k0 S' in x for x in hand_faults({k0: me})) and any('wind E' in x for x in swing_faults({k0: me})))

# ---------------------------------------------------------------------------------------------------- W wired
t = open(os.path.join(ROOT, 'slices/BOHEMIA_FIGHT.html')).read()
blk = t[t.find('__WHAT_A_MAN_HOLDS__ (ANIMATION'):t.find('end __WHAT_A_MAN_HOLDS__')]
ok('W1 the fight (COMBAT\'s file) carries the melee draw inside the marked block and asks it first for a man with no gun',
   'function meleeDraw(' in blk and "fetch('rig_melee/rig_melee.json')" in blk and 'const md = meleeDraw(v, p, L, d, ox, oy, s, now); if (md !== null) return md;' in blk)
if not QUICK:
    drv = r'''
const { open } = require(process.argv[2]);
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",deploy:false}' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length && HOLD.state === 2 && MELEE.state === 2, null, { timeout: 60000 });
  await p.waitForTimeout(6000);
  const set = await p.evaluate(() => {
    const S = FIGHT.S, mel = S.units.filter(v => FIGHT.onField(v) && !v.beast && meleeProp(v) && MELEE.meta.looks[lookOf(v)._key]);
    const v = mel[0], foe = v && S.units.filter(u => u.side !== v.side && FIGHT.onField(u))[0];
    /* a swing on the beat, as the fight's own attack plays it */
    if (v && foe) UI.anim.unshift({ k: 'attack', at: performance.now(), dur: beatMs(), e: { id: v.id, to: foe.id, shot: false, hit: false } });
    window.__mel = v ? v.id : null;
    return { melee: mel.map(u => u.id + ':' + meleeProp(u) + ':' + lookOf(u)._key), swinger: v && v.id };
  });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { UI.anim = UI.anim.filter(a => !(a.k === 'attack' && a.e.id === window.__mel)); });
  /* the man stood on a tile with cover kneels with his thing */
  set.cover = await p.evaluate(() => { const S = FIGHT.S, v = FIGHT.byId(window.__mel); if (!v) return null;
    const taken = {}; S.units.forEach(u => { taken[u.y * S.w + u.x] = 1; });
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.coverCount[y][x] > 0 && FIGHT.rowAt(x, y) !== 'obstacles' && !S.solid[y][x] && !taken[y * S.w + x]) { v.x = x; v.y = y; v._at = undefined; v._holdClip = undefined; return v.id + ' to ' + x + ',' + y; }
    return null; });
  await p.waitForTimeout(4000);
  const seen = await p.evaluate(() => UI.clipSeen);
  console.log(JSON.stringify({ set: set, seen: seen, errs: errs }));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
    js = os.path.join(ROOT, 'gates', '.melee_in_hand_fight.js'); open(js, 'w').write(drv)
    try:
        r = subprocess.run(['node', js, os.path.join(ROOT, 'tools/bohemia_drive_the_demo.js')], capture_output=True, text=True, timeout=240, cwd=ROOT)
    finally:
        os.remove(js)
    line = [l for l in r.stdout.splitlines() if l.startswith('{')]
    R = json.loads(line[-1]) if line else {'err': r.stdout[-300:] + r.stderr[-300:]}
    seen = R.get('seen') or {}
    mel = {k: v for k, v in seen.items() if k.startswith(('melee:', 'prop:'))}
    print('  note W2 melee men %s; the swinger %s; cover %s; drawn %s' % (len((R.get('set') or {}).get('melee') or []), (R.get('set') or {}).get('swinger'), (R.get('set') or {}).get('cover'), mel))
    ok('W2 on the real fight a man with a melee row stands in the melee idle with his thing, swings with it in his hand, kneels with it on cover, no page error',
       seen.get('melee:MIdle') and seen.get('melee:MSwing') and seen.get('melee:MCover') and any(k.startswith('prop:') for k in seen) and not R.get('errs') and not R.get('err'),
       'seen %s, errors %s' % (mel, (R.get('errs') or [R.get('err')])[:2]))
    drv3 = r"""
const drive = require(process.argv[2]);
(async () => {
  const d = await drive.open(), errs = [];
  d.page.on('pageerror', e => errs.push(String(e)));
  await d.fr.waitForFunction(() => typeof roadContactFight === 'function' && typeof om !== 'undefined' && !!om, null, { timeout: 120000 });
  const st = await d.fr.evaluate(async () => {
    for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
    try { stepOnce(0); stepOnce(4); } catch (_e) {}
    return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 });
  });
  let f = null;
  for (let i = 0; i < 300 && !f; i++) {
    const h = await d.page.$('#fightFrame');
    if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board && typeof MELEE !== 'undefined' && MELEE.state === 2).catch(() => false)) f = c; }
    if (!f) await d.page.waitForTimeout(200);
  }
  if (!f) { console.log(JSON.stringify({ started: st, err: 'no fight frame', errs })); process.exit(0); }
  await d.page.waitForTimeout(8000);
  const a = await f.evaluate(() => ({ seen: Object.assign({}, UI.clipSeen), melee: FIGHT.S.units.filter(v => FIGHT.onField(v) && !v.beast && meleeProp(v)).map(v => v.id + ':' + meleeProp(v)) }));
  console.log(JSON.stringify({ started: st, a: a, errs: errs.slice(0, 3) }));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
"""
    js3 = os.path.join(ROOT, 'gates', '.melee_in_hand_demo.js'); open(js3, 'w').write(drv3)
    try:
        r3 = subprocess.run(['node', js3, os.path.join(ROOT, 'tools/bohemia_drive_the_demo.js')], capture_output=True, text=True, timeout=420, cwd=ROOT)
    finally:
        os.remove(js3)
    l3 = [l for l in r3.stdout.splitlines() if l.startswith('{')]
    R3 = json.loads(l3[-1]) if l3 else {'err': r3.stdout[-300:] + r3.stderr[-300:]}
    a3 = (R3.get('a') or {}); s3 = a3.get('seen') or {}
    print('  note W3 the demo: a road fight %s; melee men %s; drawn %s' % (R3.get('started'), a3.get('melee'), {k: v for k, v in s3.items() if k.startswith(('melee:', 'prop:'))}))
    ok('W3 IN THE DEMO (a road fight from the map, the fight inside the shell): the men with melee rows are drawn in the melee idle with their things, no page error',
       R3.get('started') and s3.get('melee:MIdle') and any(k.startswith('prop:') for k in s3) and not R3.get('errs') and not R3.get('err'), (R3.get('errs') or [R3.get('err')])[:2])
done()
