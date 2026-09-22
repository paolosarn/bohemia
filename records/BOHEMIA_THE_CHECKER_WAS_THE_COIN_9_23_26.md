# THE CHECKER WAS THE COIN, NOT THE GAME (9/23/26, SOUNDS lane) -- [seeded gate]
## And the fight's song was being picked four times

> **THE ROW, coordinator 9/22: "three runs on one unchanged tree gave a fail, a different
> fail and a pass; the gate is non-deterministic and its red has sat in the fleet's count as
> a fact. Seed the pick or state the claims over a sample. FIRST LINE, before the next cook,
> because a checker that lies is worse than none."**

---

## 0. FIRST, A CORRECTION TO MY OWN LAST HANDOFF

Last round I wrote: **"PROVEN: four runs on one tree, 48/0 four times identical."**

That was luck, not proof. Five runs this round, on one unchanged tree, same box:

    RUN 1   46 passed, 2 FAILED
    RUN 2   48 passed, 0 FAILED
    RUN 3   48 passed, 0 FAILED
    RUN 4   48 passed, 0 FAILED
    RUN 5   48 passed, 0 FAILED

**One in five.** Four identical runs is exactly what a 20% coin looks like most of the time.
FOUR RUNS IS NOT A SAMPLE, and last round's line should have said so instead of reading four
greens as a fix. That is the lesson, and it is the same shape as the coordinator's own note
on the row: a control has to be strong enough to fail.

---

## 1. NEITHER OF THE ROW'S TWO REMEDIES WAS THE ANSWER, AND MEASURING SAID WHY

The row offered two: **seed the pick**, or **state the claims over a sample**. I did the
second last round and it did not hold. Before doing the first, I asked what the claims were
actually asking. Both flaky claims compared **a song title to a title read 4,000 ms earlier**:

    "the streets do NOT take the music back 64 bars into a fight
     (fight song ANARCHISTS, after the pass CARTEL)"
    "leaving a fight is not a CUT ... (MENU - DEAD VALLEY DAWN x5)"

> **A CLAIM THAT ASSERTS A PROXY CANNOT NAME A CAUSE.** "The streets took the music back" is
> not a fact about a song title. It is a fact about whether the street shuffle RAN. Five
> systems in this shell can move that title, so a red printed two titles and left the reader
> to pick one of five stories. Both reds above are consistent with the game being perfectly
> correct.

So the instrument came first: **wrap the real entry points** (`CITYMUS.startShuffle`,
`CITYMUS.play`, `MENUMUS.handOff`, `INTERIORMUS.takeOver`, `INTERIORMUS.handBack`,
`FIGHTMUS.leave`) **and put a property setter on the song index itself**, so a sixth system
nobody thought of is caught too. Nothing stubbed, nothing prevented, every real function
still runs. Then ten runs, and wait for a red to explain itself.

**RUN 8 WENT RED AND THE LOG ANSWERED IN ONE SCREEN:**

    +2378 ms   61 -> 7    TRADES       fight true   city false   <- combat's faction post
    +2379 ms    7 -> 10   REMNANTS     fight true   city false   <- combat's faction post
    +2855 ms   10 -> 7    TRADES       fight true   city false   <- combat's faction post
    +2856 ms    7 -> 3    ANARCHISTS   fight true   city false   <- combat's faction post
    +15675 ms   3 -> 138  MENU - THE POWER STILL ON SOMEWHERE    fight FALSE  city TRUE
                          at CITYMUS.play <- CITYMUS.startShuffle <- FIGHTMUS.leave's watchdog

**Two causes, both the checker's, and one real game defect underneath.**

---

## 2. CAUSE ONE: THE FIGHT'S SONG IS PICKED FOUR TIMES, AND THE GATE SAMPLED IN THE MIDDLE

Three cold boots, timestamps of combat's faction posts measured from the fight starting:

    run 1   +5460 REMNANTS   +5461 CARTEL     +6113 MOB       +6114 VOLUNTEERS
    run 2   + 852 MOB        + 853 CARAVANS   +1529 COLORFUL  +1530 HOMELESS
    run 3   +4211 VOLUNTEERS                  +4698 COLORFUL  +4699 NETWORK

**Four posts every time.** Two pairs a millisecond apart, the pairs about 650 ms apart, and
the whole burst landing anywhere between **0.85 s and 6.1 s** after the fight begins.

**The gate read its reference title at a flat 4,000 ms.** On run 1 that is before the first
post, so the reference it captured was the STREET's song, because the fight had not been
given one yet. On run 3 it lands between the pairs. Every claim downstream compared two
samples of a value the game was still moving.

> **A FIXED WAIT IS NOT AN EVENT.** That sentence is already written twice in this same gate
> file, by whoever fixed the neighbouring claims for exactly this reason, and this was the
> third one still on a sleep.

