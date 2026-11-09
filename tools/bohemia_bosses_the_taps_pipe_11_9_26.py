#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the next two change the map, each its own way] (11/9/26, VAMILY rule 440(b); ask lines 167, 522).

THE TAP (the ladder's second, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md: 'holds the pressure, and who is allowed any'; his rumour:
'His boys sit up on the pipes with crossbows, bro. Don't run at them in the open.'). THE POT closed streets; THE TAP's way is his PIPE:
the main that runs from his pump house to the nearest town, his pipe watchers sitting on it with crossbows over the street. While he
stands, a crew that walks under the pipe takes bolts; when he falls they come down and the pipe is a line of taps for the street.

THIS PAINTS THE PIPE, one street block of it, in the map's own look, THE CHECKPOINT's way (tools/bohemia_bosses_the_pots_ground_11_8_26.py:
the district factory's parts, COOK's rig through the master rig, an unpainted plate the kitchen's size so the rig reads the same metres):
  PIPE  BEFORE: a rusted water main raised on concrete saddles along the kerb, a valve with its red wheel, his tag sprayed red on the
        pipe, a crate on top and one of his watchers crouched on it with a crossbow over the road, bolts in the street, a tarp.
        AFTER: the watcher gone, a standpipe riser with a brass tap off the main, water running on the beat into a trough, two jugs,
        a wet patch on the kerb.
  'pipe_x' runs along a street along x, 'pipe_y' along y; before and after, two beat frames; ONE street block across, no ground.

  python3 tools/bohemia_bosses_the_taps_pipe_11_9_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_the_taps_pipe_11_9_26.py render
  python3 tools/bohemia_bosses_the_taps_pipe_11_9_26.py finish

REFERENCE CHECK: the twins are THE PUMP HOUSE (his place) and THE CHECKPOINT at the same scale (records/target/bosses_the_taps_pipe/
compare.png); the real things: an above-ground ductile iron main on concrete saddles, a gate valve's handwheel, a yard hydrant's
standpipe and a stock trough, a crossbow. No reference game.
ANALOG HORROR: one man sitting very still on a pipe over an empty street, a red tag that says who drinks; after, a line of people's
jugs under a dripping tap, which is how a real neighbourhood gets water after a main breaks.
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB
import bohemia_bosses_the_pots_ground_11_8_26 as G

OUT = os.path.join(R, 'records/target/bosses_the_taps_pipe')
DEST = PB.DEST
RUST, RUST_DK, STEEL, STEEL_DK, CONC, CONC_DK = PB.RUST, PB.RUST_DK, PB.STEEL, PB.STEEL_DK, PB.CONC, PB.CONC_DK
PIPE, PIPE_DK = (92, 78, 66), (66, 54, 44)
RED = (168, 44, 36)
WOOD, WOOD_DK = G.WOOD, G.WOOD_DK
HOOD, HOOD_DK, SKIN = (58, 62, 54), (40, 44, 38), (150, 104, 76)
BRASS = (176, 140, 64)
JUG, JUG_CAP = (198, 204, 196), (52, 96, 150)
WET = (52, 58, 62)
TARP = (70, 84, 92)
BLOCK, PLATE_PX = G.BLOCK, G.PLATE_PX


def pipe(after, along):
    """built for a street along y (the lanes x 2.5..7.5); the main runs along y on the left kerb at x 1.0..1.8; mirrored for x"""
    from bohemia_iso3d import Scene
    s = Scene()
    ax = (along == 'x')

    def bx(pos, size, m):
        (x, y, z), (dx, dy, dz) = pos, size
        if ax: s.box((y, x, z), (dy, dx, dz), m)
        else: s.box((x, y, z), (dx, dy, dz), m)

    def pr(x, y, *a, **k):
        if ax: s.prism(y, x, *a, **k)
        else: s.prism(x, y, *a, **k)
    pm = {'top': {'c': PIPE}, 'px': {'c': PIPE}, 'py': {'c': PIPE_DK}, 'nx': {'c': PIPE_DK}, 'ny': {'c': PIPE_DK}}
    for y0 in (0.6, 4.6, 8.6):
        bx((0.8, y0, 0), (1.2, 0.8, 0.7), {'top': {'c': CONC}, 'px': {'c': CONC}, 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC_DK}})   # the saddles
    bx((1.0, 0.0, 0.7), (0.8, BLOCK, 0.8), pm)                                                         # the main, end to end
    for y0 in (2.4, 6.9): bx((0.95, y0, 0.66), (0.9, 0.22, 0.9), {'c': RUST_DK})                         # its joints
    bx((1.2, 3.2, 1.5), (0.4, 0.4, 0.5), {'c': STEEL_DK}); bx((1.0, 3.0, 2.0), (0.8, 0.8, 0.08), {'c': RED})   # the gate valve and its red wheel
    if not after:
        bx((1.79, 5.6, 0.85), (0.04, 1.6, 0.5), {'c': RED})                                             # his tag down the pipe's side
        bx((0.9, 6.4, 1.5), (1.0, 1.1, 0.6), {'top': {'c': WOOD}, 'px': {'c': WOOD_DK}, 'py': {'c': WOOD}, 'nx': {'c': WOOD_DK}, 'ny': {'c': WOOD_DK}})   # the crate he sits on
        bx((0.6, 7.6, 1.5), (1.6, 1.4, 0.05), {'c': TARP})                                             # a tarp over the pipe
        # the watcher, crouched on the crate facing the road: boots, knees, a hooded body, the crossbow over the street
        bx((1.1, 6.6, 2.1), (0.5, 0.6, 0.35), {'c': HOOD_DK})
        bx((1.05, 6.55, 2.45), (0.6, 0.7, 0.75), {'top': {'c': HOOD}, 'px': {'c': HOOD}, 'py': {'c': HOOD_DK}, 'nx': {'c': HOOD_DK}, 'ny': {'c': HOOD_DK}})
        pr(1.35, 6.9, 3.2, 0.24, 0.32, 10, {'c': HOOD_DK}, {'c': HOOD_DK})
        bx((1.6, 6.8, 2.75), (1.4, 0.14, 0.12), {'c': WOOD_DK}); bx((2.7, 6.45, 2.78), (0.1, 0.84, 0.08), {'c': STEEL_DK})   # the crossbow
        for (x, y) in [(3.4, 4.2), (4.6, 6.1), (5.9, 3.3)]: bx((x, y, 0), (0.7, 0.06, 0.06), {'c': STEEL})   # bolts in the street
    else:
        bx((1.75, 5.0, 0.95), (0.6, 0.2, 0.2), {'c': PIPE_DK}); bx((2.25, 5.0, 0.95), (0.22, 0.22, 1.5), {'c': PIPE})   # the riser off the main
        bx((2.2, 4.85, 2.3), (0.6, 0.5, 0.18), {'c': BRASS})                                            # the tap
        bx((2.0, 4.3, 0), (1.6, 1.5, 0.55), {'top': {'c': (40, 64, 82)}, 'px': {'c': CONC}, 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC_DK}})   # the trough, full
        for (x, y) in [(2.2, 6.2), (2.9, 6.4)]: pr(x, y, 0, 0.26, 0.7, 10, {'c': JUG}, {'c': JUG_CAP})   # two jugs waiting
        bx((1.8, 3.4, 0), (2.6, 3.8, 0.02), {'c': WET})                                                 # the wet kerb
    return s


