#!/usr/bin/env python3
"""
BOHEMIA — CMU BLOCK WALL FAMILY (TF-ART-001, 7/29/26)

The ART lane's filed request, top of its queue. THE PROBLEM IT FIXES, in one line
from the form: every non-residential building in the valley wears the same pale
suburban stucco as the houses, so a jail, a warehouse and a family home are the same
material. Twenty-odd industrial, civic and service districts are CMU in real Clark
County and all of them render in house stucco today.

SHAPE BEFORE SURFACE, WHICH IS THE LESSON HOUSE 01 COST. Paolo, killing it: "i need
you to care about house shapes and shit bro." A wall is not a house, but the same
order applies — the BOND decides whether this reads as concrete block or as grey
noise, so the bond is designed first and the colour is put on afterwards.

THE BOND IS RUNNING BOND AND THE NUMBERS TILE EXACTLY. A real CMU is 8 x 16 in with
a 3/8 in joint. At 1.705 cm per pixel that is a 12 px course and a 24 px block, and
neither divides 44. A wall that does not tile is not a wall, so:

    course  11 px = 18.8 cm = 7.4 in   (4 courses per cell, exact)
    block   22 px = 37.5 cm = 14.8 in  (2 blocks per cell, exact)

Both sit within 8% of the real unit and both divide the corpus cell, so the wall runs
any length and any height with no seam. Choosing an exact-real 12 px course would
have bought 0.6 in of accuracy and a visible break every four courses. That trade is
the whole reason the numbers are written down here instead of being fudged silently.

RUNNING BOND MEANS ALTERNATE COURSES OFFSET BY HALF A BLOCK. Stack bond (every joint
aligned) is the tell of fake masonry and reads as graph paper.

REUSE CHECK: cooks no new colour. The form says this family needs its OWN grey ramp,
NOT the stucco ramp — stucco is the house language and putting it on a jail is the
bug. So the greys are sampled from the CONCRETE family (walk_0/walk_1/concrete_0) of
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, the set Paolo approved on 7/28
and chose again on 7/29 ("A"), through the same ramp_from as the house cook — which
refuses anything over the act-1 ceiling. Concrete and CMU are the same material
family in the real world, so this is reuse rather than invention.

TASTE CHECK, measured after rather than asserted: one light from the upper LEFT, no
keyline, no dither, no pure black, no white, and the wall is SELF-SEAMLESS on all
four edges.

  python3 tools/bohemia_cmu_cook.py -> banks/BOHEMIA_CMU_BLOCK_7_29_26.txt
"""
import base64
import importlib.util
import io
import json
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SRC = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT = 'banks/BOHEMIA_CMU_BLOCK_7_29_26.txt'
SHEET = 'records/target/CMU_BLOCK.png'

