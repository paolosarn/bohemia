#!/usr/bin/env python3
"""
BOHEMIA — THE GRIME PASS (8/3/26). THE MACHINE ONLY. THE DIAL SHIPS AT ZERO.

REUSE CHECK: PURCHASED LIBRARY WALKED FIRST. banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt
is opened and measured below (it is his bought ground: street, concrete, dirt). It holds
44x44 SURFACE tiles - complete opaque materials - and nothing in it is a transparent
overlay, which is what this needs: a layer that sits ON TOP of whatever is already there.
Blitting an opaque bought tile over the world would erase the world. So under clause 5 of
BOUGHT BEATS PAINTED this is the legal painted branch, and the measurement it is aimed at
still comes from his tiles (records/BOHEMIA_STYLE_TARGET_8_1_26.json).

WHY THIS EXISTS
Paolo 8/3, having played Machine Party: "I really love machine parties aesthetic."
The research (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md) turned up one sentence
from Mike Klubnika about how he textures, and it is the whole reason this file is here.
On Buckshot Roulette he "added dirty and grimy leaks to every corner, which BLENDS
EVERYTHING TOGETHER rather than having different objects."

That is a direct answer to the failure Paolo named himself on 7/31 looking at the yard:
TWO DIFFERENT GAMES IN ONE FRAME. Bohemia textures every tile INDEPENDENTLY, each one
measured against a density target and each one individually correct, and NOTHING CROSSES
A SEAM. Three surfaces that are each perfectly textured and share nothing are three
assets sitting next to each other. One layer of filth laid across all of them, indifferent
to where one stops and the next starts, is what makes them one place.

*** WHY IT IS A SHEET AND NOT A TILE, WHICH IS THE ENTIRE DESIGN ***
Klubnika can bake his grime into the texture because every surface in a 3D scene has its
own unique UVs. Bohemia CANNOT: a mark baked into a 44px tile repeats every 44 pixels
forever, and that is not a theory - it is the bug Paolo circled twice on 8/2 ("looks like
it's glitching out"), traced to one hero crack stamped at cell pitch down a whole wall.
Baking grime into tiles would reproduce that bug at world scale.

So the grime is ONE CONTINUOUS SHEET, PATCH_CELLS x PATCH_CELLS of them, and each cell
samples ITS OWN WINDOW into that sheet by WORLD POSITION. A stain that begins on one cell
carries on to the next because it was drawn as one stain. That is the property Klubnika
gets for free from unique UVs, bought here with a big sheet and a world-keyed sample.

*** AND THE DIAL SHIPS AT ZERO, ON PURPOSE ***
Paolo pushed back on doing this now and he was half right. There are two halves to a
grime pass: THE MACHINERY (this file plus a draw call - cheap, touches no existing art,
invalidates no verdict) and THE TUNING (how dirty the world actually is - a whole-world
art-direction call). We have ONE district type finished out of twenty-seven. Tuning a
global look against four percent of the world means tuning it twice.
So: the machine lands now, the strength constant is 0.0, the game looks EXACTLY as it
does today, and nobody spends one of his thumbs on the amount until there is a world to
judge it against. gates/grime_gate.py holds the zero.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER a hard 1px black keyline - honoured, and it is the main risk in a file that draws
    streaks. Every leak is a soft blob walked downward with per-step jitter and a fade,
    so it has no traced edge anywhere; a straight dark line down a wall would BE a
    keyline wearing a different name.
  NEVER a bare undressed rectangle - honoured; nothing here has a straight edge at all.
  NEVER purple outside the Amalgamation - honoured. Every colour is a warm desert
    neutral and grime_gate.py sweeps the sheet in HSV to prove it.
  NEVER a smooth wash over pixel art - honoured, and this is the one his own tiles
    taught. A soft alpha gradient laid over textured art reads as a LENS FILTER sitting
    on the world rather than dirt in it, so the alpha carries the same high-frequency
    grain his purchased surfaces do.
  DEAD-DARK / 12% CLUSTERED POWER - untouched; grime only ever darkens or dusts, it
    never lights anything.

WHAT IS IN THE FILTH, and every item is a thing that really happens to a dead desert city
  WIND SHADOW  thirty years of blown dust settles in broad soft fields, not evenly
  LEAKS        water finds a high point and runs DOWN, staining as it goes, and it does
               not care that it crossed onto another object on the way
  POOLING      the low corner of anything collects what the wind and the rain brought
  RUNOFF       a hard darker streak where the water ran the same line for three decades
No purple anywhere (PURPLE RESERVATION). No hard 1px keyline (taste canon). Nothing here
is a vignette: a vignette is a lens artefact and this is dirt on the world.

  python3 tools/bohemia_grime_cook.py
    -> banks/BOHEMIA_GRIME_8_3_26.txt
    -> records/target/GRIME.png     the sheet, and it over a real block
"""
import base64
import importlib.util
import io
import json
import math
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    'texcook', os.path.join(REPO, 'tools', 'bohemia_texture_match_cook.py'))
TEX = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(TEX)

