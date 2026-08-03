#!/usr/bin/env python3
"""
BOHEMIA — THE PERIMETER WALL AND THE GATE MOUTH (8/2/26)

The last target-set surfaces on the block. The house itself is finished: roof, yard,
every wall tile, and as of this morning the openings. What is still flat is the thing
that RINGS the whole community and is therefore in almost every frame — the suburb
border wall — and the hole you walk out through, which the renderer draws as a plain
slab of concrete ground.

REUSE CHECK: THREE BANKS OPENED IN CODE, NOT NAME-CHECKED.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt — HIS OWN approved border walls, 13
    keys out of 61 candidates across two judging sessions. Decoded and MEASURED here
    (see reference_measured below), and the winner of batch 2 is read for its STRUCTURE,
    which is what this cook is built on. Not a pixel of it is copied.
  banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt — his PURCHASED library. It holds
    ground: street, concrete, dirt. No perimeter or garden wall, so under clause 5 of
    BOUGHT BEATS PAINTED this is the legal painted branch.
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — this lane's own approved work. The face
    field of every tile below is drawn by that cook's own material engine at the same
    measured density, so a perimeter wall and a house wall are the same world.

*** WHY THIS COOK EXISTS, IN ONE MEASUREMENT ***
His 13 approved border walls, measured against the style target derived from the tiles
he bought:

    HIS 7/14 PERIMETER WALLS   edge  5.63   grain 19.6%   colours 842
    THE TILES HE BOUGHT        edge 18.36   grain 61.1%   colours 1260
    TOLERANCE FLOOR            edge 14.27   grain 54.8%

They are SMOOTH — a third of the local contrast of the ground they stand on. That is
the same gap that got the 7/21 house skins replaced, and it is the gap he described
himself on 7/31 looking at the yard: two different games in one frame. So this is
newest-date-wins on a MEASURED difference, exactly like the house skins, and his pool
stays in the repo, waived by name, judgeable side by side. One word puts it back.

*** THE BUG THIS FOUND, WHICH IS LIVE RIGHT NOW ***
WB4 is the sole survivor of batch 2 — he killed 47 of 48 and kept that one. It is stored
in the bank as a 792x264 TILING PREVIEW: the real 44x44 art, upscaled 3x and repeated
6x2 so it could be judged as a wall rather than as a chip. The renderer does
`drawImage(im, X, Y, S, S)` — the WHOLE 792x264 sheet crushed into ONE 44px cell. One
community in thirteen has been wearing a grey smear. The recovery is exact (verified
pure 3x nearest upscale, so downsampling returns the original pixels bit for bit) and
lands in tools/build_run_slice.js, not here — his art, verbatim, fixed in PLACEMENT
only, which is clause 4.

WHAT MAKES A PERIMETER WALL READ AS A WALL AND NOT A STRIP OF TEXTURE
  CAP      a wall is CAPPED. The coping is a horizontal surface, so it faces the sky and
           is the brightest thing on the tile — the 45 DEGREE ART LAW's "sky-lit visible
           tops", and the single strongest read at 44px.
  OVERSAIL the cap is proud of the face, so it CASTS. A hard shadow line directly under
           it is what separates a capped wall from a painted stripe.
  FACE     the panel, in the cap's ambient shadow at the top, opening out below.
  PILLAR   real garden walls are not continuous; they are panels between pilasters. The
           pillar stands proud, catches light on its upper-left face (one light, upper
           left, same as every cooked tile in this game) and casts onto the panel beside
           it.
  GRADE    thirty years of blown dirt has splashed up the bottom courses, and weeds have
           taken the foot of the wall where the runoff goes.

VERTICALLY THESE TILES DO NOT WRAP, AND THAT IS CORRECT.
Every other tile in the texture-match set is seamless on both axes because it is a
FIELD. A wall is not a field: it has a top and a bottom in the world, the cap belongs at
the top and the grade line belongs at the bottom, and forcing y-wrap would put a coping
course through the middle of the dirt. So the seam test here is HORIZONTAL ONLY, and the
gate is told that explicitly rather than being quietly relaxed.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER a hard 1px black keyline — honoured. The line under the cap is a CAST SHADOW
    with a falloff, the pillar edge is a lit face meeting a shaded one. Nothing is
    traced.
  NEVER a bare undressed rectangle — honoured: cap, oversail, face, grade splash, weeds.
  NEVER purple outside the Amalgamation — honoured, desert neutrals only.
  DEAD-DARK / 12% CLUSTERED POWER — the gate mouth is unlit. A lit gatehouse would be a
    lie about the world.

  python3 tools/bohemia_perimeter_cook.py
    -> banks/BOHEMIA_PERIMETER_8_2_26.txt
    -> records/target/PERIMETER.png          the cooked set
    -> records/target/PERIMETER_VS_HIS.png   HIS 7/14 walls above MINE, same scale
"""
import base64
import colorsys
import importlib.util
import io
import json
import os
import statistics as st

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    'texcook', os.path.join(REPO, 'tools', 'bohemia_texture_match_cook.py'))
TEX = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(TEX)

CELL = 44
STYLE = 'records/BOHEMIA_STYLE_TARGET_8_1_26.json'
HIS_POOL = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'
OUT = 'banks/BOHEMIA_PERIMETER_8_2_26.txt'
SHEET = 'records/target/PERIMETER.png'
VS = 'records/target/PERIMETER_VS_HIS.png'

