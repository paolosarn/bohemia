#!/usr/bin/env python3
"""
CITY FULL PIXEL PATCH (8/1/26) -- HIS ART, AT THE RESOLUTION HE DREW IT.

Paolo, three separate times:
  7/31 "WHY WHEN I ZOOM IN ARE ALL THE QUALITY OF THE PIXELS OF THE TILES SO
       DOGSHIT??? WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF"
  8/1  "when I say pixel quality, I mean of the terrain of the ground of the
       houses it looks. It's it's not. It's so bad"

THE ANSWER, MEASURED ON THE SURFACE HE PLAYS

  The world blits 22x22 -> 22x22. His approved tiles are 44x44.

  The ground is baked into per-chunk texture canvases at TPX=22 texture pixels
  per cell. His street/side pools are 44px. So every tile he judged is DECIMATED
  2:1 on the way into the chunk, and the chunk is then blitted. Half of every
  pixel he approved is discarded before it is ever composited, at every zoom.

  That is why zooming IN does not help and he called it out specifically: the
  zoom stops are HC in [11,22,44,88], so HC=44 blits the chunk at 2x and HC=88 at
  4x -- but they are 2x and 4x of the ALREADY-HALVED bake. There is no zoom at
  which his 44px art has ever been on screen at 1:1. Not once.

  Measured in the walked world, a 140px ground sample vs his own bought art:
      drawn ground   edge  6.58   grain 23%    (what he sees)
      his bought art edge 18.40   grain 61%    (what he approved)
  A 2:1 decimation is exactly the kind of loss that flattens local contrast and
  kills grain, and it lands on terrain, ground AND houses -- every word he used.

WHAT THIS IS NOT (both already tried and both wrong, recorded so nobody repeats)
  NOT devicePixelRatio. The city sizes its backing store 1:1 with the CSS box on
    purpose so the phone does a pure integer x3; raising it was a placebo that
    cost 9x memory for identical pixels.
  NOT image-rendering. screenFilter() (CITY lane, 7/27) already sets `pixelated`
    for the walked world and deliberately leaves `auto` for the city-builder
    overview. Correct as-is; a probe reads `auto` only because the frame boots in
    overview mode.
  NOT ctx.imageSmoothingEnabled. The render paths already set it false on the
    main context in three places. I nearly "fixed" this too -- it would have been
    a third placebo.
  The art was never the problem, and neither was the compositing. The problem is
  that the BAKE THROWS THE ART AWAY BEFORE COMPOSITING.

THE FIX
  TPX 22 -> 44, so a 44px tile bakes 1:1 and nothing is discarded.

  The zoom contract still holds exactly. HLEVELS [11,22,44,88] against TPX=44 are
  0.25x / 0.5x / 1x / 2x -- still the clean power-of-two family the MOBILE RENDER
  CONTRACT means by "non-integer scale is BANNED", just re-based. HC=44 is now a
  true 1:1 blit of his art, which is the stop he zooms to.

  THE MEMORY, WHICH IS THE REASON IT WAS 22. A chunk is CHK*TPX square, so it
  goes 352px -> 704px, 0.50MB -> 1.98MB of RGBA. The live-canvas cap must come
  down with it or the budget blows:
      TPX=22 CVCAP=64  ->  30.2 MB   (today)
      TPX=44 CVCAP=28  ->  55.5 MB   (this patch)
  The code's own stated ceiling is the "~224MB iOS floor the render contract
  names", so 55MB is comfortably inside it. 28 is chosen from the worst real
  case, not guessed: at the widest zoom (HC=11) a 378x765 screen needs ~24 live
  chunks, so 28 covers it with headroom and the LRU never thrashes while panning.

REUSE CHECK: cooks no graphic pixels and opens no bank. It changes the bake
resolution so the banks already loaded (his harmonized 44px street/side pools)
survive to the screen intact. His art is untouched.

Idempotent: re-running finds the marker and reports NOOP. Refuses to write if the
expected source text is missing or ambiguous.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__FULL_PIXEL_BAKE__'

OLD_TPX = "const TPX=22;"
NEW_TPX = ("const TPX=44;   /* " + MARKER + " (Paolo 8/1: \"the pixel quality... of the\n"
           "   terrain of the ground of the houses... it's so bad\"). His approved tiles are\n"
           "   44px. At TPX=22 every one of them was decimated 2:1 into the chunk bake, so his\n"
           "   art has never reached the glass at 1:1 at ANY zoom -- HC=44 and 88 were 2x and 4x\n"
           "   of an already-halved bake, which is exactly why zooming IN looked worse, not\n"
           "   better. At 44 the bake is lossless and HLEVELS [11,22,44,88] become a clean\n"
           "   0.25/0.5/1/2 against it, so the no-fractional-scale contract still holds.\n"
           "   Chunk RGBA goes 0.50MB -> 1.98MB, so CVCAP drops 64 -> 28 to hold the budget. */")

OLD_ZOOM_HC = "let HC=22; // px per fine cell (animated by the transition)"
NEW_ZOOM_HC = ("let HC=44; // px per fine cell (animated by the transition)   /* " + MARKER + " */")
OLD_ZOOM_HZ = "let HZOOM=22; // player-chosen human zoom, SNAPPED to pixel-true levels"
NEW_ZOOM_HZ = ("let HZOOM=44; // player-chosen human zoom, SNAPPED to pixel-true levels\n"
               "/* " + MARKER + " -- DEFAULT ZOOM IS HIS ART'S OWN SIZE. 22 meant a 44px tile was\n"
               "   halved onto the screen even once the bake stopped halving it, so the two have\n"
               "   to move together or the fix is pure memory cost for identical pixels. At 44 a\n"
               "   tile is a true 1:1 blit and then a clean integer x3 to the glass: the first\n"
               "   time his art has ever been on screen at the resolution he drew it. He can\n"
               "   still zoom out to 22/11; those are now honest 0.5x/0.25x of full detail. */")
OLD_ZACC = "let _zacc=22;"
NEW_ZACC = "let _zacc=44;"

OLD_CAP = "const CVCAP=64;"
NEW_CAP = ("const CVCAP=28;  /* " + MARKER + " -- rebalanced for the 44px bake above.\n"
           "   28 x 704x704x4B = 55.5MB, well under the ~224MB iOS floor this file names, and\n"
           "   sized from the worst real case rather than guessed: the widest zoom (HC=11) on a\n"
           "   378x765 screen needs ~24 live chunks, so the LRU never thrashes while panning. */")


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    b64 = m.group(1)
    city = base64.b64decode(b64).decode('utf8', errors='ignore')

    if MARKER in city:
        print('NOOP: the city already bakes at his art resolution')
        return 0

    for name, needle in (('TPX', OLD_TPX), ('CVCAP', OLD_CAP), ('HC', OLD_ZOOM_HC),
                         ('HZOOM', OLD_ZOOM_HZ), ('_zacc', OLD_ZACC)):
        n = city.count(needle)
        if n != 1:
            print('FAIL: %s declaration found %d times, expected exactly 1' % (name, n)); return 1

    # the whole justification is that his pools are 44px -- verify, never assume
    sa = re.search(r'const SA_TILES=(\{.*?\});', city, re.S)
    if not sa:
        print('FAIL: SA_TILES not found -- cannot verify the art resolution'); return 1
    import json, struct
    tiles = json.loads(sa.group(1))
    sizes = set()
    for pool in ('street', 'side'):
        for t in (tiles.get(pool) or [])[:4]:
            b = base64.b64decode(t)
            sizes.add(struct.unpack('>II', b[16:24]))
    if sizes != {(44, 44)}:
        print('FAIL: his street art is %s, not 44x44 -- TPX must match the ART' % sizes); return 1

    city = (city.replace(OLD_TPX, NEW_TPX, 1).replace(OLD_CAP, NEW_CAP, 1)
                .replace(OLD_ZOOM_HC, NEW_ZOOM_HC, 1).replace(OLD_ZOOM_HZ, NEW_ZOOM_HZ, 1)
                .replace(OLD_ZACC, NEW_ZACC, 1))

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + out + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s (city blob %d -> %d bytes)' % (ALPHA, len(b64), len(out)))
    print('  TPX   22 -> 44   his 44px tiles now bake 1:1, nothing discarded')
    print('  CVCAP 64 -> 28   55.5MB, worst case at the widest zoom is ~24 chunks')
    print('  zoom  22 -> 44   the on-screen cell now equals his tile: a true 1:1 blit')
    return 0


if __name__ == '__main__':
    sys.exit(main())
