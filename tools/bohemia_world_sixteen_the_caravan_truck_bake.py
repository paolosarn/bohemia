#!/usr/bin/env python3
"""THE CARAVAN'S TRUCK ON THE MAP, EIGHT WAYS (WORLD 16, 11/27/26; VAMILY rule 494(d), Paolo 11/27: 'I haven't seen one caravan
quest... go from one city to another'; the rule: 'the caravan is a truck that follows his party town to town on the clock and raiders
come for it on the road').

The escort job's cargo has been drawn as one 54 x 44 picture of the truck facing south-west (RUN's bake of the voted truck, rule 115g),
26 points wide and always facing the same way, jumping a block at a time behind him. The truck he voted UP (direction-the-truck-turned-up
-10-18, after 'a little too much like a play toy') was rendered by DIRECTION's master rig in all EIGHT facings, with its contact shadow:
records/target/direction_the_truck_turned_up/truck/rig_<D>.png and shadow_<D>.png, 304 x 266 at 57 pixels a metre, the ground's middle
at (152, 115) in every facing (rig.json ground_px). Nothing is drawn here: each facing is laid over its own shadow, scaled by area to
SCALE of its size (the map draws the truck at 0.6 of its true size beside his men: one truck is about one and a half men long on the
glass, a vehicle you read at a glance that does not cover four blocks; 0.6 of the pixels keeps one pixel of it to one pixel of a 3x
phone at the map's near zoom), its edge snapped to on or off like RUN's bake so it is a pixel edge, cropped to what is there, packed.

Out: slices/fight_rig/map_caravan_truck.webp (lossless) and .json: cells[D] = [x, y, w, h, gx, gy] (the cell on the atlas, and where the
ground's middle falls inside it), scale, ppm (the source's 57; the body ruler 98 px = 1.72 m), the source files' bytes (a re-render makes
the bake stale and the gate says so).

Run: python3 tools/bohemia_world_sixteen_the_caravan_truck_bake.py
"""
import json, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'records/target/direction_the_truck_turned_up/truck')
OUT_IM = os.path.join(ROOT, 'slices/fight_rig/map_caravan_truck.webp')
OUT_J = os.path.join(ROOT, 'slices/fight_rig/map_caravan_truck.json')
DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
SCALE = 0.6
PAD = 1


def main():
    rig = json.load(open(os.path.join(SRC, 'rig.json')))
    gx0, gy0 = rig['ground_px']
    cells, srcs = {}, {}
    for d in DIRS:
        body = Image.open(os.path.join(SRC, 'rig_%s.png' % d)).convert('RGBA')
        sh_p = os.path.join(SRC, 'shadow_%s.png' % d)
        im = Image.new('RGBA', body.size, (0, 0, 0, 0))
        if os.path.exists(sh_p):
            im.alpha_composite(Image.open(sh_p).convert('RGBA'))
        im.alpha_composite(body)
        W, H = round(im.width * SCALE), round(im.height * SCALE)
        small = im.resize((W, H), Image.Resampling.BOX)
        px = small.load()
        # the body's edge snapped on or off (a pixel edge, never a blur); the soft shadow under it keeps its alpha
        bpx = body.resize((W, H), Image.Resampling.BOX).load()
        for y in range(H):
            for x in range(W):
                r, g, b, a = px[x, y]
                ba = bpx[x, y][3]
                if ba >= 128:
                    px[x, y] = (r, g, b, 255)
                elif ba > 0 and a < 128:
                    px[x, y] = (0, 0, 0, min(a, 110))
        bb = small.getbbox()
        cut = small.crop(bb)
        cells[d] = {'im': cut, 'g': (round(gx0 * SCALE) - bb[0], round(gy0 * SCALE) - bb[1])}
        srcs[d] = os.path.getsize(os.path.join(SRC, 'rig_%s.png' % d))
    # one row a facing pair, shelf-packed, widest first
    order = sorted(DIRS, key=lambda d: -cells[d]['im'].height)
    AW = 512
    x = y = shelf = 0
    place = {}
    for d in order:
        w, h = cells[d]['im'].size
        if x + w > AW:
            x, y, shelf = 0, y + shelf + PAD, 0
        place[d] = (x, y)
        x += w + PAD
        shelf = max(shelf, h)
    AH = y + shelf
    atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0))
    out = {}
    for d in DIRS:
        ax, ay = place[d]
        atlas.paste(cells[d]['im'], (ax, ay))
        w, h = cells[d]['im'].size
        out[d] = [ax, ay, w, h, cells[d]['g'][0], cells[d]['g'][1]]
    atlas.save(OUT_IM, 'WEBP', lossless=True, quality=100, method=6)
    meta = {
        'about': "the escort job's truck on the map, eight facings over their contact shadows (tools/bohemia_world_sixteen_the_caravan_truck_bake.py; "
                 "WORLD 16 11/27, rule 494(d)); the truck he voted UP, DIRECTION's master rig render, nothing redrawn",
        'lane': 'WORLD 16', 'rule': '494(d)',
        'source': {'dir': 'records/target/direction_the_truck_turned_up/truck', 'ppm': rig.get('ppm', 57), 'ground_px': [gx0, gy0], 'bytes': srcs},
        'scale': SCALE, 'man_px': 98, 'man_m': 1.72,
        'size': [AW, AH], 'decoded_mb': round(AW * AH * 4 / 1e6, 2),
        'cells': out,
    }
    json.dump(meta, open(OUT_J, 'w'), indent=1)
    print('the truck, 8 facings at %.2f: %d x %d (%.2f MB decoded), %d bytes' % (SCALE, AW, AH, meta['decoded_mb'], os.path.getsize(OUT_IM)))


if __name__ == '__main__':
    sys.exit(main())
