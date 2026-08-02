#!/usr/bin/env python3
"""
BOHEMIA — TEXTURE COOK THAT MATCHES WHAT HE BOUGHT (8/1/26)

Paolo 8/1: "I really need you trying to make as much pixel art that I approve of for
everything we need in the game as possible INSPIRED BY THE GRAPHIC ASSETS THAT I BOUGHT
TRYING TO REPLICATE THE EXACT LOOK I don't know what's so difficult"

REUSE CHECK: PURCHASED LIBRARIES WALKED FIRST (REUSE-FIRST + BOUGHT BEATS PAINTED), and this cook only exists because of what was found:
  banks/BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt  303 tiles, all 105 candidates decoded and
      viewed at size -- medieval ivy cottage, dungeon masonry, sci-fi consoles.
  banks/BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt  47 tiles -- 46 are cyberpunk skyscraper
      tops with helipads and neon. ONE is a pitched roof.
HE OWNS NO HOUSE WALL AND NO HOUSE ROOF (records/BOHEMIA_BOUGHT_AUDIT_7_31_26.md). So
these surfaces are the NAMED DEBT of his own law's clause 5, and painting them is the
legal branch. What is NOT optional is that they look like they came out of the same box
as his purchases -- which is the instruction above.

STYLE SOURCE: records/BOHEMIA_STYLE_TARGET_8_1_26.json, measured off the concrete and
street packs he BOUGHT and that already ship. Nothing here is an invented aesthetic
rule; every number this cook aims at came off his own tiles.

WHY THREE BATCHES OF HOUSE ART GOT REJECTED, IN ONE TABLE
---------------------------------------------------------
                        colours/tile   edge   grain    sat
    HIS BOUGHT concrete        1443    20.9   64.7%   0.274
    my house skins               81     9.4   26.2%   0.383
    my CMU wall                   4     7.1   14.4%   0.082

HIS ART IS ROUGH AND GREY. MINE WAS SMOOTH AND TOO COLOURFUL. The gap is detail
DENSITY, not palette. A flat-shaded 13-colour ramp cannot sit next to a 1,300-colour
photographic texture and read as one game, and every rejection was that mismatch --
not the house shapes it kept getting blamed on.

HOW THIS COOK GETS THERE (and every step is aimed at a measured number, not a taste)
  1. MATERIAL BODY   a real base colour + macro variation, so a wall is not one flat tone
  2. STRUCTURE       the thing that makes it that material: stucco aggregate, roof
                     courses, shingle tabs, block bond, metal ribs. Drawn in luminance,
                     never as a hard keyline.
  3. FBM GRAIN       4 octaves of value noise. THIS is what buys the 61% grain and the
                     18 edge energy that flat shading can never reach.
  4. WEAR            act-1 is a dead city: streaks, stains, chips, dirt at the base.
  5. LIGHT           one direction, upper LEFT, as a gentle gradient over the whole tile.
  6. MEASURE AND RETRY  each tile is measured after it is drawn; if it misses tolerance
                     the grain amplitude is nudged and it is redrawn. A cook that cannot
                     hit the target FAILS LOUDLY rather than shipping something smooth.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md, consulted before a pixel was drawn)
  NEVER a hard 1px black keyline / continuous near-black outline ring. Honoured: every
    material's structure -- block bond, barrel pan, shingle lap, metal rib -- is drawn in
    VALUE only. There is no outline anywhere in this cook.
  NEVER a bare undressed rectangle. Honoured: no tile is a flat field; each carries
    macro mottling, structure, wear, chips and grime at its base.
  NEVER purple outside the Amalgamation. Honoured: every base colour is a desert
    neutral, hue clamped well clear of the reserved band, and saturation is capped at
    0.30 to stay inside his measured range.
  HIS OWN 8/1 RULING is the headline check: it has to look like it came out of the box
    he bought from, and that is the measured band this cook is built around rather than
    a taste I asserted.
  AND THE ONE THIS COOK ADDED, 8/1: pink is not a desert colour. Desaturating a dark red
    at constant value produces salmon; clay must go BROWN.

*** MORE VARIETY IN COLOUR. Paolo 8/1, LOCKED, approving all 90: "I approve of them
all! Dont be scared to have a little more variety in color!" ***
That corrects a real mistake here: his tiles measure mean saturation 0.189 with a range
up to ~0.37, and this cook READ THE MEAN AS A CEILING -- capping every base at 0.30 and
pulling everything to one desert neutral. His concrete pack alone spans 0.19 to 0.37,
nearly 2x, and the cook was collapsing that spread instead of reproducing it. The fix is
not to abandon the measured band (that band is why the art landed) but to USE THE WHOLE
OF IT: cap raised to his real maximum, and a per-variant HUE JITTER so a material's
three variants are three COLOURWAYS rather than three noise seeds of one colour. A street
of identical stucco is not a street.
STRUCTURE-NOT-COLOUR (7/19) still holds: this is variety WITHIN an approved material,
never a recolour passed off as progress.

NO PURE BLACK RULE IS APPLIED HERE. His own tiles bottom out at luminance 0 and he was
explicit on 7/31 that he never banned it; the conditioner that assumed otherwise is in
the graveyard. Matching him means matching his range too.

  python3 tools/bohemia_texture_match_cook.py
    -> banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt
    -> records/target/TEXTURE_MATCH_CONTACT.png   (his tiles beside mine, for his eyes)
"""
import base64
import colorsys
import io
import json
import math
import os
import statistics as st

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

CELL = 44
STYLE = 'records/BOHEMIA_STYLE_TARGET_8_1_26.json'
GROUND = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
OUT = 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt'
SHEET = 'records/target/TEXTURE_MATCH_CONTACT.png'


# ---------------------------------------------------------------- deterministic noise
class Rnd:
    """A tiny deterministic PRNG. Seeded per tile so a rerun is byte-identical."""

    def __init__(self, seed):
        self.s = seed & 0xFFFFFFFF or 1

    def next(self):
        x = self.s
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= x >> 17
        x ^= (x << 5) & 0xFFFFFFFF
        self.s = x & 0xFFFFFFFF
        return self.s

    def f(self):
        return self.next() / 4294967296.0

    def r(self, a, b):
        return a + (b - a) * self.f()


def lattice(rnd, n):
    return [[rnd.f() for _ in range(n)] for _ in range(n)]


def sample(grid, x, y):
    """bilinear, WRAPPING, so every tile is seamless on all four edges"""
    n = len(grid)
    fx, fy = x * n, y * n
    x0, y0 = int(fx) % n, int(fy) % n
    x1, y1 = (x0 + 1) % n, (y0 + 1) % n
    tx, ty = fx - int(fx), fy - int(fy)
    tx = tx * tx * (3 - 2 * tx)
    ty = ty * ty * (3 - 2 * ty)
    a = grid[y0][x0] * (1 - tx) + grid[y0][x1] * tx
    b = grid[y1][x0] * (1 - tx) + grid[y1][x1] * tx
    return a * (1 - ty) + b * ty


