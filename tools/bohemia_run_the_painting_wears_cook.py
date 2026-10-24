#!/usr/bin/env python3
"""THE PAINTING WEARS COOK'S COLOUR (RUN 10/24/26, row [the painting wears COOK's colour], rules 137(b)(c), 142(c)).

The map he plays is the painting (vbCityCore in slices/BOHEMIA_CITY_WORLD.html) at every zoom since BUILD 10/24h, and COOK's
colour remake lives in COOK's dials (banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json: the palette by name, the themes, which
district wears which theme). The site publishes records/target, not banks/, so this copies the part of the dials the painting
reads, unchanged, to records/target/cook_map_colour/painting_dials.json. COOK turns a dial, runs this, and the map wears it:
no code moves.

    python3 tools/bohemia_run_the_painting_wears_cook.py          # write
    python3 tools/bohemia_run_the_painting_wears_cook.py --check  # exit 1 when the copy is not the bank's
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json')
OUT = os.path.join(ROOT, 'records/target/cook_map_colour/painting_dials.json')
KEEP_THEME = ('ground', 'ground_more', 'roof', 'wall', 'bands', 'fields', 'rock', 'water')


def made():
    d = json.load(open(BANK))
    return {
        '_what': 'COPIED by tools/bohemia_run_the_painting_wears_cook.py from banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json '
                 '(COOK\'s dials; edit THOSE, then run the tool). The painting (the map at every zoom) reads it.',
        'era': d.get('era'),
        'dust': d.get('dust'),
        'palette': d['palette'],
        'themes': {k: {kk: v[kk] for kk in KEEP_THEME if kk in v} for k, v in d['themes'].items()},
        'district_theme': d['district_theme'],
    }


def main():
    want = json.dumps(made(), indent=1, sort_keys=True) + '\n'
    if '--check' in sys.argv:
        have = open(OUT).read() if os.path.exists(OUT) else ''
        if have != want:
            print('THE PAINTING\'S DIALS ARE NOT COOK\'S: run python3 tools/bohemia_run_the_painting_wears_cook.py')
            sys.exit(1)
        print('the painting\'s dials are COOK\'s')
        return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(want)
    print('wrote ' + os.path.relpath(OUT, ROOT) + ' (' + str(len(want)) + ' bytes)')


if __name__ == '__main__':
    main()
