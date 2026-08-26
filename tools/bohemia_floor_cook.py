#!/usr/bin/env python3
"""
BOHEMIA — THE FLOOR ANSWERS TO ITS ROOM (8/26/26, WORLD lane)

Paolo 8/26, and it is the SECOND time he has asked:
    "I would rather you just, like, start mass producing your own indoor unless it's like
     a warehouse or an industrial district, bro. But for the most part, there's so many
     floors that I saw that were inside the houses, and it was all fucked up. So, yeah, I
     don't know if you have to, like, invent carpet too. Like, there's a floor, and then
     there's movable carpet. I don't know, bro, but all the floors of the interior look
     like dog shit."
THE FIRST TIME WAS 8/6: "Tile wood and carpet bro ofc bro wtf". Tile shipped. Wood and
carpet did not, and the code that shipped tile says why in its own comment -- they do not
exist in anything he owns. Twenty days later he is looking at the same floor.

*** WHAT IS ACTUALLY WRONG, MEASURED BEFORE COOKING A PIXEL ***
The interior floor is chosen by ONE function, houseFloorAt(x,y), and it takes NO ROOM:

    function houseFloorAt(x,y){
      const n=HOUSE_FLOOR.length; if(!n)return null;
      const h=(Math.imul(Math.floor(x/4),73856093)^Math.imul(Math.floor(y/4),19349663))>>>0;
      return HOUSE_FLOOR[h%n]; }

Twenty 44px tiles, one material, picked by a position hash. A living room, a hospital
ward, a warehouse dock and a casino concourse are the SAME FLOOR. And the room data has
existed the whole time and is thrown away: engine/bohemia_floorplan.js ZONES assigns
living / kitchen / bed / bath / shopfloor / lobby / ward / dock / atrium / stockroom, every
cell carries `.role`, and its own meta has read `pending: 'wall/floor/door art per zone'`
since July. THE INFORMATION WAS THERE. Nothing spent it on the picture.

*** REUSE CHECK (REUSE-FIRST, Paolo 7/22) -- AND IT IS WHY THIS COOKS AT ALL ***
Opened in code, not claimed: banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt,
banks/BOHEMIA_HD_TILE_REPO_part1-4.txt, banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt,
banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt. Swept every bank in the repo for the
words wood / plank / board / carpet / rug / lino / vinyl / parquet:
    "tiles" 613   "concrete" 459   "plank" 3 (a FENCE plank)   carpet 0   parquet 0
    lino 0   vinyl 0   floorboard 0
There is no carpet in this game and there never has been. There is no wood floor. So the
reuse branch is empty and the cook is legal -- which is exactly the check the law exists
to force, and exactly what the 8/6 comment already recorded and nobody acted on.

*** ACT ONE IS A DEAD VALLEY AND A FLOOR IS WHERE THAT SHOWS ***
Thirty years, no roof in places, Mojave sun through the windows, no water, no cleaning.
    CARPET   sun-bleached in a band, filthy in the traffic lane, stained where the roof
             leaked. Low pile. NEVER a clean colour.
    WOOD     grey. The finish is gone, the boards have cupped and gapped, ends split.
    LINO     yellowed, curled at the seams, the pattern worn through to backing.
    CONCRETE sealed slab, dust, a stain where the machinery stood.
No greens, no live anything (there is a standing report of "large live green flowering
vegetation" rendering inside houses -- records/BOHEMIA_WHAT_IS_IN_THE_ROOM_8_18_26.md).

*** THE ROOM DECIDES, AND THE MAP IS THE DELIVERABLE ***
The whole point is that a floor is not chosen by a hash any more. ROOM_FLOOR below maps
every role the floorplan can assign. It is MECHANISM, not canon: it says a bedroom is
carpeted and a dock is concrete, which is a fact about buildings, not a ruling about
Bohemia. If he hates a pairing he changes one line.

FACTORY LAW: typed spec (SPEC), generator (cook_*), batch output (a bank of base64 PNGs),
and its own regression gate (gates/floor_gate.js).

    python3 tools/bohemia_floor_cook.py            # cook the bank
    python3 tools/bohemia_floor_cook.py --preview  # write PNG sheets to look at
"""
import base64, io, json, math, os, random, struct, sys, zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, 'banks', 'BOHEMIA_INTERIOR_FLOOR_POOL_8_26_26.txt')
TPX  = 44                      # the corpus cell, same as every other pool in the game