def fbm(rnd, octaves=(2, 4, 11, 22)):
    grids = [lattice(rnd, o) for o in octaves]

    def at(u, v):
        tot = amp = 0.0
        a = 1.0
        for g in grids:
            tot += a * sample(g, u, v)
            amp += a
            a *= 0.62
        return tot / amp
    return at


def tinted(rgb, cap=0.34, floor=0.19, scale=1.0, hue_shift=0.0, sat_gain=1.0):
    """Pull a base colour into HIS saturation band.

    Measured, not taste: his tiles average 0.19 saturation and never pass ~0.34, while
    painted art in this repo ran 0.32-0.47. A terracotta straight off a colour picker is
    0.59 -- more than three times his street pack - and no amount of grain rescues a tile
    that is simply too colourful to sit beside his. Vegas sun bleaches everything anyway.
    """
    h, sa, v = colorsys.rgb_to_hsv(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
    h = (h + hue_shift) % 1.0
    sa *= sat_gain
    # A SATURATION FLOOR AS WELL AS A CAP. His band is 0.15-0.34 and a neutral grey CMU
    # measures 0.067 -- too GREY to be his, which is the same defect as too colourful,
    # pointed the other way. Real Vegas block is warm anyway: desert dust in the pores.
    if sa < floor:
        h = 0.09 if sa < 0.02 else h        # dead-neutral has no hue to keep; warm it
        sa = floor
    r, g, b = colorsys.hsv_to_rgb(h, min(sa, cap), max(0.0, min(1.0, v * scale)))
    # HOLD THE ORIGINAL LUMINANCE. Dropping saturation at constant V turns a dark
    # saturated red into PALE SALMON: the first run produced pink stucco and a pink
    # terracotta roof, which is not Vegas and would have been a fourth rejection.
    # Weathered terracotta is DARK and BROWN, so as the colour desaturates it has to
    # get darker, not paler. Rescale to the luminance the material started with.
    want = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) * scale
    got = 0.299 * r * 255 + 0.587 * g * 255 + 0.114 * b * 255
    if got > 1:
        k = want / got
        r, g, b = r * k, g * k, b * k
    return (max(0, min(255, int(r * 255))),
            max(0, min(255, int(g * 255))),
            max(0, min(255, int(b * 255))))


