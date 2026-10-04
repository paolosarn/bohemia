#!/usr/bin/env python3
"""THE FIGHT'S GROUND, PACKED: LOSSLESS WEBP  (COMBAT 2, round thirteen)

slices/fight_ground was 23.6 MB of PNG on a published site already over PAGES PUBLISH's 260 MB cap
(331 MB before round nine). Measured: the same pictures as LOSSLESS WebP are 4.8 MB, and every visible
pixel decodes back identical (checked file by file, below; transparent pixels may change their hidden
colour, which nobody can see). The new fight reads every file name from fight_ground.json, so the
manifest's src fields move to .webp and the fight's code does not change. Every browser that runs the
game decodes WebP (iOS 14+, Chrome, Firefox, Safari 14+).

Runs on its own over the current folder, and the round-nine builder calls it last, so the folder never
ships PNG again.

    python3 tools/bohemia_combat2_fight_ground_pack_10_2_26.py
"""
import io, json, os, sys
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(REPO, 'slices/fight_ground')
MAN = os.path.join(DIR, 'fight_ground.json')


def pack():
    before = after = 0
    for f in sorted(os.listdir(DIR)):
        if not f.endswith('.png'): continue
        p = os.path.join(DIR, f); im = Image.open(p); im.load()
        q = p[:-4] + '.webp'
        im.save(q, 'WEBP', lossless=True, quality=100, method=6)
        a, b = np.array(im.convert('RGBA')), np.array(Image.open(q).convert('RGBA'))
        vis = a[..., 3] > 0
        if a.shape != b.shape or not (a[vis] == b[vis]).all():
            os.remove(q); sys.exit('REFUSED: %s does not decode back pixel for pixel' % f)
        before += os.path.getsize(p); after += os.path.getsize(q); os.remove(p)
    m = json.load(open(MAN))
    def fix(o):
        if isinstance(o, dict): return {k: (v[:-4] + '.webp' if k == 'src' and isinstance(v, str) and v.endswith('.png') else fix(v)) for k, v in o.items()}
        if isinstance(o, list): return [fix(v) for v in o]
        return o
    m = fix(m); m['format'] = 'lossless webp (round thirteen): every visible pixel identical to the PNG it replaced'
    json.dump(m, open(MAN, 'w'), indent=1)
    names = set(os.listdir(DIR))
    srcs = []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == 'src': srcs.append(v)
                else: walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(m)
    missing = [s for s in set(srcs) if s not in names]
    if missing: sys.exit('REFUSED: the manifest names files that do not exist: %s' % missing[:5])
    if before: print('packed: %.1f MB of PNG -> %.1f MB of lossless WebP' % (before / 1e6, after / 1e6))
    print('ok: %d files named, all present' % len(set(srcs)))


if __name__ == '__main__':
    pack()
