#!/usr/bin/env python3
"""THEY MEND ON THE MARCH, the pack and the strips (ANIMATION, ask line 314; tools/bohemia_animation_they_mend_on_the_march.py
is the door and says the whole of it). Plain python3 (numpy, PIL), no Blender.

    pack(only)   every rendered man's four acts -> slices/rig_march/<look>_<act>.webp, <look>_<act>_front.webp, rig_march.json
    strips()     records/target/animation/march_strips/<act>.png: one man's drawn keys of each act, his walk frame beside each

HOW A CELL LANDS ON HIS MAP: the map walks him on his own sheet (YOU: slices/BOHEMIA_RIG_YOU; his company: the rig_mix sheet that
holds his look), a cell of w x h with his feet at `foot`. A march pose on walk key k has his walk's legs, so the cell is laid on
his map walk frame at key k by THE LEGS: the offset where the render's legs (every pixel from the knees down) cover his map
walk frame's legs best, the one offset that fits his every facing and key (the camera and the box never change), its leftover
measured and written (`legs_off_px`: how many leg pixels still disagree, a man whose render does not match his map keeps
nothing). The colours are his map sheet's own (each pixel to the nearest), and what his hands hold keeps its own few colours.
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENDERS = os.path.join(ROOT, 'records/target/animation/towns')
OUT = os.path.join(ROOT, 'slices/rig_march')
STRIPS = os.path.join(ROOT, 'records/target/animation/march_strips')
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json')
SEEN = ['S', 'SE', 'E', 'SW', 'W']
ACTS = {'march_bind': 'bind', 'march_pills': 'pills', 'march_tape': 'tape', 'march_helmet': 'helmet'}
THR = 128


def clip(act): return 'Town' + act.capitalize()


def map_sheet(look):
    """his map walk sheet: (image RGBA array, meta, row of facing 'S')"""
    if look == 'you':
        m = json.load(open(os.path.join(ROOT, 'slices/BOHEMIA_RIG_YOU.json'))); im = os.path.join(ROOT, 'slices/BOHEMIA_RIG_YOU.png')
    else:
        idx = json.load(open(os.path.join(ROOT, 'slices/rig_mix/index.json')))
        name = next(n for n, v in idx['sheets'].items() if look in v)
        m = json.load(open(os.path.join(ROOT, 'slices/rig_mix', name + '.json'))); im = os.path.join(ROOT, 'slices/rig_mix', name + '.png')
    a = np.asarray(Image.open(im).convert('RGBA'))
    return a, m, m['gangs'].index(look)


def walk_frame(A, m, gi, f, k):
    di = m['dirs'].index(f); row = gi * len(m['dirs']) + di; w, h = m['w'], m['h']
    return A[row * h:(row + 1) * h, (k + 1) * w:(k + 2) * w]


def full(fn, r):
    """a rig_ file laid in the render's full frame (res x res)"""
    a = np.asarray(Image.open(fn).convert('RGBA'))
    R = r['res']
    if a.shape[0] == R and a.shape[1] == R: return a.copy()
    z = np.zeros((R, R, 4), np.uint8); x0, y0 = r['crop_box_px'][:2]
    z[y0:y0 + a.shape[0], x0:x0 + a.shape[1]] = a
    return z


def front_of(d, cl, f, j):
    """his arms alone at this key (MARCH_FRONT's shot, full frame); a key the master rig copied from the key before (a whole hold)
    has none of its own: the key before's"""
    for t in range(j, -1, -1):
        fn = os.path.join(RENDERS, d, 'front_%s_%s_k%02d.png' % (cl, f, t))
        if os.path.exists(fn): return np.asarray(Image.open(fn).convert('RGBA'))[..., 3] > THR
    return None


def magenta(a):
    """the held bowl, flat magenta in the render: where his worn helmet is drawn while it is off his head"""
    r, g, b = (a[..., i].astype(np.int32) for i in range(3))
    m = (a[..., 3] > THR) & (r > g + 22) & (b > g + 22)   # the magenta family, lit or in shade (his skin runs r > g > b, never b > g)
    return m | (grow(m) & (a[..., 3] > THR) & (r > g + 8) & (b > g + 8))   # and its soft edge


def to_pal(a, P):
    u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
    dd = ((u.astype(np.int32)[:, None, :] - P[None, :, :].astype(np.int32)) ** 2).sum(2)
    o = a.copy(); o[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); o[a[..., 3] == 0] = 0
    return o


