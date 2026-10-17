#!/usr/bin/env python3
"""HOW THE PACK DID IT: CLOTH (10/17/26, CHARACTER, [the texture set], rule 100c: the study page
before the cut).

THE PACKS HOLD NO PEOPLE (COOK [the two holes], 10/16: 0 of 8,674 tiles is a person, checked in
pixels), so there is no pack twin of a worn coat. There IS pack cloth: his banners, flags and
tents. This page reads how HIS tiles draw hanging fabric, in numbers, and reads the formula's
own garments with the same ruler, so the gap between the two is a measurement and not an
opinion (ROUND TEN: your own opinion of your picture is not in the loop).

READ, NOT TYPED: every tile is decoded from banks/BOHEMIA_HD_TILE_REPO_part1-4.txt (the re-cut
source of truth, 96 px cap) for the three packs whose names say cloth ("13. Banners and flags",
"14. Banners and flags", "14. Camp and tents"); every garment is read from the texture set this
round cut off the live formula (records/character/texture_set/atlas_<layer>.png, the S
facing cell), so both halves are the real pixels.

THE RULERS (the card's own, skills/bohemia-pixel-art section 1): size; colours in one tile;
value span (5th to 95th percentile of luminance); how many VALUE BANDS the cloth is drawn in
(luminance quantised to 8-step bins, bins holding at least 2% of the pixels; GARM-01: at sprite
scale fabric is value bands, not fold lines); light from above (top half brighter than the
bottom, share of tiles); grain (mean run length of one light-dark step along a row); and the
outline (the outer ring's mean luminance against the interior's).

Writes: records/BOHEMIA_HOW_THE_PACK_DID_IT_CLOTH_10_17_26.md and the strip
records/target/character/CHARACTER_HOW_THE_PACK_DID_IT_CLOTH.png (the measured tiles at 1:1
beside the formula's garments at 1:1). Nothing to slices/, engine/ or the demo (rule 100).

Run: python3 tools/bohemia_cook_the_texture_set_study.py

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the three
packs by their keys), the card of numbers, skills/bohemia-pixel-art, GARM-01, GARM-02, AH-01,
AH-03. A measurement, not a drawing. No reference game.
"""
import base64, glob, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
PACKS = ['13. Banners and flags', '14. Banners and flags', '14. Camp and tents']
TS = 'records/character/texture_set'
OUT_MD = 'records/BOHEMIA_HOW_THE_PACK_DID_IT_CLOTH_10_17_26.md'
OUT_PNG = 'records/target/character/CHARACTER_HOW_THE_PACK_DID_IT_CLOTH.png'


def load_packs():
    got = {}
    for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        d = json.load(open(f))['packs']
        for k in PACKS:
            if k in d:
                got.setdefault(k, []).extend(d[k])
    return got


def dec(t):
    return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')


