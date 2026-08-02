#!/usr/bin/env python3
"""
BOHEMIA — THE OPENINGS: WINDOW, BOARDED, GARAGE (8/2/26)

The last old art on the house. Everything else on the block is textured; the window,
the boarded window and the garage bay were still flat tan target-set tiles sitting in a
textured wall.

REUSE CHECK: PURCHASED LIBRARIES WALKED. banks/BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt was
decoded and viewed at size (all 105 candidates): its window tiles are "5. Windows and
observation panels" - LEADED CASTLE GLASS and SCI-FI VIEWPORTS. Nothing purchased is a
Las Vegas tract-house window or a domestic roll-up garage door, so this is the legal
painted branch under clause 5 of BOUGHT BEATS PAINTED. It also reuses this lane's own
approved work rather than starting over: the wall behind every opening is whatever skin
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt gave that house.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER a hard 1px black keyline - honoured. Every edge here is a real architectural
    edge doing a job: the head is a SHADOW, the sill is a LIT surface, the jamb is a
    REVEAL. None of them traces the shape; they describe how light hits a hole.
  NEVER a bare undressed rectangle - honoured, and it is the whole risk of this cook.
    A dark rectangle IS the failure mode for a window, so every opening carries reveal,
    head, sill, sill-drip grime, and a muntin dividing the pane.
  DEAD-DARK GLASS / 12% CLUSTERED POWER - honoured and load-bearing. The pane is
    near-black with ONE weak sky reflection near the head. A lit window would be the
    single most off-canon thing in this file: this city runs on 12% power and nobody is
    home.
  NEVER purple outside the Amalgamation - honoured; every colour here is a desert
    neutral or the cold grey of a dead pane.

*** THEY ARE OVERLAYS WITH ALPHA, NOT NEW WHOLE TILES, AND THAT IS THE WHOLE DESIGN. ***
The run picks ONE wall skin per house out of fifteen (his wall law: one design per plot,
variety between plots). A window baked as its own complete tile can only ever carry ONE
of those fifteen walls, so fourteen houses out of fifteen would show a window in the
wrong stucco - which is exactly the flat-tan mismatch this work exists to remove, just
subtler and harder to spot. Drawing the opening as a transparent overlay ON TOP of
whatever skin that house already wears makes it match for free, forever, including for
skins cooked later.

WHAT MAKES AN OPENING READ AS A HOLE RATHER THAN A DARK RECTANGLE
  REVEAL     the wall has thickness, so the jamb is visible down one side
  HEAD       the top of the opening is in shadow, hard and dark
  SILL       the bottom catches sky and is the lightest thing on the tile
  DEAD GLASS act-1 runs on 12% power. A lit window would be a lie about the world, so
             the pane is near-black with one weak sky reflection near the top.
  GRIME      thirty years of dust runs DOWN from the sill, not up

  python3 tools/bohemia_opening_cook.py
    -> banks/BOHEMIA_OPENINGS_8_2_26.txt
    -> records/target/OPENINGS.png
"""
import base64
import importlib.util
import io
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    'texcook', os.path.join(REPO, 'tools', 'bohemia_texture_match_cook.py'))
TEX = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(TEX)

CELL = 44
OUT = 'banks/BOHEMIA_OPENINGS_8_2_26.txt'
SHEET = 'records/target/OPENINGS.png'

DARK = (18, 17, 17)          # the unlit inside
SKY = (54, 60, 68)           # the one weak reflection a dead pane still gives
SILL = (176, 170, 158)       # catches the sky, lightest thing on the tile
JAMB = (104, 100, 94)
HEAD = (30, 29, 28)


def blank():
    return Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))


def rect(d, x0, y0, x1, y1, c):
    d.rectangle([x0, y0, x1, y1], fill=c)


