#!/usr/bin/env python3
"""
BOHEMIA ONE WALL PER COMMUNITY (7/28/26, CITY lane) - nine of his thirteen
approved suburb walls could never appear, and the four that could were doing the
exact thing he banned in writing.

> "BRO IN THE FILES THERE IS LIKE SO MANY APPROVED SUBURBA BORDER WALLS FOR THE
>  WALLS CLOSING THE SUBRUB NOT FOR HOUSES UR GETTING MAD CONFUSED SEARCH THE
>  SYSTEM FOR THAT SHIT"

I SEARCHED THE SYSTEM. He is right twice over.

WHAT THE FILES SAY
  banks/BOHEMIA_WALL_PICKS_7_14_26.txt (also inside the GRAPHICS VERDICTS
    MASTER, "the act-1 art authority") - BOHEMIA_WALL_PICKS_v2: he passed
    W26-W37 and killed 32 others, with his own direction attached: "85% of Vegas
    walls are desert yellow tan brick vibes - create tan versions, keep
    originals". Batch 2 (7/17) added WB4 out of 48. THIRTEEN approved suburb
    border walls, 61 candidates judged to get them.
  banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt - `paolo_laws`, verbatim:
    "one_wall_per_community": "each plot = ONE wall design (seeded per plot);
     variety BETWEEN plots; per-cell wall shuffle BANNED"

WHAT THE GAME WAS DOING
  The wall tile was picked with `v = OM.hash2(gx,gy,404) & 3` - the same generic
  per-cell variant hash every other tile uses. Two separate violations in one
  expression:

  1. PER-CELL WALL SHUFFLE, the thing his law names and bans. Every cell of a
     community wall rolled its own design, so one wall changed brick pattern
     tile by tile down its length instead of being one wall.
  2. `& 3` CAPS THE ROLL AT FOUR. saTex indexes `arr[variant % arr.length]`, and
     variant could only ever be 0-3, so only the first four of the thirteen were
     ever drawn. NINE OF HIS THIRTEEN APPROVED WALLS HAVE NEVER APPEARED IN THIS
     GAME. That is why "there is like so many approved suburb border walls" reads
     as an accusation - he judged 61 candidates down to 13 and the game shows 4,
     scrambled.

THE FIX, which is just his law
  The perimeter wall's design is chosen ONCE PER PLOT and carried by every cell
  of that plot's wall. A suburb plot is the 4x4 overmap group that makes one
  128x128 BohemiaSuburb grid, so the seed is hash(tx>>2, ty>>2) - the same key
  the plot's own grid is generated from. saTex then mods by the real pool length,
  so all thirteen are reachable and neighbouring communities differ.

  Result: one wall per community. Variety between communities. Every approved
  design in play. Nothing per-cell.

REUSE CHECK: cooks ZERO pixels and adds no asset. It changes WHICH of the 13
already-embedded approved tiles a wall cell uses, from a per-cell roll to a
per-plot seed, which is what banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt
says it must be. No banks/ lookup produces anything because nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing. It
is his own law, executed.

Idempotent (marker ONE WALL PER COMMUNITY).

  python3 tools/bohemia_city_onewall_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'ONE WALL PER COMMUNITY' in decoded:
    print('one wall per community already in force. no-op.')
    sys.exit(0)

# ---- 1) the plot decides the wall, not the cell -----------------------------
OLD_CELL = "      c.face=true; c.artPool_face='perimeter'; c.wallH=2; }"
NEW_CELL = """      c.face=true; c.artPool_face='perimeter'; c.wallH=2;
      /* ONE WALL PER COMMUNITY (Paolo, banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_
         7_14_26.txt, paolo_laws, verbatim): "each plot = ONE wall design
         (seeded per plot); variety BETWEEN plots; per-cell wall shuffle
         BANNED". The tile used to be picked with the generic per-cell hash
         `hash2(gx,gy,404)&3`, which broke that law twice: it shuffled the
         design cell by cell down a single wall, AND the &3 capped the roll at
         four, so only 4 of his 13 approved border walls could ever be drawn.
         Nine of them had never appeared in the game. The seed is the PLOT now -
         the 4x4 overmap group that makes one 128x128 suburb grid, the same key
         the plot's own layout is generated from - and saTex mods by the real
         pool length, so all thirteen are reachable and neighbouring communities
         differ. */
      c.wallVariant=(Math.imul(tx>>2,2654435761)^Math.imul(ty>>2,40503))>>>0; }"""
if decoded.count(OLD_CELL) != 1:
    print('ONE WALL: the perimeter cell anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_CELL, NEW_CELL, 1)

# ---- 2) the draw uses the plot's design -------------------------------------
OLD_DRAW = "        const pw=saTex('perimeter',v);"
NEW_DRAW = ("        /* ONE WALL PER COMMUNITY: the PLOT's design, never the cell's roll. */\n"
            "        const pw=saTex('perimeter',(c.wallVariant!==undefined)?c.wallVariant:v);")
if decoded.count(OLD_DRAW) != 1:
    print('ONE WALL: the perimeter draw anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_DRAW, NEW_DRAW, 1)

assert decoded.count('ONE WALL PER COMMUNITY') >= 2
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('ONE WALL PER COMMUNITY applied:')
print('  - a community wall is ONE design for the whole plot, seeded per plot')
print('  - the per-cell shuffle his law BANS is gone')
print('  - all 13 approved border walls are reachable (the old &3 capped it at 4)')
