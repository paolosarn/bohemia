#!/usr/bin/env python3
"""THE YARD HE ALREADY APPROVED -- COOK, 9/13/26. [streets fixed], round 2.

*** PAOLO 9/13, HAVING PLAYED THE DEMO: "it looks like shit... the streets don't look like
streets... glitchy, buggy, nothing's complete... I would like to see [THE TINY PARTS] COME
MORE TOGETHER." *** Round 1 of this row cooked the road and the sidewalk. Then I did what
the row actually says -- START ON THE BIGGEST LIE BY SCREEN AREA -- and asked the running
game which pool every cell around him is drawn from. THE STREET IS NOT THE BIGGEST THING ON
HIS SCREEN AND IT IS NOT CLOSE.

    841 cells around the player, first five minutes, phone-shaped browser:

        hyard              605 cells   72%     <-- three tiles, 16x16
        flat colour, no pool 138 cells 16%
        street              70 cells    8%     <-- the 18 tiles round 1 cooked
        side                28 cells    3%

*** SEVENTY-TWO PERCENT OF HIS FIRST FIVE MINUTES IS THREE SIXTEEN-PIXEL TILES. ***

AND THEY ARE NOT DRAWN AT SIXTEEN PIXELS, WHICH IS THE PART THAT MAKES IT LOOK BROKEN.
saTex() bakes every tile into a TPX=44 cell:

    const c2=document.createElement('canvas'); c2.width=TPX; c2.height=TPX;
    c2.getContext('2d').drawImage(im,0,0,TPX,TPX);

A 44x44 tile lands 1:1 and is lossless. A 16x16 tile is blown up x2.75 -- a NON-INTEGER
SCALE, which this repo's own mobile render contract calls BANNED -- and that context never
turns smoothing off, so it is BILINEAR-BLURRED on the way up. Three-quarters of his screen
is a blurred 16-pixel tile sitting next to a crisp 44-pixel road.

*** AND PAOLO ALREADY RULED ON EXACTLY THIS, IN THOSE WORDS, AND THE FIX MISSED THE YARD.
The comment on TPX quotes him (8/1): "the pixel quality... of the terrain OF THE GROUND OF
THE HOUSES... it's so bad". TPX was raised 22 -> 44 so his 44-pixel art would reach the
glass at 1:1. The street art is 44 and got the benefit. THE GROUND OF THE HOUSES IS STILL
16 AND NEVER DID. He named the ground of the houses and the ground of the houses is the one
thing that was not fixed. ***

WHAT hyard ACTUALLY IS. It is the FALLBACK, and it is also the DEFAULT. The pool comes from
banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt, the 7/21 house-skin verdict, and
gates/banks_used_gate.js already carries a waiver saying that set was SUPERSEDED ON 8/1 and
is "kept loaded as the fallback". Meanwhile the walked city's pool table ends
`:(_k==='water')?null:'hyard'` -- every cell that is not a road, a walk or water falls
through to it. So a superseded 7/21 fallback is the default surface of the game.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): NOTHING IS DRAWN HERE. NOT ONE PIXEL. Swept every
ground bank in banks/ and measured all 42 tiles of the approved act-1 set against every
tile the walked city actually draws, by pixel hash, and then LOOKED at them side by side
because a hash cannot see a recolour.

    USED: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, yard_0 / yard_1 / yard_2.
    cell_px: 44. family: ground. FIVE COLOURS EACH, already inside the craft law ceiling of
    64 with room to spare, so there is nothing to cook -- only to place.
    Its authority line, verbatim: Paolo 7/28/26, "I checked it to do the other 41 mark it
    approved." Verdict record: records/BOHEMIA_PIXEL_CRAFT_VERDICT_7_28_26.txt

    *** AND THE MEASUREMENT THAT SHOULD EMBARRASS ALL OF US: ALL FORTY-TWO OF THE TILES HE
    APPROVED ON 7/28 ARE DRAWN BY THE WALKED CITY EXACTLY ZERO TIMES. Every road, walk,
    yard, wall, roof, door and garage tile in the set he personally signed off is sitting in
    a bank nobody reads. That includes walk_kerb and road_gutter -- THE KERB THIS ROW ASKS
    FOR ALREADY EXISTS, AT 44 PIXELS, APPROVED, UNDRAWN. ***

    CONSIDERED AND NOT USED: the 7/21 house-skin yard (that is the 16px art being replaced,
    and it is the superseded set); slices/BOHEMIA_CITY_TILEFORMS.js (44px and healthy, but
    its pools are props and interior forms, and tf_cu is a COOLING UNIT, not a curb -- I
    checked, because the name nearly cost this lane a round); the interior floor pool cooked
    8/26 (indoor floors).

NEWEST DATE WINS, and it is not close: the tileset recook is 7/28 and carries his approval
verbatim; the house-skin set is 7/21 and is documented as superseded on 8/1. The 16-pixel
yard is older, superseded, blurred and 72% of his screen.

WHY THIS NEEDS NO RENDERER CHANGE AT ALL, which is the whole reason it is safe:
  * the pool KEY stays `hyard`
  * the COUNT stays three, so `bh%3` picks exactly as it did, no index moves
  * only the BYTES change, and they change from 16x16 to 44x44, which is the size saTex
    was already asking for
This tool touches an ART PAYLOAD -- a base64 array -- and not one line of logic. It is the
same class of edit as cooking the tile bank.

REFERENCE CHECK

COMPARED TO: TG-03 (the yard tile: "a Vegas yard is GRAVEL OR HARDPAN inside a block wall,
NO LAWN IN ACT 1"), CGRD-03 (a Vegas block from the air: "the ground alphabet is HOUSE /
YARD / STREET / LOT and almost nothing else"), and the approved act-1 starter tileset,
which is the repo being its own ruler.

STRUCTURAL RULES TAKEN:
  * TG-03 says a yard is HARDPAN WITH GRAVEL ON IT. Rendered both sets side by side at 3x
    and looked: yard_0/1/2 are tan hardpan with scattered darker gravel, crisp at 44. The
    16px set is three near-flat blobs -- and ONE OF THEM IS TERRACOTTA RED, which is not a
    Vegas yard in any season.
  * CGRD-03 -- the ground alphabet is short, and YARD is one of its four letters. It should
    be the letter he approved.

WHAT CHANGED FROM THE REFERENCE: nothing. The reference IS the art. This places it.

    python3 tools/bohemia_the_yard_he_approved_cook_9_13_26.py            measure only
    python3 tools/bohemia_the_yard_he_approved_cook_9_13_26.py --write    place it
"""
import re, io, os, sys, json, base64
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
WANT = ['yard_0', 'yard_1', 'yard_2']
CEILING = 64


