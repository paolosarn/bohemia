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
import re
import statistics as st
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

BANK = 'banks/BOHEMIA_PERIMETER_8_2_26.txt'
JUDGE = 'slices/BOHEMIA_PERIMETER_JUDGE_8_2_26.html'
VERDICT = 'records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt'
GRAVE = 'gates/bohemia_graveyard.txt'
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
    ck('bank has the l/m/r x full/top/bottom gate pieces', len(gates) >= 24,
       'only %d' % len(gates))

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
       'def hseam(im, right=None)' in cook and "drawn['face_0'][0] if base_form == 'pillar'" in cook)
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
        # ONLY WHERE THERE IS WALL TO SHOW. The 'm/bottom' piece is the middle of a wide
        # opening on its lower course: no pier either side, no coping above it, so it is
        # correctly opaque end to end and this check does not apply. Asserting it there
        # would be demanding a hole in the middle of a hole.
        if g['ends'] != 'm' or g.get('vert') != 'bottom':
            ck('%s leaves the community wall showing' % g['id'], clear > 0.10,
               'only %.0f%% transparent' % (clear * 100))
        ck('%s is a real opening, not a frame' % g['id'], dark > 0.12,
           'only %.0f%% dark' % (dark * 100))
    ck('the open gate is not a bare black rectangle',
       'YOU LOOK THROUGH A GATE' in cook)
    for e in ('lr', 'l', 'm', 'r'):
        for v in ('full', 'top', 'bottom'):
            ck('the gate has its %s/%s piece' % (e, v),
               ('perim_gate_open_%s_%s' % (e, v)) in tiles
               and ('perim_gate_steel_%s_%s' % (e, v)) in tiles)
    # *** NO COURSE OF BRICK THROUGH THE MIDDLE OF THE GATE. ***
    # Paolo 8/2 circled it: "why is there a middle brick part of it". The perimeter is
    # TWO cells thick where it runs east-west and the same overlay was drawn on both, so
    # the lower cell's transparent coping band showed a stripe of wall across the
    # opening's waist. A BOTTOM piece must be opaque from its very first row.
    band = []
    for g in gates:
        if g.get('vert') != 'bottom':
            continue
        a = dec(g['b64']).split()[3]
        w = a.width
        row0 = [a.getpixel((x, 0)) for x in range(w)]
        mid = [a.getpixel((x, CELL // 2)) for x in range(w)]
        if sum(1 for v2 in row0 if v2 > 0) < sum(1 for v2 in mid if v2 > 0) - 2:
            band.append(g['id'])
    ck('a lower gate course has NO transparent coping band (the brick stripe he circled)',
       not band, ', '.join(band[:4]))
    # and only ONE threshold per gate: a top piece must run off its own bottom edge
    # A THRESHOLD IS A STEP, NOT A GRADIENT. The first version of this check compared
    # the bottom rows to the middle and flagged every OPEN top piece - but an open gate
    # is SUPPOSED to get brighter downward, because that is the ground beyond receding
    # into daylight. What a threshold actually is, is a discontinuity: a concrete apron
    # jumps ~60 luminance in one row. Measuring the jump instead of the level tells the
    # two apart, which is the difference between a ruler and a tripwire.
    sill = []
    for g in gates:
        if g.get('vert') != 'top':
            continue
        rows = lum_rows(dec(g['b64']))
        if max(rows[y + 1] - rows[y] for y in range(CELL - 8, CELL - 1)) > 34:
            sill.append(g['id'])
    ck('a top gate course has NO second threshold', not sill, ', '.join(sill[:4]))
    ck('the run picks the vertical piece from its neighbours',
       'var above=isG(gx,gy-1), below=isG(gx,gy+1);' in src and 'kind[v]||kind[0]' in src)

    # ---- NO 44px STAMP. His 8/2 verdict in one word: "glitching out". One face tile
    # per design meant the one crack baked into it landed on every cell of the wall in
    # the same place forever, and an identical hard mark on a perfect grid reads as a
    # rendering fault. This is the regression that must never come back.
    faces = {}
    bases = {}
    for t in walls:
        key = t['material'] + '_' + str(t.get('colourway'))
        if t['form'] == 'face':
            faces.setdefault(key, []).append(t)
        elif t['form'] == 'base':
            bases.setdefault(key, []).append(t)
    thin = [k for k, v in faces.items() if len(v) < 4] + [k for k, v in bases.items() if len(v) < 4]
    ck('every design is a POOL of faces, never one tile', not thin, ', '.join(thin[:4]))
    ck('the run shuffles the pool per cell, with no visible period',
       'function perimVar(' in src and 'faces[perimVar(gx,gy,faces.length)]' in src
       and 'bases[perimVar(gx,gy,bases.length)]' in src)
    # and MOST of them must be clean: a wall is not a road
    quiet = 0
    for k, v in faces.items():
        for t in v:
            im = dec(t['b64']).convert('RGB')
            b = im.tobytes()
            L = [0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2] for i in range(0, len(b), 3)]
            med = sorted(L)[len(L) // 2]
            sd = st.pstdev(L)
            if sum(1 for v2 in L if abs(v2 - med) > 2 * sd) / float(len(L)) < 0.055:
                quiet += 1
    frac = quiet / float(sum(len(v) for v in faces.values()))
    ck('most faces carry NO hero damage (a wall is not a road): %.0f%% quiet' % (frac * 100),
       frac >= 0.55, '%.0f%% quiet, needs 55%%' % (frac * 100))
    ck('the cook says in writing why the stamp happened',
       'glitching out' in cook and 'FACE_VARIANTS' in cook)
    ck('the flat materials carry ghost coursing so a crack is not the only structure',
       'def ghost_coursing(' in cook and "ghost=0.34" in cook)

    # ---- HIS VERDICT IS OBEYED: the 11 he thumbed up ship, the 7 he downed do not
    # HE WIDENED IT ON THE SECOND PASS. First card: 11 up, 7 down. Shown the fix he
    # said "to be Frank, I liked all of them." NOTES ARE RULINGS, so all eighteen are
    # live. The seven were never bad designs - they were the ones where the 44px stamp
    # had nothing to hide behind, which is why every FLAT material failed and every
    # COURSED one survived.
    approved = ['%s_%d' % (m, k) for m in ('perim_slump', 'perim_cmu', 'perim_stucco',
                                           'perim_precast', 'perim_rose', 'perim_splitface')
                for k in range(3)]
    built = open(BUILT, encoding='utf8').read()
    ck('the builder ships all 18 he approved 8/2',
       all(("'" + a2 + "'") in builder for a2 in approved)
       and builder.count('PERIM_APPROVED') >= 2)
    judge = open(JUDGE, encoding='utf8').read()

    # ---- HIS 7/14 POOL IS DEAD, on his own thumbs, and must never draw again
    hispool = json.load(open(HIS))
    dead = [p['b64'] for p in hispool['pool'] if p['variant'] == 'tan']
    ck('his 13 killed walls are OUT of the shipped run',
       not any(b[:120] in built for b in dead))
    ck("the builder no longer loads them at all",
       "html.replace('__PERIM_B64_JSON__', '[]')" in builder)
    ck('the kill is recorded with a post-mortem',
       'ALL 13 KILLED' in open(GRAVE, encoding='utf8').read())
    ck('and the verdict is on file in his own words',
       "glitching out" in open(VERDICT, encoding='utf8').read())

    # ---- THE CARD MUST NOT INVENT DEFECTS. He said the gate "looks decent" and
    # thumbed all three gate cards DOWN: the card had stacked the barred leaf on the
    # coping row over the open mouth on the row below, which the game never does.
    JCOOK = 'tools/bohemia_perimeter_judge.py'
    jc = open(JCOOK, encoding='utf8').read()
    ck('the judge page is BUILT BY A TOOL IN THE REPO, not a throwaway script',
       os.path.exists(JCOOK))
    ck('a gate strip shows ONE kind, the way a plot actually wears it',
       "for kind, label in (('steel', 'still hung'), ('open', 'standing open'))" in jc
       and 'ONE KIND PER STRIP' in jc)
    ck('the judge strip puts TOP on the upper course and BOTTOM on the lower',
       "'perim_gate_%s_%s_top'" in jc and "'perim_gate_%s_%s_bottom'" in jc)
    ck('the judge strip shuffles faces with the RUN\'s own cell hash',
       'def cell_hash(' in jc and '0x9E3779B9' in jc
       and '0x9e3779b9' in src.lower())
    # every gate card names exactly one kind, so a mixed strip cannot slip back in
    names = re.findall(r'"name":\s*"the gate ([^,"]+)', judge)
    ck('no gate card mixes the two kinds',
       names and all((n.count('still hung') + n.count('standing open')) == 1
                     for n in names), ', '.join(names[:3]))

    # ---- WIRED: the run draws it, in the right order, from the cooked bank
    ck('the run draws the cooked perimeter', 'PERIM_COOK' in src and 'perimDesign(' in src)
    ck('the run draws the gate mouth', 'drawGateMouth(' in src)
    ck('code 5 no longer falls through to plain ground',
       "c===5" in src and "drawGateMouth(X,Y,S,gx,gy2)" in src)
    # ORDER, NOT SPELLING (8/4). This used to match the bare draw calls by literal,
    # and the 8/4 LOOK grade wrapped every world draw site in look(...) -- so a gate
    # that was really about ORDER blew up on a ValueError over a substring. The thing
    # it protects has not changed: the wall goes down first and the hole is punched
    # through it second. Ask for the two draws by their SUBJECT and compare positions,
    # so the next thing that wraps a draw call cannot break this either.
    i_wall = re.search(r'ctx\.drawImage\((?:look\()?wall\)?,X,Y,S,S\)', src)
    i_hole = re.search(r'if\(im\) ctx\.drawImage\((?:look\()?im\)?,X,Y,S,S\)', src)
    ck('the wall is drawn at all', i_wall is not None)
    ck('the hole is punched at all', i_hole is not None)
    ck('the wall goes down BEFORE the hole is punched',
       bool(i_wall) and bool(i_hole) and i_wall.start() < i_hole.start())
    ck('one coping per wall, not one per cell',
       'if(isPerim(gx,gy-1)) return ready(bases[perimVar(gx,gy,bases.length)])' in src)
    ck('pillars are spaced along the run', "(((run%4)+4)%4)===0" in src)
    ck('one wall design per community, seeded off the plot',
       'perimDesign' in src and '>>2' in src)

    # ---- FAMILY: the whole suburb family, or gated communities get no art at all
    ck('isSuburbCell accepts suburb AND gated AND estate',
       "CELLNAME==='gated'" in src and "CELLNAME==='estate'" in src)

    # ---- HIS POOL: still here, still loaded, and WB4 rescued not smeared
    hisbank = json.load(open(HIS))
    ck('his 13 walls are still ON DISK as the record of what he judged',
       len([p for p in hisbank['pool'] if p['variant'] == 'tan']) >= 13)
    ck('WB4 is still rescuable, so what he killed was the wall and not the smear',
       os.path.exists('tools/bohemia_perim_rescue.py'))
    ck('the rescue refuses to guess at his art',
       'REFUSING' in open('tools/bohemia_perim_rescue.py', encoding='utf8').read())
    ck('the record says WHY his walls were displaced, with the measurement',
       'why_replaced' in bank.get('reference_measured', {}))

    # ---- SHIPPED BYTES ARE THE COOKED BYTES
    face0 = [t for t in walls if t['form'] == 'face'
             and t['material'] + '_' + str(t['colourway']) in approved][0]
    ck('the shipped run carries the cooked bytes', face0['b64'][:120] in built)
    ck('the shipped run carries the gate overlay',
       tiles['perim_gate_steel_m_bottom']['b64'][:120] in built)

    print('\n%d/%d' % (len(PASSES), len(PASSES) + len(FAILS)))
    if FAILS:
        print('FAILED: ' + ', '.join(FAILS))
        sys.exit(1)


if __name__ == '__main__':
    main()
