# POP OUT NEVER ASKED WHO IT WAS COVER FROM

Paolo 8/3, three things in one message, and two of them are my own bugs from
this week.

---------------------------------------------------------------------------
## 1. POP OUT WAS ASKING THE WRONG QUESTION. THIS IS THE REAL ONE.

"BRO IF I HAVE CIVER TIO MY NORTH OF ME BUT THERES NO ENEMIES TO THE NORTH OF
ME BUT ENEMIES ARE TO THE SOUTH OF ME THE ACTION BUTTON SHOULD NOT BE SAYING
POP OUT WHATS WRONG WITH YOU"

He is exactly right, and the whole bug is one line:

    function playerNearCover(){ return (G.pillars||[]).some(P=>P.edist<1.8); }

IS THERE ANY STONE WITHIN 1.8 TILES OF ME, IN ANY DIRECTION, FULL STOP.

It has never once asked whether that stone is between you and a living man. So
cover to your north with every gun to your south says POP OUT, exactly as he
describes. Wrong since v52.

AND IT IS WRONG TWICE OVER, BECAUSE THE FILE ALREADY KNEW THE ANSWER.
`myCoverAgainst(ang,dist,lvl)` is the real geometry test. The volley uses it.
The exposure floor uses it. The acquisition bead uses it. The action button was
the one place left asking the cheap question, and it is the place he actually
looks.

POP OUT now means: you are behind something that shields you FROM SOMEBODY WHO
CAN SHOOT YOU. If the stone covers you from nobody alive, you are not popping
out of anything -- you are standing in the open next to a rock, and ENGAGE is
the truth. Dead, downed, broken and fleeing men are not threats, because cover
from a corpse is not cover.

MEASURED, his exact case, on the real surface:

    cover NORTH, every enemy SOUTH     old said POP OUT     now says ENGAGE
    cover SOUTH, every enemy SOUTH     old said POP OUT     now says POP OUT
    cover SOUTH, everybody DEAD        old said POP OUT     now says ENGAGE

The middle row is the control: the fix does not just always say ENGAGE, it says
the right thing in each case.

---------------------------------------------------------------------------
## 2. THE SLIDER DOES NOT WORK ON PC, AND THAT IS MY v119 BUG

"THE UI MENU SLIDER DOESNT WORK ON PC WHATS UP WITH THAT!!! I HAVE TO USE LEFT
AND RIGHT MOUSE BUTTON."

v119 (mine, two days ago) made the verb row `flex-wrap:nowrap; overflow-x:auto`
so thirteen buttons would stop wrapping onto three rows and shoving the picture
down a 430px phone. Then it hid the scrollbar so the phone would not carry a
grey bar across the HUD.

ON A PHONE YOU SWIPE IT AND IT WORKS. ON A PC THERE IS NOTHING TO SWIPE WITH.
A mouse wheel scrolls vertically and a horizontal container ignores it. There
is no visible scrollbar because I removed it. The only thing left that moves
the strip is press-and-drag -- which is literally what "I HAVE TO USE LEFT AND
RIGHT MOUSE BUTTON" describes. He was drag-selecting the row to shove it along.

I built a phone control and shipped it to a desktop.

THE FIX IS NOT A BETTER SLIDER. IT IS NO SLIDER. A PC has a wide window and
vertical room to spare; the sideways strip only ever existed for a 430px phone.
On a non-touch machine the row goes back to WRAPPING, which is what it did
before v119 and what it should never have stopped doing there. `G.isTouch`
already exists (v53, from his own "detect when im on my computer vs phone"), so
the detection is not invented here.

AND THE PHONE KEEPS ITS STRIP, plus a wheel or trackpad gesture now maps to
horizontal scroll -- so a TOUCHSCREEN LAPTOP, which reports as touch and would
still get the strip, is not stuck either. The thing that broke here was
assuming one input model, so the fix covers both.

MEASURED on the real surface, two viewports:

    PHONE  430px   nowrap, scrollable=true,  row 34px tall
    PC    1280px   wrap,   scrollable=false, row 114px tall, every button visible

---------------------------------------------------------------------------
## 3. SPRINT COMES OFF THE TOP MENU

"I NEED YOU TO HAVE SPRINT OFF THE TOP MENU BC ITS IN THE GAMEPLAY UI NOW."

A v122 miss. That patch removed DASH and VAULT because he named them, and left
SPRINT because he had not -- I wrote in the record that removing it "would be
me deciding something he did not." He has now decided. RUN is the movement verb
and it lives on the ring with his thumb, so a second movement toggle at the top
of the screen is exactly the clutter he asked to be rid of.

THE FUNCTION IS NOT DELETED. `G.sprintArm` and doMove's sprint branch stay
callable behind a null-safe wire, same as doDash and doVault after v122.
Nothing dies without his word.

---------------------------------------------------------------------------
## THE GATE

Seven new checks in gates/combat_lab_gate.js (643 -> 650). Negative-tested:
they fail on an unpatched alpha. THREE existing checks migrated with the
supersession named:

  * V44 SPRINT now guards the VERB instead of the button, which is what it was
    always about.
  * V52 POP OUT VS ENGAGE got STRICTER, not looser. It said "no pillar near you
    -> ENGAGE"; it now says "nothing actually covering you -> ENGAGE", which
    covers the case it always guarded AND the case it never did.
  * The enemy-facing cover-call count goes 8 -> 9, because coveredFromAnyone
    carries its level like every other call. The invariant is that no
    enemy-facing call may be levelless, never that there is a fixed number.

---------------------------------------------------------------------------
## THE PATTERN WORTH NAMING

Two of these three are mine from the last 48 hours, and they are the same
mistake in two costumes: I shipped something correct for the surface I was
testing on and never asked what it did on the other one. v119 assumed a phone.
v52's POP OUT assumed proximity was the same thing as protection. Both passed
every gate, because the gates asserted what I had built rather than what he
would experience.