**THE CAUSE IS FOUR CALL SITES, NOT A BUG IN ANY ONE OF THEM.** The combat module calls
`pickRandomFaction()` from `setupCombat`, `newEncounter`, `startGame` and its own module
init. Each re-rolls `Math.random()` and reports. Every one of those calls is right for the
thing it does. What is wrong is that **a re-roll of the FLOOR PALETTE is also a re-roll of
the SONG**, and nothing said a fight only gets one.

---

## 3. THE REAL DEFECT: THE SCORE LURCHED THROUGH THREE SONGS WHILE HE WAS BEING SHOT AT

The transport reads the current song every step, so each of those writes is audible inside
125 ms. **Four picks means the fight's music changes three times in the first six seconds of
every fight.**

**FIXED ON THE SHELL'S SIDE, AND THAT IS DELIBERATE.** Combat uses that index for its floor
palette as well, and the palette is not this lane's to move. The same reasoning already put
the scratch-patch redraw on this side of the message. So: the **first** pick of a fight is
the fight's song, later posts are counted and ignored, and the latch is cleared by
`FIGHTMUS.enter()` -- which already carries `if(this.on)return`, so two fights inside the
cooldown stay ONE musical event exactly as that file already promises, and a genuinely new
fight still gets its own song.

    ONE FIGHT IS ONE SONG    writes to the song index during a fight:  4  ->  1
    later picks swallowed    reported by the gate, so if combat ever stops
                             double-reporting the number drops and nothing breaks

---

## 4. CAUSE TWO: A POLLING METER CANNOT SEE THE WINDOW IT MEASURES (THIS LANE, TWICE NOW)

The second claim asserted that for **2 s** after a fight ends the song was never cut. In run
8 the song changed at **+15,675 ms** by the page's own clock -- from `FIGHTMUS.leave()`'s
phrase watchdog, which is the designed, correct behaviour, one phrase after the fight ends.

It landed **inside** the claim's window anyway. Under load, each reading is a round trip out
of the page, and the round trips ARE the window: five reads meant to span 2 s spanned
something like 8. **The claim said two seconds and measured eight.**

> This lane already wrote that sentence down once this cycle, about a polling meter that
> reported "first sound 84 s after the tap" when 84 s was its own first sample. Same mistake,
> different instrument. **The page's own clock is the only honest ruler for a window inside
> the page.**

So the new claims are stamped with the page's clock and the page's own fight flag, and the
`city` reading is printed as evidence and never asserted on, because a reading taken over a
round trip cannot be load-independent.

---

## 5. WHAT THE GATE ASKS NOW

    was          compare a song title to a title read on a fixed 4,000 ms sleep
    is           WAIT for the fight's song to arrive and then for 1.5 s of quiet, bounded at
                 20 s, and RECORD whether it ever settled -- so a claim can say it did not
                 observe instead of accusing the game
    was          "the title did not change" (five systems can change it; a system that
                 reached in and re-picked the SAME song passed)
    is           "ZERO calls to the street shuffle or the room while the fight owned the
                 music", counted on wrapped real functions, and a red PRINTS THE CALLER,
                 THE MILLISECOND AND THE STACK
    was          "the title after the fight matches the title before" at one instant
    is           "no swap AND no restart in the 2.8 s after the end", by the page's clock,
                 with a re-pick of the same song counting as a cut, because the song audibly
                 jumps back to its first bar
    new          "the fight was GIVEN a song, and the gate waited for it"
    new          "ONE FIGHT IS ONE SONG: set once, not re-rolled"
    new          "the loading screen said it was ready before the door was tapped", added after
                 main moved mid-round and five claims went red because the gate was opening the
                 alpha as a local file, where the door can never open at all

**BOTH NEW CLAIMS ARE PROVEN BY MUTATION, not by a green:**

    latch removed from the shell          -> FAIL "ONE FIGHT IS ONE SONG ... (2 writes)"
    the original 8/19 mid-fight bug back  -> FAIL "nobody reaches into a fight for the music:
    (CITYMUS stand-down deleted)              1 calls ... REACHED IN: CITYMUS.play at
                                              +2969 ms, step 1024, at obj.play ..."

The second one is the point of the whole round: **the red names its own cause.** The old
claim, on the same mutation, would have printed two song titles.

---

## 6. AND THE MENU SONG MYSTERY, SINCE IT SAT IN A RED FOR A WHOLE ROUND

"MENU - DEAD VALLEY DAWN" appearing after a fight looked like the opening coming back from
the dead. It was not. **Menu songs are in the street shuffle's pool.** Run 8 caught the same
thing happening with MENU - THE POWER STILL ON SOMEWHERE, chosen by `CITYMUS.play` with the
stack to prove it. The streets coming back with a dawn song one phrase after a fight is the
game working.