def kmeans(px, n, it=12):
    px = px.astype(np.float64)
    if len(px) <= n: return px.astype(np.uint8)
    rng = np.random.default_rng(7); c = px[rng.choice(len(px), n, replace=False)]
    for _ in range(it):
        d = ((px[:, None, :] - c[None]) ** 2).sum(2); l = d.argmin(1)
        for j in range(n):
            if (l == j).any(): c[j] = px[l == j].mean(0)
    return np.round(c).astype(np.uint8)


def atlas(items, width=1024):
    """shelf packing, tallest first: items are arrays; returns (sheet size, rects)"""
    order = sorted(range(len(items)), key=lambda i: -items[i].shape[0]); x = y = sh = 0; rects = [None] * len(items)
    for i in order:
        h, w = items[i].shape[:2]
        if x + w > width: x = 0; y += sh; sh = 0
        rects[i] = (x, y, w, h); x += w + 1; sh = max(sh, h + 1)
    return (width, y + sh), rects


def grow(op):
    """one pixel out, the four neighbours"""
    p = np.pad(op, 1); return op | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]


def ring_of(Am, m, gi):
    """his map sheet's outline, if it has one (the fight's YOU carries a one-pixel dark ring all round, the rolled people do not):
    the one colour nearly every edge pixel of his walk frames is, when that colour is dark"""
    px = []
    for f in SEEN:
        for k in range(6):
            wf = walk_frame(Am, m, gi, f, k); op = wf[..., 3] > THR
            p = np.pad(op, 1); edge = op & ~(p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:])
            px.append(wf[edge][:, :3])
    px = np.concatenate(px); u, c = np.unique(px, axis=0, return_counts=True); top = u[c.argmax()]
    return top if c.max() >= 0.9 * len(px) and (top * [0.3, 0.59, 0.11]).sum() < 40 else None