# ---------------------------------------------------------------------------
# THE SPEC. Four materials, each a family of variants. Colours are Act-1 dead:
# nothing saturated, nothing green, nothing that reads as maintained.
# ---------------------------------------------------------------------------
SPEC = {
    'carpet': dict(
        n=6, why='wall-to-wall low pile in the living and sleeping rooms of a tract house',
    # *** AND THE VARIANTS HAVE TO BE THE SAME MATERIAL. *** Looked at the first cook
    # INSIDE A BUILDING, at the zoom he plays at, and the floor read as PATCHWORK: the
    # renderer quantises into ~4-cell patches so a surface reads as a surface, and my
    # variants differed by up to 0x17 in value, so each patch was a visibly different
    # grey and the room looked tiled in offcuts. A floor is ONE material. Variants exist
    # to break REPETITION, not to make a quilt -- so the spread across a family is now
    # a few points of value, and all the real difference is in the texture pass.
        base=[(0x6b,0x60,0x52), (0x6e,0x62,0x54), (0x68,0x5d,0x50),
              (0x70,0x64,0x56), (0x6a,0x5f,0x51), (0x6d,0x61,0x53)],
    ),
    'wood': dict(
        n=5, why='oak strip flooring, finish gone, boards cupped and gapped',
        # GREY, NOT ORANGE. The first cook came back the colour of a floor somebody
        # sanded last year -- warm oak, #8b785d. LOOKED AT IT and it contradicted this
        # file's own Act-1 note two paragraphs up ("WOOD: grey. The finish is gone").
        # Unfinished oak left in the sun goes silver-grey in a couple of seasons; after
        # thirty there is no warmth left in it at all. Saturation pulled most of the way
        # out and the value dropped, keeping just enough brown that it is not concrete.
        base=[(0x6e,0x66,0x59), (0x71,0x69,0x5c), (0x6b,0x63,0x56),
              (0x73,0x6a,0x5d), (0x6c,0x64,0x57)],
    ),
    'lino': dict(
        n=4, why='sheet vinyl in the wet rooms and the institutional corridors',
        # AND LINO WAS TOO PALE -- it read as paper, not floor. Dropped to a dirtier
        # institutional buff, which is what a hospital corridor actually looks like
        # under thirty years of dust.
        base=[(0x82,0x7b,0x6a), (0x85,0x7e,0x6c), (0x7f,0x78,0x67), (0x84,0x7c,0x6b)],
    ),
    'slab': dict(
        n=5, why='sealed concrete: the dock, the stockroom, the plant floor',
        base=[(0x77,0x76,0x71), (0x7a,0x79,0x74), (0x74,0x73,0x6e),
              (0x78,0x77,0x72), (0x75,0x74,0x6f)],
    ),
}

# WHICH FLOOR EACH ROOM STANDS ON. Every role engine/bohemia_floorplan.js can assign.
# 'tile' means his already-approved HOUSE_FLOOR pool -- it is not re-cooked here and it
# does not move; the wet rooms are where it was always right.
ROOM_FLOOR = {
    # a house
    'living': 'carpet', 'bed': 'carpet', 'den': 'carpet', 'hall': 'carpet',
    'dining': 'wood',   'study': 'wood',  'stair': 'wood',
    'kitchen': 'tile',  'bath': 'tile',   'laundry': 'lino', 'closet': 'carpet',
    # somewhere people worked
    'lobby': 'lino',    'office': 'carpet', 'records': 'slab', 'breakroom': 'lino',
    'ward': 'lino',     'exam': 'lino',   'corridor': 'lino',
    # AND THE SEVEN THE GATE CAUGHT FALLING THROUGH TO THE DEFAULT. floor_gate reads the
    # role names straight out of engine/bohemia_floorplan.js rather than trusting this
    # table, which is the only reason these were found: `restroom` was standing on sheet
    # vinyl by accident when it is the one room in the building that is obviously tiled.
    'restroom': 'tile',  'checkout': 'lino', 'counter': 'lino', 'reception': 'lino',
    'meeting': 'carpet', 'leisure': 'carpet', 'room': 'carpet',
    # back of house, and the industrial districts he carved out by name
    'stockroom': 'slab', 'dock': 'slab', 'service': 'slab', 'floor_open': 'slab',
    'locker': 'slab',   'plant': 'slab', 'shopfloor': 'slab', 'garage': 'slab',
    'atrium': 'lino',   'concourse': 'lino', 'gallery': 'lino',
}
DEFAULT_FLOOR = 'lino'      # a room nobody has ruled on stands on sheet vinyl, not carpet


