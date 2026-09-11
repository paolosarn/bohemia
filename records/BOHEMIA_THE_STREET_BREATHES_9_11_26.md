# THE STREET BREATHES (9/11/26, SOUNDS lane)
## [music owned] THE-MUSIC-ITSELF, round 2

### THE MUSIC NEVER STOPS, AND EVERY SONG IS CUT AT EXACTLY 128 SECONDS

Round 1 fixed WHICH songs can be heard. Round 2 asked the next question and
measured it instead of guessing: over real minutes on the walked street, what
does a player actually hear? A recorder in the page logged every song change.

    DUSK,  6 minutes: 3 changes, TWO distinct songs
        THE WIND LEARNS WORDS -> TWO COINS FOR THE FERRYMAN -> THE WIND LEARNS WORDS
        held for: 128s, 128s
    NIGHT, 6 minutes: 4 changes, 4 distinct songs
        held for: 24s, 128s, 128s
    EVER SILENT: false. Not once, in either phase.

Two facts fall out, and neither one is a tagging question:

1. **THE MUSIC NEVER STOPS.** Twelve minutes of unbroken playing, which would be
   a hundred hours of unbroken playing. There is no air anywhere in it.
2. **EVERY SONG GETS EXACTLY 128 SECONDS**, then the next one begins on the very
   next beat with nothing in between. 128 seconds is the 64-bar pass: the
   engine's loop length, a number about buffers, not a musical decision.

### AND THE THING THAT SHOULD BE IN THE GAP IS ALREADY BUILT AND PERMANENTLY MASKED

This lane spent 9/5 building the ambience bed: 79 districts in four kinds, a lit
block that hums at the grid's own distance, wind, air, the desert speaking every
60 to 130 seconds, an indoor air that swaps the moment you cross a threshold.
**All of it plays underneath a song that never stops.** The quietest and most
place-specific work this lane has done is buried under a wall of music twenty-four
hours a day.

### HIS OWN DEMO FLOW ALREADY CALLS SILENCE AN INSTRUMENT

Not my idea and not a new law. `laws/BOHEMIA_DEMO_FLOW_7_10_26.md`, his own music
mapping, in his own file:

> "WASH: no music or lowest-key ambient — **silence is the calm**"
>
> "on clear + hatch approach: single sting, then silence over the purple.
> **The quiet IS the reveal.**"

The valley is a dead city with the power out. REALISM FIRST: it does not have a
soundtrack running every minute of every day.

### SO THE STREET BREATHES

When a song's pass ends the music rests for ONE PHRASE — 8 bars, 128 steps, 16
seconds at 120 BPM, the same unit CITYMUS already turns its time-of-day pool on
and MENUMUS hands the opening over on — and in that phrase you hear the block you
are standing on. Then the next song starts from its beginning.

### THE REST IS A DUCK, NOT A STOP, AND THAT IS THE WHOLE SAFETY ARGUMENT

`MUS.stop()` clears the scheduler and cuts the master to zero. The engine's own
comment at the combat hook says why that is dangerous, and it was written after
he complained about it: combat swaps the song **in place on the running
transport** and never calls `start()`, so a fight beginning on a stopped
transport would be **silent**. And the 120 BPM LAW is about a clock that does not
stop.

So the transport runs the whole time and only the music master is ducked:

* the beat never stops, so the law is kept and anything can take the music back
  on the next beat;
* the ambience bed is on the SFX bus, not the music master, so it is untouched
  and it is the only thing left;
* nothing has to be restarted.

**AND THE LEVEL IS CAPTURED, NOT TYPED.** The engine's full master is 0.8 and
that literal already exists in two places. A third copy would rot the first time
anybody moved it, so the rest reads the gain it is about to duck and restores
exactly that. If he turns the master down, the rest returns to **his** level.

### I GOT THE ARITHMETIC WRONG, TWICE, AND ROUND 2 IS HOW IT WAS FOUND

Two systems in this lane wanted "one phrase" in milliseconds and both computed

    (128/16) * (60/120) * 1000   ->   4000

That is 8 bars times the length of a **beat**. A bar at 120 BPM in 4/4 is **two
seconds**, so a phrase is **16000**. I wrote it in INTERIORMUS last round and
copied it here, and the copy is how it surfaced: the rest measured 3 seconds when
it was supposed to be a breath.

**INTERIORMUS's door debounce has been running at a quarter of the size its own
comment claimed.** The 15.8-second switch measured in round 1 is real, but it came
from the STEP condition, not from the dwell — so the reasoning was right and the
number under it was wrong. The round-1 record carries a correction saying so.

It is one function now, `phraseMs()`, and it asks `MUS.stepDur()` rather than
doing sums, so the transport owns the tempo and the phrase follows it. The gate
proves that by doubling `stepDur` and asserting the phrase doubles.