# ---------------------------------------------------------------- the materials
# base colour, structure kind, and how dirty act-1 has left it.
MATERIALS = [
    dict(id='stucco_tan',      rgb=(150, 132, 104), kind='stucco',  wear=0.55,
         name='house wall, tan stucco'),
    dict(id='stucco_bone',     rgb=(163, 152, 132), kind='stucco',  wear=0.45,
         name='house wall, bone stucco'),
    # OCHRE, NOT CLAY. (143,116,95) has red running well ahead of green and rendered
    # visibly PINK at this grain -- wrong for Vegas and the kind of thing that gets a
    # batch killed on sight. Sun-bleached adobe sits close to r = g * 1.15.
    dict(id='stucco_ochre',    rgb=(150, 130,  98), kind='stucco',  wear=0.60,
         name='house wall, ochre adobe stucco'),
    dict(id='block_grey',      rgb=(126, 124, 118), kind='block',   wear=0.55,
         name='block wall, grey CMU'),
    dict(id='block_painted',   rgb=(140, 133, 116), kind='block',   wear=0.65,
         name='block wall, painted CMU'),
    # DARK weathered terracotta. The bright version desaturated into SALMON: a
    # saturated red only reads as clay while it stays dark, so this drops the value
    # instead of the chroma.
    dict(id='roof_tile_terra', rgb=( 96,  62,  45), kind='barrel',  wear=0.50,
         name='roof, weathered terracotta barrel tile'),
    dict(id='roof_tile_sand',  rgb=(133, 111,  86), kind='barrel',  wear=0.55,
         name='roof, sand barrel tile'),
    dict(id='roof_shingle',    rgb=( 94,  87,  78), kind='shingle', wear=0.55,
         name='roof, asphalt shingle'),
    dict(id='roof_shingle_bn', rgb=(105,  90,  72), kind='shingle', wear=0.60,
         name='roof, brown shingle'),
    dict(id='metal_corrugate', rgb=(122, 118, 110), kind='rib',     wear=0.70,
         name='corrugated metal, rusted'),
    dict(id='wall_plaster_bare', rgb=(134, 120, 101), kind='plaster', wear=0.75,
         name='wall, plaster blown off to substrate'),
    dict(id='gravel_roof',     rgb=(117, 110,  97), veg=True, kind='gravel',  wear=0.50,
         name='roof, tar and gravel'),

    # ---- VOLUME, 8/1. Paolo approved all 36 of batch 1 ("fucking fantastic"), and
    # APPROVAL UNLOCKS VOLUME is standing law. These answer the ART tile forms that
    # were filed and then blocked, because until the style target existed nobody could
    # say what "the look" was in terms a cook could aim at. Form id in the comment.
    dict(id='brick_running',   rgb=(122,  78,  62), kind='brick',   wear=0.55,
         name='brick masonry, running bond'),                          # TF-ART-009
    dict(id='brick_painted',   rgb=(146, 138, 124), kind='brick',   wear=0.70,
         name='brick masonry, painted over'),                          # TF-ART-009
    dict(id='civic_stone',     rgb=(148, 140, 124), kind='ashlar',  wear=0.40,
         name='civic cut-stone ashlar'),                               # TF-ART-007
    # sgain 0.62: a mobile home wears VINYL or thin aluminium siding, a much softer
    # profile than the industrial R-panel the 'rib' kind draws for corrugated metal.
    # At full amplitude it measured 79% grain against his 77.5 ceiling - the structure
    # was doing the work the grain should, which is a real material error and not a
    # tuning miss.
    dict(id='mobile_siding',   rgb=(140, 136, 128), kind='rib',     wear=0.65,
         sgain=0.62, name='mobile home ribbed siding'),                # TF-ART-013
    # DEAD-DARK GLASS is act-1 law, and the first cook made a PALE grid: lit-looking
    # glazing in a city with 12% power. The bay reads black, the aluminium catches light.
    dict(id='storefront_alum', rgb=( 96,  96,  95), kind='mullion', wear=0.55,
         name='storefront aluminium, dead-dark glazing'),              # TF-ART-008
    dict(id='freeway_asphalt', rgb=( 78,  76,  74), veg=True, hardware=True, kind='asphalt', wear=0.60,
         name='freeway asphalt, wide lane'),                           # TF-ART-011
    dict(id='lot_asphalt',     rgb=( 84,  81,  78), veg=True, hardware=True, kind='asphalt', wear=0.70,
         name='parking lot asphalt'),                                  # TF-ART-003
    dict(id='rail_ballast',    rgb=(104,  98,  90), veg=True, kind='gravel',  wear=0.55,
         name='railroad ballast'),                                     # TF-ART-010
    dict(id='pool_basin',      rgb=(150, 150, 146), veg=True, kind='plaster', wear=0.65,
         name='empty pool basin, plaster'),                            # TF-ART-006
    # STRAW, NOT GREEN. (122,114,76) rendered olive-GREEN at this grain, and a green
    # playing field in a dead desert city is a lie about the whole premise. Dead Bermuda
    # in Vegas is straw: red clearly ahead of green, no chlorophyll left.
    dict(id='dead_turf',       rgb=(152, 128,  78), veg=True, kind='turf',    wear=0.75,
         name='dead sports turf, burnt to straw'),                     # TF-ART-005
    dict(id='crop_furrow',     rgb=(118, 100,  76), veg=True, kind='furrow',  wear=0.70,
         name='dead furrowed crop field'),                             # TF-ART-014
    dict(id='landfill_cover',  rgb=(112, 104,  90), veg=True, kind='gravel',  wear=0.80,
         name='landfill cover cap'),                                   # TF-ART-015
    dict(id='tiltup_concrete', rgb=(138, 136, 130), hardware=True, kind='tiltup',  wear=0.50,
         name='tilt-up concrete panel'),                               # warehouse walls
    dict(id='steel_rusted',    rgb=(112,  76,  56), kind='rib',     wear=0.85,
         name='rusted steel sheet'),                                   # industrial
    dict(id='wood_fence',      rgb=(124, 108,  86), kind='plank',   wear=0.75,
         name='weathered wood fence plank'),                           # yards
    dict(id='tar_paper',       rgb=( 88,  84,  80), kind='plaster', wear=0.60,
         name='tar paper, roof underlayment'),                         # exposed roofs
    dict(id='stucco_grey',     rgb=(134, 132, 126), kind='stucco',  wear=0.55,
         name='house wall, grey stucco'),
    # gentler colourway spread: the +30% chroma variant pushed red adobe toward the
    # salmon the gate is built to catch. Adobe varies in VALUE, not chroma.
    dict(id='adobe_red',       rgb=(128,  96,  74), kind='stucco',  wear=0.60,
         ways=[(0.0, 0.85), (-0.012, 1.00), (0.012, 0.72)],
         name='house wall, red adobe'),

    # ---- HIS COLOUR RULING, 8/1: "Dont be scared to have a little more variety in
    # color!" Suburban Vegas is not one beige. These are real tract-house colourways,
    # all inside his measured band, and with the per-variant jitter each yields three.
    dict(id='stucco_sage',     rgb=(126, 132, 112), kind='stucco',  wear=0.55,
         name='house wall, sage stucco'),
    # ROSY BY DECISION, not by accident. The gate's PINK test exists because a broken
    # desaturation produced salmon by mistake; desert rose is a real southwestern tract
    # colour and he asked for variety, so it is DECLARED and the gate exempts declared
    # colourways only. An undeclared pink tile still fails, which is the point.
    dict(id='stucco_sand_pink', rgb=(158, 132, 118), kind='stucco', wear=0.50,
         rosy=True, name='house wall, desert rose stucco'),
    dict(id='stucco_blue_grey', rgb=(114, 124, 134), kind='stucco', wear=0.55,
         name='house wall, blue-grey stucco'),
    dict(id='stucco_butter',   rgb=(164, 148, 106), kind='stucco',  wear=0.50,
         name='house wall, butter yellow stucco'),
    dict(id='roof_tile_slate', rgb=( 86,  90,  96), kind='barrel',  wear=0.55,
         name='roof, slate-grey barrel tile'),
    dict(id='roof_shingle_grn', rgb=( 84,  94,  80), kind='shingle', wear=0.60,
         name='roof, weathered green shingle'),
    dict(id='door_garage_wht', rgb=(156, 152, 144), kind='panel',   wear=0.60,
         name='garage door, ribbed steel'),
    dict(id='trim_white',      rgb=(168, 162, 150), kind='plaster', wear=0.45,
         name='house trim, chalked white'),
]


# EVERY PERIOD MUST DIVIDE THE CELL. 44 = 1,2,4,11,22,44 and nothing else.
# Paolo 8/1: "the border is very important. The border speaks a lot."
# A module of 15px on a 44px tile completes 2.93 times and then CUTS, so every tile
# boundary carries a broken brick, a half tab, a clipped rib -- a hard vertical line
# down the grid that no amount of grain hides. The first pass had five materials doing
# exactly that: shingle tabs at 15, ribs at 7, brick at 6x15, ashlar courses at 15,
# fence planks at 9. All of them now sit on divisors, chosen to stay physically honest
# at 1 px = 1.705 cm: an 11px brick is 18.8cm (real modular brick is 19.4), an 11px
# plank is 18.8cm (a real 1x8 board), a 4px course is 6.8cm.
DIVISORS = (1, 2, 4, 11, 22, 44)


