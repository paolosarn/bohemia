# A LOADING SCREEN CANNOT MAKE A SOUND (9/20/26, SOUNDS lane)
## The hold round under rule 18 — measured for somebody else's job, nothing shipped

> **RULE 18 (Paolo 9/20, LOCKED): "I just want to restart all of this… we were closer to
> being able to play before, right now we're farther than we've ever been." NO RESTART.**
> Only LOADING, WALKING and THE FIGHT ship to the alpha. **Every other building lane holds:
> claims stay claimed, nothing pushed, and the round is spent measuring your part of the
> three.**

SOUNDS is not one of the three. **This round ships nothing to the alpha.** What follows is
the measurement my own section was told to produce, handed to the lane that owns the work.

---

## THE ONE THING SOUNDS OWNS INSIDE "LOADING", AND IT IS A CONSTRAINT, NOT A FEATURE

RUN's item is *a real screen when the alpha and the demo open, **nothing tappable until
loaded***.

This lane has a thing built for exactly that window. The PULSE — a looping half-second
buffer at 120 BPM, handed to the audio thread and never touched again — exists because of a
measurement from 9/5 in its own comment: *the tap makes a sound at 110 ms, it is over by
401 ms, and the next thing you hear is at 9,824 ms.* It was built to cover the load.

**So the question this round had to answer for RUN: if the loading screen comes before the
tap, does the pulse cover it?**

### MEASURED, ARMED BEFORE ANY PAGE SCRIPT RAN

Every `AudioContext` the page constructs was wrapped before the document ran, so the count
is of objects that really exist rather than of code that mentions them. Phone profile, CPU
throttle proved real inside the run by a warmed busy loop (5.3 ms → 26.4 ms = **4.98x**).

    BEFORE THE DOOR, across 14.5 seconds, the door visible the whole time
        AudioContexts in existence ............ 0
        any of them RUNNING ................... no
        pulse reporting for itself ............ nothing to report, it does not exist yet

    THE DOOR IS TAPPED AT ................... 16,524 ms
        the first AudioContext is created at .. 16,664 ms   (140 ms AFTER the tap)
        it is born already 'running' .......... yes
        the music first plays at .............. 33,044 ms   (16.5 s after the door)

> **THE PRE-TAP WINDOW IS NOT QUIET. IT IS SILENT BY CONSTRUCTION — THERE IS NO AUDIO
> OBJECT IN EXISTENCE AT ALL, NOT EVEN A SUSPENDED ONE.**

### WHAT THAT MEANS FOR RUN, PLAINLY

A browser will not start audio without a gesture. Rule 18's loading item makes the screen
**untappable until loaded**, which puts the gesture *after* the load. Those two facts
together mean:

> **A LOADING SCREEN THAT BLOCKS THE TAP CANNOT MAKE A SOUND. Not because nobody wrote one
> — because the platform will not allow one, and the game does not even build the audio
> until the tap.**

So the honest options, none of which are this lane's to choose:

1. **The loading screen is silent, on purpose and by design.** Then the pulse's job moves:
   it stops being "cover the load" and becomes "cover the gap between the tap and the first
   song", which the numbers above say is **16.5 seconds on a phone**. That is the real
   window and it is bigger than the 9.8 s the pulse was built against.
2. **The screen takes a tap to begin** ("TAP TO LOAD" rather than "TAP TO ENTER"), which
   buys the gesture early and lets the load be scored. This changes RUN's own rule about
   nothing being tappable, so it is RUN's call and the coordinator's, not mine.

**I am not building either.** The lane is held, and option 2 is a change to somebody else's
ruled item.

### AND THE PULSE'S OWN PREMISE NEEDS RE-AIMING WHATEVER THEY CHOOSE

Its comment says it covers "the ten seconds of silence while the city loads". Measured on a
phone, the silence it actually has to cover is **16.5 seconds**, from the tap to the first
song. Nobody has checked whether the pulse still runs for all of it. That is this lane's
work, and it waits for the hold to lift.

---

## WHAT I TRIED TO MEASURE FOR "WALKING" AND COULD NOT, SAID BEFORE IT BECAME A FINDING

Rule 16 makes one step one lot and one step per beat; the shell's footstep limiter is
0.12 s and a beat is 0.5 s. So the obvious question is what the real footstep spacing is
while he walks.

**My first instrument drove arrow keys at the parent page. The player never moved and it
reported ZERO FOOTSTEPS.** A count of zero from a walk that never happened is false death —
the exact error this fleet has now documented five separate times — so it is not published
as a number. It is published as a broken instrument.

**The second used the one driver** (rule 14g) and proved movement from the city's own
`hx/hy` before counting anything, which is the right shape. **It hung and never produced a
line.** Two instruments, no data.

> **SO THE FOOTSTEP SPACING WHILE HE WALKS IS NOT MEASURED, AND I AM SAYING SO RATHER THAN
> POSTING A THIRD GUESS.**

That is PLUMBER's own precedent from 9/14, in its own words: *"NOT MEASURED YET, AND I AM
SAYING SO INSTEAD OF POSTING A FOURTH GUESS… a fourth version means you already failed, so
stop and say so."* What is on the board for the next round is therefore a question, not a
number:

    the shell's footstep limiter is 0.12 s
    one step per beat at 120 BPM is 0.5 s
    WHICH ONE THE WALK ACTUALLY OBEYS IS UNKNOWN

If the limiter is what governs, footsteps can fire four times faster than the ruled one
step per beat, and rule 16 would be broken in the ear while looking right on screen. That
is worth knowing before RUN finishes [one camera], and it is the first thing this lane
measures when the hold lifts.

---

## THE HOLD, KEPT

    pushed to the alpha this round ............ NOTHING
    rows closed ............................... none
    [scheduled beat] .......................... still CLAIMED, round two still waiting
    cooked ..................................... nothing

Round two of `[scheduled beat]` is a clock the audio thread owns, and it touches the
transport, which is not one of the three. **It waits.**

    no gate command: nothing shipped, so nothing new to gate.

Build stamp: UNCHANGED, on purpose. This round put nothing in front of him.
