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
     has every prop on every key of every melee clip in all eight facings (hidden behind him in at most half the facings of a key,
     where his body is between); every cell inside its sheet; the body wears his own fight sheet's colours, a prop the
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
import copy, json, os, re, subprocess, sys
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
HIDDEN_MAX = 5     # facings of one key the thing may be wholly behind him in (facing away, and the far side of him for a thing held before his belly)
SEEN_MIN = 0.7     # and over all its keys and facings a thing shows in at least this share


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nTHE THING IN HIS HAND GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


D = json.load(open(SRC)); HD = json.load(open(HSRC))
FIGHT_CLIPS = {'Swing': 3, 'Carry': 1, 'CarryWalk': 6, 'Aim': 3, 'Hit': 2}   # COMBAT's own clips the melee clips borrow, drawn from his fight sheet (tools/bohemia_combat_the_fight_poses.py)
FIGHT_COL = {'Swing': 'swing', 'Carry': 'carry', 'CarryWalk': 'carrywalk', 'Aim': 'aim', 'Hit': 'hit'}


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


def grips_of(fn):
    """the holds the tool's placers grip a thing in, read off the tool itself: place() for a melee thing, place_pistol() for
    the pistol (a hold neither knows stops the render: 'PROPS FAILED')"""
    src = open(os.path.join(ROOT, 'tools/bohemia_animation_melee_in_hand.py')).read()
    body = src[src.index('def %s(' % fn):]; body = body[:body.index('\ndef ', 10) if fn != 'place' else body.index('raise KeyError(hold)')]
    out = set(re.findall(r"hold == '(\w+)'", body))
    for grp in re.findall(r"hold in \(([^)]*)\)", body): out |= set(re.findall(r"'(\w+)'", grp))
    return out


GRIPS = {'place': grips_of('place'), 'place_pistol': grips_of('place_pistol')}


def grip_faults(S_):
    """every thing on every key of every clip its layer draws it on has a grip (hold_by_prop first, then the clip's hold)"""
    out = []
    for ly, L in S_['layers'].items():
        for p in L['props']:
            if S_['props'][p].get('shield'): continue
            only = L.get('only', {}).get(p, 'all')
            for clip in L['clips']:
                if only != 'all' and clip not in only: continue
                for j in L.get('keys', {}).get(clip, range(len(S_['hold'][clip]))):
                    h = S_['hold'][clip][j]; h = S_.get('hold_by_prop', {}).get(p, {}).get(h, h)
                    if h not in GRIPS['place_pistol' if p == 'pistol' else 'place']: out.append('%s %s %s k%d: no grip for %r' % (ly, p, clip, j, h))
    return out


