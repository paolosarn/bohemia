# A FIGHT STARTING MAKES A SOUND (9/15/26, SOUNDS lane)
## [music owned] — the sound half of his own sentence, measured before anything was built

> **PAOLO 9/15, his second play of the demo: "I don't even know how to engage in
> combat and when that shit starts."**
>
> EYES E26 round 6, the same round, item 3: 55 fight words exist in the demo and a
> player can read ZERO of them.

The words half went to COMBAT. This is the sound half, and the answer turned out to
be simpler and worse than expected.

---

## THE MEASUREMENT: THREE FUNNELS, AND A CONTROL WINDOW

Nothing here is a grep. Three taps were put on the running alpha at once, each one
the single place its kind of sound must pass through:

    BOH_SFX.render   every one-shot in the game goes through it
    STING.play       the musical markers
    MUS.cur          a property setter, so every song change names its writer

Then an 8-second **control window** on the street with nothing pressed, then a real
street fight through the shell's own `cityEncounterIn`, then the same 8 seconds
again. The control is the point: without it, "the fight made no sound" is a claim
with nothing to be wrong against.

    CONTROL   song SLOW BLEED    0 stings   1 one-shot (a phone buzzing)   master 0.8

    FIGHT     the fight starts at 8.13 s
              9.378 s   MUS.cur -> BLUES -> CARTEL   (the faction pick, two writes)
              0 STINGS. 0 ONE-SHOTS. master 0.8 before, 0.8 after.

> **THE WHOLE AUDIBLE TELL THAT A FIGHT HAD BEGUN WAS THAT THE SONG WAS A DIFFERENT
> SONG, 1.25 SECONDS LATE, MID-PHRASE, AT THE SAME VOLUME.**

Which is what the street's own shuffle does by itself every 128 seconds. A player
who was not watching the camera pull back heard a shuffle.

---

## AND THE ASYMMETRY IS THE FINDING

The **end** of a fight has had a sting since 8/19 — `win` and `loss`, landing on the
next beat, played over the running score. So does getting paid, missing a job,
finishing a job, and taking one. Six figures for six moments:

    taken   you commit        root -> FOURTH, rising, unresolved
    paid    you get paid      root -> fifth,  rising, settled
    missed  you let it go     fifth -> root,  falling
    done    you finish it     IV -> I, plagal
    win     you won           rising, and it keeps rising
    loss    you died          falling, and it lands heavy

> **WE SCORED EVERY OUTCOME AND NEVER SCORED THE CAUSE.**

Not one of the six is the moment the danger arrives.

---

## THE FIX IS ONE FIGURE AND ONE CALLER, AND IT COOKS NOTHING

`STING` already does every hard part: it has **no key of its own** (it reads the root
of whatever is playing and builds from intervals consonant in every scale in the
file, which is why no figure has a third in it), it lands **on the next beat** rather
than the raw instant, and it owns its **own bus**, so ducking the music master can
never swallow it. A seventh figure joins the family:

    fight   IT IS STARTING    the root struck low, then the same pitch class an octave up

**The figure is the root and nothing else, on purpose.** An alarm is made by ATTACK
and REGISTER, not by dissonance — and dissonance is forbidden here anyway, because a
tritone written once is out of tune with almost all of 142 songs. The root is the one
pitch that cannot be wrong in any key. Two beats, one second at 120 BPM, **rising**,
which is the opposite of `loss` and means this is not over.

The caller is `FIGHTMUS.enter()` — this lane's own module, and the single place the
shell learns a fight has begun (`startEncounter` calls it for a walked-into party, a
quest fight and the cold open alike). It already carries `if(this.on)return;`, so
once per fight, and STING's own `GAP:2500` means two fights in a row cannot burst.
**Nothing in combat's code is touched.**

**WHICH ROUTES ARE MEASURED AND WHICH ARE READ, said plainly rather than claimed as
one thing.** The **street** route is measured live: a fight through the shell's own
`cityEncounterIn` schedules the notes, and the gate re-measures it every run. The other
routes are **read, not measured**: `startColdOpen(onEnd)` is one line that returns
`startEncounter(coldOpenSpec(onEnd))`, and the call into `FIGHTMUS.enter()` sits
unconditionally inside `startEncounter`'s body, so a quest fight and the cold open reach
it by construction. That is a structural read of one function, not a walk, and it is
written down as such instead of being folded into the measured claim.

### THE VOICE WAS PICKED BY NUMBER, the way `done` picked `bell` on 8/20

