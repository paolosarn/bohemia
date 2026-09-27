# THE CARRIER WAS NEVER HISS (9/27/26, SOUNDS lane) -- row [not sand], round four
## The click at the end of an approved sound, and the broadcast rebuilt from real material

> **CONTINUING [not sand] (rule 5), item 1 and item 2 of last round's own NEXT list.**

---

## 1. THE CLICK AT THE END OF AN APPROVED SOUND

`songThroughSpeaker`, which he voted UP, ended mid-amplitude: last sample **0.050992**
against its own biggest step of **0.1074**, which is **47.5%** of it. Not a rounding
error. A one-shot buffer ending there is a discontinuity against the silence after it,
and that is a click.

**FIXED WITH THE SAME 12 ms RAISED COSINE THIS FILE ALREADY USES ELSEWHERE.** After the
fix: last sample **0.000000**. The two drop-outs (1.64 s, 2.92 s) sit more than two
seconds clear of the fade window and neither moved. `songOnTape`, which wraps this
function, inherits the fix for free.

**SHIPPED AS A FIX, NOT A NEW VOTE ITEM.** Precedent: `[band helper]` changed the actual
rendered audio of six approved sounds (the door, the cloud, the song, the fold, the
phone, the room all measurably leaked less afterward) and none of the six went back to
him for a fresh yes/no -- the fix was named on the board and shipped. There is no
creative fork in "does this click less"; manufacturing a vote for an answer with no
defensible other side is the exact thing NEVER ASK HIM A TECHNICAL QUESTION warns
against, aimed at myself this time.

**AND A CLAIM HAD TO BE REWRITTEN BECAUSE FIXING THE SOUND FALSIFIED IT.** The claim
comparing the new deck/change against "the sound they replace" asserted that
`songOnTape` still clicks, because that was true the moment it was written. Fixing the
click the same round would have left a claim asserting a defect I had just removed --
honest about the past, lying about the present. Rewritten to state what was found and
that it no longer reproduces.

---

## 2. THE BROADCAST, REBUILT FROM REAL MATERIAL

`theBroadcast` was built, measured and gated two rounds ago, then **pulled out of his
queue the same round it was built**: its carrier and wear were the exact band-limited
noise recipe he had just killed three sounds over. Registering it would have been the
fourth sand sound in a row.

**WHAT IS REALLY UNDER AN AM CARRIER'S HISS IS TWO THINGS, NEITHER OF THEM A NOISE
GENERATOR:**

1. **THE TRANSMITTER'S OWN MAINS RIPPLE.** The same 60 Hz family the room already hums
   with, reused straight from `ROOM_HUM` / `ROOM_PARTS` rather than a second copy of the
   numbers, because it is the same grid.
2. **ATMOSPHERIC STATIC, WHICH IS SFERICS, NOT A HISS BED.** Real static is distant
   lightning arriving as discrete broadband clicks. `crackleInto` is the footstep's grit
   mechanism reused a third time (a seeded sum of tiny impulses), on a struck sky instead
   of a struck slab or shell.

**AND I GOT THE WEAR MODEL WRONG ONCE MID-BUILD, THE SAME SHAPE OF MISTAKE THIS LANE
KEEPS MAKING.** The first cut said wear buys more static and never more hum, because "a
power supply's ripple is not a maintenance question." Measured: with that rule, worn and
clean carriers came out at a **1.00x** rms ratio, the existing claim's own bar is **1.4x**,
and the reason is that a sparse click train barely moves total energy next to a
continuous hum -- I had reasoned about a knob instead of measuring the actual mix.

The correction was also physical, not just a bigger number: an electrolytic filter
capacitor **dries out over a decade**, which is a well-documented aging failure that
**increases** ripple. So wear buys more of both, for two separate real reasons: a
corroded antenna lets in more static, a dried capacitor lets more ripple through.
Measured after the correction: worn/clean ratio **2.00x**.

**THE PRE-ROLL, AND WHY THE OLD SEAM-BLEND TRICK IS GONE.** `bandTo` is a real filter
with memory that starts at zero, so the first cycle of hum carries a transient the last
cycle does not -- without correcting for that, the loop would click at the wrap for a
reason that has nothing to do with the sound. A 50 ms pre-roll lets the filter settle
into the periodic hum before the reported buffer starts, and the crackle events are kept
clear of both edges by the same margin. **This replaces the old noise-and-blend seam
trick, which existed only because a stochastic bed has no natural phase to close on; a
periodic hum does, once the filter has settled into it.**

**AND A STRUCTURAL CHECK ALMOST FAILED FOR A REASON THAT HAD NOTHING TO DO WITH THE
SOUND.** The gate's structural check reads `Function.prototype.toString()` for the name
of the banned call. My own rewritten comments, explaining that the function no longer
calls it, **spelled the banned identifier out loud inside the function body** -- a
`toString()` includes its comments. The function genuinely called nothing; the check
still would have read true on the prose. Fixed by describing the mechanism without
naming the call, which is a real constraint on how these functions get commented from
now, not a way around the check.

**MEASURED, CLEAN VS WORN:**

    RMS ratio, worn/clean (air only)          2.00x
    wrap: last-to-first step                  worn 0.003, clean 0.001, both under
                                               their own 99.9th-percentile step
    band leak on dead air                     0.02% above 5,000 Hz, both states
    drop-outs                                 worn 2, clean 0
    wow, proved against a perfect head        maxDiff 1.45, same length to the sample
    wow rate                                  0.5440 Hz -- the SAME transport geometry
                                               the tape deck plays through (through=0.5),
                                               not a bare 1.4 Hz that matched no wheel
    peak / digital zeros                      0.8493 / 0

**THE PAGE NEEDED NO CHANGE AT ALL.** `slices/BOHEMIA_THE_VALLEY_STILL_BROADCASTS_9_24_26.html`
reads the shipped recipe live, never a copy; it played the graveyarded version on 9/24
and plays the rebuilt one now, from the same three buttons. Verified on the glass: 3 of 3
buttons play, 0 page errors, 0 number blocks empty or reading undefined.

**REGISTERED**, first time, as `sounds-the-valley-still-broadcasts-9-27` (its 9/24 id was
never shown to him, so there is no prior verdict to preserve).

---

## 3. WHAT THIS ROUND DID NOT DO

    the three hums at the grid's pitch      NOT DONE. Next on the list.
    the 21 hard-contact redos               NOT DONE. Footsteps first, on the model
                                            that landed.
    attributed the 19 nodes on the map      NOT DONE. Needs a probe that cannot throw.
    the first sound gate's flake            NOT DONE. Named four rounds running now.

## 4. GATES

    COOKED SOUNDS   128 ok / 0 failed (was 125; 3 new claims from the generic per-recipe
                    loop now that theBroadcast is in H.list())
    --mutate bites 37 claims (wear:0 forced on theBroadcast correctly falsifies the hiss
    lift, drop-out and wow claims and correctly leaves the band/timing/tone claims green,
    because a maintained transmitter still keeps its own band)
    HANDOFF 9/0. DERIVED FRESHNESS 9/1, the one red identical with this work stashed.
    PAGE: slices/BOHEMIA_THE_VALLEY_STILL_BROADCASTS_9_24_26.html, 3 of 3 play, 0 errors.
