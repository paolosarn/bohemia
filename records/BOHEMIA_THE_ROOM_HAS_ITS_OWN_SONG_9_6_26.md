# THE ROOM HAS ITS OWN SONG (9/6/26, SOUNDS lane)
## [music owned] THE-MUSIC-ITSELF, round 1

### 82 SONGS HE THUMBED CANON PLAY NOWHERE IN THIS GAME

The row hands this lane the music, not only the sounds, and asks what the
valley's music still needs. So the round started where THE-OTHER-51 ended: not
by reading a table, but by booting the alpha and asking the game's own functions
what they can hand you. `CITYMUS.candidates()` phase by phase, `MENUMUS.
candidates()`, then 200 draws from each pool to see what actually comes out.

    songs in the shelf              128
    the street can ever reach        16   (night 9, day 5, dusk/dawn 2)
    combat can ever reach            15   (the faction-tagged ones)
    the opening can ever reach        6   (MENU)
    ---------------------------------------
    CAN BE HEARD NOWHERE             91
      of those, thumbed CANON        82
      of those, buried                9   (correct: a buried song stays buried)

This is not THE-OTHER-51 again. Those were sounds with no moment. **These are
finished songs, judged CANON by him, sitting in the build, that no player in
this game can ever reach.**

### AND HIS OWN LAW ALREADY NAMED THE ROOM, AND NOBODY BUILT IT

The OVERWORLD PLAYLIST LAW (Paolo 7/7) is two sentences and the fleet has only
ever obeyed the first one:

> "the overworld plays ONLY the creepers. Faction/action themes are for scenes,
> dialogue, INTERIORS."

Scenes were built. That is combat, and it is why 15 songs have a home. Interiors
were built too, on the other side: the walked city has an INSIDE state, you go
through real doors, and since 9/5 it reports `inside` to the shell every four
seconds. Measured before touching anything:

    on the street   THE WIND LEARNS WORDS
    inside a shop   THE WIND LEARNS WORDS
    back outside    THE WIND LEARNS WORDS

The ambience bed swaps to `air_inside` correctly on that exact flag and has
since 8/14. The music does not move at all. `typeof INTERIORMUS` was
`undefined`: three music players in this game, and the third room in his own law
had none.

### THE POOL IS A RULE, NOT A LIST, AND THAT IS THE WHOLE DESIGN

MECHANISM-MINE / CONTENTS-PAOLO'S. I may not sit down and decide that 82 songs
are "interior songs" -- that is tagging, tagging is his, and it happens in the
MUSIC tab. A table of 82 names would also be the wrong shape even if I were
allowed to write it: it would have to be maintained against every verdict he
ever gives, and it would rot the first time he tagged one.

So the pool is one sentence:

> **a song with NO category at all is a song nobody has placed yet,
> and a song nobody has placed is heard indoors.**

Nothing is typed and nothing is assigned. The moment he tags one in the MUSIC
tab it LEAVES this pool by itself, because having a category is the exact thing
that removes it. The pool shrinks as he fills the tab in, and when the tab is
full this system quietly stops existing.

GRAVEYARD IS FINAL, enforced and not assumed: `V===0` never enters, so the 9
buried ones stay buried. Weighting is the street's own, canon 8x and unjudged
4x, so nothing about how a song is chosen is new either. Measured on the running
game: 82 in the pool, **0 tagged, 0 buried, 0 creepers**.

### BOTH TRANSITIONS WAIT, AND THAT IS NOT FIGHTMUS COPIED

FIGHTMUS is asymmetric on purpose, and its 8/19 record says why: immediate going
in, a phrase coming out, because danger is now and making a player wait a bar
line to learn they are being shot at is information arriving late.

**A door is not danger.** Nothing is being announced, so both directions land on
the next 8-bar phrase, 128 steps, 16 seconds at 120 BPM -- the same unit CITYMUS
turns its time-of-day pool on and MENUMUS hands the opening over on.

