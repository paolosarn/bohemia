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
  R  THE ROLLED PEOPLE (RUN TWO's 152, the settlement's keepers and crowd, the map's parties and crowds): every one packed
     matched the still the screens draw (silhouette 0.98, colour step 4: the same build), has every bare pose in all eight
     facings in 64 colours or fewer, stands with his soles where his still's are in every facing (two pixels), and on the
     map stands where his still is on RUN TWO's own map sheet (soles two pixels, crown six). How many of the 152 have
     theirs is printed; on the real settlement, everybody whose look has idles is idling.
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
RI = os.path.dirname(IDX)
for k in list(I['looks']): I['looks'][k] = json.load(open(os.path.join(RI, I['looks'][k]['json'])))   # each look's cells, its own file
if I.get('map'): I['map'] = json.load(open(os.path.join(RI, I['map']['json'])))
F = json.load(open(FR))
men = [k for k, v in F['looks'].items() if v.get('kind') != 'beast']
PEOPLE = [k for k, v in I['looks'].items() if v.get('person')]   # RUN TWO's rolled people (no fight cell of their own)
beasts = [k for k, v in F['looks'].items() if v.get('kind') == 'beast']
FPEOPLE = [k for k in men if F['looks'][k].get('kind') == 'person']   # RUN TWO's rolled men on the board: rendered in batches
men = [k for k in men if k not in FPEOPLE]
miss = [k for k in men + beasts if k not in I['looks']]
ok('P1 every man and every beast the fight dresses has his idles (%d men, %d beasts)' % (len(men), len(beasts)), not miss, 'missing: ' + ', '.join(miss))
FIGHTP = [k for k in I['looks'] if k.startswith('fight_person_')]
print('  note P1b %d of the %d rolled men on the fight\'s board have their idles with their guns (the rest stand as their still until theirs are in)' % (len(FIGHTP), len(FPEOPLE)))
bad_ref = [k for k in FIGHTP if I['looks'][k].get('person_of') not in FPEOPLE or I['looks'][k].get('foot') != F['looks'][I['looks'][k]['person_of']]['foot']]
ok('P1c every rolled fight man\'s idles sit in his own fight cell (his foot on the fight sheet\'s)', not bad_ref, bad_ref[:4])
holes = []
for k, L in I['looks'].items():
    sets = ('beast',) if F['looks'].get(k, {}).get('kind') == 'beast' else ('bare',) if L.get('person') else ('bare', 'carry')
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
        for s in [x for x in ('bare', 'carry') if x in L['poses']]:
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
    if L.get('person_of'):   # a rolled fight man: his gun-held pictures in his fight sheet's colours (his bare ones are his street sheet's)
        fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', F['looks'][L['person_of']]['file'])).convert('RGBA'))
        have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist())) | {tuple(F['rim'][:3])}
        a = sheet(L['sheets']['carry']['file']); extra = set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())) - have
        if extra: pal_bad.append('%s +%d colours' % (k, len(extra)))
        continue
    if L.get('person'):   # no fight sheet: his own 64 (the fight sheet's count)
        a = sheet(L['sheets']['bare']['file']); n = len(set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())))
        if n > 64: pal_bad.append('%s %d colours' % (k, n))
        continue
    fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', F['looks'][k]['file'])).convert('RGBA'))
    have = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist()))
    mine = set()
    for Sh in L['sheets'].values(): a = sheet(Sh['file']); mine |= set(map(tuple, a[a[..., 3] > 0][:, :3].tolist()))
    extra = mine - have
    if extra: pal_bad.append('%s +%d colours' % (k, len(extra)))
ok('C3 every idle wears his own fight sheet\'s colours, not one more (a rolled person: 64 of his own at most)', not pal_bad, pal_bad[:4])

# ---------------------------------------------------------------------------------------------------- F the feet
def soles(L, s, p, f):
    """the lowest painted row of every column, in the fight cell's frame"""
    a, c = cell(L, s, p, f); op = a[..., 3] > 0; out = {}
    for x in range(op.shape[1]):
        ys = np.nonzero(op[:, x])[0]
        if len(ys): out[c[4] + x] = c[5] + ys.max()
    return out


