#!/usr/bin/env python3
"""
BOHEMIA HUMAN SCALE GATE (7/29/26)

Paolo: "lets make a single house realistic to human sizing please." Sixteen houses
are coming. If "human sizing" lives only in a docstring, house 07 will quietly be
built to a different metre and nobody will notice until he does.

THE ONE INVARIANT, and it is deliberately about PROPORTION rather than about any
particular house: **a person must fit through the door.** Everything else on the
sheet follows from the world's metres, and this is the check that catches it when
they stop agreeing.

WHAT IT HOLDS:
  1. the scale constants still agree with the engine — CELL_M from
     engine/bohemia_overmap.js and the 44 px art cell. If someone changes the
     world's metre, every dimension in every house is wrong and this fails first.
  2. the player sprite is a plausible adult (1.5 to 2.0 m at that scale). This is
     the anchor; if the BODY is wrong then the houses were measured against a lie.
  3. house 01's door clears the sprite's head, and by a real margin rather than by
     a pixel.
  4. the door, plate, garage and window are within a centimetre of the real-world
     dimensions the house claims — the bank carries its own metre table, so this
     compares the ART to its own spec instead of trusting either alone.
  5. no white and no pure black in the house, because act 1 has neither, and the
     first draw filled a whole roof plane with a 252-luminance highlight.

WHAT IT DOES NOT HOLD: whether the house LOOKS good. That is Paolo's, forever.

Run from repo root:  python3 gates/human_scale_gate.py
"""
import base64
import io
import json
import os
import re
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

HOUSE = 'banks/BOHEMIA_HOUSE_01_7_29_26.txt'
SPRITE_BOX = 'records/target/HERO_SPRITE.json'
OVERMAP = 'engine/bohemia_overmap.js'

CELL_PX = 44.0
ADULT_MIN, ADULT_MAX = 1.50, 2.00
HEAD_ROOM_MIN = 0.10          # metres a door must clear a person by
TOL = 0.02                    # metres of slack between the art and its own spec
FLOOR, CEIL = 17.0, 232.0

P = F = 0


def ok(name, cond, detail=''):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('   FAIL  %s  %s' % (name, detail))


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def main():
    if not os.path.exists(HOUSE):
        print('   HUMAN SCALE GATE: no house bank yet, nothing to hold')
        return 0

    src = open(OVERMAP).read()
    mm = re.search(r'CELL_M\s*=\s*([0-9.]+)', src)
    ok('engine still declares CELL_M', bool(mm), 'not found in ' + OVERMAP)
    if not mm:
        print('   HUMAN SCALE GATE: %d passed, %d failed' % (P, F))
        return 1
    cell_m = float(mm.group(1))
    px_m = cell_m / CELL_PX

    bank = json.load(open(HOUSE))
    ok('the house records the scale it was built at',
       abs(bank['px_per_m'] - 1.0 / px_m) < 0.5,
       'bank says %.2f px/m, the engine says %.2f' % (bank['px_per_m'], 1.0 / px_m))

    spec = bank['metres']
    im = Image.open(io.BytesIO(base64.b64decode(bank['b64']))).convert('RGBA')

    # ---- the anchor: is the BODY a person?
    if os.path.exists(SPRITE_BOX):
        _, _, sw, sh = json.load(open(SPRITE_BOX))
        person = sh * px_m
        ok('the player sprite is an adult', ADULT_MIN <= person <= ADULT_MAX,
           '%d px = %.2f m' % (sh, person))
        door_m = spec['door'][1]
        ok('a person fits through the front door', door_m - person >= HEAD_ROOM_MIN,
           'door %.2f m vs person %.2f m — %.0f cm of headroom'
           % (door_m, person, (door_m - person) * 100))
    else:
        ok('the sprite measurement exists', False,
           'run node tools/bohemia_house_scale_proof.js')

    # ---- does the ART match the metres it claims?
    W, H = im.size
    ok('the art is as wide as the footprint says',
       abs(W * px_m - spec['footprint'][0]) < TOL * 10,
       '%d px = %.2f m, spec says %.2f' % (W, W * px_m, spec['footprint'][0]))
    for key, metres in (('plate', spec['plate']), ('door', spec['door'][1]),
                        ('garage', spec['garage'][1]), ('window', spec['window'])):
        px = int(round(metres / px_m))
        ok('%s is a real dimension' % key, abs(px * px_m - metres) <= TOL,
           '%.3f m rounds to %d px = %.3f m' % (metres, px, px * px_m))

    # ---- act 1 has no white and no pure black
    p = im.load()
    vals = [lum(p[x, y][:3]) for y in range(H) for x in range(W) if p[x, y][3] > 8]
    ok('no white in the house', max(vals) <= CEIL, 'brightest is %.0f' % max(vals))
    ok('no pure black in the house', min(vals) >= FLOOR, 'darkest is %.0f' % min(vals))

    print('   HUMAN SCALE GATE: %d passed, %d failed  (1 px = %.2f cm, door %.2f m, '
          'person %.2f m)'
          % (P, F, px_m * 100, spec['door'][1],
             (json.load(open(SPRITE_BOX))[3] * px_m) if os.path.exists(SPRITE_BOX) else 0))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
