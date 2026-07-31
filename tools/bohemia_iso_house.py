#!/usr/bin/env python3
"""
BOHEMIA — HOUSE 02, DRAWN THE WAY ISOMETRIC GAMES ACTUALLY DRAW HOUSES (7/29/26)

Paolo: "BRO WE NEED TO GET 1 house shape done bro do big brain online research and
execute WHEN IN DOUBT HOW TO OTHER ISOMETRIC PIXEL GAMES MAKES HOUSES COPY THEM TO
START OFF HOLY SHIT"

HE IS RIGHT AND THE RESEARCH SAYS I WAS DRAWING THE WRONG THING ENTIRELY. Both dead
attempts were FLAT ELEVATIONS — a building seen face-on, one wall, like a 2D
platformer. That is not what an isometric game draws:

  "isometric projection uses a tilted top-down view that ROTATES THE BUILDING 45
   DEGREES, allowing you to display a great deal of information by revealing THE
   ROOF AND MULTIPLE WALLS AT THE SAME TIME"            [slynyrd, pixelblog 41]

  "in pixel art this is most closely achieved by using angled lines with a 2:1
   PIXEL RATIO" — two across for every one down, 26.565 degrees rather than a true
   30, because 2:1 gives a perfectly even staircase needing no anti-aliasing.
   Technically dimetric; universally called isometric.  [the-pixel.art, pixnote]

  the method: "start with a floor plan on the isometric grid, then EXTRUDE WALLS
   UPWARD", then the roof. Shade the three visible faces with strong contrast, since
   "the satisfying sense of depth comes from contrast in light where sharp angles
   meet."                                               [tuts+, pixel parmesan]

THE GRID FALLS OUT OF THE CORPUS CELL WITH NO FUDGING, which is how you know 2:1 is
right here: the cell is 44 px, so the diamond is 44 x 22, exactly 2:1, a one-cell
cube stands 22 px, and 1 m of height is 22/0.75 = 29.3 px.

AND IT IS TWO MASSES, BECAUSE MY OWN GATE SAYS SO. The first isometric draw was a
single box with one long gable and it read as a barn — the identical failure as
house 01 reading as a trailer, in a new projection. gates/house_shape_gate.py demands
>= 2 masses, >= 4:12 pitch, >= 12 in eave, nothing over 3.5:1, and that draw would
have FAILED my own law. So this is an L: a main bar with its ridge along X, and a
front wing projecting toward the street carrying its own gable END.

REUSE CHECK — THE LAW I BROKE ON HOUSE 01. Paolo approved THIRTY house skins on 7/21
(banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt, status CANON, all 30 UP) and I drew
two houses without opening it. Sampling colours off street tiles and calling that
reuse is a reuse check in name only. This opens HIS skin bank and takes its real
materials: walls from wall_plain_8..11, roof from roof_shingle_0..5, door from
wall_door_18..20, glass from wall_window_12. Nothing is invented, and
gates/iso_house_gate.py VERIFIES that every colour in the output exists in his bank
rather than taking this paragraph's word for it.

  python3 tools/bohemia_iso_house.py -> banks/BOHEMIA_HOUSE_02_ISO_7_29_26.txt
"""
import base64
import io
import json
import os
from collections import Counter

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SKINS = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
OUT = 'banks/BOHEMIA_HOUSE_02_ISO_7_29_26.txt'
PNG = 'records/target/HOUSE_02_ISO.png'

# FACING. Paolo 7/30, on the south-west version: "Perfect now imagine instead of it
# facing southwest it was facing south!!"
#
# SOUTH-WEST is the classic isometric diamond: the building turned 45 degrees to the
# camera, so you see two walls meeting at a near corner. SOUTH is the same solid,
# rotated 45 degrees the other way so its FRONT squares up to the screen — which is
# the view the corpus street already renders, walls facing the bottom of the screen
# and roofs seen from above, foreshortened 2:1.
#
# The building is NOT redrawn for this. Same masses, same metres, same roof geometry,
# same colours; only the projection and which faces are visible change. That is the
# whole payoff of having built it as a solid instead of as a picture of a solid: it
# can be turned.
FACING = os.environ.get('BOH_FACING', 'south')

CELL_M = 0.75
TW, TH = 44, 22
HW, HH = TW // 2, TH // 2
PXM = TH / CELL_M                 # 29.3 px per vertical metre

