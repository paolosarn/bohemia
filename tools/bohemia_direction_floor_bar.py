#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, THE FLOOR BAR (row [fight verdict 24], 10/19/26). His NO on the fight floor 10/18 ('I hate the
ground. I hate the floor... it's so fucking bad') and his YES on one real street (cook2-one-real-street-10-18) and on
the streets joining for the map ('way better nice'), turned into numbers a floor kit is measured against before it
reaches VOTE. The numbers live in records/target/BOHEMIA_STYLE_GUIDE.json, classes.ground.floor_bar (rule 114a: the
style guide is law; a number anywhere else is a copy). This file only measures.

WHAT IT MEASURES, at the picture's own pixels (a floor kit at 40 to 60 px a metre, his packs' range):
  B1 THE DIRT IS PALE      mean HSV saturation of the bare dirt (16 px cells that are all dirt-coloured and flat)
  B2 NOT ORANGE            mean hue of the same cells, in degrees
  B3 NO CAMOUFLAGE         the two-tone split: the gap in brightness between the two tones the dirt cells fall into
                           (Otsu on the cell means; a print of dark blobs on light sand is two tones far apart)
  B4 THE DIRT HAS GRIT     median brightness spread inside a dirt cell (grain, stones, ruts; never a smooth fill)
  B5 THE ROAD NEVER REPEATS the highest correlation of the road band with itself shifted sideways 150 px or more
                           (one asphalt tile laid every house reads as a pattern)
  B6 NO BRIGHT ORANGE ROOF share of the picture that is bright medieval orange (his note on the roofs, rule 115b)

REFERENCE CHECK (the 9/4 standing duty): his YES twin, records/target/COOK2_ONE_REAL_STREET.webp, is the control that
must PASS; the fight's own block pictures (slices/fight_ground/block_*.webp, the floor he hates) are the control that
must FAIL. --self runs both. No reference game.

usage: python3 tools/bohemia_direction_floor_bar.py <picture> [<picture> ...]   (exit 1 if any fails)
       python3 tools/bohemia_direction_floor_bar.py --self                        (the two controls)
