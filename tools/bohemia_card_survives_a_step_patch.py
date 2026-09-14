#!/usr/bin/env python3
"""
V216 -- THE CARD SURVIVES THE NEXT STEP  (COMBAT lane, [first fight], my own defect)

*** THIS IS A DEFECT I CREATED WITH V213 LAST ROUND, FOUND BY EYES E26 ROUND 3, AND
    IT IS WHY HIS BREAK IS STILL ON THE LIST EVEN THOUGH THE FIX IS REAL. ***

EYES walked the five minutes with a thumb and reported, again: "NO FIGHT SURFACE SEEN
IN FIVE MINUTES, ON EITHER SURFACE." They pressed the walk dial 117 times. My own
number says the card arrives after 55 cells of walking, about 92 presses. So it DID
arrive for them -- and then press 93 erased it.

MEASURED, ON THE ALPHA, WITH THE REAL DIAL:
    card up after 58 attempts        "DESPERATE SCAVENGER SHAKEDOWN"
    card on screen                   TRUE
    ONE PRESS OF THE WALK DIAL       *** card on screen FALSE ***

THE CAUSE IS ONE LINE AND IT IS NOT NEW: startHold calls roadBail() on EVERY press,
under __THE_ROAD_CARD_IS_NOT_A_LOCK__. That ruling is RIGHT and stays: the card is
not modal, and walking away from an offer you are ignoring must dismiss it.

WHAT IS WRONG IS WHAT V213 DID TO IT. That card used to be shown during TRAVEL, where
nobody is holding the walk dial. I routed the WALKED STREET's moments into the same
card -- and on the walked street THE PLAYER IS PRESSING THAT DIAL CONSTANTLY, because
pressing it is how you walk. So the input you are already using to move is the same
input that erases the card, and it erases it before a human could have seen it. That
is a card that promises and does nothing, which is rule 14(d) and which he called the
worst bug in the game. I built that exposure; this closes it.

THE FIX IS THE SMALLEST THING THAT KEEPS BOTH TRUE:
    STILL NOT A LOCK   walking away still dismisses it, exactly as ruled. Nothing is
                       swallowed, nothing becomes modal, no press is eaten -- the step
                       still happens on the press that would have bailed it.
    ONE PRESS OF GRACE the card survives the FIRST press after it opens, and the
                       SECOND dismisses it. Press once and you keep walking with the
                       card up; press again and you have chosen to walk away.

*** AND IT IS A COUNT AND NOT A CLOCK, WHICH I GOT WRONG FIRST AND MEASURED. *** The
first cut gave the card TWO BEATS of protection -- a real ruled duration, 1000 ms
under the 120 BPM law, the same two beats V205's entry zoom takes. IT DOES NOTHING AT
THE REAL CADENCE: EYES walks in TWO-SECOND held presses, so the next press lands well
after a one-second grace has expired and the card is wiped exactly as before. A
millisecond window has to guess how fast a thumb is. A COUNT DOES NOT: one press of
grace works whether he taps four times a second or once every five seconds.

NO DAMAGE BEFORE THE DIAL: nothing here touches a number in a fight.
"""
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CARD_SURVIVES_A_STEP__'

OLD_BAIL = """function roadBail(){
  var c=document.getElementById('daycard');
  if(!c || !c.classList.contains('roadcard')) return false;"""

NEW_BAIL = """/* ===== V216 __CARD_SURVIVES_A_STEP__ -- NOT BEFORE HE COULD HAVE SEEN IT =====
   MY OWN DEFECT, MADE BY V213 AND FOUND BY EYES E26 ROUND 3. They walked the five
   minutes with a thumb, pressed this dial 117 times, and reported NO FIGHT SURFACE
   SEEN -- while my own number says the card arrives after about 92 presses. It DID
   arrive. Press 93 erased it.
   MEASURED ON THE ALPHA: card up, card on screen TRUE, one press of the walk dial,
   card on screen FALSE.
   __THE_ROAD_CARD_IS_NOT_A_LOCK__ is RIGHT and it stays -- walking away from an offer
   you are ignoring must dismiss it. What was wrong is what V213 did to it: this card
   used to be shown during TRAVEL, where nobody holds the walk dial, and I routed the
   WALKED STREET's moments into it, where pressing that dial IS how you walk. The
   input you use to move became the input that erases the card, before a human could
   possibly have read it.
   ONE PRESS OF GRACE, AND IT IS A COUNT RATHER THAN A CLOCK. The first cut of this
   gave it two beats -- a real ruled duration -- and MEASURED IT DOES NOTHING: EYES
   walks in two-second presses, so the next press lands long after a one-second window
   has closed. A millisecond window has to guess how fast a thumb is; a count does
   not. Nothing is swallowed either way: the press that spends the grace still walks
   you, it just does not erase what you have not read yet. */
var ROAD_CARD_FRESH = false;
function roadCardSeen(){ ROAD_CARD_FRESH = true; }
/* ===== /V216 __CARD_SURVIVES_A_STEP__ ===== */
function roadBail(){
  var c=document.getElementById('daycard');
  if(!c || !c.classList.contains('roadcard')) return false;
  /* V216 __CARD_SURVIVES_A_STEP__: the first press after it opens spends the grace
     and keeps the card; the second is him walking away, which is the ruling. */
  if(ROAD_CARD_FRESH){ ROAD_CARD_FRESH = false; return false; }"""

OLD_SHOW = """  var _dc=document.getElementById('daycard');
  if(_dc) _dc.classList.add('roadcard');"""

NEW_SHOW = """  var _dc=document.getElementById('daycard');
  if(_dc) _dc.classList.add('roadcard');
  try{ roadCardSeen(); }catch(_e){}   /* V216 __CARD_SURVIVES_A_STEP__: the clock starts when it appears */"""


def main():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  the card already survives a step')
        return
    if s.count(OLD_BAIL) != 1:
        sys.exit('ANCHOR city/roadBail: expected 1, found %d' % s.count(OLD_BAIL))
    if s.count(OLD_SHOW) != 1:
        sys.exit('ANCHOR city/roadCard: expected 1, found %d' % s.count(OLD_SHOW))
    s = s.replace(OLD_BAIL, NEW_BAIL, 1)
    s = s.replace(OLD_SHOW, NEW_SHOW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('V216 applied to', CITY)


if __name__ == '__main__':
    main()
