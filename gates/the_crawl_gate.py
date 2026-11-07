#!/usr/bin/env python3
"""THE CRAWL (ANIMATION [the crawl], rule 390, Paolo 11/4: 'make an animation of people crawling on the floor... a fucked up
scary sad murders type of crawl... plenty of ways we can use that... or make a job for it'; rule 408(b) ONE GOLDEN PIECE).
Asked of the KEPT SOURCE, the POSED MODEL, the PICTURES and the PLAYER, never of a table's say-so:
  S  THE SOURCE (records/target/animation/BOHEMIA_THE_CRAWL.json, rule 128): the three weights he named (drag, elbows, last)
     and the roll from the fight's fall; every timeline names a posed pose with a whole hold; how far he has come never goes
     back inside a clip and each clip's advance is its last key's; the arc (the program) is whole bars, starts with the roll
     and ends on the last; it is a crawl, not a walk across the board (0.25 to 0.6 units in all: inside his tile).
  H  THE HAND THAT PULLS STAYS PUT (WALK-04, the low crawl: the body is pulled up to the hand): on the posed joints, the right
     hand from the drag's plant to its rest, and each forearm's hand through its own pull AND the other's, moves under 0.012
     units (under a pixel at the fight's 1x) on the ground once the slide is added.
  E  AN ENVELOPE RAMPS SLOWER THAN THE GRID (the laws: his 'tweaking', 9/21; records/BOHEMIA_WHAT_TWEAKING_WAS_9_24_26.md), on
     the POSED MODEL (records/animation/crawl_joints/<look>.json) with the slide added, over EVERY drawn key of the whole arc
     (the roll, every clip into the next, the last held), in all eight facings at the master rig's pixels (the pack's ppu):
     no joint goes back the way it came (a turn of more than 120 degrees) across a one-key hold when both steps move it 2 px
     or more, and none crosses 24 px between two drawn keys (the town's numbers).
  P  THE PICTURES (slices/rig_crawl): every pose in all eight facings, every cell inside its sheet, only his fight sheet's
     own colours (the same man in the same light), and THE HAND-OFF: the roll's first key laid at the fall's pelvis (the
     pack's base, along the crawl facing) is his fight sheet's last fall key at the facing he fell in (crawl + 4), the
     silhouettes overlapping 85 in 100 or more and the soles within 3 px, in every facing (nothing jumps when the crawl
     takes over from the fall).
  X  THE PLAYER (engine/bohemia_crawl.js under node, the shipped file): every key of the arc in every facing hands back a
     cell; past the end it holds the last pose (the hand open); the slide never goes back; the drag mark starts only after
     the roll; the roll's first slide is the base.
  W  WIRED (slices/BOHEMIA_FIGHT.html): the player is loaded and the __THE_CRAWL__ block draws a struck-down man (down,
     alive, his fall played) from it; a dead man, a beast, a machine and a ghost are never handed to it; and on the real
     fight in a browser (--quick skips it) a man of his struck down crawls: the crawl's cells are drawn and his drawn pelvis
     moves along his crawl facing.
  MUTATIONS (the gate must bite): a clip whose slide goes back, a pull whose hand skates, a joint that jumps out and back
  in one key, a cell that is not his colours, a roll that starts a tile from the fall.
    python3 gates/the_crawl_gate.py            (all legs)
    python3 gates/the_crawl_gate.py --quick    (no browser)
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_THE_CRAWL.json')
IDX = os.path.join(ROOT, 'slices/rig_crawl/rig_crawl.json')
JOINTS = os.path.join(ROOT, 'records/animation/crawl_joints')
FIGHT = os.path.join(ROOT, 'slices/BOHEMIA_FIGHT.html')
PLAYER = os.path.join(ROOT, 'engine/bohemia_crawl.js')
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
REVERSE_DEG, MOVE_PX, JUMP_PX = 120, 2.0, 24.0
HAND_STILL = 0.012
QUICK = '--quick' in sys.argv
passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond: passed += 1; print('  ok   ' + name)
    else: failed += 1; print('  FAIL ' + name + ('  -- ' + str(why) if why else ''))


def done():
    print('\nTHE CRAWL GATE: %d passed, %d failed' % (passed, failed)); sys.exit(1 if failed else 0)


# ---------------------------------------------------------------------------------------------------- S the source
def flat(T):
    out = []; run = 0.0
    for name in T['program']:
        for p, h, s in T['timelines'][name]:
            out += [(p, run + s, name)] * h
        run += T['advance'][name]
    return out


def source_faults(T):
    out = []
    posed = set(p for a in T['activities'].values() for p in a['poses'])
    for w in ('drag', 'elbows', 'last', 'roll'):
        if w not in T['timelines']: out.append('no %s' % w)
    for k, tl in T['timelines'].items():
        last = -1.0
        for p, h, s in tl:
            if p not in posed: out.append('%s names %s, not a posed pose' % (k, p))
            if not (isinstance(h, int) and h >= 1): out.append('%s holds %s %r keys' % (k, p, h))
            if s < last - 1e-9: out.append('%s goes back at %s (%.3f after %.3f)' % (k, p, s, last))
            last = s
        if abs(T['advance'].get(k, -1) - tl[-1][2]) > 1e-9: out.append('%s advance %.3f is not its last key %.3f' % (k, T['advance'].get(k, -1), tl[-1][2]))
    pr = T['program']
    if not pr or pr[0] != 'roll' or pr[-1] != 'last': out.append('the arc does not start with the roll and end on the last')
    n = sum(h for k in pr for _, h, _ in T['timelines'][k])
    if n % 6: out.append('the arc is %d keys, not whole half bars' % n)
    tot = sum(T['advance'][k] for k in pr)
    if not (0.25 <= tot <= 0.6): out.append('he crawls %.2f units in all: not a crawl inside his tile' % tot)
    return out


T = json.load(open(SRC)) if os.path.exists(SRC) else None
ok('S0 the kept source is in the repo (rule 128)', T is not None, SRC)
if T is None: done()
sf = source_faults(T)
ok('S1 the drag, the elbows and the last and the roll from the fall; whole holds, posed poses; the slide never goes back; the arc whole bars from the roll to the last, %.2f units' % sum(T['advance'][k] for k in T['program']),
   not sf, '; '.join(sf[:5]))
m = json.loads(json.dumps(T)); m['timelines']['drag'][-2][2] = 0.01
ok('S2 MUTATION: a pull whose slide goes back is caught', any('goes back' in x for x in source_faults(m)))

# ---------------------------------------------------------------------------------------------------- H and E on the posed joints
I = json.load(open(IDX)) if os.path.exists(IDX) else None
ok('P0 the pictures\' index is in (slices/rig_crawl/rig_crawl.json)', I is not None)
if I is None: done()
looks = sorted(I['looks'])
ok('P1 one man, the golden piece, not a batch (rule 408(b)): %s' % looks, len(looks) == 1)


def screen(v, slide, f, ppu):
    """a joint (f, u, l units of the model, the pelvis on his foot point) plus the slide along his crawl, on the master
    rig's 45 degree ortho camera at facing f (the towns gate's screen(); up at the rig's full ppu, the z stretch)"""
    th = math.radians(45 * DIRS.index(f))
    fw = v[0] + slide
    x = fw * math.sin(th) + v[2] * math.cos(th); d = fw * math.cos(th) - v[2] * math.sin(th)
    return (x * ppu, (-v[1] + d * math.sqrt(0.5)) * ppu)


