#!/usr/bin/env python3
"""
EMIT THE STREET FURNITURE INTO A SIBLING FILE, NOT INTO THE PAGE.
(8/21, WORLD lane.)

The bank is 352 KB of base64 and the city page is 2.2 MB, so inlining it grows the one file
every session rewrites by 16% for art that never changes. That exact mistake already has a
ruling: 8/6, the repo budget gate caught this page carrying 27 MB of tile art it never
edits, and TP_TILES + HERO_SRC were moved out to slices/BOHEMIA_CITY_TILES.js with a plain
script tag. This follows that precedent instead of re-learning it.

slices/ is published wholesale by _config.yml, so a new sibling needs no config change --
but the script tag and this file are now a PAIR, and props_gate.js binds them so neither
can drift.

FOOTPRINTS ARE DECLARED HERE, PER FAMILY, IN CELLS. A sprite's pixel size cannot tell you
how big the object is in the world: every one of these masters is capped at 96px, so a
traffic cone and a dumpster arrive the same height and would stand the same height. The
numbers below are what the object IS -- a cone is knee-high and a lamp is three cells --
and `rise` is how far above its footing cell it reaches, which is what makes a standing
prop occlude what is behind it (the standing set's own render rule).

REUSE CHECK: cooks no pixels and opens no new bank. It re-packages
banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt, which is itself shopped from the corpus.

  python3 tools/bohemia_city_props_emit.py
"""
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt'
OUT = 'slices/BOHEMIA_CITY_PROPS.js'

# family -> [width in cells, height in cells, rise above the footing cell in cells]
FOOTPRINT = {
    'lamp':      [1.50, 3.00, 2.00],   # unchanged: what the shipped lamp already draws at
    'bin':       [0.90, 1.30, 0.45],
    'bag':       [0.90, 0.90, 0.15],
    'barrel':    [0.90, 1.30, 0.45],
    'bollard':   [0.80, 1.20, 0.40],
    'cone':      [0.80, 1.00, 0.25],
    'tyre':      [1.00, 0.80, 0.10],
    'pallet':    [1.10, 0.70, 0.05],
    'bench':     [1.50, 1.10, 0.30],
    'barricade': [1.50, 1.20, 0.35],
    'dumpster':  [1.60, 1.30, 0.40],
    'mailbox':   [0.90, 1.30, 0.45],
    # A CAR IS NOT A STANDING PROP. These masters are TOP-DOWN, so a car lies flat in its
    # footprint: rise 0, no occlusion, a thing on the ground rather than a thing you walk
    # behind. 2 x 4 cells is 1.5 m x 3 m at TILE=0.75, and it is what the districts author
    # (measured: 10 of 12 in commercial, 39 of 40 in downtown, 19 of 22 in the mall). The
    # draw overrides these with the blob's real extent when it has one.
    'car':       [2.00, 4.00, 0.00],
    'firebarrel':[0.90, 1.30, 0.45],
}

if not os.path.exists(BANK):
    sys.exit('PROPS EMIT: %s is not here. Run tools/bohemia_street_furniture_cook.py first.' % BANK)
bank = json.load(open(BANK, encoding='utf-8'))
fams = bank['families']

missing = [f for f in fams if f not in FOOTPRINT]
if missing:
    sys.exit('PROPS EMIT: no footprint declared for %s. A family without a size would draw '
             'at whatever its 96px master happens to be, which is how a traffic cone ends up '
             'as tall as a dumpster.' % ', '.join(sorted(missing)))

lines = [
    '/* BOHEMIA CITY PROPS -- the street furniture bank, emitted by',
    '   tools/bohemia_city_props_emit.py from banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt.',
    '   SHOPPED, NOT COOKED: corpus art out of the HD tile repo, vetted by measuring pixels',
    '   against PURPLE RESERVATION and ACT ONE ONLY. Lives beside the page rather than inside',
    '   it for the same reason TP_TILES does (8/6, repo budget): the page is rewritten daily',
    '   and this art never changes.',
    '   PROP_FP is [width, height, rise] IN CELLS. A 96px master cannot tell you how big a',
    '   thing is in the world; a cone is knee-high and a lamp is three cells, and that is a',
    '   fact about the object, not about the file. */',
    # LAMP IS ALWAYS DECLARED even though its art is not in this bank -- it lives in the
    # page as LAMP_B64 (Paolo's approved V11 bodies). Without a row here its size fell
    # through to a default buried in the draw call, so the footprint of the one prop he has
    # already seen was the only one nothing could check. props_gate.js pins it.
    'const PROP_FP = %s;' % json.dumps(
        dict({f: FOOTPRINT[f] for f in sorted(fams)}, lamp=FOOTPRINT['lamp'])),
    'const PROP_B64 = {',
]
for f in sorted(fams):
    lines.append('  %s: [' % json.dumps(f))
    for o in fams[f]:
        lines.append('    "%s",' % o['b64'])
    lines.append('  ],')
lines.append('};')
open(OUT, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')

n = sum(len(v) for v in fams.values())
print('PROPS EMIT -> %s' % OUT)
print('  %d objects across %d families, %.0f KB' % (n, len(fams), os.path.getsize(OUT) / 1024))
print('  families: %s' % ', '.join('%s x%d' % (f, len(fams[f])) for f in sorted(fams)))
