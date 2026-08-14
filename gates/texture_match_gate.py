#!/usr/bin/env python3
"""
BOHEMIA TEXTURE MATCH GATE (8/1/26) — painted art has to measure up to what he BOUGHT.

Paolo 8/1: "I really need you trying to make as much pixel art that I approve of for
everything we need in the game as possible INSPIRED BY THE GRAPHIC ASSETS THAT I BOUGHT
TRYING TO REPLICATE THE EXACT LOOK I don't know what's so difficult"

WHAT WAS SO DIFFICULT, FINALLY MEASURED. Three batches of house art were rejected and
every post-mortem blamed the SHAPES. The shapes were not the problem:

                        colours/tile   edge   grain    sat
    HIS BOUGHT concrete        1443    20.9   64.7%   0.274
    my house skins               81     9.4   26.2%   0.383
    my CMU wall                   4     7.1   14.4%   0.082

HIS ART IS ROUGH AND GREY. PAINTED ART IN THIS REPO WAS SMOOTH AND TOO COLOURFUL. He
carries ~2.5x the local contrast and ~2.7x the grain at ~60% of the saturation. That is
not a palette disagreement, it is a different ORDER OF DETAIL, and no choice of colours
closes it. A 13-colour flat ramp cannot sit beside a 1,300-colour photographic texture
and read as one game -- which is exactly what the street screenshot showed, his cracked
asphalt directly above a flat painted field.

SO THIS GATE IS THE RULER, and it is his own tiles: the target and tolerance are derived
in tools/bohemia_style_target.py from the concrete and street packs he PAID FOR and that
already ship. Nothing here is an invented aesthetic rule. If the ruler ever drifts from
his library, this gate fails too -- it re-derives rather than trusting a stored number.

IT ALSO HOLDS THE TWO MISTAKES THAT ALMOST SHIPPED, as permanent negative tests:
  PINK      capping saturation at constant value turns dark red into SALMON. The first
            run produced pink stucco and a pink terracotta roof. Desaturation must hold
            luminance, so clay goes BROWN and not PALE.
  MUSH      at this grain the material's own structure was being buried, leaving fields
            of noise that hit every number and told you nothing about what you were
            looking at. Structure must survive the texture.

Run from repo root:  python3 gates/texture_match_gate.py
"""
import base64
import colorsys
import io
import json
import os
import re
import statistics as st
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

BANK = 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt'
STYLE = 'records/BOHEMIA_STYLE_TARGET_8_1_26.json'
GROUND = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
SHEET = 'records/target/TEXTURE_MATCH_CONTACT.png'
COOK = 'tools/bohemia_texture_match_cook.py'

P = F = 0


def ok(n, c, d=''):
    global P, F
    if c:
        P += 1
    else:
        F += 1
        print('   FAIL  %s  %s' % (n, d))


def measure(im):
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()
    p = [(b[i], b[i + 1], b[i + 2]) for i in range(0, len(b), 3)]
    L = [0.299 * r + 0.587 * g + 0.114 * bb for r, g, bb in p]
    e = [abs(L[y * w + x] - L[y * w + x + 1]) for y in range(h) for x in range(w - 1)]
    return dict(colours=len(set(p)), edge=st.mean(e),
                grain=100.0 * sum(1 for v in e if v > 8) / len(e),
                sat=st.mean([colorsys.rgb_to_hsv(r / 255, g / 255, bb / 255)[1]
                             for r, g, bb in p]),
                lum_mean=st.mean(L), lum_sd=st.pstdev(L))


CELL = 44