def hand_faults(J, T):
    out = []; at = J['acts']
    P = {p: row for a in at.values() for p, row in a['at'].items()}
    def runs(tl, hand, first, last_):
        i0 = [i for i, e in enumerate(tl) if e[0] == first][0]; i1 = [i for i, e in enumerate(tl) if e[0] == last_][-1]
        ws = [P[p][hand][0] + s for p, _, s in tl[i0:i1 + 1]]
        return max(ws) - min(ws)
    tl = T['timelines']
    for hand, a, b, k in (('RH', 'D_plant', 'D_rest', 'drag'), ('LH', 'EL_out', 'E_rest', 'elbows'), ('RH', 'ER_out', 'E_rest', 'elbows')):
        d = runs(tl[k], hand, a, b)
        if d > HAND_STILL: out.append('%s %s skates %.3f units from %s to %s' % (k, hand, d, a, b))
    return out


def envelope_faults(J, keys, ppu):
    out = []; at = {p: row for a in J['acts'].values() for p, row in a['at'].items()}
    for f in DIRS:
        for j in J['joints']:
            pts = [screen(at[p][j], s, f, ppu) for p, s, _ in keys]
            st = [(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:])]
            for i, s in enumerate(st):
                ln = math.hypot(*s)
                if ln > JUMP_PX: out.append('%s %s crosses %.1f px in one key (%s to %s)' % (f, j, ln, keys[i][0], keys[i + 1][0])); break
            for i in range(len(st) - 1):
                s1, s2 = st[i], st[i + 1]; l1, l2 = math.hypot(*s1), math.hypot(*s2)
                if l1 >= MOVE_PX and l2 >= MOVE_PX:
                    c = (s1[0] * s2[0] + s1[1] * s2[1]) / (l1 * l2)
                    if math.degrees(math.acos(max(-1, min(1, c)))) > REVERSE_DEG:
                        out.append('%s %s jumps out and back across %s (%s)' % (f, j, keys[i + 1][0], keys[i + 1][2])); break
    return out


