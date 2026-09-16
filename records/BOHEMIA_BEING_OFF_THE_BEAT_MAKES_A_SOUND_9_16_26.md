# BEING OFF THE BEAT MAKES A SOUND (9/16/26, SOUNDS lane)
## [beat teaches] — the other half of his sentence, and two of four bands were silent

> **PAOLO 9/15: "I don't even know how to engage in combat and when that shit starts."**

Last round gave the **start** of a fight a sound. This row is the rest of it: during the
fight the beat must be the loudest clearest thing, and **a swing on the beat must sound
different from a swing off it, carried by sound and not by words.**

---

## THE ROW WAS UNBLOCKED BY SOMEBODY ELSE'S CORRECTION

Last round this lane held this row and wrote down why: EYES reported no fight in five
minutes, so a fight-timing lesson could not be heard. **EYES has since owned that
report as wrong** — six rounds of its walk opened the committed demo file, which nobody
is ever served, and on the surface he plays a fight arrives at about 02:05,
photographed, twice. COMBAT's number was right the whole time.

So rule 12 was applied to my own held row and the named blocker was gone.

---

## CLAIM ONE WAS ALREADY TRUE, AND COMBAT BUILT IT

Six seconds of live fight, every sound path in the frame wrapped:

    49 drum hits in six seconds   a hat every beat, a kick naming beat one, claps

Measured three separate times with three different songs' kits (shakerh/punchk/clap,
sizzle/punchk/clap, wood/thud/clap — the kit comes from the song). **Nothing to do, and
this lane did not rebuild it.**

---

## CLAIM TWO WAS HALF TRUE, AND THE MISSING HALF WAS SILENCE

The fight grades every press into four bands off its own pure function. Driving its own
cue once per band:

    PERFECT   3 notes, root + fifth + octave, rising    peak 0.0939
    GOOD      1 note,  root                             peak 0.0353
    EARLY     NOTHING
    LATE      NOTHING

> **BEING ON THE BEAT SOUNDED LIKE SOMETHING AND BEING OFF IT SOUNDED LIKE NOTHING, SO
> THE ONE THING THE FIRST FIGHT EXISTS TO TEACH WAS THE ONE THING YOU COULD NOT HEAR.**

### AND NOTHING ELSE COVERED THE SWING THAT MATTERS MOST

There *is* a sound when the groove chain breaks. It cannot reach a beginner: the rule is
`(g|0)>0 && !(PERFECT||GOOD)`, so it needs a chain you already have. Measured both ways:
`broke(0,'EARLY')` **false**, `broke(3,'EARLY')` **true**. A player's first press in
their first fight is groove 0, so **the exact moment this row exists for was the one
moment guaranteed to be silent.**

Silence is also the worst teacher available here, for the reason this fleet has now
written down several rounds running: you cannot tell "I was late" from "nothing
happened."

---

## WHAT I REFUSED TO REUSE, AND WHY REFUSING WAS THE RIGHT CALL

`sndMiss()` already exists, already asks the parent for his approved `miss_past` (his
8/15 sweep, 5 of 5), and wiring it here would have been free.

It is wrong. `miss_past` means **the strike found nothing to hit**, and its own comment
says exactly that. Being off the beat and missing a body are two different facts, and one
sound for both is a bug this lane has already shipped and fixed once: on 8/22 QUESTSTING
played `loss` when the player slept with a job unfinished, so **going to bed sounded like
being beaten.**

> **REUSE-FIRST IS NOT REUSE-ANYTHING.**

---

## THE FIX IS ONE BRANCH, AND THE PHONE CHOSE ITS PITCH

My first design was the root **an octave down** and quieter than GOOD, so the wrong press
would read as the runt of the family. Measured, that note is **61.7 Hz** at the shelf's
low root, and **82.4 Hz** on a song a live fight actually drew. A phone barely reproduces
either, and rule 14 makes a phone the only measure of this game.

> **THAT DESIGN WAS A SECOND SILENCE WEARING THE FIX'S CLOTHES — the exact bug being
> repaired.**

