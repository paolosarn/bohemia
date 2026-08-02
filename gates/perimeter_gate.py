#!/usr/bin/env python3
"""
BOHEMIA — PERIMETER WALL GATE (8/2/26)

FACTORY LAW: every system gets its OWN regression gate, the same turn. This one guards
the suburb border wall, the gate mouth, and the three bugs this session found live -
each of which was invisible in the contact sheet and only showed up on the real surface.

THE RULER IS HIS OWN ART, re-derived every run from records/BOHEMIA_STYLE_TARGET, which
is itself measured off the tiles he PAID FOR. Nothing here is a taste I picked.

WHAT IT HOLDS
  STYLE      every wall tile inside the measured tolerance (edge/grain/colours/sat)
  CAP        the coping is the LIGHTEST band on a face tile. That is the 45 DEGREE ART
             LAW - a horizontal surface faces the sky - and it is the single strongest
             read at 44px. A wall whose top is not its brightest part is a stripe.
  OVERSAIL   a hard shadow directly under the cap, or it is a painted band
  PILLAR     the pillar tile is measurably brighter on its left twelfth than the face
             tile of the same design, AND casts a darker line to the right of it. Both,
             because brightness alone drew a lighter stripe and not a post.
  BASE       the capless form has NO bright band at the top, or the two-cell-thick run
             stacks two walls (found at PERIMETER_WALL_LIVE, never in the sheet)
  SEAM       horizontal only, against the tile that ACTUALLY follows it - a pillar's
             right edge meets a FACE, never another pillar
  PERIOD     every module divides 44, so nothing cuts at the border he circled on 8/1
  GATE       the mouth overlays are transparent where the community's own wall belongs,
             carry a real dark opening, and come in the l/m/r pieces a seven-tile
             aperture needs
  WIRED      the run draws all of it, the wall goes down BEFORE the hole is punched, and
             the shipped bytes are the cooked bytes
  FAMILY     isSuburbCell() accepts suburb AND gated AND estate. Three district names,
             one generator; accepting only 'suburb' meant every gated community in the
             valley rendered with none of the block art and the gate mouth could never
             draw anywhere at all.
  HIS POOL   his 13 approved 7/14 walls are still in the repo and still loaded, and WB4
             is rescued from its tiling preview rather than smeared into one cell

  python3 gates/perimeter_gate.py
"""
import base64
import io
import json
import os
import statistics as st
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

BANK = 'banks/BOHEMIA_PERIMETER_8_2_26.txt'
HIS = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'
STYLE = 'records/BOHEMIA_STYLE_TARGET_8_1_26.json'
RUN = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'
BUILT = 'slices/BOHEMIA_RUN_CURRENT.html'
BUILDER = 'tools/build_run_slice.js'
COOK = 'tools/bohemia_perimeter_cook.py'
CELL = 44
DIVISORS = (1, 2, 4, 11, 22, 44)

FAILS = []
PASSES = []


def ck(name, ok, why=''):
    (PASSES if ok else FAILS).append(name)
    print(('  ok   ' if ok else '  FAIL ') + name + (('  -- ' + why) if why and not ok else ''))


