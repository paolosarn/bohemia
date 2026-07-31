#!/usr/bin/env python3
"""
BOHEMIA BOUGHT-FIRST GATE (7/31/26) — the shopping check must walk the shelf he
actually PAID for.

Paolo 7/31, LOCKED, FLEET-WIDE: "if i bought it i prefer it! Thats for all textures
bro!!!"  (laws/BOHEMIA_ADDENDUM_BOUGHT_BEATS_PAINTED_7_31_26.md)

THIS GATE EXISTS BECAUSE REUSE-FIRST WAS GREEN WHILE THE BOUGHT SHELF WENT UNOPENED.
The law requires a `REUSE CHECK:` naming the banks a tool walked, and TF-ART-001 had
one. It walked records/BOHEMIA_APPROVED_ASSET_INDEX — the shelf of what he has JUDGED.
It never opened the shelf of what he has BOUGHT. Two different shelves; the law only
ever made me name one.

CORRECTION, 7/31, ON THE RECORD: this gate's first draft said his purchased library
"already held a grey concrete block wall in running bond, verified by rendering it and
looking". IT DOES NOT, and I had not looked — I had keyword-matched a pack name. All
105 purchased wall tiles were afterwards decoded and viewed at size: "4. House wall
tiles" is a medieval ivy cottage, "wall tiles" is dungeon masonry, "3. Wall panels
and details" is sci-fi consoles, and 46 of 47 roof tiles are cyberpunk skyscraper
tops. He owns no concrete block wall. TF-ART-001 stands. The gate stands too, on the
better reason: the check it enforces is "OPEN the purchased library and say what you
found", which would have produced that answer on day one instead of a guess.

SO: any tool that cooks art must name a PURCHASED library in its REUSE CHECK, or say
in the same breath why none applies. "None applies" is a legal answer — a character
rig has nothing to buy against — but it has to be SAID, so the next person can see
the shelf was considered rather than forgotten.

AND THE HALF NOBODY HAD CHECKED AT ALL: what COLOUR his bought art is. Measured on
the exact bytes the run ships, 25 of his 33 purchased road/sidewalk tiles carry PURE
BLACK, up to 15% of the tile, against an act-1 palette law that forbids it. His
library is an asset-store bundle drawn for high-contrast fantasy; the existing
bought_beats_painted gate checks that his art SHIPS and ships FIRST, never what it
looks like. So this gate also holds the CONDITIONER (tools/bohemia_bought_conditioner
.py): his tiles moved into act-1 by a monotone remap, and PROVEN still his — same
size, same hue, same saturation, pixel for pixel — so "make it legal" can never
quietly become "repaint it".

Run from repo root:  python3 gates/bought_first_gate.py
"""
import base64, colorsys, io, json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image

LIBS = [f for f in sorted(os.listdir('banks'))
        if re.search(r'(SEAMLESS_SET|MASTER_SET|VARIANT_BANK)', f)]
LAW = 'laws/BOHEMIA_ADDENDUM_BOUGHT_BEATS_PAINTED_7_31_26.md'
QUOTE = 'if i bought it i prefer it'

COND = 'banks/BOHEMIA_BOUGHT_CONDITIONED_7_31_26.txt'
SRC = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
SHEET = 'records/target/BOUGHT_CONDITIONED.png'
FLOOR, CEIL = 17, 232

# the ART lane's cook tools. Scoped to this lane deliberately: widening it fleet-wide
# is a coordinator call, not mine to make from inside one lane.
# THIS LANE'S COOK TOOLS, NAMED ONE BY ONE. A pattern was tempting and wrong: it
# swept up tools/bohemia_house_art_factory.py, which belongs to another lane. Under
# ONE SYSTEM ONE SESSION I do not edit another lane's tool, and silently EXCLUDING it
# would hide a real finding — that file has no purchased-library check either, and
# its lane should know. So it is named here as a REPORTED finding rather than a
# failure I either fix or bury.
TOOLS = ['bohemia_cmu_cook.py', 'bohemia_house_cook.py',
         'bohemia_house_factory.py', 'bohemia_tileset_recook.py']
OTHER_LANES = ['bohemia_house_art_factory.py']

# a REUSE CHECK that considered the bought shelf says so one of these ways
NAMES_BOUGHT = re.compile(
    r'(SEAMLESS_SET|MASTER_SET|VARIANT_BANK|purchased librar|bought librar|'
    r'BOUGHT BEATS PAINTED|nothing purchased applies|no purchased)', re.I)

def rgba(im):
    """RGBA pixels as a list of 4-tuples, without the deprecated Image.getdata().

    Pillow 14 deprecates that call and it sprayed a DeprecationWarning into the
    shared gate log on every run, which every other lane reads. tobytes() is the
    supported path and is faster.
    """
    b = im.convert('RGBA').tobytes()
    return [tuple(b[i:i + 4]) for i in range(0, len(b), 4)]


