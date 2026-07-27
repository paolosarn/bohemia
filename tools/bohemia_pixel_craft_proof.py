#!/usr/bin/env python3
"""
BOHEMIA — THE PIXEL CRAFT PROOF SHEET (7/27/26)

The audit says our frozen act-1 tiles are 73% orphan pixels and carry up to 1610
colours in one 44x44 square. Those are numbers. Paolo does not read numbers, he
looks, so this makes the number VISIBLE: for a handful of tiles, the tile as it
ships beside a map of every pixel in it that touches no pixel of its own colour.

THIS IS EVIDENCE, NOT A CANDIDATE. Nothing here is art to judge, nothing here is
a v2 of anything, and the frozen set is not touched. It is the picture of a
diagnosis. The act-1 starter set is byte-locked by the visual constitution
(Paolo's CBB verdict) and re-cooking it needs his word, not my initiative.

REUSE CHECK: cooks no new graphic pixels. Every pixel on the sheet is either a
tile read out of banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (READ ONLY) or a
flat diagnostic colour laid over it. It opens no bank to draw from because it
draws nothing.

TASTE CHECK: not applicable and deliberately so - a diagnostic overlay is not
subject to the look rules, because it is not the look. It is a measurement with
a picture attached, and it is labelled as one on the sheet itself.

  python3 tools/bohemia_pixel_craft_proof.py
    -> records/target/PIXEL_CRAFT_PROOF.png
"""
import base64
import io
import json
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
AUDIT = 'records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json'
OUT = 'records/target/PIXEL_CRAFT_PROOF.png'
SHOW = ['wall_0', 'wall_window', 'roof_slope', 'road_0', 'yard_0', 'door_bottom']
Z = 6                                    # NEAREST only; art never resamples


def orphan_map(im):
    """Red = a pixel touching no 4-neighbour of its own colour. The craft calls
    these orphan pixels and calls them the reason art reads as noise."""
    px = im.convert('RGBA').load()
    w, h = im.size
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][3] <= 8:
                continue
            c = px[x, y][:3]
            alone = True
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] > 8 \
                        and px[nx, ny][:3] == c:
                    alone = False
                    break
            op[x, y] = (255, 40, 40, 255) if alone else (16, 16, 16, 255)
    return out


def main():
    bank = json.load(open(BANK))
    by_id = {t['id']: t for t in bank['tiles']}
    rows = {r['id']: r for r in json.load(open(AUDIT))['banks'][0]['rows']}
    ids = [i for i in SHOW if i in by_id]
    cell = bank['cell_px'] * Z
    pad, head, foot = 14, 78, 34
    W = pad + len(ids) * (cell + pad)
    H = head + cell * 2 + 30 + foot + 26
    sheet = Image.new('RGB', (W, H), (18, 18, 15))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 12), 'WHY IT LOOKS LIKE SLOP - AND IT IS MEASURABLE',
           fill=(238, 220, 168))
    d.text((pad, 30), 'TOP: the tile as it ships.   BOTTOM: red = a pixel touching no '
                      'pixel of its own colour.', fill=(196, 186, 158))
    d.text((pad, 46), 'Real pixel art has almost no red. Ours is 73% red on average. '
                      'That is not a style, it is a shrunk painting.',
           fill=(196, 186, 158))
    d.text((pad, 62), 'EVIDENCE, NOT A CANDIDATE. Nothing here is art to judge and the '
                      'frozen set was not touched.', fill=(150, 142, 120))
    for i, tid in enumerate(ids):
        x = pad + i * (cell + pad)
        im = Image.open(io.BytesIO(base64.b64decode(by_id[tid]['b64']))).convert('RGBA')
        sheet.paste(im.convert('RGB').resize((cell, cell), Image.NEAREST), (x, head))
        sheet.paste(orphan_map(im).convert('RGB').resize((cell, cell), Image.NEAREST),
                    (x, head + cell + 22))
        r = rows.get(tid, {})
        d.text((x, head + cell + 6), tid, fill=(206, 194, 164))
        d.text((x, head + cell * 2 + 28),
               '%d%% orphan' % round(100 * r.get('orphan_share', 0)), fill=(255, 120, 120))
        d.text((x, head + cell * 2 + 42),
               '%d colours' % r.get('colours', 0), fill=(255, 120, 120))
    sheet.save(OUT)
    print('OK -> %s  (%d tiles)' % (OUT, len(ids)))


if __name__ == '__main__':
    main()
