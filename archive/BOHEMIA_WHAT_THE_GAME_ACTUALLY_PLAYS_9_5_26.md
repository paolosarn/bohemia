# WHAT THE GAME ACTUALLY PLAYS (9/5/26, SOUNDS lane)

VAMILY line: **[unused sounds] THE-OTHER-51**, brief: *"give every approved sound
a caller on the walked surface; 51 of 65 have none; no new cooks."*

**STATUS: CONTINUING.** The census is built and green; the wiring it points at is
not done. Front page rule 6: *"a half-done job marked SHIPPED is worse than an
open one."*

## THE NUMBER IN THE BRIEF CAME FROM A GREP, AND A GREP CANNOT ANSWER THIS

EYES AND EARS proved it the expensive way in E4 the same round:

> A text search said 50 events are never called. A better search said 56. **Both
> are wrong**: the footstep caller builds its event name by concatenation
> (`'step_' + surface`) and three call sites pass a variable, so a name assembled
> at run time is invisible to every grep ever written.

And this lane's own census in `silent_moments_gate` is the *looser* kind, and says
so in its own comment: *"the id appears as a string in the game code... looser
than a call-site match, and far closer to true than one."* Looser is not true
either — an id sitting in a table, a comment or a dead branch reads as called.

## SO THE GATE PLAYS THE GAME AND COUNTS

`gates/every_sound_is_reachable_gate.py` wraps the one hook nothing can route
around — `BOH_SFX.render` — for liveness, records names at `playSFX`, at the
ambience bed's own `pick()`, at `STING.play` and at the messages the walked city
posts, then drives what a player reaches: the walk, the door, the phone, the bed
at day / at night / indoors, and the clock.

**And it proves the audio engine was RUNNING for every sample first.** That is the
check EYES' first run could not make, and they refused to publish a headline
without it, correctly: a zero measured on a dead engine is a statement about the
harness.

**MEASURED, audio alive for every sample, 144 renders:**

    step_dirt      115     air_night       14
    air_day         53     time_pass        6
    air_inside      40     door_drag        4
    wind_gust       13     step_concrete    2
                           ui_tap           2

**Nine of sixty-five.** Fifty-six carry a written reason this drive cannot reach
them — a fight, a verb, a payday, a night slept through, a ground you happen not
to be standing on, or a sibling pool that is drawn from inside its parent by
construction. Those boundaries are named in the gate, not waved at.

## FOUR INSTRUMENT MISTAKES, ALL MINE, AND EACH ONE WAS A REAL DEFECT

1. **The instrument moved the thing it was measuring.** The first drive walked 200
   blind steps and *then* sampled the bed, and reported `air_inside` forty times
   on what looked like a street. The game was right: 200 steps cycling four
   directions in a suburb walks you through a door, and the player really was
   indoors. The bed is sampled before anything can move him now.
2. **A gate that under-waits writes its own excuse list.** `time_pass` was on the
   "cannot drive" list because I advanced the clock and looked 1.2 seconds later
   — before the four-second heartbeat that carries the clock had been sent. It is
   reachable, and it now has its own claim.
3. **A hook that misses a path is a gate that invents an excuse.** `strikeHours`
   calls `BOH_SFX.render` **directly** and never goes through `playSFX`, so the
   name recorder is blind to the hour chime. The shell keeps a per-call ledger for
   exactly this question, so the gate reads that instead.
4. **A check that reads its own copy of the answer is not a check.** While fixing
   the hum gate's distance claim I published a *second* function computing the
   same distance — and a mutation that changed the real one in `tick()` left the
   published one agreeing with itself: **20 passed on a build where every live
   circuit sounded the same distance away.** There is one formula now, `tick()`
   calls it, and the mutation goes red.

## AND THE HUM'S DISTANCE IS NOW CHECKED AS A NUMBER, WITH A PRECEDENT

Four attempts to measure it as loudness each turned up a real defect: the
master's brickwall limiter squashing both ends to one ceiling; candidate variance
(`placeSound` draws a random candidate and two of his differ by more than a block
does); long tails bleeding from one play into the next window. The fourth still
could not separate one block from three.

The shell already solved this exact problem once, for the room transform, and
says so: *"measuring the room by playing playSFX twice proves nothing."* So the
game's own computed distance is asserted exactly, and **whether a hum is audible
at all is still measured on real audio.** That is not a retreat from measuring
pixels; it is measuring the quantity that can be measured, and saying which is
which.

## THE GATE

`gates/every_sound_is_reachable_gate.py`, 10 claims.

    A  the city stops posting footsteps   -> RED (names step_dirt, step_concrete)
    B  the hour chime never strikes       -> RED x2
       restored                              10 passed, 0 FAILED

## WHAT IS LEFT, WHICH IS THE REST OF THIS JOB

The honest orphan list is now small and known. The next rounds take the events
whose moment demonstrably exists and wire them, and write a reason for the ones
whose moment does not — the same discipline `boss_here` and `power_on` already
carry. What will **not** happen is a wire invented for a moment that does not
exist, which is what "give every approved sound a caller" would mean if taken
literally.

Tab: **RUN** (the walked city). Nothing to judge — no sound was cooked.
