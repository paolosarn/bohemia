# V228 + V229 — THE MOUND IS ONE CELL, AND A HOUSE IS FOUR BY FOUR (COMBAT, `[fight on the grid]`, round 3)

**Paolo 9/24, rule 33d:** *"ONE terrain effect in the whole fight, a small mound = accuracy
bonus."* **Rule 34:** *"the mound is ONE CELL of COVER."* Both in this row's own words.

---

## V228 — THE MOUND IS ONE CELL, AND IT FIRES

**Before:** measured twice by this lane's own gate. On the house board the high ground was a
slab about 9 tiles across; on the cell board still 8.86 cells (27 m), its stair six cells off.
The player started on it 0 of 120 times and it eased **0 of 519** shots.

**The change:** the slab is one cell, one to three cells from him. A one-cell deck is its own
stair (the builder marks the tile nearest the bottom edge as the entrance, and there is one),
so V106's climb and descent do the stepping and his V114 pip is the price. **No new movement
code.** V140 already keeps an enemy off high ground inside your reach, so the mound starts
empty for a reason written down two months ago.

**The dice deal the same cards.** The old block drew five numbers; this draws the same five
in the same order and simply does not use width and depth on the cell board. The patch tool
counts the draws and refuses to write if the count is not five.

### And measuring it found a rule that could never fire

Walked there with the real `doMove`, 77 of 84 mounds reached in 1.96 steps. Then the shipped
`highGroundEdge` eased **0 of 333** shots. So I measured why rather than guessing:

```
  men below him            333 of 333
  men in range             288 of 333
  men IN COVER             0 of 333
```

**Two old rules cancel.** V90 (`realCoverPillar`): *"if we are on different floors, the stone
between us on the ground is not between us at all"* — so the instant you climb, every enemy's
cover switches off. V114 (`highGroundEdge`) only pays over a man **in cover** below you. The
second can never fire once the first has run. **It never has, since the day it was written.**

**But the first rule IS the accuracy bonus.** Same men, same places, only the height changed:

```
  in cover on the ground           112 of 333
  shot made easier by the height   112 of 333   (every covered man)
  dial tiers saved                 138
  made harder                      0
  fights where it helped           63 of 77
  eased through highGroundEdge     0
```

**The one terrain effect he kept now fires, through the cover rule, in 82% of the fights where
he takes the mound.** `highGroundEdge` is named, not deleted: his 8/2 words are above it, and
the distance falloff it tried to add ("steepest right under you") is a felt number for chat 21
TUNING, which now owns every one.

The gate (`one_terrain_effect_gate`) was re-aimed twice this round and **not loosened**: it
asked "does it fire in a fight he plays" at the bell, before anyone moves, which a mound can
never win; then it counted `highGroundEdge`, the dead door. It now asks **the dial**, which is
the only thing he feels. **4/2 for two rounds → 7/0.**

---

## V229 — A REGRESSION I CAUSED, FOUND BY PHOTOGRAPH

The photograph of the mound showed the lots on both sides of the road as **an orange
checkerboard of tiny roofs** — word for word the first line of what embarrassed him in front
of a friend on 9/18 (rule 17).

**The cause is V227, mine.** `lotSubKind` laid the lot band out as *"a wall every fourth
column, house on even rows, yard on odd rows"* — written when one board tile was one house, and
quoting him: *"a house with a big backyard is now one by two tiles big."* V227 made a tile 3 m
and did not re-derive it, so the same sentence painted a roof stripe one cell tall, and the
house art — which is one whole roof — was stamped into every 32 px cell.

**The same defect class this lane keeps finding in other code: a number written in a unit the
game has moved past. This time I wrote it.**

**The fix, derived:**

```
  a house        4 x 4 cells        rule 34 s5
  a property     4 house + 4 yard   his "one by two"
  between them   1 cell of wall     V97's property wall, kept
```

And **a roof is drawn once across its house**: each house cell draws its slice of one roof
built at four cells square, from the same approved bank, in its own cache (asking the street's
cache for a size four times the cell would empty it on every cell of every frame).

The lots now read as houses along a street.

---

## WHAT IS NOT DONE, SAID PLAINLY

1. **The mound looks like a little ladder, not a hill.** A one-cell deck draws with the stair
   glyph. That is art: COOK `[cell tiles]` and DIRECTION.
2. **The fight still draws its own street** rather than the cells he is standing on in the
   walked city. That is the rest of this row and of `[one mode]`.
3. **The thumb ring is 180 px against a 390 board.** Carried.
4. **`highGroundEdge` is dead code with his words above it.** For TUNING.

## THE INSTRUMENT FINDING

**Rebases eat patches, and it is fleet-wide.** Last round I lost V226 that way; this round
CHARACTER's commit says *"a rebase silently reverted two other lanes' fixes."* This lane's
answer is `tools/bohemia_combat_replay_all.sh`: every live patch, in order, run after every
rebase. It now carries eight.

## RULE 22

In VOTE as `combat-houses-and-a-mound-9-28`: the same fight at the same spot, one build apart —
the checkerboard and the houses — with the mound's numbers and what it still looks like on the
card.

---

**Tools:** `tools/bohemia_the_mound_is_one_cell_patch.py`,
`tools/bohemia_a_house_is_four_by_four_patch.py` · **Gate:** `gates/one_terrain_effect_gate.js`
7/0 · **Stamp:** 9/28c · **Tab:** COMBAT, and any fight you walk into from CITY.
