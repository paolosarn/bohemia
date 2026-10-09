#!/usr/bin/env python3
"""BOHEMIA — THE BUILT THINGS AS SPRITES FOR THE SETTLEMENT SCREEN (10/9/26, LIFE + CITY, [build on the screen]).

The eight things on the build list (engine/bohemia_lotbuild.js) are drawn ONCE, in the approved street's
own factory (tools/bohemia_the_same_street_three_times_factory.py, LOT_ITEMS and the act items). This
cuts each one OUT of that drawing with no hand on a pixel: the street drawn WITH the thing, minus the
street drawn WITHOUT it, is exactly the thing (and the shadow it throws). Only those pixels are kept,
everything else is transparent, and the cut is scaled up by whole pixels so it is never smoothed.

THE STREET IS DRAWN AT NIGHT and the settlement picture is the day, so the cut is lifted back by the
same factor the street darkened it by (night() multiplies by 0.42), clipped, which is the street's own
colour in daylight; a lit window stays a lit window (it never went through night()).

Each cut is held to a box (`KEEP`) so a thing that also lights windows on a house that is not part of it
(the solar panel, the roof) keeps only itself.

REUSE CHECK: every pixel is the approved street's own panel(); only the cut and the scale are new.
REFERENCE CHECK:
  BLDG-03  one light direction: the street's own (north-lit tops, south shadows), untouched.
  BLDG-05  structural sanity: each thing is cut with its own shadow, so it stands where it is put.
  AH-01    nothing here adds a wrong thing; the settlement picture keeps its own.

Run from repo root:  python3 tools/bohemia_lot_sprites_factory.py
Writes: slices/settlement/lot/<id>.png  (+ lot.json: each sprite's size and where its foot is)
"""
import importlib.util, json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location('street', os.path.join(HERE, 'bohemia_the_same_street_three_times_factory.py'))
street = importlib.util.module_from_spec(spec)
spec.loader.exec_module(street)
OUT = os.path.join(ROOT, 'slices', 'settlement', 'lot')
SCALE = 4
NIGHT = 0.42
DRAWN = {'wall': ['wall'], 'tank': ['tank'], 'shed': ['shed'], 'pump': ['pump'], 'garden': ['garden'],
         'solar': ['array1'], 'stall': ['swap'], 'roof': ['roof']}
KEEP = {'wall': (0, 50, 36, 62), 'roof': (0, 12, 40, 46), 'solar': (0, 12, 60, 64)}   # x0, y0, x1, y1


def main():
    P = street._pal()
    bare = street.panel(P, 1, has=[]).convert('RGB')
    os.makedirs(OUT, exist_ok=True)
    meta = {}
    for k, items in DRAWN.items():
        im = street.panel(P, 1, has=items).convert('RGB')
        W, H = im.size
        x0, y0, x1, y1 = KEEP.get(k, (0, 0, W, H))
        cut = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        a, b, c = bare.load(), im.load(), cut.load()
        n = 0
        for y in range(max(0, y0), min(H, y1)):
            for x in range(max(0, x0), min(W, x1)):
                if a[x, y] != b[x, y]:
                    r, g, bl = b[x, y]
                    lit = max(r, g, bl) > 150   # a lit window or a light: never went through night()
                    if not lit:
                        r, g, bl = (min(255, int(v / NIGHT)) for v in (r, g, bl))
                    c[x, y] = (r, g, bl, 255); n += 1
        if n == 0:
            sys.exit('REFUSING: %s cut to nothing; the street does not draw it.' % k)
        box = cut.getbbox()
        cut = cut.crop(box).resize(((box[2] - box[0]) * SCALE, (box[3] - box[1]) * SCALE), Image.NEAREST)
        cut.save(os.path.join(OUT, k + '.png'))
        meta[k] = {'w': cut.width, 'h': cut.height, 'px': n, 'draft': True}
    json.dump({'_about': 'the eight built things, cut out of the approved street by tools/bohemia_lot_sprites_factory.py',
               'scale': SCALE, 'sprites': meta}, open(os.path.join(OUT, 'lot.json'), 'w'), indent=1)
    for k, v in meta.items():
        print('  %-7s %3d x %3d  (%d pixels of street)' % (k, v['w'], v['h'], v['px']))


if __name__ == '__main__':
    main()
