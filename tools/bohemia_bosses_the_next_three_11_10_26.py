#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the next three change the map, each its own way] (11/10/26, VAMILY rules 443(a), 441; ask lines 167, 522).

THE BURN, THE SURVEYOR, THE CLIMB (the ladder's 4th, 5th and 6th). THE POT shut streets, THE TAP's pipe costs blood, THE FILTER's
machines fight where they stand. These three change the map three more ways, and this paints the piece each one leaves on a street
block, in the map's own look (the factory's parts, COOK's rig through the master rig, the unpainted plate THE CHECKPOINT carries so the
rig reads the same metres):

  DRUM      THE BURN's stoker post. BEFORE: a fuel drum burning in the street, his stoker in a heavy coat with a poker, his red jerrycans
            stacked behind, a plywood board scorched black (his mark burned on it). At night his side has no fire but these.
            AFTER: the same drum burning for anybody: two neighbours warming their hands, one in a blanket, a pot on the drum, the cans gone.
  SIGNPOST  THE SURVEYOR's chainmen take every street sign down on his side (Britain did it in 1940, so an enemy could not find his way).
            BEFORE: a sign pole with the blades cut off, his orange flagging tied round the stub, an orange X sprayed on the street, a
            survey stake pulled up and lying. AFTER: two new blades bolted on, a fresh stake standing with its flag, a chalk line.
  RIGGERS   THE CLIMB's riggers off his hoist, the party that comes after you on the map. BEFORE: two riggers in hard hats and harness,
            a coil of rope, one swinging the hook on its chain. AFTER: one of the people he kept up top, come down: a woman with a sack
            on her back and a case, a coil of rope dropped at her feet.
  Not oriented. ONE street block across, no ground.

  python3 tools/bohemia_bosses_the_next_three_11_10_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK: the twins are each boss's own place (THE FUEL YARD, THE SURVEY OFFICE, THE HOIST) and THE CHECKPOINT at the same scale
(records/target/bosses_the_next_three/compare.png); the real things: a 55-gallon burn barrel, a city street sign pole and a surveyor's
lath stake with flagging tape, a construction hoist rigger's harness and hard hat. No reference game.
ANALOG HORROR: one fire in a black street and a man beside it who decides who stands near it; a pole with no names on it and orange
tape moving in the wind; two men coming down the street with a hook swinging. After: hands over a drum, a street with its name back,
a woman with everything she owns on her back at the bottom of a tower.
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB
import bohemia_bosses_the_pots_ground_11_8_26 as G

OUT = os.path.join(R, 'records/target/bosses_the_next_three')
DEST = PB.DEST
STEEL, STEEL_DK, RUST, RUST_DK = PB.STEEL, PB.STEEL_DK, PB.RUST, PB.RUST_DK
WOOD, WOOD_DK = G.WOOD, G.WOOD_DK
PANTS, SKIN = G.PANTS, G.SKIN
DRUM, DRUM_DK = (70, 64, 58), (44, 40, 36)
CAN, CAN_DK = (150, 40, 32), (104, 28, 22)
COAT, COAT_DK = (52, 46, 40), (34, 30, 26)
SCORCH = (26, 22, 20)
BLANKET, BLANKET_DK = (128, 96, 70), (92, 68, 50)
KIDCOAT, KIDCOAT_DK = (70, 96, 120), (48, 66, 84)
POLE = (118, 120, 116)
ORANGE = (232, 104, 34)
SIGN, SIGN_DK = (30, 110, 64), (20, 76, 44)
CHALK = (214, 210, 196)
LATH = (190, 160, 110)
HAT, HAT_DK = (226, 178, 40), (170, 132, 28)
HARNESS = (40, 40, 38)
ROPE = (176, 150, 96)
WOMAN, WOMAN_DK = (120, 52, 56), (86, 36, 40)
SACK, SACK_DK = (150, 136, 104), (112, 100, 76)
CASE, CASE_DK = (88, 64, 44), (62, 44, 30)
BLOCK, PLATE_PX = G.BLOCK, G.PLATE_PX
SIZE = 1.6


