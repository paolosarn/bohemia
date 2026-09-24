# A RUN NOW SOUNDS LIKE A RUN (9/24/26, SOUNDS lane) -- [footsteps on the beat], round three
## The one-line fix, shipped to the walked surface, and measured on the glass

> **RULED 9/23b (coordinator):** *"the one-line fix (the run's second footfall half a beat
> later) is WALKING, item 2 of the cut, UN-HELD. Ship it; the VOTE item stands for the
> spacing he prefers, and his approved footfall is untouched."*

**AND THE FIRST THING TO SAY IS THAT I WAS WAITING FOR A VOTE I HAD NO RIGHT TO WAIT FOR.**
My own handoff said this fix lands "the moment he picks B on DOES A RUN SOUND LIKE A RUN".
The coordinator had already ruled the opposite on the board, in writing, on the same row:
ship it, the vote stands for the spacing. A ruling on the board beats a plan in my handoff,
and rule 12 says a dependency is a premise and not a gate.

---

## 1. WHAT WAS WRONG, IN ONE LINE

A run covers **two houses in one beat** and made **one footstep sound**.

The metronome takes both lots in the same synchronous tick:

    let moved=stepOnce(di);
    if(running&&moved)stepOnce(di);      // run = two cells per beat

The audio clock does not advance inside a synchronous loop, so both bursts of 25 cells
carry **one** `currentTime`, and the shell's 0.12 s limiter correctly collapsed all fifty
events into one footfall.

> **THE LIMITER WAS NEVER THE BUG AND IT IS NOT LOOSENED.** One press walks 25 cells and
> posts a footfall for every one; collapsing that burst into one house-step is the whole
> reason 0.12 s is load-bearing, and it is THE STEP IS A HOUSE working. What was missing is
> that a run is TWO house-steps, and one clock cannot tell them apart when both arrive in
> the same instant.

---

## 2. THE FIX, AND WHY IT IS IN TWO FILES

**The shell cannot see it from outside.** The frame that took the two steps is the only
thing that knows which house it is on, so it says so: `lot: STEP_LOT` on the footfall
message, set to 2 around the second `stepOnce` in a `try/finally` so a throw cannot leave
the label on and make every walking footfall late.

The shell then keeps **one limiter clock per house**, so lot two's own 25-cell burst
collapses on its own clock instead of being eaten by lot one's, and books its footfall
**half a beat later**, derived from the transport (`MUS.stepDur() * 2`) and never typed, so
the 120 BPM law carries it if the tempo ever moves.

    what did NOT change
      MOVEMENT          both lots are still taken on the same beat, exactly as before
      THE SLIDE         __WALK_FEEL_SLIDE__ still glides across both cells. SLIDE is his
                        9/21 ruling and it is ANIMATION's, so it is untouched
      HIS FOOTFALL      his approved sound vectors are byte for byte the same
      WALKING           lot 1 keeps STEP_LAST and the 0.12 s test unchanged, so a walk is
                        the same code path it has always been

---

## 3. MEASURED ON THE REAL SURFACE, THROUGH THE ONE DRIVER, ON THE ALPHA

Eight held presses, one per direction, 6 s each, on a 390x844 phone profile over http.
The alpha opens on VOTE, so the RUN tab is pressed first, which is the trap that made three
instruments of mine report a dead pad last round.

    direction  beats held   cells   footfalls (1st + 2nd house)   second-house gaps
    N              10         123          5  +  2                0.25  0.25
    NE             12          52          3  +  0                (nothing moved twice)
    E              12           0          0  +  0                (a wall)
    SE             10         514         12  +  8                0.25 x 5
    S              13          80          5  +  2                0.25  0.25
    SW             12         108          4  +  1                0.25
    W              12           0          0  +  0                (a wall)
    NW             12         632         13  + 10                0.25 x 7
    TOTAL                    1,509        42  + 23                every gap 0.250 s

