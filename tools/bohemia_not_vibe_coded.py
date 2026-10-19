#!/usr/bin/env python3
"""THE NOT VIBE CODED CHECKS -- ten image tests for the AI look (10/18/26, PLUMBER lane,
VAMILY row [the not vibe coded gates]; rule 114b; Paolo 10/16: "it can't look like it's vibe coded").

The ten checks of Section D of records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_ONE_10_16_26.md,
in its order, each a pure image or text test with the number its tell carries in Section A:

  D1  ONE PIXEL SIZE      the native block size per 16x16 tile agrees across the sprite (tells 1, 2, 30)
  D2  PALETTE AND COUNT   distinct opaque colours under the class cap; every colour in the palette file
                          when one is named (tells 4, 5)
  D3  ONE LIGHT           dark-20% centroid -> light-20% centroid is within 30 degrees of the declared light
                          and long enough to be a light at all (tell 9)
  D4  HUE SHIFT           ramps of 3+ steps move hue 8+ degrees dark to light; over half straight is the tell (6)
  D5  REST AND FOCUS      edge density per block: Gini 0.4+, the quietest quartile under 40% of the busiest (16, 18)
  D6  SILHOUETTE          8x8 mask IoU between sprites of one class under 0.85; the 8x8 mask is not a box (17)
  D7  THREE VALUES        three luminance bins (1st to 99th percentile) each 12%+ of the sprite, none over 75% (15)
  D8  CLEAN LINES         orphans under 2 per 1,000 opaque; no 2x2 outline blocks; jaggies under 3 per 100
                          outline pixels; banding under 15%; pillow r under 0.7 (10, 11, 12, 13)
  D9  REPETITION          on a scene or tile sheet: no 16x16 hash over 30% of the filled blocks and no run of
                          the same block over 6; a sprite wider than 24 px is not 97%+ its own mirror (19, 20)
  D10 UI DEFAULTS         gradients, blur, glow, radius over 2 px, panel hues 250 to 290, system fonts, in the
                          UI files the game ships (28, 29)

THRESHOLDS live in gates/not_vibe_coded_thresholds.json (PLUMBER's interim, the research page's numbers); when
DIRECTION's style guide data file lands (rule 114a) the gate reads its numbers first. A check that cannot
measure (a sprite with no opaque pixels, a ramp table with no ramps) says UNMEASURED, never pass.

  python3 tools/bohemia_not_vibe_coded.py <png> [<png> ...] [--class character] [--light upper-left]
  python3 tools/bohemia_not_vibe_coded.py --sheet <png>          # D9 on a scene or tile sheet
  python3 tools/bohemia_not_vibe_coded.py --ui <file> [...]      # D10 on html/css/js
"""
import json, math, os, re, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THRESH = os.path.join(ROOT, 'gates', 'not_vibe_coded_thresholds.json')

LIGHTS = {  # image coordinates: x right, y DOWN; the vector points from shadow toward light
    'upper-left': (-1, -1), 'upper-right': (1, -1), 'top': (0, -1), 'left': (-1, 0), 'right': (1, 0),
    'lower-left': (-1, 1), 'lower-right': (1, 1), 'bottom': (0, 1)}


def thresholds():
    """PLUMBER's interim numbers, with DIRECTION's style guide laid over them key by key the day it lands
    (rule 114a): any records/**/BOHEMIA_*STYLE_GUIDE*.json carrying a "not_vibe_coded" object of the same
    keys wins over this file, so the guide changes the ruler without anyone editing a gate."""
    import glob
    with open(THRESH) as f:
        T = json.load(f)
    for g in sorted(glob.glob(os.path.join(ROOT, 'records', '**', 'BOHEMIA_*STYLE_GUIDE*.json'), recursive=True)):
        try:
            over = json.load(open(g)).get('not_vibe_coded') or {}
        except (OSError, ValueError, AttributeError):
            continue
        for k, v in over.items():
            if k in T and not k.startswith('_'):
                T[k] = v
                T.setdefault('_from_guide', {})[k] = os.path.relpath(g, ROOT)
    return T


def load(src):
    im = src if isinstance(src, Image.Image) else Image.open(src)
    a = np.asarray(im.convert('RGBA'), dtype=np.int16)
    return a[..., :3], a[..., 3]


def lum(rgb):
    return (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) / 255.0


def hsv(rgb):
    r, g, b = [rgb[..., i] / 255.0 for i in range(3)]
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-9
    rm = m & (mx == r); gm = m & (mx == g) & ~rm; bm = m & ~rm & ~gm
    h[rm] = ((g - b)[rm] / d[rm]) % 6
    h[gm] = (b - r)[gm] / d[gm] + 2
    h[bm] = (r - g)[bm] / d[bm] + 4
    s = np.where(mx > 1e-9, d / np.maximum(mx, 1e-9), 0)
    return h * 60.0, s, mx


def keys(rgb):
    return (rgb[..., 0].astype(np.int64) << 16) | (rgb[..., 1].astype(np.int64) << 8) | rgb[..., 2].astype(np.int64)


def res(ok, value, why, unmeasured=False):
    return {'ok': None if unmeasured else bool(ok), 'value': value, 'why': why}


# ---- D1 one native pixel size --------------------------------------------------------------------
def native_scale(k, op, tile=None):
    """the art's block size: the largest s in 2..6 for which 95% of the colour changes fall on the
    lines of one s-grid (best offset), else 1. Big flat clusters do not fool it: a 1x sprite changes
    colour anywhere, a 2x upscale only ever on even lines."""
    hx = (k[:, :-1] != k[:, 1:]) & op[:, :-1] & op[:, 1:]
    vy = (k[:-1, :] != k[1:, :]) & op[:-1, :] & op[1:, :]
    xs = np.nonzero(hx)[1] + 1
    ys = np.nonzero(vy)[0] + 1
    if len(xs) + len(ys) < 12:
        return None
    best = 1
    for s in range(2, 7):
        okx = max(((xs - o) % s == 0).mean() if len(xs) else 1.0 for o in range(s))
        oky = max(((ys - o) % s == 0).mean() if len(ys) else 1.0 for o in range(s))
        if okx >= 0.95 and oky >= 0.95:
            best = s
    return best