# PROPORTION, AND THE FIRST ISO DRAW GOT IT WRONG IN A WAY ONLY ISO EXPOSES. A 6:12
# roof over a 9 m depth is geometrically right, but in isometric the roof plane ALSO
# spans the depth on screen, so its drawn height is (depth/2)*HH + rise — it came out
# twice the wall and the house read as a barn. A shallower pitch and less depth put
# the roof back under the wall where the eye expects it. 5:12 is still well clear of
# the 2-3:12 that reads as manufactured housing.
PITCH = 5
EAVE_M = 0.46                     # 18 in. Manufactured housing runs about 6.
PLATE_M = 2.70                    # 8'10", a real Vegas stucco plate

# THE TWO MASSES, in cells. 'ridge' is the axis the ridge RUNS ALONG, so a wing with
# ridge 'y' shows its gable END to the street, which is the whole point of the wing.
MAIN = dict(x0=0, y0=0, w=18, d=10, ridge='x')
WING = dict(x0=3, y0=10, w=7, d=5, ridge='y')
FOOT_W = MAIN['w']
FOOT_D = MAIN['d'] + WING['d']


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def ramp_of(bank, prefixes, n):
    """REUSE: the real colours out of HIS approved skins, darkest first."""
    cnt = Counter()
    for t in bank['tiles']:
        if not t['id'].startswith(tuple(prefixes)):
            continue
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                if p[x, y][3] > 8:
                    cnt[p[x, y][:3]] += 1
    top = [c for c, _ in cnt.most_common(max(n * 4, 16)) if lum(c) <= 232]
    top.sort(key=lum)
    if len(top) <= n:
        return top
    step = (len(top) - 1) / float(n - 1)
    return [top[int(round(i * step))] for i in range(n)]