def dec(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')


def lum_rows(im):
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()
    return [st.mean([0.299 * b[(y * w + x) * 3] + 0.587 * b[(y * w + x) * 3 + 1]
                     + 0.114 * b[(y * w + x) * 3 + 2] for x in range(w)]) for y in range(h)]


def main():
    for f in (BANK, STYLE, COOK):
        ok('%s exists' % os.path.basename(f), os.path.exists(f), f)
    if not all(os.path.exists(f) for f in (BANK, STYLE)):
        print('   TEXTURE MATCH GATE: %d passed, %d failed' % (P, F))
        return 1 if F else 0

    style = json.load(open(STYLE))
    tol = style['TOLERANCE']
    bank = json.load(open(BANK))
    tiles = bank.get('tiles') or []

    ok('the cook names his ruling', 'REPLICATE THE EXACT LOOK'
       in str(bank.get('ruling', '')).upper())
    ok('the style target is derived from a PURCHASED library',
       'SEAMLESS_SET' in str(style.get('source', '')))
    ok('there is a real batch', len(tiles) >= 24, '%d tiles' % len(tiles))
    ok('the side-by-side sheet exists for his eyes', os.path.exists(SHEET), SHEET)

    # ---- THE RULER IS STILL HIS. Re-derive from the purchased bank rather than
    # trusting the stored number, so the target cannot quietly drift off his library.
    gb = json.load(open(GROUND))
    his = [measure(Image.open(io.BytesIO(base64.b64decode(t['b64']))))
           for t in gb['tiles']
           if t.get('b64') and 'contrete' in str(t.get('pack', '')).lower()][:20]
    ok('his purchased tiles are still there to measure against', len(his) >= 12,
       '%d found' % len(his))
    if his:
        he = st.mean([m['edge'] for m in his])
        hg = st.mean([m['grain'] for m in his])
        ok('the stored tolerance still brackets his real art (edge %.1f, grain %.0f%%)'
           % (he, hg),
           tol['edge'][0] <= he <= tol['edge'][1] and tol['grain'][0] <= hg <= tol['grain'][1],
           'the ruler has drifted off his library - re-run tools/bohemia_style_target.py')

    # ---- every cooked tile inside HIS band
    bad = []
    pink = []
    flat = []
    for t in tiles:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
        m = measure(im)
        if not (m['colours'] >= tol['colours_min']
                and tol['edge'][0] <= m['edge'] <= tol['edge'][1]
                and tol['grain'][0] <= m['grain'] <= tol['grain'][1]
                and tol['sat'][0] <= m['sat'] <= tol['sat'][1]
                and tol['lum_mean'][0] <= m['lum_mean'] <= tol['lum_mean'][1]
                and tol['lum_sd'][0] <= m['lum_sd'] <= tol['lum_sd'][1]):
            bad.append((t['id'], m))

        px = list(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB').getdata()) \
            if False else None
        b = im.convert('RGB').tobytes()
        trip = [(b[i], b[i + 1], b[i + 2]) for i in range(0, len(b), 3)]

        # PINK NEGATIVE TEST: a pale, strongly red-over-green pixel majority is the
        # salmon failure. Real desert brown keeps red close to green.
        pinkish = sum(1 for r, g, bb in trip
                      if r > g + 34 and r > 140 and bb > 90) / len(trip)
        # A DECLARED colourway is allowed to be rosy; an undeclared one is the salmon
        # bug. Paolo 8/1 asked for "a little more variety in color" and desert rose is a
        # real southwestern house colour, so the test has to tell an intended colour from
        # an accident rather than banning a hue outright.
        if pinkish > 0.18 and not t.get('rosy'):
            pink.append((t['id'], round(100 * pinkish, 1)))

        # MUSH NEGATIVE TEST: structure has to survive the grain. A material with a
        # bond/course/rib must show ROW STRUCTURE - some horizontal lines materially
        # darker than the tile mean - or it is just noise wearing the right numbers.
        if t.get('kind') in ('block', 'barrel', 'shingle', 'rib'):
            w, h = im.size
            L = [0.299 * b[(y * w + x) * 3] + 0.587 * b[(y * w + x) * 3 + 1]
                 + 0.114 * b[(y * w + x) * 3 + 2] for y in range(h) for x in range(w)]
            rows = [st.mean(L[y * w:(y + 1) * w]) for y in range(h)]
            cols = [st.mean([L[y * w + x] for y in range(h)]) for x in range(w)]
            span = max(max(rows) - min(rows), max(cols) - min(cols))
            # 25, not 12. The real batch measures 37-82, so a 12 threshold could never
            # fail on anything short of pure noise and was a check in name only. 25
            # keeps ~1.5x margin on the weakest real material (shingle, 37.7) while
            # actually having an opinion.
            if span < 25.0:
                flat.append((t['id'], round(span, 1)))

    ok('every cooked tile lands inside the band measured off HIS art',
       not bad, '%d out: %s' % (len(bad), ', '.join(
           '%s(edge %.1f grain %.0f sat %.2f lum %.0f/%.0f)'
           % (i, m['edge'], m['grain'], m['sat'], m['lum_mean'], m['lum_sd'])
           for i, m in bad[:4])))
    ok('no UNDECLARED tile came out PINK (the salmon failure, 8/1)', not pink,
       'desaturation must hold luminance so clay goes brown: '
       + ', '.join('%s %s%%' % p for p in pink[:5]))
    # ---- THE BORDER. Paolo 8/1, circling two bands across the yard: "I don't want the
    # borders of the tiles to look like that ... I want it to be more seamless ... the
    # border is very important. The border speaks a lot."
    # He was seeing a real bug. Two terms in the cook were NON-PERIODIC (a linear light
    # gradient and a grime band in the bottom 28%), so every tile ended bright at the top
    # and dark at the bottom and the grid stacked a step at every horizontal boundary.
    # Five materials also had module periods that do not divide 44 - shingle tabs at 15,
    # ribs at 7, brick 6x15, ashlar 15, planks 9 - so the pattern itself CUT at the edge.
    #
    # THE TEST IS NOT "the seam is quiet". A block wall SHOULD have a mortar joint at the
    # boundary; that is the material, not a defect, and an absolute threshold would fail
    # every structured tile. The honest question is whether the seam is WORSE THAN THE
    # HARSHEST LINE THE MATERIAL ALREADY HAS. If it is not, the tile boundary is
    # indistinguishable from the pattern's own rhythm, which is exactly what he asked for:
    # still legible as tiles, no visible border.
    seams = []
    for t in tiles:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
        w, h = im.size
        b = im.tobytes()

        def L(x, y):
            i = (y * w + x) * 3
            return 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2]

        rowj = [st.mean([abs(L(x, y) - L(x, y + 1)) for x in range(w)]) for y in range(h - 1)]
        colj = [st.mean([abs(L(x, y) - L(x + 1, y)) for y in range(h)]) for x in range(w - 1)]
        sv = st.mean([abs(L(x, h - 1) - L(x, 0)) for x in range(w)])
        sh = st.mean([abs(L(w - 1, y) - L(0, y)) for y in range(h)])
        rv = sv / max(max(rowj), 1e-6)
        rh = sh / max(max(colj), 1e-6)
        if rv > 1.25 or rh > 1.25:
            seams.append((t['id'], round(rv, 2), round(rh, 2)))
    ok('NO TILE HAS A VISIBLE BORDER (seam no worse than the material\'s own worst line)',
       not seams,
       '%d tiles show a seam: %s' % (len(seams), ', '.join(
           '%s v%.2f h%.2f' % s2 for s2 in seams[:5])))

    # and the cause, held directly: every module period must divide the cell, or the
    # pattern cuts at the boundary no matter how good the noise is.
    src = open(COOK).read()
    ok('the cook states the divisor rule that keeps patterns whole across the border',
       'DIVISORS' in src and 'divide' in src.lower())

    ok('structure survived the grain - no material is a field of mush', not flat,
       'no row/column structure in: ' + ', '.join('%s span %s' % f for f in flat[:5]))

    ids = [t['id'] for t in tiles]
    ok('every tile has a unique id', len(set(ids)) == len(ids))
    ok('every tile is the corpus cell (44x44, blits 1:1)',
       all(Image.open(io.BytesIO(base64.b64decode(t['b64']))).size == (44, 44)
           for t in tiles))
    # HIS VERDICT AND MY NEW WORK MUST NOT BLUR. He approved 36 tiles on 8/1; 54 were
    # cooked after. A bank that calls all 90 canon because 36 siblings were thumbed up
    # is how unjudged art walks into the game, and UNJUDGED IS DEAD cuts the other way
    # too -- his approval has to stay attached to exactly what he saw.
    verdicts = [t.get('verdict', '') for t in tiles]
    ok('every tile carries its OWN verdict', all(verdicts), 'some tiles have none')
    napp = sum(1 for v in verdicts if v.startswith('APPROVED'))
    ok('his 8/1 approval is recorded on exactly the 36 tiles he saw', napp == 36,
       '%d tiles claim his approval' % napp)
    ok('the approved set is named so it cannot drift',
       len(bank.get('approved_materials') or []) == 12,
       '%d materials' % len(bank.get('approved_materials') or []))
    ok('his verdict is quoted verbatim on the bank',
       'fucking fantastic' in str(bank.get('verdict_batch_1', '')))
    ok('the new work is honestly marked unjudged',
       all(v == 'PENDING PAOLO' for v in verdicts if not v.startswith('APPROVED')))
    ok('the verdict record exists',
       os.path.exists('records/BOHEMIA_VERDICT_TEXTURE_MATCH_8_1_26.txt'))

    mats = {t.get('material') for t in tiles}
    ok('it covers the surfaces his library does NOT (walls and roofs)',
       len(mats) >= 8, '%d materials' % len(mats))
    # APPROVAL UNLOCKS VOLUME is standing law: the approved look has to actually be
    # spent on the filed art requests, not admired.
    ok('approval was spent on VOLUME (the 18 filed ART forms)', len(mats) >= 24,
       'only %d materials - the batch he approved unlocked the whole cook queue' % len(mats))

    if tiles:
        agg = {k: st.mean([t['measured'][k] for t in tiles if t.get('measured')])
               for k in ('colours', 'edge', 'grain', 'sat')}
        print('   HIS %6.0f colours  edge %5.2f  grain %5.1f%%  sat %.3f'
              % (style['TARGET']['colours'], style['TARGET']['edge'],
                 style['TARGET']['grain'], style['TARGET']['sat']))
        print('   MINE%6.0f colours  edge %5.2f  grain %5.1f%%  sat %.3f'
              % (agg['colours'], agg['edge'], agg['grain'], agg['sat']))
    # ---- THE OPENINGS (8/2). Window, boarded window, garage bay: the last old art on
    # the house. They are OVERLAYS WITH ALPHA and that is load-bearing, not an
    # implementation detail: the run picks one wall skin per house out of fifteen, so an
    # opening baked as a whole tile carries ONE of those walls and fourteen houses in
    # fifteen show a window in the wrong stucco. This gate holds the overlay design.
    OPEN = 'banks/BOHEMIA_OPENINGS_8_2_26.txt'
    ok('the openings bank exists', os.path.exists(OPEN), OPEN)
    if os.path.exists(OPEN):
        ob = json.load(open(OPEN))
        ot = {t['id']: t for t in ob.get('tiles', [])}
        need = ['wall_window', 'wall_boarded', 'garage_top', 'garage_bottom',
                'garage_top_l', 'garage_bottom_l', 'garage_top_r', 'garage_bottom_r']
        ok('every opening the run asks for exists',
           all(k in ot for k in need),
           'missing: ' + ', '.join(k for k in need if k not in ot))
        solid = []
        nohole = []
        for k, t in ot.items():
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
            ok_size = im.size == (44, 44)
            if not ok_size:
                solid.append(k)
                continue
            b4 = im.tobytes()
            pxs = [tuple(b4[i:i + 4]) for i in range(0, len(b4), 4)]
            alpha = [p[3] for p in pxs]
            # a WALL opening must be mostly transparent, or it is a baked tile wearing
            # the word "overlay" and the wall behind it never shows
            if k.startswith('wall_') and sum(1 for a2 in alpha if a2 < 8) < len(alpha) * 0.25:
                solid.append(k)
            # and it must actually be a HOLE: real dark pixels, not just a frame
            dark = sum(1 for p in pxs
                       if p[3] > 200 and 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] < 60)
            if dark < len(alpha) * 0.06:
                nohole.append(k)
        ok('WALL openings are real overlays, not baked tiles', not solid,
           'these are opaque across the wall: ' + ', '.join(solid[:4]))
        ok('every opening is actually a HOLE (dark interior, not just a frame)',
           not nohole, ', '.join(nohole[:4]))
        ok('the openings are honestly unjudged', ob.get('status') == 'PENDING PAOLO',
           str(ob.get('status')))
        run = 'slices/BOHEMIA_RUN_CURRENT.html'
        if os.path.exists(run):
            r = open(run, encoding='utf8', errors='ignore').read()
            ok('the run draws the wall BEHIND a window before punching it',
               'OPEN_ON_WALL' in r and 'OPENING_IMG' in r)
            ok('the opening bytes actually ship in the run',
               ot['wall_window']['b64'] in r if 'wall_window' in ot else False)

    # ================================================================================
    # AND THE REST OF THE VALLEY IS BUILT OUT OF THE RIGHT THING (8/3)
    # His ground reached all 55 districts this morning; their BUILDINGS were still flat
    # starter tile. The art existed and he approved it on 8/1 - but the house pool is
    # fifteen stucco skins, and ungating it puts a bungalow's butter stucco on a
    # distribution warehouse. A material says what a building IS.
    # Map + sources: records/BOHEMIA_DISTRICT_MATERIALS_8_3_26.md
    # ================================================================================
    BUILDER = 'tools/build_run_slice.js'
    RUNSRC = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'
    MAT_DOC = 'records/BOHEMIA_DISTRICT_MATERIALS_8_3_26.md'
    bl = open(BUILDER, encoding='utf8').read()
    rs = open(RUNSRC, encoding='utf8').read()
    known = {t['material'] for t in bank['tiles']}

    ok('the valley has a material map at all', 'var CIVIC = {' in bl)
    civ = bl[bl.index('var CIVIC = {'):bl.index('var CIVIC_DEFAULT')]
    used = set(re.findall(r"'([a-z_]+)'", civ))
    districts = set(re.findall(r"^\s*([a-z][a-z0-9]*):", civ, re.M))
    mats = used - districts
    ghost = sorted(m2 for m2 in mats if m2 not in known)
    ok('every material in the map is a real cooked tile', not ghost, ', '.join(ghost[:5]))
    ok('the map covers a real spread of district types', len(districts) >= 30,
       'only %d' % len(districts))

    # *** NO HOUSE STUCCO ON A WAREHOUSE. *** The whole reason this is a map and not an
    # ungating. apartment is the ONE legitimate exception: Vegas apartments really are
    # stucco, and the doc says so in writing.
    HOUSE = {'stucco_tan', 'stucco_ochre', 'stucco_sage', 'stucco_butter',
             'stucco_blue_grey', 'stucco_grey', 'adobe_red', 'stucco_sand_pink'}
    bad = []
    for blk in re.finditer(r"^\s*([a-z][a-z0-9]*):\s*\[([^\]]*)\]", civ, re.M):
        d, lst = blk.group(1), set(re.findall(r"'([a-z_]+)'", blk.group(2)))
        if d in ('apartment',):
            continue
        hit = lst & HOUSE
        if hit:
            bad.append(d + ':' + ','.join(sorted(hit)))
    ok('no house stucco on a non-residential district', not bad, '; '.join(bad[:4]))
    ok('the default is NEVER the house pool',
       not (set(re.findall(r"'([a-z_]+)'",
            bl[bl.index('var CIVIC_DEFAULT'):bl.index('var CIVIC_ROOF')])) & HOUSE))

    # *** FLAT ROOFS. *** A pitched barrel tile on a warehouse is a lie about the
    # building, and the bank holds both kinds side by side, so this was one careless
    # line away.
    roofblk = bl[bl.index('var CIVIC_ROOF'):bl.index('var civicWall')]
    rmats = set(re.findall(r"'([a-z_]+)'", roofblk))
    kindof = {t['material']: t['kind'] for t in bank['tiles']}
    pitched = sorted(m2 for m2 in rmats if kindof.get(m2) in ('barrel', 'shingle'))
    ok('civic roofs are FLAT tar-and-gravel, never a house pitch', not pitched,
       ', '.join(pitched))
    ok('and there is at least one real flat roof material',
       any(kindof.get(m2) in ('gravel', 'plaster') for m2 in rmats))

    # ONE MATERIAL PER BUILDING, not per cell, or a warehouse is a patchwork.
    # AMENDED for Paolo's 8/11 placement ruling ("the placement was shit but
    # individually the tiles are good"): the seed is the building MASS itself
    # (flood-filled anchor via _civicMassKey), no longer a blind 8x8 block that
    # patchworked any building straddling a block boundary. The old check
    # asserted the dead 8x8 seed and outlived the ruling; a gate must never
    # outrank a ruling, so the check now asserts the mass seed.
    ok('a whole building wears one material (mass seed, his 8/11 ruling)',
       'var mk=_civicMassKey(gx,gy);' in rs and 'var bx=mk[0], by=mk[1];' in rs)
    ok('the colourway still shuffles per cell so nothing stamps',
       'var c=(Math.imul(gx|0,374761393)' in rs)
    ok('the pool is chosen by DISTRICT, not ungated from the house pool',
       'CIVIC_SKIN.d[CELLNAME]' in rs)
    ok('the yard is left alone: it wears his BOUGHT dirt',
       "if(!k||k==='Y') return false;" in rs)
    ok('house skins still only draw on the suburb family',
       'isSuburbCell() && drawSkin(' in rs)
    ok('the civic skin only draws OUTSIDE the suburb family',
       '!isSuburbCell() && drawCivicSkin(' in rs)
    ok('the map is written down with its sources', os.path.exists(MAT_DOC)
       and 'tilt-up' in open(MAT_DOC, encoding='utf8').read().lower())

    # ================================================================================
    # THE PARAPET AND THE CIVIC OPENINGS (8/3)
    # Their buildings had the right material and NO TOP AND NO WAY IN. On a strip mall
    # the parapet coping and fascia are the parts a customer sees from the parking lot;
    # on a warehouse the roof is invisible from the ground. The parapet is the
    # SILHOUETTE, not trim.
    # ================================================================================
    CIVOPEN = 'banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt'
    CIVCOOK = 'tools/bohemia_civic_openings_cook.py'
    cb = json.load(open(CIVOPEN))
    cc = open(CIVCOOK, encoding='utf8').read()
    cids = {t['id']: t for t in cb['tiles']}
    for need in ('civic_parapet', 'civic_dock', 'civic_storefront', 'civic_mandoor'):
        ok('the civic set has %s' % need, need in cids)

    # A PARAPET IS NOT AN EAVE, AND THEY ARE OPPOSITE OBJECTS. A house roof oversails
    # the WALL; a parapet WALL oversails the roof. Backwards makes every warehouse a
    # very large bungalow, so the cook has to say which way round it is.
    ok('the cook knows a parapet is the opposite of an eave',
       'oversails the ROOF' in cc and 'very large bungalow' in cc)

    for tid, t in cids.items():
        im = dec(t['b64'])
        a = im.split()[3]
        clear = sum(1 for v in a.getdata() if v == 0) / float(CELL * CELL)
        ok('%s is an OVERLAY, so it works on all 13 civic materials' % tid, clear > 0.05,
           'only %.0f%% transparent' % (clear * 100))

    # THE COPING IS THE LIGHTEST BAND (45 DEGREE ART LAW) AND IT CASTS
    prows = lum_rows(dec(cids['civic_parapet']['b64']).convert('RGB'))
    ok('the parapet coping is the sky-lit lightest band', st.mean(prows[:9]) > st.mean(prows[13:22]) + 25)
    ok('and it casts a hard fascia shadow below it, or it is a painted stripe',
       min(prows[9:16]) < st.mean(prows[:9]) - 60)

    # DEAD-DARK GLASS. Lit retail glazing would be the most off-canon thing in the
    # valley, and this is the one place a cook could cheerfully get it wrong.
    sf = dec(cids['civic_storefront']['b64']).convert('RGB')
    px2 = [p3 for p3 in sf.getdata()]
    lit = sum(1 for r, g, b2 in px2 if (r + g + b2) / 3 > 150) / float(len(px2))
    ok('the storefront glass is DEAD DARK (12%% CLUSTERED POWER)', lit < 0.22,
       '%.0f%% of it is bright' % (lit * 100))

    # EVERY MODULE DIVIDES 44 or it cuts at the border he circled on 8/1
    ok('the coping joints divide 44', '(x + 5) % 11 == 0' in cc)
    ok('the storefront mullions divide 44', '(x + 4) % 11 == 0' in cc)
    ok('the dock ribs divide 44', '(y - y0) % 4 == 0' in cc)

    # WIRED, AND KEYED ON THE BUILDING'S REAL TOP EDGE
    ok('the run draws the parapet on the mass top edge',
       'var topEdge = civicRoofAt(gx,gy-1) || !civicSolidAt(gx,gy-1);' in rs)
    ok('the top edge is not keyed on a roof NAME alone (industrial has none)',
       '!civicSolidAt(gx,gy-1)' in rs and 'INDUSTRIAL zero parapets' in rs)
    ok('the way in goes on the FRONT and never on the coping row',
       '!civicSolidAt(gx,gy+1) && !topEdge' in rs)
    ok('storefront glazing is CONTINUOUS along a front, not a punched hole',
       "kind==='storefront' ? true" in rs)
    ok('a blank building is a real answer (casino, corrugated warehouse)',
       'if(kind && ' in rs and 'return null;' in rs)
    ok('the openings are assigned by district, not sprayed everywhere',
       'CIVIC_OPEN_BY' in bl and 'var CIVIC_OPEN_BY = {' in bl)
    built2 = open('slices/BOHEMIA_RUN_CURRENT.html', encoding='utf8').read()
    ok('the shipped run carries the parapet bytes',
       cids['civic_parapet']['b64'][:120] in built2)


    print('   TEXTURE MATCH GATE: %d passed, %d failed  (%d tiles, %d materials)'
          % (P, F, len(tiles), len(mats)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
