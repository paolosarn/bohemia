#!/usr/bin/env python3
"""THE INSIDES WEAR FINISHED ART (COOK FIVE, 11/11/26; VAMILY rules 443(g), 441, 440(a), 416; the coordinator's 'next round':
'the art for the two coming boards, THE FLOOD TUNNELS and THE PARKING GARAGE, so they do not ship as stand-ins').

The two boards are COMBAT's (the tunnels parked on origin combat2-tunnels-parked-2, the garage not laid yet). Their PICTURES
are made ahead through the master rig (tools/bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26.py) and wait in
slices/fight_ground/<kit>/ with an art file a board reads its lists from. A board picks ANY tile of a sheet for ANY place,
so the one thing a picture can get wrong without anybody seeing it in the tool is the join: this gate measures it.

  for each kit in KITS (the tunnels, the garage, and from 11/17 the convention hall, the mall, the warehouse and the data fort; from
  11/18 the terminal; from 11/20 the stadium):
  A1 the art file says finished, names a board to be for, and every picture it names (sheets and pieces) is a file; no picture
     lies in the folder unnamed
  A2 every sheet is five by five tiles of 515 x 364 (2575 x 1820); every ground list entry names a tile on its sheet
  A3 *** ANY TILE MEETS ANY TILE ***: for every sheet and every pair of tiles of one kind (and the kinds the art file says
     lie side by side), the step in tone across the join (the mean of the last six pixels of one tile against the first six
     of the other, along the whole edge, east-west and north-south) is no more than the step between two strips six pixels
     apart INSIDE a tile, plus a small allowance
  A4 every piece in sizes.json is its file's own size, its foot on its canvas; a wall is one tile long
  A5 the kit's weight: its folder under a budget (pictures a fight loads before the board shows)
  A6 PURPLE RESERVATION: not one purple pixel in a sheet or a piece (the purity gate's own test)
  P1 PLANTED (in memory): one tile of a sheet darkened by an eighth turns A3 red; a piece named with no file turns A1 red;
     a foot off its canvas turns A4 red

THE CEILINGS (COOK FIVE 11/14; VAMILY rule 451(a), ask row 623, his vote on the garage kit: 'let's just start off with a 10%
opacity for real, like I still need to see the parking garage ceiling, an exterior that I am in the interior of... the opacity
is gonna be really low'). COMBAT THREE's fight draws an inside's ceiling over the board at a tenth (FIGHT.html
__AN_INSIDE_SHOWS_ITS_CEILING__; its gate AN INSIDE SHOWS ITS CEILING holds the data and the deal). The contract is the
'ceiling' entry of each inside's own data file (garage/garage.json, casino/casino_floor.json, tunnels/tunnels.json): the
picture's name, 'have' true the day it is in the folder, 'tile' how many fight tiles one picture covers. The PICTURE is this
lane's: five bays by five, repeating edge to edge. A picture drawn at a tenth can fail three ways nobody sees in the tool: it
is too flat to be read at a tenth, its bays do not meet, or it is heavy for what it is.
  C1 each of the three insides has its picture IN (have true, the file there, whole: no holes in it), five bays by five, drawn
     really low (no more than 0.15), covering a count of tiles; the garage's and the tunnels' art files name theirs
  C2 *** ANY BAY MEETS ANY BAY *** on every ceiling (so the picture repeats edge to edge). A ceiling's lines lie ON its bays'
     edges (a girder on every bay's line), so a bay's edge is a step in tone by design and A3's allowance would pass anything:
     here the step where a bay meets ANOTHER is held to the step where it meets ITSELF (the bay repeating, which is what was
     drawn), plus 8 steps
  C3 IT CAN BE READ AT A TENTH: between a picture's dark twentieth and its pale twentieth there are at least 60 steps of tone
     (so a girder against its slab is 6 steps on his screen at 0.10), and a bay's lines are there (a tenth of it or more is
     25 steps darker than the picture's middle tone)
  C4 LIGHT: a ceiling no heavier than 80,000 bytes (the site is near its cap; the kits' own budgets, A5, count them too)
  C5 PURPLE RESERVATION: not one purple pixel
  C2b (COOK SIX 11/20) ONE PICTURE THE SIZE OF THE BOARD: a ceiling whose 'tile' is its inside's board, every layout of it (the
     stadium: the ring over midfield does not repeat; COMBAT THREE's own offer) is drawn once and never meets itself, so C2 does
     not read it; it covers every layout's board exactly, a tile on it the board's own shape (within a tenth)
  P2 PLANTED (in memory): a flat picture turns C3 red, a strength of 0.5 turns C1 red, a bay an eighth darker turns C2 red
python3 gates/the_insides_wear_finished_art_gate.py   (about 8 s)
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FG = os.path.join(ROOT, 'slices', 'fight_ground')
TW, TH = 515, 364
KITS = {'tunnels': dict(art='tunnels_art.json', budget=900000, walls=('wall_ew', 'wall_ew_b', 'wall_ew_c'), beside=[]),
        'garage': dict(art='garage_art.json', budget=900000, walls=('wall_ew', 'rail_ew', 'level', 'level_aisle', 'ramp_e', 'ramp_w'),
                       beside=[('stalls', 'aisle')]),   # (kind, kind): ground lists that lie north and south of each other AND must join without a line
        'hall': dict(art='hall_art.json', budget=900000, walls=('wall_ew', 'airwall_ew', 'rail_ew', 'mezz', 'stair_e', 'stair_w'), beside=[('floor', 'ring')]),   # (11/17) COMBAT THREE's convention hall
        'mall': dict(art='mall_art.json', budget=900000, walls=('wall_ew', 'front_ew', 'door', 'rail_ew', 'bridge', 'escalator_e', 'escalator_w'), beside=[('floor', 'ring'), ('floor', 'high')]),   # (11/17) and its mall
        'warehouse': dict(art='warehouse_art.json', budget=900000, walls=('wall_ew', 'rack_ew', 'conveyor', 'rail_ew', 'mezz', 'stair_e', 'stair_w'), beside=[('floor', 'ring'), ('floor', 'high')]),   # (11/17) and its warehouse
        'datafort': dict(art='datafort_art.json', budget=900000, walls=('wall_ew', 'servers_ew', 'gate', 'rail_ew', 'gallery', 'stair_e', 'stair_w'), beside=[('floor', 'ring'), ('floor', 'high')]),   # (11/18) and its data fort
        'terminal': dict(art='terminal_art.json', budget=900000, walls=('wall_ew', 'screen_ew', 'belt', 'rail_ew', 'walkway', 'stair_e', 'stair_w'), beside=[('floor', 'ring'), ('floor', 'high')]),   # (11/18) and its airport terminal
        'stadium': dict(art='stadium_art.json', budget=900000, walls=('wall_ew', 'rail_ew', 'stand', 'stair_e', 'stair_w'), beside=[('floor', 'ring')])}   # (COOK SIX 11/20) and its stadium (the torn turf meets itself; the field meets it on a turf margin, by eye)
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def tiles_of(folder, entry, cache, tw=TW, th=TH):
    """'tunnels/tunnel_floor_0.webp#2,3' -> that tile's luma (364 x 515 float)"""
    src, at = entry.split('#'); c, r = map(int, at.split(','))
    if src not in cache:
        cache[src] = np.asarray(Image.open(os.path.join(FG, src)).convert('L'), np.float32)
    a = cache[src]
    return a[r * th:(r + 1) * th, c * tw:(c + 1) * tw]


