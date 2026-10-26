#!/usr/bin/env python3
"""THE STREET UNDER THE MAP (RUN 10/26, row [the map zooms in to the street], rule 258(b)(d)).

PAOLO 10/26: 'I want the zoom to zoom in a lot more, even on the main map... almost like I'm on the combat map, or maybe use assets
of the combat map... you feel like you're actually watching your team walk through the city.'

MEASURED: the fight's ground is COMBAT TWO's painted blocks (slices/fight_ground, fight-ground-10-2): 35 blocks of the present day,
each 2575 x 1820 (five house tiles a side, a tile 12 m, 515 x 364 art px), 18.7 MB each once decoded. The map's close end can not
hold even three of those (rule 173: 35 MB of canvas headroom on his phone). The fight deals a district's own 3 x 4 layout of
blocks (fight_ground.json 'districts', 78 of the map's district names, and 'boards' for the nine kinds).

THIS MAKES THE SAME PICTURES SMALLER, NOTHING REDRAWN: each present-day block at four widths (160, 320, 640, 1288 px, the height in
the block's own proportion), so the map streams only the width the glass needs around the crew; and one small index with the
fight's own district and board layouts, so the map never fetches the fight's 1 MB index. slices/street_ground/.

Run: python3 tools/bohemia_run_the_street_ground.py   (re-run when COMBAT re-renders its blocks)
"""
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'slices', 'fight_ground')
OUT = os.path.join(ROOT, 'slices', 'street_ground')
WIDTHS = [160, 320, 640, 1288]


def main():
    fg = json.load(open(os.path.join(SRC, 'fight_ground.json')))
    os.makedirs(OUT, exist_ok=True)
    ids = sorted(fg['blocks'].keys())
    sizes = {}
    total = 0
    for bid in ids:
        src = Image.open(os.path.join(SRC, fg['blocks'][bid]['src'])).convert('RGB')
        W, H = src.size
        for w in WIDTHS:
            h = round(w * H / W)
            im = src.resize((w, h), Image.LANCZOS)
            name = '%s_%d.webp' % (bid.replace('.', '_'), w)
            p = os.path.join(OUT, name)
            im.save(p, 'WEBP', quality=86, method=6)
            total += os.path.getsize(p)
            sizes.setdefault(bid, {})[w] = [w, h]
    lay = lambda T: {k: v['blocks'] for k, v in T.items()}
    meta = {
        'what': "RUN [the map zooms in to the street] 10/26 (rule 258): the fight's own ground (COMBAT TWO's blocks, present day) at four "
                "widths for the map's close end, and the fight's own district and board layouts; nothing redrawn",
        'src': 'slices/fight_ground/fight_ground.json (' + fg.get('version', '') + ')',
        'tool': 'tools/bohemia_run_the_street_ground.py',
        'widths': WIDTHS,
        'aspect': [fg['tile_px'][0] * fg['block_tiles'], fg['tile_px'][1] * fg['block_tiles']],
        'block_tiles': fg['block_tiles'], 'tile_metres': fg['tile_metres'],
        'per_map_block': 6,
        'per_map_block_why': 'a map block is 384 m (records/BOHEMIA_CANON_CONSTANTS.md, WORLD ONE RULER); a fight block 60 m; six a side, '
                             'drawn at 64 m (6.7% wider than the fight draws it)',
        'blocks': ids,
        'file': '{id}_{w}.webp with the dot in the id as an underscore',
        'districts': lay(fg['districts']),
        'boards': lay(fg['boards']),
        'kinds': {k: v['kind'] for k, v in fg['districts'].items()},
    }
    json.dump(meta, open(os.path.join(OUT, 'street_ground.json'), 'w'), separators=(',', ':'))
    print('wrote', len(ids) * len(WIDTHS), 'pictures', round(total / 1e6, 2), 'MB on disk; index', os.path.getsize(os.path.join(OUT, 'street_ground.json')), 'bytes')


if __name__ == '__main__':
    main()