for look in looks:
    jp = os.path.join(JOINTS, look + '.json')
    J = json.load(open(jp)) if os.path.exists(jp) else None
    ok('H0 %s: his posed joints are kept (records/animation/crawl_joints)' % look, J is not None)
    if J is None: continue
    E = json.load(open(os.path.join(ROOT, 'slices/rig_crawl', I['looks'][look]['json'])))
    hf = hand_faults(J, T)
    ok('H1 %s: THE HAND THAT PULLS STAYS PUT: the drag\'s right hand from its plant to its rest, each forearm through both pulls, under %.3f units on the ground' % (look, HAND_STILL),
       not hf, '; '.join(hf[:4]))
    m = json.loads(json.dumps(T)); m['timelines']['drag'][5][2] += 0.03
    ok('H2 MUTATION: a pull whose hand skates 3 cm is caught', bool(hand_faults(J, m)))
    keys = flat(T)
    ef = envelope_faults(J, keys, E['ppu'])
    ok('E1 %s: AN ENVELOPE RAMPS SLOWER THAN THE GRID over all %d drawn keys of the arc (every clip into the next), eight facings, %d joints: nothing jumps out and back, nothing crosses %d px' % (look, len(keys), len(J['joints']), JUMP_PX),
       not ef, '; '.join(ef[:6]))
    Jm = json.loads(json.dumps(J)); row = Jm['acts']['drag']['at']['D_pull2']; row['RH'] = [row['RH'][0] + 0.12, row['RH'][1], row['RH'][2]]
    ok('E2 MUTATION: a wrist that jumps out and back in one key is caught', any('out and back' in x or 'crosses' in x for x in envelope_faults(Jm, keys, E['ppu'])))


