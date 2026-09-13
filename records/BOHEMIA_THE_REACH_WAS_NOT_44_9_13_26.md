# THE BOUNCE-BACK WAS STALE, AND THE REACH WAS NEVER 44
UI lane (11), row [eyes: reach spills]. 9/13/26.
EYES AND EARS bounce-back of 9/7 on this lane's SHIPPED [half size].
Their proof: records/BOHEMIA_EYES_E13_ROUND_2_WHO_ACTUALLY_GETS_THE_TAP_9_7_26.md
Sheet: slices/BOHEMIA_FIVE_WAYS_FOUR_BUTTONS_FIT_9_13_26.html

## FIRST: THE THING I WAS SENT TO FIX IS ALREADY FIXED
EYES measured on 9/7 that `savebtn` was painted 18.8x15 and **reached 236x54**, lying on five
neighbours, so `musbtn`, `phonebtn` and `outfitbtn` all delivered their presses to `savebtn` --
which is why the phone button did nothing with the halving on.

Re-measured 9/13 by asking **every 4 px of the screen who gets the point**, and by driving a real
tap at each control's own centre:

    savebtn      reaches 28x12   (not 236x54)
    a driven tap at each control's centre lands on that control   12 of 12

**The spill is gone.** The giant pads were removed by later rounds ([pad broken], [rail collides],
[no tabs]). The bounce-back was true when written and is stale now, and saying so is the first
job -- a row that describes a defect that no longer exists sends the next reader hunting a ghost.

## WHAT IS LIVE IS THE OPPOSITE PROBLEM, AND EYES' OWN NOTE ALREADY CONTAINED IT
Their second paragraph: *"with the halving OFF the tap lands on 13 of 14 and ZERO controls clear
44 (the tallest is 32)."* With the halving **ON**, measured now: **reach EQUALS ink at 12 px**.
Under a third of a thumb.

And it is deliberate. `[half size]` had to kill the 44 px box, and its own comment says exactly
why, correctly: *a 44-tall box at a 22 pitch overlaps itself*, so the box above sat on the chip
you aimed at. That is the 9/7 bug. Their replacement was a **30 px gap** on the container, with
the claim: *"The REACH is still 44, it is just no longer made of a 44-tall BOX."*

**THAT LAST SENTENCE IS THE ONE THING THAT IS NOT TRUE, AND IT IS WHY NOBODY LOOKED AGAIN.** What
is 44 is the **ISOLATION**, not the reach. A 12 px chip with 30 px of dead air around it means a
finger that misses hits **nothing** instead of the wrong thing -- which is a real and good
property, and a completely different promise from the one the thumb law makes. You still have to
be accurate to 12 px.

## THE FIX IS THE SAME PITCH SPENT DIFFERENTLY
    before   12 px chip  +  30 px dead gap   =  42 px pitch,  12 px of it live
    after    44 px chip  +   0 px gap        =  44 px pitch,  all of it live

Same layout, same footprint, and **thirty pixels of dead space per chip becomes live target**.
Ink is untouched: `font-size` and `padding` still halve, so this is his order and the thumb law
at once -- which is exactly how the coordinator worded `[every card]`: *reach stays 44, ink
halves.*

**AND THE OVERLAP CANNOT COME BACK, WHICH IS THE WHOLE POINT OF DOING IT THIS WAY.** A pad is an
absolute box laid OVER the screen, so when it is bigger than its chip it covers the neighbour and
takes the press -- that is 9/7. `min-height` grows the element **in flow**, and the rail is a flex
**column**, so the neighbour MOVES. It is not mitigated, it is impossible.

    measured after, every 4 px:
      rungbtn 44x44   buildbtn 44x44   workbtn 56x44   sleepbtn 44x44
      bikebtn 44x44   mktbtn 44x44     note 88x44
      and a driven tap at each centre still lands on that control

`thumb_gate`'s half-size exemption list dropped from **42 controls to 30**.

## THE GATE PROVES BOTH HALVES, BECAUSE EITHER ALONE IS A BUG THAT ALREADY SHIPPED
`gates/city_rail_gate.js` **13 ok, 0 failed**, two new legs:
* every chip in the rail is 44 px **even with the halving on**
* and a tap at each chip's own centre still reaches **that** chip

Grow the boxes without the second and you rebuild the 9/7 overlap; keep the second without the
first and you are back at a 12 px target. Mutation-proved both ways:

    back to 12 px chips + 30 px gap (this morning's state)  ->  the 44 leg names sleepbtn, bikebtn, ...
    44 px chips forced to overlap (the 9/7 failure)         ->  "NOTHING LIES ON ANYTHING ELSE" names 6 pairs
    restored                                                ->  13 ok, 0 failed

## THE TOP BAR DOES NOT HAVE THE SPARE ROOM, AND THAT IS A FORK, NOT A BUG
The column could give 44 away free because it grows downward into empty screen. A **row** cannot.
Measured in the demo, where the builder drawer is correctly hidden:

    the bar's right-hand group   123 px wide
    four controls at 44 px       176 px needed
    shortfall                     53 px

The left-hand end is holding HUMAN MODE, SUBURB · ON FOOT, and DAY 1 · 06:00. Something has to
give and **which thing is his call, not mine** -- drop the words, two rows, move them into the
column, or one button that opens the four. Five ways are on the sheet, drawn at the bar's real
width so none of them is flattering itself. **Not guessed at and not half-built.**

## PROOF
    node gates/city_rail_gate.js     13 ok, 0 failed (two new legs, mutation-proved both ways)
    node gates/thumb_gate.js         19 ok, 0 failed (exemption list 42 -> 30)
    node gates/half_size_gate.js      7 ok, 0 failed
    node gates/phone_object_gate.js  18 ok, 0 failed
    node gates/rom_face_gate.js      14 ok, 0 failed
    node gates/feed_gate.js          15 ok, 0 failed
    node gates/alpha_loads_gate.js   20 passed, 0 failed

Per rule 13: PRE-PUSH PASS green. THE SUITE LINE is still unposted, so the honest sentence is
**pre-push pass green; full suite unmeasured since 75280da7.**

Rule 14(a): ships to the alpha and the workshop; the demo is untouched. RUN cuts it.

## THE LESSON
A claim inside a comment is worth exactly what the measurement behind it is worth. *"The REACH is
still 44"* was written by somebody who had just fixed a real bug correctly, and it was wrong, and
because it was written down confidently **nobody re-measured it for six rounds** -- including the
lane that wrote it, and including me, until a stale bounce-back sent me back to look.
