#!/usr/bin/env python3
"""
V218 -- THE HOUSE BOARD IS THE BOARD  (COMBAT lane, VAMILY [house board])

*** PAOLO 9/15, LOCKED (rule 16, laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md):
    "I just entered combat and this is not at the scale that I needed it to be...
    implement it into combat too, right now it's not there." ***

MEASURED FIRST, IN A REAL CITY FIGHT, STARTED THE WAY HE STARTS ONE (the tap V217
shipped), BEFORE ONE LINE WAS WRITTEN. He is right, and the reason is one word long.

    WHAT HE MET                         WHAT V198 BUILT AND NOBODY TURNED ON
    a tile is 12.2 px                   a tile is 65.3 px
    a tile is 0.33 SPRITE WIDTHS        a tile is 1.75 sprite widths
    35.3 tiles across the screen        6.6 tiles across the screen
    a pistol reaches 12 tiles           a pistol reaches 1
    a rifle reaches 16                  a rifle reaches 2
    sight 17 tiles                      sight 6

*** THE WHOLE HOUSE BOARD IS BUILT AND THE FLAG THAT TURNS IT ON IS undefined. ***
G.houseTile is read in exactly one place, houseOn(), and it is ASSIGNED NOWHERE in
the game -- only by a dev button in the bench menu. So the 9/4 ruling A TILE IS A
HOUSE shipped on 9/5 as a switch, and the switch has been off for every fight
anybody has ever played. He entered combat and did not find it because it was never
there.

This is the seventh time this lane has found the same shape: the material was built
and nothing consumed it (the pull-back, the loot, the city's clock, the medic's
pick-up, the guns' close band, the walked street's twelve moments, the save at the
bell). This one is the purest of them -- one undefined flag.

*** AND THE BODY IS ALREADY THE RULED SIZE. MEASURED, NOT ASSUMED, AND THIS IS WHY
    NOTHING BELOW TOUCHES bodyScale. *** The 9/15 law says a person stands "about
half a lot tall at walk zoom". Measured on the fight's own bake, with the dial on:

    the sprite is 112x112 native, and the person INSIDE it is 100 px of ink (0.893)
    drawn sprite 37.33 px, drawn PERSON 33.34 px, a lot is 65.33 px
    SO A PERSON IS 0.51 LOTS TALL
    the bodyScale that would put him at exactly half a lot is 0.327; the shipped
    one is 0.3333. TWO PERCENT APART.

V198 landed the ruled body size a week before the ruling existed. Changing it here
would be inventing a number over a measurement, so it is not changed. What the law
adds beyond V198 -- "bodies are drawn LARGER" -- is delivered by the tile, not by
the sprite: the person goes from a third of a tile wide to more than half a tile,
because the tile grew around him. That is the same thing seen from the other side.

WHAT THIS DOES, AND IT IS DELIBERATELY THE SMALLEST THING THAT MEETS THE RULING:
  1. THE DEFAULT FLIPS. houseOn() answers TRUE when nobody has said otherwise. Every
     fight -- the street, the door, the teaching fight, the bench -- is at house
     scale from now on, with the ranges his 9/4 ruling already named.
  2. THE DIAL SURVIVES. His row for V198 says in his own words that the human-scale
     board is not removed, so the bench button still flips it and now flips what is
     ACTUALLY ON (it used to toggle a raw undefined, so the first press set true and
     read as a no-op). The old board is one tap away for anybody testing.

WHAT IS NOT DONE HERE, AND IT IS A MEASUREMENT AND NOT A SKIP. The row says "entry by
camera with the cloud (small or no pull-back now that both sides share a scale)". THE
TWO SIDES DO NOT SHARE A SCALE YET: RUN's [step is a house] is still OPEN on the
board, and measured this round the walked street still moves one FINE cell a step at
C 44. Shrinking V205's pull-back today would make the entry wrong for the street that
exists. Rule 12 says a dependency is a premise to be measured, and this one measures
FALSE, so the pull-back is left exactly as ruled on 9/6 and this is routed to RUN.

NO DAMAGE BEFORE THE DIAL: not one damage number is touched. What changes is REACH,
which is his own 9/4 ruling typed into HOUSE_MAX on 9/5 (pistol 1, rifle 2), and the
accuracy curve is carried across by V198's own eff/max ratio so it comes out
identical at matching fractions of reach.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_HOUSE_BOARD_IS_THE_BOARD__'

OLD_ON = """function houseOn(){ return !!G.houseTile; }"""

NEW_ON = """/* ===== V218 __THE_HOUSE_BOARD_IS_THE_BOARD__ (COMBAT, [house board]) ========
   PAOLO 9/15: "I just entered combat and this is not at the scale that I needed it
   to be... implement it into combat too, right now it's not there."
   HE IS RIGHT AND THE REASON IS ONE WORD. G.houseTile is read here and ASSIGNED
   NOWHERE IN THE GAME -- only by the bench button forty lines down. So everything
   above this line has been dead since 9/5 and every fight anybody has played was on
   the body board. Measured in a real city fight before changing anything:
       what he met                   what was built and never switched on
       a tile 12.2 px, 0.33 sprite   a tile 65.3 px, 1.75 sprite widths
       35.3 tiles across the glass   6.6 tiles across the glass
       pistol 12 tiles, rifle 16     pistol 1, rifle 2
   AND THE BODY IS ALREADY THE RULED SIZE, measured on the fight's own bake: the
   person is 100 px of ink in a 112 px sprite, drawn at 33.3 px against a 65.3 px
   lot, SO HE STANDS 0.51 LOTS TALL against the law's "about half a lot". bodyScale
   is not touched; the body reads LARGER because the tile grew around it.
   THE DIAL SURVIVES, because his own V198 row says the human-scale board is not
   removed. It just defaults the other way now. */