Two other suspects were checked and cleared by measurement, not by reading:

    INTERIORMUS reaching in on the way out ... its busy() guard only binds going IN, which IS
                                              a hole, but menuOnes in its pool measured EMPTY
                                              and the room never took over in 40 s because the
                                              city re-posts `inside` every 4 s. NOT the cause.
                                              Named here so it is not re-hunted.
    the city's MUSIC button ................. line 10616 obeys `bohemiaCityMusic` with no
                                              fight guard at all. Real, and only reachable by
                                              a tap in the dev tray, which no run made.

Neither is asserted here. Both are on this lane's handoff as named-not-fixed.

---

## 7. WHAT THIS DID NOT DO

    pushed a cooked sound into the walked street or the fight ... NOTHING (rule 22b)
    weakened any assertion ..................................... none; three got stricter
    seeded Math.random ......................................... NO, and on purpose: the new
                                                                 claims do not depend on WHICH
                                                                 song is picked, so a seed
                                                                 would have bought nothing and
                                                                 cost the scratch-patch claim
                                                                 its fresh 200-draw sample
    touched combat's module .................................... nothing; the palette is not
                                                                 this lane's to move

**Gate: FIGHT MUSIC 51 passed / 0 failed** (48 before, plus the two new claims and, after main
moved under this round, a third: *the loading screen said it was ready before the door was
tapped*. That last one, and the http server behind it, are their own record:
`records/BOHEMIA_EVERY_GATE_THAT_OPENS_THE_ALPHA_AS_A_FILE_IS_BLIND_9_23_26.md`, because the five
reds it explains looked exactly like a music regression and were not one.)

---

## 8. AND THE SAMPLE, STATED HONESTLY, BECAUSE THAT IS THE WHOLE LESSON OF THIS ROUND

Twelve runs of the rebuilt gate came back green: four on the pre-rebase tree, six more on the
tree before main moved, and **six for six at 51/0 on the tree that actually ships, served over
http with the door wait in place.** **That is not proof on its own, and section 0 is why:**

    P(12 greens in a row | it is still a 20% coin) =  6.9%
    P(10 greens in a row | it is still a 20% coin) = 10.7%
    P( 6 greens in a row | it is still a 20% coin) = 26.2%

Six greens in a row would happen more than a quarter of the time on the OLD gate, and last round
I read four greens as a fix on exactly that arithmetic. **What makes this round different is not the count, it is that
the mechanism is named and removed:** the reference is no longer read on a sleep, the claims no
longer depend on a title five systems can move, and the window is no longer measured with the
round trips that define it. Both new claims fail on demand under mutation.

> **THE HONEST SENTENCE: the cause is identified and fixed, and twelve green runs are consistent
> with that. Twelve green runs alone would not be.** If this gate flakes again, the log now prints
> the caller, the millisecond and the stack, so the next round starts from a cause instead of
> from two song titles.

---

## 9. AND THE STRICTER CLAIM IMMEDIATELY CAUGHT A REAL HARD CUT

The rebuilt claim 4 asks for no swap **and no restart** in the 2.8 s after a fight ends, by the
page's own clock. On the tree after main moved it went red, and printed its own cause:

    SWAPPED to TWO COINS FOR THE FERRYMAN at +7351 ms
      at CITYMUS.play <- CITYMUS.startShuffle <- FIGHTMUS.leave's watchdog

**The streets took the music back 0 ms after the fight ended.** A hard cut, which is the one
thing that transition is asymmetric in order to avoid: *"leaving a fight is not an emergency and
a hard cut back to calm reads cheap."*

The watchdog waits for the next phrase, with one escape:

```js
if(s>=at||s<from){ ... CITYMUS.startShuffle(); }
```

The `s<from` half is **right** for the reason its own comment gives: a song change resets the
step counter to zero, so a wrapped clock has arrived. It is also true of something else
entirely. `__THE_BEAT_BEFORE_THE_SONG__` zeroes `MUS.step` whenever the transport falls more
than a quarter second behind, **which is every stutter on a phone.** Same symptom, opposite
correct answer: a re-anchor is not a phrase ending.

> **ONE CONDITION CANNOT TELL TWO CAUSES APART.**

**AND THE FIX WAS ALREADY WRITTEN DOWN IN THE SAME FILE, BY SOMEBODY WHO HIT THIS EXACT WALL.**
`INTERIORMUS` waits on a phrase too, and its comment says why it needs a second condition:

> *"THE DWELL is the debounce, and it has to be SEPARATE because of that wrap rule... Wall time
> cannot be wrapped, so one phrase of it is a promise the step counter cannot break."*

So the fight's hand-back now needs the step condition **and** one phrase of wall time, measured
with `phraseMs()` -- the engine's own unit, already shared by the street's rest, the drum hold
and the room's own wait, so no new number enters the game.

    the escape                 s >= at || s < from          (unchanged, still right)
    the floor                  Date.now() - since >= phraseMs()   (16,000 ms at 120 BPM)
    both, or it does not hand back

**That defect was in the game before this round and no claim could see it**, because the old
claim compared two song titles and a re-pick that happened to land on the same title passed.
The stricter claim found it on its second day of existence.
