# THE LEADER THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 6, 10/19/26)

Rule 115(a)(c)(h), rule 120(a)(d). Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 at Extra
(rule 116), opened by the coordinator (rule 112). The same direction as the raider again (round 5, this session): the
thug and the marksman he said YES to, the city not the Middle Ages.

## How Battle Brothers did it (rule 41)
records/target/bb/enemies.json, `brigand_leader`: the band's elite and its CAPTAIN (the Captain perk: the men near him
hold), the heaviest armour of the band (a Reinforced Mail Hauberk, Footman's Armor, LIGHT SCALE or Leather Scale Armor),
a kettle hat, a big weapon, a unique name; 'Brigand Leaders start appearing in the middle game... It's rare to see
simultaneously more than one. The Leader spawns in the very back and usually does not hurry to enter battle. They always
generate with unique names.' The lesson kept: THE ONE YOU REMEMBER, standing at the back, the heaviest of the band.

## Our skin, from the same city
- THE SCALE ARMOUR is a cuirass of LICENCE PLATES, cut and riveted in overlapping rows (a dead state's plates are free
  metal): the rows are geometry hanging like shingles (each tucked under the lip of the row above, 7 cm a row = 4 px),
  a plate's edge pressed in every 13 cm, offset half a plate on alternate rows; one plate in three the old faded teal
  (clay_teal 3), the rest bare aluminium (tape_grey 2), chosen per plate, never per pixel.
- A LONG BLACK LEATHER COAT to mid-calf worn OPEN (the V from the collarbone shows the plates), a high collar, the tails
  on the thigh bones (they swing on the walk). TRENCHCOATS ARE FOR BADASSES (8/27: 'killers... cowboy shit'): the
  captain is the band's killer, and the coat is the plain rest area the style guide asks for.
- THE CAPTAIN'S MARK: a BRASS GORGET at the throat (an officer's badge of rank; the faction's gold that the raider's
  shell bases carry too).
- NO HELMET: the face is the one you remember (PORTRAIT's modelled head through PORTRAIT's own tool on HEADS: slicked
  SILVER hair, a silver moustache, a scar on the cheek). Battle Brothers' kettle hat is the one piece left out, on
  purpose: the leader stands at the back and his face is his name.
- GUNS FIRST (rule 120(a)): a LEVER-ACTION RIFLE carried by the wrist of its stock, muzzle down (the butt, the receiver,
  the lever's loop, the barrel and the magazine tube under it, the fore-end): at 28 px he is the long gun hanging from a
  long coat. COMBAT owns whether the leader shoots.
- 8 materials: skin, eyes, the black (coat, trousers), boots and steel, aluminium plates, teal plates, brass, wood.

## The skin is the face's (rule 120(d))
skin_light 2 on the face and the hands, the same step; measured off the ID pass, pooled over the eight facings (the
ruler is in records/BOHEMIA_COOK3_THE_RAIDER_AGAIN_10_19_26.md): see the card below.

## The cycles (logged)
1. Slicked BLACK hair, plates 8.5 cm on 5.2 cm rows in one grey. The rig's up-face dust turned the black slick into a
   GREY HELMET (PORTRAIT's hair material is named 'buzz', so the rig's wear_by_material 'hair' share never reaches it),
   and the plates read as a grey KNIT at 1x (and mail is his NO).
2. Silver hair and moustache (pale hair keeps its read under the dust), licence-plate-sized plates with deeper edges in
   two colours; the trousers one black with the coat (a material freed for the teal). Eight facings: card 0 of 8 out,
   value span 165, skin dE 4.0 PASS.

## The card, the skin, the sheet (the full render, cycle 2)
The card on the S still, class person: 0 OF 8 OUT: long side 142, colours 1,325 vs 673, top 8 3.9%, value span 172,
saturation 0.13 (the vibrance down, his 9/23), light top minus bottom 53.2, edge -10.1, grain 1.52. Colours across the
set 35,600; the passing pose of Anim_0, frame 23. THE FACE IS THE BODY'S FACE: dE 5.3 PASS (face L* 61.3, hands 66.5;
597 face pixels, 220 hand and neck pixels over the eight facings); records/cook3/rig/leader_skin.json.
records/target/cook3/COOK3_THE_LEADER_THROUGH_THE_RIG.png: eight facings, the S and SE walk (6 keys = 2 beats at 120),
beside the game's flat leader (a gold coat painted flat, a grey cap) at 1:1 and 4x, the skin line under the card. 57 px
a metre, one pixel size, block 1; palette records/target/BOHEMIA_STYLE_PALETTE.json, every base colour a step of a role;
one light, the rig's sun upper left. VOTE: cook3-the-leader-through-the-rig-10-19.

## Findings
- FOR PORTRAIT: the head's hair material is named portrait_<who>_buzz for every cut; DIRECTION's rig gives a material
  whose name holds 'hair' only 15 percent of the dust (rig.wear_by_material), so a dark cut on your heads takes the full
  dust and greys to a helmet from the 45 degree camera (this leader's black slick, cycle 1). Naming it
  portrait_<who>_hair_<cut> would let the rig's own rule reach it.
- FOR COMBAT: the leader carries a lever-action in the picture (rule 120(a)); the BB lesson is the Captain perk (the men
  near him hold) and that he waits at the back.

REFERENCE CHECK: the twin is the game's own flat leader (records/cook3/enemy_tiers_repainted.png, cell 4); the thug and
marksman he voted up; PORTRAIT's modelled head; the card of numbers. No reference game.
