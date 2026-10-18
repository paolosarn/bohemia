# THE FIGHT BOARD CUT FROM THE MAP (COMBAT TWO, 10/18/26, [the board at Battle Brothers' size], rule 109)

A CANDIDATE (rule 100). Nothing to slices/, engine/ or the demo. VOTE `combat2-the-board-cut-from-the-map-10-18`,
sheet `records/target/COMBAT2_THE_BOARD_CUT_FROM_THE_MAP_10_18.webp`.

## HOW BATTLE BROTHERS DID IT (rule 41)
Its battlefield is generated from the world tile the fight starts on: the tile's terrain picks the ground, and a fight
in or by a settlement stands among that settlement's buildings. The map tile and the field always agree.

## WHAT THIS ROUND DID
Every board before this one came from a street GRAMMAR (an east-west street every four tile rows, north-south streets
at fixed columns): the same kind of board whatever the map said. Now the board is the block.

1. **Read the map, never draw it.** `tools/bohemia_combat2_read_the_map_cell_10_18_26.js` opens the demo the way a player
   does and saves, for three blocks nearest the party, the map's own fine grid (`cellAt`, the realizer the map draws
   from: 128 x 128 cells a block, with its eight neighbours), the nine blocks' districts and road joins, and the map as he
   sees it at the near stop. Output `reference/art_bank/fight_board/COMBAT2_MAP_CELLS_10_18.json` and
   `COMBAT2_MAP_CELL_{STREET,YARD,LOT}_10_18.webp`.
   - STREET: block 48,49, an arterial running east-west between suburbs (336 such blocks on the map).
   - YARD: block 57,47, a suburb block with suburb all round (213).
   - LOT: block 48,53, a commercial block on an arterial: a big store, a parking lot with planter islands, a shop strip (347).
2. **Lay the board on the block.** `tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py` classifies every
   map cell (roadway, the median's yellow, crosswalk, walk, drive, parking pad, yard, roof footprint, lamp, small solid)
   and lays the large board (20 x 15 house tiles) on the block's middle: COOK TWO's road and walk cells with their curb,
   his painted line and zebra, one muted soil tile for the yards; COOK FOUR's five tan ranches on every residential roof
   footprint (the widest kind that fits, no kind twice running, wall foot on the footprint's south edge); COOK FOUR's
   warehouse, motel, gas station and corner shop along every commercial footprint; his lamp on every map lamp; his bush,
   rocks, junk, dumpster on the map's small solids; cars in the parking bays and wrecks on the roadway at x2.

| board | houses | shop pieces | props | cover | lights | roadway / parking / walk / roof % | colours per 96 px |
|---|---|---|---|---|---|---|---|
| street | 0 | 0 | 90 | 85 | 5 | 27.7 / 11.4 / 9.2 / 0 | 3,169 |
| yard | 22 | 0 | 32 | 20 | 10 | 27.0 / 0 / 15.9 / 29.5 | 3,078 |
| lot | 0 | 27 | 172 | 160 | 9 | 31.4 / 23.3 / 3.4 / 27.8 | 2,304 |

111 pack keys, all UP. Terrain per house tile (blocked, part blocked, flat) from the map's own cells, in the manifest
`reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json`. The boards (13,120 x 9,720) regenerate from the map
file and the seeded tool (.gitignore there).

## THE RULER: A FINDING FOR WORLD, RUN AND THE COORDINATOR
The map's fine cell is 0.75 m drawn (engine/bohemia_overmap.js `CELL_M`) and the map paints a lane two cells wide
(`LANE_W = 2`). A lane is 3.6 m, so a fine cell READS as 1.8 m and a block as **230 m**. WORLD's one scale number
(384 m a block, the 7/6 law's 1:4) disagrees with the map's own drawing by **1.67**: at 384 m a block the arterial is
66 m of asphalt and a ranch is 40 m wide. The board follows the lane (what the eye reads). At that ruler **the large
board is exactly one map block wide** (20 house tiles x 11.5 m = 230 m), which is the end state's 'the cut still reads
when a cell is a block of the bigger map': zoom out of a fight and you land on that one block. Not mine to settle:
the 384 m is WORLD's and RUN's travel clock; the drawing is the map painter's.

## THE ANALOG HORROR LINE (rule 20)
The same clean police car (his '9. Abandoned cards' #19) from the five houses' driveway is on all three boards, parked
straight and clean where nothing else is: at the kerb of the arterial, in a yard's drive, across two bays of the lot.

## WEAK, SAID
- The street block's middle is the arterial and its frontage only (the map puts no house within 50 m of it): the board
  is a road, two parking pads and dirt. That is the map's truth; the houses are off the board's edge.
- No back of a house exists: a house on the south side of a loop street still shows its front.
- The big store and the shop strip are COOK FOUR's warehouse, motel, gas station and corner shop laid side by side; a
  big box has no art of its own (COOK FOUR's hole).
- His soil #18 repeats per 1.44 m cell at 1:1 (round one's camouflage print, DIRECTION 10/10); 2x props on 1x ground
  (MIXELS) wait on DIRECTION's style guide field 1.
- The map's street-side grid seam COOK TWO measured on the old slices/fight_ground boards (a tan kerb line at row 770,
  the street band over the strip roof) lives in the PLACEHOLDER boards in slices/, which this lane may not write before
  his FINAL (rule 100). These new boards are laid from the map and carry neither.

## FOR COMBAT, AT HIS FINAL
The handover already carries the block (`CITYFIGHT_AT`); the board reader opens the cut of that block instead of
dealing a kind. The board's tile is the square 656 x 648 (COOK TWO's recipe cells), not the fight's 515 x 364: one
reader change, as round one said.

## GATES
REFERENCE CHECK 490/0. VOTE TAB: my card clean; its one red (two DYNASTY whys with no 'where') was on main before this
round. Full suite unmeasured (rule 13).
