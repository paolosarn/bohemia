#!/usr/bin/env python3
"""
BOHEMIA — HOUSE MASSING STUDY (7/29/26)

Paolo killed house 01: "so this could be a fucking trailer home bro. a trailer home
with a grage? its ass lowkey... i need you to care about house shapes and shit bro.
like fr."

He is right and the failure was ORDER OF OPERATIONS. I got the door right to the
millimetre before deciding what the building WAS. Human sizing is a CONSTRAINT.
Shape is the DESIGN, and it comes first. So this turn shows him SHAPE and nothing
else: no windows, no stucco tooth, no detail to hide behind. If a silhouette does
not read as a house with the detail stripped off, no amount of detail will save it.

WHAT THE RESEARCH SAYS, and every line convicted house 01:
  - a mobile home reads as one at 2:12 to 3:12 pitch with about 6 in eaves.
    Site-built is 4:12 or steeper with 12 to 16 in eaves. "Without eaves, most
    homes look like a cheap box."   [homenation, greenotter, braustin]
  - the suburban types that read as HOUSES all carry a MASSING BREAK: the L-ranch
    (bar plus projecting wing, cross gable at the junction), the snout house
    (garage pushed forward to the street with its own gable, the late-80s type),
    the cross-gable ranch (a gable END facing the street over the entry), the
    two-story, the split-level.        [georgia encyclopedia, theplancollection]
  - the ONE type with no break is the hip ranch with the garage swallowed into the
    main volume. That is exactly what I drew, with the shallowest roof available.

SO THE TRAILER IS ON THE SHEET, drawn to the same scale, first. He named the
failure; the honest thing is to show I can draw the failure deliberately and show
what separates it from each of the others. A single-wide is 3.7 x 18.3 m — long,
thin, 2:12, six inch eaves, and no break anywhere.

REUSE CHECK: cooks no new colour. Every value comes from
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, the set he approved on 7/28
and chose again on 7/29 ("A"), through the same ramp_from used by the house cook —
which now refuses anything over the act-1 ceiling after it handed back a 252
highlight and I filled a roof plane with it.

  python3 tools/bohemia_house_massing.py -> records/target/HOUSE_MASSING.png
"""
import base64
import io
import json
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT = 'records/target/HOUSE_MASSING.png'
SPRITE = 'records/target/HERO_SPRITE.png'
SPRITE_BOX = 'records/target/HERO_SPRITE.json'

CELL_M, CELL_PX = 0.75, 44.0
PX_M = CELL_M / CELL_PX
BG, INK, DIM = (18, 18, 20), (236, 232, 224), (150, 146, 140)
ACC, BAD = (199, 154, 63), (255, 122, 109)


def m(v):
    return int(round(v / PX_M))


# ---------------------------------------------------------------------------
# THE TYPES. Each one is a real suburban massing, and each is defined by its
# BREAK and its PITCH, because those are the two things that decide whether a
# thing reads as a house. w/d in metres, pitch as rise:12, eave in metres.
# blocks: (x, depth, width, plate, roof) laid out left to right along the street
#   roof: 'hip' | 'gableEnd' (a triangle facing the street) | 'flat-ish'
# ---------------------------------------------------------------------------
TYPES = [
    dict(key='TRAILER', name='SINGLE-WIDE TRAILER',
         note='3.7 x 18.3 m. 2:12 pitch, 6 in eave, no break anywhere. '
              'THIS IS WHAT HOUSE 01 WAS.',
         pitch=2, eave=0.15, bad=True, depth=3.7,
         blocks=[(0.0, 18.3, 2.30, 'hip')]),
    dict(key='HIP', name='HIP RANCH  (what I gave you)',
         note='one bar, garage swallowed into the main volume, 4:12. The only '
              'suburban type with NO massing break.',
         pitch=4, eave=0.61, bad=True, depth=9.0,
         blocks=[(0.0, 15.0, 2.44, 'hip')]),
    dict(key='LRANCH', name='L-RANCH',
         note='main bar plus a wing that projects toward the street, cross gable '
              'where they meet. 5:12.',
         pitch=5, eave=0.46, depth=9.0,
         blocks=[(0.0, 9.5, 2.44, 'hip'), (9.5, 6.0, 2.60, 'gableEnd')]),
    dict(key='SNOUT', name='SNOUT HOUSE',
         note='the late-80s type: the two-car garage is pushed FORWARD of the '
              'house with its own gable over it. 5:12.',
         pitch=5, eave=0.46, depth=9.0,
         blocks=[(0.0, 6.2, 2.70, 'gableEnd'), (6.2, 9.5, 2.44, 'hip')]),
    dict(key='XGABLE', name='CROSS-GABLE RANCH',
         note='a gable END faces the street over the entry, breaking the long '
              'hip. 6:12 — the steepest here.',
         pitch=6, eave=0.46, depth=9.0,
         blocks=[(0.0, 5.5, 2.44, 'hip'), (5.5, 4.5, 2.75, 'gableEnd'),
                 (10.0, 5.0, 2.44, 'hip')]),
    dict(key='TWOSTORY', name='TWO-STORY',
         note='two plates stacked, 5.2 m to the eave. Nothing kills the trailer '
              'read faster than height. 6:12.',
         pitch=6, eave=0.46, depth=9.0,
         blocks=[(0.0, 11.0, 5.20, 'hip'), (11.0, 6.0, 2.60, 'gableEnd')]),
    dict(key='SPLIT', name='SPLIT-LEVEL',
         note='half the house steps up. Two plates at different heights on one '
              'footprint. 5:12.',
         pitch=5, eave=0.46, depth=9.0,
         blocks=[(0.0, 7.5, 2.44, 'hip'), (7.5, 7.5, 3.90, 'hip')]),
]

