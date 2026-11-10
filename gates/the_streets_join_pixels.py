#!/usr/bin/env python3
"""THE STREETS JOIN, the pixel leg (called by gates/the_streets_join_gate.js; COMBAT TWO 11/10, VAMILY rule 442(d)).

Reads boards as the fight lays them (the ground picture of every tile of the board and its ring, the mouths drawn over the old
streets, which tiles are the join's street pieces) and looks at the pictures themselves along every tile edge a street piece or a
mouth touches: a strip a few pixels deep each side of the edge, every 8 px along it, asphalt or not (dark and grey: lum under 96,
saturation under .11, the same reading the pieces were cut by).
  A SEAM is: across an edge between two of the join's pieces, asphalt one side and not the other (a sidewalk cut off, a corner
  missing its sidewalk, a kerb that does not meet); across an edge between a join piece (or a mouth) and an old block's picture,
  the new street's asphalt against the old picture's sidewalk, kerb, gravel or yard (a road painted up to a kerb, never through).
  A walk of the new street ending against the old street's asphalt is its kerb, not a seam.
The edges between two old pictures are counted apart (they are the old layouts' own).

  python3 gates/the_streets_join_pixels.py boards.json      -> one JSON line: {edges, seams, old_seams, worst: [...]}
"""
import json, sys, os
from PIL import Image
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FG = os.path.join(ROOT, 'slices/fight_ground')
TW, TH = 515, 364
STEP, DEEP, IN = 8, 6, 2
CACHE = {}


def pic(src):
    if src not in CACHE:
        f = os.path.join(FG, src)
        CACHE[src] = np.asarray(Image.open(f).convert('RGB')) if os.path.exists(f) else None
    return CACHE[src]


def tile_px(g):
    """the 515 x 364 picture of a ground entry ('block_x.webp#cx,cy[h][v]' or a whole-tile piece)"""
    if '#' not in g:
        a = pic(g)
        if a is None:
            return None
        if a.shape[:2] != (TH, TW):
            a = np.asarray(Image.fromarray(a).resize((TW, TH)))
        return a
    src, rest = g.split('#')
    fl = ''.join(c for c in rest if c in 'hv')
    cx, cy = [int(v) for v in rest.rstrip('hv').split(',')]
    a = pic(src)
    if a is None:
        return None
    t = a[cy * TH:(cy + 1) * TH, cx * TW:(cx + 1) * TW]
    if 'h' in fl:
        t = t[:, ::-1]
    if 'v' in fl:
        t = t[::-1, :]
    return t


def taper(t, q):
    """the drawing of slices/BOHEMIA_FIGHT.html taperPaint at the picture's own size: the triangle between this piece's kerb line and
    the old street's at the edge, the kit's walk (the old one narrower) or its asphalt (wider), the kerb along it"""
    from PIL import ImageDraw
    img = Image.fromarray(t)
    side = q['side']

    def P(u, v):
        return {'N': (u * TW, v * TH), 'S': (u * TW, (1 - v) * TH), 'W': (v * TW, u * TH), 'E': ((1 - v) * TW, u * TH)}[side]
    for k, a, sg, D in ((q['lo'][0], q['lo'][1], 1, q.get('dlo') or q['depth']), (q['hi'][0], q['hi'][1], -1, q.get('dhi') or q['depth'])):
        if abs(a - k) < 0.005:
            continue
        inward = (a - k) * sg > 0
        tex = tile_px(q['walk'] if inward else q['asph'])
        if tex is None:
            continue
        m = Image.new('L', (TW, TH), 0)
        ImageDraw.Draw(m).polygon([P(k, 0), P(a, 0), P(k, D)], fill=255)
        img.paste(Image.fromarray(tex), (0, 0), m)
        ImageDraw.Draw(img).line([P(a, 0), P(k, D)], fill=(168, 160, 148), width=3)
    return np.asarray(img)


