#!/usr/bin/env python3
"""EYES AND EARS -- THE FIVE TELLS BY HAND (lane 17, row [the five tells by hand], 10/18)

Rule 114a's last sentence: until the style guide and the gates exist, the five biggest tells are the review, on
every new sheet. DIRECTION shipped the style guide (records/target/BOHEMIA_STYLE_GUIDE.json, 077f30f); PLUMBER's ten
NOT VIBE CODED gates are not in the suite yet, so this is still the review, and it now measures AGAINST THE GUIDE'S
OWN NUMBERS instead of the research page's generic ones. Read only; measured, never eyeballed.

THE FIVE, per new VOTE sheet (each sprite is one connected thing on the sheet's flat background):
  1 NATIVE PIXEL SIZES SEEN (count). Per sprite, the largest n in 1,2,3,4,6,8 for which at least 95 percent of
    the n x n blocks (best grid offset) are one colour. Field 2: integer scale only. Two sizes on one sheet is a
    mixel, unless the sheet shows a before at another scale on purpose (said per sheet).
  2 COLOURS PER SPRITE (max) and the TOP-EIGHT SHARE. Field 5: the guide caps the SOURCE palette, never the
    output (DIRECTION's 'his art is not limited-palette'), so the output is read against field 5's top8 share
    ceiling of 11.1 percent (a render snapped to a short list piles its pixels on eight colours). Reported, and
    the max colours is printed so a flat old sprite beside a render shows up as what it is.
  3 LIGHT DIRECTIONS SEEN (count). Per sprite, the highlight-minus-shadow vector (centroid of its brightest 15
    percent minus its darkest 15 percent), in the guide's convention (0 screen-right, 90 up); field 6 says 155.4
    plus or minus 30. Counted as the number of 45-degree sectors the sheet's sprites land in, plus how many sit
    outside the guide's window.
  4 RAMPS WITH NO HUE SHIFT (count). Per sprite, up to three hue peaks; for each, the pixels within 40 degrees of
    the peak are split by value and the light third's hue is compared with the dark third's. Field 4: a ramp walks
    at least 8 degrees; under that, the shade() signature.
  5 REST AREA PRESENT (yes or no). The share of a sprite's pixels whose 5 x 5 neighbourhood is calm (luminance
    spread under REST_STD). Field 11: at least a quarter of a model reads as rest. CALIBRATED on his YES (field 18,
    tie-breaker 1: the robot and the truck are the maquettes and a number that fails them is the wrong number):
    REST_STD is the smallest spread at which both maquettes pass, found by --calibrate and written below.

USAGE:  python3 tools/bohemia_eyes_the_five_tells_10_18_26.py              # every unjudged, unsorted image card
        python3 tools/bohemia_eyes_the_five_tells_10_18_26.py PNG [PNG..]  # any sheets
        python3 tools/bohemia_eyes_the_five_tells_10_18_26.py --calibrate  # the maquettes
"""
import colorsys, collections, json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
TRI = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_TRIAGE.json')
GUIDE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
OUT = os.path.join(ROOT, 'records/target/EYES_THE_FIVE_TELLS.json')
MAQUETTES = ['records/target/master_rig/DIRECTION_THE_MASTER_RIG_ROBOT.png', 'records/target/master_rig/DIRECTION_THE_MASTER_RIG_TRUCK.png']
# His YES on the pack road (rule 115b: buildings stay on his packs): the straight-roof family and the corner shop, both
# up on 10/17. A pack sheet is held to these, a rig sheet to the maquettes; tie-breaker 1 either way.
PACK_YES = ['records/target/COOK4_THE_STRAIGHT_ROOF_FAMILY.png', 'records/target/COOK4_THE_CORNER_SHOP_STRAIGHT_ROOF.png']
REST_STD = 8.0          # --calibrate: the smallest spread at which both maquettes pass on 90 percent of their sprites (robot 67 of 68, truck 16 of 17)
CELL = 4                # the component grid: 4 x 4 pixel cells, one cell of dilation
MIN_PX = 900            # a sprite is at least this many opaque pixels ...
MIN_COLOURS = 40        # ... and this many colours (lettering and frames are two or three)