def smooth(v, n=9):
    return np.convolve(v, np.ones(n) / n, mode='valid')


def step_ew(a, b):
    """the step in tone from a's east edge to b's west edge, along the edge"""
    return float(np.mean(np.abs(smooth(a[:, -6:].mean(1)) - smooth(b[:, :6].mean(1)))))


def step_ns(a, b):
    return float(np.mean(np.abs(smooth(a[-6:, :].mean(0)) - smooth(b[:6, :].mean(0)))))


def inside(a):
    """the same measure between two strips six pixels apart inside a tile (what the ground's own texture does)"""
    out = []; h, w = a.shape
    for x in (int(w * f) for f in (0.194, 0.388, 0.583, 0.777)): out.append(float(np.mean(np.abs(smooth(a[:, x - 6:x].mean(1)) - smooth(a[:, x:x + 6].mean(1))))))
    for y in (int(h * f) for f in (0.22, 0.44, 0.66, 0.824)): out.append(float(np.mean(np.abs(smooth(a[y - 6:y, :].mean(0)) - smooth(a[y:y + 6, :].mean(0))))))
    return out


def joins(tiles_a, tiles_b=None):
    """the worst and the middle join among every pair, against the inside step"""
    same = tiles_b is None; tiles_b = tiles_a if same else tiles_b
    base = [v for t in tiles_a + ([] if same else tiles_b) for v in inside(t)]
    lim = float(np.percentile(base, 90)) * 1.5 + 2.5
    worst = 0.0; mids = []
    for i, a in enumerate(tiles_a):
        for j, b in enumerate(tiles_b):
            if same and i == j: continue
            d = max(step_ew(a, b), step_ns(a, b)) if same else max(step_ns(a, b), step_ns(b, a))
            worst = max(worst, d); mids.append(d)
    return worst, float(np.median(mids)), lim


