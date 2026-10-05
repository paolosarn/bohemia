#!/usr/bin/env python3
"""BOHEMIA -- [night in the sun measured] ROUND TWO: the independent measurement.

Reads the real screenshot PNGs tools/bohemia_eyes_night_in_the_sun.js saved, plus the real
geometry (tile positions, lit state, unit footprints, word element boxes) it recorded from the
live page -- STATE, not a verdict. Everything from here is this lane's own code: the WCAG
relative-luminance formula and the 25% glare veil are COMBAT's own well-specified values (reused,
not reinvented, same as this lane reused DIRECTION's F1-F3 formulas), the measuring PATH (read a
saved PNG file in a second language) is independent of COMBAT's own in-page getImageData self-report.

usage: python3 tools/bohemia_eyes_night_in_the_sun_measure.py
"""
import json, sys, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTDIR = os.path.join(ROOT, 'records', 'eyes_night_in_sun')


def lin(v):
    v = v / 255.0
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


def luminance(rgb, glare=False):
    rgb = rgb.astype(float)
    if glare:
        rgb = rgb * 0.75 + 64.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def cr(a, b):
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def sample_box(arr, cx, cy, half, dpr):
    """median luminance in a small device-pixel box around a CSS-space point"""
    x0 = int((cx - half) * dpr); x1 = int((cx + half) * dpr)
    y0 = int((cy - half) * dpr); y1 = int((cy + half) * dpr)
    h, w = arr.shape[0], arr.shape[1]
    x0, x1 = max(0, x0), min(w, x1); y0, y1 = max(0, y0), min(h, y1)
    if x1 <= x0 or y1 <= y0:
        return None
    return arr[y0:y1, x0:x1]


def measure_fight(label):
    png = os.path.join(OUTDIR, label + '.png')
    geo = json.load(open(os.path.join(OUTDIR, label + '.json')))
    im = np.asarray(Image.open(png).convert('RGB'))
    dpr = geo['dpr']
    sx = lambda wx: geo['sx0'] + wx * geo['sxk']
    sy = lambda wy: geo['sy0'] + wy * geo['syk']

    def ground_luminance(glare):
        lit_v, dark_v = [], []
        for t in geo['tiles']:
            cx, cy = sx((t['x'] + .5) * geo['tw']), sy((t['y'] + .5) * geo['th'])
            box = sample_box(im, cx, cy, max(2, geo['tw'] * geo['zoom'] * 0.12), dpr)
            if box is None or box.size == 0:
                continue
            Y = luminance(box, glare)
            v = float(np.median(Y))
            (lit_v if t['lit'] else dark_v).append(v)
        return lit_v, dark_v

    def man_contrast(glare):
        out = []
        for m in geo['men']:
            gr_vals = []
            for gp in m['ground']:
                box = sample_box(im, gp['x'], gp['y'], 3, dpr)
                if box is not None and box.size:
                    gr_vals.append(float(np.median(luminance(box, glare))))
            if not gr_vals:
                continue
            gr = float(np.median(gr_vals))
            h = m['h']
            x0 = int((m['cx'] - h * .12) * dpr); x1 = int((m['cx'] + h * .12) * dpr)
            y0 = int((m['feet'] - h * .95) * dpr); y1 = int((m['feet'] - h * .10) * dpr)
            hgt, wid = im.shape[0], im.shape[1]
            x0, x1 = max(0, x0), min(wid, x1); y0, y1 = max(0, y0), min(hgt, y1)
            if x1 <= x0 or y1 <= y0:
                continue
            patch = im[y0:y1, x0:x1]
            Y = luminance(patch, glare)
            mask = np.abs(Y - gr) / (gr + .05) > .15 if gr > 0 else Y > 0
            if mask.sum() < 8:
                continue
            man_v = float(np.median(Y[mask]))
            out.append(cr(man_v, gr))
        return out

    lit_v, dark_v = ground_luminance(False)
    lit_vg, dark_vg = ground_luminance(True)
    men_v = man_contrast(False)
    men_vg = man_contrast(True)
    dark_med = float(np.median(dark_v)) if dark_v else None
    lit_med = float(np.median(lit_v)) if lit_v else None
    return {
        'label': label,
        'ground_dark_median': dark_med,
        'ground_lit_median': lit_med,
        'lit_vs_dark': cr(lit_med, dark_med) if dark_med and lit_med else None,
        'lit_vs_dark_glare': cr(float(np.median(lit_vg)), float(np.median(dark_vg))) if lit_vg and dark_vg else None,
        'n_dark_tiles': len(dark_v), 'n_lit_tiles': len(lit_v),
        'man_vs_ground_median': float(np.median(men_v)) if men_v else None,
        'man_vs_ground_glare_median': float(np.median(men_vg)) if men_vg else None,
        'n_men_sampled': len(men_v),
    }


