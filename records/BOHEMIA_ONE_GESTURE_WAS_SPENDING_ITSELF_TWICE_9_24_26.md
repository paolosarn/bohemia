# ONE GESTURE WAS SPENDING ITSELF TWICE (RUN, 9/24/26)

VAMILY `[way back]`, ONE-SQUEEZE-OUT-ONE-SPREAD-BACK. Rule 26 (walking, un-held) and
his own consistency ruling: *"a UI that's not consistent for every second of the game."*

## THE ROW, AND WHERE THE NUMBER CAME FROM

The round before, fixing the driver's door made the seam measurable for the first time
and the trip came out lopsided:

    one squeeze together   street -> CITY
    three spreads apart    CITY -> street

The seam is the only door between the street and the city screen, and the city screen is
where the phone lives. Lopsided is not a small thing here: he ruled on exactly this, that
the game must not change its rules from one second to the next.

## I ASSUMED IT WAS THE SEAM. IT WAS NOT THE SEAM.

Before touching anything, one ordinary squeeze with every zoom call logged:

    0   setHZoom(10.771)  MODE=human          <- the seam fires on the FIRST move
    1   setZoomAt(0.979)  MODE=city  CZOOM=1.000
    ...  thirty-eight more, every one MODE=city
    39  setZoomAt(0.185)  MODE=city  CZOOM=0.208

**ONE SQUEEZE DID TWO THINGS.** It crossed the seam on its first move, and then the
remaining thirty-nine moves of the same finger-drag zoomed the brand-new city camera from
1.000 all the way out to 0.208 -- which is the minimum, the whole valley.

He never asked to see the whole valley. The tail of his own gesture asked for it, after
the surface underneath it had been replaced.

**AND THAT IS THE WHOLE ASYMMETRY.** The trip out is one gesture because the walking
ladder has ONE stop, so any squeeze is already at the edge and means leave. The trip back
has to climb the city zoom from 0.208 to 2.6, a factor of twelve, before the return seam
fires. His own squeeze had put him at the far end of that climb.

## THE FIX IS ONE SENTENCE: A GESTURE THAT CROSSES A SEAM IS FINISHED

The fingers come up and go down again before the new camera listens. Same shape as the
walk's own one-slide-per-press guard, and for the same reason: **an input that keeps
acting after the thing it was acting on has been replaced is not one input, it is two.**

It is set where each seam actually fires (street to city, and the city to the sky), and
it lifts when fewer than two fingers are on the glass -- not on a timer, because a timer
has to guess how long a slow hand takes and is wrong in exactly the way that reads as a
dead control.

    BEFORE                                AFTER
    one squeeze -> city at CZOOM 0.208    one squeeze -> city at CZOOM 1
    spread x1   -> still city, 0.208      spread x1   -> STREET
    spread x2   -> still city, 1.247
    spread x3   -> street
    THREE SPREADS BACK                    ONE SPREAD BACK

## AND ONE SQUEEZE NOW SHOWS HIM HIS OWN BLOCK, NOT THE WHOLE VALLEY

That is a real change to what he sees and it is deliberate. Pulling back from a street
straight to a 96 x 96 valley in one gesture is the "overwhelmed" complaint in one motion.
Now the ladder has rungs and each rung is one gesture: his block from above, then the
valley, then the region, then the moon, and the same coming down. **Nothing is
unreachable; what changed is that no single gesture skips a rung.**

## I SHIPPED HALF OF WHAT I WROTE, AND THE OTHER HALF CAME BACK OUT

I also loosened the return seam so that a REQUEST overshooting the ceiling would cross
even if he was not yet sitting exactly on it, on the theory that a spread could otherwise
be eaten by a dead clamp. **The mutation proved it changes nothing a finger can produce:**
a pinch arrives as twenty-odd incremental moves, so the early ones climb to the ceiling
and a later one in the same gesture asks for more while sitting on it. Putting the strict
test back left the round trip at one spread.

A change I cannot make bite is a change with no measurement behind it. It is out, and the
reason is written where the code would have been, so nobody adds it again believing it
does something.

## THE GATE

`gates/the_driver_reaches_the_city_gate.js`. Its round-trip leg used to print the count
and assert only that he got back at all; it asserts **one spread** now, which is the thing
that was wrong. **MUTATION: take the guard off the outward seam -> the leg goes red at
three spreads**, which is the exact before number, measured twice on the same instrument.

## THE PART THAT IS STILL NOT SYMMETRIC, NAMED RATHER THAN HIDDEN

From the VALLEY (the city's own furthest zoom) back to the street is still two spreads,
because the city's zoom is continuous and he really is a long way out. That is honest
travel through a range, not a dead press, and it is not the thing the row was about: the
pair he actually uses, street to city and back, is one and one.
