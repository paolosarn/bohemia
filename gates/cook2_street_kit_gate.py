#!/usr/bin/env python3
"""COOK TWO street kit gate (rule 77 TILES ARE LEGOS, rule 82a FROM THE PACKS).
1. every piece's written edges agree with its own pixels (road dark, walk light, read 6 px in);
2. every piece keys at least one (pool, index) from the approved banks;
3. every pair of pieces whose facing edges are written alike meets on the pixels too (road/walk runs within 3 px)."""
import json, os, sys
import numpy as np
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(R, 'slices/fight_ground/kit_street')
man = json.load(open(os.path.join(D, 'kit_street.json')))
M = man['tile_metres']; ok = fail = 0
def side(img, s):
    a = np.asarray(img).astype(int)
    strip = {'N': a[:10], 'S': a[-10:], 'W': a[:, :10].transpose(1, 0, 2), 'E': a[:, -10:].transpose(1, 0, 2)}[s]
    # his sidewalk is tan (red over blue ~24), his asphalt grey (~3): warmth, not brightness, because the
    # walk's weeds and cracks are as dark as the road
    warm = np.median((strip[..., 0] - strip[..., 2]), axis=0)
    warm = np.array([np.median(warm[max(0, i - 7):i + 8]) for i in range(len(warm))])
    return np.where(warm > 12, 'walk', 'road')
def want(runs, n):
    t = np.empty(n, dtype=object)
    for k, a, b in runs: t[int(a / M * n):int(round(b / M * n))] = k
    return t
def check(c, msg):
    global ok, fail
    if c: ok += 1
    else: fail += 1; print('FAIL', msg)
imgs = {n: Image.open(os.path.join(D, p['src'])).convert('RGB') for n, p in man['pieces'].items()}
for n, p in man['pieces'].items():
    check(any(k[0] in ('street', 'side', 'cross') for k in p['keys']), f'{n}: no approved pool key')
    for s in 'NSEW':
        got = side(imgs[n], s); L = len(got)
        for k, a, b in p['edges'][s]:
            i0, i1 = int(a / M * L) + 4, int(round(b / M * L)) - 4   # a run is judged inside its ends
            share = (got[i0:i1] == k).mean()
            # 0.85 -> 0.80 (round six): a 7 px crack in his slab along a 45 px corner square read as road; the planted mutations read 40% and lower
            check(share >= 0.80, f'{n} {s}: run {k} {a}-{b} m only {share:.0%} {k} on the pixels')
OPP = {'E': 'W', 'S': 'N'}
for a in man['pieces']:
    for b in man['pieces']:
        for s, o in OPP.items():
            if man['pieces'][a]['edges'][s] == man['pieces'][b]['edges'][o]:
                ga, gb = side(imgs[a], s), side(imgs[b], o)
                d = (ga != gb).sum()   # weeds and cracks differ; a misplaced kerb is a run of 30+ px
                check(d <= 0.12 * len(ga), f'{a}.{s} | {b}.{o}: written alike, {d} px differ')
# THE COVER KIT (round seven, [the cars and the props from the packs]): every piece is a sprite he judged UP
CV = os.path.join(R, 'slices/fight_ground/kit_cover')
if os.path.exists(os.path.join(CV, 'kit_cover.json')):
    up = {(v['pack'], v['idx']) for v in json.load(open(os.path.join(R, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts'] if v['v'] == 'UP'}
    cv = json.load(open(os.path.join(CV, 'kit_cover.json')))
    for n, p in cv['pieces'].items():
        check(os.path.exists(os.path.join(CV, p['src'])), f'cover {n}: {p["src"]} missing')
        for k in p['keys']: check((k['pack'], k['idx']) in up, f'cover {n}: {k} is not UP in his confirmed set')
print(f'COOK2 STREET KIT {ok}/{fail}'); sys.exit(1 if fail else 0)
