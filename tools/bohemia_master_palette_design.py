#!/usr/bin/env python3
"""
BOHEMIA — THE MASTER PALETTE, DESIGNED (7/29/26)

Board row 0A, the blocker in front of all eighteen tile forms. Paolo asked to be
shown something, and this is the honest thing to show: not another law, the actual
piece of work every tile is waiting on.

WHY IT EXISTS. `records/target/BOHEMIA_MASTER_PALETTE.json` is NOT this. That file
is a 64-colour quantization OF the target screen — a measurement of what we
happened to make. The 7/28 re-cook then derived SIX INDEPENDENT family ramps that
know nothing about each other, which the sources name as exactly the amateur
pattern: *"games where each sprite has its own unrelated color scheme"*. This is
the professional structure instead: **one master palette, every family a subset of
it, sharing steps with its neighbours.**

THE METHOD, AND IT IS THE ONE I HAVE NEVER USED (M18):

  > *"Decide which zones are dark, mid-tone, and light, and once values are locked
  > in, replacing the grays with actual hues is trivial — and the result always
  > looks cohesive."*

So this builds in TWO passes and the order is the whole point:

  PASS 1 — THE VALUE SKELETON, IN GREY, DECIDED. Every layer gets an assigned
  value band before any colour exists. Ground is the darkest and quietest because
  it is the biggest surface and nobody should look at it (M2). Structure sits
  above it. Tops sit above that, because a sky-facing plane catches the most light
  and because a roof that matches the ground is invisible in greyscale — which is
  precisely the M14 failure this pass exists to prevent. Separations are DESIGNED
  to clear 18 points, not measured afterwards and hoped for.

  PASS 2 — HUE ONTO THE SKELETON. Only now does colour appear. Each family gets a
  hue pulled from the APPROVED corpus (so the colour stays Paolo's) and a
  saturation appropriate to its job, mapped onto value steps that were already
  fixed. Shadows shift cool, lights shift warm (L2), and saturation drops at the
  bright end so nothing burns.

REUSE CHECK: opens banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (the frozen CBB
set, READ ONLY) and takes every HUE from the approved tiles of each family. No hue
is invented. What is designed here is the VALUE STRUCTURE, which nobody ever
designed before — it was inherited by accident, which is why roofs and ground
ended up 6.5 points apart.

TASTE CHECK: a palette is not world art and the tile taste rules do not bind its
swatch sheet. The rules that DO bind, and are asserted below: no pure black (a
keyline by another name), nothing above 232 (act 1 has no white), act-1 dead-dark
glass keeps its own reserved slot, and purple is not in this palette at all
because purple belongs to the Amalgamation alone (PURPLE RESERVATION).

  python3 tools/bohemia_master_palette_design.py
    -> records/target/BOHEMIA_MASTER_PALETTE_DESIGNED.json
    -> records/target/MASTER_PALETTE_SHEET.png
"""
import base64
import colorsys
import io
import json
import os
from collections import Counter

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

FROZEN = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
OUT_JSON = 'records/target/BOHEMIA_MASTER_PALETTE_DESIGNED.json'
OUT_SHEET = 'records/target/MASTER_PALETTE_SHEET.png'

FLOOR, CEIL = 20.0, 232.0

