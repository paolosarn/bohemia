# EVERY SOUND ACCOUNTED FOR (9/6/26, SOUNDS lane)
## THE-OTHER-51, round 4 -- the closing round

### THE ROW IS DONE, AND IT IS DONE BY ACCOUNTING, NOT BY WIRING

THE-OTHER-51 started as a grep: 65 approved sounds in the bank, 14 names found in
the code, "so 51 are unused, go wire them." Round 1 threw that grep away and
replaced it with a MEASUREMENT on the walked surface, because a name appearing in
a file is not a sound the game plays. Rounds 2 and 3 fixed what the measurement
found. Round 4 closes the row the only honest way it can close:

**EVERY ONE OF THE 65 APPROVED SOUNDS IS ACCOUNTED FOR.
13 heard on the walked surface. 52 with their own written reason. 0 unexplained.**

That is the ship test, and it is met. The row does not end when 65 of 65 play,
because a game does not have 65 moments to play them in. It ends when nothing is
sitting in the bank by accident.

### WHY "ACCOUNTED FOR" IS THE RIGHT FINISH LINE AND "ALL WIRED" IS NOT

The first three rounds all found the same shape of bug: an approved sound that
had a real moment in the game and no wire to it.

* `step_sand` -- approved 8/12, labelled DEEP SAND in the engine's own table,
  never played once, because the desert reported `dirt`. Round 2 gave it the
  district and it fired.
* `sleep_sink` -- 5 of 5, his cleanest sweep, wired to the sleep BUTTON on 8/22.
  The clock-driven end of a day, the one that happens whether you like it or
  not, was completely silent. Round 3 wired that door.

Those are bugs. **What is left is not.** The remaining 52 fall into two kinds,
and neither kind is fixed by wiring:

1. Sounds for a system the game does not have yet (the fight bed, the enemies
   you hear before you see, the pump).
2. Sounds for a moment that does not exist in this game's shape at all.

Wiring kind 2 means INVENTING A MOMENT SO A SOUND HAS SOMEWHERE TO PLAY. That is
the opposite of this row's job, and it is the exact failure STOP PRODUCING is
about. So the finish line moved to where it belongs: not "all 65 play", but
"nothing is unexplained".

### THE LAST TWO, CHECKED BEFORE THEY WERE EXCUSED

Two names looked like round-2-style bugs -- a real moment with a missing wire.
Both were checked, and both are reasons, not bugs.

**`save_chime`.** The name appears ZERO times in the walked city. That looks like
a missing wire until you look at how the city saves: it persists continuously,
per system, with no single "the game saved" moment anywhere. There is nothing to
hang a chime on. And if you hung it on every write, you would get a chime
several times a minute, which is the 8/4 two-sounds-on-one-tap complaint at
scale. It stays approved and judgeable and named.

**`parts_pass`.** This one IS wired, inside `payForToday`, and it fires only when
a job was accepted. The probe never accepted a job, so it never heard it. That is
my instrument not doing the thing, not the game not making the sound. Written
down as a condition, not a hole.

### THE GATE CHANGED SHAPE, BECAUSE A FLAT SET WAS NOT GOOD ENOUGH TO CLOSE A ROW

`gates/every_sound_is_reachable_gate.py` held its unreachable names in a flat
set. That is fine while a row is open and it is NOT fine as the thing that closes
one: a name could be dropped into the set later and silently inherit a reason
that was never about it. The set became a DICT OF EVENT -> ITS OWN SENTENCE, so
every excused sound carries the reason that belongs to it and nothing else.

Then two claims were added that only make sense at the end of a row:

    and nothing is counted twice -- an event that was HEARD must not also be
    carrying an excuse

    EVERY ONE OF THE 65 APPROVED SOUNDS IS ACCOUNTED FOR: 13 heard on the walked
    surface, 52 with their own written reason, 0 unexplained

The first one is the important one. Without it, a sound could be both heard and
excused and the arithmetic would still add up, which would let the row close on a
lie. And the gate prints the whole ledger, one line per sound, `HEARD` or
`waits <reason>`, so the accounting is readable rather than asserted.

23 claims, all green.

### AND A FLAKE WAS FIXED, WHICH IS WHY THIS TOOK A ROUND

`air_night` failed 1 run in 3. Two causes, both in the instrument:

1. An ENDED day stops `advance()` from moving `T.min`, so setting the clock to
   night sometimes did not land. Fixed by waking the day loop first and then
   ASSERTING `isNight()` actually became true, rather than assuming the write
   took.
2. The ambience bed learns it is night ONLY from the WHERE heartbeat, which is
   every 4 seconds. Sampling the bed right after moving the clock read the old
   night flag. Fixed by calling `__ctWhere()` so the shell is told before the bed
   is asked.

Three runs after: 23 passed, 0 failed, 13 of 65 heard, every time. **A GATE THAT
IS RIGHT TWO TIMES IN THREE IS NOT A GATE**, and shipping a closing claim on a
flaky measurement would have been worse than not making the claim.

### RECORDED AND DELIBERATELY NOT ACTED ON

**A fight starting makes no sound at all.** `cityFightOnEnter` posts the
encounter with no sound call, and the street ambush is the same. That is a real
hole and it is a big one. It is NOT fixed here, because there is no approved
sound for "a fight begins" -- fixing it means a new cook, and this row forbids
cooking. It belongs to `[enemy heard]` and `[fight music]`, which are next in the
queue, and it is written into the handoff so it cannot get lost.

### THE FOUR ROUNDS, IN ORDER

| round | what it found | what it did |
|---|---|---|
| 1 | the row's grep was wrong; 9 of 65 actually play | replaced the grep with a census gate on the real surface |
| 2 | the desert played a suburban lawn | the district reaches the ground classifier; `step_sand` fires |
| 3 | the end of a day was silent | `sleep_sink` on the clock's door, not just the button |
| 4 | the last two "holes" were reasons | the census closes: 13 heard, 52 reasoned, 0 unexplained |

REUSE CHECK: cooks nothing. Round 4 wires nothing. No bank, no candidate, no
pixel, no new event. It is accounting and a gate.

    python3 gates/bohemia_gates.py --only "SOUND REACHABLE"

Build 9/6j - EVERY SOUND ACCOUNTED FOR.
