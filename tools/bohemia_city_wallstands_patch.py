#!/usr/bin/env python3
"""
BOHEMIA THE SUBURB WALL STANDS UP, AT ITS OWN RESOLUTION (7/27/26, CITY lane)

> "okay i literally spent hours 2 weeks ago planning the best walls for the
>  suburb walls and ur using some bullshit that u made for a house wall as the
>  subrub wall. are u even using the distrcit template and shit whats wrong with
>  you bro fr"      /      "look in the poject files"

I LOOKED IN THE PROJECT FILES. Here is what they say and what was actually
happening.

  laws/BOHEMIA_ADDENDUM_WALL_TAXONOMY_7_17_26.md - "This is for the walls of
    suburb communities, different than like building wall, so keep that in
    mind." TWO classes that NEVER share a pool: PERIMETER/COMMUNITY and
    BUILDING.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt - v2. THIRTEEN keys, 26 entries
    (tan + original each), weights renormalized. Its own `law` field:
    "85% tan / 15% original (Paolo); WALL HEIGHT MIN 2 TILES".
  records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26.txt - batch 2 was 48
    candidates and he passed exactly ONE. Batch 1 passed 12. That is the hours:
    two judging sessions, 61 candidates, 13 survivors.

THE POOL WAS WIRED. tools/bohemia_city_perimeterwall_patch.py did that on 7/21
and it still holds - code 4 paints '#6a5c44', WALL_MAP routes that colour to
SA_TILES.perimeter, and all 13 tiles are in the page. The suburb wall has never
been drawn with house-wall art. TWO OTHER THINGS WERE WRONG, and together they
are exactly why it read as "some bullshit you made for a house wall":

1. IT WAS LYING ON THE FLOOR. Code 4 was `{ c.s:'#6a5c44', c.walk:false }` and
   nothing else - no face - so the chunk baker drew it as ONE FLAT CELL. Its own
   bank has said MIN 2 TILES since 7/14 and no gate ever checked. Then yesterday
   I gave house facades three real tiles of height. So the only thing standing up
   in a suburb was the HOUSE wall, and the community wall was a stripe on the
   ground. Reading that as "you used the house wall as the suburb wall" is the
   correct read of what was on screen.

2. HIS ART WAS BEING RESAMPLED TWICE BEFORE IT REACHED HIM. The 7/21 wiring
   shrank each 44x44 approved tile to 16x16 with a LANCZOS filter to match the
   old TPX of 16. Then yesterday's pixel fix moved TPX to 22, so those already-
   blurred 16px tiles were being blown up again by x1.375 on the way in. Two
   resamples, one of them smoothing, on the one asset he hand-picked out of 61.
   44 is the right number and always was: against the zoom ladder [11,22,44,88]
   it is exactly x0.25 / x0.5 / x1 / x2. Every level clean, nothing to filter.

THE FIX
  height  code 4 joins the facade pass with its OWN pool and its OWN height:
          `perimeter`, never hwall, TWO tiles - his bank's stated minimum, and
          correctly SHORTER than the three-tile house wall, which is also how it
          is on the ground (a Vegas block wall is ~6ft, a house eave ~10ft).
          The taxonomy is enforced in the DRAW now, not only in the pool: a
          perimeter cell can only ever reach for the perimeter pool.
  pixels  the 13 tan tiles are re-embedded at their NATIVE 44x44, so the art he
          picked arrives at the size it was judged at and every zoom level is an
          exact halving or doubling.
  height is a per-cell property now (c.wallH) instead of one constant for
  everything, because "how tall is this wall" always belonged to the wall.

REUSE CHECK: cooks ZERO pixels. It re-embeds tiles that already exist, from
banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt, at the resolution they were
judged at, and draws them at the height that bank's own law asks for. Nothing is
created, selected or restyled - this is the opposite of cooking, it is finally
using what was cooked and judged.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.
The art is his own two-batch verdict, unaltered.

Idempotent (marker PERIMETER STANDS).

  python3 tools/bohemia_city_wallstands_patch.py
"""
import base64
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POOL = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'PERIMETER STANDS' in decoded:
    print('the suburb wall already stands. no-op.')
    sys.exit(0)