def feet_faults(I, looks):
    """THE SOLES, column by column: among the columns where standing square and the pose both paint the bottom eight
    rows, a quarter or more moving over two pixels is a man floating, sinking or skating (a club swinging below his feet
    moves three columns, his two feet are twenty)"""
    out = []
    for k in looks:
        L = I['looks'][k]
        for f in range(8):
            C = soles(L, 'bare', 'C', f); band = max(C.values()) - 8
            for s in [x for x in ('bare', 'carry') if x in L['poses']]:
                for p in D['sets'][s]['poses']:
                    P = soles(L, s, p, f)
                    shared = [x for x in C if C[x] >= band and P.get(x, -1) >= band]
                    moved = [x for x in shared if abs(P[x] - C[x]) > 2]
                    lim = 0.6 if L.get('held') else 0.25   # a weapon modelled in his fist swings through the sole band (the thug's pipe: 11 of 19 columns on roll_back, his feet untouched, looked at 10/23)
                    if len(shared) < 4 or len(moved) > len(shared) * lim:
                        out.append('%s %s %s %s: %d of %d sole columns moved' % (k, s, p, I['dirs'][f], len(moved), len(shared)))
    return out


feet_bad = feet_faults(I, [k for k in men if k in I['looks']] + PEOPLE + FIGHTP)
held = ['%s (%s)' % (k, ', '.join(I['looks'][k]['held'])) for k in men if k in I['looks'] and I['looks'][k].get('held')]
if held: print('  note F1 holds a weapon in his fist, so its swing below the soles is allowed up to 60 percent of the columns: ' + '; '.join(held))
ok('F1 his soles stay on his ground line in every pose and facing (two pixels): nobody floats, sinks or skates', not feet_bad, '; '.join(feet_bad[:5]))
mf = json.loads(json.dumps(I)); kf = [k for k in men if k in mf['looks']][0]; Lf = mf['looks'][kf]
for i in Lf['poses']['bare']['lookL']: Lf['sheets']['bare']['cells'][i][5] += 4   # one pose sunk four pixels in every facing
ok('F2 MUTATION: a man sunk four pixels into the ground in one pose is caught', any('lookL' in x for x in feet_faults(mf, [kf])))

# ---------------------------------------------------------------------------------------------------- M the map
Mp = I.get('map')
ok('M1 the map carries idles for its own models', bool(Mp and Mp['looks']), 'no map block')
if Mp:
    bad = [k for k, v in Mp['looks'].items() if v['match'][0] < 0.9 or v['match'][1] > 28]
    ok('M2 every map look matched the picture the map already draws (silhouette 0.9, colour step 28)', not bad, bad)
    MS = {}
    def map_faults(Mp):
        """THE MAP'S FRAME: standing square, his idle is laid in the map's own cut (rigSheetSet: the cell's middle on the 112
        frame's middle, its foot at 0.93 of the frame) exactly where his still is: the soles on the still's soles (two
        pixels), the crown at the still's crown (six: a hat, a breath), every facing (his head was once cut off, 10/23)"""
        out = []
        atlas = np.asarray(Image.open(os.path.join(RI, Mp['file'])).convert('RGBA'))
        for look, v in Mp['looks'].items():
            fn = 'BOHEMIA_RIG_PEOPLE' if v['sheet'] == 'people' else 'BOHEMIA_RIG_CAST'
            if fn not in MS: MS[fn] = (json.load(open(os.path.join(ROOT, 'slices', fn + '.json'))), np.asarray(Image.open(os.path.join(ROOT, 'slices', fn + '.png')).convert('RGBA')))
            m, sh = MS[fn]; H = 130
            while round(H * 0.93) < m['foot']: H += 1
            for f in range(8):
                row = m['gangs'].index(look) * 8 + f; st = sh[row * m['h']:(row + 1) * m['h'], :m['w']]
                ys = np.nonzero(st[..., 3] > 0)[0]; top, bot = ys.min() + round(H * 0.93) - m['foot'], ys.max() + round(H * 0.93) - m['foot']
                q = Mp['cells'][v['poses']['C'][f]]; c = atlas[q[1]:q[1] + q[3], q[0]:q[0] + q[2]]; yc = np.nonzero(c[..., 3] > 0)[0]
                y0 = round(H * 0.93) - m['foot'] + q[5]
                if y0 + yc.min() < 0: out.append('%s %s: his crown is %d px above the map\'s frame' % (look, I['dirs'][f], -(y0 + yc.min())))
                if abs(y0 + yc.max() - bot) > 2 or abs(y0 + yc.min() - top) > 6:
                    out.append('%s %s: soles %+d, crown %+d against his still' % (look, I['dirs'][f], y0 + yc.max() - bot, y0 + yc.min() - top))
        return out
    mf_ = map_faults(Mp)
    ok('M3 standing on the map, every idle is where his still is in the map\'s own frame (soles two pixels, crown six), every facing', not mf_, '; '.join(mf_[:4]))
    mm = json.loads(json.dumps(Mp)); l0 = list(mm['looks'])[0]
    for i in mm['looks'][l0]['poses']['C']: mm['cells'][i][5] -= 24
    ok('M4 MUTATION: a map idle laid 24 px high (the cut-off head of 10/23) is caught', any(l0 in x for x in map_faults(mm)))

