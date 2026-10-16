# THE DAY ENDS ON YOU (9/5/26, SOUNDS lane)

**[unused sounds] THE-OTHER-51, round 3. Still CONTINUING.**

Nine of 65 heard in round 1. Twelve in round 2. **Thirteen now.**

## MEASURED: THE END OF A DAY IS SILENT

Driving the clock from 06:00 to nightfall on the real surface and recording
every sound the game asked for:

    {}

Nothing. In a hundred-hour game across three generations, **the end of a day is
the single most repeated moment there is**, and it made no sound at all.

## AND THE SOUND ALREADY EXISTED, WIRED TO THE OTHER DOOR INTO THE SAME ROOM

`sleep_sink` ("YOU SLEEP") is 5 of 5 — his cleanest sweep — and on 8/22 this lane
wired it to the **sleep button**: you decide to turn in, and it lands on the tap.

But the day loop's own header says there are two doors, not one:

> "it wakes you at 06:00, spends your sixteen hours, and **ends the day at
> NIGHTFALL 22:00 whether you like it or not**"

The door you choose had a sound. **The door that closes on you did not** — and
that is the more dramatic of the two, because it is what happens when you lose
track of the light.

## WHERE THE WIRE GOES, AND WHY THAT PLACE AND NOT THE OBVIOUS ONE

The obvious place is `onNightfall()`. **That would have played two sounds on one
tap**, because the sleep button calls `onNightfall()` too, right after posting
its own `sleep_sink` — and two sounds on one click is the 8/4 complaint that the
UI policy in this very file exists to prevent.

The two paths are already separate one level up. `advance()` carries the
clock-driven ending:

    if(was==='awake' && DAY.phase==='ended') onNightfall();

and the button never touches `advance()` at all. So the sound goes on that
branch, where it **cannot** stack. The gate holds both counts separately and a
mutation that moves it into `onNightfall()` goes red on all three legs.

## ONE THING I ALMOST REPORTED AND DID NOT

The same measurement said **waking up makes no sound either**. It does:
`come_up` (4 of 5) fires when the morning card is dismissed, wired 8/22. My
probe called `DAY.wake()` directly and skipped the card, so the silence was **my
instrument skipping the UI**, not the game. Checked before writing it down.

## AND MY RECORDER REPORTED A DOUBLE-PLAY THAT WAS NOT ONE

The first count came back `sleep_sink: 2`. It wrapped **both** the city's
message and the shell's `playSFX`, so one sound arriving and then being played
counted twice. Counted per path: **posted once, played once.** *An instrument
that watches a sound twice reports a double-play that is not one.*

## THE GATE

`gates/every_sound_is_reachable_gate.py`, 20 claims, both doors driven.

    A  the clock-driven ending goes silent again  -> RED x2
    C  the sound moved into onNightfall()         -> RED x3 (both doors play twice)
       restored                                      20 passed, 0 FAILED

A third mutation — making the button path also call `advance(0)` — did **not** go
red, and that is correct rather than a hole: `DAY.sleep()` has already set the
phase by then, so `advance` sees no transition and there is no double to catch.
A mutation that cannot break the thing is not evidence either way, and it is
recorded here as such rather than counted as a pass.

## REUSE CHECK

Cooks nothing. One approved sound, already in the bank and already wired to the
other way into the same state, reaching the door it never covered.

Tab: **RUN** (the walked city). Nothing to judge — nothing was cooked.
