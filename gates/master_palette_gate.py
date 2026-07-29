#!/usr/bin/env python3
"""
BOHEMIA — MASTER PALETTE GATE (7/29/26)

A law without a machine gate is not enforced, and "one master palette, every family
a subset of it" is exactly the kind of law that rots quietly: one tool writes one
convenient colour that is not in the palette, nothing complains, and six months
later there are six unrelated ramps again — which is the state this work started
from.

SO THIS GATE ASSERTS THE STRUCTURE, NOT THE TASTE. Whether the street should look
like column 2 or column 3 is Paolo's call and no gate has an opinion. What a gate
CAN hold is that the candidate set is actually built the way it claims to be:

  1. EVERY pixel in the candidate bank is a colour that exists in the designed
     palette. Not "close to". In it. This is the whole claim.
  2. The set-wide colour count does not climb back up.
  3. The value bands separate — roof-to-ground by at least 12, which is the M14
     failure this entire exercise exists to fix (it was 6.5).
  4. The light-direction pairs hold: left/top face brighter than right/bottom.
     These passed by luck once already, on a mapping that was wrong.
  5. Act-1 law binds: no pure black, no white, and the void band stays dead dark.
  6. The palette design itself still has a band for HOLES. Leaving it out is what
     turned every doorway on the street into a grey panel, and a comment saying
     "do not remove this" is not a gate.

WHAT THIS GATE DELIBERATELY DOES NOT DO: bless the candidate. The bank is not
approved and is not wired into the game. If Paolo kills it, this gate goes with it.
"""
import base64
import io
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt'
PAL = 'records/target/BOHEMIA_MASTER_PALETTE_DESIGNED.json'

COLOUR_CEILING = 60      # 39 today; this is a ratchet, not a target
ROOF_GROUND_MIN = 12.0   # the M14 fix. It was 6.5 and that was the failure.
FLOOR, CEIL = 17.0, 232.0
VOID_MAX = 60.0          # a hole stays a hole

PAIRS = [('wall_end_l', 'wall_end_r'), ('roof_hipBL', 'roof_hipBR'),
         ('wall_0', 'wall_under_eave'), ('roof_ridge', 'roof_slope'),
         ('roof_hipTL', 'roof_hipTR')]
GROUND = ('road', 'walk', 'yard', 'concrete', 'dirt')

ok = fail = 0


def check(name, cond, detail=''):
    global ok, fail
    if cond:
        ok += 1
    else:
        fail += 1
        print('   FAIL  %s  %s' % (name, detail))


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def main():
    if not os.path.exists(BANK):
        print('   MASTER PALETTE GATE: candidate bank absent, nothing to hold')
        return 0
    pal = json.load(open(PAL))
    legal = set()
    for f in pal['families'].values():
        legal |= {tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) for h in f['hex']}
    for a in pal['accents'].values():
        legal.add(tuple(int(a['hex'][i:i + 2], 16) for i in (1, 3, 5)))

    check('palette_has_a_void_band', 'void' in pal['families'],
          'the band for holes is gone — every doorway will render as a grey panel')

    bank = json.load(open(BANK))
    used, means = set(), {}
    for t in bank['tiles']:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        v = []
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                px = p[x, y]
                if px[3] > 8:
                    used.add(px[:3])
                    v.append(lum(px[:3]))
        means[t['id']] = sum(v) / len(v)
        check('in_palette:%s' % t['id'], not ({p[x, y][:3] for y in range(im.size[1])
                                               for x in range(im.size[0])
                                               if p[x, y][3] > 8} - legal),
              'uses a colour that is not in the master palette')

    check('colour_count', len(used) <= COLOUR_CEILING,
          '%d colours, ceiling %d' % (len(used), COLOUR_CEILING))
    check('no_pure_black', min(lum(c) for c in used) >= FLOOR,
          'darkest is %.0f' % min(lum(c) for c in used))
    check('no_white', max(lum(c) for c in used) <= CEIL,
          'brightest is %.0f' % max(lum(c) for c in used))

    vd = [lum(tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)))
          for h in pal['families']['void']['hex']]
    check('void_stays_dead_dark', max(vd) <= VOID_MAX,
          'void band tops out at %.0f' % max(vd))

    g = [v for k, v in means.items() if k.startswith(GROUND)]
    r = [v for k, v in means.items() if k.startswith('roof')]
    sep = abs(sum(g) / len(g) - sum(r) / len(r))
    check('M14_roof_clears_ground', sep >= ROOF_GROUND_MIN,
          'roof-to-ground separation %.1f, floor %.1f' % (sep, ROOF_GROUND_MIN))

    for a, b in PAIRS:
        check('light_from_upper_left:%s>%s' % (a, b), means[a] > means[b],
              '%.1f vs %.1f' % (means[a], means[b]))

    print('   MASTER PALETTE GATE: %d passed, %d failed  '
          '(%d colours, roof clears ground by %.1f)' % (ok, fail, len(used), sep))
    return 1 if fail else 0


if __name__ == '__main__':
    sys.exit(main())
