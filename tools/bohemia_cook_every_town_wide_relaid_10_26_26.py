#!/usr/bin/env python3
"""BOHEMIA -- COOK [every town built for tall and wide], THE WIDE COMPOSITION RE-LAID FOR THE PHONE'S CORNER (10/26/26).
Rule 220 (one plan, two compositions) and rule 213 (Paolo 10/26: the phone sits in a bottom corner, left or right by a setting,
'it stays in the same place ... the same size' on the map, in the town and in the fight; nothing it covers may be a press).

WHAT WAS WRONG: the wide pictures (tools/bohemia_cook_every_town_its_own_screen_10_25_26.py) kept the screen's old tap boxes to the
pixel, and five kinds of tap stood in a bottom corner where the phone goes, sideways as upright: the town tier's armourer (front
right), the fortress's barber with its smith (front left), its bar's fire (front right) and its build ground (right), the camp's
stall (left), posts (front left) and board (front right).

WHAT THIS BUILDS: the same wide town (the 10/25 tool's layout, every builder and number untouched) with those things moved out of
the corners, in the same order the upright frame keeps (tools/bohemia_cook_every_town_tall_and_wide_10_26_26.py): the armourer up
to the street's front walk on the right; the fortress's barber back a row (its smith its ground floor, as before), the bar's fire
in the middle front, the build ground up a row; the camp's stall, posts and board in toward the open middle; and what stood where
they land moved aside (named per town below). Then the town's own junk is laid round the new taps, every thing measured piece by
piece for the walk, and the taps' boxes, doors and entrance written from that measure, like the upright one.
  NO TAP'S MIDDLE IN THE BOTTOM CORNERS: sideways the phone takes the outer fifth of the width in the bottom nine twentieths of the
  height (my reading of rule 213 until UI TWO fixes the phone's rectangle; upright the tall tool keeps the outer four tenths of
  the bottom three tenths).

  <venv>/bin/python tools/bohemia_cook_every_town_wide_relaid_10_26_26.py [Town ...] [--quick] [--layout-only] [--swap-only] [--no-ship]
  -> records/target/cook_town_screens/wide/render/<town>.png, _night.png, .json
  -> slices/settlement_ground_towns/<town>.webp, <town>_night.webp (the wide pair, replaced), towns[name].wide and the walk

REFERENCE CHECK (the 9/4 standing duty): the phone games that turn keep their controls out of the thumb's corner (Hoober, rule 212's
research: the thumb's base in a bottom corner); Battle Brothers' town screen lays its buildings across the middle of the panorama.
No reference game added. REUSE CHECK: the 10/25 layout, builders, kit, light and night; the tall tool's measure, walk and checks.
"""
import os, sys, json, math, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_every_town_its_own_screen_10_25_26 as V
import bohemia_cook_every_town_tall_and_wide_10_26_26 as T

PPM, SQ = V.PPM, V.SQ
WW, WH = V.PW, V.PH
WOUT = os.path.join(R, 'records/target/cook_town_screens/wide')


def wproj(x, y, z): return T.proj(x, y, z, WW, WH)
def wbox(x0, x1, y0, y1, h=0.0): return T.gbox(x0, x1, y0, y1, h, WW, WH)
def m_of(px, py): return V.X0 + px / PPM, V.Y1 - py / (PPM * SQ)


def corner_clear_wide(box, W=WW, H=WH):
    """rule 213 sideways: the phone in a bottom corner takes the outer fifth of the width in the bottom nine twentieths"""
    cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    return not (cy > 0.55 * H and (cx < 0.22 * W or cx > 0.78 * W))


# what moves, per town: (the thing's name, near where it stands now (x, y front), by how much (dx, dy)) in metres
TOWN_ARM = {'Church': [('armourer', (52.2, 14.6), (-4.0, 10.9)), ('palm43', (43.0, 27.6), (-1.6, 0.0)), ('palm51', (51.5, 27.6), (2.2, 0.0)),
                       ('dumpster', (46.0, 25.0), (8.0, -3.0))],
            'Reds': [('armourer', (52.2, 14.6), (-4.0, 10.9)), ('sandbags', (43.0, 27.4), (-2.0, -0.4)), ('wreck', (45.0, 23.0), (7.0, -4.0))],
            'Anarchists': [('container', (51.4, 15.2), (-2.4, 11.3))],
            'Blues': [('armourer', (51.8, 14.7), (-2.6, 11.8)), ('turbine', (47.5, 22.0), (6.0, -2.0)), ('corral', (51.5, 22.0), (1.0, -4.0))]}
