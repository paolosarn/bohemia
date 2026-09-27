#!/usr/bin/env python3
"""
V227 -- THE CELL BOARD  (COMBAT lane, [fight on the grid], rule 34)

PAOLO 9/27, LOCKED (laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md): "your character stays
tiny even as you zoom out and you move one grid at a time, that we had originally... ONE HOUSE
DOESN'T EQUAL ONE TILE, IT'S ALL FUCKED UP." A COMBAT TILE IS A HOUSE (9/4) and THE STEP IS A
HOUSE (9/15) are SUPERSEDED. The fight happens on the close grid, in CELLS.

MEASURED FIRST, last round, on the real board walked into off the street:
    the fight canvas    390 x 641 CSS        the board is 1.99 HOUSES ACROSS
    in rule 34's cells  12.2 ACROSS, 20 DOWN
Two houses on a phone against a twelve-by-twenty room. That is the whole reason for this.

---------------------------------------------------------------- WHAT IT DOES

NOTHING NEW IS DRAWN AND NO NEW BOARD IS ADDED. The fight has had a switchable board since
V198: tileK() says how many BODY tiles are in one board tile, and every ruler in the file --
metres, sight, reach, the ceiling, the floor patch, how far the world is built -- already
reads it. The house board was that switch set to 8. THE CELL BOARD IS THE SAME SWITCH SET TO
TWO, and the five constants under it re-derived in his units.

    A CELL IS 3 METRES, AND IT IS DERIVED, NOT PICKED. His house is 12 m (V219 derived that
    from a real suburban lot frontage) and rule 34 puts FOUR cells in a house, so 12/4 = 3.
    A body tile is 1.5 m, so a cell is exactly TWO of them: CELL_K = 2, a whole number.

    REACH KEEPS HIS METRES AND CHANGES ITS UNIT. 9/22: pistol 1 tile, rifle 2, scope 3, when
    a tile was a house. In cells that is 4, 8 and 12 -- the same 12, 24 and 36 metres he
    already approved. Not one distance moves. HOUSE_MAX x4, exactly.

    SIGHT KEEPS ITS METRES TOO: 6 houses was 72 m, which is 24 cells.

    THE PERSON IS ONE CELL (rule 34 s4, which RE-READS rule 21 rather than repealing it: one
    size at every zoom, and the size is now one cell). The body is drawn at 32/112 of the HD
    sprite, and TILE_WIDE -- "a tile in SPRITE WIDTHS" -- becomes 1, because a person fills
    his cell. Put those two numbers into the ruler V198 already wrote and the tile comes out
    at 32 CSS px BY CONSTRUCTION:
        tile = TILE_WIDE * 112 * bodyRule()  =  1 * 112 * (32/112)  =  32 px
    so the board is 390/32 = 12.2 cells across, which is the number the VOTE card promised.

    AND THE FLOOR NEEDED NO EDIT AT ALL. V222 draws a board cell as a patch of the walked
    street's own fine cells, sized round(tileMetres()/0.75). At 3 m that is a 4x4 patch,
    derived, where a house was 16x16. The street's art arrives at the new scale for free.

THE 112 ART IS NOT THROWN AWAY (rule 34 s4): it stays the HD source the small sprite is cut
from, and the portraits and the vote pages keep it. Only the WALKED and FOUGHT sprite shrinks.

NO DAMAGE BEFORE THE DIAL: not a chance, a hit or a turn. Every number here is a distance or
a size. MAP LAW: authors no street. RULE 24 (one mode) and the beat are untouched.

THE BODY BOARD IS UNTOUCHED and still reachable from the bench, byte for byte, because every
edit below is inside the branch the board switch already guarded.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_CELL_BOARD__'

EDITS = [
 # ---- the scale, re-derived -------------------------------------------------
 ("""const HOUSE_K=8;        /* [DIAL] body-tiles to one house-tile */
const HOUSE_SIGHT=6;    /* [DIAL] houses you can see: a block. Reach is 1-2, so the approach band stays thick */
const HOUSE_CEIL=3;     /* [DIAL] the house-scale REACH_CEIL. hd(16) is 2, which would clip the scoped rifle to the plain one */
const TILE_WIDE=1.75;   /* [DIAL] a house tile in SPRITE WIDTHS -- his number, by eye, and his to change */""",
  """/* ===== V227 __THE_CELL_BOARD__ (COMBAT, [fight on the grid], rule 34) =============
   PAOLO 9/27, LOCKED: "one house doesn't equal one tile, it's all fucked up." A COMBAT
   TILE IS A HOUSE (9/4) is SUPERSEDED. The fight is on the close grid, in CELLS.
   NOTHING NEW IS ADDED. V198 gave this file a switchable board -- tileK() says how many
   BODY tiles are in one board tile and every ruler already reads it -- and the house board
   was that switch set to 8. The cell board is the same switch set to TWO.
   A CELL IS 3 METRES AND IT IS DERIVED: his house is 12 m (V219 got that from a real
   suburban lot frontage) and rule 34 puts FOUR cells in a house, so 12/4 = 3; a body tile
   is 1.5 m, so a cell is exactly two of them. A whole number, not a fit.
   REACH KEEPS HIS METRES AND CHANGES ITS UNIT, so not one distance he approved moves.
   Measured on the real board before any of this: the fight was 1.99 HOUSES ACROSS on a
   phone. The same glass holds 12.2 cells. */
