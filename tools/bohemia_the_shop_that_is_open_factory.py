#!/usr/bin/env python3
"""BOHEMIA — THE SHOP THAT IS OPEN (9/22/26, LIFE + CITY).

A RE-COOK UNDER THE BIBLE. Paolo voted DOWN on this lane's 9/21 corner store
(lifecity-the-shop-is-still-lit-9-21) with four words: "Not analog horror enough".
On the battery shed, which he voted UP, he wrote: "More analog horror good idea get
direction". So both of his notes say the same thing and both name the same chat.

THE DIAGNOSIS, READ OFF DIRECTION'S OWN TEN RULES
(records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md):

  RULE 1  THE ORDINARY FRAME, ONE WRONG THING. "Two wrong things is a haunted
          house; zero is a screenshot."
          *** I FAILED THIS IN MY OWN DOCSTRING. *** The old file says "the frame is
          completely ordinary" and then lists, in the same sentence: a CRACKED lot,
          three FADED awnings one of them TORN, a BLANK pylon sign, DEAD trees, stall
          paint MOSTLY GONE. That is six wrong things before you reach the light.
          Six wrong things is not six times the dread, it is a ruin, and a ruin is
          just a picture of a ruin. Nothing in it can be THE wrong thing because
          everything in it is wrong.

  RULE 7  THE LIT STREET WITH NOBODY HOME. "Drawn from world data, never faked.
          MEASURE: the wrongness traces to a real world-state row."
          *** AND I PAINTED THE EMPTY SHELVES. *** Seven bare runs because seven
          looked right. They traced to nothing. The game has had a real stock ledger
          the whole time (engine/bohemia_economy.js makeLedger: water, food, salvage,
          meds, fuel per block, deterministic per seed, with scavDecay's "the easy
          shelves empty" curve on top). The one wrong thing in the frame was invented.

SO THIS ONE IS BUILT THE OTHER WAY ROUND.

  THE FRAME IS ORDINARY, ON PURPOSE AND EVERYWHERE. Daylight. The awnings are whole
  and their colours are clean. The trees are alive. The stall paint is fresh and all
  of it is there. The walk is swept. The sign is lit and it is not blank: it carries
  the dead institution's type (rule 5) saying the calmest thing a shop can say. There
  is nothing to look at.

  THE ONE WRONG THING, IN ONE SENTENCE, WHICH IS RULE 1'S OWN TEST:
      THE SHOP IS OPEN, THE LIGHTS ARE ON, AND THERE IS NOTHING ON ANY SHELF.
  Not a torn awning as well. Not a dead tree as well. One.

  AND IT TRACES TO A ROW (rule 7). How many of the shelf runs still hold anything is
  read out of the REAL LEDGER by running engine/bohemia_economy.js, not typed here:
  the block's food stock against what the block eats in a day, put through the same
  scavDecay curve the economy uses, on a fixed seed so the picture is reproducible.
  If the ledger changes, this picture changes. The factory REFUSES TO RUN if it
  cannot reach the ledger, because a made-up number here is the exact defect being
  fixed.

  RULE 4  THE LIGHT WAS IN THE ROOM: every lumen names its fixture. Daylight from
          upper-left (one direction, everything shades from it), the ceiling tubes
          inside the shop, and the sign's own lit box. No mood gradient anywhere.
  RULE 2  THE CAMERA DOES NOT HELP: the wrong thing sits off-centre, nothing frames
          it, nothing glows toward it.
  RULE 8  DIEGETIC OR DEAD: no overlay, no scanline, no static, no vignette.
  RULE 10 GRIME IS BAKED: there is no wear pass at all here, which is the point.

REUSE CHECK: the palette is pulled LIVE out of engine/bohemia_commercial.js (the
commercial district's own canon PALETTE and LEGEND), so this shop and the district a
player walks are one world and one source of truth sets both, and the shelf count is
pulled LIVE out of engine/bohemia_economy.js. Nothing about the colour or the number
is typed in this file. banks/ holds no shopfront at this read (the tile bank is
ground pools, the district bank is the 1x1 city hero), so the geometry is a fresh
cook and nothing is opened from banks/. The geometry itself is carried over from the
9/21 cook rather than redrawn, because what he voted down was the tone, not the
building.

REFERENCE CHECK:
  AH-01    the analog horror bible: the ordinary frame with ONE wrong thing, the
           light with a fixture, nothing on the lens. Held, and held deliberately
           against the 9/21 cut which broke rule 1 six times over; the one wrong
           thing is named in one sentence above and traces to a ledger row.
  BLDG-03  a pixel building is drawn in three planes with ONE light direction, and
           WINDOWS SIT IN THE WALL, not on it. Held: sun upper-left, roof the
           lightest plane, every pane recessed with a dark head and a sill.
  BLDG-05  the structural sanity list: a wall meets a roof, a door is on the ground,
           a street meets a curb. Held: parapet caps the wall, the doorway runs to
           the walk, the walk meets a kerb, the kerb meets the lot.

DETERMINISTIC: one fixed seed, no randomness, no clock. Same bytes every run.

Run from repo root:
  python3 tools/bohemia_the_shop_that_is_open_factory.py
Writes: slices/vote/LIFECITY_THE_SHOP_THAT_IS_OPEN_9_22.png
"""
import io
import json
import os
import re
import subprocess
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = os.path.join(ROOT, 'engine', 'bohemia_commercial.js')
ECON = os.path.join(ROOT, 'engine', 'bohemia_economy.js')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_SHOP_THAT_IS_OPEN_9_22.png')