def with_decals(t, decs, srcs):
    t = t.copy()
    for q in decs:
        if q.get('kind') == 'taper':
            t = taper(t, q)
            continue
        im = tile_px(q['src'])
        if im is None:
            continue
        d = q['d']
        if q['side'] == 'N':      # mirrored across the shared edge, as the fight draws it
            h = max(1, round(TH * d)); t[:h] = im[TH - h:][::-1]
        elif q['side'] == 'S':
            h = max(1, round(TH * d)); t[TH - h:] = im[:h][::-1]
        elif q['side'] == 'W':
            w = max(1, round(TW * d)); t[:, :w] = im[:, TW - w:][:, ::-1]
        else:
            w = max(1, round(TW * d)); t[:, TW - w:] = im[:, :w][:, ::-1]
    return t


def asph(a):
    a = a.astype(float)
    lum = a @ np.array([0.299, 0.587, 0.114])
    mx, mn = a.max(axis=-1), a.min(axis=-1)
    sat = (mx - mn) / np.maximum(mx + mn, 1)
    return (lum < 96) & (sat < 0.11)


def strip(t, side):
    """asphalt or not, every STEP px along the side, read DEEP px deep, IN px in from the edge (a window STEP wide, majority)"""
    if side in ('N', 'S'):
        band = t[IN:IN + DEEP] if side == 'N' else t[TH - IN - DEEP:TH - IN]
        A = asph(band).mean(axis=0)
        return np.array([A[i:i + STEP].mean() >= 0.5 for i in range(0, TW - STEP + 1, STEP)])
    band = t[:, IN:IN + DEEP] if side == 'W' else t[:, TW - IN - DEEP:TW - IN]
    A = asph(band).mean(axis=1)
    return np.array([A[i:i + STEP].mean() >= 0.5 for i in range(0, TH - STEP + 1, STEP)])


def main():
    B = json.load(open(sys.argv[1]))
    out = {'boards': 0, 'edges': 0, 'seams': 0, 'old_edges': 0, 'old_seams': 0, 'worst': []}
    for b in B:
        out['boards'] += 1
        AW, AH, G = b['AW'], b['AH'], b['ground']
        kit = set(b['kit'])                       # area indices of the join's pieces
        dec = {}
        for q in b['decals']:
            dec.setdefault(q['ay'] * AW + q['ax'], []).append(q)
        touched = set(kit) | set(dec)
        px = {}

        def T(i):
            if i not in px:
                g = G[i]
                t = tile_px(g) if g else None
                if t is not None and i in dec:
                    t = with_decals(t, dec[i], b)
                px[i] = t
            return px[i]
        seen = set()
        for i in touched:
            ax, ay = i % AW, i // AW
            for s, dx, dy in (('N', 0, -1), ('S', 0, 1), ('W', -1, 0), ('E', 1, 0)):
                bx, by = ax + dx, ay + dy
                if bx < 0 or by < 0 or bx >= AW or by >= AH:
                    continue
                j = by * AW + bx
                key = (min(i, j), max(i, j))
                if key in seen:
                    continue
                seen.add(key)
                ta, tb = T(i), T(j)
                if ta is None or tb is None:
                    continue
                opp = {'N': 'S', 'S': 'N', 'W': 'E', 'E': 'W'}[s]
                sa, sb = strip(ta, s), strip(tb, opp)
                ka = i in kit or (i in dec and any(q['side'] == s and q.get('kind') != 'taper' for q in dec[i]))
                kb = j in kit or (j in dec and any(q['side'] == opp and q.get('kind') != 'taper' for q in dec[j]))
                if ka and kb:
                    bad = int((sa != sb).sum())
                elif ka:
                    bad = int((sa & ~sb).sum())
                elif kb:
                    bad = int((sb & ~sa).sum())
                else:
                    out['old_edges'] += 1
                    out['old_seams'] += int((sa != sb).sum() >= 3)
                    continue
                out['edges'] += 1
                if bad >= 3:
                    out['seams'] += 1
                    if os.environ.get('SEAMS_ALL'):
                        out.setdefault('all', []).append({'tag': b['tag'], 'x': ax - b['R'], 'y': ay - b['R'], 's': s, 'a': G[i], 'b': G[j], 'bad': bad, 'ka': ka, 'kb': kb, 'deci': i in dec, 'decj': j in dec})
                    if len(out['worst']) < 8:
                        out['worst'].append('%s @%d,%d %s %s|%s %d' % (b['tag'], ax - b['R'], ay - b['R'], s, G[i], G[j], bad))
    print(json.dumps(out))


if __name__ == '__main__':
    main()
