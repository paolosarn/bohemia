#!/usr/bin/env python3
"""BOHEMIA -- BOSSES 4 [their places painted in the map's own look] (11/3/26, VAMILY rules 330, 337, 338; ask lines 328, 345, 346).

The places of THE BURN, THE SURVEYOR and THE CLIMB, made exactly the way BOSSES painted THE KITCHEN, THE PUMP HOUSE and THE SETTLING
TANKS (tools/bohemia_bosses_paint_their_places_11_2_26.py, imported and never edited: its capture's frame, its beat helpers, its
render through COOK's map rig, its finish's grain): each place a scene of the district hero factory's own parts in two states,
rendered through the master rig, what moves on the beat laid over in two frames. Pictures go beside the first three in
slices/boss_places/ and their rows are added to its boss_places.json (the first three's rows are kept as they are).

  THE FUEL YARD      two storage tanks behind a concrete berm, a loading rack, the yard office, drums. BEFORE: ONE BIG FIRE in
                     a pit in the yard, black smoke over it, every window dark (only his people warm). AFTER: the pit out, FOUR
                     BURN BARRELS lit along the street for anybody, the office lit, a lamp on the rack (his lights come back).
  THE SURVEY OFFICE  the old county survey office, two storeys of concrete, a survey tripod and a flag on the roof, a fence.
                     BEFORE: dark but ONE WINDOW flickering (he is in there with the map), razor wire on the fence. AFTER:
                     every window lit, the gate open, THE MAP on a board out front for anybody to copy.
  THE HOIST          a dead casino tower with a work hoist up its side. BEFORE: the cage parked AT THE TOP, the tower dark, a
                     red lamp blinking on the roof. AFTER: the cage DOWN at the landing with its work light on, THE TOP FLOORS
                     LIT (his lights come back, up there).
  and the three small things his verbs leave on a block: A BURN BARREL (lit, on the beat), A SURVEY STAKE AND TRIPOD (the
  flagging moving on the beat), AN OPENED CRATE OF CELLS WITH A COIL OF ROPE (what came down from up top).

  python3 tools/bohemia_bosses_paint_four_to_six_11_3_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_paint_four_to_six_11_3_26.py render
  python3 tools/bohemia_bosses_paint_four_to_six_11_3_26.py finish        (all three: 'all')

REFERENCE CHECK (the 9/4 standing duty): the twins are the first three places at the same scale (records/target/bosses_places_4_6/compare.png
puts them side by side) and the map's own district pictures; the real things: a bulk fuel terminal's vertical tanks and secondary
containment berm, a burn barrel; a county surveyor's office, a survey tripod with a total station, a stake with orange flagging;
an Alimak-style rack-and-pinion construction hoist on a high-rise, a red aviation obstruction lamp. No reference game.
ANALOG HORROR (rule 9 of the law): the dead state is the horror (one fire nobody else may stand at, one window lit in a dark
office, a cage parked at the top of a dead tower and a red lamp blinking on the beat); the after state is the world working again,
never clean plastic (the rig's grime stays).
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB

OUT = os.path.join(R, 'records/target/bosses_places_4_6')
DEST = PB.DEST
HF = PB.HF
win = PB.win
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK = PB.STEEL, PB.STEEL_DK, PB.CONC, PB.CONC_DK, PB.ROOF, PB.ROOF_DK
RUST, RUST_DK, LIT = PB.RUST, PB.RUST_DK, PB.LIT
TANK, TANK_DK = (148, 144, 134), (112, 108, 100)
DIRT = (110, 98, 80)
YEL, YEL_DK = (176, 150, 50), (130, 108, 36)
PAPER = (206, 198, 170)
TOWER, TOWER_DK = (150, 128, 104), (120, 100, 82)
WOOD = (120, 88, 56)


def depot(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 15, 13), groundc=DIRT)
    for (bx, by, sx, sy) in [(-0.6, -0.6, 12.6, 0.4), (-0.6, -0.6, 0.4, 7.4), (11.6, -0.6, 0.4, 7.4), (-0.6, 6.4, 12.6, 0.4)]:
        s.box((bx, by, 0), (sx, sy, 0.9), {'c': CONC})                                               # the berm round the tanks
    s.prism(3.0, 3.0, 0, 2.4, 4.2, 22, {'c': TANK}, {'c': TANK_DK})
    s.prism(8.7, 3.0, 0, 2.2, 3.6, 22, {'c': TANK}, {'c': TANK_DK})
    s.box((0.6, 2.85, 4.2), (4.8, 0.3, 0.12), {'c': STEEL_DK})                                       # the catwalk
    for x in (8.6, 11.0):                                                                           # the loading rack
        s.box((x, 7.6, 0), (0.3, 0.3, 3.2), {'c': STEEL_DK})
    s.box((8.3, 7.4, 3.2), (3.3, 2.0, 0.25), {'c': STEEL})
    s.box((1.0, 8.4, 0), (3.4, 2.6, 2.6), {'top': {'c': ROOF_DK}, 'px': win(CONC, 2, 1, after, 11), 'py': win(CONC_DK, 2, 1, after, 12), 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    H._door_face(s, (1.0, 8.4, 0), (3.4, 2.6, 2.6), width=1.0, ztop=2.0)
    for (x, y) in [(5.4, 8.0), (6.1, 8.3), (5.7, 8.9)]: s.prism(x, y, 0, 0.36, 0.95, 10, {'c': RUST}, {'c': RUST_DK})   # drums
    if not after:
        s.prism(8.0, 10.6, 0, 1.2, 0.35, 16, {'c': (70, 66, 60)}, {'c': (30, 24, 20)}, inner=0.9)   # his fire pit
    else:
        for x in (1.0, 4.4, 7.8, 11.2): s.prism(x, 12.2, 0, 0.42, 1.05, 10, {'c': RUST_DK}, {'c': (40, 26, 18)}, inner=0.34)   # the barrels
        s.box((10.9, 7.9, 3.0), (0.4, 0.4, 0.3), {'c': (200, 180, 120)})                         # the rack's lamp
    return s


def office(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (10.0, 7.0, 6.0), {'top': {'c': ROOF}, 'px': win(CONC, 3, 2, after, 21), 'py': win(CONC_DK, 5, 2, after, 22), 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    s.box((-0.05, -0.05, 5.8), (10.1, 7.1, 0.5), {'c': CONC_DK})                                     # the parapet
    H._door_face(s, (0, 0, 0), (10.0, 7.0, 6.0), width=1.6, ztop=2.6)
    for (a, b) in [(6.6, 2.4), (7.8, 2.4), (7.2, 3.4)]:                                             # the tripod on the roof
        s.box((a - 0.06, b - 0.06, 6.3), (0.12, 0.12, 1.6), {'c': (150, 120, 70)})
    s.box((6.95, 2.55, 7.9), (0.55, 0.45, 0.45), {'c': YEL})                                         # its instrument
    s.box((1.0, 1.0, 6.3), (0.12, 0.12, 3.4), {'c': STEEL})                                          # the flag pole
    s.box((1.12, 1.0, 8.9), (1.1, 0.06, 0.7), {'c': (120, 40, 34)})                                   # the flag
    for x in (0.0, 4.0):                                                                            # the fence, front, a gate between
        s.box((x - 1.0, 9.6, 0), (3.6, 0.12, 1.6), {'c': STEEL_DK})
    s.box((6.6, 9.6, 0), (4.4, 0.12, 1.6), {'c': STEEL_DK})
    if after:
        s.box((3.0, 7.6, 0.2), (0.15, 0.15, 3.0), {'c': WOOD}); s.box((7.4, 7.6, 0.2), (0.15, 0.15, 3.0), {'c': WOOD})
        s.box((2.9, 7.75, 0.9), (4.8, 0.12, 2.4), {'c': PAPER})                                      # THE MAP on its board
        for (x0, z0, w, h) in [(3.1, 1.3, 4.3, 0.06), (3.1, 2.1, 4.3, 0.06), (3.1, 2.8, 4.3, 0.05), (4.0, 1.0, 0.06, 2.2), (5.6, 1.0, 0.06, 2.2), (6.7, 1.0, 0.05, 2.2)]:
            s.box((x0, 7.88, z0), (w, 0.02, h), {'c': (70, 64, 56)})                                # its roads
        s.box((3.4, 7.88, 1.6), (2.6, 0.02, 0.07), {'c': (150, 44, 34)}); s.box((5.9, 7.88, 1.6), (0.07, 0.02, 1.0), {'c': (150, 44, 34)})   # a route in red
    else:
        s.prism(3.0, 9.65, 1.6, 0.5, 0.18, 12, {'c': (120, 118, 112)}, {'c': (120, 118, 112)}, inner=0.42)   # razor wire on the gate
        s.box((4.0, 9.6, 0), (2.6, 0.12, 1.6), {'c': STEEL_DK})                                       # the gate shut
    return s


def hoist(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 13), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (7.5, 6.5, 11.0), {'top': {'c': ROOF}, 'px': win(TOWER, 3, 5, False, 31), 'py': win(TOWER_DK, 3, 5, False, 32), 'nx': {'c': TOWER_DK}, 'ny': {'c': TOWER}})
    s.box((0, 0, 11.0), (7.5, 6.5, 5.0), {'top': {'c': ROOF}, 'px': win(TOWER, 3, 2, after, 33), 'py': win(TOWER_DK, 3, 2, after, 34), 'nx': {'c': TOWER_DK}, 'ny': {'c': TOWER}})
    s.box((-0.1, -0.1, 16.0), (7.7, 6.7, 0.5), {'c': ROOF_DK})
    H._door_face(s, (0, 0, 0), (7.5, 6.5, 11.0), width=1.8, ztop=2.8)
    s.box((2.4, 6.5, 0), (0.7, 0.6, 17.4), {'c': STEEL})                                              # the hoist's mast up the face
    for z in range(2, 17, 3): s.box((2.2, 6.5, z), (1.1, 0.7, 0.12), {'c': STEEL_DK})                # its ties
    cz = 0.2 if after else 14.6
    s.box((2.0, 7.1, cz), (1.8, 1.6, 2.0), {'top': {'c': YEL_DK}, 'px': {'c': YEL}, 'py': {'c': YEL}, 'nx': {'c': YEL_DK}, 'ny': {'c': YEL_DK}})   # the cage
    s.box((1.0, 9.4, 0), (3.8, 0.12, 1.2), {'c': YEL_DK})                                             # the landing's gate
    return s


def barrel(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.prism(0, 0, 0, 0.55, 1.25, 12, {'c': RUST}, {'c': (40, 26, 18)}, inner=0.46)
    s.box((-0.55, -0.04, 0.42), (1.1, 0.08, 0.06), {'c': RUST_DK})
    return s


def stake(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    for (a, b) in [(-0.7, -0.6), (0.7, -0.6), (0.0, 0.8)]:                                         # three legs leaning in to the head
        for k in range(8):
            t = k / 8.0; s.box((a * (1 - t) - 0.06, b * (1 - t) - 0.06, 1.55 * t), (0.12, 0.12, 0.21), {'c': (150, 120, 70)})
    s.box((-0.3, -0.3, 1.55), (0.6, 0.6, 0.12), {'c': (110, 90, 60)})                                  # the head plate
    s.box((-0.2, -0.16, 1.67), (0.4, 0.32, 0.36), {'c': YEL})                                          # the instrument
    s.box((1.0, 0.6, 0), (0.12, 0.12, 0.9), {'c': WOOD})
    s.box((1.12, 0.6, 0.65), (0.35, 0.04, 0.22), {'c': (220, 110, 40)})                                # the flagging
    return s


def rope(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.7, -0.5, 0), (1.4, 1.0, 0.7), {'c': WOOD})
    for (a, b) in [(-0.4, -0.2), (-0.1, -0.2), (0.2, -0.2), (-0.4, 0.15), (-0.1, 0.15), (0.2, 0.15)]:
        s.prism(a + 0.1, b + 0.05, 0.7, 0.12, 0.25, 8, {'c': (60, 64, 60)}, {'c': (196, 160, 60)})    # the cells
    s.prism(0.9, 0.6, 0, 0.55, 0.22, 16, {'c': (164, 154, 132)}, {'c': (164, 154, 132)}, inner=0.3)    # the rope's coil
    s.prism(0.9, 0.6, 0.22, 0.5, 0.2, 16, {'c': (150, 140, 120)}, {'c': (150, 140, 120)}, inner=0.32)
    return s


PLACES = {'depot': depot, 'office': office, 'hoist': hoist}
PROPS = {'barrel': barrel, 'stake': stake, 'rope': rope}


def capture(name, build, after, plate_px):
    """PB.capture's own frame, with this file's names (a place keeps room over its roof for smoke and lamps)"""
    from bohemia_iso3d import bake
    s = build(after)
    HF()._draw_ground(s)
    if name in PROPS: xs = [(x - y) for verts, _u, _n, _m in s.faces for (x, y, z) in verts]
    else: xs = [(x - y) for verts, _u, _n, _m in s.faces if max(v[2] for v in verts) <= 0.15 for (x, y, z) in verts]
    scale = plate_px / max(1e-6, (max(xs) - min(xs)))
    PX = [((x - y) * scale, (x + y) * scale * 0.5 - z * scale) for verts, _u, _n, _m in s.faces for (x, y, z) in verts]
    mnx, mxx = min(p[0] for p in PX), max(p[0] for p in PX); mny, mxy = min(p[1] for p in PX), max(p[1] for p in PX)
    top = 70 if name in PLACES else 24
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
        for a in (False, True): S.append(capture(n, f, a, PB.PLATE_PX))
    for n, f in PROPS.items(): S.append(capture(n, f, False, PB.PROP_PX))
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
    n, after = sc['name'], sc['after']
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    proj, blob, column, over = PB.proj, PB.blob, PB.column, PB.over

    def add(M):
        nonlocal L; L = over(L, M)

    def flame(x, y, r, strong):
        """a fire that stands up out of its pit or its barrel: a glow, then three tongues stacked, the tip swaying on the beat"""
        blob(L, x, y - r * 0.6, r * 2.2, (255, 120, 40), (0.40 if frame else 0.28) * strong)          # the glow round it
        blob(L, x, y - r * 0.5, r, (255, 150, 50), 0.95 * strong)
        blob(L, x + (0.8 if frame else -0.8), y - r * 1.4, r * 0.8, (255, 186, 80), 0.92 * strong)
        blob(L, x + (-1.2 if frame else 1.2), y - r * 2.2, r * 0.55, (255, 226, 150), 0.88 * strong)
    if n == 'depot':
        if not after:
            add(column(sc, (8.0, 10.6, 3.0), frame, (22, 20, 18), 0.92, n=7, grow=1.15))              # his black smoke
            x, y = proj(sc, (8.0, 10.6, 0.4)); flame(x, y, 6.0, 1.0)                                # his one fire
        else:
            for xb in (1.0, 4.4, 7.8, 11.2):
                add(column(sc, (xb, 12.2, 2.4), frame, (176, 168, 156), 0.35, n=3, grow=0.5, drift=0.5))
                x, y = proj(sc, (xb, 12.2, 1.05)); flame(x, y, 2.4, 0.9)                            # the fires for anybody
            x, y = proj(sc, (11.1, 8.1, 3.0)); blob(L, x, y, 6, (255, 214, 140), 0.45 if frame else 0.38)   # the rack's lamp
    if n == 'office':
        if not after:
            x, y = proj(sc, (10.0, 3.6, 4.4)); blob(L, x, y, 4.0, (240, 190, 96), 0.80 if frame else 0.25)   # one window, flickering
        else:
            x, y = proj(sc, (5.3, 7.9, 2.1)); blob(L, x, y, 10, (255, 236, 190), 0.22 if frame else 0.16)    # light on the map
    if n == 'hoist':
        if not after:
            x, y = proj(sc, (3.75, 3.25, 16.9)); blob(L, x, y, 3.2 if frame else 2.0, (230, 40, 30), 0.95 if frame else 0.40)   # the red lamp
        else:
            x, y = proj(sc, (2.9, 8.7, 2.3)); blob(L, x, y, 5.0, (255, 220, 150), 0.70 if frame else 0.55)   # the cage's work light
    if n == 'barrel':
        add(column(sc, (0, 0, 1.8), frame, (190, 182, 170), 0.5, n=3, grow=0.45, drift=0.4))
        x, y = proj(sc, (0, 0, 1.25)); flame(x, y - 1, 9.0, 1.0)
    if n == 'stake':
        x, y = proj(sc, (1.5, 0.6, 0.76)); blob(L, x + (1.2 if frame else 0.0), y, 1.6, (230, 120, 50), 0.6)   # the flagging lifts on the beat
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    os.makedirs(DEST, exist_ok=True)
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    man['about'] = man['about'].split(' BOSSES 4 11/3:')[0] + (' BOSSES 4 11/3: THE FUEL YARD, THE SURVEY OFFICE, THE HOIST and the three '
                   'small things their verbs leave (barrel, stake, rope), the same way (tools/bohemia_bosses_paint_four_to_six_11_3_26.py).')
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        rig = os.path.exists(fn)
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64) if rig else PB.grain(sc['bake4'].astype(np.float64), sum(map(ord, sc['district'])))
        key = sc['name'] if sc['name'] in PROPS else sc['name'] + ('_after' if sc['after'] else '_before')
        for fr in (0, 1):
            out = PB.over(base, moving(sc, fr))
            Image.fromarray(out.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=sc['w'], h=sc['h'], bx=sc['bx'], by=sc['by'], plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key],
                                    through_the_rig=rig)
        print('  %-16s %dx%d anchor %d,%d %s' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    # the compare sheet: the first three places and these three, before and after, at the same scale
    try:
        keys = [k + s for k in ('kitchen', 'tower', 'tanks', 'depot', 'office', 'hoist') for s in ('_before', '_after')]
        tiles = [Image.open(os.path.join(DEST, '%s_0.png' % k)) for k in keys]
        W = sum(t.width for t in tiles[:6]) + 70; H = max(t.height for t in tiles) * 2 + 30
        sheet = Image.new('RGBA', (max(W, sum(t.width for t in tiles[6:]) + 70), H), (20, 18, 16, 255))
        for row in range(2):
            x = 10
            for t in tiles[row * 6:(row + 1) * 6]: sheet.alpha_composite(t, (x, 10 + row * (H // 2))); x += t.width + 10
        sheet.save(os.path.join(OUT, 'compare.png'))
    except Exception as e: print('compare sheet:', e)


if __name__ == '__main__':
    cmd = (sys.argv[1:] or ['all'])[0]
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
