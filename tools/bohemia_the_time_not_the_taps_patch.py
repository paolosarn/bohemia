#!/usr/bin/env python3
"""
THE TIME, NOT THE TAPS (9/6/26, RUN lane)
VAMILY [auto walk] / BB-THE-TIME-NOT-THE-TAPS.

THE ROW: "*** DISTANCE SHOULD SPEND THE DAY, NOT THE PLAYER'S ATTENTION. *** Our
long walk correctly costs in-game hours. It ALSO costs the player however long it
takes to press the pad twenty times, and THAT SECOND COST BUYS NOTHING -- it is
not friction, not tension and not realism, it is time out of a person's evening.
THE ROW: a route you set and let run, or a held press that keeps going. THIS IS
NOT FAST TRAVEL and it removes no cost; IT REMOVES THE WATCHING."

MEASURED FIRST, and it changed the job. A HELD PRESS ALREADY KEEPS GOING: the pad
wires pointerdown to startHold and the metronome steps every beat while `held` is
set. Measured on the served demo -- four seconds of hold moved five cells, held=4,
heldBeats=3. So half the row was built and I nearly closed it on that.

*** BUT A HELD PRESS REMOVES THE TAPPING, NOT THE WATCHING. *** Your thumb is
still down and your eyes are still on it for the whole walk, and the row's last
five words are IT REMOVES THE WATCHING. So the job is the gap between those two.

WHAT THIS DOES -- THE SMALLEST THING THAT CLOSES IT, and it is my call:
A hold that has really got going LATCHES. Let go and he keeps walking that way
until something worth looking at happens. No new control, no new surface, no
destination picker, no route planner: the same press he already makes, one
sentence further.

IT REMOVES NO COST. Every latched step is the same stepOnce every tapped step
was, so the clock, the road interrupts, the leavings and the crews all happen
exactly as they would have. This is not fast travel.

AND IT STOPS ON ITS OWN, which is the whole reason it is safe to let go:
  * ANYTHING TO LOOK AT. A card on screen ends it -- that is the road interrupt
    this lane wired to the walked street on 9/5, and walking through the content
    would be worse than the twenty taps.
  * ANYBODY COMING. A hostile crew at 'close' ends it, for the same reason.
  * A WALL. Two beats with no progress ends it; walking into a building forever
    is exactly the not-working-button feeling this game has been bitten by.
  * HIM. Any press, anywhere, ends it, because a control you cannot interrupt is
    worse than one you have to hold.
  * THE DAY. Leaving the walked mode, or the day ending, ends it.

THE LATCH NEEDS A REAL HOLD, not a tap: LATCH_AFTER beats. A tap is one step and
stays one step, so nothing about the existing feel moves.

IDEMPOTENT: the mark is checked first, anchors asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__THE_TIME_NOT_THE_TAPS__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    # ---- 1. the latch, and everything that ends it ------------------------
    anchor = "function startHold(di){"
    assert src.count(anchor) == 1, 'hold anchor %d' % src.count(anchor)
    latch = r'''/* ==== ''' + MARK + r''' (9/6) : LET GO AND KEEP WALKING ================
   BB-THE-TIME-NOT-THE-TAPS. DISTANCE SHOULD SPEND THE DAY, NOT THE PLAYER'S
   ATTENTION. The long walk correctly costs in-game hours; it also cost him
   however long twenty presses take, and that second cost buys nothing.

   MEASURED FIRST: a held press ALREADY keeps going -- four seconds of hold moved
   five cells on the served demo. Half this row was built. But a held press
   removes the TAPPING and not the WATCHING, and the row's last five words are
   IT REMOVES THE WATCHING. This is the gap between those two, and nothing more:
   a hold that really got going LATCHES, so letting go keeps you walking.

   IT REMOVES NO COST. Every latched step is the same stepOnce, so the clock, the
   road moments, the leavings and the crews all happen exactly as they would. NOT
   FAST TRAVEL.
   ========================================================================== */
var LATCH_DIR = null;       /* the direction he let go in, or null */
var LATCH_STILL = 0;        /* beats since he last actually moved */
var LATCH_AFTER = 3;        /* a real hold latches; a tap is still one step */

/* EVERYTHING THAT ENDS IT, in one place, so a new reason to stop cannot be
   added to one caller and forgotten in another. */
function latchStop(){ LATCH_DIR = null; LATCH_STILL = 0; }

function latchShouldStop(){
  if(LATCH_DIR === null) return false;
  /* the walked mode only */
  try{ if(typeof MODE !== 'undefined' && MODE === 'city') return true; }catch(_e){}
  /* ANYTHING TO LOOK AT. The road moments this lane put on the walked street on
     9/5 arrive as a card; walking through them would be worse than the taps. */
  try{
    var d = document.getElementById('daycard');
    if(d && getComputedStyle(d).display !== 'none') return true;
  }catch(_e){}
  /* ANYBODY COMING. A crew that has closed on you is the other thing worth
     stopping for, and it is read from the same record the render uses. */
  try{
    if(typeof HOST_DREW !== 'undefined' && HOST_DREW && HOST_DREW.length){
      for(var i=0;i<HOST_DREW.length;i++)
        if(HOST_DREW[i] && HOST_DREW[i].state === 'close') return true;
    }
  }catch(_e){}
  /* THE DAY ENDING. */
  try{ if(typeof DAY !== 'undefined' && DAY.phase === 'ended') return true; }catch(_e){}
  return false;
}

''' + anchor
    src = src.replace(anchor, latch, 1)

    # ---- 2. the metronome honours it --------------------------------------
    old_beat = "  const di=(held!==null)?held:pend;\n  if(di===null)return;"
    assert src.count(old_beat) == 1, 'beat anchor %d' % src.count(old_beat)
    new_beat = ('''  /* ''' + MARK + ''': a latched direction is the last thing consulted, so a
     real press always wins over one he let go of. */
  if(LATCH_DIR !== null && latchShouldStop()) latchStop();
  const di=(held!==null)?held:(pend!==null?pend:LATCH_DIR);
  if(di===null)return;''')
    src = src.replace(old_beat, new_beat, 1)

    # count a still beat, and give up on a wall
    old_moved = "  if(moved){ animate((running||RIDING)?'run':'walk'); reportState(); footingUpdate(); /* __FLOOR_DOES_SOMETHING__ */ }"
    assert src.count(old_moved) == 1, 'moved anchor %d' % src.count(old_moved)
    new_moved = (old_moved + '''
  /* ''' + MARK + ''': A WALL ENDS IT. Two beats with nothing to show for them and
     the latch lets go -- walking into a building forever is exactly the
     not-working-button feeling this game has been bitten by before. */
  if(LATCH_DIR !== null){
    if(moved) LATCH_STILL = 0;
    else if(++LATCH_STILL >= 2) latchStop();
  }''')
    src = src.replace(old_moved, new_moved, 1)

    # ---- 3. hold latches on release, and any press cancels ----------------
    old_start = "  held=di; pend=di; heldBeats=0; }"
    assert src.count(old_start) == 1, 'start anchor %d' % src.count(old_start)
    new_start = ('''  /* ''' + MARK + ''': HIM. Any press ends a latched walk -- a control you
     cannot interrupt is worse than one you have to hold. Done here rather than
     in the button handler so every way in cancels it, not just the pad. */
  latchStop();
  held=di; pend=di; heldBeats=0; }''')
    src = src.replace(old_start, new_start, 1)

    old_end = "function endHold(){ held=null; heldBeats=0; }"
    assert src.count(old_end) == 1, 'end anchor %d' % src.count(old_end)
    new_end = ('''function endHold(){
  /* ''' + MARK + ''': LETTING GO IS NOT STOPPING, if he really was walking. A tap
     is one step and stays one step, so nothing about the existing feel moves;
     only a hold that got going carries on. */
  if(held !== null && heldBeats >= LATCH_AFTER){ LATCH_DIR = held; LATCH_STILL = 0; }
  held=null; heldBeats=0; }''')
    src = src.replace(old_end, new_end, 1)

    open(CITY, 'w', encoding='utf8').write(src)
    print('  added    : the latch, and latchShouldStop() -- every reason in one place')
    print('  changed  : the metronome consults a latched direction LAST, after a real press')
    print('  changed  : endHold latches a real hold; startHold cancels one')
    print('  added    : a wall ends it after two still beats')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
