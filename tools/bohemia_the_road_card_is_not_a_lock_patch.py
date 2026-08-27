#!/usr/bin/env python3
"""
THE ROAD CARD IS NOT A LOCK
(8/27/26, RUN lane. A bug I made an hour earlier, caught by my own gate.)

THE ROAD INTERRUPTS shipped the encounter card through cardShow(), which was the
right call for REUSE-FIRST -- it already carries a real close button, a
close-on-tap-outside and Escape, all from __EVERY_PANEL_CLOSES__.

WHAT I DID NOT THINK ABOUT IS THAT cardShow IS MODAL BY CONSTRUCTION:

    #daycard{position:absolute;inset:0;z-index:20; background:rgba(6,5,4,.86)}

A full-screen scrim over everything. Which is correct for the cards it was built
for -- the wake card, the market, STANDING -- because those are places you go.

*** IT IS WRONG FOR A THING THAT HAPPENS TO YOU WHILE YOU ARE MOVING. *** The
road card fires DURING travel, and the scrim then sits on top of the movement
pad, the camera chip and the canvas. So the pad went dead, the chip went dead,
and A PINCH TO GET BACK TO HIS BODY DID NOTHING, because the two fingers landed
on the scrim instead of the world.

CAUGHT BY LOOK NOT TRAVEL, WHICH IS THIS LANE'S OWN GATE FROM YESTERDAY:
    > FAIL he is back on his feet in the walked world (city)
    > FAIL the chip took him out to the map and back
Reproduced alone, twice. Not load. A real regression, one turn old.

*** AND THE PRECEDENT FOR THE FIX WAS ALREADY IN THIS FILE, WRITTEN BY ME, TWO
DAYS AGO. *** __EVERY_CONTROL_LEAVES_THE_VISTA__, on startHold:

    "a direction is not 'get me out of here', it is 'go that way'. So the overlook
     drops AND the hold he is already making stands -- swallowing the press would
     make the first step out of every vista dead, which is the same class of
     not-working-button he reported on STANDING."

Same class again. A card that eats his next gesture is a button that does not
work, and he reports those.

=== THE FIX ================================================================

A ROAD MOMENT IS SOMETHING YOU READ, NOT SOMEWHERE YOU GO. There is no decision
on the card (the fork it wants needs a damage dial, and the dial is his), so it
has no business being modal at all.

  1. THE SCRIM STOPS CATCHING TOUCHES. pointer-events:none on the scrim,
     pointer-events:auto on the card itself. The pad, the chip and the pinch all
     keep working underneath while the words sit on screen. The card's own close
     and KEEP MOVING still work, because the card is not the scrim.
  2. THE WORLD STAYS VISIBLE. No 86% black wash over the valley he is crossing.
     An interruption you cannot see past is a loading screen.
  3. AND IT GETS OUT OF THE WAY BY ITSELF. roadBail() closes it on his next
     direction press, exactly like vistaBail, so it never stacks or lingers.

WHAT IS DELIBERATELY UNCHANGED: every other card in the game is still modal.
This is one class flag on one caller, not a change to cardShow, because the wake
card and the market SHOULD hold the screen.

REUSE CHECK: cooks NO pixels and opens no banks/. Two CSS rules on an element
that already exists and one bail function copied in shape from vistaBail four
hundred lines above it.

Idempotent (marker __THE_ROAD_CARD_IS_NOT_A_LOCK__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_ROAD_CARD_IS_NOT_A_LOCK__'

CSS_OLD = """#daycard.on{display:flex}"""

CSS_NEW = """#daycard.on{display:flex}
/* """ + MARK + """ (8/27): A ROAD MOMENT IS SOMETHING YOU READ, NOT SOMEWHERE
   YOU GO. cardShow is modal by construction -- a full-screen scrim at z-index 20
   -- which is right for the wake card and the market, because those are places.
   It is wrong for a thing that happens to you WHILE YOU ARE MOVING: the scrim
   sat on the pad, the chip and the canvas, so the pad went dead and a pinch back
   to his body did nothing. LOOK NOT TRAVEL caught it, twice, alone.
   The scrim stops catching touches; the card still does. The valley stays
   visible, because an interruption you cannot see past is a loading screen. */
#daycard.roadcard{background:transparent;pointer-events:none;
  align-items:flex-end;padding-bottom:200px}
#daycard.roadcard #daycardIn{pointer-events:auto;
  box-shadow:0 18px 50px rgba(0,0,0,.85)}"""

# --------------------------------------------------- the card asks for that class
CARD_OLD = """function roadCard(ev, mins){
  if(typeof cardShow!=='function') return;"""

CARD_NEW = """function roadCard(ev, mins){
  if(typeof cardShow!=='function') return;
  /* """ + MARK + """: this one card is not modal. Set BEFORE cardShow so the
     class is on the element the same frame it becomes visible. */
  var _dc=document.getElementById('daycard');
  if(_dc) _dc.classList.add('roadcard');"""

# ------------------------------------------------------------------- the bail
BAIL_OLD = """var ROAD_DIR = null, ROAD_LOG = [];"""

BAIL_NEW = """var ROAD_DIR = null, ROAD_LOG = [];

/* """ + MARK + """ -- AND IT GETS OUT OF THE WAY BY ITSELF.
   Shaped after vistaBail, and for the same reason it exists: "a direction is not
   'get me out of here', it is 'go that way'." His next press closes the road
   card and still does what he pressed, so a road moment can never stack or sit
   there. Only ever closes OUR card: the wake card and the market still hold the
   screen, because those are places he went to on purpose. */
function roadBail(){
  var c=document.getElementById('daycard');
  if(!c || !c.classList.contains('roadcard')) return false;
  c.classList.remove('roadcard');
  try{ cardHide(); }catch(_e){}
  return true;
}"""

HOLD_OLD = """  try{ if(typeof vistaBail==='function') vistaBail(); }catch(_e){}
  held=di; pend=di; heldBeats=0; }"""

HOLD_NEW = """  try{ if(typeof vistaBail==='function') vistaBail(); }catch(_e){}
  /* """ + MARK + """: and the road card goes with it, same rule. */
  try{ if(typeof roadBail==='function') roadBail(); }catch(_e){}
  held=di; pend=di; heldBeats=0; }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the road card is already not a lock')
        return
    if '__THE_ROAD_INTERRUPTS__' not in s:
        sys.exit('FAIL: the road card does not exist yet; run the road patch first')
    for old, what in ((CSS_OLD, 'the card scrim style'),
                      (CARD_OLD, 'the road card builder'),
                      (BAIL_OLD, 'where the bail goes'),
                      (HOLD_OLD, 'the direction press')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    for old, new in ((CSS_OLD, CSS_NEW), (CARD_OLD, CARD_NEW),
                     (BAIL_OLD, BAIL_NEW), (HOLD_OLD, HOLD_NEW)):
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- the road card is read, not obeyed' % CITY)


if __name__ == '__main__':
    main()
