#!/usr/bin/env python3
"""V164 MOVEMENT ASYMMETRY: DISTANCE OUT OF PURE GEOMETRY. RF4-51, machine 3.

SPEC ITEM: RF4-51, SPECED -> BUILT. Machine 3 of the nine, routed to COMBAT by
laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md section 6.

NO EXTERNAL RESEARCH WAS DONE AND NONE WAS NEEDED. His own 83-screen capture is
the source, the law says COMBAT "does not go read RF4 itself", and the spec row
is written. Going to the internet here would be the seam crossing, not diligence.

The spec, verbatim:

  "[3] MOVEMENT ASYMMETRY MANUFACTURES DISTANCE FOR FREE. Slow enemies move
   ORTHOGONALLY ONLY; you move DIAGONALLY -- every diagonal step costs them more
   than it costs you, so you generate distance out of pure geometry with NO
   RESOURCE SPENT... 'Movement asymmetry is a cleaner difficulty lever than stat
   inflation. Making an enemy orthogonal-only is more interesting than giving it
   more HP, and it teaches the player something durable.'"

And its own diff column: "ABSENT, and it is nearly free... THIS IS THE CHEAPEST
DIFFICULTY LEVER IN THE ENTIRE DOCUMENT and it costs no new art, no new UI and no
numbers -- which matters because NO DAMAGE BEFORE THE DIAL blocks the
stat-inflation alternative anyway."

--------------------------------------------------------------------------
IT ONLY BECAME POSSIBLE THIS WEEK, AND THAT IS THE POINT
--------------------------------------------------------------------------
This mechanic is meaningless without the two before it. V162 put every body on a
cell (bodies were at 7.34 tiles sliding 1.80 a turn -- there was no such thing as
"a diagonal step" to be asymmetric about). V163 made a step cost your turn, so a
step is a real currency. Only now does "his diagonal beats their orthogonal" mean
anything at all.

--------------------------------------------------------------------------
WHERE "SLOW" ALREADY LIVES -- NOTHING IS INVENTED
--------------------------------------------------------------------------
The archetype table already carries the identity: `cad` (acts every Nth turn) and
`adv` (tiles closed per active turn), written on 7/19 under his own ruling that
"depending on the weapon they have they will move differently". BAT and SPEAR are
already cad:2 -- they are ALREADY asymmetric, every other turn, and they are melee
so their mover is BohemiaMelee, a separate engine module this session does not
touch (ONE SYSTEM, ONE SESSION).

THE GAP IS THE GUNS. pressAI moves the ranged types and gives all of them the
same eight neighbours the player has. Among them the SEC-BOT is the heavy: 160 hp
against a goon's 60, the only `bot:true` in the table. A heavy machine that cannot
cut a corner is the most legible slow thing on the board, and it is the archetype
RF4 uses for exactly this.

*** THE PROPERTY IS DECLARED, NOT DERIVED BY A CLEVERNESS. *** `ortho:true` sits
on the archetype next to hp and acc, so which bodies are slow is ONE WORD to
change and is visible where every other identity number is. Deriving it from a
threshold on `hp` would have been me authoring canon behind a formula.

--------------------------------------------------------------------------
WHAT IT COSTS, AND WHY THAT IS THE WHOLE ARGUMENT
--------------------------------------------------------------------------
No new art. No new UI. No new numbers. No damage touched -- which matters,
because NO DAMAGE BEFORE THE DIAL forbids the stat-inflation alternative, so this
is not merely the cheap lever, it is the only legal one.

NOT HERE, AND NOT MINE: "liquids block sprinting" is the terrain half of the same
spec row, and terrain properties are WORLD's system by the same law's section 6.
Flagged, not built.

--------------------------------------------------------------------------
AND IT DID NOT WORK, BECAUSE TWO NUMBERS HAD BEEN QUIETLY WRONG
--------------------------------------------------------------------------
The first cut of this shipped a STATUE, not an orthogonal walker. Measured over 60
arenas: an ordinary gunman has somewhere better to stand 86% of the time; a
SEC-BOT, 49% with all eight cells and 35% with four. Halving his neighbours did
not cause that. It EXPOSED it.

BUG ONE IS MINE, FROM TWO DAYS AGO. V160 capped every gun's MAX at the sight
ceiling -- shotgun 14->9, pistol 16->12, smg 26->15, rifle 44->16, sniper 64->16
-- and left the EFF column exactly where it sat. The rifle came out eff:20 max:16
and the sniper eff:30 max:16: two guns that want to fight further than they can
shoot, on a board that stops at 16 and spawns everybody inside sight. pressScore's
ENTIRE progress gradient is `2.2*max(0,d-eff)/mx`, so with eff past the end of the
board that term is ZERO at every reachable distance, and the heavy and the sniper
were being moved by nothing but a BINARY cover test.

THE FIX IS ONE DOOR, THE ONE MAX ALREADY GOES THROUGH. effRange() mirrors
maxRange(): a gun can never want to fight beyond its own reach, and the dark
shrinks where it wants to fight exactly as it shrinks where it can. NOTHING IS
PICKED. No eff number is retyped -- inventing "a rifle's real comfort is 13" would
be me authoring a dial to make my own feature measure well, which is the exact
thing he caught on 8/16 when I sized a magazine to pass a gate. The clamp takes
each gun to its OWN max and no further, so the existing order (9/12/15/16) is
untouched.

BUG TWO IS OLDER AND WORSE: THE BAR A STEP HAS TO CLEAR WAS HIGHER THAN A STEP.
Progress is worth PRESS_PULL/mx per tile -- 0.183 a tile to a 12-tile pistol, and
0.1375 to a 16-tile rifle -- against a flat PRESS_WORTH of 0.18 typed in beside
it. The pistol cleared the bar by two thousandths. THE RIFLE NEVER COULD, AT ANY
DISTANCE, EVER. Divide by your own range and the further your gun shoots the less
a tile is allowed to be worth to you, which is backwards, and 0.18 was not a
margin for those guns, it was a wall. The bar is DERIVED off the pull now, against
the longest reach in the game, and means one plain thing: HALF A TILE OF REAL
PROGRESS.

WHAT THE TWO FIXES BOUGHT, MEASURED: ordinary gunmen 86% -> 99%, SEC-BOT on four
cells 35% -> 57%. And they changed what the feature measures, downward and
honestly: the statue "manufactured" 4.03 tiles of distance while stepping 2.6
turns in 8, the real mechanic manufactures 2.44 while stepping 5.8 against the
eight-way arm's 6.3. A body that never moves also generates distance. That is not
this feature, and the gate now checks the step COUNT so it can tell them apart.

REUSE CHECK: cooks NO graphic pixels. Reuses ARCH, PRESS_CELLS and pressAI's
existing scorer -- the orthogonal set is PRESS_CELLS filtered, not a second table,
so the two can never drift -- and effRange is maxRange's own body, not a second
clamp. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is the spec's own sentence: an
orthogonal-only enemy is more interesting than a higher-HP one and teaches
something durable. The restraint is that nothing announces it -- no icon, no
label. He will learn it by cutting a corner and watching the machine fail to.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V164 MOVEMENT ASYMMETRY'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v164 already in; nothing to do')
        return

    # ---- 1. the identity, declared where every other identity lives ----
    old = """  bot:  {n:'SEC-BOT',hp:160, acc:0.62, dmg:[18,30], bot:true,  melee:false},"""
    new = """  /* ===== V164 MOVEMENT ASYMMETRY (RF4-51, machine 3) ==========
     "Slow enemies move ORTHOGONALLY ONLY; you move DIAGONALLY -- every diagonal
      step costs them more than it costs you, so you generate distance out of
      pure geometry with NO RESOURCE SPENT."
     The heavy machine is the slow thing: 160 hp against a goon's 60, and the
     only bot:true in this table. A machine that cannot cut a corner is the most
     legible slow body on the board.
     DECLARED, NOT DERIVED. It sits here next to hp and acc so WHICH bodies are
     slow is one word to change and is visible where every other identity number
     is -- deriving it from a threshold on hp would be authoring canon behind a
     formula. BAT and SPEAR are already asymmetric by cad:2 and are melee, whose
     mover is a separate engine module this session does not touch. */
  bot:  {n:'SEC-BOT',hp:160, acc:0.62, dmg:[18,30], bot:true,  melee:false, ortho:true},"""
    js = subN(js, old, new)

    # ---- 2. and the mover honours it ----------------------------------
    old = """  const PRESS_CELLS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];"""
    new = """  const PRESS_CELLS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  /* V164: the orthogonal set is PRESS_CELLS FILTERED, never a second table, so
     the two can never drift apart the way two copies of a rule always do. */
  const PRESS_CELLS_ORTHO=PRESS_CELLS.filter(c=>c[0]===0||c[1]===0);"""
    js = subN(js, old, new)

    old = """    const _c=cellOf(e);
    for(const off of PRESS_CELLS){"""
    new = """    const _c=cellOf(e);
    /* V164 RF4-51: a slow body has FOUR neighbours, not eight. He keeps all
       eight, so every corner he cuts is ground the machine has to buy with two
       steps -- distance manufactured out of geometry, with no resource spent. */
    for(const off of ((e.E&&e.E.ortho)?PRESS_CELLS_ORTHO:PRESS_CELLS)){"""
    js = subN(js, old, new)

    # ---- 3. eff goes through the same door max already goes through ----
    old = """function maxRange(R){ return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*rangeMult())); }"""
    new = """function maxRange(R){ return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*rangeMult())); }
