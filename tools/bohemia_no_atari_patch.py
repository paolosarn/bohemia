#!/usr/bin/env python3
"""
V230 -- NO ATARI: THE BOARD HE SAID LOOKS BETTER IS THE DEFAULT AGAIN  (COMBAT, [fight on the grid])

HIS VERDICT ON MY CARD combat-one-house-is-not-one-tile-9-27, DOWN, in his words:
    "Now looks better than what you had planned, bro that was really bad."
The card put the house board (left) beside the 32 px cell board (right). He picked the left.
And I had ALREADY BUILT AND SHIPPED the right one as V227 before the vote came in.

THE THIRD VOTES, LOCKED (laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s1, rule 37a):
    "NO ATARI. Pixel detail is never reduced. 'Tiny character' means SMALL RELATIVE TO
    BUILDINGS, drawn at the detail of the zoomed-in roaming art we already made... The 32 px
    cell and the 28 px one-cell sprite are DEAD as defaults. BEFORE ANY GRID IS BUILT, he sees
    OPTIONS: what a house tile and a street tile look like at real detail (WORLD + COOK
    [tile options], in VOTE)."
And s16: DIRECTION's world unit is the cell = 0.75 m, and "the pixel size of a cell is his pick
from [tile options]" -- so V227's 3 m cell was the wrong world unit as well as the wrong pixels.

WHEN HE CORRECTS SOMETHING: FIX IT IMMEDIATELY, ROOT CAUSE, MOVE ON. The root cause is that I
made the pick that the law now says is HIS, from options he has not seen yet.

---------------------------------------------------------------- WHAT IT DOES

THE SCALE BECOMES A ROW IN A TABLE, AND THE DEFAULT ROW IS THE ONE HE CHOSE. V227 overwrote the
house board's five numbers with the cell board's. This puts both boards in one table and picks
by name, defaulting to the house board -- so the man is back at FULL DETAIL (112, the art we
made) and the board is the one he said looks better. The cell row stays in the table, unused,
because [tile options] needs every candidate to be something a switch can show him in the real
fight rather than a mock-up; picking a row is setBoardOpt(name), one call.

    house (DEFAULT)   a tile is 12 m, 8 body tiles   man 112 px   TILE_WIDE 1.75   reach 1/2/3
    cell  (option)    a tile is  3 m, 2 body tiles   man  32 px   TILE_WIDE 1      reach 4/8/12

Both rows keep his 9/22 distances exactly: 12, 24 and 36 metres.

THE NAMES STOP LYING. V227 left constants called CELL_* that are about to hold house numbers
again; they are BOARD_* now, which is true whichever row is picked. TILE_WIDE keeps its name
(the bench and the gates read it, and "a tile in sprite widths" is true of both rows).

V229's HOUSE-IN-4x4 LAYOUT ONLY RUNS ON THE CELL ROW. It was written for a 3 m cell; on the
house board a tile already IS a house, so the original lot layout -- the picture he approved --
comes back untouched.

V228's ONE-TILE HIGH GROUND IS KEPT, AND ON THE HOUSE BOARD IT IS A BUILDING. His UP on the
high-ground card: "higher terrain for us could mean like a building... with the roof that you can
be on instead of a collapsed roof, or maybe a three-story building." One tile of high ground on
the house board is one HOUSE-sized raised block, one to three houses from him. The picture of
it (storeys, a standing roof against a fallen one) is COOK's; the rule is already right.

NO DAMAGE BEFORE THE DIAL: no chance, hit or turn moves. Every number here is a size or a
distance, and on the default row every one of them is byte-identical to the board he approved.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__NO_ATARI__'

EDITS = [
 ("""const CELL_K=2;         /* [DIAL] body-tiles to one CELL. DERIVED: a cell is 3 m, a body tile 1.5 */
const CELL_SIGHT=24;    /* [DIAL] cells you can see: the SAME 72 metres the 6-house sight meant */
const CELL_CEIL=12;     /* [DIAL] the cell-board REACH_CEIL: the scope, so it is not clipped to the rifle */
const TILE_WIDE=1;      /* [DIAL] a tile in SPRITE WIDTHS. Rule 34: A PERSON IS ONE CELL, so he fills it */""",
  """/* ===== V230 __NO_ATARI__ (COMBAT, [fight on the grid], rule 37a) ====================
   HIS VOTE on the card that put the house board beside the 32 px cell board, DOWN: "Now looks
   better than what you had planned, bro that was really bad." Rule 37a: "NO ATARI. Pixel detail
   is never reduced... the 32 px cell and the 28 px one-cell sprite are DEAD as defaults...
   BEFORE ANY GRID IS BUILT, he sees OPTIONS." V227 had already built the right-hand one.
   SO THE SCALE IS A ROW IN A TABLE AND THE DEFAULT ROW IS THE ONE HE CHOSE. Both rows keep his
   9/22 distances exactly (12, 24, 36 m). The cell row stays so [tile options] can show him a
   candidate in the real fight with one call; nothing picks it by default. */
