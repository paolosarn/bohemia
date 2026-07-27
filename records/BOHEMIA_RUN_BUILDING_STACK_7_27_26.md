# THE BLOCK IS BUILDINGS NOW — the run's building stack, rebuilt (7/27/26)

> "it still looks like dog shit u tried to make garages like sideways u's and
>  its very bad man also every wall that hosts a door should be at the least
>  three wall tiles tall and we gotta fix what it looks like when im underneath
>  a wall with an opcacity filter or something man its still bad"
> — Paolo, 7/27/26

Three defects in one sentence. All three were the same root cause: **the run was
painting a three-quarter view's south-facing art onto every side of a mass, and
handing every leftover cell to the roof.**

---

## WHAT WAS ACTUALLY WRONG

I looked at the rendered block before touching anything, which is what the
VERIFY ON THE REAL SURFACE law is for, and the screenshot said something worse
than the three complaints: **a house was one unbroken slab of terracotta twelve
rows deep with a doorway floating in the middle of it.**

1. **The door was on the wrong side of the building.** `deriveDoors` picked the
   first house cell touching a driveway in scan order. In this valley the
   driveways come in from the WEST, so the doors landed on north and west edges.
   There is no north wall and no west wall in this projection — you see the
   SOUTH wall of a mass and roof over everything else — so those doors were
   holes punched in a roof.
2. **The garage.** First cut: roll-door every garage cell a driveway touched, so
   a driveway wrapping two sides drew a door wrapping two sides. Second cut:
   pick the winning side by counting — and the winning side here is WEST, so it
   drew a seven-tile *vertical stripe* of a tile whose art is the bottom half of
   a bay seen head-on. **That stripe is the sideways U.**
3. **The roof was a field.** The face was one band four rows deep and the entire
   rest of the footprint went to `roof_slope`. Nothing in the frozen target
   frame is ever more than three rows of roof.

## THE MEASUREMENT THAT SETTLED IT

I opened `records/target/REASSEMBLED.png` — the frozen frame, the only thing
allowed to say what a building looks like — and measured it. **Every building in
it is FOUR courses of wall under a THREE course roof cap** (sun-caught ridge,
slope, dark fascia eave), and the next building's wall starts right behind it.
The whole frame is that rhythm repeating.

## THE RULES NOW

- **THE FRONT IS THE SOUTH FACE, ALWAYS.** A door is the southmost house cell of
  a column with open ground below it, preferring the column that fronts the
  driveway, then the road, then the yard. A door can only live where a wall can
  be drawn.
- **FOUR COURSES OF WALL.** `FACE_H = 4`. The two-tall door leaf sits in the
  bottom two and there are still two real courses standing over its head. That
  is "at the least three wall tiles tall" with room to spare, and it agrees with
  `laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md` (the city lane's law from
  the same ruling).
- **BANDS, NOT A FIELD.** A mass is read in bands off its own south edge: four
  wall, three roof, four wall, three roof. A deep house reads as a front wing
  with a second wing standing behind it, which is exactly what the target frame
  reads as. The LAST band of a column is SHRUNK to fit rather than allowed to
  run on — a leftover handed to the roof is how a house grew a six-course orange
  field, a leftover handed to the wall is how a mass ended in a course of stucco
  standing on nothing. Shrunk, it always ends on a roof.
- **A BAY IS A BAY.** A garage mouth is a south-facing, at-most-three-wide,
  two-tall bay, placed at the end of its run the driveway actually comes in
  from. The rest of the garage front is wall. A garage with no exposed south
  side has no visible mouth and is roof, which is honestly what you would see
  looking down at it.
- **GROUND UNDER EVERY BUILDING TILE.** A hip tile is drawn as "the slope cuts
  in, and above the cut there is nothing", so laying it on bare canvas punched a
  BLACK NOTCH into the top corner of every roof in the game. The dirt goes down
  first and the cut shows the yard through it.
- **THE SEE-THROUGH IS FOR WHAT IS ACTUALLY OVER YOU.** Bodies draw after tiles,
  so nothing here is ever accidentally in front of you. My first cut faded
  whatever sat one and two rows north of the player, which **ghosted the
  character every time he stood in his own front yard with the house behind
  him** — he is IN FRONT of that wall and belongs opaque. Now exactly two things
  fade, at the addendum's 35%: a tile on the **OVERHEAD** layer (the dossier
  law's own pass-under layer — canopy, deck, carport), and **your own doorway's
  leaf** when you are standing in it.

## THE GATE

`gates/run_gate.js`, 120 assertions (was 109). `window.__RUN.look()` reports
what the renderer would actually lay on every cell of the real loaded block, and
`window.__RUN.occluders()` reports what is drawn see-through over the player
where he stands. The new assertions:

| rule | assertion |
|---|---|
| door wall | the street face is four courses; EVERY door in the block stands in >= 3 wall courses; every door is on the SOUTH face |
| garage | a bay is never wider than 3; never a vertical stripe (`tallestBayColumn <= 2`); the block really has bays |
| roof | no roof run is ever deeper than the cap + 1; no mass is capped by a course of wall standing on nothing |
| underneath | standing in the yard with the wall north of you leaves you OPAQUE; standing IN the doorway really fades the leaf over you |

The ghosting regression is gated in **both directions**, for the same reason the
city lane's gate does it: a filter that is always on is not a filter, it is a
bug.

## WHAT THIS DOES NOT DO

Not one pixel of new art. Every tile is the frozen 42-tile starter set from
`banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt`, md5-locked to the visual
constitution. This is entirely about which of his own approved tiles goes where.

## CONCRETE HAS TO BE GOING SOMEWHERE (added 7/27, same day)

> "i dont know why theres so many sidewalk cement things spread around on the
>  floor when it should be like wtf" — Paolo

The yards ran `th(gx,gy,7)===0 -> a sidewalk tile` and `th(gx,gy,11)===0 ->
dirt`, which sprinkled single slabs of poured concrete at random across every
lot on the block. **A sidewalk is not a texture. It is a ROUTE**, from somewhere
to somewhere, and a slab in the middle of a gravel yard with nothing on either
end of it is litter.

Concrete on open ground now happens for exactly one reason: it is a **FRONT
PATH**, running from a front door to whatever pavement the world already put
there — the road, a driveway, the block's gate.

**AND IT BENDS.** Poured straight south it only got out for ten of the block's
twenty-three doors; the other thirteen face the back of the house in front of
them, and a path that dead-ends into a wall is the same litter wearing a
different hat. So it takes the shortest real route across its own yard. Nothing
reachable within `PATH_MAX` tiles means that door gets no path and none is
drawn. 23 of 23 doors now have one. The random dirt speckle went with it —
`yard_0/1/2` already carry the variation.

Gate: `strayConcrete === 0` (every poured tile on open ground is the kerb band,
a driveway the world placed, or a path that arrived) and `pathCells > 0 &&
pathDoors > 0`. run_gate.js is 125.
