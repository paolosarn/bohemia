#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: THE PIXEL DIFF (lane 17, 9/5/26)

WHAT IT IS. Two screenshots in, one number out: what share of the pixels moved,
where they moved, and a picture of the difference. It is the smallest half of
the golden-image machine E3 will build, and it is useful on its own the day it
exists, for one reason -- A STILL FRAME IS A MEASUREMENT. "The city seems dead
asf" is an opinion until two frames eighteen seconds apart come back at 0.00%.

It never judges. It reports.

USAGE:  python3 tools/bohemia_eyes_diff.py A.png B.png [--out DIFF.png]
"""
import sys
from PIL import Image, ImageChops

def worst_block(d, block=64):
    """UNREAL'S SECOND NUMBER. Epic's screenshot comparison carries a GLOBAL error and
    a LOCAL one, "comparing chunks to the local error to locate hot spots of change
    that are important and would be ignored by the global error." Round one proved
    why in one line: the workshop moved 0.68% between two visits and the whole of
    that change was one speech bubble. An average hides a disaster."""
    w, h = d.size
    worst, at = 0.0, None
    for y in range(0, h, block):
        for x in range(0, w, block):
            blk = d.crop((x, y, min(x + block, w), min(y + block, h)))
            n = sum(blk.histogram()[9:])
            r = n / float(blk.size[0] * blk.size[1])
            if r > worst:
                worst, at = r, (x, y)
    return round(100.0 * worst, 2), at


def diff(a_path, b_path, out=None):
    a = Image.open(a_path).convert('RGB'); b = Image.open(b_path).convert('RGB')
    if a.size != b.size:
        return {'same_size': False, 'a': a.size, 'b': b.size}
    d = ImageChops.difference(a, b)
    bbox = d.getbbox()
    px = a.size[0] * a.size[1]
    hist = d.convert('L').histogram()
    moved = sum(hist[9:])                                        # 8/255: below this is codec noise
    if out:
        d.point(lambda v: min(255, v * 6)).save(out)             # x6 so a small move is visible
    grey = d.convert('L')
    worst, at = worst_block(grey)
    return {'same_size': True, 'pixels': px, 'moved': moved,
            'moved_pct': round(100.0 * moved / px, 4),
            'worst_block_pct': worst, 'worst_block_at': at,
            'changed_box': bbox}

if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    out = None
    if '--out' in sys.argv: out = sys.argv[sys.argv.index('--out') + 1]
    r = diff(args[0], args[1], out)
    print(args[0].split('/')[-1], 'vs', args[1].split('/')[-1], r)
