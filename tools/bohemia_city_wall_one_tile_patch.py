#!/usr/bin/env python3
"""
BOHEMIA: THE WALL ENDS AT ITS OWN TILE (8/1/26).

PAOLO, 8/1, and he described the geometry himself rather than the symptom:

  "if I am a tile south of a wall and the wall is north of me, the game is doing
   fine. But if I am one tile north, behind a wall, because of the view of our
   game, the wall border should end at that first tile, base of the wall. Does
   that make sense? And that's for all walls. I don't know if there are any. It
   has to be a building if walls are two tiles thick."

TWO RULINGS IN THAT:
  1. A WALL OCCUPIES ITS OWN TILE AND NOTHING ELSE. The walkable border ends at
     the base of the wall. Standing IN FRONT of a wall (south of it, looking at
     its face) is correct and stays exactly as it is.
  2. NOTHING THAT IS TWO TILES IS A WALL. If it is two tiles it is a BUILDING.
     House facades keep their three-tile height - a house is a building.

WHAT WAS WRONG, measured before it was touched. The CITY tab drew the community
perimeter wall with wallH = 2:

    const wh = c.wallH || WALL_H;
    const top = dy - (wh - 1) * C;      // wh=2 -> the face starts ONE TILE UP

so a wall at (x,y) painted over its own cell AND the cell to its north - and
that northern cell is WALKABLE. Swept on the real CITY frame: 22,345 perimeter
wall cells, and 7,417 of them had a walkable cell directly under the face. You
could stand inside the wall, in 7,417 places.

IT ALSO EXPLAINS THE "TWO LAYERS OF WALLS" HE SAW, which I had wrongly filed as
an art question. His thirteen approved wall tiles are complete walls at 44x44 -
ONE tile, cap and courses included. Painting a self-contained wall over a
two-tile rect repeats it, so the screen showed cap-course-cap-course: "a
separate tile that's a different wall in the wall". One bug, both complaints.

AND IT MAKES THE TWO SURFACES AGREE. The RUN already drew this wall exactly one
tile tall (drawPerim(X,Y,S), S = one CELL) over one solid cell, so THE RUN WAS
ALREADY RIGHT and the CITY tab was the odd one out. This deletes the
disagreement rather than adding a rule to it.

ON THE BANK'S "MIN 2 TILES" NOTE (banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26):
that line is what put wallH=2 here on 7/27, read as a DRAWN GRID HEIGHT. It
cannot have meant that - the art he actually approved is 44x44, one tile, and a
one-tile wall drawn over two tiles is the doubling he just complained about. His
8/1 words are explicit, they are newer, and NEWEST DATE WINS. A GATE MUST NEVER
OUTRANK A RULING, so gates/wallclass_gate.js is updated in the same commit
rather than worked around.

WHAT THIS DOES NOT DO, deliberately: it changes NO walkable geometry. Not one
cell becomes solid, so no block can lose its way out and the NO PRISON law
(Paolo, 8/1, the previous ruling) cannot regress. The wall simply stops being
drawn over ground it does not own.

REUSE CHECK: cooks ZERO pixels and opens no bank. It changes one number that
decides how tall an already-approved tile is painted. Nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent: refuses if the anchor is not present exactly once, and no-ops once
applied.

  python3 tools/bohemia_city_wall_one_tile_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = "c.face=true; c.artPool_face='perimeter'; c.wallH=2;"
NEW = ("c.face=true; c.artPool_face='perimeter'; c.wallH=1;"
       "/* ONE TILE (Paolo 8/1): \"the wall border should end at that first tile,"
       " base of the wall... it has to be a building if walls are two tiles thick\"."
       " wallH=2 painted the face over the WALKABLE cell to the north - 7,417 of"
       " them - so you stood inside the wall, and it repeated his self-contained"
       " 44x44 tile so the screen showed two stacked walls. The RUN already drew"
       " this one tile tall; this makes the CITY tab agree. No cell's walkability"
       " changes, so NO PRISON cannot regress. */")

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'ONE TILE (Paolo 8/1)' in decoded:
    print('the perimeter wall already ends at its own tile. no-op.')
    sys.exit(0)

n = decoded.count(OLD)
if n != 1:
    sys.exit('WALL ONE TILE: anchor found %d times (expected 1). The CITY tab '
             'moved; fix the anchor rather than loosening it.' % n)

decoded = decoded.replace(OLD, NEW, 1)
alpha = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)

print('THE WALL ENDS AT ITS OWN TILE.')
print('  the community perimeter wall now paints one tile, not two')
print('  nothing became solid or walkable - only the paint changed')
print('  the CITY tab now matches the RUN, which was already right')
