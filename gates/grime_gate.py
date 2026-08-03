#!/usr/bin/env python3
"""
BOHEMIA — GRIME GATE (8/3/26). THE MACHINE IS BUILT AND THE DIAL IS HELD AT ZERO.

FACTORY LAW: every system gets its own regression gate the same turn. This one is
unusual, because half of what it protects is a DECISION NOT TO BUILD YET.

WHAT HAPPENED. Paolo asked for research on Machine Party. The finding was Klubnika's own
sentence about texturing: he "added dirty and grimy leaks to every corner, which BLENDS
EVERYTHING TOGETHER rather than having different objects." That answers the failure Paolo
named himself on 7/31 -- two different games in one frame. I recommended building it
immediately. He pushed back: "are you absolutely sure we do it now?"

He was half right, and the half he was right about is now law here. A grime pass is TWO
things:
  THE MACHINERY  a render-time layer keyed to world position. Cheap, touches no existing
                 art, invalidates no verdict he has given, one turn.
  THE TUNING     how dirty the world actually is. A whole-world art-direction call.
ONE district type of twenty-seven is finished. Tuning a global look against four percent
of the world means tuning it twice, and it would spend his thumbs on a number that is
guaranteed to change. So the machine landed and THE STRENGTH IS 0.0: the game looks
exactly as it did, and nothing has been surfaced for him to judge.

THIS GATE EXISTS SO THAT STAYS TRUE UNTIL HE RULES. A future session that quietly turns
the dial up has not shipped a feature, it has surfaced unjudged art into the game he plays
-- which STOP PRODUCING bans outright. Raising it is legal only with a recorded ruling.

WHAT IT HOLDS
  ZERO        GRIME_STRENGTH is 0 in the run, and the bank says ships_at 0, unless
              records/ carries a Paolo verdict on the amount
  SHEET       the grime is ONE CONTINUOUS SHEET of several cells, never a 44px tile.
              A mark baked at cell pitch is the 8/2 "glitching out" bug at world scale.
  CROSSES     it actually spans cell boundaries - measured on the pixels, not asserted
  WORLD-KEYED the sample is taken from WORLD position, not from a per-cell hash, or the
              stain would restart at every cell and the whole point would be lost
  PIXEL-TRUE  a whole 44x44 source window to an integer destination: no resample, no
              smoothing, no screen-space filter. The no-resample law applies to dirt.
  ORDER       drawn after every world surface and BEFORE the cast. Dirt is on the world,
              not on the people standing in it.
  PURE        no purple (PURPLE RESERVATION), desert neutrals only
  ROUGH       the filth is not a smooth wash. A soft gradient over textured art reads as
              a lens filter sitting ON the world instead of dirt IN it.
  SOURCED     the cook cites the research file and Klubnika's actual sentence

  python3 gates/grime_gate.py
"""
import base64
import colorsys
import io
import json
import os
import statistics as st
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

BANK = 'banks/BOHEMIA_GRIME_8_3_26.txt'
COOK = 'tools/bohemia_grime_cook.py'
RUN = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'
BUILT = 'slices/BOHEMIA_RUN_CURRENT.html'
BUILDER = 'tools/build_run_slice.js'
RESEARCH = 'records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md'
RECORDS = 'records'
CELL = 44

FAILS, PASSES = [], []


def ck(name, ok, why=''):
    (PASSES if ok else FAILS).append(name)
    print(('  ok   ' if ok else '  FAIL ') + name + (('  -- ' + why) if why and not ok else ''))