# ---- the wall's own anatomy, in pixels, on a 44px cell at 1px = 1.705cm
CAP_H = 8          # 13.6cm coping. A real 8" cap block is 20cm; this reads at 44px.
CAP_LIP = 2        # how far the cap oversails the face
SHADOW_H = 5       # the cast shadow under the oversail, falling off
GRADE_H = 6        # blown dirt splashed up the bottom, 10cm
PILLAR_W = 12      # 20cm pilaster, the real proportion against a 44px panel

# *** HIS 8/2 VERDICT, AND THE REASON SEVEN DESIGNS WENT DOWN. ***
# "I'm just confused. I like the middle part of the wall. It's kind of confusing.
#  Looks like it's glitching out."
# He was looking at a hero feature STAMPED AT EXACTLY 44px PITCH. The cook drew ONE face
# tile per design and the run repeated it forever, so the one crack or one weed baked
# into that tile reappeared on every single cell of the wall, in the same place, all the
# way down the block. An identical high-contrast mark on a perfect grid does not read as
# damage. It reads as a rendering fault, which is precisely the word he used.
#
# His purchased ground library never showed this because the run shuffles FIFTEEN of his
# tiles across the cells; the repeat pitch is fifteen cells and invisible. The wall had a
# pitch of one. That is also why the tan slump designs survived and the stucco ones did
# not: slump has strong block coursing that outranks the stamp, and stucco is a flat
# field where the stamp is the only structure there is.
#
# So: EIGHT face variants and eight base variants per design, shuffled along the run, and
# most of them carry NO hero feature at all. A wall is not a road. His concrete is crazed
# edge to edge because thirty years of traffic did that; a garden wall gets a crack here
# and a crack there.
FACE_VARIANTS = 8
# one face in four is allowed an event; the rest are field and coursing
FEATURE_RATE = 0.25


# ---------------------------------------------------------------------------- materials
# Real Las Vegas residential perimeter walls. Every one of these rings a subdivision
# somewhere off Rainbow or Eastern right now. `kind` is the texture-match cook's own
# material engine, reused; this file adds the ARCHITECTURE on top of the field it draws.
WALLS = [
    dict(id='perim_slump',     rgb=(146, 130, 104), kind='block',  wear=0.60,
         name='perimeter wall, tan slump block'),
    dict(id='perim_splitface', rgb=(124, 121, 114), kind='block',  wear=0.55,
         name='perimeter wall, grey split-face block'),
    # STUCCO OVER BLOCK, and the 'over block' is the part that was missing. Drawn as a
    # pure stucco field it had NO structure of its own, so the one crack on the tile was
    # the only thing the eye had to hold and its 44px repeat was unmissable - all three
    # colourways went down on 8/2. A real Vegas garden wall is stucco skimmed over CMU
    # and the coursing ghosts through it, especially after thirty years of the sun.
    dict(id='perim_stucco',    rgb=(150, 134, 108), kind='block', ghost=0.34, wear=0.65,
         name='perimeter wall, stucco over block'),
    dict(id='perim_precast',   rgb=(134, 132, 126), kind='tiltup', wear=0.50,
         name='perimeter wall, precast concrete panel'),
    # DECLARED ROSY. He asked for colour variety on 8/1 and desert rose is a real
    # southwestern tract colour; the gate's PINK test exempts DECLARED colourways only,
    # so an accidental salmon still fails, which is the whole point of declaring.
    dict(id='perim_rose',      rgb=(152, 128, 114), kind='block', ghost=0.34, wear=0.55,
         rosy=True, name='perimeter wall, desert rose stucco'),
    dict(id='perim_cmu',       rgb=(122, 120, 115), kind='block',  wear=0.70,
         name='perimeter wall, bare grey CMU'),
]


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def scale(c, f):
    return tuple(min(255, max(0, int(v * f))) for v in c[:3])


# LIGHT IS A BLEND TOWARD THE SKY, NEVER A MULTIPLY. The first pass brightened the cap
# with `v * 1.30` and then the pillar brightened the same pixels again with `v * 1.34`,
# and the coping came out as a block of PURE 255 WHITE — a blown highlight with no
# material left in it at all, on the brightest and most-read surface of the tile. A
# multiply has no ceiling; a blend toward a fixed sky colour cannot clip no matter how
# many times it is applied, and it keeps the material's own grain inside the highlight.
SKYLIT = (216, 208, 190)
SHADE = (44, 41, 37)


def toward(c, target, a):
    return tuple(int(c[i] + (target[i] - c[i]) * a) for i in range(3))


def lit(c, a):
    return toward(c, SKYLIT, a)


def dim(c, a):
    return toward(c, SHADE, a)


# THE CAP IS COURSED, NOT PAINTED. WB4 — the one wall he kept out of the 48 in batch 2 —
# has a coping made of INDIVIDUAL CAP STONES with visible joints between them, and that
# is what makes it read as a built wall at 44px rather than a light stripe along the top.
# 11px divides 44, so the joints never cut at the tile border.
CAP_UNIT = 11