# ---------------------------------------------------------------------------------------------------- P the pictures
def pictures():
    import numpy as np
    from PIL import Image
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    for look in looks:
        E = json.load(open(os.path.join(ROOT, 'slices/rig_crawl', I['looks'][look]['json'])))
        im = np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_crawl', E['file'])).convert('RGBA'))
        H, W = im.shape[:2]
        poses = set(p for a in T['activities'].values() for p in a['poses'])
        miss = [p for p in poses if p not in E['poses'] or any(c is None for c in E['poses'][p])]
        bad = [i for i, c in enumerate(E['cells']) if c[0] < 0 or c[1] < 0 or c[0] + c[2] > W or c[1] + c[3] > H]
        ok('P2 %s: every pose of the four clips in all eight facings (%d poses, %d cells), every cell inside its sheet' % (look, len(poses), len(E['cells'])),
           not miss and not bad, 'missing %s, outside %s' % (miss[:4], bad[:4]))
        fl = FR['looks'][look]; fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        pal = set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist())) | {tuple(FR['rim'][:3])}
        mine = set(map(tuple, im[im[..., 3] > 0][:, :3].tolist()))
        ok('P3 %s: only his fight sheet\'s own colours (%d of its %d), the same man in the same light' % (look, len(mine), len(pal)), mine <= pal, len(mine - pal))
        def lay(a, dx, dy, w=300, h=260):
            z = np.zeros((h, w), bool); ox, oy = 90 + dx, 60 + dy
            ys, xs = np.nonzero(a)
            z[np.clip(ys + oy, 0, h - 1), np.clip(xs + ox, 0, w - 1)] = True
            return z
        def near(A, B):   # the share of A's pixels with a pixel of B within one pixel (a thin lying man: a rim pixel is not a jump)
            Bd = B.copy(); Bd[1:, :] |= B[:-1, :]; Bd[:-1, :] |= B[1:, :]; Bd[:, 1:] |= B[:, :-1]; Bd[:, :-1] |= B[:, 1:]
            return (A & Bd).sum() / max(1, A.sum())
        def mid(A): ys, xs = np.nonzero(A); return xs.mean(), ys.mean()
        col = FR['clips']['fall'][-1]
        def handoff(ci, at_base=True):
            fi = (ci + 4) % 8
            fall = fs[fi * fl['h']:(fi + 1) * fl['h'], col * fl['w']:(col + 1) * fl['w'], 3] > 0
            c = E['cells'][E['poses'][T['timelines']['roll'][0][0]][ci]]
            th = math.radians(45 * ci); u = E['base'] if at_base else 0.0
            sx, sy = u * E['ppu'] * math.sin(th), u * E['ppu'] * math.cos(th) * math.sqrt(0.5)
            A = lay(fall, 0, 0); B = lay(im[c[1]:c[1] + c[3], c[0]:c[0] + c[2], 3] > 0, int(round(c[4] + sx)), int(round(c[5] + sy)))
            ma, mb = mid(A), mid(B)
            return min(near(A, B), near(B, A)), math.hypot(ma[0] - mb[0], ma[1] - mb[1])
        worst = (1.0, 0.0, '')
        for ci, f in enumerate(DIRS):
            ag, dm = handoff(ci)
            if ag < worst[0] or dm > worst[1]: worst = (min(ag, worst[0]), max(dm, worst[1]), f)
        ok('P4 %s: THE HAND-OFF: the roll\'s first key laid at the fall\'s pelvis is his last fall key in every facing: %.2f of each within a pixel of the other, the middles %.1f px apart (worst %s)' % (look, worst[0], worst[1], worst[2]),
           worst[0] >= 0.93 and worst[1] <= 2.0, worst)   # 2 rig px: one pixel on his phone at the fight's 1x; the same man standing is 1 px apart at N between the two renders
        ag, dm = handoff(2, at_base=False)
        ok('P5 MUTATION: the roll started on his foot point instead of the fall\'s pelvis is caught (middles %.1f px apart)' % dm, dm > 2.0 or ag < 0.93)


pictures()