def d1(rgb, a, T):
    k = keys(rgb); op = a >= 128
    tiles = []
    t = T['d1_tile']
    for y in range(0, k.shape[0] - t + 1, t):
        for x in range(0, k.shape[1] - t + 1, t):
            kk, oo = k[y:y + t, x:x + t], op[y:y + t, x:x + t]
            if oo.mean() < 0.75:
                continue
            # a flat tile says nothing about pixel size
            if len(np.unique(kk[oo])) < 3:
                continue
            ns = native_scale(kk, oo)
            if ns is not None:
                tiles.append(ns)
    if not tiles:
        return res(None, {'native': native_scale(k, op)}, 'no textured 16x16 tile to read', unmeasured=True)
    vals, cnt = np.unique(tiles, return_counts=True)
    modal = int(vals[cnt.argmax()]); share = float(cnt.max() / len(tiles))
    ok = share >= T['d1_agree']
    return res(ok, {'native': modal, 'agree': round(share, 3), 'tiles': len(tiles),
                    'sizes': {int(v): int(c) for v, c in zip(vals, cnt)}},
               '' if ok else 'mixels: %d%% of tiles at %dx, the rest at %s' % (
                   share * 100, modal, sorted(int(v) for v in vals if v != modal)))


# ---- D2 palette and colour count -----------------------------------------------------------------
def d2(rgb, a, T, cls='character', palette=None):
    op = a >= 128
    if not op.any():
        return res(None, {}, 'no opaque pixel', unmeasured=True)
    cols = np.unique(keys(rgb)[op])
    cap = T['d2_caps'].get(cls, T['d2_caps']['character'])
    off = None
    if palette is not None:
        off = int(np.isin(keys(rgb)[op], np.array(sorted(palette), dtype=np.int64), invert=True).sum())
    ok = len(cols) <= cap and (off in (None, 0))
    why = []
    if len(cols) > cap:
        why.append('%d colours, the %s cap is %d' % (len(cols), cls, cap))
    if off:
        why.append('%d pixels off the palette' % off)
    return res(ok, {'colours': int(len(cols)), 'cap': cap, 'off_palette_px': off}, '; '.join(why))


# ---- D3 one light --------------------------------------------------------------------------------
def light_vector(rgb, a):
    op = a >= 128
    if op.sum() < 20:
        return None
    L = lum(rgb); ys, xs = np.nonzero(op); v = L[op]
    lo, hi = np.quantile(v, 0.2), np.quantile(v, 0.8)
    if hi - lo < 1e-6:
        return (0.0, 0.0, 0.0)
    d = v <= lo; l = v >= hi
    dx = xs[l].mean() - xs[d].mean(); dy = ys[l].mean() - ys[d].mean()
    height = ys.max() - ys.min() + 1
    return (dx, dy, math.hypot(dx, dy) / height)


def d3(rgb, a, T, light='upper-left'):
    v = light_vector(rgb, a)
    if v is None:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    dx, dy, mag = v
    ang = math.degrees(math.atan2(dy, dx))
    if light == 'guide' and guide() is not None:
        wang = guide_light_image_deg(guide())
    else:
        want = LIGHTS.get(light, LIGHTS['upper-left'])
        wang = math.degrees(math.atan2(want[1], want[0]))
    off = abs((ang - wang + 180) % 360 - 180)
    ok = mag >= T['d3_min_len'] and off <= T['d3_within']
    why = '' if ok else ('the light is %d degrees off %s' % (off, light) if mag >= T['d3_min_len']
                         else 'no light: dark and light sit together (%.2f of the height)' % mag)
    return res(ok, {'angle_off': round(off, 1), 'length': round(mag, 3), 'declared': light}, why)


# ---- D4 hue shift in the ramps -------------------------------------------------------------------
def ramps(rgb, a, T):
    """colours of 0.2%+ of the sprite, saturated enough to have a hue, grouped into ramps:
    same hue within 40 degrees (single link) AND touching in the image; a ramp is 3+ colours."""
    op = a >= 128
    k = keys(rgb)
    vals, inv, cnt = np.unique(k[op], return_inverse=True, return_counts=True)
    keep = cnt >= max(2, T['d4_min_share'] * op.sum())
    if keep.sum() < 3:
        return []
    cols = np.stack([(vals >> 16) & 255, (vals >> 8) & 255, vals & 255], 1).astype(np.int16)
    H, S, V = hsv(cols[None])
    H, S, V = H[0], S[0], V[0]
    idx = [i for i in np.nonzero(keep)[0] if S[i] >= 0.12 and V[i] >= 0.06]
    if len(idx) < 3:
        return []
    # adjacency of colours in the image (4-neighbour)
    lab = np.full(k.shape, -1, np.int64)
    lab[op] = inv
    pairs = set()
    for A, B in ((lab[:, :-1], lab[:, 1:]), (lab[:-1, :], lab[1:, :])):
        m = (A >= 0) & (B >= 0) & (A != B)
        for p, q in set(zip(A[m].tolist(), B[m].tolist())):
            pairs.add((p, q)); pairs.add((q, p))
    parent = {i: i for i in idx}

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]; i = parent[i]
        return i
    for i in idx:
        for j in idx:
            if i < j and (i, j) in pairs and abs((H[i] - H[j] + 180) % 360 - 180) <= 40:
                parent[find(i)] = find(j)
    groups = {}
    for i in idx:
        groups.setdefault(find(i), []).append(i)
    out = []
    for g in groups.values():
        if len(g) < 3:
            continue
        L = [0.2126 * cols[i][0] + 0.7152 * cols[i][1] + 0.0722 * cols[i][2] for i in g]
        lo, hi = g[int(np.argmin(L))], g[int(np.argmax(L))]
        if max(L) - min(L) < 0.15 * 255:
            continue
        dh = abs((H[hi] - H[lo] + 180) % 360 - 180)
        out.append({'steps': len(g), 'hue_delta': round(float(dh), 1),
                    'sat_dark': round(float(S[lo]), 3), 'sat_light': round(float(S[hi]), 3)})
    return out


