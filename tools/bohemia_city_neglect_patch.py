#!/usr/bin/env python3
"""
BOHEMIA CITY NEGLECT PATCH -- a commitment has upkeep, and nothing was charging it.
(8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
Gate: gates/faction_arc_gate.js (part H, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and builds no mechanism. neglectFor()
has existed in BohemiaCommitment since 8/15, derived from the stage index, and
BohemiaBelonging.adjust() is the one writer that moves standing and already
clamps at zero. This calls them. Nothing new is invented.

--------------------------------------------------------------------------
THE FIFTH TIME, IN MY OWN SYSTEM
--------------------------------------------------------------------------
    grep neglectFor  ->  a definition, a re-export, and NOTHING ELSE.

Zero callers on the walked surface. Same as BohemiaCommitment.give() (the wall,
8/18), same as the favour that was never collected (8/18), same as the cost that
cost nothing (8/19), same as the ladder with no rungs (8/20). THE ORGAN COMPUTES
IT AND NOTHING APPLIES IT, and this one I wrote myself.

--------------------------------------------------------------------------
WHAT IT IS, AND WHY IT IS THE ONLY ONE OF ITS KIND HERE
--------------------------------------------------------------------------
Every other thing in this stack moves when the player presses something. NEGLECT
IS THE ONLY THING THAT MOVES WHILE HE IS DOING SOMETHING ELSE -- it is the upkeep
on a commitment, charged for a day you did not turn up.

The amount is the STAGE INDEX and nothing said out loud costs nothing:
    none    0   you promised nobody anything, so there is nothing to neglect
    sided   1   you said you were with them, in front of people
    burned  2   you cost yourself somewhere else to be here

That is the shape of the thing being modelled: the further in you are, the more a
quiet week costs you. Derived, never typed, tagged under EVERYTHING COSTS ONE.

--------------------------------------------------------------------------
WHERE IT FIRES, AND WHY THERE
--------------------------------------------------------------------------
The sleep card is the ONE place a day turns over on the walked surface
(DAY.nextDay() + daySync() in its callback). It charges for the day that JUST
ENDED, so the check is against the OLD day number, captured before the rollover:
a day cannot be neglected until it is over.

ONCE PER DAY PER OUTFIT, stamped, because a hook that can run twice is a double
charge nobody can see. And it goes through BohemiaBelonging.adjust, which is the
single writer for the count and already clamps at zero -- neglect can never drive
somebody below a stranger, exactly like a refused claim cannot.

--------------------------------------------------------------------------
AND HE CAN SEE IT COMING
--------------------------------------------------------------------------
THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER (this lane, 8/15). A
cost that only ever arrives overnight, unannounced, is a punishment. The card
says what a quiet day costs with this outfit, on the person, before any of it
happens -- and only for an outfit where it is non-zero, because printing "this
costs you nothing" is noise.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_NEGLECT__'

# ---- the charge, next to the lane's other writers -------------------------
HELPERS_ANCHOR = 'function ctGiveCapped(sv, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- THE UPKEEP ON A COMMITMENT.
   neglectFor() has been in BohemiaCommitment since 8/15 with ZERO CALLERS: the
   organ computed what a quiet day costs and nothing ever charged it. Fifth time
   this exact shape has turned up in this stack, and this one I wrote myself.
   Charged for the day that JUST ENDED -- a day cannot be neglected until it is
   over -- once per outfit, through the single writer, which clamps at zero. */
function ctNeglectFor(sv, dayEnded){
  if(typeof BohemiaCommitment === 'undefined' || typeof BohemiaBelonging === 'undefined')
    return [];
  var out = [], rules = BohemiaBelonging.RULES || {};
  var done = (sv.meta.neglectDay || (sv.meta.neglectDay = {}));
  for(var k in rules){
    /* ONCE PER DAY PER OUTFIT. A hook that can run twice is a double charge
       nobody can see, and this one runs off a card callback. */
    if((done[k]|0) >= dayEnded) continue;
    var st = BohemiaCommitment.stateOf(sv, k);
    var cost = BohemiaCommitment.neglectFor(st)|0;
    if(cost <= 0) continue;                       /* nothing said, nothing owed */
    if(BohemiaBelonging.gaveDayOf(sv, k) === dayEnded) { done[k] = dayEnded; continue; }
    var before = BohemiaBelonging.gaveOf(sv, k);
    if(before <= 0) { done[k] = dayEnded; continue; }
    var after = BohemiaBelonging.adjust(sv, k, -cost);
    done[k] = dayEnded;
    if(after !== before) out.push({ faction:k, lost:before-after, now:after });
  }
  return out;
}
''' + HELPERS_ANCHOR

# ---- fired at the one place a day turns over -----------------------------
OLD_ROLL = """  cardShow(h,function(){ cardHide(); DAY.nextDay(); daySync(); _lastDistrict=null;"""
NEW_ROLL = """  cardShow(h,function(){ cardHide();
    /* """ + MARKER + """ -- charge the upkeep for the day that is ending, BEFORE
       the rollover, because the check is "did you turn up TODAY" and after
       nextDay() today is a different number. */
    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}
    DAY.nextDay(); daySync(); _lastDistrict=null;"""

# ---- and the card says what a quiet day costs, ON THE ROW THAT OWNS IT -----
# IT GOES ON THE COMMITMENT ROW, NOT A NEW ONE, and that is not tidiness -- the
# first cut added its own row and pushed the busiest card to 767px of 844 (91%),
# through the 90% bar that cardfold_gate holds. EVERY LANE THAT ADDS A ROW TO A
# SHARED SURFACE OWNS THE TOTAL, NOT JUST THE ROW (this lane's own law, 8/18, four
# days old, broken by me on the first try).
# And it belongs there anyway: the upkeep is a PROPERTY OF THE COMMITMENT, not a
# separate fact. It changes when the commitment changes and it is meaningless
# without it, so it reads as one thought: what you did, and what it costs to keep.
OLD_WALL = """      if(ctWall && ctWall.state !== 'none') body += ctRow('HOW FAR IN', ctWall.word);"""
NEW_WALL = """      /* """ + MARKER + """ -- AND WHAT A QUIET DAY COSTS, on the row that
         owns it, before it ever happens. THE CONSEQUENCE IS PRINTED BEFORE THE
         BUTTON, NEVER AFTER (8/15): a cost that only arrives overnight,
         unannounced, is a punishment. Only when non-zero -- printing "this
         costs you nothing" is noise. */
      if(ctWall && ctWall.state !== 'none'){
        var ctNegW = ctWall.word;
        try {
          var ctNeg = BohemiaCommitment.neglectFor(
                        BohemiaCommitment.stateOf(bState.sv, ctFid))|0;
          if(ctNeg > 0) ctNegW += ' \u00b7 A QUIET DAY COSTS ' + ctNeg;
        } catch(_e){}
        body += ctRow('HOW FAR IN', ctNegW);
      }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the neglect charge'),
                           (OLD_ROLL, NEW_ROLL, 'the day rollover'),
                           (OLD_WALL, NEW_WALL, 'the quiet-day row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY NEGLECT: a commitment has upkeep, and it is charged now')


if __name__ == '__main__':
    main()
