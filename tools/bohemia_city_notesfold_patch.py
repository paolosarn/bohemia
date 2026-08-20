#!/usr/bin/env python3
"""
BOHEMIA CITY NOTES-FOLD PATCH -- the headline is live, the explanation is the
outfit's, and the outfit's facts fold. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
Gate: gates/cardfold_gate.js (A13, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and invents no rule. It applies the
EXISTING 8/18 fold (ctTermsFolded / CT_TERMS_OPEN / "tap to read") to a class of
row the card already marks out for itself, and adds no second affordance.

--------------------------------------------------------------------------
THE CARD HAD AN EXPLAINER CONVENTION ALL ALONG AND THE FOLD NEVER USED IT
--------------------------------------------------------------------------
An empty label is not a formatting accident in this file. Four systems already
emit their explanation as ctRow('', ...) directly under the row it explains:

    ctClaimRows    ctRow('', c.askNote)          "Not offering. Asking."
    ctFavourRows   ctRow('', a.note)             "It will cost you some of what
                                                  you built. They do not do
                                                  favours for people who have
                                                  not turned up."
    noActBecause   ctRow('', why)
    sideCost       ctRow('', 'They are not your enemies...')

EVERY ONE OF THEM IS A FACT ABOUT THE OUTFIT'S MECHANIC -- identical on every
member of that outfit, forever, and unchanged by anything the player does. That
is word for word the test the 8/18 fold already applies to THEY WANT / THEY HOLD
/ PAID IN / CAREFUL / HOW YOU GET THE REST. The rows were simply outside the
fold, and the empty label was the seam sitting there the whole time.

--------------------------------------------------------------------------
THE HEADLINE STAYS. THAT IS THE WHOLE DISTINCTION
--------------------------------------------------------------------------
cardfold_gate A5: "the live question is never folded -- what they are asking and
where you stand stay on the card at all times." Nothing here touches a headline:

    THEY ARE ASKING YOU    YOU, ON A LIST        <- stays, always
    (Not offering. Asking.)                      <- folds
    THEY EXPECT AN ANSWER  TODAY.                <- stays, always
    YOU CAN ASK THEM FOR   ENFORCEMENT OF A DEAL <- stays, always
    (It will cost you...)                        <- folds

What is being asked, when it is due, and what is on offer are all still on the
card. The sentence explaining how that mechanic works is one tap away with the
rest of the outfit's terms. DEFER, NEVER DROP: ctTermsFolded already accounts for
CT_TERMS_OPEN, so "tap to read" brings every one of them back.

--------------------------------------------------------------------------
WHY NOW: 96% AFTER THE VOUCH, AND THREE TRIMS WOULD HAVE BEEN THE WRONG FIX
--------------------------------------------------------------------------
Wiring the Mob's vouch (__CITY_THIRDPARTY__, same turn) put the busiest reachable
card at 833px of 844. Deduping the NAME row against the heading (__CITY_NAMEDUPE__)
took it to 810 -- still over the bar.

The tempting next move was to shorten three unrelated rows until the number went
green. THAT IS FITTING THE CONTENT TO THE RULER wearing a different coat: three
systems each losing a few words to make room for a fourth. The card does not need
three trims, it needs ONE RULE it was already halfway to having -- and a rule
generalises, where a trim has to be re-argued every time somebody adds a row.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_NOTESFOLD__'

# ---- the seam, in one place ----------------------------------------------
HELPERS_ANCHOR = 'function ctClaimRows(body, rule, fid, given){'
HELPERS = '''/* ''' + MARKER + ''' -- AN EXPLAINER IS AN OUTFIT FACT, SO IT FOLDS.
   ctRow('', ...) is this card's own long-standing mark for "the sentence that
   explains the row above". Every such sentence is identical on every member of
   the outfit forever, which is exactly the test the 8/18 terms fold applies.
   The HEADLINE never folds (cardfold A5: the live question always stays); only
   the explanation does, and one tap on "tap to read" brings it back with the
   rest of the terms. Set once per card draw so the two cannot disagree. */
var CT_NOTES_FOLDED = false;
function ctNote(txt){ return (CT_NOTES_FOLDED || !txt) ? '' : ctRow('', txt); }
''' + HELPERS_ANCHOR

EDITS = [
    # the claim's explanation
    ("""  body += ctRow(c.ask, c.what);
  body += ctRow('', c.askNote);""",
     """  body += ctRow(c.ask, c.what);
  body += ctNote(c.askNote);          /* """ + MARKER + """ */"""),
    # the favour's explanation
    ("""    body += ctRow(a.word, a.what);
    if(a.note) body += ctRow('', a.note);""",
     """    body += ctRow(a.word, a.what);
    body += ctNote(a.note);           /* """ + MARKER + """ */"""),
    # why there is no act right now
    ("""      var why = BohemiaBelonging.noActBecause(bRule, bState.st);
      if(why) body += ctRow('', why);""",
     """      var why = BohemiaBelonging.noActBecause(bRule, bState.st);
      body += ctNote(why);            /* """ + MARKER + """ */"""),
    # what taking a side costs you elsewhere
    ("""    body += ctRow('', 'They are not your enemies. They just heard you picked '
      + 'somebody, and it was not them.');""",
     """    body += ctNote('They are not your enemies. They just heard you picked '
      + 'somebody, and it was not them.');  /* """ + MARKER + """ */"""),
]

# ---- and it is decided once, where the fold is already decided ------------
OLD_SET = """  var ctFid = (typeof ctFactionOf==='function') ? ctFactionOf(p) : null;"""
NEW_SET = """  var ctFid = (typeof ctFactionOf==='function') ? ctFactionOf(p) : null;
  /* """ + MARKER + """ -- ONE ANSWER PER CARD DRAW. Read here, above every row
     builder that asks it, because a flag set halfway down would fold some
     explainers and not others on the same card. Same history test the terms
     fold uses (__CITY_HISTORY__), never a second idea of the same fact. */
  CT_NOTES_FOLDED = false;
  try {
    CT_NOTES_FOLDED = !!ctFid
      && ctTermsFolded(ctEverDealt(ctBelongSave(), ctFid) ? 1 : 0);
  } catch(_e){}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if HELPERS_ANCHOR not in s:
        sys.exit('FAIL: could not find the claim rows')
    s = s.replace(HELPERS_ANCHOR, HELPERS, 1)
    if OLD_SET not in s:
        sys.exit('FAIL: could not find the faction lookup')
    s = s.replace(OLD_SET, NEW_SET, 1)
    for i, (old, new) in enumerate(EDITS):
        if old not in s:
            sys.exit('FAIL: could not find explainer ' + str(i + 1))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY NOTESFOLD: the headline is live, the explanation folds')


if __name__ == '__main__':
    main()
