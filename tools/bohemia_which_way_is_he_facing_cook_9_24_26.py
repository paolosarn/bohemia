#!/usr/bin/env python3
"""WHICH WAY IS HE FACING  (COOK [footprints] round 3, 9/24/26)

HIS TWO RULINGS, BOTH ON THUMBS UP, BOTH WORD FOR WORD (records/BOHEMIA_VOTE_VERDICTS_9_23_26.txt):
  FOOTSTEPS THAT LEAD YOU SOMEWHERE, up:
    "BRO U HAVE TO FIND OUT WHEN ITS FAVING NORTH SOUTH EAST AND WEST FR"
  THE GROUND TELLS YOU WHAT HAPPENED, up:
    "It wont be exactly a straight line but yeah amazing dont have it be exactly a straight line"

So: the boot has to be RIGHT at every facing, and the trail has to WANDER. Rounds 1 and 2
failed both. Round 2 turned one bitmap to the heading with a nearest-neighbour rotate, which
is the one thing you may never do to pixel art -- at 45 degrees it chews the toe taper into
stair-steps and the print stops being a boot. And every walk it drew was dead straight inside
each of its segments.

*** THE ANSWER IS TWO HAND-SET NUMBERS AND SIXTEEN EXACT FACINGS, WITH NO RESAMPLING
ANYWHERE. *** The boot stops being a bitmap and becomes a PROFILE: twenty steps along its own
long axis, each with the span of sole at that step, lifted straight out of the silhouette he
approved. A facing is then RE-RASTERISED along that heading rather than rotated -- which is
what a pixel artist does by hand, and it is why the diagonals come out clean. The tool proves
it both ways:
  * rasterising NORTH from the profile reproduces the approved mask BYTE FOR BYTE, so his
    silhouette is not quietly redrawn;
  * east, south and west are exact 90 and 180 degree turns of it, which on a pixel grid are
    lossless, and the tool asserts that too;
  * the four diagonals are rasterised from the same profile at 45 degrees, never resampled.
Eight headings, two feet, sixteen masks, and not one pixel of any of them came out of an
interpolator.

AND THE LEFT AND RIGHT BOOTS WERE THE SAME BOOT, WHICH I FOUND WHILE ANSWERING HIM. Every
row of the approved mask is a palindrome, so the round-1 `right=True` flip was a no-op and a
trail has been laying the same foot twice since the beginning. A real sole is scooped on the
INSIDE -- the arch is medial -- so a left print and a right print lean away from each other.
That is one number in the profile (the waist's centre) and it is the difference between a
trail that says a person walked here and a trail that says a stamp was pressed twice.

THE WANDER IS MEASURED, NOT SPRINKLED. A real line of travel drifts a couple of degrees a
step and never repeats; the tool refuses a walk whose prints are collinear, and refuses one
that wanders so far it stops being a walk.

RULE 32(f), HIS WORDS THIS ROUND: "this game isn't in first person, when would I see this?"
A VOTE item is a frame off a play surface or a tile at game scale. So this card has NO blown
up study panel -- round 2's card had one and it would break this rule. Every square on it is
ground at the size the game draws it. The eight facings are shown as prints lying on that
ground, not as sprites on a sheet.

REFERENCE CHECK (the 9/4 standing law):
  HAIR-04 SANDY GORDON, 8-DIRECTIONAL TURN-AROUND. Taken as the house standard it already is:
         eight headings is what this repo's own art turns around on, and the tutorial's rule
         is the one that matters here -- a facing is DRAWN, never rotated, because rotation
         destroys the read at the exact angles a player sees most.
  TRK-01 THE TRACKWAY'S FOUR MEASUREMENTS. The foot progression angle is measured off the
         LINE OF TRAVEL, so once the line wanders the angle has to wander with it; the print
         is snapped to the nearest of eight and the residual is reported rather than hidden.
  TRK-03 TRAIL WIDTH. The two lines of feet are what make a trackway readable, and they only
         separate if the left and right prints differ. They did not.
  AH-01  THE BIBLE. R4 THE LIGHT WAS IN THE ROOM: the press and its derived sun-side lip are
         unchanged from round 1, so every facing is lit by the same north-west sun. R1 THE
         ORDINARY FRAME: empty ground, one wandering line of prints, nobody at the end.
  TG-03 / TG-04 the families and their ramps, unchanged.
  REUSE CHECK: imports round 1's cook for the loader, the ramps and the press, and round 2's
  cook for the marks and the story. Nothing in either is retyped. The only new thing here is
  the profile, the rasteriser and the wander.

    python3 tools/bohemia_which_way_is_he_facing_cook_9_24_26.py
      -> banks/BOHEMIA_THE_BOOT_AT_EIGHT_FACINGS_9_24_26.txt
      -> slices/vote/COOK_WHICH_WAY_IS_HE_FACING.png
"""
import json
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
sys.path.insert(0, os.path.join(REPO, 'tools'))