def decode(b):
    return Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGBA')


def describe(b):
    im = decode(b)
    return im.size, len({c[:3] for c in im.getdata() if c[3] >= 128})


def main():
    write = '--write' in sys.argv
    bank = {t['id']: t['b64'] for t in json.load(io.open(BANK, encoding='utf-8'))['tiles']}
    missing = [w for w in WANT if w not in bank]
    if missing:
        sys.exit('the approved bank has no %s -- refusing' % ', '.join(missing))
    new = [bank[w] for w in WANT]

    page = io.open(PAGE, encoding='utf-8').read()
    m = re.search(r'(SA_TILES\.hyard=\[)(.*?)(\];)', page, re.S)
    if not m:
        sys.exit('SA_TILES.hyard not found in the walked city page -- refusing')
    old = re.findall(r'"(iVBOR[A-Za-z0-9+/=]+)"', m.group(2))

    # GUARD: the picker is bh%3. If the pool is not three, this swap moves an index.
    if len(old) != len(new):
        sys.exit('hyard holds %d tiles and the bank offers %d -- the picker is bh%%3 and a '
                 'different count would move an index. Refusing.' % (len(old), len(new)))
    if old == new:
        print('the approved yard is already placed. nothing to do.')
        return 0

    print('THE YARD HE APPROVED -- SA_TILES.hyard, the default pool of the walked city')
    print('  72%% of his first five minutes is drawn from these %d tiles.\n' % len(old))
    print('  %-10s %-9s %-9s %8s %8s' % ('', 'was size', 'now size', 'was col', 'now col'))
    for i, (o, n) in enumerate(zip(old, new)):
        (ow, oh), oc = describe(o)
        (nw, nh), nc = describe(n)
        print('  %-10s %-9s %-9s %8d %8d   %s'
              % (WANT[i], '%dx%d' % (ow, oh), '%dx%d' % (nw, nh), oc, nc,
                 'over the ceiling' if nc > CEILING else ''))
    print('\n  scale into the TPX=44 bake: was x%.2f (blurred), now x1.00 (lossless)'
          % (44.0 / decode(old[0]).size[0]))

    if write:
        body = ',\n'.join('"%s"' % b for b in new)
        page = page[:m.start(2)] + body + page[m.end(2):]
        io.open(PAGE, 'w', encoding='utf-8').write(page)
        # read it back rather than trust the write
        again = re.search(r'SA_TILES\.hyard=\[(.*?)\];',
                          io.open(PAGE, encoding='utf-8').read(), re.S)
        got = re.findall(r'"(iVBOR[A-Za-z0-9+/=]+)"', again.group(1))
        if got != new:
            sys.exit('wrote hyard and read back something else -- STOP')
        print('\n  PLACED. Same pool key, same three tiles, same picker. Only the bytes moved,')
        print('  from a superseded 16-pixel fallback to the 44-pixel yard he approved on 7/28.')
    else:
        print('\n  measure only. pass --write to place it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
