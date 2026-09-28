# V231 — HOUSE TILES BACK: THE CELL BOARD IS GONE, THE STREET IS A STREET, THE HIGH GROUND IS A HOUSE (COMBAT, `[house tiles back]`, round 1)

## THE RULINGS

- **Paolo 9/28, overworld law s14:** *"In combat the boards and the tiles are as big as parts of the
  city: a house is one tile. I've told you this millions of times... for the combat a tile is as big
  as a house."* s14(b) the cell-grid fight (V227 to V229) is dead; s14(c) the walk's banks dress the
  house tiles; s14(e) the mound is a house tile with height, a roof.
- **His UP on `combat-the-only-high-ground-9-27`:** *"a building... with the roof that you can be on
  instead of a collapsed roof, or maybe a three-story building... the buildings have to get taller."*
- **Rule 39a (9/28):** *"COMBAT builds the house-tile fight NOW, no school round first."*

The board had `[house tiles back]` and `[fight on the grid]`'s status words on each other's lines;
swapped (status words only) and claimed in 9a67c75 before any work.

## MEASURED FIRST

On the one driver, 120 arenas, before touching anything:

| what | number |
|---|---|
| street fights | 80 |
| high ground in the carriageway (road 51, median 14, lane 10, gutter 5) | **80 of 80** |
| the street, on the house board | **17 houses (204 m) wide**, on a glass 6.6 houses across |

The street bands were written one per BODY tile (1.5 m) and the house board kept them one per
HOUSE (12 m). So on the house board **no fight ever had a house on screen**, and a house-sized high
ground could only ever have stood in the middle of the road.

## WHAT SHIPPED

1. **The cell row is deleted, not kept.** V230 kept it for [tile options]; s14(f) says the options
   are house and street tiles at full detail, so a 32 px cell row is a dead shape (GRAVEYARD IS
   FINAL). Gone: `cellBoard()`, V229's four-by-four lot layout, its roof slices, the bench's
   "A TILE IS A CELL". `setBoardOpt('cell')` is refused.
2. **The street is four houses wide.** On the house board only: two tiles of road (24 m, a
   four-lane Las Vegas street), one tile of sidewalk and parkway each side, then the lots. Parked
   cars sit on the road tiles, from the same one die. The body board is byte for byte.
3. **No roof lies on the ground.** On the house board the lot is yards and property walls. A roof
   drawn flat where men walk is the 9/18 "checkerboard of orange roof tiles for a floor".
4. **The high ground is a standing house on a yard,** two or three houses from him, across the
   sidewalk, from the same five dice in the same order. Drawn as a building, baked once per size:
   the street's own cooked roof on top (the floor you stand on), two storeys of the street's wall
   tile under it, dead windows and one lit with somebody in it, a door, a steel stair down the face.
   **Solid**: V113 faded "the floor you are not on" to 42%, right for a scaffold over your head,
   wrong for a house across the street; it goes see-through only while a body is behind it. A
   warehouse mezzanine and a room keep the scaffold.
5. **The front walk.** Cover is rolled in a ring from 1.5 houses out, which is exactly where the
   house now stands: a rock sat on the way to its stair in **49 of 79** fights. The steps a thumb
   takes from him to the stair are kept clear (a car cleared whole, V110's rule). No die drawn.

## MEASURED AFTER

- `gates/no_atari_gate.js` **13/0**: the default is his pick, the man is 112, a tile is 12 m and
  1.75 of him, 12/24/36 m, the cell board refused with no names left, the street reads
  `lot lot lot walk road road walk lot lot lot`, 0 roofs on the ground of 128 lot tiles, the high
  ground on a lot **36 of 36** and standing **36 of 36**, 2 to 3.61 houses off.
- `gates/one_terrain_effect_gate.js` **7/0**: walked there with the real button, **80 of 82**
  reached (2.45 steps), then **243 of 353** shots eased, 295 dial tiers saved, in 80 fights, **0
  made harder**. The walker now side-steps a rock the way a thumb does (straight, then either side);
  the side-step count is printed beside the result.
- combat_scale 8/0, combat_floor 13/0, fight_floor_cache 17/0, combat_runs_smoke 1/0.
- Known reds, unchanged: lot_is_sixteen 12/10 (its blind cv 300x150), one_mode 7/4 (its row),
  house_board 2/1 (red on main). REUSE-FIRST 239 -> 4 red: this lane's four old patch tools now
  carry REUSE CHECK blocks; the four left are other lanes'. vote_tab red only on the coordinator's
  rows.

## THE FINDING OF THE ROUND, AND IT IS THE NEXT JOB

**At the camera the fight actually uses, a house is smaller than a man.** Measured over 40
arenas: the auto frame (V23/V225) sits at its **0.20 floor in every one**, because it pulls back to
hold the farthest enemy (six houses out) while the man stays 112 px (rule 21). So a house tile is
drawn **39 px** beside a **112 px** man. At zoom 1 the glass holds **two** houses across. The rules
as written cannot all hold on a 390 px phone: a 112 px man, a 196 px house, and every enemy on
screen. Photographed both ways (the card shows the fight's own frame; the house close-up is cropped
from it). This is what the next round works on, as the lane's own decision under rule 39a: the
camera stops pulling back past the point where a house is narrower than a man, and the men past the
edge of the glass are shown at the edge instead. [PENDING Paolo] only if that trade is wrong for
him; it is built either way.

## [bb high ground]

Battle Brothers makes height part of the ground: hills every tile shares, climbed by walking onto
them. **What we do differently:** height is a thing in the city you can name, the house across the
street with its roof still on, climbed by its own stair for one pip, and it pays through the cover
of the men below you, not a flat bonus on every shot.

## ANALOG HORROR LINE

Every window is black except one, and there is somebody standing in it. Nothing on screen says
who.

## VOTE

`combat-the-roof-you-stand-on-9-28`: before and after at the same seed, same frame, plus the house
close. The card says in words that the house is smaller than the men and that it is next.

---

**Tool:** `tools/bohemia_house_tiles_back_patch.py` (the replay list carries ten) · **Gates:**
`gates/no_atari_gate.js` 13/0, `gates/one_terrain_effect_gate.js` 7/0 · **Stamp:** 9/28m ·
**Tab:** COMBAT, and any fight from CITY.
