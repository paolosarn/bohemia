#!/usr/bin/env python3
"""THE GROUND TELLS YOU WHAT HAPPENED  (COOK [footprints] round 2, 9/23/26)

HIS WORDS, from the first votes: "make pixel art of footsteps that lead you to the
conclusion."

ROUND 1 (207df29d) DREW THE BOOT. It cooked one sole, pressed it into four grounds as a
depression lit by the same north-west sun as everything else, and proved no print invents
a colour. What it did NOT do is the second half of his sentence. A line of identical boots
crossing a swatch is a texture. IT LEADS YOU NOWHERE, because a trail only says something
when the marks in it DISAGREE with each other: this bit walked, this bit ran, here it
stopped, here it went down, here something was pulled away.

AND ROUND 1 HAS A DEFECT I FOUND BY LOOKING, NOT BY MEASURING. Its walk turns through
about 230 degrees and EVERY BOOT IN IT POINTS NORTH, because the print was stamped at the
path position and never rotated to the heading. Halfway along that trail the boots are
walking sideways and by the end they are walking backwards. A trail whose feet point the
wrong way does not just look wrong, it says the wrong thing -- which is the exact failure
this row exists to avoid. Fixed here: a print points where the walker went, with a real
toe-out angle off the line of travel.

SO THIS ROUND COOKS THE OTHER FOUR MARKS AND ONE PICTURE THAT USES ALL FIVE:
  WALKED   the full sole, feet on two lines, toes out
  STOOD    a pair side by side, pressed deeper, one of them twisted
  RAN      the ball and toe only, the heel gone, the gap much longer, the two lines
           closed to one, and material thrown backward behind each push-off
  WENT DOWN a pivot crescent where the sole turned in place
  DRAGGED  two parallel furrows with the heels at their head, going back the way it came

Read left to right, that is a sentence anybody can read without being told: he walked up,
he stood there, he ran for it, he went down, and he was pulled back.

ANALOG HORROR LINE (rule 20 section 9): the horror is that the person is not in the frame.
Every mark here is a still fact left behind on empty ground, lit by the same sun as the
kerb beside it, and the picture is finished by the viewer working out what happened. R1
THE ORDINARY FRAME, ONE WRONG THING; R3 THE LONG HOLD; R4 THE LIGHT WAS IN THE ROOM.

REFERENCE CHECK (the 9/4 standing law):
  TRK-01 THE TRACKWAY'S FOUR MEASUREMENTS. Taken structurally, in the boot's own length so
         the proportions are real whatever the pixel size is: a walking step is 2.6 boot
         lengths (0.70 m against a 0.27 m boot), the walking base is 0.4 of a boot length
         (0.10 m, inside the measured 8-12 cm adult range), and the foot points along the
         line of travel with about 10 degrees of toe-out. Round 1's stride of 52 px and
         straddle of 8 px already sit exactly on those ratios, so the numbers did not move;
         the ANGLE is what was missing and is added here.
  TRK-02 WALKING AGAINST RUNNING. Taken whole and it is the counter-intuitive half: a run
         is drawn by TAKING THE HEEL AWAY and pressing the ball in, so a running print is
         SHORTER than a walking one while the gap between prints roughly doubles. Every
         earlier instinct here was to stretch the same sole, which is what the source says
         is wrong.
  TRK-03 TRAIL WIDTH. The two lines of feet CLOSE UP as the pace rises until a runner's
         prints land on one line -- so the reader sees the pace change in the pattern
         before looking at any single print. That is why the run segment drops the straddle
         to near zero instead of only lengthening the gap.
  TRK-04 THE MARKS THAT ARE NOT PRINTS. The drag furrows, the pivot crescent and the
         backward throw behind a push-off are the three continuous marks; they carry the
         EVENT where the prints only carry the person.
  AH-01  THE ANALOG HORROR BIBLE, as above.
  TG-03  THE YARD TILE and TG-04 THE STREET TILE: the families and their ramps, unchanged.
  REUSE CHECK: this tool IMPORTS round 1's cook rather than copying it -- the loader, the
  family ramps, the boot mask and the press with its derived sun-side rim are all round 1's
  and none is re-typed here. The ground under every picture is the city's own shipped
  street, side, yard and dirt. Nothing new is drawn except four masks derived from the
  boot round 1 already cooked.

  python3 tools/bohemia_the_ground_tells_you_what_happened_cook_9_23_26.py
    -> banks/BOHEMIA_THE_MARKS_ON_THE_GROUND_9_23_26.txt
    -> slices/vote/COOK_THE_GROUND_TELLS_YOU.png
"""
import json
import math
import os
import sys

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
sys.path.insert(0, os.path.join(REPO, 'tools'))