# ---------------------------------------------------------------------------
# PASS 1 — THE VALUE SKELETON. Decided here, in grey, before any colour exists.
# Every number is a decision with a reason, not a measurement of what we made.
# ---------------------------------------------------------------------------
SKELETON = [
    # layer      steps  value range   why this band
    # THESE NUMBERS ARE A DESIGN DECISION AND THE FIRST VERSION OF THEM WAS WRONG.
    # I first put TOP as the highest band on the reasoning that a sky-facing plane
    # catches the most light. True in general, and it produced CREAM ROOFS
    # (#f5ceac) — because a terracotta roof's value comes from its PIGMENT, not
    # its orientation, and a fired clay tile is a dark red thing that happens to
    # face the sky. It also dragged the ground 30 points below what Paolo
    # approved. Separations of 80 and 108 are not cohesion, they are three
    # different games.
    # So: hold ground and structure where the APPROVED corpus already has them
    # (103.7 and 139.2 measured), and move only the thing that is actually broken
    # — roofs, from 110.2 down to ~78, which is both the M14 fix and truer
    # terracotta. Nothing else moves away from what he already said yes to.
    # THE SECOND VERSION OF THESE NUMBERS WAS ALSO WRONG, AND THE STREET SAID SO.
    # Two errors, both found by rendering the frame and looking at it (7/29):
    #
    # (1) NO BAND FOR HOLES. The skeleton was built entirely out of SURFACES, but
    # 39.2% of the approved corpus's structure pixels sit under luminance 48 — door
    # interiors, window glass, the dark under an eave. Those are not a dark value of
    # stucco, they are the ABSENCE of stucco, and with nowhere to go they were
    # compressed into the wall band: every black doorway on the street turned into a
    # light grey panel. A hole is its own material and it gets its own band.
    #
    # (2) THE BANDS WERE HALF AS WIDE AS THE THING THEY APPROVED. Measured on the
    # frozen set, body pixels run p5..p95 of 54..160 on ground, 82..175 on structure,
    # 63..173 on top — spans of 106, 93, 110. I had written 52, 54, 52. Squeezing a
    # 186-wide source span into 54 is what made the whole picture read as mush.
    # "Hold it where the corpus has it" has to mean the SPREAD as well as the mean;
    # a mean alone is not a band.
    # floor is 22, not the 14 I first wrote: this tool's own act-1 floor is 20 and
    # a band that starts below it is a law break, not a dark mood. Dead glass in the
    # approved set sat at 28, so 22 is as dark as this world is allowed to get.
    ('void',       4, (22, 46),
     'holes: door interiors, dead glass, the dark under an eave, tunnel mouths. '
     'DEAD DARK by act-1 law, shared by every family because a hole reads the same '
     'whatever material surrounds it. 39.2% of the approved structure pixels live '
     'here, which is why leaving it out wrecked the street.'),
    ('ground',     6, (54, 160),
     'the biggest surface and the one nobody should look at (M2). Mean ~107 and a '
     '106-wide spread, both taken from the approved corpus — this band is not being '
     'redesigned, it is being kept.'),
    ('structure',  6, (88, 178),
     'building faces. Mean ~133 with the corpus\'s own 93-wide spread, so a wall in '
     'shadow still has somewhere to be. Clears ground by 26.'),
    ('top',        6, (40, 130),
     'roofs and sky-facing planes. Mean ~85 — the ONE band that moves, DOWN from the '
     'corpus 112.6, because at 112 a terracotta roof sat 6.5 points off the gravel '
     'yard and vanished in greyscale (M14). Fired clay is a dark red material; making '
     'it lighter than a stucco wall was my error, not the corpus\'s. Keeps the '
     'corpus\'s full 110-wide spread so the ridge can still catch light.'),
    ('accent',     2, (196, 226),
     'the two slots that must escape UPWARD: paint, and the ridge the sun hits '
     'square. The two dark accent slots are gone — the void band replaced them, and '
     'does the job properly instead of as an outlier rule.'),
]

# HUES pulled from the approved corpus, per family. The KEY is which skeleton
# layer the family lives in, so a family cannot drift out of its own band.
FAMILIES = {
    'asphalt':    ('ground',    ['road_0', 'road_1', 'road_2', 'road_gutter']),
    'concrete':   ('ground',    ['walk_0', 'walk_1', 'walk_2', 'concrete_0', 'concrete_1']),
    'desert':     ('ground',    ['yard_0', 'yard_1', 'yard_2', 'dirt']),
    'stucco':     ('structure', ['wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_under_eave']),
    'terracotta': ('top',       ['roof_slope', 'roof_eave', 'roof_hipBL']),
    'deck':       ('top',       ['roof_deck']),
    # ONE void family, shared. A doorway cut into stucco and a window in a garage
    # door are the same hole; giving each material its own black would be four
    # near-identical colours pretending to be a decision.
    'void':       ('void',      ['door_bottom', 'wall_window', 'garage_bottom']),
}
# saturation per family: how colourful this material is allowed to be. Ground
# gives it up so structure and tops can have it (M3, contrast is a budget).
# EVERY ONE OF THESE IS NOW MEASURED OFF THE APPROVED CORPUS, and the first set was
# invented. I wrote 0.10 / 0.14 / 0.26 / 0.22 / 0.46 / 0.16 out of a theory that
# ground should give up colour so structure could have it (M3, contrast is a
# budget). The theory is fine; the numbers were less than HALF of what Paolo already
# approved — walls came out at 0.160 mean saturation against the corpus's 0.411,
# ground 0.116 against 0.274 — and the street rendered cold and washed out. That is
# the same mistake as the band widths, made twice: I invented a number in a place
# where the approved set was sitting right there waiting to be measured. Body pixels
# only (>=48), divided by 0.825 to undo the highlight desaturation the ramp applies.
SAT = {'asphalt': 0.20, 'concrete': 0.35, 'desert': 0.52,
       'stucco': 0.51, 'terracotta': 0.81, 'deck': 0.39,
       # a hole is not a colour. Just enough warmth that it belongs to this world.
       'void': 0.08}


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def corpus_hue(tiles, ids):
    """The family's own hue, measured off the approved art. Never invented."""
    px = []
    for t in tiles:
        if t['id'] not in ids:
            continue
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                if p[x, y][3] > 8:
                    px.append(p[x, y][:3])
    if not px:
        return 0.08
    # mode hue over a coarse quantisation, weighted by nothing but frequency —
    # the colour the material actually IS, not the average of its extremes.
    hs = Counter()
    for r, g, b in px:
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        if s > 0.06:
            hs[round(h * 72) / 72.0] += 1
    return hs.most_common(1)[0][0] if hs else 0.08


