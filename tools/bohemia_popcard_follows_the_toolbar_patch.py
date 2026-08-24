#!/usr/bin/env python3
"""
MY TOP-LEFT COLUMN MOVED THE TOOLBAR BY HALF A PIXEL AND KNOCKED THE POPULATION
CARD INTO IT (8/24/26, RUN lane. My regression, another lane's feature.)

POPULATION DIAL gate, claim B4:

    FAIL B4 the card clears the toolbar AND the open drawer
         (top 80 vs bottom of what is above it 80)

Both numbers PRINT as 80 and the assertion still fails, because they are rounded
for the message and compared raw. #tlstack made #topbar a flex child, and flex
resolves heights to fractions where absolute positioning happened to land on
integers -- so the toolbar's bottom went from exactly 80 to a hair past it, and
#popwrap's hardcoded `top:78px` stopped clearing it by a sub-pixel.

MEASURED, NOT ASSUMED, both ways before touching anything: POPULATION DIAL is
22/0 against origin/main's city and 21/1 against mine, same gate, same commit.
Mine.

THE FIX IS THE LAW I SHIPPED THIS MORNING, APPLIED TO THE THING I BROKE WITH IT.
`top:78px` is one more hardcoded offset that encodes a guess about how tall the
toolbar is. Nudging it to 81 would be the same bug with a luckier number, and it
would break again the day the toolbar wraps to two rows on a long song title --
which is the exact case #tlstack exists to survive. So the card DERIVES its top
from the real bottom of whatever is actually above it, re-measured on the same
600ms pass that owns the rest of the top-left layout.

IT CLEARS THE OPEN DRAWER TOO, and that is the other lane's ruling, not my
preference: the population button lives INSIDE the builder's drawer, so the
drawer is open at the moment the card appears. The gate names both (#topbar and
#devtray) and this reads the same two, so the card cannot hide under either.

CEIL PLUS ONE, on purpose: the whole defect was a sub-pixel comparison, and
landing exactly on the boundary is what failed. A whole pixel of daylight costs
nothing and cannot be argued with.

NOTHING ELSE ABOUT THE CARD CHANGES -- not its size, its palette, its content or
its handlers. This is one number, and it is now measured instead of guessed.

REUSE CHECK: no graphic pixels cooked -- this positions an existing element, so
no banks/ lookup applies.

Idempotent (marker __POPCARD_FOLLOWS_THE_TOOLBAR__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__POPCARD_FOLLOWS_THE_TOOLBAR__'

OLD = """    s.appendChild(el);
  });
  return s;
}
blStack(); setInterval(blStack,600);"""

NEW = """    s.appendChild(el);
  });
  /* """ + MARK + """ (8/24). ANYTHING THAT SITS UNDER THE TOOLBAR HAS TO BE
     TOLD WHERE THE TOOLBAR ENDS. #popwrap carried `top:78px`, a hardcoded guess
     at the toolbar's height, and making #topbar a flex child moved its bottom by
     a FRACTION of a pixel -- enough that the population card stopped clearing it
     and POPULATION DIAL's B4 went red printing "top 80 vs bottom 80", two rounded
     numbers that are not equal. Nudging 78 to 81 would be the same bug with a
     luckier number and would break again the day a long song title wraps the
     toolbar to two rows.
     So it is measured, off the SAME two elements that gate names (the toolbar and
     the open drawer -- the population button lives inside the drawer, so the
     drawer is open when the card appears). Whole-pixel ceiling plus one, because
     landing exactly on the boundary is the thing that failed. */
  try{
    var low=0;
    ['topbar','devtray'].forEach(function(id){
      var e=document.getElementById(id);
      if(e&&e.offsetParent!==null) low=Math.max(low,e.getBoundingClientRect().bottom);
    });
    var pw=document.getElementById('popwrap');
    /* THE CARD'S OWN OFFSETPARENT, NOT THE STACK'S. First cut measured against
       the column's container, and #popwrap is positioned against a different one,
       so the number was right in the wrong coordinate space and B4 failed again
       with the identical message. Ask the element being moved what it is
       positioned against -- the same lesson tlStack itself learned one patch ago. */
    if(pw&&low>0){
      var ph=pw.offsetParent||pw.parentNode;
      var phTop=ph?ph.getBoundingClientRect().top:0;
      pw.style.top=(Math.ceil(low-phTop)+1)+'px';
    }
  }catch(_e){}
  return s;
}
blStack(); setInterval(blStack,600);"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the population card already follows the toolbar')
        return
    for needle, why in (('function tlStack(', 'the top-left column this hangs off'),
                        ("id=\"popwrap\"", 'the population card')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    n = s.count(OLD)
    if n != 1:
        sys.exit('FAIL: the tlStack adopt loop matched %d times, expected 1' % n)
    open(CITY, 'w', encoding='utf8').write(s.replace(OLD, NEW, 1))
    print('PATCHED %s -- the population card measures the toolbar instead of '
          'guessing its height' % CITY)


if __name__ == '__main__':
    main()
