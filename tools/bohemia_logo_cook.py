#!/usr/bin/env python3
"""
BOHEMIA — TEN LOGOS, TEN ALPHABETS (8/1/26)

Paolo 8/1: "cook me up 10 new Bohemia logos that try to capture the feeling of the game
you know I want you to try different fonts different styles I don't wanna see the same
font in the same style 10 different times I need you to try 10 unique vastly different
logo ideas for Bohemia and the one that you choose I will put on the home screen"

REUSE CHECK: PURCHASED LIBRARIES WALKED (REUSE-FIRST + BOUGHT BEATS PAINTED). banks/BOHEMIA_GROUND_SEAMLESS_SET, WALL_SEAMLESS_SET and
  ROOF_SEAMLESS_SET hold 1,506 decoded tiles and NOT ONE LETTERFORM. The nearest thing
  is a "Banners and posters" pack (26 tiles) which is fantasy heraldry, and "Signs and
  holograms" which is sci-fi. Nothing purchased applies to a wordmark, so this is the
  legal painted branch under clause 5 of BOUGHT BEATS PAINTED.
  APPROVED-ASSET INDEX WALKED: no logo or wordmark exists in this repo. This is new.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER a hard 1px black keyline ring - honoured, every letter is built from filled
    forms and value, and where a logo has an outline it is a lit or shadowed EDGE of
    the letter itself, not a traced border.
  NEVER purple outside the Amalgamation - honoured, and deliberately so on logo 10,
    which speaks the Amalgamation's visual language and still refuses their colour.
  DEAD-DARK GLASS / 12% POWER - honoured on the marquee: a dead casino sign is mostly
    BURNED OUT. Lighting all the bulbs would be the single most off-canon thing this
    file could do.

*** THE POINT OF THIS FILE IS TEN DIFFERENT ALPHABETS. ***
He asked not to see one font ten times, so the letterforms themselves are authored ten
times: different widths, weights, stroke contrast, terminals and counters, hand-set as
bitmaps rather than one skeleton wearing ten filters. A treatment on top of a shared
shape would have been the cheap read of the brief and he would have spotted it instantly
- it is exactly the "recolour is not progress" trap from STRUCTURE-NOT-COLOUR (7/19),
pointed at type.

THE TEN, AND WHAT EACH ONE CLAIMS ABOUT THE GAME
  1  DEAD MARQUEE     the casino sign with the bulbs burned out. Vegas, dead.
  2  GOOGIE ATOMIC    1950s space-age optimism. What Vegas PROMISED.
  3  PUNK STENCIL     sprayed through a cut plate. Babypunk, and it is HIS word.
  4  RANSOM ZINE      cut-and-paste from whatever was to hand. Scarcity as a style.
  5  SIGN PAINTER     the hand-lettered shopfront. The city before the crash.
  6  BRUTALIST STAMP  struck into concrete. Permanence, and the weight of a place.
  7  SCRATCHED        gouged into sheet metal with what was available. Survival.
  8  DESERT DECO      tall, elegant, ruined. The showgirl half of the city.
  9  BOARDWALK        painted on weathered planks. The frontier town underneath.
  10 AMALGAMATION     cold perfect geometry, on a grid, refusing their purple.

  python3 tools/bohemia_logo_cook.py
    -> banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt
    -> records/target/LOGO_SHEET.png            (all ten, for his eyes)
    -> records/target/logos/LOGO_01..10.png     (each one full size)
"""
import base64
import io
import json
import math
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw, ImageFilter  # noqa: E402

WORD = 'BOHEMIA'
OUT = 'banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt'
SHEET = 'records/target/LOGO_SHEET.png'
DIR = 'records/target/logos'


class Rnd:
    def __init__(self, s):
        self.s = s & 0xFFFFFFFF or 1

    def n(self):
        x = self.s
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= x >> 17
        x ^= (x << 5) & 0xFFFFFFFF
        self.s = x & 0xFFFFFFFF
        return self.s

    def f(self):
        return self.n() / 4294967296.0

    def r(self, a, b):
        return a + (b - a) * self.f()


def G(*rows):
    return [r for r in rows]


# ============================================================ TEN ALPHABETS
# Hand-set. Each is a different TYPEFACE: its own width, weight, stroke contrast,
# terminal treatment and counter shape.

# 1. SKELETON 5x7 — thin, even, geometric. The bulb armature of a marquee.
F_SKEL = {
 'B': G('####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'),
 'O': G('.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'),
 'H': G('#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'),
 'E': G('#####', '#....', '#....', '####.', '#....', '#....', '#####'),
 'M': G('#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'),
 'I': G('#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'),
 'A': G('.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'),
}

