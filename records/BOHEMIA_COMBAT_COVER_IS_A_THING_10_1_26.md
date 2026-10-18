# V238 — COVER IS A THING (COMBAT 2'S PIECES, DROPPED IN); THE LAST MARKS OFF THE GROUND
(COMBAT, `[house tiles back]` round 7, rules 46f and 55, JUMP 1)

## WHY

DIRECTION's floor bar, round 21: *"F5 cover is a thing (own silhouette, >= 3 values, contact shadow)
- TODAY two-tone tan boxes"*; *"F3 ... the man's base a <= 2 px shadow ring ... a fat white ring by
eye"*. The coordinator's 10/1 B sweep: *"a dead car and a block wall from the banks are not under the
fighters yet."*

## WHAT WAS ON THE BOARD, MEASURED FIRST (seed 1, the game's camera)

- cover: the stucco wall tile stretched into tan bands, laid across the road like barricades;
- every parked car **2 x 3 tiles**, his 7/29 size on the 1.5 m tile kept on the 12 m house tile:
  **a car 24 m by 36 m**, each on an oval shadow;
- under every man who sees you, a bone ring 0.8 of a tile wide (V179);
- under every man, his health bar: **133 px of red on the street at his feet**;
- a gun stick drawn from his feet along the ground; the chosen man's amber ring at his feet.

## RULE 55, FOUND AT THE REBASE

Mid-round, main carried rule 55 (Paolo 10/1): **COMBAT 2 makes the floor art, COMBAT 1 keeps the fight
code and drops it in.** My first cut drew cover from art I picked myself (his perimeter walls, the car
bank). **That pick was COMBAT 2's to make, so it was thrown away before the push.** A second cut used
their round-one sprites; by the next rebase they had shipped [cover pieces] and re-cut everything for
the 45-degree camera (rule 56), so this ships **their current seven pieces through my code**.

## NOW (house board only; the body board is byte-identical)

| | how it reads |
|---|---|
| cover on a road tile | COMBAT 2's dead car, in the lane or at the kerb |
| tall cover on a lot | their block wall, the corner, or the shed |
| low cover on a lot | their knocked-through wall with its rubble, or the patrol car on the drive |
| how it is drawn | their sprite whole with their hard shadow, at the biggest whole-number scale that fits one house tile (2x on a 3x phone), seeded by the cell |
| a parked car | **one tile** (a combat tile is a house, 9/28, newer than his 7/29 2x3), to the man's size |
| his health, "he sees you", "your target" | over his head: a 34-body-px bar, a ‹ › round the reach dot, an amber chevron |
| the gun stick | not drawn (the body carries it) |

## SAID, NOT HIDDEN

1. **The scale gap.** Their pieces are true size at the ground's 42.9 px/m and the man draws at about
   four times that, so a 1.8 m wall reaches his thigh on the glass. Rule 21 says the man may not zoom.
   For COMBAT 2 and DIRECTION to answer; I did not stretch their art.
2. **The sidewalks are a whole house wide.** His fifth votes (rule 56): a sidewalk is at most a sixth of
   its road. COMBAT 2's street tile has real 1.4 m sidewalks, but it is cut for a 45-degree camera
   (515 x 364) and this board still draws square cells, so it is not laid yet (stretching it would
   undo their cut). Next after the end condition: the board at 45 degrees, then their ground tiles.
3. The settlement lines (THE MIX, THE WAY OUT) are still text over the top of the board (one HUD, JUMP 2).

## MEASURED

`gates/nothing_on_the_ground_gate.js` **18/0**, four new legs, each proven to bite on the build before
(14/4 there): their walls, dead cars and shed drawn over 16 arenas (172 / 174 / 12 draws); their wall
sprite has **4 values** and its own shadow; **33 cars, every one 1 tile** (was 6); **0 rings, 0 bars at
the feet, 0 gun sticks, 0 oval car shadows** (were 168, 168, 132, 66). combat_lab 922/10 (= main; the
V103 car pin re-pointed with the ruling), no_atari 17/0, one_terrain 7/0, a_house_is_never_smaller 7/0,
combat_scale 8/0, smoke 1/0, floor_cache 17/0, vote_tab 32/0.

## FIGHT LENGTH (rule 40a)

Cover bot, three fights, real time, on the shipped build: **45.7 s, 7.9 s, 4.7 s**, downed each time,
kills 3, 1, 0 (last round 37.2 / 9.4 / 4.7 s, 0 kills). Still far under the 2 to 4 minute default.
And separately, rule 57: a fight he WINS never ended (V159 made the way out the only win); that is the
next ship, V239.

## [bb cover]

Battle Brothers' cover is the map's own objects (trees, rocks, a wagon) in the same art as the ground.
**What we do differently:** our objects are the street's own dead: the block walls, the shed, and the
cars nobody came back for.

## ANALOG HORROR LINE

The patrol car is still on the drive where it stopped. Its lights stayed on until the battery died.

---

**Tool:** `tools/bohemia_cover_is_a_thing_patch.py` (the replay list carries seventeen) · **Gate:**
`gates/nothing_on_the_ground_gate.js` 18/0 · **VOTE:** `combat-cover-is-a-thing-10-1` · **Stamp:** set at
ship · **Tab:** COMBAT, and any fight from CITY.
