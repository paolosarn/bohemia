#!/usr/bin/env python3
"""
THE BUTTON THAT PUT HIM INSIDE STILL SAID "ENTER" ONCE HE WAS IN
(8/26/26, RUN lane. Second half of THE ACTION BUTTON DOES ACTIONS, same turn.)

MEASURED, on the real surface, immediately after the first patch:

    standing at the door   ENTER   canact true
    pressed it             INSIDE true, stepped 1        <- correct
    standing inside        ENTER   canact true           <- WRONG

He is in the room. The biggest button on screen, wearing his own face, offers to
put him in the room he is standing in. That is a control on screen that does not
do what the screen says -- the same family as the 8/18 wall and the STANDING card,
and I shipped it forty minutes after writing a gate about exactly that.

=== WHAT LEAVING ACTUALLY IS =================================================

Inside, `stepOnce` owns the exit and it is a real mechanic, not a close button:

    only the door lets you out, and it puts you back on the exact cell you came
    in from

-- you must be standing ON the interior door cell, and you step OFF the plate.

So the button offers LEAVE only when he is on that cell, which is honest: from
the back of a room the answer to "can I get out" is "walk to the door first",
and a button that teleported him out from anywhere would quietly delete that.

*** AND IT CALLS stepOnce, NOT A COPY OF ITS INSIDES. *** The tempting version
sets hx/hy from INSIDE.exit, nulls INSIDE and calls advance(0.5) -- four lines,
lifted. That is how the door predicate ended up in homeFind and the objective
hint ended up in an inlined module. This finds which direction steps off the
plate and hands that to stepOnce, so the button and the pad walk out through the
identical code, spend the identical half minute, and can never disagree.

NO DISTRICT IS A PRISON (Paolo 8/1) is the law under this: a room you can be put
into needs a way out that is as visible as the way in.

WORDS: LEAVE is UI copy, a real attempt, draft:true.

REUSE CHECK: no graphic pixels cooked -- one more branch on an existing button
routing to an existing mover, so no banks/ lookup applies.

Idempotent (marker __THE_ACTION_BUTTON_LETS_YOU_OUT__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_ACTION_BUTTON_LETS_YOU_OUT__'

FRONT_OLD = """function actFront(){
  if(typeof MODE==='undefined'||MODE!=='human') return null;"""

FRONT_NEW = """/* """ + MARK + """ (8/26): WHICH WAY IS OUT. Inside, the exit is the cell you
   came in by, so "out" is whichever cardinal step leaves the footprint from the
   door cell. Returns the DIRECTION INDEX stepOnce wants, never a position -- this
   function finds the way, stepOnce does the moving. */
function actWayOut(){
  if(typeof INSIDE==='undefined'||!INSIDE) return -1;
  if(INSIDE.ix!==INSIDE.door[0]||INSIDE.iy!==INSIDE.door[1]) return -1;
  var fp=INSIDE.fp;
  for(var i=0;i<DIRS.length;i++){
    var d=DIRS[i]; if(d[0]&&d[1]) continue;            /* the plate edge is cardinal */
    var nx=INSIDE.ix+d[0], ny=INSIDE.iy+d[1];
    if(nx<0||ny<0||nx>=fp.W||ny>=fp.H) return i;
  }
  return -1;
}
function actFront(){
  if(typeof MODE==='undefined'||MODE!=='human') return null;
  /* """ + MARK + """: INSIDE FIRST. Measured before this existed: standing in a
     room, the button still said ENTER -- it offered to put him into the room he was
     already in, because the cell "in front of" him was still the door he came
     through. A control that does not do what it says is the STANDING card again,
     and this one was mine, shipped the same hour as a gate about it. */
  try{
    if(typeof INSIDE!=='undefined' && INSIDE){
      var w=actWayOut();
      if(w>=0) return { kind:'leave', label:'LEAVE', di:w };   /* draft:true */
      return null;   /* in the back of the room: the answer is walk to the door */
    }
  }catch(_e){}"""

PRESS_OLD = """  if(f.kind==='talk'){ try{ ctOpen(); }catch(_e){} return true; }"""

PRESS_NEW = """  /* """ + MARK + """: OUT THROUGH THE SAME DOOR THE PAD USES. stepOnce owns the
     exit -- "only the door lets you out, and it puts you back on the exact cell you
     came in from" -- and lifting its four lines here is how the door predicate ended
     up copied into homeFind. The button hands it a direction and lets it move him,
     so both ways out spend the same half minute and can never disagree. */
  if(f.kind==='leave'){ try{ return !!stepOnce(f.di); }catch(_e){ return false; } }
  if(f.kind==='talk'){ try{ ctOpen(); }catch(_e){} return true; }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the action button already lets him out')
        return
    if '__THE_ACTION_BUTTON_DOES_ACTIONS__' not in s:
        sys.exit('FAIL: run bohemia_the_action_button_does_actions_patch.py first')
    if 'only the door lets you out' not in s:
        sys.exit('FAIL: the exit rule in stepOnce is gone; re-read it before assuming '
                 'how leaving works')
    for old, new, what in ((FRONT_OLD, FRONT_NEW, 'inside comes first, and the way out'),
                           (PRESS_OLD, PRESS_NEW, 'and pressing it walks him out')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- the button says LEAVE when he is standing in the doorway' % CITY)


if __name__ == '__main__':
    main()