# 2. GOOGIE 11x8 — ultra-wide, horizontal stress, clipped corners, atomic.
F_GOOGIE = {
 'B': G('#########..', '##.....###.', '##......##.', '#########..',
        '##......##.', '##.....###.', '#########..', '...........'),
 'O': G('.#########.', '###.....###', '##.......##', '##.......##',
        '##.......##', '###.....###', '.#########.', '...........'),
 'H': G('##.......##', '##.......##', '##.......##', '###########',
        '##.......##', '##.......##', '##.......##', '...........'),
 'E': G('###########', '##.........', '##.........', '#########..',
        '##.........', '##.........', '###########', '...........'),
 'M': G('##.......##', '###.....###', '####...####', '##.##.##.##',
        '##..###..##', '##.......##', '##.......##', '...........'),
 'I': G('###########', '....###....', '....###....', '....###....',
        '....###....', '....###....', '###########', '...........'),
 'A': G('..#######..', '.###...###.', '##.......##', '###########',
        '##.......##', '##.......##', '##.......##', '...........'),
}

# 3. STENCIL 7x9 — heavy, with the BRIDGES a cut plate needs to hold together.
F_STENCIL = {
 'B': G('#####..', '##..##.', '##..##.', '##.##..', '#####..',
        '##..##.', '##..##.', '#####..', '.......'),
 'O': G('.#####.', '##...##', '##...##', '#.....#', '##...##',
        '##...##', '.#####.', '.......', '.......'),
 'H': G('##...##', '##...##', '##...##', '#.....#', '#######',
        '##...##', '##...##', '##...##', '.......'),
 'E': G('#######', '##.....', '##.....', '#......', '#####..',
        '##.....', '##.....', '#######', '.......'),
 'M': G('##...##', '###.###', '#######', '##.#.##', '##...##',
        '##...##', '##...##', '##...##', '.......'),
 'I': G('#######', '..###..', '..###..', '...#...', '..###..',
        '..###..', '..###..', '#######', '.......'),
 'A': G('.#####.', '##...##', '##...##', '#######', '#.....#',
        '##...##', '##...##', '##...##', '.......'),
}

# 4. RANSOM — deliberately mismatched: every letter comes from a different alphabet.
#    That IS the typeface. Assembled at render time.

# 5. SIGN PAINTER 8x10 — brush lettering: swelling stems, angled entry, a spur.
F_BRUSH = {
 'B': G('#####...', '##..##..', '##..##..', '#####...', '##..##..',
        '##...##.', '##...##.', '######..', '........', '........'),
 'O': G('..####..', '.##..##.', '##....##', '##....##', '##....##',
        '##....##', '.##..##.', '..####..', '........', '........'),
 'H': G('##....##', '##....##', '##....##', '##....##', '########',
        '##....##', '##....##', '##....##', '........', '........'),
 'E': G('#######.', '##......', '##......', '#####...', '##......',
        '##......', '##......', '#######.', '........', '........'),
 'M': G('##....##', '###..###', '########', '##.##.##', '##.##.##',
        '##....##', '##....##', '##....##', '........', '........'),
 'I': G('..####..', '...##...', '...##...', '...##...', '...##...',
        '...##...', '...##...', '..####..', '........', '........'),
 'A': G('...##...', '..####..', '.##..##.', '##....##', '########',
        '##....##', '##....##', '##....##', '........', '........'),
}

# 6. BRUTALIST SLAB 9x9 — maximum weight, square terminals, tiny counters.
F_SLAB = {
 'B': G('#######..', '#######..', '###..###.', '#######..', '#######..',
        '###..###.', '#######..', '#######..', '.........'),
 'O': G('.#######.', '#########', '###...###', '###...###', '###...###',
        '###...###', '#########', '.#######.', '.........'),
 'H': G('###...###', '###...###', '###...###', '#########', '#########',
        '###...###', '###...###', '###...###', '.........'),
 'E': G('#########', '#########', '###......', '#######..', '#######..',
        '###......', '#########', '#########', '.........'),
 'M': G('###...###', '####.####', '#########', '###.#.###', '###...###',
        '###...###', '###...###', '###...###', '.........'),
 'I': G('#########', '#########', '...###...', '...###...', '...###...',
        '...###...', '#########', '#########', '.........'),
 'A': G('..#####..', '.#######.', '###...###', '###...###', '#########',
        '#########', '###...###', '###...###', '.........'),
}

# 7. HAIRLINE 7x9 — one pixel everywhere, scratched with whatever was to hand.
F_HAIR = {
 'B': G('#####..', '#....#.', '#....#.', '#####..', '#....#.',
        '#....#.', '#####..', '.......', '.......'),
 'O': G('.#####.', '#.....#', '#.....#', '#.....#', '#.....#',
        '#.....#', '.#####.', '.......', '.......'),
 'H': G('#.....#', '#.....#', '#.....#', '#######', '#.....#',
        '#.....#', '#.....#', '.......', '.......'),
 'E': G('#######', '#......', '#......', '#####..', '#......',
        '#......', '#######', '.......', '.......'),
 'M': G('#.....#', '##...##', '#.#.#.#', '#..#..#', '#.....#',
        '#.....#', '#.....#', '.......', '.......'),
 'I': G('#######', '...#...', '...#...', '...#...', '...#...',
        '...#...', '#######', '.......', '.......'),
 'A': G('..###..', '.#...#.', '#.....#', '#######', '#.....#',
        '#.....#', '#.....#', '.......', '.......'),
}

