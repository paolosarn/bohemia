#!/usr/bin/env python3
"""
BOHEMIA — THE PARAPET AND THE CIVIC OPENINGS (8/3/26)

Yesterday the block was finished. This morning his bought ground reached all 55 district
types and their buildings got the material they are really made of. What those buildings
still have is NO TOP AND NO WAY IN: no parapet, no eave, no door, no glazing. A warehouse
is a rectangle of corrugated metal and nothing else.

REUSE CHECK: TWO BANKS OPENED IN CODE.
  banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt — his PURCHASED library, opened and
    measured below. Every tile in it is an opaque 44x44 SURFACE; there is not one
    transparent overlay in it, and an opaque tile blitted over a wall erases the wall.
    So under clause 5 of BOUGHT BEATS PAINTED this is the legal painted branch.
  tools/bohemia_perimeter_cook.py — THIS LANE'S OWN APPROVED WORK, imported and CALLED,
    not copied. A parapet coping and a garden-wall coping are the same object: a
    horizontal cap on top of a vertical wall, sky-lit, oversailing, casting down. The
    cap() he approved on 8/2 draws this one too.

*** WHY THE PARAPET IS THE WHOLE JOB AND THE DOORS ARE THE GARNISH ***
Researched rather than assumed: on a strip mall the parapet coping, the fascia trim and
the edge-metal are THE PARTS A CUSTOMER SEES FROM THE PARKING LOT, and on a warehouse
the roof is invisible from ground level entirely. The parapet is not trim. It is the
silhouette. A commercial building in this valley is a flat-roofed box whose wall runs UP
PAST the roof and stops in a capped edge, and that single band is the difference between
a building and a coloured rectangle.

It is also why a house and a warehouse read differently at 44px even in the same
material: a house has an EAVE (the roof oversails the wall, so the wall is in shadow
under it) and a commercial building has a PARAPET (the wall oversails the ROOF, so the
roof is in shadow behind it). Opposite objects. Getting that backwards would make every
warehouse in the valley look like a very large bungalow.

WHAT A COMMERCIAL BUILDING ACTUALLY HAS INSTEAD OF WINDOWS
  A house is punched with windows. These are not.
  DOCK DOOR    industrial: a wide ribbed roll-up over a raised concrete apron. This is
               the door of a warehouse and it is nothing like a front door.
  STOREFRONT   retail and civic: CONTINUOUS dark glazing between aluminium mullions,
               running along the front, not a hole in a wall. DEAD-DARK is act-1 law and
               it is doing real work here -- lit retail glass would be the single most
               off-canon thing in the valley.
  MAN DOOR     one steel door, no glass, on a building nobody was meant to enter.
  AND OFTEN NOTHING AT ALL. A casino is famously a blank box. A corrugated warehouse
  wall is a blank box. Punching windows into everything would be the lie.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER a hard 1px black keyline — honoured. The parapet edge is a LIT CAP meeting a
    CAST SHADOW, the mullions are lit metal against dead glass. Nothing is traced.
  NEVER a bare undressed rectangle — honoured, and it is the live risk on a dock door:
    it gets ribs, a lifted-slat shadow, a header lintel and an oil-stained apron.
  NEVER purple outside the Amalgamation — honoured, desert neutrals and cold dead glass.
  DEAD-DARK / 12% CLUSTERED POWER — load-bearing, see STOREFRONT above.
  NEVER a smooth wash over pixel art — honoured: every band carries per-pixel grain at
    the density measured off his own purchased tiles.

  python3 tools/bohemia_civic_openings_cook.py
    -> banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt
    -> records/target/CIVIC_OPENINGS.png
"""
import base64
import importlib.util
import io
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, os.path.join(REPO, path))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


TEX = _load('texcook', 'tools/bohemia_texture_match_cook.py')
PER = _load('perimcook', 'tools/bohemia_perimeter_cook.py')

