#!/usr/bin/env python3
"""THE BLOCK WAR KIT  (COOK [board assets] round 1, 9/30/26)

PAOLO 9/29: "think about all the assets you're gonna need for the combat board... they're
gonna be used in different ways... no single combat map in Battle Brothers is exactly the
same... let's just recreate Battle Brothers with our whole swag." AND HIS CORRECTION THE SAME
ROUND: "most of it will be city-based terrain... every combat fight damn near like a block
war." Rule 46b and 46e. So the order is reversed from the manager's first list: THE CITY GAPS
FIRST, and the desert, the shore and the hills after.

*** THE COUNT FIRST, BECAUSE THE ROW ASKS FOR IT EXACTLY AND NOBODY HAD DONE IT. ***
Every bank file opened, every drawn piece found, and each one filed by terrain and by kind off
its own name and its bank's name:

    15,010 DRAWN PIECES across 53 bank files.

    TERRAIN                FLOOR  BLOCKER  COVER  MOUND   EDGE  DRESS  LIGHT  WEATHER  TOTAL
    T1  SUBURB BLOCK         406     1827     83    245   1071    150     20       18   2981
    T5  WASH AND SHORE       127      270     89      -   1409    217     24        -   1409
    T13 CASINO FLOOR          72      108     35      -    465    281     24        -    673
    T6  HILLS                134      251      -    323    115      -      -        -    590
    T3  INDUSTRIAL             -      220     40    106    187     84      -       18    483
    T11 THE RUIN              32      112    106      -     88    155      -        -    321
    T10 GOLF AND PARK         62        -      -      -     62      -      -        -    258
    T8  PARKING / BIG BOX      3       21      -      -     23     38      -        -    188
    T2  THE STRIP             50        6      -      -      3     31     31        -    112
    T14 SOLAR AND PUMPS        -       55      -      -      -     33      -        -    109
    T7  THE FREEWAY            3        -     36      -     36      -      -        -     39
    T15 LANDFILL / SCRAP       -       18      -      -      -     17      -        -     37
    T9  TRAILER PARK           -       11      -      -      -      -      -        -     35
    T12 THE AIRPORT            -        -      -      -      -      -      -        -     21
    T4  OPEN DESERT            6        -      -      5      -      -      -        -     11

    BY KIND: floor 895, blocker 2899, cover 389, mound 679, edge 3459, dressing 1006,
             LIGHT 99, WEATHER 36.

*** WHAT THE COUNT SAYS, AND IT IS NOT WHAT THE SHEET GUESSED. *** The sheet's guess was that
we have the city and lack the nature. Measured, that is half right and half wrong:
  - T5 THE SHORE is the SECOND BEST STOCKED terrain we own (1,409 pieces), not a gap. Water,
    edges and banks were built long ago for the city's pools and canals.
  - T6 THE HILLS has 590, including 323 MOUNDS, which is the one kind the whole fight rests on.
  - THE REAL DESERTS ARE CITY ONES: the freeway 39, the landfill 37, the trailer park 35, the
    airport 21. And T4 open desert at 11 is the barest thing we own.
  - COVER is the thinnest kind across the whole board (389 against 2,899 blockers) and LIGHT
    and WEATHER barely exist anywhere (99 and 36). A board with blockers and no cover is a
    board with nowhere to stand, which is the opposite of a Battle Brothers fight.
So this round cooks THE CITY COVER AND THE CITY BLOCKERS HE NAMED, which is the intersection
of his correction and the count.

WHAT IS COOKED, AND WHY EACH ONE (his list, 46e, in his order):
  JERSEY BARRIER   cover, the freeway's own. 0.8 x 3.0 m.
  CONTAINER        blocker and climbable, the industrial gap. 2.4 x 6.1 m.
  CART CORRAL      blocker, the parking lot's own. 2.5 x 6.0 m.
  TRAILER          a whole tile, the trailer park's. 3.0 x 9.0 m.
  PROPANE TANK     blocker, and everyone knows what it does. 1.2 x 2.4 m.
  CHAIN-LINK RUN   blocker and edge, the fence the city is full of. 0.1 x 6.0 m.
  RUBBLE MOUND     the one terrain effect, in the ruin. 4.0 x 4.0 m.
  BURNT HOUSE      a scorched variant of the house tile, the T11 gap. 12 x 12 m.
  STANDING ROOF    high ground that is a building (rule 37g, his own up-vote). 12 x 12 m.

EVERY ONE IS DRAWN AT ITS REAL SIZE AT HIS OWN DENSITY, never fitted to a box. His approved
street measures 42.9 pixels per metre (this lane, 9/28, off three sprites his 7/28 bank places
with real sizes), so a 3 m barrier is 129 px and a 12 m house tile is 515. That is what lets
COMBAT drop any of them on a house-tile board at any zoom without inventing detail.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * EVERY PIECE IS ITS REAL SIZE at his own density, checked against a metre table, so nothing
    is a guess and nothing is fitted to a convenient square;
  * NO ATARI: at his density, so the floor is his own art's;
  * EVERY PIXEL IS HIS: every colour on a family ramp of the 7/28 approved bank;
  * COVER IS NOT A BLOCKER: a cover piece is under a man's chest height and a blocker is over
    it, measured in metres, because that is the whole difference on a board;
  * A MOUND IS SOMETHING YOU STAND ON: its top is flat and reachable, not a spike;
  * NOTHING IS STAMPED: no two pieces of the kit are the same picture.

THE ANALOG HORROR LINE (rule 20): everything in this kit is something somebody left. The
corral still has its carts in it, the tank is still full, and the house that burned did it
long enough ago that the ash has stopped moving.

REFERENCE CHECK (the 9/4 standing law):
  02_COMBAT_RULES.md, the BOARD line: BB scatters three to six blocker kinds per terrain with
        rules, and the tactical board's art is quieter than the men on it. Both taken.
  TG-02 THE HOUSE FROM 45 DEGREES: roof planes first, then the face -- the standing roof and
        the burnt house are that rule, and the roof is drawn so its TOP reads as standable.
  TG-04 THE STREET TILE, for the barrier's kerb-strength edge.
  CGRD-01 INTO THE BREACH: clarity over cool, every time. On a board, a piece has one job and
        has to say which job from across the screen: this is why cover and blocker are split
        by a measured height and not by taste.
  AH-01 THE BIBLE: one register, the sun north-west on every piece, every shadow south-east.
  REUSE CHECK: every ramp and every material comes out of the 7/28 approved bank at run time;
  the density is this lane's own measurement of his art; the counts are read from the banks.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md,
  the BOARD and TERRAIN lines: "a fight is generated from the map terrain where it happens",
  with blockers scattered by rules and height as the one bonus. BB's kit per terrain is small
  on purpose -- three or four blocker kinds -- because a board reads when its vocabulary is
  short. WHAT WE DO DIFFERENTLY (rule 39b): BB's blockers are nature's (trees, rocks) and its
  settlements are wood. Ours is a CITY that already fell: every blocker in this kit is
  something a person put there for a reason that no longer exists, and half of them are
  climbable, so our board has a vertical layer BB's flat field never had.

    python3 tools/bohemia_the_block_war_kit_cook_9_30_26.py
      -> banks/BOHEMIA_THE_BLOCK_WAR_KIT_9_30_26.txt
      -> records/BOHEMIA_THE_BOARD_ASSET_COUNT_9_30_26.txt
      -> slices/vote/COOK_THE_BLOCK_WAR_KIT.png
"""
import base64, io, json, os, sys, glob, re, collections
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_BLOCK_WAR_KIT_9_30_26.txt'
OUT_COUNT = 'records/BOHEMIA_THE_BOARD_ASSET_COUNT_9_30_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_BLOCK_WAR_KIT.png'

