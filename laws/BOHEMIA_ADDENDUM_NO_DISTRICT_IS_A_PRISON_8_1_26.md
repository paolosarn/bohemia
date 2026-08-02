# BOHEMIA ADDENDUM — NO DISTRICT IS A PRISON
## Paolo, 8/1/26, LOCKED. He was standing inside one when he said it.

> "Also I'm not able to leave my original suburb neighborhood in the run like
>  it's not connected to any streets that I can [reach]. I'm so fucking confused
>  bro you need to make the run better. I gotta be able to the streets have to
>  touch the streets bro. I'm like locked in this fucking suburb. What's wrong
>  with you? **Make sure I can't be locked in any certain district ever again**
>  it's so fucking creepy."

---

## THE LAW

**From anywhere a body can stand, a real street is reachable on foot.** Always,
on every seed, in every district, with no exceptions and no "technically".

It has three clauses, because he was defeated by all three at once:

1. **THE DOORSTEP IS NEVER A CELL WITH NO ROAD.** The cell the run starts you on
   MUST touch a real street. Not "usually", not "scored highly for it" — a hard
   filter. You begin your life next to a road.

2. **EVERY DISTRICT IN THE VALLEY HAS A WAY OUT.** Every built cell either
   touches a street itself, or relays to one through a chain that terminates on
   a real road. A relay that hands you to another sealed cell is a prison with
   extra steps and counts as a violation.

3. **THE WAY OUT IS REAL, NOT NOTIONAL.** The opening is a genuine passable gap
   in the wall, the block's own interior can walk to it, and stepping through it
   puts you somewhere else. A door you cannot find and cannot use is not a door.

## WHAT WAS ACTUALLY WRONG, measured rather than guessed

**The run's `findHomeCell()` never asked the only question that mattered.** It
scored a starting doorstep on the VARIETY of districts within a short walk, and
on not sitting on the rim of the map. Both sensible. Neither is "can you leave".
It picked cell **(39,23)**: `rawStreetEdges = []` — no road on any of its four
sides. Its neighbours were fort, medical, suburb, suburb. Its only way out was a
single 7-tile relay gap in a 512-tile perimeter wall, and the far side of that
gap was ANOTHER SUBURB.

He was not imagining it and he was not bad at looking. A pathfinder took 96
steps to find that gap.

**And it was a one-in-five chance, every seed:** 545 of the valley's 2,721
suburb-family cells (20.0%) touch no street at all.

**Worse, underneath it: 27 cells were sealed outright.** Three estates, a
school, a drive-in, a commercial, a farm and two suburbs had no street edge AND
no relay — a box you could stand inside forever. The landlock relay only ever
walked to a SAME-FAMILY neighbour, so a landlocked school had nobody to ask.

## WHAT LANDED

- **`findHomeCell()` filters on a real street edge.** Hard, not scored. The
  doorstep moved from (39,23) to **(41,22)** — arterial to the south, freeway to
  the north, openings on both. Walking out the south side puts you on the road.
- **The landlock relay got two more passes**, in order, each less picky than the
  last and each running only for cells the previous one could not save:
    1. SAME FAMILY (unchanged) — the realistic path, how Sun Belt tracts connect.
    2. ANY BUILT NEIGHBOUR — for the school and the drive-in with no kin nearby.
       Less true to real Vegas than family; enormously truer than a prison.
    3. ACROSS ANYTHING, INCLUDING DESERT — for the seven cells in pockets whose
       whole run of built ground never touches a road. This IS the LANDMARK
       ACCESS SPUR the overmap law already blesses: "carves a desert-only
       driveway to the nearest street for isolated cells the relay can't reach".
       Capped at 16 hops, because a spur is a driveway, not a highway.
  Result: **3,754 built cells, 2,857 touching a street, 897 relaying, ZERO
  sealed.**

## THE GATE
`gates/no_prison_gate.js`. It holds the SPIRIT and not just the letter, because
"technically escapable through one hidden gap" is exactly what he just lived:
  - **the valley**, cheaply: no orphan cells, every relay chain terminates on a
    real road, and relays stay the exception rather than the rule;
  - **sampled plots**: a real gap in the perimeter, and an interior that can walk
    to it;
  - **the doorstep, WALKED IN A REAL BROWSER** on the file he plays: out of the
    house, across the block, through the opening, and onto a street — with the
    buttons, the way a thumb does it. Nothing teleported.
Proved able to fail: removing the street filter reproduces his exact cell,
(39,23), and turns three assertions red.

## THE STANDING RULE THIS LEAVES BEHIND
Any future system that CHOOSES A PLACE FOR THE PLAYER — a start cell, a respawn,
a quest drop, a fast-travel target, a camp site — asks "can he leave from here"
BEFORE it asks anything else. Reachability is not a quality to be scored against
other qualities. It is a filter, and it comes first.

## THE LIFE LESSON UNDERNEATH (never preached in game)
A place you cannot leave stops being a home and becomes a cage, and the
difference is not how nice the place is. It is whether the door works.


---

## 8/2 — THE LAW ARRIVED ON THE SURFACE HE ACTUALLY PLAYS

Everything above was built into `slices/BOHEMIA_RUN_CURRENT.html`, proved by
walking that file in a real browser, and shipped green. **Then the ONE WORLD TAB
measurement found that `#p-run` is `display:none` for the entire life of the
app** — he has never seen that file. When he taps RUN he is looking at the
**CITY FRAME's walk mode**.

So the fix for the complaint he actually made never reached the screen he made
it about. **That is three for three on this lane's oldest failure: fix the
surface he cannot see, prove it there, ship it green.**

**WHAT WAS WRONG ON THE REAL SURFACE:** the city frame's DROP IN put him at the
centre of whatever cell the camera was over, then spiralled to the first
**walkable** cell — and walkable includes dead-dirt back yards. So it dropped
him behind a house, inside a walled subdivision, facing a wall.

| | before | after |
|---|---|---|
| worst search to find a road | **9,432 tiles** | **3 tiles** |

Every drop-in now lands **on a road or touching one**. Preference, not a filter:
road, then touching-a-road, then any walkable cell exactly as before — so a
place with no road at all still drops you in rather than refusing, and nothing
can become unreachable.

**No walkability changed.** Not one cell became solid or walkable; only *which*
walkable cell the camera hands you. That is why this cannot regress the law
above.

`gates/no_prison_gate.js` section D drives the city frame's own `swapMode()` —
the real DROP IN — and asserts every landing reaches a road, lands on or beside
one, and that finding the street is a step rather than an expedition. Proved
able to fail: disabling the road preference puts the worst case straight back to
9,432 tiles.
