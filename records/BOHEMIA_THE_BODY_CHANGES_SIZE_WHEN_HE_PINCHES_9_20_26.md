# THE BODY CHANGES SIZE WHEN HE PINCHES, AND ONE OF THE CHANGES GOES BACKWARDS
ANIMATION lane, 9/20/26. Rule 18 HOLD round: nothing pushed to the alpha.
This lane's part of WALKING and THE FIGHT, measured into the handoff as the MODE
line asks.

## WHY THIS ROUND MEASURED INSTEAD OF BUILT
Rule 18 (Paolo 9/20): "I just want to restart all of this... we were closer to being
able to play before, right now we're farther than we've ever been." Only LOADING,
WALKING and THE FIGHT ship. **Every other building lane holds.** This lane holds. The
row stays claimed, the alpha is untouched, and the round buys a number instead.

His two sentences that name this lane's output:
- rule 18, WALKING: "the body **one fixed size that never changes while he walks or
  pinches**."
- rule 17, THE FIGHT: "the **same bodies** at the ruled size", against what he saw,
  "two tiny figures on a brown line".

## WALKING: THREE BODY SIZES, AND ONE CHANGE GOES THE WRONG WAY
Measured at the four walk-zoom stops a pinch can actually reach (`HLEVELS`, the
city's own ladder, not values invented for the test), on a 390-wide phone:

    HC | a lot on screen | house fits a phone? | THE BODY he sees | body / lot
    11 |           275px |             **yes** |        **112px** |      0.407
    22 |           550px |                  no |         **56px** |      0.102
    44 |          1100px |                  no |          112px   |      0.102
    88 |          2200px |                  no |          224px   |      0.102

**THREE DISTINCT BODY SIZES ACROSS THE PINCH. His rule says one.**

And the first change is the ugly one: **pinching in from HC 11 to HC 22 makes the
body HALVE, 112px to 56px, while the world DOUBLES.** The body shrinks as he zooms
in. That is not a subtle drift; it is a jump in the wrong direction, and it is on the
surface he says feels worse than before.

## AND ONLY ONE OF THE FOUR IS A LEGAL CAMERA AT ALL
His rule is "one walking camera **where a house fits**". A lot is 25 fine cells, so a
lot on a 390-wide phone is 275px at HC 11 and 550px or more at every other stop.
**HC 11 is the only walk zoom where a house fits a phone screen.**

So the answer to RUN's [one camera] is already measurable: **the one camera is HC 11**,
and at HC 11 the body is 112px against a 275px lot, which is **0.407 of a lot** versus
his ruled 0.5. The rung ladder only offers 28 / 56 / 112 / 224, so 112 is the nearest
rung to his ruling; the next one up, 224, would be 0.81 of a lot.

## AND THE SAME PINCH GIVES A DIFFERENT BODY ON A DIFFERENT WINDOW
The body size is chosen partly off `cv.width`, so the same zoom stop is not the same
body on two surfaces:

    HC | body on a 378px phone | body on a 628px window
    11 |                 112px |                  112px
    22 |              **56px** |             **224px**
    44 |                 112px |                  112px
    88 |                 224px |                  224px

**A 4x difference at the same pinch, decided by the window.** Rule 14 says the phone
is the only measure, so the phone column is the truth -- but a lane measuring on a
desktop would read HC 22 as 224 and be wrong by four times. I nearly did: the first
run of this measurement was on the default window and disagreed with the phone run,
which is the only reason it was caught.

## THE FIGHT: THE TWO SURFACES ARE NOT THE SAME BODIES
Rule 17 asks for "the same bodies". They are not the same bodies:

    the rig renders          112 x 112, a standing body 98 rows of it (88% of the frame)
    this lane ships THE FIGHT     112 -- native, every pixel the rig drew
    this lane ships THE STREET     56 -- the same render, halved

**A 2.0x difference in resolution, from the same rig render.** So at HC 11, the one
legal camera, the street draws a 112px body by DOUBLING a 56px picture that was
itself a halved 112 -- while the fight, of the same person, gets the real 112. Same
body, two resolutions, on the two surfaces he is asked to believe are one place.

## AND I OWE A CORRECTION ON MY OWN STANDING ADVICE
**My handoff has told the fleet for three rounds to "raise CAST_PX to 112". As a
standalone instruction that is WRONG, and this measurement is what showed it.**

The city draws into a box and reaches it by doubling the shipped sprite a fixed
number of times. Working backwards from the box at every stop, on both window widths:

    HC | box | doublings | so CAST_PX must be
    11 | 112 |        2x |                 56
    22 |  56 |        1x |                 56
    44 | 112 |        2x |                 56
    88 | 224 |        4x |                 56

**56 is already correct at every stop.** Raising it alone puts a double-size picture
in the same box at every zoom, which is exactly what ONE NUMBER FOR A BODY bites on.

The sharpness point still stands but only as a PAIR, and it has to be said that way:
the city's ladder learns the shipped size off `m.w` **and** this lane raises CAST_PX
in the same round, so the multiplier drops by one and the pixels become real instead
of invented. Said as "raise CAST_PX to 112" it reads as a one-lane job and it is not.

## WHAT THIS LANE HANDS THE THREE
Nothing was built. The numbers are:
- **the one walking camera is HC 11**, the only stop where a house fits a phone;
- at HC 11 the body is **112px**, **0.407 of a lot** against his ruled 0.5, and 112
  is the nearest rung the ladder offers;
- the body currently takes **three sizes** across the pinch and **shrinks as he zooms
  in** between the first two stops;
- the same stop is **4x different** between a phone and a desktop window;
- the fight gets **112** and the street gets **56** from the same render, so "the same
  bodies" is not true today;
- **CAST_PX must stay 56** unless the city's ladder changes in the same round.
