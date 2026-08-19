#!/usr/bin/env python3
"""
BOHEMIA CITY WALL-ENFORCE PATCH -- the wall was a sign, not a fence.
(8/18/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_WALL_WAS_A_SIGN_8_18_26.md
Gate: gates/commitment_gate.js (part E, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and builds no mechanism. The clamp
already exists and is already approved -- BOH_RESOLVE.makeCeiling via
BohemiaCommitment.give(). This routes the surface through it instead of past it.

--------------------------------------------------------------------------
WHAT WAS WRONG, AND IT SHIPPED THREE TIMES
--------------------------------------------------------------------------
8/15 shipped THE WALL: turning up runs out of road, and only a commitment passes
it. The card says so. The organ clamps. And the button did not go through the
organ.

`BohemiaCommitment.give()` -- the clamp -- was called ZERO times in this file.
The act button called BohemiaBelonging.record() directly, which increments with
no ceiling at all. Measured on the real surface: press it nine times and you
reach gave 9 against a ceiling of 5, commitment state still 'none', rung reading
COUNTED. You walk through the wall while the card tells you it is there.

WHY THE GATES DID NOT CATCH IT, which is the part worth keeping. commitment_gate
part A proves give() clamps -- true, and the city never called give(). Part D
proves the card DISPLAYS the wall and that the commit button moves the state --
both true. NO CLAIM ANYWHERE PRESSED THE ACT BUTTON PAST THE WALL ON THE REAL
SURFACE. It is the same failure as 8/15's stale-agents outage one level down:
the organ was verified, the wiring was not, and "the card shows the right thing"
was mistaken for "the thing is enforced".

--------------------------------------------------------------------------
TWO CHANGES, BELT AND BRACES, AND THE GATE ASSERTS BOTH
--------------------------------------------------------------------------
  1. THE BUTTON IS NOT OFFERED AT THE WALL. actFor() knows what an outfit wants
     but nothing about ceilings, so the card was offering an act that could not
     do anything. A button that does nothing is worse than no button: it tells
     the player the wall is soft.
  2. THE RECORD IS CLAMPED ANYWAY. One helper, used by BOTH writers (the act and
     the merged favour-act for a debt outfit), so a future third caller cannot
     quietly reopen the hole.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_WALLFENCE__'

# ---- one clamped writer, next to the lane's other helpers -----------------
HELPERS_ANCHOR = 'function ctOwedTo(fid){'
HELPERS = '''/* ''' + MARKER + ''' -- THE ONE CLAMPED WRITER.
   The wall (8/15) was a sign and not a fence: BohemiaCommitment.give() -- the
   approved clamp -- was called zero times here, and the act button went straight
   to BohemiaBelonging.record(), which has no ceiling. Measured before the fix:
   nine presses took you to 9 against a ceiling of 5 with no commitment made.
   Every writer that can RAISE the count goes through here now, so a third
   caller cannot reopen it by accident. */
function ctGiveCapped(sv, fid){
  if(typeof BohemiaCommitment === 'undefined')
    return BohemiaBelonging.record(sv, fid, (T && T.day) || 1);
  var st = BohemiaCommitment.stateOf(sv, fid);
  var have = BohemiaBelonging.gaveOf(sv, fid);
  var r = BohemiaCommitment.give(st, have, 1);
  if(r.gained <= 0) return have;              /* at the wall: nothing moves */
  return BohemiaBelonging.record(sv, fid, (T && T.day) || 1);
}
''' + HELPERS_ANCHOR

# ---- the act button is not offered at the wall ---------------------------
OLD_ACT = """      ctAct = BohemiaBelonging.actFor(bRule, bState.st);"""
NEW_ACT = """      ctAct = BohemiaBelonging.actFor(bRule, bState.st);
      /* """ + MARKER + """ -- and NOT at the wall. actFor knows what an outfit
         wants and nothing about ceilings, so the card was offering an act that
         could not move anything. A button that does nothing is worse than no
         button: it tells the player the wall is soft. */
      if(ctAct && ctWall && ctWall.atWall) ctAct = null;"""

# ---- both writers go through the clamp ----------------------------------
OLD_GIVE = """    var sv=ctBelongSave();
    BohemiaBelonging.record(sv, ctFid, T.day||1);"""
NEW_GIVE = """    var sv=ctBelongSave();
    /* """ + MARKER + """ */
    ctGiveCapped(sv, ctFid);"""

OLD_FAVACT = """    if(r.took && ctFavIsAct) BohemiaBelonging.record(sv, ctFid, T.day||1);"""
NEW_FAVACT = """    /* """ + MARKER + """ -- the merged favour-act for a debt outfit is a WRITER
       too, and it was the second way through the wall. */
    if(r.took && ctFavIsAct) ctGiveCapped(sv, ctFid);"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the clamped writer'),
                           (OLD_ACT, NEW_ACT, 'the act suppression at the wall'),
                           (OLD_GIVE, NEW_GIVE, 'the act writer'),
                           (OLD_FAVACT, NEW_FAVACT, 'the merged favour-act writer')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY WALLFENCE: the wall is a fence now')


if __name__ == '__main__':
    main()
