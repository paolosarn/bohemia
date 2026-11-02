#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [his place painted in the map's own look] (11/2/26, VAMILY rule 330; ask lines 328 and 329).

PAOLO 11/2: 'what happens to the city map? ...there's a bunch of bright pixels on the part of the map where I killed the boss...
I'm so confused, what's going on.' MEASURED FIRST (records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md): THE KITCHEN, THE
PUMP HOUSE and THE SETTLING TANKS were pixel rows (a 13-wide letter grid each) filled with flat colours on the map's canvas, and
the lights his fall brought back were single yellow dots over every building for three blocks round: the bright pixels.

THE METHOD, REUSE FIRST: the map's own pictures are made by the district hero factory (tools/bohemia_district_hero_factory.py,
its numpy renderer tools/bohemia_iso3d.py: the same iso projection, the same pad, the same window grids) and rendered through
the master rig by COOK (tools/bohemia_cook_the_map_through_the_rig_10_20_26.py render/finish: the rig's source pass, dents, sun,
the floor tool's grime, the snap toward his colours). Both are imported and never edited. This builds each place as a scene of
the factory's own parts, in two states (before he falls / after), captures it the way COOK's capture does (faces, canvas,
origin, scale), and renders it through COOK's rig render. What moves on the beat (his black smoke, the steam, the water out
of the tower, the lamp, the tanks' fumes) is laid over the render in two frames, so the map breathes on the beat like its
markers. Without bpy (no venv) the factory's own bake at 4x stands in, with the same overlays.
  THE KITCHEN        a casino's back-of-house kitchen: tiled walls, a red band, a loading dock, a copper stock pot on the roof
                     and a steel stack. BEFORE: the windows dark, a burn barrel by the dock, BLACK SMOKE out of the stack (his
                     grease fire). AFTER: the fire out, every window lit warm, white steam off the pot (cooking for everybody).
  THE PUMP HOUSE     a water tower on four stilts over a brick pump house, a pipe between them, a valve wheel on a standpipe.
                     BEFORE: the tank dry and rusted, the valve wheel red, a red lamp on the stilts blinking. AFTER: the tank
                     painted, the wheel open, WATER POURING from the spout into a trough and a wet patch on the ground.
  THE SETTLING TANKS two round open tanks and a control hut, a little stack. BEFORE: the tanks full of sick green sludge, green
                     fumes off the stack. AFTER: clean blue water in both, the stack quiet.
  and the four small things his verbs leave on a block: THE COOKFIRE (stones, a pot on a tripod, smoke), THE MAIN SHUT (a
  standpipe and its red wheel, dry) and THE MAIN OPEN (the same, water running into a puddle), THE CLEAN WATER (a blue drum, a
  tap, a jug).

  python3 tools/bohemia_bosses_paint_their_places_11_2_26.py scenes            (capture: records/target/bosses_places/scenes.pkl)
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_paint_their_places_11_2_26.py render   (through the rig)
  python3 tools/bohemia_bosses_paint_their_places_11_2_26.py finish            (the beat frames -> slices/boss_places/)
  (all three in order: 'all')

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twins are the map's own district pictures at the same scale
(the casino, the water treatment plant, the pump station: records/target/bosses_places/compare.png); real photographs of the
kind (a casino's loading dock and kitchen exhaust, an elevated steel water tank on four legs, a treatment plant's round
clarifiers). No reference game.
ANALOG HORROR (rule 9 of the law): the dead state is the horror, black smoke on a clear day, a red lamp blinking on the beat
over a dry tank, sludge that glows; the after state is the world working again, never clean plastic (the rig's grime stays).
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/bosses_places')
DEST = os.path.join(R, 'slices/boss_places')
PLATE_PX = 150        # a place's ground plate across, in its picture's pixels (the game scales it to the block)
PROP_PX = 46

# ----------------------------------------------------------------------------------------------------------------------
# THE SCENES, from the factory's own parts
# ----------------------------------------------------------------------------------------------------------------------
TILE, TILE_DK = (164, 160, 150), (128, 124, 116)
RED_BAND = (138, 52, 40)
ROOF, ROOF_DK = (74, 72, 70), (56, 54, 52)
COPPER, COPPER_DK = (172, 102, 54), (110, 62, 34)
STEEL, STEEL_DK = (92, 90, 86), (46, 44, 42)
BRICK, BRICK_DK = (124, 70, 52), (96, 54, 40)
RUST, RUST_DK = (112, 70, 44), (78, 48, 32)
PAINT_TANK = (150, 160, 150)
CONC, CONC_DK = (126, 122, 114), (98, 94, 88)
SLUDGE, SLUDGE_DK = (96, 140, 8), (62, 92, 6)          # 11/2: pushed, the rig's dust took the first green to sage
WATER, WATER_DK = (34, 100, 168), (24, 70, 124)        # 11/2: pushed, the rig's dust took the first blue to grey
GROUND_LOT, GROUND_DIRT = (86, 84, 80), (112, 100, 82)
LIT = (240, 190, 96)
DARK_GLASS = (30, 34, 40)


def HF():
    import bohemia_district_hero_factory as H
    return H


def win(wall, cols, rows, lit, seed=5):
    m = HF()._win(wall, cols, rows, seed, dead=0.0 if lit else 0.25)
    if lit: m['glass'] = LIT
    return m


def kitchen(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 11), groundc=GROUND_LOT)
    W = win(TILE, 6, 2, after, 3); W2 = win(TILE_DK, 4, 2, after, 7)
    # the map is seen from the +x and +y sides (iso3d: screen x = x - y): the windows go on the two faces he sees
    s.box((0, 0, 0), (12.0, 8.0, 4.2), {'top': {'c': ROOF}, 'px': W2, 'py': W, 'nx': {'c': TILE_DK}, 'ny': {'c': TILE_DK}})
    s.box((-0.05, -0.05, 3.5), (12.1, 8.1, 0.55), {'top': {'c': ROOF}, 'px': {'c': RED_BAND}, 'py': {'c': RED_BAND}, 'nx': {'c': RED_BAND}, 'ny': {'c': RED_BAND}})
    s.box((0.4, 0.4, 4.2), (11.2, 7.2, 0.25), {'c': ROOF_DK})                                    # the roof deck
    H._door_face(s, (0, 0, 0), (12.0, 8.0, 4.2), width=2.2, ztop=2.8)
    s.box((3.0, 8.0, 0), (5.0, 1.6, 1.1), {'c': CONC})                                          # the loading dock
    s.box((8.6, 1.0, 4.45), (1.8, 1.4, 0.9), {'c': STEEL})                                       # a rooftop unit
    s.box((1.0, 5.4, 4.45), (2.2, 1.6, 0.7), {'c': STEEL})
    # the stack (his smoke) and the stock pot (the last good pot)
    s.prism(10.2, 6.2, 4.45, 0.55, 6.5, 12, {'c': STEEL_DK}, {'c': (24, 22, 20)})
    s.prism(5.0, 3.8, 4.45, 1.7, 1.6, 20, {'c': COPPER}, {'c': COPPER_DK}, inner=1.45)
    s.box((3.05, 3.65, 5.5), (0.5, 0.3, 0.25), {'c': COPPER_DK}); s.box((6.45, 3.65, 5.5), (0.5, 0.3, 0.25), {'c': COPPER_DK})
    if not after:
        s.prism(1.6, 10.2, 0, 0.45, 1.0, 10, {'c': RUST_DK}, {'c': (40, 26, 18)})                # the burn barrel
    return s


def pumphouse(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=GROUND_DIRT, patches=([(6.2, -0.8, 10.4, 3.4, (52, 80, 98))] if after else []))
    s.box((0, 0, 0), (5.5, 5.0, 3.4), {'top': {'c': ROOF_DK}, 'px': win(BRICK, 2, 1, after, 4), 'py': {'c': BRICK_DK}, 'nx': {'c': BRICK_DK}, 'ny': {'c': BRICK}})
    H._door_face(s, (0, 0, 0), (5.5, 5.0, 3.4), width=1.3, ztop=2.4)
    # the tower: four stilts, cross braces, the tank, its cap
    tx, ty = 8.4, 5.6
    for (a, b) in [(-1.8, -1.8), (1.8, -1.8), (1.8, 1.8), (-1.8, 1.8)]:
        s.box((tx + a - 0.18, ty + b - 0.18, 0), (0.36, 0.36, 9.0), {'c': STEEL_DK})
    for z in (3.0, 6.0):
        s.box((tx - 1.8, ty - 1.85, z), (3.6, 0.12, 0.16), {'c': STEEL}); s.box((tx + 1.75, ty - 1.8, z), (0.12, 3.6, 0.16), {'c': STEEL})
    tank = PAINT_TANK if after else RUST
    s.prism(tx, ty, 9.0, 2.6, 3.4, 20, {'c': tank}, {'c': (RUST_DK if not after else (120, 128, 120))})
    s.prism(tx, ty, 12.4, 1.6, 0.9, 16, {'c': (STEEL if after else RUST_DK)}, {'c': STEEL_DK})
    s.box((tx - 2.5, ty - 0.2, 9.0), (0.6, 0.4, 0.5), {'c': STEEL_DK})                         # the spout
    # the pipe from the pump house to the tower, and the valve on its standpipe
    s.box((5.5, 2.2, 0.6), (3.0, 0.4, 0.4), {'c': STEEL})
    s.prism(7.0, 0.6, 0, 0.25, 1.3, 10, {'c': STEEL})
    s.prism(7.0, 0.6, 1.3, 0.75, 0.12, 16, {'c': ((70, 120, 70) if after else (170, 40, 30))}, {'c': ((70, 120, 70) if after else (170, 40, 30))}, inner=0.55)
    if after: s.box((tx - 3.4, ty - 0.9, 0), (1.6, 1.8, 0.5), {'c': CONC})                     # the trough under the spout
    return s


def tanks(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 15, 11), groundc=(98, 96, 90))
    liq, liq_dk = (WATER, WATER_DK) if after else (SLUDGE, SLUDGE_DK)
    for (cx, cy) in [(2.6, 3.4), (9.4, 3.4)]:
        s.prism(cx, cy, 0, 3.2, 2.6, 24, {'c': CONC}, {'c': CONC_DK}, inner=2.8)
        s.prism(cx, cy, 0, 2.8, 2.2, 24, {'c': liq_dk}, {'c': liq})
        s.box((cx - 3.2, cy - 0.15, 2.6), (6.4, 0.3, 0.22), {'c': STEEL})                      # the bridge across
    s.box((4.6, 7.4, 0), (3.6, 2.8, 3.0), {'top': {'c': ROOF_DK}, 'px': win(CONC, 2, 1, after, 9), 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    H._door_face(s, (4.6, 7.4, 0), (3.6, 2.8, 3.0), width=1.1, ztop=2.2)
    s.prism(12.6, 8.6, 0, 0.4, 5.5, 10, {'c': STEEL_DK}, {'c': (24, 22, 20)})
    s.box((5.8, 3.25, 0.9), (0.8, 0.3, 0.3), {'c': STEEL})                                     # the pipe between the tanks
    return s


def cookfire(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    for i in range(8):
        a = i * math.pi / 4; s.box((math.cos(a) * 1.0 - 0.18, math.sin(a) * 1.0 - 0.18, 0), (0.36, 0.36, 0.28), {'c': (110, 104, 96)})
    s.box((-0.5, -0.1, 0), (1.0, 0.2, 0.14), {'c': (64, 40, 26)}); s.box((-0.1, -0.5, 0.1), (0.2, 1.0, 0.14), {'c': (70, 44, 28)})
    for (a, b) in [(-0.9, -0.9), (0.9, -0.9), (0.0, 1.0)]: s.box((a - 0.06, b - 0.06, 0), (0.12, 0.12, 2.0), {'c': (58, 44, 30)})
    s.prism(0, 0, 1.0, 0.55, 0.6, 14, {'c': COPPER}, {'c': COPPER_DK}, inner=0.45)
    return s


def mainvalve(after):
    from bohemia_iso3d import Scene
    s = Scene()
    if after: s.box((-1.2, -1.2, 0), (2.4, 2.4, 0.04), {'c': (52, 82, 102)})                   # the wet ground
    s.prism(0, 0, 0, 0.32, 1.3, 12, {'c': STEEL})
    s.box((0.2, -0.12, 0.6), (0.7, 0.24, 0.24), {'c': STEEL_DK})                              # the spout
    col = (70, 120, 70) if after else (170, 40, 30)
    s.prism(0, 0, 1.3, 0.8, 0.12, 16, {'c': col}, {'c': col}, inner=0.6)
    return s


def cleanwater(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.prism(0, 0, 0, 0.75, 1.5, 16, {'c': (58, 104, 140)}, {'c': (44, 84, 112)})
    s.box((0.7, -0.1, 0.25), (0.35, 0.2, 0.18), {'c': STEEL})
    s.prism(1.2, 0.9, 0, 0.3, 0.6, 10, {'c': (212, 208, 196)}, {'c': (180, 176, 166)})       # a white jug
    return s


PLACES = {'kitchen': kitchen, 'tower': pumphouse, 'tanks': tanks}
PROPS = {'fire': cookfire, 'main': mainvalve, 'clean': cleanwater}


def capture(name, build, after, plate_px):
    """the factory's bake at one sample a pixel, the scene kept face by face (COOK's capture's way), and its frame"""
    from bohemia_iso3d import bake
    s = build(after)
    HF()._draw_ground(s)
    xs = [(x - y) for verts, _u, _n, _m in s.faces if max(v[2] for v in verts) <= 0.15 for (x, y, z) in verts]
    if name in PROPS: xs = [(x - y) for verts, _u, _n, _m in s.faces for (x, y, z) in verts]   # a small thing has no plate: its own width
    scale = plate_px / max(1e-6, (max(xs) - min(xs)))
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for verts, _u, _n, _m in s.faces for (x, y, z) in verts]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 70 if name in ('kitchen', 'tower', 'tanks') else 24      # room over the roof for his smoke, the steam, the fumes
    W = int(math.ceil(mxx - mnx)) + 16; H = int(math.ceil(mxy - mny)) + 10 + top
    origin = (8 - mnx, top + 2 - mny)
    img = bake(s, W, H, origin=origin, scale=scale, ss=1)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in s.faces]
    bx, by = HF()._anchor(s, origin, scale)
    return dict(district='boss_%s_%s' % (name, 'after' if after else 'before'), name=name, after=after, w=W, h=H, origin=tuple(origin),
                scale=float(scale), faces=faces, bbox=(0, 0, W, H), bank_w=W, bank_h=H, bx=bx, by=by, plate=plate_px,
                bake4=bake(s, W, H, origin=origin, scale=scale, ss=4))


def scenes():
    os.makedirs(OUT, exist_ok=True)
    S = []
    for n, f in PLACES.items():
        for a in (False, True): S.append(capture(n, f, a, PLATE_PX))
    for n, f in PROPS.items():
        for a in ((False, True) if n == 'main' else (False,)): S.append(capture(n, f, a, PROP_PX))
    pickle.dump(S, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
    print('captured', len(S), 'scenes')


def render():
    """COOK's rig render on each scene (Blender's python, one process a scene: a fresh factory scene each time)"""
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


# ----------------------------------------------------------------------------------------------------------------------
# THE BEAT FRAMES: what moves, over the render
# ----------------------------------------------------------------------------------------------------------------------
def proj(sc, p):
    s = sc['scale']; ox, oy = sc['origin']
    return ox + (p[0] - p[1]) * s, oy + (p[0] + p[1]) * s * 0.5 - p[2] * s


def blob(L, cx, cy, r, col, a):
    """a soft round puff, alpha falling off to its edge (a cloud of smoke, never a hard square)"""
    H, W = L.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / max(0.5, r)
    al = np.clip(1.0 - d, 0, 1) ** 0.7 * a
    for k in range(3): L[..., k] = L[..., k] * (1 - al) + col[k] * al
    L[..., 3] = np.maximum(L[..., 3], al * 255)


def column(sc, base, frame, col, a0, n=6, grow=1.0, drift=1.0):
    W, H = sc['w'], sc['h']; L = np.zeros((H, W, 4), np.float64)
    bx, by = proj(sc, base); s = sc['scale']
    for i in range(n):
        t = i + (0.5 if frame else 0.0)
        cy = by - t * 8.5 * grow - 3; cx = bx + (math.sin(t * 1.3) * 2.2 + t * 1.6) * drift
        if cy < 2: break
        blob(L, cx, cy, (4.6 + t * 2.1) * grow, col, a0 * max(0.0, 1 - t / (n + 0.5)))
    return L


def over(base, L):
    a = L[..., 3:4] / 255.0
    out = base.astype(np.float64).copy()
    out[..., :3] = out[..., :3] * (1 - a) + L[..., :3] * a
    out[..., 3] = np.maximum(out[..., 3], L[..., 3])
    return out


def moving(sc, frame):
    n, after = sc['name'], sc['after']
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    def add(M):
        nonlocal L; L = over(L, M)
    if n == 'kitchen':
        if not after:
            add(column(sc, (10.2, 6.2, 11.0), frame, (22, 20, 18), 0.92, n=7, grow=1.1))           # his black smoke
            bx, by = proj(sc, (1.6, 10.2, 1.0)); blob(L, bx, by - 2, 4.5, (255, 130, 40), 0.75 if frame else 0.5)   # the burn barrel
        else:
            add(column(sc, (5.0, 3.8, 6.0), frame, (232, 226, 214), 0.55, n=5, grow=0.8, drift=0.6))   # steam off the pot
    if n == 'tower':
        if not after:
            x, y = proj(sc, (8.4 - 1.8, 5.6 - 1.8, 6.6))
            blob(L, x, y, 3.0 if frame else 2.0, (230, 40, 30), 0.95 if frame else 0.45)              # his lamp, on the beat
        else:
            x0, y0 = proj(sc, (8.4 - 2.6, 5.6, 9.0)); x1, y1 = proj(sc, (8.4 - 2.6, 5.6, 0.5))
            for yy in range(int(y0), int(y1)):
                w = 1.6 + (yy - y0) / max(1, y1 - y0) * 1.4; ph = ((yy + (3 if frame else 0)) // 3) % 2
                for xx in range(int(x0 - w), int(x0 + w) + 1):
                    if 0 <= xx < sc['w'] and 0 <= yy < sc['h']:
                        c = (200, 230, 240) if ph else (120, 176, 206)
                        L[yy, xx, :3] = c; L[yy, xx, 3] = 230
            blob(L, x1, y1, 4.5, (190, 222, 236), 0.6 if frame else 0.4)                             # the splash
    if n == 'tanks':
        if not after:
            add(column(sc, (12.6, 8.6, 5.5), frame, (150, 180, 60), 0.7, n=5, grow=0.8))            # green fumes
            for (cx, cy) in [(2.6, 3.4), (9.4, 3.4)]:                                               # the sludge glows on the beat
                x, y = proj(sc, (cx, cy, 2.2)); blob(L, x, y, 15, (170, 220, 40), 0.42 if frame else 0.26)
        else:
            for (cx, cy) in [(2.6, 3.4), (9.4, 3.4)]:
                x, y = proj(sc, (cx + (0.8 if frame else -0.8), cy, 2.2)); blob(L, x, y, 5, (210, 236, 246), 0.35)   # light on clean water
    if n == 'fire':
        add(column(sc, (0, 0, 1.6), frame, (206, 198, 184), 0.6, n=4, grow=0.5, drift=0.5))
        x, y = proj(sc, (0, 0, 0.3)); blob(L, x, y, 3.2, (255, 140, 50), 0.85 if frame else 0.6)
    if n == 'main' and after:
        x0, y0 = proj(sc, (0.9, 0, 0.7)); x1, y1 = proj(sc, (0.9, 0, 0.0))
        for yy in range(int(y0), int(y1) + 1):
            if 0 <= yy < sc['h']:
                xx = int(round(x0)); L[yy, xx, :3] = (200, 230, 240) if ((yy + frame) % 2) else (120, 176, 206); L[yy, xx, 3] = 235
    return L


def grain(a, seed):
    """the film's grain at the source, the analog part, on what is painted only (the rig's own film is in a render; the
    stand-in bake gets it here)"""
    rng = np.random.default_rng(seed)
    n = rng.normal(0, 5.0, a.shape[:2])
    op = a[..., 3] > 0
    for k in range(3): a[..., k][op] = np.clip(a[..., k][op] + n[op], 0, 255)
    return a


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    os.makedirs(DEST, exist_ok=True)
    man = {'about': 'BOSSES 11/2: the three places painted in the map\'s own look (tools/bohemia_bosses_paint_their_places_11_2_26.py), '
                    'before and after he falls, two beat frames each; and the four small things his verbs leave. bx/by = the block\'s '
                    'ground centre in the picture, plate = the ground plate across in picture pixels (the game scales it to the block).',
           'draft': True, 'pictures': {}}
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        rig = os.path.exists(fn)
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64) if rig else grain(sc['bake4'].astype(np.float64), sum(map(ord, sc['district'])))
        key = sc['name'] + ('' if sc['name'] in PROPS and sc['name'] != 'main' else ('_after' if sc['after'] else '_before'))
        for fr in (0, 1):
            out = over(base, moving(sc, fr))
            im = Image.fromarray(out.round().clip(0, 255).astype(np.uint8), 'RGBA')
            im.save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=sc['w'], h=sc['h'], bx=sc['bx'], by=sc['by'], plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key],
                                    through_the_rig=rig)
        print('  %-16s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(os.path.join(DEST, 'boss_places.json'), 'w'), indent=1)
    # the compare sheet: each place before and after beside the map's own pictures of its kind, at the same size
    try:
        tiles = [Image.open(os.path.join(DEST, '%s_%s_0.png' % (n, s))) for n in PLACES for s in ('before', 'after')]
        W = sum(t.width for t in tiles) + 10 * (len(tiles) + 1); H = max(t.height for t in tiles) + 20
        sheet = Image.new('RGBA', (W, H), (20, 18, 16, 255)); x = 10
        for t in tiles: sheet.alpha_composite(t, (x, 10)); x += t.width + 10
        sheet.save(os.path.join(OUT, 'compare.png'))
    except Exception as e: print('compare sheet:', e)


if __name__ == '__main__':
    cmd = (sys.argv[1:] or ['all'])[0]
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