# REUSE-FIRST: round 1 is a module, not a pile of lines to copy.
import bohemia_footsteps_that_lead_you_cook_9_22_26 as R1

OUT_BANK = 'banks/BOHEMIA_THE_MARKS_ON_THE_GROUND_9_23_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_GROUND_TELLS_YOU.png'

BW, BH = R1.BOOT_W, R1.BOOT_H          # 9 x 20, round 1's boot

# THE PROPORTIONS, IN BOOT LENGTHS (TRK-01/02/03). A real boot is 0.27 m, so every ratio
# below is a real measurement divided by that and is true at any pixel size.
STEP_WALK   = 2.6      # 0.70 m step, heel to heel of opposite feet
STEP_RUN    = 5.2      # the gap roughly doubles as the pace rises
BASE_WALK   = 0.40     # 0.10 m walking base, inside the measured 8-12 cm adult range
BASE_RUN    = 0.07     # the two lines close to one
TOEOUT_WALK = 10.0     # degrees off the line of travel, toe outward
TOEOUT_RUN  = 2.0      # a runner's foot straightens up

def die(m): sys.exit('REFUSED: ' + m)


def how_much_it_moved(before, after):
    """THE NUMBER THAT IS ALLOWED TO BE QUOTED. "pixels pressed" is not it: round 1 quoted
    1,060 of them on prints that were invisible, and the fight-floor card he voted DOWN
    quoted 9,635 colours going to 57 on a change he could not see. Both were true and
    neither was the question. The question is HOW FAR THE GROUND MOVED WHERE THE MARK IS --
    mean luminance change over the pixels that changed at all, against the spread the ground
    already has. Under about 12 the mark is inside the ground's own noise and will not read,
    whatever the pixel count says."""
    b, a = list(before.getdata()), list(after.getdata())
    lum = R1.LUM
    d = [abs(lum(y[:3]) - lum(x[:3])) for x, y in zip(b, a) if x[:3] != y[:3]]
    if not d: return 0.0, 0, 0.0
    lb = sorted(lum(x[:3]) for x in b)
    noise = lb[int(len(lb) * 0.84)] - lb[int(len(lb) * 0.16)]     # the ground's own spread
    return sum(d) / len(d), len(d), noise


def rot_mask(rows, deg):
    """Turn a mask grid by deg (clockwise on screen), staying on the pixel grid."""
    h, w = len(rows), len(rows[0])
    im = Image.new('L', (w, h), 0)
    im.putdata([255 if c != '.' else 0 for r in rows for c in r])
    # PIL turns counter-clockwise in maths axes; screen y points down, so negate.
    im = im.rotate(-deg, resample=Image.NEAREST, expand=True)
    px = im.load()
    return [''.join('3' if px[x, y] else '.' for x in range(im.size[0]))
            for y in range(im.size[1])]


def trim(rows):
    """Drop empty border rows and columns so a mask centres on its own ink."""
    keep_y = [y for y, r in enumerate(rows) if '3' in r]
    if not keep_y: die('an empty mask reached trim()')
    keep_x = [x for x in range(len(rows[0])) if any(r[x] != '.' for r in rows)]
    return [''.join(rows[y][x] for x in keep_x) for y in keep_y]


# ---------------------------------------------------------------- the five marks
# All four new masks are CUTS of round 1's boot, never a second drawing of a foot. That is
# the honest way to build them and it is also how the real thing works: a running print is
# the same sole with only its front in the ground.
def mask_walk(right):
    return R1.boot_mask(right=right)

