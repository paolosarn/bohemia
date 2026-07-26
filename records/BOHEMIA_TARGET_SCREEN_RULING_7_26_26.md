# BOHEMIA — THE TARGET SCREEN RULING + POST-MORTEM (Paolo 7/26/26)

## WHAT HE SAID, VERBATIM

> "Front base is the only one I'm concerned with and even then it looks like
> hallucinated AI slop. We made a rule that all cars are 2 x 3 tiles. Yeah the
> roofs are all fucked up not put on correctly yeah"

Three rulings in one breath. NOTES ARE RULINGS: none of this was re-asked.

---

## RULING 1 — THE FRONT FACE IS THE DIRECTION. THE OTHER TWO ARE DEAD.

"Front base" is the FRONT FACE candidate (A). It is the direction for the
walkable street level. B (true 2:1 iso) and C (the dollhouse cutaway) are
**GRAVEYARDED** — registry lines added to `gates/bohemia_graveyard.txt` the same
turn, renders moved to `records/target/graveyard/`, and **their renderers were
DELETED from the factory**, not switched off. A working iso renderer sitting in
the live tool is an invitation to remake a corpse, and GRAVEYARD IS FINAL. Git
history is the only copy.

**POST-MORTEM, B — THE ISO BLOCK.** It was the prettiest of the three and it was
still wrong. Three reasons it deserved to die:
1. It threw away the grid the game already walks. The run, its collision and the
   whole valley are square cells; iso meant a second renderer and a second
   coordinate system for a look, not for a mechanic.
2. It broke the approved corpus. The car wrecks, the barrels and the rocks were
   all cooked near-top-down for a square grid; in true dimetric they read as
   stickers lying at the wrong angle. The screen showed that cost honestly and
   the cost was real: iso meant re-cooking the prop corpus.
3. The street eats the middle of a portrait phone. Every iso composition pushed
   the frontage to the edges, which is the opposite of what a street-level
   camera is for.
CARRY FORWARD: nothing. The district CITY-BUILDER view is still iso; that is a
different surface and was never part of this verdict.

**POST-MORTEM, C — THE CUTAWAY.** It was B plus a trick, so it inherited every
one of B's failures and added wall-hiding rules per building type. Its one real
idea — that you should be able to see the room you are in — is already served by
the law that says an interior is exactly the exterior footprint, reached through
a door. The door is the answer, not removing walls.

---

## RULING 2 — CARS ARE 2 x 3 TILES

Already locked ("2x3 i told you"), already in `engine/bohemia_prop_scale.js` as
`vehicle: {mode:'FOOTPRINT', fp:[3,2]}`, and revision 1 broke it anyway.

**WHY IT BROKE.** The factory dropped the approved car sprites at the size they
were painted (46 x 96 px against a 44 px cell), which lands at roughly 1 x 2
tiles. Nothing in the machine knew the vehicle law existed, because the art tool
had never been told to ask.

**THE FIX, AT THE ROOT.** The factory does not contain the number 3 or the
number 2 for a car anywhere. `car_footprint()` parses
`engine/bohemia_prop_scale.js` at render time and fails loudly if the law moves.
A car is scaled to fill exactly `CAR_L x CAR_W` cells and is **turned to lie
along the surface it is parked on** — cars in an east-west road run 3 tiles
across and 2 deep; the one nosed into the driveway runs 3 deep and 2 across.
Gated: `target_screen_gate.py` asserts the resolved footprint is 3x2, that the
factory reads the engine rather than typing a number, that the engine still says
3x2, and that the orientation code exists.

---

## RULING 3 — THE ROOFS WERE NOT PUT ON CORRECTLY

He was right, and the cause was worse than a wonky angle.

**WHY IT BROKE.** Revision 1 used a cavalier shear: the TOP face was offset to
the right by `0.34` cells per cell of height while the FRONT face was drawn as a
plain, unsheared rectangle. That is not a projection, it is two projections in
one sprite. On a 4.2-cell-tall house the roof was displaced **54 px — about a
tile and a half — sideways off the walls it was supposed to be sitting on.**
Every roof in the plate was sitting over its neighbour.

**THE FIX.** `SHEAR = 0`, permanently, and gated at zero. A roof sits square
over its own footprint. The 45-degree read now comes from the roof being an
actual roof instead of a stripe:

- a **hip trapezoid** — full-width eave line, shorter and higher ridge, the two
  ends sloping in, which is the Vegas tract-house form
- the **hip ends are the same roof material** at a different value, never a flat
  colour wedge (the first attempt filled them with solid tan and the roof read
  as a red panel with beige cardboard wings)
- a **sun-caught ridge** with its own shadow line under it
- a **fascia board** at the eave, lit along its top edge, dark underneath
- the **eave's cast shadow** thrown down the wall below the overhang
- roof texture at an 18 px texel so shingle courses read as courses, not bricks

Gated: shear is zero, `hip_roof` exists, and the ridge / fascia / eave-shadow /
material-not-flat-fill clauses are all asserted by name.

Commercial masses take the flat-roof path instead: a parapet you see the outer
face of, a lit coping, and a dressed deck behind it (AC units, vents).

---

## WHAT IS STILL OPEN

"Even then it looks like hallucinated AI slop" was aimed at the whole look, not
only at the two defects he named. The two named ones are fixed and provable —
`records/target/PROOF_car.png` and `PROOF_roof.png` put the tile grid over them
so he can count it himself. Whether the look is now good enough to build the
game toward is **his call and is not decided here.** The judge page is a single
one-tap verdict: GOOD ENOUGH / COULD BE BETTER / STILL SLOP.

If it comes back STILL SLOP, the next suspects in order are the ones the machine
cannot see: the whole plate sits in one narrow tan value range because the
approved wall corpus is one tan material; the palette is unindexed (46,082
colours, section 6 of the render contract); and the buildings are still simple
boxes rather than the massing-with-signature the Pocket City bible asks for.
None of those are guesses to act on before he rules.

## FILES

- `records/target/BOHEMIA_TARGET_A_FRONTFACE.png` — the live target, revision 2
- `records/target/PROOF_car.png`, `PROOF_roof.png` — the two fixes under a tile grid
- `records/target/graveyard/` — B and C, kept as the record only
- `gates/bohemia_graveyard.txt` — the two tombstones
- `laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md` — no-shear and the car law pinned
- `gates/target_screen_gate.py` — 91 checks
