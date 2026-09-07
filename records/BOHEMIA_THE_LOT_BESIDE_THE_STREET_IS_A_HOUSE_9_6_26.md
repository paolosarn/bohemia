# THE LOT BESIDE THE STREET IS SOMEBODY'S HOUSE
COOK (16, the Production Artist), VAMILY [combat ground], 9/6/26. Round 1.

## THE ROW
> the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus: house, yard,
> street, lot, cover that reads; a house with a backyard spans 1x2 (9/4 tile law 3d)

## MEASURED FIRST, AND IT CORRECTED THE GUESS I HAD FROM READING THE SOURCE
Decoding the combat module (it lives base64-encoded inside `COMBAT_B64`, which is why no
grep finds it) said the fight's tile bank had 8 kinds and no `lot`, so everything beyond the
sidewalk fell through to a flat colour. **That was wrong.** Measured in the fight's own
realm on the real surface — boot to play, start an encounter, read the floor the frame is
drawing (`tools/bohemia_combat_ground_probe_9_6_26.js`):

    851 visible cells, 100% of them drawing approved art. Nothing is a flat fill.

    lot 26.1%   road 26.1%   walk 17.4%   lane 8.7%   kerb/gutter/median 4.3% each

The decode had truncated the bank at a `};` inside it. **The board is not empty; it is a
street and nothing else.** Half of it is road and pavement, and the other quarter is `lot` —
one generic "somebody's ground" tile standing in for every house, yard and back lot in Las
Vegas. There was **no house kind, no yard kind and no wall kind on the combat board at all.**

That is exactly the gap clause 3d names: *"a combat ground tile at that size is a real canvas
on the 45-degree corpus: the house, the yard, the street, cover that reads."*

## AND IT COOKS NOTHING, WHICH IS THE PRECEDENT THIS ROW ALREADY HAS
The street under the fight was never painted either. v94
(`tools/bohemia_combat_street_tiles_patch.py`) lifted it out of the banks Paolo approved and
said so in capitals: *"NO NEW GRAPHIC PIXELS ARE COOKED… the run and the fight now stand on
the same street."* The same bank has everything this row needs, at exactly 44 px, the combat
tile size:

    HOUSE   roof_slope, roof_ridge, roof_eave, roof_hipTL/TR/BL/BR
    YARD    yard_0, yard_1, yard_2, dirt
    WALL    wall_0, wall_1, wall_2, wall_base

`banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt` — approved 7/28 ("mark it approved"),
picked again 7/29 over the master palette, byte-locked in the visual constitution, and it is
what the RUN ships. **So the fight stands on the same houses the walked city does.**

## THE REFERENCE CHECK IS THIS LANE'S OWN SHEET, SHIPPED FOR THIS ROW
`reference/library/tile-ground/` (TG-01…TG-07, 9/5). Taken structurally:

- **TG-02** — *"from above-at-an-angle a house is ROOF PLANES FIRST… at combat range the roof
  IS the house's ground read, and its ridge line gives the tile its orientation."*
  → the house kind is roof art, and it **never spins**: a ridge has a direction.
- **TG-03** — *"a Vegas yard is GRAVEL OR HARDPAN inside a block wall — no lawn in act 1 —
  the wall runs the tile's full edge, so a yard tile's cover story is its WALL, not its
  middle."* → yard is yard/dirt, and the property line is a real **wall column**, not a tint.
- **TG-01** — *"a Vegas lot is barely bigger than its house — 3,300–6,100 sq ft lots under
  2,000+ sq ft homes — so the HOUSE TILE is mostly roof with a thin apron, and a fat margin
  of ground around a house is a scale lie."* → one house tile and one yard tile per property.
- **clause 3d** — *"a house with a big backyard is now one by two tiles big."* → that is the
  property: a house row and a yard row, paired.

**Not taken this round:** TG-07's cover — a dead car, a dumpster, a porch pier breaking the
ground's silhouette at the tile edge. Cover is **props on** the ground rather than ground,
the approved wrecks live in a different bank, and half-placing them is worse than naming
them next.

## WHAT CHANGED, IN ONE PLACE
`streetKindAt` is untouched and still answers `lot` for the band beside the street. The paint
loop refines that to house / yard / wall **exactly where it already refines the lot's variant
index**, so the street above is byte-identical and only the lot band moves.

    lot  26.1%   ->   house 11.2%  +  yard 10.6%  +  wall 4.3%

A quarter of the combat board reads as somebody's property instead of one flat kind.

## AND THE PROBE HAD TO BE FIXED TWICE BEFORE IT COULD BE BELIEVED
1. It took `document.querySelector('canvas')` and got a **183×54 UI strip**, then reported
   the kind mix of a sliver and called it the floor. It takes the biggest canvas now
   (780×1354, 851 cells).
2. After the change it still said `lot` 26.1% on a build with no lot, because it stopped at
   `streetKindAt` instead of following the paint loop's refinement. **A probe that re-states
   the code instead of following it measures the old board.**

## PROOF
    node tools/bohemia_combat_ground_probe_9_6_26.js   the measurement above
    node gates/combat_floor_gate.js         13/0
    node gates/combat_pool_gate.js         101/0
    node gates/combat_entry_gate.js         36/0
    node gates/combat_scale_gate.js          7/0
    node gates/fight_floor_cache_gate.js    17/0   (the floor still composes once)
    node gates/alpha_loads_gate.js          20/0

## WHERE HE SEES IT
**COMBAT.** Start a fight and look either side of the road: roofs and gravel yards behind
block walls, instead of one repeating ground.

## WHAT IS LEFT
- **Cover that reads** (TG-07): props on the ground, from the approved wreck and street-prop
  banks, breaking the silhouette at the tile edge where they block. Round 2.
- **The 1.5–2 sprite-widths tile** is COMBAT's dial (TILE WIDTH in DEMO SETTINGS, clause 3d),
  not a cook: the law says the exact ratio is his, by eye.