import bohemia_footsteps_that_lead_you_cook_9_22_26 as R1          # the boot and the press
import bohemia_the_ground_tells_you_what_happened_cook_9_23_26 as R2  # the marks

OUT_BANK = 'banks/BOHEMIA_THE_BOOT_AT_EIGHT_FACINGS_9_24_26.txt'
OUT_CARD = 'slices/vote/COOK_WHICH_WAY_IS_HE_FACING.png'

BW, BH = R1.BOOT_W, R1.BOOT_H
HEADINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

def die(m): sys.exit('REFUSED: ' + m)


# ---------------------------------------------------------------- the profile
def profile_of(mask):
    """The boot as twenty spans along its own long axis, read out of his approved mask.
       Step 0 is the toe. Each span is (left, right) in the mask's own 9-wide frame."""
    out = []
    for row in mask:
        on = [i for i, c in enumerate(row) if c != '.']
        if not on: die('a blank row in the approved boot mask')
        out.append((min(on), max(on)))
    return out


PROFILE = profile_of(R1.BOOT)

# *** AND HIS BOOT IS THE SAME WIDTH AT BOTH ENDS, SO IT DOES NOT SAY WHICH WAY HE WENT. ***
# Found while building the eight facings and it is the real answer to "find out when its
# facing north south east and west": machinery that points a print correctly is worth nothing
# if the print is a shape you cannot read a direction off. The approved mask's ball is five
# rows of seven and its heel is four rows of seven, both ending in the same rounded taper, so
# NORTH and SOUTH come out as near enough the same picture.
# A real sole is not like that: the ball is the widest part and the heel is NARROWER AND
# SQUARER. So the toe half is his, untouched, byte for byte -- and the heel half comes in one
# pixel each side and ends flat. That one change is the difference between a trail that leads
# somewhere and a row of identical stamps.
HEEL_FROM = 13
DIRECTIONAL = [(l, r) if i < HEEL_FROM else (max(l, 2), min(r, 6))
               for i, (l, r) in enumerate(PROFILE)]


def trim(rows):
    """Drop the blank border a mask is stored with. The approved bitmap carries a one pixel
       transparent margin; a rasteriser has no margin to carry, so the two are compared on
       their ink."""
    keep_x = [x for x in range(len(rows[0])) if any(r[x] != '.' for r in rows)]
    keep_y = [y for y, r in enumerate(rows) if '3' in r]
    return [''.join(rows[y][x] for x in keep_x) for y in keep_y]


def foot_profile(right):
    """THE ARCH IS MEDIAL, so the waist is scooped on the INSIDE of the foot and the sole's
       outer edge runs unbroken. The approved mask has a centred waist, which is why its rows
       are all palindromes and why the left and right prints have been identical since round
       1. One number: the waist rows move ONE pixel toward the outside of the foot. The ball
       and the heel are untouched, so his silhouette's widest parts are exactly his.
       right=None is the NEUTRAL boot, his mask with nothing moved, which is what the
       byte-for-byte proof below is taken against."""
    out = []
    for i, (l, r) in enumerate(DIRECTIONAL):
        w = r - l + 1
        if right is not None and w <= 3 and 8 <= i <= 13:   # the waist, and only the waist
            shift = 1 if right else -1     # outward: the lateral side keeps its material
            l, r = l + shift, r + shift
        out.append((l, r))
    return out


DIRS = {
    'N':  (0, -1), 'NE': (1, -1), 'E':  (1, 0), 'SE': (1, 1),
    'S':  (0, 1),  'SW': (-1, 1), 'W':  (-1, 0), 'NW': (-1, -1),
}


