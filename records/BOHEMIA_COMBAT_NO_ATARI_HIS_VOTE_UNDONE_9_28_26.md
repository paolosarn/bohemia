# V230 — NO ATARI: THE BOARD HE SAID LOOKS BETTER IS THE DEFAULT AGAIN (COMBAT, `[fight on the grid]`, round 4)

## HIS VERDICTS ON THIS LANE'S CARDS, READ FIRST

| card | vote | his words |
|---|---|---|
| `combat-one-house-is-not-one-tile-9-27` (house board beside the 32 px cell board) | **DOWN** | "Now looks better than what you had planned, bro that was really bad" |
| `combat-the-only-high-ground-9-27` | **UP** | "higher terrain for us could mean like a building... with the roof that you can be on instead of a collapsed roof or maybe a three-story building... look at the way Battle Brothers does it... the buildings have to get taller" |
| `combat-the-button-your-thumb-finds-9-24` (the one cut ring) | **UP** | "Were deciding if the movement pad is even in the game or not" |
| `combat-the-same-man-every-frame-9-24` | **DOWN** | (no words) |

**And rule 37a, LOCKED:** *"NO ATARI. Pixel detail is never reduced... The 32 px cell and the
28 px one-cell sprite are DEAD as defaults. BEFORE ANY GRID IS BUILT, he sees OPTIONS."* Plus
s16: the world unit is DIRECTION's 0.75 m cell, and *"the pixel size of a cell is his pick
from [tile options]."*

## WHAT I HAD DONE

**I built and shipped the board he voted down.** V227 made the fight's tile a 3 m cell drawn at
32 px and shrank the man to one cell, on the strength of rule 34's defaults, one round before he
saw the card. Two things were wrong with it by the newest rulings: the pixels (32 px, "Atari")
and the world unit (3 m, where DIRECTION's is 0.75 m). **The root cause is that I made a pick the
law now says is his, from options he had not seen.**

## WHAT SHIPPED

**The scale is a row in a table, and the default row is the one he chose.**

```
  house (DEFAULT)   a tile 12 m   man 112 px, FULL DETAIL   TILE_WIDE 1.75   reach 1/2/3 tiles
  cell  (option)    a tile  3 m   man  32 px               TILE_WIDE 1      reach 4/8/12 cells
```

Both rows keep his 9/22 distances: 12, 24, 36 metres. The cell row is not deleted, because
[tile options] (WORLD + COOK) needs every candidate to be something one call can show him **in
the real fight** rather than a mock-up. Nothing picks it by default.

- **The names stop lying.** V227's `CELL_*` constants were about to hold house numbers again;
  they are `BOARD_*` now, true whichever row is picked.
- **V229's four-by-four lot layout runs only on the cell row.** On the house board a tile already
  is a house, so the layout he approved comes back untouched.
- **V228's one-tile high ground is kept, and on the house board it is a building.** One tile of
  high ground there is one house-sized raised block, one to three houses from him — which is his
  UP: *"a building with the roof that you can be on."*

## MEASURED

`gates/no_atari_gate.js` **10/0** on the one driver (it was `the_fight_is_on_cells_gate.js`,
which asserted the rejected board as default; **turned over, not deleted**, because a gate green
on a thing he rejected is the failure this lane's 9/12 note names). It checks the default is his
pick, the man is 112, a tile is 12 m, the house is 1.75 sprite widths of him, his three
distances, the lot layout he approved tile for tile, that the cell row still derives when
picked, and that switching back restores the default exactly.

`combat_scale_gate` **8/0**: its body arm is back to the full-detail 112 it asserted before rule
34 briefly moved it — newest date wins, and the newest is his vote. `one_terrain_effect_gate`
**7/0**: the high ground still fires on the house board. Photographed in a real fight walked into
off the street: the man full size, and after two steps, *"UP THE STAIRS — cover on the lot stops
counting."*

## NOT REGISTERED IN VOTE, ON PURPOSE

Rule 22 asks for a thing he can see every round. The thing this round is **the correction
itself**, and it is in the COMBAT tab. A card asking him to thumb it would be asking him to
re-confirm his own ruling, which NOTES ARE RULINGS (7/19) forbids.

## WHAT IS NEXT, IN ORDER

1. **High ground is a building** (his UP, rule 37 s7: two and three storeys, a standing roof is
   high ground, a collapsed one is not). The rule already works; the picture is a staircase among
   crates. With COOK.
2. **How a tap moves a man on a square grid** (rule 37g gives it to this lane) — and movement
   GLIDES (37h, with ANIMATION).
3. The DOWN on `combat-the-same-man-every-frame-9-24` came with no words. It is recorded; nothing
   is reverted on it, because V225 is what keeps the full-detail man one size at every camera
   width, which is the board he said looks better.

---

**Tool:** `tools/bohemia_no_atari_patch.py` (and the replay list carries nine) · **Gate:**
`gates/no_atari_gate.js` 10/0 · **Stamp:** 9/28d · **Tab:** COMBAT, and any fight from CITY.