CELL = 44
# EIGHT CELLS. The run's viewport is about 9x19 cells on a phone, so an 8-cell sheet
# never shows its own repeat AGAINST A TILE the way a 1-cell mark does: the grime and the
# tile grid go in and out of phase instead of locking together. Bigger costs payload for
# nothing; smaller starts to read as a pattern again.
PATCH_CELLS = 8
PATCH = CELL * PATCH_CELLS
GROUND = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
OUT = 'banks/BOHEMIA_GRIME_8_3_26.txt'
SHEET = 'records/target/GRIME.png'

# desert filth: warm dark neutrals. Never purple, never grey-blue.
DIRT = (52, 44, 33)
DARK = (34, 29, 23)
PALE = (146, 132, 106)      # the dust that SETTLES light, not dark


def wrap(v):
    return int(v) % PATCH


class Field:
    """an alpha field at sheet resolution, wrapping on both axes so the sheet tiles."""

    def __init__(self):
        self.a = [[0.0] * PATCH for _ in range(PATCH)]
        self.c = [[None] * PATCH for _ in range(PATCH)]

    def add(self, x, y, amount, rgb=None):
        xx, yy = wrap(x), wrap(y)
        self.a[yy][xx] = min(1.0, self.a[yy][xx] + amount)
        if rgb is not None:
            self.c[yy][xx] = rgb

    def blob(self, cx, cy, r, amount, rgb=None):
        rr = int(r) + 1
        for dy in range(-rr, rr + 1):
            for dx in range(-rr, rr + 1):
                d = math.hypot(dx, dy)
                if d > r:
                    continue
                self.add(cx + dx, cy + dy, amount * (1.0 - d / max(r, 0.01)) ** 1.6, rgb)


def wind_shadow(f, rnd):
    """BROAD SOFT FIELDS of settled dust. The desert does not distribute evenly: it piles
    where the wind slows. Big and low-contrast, so it reads as the whole scene sharing a
    condition rather than as a mark on anything."""
    for _ in range(14):
        f.blob(rnd.f() * PATCH, rnd.f() * PATCH, rnd.r(40, 96), rnd.r(0.10, 0.26), DIRT)
    for _ in range(8):                       # and the PALE half: fine dust settles light
        f.blob(rnd.f() * PATCH, rnd.f() * PATCH, rnd.r(30, 70), rnd.r(0.06, 0.15), PALE)


def leaks(f, rnd):
    """WATER FINDS A HIGH POINT AND RUNS DOWN. This is the Klubnika mechanism verbatim:
    a leak starts somewhere and travels, and it does not care what it crosses on the way.
    Wandering, not straight - a straight line is a keyline and the taste canon bans it."""
    for _ in range(26):
        x, y = rnd.f() * PATCH, rnd.f() * PATCH
        length = rnd.r(30, 130)
        width = rnd.r(1.6, 5.0)
        drift = rnd.r(-0.22, 0.22)
        strength = rnd.r(0.16, 0.40)
        for k in range(int(length)):
            t = k / length
            x += drift + rnd.r(-0.30, 0.30)
            y += 1.0
            # a leak is heaviest at its source and fades as it spreads out and dries
            f.blob(x, y, width * (1.0 - t * 0.45), strength * (1.0 - t) ** 1.3, DARK)


