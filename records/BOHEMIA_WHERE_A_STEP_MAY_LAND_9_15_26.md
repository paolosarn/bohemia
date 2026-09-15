# WHERE A STEP MAY LAND — THE LOT LATTICE, MEASURED BEFORE IT WAS CHOSEN
# LIFE + CITY, 9/15/26, VAMILY row [lot lattice]
# Under PAOLO 9/15, LOCKED, rule 16 THE STEP IS A HOUSE
# (laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md)

> "each tile is the size of a house... however long it takes right now to walk the
>  length of a house, that would be done in one step."

The law splits the work: RUN owns THE STEP (the movement, the clock, the one constant),
COMBAT owns the board, CHARACTER owns the body, and this lane owns THE LATTICE — what a
lot is in fine cells, where a step may land, what blocks a step, and where a city tap
puts you. This is the lattice, and every choice in it is a measurement.

---

## 1. THE ROW'S PREMISE WAS WRONG, AND SO WAS RUN'S COPY OF IT

Both rows say, in the same words, "a lot is FN=32 fine cells today".

FN is 128. It has been 128 since 7/30/26, when Paolo said "The districts should have
always been full size bro" and the relock landed. And 128 fine cells is not a lot: the
VALLEY SCALE LAW of 7/6 says one overmap cell is 128 fine cells is 96 metres, and the
comment above the constant in the walked city calls it, in these words, **"A cell is a
NEIGHBOURHOOD, not a lot."**

The stale 32 is a comment in the population module, left over from before the relock,
that nobody re-read. Taken literally, a step would have been 96 metres, which is a city
block, not a house.

Rule 12 says a dependency on a line is a premise, not a gate. This one was a premise and
it was false, in two lanes' rows at once, and both trace to the same dead comment.

## 2. THE GAME ALREADY HAD A LOT, WRITTEN BY THE THING THAT DRAWS HOUSES

`engine/bohemia_suburb.js` packs houses on a stride it calls LOTW:

    widest model 16 m -> round(16 / 0.75) = 21 fine cells
    plus the gap                          = 3
    LOTW                                  = 24 fine cells = 18 metres

Eighteen metres of frontage is a Las Vegas suburban lot, and it is the number the
generator has been drawing with all along. So **LOT_FINE = 24**, taken from the
generator rather than typed, and `gates/lot_lattice_gate.js` reads the generator every
run and goes red if the two ever drift. That is the law's "ONE NUMBER IN ONE PLACE"
with a machine holding it, rather than a promise in a comment.

At 24 fine cells a step:
  - **one step is 18 m**, the length of a house
  - at the reach module's walking speed of about 9 m a minute, **one step is 2 minutes**,
    derived by `minutesPerStep()` and never typed anywhere
  - **real-time travel gets 24 times faster**, which is the "in multiples" he asked for
  - **a body is half a lot tall** at walk zoom by default, one number, his to correct

## 3. HOW IT WAS MEASURED: THE DEMO'S OWN DOOR, THE GAME'S OWN WALKABILITY

Driven with `tools/bohemia_drive_the_demo.js` (rule 14g: there is one driver), on a
phone profile, reading `cellAt(x,y).walk` — the exact test the walked city uses to decide
whether a step lands. Five places, 384 by 384 fine cells each (288 m square), one of them
the door he actually opens.

Two numbers per place. **Fine island**: the biggest 8-connected island of walkable fine
cells, which is today's lattice. **Lot island**: the biggest island of lots under the new
lattice, where a step from lot A to lot B counts only if a body can walk between their
landing points *without leaving the two lots*.

## 4. THE FIRST THING MEASURED KILLED THE OBVIOUS DESIGN

A step landing on lot **corners**, the simplest lattice anybody would write:

    suburb, lot corners     45.3% of lots standable, biggest island 23.4%
    gated,  lot corners     60.9% standable,         biggest island 32.8%

A quarter of the world in one piece. A corner anchor drops the step onto whatever
happens to be at a fixed offset, and in a suburb that is usually a roof. Lot **centres**
measure better (95.3% in a suburb) and then collapse to 52.8% one lot size over, because
a centre is where the house is. **A fixed offset cannot be the landing.**

