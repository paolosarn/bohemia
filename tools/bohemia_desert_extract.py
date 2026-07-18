#!/usr/bin/env python3
"""BOHEMIA DESERT POOL EXTRACTOR (7/18/26)

The world outside dead Vegas is the Mojave. The engine already generates
desert blocks (ground='desert' + rock/rubble/scorch props, no pending art),
and the art all exists in the corpus. This derives a small desert pool so
the baker can render the wasteland:

  - GROUND: the SEAMLESS-CERTIFIED soil/sand tiles (BOHEMIA_GROUND_SEAMLESS
    _SET flagged pack "2. Soil and dirt tiles" as tiling clean — a big open
    desert MUST tile without a grid, so only the certified ones qualify)
  - rock:   HD "Rocks and stones" (45-view boulders)
  - rubble: HD "Rubble and debris"

Corpus art, no new canon. Run from repo root:
  python3 tools/bohemia_desert_extract.py
"""
import json
import sys

OUT = 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt'


def hd_tile(fileref, idx, pack):
    d = json.load(open('banks/' + fileref))
    return d['packs'][pack][idx]['b64']


def main():
    seam = json.load(open('banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'))
    soil = [e for e in seam['tiles'] if e['pack'] == '2. Soil and dirt tiles']
    if not soil:
        print('DESERT EXTRACTOR REFUSES: no seamless soil tiles'); return 1
    ground = []
    for e in soil:
        try:
            ground.append(hd_tile(e['file'], e['idx'], e['pack']))
        except Exception as ex:
            print('  skip soil %s#%d: %s' % (e['file'], e['idx'], ex))
    d2 = json.load(open('banks/BOHEMIA_HD_TILE_REPO_part2.txt'))
    rocks = [x['b64'] for x in d2['packs']['Rocks and stones'][:24]]
    rubble = [x['b64'] for x in d2['packs']['9. Rubble and debris'][:12]]
    if len(ground) < 3 or not rocks or not rubble:
        print('DESERT EXTRACTOR REFUSES: pools too thin (%d/%d/%d)'
              % (len(ground), len(rocks), len(rubble))); return 1
    out = {
        'version': 'BOHEMIA_DESERT_POOLS_v1', 'date': '2026-07-18',
        'provenance': {
            'ground': 'GROUND_SEAMLESS_SET certified "2. Soil and dirt tiles" '
                      '(only the tiles that pass the no-grid seam test)',
            'rock': 'HD "Rocks and stones" (45-view boulders)',
            'rubble': 'HD "9. Rubble and debris"',
        },
        'note': 'the Mojave floor for the baker; corpus art, no new canon.',
        'ground': ground, 'rock': rocks, 'rubble': rubble,
    }
    json.dump(out, open(OUT, 'w'))
    print('desert pools: %d ground (seamless) + %d rock + %d rubble -> %s'
          % (len(ground), len(rocks), len(rubble), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
