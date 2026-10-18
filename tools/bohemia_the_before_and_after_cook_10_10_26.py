#!/usr/bin/env python3
"""THE TWO BEFORE-AND-AFTERS PLUMBER'S NOTE OWED  (COOK, 10/10/26, rule 89)

PAOLO 10/10, on a tile that was measured sharper and that he voted NO on: "Can't tell
difference. Looks like dogshit." Rule 89: a look item is shown as a BEFORE AND AN AFTER OF THE
SAME THING, side by side in one picture, AT ONE ART PIXEL TO ONE PHONE PIXEL; a number is the
proof line, never the show. PLUMBER's note: the cook gate refuses three of this lane's sheets
for having no such picture. The far end's is made by its own re-cut tool; these are the other
two, and each one is the same thing twice with nothing scaled.

  THE PROPS     COMBAT TWO's gas station forecourt as it shipped -- a canopy on posts over an
                EMPTY island -- and the same crop with the pumps on it. That IS the before and
                after: the row's whole premise was that the forecourt had no pumps.
  HIS BLOCK     the block as it is built, and the same crops after the finish (rain down the
                walls, the ground worn where people walk, what they dropped). Six 96 px
                windows of the same picture, same places, same size.

*** AND A CROP IS CHOSEN BY MEASUREMENT, NOT BY EYE. *** A before-and-after that crops where
nothing changed is how a lane shows a difference it did not make. The block's windows are the
six 96 px patches WHERE THE FINISH CHANGED THE MOST, found by differencing the two pictures,
so the sheet shows the work rather than hiding it.

    python3 tools/bohemia_the_before_and_after_cook_10_10_26.py
      -> slices/vote/COOK_THE_PROPS_BEFORE_AND_AFTER.png
      -> slices/vote/COOK_HIS_BLOCK_BEFORE_AND_AFTER.png
      -> records/BOHEMIA_THE_BEFORE_AND_AFTER_MEASURED_10_10_26.txt

REFERENCE CHECK (the 9/4 standing law): rule 89 itself is the reference, in his own words, and
the test is whether the difference is visible in the picture at 1:1 rather than in a number.
  REUSE CHECK: nothing is drawn. The gas station is COMBAT TWO's own building_types cook, the
  pumps are this lane's own 10/10 props bank, and the block's two states come from this lane's
  own 10/10 his-block cook, all imported and called.

[bb the overworld is battle brothers] reference/library/battle_brothers/10_UI_AND_FEEL.md,
  THE FEEL: their art is judged in the place it is used, never as a swatch. WHAT MOVES THAT
  THEIR PICTURE DOES NOT (rule 33g): nothing moves here. The lesson taken is that a prop is
  shown ON ITS OWN BUILDING and a finish is shown ON ITS OWN BLOCK, because a pump on a black
  background proves nothing about a forecourt.
"""
import base64, importlib, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)

PROPS = 'banks/BOHEMIA_THE_BUILDING_PROPS_10_10_26.txt'
OUT_PROPS = 'slices/vote/COOK_THE_PROPS_BEFORE_AND_AFTER.png'
OUT_BLOCK = 'slices/vote/COOK_HIS_BLOCK_BEFORE_AND_AFTER.png'
OUT_REC = 'records/BOHEMIA_THE_BEFORE_AND_AFTER_MEASURED_10_10_26.txt'

BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
def die(m): sys.exit('REFUSED: ' + m)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def sheet(title, sub, pairs, notes, label_a, label_b):
    """ONE PICTURE, BOTH HALVES, NOTHING SCALED. The two rows are the same crops in the same
       order so the eye can run straight down from one to the other."""
    w = sum(p[0].size[0] + 8 for p in pairs) + 8
    h = max(p[0].size[1] for p in pairs)
    f16, f12, f11 = font(16), font(12), font(11)
    im = Image.new('RGB', (max(w, 700), 64 + (h + 26) * 2 + 24 + 20 * len(notes)), BG)
    d = ImageDraw.Draw(im)
    d.text((10, 10), title, font=f16, fill=INK)
    d.text((10, 32), sub, font=f11, fill=DIM)
    for r, (lab, idx) in enumerate(((label_a, 0), (label_b, 1))):
        y = 56 + r * (h + 26)
        d.text((10, y), lab, font=f12, fill=HOT)
        x = 8
        for p in pairs:
            im.paste(p[idx], (x, y + 18))
            x += p[0].size[0] + 8
    y = 56 + 2 * (h + 26) + 10
    for n in notes:
        d.text((10, y), n, font=f11, fill=DIM if n.startswith('  ') else INK)
        y += 20
    return im


def the_props():
    """THE FORECOURT, EMPTY AND THEN NOT. Their own gas station, then the same picture with
       this lane's pumps standing on its island."""
    BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')
    gs = BT.gas_station(7)
    if isinstance(gs, tuple): gs = gs[0]
    before = gs.convert('RGBA')
    after = before.copy()
    bank = json.load(open(PROPS))
    pumps = next((p for p in bank['pieces'] if p['name'].startswith('FUEL PUMPS')), None)
    if pumps is None: die('the props bank has no pumps')
    pim = Image.open(io.BytesIO(base64.b64decode(pumps['b64']))).convert('RGBA')
    # on the forecourt, centred, its feet on the apron: the point is the same crop twice
    x = (after.size[0] - pim.size[0]) // 2
    y = int(after.size[1] * 0.62)
    after.paste(pim, (x, y), pim)
    box = (max(0, x - 40), max(0, y - 150), min(after.size[0], x + pim.size[0] + 40),
           min(after.size[1], y + pim.size[1] + 30))
    return [(before.crop(box).convert('RGB'), after.crop(box).convert('RGB'))], pumps


def the_block():
    """THE BLOCK, BUILT AND THEN FINISHED, in the six 96 px windows WHERE THE FINISH CHANGED
       THE MOST, found by differencing the two pictures rather than picked by eye."""
    H = importlib.import_module('bohemia_his_block_as_a_place_cook_10_10_26')
    H.count_text_draws()
    day, spots, lights, ground_layer = H.his_block(H.SEED)
    before = day.copy()
    H.finish(day, ground_layer, spots, H.SEED)
    a = np.asarray(before.convert('RGB'), np.int16)
    b = np.asarray(day.convert('RGB'), np.int16)
    diff = np.abs(a - b).sum(axis=2)
    C = 96
    hh, ww = diff.shape
    tiles = []
    for yy in range(0, hh - C, C):
        for xx in range(0, ww - C, C):
            tiles.append((float(diff[yy:yy + C, xx:xx + C].mean()), xx, yy))
    tiles.sort(reverse=True)
    chosen, taken = [], []
    for sc, xx, yy in tiles:
        if any(abs(xx - px) < C and abs(yy - py) < C for px, py in taken): continue
        taken.append((xx, yy)); chosen.append((sc, xx, yy))
        if len(chosen) == 6: break
    pairs = [(before.crop((x, y, x + C, y + C)).convert('RGB'),
              day.crop((x, y, x + C, y + C)).convert('RGB')) for _, x, y in chosen]
    return pairs, chosen


def changed(pairs):
    """HOW MUCH THE PICTURE ACTUALLY MOVED, as the share of pixels that are not the same colour
       they were. This is the number that decides whether rule 89 was honoured or dodged."""
    tot = ch = 0
    for a, b in pairs:
        x = np.asarray(a, np.int16); y = np.asarray(b, np.int16)
        tot += x.shape[0] * x.shape[1]
        ch += int((np.abs(x - y).sum(axis=2) > 6).sum())
    return 100.0 * ch / max(1, tot)


