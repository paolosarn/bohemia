#!/usr/bin/env python3
"""
BOHEMIA CITY SIDE-COST PATCH -- taking a side finally costs you somewhere else.
(8/19/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_IT_COSTS_YOU_SOMEWHERE_ELSE_8_19_26.md
Gate: gates/commitment_gate.js (part G, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and builds no new mechanism. Every
piece already shipped and was already approved -- whoHears (8/15) walks the tie
graph, landing (8/15) says fact-or-rumour, BohemiaBelonging.adjust (8/16) is the
one writer that moves standing. This JOINS them. The only new code is the pure
BohemiaCommitment.costs(), which derives its number from the stage index exactly
the way neglect already does.

--------------------------------------------------------------------------
THE HOLE, AND THE GAME HAS BEEN PROMISING IT IN WRITING FOR FOUR DAYS
--------------------------------------------------------------------------
The `burned` commitment stage has shipped this sentence since 8/15:

    "You cost yourself somewhere else to be here. This is the one that cannot
     be walked back."

GREP SAYS NOTHING ANYWHERE EVER COST YOU SOMEWHERE ELSE. BohemiaBelonging.adjust
was called in exactly two places and both passed ctFid -- the outfit you are
standing in front of. Word already travelled: whoHears walks the acquaintance
graph and other outfits really do hear, AS FACT at one hop and AS A RUMOUR
beyond, and the card has been printing WHO WILL HEAR since 8/15. And then
nothing happened to any of them.

That is the same disease as the favour that was never collected (8/18), one
system over, in a system this lane wrote itself: A STAGE NAMED FOR A CONSEQUENCE
THE GAME DOES NOT APPLY.

--------------------------------------------------------------------------
WHY IT NEEDS NO RIVALRY TABLE, WHICH IS THE PART THAT KEEPS IT LEGAL
--------------------------------------------------------------------------
The obvious build is "committing to A hurts you with A's enemies" -- and who
hates whom is HIS canon, unruled, and MECHANISM-MINE/CONTENTS-PAOLO'S forbids me
inventing it.

I do not need it. COSER, and LIPSET & ROKKAN on cross-cutting cleavages: a tie
to one side is a liability with EVERY other side, not only with declared
enemies, and that generalised liability is the entire mechanism by which
cross-cutting ties damp conflict -- everybody ends up partially compromised.
Taking a side is exclusive by construction. So what it costs you is simply
WITH WHOEVER FINDS OUT, and no outfit is named anywhere in the code.

--------------------------------------------------------------------------
THREE RULES, ALL READ OFF SHIPPED TEXT
--------------------------------------------------------------------------
  1. A RUMOUR CANNOT COST YOU. LANDING.secondhand says so itself: "They will
     hear that you did something. THEY WILL NOT HEAR EXACTLY WHAT." You do not
     lose standing over a thing nobody can pin on you. Only `direct` costs.
  2. YOU CANNOT FALL BELOW A STRANGER. An outfit that never counted you has
     nothing to take away.
  3. THE AMOUNT IS THE STAGE INDEX -- nothing said costs 0, taking a side costs
     1, burning a bridge costs 2 -- derived from position exactly like neglect,
     never typed, tagged as a placeholder so his tuning pass enumerates it.

--------------------------------------------------------------------------
AND IT IS PRINTED BEFORE THE BUTTON, WHICH IS THIS LANE'S OWN LAW
--------------------------------------------------------------------------
THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER (8/15, rule 2). The
card already says WHO WILL HEAR; it now says WHAT IT WILL COST YOU, by name and
by number, on the row above the button that does it. A cost you discover
afterwards is a punishment; a cost you read first is a decision.

THIS IS ALSO WHAT MAKES TERTIUS A DECISION INSTEAD OF A CAPTION. Standing where
your outfits have no line to each other (gaudens, Burt's structural hole) means
nobody hears it as fact, so it costs NOTHING -- and the 2024 tertius dolens
correction is the other half: once they are connected, the position that would
have made you the only route makes you the person everybody charges.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_SIDECOST__'

# ---- what you stand at with every outfit, in one place --------------------
HELPERS_ANCHOR = 'function ctHearRows(body, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- WHAT YOU STAND AT WITH EVERYBODY.
   costs() needs every outfit's standing, not just this one's, because the
   question is what the OTHERS take off you. Read through BohemiaBelonging's own
   accessor rather than reaching into the save: the three-spellings bug has bitten
   this file six times and gaveOf is where it is solved. */
function ctStandings(){
  var out = {};
  if(typeof BohemiaBelonging === 'undefined') return out;
  var sv = ctBelongSave(), rules = BohemiaBelonging.RULES || {};
  for(var k in rules) out[k] = BohemiaBelonging.gaveOf(sv, k);
  return out;
}
/* ''' + MARKER + ''' -- WHAT TAKING THIS SIDE WILL COST YOU ELSEWHERE.
   Asked for the state you would MOVE TO, never the one you are in, because the
   card is answering "what happens if I press this" and the player has not
   pressed it yet. */
function ctSideCost(fid, nextState){
  if(typeof BohemiaCommitment === 'undefined' || typeof BohemiaTies === 'undefined')
    return [];
  try {
    var heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(), {ties:BohemiaTies});
    return BohemiaCommitment.costs(nextState, heard, ctStandings()) || [];
  } catch(_e){ return []; }
}
function ctSideCostWords(list){
  return list.map(function(c){ return c.faction + ' -' + c.lose; }).join(', ');
}
''' + HELPERS_ANCHOR

# ---- the row, printed BEFORE the button ----------------------------------
OLD_ROWS = """  var via = heard[0].via==='home' ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                  : 'SOMEBODY THEY WORK BESIDE';
  body += ctRow('IT GETS OUT THROUGH', via);
  return body;
}"""
NEW_ROWS = """  var via = heard[0].via==='home' ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                  : 'SOMEBODY THEY WORK BESIDE';
  body += ctRow('IT GETS OUT THROUGH', via);
  /* """ + MARKER + """ -- THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER
     AFTER (8/15, rule 2). A cost you find out about afterwards is a punishment;
     a cost you read first is a decision. Asked for the state the button would
     move you TO, because that is the question being answered. */
  var ctNext = null;
  try { ctNext = BohemiaCommitment.commit(
          BohemiaCommitment.stateOf(ctBelongSave(), fid),
          BohemiaBelonging.gaveOf(ctBelongSave(), fid)); } catch(_e){}
  var ctCost = (ctNext && ctNext.moved) ? ctSideCost(fid, ctNext.state) : [];
  if(ctCost.length){
    body += ctRow('AND IT COSTS YOU', ctSideCostWords(ctCost));
    body += ctRow('', 'They are not your enemies. They just heard you picked '
      + 'somebody, and it was not them.');
  } else if(ctNext && ctNext.moved){
    /* THE STRUCTURAL HOLE, PAYING OUT IN A NUMBER. Burt/Simmel: standing where
       your outfits have no line to each other means nobody hears it as fact. */
    body += ctRow('AND IT COSTS YOU', 'NOTHING. NOBODY WHO COULD CHARGE YOU FOR '
      + 'IT IS CLOSE ENOUGH TO KNOW.');
  }
  return body;
}"""

# ---- and the commitment actually applies it ------------------------------
OLD_COMMIT = """    var r=BohemiaCommitment.commit(cur, BohemiaBelonging.gaveOf(sv, ctFid));
    if(r.moved) BohemiaCommitment.setState(sv, ctFid, r.state);"""
NEW_COMMIT = """    var r=BohemiaCommitment.commit(cur, BohemiaBelonging.gaveOf(sv, ctFid));
    if(r.moved){
      BohemiaCommitment.setState(sv, ctFid, r.state);
      /* """ + MARKER + """ -- AND IT COSTS YOU SOMEWHERE ELSE. The `burned`
         stage has said this in writing since 8/15 and nothing ever did it:
         adjust() was only ever called on the outfit in front of you. */
      var ctPaid = ctSideCost(ctFid, r.state);
      for(var ci=0; ci<ctPaid.length; ci++)
        BohemiaBelonging.adjust(sv, ctPaid[ci].faction, -ctPaid[ci].lose);
    }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the standings + cost helpers'),
                           (OLD_ROWS, NEW_ROWS, 'the cost row above the button'),
                           (OLD_COMMIT, NEW_COMMIT, 'the commit writer')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY SIDECOST: taking a side costs you with whoever hears it')


if __name__ == '__main__':
    main()