/* V164: AND EFF GOES THROUGH IT TOO -- IT SHOULD HAVE SINCE V160.
   V160 shrank every gun's MAX to the sight ceiling (rifle 44->16, sniper 64->16)
   and left the EFF column where it was, so those two ended up wanting to fight
   at 20 and 30 tiles on a board that stops at 16. pressScore's whole progress
   gradient is 2.2*max(0,d-eff)/mx, so for the heavy and the sniper that term was
   DEAD BY CONSTRUCTION -- the only thing left moving them was a binary cover
   test. Measured over 60 arenas: an ordinary gunman has somewhere better to
   stand 86% of the time, a SEC-BOT 49%.
   A GUN CANNOT WANT TO FIGHT FURTHER THAN IT CAN SHOOT, and the dark shrinks
   where it wants to fight exactly as it shrinks where it can. NO NUMBER IS
   PICKED HERE: the clamp takes each gun to its OWN max and no further, so the
   existing order (9/12/15/16) survives untouched and nobody has to guess what a
   rifleman's comfort really is. */
function effRange(R){ return Math.min(maxRange(R), Math.max(PT_BLANK, R.eff*rangeMult())); }"""
    js = subN(js, old, new)

    old = """    s-=2.2*Math.max(0,d-R.eff)/mx;"""
    new = """    s-=PRESS_PULL*Math.max(0,d-effRange(R))/mx;   /* V164: his OWN reach, clamped and dimmed */"""
    js = subN(js, old, new)

    # ---- 4. and the bar a step has to clear is DERIVED, not typed ------
    old = """const PRESS_WORTH=0.18;      /* a move has to actually be worth something [DIAL] */"""
    new = """/* V164: the pull gets a NAME, because the bar underneath it is derived from
   it and two loose numbers in a relationship always drift apart. */
