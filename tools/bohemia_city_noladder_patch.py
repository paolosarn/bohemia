#!/usr/bin/env python3
"""
BOHEMIA CITY NO-LADDER PATCH -- the card promised a climb with no rungs.
(8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
Gate: gates/faction_arc_gate.js (part C, new)

REUSE CHECK (REUSE-FIRST): cooks nothing, invents no canon, adds no mechanism.
It asks BohemiaBelonging.actFor -- the function that already decides this -- one
extra question, and stops printing two rows when the answer is no.

--------------------------------------------------------------------------
WHAT THE CARD SAID, MEASURED ON A REAL COLORFUL MEMBER
--------------------------------------------------------------------------
    RUNS WITH        COLORFUL
    THEY WANT        WHAT YOU ARE
    YOU ARE          A STRANGER - 1 MORE TO SOMEBODY WHO SHOWED UP
    THE WALL         5 MORE AND TURNING UP STOPS WORKING
    (no act row)     NOTHING TO PRESS. THEY ARE STILL DECIDING WHAT YOU ARE.
    buttons          NONE AT ALL

One more WHAT? Five more of WHAT? There is no button on that card. The ladder
row and the wall row describe a climb the player cannot take a single step of,
and this is the third time this week the same disease has surfaced: A SURFACE
THAT DESCRIBES A MECHANISM THE PLAYER CANNOT REACH. 8/18 it was a wall that was
a sign; 8/20 it was a card open on somebody who had walked away; here it is a
progress bar for a ladder with no rungs.

--------------------------------------------------------------------------
AND THE MISSING ACT IS NOT THE BUG. HIS DOSSIERS SAY SO.
--------------------------------------------------------------------------
Two outfits want `character`, and there is no ACTS entry for it. That looked
like a hole until I read what he actually wrote:

  THE COLORFUL -- "To know whether you are safe to be around. That is the whole
    assessment and IT NEVER STOPS RUNNING, and passing it is worth more than any
    faction's standing."
  THE SOCIAL FORCES -- "Recruits, and specifically recruits who are frightened.
    They approach AFTER something bad has happened to you, NEVER BEFORE."

CHARACTER IS NOT SOMETHING YOU DO. IT IS SOMETHING THEY READ OFF YOU. Neither
dossier describes a task; both describe an assessment being run on you, on their
schedule. So inventing a "prove your character" button would be inventing canon
in the two places he was most careful, and the missing ACTS entry is CORRECT.

The card's own words for it are already right -- "THEY ARE STILL DECIDING WHAT
YOU ARE" is a faithful one-line summary of both dossiers. What is wrong is the
two rows printed either side of it, which promise a climb.

--------------------------------------------------------------------------
THE FIX
--------------------------------------------------------------------------
If an outfit has NO act at any state -- not "not today", not "not on their
ground", but none that exists -- then it has no ladder, and the card stops
printing the rung progress and the wall. What it says instead is theirs, verbatim
from the dossier, so the player learns the real rule: with these two, you do not
climb. They watch.

THE DISTINCTION IS THE WHOLE PATCH: noActBecause already separates a PERMANENT
absence ("NOTHING TO PRESS") from a TEMPORARY block ("YOU ALREADY DID TODAY",
"not on their ground"). Only the permanent one silences the ladder -- an outfit
you simply have not visited today still has a climb, and still says so.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_NOLADDER__'

# ---- does this outfit have an act AT ALL? --------------------------------
HELPERS_ANCHOR = 'function ctActState(fid){'
HELPERS = '''/* ''' + MARKER + ''' -- IS THERE A LADDER HERE AT ALL?
   Asked with an IDEALISED state -- nothing given today, standing on their
   ground, something to tell them -- so the answer is about the OUTFIT and not
   about this moment. A `no` here means no act exists at any state, which is
   true of the two outfits that want `character`: his own dossiers describe an
   assessment they run on you ("to know whether you are safe to be around ... it
   never stops running"), never a task you perform. A `yes` with no button today
   is a different thing entirely and keeps its ladder. */
function ctHasLadder(rule){
  if(typeof BohemiaBelonging === 'undefined' || !rule) return false;
  try {
    return !!BohemiaBelonging.actFor(rule, { gaveToday:false, onTheirGround:true,
                                             somethingToTell:true });
  } catch(_e){ return false; }
}
''' + HELPERS_ANCHOR

# ---- the rung row ---------------------------------------------------------
OLD_RUNG = """      if(bar.rung) body += ctRow('YOU ARE', bar.rung.word"""
NEW_RUNG = """      /* """ + MARKER + """ -- no act at any state means no ladder, so no
         progress toward one. "1 MORE TO SOMEBODY WHO SHOWED UP" on a card with
         no button is a promise the player cannot act on. */
      var ctLadder = ctHasLadder(bRule);
      if(bar.rung && ctLadder) body += ctRow('YOU ARE', bar.rung.word"""

# ---- the wall rows --------------------------------------------------------
OLD_WALL = """      if(ctWall && ctWall.atWall && ctWall.blocks){"""
NEW_WALL = """      /* """ + MARKER + """ -- and no wall either. A wall is the end of a
         road, and there is no road. */
      if(ctLadder && ctWall && ctWall.atWall && ctWall.blocks){"""
OLD_WALL2 = """      } else if(ctWall && ctWall.blocks && ctWall.room !== Infinity){"""
NEW_WALL2 = """      } else if(ctLadder && ctWall && ctWall.blocks && ctWall.room !== Infinity){"""

# ---- and say what IS true, in their own words ----------------------------
OLD_WHY = """      var why = BohemiaBelonging.noActBecause(bRule, bState.st);
      if(why) body += ctRow('', why);"""
NEW_WHY = """      var why = BohemiaBelonging.noActBecause(bRule, bState.st);
      if(why) body += ctRow('', why);
      /* """ + MARKER + """ -- and what the rule actually is, so a player meeting
         one of these does not read a blank as a bug. Verbatim from his dossier
         ("To know whether you are safe to be around ... it never stops
         running"), tagged draft so every word stays editable. */
      if(!ctLadder && bRule.wants && bRule.wants !== 'nothing')
        body += ctRow('HOW IT WORKS WITH THEM',
          'YOU DO NOT CLIMB WITH THESE. THEY ARE WORKING OUT WHETHER YOU ARE '
          + 'SAFE TO BE AROUND, AND THAT NEVER STOPS RUNNING.');"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the ladder test'),
                           (OLD_RUNG, NEW_RUNG, 'the rung row'),
                           (OLD_WALL, NEW_WALL, 'the at-wall row'),
                           (OLD_WALL2, NEW_WALL2, 'the room-left row'),
                           (OLD_WHY, NEW_WHY, 'the explanation row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY NOLADDER: an outfit with no act promises no climb')


if __name__ == '__main__':
    main()