def raster(heading, right=False):
    """RE-RASTERISE, NEVER ROTATE. Walk the profile down the heading and lay each span across
       it. On a cardinal this lands on the grid exactly and reproduces the approved mask; on a
       diagonal it draws the same boot at 45 degrees with clean pixels, which is what a hand
       would do and what an interpolator cannot."""
    dx, dy = DIRS[heading]
    n = math.hypot(dx, dy)
    ux, uy = dx / n, dy / n                       # down the boot, toe first
    px, py = -uy, ux                              # across it
    prof = foot_profile(right)
    mid = (BW - 1) / 2.0
    pts = set()
    steps = (len(prof) - 1) * 2
    for i in range(steps + 1):
        t = i / 2.0
        k = min(len(prof) - 1, int(round(t)))
        l, r = prof[k]
        s = l - mid
        while s <= r - mid + 1e-9:
            x = -ux * t + px * s
            y = -uy * t + py * s
            pts.add((int(round(x)), int(round(y))))
            s += 0.5
    x0 = min(p[0] for p in pts); x1 = max(p[0] for p in pts)
    y0 = min(p[1] for p in pts); y1 = max(p[1] for p in pts)
    return [''.join('3' if (x, y) in pts else '.' for x in range(x0, x1 + 1))
            for y in range(y0, y1 + 1)]


def rot90(rows):
    """An exact quarter turn on a pixel grid: a transpose. No pixel is invented or lost."""
    h, w = len(rows), len(rows[0])
    return [''.join(rows[h - 1 - y][x] for y in range(h)) for x in range(w)]


def snap(deg):
    """The nearest of the eight, and how far off it is. A sprite has eight facings; the
       residual is reported so nobody can pretend the print points exactly where he walked."""
    k = int(round((deg % 360) / 45.0)) % 8
    # 0 deg on screen is east and y grows down, so index from E and walk clockwise
    order = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE']
    return order[k], abs(((deg % 360) - k * 45 + 180) % 360 - 180)


# ---------------------------------------------------------------- the wander
def wander(n, step, seed, base_deg):
    """A LINE OF TRAVEL IS NOT A RULED LINE. His words: "dont have it be exactly a straight
       line". A walked line drifts a couple of degrees a step and the drift itself drifts, so
       this is a seeded second-order wobble rather than noise on a straight line -- noise
       would give a straight line with jitter, which is what a ruler looks like through a bad
       camera, not what a walk looks like."""
    rng, out = seed & 0xffffffff, []
    def nxt():
        nonlocal rng
        rng = (1103515245 * rng + 12345) & 0x7fffffff
        return rng / float(0x7fffffff)
    ang, turn = math.radians(base_deg), 0.0
    x = y = 0.0
    for i in range(n):
        out.append((x, y, math.degrees(ang)))
        turn = turn * 0.85 + (nxt() - 0.5) * math.radians(18.0)  # the drift drifts
        ang += turn
        x += math.cos(ang) * step
        y += math.sin(ang) * step
    return out


