#!/usr/bin/env python3
"""
BOHEMIA CITY HISTORY PATCH -- neglect broke two things that used a COUNT as a
memory. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
Gate: gates/faction_arc_gate.js (part J, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and adds no save field. Both facts it
needs already exist and both already survive neglect -- gaveDayOf (stamped the
first time you ever act for an outfit) and the commitment state. This reads them.

--------------------------------------------------------------------------
WHAT I BROKE YESTERDAY, WITH THE THING I SHIPPED YESTERDAY
--------------------------------------------------------------------------
Until neglect existed, `gave` only ever went UP. So `gave > 0` was a perfectly
safe proxy for "you have dealt with these people", and two things leaned on it:

  THE TERMS FOLD (8/18)  folds the outfit's terms once gave > 0, on the grounds
                         that you have demonstrably already read them.
  THE RUNG WORD          RUNGS[0] is "A STRANGER", note: "They have no reason to
                         think about you."

NEGLECT (8/20) MADE `gave` GO DOWN, and both proxies broke the same day. Measured
on the real card -- commit all the way to `burned`, then stay away twenty days:

    gave=0   state=burned
    YOU ARE      A STRANGER - 1 MORE TO SOMEBODY WHO SHOWED UP
    HOW FAR IN   YOU BURNED A BRIDGE - A QUIET DAY COSTS 2
    THEY WANT / THEY HOLD / PAID IN / CAREFUL     (the full terms, again)

YOU BURNED A BRIDGE FOR THESE PEOPLE AND THE GAME CALLS YOU A STRANGER, and hands
you their terms as though you had never met. Each half is individually correct
and together they are nonsense.

--------------------------------------------------------------------------
THE FIX IS TO STOP ASKING A COUNTER TO REMEMBER
--------------------------------------------------------------------------
A COUNT IS NOT A MEMORY. "How much are you worth to them right now" and "have you
ever dealt with them" are different questions, and the second one has its own
answers already in the save, both of which survive neglect:

    gaveDayOf(fid) != null     you have acted for them at least once, ever
    commitment != 'none'       you said it out loud in front of people

Neither is a new field and neither can be drained, because adjust() only ever
touches the count.

WHAT CHANGES: the terms stay folded once you have ever dealt with them, and
somebody who has is never described as a stranger. The NUMBER is untouched --
their standing really has decayed and the card still says so. It is the WORD that
was lying.

The replacement line is a real attempt (ALWAYS MAKE AN ATTEMPT, 8/11) and ships
tagged draft:true so every word stays his to edit.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_HISTORY__'

# ---- one question, one answer --------------------------------------------
HELPERS_ANCHOR = 'function ctNeglectFor(sv, dayEnded){'
HELPERS = '''/* ''' + MARKER + ''' -- HAVE YOU EVER DEALT WITH THESE PEOPLE?
   A COUNT IS NOT A MEMORY. Until neglect (8/20) `gave` only went up, so `gave>0`
   was a safe proxy for this -- and two things leaned on it. The day the count
   could fall, both broke: a player who had burned a bridge and then stayed away
   was called A STRANGER and handed the outfit's terms as if they had never met.
   Both facts below already exist and neither can be drained, because adjust()
   only ever touches the count. */
function ctEverDealt(sv, fid){
  if(!fid || typeof BohemiaBelonging === 'undefined') return false;
  try {
    if(BohemiaBelonging.gaveOf(sv, fid) > 0) return true;
    if(BohemiaBelonging.gaveDayOf(sv, fid) != null) return true;
    if(typeof BohemiaCommitment !== 'undefined'
       && BohemiaCommitment.stateOf(sv, fid) !== 'none') return true;
  } catch(_e){}
  return false;
}
''' + HELPERS_ANCHOR

# ---- the fold remembers too ----------------------------------------------
OLD_FOLD = """      if(ctTermsFolded(BohemiaBelonging.gaveOf(bState.sv, ctFid))){"""
NEW_FOLD = """      /* """ + MARKER + """ -- folded on HISTORY, not on the count. A player
         whose standing decayed to nothing has still read these terms. */
      if(ctTermsFolded(ctEverDealt(bState.sv, ctFid) ? 1 : 0)){"""

# ---- and nobody who has dealt with them is a stranger --------------------
OLD_RUNG = """      if(bar.rung && ctLadder) body += ctRow('YOU ARE', bar.rung.word"""
NEW_RUNG = """      /* """ + MARKER + """ -- AND SOMEBODY WHO BURNED A BRIDGE FOR THEM IS
         NOT A STRANGER. RUNGS[0] means "they have no reason to think about you",
         which is false the moment you have ever acted for them -- and after
         neglect the count can say stranger while the history says otherwise.
         The NUMBER is untouched: their standing really has decayed and the rest
         of the card still says so. It is the WORD that was lying.
         draft:true -- a real attempt, his to edit. */
      if(bar.rung && ctLadder && ctEverDealt(bState.sv, ctFid)
         && bar.rung.key === 'stranger'){
        body += ctRow('YOU ARE', 'NOT A STRANGER, AND NOT MUCH ELSE. THEY KNOW '
          + 'WHAT YOU DID AND THEY KNOW YOU STOPPED.');
      }
      else if(bar.rung && ctLadder) body += ctRow('YOU ARE', bar.rung.word"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the history helper'),
                           (OLD_FOLD, NEW_FOLD, 'the terms fold'),
                           (OLD_RUNG, NEW_RUNG, 'the rung word')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY HISTORY: a count is not a memory')


if __name__ == '__main__':
    main()
