#!/usr/bin/env python3
"""BOHEMIA CITY MAP (7/18/26) — the generated Vegas, seen from above.

Paolo greenlit the city. The overmap generator already lays out the whole
valley per canon (mile grid of arterials, the 215 beltway + I-15/95, the
Strip, Lake Mead, the mountain ring, every landmark). This renders that
96x96 district map as an aerial view, with Paolo's rule applied: every
BUILDABLE plot is DESERT until grown on; only the skeleton — streets,
freeway, rail, water, mountains — is drawn as itself.

This is the city's first look and the base the CITY tab grows from.

Run from repo root: python3 tools/bohemia_city_map.py [px_per_cell]
Output: slices/BOHEMIA_CITY_MAP_PROOF_7_18_26.png
"""
import json
import subprocess
import sys

import numpy as np
from PIL import Image

OUT = 'slices/BOHEMIA_CITY_MAP_PROOF_7_18_26.png'

# district -> skeleton category (anything not listed = a buildable plot = DESERT)
WATER = {'water', 'reservoir', 'reservoirs', 'basin', 'dam', 'intake',
         'watertreat', 'springs', 'lakeLV', 'mead', 'reclaim'}
ROAD = {'arterial'}
FREEWAY = {'freeway', 'interchange', 'exits'}
RAILT = {'rail', 'railyard', 'monorail'}
MOUNT = {'mountain', 'quarry', 'gypsum', 'boulder'}
OPEN = {'desert', 'wash', 'boneyard', 'landfill'}


def overmap():
    js = """
const OM=require('./engine/bohemia_overmap.js');
const m=OM.buildOvermap(12345);
const g=[];for(let y=0;y<m.n;y++){const r=[];for(let x=0;x<m.n;x++)r.push(m.at(x,y).district);g.push(r);}
console.log(JSON.stringify({n:m.n,g}));
"""
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        print('overmap failed: ' + r.stderr[:300]); sys.exit(1)
    return json.loads(r.stdout)


def main():
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    m = overmap()
    n, g = m['n'], m['g']
    rs = np.random.RandomState(20260718)
    C = {
        'sand':    (196, 166, 120),   # buildable plot = empty desert lot
        'road':    (78, 76, 78),      # arterial (the mile grid)
        'freeway': (46, 45, 50),      # freeway / interchange
        'rail':    (66, 56, 46),
        'water':   (64, 92, 96),      # dead-still valley water
        'mount':   (150, 120, 84),    # tan rock ring
        'open':    (186, 158, 116),   # bare desert / wash (a touch paler)
    }

    def cat(d):
        if d in WATER: return 'water'
        if d in ROAD: return 'road'
        if d in FREEWAY: return 'freeway'
        if d in RAILT: return 'rail'
        if d in MOUNT: return 'mount'
        if d in OPEN: return 'open'
        return 'sand'                 # every buildable district = desert lot

    img = np.zeros((n * P, n * P, 3), dtype=np.uint8)
    for y in range(n):
        for x in range(n):
            base = np.array(C[cat(g[y][x])], float)
            # gentle within-category texture (NOT a per-cell shuffle across
            # categories — that would be confetti; this is just grain)
            base = np.clip(base + rs.randint(-8, 9, 3), 0, 255)
            img[y * P:(y + 1) * P, x * P:(x + 1) * P] = base.astype(np.uint8)

    out = Image.fromarray(img)
    out.save(OUT)
    # tally what the skeleton vs plots came out to
    cats = {}
    for row in g:
        for d in row:
            k = cat(d)
            cats[k] = cats.get(k, 0) + 1
    print('city map: %dx%d cells @ %dpx -> %s' % (n, n, P, OUT))
    print('  ' + ', '.join('%s:%d' % kv for kv in sorted(cats.items())))
    return 0


if __name__ == '__main__':
    sys.exit(main())
