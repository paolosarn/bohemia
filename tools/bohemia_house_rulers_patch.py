#!/usr/bin/env python3
"""
V219 -- THE TWO RULERS STILL WRITTEN IN THE OLD UNIT  (COMBAT lane, [house board])

*** THIS IS STANDING DUTY 8 ON MY OWN SHIPPED LINE: PLAY IT. *** V218 turned the
house board on last round and I proved it in numbers. This round I started a fight
the way he starts one and PHOTOGRAPHED IT, and the picture says two things the
numbers did not.

WHAT THE SCREEN SAYS, ON THE GLASS, IN A REAL FIGHT AT HOUSE SCALE:

    "LONG RANGE ~2m"        for a man standing ONE HOUSE away
    "WAY OUT 10T"           for a win condition placed OUTSIDE THE BUILT WORLD

Both are the same defect the whole scale change keeps turning up: A DISTANCE WRITTEN
IN BODY TILES, CARRIED INTO A BOARD MADE OF HOUSES. That is now the sixth and seventh
time in two rounds, which is the real lesson of this ruling and is why both fixes
below are DERIVED from numbers the game already holds rather than typed.

---------------------------------------------------------------- ONE: THE METRES

Two readouts turn tiles into metres with a hardcoded *1.5 -- the enemy row and the
aim line. 1.5 m is a BODY tile, a person's step, and it was right for years. On a
board of houses it tells him a house is a metre and a half, so a man a full house
away reads as TWO METRES.

DERIVED, NOT PICKED: metres per tile is 1.5 times tileK(), the body-tiles-per-tile
number V198 already defined. On the body board tileK() is 1 and the number is 1.5,
byte-identical. On the house board it is 8, so a house is TWELVE METRES -- which is
also a real suburban lot frontage, so the realism holds without anybody choosing it.
ONE NUMBER IN ONE PLACE, which is section 3 of his own 9/15 law.

---------------------------------------------------- TWO: THE WIN IS OFF THE MAP

V159 made REACHING THE WAY OUT the win: "killing every man no longer ends the fight."
It is clamped between EXIT_MIN 10.0 and EXIT_MAX 18.0 TILES, typed, never read
through the scale door. On the house board that is ten to eighteen HOUSES, against:

    sightTiles()   6      you cannot see it
    contentR()     7.6    THE WORLD IS NOT BUILT THAT FAR
    one step       1 house a turn, so 10 to 18 turns of walking
    the fight      about 14 turns

So the one place on the board that is FOR him is beyond the edge of the world, and
the HUD says WAY OUT 10T at it. V200's own comment already wrote this sentence about
interiors -- "EXIT_MIN is 10 tiles, a real interior is 11x7, so this would place the
way out THROUGH THE WALL -- unreachable the moment a wall stops a body, with the HUD
still reading WAY OUT 14T at it" -- and refused to place one indoors. The same
sentence is now true of the whole outdoor house board.

DERIVED FROM WHAT THE NUMBERS ALREADY MEAN, so the body board cannot move. Those two
figures are really a FRACTION OF SIGHT: against the body board's SIGHT_TILES of 17,
EXIT_MIN is 0.588 of sight and EXIT_MAX is 1.059 of it. Expressed that way they
reproduce 10 and 18 exactly on the body board, by construction, and on the house
board they land at 3.5 to 6.4 houses:

    a walk of four to six turns, which is a real trip inside a fourteen-turn fight
    inside contentR (7.6), so the ground it stands on is actually built
    at the edge of sight (6), so you can see where you are going

EXIT_R, "how close is you made it", is deliberately NOT scaled: 1.4 means the tile
next to it counts, and that reads the same at either size, because you cannot stand
closer than adjacent.

NO DAMAGE BEFORE THE DIAL: no damage number is touched. Nothing here changes a
reach, a chance or a hit.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_RULERS_READ_THE_BOARD__'

OLD_TILEK = """function tileK(){ return houseOn()?HOUSE_K:1; }"""

NEW_TILEK = """function tileK(){ return houseOn()?HOUSE_K:1; }
/* ===== V219 __THE_RULERS_READ_THE_BOARD__ (COMBAT, [house board], standing duty 8)
   I SHIPPED THE HOUSE BOARD AND THEN PHOTOGRAPHED A REAL FIGHT ON IT, and the
   picture said something the numbers did not: the aim line read "LONG RANGE ~2m"
   for a man standing ONE HOUSE AWAY.
   Two readouts turned tiles into metres with a hardcoded 1.5, which is a BODY tile
   -- a person's step -- and was right for years. DERIVED NOW, NOT PICKED: 1.5 times
   tileK(), the body-tiles-per-tile number V198 already defined. The body board is
   byte-identical (tileK is 1). The house board says TWELVE METRES, which is also a
   real suburban lot frontage, so the realism arrives without anybody choosing it.
   ONE NUMBER IN ONE PLACE -- section 3 of his own 9/15 law. */
