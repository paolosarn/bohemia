#!/usr/bin/env python3
"""
BOHEMIA: EVERY WALL IS TWO TILES TALL, ONE TILE SOLID (8/2/26).

PAOLO, 8/2, correcting me after I got it exactly backwards the turn before:

  "walls should always be two tiles tall. End of story... all walls should at
   least be two tiles tall from fencing to concrete to brick whatever, but the
   walkable border where it stops allowing you to walk should only be one tile.
   Only the part where it stops you from walking should only be one tile, for
   all walls... so if you are north but behind the wall because of how the
   camera works, your feet should be one tile next to the wall border and that's
   when the opacity matters. And then if you are south one tile below the wall,
   you are already doing good."

THREE CLAUSES, and they are three different quantities that I collapsed into one:

  HEIGHT     every wall DRAWS two tiles tall. Fence, concrete, brick, all of
             them. Only a BUILDING may be taller (a house facade is three).
  COLLISION  exactly ONE tile stops you. The wall's own cell. The tile its
             upper course is painted over stays WALKABLE.
  OPACITY    when you stand on that covered tile - north of the wall, behind it
             from the camera - the wall goes SEE-THROUGH so you can see your own
             feet. That is what makes a one-tile collision under a two-tile
             wall readable instead of confusing.

WHAT I DID WRONG THE TURN BEFORE, recorded because the misread is the useful
part. He said "the wall border should end at that first tile" and I read BORDER
as the DRAWN EDGE, so I set wallH=1 and made the wall shorter. He meant the
WALKABLE border - where the collision stops. The wall was always supposed to be
two tiles tall; what was missing was the opacity that makes standing behind it
legible. I also quoted his "it has to be a building if walls are two tiles
thick" as proof walls are one tile - he said THICK, meaning footprint, and I
read it as TALL. Height, thickness and collision are three things.

  THE TELL I MISSED: the bank has said "wall height min 2 tiles" since 7/14 and
  I overrode it, writing a paragraph reconciling why his bank did not mean what
  it said. WHEN A RECONCILIATION GETS THAT LONG, THE READING IS WRONG.

SO THIS RESTORES wallH=2 - which is where the CITY tab was before I touched it -
and the collision and opacity clauses are asserted by gates/wallclass_gate.js
rather than left to be re-broken by the next person who reads one word as
another.

KNOWN AND LEFT ALONE, ON HIS INSTRUCTION ("end of story unless it's broken, you
know, then that's just an aesthetic decision"): his thirteen approved tiles are
complete 44x44 walls WITH A CAP along the top edge, so painting one across two
tiles puts a cap in the MIDDLE of the wall. That is the "two layers of walls"
look. It is an ART question - the lower course wants the tile's body without its
cap - and it is filed rather than guessed at here.

REUSE CHECK: cooks ZERO pixels and opens no bank. It changes one number that
decides how tall an already-approved tile is painted. Nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent, and it accepts either previous state (the wallH=1 I wrongly shipped,
or the original wallH=2).

  python3 tools/bohemia_city_wall_two_tall_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

NOTE = ("/* TWO TILES TALL, ONE TILE SOLID (Paolo 8/2, LOCKED): \"all walls should"
        " at least be two tiles tall from fencing to concrete to brick whatever, but"
        " the walkable border... should only be one tile... and that's when the"
        " opacity matters\". HEIGHT 2 (only a BUILDING is taller), COLLISION 1 (the"
        " covered tile stays walkable), OPACITY when he stands on it. I shipped"
        " wallH=1 on 8/1 by reading his \"border\" as the drawn edge instead of the"
        " walkable one. Law: laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md"
        " Gate: wallclass_gate.js */")
NEW = "c.face=true; c.artPool_face='perimeter'; c.wallH=2;" + NOTE

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'TWO TILES TALL, ONE TILE SOLID (Paolo 8/2' in decoded:
    print('walls already draw two tall with a one-tile collision. no-op.')
    sys.exit(0)

# accept the wrong 8/1 state (wallH=1 + my note) or the untouched original
PAT = re.compile(r"c\.face=true; c\.artPool_face='perimeter'; c\.wallH=[12];"
                 r"(?:/\* ONE TILE \(Paolo 8/1\).*?\*/)?", re.S)
hits = PAT.findall(decoded)
if len(hits) != 1:
    sys.exit('WALL TWO TALL: anchor found %d times (expected 1). Fix the anchor '
             'rather than loosening it.' % len(hits))

decoded = PAT.sub(lambda _m: NEW, decoded, count=1)
alpha = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)

print('EVERY WALL IS TWO TILES TALL, ONE TILE SOLID.')
print('  HEIGHT    the perimeter wall paints 2 tiles again (his bank has said so since 7/14)')
print('  COLLISION unchanged at 1 tile - the covered tile stays walkable')
print('  OPACITY   the existing see-through fires when he stands on the covered tile')