"""
import sys, os, json
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
YES = os.path.join(ROOT, 'records/target/COOK2_ONE_REAL_STREET.webp')
YES_SCENE = (0, 65, 5851, 2050)   # the street itself; the sheet's own title strip and the twin below are not his street


def bar():
    return json.load(open(GUIDE))['classes']['ground']['floor_bar']


def hsv(a):
    a = a / 255.0; mx = a.max(-1); mn = a.min(-1); d = mx - mn + 1e-9
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, np.where(mx > 0, d / (mx + 1e-9), 0), mx


def cells(x, c):
    H, W = x.shape[:2]
    return x[:H - H % c, :W - W % c].reshape(H // c, c, W // c, c).swapaxes(1, 2).reshape(H // c, W // c, -1)


def ground(a, B):
    c = B['cell_px']; a = a.astype(float)
    L = a @ [0.299, 0.587, 0.114]; h, s, v = hsv(a)
    lo, hi = B['dirt_mask']['hue'], B['dirt_mask']
    dirt = (h > lo[0]) & (h < lo[1]) & (s > hi['sat'][0]) & (s < hi['sat'][1]) & (v > hi['val'][0]) & (v < hi['val'][1])
    Lc = cells(L, c); sd = Lc.std(-1); ok = cells(dirt, c).all(-1) & (sd < hi['flat_sd_max'])
    if ok.sum() < B['min_dirt_cells']:
        return None
    m = Lc.mean(-1)[ok]; xs = np.sort(m); best = 0.0
    for t in np.percentile(xs, np.arange(5, 96)):
        a1, a2 = xs[xs <= t], xs[xs > t]
        if len(a1) >= 3 and len(a2) >= 3:
            best = max(best, len(a1) * len(a2) / len(xs) ** 2 * (a1.mean() - a2.mean()) ** 2)
    return dict(dirt_cells=int(ok.sum()), sat=round(float(cells(s, c).mean(-1)[ok].mean()), 3),
                hue=round(float(cells(h, c).mean(-1)[ok].mean()), 1), split=round(float(2 * np.sqrt(best)), 1),
                grit=round(float(np.median(sd[ok])), 2))


def road_rows(a, B):
    h, s, v = hsv(a.astype(float)); R = B['road_mask']
    road = (v < R['val_max']) & (s < R['sat_max'])
    rows = np.where(road.mean(1) > R['row_share'])[0]
    if len(rows) < R['min_rows']:
        return None
    runs = np.split(rows, np.where(np.diff(rows) > 1)[0] + 1); run = max(runs, key=len)
    return (int(run[0]), int(run[-1]) + 1) if len(run) >= R['min_rows'] else None


def repeat(a, B):
    rr = road_rows(a, B)
    if rr is None:
        return None
    L = a[rr[0]:rr[1]].astype(float) @ [0.299, 0.587, 0.114]; L = L - L.mean(1, keepdims=True)
    W = L.shape[1]
    # every sideways shift at once (the rows' autocorrelation by FFT), each shift scored on the part that overlaps
    F = np.fft.rfft(L, n=2 * W, axis=1); acf = np.fft.irfft((F * np.conj(F)).sum(0), n=2 * W)[:W]
    lags = np.arange(B['repeat_lag_px'][0], min(B['repeat_lag_px'][1], W - 200))
    if not len(lags):
        return None
    cc = acf[lags] / ((W - lags) / W * acf[0] + 1e-12); i = int(np.argmax(cc))
    return dict(rows=list(rr), peak=round(float(cc[i]), 3), lag=int(lags[i]))


def orange(a, B):
    h, s, v = hsv(a.astype(float)); O = B['orange_roof_mask']
    return round(float(((h > O['hue'][0]) & (h < O['hue'][1]) & (s > O['sat_min']) & (v > O['val_min'])).mean() * 100), 2)


def measure(a, B=None):
    B = B or bar()
    g, r, o = ground(a, B), repeat(a, B), orange(a, B)
    T = B['tests']; out = {'ground': g, 'road': r, 'orange_pct': o, 'tests': {}}
    if g:
        out['tests']['B1'] = g['sat'] <= T['B1_sat_max']
        out['tests']['B2'] = T['B2_hue'][0] <= g['hue'] <= T['B2_hue'][1]
        out['tests']['B3'] = g['split'] <= T['B3_split_max']
        out['tests']['B4'] = T['B4_grit'][0] <= g['grit'] <= T['B4_grit'][1]
    if r:
        out['tests']['B5'] = r['peak'] <= T['B5_repeat_max']
    out['tests']['B6'] = o <= T['B6_orange_pct_max']
    out['pass'] = all(out['tests'].values())
    return out


def load(p, box=None):
    im = Image.open(p).convert('RGB')
    return np.asarray(im.crop(box) if box else im)


if __name__ == '__main__':
    B = bar(); args = sys.argv[1:]
    if args == ['--self']:
        y = measure(load(YES, YES_SCENE), B)
        print('YES  one real street  %s  %s' % ('PASS' if y['pass'] else 'FAIL', json.dumps(y)))
        bad = 0; names = ['subs_0', 'corner_0', 'strip_0', 'ruin_0', 'scrub_0', 'freeway_0']
        for n in names:
            m = measure(load(os.path.join(ROOT, 'slices/fight_ground/block_%s.webp' % n)), B)
            bad += not m['pass']
            print('NOW  block_%-10s %s  %s' % (n, 'PASS' if m['pass'] else 'FAIL', json.dumps(m)))
        ok = y['pass'] and bad == len(names)
        print('CONTROLS %s: his YES passes = %s, the floor he hates fails %d of %d' % ('GOOD' if ok else 'BROKEN', y['pass'], bad, len(names)))
        sys.exit(0 if ok else 1)
    fails = 0
    for p in args:
        m = measure(load(p), B); fails += not m['pass']
        print('%s  %s  %s' % ('PASS' if m['pass'] else 'FAIL', p, json.dumps(m)))
    sys.exit(1 if fails else 0)