FORT = {'Mob': [('barber', (13.0, 20.0), (0.0, 6.0)), ('wreck', (30.5, 16.0), (-9.5, -7.0))],
        'Caravans': [('barber', (13.0, 20.0), (-2.0, 5.0)), ('canopy', (22.5, 30.5), (2.0, 0.0)), ('cover_pump', (19.0, 32.0), (2.0, 0.0)),
                     ('cover_pump', (26.0, 32.0), (2.0, 0.0)), ('drums', (30.5, 19.5), (-6.0, -4.0)), ('semi1', (27.5, 12.6), (-13.5, 0.0))],   # the semi stood before the stall
        'Cartel': [('barber', (13.0, 20.0), (0.0, 6.0))],
        'Network': [('barber', (13.0, 20.0), (0.0, 6.0)), ('reels', (27.5, 19.0), (-8.0, 0.0))],
        'Remnants': [('barber', (13.0, 20.0), (0.0, 6.0))]}
CAMP = {'Colorful': [], 'Custom': [], 'Homeless': [],
        'Trades': [('dozer', (28.0, 13.8), (21.5, -0.8))],
        'Volunteers': [('crates', (41.5, 16.5), (4.5, -0.5))]}
CAMP_TAPS = [('stall', (14.0, 25.4), (5.5, 0.0)), ('posts', (14.0, 16.0), (9.0, 0.0)), ('board', (47.0, 19.0), (-5.5, 0.0))]
def ground_boxes(tier):
    """the wide composition's ground taps in metres"""
    def mb(b, h=0.0):
        x0, y1 = m_of(b[0], b[1]); x1, y0 = m_of(b[2], b[3]); return (round(x0, 2), round(x1, 2), round(y0, 2), round(y1, 2), h)
    if tier == 'town': return {'lot': mb(V.LOTBOX['town']), 'build': mb(V.BUILDBOX['town'])}
    if tier == 'fortress': return {'lot': mb(V.LOTBOX['fortress']), 'build': (44.2, 53.5, 26.0, 30.5, 0.0), 'bar': (30.5, 35.5, 16.0, 20.5, 1.6)}
    return {'lot': mb(V.LOTBOX['camp']), 'build': mb(V.BUILDBOX['camp']), 'arms': mb(V.ARMSBOX['camp']['arms'], 1.6), 'bar': mb(V.ARMSBOX['camp']['bar'], 1.6)}


class WideTown(T.TallTown):
    """the wide composition's place: the tall tool's measure (piece by piece, flat things no block) on the wide frame"""
    pass


def _move(pl, name, near, d):
    best = None
    for nm, root, walk in pl.things:
        if nm != name: continue
        objs = [o for o in root.children_recursive if o.type == 'MESH']
        if not objs: continue
        lo, hi = pl._bounds(objs)
        dist = abs((lo[0] + hi[0]) / 2 - near[0]) + abs(lo[1] - near[1])
        if best is None or dist < best[0]: best = (dist, root)
    if best is None or best[0] > 4.0: raise SystemExit('WIDE: no %s near %s' % (name, near))
    r = best[1]; r.location = (r.location[0] + d[0], r.location[1] + d[1], r.location[2])
    pl.bpy.context.view_layer.update()


def lay_wide(town, pl, K):
    """the 10/25 wide layout, then the corner taps moved out of the phone's corners"""
    V.layout_v1(town, pl, K)
    t, n = town['tier'], town['name']
    pl.boxes = ground_boxes(t)
    moves = (TOWN_ARM if t == 'town' else FORT if t == 'fortress' else CAMP).get(n, [])
    if t == 'camp': moves = CAMP_TAPS + moves
    for name, near, d in moves: _move(pl, name, near, d)
    if t == 'fortress': pl.drum_fire(33.0, 18.2)                    # the bar: the fire the men drink round, in the middle front


def fill_wide(town, pl, K, n_want=14):
    """the 10/25 fill, kept off the re-laid taps"""
    now = T.TallTown.outlines(pl)
    occ = [o['box'] for o in now]
    taps = [wbox(*b) for b in pl.boxes.values()]
    for nm in ('stall', 'posts', 'board', 'barber', 'clinic', 'smith', 'armourer', 'bar', 'container', 'hoop_a', 'bld_ranch_porch', 'bld_ranch_carport', 'shed'):
        for o in now:
            if o['name'] == nm: b = o['box']; taps.append([b[0], b[3] - 20, b[2], b[3] + 80])
    occ += [[b[0] - 30, b[1] - 20, b[2] + 30, b[3] + 30] for b in taps]
    kinds = V.TOWN_FILL.get(town['name'], ['crates', 'drums'])
    rnd = K.rnd; placed = 0
    for _ in range(900):
        if placed >= n_want: break
        k = rnd.choice(kinds); w, d, h, put = V.FILL[k]
        px, py1 = rnd.uniform(60, WW - 60), rnd.uniform(160, WH - 20)
        x, y = m_of(px, py1)
        box = [px - w / 2 * PPM - 12, py1 - (h * PPM + d * PPM * SQ) - 12, px + w / 2 * PPM + 12, py1 + 12]
        if any(not (box[2] < b[0] or box[0] > b[2] or box[3] < b[1] or box[1] > b[3]) for b in occ): continue
        put(pl, K, x, y); occ.append(box); placed += 1
    return placed