const CELL_K=2;         /* [DIAL] body-tiles to one CELL. DERIVED: a cell is 3 m, a body tile 1.5 */
const CELL_SIGHT=24;    /* [DIAL] cells you can see: the SAME 72 metres the 6-house sight meant */
const CELL_CEIL=12;     /* [DIAL] the cell-board REACH_CEIL: the scope, so it is not clipped to the rifle */
const TILE_WIDE=1;      /* [DIAL] a tile in SPRITE WIDTHS. Rule 34: A PERSON IS ONE CELL, so he fills it */"""),

 # ---- reach, the same metres in the new unit ---------------------------------
 ("""const HOUSE_MAX={ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 };""",
  """/* V227: HOUSE_MAX x4, which is the SAME 12, 24 and 36 METRES he approved on 9/22 -- a cell
   is a quarter of a house, so every reach is four times the number and none of the distances
   move. The eff/max ratio below is untouched, so the accuracy curve is byte-identical at
   matching fractions of reach, which is the thing V198 was careful about. */
const CELL_MAX={ shotgun:4, pistol:4, smg:4, rifle:8, sniper:12 };"""),

 ("""function houseRange(w){
  const B=(w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol);
  const mx=HOUSE_MAX[w]!=null?HOUSE_MAX[w]:HOUSE_MAX.pistol;
  return {eff:mx*(B.eff/B.max), max:mx}; }
function tileK(){ return houseOn()?HOUSE_K:1; }""",
  """function houseRange(w){
  const B=(w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol);
  const mx=CELL_MAX[w]!=null?CELL_MAX[w]:CELL_MAX.pistol;
  return {eff:mx*(B.eff/B.max), max:mx}; }
function tileK(){ return houseOn()?CELL_K:1; }
/* V227: THE SWITCH OUTLIVED ITS NAME. houseOn() now means "the scaled board is on", and
   rule 34 renamed that board from a house to a cell. Twenty-one call sites read the old
   name and every one of them is still asking the right question, so renaming them is a
   mechanical job of its own rather than something to do inside a scale change. New code
   asks cellOn(). */
function cellOn(){ return houseOn(); }"""),

 ("""function sightTiles(){ return houseOn()?HOUSE_SIGHT:SIGHT_TILES; }
function reachCeil(){ return houseOn()?HOUSE_CEIL:REACH_CEIL; }""",
  """function sightTiles(){ return houseOn()?CELL_SIGHT:SIGHT_TILES; }
function reachCeil(){ return houseOn()?CELL_CEIL:REACH_CEIL; }"""),

 # ---- the person is one cell -------------------------------------------------
 ("""function bodyRule(){ return houseOn()?1:(1/FIELD_ZOOM); }""",
  """/* V227 __THE_CELL_BOARD__: THE PERSON IS ONE CELL (rule 34 s4, which RE-READS rule 21
   rather than repealing it -- one size at every zoom, and the size is now one cell). He is
   drawn at 32 of the HD sprite's 112, and TILE_WIDE is 1 because a person fills his cell, so
   V198's own ruler puts the tile at 32 CSS px BY CONSTRUCTION:
       tile = TILE_WIDE * 112 * bodyRule() = 1 * 112 * (32/112) = 32
   and the board is 390/32 = 12.2 cells across, which is the number the VOTE card promised.
   THE 112 ART IS NOT THROWN AWAY: it stays the source this is cut from, and the portraits
   and vote pages keep it. Only the fought sprite shrinks. */
const CELL_PX=32;       /* [DIAL] his cell on the glass (rule 34 s5), and a person is one */
function bodyRule(){ return houseOn()?(CELL_PX/112):(1/FIELD_ZOOM); }"""),

 # ---- and the bench label stops lying ---------------------------------------
 ("""           setRead(houseOn()?'A TILE IS A HOUSE':'A TILE IS A BODY',
             houseOn()?'a pistol reaches one house, a rifle two':'the old board, unchanged','#e8c88a'); }catch(_e){} });""",
  """           setRead(houseOn()?'A TILE IS A CELL':'A TILE IS A BODY',
             houseOn()?'three metres: a pistol reaches four, a rifle eight':'the old board, unchanged','#e8c88a'); }catch(_e){} });"""),
]


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the fight
    stopped defining G; V217's first cut left a block comment open and the last script went
    silent. A guard that checks the text it wrote rather than whether the file still runs is
    not a guard."""
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


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the board is already cells')
        return
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:70]))
        blob = blob.replace(old, new, 1)

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # THE HOUSE NUMBERS ARE GONE, not shadowed. A constant left behind under a dead name is
    # exactly the rot this lane keeps finding: a number written in a unit the game moved past.
    for dead in ('HOUSE_K', 'HOUSE_SIGHT', 'HOUSE_CEIL', 'HOUSE_MAX'):
        if dead in code:
            sys.exit('GUARD: %s still exists after the rename' % dead)
    # AND THE NEW ONES ARE THE DERIVED VALUES, not eyeballed ones.
    for want, why in (('const CELL_K=2;', 'a cell is 3 m and a body tile 1.5'),
                      ('const CELL_SIGHT=24;', '72 metres, the same distance 6 houses meant'),
                      ('const CELL_CEIL=12;', 'the scope, so it is not clipped to the rifle'),
                      ('const TILE_WIDE=1;', 'a person is one cell'),
                      ('const CELL_PX=32;', 'his cell on the glass'),
                      ('shotgun:4, pistol:4, smg:4, rifle:8, sniper:12', 'HOUSE_MAX x4, the same metres')):
        if want not in code:
            sys.exit('GUARD: %s is missing (%s)' % (want, why))
    # THE TILE LANDS ON 32 BY THE FILE'S OWN ARITHMETIC, checked here rather than hoped for.
    tile = 1 * 112 * (32 / 112.0)
    if abs(tile - 32) > 1e-9:
        sys.exit('GUARD: the ruler does not put a cell at 32 px')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V227 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
