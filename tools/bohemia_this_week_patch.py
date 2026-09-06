#!/usr/bin/env python3
"""
THIS WEEK (9/6/26, RUN lane)
VAMILY [weekly goal] / BB-THIS-WEEK.

THE ROW, DAY 18: "A GOAL YOU HAVE TO GO FIND IS NOT A GOAL."

    Day 7 found the DAILY motor (why you get up tomorrow) and days 9 and 11
    found the HUNDRED-HOUR arc. NOBODY ASKED WHAT YOU ARE WORKING ON THIS WEEK.

THE EVIDENCE THE ROW IS BUILT ON, and it is unusually blunt for a design study:
forty children behind and uninterested in arithmetic, learning by themselves
under three conditions -- PROXIMAL SUB-GOALS (finish one set this session), A
DISTAL GOAL (finish it all by the last session), or "work productively". Under
proximal sub-goals they progressed rapidly, reached real mastery, and grew BOTH
self-efficacy AND genuine interest in a subject that had held none.
*** DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS. Not weaker. NONE. ***
A goal a hundred hours away does not motivate anybody.

MEASURED BEFORE BUILDING, and both halves of the row's claim hold:

  1. THE MIDDLE HORIZON IS FULLY BUILT AND FULLY HIDDEN. rungRead() already
     answers it exactly -- your rung, how many factions are with you, and
     TO BE BACKED: the number you still need. It lives on the STANDING card,
     behind a button (#rungbtn) you have to notice and press. Day 14's COLD
     HAND never presses anything it does not need to, and neither does anybody.

  2. THE RECKONING CARD SAYS NOTHING ABOUT IT. Its four sections today are
     WHAT HAPPENED, WHO YOU LET DOWN, WHO IS EXPECTING YOU TOMORROW and THE
     DAY. Not one word about what you are working toward.

So this moves nothing and builds no system: it puts the answer the game already
has ON THE CARD HE PASSES ANYWAY, the last thing seen every single day.

WHAT IT SAYS, AND WHY IT IS THE PROXIMAL NUMBER AND NEVER THE DISTAL ONE:
the line names the NEXT rung and what it grants, with the count that moves --
"THREE MORE FACTIONS AND THE CITY BACKS YOU". It never says "become mayor in a
hundred hours", because the study says that sentence does nothing at all.

REUSE-FIRST, AND THE SAME LESSON [drains shown] LEARNED ON THIS EXACT CARD:
it reads rungRead(), the STANDING card's own source. NO SECOND TABLE. Two
things that both answer "where do I stand" is how they come to disagree, and
this lane has already shipped one bug of exactly that shape.

SILENT WHEN IT DOES NOT KNOW. If rungRead() cannot answer (the module is not on
this page), the section does not render at all rather than inventing a goal.
A made-up target is worse than no target.

Words are attempts, draft:true.
IDEMPOTENT: the mark is checked first, the anchor asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__THIS_WEEK__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    anchor = "  h+='<h3>THE DAY</h3><ul>';"
    assert src.count(anchor) == 1, 'THE DAY anchor %d' % src.count(anchor)

    block = r'''  /* ==== ''' + MARK + r''' (9/6, RUN) : WHAT YOU ARE WORKING ON =============
     BB-THIS-WEEK, day 18: "A GOAL YOU HAVE TO GO FIND IS NOT A GOAL." The study
     is blunt -- under PROXIMAL SUB-GOALS children who were behind and
     uninterested progressed rapidly and grew real interest, and DISTAL GOALS
     HAD NO DEMONSTRABLE EFFECTS AT ALL. A goal a hundred hours away motivates
     nobody.
     MEASURED: the middle horizon was already built and already hidden. rungRead()
     answers it exactly -- your rung, who is with you, and how many more you need
     -- and it lives behind the STANDING button, which nobody presses. Meanwhile
     this card, the last thing seen every single day, said nothing about what you
     are working toward.
     So the answer the game already has goes where he passes anyway. It reads
     rungRead(), the STANDING card's OWN source: NO SECOND TABLE, because two
     things that both answer "where do I stand" is how they come to disagree, and
     this lane has already shipped one bug of that exact shape on this exact card.
     IT NAMES THE NEXT RUNG AND THE COUNT THAT MOVES, never the hundred-hour arc.
     Silent when rungRead() cannot answer: a made-up target is worse than none.
     draft:true. */
  try{
    var WK = (typeof rungRead === 'function') ? rungRead() : null;
    if(WK && WK.ok){
      var wkLine = null, wkThen = null;
      if(WK.rung === 'TERRITORY'){
        var short = Math.max(0, (WK.need|0) - WK.fwu.length);
        /* *** THE ASK IS ALWAYS THE NEXT ONE, NEVER THE WHOLE CLIMB, AND MY OWN
           FIRST CUT GOT THIS WRONG. *** It read "8 MORE FACTIONS AND THE CITY
           BACKS YOU" on a fresh run -- measured on the served demo -- which is
           the DISTAL goal, the exact condition this row's study found had NO
           demonstrable effect. Eight factions from zero is the hundred-hour arc
           wearing a number. The proximal sub-goal is ONE MORE, every time, and
           the climb goes underneath it as progress rather than as the ask. */
        wkLine = short > 0
          ? 'ONE MORE FACTION WITH YOU'
          : 'THE CITY BACKS YOU. Sleep on it.';
        if(short > 0)
          wkThen = WK.fwu.length + ' of ' + (WK.need|0) + ' toward the city backing you';
      } else if(WK.rung === 'MANDATE'){
        wkLine = WK.mayorOpen
          ? 'The city backs you. You can build on ground that does not love you.'
          : 'The city backs you.';
      } else if(WK.rung === 'MAYOR'){
        wkLine = 'You are not negotiating any more. You are governing.';
      }
      if(wkLine){
        h+='<h3>WHAT YOU ARE WORKING ON</h3><ul>';
        h+='<li>'+esc(wkLine)+'</li>';
        if(wkThen) h+='<li>'+esc(wkThen)+'</li>';
        h+='</ul>';
      }
    }
  }catch(_e){}
''' + anchor

    src = src.replace(anchor, block, 1)
    open(CITY, 'w', encoding='utf8').write(src)
    print('  added    : the reckoning card names what you are working on this week')
    print('  source   : rungRead(), the STANDING card\'s own -- no second table')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