def runoff(f, rnd):
    """the HARD streak, where the water ran the same line for thirty years. Rarer and
    darker than a leak, and it is what stops the field reading as an even wash."""
    for _ in range(7):
        x, y = rnd.f() * PATCH, rnd.f() * PATCH
        length = rnd.r(50, 170)
        drift = rnd.r(-0.10, 0.10)
        for k in range(int(length)):
            x += drift + rnd.r(-0.14, 0.14)
            y += 1.0
            f.blob(x, y, rnd.r(0.8, 1.8), rnd.r(0.20, 0.42), DARK)


def pooling(f, rnd):
    """WHAT THE WIND AND THE RAIN BROUGHT, sitting in the low corner of things. Clumped
    rather than scattered, because dirt collects; it does not sprinkle."""
    for _ in range(20):
        cx, cy = rnd.f() * PATCH, rnd.f() * PATCH
        for _ in range(int(rnd.r(5, 16))):
            f.blob(cx + rnd.r(-13, 13), cy + rnd.r(-9, 9),
                   rnd.r(2.5, 8.0), rnd.r(0.10, 0.30), DIRT)


def cook(seed=830326):
    rnd = TEX.Rnd(seed)
    f = Field()
    wind_shadow(f, rnd)
    pooling(f, rnd)
    leaks(f, rnd)
    runoff(f, rnd)

    im = Image.new('RGBA', (PATCH, PATCH), (0, 0, 0, 0))
    px = im.load()
    grain = TEX.fbm(rnd, (11, 22, 44))
    for y in range(PATCH):
        for x in range(PATCH):
            a = f.a[y][x]
            if a <= 0.004:
                continue
            rgb = f.c[y][x] or DIRT
            # THE FILTH IS NOT SMOOTH EITHER. A soft alpha wash over textured art reads
            # as a lens filter; his own tiles are rough at the single-pixel level and the
            # dirt on them has to be too, or it sits ON the world instead of IN it.
            a *= 0.72 + 0.56 * grain(x / float(PATCH) * 8.0 % 1.0,
                                     y / float(PATCH) * 8.0 % 1.0)
            a = max(0.0, min(1.0, a))
            px[x, y] = rgb + (int(a * 255),)
    return im


def png(im):
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