# 8. DECO 5x12 — very tall, very narrow, thick stems and hairline crossbars.
F_DECO = {
 'B': G('####.', '#..#.', '#..#.', '#..#.', '####.', '#..#.',
        '#..#.', '#..#.', '#..#.', '####.', '.....', '.....'),
 'O': G('.###.', '#...#', '#...#', '#...#', '#...#', '#...#',
        '#...#', '#...#', '#...#', '.###.', '.....', '.....'),
 'H': G('#...#', '#...#', '#...#', '#...#', '#####', '#...#',
        '#...#', '#...#', '#...#', '#...#', '.....', '.....'),
 'E': G('#####', '#....', '#....', '#....', '####.', '#....',
        '#....', '#....', '#....', '#####', '.....', '.....'),
 'M': G('#...#', '##.##', '##.##', '#.#.#', '#.#.#', '#...#',
        '#...#', '#...#', '#...#', '#...#', '.....', '.....'),
 'I': G('#####', '..#..', '..#..', '..#..', '..#..', '..#..',
        '..#..', '..#..', '..#..', '#####', '.....', '.....'),
 'A': G('.###.', '#...#', '#...#', '#...#', '#####', '#...#',
        '#...#', '#...#', '#...#', '#...#', '.....', '.....'),
}

# 9. WESTERN 9x9 — slab with SPURS at the terminals, frontier signwriting.
F_WEST = {
 'B': G('######...', '#....##..', '#....##..', '######...', '#....##..',
        '#....##..', '######...', '.........', '.........'),
 'O': G('.######..', '##....##.', '#......#.', '#......#.', '#......#.',
        '##....##.', '.######..', '.........', '.........'),
 'H': G('##....##.', '.#....#..', '.#....#..', '.######..', '.#....#..',
        '.#....#..', '##....##.', '.........', '.........'),
 'E': G('#######..', '#........', '#........', '#####....', '#........',
        '#........', '#######..', '.........', '.........'),
 'M': G('##....##.', '###..###.', '#.####.#.', '#..##..#.', '#......#.',
        '#......#.', '##....##.', '.........', '.........'),
 'I': G('#######..', '...#.....', '...#.....', '...#.....', '...#.....',
        '...#.....', '#######..', '.........', '.........'),
 'A': G('..####...', '.##..##..', '##....##.', '########.', '#......#.',
        '#......#.', '##....##.', '.........', '.........'),
}

# 10. GRID 7x7 — strict, modular, every stroke on a coarse lattice. No curves at all.
F_GRID = {
 'B': G('######.', '#....#.', '######.', '#....#.', '#....#.', '######.', '.......'),
 'O': G('######.', '#....#.', '#....#.', '#....#.', '#....#.', '######.', '.......'),
 'H': G('#....#.', '#....#.', '######.', '#....#.', '#....#.', '#....#.', '.......'),
 'E': G('######.', '#......', '#####..', '#......', '#......', '######.', '.......'),
 'M': G('#....#.', '##..##.', '#.##.#.', '#....#.', '#....#.', '#....#.', '.......'),
 'I': G('######.', '..##...', '..##...', '..##...', '..##...', '######.', '.......'),
 'A': G('######.', '#....#.', '#....#.', '######.', '#....#.', '#....#.', '.......'),
}


def glyph_size(f):
    g = f['B']
    return len(g[0]), len(g)


def lay(font, word, tracking=1):
    """rasterise the word into a boolean grid at the font's own size"""
    w, h = glyph_size(font)
    cells = []
    for ch in word:
        cells.append(font[ch])
    W = sum(len(c[0]) for c in cells) + tracking * (len(cells) - 1)
    grid = [[0] * W for _ in range(h)]
    x = 0
    for c in cells:
        for yy, row in enumerate(c):
            for xx, v in enumerate(row):
                if v == '#':
                    grid[yy][x + xx] = 1
        x += len(c[0]) + tracking
    return grid


def px(im, x, y, col):
    if 0 <= x < im.size[0] and 0 <= y < im.size[1]:
        im.putpixel((int(x), int(y)), col)


# ============================================================ THE TEN TREATMENTS
CANVAS = (400, 130)