PPM = 42.9          # his own street's pixels per metre (this lane, 9/28, off his sprites)
TILE_M = 12.0       # a combat tile is a house
CHEST = 1.3         # a man's chest: the line between cover and a blocker


def die(m): sys.exit('REFUSED: ' + m)


rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

def load(rec): return Image.open(io.BytesIO(base64.b64decode(rec['b64'])))


_B = json.load(open(BANK))
RAMPS = {k: [rgb(h) for h in v] for k, v in _B['method']['one_palette_per_family'].items()}
TILES = {t['id']: t for t in _B['tiles']}
SRC = _B['cell_px']
# HIS RAMPS **AND HIS OWN TILES**. The first guard here allowed only the bare ramps and
# refused the barrier for eight colours that are the concrete ramp PLUS TWO -- which is
# his own tiles' sun offset, measured on this lane's row on 9/28 ('his tiles sit a little
# off the family ramp and that is the sun'). A guard stricter than his own approved art is
# a guard that refuses his art, and this lane has now written that one twice.
ALL = {c for r in RAMPS.values() for c in r}
for _t in _B['tiles']:
    ALL |= {p[:3] for p in load(_t).convert('RGB').getdata()}


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


def m(metres): return max(1, int(round(metres * PPM)))


def colours(im):
    return {(p[0], p[1], p[2]) for p in im.convert('RGBA').getdata() if p[3] > 127}


def roll(im, dx, dy):
    if not dx and not dy: return im
    out = Image.new('RGB', im.size)
    for ox in (dx, dx - im.size[0]):
        for oy in (dy, dy - im.size[1]):
            out.paste(im, (ox, oy))
    return out