**The debounce is a SECOND condition, and getting that wrong was instructive.**
A doorway here is one tile and you can be in and out in three seconds; swapping
instantly would make the music stutter every time somebody brushes a door, which
is the 8/4 two-sounds complaint wearing a different hat. The obvious answer is
"the phrase wait IS the debounce, for free". It is wrong: a song change resets
`MUS.step` to 0, and the wrap HAS to count as arrival or the wait hangs forever
the first time the shuffle picks a new track (the same guard `FIGHTMUS.leave()`
carries). So a song changing during those three seconds would fire the swap
anyway. Wall time cannot be wrapped. One phrase of dwell as well as the phrase
boundary: never sooner than 16 seconds, always on a phrase.

### IT TOOK THREE CUTS AND THE PROBE CAUGHT BOTH FAILURES

**CUT ONE armed once, on the doorway, and gave up.** If anything else owned the
music at that instant it cleared and never tried again. Measured: the opening
song was still playing, `busy()` was true, and forty seconds indoors produced no
switch, because arming only ever happened when `inside` CHANGED. **BEING INDOORS
IS A STATE, NOT AN EDGE.** A player who walks into a shop while the opening is
still going, or who is already inside when a fight ends, would simply never hear
the room.

**CUT TWO polled, but with two timers, one per direction, and the way out was
dead.** `where()` always installed the going-IN poll, whose first line is "if he
is not inside, stop" -- so stepping outdoors replaced the going-OUT watcher with
one that instantly cancelled itself. Measured on a real garage door: he walked
in and the room took over at 15.8 seconds, then he walked out and the room
played on forever. **TWO TIMERS FOR ONE STATE IS THE BUG**, not whichever
handler happened to run.

**CUT THREE is one pump, routed by what is true right now**, that stands itself
down in the same tick it acts. Leaving that to the next tick left a timer alive
for 250ms after the work was done -- harmless in the game, and a LIE TO A
CHECKER, which is worse.

### AND TWO OF THE THREE PROBES BROKE THE THING THEY WERE MEASURING

This keeps being the real lesson of this lane.

1. **The first forced `CITYMUS.startShuffle()` while the opening was still
   playing.** That resets `MUS.step` under MENUMUS's watch, which is looking for
   `step >= 128`, so the handoff was missed and the opening never ended -- for
   the whole run. The probe manufactured a deadlock and then reported the
   feature did not work.
2. **The second posted a fake `inside:true` from the parent window**, which the
   city's own truthful four-second heartbeat correctly overwrote three seconds
   later. Lying to the game about where the player is standing is not a
   measurement of anything.

The gate walks the body through a REAL DOOR with the city's own `inEnter()`, and
comes back out through the city's own `swapMode()`, and waits for the SWITCH
rather than for a duration.

### MEASURED, END TO END, ON THE REAL SURFACE

    street            TWO COINS FOR THE FERRYMAN   (a creeper, correct)
    through a door    "garage interior: 1-2 car bays, junk shelves, a door
                       into the house"
    15,760 ms later   WHAT THE DICE FORGOT         (untagged, not a creeper)
                      the street shuffle stood down, the music never stopped
    back outside
    16,037 ms later   THE WIND LEARNS WORDS        (a creeper again)

And in the demo, cut from the same file and checked separately rather than
assumed: pool 82, through the same door, **switched at 15,769 ms to SILK ROAD
GHOST**, untagged, still playing, stamp `DEMO - BUILD 9/6v`.

### THE GATE, AND WHY IT IS A DIFFERENT QUESTION FROM THE ONE WE HAD

`music_reach_gate` (8/4) asks whether a song HE TAGGED can be heard, and it is
right to. But a gate built around his tag table can only ever check the rows in
the tag table, so it could not see the 91 songs nobody ever tagged. It was green
through all of this.

`gates/room_song_gate.py` asks the whole-shelf question instead, of the game
rather than of the file: **every song is reachable by some player, or buried.
There is no third state**, and "nobody got round to tagging it" is not an excuse
a build gets to keep. 33 claims. It also asserts the four players account for
the whole shelf with nothing left over, so a song cannot be quietly dropped from
the arithmetic.

MUTATION PROVED, four ways, each failing differently:

| mutation | result |
|---|---|
| cut the WHERE wire | 5 failed -- the music never changed indoors |
| let a tagged song into the pool | 2 failed -- 27 tagged found, and combat lost all 15 |
| let a buried song into the pool | 1 failed -- 9 buried found |
| swap instantly, no dwell | 2 failed -- landed at 501 ms, not one phrase |