## 5. WHAT WAS SHIPPED INSTEAD, AND THE RESULT THAT SURPRISED ME

The landing is **a cell you can actually stand on**: road first, then touching a road,
then any walkable ground, nearest the lot centre inside a tier. The road preference is
not new taste — it is Paolo's 8/1 NO DISTRICT IS A PRISON ruling ("the streets have to
touch the streets bro"), which the city drop-in already obeys. Using the same order means
the lattice node and the drop-in's arrival point are the same cell **by construction**
instead of two rules that happen to agree.

Measured, at LOT_FINE = 24:

    where                fine walk   fine island   lots standable   LOT ISLAND   ways out
    THE DOOR (suburb)        87.5%         83.5%             100%        94.1%       6.41
    suburb                   64.3%         16.5%              91%        24.6%        5.6
    downtown                 84.9%         84.9%            93.8%        93.4%       6.88
    commercial               85.8%         85.8%            99.2%        99.2%       5.35
    gated                    81.3%         81.3%             100%        98.8%        5.8

**THE LOT LATTICE IS MORE CONNECTED THAN THE FINE ONE, IN EVERY DISTRICT MEASURED.**
I expected to be defending a small loss. Coarsening the step does not cut the world up,
it stitches it: a lot step crosses a one-cell fence gap that a fine step has to walk all
the way around. The door goes 83.5% to 94.1%; commercial 85.8% to 99.2%; gated 81.3% to
98.8%.

## 6. AND THE ONE UGLY NUMBER IS NOT MINE, WHICH IS WHY I AM WRITING IT DOWN

The `suburb` row above is 24.6% at lot scale. That looks like the lattice failing until
you read the column beside it: **that suburb tile is 16.5% at fine scale, today, walking
it one small cell at a time.** The ground there is already cut into pieces by fences and
back walls. The lattice is eight points better than what is shipped.

So: **one suburb tile away from the door, a body can reach one sixth of the walkable
ground it can see.** That is a defect in what the generator makes, not in how a step
moves, and it belongs to whoever owns suburb generation. Named here rather than fixed,
because a lane that fixes another lane's system is how two sessions end up editing one
thing (PARALLEL SESSIONS, one system one session).

## 7. WHAT BLOCKS A STEP

A step from lot A to a touching lot B is offered only if a body can walk from A's landing
to B's landing without leaving the two lots. A lot with no walkable cell at all has no
landing and is not steppable — that is what a building is.

This is the honest rule for two reasons. One step is one move, and a move that needs a
detour through a third lot is not one step, it is a walk. And it is what stops a body
cutting the corner of a house: a sealed back yard and the neighbour's sealed back yard
are two lots with a wall between them, and this says so instead of teleporting through
it. The gate proves it on a world with a known answer: two open lots, one two-cell wall
on the shared seam, both landings fine, step refused.

## 8. WHAT LANDED IN THE GAME THIS ROUND

- `engine/bohemia_lattice.js` — the lattice and **the one number**. Injected with the
  surface's own walkability, so it has no opinion of its own to disagree with the game
  about. Declared canon in `gates/bohemia_sync_canon.txt` on the day it was written.
- Inlined into `slices/BOHEMIA_CITY_WORLD.html` and published on the proof surface as
  `__proof.lattice` and `__proof.latCtx`, so RUN, COMBAT and CHARACTER read the number
  instead of each writing one.
- `latCtx()` — the walked city's walkability handed to the lattice, built in exactly one
  place. No cache: a cached landing goes stale the moment he builds something.
- **THE CITY DROP-IN NOW ARRIVES ON A NODE.** A drop-in used to put him on an arbitrary
  fine cell, half a lot off the lattice. It now finishes on the lot's landing, chosen by
  the same road preference the existing spiral uses, so it can only agree with the 8/1
  law, never undo it. **It leaves the door alone** — see section 11, that cost me three
  red checkers before I caught it.