gr = grip_faults(D)
ok('S3 every thing has a grip on every key its layer draws it on (the spear thrusts out over the shield on the aim)', not gr, gr[:4])
m3 = copy.deepcopy(D); m3['hold_by_prop']['rebar_spear'].pop('aim', None)
ok('S4 MUTATION: the spear with no grip on the shield arm\'s aim is caught', bool(grip_faults(m3)))

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
        oc = e['clips'][src]; sh = e['sheets'][oc['g']]; i = oc['k'][kk][f]; c = sh['cells'][i]; a = sheet(sh['file'])[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    elif src in FIGHT_COL:   # COMBAT's own clip on his fight sheet
        L = F['looks'][k]; col = (L.get('clips') or F['clips'])[FIGHT_COL[src]][kk]; a, c = fight_cell(k, col, f)
    else:
        h = EH[k]; i = h['clips'][src][kk][f]; c = h['sheet']['cells'][i]; a = sheet(h['sheet']['file'], HOLD)[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    return a[..., 3] > 0, c[4], c[5]


def owner(k, p, src, e=None):
    """the entry whose sheet holds this thing on this clip (his own, else YOU's for a cast look), and the shift of feet"""
    e = e or E[k]
    if p in e.get('props', {}).get('by', {}) and src in e['props']['by'][p]: return e, 0, 0
    for r in (e.get('props_ref'), E.get(e.get('ref'), {}).get('props_ref') if e.get('ref') else None):   # whose things he holds, then whose his gang holds
        if r and r in E and p in E[r].get('props', {}).get('by', {}) and src in E[r]['props']['by'][p]:
            return E[r], e['foot'][0] - E[r]['foot'][0], e['foot'][1] - E[r]['foot'][1]
    raise KeyError('%s %s %s' % (k, p, src))


def prop(k, p, src, kk, f, e=None):
    o, sx, sy = owner(k, p, src, e); P = o['props']; pk = P['by'][p][src]; i = pk['k'][kk][f]
    if i is None: return None
    sh = P['sheets'][pk['l']]; c = sh['cells'][i]; a = sheet(sh['file'])[c[1]:c[1] + c[3], c[0]:c[0] + c[2]]
    return a[..., 3] > 0, c[4] + sx, c[5] + sy, a


READY = I.get('layers_ready', D.get('layers_ready', list(D['layers'])))   # what is LIVE: the layers the last pack put in the fight's index (the source may name layers still rendering)
if '--layers' in sys.argv: READY = sys.argv[sys.argv.index('--layers') + 1].split(',')   # a layer still being made, asked of early


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
miss, pmiss, outside, pal, hid, seen_ = [], [], [], [], [], {}
PALS = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
ppal = set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in PALS.values() for h in r['ramp']) | {tuple(F['rim'][:3])}
for k, e in E.items():
    mine = e.get('layers', ['m1'])
    for n in [n_ for n_ in OWN if any(layer_of(c_) in mine for c_ in COMPOSITES if any(s_ == n_ for s_, _ in D['composite'][c_]))]:
        C = D['clips'][n]; ck = e['clips'].get(n, {}).get('k')
        if not ck or len(ck) != len(C['keys']) or any(len(r) != 8 or any(i is None for i in r) for r in ck): miss.append('%s %s' % (k, n))
    fs = sheet(F['looks'][k]['file'], os.path.join(ROOT, 'slices/fight_rig'))
    have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist())) | {tuple(F['rim'][:3])}
    for g_, sh in e['sheets'].items():   # one sheet a group of his own keys
        a = sheet(sh['file']); H, W = a.shape[:2]
        outside += ['%s body %s %d' % (k, g_, i) for i, c in enumerate(sh['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
        extra = set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())) - have
        if extra: pal.append('%s body %s +%d colours' % (k, g_, len(extra)))
    if 'props' not in e: continue
    P = e['props']
    for l_, sh in P['sheets'].items():   # one sheet a layer of things
        pa = sheet(sh['file']); H, W = pa.shape[:2]
        outside += ['%s things %s %d' % (k, l_, i) for i, c in enumerate(sh['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
        extra = set(map(tuple, pa[pa[..., 3] > 0][:, :3].tolist())) - ppal
        if extra: pal.append('%s things %s +%d colours off the palette' % (k, l_, len(extra)))
    for ly in [l_ for l_ in READY if l_ in e.get('layers', ['m1'])]:
      for p in props_of(ly):
        for src, kk in keys_of(ly, p):
            try: o_ = owner(k, p, src)[0]
            except KeyError: pmiss.append('%s %s %s k%d' % (k, p, src, kk)); continue
            r = o_['props']['by'].get(p, {}).get(src, {}).get('k')
            if not r or kk >= len(r) or len(r[kk]) != 8: pmiss.append('%s %s %s k%d' % (k, p, src, kk)); continue
            if sum(1 for i in r[kk] if i is None) > HIDDEN_MAX: hid.append('%s %s %s k%d hidden in %d facings' % (k, p, src, kk, sum(1 for i in r[kk] if i is None)))
            seen_[(k, p)] = seen_.get((k, p), [0, 0]); seen_[(k, p)][0] += sum(1 for i in r[kk] if i is not None); seen_[(k, p)][1] += 8
ok('P2 every man packed has the melee idle\'s own keys in all eight facings', not miss, miss[:4])
ok('P3 every named look has every prop on every key of every melee clip in all eight facings', not pmiss, pmiss[:4])
hid += ['%s %s shows in only %d of %d pictures' % (k, p, s_[0], s_[1]) for (k, p), s_ in seen_.items() if s_[0] < SEEN_MIN * s_[1]]
ok('P4 a thing shows in at least three facings of every key, and in 70 percent of all its pictures (his body between only where it is)', not hid, hid[:4])
ok('P5 every cell sits inside its sheet', not outside, outside[:4])
ok('P6 his body wears his own fight sheet\'s colours; a prop the style palette\'s', not pal, pal[:4])
big = ['%s %s %dx%d' % (k, s_['file'], s_['size'][0], s_['size'][1]) for k, e in E.items() for s_ in list(e['sheets'].values()) + list(e.get('props', {}).get('sheets', {}).values()) if s_['size'][0] * s_['size'][1] > 2048 * 1024]
ok('P7 ONE SHEET A GROUP (rule 173, no crash before a fight): his own keys split melee, shield, two hands; a named look\'s things one sheet a layer; none over 2048 x 1024 (8 MB decoded)', not big, big[:4])


def own_ramps(prop):
    """the colours of the materials COOK built a thing from (records/target/cook_every_item/measured_<thing>.json), with the
    rim; None for a stand-in"""
    mj = os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % prop)
    if not os.path.exists(mj) or not os.path.exists(os.path.join(ROOT, 'reference/models/bohemia/item_%s.glb' % prop)): return None
    roles = [m.split()[0] for m in json.load(open(mj)).get('materials', []) if m.split()[0] in PALS]
    return set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in roles for h in PALS[r]['ramp']) | {tuple(F['rim'][:3])}


def paint_faults(E_, cell_of=None):
    """a COOK thing wears only its own materials' steps: a faded teal door snapped to chrome or a glass eye's grey is caught"""
    out = []
    for k, e in E_.items():
        P = e.get('props')
        if not P: continue
        for prop, clips in P['by'].items():
            own = own_ramps(prop) if P.get('models', {}).get(prop, 'stand-in').startswith('cook:') else None   # drawn from COOK's model
            if own is None: continue
            bad = 0
            for clip, pk in clips.items():
                sh = P['sheets'].get(pk['l'])
                if not sh: continue
                pa = sheet(sh['file'])
                for row in pk['k']:
                    for ix in row:
                        if ix is None: continue
                        x, y, w, h = sh['cells'][ix][:4]; c = pa[y:y + h, x:x + w] if cell_of is None else cell_of(pa[y:y + h, x:x + w])
                        bad += len(set(map(tuple, c[c[..., 3] > 0][:, :3].tolist())) - own)
            if bad: out.append('%s %s: %d colours not of its own materials' % (k, prop, bad))
    return out


pf = paint_faults(E)
ok('P8 A THING KEEPS ITS PAINT: a thing COOK modelled wears only the steps of the materials it is built from (the car door teal, never chrome grey)', not pf, pf[:4])
_full = np.array(sorted(ppal), np.int32)


def _rgb_snap(c):   # the old way: the nearest of every style colour by plain distance
    c = c.copy(); op = c[..., 3] > 0; px = c[op][:, :3].astype(np.int32)
    c[op, :3] = _full[((px[:, None, :] - _full[None]) ** 2).sum(2).argmin(1)]; return c


_one = {k: e for k, e in E.items() if 'car_door' in e.get('props', {}).get('by', {}) and own_ramps('car_door') is not None}
_one = dict(list(_one.items())[:1])
if _one:
    _tint = lambda c: _rgb_snap(np.concatenate([np.clip(c[..., :3].astype(np.int32) + np.array([-20, -12, -14]), 0, 255).astype(np.uint8), c[..., 3:]], -1))
    ok('P9 MUTATION: the car door snapped the old way (the nearest style colour, its paint gone grey) is caught', bool(paint_faults(_one, _tint)))


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
        for p, src, kk in sorted(set((p_, s_, k_) for ly in READY if ly in e.get('layers', ['m1']) for p_ in props_of(ly) for s_, k_ in keys_of(ly, p_) if not D['props'][p_].get('shield'))):
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
        if 'props' not in e or e.get('held') or (only and k not in only): continue   # a man with his own modelled weapon is drawn without the prop
        for p in [p_ for p_ in D['layers']['m1']['props'] if D.get('hold_by_prop', {}).get(p_, {}).get('tap', 'tap') == 'tap']:   # a thing whose tap is held otherwise (the cleaver's flat lifted) is not asked to cross him
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
k0 = next((k for k in named if D['layers']['m1']['props'][0] in E[k].get('props', {}).get('by', {})), None)
if k0:
    me = json.loads(json.dumps(E[k0])); p0 = D['layers']['m1']['props'][0]
    pk = me['props']['by'][p0]['PIdle']; cs = me['props']['sheets'][pk['l']]['cells']; i = pk['k'][0][0]; cs[i] = list(cs[i]); cs[i][4] -= 30
    me['props']['by'][p0]['Swing']['k'][0][2] = me['props']['by'][p0]['PHit']['k'][1][2]   # the wind drawn as the thing hanging at his side
    ok('H4 MUTATION: a prop moved off his fist, and a wind that stays at his side, are both caught',
       any('PIdle k0 S' in x for x in hand_faults({k0: me})) and any('wind E' in x for x in swing_faults({k0: me})))

# ---------------------------------------------------------------------------------------------------- G the shield arm
KNEEL_REACH = 0.55   # metres: how far before his feet a man on one knee plants a shield (his knee and forearm)


def shield_faults(E, only=None):
    """facing the glass (S): CARRIED, the shield's middle on his left (the glass's right of his middle) and over his body;
    THE BLOCK, its top a tenth of his height higher than carried and up at his face (within a quarter of his height under
    his crown); IN COVER, planted: its lowest pixel on his ground (three pixels)"""
    out = []
    for k, e in E.items():
        if 'props' not in e or 's1' not in e.get('layers', []) or (only and k not in only): continue
        fx, fy = e['foot']
        bm, bx, by = body(k, 'SIdle', 0, 0); ys = np.nonzero(bm)[0]; crown = by + ys.min(); h = fy - crown
        for sh in [p_ for p_ in props_of('s1') if D['props'][p_].get('shield')]:
            c = prop(k, sh, 'SIdle', 0, 0, e); b = prop(k, sh, 'SBlock', 0, 0, e); lo = prop(k, sh, 'SCover', 0, 0, e)
            if c is None or b is None or lo is None: out.append('%s %s: hidden facing the glass' % (k, sh)); continue
            cxm = c[1] + np.nonzero(c[0])[1].mean()
            if cxm < fx: out.append('%s %s carried: its middle %d px on his right' % (k, sh, fx - cxm))
            ct = c[2] + np.nonzero(c[0])[0].min(); bt = b[2] + np.nonzero(b[0])[0].min()
            if ct - bt < h * 0.1: out.append('%s %s block: only %d px higher than carried' % (k, sh, ct - bt))
            if bt > crown + h * 0.25: out.append('%s %s block: its top %d px under his crown' % (k, sh, bt - crown))
            # planted: its foot on the ground before him, never floating. In profile its near end sits lower on the glass by as
            # much as half its width seen across the 45 degree ground (nearer the camera), never more; facing the glass it stands
            # before his knee, lower by the kneel's reach (measured 10/25: 19 to 21 px for the car door, the crash bar and the
            # riot shield alike, whatever their width), never more than KNEEL_REACH
            near = D['props'][sh]['w'] / 2 * 57 * 0.7071 + 3
            for f, nm in ((0, 'S'), (2, 'E'), (6, 'W')):
                lp = prop(k, sh, 'SCover', 0, f, e)
                if lp is None: continue
                lb = lp[2] + np.nonzero(lp[0])[0].max()
                if not -3 <= lb - fy <= (KNEEL_REACH * 57 * 0.7071 + 3 if f == 0 else near):
                    out.append('%s %s in cover %s: its foot %+d px from his ground' % (k, sh, nm, lb - fy))
    return out


if 's1' in READY:
    gf = shield_faults(E)
    ok('G1 THE SHIELD ARM facing the glass: carried on his left across his front, RAISED TO HIS FACE TO BLOCK, planted on the ground in cover', not gf, gf[:4])
    sh0 = [p_ for p_ in props_of('s1') if D['props'][p_].get('shield')][0]
    ks = next((k for k in named if 's1' in E[k].get('layers', []) and sh0 in E[k].get('props', {}).get('by', {})), None)
    ok('G0 a named look carries the shield arm', bool(ks))
    if ks:
        ms = json.loads(json.dumps(E[ks]))
        ms['props']['by'][sh0]['SBlock']['k'][0][0] = ms['props']['by'][sh0]['SIdle']['k'][0][0]   # the block drawn as the carry: the shield never comes up
        ok('G2 MUTATION: a block that never raises the shield is caught', any('block' in x for x in shield_faults({ks: ms})))

# ---------------------------------------------------------------------------------------------------- T two hands
def two_faults(E, only=None):
    """in profile (E, W): THE LEAN sets the head down on the ground before him (its lowest pixel on his ground line, six pixels
    either way: it rests a hand's length nearer or further from the camera); THE TWO-HANDED WIND raises it over his crown"""
    out = []
    for k, e in E.items():
        if 'props' not in e or 't2' not in e.get('layers', []) or (only and k not in only): continue
        fx, fy = e['foot']
        for f, nm in ((2, 'E'), (6, 'W')):
            bm, bx, by = body(k, 'T2Idle', 0, f); ys = np.nonzero(bm)[0]; crown = by + ys.min()
            for p in [p_ for p_ in props_of('t2')]:
                ln = prop(k, p, 'T2Idle', 5, f, e); w = prop(k, p, 'T2Swing', 0, f, e)
                if ln is None or w is None: out.append('%s %s %s: hidden' % (k, p, nm)); continue
                lb = ln[2] + np.nonzero(ln[0])[0].max()
                if abs(lb - fy) > 6: out.append('%s %s lean %s: its head %+d px from his ground' % (k, p, nm, lb - fy))
                wt = w[2] + np.nonzero(w[0])[0].min()
                if wt > crown: out.append('%s %s two-handed wind %s: its top %d px under his crown' % (k, p, nm, wt - crown))
    return out


if 't2' in READY:
    tf2 = two_faults(E)
    ok('T1 TWO HANDS in profile: the lean sets its head on the ground before him, the two-handed wind raises it over his crown', not tf2, tf2[:4])
    kt = next((k for k in named if 't2' in E[k].get('layers', []) and props_of('t2')[0] in E[k].get('props', {}).get('by', {})), None)
    ok('T0 a named look carries the two-handed things', bool(kt))
    if kt:
        mt = json.loads(json.dumps(E[kt])); p0 = props_of('t2')[0]
        mt['props']['by'][p0]['T2Idle']['k'][5][2] = mt['props']['by'][p0]['T2Idle']['k'][0][2]   # the lean drawn as the carry: its head never set down
        ok('T2 MUTATION: a lean that never sets its head down is caught', any('lean E' in x for x in two_faults({kt: mt})))

# ---------------------------------------------------------------------------------------------------- W wired
t = open(os.path.join(ROOT, 'slices/BOHEMIA_FIGHT.html')).read()
blk = t[t.find('__WHAT_A_MAN_HOLDS__ (ANIMATION'):t.find('end __WHAT_A_MAN_HOLDS__')]
ok('W1 the fight (COMBAT\'s file) carries the melee draw inside the marked block and asks it first for a man with no gun',
   'function meleeDraw(' in blk and "fetch('rig_melee/rig_melee.json')" in blk and 'const md = meleeDraw(v, p, L, d, gs, ox, oy, s, now); if (md !== null) return md;' in blk
   and 'function meleeBody(' in blk and 'M.shield_over[DIR8[f]]' in blk and "how === 'T'" in blk)
if not QUICK:
    drv = r'''
const { open } = require(process.argv[2]);
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",deploy:false}' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length && HOLD.state === 2 && MELEE.state === 2, null, { timeout: 60000 });
  await p.waitForTimeout(6000);
  const set = await p.evaluate(() => {
    const S = FIGHT.S; let mel = S.units.filter(v => FIGHT.onField(v) && !v.beast && meleeProp(v) && (MELEE.meta.looks[lookOf(v)._key] || MELEE.meta.looks[lookOf(v).ref])), handed = null;
    if (!mel.length) {   /* nobody packed holds one on this board yet: a melee row off this board put in a packed man's hand (the bag's swap does it in play) */
      const w = (S.units.map(u => u.weapon).filter(x => x && meleeProp({ weapon: x }) && !meleeProp({ weapon: x })[1])[0] || DB.weapons.rows.filter(r => MELEE.meta.by_row[r.id])[0]);
      const v = S.units.filter(u => FIGHT.onField(u) && !u.beast && (MELEE.meta.looks[lookOf(u)._key] || MELEE.meta.looks[lookOf(u).ref]))[0];
      if (w && v) { v.weapon = w; v.shield = null; mel = [v]; handed = v.id + ' given ' + (w.of || w).id; }
    }
    const v = mel[0], foe = v && S.units.filter(u => u.side !== v.side && FIGHT.onField(u))[0];
    /* a swing on the beat, as the fight's own attack plays it */
    if (v && foe) UI.anim.unshift({ k: 'attack', at: performance.now(), dur: beatMs(), e: { id: v.id, to: foe.id, shot: false, hit: false } });
    window.__mel = v ? v.id : null;
    return { melee: mel.map(u => u.id + ':' + meleeProp(u) + ':' + lookOf(u)._key), swinger: v && v.id, handed: handed };
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
    print('  note W2 melee men %s (%s); the swinger %s; cover %s; drawn %s' % (len((R.get('set') or {}).get('melee') or []), (R.get('set') or {}).get('handed') or 'as dealt', (R.get('set') or {}).get('swinger'), (R.get('set') or {}).get('cover'), mel))
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
  const handed = await f.evaluate(() => {   /* as W2: when nobody packed holds one in this fight, a melee row of the fight in a packed man's hand */
    const S = FIGHT.S; if (S.units.some(v => FIGHT.onField(v) && !v.beast && meleeProp(v) && (MELEE.meta.looks[lookOf(v)._key] || MELEE.meta.looks[lookOf(v).ref]))) return null;
    const w = (S.units.map(u => u.weapon).filter(x => x && meleeProp({ weapon: x }) && !meleeProp({ weapon: x })[1])[0] || DB.weapons.rows.filter(r => MELEE.meta.by_row[r.id])[0]);
    const v = S.units.filter(u => FIGHT.onField(u) && !u.beast && (MELEE.meta.looks[lookOf(u)._key] || MELEE.meta.looks[lookOf(u).ref]))[0];
    if (w && v) { v.weapon = w; v.shield = null; return v.id + ' given ' + (w.of || w).id; } return 'nobody packed';
  });
  await d.page.waitForTimeout(8000);
  const a = await f.evaluate(() => ({ seen: Object.assign({}, UI.clipSeen), melee: FIGHT.S.units.filter(v => FIGHT.onField(v) && !v.beast && meleeProp(v)).map(v => v.id + ':' + meleeProp(v)) }));
  a.handed = handed;
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
    print('  note W3 the demo: a road fight %s; melee men %s (%s); drawn %s' % (R3.get('started'), a3.get('melee'), a3.get('handed') or 'as dealt', {k: v for k, v in s3.items() if k.startswith(('melee:', 'prop:'))}))
    ok('W3 IN THE DEMO (a road fight from the map, the fight inside the shell): the men with melee rows are drawn in the melee idle (standing, or down on a cover tile) with their things, no page error',
       R3.get('started') and (s3.get('melee:MIdle') or s3.get('melee:MCover')) and any(k.startswith('prop:') for k in s3) and not R3.get('errs') and not R3.get('err'), (R3.get('errs') or [R3.get('err')])[:2])
done()
