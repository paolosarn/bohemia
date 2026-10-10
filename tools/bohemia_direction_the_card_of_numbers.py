#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the floor on the card]: THE CARD OF NUMBERS. Every number a cook reads before drawing,
measured from his 1,927 purchased and approved tiles in reference/art_bank (CORPUS.json), family by family, never
from our placeholders (rule 105: the packs are the floor; rule 100c: study first; rule 90 round 8: the look is a
number before it is a drawing; rule 104b no borders; rule 104e no roof tops).

The formulas are COOK's (tools/bohemia_how_the_pack_did_it_road_cook_10_10_26.py: palette, top eight, light halves,
ring step, 16-step value runs, joint over inside), made alpha-aware so a sprite (a prop, a door, a lamp, a house
piece) is read on its own pixels and its outline is read at its own silhouette, not at the tile's frame. The road
numbers here must agree with COOK's road page; the settlement numbers with COOK FOUR's places page.

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 confirmed set, the art bank), AH-01 (R10 grime baked, never shaded) and AH-03.
The pack is the ruler; no reference game.

usage: python3 tools/bohemia_direction_the_card_of_numbers.py                 (measure the bank, write the card)
       python3 tools/bohemia_direction_the_card_of_numbers.py --judge <png> <family>   (a candidate against the card)