def purple(path):
    a = np.asarray(Image.open(path).convert('RGBA')).astype(int)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    return int(((r > g + 25) & (b > g + 25) & (r > 80) & (al > 40)).sum())      # gates/bohemia_purity_gate.py check_png's purple, on every pixel


def read(kit, K):
    folder = os.path.join(FG, kit); art = json.load(open(os.path.join(folder, K['art'])))
    sizes = json.load(open(os.path.join(folder, 'sizes.json')))
    return folder, art, sizes


def a1(kit, K, art, sizes, exists=os.path.exists):
    folder = os.path.join(FG, kit); named = set()
    for lst in art.get('floor', {}).values(): named |= {e.split('#')[0] for e in lst}
    if art.get('ceiling'): named.add(art['ceiling']['sheet'])                                  # rule 451(a): the kit's ceiling is one of its pictures
    named |= {v['src'] for v in sizes.values()}
    gone = sorted(n for n in named if not exists(os.path.join(FG, n)))
    on_disk = {kit + '/' + f for f in os.listdir(folder) if f.endswith(('.webp', '.png'))}
    return art.get('stage') == 'finished' and bool(art.get('for')) and not gone and not (on_disk - named), gone, sorted(on_disk - named)


def a4(kit, K, sizes):
    bad = []
    for k, v in sizes.items():
        p = os.path.join(FG, v['src'])
        if not os.path.exists(p): bad.append(k + ' no file'); continue
        w, h = Image.open(p).size
        if (w, h) != (v['w'], v['h']): bad.append('%s says %dx%d, is %dx%d' % (k, v['w'], v['h'], w, h))
        if not (0 <= v['foot'][0] <= w and 0 <= v['foot'][1] <= h + 1): bad.append('%s foot %s off its %dx%d canvas' % (k, v['foot'], w, h))
        if k in K['walls'] and abs(w - TW) > 2: bad.append('%s is %d px long, a tile is %d' % (k, w, TW))
    return bad


CEIL_ALPHA_MAX, CEIL_BYTES, CEIL_SPREAD, CEIL_LINES, CEIL_MEET = 0.15, 80000, 60.0, (25.0, 0.10), 8.0
CEIL_DATA = {'garage': 'garage/garage.json', 'casino': 'casino/casino_floor.json', 'tunnels': 'tunnels/tunnels.json', 'hall': 'hall/hall.json', 'mall': 'mall/mall.json', 'warehouse': 'warehouse/warehouse.json', 'datafort': 'datafort/datafort.json', 'terminal': 'terminal/terminal.json', 'stadium': 'stadium/stadium.json'}   # COMBAT THREE's: each one's 'ceiling' entry is the contract


def c1(C, exists=os.path.exists):
    bad = []
    for k in CEIL_DATA:
        c = C.get(k)
        if not c: bad.append('the %s data names no ceiling' % k); continue
        al = c.get('alpha')
        if not (isinstance(al, (int, float)) and 0 < al <= CEIL_ALPHA_MAX): bad.append('%s strength %s (his word: really low, no more than %s)' % (k, al, CEIL_ALPHA_MAX))
        if c.get('have') is not True: bad.append(k + ' still wears the stand-in (have is not true)'); continue
        p = os.path.join(FG, c.get('src') or '?')
        if not exists(p): bad.append(k + ' has no file'); continue
        im = Image.open(p)
        if im.size[0] % 5 or im.size[1] % 5: bad.append('%s is %dx%d, not five bays by five' % (k, im.size[0], im.size[1]))
        if im.mode in ('RGBA', 'LA') and np.asarray(im.convert('RGBA'))[..., 3].min() < 250: bad.append(k + ' has holes in it')
        t = c.get('tile')
        if not (isinstance(t, list) and len(t) == 2 and all(isinstance(v, (int, float)) and v > 0 for v in t)): bad.append(k + ' does not say how many tiles it covers')
    for kit, K in KITS.items():
        art = json.load(open(os.path.join(FG, kit, K['art'])))
        if (art.get('ceiling') or {}).get('sheet') != (C.get(kit) or {}).get('src'): bad.append('the %s kit\'s art file does not name its ceiling' % kit)
    return bad


def meets(tiles):
    """the worst a join between two different bays is OVER those bays' joins with themselves, east-west and north-south"""
    own_e = [step_ew(t, t) for t in tiles]; own_n = [step_ns(t, t) for t in tiles]; worst = 0.0; mids = []
    for i, a in enumerate(tiles):
        for j, b in enumerate(tiles):
            if i == j: continue
            d = max(step_ew(a, b) - (own_e[i] + own_e[j]) / 2, step_ns(a, b) - (own_n[i] + own_n[j]) / 2)
            worst = max(worst, d); mids.append(d)
    return worst, float(np.median(mids)), CEIL_MEET