const BODY_M=1.5;      /* [DIAL] metres across one BODY tile: a person's step */
function tileMetres(){ return BODY_M*tileK(); }
function distM(d){ return Math.round((d||0)*tileMetres()); }
/* ===== /V219 __THE_RULERS_READ_THE_BOARD__ ===== */"""

OLD_ROW = """      const rng=e.dead?'':('<b style="color:'+rangeCol(e)+'">'+ab+'</b> ~'+Math.round((e.edist||0)*1.5)+'m · ');"""
NEW_ROW = """      const rng=e.dead?'':('<b style="color:'+rangeCol(e)+'">'+ab+'</b> ~'+distM(e.edist)+'m · ');   /* V219 __THE_RULERS_READ_THE_BOARD__ */"""

OLD_AIM = """      if(tg){ const m=Math.round((tg.edist||0)*1.5);"""
NEW_AIM = """      if(tg){ const m=distM(tg.edist);   /* V219 __THE_RULERS_READ_THE_BOARD__: a house is not a metre and a half */"""

OLD_EXIT = """const EXIT_MIN=10.0;     /* [DIAL] never so near that standing still reaches it */
const EXIT_MAX=18.0;     /* [DIAL] and never so far that it stops being a fight */"""

NEW_EXIT = """const EXIT_MIN=10.0;     /* [DIAL] never so near that standing still reaches it */
const EXIT_MAX=18.0;     /* [DIAL] and never so far that it stops being a fight */
/* ===== V219 __THE_RULERS_READ_THE_BOARD__: AND THE WIN WAS OFF THE MAP ==========
   PHOTOGRAPHED IN A REAL FIGHT AT HOUSE SCALE: the HUD reads WAY OUT 10T, and ten
   tiles on this board is TEN HOUSES, against a sight of 6 and a contentR of 7.6 --
   so the one place on the board that is FOR him is beyond the edge of the world that
   was built, and it is the WIN CONDITION. V200 already wrote this exact sentence
   about interiors ("EXIT_MIN is 10 tiles, a real interior is 11x7, so this would
   place the way out THROUGH THE WALL -- unreachable... with the HUD still reading
   WAY OUT 14T at it") and refused to place one indoors. The same sentence is now
   true of the whole outdoor house board.
   DERIVED, SO THE BODY BOARD CANNOT MOVE. Those two figures are really a FRACTION OF
   SIGHT: against SIGHT_TILES 17, EXIT_MIN is 0.588 of sight and EXIT_MAX is 1.059.
   Written that way they reproduce 10.0 and 18.0 EXACTLY on the body board, by
   construction, and on the house board they land at 3.5 to 6.4 houses -- a walk of
   four to six turns inside a fourteen-turn fight, inside contentR so the ground is
   actually built, and at the edge of sight so he can see where he is going.
   EXIT_R is deliberately NOT scaled: 1.4 means the tile next to it counts, which
   reads the same at either size, because you cannot stand closer than adjacent. */
function exitMin(){ return sightTiles()*(EXIT_MIN/SIGHT_TILES); }
function exitMax(){ return sightTiles()*(EXIT_MAX/SIGHT_TILES); }"""

OLD_DIAG = """function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(reachCeil(), Math.max(houseOn()?1:hd(PT_BLANK+2), R.max*k)); }"""

NEW_DIAG = """/* V219 __THE_RULERS_READ_THE_BOARD__: *** AND ADJACENT IS NOT 1, IT IS THE SQUARE
   ROOT OF TWO, BECAUSE THIS BOARD LETS YOU STAND ON A DIAGONAL. *** V218 put the
   house floor at 1 last round and that covered the man directly beside you. MEASURED
   THIS ROUND, on a merged tree, in a real teaching fight: the one man on the board
   stood at edist 1.41 -- a DIAGONAL neighbour -- against a pistol reaching 1, so he
   could not be shot and there was nowhere closer to stand. The same dead first turn,
   one corner over.
   WHY 1.41 AND NOT 1: doMove steps in eight directions ('full tile steps, diagonals
   included (Chebyshev)') while edist is a EUCLIDEAN radius, so the nearest a body can
   ever be is one tile orthogonally or root two diagonally. A floor of 1 therefore
   means 'adjacent, but only on four sides of you'.
   Math.SQRT2 is the smallest number that means ADJACENT on this board, and it is not
   a tuning choice: it is the geometry of a square. The body board is untouched. */
function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(reachCeil(), Math.max(houseOn()?Math.SQRT2:hd(PT_BLANK+2), R.max*k)); }"""

OLD_PLACE = """  G.exit={ea:threat, edist:Math.min(EXIT_MAX,Math.max(EXIT_MIN,(near<1e9?near:EXIT_MIN))), r:EXIT_R, lvl:0};"""
NEW_PLACE = """  /* V219 __THE_RULERS_READ_THE_BOARD__: the clamp reads the board it is on. */
  G.exit={ea:threat, edist:Math.min(exitMax(),Math.max(exitMin(),(near<1e9?near:exitMin()))), r:EXIT_R, lvl:0};"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the
    fight stopped defining G; V217's first cut left a block comment open and the last
    script went silent. A guard that checks the text it wrote rather than whether the
    file still runs is not a guard."""
    import os
    import subprocess
    import tempfile
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the rulers already read the board')
        return
    blob = sub(blob, OLD_TILEK, NEW_TILEK, 'blob/tileK')
    blob = sub(blob, OLD_ROW, NEW_ROW, 'blob/enemy row metres')
    blob = sub(blob, OLD_AIM, NEW_AIM, 'blob/aim line metres')
    blob = sub(blob, OLD_EXIT, NEW_EXIT, 'blob/exit clamp')
    blob = sub(blob, OLD_DIAG, NEW_DIAG, 'blob/the adjacency floor')
    blob = sub(blob, OLD_PLACE, NEW_PLACE, 'blob/placeWayOut')
    # NOT ONE READOUT STILL CONVERTS TILES TO METRES BY HAND. The whole point of the
    # row is that a second copy of a ruler is the bug, so the guard is the count.
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    left = re.findall(r"edist\s*\|\|\s*0\s*\)\s*\*\s*1\.5", code)
    if left:
        sys.exit('GUARD: %d readout(s) still turn tiles into metres by hand' % len(left))
    if code.count('function tileMetres()') != 1 or code.count('function distM(') != 1:
        sys.exit('GUARD: the metre door is not defined exactly once')
    # ONCE AS THE DECLARATION, ONCE INSIDE ITS OWN DOOR, AND NOWHERE ELSE. If the
    # raw constant is still read at a use site, the clamp is not reading the board.
    if code.count('EXIT_MIN') != 2 or code.count('EXIT_MAX') != 2:
        sys.exit('GUARD: EXIT_MIN/EXIT_MAX are touched %d/%d times, expected 2/2 '
                 '(the declaration and its own door)'
                 % (code.count('EXIT_MIN'), code.count('EXIT_MAX')))
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V219 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