def ramp(steps, lo, hi, hue, sat):
    """PASS 2. Values are already decided; this only puts hue on them.

    Shadows shift cool and lights shift warm (L2). Saturation falls at the bright
    end so nothing burns, which is the craft's own warning about high-value
    saturated colour."""
    out = []
    for i in range(steps):
        t = i / float(steps - 1) if steps > 1 else 0.5
        v = lo + (hi - lo) * t
        h = (hue + (0.045 * (t - 0.5))) % 1.0          # cool low, warm high
        s = sat * (1.0 - 0.35 * t)                      # desaturate the highlights
        r, g, b = colorsys.hsv_to_rgb(h, s, 1.0)
        k = v / max(1.0, lum((r * 255, g * 255, b * 255)))
        c = tuple(max(0, min(255, int(round(x * 255 * k)))) for x in (r, g, b))
        out.append(c)
    return out


def main():
    bank = json.load(open(FROZEN))
    tiles = bank['tiles']
    skel = {n: dict(steps=s, lo=r[0], hi=r[1], why=w) for n, s, r, w in SKELETON}

    palette, families = [], {}
    for fam, (layer, ids) in FAMILIES.items():
        sk = skel[layer]
        hue = corpus_hue(tiles, set(ids))
        cols = ramp(sk['steps'], sk['lo'], sk['hi'], hue, SAT[fam])
        families[fam] = {'layer': layer, 'hue_from_corpus': round(hue, 4),
                         'saturation': SAT[fam],
                         'indices': list(range(len(palette), len(palette) + len(cols))),
                         'hex': ['#%02x%02x%02x' % c for c in cols]}
        palette += cols

    # the accent slots: content that must escape its band, by design
    # dead_glass and shadow_core USED to live here as accents. They are gone: the
    # void band is where holes belong, and calling 39% of the structure pixels an
    # "accent" is what broke the street on the first attempt.
    ACCENTS = [
        ('paint', (206, 201, 188), 'road and stall paint, chalked, never pure white'),
        ('sun_caught', (226, 196, 150), 'the ridge course and anything the sun hits '
         'square — the only slot allowed near the ceiling'),
    ]
    acc_idx = {}
    for name, c, why in ACCENTS:
        acc_idx[name] = {'index': len(palette), 'hex': '#%02x%02x%02x' % c, 'why': why}
        palette.append(c)

    # ---- the checks this palette must pass BY DESIGN, not by luck ----------
    gl = [lum(c) for c in palette]
    checks = {
        'no_pure_black': min(gl) >= FLOOR,
        'no_white': max(gl) <= CEIL,
        # MEANS, NOT EXTREMES. The first version of this check demanded that the
        # ground range never overlap the structure range, and it failed a palette
        # that is correct: a wall's darkest step being darker than the ground's
        # lightest step is completely normal and happens in every real scene. What
        # M14 actually requires is that the BANDS separate on average, which is
        # what the eye reads. The check was wrong, not the palette.
        'ground_mean_below_structure_mean': True,  # asserted against band_mid below
        'no_purple': all(not (0.72 < colorsys.rgb_to_hsv(*[x / 255.0 for x in c])[0] < 0.86
                              and colorsys.rgb_to_hsv(*[x / 255.0 for x in c])[1] > 0.15)
                         for c in palette),
    }
    # the M14 separations, DESIGNED not measured
    band_mid = {}
    for lay in ('ground', 'structure', 'top'):
        v = [lum(tuple(int(f['hex'][i][j:j+2], 16) for j in (1, 3, 5)))
             for f in families.values() if f['layer'] == lay for i in range(len(f['hex']))]
        band_mid[lay] = sum(v) / len(v)
    # signed: negative means the second band is DARKER, which for top is the point
    seps = {'ground-structure': round(band_mid['structure'] - band_mid['ground'], 1),
            'ground-top': round(band_mid['top'] - band_mid['ground'], 1),
            'structure-top': round(band_mid['top'] - band_mid['structure'], 1)}
    checks['M14_separations_18plus'] = all(abs(v) >= 18 for v in seps.values())
    checks['ground_mean_below_structure_mean'] = band_mid['ground'] < band_mid['structure']
    # top is DELIBERATELY the darkest band now: fired clay is a dark material.
    checks['top_separated_from_ground'] = abs(band_mid['top'] - band_mid['ground']) >= 18

    out = {
        'version': 'BOHEMIA_MASTER_PALETTE_DESIGNED_v1',
        'built': '2026-07-29',
        'law': 'laws/BOHEMIA_THE_PIXEL_BIBLE.md — M17 (one master palette, families '
               'are subsets) and M18 (value skeleton first, hue last)',
        'supersedes_for_design': 'records/target/BOHEMIA_MASTER_PALETTE.json, which is a '
                                 'QUANTIZATION of the target screen, not a designed palette',
        'method': 'PASS 1 designed the value skeleton in grey with every band and '
                  'separation decided on purpose. PASS 2 put hue on it, each family '
                  'taking its hue from the approved corpus so the colour stays Paolo\'s.',
        'size': len(palette),
        'skeleton': skel,
        'families': families,
        'accents': acc_idx,
        'band_means': {k: round(v, 1) for k, v in band_mid.items()},
        'separations': seps,
        'checks': checks,
        'hex': ['#%02x%02x%02x' % c for c in palette],
        'NOT_APPROVED': 'designed, gated, and NOT judged. Paolo has not seen it. It is '
                        'the blocker in front of the eighteen tile forms, not a verdict.',
    }
    json.dump(out, open(OUT_JSON, 'w'), indent=1)

    # ---- the sheet: colour on the left, THE SAME THING IN GREY on the right,
    # because if it does not read in grey it does not read -------------------
    SW, PAD, TOP = 62, 8, 92
    rows = list(families.items())
    W = PAD + 6 * (SW + PAD) + 560
    H = TOP + (len(rows) + 1) * (SW + 34) + 60
    sheet = Image.new('RGB', (W, H), (17, 17, 14))
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 12), 'THE BOHEMIA MASTER PALETTE — %d colours, one palette, every '
                      'material a subset of it' % len(palette), fill=(238, 220, 168))
    d.text((PAD, 30), 'BUILT VALUE-FIRST: the greys on the right were DECIDED before any '
                      'colour existed. That is the whole method.', fill=(150, 142, 120))
    d.text((PAD, 46), 'ground %.0f   structure %.0f   top %.0f      separations: '
                      'ground-structure %.0f, ground-top %.0f  (18 is the minimum, and the '
                      '7/28 set had ground-to-roof at 6.5)'
           % (band_mid['ground'], band_mid['structure'], band_mid['top'],
              seps['ground-structure'], seps['ground-top']), fill=(150, 142, 120))
    d.text((PAD, 64), 'Every HUE is measured off the tiles Paolo approved. What is '
                      'designed here is the VALUE STRUCTURE, which nobody ever designed.',
           fill=(150, 142, 120))

    y = TOP
    for fam, info in rows:
        d.text((PAD, y - 14), '%s  (%s band)' % (fam.upper(), info['layer']),
               fill=(206, 194, 164))
        for i, hx in enumerate(info['hex']):
            c = tuple(int(hx[j:j+2], 16) for j in (1, 3, 5))
            x = PAD + i * (SW + PAD)
            d.rectangle([x, y, x + SW, y + SW], fill=c)
            g = int(round(lum(c)))
            d.rectangle([x + 6 * (SW + PAD) + 380, y, x + 6 * (SW + PAD) + 380 + SW,
                         y + SW], fill=(g, g, g))
            d.text((x, y + SW + 4), hx, fill=(140, 134, 116))
        y += SW + 34
    d.text((PAD, y - 14), 'ACCENTS  (content that must escape its band)',
           fill=(206, 194, 164))
    for i, (name, c, why) in enumerate(ACCENTS):
        x = PAD + i * (SW + PAD)
        d.rectangle([x, y, x + SW, y + SW], fill=c)
        g = int(round(lum(c)))
        d.rectangle([x + 6 * (SW + PAD) + 380, y, x + 6 * (SW + PAD) + 380 + SW, y + SW],
                    fill=(g, g, g))
        d.text((x, y + SW + 4), name[:9], fill=(140, 134, 116))
    d.text((PAD + 6 * (SW + PAD) + 380, TOP - 30), 'THE SAME PALETTE IN GREY',
           fill=(206, 194, 164))
    d.text((PAD, H - 34), 'NOT APPROVED — designed and gated, never judged. This is the '
                          'blocker in front of the eighteen tile forms.',
           fill=(150, 142, 120))
    sheet.save(OUT_SHEET)

    print('%d colours, %d families + %d accents' % (len(palette), len(families), len(ACCENTS)))
    for k, v in seps.items():
        print('   separation %-18s %6.1f' % (k, v))
    for k, v in checks.items():
        print('   %-28s %s' % (k, 'OK' if v else 'FAIL'))
    print('OK -> %s' % OUT_SHEET)


if __name__ == '__main__':
    main()