def body(s, x, y, coat, coat_dk, z=0.0, tall=1.0, head=SKIN):
    """a person standing: legs, a coat, a head (the map's own small people, THE CHECKPOINT's line cooks' build)"""
    s.box((x, y, z), (0.22, 0.22, 0.85 * tall), {'c': PANTS}); s.box((x + 0.3, y, z), (0.22, 0.22, 0.85 * tall), {'c': PANTS})
    s.box((x - 0.06, y - 0.06, z + 0.85 * tall), (0.64, 0.36, 0.8 * tall), {'top': {'c': coat}, 'px': {'c': coat}, 'py': {'c': coat}, 'nx': {'c': coat_dk}, 'ny': {'c': coat_dk}})
    s.prism(x + 0.26, y + 0.12, z + 1.65 * tall, 0.17, 0.3, 10, {'c': head}, {'c': head})


def drum(after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.prism(4.6, 4.6, 0, 0.75, 1.5, 14, {'c': DRUM}, {'c': DRUM_DK})                                   # the drum
    s.prism(4.6, 4.6, 1.5, 0.78, 0.08, 14, {'c': RUST_DK}, {'c': RUST_DK})                             # its burned rim
    for k in range(3): s.box((3.6 + k * 0.35, 4.0, 1.4 + (k % 2) * 0.15), (0.3, 1.2, 0.12), {'c': WOOD_DK})   # the pallet wood sticking out
    if not after:
        body(s, 6.3, 4.4, COAT, COAT_DK, tall=1.12)                                                    # his stoker, a big man in a heavy coat
        s.box((5.6, 4.5, 1.2), (0.9, 0.08, 0.08), {'c': STEEL_DK})                                      # his poker, into the fire
        for i in range(3):
            for j in range(2): s.box((2.2 + i * 0.62, 6.3 + j * 0.5, 0), (0.5, 0.36, 0.7), {'top': {'c': CAN}, 'px': {'c': CAN}, 'py': {'c': CAN_DK}, 'nx': {'c': CAN_DK}, 'ny': {'c': CAN_DK}})   # his fuel
        s.box((2.0, 7.4, 0), (2.2, 0.12, 1.9), {'c': WOOD}); s.box((2.3, 7.36, 0.6), (1.6, 0.06, 0.9), {'c': SCORCH})   # the board, his mark burned in
    else:
        body(s, 6.2, 4.2, BLANKET, BLANKET_DK)                                                         # a neighbour in a blanket
        s.box((5.6, 4.3, 1.45), (0.6, 0.16, 0.12), {'c': SKIN})                                         # hands out over the drum
        body(s, 4.4, 6.1, KIDCOAT, KIDCOAT_DK, tall=0.66)                                              # a kid
        s.box((4.5, 5.5, 1.0), (0.14, 0.5, 0.1), {'c': SKIN})
        s.prism(4.6, 4.6, 1.58, 0.42, 0.42, 12, {'c': STEEL}, {'c': STEEL_DK})                          # a pot on the drum
    return s


def signpost(after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((4.8, 4.8, 0), (0.22, 0.22, 4.4 if after else 2.6), {'c': POLE})                             # the pole (cut short before)
    if not after:
        s.box((4.74, 4.74, 2.1), (0.34, 0.34, 0.36), {'c': ORANGE})                                     # his flagging round the stub
        s.box((5.0, 4.86, 1.7), (0.08, 0.5, 0.5), {'c': ORANGE})                                        # its tail, in the wind
        s.box((3.2, 5.6, 0), (1.6, 0.26, 0.02), {'c': ORANGE}); s.box((3.87, 4.95, 0), (0.26, 1.6, 0.02), {'c': ORANGE})   # his X on the street
        s.box((6.2, 3.0, 0), (1.5, 0.12, 0.12), {'c': LATH}); s.box((7.5, 2.96, 0.05), (0.3, 0.2, 0.1), {'c': ORANGE})   # a stake pulled up, lying
        s.box((5.6, 6.4, 0), (0.7, 0.5, 0.04), {'c': SIGN_DK})                                          # a blade on the ground, bent
    else:
        s.box((4.0, 4.86, 3.7), (1.8, 0.1, 0.4), {'c': SIGN})                                           # two blades back on
        s.box((4.86, 4.0, 4.15), (0.1, 1.8, 0.4), {'c': SIGN_DK})
        s.box((4.86, 4.86, 4.4), (0.12, 0.12, 0.12), {'c': STEEL_DK})
        s.box((6.6, 3.4, 0), (0.12, 0.12, 1.4), {'c': LATH}); s.box((6.62, 3.42, 1.2), (0.1, 0.42, 0.26), {'c': ORANGE})   # a fresh stake, standing
        s.box((1.0, 6.0, 0), (8.0, 0.14, 0.02), {'c': CHALK})                                           # his chain line on the street
    return s


def riggers(after):
    from bohemia_iso3d import Scene
    s = Scene()
    if not after:
        for (x, y) in ((3.6, 4.2), (5.4, 5.6)):
            body(s, x, y, COAT_DK, HARNESS)
            s.box((x - 0.08, y + 0.14, 1.25), (0.68, 0.08, 0.1), {'c': HAT_DK})                         # the harness strap
            s.prism(x + 0.26, y + 0.12, 1.92, 0.24, 0.12, 10, {'c': HAT}, {'c': HAT_DK})                # the hard hat
        s.prism(3.0, 5.5, 0, 0.55, 0.3, 12, {'c': ROPE}, {'c': ROPE})                                   # a coil of rope over the street
        s.box((6.0, 5.7, 1.5), (0.1, 0.1, 0.1), {'c': SKIN})                                            # his fist, up
        for k in range(4): s.box((6.05 + k * 0.32, 5.72, 1.5 - k * 0.22), (0.24, 0.08, 0.08), {'c': STEEL})   # the chain, out
        s.box((7.3, 5.66, 0.55), (0.3, 0.2, 0.36), {'c': STEEL_DK})                                     # the hook
    else:
        body(s, 4.6, 4.6, WOMAN, WOMAN_DK)                                                             # she came down
        s.box((4.5, 5.0, 1.0), (0.8, 0.5, 1.0), {'top': {'c': SACK}, 'px': {'c': SACK}, 'py': {'c': SACK_DK}, 'nx': {'c': SACK_DK}, 'ny': {'c': SACK_DK}})   # everything, on her back
        s.box((5.6, 3.8, 0), (0.9, 0.3, 0.7), {'top': {'c': CASE}, 'px': {'c': CASE}, 'py': {'c': CASE_DK}, 'nx': {'c': CASE_DK}, 'ny': {'c': CASE_DK}})   # a case
        s.prism(3.0, 6.4, 0, 0.55, 0.3, 12, {'c': ROPE}, {'c': ROPE})                                   # the rope dropped at her feet
    return s


SCENES = [('drum', drum), ('signpost', signpost), ('riggers', riggers)]


def capture(name, build, after):
    from bohemia_iso3d import bake
    s = build(after)
    # 1.6 times the line cooks' build (measured 11/10 on the compare sheet: at THE CHECKPOINT's size a man was a sixth of a block and the
    # pole one pixel wide; a piece that changes the map must read at a glance on the phone, so it stands bigger, the block's frame the same)
    k = SIZE
    s.faces = [([(5.0 + (x - 5.0) * k, 5.0 + (y - 5.0) * k, z * k) for (x, y, z) in verts], uv, n, m) for verts, uv, n, m in s.faces]
    scale = PLATE_PX / (2.0 * BLOCK)
    P3 = [(x, y, z) for verts, _u, _n, _m in s.faces for (x, y, z) in verts] + [(0, 0, 0), (BLOCK, 0, 0), (0, BLOCK, 0), (BLOCK, BLOCK, 0), (5, 5, 5.0 * k)]
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for (x, y, z) in P3]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 30                                             # the same frame before and after (the kill's tape draws both into one box)
    W = int(math.ceil(mxx - mnx)) + 12; H = int(math.ceil(mxy - mny)) + 10 + top
    origin = (6 - mnx, top + 2 - mny)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in s.faces]
    g0, g1 = -2.5, BLOCK + 2.5                           # the unpainted plate (THE CHECKPOINT's), so the rig reads the kitchen's metres
    faces.append(([(g0, g0, 0.0), (g1, g0, 0.0), (g1, g1, 0.0), (g0, g1, 0.0)], (0.0, 0.0, 1.0), None))
    c = BLOCK / 2.0
    return dict(district='boss_%s_%s' % (name, 'after' if after else 'before'), name=name, after=after, w=W, h=H, origin=tuple(origin),
                scale=float(scale), faces=faces, bbox=(0, 0, W, H), bank_w=W, bank_h=H, bx=int(round(origin[0])), by=int(round(origin[1] + c * scale)),
                plate=PLATE_PX, bake4=bake(s, W, H, origin=origin, scale=scale, ss=4))