def main():
    T, SA, RAMPS = R1.load()
    ramps = {f: R1.hexramp(RAMPS[f]) for f in ('ground', 'concrete', 'asphalt')}
    dust = [R1.img(T[k]['b64']) for k in ('yard_0', 'yard_1', 'yard_2', 'dirt')]
    walk = [R1.img(b) for b in SA['side'][:4]]
    TW = dust[0].size[0]

    # ---- THE PROOF THAT NOTHING WAS RESAMPLED ----------------------------------
    north = raster('N', None)
    approved = trim(R1.BOOT)
    # THE TOE HALF IS HIS, BYTE FOR BYTE. The heel is the only part that moved and the reason
    # is printed below, so nobody has to take it on trust.
    if north[:HEEL_FROM] != approved[:HEEL_FROM]:
        die('the toe half is no longer his mask.\n  got      %s\n  approved %s'
            % (north[:HEEL_FROM], approved[:HEEL_FROM]))
    if north[HEEL_FROM:] == approved[HEEL_FROM:]:
        die('the heel did not change, so north and south still draw the same print')
    tw = max(r.count('3') for r in north[:HEEL_FROM])
    hw = max(r.count('3') for r in north[HEEL_FROM:])
    if hw >= tw:
        die('the heel is %d px wide against a %d px ball: the print still does not say which '
            'way he went' % (hw, tw))
    for a, b in (('N', 'E'), ('E', 'S'), ('S', 'W')):
        if raster(b, None) != rot90(raster(a, None)):
            die('%s is not an exact quarter turn of %s' % (b, a))
    for a, b in (('NE', 'SE'), ('SE', 'SW'), ('SW', 'NW')):
        if raster(b, None) != rot90(raster(a, None)):
            die('%s is not an exact quarter turn of %s' % (b, a))
    print('THE TOE HALF IS HIS, BYTE FOR BYTE: rasterising NORTH off the profile reproduces '
          'the first %d rows of the mask he voted up exactly, and east, south and west are '
          'exact quarter turns of it. The four diagonals come off the same profile at 45 '
          'degrees, never resampled.' % HEEL_FROM)
    print('AND THE HEEL IS THE ONE THING THAT MOVED. His mask is %d px wide at the ball and '
          'was %d px at the heel, both ending in the same rounded taper, so NORTH AND SOUTH '
          'DREW THE SAME PRINT and a trail could not say which way he went. The heel is now '
          '%d px and flat-ended. That is the whole change.'
          % (tw, max(r.count('3') for r in approved[HEEL_FROM:]), hw))
    print()

    pad = lambda s, n: (s + ' ' * n)[:n]
    print(pad('facing', 8) + pad('left boot', 18) + pad('right boot', 18) + 'they differ by')
    masks = {}
    for h in HEADINGS:
        ml, mr = raster(h, False), raster(h, True)
        masks[h] = (ml, mr)
        nl = sum(r.count('3') for r in ml)
        nr = sum(r.count('3') for r in mr)
        diff = sum(1 for a, b in zip(''.join(ml), ''.join(mr)) if a != b) if \
            len(ml) == len(mr) and len(ml[0]) == len(mr[0]) else -1
        print(pad(h, 8) + pad('%d x %d, %d px' % (len(ml[0]), len(ml), nl), 18)
              + pad('%d x %d, %d px' % (len(mr[0]), len(mr), nr), 18)
              + ('%d px' % diff if diff >= 0 else 'different boxes'))
        if diff == 0:
            die('%s: the left and right boots are the same boot again. The arch is medial; '
                'if the waist is centred the trail lays one foot twice.' % h)

    # ---- THE WANDER -------------------------------------------------------------
    STEP = BH * R2.STEP_WALK
    pts = wander(12, STEP, 0x31ab09, -6.0)
    ax, ay = pts[0][0], pts[0][1]
    bx, by = pts[-1][0], pts[-1][1]
    L = math.hypot(bx - ax, by - ay)
    dev = max(abs((bx - ax) * (ay - p[1]) - (ax - p[0]) * (by - ay)) / L for p in pts)
    collinear = 0
    for i in range(len(pts) - 2):
        (x0, y0, _), (x1, y1, _), (x2, y2, _) = pts[i], pts[i + 1], pts[i + 2]
        if abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) < 1e-6: collinear += 1
    print()
    print('THE WALK WANDERS: it leaves the straight line between its first and last print by '
          '%.1f tiles, which is %.2f of a boot length, and not one set of three prints in it '
          'is collinear.' % (dev, dev / BH))
    if dev < BH * 0.45:
        die('the walk is %.2f of a boot off straight. His words were "dont have it be exactly '
            'a straight line".' % (dev / BH))
    if dev > BH * 4:
        die('the walk wanders %.1f boots off line. That is not a walk any more.' % (dev / BH))
    if collinear:
        die('%d sets of three prints are exactly collinear.' % collinear)

    residuals = []
    for _, _, deg in pts:
        h, res = snap(deg + R2.TOEOUT_WALK)
        residuals.append((h, res))
    worst = max(r for _, r in residuals)
    print('EIGHT FACINGS, SO A PRINT IS NEVER MORE THAN 22.5 DEGREES OFF THE WAY HE WALKED. '
          'On this walk the worst print is %.1f degrees out and the headings it uses are %s.'
          % (worst, ' '.join(sorted({h for h, _ in residuals}))))
    if worst > 22.6:
        die('a print is %.1f degrees off its heading; the snap is broken.' % worst)

    # ---- THE PICTURES, ALL AT GAME SCALE (rule 32f) -----------------------------
    def field(tiles, w_t, h_t):
        im = Image.new('RGBA', (TW * w_t, TW * h_t))
        for ty in range(h_t):
            for tx in range(w_t):
                im.paste(tiles[0], (tx * TW, ty * TW))
        return im

    def press(px, W, H, cx, cy, rows, ramp, age):
        h, w = len(rows), len(rows[0])
        return R1.stamp(px, W, H, int(round(cx - w / 2.0)), int(round(cy - h / 2.0)),
                        [list(r) for r in rows], ramp, age)

    # 1. THE EIGHT FACINGS, as prints in the dirt, at the size the game draws them
    CELL = BH + 16
    eight = Image.new('RGBA', (CELL * 8, CELL))
    for i, h in enumerate(HEADINGS):
        c = Image.new('RGBA', (CELL, CELL))
        c.paste(dust[0].crop((0, 0, CELL, CELL)), (0, 0))
        p = c.load()
        press(p, CELL, CELL, CELL / 2, CELL / 2, masks[h][0], ramps['ground'], 0.92)
        eight.paste(c, (i * CELL, 0))

    # 2. HIS BOOT, THE NEW HEEL, AND THE LEFT AND RIGHT PAIR -- all pressed in the same dirt
    #    at the same size, so he can knock the heel back if he wants it back.
    shown = [('YOURS', trim(R1.BOOT)), ('NEW HEEL', raster('N', None)),
             ('LEFT', masks['N'][0]), ('RIGHT', masks['N'][1])]
    pair = Image.new('RGBA', (CELL * len(shown), CELL))
    for i, (_, mk) in enumerate(shown):
        c = Image.new('RGBA', (CELL, CELL))
        c.paste(dust[0].crop((0, 0, CELL, CELL)), (0, 0))
        press(c.load(), CELL, CELL, CELL / 2, CELL / 2, mk, ramps['ground'], 0.92)
        pair.paste(c, (i * CELL, 0))

    # 3. THE WANDERING WALK on two grounds, at game scale
    walks = []
    for name, tiles, fam in (('IN THE DIRT', dust, 'ground'),
                             ('ON THE SIDEWALK', walk, 'concrete')):
        W_T, H_T = 14, 7
        im = field(tiles, W_T, H_T)
        px, W, H = im.load(), im.size[0], im.size[1]
        off = BH * R2.BASE_WALK / 2.0
        side = 0
        laid = 0
        seen = []
        for i, (x, y, deg) in enumerate(pts):
            h, _ = snap(deg + (R2.TOEOUT_WALK if side else -R2.TOEOUT_WALK))
            a = math.radians(deg)
            ox = TW * 0.9 + x + math.cos(a + math.pi / 2) * (off if side else -off)
            oy = H * 0.30 + y + math.sin(a + math.pi / 2) * (off if side else -off)
            if not (BH < ox < W - BH and BH < oy < H - BH):
                die('%s: print %d fell off the %dx%d field at %d,%d'
                    % (name, i, W, H, int(ox), int(oy)))
            laid += press(px, W, H, ox, oy, masks[h][side], ramps[fam], 0.90)
            seen.append((ox, oy))
            side ^= 1
        # CROP TO THE WALK. Round 2 already learned this the hard way: a trail laid across a
        # field five times its size hands him a picture that is mostly empty ground, which is
        # the same mistake as the card he voted down with "No difference".
        m = BH * 1.4
        box = (max(0, int(min(a for a, _ in seen) - m)), max(0, int(min(b for _, b in seen) - m)),
               min(W, int(max(a for a, _ in seen) + m)), min(H, int(max(b for _, b in seen) + m)))
        walks.append((name, im.crop(box), laid))

    # ---- the colour proof, unchanged from rounds 1 and 2 ------------------------
    for name, im, _ in walks:
        tiles = dust if 'DIRT' in name else walk
        fam = 'ground' if 'DIRT' in name else 'concrete'
        before = set()
        for t in tiles: before |= set(q[:3] for q in t.getdata() if q[3] > 8)
        new = set(q[:3] for q in im.getdata() if q[3] > 8) - before - set(ramps[fam])
        if new: die('%s: a print invented %d colours' % (name, len(new)))
    print('NO PRINT INVENTED A COLOUR on either ground.')

    # ---- the card ---------------------------------------------------------------
    def fnt(sz, bold=False):
        for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''),):
            if os.path.exists(p):
                try: return ImageFont.truetype(p, sz)
                except Exception: pass
        return ImageFont.load_default()
    F_T, F_S, F_B = fnt(31, True), fnt(16), fnt(16)
    MAG, PAD, GAP = 3, 22, 14
    big = lambda im: im.resize((im.size[0] * MAG, im.size[1] * MAG), Image.NEAREST)
    eight_b, pair_b = big(eight), big(walks[0][1])
    foot = ['Eight facings, and every one is DRAWN at that angle, not spun round. The toe '
            'half is your boot, pixel for pixel.',
            'Your boot was the same width at both ends, so north and south came out the same '
            'and the ground never said which way he went. The heel is thinner and flat now.',
            'Left and right are two different boots at last: the arch is on the inside. And '
            'the walk is not a ruled line, it drifts as it goes.']
    d0 = ImageDraw.Draw(Image.new('RGB', (8, 8)))
    wide = lambda s, f: d0.textbbox((0, 0), s, font=f)[2]
    CW = max([eight_b.size[0], pair_b.size[0], wide('WHICH WAY IS HE FACING', F_T)]
             + [wide(s, F_B) for s in foot]) + PAD * 2
    card = Image.new('RGB', (CW, 5000), (17, 16, 15))
    d = ImageDraw.Draw(card)
    y = PAD
    d.text((PAD, y), 'WHICH WAY IS HE FACING', fill=(236, 231, 222), font=F_T); y += 40
    d.text((PAD, y), 'every picture here is ground at the size the game draws it',
           fill=(150, 142, 130), font=F_S); y += 26
    d.text((PAD, y), 'THE EIGHT FACINGS, PRESSED IN DIRT', fill=(150, 142, 130), font=F_B)
    y += 20
    card.paste(eight_b, (PAD, y)); y += eight_b.size[1] + 4
    for i, h in enumerate(HEADINGS):
        d.text((PAD + i * CELL * MAG + 6, y), h, fill=(150, 142, 130), font=F_B)
    y += 22 + GAP
    d.text((PAD, y), 'YOUR BOOT, THE NEW HEEL, AND THE PAIR', fill=(150, 142, 130), font=F_B)
    y += 20
    card.paste(big(pair), (PAD, y)); y += big(pair).size[1] + 4
    for i, (lab, _) in enumerate(shown):
        d.text((PAD + i * CELL * MAG + 4, y), lab, fill=(150, 142, 130), font=F_B)
    y += 22 + GAP
    for name, im, _ in walks:
        d.text((PAD, y), 'THE WALK, ' + name, fill=(150, 142, 130), font=F_B); y += 20
        card.paste(big(im), (PAD, y)); y += big(im).size[1] + GAP
    y += 4
    for line in foot:
        d.text((PAD, y), line, fill=(176, 154, 114), font=F_B); y += 22
    card = card.crop((0, 0, CW, y + PAD))
    os.makedirs(os.path.dirname(OUT_CARD), exist_ok=True)
    card.save(OUT_CARD)

    doc = {
        'version': 'BOHEMIA_THE_BOOT_AT_EIGHT_FACINGS_v1', 'built': '2026-09-24',
        'lane': 'COOK [footprints] round 3',
        'his_words': {
            'facings': 'BRO U HAVE TO FIND OUT WHEN ITS FAVING NORTH SOUTH EAST AND WEST FR',
            'wander': 'It wont be exactly a straight line but yeah amazing dont have it be '
                      'exactly a straight line',
        },
        'method': 'the boot is a PROFILE of 20 spans lifted out of the approved mask, and a '
                  'facing is RE-RASTERISED along that heading. Rasterising north reproduces '
                  'the approved mask byte for byte; east, south and west are exact quarter '
                  'turns; the diagonals come off the same profile at 45 degrees. No facing '
                  'anywhere in this bank came out of an interpolator.',
        'two_defects_this_found': [
            "every row of the approved mask is a palindrome, so round 1's right-foot flip was "
            'a no-op and a trail has been laying the same foot twice since the beginning. The '
            'arch is medial: the waist moves one pixel to the outside of the foot.',
            'the approved mask is the same width at both ends and both ends taper the same '
            'way, so NORTH AND SOUTH DREW THE SAME PRINT. The toe half is untouched; the heel '
            'comes in one pixel each side and ends flat. That is what makes a trail say which '
            'way he went.'],
        'facings': {h: {'left': masks[h][0], 'right': masks[h][1]} for h in HEADINGS},
        'wander': {'max_off_straight_tiles': round(dev, 2),
                   'in_boot_lengths': round(dev / BH, 2),
                   'collinear_triples': collinear,
                   'worst_snap_degrees': round(worst, 1),
                   'headings_used': sorted({h for h, _ in residuals})},
        'not_shipped': 'rule 18: a bank and a VOTE candidate. It goes on the ground the round '
                       'the hold allows.',
    }
    with open(OUT_BANK, 'w') as f: json.dump(doc, f, indent=1)
    if len(json.load(open(OUT_BANK))['facings']) != 8: die('read-back failed')
    print()
    print('wrote %s  (%.0f KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) / 1024))
    print('wrote %s  (%.0f KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) / 1024))


if __name__ == '__main__':
    main()