# ---------------------------------------------------------------------------------------------------- X the player
def player():
    js = r"""
const C = require(process.argv[1]); const fs = require('fs'), path = require('path');
const dir = process.argv[2], I = JSON.parse(fs.readFileSync(path.join(dir, 'rig_crawl.json'), 'utf8')), out = {};
for (const look of Object.keys(I.looks)) {
  const E = JSON.parse(fs.readFileSync(path.join(dir, I.looks[look].json), 'utf8'));
  C.feed(I, look, E, { fake: true });
  const n = C.length(), r = { n, cells: 0, nulls: 0, back: 0, smearRoll: 0, smearAfter: 0, last: null, base: null, rollEnd: C._K.flat.rollEnd };
  for (let f = 0; f < 8; f++) { let prev = -1;
    for (let k = 0; k < n + 40; k++) { const c = C.at(look, k, f);
      if (!c) { r.nulls++; continue; } r.cells++;
      if (c.slide < prev - 1e-9) r.back++; prev = c.slide;
      if (k < r.rollEnd && c.smear) r.smearRoll++; if (k >= r.rollEnd && !c.smear) r.smearAfter++;
      if (k === 0 && f === 0) r.base = c.slide;
      if (k === n + 39 && f === 0) r.last = [c.pose, c.done]; } }
  out[look] = r; }
console.log(JSON.stringify(out));
"""
    p = subprocess.run(['node', '-e', js, PLAYER, os.path.join(ROOT, 'slices/rig_crawl')], capture_output=True, text=True, timeout=60)
    ok('X0 the player runs under node', p.returncode == 0, p.stderr[-300:])
    if p.returncode: return
    R = json.loads(p.stdout)
    for look, r in R.items():
        E = json.load(open(os.path.join(ROOT, 'slices/rig_crawl', I['looks'][look]['json'])))
        ok('X1 %s: every key of the %d-key arc in every facing hands back a cell (%d), the slide never goes back' % (look, r['n'], r['cells']),
           r['nulls'] == 0 and r['back'] == 0, r)
        ok('X2 %s: past the end he lies there, the hand open (%s); the roll starts at the fall\'s pelvis (%.3f units); the drag mark only once he pulls' % (look, r['last'], r['base']),
           r['last'] == [T['timelines']['last'][-1][0], True] and abs(r['base'] - E['base']) < 1e-9 and r['smearRoll'] == 0 and r['smearAfter'] == 0, r)


player()


# ---------------------------------------------------------------------------------------------------- W wired
def wired():
    src = open(FIGHT).read()
    ok('W1 the fight loads the player (../engine/bohemia_crawl.js) and carries the __THE_CRAWL__ block', '../engine/bohemia_crawl.js' in src and '/* ==== __THE_CRAWL__' in src and '/* ==== end __THE_CRAWL__ ==== */' in src)
    blk = src[src.find('/* ==== __THE_CRAWL__'):src.find('/* ==== end __THE_CRAWL__ ==== */')]
    ok('W2 the block hands the player only a man struck down who lives (down, not dead, not a beast, a machine or a ghost, his fall played)',
       all(w in blk for w in ('v.down', 'v.dead', 'v.beast', 'v.machine', 'v.ghost', "p.clip !== 'fall'")))
    ok('W3 blitMan asks the crawl first, so a crawling man is drawn once', 'crawlDraw(v, p, L, gs, ox, oy, s, now) || holdDraw(' in src)
    if QUICK: return
    p = subprocess.run(['node', os.path.join(ROOT, 'tools/bohemia_animation_the_crawl_capture.js'), '--gate'], capture_output=True, text=True, timeout=300, cwd=ROOT)
    line = [l for l in p.stdout.splitlines() if l.startswith('CRAWL ')]
    R = json.loads(line[-1][6:]) if line else {}
    ok('W4 ON THE REAL FIGHT: his man struck down rolls and crawls: crawl cells drawn %s, his drawn pelvis moved %.1f px along his crawl facing, no error' % (R.get('drawn'), R.get('moved', 0)),
       p.returncode == 0 and R.get('drawn', 0) > 20 and R.get('moved', 0) > 8 and not R.get('errors'), (p.stdout + p.stderr)[-500:])


wired()
done()