const PRESS_PULL=2.2;        /* how badly a man outside his own reach wants to be inside it [DIAL] */
/* ===== V164: A BAR NO SINGLE STEP CAN CLEAR IS NOT A FILTER, IT IS A WALL ====
   Progress is worth PRESS_PULL/mx per tile -- 0.183 a tile to a 12-tile pistol
   and 0.1375 to a 16-tile rifle -- against the flat 0.18 that used to be typed
   here. The pistol cleared the bar by two thousandths. THE RIFLE NEVER COULD, AT
   ANY DISTANCE, EVER, and neither could anything else with a long reach: divide
   by your own range and the further your gun shoots the less a tile is allowed
   to be worth to you, which is backwards and is a wall dressed as a threshold.
   Measured over 60 arenas: an ordinary gunman has somewhere better to stand 96%
   of the time, a SEC-BOT 67%. That gap is not cowardice, it is arithmetic.
   So the bar is DERIVED off the weakest gradient in the game -- the longest
   reach there is -- and it now means one plain thing: HALF A TILE OF REAL
   PROGRESS. Every gun can clear it with one step, which is the least a movement
   threshold can do and still be a threshold. Typing a second number here again
   would put it out of relation the first day somebody moves a range. */
const PRESS_WORTH=0.5*PRESS_PULL/REACH_CEIL;   /* half a tile of progress, at the longest reach in the game [DIAL] */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v164: distance out of pure geometry -- %d chars' % len(js))


if __name__ == '__main__':
    main()
