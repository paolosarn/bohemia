# STOP AND COME BACK (RUN, 9/6/26)

VAMILY `[title screen]` / STOP-AND-COME-BACK. Record item H, 8/25:

> **NOT A BLOCKER, BUT NAME IT:** the demo has no title screen of its own, no
> "what is this", no way to stop and come back that a stranger would recognise
> as such.

## MEASURED FIRST, AND TWO THIRDS OF IT WERE ALREADY BUILT

- **A title screen of its own** — yes. His wordmark, on its plate.
- **A "what is this"** — yes. POST-ECONOMIC APOCALYPSE · LAS VEGAS, under the name.
- **A way to STOP** — yes, and it is UI's, shipped 9/5: the gear's QUIT closes the
  game and puts the front door back.
- **A way to COME BACK that a stranger would recognise — NO.**

That last one is the whole job, and it was measured rather than argued. Played to
16:20, then reloaded the way coming back does:

    the shell's save held   {day:1, min:980} on disk
    THE FRONT DOOR SAID     "TAP TO ENTER"

The run was sitting right there and the door said nothing about it. This lane
spent three rounds making that save carry the day, the clock, the position, the
quest, the purse and the people, and **the one surface that could say so was
silent.** A stranger who put the game down had no way to know their day survived.

## WHAT SHIPPED, AND IT IS ONE LINE OF THE DOOR

When a run is waiting the tap line names it: **CONTINUE · DAY 1 · 16:20**, the day
and the clock in the same vocabulary the HUD already uses, because that is what he
navigates by. With no run it is untouched: TAP TO ENTER, exactly as it was.

It reads **the shell's own save**, asked the same way the boot handshake asks it.
No second reader: two things that both decide whether a run exists is how they
come to disagree.

### What it deliberately does NOT do

- **No START OVER on the front door.** Wiping is destructive, the save panel
  already owns it, and the screen a stranger taps first is the worst place for a
  second door onto it.
- **No second screen and no fork.** The splash has exactly one thing to do. The
  settings lane's own comment says a second button on it is a fork in the only
  moment that has to be simple, and it is right. This is the SAME one thing, told
  the truth about.
- **It does not change what the tap does.** Entering already restored the save
  through the handshake. The door was lying by omission, not by action.

Repainted whenever the door is up, because UI's QUIT brings it back mid-session
and a line that was right at load is stale by then. **Polled, not hooked into
doQuit**, so this adds no line to a function another lane owns — the same choice
the settings panel made, for the same reason, two lanes agreeing.

## THREE THINGS THIS ROUND MEASURED THAT THE NEXT ROUND SHOULD NOT RE-LEARN

**1. THE CLOCK THE HUD READS IS A MIRROR, NOT THE CLOCK.** `T` is overwritten from
the day loop by `daySync()` on the loop's next tick, so a probe that sets `T.day`
gets its value onto disk and then loses it about a second later. The first cut of
this gate did exactly that and went green, green, RED. The game's own function is
`advance(mins)`, the one every walked step calls, and a value it moves stays moved.

**2. ENTERING IS NOT BEING READY.** The walked world defines `DAY` early and asks
the shell for its save afterwards — **measured at about 1.6 seconds.** A probe that
starts the moment `DAY.day` is 1 is reading a game that has not been handed its run
yet, and an earlier cut of this gate reported a clock that had "reset" because of
it. There was no reset. `window.__RESTORE_OK` is the honest signal.

**3. THE DOOR AND THE DISK GET READ TOGETHER.** Two reads a second apart cannot
tell a door that lied from a save that moved underneath it. The gate now takes both
in one evaluate and its red says which one broke.

## AND THE FIRST CUT OF THIS BLOCK BROKE THE BEAT

The suite came back with 34 reds on a busy main, which is useless as a verdict on
its own. So every red was re-run alone **on this tree and on pristine origin/main
with only these two slices swapped**. 26 were red on both. Three were green on
both. **One differed: BEAT FIRST.**

The cause was real and it was mine. The repaint polled every 600ms and called
`CITYSAVE.load()` **on every tick** — and that parses the whole run: day, quest,
purse, century, market and the people. Twice a second of main-thread work on the
splash, in the exact window that gate measures the pulse in.

    the pulse covered the silence: 0.5s of beat between the tap and the
    song's first note (it was ten seconds of nothing)

**120 BPM is a law and the splash is not exempt.** The tick is a cheap visibility
check now and the save is read **once each time the door appears** — at most one
parse per showing instead of two a second.

Two things followed from that, and both are worth writing down.

**The flag had to clear on a missing element.** Entering the game removes
`#front`, and the first cut returned early on that *without* clearing the flag, so
QUIT repainted nothing and the mid-session line stayed the one from load. COME
BACK caught it on the exact claim written for it: `door: 16:20 / disk: 17:55`. The
settings panel already reads a missing `#front` as "the game is up"; this does now
too.

**And BEAT FIRST turned out to be flaky on main, which the one-run sample hid.**
Measured properly at three runs a tree: **pristine main failed 1 of 3, this tree 2
of 3**, with its own numbers swinging run to run (16, 20, 21, 22 thumps for the
same build). A one-against-one comparison cannot separate those. Flagged for
SOUNDS. The fix above stays regardless: one parse per showing is right whether or
not that gate can see it.

## MUTATION PROOF

- Make the door never find the run → **4 red**.
- Remove the repaint from the poll → **4 red**. Worth writing down: the load-time
  paint alone is not enough, because at the moment this script runs `CITYSAVE` is
  not defined yet. **The poll is load-bearing for all of it.**
- Let it name the run but print the fresh-start clock → **2 red**, and the one that
  catches it is the claim that a line just printing the defaults would say 06:00.

## RESULT

    COME BACK 25/0 (new) · FRONT DOOR 4/0 · ALPHA LOADS 20/0 · WHOLE DEMO 23/0
    DEMO BLOCKERS 22/0 · PAGES PUBLISH green · demo --check clean

## TWO REDS ON MAIN THAT ARE NOT THIS ROUND'S, BOTH REPRODUCED ON PRISTINE MAIN

- **DEMO DAY**, one line: *"and the money really left the purse (500 -> 500)"*.
  The buy registers and the balance does not move. Red on pristine main, on
  f5b3577 before the two economy commits, and on 6923ce8. `mktBuy` charges
  `p.currency || SALVAGE_CURRENCY` — a ruled row names its own pocket — while the
  gate funds and reads `resources`, so either the cheapest good on the shelf is
  priced in a pocket the fixture never funded, or it came out of a different one
  and nobody looked there. **The shelf's affordability and the gate disagree about
  which pocket pays**, on the surface a friend plays. ECONOMY's currency model,
  not touched here.
- **BUNDLE** and **ENGINE SYNC**, both on `bohemia_powergrid.js`: the standalone
  module and its inlined carrier have drifted. Last touched by `[held ground]`.
  Engine files are untouched by this round.