P = F = 0

def ok(n, c, d=''):
    global P, F
    if c: P += 1
    else:
        F += 1; print('   FAIL  %s  %s' % (n, d))

def main():
    ok('his ruling is on file', os.path.exists(LAW), LAW)
    if os.path.exists(LAW):
        ok('the law still quotes him verbatim', QUOTE in open(LAW).read())
    ok('the purchased libraries are still in banks/', len(LIBS) >= 4,
       '%d found' % len(LIBS))
    ok('there are cook tools to hold', bool(TOOLS), 'none matched')

    for t in TOOLS:
        src = open('tools/' + t).read()
        head = src[:src.index('"""', src.index('"""') + 3) + 3] if src.count('"""') >= 2 else src[:4000]
        ok('%s documents a REUSE CHECK' % t, 'REUSE CHECK' in head)
        ok('%s\'s reuse check walked the shelf he PAID for' % t,
           bool(NAMES_BOUGHT.search(head)),
           'it names no purchased library and does not say why none applies - this is '
           'exactly how TF-ART-001 cooked a wall he already owned')

    # ---- HIS ART, MADE LEGAL, AND STILL PROVABLY HIS ----------------------
    ok('the conditioned bank exists', os.path.exists(COND), COND)
    if os.path.exists(COND):
        cond = json.load(open(COND))
        src = {(t['pack'], t['idx']): t for t in json.load(open(SRC))['tiles']
               if t.get('b64')}
        tiles = cond.get('tiles') or []
        ok('it carries his ruling verbatim', QUOTE in str(cond.get('ruling', '')))
        ok('it conditions a real number of his tiles', len(tiles) >= 24,
           '%d found' % len(tiles))

        illegal = repainted = orphan = 0
        for t in tiles:
            key = (t.get('pack'), t.get('idx'))
            s = src.get(key)
            if not s:
                orphan += 1          # not traceable to a tile he bought
                continue
            a = Image.open(io.BytesIO(base64.b64decode(s['b64']))).convert('RGBA')
            b = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
            if a.size != b.size:
                repainted += 1
                continue
            for (r0, g0, b0, al0), (r1, g1, b1, al1) in zip(rgba(a), rgba(b)):
                if al1 <= 8:
                    continue
                L = 0.299 * r1 + 0.587 * g1 + 0.114 * b1
                if L < FLOOR - 0.5 or L > CEIL + 0.5:
                    illegal += 1
                    break
            # HUE + SATURATION UNTOUCHED is what separates conditioning from repainting
            for (r0, g0, b0, al0), (r1, g1, b1, al1) in zip(rgba(a), rgba(b)):
                if al0 <= 8 or al1 <= 8:
                    continue
                if max(r0, g0, b0) < 8:      # black has no hue to preserve
                    continue
                h0, s0, _v0 = colorsys.rgb_to_hsv(r0 / 255., g0 / 255., b0 / 255.)
                h1, s1, _v1 = colorsys.rgb_to_hsv(r1 / 255., g1 / 255., b1 / 255.)
                dh = abs(h0 - h1)
                if min(dh, 1 - dh) > 0.06 or abs(s0 - s1) > 0.16:
                    repainted += 1
                    break

        ok('every conditioned tile traces to a tile he BOUGHT', orphan == 0,
           '%d have no source in %s - that is new art wearing his label'
           % (orphan, os.path.basename(SRC)))
        ok('every conditioned tile is act-1 legal (no pure black, no white)',
           illegal == 0, '%d still out of [%d,%d]' % (illegal, FLOOR, CEIL))
        ok('conditioning did NOT repaint his art (size, hue and saturation held)',
           repainted == 0,
           '%d tiles drifted - the transform is only allowed to move the black point'
           % repainted)
        ok('the before|after sheet is on file for his eyes', os.path.exists(SHEET),
           SHEET)

    for t in OTHER_LANES:
        if not os.path.exists('tools/' + t):
            continue
        src = open('tools/' + t).read()[:4000]
        if not NAMES_BOUGHT.search(src):
            print('   NOTE  %s (ANOTHER LANE\'S TOOL) names no purchased library '
                  'either. Not mine to edit and not mine to hide: that lane should '
                  'check it against BOUGHT BEATS PAINTED.' % t)

    print('   BOUGHT-FIRST GATE: %d passed, %d failed  (%d cook tools, %d purchased '
          'libraries)' % (P, F, len(TOOLS), len(LIBS)))
    return 1 if F else 0

if __name__ == '__main__':
    sys.exit(main())