def main():
    bank = json.load(open(BANK))
    cook = open(COOK, encoding='utf8').read()
    src = open(RUN, encoding='utf8').read()
    builder = open(BUILDER, encoding='utf8').read()
    im = Image.open(io.BytesIO(base64.b64decode(bank['b64']))).convert('RGBA')
    a = im.split()[3]
    w, h = im.size

    print('GRIME GATE')

    # ---- THE DIAL IS ZERO UNTIL HE RULES ON IT
    ruled = any('GRIME' in f.upper() and 'VERDICT' in f.upper()
                for f in os.listdir(RECORDS))
    ck('the bank declares it ships at zero', bank.get('ships_at') == 0 or ruled,
       'ships_at=%r with no recorded verdict' % bank.get('ships_at'))
    ck('the run draws it at strength 0', 'var GRIME_STRENGTH = 0.0;' in src or ruled,
       'the dial moved with no verdict in records/')
    ck('the builder REFUSES a non-zero bank',
       "grime.ships_at !== 0" in builder and 'ZERO until Paolo rules' in builder)
    ck('the bank says in writing WHY it is zero', 'why_zero' in bank
       and 'twenty-seven' in bank['why_zero'])

    # ---- A SHEET, NOT A TILE. This is the 8/2 bug at world scale if it gets it wrong.
    cells = bank.get('patch_cells', 0)
    ck('the grime is a SHEET of several cells, never a 44px tile', cells >= 4,
       'patch_cells=%r' % cells)
    ck('the sheet is a whole number of cells', w == cells * CELL and h == cells * CELL,
       '%dx%d for %d cells' % (w, h, cells))
    ck('the cook says why baking into a tile is forbidden',
       'repeats at cell pitch' in cook and 'glitching out' in cook)

    # ---- IT REALLY CROSSES CELL BOUNDARIES. Measured, not asserted: if the sheet were
    # secretly cell-independent, alpha would drop toward the internal cell edges.
    crossed = 0
    for c in range(1, cells):
        x = c * CELL
        col_in = st.mean([a.getpixel((x - 1, y)) for y in range(h)])
        col_out = st.mean([a.getpixel((x, y)) for y in range(h)])
        if col_in > 4 and col_out > 4 and abs(col_in - col_out) < max(col_in, col_out) * 0.6:
            crossed += 1
    ck('the filth actually continues across the internal cell edges',
       crossed >= cells - 2, 'only %d of %d internal edges carry through' % (crossed, cells - 1))

    # ---- WORLD-KEYED, not a per-cell shuffle. A hash per cell restarts every stain.
    ck('the run samples the sheet by WORLD position',
       '_wx=px+_gx' in src and '_wx%GRIME_CELLS' in src)
    ck('the run does NOT pick a grime tile with a per-cell hash',
       'perimVar(gx,gy,' not in src.split('GRIME_STRENGTH')[-1].split('doorDraws')[0])

    # ---- PIXEL-TRUE. No filter, no smoothing, no fractional blit.
    ck('a whole 44x44 source window to an integer destination cell',
       'ctx.drawImage(GRIME_IMG,_sx,_sy,ART_PX,ART_PX,' in src)
    ck('no screen-space filter is used anywhere for it',
       'ctx.filter' not in src)

    # ---- ORDER: after the world, before the people
    i_g = src.index('GRIME_STRENGTH')
    ck('drawn AFTER every world surface', src.index('doorDraws.push(') < i_g)
    ck('drawn BEFORE the cast, because dirt is on the world not on people',
       i_g < src.index('EVERY BODY, PAINTER-SORTED'))

    # ---- PURE: no purple outside the Amalgamation
    px = [p for p in im.convert('RGBA').getdata() if p[3] > 8]
    purple = 0
    for r, g, b, _al in px:
        hh, ss, _v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        if 0.70 <= hh <= 0.86 and ss > 0.18:
            purple += 1
    ck('no purple in the filth (PURPLE RESERVATION)', purple == 0,
       '%d purple pixels' % purple)

    # ---- ROUGH, not a smooth wash. A gradient over textured art is a lens filter.
    vals = [a.getpixel((x, y)) for y in range(0, h, 3) for x in range(0, w, 3)]
    nz = [v for v in vals if v > 0]
    ck('the filth carries real alpha variation, not a flat wash',
       nz and st.pstdev(nz) > 12, 'sd %.1f' % (st.pstdev(nz) if nz else 0))
    ck('the cook says why smooth dirt is wrong', 'lens filter' in cook)

    # ---- NOT A VIGNETTE: a vignette is dark at the edges and clear in the middle
    mid = st.mean([a.getpixel((x, y)) for y in range(h // 3, 2 * h // 3)
                   for x in range(w // 3, 2 * w // 3)])
    rim = st.mean([a.getpixel((x, y)) for y in range(h) for x in range(w)
                   if x < w // 8 or x > 7 * w // 8 or y < h // 8 or y > 7 * h // 8])
    ck('it is dirt on the world, not a vignette', rim < mid * 1.8,
       'rim %.1f vs middle %.1f' % (rim, mid))

    # ---- SOURCED
    ck('the cook cites the research file', RESEARCH.split('/')[-1] in cook)
    ck('the cook quotes the actual sentence it is built on',
       'blends everything together' in cook.lower())
    ck('the research file exists', os.path.exists(RESEARCH))
    ck('the cook documents a REUSE CHECK that opens his purchased library',
       'REUSE CHECK' in cook and 'BOHEMIA_GROUND_SEAMLESS_SET' in cook)

    # ---- SHIPPED BYTES ARE THE COOKED BYTES
    built = open(BUILT, encoding='utf8').read()
    ck('the shipped run carries the cooked sheet', bank['b64'][:120] in built)

    print('\n%d/%d' % (len(PASSES), len(PASSES) + len(FAILS)))
    if FAILS:
        print('FAILED: ' + ', '.join(FAILS))
        sys.exit(1)


if __name__ == '__main__':
    main()
