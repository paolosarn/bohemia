# HOW THE PACK DID IT: THE SIX SUPPLIES (UI [icons at full pixels], 10/13/26; rule 100c, opens the round)

Read from his purchased props in reference/art_bank/prop/ (786 props, 33 pack families), the family the six supplies belong to.

## WHAT HIS PACKS ALREADY HOLD
Every one of the six exists in his packs as a finished object, so nothing is drawn (rule 108 round eleven: USE HIS PACKS, DO NOT IMITATE THEM):
| supply | A (leads) | B |
|---|---|---|
| batteries | pack_11_survival_props_045 (loose cells, 96x76) | pack_11_survival_props_044 (a battery bank, 90x96) |
| food | pack_11_survival_props_042 (a tin, 85x96) | pack_11_survival_props_035 (an open can with a spoon, 59x96) |
| meds | pack_12_weapons_and_supplies_030 (a first-aid bag, 96x94) | pack_11_survival_props_007 (a blue first-aid box, 90x96) |
| rounds | pack_12_weapons_and_supplies_018 (three cartridges, 50x96) | pack_11_survival_props_031 (an ammo can, 96x94) |
| tape | pack_11_survival_props_039 (a roll of duct tape, 96x86) | pack_12_weapons_and_supplies_027 (a roll, 96x88) |
| water | pack_11_survival_props_004 (a bottle, 46x96) | pack_16_loot_and_survival_props_032 (a bottle, 40x96) |

## THE NUMBERS (skills/bohemia-pixel-art/scripts/check.py, family prop, on his own tiles)
- SIZE: every prop is 96 on its long side; the short side runs 40 to 96. The floor for an icon (32x32) is met three times over.
- COLOURS: 2,362 to 5,627 per prop; the top eight carry 5.6 to 13.2%.
- VALUE SPAN 149 to 191; SATURATION 0.10 (tape) to 0.89 (cartridges); LIGHT from above, a little left (245 to 269 degrees).
- EDGE: a soft dark contour (edge -2.2 to +6.6); no black line. GRAIN 1.56 to 1.93 px a run. Stray pixels 5.6 to 9.5%. One pixel size, no banding.
- His own tiles come back OUT on a row sometimes (the cartridges: top eight 13.2, saturation 0.89; the A meds bag is clean); the skill says 6% of his do. A cut is his tile and is not edited to pass.

## WHAT THAT MEANS FOR THE BAR
- The old six were 10x10 grids at 3 phone pixels a cell: 100 cells, 4 to 6 colours each. His props carry 30 to 50 times the pixels.
- Shown at one art pixel to one phone pixel (his phone is 3 pixels a point), a 96-pixel prop is 32 points. Shrinking it is a resample (the skill's do-not list), so the bar does not shrink the art (rule 106); the bar makes room: the six move to a strip of glass under the bar, 40 points tall.
- Battle Brothers' world map keeps the company's supplies as small pictures with counts along its top bar and the company screen one press away; that is the shape kept here, at his packs' pixels.
