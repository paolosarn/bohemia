#!/usr/bin/env python3
"""THE TEXTURE SET SHEET (10/17/26, CHARACTER, [the texture set], rule 110's big swing; rule 100d:
the batch beside its twin at 1:1).

One sheet, one row per faction look (the runway thirteen), six pictures a row, every one at the
112 box's own pixels, one art pixel to one sheet pixel:
  1. THE FORMULA: the body dressed by the old renderer (the placeholder in the game today).
  2. THE PIECES: the same clothes cut off the formula into one piece per body part, fanned out
     from the body so each piece is visible, each with a dot on the joint it attaches to.
  3. PUT BACK: the bare body with the pieces stamped back on in the formula's layer order, and
     the count of pixels that disagree with picture 1 (the ship test, measured).
  4. THE RIG'S MAN, BARE: DIRECTION's rendered CesiumMan, S facing, at the same 57 px a metre.
  5. THE RIG'S MAN WEARING THE PIECES, S: every piece placed by its world metres (right of the
     centre line, up from the ground), nothing scaled.
  6. and 7. the same in E and N.
The twin on this sheet is the rig's man (column 4): the thing the set has to fit. The packs hold
no people (COOK [the two holes]), so there is no pack twin of a worn coat.

Reads records/character/texture_set/ (manifest.json, the atlases, the outfit round trips) and
records/target/master_rig/man/rig_{S,E,N}.png. Writes records/target/character/
CHARACTER_THE_TEXTURE_SET.png (the one published file of this round) and the look log beside it.
Nothing to slices/, engine/ or the demo (rule 100).

Run: python3 tools/bohemia_cook_the_texture_set_sheet.py

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (no pack
person exists; the twin is the rig's man, records/target/master_rig/man), the card of numbers,
skills/bohemia-pixel-art (one art pixel to one sheet pixel, the 112 box, 57 ppm), RNWY-13 (the
two poles the thirteen are cut to), GARM-02 (the silhouette must read with no outline help),
AH-01, AH-03. A cut shown beside its twin, not a drawing. No reference game.
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TS = 'records/character/texture_set'
RIG = 'records/target/master_rig/man'
OUT = 'records/target/character/CHARACTER_THE_TEXTURE_SET.png'
PPM = 57
BOX = 112
BG = (28, 26, 24, 255)
INK = (232, 222, 204, 255)
DIM = (150, 142, 128, 255)
JOINT = (255, 70, 60, 255)
# how far each part is pushed out when the pieces are fanned (px), so a piece is seen on its own
FAN = {1: (0, -14), 2: (0, -14), 3: (0, -6), 4: (0, 0), 5: (16, 0), 6: (-16, 0), 7: (18, 6), 8: (-18, 6), 9: (8, 10), 10: (-8, 10), 11: (10, 20), 12: (-10, 20)}


def load_set():
    man = json.load(open(os.path.join(TS, 'manifest.json')))
    atl = {L: Image.open(os.path.join(TS, man['layers'][L]['atlas'])).convert('RGBA') for L in man['layers']}
    prt = {L: Image.open(os.path.join(TS, man['layers'][L]['parts'])).convert('L') for L in man['layers']}
    return man, atl, prt


def cell(man, atl, prt, name, facing):
    """the garment's 112 cell for one facing: RGBA pixels and the part map"""
    g = next(x for x in man['garments'] if x['n'] == name)
    fi = man['facings'].index(facing)
    L = g['layer']; row = g['row']
    box = (fi * BOX, row * BOX, (fi + 1) * BOX, (row + 1) * BOX)
    return g, np.array(atl[L].crop(box)), np.array(prt[L].crop(box))


def rig_man(facing):
    im = Image.open(os.path.join(RIG, 'rig_%s.png' % facing)).convert('RGBA')
    a = np.array(im)[:, :, 3] > 0
    ys, xs = np.where(a)
    rj = json.load(open(os.path.join(RIG, 'rig.json')))
    return im, dict(ground=int(ys.max()), centre=int(rj['ground_px'][0]), h=int(ys.max() - ys.min() + 1))


def paste_rgba(dst, src_rgba, x, y):
    """alpha-aware paste of a numpy RGBA onto a PIL RGBA at (x,y), skipping transparent"""
    h, w = src_rgba.shape[:2]
    tile = Image.fromarray(src_rgba.astype(np.uint8), 'RGBA')
    dst.alpha_composite(tile, (x, y))


def pieces_fanned(man, atl, prt, worn, facing):
    """the outfit's garments fanned by part: returns an RGBA canvas (BOX+60 square) and the joint dots"""
    W = BOX + 64
    cv = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    joints = man['per_facing'][facing]['joints']
    dots = set()
    for lay in man['layer_order']:
        n = worn.get(lay)
        if not n:
            continue
        try:
            g, rgba, pm = cell(man, atl, prt, n, facing)
        except StopIteration:
            continue
        for pid, (dx, dy) in FAN.items():
            mask = (pm & 127) == pid
            mask &= rgba[:, :, 3] > 0
            if not mask.any():
                continue
            piece = np.zeros_like(rgba); piece[mask] = rgba[mask]
            paste_rgba(cv, piece, 32 + dx, 32 + dy)
            jn = man['per_facing'][facing]['part_joint'].get(str(pid))
            if jn and jn in joints:
                jx, jy = joints[jn]
                dots.add((32 + dx + jx, 32 + dy + jy))
    d = ImageDraw.Draw(cv)
    for (x, y) in dots:
        d.rectangle((x - 1, y - 1, x + 1, y + 1), fill=JOINT)
    return cv