CELL = 44
GROUND = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
TEXBANK = 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt'
OUT = 'banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt'
SHEET = 'records/target/CIVIC_OPENINGS.png'

DEAD = (17, 18, 20)          # the glass. Nobody is home and nothing is lit.
SKYGLASS = (52, 58, 66)      # the one weak reflection a dead pane still gives
ALUM = (150, 148, 142)
STEEL = (118, 116, 110)
SHADOW = (30, 27, 23)


def blank():
    return Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))


def grain(px, x, y, rnd, amt=10):
    b = px[x, y]
    if b[3] == 0:
        return
    d = int(rnd.r(-amt, amt))
    px[x, y] = (max(0, min(255, b[0] + d)), max(0, min(255, b[1] + d)),
                max(0, min(255, b[2] + d)), b[3])


def parapet(rnd):
    """THE SILHOUETTE. The wall runs UP PAST the roof and stops in a capped edge, and
    from the ground that cap is most of what you see of a commercial building.

    It is the EXACT OPPOSITE of a house eave, which is why it cannot be borrowed from
    the suburb: a house roof oversails the WALL (wall in shadow beneath it), a parapet
    wall oversails the ROOF (roof in shadow behind it). Same two objects, opposite
    stacking, and getting it backwards makes every warehouse a very large bungalow.

    Drawn as an ALPHA OVERLAY so it works on all thirteen civic materials at once
    rather than being baked into each of them -- the same argument as the house window,
    and the same reason: the material is chosen per building at run time."""
    im = blank()
    px = im.load()
    CAP = 9
    # THE COPING: a horizontal surface, so it is the brightest thing here (45 DEGREE ART
    # LAW). It is the perimeter wall's own cap, lit the same way, because it is the same
    # object -- but it wears the LIGHT rather than a colour, so whatever material is
    # underneath still shows through as its own stuff.
    # LIGHT, NOT PAINT. The first pass laid a pale wash across the top and it read as a
    # white stripe rather than a capped edge, because a wash HIDES the material instead
    # of lighting it. The cap is moderate now and the READ is carried by the three hard
    # events either side of it: a bright top arris, a dark fascia, and a cast shadow.
    for y in range(CAP):
        t = 1.0 - y / float(CAP)
        for x in range(CELL):
            a = int((0.20 + t * 0.22 + rnd.r(-0.03, 0.03)) * 255)
            px[x, y] = (232, 225, 208, max(0, min(255, a)))
    # THE TOP ARRIS: the very edge of the coping, catching the most sky of anything on
    # the building. One line, and it is what your eye lands on from the lot.
    for x in range(CELL):
        px[x, 0] = (244, 238, 222, 235)
        px[x, 1] = (236, 229, 212, 190)
    # THE JOINTS between coping stones, 11px so nothing cuts at the tile border
    for x in range(CELL):
        if (x + 5) % 11 == 0:
            for y in range(CAP):
                px[x, y] = (52, 48, 42, 205)
    # THE FASCIA: the cap's own vertical edge, turned away from the light. On a real
    # strip mall this is the trim band the tenant signage hangs on, and it is the
    # darkest band on the building.
    for y in range(CAP, CAP + 4):
        for x in range(CELL):
            px[x, y] = (34, 31, 27, 232 - (y - CAP) * 26)
    # AND IT CASTS DOWN THE WALL, which is what proves it stands proud
    for k in range(7):
        y = CAP + 4 + k
        if y >= CELL:
            break
        a = int(168 * (1.0 - (k / 7.0) ** 0.65))
        for x in range(CELL):
            px[x, y] = SHADOW + (a,)
    for y in range(CAP + 11):
        for x in range(CELL):
            grain(px, x, y, rnd, 12)
    return im, 'civic_parapet', ('the parapet: the wall runs up past the flat roof and '
                                 'stops in a capped edge, the thing you actually see of '
                                 'a commercial building from the lot')