def main():
    log = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        return cond

    pp, pumps = the_props()
    pch = changed(pp)
    bp, chosen = the_block()
    bch = changed(bp)

    fails = []
    for line, cond, why in (
        ('THE PROPS SHEET IS THE SAME CROP TWICE AND THE PICTURE REALLY MOVED: %.1f%% of its '
         'pixels changed between the two halves' % pch, pch >= 2.0,
         'a before-and-after that shows no change is how a lane dodges rule 89'),
        ('THE BLOCK SHEET IS THE SAME SIX CROPS TWICE AND THE PICTURE REALLY MOVED: %.1f%% of '
         'its pixels changed' % bch, bch >= 2.0,
         'a crop chosen where nothing happened proves nothing'),
        ('AND THE BLOCK\'S WINDOWS WERE FOUND BY DIFFERENCING THE TWO PICTURES, NOT PICKED BY '
         'EYE: the six busiest 96 px patches, none overlapping (%s)'
         % ', '.join('%d,%d' % (x, y) for _, x, y in chosen), len(chosen) == 6, ''),
        ('NOTHING IS SCALED IN EITHER SHEET: every crop is pasted at one art pixel to one '
         'phone pixel', all(a.size == b.size for a, b in pp + bp), '')):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails: die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('slices/vote', exist_ok=True)
    sheet('THE GAS STATION FORECOURT, BEFORE AND AFTER',
          'their own building, the same crop twice, one art pixel to one phone pixel',
          pp,
          ['%.1f%% of the pixels in this crop changed. The row\'s whole premise was that their '
           'forecourt' % pch,
           'had the canopy and NOT A PUMP ON IT, and that is what the top half is.',
           '  the pumps are %.2f x %.2f m and %.2f m high, a BLOCKER against a chest at 1.30 m'
           % (pumps['w'], pumps['l'], pumps['h'])],
          'BEFORE: their gas station as it shipped', 'AFTER: with this lane\'s pumps on it'
          ).save(OUT_PROPS, optimize=True)
    sheet('HIS BLOCK, BEFORE AND AFTER THE FINISH',
          'the six 96 px windows where the finish changed the most, found by differencing the '
          'two pictures, never picked by eye',
          bp,
          ['%.1f%% of the pixels in these windows changed: rain brought the roofs\' dirt down '
           'the walls,' % bch,
           'the ground went pale where people actually walk, and what they drop is where they '
           'stand.'],
          'BEFORE: the block as it is built', 'AFTER: the same windows, finished'
          ).save(OUT_BLOCK, optimize=True)

    L = []
    A = L.append
    A('THE TWO BEFORE-AND-AFTERS PLUMBER\'S NOTE OWED -- MEASURED (COOK 10/10/26, rule 89)')
    A('=' * 78)
    A('')
    A('PAOLO 10/10, on a tile measured sharper that he voted NO on: "Can\'t tell difference.')
    A('Looks like dogshit." Rule 89: a look item is a BEFORE AND AN AFTER OF THE SAME THING,')
    A('side by side, at one art pixel to one phone pixel; a number is the proof line, never the')
    A('show. The cook gate refuses a look item without one, and it was refusing three of this')
    A('lane\'s sheets. The far end\'s picture is made by its own re-cut tool; these are the')
    A('other two.')
    A('')
    A('  THE PROPS    their gas station forecourt as it shipped, a canopy over an EMPTY island,')
    A('               and the same crop with the pumps on it. %.1f%% of the crop changed.' % pch)
    A('  HIS BLOCK    the block built, and the same six windows finished. %.1f%% changed.' % bch)
    A('')
    A('*** AND A CROP IS CHOSEN BY MEASUREMENT, NOT BY EYE. *** A before-and-after cropped')
    A('where nothing happened is how a lane shows a difference it did not make. The block\'s six')
    A('windows are the 96 px patches WHERE THE FINISH CHANGED THE MOST, found by differencing')
    A('the two pictures, none of them overlapping:')
    for sc, x, y in chosen:
        A('  at %4d,%4d   mean change %.1f' % (x, y, sc))
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_PROPS, OUT_BLOCK, OUT_REC))


if __name__ == '__main__':
    main()
