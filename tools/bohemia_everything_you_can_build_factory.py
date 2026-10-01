#!/usr/bin/env python3
"""BOHEMIA — EVERYTHING YOU CAN BUILD (10/1/26, LIFE + CITY, row [build a lot], round 3).

THE ROUND'S COOK (rule 22): the whole build list, every one of the eight drawn, on the street he approved.

WHY THIS AND NOT THE 9/29 CATALOG SHEET. That sheet cut each piece out of its district's MAP BLOCK and
the cards read as flat blocks twice -- the look he killed ("this isn't Atari"); it was never shipped.
This one cuts each piece out of THE SAME STREET (UP three times over), where every one of the eight is
now drawn in that street's own planes, light and palette: the wall and the lidded tank (round 2), the
shed, the pump house, the garden bed and the new roof (this round), the solar array and the swap stand
(the approved act-2/act-3 art). Each card is the street with exactly that ONE thing built, cropped to
where it stands, so a card is never a block on black.

*** THE WORDS ON EACH CARD ARE THE MODULE'S, NOT MINE. *** Name, order, cost and what each one makes or
does are read from engine/bohemia_lotbuild.js (CATALOG, COST, DAYS, makesOf, the six-name, guards,
houses). The factory REFUSES if the module lists a thing this sheet cannot draw, or draws a thing the
module does not list, so the sheet and the game cannot drift.

THE ANALOG HORROR LINE (rule 30): eight cards of a street getting better, and in the corner of the
cards that reach the third house, its window is lit, on a circuit nobody pays for, in every one.

REUSE CHECK: every pixel is the approved street's own panel() out of
tools/bohemia_the_same_street_three_times_factory.py, with one LOT_ITEM switched on per card; the
approved pictures stay byte-identical (md5 checked the round the four new pieces were added). The
garden's olive is the school kit's own garden-bed colour (legend code 13). Only captions are drawn here.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: the approved street's own frames.
  BLDG-03  three planes, one light direction. Held: every new piece is lit on its north edge and
           throws its shadow south, like the street's roofs.
  BLDG-05  structural sanity. Held: the shed and the tank and the garden stand behind houses, the pump
           house in the margin with its main at ground level, the roof is laid on the house it covers.

DETERMINISTIC.

Run from repo root:  python3 tools/bohemia_everything_you_can_build_factory.py
Writes: slices/vote/LIFECITY_EVERYTHING_YOU_CAN_BUILD_10_1.png
"""
import importlib.util, json, os, subprocess, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location(
    'street', os.path.join(HERE, 'bohemia_the_same_street_three_times_factory.py'))
street = importlib.util.module_from_spec(spec)
spec.loader.exec_module(street)

OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_EVERYTHING_YOU_CAN_BUILD_10_1.png')
CW, CH, BAND, SCALE, COLS = 96, 64, 50, 3, 4
ZOOM = 2          # each card is a 48x32 window of the street, doubled, so the thing fills it
# what each catalog id is drawn as on the street, and where on the street it stands (crop x, y)
DRAWN_AS = {
    'wall':   (['wall'], (0, 30)),
    'tank':   (['tank'], (34, 0)),
    'shed':   (['shed'], (0, 0)),
    'pump':   (['pump'], (120, 0)),
    'garden': (['garden'], (118, 0)),
    'solar':  (['array1', 'topwin'], (0, 18)),
    'stall':  (['swap'], (110, 36)),
    'roof':   (['roof'], (0, 18)),
}

HARVEST = r'''
process.exit=function(){}; console.log=function(){};
const path=require('path'), fs=require('fs'); const ROOT=process.argv[2], OUTF=process.argv[3];
const LB=require(path.join(ROOT,'engine/bohemia_lotbuild.js'));
const out=LB.CATALOG.map(e=>({id:e.id,name:e.name,first:!!e.first,six:e.six,guards:e.guards||null,houses:!!e.houses,
  makes:LB.makesOf(e.id),fight:e.fight}));
fs.writeFileSync(OUTF, JSON.stringify({cost:LB.COST, days:LB.DAYS, list:out}));
'''


def harvest():
    tmp, outf = os.path.join(ROOT, '.buildlist.js'), os.path.join(ROOT, '.buildlist.json')
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, ROOT, outf], cwd=ROOT, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL, timeout=120)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing.')
        return json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)


def does(e):
    """What the card says the thing does, from the module's own fields only: what it makes or houses,
    then what it guards (the invasive round), each its own line."""
    m = e['makes'] or {}
    if e['houses']:
        first = 'HOUSES A FAMILY'
    elif 'clout' in m:
        first = 'MAKES YOUR NAME'
    elif e['six']:
        amt = list(m.values())[0] if m else 0
        first = '+%d %s A DAY' % (amt, {'batteries': 'BATTERY'}.get(e['six'], e['six'].upper()))
    else:
        first = 'MAKES NOTHING'
    return [first] + (['NO %s' % e['guards'].upper()] if e['guards'] else [])


def caption(lines):
    im = Image.new('RGB', (CW, BAND), (22, 22, 26))
    d = ImageDraw.Draw(im)
    for i, (t, col) in enumerate(lines):
        if d.textlength(t) > CW - 4:
            sys.exit('REFUSING: %r does not fit its card.' % t)
        d.text((2, 1 + i * 12), t, fill=col)
    return im


def main():
    data = harvest()
    ids = [e['id'] for e in data['list']]
    if set(ids) != set(DRAWN_AS):
        sys.exit('REFUSING: the module lists %s and this sheet draws %s.' % (sorted(ids), sorted(DRAWN_AS)))
    cost = '%d BATTERY %d DAY' % (data['cost']['amount'], data['days'])
    if data['cost']['currency'] != 'electricity':
        sys.exit('REFUSING: the cost is no longer batteries; the card would lie.')
    P = street._pal()
    WHITE, GREEN, GOLD = (232, 234, 228), (190, 204, 170), (226, 200, 132)
    rows = (len(ids) + COLS - 1) // COLS
    sheet = Image.new('RGB', (COLS * (CW + 2) - 2, rows * (CH + BAND + 2) - 2), (12, 12, 14))
    for i, e in enumerate(data['list']):
        has, (cx, cy) = DRAWN_AS[e['id']]
        card = street.panel(P, 1, has=has).crop((cx, cy, cx + CW // ZOOM, cy + CH // ZOOM)).resize((CW, CH), Image.NEAREST)
        name = e['name']   # the first two are in gold: what a held part builds before anything else
        cap = caption([(name, GOLD if e['first'] else WHITE), (cost, GREEN)] + [(t, GREEN) for t in does(e)])
        x, y = (i % COLS) * (CW + 2), (i // COLS) * (CH + BAND + 2)
        sheet.paste(cap, (x, y))
        sheet.paste(card, (x, y + BAND))
    sheet = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)
    print('EVERYTHING YOU CAN BUILD  ([build a lot] round 3)')
    for e in data['list']:
        print('  %-13s %-16s %s' % (e['name'], cost, ' / '.join(does(e))))
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