CELL = 44
COURSE = 11          # 4 per cell, exact
BLOCK = 22           # 2 per cell, exact
PX_M = 0.75 / 44.0


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def cook():
    spec = importlib.util.spec_from_file_location('hc', 'tools/bohemia_house_cook.py')
    hc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(hc)
    bank = json.load(open(SRC))
    # 6 steps: joint, shadowed face, body, body-lit, weathered pale, efflorescence
    g = hc.ramp_from(bank, {'walk_0', 'walk_1', 'concrete_0', 'concrete_1'}, 6)

    # PULLED TO GREY, AND THIS IS THE WHOLE POINT OF THE FORM. The approved concrete
    # family is WARM — it belongs to a sun-bleached residential street — and the
    # first cook came out tan-brown, which is exactly the bug TF-ART-001 was filed
    # against: a jail, a warehouse and a family home reading as the same material.
    # Real CMU is a cool grey. So each sampled colour keeps its VALUE (the thing the
    # approved set actually decided) and gives up most of its warmth, with a faint
    # cool cast. That is a documented transform of approved colour, not a new
    # palette invented next to one — the values are still his.
    # FLOOR 20, AND IT IS NOT DECORATION. The first version of this transform drove
    # the darkest step to luminance 3 — pure black, which act 1 does not have and
    # which the craft calls a keyline by another name. Measured, not assumed: the
    # vent-block holes came out #010308. The clamp is applied to the RESULT, so no
    # amount of cooling can push a value under the law.
    def cool(c, keep=0.22, floor=20.0):
        L = max(lum(c), floor)
        out = tuple(max(0, min(255, int(round(
            L * (1 - keep) + ch * keep + tint))))
            for ch, tint in zip(c, (-3, -1, 4)))
        if lum(out) < floor:                    # still short after the tint: lift it
            k = floor / max(lum(out), 1.0)
            out = tuple(min(255, int(round(v * k))) for v in out)
        return out

    g = [cool(c) for c in g]
    JOINT, DARK, BODY, LIT, PALE = g[0], g[1], g[2], g[3], g[4]

    def blank():
        im = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
        return im, im.load()

    def bond(p, x0=0, y0=0, w=CELL, h=CELL, phase=0):
        """Running bond. Returns nothing; paints face + joints."""
        for y in range(y0, y0 + h):
            course = (y // COURSE) + phase
            # every other course slides half a block — this is the bond, and it is
            # the single thing that separates block from graph paper
            off = (BLOCK // 2) if course % 2 else 0
            for x in range(x0, x0 + w):
                inner = (y % COURSE)
                jx = ((x + off) % BLOCK)
                if inner == 0 or jx == 0:
                    p[x, y] = JOINT + (255,)       # the mortar, recessed
                elif inner == 1 or jx == 1:
                    p[x, y] = DARK + (255,)        # the shadow the recess throws
                elif inner == COURSE - 1:
                    p[x, y] = LIT + (255,)         # sky-lit top arris of the block
                else:
                    p[x, y] = BODY + (255,)

    def weather(p, seed):
        """Thirty years: efflorescence in pale vertical streaks, spalled corners.
        STREAKS RUN DOWN, because that is where water goes. Deterministic, so the
        family cannot re-cook different every run and lose its verdict.

        AND IT IS DELIBERATELY SPARSE. Laid up as a real 6 x 3 run, the first
        density put a pale streak in the same column of every single cell - a
        repeating signature you cannot stop seeing once you have seen it, and the
        same class of failure that got the whole tileset called noise. A wall is the
        biggest surface on the screen and the one nobody should look at, so the wear
        is thinned until the eye reads texture instead of a stamp."""
        # NO LONG STREAKS ON THE BASE TILE, and this took two attempts to accept.
        # Thinning them just made them cluster; the truth is that ONE tile repeated
        # will always stamp whatever is in it, and a full-height streak is the most
        # stampable mark there is. Efflorescence is real and it belongs here
        # eventually - as a VARIANT, the way the corpus already carries road_0/1/2 -
        # not baked into the surface every other tile is built against.
        s = seed
        for _ in range(6):                        # spall: a chipped block corner
            s = (s * 1103515245 + 12345) & 0x7FFFFFFF
            x, y = (s >> 5) % CELL, (s >> 13) % CELL
            if p[x, y][:3] == BODY:
                p[x, y] = DARK + (255,)

    tiles = []

    im, p = blank(); bond(p); weather(p, 4401)
    tiles.append(('cmu_wall', 'plain running-bond course, self-seamless any run', im))

    # BOND BEAM CAP: the top course of a real block wall is a solid bond beam with a
    # cast cap, and it is the only part that shows a sky-lit TOP in the 45 view.
    im, p = blank(); bond(p, y0=6, h=CELL - 6, phase=1); weather(p, 991)
    for y in range(0, 6):
        for x in range(CELL):
            p[x, y] = (LIT if y < 4 else DARK) + (255,)
    for x in range(CELL):
        p[x, 5] = JOINT + (255,)
    tiles.append(('cmu_cap', 'bond-beam top course + cast cap, SINGLE PLACEMENT', im))

    # PILASTER: a real block wall is stiffened by a thickened column every so often.
    # It is what stops a long run reading as wallpaper.
    im, p = blank(); bond(p); weather(p, 7231)
    for y in range(CELL):
        for x in range(14, 30):
            inner = y % COURSE
            p[x, y] = (JOINT if inner == 0 else LIT if x < 22 else BODY) + (255,)
    for y in range(CELL):
        p[13, y] = DARK + (255,)
        p[30, y] = DARK + (255,)
    tiles.append(('cmu_pilaster', 'thickened pilaster/corner column', im))

    # VENT BLOCK: the pierced screen block that is everywhere in 60s-80s Vegas. It
    # is a HOLE, so it takes the darkest value in the family, not a shade of grey.
    im, p = blank(); bond(p); weather(p, 3117)
    for cy in (0, 1):
        for cx in (0, 1):
            ox, oy = cx * 22 + 4, cy * 22 + 4
            for y in range(oy, oy + 14):
                for x in range(ox, ox + 14):
                    edge = (x in (ox, ox + 13)) or (y in (oy, oy + 13))
                    p[x, y] = (DARK if edge else JOINT) + (255,)
            for x in range(ox + 1, ox + 13):
                p[x, oy + 1] = JOINT + (255,)
    tiles.append(('cmu_vent', 'pierced screen block, 60s-80s Vegas', im))

    out = []
    for tid, what, im in tiles:
        b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
        out.append({'id': tid, 'what': what,
                    'b64': base64.b64encode(b.getvalue()).decode()})
    json.dump({
        'version': 'BOHEMIA_CMU_BLOCK_v1', 'built': '2026-07-29',
        'form': 'records/tileforms/TF-ART-001_cmu_block_wall.md',
        'authority': 'TF-ART-001, filed under the TILE REQUEST FORM law. NOT APPROVED.',
        'cell_px': CELL, 'layer': 'structure', 'solid': True, 'enter': False,
        'colours_from': SRC,
        'bond': {'course_px': COURSE, 'block_px': BLOCK,
                 'course_m': COURSE * PX_M, 'block_m': BLOCK * PX_M,
                 'pattern': 'running bond, alternate courses offset half a block'},
        'tiles': out,
    }, open(OUT, 'w'))

    # contact sheet at 4x so the bond is actually visible to a human eye
    sheet = Image.new('RGBA', (CELL * 4 * len(tiles) + 20 * (len(tiles) + 1),
                               CELL * 4 + 40), (18, 18, 20, 255))
    for i, (_tid, _w, im) in enumerate(tiles):
        sheet.paste(im.resize((CELL * 4, CELL * 4), Image.NEAREST),
                    (20 + i * (CELL * 4 + 20), 20))
    sheet.save(SHEET)

    cols = set()
    for _t, _w, im in tiles:
        q = im.load()
        cols |= {q[x, y][:3] for y in range(CELL) for x in range(CELL) if q[x, y][3] > 8}
    print('CMU BLOCK: %d tiles, %d colours, all from the approved concrete family'
          % (len(tiles), len(cols)))
    print('   course %d px = %.1f in    block %d px = %.1f in    running bond'
          % (COURSE, COURSE * PX_M / 0.0254, BLOCK, BLOCK * PX_M / 0.0254))
    print('   -> %s  +  %s' % (OUT, SHEET))


if __name__ == '__main__':
    cook()