def mask_run(right):
    """TRK-02: the heel never registers. The ball and toe only -- the front half."""
    return [list(r) for r in R1.boot_mask(right=right)[:9]]

def mask_heel(right):
    """The back of the sole, which is what a dragged body and a backward step leave."""
    return [list(r) for r in R1.boot_mask(right=right)[13:]]


def put(px, W, H, cx, cy, rows, ramp, age, deg=0.0):
    """Press a mark centred on cx,cy, pointing along deg. Returns pixels pressed."""
    rows = [''.join(r) for r in rows]
    if deg: rows = trim(rot_mask(rows, deg))
    h, w = len(rows), len(rows[0])
    return R1.stamp(px, W, H, int(round(cx - w / 2.0)), int(round(cy - h / 2.0)),
                    [list(r) for r in rows], ramp, age)


def throw_back(px, W, H, cx, cy, deg, ramp, age, boot):
    """TRK-04: a hard push-off throws material BACKWARD behind the print.
       Not a drawing -- a short deterministic spray down the reverse heading."""
    #  A THROWN CLOD IS A HEAP, NOT A HOLLOW, and the press already knows the difference:
    #  a small blob is nearly all "open ground to the north or west", so it takes the sunlit
    #  tone. That is right here and wrong for a groove -- see furrow() below.
    laid = 0
    a = math.radians(deg + 90)                  # behind the toe is back down the heading
    for i in range(1, 7):
        d = boot * (0.55 + 0.17 * i)
        for side in (-1, 1):
            x = cx + math.cos(a) * d + math.cos(a + math.pi / 2) * side * (0.06 * boot * i)
            y = cy + math.sin(a) * d + math.sin(a + math.pi / 2) * side * (0.06 * boot * i)
            laid += R1.stamp(px, W, H, int(x), int(y), [['3', '3'], ['3', '.']], ramp,
                             age * (1.0 - i / 7.5))
    return laid


def furrow(px, W, H, p0, p1, ramp, age, wide):
    """TRK-04: a drag leaves a CONTINUOUS mark, not a line of prints.

    AND IT HAS TO BE ONE MASK, NOT A LINE OF ONE-PIXEL PRESSES. The press decides light
    from shape: a pixel with open ground to its north or west is the sunlit lip. A ONE-PIXEL
    MASK IS ALL LIP, so pressing a furrow dot by dot drew the whole furrow in the ground's
    BRIGHTEST tone -- a raised thread instead of a scored groove, the exact opposite of the
    mark. Built as one mask, the groove gets a bright north-west lip and a dark body, which
    is what a groove looks like."""
    x0, y0 = int(min(p0[0], p1[0])) - 2, int(min(p0[1], p1[1])) - 2
    x1, y1 = int(max(p0[0], p1[0])) + 3, int(max(p0[1], p1[1])) + 3 + wide
    gw, gh = x1 - x0, y1 - y0
    if gw < 1 or gh < 1: return 0
    g = [['.'] * gw for _ in range(gh)]
    n = int(max(abs(p1[0] - p0[0]), abs(p1[1] - p0[1]))) + 1
    for i in range(n):
        t = i / float(n - 1) if n > 1 else 0
        cx = p0[0] + (p1[0] - p0[0]) * t - x0
        cy = p0[1] + (p1[1] - p0[1]) * t - y0
        for k in range(wide):
            ix, iy = int(cx), int(cy) + k
            if 0 <= iy < gh and 0 <= ix < gw: g[iy][ix] = '3'
    return R1.stamp(px, W, H, x0, y0, g, ramp, age)