def frame(im, d, x0, y0, x1, y1, rnd):
    """the thing that makes it a HOLE: reveal, head shadow, lit sill."""
    rect(d, x0, y0, x1, y1, DARK + (255,))
    for x in range(x0, x1 + 1):                       # HEAD, hard and dark
        for k in range(3):
            im.putpixel((x, y0 + k), HEAD + (255,))
    for y in range(y0, y1 + 1):                       # REVEAL down the left jamb
        for k in range(2):
            im.putpixel((x0 + k, y), tuple(int(c * 0.78) for c in JAMB) + (255,))
    for y in range(y0, y1 + 1):
        im.putpixel((x1, y), tuple(int(c * 0.55) for c in JAMB) + (255,))
    for x in range(x0 - 1, x1 + 2):                   # SILL, and it oversails
        if 0 <= x < CELL and y1 + 1 < CELL:
            im.putpixel((x, y1), SILL + (255,))
            v = tuple(int(c * 0.62) for c in SILL)
            im.putpixel((x, y1 + 1), v + (255,))
    for _ in range(90):                               # dust running DOWN off the sill
        x = int(rnd.r(x0, x1))
        for k in range(int(rnd.r(1, 9))):
            y = y1 + 2 + k
            if y < CELL:
                im.putpixel((x, y), (92, 86, 76, int(rnd.r(40, 120))))


def pane(im, d, x0, y0, x1, y1, rnd):
    """DEAD GLASS. One weak sky reflection near the head, then nothing."""
    for y in range(y0 + 3, y1):
        for x in range(x0 + 2, x1):
            t = (y - y0) / max(y1 - y0, 1)
            if t < 0.34 and rnd.f() < 0.55 - t:
                c = tuple(int(DARK[i] + (SKY[i] - DARK[i]) * rnd.r(0.25, 0.8))
                          for i in range(3))
                im.putpixel((x, y), c + (255,))
    # the muntin: a domestic window is divided, and it survives at this size
    mx = (x0 + x1) // 2
    for y in range(y0 + 3, y1):
        im.putpixel((mx, y), (58, 55, 52, 255))


def cook_window(rnd):
    im = blank()
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = 8, 9, 35, 32
    frame(im, d, x0, y0, x1, y1, rnd)
    pane(im, d, x0, y0, x1, y1, rnd)
    return im, 'wall_window', 'a domestic window: reveal, head shadow, lit sill, dead glass with one sky reflection'


def cook_boarded(rnd):
    im = blank()
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = 8, 9, 35, 32
    frame(im, d, x0, y0, x1, y1, rnd)
    # PLYWOOD, nailed on at an angle, because nobody measured
    y = y0 + 3
    while y < y1 - 1:
        h = int(rnd.r(3, 6))
        tilt = rnd.r(-0.10, 0.10)
        base = int(rnd.r(96, 138))
        for yy in range(h):
            for x in range(x0 + 1, x1):
                py = y + yy + int((x - x0) * tilt)
                if y0 + 2 < py < y1:
                    g = base + int(rnd.r(-14, 14)) - (10 if yy == 0 else 0)
                    im.putpixel((x, py), (g, int(g * 0.86), int(g * 0.64), 255))
        for nx in (x0 + 3, x1 - 3):                   # the nails
            py = y + h // 2 + int((nx - x0) * tilt)
            if y0 + 2 < py < y1:
                im.putpixel((nx, py), (52, 48, 44, 255))
        y += h + int(rnd.r(0, 2))
    return im, 'wall_boarded', 'the same opening with plywood nailed over it, boards at an angle because nobody measured'


def cook_garage_top(rnd):
    """The roll-up door stacked in its header, over the top of an open bay."""
    im = blank()
    d = ImageDraw.Draw(im)
    rect(d, 0, 0, CELL - 1, CELL - 1, DARK + (255,))
    for x in range(CELL):                             # the header lintel
        for k in range(2):
            im.putpixel((x, k), HEAD + (255,))
    y = 2
    while y < 17:                                     # the curtain, coiled
        g = int(rnd.r(120, 168))
        for x in range(CELL):
            im.putpixel((x, y), (g, int(g * 0.96), int(g * 0.88), 255))
            im.putpixel((x, y + 1), (int(g * 0.52), int(g * 0.50), int(g * 0.46), 255))
        y += int(rnd.r(3, 5))
    for y in range(18, CELL):                         # the dark bay below it
        for x in range(CELL):
            v = 20 + int(rnd.r(-4, 5))
            im.putpixel((x, y), (v, v - 1, v - 2, 255))
    return im, 'garage_top', 'the roll-up door coiled in its header over a dark bay'