def structure(kind, x, y, n, rnd_phase):
    """luminance offset that makes the material READ as that material.

    Everything here is drawn in VALUE, never as a hard 1px keyline: his tiles have no
    outlines, they have edges made of tone, and the taste canon bans the keyline anyway.
    Every coordinate wraps so the tile still tiles.
    """
    if kind == 'stucco':
        return 0.0                       # stucco is pure aggregate; the fbm does it all
    if kind == 'block':
        ch, cw = 11, 22                  # 11px course, 22px block: the real CMU module
        row = y // ch
        off = (row % 2) * (cw // 2)
        mx = (x + off) % cw
        my = y % ch
        if my == 0 or mx == 0:           # mortar joint, recessed
            return -26.0
        if my == 1 or mx == 1:
            return -11.0
        if my == ch - 1:                 # the light catching the course below
            return 7.0
        return 0.0
    if kind == 'barrel':
        p = 11.0                         # barrel pan pitch across the slope
        ph = (x % p) / p
        v = math.cos(ph * 2 * math.pi)   # round pan: lit crown, dark valley
        lap = -22.0 if (y % 22) < 2 else 0.0   # the course lap shadow
        return v * 15.0 + lap
    if kind == 'shingle':
        course = 11
        if y % course < 2:               # the shadow line under each tab course
            return -20.0
        tabw = 22                    # was 15, which cut mid-tab at every tile edge
        off = ((y // course) % 2) * (tabw // 2)
        if (x + off) % tabw == 0:        # the vertical tab slot
            return -13.0
        return 3.0 if y % course > course - 3 else 0.0
    if kind == 'rib':
        # 11, a divisor of 44. 7.0 was NOT (44/7 = 6.28 ribs, so every tile edge sliced
        # one in half); 4.0 divided cleanly but put a light-dark flip every 2px, which
        # measured 95-98% grain -- a wall of static, not siding. 11px is 18.8cm at this
        # scale, which is real wide-rib R-panel, the profile industrial siding and mobile
        # homes actually use.
        p = 11.0
        return math.cos((x % p) / p * 2 * math.pi) * 17.0
    if kind == 'brick':
        ch, cw = 4, 11                   # 6.8cm course, 18.8cm brick - and both DIVIDE 44
        row = y // ch
        off = (row % 2) * (cw // 2)
        if y % ch == 0 or (x + off) % cw == 0:
            return -21.0
        if y % ch == ch - 1:
            return 6.0
        return 0.0
    if kind == 'ashlar':
        ch, cw = 11, 22                  # big civic blocks, tight joints; both divide 44
        row = y // ch
        off = (row % 2) * (cw // 2)
        if y % ch == 0 or (x + off) % cw == 0:
            return -15.0
        return 0.0
    if kind == 'mullion':
        if x % 22 < 2 or y % 22 < 2:     # the aluminium glazing bar catches the sun
            return 17.0
        return -27.0                     # THE GLASS IS DEAD, not lit. Act-1 law, and the
                                         # first cook's -12 made a lit-looking shopfront
                                         # in a city running on 12% power.
                                         # NOT pitch black either: -46 against a bright
                                         # mullion put the tile's luminance SPREAD at 78
                                         # against his 20-42, i.e. a tile that no longer
                                         # belonged to the same set. Widening the
                                         # tolerance to let it through would have been
                                         # marking my own homework, so the ART moved.
    if kind == 'asphalt':
        return 0.0                       # asphalt is pure aggregate, like stucco
    if kind == 'turf':
        # matted clumping, expressed as whole cycles ACROSS the cell so it wraps
        return (math.sin(y / n * 2 * math.pi * 11) * 4.0
                + math.sin(x / n * 2 * math.pi * 4) * 3.0)
    if kind == 'furrow':
        p = 11.0                         # plough rows
        return math.cos((y % p) / p * 2 * math.pi) * 19.0
    if kind == 'tiltup':
        if x % 44 < 2 or y % 22 < 1:     # panel joint every bay
            return -17.0
        return 0.0
    if kind == 'plank':
        pw = 11                          # was 9: 44/9 = 4.9 boards, a split plank on every seam
        if y % pw == 0:                  # the gap between boards
            return -24.0
        if y % pw == 1:
            return 8.0
        return 0.0
    if kind == 'panel':
        # a garage door is WIDE horizontal panels, not fine corrugation. Sharing the
        # 4px rib made it 98% grain: a wall of static, not a door.
        if y % 11 == 0:
            return -22.0
        if y % 11 == 1:
            return 9.0
        return math.cos((x % 22) / 22.0 * 2 * math.pi) * 4.0
    if kind == 'plaster':
        return 0.0
    if kind == 'gravel':
        return 0.0
    return 0.0




def warped(xx, yy, wobble, phase):
    """Push the sample point around before the plate test.

    A raw Voronoi gives DEAD STRAIGHT cell walls and evenly sized cells - it reads as a
    diagram, which is exactly how mine looked beside his: his crazing wanders, forks and
    varies in width along a single crack. Offsetting the sample point by a smooth noise
    field bends every boundary without breaking the topology, so the network still meets
    at real junctions and still closes. The offset is periodic in the cell, so warping
    cannot reintroduce the border he circled on 8/1.
    """
    a = (xx / CELL) * 6.2832
    b = (yy / CELL) * 6.2832
    ox = (math.sin(b * 2 + phase) + math.sin(b * 3 - phase * 1.7) * 0.5) * wobble
    oy = (math.sin(a * 2 - phase) + math.sin(a * 3 + phase * 1.3) * 0.5) * wobble
    return xx + ox, yy + oy


VEG_ROOT = (46, 48, 26)      # the shaded base where it meets the ground
VEG_MID = (96, 106, 44)      # the blade body
VEG_TIP = (156, 168, 74)     # the tip catching the sun
VEG_DEAD = (128, 116, 56)    # the half of it that is straw


def weed(rnd, stamp, ink, cx, cy):
    """A RADIAL ROSETTE, which is what his weeds actually are.

    Looked at his tiles at 190px: a clump is a dandelion/crabgrass rosette - blades
    fanning out from a DARK CORE where it meets the ground, 1-2px wide, varying length,
    slightly curved, with the tips catching light. It grows OUT OF a crack, so it takes
    a shadow with it.

    Half the blades are drawn dead straw rather than green. This is a desert city thirty
    years after the money stopped; a uniformly green clump would be a lie about the
    climate, and his own tiles carry that yellow.
    """
    n = int(rnd.r(14, 26))
    for i in range(n):
        a = (i / n) * 6.283 + rnd.r(-0.16, 0.16)
        ln = rnd.r(5.0, 12.0)
        curve = rnd.r(-0.30, 0.30)
        dead = rnd.f() < 0.42
        for k in range(int(ln)):
            t = k / max(ln - 1, 1)
            th = a + curve * t
            x = cx + math.cos(th) * (k + 1)
            y = cy + math.sin(th) * (k + 1) * 0.72      # squashed: seen from above
            base = VEG_DEAD if dead else VEG_MID
            c = VEG_TIP if t > 0.72 else base if t > 0.22 else VEG_ROOT
            ink(x, y, tuple(int(v + rnd.r(-14, 14)) for v in c))
            if k < ln * 0.7:                    # his blades are FAT near the root
                ink(x, y + 1, tuple(int(v + rnd.r(-16, 10)) for v in c))
            if k == int(ln) - 1 and rnd.f() < 0.5:
                ink(x + rnd.r(-1, 1), y - 1, VEG_TIP)
    for dy in range(-2, 3):                              # the dark heart of the clump
        for dx in range(-2, 3):
            if dx * dx + dy * dy <= 4:
                ink(cx + dx, cy + dy, VEG_ROOT, 0.85)
                stamp(cx + dx, cy + dy, -18)


def hardware(rnd, stamp, ink, cx, cy):
    """A MANHOLE or a DRAIN GRATE. The other thing his pack has that mine did not: a
    piece of the city's plumbing sitting in the surface, cast iron and darker than
    everything around it."""
    if rnd.f() < 0.55:
        # A MANHOLE IS A HEAVY DARK DISC, not a grey circle. The first pass drew a mid
        # grey with faint ribs and it read as a smudge; his sit in the surface with real
        # weight. What makes it read: it is DARKER than the road, it has a recessed
        # SEATING RING around it, and the cover carries a coarse cast pattern you can
        # actually see at 44px - concentric rings crossed by radial spokes, which is what
        # a real cast-iron cover has and what survives being this small.
        r = rnd.r(6.5, 9.0)
        for yy in range(int(-r) - 2, int(r) + 3):
            for xx in range(int(-r) - 2, int(r) + 3):
                dd = math.hypot(xx, yy)
                if dd > r + 1.6:
                    continue
                if dd > r:                                   # the seat: a dark gap
                    ink(cx + xx, cy + yy, (30, 28, 27))
                    continue
                v = 62 + int(rnd.r(-9, 9))
                ring = int(dd * 1.5) % 2 == 0                # concentric casting rings
                spoke = int((math.atan2(yy, xx) + 3.1416) / 6.2832 * 10) % 2 == 0
                if dd > r * 0.30 and (ring or spoke):
                    v -= 26
                if dd < r * 0.22:                            # the pick hole in the middle
                    v -= 30
                ink(cx + xx, cy + yy, (v + 2, v, v - 4))
        for a in range(0, 360, 4):                           # lit lip, upper LEFT
            th = math.radians(a)
            if 100 < a < 300:
                ink(cx + math.cos(th) * r, cy + math.sin(th) * r, (128, 124, 116))
        stamp(cx, cy + r + 2, -16)                           # it sits in a shallow dish
    else:
        w, h = int(rnd.r(9, 15)), int(rnd.r(6, 10))
        for yy in range(h):
            for xx in range(w):
                edge = xx == 0 or yy == 0 or xx == w - 1 or yy == h - 1
                bar = (yy % 3 == 1)
                ink(cx + xx, cy + yy, (58, 56, 54) if edge else
                    (30, 29, 28) if bar else (86, 83, 79))


def features(rnd, mat, seed_gain=1.0):
    """THE HERO FEATURES. Measured off his pack, not invented.

    Paolo's own library is not a field of even noise with the occasional manhole. Every
    tile has SOMETHING: measured as the share of a tile that is a strong LOCALIZED
    deviation from its own body (|v - median| > 2 sd), his 54 shipping ground tiles run
    a median of 7.0% and 78% of them clear 6%. Mine ran a median of 4.1% with 9 of 114
    clearing 6% -- consistent texture at the right density, which is exactly the gap
    between "same material family" and "same pack" this lane has been carrying as
    named debt since the first batch landed.

    So each tile gets one to three real events: a crack that travels, a patch where
    something was repaired, a stain running down from a failure, a spall where the
    surface blew off, a clump of dirt and debris.

    EVERY COORDINATE WRAPS. A crack that leaves the right edge continues on the left,
    which is both correct for a tiling texture and the thing that stops features
    re-introducing the border he circled on 8/1. Nothing here is allowed to be a
    one-sided mark.
    """
    d = [[0.0] * CELL for _ in range(CELL)]
    # A SECOND LAYER THAT CARRIES COLOUR. Everything above works in luminance, which is
    # right for damage - a crack is the material, darker. It is WRONG for a weed: living
    # green is not the wall's own colour made darker, and dimming stucco never produces
    # chlorophyll. So vegetation and hardware paint into `tint` and override.
    tint = [[None] * CELL for _ in range(CELL)]

    def stamp(x, y, v):
        d[int(y) % CELL][int(x) % CELL] += v

    def ink(x, y, rgb, k=1.0):
        xx, yy = int(x) % CELL, int(y) % CELL
        old = tint[yy][xx]
        tint[yy][xx] = rgb if old is None or k >= 1.0 else tuple(
            int(old[i] + (rgb[i] - old[i]) * k) for i in range(3))

    def blob(cx, cy, r, v, hard=0.0):
        rr = int(r) + 1
        for dy in range(-rr, rr + 1):
            for dx in range(-rr, rr + 1):
                dist = math.hypot(dx, dy)
                if dist <= r:
                    fall = 1.0 if hard else (1.0 - dist / max(r, 0.01))
                    stamp(cx + dx, cy + dy, v * fall)

    # VEGETATION, drawn from his actual distribution rather than sprinkled everywhere.
    # Measured on his 34 concrete tiles: 23 have essentially NO weed, a handful carry
    # 2-3%, and TWO are 30% overgrown mats. So most tiles get nothing, some get one
    # clump, a few are taken over. Weeds on every tile would be as wrong as none.
    if mat.get('veg'):
        roll = rnd.f()
        clumps = 0 if roll < 0.62 else (1 if roll < 0.88 else 2) if roll < 0.94 else 5
        for _ in range(clumps):
            weed(rnd, stamp, ink, rnd.f() * CELL, rnd.f() * CELL)
    if mat.get('hardware') and rnd.f() < 0.22:
        hardware(rnd, stamp, ink, rnd.r(8, CELL - 8), rnd.r(8, CELL - 8))

    # GROUND CARRIES MORE THAN A WALL, and that is physics rather than metric-chasing.
    # A road abandoned thirty years is crazed across its whole surface; a stucco wall of
    # the same age has a few cracks and some staining. His 54 reference tiles are ALL
    # ground, which is why comparing my walls to them was never the fair test - measured
    # on ground-like surfaces alone mine sat at 5.6% against his 7.0%.
    ground = bool(mat.get('veg') or mat['kind'] in ('asphalt', 'gravel'))

    # A DEAD ROAD IS CRAZED EDGE TO EDGE, not a clean slab with a few cracks in it.
    # This is the last structural difference from his pack and it is not a number to
    # chase: looking at his concrete tiles, the ENTIRE tile is one plate network. Mine
    # drew cracking as a LOCAL EVENT, so a tile got one patch of crazing and clean
    # surface around it - which is what a two-year-old car park looks like, not a road
    # thirty years after the money stopped. Ground materials get a full-tile network
    # UNDERNEATH everything else, and the discrete events sit on top of it.
    if ground:
        seeds = [(rnd.f() * CELL, rnd.f() * CELL) for _ in range(int(rnd.r(14, 24)))]
        depth = rnd.r(-74, -48)
        wob = rnd.r(1.6, 3.4)
        ph = rnd.f() * 6.28
        for yy in range(CELL):
            for xx in range(CELL):
                wx, wy = warped(xx, yy, wob, ph)
                d1 = d2 = 1e9
                for (sx, sy) in seeds:
                    ddx = abs(wx - sx)
                    ddy = abs(wy - sy)
                    ddx = min(ddx, CELL - ddx)
                    ddy = min(ddy, CELL - ddy)
                    dd = ddx * ddx + ddy * ddy
                    if dd < d1:
                        d2, d1 = d1, dd
                    elif dd < d2:
                        d2 = dd
                # WIDTH VARIES ALONG THE CRACK. A constant width is the other half of
                # why a raw Voronoi reads as a diagram: real cracks open and close.
                width = 0.55 + 0.55 * (0.5 + 0.5 * math.sin(
                    (xx / CELL) * 6.2832 * 3 + (yy / CELL) * 6.2832 * 2 + ph))
                gap = math.sqrt(d2) - math.sqrt(d1)
                if gap < width:
                    f = 1.0 - gap / width
                    stamp(xx, yy, depth * f * f)
                    if f > 0.62:
                        stamp(xx, yy - 1, -depth * 0.16)
    n = (3 if ground else 2) + int(rnd.f() * (3.4 if ground else 2.6) * seed_gain)
    for _ in range(n):
        pick = rnd.f()
        cx, cy = rnd.f() * CELL, rnd.f() * CELL

        if pick < 0.34:
            # A CRACK NETWORK, NOT A SQUIGGLE. This was rebuilt after looking at his
            # tiles beside mine at size: HIS cracks form a connected polygonal network
            # that breaks the surface into PLATES and meets at junctions, which is what
            # concrete actually does when it crazes. Mine were a random walk -- meandering
            # worm-lines and rings that read as doodles drawn ON the surface rather than
            # damage IN it. No amount of extra amplitude fixes a wrong model, and the
            # numbers could not see it: the metric was happy while the tiles looked like
            # scribbles.
            #
            # A plate decomposition gives it for free. Scatter seeds, and mark every
            # pixel that is nearly equidistant from its two nearest seeds: that set IS
            # the plate boundary, so segments come out straight-ish, meet at real
            # junctions, and close. Distance is measured with WRAPPING, so the network
            # continues across the tile edge instead of stopping at it.
            seeds = [(rnd.f() * CELL, rnd.f() * CELL) for _ in range(int(rnd.r(6, 12)))]
            depth = rnd.r(-92, -58)
            width = rnd.r(0.75, 1.5)
            wob2 = rnd.r(1.4, 3.0)
            ph2 = rnd.f() * 6.28
            for yy in range(CELL):
                for xx in range(CELL):
                    wx, wy = warped(xx, yy, wob2, ph2)
                    d1 = d2 = 1e9
                    for (sx, sy) in seeds:
                        ddx = abs(wx - sx)
                        ddy = abs(wy - sy)
                        ddx = min(ddx, CELL - ddx)
                        ddy = min(ddy, CELL - ddy)
                        dd = ddx * ddx + ddy * ddy
                        if dd < d1:
                            d2, d1 = d1, dd
                        elif dd < d2:
                            d2 = dd
                    gap = math.sqrt(d2) - math.sqrt(d1)
                    if gap < width:
                        f = 1.0 - gap / width
                        stamp(xx, yy, depth * f * f)
                        # the lit chipped lip on the sunward side of the break
                        if f > 0.6:
                            stamp(xx, yy - 1, -depth * 0.18)

        elif pick < 0.55:
            # A PATCH. Somebody repaired this once: a rectangle of slightly wrong tone
            # with a hard edge, because a patch never blends.
            w, h = int(rnd.r(7, 17)), int(rnd.r(6, 15))
            tone = rnd.r(-34, 32)
            for yy in range(h):
                for xx in range(w):
                    edge = (xx == 0 or yy == 0 or xx == w - 1 or yy == h - 1)
                    stamp(cx + xx, cy + yy, tone + (-30.0 if edge else 0.0))

        elif pick < 0.72:
            # A STAIN RUNNING DOWN from a failure point: rust, a leak, thirty years of
            # weather off one bad flashing. Widens and fades as it falls.
            ln = int(rnd.r(9, 22))
            wdt = rnd.r(1.4, 3.4)
            dark = rnd.r(-46, -24)
            for i in range(ln):
                f = i / ln
                for k in range(int(wdt * (0.5 + f))):
                    stamp(cx + k - wdt * f * 0.5, cy + i, dark * (1.0 - f * 0.7))

        elif pick < 0.88:
            # A SPALL: the surface blew off and the substrate shows. Bright core, hard
            # dark rim where the face broke away.
            # A SPALL IS A BROKEN EDGE, NOT A DRAWN CIRCLE. The first version stamped a
            # perfect ring at a fixed radius and read as a doughnut. Real spalling has a
            # ragged perimeter, so the radius wanders as it goes round.
            r = rnd.r(3.0, 6.5)
            rad = [r * rnd.r(0.62, 1.34) for _ in range(24)]
            for a in range(0, 360, 5):
                th = math.radians(a)
                rr = rad[(a // 15) % 24]
                stamp(cx + math.cos(th) * rr, cy + math.sin(th) * rr, rnd.r(-58, -30))
                for k in range(1, int(rr)):
                    # exposed substrate is only SLIGHTLY paler than the face. The first
                    # pass lifted it 12-30 and every spall read as a white blob stuck on
                    # the wall - the eye went straight to it and nothing else.
                    stamp(cx + math.cos(th) * k, cy + math.sin(th) * k,
                          rnd.r(3, 11) * (1.0 - k / max(rr, 1)))

        else:
            # DEBRIS AND DIRT that has collected: a tight cluster of dark specks with a
            # few catching light on top. His tiles are full of these.
            for _ in range(int(rnd.r(10, 26))):
                ox, oy = rnd.r(-4.5, 4.5), rnd.r(-3.5, 3.5)
                stamp(cx + ox, cy + oy, rnd.r(-56, -22))
                if rnd.f() < 0.3:
                    stamp(cx + ox, cy + oy - 1, rnd.r(16, 36))
    return d, tint


def cook(mat, seed, grain_gain=1.0, speck_gain=1.0, val_scale=1.0,
         hue_shift=0.0, sat_gain=1.0, feat_gain=1.0):
    rnd = Rnd(seed)
    base = tinted(mat['rgb'], scale=val_scale, hue_shift=hue_shift, sat_gain=sat_gain)
    body = fbm(rnd, (2, 4, 11, 22))       # the material's own mottling
    fine = fbm(rnd, (11, 22, 44))         # the high-frequency grain: the whole ballgame
    stain = fbm(rnd, (2, 3))              # big soft dirt
    phase = rnd.f()
    # PER-PIXEL, UNCORRELATED. The fbm above is bilinear-smoothed, so neighbouring
    # pixels are correlated and edge energy tops out around 12 no matter how much grain
    # is added -- his tiles measure 18.4 because a photographic texture is essentially
    # independent at the finest scale. This is the term that closes that gap, and it is
    # generated per tile from the same seed so a rerun is byte-identical.
    speck = [[(rnd.f() - 0.5) for _ in range(CELL)] for _ in range(CELL)]

    # per-tile chip/pit sites, so no two tiles are the same wall
    pits = [(rnd.next() % CELL, rnd.next() % CELL, rnd.r(1.2, 3.0), rnd.r(-34, -14))
            for _ in range(int(6 + 10 * mat['wear']))]
    hero, tint = features(rnd, mat, feat_gain)

    im = Image.new('RGB', (CELL, CELL))
    px = im.load()
    for y in range(CELL):
        for x in range(CELL):
            u, v = x / CELL, y / CELL
            L = 0.0
            L += (body(u, v) - 0.5) * 44.0                       # macro variation
            L += (fine(u, v) - 0.5) * 74.0 * grain_gain          # THE GRAIN
            L += speck[y][x] * 30.0 * speck_gain                 # THE EDGE
            # x2.0: at grain this dense the material's own structure was being BURIED.
            # His tiles are not fields of noise -- they have hard features (joints,
            # cracks, laps) that survive the texture and tell you what you are looking
            # at. Noise without structure is just mush wearing the right numbers.
            L += structure(mat['kind'], x, y, CELL, phase) * 2.0 * mat.get('sgain', 1.0)
            L += (stain(u, v) - 0.5) * 26.0 * mat['wear']        # dirt and streaking
            # *** NOTHING IN A TILING TEXTURE MAY BE NON-PERIODIC. ***
            # Paolo 8/1, circling two horizontal bands across the yard: "I don't want
            # the borders of the tiles to look like that ... I want it to be more
            # seamless ... the border speaks a lot".
            # He was seeing a real bug, and it was these two lines. A LINEAR light
            # gradient (bright top-left, dark bottom-right) and a grime band confined to
            # the bottom 28% are both NON-PERIODIC: every tile ended bright at its top
            # edge and dark at its bottom edge, so laying them in a grid stacked a
            # dark-against-light step at EVERY horizontal boundary. Measured, my seams
            # ran 1.67x the interior contrast where his bought tiles run 0.62x - his
            # seams are quieter than their own interiors, mine were nearly 3x that.
            # A baked per-tile light direction is wrong on its own terms too: every tile
            # lit identically IS the grid, drawn in shading. Scene lighting belongs to
            # the renderer. What stays is COSINE variation, which is periodic by
            # construction and so cannot make an edge.
            L += math.cos(u * 2 * math.pi) * 5.0 + math.cos(v * 2 * math.pi) * 6.0
            L += math.cos(v * 2 * math.pi + 1.1) * -9.0 * mat['wear']   # wrapping grime

            for (pxx, pyy, pr, pd) in pits:                      # chips
                dx = min(abs(x - pxx), CELL - abs(x - pxx))
                dy = min(abs(y - pyy), CELL - abs(y - pyy))
                d = math.hypot(dx, dy)
                if d < pr:
                    L += pd * (1.0 - d / pr)

            L += hero[y][x]                                      # THE HERO FEATURES
            if tint[y][x] is not None:                           # vegetation / hardware
                t = tint[y][x]
                px[x, y] = (max(0, min(255, t[0])), max(0, min(255, t[1])),
                            max(0, min(255, t[2])))
                continue
            k = 1.0 + L / 128.0
            r = base[0] * k + (fine(v, u) - 0.5) * 13.0          # per-channel break-up,
            g = base[1] * k + (fine(u + 0.37, v) - 0.5) * 13.0   # which is what pushes
            b = base[2] * k + (fine(u, v + 0.61) - 0.5) * 13.0   # the colour count up
            px[x, y] = (max(0, min(255, int(r))),
                        max(0, min(255, int(g))),
                        max(0, min(255, int(b))))
    return im


# ---------------------------------------------------------------- measure and retry
def seam_ratio(im):
    """the seam, measured against the material's OWN worst line (see the gate).

    The cook checks this itself rather than leaving it to the gate, because a bad seam
    is not a tuning miss you can dial out - it is a bad SEED, and the fix is to draw a
    different one. A crack network that happens to run along the boundary is the case
    that produces it, and no amount of grain or value nudging helps.
    """
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()

    def L(x, y):
        i = (y * w + x) * 3
        return 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2]

    rowj = [st.mean([abs(L(x, y) - L(x, y + 1)) for x in range(w)]) for y in range(h - 1)]
    colj = [st.mean([abs(L(x, y) - L(x + 1, y)) for y in range(h)]) for x in range(w - 1)]
    sv = st.mean([abs(L(x, h - 1) - L(x, 0)) for x in range(w)]) / max(max(rowj), 1e-6)
    sh = st.mean([abs(L(w - 1, y) - L(0, y)) for y in range(h)]) / max(max(colj), 1e-6)
    return max(sv, sh)


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


def inside(m, tol):
    return (m['colours'] >= tol['colours_min']
            and tol['edge'][0] <= m['edge'] <= tol['edge'][1]
            and tol['grain'][0] <= m['grain'] <= tol['grain'][1]
            and tol['sat'][0] <= m['sat'] <= tol['sat'][1]
            and tol['lum_mean'][0] <= m['lum_mean'] <= tol['lum_mean'][1]
            and tol['lum_sd'][0] <= m['lum_sd'] <= tol['lum_sd'][1])


# HIS COLOUR RULING, MADE CONCRETE. Variant 0 is the material's own colour; 1 and 2 are
# real colourways off it. Small in hue (a wall is still that material) but decisive in
# chroma, because his own pack spans nearly 2x saturation and the cook was flattening it.
COLOURWAY = [(0.000, 1.00), (-0.020, 1.30), (0.022, 0.80)]


def cook_to_target(mat, seed, tol, tries=40, way=0, feat=1.0):
    """draw, MEASURE, nudge, redraw. Smooth art never leaves this function.

    TWO dials, because grain and edge are not the same thing and the first version of
    this loop only had one: grain is HOW MUCH of the tile is changing, edge is HOW HARD
    it changes between touching pixels. Chasing grain alone pinned edge at 12 against his
    18.4 and every tile came out soft.
    """
    gain = speck = val = 1.0
    reseed = 0
    best = bestm = None
    tgt_e = sum(tol['edge']) / 2.0
    tgt_g = sum(tol['grain']) / 2.0
    tgt_l = sum(tol['lum_mean']) / 2.0
    for _ in range(tries):
        ways = mat.get('ways') or COLOURWAY
        hs, sg = ways[way % len(ways)]
        # feat: HOW MUCH HERO DAMAGE this tile carries. 1.0 is the ground default and
        # is right for a road crazed edge to edge; a garden wall repeated along a run
        # needs most of its tiles CLEAN, or the one crack baked into the one tile stamps
        # at 44px pitch forever (Paolo 8/2: "looks like it's glitching out").
        im = cook(mat, seed + reseed * 7919, gain, speck, val, hs, sg, feat)
        m = measure(im)
        sr = seam_ratio(im)
        if sr > 1.18:
            reseed += 1          # bad seed, not a bad dial: draw a different tile
            continue
        if inside(m, tol):
            return im, m, True
        score = (abs(m['edge'] - tgt_e) / tgt_e + abs(m['grain'] - tgt_g) / tgt_g
                 + abs(m['lum_mean'] - tgt_l) / tgt_l + max(0.0, sr - 1.0) * 3.0)
        if best is None or score < bestm[1]:
            best, bestm = im, (m, score)
        speck *= 1.12 if m['edge'] < tgt_e else 0.92
        gain *= 1.06 if m['grain'] < tgt_g else 0.95
        # THIRD DIAL: the base VALUE. grain and edge are texture; brightness is the
        # material itself, and no amount of noise moves a tile that starts too pale.
        # Stucco bases came out at luminance 135-153 against his 80-130.
        if m['lum_mean'] > tol['lum_mean'][1]:
            val *= 0.93
        elif m['lum_mean'] < tol['lum_mean'][0]:
            val *= 1.07
    return best, bestm[0], False


# WHAT HE HAS ACTUALLY JUDGED. Batch 1, 8/1: "I approved thumbs up ... the graphics
# tiles that you made are fucking fantastic". Twelve materials, 36 tiles. Everything
# added after that verdict is NEW and UNJUDGED, and the bank has to say so per tile --
# a batch that quietly relabels 54 fresh tiles as canon because 36 siblings were
# approved is exactly how unjudged art sneaks into the game.
APPROVED_8_1 = {
    'stucco_tan', 'stucco_bone', 'stucco_ochre', 'block_grey', 'block_painted',
    'roof_tile_terra', 'roof_tile_sand', 'roof_shingle', 'roof_shingle_bn',
    'metal_corrugate', 'wall_plaster_bare', 'gravel_roof',
}


def png(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()


def main():
    style = json.load(open(STYLE))
    tol = style['TOLERANCE']
    tgt = style['TARGET']

    # HIS tiles, for the side-by-side. Not decoration: the whole claim is that these
    # sit together, and that is judged by eye, not by my table.
    bank = json.load(open(GROUND))
    his = [t['b64'] for t in bank['tiles']
           if t.get('b64') and 'contrete' in str(t.get('pack', '')).lower()][:6]

    tiles, rows, misses = [], [], []
    for mi, mat in enumerate(MATERIALS):
        for k in range(3):                       # 3 variants each = 36 tiles
            im, m, ok = cook_to_target(mat, 9001 + mi * 101 + k * 7, tol, way=k)
            if not ok:
                misses.append((mat['id'], k, m))
            tiles.append(dict(id='%s_%d' % (mat['id'], k), material=mat['id'],
                              name=mat['name'], kind=mat['kind'],
                              rosy=bool(mat.get('rosy')),
                              verdict=('APPROVED 8/1' if mat['id'] in APPROVED_8_1
                                       else 'PENDING PAOLO'),
                              measured={kk: round(vv, 3) for kk, vv in m.items()},
                              in_tolerance=ok, b64=png(im)))
            rows.append((mat['id'], k, m, ok, im))

    # ---- the sheet: HIS on the top row, MINE under it, same scale, no labels lying
    S = 88
    cols = 12
    hrows = 1 + (len(rows) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * S, hrows * (S + 15) + 18), (26, 26, 30))
    dr = ImageDraw.Draw(sheet)
    dr.text((4, 3), 'TOP ROW = TILES YOU BOUGHT.  EVERYTHING BELOW = COOKED TO MATCH THEM.',
            fill=(235, 225, 200))
    for i, b in enumerate(his):
        im = Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB')
        sheet.paste(im.resize((S, S), Image.NEAREST), (i * S, 18))
        dr.text((i * S + 3, 18 + S), 'YOURS', fill=(240, 210, 140))
    for n, (mid, k, m, ok, im) in enumerate(rows):
        x, y = (n % cols) * S, (1 + n // cols) * (S + 15) + 18
        sheet.paste(im.resize((S, S), Image.NEAREST), (x, y))
        dr.text((x + 3, y + S), ('%s%d' % (mid[:11], k)), fill=(205, 205, 205))
    sheet.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_TEXTURE_MATCH_v1',
        'date': '2026-08-01',
        'ruling': 'Paolo 8/1: "make as much pixel art that I approve of for everything we '
                  'need in the game as possible INSPIRED BY THE GRAPHIC ASSETS THAT I '
                  'BOUGHT TRYING TO REPLICATE THE EXACT LOOK"',
        'style_source': STYLE,
        'note': 'Painted ONLY for surfaces his purchased library does not cover (house '
                'walls and roofs: he owns none, proven in records/BOHEMIA_BOUGHT_AUDIT_'
                '7_31_26.md). Cooked to the density measured off his own tiles, not to a '
                'taste: every tile is measured after drawing and redrawn until it lands '
                'inside tolerance.',
        'target': tgt,
        'tolerance': tol,
        'status': 'MIXED - see per-tile verdict',
        'verdict_batch_1': 'Paolo 8/1 APPROVED ALL 36 of the first batch, THUMBS UP: '
                           '"Holy shit so fucking good ... the graphics tiles that you '
                           'made are fucking fantastic thank you". Record: '
                           'records/BOHEMIA_VERDICT_TEXTURE_MATCH_8_1_26.txt',
        'approved_materials': sorted(APPROVED_8_1),
        'tiles': tiles,
    }, open(OUT, 'w'))

    agg = {k: st.mean([r[2][k] for r in rows])
           for k in ('colours', 'edge', 'grain', 'sat', 'lum_mean', 'lum_sd')}
    print('COOKED %d tiles across %d materials, aimed at HIS measured look' %
          (len(tiles), len(MATERIALS)))
    print('  %-14s %8s %7s %8s %7s' % ('', 'colours', 'edge', 'grain', 'sat'))
    print('  %-14s %8.0f %7.2f %7.1f%% %7.3f   <- HIS TILES'
          % ('TARGET', tgt['colours'], tgt['edge'], tgt['grain'], tgt['sat']))
    print('  %-14s %8.0f %7.2f %7.1f%% %7.3f   <- COOKED'
          % ('MINE', agg['colours'], agg['edge'], agg['grain'], agg['sat']))
    print('  in tolerance: %d/%d' % (sum(1 for r in rows if r[3]), len(rows)))
    for mid, k, m in misses:
        print('    MISS %s#%d  colours %d edge %.1f grain %.1f sat %.3f lum %.0f/%.0f'
              % (mid, k, m['colours'], m['edge'], m['grain'], m['sat'],
                 m['lum_mean'], m['lum_sd']))
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)


if __name__ == '__main__':
    main()