# ---------------------------------------------------------------------------
# PNG writing, no dependencies (the repo has no PIL guarantee)
# ---------------------------------------------------------------------------
def png_bytes(px, w, h):
    raw = b''.join(b'\x00' + bytes(px[y * w * 3:(y + 1) * w * 3]) for y in range(h))
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))


class Buf:
    """A wrap-around RGB buffer. EVERY WRITE WRAPS, which is what makes the tile seamless
       -- the same rule the harmonized street pool learned the hard way on 7/14: you do
       not blend edges afterwards, you draw so there is no edge."""
    def __init__(self, w, h, base):
        self.w, self.h = w, h
        self.px = bytearray(w * h * 3)
        for i in range(w * h):
            self.px[i*3:i*3+3] = bytes(base)

    def blend(self, x, y, rgb, a):
        x %= self.w; y %= self.h
        i = (y * self.w + x) * 3
        for k in range(3):
            self.px[i+k] = max(0, min(255, int(self.px[i+k] * (1 - a) + rgb[k] * a)))

    def shade(self, x, y, d):
        x %= self.w; y %= self.h
        i = (y * self.w + x) * 3
        for k in range(3):
            self.px[i+k] = max(0, min(255, self.px[i+k] + d))


def grime(b, rnd, heavy=0.5):
    """WHAT THIRTY YEARS DOES, and it is the same three things on every material: DUST
       settles evenly, TRAFFIC wears a path, and WATER stains where the roof failed.
       Applied last on every tile so no material looks cleaner than the building."""
    # dust: a fine even lift toward grey
    for _ in range(int(b.w * b.h * 0.22)):
        b.shade(rnd.randrange(b.w), rnd.randrange(b.h), rnd.randint(-7, 7))
    # a water stain, sometimes, soft-edged and DARKER (a dry stain is a tide mark)
    if rnd.random() < heavy:
        cx, cy, r = rnd.randrange(b.w), rnd.randrange(b.h), rnd.randint(6, 15)
        for y in range(cy - r, cy + r + 1):
            for x in range(cx - r, cx + r + 1):
                d = math.hypot(x - cx, y - cy)
                if d > r: continue
                b.blend(x, y, (0x3e, 0x36, 0x2c), 0.30 * (1 - d / r) ** 1.6)
    # sun bleach: one soft band, because a window only lights part of a room
    if rnd.random() < 0.45:
        bx = rnd.randrange(b.w)
        for y in range(b.h):
            for x in range(bx - 9, bx + 10):
                f = 1 - abs(x - bx) / 10.0
                if f > 0: b.blend(x, y, (0xc9, 0xc0, 0xac), 0.16 * f)


