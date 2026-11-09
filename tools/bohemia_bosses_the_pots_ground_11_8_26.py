#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the first boss changes the map] (11/8/26, VAMILY rule 437(a); ask lines 167, 346, 522).

PAOLO 10/26 (rule 243): 'there are supposed to be bosses in this game where you're able to alter the map and what's going on in
the world around you, that's gonna be super important.' The coordinator's 11/8 line: what changes is REAL: the ground his crew
held, the roads they closed, the feed. MEASURED FIRST (records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md): THE POT's
fall changed one picture (his kitchen) and a lights row; his crew held no street, no road was ever closed, so nothing on the map
worked differently after him.

THIS PAINTS HIS CREW'S CHECKPOINT, the thing that closes a street, in the map's own look, the first three places' way (reuse
first: the district factory's parts, tools/bohemia_iso3d.py's projection, COOK's rig render through the master rig; the boss
places' tool's helpers are imported, never edited):
  CHECKPOINT  a strip street shut by THE POT's line cooks: shopping carts chained in a row across the lanes, a speed rack off
              his kitchen on its side, a burned sedan across one lane, a pallet wall, a burn barrel, a pole with a dirty kitchen
              towel for a flag (his kitchen's red band on it), two of his cooks in whites standing at the carts.
              BEFORE: shut, the barrel burning (on the beat), the two cooks there. AFTER: the carts shoved to the kerb in a line,
              the car still at the kerb (nobody tows anything in this valley), the towel down in the street, the barrel cold, nobody.
  Two ways round (the map's streets run along x or along y): 'checkpoint_x' shuts a street that runs along x (the barricade lies
  along y), 'checkpoint_y' the other one. Each before and after, two beat frames.
  The picture is ONE STREET BLOCK across (plate = the block's width in the picture's pixels, the game scales it to the block),
  and has no ground of its own: the map's street shows through.

  python3 tools/bohemia_bosses_the_pots_ground_11_8_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_the_pots_ground_11_8_26.py render   (through the rig; bpy 4.2)
  python3 tools/bohemia_bosses_the_pots_ground_11_8_26.py finish     (beat frames -> slices/boss_places/, rows in boss_places.json)
  (all three: 'all')

REFERENCE CHECK (the 9/4 standing duty): the twins are THE KITCHEN at the same scale (records/target/bosses_ground/compare.png puts
the checkpoint beside the kitchen, before and after) and the map's own street; the real things: shopping carts chained across a
street (encampment barricades), a restaurant's wire speed rack, a burned-out sedan, a burn barrel, a kitchen towel on a pole.
No reference game.
ANALOG HORROR (rule 9 of the law): the horror is ordinary things turned into a wall: carts nobody pushes, a kitchen towel for a
flag, two men in cook's whites standing at a fire in the middle of the road day and night; after, the street is just a street
again with the junk at the kerb, which is how a real road reopens.
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB

OUT = os.path.join(R, 'records/target/bosses_ground')
DEST = PB.DEST
STEEL, STEEL_DK, RUST, RUST_DK = PB.STEEL, PB.STEEL_DK, PB.RUST, PB.RUST_DK
RED_BAND = PB.RED_BAND
CART, CART_DK = (150, 150, 146), (104, 104, 100)
CART_RED = (150, 46, 38)
CAR, CAR_DK, CAR_BURN = (62, 58, 54), (38, 35, 32), (70, 52, 40)
WOOD, WOOD_DK = (132, 98, 62), (98, 72, 46)
TOWEL = (204, 196, 176)
WHITES, WHITES_DK = (214, 208, 194), (168, 162, 150)
PANTS, SKIN, CAP = (38, 36, 34), (150, 104, 76), (226, 222, 210)
BLOCK = 10.0                 # a street block, side, in the factory's units (the kitchen's plate is 1.3 blocks: 28 units across)
PLATE_PX = 116               # the block's width in the picture's pixels (the game scales it to TW)


def cart(s, x, y, along_x, z=0.0, tipped=False):
    """a shopping cart: a wire basket on a frame, the red handle; along_x = the cart's long side runs along x"""
    L, W, Hh = (1.0, 0.6, 1.0) if along_x else (0.6, 1.0, 1.0)
    if tipped:   # on its side: low and long
        L, W, Hh = (1.0, 1.0, 0.6) if along_x else (1.0, 1.0, 0.6)
    s.box((x, y, z + 0.18), (L, W, Hh - 0.18), {'top': {'c': CART_DK}, 'px': {'c': CART}, 'py': {'c': CART}, 'nx': {'c': CART_DK}, 'ny': {'c': CART_DK}})
    s.box((x + 0.05, y + 0.05, z), (L - 0.1, W - 0.1, 0.18), {'c': STEEL_DK})                     # the frame and wheels
    if along_x: s.box((x + L - 0.08, y - 0.02, z + Hh - 0.12), (0.12, W + 0.04, 0.12), {'c': CART_RED})   # the handle
    else: s.box((x - 0.02, y + W - 0.08, z + Hh - 0.12), (L + 0.04, 0.12, 0.12), {'c': CART_RED})


def sedan(s, x, y, along_x, burned=True):
    L, W = (4.4, 1.8) if along_x else (1.8, 4.4)
    body = {'top': {'c': CAR_BURN}, 'px': {'c': CAR}, 'py': {'c': CAR}, 'nx': {'c': CAR_DK}, 'ny': {'c': CAR_DK}}
    s.box((x, y, 0.3), (L, W, 0.8), body)
    if along_x: s.box((x + 1.2, y + 0.15, 1.1), (2.0, W - 0.3, 0.55), {'top': {'c': RUST_DK}, 'px': {'c': (26, 24, 22)}, 'py': {'c': (26, 24, 22)}, 'nx': {'c': (26, 24, 22)}, 'ny': {'c': (26, 24, 22)}})
    else: s.box((x + 0.15, y + 1.2, 1.1), (W - 0.3, 2.0, 0.55), {'top': {'c': RUST_DK}, 'px': {'c': (26, 24, 22)}, 'py': {'c': (26, 24, 22)}, 'nx': {'c': (26, 24, 22)}, 'ny': {'c': (26, 24, 22)}})
    s.box((x + 0.25, y + 0.25, 0), (L - 0.5, W - 0.5, 0.3), {'c': (22, 20, 18)})                    # sat down on its rims, no tyres


def cook(s, x, y):
    """one of his line cooks in whites at the carts: legs, a white jacket, an apron's edge, a head, a white cap"""
    s.box((x, y, 0), (0.22, 0.22, 0.85), {'c': PANTS}); s.box((x + 0.3, y, 0), (0.22, 0.22, 0.85), {'c': PANTS})
    s.box((x - 0.04, y - 0.04, 0.85), (0.6, 0.32, 0.75), {'top': {'c': WHITES}, 'px': {'c': WHITES}, 'py': {'c': WHITES}, 'nx': {'c': WHITES_DK}, 'ny': {'c': WHITES_DK}})
    s.box((x + 0.06, y + 0.26, 0.55), (0.4, 0.04, 0.6), {'c': WHITES_DK})                          # the apron hanging
    s.prism(x + 0.26, y + 0.12, 1.6, 0.17, 0.3, 10, {'c': SKIN}, {'c': SKIN})
    s.prism(x + 0.26, y + 0.12, 1.9, 0.19, 0.22, 10, {'c': CAP}, {'c': CAP})


def checkpoint(after, along):
    """along = the street runs along this axis ('x' or 'y'); the barricade lies across it. The block is 0..BLOCK both ways, the
    street's lanes down the middle third, the kerbs at 2.5 and 7.5."""
    from bohemia_iso3d import Scene
    s = Scene()
    sw = (lambda x, y: (x, y)) if along == 'y' else (lambda x, y: (y, x))   # built for a street along y; mirrored for one along x
    ax = (along == 'x')

    def put(fn, x, y, *a, **k):
        X, Y = sw(x, y)
        fn(s, X, Y, *a, **k)

    def bx(pos, size, m):
        (x, y, z), (dx, dy, dz) = pos, size
        if ax: s.box((y, x, z), (dy, dx, dz), m)
        else: s.box((x, y, z), (dx, dy, dz), m)

    def pr(x, y, *a, **k):
        X, Y = sw(x, y); s.prism(X, Y, *a, **k)
    # the street (along y) is x in 2.5..7.5; the barricade lies along x, at y ~ 4.4..5.8
    if not after:
        for i, cx in enumerate((2.3, 3.3, 4.3, 5.3, 6.3, 7.2)):
            put(cart, cx, 4.6 + (0.25 if i % 2 else 0.0), not ax, tipped=(i == 2))
        bx((2.3, 4.55, 0.55), (5.9, 0.06, 0.06), {'c': (70, 70, 66)})                               # the chain through them
        bx((5.2, 5.9, 0), (1.9, 0.5, 1.7), {'top': {'c': STEEL}, 'px': {'c': STEEL_DK}, 'py': {'c': STEEL}, 'nx': {'c': STEEL_DK}, 'ny': {'c': STEEL}})   # his speed rack on its side
        for k in range(4): bx((5.25, 5.85, 0.3 + k * 0.4), (1.8, 0.6, 0.06), {'c': CART})
        put(sedan, 0.9, 5.7, not ax)                                                                # burned, across the near lane's kerb
        for k in range(3): bx((7.6, 4.3 + k * 0.15, k * 0.35), (1.8, 1.0, 0.33), {'top': {'c': WOOD}, 'px': {'c': WOOD_DK}, 'py': {'c': WOOD}, 'nx': {'c': WOOD_DK}, 'ny': {'c': WOOD_DK}})   # pallets
        pr(4.3, 6.6, 0, 0.42, 1.0, 10, {'c': RUST}, {'c': (40, 26, 18)}, inner=0.34)                  # the burn barrel
        bx((3.0, 4.2, 0), (0.12, 0.12, 3.6), {'c': STEEL_DK})                                       # the pole
        bx((3.12, 4.2, 2.5), (1.5, 0.05, 1.0), {'c': TOWEL}); bx((3.12, 4.18, 2.85), (1.5, 0.06, 0.18), {'c': RED_BAND})   # his towel, his red band
        put(cook, 3.5, 6.2); put(cook, 5.4, 6.9)
    else:
        for i, cy in enumerate((2.4, 3.4, 4.4, 5.4)):
            put(cart, 1.5, cy, ax, tipped=(i == 1))                                                 # shoved to the kerb, nose to tail
        put(sedan, 0.3, 5.9, ax)                                                                    # the car at the kerb, still burned
        bx((7.8, 6.4, 0), (1.9, 0.5, 1.7), {'top': {'c': STEEL}, 'px': {'c': STEEL_DK}, 'py': {'c': STEEL}, 'nx': {'c': STEEL_DK}, 'ny': {'c': STEEL}})   # the rack against the far kerb
        for k in range(2): bx((7.9, 4.0, k * 0.35), (1.8, 1.0, 0.33), {'top': {'c': WOOD}, 'px': {'c': WOOD_DK}, 'py': {'c': WOOD}, 'nx': {'c': WOOD_DK}, 'ny': {'c': WOOD_DK}})
        pr(8.6, 2.6, 0, 0.42, 1.0, 10, {'c': RUST_DK}, {'c': (30, 22, 16)}, inner=0.34)               # the barrel cold, at the kerb
        bx((4.4, 3.2, 0), (3.6, 0.12, 0.12), {'c': STEEL_DK})                                       # the pole down in the street
        bx((4.6, 3.35, 0.02), (1.5, 1.0, 0.04), {'c': TOWEL}); bx((4.6, 3.35, 0.06), (1.5, 0.18, 0.03), {'c': RED_BAND})   # the towel in the road
    return s


SCENES = [('checkpoint_x', 'x'), ('checkpoint_y', 'y')]


def capture(name, along, after):
    """the block's own frame: scale from the block (never from what stands on it), the anchor at the block's ground centre"""
    from bohemia_iso3d import bake
    s = checkpoint(after, along)
    scale = PLATE_PX / (2.0 * BLOCK)
    P3 = [(x, y, z) for verts, _u, _n, _m in s.faces for (x, y, z) in verts] + [(0, 0, 0), (BLOCK, 0, 0), (0, BLOCK, 0), (BLOCK, BLOCK, 0)]
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for (x, y, z) in P3]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 30                                             # room over the barrel's flame and the flag; the SAME frame before and after
                                                         # (measured 11/8: at 8 the after was 22 px shorter, and the kill's tape, which
                                                         # draws both into the after's box, squashed the closed checkpoint)
    W = int(math.ceil(mxx - mnx)) + 12; H = int(math.ceil(mxy - mny)) + 10 + top
    origin = (6 - mnx, top + 2 - mny)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in s.faces]
    # the rig sizes a scene in metres off its ground plate (plate_units: the faces at grade). This picture has no ground (the map's
    # street shows through), so it carries an unpainted plate (material None: the rig counts it and never draws it) the size of
    # THE KITCHEN's own pad, 15 units: the same metres a unit, the same dents, grime and light as the place it belongs to.
    # Measured 11/8: without it the rig read 0.3 units of 'plate', made the carts 300 m tall and put its camera inside them.
    g0, g1 = -2.5, BLOCK + 2.5
    faces.append(([(g0, g0, 0.0), (g1, g0, 0.0), (g1, g1, 0.0), (g0, g1, 0.0)], (0.0, 0.0, 1.0), None))
    c = BLOCK / 2.0
    bxp = int(round(origin[0] + (c - c) * scale)); byp = int(round(origin[1] + (c + c) * scale * 0.5))
    return dict(district='boss_%s_%s' % (name, 'after' if after else 'before'), name=name, along=along, after=after, w=W, h=H, origin=tuple(origin),
                scale=float(scale), faces=faces, bbox=(0, 0, W, H), bank_w=W, bank_h=H, bx=bxp, by=byp, plate=PLATE_PX,
                bake4=bake(s, W, H, origin=origin, scale=scale, ss=4))


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
    """what moves on the beat: the barrel's fire and its smoke (before only); after, nothing moves: the street is quiet"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    if sc['after']: return L
    X, Y = (4.3, 6.6) if sc['along'] == 'y' else (6.6, 4.3)
    L = PB.over(L, PB.column(sc, (X, Y, 1.4), frame, (40, 36, 32), 0.7, n=4, grow=0.5, drift=0.5))
    x, y = PB.proj(sc, (X, Y, 0.95))
    PB.blob(L, x, y - 1, 3.6, (255, 128, 40), 0.85 if frame else 0.6)
    PB.blob(L, x + (0.6 if frame else -0.6), y - 3.5, 2.2, (255, 196, 100), 0.85)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    if ' BOSSES 11/8:' not in man['about']:
        man['about'] += (' BOSSES 11/8 (rule 437(a)): THE POT\'s crew\'s CHECKPOINT that shuts a street, closed and then shoved to the kerb, '
                         'for a street along x and along y (tools/bohemia_bosses_the_pots_ground_11_8_26.py); plate = ONE street block across, no ground.')
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
        print('  %-24s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    # the compare sheet: THE KITCHEN beside the checkpoint, before and after, the checkpoint at its game size against the kitchen's
    try:
        k0 = Image.open(os.path.join(DEST, 'kitchen_before_0.png')); k1 = Image.open(os.path.join(DEST, 'kitchen_after_0.png'))
        kp = man['pictures']['kitchen_before']['plate']; f = PLATE_PX / (kp / 1.3)        # the kitchen draws 1.3 blocks wide, the checkpoint 1
        tiles = [k0, Image.open(os.path.join(DEST, 'checkpoint_x_before_0.png')), Image.open(os.path.join(DEST, 'checkpoint_y_before_0.png')),
                 k1, Image.open(os.path.join(DEST, 'checkpoint_x_after_0.png')), Image.open(os.path.join(DEST, 'checkpoint_y_after_0.png'))]
        tiles = [t if i % 3 == 0 else t.resize((max(1, round(t.width / f)), max(1, round(t.height / f))), Image.LANCZOS) for i, t in enumerate(tiles)]
        W = max(sum(t.width for t in tiles[:3]), sum(t.width for t in tiles[3:])) + 40; H = max(t.height for t in tiles) * 2 + 30
        sheet = Image.new('RGBA', (W * 2, H * 2), (20, 18, 16, 255))
        for row in range(2):
            x = 10
            for t in tiles[row * 3:(row + 1) * 3]:
                t2 = t.resize((t.width * 2, t.height * 2), Image.NEAREST); sheet.alpha_composite(t2, (x, 10 + row * H)); x += t2.width + 20
        os.makedirs(OUT, exist_ok=True); sheet.save(os.path.join(OUT, 'compare.png'))
        print('  compare sheet', os.path.join(OUT, 'compare.png'))
    except Exception as e:
        print('  compare sheet failed:', e)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
