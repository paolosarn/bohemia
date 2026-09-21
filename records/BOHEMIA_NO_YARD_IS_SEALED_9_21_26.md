# A STRAIGHT WAY OUT IS NOT A WAY OUT
# NO YARD IS SEALED, and THE SHOP IS STILL LIT
# LIFE + CITY, 9/21/26, rule 22 COOK EVERY ROUND + rule 18 THE PLAYABLE CUT

---

## 1. THE THING I MADE: THE SHOP IS STILL LIT

`slices/vote/LIFECITY_THE_SHOP_IS_STILL_LIT_9_21.png`, in the **VOTE tab** as
*THE SHOP IS STILL LIT, AND EVERY SHELF IN IT IS BARE*.

A corner store you walk up to. Three bays, three faded awnings, one of them torn, a
blank pylon sign standing out on the lot, dead trees in kerbed islands, stall paint
mostly gone.

**ANALOG HORROR AT THE SOURCE, NOT A FILTER** (rule 20). Everything in the frame is
ordinary except one thing, and it is the only warm light in the picture: **the middle
shop still has its lights on.** Two ceiling tubes are still burning in there. What
they show you through the glass is **seven empty shelf runs** and a checkout stripped
to the counter, and the door is standing open. A shop that is still open with nothing
in it is worse than a dark one. No grime layer, no scanline, no monster.

**REUSE-FIRST:** the palette is pulled **live** out of `engine/bohemia_commercial.js`,
the shopping district's own canon, so this shop and the district he walks through are
the same world. The factory refuses to run rather than invent a colour.

This is the open row [shelves seen] in a picture. Paolo's words on that row: a player
should be able to walk into a shop and see it. Before you can walk into one, a shop
has to read as a shop from the street.

### AND I DREW IT WRONG FIRST, IN THE SHED'S EXACT MISTAKE

The first cut had a **black band over the roof and black corners**. The battery shed
failed on the same thing a round ago. **The world is seen from above, so there is no
sky, and a dark band reads as a hole in the world, not as air.** Redrawn so every
pixel in the frame is ground he could stand on: the dry service strip a truck backs
onto behind the store, the neighbour's cracked apron either side, a bin against the
wall, the lot out front.

Two other things changed by looking at it rather than at the code:

- the lit bay was **one flat bright fill**, which is a white card taped to a wall, not
  a lit room. The source is the ceiling, so the light is brightest at the head of the
  glass and falls off to the floor, and the shelves are **dark against it**, which is
  how a lit shop actually reads from outside.
- the pylon sign was **clipped off the right edge**. It stands on the lot now, where a
  pylon sign really stands, with its own shadow.

---

## 2. THE MEASURING RODE BESIDE IT: [sealed yards], AND THE CLAIM IS NOT TRUE

The row, handed to this lane by RUN 930e2bf3:

> "45 doorsteps with 0 straight walkable ways out; the suburb generator seals yards
>  behind one-cell walls."

The suburb generator is this lane's. So: size it.

**THE 45/0 NUMBER IS A RAY.** Eight directions, 140 cells, straight lines
(`gates/first_minute_gate.js`). A ray reports **line of sight**. On a suburb block full
of houses the street is almost never in line of sight, and that is what a suburb IS.
It says nothing at all about whether a yard is sealed, because **a body turns corners.**

### MEASURED ON THE CUT, BOTH INSTRUMENTS SIDE BY SIDE

His own house, every walkable cell of the doorstep ring the cut's own `homeDoorstep()`
walks:

    walkable doorsteps                     68
    STRAIGHT ways out (the ray)             7 of 68
    WALKABLE ways out (a body walking)     68 OF 68
    PROVED SEALED                           0

One of the 61 that disagree: **6218,6256 has no straight way out and walks to the road
anyway.**

Then the whole block, because the row says *his block*, not his house. Every walkable
cell on his overmap cell that touches a cell a body cannot stand on, which is a
superset of every real doorstep there is:

    doorstep-shaped cells on the block   1,857
    ones one flood out of his door misses    0
    PROVED SEALED                            0
    UNKNOWN                                  0

**THE SUBURB GENERATOR DOES NOT SEAL YARDS.** Not one doorstep on his block, of 1,857,
is cut off from the road. The nearest road he can walk to is **nine cells from where he
wakes**.

### FOURTH TIME IN A ROW THAT THE INSTRUMENT, NOT THE WORLD, WAS BROKEN

    an instrument that cannot return "no" is not an instrument        (9/15)
    A STRAIGHT LINE IS NOT A BODY                                     (9/16)
    an instrument that assumes a step length measures its assumption  (9/20)
    an instrument that cannot say "I do not know" will say "no"       (9/21)

and now: **a straight way out is not a way out.**

This does not make RUN's five stuck presses imaginary, and it is not a verdict on
another lane's gate. It settles one cause and only that one: **it is not that the
ground is cut off.** Last round proved the ground is his own; this round proves the
doorsteps are too.

---

## 3. THE GATE

`gates/no_yard_is_sealed_gate.js`, in the suite as **NO YARD IS SEALED**. 13 pass /
0 fail.

**A GATE THAT ONLY EVER SAYS ZERO IS NOT A GATE.** Leg A seals a yard on purpose on
worlds with known answers, and the gate has to catch every one before its zero on the
real block is allowed to mean anything:

- a yard fenced on all four sides is **PROVED SEPARATE**, in 119 cells looked at,
  which is exactly the size of the yard
- one cell of side gate in that same fence and it **walks out**
- a way out that is only a **diagonal squeeze** is still a way out
- an endless wall in an endless world comes back **UNKNOWN, never SEALED**
- and A4 holds the finding itself: **a ray calls the yard WITH the gate in it sealed
  too**, which is how the claim was made

**MY FIRST TEST WORLD WAS NOT ACTUALLY SEALED** — it was open at the top either side of
the house — and the gate answered SAME GROUND and was right. Rebuilt with the house as
the yard's north side and the gate at x=9, off the straight line to the road, which is
where a real garden gate is.

Leg B runs **one flood first** and spends the expensive unbounded three-state test only
on what that flood missed, so the honest instrument runs where it matters rather than
16,384 times.

---

## 4. WHAT THIS ROUND DID NOT DO

The shop is a picture in the VOTE tab, not a building in the street yet, because rule
18 holds this lane's play surface. `[sealed yards]` is WALKING, so its gate ships. No
generation, no movement and no art on the walked surface changed.