def cook_carpet(base, seed):
    """LOW PILE. The read is not a pattern, it is TEXTURE DENSITY -- thousands of short
       fibres, so the tile is noise with a DIRECTION, plus the crushed traffic lane."""
    rnd = random.Random(seed)
    b = Buf(TPX, TPX, base)
    for _ in range(TPX * TPX * 3):
        x, y = rnd.randrange(TPX), rnd.randrange(TPX)
        d = rnd.randint(-16, 16)
        b.shade(x, y, d)
        b.shade(x, y + 1, d // 3)          # the fibre leans: two pixels, not one
    # the crushed lane people walked, darker and smoother
    if rnd.random() < 0.6:
        ly = rnd.randrange(TPX)
        for x in range(TPX):
            for y in range(ly - 4, ly + 5):
                f = 1 - abs(y - ly) / 5.0
                b.blend(x, y, (0x4a, 0x42, 0x38), 0.22 * f)
    grime(b, rnd, 0.6)
    return b


def cook_wood(base, seed):
    """STRIP FLOORING. Boards run one way, 5-7 tiles wide so a 44px tile holds 6-8 of
       them; the GAP between boards is the strongest line, the grain is the second."""
    rnd = random.Random(seed)
    b = Buf(TPX, TPX, base)
    # *** THE BOARD WIDTH HAS TO DIVIDE THE TILE, OR THE TILE IS NOT SEAMLESS. ***
    # This read rnd.choice([5,6,7]) and floor_gate caught it: the step across the wrap was
    # 3.8x the step inside the tile, because 44 is not divisible by 5, 6 or 7 -- so the
    # board rhythm restarted at the seam and every 44 px there was a half-width plank.
    # Every OTHER pass in this file wraps by construction; this one silently did not,
    # because a modulo pattern only wraps if its period divides the buffer.
    # 44 divides by 4 and by 11. At 0.75 m per world tile that is a 6.8 cm strip and an
    # 18.8 cm plank -- which happen to be exactly the two real oak floor widths.
    bw = rnd.choice([4, 4, 11])
    off = rnd.randrange(bw)
    for x in range(TPX):
        boardline = ((x + off) % bw == 0)
        for y in range(TPX):
            if boardline:
                b.blend(x, y, (0x33, 0x2a, 0x20), 0.55)      # the gap, dark and hard
            else:
                # GRAIN, AND ITS PERIOD MUST DIVIDE THE TILE TOO. This was
                # `math.sin(y * 0.9)`, whose period is 6.98 px -- it does not divide 44,
                # so the grain restarted at the top edge and the tile was not seamless
                # vertically however well the boards wrapped horizontally. Same defect as
                # the board width, one axis over, and the board-width fix alone did not
                # move the number, which is what pointed at it. Six full cycles across
                # 44 px wraps exactly.
                g = math.sin(2 * math.pi * 6 * y / TPX + ((x + off) // bw) * 2.7) * 6
                b.shade(x, y, int(g) + rnd.randint(-4, 4))
    # butt joints: where one board ends and the next begins
    for _ in range(rnd.randint(2, 4)):
        jx = rnd.randrange(TPX // bw) * bw + off
        jy = rnd.randrange(TPX)
        for k in range(bw):
            b.blend(jx + k, jy, (0x3a, 0x30, 0x25), 0.45)
    grime(b, rnd, 0.55)
    return b


def cook_lino(base, seed):
    """SHEET VINYL. Nearly flat, faint speckle, and the thing that says lino is the
       SEAM -- a straight line every couple of feet where two sheets were butted."""
    rnd = random.Random(seed)
    b = Buf(TPX, TPX, base)
    for _ in range(TPX * TPX // 2):
        b.shade(rnd.randrange(TPX), rnd.randrange(TPX), rnd.randint(-9, 9))
    if rnd.random() < 0.7:
        sx = rnd.randrange(TPX)
        for y in range(TPX):
            b.blend(sx, y, (0x5c, 0x55, 0x48), 0.40)
            b.blend(sx + 1, y, (0x5c, 0x55, 0x48), 0.16)
    # WORN THROUGH TO THE BACKING, and it is NOT A CIRCLE. The first cook drew a hard
    # filled disc and the tiled sheet came back looking like POLKA DOTS -- a decorative
    # pattern, which is the opposite of wear. Wear has a soft edge, an irregular outline
    # and a direction: it is where feet went, not where somebody put a spot.
    if rnd.random() < 0.55:
        cx, cy = rnd.randrange(TPX), rnd.randrange(TPX)
        rx, ry = rnd.randint(7, 14), rnd.randint(3, 6)      # long and thin: a path, not a dot
        for y in range(cy - ry - 2, cy + ry + 3):
            for x in range(cx - rx - 2, cx + rx + 3):
                # an ellipse with its edge chewed up, so no two tiles wear the same shape
                wob = 1.0 + 0.22 * math.sin((x * 1.7) + (y * 2.3))
                d = math.hypot((x - cx) / (rx * wob), (y - cy) / (ry * wob))
                if d > 1: continue
                b.blend(x, y, (0x6a, 0x5e, 0x4e), 0.34 * (1 - d) ** 0.8)
    grime(b, rnd, 0.5)
    return b


def cook_slab(base, seed):
    """SEALED CONCRETE. Float marks, a control joint, and the shadow of whatever stood
       on it for twenty years."""
    rnd = random.Random(seed)
    b = Buf(TPX, TPX, base)
    for _ in range(TPX * TPX):
        b.shade(rnd.randrange(TPX), rnd.randrange(TPX), rnd.randint(-6, 6))
    if rnd.random() < 0.55:                                   # a control joint
        if rnd.random() < 0.5:
            jx = rnd.randrange(TPX)
            for y in range(TPX): b.blend(jx, y, (0x44, 0x43, 0x3f), 0.45)
        else:
            jy = rnd.randrange(TPX)
            for x in range(TPX): b.blend(x, jy, (0x44, 0x43, 0x3f), 0.45)
    # AN OIL STAIN IS NOT A DISC EITHER -- the same defect the lino wear had, and I fixed
    # it in one place and not the other, which is how a whole row of this sheet came back
    # as polka dots after the lino row was already right. A stain spreads along the float
    # marks and soaks unevenly; it has no rim.
    if rnd.random() < 0.55:
        cx, cy = rnd.randrange(TPX), rnd.randrange(TPX)
        rx, ry = rnd.randint(6, 13), rnd.randint(4, 10)
        for y in range(cy - ry - 3, cy + ry + 4):
            for x in range(cx - rx - 3, cx + rx + 4):
                wob = 1.0 + 0.28 * math.sin((x * 1.3) + (y * 1.9)) + 0.14 * math.cos(x * 0.6 - y * 0.9)
                d = math.hypot((x - cx) / (rx * wob), (y - cy) / (ry * wob))
                if d > 1: continue
                b.blend(x, y, (0x2f, 0x2d, 0x2a), 0.30 * (1 - d) ** 1.1)
    grime(b, rnd, 0.4)
    return b


COOKS = {'carpet': cook_carpet, 'wood': cook_wood, 'lino': cook_lino, 'slab': cook_slab}


def main():
    preview = '--preview' in sys.argv
    bank = {
        'version': 'BOHEMIA_INTERIOR_FLOOR_POOL_v1',
        'built': '2026-08-26',
        'cell_px': TPX,
        'why': ('Paolo 8/26 (second time; first was 8/6 "Tile wood and carpet bro ofc bro '
                'wtf"): "all the floors of the interior look like dog shit". Every interior '
                'floor in the game was ONE material chosen by a position hash, and the room '
                'role the floorplan computes was never spent on the picture.'),
        'reuse_check': ('Swept every banks/*.txt for wood/plank/board/carpet/rug/lino/vinyl/'
                        'parquet before cooking: "tiles" 613, "concrete" 459, "plank" 3 (a '
                        'FENCE plank), carpet 0, parquet 0, lino 0, vinyl 0, floorboard 0. '
                        'The reuse branch is EMPTY, which is what makes this cook legal.'),
        'act1': ('Thirty years dead in the Mojave: nothing saturated, nothing green, nothing '
                 'maintained. Every tile takes the same three-part weathering -- even dust, a '
                 'worn traffic lane, and a dry water stain where the roof failed.'),
        'seamless': ('Every write wraps in both axes, so the tile is seamless by CONSTRUCTION '
                     'rather than by an edge blend afterwards -- the 7/14 harmonized-street '
                     'lesson, which is that blending edges makes blur bands.'),
        'room_floor': ROOM_FLOOR,
        'default_floor': DEFAULT_FLOOR,
        'pools': {},
        'notes': {k: v['why'] for k, v in SPEC.items()},
    }
    total = 0
    for name, s in SPEC.items():
        pool = []
        for i in range(s['n']):
            b = COOKS[name](s['base'][i % len(s['base'])], 0xB0 * 1000 + hash(name) % 997 + i)
            png = png_bytes(b.px, TPX, TPX)
            pool.append(base64.b64encode(png).decode('ascii'))
            if preview:
                d = os.path.join(ROOT, 'records', 'target', 'floor')
                os.makedirs(d, exist_ok=True)
                open(os.path.join(d, '%s_%d.png' % (name, i)), 'wb').write(png)
        bank['pools'][name] = pool
        total += len(pool)
        print('  cooked %-8s %d variants' % (name, len(pool)))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(json.dumps(bank))
    print('WROTE %s  (%d tiles, %d roles mapped)' % (os.path.relpath(OUT, ROOT), total, len(ROOM_FLOOR)))


if __name__ == '__main__':
    main()