def cook_garage_bottom(rnd):
    im = blank()
    d = ImageDraw.Draw(im)
    for y in range(CELL):
        for x in range(CELL):
            v = 20 + int(rnd.r(-4, 5))
            im.putpixel((x, y), (v, v - 1, v - 2, 255))
    for y in range(CELL - 5, CELL):                   # the apron lip, catching sky
        t = (y - (CELL - 5)) / 4.0
        for x in range(CELL):
            g = int(96 + t * 74 + rnd.r(-12, 12))
            im.putpixel((x, y), (g, int(g * 0.97), int(g * 0.90), 255))
    for _ in range(40):                               # oil, thirty years of it
        x, y = int(rnd.r(4, CELL - 4)), int(rnd.r(CELL - 16, CELL - 6))
        im.putpixel((x, y), (12, 11, 11, 255))
    return im, 'garage_bottom', 'the empty bay and its concrete apron, with the oil still on it'


def jamb(src, side):
    """the bay's side wall: the same tile with a lit reveal down one edge"""
    im = src.copy()
    for y in range(CELL):
        for k in range(3):
            x = k if side == 'l' else CELL - 1 - k
            b = im.getpixel((x, y))
            f = 1.9 - k * 0.35 if side == 'l' else 1.35 - k * 0.25
            im.putpixel((x, y), (min(255, int(b[0] * f)), min(255, int(b[1] * f)),
                                 min(255, int(b[2] * f)), 255))
    return im


def b64(im):
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


def main():
    rnd = TEX.Rnd(20260802)
    tiles = []
    for fn in (cook_window, cook_boarded, cook_garage_top, cook_garage_bottom):
        im, tid, why = fn(rnd)
        tiles.append((tid, im, why))
    gt = dict(tiles)[  'garage_top'] if False else None
    top = next(t for t in tiles if t[0] == 'garage_top')[1]
    bot = next(t for t in tiles if t[0] == 'garage_bottom')[1]
    for side in ('l', 'r'):
        tiles.append(('garage_top_' + side, jamb(top, side),
                      'the %s jamb of the bay, top half' % side))
        tiles.append(('garage_bottom_' + side, jamb(bot, side),
                      'the %s jamb of the bay, bottom half' % side))

    S = 150
    sheet = Image.new('RGB', (S * len(tiles), S + 18), (26, 26, 30))
    dr = ImageDraw.Draw(sheet)
    wall = None
    tb = json.load(open('banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt'))
    w = next(t for t in tb['tiles'] if t['id'] == 'stucco_tan_0')
    wall = Image.open(io.BytesIO(base64.b64decode(w['b64']))).convert('RGBA')
    for i, (tid, im, why) in enumerate(tiles):
        comp = wall.copy()                            # SHOWN OVER A REAL WALL SKIN,
        comp.alpha_composite(im)                      # because that is how it draws
        sheet.paste(comp.convert('RGB').resize((S, S), Image.NEAREST), (i * S, 0))
        dr.text((i * S + 3, S + 4), tid, fill=(220, 220, 220))
    sheet.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_OPENINGS_v1',
        'date': '2026-08-02',
        'note': 'OVERLAYS WITH ALPHA, drawn ON TOP of whatever wall skin a house wears. '
                'Baking them as whole tiles would lock each opening to one of the fifteen '
                'wall skins, so fourteen houses in fifteen would show a window in the '
                'wrong stucco.',
        'status': 'PENDING PAOLO',
        'tiles': [dict(id=t, why=w2, b64=b64(i)) for t, i, w2 in tiles],
    }, open(OUT, 'w'))

    print('COOKED %d opening overlays' % len(tiles))
    for t, _i, w2 in tiles:
        print('  %-18s %s' % (t, w2[:62]))
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)


if __name__ == '__main__':
    main()
