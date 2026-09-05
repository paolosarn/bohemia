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
    return {'same_size': True, 'pixels': px, 'moved': moved,
            'moved_pct': round(100.0 * moved / px, 4),
            'changed_box': bbox}

if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    out = None
    if '--out' in sys.argv: out = sys.argv[sys.argv.index('--out') + 1]
    r = diff(args[0], args[1], out)
    print(args[0].split('/')[-1], 'vs', args[1].split('/')[-1], r)
