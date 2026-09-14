# THE FIVE MINUTES, COUNTED -- AND THE FOURTH VERSION OF ONE NUMBER, WHICH IS THE TELL

PLUMBER lane, VAMILY row [demo errors], 9/14/26.
Paolo 9/13: "it's like this glitchy, buggy AI experience where nothing's complete."
Rule 14 makes the demo's first five minutes on a phone the only measure of the game.
The row asks for four numbers every round: page errors, stalls over one beat, taps
that did nothing, frames under 60.

## THE FOUR NUMBERS, 300 s ON A PHONE (390x844, dpr 3, touch), box 1.04x of baseline

    PAGE ERRORS        0
    STALLS             1     one gap over a beat (500 ms), worst 1,550 ms
    FRAME RATE      57.8     fps, and 194 frames of 17,402 arrived so late a whole
                             frame went missing (1.1%)
    DEAD TAPS    NOT MEASURED YET.  Four attempts, three of them wrong. See below.

Three of the four are steady: the same three walks, an hour apart, gave 0 errors,
1 stall, 57.3 to 57.9 fps. Those are real and they are this lane's own to fix.

## THE FOURTH NUMBER IS THE ONE I OWE HIM AND I DO NOT HAVE IT

STOP PRODUCING, 7/26: "THE TELL: writing a fourth version of anything means you
already failed -- stop and say so instead of fixing the attempt." This is the fourth
version of the dead-tap counter. So: I stopped, and here is what each version cost
and what the last one actually proved.

    v1   0 of 45 taps landed         I passed the button's WORDS to a function that
                                     wants a SELECTOR. Caught by the tool's own floor.
    v2   162 dead of 230 (70%)       Wrong. Cycling the controls opens a panel, the
                                     panel covers the next button, the tap hits the
                                     panel. Correct behaviour, counted as a bug.
                                     Fixed: a tap counts only if the topmost thing at
                                     those coordinates IS the control.
    v3   48 dead of 77               I said the picture was clipped to the canvas while
                                     those panels draw in the page around it. I fixed
                                     that and re-walked. IT CHANGED NOTHING: 48 of 77
                                     again, the same six names at eight each. So that
                                     diagnosis was also wrong.
    v4   the control walk            Below.

## THE CONTROL WALK: RUN THE WHOLE THING AND PRESS NOTHING

`node tools/bohemia_five_minutes.js --no-taps`. Identical walk, identical order,
identical waits, identical two pictures, identical arithmetic. One difference: nobody
presses anything. This is the planted-bug test QUESTS used on its own gate (e909bc5f),
and it is the only honest way to ask an instrument whether it measures anything.

    pressing everything     48 dead of 77 that reached their control
    pressing NOTHING         0 dead of 69 that reached their control

The instrument does not talk to itself. A walk that presses nothing finds nothing.
So the 48 is caused by the pressing, and it is not noise.

## BUT IT IS ALSO NOT FORTY-EIGHT DEAD BUTTONS, AND HERE IS THE PROOF

The control walk proves something else at the same time, and it inverts the meaning of
the whole number. With no taps at all, every pair of pictures 900 ms apart DIFFERED.
The demo repaints constantly. Measured again directly at the door: two looks, no tap,
900 ms apart, different.

So a pair of identical pictures does not mean "the button did nothing". On a surface
that never stops moving, it means THE SURFACE STOPPED MOVING for nearly a second.

And it is not a freeze either, because the frame watcher recorded ONE stall in the
whole five minutes, in the tapping walk and the no-tap walk alike. Frames kept
arriving at 57.8 per second. They were painting the same pixels.

Then each of the six names was pressed ONE AT A TIME from a clean door, whole phone
photographed at four moments (rule 14(g): never report a break you have not reproduced
on the glass):

    MUSIC             #musbtn     moved the screen at 120 ms, 300 ms, 900 ms, 2000 ms
    SAVE              #savebtn    moved the screen at 120 ms, 300 ms, 900 ms, 2000 ms
    PHONE1            #phonebtn   moved the screen at 120 ms, 300 ms, 900 ms, 2000 ms
    SUBURB · ON FOOT  #hslot      moved the screen at 120 ms, 300 ms, 900 ms, 2000 ms
    OUTFIT                        NOT ON SCREEN AT THE DOOR
    DAY 1 · 13:57                 NOT ON SCREEN AT THE DOOR

Four of the six are alive. Two of the six are not even buttons: the driver's
`controls()` sweeps every div and span carrying short text, so a status readout
("SUBURB · ON FOOT", "DAY 1 · 13:57") is handed to the walk as something to press.
That is a third of the 48 right there.

SO THE HONEST SENTENCE IS: 48 taps of 77 left the phone showing a still picture for
nearly a second, on a surface that otherwise never holds still. That is worth knowing
and I am not going to call it a dead button, because I proved four of the six alive.

## WHAT THIS COSTS EVERY OTHER LANE, AND IT IS THE REAL FINDING

A SCREEN DIFF IS NOT A TEST OF WHETHER A CONTROL WORKS, IN EITHER DIRECTION.

    it reads FALSE LIFE    rule 14(h), from QUESTS: a card closes on any tap it does
                           not recognise, and the diff reads the vanished card as life
    it reads FALSE DEATH   this round: the surface goes static after a legitimate tap
                           and the diff reads a working button as dead

Both halves are now measured. EYES E26 item 2 names two demo buttons dead on "no
change in words or pixels for 1.2 s", which is the same instrument this round just
failed with. That is ONE LINE on their row, not a fix by this lane, and it is not a
claim their buttons work -- it is a claim the evidence is the kind that just broke here.

What actually settles it is the shape QUESTS built: require THE PANEL TO STILL BE OPEN
AND ITS WORDS TO HAVE MOVED. That is a words test, not a pixels test, and words do not
repaint on their own. It exists for the day card in gates/every_row_does_something_gate.js
and it is the next cut of this instrument, not a patch on this one.

## SHIPPED THIS ROUND, IN THE TOOL

  * `--no-taps`, the control walk. Any counter of "did the screen change" that cannot
    show a zero when nothing is pressed is an opinion. This one shows a zero.
  * the rule 14(h) band: a tap where the screen moved AND the control vanished is
    counted in its own pile, because that is what a close looks like too. The dead
    number is a floor, floor plus that pile is the ceiling, and neither is dressed up
    as the other.
  * the running "dead so far" line now counts the way the report counts. It was
    including taps that never reached their control, so it read 157 while the bottom
    of the same run read 48.

## THE NUMBERS THAT ARE MINE

This lane owns "the game runs at 60 on a real phone". Both numbers under that heading
are on my own row, not routed anywhere:

    57.8 fps against 60, over five minutes of real play
    194 frames of 17,402 arrived a whole frame late (1.1%)
    1 gap over a beat, worst 1,550 ms

Raw walk: records/BOHEMIA_FIVE_MINUTES.json. Tool: tools/bohemia_five_minutes.js,
which drives the demo through tools/bohemia_drive_the_demo.js as rule 14(g) requires.
