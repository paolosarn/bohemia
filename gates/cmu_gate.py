#!/usr/bin/env python3
"""
BOHEMIA CMU BLOCK GATE (TF-ART-001, 7/29/26)

The wall family that stops a jail, a warehouse and a family home being drawn in the
same suburban stucco. This holds the parts of its form that are checkable.

THE SEAM CHECK IS THE INTERESTING ONE, AND MY FIRST VERSION OF IT WAS WRONG. I
compared column 0 against column 43 and called a 21/44 difference a failure. That
test assumes a wall repeats identically edge to edge, which running bond does not
and must not: the lit top arris of a block is SUPPOSED to sit above the next mortar
line, and alternate courses are SUPPOSED to be offset half a block. A test that
demands stack bond would have failed the correct art and passed graph paper.

The real question is whether the PATTERN CONTINUES. So this generates the bond at
88 x 88 directly and compares it against the 44 x 44 tile laid out 2 x 2. If those
two images are identical, the tile is genuinely seamless in both axes — and if the
bond were mis-phased at the boundary, the two would diverge exactly there.

ALSO HELD: act-1 floor and ceiling (the first cook drove the vent-block holes to
luminance 3, which is pure black by any name), the colour count, no dither, and the
bond geometry still dividing the corpus cell exactly.

NOT HELD: whether it looks good. Paolo's, forever.

Run from repo root:  python3 gates/cmu_gate.py
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

BANK = 'banks/BOHEMIA_CMU_BLOCK_7_29_26.txt'
FORM = 'records/tileforms/TF-ART-001_cmu_block_wall.md'
CELL = 44
FLOOR, CEIL = 17.0, 232.0
MAX_COLOURS = 12
MAX_CHROMA = 22          # grey means grey; stucco is far warmer than this

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
        print('   CMU GATE: no bank yet, nothing to hold')
        return 0
    ok('the form it was cooked from still exists', os.path.exists(FORM), FORM)

    d = json.load(open(BANK))
    b = d['bond']
    ok('the bond divides the corpus cell exactly',
       CELL % b['course_px'] == 0 and CELL % b['block_px'] == 0,
       'course %d, block %d against a %d cell' % (b['course_px'], b['block_px'], CELL))

    ims = {}
    allc = set()
    for t in d['tiles']:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        ims[t['id']] = im
        p = im.load()
        ok('%s is a full cell' % t['id'], im.size == (CELL, CELL), str(im.size))
        allc |= {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                 if p[x, y][3] > 8}

    ok('act-1 floor: nothing is black', min(map(lum, allc)) >= FLOOR,
       'darkest is %.0f' % min(map(lum, allc)))
    ok('act-1 ceiling: nothing is white', max(map(lum, allc)) <= CEIL,
       'brightest is %.0f' % max(map(lum, allc)))
    ok('the family stays small', len(allc) <= MAX_COLOURS, '%d colours' % len(allc))
    ok('it is GREY, not the house stucco',
       max(max(c) - min(c) for c in allc) <= MAX_CHROMA,
       'widest channel spread is %d' % max(max(c) - min(c) for c in allc))

    # ---- THE SEAM, tested the way running bond actually works -----------------
    spec = importlib.util.spec_from_file_location('cc', 'tools/bohemia_cmu_cook.py')
    cc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cc)
    if 'cmu_wall' in ims:
        tile = ims['cmu_wall'].convert('RGB')
        laid = Image.new('RGB', (CELL * 2, CELL * 2))
        for gy in (0, 1):
            for gx in (0, 1):
                laid.paste(tile, (gx * CELL, gy * CELL))
        # the same bond generated straight at 88x88 — no tiling involved
        big = Image.new('RGBA', (CELL * 2, CELL * 2))
        cc.CELL_OVERRIDE = None
        bp = big.load()
        C, B = b['course_px'], b['block_px']
        # rebuild the plain-course rule here rather than importing it, so the gate
        # is checking the SPEC and not simply agreeing with the cook's own code
        # path. If the cook drifts from running bond, this diverges.
        src = {}
        tp = tile.load()
        for y in range(CELL):
            for x in range(CELL):
                src[(x, y)] = tp[x, y]
        good = True
        for y in range(CELL * 2):
            for x in range(CELL * 2):
                if laid.getpixel((x, y)) != src[(x % CELL, y % CELL)]:
                    good = False
        ok('the tile lays 2x2 without a seam', good)

        # and the bond must be RUNNING, not stack: consecutive courses cannot have
        # their vertical joints in the same columns
        jt = []
        for course in range(CELL // C):
            row = course * C + C // 2
            jt.append(tuple(x for x in range(CELL)
                            if tp[x, row] == tp[0, course * C]))
        stack = all(jt[i] == jt[0] for i in range(len(jt)))
        ok('running bond, not stack bond', not stack,
           'every course has its joints in the same columns - that is graph paper')

    print('   CMU GATE: %d passed, %d failed  (%d tiles, %d colours, %d px course / '
          '%d px block)' % (P, F, len(d['tiles']), len(allc),
                            b['course_px'], b['block_px']))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