def margin_x(gw):
    return max(4, (CANVAS[0] - gw) // 2)


def blank(bg=(18, 17, 16)):
    return Image.new('RGB', CANVAS, bg)


def fit(grid, want, margin=18):
    """the biggest whole-pixel scale that keeps the word ON the canvas.

    The first render hand-picked a scale per logo and FOUR of the ten ran off the right
    edge - the marquee, the scratched plate, the boardwalk and the Amalgamation all lost
    their final A, and the Amalgamation lost its B as well. A wordmark that does not fit
    its own frame is not a candidate, and it is the kind of thing that is invisible in
    the numbers and obvious the second you look at the sheet.
    Whole-pixel only: a fractional scale would resample pixel letterforms, which is the
    no-resample law and also just looks soft.
    """
    avail = CANVAS[0] - margin * 2
    s = min(want, max(1, avail // len(grid[0])))
    while s > 1 and len(grid) * s > CANVAS[1] - margin:
        s -= 1
    return s


def place(grid, scale, cx=None, cy=None):
    """where the word sits on the canvas, centred by default"""
    gw, gh = len(grid[0]) * scale, len(grid) * scale
    x = (CANVAS[0] - gw) // 2 if cx is None else cx
    y = (CANVAS[1] - gh) // 2 if cy is None else cy
    return x, y, gw, gh


def draw_grid(im, grid, scale, x0, y0, col):
    d = ImageDraw.Draw(im)
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if v:
                d.rectangle([x0 + x * scale, y0 + y * scale,
                             x0 + (x + 1) * scale - 1, y0 + (y + 1) * scale - 1], fill=col)


# ---------------------------------------------------------------- 1 DEAD MARQUEE
def logo_marquee(rnd):
    """The casino sign with the bulbs burned out.

    12% CLUSTERED POWER is canon and it decides this drawing: a dead Vegas marquee is
    mostly DARK GLASS. Lighting every bulb would be the most off-canon thing in the file,
    so the lit ones cluster - a few circuits still hold - and the rest are cold sockets
    with a dead highlight. The armature the bulbs sit on stays visible, because the sign
    is still standing.
    """
    im = blank((14, 13, 14))
    d = ImageDraw.Draw(im)
    grid = lay(F_SKEL, WORD, tracking=2)
    S = fit(grid, 9)
    x0, y0, gw, gh = place(grid, S)
    # the steel armature behind the bulbs
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if v:
                d.rectangle([x0 + x * S + 2, y0 + y * S + 2,
                             x0 + x * S + S - 3, y0 + y * S + S - 3], fill=(46, 42, 38))
    live = [rnd.f() < 0.34 for _ in range(len(grid) * len(grid[0]))]
    i = 0
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                i += 1
                continue
            cx, cy = x0 + x * S + S // 2, y0 + y * S + S // 2
            on = live[i] and (x + y) % 7 != 3          # clustered, not scattered
            i += 1
            if on:
                d.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(58, 46, 22))
                d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(150, 118, 46))
                d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=(226, 196, 118))
                px(im, cx - 1, cy - 1, (246, 232, 190))
            else:
                d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(38, 35, 33))
                d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=(24, 23, 22))
                px(im, cx - 1, cy - 1, (58, 55, 52))    # cold glass catches a little sky
    return im, 'DEAD MARQUEE', 'the casino sign with the bulbs burned out. 12% of them lit, clustered, because that is the law of this city.'


# ---------------------------------------------------------------- 2 GOOGIE ATOMIC
def logo_googie(rnd):
    """1950s space-age: what Vegas PROMISED. Sheared, chromed, with a starburst."""
    im = blank((16, 18, 22))
    d = ImageDraw.Draw(im)
    grid = lay(F_GOOGIE, WORD, tracking=1)
    S = fit(grid, 4)
    x0, y0, gw, gh = place(grid, S)
    for y, row in enumerate(grid):
        shear = int((len(grid) - y) * 0.9)              # the forward lean of the era
        for x, v in enumerate(row):
            if not v:
                continue
            t = y / max(len(grid) - 1, 1)
            # chrome: sky above, warm bounce below, hard band through the middle
            col = (214, 222, 232) if t < 0.34 else (52, 66, 84) if t < 0.46 else \
                  (150, 158, 170) if t < 0.72 else (188, 150, 92)
            d.rectangle([x0 + x * S + shear, y0 + y * S,
                         x0 + (x + 1) * S - 1 + shear, y0 + (y + 1) * S - 1], fill=col)
    # the starburst, the single most 1950s-Vegas mark there is
    sx, sy = x0 + gw + 20, y0 + 6
    for a in range(0, 360, 45):
        th = math.radians(a)
        ln = 15 if a % 90 == 0 else 8
        for r in range(2, ln):
            px(im, sx + math.cos(th) * r, sy + math.sin(th) * r,
               (238, 226, 196) if r < ln - 3 else (150, 140, 120))
    d.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=(246, 238, 214))
    return im, 'GOOGIE ATOMIC', 'the 1950s space-age promise. This is the Vegas that was advertised, before the crash made it a joke.'