Three consecutive runs: **33 passed, 0 failed**, every time.

### AND FIGHT MUSIC WAS RED ON MAIN, IN THIS LANE, FOR THE SAME REASON I ALREADY FIXED ONCE

Running the lane's gates found FIGHT MUSIC at 44 passed, 3 FAILED. Checked
against plain `origin/main` in a clean worktree BEFORE blaming my own diff, and
it failed there identically -- pre-existing, not mine. But it is this lane's
gate and it is red, and "his bugs beat your queue" applies to the checkers too.

The cause was one line:

    await p.waitForTimeout(22000);   // opening hands over to the streets

**A FIXED WAIT IS NOT AN EVENT**, which is the exact rot I wrote down for BEAT
FIRST. The opening plays 8 bars and hands over, but it cannot hand over until
the transport is running, and the city keeps growing. Measured this round: the
handover now happens at **27.5 seconds**. So the gate sampled at 22, saw MENUMUS
still on, `city=false` and a MENU song, and the three claims that depend on the
streets playing all went red -- with nothing wrong with the game at all. It now
waits for the handover itself, with a bound, and reports the time it took.

**AND FIXING THAT EXPOSED A FLAKY CLAIM UNDERNEATH.** With the run reaching
further, "and LANDS at the top of the next bar" started failing about half the
time: two consecutive runs on the same unchanged tree came back 47/1 and 48/0.
It was written as

    MUS.step = 32;      // the top of a bar
    await wait(400);

and that is a race. The scheduler keeps advancing `step` (a sixteenth is 125 ms
at 120 BPM) while KILLMUS's watcher polls at 60 ms, so whether the watcher ever
saw a step with `step%16===0` inside those 400 ms depended on where the
transport happened to be. My change did not break it; it changed the phase and
revealed it.

The gate's own comment, four lines above, says a previous version of this very
claim was flaky and that **a flaky gate is worse than no gate, because it
teaches everyone to ignore red**. It was made "driven" and kept a fixed wait
anyway. The bar line is now HELD until the applier acts, and the wait ends on
the thing itself. **48 passed, 0 failed, three runs.**

### AND THE FIRST PUSH OF THIS ROUND THREW THE WHOLE CHANGE AWAY

Worth writing down because it nearly shipped a lie. Main moved while the round
was being finished, the ship loop rebased, the alpha conflicted, and the loop
resolved it with `git checkout --ours`.

**During a rebase, `--ours` is the UPSTREAM side -- main -- not yours.** So the
script silently discarded every line of INTERIORMUS and pushed the gate, the
tool and the record WITHOUT the code they describe. Main briefly carried a brand
new gate that would go red on the very build that shipped it, and git had said
`Successfully rebased and updated refs/heads/claude/sound-xk7pjp`.

**CHECK THE FILE, NOT THE EXIT CODE.** It was caught by counting the mark in the
pushed alpha, which is the same habit that caught a live conflict marker in the
handoff a round earlier.

Fixed two ways, and the second is the one that matters:

1. the push now REFUSES if the mark is missing from the alpha or from the demo;
2. **the alpha is REBUILT, never picked.** On a conflict, take main's copy and
   re-run this lane's idempotent, anchor-guarded tools on top of it. That is
   exactly what those tools are idempotent and anchored FOR, and it means a
   busy main can never quietly delete a lane's work again.

### RECORDED, NOT ACTED ON

`MENUMUS.candidates()` returns **2**, while 6 songs carry the MENU tag. The
other four are in the buried 13. That is correct behaviour by GRAVEYARD IS
FINAL, and it means the opening song of the game draws from a pool of two. It is
not this row's job and it is not a bug, but a two-song front door is worth him
knowing about, so it is in the handoff.

### WHAT THIS CHANGES FOR HIM

Walk into a building and the music changes to something he has never heard in
the game before, on the beat, and changes back when he leaves. 82 songs he
approved went from unreachable to reachable without one of them being assigned
to anything by me.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new message. One player built out of the two that already exist, fed by
the `inside` flag the city has been sending since 9/5.

    python3 gates/bohemia_gates.py --only "ROOM SONG"

Build 9/6v - THE ROOM HAS ITS OWN SONG.
