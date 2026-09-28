# V227 — THE CELL BOARD (COMBAT lane, `[fight on the grid]`, round 2)

**Paolo 9/27, LOCKED, rule 34:** *"one house doesn't equal one tile, it's all fucked up."*
A COMBAT TILE IS A HOUSE (9/4) and THE STEP IS A HOUSE (9/15) are superseded. The fight is
on the close grid, in cells.

Round 1 measured and proposed. This is the build.

---

## IT IS THE SAME SWITCH, SET TO TWO

Nothing new was added and nothing new is drawn. V198 gave this file a **switchable board**:
`tileK()` says how many body tiles are in one board tile, and every ruler already reads it —
metres, sight, reach, the ceiling, the floor patch, how far the world is built. The house
board was that switch set to 8.

**The cell board is the same switch set to two**, and the five constants under it re-derived:

```
  a cell is 3 metres      DERIVED: his house is 12 m and rule 34 puts FOUR cells in a house
  a cell is 2 body tiles  DERIVED: a body tile is 1.5 m, and 3/1.5 = 2, a whole number
  a cell is 32 px         BY CONSTRUCTION: a person fills his cell, so TILE_WIDE is 1 and
                          tile = 1 x 112 x (32/112) = 32
  reach 4 / 8 / 12        HOUSE_MAX x4: the SAME 12, 24 and 36 metres he approved on 9/22
  sight 24                the same 72 metres the six-house sight meant
```

**Measured on the real glass, walking into a fight off the street, before and after:**

```
                     BEFORE              NOW
  a tile              196 px, 12 m       32 px, 3 m
  the board           1.99 HOUSES        12.19 CELLS across, 20 down
  a person            112 px             32 px, ONE CELL
  sight               6 tiles            24 cells (same 72 m)
  world built to      3.86               13.42 cells, against 6.1 to the edge
```

**And the floor needed no edit at all.** V222 draws a board cell as a patch of the walked
street's own fine cells, sized `round(tileMetres()/0.75)`. At 3 m that is a **4x4** patch
where a house was 16x16. The street's approved art arrives at the new scale for free,
because that number was derived when it was written.

## THE GATE

`the_fight_is_on_cells_gate.js` (V230 renamed it `gates/no_atari_gate.js` and turned it over; V231 deleted the cell row it measured), **12 passed, 0 failed** at the time, on the one driver. It holds
**the derivations, not the values**, because a typed constant goes stale the first time a
lane tunes one and then the gate is green about a board nobody is playing. It asserts a cell
is three metres *because* four fit a house, that this makes it exactly two body tiles, that
the 32 px falls out of the sprite arithmetic rather than being typed, and — the claim that
matters — **that a pistol still reaches twelve metres, a rifle twenty-four and a scope
thirty-six.** Not one distance he approved moved.

`gates/combat_scale_gate.js` was re-aimed to the newest ruling and **not loosened**. Two arms
asserted 112 and `TILE_WIDE * 112`, because that was the ruled body when they were written.
Rule 34 re-reads rule 21 rather than repealing it — one size at every zoom, and the size is
now one cell — so the sentences are word for word the same and the numbers follow the board:
the fighter equals the cell, and the lot is TILE_WIDE sprite widths **of the ruled body**.
Hardcoding the sprite is the exact defect this file caught in V225 one arm above.

---

## AND I LOST V226 IN A REBASE, WHICH IS THE ROUND'S REAL FINDING

**His 9/7 ruling fell off the fight and nothing went red.** V226 made the fight's mover the
walk's one cut ring, and a photograph this round showed **eight loose lettered circles back
on the glass** — the shape he rejected. The mark was gone from main's blob.

The cause is mine and it is dull: another lane pushed an alpha change, I took main's alpha
wholesale the way this lane's ship flow says to, **replayed V225's tool onto it and forgot
V226's.** No gate could catch it: every gate in this lane is about the board, and the ring is
drawing code. It was found by looking at a picture.

The flow was never wrong — *"take main's alpha and replay the patch tools, they are all
idempotent and that is exactly what they are for"* — but **the list lived in my head, and a
list in a head loses an entry.** So the list is on disk now:
`tools/bohemia_combat_replay_all.sh`, every live patch in order, free to run on a tree that
is already current.

## WHAT IS NOT DONE, WITH NUMBERS

1. **The person is small now**, and that is the honest cost of one cell. It is on the VOTE
   card in those words rather than buried.
2. **The thumb ring is big next to the board.** It was 180 px against a board of two houses;
   it is 180 px against a board of 390. Same gap `one_mode_gate` already names at 90 vs 180,
   now much easier to see.
3. `[weapon shapes]` is its own row: the machine gun sweeping a line of cells.
4. **Zone of control**, named last round as the one thing to steal from Battle Brothers, gets
   cheaper on this board because "next to you" is now a fact the grid knows. It belongs to
   `[fight feel]`, which folds into this row.

## RULE 22

In the VOTE tab as `combat-the-fight-is-on-cells-9-28`: the same fight walked into off the
street, photographed one build apart, with both costs said on the card.

---

**Tool:** `tools/bohemia_the_cell_board_patch.py` · **Replay:**
`tools/bohemia_combat_replay_all.sh` · **Gate:** `gates/no_atari_gate.js` (was the_fight_is_on_cells_gate.js; renamed by V230) ·
**Stamp:** 9/28a · **Tab:** COMBAT, and any fight you walk into from CITY.