def pieces_on_rig(man, atl, prt, worn, facing, rig_im, rig_meta):
    """every piece placed by world metres onto the rig's man: x from the centre line, up from the ground"""
    cv = rig_im.copy()
    pf = man['per_facing'][facing]
    g_row, c_x = pf['ground_row'], pf['centre_x']
    for lay in man['layer_order']:
        n = worn.get(lay)
        if not n:
            continue
        try:
            g, rgba, pm = cell(man, atl, prt, n, facing)
        except StopIteration:
            continue
        keep = rgba.copy(); keep[(pm & 128) > 0] = 0  # a removal is not paint
        # the whole cell moves as one: the formula's ground row lands on the rig's ground row, centre on centre
        ox = rig_meta['centre'] - c_x
        oy = rig_meta['ground'] - g_row
        paste_rgba(cv, keep, ox, oy)
    return cv


def main():
    man, atl, prt = load_set()
    looks = [o for o in man['round_trip']['outfits'] if o['facing'] == 'S' and o['id'].startswith('faction:')]
    names = [o['id'].split(':', 1)[1] for o in looks]
    # the worn tables come from the alpha; the manifest only has ids, so read them off the alpha source once
    src = open('slices/BOHEMIA_ALPHA_0_9.html', encoding='utf8').read()
    import re
    worn_of = {}
    for m in re.finditer(r"faction:'([A-Za-z]+)'.*?worn:\{([^}]*)\}", src, re.S):
        if m.group(1) in names and m.group(1) not in worn_of:
            worn_of[m.group(1)] = dict(re.findall(r"(\w+):'([^']*)'", m.group(2)))
    rigs = {f: rig_man(f) for f in ['S', 'E', 'N']}
    rt = {(o['id'], o['facing']): o for o in man['round_trip']['outfits']}

    ROW = 172; X0 = 12
    cols = [('THE FORMULA', BOX), ('THE PIECES, FANNED, JOINT DOTS', BOX + 64), ('PUT BACK (px off)', BOX), ('THE RIG\'S MAN', 70), ('WEARS THEM, S', 70), ('E', 70), ('N', 70)]
    W = X0 + sum(w + 14 for _, w in cols) + 8
    H = 78 + ROW * len(names) + 44
    sheet = Image.new('RGBA', (W, H), BG)
    d = ImageDraw.Draw(sheet)
    d.text((X0, 6), 'THE TEXTURE SET: THE RUNWAY THIRTEEN CUT INTO PIECES THE RIG CAN WEAR (CHARACTER 10/17, one art pixel = one sheet pixel, 57 px a metre)', fill=INK)
    d.text((X0, 20), 'every canon garment (%d) cut off the old renderer into one piece per body part per facing (%d pieces), each with its attach point in metres; the twin is DIRECTION\'s rendered man (column 4), S/E/N' % (man['summary']['canon_garments'], man['summary']['pieces']), fill=DIM)
    rts = man['round_trip']['summary']
    d.text((X0, 34), 'ship test: %d of %d outfit-facings rebuild pixel-exact, mean %s px off; %d garments colour themselves from what is under them (named in the record), the rest is the seam pass' % (rts['pixel_exact'], rts['outfits_x_facings'], rts['mean_diff_px'], man['summary'].get('reads_under', 0)), fill=DIM)
    x = X0
    for label, w in cols:
        d.text((x, 56), label, fill=INK)
        x += w + 14
    y = 78
    for o, name in zip(looks, names):
        worn = worn_of.get(name, {})
        x = X0
        # 1 the formula (row 0 of the outfit png, S column)
        op = Image.open(os.path.join(TS, 'outfits', o['id'].replace(':', '_') + '.png')).convert('RGBA')
        si = man['facings'].index('S')
        formula = op.crop((si * BOX, 0, (si + 1) * BOX, BOX))
        rebuilt = op.crop((si * BOX, BOX, (si + 1) * BOX, 2 * BOX))
        sheet.alpha_composite(formula, (x, y)); d.text((x, y + BOX + 2), name.upper(), fill=INK); x += BOX + 14
        # 2 the pieces fanned
        fan = pieces_fanned(man, atl, prt, worn, 'S')
        sheet.alpha_composite(fan, (x - 32, y - 14)); x += BOX + 64 + 14
        # 3 put back
        sheet.alpha_composite(rebuilt, (x, y)); d.text((x, y + BOX + 2), '%d px off' % o['diff_px'], fill=(255, 120, 100, 255) if o['diff_px'] > 60 else DIM); x += BOX + 14
        # 4 the rig's man bare, S
        rim, rmeta = rigs['S']
        sheet.alpha_composite(rim, (x, y + BOX - rmeta['ground'] - 1)); x += 70 + 14
        # 5-7 wearing, S E N
        for f in ['S', 'E', 'N']:
            rim, rmeta = rigs[f]
            dressed = pieces_on_rig(man, atl, prt, worn, f, rim, rmeta)
            sheet.alpha_composite(dressed, (x, y + BOX - rmeta['ground'] - 1)); x += 70 + 14
        y += ROW
    d.text((X0, H - 36), 'the rig\'s man is CesiumMan (CC0) in his walk frame, %d px tall as rendered (rig.json says 98 for 1.72 m; measured here, not quoted); the formula\'s man is 98. cut at the median body (no dials); the thirteen\'s own dials are the look\'s, not the cloth\'s.' % rigs['S'][1]['h'], fill=DIM)
    d.text((X0, H - 22), 'PLACEHOLDER (rule 100e): the paint is the old renderer\'s; COOK THREE\'s repaint cuts into the same pieces with the same attach points. Nothing here is in the game.', fill=DIM)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)
    print('wrote', OUT, sheet.size)


if __name__ == '__main__':
    main()
