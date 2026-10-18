# COOK [the fight props through the rig] 10/18/26: FOUR THINGS A FIGHT TILE STANDS ON, MODELLED AT THE SOURCE

QUARTERMASTER 10/18 | cooking: a concrete jersey barrier | he owns: 24 tiles in 1 packs that match (20 approved, 4 never judged) | nearest: 3. Barricades and blockades#4 96x72 approved | verdict: COMPOSE BESIDE IT
QUARTERMASTER 10/18 | cooking: a dumpster | he owns: 16 tiles in 1 packs that match (14 approved, 2 never judged) | nearest: 14. Trash and junk props#3 96x86 approved | verdict: COMPOSE BESIDE IT
QUARTERMASTER 10/18 | cooking: a shopping cart | he owns: 0 tiles in 0 packs that match | nearest: 15. Street props#21 66x96 approved (the wire bin, the same wire) | verdict: OWNS ZERO, BUY OR COMMISSION
QUARTERMASTER 10/18 | cooking: a stack of tyres | he owns: 24 tiles in 1 packs that match (20 approved, 4 never judged) | nearest: 3. Barricades and blockades#5 96x85 approved | verdict: COMPOSE BESIDE IT
(the full lines are on the sheet, read from the index by tools/bohemia_quartermaster_line.py, never typed)

Rule 115a and his fourteenth votes (YES on the lamp, the gun and the wreck through the rig). Each prop committed the
moment its card passed (rule 116d): barrier 2a44469, dumpster 951fc7d, tyres 699c094b, cart 7c4c1b36, sheet and VOTE 11928908.

## WHAT WAS MADE
tools/bohemia_cook_model_props.py gained four builders (barrier, dumpster, cart, tyres) and two helpers (prism: a
section pulled along X; cut: a boolean chunk out); each model goes through tools/bohemia_direction_master_rig.py
unchanged (no overrides; zero breaks in every rig.json). 57 px a metre, the rig's one sun from the upper left,
DIRECTION's source palette.

| prop | size | materials | card | out |
|---|---|---|---|---|
| jersey barrier (cook_barrier) | 3.0 m, the real F-shape section | 4 | 2 of 8 | colours 2,196, value span 91 |
| dumpster (cook_dumpster) | 1.85 x 1.1 x 1.25 m front-load | 5 | 1 of 8 | grain 2.58 |
| shopping cart (cook_cart) | 1.0 m, wire at 2.2 cm | 5 | 1 of 8 | colours 636 (thin sprite) |
| tyres (cook_tyres) | 0.73 m tyres, two stacks and one rolled off | 4 | 2 of 8 | colours 882, value span 111 |

The odd thing on each (the guide's one asymmetric thing): the barrier's top corner broken off with rebar bent out; the
dumpster's right lid thrown back and the bin overflowing on that side; the cart dropped onto its missing front caster;
the tall stack's top tyre slid half off, black water standing in its well.

## THE LOOP (every cycle looked at, 3x)
- BARRIER: (1) bone-step concrete read tan and flat beside his grey, and a grime disc stood out of the foot like a
  shield; (2) grey, with the slots and the seams of a three-piece casting CUT so their dark is the model's own shadow,
  but nine splash stains along the foot read as polka dots; (3) one splash band on the lower slope.
- DUMPSTER: (1) pale ball bags, the top a solid slab, blood-red rust, a stain poking out under the body; (2) hollowed,
  lumpy bags with flat bottoms and gathered necks, orange rust, but the shut lid sloped the wrong way and sank inside
  the bin (a sign error on the rotation); (3) the lid on top, high at the back.
- TYRES: (1) donuts with a fist-sized hole, 93 px (under the 96 floor), tread blocks standing off as a dotted halo;
  (2) a 0.32 m hole, a third tyre on the ground, but the blocks still stood above the shoulder; (3) flush tread.
- CART: first pass read as a cart from all eight sides. A real 5 mm wire is a third of a pixel at 57 ppm and vanishes,
  so the wire is a puppet's 2.2 cm.

## FOUND, FOR DIRECTION (third lane to hit it, after COOK THREE and CHARACTER)
The source pass dusts every up-facing surface pale, so black rubber and black plastic read grey from 45 degrees (the
dumpster lid, the bags, the tyre tops) where his twins stay dark. No per-material opt-out exists; the rig was left
unchanged (zero breaks). A material flag that scales the dust (rubber, bin bags) is the fix at the source, and it is
DIRECTION's.

## THE SHEET
records/target/COOK_FIGHT_PROPS_THROUGH_THE_RIG.png (tools/bohemia_cook_props_through_the_rig_sheet.py fight): per row
the quartermaster's line, his tile at 1:1, mine at 1:1 on his cracked street tile, all eight facings; the truck
maquette beside the dumpster. VOTE: cook-fight-props-through-the-rig-10-18.

## WHAT IT DOES NOT CLAIM
Not placed on any fight board (COMBAT TWO owns the boards; rule 100: nothing to slices/, engine/ or the demo). Not
checked by the NOT VIBE CODED family. Puppet-maker's first pass: no stencil on the dumpster, no maker's mark on the
barrier. Nothing is final before his moodboard (rule 108).

REFERENCE CHECK: his tiles named above are the twins at 1:1; the palette is DIRECTION's; the card is the rig's. No
reference game. REUSE CHECK: the model pattern is last round's lamp/gun/wreck tool; the rig is the master rig; the
sheet is last round's sheet tool with a set name.