SCENES = [('pipe_x', 'x'), ('pipe_y', 'y')]


def capture(name, along, after):
    """THE CHECKPOINT's frame (the block's own scale and anchor, one frame size before and after, the unpainted plate)"""
    from bohemia_iso3d import bake
    s = pipe(after, along)
    scale = PLATE_PX / (2.0 * BLOCK)
    P3 = [(x, y, z) for verts, _u, _n, _m in s.faces for (x, y, z) in verts] + [(0, 0, 0), (BLOCK, 0, 0), (0, BLOCK, 0), (BLOCK, BLOCK, 0)]
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for (x, y, z) in P3]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 30
    W = int(math.ceil(mxx - mnx)) + 12; H = int(math.ceil(mxy - mny)) + 10 + top
    origin = (6 - mnx, top + 2 - mny)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in s.faces]
    g0, g1 = -2.5, BLOCK + 2.5
    faces.append(([(g0, g0, 0.0), (g1, g0, 0.0), (g1, g1, 0.0), (g0, g1, 0.0)], (0.0, 0.0, 1.0), None))
    c = BLOCK / 2.0
    return dict(district='boss_%s_%s' % (name, 'after' if after else 'before'), name=name, along=along, after=after, w=W, h=H, origin=tuple(origin),
                scale=float(scale), faces=faces, bbox=(0, 0, W, H), bank_w=W, bank_h=H, bx=int(round(origin[0])), by=int(round(origin[1] + c * scale)),
                plate=PLATE_PX, bake4=bake(s, W, H, origin=origin, scale=scale, ss=4))


