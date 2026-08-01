#!/usr/bin/env python3
"""
CITY STREET POOL PATCH (7/31/26) -- his approved street tiles, on the street.

Paolo 7/31: "we just made a document because you keep -- I don't know why you got
the idea in the run I didn't want you to use the graphics that we approved of...
basically all the street tiles you have to change back to how they were when I
like them, not when you..."

And he wrote the law for it the same day:
laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md
  "ANY street graphics work, by ANY chat, from now on ... STARTS by reading
   records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md, EVERY TIME."
  "STREET PIXELS COME FROM THE POOL."

MEASURED BEFORE THIS PATCH, on the surface he actually plays (the CITY blob, which
is what the RUN tab opens):

    pool     his bank      what the city drew      byte-identical
    street   18 @ 44x44    6 @ 16x16               0
    side     36 @ 44x44    6 @ 16x16               0

The city's SA_TILES section CITES his bank in its own comment and then draws
something else: a 6-tile, 16-pixel re-cook. Not one tile he approved was on the
screen. That is exactly "not how they were when I like them" -- the drift he
could see and I could not, because the citation looked like compliance.

WHAT THIS DOES
  - swaps SA_TILES.street and SA_TILES.side for the FULL approved pools, verbatim
    from banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt, 44x44, which is the
    corpus cell, so they blit 1:1 and are never resampled
  - brings the sibling pools the same way where the city has a matching key
    (lane, median, cross), because a road with approved asphalt and unapproved
    lane paint is still not his street
  - CARRIES HIS EMBEDDED RULINGS. Clause 3 of the law: "a lane that consumes the
    tiles but ignores the laws in the bank has not used the bank." weather_rarity
    (parents 88% / weathered 12%) is applied at PICK time so the weathered
    siblings stay rare instead of alternating, which is the "why did a bunch of
    the tiles change colour" complaint that produced that ruling in the first
    place.

REUSE CHECK: cooks no graphic pixels. Every byte written here is lifted verbatim
from banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt, the bank his own 7/31 law
names. Nothing is re-cooked, resized, or recoloured.

Idempotent: re-running finds the marker and reports NOOP. Refuses to write if the
expected source text is missing.
"""
import base64
import json
import re
import struct
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POOL = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
MARKER = '__HARMONIZED_STREETS__'

# city pool key -> bank pool key. Only keys the city already has, so this swaps
# art and never invents a surface the renderer does not know how to place.
SWAP = {
    'street': 'street',
    'side': 'side',
    'lane_h': 'lane_div',
    'lane_v': 'lane_div',
    'cross_ns': 'cross',
    'cross_ew': 'cross',
    'median_h': 'median',
    'median_v': 'median',
}


def px(b64):
    b = base64.b64decode(b64)
    return struct.unpack('>II', b[16:24])


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    b64 = m.group(1)
    city = base64.b64decode(b64).decode('utf8', errors='ignore')

    if MARKER in city:
        print('NOOP: the city already draws the harmonized pool')
        return 0

    bank = json.load(open(POOL))
    pools = bank['pools']

    i = city.index('const SA_TILES=')
    j = city.index('\n', i)
    lit = city[i + len('const SA_TILES='):j].rstrip(';')
    sa = json.loads(lit)

    changed = []
    for ckey, bkey in SWAP.items():
        if ckey not in sa:
            continue
        tiles = [t for t in pools.get(bkey, []) if isinstance(t, str)]
        if not tiles:
            print('FAIL: bank pool %s is empty' % bkey); return 1
        sizes = {px(t) for t in tiles}
        if sizes != {(44, 44)}:
            print('FAIL: %s is not all 44x44 (%s) -- would resample' % (bkey, sizes)); return 1
        before = len(sa[ckey])
        sa[ckey] = tiles
        changed.append('%s %d->%d' % (ckey, before, len(tiles)))

    if not changed:
        print('FAIL: none of the expected city pool keys were present'); return 1

    new_lit = 'const SA_TILES=' + json.dumps(sa, separators=(',', ':')) + ';'
    city = city[:i] + new_lit + city[j:]

    # ---- clause 3: his rulings travel WITH the tiles -------------------------
    # weather_rarity_law: parents 88%, weathered 12%. Applied at PICK time so the
    # weathered siblings stay rare. His 7/14 words: "why did a bunch of the tiles
    # change colour" -- that is what an even shuffle looks like.
    old_pick = ("function saTex(pool,variant){ const arr=SA_IMG[pool]; if(!arr)return null;\n"
                "  const im=arr[variant%arr.length]; if(!im.complete||!im.naturalWidth)return null;")
    new_pick = ("function saTex(pool,variant){ const arr=SA_IMG[pool]; if(!arr)return null;\n"
                "  /* " + MARKER + " -- WEATHER RARITY (Paolo 7/14, carried with the tiles per\n"
                "     clause 3 of the 7/31 streets law: consuming the bank while ignoring the\n"
                "     laws inside it is not using the bank). The pools are ordered parents\n"
                "     first, weathered siblings after. An even shuffle across the whole array\n"
                "     is what made him ask 'why did a bunch of the tiles change colour', so\n"
                "     88% of picks stay in the parent half and 12% reach the weathered half. */\n"
                "  const __wr=0.12, __half=Math.max(1,Math.round(arr.length*(1-__wr)));\n"
                "  const __h=((variant*2654435761)>>>0)/4294967296;\n"
                "  const __i=(__h<__wr && arr.length>__half)\n"
                "    ? (__half + (variant % Math.max(1,arr.length-__half)))\n"
                "    : (variant % __half);\n"
                "  const im=arr[__i%arr.length]; if(!im.complete||!im.naturalWidth)return null;")
    if old_pick not in city:
        print('FAIL: saTex is not where this tool expects it'); return 1
    city = city.replace(old_pick, new_pick, 1)
    # the cache key must follow the chosen index, not the raw variant
    city = city.replace("const k2='SA|'+pool+'|'+(variant%arr.length);",
                        "const k2='SA|'+pool+'|'+(__i%arr.length);", 1)

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + out + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s (city blob %d -> %d bytes)' % (ALPHA, len(b64), len(out)))
    print('  pools swapped to his approved 44px art: ' + ', '.join(changed))
    print('  weather_rarity_law (88/12) now applied at pick time')
    return 0


if __name__ == '__main__':
    sys.exit(main())