# ---------------------------------------------------------------- the sentence
def tell_the_story(px, W, H, ramp, boot, report):
    """One trail, read left to right: walked in, stood, ran, went down, dragged back.
       Returns the marks laid, in order, so the bank can record what the picture says."""
    said = []
    S_W, S_R = boot * STEP_WALK, boot * STEP_RUN
    off_w, off_r = boot * BASE_WALK / 2.0, boot * BASE_RUN / 2.0
    seen = []

    def note(cx, cy):
        seen.append((cx, cy))

    # 1. WALKED IN -- from the bottom left, feet on two lines, toes out. FIVE prints, which
    #    is the fewest a gait can be read from: two on each line plus the one that starts it.
    x, y, ang = boot * 1.2, H * 0.90, math.radians(-12)
    side, laid, n = 0, 0, 0
    anchors, seg = {}, []
    for i in range(5):
        deg = math.degrees(ang) + (TOEOUT_WALK if side else -TOEOUT_WALK)
        ox = x + math.cos(ang + math.pi / 2) * (off_w if side else -off_w)
        oy = y + math.sin(ang + math.pi / 2) * (off_w if side else -off_w)
        laid += put(px, W, H, ox, oy, mask_walk(bool(side)), ramp, 0.88, deg)
        note(ox, oy); seg.append((ox, oy))
        n += 1; side ^= 1
        x += math.cos(ang) * S_W; y += math.sin(ang) * S_W
    said.append(('WALKED', n, laid))
    anchors['HE WALKED IN'] = list(seg)

    # 2. STOOD -- the pair, deeper than a step, and one of them twisted from shifting.
    laid = 0
    for k, s in enumerate((0, 1)):
        ox = x + math.cos(ang + math.pi / 2) * (off_w * 1.3 if s else -off_w * 1.3)
        oy = y + math.sin(ang + math.pi / 2) * (off_w * 1.3 if s else -off_w * 1.3)
        laid += put(px, W, H, ox, oy, mask_walk(bool(s)), ramp, 0.98,
                    math.degrees(ang) + (TOEOUT_WALK + 9 * k if s else -TOEOUT_WALK))
        note(ox, oy)
    said.append(('STOOD', 2, laid))
    anchors['HE STOOD HERE'] = [(x, y)]

    # 3. RAN -- the heel is gone, the gap doubles, the two lines close to one, and every
    #    push-off throws ground backward. He breaks away up the field, because he is going.
    laid, n = 0, 0
    seg = []
    ang = math.radians(-32)
    x += math.cos(ang) * S_W * 0.7; y += math.sin(ang) * S_W * 0.7
    for i in range(4):
        deg = math.degrees(ang) + (TOEOUT_RUN if side else -TOEOUT_RUN)
        ox = x + math.cos(ang + math.pi / 2) * (off_r if side else -off_r)
        oy = y + math.sin(ang + math.pi / 2) * (off_r if side else -off_r)
        laid += put(px, W, H, ox, oy, mask_run(bool(side)), ramp, 1.0, deg)
        laid += throw_back(px, W, H, ox, oy, deg, ramp, 0.85, boot)
        note(ox, oy); seg.append((ox, oy))
        n += 1; side ^= 1
        x += math.cos(ang) * S_R; y += math.sin(ang) * S_R
    # He goes down HALF A STEP past the last print he managed to plant, not a whole one:
    # the loop leaves x,y a full stride ahead, which is a step he never finished.
    x -= math.cos(ang) * S_R * 0.5; y -= math.sin(ang) * S_R * 0.5
    said.append(('RAN', n, laid))
    anchors['HE RAN'] = list(seg)

    # 4. WENT DOWN -- the sole turns in place. Not a new shape: the same boot pressed
    #    through the angles it passes through, which is how a real crescent forms.
    laid = 0
    for k in range(7):
        laid += put(px, W, H, x, y, mask_walk(bool(side)), ramp, 0.74,
                    math.degrees(ang) + 12 * k)
    note(x, y)
    said.append(('WENT DOWN', 1, laid))

    # 5. DRAGGED -- back down the field on a new line. Two furrows, a heel at each head.
    dang = ang + math.pi + math.radians(7)
    ex, ey = x + math.cos(dang) * boot * 7, y + math.sin(dang) * boot * 7
    laid = 0
    for s in (-1, 1):
        p0 = (x + math.cos(dang + math.pi / 2) * s * boot * 0.40,
              y + math.sin(dang + math.pi / 2) * s * boot * 0.40)
        p1 = (ex + math.cos(dang + math.pi / 2) * s * boot * 0.40,
              ey + math.sin(dang + math.pi / 2) * s * boot * 0.40)
        laid += furrow(px, W, H, p0, p1, ramp, 0.90, 6)
        laid += put(px, W, H, p0[0], p0[1], mask_heel(s > 0), ramp, 1.0,
                    math.degrees(dang))
        note(ex, ey)
    said.append(('DRAGGED', 2, laid))
    anchors['HE WENT DOWN AND WAS PULLED BACK'] = [(x, y), (ex, ey)]

    # THE FIELD HAS TO HOLD THE WHOLE SENTENCE. The first build of this ran the story
    # straight off the right edge and the pivot landed outside the picture entirely, which
    # the press reported as zero pixels -- a mark that is merely off-canvas reads exactly
    # like a mark that does not work. Fail on the geometry instead, with the numbers.
    m = boot
    bad = [(round(a), round(b)) for a, b in seen
           if a < m or b < m or a > W - m or b > H - m]
    if bad:
        die('the story ran off a %dx%d field at %s -- the field must hold the sentence'
            % (W, H, bad[:3]))
    report.extend(said)
    return said, anchors