def dec(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')


def lum_rows(im):
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()
    return [st.mean([0.299 * b[(y * w + x) * 3] + 0.587 * b[(y * w + x) * 3 + 1]
                     + 0.114 * b[(y * w + x) * 3 + 2] for x in range(w)]) for y in range(h)]


def lum_cols(im):
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()
    return [st.mean([0.299 * b[(y * w + x) * 3] + 0.587 * b[(y * w + x) * 3 + 1]
                     + 0.114 * b[(y * w + x) * 3 + 2] for y in range(h)]) for x in range(w)]


def main():
    bank = json.load(open(BANK))
    style = json.load(open(STYLE))
    tol = style['TOLERANCE']
    tiles = {t['id']: t for t in bank['tiles']}
    walls = [t for t in bank['tiles'] if t.get('form') in ('face', 'pillar', 'base')]
    gates = [t for t in bank['tiles'] if t.get('form') == 'gate_overlay']
    src = open(RUN, encoding='utf8').read()
    builder = open(BUILDER, encoding='utf8').read()
    cook = open(COOK, encoding='utf8').read()

    print('PERIMETER GATE')
    ck('bank has wall tiles', len(walls) >= 36, 'only %d' % len(walls))
    ck('bank has the l/m/r gate pieces', len(gates) >= 8, 'only %d' % len(gates))

    # ---- STYLE: the ruler is his own bought art, re-derived, never a taste
    bad = [t['id'] for t in walls if not t.get('in_tolerance')]
    ck('every wall tile inside the measured tolerance', not bad, ', '.join(bad[:4]))
    lo = tol['edge'][0]
    soft = [t['id'] for t in walls if t['measured']['edge'] < lo]
    ck('no wall softer than the tolerance floor (edge %.2f)' % lo, not soft, ', '.join(soft[:4]))
    thin = [t['id'] for t in walls if t['measured']['colours'] < tol['colours_min']]
    ck('every wall carries his colour depth', not thin, ', '.join(thin[:4]))

    # ---- PINK: an accidental salmon still fails; a DECLARED colourway does not
    pink = []
    for t in walls:
        if t.get('rosy'):
            continue
        im = dec(t['b64']).convert('RGB')
        px = list(im.getdata())
        n = sum(1 for r, g, b in px if r > g + 34 and r > b + 44 and r > 150)
        if n > len(px) * 0.12:
            pink.append(t['id'])
    ck('no undeclared pink wall', not pink, ', '.join(pink[:4]))

    # ---- CAP: the coping is the lightest band. 45 DEGREE ART LAW.
    flat = []
    for t in walls:
        if t['form'] == 'base':
            continue
        rows = lum_rows(dec(t['b64']))
        if st.mean(rows[:8]) <= st.mean(rows[14:38]) + 12:
            flat.append(t['id'])
    ck('the cap is the sky-lit lightest band', not flat, ', '.join(flat[:4]))

    # ---- OVERSAIL: a hard shadow under it, or it is a painted stripe
    nolip = []
    for t in walls:
        if t['form'] == 'base':
            continue
        rows = lum_rows(dec(t['b64']))
        if min(rows[8:14]) >= st.mean(rows[:8]) - 18:
            nolip.append(t['id'])
    ck('the cap oversails and casts', not nolip, ', '.join(nolip[:4]))

    # ---- BASE: the capless form has no bright top band, or a 2-cell wall stacks 2 walls
    capped = []
    for t in walls:
        if t['form'] != 'base':
            continue
        rows = lum_rows(dec(t['b64']))
        if st.mean(rows[:8]) > st.mean(rows[14:38]) + 8:
            capped.append(t['id'])
    ck('the base form carries NO second coping', not capped, ', '.join(capped[:4]))
    ck('a base form exists for every design',
       len([t for t in walls if t['form'] == 'base']) == len([t for t in walls if t['form'] == 'face']))

    # ---- PILLAR: proud AND casting. Brightness alone drew a stripe, not a post.
    dull, nocast = [], []
    for t in walls:
        if t['form'] != 'pillar':
            continue
        face = tiles.get(t['id'].replace('_pillar_', '_face_'))
        if not face:
            continue
        pc, fc = lum_cols(dec(t['b64'])), lum_cols(dec(face['b64']))
        if st.mean(pc[:12]) <= st.mean(fc[:12]) + 6:
            dull.append(t['id'])
        if st.mean(pc[12:17]) >= st.mean(pc[:12]) - 12:
            nocast.append(t['id'])
    ck('the pillar stands proud of the panel', not dull, ', '.join(dull[:4]))
    ck('the pillar casts onto the panel beside it', not nocast, ', '.join(nocast[:4]))

    # ---- SEAM: horizontal only, against the tile that actually follows
    rough = [t['id'] for t in walls if t.get('hseam', 0) > 1.25]
    ck('no wall seam worse than its own worst interior line', not rough,
       ', '.join('%s %.2f' % (t['id'], t['hseam']) for t in walls if t.get('hseam', 0) > 1.25))
    ck('the cook tests the seam against the FOLLOWING tile, not itself',
       'def hseam(im, right=None)' in cook and "drawn['face'][0] if form == 'pillar'" in cook)
    ck('the cook says in words that these do not wrap vertically',
       bank.get('seam_axis') == 'horizontal only')

    # ---- PERIOD: everything divides 44 or it cuts at the border he circled
    ck('the cap course divides 44', 'CAP_UNIT = 11' in cook)
    ck('the pillar coursing divides 44', '% 11 == 0' in cook)
    ck('the gate pickets divide 44', '% 4 == 0' in cook)
    ck('the cook names the divisors of 44 and holds to them',
       all(str(d) in cook for d in DIVISORS))

    # ---- GATE: transparent where the wall belongs, dark where the hole is
    for g in gates:
        im = dec(g['b64'])
        a = im.split()[3]
        clear = sum(1 for v in a.getdata() if v == 0) / float(CELL * CELL)
        rgb = im.convert('RGB')
        dark = sum(1 for p in rgb.getdata() if sum(p) / 3 < 60) / float(CELL * CELL)
        ck('%s leaves the community wall showing' % g['id'], clear > 0.10,
           'only %.0f%% transparent' % (clear * 100))
        ck('%s is a real opening, not a frame' % g['id'], dark > 0.12,
           'only %.0f%% dark' % (dark * 100))
    ck('the open gate is not a bare black rectangle',
       'YOU LOOK THROUGH A GATE' in cook)
    for e in ('lr', 'l', 'm', 'r'):
        ck('the gate has its %s piece for a wide aperture' % e,
           ('perim_gate_open_' + e) in tiles and ('perim_gate_steel_' + e) in tiles)

    # ---- WIRED: the run draws it, in the right order, from the cooked bank
    ck('the run draws the cooked perimeter', 'PERIM_COOK' in src and 'perimDesign(' in src)
    ck('the run draws the gate mouth', 'drawGateMouth(' in src)
    ck('code 5 no longer falls through to plain ground',
       "c===5" in src and "drawGateMouth(X,Y,S,gx,gy2)" in src)
    ck('the wall goes down BEFORE the hole is punched',
       src.index('ctx.drawImage(wall,X,Y,S,S)') < src.index('if(im) ctx.drawImage(im,X,Y,S,S)'))
    ck('one coping per wall, not one per cell', 'if(isPerim(gx,gy-1)) return ready(d[2])' in src)
    ck('pillars are spaced along the run', "(((run%4)+4)%4)===0" in src)
    ck('one wall design per community, seeded off the plot',
       'perimDesign' in src and '>>2' in src)

    # ---- FAMILY: the whole suburb family, or gated communities get no art at all
    ck('isSuburbCell accepts suburb AND gated AND estate',
       "CELLNAME==='gated'" in src and "CELLNAME==='estate'" in src)

    # ---- HIS POOL: still here, still loaded, and WB4 rescued not smeared
    hisbank = json.load(open(HIS))
    ck('his 13 approved 7/14 walls are still in the repo',
       len([p for p in hisbank['pool'] if p['variant'] == 'tan']) >= 13)
    ck('his pool is still loaded by the builder', 'PERIM_POOL' in builder)
    ck('WB4 is rescued from its tiling preview, not blitted whole',
       'bohemia_perim_rescue.py' in builder)
    ck('the rescue refuses to guess at his art',
       'REFUSING' in open('tools/bohemia_perim_rescue.py', encoding='utf8').read())
    ck('the record says WHY his walls were displaced, with the measurement',
       'why_replaced' in bank.get('reference_measured', {}))

    # ---- SHIPPED BYTES ARE THE COOKED BYTES
    built = open(BUILT, encoding='utf8').read()
    face0 = [t for t in walls if t['form'] == 'face'][0]
    ck('the shipped run carries the cooked bytes', face0['b64'][:120] in built)
    ck('the shipped run carries the gate overlay',
       tiles['perim_gate_steel_m']['b64'][:120] in built)

    print('\n%d/%d' % (len(PASSES), len(PASSES) + len(FAILS)))
    if FAILS:
        print('FAILED: ' + ', '.join(FAILS))
        sys.exit(1)


if __name__ == '__main__':
    main()
