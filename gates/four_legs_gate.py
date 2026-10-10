#!/usr/bin/env python3
"""FOUR LEGS (ANIMATION [four legs], 10/9; rule 42: the beasts are lab-made, Battle Brothers' bestiary is the floor).

Nothing in the bank walked on four legs. engine/bohemia_quadruped.js is the smallest quadruped that reads at the
fight's man size, and tools/bohemia_fight_beasts_bake.js bakes it into slices/fight_beasts in fight_people's shape.
Asked of the SKELETON at the keys that are drawn (the gait is a fact about paws on the ground) and of the BAKED
PIXELS (the reading is a fact about the picture), never of the module's own comments.

THE ENVELOPE LINES, SET BEFORE THIS GATE AND SAID SO (AN ENVELOPE RAMPS SLOWER THAN THE GRID, 9/24): three pictures a
beat, the men's grid; a loop never moves a joint more than 14 px between two drawn pictures (an eighth of the frame)
nor turns it round more than twice a cycle; the bite and the fall get 16 px and three turns (out, the bite, back).
Measured 10/9 on the first lope (a 34 px stride): the fore knee reached 17.4 px on ONE key and came back. Fixed in
the gait (26 px, 40% stance), not here.

Usage: python3 gates/four_legs_gate.py [beasts_dir] [module.js]   (both default to the repo's)
"""
import json, os, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'slices', 'fight_beasts')
MOD = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'engine', 'bohemia_quadruped.js')
ok_n = fail_n = 0
def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + why + ']' if why else ''))
def done():
    print('\nFOUR LEGS GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)

if not os.path.exists(os.path.join(D, 'fight_beasts.json')):
    ok('there is a fight_beasts.json: the fight has a four-legged sheet to read', False); done()
M = json.load(open(os.path.join(D, 'fight_beasts.json')))
F, COLS, CL, ROWS = M['frame'], M['cols'], M['clips'], M['rows']

# the skeleton at every drawn key, and the module's own render of every column, from node (the one body)
JS = r"""
const Q = require(process.argv[1]); const cols = JSON.parse(process.argv[2]);
const pts = sk => { const o = { hip: sk.hip, sh: sk.sh, neck: sk.neck, head: sk.head };
  for (const k in sk.legs) { o[k + 'K'] = sk.legs[k].K; o[k + 'W'] = sk.legs[k].W; o[k + 'P'] = sk.legs[k].P; } return o; };
const out = { GROUND: Q.GROUND, PAL: Q.PAL, line: Q.PAL[Q.C.line], kpb: Q.KEYS_PER_BEAT, beats: Q.BEATS, clips: {}, render: {} };
for (const c of ['idle', 'walk', 'lope', 'lunge', 'fall']) out.clips[c] = Q.keys(c).map(t => { const s = Q.pose(c, t);
  return { t: t, paws: Q.pawsDown(s), jaw: s.jaw, pts: pts(s) }; });
for (const c of cols) { const at = c.indexOf('@'); out.render[c] = Buffer.from(Q.frame(c.slice(0, at), +c.slice(at + 1), 'SE')).toString('base64'); }
process.stdout.write(JSON.stringify(out));
"""
try:
    S = json.loads(subprocess.run(['node', '-e', JS, MOD, json.dumps(COLS)], capture_output=True, text=True, check=True).stdout)
except Exception as e:
    ok('the quadruped module runs', False, str(e)[:200]); done()
G, PAL = S['GROUND'], [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) for h in S['PAL'] if h]
LINE = tuple(int(S['line'][i:i + 2], 16) for i in (1, 3, 5))

# 1. the table, in fight_people's shape
EV = ['idle', 'step', 'run', 'bite', 'fall', 'dead']
ok('the clip table names every beast event (' + ', '.join(EV) + ')', all(e in CL for e in EV), ','.join(e for e in EV if e not in CL))
ok('every column the table names is baked, and the fall flows into the dead (then: dead, the fall\'s last picture)',
   all(c in COLS for e in CL for c in CL[e]['cols']) and CL.get('fall', {}).get('then') == 'dead' and CL['dead']['cols'] == CL['fall']['cols'][-1:])
ok('THE MEN\'S GRID: three pictures a beat on every clip (twelve a bar, nothing between two keys is drawn)',
   S['kpb'] == 3 and all(len(S['clips'][c]) == 3 * S['beats'][c] for c in S['clips']),
   ' '.join('%s %d/%d' % (c, len(S['clips'][c]), S['beats'][c]) for c in S['clips']))

