#!/usr/bin/env python3
"""THE CARAVAN PULLS ITS WAGON: the map's wagon sheet (WORLD 16, 11/27/26; VAMILY rule 485(b), Paolo 11/26: 'cyberpunk vibes but
their world has a running economy vibes'; rule 484 as amended 11/27: every picture alive on his iPhone counts).

A caravan on the map pulls STAFF 2's wagon (slices/fight_rig/staff_cart_wagon.webp, rule 471(c): the fight's own pictures of the
wagon in a man's frame, 98 px a man), loaded on the way out and empty on the way home. Nothing is drawn here: the wagon's own cells
are cut from its sheet pixel for pixel and packed into a small atlas, only the loads a caravan carries (food, gear, rounds, meds,
empty) and only the two parts the map draws (back: under the man; front: over him); the fallen 'tip' is the fight's alone.

WHY A PACK AND NOT THE SHEET: the whole wagon sheet is 2048 x 807, 6.6 MB decoded on a phone, for 80 cells of which the map uses
the parts above; packed it is the same pixels at about a third of the memory (rule 484: the iPhone kills a page on far less memory
than this box, so nothing the map keeps alive is bigger than it has to be).

Out: slices/fight_rig/map_caravan_wagon.webp (lossless) and slices/fight_rig/map_caravan_wagon.json, the same cell format as
staff_carts.json ([x, y, w, h, dx, dy]; dx, dy from the top left of the man's 144 x 161 fight cell whose foot is `foot`), so the
map's cart drawer (mapCampCart's arithmetic) reads it unchanged. The json carries the source sheet's size and bytes, so a re-cut
wagon makes this pack stale and the gate says so.

Run: python3 tools/bohemia_world_sixteen_pack_the_caravan_wagon.py
"""
import json, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC_J = os.path.join(ROOT, 'slices/fight_rig/staff_carts.json')
OUT_IM = os.path.join(ROOT, 'slices/fight_rig/map_caravan_wagon.webp')
OUT_J = os.path.join(ROOT, 'slices/fight_rig/map_caravan_wagon.json')
LOADS = ['food', 'gear', 'rounds', 'meds', 'empty']
PARTS = ['back', 'front']
WIDTH = 1024
PAD = 1


def main():
    j = json.load(open(SRC_J))
    K = j['kinds']['wagon']
    src_path = os.path.join(ROOT, 'slices/fight_rig', K['file'])
    im = Image.open(src_path).convert('RGBA')
    cells = []
    for ld in LOADS:
        for f, parts in K['cells'][ld].items():
            for p in PARTS:
                q = parts.get(p)
                if q:
                    cells.append((ld, f, p, q))
    # shelf packing, tallest first, so the atlas is as short as it can be
    order = sorted(cells, key=lambda c: (-c[3][3], -c[3][2]))
    x = y = shelf = 0
    place = {}
    for c in order:
        w, h = c[3][2], c[3][3]
        if x + w > WIDTH:
            x, y, shelf = 0, y + shelf + PAD, 0
        place[(c[0], c[1], c[2])] = (x, y)
        x += w + PAD
        shelf = max(shelf, h)
    H = y + shelf
    out = Image.new('RGBA', (WIDTH, H), (0, 0, 0, 0))
    cj = {}
    for ld, f, p, q in cells:
        sx, sy, w, h, dx, dy = q
        ax, ay = place[(ld, f, p)]
        out.paste(im.crop((sx, sy, sx + w, sy + h)), (ax, ay))
        cj.setdefault(ld, {}).setdefault(f, {'back': None, 'front': None})[p] = [ax, ay, w, h, dx, dy]
    out.save(OUT_IM, 'WEBP', lossless=True, quality=100, method=6)
    meta = {
        'about': "the caravan's wagon on the map: STAFF 2's wagon cells packed (tools/bohemia_world_sixteen_pack_the_caravan_wagon.py; "
                 "WORLD 16 11/27, rule 485(b)); the same cell format as staff_carts.json",
        'lane': 'WORLD 16', 'rule': '485(b)',
        'source': {'file': 'staff_cart_wagon.webp', 'version': j.get('version'), 'size': list(im.size),
                   'bytes': os.path.getsize(src_path)},
        'foot': j['foot'], 'man_px': 98,
        'size': [WIDTH, H], 'decoded_mb': round(WIDTH * H * 4 / 1e6, 2),
        'source_decoded_mb': round(im.size[0] * im.size[1] * 4 / 1e6, 2),
        'loads': LOADS,
        'kinds': {'wagon': {'file': 'map_caravan_wagon.webp', 'cells': cj}},
    }
    json.dump(meta, open(OUT_J, 'w'), indent=1)
    print('packed %d cells into %d x %d (%.2f MB decoded, the sheet was %.2f MB); %s, %d bytes' % (
        len(cells), WIDTH, H, meta['decoded_mb'], meta['source_decoded_mb'], os.path.relpath(OUT_IM, ROOT), os.path.getsize(OUT_IM)))


if __name__ == '__main__':
    sys.exit(main())