> **EVERY SECOND-HOUSE FOOTFALL IS BOOKED 0.250 s AFTER ITS PARTNER, 17 OF 17 MATCHED
> PAIRS, MINIMUM AND MAXIMUM BOTH 0.250.** A beat is 0.500 s. Before this round the
> smallest gap between any two footfalls in a 320-cell walk was 0.351 s, which is what "no
> second footfall exists" looks like from outside.

**AND THE EIGHT LEGS ARE ONE WALK, NOT EIGHT TESTS.** Each hold started where the last one
ended, so this is one continuous 1,509-cell walk in eight legs. The two zero rows are not a
verdict on those compass points from a fixed spot.

**23 SECOND-HOUSE FOOTFALLS AGAINST 42 FIRST-HOUSE ONES, AND THE GAP IS NOT A DEFECT.**
`running` needs two beats of hold before it turns on, and after that the second `stepOnce`
can be blocked by a wall one lot further on while the first one moved. A blocked lot posts
nothing, correctly. Six of the 23 had no first-house partner inside 2 ms, which is the other
side of the same coin: on a stalled beat the first house can be refused by its own limiter
while the second house's clock is clear.

**AND ONE NUMBER THAT IS NOT MINE, FOR RUN:** across 23 beats of holding east he covered 52
cells and then stopped against something, which is the break already on the list (his own
block has no straight walkable way out). On this walk the ways that moved him at all were
NW 632 and SE 514; two of the eight moved him zero.

**AND MY FIRST INSTRUMENT READ THE WRONG FIELD AND SAID HE HAD NOT MOVED.** It read
`city.x`, which is the CITY-mode coordinate; the walked position is `hx`,`hy`. It printed
"cells: 0" on a walk that was really happening, and the only reason I did not believe it is
that footfalls were being booked at the same time. **A ZERO FROM AN INSTRUMENT IS A CLAIM
ABOUT THE INSTRUMENT UNTIL SOMETHING ELSE AGREES WITH IT.**

---

## 4. WHAT THE GATE HOLDS, AND IT IS SOMEBODY ELSE'S GATE ON PURPOSE

`gates/footstep_gate.js`, the suite's own footstep gate, **14 passed / 0 failed before this
round and 24 / 0 now.** Seven new claims: three on the source (the shell knows which house,
it keeps a clock per house, half a beat is derived from the transport), two on the walked
frame (it says which house, and a run labels its second), and four measured in a real
browser on the shipped player.

**AND THE MEASUREMENT IS TAKEN THE WAY THE BUG HAPPENED:** a synchronous 25-call burst for
the first house, then 25 more for the second, in one tick. Nothing is polled; `stepSfx`
records what it booked on the audio clock and the gate reads that, because this lane has
twice written down that a polling meter cannot see the window it measures.

> **AND THE FIRST CUT OF THAT TEST REPORTED "1 HEARD" ABOUT A BUILD THAT MAKES TWO.** It
> took the walk sample and the run sample in the same instant, so the walk's own footfall
> had already set the first house's clock and the run's first house was correctly refused.
> The limiter is a real 0.12 s of audio-clock time; two samples have to be separated by
> more than that, which is what the beat itself does in the game.

> **AND THE SECOND CUT WAS 11.6 ms WIDE AND THE COOK WAS THE WHOLE DIFFERENCE.** The first
> call for a surface cooks five variants, which costs real milliseconds while the audio
> clock keeps running. Now the pool is warmed first, which is the state the game is in by
> the second step of the first walk, AND the drift is subtracted and printed rather than
> hidden, with its own claim that the two houses are booked in the same instant.

---

## 5. WHAT THIS DID NOT DO

    touched his footfall sound       NOTHING. The verdict is on the SOUND; this is spacing.
    touched the slide                NOTHING. Both lots still land on one beat and the
                                     glide still crosses both. SLIDE is his ruling and
                                     ANIMATION's row.
    loosened the limiter             NOTHING. 0.12 s is unchanged and load-bearing.
    changed walking                  NOTHING. Lot 1 is the same code path, byte for byte.
    decided the spacing              NOTHING. DOES A RUN SOUND LIKE A RUN is still in the
                                     VOTE tab with three options; what shipped is the
                                     option the coordinator ruled, and he can knock it
                                     down there.