The family's pitch **moves with the song** (measured 123.5 Hz at root 45, 164.8 Hz and
523.3 Hz on two live fights), which is precisely why the octave down had to be judged at
its worst case rather than a convenient one.

So the cue sits at the family's own root, in tune with all 142 songs, and is told apart by
**timbre and length** instead of register: a short square buzz where GOOD is a clean
triangle ring.

    GOOD          triangle 0.10 s  g 0.040   peak 0.0364  rms 0.00211
    OFF THE BEAT  square   0.07 s  g 0.040   peak 0.0381  rms 0.00259
    (rejected: the octave below, 82.4 Hz live, peak 0.0215 — a phone's floor)

The ladder anybody can learn in a few presses:

    three notes rising   you nailed it
    one clean note       close
    one short buzz       no

### EARLY AND LATE SOUND THE SAME, ON PURPOSE

The fight plays a metronome on **every beat** (measured, 49 hits in six seconds), so the
player's own buzz lands audibly **before or after a beat they can already hear**. That is
direction heard directly. Coding it into pitch as well would ask them to learn a second
alphabet for a fact already in the air, and the screen prints the signed millisecond
number besides.

---

## WHAT THIS DOES NOT TOUCH, NAMED INSTEAD OF QUIETLY FIXED

The fight is COMBAT's lane and the row asks about a **swing**:

- **THE MOVE VERB.** Spending a step is graded too, and it calls the cue **only when the
  grade is PERFECT**, so an off-beat move stays silent and its chain-break has no sound
  at all where the fire site's does. A different verb, COMBAT's call.
- **THE MIX.** The metronome's own kick renders **peak 0.2687 — 7.6x the GOOD cue and
  2.9x the PERFECT cue.** The player's timing feedback is far quieter than the beat it is
  judged against. That is a real finding, and it is a mix decision across the whole
  fight, so it is reported rather than unilaterally re-levelled by this lane. The new cue
  matches GOOD instead of inventing a louder tier.

---

## AND ONE MORE OF MY OWN TOLERANCES WAS MEASURING MY INSTRUMENT

The gate's level claim first demanded the off-beat peak be at or above the GOOD peak. It
failed by **0.0003, which is 0.8%** — two different decay shapes sampled at 44.1 kHz do
not land on the same peak sample.

> **A TOLERANCE TIGHTER THAN THE INSTRUMENT'S RESOLUTION MEASURES THE INSTRUMENT.**

The peak now carries a stated 5% margin and the claim leans on **energy**, where the
square's harmonics put the cue clearly ahead (rms 0.00259 against 0.00211). That is the
third round running where a claim of mine had to be re-bounded for the same class of
reason, and it is written here so the next one starts from it.

---

## THE GATE: 12 PASSED, 0 FAILED

    a real fight is running and exposes its own grade cue     True
    sound paths are wrapped, so sounds are counted            tone, drumV, sfxAsk
    the grade bands come from the fight, not from this gate    EARLY GOOD LATE PERFECT
    EVERY BAND THE FIGHT CAN GRADE MAKES A SOUND              3/1/1/1, silent: none
    on the beat still differs from off it, by note count       PERFECT 3 vs 1
    off the beat is told apart by being SHORTER, not lower     0.07 s vs 0.10 s, same Hz
    THE CUE IS IN A BAND A PHONE CAN PLAY                     live root 164.8 Hz
    AND IT IS NOT THE NEW SILENCE                             peak 0.0381, rms 0.00259
    the chain could never have covered a first press           broke(0) false, broke(3) true
    the row's FIRST claim holds, a beat runs through the fight  49 drum hits in 6 s
    nothing threw                                             0 page errors
    mutation control: branch removed -> EARLY 0, LATE 0        PASS

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound file, no new
event, no new number — the note is the family's own root, the oscillator is the fight's
own, and the grade is the fight's own.

    python3 gates/bohemia_gates.py --only "OFF THE BEAT HEARD"

Build 9/16 - BEING OFF THE BEAT MAKES A SOUND.