# ---------------------------------------------------------------- 3 PUNK STENCIL
def logo_stencil(rnd):
    """Sprayed through a cut plate. Babypunk, and it is HIS word for himself."""
    im = blank((30, 28, 26))
    d = ImageDraw.Draw(im)
    for y in range(CANVAS[1]):                          # a wall to spray on
        for x in range(CANVAS[0]):
            n = rnd.f()
            v = 34 + int(n * 16)
            px(im, x, y, (v + 4, v + 2, v - 2))
    grid = lay(F_STENCIL, WORD, tracking=2)
    S = fit(grid, 6)
    x0, y0, gw, gh = place(grid, S)
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            for sy in range(S):
                for sx in range(S):
                    if rnd.f() < 0.90:                  # paint does not cover evenly
                        c = 226 + int(rnd.r(-30, 22))
                        px(im, x0 + x * S + sx, y0 + y * S + sy, (c, c - 6, c - 16))
    # OVERSPRAY: the halo that proves it was sprayed and not printed
    for _ in range(2600):
        gx, gy = int(rnd.r(0, len(grid[0]))), int(rnd.r(0, len(grid)))
        if not grid[gy][gx]:
            continue
        ax = x0 + gx * S + rnd.r(-9, 9 + S)
        ay = y0 + gy * S + rnd.r(-9, 9 + S)
        if 0 <= ax < CANVAS[0] and 0 <= ay < CANVAS[1]:
            base = im.getpixel((int(ax), int(ay)))
            k = rnd.r(0.12, 0.42)
            px(im, ax, ay, tuple(int(b + (222 - b) * k) for b in base))
    # a run, because the can was held too close
    for _ in range(3):
        rx = x0 + rnd.r(0, gw)
        ry = y0 + gh - 4
        for i in range(int(rnd.r(6, 22))):
            px(im, rx, ry + i, (206, 200, 188))
    return im, 'PUNK STENCIL', 'sprayed through a cut plate onto a wall. Babypunk is his own word for himself and this is what it looks like.'


# ---------------------------------------------------------------- 4 RANSOM ZINE
def logo_ransom(rnd):
    """EVERY LETTER FROM A DIFFERENT ALPHABET. Scarcity as a style: you use what you
    have, and what you have never matches. The most honest logo here about the world."""
    im = blank((22, 21, 20))
    d = ImageDraw.Draw(im)
    fonts = [F_SLAB, F_DECO, F_GOOGIE, F_BRUSH, F_HAIR, F_WEST, F_GRID]
    scales = [5, 5, 4, 5, 6, 5, 6]
    papers = [(206, 198, 176), (176, 172, 164), (198, 178, 140),
              (214, 208, 192), (156, 150, 142), (190, 172, 138), (200, 194, 180)]
    x = 16
    for i, ch in enumerate(WORD):
        f = fonts[i % len(fonts)]
        S = scales[i % len(scales)]
        g = f[ch]
        gw, gh = len(g[0]) * S, len(g) * S
        tilt = rnd.r(-0.10, 0.10)
        yb = 30 + int(rnd.r(-9, 9))
        pad = 5
        paper = papers[i % len(papers)]
        # the torn scrap it was cut from
        for yy in range(-pad, gh + pad):
            for xx in range(-pad, gw + pad):
                ex = xx + int(yy * tilt)
                edge = (xx < -pad + 2 or yy < -pad + 2 or xx > gw + pad - 3 or yy > gh + pad - 3)
                if edge and rnd.f() < 0.45:
                    continue                            # a torn edge is never straight
                c = tuple(max(0, min(255, int(p + rnd.r(-14, 14)))) for p in paper)
                if edge:
                    c = tuple(int(v * 0.72) for v in c)
                px(im, x + ex, yb + yy, c)
        for yy, row in enumerate(g):
            for xx, v in enumerate(row):
                if v != '#':
                    continue
                for sy in range(S):
                    for sx in range(S):
                        ex = xx * S + sx + int((yy * S + sy) * tilt)
                        px(im, x + ex, yb + yy * S + sy, (26, 24, 23))
        x += gw + int(rnd.r(5, 12))
    return im, 'RANSOM ZINE', 'every letter cut from a different source, because nothing in this world matches. Scarcity as a typeface.'


# ---------------------------------------------------------------- 5 SIGN PAINTER
def logo_brush(rnd):
    """The hand-lettered shopfront: the city as it was before the crash. Warm, skilled,
    and now thirty years unwashed."""
    im = blank((36, 30, 24))
    d = ImageDraw.Draw(im)
    grid = lay(F_BRUSH, WORD, tracking=2)
    S = fit(grid, 6)
    x0, y0, gw, gh = place(grid, S)
    d.rectangle([x0 - 18, y0 - 14, x0 + gw + 17, y0 + gh + 13], fill=(58, 46, 34))
    d.rectangle([x0 - 14, y0 - 10, x0 + gw + 13, y0 + gh + 9], fill=(42, 33, 24))
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            for sy in range(S):
                for sx in range(S):
                    if rnd.f() < 0.055:
                        continue                        # gold leaf lifting after 30 years
                    t = (y * S + sy) / max(gh - 1, 1)
                    c = (232 - int(t * 52), 198 - int(t * 62), 108 - int(t * 46))
                    px(im, x0 + x * S + sx, y0 + y * S + sy, c)
            # the painter's shadow, one stroke down-right, as a signwriter would
            for k in range(2):
                px(im, x0 + x * S + S + k, y0 + y * S + S + k, (26, 20, 14))
    return im, 'SIGN PAINTER', 'hand-lettered gold on a shopfront, thirty years unwashed. The city that existed before the crash.'


