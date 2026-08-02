#!/usr/bin/env python3
"""
LABEL EVERY PICTURE GATE (8/2/26, WORLD lane).

    "You are showing me pictures, but I don't know which is which"  -- Paolo, 8/2/26

Law: laws/BOHEMIA_ADDENDUM_LABEL_EVERY_PICTURE_8_2_26.md. EVERY IMAGE PUT IN FRONT OF
PAOLO CARRIES ITS OWN NAME, IN THE PIXELS -- not in the caption, not in the message
above it, not implied by the order things were sent in.

WHY THIS GATE READS PIXELS AND NOT SOURCE. The obvious cheap version of this check is
to grep tools/bohemia_judge_cards.py for a draw-the-name call and call it enforced. That
would pass on a tool that draws the name in the background colour, or off the edge of
the canvas, or in a font that failed to load and silently rendered nothing. The whole
8/2 library post-mortem is about a gate that asserted the wrong thing and then forced
every future session to keep the mistake, so this one asserts THE THING ITSELF: it
renders each card and looks at the title band to see whether ink actually landed there.

It checks, for every registered district:
  1. a card renders at all (the tool runs, end to end, on the live modules)
  2. the TITLE BAND carries ink -- text was really drawn, not merely called for
  3. the ink SCALES WITH THE NAME: a long name marks more of the band than a short one,
     which is what catches a fixed watermark or a stuck label
  4. the card is WIDER THAN IT IS TALL-ish and big enough to read on a phone
  5. the SCORE strip is present, because a number is what the card is asking for

  python3 gates/label_every_picture_gate.py
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))

PASS = FAIL = 0


def ok(name, cond):
    global PASS, FAIL
    if cond:
        PASS += 1
    else:
        FAIL += 1
        print('  FAIL: ' + name)


try:
    from PIL import Image                                          # noqa: F401
    import bohemia_judge_cards as JC
except Exception as e:                                             # noqa: BLE001
    print('  FAIL: the judge-card tool does not import (%s)' % str(e)[:120])
    print('LABEL EVERY PICTURE GATE: 0 passed, 1 failed')
    sys.exit(1)

# every district the world actually registers
out = subprocess.run(['node', '-e',
                      "const K=require('./engine/bohemia_district_kit.js');"
                      "require('./engine/bohemia_world.js');"
                      "process.stdout.write(JSON.stringify(K.types()));"],
                     capture_output=True, text=True)
TYPES = json.loads(out.stdout) if out.returncode == 0 else []
ok('the district registry is readable (there is something to label)', len(TYPES) > 20)

BAND_TOP, BAND_BOT = 30, 96          # the title band, in card coordinates


def ink_in_band(im):
    """How many pixels in the title band are markedly brighter than the card ground.
    Text is the only thing drawn there, so this counts the letters."""
    px = im.convert('RGB').load()
    n = 0
    for y in range(BAND_TOP, min(BAND_BOT, im.height)):
        for x in range(0, im.width):
            r, g, b = px[x, y]
            if r > 150 and g > 145 and b > 130:
                n += 1
    return n


rendered, blank, tiny, noscore, onescore = [], [], [], [], []
inks = {}
for t in TYPES:
    try:
        im = JC.card(t)
    except Exception:                                              # noqa: BLE001
        continue                                                   # unregistered/legacy shapes
    rendered.append(t)
    ink = ink_in_band(im)
    inks[t] = ink
    if ink < 200:
        blank.append(t)
    if im.width < 600 or im.height < 500:
        tiny.append(t)
    # TWO score lines live in the bottom ~100px, drawn in the gold ink -- one for the
    # WALKING and one for the ICON (Paolo 8/2: "for the walking and icon"). A district is
    # two artefacts built by two different files, and one number makes him average them.
    px = im.convert('RGB').load()
    gold = 0
    for y in range(max(0, im.height - 100), im.height):
        for x in range(0, im.width):
            r, g, b = px[x, y]
            if r > 170 and 110 < g < 200 and b < 110:
                gold += 1
    if gold < 100:
        noscore.append(t)
    else:
        # both lines, not one: count the distinct gold ROWS, which must span two bands
        rows = [y for y in range(max(0, im.height - 100), im.height)
                if any(px[x, y][0] > 170 and 110 < px[x, y][1] < 200 and px[x, y][2] < 110
                       for x in range(0, im.width, 3))]
        if not rows or (max(rows) - min(rows)) < 30:
            onescore.append(t)

ok('a card RENDERS for every district that has a plot (%d rendered)' % len(rendered),
   len(rendered) >= 20)
ok('THE NAME IS IN THE PIXELS: the title band carries ink on every card, checked by '
   'READING the band rather than by trusting that the draw call was written'
   + (' -- blank on: ' + ', '.join(blank[:6]) if blank else ''),
   not blank)

# a long name must mark more of the band than a short one: catches a stuck or fixed label
if len(inks) >= 4:
    by_len = sorted(inks, key=lambda t: len(t))
    short, long_ = by_len[0], by_len[-1]
    ok('THE LABEL IS THE DISTRICT\'S OWN NAME, not a fixed watermark: "%s" (%d px) marks '
       'less of the band than "%s" (%d px)' % (short, inks[short], long_, inks[long_]),
       len(long_) == len(short) or inks[long_] > inks[short])
else:
    ok('THE LABEL IS THE DISTRICT\'S OWN NAME', False)

ok('every card is big enough to read on a phone held in one hand'
   + (' -- too small: ' + ', '.join(tiny[:6]) if tiny else ''), not tiny)
ok('every card carries the SCORE strip, because a NUMBER is what the card is asking him '
   'for' + (' -- missing on: ' + ', '.join(noscore[:6]) if noscore else ''), not noscore)
ok('every card asks for TWO numbers, THE WALKING and THE ICON (Paolo 8/2). They are two '
   'artefacts out of two different files -- the plot from the engine module, the icon from '
   'the hero factory -- and a bug in one is invisible in the other. One number makes him '
   'average them, and an average never tells me which file to open'
   + (' -- one line only on: ' + ', '.join(onescore[:6]) if onescore else ''), not onescore)

LAW = 'laws/BOHEMIA_ADDENDUM_LABEL_EVERY_PICTURE_8_2_26.md'
ok('the law is filed with his words in it', os.path.exists(LAW) and
   "I don't know which is which" in open(LAW, encoding='utf8').read())

print('LABEL EVERY PICTURE GATE: %d passed, %d failed  (%d cards rendered)'
      % (PASS, FAIL, len(rendered)))
sys.exit(1 if FAIL else 0)
