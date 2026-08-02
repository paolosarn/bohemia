#!/usr/bin/env python3
"""
BOHEMIA — RECOVER ONE OF HIS WALLS FROM ITS TILING PREVIEW (8/2/26)

REUSE CHECK: cooks NOTHING and draws NOTHING. It reverses an integer nearest-neighbour
upscale, which returns the original pixels bit for bit. No bank is opened because no new
graphic is produced: this is his own art, handed back at the size it was drawn.

WHY IT EXISTS. banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt stores WB4 — the one wall
Paolo passed out of the 48 in batch 2 — as a 792x264 sheet: the true 44x44 tile, blown
up 3x and repeated 6x2 so he could judge it as a RUN OF WALL instead of as a single chip.
That is the right way to show a tile and the wrong thing to hand a renderer.
tools/build_run_slice.js was doing drawImage(sheet, X, Y, 44, 44), so one community in
thirteen wore the entire sheet crushed into one cell.

WHY THE RECOVERY IS EXACT AND NOT A RESAMPLE. The sheet is a pure integer
nearest-neighbour upscale: every source pixel became a solid kxk block. Taking the first
module and sampling one pixel per block returns the original bytes, not an approximation
of them. This file ASSERTS that before it returns anything — if the blocks are not
solid, the sheet was not a clean upscale, and guessing at his art is exactly the thing
BOUGHT BEATS PAINTED forbids. It raises instead.

THE SCALE IS MEASURED HERE, NOT PASSED IN. The caller's first attempt guessed it from
the sheet's dimensions alone and picked 6, because 792 and 264 are both divisible by
44*6 — while the real upscale is 3x tiled 6x2. Only the PIXELS know: the scale is how
wide the solid colour blocks actually are. So this reads it off the image and the caller
does not get a vote. (The wrong guess was caught, not shipped: the solid-block assertion
below refused it outright, which is what that assertion is for.)

  stdin: base64 PNG   stdout: base64 PNG, 44x44
"""
import base64
import io
import sys

from PIL import Image

CELL = 44


def detect(im):
    """the scale is the width of the solid colour blocks, read off the image itself."""
    px = im.load()
    best = 0
    for k in range(8, 1, -1):
        if im.width % (CELL * k) or im.height % (CELL * k):
            continue
        ok = True
        for y in range(0, min(CELL * k, im.height), 1):
            for x in range(0, min(CELL * k, im.width), 1):
                if px[x, y] != px[x - x % k, y - y % k]:
                    ok = False
                    break
            if not ok:
                break
        if ok:
            best = k
            break
    if not best:
        raise SystemExit('REFUSING: %dx%d is not an integer-scaled tiling preview of a '
                         '44x44 tile. This is his approved art; it does not get guessed '
                         'at.' % (im.width, im.height))
    return best


def rescue(b64, k=None):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
    if k is None:
        k = detect(im)
    unit = im.crop((0, 0, CELL * k, CELL * k))
    px = unit.load()
    for y in range(CELL * k):
        for x in range(CELL * k):
            if px[x, y] != px[x - x % k, y - y % k]:
                raise SystemExit(
                    'REFUSING: %dx%d is not a clean %dx upscale (block at %d,%d is not '
                    'solid). This is his approved art; it does not get guessed at.'
                    % (im.width, im.height, k, x, y))
    out = unit.resize((CELL, CELL), Image.NEAREST)
    buf = io.BytesIO()
    out.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()


if __name__ == '__main__':
    sys.stdout.write(rescue(sys.stdin.read().strip()))