# 2. the sheet IS the engine (one body): every SE picture byte for byte, SW its mirror
import base64
im = Image.open(os.path.join(D, M['beasts']['dire_wolf']['file'])).convert('RGBA')
ok('the sheet is %d columns by %d facings of the 112 frame' % (len(COLS), len(ROWS)), im.size == (F * len(COLS), F * len(ROWS)) and ROWS == ['SE', 'SW'])
def cell(r, c): i = COLS.index(c); return im.crop((i * F, r * F, i * F + F, r * F + F))
stale = [c for c in COLS if cell(0, c).tobytes() != base64.b64decode(S['render'][c])]
ok('ONE BODY: every baked picture is the module\'s own render today (a stale sheet fails)', not stale, ','.join(stale[:4]))
mir = [c for c in COLS if cell(1, c).tobytes() != cell(0, c).transpose(Image.FLIP_LEFT_RIGHT).tobytes()]
ok('SW is SE turned round, pixel for pixel', not mir, ','.join(mir[:4]))

# 3. the gait, at the drawn keys
walk, lope = S['clips']['walk'], S['clips']['lope']
ok('THE WALK: two or three paws on the ground at EVERY drawn picture, and three on some (a walk, not a trot) (paws ' + ''.join(str(k['paws']) for k in walk) + ')',
   all(2 <= k['paws'] <= 3 for k in walk) and any(k['paws'] == 3 for k in walk))
lifted = all(any(k['pts'][p + 'P'][1] < G - 1 for k in walk) for p in ('LH', 'LF', 'RH', 'RF'))
ok('  and every one of the four paws is drawn off the ground once a stride', lifted)
ok('THE LOPE: a drawn picture with NO paw down, the suspension (paws ' + ''.join(str(k['paws']) for k in lope) + ')',
   any(k['paws'] == 0 for k in lope))
ok('  and it is faster than the walk: the lope\'s stride (the paw\'s reach, front to back) is the longer',
   max(k['pts']['RHP'][0] for k in lope) - min(k['pts']['RHP'][0] for k in lope) > max(k['pts']['RHP'][0] for k in walk) - min(k['pts']['RHP'][0] for k in walk))

# 4. the envelope (the lines are in the docstring)
def envelope(c, cap, turns):
    ks, loop = S['clips'][c], c in ('idle', 'walk', 'lope'); n = len(ks); worst = (0, ''); most = (0, '')
    for j in ks[0]['pts']:
        d = []
        for i in range(n if loop else n - 1):
            a, b = ks[i]['pts'][j], ks[(i + 1) % n]['pts'][j]; d.append((b[0] - a[0], b[1] - a[1]))
            m = (d[-1][0] ** 2 + d[-1][1] ** 2) ** 0.5
            if m > worst[0]: worst = (m, j + '@' + str(i))
        big = [v for v in d if (v[0] ** 2 + v[1] ** 2) ** 0.5 >= 2]; r = 0
        for i in range(len(big) if loop else len(big) - 1):
            u, v = big[i], big[(i + 1) % len(big)]
            if (u[0] * v[0] + u[1] * v[1]) / (((u[0] ** 2 + u[1] ** 2) * (v[0] ** 2 + v[1] ** 2)) ** 0.5) < -0.5: r += 1
        if r > most[0]: most = (r, j)
    return worst[0] <= cap and most[0] <= turns, '%s: worst %.1f px (%s), most turns %d (%s)' % (c, worst[0], worst[1], most[0], most[1])
env = [envelope(c, 14, 2) for c in ('idle', 'walk', 'lope')] + [envelope(c, 16, 3) for c in ('lunge', 'fall')]
ok('AN ENVELOPE RAMPS SLOWER THAN THE GRID: no joint jumps (loops 14 px, 2 turns a cycle; the bite and the fall 16, 3)',
   all(e[0] for e in env), '; '.join(e[1] for e in env if not e[0]))
print('         ' + '; '.join(e[1] for e in env))

# 5. the reading, in the pixels
def box(fr): return fr.getchannel('A').getbbox()
def lum(p): return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
idle = [cell(0, c) for c in CL['idle']['cols']]
ok('THE IDLE BREATHES: three or more different pictures of its %d' % len(idle), len(set(f.tobytes() for f in idle)) >= 3)
bt = [cell(0, c) for c in CL['bite']['cols']]; jaw = [k['jaw'] for k in S['clips']['lunge']]
rest = box(idle[0]); reach = max(box(f)[2] for f in bt)
GUM = (0x7a, 0x3a, 0x34)
opened = [i for i, f in enumerate(bt) if GUM in [p[:3] for p in f.get_flattened_data() if p[3]]]
ok('THE BITE reaches: the nose goes 8 px or more past where it stands (%d -> %d)' % (rest[2], reach), reach - rest[2] >= 8)
ok('  the jaws are drawn OPEN (the gum shows) and then SHUT again on a later picture (gum on %s, jaw %s)' % (opened, jaw),
   bool(opened) and any(j < 0.3 for j in jaw[opened[-1] + 1:]) if opened else False)
