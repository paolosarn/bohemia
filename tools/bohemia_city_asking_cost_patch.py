#!/usr/bin/env python3
"""
BOHEMIA CITY ASKING-COST PATCH -- three outfits charge you for asking their name,
and nobody was ever told. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
Gate: gates/faction_arc_gate.js (part K, new)

REUSE CHECK (REUSE-FIRST): cooks nothing, invents no canon, adds no mechanic.
BohemiaIntros.askOutcome() has returned these costs since the organ shipped on
8/11; this prints what it already says. The COSTS table is his, verbatim.

--------------------------------------------------------------------------
THE SEVENTH TIME, AND IT WAS FOUND BY SWEEPING FOR IT
--------------------------------------------------------------------------
Six times this week the same shape: an organ computes something and nothing on
the walked surface calls it (give(), the uncollected favour, the cost that cost
nothing, the ladder with no rungs, neglectFor, and the count that was asked to
remember). So instead of waiting to trip over the seventh, I swept every function
this lane exports and counted its call sites in the city.

    BohemiaIntros.askOutcome   0 CALLERS.

It is the function that says what asking costs you, and three of the sixteen
charge a real price for it -- his words, from the COSTS table:

    CARTEL      refused          A SMILE AND A REDIRECT. EVERY TIME. FOREVER.
    MOB         permanent-mark   A SMALL PERMANENT MARK AGAINST YOU.
    ANARCHISTS  insult-once      AN INSULT. YOU GET TO MAKE IT ONCE.

The other thirteen cost nothing, which is why this was invisible: the common case
is free, so the button looked fine.

--------------------------------------------------------------------------
WHAT THIS DOES AND DELIBERATELY DOES NOT DO
--------------------------------------------------------------------------
IT TELLS HIM BEFORE HE PRESSES. THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON,
NEVER AFTER (this lane, 8/15). A price you discover by paying it is a punishment;
a price you read first is a decision -- and with the Mob it is THE decision,
because the whole mechanic is that you are supposed to wait to be introduced.

IT DOES NOT INVENT A PENALTY. "A small permanent mark against you" is not a stat
this repo has, and minting one would be inventing canon in the exact place his
dossier is most specific. MECHANISM-MINE / CONTENTS-PAOLO'S. The card says what
he wrote; if a mark ever becomes a number, it will be because he ruled one.

AND IT ONLY SHOWS WHERE THERE IS SOMETHING TO SAY. Thirteen outfits cost nothing,
and printing "this costs you nothing" on all of them is noise -- the same reason
the quiet-day row only appears above zero.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_ASKCOST__'

# ---- IT FOLDS WITH THE REST OF THE TERMS ---------------------------------
# TWO TURNS RUNNING I ADDED A ROW AND cardfold_gate WENT RED. The first cut here
# gave the cost its own row (769px of 844, 91%, over the bar); merging it into
# HOW YOU GET THE REST did not help either, because the merged text WRAPS and a
# wrapped row costs the same height as a new one.
# THE PERSON CARD HAS NO HEADROOM. Five systems write to it and it sits at 86% at
# its busiest. Scraping under the bar by shortening words would be fitting the
# text to the ruler; the honest fix is structural, and it was sitting there:
#
#   HOW YOU GET THE REST IS A FACT ABOUT THE OUTFIT. It is `m.next` off the
#   outfit's rule -- IDENTICAL on every member of that outfit, forever -- which is
#   word for word the test the 8/18 fold already applies to THEY WANT / THEY HOLD
#   / PAID IN / CAREFUL. It was simply outside the fold, and it should never have
#   been. Folding it BUYS headroom instead of borrowing it, and it makes the fold
#   rule consistent rather than carving an exception.
#
# DEFER, NEVER DROP holds: ctTermsFolded() already accounts for CT_TERMS_OPEN, so
# tapping "tap to read" brings this row back with the others.
#
# AND NOTE WHAT WAS ALREADY THERE: ctIntroRows has printed `if(m.cost) ctRow('AND',
# m.cost)` all along -- but that is meeting().cost, which is EMPTY before you ask
# and fills in afterwards. So the card could always tell him what asking DID cost
# and never what it WOULD cost. The row for the consequence existed; the one for
# the decision did not. That is the 8/15 law in one line.
OLD_ROW = """  if(!m.isName && m.next && m.explain) body += ctRow('HOW YOU GET THE REST', m.next);"""
NEW_ROW = """  /* """ + MARKER + """ -- AND WHAT ASKING COSTS, before he asks, on the row
     that already answers this question -- and the whole row folds with the rest
     of the outfit's terms, because that is what it is.
     BohemiaIntros.askOutcome has returned this cost since 8/11 and had ZERO
     CALLERS: the seventh time this week an organ computed something nothing
     applied, and the first found by SWEEPING for the shape rather than tripping
     over it. Three of the sixteen charge for a direct ask (CARTEL a smile and a
     redirect forever, MOB a small permanent mark, ANARCHISTS an insult); the
     other thirteen are free, which is exactly why it stayed invisible.
     THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER (8/15): with the
     Mob this IS the decision, because the whole mechanic is that you are meant
     to wait to be introduced. NOTHING IS INVENTED -- a "permanent mark" is not a
     stat this repo has, and minting one would be canon he did not rule. */
  var ctIntroFolded = false;
  try { ctIntroFolded = ctTermsFolded(ctEverDealt(ctBelongSave(), fid) ? 1 : 0); }
  catch(_e){}
  if(!m.isName && m.next && m.explain && !ctIntroFolded){
    var ctRest = m.next;
    try {
      if(!(intro && intro.st && intro.st.asked)){
        var ctAC = (BohemiaIntros.askOutcome(intro.rule, intro.ctx, intro.st)||{}).cost;
        if(ctAC) ctRest += '  \u00b7  ASKING COSTS: ' + ctAC;
      }
    } catch(_e){}
    body += ctRow('HOW YOU GET THE REST', ctRest);
  }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if OLD_ROW not in s:
        sys.exit('FAIL: could not find the name row')
    s = s.replace(OLD_ROW, NEW_ROW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY ASKCOST: what asking costs is on the card, before the button')


if __name__ == '__main__':
    main()