# ------------------------------------------------------------------------ the anatomy
# PHASE 5, NOT 0. A cap joint sitting at x=0 lands exactly on the tile's own left edge,
# and on the precast wall it stacked on top of that material's panel joint (also at
# x=0..1) so the left edge went double-dark while the right edge was plain body. The
# join measured 1.62x the tile's worst interior line — a visible black rule down the
# grid, which is precisely the border he circled on 8/1. Off-phase, the tiles meet stone
# to stone and the joints fall where a mason would have put them.
CAP_PHASE = 5


def cap(im, rnd, x0=0, x1=CELL, height=CAP_H, phase=CAP_PHASE):
    """THE COPING. A horizontal surface, so it faces the sky and is the lightest thing
    on the tile — the 45 degree art law's sky-lit top. Then it OVERSAILS and casts."""
    px = im.load()
    for y in range(height):
        # the cap's own top face is brightest at the BACK edge, because a viewer at 45
        # degrees sees more sky off the far side of a horizontal surface
        t = 1.0 - y / float(height)
        for x in range(x0, x1):
            a = 0.30 + t * 0.20 + rnd.r(-0.04, 0.04)
            px[x, y] = lit(px[x, y], a) + (255,)
    # THE JOINTS between cap stones, and each stone tilted a hair differently so the run
    # is not a machined extrusion
    for u in range(x0 // CAP_UNIT, x1 // CAP_UNIT + 2):
        jx = u * CAP_UNIT + phase
        tilt = rnd.r(-0.06, 0.06)
        for y in range(height):
            for x in range(x0, x1):
                if (x - jx) % CAP_UNIT == 0:
                    px[x, y] = dim(px[x, y], 0.34) + (255,)
        for x in range(max(x0, jx), min(x1, jx + CAP_UNIT)):
            for y in range(height):
                px[x, y] = lit(px[x, y], max(0.0, tilt)) if tilt > 0 else \
                    dim(px[x, y], -tilt)
                px[x, y] = px[x, y][:3] + (255,)
    # THE FRONT LIP: the cap's own vertical edge, turned away from the light
    for y in range(height, height + CAP_LIP):
        for x in range(x0, x1):
            px[x, y] = dim(px[x, y], 0.30 + rnd.r(-0.04, 0.04)) + (255,)
    # THE CAST SHADOW. Not a line — a falloff, or it is a keyline wearing a hat.
    for k in range(SHADOW_H):
        y = height + CAP_LIP + k
        if y >= CELL:
            break
        a = 0.46 * (1.0 - (k / float(SHADOW_H)) ** 0.7)
        for x in range(x0, x1):
            px[x, y] = dim(px[x, y], a) + (255,)


def grade(im, rnd, veg=True):
    """BLOWN DIRT, thirty years of it, splashed up off the ground onto the bottom
    courses — and the weeds that live at the foot of a wall because that is where the
    runoff goes. Dirt goes UP the wall from the ground, never down from the sky."""
    px = im.load()
    for x in range(CELL):
        h = GRADE_H + int(rnd.r(-2, 3))            # the splash line is not straight
        for k in range(h):
            y = CELL - 1 - k
            if y < 0:
                continue
            t = 1.0 - k / float(max(h, 1))          # heaviest at the very bottom
            b = px[x, y]
            dirt = (118, 100, 74)
            a = 0.20 + 0.55 * t
            px[x, y] = tuple(int(b[i] * (1 - a) + dirt[i] * a) for i in range(3)) + (255,)
    if veg:
        # A LOW STRAW FRINGE, not the ground cook's rosette. TEX.weed draws a plant seen
        # from ABOVE — a radial rosette with a dark core — which is right for a weed in
        # a yard and wrong for one against a wall, where you see it EDGE-ON and it is
        # almost all blade. Reusing it here would have put little bushes on the skirting.
        for _ in range(int(rnd.r(4, 11))):
            bx = int(rnd.r(1, CELL - 1))
            bh = int(rnd.r(2, 7))
            lean = rnd.r(-0.45, 0.45)
            for k in range(bh):
                y = CELL - 1 - k
                x = int(bx + lean * k)
                if 0 <= x < CELL and 0 <= y < CELL:
                    g = int(rnd.r(96, 138))
                    px[x, y] = (g, int(g * 0.88), int(g * 0.55), 255)


def pillar(im, rnd):
    """A PILASTER. Real garden walls are panels between pillars, and the pillar is what
    makes a long run read as built rather than extruded. It stands proud: lit on the
    upper-left face (one light, upper left, like every cooked tile), and it CASTS onto
    the panel next to it.

    IT HAS ITS OWN COURSING, and that is the fix that made it read. Brightening the same
    field by 18% produced a lighter STRIPE, not a pillar — the wall's own block joints
    ran straight through it, so the eye read one continuous surface with a highlight on
    it. A real pilaster is laid separately: its own blocks, its own joints, not lining up
    with the panel's. The mismatched joint is the depth cue, not the brightness."""
    px = im.load()
    CAPW = PILLAR_W + 3                        # A CAP OVERSAILS SIDEWAYS TOO, not just
    PCAP_H = CAP_H + 4                         # forward, and it stands taller than the run
    body_top = PCAP_H + 2
    # the pillar body: proud of the face, so it catches more light
    for y in range(CELL):
        for x in range(PILLAR_W):
            px[x, y] = lit(px[x, y], 0.20 + rnd.r(-0.03, 0.03)) + (255,)
    # ITS OWN BLOCKS. 11px courses, deliberately out of phase with the panel behind it.
    for y in range(body_top, CELL):
        if (y - body_top) % 11 == 0:
            for x in range(PILLAR_W):
                px[x, y] = dim(px[x, y], 0.44) + (255,)
        elif (y - body_top) % 11 == 1:         # the lit lower lip of the course above
            for x in range(PILLAR_W):
                px[x, y] = lit(px[x, y], 0.20) + (255,)
    # its own cap, taller and wider than the wall's, because a pillar cap sits on top of
    # and over the run it terminates
    cap(im, rnd, x0=0, x1=CAPW, height=PCAP_H, phase=5)
    # THE PILLAR CAP CASTS ON THE WALL CAP BESIDE IT. Two horizontal surfaces at
    # different heights is what says "this one is in front"; without this the taller cap
    # just looks like a taller stripe.
    for k in range(3):
        x = CAPW + k
        if x < CELL:
            for y in range(PCAP_H + CAP_LIP):
                px[x, y] = dim(px[x, y], 0.40 * (1.0 - k / 3.0)) + (255,)
    # THE CAST SHADOW onto the panel to its right. This is the whole reason a pillar
    # reads as proud instead of as a lighter stripe, so it is deep and it is wide.
    for k in range(6):
        x = PILLAR_W + k
        if x >= CELL:
            break
        a = 0.56 * (1.0 - (k / 6.0) ** 0.55)
        for y in range(body_top - 2, CELL):
            px[x, y] = dim(px[x, y], a) + (255,)
    # the pillar's own left return turns away from us at 45 degrees: a narrow darker face
    for x in range(2):
        for y in range(body_top, CELL):
            px[x, y] = dim(px[x, y], 0.18) + (255,)


# ---------------------------------------------------------------------- the gate mouth
# The hole you walk out of. Today the renderer draws grid code 5 as 'concrete_0' — a
# plain slab of ground where the community wall opens, with no jamb, no head and no gate.
#
# IT IS AN OVERLAY WITH ALPHA, for exactly the reason the windows are: one wall design
# per community is his law, so a baked gate could only ever carry ONE of the eighteen
# walls and every other community would show a gate in the wrong block. Transparent
# where the community's own wall belongs (the cap band and the two jambs), opaque where
# the hole is.
GATE_JAMB = 7          # how much wall shows on each side of the mouth


def gate_mouth(rnd, steel, ends='lr', vert='full'):
    """ends: which sides of THIS cell carry a jamb. vert: where this cell sits in a
    gate that is more than one cell TALL.

    THE APERTURE IS SEVEN TILES WIDE AND IT IS ONE GATE. Drawing the same jambed tile
    across all of it put FOUR SEPARATE BARRED GATES side by side in the wall - caught on
    the real surface at estate cell 8,35, invisible in the sheet where a single tile is
    obviously correct. So the run gets three pieces, the same way the garage bay already
    does: 'l' carries the left jamb, 'r' the right, and 'm' neither, so the opening reads
    as one wide entrance with a wall pier at each end of it.

    *** AND IT IS TWO TILES TALL TOO, WHICH IS WHAT PAOLO CIRCLED ON 8/2. ***
    "why if you're gonna have a gate like why is there a middle brick part of it"
    He drew a ring around a band of BRICK running straight through the middle of the
    barred gate, and he was looking at a real defect in the game, not a card artifact.
    Every overlay leaves its top rows TRANSPARENT so the community's own coping shows
    through above the opening - correct, that is the lintel. The block's perimeter is TWO
    cells thick where it runs east-west, and the same overlay was drawn on BOTH, so the
    LOWER cell's transparent band let a course of wall show across the gate's waist. It
    also gave the gate two thresholds and two head shadows.

    A tall opening is not one tile repeated, it is a TOP and a BOTTOM:
      full    a one-cell gate: coping above, threshold below
      top     coping above, and the opening runs off the BOTTOM edge to continue
      bottom  the opening arrives from the TOP edge, threshold below, no coping band
    Exactly the split the garage bay already uses, for exactly the same reason.
    """
    im = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
    px = im.load()
    x0 = GATE_JAMB if 'l' in ends else 0
    x1 = (CELL - 1 - GATE_JAMB) if 'r' in ends else CELL - 1
    # the mouth starts under the coping - unless the coping is a cell above us, in which
    # case the opening simply continues and there is no band to leave transparent
    y0 = 0 if vert == 'bottom' else CAP_H + CAP_LIP
    floor = vert != 'top'                      # a top piece has no threshold; it continues
    # *** YOU LOOK THROUGH A GATE, YOU DO NOT LOOK AT A HOLE. ***
    # The first version filled the mouth with near-black and it came out as a bare
    # undressed rectangle — the exact thing the taste canon bans, and dead wrong besides:
    # an OPEN gate has the other side of the wall behind it. What is back there is
    # ground, in the wall's own thickness-shadow at the top and opening out to sky-lit
    # dirt further away. That gradient IS the depth; without it the wall reads as
    # infinitely thick.
    for y in range(y0, CELL):
        t = (y - y0) / float(max(CELL - 1 - y0, 1))
        base = 26 + t * 74                     # shadow at the head, daylight beyond
        for x in range(x0, x1 + 1):
            # and darker toward the jambs, because the reveal shades what is behind it
            side = min(x - x0, x1 - x) / float(max((x1 - x0) / 2.0, 1))
            v = base * (0.62 + 0.38 * side ** 0.6) + rnd.r(-7, 8)
            v = max(9, min(190, v))
            px[x, y] = (int(v), int(v * 0.95), int(v * 0.84), 255)
    for _ in range(120):                       # gravel and blown litter out in the gap
        x, y = int(rnd.r(x0 + 2, x1 - 1)), int(rnd.r(y0 + 8, CELL))
        b = px[x, y]
        f = rnd.r(0.66, 1.34)
        px[x, y] = tuple(min(255, int(c * f)) for c in b[:3]) + (255,)
    # HEAD: the underside of the lintel, the hardest shadow on the tile. Only where the
    # lintel actually is - a bottom piece has the rest of the opening above it.
    if vert != 'bottom':
        for k in range(3):
            for x in range(x0, x1 + 1):
                px[x, y0 + k] = (24, 22, 21, 255)
    # REVEAL: the wall has thickness, so the left jamb shows its inner face, lit, and
    # the right jamb shows its shaded one. This is what makes a hole a hole.
    for y in range(y0, CELL):
        for k in range(2):
            if 'l' in ends:
                px[x0 + k, y] = scale((112, 106, 96), 1.06 - k * 0.22) + (255,)
            if 'r' in ends:
                px[x1 - k, y] = scale((112, 106, 96), 0.52 + k * 0.10) + (255,)
    # THRESHOLD: a concrete apron catching sky at the foot of the opening, and the dirt
    # tracked over it by everything that ever walked through. ONCE per gate, at the
    # bottom of it - a top piece has another cell of opening below it.
    if floor:
        for k in range(5):
            y = CELL - 1 - k
            t = k / 5.0
            for x in range(x0, x1 + 1):
                g = int(150 - t * 54 + rnd.r(-13, 13))
                px[x, y] = (g, int(g * 0.97), int(g * 0.90), 255)
        for _ in range(48):
            x, y = int(rnd.r(x0, x1)), int(rnd.r(CELL - 6, CELL))
            b = px[x, y]
            px[x, y] = tuple(int(b[i] * 0.72 + (104, 88, 66)[i] * 0.28)
                             for i in range(3)) + (255,)

    if steel:
        yb = (CELL - 5) if floor else CELL     # where the leaf stops: at the threshold,
        #                                        or at the cell edge if it continues below
        # behind a gate that is still hung you see the same ground, but dimmer: the leaf
        # itself shades it, and DEAD-DARK is act-1 law on anything that could read as lit
        for y in range(y0, yb):
            for x in range(x0, x1 + 1):
                px[x, y] = tuple(int(c * 0.58) for c in px[x, y][:3]) + (255,)
        # A BARRED GATE, still hanging. Wrought pickets on 4px centres (4 divides 44), a
        # top and bottom rail, dead dark between them — 12% CLUSTERED POWER means there
        # is nothing lit on the other side of it.
        # THE PICKETS RUN THROUGH THE CELL EDGE. A two-cell-tall gate is ONE leaf, so the
        # bars on the lower piece have to start at y=0 and line up with the bars above -
        # they are on 4px centres off x0, which is a fixed offset, so they do.
        ytop = (y0 + 3) if vert != 'bottom' else 0
        for x in range(x0 + 2, x1 - 1):
            if (x - x0) % 4 == 0:
                for y in range(ytop, yb):
                    g = int(rnd.r(58, 84))
                    px[x, y] = (g, int(g * 0.94), int(g * 0.86), 255)
                    if x + 1 <= x1:
                        px[x + 1, y] = (int(g * 0.55), int(g * 0.53), int(g * 0.49), 255)
        # ONE TOP RAIL AND ONE BOTTOM RAIL PER GATE, not per cell
        rails = []
        if vert != 'bottom':
            rails.append(y0 + 4)
        if floor:
            rails.append(CELL - 11)
        for ry in rails:
            for x in range(x0 + 2, x1):
                g = int(rnd.r(74, 104))
                px[x, ry] = (g, int(g * 0.94), int(g * 0.86), 255)
                px[x, ry + 1] = (int(g * 0.5), int(g * 0.48), int(g * 0.45), 255)
        # RUST, running down off the rails, because it has been thirty years
        for _ in range(70):
            x = int(rnd.r(x0 + 2, x1))
            y = int(rnd.r(ytop + 2, yb - 1))
            b = px[x, y]
            px[x, y] = tuple(int(b[i] * 0.62 + (112, 62, 34)[i] * 0.38)
                             for i in range(3)) + (255,)
    return im


# ------------------------------------------------------------------------------- cook
def ghost_coursing(im, mat, rnd):
    """STUCCO OVER BLOCK. The skim coat does not erase the wall underneath it - the
    coursing telegraphs through, softly, and after thirty years of sun and settlement it
    telegraphs plainly. Drawn at the block cook's own 11x22 module so a stucco wall and a
    bare CMU wall in the same neighbourhood are the same masonry wearing different coats.

    This is here because of his 8/2 verdict, and it is a structure fix rather than a
    tuning one: all three stucco colourways went down, and the reason was that a flat
    field gives the eye nothing to hold except the one crack on the tile - so the crack's
    44px repeat became the whole read."""
    g = mat.get('ghost')
    if not g:
        return
    px = im.load()
    for y in range(CAP_H + CAP_LIP, CELL):
        row = y // 11
        for x in range(CELL):
            mx = (x + (row % 2) * 11) % 22
            my = y % 11
            if my == 0 or mx == 0:
                px[x, y] = dim(px[x, y], 0.20 * g + rnd.r(-0.03, 0.03)) + (255,)
            elif my == 10:
                px[x, y] = lit(px[x, y], 0.10 * g) + (255,)


def cook_wall(mat, seed, tol, way, form, feat=1.0):
    """the texture-match cook draws the FIELD; this file builds the WALL out of it.

    *** MEASURE THE FINISHED TILE, NOT THE FIELD IT STARTED FROM. ***
    cook_to_target draws a field and redraws it until the FIELD lands inside his measured
    tolerance. That is the right loop for a texture and the wrong one for a wall, because
    the architecture this file adds afterwards changes the number: the cap and its joints
    and its cast shadow ADD local contrast, and the capless 'base' form, which has none
    of them, LOSES it. Four base tiles shipped at edge below his 14.27 floor while their
    fields had passed - smooth art getting through on a measurement of something else.
    So the field is redrawn from a fresh seed until the WALL measures right.
    """
    for attempt in range(8):
        im, m, ok = _build(mat, seed + attempt * 6151, tol, way, form, feat)
        if ok and TEX.inside(TEX.measure(im.convert('RGB')), tol):
            return im, m, True
        if attempt == 0:
            first = (im, m, ok)
    return first[0], first[1], False


def _build(mat, seed, tol, way, form, feat=1.0):
    field, m, ok = TEX.cook_to_target(mat, seed, tol, way=way, feat=feat)
    im = field.convert('RGBA')
    ghost_coursing(im, mat, TEX.Rnd(seed * 17 + 3))
    rnd = TEX.Rnd(seed * 31 + 7 + {'face': 0, 'pillar': 977, 'base': 4231}[form])
    # A WALL HAS ONE COPING, NOT ONE PER CELL. The block's perimeter is two cells thick
    # where it runs east-west, and giving both rows a cap drew TWO WALLS stacked on top
    # of each other - caught on the real surface, not in the sheet, because a single tile
    # looks perfect either way. The far row carries the cap (it is the top of the wall
    # you are looking down on); the near row is the FACE below it, which is what 'base'
    # is: same material, no coping, and it starts in the cap's shadow.
    if form == 'base':
        px = im.load()
        # THE WHOLE TOP OF THIS TILE IS UNDER THE COPING ABOVE IT, so it is in shadow -
        # deepest right under the oversail and lifting away from it. Shallower than this
        # and the precast panel's own light top course read as a SECOND coping, which is
        # exactly the stacked-walls bug this form exists to remove.
        for k in range(CAP_H + SHADOW_H):
            a = 0.42 * (1.0 - (k / float(CAP_H + SHADOW_H)) ** 0.8)
            for x in range(CELL):
                px[x, k] = dim(px[x, k], a) + (255,)
    else:
        cap(im, rnd)
    if form == 'pillar':
        pillar(im, rnd)
    grade(im, rnd)
    return im, m, ok


def hseam(im, right=None):
    """HORIZONTAL seam only, and against THE TILE THAT ACTUALLY FOLLOWS IT.

    A wall has a top and a bottom in the world; it wraps left-to-right along the run and
    nowhere else, so there is no vertical seam to test and forcing one would put a coping
    course through the middle of the dirt.

    The neighbour matters. A FACE tile repeats against itself, so its own right edge
    meets its own left. A PILLAR does not: pillars are what panels run BETWEEN, so a
    pillar's right edge always meets a FACE's left edge. Testing a pillar against itself
    measured a join that never happens in the game and reported 1.62 on tiles that are
    seamless where they are actually used.

    Measured against the pair's own worst interior column, the same test the texture gate
    uses, so a block wall is allowed the mortar joint it is supposed to have.
    """
    im = im.convert('RGB')
    nb = (right or im).convert('RGB')
    w, h = im.size
    b, nbb = im.tobytes(), nb.tobytes()

    def L(buf, x, y):
        i = (y * w + x) * 3
        return 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2]

    colj = [st.mean([abs(L(b, x, y) - L(b, x + 1, y)) for y in range(h)])
            for x in range(w - 1)]
    colj += [st.mean([abs(L(nbb, x, y) - L(nbb, x + 1, y)) for y in range(h)])
             for x in range(w - 1)]
    return st.mean([abs(L(b, w - 1, y) - L(nbb, 0, y)) for y in range(h)]) \
        / max(max(colj), 1e-6)