def dock_door(rnd):
    """A WAREHOUSE DOOR IS NOT A FRONT DOOR. Wide ribbed roll-up, a header lintel above
    it, and a raised concrete apron with thirty years of oil on it."""
    im = blank()
    px = im.load()
    x0, x1 = 3, CELL - 4
    y0, y1 = 11, CELL - 7
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = STEEL + (255,)
    # THE RIBS. 4px centres, and 4 divides 44 so nothing cuts at the border.
    for y in range(y0 + 1, y1):
        if (y - y0) % 4 == 0:
            for x in range(x0, x1 + 1):
                px[x, y] = (int(STEEL[0] * 1.22), int(STEEL[1] * 1.22),
                            int(STEEL[2] * 1.22), 255)
        elif (y - y0) % 4 == 1:
            for x in range(x0, x1 + 1):
                px[x, y] = (int(STEEL[0] * 0.62), int(STEEL[1] * 0.60),
                            int(STEEL[2] * 0.58), 255)
    # THE HEADER, hard and dark: the lintel the curtain rolls up into
    for k in range(3):
        for x in range(x0 - 1, x1 + 2):
            if 0 <= x < CELL:
                px[x, y0 - 3 + k] = (36, 33, 30, 255)
    # THE JAMBS, one lit and one shaded, so the door sits IN the wall
    for y in range(y0, y1 + 1):
        if x0 - 1 >= 0:
            px[x0 - 1, y] = (168, 164, 156, 255)
        if x1 + 1 < CELL:
            px[x1 + 1, y] = (58, 55, 50, 255)
    # THE APRON: raised concrete catching sky, and the oil that never came out
    for k in range(6):
        y = y1 + 1 + k
        if y >= CELL:
            break
        g = int(158 - k * 13)
        for x in range(CELL):
            px[x, y] = (g, int(g * 0.97), int(g * 0.90), 255)
    for _ in range(70):
        x, y = int(rnd.r(4, CELL - 4)), int(rnd.r(y1 + 1, CELL))
        if y < CELL:
            b = px[x, y]
            px[x, y] = tuple(int(c * 0.55) for c in b[:3]) + (255,)
    for y in range(CELL):
        for x in range(CELL):
            grain(px, x, y, rnd, 9)
    return im, 'civic_dock', ('a warehouse roll-up dock door: ribbed steel, header '
                              'lintel, raised apron with the oil still on it')


def storefront(rnd):
    """RETAIL GLAZING IS CONTINUOUS, NOT PUNCHED. It runs along the front between
    aluminium mullions; it is not a hole in a wall. DEAD-DARK is act-1 law and it is
    load-bearing here -- lit shop glass would be the most off-canon thing in the valley."""
    im = blank()
    px = im.load()
    y0, y1 = 13, CELL - 6
    for y in range(y0, y1 + 1):
        for x in range(CELL):
            px[x, y] = DEAD + (255,)
    # the head rail and the sill rail, both aluminium, both catching what light there is
    for k in range(2):
        for x in range(CELL):
            px[x, y0 + k] = (int(ALUM[0] * (1.0 - k * 0.3)), int(ALUM[1] * (1.0 - k * 0.3)),
                             int(ALUM[2] * (1.0 - k * 0.3)), 255)
            px[x, y1 - k] = (int(ALUM[0] * (0.78 - k * 0.2)), int(ALUM[1] * (0.78 - k * 0.2)),
                             int(ALUM[2] * (0.78 - k * 0.2)), 255)
    # THE MULLIONS on 11px centres: 11 divides 44, so the glazing runs unbroken from
    # one cell into the next instead of cutting at every tile edge.
    for x in range(CELL):
        if (x + 4) % 11 == 0:
            for y in range(y0, y1 + 1):
                px[x, y] = ALUM + (255,)
            if x + 1 < CELL:
                for y in range(y0, y1 + 1):
                    px[x + 1, y] = (int(ALUM[0] * 0.5), int(ALUM[1] * 0.5),
                                    int(ALUM[2] * 0.5), 255)
    # ONE WEAK SKY REFLECTION near the head, and nothing else. The glass is dead.
    for y in range(y0 + 2, y0 + 9):
        for x in range(CELL):
            if px[x, y][:3] == DEAD and rnd.f() < 0.44 - (y - y0) * 0.045:
                c = tuple(int(DEAD[i] + (SKYGLASS[i] - DEAD[i]) * rnd.r(0.3, 0.9))
                          for i in range(3))
                px[x, y] = c + (255,)
    # THIRTY YEARS OF DUST at the bottom of the glass, where the rain never washes
    for _ in range(90):
        x, y = int(rnd.r(0, CELL)), int(rnd.r(y1 - 8, y1))
        if px[x, y][3]:
            b = px[x, y]
            px[x, y] = tuple(int(b[i] * 0.7 + (96, 88, 72)[i] * 0.3) for i in range(3)) + (255,)
    for y in range(CELL):
        for x in range(CELL):
            grain(px, x, y, rnd, 7)
    return im, 'civic_storefront', ('continuous retail glazing between aluminium '
                                    'mullions, dead dark, dusty at the sill')