SCALE = 6
W, H = 168, 128

SEED = 12345          # one fixed seed, so the picture is reproducible
HOUSES = 18           # a block
AGENTS = 34           # who lives on it
DAY = 240             # far enough in that scavDecay has done its work
RUNS = 7              # shelf runs behind the glass


def _pal():
    """READ OUT OF THE DISTRICT, NEVER TYPED HERE."""
    src = io.open(CANON, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_commercial.js.')
    pal = {}
    for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1)):
        pal[int(k)] = v
    missing = [n for n in range(15) if n not in pal]
    if missing:
        sys.exit('REFUSING: the commercial palette is missing codes %s' % missing)
    return pal


def _shelves():
    """*** RULE 7: THE WRONGNESS TRACES TO A REAL WORLD-STATE ROW. ***

    The old cook painted seven empty runs because seven looked right. This one asks
    the game's own ledger how much food a block of this size actually has left, and
    how many days of eating that is, and fills that fraction of the shelf runs.

    RUN IT, DO NOT REIMPLEMENT IT. A python copy of makeLedger would be a second
    writer of the same number and would drift the first time somebody tunes the
    economy -- which is the defect this lane has found in its own work four rounds
    running. REFUSES rather than guessing if node or the module is not there.
    """
    js = ('const E=require(%s);'
          'const L=E.makeLedger(%d,%d,%d);'
          'const need=(E.GOODS.food.need||0)*L.agents;'
          'const left=L.stocks.food*E.scavDecay(%d);'
          'console.log(JSON.stringify({food:L.stocks.food,need:need,'
          'decay:E.scavDecay(%d),left:left,'
          'days:need>0?left/need:null}));'
          % (json.dumps(ECON), SEED, AGENTS, HOUSES, DAY, DAY))
    try:
        out = subprocess.check_output(['node', '-e', js], cwd=ROOT,
                                      stderr=subprocess.STDOUT, timeout=60)
    except Exception as e:
        sys.exit('REFUSING: could not read the real stock ledger (%s). The whole '
                 'point of this cut is that the empty shelves are TRUE, so it will '
                 'not fall back to a number I liked the look of.' % e)
    d = json.loads(out.decode().strip().splitlines()[-1])
    if d.get('days') is None:
        sys.exit('REFUSING: the ledger gave no days of supply.')
    # A shelf run holds something while the block has days of food to put on it.
    # Ten days of supply is a full shop; zero is a bare one. Linear between.
    frac = max(0.0, min(1.0, d['days'] / 10.0))
    stocked = int(round(RUNS * frac))
    d['frac'] = frac
    d['stocked'] = stocked
    d['bare'] = RUNS - stocked
    return d


