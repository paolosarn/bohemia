#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the next two change the map, each its own way] (11/9/26, VAMILY rule 440(b); ask lines 167, 522).

THE FILTER (the ladder's third: 'the last clean-water setup'; his row's lesson: 'He keeps the plant's robots walking. Kill the keeper
and every machine of his drops where it stands.'). THE POT closed streets, THE TAP's pipe costs blood; THE FILTER's way is his
MACHINES: the water plant's old maintenance robots standing guard round his settling tanks. Walk up to one and it fights; kill him and
every one of them drops where it stands, and the wrecks stay on the map for your men to strip.

THIS PAINTS THE MACHINE, standing and dropped, in the map's own look, THE CHECKPOINT's way (the factory's parts, COOK's rig through the
master rig, the unpainted plate the kitchen's size so the rig reads the same metres):
  MACHINE  STANDING: a municipal plant robot taller than a man, a faded green-yellow cabinet body with the plant's stencil band, two
           stub legs on a skid, an arm with a valve key, a camera head with one lamp eye that blinks the tanks' sick green on the beat,
           a cable trailing back toward the tanks. DROPPED: the same machine on its back across the street, the head off beside it,
           the arm bent, green coolant pooled under it, the lamp dark.
  Not oriented (it stands in the street, not along it). ONE street block across, no ground.

  python3 tools/bohemia_bosses_the_filters_machines_11_9_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK: the twins are THE SETTLING TANKS (his place) and THE CHECKPOINT at the same scale (records/target/bosses_the_filters_machines/
compare.png); the real things: a utility's inspection robot and a remotely operated valve actuator, municipal plant paint and stencils.
The game's own robots are the fight's wiederganger (the necromancer is a man reviving his robots, rule of 9/29). No reference game.
ANALOG HORROR: a machine still standing its post with nobody to tell it the plant died, one lamp eye blinking the colour of bad water;
after, a dead machine across a street and kids pulling wire out of it.
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB
import bohemia_bosses_the_pots_ground_11_8_26 as G

OUT = os.path.join(R, 'records/target/bosses_the_filters_machines')
DEST = PB.DEST
STEEL, STEEL_DK, RUST, RUST_DK = PB.STEEL, PB.STEEL_DK, PB.RUST, PB.RUST_DK
BODY, BODY_DK = (132, 136, 92), (98, 102, 66)          # municipal plant paint, faded
BAND = (196, 190, 168)
HEAD, HEAD_DK = (70, 72, 70), (46, 48, 46)
LENS = (24, 30, 24)
CABLE = (34, 34, 32)
COOLANT = (88, 120, 30)
BLOCK, PLATE_PX = G.BLOCK, G.PLATE_PX


def machine(after):
    from bohemia_iso3d import Scene
    s = Scene()
    bm = {'top': {'c': BODY}, 'px': {'c': BODY}, 'py': {'c': BODY_DK}, 'nx': {'c': BODY_DK}, 'ny': {'c': BODY_DK}}
    if not after:
        s.box((3.6, 3.8, 0), (2.8, 2.4, 0.35), {'c': STEEL_DK})                                       # the skid
        s.box((3.9, 4.2, 0.35), (0.7, 0.7, 1.3), {'c': STEEL}); s.box((5.4, 4.2, 0.35), (0.7, 0.7, 1.3), {'c': STEEL})   # the stub legs
        s.box((3.7, 3.9, 1.65), (2.6, 2.0, 2.6), bm)                                                  # the cabinet body
        s.box((3.68, 3.88, 3.1), (2.64, 2.04, 0.36), {'c': BAND})                                     # the plant's stencil band
        s.box((4.3, 4.3, 4.25), (1.4, 1.2, 0.9), {'top': {'c': HEAD}, 'px': {'c': HEAD}, 'py': {'c': HEAD_DK}, 'nx': {'c': HEAD_DK}, 'ny': {'c': HEAD_DK}})   # the camera head
        s.box((5.68, 4.6, 4.45), (0.12, 0.6, 0.5), {'c': LENS})                                       # its lens, to the street (+x)
        s.box((6.3, 4.5, 2.6), (1.4, 0.4, 0.4), {'c': STEEL}); s.box((7.5, 4.3, 1.8), (0.3, 0.8, 1.1), {'c': RUST_DK})   # the arm and its valve key
        for k in range(5): s.box((3.2 - k * 0.55, 5.6 + k * 0.5, 0), (0.5, 0.16, 0.12), {'c': CABLE})   # the cable back toward the tanks
    else:
        s.box((2.2, 3.6, 0), (4.2, 2.2, 1.9), bm)                                                     # on its back across the street
        s.box((2.2, 3.58, 0.7), (4.2, 0.04, 0.5), {'c': BAND})
        s.box((1.4, 3.5, 0), (0.8, 2.4, 0.35), {'c': STEEL_DK})                                       # the skid, up in the air
        s.box((6.4, 4.0, 0.2), (1.3, 0.7, 0.7), {'c': STEEL}); s.box((6.4, 4.9, 0.2), (1.1, 0.7, 0.7), {'c': STEEL})   # the legs, out flat
        s.box((7.1, 6.6, 0), (1.4, 1.2, 0.9), {'top': {'c': HEAD}, 'px': {'c': HEAD}, 'py': {'c': HEAD_DK}, 'nx': {'c': HEAD_DK}, 'ny': {'c': HEAD_DK}})   # the head off beside it
        s.box((7.0, 6.9, 0.25), (0.12, 0.6, 0.5), {'c': LENS})
        s.box((3.0, 1.9, 0), (0.4, 1.7, 0.4), {'c': STEEL}); s.box((2.6, 1.6, 0), (0.9, 0.4, 0.6), {'c': RUST_DK})   # the arm bent off it
        s.box((2.4, 6.0, 0), (3.6, 1.4, 0.03), {'c': COOLANT})                                        # coolant pooled under it
    return s


def capture(after):
    from bohemia_iso3d import bake
    s = machine(after)
    scale = PLATE_PX / (2.0 * BLOCK)
    P3 = [(x, y, z) for verts, _u, _n, _m in s.faces for (x, y, z) in verts] + [(0, 0, 0), (BLOCK, 0, 0), (0, BLOCK, 0), (BLOCK, BLOCK, 0), (5, 5, 6.0)]
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for (x, y, z) in P3]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 12
    W = int(math.ceil(mxx - mnx)) + 12; H = int(math.ceil(mxy - mny)) + 10 + top
    origin = (6 - mnx, top + 2 - mny)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in s.faces]
    g0, g1 = -2.5, BLOCK + 2.5
    faces.append(([(g0, g0, 0.0), (g1, g0, 0.0), (g1, g1, 0.0), (g0, g1, 0.0)], (0.0, 0.0, 1.0), None))
    c = BLOCK / 2.0
    return dict(district='boss_machine_%s' % ('after' if after else 'before'), name='machine', after=after, w=W, h=H, origin=tuple(origin),
                scale=float(scale), faces=faces, bbox=(0, 0, W, H), bank_w=W, bank_h=H, bx=int(round(origin[0])), by=int(round(origin[1] + c * scale)),
                plate=PLATE_PX, bake4=bake(s, W, H, origin=origin, scale=scale, ss=4))