def main():
    bank = json.load(open(SKINS))
    wall = ramp_of(bank, ['wall_plain'], 5)
    roof = ramp_of(bank, ['roof_shingle'], 5)
    door_c = ramp_of(bank, ['wall_door'], 4)
    glass = ramp_of(bank, ['wall_window'], 3)[0]

    plate = int(round(PLATE_M * PXM))
    ev = EAVE_M / CELL_M                       # eave, in cells

    def rise_of(mss):
        span = (mss['d'] if mss['ridge'] == 'x' else mss['w']) * CELL_M
        return int(round((span / 2.0) * (PITCH / 12.0) * PXM))

    top_rise = max(rise_of(MAIN), rise_of(WING))
    if FACING == 'south':
        W = int((FOOT_W + 2) * TW)
        H = int(FOOT_D * HH + plate + top_rise + 64)
        OX_S, OY_S = TW, int(24 + plate + top_rise)
        OX = OY = 0
    else:
        W = int((FOOT_W + FOOT_D + 4) * HW)
        H = int((FOOT_W + FOOT_D + 4) * HH + plate + top_rise + 40)
        OX = int((FOOT_D + 2) * HW)
        OY = int(24 + plate + top_rise)
        OX_S = OY_S = 0

    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def P(cx, cy, z=0):
        """cell coords -> screen. Both projections live here and nowhere else."""
        if FACING == 'south':
            # front squared to the screen; depth foreshortened 2:1, same as the
            # diamond's, so a cube still reads as a cube and heights are unchanged
            return (OX_S + cx * TW, OY_S + cy * HH - z)
        return (OX + (cx - cy) * HW, OY + (cx + cy) * HH - z)

    def draw_mass(mss):
        x0, y0 = mss['x0'], mss['y0']
        x1, y1 = x0 + mss['w'], y0 + mss['d']
        rise = rise_of(mss)

        if FACING == 'south':
            # SOUTH: the front squares up to the screen, so ONE wall is visible and
            # the side walls are edge-on — drawing them would paint a zero-width
            # sliver of the wrong value down the corner.
            d.polygon([P(x0, y1), P(x1, y1), P(x1, y1, plate), P(x0, y1, plate)],
                      fill=wall[3])
            d.line([P(x0, y1), P(x0, y1, plate)], fill=wall[1])
            d.line([P(x1, y1), P(x1, y1, plate)], fill=wall[1])
            for i in range(int(round(0.30 * PXM))):      # eave shadow on the wall
                d.line([P(x0, y1, plate - i), P(x1, y1, plate - i)], fill=wall[1])

            if mss['ridge'] == 'x':
                # ridge runs across the screen: you see the near slope as a band and
                # nothing of the far one. The gable ends are edge-on.
                mid = (y0 + y1) / 2.0
                ra, rb = P(x0 - ev, mid, plate + rise), P(x1 + ev, mid, plate + rise)
                near = [P(x0 - ev, y1 + ev, plate), P(x1 + ev, y1 + ev, plate), rb, ra]
                # THE FAR SLOPE, as a sliver above the ridge. Without it the ridge is
                # just where one flat colour stops, and the whole roof reads as a
                # second wall - which is exactly what the first south draw did. From
                # above you always catch a little of the back slope, and that band is
                # what makes the ridge an EDGE instead of a boundary.
                back = int(round(0.55 * PXM))
                d.polygon([(ra[0], ra[1] - back), (rb[0], rb[1] - back), rb, ra],
                          fill=roof[1])
                d.polygon(near, fill=roof[3])
                d.line([ra, rb], fill=roof[4])
                # SHINGLE COURSES, and the first pass had them so faint the roof
                # read as one flat slab. A roof this size in this projection is the
                # biggest single shape on the building, so it has to carry real
                # texture or it becomes a second wall. Courses every ~14 in with a
                # full step of contrast, plus the vertical tab breaks that make
                # shingles read as shingles rather than as stripes.
                top_y, bot_y = ra[1], near[0][1]
                nc = max(6, int((bot_y - top_y) / (0.36 * PXM)))
                for k in range(1, nc):
                    yy = top_y + (bot_y - top_y) * (k / float(nc))
                    d.line([(ra[0], yy), (rb[0], yy)], fill=roof[1])
                    d.line([(ra[0], yy - 1), (rb[0], yy - 1)], fill=roof[4])
                    off = 0 if k % 2 else int(TW * 0.25)
                    for xx in range(int(ra[0]) + off, int(rb[0]), int(TW * 0.5)):
                        d.line([(xx, yy - int(0.36 * PXM)), (xx, yy - 1)],
                               fill=roof[2])
                # THE FASCIA. A hard dark line where the roof stops is the single
                # cheapest thing that stops a roof floating: it is the board the
                # gutter hangs on, and the corpus roof already reads that way.
                d.line([near[0], near[1]], fill=roof[0])
                d.line([(near[0][0], near[0][1] + 1), (near[1][0], near[1][1] + 1)],
                       fill=roof[0])
            else:
                # ridge runs INTO the screen: the gable END faces the viewer square
                # on, which is the strongest shape a house can show a street, and
                # both slopes are visible running away from it.
                mid = (x0 + x1) / 2.0
                for (ax, bx, col) in ((x0 - ev, mid, roof[3]), (mid, x1 + ev, roof[1])):
                    d.polygon([P(ax, y1 + ev, plate if ax != mid else plate + rise),
                               P(bx, y1 + ev, plate + rise if bx == mid else plate),
                               P(bx, y0 - ev, plate + rise if bx == mid else plate),
                               P(ax, y0 - ev, plate if ax != mid else plate + rise)],
                              fill=col)
                # COURSES ON THE WING'S SLOPES TOO. Leaving them flat next to a
                # textured main roof made them read as cardboard taped on. Here the
                # eave runs INTO the screen, so the courses run that way as well and
                # appear as near-vertical banding rather than as horizontal stripes.
                for k in range(1, 9):
                    t = k / 9.0
                    for (ax, bx) in ((x0 - ev, mid), (mid, x1 + ev)):
                        xx = ax + (bx - ax) * t
                        za = plate + rise * (t if ax == x0 - ev else 1 - t)
                        d.line([P(xx, y1 + ev, za), P(xx, y0 - ev, za)],
                               fill=roof[2] if k % 2 else roof[4])
                d.line([P(mid, y1 + ev, plate + rise), P(mid, y0 - ev, plate + rise)],
                       fill=roof[4])
                # the wing's own fascia, same reason as the main bar's
                d.line([P(x0 - ev, y1 + ev, plate), P(mid, y1 + ev, plate + rise)],
                       fill=roof[0])
                d.line([P(mid, y1 + ev, plate + rise), P(x1 + ev, y1 + ev, plate)],
                       fill=roof[0])
                gable = [P(x0, y1, plate), P(x1, y1, plate), P(mid, y1, plate + rise)]
                d.polygon(gable, fill=wall[2])
                d.line([gable[0], gable[2]], fill=roof[0])
                d.line([gable[1], gable[2]], fill=roof[0])
            return (x0, y0, x1, y1)

        # WALLS. Two faces visible; each takes ONE flat value, because the contrast
        # where they meet IS the depth. Blending them would flatten the corner.
        d.polygon([P(x0, y1), P(x1, y1), P(x1, y1, plate), P(x0, y1, plate)],
                  fill=wall[3])                              # down-left, into light
        d.polygon([P(x1, y1), P(x1, y0), P(x1, y0, plate), P(x1, y1, plate)],
                  fill=wall[1])                              # down-right, away
        d.line([P(x1, y1), P(x1, y1, plate)], fill=wall[0])  # the hard corner

        # EAVE SHADOW on the wall under the overhang — one of the three things the
        # research names as separating a house from a manufactured home.
        for i in range(int(round(0.30 * PXM))):
            d.line([P(x0, y1, plate - i), P(x1, y1, plate - i)], fill=wall[1])
            d.line([P(x1, y1, plate - i), P(x1, y0, plate - i)], fill=wall[0])

        if mss['ridge'] == 'x':
            mid = (y0 + y1) / 2.0
            ra, rb = P(x0, mid, plate + rise), P(x1, mid, plate + rise)
            near = [P(x0 - ev, y1 + ev, plate), P(x1 + ev, y1 + ev, plate), rb, ra]
            far = [ra, rb, P(x1 + ev, y0 - ev, plate), P(x0 - ev, y0 - ev, plate)]
            gable = [P(x1, y1, plate), P(x1, y0, plate), rb]
        else:
            mid = (x0 + x1) / 2.0
            ra, rb = P(mid, y0, plate + rise), P(mid, y1, plate + rise)
            near = [P(x1 + ev, y0 - ev, plate), P(x1 + ev, y1 + ev, plate), rb, ra]
            far = [ra, rb, P(x0 - ev, y1 + ev, plate), P(x0 - ev, y0 - ev, plate)]
            gable = [P(x0, y1, plate), P(x1, y1, plate), rb]

        d.polygon(far, fill=roof[1])
        d.polygon(near, fill=roof[3])
        d.polygon(gable, fill=wall[2])          # the gable wall, its own value
        d.line([gable[0], gable[2]], fill=roof[0])
        d.line([gable[1], gable[2]], fill=roof[0])
        d.line([ra, rb], fill=roof[4])          # the ridge cap catches the sky

        # SHINGLE COURSES run along the roof's own 2:1 direction. A horizontal line
        # on an isometric plane reads as a sticker laid over the top of it.
        for k in range(1, 11):
            t = k / 11.0
            a = (near[3][0] + (near[0][0] - near[3][0]) * t,
                 near[3][1] + (near[0][1] - near[3][1]) * t)
            b = (near[2][0] + (near[1][0] - near[2][0]) * t,
                 near[2][1] + (near[1][1] - near[2][1]) * t)
            d.line([a, b], fill=roof[2] if k % 2 else roof[4])
        return (x0, y0, x1, y1)

    # PAINTER'S ORDER IS NOT A SORT HERE, IT IS THE DESIGN. The wing exists to stand
    # in FRONT of the main bar, so the bar goes down first and the wing over it. A
    # generic depth sort on the nearest corner gets this backwards, because the long
    # bar's far end reaches closer to the viewer than the short wing does.
    draw_mass(MAIN)

    wh, sill = int(round(1.22 * PXM)), int(round(0.91 * PXM))

    # THE MAIN BAR'S OPENINGS GO ON BEFORE THE WING DOES, and the first version got
    # this wrong in the most visible way possible: drawing them last put two windows
    # FLOATING ON THE ROOF, because the wing stands in front of the very wall they
    # belong to. In an isometric scene an opening is part of its mass and has to be
    # painted with it, not afterwards.
    def on_main(u, z):
        return P(u / CELL_M, MAIN['y0'] + MAIN['d'], z)
    for u in (1.4, 3.6):
        d.polygon([on_main(u, sill), on_main(u + 1.22, sill),
                   on_main(u + 1.22, sill + wh), on_main(u, sill + wh)], fill=glass)
        d.line([on_main(u, sill + wh), on_main(u + 1.22, sill + wh)], fill=wall[4])
        d.line([on_main(u, sill), on_main(u + 1.22, sill)], fill=wall[4])

    # THE GARAGE, ON THE MAIN BAR'S OTHER VISIBLE FACE. That whole wall was blank,
    # and a blank plane that size keeps reading as a shed no matter how good the
    # massing is. An L-ranch with an attached garage is a real Vegas house, unlike
    # the garage bolted to a trailer that got house 01 killed.
    def on_right(v, z):
        """v metres along the main bar's down-right wall, from its near corner."""
        return P(MAIN['x0'] + MAIN['w'], MAIN['y0'] + MAIN['d'] - v / CELL_M, z)

    gh = int(round(2.13 * PXM))
    d.polygon([on_right(0.9, 0), on_right(5.78, 0), on_right(5.78, gh),
               on_right(0.9, gh)], fill=wall[2])
    for k in range(1, 5):                      # panel courses, 20 in apart
        z = int(round(k * 0.51 * PXM))
        if z < gh:
            d.line([on_right(0.9, z), on_right(5.78, z)], fill=wall[1])
    d.line([on_right(0.9, gh), on_right(5.78, gh)], fill=wall[4])
    d.line([on_right(0.9, 0), on_right(0.9, gh)], fill=wall[0])
    d.line([on_right(5.78, 0), on_right(5.78, gh)], fill=wall[0])
    # NO SECOND OPENING ON THIS WALL. I put a window at 7.2-8.42 m along it and it
    # rendered hanging in space off the corner, because that face is only 10 cells =
    # 7.5 m long. An isometric projection will happily draw an opening past the end
    # of its own wall; the geometry has to be checked against the MASS, not eyeballed
    # against the canvas.

    wx0, wy0, wx1, wy1 = draw_mass(WING)

    def on_face(u, z):
        """u metres along the wing's down-left wall, from its right corner."""
        return P(wx1 - u / CELL_M, wy1, z)

    def on_wing_right(v, z):
        return P(wx1, wy1 - v / CELL_M, z)

    d.polygon([on_wing_right(1.0, sill), on_wing_right(2.22, sill),
               on_wing_right(2.22, sill + wh), on_wing_right(1.0, sill + wh)],
              fill=glass)
    d.line([on_wing_right(1.0, sill + wh), on_wing_right(2.22, sill + wh)],
           fill=wall[4])

    d.polygon([on_face(3.1, sill), on_face(4.32, sill),
               on_face(4.32, sill + wh), on_face(3.1, sill + wh)], fill=glass)
    d.line([on_face(3.1, sill + wh), on_face(4.32, sill + wh)], fill=wall[4])
    d.line([on_face(3.1, sill), on_face(4.32, sill)], fill=wall[4])

    dh = int(round(2.03 * PXM))
    d.polygon([on_face(1.2, 0), on_face(2.11, 0), on_face(2.11, dh), on_face(1.2, dh)],
              fill=door_c[0])
    d.line([on_face(1.2, dh), on_face(2.11, dh)], fill=wall[4])

    im.save(PNG)
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    json.dump({'version': 'BOHEMIA_HOUSE_02_ISO_v1', 'built': '2026-07-29',
               'authority': 'Paolo 7/29: "copy how other isometric pixel games make '
                            'houses to start off". NOT APPROVED.',
               'projection': '2:1 dimetric, %dx%d diamond' % (TW, TH),
               'art_from': SKINS,
               'masses': [MAIN, WING],
               'metres': {'main': [MAIN['w'] * CELL_M, MAIN['d'] * CELL_M],
                          'wing': [WING['w'] * CELL_M, WING['d'] * CELL_M],
                          'plate': PLATE_M, 'pitch': '%d:12' % PITCH,
                          'eave': EAVE_M},
               'b64': base64.b64encode(b.getvalue()).decode()},
              open(OUT, 'w'))
    p = im.load()
    cols = {p[x, y][:3] for y in range(H) for x in range(W) if p[x, y][3] > 8}
    area = (MAIN['w'] * MAIN['d'] + WING['w'] * WING['d']) * CELL_M ** 2
    print('HOUSE 02 (iso, 2 masses)  %dx%d px   %.0f m2 = %.0f sq ft   pitch %d:12'
          % (W, H, area, area * 10.764, PITCH))
    print('   2:1 diamond %dx%d, plate %d px, eave %d in'
          % (TW, TH, plate, round(EAVE_M / 0.0254)))
    print('   %d colours, every one out of HIS approved skin bank' % len(cols))


if __name__ == '__main__':
    main()
