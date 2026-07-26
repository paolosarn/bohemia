#!/usr/bin/env python3
"""BOHEMIA STREET PROP POOL EXTRACTOR (7/18/26)

The bake factory needs car wrecks + fire barrels. Their art already lives
in the corpus:
  - HD_TILE_REPO part2 pack "10. Abandoned cars": 20 TOP-DOWN wrecks (the
    same family the chat-era V11 bake used — the white cars in V11's DAY
    image are this style)
  - DEMO_PROP_POOL pack "18. Light sources and fire barrels": the burn
    barrels (indices 16-27; 0-15 are pole lamps/lanterns, 28+ are propane
    tanks — not barrels)

This extracts JUST those into a small derived bank so the baker never has
to load the multi-MB HD repo. Provenance recorded; contents are corpus
art, not new canon.

Run from repo root: python3 tools/bohemia_street_prop_extract.py
"""
import json
import sys

OUT = 'banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt'


def main():
    d2 = json.load(open('banks/BOHEMIA_HD_TILE_REPO_part2.txt'))
    cars = [e['b64'] for e in d2['packs']['10. Abandoned cars']]
    prop = json.load(open('banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt'))
    pack = [p for p in prop['props']
            if p.get('pack') == '18. Light sources and fire barrels']
    barrels = [p['b64'] for p in pack[16:28]]
    if len(cars) != 20 or len(barrels) != 12:
        print('EXTRACTOR REFUSES: expected 20 cars + 12 barrels, got %d + %d'
              % (len(cars), len(barrels)))
        return 1
    out = {
        'version': 'BOHEMIA_STREET_PROP_POOLS_v1', 'date': '2026-07-18',
        'provenance': {
            'car_wreck': 'HD_TILE_REPO part2 / "10. Abandoned cars" (top-down, '
                         'the V11 bake family)',
            'fire_barrel': 'DEMO_PROP_POOL / "18. Light sources and fire '
                           'barrels" indices 16-27 (the burn barrels; lamps '
                           'and tanks excluded)',
        },
        'note': 'derived pool for the bake factory; corpus art, no new canon.',
        'car_wreck': cars,
        'fire_barrel': barrels,
    }
    json.dump(out, open(OUT, 'w'))
    print('extracted %d cars + %d barrels -> %s' % (len(cars), len(barrels), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