- `tools/bohemia_lot_lattice_probe.js` — the measurement above, re-runnable by anyone.
- `gates/lot_lattice_gate.js` — 35 pass / 0 fail, in the suite as WHERE A STEP MAY LAND.

## 9. WHAT THIS ROUND DID NOT DO, SAID OUT LOUD

**The player still moves one fine cell per press.** RUN owns the step and its row
[step is a house] is open, not claimed. This lane built the ground under it: the lattice,
the number, the blocking rule and the arrival point. The day RUN coarsens the movement, it
reads `BOH_LATTICE` and does not invent a second constant, because there is a gate that
fails if it does.

The bodies are not drawn bigger yet either; that is CHARACTER's half, and `BODY_LOTS`
sits in the lattice waiting to be read.

## 10. MUTATIONS RUN AGAINST THE GATE (a gate that cannot fail is worse than none)

    LOT_FINE 24 -> 32                      A3 and B4 go red
    stepLegal stops testing for a wall     C10 goes red
    the city tap stops calling the lattice D2 and E1 go red

And the gate's own first run found a hole in itself twice, which is the tell that it is
reading something real: leg B5 flagged its own probe tool as a second copy of the number
(a `require` is a read, not a copy), and spelling the module's name in one piece made the
checker look like a third carrier of the module and put the ENGINE SYNC LAW in violation.
**A checker must not be findable as the thing it checks.**

## 11. THE MISTAKE I MADE, AND WHAT CAUGHT IT

The first cut snapped **every** arrival, and the drop-in path runs once during boot. So
it moved his spawn eight cells, and three of this lane's own checkers went red on the
screen he wakes to:

    cells on screen drawing approved bank art    903 of 903  ->  892 of 903
    walks that meet a crowd                        13 of 16  ->    8 of 16
    driven taps landing on the ground he tapped         6/0  ->     5/1

Not one of those is about the lattice. They are all the same fact: **eight cells is a
different first screen, and the first screen is the game.** Every one of the three was
green on clean main a minute later, which is how I knew it was mine and not weather.

Two rules both say leave it alone. Rule 14: the demo's first five minutes on a phone is
the only measure of the game, so a change that makes the door worse is not a change worth
having. And PARALLEL SESSIONS: the door is RUN's, and RUN is re-choosing it right now
under [spawn home] ("he wakes in the middle of a freeway"). So the lattice snaps
**travel**, and the first arrival of a session goes through untouched. `lot_lattice_gate`
leg E1 now checks exactly that and goes red if any lane starts snapping the door.

**THE LESSON, WHICH IS NOT A NEW ONE: A CHANGE THAT IS RIGHT EVERYWHERE IS STILL WRONG AT
THE DOOR.** The measurement that caught it was three checkers I wrote in earlier rounds
for entirely different reasons, all reading the spawn screen. That is what a lane's own
gates are for and it is the second time this round that an instrument earned its keep by
failing.

## 12. AND A BREAK ON HIS LIST, WITH A MEASUREMENT ON IT NOW — FOR RUN AND EYES

Chasing whether the arrival snap fires on a real travel, I drove the demo into city mode
and went looking for the way back down. **There is no DROP IN control in the demo's DOM at
all.** Not hidden, not off-route, not styled away: `#modechip` does not exist, and a sweep
of every element in city mode whose text matches DROP / MAP / GO / ENTER / LAND returns two
zero-size district labels and nothing else.

His break list says "PRETTY MAP and DROP IN buttons exist" and EYES E26 says its route
never reaches them. This is the harder version of that: the route cannot reach it because
it is not there. Which means the only city-to-street arrival that runs in the demo today
is the boot, and pinching back in always returns him to his feet (that is the 8/27
LOOKING IS NOT TRAVELLING rule working as designed).

So the arrival point is built, gated and published, and its caller is RUN's: [fast travel]
TAP-THERE-ARRIVE-THERE is claimed this round, and it should call
`BOH_LATTICE.arrive(hx, hy, latCtx())` rather than write a second landing rule.
Said plainly rather than shipped quietly, because a mechanism whose caller does not exist
yet is fine, and a mechanism that pretends to be reachable is not.
