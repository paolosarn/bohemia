# THE TIME, NOT THE TAPS (RUN, 9/6/26)

VAMILY `[auto walk]` / BB-THE-TIME-NOT-THE-TAPS.

> **DISTANCE SHOULD SPEND THE DAY, NOT THE PLAYER'S ATTENTION.** Our long walk
> correctly costs in-game hours. It also costs the player however long it takes
> to press the pad twenty times, and **that second cost buys nothing** — it is
> not friction, not tension and not realism, it is time out of a person's
> evening. A route you set and let run, or a held press that keeps going. **This
> is not fast travel and it removes no cost; it removes the watching.**

## MEASURED FIRST, AND IT CHANGED THE JOB

**A held press already keeps going.** The pad wires `pointerdown` to `startHold`
and the metronome steps every beat while `held` is set. Measured on the served
demo before touching anything: **four seconds of hold moved five cells.**

Half this row was already built, and I nearly closed it on that.

**But a held press removes the tapping, not the watching.** Your thumb is still
down and your eyes are still on it for the whole walk, and the row's last five
words are *it removes the watching*. The job is the gap between those two, and
nothing more.

## WHAT SHIPPED

**A hold that really got going latches.** Let go and you keep walking that way.
No new control, no new surface, no destination picker, no route planner — the
same press he already makes, one sentence further.

A tap is still one step. The latch needs `LATCH_AFTER` beats of real holding, so
nothing about the existing feel moves.

**It removes no cost**, and that is asserted rather than promised: every latched
step is the same `stepOnce` a tapped step is, so the clock, the road moments, the
leavings and the crews all happen exactly as they would have.

### And it stops on its own, which is why it is safe to let go

Every reason lives in **one function**, so a new one cannot be added to one
caller and forgotten in another:

- **Anything to look at.** A card on screen ends it — that is the road interrupt
  this lane wired to the walked street last round, and strolling through the
  content would be worse than the twenty taps.
- **Anybody coming.** A hostile crew at `close` ends it.
- **A wall.** Two beats with nothing to show for them.
- **Him.** Any press anywhere, because a control you cannot interrupt is worse
  than one you have to hold.
- **The day**, or leaving the walked mode.

### Measured on the real surface

    6217,6283 → 6218,6284 → 6219,6285 → 6221,6287 → 6222,6288 → 6223,6289[card] → [stop]

Six cells with nothing held down, then a road moment arrived and it stopped.

## AND THE HARNESS WALKED INTO A WALL, FOR THE THIRD TIME

The first cut of the gate held east, got **zero** cells after release, and read
like a broken feature. It was not: he walked into a building and the wall rule
correctly stopped him. **The harness was measuring a wall.**

That is the third time this lane has done exactly that, so the gate now **asks
the game which direction has room** before it starts. Finding room is the setup
for the claim "he keeps walking when there is room" — it is not the claim.

There was a second harness problem worth writing down: synthetic
`PointerEvent('pointerup')` did not reliably reach the pad's handler, which made
one early run look like the latch never engaged. The gate uses **real input**
(`mouse.down` / wait / `mouse.up`) now, and asserts the pad-to-handler wiring
separately in the source — because a probe that calls `startHold` itself has
proved the function and not the button.

## MUTATION PROOF

- Remove the latch on release → **3 red**, including zero cells after letting go.
- Remove the card rule from the stop function → **2 red**, including *"a card on
  screen stops it"*.

## RESULT

    TIME NOT TAPS 19/0 (new) · COLD HAND 6/0

COLD HAND matters here: it taps the pad forty times, and the latch must not
change what a tap does. It does not.
