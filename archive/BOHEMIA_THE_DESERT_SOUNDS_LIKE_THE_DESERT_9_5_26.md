# THE DESERT SOUNDS LIKE THE DESERT (9/5/26, SOUNDS lane)

**[unused sounds] THE-OTHER-51, round 2. Still CONTINUING.**

Round 1 replaced the row's grep with a measurement: the walked surface produced
**nine** of his sixty-five approved sounds. Round 2 takes that measurement's
sharpest finding and fixes it. It is **twelve** now.

## WHAT THE MEASUREMENT FOUND

Walking onto real cells with the game's own `stepOnce`, four of the six approved
footstep surfaces fired end to end. `step_sand` and `step_wood` were not found
within sixty cells of the spawn.

So I sampled wider: **18 districts, ~9,000 cells.** The whole valley produced
exactly **four** surfaces — dirt, concrete, asphalt, gravel. **No sand and no
wood anywhere in it.**

**And the desert reported dirt.** Inside the `desert` district itself: 76 dirt,
3 asphalt, 1 concrete, no sand at all. In a game whose valley is the Mojave,
walking out into the desert played **the same footstep as a suburban lawn** —
while `step_sand`, approved in his 270-thumb sweep on 8/12 and labelled in the
engine's own table **FOOTSTEP — DEEP SAND**, had never once played.

## WHY, AND IT IS MY OWN FIX FROM THIS MORNING

The ground classifier now reads `gArtPool`, and the pool table's else-branch
sends every ground that is not a road, a walk or water to **`hyard`** — the yard
pool. That is right for a suburban lawn and it is also what the desert floor
gets, because the desert has no pool of its own. **One pool, two completely
different grounds, and a pool cannot tell them apart.**

## THE FIX IS THE ONE FACT THE POOL CANNOT CARRY

The district. The step site already knows the cell; the district is one overmap
lookup away, read exactly the way every other system in that file reads it. So
`__surfaceOf` takes the district too, and the default ground of a **desert** or a
**wash** is sand.

**Only those two, on purpose.** Not `basin`, which is a dry lake bed and really
is silt; not `boneyard`, a junkyard on graded ground; not `mountain`, which is
rock. Two districts whose floor is unambiguously sand in this valley — REALISM
FIRST decides it, not taste.

**And it is a fall-through, not an override.** Measured after: the desert's roads
are still asphalt and its sidewalk still concrete, the suburb is untouched at
3,316 dirt, the arterial is untouched. Only the ground nobody named changes.

## step_wood GETS A WRITTEN REASON, NOT AN INVENTED CALLER

There is no wooden ground in this valley — no boardwalk, no porch deck, no
floorboard pool — measured across eighteen districts. Wiring it would mean
**inventing a surface so a sound has somewhere to play**, which is the opposite
of this row's job. It stays approved, judgeable, and named as unreachable with
the measurement behind it.

## THE GATE

`gates/every_sound_is_reachable_gate.py`, 16 claims. All five reachable footstep
surfaces are now walked onto and fired: dirt, concrete, asphalt, gravel, sand.

    the desert goes back to sounding like a lawn  -> RED x2 (and it names step_sand)
       restored                                      16 passed, 0 FAILED

**One more instrument mistake, and it is the ordering one again.** The surface
drive ran at the END of the gate, by which point the player was inside a
building — where `stepOnce` takes the interior path and posts no footstep at all.
Asphalt and gravel read as unreachable on a build where a standalone probe had
just walked onto both. **A step indoors is a different function.** The drive
steps outdoors first now.

## WHAT HE WOULD NOTICE

Walk out of the suburbs into the open desert and the ground under you changes.
It has never done that before.

Tab: **RUN** (the walked city). Nothing to judge — no sound was cooked.