def c3(a):
    """(the steps of tone between the dark twentieth and the pale twentieth, the share of the picture 25 steps under its middle)"""
    lo, mid, hi = np.percentile(a, [5, 50, 95])
    return float(hi - lo), float((a < mid - CEIL_LINES[0]).mean())


def boards(k):
    """every layout's board size, [W, H], in the inside's own data"""
    d = json.load(open(os.path.join(FG, CEIL_DATA[k]))); out = set()
    for t in ((d.get('board') or {}).get('templates') or {}).values():
        for rows in (t.get('layouts') or {}).values(): out.add((len(rows[0]), len(rows)))
    return out


def whole(k, c):
    """(COOK SIX 11/20) a ceiling whose 'tile' is its inside's board, every layout of it: ONE picture the size of the board (the
    stadium's ring over midfield: COMBAT THREE's own offer), never repeated, so C2's bays need not meet; C2b holds it to the board"""
    b = boards(k); return bool(b) and all(list(x) == list(c.get('tile') or []) for x in b)


def ceilings():
    C = {k: json.load(open(os.path.join(FG, f))).get('ceiling') for k, f in CEIL_DATA.items()}; b1 = c1(C)
    ok('C1 the ceilings: each inside has its picture in (five bays by five, whole), drawn really low (no more than %s), and its kit names it' % CEIL_ALPHA_MAX, not b1,
       '; '.join(b1[:4]) if b1 else ', '.join('%s %s at %s over %sx%s tiles' % (k, os.path.basename(c['src']), c['alpha'], c['tile'][0], c['tile'][1]) for k, c in C.items()))
    if b1: return
    cache = {}; res = {}; read = {}; tiles = {}
    ones = {}
    for k, c in C.items():
        w, h = Image.open(os.path.join(FG, c['src'])).size; tw, th = w // 5, h // 5
        tiles[k] = [tiles_of(None, '%s#%d,%d' % (c['src'], x, y), cache, tw, th) for y in range(5) for x in range(5)]
        read[k] = c3(cache[c['src']])
        if whole(k, c): ones[k] = (c['tile'], sorted(boards(k)), round((w / c['tile'][0]) / (h / c['tile'][1]), 3)); continue
        res[k] = meets(tiles[k])
    bad = {k: v for k, v in res.items() if v[0] > v[2]}
    ok('*** C2 the ceilings: ANY BAY MEETS ANY BAY *** (the picture repeats edge to edge)', not bad, '; '.join('%s worst %.1f over itself, middle %.1f, allowed %.1f' % (k, v[0], v[1], v[2]) for k, v in res.items()))
    # C2b: a picture the size of the board covers every layout's board exactly (never repeated, so never a seam), at a tile's own shape
    # (a tile's width over its height on the picture within a tenth of the board's own 515 / 364, so the ring is not squashed)
    sq = TW / TH; badw = {k: v for k, v in ones.items() if abs(v[2] / sq - 1) > 0.1}
    ok('C2b the ceilings: ONE PICTURE THE SIZE OF THE BOARD covers every layout of its board exactly, at a tile\'s own shape', not badw,
       '; '.join('%s covers %s, its boards %s, a tile %.3f wide for its height (the board %.3f)' % (k, v[0], v[1], v[2], sq) for k, v in ones.items()) or 'none')
    flat = {k: v for k, v in read.items() if v[0] < CEIL_SPREAD or v[1] < CEIL_LINES[1]}
    ok('C3 the ceilings: EACH CAN BE READ AT A TENTH (60 steps of tone or more between its dark and its pale, a tenth of it or more its lines)', not flat,
       '; '.join('%s %.0f steps, %.0f%% lines' % (k, v[0], v[1] * 100) for k, v in read.items()))
    sizes = {k: os.path.getsize(os.path.join(FG, c['src'])) for k, c in C.items()}
    ok('C4 the ceilings: LIGHT, none heavier than %s bytes' % format(CEIL_BYTES, ','), all(z <= CEIL_BYTES for z in sizes.values()), ', '.join('%s %s' % (k, format(z, ',')) for k, z in sizes.items()))
    pur = {k: purple(os.path.join(FG, c['src'])) for k, c in C.items()}
    ok('C5 the ceilings: PURPLE RESERVATION, not one purple pixel', not any(pur.values()), ', '.join('%s %d' % kv for kv in pur.items() if kv[1]) or '%d pictures' % len(pur))
    flat0 = c3(np.full((455, 645), 120.0, np.float32)); p3 = flat0[0] < CEIL_SPREAD
    C2 = json.loads(json.dumps(C)); C2['garage']['alpha'] = 0.5; p1 = bool(c1(C2))
    t2 = [t.copy() for t in tiles['garage']]; t2[3] = t2[3] * 0.875; j2 = meets(t2); p2 = j2[0] > j2[2]
    ok('P2 the ceilings PLANTED: a flat picture turns C3 red, a strength of 0.5 C1, a bay an eighth darker C2', p3 and p1 and p2, 'C3 %s, C1 %s, C2 %s' % (p3, p1, p2))