def shade(hexv, f):
    r = int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def main():
    P = _pal()
    S = _shelves()

    ASPHALT = shade(P[1], 1.28)
    STORE = P[2]
    ISLAND = shade(P[4], 1.10)
    WALK = shade(P[6], 1.02)
    GLASS = P[7]
    AWN = [P[8], P[9], P[10]]
    TICK = shade(P[11], 1.30)
    POLE = shade(P[12], 0.92)
    PLANT = shade(P[13], 0.92)
    DARK = shade(P[14], 1.0)

    roof = shade(STORE, 1.16)
    wall = shade(STORE, 0.84)
    edge = shade(STORE, 0.42)

    GRAVEL = shade(P[0], 1.95)
    BACK = shade(P[1], 1.10)

    # ---- EVERY PIXEL IS GROUND (the world is seen from above; there is no sky) ----
    im = Image.new('RGB', (W, H), ASPHALT)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W - 1, 13], fill=GRAVEL)
    for y in range(1, 13, 2):
        for x in range((y * 3) % 5, W, 9):
            d.point((x, y), fill=shade(P[0], 2.25))
    d.rectangle([0, 13, W - 1, 73], fill=BACK)
    d.rectangle([0, 13, W - 1, 14], fill=shade(P[1], 1.45))
    d.rectangle([2, 40, 12, 56], fill=shade(P[14], 1.45))      # the bin, upright, closed
    d.rectangle([2, 40, 12, 41], fill=shade(P[14], 2.1))

    # ---- THE LOT: SWEPT, AND ITS PAINT IS ALL THERE --------------------------
    # RULE 1. The old cut had "faded stall ticks, most gone" and a cracked apron.
    # Wear is not dread, it is set dressing, and six pieces of it is a haunted
    # house. This lot is in service.
    d.rectangle([0, 74, W - 1, H - 1], fill=ASPHALT)
    for x in range(10, W, 18):
        d.line([(x, 96), (x, 112)], fill=TICK)
    d.rectangle([0, 74, W - 1, 75], fill=shade(P[1], 1.6))
    for cx in (28, 108):
        d.rectangle([cx - 9, 87, cx + 9, 101], fill=shade(P[1], 1.62))
        d.rectangle([cx - 8, 88, cx + 8, 100], fill=ISLAND)
        d.rectangle([cx - 8, 88, cx + 8, 89], fill=shade(P[4], 1.35))
        # A LIVING TREE, in the district's OWN planting colour, lit from the upper
        # left like everything else. The first cut of this used code 13, which is the
        # ROOFTOP PLANT -- painted metal, a warm grey -- so the trees came out as two
        # boulders sitting in a flower bed. Code 22 is the olive the commercial
        # district plants with, and it is the bed these two are standing in.
        d.ellipse([cx - 7, 84, cx + 7, 97], fill=shade(P[22], 1.55))
        d.ellipse([cx - 6, 83, cx + 3, 92], fill=shade(P[22], 2.05))
        d.line([(cx, 100), (cx, 94)], fill=shade(P[0], 1.7))
        d.line([(cx + 10, 88), (cx + 10, 101)], fill=shade(P[1], 0.80))
        d.line([(cx - 9, 102), (cx + 10, 102)], fill=shade(P[1], 0.80))

    # ---- THE STORE ----------------------------------------------------------
    d.rectangle([14, 8, 154, 52], fill=roof)
    for y in range(10, 52, 6):
        d.line([(15, y), (153, y)], fill=shade(STORE, 1.06))
    d.rectangle([14, 8, 154, 9], fill=shade(STORE, 1.30))
    for bx in (40, 88, 122):                       # rooftop plant, in service
        d.rectangle([bx, 16, bx + 16, 28], fill=PLANT)
        d.rectangle([bx, 16, bx + 16, 17], fill=shade(P[13], 1.25))
        d.line([(bx + 3, 20), (bx + 13, 20)], fill=shade(P[13], 0.78))
        d.line([(bx + 3, 24), (bx + 13, 24)], fill=shade(P[13], 0.78))
    d.rectangle([14, 50, 154, 52], fill=shade(STORE, 0.96))

    d.rectangle([14, 52, 154, 70], fill=wall)
    d.rectangle([14, 52, 154, 53], fill=shade(STORE, 1.02))
    d.rectangle([14, 69, 154, 70], fill=edge)

    bays = [(20, 58), (68, 58), (116, 38)]
    for i, (bx, bw) in enumerate(bays):
        gx0, gx1 = bx, bx + bw
        d.rectangle([gx0, 56, gx1, 68], fill=shade(GLASS, 0.70))
        d.rectangle([gx0, 56, gx1, 57], fill=edge)
        d.rectangle([gx0, 56, gx0 + 1, 68], fill=edge)
        d.rectangle([gx1 - 1, 56, gx1, 68], fill=edge)
        d.rectangle([gx0, 68, gx1, 69], fill=shade(STORE, 1.08))

    # ---- THE SHOP IS LIT, THE WAY AN OPEN SHOP IS LIT ------------------------
    # RULE 4: the source is the ceiling, so it is brightest at the head of the
    # glass and falls to the floor. RULE 1: the lighting is NOT the wrong thing
    # here, it is the ordinary. Every bay is lit, not one.
    GLOW = (255, 240, 205)
    BASE = shade(GLASS, 0.9)
    for (bx, bw) in bays:
        for yy in range(57, 69):
            t = max(0.14, 0.58 - (yy - 57) * 0.032)
            d.line([(bx + 2, yy), (bx + bw - 2, yy)], fill=mix(BASE, GLOW, t))
        for tx in range(bx + 8, bx + bw - 10, 22):
            d.rectangle([tx, 58, tx + 13, 58], fill=(255, 250, 228))

    # ---- *** THE ONE WRONG THING: THERE IS NOTHING ON ANY SHELF *** ----------
    # And how many runs still hold something is the LEDGER's answer, not mine.
    INSIDE = mix(BASE, GLOW, 0.34)
    RACK = mix(INSIDE, DARK, 0.72)
    RAIL = mix(INSIDE, DARK, 0.46)
    GOODS = mix(INSIDE, DARK, 0.20)
    run = 0
    for (bx, bw) in bays:
        k = 0
        while bx + 6 + k * 7 < bx + bw - 6:
            sx = bx + 6 + k * 7
            d.line([(sx, 60), (sx, 67)], fill=RACK)
            for ry in (62, 64, 66):
                d.line([(sx, ry), (sx + 5, ry)], fill=RAIL)
                # a run that the ledger says still holds something, holds something
                if run < S['stocked']:
                    d.line([(sx + 1, ry - 1), (sx + 4, ry - 1)], fill=GOODS)
            run += 1
            k += 1

    # the till, with nobody behind it
    bx, bw = bays[1]
    d.rectangle([bx + bw - 14, 64, bx + bw - 4, 67], fill=mix(INSIDE, DARK, 0.62))

    # ---- the walk, swept ----------------------------------------------------
    d.rectangle([14, 70, 154, 74], fill=WALK)
    for x in range(18, 154, 12):
        d.line([(x, 70), (x, 74)], fill=shade(P[6], 0.86))
    # the light the shop throws out of its own door onto the walk
    d.rectangle([96, 70, 108, 70], fill=mix(WALK, GLOW, 0.30))
    d.rectangle([96, 71, 108, 71], fill=mix(WALK, GLOW, 0.16))

    # ---- the awnings: WHOLE, and their colours clean -------------------------
    for i, (bx2, bw2) in enumerate(bays):
        d.rectangle([bx2, 53, bx2 + bw2, 55], fill=shade(AWN[i], 1.00))
        d.rectangle([bx2, 53, bx2 + bw2, 53], fill=shade(AWN[i], 1.22))

    # ---- the doorway, standing open on a lit shop ---------------------------
    # A DOOR IS A HOLE WITH A FRAME. The first cut drew it as a flat grey box, which
    # read as a crate parked against the window rather than a way in. The frame is
    # dark on all four sides, the opening carries the SAME light the room does, and
    # the leaf of the door stands folded back against the jamb.
    d.rectangle([95, 57, 109, 70], fill=edge)
    d.rectangle([97, 59, 107, 70], fill=mix(BASE, GLOW, 0.50))
    d.rectangle([97, 59, 107, 60], fill=mix(BASE, GLOW, 0.66))
    d.rectangle([105, 59, 107, 70], fill=shade(STORE, 0.70))   # the leaf, folded back
    d.rectangle([105, 59, 105, 70], fill=shade(STORE, 1.10))

    # ---- THE SIGN IS LIT AND IT IS NOT BLANK --------------------------------
    # RULE 5, THE DEAD INSTITUTION'S TYPE: procedural, too calm, no exclamation.
    # The calmest thing a shop can say, in segment cells, lit from inside its own
    # box, which is rule 4's fixture. A blank board says nothing; this says the
    # ordinary thing, which is what makes the shelves behind it land.
    d.rectangle([138, 86, 160, 106], fill=shade(P[12], 0.80))
    d.rectangle([138, 86, 160, 87], fill=shade(P[12], 1.25))
    d.rectangle([141, 90, 157, 102], fill=mix(shade(P[0], 1.4), GLOW, 0.62))
    # THE WORDS ARE ROWS, NOT LETTERS. A board this size is sixteen pixels across
    # and a three-pixel glyph is not type, it is a keypad -- which is exactly what
    # the first cut of this sign read as. At this scale writing reads as EVEN DARK
    # ROWS OF UNEVEN LENGTH: a heading, then two lines under it. The register is the
    # ruling (rule 5, procedural and too calm); the resolution decides the rest.
    INK = shade(P[0], 0.85)
    d.rectangle([142, 92, 152, 93], fill=INK)            # the name of the shop
    d.rectangle([142, 95, 156, 95], fill=INK)            # and the hours under it
    d.rectangle([142, 97, 150, 97], fill=INK)
    d.rectangle([142, 99, 154, 99], fill=INK)
    d.rectangle([161, 88, 163, 107], fill=shade(P[1], 0.78))       # its shadow
    d.rectangle([140, 107, 163, 108], fill=shade(P[1], 0.78))
    d.rectangle([147, 106, 151, 118], fill=POLE)

    # ---- the building's shadow, from the one light direction -----------------
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).polygon([(154, 8), (160, 12), (160, 78), (154, 74)],
                               fill=(0, 0, 0, 72))
    im = Image.alpha_composite(im.convert('RGBA'), sh).convert('RGB')

    big = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    big.save(OUT)
    print('THE SHOP THAT IS OPEN  (re-cook of the 9/21 store he voted down)')
    print('  his words             : "Not analog horror enough"')
    print('  what was wrong        : rule 1, six wrong things in one frame, and')
    print('                          rule 7, the empty shelves traced to nothing')
    print('  the ONE wrong thing   : the shop is open, the lights are on, and there')
    print('                          is nothing on any shelf')
    print('  THE LEDGER, read live : food %d, eaten %.1f a day, decay %.3f -> %.1f left'
          % (S['food'], S['need'], S['decay'], S['left']))
    print('                          %.2f days of supply' % S['days'])
    print('  so the shelves        : %d of %d runs bare  (%d still hold something)'
          % (S['bare'], RUNS, S['stocked']))
    print('  palette               : read live from engine/bohemia_commercial.js')
    print('  wrote                 : %s (%d x %d)' % (OUT, W * SCALE, H * SCALE))


if __name__ == '__main__':
    main()
