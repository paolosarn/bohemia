# COOK [props through the rig] 10/18/26: THE LAMP, THE GUN AND THE WRECK, MODELLED AT THE SOURCE

QUARTERMASTER 10/18 | cooking: a lamp post | he owns: 237 tiles in 13 packs that match (40 approved, 197 never judged) | nearest: 18. Light sources and fire barrels#3 57x96 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a)
QUARTERMASTER 10/18 | cooking: a gun | he owns: 40 tiles in 1 packs that match (37 approved, 3 never judged) | nearest: 12. Weapons and supplies#11 96x62 approved | verdict: COMPOSE BESIDE IT
QUARTERMASTER 10/18 | cooking: a wrecked car | he owns: 123 tiles in 4 packs that match (80 approved, 43 never judged) | nearest: 9. Abandoned cards#0 96x56 approved | verdict: COMPOSE BESIDE IT

Rule 115a (his 10/17: the truck and the robot are the look; his two NOs on the parts grammar). The redo of the archived
chat's round, whose three renders were lost uncommitted; this time each prop was committed the moment its card passed
(rule 116d): lamp a76d224, gun 11cf9e7, wreck b3349b6, sheet and grave 47e7de8.

## WHAT WAS MADE
tools/bohemia_cook_model_props.py builds three glTF models from nothing, DIRECTION's drum pattern (puppet shapes, every
base colour a step of records/target/BOHEMIA_STYLE_PALETTE.json, roughness 1, one asymmetric thing each, real metres),
and each goes through tools/bohemia_direction_master_rig.py unchanged (no --set, no overrides: zero breaks in every
rig.json). Pixel size 57 px a metre, the rig's one sun from the upper left, the palette file above.

| prop | size | materials | card | out |
|---|---|---|---|---|
| lamp post (records/target/master_rig/cook_lamp) | 3.2 m, 70 x 222 px | 5 (prop cap 5) | 2 of 8 | colours 888 (thin sprite), value span 115 |
| heavy machine gun on its tripod (cook_gun) | 1.75 m, 100 x 107 px | 5 | 2 of 8 | colours 408 (sparse sprite), light -3.6 (the dark gun over the can) |
| wreck, four-door sedan (cook_wreck) | 4.7 m, 342 px long | 7 (vehicle cap 8) | 2 of 8 | value span 111, grain 2.75 px |

The colour rows on the lamp and the gun are the card's 2,330 floor, which is his prop tiles' floor; the guide's
colour_floor_small (370 per 1,000 opaque px) is the honest bar for a thin sprite, and the rig's card does not read it
yet (DIRECTION's to wire, the same point COOK THREE found on the thug).

## THE LOOP (every cycle looked at, 3x)
- LAMP: (1) a 0.24 m rust cone read as a copper ball from 45 degrees and hid the bulb; (2) a dark shade, but a bulb inside
  a shade is never seen from 45 degrees up; (3) hung 16 cm under the rim, it clipped white at glow 9; (4) sodium step 3 at
  glow 1.4: an orange bulb. Then cut from eight materials to five (the guide's prop cap): still 2 of 8.
- GUN: (1) a 1.05 m pump shotgun: at true size a 60 x 6 px stick, 5 of 8 out, under the guide's prop floor 29 x 36. A gun
  that stands on a fight tile at true size is a mounted gun, and his canon has one: A MACHINE GUN IS THE GREATSWORD (9/24).
  (2) a light 1.3 m gun on a tripod: reads, but 5 of 8 out (thin, light from below off a pale can); (3) the heavy gun at
  its real 1.75 m with a long barrel, a darker can and darker gunmetal: 2 of 8.
- WRECK: (1) a toy van: the body 0.31 m off the ground over 0.33 m wheels, salmon square rust, the bonnet a plank;
  (2) a sedan's 1.42 m, the body down over bigger wheels with arches, the cabin tapered in plan and section, ragged rust
  stains, but the side glass buried in the tapered cabin; (3)-(5) the glass brought out and kept under the caved
  roofline on the far side.

## THE SHEET
records/target/COOK_PROPS_THROUGH_THE_RIG.png (tools/bohemia_cook_props_through_the_rig_sheet.py): per row the
quartermaster's line, his tile at 1:1, mine at 1:1 standing on his cracked street tile, all eight facings; the truck
maquette beside the wreck (style guide field 19 steps 2, 3, 6). One pixel size: everything at 1:1, the whole sheet
doubled. VOTE: cook-props-through-the-rig-10-18.

## THE GRAVE
The parts grammar's two tools, both grammars and both pipe folders: graveyard/the_parts_grammar_10_18_26/, post-mortem
graveyard/POSTMORTEM_THE_PARTS_GRAMMAR_10_18_26.txt. The quartermaster's line survives (never part of the grammar).

## WHAT IT DOES NOT CLAIM
Not hand-finished (the guide says props: none). Not checked by the NOT VIBE CODED family (PLUMBER's). The models are a
puppet-maker's first pass: no panel lines on the car, no perforations in the gun's jacket, the flyer has no print.
Nothing is final before his moodboard (rule 108); the old flat sprites stay in the game until each passes VOTE.

REFERENCE CHECK: his tiles named above are the twins at 1:1; the palette is DIRECTION's; the card is the rig's. No
reference game.