def main():
    print('\nTHE INSIDES WEAR FINISHED ART\n')
    for kit, K in KITS.items():
        folder, art, sizes = read(kit, K)
        good, gone, extra = a1(kit, K, art, sizes)
        ok('A1 %s: the art file says finished and every picture it names is a file, none unnamed in the folder' % kit, good,
           '%d sheets, %d pieces%s%s' % (len({e.split('#')[0] for l in art['floor'].values() for e in l}), len(sizes), (', gone: ' + ', '.join(gone[:4])) if gone else '', (', unnamed: ' + ', '.join(extra[:4])) if extra else ''))
        cache = {}; lists = {k: [tiles_of(kit, e, cache) for e in v] for k, v in art['floor'].items()}
        shapes = {s: Image.open(os.path.join(FG, s)).size for s in {e.split('#')[0] for l in art['floor'].values() for e in l}}
        off = [e for l in art['floor'].values() for e in l if not (0 <= int(e.split('#')[1].split(',')[0]) < 5 and 0 <= int(e.split('#')[1].split(',')[1]) < 5)]
        ok('A2 %s: every sheet is five by five tiles of 515 x 364, every list entry a tile on its sheet' % kit, all(s == (TW * 5, TH * 5) for s in shapes.values()) and not off and all(t.shape == (TH, TW) for l in lists.values() for t in l),
           ', '.join('%s %dx%d' % (os.path.basename(s), z[0], z[1]) for s, z in sorted(shapes.items())))
        res = {k: joins(v) for k, v in lists.items()}
        for (ka, kb) in K['beside']: res[ka + ' beside ' + kb] = joins(lists[ka], lists[kb])
        bad = {k: v for k, v in res.items() if v[0] > v[2]}
        ok('*** A3 %s: ANY TILE MEETS ANY TILE *** (the step in tone across a join no more than the ground\'s own inside a tile, every pair)' % kit, not bad,
           '; '.join('%s worst %.1f, middle %.1f, allowed %.1f' % (k, v[0], v[1], v[2]) for k, v in res.items()))
        b4 = a4(kit, K, sizes)
        ok('A4 %s: every piece its file\'s own size, its foot on its canvas, a wall one tile long' % kit, not b4, '; '.join(b4[:4]) if b4 else '%d pieces' % len(sizes))
        tot = sum(os.path.getsize(os.path.join(folder, f)) for f in os.listdir(folder) if f.endswith('.webp'))
        ok('A5 %s: the kit\'s pictures under its budget' % kit, tot <= K['budget'], '%s bytes of %s' % (format(tot, ','), format(K['budget'], ',')))
        pur = {f: purple(os.path.join(folder, f)) for f in os.listdir(folder) if f.endswith('.webp')}
        ok('A6 %s: PURPLE RESERVATION, not one purple pixel' % kit, not any(pur.values()), ', '.join('%s %d' % kv for kv in pur.items() if kv[1]) or '%d pictures' % len(pur))
        # P1 planted, in memory
        k0 = sorted(lists)[0]; t2 = [t.copy() for t in lists[k0]]; t2[3] = t2[3] * 0.875; p3 = joins(t2); p3 = p3[0] > p3[2]
        s2 = json.loads(json.dumps(sizes)); kk = sorted(s2)[0]; s2[kk]['src'] = kit + '/not_there.webp'; p1 = not a1(kit, K, art, s2)[0]
        s3 = json.loads(json.dumps(sizes)); s3[kk]['foot'] = [s3[kk]['w'] + 40, 5]; p4 = bool(a4(kit, K, s3))
        ok('P1 %s PLANTED: a tile an eighth darker turns A3 red, a piece with no file A1, a foot off its canvas A4' % kit, p3 and p1 and p4, 'A3 %s, A1 %s, A4 %s' % (p3, p1, p4))
    ceilings()
    print('\nTHE INSIDES WEAR FINISHED ART: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