# which thing in the wide scene each tap is, when its name is not the tap's own (the 10/25 scenes' names)
THING_W = {'Anarchists': {'barber': 'bld_ranch_carport', 'bar': 'bld_ranch_porch', 'armourer': 'container'},
           'Blues': {'barber': 'bld_warehouse', 'clinic': 'bld_warehouse', 'bar': 'hoop_a'},
           'Custom': {'clinic': 'shed'}, 'Trades': {'barber': 'shed', 'clinic': 'tent'},
           'Colorful': {'clinic': 'tent', 'barber': 'tent'}, 'Volunteers': {'clinic': 'tent', 'barber': 'tent'}}
WANT_W = {'clinic': (23.0, 39.5), 'barber': (34.2, 25.6)}           # where the camp's two tents stand


def taps_wide(town, meta):
    tier, name = town['tier'], town['name']
    hot_roles, box_roles = T.ROLES[tier]
    byname = {}
    for o in meta['outlines']: byname.setdefault(o['name'], []).append(o)
    def thing(role):
        nm = THING_W.get(name, {}).get(role, role)
        c = list(byname.get(nm) or [])
        if not c: return None
        if role in WANT_W and nm in ('tent', 'shed'):
            want = wproj(WANT_W[role][0], WANT_W[role][1], 0)
            c.sort(key=lambda o: abs((o['box'][0] + o['box'][2]) / 2 - want[0]) + abs(o['box'][3] - want[1]))
        if len(c) > 1 and nm not in ('tent', 'shed'):          # a thing in pieces: its box is the pieces' union
            return [min(o['box'][0] for o in c), min(o['box'][1] for o in c), max(o['box'][2] for o in c), max(o['box'][3] for o in c)]
        return list(c[0]['box'])
    hot, boxes = {}, {}
    for r in hot_roles:
        b = thing(r)
        if b is None: raise SystemExit('WIDE %s: no %s in the scene' % (name, r))
        if name == 'Blues' and r in ('barber', 'clinic'):
            mx = (b[0] + b[2]) // 2; b = [b[0], b[1], mx, b[3]] if r == 'barber' else [mx, b[1], b[2], b[3]]
        hot[r] = {'box': b, 'kind': r}
    pb = meta['boxes']
    for r in box_roles:
        if r == 'look': boxes[r] = list(hot['clinic']['box']); continue
        if r in pb: boxes[r] = wbox(*pb[r]); continue
        if tier == 'fortress' and r in ('smith', 'armourer'):
            b = hot['barber' if r == 'smith' else 'clinic']['box']; hgt = b[3] - b[1]
            boxes[r] = [b[0], b[3] - int(hgt * 0.32), b[2], b[3]] if r == 'smith' else [b[0] + (b[2] - b[0]) // 2, b[3] - int(hgt * 0.32), b[2], b[3]]
            continue
        b = thing(r)
        if b is None: raise SystemExit('WIDE %s: no %s in the scene' % (name, r))
        boxes[r] = b
    return hot, boxes


def check_wide(town, meta):
    hot, boxes = taps_wide(town, meta); doors = T.doors_of(hot, boxes, town['tier']); ent = T.entrance_of(town, WW, WH, wide=True)
    bad = []
    for sd in ('left', 'right'):                         # he may walk in from either end (rule 186(a))
        r = T.reach(WW, WH, [o['box'] for o in meta['outlines']], ent[sd], doors)
        bad += ['door %s from the %s' % (k, sd) for k, v in r.items() if not v]
    bad += ['corner ' + k for k, v in list(hot.items()) + list(boxes.items()) if not corner_clear_wide(v['box'] if isinstance(v, dict) else v)]
    return bad


_LASTW = {}


class _HookW(WideTown):
    def outlines(s):
        _LASTW['boxes'] = s.boxes
        out = super().outlines()
        if _LASTW.get('town') is not None:
            bad = check_wide(_LASTW['town'], {'outlines': out, 'boxes': s.boxes})
            if bad:
                od = os.path.join(WOUT, 'layout'); os.makedirs(od, exist_ok=True)
                _orig_dump(dict(name=_LASTW['town']['name'], outlines=out, boxes=s.boxes, bad=bad), open(os.path.join(od, _LASTW['town']['slug'] + '.json'), 'w'), indent=0)
                raise T.LayoutBad(', '.join(bad))
        return out


_orig_dump = json.dump
def _dumpw(obj, fp, *a, **k):
    if isinstance(obj, dict) and 'outlines' in obj and 'filled' in obj and _LASTW.get('boxes') is not None:
        obj = dict(obj); obj['boxes'] = _LASTW['boxes']; obj['comp'] = 'wide'; obj['px'] = [WW, WH]
    return _orig_dump(obj, fp, *a, **k)


def patch_wide():
    if not hasattr(V, 'layout_v1'): V.layout_v1 = V.layout
    V.OUT = WOUT; V.Town = _HookW; V.layout = lay_wide; V.fill = fill_wide


def layout_only(town):
    import bpy, hashlib, random
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = V.plan(town, rnd)
    objs, gg = F.build(bpy, g, 2020 + seed, True)
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = WideTown(bpy, P, rnd)
    lay_wide(town, pl, K)
    filled = fill_wide(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    meta = dict(name=town['name'], tier=town['tier'], outlines=pl.outlines(), boxes=pl.boxes, filled=filled, seed=seed)
    od = os.path.join(WOUT, 'layout'); os.makedirs(od, exist_ok=True)
    _orig_dump(meta, open(os.path.join(od, town['slug'] + '.json'), 'w'), indent=0)
    return meta


def ship_wide(towns_):
    """the re-laid wide pictures over the 10/25 ones (same names), towns[name].wide and the top-level entry from the measure"""
    from PIL import Image
    SHIP = V.SHIP
    manp = os.path.join(SHIP, 'settlement_ground.json'); walkp = os.path.join(SHIP, 'settlement_walk.json')
    man = json.load(open(manp)); walk = json.load(open(walkp))
    for town in towns_:
        s = town['slug']; rd = os.path.join(WOUT, 'render')
        meta = json.load(open(os.path.join(rd, s + '.json')))
        for suf in ('', '_night'):
            a = Image.open(os.path.join(rd, s + suf + '.png')).convert('RGB'); assert a.size == (WW, WH)
            a.save(os.path.join(SHIP, s + suf + '.webp'), quality=82, method=6)
        hot, boxes = taps_wide(town, meta)
        e = man['towns'].setdefault(town['name'], {})
        e.update(tier=town['tier'], src=s + '.webp', night_src=s + '_night.webp', px=[WW, WH], hotspots=hot, boxes=boxes,
                 lights=len(meta['lamps']) + len(meta['fires']))
        e['wide'] = dict(src=s + '.webp', night_src=s + '_night.webp', px=[WW, WH], hotspots=hot, boxes=boxes,
                         doors=T.doors_of(hot, boxes, town['tier']), entrance=T.entrance_of(town, WW, WH, wide=True), zoom_max=T.ZOOM[town['tier']], relaid=True)
        bl = sorted({tuple(o['box']) for o in meta['outlines']})
        for suf in ('', '_night'): walk['pictures'][s + suf + '.webp'] = {'blocks': [list(b) for b in bl]}
        print('  shipped wide', s, len(bl), 'outlines', flush=True)
    json.dump(man, open(manp, 'w'), indent=1)
    json.dump(walk, open(walkp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--')]
    TT = [t for t in V.towns() if not want or t['name'] in want or t['slug'] in want]
    patch_wide()
    if '--layout-only' in a:
        for town in TT: m = layout_only(town); print('  laid out wide', town['name'], check_wide(town, m) or 'every door walked to, every tap clear of the phone', flush=True)
        sys.stdout.flush(); os._exit(0)
    if '--swap-only' not in a:
        json.dump = _dumpw
        for town in list(TT):
            _LASTW['town'] = town
            try: d, nn = V.render(town, quick='--quick' in a, day_only='--day-only' in a); print('  rendered wide', town['name'], d, nn, flush=True)
            except T.LayoutBad as ex: print('  NOT RENDERED', town['name'], str(ex), flush=True); TT.remove(town)
        _LASTW['town'] = None; json.dump = _orig_dump
    if '--quick' not in a and '--no-ship' not in a: ship_wide(TT)
    sys.stdout.flush(); os._exit(0)