def scenes():
    os.makedirs(OUT, exist_ok=True)
    S = [capture(n, a, af) for (n, a) in SCENES for af in (False, True)]
    pickle.dump(S, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
    print('captured', len(S), 'scenes')


def render():
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    for i, sc in enumerate(S):
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        if os.path.exists(fn): continue
        code = ('import sys,pickle; sys.path.insert(0, %r); import bohemia_cook_the_map_through_the_rig_10_20_26 as M; '
                'M.OUT=%r; M.MASTERS=%r; sc=pickle.load(open(%r,"rb"))[%d]; fn=M.render(sc["district"], sc); print(M.finish(sc["district"], sc, fn))'
                % (os.path.join(R, 'tools'), OUT, os.path.join(OUT, 'masters'), os.path.join(OUT, 'scenes.pkl'), i))
        rc = subprocess.call([py, '-c', code], cwd=R, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print('  rendered', sc['district'], 'ok' if os.path.exists(fn) else 'FAILED (rc %d)' % rc, flush=True)


def moving(sc, frame):
    """BEFORE: still (he sits very still), a glint on the bolt head on the beat; AFTER: the water off the tap into the trough"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    sw = (lambda x, y: (y, x)) if sc['along'] == 'x' else (lambda x, y: (x, y))
    if not sc['after']:
        x, y = PB.proj(sc, sw(2.75, 6.85) + (2.85,)); PB.blob(L, x, y, 1.4, (230, 226, 210), 0.75 if frame else 0.2)
        return L
    x0, y0 = PB.proj(sc, sw(2.5, 5.1) + (2.25,)); x1, y1 = PB.proj(sc, sw(2.5, 5.1) + (0.55,))
    for yy in range(int(y0), int(y1) + 1):
        if 0 <= yy < sc['h']:
            xx = int(round(x0)); ph = ((yy + (2 if frame else 0)) // 2) % 2
            L[yy, xx, :3] = (200, 230, 240) if ph else (120, 176, 206); L[yy, xx, 3] = 235
    PB.blob(L, x1, y1, 2.4, (190, 222, 236), 0.55 if frame else 0.35)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    if ' BOSSES 11/9:' not in man['about']:
        man['about'] += (' BOSSES 11/9 (rule 440(b)): THE TAP\'s PIPE, his watcher on it with a crossbow, then a standpipe and a trough, along x '
                         'and along y (tools/bohemia_bosses_the_taps_pipe_11_9_26.py); plate = ONE street block across, no ground.')
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        rig = os.path.exists(fn)
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64) if rig else PB.grain(sc['bake4'].astype(np.float64), sum(map(ord, sc['district'])))
        key = sc['name'] + ('_after' if sc['after'] else '_before')
        for fr in (0, 1):
            out = PB.over(base, moving(sc, fr))
            Image.fromarray(out.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=sc['w'], h=sc['h'], bx=sc['bx'], by=sc['by'], plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key],
                                    through_the_rig=rig)
        print('  %-20s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    try:
        tiles = [Image.open(os.path.join(DEST, k + '_0.png')) for k in ('tower_before', 'pipe_x_before', 'pipe_y_before', 'checkpoint_y_before',
                                                                          'tower_after', 'pipe_x_after', 'pipe_y_after', 'checkpoint_y_after')]
        kp = man['pictures']['tower_before']['plate']; f = PLATE_PX / (kp / 1.3)
        tiles = [t if i % 4 == 0 else t.resize((max(1, round(t.width / f)), max(1, round(t.height / f))), Image.LANCZOS) for i, t in enumerate(tiles)]
        W = max(sum(t.width for t in tiles[:4]), sum(t.width for t in tiles[4:])) + 50; H = max(t.height for t in tiles) * 2 + 30
        sheet = Image.new('RGBA', (W * 2, H * 2), (20, 18, 16, 255))
        for row in range(2):
            x = 10
            for t in tiles[row * 4:(row + 1) * 4]:
                t2 = t.resize((t.width * 2, t.height * 2), Image.NEAREST); sheet.alpha_composite(t2, (x, 10 + row * H)); x += t2.width + 20
        os.makedirs(OUT, exist_ok=True); sheet.save(os.path.join(OUT, 'compare.png')); print('  compare sheet', os.path.join(OUT, 'compare.png'))
    except Exception as e:
        print('  compare sheet failed:', e)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
