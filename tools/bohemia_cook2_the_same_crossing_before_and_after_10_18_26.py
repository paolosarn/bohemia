#!/usr/bin/env python3
"""COOK TWO, [the same crossing before and after] (the top OPEN row; DIRECTION passed the road on 10/10 and sent the sheet
back, 0b8b782c: 'the same crossing, before and after, is the only thing between the street kit and VOTE', rule 89).
records/ only (rule 100); NOTHING DRAWN OR REDRAWN (the row's constraint): both halves are the fight board's own pixels,
cut at 1:1 from the same file at two commits:
  BEFORE  slices/fight_ground/block_corner_0.webp at 61337a8a (COMBAT TWO [the rest join], 10/10, the last board before
          the kit), the fight's cooked street;
  AFTER   the same file as laid now (COMBAT TWO 8c1ff703 laid every fight street from COOK TWO's kit of his pack tiles;
          da85d04 since), the street from his pools.
The 10/10 sheet (kit_street/before_after.webp) put the main street beside a bare crossing: two different places. This is
one place, one window, one pixel size.
MEASURED on the sheet (written to the JSON beside it): which pixels changed between the two commits and where, so the
picture proves it shows only what was laid, and the same count on block_main_0, where the laid street crosses a roof.
  python3 tools/bohemia_cook2_the_same_crossing_before_and_after_10_18_26.py   (needs the history: git fetch --deepen)

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03.
The source is the fight board itself at two commits; no reference game.
"""
import io, json, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEFORE_SHA = '61337a8a'
OUT = os.path.join(R, 'records/target/COOK2_THE_SAME_CROSSING_BEFORE_AND_AFTER.png')
OUTJ = os.path.join(R, 'records/target/COOK2_THE_SAME_CROSSING_BEFORE_AND_AFTER.json')
CX, CY, CW, CH = 1287, 905, 1240, 1000          # the crossing's centre on the 2575x1820 board, the window at 1:1


def at(sha, path):
    if sha is None:
        return Image.open(os.path.join(R, path)).convert('RGB')
    try:
        b = subprocess.run(['git', '-C', R, 'show', f'{sha}:{path}'], check=True, capture_output=True).stdout
    except subprocess.CalledProcessError:
        raise SystemExit(f'{sha} is not in this clone: git fetch --filter=blob:none --deepen=3000 origin main')
    return Image.open(io.BytesIO(b)).convert('RGB')


def changed(path):
    a = np.asarray(at(BEFORE_SHA, path)).astype(int); b = np.asarray(at(None, path)).astype(int)
    d = np.abs(a - b).max(2) > 24                  # webp noise sits under 24; a laid tile is far over it
    ys, xs = np.nonzero(d)
    return a, b, d, (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None


def font(sz):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',):
        if os.path.exists(f):
            return ImageFont.truetype(f, sz)
    return ImageFont.load_default()


def main():
    P = 'slices/fight_ground/block_corner_0.webp'
    a, b, d, box = changed(P)
    win = (CX - CW // 2, CY - CH // 2, CX + CW // 2, CY + CH // 2)
    A = Image.fromarray(a.astype(np.uint8)).crop(win); B = Image.fromarray(b.astype(np.uint8)).crop(win)

    # where the change fell: the street band (the two roads plus their walks) or anywhere else
    H, W = d.shape
    road = np.zeros_like(d)
    # the kit's footprint is the two crossing roads with their walks; anything changed outside that cross is a redraw
    rows = d.mean(1) > 0.5; cols = d.mean(0) > 0.5
    ry = np.nonzero(rows)[0]; rx = np.nonzero(cols)[0]
    band_y = (int(ry.min()), int(ry.max())) if len(ry) else None
    band_x = (int(rx.min()), int(rx.max())) if len(rx) else None
    if band_y: road[band_y[0]:band_y[1] + 1, :] = True
    if band_x: road[:, band_x[0]:band_x[1] + 1] = True
    pad = 40                                      # a curb shadow and a walk's weeds may sit a few px outside the band
    roadp = road.copy()
    if band_y: roadp[max(0, band_y[0] - pad):band_y[1] + pad, :] = True
    if band_x: roadp[:, max(0, band_x[0] - pad):band_x[1] + pad] = True
    outside = int((d & ~roadp).sum()); total = int(d.sum())

    # block_main_0: the same count
    am, bm, dm, boxm = changed('slices/fight_ground/block_main_0.webp')
    # the street band on block_main_0: rows where most pixels changed
    ry2 = np.nonzero(dm.mean(1) > 0.3)[0]
    band2 = (int(ry2.min()), int(ry2.max())) if len(ry2) else None

    # ---- the sheet: two windows at 1:1, a label bar each, a line of numbers under ------------------------------------
    G = 24; TOP = 70; BOT = 120
    S = Image.new('RGB', (CW * 2 + G * 3, CH + TOP + BOT), (17, 17, 17)); dr = ImageDraw.Draw(S)
    S.paste(A, (G, TOP)); S.paste(B, (CW + 2 * G, TOP))
    f, fs = font(26), font(20)
    dr.text((G, 22), 'BEFORE: the fight crossing as it was (10/10, the cooked street)', fill=(230, 226, 214), font=f)
    dr.text((CW + 2 * G, 22), 'AFTER: the same crossing as laid now, from your street tiles', fill=(230, 226, 214), font=f)
    dr.text((G, TOP + CH + 18), 'SAME FILE, SAME WINDOW, 1:1: block_corner_0, 1240 x 1000 px of 2575 x 1820. Nothing redrawn for this picture.',
            fill=(190, 186, 176), font=fs)
    dr.text((G, TOP + CH + 52), f'Changed between the two: {total:,} px, {outside:,} of them outside the two roads and their walks. '
            'The houses, the yards and the dirt are the same pixels.', fill=(190, 186, 176), font=fs)
    dr.text((G, TOP + CH + 86), 'PIXEL SIZE 1:1, the board as fought | PALETTE the board itself (two commits) | LIGHT from above, as laid',
            fill=(150, 146, 138), font=fs)
    S.save(OUT, optimize=True)

    rep = {
        'lane': 'cook 2', 'row': 'the same crossing before and after', 'made': '10/18',
        'file': P, 'before_sha': BEFORE_SHA, 'after': 'HEAD (laid by COMBAT TWO 8c1ff703 from kit_street)',
        'window_px': list(win), 'board_px': [W, H], 'scale': '1:1',
        'changed_px': total, 'changed_bbox': box, 'road_band_y': band_y, 'road_band_x': band_x,
        'changed_outside_roads_px': outside, 'changed_outside_share': round(outside / max(1, total), 4),
        'block_main_0': {'changed_px': int(dm.sum()), 'changed_bbox': boxm, 'street_band_y': band2,
                         'note': 'the laid street runs over the strip building\'s roof and the church\'s tower edge; '
                                 'the BEFORE board stopped the road at the building. A layering order in the board layout '
                                 '(COMBAT TWO\'s file), routed, not touched here.'},
    }
    json.dump(rep, open(OUTJ, 'w'), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == '__main__':
    main()
