#!/usr/bin/env python3
"""ONE PACK TILE THROUGH THE PIPE, END TO END, WITH NO PIXEL TYPED (PLUMBER 10/17, row [the art pipe gate])

The proof the row asks for: one asset made end to end through the Aseprite tool server with no literal pixel in
the diff. This script holds no colour and no coordinate. It:
    1. takes one tile from his approved packs (reference/art_bank; the first road tile unless --tile says which)
    2. creates a sprite of the tile's size and draws the tile into it (draw_image_base64)
    3. snaps it to ITS OWN palette: indexed mode, palette from the art (set_color_mode)
    4. outlines it one pixel in its own darkest palette entry (add_outline) and clears stray pixels
    5. measures it (assess_sprite: isolated pixels, jaggies, fill, centring, on-ramp fraction)
    6. exports the PNG at 1:1 and writes report.json beside it (export_png)
Everything lands in reference/art_pipe/proof/ (a cook folder, not the game; rule 100).

    PYTHONPATH=tools/aseprite_mcp ASEPRITE_PATH=/path/to/aseprite python3 tools/aseprite_mcp/bohemia_pack_tile_through_the_pipe.py [--tile <png>]
"""
import base64
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools/aseprite_mcp'))
OUT = os.path.join(ROOT, 'reference/art_pipe/proof')
os.makedirs(OUT, exist_ok=True)
os.environ.setdefault('ASEPRITE_MCP_WORKSPACE', OUT)

from PIL import Image  # noqa: E402  (reading the tile's size only; no pixel is written here)
from aseprite_mcp.tools import effects, export, inspect, palette, sprite, image  # noqa: E402


def pick_tile(argv):
    if '--tile' in argv:
        return argv[argv.index('--tile') + 1]
    bank = os.path.join(ROOT, 'reference/art_bank/road')
    for f in sorted(os.listdir(bank)):
        if not f.endswith('.png'):
            continue
        w, h = Image.open(os.path.join(bank, f)).size
        if w <= 128 and h <= 128:            # a tile, not the family's contact sheet
            return os.path.join(bank, f)
    sys.exit('no road tile in reference/art_bank/road')


def darkest(colors):
    """the palette entry with the lowest luminance, as the server gives them (#rrggbb)"""
    def lum(h):
        h = h.lstrip('#')
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    return min(colors, key=lum)


def main(argv):
    t0 = time.time()
    tile = pick_tile(argv)
    w, h = Image.open(tile).size
    name = 'pack_tile_through_the_pipe.aseprite'
    log = {'tile': os.path.relpath(tile, ROOT), 'size': [w, h], 'steps': []}
    step = lambda k, r: (log['steps'].append({k: r}), print('  ' + k + ': ' + json.dumps(r)[:200]))[1]

    step('create_sprite', sprite.create_sprite(name, w, h, color_mode='rgb', overwrite=True))
    with open(tile, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('ascii')
    step('draw_image_base64', image.draw_image_base64(name, b64, 0, 0))
    before = palette.get_palette(name)
    # SNAP TO ITS OWN PALETTE. His tiles carry thousands of colours (the road family: 4,821 in one tile,
    # records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md), so first the sprite's own best 255, then indexed.
    # The server REFUSES a conversion that would make drawn pixels vanish; a refusal is recorded, not hidden.
    step('quantize_palette to its own best 255', palette.quantize_palette(name, 255))
    try:
        step('set_color_mode indexed, palette from the art', sprite.set_color_mode(name, 'indexed', palette_source='from_art'))
    except Exception as e:  # LuaToolError: the server would not lose a pixel
        step('set_color_mode indexed REFUSED by the server (the tile stays RGB on its 255)', {'refused': str(e)[:300]})
    after = palette.get_palette(name)
    cols = after.get('colors') or after.get('palette') or []
    cols = [c if isinstance(c, str) else c.get('hex') or c.get('color') for c in cols]
    cols = [c for c in cols if c]
    if cols:
        step('add_outline in its own darkest entry', effects.add_outline(name, darkest(cols), thickness=1))
    step('remove_stray_pixels', effects.remove_stray_pixels(name))
    measured = inspect.assess_sprite(name)
    step('assess_sprite', measured)
    out_png = os.path.join(OUT, 'pack_tile_through_the_pipe.png')
    step('export_png 1:1', export.export_png(name, 'pack_tile_through_the_pipe.png', scale=1, overwrite=True))  # relative: the workspace is the sandbox
    log['palette_before'] = before
    log['palette_after'] = after
    log['seconds'] = round(time.time() - t0, 1)
    with open(os.path.join(OUT, 'report.json'), 'w', encoding='utf8') as f:
        json.dump(log, f, indent=1)
    print('\n  done in %.1f s: %s, %s, %s' % (log['seconds'], os.path.relpath(out_png, ROOT),
          os.path.relpath(os.path.join(OUT, name), ROOT), os.path.relpath(os.path.join(OUT, 'report.json'), ROOT)))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