**A LANE THAT WRITES THE SAME CONSTANT TWICE WILL GET IT WRONG TWICE.**

### AND THE FIRST CUT PRODUCED A PERMANENTLY SILENT FIGHT

This is the one worth remembering. The first cut ducked the master and relied on
CITYMUS's own `setInterval` to ramp it back. Measured: start a fight during a
rest and **the music never returns**.

`FIGHTMUS.enter()` **clears `CITYMUS.watch`** — it has since 8/19, for good
reasons of its own — which was the only thing that could have undone the duck. A
silent fight, produced by a system whose entire safety argument was "a duck can
be taken back instantly".

> **A REST WHOSE ONLY WAY OUT IS A TIMER ANOTHER SYSTEM MAY DELETE IS A TRAP.**

Fixed two ways, and the first is the floor:

1. **both ramps are booked up front, at absolute times, on the AudioParam.** The
   audio thread brings the music back at the end of the phrase even if every
   timer in the document dies. Measured with `CITYMUS.watch` deleted mid-rest:
   back at **14,737 ms**, unaided.
2. `FIGHTMUS.enter()` also ends the rest, so a fight does not wait out a phrase
   to become audible. Measured: back in **201 ms**. Danger is now.

### MEASURED, END TO END, ON THE REAL SURFACE

    rest length                     16,000 ms asked, 13,4-15,2s observed
                                    (the fades eat the edges)
    master during the rest          0.000
    transport during the rest       still playing, step still climbing
    ambience bed during the rest    air_day, and it still SOUNDS: with the
                                    master at 0.000 the bed rendered on demand
    after the rest                  a DIFFERENT song, master back at 0.8
    fight during a rest             music back in 201 ms, beat alive
    every timer killed mid-rest     music back in 14,737 ms, unaided
    shuffle off mid-rest            no rest state left behind; back on plays 0.8

And in the demo, cut from the same file and checked separately rather than
assumed: `phraseMs` 16000, rest 13,975 ms, master 0.000, beat alive, bed
`air_day`, came back to 0.8 on a different song. Stamp `DEMO - BUILD 9/11g`.

### THE GATE

`gates/street_breathes_gate.py`, registered, **25 claims**. It is mostly about the
ways a duck can strand the master, because that is the failure that matters. The
pass end is **driven** rather than waited for — walking the transport to step 1020
is the same code path arriving sooner, which is the argument the fight music gate
already makes for the same trick, and waiting out real 128-second passes would put
minutes on a suite that has no headroom.

MUTATION PROVED, three ways, each failing differently:

| mutation | result |
|---|---|
| no rest at all, back to the hard cut | 8 failed |
| the way back left to the timer (the silent-fight trap) | 5 failed, including both hazards |
| the quarter-size phrase — **the bug I actually shipped** | 4 failed |

That third row is the one that earns the gate: it would have caught the arithmetic
I got wrong last round.

### THREE INSTRUMENT MISTAKES THIS ROUND, ALL MINE

1. **`(duckedTo or 1) < 0.02`.** A perfect zero — the master fully ducked, the
   best possible reading — is falsy in Python and read as the default 1, so the
   claim failed on a correct build. **This lane has made that exact mistake
   before**, on a peak floor that read a perfect 0 as a missing measurement.
   There are `below()` and `above()` helpers now that never coerce.
2. **I called the chooser and expected sound.** `AMB.pick()` only returns a
   name; `AMB.tick()` is the player. The check reported "0 renders", which reads
   exactly like a bed silenced by the duck.
3. **A test broke the state the next test needed.** The three hazards ran in
   sequence on one page, and the fight test leaves `CITYMUS.on` false, so the two
   after it reported "never saw a rest" — which also reads exactly like a feature
   that does not work. Each hazard puts the state back now.

All three would have reported a bug that was not there.

### RECORDED, NOT ACTED ON

**DUSK and DAWN are the same two songs.** They share one category,
`OVERWORLD DUSK/DAWN`, so the pool is 2 and dawn and dusk are musically
identical. A player crosses both every day of a hundred-hour game. The rest makes
two songs sound like an intention rather than a ping-pong, but two is still two,
and widening it means TAGGING, which is his, in the MUSIC tab.

**SONG 2 IS A FACTION-ONLY THING.** Checked before designing anything around it:
only the 14 faction slots have a second arrangement, all 14 CANON, and combat
already round-robins 1 and 2 per his 7/19 pool clause. No MLOOPS song has one, so
there is no orphaned song 2 to rescue and the street pool cannot be widened that
way. Measured, so the next round does not go looking.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new message, and no new number except the rest length, which is the
engine's own phrase asked of the engine's own tempo.

    python3 gates/bohemia_gates.py --only "STREET BREATHES"

Build 9/11g - THE STREET BREATHES.