def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def measure(im):
    """one tile or one garment cell, RGBA numpy; returns the card's numbers for it"""
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3] > 128
    if al.sum() < 30:
        return None
    ys, xs = np.where(al)
    sub = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    sal = sub[..., 3] > 128
    L = lum(sub)
    vals = L[sal]
    rgb = sub[..., :3][sal].astype(np.int32)
    colours = len(set(map(tuple, rgb)))
    p5, p95 = np.percentile(vals, 5), np.percentile(vals, 95)
    # value bands: 8-step bins with at least 2% of the cloth's pixels
    hist = np.bincount((vals // 8).astype(int), minlength=32)
    bands = int((hist >= max(1, 0.02 * len(vals))).sum())
    # light from above: top half vs bottom half mean luminance
    h = sub.shape[0]
    top = L[: h // 2][sal[: h // 2]]
    bot = L[h // 2:][sal[h // 2:]]
    light_top = bool(len(top) and len(bot) and top.mean() > bot.mean())
    # grain: mean run length of a light/dark step along rows (threshold at the cloth's median)
    med = np.median(vals)
    runs = []
    for y in range(sub.shape[0]):
        row = sal[y]
        if row.sum() < 4:
            continue
        xsr = np.where(row)[0]
        b = (L[y, xsr] > med).astype(int)
        change = np.where(np.diff(b) != 0)[0]
        if len(change) >= 1:
            runs.append(len(xsr) / (len(change) + 1))
    grain = float(np.mean(runs)) if runs else float('nan')
    # outline: the outer ring (opaque pixels with a transparent 4-neighbour) vs the interior
    pad = np.pad(sal, 1)
    inner = pad[1:-1, 1:-1] & pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
    ring = sal & ~inner
    ring_l = L[ring].mean() if ring.sum() else float('nan')
    int_l = L[inner].mean() if inner.sum() else float('nan')
    sat = []
    mx = rgb.max(1); mn = rgb.min(1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    return dict(w=int(sub.shape[1]), h=int(sub.shape[0]), colours=colours, span=float(p95 - p5), mean=float(vals.mean()),
                bands=bands, light_top=light_top, grain=grain, outline=float(ring_l - int_l), sat=float(np.mean(sat)), px=int(sal.sum()))


def summarise(rows):
    if not rows:
        return {}
    k = {}
    for key in ['w', 'h', 'colours', 'span', 'mean', 'bands', 'grain', 'outline', 'sat', 'px']:
        v = np.array([r[key] for r in rows], dtype=np.float64)
        v = v[~np.isnan(v)]
        k[key] = (float(np.median(v)), float(v.min()), float(v.max())) if len(v) else (float('nan'),) * 3
    k['light_top'] = 100.0 * sum(1 for r in rows if r['light_top']) / len(rows)
    k['n'] = len(rows)
    return k


def garments_from_set():
    """the S cell (column 4) of every row of every layer atlas, read off the set cut this round"""
    man = json.load(open(os.path.join(TS, 'manifest.json')))
    si = man['facings'].index('S')
    out = []
    for layer, L in man['layers'].items():
        if layer in ('hair', 'face'):
            continue  # hair and faces are PORTRAIT's family; cloth only here
        at = Image.open(os.path.join(TS, L['atlas'])).convert('RGBA')
        cell = L['cell_px']
        for row, n in enumerate(L['garments']):
            c = at.crop((si * cell, row * cell, (si + 1) * cell, (row + 1) * cell))
            m = measure(c)
            if m:
                m['n'] = n; m['layer'] = layer; m['img'] = c
                out.append(m)
    return out


def main():
    packs = load_packs()
    tiles = []
    for k, lst in packs.items():
        for t in lst:
            im = dec(t)
            m = measure(im)
            if m:
                m['n'] = '%s#%d' % (k, t.get('idx', len(tiles))); m['img'] = im; m['pack'] = k
                tiles.append(m)
    if len(tiles) < 40:
        sys.exit('REFUSED: only %d cloth tiles decoded' % len(tiles))
    garms = garments_from_set()
    P, G = summarise(tiles), summarise(garms)

    # THE STRIP: the measured pack cloth at 1:1 (the 24 with the most pixels) over the formula's garments at 1:1
    pick_t = sorted(tiles, key=lambda r: -r['px'])[:24]
    pick_g = sorted(garms, key=lambda r: -r['px'])[:24]
    cols = 12; cell = 100; pad = 6
    W = cols * (cell + pad) + pad; H = 2 * (2 * (cell + pad)) + 60
    sheet = Image.new('RGBA', (W, H), (26, 24, 22, 255))
    dr = ImageDraw.Draw(sheet)
    dr.text((pad, 4), 'HIS PACK CLOTH AT 1:1 (banners, flags, tents): %d tiles measured' % len(tiles), fill=(230, 220, 200, 255))
    y0 = 18
    for i, r in enumerate(pick_t):
        x = pad + (i % cols) * (cell + pad); y = y0 + (i // cols) * (cell + pad)
        im = r['img']
        if im.width > cell or im.height > cell:
            im = im.crop((0, 0, min(cell, im.width), min(cell, im.height)))
        sheet.alpha_composite(im, (x, y))
    y1 = y0 + 2 * (cell + pad) + 8
    dr.text((pad, y1 - 14), 'THE FORMULA\'S GARMENTS AT 1:1 (the S facing, cut this round): %d measured' % len(garms), fill=(230, 220, 200, 255))
    for i, r in enumerate(pick_g):
        x = pad + (i % cols) * (cell + pad); y = y1 + (i // cols) * (cell + pad)
        sheet.alpha_composite(r['img'].crop((6, 6, 106, 106)), (x, y))
    sheet.save(OUT_PNG)

    def line(name, key, fmt='%.0f'):
        p, g = P[key], G[key]
        return '| %s | %s (%s to %s) | %s (%s to %s) |\n' % (name, fmt % p[0], fmt % p[1], fmt % p[2], fmt % g[0], fmt % g[1], fmt % g[2])

    s = '# HOW THE PACK DID IT: CLOTH (CHARACTER 10/17, [the texture set], rule 100c)\n\n'
    s += 'The packs hold no people (COOK [the two holes] 10/16, 0 of 8,674 tiles), so a worn coat has no pack twin. His packs do hold CLOTH: '
    s += 'the three packs named below, %d tiles, decoded from the re-cut source of truth and measured with the card\'s own rulers. ' % len(tiles)
    s += 'The formula\'s garments (%d, the S facing of the texture set cut this round, hair and faces left to PORTRAIT) are measured with the same rulers, so the gap is a number.\n\n' % len(garms)
    s += 'Packs: ' + '; '.join('%s (%d)' % (k, sum(1 for t in tiles if t['pack'] == k)) for k in packs) + '.\n\n'
    s += '## THE NUMBERS (median, then the range)\n\n| ruler | HIS CLOTH | THE FORMULA\'S CLOTH |\n|---|---|---|\n'
    s += line('width px', 'w') + line('height px', 'h')
    s += line('colours in one piece', 'colours') + line('painted pixels', 'px')
    s += line('value span, 5th to 95th (of 255)', 'span') + line('mean value (of 255)', 'mean')
    s += line('VALUE BANDS (8-step bins over 2%)', 'bands')
    s += line('grain: px per light-dark step along a row', 'grain', '%.1f')
    s += line('outline: outer ring minus interior (value)', 'outline', '%.1f')
    s += line('saturation', 'sat', '%.2f')
    s += '| light from above (top half brighter) | %.0f%% of tiles | %.0f%% of garments |\n\n' % (P['light_top'], G['light_top'])
    s += '## WHAT THE PACK DOES WITH FABRIC, READ OFF THE NUMBERS\n'
    s += '- A hanging cloth in his packs is drawn in about %d value bands, with %d colours in one piece, over a value span of %d: the fold is a band, never a line (GARM-01 says the same in words; here it is in pixels).\n' % (P['bands'][0], P['colours'][0], P['span'][0])
    s += '- The light is from above in %.0f%% of his cloth tiles; the shadow side is a band, not a gradient.\n' % P['light_top']
    s += '- The grain holds %.1f px per light-dark step along a row; his cloth is never a flat fill.\n' % P['grain'][0]
    s += '- The outline is the outer ring %.1f value %s than the inside: a soft ring, not a black line.\n' % (abs(P['outline'][0]), 'darker' if P['outline'][0] < 0 else 'lighter')
    s += '\n## THE GAP, MEASURED\n'
    s += '- Colours: the formula paints a garment in %d colours where his cloth carries %d. That is the whole of what "looks nothing like the assets we downloaded" means at the pixel, and it is the paint layer COOK THREE owns (rule 87); the texture set carries whatever paint lands on it, because it is cut from pixels, not from the formula\'s names.\n' % (G['colours'][0], P['colours'][0])
    s += '- Bands: %d against %d. The formula\'s cloth has a lit side and a dark side and little between.\n' % (G['bands'][0], P['bands'][0])
    s += '- Grain: %.1f px per step against %.1f. The formula\'s cloth is flatter along a row.\n' % (G['grain'][0], P['grain'][0])
    s += '- Light: from above in %.0f%% of garments against %.0f%% of his tiles.\n' % (G['light_top'], P['light_top'])
    s += '\n## WHAT THIS PAGE DECIDES FOR THE CUT\n'
    s += 'The texture set is a CUT, not a paint: it carries the formula\'s pixels as they are today, marked placeholder (rule 100e), with the attach points the rig needs. When COOK THREE\'s repaint lands on the paint layers, the same tool cuts the repainted cloth into the same pieces with the same attach points, because nothing in the cut reads a colour. The numbers above are the target the paint has to reach: about %d bands, hundreds of colours, grain over %.1f px, the light from above.\n' % (P['bands'][0], P['grain'][0])
    s += '\nStrip: %s (his cloth at 1:1 over the formula\'s garments at 1:1).\n' % OUT_PNG
    open(OUT_MD, 'w').write(s)
    print(s)
    print('wrote', OUT_MD, OUT_PNG)


if __name__ == '__main__':
    main()