# ---- 0) his art, at the size he judged it -----------------------------------
pool = json.load(open(POOL))['pool']
tan = [p['b64'] for p in pool if p.get('variant') == 'tan']
assert len(tan) >= 12, 'expected the 13-key tan half of the approved pool'
i0 = decoded.index('SA_TILES.perimeter=[')
i1 = decoded.index('];', i0)
decoded = (decoded[:i0] + 'SA_TILES.perimeter=' + json.dumps(tan) +
           '   /* PERIMETER STANDS (7/27): NATIVE 44x44, the size he judged them at. '
           'They were being shrunk to 16 with a LANCZOS filter for the old TPX, then '
           'blown back up x1.375 once TPX became 22 - two resamples on the one asset '
           'he hand-picked out of 61. Against the zoom ladder [11,22,44,88] 44 is '
           'exactly x0.25/x0.5/x1/x2: every level clean. */' + decoded[i1 + 2:])

# ---- 1) the perimeter wall becomes a wall, with its own pool and height ------
OLD_CELL = "    else if(v===4){ c.s='#6a5c44'; c.walk=false; }   // perimeter wall (rides WALL_MAP)"
NEW_CELL = """    else if(v===4){ c.s='#6a5c44'; c.walk=false;
      /* PERIMETER STANDS (7/27): this was ONE FLAT CELL - a texture lying on the
         ground - while house facades stood three tiles tall, so the only thing
         that looked like a wall in a suburb was the HOUSE wall. Its own bank has
         said MIN 2 TILES since 7/14 (banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26)
         and nothing enforced it. It joins the facade pass now with its OWN pool
         and its OWN height: the 13 keys Paolo passed across two judging batches,
         never hwall (WALL TAXONOMY 7/17: perimeter and building walls never
         share a pool), and TWO tiles - shorter than the three-tile house wall,
         which is also how it is on the ground in Vegas. */
      c.face=true; c.artPool_face='perimeter'; c.wallH=2; }"""
if decoded.count(OLD_CELL) != 1:
    print('PERIMETER STANDS: the code-4 anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_CELL, NEW_CELL, 1)

# ---- 2) height belongs to the wall, not to a constant -----------------------
OLD_PASS = """      const v=(OM.hash2(gx,gy,404))&3;
      const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(WALL_H-1)*C;"""
NEW_PASS = """      const v=(OM.hash2(gx,gy,404))&3;
      /* PERIMETER STANDS (7/27): height is a property of the WALL, not one
         constant for everything. A house facade is 3; a community perimeter wall
         is 2, per its own bank's law and because a block wall really is shorter
         than a house. */
      const wh=c.wallH||WALL_H;
      const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(wh-1)*C;"""
if decoded.count(OLD_PASS) != 1:
    print('PERIMETER STANDS: the facade-pass header did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_PASS, NEW_PASS, 1)

OLD_DRAW = """      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){"""
NEW_DRAW = """      /* WALL TAXONOMY (Paolo 7/17, LOCKED): "the walls of suburb communities,
         different than like building wall". The two classes never share a pool,
         and now they never share one in the DRAW either - a perimeter cell can
         only ever reach for the perimeter pool. */
      if(c.artPool_face==='perimeter'){
        const pw=saTex('perimeter',v);
        if(pw)for(let r=0;r<wh;r++)g.drawImage(pw,dx,dy-r*C,C,C);
        g.fillStyle='rgba(255,255,255,0.10)'; g.fillRect(dx,top,C,1);
        g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(dx,dy+C-1,C,1);
        g.globalAlpha=1; continue;
      }
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){"""
if decoded.count(OLD_DRAW) != 1:
    print('PERIMETER STANDS: the facade-pass draw anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_DRAW, NEW_DRAW, 1)

assert decoded.count('PERIMETER STANDS') >= 3
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('PERIMETER STANDS applied:')
print('  - the suburb community wall stands 2 tiles, its bank\'s own stated minimum')
print('  - it draws from the 13 keys he passed across two batches, never from hwall')
print('  - those 13 tiles are back at their native 44x44 (were shrunk to 16 + re-blown x1.375)')
print('  - wall height is a per-cell property now, not one constant for everything')
