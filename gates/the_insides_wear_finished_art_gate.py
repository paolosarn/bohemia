#!/usr/bin/env python3
"""THE INSIDES WEAR FINISHED ART (COOK FIVE, 11/11/26; VAMILY rules 443(g), 441, 440(a), 416; the coordinator's 'next round':
'the art for the two coming boards, THE FLOOD TUNNELS and THE PARKING GARAGE, so they do not ship as stand-ins').

The two boards are COMBAT's (the tunnels parked on origin combat2-tunnels-parked-2, the garage not laid yet). Their PICTURES
are made ahead through the master rig (tools/bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26.py) and wait in
slices/fight_ground/<kit>/ with an art file a board reads its lists from. A board picks ANY tile of a sheet for ANY place,
so the one thing a picture can get wrong without anybody seeing it in the tool is the join: this gate measures it.

  for each kit in KITS (tunnels; garage when its pictures land):
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
python3 gates/the_insides_wear_finished_art_gate.py   (about 5 s)
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FG = os.path.join(ROOT, 'slices', 'fight_ground')
TW, TH = 515, 364
KITS = {'tunnels': dict(art='tunnels_art.json', budget=900000, walls=('wall_ew', 'wall_ew_b', 'wall_ew_c'),
                        beside=[])}          # (kind, kind) pairs of ground lists that lie side by side AND must join without a line
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def tiles_of(folder, entry, cache):
    """'tunnels/tunnel_floor_0.webp#2,3' -> that tile's luma (364 x 515 float)"""
    src, at = entry.split('#'); c, r = map(int, at.split(','))
    if src not in cache:
        cache[src] = np.asarray(Image.open(os.path.join(FG, src)).convert('L'), np.float32)
    a = cache[src]
    return a[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW]


def smooth(v, n=9):
    return np.convolve(v, np.ones(n) / n, mode='valid')


def step_ew(a, b):
    """the step in tone from a's east edge to b's west edge, along the edge"""
    return float(np.mean(np.abs(smooth(a[:, -6:].mean(1)) - smooth(b[:, :6].mean(1)))))


def step_ns(a, b):
    return float(np.mean(np.abs(smooth(a[-6:, :].mean(0)) - smooth(b[:6, :].mean(0)))))


def inside(a):
    """the same measure between two strips six pixels apart inside a tile (what the ground's own texture does)"""
    out = []
    for x in (100, 200, 300, 400): out.append(float(np.mean(np.abs(smooth(a[:, x - 6:x].mean(1)) - smooth(a[:, x:x + 6].mean(1))))))
    for y in (80, 160, 240, 300): out.append(float(np.mean(np.abs(smooth(a[y - 6:y, :].mean(0)) - smooth(a[y:y + 6, :].mean(0))))))
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
    print('\nTHE INSIDES WEAR FINISHED ART: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