const HOUSE_DEFAULT=true;   /* [DIAL] the board a fight starts on. His 9/15 ruling */
function houseOn(){ return (G.houseTile===undefined)?HOUSE_DEFAULT:!!G.houseTile; }
/* ===== /V218 __THE_HOUSE_BOARD_IS_THE_BOARD__ ===== */"""

OLD_FLOOR = """function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(reachCeil(), Math.max(hd(PT_BLANK+2), R.max*k)); }"""

NEW_FLOOR = """/* V218 __THE_HOUSE_BOARD_IS_THE_BOARD__: *** AND THE FLOOR HAD TO BE ONE HOUSE,
   WHICH THE HOUSE BOARD ONLY SHOWS WHEN IT IS THE BOARD. *** Found by running this
   row's own gate three times instead of once: two runs in three, the FIRST FIGHT OF
   THE GAME had its one man standing at edist 1 and a pistol that reached 0.75, so he
   could not be shot -- and walking cannot help, because edist 1 IS adjacent and there
   is nowhere closer to stand. A dead first turn, on his first fight.
   WHY: this floor is hd(PT_BLANK+2), a body-scale number divided by eight, which
   lands at 0.75 HOUSES. V198 divided it for a good reason, in its own comment -- an
   undivided floor would be bigger than every house-scale gun and would hand a pistol
   the rifle's reach -- but the result is a floor BELOW ADJACENT. Nights are what
   drove it there: rangeMult halves reach in the dark, and on a board whose reaches
   are 1 and 2 a half is under the floor.
   SO ON THE HOUSE BOARD THE FLOOR IS ONE HOUSE. You cannot stand closer than
   adjacent, so a reach under one tile is not a difficulty, it is a turn you are not
   allowed to take -- and his 9/4 ruling says a pistol IS adjacent, with no clause
   about the hour. The night penalty still bites everywhere it can: a rifle in the
   dark comes down from two houses to one. The body board is not touched. */