def css_rgb(s):
    nums = s[s.index('(') + 1:s.index(')')].split(',')
    return np.array([float(nums[0]), float(nums[1]), float(nums[2])])


def measure_words(label):
    """THE FIRST VERSION OF THIS WAS WRONG, CAUGHT BEFORE IT SHIPPED: a blind above/below-median
    pixel split misreads a minority of dark ink on a majority-light card as the opposite of what
    it is (END TURN visually obvious, high contrast, read back as 1.3:1). Fixed: use the REAL
    browser-computed ink colour (getComputedStyle, not guessed) to find which pixels in the crop
    are actually glyph strokes, and read the background from the pixels that are NOT close to it."""
    png = os.path.join(OUTDIR, label + '.png')
    geo = json.load(open(os.path.join(OUTDIR, label + '.json')))
    im = np.asarray(Image.open(png).convert('RGB'))
    dpr = geo['dpr']
    rows = []
    for w in geo['words']:
        x0, y0 = int(w['x'] * dpr), int(w['y'] * dpr)
        x1, y1 = int((w['x'] + w['w']) * dpr), int((w['y'] + w['h']) * dpr)
        h, wi = im.shape[0], im.shape[1]
        x0, x1 = max(0, x0), min(wi, x1); y0, y1 = max(0, y0), min(h, y1)
        if x1 <= x0 or y1 <= y0 or not w.get('text', '').strip():
            continue
        patch = im[y0:y1, x0:x1].astype(float)
        ink_rgb = css_rgb(w['color'])
        dist = np.sqrt(((patch - ink_rgb) ** 2).sum(-1))
        ink_mask = dist < 40.0
        if ink_mask.sum() < 4:
            continue
        bg_mask = dist > 90.0
        if bg_mask.sum() < 4:
            continue
        Y = luminance(patch, False); Yg = luminance(patch, True)
        ink_v, bg_v = float(np.median(Y[ink_mask])), float(np.median(Y[bg_mask]))
        ink_vg, bg_vg = float(np.median(Yg[ink_mask])), float(np.median(Yg[bg_mask]))
        rows.append({'id': w.get('text', '')[:12], 'ink_px': int(ink_mask.sum()), 'bg_px': int(bg_mask.sum()),
                      'contrast': cr(ink_v, bg_v), 'contrast_glare': cr(ink_vg, bg_vg)})
    return rows


def measure_settlement():
    files = json.load(open(os.path.join(OUTDIR, 'settlement_files.json')))
    out = []
    for f in files:
        im = np.asarray(Image.open(f).convert('RGB')).astype(float)
        Y = luminance(im, False)
        Yg = luminance(im, True)
        out.append({'file': os.path.basename(f), 'median_luminance': float(np.median(Y)),
                     'median_luminance_glare': float(np.median(Yg))})
    return out


if __name__ == '__main__':
    result = {
        'fight_day': measure_fight('fight_day'),
        'fight_night': measure_fight('fight_night'),
        'words_day': measure_words('fight_day'),
        'words_night': measure_words('fight_night'),
        'settlement': measure_settlement(),
    }
    out_path = os.path.join(OUTDIR, 'BOHEMIA_EYES_NIGHT_IN_THE_SUN_RESULT.json')
    json.dump(result, open(out_path, 'w'), indent=2)
    print(json.dumps(result, indent=2))