def main():
    # ---- REUSE CHECK, PERFORMED IN CODE: open his purchased library and prove it holds
    # nothing that could do this job, rather than asserting it in a comment.
    bought = json.load(open(GROUND))
    overlays = 0
    checked = 0
    for t in bought['tiles'][:40]:
        if not t.get('b64'):
            continue
        checked += 1
        im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
        if im.mode == 'RGBA' and im.split()[3].getextrema()[0] < 250:
            overlays += 1
    print('REUSE CHECK: %d of his purchased ground tiles opened, %d are transparent '
          'overlays' % (checked, overlays))
    if overlays:
        raise SystemExit('REFUSING: his library DOES hold overlay art - use it, do not '
                         'paint one. BOUGHT BEATS PAINTED clause 2.')

    im = cook()
    a = im.split()[3]
    cov = sum(1 for v in a.getdata() if v > 0) / float(PATCH * PATCH)
    mean = sum(a.getdata()) / float(PATCH * PATCH) / 255.0

    # ---- the sheet, and the sheet OVER A REAL BLOCK, because a grime layer judged on
    # its own is an abstract painting. VERIFY ON THE REAL SURFACE.
    wall = json.load(open('banks/BOHEMIA_PERIMETER_8_2_26.txt'))
    W = {t['id']: t['b64'] for t in wall['tiles']}
    demo = Image.new('RGBA', (PATCH, CELL * 2), (0, 0, 0, 255))
    for i in range(PATCH_CELLS):
        top = Image.open(io.BytesIO(base64.b64decode(
            W['perim_slump_%s_0' % ('pillar' if i % 4 == 0 else 'face_%d' % (i % 8))]
            if i % 4 else W['perim_slump_pillar_0']))).convert('RGBA')
        bot = Image.open(io.BytesIO(base64.b64decode(
            W['perim_slump_base_%d_0' % (i % 8)]))).convert('RGBA')
        demo.paste(top, (i * CELL, 0))
        demo.paste(bot, (i * CELL, CELL))
    dirty = demo.copy()
    dirty.alpha_composite(im.crop((0, 0, PATCH, CELL * 2)))

    S = 3
    sheet = Image.new('RGB', (PATCH * S, PATCH * S + CELL * 4 * S + 30), (24, 24, 28))
    dr = ImageDraw.Draw(sheet)
    dr.text((4, 3), 'THE GRIME SHEET (8x8 CELLS). SHIPS AT STRENGTH 0.', fill=(230, 220, 195))
    chk = Image.new('RGB', (PATCH, PATCH), (150, 150, 150))
    cp = chk.load()
    for y in range(PATCH):
        for x in range(PATCH):
            if ((x // CELL) + (y // CELL)) % 2:
                cp[x, y] = (110, 110, 110)
    chk = chk.convert('RGBA')
    chk.alpha_composite(im)
    sheet.paste(chk.convert('RGB').resize((PATCH * S, PATCH * S), Image.NEAREST), (0, 16))
    sheet.paste(demo.convert('RGB').resize((PATCH * S, CELL * 2 * S), Image.NEAREST),
                (0, 16 + PATCH * S))
    sheet.paste(dirty.convert('RGB').resize((PATCH * S, CELL * 2 * S), Image.NEAREST),
                (0, 16 + PATCH * S + CELL * 2 * S))
    dr.text((4, 16 + PATCH * S + CELL * 4 * S + 2),
            'above: clean wall.  below: the same wall with the sheet at FULL strength.',
            fill=(200, 200, 200))
    sheet.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_GRIME_v1',
        'date': '2026-08-03',
        'ruling': 'Paolo 8/3, on Machine Party: "I really love machine parties aesthetic." '
                  'Klubnika, on his own texturing: he "added dirty and grimy leaks to '
                  'every corner, which blends everything together rather than having '
                  'different objects."',
        'research': 'records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md',
        'patch_cells': PATCH_CELLS,
        'patch_px': PATCH,
        'note': 'ONE CONTINUOUS SHEET, sampled per cell by WORLD position, so a stain '
                'that starts on one cell carries onto the next. NOT a tile: a mark baked '
                'into a 44px tile repeats at cell pitch forever, which is the bug Paolo '
                'circled on 8/2.',
        'ships_at': 0.0,
        'why_zero': 'The MACHINERY is cheap and invalidates no approved art. The TUNING '
                    'is a whole-world art-direction call and one district of twenty-seven '
                    'is built, so tuning now means tuning twice. The dial ships at 0 and '
                    'the game looks exactly as it did; gates/grime_gate.py holds the zero '
                    'until Paolo rules on the amount.',
        'status': 'MACHINE ONLY - NOTHING FOR HIM TO JUDGE YET',
        'coverage': round(cov, 4),
        'mean_alpha': round(mean, 4),
        'b64': png(im),
    }, open(OUT, 'w'))

    print('GRIME SHEET %dx%d (%d x %d cells)' % (PATCH, PATCH, PATCH_CELLS, PATCH_CELLS))
    print('  coverage %.1f%% of pixels, mean alpha %.3f' % (cov * 100, mean))
    print('  SHIPS AT STRENGTH 0.0 - the machine only, the game is unchanged')
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)


if __name__ == '__main__':
    main()