const BOARD_OPTS={
  house:{ K:8, SIGHT:6,  CEIL:3,  WIDE:1.75, PX:112, MAX:{ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 } },
  cell: { K:2, SIGHT:24, CEIL:12, WIDE:1,    PX:32,  MAX:{ shotgun:4, pistol:4, smg:4, rifle:8, sniper:12 } } };
const BOARD_DEFAULT='house';   /* [DIAL] HIS PICK, 9/27 vote. [tile options] can add rows; he picks one */
let BOARD_K=8, BOARD_SIGHT=6, BOARD_CEIL=3, TILE_WIDE=1.75, BOARD_MAX=BOARD_OPTS.house.MAX;
function setBoardOpt(n){ const o=BOARD_OPTS[n]; if(!o)return false; G.boardOpt=n;
  BOARD_K=o.K; BOARD_SIGHT=o.SIGHT; BOARD_CEIL=o.CEIL; TILE_WIDE=o.WIDE; BOARD_MAX=o.MAX; BOARD_PX=o.PX;
  try{ _stCache={}; _stCacheT=-1; }catch(_e){} return true; }
function cellBoard(){ return houseOn()&&G.boardOpt==='cell'; }"""),

 ("""const CELL_MAX={ shotgun:4, pistol:4, smg:4, rifle:8, sniper:12 };""",
  """/* V230: BOARD_MAX, above, is the picked row's reach; the default row is his 9/22 numbers. */"""),

 ("""  const mx=CELL_MAX[w]!=null?CELL_MAX[w]:CELL_MAX.pistol;""",
  """  const mx=BOARD_MAX[w]!=null?BOARD_MAX[w]:BOARD_MAX.pistol;"""),

 ("""function tileK(){ return houseOn()?CELL_K:1; }""",
  """function tileK(){ return houseOn()?BOARD_K:1; }"""),

 ("""function sightTiles(){ return houseOn()?CELL_SIGHT:SIGHT_TILES; }
function reachCeil(){ return houseOn()?CELL_CEIL:REACH_CEIL; }""",
  """function sightTiles(){ return houseOn()?BOARD_SIGHT:SIGHT_TILES; }
function reachCeil(){ return houseOn()?BOARD_CEIL:REACH_CEIL; }"""),

 ("""const CELL_PX=32;       /* [DIAL] his cell on the glass (rule 34 s5), and a person is one */
function bodyRule(){ return houseOn()?(CELL_PX/112):(1/FIELD_ZOOM); }""",
  """/* V230: THE PERSON IS AT FULL DETAIL on the default row -- 112, the art we made (rule 37a:
   "pixel detail is never reduced"). A row may ask for another size; the default never does. */
let BOARD_PX=112;       /* [DIAL] the ruled person on the picked row. Default row: full detail */
function bodyRule(){ return houseOn()?(BOARD_PX/112):(1/FIELD_ZOOM); }"""),

 ("""function lotSubKind(wx,wy){
  if(houseOn()){""",
  """function lotSubKind(wx,wy){
  if(cellBoard()){   /* V230: the 4x4 house layout was written for a 3 m cell. On the house board a tile IS a house, so the layout he approved runs below. */"""),

 ("""      if(houseOn()&&_sk==='house'){""",
  """      if(cellBoard()&&_sk==='house'){   /* V230: only on the cell row */"""),

 ("""           setRead(houseOn()?'A TILE IS A CELL':'A TILE IS A BODY',
             houseOn()?'three metres: a pistol reaches four, a rifle eight':'the old board, unchanged','#e8c88a'); }catch(_e){} });""",
  """           setRead(houseOn()?(cellBoard()?'A TILE IS A CELL':'A TILE IS A HOUSE'):'A TILE IS A BODY',
             houseOn()?(cellBoard()?'three metres: a pistol reaches four, a rifle eight':'a pistol reaches one house, a rifle two'):'the old board, unchanged','#e8c88a'); }catch(_e){} });"""),
]


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES."""
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
        print('  the board he chose is already the default')
        return
    for need in ('__THE_CELL_BOARD__', '__A_HOUSE_IS_FOUR_BY_FOUR__'):
        if need not in blob:
            sys.exit('GUARD: %s is not in this blob; V230 is written on top of it' % need)
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # NO NAME MAY STILL SAY CELL WHILE HOLDING A HOUSE: every CELL_* constant is gone.
    for dead in ('CELL_K', 'CELL_SIGHT', 'CELL_CEIL', 'CELL_MAX', 'CELL_PX'):
        if re.search(r'\b' + dead + r'\b', code):
            sys.exit('GUARD: %s is still read somewhere' % dead)
    # THE DEFAULT ROW IS EXACTLY THE BOARD HE APPROVED.
    for want in ("const BOARD_DEFAULT='house';", 'let BOARD_K=8, BOARD_SIGHT=6, BOARD_CEIL=3, TILE_WIDE=1.75',
                 'let BOARD_PX=112;', 'house:{ K:8, SIGHT:6,  CEIL:3,  WIDE:1.75, PX:112, MAX:{ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 }'):
        if want not in code:
            sys.exit('GUARD: the default row is not the house board (%s)' % want)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V230 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