SCALE_W = m(19.5)


def panel_height(t):
    tall = 0
    for (_bx, bw_m, plate_m, roof) in t['blocks']:
        span = bw_m if roof == 'gableEnd' else t['depth']
        tall = max(tall, m(plate_m) + m((span / 2.0) * (t['pitch'] / 12.0)))
    return tall + 96          # room for the two label lines and the footer


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def main():
    import importlib.util
    spec = importlib.util.spec_from_file_location('hc', 'tools/bohemia_house_cook.py')
    hc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(hc)
    bank = json.load(open(BANK))
    stucco = hc.ramp_from(bank, {'wall_0', 'wall_1', 'wall_2', 'wall_base'}, 5)
    tile = hc.ramp_from(bank, {'roof_slope', 'roof_ridge', 'roof_eave'}, 5)

    hero = None
    if os.path.exists(SPRITE):
        bx, by, bw, bh = json.load(open(SPRITE_BOX))
        hero = Image.open(SPRITE).convert('RGBA').crop((bx, by, bx + bw, by + bh))

    HDR = 96
    heights = [panel_height(t) for t in TYPES]
    sheet = Image.new('RGB', (SCALE_W + 52, HDR + sum(heights) + 30), BG)
    d = ImageDraw.Draw(sheet)
    d.text((26, 14), 'HOUSE SHAPES   SILHOUETTE ONLY, NO DETAIL', fill=INK)
    d.text((26, 34), 'Detail hides a bad shape. If it does not read as a house here, '
                     'it never will.', fill=DIM)
    d.text((26, 52), 'All to the same scale, all with the same man. '
                     '1 pixel = 1.7 cm.', fill=DIM)
    d.text((26, 70), 'What separates a house from a trailer: A BREAK IN THE MASSING, '
                     'ROOF PITCH, AND EAVE.', fill=ACC)

    for i, t in enumerate(TYPES):
        top = HDR + sum(heights[:i])
        col = BAD if t.get('bad') else ACC
        d.text((26, top + 6), '%d.  %s' % (i + 1, t['name']), fill=col)
        d.text((26, top + 24), t['note'], fill=DIM)

        ground = top + heights[i] - 54
        eave_px = m(t['eave'])
        # draw far blocks first so a projecting wing overlaps correctly
        for (bx_m, bw_m, plate_m, roof) in t['blocks']:
            x0 = 26 + m(bx_m)
            x1 = x0 + m(bw_m)
            plate = m(plate_m)
            # ROOF RISE IS THE PITCH, HONESTLY COMPUTED. A 2:12 trailer gets a
            # sliver and a 6:12 house gets a real triangle — that ratio IS the
            # difference he is being asked to look at.
            span = bw_m if roof == 'gableEnd' else t['depth']
            rise = m((span / 2.0) * (t['pitch'] / 12.0))
            # walls
            d.rectangle([x0, ground - plate, x1 - 1, ground], fill=stucco[3])
            d.rectangle([x0, ground - plate, x0 + 2, ground], fill=stucco[2])
            # roof
            ry = ground - plate
            if roof == 'gableEnd':
                # a triangle facing the street: the strongest break there is
                d.polygon([(x0 - eave_px, ry), (x1 - 1 + eave_px, ry),
                           ((x0 + x1) // 2, ry - rise)], fill=tile[3])
                d.line([(x0 - eave_px, ry), ((x0 + x1) // 2, ry - rise)], fill=tile[4])
                d.line([((x0 + x1) // 2, ry - rise), (x1 - 1 + eave_px, ry)],
                       fill=tile[1])
            else:
                # a hip seen nearly side-on: a shallow band, plus the eave line
                d.rectangle([x0 - eave_px, ry - rise, x1 - 1 + eave_px, ry],
                            fill=tile[3])
                d.polygon([(x0 - eave_px, ry), (x0 - eave_px + rise, ry - rise),
                           (x0 - eave_px, ry - rise)], fill=tile[4])
                d.polygon([(x1 - 1 + eave_px, ry), (x1 - 1 + eave_px - rise, ry - rise),
                           (x1 - 1 + eave_px, ry - rise)], fill=tile[1])
            # THE EAVE, drawn as its own dark line because it is one of the three
            # things that decides this. Six inches is a line; sixteen is a shadow.
            d.rectangle([x0 - eave_px, ry, x1 - 1 + eave_px, ry + max(2, eave_px // 3)],
                        fill=tile[0])

        if hero:
            sheet.paste(hero, (26 + m(1.0), ground - hero.size[1]), hero)
        d.line([(26, ground), (26 + SCALE_W - 30, ground)], fill=(60, 58, 54))
        d.text((26, ground + 12),
               'pitch %d:12   eave %d in   %s'
               % (t['pitch'], int(round(t['eave'] / 0.0254)),
                  'NO BREAK' if len(t['blocks']) == 1 else
                  '%d masses' % len(t['blocks'])), fill=col)

    sheet.save(OUT)
    print('%d shapes -> %s  %s' % (len(TYPES), OUT, sheet.size))
    for t in TYPES:
        print('   %-22s pitch %d:12  eave %2d in  %d mass(es)%s'
              % (t['name'][:22], t['pitch'], int(round(t['eave'] / 0.0254)),
                 len(t['blocks']), '   <- reads as a trailer' if t.get('bad') else ''))


if __name__ == '__main__':
    main()
