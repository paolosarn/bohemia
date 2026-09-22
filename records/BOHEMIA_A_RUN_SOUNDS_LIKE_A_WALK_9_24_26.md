# A RUN SOUNDS LIKE A WALK (9/24/26, SOUNDS lane) -- [footsteps on the beat]
## The row's premise was backwards, and the real bug was next to it

> **THE ROW, coordinator 9/21:** *"the footstep limiter is 0.12 s and a beat is 0.5 s, so
> footsteps may fire four times per ruled step. Measure it with the one driver."*

**Measured. They do not.** They fire **once per beat**, and the row's worry was the opposite
of what is happening.

---

## 1. WHAT THE WALK ACTUALLY DOES, MEASURED IN THE ALPHA

Held the pad in three directions that had room, through the one driver, on the alpha (the
driver says which file it opened, and it said the alpha):

    walked                  320 cells across three directions
    step events posted      355
    footstep sounds heard    19
    events per cell         0.90 to 1.00, so ONE EVENT IS ONE CELL
    one sound every         12 to 25 cells, mean about 17
    silent footfalls        94%
    mean gap between sounds 0.554 s, against a beat of 0.500 s

**One sound per beat.** Not four.

**WHY, FROM THE CODE PATH:** one press walks `STEP_CELLS = 25` cells in a synchronous loop
and posts a step event for every one of them. **The audio clock does not advance inside a
synchronous loop**, so all 25 events see the same `currentTime` and the shell's 0.12 s
limiter lets exactly one through.

> **ONE PRESS = ONE LOT = ONE HOUSE = ONE FOOTSTEP.** That is THE STEP IS A HOUSE law
> working, not a bug. 94% of cells being silent is correct, because a cell is not a footfall.

---

## 2. THE LIMITER IS LOAD-BEARING FOR A REASON ITS OWN COMMENT DOES NOT STATE

```js
if(now - STEP_LAST < 0.12) return;   /* one step per footfall, not per frame */
```

Measured, the frame is not what it is protecting against. The beat already spaces presses
0.5 s apart and 0.12 s would allow **four** per beat, so on that reading the limiter never
fires at all.

**What it actually does is collapse a 25-cell burst into one house-step.** Remove it and
every press would fire 25 footsteps in one instant. It is the most important line in the
footstep path and its comment describes a different job.

That mattered here: **the row's premise came from reading the comment.** 0.12 against 0.5
looks like "four per step" until you find out that nothing is asking for four.

---

## 3. AND HERE IS THE REAL BUG, RIGHT NEXT TO IT

The metronome, once a hold has been going two beats:

```js
let moved=stepOnce(di);
if(running&&moved)stepOnce(di);      // run = two cells per beat
```

**A run is two lots in one beat. Both calls are synchronous, microseconds apart. The 0.12 s
limiter swallows the second one.**

> **A RUN COVERS TWICE THE GROUND AND MAKES THE SAME ONE SOUND.** Running is audibly
> identical to walking.

**TWO INDEPENDENT LINES OF EVIDENCE, and they are stated as two because they are two:**

1. **The code path above.** Two synchronous calls inside one 0.12 s window.
2. **The gap distribution.** A second sound inside a running beat would land about 0.12 s
   after the first. Across **16 measured gaps the smallest was 0.351 s.** Nothing ever
   landed where a running beat's second step would be.

**AND WHAT I COULD NOT DO, SAID PLAINLY:** I could not attribute sounds to individual beats.
The beat lives in the city frame and the limiter lives in the shell, and joining them across
`postMessage` by wall time lost most of the events (13 ticks, 123 events, and my per-beat
join found 7 of them). **That join is named as failed rather than dressed up**, and neither
line above depends on it.

---

## 4. FOUR INSTRUMENTS OF MINE WERE WRONG BEFORE ONE WAS RIGHT

**AND THE FIRST THREE ALL REPORTED THE SAME THING: A DEAD PAD.** That is the reading this
game punishes hardest, because *a dead button is indistinguishable from a close button* is
already a rule on the front page.

    the pad by selector       [data-dir], #pad-e, .pad-e: none exist. The pad is eight SVG
                              <g class="pb"> with pointerdown -> startHold(i).
    the wedge's own box       getBoundingClientRect on an SVG <g> reads 0x0 here, so asking
                              the group where it is gives 0,0 and a press that lands nowhere
    a tap instead of a hold   the pad is a HOLD. A tap is one step by design; SLIDE is the
                              walk feel he ruled for, and that needs the finger held down
    AND THE ONE THAT MATTERED:
    the city was not on screen

**THE ALPHA OPENS ON THE VOTE TAB NOW.** UI shipped his 9/20 landing this round. So
`#cityFrame` measured **0x0**, `#padring` measured **0x0**, `elementFromPoint` on the pad
returned **null**, and a four-second hold moved him **zero cells**.

> **THAT READS EXACTLY LIKE A DEAD PAD AND IT IS NOT ONE. THE PAD WAS NEVER ON SCREEN.**

**FOR EVERY LANE THAT DRIVES THE WALK FROM NOW ON: open the game panel first.** One line,
before anything else:

```js
await d.pageEval(()=>{ const t=document.querySelector('.tab[data-p="run"]'); if(t) t.click(); });
```

After that line: the ring measured 90x90 at (288, 706), the finger landed on a `path.parr`
inside `#padring`, and he walked 52 cells on the first hold.

**AND ONE STALE WARNING OF MINE IS NOW WRONG.** My own handoff has said for three rounds
that *"the one driver takes opts.file and IGNORES opts.alpha"*. Somebody fixed it: the
driver now reads `opts.file || (opts.alpha ? ALPHA : DEMO)`. A stale warning sends the next
round down a path that no longer exists, so it is corrected in the handoff rather than left
to rot.

---

## 5. COOKED THIS ROUND (rule 22): DOES A RUN SOUND LIKE A RUN

The judgement this measurement asks for, as something he can hear. His own approved footfall,
laid out at two cadences:

    A   one footfall a beat, on the beat        what walking does now, and it is right
    B   two a beat, evenly spaced at 250 ms     what running should sound like
    C   identical to A                           what running sounds like now, which is the bug

**It is not a new sound.** It is the cooked footstep this module already holds, at a
different spacing, because the question is about spacing. Three options, which is the most
rule 25 allows. No vote on the page, and his notes save themselves as he types.

**GATED, AND MEASURED FROM THE AUDIO RATHER THAN READ BACK OFF THE RECIPE:** the hits are
located by threshold on the rendered buffer. Walk: 8 footfalls over 8 beats, every gap
0.500 s. Run: 16 footfalls, every gap 0.250 s. **Mutation proven:** force `perBeat` to 1 (a
run that is really a walk, which is exactly the bug in the game) and the run claim goes red
naming *8 footfalls (wanted 16)*.

---

## 6. WHAT THIS DID NOT DO

    changed the game's footstep timing      NOTHING. The fix is one line -- schedule the
                                            run's second step half a beat later instead of
                                            in the same instant -- and it changes what he
                                            hears while walking, which is a play surface
                                            under the rule 18 hold. He picks first.
    touched the limiter                     NOTHING, but its comment now has a record
                                            against it saying what it really does.
    re-cooked the two he voted DOWN         NOT YET, and the reason is in the round before
                                            this one: his notes on those two were lost with
                                            the inner votes, so a re-cook has nothing to aim
                                            at but the school page's rules.

**Gate: COOKED SOUNDS 63 ok / 0 failed, and 11 claims go red under mutation (was 10).**