function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(reachCeil(), Math.max(houseOn()?1:hd(PT_BLANK+2), R.max*k)); }"""

OLD_EDGE = """function myRange(){ const base=wpnRange(typeof WEAPON!=='undefined'?WEAPON:'pistol');
  const need=longestFoeReach()+hd(RANGE_EDGE);   /* V198 */"""

NEW_EDGE = """function myRange(){ const base=wpnRange(typeof WEAPON!=='undefined'?WEAPON:'pistol');
  /* V218 __THE_HOUSE_BOARD_IS_THE_BOARD__: *** AND ON THE HOUSE BOARD YOUR GUN'S
     REACH IS YOUR GUN'S REACH, because V151's granted edge was erasing the whole
     ruling this row exists to deliver. *** MEASURED IN A LIVE FIGHT, which is the
     only way this was ever going to show up:
         longestFoeReach 3 (a sniper's house reach) + hd(RANGE_EDGE) 0.375 = 3.375
         a PISTOL's myRange came back max 3.375, clamped by reachCeil to 3
         a RIFLE's came back 3.375, clamped to 3
     THE SAME NUMBER FOR BOTH GUNS. His 9/4 ruling is "a pistol is like a dagger
     compared to the range of battle brothers and a rifle can do two tiles" -- and a
     pistol that reaches three houses is not a dagger. V151's floor lifts you to the
     longest gun on the field plus an edge, which on a 12-to-16-tile board is a small
     bonus and on a board of 1s and 2s is the whole table flattened.
     NEWEST DATE WINS AND HE TYPED THE NUMBERS: 9/4 names the house reaches
     explicitly and 9/15 re-affirms the scale, both after V151. So on the house board
     the gun's own number is the answer. THE BODY BOARD KEEPS V151 EXACTLY, untouched,
     including its own note that he marked it temporary and wants earned range instead
     of granted.
     AND V151'S PURPOSE SURVIVES WITHOUT IT. Its reason was movement -- "so I want to
     see more movement", men having to walk to you. On a board six houses across where
     reaches are 1 and 2, everybody has to close no matter who is holding what; the
     edge is not what manufactures movement there, the scale is. */
  if(houseOn())return base;
  const need=longestFoeReach()+hd(RANGE_EDGE);   /* V198 */"""

OLD_BTN = """    const hb=D('housebtn');
    const _paintHouse=()=>{ if(!hb)return;
      hb.textContent='TILE: '+(G.houseTile?'A HOUSE':'A BODY');
      hb.style.borderColor=G.houseTile?'#5fbf6a':'#a88a5a';
      hb.style.color=G.houseTile?'#8fe89a':'#e8c88a'; };
    if(hb)hb.addEventListener('click',()=>{ G.houseTile=!G.houseTile; _paintHouse();
      try{ const _s=BohemiaArena.get(); if(_s!=null)BohemiaArena.set(_s);
           setupCombat(); renderBoard();
           setRead(G.houseTile?'A TILE IS A HOUSE':'A TILE IS A BODY',
             G.houseTile?'a pistol reaches one house, a rifle two':'the old board, unchanged','#e8c88a'); }catch(_e){} });"""

NEW_BTN = """    /* V218 __THE_HOUSE_BOARD_IS_THE_BOARD__: THE BUTTON READS AND FLIPS WHAT IS
       ACTUALLY ON. It used to paint off a raw G.houseTile, which is undefined until
       somebody presses it, so with the default the other way the first press would
       have set it true and read as a no-op. Asking houseOn() means the label, the
       colour and the flip all agree with the board. */
    const hb=D('housebtn');
    const _paintHouse=()=>{ if(!hb)return;
      const _h=houseOn();
      hb.textContent='TILE: '+(_h?'A HOUSE':'A BODY');
      hb.style.borderColor=_h?'#5fbf6a':'#a88a5a';
      hb.style.color=_h?'#8fe89a':'#e8c88a'; };
    if(hb)hb.addEventListener('click',()=>{ G.houseTile=!houseOn(); _paintHouse();
      try{ const _s=BohemiaArena.get(); if(_s!=null)BohemiaArena.set(_s);
           setupCombat(); renderBoard();
           setRead(houseOn()?'A TILE IS A HOUSE':'A TILE IS A BODY',
             houseOn()?'a pistol reaches one house, a rifle two':'the old board, unchanged','#e8c88a'); }catch(_e){} });"""


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
        print('  the house board is already the board')
        return
    blob = sub(blob, OLD_ON, NEW_ON, 'blob/houseOn')
    blob = sub(blob, OLD_FLOOR, NEW_FLOOR, 'blob/maxRange floor')
    blob = sub(blob, OLD_EDGE, NEW_EDGE, 'blob/myRange edge')
    blob = sub(blob, OLD_BTN, NEW_BTN, 'blob/the bench dial')
    # THE FLAG IS STILL TOUCHED IN EXACTLY TWO PLACES IN CODE -- houseOn reads it and
    # the bench dial writes it. A third reader is the drift this whole row is about:
    # one number in one place (the 9/15 law, section 3). Comments are stripped first,
    # because this file's own prose says the name a dozen times and a guard that
    # counts words in comments is a guard that goes off when somebody documents.
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    n = code.count('G.houseTile')
    if n != 3:      # houseOn reads it twice (is it set, and what is it), the dial writes it once
        sys.exit('GUARD: G.houseTile is touched %d times in code; expected 3 '
                 '(houseOn reads it twice, the bench dial writes it once)' % n)
    if code.count('G.houseTile') - code.count('function houseOn()') * 2 != 1:
        sys.exit('GUARD: something outside houseOn and the dial touches the flag')
    if blob.count('function houseOn()') != 1:
        sys.exit('GUARD: houseOn is not defined exactly once')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V218 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