def scenes():
    os.makedirs(OUT, exist_ok=True)
    S = [capture(af) for af in (False, True)]
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
    """STANDING: the lamp eye blinks the tanks' sick green on the beat; DROPPED: nothing moves"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    if sc['after']: return L
    x, y = PB.proj(sc, (5.8, 4.9, 4.7))
    PB.blob(L, x, y, 3.2 if frame else 1.6, (150, 230, 60), 0.95 if frame else 0.45)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    if 'THE FILTER\'s MACHINE' not in man['about']:
        man['about'] += (' And THE FILTER\'s MACHINE, the plant robot standing its post, then dropped where it stood '
                         '(tools/bohemia_bosses_the_filters_machines_11_9_26.py); plate = ONE street block across, no ground.')
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        rig = os.path.exists(fn)
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64) if rig else PB.grain(sc['bake4'].astype(np.float64), sum(map(ord, sc['district'])))
        key = 'machine' + ('_after' if sc['after'] else '_before')
        for fr in (0, 1):
            out = PB.over(base, moving(sc, fr))
            Image.fromarray(out.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=sc['w'], h=sc['h'], bx=sc['bx'], by=sc['by'], plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key],
                                    through_the_rig=rig)
        print('  %-16s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    try:
        tiles = [Image.open(os.path.join(DEST, k + '_0.png')) for k in ('tanks_before', 'machine_before', 'checkpoint_y_before', 'tanks_after', 'machine_after', 'checkpoint_y_after')]
        kp = man['pictures']['tanks_before']['plate']; f = PLATE_PX / (kp / 1.3)
        tiles = [t if i % 3 == 0 else t.resize((max(1, round(t.width / f)), max(1, round(t.height / f))), Image.LANCZOS) for i, t in enumerate(tiles)]
        W = max(sum(t.width for t in tiles[:3]), sum(t.width for t in tiles[3:])) + 40; H = max(t.height for t in tiles) * 2 + 30
        sheet = Image.new('RGBA', (W * 2, H * 2), (20, 18, 16, 255))
        for row in range(2):
            x = 10
            for t in tiles[row * 3:(row + 1) * 3]:
                t2 = t.resize((t.width * 2, t.height * 2), Image.NEAREST); sheet.alpha_composite(t2, (x, 10 + row * H)); x += t2.width + 20
        os.makedirs(OUT, exist_ok=True); sheet.save(os.path.join(OUT, 'compare.png')); print('  compare sheet', os.path.join(OUT, 'compare.png'))
    except Exception as e:
        print('  compare sheet failed:', e)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
