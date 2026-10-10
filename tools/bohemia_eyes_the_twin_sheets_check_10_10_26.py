#!/usr/bin/env python3
"""EYES CHECKS THE TWIN SHEETS, INDEPENDENTLY  (rule 82, this lane's own [the twin sheets
   measured], round two)

This lane's own MODE line: "a judgment is a measured number and a side-by-side in VOTE; your own
instruments, never a lane's self-report." DIRECTION's own tools/bohemia_direction_twin_sheets.py
already prints numbers onto its VOTE cards (slices/vote/DIRECTION_THE_TWIN_THE_GROUND.png,
DIRECTION_THE_TWIN_THE_PLACES.png) -- this tool does not trust those printed numbers, it measures
the SAME PIXELS a reader sees in VOTE, independently, with its own code.

Round one (records/BOHEMIA_EYES_THE_TWIN_SHEETS_MEASURED_ROUND_1_SCHOOL_DIRECTIONS_OWN_RULER_ALREADY_EXISTS_10_10_26.md)
found DIRECTION's own stats() already covers four of the row's five named metrics on real,
scale-free formulas (distinct colours, contrast range, outline share, edge density), and that
flat fill share is the one real gap, the direct complement of edge density. This tool
reimplements that same formula SHAPE independently (not copy-pasted, not trusting printed
numbers) and adds flat_share.

WHY THE CROPS COME FROM THE COMPOSITED CARD, NOT THE SOURCE FILES: DIRECTION's own tool has no
function boundary around its crop-building (it runs at import time, needs a live fight-board
screenshot via sys.argv, and writes files as a side effect), so re-running it is not a clean
import. Cropping the ALREADY-SHIPPED card PNG instead is not a compromise: it is MORE faithful to
rule 89 ("EYES checks the picture"), because it guarantees this tool measures the literal pixels
a reader sees in VOTE, found by real boundary detection (every image block against the card's own
background colour), never eyeballed.

    python3 tools/bohemia_eyes_the_twin_sheets_check_10_10_26.py
      -> records/eyes_twin_sheets/report.json
      -> records/BOHEMIA_EYES_THE_TWIN_SHEETS_MEASURED_ROUND_2_THE_CHECK_<...>.md (written by hand after)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT_DIR = 'records/eyes_twin_sheets'
OUT_JSON = os.path.join(OUT_DIR, 'report.json')
OUT_CARD = 'slices/vote/EYES_THE_TWIN_SHEETS_CHECKED.png'
BG, INK, HOT, DIM = (13, 13, 18), (232, 224, 204), (226, 162, 72), (150, 142, 128)


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(rows, pair_images):
    """ONE SHEET, WIDEST GAP FIRST, NOT DIRECTION'S OWN NARRATIVE ORDER: the row asks for the
    family with the widest gap named first, decided by this lane's own number, not by whichever
    complaint reads loudest in prose."""
    f16, f12, f11 = font(16), font(12), font(11)
    cell = 180
    row_h = cell + 60
    W = 60 + cell * 2 + 420
    H = 70 + row_h * len(rows)
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'THE TWIN SHEETS, CHECKED INDEPENDENTLY -- WIDEST GAP FIRST', font=f16, fill=INK)
    d.text((14, 36), 'EYES\' own instrument, the same pixels DIRECTION\'s own cards show in VOTE, not her printed numbers',
            font=f11, fill=DIM)
    y = 70
    for r in rows:
        ours_im, twin_im = pair_images[r['family']]
        a, b = ours_im.copy(), twin_im.copy()
        a.thumbnail((cell, cell), Image.NEAREST); b.thumbnail((cell, cell), Image.NEAREST)
        im.paste(a, (14, y + (cell - a.height) // 2))
        im.paste(b, (14 + cell + 10, y + (cell - b.height) // 2))
        tx = 14 + cell * 2 + 30
        o, t = r['ours'], r['twin']
        d.text((tx, y), '%s -- gap %.1f%%' % (r['family'].upper(), r['gap_pct']), font=f12, fill=HOT)
        d.text((tx, y + 20), 'colours/1000px  %.1f -> %.1f' % (o['col_kpx'], t['col_kpx']), font=f11, fill=INK)
        d.text((tx, y + 36), 'contrast range  %d -> %d' % (o['value_range'], t['value_range']), font=f11, fill=INK)
        d.text((tx, y + 52), 'outline share   %.3f -> %.3f' % (o['dark_line'], t['dark_line']), font=f11, fill=INK)
        d.text((tx, y + 68), 'edge density    %.1f -> %.1f' % (o['detail'], t['detail']), font=f11, fill=INK)
        d.text((tx, y + 84), 'flat fill share %.3f -> %.3f' % (o['flat_share'], t['flat_share']), font=f11, fill=INK)
        y += row_h
    return im


def stats(im):
    """THE SAME FIVE METRICS THE ROW NAMES, independently computed (not copy-pasted from
    DIRECTION's own file, reimplemented from the same real formulas round one sourced):
      col_kpx     distinct colours per 1000 px                  (distinct colours)
      value_range 95th-5th percentile luminance                 (contrast range)
      dark_line   dark (L<45) AND high-gradient (edge>30) share  (outline share)
      detail      mean gradient magnitude                       (edge density)
      flat_share  share of pixels with near-zero local gradient  (the share of flat fill, NEW)
    """
    a = np.asarray(im.convert('RGB')).astype(float)
    h, w, _ = a.shape
    n = h * w
    L = a @ [0.299, 0.587, 0.114]
    gx = np.zeros_like(L); gx[:, 1:] = np.abs(np.diff(L, axis=1))
    gy = np.zeros_like(L); gy[1:, :] = np.abs(np.diff(L, axis=0))
    edge = np.maximum(gx, gy)
    flat = a.reshape(-1, 3)
    cols = len(set(map(tuple, flat.astype(int))))
    return dict(
        col_kpx=round(1000.0 * cols / n, 2),
        value_range=int(np.percentile(L, 95) - np.percentile(L, 5)),
        dark_line=round(float(((L < 45) & (edge > 30)).sum()) / n, 3),
        detail=round(float(edge.mean()), 2),
        flat_share=round(float((edge < 4).sum()) / n, 3),
    )


def gap(a, b):
    """ONE NUMBER PER PAIR, SO FAMILIES CAN BE RANKED: the mean absolute relative difference
    across the five metrics, each scaled by the twin's own value so a metric that runs in the
    hundreds (col_kpx) does not drown one that runs under one (flat_share)."""
    diffs = []
    for k in a:
        hi = max(abs(a[k]), abs(b[k]), 1e-6)
        diffs.append(abs(a[k] - b[k]) / hi)
    return round(100.0 * sum(diffs) / len(diffs), 1)


def crop_card(path, bg=(13, 13, 18), tol=6):
    """FINDS EVERY IMAGE BLOCK ON THE CARD BY ITS OWN BACKGROUND COLOUR, never eyeballed: a
    vertical content band, then the column bands inside it, the same two-pass scan either card
    uses for its own layout."""
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(int)
    nonbg = (np.abs(a - np.array(bg)).sum(axis=2)) > tol

    def row_bands(mask):
        has = mask.any(axis=1)
        out, y = [], 0
        while y < len(has):
            if has[y]:
                y0 = y
                while y < len(has) and has[y]:
                    y += 1
                out.append((y0, y))
            else:
                y += 1
        return out

    def col_bands(mask, y0, y1, min_gap=5):
        sub = mask[y0:y1]
        has = sub.any(axis=0)
        raw, x = [], 0
        while x < len(has):
            if has[x]:
                x0 = x
                while x < len(has) and has[x]:
                    x += 1
                raw.append((x0, x))
            else:
                x += 1
        merged = []
        for b in raw:
            if merged and b[0] - merged[-1][1] < min_gap:
                merged[-1] = (merged[-1][0], b[1])
            else:
                merged.append(list(b))
        return [tuple(m) for m in merged]

    bands = [b for b in row_bands(nonbg) if b[1] - b[0] > 100]  # image rows only, not text/labels
    blocks = []
    for (y0, y1) in bands:
        for (x0, x1) in col_bands(nonbg, y0, y1):
            # TIGHTEN: a row band's height is the UNION of every column in it, so a shorter
            # panel beside a taller one (the road's single square beside the twin's 3-row grid)
            # would otherwise carry the taller panel's padding into its own crop. Re-scan this
            # column's own content rows, inside the shared row band only.
            col_mask = nonbg[y0:y1, x0:x1]
            has_row = col_mask.any(axis=1)
            rows_on = np.where(has_row)[0]
            ty0, ty1 = y0 + int(rows_on[0]), y0 + int(rows_on[-1]) + 1
            blocks.append((x0, ty0, x1, ty1))
    return im, blocks


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    report = {}

    gim, gblocks = crop_card('slices/vote/DIRECTION_THE_TWIN_THE_GROUND.png')
    assert len(gblocks) == 6, 'expected 3 rows x 2 cols on the ground sheet, found %d' % len(gblocks)
    (road_o, road_t), (props_o, props_t), (board_o, board_t) = (
        gblocks[0:2], gblocks[2:4], gblocks[4:6])

    pim, pblocks = crop_card('slices/vote/DIRECTION_THE_TWIN_THE_PLACES.png')
    assert len(pblocks) == 5, 'expected 3 + 2 blocks on the places sheet, found %d' % len(pblocks)
    place_now, place_new_house, place_settlement = pblocks[0:3]
    ground_now, ground_twin = pblocks[3:5]

    pairs = {
        'the road':         (gim.crop(road_o),  gim.crop(road_t)),
        'the props':        (gim.crop(props_o), gim.crop(props_t)),
        'the fight board':  (gim.crop(board_o), gim.crop(board_t)),
        'the place (vs cook four\'s new house)':  (pim.crop(place_now), pim.crop(place_new_house)),
        'the place (vs its own settlement screen)': (pim.crop(place_now), pim.crop(place_settlement)),
        'the ground between': (pim.crop(ground_now), pim.crop(ground_twin)),
    }

    rows = []
    for label, (ours_im, twin_im) in pairs.items():
        s_ours, s_twin = stats(ours_im), stats(twin_im)
        g = gap(s_ours, s_twin)
        rows.append(dict(family=label, ours=s_ours, twin=s_twin, gap_pct=g))
        report[label] = rows[-1]

    rows.sort(key=lambda r: r['gap_pct'], reverse=True)
    print('%-42s %8s   %s' % ('family', 'gap%', 'ours -> twin (col_kpx / value_range / dark_line / detail / flat_share)'))
    for r in rows:
        o, t = r['ours'], r['twin']
        print('%-42s %7.1f%%   %.1f/%d/%.3f/%.1f/%.3f -> %.1f/%d/%.3f/%.1f/%.3f' % (
            r['family'], r['gap_pct'],
            o['col_kpx'], o['value_range'], o['dark_line'], o['detail'], o['flat_share'],
            t['col_kpx'], t['value_range'], t['dark_line'], t['detail'], t['flat_share']))

    with open(OUT_JSON, 'w') as f:
        json.dump(dict(ranked=rows), f, indent=2)
    os.makedirs('slices/vote', exist_ok=True)
    card(rows, pairs).save(OUT_CARD, optimize=True)
    print('\n  wrote %s\n  wrote %s' % (OUT_JSON, OUT_CARD))


if __name__ == '__main__':
    main()