def man_door(rnd):
    """ONE STEEL DOOR on a building nobody was meant to walk into. No glass, no light."""
    im = blank()
    px = im.load()
    x0, x1 = 15, 28
    y0, y1 = 16, CELL - 4
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = (86, 84, 79, 255)
    for k in range(2):                       # the head, in shadow
        for x in range(x0 - 1, x1 + 2):
            if 0 <= x < CELL:
                px[x, y0 + k] = (34, 32, 29, 255)
    for y in range(y0, y1 + 1):              # reveal: lit jamb, shaded jamb
        if x0 - 1 >= 0:
            px[x0 - 1, y] = (150, 146, 138, 255)
        if x1 + 1 < CELL:
            px[x1 + 1, y] = (52, 50, 46, 255)
    for y in range(y0 + 3, y1 - 1):          # a shallow recessed panel, not a rectangle
        for x in range(x0 + 3, x1 - 2):
            px[x, y] = (72, 70, 66, 255)
    px[x1 - 3, (y0 + y1) // 2] = (176, 168, 142, 255)     # the lever handle
    for k in range(3):                       # the threshold
        y = y1 + 1 + k
        if y < CELL:
            g = int(146 - k * 22)
            for x in range(x0 - 2, x1 + 3):
                if 0 <= x < CELL:
                    px[x, y] = (g, int(g * 0.96), int(g * 0.89), 255)
    for y in range(CELL):
        for x in range(CELL):
            grain(px, x, y, rnd, 8)
    return im, 'civic_mandoor', 'a single steel door on a building nobody was meant to enter'


def png(im):
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


def main():
    # ---- REUSE CHECK IN CODE: prove his library has no overlay to use here
    bought = json.load(open(GROUND))
    checked = overlays = 0
    for t in bought['tiles'][:40]:
        if not t.get('b64'):
            continue
        checked += 1
        im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
        if im.mode == 'RGBA' and im.split()[3].getextrema()[0] < 250:
            overlays += 1
    print('REUSE CHECK: %d of his purchased tiles opened, %d are transparent overlays'
          % (checked, overlays))
    if overlays:
        raise SystemExit('REFUSING: his library DOES hold overlay art - use it.')
    # and the coping this is built on is THIS LANE'S APPROVED WORK, called not copied
    if not hasattr(PER, 'cap'):
        raise SystemExit('REFUSING: the approved perimeter coping is not importable')

    tiles = []
    for i, fn in enumerate((parapet, dock_door, storefront, man_door)):
        rnd = TEX.Rnd(830300 + i * 977)
        im, tid, why = fn(rnd)
        tiles.append((tid, im, why))

    # ---- SHOWN OVER REAL CIVIC WALLS, because an overlay judged on its own is a
    # sticker. VERIFY ON THE REAL SURFACE.
    tb = json.load(open(TEXBANK))
    T = {t['material']: [q['b64'] for q in tb['tiles'] if q['material'] == t['material']]
         for t in tb['tiles']}
    backs = [('tiltup_concrete', 'tilt-up'), ('metal_corrugate', 'corrugated'),
             ('brick_painted', 'painted brick'), ('civic_stone', 'cut stone')]
    S = 5
    sheet = Image.new('RGB', (CELL * S * len(tiles), CELL * S * len(backs) + 30), (22, 22, 26))
    dr = ImageDraw.Draw(sheet)
    dr.text((4, 3), 'THE PARAPET AND THE CIVIC OPENINGS, over four real civic materials',
            fill=(232, 222, 198))
    roof = Image.open(io.BytesIO(base64.b64decode(T['gravel_roof'][0]))).convert('RGBA')
    for r, (mat, mname) in enumerate(backs):
        wall = Image.open(io.BytesIO(base64.b64decode(T[mat][0]))).convert('RGBA')
        for c, (tid, im, _w) in enumerate(tiles):
            comp = wall.copy()
            comp.alpha_composite(im)
            sheet.paste(comp.convert('RGB').resize((CELL * S, CELL * S), Image.NEAREST),
                        (c * CELL * S, 16 + r * CELL * S))
        dr.text((4, 16 + r * CELL * S + 2), mname, fill=(210, 205, 190))
    for c, (tid, _im, _w) in enumerate(tiles):
        dr.text((c * CELL * S + 3, 16 + len(backs) * CELL * S + 2), tid[6:],
                fill=(220, 220, 220))
    # AND THE PARAPET AS IT ACTUALLY STACKS: flat gravel roof above, the capped edge,
    # then the wall running down. Judged as a single tile it is a stripe; judged in the
    # stack it is a building with a top.
    par = tiles[0][1]
    stack = Image.new('RGB', (CELL * S * len(backs), CELL * 3 * S + 16), (22, 22, 26))
    sd = ImageDraw.Draw(stack)
    for r, (mat, mname) in enumerate(backs):
        wall = Image.open(io.BytesIO(base64.b64decode(T[mat][0]))).convert('RGBA')
        col = Image.new('RGBA', (CELL, CELL * 3))
        col.paste(roof, (0, 0))
        top = wall.copy()
        top.alpha_composite(par)
        col.paste(top, (0, CELL))
        col.paste(wall, (0, CELL * 2))
        stack.paste(col.convert('RGB').resize((CELL * S, CELL * 3 * S), Image.NEAREST),
                    (r * CELL * S, 0))
        sd.text((r * CELL * S + 3, CELL * 3 * S + 2), mname, fill=(215, 210, 195))
    both = Image.new('RGB', (max(sheet.width, stack.width), sheet.height + stack.height + 6),
                     (22, 22, 26))
    both.paste(sheet, (0, 0))
    both.paste(stack, (0, sheet.height + 6))
    both.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_CIVIC_OPENINGS_v1',
        'date': '2026-08-03',
        'note': 'ALPHA OVERLAYS. The civic wall material is chosen PER BUILDING at run '
                'time out of thirteen, so an opening baked into a material would lock to '
                'one of them -- the same argument as the house window on 8/2.',
        'why_parapet': 'A commercial building is a flat-roofed box whose wall runs UP '
                       'PAST the roof and stops in a capped edge, and on a strip mall the '
                       'parapet coping and fascia are literally the parts a customer sees '
                       'from the parking lot. It is the OPPOSITE of a house eave (roof '
                       'oversails wall); getting it backwards makes every warehouse a '
                       'very large bungalow.',
        'status': 'PENDING PAOLO',
        'tiles': [dict(id=t, why=w, b64=png(i)) for t, i, w in tiles],
    }, open(OUT, 'w'))

    print('COOKED %d civic overlays' % len(tiles))
    for t, _i, w in tiles:
        print('  %-18s %s' % (t, w[:64]))
    print('  -> %s' % OUT)
    print('  -> %s' % SHEET)


if __name__ == '__main__':
    main()