# ---------------------------------------------------------------------------------------------------- R the rolled people
ROLL = json.load(open(os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')))
print('  note R0 %d of the %d rolled people have their idles (the rest stand as their still until theirs are rendered)' % (len(PEOPLE), len(ROLL)))
if PEOPLE:
    bad = [k for k in PEOPLE if I['looks'][k]['match'][0] < 0.98 or I['looks'][k]['match'][1] > 4]
    ok('R1 every rolled person packed is the man the screens draw (his Stand against his still: silhouette 0.98, colour step 4)', not bad, bad[:4])
    def still_feet_faults(I, looks):
        """standing square, his soles are where his still's are, facing by facing (the row under his lowest painted pixel)"""
        out = []
        for k in looks:
            L = I['looks'][k]
            for f in range(8):
                a, c = cell(L, 'bare', 'C', f); ys = np.nonzero(a[..., 3] > 0)[0]
                if abs(c[5] + ys.max() + 1 - L['feet'][f][1]) > 2: out.append('%s %s: soles %+d against his still' % (k, I['dirs'][f], c[5] + ys.max() + 1 - L['feet'][f][1]))
        return out
    sf = still_feet_faults(I, PEOPLE)
    ok('R2 standing square, every rolled man\'s soles are on his still\'s soles, every facing (two pixels)', not sf, '; '.join(sf[:4]))
    ms = json.loads(json.dumps(I)); kp = PEOPLE[0]
    for i in ms['looks'][kp]['poses']['bare']['C']: ms['looks'][kp]['sheets']['bare']['cells'][i][5] += 5
    ok('R3 MUTATION: a rolled man laid five pixels low is caught', any(kp in x for x in still_feet_faults(ms, [kp])))
    MPp = json.load(open(os.path.join(RI, I['map_people']['json']))) if I.get('map_people') else None
    MX = {}
    def mix_faults(MPp):
        """on the map: in RUN TWO's own map sheet's cut (the same rigSheetSet), his idle standing square is where his still is"""
        out = []
        for look, v in MPp['looks'].items():
            n = v['mix']
            if n not in MX: MX[n] = (json.load(open(os.path.join(ROOT, 'slices/rig_mix', n + '.json'))), np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_mix', n + '.png')).convert('RGBA')))
            m, sh = MX[n]; H = 130
            while round(H * 0.93) < m['foot']: H += 1
            atlas = SHEETS.get(v['file']) if v['file'] in SHEETS else sheet(v['file'])
            for f in range(8):
                row = m['gangs'].index(look) * len(m['dirs']) + f; st = sh[row * m['h']:(row + 1) * m['h'], :m['w']]
                ys = np.nonzero(st[..., 3] > 0)[0]; top_, bot = ys.min(), ys.max()
                q = MPp['files'][v['file']][v['poses']['C'][f]]; c = atlas[q[1]:q[1] + q[3], q[0]:q[0] + q[2]]; yc = np.nonzero(c[..., 3] > 0)[0]
                if abs(q[5] + yc.max() - bot) > 2 or abs(q[5] + yc.min() - top_) > 6:
                    out.append('%s %s: soles %+d, crown %+d against his map still' % (look, I['dirs'][f], q[5] + yc.max() - bot, q[5] + yc.min() - top_))
        return out
    ok('R4 the map carries the rolled people who have idles', bool(MPp and MPp['looks']), 'no map_people block')
    if MPp and MPp['looks']:
        mx = mix_faults(MPp)
        ok('R5 standing on the map, every rolled man\'s idle is where his still is on RUN TWO\'s own map sheet (soles two pixels, crown six), every facing', not mx, '; '.join(mx[:4]))
        mm2 = json.loads(json.dumps(MPp)); l1 = list(mm2['looks'])[0]; v1 = mm2['looks'][l1]
        for i in v1['poses']['C']: mm2['files'][v1['file']][i][5] -= 24
        ok('R6 MUTATION: a rolled man laid 24 px high on the map is caught', any(l1 in x for x in mix_faults(mm2)))

# ---------------------------------------------------------------------------------------------------- K the work (rule 131)
WK = D.get('work')
ok('K0 the work clips\' kept source is in the repo (rule 131: hauling batteries, carrying crates, fixing a wall, sweeping, dragging scrap, a guard\'s round)',
   bool(WK) and {'battery', 'crate', 'hammer', 'broom', 'scrap', 'guard'} <= set(WK['jobs']), WK and sorted(WK['jobs']))


def work_faults(WK):
    """a stop's loop is whole beats (three keys each) so it comes round on the beat; every pose it names is the job's; two
    sides of a swing never touch; the hammer lands at the top of a beat; every gang (and the places' people) has jobs"""
    out = []
    pairs = [set(p) for p in WK.get('never_adjacent', [])]
    for j, J in WK['jobs'].items():
        tl = J['timeline']; n = sum(k for _, k in tl)
        if n % 3: out.append('%s loops in %d keys, not whole beats' % (j, n))
        miss = [p for p, _ in tl if p not in J['poses']]
        if miss: out.append('%s names %s' % (j, miss))
        if J['prop'] not in WK['props']: out.append('%s carries %s, never modelled' % (j, J['prop']))
        seq = [p for p, k in tl for _ in range(k)]
        for a, b in zip(seq, seq[1:] + seq[:1]):
            if {a, b} in pairs: out.append('%s goes %s to %s in one key' % (j, a, b))
    hm = WK['jobs'].get('hammer')
    if hm:
        seq = [p for p, k in hm['timeline'] for _ in range(k)]
        if 'strike' not in seq or seq.index('strike') % 3: out.append('the hammer lands off the beat (key %s)' % (seq.index('strike') if 'strike' in seq else None))
    for g in ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless', 'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers', 'body']:
        if not [x for x in WK['by_gang'].get(g, []) if x in WK['jobs']]: out.append('%s has no job' % g)
    return out


if WK:
    wf = work_faults(WK)
    ok('K1 every stop loops in whole beats, names its own poses, never swings side to side in one key, the hammer lands on the beat, every gang has work', not wf, '; '.join(wf[:4]))
    mw = json.loads(json.dumps(WK)); mw['jobs']['hammer']['timeline'] = [['raise', 2], ['strike', 2], ['after', 2]]
    ok('K2 MUTATION: a hammer that lands a key early is caught', any('off the beat' in x for x in work_faults(mw)))
    RW = os.path.join(ROOT, 'slices/rig_walk')
    sheets = {}
    for fn in sorted(os.listdir(RW)):
        if fn.endswith('.json'):
            m = json.load(open(os.path.join(RW, fn)))
            if m.get('work'): sheets[fn[:-5]] = m
    print('  note K3 %d of the walkers carry their work' % len(sheets))

    def sheet_faults(sheets, shown=('S', 'N')):
        """on each walker's own sheet: the columns the json names are there; the carrying walk is not his plain walk (the
        thing is in his hands, in the pixels); every work pose is a picture of its own; and at the stop, in the turns a stop
        faces, his soles are where his still's are, column by column"""
        out = []
        for look, m in sheets.items():
            a = np.asarray(Image.open(os.path.join(RW, look + '.png')).convert('RGBA'))
            def cellp(r, c): return a[r * m['h']:(r + 1) * m['h'], c * m['w']:(c + 1) * m['w']]
            if max(m['work'] + m['walk']) >= m['cols'] or len(m['walk']) != 6: out.append('%s names a column it does not have' % look); continue
            if m.get('job') not in WK['jobs']: out.append('%s has no job' % look)
            for t in shown:
                r = m['dirs'].index(t)
                for k in range(6):
                    d = int((np.abs(cellp(r, m['walk'][k]).astype(int) - cellp(r, m['walk_plain'][k]).astype(int)).max(2) > 0).sum())
                    if d < 40: out.append('%s %s walk key %d carries nothing (%d px)' % (look, t, k, d))
                still = cellp(r, m['still'])
                op = still[..., 3] > 0; band = m['foot'] - 8
                sole = {x: np.nonzero(op[:, x])[0].max() for x in range(op.shape[1]) if op[:, x].any() and np.nonzero(op[:, x])[0].max() >= band}
                for c in sorted(set(m['work'])):
                    P = cellp(r, c); opp = P[..., 3] > 0
                    if int((np.abs(P.astype(int) - still.astype(int)).max(2) > 0).sum()) < 12: out.append('%s %s work column %d is his still' % (look, t, c))
                    # a sole column moved when it lifts or empties; one painted LOWER is the thing he set down in front of his
                    # feet (the battery on the ground, seen from the front), not a foot
                    moved = [x for x in sole if not opp[:, x].any() or np.nonzero(opp[:, x])[0].max() < sole[x] - 2]
                    if len(sole) < 4 or len(moved) > len(sole) * 0.4:
                        out.append('%s %s work column %d: %d of %d sole columns moved' % (look, t, c, len(moved), len(sole)))
        return out
    if sheets:
        sf_ = sheet_faults(sheets)
        ok('K4 on every walker\'s own sheet: the named columns are there, the carrying walk carries the thing, every work pose is its own picture, the feet stay planted at the stop', not sf_, '; '.join(sf_[:4]))
        l0 = list(sheets)[0]; ms_ = json.loads(json.dumps({l0: sheets[l0]})); ms_[l0]['walk'] = list(ms_[l0]['walk_plain'])
        ok('K5 MUTATION: a walker whose carrying walk is his plain walk is caught', any('carries nothing' in x for x in sheet_faults(ms_)))

# ---------------------------------------------------------------------------------------------------- X the player
PLAYER = r'''
const fs = require('fs'), path = require('path'), D = path.dirname(process.argv[2]);
global.window = { BOHEMIA_IDLES_BASE: 'x/' };
global.fetch = (u) => Promise.resolve({ ok: true, json: () => JSON.parse(fs.readFileSync(path.join(D, u.replace(/^x\//, '')))) });
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
    # W3 THE REAL SETTLEMENT (RUN TWO's screen, his phone's profile): places are opened until one deals a keeper or a man in
    # the crowd whose look has idles; every such man is idling there, over eight seconds he shows two kinds or more, and the
    # screen throws nothing
    drv3 = r'''
const fs = require('fs'), path = require('path'), http = require('http'), ROOT = process.argv[2];
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
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaIdles && BohemiaIdles.ready(), null, { timeout: 60000 });
  let found = null;
  for (let i = 0; i < 300 && !found; i++) {
    await p.evaluate(nm => BohemiaSettlement.open({ place: { tier: 'town', name: nm }, traits: [], night: false }), 'Idle ' + i);
    const h = await p.evaluate(() => BohemiaSettlement.folk().map((x, j) => ({ j: j, look: x.look })).filter(x => BohemiaIdles.meta().looks[x.look]));
    if (h.length) found = h;
  }
  const kinds = {};
  if (found) for (let t = 0; t < 8; t++) { await p.waitForTimeout(1000);
    const r = await p.evaluate(js => js.map(j => BohemiaSettlement.folk()[j].idle || null), found.map(x => x.j));
    r.forEach((k, i) => { (kinds[found[i].look] = kinds[found[i].look] || {}); if (k) kinds[found[i].look][k] = 1; }); }
  console.log(JSON.stringify({ found: found, kinds: kinds, errs: errs }));
  await b.close(); srv.close(); process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
    if PEOPLE:
        js3 = os.path.join(ROOT, 'gates', '.everybody_idles_settle.js'); open(js3, 'w').write(drv3)
        try:
            r3 = subprocess.run(['node', js3, ROOT], capture_output=True, text=True, timeout=400, cwd=ROOT)
        finally:
            os.remove(js3)
        l3 = [l for l in r3.stdout.splitlines() if l.startswith('{')]
        R3 = json.loads(l3[-1]) if l3 else {'err': r3.stdout[-300:] + r3.stderr[-300:]}
        K = R3.get('kinds') or {}
        lazy = [k for k in K if len(K[k]) < 2]
        # W4 THE REAL MAP (the demo, booted): every rolled man the map carries idles for, laid on his own map sheet the way the
        # map lays him (rigSheetSet, mapIdleFrame), stands as an idle picture that changes over eight seconds
        drv4 = r'''
const drive = require(process.argv[2]);
(async () => {
  const d = await drive.open({ keepCards: true }), fr = d.fr, errs = [];
  d.page.on('pageerror', e => errs.push(String(e)));
  await fr.waitForFunction(() => typeof PARTIES !== 'undefined' && !!PARTIES && window.BohemiaIdles && BohemiaIdles.ready() && BohemiaIdles.mapPeople(), null, { timeout: 90000 });
  const looks = await fr.evaluate(() => { const M = BohemiaIdles.mapPeople(); Object.values(M.looks).forEach(v => { const S = RIG_MIX.sheets[v.mix] || (RIG_MIX.sheets[v.mix] = { state: 0, meta: null, img: null, sets: {}, drew: 0 }); rigSheetLoad(S, 'rig_mix/' + v.mix); }); return Object.keys(M.looks); });
  await fr.waitForFunction(() => Object.values(BohemiaIdles.mapPeople().looks).every(v => RIG_MIX.sheets[v.mix].state === 2), null, { timeout: 60000 }).catch(() => {});
  await fr.waitForFunction(() => { const M = BohemiaIdles.mapPeople(); return Object.keys(M.looks).every(k => { const S = RIG_MIX.sheets[M.looks[k].mix], set = S && S.state === 2 && rigSheetSet(S, k); return set && mapIdleFrame(set, 'S', 0, set.S.idle); }); }, null, { timeout: 60000 }).catch(() => {});
  const seen = {};
  for (let t = 0; t < 8; t++) {
    const r = await fr.evaluate(() => { const M = BohemiaIdles.mapPeople(), out = {};
      for (const k in M.looks) { const S = RIG_MIX.sheets[M.looks[k].mix], set = S && S.state === 2 && rigSheetSet(S, k); if (!set) { out[k] = 'nosheet'; continue; }
        const c = mapIdleFrame(set, 'S', 0, set.S.idle); if (!c) { out[k] = null; continue; }
        const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 3; i < x.length; i += 4) if (x[i]) h = (h * 31 + i) >>> 0; out[k] = String(h); }
      return out; });
    for (const k in r) { (seen[k] = seen[k] || {}); seen[k][r[k]] = 1; }
    await d.page.waitForTimeout(1000);
  }
  console.log(JSON.stringify({ looks: looks.length, seen: seen, errs: errs }));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ err: String(e) })); process.exit(0); });
'''
        js4 = os.path.join(ROOT, 'gates', '.everybody_idles_map.js'); open(js4, 'w').write(drv4)
        try:
            r4 = subprocess.run(['node', js4, os.path.join(ROOT, 'tools/bohemia_drive_the_demo.js')], capture_output=True, text=True, timeout=400, cwd=ROOT)
        finally:
            os.remove(js4)
        l4 = [l for l in r4.stdout.splitlines() if l.startswith('{')]
        R4 = json.loads(l4[-1]) if l4 else {'err': r4.stdout[-300:] + r4.stderr[-300:]}
        S4 = R4.get('seen') or {}
        flat = [k for k, v in S4.items() if 'null' in v or 'nosheet' in v or len(v) < 2]
        ok('W4 on the real map, every rolled man it carries idles for stands as his idle on his own map sheet and moves over eight seconds, no page error',
           S4 and not flat and not R4.get('errs') and not R4.get('err'), 'looks %s, still or missing %s, errors %s' % (R4.get('looks'), flat[:4], (R4.get('errs') or [R4.get('err')])[:2]))
        ok('W3 on the real settlement, every keeper and man in the crowd whose look has idles is idling (two kinds or more in eight seconds), no page error',
           R3.get('found') and not lazy and not R3.get('errs') and not R3.get('err'),
           'found %s, kinds %s, errors %s' % (bool(R3.get('found')), {k: sorted(v) for k, v in K.items()}, (R3.get('errs') or [R3.get('err')])[:2]))
done()