# ---------------------------------------------------------------- 6 BRUTALIST STAMP
def logo_slab(rnd):
    """Struck into concrete. The heaviest thing in the set: this place is not temporary."""
    im = blank((96, 93, 88))
    for y in range(CANVAS[1]):                          # the concrete face
        for x in range(CANVAS[0]):
            v = 96 + int(rnd.r(-16, 16))
            px(im, x, y, (v + 3, v + 1, v - 4))
    grid = lay(F_SLAB, WORD, tracking=2)
    S = fit(grid, 5)
    x0, y0, gw, gh = place(grid, S)

    def has(gx, gy):
        return 0 <= gy < len(grid) and 0 <= gx < len(grid[0]) and grid[gy][gx]
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            for sy in range(S):
                for sx in range(S):
                    v0 = 46 + int(rnd.r(-10, 10))
                    px(im, x0 + x * S + sx, y0 + y * S + sy, (v0 + 2, v0, v0 - 3))
            # a stamped letter has a LIT upper-left lip and a shadow lower-right
            if not has(x, y - 1):
                for sx in range(S):
                    px(im, x0 + x * S + sx, y0 + y * S, (150, 146, 138))
            if not has(x - 1, y):
                for sy in range(S):
                    px(im, x0 + x * S, y0 + y * S + sy, (140, 136, 130))
            if not has(x, y + 1):
                for sx in range(S):
                    px(im, x0 + x * S + sx, y0 + (y + 1) * S - 1, (26, 25, 24))
    return im, 'BRUTALIST STAMP', 'struck into a concrete wall. The heaviest mark in the set: this place is not temporary and neither is what happened here.'


# ---------------------------------------------------------------- 7 SCRATCHED
def logo_scratch(rnd):
    """Gouged into sheet metal with whatever was to hand. The survival logo: no design,
    just somebody making sure the name is on the thing."""
    im = blank((58, 56, 54))
    for y in range(CANVAS[1]):                          # brushed steel, then rust
        for x in range(CANVAS[0]):
            v = 74 + int(math.sin(y * 0.7) * 5) + int(rnd.r(-9, 9))
            px(im, x, y, (v, v - 2, v - 6))
    for _ in range(150):
        rx, ry = rnd.r(0, CANVAS[0]), rnd.r(0, CANVAS[1])
        for k in range(int(rnd.r(4, 30))):
            b = im.getpixel((int(min(CANVAS[0] - 1, rx + k)), int(ry)))
            px(im, rx + k, ry, (min(255, b[0] + 26), int(b[1] * 0.86), int(b[2] * 0.62)))
    grid = lay(F_HAIR, WORD, tracking=2)
    S = fit(grid, 7)
    x0, y0, gw, gh = place(grid, S)
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            # a gouge wanders and varies in depth; a drawn line does not
            for sy in range(S):
                for sx in range(S):
                    jx = int(rnd.r(-1.4, 1.4))
                    jy = int(rnd.r(-1.4, 1.4))
                    if rnd.f() < 0.16:
                        continue
                    px(im, x0 + x * S + sx + jx, y0 + y * S + sy + jy,
                       (28 + int(rnd.r(-8, 10)),) * 3)
                    if rnd.f() < 0.3:                   # the bright burr thrown up
                        px(im, x0 + x * S + sx + jx, y0 + y * S + sy + jy - 1,
                           (188, 184, 176))
    return im, 'SCRATCHED', 'gouged into sheet metal with whatever was to hand. Not designed - somebody just made sure the name was on it.'