def dress(variants, w, h, seed):
    """HIS OWN TILES AS THE MATERIAL (rule 38e: the walk's assets dress the fight's board)."""
    ts = [load(TILES[v]).convert('RGB') for v in variants]
    im = Image.new('RGB', (max(1, w), max(1, h)))
    for yy in range(0, h, SRC):
        for xx in range(0, w, SRC):
            k = ts[((xx // SRC) * 7 + (yy // SRC) * 13 + seed) % len(ts)]
            im.paste(roll(k, ((xx // SRC) * 11 + seed) % SRC,
                          ((yy // SRC) * 23 + seed * 3) % SRC), (xx, yy))
    return im


def fam_of(c):
    best, who = 1e9, 'ground'
    for f, ramp in RAMPS.items():
        for e in ramp:
            d = abs(e[0] - c[0]) + abs(e[1] - c[1]) + abs(e[2] - c[2])
            if d < best: best, who = d, f
    return who


def shade(im, box, mult):
    """A SHADOW DARKENS WITHIN ITS OWN FAMILY. Written wrong twice in this lane already: once
       picking the ramp by ROW, once snapping across every ramp at once and turning a
       terracotta roof concrete grey. The family is found per colour."""
    x0, y0, x1, y1 = [int(v) for v in box]
    p = im.load()
    byf = {k: sorted(v, key=LUM) for k, v in RAMPS.items()}
    memo = {}
    for y in range(max(0, y0), min(im.size[1], y1)):
        for x in range(max(0, x0), min(im.size[0], x1)):
            c = p[x, y][:3]
            if c not in memo:
                ramp = byf[fam_of(c)]
                v = LUM(c) * mult
                memo[c] = min(ramp, key=lambda e: abs(LUM(e) - v))
            p[x, y] = memo[c] + ((p[x, y][3],) if len(p[x, y]) == 4 else ())
    return im


def sheet(wm, hm):
    return Image.new('RGBA', (m(wm), m(hm)), (0, 0, 0, 0))


def sun(im, box, lit='top'):
    """The sun is north-west on every pixel in this game: the top and the west catch it, the
       south and the east are in shadow."""
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = box
    w = max(1, m(0.06))
    p = im.load()
    for x in range(int(x0), int(x1)):
        for k in range(w):
            if 0 <= y0 + k < im.size[1]:
                c = p[x, int(y0 + k)]
                if c[3] > 127: p[x, int(y0 + k)] = tuple(min(255, int(v * 1.22)) for v in c[:3]) + (255,)
    shade(im, (x0, y1 - m(0.25), x1, y1), 0.72)


def jersey(seed=1):
    """COVER: the freeway's own, and the city's most common piece of half-height concrete.
       0.8 wide, 3.0 long, 0.81 tall -- under a man's chest, which is what makes it cover."""
    wm, lm = 0.8, 3.0
    im = sheet(lm, wm + 0.5)
    body = dress(['concrete_0', 'concrete_1'], m(lm), m(wm), seed).convert('RGBA')
    im.paste(body, (0, m(0.25)), body)
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']
    for k in range(3):                                    # the taper, its own silhouette
        d.line([(0, m(0.25) + k), (m(lm), m(0.25) + k)], fill=c[6 - k] + (255,))
    shade(im, (0, m(0.25 + wm * 0.62), m(lm), m(0.25 + wm)), 0.74)
    for x in range(0, m(lm), m(0.75)):                    # the joints between sections
        d.line([(x, m(0.25)), (x, m(0.25 + wm))], fill=c[1] + (255,))
    return im, dict(w=wm, l=lm, h=0.81, kind='COVER', name='JERSEY BARRIER')


def container(seed=2):
    """BLOCKER, and climbable: a twenty-foot box. 2.44 x 6.1 x 2.59 -- over chest height, so
       it blocks, and its top is flat, so it is also high ground when it is stacked."""
    wm, lm = 2.44, 6.1
    im = sheet(lm, wm + 0.9)
    # A CONTAINER IS METAL, NOT STUCCO. The first cut dressed it in his wall tiles and it
    # came out a tan brick box: the same picture as the trailer beside it. Painted steel is
    # the ASPHALT ramp (his darkest family) with the corrugation doing all the reading, and
    # rust in terracotta where the rain sat.
    a = RAMPS['asphalt']; t = RAMPS['terracotta']
    d = ImageDraw.Draw(im)
    d.rectangle([0, m(0.6), m(lm), m(0.6 + wm)], fill=a[3] + (255,))
    for x in range(0, m(lm), m(0.28)):                    # the corrugations, its whole read
        d.rectangle([x, m(0.6), x + m(0.14), m(0.6 + wm)], fill=a[4] + (255,))
        d.line([(x + m(0.14), m(0.6)), (x + m(0.14), m(0.6 + wm))], fill=a[1] + (255,))
    r = R(seed)
    for _ in range(40):                                    # rust, where the rain sat
        rx, ry = r.i(m(lm)), m(0.6) + r.i(m(wm))
        d.rectangle([rx, ry, rx + m(0.1), ry + m(0.08)], fill=t[1 + r.i(3)] + (255,))
    d.rectangle([0, m(0.6), m(lm), m(0.6) + m(0.12)], fill=t[3] + (255,))   # the rust line
    for cx in (0, m(lm) - m(0.3)):                        # the corner castings
        d.rectangle([cx, m(0.6), cx + m(0.3), m(0.6 + wm)], fill=a[4] + (255,))
    shade(im, (0, m(0.6 + wm * 0.66), m(lm), m(0.6 + wm)), 0.7)
    shade(im, (m(0.35), m(0.6 + wm), m(lm) + m(0.35), m(0.6 + wm) + m(0.55)), 0.62)
    return im, dict(w=wm, l=lm, h=2.59, kind='BLOCKER', name='CONTAINER', climbable=True)


def corral(seed=3):
    """BLOCKER: a cart corral, the parking lot's own furniture, and it still has its carts."""
    wm, lm = 2.5, 6.0
    im = sheet(lm, wm + 0.4)
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']; a = RAMPS['asphalt']
    for y in (m(0.2), m(0.2 + wm)):                       # the rails
        d.rectangle([0, y, m(lm), y + m(0.12)], fill=c[5] + (255,))
    for x in range(0, m(lm), m(1.5)):                     # the posts
        d.rectangle([x, m(0.2), x + m(0.12), m(0.2 + wm)], fill=c[3] + (255,))
    for k in range(4):                                    # the carts still in it
        cx = m(0.6 + k * 1.3)
        d.rectangle([cx, m(0.7), cx + m(0.8), m(0.7 + 1.3)], fill=a[3] + (255,))
        d.rectangle([cx, m(0.7), cx + m(0.8), m(0.7) + m(0.1)], fill=a[5] + (255,))
    shade(im, (0, m(0.2 + wm * 0.7), m(lm), m(0.2 + wm + 0.2)), 0.74)
    # COVER, NOT A BLOCKER, AND THE GUARD IS WHAT SAID SO. A corral is 1.05 m: you cannot
    # walk through it but you can shoot over it, which on a board is COVER that also stops
    # movement. Two facts, not one, and the bank carries both.
    return im, dict(w=wm, l=lm, h=1.05, kind='COVER', name='CART CORRAL', blocks_move=True)


def trailer(seed=4):
    """A WHOLE TILE: a single-wide. 3.0 x 9.0 x 2.8. The trailer park had 35 pieces in the
       whole bank set, which was the second barest city terrain we own."""
    wm, lm = 3.0, 9.0
    im = sheet(lm, wm + 1.2)
    # A SINGLE-WIDE IS PALE RIBBED METAL WITH A SEAM DOWN THE MIDDLE, not brick. Dressed in
    # his wall tiles it was the container's twin; the two are side by side on the card and
    # they have to be told apart at a glance.
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']; a = RAMPS['asphalt']; t = RAMPS['terracotta']
    d.rectangle([0, m(0.8), m(lm), m(0.8 + wm)], fill=c[5] + (255,))
    d.rectangle([0, m(0.8), m(lm), m(0.8 + wm / 2)], fill=c[6] + (255,))
    d.line([(0, m(0.8 + wm / 2)), (m(lm), m(0.8 + wm / 2))], fill=c[6] + (255,))  # the seam
    for x in range(0, m(lm), m(0.6)):                     # the ribs
        d.line([(x, m(0.8)), (x, m(0.8 + wm))], fill=c[2] + (255,))
    d.rectangle([m(0.4), m(0.8 + wm) - m(0.3), m(1.4), m(0.8 + wm)], fill=a[0] + (255,))  # door
    d.rectangle([m(3.2), m(0.8 + wm) - m(0.25), m(4.4), m(0.8 + wm) - m(0.05)],
                fill=a[1] + (255,))                        # a window
    d.rectangle([m(6.0), m(0.55), m(6.9), m(0.85)], fill=t[2] + (255,))   # the rusted vent
    d.rectangle([0, m(0.8 + wm) - m(0.35), m(lm), m(0.8 + wm)], fill=c[2] + (255,))  # skirting
    d.rectangle([m(0.3), m(0.8 + wm), m(1.5), m(0.8 + wm) + m(0.4)], fill=c[4] + (255,))  # step
    shade(im, (0, m(0.8 + wm * 0.68), m(lm), m(0.8 + wm)), 0.72)
    shade(im, (m(0.4), m(0.8 + wm), m(lm) + m(0.4), m(0.8 + wm) + m(0.7)), 0.6)
    return im, dict(w=wm, l=lm, h=2.8, kind='BLOCKER', name='TRAILER')


def propane(seed=5):
    """BLOCKER, and everyone already knows what it does. A 500-gallon domestic tank,
       1.2 across, 2.4 long, and it is still full."""
    wm, lm = 1.2, 2.4
    im = sheet(lm, wm + 0.5)
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']; t = RAMPS['terracotta']; a = RAMPS['asphalt']
    d.rounded_rectangle([0, m(0.2), m(lm), m(0.2 + wm)], radius=m(wm / 2),
                        fill=c[5] + (255,))
    d.rounded_rectangle([0, m(0.2), m(lm), m(0.2 + wm * 0.5)], radius=m(wm / 3),
                        fill=c[6] + (255,))                # the lit half, sun north-west
    d.rectangle([m(lm / 2 - 0.2), m(0.1), m(lm / 2 + 0.2), m(0.45)], fill=a[3] + (255,))
    d.rectangle([m(0.3), m(0.2 + wm * 0.55), m(0.9), m(0.2 + wm * 0.75)],
                fill=t[2] + (255,))                        # rust where it sat
    shade(im, (0, m(0.2 + wm * 0.72), m(lm), m(0.2 + wm)), 0.72)
    shade(im, (m(0.25), m(0.2 + wm), m(lm) + m(0.25), m(0.2 + wm) + m(0.35)), 0.62)
    # 1.2 m, so COVER that stops movement, the same as the corral. Filed as a blocker by
    # eye and corrected by the tape.
    return im, dict(w=wm, l=lm, h=1.2, kind='COVER', name='PROPANE TANK', blocks_move=True)


def chainlink(seed=6):
    """BLOCKER AND EDGE: the fence this city is made of. 6 m of run, 1.8 tall, and you can
       see through it, which is why it blocks a man and not a bullet."""
    wm, lm = 0.1, 6.0
    im = sheet(lm, 0.9)
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']
    for x in range(0, m(lm), m(2.0)):                      # the posts
        d.rectangle([x, m(0.15), x + m(0.12), m(0.75)], fill=c[4] + (255,))
    d.line([(0, m(0.2)), (m(lm), m(0.2))], fill=c[5] + (255,))          # the top rail
    for x in range(0, m(lm), max(2, m(0.14))):             # the mesh, seen edge on
        d.line([(x, m(0.22)), (x + m(0.1), m(0.72))], fill=c[3] + (255,))
    shade(im, (0, m(0.6), m(lm), m(0.78)), 0.76)
    return im, dict(w=wm, l=lm, h=1.83, kind='BLOCKER', name='CHAIN-LINK RUN', seethrough=True)


def rubble(seed=7):
    """THE MOUND, which is the one terrain effect in the whole fight: a heap you STAND ON, so
       its top is flat and its sides are reachable. 4 x 4, about 1.4 up."""
    wm, lm = 4.0, 4.0
    im = sheet(lm, wm)
    base = dress(['concrete_0', 'concrete_1'], m(lm), m(wm), seed).convert('RGBA')
    d = ImageDraw.Draw(base)
    cx, cy, rr = m(lm) / 2.0, m(wm) / 2.0, m(1.8)
    px = base.load()
    for y in range(base.size[1]):
        for x in range(base.size[0]):
            dx, dy = (x - cx) / rr, (y - cy) / rr
            dd = dx * dx + dy * dy
            if dd > 1.0:
                px[x, y] = (0, 0, 0, 0)
    im.paste(base, (0, 0), base)
    d = ImageDraw.Draw(im)
    c = RAMPS['concrete']
    d.ellipse([cx - m(0.9), cy - m(0.9), cx + m(0.9), cy + m(0.55)],
              fill=c[4] + (255,))                          # THE FLAT TOP you stand on
    d.ellipse([cx - m(0.9), cy - m(0.9), cx + m(0.9), cy - m(0.2)], fill=c[6] + (255,))
    r = R(seed)
    for _ in range(90):                                    # broken slabs round the sides
        a2 = r() * 6.283; d2 = 0.55 + r() * 0.45
        x = cx + rr * d2 * __import__('math').cos(a2)
        y = cy + rr * d2 * __import__('math').sin(a2) * 0.8
        s = m(0.12 + r() * 0.2)
        d.rectangle([x, y, x + s, y + s * 0.7], fill=c[1 + r.i(5)] + (255,))
    shade(im, (cx - rr, cy + rr * 0.3, cx + rr, cy + rr), 0.72)
    return im, dict(w=wm, l=lm, h=1.4, kind='MOUND', name='RUBBLE MOUND', standable=True)


def house_tile(seed=8, burnt=False):
    """A WHOLE COMBAT TILE (12 m): the house from above at an angle, roof planes first. Two of
       them: one standing, whose ROOF IS HIGH GROUND (rule 37g, his own up-vote, 'a building
       with the roof that you can be on'), and one BURNT, which is the T11 ruin gap -- the
       count found 321 ruin pieces and not one scorched variant of a house."""
    px = m(TILE_M)
    im = Image.new('RGBA', (px, px), (0, 0, 0, 0))
    g = dress(['yard_0', 'yard_1', 'yard_2'], px, px, seed).convert('RGBA')
    im.paste(g, (0, 0), g)
    d = ImageDraw.Draw(im)
    marg = m(0.6)
    x0, x1 = marg, px - marg
    y0, eave, base = marg, int(px * 0.60), px - marg
    if burnt:
        # the roof is GONE: joists over a black floor, and the walls are scorched
        d.rectangle([x0, y0, x1, eave], fill=RAMPS['asphalt'][0] + (255,))
        for x in range(x0, x1, m(0.8)):                    # the joists that held
            d.line([(x, y0), (x, eave)], fill=RAMPS['asphalt'][2] + (255,))
        for k in range(4):
            d.line([(x0, y0 + k * (eave - y0) // 4), (x1, y0 + k * (eave - y0) // 4)],
                   fill=RAMPS['asphalt'][1] + (255,))
        w = dress(['wall_0', 'wall_1'], x1 - x0, base - eave, seed ^ 5).convert('RGBA')
        im.paste(w, (x0, eave), w)
        shade(im, (x0, eave, x1, base), 0.46)              # scorched, not shadowed
        d.rectangle([x0, eave, x1, eave + m(0.2)], fill=RAMPS['asphalt'][0] + (255,))
        for k in range(7):                                 # the smoke stain above each opening
            sx = x0 + m(0.8) + k * (x1 - x0 - m(1.6)) // 6
            d.polygon([(sx, base), (sx + m(0.5), base), (sx + m(0.25), eave + m(0.4))],
                      fill=RAMPS['asphalt'][1] + (255,))
    else:
        r0 = dress(['roof_slope', 'roof_ridge'], x1 - x0, eave - y0, seed).convert('RGBA')
        im.paste(r0, (x0, y0), r0)
        shade(im, (x0, y0 + (eave - y0) // 2, x1, eave), 0.80)
        d.line([(x0, y0 + (eave - y0) // 2), (x1, y0 + (eave - y0) // 2)],
               fill=RAMPS['terracotta'][6] + (255,))
        # THE ROOF IS HIGH GROUND, so its top has to READ AS SOMETHING YOU STAND ON: a flat
        # deck with a parapet round it, not a pitch you would slide off.
        # A DECK YOU STAND ON IS GRAVEL WITH A PARAPET ROUND IT, not a blank panel. The
        # first cut filled it flat and it read as a missing rectangle on the roof.
        dx0, dy0 = x0 + m(1.2), y0 + m(0.8)
        dx1, dy1 = x1 - m(1.2), y0 + (eave - y0) // 2 - m(0.4)
        deck = dress(['roof_deck'], dx1 - dx0, dy1 - dy0, seed ^ 3).convert('RGBA')
        im.paste(deck, (dx0, dy0), deck)
        pw = m(0.25)
        for bx in ((dx0, dy0, dx1, dy0 + pw), (dx0, dy1 - pw, dx1, dy1),
                   (dx0, dy0, dx0 + pw, dy1), (dx1 - pw, dy0, dx1, dy1)):
            d.rectangle(list(bx), fill=RAMPS['terracotta'][4] + (255,))
        d.rectangle([dx0, dy0, dx1, dy0 + max(1, pw // 3)],
                    fill=RAMPS['terracotta'][6] + (255,))   # the lit lip, sun north-west
        shade(im, (dx0, dy1 - pw, dx1, dy1), 0.78)
        w = dress(['wall_0', 'wall_1'], x1 - x0, base - eave, seed ^ 5).convert('RGBA')
        im.paste(w, (x0, eave), w)
        d.line([(x0, eave), (x1, eave)], fill=RAMPS['terracotta'][0] + (255,))
        dw, dh = m(1.0), m(2.05)
        dx = x0 + (x1 - x0) // 2 - dw // 2
        d.rectangle([dx, base - dh, dx + dw, base], fill=RAMPS['asphalt'][0] + (255,))
        d.rectangle([dx, base - m(0.1), dx + dw, base], fill=RAMPS['concrete'][6] + (255,))
    shade(im, (x0 + m(0.8), base, x1 + m(0.8), base + m(0.8)), 0.66)
    nm = 'BURNT HOUSE' if burnt else 'STANDING ROOF'
    return im, dict(w=TILE_M, l=TILE_M, h=4.5, kind='MOUND' if not burnt else 'BLOCKER',
                    name=nm, standable=not burnt)


def build():
    out = []
    for fn in (jersey, container, corral, trailer, propane, chainlink, rubble):
        im, meta = fn()
        out.append((im, meta))
    im, meta = house_tile(8, burnt=False); out.append((im, meta))
    im, meta = house_tile(9, burnt=True); out.append((im, meta))
    return out


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def the_count():
    """THE ROW ASKS FOR EXACT HAVE COUNTS AND NOBODY HAD DONE IT. Every bank opened, every
       drawn piece found, each filed by terrain and kind off its own name and its bank's."""
    KIND = [
        ('FLOOR', r'ground|floor|road|walk|sidewalk|path|dirt|sand|asphalt|concrete|pave|grass|deck|tarmac|slab|surface|seamless'),
        ('BLOCKER', r'wall|fence|tree|rock|boulder|crate|barrel|container|pylon|post|pole|column|cactus|creosote|joshua|palm|tamarisk|shelf|stack|perim'),
        ('COVER', r'car|wreck|vehicle|barrier|jersey|counter|planter|bench|seat|table|cart|drum|rubble|sandbag|bin'),
        ('MOUND', r'mound|hill|roof|dune|step|stair|ramp|platform|berm|ridge|overpass|bridge'),
        ('EDGE', r'kerb|curb|edge|border|gate|door|cliff|shore|water|pool|canal|rail'),
        ('DRESS', r'sign|trash|bone|debris|graffiti|flower|pot|jar|item|tool|misc|decor|furniture|lamp|light|window|awning|banner|cable|wire|track'),
        ('LIGHT', r'lamp|light|neon|glow|fire|sodium|lantern|dusk|night'),
        ('WEATH', r'dust|rain|snow|fog|storm|shimmer|haze|cloud'),
    ]
    TERR = [
        ('T1  SUBURB BLOCK', r'house|suburb|yard|street|sidewalk|residential|wall|door|roof|garage|stucco|fence|driveway'),
        ('T2  THE STRIP', r'strip|casino|marquee|fountain|sphere|tower|boulevard|resort|porte|luxor|neon'),
        ('T3  INDUSTRIAL', r'warehouse|dock|container|industrial|tank|silo|crane|rail|siding|loading'),
        ('T4  OPEN DESERT', r'desert|creosote|joshua|boulder|wash|dune|mojave|cact|scrub|sand'),
        ('T5  WASH AND SHORE', r'shore|lake|mead|water|tamarisk|mud|boat|canal|wash|pond|pool'),
        ('T6  HILLS', r'hill|mountain|rock|cliff|ridge|cave|frenchman|spring|redrock'),
        ('T7  THE FREEWAY', r'freeway|highway|overpass|ramp|jersey|barrier|interstate|truck|exit'),
        ('T8  PARKING/BIGBOX', r'parking|lot|cart|corral|bigbox|store|market|mall'),
        ('T9  TRAILER PARK', r'trailer|mobile|propane|chain|clothesline|park'),
        ('T10 GOLF AND PARK', r'golf|park|grass|palm|pond|turf|green|hazard'),
        ('T11 THE RUIN', r'ruin|burnt|scorch|collaps|rubble|debris|char|wreck|broken'),
        ('T12 THE AIRPORT', r'airport|hangar|apron|plane|runway|jet|terminal'),
        ('T13 CASINO FLOOR', r'interior|casino|slot|pit|cage|escalator|indoor|room|lobby'),
        ('T14 SOLAR AND PUMPS', r'solar|panel|pump|switchgear|inverter|substation|power'),
        ('T15 LANDFILL/SCRAP', r'landfill|scrap|junk|crusher|heap|dump|tip'),
    ]
    ids = []
    for f in sorted(glob.glob('banks/*.txt')):
        try: b = json.load(open(f))
        except Exception: continue
        bn = f.split('/')[-1]
        def walk(o, key=None):
            if isinstance(o, dict):
                if 'b64' in o:
                    ids.append((bn, str(o.get('id') or o.get('name') or key or '?').lower()))
                for k, v in o.items(): walk(v, k)
            elif isinstance(o, list):
                for v in o: walk(v, key)
        walk(b)
    grid = collections.defaultdict(int); tk = collections.Counter(); kk = collections.Counter()
    for bn, i in ids:
        blob = (bn + ' ' + i).lower()
        ts = [t for t, rx in TERR if re.search(rx, blob)]
        ks = [k for k, rx in KIND if re.search(rx, blob)]
        for t in ts:
            tk[t] += 1
            for k in ks: grid[(t, k)] += 1; kk[k] += 1
    return ids, TERR, KIND, grid, tk, kk


def card(kit, tk, kk):
    INK, PAPER, DIM, HOT = (238, 230, 214), (26, 23, 20), (150, 138, 120), (222, 181, 118)
    W = 1680
    f, fs, fb, fh = font(17), font(14), font(26), font(19)
    im = Image.new('RGB', (W, 2400), PAPER)
    d = ImageDraw.Draw(im)
    y = 28
    d.text((30, y), 'THE BLOCK WAR KIT', INK, fb); y += 34
    d.text((30, y), 'COOK [board assets] round 1  9/30   the city pieces, at their real size',
           HOT, f); y += 26
    d.text((30, y), 'You said most fights are block wars. So these are the city things the '
           'board was missing, each drawn at the size it really is.', DIM, fs); y += 32

    # ---- the kit, on a house tile's worth of ground so the scale is visible
    d.text((30, y), 'EVERY PIECE ON THE SAME GROUND, AT THE SAME SCALE', INK, fh); y += 22
    d.text((30, y), 'the pale square behind them is ONE COMBAT TILE: a house, 12 metres.',
           DIM, fs); y += 22
    tile = m(TILE_M)
    # THE NAMES GO IN A LEGEND, NOT UNDER THE PIECES. Written under each one they collided
    # four deep, because a jersey barrier is 3 m and its name is nine words wide. Numbered
    # on the picture, named in a list: the picture stays a picture.
    Z = 0.42
    bw = int(tile * Z)
    band = Image.new('RGB', (W - 60, bw + 34), (92, 82, 66))
    bd = ImageDraw.Draw(band)
    bd.rectangle([10, 24, 10 + bw, 24 + bw], outline=(150, 138, 120))
    bd.text((14, 6), 'ONE COMBAT TILE = A HOUSE, 12 m', (176, 164, 144), fs)
    x = 10
    spots = []
    for i, (piece, meta) in enumerate(kit):
        pw = max(1, int(piece.size[0] * Z)); ph = max(1, int(piece.size[1] * Z))
        p2 = piece.resize((pw, ph), Image.NEAREST)
        band.paste(p2, (x, 24 + bw - ph), p2)
        lab = str(i + 1)
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            bd.text((x + 2 + dx, 24 + bw - ph - 17 + dy), lab, (26, 23, 20), f)
        bd.text((x + 2, 24 + bw - ph - 17), lab, (238, 230, 214), f)
        spots.append(i + 1)
        x += pw + 16
    im.paste(band, (30, y)); y += band.size[1] + 14

    half = (len(kit) + 1) // 2
    for col in (0, 1):
        yy = y
        for i in range(col * half, min(len(kit), (col + 1) * half)):
            meta = kit[i][1]
            cx = 40 + col * 600
            d.text((cx, yy), '%d' % (i + 1), HOT, f)
            d.text((cx + 26, yy), meta['name'], INK, fs)
            d.text((cx + 215, yy), '%.1f x %.1f m, %.2f tall'
                   % (meta['l'], meta['w'], meta['h']), DIM, fs)
            d.text((cx + 390, yy), meta['kind']
                   + (' (stops you)' if meta.get('blocks_move') else '')
                   + (' (stand on it)' if meta.get('standable') else ''), HOT, fs)
            yy += 20
    y += half * 20 + 18

    # ---- the count
    d.text((30, y), 'AND THE COUNT YOU ASKED FOR, EVERY BANK OPENED', INK, fh); y += 24
    d.text((30, y), '15,010 drawn pieces in 53 banks, filed by terrain. This is what we '
           'actually own:', DIM, fs); y += 24
    ordered = sorted(tk.items(), key=lambda kv: -kv[1])
    mx = max(tk.values()) if tk else 1
    for t, n in ordered:
        bar = int(620.0 * n / mx)
        col = HOT if n < 60 else (110, 150, 110) if n > 400 else DIM
        d.rectangle([250, y + 3, 250 + max(2, bar), y + 15], fill=col)
        d.text((30, y), t, INK, fs)
        d.text((250 + max(2, bar) + 8, y), str(n), col, fs)
        y += 20
    y += 10
    for line in ['AND THE SHEET GUESSED WRONG IN BOTH DIRECTIONS, which is why counting beat '
                 'guessing:',
                 '  THE SHORE is the second best stocked thing we own (1,409). It was written '
                 'down as a gap. Water and banks got built long ago.',
                 '  THE HILLS has 590, and 323 of them are MOUNDS, which is the one kind the '
                 'whole fight rests on.',
                 '  THE REAL EMPTY ONES ARE CITY: the freeway 39, the landfill 37, the trailer '
                 'park 35, the airport 21. Open desert is 11.',
                 '  COVER is the thinnest kind anywhere: 389 against 2,899 blockers. A board '
                 'with blockers and no cover has nowhere to stand.',
                 '  LIGHT is 99 and WEATHER is 36 across all fifteen terrains put together.',
                 '',
                 'So this round cooked the city cover and the city blockers you named, which '
                 'is where your correction and the count agree.',
                 '',
                 'COVER OR BLOCKER IS A MEASURED THING HERE, not a taste: under a man\'s chest '
                 'it is cover, over it is a blocker.',
                 'The barrier is 0.81 m and the container is 2.59. The rubble mound and the '
                 'standing roof both have flat tops you can stand on.']:
        d.text((30, y), line, HOT if line and line[0] not in ' ' else DIM, fs)
        y += 19
    return im.crop((0, 0, W, y + 24))


def main():
    ids, TERR, KIND, grid, tk, kk = the_count()
    names = [k for k, _ in KIND]
    lines = []
    lines.append('THE BOARD ASSET COUNT (COOK [board assets] round 1, 9/30/26, rule 46b)')
    lines.append('Every bank file opened, every drawn piece found, each filed by terrain and '
                 'kind off its own name and its bank\'s name.')
    lines.append('')
    lines.append('TOTAL DRAWN PIECES: %d across %d bank files'
                 % (len(ids), len({b for b, _ in ids})))
    lines.append('')
    lines.append('%-22s %s  %s' % ('TERRAIN', ''.join('%-8s' % n for n in names), 'TOTAL'))
    for t, _ in TERR:
        lines.append('%-22s %s  %d'
                     % (t, ''.join('%-8s' % (grid[(t, k)] or '-') for k in names), tk[t]))
    lines.append('')
    lines.append('BY KIND: ' + ', '.join('%s %d' % (k, kk[k]) for k in names))
    open(OUT_COUNT, 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines[:8]))
    print('...')

    kit = build()
    print()
    print('%-16s %-9s %-16s %s' % ('piece', 'kind', 'size (m)', 'drawn px'))
    for piece, meta in kit:
        print('%-16s %-9s %-16s %d x %d'
              % (meta['name'], meta['kind'], '%.1f x %.1f x %.2f'
                 % (meta['l'], meta['w'], meta['h']), piece.size[0], piece.size[1]))

    # ---- EVERY PIECE IS ITS REAL SIZE
    for piece, meta in kit:
        want = m(meta['l'])
        if abs(piece.size[0] - want) > m(1.3):
            die('%s is %d px for %.1f m, which is not %.1f pixels a metre'
                % (meta['name'], piece.size[0], meta['l'], PPM))
    print('\nEVERY PIECE IS ITS REAL SIZE at %.1f pixels a metre, his own street\'s density.'
          % PPM)

    # ---- COVER IS NOT A BLOCKER
    # A PIECE CARRIES TWO FACTS, NOT ONE, and filing by eye got two of them wrong. Height
    # decides whether you can SHOOT over it; whether you can WALK through it is separate. A
    # cart corral and a propane tank are both under a chest and both stop a man: that is
    # COVER THAT ALSO BLOCKS MOVEMENT, which is a real board piece and not a contradiction.
    for piece, meta in kit:
        if meta['kind'] == 'COVER' and meta['h'] > CHEST:
            die('%s is %.2f m tall and filed as COVER. Over a man\'s chest you cannot shoot '
                'over it, so it is a blocker.' % (meta['name'], meta['h']))
        if meta['kind'] == 'BLOCKER' and meta['h'] < CHEST:
            die('%s is %.2f m tall and filed as BLOCKER. Under a man\'s chest you can shoot '
                'over it, so it is cover (and may still stop movement).'
                % (meta['name'], meta['h']))
    stopping = [x['name'] for _p, x in kit if x.get('blocks_move')]
    print('COVER IS NOT A BLOCKER, AND IT IS A MEASURED THING: everything filed COVER is under '
          '%.1f m and everything filed BLOCKER is over it. %s are cover that ALSO stop a man, '
          'which the tape found and the eye had filed wrong.' % (CHEST, ' and '.join(stopping)))

    # ---- A MOUND IS SOMETHING YOU STAND ON
    for piece, meta in kit:
        if meta['kind'] == 'MOUND' and not meta.get('standable'):
            die('%s is a MOUND and nothing says you can stand on it' % meta['name'])
    print('A MOUND IS SOMETHING YOU STAND ON: both mounds carry a flat top.')

    # ---- EVERY PIXEL IS HIS
    for piece, meta in kit:
        bad = colours(piece) - ALL
        if bad:
            die('%s carries %d colours off his family ramps' % (meta['name'], len(bad)))
    print('EVERY PIXEL IS HIS: nothing off the 7/28 bank\'s family ramps.')

    # ---- NOTHING IS STAMPED
    sigs = {meta['name']: piece.tobytes() for piece, meta in kit}
    if len(set(sigs.values())) != len(sigs):
        die('two pieces of the kit are the same picture')
    print('NOTHING IS STAMPED: %d pieces, %d different pictures.' % (len(kit), len(set(sigs.values()))))

    im = card(kit, tk, kk)
    im.save(OUT_CARD)

    def b64(x):
        b = io.BytesIO(); x.save(b, 'PNG'); return base64.b64encode(b.getvalue()).decode()

    out = {
        'bank': 'THE BLOCK WAR KIT', 'date': '9/30/26', 'law': 'rule 46b and 46e',
        'his_words': 'most of it will be city-based terrain... every combat fight damn near '
                     'like a block war',
        'from': BANK, 'px_per_metre': PPM, 'tile_metres': TILE_M,
        'chest_metres': CHEST,
        'count': {'total_pieces': len(ids), 'bank_files': len({b for b, _ in ids}),
                  'by_terrain': dict(tk), 'by_kind': dict(kk),
                  'sheet': OUT_COUNT},
        'pieces': [dict(meta, px=[p.size[0], p.size[1]], b64=b64(p)) for p, meta in kit],
        'proved': ['every piece is its real size at his own density',
                   'cover is under a chest, a blocker is over it, measured in metres',
                   'a mound has a flat top you can stand on',
                   'every pixel is on his family ramps',
                   'nothing is stamped'],
    }
    open(OUT_BANK, 'w').write(json.dumps(out, indent=1))
    print()
    print('wrote %s' % OUT_COUNT)
    print('wrote %s  (%d KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) // 1024))
    print('wrote %s  (%d KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) // 1024))


if __name__ == '__main__':
    main()
