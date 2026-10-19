#!/usr/bin/env python3
"""BOHEMIA -- RUN [the demo wears the rig] (rule 115g, Paolo 10/18: 'is the demo changing, I liked the robot').

THE FIRST RIG-MADE THING IN THE DEMO: the truck. DIRECTION's master rig rendered it worn at the source (5efc414,
records/target/master_rig/truck/rig_*.png) and he voted it UP on its card (direction-the-look-at-the-source-10-17,
'I saw how you made the robot. I liked it.'). The map's cargo on the I-15 has been a 6 x 4 yellow box since the
overmap was born; it rolls south-west on the glass (map y grows, iso puts that down and left), so the rig's SW facing.

What this does, and nothing else: crop the SW render to its pixels, scale it by area (box) to the marker's size on the
glass at three device pixels a point (54 px wide = 18 points, the size of the other map markers, rule 102b: a marker
keeps its pixels while the world zooms), snap alpha to on/off so the edge is a pixel edge and not a blur, and write
one PNG plus its base64 for the page. Colours are the render's own: nothing is repainted, nothing darkened.

  python3 tools/bohemia_run_the_rig_truck_on_the_map_bake.py
writes slices/vote/RUN_THE_TRUCK_TURNED_UP_ON_THE_MAP.png and prints the data URI length.
"""
import base64, io, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/direction_the_truck_turned_up/truck/rig_SW.png')   # 10/19: the turned-up truck, his UP on direction-the-truck-turned-up-10-18 (after round five's 'plate toy')
OUT = os.path.join(ROOT, 'slices/vote/RUN_THE_TRUCK_TURNED_UP_ON_THE_MAP.png')   # 10/19: a new name, so the voted card's own picture stays what he voted on
W = 54  # device pixels at 3x = 18 points on the glass


def bake():
    im = Image.open(SRC).convert('RGBA')
    im = im.crop(im.getbbox())
    h = round(im.height * W / im.width)
    # premultiplied box scale so the transparent rim does not bleed dark into the paint
    small = im.resize((W, h), Image.Resampling.BOX, reducing_gap=None)
    px = small.load()
    for y in range(h):
        for x in range(W):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= 128 else (0, 0, 0, 0)
    buf = io.BytesIO()
    small.save(buf, 'PNG', optimize=True)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'wb') as f:
        f.write(buf.getvalue())
    return small.size, base64.b64encode(buf.getvalue()).decode()


if __name__ == '__main__':
    size, b64 = bake()
    colours = len(set(Image.open(OUT).convert('RGBA').getdata()))
    print('truck sprite', size, 'colours', colours, 'base64', len(b64))
    print('data:image/png;base64,' + b64)