def register(look, r, D, Am, m, gi, ring=None):
    """the one offset (dx, dy) that lays the render's legs on his map walk frames, over every seen facing and key of a pose"""
    w, h, foot = m['w'], m['h'], m['foot']
    act = 'march_pills'; c = r['clips'][clip(act)]; poses = list(D[act]['poses'])
    files = {os.path.basename(f): os.path.join(ROOT, f) for f in c['files']}
    pairs = []
    for f in SEEN:
        for k in range(6):
            j = poses.index('MP_lift') * 6 + k
            fn = files.get('rig_%s_%s_k%02d.png' % (clip(act), f, j))
            if not fn: continue
            mk = full(fn, r)[..., 3] > THR
            pairs.append((grow(mk) if ring is not None else mk, walk_frame(Am, m, gi, f, k)[..., 3] > THR))
    knee = foot - int(round(h * 0.28))   # from the knees down: nothing but the walk's own legs
    best = None
    R = r['res']; g = r.get('ground_px') or [R // 2, R // 2]
    gx, gy = g[0] + (r['crop_box_px'][0] if r.get('crop_box_px') else 0), g[1] + (r['crop_box_px'][1] if r.get('crop_box_px') else 0)
    for dy in range(foot - gy - 14, foot - gy + 15):
        for dx in range(w // 2 - gx - 14, w // 2 - gx + 15):
            bad = 0; tot = 0
            for ra, ma in pairs:
                sub = np.zeros((h, w), bool)
                ys0, xs0 = max(0, dy), max(0, dx); ys1, xs1 = min(h, R + dy), min(w, R + dx)
                sub[ys0:ys1, xs0:xs1] = ra[ys0 - dy:ys1 - dy, xs0 - dx:xs1 - dx]
                bad += int((sub[knee:] ^ ma[knee:]).sum()); tot += int(ma[knee:].sum())
            if best is None or bad < best[0]: best = (bad, dx, dy, tot)
    return best[1], best[2], best[0], best[3]


def pack(only=None):
    T = json.load(open(SRC)); D = T['activities']
    os.makedirs(OUT, exist_ok=True)
    ip = os.path.join(OUT, 'rig_march.json')
    index = json.load(open(ip)) if os.path.exists(ip) else {'looks': {}}
    index.update(version='rig-march-11-2', lane='animation', row='[they mend on the march]', ask='314',
                 source='records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json, rendered by '
                        'tools/bohemia_animation_they_mend_on_the_march.py, packed by tools/bohemia_animation_march_pack.py',
                 seen=SEEN, keys_per_beat=3, legs=6,
                 acts={ACTS[a]: {'timeline': D[a]['timeline'], 'bars': sum(x[1] for x in D[a]['timeline']) // 12, 'what': D[a]['what']} for a in ACTS},
                 cell='[sx, sy, sw, sh, cx, cy]: the cell on its sheet and where its top left sits in his map walk frame (w x h, '
                      'his feet at foot); helm [x, y]: the middle of the helmet in his fist, same frame; front: the same cells, '
                      'only his arms and what his hands hold (drawn again over his worn plate)')
    for d in sorted(os.listdir(RENDERS)) if os.path.isdir(RENDERS) else []:
        if not d.endswith('.march'): continue
        look = d[:-len('.march')]
        if only and look not in only.split(','): continue
        rj = os.path.join(RENDERS, d, 'rig.json')
        if not os.path.exists(rj): continue
        r = json.load(open(rj))
        Am, m, gi = map_sheet(look)
        ring = ring_of(Am, m, gi)
        dx, dy, bad, tot = register(look, r, D, Am, m, gi, ring)
        print('LEGS', look, 'offset', dx, dy, 'disagree', bad, 'of', tot, flush=True)
        if tot == 0 or bad > 0.08 * tot:
            print('  his render does not match his map walk: nothing kept for', look); continue
        rows = Am[gi * len(m['dirs']) * m['h']:(gi + 1) * len(m['dirs']) * m['h']]
        Pman = np.unique(rows[rows[..., 3] > THR][:, :3], axis=0)
        L = {'box': [m['w'], m['h'], m['foot']], 'legs_off_px': [bad, tot], 'offset': [dx, dy], 'acts': {},
             'ring': [int(x) for x in ring] if ring is not None else None}
        for act, short in ACTS.items():
            c = r['clips'].get(clip(act))
            if not c: continue
            files = {os.path.basename(f): os.path.join(ROOT, f) for f in c['files']}
            poses = list(D[act]['poses'])
            cells, items, fronts, keys = [], [], [], []
            for f in SEEN:
                for pi, pn in enumerate(poses):
                    for k in range(6):
                        j = pi * 6 + k
                        fn = files.get('rig_%s_%s_k%02d.png' % (clip(act), f, j))
                        front = front_of(d, clip(act), f, j)
                        if not fn or front is None: raise SystemExit('missing %s %s %s' % (look, f, j))
                        a = full(fn, r)
                        hm = magenta(a)
                        if hm.any():   # the bowl: its middle kept, its pixels repainted dull steel (seen only if his piece has no picture)
                            a[hm, :3] = (78, 80, 76)
                        front = front & ~hm
                        cells.append((f, pn, k, a, front, hm if hm.any() else None))
            # his colours, and what his hands hold keeps a few of its own: the front pixels far from every colour of his
            far = []
            for f, pn, k, a, front, hm in cells:
                px = a[front & (a[..., 3] > THR)][:, :3].astype(np.int32)
                if len(px): far.append(px[((px[:, None, :] - Pman[None].astype(np.int32)) ** 2).sum(2).min(1) > 900])
            pp = np.concatenate(far) if far else np.zeros((0, 3), np.uint8)
            P = np.concatenate([Pman, kmeans(pp[::max(1, len(pp) // 4000)], 10), np.array([[78, 80, 76]], np.uint8)]) if len(pp) else Pman
            out = {}
            PAD = 24   # a hand out past his walk frame's edge is kept: the map's box is 112 wide round a 70 or 98 cell
            for f, pn, k, a, front, hm in cells:
                R = r['res']; z = np.zeros((m['h'] + 2 * PAD, m['w'] + 2 * PAD, 4), np.uint8); zf = np.zeros_like(z)
                ddx, ddy = dx + PAD, dy + PAD
                ys0, xs0 = max(0, ddy), max(0, ddx); ys1, xs1 = min(z.shape[0], R + ddy), min(z.shape[1], R + ddx)
                op = a[..., 3] > THR
                aa = a.copy(); aa[..., 3] = np.where(op, 255, 0); aa[~op] = 0
                aa = to_pal(aa, P)
                z[ys0:ys1, xs0:xs1] = aa[ys0 - ddy:ys1 - ddy, xs0 - ddx:xs1 - ddx]
                if ring is not None:   # his map sheet's own outline, one pixel all round
                    o2 = z[..., 3] > 0; e2 = grow(o2) & ~o2; z[e2, :3] = ring; z[e2, 3] = 255
                fr = aa.copy(); fr[~(front & op)] = 0
                zf[ys0:ys1, xs0:xs1] = fr[ys0 - ddy:ys1 - ddy, xs0 - ddx:xs1 - ddx]
                ys, xs = np.nonzero(z[..., 3])
                if not len(xs): raise SystemExit('empty cell %s %s %s %d' % (look, f, pn, k))
                x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
                helm = None
                if hm is not None and hm.any():
                    hy, hx = np.nonzero(hm); helm = [int(round(hx.mean() + dx)), int(round(hy.mean() + dy))]
                items.append(z[y0:y1, x0:x1]); fronts.append(zf[y0:y1, x0:x1]); keys.append((f, pn, k, int(x0) - PAD, int(y0) - PAD, helm))
            (W, H), rects = atlas(items, 1024)
            sheet = np.zeros((H, W, 4), np.uint8); fsheet = np.zeros_like(sheet)
            C, HL = {}, {}
            for (f, pn, k, x0, y0, helm), it, fi, (x, y, w, h) in zip(keys, items, fronts, rects):
                sheet[y:y + h, x:x + w] = it; fsheet[y:y + h, x:x + w] = fi
                C.setdefault(f, {}).setdefault(pn, [None] * 6)[k] = [x, y, w, h, x0, y0]
                if helm: HL.setdefault(f, {}).setdefault(pn, [None] * 6)[k] = helm
            fn1, fn2 = '%s_%s.webp' % (look, short), '%s_%s_front.webp' % (look, short)
            Image.fromarray(sheet).save(os.path.join(OUT, fn1), lossless=True, method=6)
            Image.fromarray(fsheet).save(os.path.join(OUT, fn2), lossless=True, method=6)
            L['acts'][short] = {'file': fn1, 'front': fn2, 'size': [W, H], 'cells': C, 'helm': HL}
            print('PACKED', look, short, W, 'x', H, len(items), 'cells', flush=True)
        index['looks'][look] = L
    json.dump(index, open(ip, 'w'), separators=(',', ':'))
    print('INDEX', ip, sorted(index['looks']))


WHO = {'bind': 'person_town_0', 'pills': 'person_town_1', 'tape': 'person_town_1', 'helmet': 'you'}   # the vote page's casting


def strips(look=None):
    """every drawn key of each act (its whole timeline, a key a column) on the man the vote page casts in it, facing down-right,
    at the map's pixels x2: his own walk frame at the same key above, the act's cell below"""
    idx = json.load(open(os.path.join(OUT, 'rig_march.json')))
    os.makedirs(STRIPS, exist_ok=True)
    made = []
    for short, A in idx['acts'].items():
        lk = look or (WHO[short] if WHO[short] in idx['looks'] else 'you')
        if lk not in idx['looks'] or short not in idx['looks'][lk]['acts']: continue
        L = idx['looks'][lk]; Am, m, gi = map_sheet(lk)
        S = L['acts'][short]; sh = np.asarray(Image.open(os.path.join(OUT, S['file'])).convert('RGBA'))
        for f in ('SE',):
            keys = []; k = 0
            for pn, n in A['timeline']:
                for _ in range(n): keys.append((pn, k % 6)); k += 1
            P2 = 16; w0, h0 = m['w'], m['h']; w, h = w0 + 2 * P2, h0 + 2 * P2; sc = 2
            img = np.zeros((h * 2, w * len(keys), 4), np.uint8); img[..., :3] = (38, 33, 28); img[..., 3] = 255
            def lay(cell, X, Y):
                ch, cw = cell.shape[:2]; xa, ya = max(0, -X), max(0, -Y); xb, yb = min(cw, img.shape[1] - X), min(ch, img.shape[0] - Y)
                c = cell[ya:yb, xa:xb]; a2 = c[..., 3:] / 255.0; reg = img[Y + ya:Y + yb, X + xa:X + xb, :3]
                img[Y + ya:Y + yb, X + xa:X + xb, :3] = (reg * (1 - a2) + c[..., :3] * a2).astype(np.uint8)
            for i, (pn, leg) in enumerate(keys):
                lay(walk_frame(Am, m, gi, f, leg), i * w + P2, P2)
                x, y, cw, ch, cx, cy = S['cells'][f][pn][leg]
                lay(sh[y:y + ch, x:x + cw], i * w + P2 + cx, h + P2 + cy)
            im = Image.fromarray(img).resize((img.shape[1] * sc, img.shape[0] * sc), Image.NEAREST)
            fn = os.path.join(STRIPS, '%s_%s_%s.png' % (short, f, lk)); im.save(fn, optimize=True); made.append(fn)
    print('\n'.join(made))
