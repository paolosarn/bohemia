#!/usr/bin/env python3
"""
BOHEMIA CITY NAME-DEDUPE PATCH -- the heading and the NAME row said the same
thing, on exactly the cards with no room left. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
Gate: gates/cardfold_gate.js (A12, new)

REUSE CHECK (REUSE-FIRST): cooks nothing, adds no mechanic, and does not write a
new rule. THE CARD ALREADY HAS THIS RULE and applies it two rows lower down:

    /* __CITY_CARDFOLD__ -- the heading above IS the trade word, so this row said
       the same thing twice. A duplicate is not disclosure. */
    if(String(ctTradeWord).toUpperCase() !== String(nm?nm:headingOf(who)).toUpperCase())
      body+=ctRow('TRADE', ctTradeWord);

This applies the SAME test to the row directly under the heading, which has been
duplicating it since the day the heading learned to show a name.

--------------------------------------------------------------------------
WHY IT CAME UP NOW: THE VOUCH PUSHED THE CARD TO 99%
--------------------------------------------------------------------------
Wiring the Mob's vouch (__CITY_THIRDPARTY__, same turn) added WHO PUT YOU ON, and
the busiest reachable card measured 833px of 844 -- 99%, through the 90% bar
cardfold_gate holds. I had reasoned the row was HEIGHT-NEUTRAL because HOW YOU GET
THE REST disappears once the name is earned. THAT REASONING WAS WRONG AND THE
MEASUREMENT SAID SO: earning the name also turns ON the quirk row (THEY SAID),
so the card gains two rows and loses one.

MEASURE, DO NOT REASON, ABOUT PIXELS. Third time this lane has added a row to
this card and gone red, and the first time the argument for why it was safe
sounded airtight.

--------------------------------------------------------------------------
AND THE FIX IS THE DUPLICATE, NOT THE NEW ROW
--------------------------------------------------------------------------
The obvious move was to drop or shorten WHO PUT YOU ON. That would be fitting the
content to the ruler -- and it would delete the only thing that makes a vouch a
beat instead of a flag flipping. So look at what the card is actually spending
its pixels on:

    MALACHI BETANCOURT        <- the heading
    NAME  Malachi Betancourt  <- the same string, one row lower

The heading BECOMES the name the moment you know it, and then the NAME row is
pure repetition. It is the identical defect the TRADE row was fixed for on 8/18,
on the identical card, and the fix is the identical test.

IT COSTS NOTHING WHEN THERE IS ANYTHING TO SAY. The row survives whenever it is
not a duplicate: KNOWN AS (a handle that is not a name), THEY USED YOURS,
NOBODY HAS INTRODUCED YOU, YOU ASKED AND YOU DID NOT GET IT, YOU HAVE NOT ASKED.
Those are all cards where the heading is the trade word, so nothing is repeated
and nothing is dropped. It only fires in the one state where the two rows are
byte-for-byte the same fact, which is also the state where the card is fullest.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_NAMEDUPE__'

OLD = """  var nameRow = ctIntro ? ctIntroName(ctIntro, CT_MET.asked(who.key))
                        : ['NAME', nm?nm:'YOU HAVE NOT ASKED'];
  body+=ctRow(nameRow[0], nameRow[1]);"""
NEW = """  var nameRow = ctIntro ? ctIntroName(ctIntro, CT_MET.asked(who.key))
                        : ['NAME', nm?nm:'YOU HAVE NOT ASKED'];
  /* """ + MARKER + """ -- AND THE HEADING ABOVE IS ALREADY THE NAME.
     Same test the TRADE row two rows down has used since 8/18, same reason: A
     DUPLICATE IS NOT DISCLOSURE. The heading becomes the name the moment you
     know it, so this row repeats it verbatim -- on exactly the cards that are
     fullest, because knowing the name is what turns the quirk row on too.
     Every other state this row can be in (KNOWN AS, THEY USED YOURS, NOBODY HAS
     INTRODUCED YOU, YOU ASKED AND DID NOT GET IT, YOU HAVE NOT ASKED) sits under
     a heading that is the TRADE word, so nothing is repeated and nothing here
     drops it. */
  var ctHeadWord = nm ? nm.toUpperCase() : BohemiaPeople.headingOf(who);
  if(String(nameRow[1]).toUpperCase() !== String(ctHeadWord).toUpperCase())
    body+=ctRow(nameRow[0], nameRow[1]);"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: could not find the name row')
    s = s.replace(OLD, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY NAMEDUPE: the heading is the name, so the row is not')


if __name__ == '__main__':
    main()