fl = [cell(0, c) for c in CL['fall']['cols']]; tops = [box(f)[1] for f in fl]
ok('THE FALL goes down: the top of the body never rises from one drawn picture to the next (%s)' % tops,
   all(tops[i + 1] >= tops[i] for i in range(len(tops) - 1)))
h0, h1 = G - rest[1], box(fl[-1])[3] - box(fl[-1])[1]
ok('  and it ends LYING: under 60%% of its standing height (%d -> %d px)' % (h0, h1), h1 < 0.6 * h0)
under = [c for c in COLS if box(cell(0, c))[3] > G + 3]
ok('NOTHING UNDER THE GROUND: no picture reaches past the ground line and its paw (y %d)' % (G + 2), not under, ','.join(under[:4]))
edge = [c for c in COLS if (lambda b: b[0] < 1 or b[1] < 1 or b[2] > F - 1)(box(cell(0, c)))]
ok('INSIDE THE BOX: no picture is cut by the 112 frame (the jaw, the ears, the tail)', not edge, ','.join(edge[:4]))
pal = set(PAL); offp = [c for c in COLS if any(p[3] and p[:3] not in pal for p in cell(0, c).get_flattened_data())]
ok('PALETTE ONLY: every pixel is one of the %d colours, no blending (a smoothed resample fails)' % len(PAL), not offp, ','.join(offp[:3]))
def border_ok(fr):
    px = fr.load(); w, h = fr.size
    for y in range(h):
        for x in range(w):
            if not px[x, y][3]: continue
            if any(not (0 <= x + dx < w and 0 <= y + dy < h) or not px[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                if px[x, y][:3] != LINE: return False
    return True
nob = [c for c in COLS if not border_ok(cell(0, c))]
ok('THE BORDER IS ONE PIXEL: every edge pixel of the silhouette is the line colour', not nob, ','.join(nob[:4]))
fr = idle[0]; px = fr.load(); b = box(fr); top_l, bot_l = [], []
for x in range(b[0] + (b[2] - b[0]) // 4, b[0] + (b[2] - b[0]) // 2):   # the barrel: the back half of the body, no head, no legs
    ys = [y for y in range(b[1], b[3]) if px[x, y][3] and px[x, y][:3] != LINE]
    if len(ys) > 8: top_l += [lum(px[x, y]) for y in ys[:3]]; bot_l += [lum(px[x, y]) for y in ys[8:11]]
ok('THE 45 LAW: you are above it, so its back is lit brighter than its flank below (%.0f vs %.0f)' % (sum(top_l) / max(1, len(top_l)), sum(bot_l) / max(1, len(bot_l))),
   top_l and sum(top_l) / len(top_l) > sum(bot_l) / len(bot_l) + 15)

# 6. it reads on the map: a 112 frame is drawn at 37 px there, and 21 zoomed all the way out (MAP_PERSON_K, MAP_PEOPLE_K)
def legs_at_ground(fr):
    a = fr.getchannel('A'); w, h = a.size; bb = a.getbbox(); y = bb[3] - 2 if fr.width > 40 else bb[3] - 1
    runs, inn = 0, False
    for x in range(w):
        on = a.getpixel((x, y)) > 0
        if on and not inn: runs += 1
        inn = on
    return runs
mp = []
for size in (37, 21):
    for c in (CL['idle']['cols'][0], CL['step']['cols'][0]):
        s = cell(0, c).resize((size, size), Image.NEAREST); bb = box(s); w, h = bb[2] - bb[0], bb[3] - bb[1]
        # 'longer than tall'. First written 1.25, stricter than its own words; the 21 px idle measured 16x13 (a man there: ~4x19)
        if w < 1.1 * h: mp.append('%s@%d %dx%d' % (c, size, w, h))
        if size == 37 and legs_at_ground(s) < 2: mp.append('%s@37 legs %d' % (c, legs_at_ground(s)))
ok('IT READS ON THE MAP: at 37 px and at 21 it is longer than tall (a beast, not a man), and at 37 its legs stand apart', not mp, ','.join(mp))
done()