Sixteen candidates rendered through the **real synthV** offline, four numbers each:

    taiko          peak 0.450  rms 0.049  attack 0.0030 s  body 0.151 s   <- chosen
    timpani        peak 0.384  rms 0.045  attack 0.0016 s  body 0.181 s
    subboom        peak 0.360  rms 0.039  attack 0.0209 s  body 0.151 s
    taiko2         peak 0.417  rms 0.031  attack 0.0008 s  body 0.079 s
    heartbeatsub   peak 0.160  rms 0.017  attack 0.0168 s  body 0.143 s
    ironheart      peak 0.154  rms 0.032  attack 0.0299 s  body 0.240 s

His complaint is that the moment is MISSABLE, so attack and level are the only two
axes that matter, and `taiko` has the fastest attack of anything that also has level
and body. **The two that lost on numbers are the two I wanted on feel:**
`heartbeatsub` and `ironheart` are the body rather than the world, which is the right
idea — the tell should be your own adrenaline, not a machine somebody built — and
they are 2.8x quieter with an attack ten times slower. They would have been missable,
which is the bug. A struck drum also needs no source in the fiction: his own sound
law asks for ethnic instruments for place and a drum machine on a battery, while an
air-raid siren would have been a machine this valley does not have.

---

## AND THE FIRST VERSION OF THIS FIGURE CLIPPED

Caught by measuring it, not by reading it. I wrote the second hit as the root **and
the fifth together**, for size. Rendered through the real synthV, the two notes land
on the same 16th step and **sum**:

    root + fifth on one step (the first cut)   peak 0.9338   into a 0.8 master
    root twice, bare                          peak 0.4468
    ROOT THEN OCTAVE UP, sequential           peak 0.4681   <- chosen
    root, octave, then fifth                  peak 0.4633
    the same at g 0.22                        peak 0.3875

    for scale: done 0.3769, loss 0.3590, win 0.2171, taken 0.1244

0.9338 is 2.5x the loudest figure the family had. The chosen figure is the **loudest
by peak** (1.24x `done`) and **not the densest by rms** (0.0386 against `loss`'s
0.0565), which is exactly what an alarm is: the attack carries it, not the weight.

> **TWO NOTES THAT SUM ARE ONE LOUDER NOTE**, and the fifth I wanted for size was
> decoration against the principle I had written two lines above it.

---

## THREE MISTAKES IN MY OWN INSTRUMENTS, EVERY ONE CAUGHT BY A CONTROL

**1. A grid read at a different time than the event is a different grid.** The first
beat-alignment check read `MUS.nextT` and `MUS.step` 400 ms *after* the notes were
captured, and reported all three notes 60 ms off the beat. Recomputed from the
reading taken at the same instant as the fight call, the notes sit at exactly 1.000
and 2.000 beats off the anchor. **They were never off the beat.** The gate now reads
the grid and fires the fight in one evaluate, and prints 0 ms.

**2. A tolerance tighter than what the instrument contains measures the instrument.** One
claim asserted the distance from a wall clock, read before the call, to the note's
scheduled time, and demanded it be under one beat. That number contains the engine's
scheduling lookahead and the round trip out of the browser, so it grew under load: the
claim went **red in the pack and green run alone**, which means it was measuring the box.
It is re-bounded inside the transport's own frame — `STING.when()` can only add 0 to 3
steps to `nextT`, so the ceiling is three steps, arithmetic no load can move — and the
wall-clock figure is printed, never asserted.

**3. A control that runs after the reading it is meant to falsify controls nothing.**
The gate's mutation run deletes the figure at runtime and demands every sound claim
go red. It failed on one claim — "the fight sting joins the sting family" — and the
reason was mine: the gate read the family list *above* the line that applies the
mutation. The mutation control caught a bug in the mutation control's own harness,
which is the whole reason it exists.

---

## THE GATE: 13 PASSED, 0 FAILED

    the street owns the music before anything is measured        True
    synthV is wrapped, so notes are counted and not asked for    True
    the fight sting joins the sting family                       win,loss,paid,done,missed,taken,fight
    a street fight really started                               FIGHTMUS.on=True CITYMUS.on=False
    THE CONTROL WINDOW IS SILENT of this voice                   0 taiko notes of 16 in the window
    THE START OF A FIGHT SCHEDULES NOTES, counted at synthV       2
    every note lands ON THE BEAT of the transport grid            off by [0, 0] ms
    the first hit lands on the NEXT beat the transport has         125 ms past the next
                                                                  booked step, ceiling 375
    it RISES, which is what loss does not                        semitones [-14, -2]
    it is the loudest figure in the family                        0.4491 vs 0.3769
    AND IT DOES NOT CLIP                                         ceiling 0.6030, master 0.8
    nothing threw                                                0 page errors
    mutation control: figure deleted -> 0 notes scheduled        PASS

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new
event, no new number — `taiko` is a voice the rack already had, the beat is the
engine's own, and the bus, the root lookup and the quantisation are all STING's.

    python3 gates/bohemia_gates.py --only "FIGHT START HEARD"

Build 9/15 - A FIGHT STARTING MAKES A SOUND.
