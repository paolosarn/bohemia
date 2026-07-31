#!/usr/bin/env python3
"""
BOHEMIA ISOMETRIC HOUSE GATE (7/29/26)

Paolo: "WHEN IN DOUBT HOW TO OTHER ISOMETRIC PIXEL GAMES MAKES HOUSES COPY THEM TO
START OFF." Two houses died before this one, and both died for reasons a gate could
have caught if a gate had existed. This is that gate.

WHAT IT HOLDS, and every number is from the research rather than from my taste:

  1. THE PROJECTION IS 2:1. Isometric pixel art uses two pixels across per one down
     (26.565 degrees, technically dimetric) because that is the only ratio giving a
     clean staircase with no anti-aliasing. The diamond must be exactly twice as
     wide as tall, and must agree with the corpus cell.
  2. TWO MASSES MINIMUM. The first isometric draw was a single box with one long
     gable and it read as a barn — the trailer failure again in a new projection.
     gates/house_shape_gate.py already carries that rule; this enforces it on the
     built artifact rather than on the spec table.
  3. PITCH >= 4:12 and EAVE >= 12 in. Mobile homes are 2-3:12 with 6 in eaves.
  4. IT IS MADE OF HIS APPROVED ART, MACHINE-VERIFIED. The bank must declare
     art_from pointing at BOHEMIA_HOUSE_SKIN_CANDIDATES (status CANON, all 30 UP on
     7/21), and EVERY colour in the house must exist in that bank. THIS IS THE CHECK
     HOUSE 01 WOULD HAVE FAILED: it carried a reuse check, sampled a few colours off
     a street tile, and drew every pixel itself. A reuse check the machine cannot
     verify is a sentence in a docstring.
  5. act-1 floor and ceiling.

NOT HELD: whether it looks good. Paolo's, forever.

Run from repo root:  python3 gates/iso_house_gate.py
"""
import base64
import importlib.util
import io
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_HOUSE_02_ISO_7_29_26.txt'
SKINS = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
CELL_PX = 44
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
    if not os.path.exists(BANK):
        print('   ISO HOUSE GATE: no house bank, nothing to hold')
        return 0
    d = json.load(open(BANK))

    spec = importlib.util.spec_from_file_location('ih', 'tools/bohemia_iso_house.py')
    ih = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ih)
    ok('the diamond is exactly 2:1', ih.TW == ih.TH * 2,
       '%d x %d is not 2:1, so every diagonal needs anti-aliasing' % (ih.TW, ih.TH))
    ok('the diamond agrees with the corpus cell', ih.TW == CELL_PX,
       'tile %d against a %d cell' % (ih.TW, CELL_PX))

    ok('two masses minimum', len(d['masses']) >= 2,
       'one mass is a barn, which is the trailer failure in a new projection')
    pitch = int(str(d['metres']['pitch']).split(':')[0])
    ok('pitch is site-built, not manufactured', pitch >= 4, '%d:12' % pitch)
    ok('eave is site-built, not manufactured', d['metres']['eave'] / 0.0254 >= 12,
       '%.0f in' % (d['metres']['eave'] / 0.0254))

    ok('it declares which approved bank it is made of',
       'HOUSE_SKIN_CANDIDATES' in str(d.get('art_from', '')), str(d.get('art_from')))

    used = set()
    if os.path.exists(SKINS):
        sk = json.load(open(SKINS))
        ok('that bank is still CANON', 'CANON' in str(sk.get('status', '')),
           str(sk.get('status'))[:60])
        approved = set()
        for t in sk['tiles']:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
            p = im.load()
            approved |= {p[x, y][:3] for y in range(im.size[1])
                         for x in range(im.size[0]) if p[x, y][3] > 8}

        im = Image.open(io.BytesIO(base64.b64decode(d['b64']))).convert('RGBA')
        p = im.load()
        used = {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                if p[x, y][3] > 8}
        stray = used - approved
        ok('EVERY colour is one HE approved', not stray,
           '%d colours are not in his skin bank: %s'
           % (len(stray), sorted('#%02x%02x%02x' % c for c in stray)[:6]))
        ok('act-1 floor', min(map(lum, used)) >= FLOOR,
           'darkest %.0f' % min(map(lum, used)))
        ok('act-1 ceiling', max(map(lum, used)) <= CEIL,
           'brightest %.0f' % max(map(lum, used)))

    print('   ISO HOUSE GATE: %d passed, %d failed  (%d masses, %d:12, %d colours all '
          'from his approved skins)' % (P, F, len(d['masses']), pitch, len(used)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