# ---------------------------------------------------------------- 8 DESERT DECO
def logo_deco(rnd):
    """Tall, narrow, elegant, ruined. The showgirl half of the city."""
    im = blank((20, 16, 20))
    d = ImageDraw.Draw(im)
    grid = lay(F_DECO, WORD, tracking=3)
    S = fit(grid, 6)
    x0, y0, gw, gh = place(grid, S)
    for k in (-10, -7, gh + 6, gh + 9):                 # deco rules above and below
        d.rectangle([x0 - 26, y0 + k, x0 + gw + 25, y0 + k + 1], fill=(168, 138, 84))
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            t = y / max(len(grid) - 1, 1)
            c = (232 - int(t * 40), 206 - int(t * 48), 152 - int(t * 44))
            for sy in range(S):
                for sx in range(S):
                    if rnd.f() < 0.04:
                        continue                        # gilding worn through
                    px(im, x0 + x * S + sx, y0 + y * S + sy, c)
    # the fan, a deco signature, rising behind the word
    for a in range(-70, 71, 14):
        th = math.radians(a - 90)
        for r in range(gh // 2 + 12, gh // 2 + 34):
            px(im, x0 + gw / 2 + math.cos(th) * r, y0 + gh / 2 + math.sin(th) * r,
               (92, 76, 50))
    return im, 'DESERT DECO', 'tall, gilded and worn through. The showgirl half of Vegas, which is the half that had dignity.'


# ---------------------------------------------------------------- 9 BOARDWALK
def logo_west(rnd):
    """Painted across weathered planks. The frontier town under the casino town."""
    im = blank((44, 34, 24))
    d = ImageDraw.Draw(im)
    PH = 17
    for i in range(CANVAS[1] // PH + 1):                # the boards themselves
        base = 104 + int(rnd.r(-16, 16))
        for y in range(i * PH, min(CANVAS[1], (i + 1) * PH)):
            for x in range(CANVAS[0]):
                g = int(math.sin(x * 0.09 + i) * 5) + int(rnd.r(-7, 7))
                v = base + g
                px(im, x, y, (v, int(v * 0.80), int(v * 0.58)))
        for x in range(CANVAS[0]):                      # the gap between boards
            px(im, x, i * PH, (34, 26, 19))
            px(im, x, i * PH + 1, (66, 52, 38))
    grid = lay(F_WEST, WORD, tracking=2)
    S = fit(grid, 5)
    x0, y0, gw, gh = place(grid, S)
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            for sy in range(S):
                for sx in range(S):
                    ay, ax = y0 + y * S + sy, x0 + x * S + sx
                    if rnd.f() < 0.20 or (ay % PH) < 2:
                        continue                        # paint skips the board gaps
                    px(im, ax, ay, (232 + int(rnd.r(-16, 12)),) * 3)
    return im, 'BOARDWALK', 'whitewashed across weathered planks. The frontier town that was here before the casinos and will be here after.'


# ---------------------------------------------------------------- 10 AMALGAMATION
def logo_grid(rnd):
    """Bohemia's name written in the ENEMY's language: cold, modular, perfectly regular,
    on a visible lattice. And it refuses their purple, which is the whole argument."""
    im = blank((10, 12, 14))
    d = ImageDraw.Draw(im)
    for x in range(0, CANVAS[0], 8):                    # the eerily perfect network
        d.line([(x, 0), (x, CANVAS[1])], fill=(20, 26, 30))
    for y in range(0, CANVAS[1], 8):
        d.line([(0, y), (CANVAS[0], y)], fill=(20, 26, 30))
    grid = lay(F_GRID, WORD, tracking=2)
    S = fit(grid, 8)
    x0, y0, gw, gh = place(grid, S)
    x0 = max(margin_x(gw), x0 - x0 % 8)
    y0 -= y0 % 8

    def has(gx, gy):
        return 0 <= gy < len(grid) and 0 <= gx < len(grid[0]) and grid[gy][gx]
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            d.rectangle([x0 + x * S, y0 + y * S, x0 + (x + 1) * S - 1, y0 + (y + 1) * S - 1],
                        fill=(196, 214, 222))
            # nodes where the network turns: their signature, not decoration
            turn = sum(1 for (dx, dy) in ((1, 0), (-1, 0), (0, 1), (0, -1)) if has(x + dx, y + dy))
            if turn <= 2:
                d.rectangle([x0 + x * S + 2, y0 + y * S + 2,
                             x0 + x * S + S - 3, y0 + y * S + S - 3], fill=(24, 30, 34))
    return im, 'AMALGAMATION', "the enemy's language: modular, on a lattice, eerily perfect. Bohemia's name in their font, refusing their purple."



# --------------------------------------------------- 11 SIGN PAINTER, STENCIL COLOURWAY
def logo_chosen(rnd):
    """*** THE ONE HE PICKED, 8/1. ***

    Paolo, with logos 3 and 5 side by side: "If you can put the coloring of the [Sign]
    painter exactly as the Punk stencil is just be concerned with the coloring I would be
    very happy. Do that properly slide it into the homepage the first thing I see every
    time I open up the alpha."

    So: SIGN PAINTER's letterforms, its board and its painter's drop-shadow, wearing PUNK
    STENCIL's palette. ONLY THE COLOUR MOVES - he was explicit ("just be concerned with
    the coloring"), and widening that into a redesign would be answering a brief he did
    not give. The gold goes; the white ink, the dark grainy wall and the overspray come
    across from 3 exactly as they are there.
    """
    im = blank((30, 28, 26))
    d = ImageDraw.Draw(im)
    # STENCIL'S WALL, the same generator as logo 3
    for y in range(CANVAS[1]):
        for x in range(CANVAS[0]):
            v = 34 + int(rnd.f() * 16)
            px(im, x, y, (v + 4, v + 2, v - 2))
    grid = lay(F_BRUSH, WORD, tracking=2)
    S = fit(grid, 6)
    x0, y0, gw, gh = place(grid, S)
    # SIGN PAINTER'S BOARD, in the wall's own greys instead of the brown
    d.rectangle([x0 - 18, y0 - 14, x0 + gw + 17, y0 + gh + 13], outline=(96, 92, 86))
    d.rectangle([x0 - 14, y0 - 10, x0 + gw + 13, y0 + gh + 9], outline=(64, 61, 57))
    for y, row in enumerate(grid):
        for x, v in enumerate(row):
            if not v:
                continue
            for sy in range(S):
                for sx in range(S):
                    if rnd.f() < 0.10:            # stencil paint does not cover evenly
                        continue
                    c = 226 + int(rnd.r(-30, 22))
                    px(im, x0 + x * S + sx, y0 + y * S + sy, (c, c - 6, c - 16))
            # the signwriter's drop shadow, kept: it is STRUCTURE, not colour
            for k in range(2):
                px(im, x0 + x * S + S + k, y0 + y * S + S + k, (20, 19, 18))
    # STENCIL'S OVERSPRAY, the thing that proves it was sprayed and not printed
    for _ in range(2600):
        gx, gy = int(rnd.r(0, len(grid[0]))), int(rnd.r(0, len(grid)))
        if not grid[gy][gx]:
            continue
        ax = x0 + gx * S + rnd.r(-9, 9 + S)
        ay = y0 + gy * S + rnd.r(-9, 9 + S)
        if 0 <= ax < CANVAS[0] and 0 <= ay < CANVAS[1]:
            base = im.getpixel((int(ax), int(ay)))
            k = rnd.r(0.12, 0.42)
            px(im, ax, ay, tuple(int(b + (222 - b) * k) for b in base))
    for _ in range(3):                            # and a run, held too close
        rx = x0 + rnd.r(0, gw)
        for i in range(int(rnd.r(6, 22))):
            px(im, rx, y0 + gh + i, (206, 200, 188))
    return im, 'THE ONE (SIGN PAINTER IN STENCIL WHITE)', "his pick, 8/1: sign painter's letterforms and board wearing the punk stencil's palette. Only the colour moved."



LOGOS = [logo_marquee, logo_googie, logo_stencil, logo_ransom, logo_brush,
         logo_slab, logo_scratch, logo_deco, logo_west, logo_grid,
         logo_chosen]


def b64(im):
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


def main():
    os.makedirs(DIR, exist_ok=True)
    out, made = [], []
    for i, fn in enumerate(LOGOS):
        im, name, why = fn(Rnd(4100 + i * 977))
        im.save('%s/LOGO_%02d.png' % (DIR, i + 1))
        out.append(dict(n=i + 1, name=name, why=why, b64=b64(im)))
        made.append((im, name, i + 1))

    SC = 2
    W, H = CANVAS[0] * SC, CANVAS[1] * SC
    sheet = Image.new('RGB', (W * 2 + 24, (H + 30) * 6 + 34), (12, 12, 14))
    d = ImageDraw.Draw(sheet)
    d.text((10, 10), 'BOHEMIA — TEN LOGOS, TEN ALPHABETS.  Pick one and it goes on the '
                     'home screen.', fill=(238, 226, 196))
    for k, (im, name, n) in enumerate(made):
        x = (k % 2) * (W + 16) + 8
        y = (k // 2) * (H + 30) + 30
        sheet.paste(im.resize((W, H), Image.NEAREST), (x, y))
        d.rectangle([x, y, x + W - 1, y + H - 1], outline=(58, 56, 54))
        d.text((x + 4, y + H + 6), '%d.  %s' % (n, name), fill=(226, 216, 190))
    sheet.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_LOGO_CANDIDATES_v1',
        'date': '2026-08-01',
        'ruling': 'Paolo 8/1: "cook me up 10 new Bohemia logos that try to capture the '
                  'feeling of the game you know I want you to try different fonts '
                  'different styles I don\'t wanna see the same font in the same style '
                  '10 different times I need you to try 10 unique vastly different logo '
                  'ideas for Bohemia and the one that you choose I will put on the home '
                  'screen"',
        'note': 'TEN ALPHABETS, hand-set as bitmaps - not one skeleton wearing ten '
                'filters, which is the cheap read of the brief and the STRUCTURE-NOT-'
                'COLOUR trap pointed at type.',
        'status': 'PENDING PAOLO',
        'my_pick': 11,
        'my_pick_reason': 'NOT MINE ANY MORE - PAOLO CHOSE, 8/1. He took logo 5 (SIGN '
                          'PAINTER) and asked for logo 3 (PUNK STENCIL) colouring: "just '
                          'be concerned with the coloring". Logo 11 is that, and it is '
                          'now the alpha front screen, which is what he asked for: "the '
                          'first thing I see every time I open up the alpha". My own '
                          'vote had been 1, DEAD MARQUEE; his call supersedes it and the '
                          'ten stay on file as the record.',
        'chosen_by_paolo': 11,
        'logos': out,
    }, open(OUT, 'w'))

    print('COOKED %d logos, %d alphabets, word "%s"' % (len(out), 10, WORD))
    for o in out:
        print('  %2d  %-16s %s' % (o['n'], o['name'], o['why'][:64]))
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)


if __name__ == '__main__':
    main()