def quantised(rgb, a, n):
    """a sprite with more than n colours, median-cut to n (the ramps a viewer reads), transparent kept."""
    op = a >= 128
    if len(np.unique(keys(rgb)[op])) <= n:
        return rgb
    im = Image.fromarray(rgb.astype(np.uint8)).quantize(n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    return np.asarray(im.convert('RGB'), dtype=np.int16)


def d4(rgb, a, T):
    rs = ramps(quantised(rgb, a, T['d4_quantise']), a, T)
    if not rs:
        return res(None, {'ramps': 0}, 'no ramp of 3+ steps with a hue to read', unmeasured=True)
    straight = [r for r in rs if r['hue_delta'] < T['d4_min_shift']]
    share = len(straight) / len(rs)
    ok = share <= 0.5
    return res(ok, {'ramps': len(rs), 'straight': len(straight),
                    'median_shift': float(np.median([r['hue_delta'] for r in rs]))},
               '' if ok else '%d of %d ramps darken straight (under %d degrees)' % (
                   len(straight), len(rs), T['d4_min_shift']))


# ---- D5 rest areas and a focal point -------------------------------------------------------------
def edge_map(rgb, tol=24):
    """a colour change a viewer reads: summed RGB difference over tol (render noise of a few values is
    D2's business, not D5's)."""
    e = np.zeros(rgb.shape[:2], bool)
    e[:, :-1] |= np.abs(rgb[:, :-1] - rgb[:, 1:]).sum(-1) > tol
    e[:-1, :] |= np.abs(rgb[:-1, :] - rgb[1:, :]).sum(-1) > tol
    return e


def gini(x):
    x = np.sort(np.asarray(x, float))
    if x.sum() == 0:
        return 0.0
    n = len(x)
    return float((2 * np.arange(1, n + 1) - n - 1).dot(x) / (n * x.sum()))


def d5(rgb, a, T):
    op = a >= 128; e = edge_map(rgb) & op
    h, w = op.shape
    b = max(4, min(T['d5_block'], min(h, w) // 8))   # 16 px blocks, smaller on a small sprite: 8 a side at least
    dens = []
    for y in range(0, h - b + 1, b):
        for x in range(0, w - b + 1, b):
            o = op[y:y + b, x:x + b]
            if o.mean() < 0.5:
                continue
            dens.append(e[y:y + b, x:x + b].sum() / o.sum())
    if len(dens) < 8:
        return res(None, {'blocks': len(dens)}, 'fewer than eight filled blocks', unmeasured=True)
    dens = np.sort(dens); q = max(1, len(dens) // 4)
    quiet, busy = dens[:q].mean(), dens[-q:].mean()
    ratio = float(quiet / busy) if busy > 0 else 1.0
    g = gini(dens)
    ok = g >= T['d5_gini'] and ratio < T['d5_quiet_ratio']
    why = []
    if g < T['d5_gini']:
        why.append('detail spread evenly (Gini %.2f under %.2f)' % (g, T['d5_gini']))
    if ratio >= T['d5_quiet_ratio']:
        why.append('no rest area (quietest quarter %.0f%% of the busiest)' % (ratio * 100))
    return res(ok, {'gini': round(g, 3), 'quiet_over_busy': round(ratio, 3), 'block': b, 'blocks': len(dens)},
               '; '.join(why))


# ---- D6 silhouette -------------------------------------------------------------------------------
def mask_n(a, n):
    op = a >= 128
    ys, xs = np.nonzero(op)
    if not len(ys):
        return None
    m = op[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    im = Image.fromarray((m * 255).astype(np.uint8)).resize((n, n), Image.BOX)
    return np.asarray(im) >= 128


def d6_one(a, T, cls='character'):
    """a box at 8x8 (10/18, DIRECTION's reading on round five: the 3x3 mask filled all nine cells on every
    render incl. the maquettes, his YES; the research's own D10 reads the 8x8 silhouette). Fewer than
    d6_box_empty of the 64 cells empty is a box: the planted box reads 0, the truck and the drum 4, the
    robot 18, the man 26."""
    if cls == 'tile':
        return res(None, {}, 'a tile is a square on purpose', unmeasured=True)
    m8 = mask_n(a, 8)
    if m8 is None:
        return res(None, {}, 'empty', unmeasured=True)
    holes = int((~m8).sum())
    ok = holes >= T.get('d6_box_empty', 4)
    return res(ok, {'8x8_empty_cells': holes}, '' if ok else 'reads as a box at 8x8 (%d of 64 cells empty)' % holes)


def d6_set(alphas, names, T):
    ms = [mask_n(a, 8) for a in alphas]
    worst = (0.0, None)
    bad = []
    for i in range(len(ms)):
        for j in range(i + 1, len(ms)):
            if ms[i] is None or ms[j] is None:
                continue
            u = (ms[i] | ms[j]).sum()
            iou = float((ms[i] & ms[j]).sum() / u) if u else 1.0
            if iou > worst[0]:
                worst = (iou, (names[i], names[j]))
            if iou > T['d6_iou']:
                bad.append((names[i], names[j], round(iou, 3)))
    return res(not bad, {'worst_iou': round(worst[0], 3), 'worst_pair': worst[1], 'pairs_over': len(bad)},
               '' if not bad else '%d pairs read as one shape at 8x8 (worst %s %.2f)' % (len(bad), worst[1], worst[0]))


# ---- D7 three values -----------------------------------------------------------------------------
def d7(rgb, a, T):
    op = a >= 128
    if op.sum() < 20:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    # the 1st to 99th percentile, not min to max (10/18, DIRECTION: two eye-glint pixels on the finished robot
    # squeezed its light third to 9% while the raw render read 24/46/30; one glint is not the sprite's range)
    v = lum(rgb)[op]; lo, hi = np.percentile(v, 1), np.percentile(v, 99)
    if hi - lo < 1e-6:
        return res(False, {'bins': [1.0, 0, 0]}, 'one value only')
    t = np.clip((v - lo) / (hi - lo), 0, 1)
    bins = [float((t < 1 / 3).mean()), float(((t >= 1 / 3) & (t < 2 / 3)).mean()), float((t >= 2 / 3).mean())]
    ok = min(bins) >= T['d7_min_bin'] and max(bins) <= T['d7_max_bin']
    return res(ok, {'bins': [round(b, 3) for b in bins]},
               '' if ok else 'values %s: no three-value read' % '/'.join('%d%%' % (b * 100) for b in bins))


# ---- D8 clean lines ------------------------------------------------------------------------------
def components_of_size_one(k, op):
    """pixels whose 8 neighbours are all a different colour (or transparent): size-1 islands. Eight, not four:
    a one-pixel outline on a diagonal touches itself only at the corners and is a line, not orphans."""
    h, w = k.shape
    pad = np.full((h + 2, w + 2), -1, np.int64)
    pad[1:-1, 1:-1] = np.where(op, k, -1)
    c = pad[1:-1, 1:-1]
    same = np.zeros(c.shape, bool)
    for dy in (0, 1, 2):
        for dx in (0, 1, 2):
            if dy == 1 and dx == 1:
                continue
            same |= pad[dy:dy + h, dx:dx + w] == c
    return op & ~same, pad


# D8's two pixel loops, in numpy (PLUMBER 10/19: 10.8 of a big sheet's 13 s were these two loops in Python, and the
# cull reads 227 sprites; verified equal to the loops on 256 pictures, his pieces, rig renders and the big sheets)
def d8_orphans(P, Pa, ys, xs):
    """the AA test of d8's loop, all islands at once: an island is anti-aliasing when, across its left/right or its
    up/down neighbours (both opaque, spanning more than 30), its colour sits within 15 percent of their middle."""
    if not len(ys):
        return 0
    y = ys + 1; x = xs + 1
    c = P[y, x].astype(np.int64)
    aa = np.zeros(len(y), bool)
    for (dy1, dx1), (dy2, dx2) in (((0, -1), (0, 1)), ((-1, 0), (1, 0))):
        a1 = P[y + dy1, x + dx1].astype(np.int64); a2 = P[y + dy2, x + dx2].astype(np.int64)
        both = Pa[y + dy1, x + dx1] & Pa[y + dy2, x + dx2]
        mid = (a1 + a2) / 2.0
        span = np.abs(a1 - a2).sum(1)
        aa |= both & (span > 30) & (np.abs(c - mid).sum(1) <= 0.15 * 3 * 255)
    return int((~aa).sum())

def d8_banding(k, op):
    """d8's banding loop, a row at a time: a run of one colour, 3 or more wide, sitting exactly on a run of one
    other colour in the row below with the same start and end."""
    H, W = op.shape
    band = 0
    idx = np.arange(W)
    for y in range(H - 1):
        r0, r1, o0, o1 = k[y], k[y + 1], op[y], op[y + 1]
        prev_diff0 = np.ones(W, bool); prev_diff0[1:] = (r0[1:] != r0[:-1]) | ~o0[:-1]
        starts = np.nonzero(o0 & prev_diff0)[0]
        if not len(starts):
            continue
        next_diff0 = np.ones(W, bool); next_diff0[:-1] = ~o0[1:] | (r0[1:] != r0[:-1])
        ends_all = np.nonzero(o0 & next_diff0)[0]
        ends = ends_all[np.searchsorted(ends_all, starts)]
        L = ends - starts + 1
        m = L >= 3
        if not m.any():
            continue
        s, e, L = starts[m], ends[m], L[m]
        notop1 = np.concatenate([[0], np.cumsum(~o1)])
        allop = (notop1[e + 1] - notop1[s]) == 0
        brk1 = np.ones(W, bool); brk1[1:] = r1[1:] != r1[:-1]
        rid = np.cumsum(brk1)
        same = rid[s] == rid[e]
        diff = r1[s] != r0[s]
        left1 = (s == 0) | (r1[np.maximum(s - 1, 0)] != r1[s]) | ~o1[np.maximum(s - 1, 0)]
        right1 = (e + 1 >= W) | (r1[np.minimum(e + 1, W - 1)] != r1[s]) | ~o1[np.minimum(e + 1, W - 1)]
        left0 = (s == 0) | (r0[np.maximum(s - 1, 0)] != r0[s]) | ~o0[np.maximum(s - 1, 0)]
        right0 = (e + 1 >= W) | (r0[np.minimum(e + 1, W - 1)] != r0[s]) | ~o0[np.minimum(e + 1, W - 1)]
        ok = allop & same & diff & left1 & right1 & left0 & right0
        band += int((2 * L[ok]).sum())
    return band


def d8(rgb, a, T):
    op = a >= 128; n = int(op.sum())
    if n < 50:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    k = keys(rgb)
    iso, pad = components_of_size_one(k, op)
    # not anti-aliasing: an island whose colour lies between its left/right or up/down neighbours is AA
    ys, xs = np.nonzero(iso)
    P = np.zeros((op.shape[0] + 2, op.shape[1] + 2, 3), np.int16); P[1:-1, 1:-1] = rgb
    Pa = np.zeros((op.shape[0] + 2, op.shape[1] + 2), bool); Pa[1:-1, 1:-1] = op
    orphans = d8_orphans(P, Pa, ys, xs)
    orph_k = orphans * 1000.0 / n
    # outline mask: opaque with a transparent 4-neighbour
    pz = np.zeros((op.shape[0] + 2, op.shape[1] + 2), bool); pz[1:-1, 1:-1] = op
    edge = op & ~(pz[:-2, 1:-1] & pz[2:, 1:-1] & pz[1:-1, :-2] & pz[1:-1, 2:])
    ne = int(edge.sum())
    dbl = edge[:-1, :-1] & edge[1:, :-1] & edge[:-1, 1:] & edge[1:, 1:]
    # a 2x2 of outline at a convex corner is allowed: require all four to have opaque on both axes inside
    doubles = int(dbl.sum())
    # jaggies: per row, the left and right silhouette x; along a monotonic run of steps, a short step between
    # two longer ones (or a long between two shorter) is a jaggy
    jag = 0
    for side in (0, 1):
        xsr = []
        for y in range(op.shape[0]):
            r = np.nonzero(op[y])[0]
            xsr.append(None if not len(r) else (r[0] if side == 0 else r[-1]))
        steps = []
        for y in range(1, len(xsr)):
            if xsr[y] is None or xsr[y - 1] is None:
                steps.append(None); continue
            steps.append(xsr[y] - xsr[y - 1])
        # collapse vertical runs of 0-steps into step lengths along a diagonal
        run = []
        for s in steps + [None]:
            if s is None or (run and np.sign(s) != np.sign(run[-1]) and s != 0 and run[-1] != 0):
                for i in range(1, len(run) - 1):
                    a0, b0, c0 = abs(run[i - 1]), abs(run[i]), abs(run[i + 1])
                    if a0 and b0 and c0 and ((b0 < a0 and b0 < c0) or (b0 > a0 and b0 > c0)):
                        jag += 1
                run = []
            if s is not None and s != 0:
                run.append(s)
    jag100 = jag * 100.0 / max(ne, 1)
    # banding: two stacked runs of different colours, same start and end, width 3+
    band = d8_banding(k, op)
    band_share = band / max(n, 1)
    # pillow: luminance against distance from the edge (4-neighbour chamfer)
    dist = np.where(op, 10 ** 6, 0).astype(np.int64)
    for _ in range(2):
        for y in range(1, dist.shape[0]):
            dist[y] = np.minimum(dist[y], dist[y - 1] + 1)
        for y in range(dist.shape[0] - 2, -1, -1):
            dist[y] = np.minimum(dist[y], dist[y + 1] + 1)
        for x in range(1, dist.shape[1]):
            dist[:, x] = np.minimum(dist[:, x], dist[:, x - 1] + 1)
        for x in range(dist.shape[1] - 2, -1, -1):
            dist[:, x] = np.minimum(dist[:, x], dist[:, x + 1] + 1)
    L = lum(rgb)[op]; D = dist[op].astype(float)
    r = float(np.corrcoef(L, D)[0, 1]) if L.std() > 1e-6 and D.std() > 1e-6 else 0.0
    why = []
    if orph_k > T['d8_orphans_per_1000']:
        why.append('%.1f orphan pixels per 1,000' % orph_k)
    if doubles > T['d8_doubles']:
        why.append('%d doubled outline blocks' % doubles)
    if jag100 > T['d8_jaggies_per_100']:
        why.append('%.1f jaggies per 100 outline pixels' % jag100)
    if band_share > T['d8_banding']:
        why.append('banding on %.0f%%' % (band_share * 100))
    if r > T['d8_pillow_r']:
        why.append('pillow shaded (r %.2f)' % r)
    return res(not why, {'orphans_per_1000': round(orph_k, 2), 'doubles': doubles,
                         'jaggies_per_100': round(jag100, 2), 'banding': round(band_share, 3), 'pillow_r': round(r, 3)},
               '; '.join(why))


# ---- D9 repetition -------------------------------------------------------------------------------
def d9_sheet(rgb, a, T):
    b = T['d9_block']; h, w = a.shape
    k = keys(rgb)
    rows = []
    filled = []
    for y in range(0, h - b + 1, b):
        row = []
        for x in range(0, w - b + 1, b):
            blk = k[y:y + b, x:x + b]; o = a[y:y + b, x:x + b] >= 128
            if not o.all() or len(np.unique(blk)) < 2:
                row.append(None); continue
            hsh = hash(blk.tobytes())
            row.append(hsh); filled.append(hsh)
        rows.append(row)
    if len(filled) < 8:
        return res(None, {'blocks': len(filled)}, 'fewer than eight textured blocks', unmeasured=True)
    vals, cnt = np.unique(np.array(filled, dtype=object).astype(str), return_counts=True)
    top = float(cnt.max() / len(filled))
    longest = 0
    grid = rows
    cols = [list(c) for c in zip(*grid)] if grid else []
    for line in grid + cols:
        run = 1
        for i in range(1, len(line)):
            run = run + 1 if line[i] is not None and line[i] == line[i - 1] else 1
            longest = max(longest, run if line[i] is not None else 0)
    ok = top <= T['d9_top_share'] and longest <= T['d9_max_run']
    why = []
    if top > T['d9_top_share']:
        why.append('one block is %.0f%% of the textured area' % (top * 100))
    if longest > T['d9_max_run']:
        why.append('%d of the same block in a row' % longest)
    return res(ok, {'top_share': round(top, 3), 'longest_run': longest, 'blocks': len(filled)}, '; '.join(why))


def d9_mirror(rgb, a, T):
    op = a >= 128
    ys, xs = np.nonzero(op)
    if not len(xs) or xs.max() - xs.min() + 1 <= 24:
        return res(None, {}, 'narrower than 24 px: symmetry allowed', unmeasured=True)
    k = np.where(op, keys(rgb), -1)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    m = k[:, ::-1]
    both = (k >= 0) | (m >= 0)
    ident = float(((k == m) & both).sum() / both.sum())
    ok = ident < T['d9_mirror']
    return res(ok, {'mirror_identity': round(ident, 3)}, '' if ok else '%.0f%% its own mirror' % (ident * 100))


# ---- D10 UI defaults -----------------------------------------------------------------------------
UI_PATTERNS = [
    ('gradient', re.compile(r'(?:linear|radial|conic)-gradient\s*\(|createLinearGradient|createRadialGradient')),
    ('blur', re.compile(r'(?:backdrop-filter|filter)\s*:\s*[^;"]*blur\(|ctx\.filter\s*=\s*[\'"][^\'"]*blur')),
    ('glow', re.compile(r'(?:box|text)-shadow\s*:\s*[^;"]*?(?:-?\d+(?:\.\d+)?(?:px)?\s+){2}[1-9]\d*px|shadowBlur\s*=\s*[1-9]')),
    ('radius', re.compile(r'border-radius\s*:\s*(?:[3-9]|[1-9]\d+)(?:\.\d+)?px|border-radius\s*:\s*\d+%|borderRadius\s*=\s*[\'"]?(?:[3-9]|[1-9]\d+)')),
    ('system font', re.compile(r'font-family\s*:\s*[\'"]?(?:Inter|Arial|Helvetica|Roboto|system-ui|-apple-system|sans-serif|serif|monospace)\b|font\s*=\s*[\'"][^\'"]*\b(?:Arial|Helvetica|sans-serif|system-ui)\b')),
]
HSL = re.compile(r'hsla?\(\s*(\d+(?:\.\d+)?)')


def d10(paths):
    found = {}
    for p in paths:
        try:
            t = open(p, encoding='utf8', errors='replace').read()
        except OSError:
            continue
        rel = os.path.relpath(p, ROOT)
        c = {}
        for name, rx in UI_PATTERNS:
            n = len(rx.findall(t))
            if n:
                c[name] = n
        hue = sum(1 for h in HSL.findall(t) if 250 <= float(h) <= 290)
        if hue:
            c['hue 250-290'] = hue
        if c:
            found[rel] = c
    return found


# ---- one sprite, all the per-sprite checks ---------------------------------------------------------
def sprite_report(src, cls='character', light='upper-left', palette=None, T=None):
    T = T or thresholds()
    rgb, a = load(src)
    rep = {'D1': d1(rgb, a, T), 'D2': d2(rgb, a, T, cls, palette), 'D3': d3(rgb, a, T, light),
           'D4': d4(rgb, a, T), 'D5': d5(rgb, a, T), 'D6': d6_one(a, T, cls), 'D7': d7(rgb, a, T),
           'D8': d8(rgb, a, T), 'D9': d9_mirror(rgb, a, T)}
    rep['size'] = list(a.shape[::-1])
    return rep


def first_five(rep):
    """the cull rule (114b): any of D1-D5 a plain FAIL. UNMEASURED is not a fail and not a pass."""
    return [d for d in ('D1', 'D2', 'D3', 'D4', 'D5') if rep[d]['ok'] is False]


# ---- ROUND TWO: THE RENDERED-SPRITE SET (records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_TWO_THE_RIG_10_18_26.md
# Section D, the render-specific checks that read the PNGs alone; D1 there reads the .blend and is DIRECTION's rig file)
def r2_alpha(rgb, a, T):
    """R1: binary alpha, and no colour that lives only on the boundary (the filter's residue)."""
    op = a > 0
    if not op.any():
        return res(None, {}, 'empty', unmeasured=True)
    soft = int(((a > 0) & (a < 255)).sum())
    pz = np.zeros((a.shape[0] + 2, a.shape[1] + 2), bool); pz[1:-1, 1:-1] = a >= 128
    inner = (a >= 128) & pz[:-2, 1:-1] & pz[2:, 1:-1] & pz[1:-1, :-2] & pz[1:-1, 2:]
    edge = (a >= 128) & ~inner
    k = keys(rgb)
    # a colour only on the boundary is residue when it is rare (a filter leaves a few pixels of each);
    # an outline colour that runs the whole ring is a decision, not residue
    ev, ec = np.unique(k[edge], return_counts=True)
    inner_set = set(np.unique(k[inner]).tolist())
    only_edge = int(sum(1 for v, c in zip(ev.tolist(), ec.tolist()) if v not in inner_set and c <= T['r2_residue_px']))
    ok = soft == 0 and only_edge <= T['r2_edge_only']
    why = []
    if soft:
        why.append('%d half-transparent pixels' % soft)
    if only_edge > T['r2_edge_only']:
        why.append('%d colours only on the boundary' % only_edge)
    return res(ok, {'soft_alpha_px': soft, 'edge_only_colours': only_edge}, '; '.join(why))


def r8_facings(paths, T, light='upper-left'):
    """R7, R8, R10 over one subject's eight facings: one light in every facing, the bounding-box height
    within 1 px, the foot row within 1 px, the silhouette area within 25% of the mean, the front not its
    own mirror."""
    boxes, areas, lights, front = [], [], [], None
    for p in paths:
        rgb, a = load(p)
        op = a >= 128
        ys, xs = np.nonzero(op)
        if not len(ys):
            return res(False, {}, '%s is empty' % os.path.basename(p))
        boxes.append((ys.min(), ys.max())); areas.append(op.sum())
        v = d3(rgb, a, T, light); lights.append(v['value'].get('angle_off', 180) if v['ok'] is not None else 180)
        if p.endswith('_S.png'):
            front = d9_mirror(rgb, a, T)
    hs = [b[1] - b[0] + 1 for b in boxes]; feet = [b[1] for b in boxes]
    am = float(np.mean(areas))
    why = []
    if max(hs) - min(hs) > 2 * T['r8_px']:
        why.append('heights %d to %d px' % (min(hs), max(hs)))
    if max(feet) - min(feet) > 2 * T['r8_px']:
        why.append('the foot row moves %d px between facings' % (max(feet) - min(feet)))
    if max(abs(x - am) / am for x in areas) > T['r8_area']:
        why.append('silhouette area %d to %d' % (min(areas), max(areas)))
    lit = sum(1 for x in lights if x <= T['d3_within'])
    if lit < len(paths):
        why.append('the light agrees in %d of %d facings' % (lit, len(paths)))
    if front is not None and front['ok'] is False:
        why.append('the front is %s' % front['why'])
    return res(not why, {'facings': len(paths), 'height': [int(min(hs)), int(max(hs))],
                         'foot': [int(min(feet)), int(max(feet))], 'lit_facings': lit,
                         'area_spread': round(max(abs(x - am) / am for x in areas), 3)}, '; '.join(why))


# ---- THE STYLE GUIDE (DIRECTION, rule 114a): records/target/BOHEMIA_STYLE_GUIDE.json ---------------------------
# Where the guide sets a number for a rendered class (person, beast, vehicle, prop), its number holds; it was
# written against the maquettes (the robot and the truck, his YES; tie-breaker 1: a number that fails them is the
# wrong number). It decided AGAINST the research on two of the five: no output colour cap (a FLOOR instead, and
# a top-eight share), no stepped ramp (the hue shift is at the SOURCE, the palette, and in the warm sun).
GUIDE = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_STYLE_GUIDE.json')
W3 = np.array([0.299, 0.587, 0.114])      # DIRECTION's value weights (the card of numbers)


def guide():
    try:
        return json.load(open(GUIDE))
    except (OSError, ValueError):
        return None


def gfield(g, key):
    for f in g.get('fields', []):
        if f.get('key') == key:
            return f.get('value') or {}
    return {}


def guide_light_image_deg(g):
    """the guide's screen light (screen y up, degrees) as an angle in image coordinates (y down)."""
    deg = g['rig']['calibration']['screen_light_deg']
    return math.degrees(math.atan2(-math.sin(math.radians(deg)), math.cos(math.radians(deg))))


def g2(rgb, a, g, cls):
    """G2 for a rendered class: at or over the class's colour floor (a sprite under one 96 px tile's area by
    the props' density instead), and the top eight colours at or under the guide's share."""
    op = a > 127
    n = int(op.sum())
    if n < 50:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    vals, cnt = np.unique(keys(rgb)[op], return_counts=True)
    top8 = 100.0 * np.sort(cnt)[::-1][:8].sum() / n
    cb = gfield(g, 'colour_budget')
    floor = (cb.get('output_floor_rendered') or {}).get(cls) or g['classes'][cls]['output_floor']
    small = n < 96 * 96
    dens = (cb.get('colour_floor_small') or {}).get('density_per_1000px', 370)
    need = min(floor, int(math.ceil(dens * n / 1000.0))) if small else floor
    tmax = cb.get('top8_share_max_pct', 11.1)
    why = []
    if len(vals) < need:
        why.append('%d colours under the %s floor of %d (a clean surface)' % (len(vals), cls, need))
    if top8 > tmax:
        why.append('the top eight colours carry %.1f%% (the guide: %.1f%%)' % (top8, tmax))
    return res(not why, {'colours': int(len(vals)), 'floor': need, 'top8_pct': round(top8, 1)}, '; '.join(why))


def g3(rgb, a, g):
    """G3 for a rendered sprite, by the guide's own card row (fields.light.card_row): the opaque top half at
    least as bright as the bottom, within -2.5 values. The centroid angle (D3) is printed beside it: on a
    model of many materials the bright-minus-dark centroid reads the paint as much as the sun, and it fails
    both maquettes on some facings, which the guide's tie-breaker says makes it the wrong number to hold."""
    op = a > 127
    if op.sum() < 50:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    L = rgb.astype(float) @ W3
    ys, xs = np.nonzero(op); cy = ys.mean()
    rows = np.arange(op.shape[0])[:, None]
    tb = float(L[op & (rows < cy)].mean() - L[op & (rows >= cy)].mean())
    lim = -2.5
    m = re.search(r'>=\s*(-?[\d.]+)', str(gfield(g, 'light').get('card_row', '')))
    if m:
        lim = float(m.group(1))
    v = light_vector(rgb, a)
    ang = None
    if v is not None:
        ang = round(abs((math.degrees(math.atan2(v[1], v[0])) - guide_light_image_deg(g) + 180) % 360 - 180), 1)
    ok = tb >= lim
    return res(ok, {'top_minus_bottom': round(tb, 1), 'floor': lim, 'centroid_angle_off': ang},
               '' if ok else 'lit from below: the top half is %.1f values under the bottom' % -tb)


def g4_palette(g):
    """G4: every ramp of the source palette walks at least the guide's hue shift end to end."""
    pf = os.path.join(ROOT, gfield(g, 'palette').get('file', 'records/target/BOHEMIA_STYLE_PALETTE.json'))
    try:
        pal = json.load(open(pf))
    except (OSError, ValueError):
        return res(False, {}, 'the guide names a palette file that does not load')
    need = gfield(g, 'palette').get('hue_shift_deg_min', 8)
    short = []
    for role, r in pal.get('roles', {}).items():
        ramp = [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) for h in r.get('ramp', [])]
        if len(ramp) < 3:
            continue
        H, S, V = hsv(np.array([ramp[0], ramp[-1]], np.int16)[None])
        if S[0].min() < 0.08:
            continue   # a grey ramp has no hue to walk
        dh = abs((H[0][1] - H[0][0] + 180) % 360 - 180)
        if dh < need:
            short.append('%s %.0f' % (role, dh))
    return res(not short, {'roles': len(pal.get('roles', {})), 'short': short},
               '' if not short else 'ramps under %d degrees: %s' % (need, ', '.join(short)))


def g7(rgb, a, g):
    op = a > 127
    if op.sum() < 50:
        return res(None, {}, 'too few opaque pixels', unmeasured=True)
    sh = gfield(g, 'shading')
    L = rgb.astype(float) @ W3
    pz = np.pad(op, 1)
    inner = op & pz[:-2, 1:-1] & pz[2:, 1:-1] & pz[1:-1, :-2] & pz[1:-1, 2:]
    span = float(np.percentile(L[op], 95) - np.percentile(L[op], 5))
    dark = float(L[inner].min()) if inner.any() else 255.0
    why = []
    if span < sh.get('value_span_min', 118):
        why.append('value span %d under %d' % (span, sh.get('value_span_min', 118)))
    if dark < 12:
        why.append('a body pixel at value %d (black)' % dark)
    return res(not why, {'span': round(span, 1), 'darkest_inside': round(dark, 1)}, '; '.join(why))


# ---- THE PACK BAND: the packs are the ruler (rule 82, 82a) ----------------------------------------
# Each check reduces to numbers where HIGHER IS WORSE. A family's band is the 90th percentile of its pack
# pieces on each number: a candidate worse than nine in ten of the pieces he bought fails that check.
BANDS = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_NOT_VIBE_CODED_BANDS.json')
BANK = os.path.join(ROOT, 'reference', 'art_bank')
TILE_FAMILIES = ('ground', 'map_tile', 'fight_board', 'marking', 'road')


def numbers(rep):
    """per check, the numbers the band reads (higher is worse); None where the check did not measure."""
    v = lambda d, k: rep[d]['value'].get(k) if rep[d]['ok'] is not None else None
    neg = lambda x: None if x is None else -x
    d3 = None
    if rep['D3']['ok'] is not None:
        d3 = rep['D3']['value']['angle_off'] if rep['D3']['value']['length'] >= 0.05 else 180.0
    d4 = None
    if rep['D4']['ok'] is not None:
        d4 = rep['D4']['value']['straight'] / float(rep['D4']['value']['ramps'])
    d7 = None if rep['D7']['ok'] is None else -min(rep['D7']['value']['bins'])
    return {
        'D1': {'mixed': None if v('D1', 'agree') is None else 1 - v('D1', 'agree')},
        'D2': {'colours': v('D2', 'colours')},
        'D3': {'angle_off': d3},
        'D4': {'straight_share': d4},
        'D5': {'evenness': neg(v('D5', 'gini')), 'no_rest': v('D5', 'quiet_over_busy')},
        'D7': {'flat': d7},
        'D8': {k: v('D8', k) for k in ('orphans_per_1000', 'jaggies_per_100', 'banding', 'pillow_r')},
    }


def pack_pieces(fam):
    """his pieces only (pack_*.png): the bank's folders also hold lanes' own cooked pictures (34 COOK4_* in
    settlement/ on 10/19), and a band that counts them judges a cook by its own work."""
    import glob
    return sorted(glob.glob(os.path.join(BANK, fam, 'pack_*.png')))


def _band_one(arg):
    f, cls = arg
    return numbers(sprite_report(f, cls, 'upper-left', None, thresholds()))


RULER_FUNCS = ('d8_orphans', 'd8_banding', 'load', 'lum', 'hsv', 'keys', 'res', 'native_scale', 'd1', 'd2', 'light_vector', 'd3', 'ramps',
               'quantised', 'd4', 'edge_map', 'gini', 'd5', 'mask_n', 'd6_one', 'd7', 'components_of_size_one', 'd8',
               'd9_mirror', 'sprite_report', 'numbers', 'thresholds', '_band_one', 'pack_pieces')


def ruler_fingerprint():
    """the hash of every function a band number comes from, docstrings and comments left out: a band built with
    an older ruler is stale even when the piece count has not moved (10/18: D7 changed to its 1st-99th percentile
    at 17:21 and the bands kept the old D7 until 10/19, because the freshness check counted pieces only)."""
    import ast
    import hashlib
    tree = ast.parse(open(os.path.abspath(__file__)).read())
    parts = []
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name in RULER_FUNCS:
            body = node.body[1:] if (node.body and isinstance(node.body[0], ast.Expr) and
                                     isinstance(getattr(node.body[0], 'value', None), ast.Constant) and
                                     isinstance(node.body[0].value.value, str)) else node.body
            parts.append(node.name + ':' + ''.join(ast.dump(b) for b in body))
    return hashlib.sha1('\n'.join(sorted(parts)).encode()).hexdigest()[:16]


def build_bands(families=None, T=None, log=print):
    T = T or thresholds()
    fams = families or sorted(d for d in os.listdir(BANK) if os.path.isdir(os.path.join(BANK, d)))
    out = {'_readme': 'the pack band per family (tools/bohemia_not_vibe_coded.py --bands): the 90th percentile '
                      'of every pack piece on each number, higher is worse. Rebuilt when the packs change.',
           'percentile': 90, 'families': {}}
    allv = {}
    for fam in fams:
        fs = pack_pieces(fam)
        if not fs:
            continue
        vals = {}
        cls = 'tile' if fam in TILE_FAMILIES else 'prop'
        from multiprocessing import Pool
        with Pool(max(1, (os.cpu_count() or 2))) as pool:
            reps = pool.map(_band_one, [(f, cls) for f in fs], chunksize=8)
        for nb in reps:
            for d, kv in nb.items():
                for k, x in kv.items():
                    if x is not None:
                        vals.setdefault(d, {}).setdefault(k, []).append(float(x))
                        allv.setdefault(d, {}).setdefault(k, []).append(float(x))
        out['families'][fam] = {'pieces': len(fs), 'band': {d: {k: round(float(np.percentile(x, 90)), 4)
                                                                 for k, x in kv.items()} for d, kv in vals.items()}}
        log('  band %-12s %d pieces' % (fam, len(fs)))
    out['families']['all'] = {'pieces': sum(f['pieces'] for f in out['families'].values()),
                              'band': {d: {k: round(float(np.percentile(x, 90)), 4) for k, x in kv.items()}
                                       for d, kv in allv.items()}}
    out['pack_files'] = sum(len(pack_pieces(f)) for f in fams)
    out['ruler'] = ruler_fingerprint()
    return out


_CELL = {}


def pack_cell(fam):
    """the family's own tile size: the median longer side of its pack pieces (ground 96, road 96). A kit
    piece of sixteen pack tiles is judged a pack tile at a time (10/18, COOK TWO [the ground ruler]: 18 of 21
    kit pieces failed D2 whole against the band of ONE pack tile, 0 of 63 cut to his tile's size)."""
    if fam in _CELL:
        return _CELL[fam]
    sides = []
    for f in pack_pieces(fam):
        try:
            sides.append(max(Image.open(f).size))
        except OSError:
            pass
    _CELL[fam] = int(np.median(sides)) if sides else 96
    return _CELL[fam]


def tile_cells(src, cell):
    """a tile sheet cut into cell x cell pieces; a ragged edge under half a cell joins nothing and is
    dropped, a sheet no bigger than one cell is itself the one cell."""
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    if w <= cell * 1.5 and h <= cell * 1.5:
        return [im]
    out = []
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            if min(cell, w - x) * 2 < cell or min(cell, h - y) * 2 < cell:
                continue
            c = im.crop((x, y, min(x + cell, w), min(y + cell, h)))
            if (np.asarray(c)[..., 3] >= 128).mean() >= 0.5:
                out.append(c)
    return out or [im]


def band_verdict(rep, family, bands):
    fam = bands['families'].get(family) or bands['families']['all']
    nb = numbers(rep)
    out = {}
    for d, kv in nb.items():
        bad = []
        measured = False
        for k, x in kv.items():
            lim = fam['band'].get(d, {}).get(k)
            if x is None or lim is None:
                continue
            measured = True
            if x > lim + 1e-9:
                bad.append('%s %.3g past the packs\' %.3g' % (k, abs(x) if k in ('evenness', 'flat') else x,
                                                               abs(lim) if k in ('evenness', 'flat') else lim))
        out[d] = {'ok': (not bad) if measured else None, 'why': '; '.join(bad)}
    return out


def main(argv):
    T = thresholds()
    cls = 'character'; light = 'upper-left'
    if '--class' in argv:
        cls = argv[argv.index('--class') + 1]
    if '--light' in argv:
        light = argv[argv.index('--light') + 1]
    if '--ui' in argv:
        print(json.dumps(d10([p for p in argv[argv.index('--ui') + 1:] if not p.startswith('--')]), indent=1))
        return 0
    if '--bands' in argv:
        b = build_bands(T=T)
        with open(BANDS, 'w') as f:
            json.dump(b, f, indent=1)
        print('wrote', os.path.relpath(BANDS, ROOT), b['pack_files'], 'pieces')
        return 0
    if '--sheet' in argv:
        p = argv[argv.index('--sheet') + 1]
        rgb, a = load(p)
        print(json.dumps(d9_sheet(rgb, a, T), indent=1))
        return 0
    pngs = [p for i, p in enumerate(argv) if p.endswith('.png') and (i == 0 or argv[i - 1] not in ('--class', '--light'))]
    for p in pngs:
        r = sprite_report(p, cls, light, None, T)
        bad = first_five(r)
        print('%s  %s' % ('CULL ' + ','.join(bad) if bad else 'pass ', os.path.relpath(p, ROOT)))
        for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'):
            x = r[d]
            print('    %-3s %-10s %s %s' % (d, {True: 'ok', False: 'FAIL', None: 'unmeasured'}[x['ok']],
                                           json.dumps(x['value']), x['why']))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
