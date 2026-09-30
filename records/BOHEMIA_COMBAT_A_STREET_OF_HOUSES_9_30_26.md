# V233 — HOUSE-SIZED, NOT HOUSE-FILLED: THE NEIGHBOURS STAND UP (COMBAT, `[house tiles back]`, round 3)

## THE RULINGS

- **Paolo 9/28, on this row:** *"one tile is the size of a house doesn't mean every tile is a
  house; it still has to look like a city; we have neighbours, we have so many assets, we have
  streets."* The board is cut from a block: houses, yards, streets, sidewalks and kerbs, cars, the
  roof tile. **GATE OWED: a street and a non-house kind on every board.**
- **Rule 37g (9/27):** high ground is a roof; *a standing roof is the mound, a collapsed one is not.*
- **Rule 46 (9/29):** a board has tile BLOCKERS; *"how did Battle Brothers do it"* answers first.

## WHAT V231 LEFT

A street four houses wide and one house you can climb, but the lots were yards and walls only: the
fix for the 9/18 checkerboard (a roof lying flat where men walk) took the neighbours away with it.

## WHAT SHIPPED

1. **The lot is a street of houses**, counted from the kerb on each side: a row of houses facing the
   street (a driveway gap every third one), their back yards, the alley wall, the next street's back
   yards and houses. House board only.
2. **Every house stands up and is a blocker.** The ground under it is yard; the house is V231's
   baked building; and it is a tall piece of cover the size of a house, which is Battle Brothers'
   tile blocker dressed as a house: no walking through it, it hides you, it stops a line of fire.
   The cover pieces already do all three and the enemy's step already refuses a cell inside one,
   so a house is simply one of them. Nothing new in the rules.
3. **The one you climb keeps its roof; the neighbours' roofs have fallen in.** Rule 37g in pixels:
   a hole, the dark inside, three joists still across it, broken shingle at the edge; no lit window,
   no stair. The climbable house is one of the row facing the street, two houses from him.
4. **Nobody starts inside a house:** a crate rolled onto a house tile goes (a car whole), an enemy
   who spawns on one steps to the nearest open tile, and so does the way out. No die drawn.

## MEASURED

`gates/no_atari_gate.js` **16/0** (three new legs): the lot is houses, yards and walls; **every
board of 24 carries a street and five kinds of ground** (road, walk, house, yard, wall); **336
houses standing, 0 without a blocker**; **0 things inside a house** (enemies, crates, cars, the way
out). `one_terrain_effect_gate` **7/0**: the climbable house reached **82 of 82** (was 80 of 82),
2.00 steps, then **251 of 361** shots eased, 311 dial tiers saved, **0 made harder**.
`a_house_is_never_smaller_than_a_man` 7/0, combat_scale 8/0, runs_smoke 1/0, fight_floor_cache
17/0, combat_floor 13/0, combat_lab 922/10 (main's 10), one_mode 7/4 (its row). REUSE-FIRST: the new
tool carries its block.

**FIGHT LENGTH (rule 40a): NOT MEASURED**, third round saying so. No tool plays a fight to its end.
It is the next thing this lane builds after the cover, because [fight feel]'s ship test needs it
too.

## WHAT IS NEXT

1. **The cover is drawn house-sized.** In every photograph the blue-topped barrels are the loudest
   thing on the board: a piece is drawn `ring*1.8*r` wide, sized to the tile rather than to a
   barrel, so on the house board a barrel is as big as a house. With COOK / `[cover honest]`: the
   cover drawn at the size of the thing it is (a car, a dumpster, a wall), from the walk's banks.
2. A fight-to-the-end driver, for rule 40a's number.
3. Then `[board generator]` (rule 46): the board cut from the map cell's terrain and district.

## [bb blockers]

Battle Brothers' blockers are trees, rocks and ruins scattered by terrain: you walk around them and
hide behind them. **What we do differently:** the blocker is the neighbour's house, laid out the way
a real Las Vegas street is laid out (a row facing the street, driveways, back yards, the alley
wall), and the one whose roof still stands is the only high ground on the board.

## ANALOG HORROR LINE

Every roof on the street has fallen in but one. That is the one somebody is already standing on.

---

**Tool:** `tools/bohemia_house_sized_not_house_filled_patch.py` (the replay list carries twelve) ·
**Gate:** `gates/no_atari_gate.js` 16/0 · **VOTE:** `combat-a-street-of-houses-9-30` · **Stamp:** 9/30a · **Tab:** COMBAT, and any fight from CITY.