# ---------------------------------------------------------------- the card
def label(d, x, y, text, col=(232, 226, 214)):
    d.text((x, y), text, fill=col)


def main():
    T, SA, RAMPS = R1.load()
    ramps = {f: R1.hexramp(RAMPS[f]) for f in ('asphalt', 'concrete', 'ground')}


    dust = [R1.img(T[k]['b64']) for k in ('yard_0', 'yard_1', 'yard_2', 'dirt')]
    walk = [R1.img(b) for b in SA['side'][:4]]
    road = [R1.img(b) for b in SA['street'][:4]]
    TW = dust[0].size[0]
    if road[0].size[0] != TW: die('the road and the dust are not the same tile size')

    def field(tiles, w_tiles, h_tiles, plain=False):
        """THE DOMINANCE LAW (Paolo 7/14, in the street bank's own words: dominant 0.85,
           accents in clusters, "per-cell random shuffle" BANNED, because "too much
           diversity with the desert tiles"). The first build of this card cycled four
           tiles with (tx + ty*3) and produced a CHECKERBOARD -- which is the banned
           shuffle, and it also buried the marks in ground noise, so the law and the
           legibility want the same thing."""
        im = Image.new('RGBA', (TW * w_tiles, TW * h_tiles))
        for ty in range(h_tiles):
            for tx in range(w_tiles):
                rx, ry = tx // 2, ty // 2          # ONE TILE PER REGION, the law's words
                h = ((rx * 73856093) ^ (ry * 19349663)) & 0xffff
                t = tiles[0] if (plain or (h % 100) >= 22) \
                    else tiles[1 + (h // 100) % (len(tiles) - 1)]
                im.paste(t, (tx * TW, ty * TW))
        return im

    # ---- 1 AND 2. THE SENTENCE, IN FOUR WINDOWS ON THE ONE TRAIL.
    #  THE THIRD LAYOUT, AND THE FIRST TWO ARE WHY. Laid across the whole field at once the
    #  picture was 80% empty ground with specks in it, because a real trackway IS long: five
    #  walking steps alone are thirteen boot lengths. Showing it whole means showing it
    #  small, and small is what he voted down. So the card does what a person does at the
    #  scene: it walks the trail and stops at each thing, four tight windows on ONE trail,
    #  read left to right and top to bottom.
    #  THE CARD'S GROUND IS ONE TILE REPEATED, on purpose: the mark is the subject, and a
    #  mixed ground underneath it is a second variable in a picture asking one question. The
    #  mixed ground is where the numbers below are measured, which is the harder test.
    MAG = 3
    # A WINDOW IS SIZED TO WHAT IT HAS TO HOLD. Four tiles square holds three walking
    # prints, because a walking step is 2.6 boot lengths. A RUNNING step is twice that, so
    # the same square held one and a half prints and the panel came back empty -- the whole
    # point of the run is the GAP, and a window too small to show the gap shows nothing.
    WINDOWS = ['HE WALKED IN', 'HE STOOD HERE', 'HE RAN',
               'HE WENT DOWN AND WAS PULLED BACK']
    panels, report, rep2, contrast = {}, [], [], {}
    for name, tiles, fam, rep in (('DUST', dust, 'ground', report),
                                  ('THE SIDEWALK YOU FIGHT ON', walk, 'concrete', rep2)):
        plain = field(tiles, 15, 8, plain=True)
        _, anchors = tell_the_story(plain.load(), plain.size[0], plain.size[1],
                                    ramps[fam], BH, rep)
        cuts = []
        for title in WINDOWS:
            pts = anchors[title]
            m = BH * 1.3
            bx0 = min(a for a, _ in pts) - m; bx1 = max(a for a, _ in pts) + m
            by0 = min(b for _, b in pts) - m; by1 = max(b for _, b in pts) + m
            # whole tiles, and never smaller than four, so every window is a real piece of
            # ground rather than a crop tight enough to hide how far apart the marks are
            wt = max(4, int(math.ceil((bx1 - bx0) / TW)))
            ht = max(4, int(math.ceil((by1 - by0) / TW)))
            w, h = TW * wt, TW * ht
            cx, cy = (bx0 + bx1) / 2.0, (by0 + by1) / 2.0
            x0 = max(0, min(plain.size[0] - w, int(cx - w / 2)))
            y0 = max(0, min(plain.size[1] - h, int(cy - h / 2)))
            cuts.append((title, plain.crop((x0, y0, x0 + w, y0 + h))))
        panels[name] = cuts
        # the honest number is taken on the REAL mixed ground, not on the card's clean one
        mixed = field(tiles, 15, 8)
        before = mixed.copy()
        tell_the_story(mixed.load(), mixed.size[0], mixed.size[1], ramps[fam], BH, [])
        contrast['ON ' + name] = how_much_it_moved(before, mixed)

    # ---- 3. THE FIVE MARKS AT SIX TIMES, so the drawing itself can be judged
    MARKS = [
        ('WALKED',    mask_walk(False), 0.88, TOEOUT_WALK),
        ('STOOD',     mask_walk(True),  0.98, -TOEOUT_WALK),
        ('RAN',       mask_run(False),  1.00, TOEOUT_RUN),
        ('WENT DOWN', None,             0.74, 0),
        ('DRAGGED',   mask_heel(False), 1.00, 0),
    ]
    CELL, LMAG = BH + 10, 6
    legend = Image.new('RGBA', (CELL * len(MARKS), CELL))
    for i, (_, m, age, deg) in enumerate(MARKS):
        c = Image.new('RGBA', (CELL, CELL))
        c.paste(dust[0].crop((0, 0, CELL, CELL)), (0, 0))
        p = c.load()
        if m is None:                         # the pivot is the boot through its angles
            for k in range(7):
                put(p, CELL, CELL, CELL / 2, CELL / 2, mask_walk(False),
                    ramps['ground'], age, 12 * k)
        else:
            put(p, CELL, CELL, CELL / 2, CELL / 2, m, ramps['ground'], age, deg)
        legend.paste(c, (i * CELL, 0))
    legend = legend.resize((legend.size[0] * LMAG, legend.size[1] * LMAG), Image.NEAREST)

    # ---- 4. assemble
    #  THE CANVAS IS MEASURED, NOT CALCULATED. An earlier pass worked the card's height out
    #  from the panel sizes by hand, got the wide panels wrong by a factor of two and drew
    #  them on top of each other. Draw onto a tall sheet and cut it where the drawing ends.
    PAD, GAP = 20, 14
    big = lambda im, m: im.resize((im.size[0] * m, im.size[1] * m), Image.NEAREST)
    dust_cuts = [(t, big(im, MAG)) for t, im in panels['DUST']]
    side_cuts = panels['THE SIDEWALK YOU FIGHT ON']
    rows, i = [], 0
    widest = max(im.size[0] for _, im in dust_cuts)
    while i < len(dust_cuts):
        # two small windows share a line; a wide one takes its own
        if (i + 1 < len(dust_cuts)
                and dust_cuts[i][1].size[0] + dust_cuts[i + 1][1].size[0] + GAP <= widest):
            rows.append([dust_cuts[i], dust_cuts[i + 1]]); i += 2
        else:
            rows.append([dust_cuts[i]]); i += 1
    CW = max(widest, legend.size[0]) + PAD * 2
    sm = (CW - PAD * 2 - GAP * (len(side_cuts) - 1)) // len(side_cuts)
    card = Image.new('RGBA', (CW, 8000), (17, 16, 15, 255))
    d = ImageDraw.Draw(card)
    y = PAD
    label(d, PAD, y, 'THE FIVE MARKS, BLOWN UP')
    y += 18
    card.paste(legend, (PAD, y)); y += legend.size[1] + 2
    for i, (name, _, _, _) in enumerate(MARKS):
        label(d, PAD + i * CELL * LMAG + 3, y, name, (150, 142, 130))
    y += 18 + GAP
    label(d, PAD, y, 'ONE TRAIL IN THE DUST, FOUR PLACES ALONG IT, ALL AT THE SAME SIZE')
    y += 18
    for row in rows:
        x = PAD
        for title, im in row:
            label(d, x, y, title, (150, 142, 130))
            card.paste(im, (x, y + 14))
            x += im.size[0] + GAP
        y += 14 + max(im.size[1] for _, im in row) + GAP
    label(d, PAD, y, 'THE SAME FOUR, ON THE SIDEWALK YOU FIGHT ON')
    y += 18
    tall = 0
    for i, (title, im) in enumerate(side_cuts):
        h = int(im.size[1] * (sm / float(im.size[0])))
        card.paste(im.resize((sm, h), Image.NEAREST), (PAD + i * (sm + GAP), y))
        tall = max(tall, h)
    y += tall
    card = card.crop((0, 0, CW, y + PAD))
    os.makedirs(os.path.dirname(OUT_CARD), exist_ok=True)
    card.convert('RGB').save(OUT_CARD)

    # ---------------------------------------------------------------- the guards
    pad = lambda s, n: (s + ' ' * n)[:n]
    print('FIVE MARKS, ALL FIVE CUT FROM THE ONE BOOT ROUND 1 COOKED (%d x %d px).'
          % (BW, BH))
    print()
    print(pad('mark', 12) + pad('on dust', 22) + 'on the sidewalk')
    for (n1, c1, l1), (n2, c2, l2) in zip(report, rep2):
        if n1 != n2: die('the two grounds told different stories: %s / %s' % (n1, n2))
        print(pad(n1, 12) + pad('%d marks, %d px' % (c1, l1), 22)
              + '%d marks, %d px' % (c2, l2))
        if l1 < 20 or l2 < 20:
            die('%s pressed almost nothing (%d / %d px) -- the mark is not landing'
                % (n1, l1, l2))

    # EVERY COLOUR IS ALREADY IN THE GROUND, exactly as round 1 proved for the boot. If a
    # mark ever invents one, ONE PALETTE PER FAMILY is broken and the mark is a sticker.
    for name, tiles, fam in (('dust', dust, 'ground'), ('sidewalk', walk, 'concrete')):
        fld = field(tiles, 15, 8)
        tell_the_story(fld.load(), fld.size[0], fld.size[1], ramps[fam], BH, [])
        seen = set()
        for t in tiles: seen |= set(p[:3] for p in t.getdata() if p[3] > 8)
        new = set(p[:3] for p in fld.getdata() if p[3] > 8) - seen - set(ramps[fam])
        if new:
            die('%s: the marks invented %d colours: %s' % (name, len(new), sorted(new)[:4]))
    print()
    print('NO MARK INVENTED A COLOUR on either ground.')

    # DOES IT ACTUALLY READ? The asphalt is measured too even though it is not on the card,
    # because the honest answer about the road belongs on the record whether or not it is
    # the picture he is shown.
    rd = field(road, 15, 8); rd_before = rd.copy()
    tell_the_story(rd.load(), rd.size[0], rd.size[1], ramps['asphalt'], BH, [])
    contrast['ON THE ROAD (not on the card)'] = how_much_it_moved(rd_before, rd)
    print()
    print(pad('ground', 32) + pad('the mark moves it by', 22) + "the ground's own spread")
    for k, (mv, n, noise) in contrast.items():
        print(pad(k, 32) + pad('%.1f of 255' % mv, 22) + '%.1f' % noise)
    for k, (mv, n, noise) in contrast.items():
        if 'not on the card' in k: continue
        if mv < 12:
            die('%s: the mark moves the ground only %.1f, inside its own noise -- it will '
                'not read, whatever the pixel count says' % (k, mv))

    # THE POINT OF THE ROUND: the marks must DISAGREE, or the trail says nothing.
    runs = [l for n, c, l in report if n == 'RAN'][0]
    walks = [l for n, c, l in report if n == 'WALKED'][0]
    per_run, per_walk = runs / 4.0, walks / 5.0
    print()
    print('A RUNNING MARK IS %.0f%% THE SIZE OF A WALKING ONE (%d px against %d), which is '
          'TRK-02: the heel never lands.' % (100.0 * per_run / per_walk, per_run, per_walk))
    if per_run >= per_walk:
        die('the running mark is not smaller than the walking one -- TRK-02 says it must be')

    doc = {
        'version': 'BOHEMIA_THE_MARKS_ON_THE_GROUND_v1', 'built': '2026-09-23',
        'lane': 'COOK [footprints] round 2',
        'his_words': 'make pixel art of footsteps that lead you to the conclusion',
        'round_1': 'banks/BOHEMIA_THE_FOOTSTEPS_9_22_26.txt cooked the boot and the press. '
                   'This cooks the other four marks and the picture that uses all five.',
        'the_defect_round_1_had': 'round 1 stamped every print pointing north on a trail '
                                  'that turns 230 degrees, so its boots end up walking '
                                  'backwards. A print now points along the line of travel '
                                  'with a real toe-out angle (TRK-01).',
        'marks': {
            'WALKED': 'the full sole, feet on two lines %.2f of a boot apart, toes out %.0f '
                      'degrees, a step of %.1f boot lengths' % (BASE_WALK, TOEOUT_WALK,
                                                                STEP_WALK),
            'STOOD': 'the pair, side by side, pressed near full depth, one twisted',
            'RAN': 'the front of the sole only -- the heel never lands -- the step at %.1f '
                   'boot lengths, the two lines closed to %.2f, and ground thrown backward '
                   'behind each push-off' % (STEP_RUN, BASE_RUN),
            'WENT DOWN': 'the same boot pressed through the angles a pivot passes through, '
                         'which is how a crescent really forms',
            'DRAGGED': 'two continuous furrows with a heel mark at the head of each',
        },
        'proportions_are_real': 'every number is in BOOT LENGTHS, from a 0.27 m boot, so it '
                                'stays true at any pixel size: a 0.70 m step is 2.6, a '
                                '0.10 m walking base is 0.40 (the measured 8-12 cm adult '
                                'range), and round 1\'s 52 px stride and 8 px straddle '
                                'already sat on those ratios.',
        'draw_rule': 'unchanged from round 1: a mark is a DEPRESSION, not a stain. The sole '
                     'steps down the family ramp and the sun-side lip steps up, the sun '
                     'being north-west as it is on every other tile in this game. So a mark '
                     'borrows the ground\'s own colours and adds none.',
        'reads_on': {n: {'marks': c, 'pixels': l} for n, c, l in report},
        'not_shipped': 'rule 18: this is a bank and a VOTE candidate. It goes on the ground '
                       'the round the hold allows.',
    }
    with open(OUT_BANK, 'w') as f: json.dump(doc, f, indent=1)
    if not json.load(open(OUT_BANK)).get('marks'): die('read-back failed')
    print()
    print('wrote %s  (%.0f KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) / 1024))
    print('wrote %s  (%.0f KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) / 1024))


if __name__ == '__main__':
    main()
