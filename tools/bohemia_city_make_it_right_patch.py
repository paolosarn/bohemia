#!/usr/bin/env python3
"""BOHEMIA MAKING IT RIGHT (9/6/26, PEOPLE lane).
VAMILY [make it right], row NOTHING-IN-THIS-GAME-CAN-BE-FORGIVEN.

THE ROW: "A deed is written, it travels, it fades, and it is never settled. So a
player who wronged somebody in hour two can never make it right, and standing is
a one-way ratchet toward being hated."

VERIFIED BEFORE BUILDING: forgive, forgiven, settle, settled, absolve, pardon,
spare and redeem appear ZERO times in engine/bohemia_standing.js and
engine/bohemia_deeds.js. (The wider engine's hits are all "settlement" the town,
a lab note and a wash seam check -- checked, none of them this.) Every function
in the web got a deed INTO the world and nothing resolved one.

*** THE PERSON WHO WAS WRONGED IS THE ONE WHO DECIDES, and this surface obeys
that literally. *** There is no button that clears your name. The card offers to
square it ONLY when the person in front of you would -- which the module answers
out of what THEY have actually seen: everything else they know about you has to
already come out positive. So "make it right" is not a button, it is the
instruction: go and do something for the person you wronged, in front of them,
and then ask.

AND WHEN THEY WOULD NOT, IT SAYS SO RATHER THAN GREYING OUT. A control that is
simply absent teaches nothing; a sentence that says what is still owed is the
loop.

  python3 tools/bohemia_city_make_it_right_patch.py

Gate: gates/make_it_right_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_MAKEITRIGHT__'

# THE PERSON CARD's deed rows, not the other copy. The block appears twice; the
# person card is the one followed by the outfit row.
OLD = """    var kd = ctKnownDeeds(p.id, 2);
    for (var kdi = 0; kdi < kd.length; kdi++)
      body += ctRow(kd[kdi].heard ? 'HEARD' : 'SAW', kd[kdi].say);
  } catch(_e){}
  /* __CITY_FACTIONS__ -- THE SIXTEEN INTRODUCTIONS DECIDE THIS ROW."""

NEW = r"""    var kd = ctKnownDeeds(p.id, 2);
    for (var kdi = 0; kdi < kd.length; kdi++)
      body += ctRow(kd[kdi].heard ? 'HEARD' : 'SAW', kd[kdi].say);
  } catch(_e){}
  /* __CITY_MAKEITRIGHT__ -- AND WHETHER IT CAN BE PUT RIGHT.
     Nothing in this game could be forgiven: the web wrote deeds, carried them,
     faded them, and never settled one, so standing only ever ratcheted toward
     being hated. This is the other half, and the rule is the row's own -- THE
     PERSON WHO WAS WRONGED DECIDES. The module answers out of what THEY saw,
     so there is no button that clears your name and no number anybody tuned.
     ALREADY SQUARED COMES FIRST, because a card that offers to fix a thing that
     is already fixed is a card that has not been read. */
  try {
    if (typeof BohemiaStanding !== 'undefined' && BohemiaStanding.wouldSquare) {
      var ctMR = CT_MINDS[p.id];
      var ctDone = ctMR ? BohemiaStanding.madeRightBy(ctMR, '@') : [];
      if (ctDone.length) {
        body += ctRow('YOU SQUARED IT', ctDone[0].say);
      } else {
        var ctSq = ctMR ? BohemiaStanding.wouldSquare(ctMR, '@', ctMinuteNow())
                        : { would: false, kinds: [] };
        if (ctSq.kinds && ctSq.kinds.length) {
          if (ctSq.would) {
            /* THE OFFER, AND IT IS THEIRS TO ACCEPT. The button asks; the
               module decides again when it is pressed, so a stale card cannot
               settle something the person would no longer settle. */
            body += ctRow('THEY HOLD SOMETHING AGAINST YOU', 'AND THEY WOULD LET IT GO');
            body += '<button id="ctright">Make it right</button>';
          } else {
            /* WHAT IS STILL OWED, IN PLAIN WORDS. draft:true. */
            body += ctRow('THEY HOLD SOMETHING AGAINST YOU',
                          'AND NOTHING YOU HAVE DONE FOR THEM OUTWEIGHS IT YET');
            body += ctNote('Do something for this person, where they can see it. '
                         + 'Then ask again.');
          }
        }
      }
    }
  } catch(_e){}
  /* __CITY_FACTIONS__ -- THE SIXTEEN INTRODUCTIONS DECIDE THIS ROW."""

# ---------------------------------------------------------------------------
# THE HANDLER, beside the other card buttons.
H_OLD = """  var give=document.getElementById('ctgive');"""
H_NEW = r"""  /* __CITY_MAKEITRIGHT__ -- AND THEY DECIDE AGAIN WHEN IT IS PRESSED.
     The card was built from a wouldSquare that may be a minute old; asking a
     second time is what stops a stale button settling something the person
     would no longer settle. If they have changed their mind the card simply
     redraws saying so. */
  var right=document.getElementById('ctright');
  if(right) right.addEventListener('click',function(){
    try{
      var m=CT_MINDS[CT_OPEN && CT_OPEN.id];
      if(m && BohemiaStanding.wouldSquare(m,'@',ctMinuteNow()).would){
        /* WHICH WORD IT IS: they are letting it go because of what you have
           since done for them, so it is PAID rather than a free pardon.
           draft:true, and the module keeps all four so he can rule them apart. */
        BohemiaStanding.makeRight(m,'@',{how:'paid',turn:ctMinuteNow()});
        /* AND THE WEB LEARNS IT. Same pairs the gossip pass walks, so the news
           of a settlement travels the paths the grudge travelled. */
        try{
          var drew=(typeof BARK_DREW!=='undefined'&&BARK_DREW)?BARK_DREW:[];
          for(var i=0;i<drew.length;i++){
            var o=CT_MINDS[drew[i].p.id];
            if(o&&o!==m) BohemiaStanding.carryRight(m,o);
          }
        }catch(_e){}
        try{ ctAgainstBump(); }catch(_e){}
      }
    }catch(_e){}
    ctDraw(); render();
  });
  var give=document.getElementById('ctgive');"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    for name, anchor in [('the deed rows', OLD), ('the button handlers', H_OLD)]:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    html = html.replace(OLD, NEW, 1).replace(H_OLD, H_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [making it right]')


if __name__ == '__main__':
    main()