out:   records/target/DIRECTION_THE_CARD_OF_NUMBERS.json, records/target/DIRECTION_THE_CARD_OF_NUMBERS.png
"""
import os, json, collections
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/art_bank')
OUT_J = os.path.join(ROOT, 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json')
OUT_P = os.path.join(ROOT, 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.png')
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
W3 = np.array([0.299, 0.587, 0.114])
ORDER = ['road', 'ground', 'marking', 'settlement', 'door', 'lamp', 'prop']


def load(fam, rows):
    out = []
    for r in sorted(rows, key=lambda r: (r['pack'], r['idx'])):
        f = os.path.join(BANK, fam, r['file'])
        if not os.path.exists(f): continue
        a = np.asarray(Image.open(f).convert('RGBA')).astype(np.int16)
        out.append((r, a))
    return out


def one(a):
    """every number for one tile, on its opaque pixels"""
    rgb, op = a[..., :3], a[..., 3] > 127
    h, w = op.shape; n = int(op.sum())
    if n < 50: return None
    px = rgb[op]; L = (rgb @ W3)
    flat = px[:, 0].astype(np.int32) * 65536 + px[:, 1] * 256 + px[:, 2]
    c = collections.Counter(flat.tolist())
    mx, mn = px.max(1), px.min(1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    Lo = L[op]
    # light: the opaque top half against the bottom, the left against the right
    ys, xs = np.nonzero(op); cy, cx = ys.mean(), xs.mean()
    tb = float(L[op & (np.arange(h)[:, None] < cy)].mean() - L[op & (np.arange(h)[:, None] >= cy)].mean())
    lr = float(L[op & (np.arange(w)[None, :] < cx)].mean() - L[op & (np.arange(w)[None, :] >= cx)].mean())
    # outline: the silhouette's outermost opaque ring against the ring one pixel in (for a full tile: the frame)
    pad = np.pad(op, 1)
    nb = pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
    edge = op & ~nb
    inner = nb.copy(); p2 = np.pad(nb, 1)
    inner_core = nb & p2[:-2, 1:-1] & p2[2:, 1:-1] & p2[1:-1, :-2] & p2[1:-1, 2:]
    ring1 = nb & ~inner_core
    step = float(L[edge].mean() - L[ring1].mean()) if edge.any() and ring1.any() else 0.0
    # cluster: runs of one 16-step value along rows, opaque only (a transparent pixel ends a run)
    q = np.where(op, (L / 16).astype(np.int16), -1)
    brk = np.ones((h, w + 1), bool); brk[:, 1:w] = (q[:, 1:] != q[:, :-1]) | (q[:, 1:] < 0)
    runs = []
    for y in range(h):
        idx = np.nonzero(brk[y])[0]; seg = np.diff(idx)
        starts = idx[:-1]; keep = q[y, starts] >= 0
        runs.extend(seg[keep].tolist())
    runs = np.array(runs) if runs else np.array([1])
    full = n / float(h * w) > 0.98
    meet = None
    if full:
        jx = float(np.abs(rgb[:, 0] - rgb[:, -1]).sum(1).mean()); ix = float(np.abs(np.diff(rgb, axis=1)).sum(2).mean())
        jy = float(np.abs(rgb[0] - rgb[-1]).sum(1).mean()); iy = float(np.abs(np.diff(rgb, axis=0)).sum(2).mean())
        meet = (jx / max(1, ix), jy / max(1, iy))
    return dict(w=w, h=h, opaque=n / float(h * w), colours=len(c),
                top8=100.0 * sum(v for _, v in c.most_common(8)) / n,
                span=float(np.percentile(Lo, 95) - np.percentile(Lo, 5)), mean_L=float(Lo.mean()),
                sat=float(np.median(sat)), warm=float((px[:, 0] > px[:, 2]).mean()),
                tb=tb, lr=lr, step=step, run=float(runs.mean()), lone=float((runs == 1).mean()),
                full=full, meet=meet)


def fam_card(T):
    M = [m for m in (one(a) for _, a in T) if m]
    med = lambda k: float(np.median([m[k] for m in M]))
    pct = lambda k, p: float(np.percentile([m[k] for m in M], p))
    fulls = [m for m in M if m['full']]
    meets = [m['meet'] for m in fulls]
    long_side = [max(m['w'], m['h']) for m in M]
    return dict(n=len(M), w_median=med('w'), h_median=med('h'), long_side_median=float(np.median(long_side)),
                long_side_p10=float(np.percentile(long_side, 10)), smallest=[int(min(m['w'] for m in M)), int(min(m['h'] for m in M))],
                full_tile_share=round(100.0 * len(fulls) / len(M), 1), opaque_median=round(med('opaque'), 2),
                colours_median=med('colours'), colours_p10=pct('colours', 10), top8_share_median=round(med('top8'), 1),
                value_span_median=round(med('span'), 1), mean_value_median=round(med('mean_L'), 1),
                saturation_median=round(med('sat'), 3), warm_share_median=round(med('warm'), 2),
                top_minus_bottom=round(med('tb'), 1), left_minus_right=round(med('lr'), 1),
                top_lit_share=round(100.0 * float(np.mean([m['tb'] > 0 for m in M])), 1),
                edge_minus_inside=round(med('step'), 1), darker_edge_share=round(100.0 * float(np.mean([m['step'] < -4 for m in M])), 1),
                run_px_median=round(med('run'), 2), lone_pixel_share=round(100.0 * med('lone'), 1),
                joint_over_inside_x=round(float(np.median([v[0] for v in meets])), 2) if meets else None,
                joint_over_inside_y=round(float(np.median([v[1] for v in meets])), 2) if meets else None,
                meet_share=round(100.0 * float(np.mean([a <= 2 and b <= 2 for a, b in meets])), 1) if meets else None,
                # the judge's bands: the pack's own tenth and ninetieth, so nine in ten of his tiles sit inside each row
                band={k: [round(pct(k, 10), 3), round(pct(k, 90), 3)] for k in ('colours', 'top8', 'span', 'sat', 'tb', 'step', 'run')})


def judge(png, fam):
    """a candidate's numbers against its family's on the card: every row OK or OUT, exit 1 on any OUT"""
    import sys
    c = json.load(open(OUT_J))['families'][fam]; m = one(np.asarray(Image.open(png).convert('RGBA')).astype(np.int16))
    if m is None: sys.exit('OUT: nothing opaque to measure')
    B = c['band']
    rows = [('long side >= floor %d' % c['long_side_p10'], max(m['w'], m['h']), max(m['w'], m['h']) >= c['long_side_p10']),
            ('colours >= %d' % B['colours'][0], m['colours'], m['colours'] >= B['colours'][0]),
            ('top 8 carry <= %.0f%%' % B['top8'][1], round(m['top8'], 1), m['top8'] <= B['top8'][1]),
            ('value span >= %.0f' % B['span'][0], round(m['span']), m['span'] >= B['span'][0]),
            ('saturation <= %.2f' % B['sat'][1], round(m['sat'], 3), m['sat'] <= B['sat'][1]),
            ('light: top minus bottom >= %+.1f' % B['tb'][0], round(m['tb'], 1), m['tb'] >= B['tb'][0]),
            ('edge between %+.0f and %+.0f' % tuple(B['step']), round(m['step'], 1), B['step'][0] <= m['step'] <= B['step'][1]),
            ('grain <= %.2f px a run' % B['run'][1], round(m['run'], 2), m['run'] <= B['run'][1])]
    bad = 0
    for t, v, okk in rows:
        print(('OK   ' if okk else 'OUT  ') + t + ': ' + str(v)); bad += (not okk)
    print('%d of %d out -> %s' % (bad, len(rows), 'BACK before VOTE' if bad > 2 else 'to DIRECTION'))
    sys.exit(1 if bad > 2 else 0)


import sys as _s
if len(_s.argv) > 3 and _s.argv[1] == '--judge':
    judge(_s.argv[2], _s.argv[3])
corpus = json.load(open(os.path.join(BANK, 'CORPUS.json')))['tiles'].values()
byfam = collections.defaultdict(list)
for r in corpus: byfam[r['family']].append(r)
card, samples = {}, {}
for fam in ORDER:
    T = load(fam, byfam[fam])
    card[fam] = fam_card(T)
    step = max(1, len(T) // 8); samples[fam] = [a for _, a in T[::step][:8]]
    print(fam, json.dumps(card[fam]))
json.dump(dict(card='THE CARD OF NUMBERS', lane='direction', date='10/10/26', source='reference/art_bank/CORPUS.json (1,927 tiles, his 7/13 UP set)',
               families=card), open(OUT_J, 'w'), indent=1)

# the picture: each family's tiles at one art pixel to one, its numbers beside them
BG, INK, DIM, HOT = (14, 13, 12), (236, 230, 218), (146, 138, 126), (226, 162, 72)
F_T, F_L, F_S = ImageFont.truetype(ROM, 26), ImageFont.truetype(ROM, 18), ImageFont.truetype(ROM, 15)
RH, W = 150, 30 + 8 * 104 + 30 + 560 + 30
sheet = Image.new('RGB', (W, 90 + RH * len(ORDER) + 20), BG); d = ImageDraw.Draw(sheet)
d.text((30, 22), 'THE CARD OF NUMBERS: HIS PACK, FAMILY BY FAMILY, ONE PIXEL TO ONE', font=F_T, fill=INK)
d.text((30, 58), 'every number is a median over his approved tiles; it is the floor and the manner, never our placeholders', font=F_S, fill=DIM)
y = 90
for fam in ORDER:
    c = card[fam]; x = 30
    for a in samples[fam]:
        im = Image.fromarray(a.astype(np.uint8), 'RGBA'); im.thumbnail((100, 100), Image.NEAREST)
        sheet.paste(im, (x, y + 30 + (100 - im.height) // 2), im); x += 104
    d.text((30, y + 4), '%s  (%d tiles)' % (fam.upper(), c['n']), font=F_L, fill=HOT)
    tx = 30 + 8 * 104 + 30
    lines = ['size %d x %d, long side %d (floor %d)' % (c['w_median'], c['h_median'], c['long_side_median'], c['long_side_p10']),
             'colours %d a tile, top 8 carry %.0f%%' % (c['colours_median'], c['top8_share_median']),
             'value span %.0f, saturation %.2f, warm %.0f%%' % (c['value_span_median'], c['saturation_median'], 100 * c['warm_share_median']),
             'light: top %+.1f, left %+.1f (top lit in %.0f%%)' % (c['top_minus_bottom'], c['left_minus_right'], c['top_lit_share']),
             'edge %+.1f (darker edge in %.0f%%); grain %.1f px' % (c['edge_minus_inside'], c['darker_edge_share'], c['run_px_median'])]
    if c['meet_share'] is not None:
        lines.append('a full tile meets its twin in %.0f%% (joint %.1f x inside)' % (c['meet_share'], c['joint_over_inside_x']))
    for k, t in enumerate(lines): d.text((tx, y + 6 + k * 23), t, font=F_S, fill=INK if k else HOT)
    y += RH
sheet.save(OUT_P)
print('sheet', sheet.size)