def measure_his():
    """HIS 13, decoded and measured. WB4 is stored as a 3x tiling preview, so it is
    recovered to its true 44x44 before measuring — measuring the upscale would report a
    wall three times smoother than it is and the comparison would be a lie."""
    bank = json.load(open(HIS_POOL))
    out = []
    for p in bank['pool']:
        if p['variant'] != 'tan':
            continue
        im = Image.open(io.BytesIO(base64.b64decode(p['b64']))).convert('RGB')
        if im.size != (CELL, CELL):
            k = im.width // CELL
            unit = im.crop((0, 0, CELL * (k if k <= 3 else 1), CELL * (k if k <= 3 else 1)))
            im = unit.resize((CELL, CELL), Image.NEAREST)
        out.append((p['key'], im, TEX.measure(im)))
    return out


def png(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()


def main():
    style = json.load(open(STYLE))
    tol, tgt = style['TOLERANCE'], style['TARGET']

    his = measure_his()
    hm = {k: st.mean([h[2][k] for h in his]) for k in ('colours', 'edge', 'grain', 'sat')}

    tiles, rows, misses = [], [], []
    for mi, mat in enumerate(WALLS):
        for k in range(3):
            seed0 = 4400 + mi * 137 + k * 11
            drawn = {}
            # EIGHT FACES AND EIGHT BASES, ONE PILLAR. The pillar is architecture and
            # belongs on a rhythm; the face is FIELD and must never repeat at the cell.
            # Most variants are drawn with the hero features turned right down, so a
            # crack is something you come across rather than something stamped on every
            # block of the wall. That single change is his whole 8/2 complaint.
            for v in range(FACE_VARIANTS):
                feat = 1.0 if (v % int(round(1 / FEATURE_RATE))) == 0 else 0.0
                drawn['face_%d' % v] = cook_wall(mat, seed0 + v * 977, tol, k, 'face', feat)
                drawn['base_%d' % v] = cook_wall(mat, seed0 + v * 977, tol, k, 'base', feat)
            drawn['pillar'] = cook_wall(mat, seed0, tol, k, 'pillar', 0.0)
            for form, (im, m, ok) in drawn.items():
                base_form = form.split('_')[0]
                mm = TEX.measure(im.convert('RGB'))
                if not ok:
                    misses.append((mat['id'], k, form, mm))
                # a pillar's right edge meets a FACE, never another pillar
                nb = drawn['face_0'][0] if base_form == 'pillar' else None
                tiles.append(dict(id='%s_%s_%d' % (mat['id'], form, k),
                                  material=mat['id'], form=base_form,
                                  variant=(0 if base_form == 'pillar' else int(form.split('_')[1])),
                                  colourway=k, name=mat['name'],
                                  kind=mat['kind'], rosy=bool(mat.get('rosy')),
                                  verdict='PENDING PAOLO',
                                  measured={a: round(b, 3) for a, b in mm.items()},
                                  hseam=round(hseam(im, nb), 3),
                                  in_tolerance=ok, b64=png(im)))
                rows.append((mat['id'], base_form, k, mm, ok, im))

    gates = []
    for steel in (False, True):
        for vert in ('full', 'top', 'bottom'):
            for ends in ('lr', 'l', 'm', 'r'):
                rnd = TEX.Rnd(880231 + (1 if steel else 0) + len(ends) * 31
                              + ord(ends[0]) + ord(vert[0]) * 613)
                im = gate_mouth(rnd, steel, ends, vert)
                gid = (('perim_gate_steel' if steel else 'perim_gate_open')
                       + '_' + ends + '_' + vert)
                gates.append(dict(id=gid, form='gate_overlay', ends=ends, vert=vert,
                                  name=('the community gate, barred steel leaf still '
                                        'hanging' if steel
                                        else 'the community gate, mouth standing open')
                                       + {'lr': ', one cell wide', 'l': ', left pier',
                                          'm': ', middle of the run',
                                          'r': ', right pier'}[ends]
                                       + {'full': '', 'top': ', upper course',
                                          'bottom': ', lower course'}[vert],
                                  why='ALPHA OVERLAY: transparent where the community wall '
                                      'belongs, opaque where the hole is, so one gate '
                                      'matches every wall instead of one. Split l/m/r '
                                      'because the aperture is seven tiles WIDE, and '
                                      'top/bottom because it is two cells TALL - drawing '
                                      'the same piece on both put a course of brick '
                                      'through the middle of the gate (Paolo 8/2).',
                                  verdict='PENDING PAOLO', b64=png(im)))
                gates[-1]['_im'] = im

    # ---- the sheet: the cooked set, drawn as a RUN of wall the way it will be seen
    S = 66
    cols = 12
    n = len(rows)
    hgt = ((n + cols - 1) // cols) * (S + 14) + 26 + S + 14
    sheet = Image.new('RGB', (cols * S, hgt), (26, 26, 30))
    dr = ImageDraw.Draw(sheet)
    dr.text((4, 4), 'THE PERIMETER WALL. face + pillar, six materials, three colourways each.',
            fill=(235, 225, 200))
    for i, (mid, form, k, m, ok, im) in enumerate(rows):
        x, y = (i % cols) * S, 22 + (i // cols) * (S + 14)
        sheet.paste(im.convert('RGB').resize((S, S), Image.NEAREST), (x, y))
        dr.text((x + 2, y + S), '%s%d' % (form[:4], k), fill=(200, 200, 200))
    gy = 22 + ((n + cols - 1) // cols) * (S + 14)
    wallbg = rows[0][5]
    for i, g in enumerate(gates[:cols]):
        comp = wallbg.copy()
        comp.alpha_composite(g['_im'])
        sheet.paste(comp.convert('RGB').resize((S, S), Image.NEAREST), (i * S, gy))
        dr.text((i * S + 2, gy + S), g['id'][6:], fill=(240, 210, 140))
    sheet.save(SHEET)

    # ---- HIS ABOVE MINE, same scale, drawn as RUNS. This is the judge sheet: the claim
    # is that his are smooth against a textured world, and that is decided by eye.
    RUN = 4
    T = 96
    vh = 26 + (T + 16) * 2 + 20
    vs = Image.new('RGB', (RUN * T * 3, vh), (26, 26, 30))
    vd = ImageDraw.Draw(vs)
    vd.text((4, 4), 'TOP = YOUR 7/14 WALLS.   BOTTOM = THE NEW ONES.   Same scale, drawn as runs.',
            fill=(235, 225, 200))
    for i, (key, im, m) in enumerate(his[:3]):
        for r in range(RUN):
            vs.paste(im.resize((T, T), Image.NEAREST), ((i * RUN + r) * T, 26))
        vd.text((i * RUN * T + 3, 26 + T), '%s  edge %.1f' % (key, m['edge']),
                fill=(240, 210, 140))
    seen, pick = set(), []
    for r in rows:
        if r[2] == 0 and r[1] == 'face' and r[0] not in seen:
            seen.add(r[0]); pick.append(r)
        if len(pick) == 3:
            break
    for i, (mid, form, k, m, ok, im) in enumerate(pick):
        for r in range(RUN):
            src = next(q[5] for q in rows
                       if q[0] == mid and q[1] == 'pillar' and q[2] == k) if not (r % 3) \
                else [q[5] for q in rows if q[0] == mid and q[1] == 'face' and q[2] == k][r % 3]
            vs.paste(src.convert('RGB').resize((T, T), Image.NEAREST),
                     ((i * RUN + r) * T, 26 + T + 16))
        vd.text((i * RUN * T + 3, 26 + (T + 16) + T),
                '%s  edge %.1f' % (mid[6:], m['edge']), fill=(160, 230, 170))
    vs.save(VS)

    for g in gates:
        g.pop('_im')
    json.dump({
        'version': 'BOHEMIA_PERIMETER_v1',
        'date': '2026-08-02',
        'note': 'The suburb border wall and the gate mouth, cooked to the density '
                'measured off the tiles Paolo bought. Vertically these tiles DO NOT '
                'wrap and that is deliberate: a wall has a cap at the top and a grade '
                'line at the bottom. They wrap horizontally, along the run.',
        'seam_axis': 'horizontal only',
        'style_source': STYLE,
        'reference': 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt (his 13 approved '
                     'walls). Read for STRUCTURE — WB4, the sole survivor of the 48 in '
                     'batch 2, is a capped wall with a pillar and a shadowed panel, and '
                     'that is the anatomy every tile here is built on. No pixel copied.',
        'reference_measured': {
            'his_perimeter': {k: round(v, 3) for k, v in hm.items()},
            'bought_target': {k: round(tgt[k], 3) for k in ('colours', 'edge', 'grain', 'sat')},
            'why_replaced': 'edge %.2f against a tolerance floor of %.2f: his walls carry '
                            'a third of the local contrast of the ground they stand on. '
                            'Same measured gap that replaced the 7/21 house skins.'
                            % (hm['edge'], tol['edge'][0]),
        },
        'wb4_bug': 'WB4 is stored as a 792x264 tiling preview (the true 44x44 upscaled 3x, '
                   'repeated 6x2). The renderer blits the whole sheet into one 44px cell, '
                   'so one community in thirteen wears a smear. Recovery is exact and '
                   'lands in tools/build_run_slice.js. His pixels, placement fixed only.',
        'status': 'PENDING PAOLO',
        'tolerance': tol,
        'tiles': tiles + gates,
    }, open(OUT, 'w'))

    agg = {k: st.mean([r[3][k] for r in rows]) for k in ('colours', 'edge', 'grain', 'sat')}
    print('COOKED %d perimeter tiles across %d materials + %d gate overlays'
          % (len(tiles), len(WALLS), len(gates)))
    print('  %-22s %8s %7s %8s %7s' % ('', 'colours', 'edge', 'grain', 'sat'))
    print('  %-22s %8.0f %7.2f %7.1f%% %7.3f   <- THE TILES HE BOUGHT'
          % ('TARGET', tgt['colours'], tgt['edge'], tgt['grain'], tgt['sat']))
    print('  %-22s %8.0f %7.2f %7.1f%% %7.3f   <- HIS 7/14 PERIMETER WALLS'
          % ('HIS PERIMETER', hm['colours'], hm['edge'], hm['grain'], hm['sat']))
    print('  %-22s %8.0f %7.2f %7.1f%% %7.3f   <- COOKED'
          % ('MINE', agg['colours'], agg['edge'], agg['grain'], agg['sat']))
    print('  in tolerance: %d/%d   worst h-seam %.2f'
          % (sum(1 for r in rows if r[4]), len(rows),
             max(t['hseam'] for t in tiles)))
    for mid, k, form, m in misses:
        print('    MISS %s %s#%d  edge %.1f grain %.1f lum %.0f'
              % (mid, form, k, m['edge'], m['grain'], m['lum_mean']))
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)
    print('  -> %s' % VS)


if __name__ == '__main__':
    main()