def guide():
    g = json.load(open(GUIDE))
    f = {x.get('key') or x.get('n'): x['value'] for x in g['fields']}
    return {'light_deg': g['rig']['calibration']['screen_light_deg'], 'light_tol': g['rig']['calibration']['screen_light_tolerance_deg'],
            'hue_min': f['palette']['hue_shift_deg_min'], 'top8_max': f['colour_budget']['top8_share_max_pct']}


def components(a):
    """Sprites on a flat background: [(y0, y1, x0, x1, mask)] at full resolution."""
    h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(np.int16)
    edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    vals, counts = np.unique(edge.reshape(-1, 3), axis=0, return_counts=True)
    bg = vals[counts.argmax()]
    on = (np.abs(rgb - bg).max(axis=2) > 6) & (a[:, :, 3] > 127)
    H, W = (h + CELL - 1) // CELL, (w + CELL - 1) // CELL
    pad = np.zeros((H * CELL, W * CELL), bool); pad[:h, :w] = on
    grid = pad.reshape(H, CELL, W, CELL).any(axis=(1, 3))
    seen = np.zeros_like(grid); out = []
    for sy, sx in zip(*np.nonzero(grid)):
        if seen[sy, sx]:
            continue
        stack, cells = [(sy, sx)], []
        seen[sy, sx] = True
        while stack:
            y, x = stack.pop(); cells.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < H and 0 <= nx < W and grid[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True; stack.append((ny, nx))
        ys = [c[0] for c in cells]; xs = [c[1] for c in cells]
        y0, y1, x0, x1 = min(ys) * CELL, min(h, (max(ys) + 1) * CELL), min(xs) * CELL, min(w, (max(xs) + 1) * CELL)
        m = on[y0:y1, x0:x1]
        if m.sum() >= MIN_PX:
            out.append((y0, y1, x0, x1, m))
    return out


def native_size(rgb, m):
    best = 1
    for n in (2, 3, 4, 6, 8):
        h, w = m.shape
        if h < 4 * n or w < 4 * n:
            break
        good = 0.0
        for oy in range(n):
            for ox in range(n):
                hh, ww = (h - oy) // n * n, (w - ox) // n * n
                c = rgb[oy:oy + hh, ox:ox + ww].reshape(hh // n, n, ww // n, n, 3)
                mm = m[oy:oy + hh, ox:ox + ww].reshape(hh // n, n, ww // n, n).all(axis=(1, 3))
                if mm.sum() < 8:
                    continue
                flat = (c == c[:, :1, :, :1]).all(axis=(1, 3, 4))
                good = max(good, flat[mm].mean())
        if good >= 0.95:
            best = n
    return best


def lum(rgb):
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def light_deg(rgb, m):
    """The interior only (two pixels of erosion take off the ring) and nothing under 30 of 255 (the contact
    shadow and the deepest crevice are not the shading's dark side)."""
    L = lum(rgb.astype(float)); k = m.copy()
    for _ in range(2):
        e = k.copy(); e[1:] &= k[:-1]; e[:-1] &= k[1:]; e[:, 1:] &= k[:, :-1]; e[:, :-1] &= k[:, 1:]; k = e
    k &= L > 30
    ys, xs = np.nonzero(k); v = L[ys, xs]
    if len(v) < 64 or v.max() - v.min() < 20:
        return None
    hi, lo = v >= np.percentile(v, 85), v <= np.percentile(v, 15)
    dx = xs[hi].mean() - xs[lo].mean(); dy = ys[hi].mean() - ys[lo].mean()
    if math.hypot(dx, dy) < 2:
        return None
    return (math.degrees(math.atan2(-dy, dx)) + 360) % 360


def hue_ramps(px):
    """[(peak_deg, shift_deg)] for up to three hue peaks with a real value span."""
    a = px.astype(float) / 255.0
    mx, mn = a.max(axis=1), a.min(axis=1)
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0)
    keep = (s > 0.12) & (mx > 0.08)
    a, mx = a[keep], mx[keep]
    if len(a) < 200:
        return []
    hs = np.array([colorsys.rgb_to_hsv(*c)[0] * 360 for c in a[:: max(1, len(a) // 20000)]])
    vs = mx[:: max(1, len(a) // 20000)]
    hist = np.bincount((hs // 10).astype(int) % 36, minlength=36)
    out, used = [], np.zeros(36, bool)
    for _ in range(3):
        cand = np.where(used, -1, hist)
        k = int(cand.argmax())
        if cand[k] < 0.05 * len(hs):
            break
        used[[(k + d) % 36 for d in range(-4, 5)]] = True
        peak = k * 10 + 5
        d = (hs - peak + 180) % 360 - 180
        sel = np.abs(d) <= 40
        if sel.sum() < 60:
            continue
        v, dd = vs[sel], d[sel]
        if v.max() - v.min() < 0.25:
            continue
        lo, hi = v <= np.percentile(v, 33), v >= np.percentile(v, 67)
        out.append((peak, float(abs(dd[hi].mean() - dd[lo].mean()))))
    return out


def rest_share(rgb, m, std=None):
    std = REST_STD if std is None else std
    L = lum(rgb.astype(float)); h, w = L.shape
    if h < 5 or w < 5:
        return 0.0
    k = 5
    p = np.pad(L, 2, mode='edge'); pm = np.pad(m, 2)
    s1 = np.zeros_like(L); s2 = np.zeros_like(L); cnt = np.zeros_like(L)
    for dy in range(k):
        for dx in range(k):
            win = p[dy:dy + h, dx:dx + w]; wm = pm[dy:dy + h, dx:dx + w]
            s1 += win * wm; s2 += win * win * wm; cnt += wm
    full = (cnt == k * k) & m
    if not full.any():
        return 0.0
    var = s2[full] / 25.0 - (s1[full] / 25.0) ** 2
    return float((np.sqrt(np.maximum(var, 0)) < std).sum()) / float(m.sum())


def strip_panel(rgb, m):
    """A sprite shown on a flat panel (his ground colour behind each facing) is the sprite, not the panel: when 60
    percent of the crop's edge is one colour, every pixel within 6 of it leaves the mask."""
    edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]).astype(np.int16)
    vals, cnt = np.unique(edge, axis=0, return_counts=True)
    if cnt.max() < 0.6 * len(edge):
        return m
    k = m & (np.abs(rgb.astype(np.int16) - vals[cnt.argmax()]).max(axis=2) > 6)
    return k if k.sum() >= MIN_PX // 3 else m


def sprite(a, c):
    y0, y1, x0, x1, m = c
    rgb = a[y0:y1, x0:x1, :3]
    m = strip_panel(rgb, m)
    px = rgb[m]
    keys = px[:, 0].astype(np.int64) << 16 | px[:, 1].astype(np.int64) << 8 | px[:, 2]
    _, cnt = np.unique(keys, return_counts=True)
    if len(cnt) < MIN_COLOURS:
        return None
    top8 = 100.0 * np.sort(cnt)[-8:].sum() / cnt.sum()
    return {'box': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'px': int(m.sum()), 'native': native_size(rgb, m),
            'colours': int(len(cnt)), 'top8_pct': round(top8, 1), 'light_deg': light_deg(rgb, m),
            'ramps': [(p, round(s, 1)) for p, s in hue_ramps(px)], 'rest': round(rest_share(rgb, m), 3)}


def his_band(G):
    """The light bands his YES sits in, one per road: the 5th to 95th percentile of the sprite angles on his rig
    maquettes and on his pack YES. A tall figure's highlight-minus-shadow vector leans to the vertical (head in the
    sun, legs in shade), so the sphere's 155.4 is not what a figure reads; his YES is (field 18, tie-breaker 1).
    The rest floor is the lower of the two roads' median rest shares, less a tenth."""
    if 'bands' not in G:
        G['bands'], rests = [], []
        for group in (MAQUETTES, PACK_YES):
            xs, rs = [], []
            for mq in group:
                a = np.asarray(Image.open(os.path.join(ROOT, mq)).convert('RGBA'))
                for c in components(a):
                    sp = sprite(a, c)
                    if sp:
                        rs.append(sp['rest'])
                        if sp['light_deg'] is not None:
                            xs.append(sp['light_deg'])
            G['bands'].append((round(float(np.percentile(xs, 5)), 1), round(float(np.percentile(xs, 95)), 1)))
            rests.append(float(np.median(rs)))
        G['rest_floor'] = [round(x, 3) for x in rests]
    return G['bands']


PACK_LANES = ('cook 2', 'cook 4', 'cook2', 'cook4', 'cook two', 'cook four')


UI_LANES = ('ui', 'run 2', 'run2', 'run two')


def sheet(path, G, lane=None, kind=None):
    a = np.asarray(Image.open(path).convert('RGBA'))
    sp = [s for s in (sprite(a, c) for c in components(a)) if s]
    if not sp:
        return {'sheet': os.path.relpath(path, ROOT), 'sprites': 0}
    ones = [s['box'][2:] for s in sp if s['native'] == 1]
    for s_ in sp:   # a zoom: an n-times sprite whose box over n matches a 1:1 sprite's box on the same sheet (within 15 percent)
        n = s_['native']
        s_['zoom_of_a_1to1'] = n > 1 and any(abs(s_['box'][2] / n - w) <= 0.15 * w + 2 and abs(s_['box'][3] / n - h) <= 0.15 * h + 2 for w, h in ones)
    natives = sorted(set(s['native'] for s in sp if not s['zoom_of_a_1to1']))
    zooms = sorted(set(s['native'] for s in sp if s['zoom_of_a_1to1']))
    lights = [s['light_deg'] for s in sp if s['light_deg'] is not None]
    bands = his_band(G)
    off = [x for x in lights if not (bands[0][0] - 15 <= x <= bands[0][1] + 15)]   # the rig band; the pack band is reported only
    sectors = sorted(set(int(((x + 22.5) % 360) // 45) * 45 for x in lights))
    flat = [(i, p, sft) for i, s in enumerate(sp) for p, sft in s['ramps'] if sft < G['hue_min']]
    rest = [s['rest'] for s in sp]
    his_band(G)
    r = {'sheet': os.path.relpath(path, ROOT), 'sprites': len(sp),
            '1_native_sizes': natives, '1_declared_zooms': zooms, '2_colours_max': max(s['colours'] for s in sp),
            '2_top8_max_pct': max(s['top8_pct'] for s in sp), '2_top8_over_guide': sum(1 for s in sp if s['top8_pct'] > G['top8_max']),
            '3_light_sectors': sectors, '3_light_outside_guide': len(off), '3_light_read': len(lights),
            '4_ramps_no_hue_shift': len(flat), '4_ramps_read': sum(len(s['ramps']) for s in sp),
            '5_rest_present': sum(1 for r in rest if r >= 0.25), '5_rest_median': round(float(np.median(rest)), 3),
            'detail': sp}
    pack = str(lane or '').lower() in PACK_LANES or os.path.relpath(path, ROOT) in PACK_YES
    ui = not pack and (kind == 'ui' or str(lane or '').lower() in UI_LANES)
    r['road'] = 'pack' if pack else ('ui' if ui else 'rig')
    pack = pack or ui   # a UI screen (field 14, rig false) is faces, icons and cards: tells 3 and 5 report only there too
    # On the pack road his own YES spans 190 degrees of light and has no calm area (0.00 to 0.05), so tells 3 and 5
    # cannot judge pack art: reported, never culled. Pixel size culls on both roads.
    r['cull'] = [w for w, bad in (('two pixel sizes', len(natives) > 1),
                                  ('light outside his YES on over half the sprites', not pack and lights and len(off) * 2 > len(lights)),
                                  ('no rest area (median under %.2f, a quarter is the guide)' % 0.25,
                                   not pack and r['5_rest_median'] < 0.25)) if bad]
    return r


def line(r):
    if not r.get('sprites'):
        return '%s: no sprite found on a flat background' % r['sheet']
    return ('%s: %d sprites | 1 native sizes %s, zooms %s | 2 colours max %d, top-8 max %.1f%% (source-held) | 3 light sectors %d, %d of %d '
            'outside his rig YES | 4 output ramps under 8 deg %d of %d (source-held) | 5 rest area on %d of %d (median %.2f) | %s road | %s') % (
        r['sheet'].split('/')[-1], r['sprites'], r['1_native_sizes'], r['1_declared_zooms'] or '-', r['2_colours_max'], r['2_top8_max_pct'],
        len(r['3_light_sectors']), r['3_light_outside_guide'], r['3_light_read'], r['4_ramps_no_hue_shift'],
        r['4_ramps_read'], r['5_rest_present'], r['sprites'], r['5_rest_median'], r.get('road'), 'CULL: ' + '; '.join(r['cull']) if r['cull'] else 'PASS')


def new_cards():
    d = json.load(open(REG))
    try:
        tags = json.load(open(TRI)).get('tags', {})
    except Exception:
        tags = {}
    judged = {v['id'] for v in d['verdicts']}
    out = []
    for it in d['items']:
        sh = it.get('show') or {}
        if it['id'] in judged or it['id'] in tags or sh.get('how') != 'image':
            continue
        p = os.path.normpath(os.path.join(ROOT, 'slices', sh.get('src', '')))
        if os.path.exists(p):
            out.append((it, p))
    return out


def main():
    G = guide()
    global REST_STD
    if '--calibrate' in sys.argv:
        for std in (3, 4, 5, 6, 8, 10, 12):
            REST_STD = std
            meds = []
            for m in MAQUETTES:
                r = sheet(os.path.join(ROOT, m), G)
                meds.append((os.path.basename(m), r['5_rest_present'], r['sprites'], r['5_rest_median']))
            print('REST_STD %-3s %s' % (std, meds))
        return 0
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    todo = [(None, os.path.abspath(a)) for a in args] if args else new_cards()
    rows = []
    for it, p in todo:
        r = sheet(p, G, it.get('lane') if it else None, it.get('kind') if it else None)
        r['id'] = it['id'] if it else None
        r['lane'] = it.get('lane') if it else None
        rows.append(r)
        print(('%-10s ' % (r['lane'] or ''))[:11] + line(r))
    for m in MAQUETTES + PACK_YES:
        r = sheet(os.path.join(ROOT, m), G)
        print('HIS YES    ' + line(r))
    print('his YES light bands (rig, pack): %s; his YES median rest (rig, pack): %s' % (G['bands'], G['rest_floor']))
    if not args:
        json.dump({'made': 'EYES [the five tells by hand], tools/bohemia_eyes_the_five_tells_10_18_26.py, against records/target/BOHEMIA_STYLE_GUIDE.json; '
                           'read only; REST_STD %.1f calibrated on his two maquettes' % REST_STD,
                   'guide': G, 'sheets': [{k: v for k, v in r.items() if k != 'detail'} for r in rows]},
                  open(OUT, 'w'), indent=1)
    return 0


if __name__ == '__main__':
    sys.exit(main())
