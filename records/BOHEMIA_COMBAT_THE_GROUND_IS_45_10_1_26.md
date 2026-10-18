# V240 — THE GROUND IS 45 DEGREES, AND IT IS COMBAT 2'S FLOOR
(COMBAT, `[house tiles back]` round 8, rules 56 and 55)

## HIS WORDS

His fifth votes (rule 56): *"everything we do is 45 when it comes to the land underneath"*; and four NOs on
the sidewalk: *"the sidewalks are way too fucking big... this has to look real first."* A Vegas sidewalk is
4 to 5 ft against a 37 ft roadway; the ruler is at most a sixth of its road.

## WHAT WAS ON THE BOARD, MEASURED FIRST

- the house board drew square cells, straight down: a 90-degree bird's eye;
- the street was three tiles: a 12 m road with a **12 m sidewalk tile each side**, a sidewalk as wide as
  the road, six times his ruler.

## NOW (house board only; the body board is byte-identical)

| | before | now |
|---|---|---|
| the projection | straight down | **45 degrees**: every flat thing squashes north-south by COMBAT 2's own 364/515 (cos 45): the floor's rows, a lit tile, a roof's top, where a body stands, a tap read back to a tile |
| upright things | | keep their height: the man (112, rule 21), wall faces, cover, a house's front |
| the street | road tile + two 12 m sidewalk tiles | COMBAT 2's north-south street: **one tile**, sidewalks 1.4 m on a 9.21 m roadway (0.152, under a sixth), kerbs, the dashed centre line |
| beside it, the yards | sidewalk tiles, street-cell lots | their lot / lot_b; the walls between plots their slab |

Rule 55: COMBAT 2 cut the tiles for this camera (515 x 364); this lane built the camera and laid them.
Nothing was stretched: their 45-degree tiles are drawn into 45-degree cells.

## SAID, NOT HIDDEN

- Dead cars in the lane lie ACROSS the road (their in-lane and kerb sprites run east-west, and turning a
  45-degree sprite would break its light). It reads as a barricade; whether that is wanted is COMBAT 2's
  next cut (an along-the-lane car).
- The standing houses at the edges are still this lane's own bake (the wall tile, two storeys); their roofs
  now lie flat at 45. A house sheet from COMBAT 2 would replace them.
- The settlement lines over the top of the board are still text (one HUD, JUMP 2).

## MEASURED

`gates/no_atari_gate.js` **20/0**, three new legs: THE STREET IS ONE TILE (their north-south street in the
road column, built in a drawn frame); THE SIDEWALK RULER (1.4 m on 9.21 m = 0.152 <= 1/6, and no sidewalk
tile drawn beside the road); THE GROUND IS 45 (a step north drawn 0.7068 of a step east, a lit tile the same,
a tap at (0,2) and (3,-1) reads back to (0,2) and (3,-1)). Before V240 the same gate is 17/3. combat_lab 923/9 (one
pin re-pointed: the floor's row is `_ph` tall now); nothing_on_the_ground 18/0; floor_cache 17/0;
a_house_is_never_smaller 7/0; the others the same before and after (the_person_is_112 13/8, house_board 2/1,
lot_is_sixteen 6/8, one_mode 7/4, house_rulers 13/0, the_rout 10/1, combat_floor 12/1).

## FIGHT LENGTH (rule 40a)

**Two faults found while measuring, both fixed this round:**

1. **A fight could hang at 0 health** (rule 57's last leg). One fight in three sat 300 s with him at 0 and the
   fight not over: the damage paths run two unguarded calls between the hit and the loss, and if one throws the
   loss never comes. Now his side down is a loss every frame it is true. `gates/every_fight_ends_gate.js` gained
   the leg: **10/0, and 8/2 on the build before** (health 0, over: false).
2. **My own measuring tool was wrong for every run since it was built.** It started each next fight with
   setupCombat alone, which keeps the last fight's health, so fights 2 and 3 of every run began at **0 health**
   and died to the first hit. Every "4.7 s / 6.4 s / 9.4 s" second and third fight in the records was the tool,
   not the game. It now starts every fight through the game's own restart, at full health.

Honest numbers, cover bot, three fights, real time, this build: **94.2 s** (downed, 3 down of 7),
**77.3 s WON** (all 5 down, and the fight ended itself: V239 seen in a played fight), **22.5 s** (downed).
Median 77 s against the 2 to 4 minute default: close, by a bot that plays badly.

## [bb ground]

Battle Brothers draws its battlefield at an angle: hex tiles seen from above and in front, men standing up
out of them. **What we do differently:** our tiles are square houses of a real street, and the angle is
the same 45 every flat thing in the game is drawn at.

## ANALOG HORROR LINE

The centre line still runs straight down the middle. Nobody has needed it in years.

---

**Tool:** `tools/bohemia_the_ground_is_45_patch.py` (the replay list carries nineteen) · **Gate:**
`gates/no_atari_gate.js` 20/0 · **VOTE:** `combat-the-ground-is-45-10-1` · **Stamp:** 10/1j ·
**Tab:** COMBAT, and any fight from CITY.