def scenes():
    os.makedirs(OUT, exist_ok=True)
    S = [capture(n, b, af) for n, b in SCENES for af in (False, True)]
    # one frame for each pair: the before and the after the same size (the tape draws both into the after's box)
    for i in range(0, len(S), 2):
        a, b = S[i], S[i + 1]
        if (a['w'], a['h']) != (b['w'], b['h']):
            print('  %s: before %dx%d after %dx%d (the tape draws both into the after\'s box)' % (a['name'], a['w'], a['h'], b['w'], b['h']))
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


def P(sc, p):
    k = SIZE; return PB.proj(sc, (5.0 + (p[0] - 5.0) * k, 5.0 + (p[1] - 5.0) * k, p[2] * k))


def moving(sc, frame):
    """the drum's fire flickers on the beat (both states); his flagging moves in the wind; the hook swings; she stands still"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    n, af = sc['name'], sc['after']
    if n == 'drum':
        x, y = P(sc, (4.6, 4.6, 1.7))
        PB.blob(L, x, y - (3 if frame else 1), 7.0 if frame else 5.6, (252, 150, 50), 0.9)
        PB.blob(L, x + (1 if frame else -1), y - 6, 3.6, (255, 220, 120), 0.85)
        L = PB.over(L, PB.column(sc, (5.0 + (4.6 - 5.0) * SIZE, 5.0 + (4.6 - 5.0) * SIZE, 2.4 * SIZE), frame, (40, 36, 34), 0.5, n=4, grow=0.7))
    elif n == 'signpost' and not af:
        x, y = P(sc, (5.1, 5.3, 1.95))
        PB.blob(L, x + (2 if frame else 0), y, 2.2, ORANGE, 0.9)
    elif n == 'riggers' and not af:
        x, y = P(sc, (7.45, 5.76, 0.75))
        PB.blob(L, x + (3 if frame else -2), y + (1 if frame else 0), 2.0, (150, 148, 142), 0.85)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    if 'THE NEXT THREE' not in man['about']:
        man['about'] += (' And THE NEXT THREE (tools/bohemia_bosses_the_next_three_11_10_26.py): THE BURN\'s DRUM (his stoker\'s fire, then '
                         'the neighbours\'), THE SURVEYOR\'s SIGNPOST (the blades cut off, then back), THE CLIMB\'s RIGGERS (his party, then '
                         'the one he kept up top, come down); plate = ONE street block across, no ground.')
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
        print('  %-18s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    try:
        rows = [('depot_before', 'drum_before', 'checkpoint_y_before', 'depot_after', 'drum_after'),
                ('office_before', 'signpost_before', 'checkpoint_y_before', 'office_after', 'signpost_after'),
                ('hoist_before', 'riggers_before', 'checkpoint_y_before', 'hoist_after', 'riggers_after')]
        kp = man['pictures']['depot_before']['plate']; f = PLATE_PX / (kp / 1.3)
        sheet_rows = []
        for rw in rows:
            ts = [Image.open(os.path.join(DEST, k + '_0.png')) for k in rw]
            ts = [t if k.split('_')[0] in ('depot', 'office', 'hoist') else t.resize((max(1, round(t.width / f)), max(1, round(t.height / f))), Image.LANCZOS) for k, t in zip(rw, ts)]
            sheet_rows.append(ts)
        W = max(sum(t.width for t in r) for r in sheet_rows) + 20 * 6; Hr = [max(t.height for t in r) + 20 for r in sheet_rows]
        sheet = Image.new('RGBA', (W * 2, sum(Hr) * 2), (20, 18, 16, 255)); yy = 10
        for r, h in zip(sheet_rows, Hr):
            x = 10
            for t in r:
                t2 = t.resize((t.width * 2, t.height * 2), Image.NEAREST); sheet.alpha_composite(t2, (x, yy)); x += t2.width + 20
            yy += h * 2
        os.makedirs(OUT, exist_ok=True); sheet.save(os.path.join(OUT, 'compare.png')); print('  compare sheet', os.path.join(OUT, 'compare.png'))
    except Exception as e:
        print('  compare sheet failed:', e)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
