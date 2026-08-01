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
        if pinkish > 0.18:
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
    ok('nothing came out PINK (the salmon failure, 8/1)', not pink,
       'desaturation must hold luminance so clay goes brown: '
       + ', '.join('%s %s%%' % p for p in pink[:5]))
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
    print('   TEXTURE MATCH GATE: %d passed, %d failed  (%d tiles, %d materials)'
          % (P, F, len(tiles), len(mats)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
